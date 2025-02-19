---
title: 《极客时间教程 - 玩转 Spring 全家桶》笔记
date: 2023-07-29 15:25:09
order: 01
categories:
  - 笔记
  - Java
tags:
  - Java
  - 框架
  - Spring
  - SpringBoot
  - SpringCloud
permalink: /pages/6377841a/
---

# 《极客时间教程 - 玩转 Spring 全家桶》笔记

## 第一章：初识 Spring (4 讲)

### 01 | Spring 课程介绍

### 02 | 一起认识 Spring 家族的主要成员

Spring Framework - 用于构建企业级应用的轻量级一站式解决方案

Spring Boot - 快速构建基于 Spring 的应用程序

Spring Cloud - 简化分布式系统的开发

### 03 | 跟着 Spring 了解技术趋势

略

### 04 | 编写你的第一个 Spring 程序

略

## 第二章：JDBC 必知必会 (10 讲)

### 05 | 如何配置单数据源

#### 直接配置所需的 Bean

数据源相关

- DataSource（根据选择的连接池实现决定）

事务相关（可选）

- PlatformTransactionManager（DataSourceTransactionManager）
- TransactionTemplate

操作相关（可选）

- JdbcTemplate

#### Spring Boot 做了哪些配置

DataSourceAutoConfiguration

- 配置 DataSource

DataSourceTransactionManagerAutoConfiguration

- 配置 DataSourceTransactionManager

JdbcTemplateAutoConfiguration

- 配置 JdbcTemplate

符合条件时才进行配置

#### 数据源相关配置属性

通用

- `spring.datasource.url=jdbc:mysql://localhost/test`
- `spring.datasource.username=dbuser`
- `spring.datasource.password=dbpass`
- `spring.datasource.driver-class-name=com.mysql.jdbc.Driver`（可选）

初始化内嵌数据库

- `spring.datasource.initialization-mode=embedded|always|never`
- spring.datasource.schema 与 spring.datasource.data 确定初始化 SQL ⽂文件
- `spring.datasource.platform=hsqldb | h2 | oracle | mysql | postgresql`（与前者对应）

### 06 | 如何配置多数据源

#### 配置多数据源的注意事项

不同数据源的配置要分开

关注每次使用的数据源

- 有多个 DataSource 时系统如何判断
- 对应的设施（事务、ORM 等）如何选择 DataSource

#### Spring Boot 中的多数据源配置

手工配置两组 DataSource 及相关内容

与 Spring Boot 协同工作（二选一）

- 配置@Primary 类型的 Bean
- 排除 Spring Boot 的自动配置
- DataSourceAutoConfiguration
- DataSourceTransactionManagerAutoConfiguration
- JdbcTemplateAutoConfiguration

### 07 | 那些好用的连接池们：HikariCP

#### 在 Spring Boot 中的配置

Spring Boot 2.x

- 默认使用 HikariCP
- 配置 spring.datasource.hikari.\* 配置

Spring Boot 1.x

- 默认使用 Tomcat 连接池，需要移除 tomcat-jdbc 依赖
- spring.datasource.type=com.zaxxer.hikari.HikariDataSource

#### 常用 HikariCP 配置参数

常用配置

- spring.datasource.hikari.maximumPoolSize=10
- spring.datasource.hikari.minimumIdle=10
- spring.datasource.hikari.idleTimeout=600000
- spring.datasource.hikari.connectionTimeout=30000
- spring.datasource.hikari.maxLifetime=1800000

其他配置详见 HikariCP 官网

- https://github.com/brettwooldridge/HikariCP

### 08 | 那些好用的连接池们：Alibaba Druid

#### 数据源配置

直接配置 DruidDataSource

通过 druid-spring-boot-starter

- `spring.datasource.druid.*`

Filter 配置

- spring.datasource.druid.filters=stat,config,wall,log4j （全部使用默认值）

密码加密

- `spring.datasource.password=<加密密码>`
- `spring.datasource.druid.filter.config.enabled=true`
- `spring.datasource.druid.connection-properties=config.decrypt=true;config.decrypt.key=<public-key>`

SQL 防注入

- `spring.datasource.druid.filter.wall.enabled=true`
- `spring.datasource.druid.filter.wall.db-type=h2`
- `spring.datasource.druid.filter.wall.config.delete-allow=false`
- `spring.datasource.druid.filter.wall.config.drop-table-allow=false`

#### Druid Filter

- 用于定制连接池操作的各种环节
- 可以继承 FilterEventAdapter 以便方便地实现 Filter
- 修改 META-INF/druid-filter.properties 增加 Filter 配置

### 09 | 如何通过 Spring JDBC 访问数据库

#### Spring 的 JDBC 操作类

spring-jdbc

- core，JdbcTemplate 等相关核心接口和类
- datasource，数据源相关的辅助类
- object，将基本的 JDBC 操作封装成对象
- support，错误码等其他辅助工具

#### 常用的 Bean 注解

通过注解定义 Bean

- `@Component`
- `@Repository`
- `@Service`
- `@Controller`
- `@RestController`

#### 简单的 JDBC 操作

`JdbcTemplate`

- `query`
- `queryForObject`
- `queryForList`
- `update`
- `execute`

#### SQL 批处理

`JdbcTemplate`

- `batchUpdate`
- `BatchPreparedStatementSetter`

`NamedParameterJdbcTemplate`

- `batchUpdate`
- `SqlParameterSourceUtils.createBatch`

### 10 | 什么是 Spring 的事务抽象（上）

### 11 | 什么是 Spring 的事务抽象（下）

#### Spring 的事务抽象

一致的事务模型

- JDBC/Hibernate/myBatis
- DataSource/JTA

#### 事务抽象的核心接口

PlatformTransactionManager

- DataSourceTransactionManager
- HibernateTransactionManager
- JtaTransactionManager

TransactionDefinition

- Propagation
- Isolation
- Timeout
- Read-only status

#### 事务传播特性

| 传播性                    | 值  | 描述                                 |
| ------------------------- | --- | ------------------------------------ |
| PROPAGATION_REQUIRED      | 0   | 当前有事务就用当前的，没有就用新的   |
| PROPAGATION_SUPPORTS      | 1   | 事务可有可无，不是必须的             |
| PROPAGATION_MANDATORY     | 2   | 当前一定要有事务，不然就抛异常       |
| PROPAGATION_REQUIRES_NEW  | 3   | 无论是否有事务，都起个新的事务       |
| PROPAGATION_NOT_SUPPORTED | 4   | 不支持事务，按非事务方式运行         |
| PROPAGATION_NEVER         | 5   | 不支持事务，如果有事务则抛异常       |
| PROPAGATION_NESTED        | 6   | 当前有事务就在当前事务里再起一个事务 |

#### 事务隔离特性

| 隔离性                     | 值  | 脏读 | 不可重复读 | 幻读 |
| -------------------------- | --- | ---- | ---------- | ---- |
| ISOLATION_READ_UNCOMMITTED | 1   | ✔️️️ | ✔️️️       | ✔️️️ |
| ISOLATION_READ_COMMITTED   | 2   | ❌   | ✔️️️       | ✔️️️ |
| ISOLATION_REPEATABLE_READ  | 3   | ❌   | ❌         | ✔️️️ |
| ISOLATION_SERIALIZABLE     | 4   | ❌   | ❌         | ❌   |

#### 编程式事务

TransactionTemplate

- TransactionCallback
- TransactionCallbackWithoutResult

PlatformTransactionManager

- 可以传入 TransactionDefinition 进行定义

#### 声明式事务

开启事务注解的方式

- `@EnableTransactionManagement`
- `<tx:annotation-driven/>`

一些配置

- `proxyTargetClass`
- `mode`
- `order`

`@Transactional`

- `transactionManager`
- `propagation`
- `isolation`
- `timeout`
- `readOnly`
- 怎么判断回滚

### 12 | 了解 Spring 的 JDBC 异常抽象

#### Spring 的 JDBC 异常抽象

Spring 会将数据操作的异常转换为 DataAccessException

无论使用何种数据访问方式，都能使用一样的异常

#### Spring 是怎么认识那些错误码的

通过 SQLErrorCodeSQLExceptionTranslator 解析错误码

ErrorCode 定义

- org/springframework/jdbc/support/sql-error-codes.xml
- Classpath 下的 sql-error-codes.xml

### 13 | 课程答疑（上）

略

### 14 | 课程答疑（下）

略

## 第三章：O/R Mapping 实践 (9 讲)

### 15 | 认识 Spring Data JPA

#### Java Persistence API

JPA 为对象关系映射提供了一种基于 POJO 的持久化模型

- 简化数据持久化代码的开发工作
- 为 Java 社区屏蔽不同持久化 API 的差异

#### Spring Data

在保留底层存储特性的同时，提供相对一致的、基于 Spring 的编程模型

主要模块

- Spring Data Commons
- Spring Data JDBC
- Spring Data JPA
- Spring Data Redis
- ……

### 16 | 定义 JPA 的实体对象

#### 常用 JPA 注解

实体

- @Entity、@MappedSuperclass
- @Table(name)

主键

- @Id
- @GeneratedValue(strategy, generator)
- @SequenceGenerator(name, sequenceName)

映射

- @Column(name, nullable, length, insertable, updatable)
- @JoinTable(name)、@JoinColumn(name)

关系

- @OneToOne、@OneToMany、@ManyToOne、@ManyToMany
- @OrderBy

#### Lombok

Project Lombok 能够自动嵌入 IDE 和构建工具，提升开发效率

常用功能

- @Getter / @Setter
- @ToString
- @NoArgsConstructor / @RequiredArgsConstructor / @AllArgsConstructor
- @Data
- @Builder
- @Slf4j / @CommonsLog / @Log4j2

### 17 | 开始我们的线上咖啡馆实战项目：SpringBucks

略

### 18 | 通过 Spring Data JPA 操作数据库

#### Repository

@EnableJpaRepositories

Repository<T, ID> 接口

- CrudRepository<T, ID>
- PagingAndSortingRepository<T, ID>
- JpaRepository<T, ID>

#### 定义查询

根据方法名定义查询

- `find…By… / read…By… / query…By… / get…By…`
- `count…By…`
- `…OrderBy…[Asc / Desc]`
- `And / Or / IgnoreCase`
- `Top / First / Distinct`

#### 分页查询

- `PagingAndSortingRepository<T, ID>`
- `Pageable / Sort`
- `Slice<T> / Page<T>`

### 19 | Spring Data JPA 的 Repository 是怎么从接口变成 Bean 的

#### Repository Bean 是如何创建的

JpaRepositoriesRegistrar

- 激活了 @EnableJpaRepositories
- 返回了 JpaRepositoryConfigExtension

RepositoryBeanDefinitionRegistrarSupport.registerBeanDefinitions

- 注册 Repository Bean（类型是 JpaRepositoryFactoryBean）

RepositoryConfigurationExtensionSupport.getRepositoryConfigurations

- 取得 Repository 配置

JpaRepositoryFactory.getTargetRepository

- 创建了 Repository

#### 接口中的方法是如何被解释的

RepositoryFactorySupport.getRepository 添加了 Advice

- DefaultMethodInvokingMethodInterceptor
- QueryExecutorMethodInterceptor

AbstractJpaQuery.execute 执行具体的查询

语法解析在 Part 中

### 20 | 通过 MyBatis 操作数据库

在 Spring 中使用 MyBatis

- MyBatis Spring Adapter（https://github.com/mybatis/spring）
- MyBatis Spring-Boot-Starter（https://github.com/mybatis/spring-boot-starter）

简单配置

- mybatis.mapper-locations = classpath*:mapper/\*\*/*.xml
- mybatis.type-aliases-package = 类型别名的包名
- mybatis.type-handlers-package = TypeHandler 扫描包名
- mybatis.configuration.map-underscore-to-camel-case = true

Mapper 的定义与扫描

- @MapperScan 配置扫描位置
- @Mapper 定义接口
- 映射的定义—— XML 与注解

### 21 | 让 MyBatis 更好用的那些工具：MyBatis Generator

MyBatis Generator（http://www.mybatis.org/generator/）

### 22 | 让 MyBatis 更好用的那些工具：MyBatis PageHelper

MyBatis PageHepler（https://pagehelper.github.io）

### 23 | SpringBucks 实战项目进度小结

略

## 第四章：NoSQL 实践 (7 讲)

### 24 | 通过 Docker 辅助开发

#### Docker 常用命令

镜像相关

- `docker pull <image>`
- `docker search <image>`

容器相关

- `docker run`
- `docker start/stop <容器名>`
- `docker ps <容器名>`
- `docker logs <容器名>`

#### docker run 的常用选项

`docker run [OPTIONS] IMAGE [COMMAND] [ARG…]`

选项说明

- -d，后台运行容器
- -e，设置环境变量
- --expose / -p 宿主端口:容器端口
- --name，指定容器名称
- --link，链接不同容器
- -v 宿主目录:容器目录，挂载磁盘卷

#### 国内 Docker 镜像配置

官方 Docker Hub

- https://hub.docker.com

官方镜像

- 镜像 https://www.docker-cn.com/registry-mirror
- 下载 https://www.docker-cn.com/get-docker

阿里云镜像

- https://dev.aliyun.com

### 25 | 在 Spring 中访问 MongoDB

#### Spring 对 MongoDB 的支持

- Spring Data MongoDB
  - MongoTemplate
  - Repository 支持

#### Spring Data MongoDB 的基本用法

注解

- @Document
- @Id

MongoTemplate

- save / remove
- Criteria / Query / Update

#### Spring Data MongoDB 的 Repository

`@EnableMongoRepositories`

对应接口

- `MongoRepository<T, ID>`
- `PagingAndSortingRepository<T, ID>`
- `CrudRepository<T, ID>`

### 26 | 在 Spring 中访问 Redis

#### Spring 对 Redis 的支持

- Spring Data Redis
  - 支持的客户端 Jedis / Lettuce
  - RedisTemplate
  - Repository 支持

#### Jedis 客户端的简单使用

- Jedis 不是线程安全的
- 通过 JedisPool 获得 Jedis 实例
- 直接使用 Jedis 中的方法

### 27 | Redis 的哨兵与集群模式

- JedisSentinelPool
- JedisCluster

### 28 | 了解 Spring 的缓存抽象

#### Spring 的缓存抽象

为不同的缓存提供一层抽象

- 为 Java 方法增加缓存，缓存执行结果
- 支持 ConcurrentMap、EhCache、Caffeine、JCache（JSR-107）
- 接口
  - `org.springframework.cache.Cache`
  - `org.springframework.cache.CacheManager`

#### 基于注解的缓存

@EnableCaching

- @Cacheable
- @CacheEvict
- @CachePut
- @Caching
- @CacheConfig

### 29 | Redis 在 Spring 中的其他用法

#### 与 Redis 建立连接

配置连接工厂

- LettuceConnectionFactory 与 JedisConnectionFactory
  - RedisStandaloneConfiguration
  - RedisSentinelConfiguration
  - RedisClusterConfiguration

#### 读写分离

Lettuce 内置支持读写分离

- 只读主、只读从
- 优先读主、优先读从

LettuceClientConfiguration

LettucePoolingClientConfiguration

LettuceClientConfigurationBuilderCustomizer

#### RedisTemplate

RedisTemplate<K, V>

- opsForXxx()

StringRedisTemplate

#### Redis Repository

实体注解

- @RedisHash
- @Id
- @Indexed

#### 处理不同类型数据源的 Repository

如何区分这些 Repository

- 根据实体的注解
- 根据继承的接口类型
- 扫描不同的包

### 30 | SpringBucks 实战项目进度小结

略

## 第五章：数据访问进阶 (8 讲)

### 31 | Project Reactor 介绍（上）

### 32 | Project Reactor 介绍（下）

一些核心的概念

Operators - Publisher / Subscriber

- Nothing Happens Until You subscribe()
- Flux [ 0..N ] - onNext()、onComplete()、onError()
- Mono [ 0..1 ] - onNext()、onComplete()、onError()

Backpressure

- Subscription
- onRequest()、onCancel()、onDispose()

线程调度 Schedulers

- immediate() / single() / newSingle()
- elastic() / parallel() / newParallel()

错误处理

- onError / onErrorReturn / onErrorResume
- doOnError / doFinally

### 33 | 通过 Reactive 的方式访问 Redis

#### Spring Data Redis

Lettuce 能够支持 Reactive 方式

Spring Data Redis 中主要的支持

- ReactiveRedisConnection
- ReactiveRedisConnectionFactory
- ReactiveRedisTemplate
- opsForXxx()

### 34 | 通过 Reactive 的方式访问 MongoDB

#### Spring Data MongoDB

MongoDB 官方提供了支持 Reactive 的驱动

- mongodb-driver-reactivestreams

Spring Data MongoDB 中主要的支持

- ReactiveMongoClientFactoryBean
- ReactiveMongoDatabaseFactory
- ReactiveMongoTemplate

### 35 | 通过 Reactive 的方式访问 RDBMS

#### Spring Data R2DBC

R2DBC （https://spring.io/projects/spring-data-r2dbc）

- Reactive Relational Database Connectivity

支持的数据库

- Postgres（io.r2dbc:r2dbc-postgresql）
- H2（io.r2dbc:r2dbc-h2）
- Microsoft SQL Server（io.r2dbc:r2dbc-mssql）

一些主要的类

- ConnectionFactory
- DatabaseClient
  - execute().sql(SQL)
  - inTransaction(db -> {})
- R2dbcExceptionTranslator
  - SqlErrorCodeR2dbcExceptionTranslator

R2DBC Repository 支持

一些主要的类

- @EnableR2dbcRepositories
- ReactiveCrudRepository<T, ID>
- @Table / @Id
- 其中的方法返回都是 Mono 或者 Flux
- 自定义查询需要自己写 @Query

### 36 | 通过 AOP 打印数据访问层的摘要（上）

### 37 | 通过 AOP 打印数据访问层的摘要（下）

#### Spring AOP 的一些核心概念

| 概念         | 含义                                                   |
| ------------ | ------------------------------------------------------ |
| Aspect       | 切面                                                   |
| Join         | Point 连接点，Spring AOP 里总是代表一次方法执行        |
| Advice       | 通知，在连接点执行的动作                               |
| Pointcut     | 切入点，说明如何匹配连接点                             |
| Introduction | 引入，为现有类型声明额外的方法和属性                   |
| Target       | object 目标对象                                        |
| AOP proxy    | AOP 代理对象，可以是 JDK 动态代理，也可以是 CGLIB 代理 |
| Weaving      | 织入，连接切面与目标对象或类型创建代理的过程           |

#### 常用注解

- @EnableAspectJAutoProxy
- @Aspect
- @Pointcut
- @Before
- @After / @AfterReturning / @AfterThrowing
- @Around
- @Order

#### 如何打印 SQL

HikariCP

- P6SQL，https://github.com/p6spy/p6spy

Alibaba Druid

- 内置 SQL 输出
- https://github.com/alibaba/druid/wiki/Druid中使⽤用log4j2进⾏行行⽇日志输出

### 38 | SpringBucks 实战项目进度小结

略

## 第六章：Spring MVC 实践 (14 讲)

### 39 | 编写第一个 Spring MVC Controller

### 认识 Spring MVC

DispatcherServlet

- Controller
- xxxResolver
- ViewResolver
- HandlerExceptionResolver
- MultipartResolver
- HandlerMapping

### Spring MVC 中的常⽤用注解

- @Controller
- @RestController
- @RequestMapping
- @GetMapping / @PostMapping
- @PutMapping / @DeleteMapping
- @RequestBody / @ResponseBody / @ResponseStatus

### 40 | 理解 Spring 的应用上下文

### Spring 的应用程序上下文

**关于上下文常用的接口**

- BeanFactory
- DefaultListableBeanFactory
- ApplicationContext
- ClassPathXmlApplicationContext
- FileSystemXmlApplicationContext
- AnnotationConfigApplicationContext
- WebApplicationContext

### 41 | 理解请求的处理机制

一个请求的大致处理流程

绑定一些 Attribute

- WebApplicationContext / LocaleResolver / ThemeResolver

处理 Multipart

- 如果是，则将请求转为 MultipartHttpServletRequest

Handler 处理

- 如果找到对应 Handler，执行 Controller 及前后置处理器逻辑处理返回的 Model ，呈现视图

### 42 | 如何定义处理方法（上）

### 定义映射关系

@Controller

@RequestMapping

- path / method 指定映射路路径与⽅方法
- params / headers 限定映射范围
- consumes / produces 限定请求与响应格式

一些快捷方式

- @RestController
- @GetMapping / @PostMapping / @PutMapping / @DeleteMapping / @PatchMapping

### 定义处理方法

- @RequestBody / @ResponseBody / @ResponseStatus
- @PathVariable / @RequestParam / @RequestHeader
- HttpEntity / ResponseEntity

### 定义类型转换

自己实现 WebMvcConfigurer

- Spring Boot 在 WebMvcAutoConfiguration 中实现了一个
- 添加自定义的 Converter
- 添加自定义的 Formatter

### 定义校验

- 通过 Validator 对绑定结果进行校验
  - Hibernate Validator
- @Valid 注解
- BindingResult

### Multipart 上传

- 配置 MultipartResolver
- Spring Boot 自动配置 MultipartAutoConfiguration
- 支持类型 multipart/form-data
- MultipartFile 类型

### 43 | 如何定义处理方法（下）

### 44 | Spring MVC 中的视图解析机制（上）

### 45 | Spring MVC 中的视图解析机制（下）

#### 视图解析的实现基础

ViewResolver 与 View 接口

- AbstractCachingViewResolver
- UrlBasedViewResolver
- FreeMarkerViewResolver
- ContentNegotiatingViewResolver
- InternalResourceViewResolver

#### DispatcherServlet 中的视图解析逻辑

- initStrategies()
  - initViewResolvers() 初始化了了对应 ViewResolver
- doDispatch()
  - processDispatchResult()
    - 没有返回视图的话，尝试 RequestToViewNameTranslator
    - resolveViewName() 解析 View 对象

使用 @ResponseBody 的情况

- 在 HandlerAdapter.handle() 的中完成了 Response 输出
  - `RequestMappingHandlerAdapter.invokeHandlerMethod()`
    - `HandlerMethodReturnValueHandlerComposite.handleReturnValue()`
      - `RequestResponseBodyMethodProcessor.handleReturnValue()`

#### 重定向

两种不同的重定向前缀

- `redirect:`
- `forward:`

### 46 | Spring MVC 中的常用视图（上）

#### Spring MVC 支持的视图

支持的视图列表

- https://docs.spring.io/spring/docs/5.1.5.RELEASE/spring-frameworkreference/web.html#mvc-view
- Jackson-based JSON / XML
- Thymeleaf & FreeMarker

#### 配置 MessageConverter

- 通过 WebMvcConfigurer 的 configureMessageConverters()
- Spring Boot 自动查找 HttpMessageConverters 进行注册

#### Spring Boot 对 Jackson 的支持

- JacksonAutoConfiguration
  - Spring Boot 通过 @JsonComponent 注册 JSON 序列化组件
  - Jackson2ObjectMapperBuilderCustomizer
- JacksonHttpMessageConvertersConfiguration
  - 增加 jackson-dataformat-xml 以支持 XML 序列化

### 47 | Spring MVC 中的常用视图（下）

#### 使用 Thymeleaf

添加 Thymeleaf 依赖

- org.springframework.boot:spring-boot-starter-thymeleaf

Spring Boot 的自动配置

- `ThymeleafAutoConfiguration`
  - `ThymeleafViewResolver`

##### Thymeleaf 的一些默认配置

- `spring.thymeleaf.cache=true`
- `spring.thymeleaf.check-template=true`
- `spring.thymeleaf.check-template-location=true`
- `spring.thymeleaf.enabled=true`
- `spring.thymeleaf.encoding=UTF-8`
- `spring.thymeleaf.mode=HTML`
- `spring.thymeleaf.servlet.content-type=text/html`
- `spring.thymeleaf.prefix=classpath:/templates/`
- `spring.thymeleaf.suffix=.html`

### 48 | 静态资源与缓存

#### Spring Boot 中的静态资源配置

核心逻辑

- WebMvcConfigurer.addResourceHandlers()

常用配置

- spring.mvc.static-path-pattern=/\*\*
- spring.resources.static-locations=classpath:/META-INF/
  resources/,classpath:/resources/,classpath:/static/,classpath:/public/

#### Spring Boot 中的缓存配置

常用配置（默认时间单位都是秒）

- ResourceProperties.Cache
- spring.resources.cache.cachecontrol.max-age=时间
- spring.resources.cache.cachecontrol.no-cache=true/false
- spring.resources.cache.cachecontrol.s-max-age=时间

### 49 | Spring MVC 中的异常处理机制

#### Spring MVC 的异常解析

核心接口

- HandlerExceptionResolver

实现类

- SimpleMappingExceptionResolver
- DefaultHandlerExceptionResolver
- ResponseStatusExceptionResolver
- ExceptionHandlerExceptionResolver

#### 异常处理方法

处理方法

- @ExceptionHandler

添加位置

- @Controller / @RestController
- @ControllerAdvice / @RestControllerAdvice

### 50 | 了解 Spring MVC 的切入点

#### Spring MVC 的拦截器

核心接口

- HandlerInteceptor
  - boolean preHandle()
  - void postHandle()
  - void afterCompletion()

针对 @ResponseBody 和 ResponseEntity 的情况

- ResponseBodyAdvice

针对异步请求的接口

- AsyncHandlerInterceptor

#### 拦截器的配置方式

常规方法

- WebMvcConfigurer.addInterceptors()

Spring Boot 中的配置

- 创建一个带 @Configuration 的 WebMvcConfigurer 配置类
- 不能带 @EnableWebMvc（想彻底自己控制 MVC 配置除外）

### 51 | SpringBucks 实战项目进度小结

略

### 52 | 课程答疑

略

## 第七章：访问 Web 资源 (5 讲)

### 53 | 通过 RestTemplate 访问 Web 资源

#### Spring Boot 中的 RestTemplate

- Spring Boot 中没有自动配置 RestTemplate
- Spring Boot 提供了 RestTemplateBuilder
- RestTemplateBuilder.build()

#### 常用方法

GET 请求

- getForObject() / getForEntity()

POST 请求

- postForObject() / postForEntity()

PUT 请求

- put()

DELETE 请求

- delete()

#### 构造 URI

构造 URI

- UriComponentsBuilder

构造相对于当前请求的 URI

- ServletUriComponentsBuilder

构造指向 Controller 的 URI

- MvcUriComponentsBuilder

### 54 | RestTemplate 的高阶用法

传递 HTTP Header

- `RestTemplate.exchange()`
- `RequestEntity<T> / ResponseEntity<T>`

类型转换

- `JsonSerializer / JsonDeserializer`
- `@JsonComponent`

解析泛型对象

- `RestTemplate.exchange()`
- `ParameterizedTypeReference<T>`

### 55 | 简单定制 RestTemplate

#### RestTemplate ⽀支持的 HTTP 库

通用接口

- ClientHttpRequestFactory

默认实现

- SimpleClientHttpRequestFactory

Apache HttpComponents

- HttpComponentsClientHttpRequestFactory

Netty

- Netty4ClientHttpRequestFactory

OkHttp

- OkHttp3ClientHttpRequestFactory

#### 优化底层请求策略

连接管理

- PoolingHttpClientConnectionManager
- KeepAlive 策略

超时设置

- connectTimeout / readTimeout

SSL 校验

- 证书检查策略

### 56 | 通过 WebClient 访问 Web 资源

#### 了解 WebClient

WebClient

- 一个以 Reactive 方式处理 HTTP 请求的非阻塞式的客户端

支持的底层 HTTP 库

- Reactor Netty - ReactorClientHttpConnector
- Jetty ReactiveStream HttpClient - JettyClientHttpConnector

#### WebClient 的基本用法

创建 WebClient

- WebClient.create()
- WebClient.builder()

发起请求

- get() / post() / put() / delete() / patch()

获得结果

- retrieve() / exchange()

处理 HTTP Status

- onStatus()

应答正文

- bodyToMono() / bodyToFlux()

### 57 | SpringBucks 实战项目进度小结

## 第八章： Web 开发进阶 (9 讲)

### 58 | 设计好的 RESTful Web Service（上）

### 59 | 设计好的 RESTful Web Service（下）

如何实现 Restful Web Service

- 识别资源
- 选择合适的资源粒度
- 设计 URI
- 选择合适的 HTTP 方法和返回码
- 设计资源的表述

识别资源

- 找到领域名词
- 能用 CRUD 操作的名词
- 将资源组织为集合（即集合资源）
- 将资源合并为复合资源
- 计算或处理函数

### 资源的粒度

站在客户端的角度，要考虑

- 可缓存性
- 修改频率
- 可变性

站在服务端的角度，要考虑

- 网络效率
- 表述的多少
- 客户端的易用程度

构建更好的 URI

- 使用域及子域对资源进行合理的分组或划分
- 在 URI 的路径部分使用斜杠分隔符 ( / ) 来表示资源之间的层次关系
- 在 URI 的路径部分使用逗号 ( , ) 和分号 ( ; ) 来表示非层次元素
- 使用连字符 ( - ) 和下划线 ( \_ ) 来改善长路径中名称的可读性
- 在 URI 的查询部分使用“与”符号 ( & ) 来分隔参数
- 在 URI 中避免出现文件扩展名 ( 例例如 .php，.aspx 和 .jsp )

### 60 | 什么是 HATEOAS

### 61 | 使用 Spring Data REST 实现简单的超媒体服务（上）

### 62 | 使用 Spring Data REST 实现简单的超媒体服务(下)

#### 认识 HAL

HAL

- Hypertext Application Language
- HAL 是一种简单的格式，为 API 中的资源提供简单一致的链接

HAL 模型

- 链接
- 内嵌资源
- 状态

#### Spring Data REST

Spring Boot 依赖

- spring-boot-starter-data-rest

常用注解与类

- `@RepositoryRestResource`
- `Resource<T>`
- `PagedResource<T>`

#### 如何访问 HATEOAS 服务

配置 Jackson JSON

- 注册 HAL 支持

操作超链接

- 找到需要的 Link
- 访问超链接

### 63 | 分布式环境中如何解决 Session 的问题

#### 常见的会话解决方案

- 粘性会话 Sticky Session
- 会话复制 Session Replication
- 集中会话 Centralized Session

#### 认识 Spring Session

Spring Session

- 简化集群中的用户会话管理
- 无需绑定容器特定解决方案

支持的存储

- Redis
- MongoDB
- JDBC
- Hazelcast

#### 实现原理

定制 HttpSession

- 通过定制的 HttpServletRequest 返回定制的 HttpSession
- `SessionRepositoryRequestWrapper`
- `SessionRepositoryFilter`
- `DelegatingFilterProxy`

#### 基于 Redis 的 HttpSession

引入依赖

- spring-session-data-redis

基本配置

- @EnableRedisHttpSession
- 提供 RedisConnectionFactory
- 实现 AbstractHttpSessionApplicationInitializer
- 配置 DelegatingFilterProxy

### 64 | 使用 WebFlux 代替 Spring MVC（上）

### 65 | 使用 WebFlux 代替 Spring MVC（下）

#### 认识 WebFlux

什么是 WebFlux

- 用于构建基于 Reactive 技术栈之上的 Web 应用程序
- 基于 Reactive Streams API ，运行在非阻塞服务器上

为什么会有 WebFlux

- 对于非阻塞 Web 应用的需要
- 函数式编程

关于 WebFlux 的性能

- 请求的耗时并不会有很大的改善
- 仅需少量固定数量的线程和较少的内存即可实现扩展

#### WebMVC v.s. WebFlux

- 已有 Spring MVC 应⽤用，运行正常，就别改了
- 依赖了大量阻塞式持久化 API 和网络 API，建议使用 Spring MVC
- 已经使用了非阻塞技术栈，可以考虑使用 WebFlux
- 想要使用 Java 8 Lambda 结合轻量级函数式框架，可以考虑 WebFlux

#### WebFlux 中的编程模型

两种编程模型

- 基于注解的控制器
- 函数式 Endpoints

#### 基于注解的控制器

常用注解

- @Controller
- @RequestMapping 及其等价注解
- @RequestBody / @ResponseBody

返回值

- `Mono<T> / Flux<T>`

### 66 | SpringBucks 实战项目进度小结

略

## 第九章：重新认识 Spring Boot (8 讲)

### 67 | 认识 Spring Boot 的组成部分

### Spring Boot 的特性

- 方便地创建可独立运行的 Spring 应用程序
- 直接内嵌 Tomcat、Jetty 或 Undertow
- 简化了项目的构建配置
- 为 Spring 及第三方库提供自动配置
- 提供生产级特性
- 无需生成代码或进行 XML 配置

### Spring Boot 的四大核心

- 自动配置 - Auto Configuration
- 起步依赖 - Starter Dependency
- 命令行界面 - Spring Boot CLI
- Actuator

### 68 | 了解自动配置的实现原理

### 了解自动配置

**自动配置**

- 基于添加的 JAR 依赖自动对 Spring Boot 应⽤用程序进行配置
- spring-boot-autoconfiguration

**开启自动配置**

- `@EnableAutoConfiguration`
  - `exclude = Class<?>[]`
- `@SpringBootApplication`

### 自动配置的实现原理

**`@EnableAutoConfiguration`**

- `AutoConfigurationImportSelector`
- `META-INF/spring.factories`
  - `org.springframework.boot.autoconfigure.EnableAutoConfiguration`

**条件注解**

- `@Conditional`
- `@ConditionalOnClass`
- `@ConditionalOnBean`
- `@ConditionalOnMissingBean`
- `@ConditionalOnProperty`
- ……

### 了解自动配置的情况

**观察自动配置的判断结果**

- --debug

**`ConditionEvaluationReportLoggingListener`**

- Positive matches
- Negative matches
- Exclusions
- Unconditional classes

### 69 | 动手实现自己的自动配置

### 主要工作内容

- 编写 Java Config
  - `@Configuration`
- 添加条件
  - `@Conditional`
- 定位自动配置
  - `META-INF/spring.factories`

### 条件注解

**条件注解**

- `@Conditional`

**类条件**

- `@ConditionalOnClass`
- `@ConditionalOnMissingClass`

**属性条件**

- `@ConditionalOnProperty`

**Bean 条件**

- `@ConditionalOnBean`
- `@ConditionalOnMissingBean`
- `**@ConditionalOnSingleCandidate`\*\*

**资源条件**

- `@ConditionalOnResource`

**Web 应用条件**

- `@ConditionalOnWebApplication`
- `@ConditionalOnNotWebApplication`

**其他条件**

- `@ConditionalOnExpression`
- `@ConditionalOnJava`
- `@ConditionalOnJndi`

### 自动配置的执行顺序

**执行顺序**

- `@AutoConfigureBefore`
- `@AutoConfigureAfter`
- `@AutoConfigureOrder`

### 70 | 如何在低版本 Spring 中快速实现类似自动配置的功能

### 需求与问题

**核心的诉求**

- 现存系统，不打算重构
- Spring 版本 3.x，不打算升级版本和引入 Spring Boot
- 期望能够在少改代码的前提下实现一些功能增强

**面临的问题**

- 3.x 的 Spring 没有条件注解
- 无法自动定位需要加载的自动配置

### 核心解决思路

**条件判断**

- 通过 `BeanFactoryPostProcessor` 进行判断

**配置加载**

- 编写 Java Config 类
- 引入配置类
- 通过 component-scan
- 通过 xml 文件 import

### Spring 的扩展点

**BeanPostProcessor**

- 针对 Bean 实例

- 在 Bean 创建后提供定制逻辑回调

**BeanFactoryPostProcessor**

- 针对 Bean 定义

- 在容器创建 Bean 前获取配置元数据

- Java Config 中需要定义为 static 方法

### 关于 Bean 的一些定制

#### 生命周期回调

- InitializingBean / @PostConstruct / init-method
- DisposableBean / @PostDestory / destroy-method

#### XXXAware

- `ApplicationContextAware`
- `BeanFactoryAware`
- `BeanNameAware`

### 一些常用操作

**判断类是否存在**

- `ClassUtils.isPresent()`

**判断 Bean 是否已定义**

- `ListableBeanFactory.containsBeanDefinition()`
- `ListableBeanFactory.getBeanNamesForType()`

**注册 Bean 定义**

- `BeanDefinitionRegistry.registerBeanDefinition()`

  - `GenericBeanDefinition`

- `BeanFactory.registerSingleton()`

### 71 | 了解起步依赖及其实现原理

### Maven 依赖管理技巧

了解你的依赖

- mvn dependency:tree
- IDEA Maven Helper 插件

排除特定依赖

- exclusion

统一管理依赖

- dependencyManagement
- Bill of Materials - bom

### Spring Boot 的 starter 依赖

**Starter Dependencies**

- 直接面向功能
- 一站获得所有相关依赖，不再复制粘贴

**官方的 Starters**

- spring-boot-starter-\*

### 72 | 定制自己的起步依赖

**主要内容**

- autoconfigure 模块，包含自动配置代码
- starter 模块，包含指向自动配置模块的依赖及其他相关依赖

**命名方式**

- xxx-spring-boot-autoconfigure
- xxx-spring-boot-starter

**注意事项**

- 不要使用 spring-boot 作为依赖的前缀
- 不要使用 spring-boot 的配置命名空间
- starter 中仅添加必要的依赖
- 声明对 spring-boot-starter 的依赖

### 73 | 深挖 Spring Boot 的配置加载机制

### 外化配置加载顺序

- 开启 DevTools 时，`~/.spring-boot-devtools.properties`
- 测试类上的 `@TestPropertySource` 注解
- `@SpringBootTest#properties` 属性
- 命令行参数（ `--server.port=9000` ）
- SPRING_APPLICATION_JSON 中的属性
- `ServletConfig` 初始化参数
- `ServletContext` 初始化参数
- `java:comp/env` 中的 JNDI 属性
- `System.getProperties()`
- 操作系统环境变量
- `random.*` 涉及到的 `RandomValuePropertySource`
- jar 包外部的 application-{profile}.properties 或 .yml
- jar 包内部的 application-{profile}.properties 或 .yml
- jar 包外部的 application.properties 或 .yml
- jar 包内部的 application.properties 或 .yml
- @Configuration 类上的 @PropertySource
- SpringApplication.setDefaultProperties() 设置的默认属性

### application.properties

默认位置

- `./config`
- `./`
- CLASSPATH 中的 `/config`
- CLASSPATH 中的 `/`

修改名字或路路径

- `spring.config.name`
- `spring.config.location`
- `spring.config.additional-location`

### Relaxed Binding

| 命名风格             | 使用范围                                   | 示例                            |
| -------------------- | ------------------------------------------ | ------------------------------- |
| 短划线分隔           | Properties 文件<br/>YAML 文件<br/>系统属性 | geektime.spring-boot.first-demo |
| 驼峰式               | Properties 文件<br/>YAML 文件<br/>系统属性 | geektime.springBoot.firstDemo   |
| 下划线分割           | Properties 文件<br/>YAML 文件<br/>系统属性 | geektime.spring_boot.first_demo |
| 全⼤大写，下划线分隔 | 环境变量                                   | GEEKTIME_SPRINGBOOT_FIRSTDEMO   |

### 74 | 理解配置背后的 PropertySource 抽象

### 添加 PropertySource

- `<context:property-placeholder>`
- `PropertySourcesPlaceholderConfigurer`
- `PropertyPlaceholderConfigurer`
- `@PropertySource`
- `@PropertySources`

### Spring Boot 中的 @ConfigurationProperties

- 可以将属性绑定到结构化对象上
- 支持 Relaxed Binding
- 支持安全的类型转换
- `@EnableConfigurationProperties`

### 定制 PropertySource

**主要步骤**

- 实现 `PropertySource<T>`
- 从 `Environment` 取得 `PropertySources`
- 将自己的 `PropertySource` 添加到合适的位置

**切入位置**

- `EnvironmentPostProcessor`
- `BeanFactoryPostProcessor`

## 第十章：运行中的 Spring Boot (11 讲)

### 75 | 认识 Spring Boot 的各类 Actuator Endpoint

### Actuator

**目的**

- 监控并管理应用程序

**访问方式**

- HTTP
- JMX

**依赖**

- spring-boot-starter-actuator

### 一些常用 Endpoint

| ID             | 说明                                  | 默认开启 | 默认 HTTP | 默认 JMX |
| -------------- | ------------------------------------- | -------- | --------- | -------- |
| beans          | 显示容器中的 Bean 列表                | Y        | N         | Y        |
| caches         | 显示应用中的缓存                      | Y        | N         | Y        |
| conditions     | 显示配置条件的计算情况                | Y        | N         | Y        |
| configprops    | 显示 @ConfigurationProperties 的信息  | Y        | N         | Y        |
| env            | 显示 ConfigurableEnvironment 中的属性 | Y        | N         | Y        |
| health         | 显示健康检查信息                      | Y        | Y         | Y        |
| httptrace      | 显示 HTTP Trace 信息                  | Y        | N         | Y        |
| info           | 显示设置好的应用信息                  | Y        | Y         | Y        |
| loggers        | 显示并更新日志配置                    | Y        | N         | Y        |
| metrics        | 显示应用的度量信息                    | Y        | N         | Y        |
| mappings       | 显示所有的 @RequestMapping 信息       | Y        | N         | Y        |
| scheduledtasks | 显示应用的调度任务信息                | Y        | N         | Y        |
| shutdown       | 优雅地关闭应用程序                    | N        | N         | Y        |
| threaddump     | 执行 Thread Dump                      | Y        | N         | Y        |
| heapdump       | 返回 Heap Dump 文件，格式为 HPROF     | Y        | N         | N/A      |
| prometheus     | 返回可供 Prometheus 抓取的信息        | Y        | N         | N/A      |

### 如何访问 Actuator Endpoint

**HTTP 访问**

- `/actuator/<id>`

**端口与路径**

- `management.server.address=`
- `management.server.port=`
- `management.endpoints.web.base-path=/actuator`
- `management.endpoints.web.path-mapping.<id>=路径`

**开启 Endpoint**

- `management.endpoint.<id>.enabled=true`
- `management.endpoints.enabled-by-default=false`

**暴露 Endpoint**

- `management.endpoints.jmx.exposure.exclude=`
- `management.endpoints.jmx.exposure.include=*`
- `management.endpoints.web.exposure.exclude=`
- `management.endpoints.web.exposure.include=info, health`

### 76 | 动手定制自己的 Health Indicator

### Spring Boot 自带的 Health Indicator

目的

- 检查应用程序的运行状态

状态

- DOWN - 503
- OUT_OF_SERVICE - 503
- UP - 200
- UNKNOWN - 200

机制

- 通过 `HealthIndicatorRegistry` 收集信息
- `HealthIndicator` 实现具体检查逻辑

配置项

- `management.health.defaults.enabled=true|false`
- `management.health.<id>.enabled=true`
- `management.endpoint.health.show-details=never|whenauthorized|always`

**内置 HealthIndicator 清单**

- `CassandraHealthIndicator`

- `ElasticsearchHealthIndicator`

- `MongoHealthIndicator`

- `SolrHealthIndicator`

- `CouchbaseHealthIndicator`

- `InfluxDbHealthIndicator`

- `Neo4jHealthIndicator`

- `DiskSpaceHealthIndicator`

- `JmsHealthIndicator`

- `RabbitHealthIndicator`

- `DataSourceHealthIndicator`

- `MailHealthIndicator`

- `RedisHealthIndicator`

### 自定义 Health Indicator

**方法**

- 实现 HealthIndicator 接口
- 根据自定义检查逻辑返回对应 Health 状态
- Health 中包含状态和详细描述信息

### 77 | 通过 Micrometer 获取运行数据

### 认识 Micrometer

**特性**

- 多维度度量量
- 支持 Tag
- 预置大量探针
- 缓存、类加载器器、GC、CPU 利利⽤用率、线程池……
- 与 Spring 深度整合

**支持多种监控系统**

- Dimensional

  - AppOptics, Atlas, Azure Monitor, Cloudwatch, Datadog, Datadog StatsD, Dynatrace, Elastic, Humio, Influx, KairosDB, New Relic, Prometheus, SignalFx, Sysdig StatsD, Telegraf
    StatsD, Wavefront

- Hierarchical
  - Graphite, Ganglia, JMX, Etsy StatsD

### 一些核心度量指标

**核心接口**

- Meter

**内置实现**

- Gauge, TimeGauge
- Timer, LongTaskTimer, FunctionTimer
- Counter, FunctionCounter
- DistributionSummary

### Micrometer in Spring Boot 2.x

**一些 URL**

- `/actuator/metrics`
- `/actuator/prometheus`

**一些配置项**

- `management.metrics.export.*`
- `management.metrics.tags.*`
- `management.metrics.enable.*`
- `management.metrics.distribution.*`
- `management.metrics.web.server.auto-time-requests`

核心度量项

- JVM、CPU、文件句柄数、日志、启动时间

其他度量项

- Spring MVC、Spring WebFlux
- Tomcat、Jersey JAX-RS
- RestTemplate、WebClient
- 缓存、数据源、Hibernate
- Kafka、RabbitMQ

自定义度量指标

- 通过 MeterRegistry 注册 Meter
- 提供 MeterBinder Bean 让 Spring Boot ⾃自动绑定
- 通过 MeterFilter 进⾏行行定制

### 78 | 通过 Spring Boot Admin 了解程序的运行状态

### Spring Boot Admin

**目的**

- 为 Spring Boot 应用程序提供一套管理界面

**主要功能**

- 集中展示应用程序 Actuator 相关的内容
- 变更通知

### 快速上手

**服务端**

- `de.codecentric:spring-boot-admin-starter-server:2.1.3`
- `@EnableAdminServer`

**客户端**

- `de.codecentric:spring-boot-admin-starter-client:2.1.3`
- 配置服务端及 Endpoint
- `spring.boot.admin.client.url=http://localhost:8080`
- `management.endpoints.web.exposure.include=*`

### 安全控制

安全相关依赖

- spring-boot-starter-security

服务端配置

- spring.security.user.name
- spring.security.user.password

### 79 | 如何定制 Web 容器的运行参数

### 内嵌 Web 容器

可选容器列表

- `spring-boot-starter-tomcat`
- `spring-boot-starter-jetty`
- `spring-boot-starter-undertow`
- `spring-boot-starter-reactor-netty`

### 修改容器器配置

**端口**

- `server.port`
- `server.address`

**压缩**

- `server.compression.enabled`
- `server.compression.min-response-size`
- `server.compression.mime-types`

**Tomcat 特定配置**

- `server.tomcat.max-connections=10000`
- `server.tomcat.max-http-post-size=2MB`
- `server.tomcat.max-swallow-size=2MB`
- `server.tomcat.max-threads=200`
- `server.tomcat.min-spare-threads=10`

错误处理

- `server.error.path=/error`
- `server.error.include-exception=false`
- `server.error.include-stacktrace=never`
- `server.error.whitelabel.enabled=true`

其他

- `server.use-forward-headers`
- `server.servlet.session.timeout`

编程方式

- `WebServerFactoryCustomizer<T>`
- `TomcatServletWebServerFactory`
- `JettyServletWebServerFactory`
- `UndertowServletWebServerFactory`

### 80 | 如何配置容器支持 HTTP/2（上）

### 配置 HTTPS 支持

**通过参数进行配置**

- `server.port=8443`
- `server.ssl.*`
  - `server.ssl.key-store`
  - server.ssl.key-store-type，JKS 或者 PKCS12
  - `server.ssl.key-store-password=secret`

### 生成证书文件

**命令**

- keytool -genkey -alias 别名
  - -storetype 仓库类型 -keyalg 算法 -keysize 长度
  - -keystore 文件名 -validity 有效期

说明

- 仓库类型，JKS、JCEKS、PKCS12 等
- 算法，RSA、DSA 等
- 长度，例如 2048

### 客户端 HTTPS 支持

配置 HttpClient （ >= 4.4 ）

- `SSLContextBuilder` 构造 `SSLContext`
- `setSSLHostnameVerifier(new NoopHostnameVerifier())`

配置 `RequestFactory`

- `HttpComponentsClientHttpRequestFactory`
- `setHttpClient()`

### 81 | 如何配置容器支持 HTTP/2（下）

### 配置 HTTP/2 支持

前提条件

- Java >= JDK 9
- Tomcat >= 9.0.0
- Spring Boot 不支持 h2c，需要先配置 SSL

配置项

- server.http2.enabled

### 客户端 HTTP/2 支持

HTTP 库选择

- `OkHttp（ com.squareup.okhttp3:okhttp:3.14.0 ）`
- `OkHttpClient`

RestTemplate 配置

- `OkHttp3ClientHttpRequestFactory`

### 82 | 如何编写命令行运行的程序

### 关闭 Web 容器

控制依赖

- 不添加 Web 相关依赖

配置方式

- `spring.main.web-application-type=none`

编程方式

- `SpringApplication`
- `setWebApplicationType()`
- `SpringApplicationBuilder`
- `web()`
- 在调用 `SpringApplication` 的 `run()` 方法前设置 `WebApplicationType`

### 常用工具类

不同的 Runner

- ApplicationRunner
- 参数是 ApplicationArguments
- CommandLineRunner
- 参数是 String[]

返回码

- ExitCodeGenerator

### 83 | 了解可执行 Jar 背后的秘密

### 认识可执行 Jar

**其中包含**

- Jar 描述，`META-INF/MANIFEST.MF`
- Spring Boot Loader，org/springframework/boot/loader
- 项目内容，BOOT-INF/classes
- 项目依赖，BOOT-INF/lib

**其中不包含**

- JDK / JRE

### 如何找到程序的入口

**Jar 的启动类**

- `MANIFEST.MF`
- `Main-Class: org.springframework.boot.loader.JarLauncher`

**项目的主类**

- `@SpringApplication`
- `MANIFEST.MF`
- `Start-Class: xxx.yyy.zzz`

### 84 | 如何将 Spring Boot 应用打包成 Docker 镜像文件

### 什么是 Docker 镜像

- 镜像是静态的只读模板
- 镜像中包含构建 Docker 容器器的指令
- 镜像是分层的
- 通过 Dockerfile 来创建镜像

### Dockerfile

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20230806142644.png)

### 通过 Maven 构建 Docker 镜像

准备工作

- 提供一个 Dockerfile
- 配置 dockerfile-maven-plugin 插件

执行构建

- `mvn package`
- `mvn dockerfile:build`

检查结果

- `docker images`

### 85 | SpringBucks 实战项目进度小结

略

## 第十一章：Spring Cloud 及 Cloud Native 概述 (5 讲)

### 86 | 简单理解微服务

微服务就是一些协同工作的小而自治的服务。

微服务的优点

- 易于部署
- 与组织结构对齐
- 可组合性
- 可替代性

微服务的代价

- 架构复杂
- 运维复杂

### 87 | 如何理解云原生(Cloud Native)

云原生技术有利于各组织在公有云、私有云和混合云等新型动态环境中，构建和运行可弹性扩展的应用。

云原生应用要求

- DevOps
- 持续交付
- 微服务
- 容器

Cloud Native Computing Foundation，缩写 CNCF

### 88 | 12-Factor App（上）

### 89 | 12-Factor App（下）

12-Factor 为构建 SaaS 应用提供了方法论。

参考资料：https://12factor.net/zh_cn/

- 基准代码 - 一份基准代码，多份部署。解决方案：git

- 依赖 - 显式声明依赖关系。解决方案：maven、gradle

- 配置 - 在环境中存储配置。解决方案：apollo

- 后端服务 - 把后端服务当作附加资源

- 构建，发布，运行 - 严格分离构建和运行。解决方案：CI/CD（如：jenkins、sonar 等）

- 进程 - 以一个或多个无状态进程运行应用

- 端口绑定 - 通过端口绑定提供服务

- 并发 - 通过进程模型进行扩展

- 易处理 - 快速启动和优雅终止可最大化健壮性

- 开发环境与线上环境等价 - 尽可能的保持开发，预发布，线上环境相同

- 日志 - 把日志当作事件流

- 管理进程 - 后台管理任务当作一次性进程运行

### 90 | 认识 Spring Cloud 的组成部分

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20230729155944.svg)

Spring Cloud 的主要功能

- 服务发现
- 服务熔断
- 配置服务
- 服务安全
- 服务网关
- 分布式消息
- 分布式跟踪
- 各种云平台支持

## 第十二章：服务注册与发现 (9 讲)

### 91 | 使用 Eureka 作为服务注册中心

- **SpringCloud 启动包**
  - 服务端 - `spring-cloud-starter-netflix-eureka-server`
  - 客户端 - `spring-cloud-starter-netflix-eureka-client`
- **注解**
  - 服务端启动注解 - `@EnableEurekaServer`
  - 客户端启动注解
    - 通用注解 - `@EnableDiscoveryClient`
    - Eureka 特定注解 - `@EnableEurekaClient`
- **要点**
  - Eureka 默认端口 8761
- **配置**
  - `eureka.client.serviceUrl.defaultZone` - 注册地址，如 http://localhost:10001/eureka/
  - `eureka.client.register-with-eureka` - 是否将自己注册到 Eureka Server，默认为 true
  - `eureka.client.fetch-registry` - 是否从 Eureka Server 获取注册信息，默认为 true

### 92 | 使用 Spring Cloud Loadbalancer 访问服务

- 如何获得服务地址
  - `org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient`
  - `org.springframework.cloud.client.discovery.DiscoveryClient` - 通用接口，推荐方式
- 负载均衡客户端
  - `@LoadBalanced`
  - 实际是通过 `ClientHttpRequestInterceptor` 实现的
  - `LoadBalancerInterceptor`
  - `LoadBalancerClient`
  - `RibbonLoadBalancerClient`

### 93 | 使用 Feign 访问服务

声明式 REST Web 服务客户端

- **SpringCloud 启动包**
  - spring-cloud-starter-openfeign
- **注解**
  - 启动注解 - `@EnableFeignClients`
  - 定义接口注解 - `@FeignClient`
- **配置** - `org.springframework.cloud.openfeign.FeignClientsConfiguration`

### 94 | 深入理解服务发现背后的 DiscoveryClient

- **服务端抽象接口** - `org.springframework.cloud.client.serviceregistry.ServiceRegistry`
  - `EurekaServiceRegistry`
  - `EurekaRegistration`
  - `EurekaAutoServiceRegistration`
  - `EurekaClientAutoConfiguration`
- **客户端抽象接口** - `org.springframework.cloud.client.discovery.DiscoveryClient`
  - `@EnableDiscoveryClient`
- **负载均衡抽象接口** - `org.springframework.cloud.client.loadbalancer.LoadBalancerClient`

### 95 | 使用 Zookeeper 作为服务注册中心

- **SpringCloud 启动包**
  - **spring-cloud-starter-zookeeper-discovery**
- **配置**
  - `ZookeeperAutoConfiguration`
  - `ZookeeperDiscoveryAutoConfiguration`

### 96 | 使用 Consul 作为服务注册中心

- **SpringCloud 启动包**
  - **spring-cloud-starter-consul-discovery**
- **配置**
  - `ConsulAutoConfiguration`

### 97 | 使用 Nacos 作为服务注册中心

- **SpringCloud 启动包**
  - **spring-cloud-starter-alibaba-nacos-discovery**
- **配置**
  - `NacosDiscoveryAutoConfiguration`

### 98 | 如何定制自己的 DiscoveryClient

**`DiscoveryClient`**

- `EurekaDiscoveryClient`
- `ZooKeeperDiscoveryClient`
- `ConsulDiscoveryClient`
- `NacosDiscoveryClient`

**`LoadBalancerClient`**

- `RibbonLoadBalancerClient`

**自定义 DiscoveryClient 步骤**

- 返回该 DiscoveryClient 能提供的服务名列表
- 返回指定服务对应的 ServiceInstance 列表
- 返回 DiscoveryClient 的顺序
- 返回 HealthIndicator 里显示的描述

自定义 RibbonClient 支持

- 实现 `ServerList<T extends Server>`
- Ribbon 提供了 AbstractServerList
- 提供一个配置类，声明 ServerList Bean 实例

### 99 | SpringBucks 实战项目进度小结

略

## 第十三章：服务熔断 (7 讲)

### 100 | 使用 Hystrix 实现服务熔断（上）

断路器模式

在断路器对象中封装受保护的方法调用

该对象监控调用和断路情况

调用失败触发阈值后，后序调用直接由断路器返回错误，不再执行实际调用

### 101 | 使用 Hystrix 实现服务熔断（下）

- **Hystrix 应用**

  - 注解
  - @HystrixCommand
    - fallbackMethod
    - commandProperties
      - @HystrixProperty

- **SpringCloud 启动包**
  - **spring-cloud-starter-netflix-hystrix**
- **注解**

  - `@EnableCircuitBreaker` - 断路器开启注解

- **Feign 支持**
  - `feign.hystrix.enabled=true`
  - `@FeignClient` 的 `fallback` / `fallbackFactory`
- **配置**
  - `HystrixCircuitBreakerAutoConfiguration`

### 102 | 如何观察服务熔断

Spring Cloud 对于熔断的监控支持

- Hystrix Metrics Stream
  - spring-boot-starter-actuator
  - `/actuator/hystrix.stream`
- Hystrix Dashboard
  - spring-cloud-starter-netflix-hystrix-dashboard
  - `@EnableHystrixDashboard`
  - `/hystirx`

**聚合集群熔断信息**

- **SpringCloud 启动包** - spring-cloud-starter-netflix-turbines
- **注解** - `@EnableTurbine`
- `/turbine/stream?cluster=集群名`

### 103 | 使用 Resilience4j 实现服务熔断

Hystrix 官方已经停止维护，因此建议选择其他产品来替代。例如：[Resilience4J](https://github.com/resilience4j/resilience4j)

- Resilience4J 实现
  - 基于 `ConcurrentHashMap` 的内存断路器
  - `CircuitBreakerRegistry`
  - `CircuitBreakerConfig`
- Resilience4J 依赖

  - resilience4j-spring-boot2

- 注解
  - @CircuitBreaker
- 配置
  - CircuitBreakerProperties

### 104 | 使用 Resilience4j 实现服务限流（上）

Bulkhead

- 目的
  - 防止下游依赖被并发请求冲击
  - 防止发生雪崩
- 用法
  - BulkheadRegistry / BulkheadConfig
  - @Bulkhead(name = "xxx")

### 105 | 使用 Resilience4j 实现服务限流（下）

RateLimit

- 目的
  - 限制特定时间内的执行次数
- 用法
  - `RateLimiterRegistry` / `RateLimiterConfig`
  - `@RateLimiter`
- 配置
- RateLimiterPropertis

### 106 | SpringBucks 实战项目进度小结

略

## 第十四章：服务配置 (7 讲)

### 107 | 基于 Git 的配置中心（上）

目的

提供针对外置配置的 HTTP API

- **SpringCloud 启动包** - spring-cloud-config-server
- **注解** - `@EnableConfigServer`

### 108 | 基于 Git 的配置中心（下）

### 109 | 基于 Zookeeper 的配置中心

### 110 | 深入理解 Spring Cloud 的配置抽象

实现

- 类似于 Spring 的 Environment 和 PropertySource
- 在上下文中增加 Spring Cloud Config 的 PropertySource

PropertySource 子类

- `ZooKeeperPropertySource`
- `ConsulPropertySource`
- `ConsulFilePropertySource`

PropertySourceLocator

EnvironmentRepositry

配置刷新

- /actuator/refresh
- Spring Cloud Bus - RegfreshRemoteApplicationEvent

ZooKeeperConfigBootstrapConfiguration

ZooKeeperConfigAutoConfiguration

### 111 | 基于 Consul 的配置中心

**SpringCloud 启动包** - spring-cloud-starter-consual-config

**配置文件** - bootstrap.propertis | yml

### 112 | 基于 Nacos 的配置中心

**SpringCloud 启动包** - spring-cloud-starter-alibaba-nacos-config

**配置文件** - bootstrap.propertis | yml

### 113 | SpringBucks 实战项目进度小结

略

## 第十五章：Spring Cloud Stream (4 讲)

### 114 | 认识 Spring Cloud Stream

Spring Cloud Stream 是一款用于构建消息驱动的微服务应用程序的轻量级框架。

特性

- 声明式编程模型
- 引入多种概念抽象：发布订阅、消费组、分区
- 支持多种消息中间件：RabbitMQ、Kafka

概念

- Binding
  - 生产者、消费者与 MQ 之间的桥梁
  - @EnableBinding
  - @Input /SubscribableChannel
  - @Output / MessageChannel
- 消费组
- 分区

生产消息

- 使用 MessageChannel 的 send()
- @SendTo

消费消息

- @StreamListener
- @Payload / @Headers / @Header

### 115 | 通过 Spring Cloud Stream 访问 RabbitMQ

**SpringCloud 启动包** - spring-cloud-starter-stream-rabbit

**SpringBoot 启动包** - spring-boot-starter-amqp

**配置**

`org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration`

### 116 | 通过 Spring Cloud Stream 访问 Kafka

**SpringCloud 启动包** - spring-cloud-starter-stream-kafka

**配置** - `org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration`

Spring 定时任务

- TaskScheduler / Trigger / TriggerContext
- 配置定时任务
  - `@EnableScheduling`
  - `<task:scheduler />`
  - `@Scheduled`

Spring 事件机制

- `ApplicationEvent`
- 发送事件
  - `ApplicationEventPublisher`
  - `ApplicationEventPublisherAware`
- 监听事件
  - `ApplicationListener<T>`
  - `@EventListener`

### 117 | SpringBucks 实战项目进度小结

略

## 第十六章：服务链路追踪 (6 讲)

### 118 | 通过 Dapper 理解链路治理

略

### 119 | 使用 Spring Cloud Sleuth 实现链路追踪

**SpringCloud 启动包** - spring-cloud-starter-sleuth、spring-cloud-starter-zipkin

### 120 | 如何追踪消息链路

略

### 121 | 除了链路还要治理什么

略

### 122 | SpringBucks 实战项目进度小结

略

## 参考资料

- [玩转 Spring 全家桶](https://time.geekbang.org/course/intro/156)
