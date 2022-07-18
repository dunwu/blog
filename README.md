<p align="center">
    <a href="https://dunwu.github.io/blog/" target="_blank" rel="noopener noreferrer">
        <img src="https://raw.githubusercontent.com/dunwu/images/dev/common/dunwu-logo.png" alt="logo" width="150px"/>
    </a>
</p>

<p align="center">

  <a href="https://github.com/dunwu/blog">
      <img alt="star" class="no-zoom" src="https://img.shields.io/github/stars/dunwu/blog?style=for-the-badge">
  </a>

  <a href="https://github.com/dunwu/blog">
      <img alt="fork" class="no-zoom" src="https://img.shields.io/github/forks/dunwu/blog?style=for-the-badge">
  </a>

  <a href="https://github.com/dunwu/blog/commits/master">
      <img alt="commit" class="no-zoom" src="https://img.shields.io/github/workflow/status/dunwu/blog/CI?style=for-the-badge">
  </a>

  <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh">
      <img alt="code style" class="no-zoom" src="https://img.shields.io/github/license/dunwu/blog?style=for-the-badge">
  </a>

</p>

<h1 align="center">blog</h1>

> 💧 [Blog](https://github.com/dunwu/blog/) 是一个十年 Java 程序员的博客。
>
> - 🔁 项目同步维护：[Github](https://github.com/dunwu/blog/) | [Gitee](https://gitee.com/turnon/blog/)
> - 📖 电子书阅读：[Github Pages](https://dunwu.github.io/blog/) | [Gitee Pages](https://turnon.gitee.io/blog/)

## Java

### JavaSE

> 📚 [javacore](https://dunwu.github.io/javacore/) 是一个 Java 核心技术教程。内容包含：Java 基础特性、Java 高级特性、Java 并发、JVM、Java IO 等。

### JavaEE

#### JavaWeb

- [JavaWeb 面经](source/_posts/01.Java/02.JavaEE/01.JavaWeb/99.JavaWeb面经.md)
- [JavaWeb 之 Servlet 指南](source/_posts/01.Java/02.JavaEE/01.JavaWeb/01.JavaWeb之Servlet指南.md)
- [JavaWeb 之 Jsp 指南](source/_posts/01.Java/02.JavaEE/01.JavaWeb/02.JavaWeb之Jsp指南.md)
- [JavaWeb 之 Filter 和 Listener](source/_posts/01.Java/02.JavaEE/01.JavaWeb/03.JavaWeb之Filter和Listener.md)
- [JavaWeb 之 Cookie 和 Session](source/_posts/01.Java/02.JavaEE/01.JavaWeb/04.JavaWeb之Cookie和Session.md)

#### Java 服务器

> Tomcat 和 Jetty 都是 Java 比较流行的轻量级服务器。
>
> Nginx 是目前最流行的反向代理服务器，也常用于负载均衡。

- [Tomcat 快速入门](source/_posts/01.Java/02.JavaEE/02.服务器/01.Tomcat/01.Tomcat快速入门.md)
- [Tomcat 连接器](source/_posts/01.Java/02.JavaEE/02.服务器/01.Tomcat/02.Tomcat连接器.md)
- [Tomcat 容器](source/_posts/01.Java/02.JavaEE/02.服务器/01.Tomcat/03.Tomcat容器.md)
- [Tomcat 优化](source/_posts/01.Java/02.JavaEE/02.服务器/01.Tomcat/04.Tomcat优化.md)
- [Tomcat 和 Jetty](source/_posts/01.Java/02.JavaEE/02.服务器/01.Tomcat/05.Tomcat和Jetty.md)
- [Jetty](source/_posts/01.Java/02.JavaEE/02.服务器/02.Jetty.md)

### Java 软件

#### Java 构建

> Java 项目需要通过 [**构建工具**](source/_posts/01.Java/11.软件/01.构建) 来管理项目依赖，完成编译、打包、发布、生成 JavaDoc 等任务。
>
> - 目前最主流的构建工具是 Maven，它的功能非常强大。
> - Gradle 号称是要替代 Maven 等构件工具，它的版本管理确实简洁，但是需要学习 Groovy，学习成本比 Maven 高。
> - Ant 功能比 Maven 和 Gradle 要弱，现代 Java 项目基本不用了，但也有一些传统的 Java 项目还在使用。

- [Maven](source/_posts/01.Java/11.软件/01.构建/01.Maven) 📚
  - [Maven 快速入门](source/_posts/01.Java/11.软件/01.构建/01.Maven/01.Maven快速入门.md)
  - [Maven 教程之 pom.xml 详解](source/_posts/01.Java/11.软件/01.构建/01.Maven/02.Maven教程之pom.xml详解.md)
  - [Maven 教程之 settings.xml 详解](source/_posts/01.Java/11.软件/01.构建/01.Maven/03.Maven教程之settings.xml详解.md)
  - [Maven 实战问题和最佳实践](source/_posts/01.Java/11.软件/01.构建/01.Maven/04.Maven实战问题和最佳实践.md)
  - [Maven 教程之发布 jar 到私服或中央仓库](source/_posts/01.Java/11.软件/01.构建/01.Maven/05.Maven教程之发布jar到私服或中央仓库.md)
  - [Maven 插件之代码检查](source/_posts/01.Java/11.软件/01.构建/01.Maven/06.Maven插件之代码检查.md)
- [Ant 简易教程](source/_posts/01.Java/11.软件/01.构建/02.Ant.md)

#### Java IDE

> 自从有了 [**IDE**](source/_posts/01.Java/11.软件/02.IDE)，写代码从此就告别了刀耕火种的蛮荒时代。
>
> - [Eclipse](source/_posts/01.Java/11.软件/02.IDE/02.Eclipse.md) 是久负盛名的开源 Java IDE，我的学生时代一直使用它写 Java。
> - 曾经抗拒从转 [Intellij Idea](source/_posts/01.Java/11.软件/02.IDE/01.Intellij.md) ，但后来发现真香，不得不说，确实是目前最优秀的 Java IDE。
> - 你可以在 [vscode](source/_posts/01.Java/11.软件/02.IDE/03.VsCode.md) 中写各种语言，只要安装相应插件即可。如果你的项目中使用了很多种编程语言，又懒得在多个 IDE 之间切换，那么就用 vscode 来一网打尽吧。

- [Intellij Idea](source/_posts/01.Java/11.软件/02.IDE/01.Intellij.md)
- [Eclipse](source/_posts/01.Java/11.软件/02.IDE/02.Eclipse.md)
- [vscode](source/_posts/01.Java/11.软件/02.IDE/03.VsCode.md)

#### Java 监控诊断

> [监控/诊断](source/_posts/01.Java/11.软件/03.监控诊断) 工具主要用于 Java 应用的运维。通过采集、分析、存储、可视化应用的有效数据，帮助开发者、使用者快速定位问题，找到性能瓶颈。

- [监控工具对比](source/_posts/01.Java/11.软件/03.监控诊断/01.监控工具对比.md)
- [CAT](source/_posts/01.Java/11.软件/03.监控诊断/02.CAT.md)
- [Zipkin](source/_posts/01.Java/11.软件/03.监控诊断/03.Zipkin.md)
- [SkyWalking](source/_posts/01.Java/11.软件/03.监控诊断/04.Skywalking.md)
- [Arthas](source/_posts/01.Java/11.软件/03.监控诊断/05.Arthas.md)

### Java 工具

#### Java IO

- [JSON 序列化](source/_posts/01.Java/12.工具/01.IO/01.JSON序列化.md) - [fastjson](https://github.com/alibaba/fastjson)、[Jackson](https://github.com/FasterXML/jackson)、[Gson](https://github.com/google/gson)
- [二进制序列化](source/_posts/01.Java/12.工具/01.IO/02.二进制序列化.md) - [Protobuf](https://developers.google.com/protocol-buffers)、[Thrift](https://thrift.apache.org/)、[Hessian](source/_posts/02.编程/http://hessian.caucho.com/)、[Kryo](https://github.com/EsotericSoftware/kryo)、[FST](https://github.com/RuedigerMoeller/fast-serialization)

#### JavaBean 工具

- [Lombok](source/_posts/01.Java/12.工具/02.JavaBean/01.Lombok.md)
- [Dozer](source/_posts/01.Java/12.工具/02.JavaBean/02.Dozer.md)

#### Java 模板引擎

- [Freemark](source/_posts/01.Java/12.工具/03.模板引擎/01.Freemark.md)
- [Velocity](source/_posts/01.Java/12.工具/03.模板引擎/02.Thymeleaf.md)
- [Thymeleaf](source/_posts/01.Java/12.工具/03.模板引擎/03.Velocity.md)

#### Java 测试工具

- [Junit](source/_posts/01.Java/12.工具/04.测试/01.Junit.md)
- [Mockito](source/_posts/01.Java/12.工具/04.测试/02.Mockito.md)
- [Jmeter](source/_posts/01.Java/12.工具/04.测试/03.Jmeter.md)
- [JMH](source/_posts/01.Java/12.工具/04.测试/04.JMH.md)

#### 其他

- [Java 日志](source/_posts/01.Java/12.工具/99.其他/01.Java日志.md)
- [Java 工具包](source/_posts/01.Java/12.工具/99.其他/02.Java工具包.md)
- [Reflections](source/_posts/01.Java/12.工具/99.其他/03.Reflections.md)
- [JavaMail](source/_posts/01.Java/12.工具/99.其他/04.JavaMail.md)
- [Jsoup](source/_posts/01.Java/12.工具/99.其他/05.Jsoup.md)
- [Thumbnailator](source/_posts/01.Java/12.工具/99.其他/06.Thumbnailator.md)
- [Zxing](source/_posts/01.Java/12.工具/99.其他/07.Zxing.md)

### Java 框架

#### Spring Boot

##### Spring Boot 基础篇

- [SpringBoot 知识图谱](source/_posts/01.Java/13.框架/02.SpringBoot/00.SpringBoot综合/01.SpringBoot知识图谱.md)
- [SpringBoot 基本原理](source/_posts/01.Java/13.框架/02.SpringBoot/00.SpringBoot综合/02.SpringBoot基本原理.md)

##### Spring Boot 基础篇

- [SpringBoot 教程之快速入门](source/_posts/01.Java/13.框架/02.SpringBoot/01.SpringBoot基础/01.SpringBoot之快速入门.md)
- [SpringBoot 之属性加载](source/_posts/01.Java/13.框架/02.SpringBoot/01.SpringBoot基础/02.SpringBoot之属性加载.md)
- [SpringBoot 之 Profile](source/_posts/01.Java/13.框架/02.SpringBoot/01.SpringBoot基础/03.SpringBoot之Profile.md)

##### Spring Boot 数据篇

- [SpringBoot 之 JDBC](source/_posts/01.Java/13.框架/02.SpringBoot/03.SpringBoot数据/01.SpringBoot之JDBC.md)
- [SpringBoot 之 Mybatis](source/_posts/01.Java/13.框架/02.SpringBoot/03.SpringBoot数据/11.SpringBoot之Mybatis.md)
- [SpringBoot 之 Elasticsearch](source/_posts/01.Java/13.框架/02.SpringBoot/03.SpringBoot数据/22.SpringBoot之Elasticsearch.md)
- [SpringBoot 之 MongoDB](source/_posts/01.Java/13.框架/02.SpringBoot/03.SpringBoot数据/23.SpringBoot之MongoDB.md)

##### Spring Boot IO 篇

- [SpringBoot 之异步请求](source/_posts/01.Java/13.框架/02.SpringBoot/04.SpringBootIO/01.SpringBoot之异步请求.md)
- [SpringBoot 之 Json](source/_posts/01.Java/13.框架/02.SpringBoot/04.SpringBootIO/02.SpringBoot之Json.md)
- [SpringBoot 之邮件](source/_posts/01.Java/13.框架/02.SpringBoot/04.SpringBootIO/03.SpringBoot之邮件.md)

#### ORM

- [Mybatis 快速入门](source/_posts/01.Java/13.框架/11.ORM/01.Mybatis快速入门.md)
- [Mybatis 原理](source/_posts/01.Java/13.框架/11.ORM/02.Mybatis原理.md)

#### 安全

> Java 领域比较流行的安全框架就是 shiro 和 spring-security。
>
> shiro 更为简单、轻便，容易理解，能满足大多数基本安全场景下的需要。
>
> spring-security 功能更丰富，也比 shiro 更复杂。值得一提的是由于 spring-security 是 spring 团队开发，所以集成 spring 和 spring-boot 框架更容易。

- [Shiro](source/_posts/01.Java/13.框架/12.安全/01.Shiro.md)
- [SpringSecurity](source/_posts/01.Java/13.框架/12.安全/02.SpringSecurity.md)

#### IO

- [Shiro](source/_posts/01.Java/13.框架/13.IO/01.Netty.md)

### Java 中间件

#### 缓存

> 缓存可以说是优化系统性能的第一手段，在各种技术中都会有缓存的应用。
>
> 如果想深入学习缓存，建议先了解一下 [缓存基本原理](https://dunwu.github.io/design/distributed/分布式缓存.html)，有助于理解缓存的特性、原理，使用缓存常见的问题及解决方案。

- [缓存面试题](source/_posts/01.Java/14.中间件/02.缓存/01.缓存面试题.md)
- [Java 缓存中间件](source/_posts/01.Java/14.中间件/02.缓存/02.Java缓存中间件.md)
- [Memcached 快速入门](source/_posts/01.Java/14.中间件/02.缓存/03.Memcached.md)
- [Ehcache 快速入门](source/_posts/01.Java/14.中间件/02.缓存/04.Ehcache.md)
- [Java 进程内缓存](source/_posts/01.Java/14.中间件/02.缓存/05.Java进程内缓存.md)
- [Http 缓存](source/_posts/01.Java/14.中间件/02.缓存/06.Http缓存.md)

#### 流量控制

- [Hystrix](source/_posts/01.Java/14.中间件/03.流量控制/01.Hystrix.md)

## 计算机科学

### 数据结构和算法

- **综合**
  - [数据结构和算法指南](source/_posts/11.数据结构和算法/00.综合/01.数据结构和算法指南.md)
  - [复杂度分析](source/_posts/11.数据结构和算法/00.综合/02.复杂度分析.md) - 关键词：**`时间复杂度`**、**`空间复杂度`**、**`大 O 表示法`**、**`复杂度量级`**
- **线性表**
  - [数组和链表](source/_posts/11.数据结构和算法/01.线性表/01.数组和链表.md) - 关键词：**`线性表`**、**`一维数组`**、**`多维数组`**、**`随机访问`**、**`单链表`**、**`双链表`**、**`循环链表`**
  - [栈和队列](source/_posts/11.数据结构和算法/01.线性表/02.栈和队列.md) - 关键词：**`先进后出`**、**`后进先出`**、**`循环队列`**
  - [线性表的查找](source/_posts/11.数据结构和算法/01.线性表/11.线性表的查找.md)
  - [线性表的排序](source/_posts/11.数据结构和算法/01.线性表/12.线性表的排序.md)
- **树**
  - [树和二叉树](source/_posts/11.数据结构和算法/02.树/01.树和二叉树.md)
  - [堆](source/_posts/11.数据结构和算法/02.树/02.堆.md)
  - [B+树](source/_posts/11.数据结构和算法/02.树/03.B+树.md)
  - [LSM 树](source/_posts/11.数据结构和算法/02.树/04.LSM树.md)
  - [字典树](source/_posts/11.数据结构和算法/02.树/05.字典树.md)
  - [红黑树](source/_posts/11.数据结构和算法/02.树/06.红黑树.md)
- [哈希表](source/_posts/11.数据结构和算法/03.哈希表.md) - 关键词：**`哈希函数`**、**`装载因子`**、**`哈希冲突`**、**`开放寻址法`**、**`拉链法`**
- [跳表](source/_posts/11.数据结构和算法/04.跳表.md) - 关键词：**`多级索引`**
- [图](source/_posts/11.数据结构和算法/05.图.md)

### 数据库

#### 数据库综合

- [Nosql 技术选型](source/_posts/12.数据库/01.数据库综合/01.Nosql技术选型.md)
- [数据结构与数据库索引](source/_posts/12.数据库/01.数据库综合/02.数据结构与数据库索引.md)

#### 数据库中间件

- [ShardingSphere 简介](source/_posts/12.数据库/02.数据库中间件/01.Shardingsphere/01.ShardingSphere简介.md)
- [ShardingSphere Jdbc](source/_posts/12.数据库/02.数据库中间件/01.Shardingsphere/02.ShardingSphereJdbc.md)
- [版本管理中间件 Flyway](source/_posts/12.数据库/02.数据库中间件/02.Flyway.md)

#### 关系型数据库

> [关系型数据库](source/_posts/12.数据库/03.关系型数据库) 整理主流关系型数据库知识点。

##### 公共知识

- [关系型数据库面试总结](source/_posts/12.数据库/03.关系型数据库/01.综合/01.关系型数据库面试.md) 💯
- [SQL 必知必会](source/_posts/12.数据库/03.关系型数据库/01.综合/03.SQL必知必会.md) 是一个 SQL 入门教程。
- [扩展 SQL](source/_posts/12.数据库/03.关系型数据库/01.综合/03.扩展SQL.md) 是一个 SQL 入门教程。

##### Mysql

- [Mysql 应用指南](source/_posts/12.数据库/03.关系型数据库/02.Mysql/01.Mysql应用指南.md) ⚡
- [Mysql 工作流](source/_posts/12.数据库/03.关系型数据库/02.Mysql/02.MySQL工作流.md) - 关键词：`连接`、`缓存`、`语法分析`、`优化`、`执行引擎`、`redo log`、`bin log`、`两阶段提交`
- [Mysql 事务](source/_posts/12.数据库/03.关系型数据库/02.Mysql/03.Mysql事务.md) - 关键词：`ACID`、`AUTOCOMMIT`、`事务隔离级别`、`死锁`、`分布式事务`
- [Mysql 锁](source/_posts/12.数据库/03.关系型数据库/02.Mysql/04.Mysql锁.md) - 关键词：`乐观锁`、`表级锁`、`行级锁`、`意向锁`、`MVCC`、`Next-key 锁`
- [Mysql 索引](source/_posts/12.数据库/03.关系型数据库/02.Mysql/05.Mysql索引.md) - 关键词：`Hash`、`B 树`、`聚簇索引`、`回表`
- [Mysql 性能优化](source/_posts/12.数据库/03.关系型数据库/02.Mysql/06.Mysql性能优化.md)
- [Mysql 运维](source/_posts/12.数据库/03.关系型数据库/02.Mysql/20.Mysql运维.md) 🔨
- [Mysql 配置](source/_posts/12.数据库/03.关系型数据库/02.Mysql/21.Mysql配置.md) 🔨
- [Mysql 问题](source/_posts/12.数据库/03.关系型数据库/02.Mysql/99.Mysql常见问题.md)

##### 其他

- [PostgreSQL 应用指南](source/_posts/12.数据库/03.关系型数据库/99.其他/01.PostgreSQL.md)
- [H2 应用指南](source/_posts/12.数据库/03.关系型数据库/99.其他/02.H2.md)
- [SqLite 应用指南](source/_posts/12.数据库/03.关系型数据库/99.其他/03.Sqlite.md)

#### 文档数据库

##### MongoDB

> MongoDB 是一个基于文档的分布式数据库，由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。
>
> MongoDB 是一个介于关系型数据库和非关系型数据库之间的产品。它是非关系数据库当中功能最丰富，最像关系数据库的。它支持的数据结构非常松散，是类似 json 的 bson 格式，因此可以存储比较复杂的数据类型。
>
> MongoDB 最大的特点是它支持的查询语言非常强大，其语法有点类似于面向对象的查询语言，几乎可以实现类似关系数据库单表查询的绝大部分功能，而且还支持对数据建立索引。

- [MongoDB 应用指南](source/_posts/12.数据库/04.文档数据库/01.MongoDB/01.MongoDB应用指南.md)
- [MongoDB 的 CRUD 操作](source/_posts/12.数据库/04.文档数据库/01.MongoDB/02.MongoDB的CRUD操作.md)
- [MongoDB 聚合操作](source/_posts/12.数据库/04.文档数据库/01.MongoDB/03.MongoDB的聚合操作.md)
- [MongoDB 事务](source/_posts/12.数据库/04.文档数据库/01.MongoDB/04.MongoDB事务.md)
- [MongoDB 建模](source/_posts/12.数据库/04.文档数据库/01.MongoDB/05.MongoDB建模.md)
- [MongoDB 建模示例](source/_posts/12.数据库/04.文档数据库/01.MongoDB/06.MongoDB建模示例.md)
- [MongoDB 索引](source/_posts/12.数据库/04.文档数据库/01.MongoDB/07.MongoDB索引.md)
- [MongoDB 复制](source/_posts/12.数据库/04.文档数据库/01.MongoDB/08.MongoDB复制.md)
- [MongoDB 分片](source/_posts/12.数据库/04.文档数据库/01.MongoDB/09.MongoDB分片.md)
- [MongoDB 运维](source/_posts/12.数据库/04.文档数据库/01.MongoDB/20.MongoDB运维.md)

#### KV 数据库

##### Redis

- [Redis 面试总结](source/_posts/12.数据库/05.KV数据库/01.Redis/01.Redis面试总结.md) 💯
- [Redis 应用指南](source/_posts/12.数据库/05.KV数据库/01.Redis/02.Redis应用指南.md) ⚡ - 关键词：`内存淘汰`、`事件`、`事务`、`管道`、`发布与订阅`
- [Redis 数据类型和应用](source/_posts/12.数据库/05.KV数据库/01.Redis/03.Redis数据类型和应用.md) - 关键词：`STRING`、`HASH`、`LIST`、`SET`、`ZSET`、`BitMap`、`HyperLogLog`、`Geo`
- [Redis 持久化](source/_posts/12.数据库/05.KV数据库/01.Redis/04.Redis持久化.md) - 关键词：`RDB`、`AOF`、`SAVE`、`BGSAVE`、`appendfsync`
- [Redis 复制](source/_posts/12.数据库/05.KV数据库/01.Redis/05.Redis复制.md) - 关键词：`SLAVEOF`、`SYNC`、`PSYNC`、`REPLCONF ACK`
- [Redis 哨兵](source/_posts/12.数据库/05.KV数据库/01.Redis/06.Redis哨兵.md) - 关键词：`Sentinel`、`PING`、`INFO`、`Raft`
- [Redis 集群](source/_posts/12.数据库/05.KV数据库/01.Redis/07.Redis集群.md) - 关键词：`CLUSTER MEET`、`Hash slot`、`MOVED`、`ASK`、`SLAVEOF no one`、`redis-trib`
- [Redis 实战](source/_posts/12.数据库/05.KV数据库/01.Redis/08.Redis实战.md) - 关键词：`缓存`、`分布式锁`、`布隆过滤器`
- [Redis 运维](source/_posts/12.数据库/05.KV数据库/01.Redis/20.Redis运维.md) 🔨 - 关键词：`安装`、`命令`、`集群`、`客户端`

#### 搜索引擎数据库

##### Elasticsearch

> Elasticsearch 是一个基于 Lucene 的搜索和数据分析工具，它提供了一个分布式服务。Elasticsearch 是遵从 Apache 开源条款的一款开源产品，是当前主流的企业级搜索引擎。

- [Elasticsearch 面试总结](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/01.Elasticsearch面试总结.md) 💯
- [Elasticsearch 快速入门](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/02.Elasticsearch快速入门.md)
- [Elasticsearch 简介](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/03.Elasticsearch简介.md)
- [Elasticsearch 索引](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/04.Elasticsearch索引.md)
- [Elasticsearch 查询](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/05.Elasticsearch查询.md)
- [Elasticsearch 高亮](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/06.Elasticsearch高亮.md)
- [Elasticsearch 排序](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/07.Elasticsearch排序.md)
- [Elasticsearch 聚合](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/08.Elasticsearch聚合.md)
- [Elasticsearch 分析器](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/09.Elasticsearch分析器.md)
- [Elasticsearch 性能优化](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/10.Elasticsearch性能优化.md)
- [Elasticsearch Rest API](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/11.ElasticsearchRestApi.md)
- [ElasticSearch Java API 之 High Level REST Client](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/12.ElasticsearchHighLevelRestJavaApi.md)
- [Elasticsearch 集群和分片](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/13.Elasticsearch集群和分片.md)
- [Elasticsearch 运维](source/_posts/12.数据库/07.搜索引擎数据库/01.Elasticsearch/20.Elasticsearch运维.md)

##### Elastic

- [Elastic 快速入门](source/_posts/12.数据库/07.搜索引擎数据库/02.Elastic/01.Elastic快速入门.md)
- [Elastic 技术栈之 Filebeat](source/_posts/12.数据库/07.搜索引擎数据库/02.Elastic/02.Elastic技术栈之Filebeat.md)
- [Filebeat 运维](source/_posts/12.数据库/07.搜索引擎数据库/02.Elastic/03.Filebeat运维.md)
- [Elastic 技术栈之 Kibana](source/_posts/12.数据库/07.搜索引擎数据库/02.Elastic/04.Elastic技术栈之Kibana.md)
- [Kibana 运维](source/_posts/12.数据库/07.搜索引擎数据库/02.Elastic/05.Kibana运维.md)
- [Elastic 技术栈之 Logstash](source/_posts/12.数据库/07.搜索引擎数据库/02.Elastic/06.Elastic技术栈之Logstash.md)
- [Logstash 运维](source/_posts/12.数据库/07.搜索引擎数据库/02.Elastic/07.Logstash运维.md)

### 网络

> 如果你是做通信领域的开发，或者是 Web 应用的开发，那就或多或少需要了解一些计算机网络的知识 。

#### 网络综合

> 理解计算机网络，首先需要从宏观层面了解计算机网络通信的分层结构。最有代表性的是 OSI 七层结构模型，但现实中更流行的是五层结构模型。
>
> 了解网络分层结构，需要了解每个网络层级在网络通信中的定位，以及这个层级主要的通信设备、通信协议。

- [计算机网络面试总结](source/_posts/13.网络/01.网络综合/01.计算机网络面试.md)
- [计算机网络指南](source/_posts/13.网络/01.网络综合/02.计算机网络指南.md) - 关键词：核心概念、拓扑结构、作用范围、性能指标、体系结构
- **网络分层**
  - [计算机网络之物理层](source/_posts/13.网络/01.网络综合/11.物理层.md) - 关键词：调制、解调、数字信号、模拟信号、通信媒介、信道复用
  - [计算机网络之数据链路层](source/_posts/13.网络/01.网络综合/12.数据链路层.md) - 关键词：点对点信道、广播信道、`PPP`、`CSMA/CD`、局域网、以太网、`MAC`、适配器、集线器、网桥、交换机
  - [计算机网络之网络层](source/_posts/13.网络/01.网络综合/13.网络层.md) - 关键词：`IP`、`ICMP`、`ARP`、路由
  - [计算机网络之传输层](source/_posts/13.网络/01.网络综合/14.传输层.md) - 关键词：`UDP`、`TCP`、滑动窗口、拥塞控制、三次握手
  - [计算机网络之应用层](source/_posts/13.网络/01.网络综合/15.应用层.md) - 关键词：`HTTP`、`DNS`、`FTP`、`TELNET`、`DHCP`

#### 网络协议

- [超文本传输协议 HTTP](source/_posts/13.网络/02.网络协议/01.HTTP.md)
- [域名系统协议 DNS](source/_posts/13.网络/02.网络协议/02.DNS)
- [传输控制协议 TCP](source/_posts/13.网络/02.网络协议/03.TCP.md)
- [用户数据报协议 UDP](source/_posts/13.网络/02.网络协议/04.UDP.md)
- [ICMP](source/_posts/13.网络/02.网络协议/05.ICMP.md)

#### 网络技术

- [WebSocket](source/_posts/13.网络/03.网络技术/01.WebSocket.md)
- [CDN](source/_posts/13.网络/03.网络技术/02.CDN.md)
- [VPN](source/_posts/13.网络/03.网络技术/03.VPN.md)

### 分布式

#### 分布式综合

- [分布式面试总结](source/_posts/15.分布式/00.分布式综合/99.分布式面试.md)

#### 分布式理论

- [分布式理论](source/_posts/15.分布式/01.分布式理论/01.分布式基础理论.md) - 关键词：`拜占庭将军`、`CAP`、`BASE`、`错误的分布式假设`
- [分布式算法 Paxos](source/_posts/15.分布式/01.分布式理论/11.Paxos算法.md) - 关键词：`共识性算法`
- [分布式算法 Raft](source/_posts/15.分布式/01.分布式理论/12.Raft算法.md) - 关键词：`共识性算法`
- [分布式算法 Gossip](source/_posts/15.分布式/01.分布式理论/13.Gossip算法.md) - 关键词：`数据传播`

#### 分布式协同

- **分布式协同综合**
  - 集群
  - [分布式复制](source/_posts/15.分布式/11.分布式协同/01.分布式协同综合/02.分布式复制.md)
  - 分区
  - 选主
  - [分布式事务](source/_posts/15.分布式/11.分布式协同/01.分布式协同综合/05.分布式事务.md) - 关键词：`2PC`、`3PC`、`TCC`、`本地消息表`、`MQ 消息`、`SAGA`
  - [分布式锁](source/_posts/15.分布式/11.分布式协同/01.分布式协同综合/06.分布式锁.md) - 关键词：`数据库`、`Redis`、`ZooKeeper`、`互斥`、`可重入`、`死锁`、`容错`、`自旋尝试`
- **ZooKeeper**
  - [ZooKeeper 原理](source/_posts/15.分布式/11.分布式协同/02.ZooKeeper/01.ZooKeeper原理.md)
  - [ZooKeeper Java Api](source/_posts/15.分布式/11.分布式协同/02.ZooKeeper/02.ZooKeeperJavaApi.md)
  - [ZooKeeper 命令](source/_posts/15.分布式/11.分布式协同/02.ZooKeeper/03.ZooKeeper命令.md)
  - [ZooKeeper 运维](source/_posts/15.分布式/11.分布式协同/02.ZooKeeper/04.ZooKeeper运维.md)
  - [ZooKeeper Acl](source/_posts/15.分布式/11.分布式协同/02.ZooKeeper/05.ZooKeeperAcl.md)

#### 分布式调度

- [流量控制](source/_posts/15.分布式/12.分布式调度/03.流量控制.md) - 关键词：`限流`、`熔断`、`降级`、`计数器法`、`时间窗口法`、`令牌桶法`、`漏桶法`
- [负载均衡](source/_posts/15.分布式/12.分布式调度/02.负载均衡.md) - 关键词：`轮询`、`随机`、`最少连接`、`源地址哈希`、`一致性哈希`、`虚拟 hash 槽`
- [服务路由](source/_posts/15.分布式/12.分布式调度/01.服务路由.md) - 关键词：`路由`、`条件路由`、`脚本路由`、`标签路由`
- [分布式会话](source/_posts/15.分布式/12.分布式调度/10.分布式会话.md) - 关键词：`粘性 Session`、`Session 复制共享`、`基于缓存的 session 共享`
- [分布式 ID](source/_posts/15.分布式/12.分布式调度/04.分布式ID.md) - 关键词：`UUID`、`自增序列`、`雪花算法`、`Leaf`

#### 分布式高可用

- [服务容错](source/_posts/15.分布式/13.分布式高可用/02.服务容错.md)

#### 分布式通信

#### RPC

##### RPC 综合

- [RPC 基础](source/_posts/15.分布式/21.分布式通信/01.RPC/00.RPC综合/01.RPC基础.md)
- [RPC 进阶](source/_posts/15.分布式/21.分布式通信/01.RPC/00.RPC综合/02.RPC进阶.md)
- [RPC 高级](source/_posts/15.分布式/21.分布式通信/01.RPC/00.RPC综合/03.RPC高级.md)
- [服务注册和发现](source/_posts/15.分布式/21.分布式通信/01.RPC/00.RPC综合/11.服务注册和发现.md)

#### MQ

##### MQ 综合

- [消息队列面试](source/_posts/15.分布式/21.分布式通信/02.MQ/00.MQ综合/01.消息队列面试.md)
- [消息队列基本原理](source/_posts/15.分布式/21.分布式通信/02.MQ/00.MQ综合/02.消息队列基本原理.md)

##### Kafka

- [Kafka 快速入门](source/_posts/15.分布式/21.分布式通信/02.MQ/01.Kafka/01.Kafka快速入门.md)
- [Kafka 生产者](source/_posts/15.分布式/21.分布式通信/02.MQ/01.Kafka/02.Kafka生产者.md)
- [Kafka 消费者](source/_posts/15.分布式/21.分布式通信/02.MQ/01.Kafka/03.Kafka消费者.md)
- [Kafka 集群](source/_posts/15.分布式/21.分布式通信/02.MQ/01.Kafka/04.Kafka集群.md)
- [Kafka 可靠传输](source/_posts/15.分布式/21.分布式通信/02.MQ/01.Kafka/05.Kafka可靠传输.md)
- [Kafka 存储](source/_posts/15.分布式/21.分布式通信/02.MQ/01.Kafka/06.Kafka存储.md)
- [Kafka 流式处理](source/_posts/15.分布式/21.分布式通信/02.MQ/01.Kafka/07.Kafka流式处理.md)
- [Kafka 运维](source/_posts/15.分布式/21.分布式通信/02.MQ/01.Kafka/08.Kafka运维.md)

##### RocketMQ

- [RocketMQ 快速入门](source/_posts/15.分布式/21.分布式通信/02.MQ/02.RocketMQ/01.RocketMQ快速入门.md)
- [RocketMQ 基本原理](source/_posts/15.分布式/21.分布式通信/02.MQ/02.RocketMQ/02.RocketMQ基本原理.md)
- [RocketMQ Faq](source/_posts/15.分布式/21.分布式通信/02.MQ/02.RocketMQ/99.RocketMQFaq.md)

##### 其他 MQ

- [ActiveMQ](source/_posts/15.分布式/21.分布式通信/02.MQ/99.其他MQ/01.ActiveMQ.md)

#### 分布式存储

- [数据缓存](source/_posts/15.分布式/22.分布式存储/01.数据缓存.md) - 关键词：`进程内缓存`、`分布式缓存`、`缓存雪崩`、`缓存穿透`、`缓存击穿`、`缓存更新`、`缓存预热`、`缓存降级`
- [读写分离](source/_posts/15.分布式/22.分布式存储/02.读写分离.md)
- [分库分表](source/_posts/15.分布式/22.分布式存储/03.分库分表.md) - 关键词：`分片`、`路由`、`迁移`、`扩容`、`双写`、`聚合`

## 编程

### 编程范式

- [如何学习编程语言](source/_posts/02.编程/01.编程范式/01.如何学习编程语言.md)

### 编程语言

- [python](source/_posts/02.编程/02.编程语言/01.python.md)
- [shell](source/_posts/02.编程/02.编程语言/02.shell.md)
- [scala](source/_posts/02.编程/02.编程语言/03.scala.md)

## 设计

### 架构

#### 综合

- [如何设计系统](source/_posts/03.设计/01.架构/00.综合/00.如何设计系统.md)
- [系统架构面试总结](source/_posts/03.设计/01.架构/00.综合/01.系统架构面试.md)
- [系统架构概述](source/_posts/03.设计/01.架构/00.综合/02.系统架构概述.md)
- [系统高性能架构](source/_posts/03.设计/01.架构/00.综合/03.系统高性能架构.md)
- [系统高可用架构](source/_posts/03.设计/01.架构/00.综合/04.系统高可用架构.md)
- [系统伸缩性架构](source/_posts/03.设计/01.架构/00.综合/05.系统伸缩性架构.md)
- [系统扩展性架构](source/_posts/03.设计/01.架构/00.综合/06.系统扩展性架构.md)
- [系统安全性架构](source/_posts/03.设计/01.架构/00.综合/07.系统安全性架构.md)
- [大型系统核心技术](source/_posts/03.设计/01.架构/00.综合/08.大型系统核心技术.md)
- [系统测试架构](source/_posts/03.设计/01.架构/00.综合/09.系统测试架构.md)

#### 微服务

- [微服务简介](source/_posts/03.设计/01.架构/01.微服务/01.微服务简介.md)
- [微服务基本原理](source/_posts/03.设计/01.架构/01.微服务/02.微服务基本原理.md)

#### 安全

- [认证和授权](source/_posts/03.设计/01.架构/02.安全/01.认证和授权.md)
- [OAuth2.0](source/_posts/03.设计/01.架构/02.安全/02.OAuth2.0.md)

### 设计模式

[面向对象原则](source/_posts/03.设计/02.设计模式/25.面向对象原则.md)

#### 创建型模式

> 创建型模式提供了创建对象的机制， 能够提升已有代码的灵活性和可复用性。

- [简单工厂模式 (Simple Factory)](source/_posts/03.设计/02.设计模式/01.简单工厂模式.md)
- [工厂方法模式 (Factory Method)](source/_posts/03.设计/02.设计模式/02.工厂方法模式.md)
- [抽象工厂模式 (Abstract Factory)](source/_posts/03.设计/02.设计模式/03.抽象工厂模式.md)
- [建造者模式 (Builder)](source/_posts/03.设计/02.设计模式/04.建造者模式.md)
- [原型模式 (Prototype)](source/_posts/03.设计/02.设计模式/05.原型模式.md)
- [单例模式 (Singleton)](source/_posts/03.设计/02.设计模式/06.单例模式.md)

#### 结构型模式

> 结构型模式介绍如何将对象和类组装成较大的结构， 并同时保持结构的灵活和高效。

- [适配器模式 (Adapter)](source/_posts/03.设计/02.设计模式/07.适配器模式.md)
- [桥接模式 (Bridge)](source/_posts/03.设计/02.设计模式/08.桥接模式.md)
- [组合模式 (Composite)](source/_posts/03.设计/02.设计模式/09.组合模式.md)
- [装饰模式 (Decorator)](source/_posts/03.设计/02.设计模式/10.装饰模式.md)
- [外观模式 (Facade)](source/_posts/03.设计/02.设计模式/11.外观模式.md)
- [享元模式 (Flyweight)](source/_posts/03.设计/02.设计模式/12.享元模式.md)
- [代理模式 (Proxy)](source/_posts/03.设计/02.设计模式/13.代理模式.md)

#### 行为型模式

> 行为模式负责对象间的高效沟通和职责委派。

- [模板方法模式 (Template Method)](source/_posts/03.设计/02.设计模式/14.模板方法模式.md)
- [命令模式 (Command)](source/_posts/03.设计/02.设计模式/15.命令模式.md)
- [迭代器模式 (Iterator)](source/_posts/03.设计/02.设计模式/16.迭代器模式.md)
- [观察者模式 (Observer)](source/_posts/03.设计/02.设计模式/17.观察者模式.md)
- [解释器模式 (Interpreter)](source/_posts/03.设计/02.设计模式/18.解释器模式.md)
- [中介者模式 (Mediator)](source/_posts/03.设计/02.设计模式/19.中介者模式.md)
- [职责链模式 (Chain of Responsibility)](source/_posts/03.设计/02.设计模式/20.职责链模式.md)
- [备忘录模式 (Memento)](source/_posts/03.设计/02.设计模式/21.备忘录模式.md)
- [策略模式 (Strategy)](source/_posts/03.设计/02.设计模式/22.策略模式.md)
- [访问者模式 (Visitor)](source/_posts/03.设计/02.设计模式/23.访问者模式.md)
- [状态模式 (State)](source/_posts/03.设计/02.设计模式/24.状态模式.md)

### 重构

- [代码的坏味道和重构](source/_posts/03.设计/03.重构/01.代码的坏味道和重构.md)
- [代码坏味道之代码臃肿](source/_posts/03.设计/03.重构/02.代码坏味道之代码臃肿.md)
- [代码坏味道之滥用面向对象](source/_posts/03.设计/03.重构/03.代码坏味道之滥用面向对象.md)
- [代码坏味道之变革的障碍](source/_posts/03.设计/03.重构/04.代码坏味道之变革的障碍.md)
- [代码坏味道之非必要的](source/_posts/03.设计/03.重构/05.代码坏味道之非必要的.md)
- [代码坏味道之耦合](source/_posts/03.设计/03.重构/06.代码坏味道之耦合.md)

### UML

- [UML 快速入门](source/_posts/03.设计/11.UML/01.UML快速入门.md)
- [UML 结构建模图](source/_posts/03.设计/11.UML/02.UML结构建模图.md)
- [UML 行为建模图](source/_posts/03.设计/11.UML/03.UML行为建模图.md)

## DevOps

### CI

### CD

### 监控

- [监控体系](source/_posts/04.DevOps/03.监控/01.监控体系.md)
- [链路监控](source/_posts/04.DevOps/03.监控/02.链路监控.md)

### 工具

- Git
  - [如何优雅的玩转 Git](source/_posts/04.DevOps/99.工具/01.Git/01.如何优雅的玩转Git.md)
  - [Git 帮助手册](source/_posts/04.DevOps/99.工具/01.Git/02.Git帮助手册.md)
- 其他
  - [正则表达式极简教程](source/_posts/04.DevOps/99.工具/99.其他/01.正则表达式.md)

## 工作

- [Markdown 极简教程](source/_posts/96.工作/01.效能/99.工具/01.Markdown.md)

## 🚪 传送

◾ 💧 [钝悟的 IT 知识图谱](https://dunwu.github.io/waterdrop/) ◾ 🎯 [钝悟的博客](https://dunwu.github.io/blog/) ◾
