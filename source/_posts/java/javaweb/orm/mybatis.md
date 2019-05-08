---
title: MyBatis 指南
categories: ['java', 'javaweb']
tags: ['java', 'javaweb', 'orm']
date: 2019-03-06
---

# MyBatis 指南

> MyBatis 的前身就是 iBatis ，是一个作用在数据持久层的对象关系映射（Object Relational Mapping，简称 ORM）框架。

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [什么是 MyBatis？](#什么是-mybatis)
    - [MyBatis vs. Hibernate](#mybatis-vs-hibernate)
- [入门](#入门)
- [核心 API](#核心-api)
    - [SqlSessionFactoryBuilder](#sqlsessionfactorybuilder)
    - [SqlSessionFactory](#sqlsessionfactory)
    - [SqlSession](#sqlsession)
    - [映射器](#映射器)
- [原理](#原理)
    - [MyBatis 的架构](#mybatis-的架构)
    - [接口层](#接口层)
    - [数据处理层](#数据处理层)
    - [框架支撑层](#框架支撑层)
    - [引导层](#引导层)
    - [主要组件](#主要组件)
- [配置](#配置)
- [SQL XML 映射文件](#sql-xml-映射文件)
- [Mybatis 扩展](#mybatis-扩展)
- [资料](#资料)

<!-- /TOC -->

## 简介

### 什么是 MyBatis？

MyBatis 是一款持久层框架，它支持定制化 SQL、存储过程以及高级映射。MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。MyBatis 可以使用简单的 XML 或注解来配置和映射原生类型、接口和 Java 的 POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。

### MyBatis vs. Hibernate

MyBatis 和 Hibernate 都是 Java 世界中比较流行的 ORM 框架。我们应该了解其各自的优势，根据项目的需要去抉择在开发中使用哪个框架。

**Mybatis 优势**

- MyBatis 可以进行更为细致的 SQL 优化，可以减少查询字段。
- MyBatis 容易掌握，而 Hibernate 门槛较高。

**Hibernate 优势**

- Hibernate 的 DAO 层开发比 MyBatis 简单，Mybatis 需要维护 SQL 和结果映射。
- Hibernate 对对象的维护和缓存要比 MyBatis 好，对增删改查的对象的维护要方便。
- Hibernate 数据库移植性很好，MyBatis 的数据库移植性不好，不同的数据库需要写不同 SQL。
- Hibernate 有更好的二级缓存机制，可以使用第三方缓存。MyBatis 本身提供的缓存机制不佳。

## 入门

> [Mybatis 官方文档之入门](http://www.mybatis.org/mybatis-3/zh/getting-started.html) 已经写得很简洁易懂，不再赘述。

## 核心 API

> 核心 API 请参考：「 [Mybatis 官方文档之 Java API](http://www.mybatis.org/mybatis-3/zh/java-api.html) 」

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/1556022483200.png"/></div>

### SqlSessionFactoryBuilder

- **SqlSessionFactoryBuilder 职责**

**`SqlSessionFactoryBuilder` 负责创建 `SqlSessionFactory` 实例。而 `SqlSessionFactoryBuilder` 则可以从 XML 配置文件或一个预先定制的 `Configuration` 的实例构建出 `SqlSessionFactory` 的实例。**

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/1556072725320.png"/></div>

- **SqlSessionFactoryBuilder 生命周期**

这个类可以被实例化、使用和丢弃，一旦创建了 `SqlSessionFactory`，就不再需要它了。 因此 `SqlSessionFactoryBuilder` 实例的最佳作用域是方法作用域（也就是局部方法变量）。

### SqlSessionFactory

- **SqlSessionFactory 职责**

**SqlSessionFactory 负责创建 SqlSession 实例。**

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/1556074378879.png"/></div>

- **SqlSessionFactory 生命周期**

`SqlSessionFactory` 一旦被创建就应该在应用的运行期间一直存在，没有任何理由丢弃它或重新创建另一个实例。最简单的方法就是使用单例模式或者静态单例模式。

### SqlSession

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/1556105326238.png"/></div>

- **SqlSession 职责**

**MyBatis 的主要 Java 接口就是 `SqlSession`。你可以通过这个接口来执行命令，获取映射器和管理事务。**

> 详细内容可以参考：「 [Mybatis 官方文档之 sqlSessions](http://www.mybatis.org/mybatis-3/zh/java-api.html#sqlSessions) 」 。

- **SqlSession 生命周期**

> 注意：当 Mybatis 与一些依赖注入框架（如 Spring 或者 Guice）同时使用时，`SqlSessions` 将被依赖注入框架所创建，所以你不需要使用 `SqlSessionFactoryBuilder` 或者 `SqlSessionFactory`。

**每个线程都应该有它自己的 `SqlSession` 实例。**

`SqlSession` 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的作用域是请求或方法作用域。 绝对不能将 `SqlSession` 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。 也绝不能将 `SqlSession` 实例的引用放在任何类型的托管作用域中，比如 Servlet 框架中的 `HttpSession`。 正确在 Web 中使用 `SqlSession` 的场景是：每次收到的 HTTP 请求，就可以打开一个 `SqlSession`，返回一个响应，就关闭它。

编程模式：

```java
SqlSession session = sqlSessionFactory.openSession();
try {
  // 你的应用逻辑代码
} finally {
  session.close();
}
```

### 映射器

- **映射器职责**

映射器是一些由你创建的、绑定你映射的语句的接口。

各个 insert、update、delete 和 select 方法都很强大，但也有些繁琐。更通用的方式是使用映射器类来执行映射语句。一个映射器类就是一个仅需声明与 SqlSession 方法相匹配的方法的接口类。

下面的示例展示了一些方法签名以及它们是如何映射到 SqlSession 上的。

```java
public interface AuthorMapper {
  // (Author) selectOne("selectAuthor",5);
  Author selectAuthor(int id);
  // (List<Author>) selectList(“selectAuthors”)
  List<Author> selectAuthors();
  // (Map<Integer,Author>) selectMap("selectAuthors", "id")
  @MapKey("id")
  Map<Integer, Author> selectAuthors();
  // insert("insertAuthor", author)
  int insertAuthor(Author author);
  // updateAuthor("updateAuthor", author)
  int updateAuthor(Author author);
  // delete("deleteAuthor",5)
  int deleteAuthor(int id);
}
```

> **注意**
>
> - 映射器接口不需要去实现任何接口或继承自任何类。只要方法可以被唯一标识对应的映射语句就可以了。
> - 映射器接口可以继承自其他接口。当使用 XML 来构建映射器接口时要保证语句被包含在合适的命名空间中。而且，唯一的限制就是你不能在两个继承关系的接口中拥有相同的方法签名（潜在的危险做法不可取）。

- **映射器生命周期**

映射器接口的实例是从 `SqlSession` 中获得的。因此从技术层面讲，任何映射器实例的最大作用域是和请求它们的 `SqlSession` 相同的。尽管如此，映射器实例的最佳作用域是方法作用域。 也就是说，映射器实例应该在调用它们的方法中被请求，用过之后即可丢弃。

编程模式：

```java
SqlSession session = sqlSessionFactory.openSession();
try {
  BlogMapper mapper = session.getMapper(BlogMapper.class);
  // 你的应用逻辑代码
} finally {
  session.close();
}
```

- **映射器注解**

MyBatis 是一个 XML 驱动的框架。配置信息是基于 XML 的，而且映射语句也是定义在 XML 中的。MyBatis 3 以后，支持注解配置。注解配置基于配置 API；而配置 API 基于 XML 配置。

Mybatis 支持诸如 @Insert、@Update、@Delete、@Select、@Result 等注解。

> 详细内容请参考：[Mybatis 官方文档之 sqlSessions](http://www.mybatis.org/mybatis-3/zh/java-api.html#sqlSessions)，其中列举了 Mybatis 支持的注解清单，以及基本用法。

## 原理

### MyBatis 的架构

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/1556104494030.png"/></div>

### 接口层

接口层负责和数据库交互的方式

MyBatis 和数据库的交互有两种方式：

1.  使用传统的 MyBatis 提供的 API；
2.  使用 Mapper 接口

#### 使用传统的 MyBatis 提供的 API

这是传统的传递 Statement Id 和查询参数给 SqlSession 对象，使用 SqlSession 对象完成和数据库的交互；MyBatis 提供了非常方便和简单的 API，供用户实现对数据库的增删改查数据操作，以及对数据库连接信息和 MyBatis 自身配置信息的维护操作。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/standalone/orm/mybatis/mybatis两种工作方式之一传统模式.png">
</div>

上述使用 MyBatis 的方法，是创建一个和数据库打交道的 SqlSession 对象，然后根据 Statement Id 和参数来操作数据库，这种方式固然很简单和实用，但是它不符合面向对象语言的概念和面向接口编程的编程习惯。由于面向接口的编程是面向对象的大趋势，MyBatis 为了适应这一趋势，增加了第二种使用 MyBatis 支持接口（Interface）调用方式。

#### 使用 Mapper 接口

MyBatis 将配置文件中的每一个 `<mapper>` 节点抽象为一个 Mapper 接口，而这个接口中声明的方法和跟 `<mapper>` 节点中的 `<select|update|delete|insert>` 节点相对应，即 `<select|update|delete|insert>` 节点的 id 值为 Mapper 接口中的方法名称，parameterType 值表示 Mapper 对应方法的入参类型，而 resultMap 值则对应了 Mapper 接口表示的返回值类型或者返回结果集的元素类型。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/standalone/orm/mybatis/mybatis两种工作方式之一接口模式.png">
</div>

根据 MyBatis 的配置规范配置好后，通过 `SqlSession.getMapper(XXXMapper.class)` 方法，MyBatis 会根据相应的接口声明的方法信息，通过动态代理机制生成一个 Mapper 实例，我们使用 Mapper 接口的某一个方法时，MyBatis 会根据这个方法的方法名和参数类型，确定 Statement Id，底层还是通过`SqlSession.select("statementId",parameterObject);` 或者 `SqlSession.update("statementId",parameterObject);` 等等来实现对数据库的操作。

MyBatis 引用 Mapper 接口这种调用方式，纯粹是为了满足面向接口编程的需要。（其实还有一个原因是在于，面向接口的编程，使得用户在接口上可以使用注解来配置 SQL 语句，这样就可以脱离 XML 配置文件，实现“0 配置”）。

### 数据处理层

数据处理层可以说是 MyBatis 的核心，从大的方面上讲，它要完成两个功能：

1.  通过传入参数构建动态 SQL 语句；
2.  SQL 语句的执行以及封装查询结果集成 `List<E>`

#### 参数映射和动态 SQL 语句生成

动态语句生成可以说是 MyBatis 框架非常优雅的一个设计，MyBatis 通过传入的参数值，**使用 Ognl 来动态地构造 SQL 语句**，使得 MyBatis 有很强的灵活性和扩展性。

参数映射指的是对于 java 数据类型和 jdbc 数据类型之间的转换：这里有包括两个过程：查询阶段，我们要将 java 类型的数据，转换成 jdbc 类型的数据，通过 `preparedStatement.setXXX()` 来设值；另一个就是对 resultset 查询结果集的 jdbcType 数据转换成 java 数据类型。

#### SQL 语句的执行以及封装查询结果集成 `List<E>`

动态 SQL 语句生成之后，MyBatis 将执行 SQL 语句，并将可能返回的结果集转换成 `List<E>` 列表。MyBatis 在对结果集的处理中，支持结果集关系一对多和多对一的转换，并且有两种支持方式，一种为嵌套查询语句的查询，还有一种是嵌套结果集的查询。

### 框架支撑层

#### 事务管理机制

对数据库的事务而言，应该具有以下几点：创建（create）、提交（commit）、回滚（rollback）、关闭（close）。对应地，MyBatis 将事务抽象成了 Transaction 接口。

MyBatis 的事务管理分为两种形式：

1.  使用 JDBC 的事务管理机制：即利用 java.sql.Connection 对象完成对事务的提交（commit()）、回滚（rollback()）、关闭（close()）等。
2.  使用 MANAGED 的事务管理机制：这种机制 MyBatis 自身不会去实现事务管理，而是让程序的容器如（JBOSS，Weblogic）来实现对事务的管理。

#### 连接池管理机制

由于创建一个数据库连接所占用的资源比较大， 对于数据吞吐量大和访问量非常大的应用而言，连接池的设计就显得非常重要，对于连接池管理机制我已经在我的博文《深入理解 mybatis 原理》 Mybatis 数据源与连接池 中有非常详细的讨论，感兴趣的读者可以点击查看。

#### 缓存机制

MyBatis 将数据缓存设计成两级结构，分为一级缓存、二级缓存：

- **一级缓存是 Session 会话级别的缓存**，位于表示一次数据库会话的 SqlSession 对象之中，又被称之为本地缓存。一级缓存是 MyBatis 内部实现的一个特性，用户不能配置，默认情况下自动支持的缓存，用户没有定制它的权利（不过这也不是绝对的，可以通过开发插件对它进行修改）；
- **二级缓存是 Application 应用级别的缓存**，它的是生命周期很长，跟 Application 的声明周期一样，也就是说它的作用范围是整个 Application 应用。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/standalone/orm/mybatis/mybatis缓存架构示意图.png">
</div>

##### 一级缓存的工作机制

一级缓存是 Session 会话级别的，一般而言，一个 SqlSession 对象会使用一个 Executor 对象来完成会话操作，Executor 对象会维护一个 Cache 缓存，以提高查询性能。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/standalone/orm/mybatis/SqlSession一级缓存的工作流程.png">
</div>

##### 二级缓存的工作机制

如上所言，一个 SqlSession 对象会使用一个 Executor 对象来完成会话操作，MyBatis 的二级缓存机制的关键就是对这个 Executor 对象做文章。如果用户配置了 `"cacheEnabled=true"`，那么 MyBatis 在为 SqlSession 对象创建 Executor 对象时，会对 Executor 对象加上一个装饰者：CachingExecutor，这时 SqlSession 使用 CachingExecutor 对象来完成操作请求。CachingExecutor 对于查询请求，会先判断该查询请求在 Application 级别的二级缓存中是否有缓存结果，如果有查询结果，则直接返回缓存结果；如果缓存中没有，再交给真正的 Executor 对象来完成查询操作，之后 CachingExecutor 会将真正 Executor 返回的查询结果放置到缓存中，然后在返回给用户。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/standalone/orm/mybatis/使用与未使用二级缓存的区别.png">
</div>

#### SQL 语句的配置方式

传统的 MyBatis 配置 SQL 语句方式就是使用 XML 文件进行配置的，但是这种方式不能很好地支持面向接口编程的理念，为了支持面向接口的编程，MyBatis 引入了 Mapper 接口的概念，面向接口的引入，对使用注解来配置 SQL 语句成为可能，用户只需要在接口上添加必要的注解即可，不用再去配置 XML 文件了，但是，目前的 MyBatis 只是对注解配置 SQL 语句提供了有限的支持，某些高级功能还是要依赖 XML 配置文件配置 SQL 语句。

### 引导层

引导层是配置和启动 MyBatis 配置信息的方式。MyBatis 提供两种方式来引导 MyBatis ：

1.  基于 XML 配置文件的方式
2.  基于 Java API 的方式

### 主要组件

从 MyBatis 代码实现的角度来看，MyBatis 的主要组件有以下几个：

- **SqlSession** - 作为 MyBatis 工作的主要顶层 API，表示和数据库交互的会话，完成必要数据库增删改查功能。
- **Executor** - MyBatis 执行器，是 MyBatis 调度的核心，负责 SQL 语句的生成和查询缓存的维护。
- **StatementHandler** - 封装了 JDBC Statement 操作，负责对 JDBC statement 的操作，如设置参数、将 Statement 结果集转换成 List 集合。
- **ParameterHandler** - 负责对用户传递的参数转换成 JDBC Statement 所需要的参数。
- **ResultSetHandler** - 负责将 JDBC 返回的 ResultSet 结果集对象转换成 List 类型的集合。
- **TypeHandler** - 负责 java 数据类型和 jdbc 数据类型之间的映射和转换。
- **MappedStatement** - MappedStatement 维护了一条 `<select|update|delete|insert>` 节点的封装。
- **SqlSource** - 负责根据用户传递的 parameterObject，动态地生成 SQL 语句，将信息封装到 BoundSql 对象中，并返回。
- **BoundSql** - 表示动态生成的 SQL 语句以及相应的参数信息。
- **Configuration** - MyBatis 所有的配置信息都维持在 Configuration 对象之中。

它们的关系如下图所示：

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/standalone/orm/mybatis/mybaits流程图2.png">
</div>
## 配置

> 配置的详细内容请参考：「 [Mybatis 官方文档之配置](http://www.mybatis.org/mybatis-3/zh/configuration.html) 」 。

MyBatis 的配置文件包含了会深深影响 MyBatis 行为的设置和属性信息。主要配置项有以下：

- [properties（属性）](http://www.mybatis.org/mybatis-3/zh/configuration.html#properties)
- [settings（设置）](http://www.mybatis.org/mybatis-3/zh/configuration.html#settings)
- [typeAliases（类型别名）](http://www.mybatis.org/mybatis-3/zh/configuration.html#typeAliases)
- [typeHandlers（类型处理器）](http://www.mybatis.org/mybatis-3/zh/configuration.html#typeHandlers)
- [objectFactory（对象工厂）](http://www.mybatis.org/mybatis-3/zh/configuration.html#objectFactory)
- [plugins（插件）](http://www.mybatis.org/mybatis-3/zh/configuration.html#plugins)
- [environments（环境配置）](http://www.mybatis.org/mybatis-3/zh/configuration.html#environments)
  - environment（环境变量）
    - transactionManager（事务管理器）
    - dataSource（数据源）
- [databaseIdProvider（数据库厂商标识）](http://www.mybatis.org/mybatis-3/zh/configuration.html#databaseIdProvider)
- [mappers（映射器）](http://www.mybatis.org/mybatis-3/zh/configuration.html#mappers)

## SQL XML 映射文件

> SQL XML 映射文件详细内容请参考：「 [Mybatis 官方文档之 XML 映射文件](http://www.mybatis.org/mybatis-3/zh/sqlmap-xml.html) 」。

XML 映射文件只有几个顶级元素：

- `cache` – 对给定命名空间的缓存配置。
- `cache-ref` – 对其他命名空间缓存配置的引用。
- `resultMap` – 是最复杂也是最强大的元素，用来描述如何从数据库结果集中来加载对象。
- \~\~`parameterMap` – 已被废弃！老式风格的参数映射。更好的办法是使用内联参数，此元素可能在将来被移除。文档中不会介绍此元素。\~\~
- `sql` – 可被其他语句引用的可重用语句块。
- `insert` – 映射插入语句
- `update` – 映射更新语句
- `delete` – 映射删除语句
- `select` – 映射查询语句

## Mybatis 扩展

- [mybatis-plus](https://github.com/baomidou/mybatis-plus) - CRUD、代码生成器、分页器等多功能
- [Mapper](https://github.com/abel533/Mapper) - CRUD
- [Mybatis-PageHelper](https://github.com/pagehelper/Mybatis-PageHelper) - Mybatis 通用分页插件

## 资料

- **官方**

| [Github](https://github.com/mybatis/mybatis-3) | [官网](http://www.mybatis.org/mybatis-3/) | [MyBatis Generator](https://github.com/mybatis/generator) | [Spring 集成](https://github.com/mybatis/spring) | [Spring Boot 集成](https://github.com/mybatis/spring-boot-starter) |

- **文章**
  - [深入理解 mybatis 原理](https://blog.csdn.net/luanlouis/article/details/40422941)
  - [mybatis 源码中文注释](https://github.com/tuguangquan/mybatis) - mybatis 源码解读
  - [MyBatis Generator 详解](https://blog.csdn.net/isea533/article/details/42102297)
