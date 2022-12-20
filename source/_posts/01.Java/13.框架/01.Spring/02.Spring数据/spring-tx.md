---
title: spring-tx
date: 2020-08-05 09:28:40
categories:
  - Java
  - 框架
  - Spring
  - Spring数据
tags:
  - null
permalink: /pages/63965f/
---
# Spring 事务管理

Spring 针对 Java Transaction API (JTA)、JDBC、Hibernate 和 Java Persistence API(JPA) 等事务 API，实现了一致的编程模型，而 Spring 的声明式事务功能更是提供了极其方便的事务配置方式，配合 Spring Boot 的自动配置，大多数 Spring Boot 项目只需要在方法上标记 @Transactional 注解，即可一键开启方法的事务性配置。

## Spring 事务最佳实践

![img](https://raw.githubusercontent.com/dunwu/images/dev/snap/20200805171418.png)

### Spring 事务未生效

使用 `@Transactional` 注解开启声明式事务时， 最容易忽略的问题是，很可能事务并没有生效。

`@Transactional` 生效原则：

#### @Transactional 方法必须是 public

原则一：除非特殊配置（比如使用 AspectJ 静态织入实现 AOP），否则**只有定义在 `public` 方法上的 `@Transactional` 才能生效**。原因是，Spring 默认通过动态代理的方式实现 AOP，对目标方法进行增强，private 方法无法代理到，Spring 自然也无法动态增强事务处理逻辑。

【示例】错误使用 `@Transactional` 案例一

```java
	@Transactional
	void createUserPrivate(UserEntity entity) {
		userRepository.save(entity);
		if (entity.getName().contains("test")) { throw new RuntimeException("invalid username!"); }
	}

	//私有方法
	public int createUserWrong1(String name) {
		try {
			this.createUserPrivate(new UserEntity(name));
		} catch (Exception ex) {
			log.error("create user failed because {}", ex.getMessage());
		}
		return userRepository.findByName(name).size();
	}
```

当传入名为 test 的用户实体，会抛出异常，但 `@Transactional` 未生效，不会触发回滚。

#### 必须通过 Spring 注入的 Bean 进行调用

原则二：**必须通过代理过的类从外部调用目标方法才能生效**。

【示例】错误使用 `@Transactional` 案例二

```java
	//自调用
	public int createUserWrong2(String name) {
		try {
			this.createUserPublic(new UserEntity(name));
		} catch (Exception ex) {
			log.error("create user failed because {}", ex.getMessage());
		}
		return userRepository.findByName(name).size();
	}

	//可以传播出异常
	@Transactional
	public void createUserPublic(UserEntity entity) {
		userRepository.save(entity);
		if (entity.getName().contains("test")) { throw new RuntimeException("invalid username!"); }
	}
```

当传入名为 test 的用户实体，会抛出异常，但 `@Transactional` 未生效，不会触发回滚。

说明：Spring 通过 AOP 技术对方法进行字节码增强，要调用增强过的方法必然是调用代理后的对象。

### 事务虽然生效但未回滚

通过 AOP 实现事务处理可以理解为，使用 `try…catch…` 来包裹标记了 `@Transactional` 注解的方法，当方法出现了异常并且满足**一定条件**的时候，在 `catch` 里面我们可以设置事务回滚，没有异常则直接提交事务。

“一定条件”，主要包括两点：

第一，只有异常传播出了标记了 @Transactional 注解的方法，事务才能回滚。在 Spring 的 TransactionAspectSupport 里有个 invokeWithinTransaction 方法，里面就是处理事务的逻辑。

第二，默认情况下，**出现 RuntimeException（非受检异常）或 Error 的时候，Spring 才会回滚事务**。

```java
@Service
@Slf4j
public class UserService {

	@Autowired
	private UserRepository userRepository;

	//异常无法传播出方法，导致事务无法回滚
	@Transactional
	public void createUserWrong1(String name) {
		try {
			userRepository.save(new UserEntity(name));
			throw new RuntimeException("error");
		} catch (Exception ex) {
			log.error("create user failed", ex);
		}
	}

	//即使出了受检异常也无法让事务回滚
	@Transactional
	public void createUserWrong2(String name) throws IOException {
		userRepository.save(new UserEntity(name));
		otherTask();
	}

	//因为文件不存在，一定会抛出一个IOException
	private void otherTask() throws IOException {
		Files.readAllLines(Paths.get("file-that-not-exist"));
	}

}
```

在 createUserWrong1 方法中会抛出一个 RuntimeException，但由于方法内 catch 了所有异常，异常无法从方法传播出去，事务自然无法回滚。

在 createUserWrong2 方法中，注册用户的同时会有一次 otherTask 文件读取操作，如果文件读取失败，我们希望用户注册的数据库操作回滚。虽然这里没有捕获异常，但因为 otherTask 方法抛出的是受检异常，createUserWrong2 传播出去的也是受检异常，事务同样不会回滚。

【解决方案一】如果你希望自己捕获异常进行处理的话，也没关系，**可以手动设置 `TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();` 让当前事务处于回滚状态**：

```java
@Transactional
public void createUserRight1(String name) {
   try {
      userRepository.save(new UserEntity(name));
      throw new RuntimeException("error");
   } catch (Exception ex) {
      log.error("create user failed", ex);
      TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
   }
}
```

【解决方案二】在注解中声明 `@Transactional(rollbackFor = Exception.class)`，期望遇到所有的 Exception 都回滚事务（来突破默认不回滚受检异常的限制）：

```java
@Transactional(rollbackFor = Exception.class)
public void createUserRight2(String name) throws IOException {
   userRepository.save(new UserEntity(name));
   otherTask();
}
```

### 细化事务传播方式

如果方法涉及多次数据库操作，并希望将它们作为独立的事务进行提交或回滚，那么
我们需要考虑进一步细化配置事务传播方式，也就是 `@Transactional` 注解的 `Propagation` 属性。

```java
/**
 * {@link Propagation#REQUIRES_NEW} 表示执行到这个方法时需要开启新的事务，并挂起当前事务
 */
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void createSubUserWithExceptionRight(UserEntity entity) {
   log.info("createSubUserWithExceptionRight start");
   userRepository.save(entity);
   throw new RuntimeException("invalid status");
}
```

## 参考资料

- [《Java 业务开发常见错误 100 例》](https://time.geekbang.org/column/intro/100047701)
