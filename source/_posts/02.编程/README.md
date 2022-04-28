---
title: 编程
date: 2022-04-27 17:11:50
categories:
  - 编程
tags:
  - 编程
permalink: /pages/f85bac/
abbrlink: 47867b98
hidden: true
---

# 编程

## 📖 内容

### 编程范式

- [如何学习编程语言](01.编程范式/01.如何学习编程语言.md)

### 编程语言

- [python](02.编程语言/01.python.md)
- [shell](02.编程语言/02.shell.md)
- [scala](02.编程语言/03.scala.md)

### Java

#### JavaSE

> 📚 [javacore](https://dunwu.github.io/javacore/) 是一个 Java 核心技术教程。内容包含：Java 基础特性、Java 高级特性、Java 并发、JVM、Java IO 等。

#### JavaEE

##### JavaWeb

- [JavaWeb 面经](03.Java/02.JavaEE/01.JavaWeb/99.JavaWeb面经.md)
- [JavaWeb 之 Servlet 指南](03.Java/02.JavaEE/01.JavaWeb/01.JavaWeb之Servlet指南.md)
- [JavaWeb 之 Jsp 指南](03.Java/02.JavaEE/01.JavaWeb/02.JavaWeb之Jsp指南.md)
- [JavaWeb 之 Filter 和 Listener](03.Java/02.JavaEE/01.JavaWeb/03.JavaWeb之Filter和Listener.md)
- [JavaWeb 之 Cookie 和 Session](03.Java/02.JavaEE/01.JavaWeb/04.JavaWeb之Cookie和Session.md)

##### Java 服务器

> Tomcat 和 Jetty 都是 Java 比较流行的轻量级服务器。
>
> Nginx 是目前最流行的反向代理服务器，也常用于负载均衡。

- [Tomcat 快速入门](03.Java/02.JavaEE/02.服务器/01.Tomcat/01.Tomcat快速入门.md)
- [Tomcat 连接器](03.Java/02.JavaEE/02.服务器/01.Tomcat/02.Tomcat连接器.md)
- [Tomcat 容器](03.Java/02.JavaEE/02.服务器/01.Tomcat/03.Tomcat容器.md)
- [Tomcat 优化](03.Java/02.JavaEE/02.服务器/01.Tomcat/04.Tomcat优化.md)
- [Tomcat 和 Jetty](03.Java/02.JavaEE/02.服务器/01.Tomcat/05.Tomcat和Jetty.md)
- [Jetty](03.Java/02.JavaEE/02.服务器/02.Jetty.md)

#### Java 软件

##### Java 构建

> Java 项目需要通过 [**构建工具**](03.Java/11.软件/01.构建) 来管理项目依赖，完成编译、打包、发布、生成 JavaDoc 等任务。
>
> - 目前最主流的构建工具是 Maven，它的功能非常强大。
> - Gradle 号称是要替代 Maven 等构件工具，它的版本管理确实简洁，但是需要学习 Groovy，学习成本比 Maven 高。
> - Ant 功能比 Maven 和 Gradle 要弱，现代 Java 项目基本不用了，但也有一些传统的 Java 项目还在使用。

- [Maven](03.Java/11.软件/01.构建/01.Maven) 📚
  - [Maven 快速入门](03.Java/11.软件/01.构建/01.Maven/01.Maven快速入门.md)
  - [Maven 教程之 pom.xml 详解](03.Java/11.软件/01.构建/01.Maven/02.Maven教程之pom.xml详解.md)
  - [Maven 教程之 settings.xml 详解](03.Java/11.软件/01.构建/01.Maven/03.Maven教程之settings.xml详解.md)
  - [Maven 实战问题和最佳实践](03.Java/11.软件/01.构建/01.Maven/04.Maven实战问题和最佳实践.md)
  - [Maven 教程之发布 jar 到私服或中央仓库](03.Java/11.软件/01.构建/01.Maven/05.Maven教程之发布jar到私服或中央仓库.md)
  - [Maven 插件之代码检查](03.Java/11.软件/01.构建/01.Maven/06.Maven插件之代码检查.md)
- [Ant 简易教程](03.Java/11.软件/01.构建/02.Ant.md)

##### Java IDE

> 自从有了 [**IDE**](03.Java/11.软件/02.IDE)，写代码从此就告别了刀耕火种的蛮荒时代。
>
> - [Eclipse](03.Java/11.软件/02.IDE/02.Eclipse.md) 是久负盛名的开源 Java IDE，我的学生时代一直使用它写 Java。
> - 曾经抗拒从转 [Intellij Idea](03.Java/11.软件/02.IDE/01.Intellij.md) ，但后来发现真香，不得不说，确实是目前最优秀的 Java IDE。
> - 你可以在 [vscode](03.Java/11.软件/02.IDE/03.VsCode.md) 中写各种语言，只要安装相应插件即可。如果你的项目中使用了很多种编程语言，又懒得在多个 IDE 之间切换，那么就用 vscode 来一网打尽吧。

- [Intellij Idea](03.Java/11.软件/02.IDE/01.Intellij.md)
- [Eclipse](03.Java/11.软件/02.IDE/02.Eclipse.md)
- [vscode](03.Java/11.软件/02.IDE/03.VsCode.md)

##### Java 监控诊断

> [监控/诊断](03.Java/11.软件/03.监控诊断) 工具主要用于 Java 应用的运维。通过采集、分析、存储、可视化应用的有效数据，帮助开发者、使用者快速定位问题，找到性能瓶颈。

- [监控工具对比](03.Java/11.软件/03.监控诊断/01.监控工具对比.md)
- [CAT](03.Java/11.软件/03.监控诊断/02.CAT.md)
- [Zipkin](03.Java/11.软件/03.监控诊断/03.Zipkin.md)
- [SkyWalking](03.Java/11.软件/03.监控诊断/04.Skywalking.md)
- [Arthas](03.Java/11.软件/03.监控诊断/05.Arthas.md)

#### Java 工具

##### Java IO

- [JSON 序列化](03.Java/12.工具/01.IO/01.JSON序列化.md) - [fastjson](https://github.com/alibaba/fastjson)、[Jackson](https://github.com/FasterXML/jackson)、[Gson](https://github.com/google/gson)
- [二进制序列化](03.Java/12.工具/01.IO/02.二进制序列化.md) - [Protobuf](https://developers.google.com/protocol-buffers)、[Thrift](https://thrift.apache.org/)、[Hessian](http://hessian.caucho.com/)、[Kryo](https://github.com/EsotericSoftware/kryo)、[FST](https://github.com/RuedigerMoeller/fast-serialization)

##### JavaBean 工具

- [Lombok](03.Java/12.工具/02.JavaBean/01.Lombok.md)
- [Dozer](03.Java/12.工具/02.JavaBean/02.Dozer.md)

##### Java 模板引擎

- [Freemark](03.Java/12.工具/03.模板引擎/01.Freemark.md)
- [Velocity](03.Java/12.工具/03.模板引擎/02.Thymeleaf.md)
- [Thymeleaf](03.Java/12.工具/03.模板引擎/03.Velocity.md)

##### Java 测试工具

- [Junit](03.Java/12.工具/04.测试/01.Junit.md)
- [Mockito](03.Java/12.工具/04.测试/02.Mockito.md)
- [Jmeter](03.Java/12.工具/04.测试/03.Jmeter.md)
- [JMH](03.Java/12.工具/04.测试/04.JMH.md)

##### 其他

- [Java 日志](03.Java/12.工具/99.其他/01.Java日志.md)
- [Java 工具包](03.Java/12.工具/99.其他/02.Java工具包.md)
- [Reflections](03.Java/12.工具/99.其他/03.Reflections.md)
- [JavaMail](03.Java/12.工具/99.其他/04.JavaMail.md)
- [Jsoup](03.Java/12.工具/99.其他/05.Jsoup.md)
- [Thumbnailator](03.Java/12.工具/99.其他/06.Thumbnailator.md)
- [Zxing](03.Java/12.工具/99.其他/07.Zxing.md)

#### Java 框架

##### ORM

- [Mybatis 快速入门](03.Java/13.框架/11.ORM/01.Mybatis快速入门.md)
- [Mybatis 原理](03.Java/13.框架/11.ORM/02.Mybatis原理.md)

##### Spring

📚 [spring-tutorial](https://dunwu.github.io/spring-tutorial/) 是一个 Spring 实战教程。

##### Spring Boot

📚 [Spring Boot 教程](https://dunwu.github.io/spring-boot-tutorial/) 是一个 Spring Boot 实战教程。

##### 安全

> Java 领域比较流行的安全框架就是 shiro 和 spring-security。
>
> shiro 更为简单、轻便，容易理解，能满足大多数基本安全场景下的需要。
>
> spring-security 功能更丰富，也比 shiro 更复杂。值得一提的是由于 spring-security 是 spring 团队开发，所以集成 spring 和 spring-boot 框架更容易。

- [Shiro](03.Java/13.框架/12.安全/01.Shiro.md)
- [SpringSecurity](03.Java/13.框架/12.安全/02.SpringSecurity.md)

##### IO

- [Shiro](03.Java/13.框架/13.IO/01.Netty.md)

##### 微服务

- [Dubbo](03.Java/13.框架/14.微服务/01.Dubbo.md)

#### Java 中间件

##### MQ

> 消息队列（Message Queue，简称 MQ）技术是分布式应用间交换信息的一种技术。
>
> 消息队列主要解决应用耦合，异步消息，流量削锋等问题，实现高性能，高可用，可伸缩和最终一致性架构。是大型分布式系统不可缺少的中间件。
>
> 如果想深入学习各种消息队列产品，建议先了解一下 [消息队列基本原理](https://github.com/dunwu/blog/blob/master/source/_posts/theory/mq.md) ，有助于理解消息队列特性的实现和设计思路。

- [消息队列面试](03.Java/14.中间件/01.MQ/01.消息队列面试.md)
- [消息队列基本原理](03.Java/14.中间件/01.MQ/02.消息队列基本原理.md)
- [RocketMQ](03.Java/14.中间件/01.MQ/03.RocketMQ.md)
- [ActiveMQ](03.Java/14.中间件/01.MQ/04.ActiveMQ.md)

##### 缓存

> 缓存可以说是优化系统性能的第一手段，在各种技术中都会有缓存的应用。
>
> 如果想深入学习缓存，建议先了解一下 [缓存基本原理](https://dunwu.github.io/design/distributed/分布式缓存.html)，有助于理解缓存的特性、原理，使用缓存常见的问题及解决方案。

- [缓存面试题](03.Java/14.中间件/02.缓存/01.缓存面试题.md)
- [Java 缓存中间件](03.Java/14.中间件/02.缓存/02.Java缓存中间件.md)
- [Memcached 快速入门](03.Java/14.中间件/02.缓存/03.Memcached.md)
- [Ehcache 快速入门](03.Java/14.中间件/02.缓存/04.Ehcache.md)
- [Java 进程内缓存](03.Java/14.中间件/02.缓存/05.Java进程内缓存.md)
- [Http 缓存](03.Java/14.中间件/02.缓存/06.Http缓存.md)

##### 流量控制

- [Hystrix](03.Java/14.中间件/03.流量控制/01.Hystrix.md)

## 🚪 传送

◾ 💧 [我的 IT 知识图谱](https://dunwu.github.io/waterdrop/) ◾ 🎯 [我的博客](https://dunwu.github.io/blog/) ◾
