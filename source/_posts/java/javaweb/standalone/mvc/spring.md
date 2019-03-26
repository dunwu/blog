---
title: Spring面试题
date: 2018-07-02
categories:
- javaweb
tags:
- java
- javaweb
- mvc

---

# Spring 面试题

<!-- TOC depthFrom:2 depthTo:3 -->

- [IoC](#ioc)
    - [什么是控制反转(IoC)？什么是依赖注入？](#什么是控制反转ioc什么是依赖注入)
    - [Spring 中的 IoC](#spring-中的-ioc)
    - [BeanFactory 和 ApplicationContext 有什么区别？](#beanfactory-和-applicationcontext-有什么区别)
    - [Spring 有几种配置方式](#spring-有几种配置方式)
    - [Spring Bean 的生命周期](#spring-bean-的生命周期)
    - [Spring Bean 的作用域](#spring-bean-的作用域)
    - [Spring 框架中的单例 Beans 是线程安全的么？](#spring-框架中的单例-beans-是线程安全的么)
    - [Spring 中注入一个 Java Collection？](#spring-中注入一个-java-collection)
    - [自动装配模式](#自动装配模式)
- [AOP](#aop)
    - [什么是 AOP](#什么是-aop)
    - [AOP 的原理](#aop-的原理)
    - [动态代理](#动态代理)
    - [静态代理](#静态代理)

<!-- /TOC -->

## IoC

### 什么是控制反转(IoC)？什么是依赖注入？

IoC，是 Inversion of Control 的缩写，即控制反转。

- 上层模块不应该依赖于下层模块，它们共同依赖于一个抽象
- 抽象不能依赖于具体实现，具体实现依赖于抽象。

注：又称为依赖倒置原则。这是设计模式六大原则之一。

DI，是 Dependency Injection 的缩写，即依赖注入。

- 依赖注入是 IoC 的最常见形式。
- 容器全权负责的组件的装配，它会把符合依赖关系的对象通过 JavaBean 属性或者构造函数传递给需要的对象。

依赖注入三种形式：

1.  构造器注入
2.  Setter 方法注入
3.  接口注入

### Spring 中的 IoC

BeanFactory 是 Spring IoC 容器的具体实现，用来包装和管理前面提到的各种 bean。

BeanFactory 接口是 Spring IoC 容器的核心接口。

IOC:把对象的创建、初始化、销毁交给 spring 来管理，而不是由开发者控制，实现控制反转。

### BeanFactory 和 ApplicationContext 有什么区别？

BeanFactory 包含了种 bean 的定义，以便在接收到客户端请求时将对应的 bean 实例化。

BeanFactory 还能在实例化对象的时生成协作类之间的关系。

BeanFactory 还包含了 bean 生命周期的控制，调用客户端的初始化方法（initialization methods）和销毁方法（destruction methods）。

ApplicationContext 扩展了 BeanFactory：

1.  提供了支持国际化的文本消息
2.  统一的资源文件读取方式
3.  已在监听器中注册的 bean 的事件

三种较常见的 ApplicationContext 实现：

1.  ClassPathXmlApplicationContext - 从 classpath 的 XML 配置文件中读取上下文。
2.  FileSystemXmlApplicationContext - 由文件系统中的 XML 配置文件读取上下文。
3.  XmlWebApplicationContext - 由 Web 应用的 XML 文件读取上下文。

### Spring 有几种配置方式

1.  基于 XML 的配置
2.  基于注解的配置
3.  基于 Java 的配置

#### xml 配置方式

在 `<beans>` 元素下指定 schema 命令空间，如：context、beans、jdbc、tx、aop、mvc 等。

然后声明 bean 或命名空间下提供的能力。

#### Java 配置方式

使用 @Configuration

```java
@Configuration  
public class AppConfig{  
    @Bean  
    public MyService myService() {  
        return new MyServiceImpl();  
    }  
}
```

利用 AnnotationConfigApplicationContext 类进行实例化

```java
public static void main(String[] args) {  
    ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);  
    MyService myService = ctx.getBean(MyService.class);  
    myService.doStuff();  
}
```

#### 注解方式配置

开启注解扫描

```xml
<beans>  
    <context:annotation-config/>  
    <!-- bean definitions go here -->  
</beans>
```

引入 JavaBean 的注解

- @Required - 该注解应用于设值方法。
- @Autowired - 该注解应用于有值设值方法、非设值方法、构造方法和变量。
- @Qualifier - 该注解和@Autowired 注解搭配使用，用于消除特定 bean 自动装配的歧义。
- JSR-250 Annotations - Spring 支持基于 JSR-250 注解的以下注解，@Resource、@PostConstruct 和 @PreDestroy

### Spring Bean 的生命周期

BeanFactory 负责管理在 spring 容器中被创建的 bean 的生命周期。Bean 的生命周期由两组回调（call back）方法组成。

1.  初始化之后调用的回调方法。
2.  销毁之前调用的回调方法。

Spring 框架提供了以下四种方式来管理 bean 的生命周期事件：

1.  InitializingBean 和 DisposableBean 回调接口
2.  针对特殊行为的其他 Aware 接口
3.  Bean 配置文件中的 Custom init()方法和 destroy()方法
4.  @PostConstruct 和@PreDestroy 注解方式

### Spring Bean 的作用域

- singleton：这种 bean 范围是默认的，这种范围确保不管接受到多少个请求，每个容器中只有一个 bean 的实例，单例的模式由 bean factory 自身来维护。
- prototype：原形范围与单例范围相反，为每一个 bean 请求提供一个实例。
- request：在请求 bean 范围内会每一个来自客户端的网络请求创建一个实例，在请求完成以后，bean 会失效并被垃圾回收器回收。
- Session：与请求范围类似，确保每个 session 中有一个 bean 的实例，在 session 过期后，bean 会随之失效。
- global-session：global-session 和 Portlet 应用相关。当你的应用部署在 Portlet 容器中工作时，它包含很多 portlet。如果你想要声明让所有的 portlet 共用全局的存储变量的话，那么这全局变量需要存储在 global-session 中。

### Spring 框架中的单例 Beans 是线程安全的么？

Spring 框架并没有对单例 bean 进行任何多线程的封装处理。关于单例 bean 的线程安全和并发问题需要开发者自行去搞定。

最浅显的解决办法就是将多态 bean 的作用域由“singleton”变更为“prototype”。

### Spring 中注入一个 Java Collection？

Spring 提供了以下四种集合类的配置元素：

1.  `<list>` - 该标签用来装配可重复的 list 值。
2.  `<set>` - 该标签用来装配没有重复的 set 值。
3.  `<map>` - 该标签可用来注入键和值可以为任何类型的键值对。
4.  `<props>` - 该标签支持注入键和值都是字符串类型的键值对。

### 自动装配模式

- no：这是 Spring 框架的默认设置，在该设置下自动装配是关闭的，开发者需要自行在 bean 定义中用标签明确的设置依赖关系。
- byName：该选项可以根据 bean 名称设置依赖关系。当向一个 bean 中自动装配一个属性时，容器将根据 bean 的名称自动在在配置文件中查询一个匹配的 bean。如果找到的话，就装配这个属性，如果没找到的话就报错。
- byType：该选项可以根据 bean 类型设置依赖关系。当向一个 bean 中自动装配一个属性时，容器将根据 bean 的类型自动在在配置文件中查询一个匹配的 bean。如果找到的话，就装配这个属性，如果没找到的话就报错。
- constructor：造器的自动装配和 byType 模式类似，但是仅仅适用于与有构造器相同参数的 bean，如果在容器中没有找到与构造器参数类型一致的 bean，那么将会抛出异常。
- autodetect：该模式自动探测使用构造器自动装配或者 byType 自动装配。首先，首先会尝试找合适的带参数的构造器，如果找到的话就是用构造器自动装配，如果在 bean 内部没有找到相应的构造器或者是无参构造器，容器就会自动选择 byTpe 的自动装配方式。

## AOP

### 什么是 AOP

AOP 把软件系统分为两个部分：核心关注点和横切关注点。业务处理的主要流程是核心关注点，与之关系不大的部分是横切关注点。横切关注点的一个特点是，他们经常发生在核心关注点的多处，而各处都基本相似。比如权限认证、日志、事务处理。

Aop 的作用在于分离系统中的各种关注点，将核心关注点和横切关注点分离开来。正如 Avanade 公司的高级方案构架师 Adam Magee 所说，AOP 的核心思想就是“将应用程序中的商业逻辑同对其提供支持的通用服务进行分离。”

### AOP 的原理

实现 AOP 的技术，主要分为两大类：

1. 采用动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行；
2. 采用静态织入的方式，引入特定的语法创建“方面”，从而使得编译器可以在编译期间织入有关“方面”的代码。

### 动态代理

#### JDK

需要实现 InvocationHandler 接口。

#### CGLIB

### 静态代理

```java
public interface IPerson {
    public void doSomething();
}

public class Person implements IPerson {
    public void doSomething(){
        System.out.println("I want wo sell this house");
    }
}

public class PersonProxy {
    private IPerson iPerson;
    private final static Logger logger = LoggerFactory.getLogger(PersonProxy.class);
 
    public PersonProxy(IPerson iPerson) {
        this.iPerson = iPerson;
    }
    public void doSomething() {
        logger.info("Before Proxy");
        iPerson.doSomething();
        logger.info("After Proxy");
    }
     
    public static void main(String[] args) {
        PersonProxy personProxy = new PersonProxy(new Person());
        personProxy.doSomething();
    }
}
```
