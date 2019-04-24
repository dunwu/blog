---
title: SpringBootTutorialLibLog
date: 2019-03-06
---

# SpringBootTutorialLibLog

> Spring Boot 支持集成 Java 世界主流的日志库。
>
> 如果对于 Java 日志库不熟悉，可以参考：[细说 Java 主流日志工具库](https://github.com/dunwu/blog/blob/master/编程语言/Java/javastack/javalib/java-log.md)
>
> 关键词： `log4j`, `log4j2`, `logback`, `slf4j`

<!-- TOC depthFrom:2 depthTo:3 -->

- [日志格式](#日志格式)
- [控制台输出](#控制台输出)
    - [彩色打印](#彩色打印)
- [文件输出](#文件输出)
- [日志级别](#日志级别)
- [日志组](#日志组)
- [日志配置文件](#日志配置文件)
- [Logback 扩展](#logback-扩展)
    - [profile 指定配置](#profile-指定配置)
    - [环境属性](#环境属性)
- [Spring Boot 中的日志配置](#spring-boot-中的日志配置)
- [源码](#源码)
- [更多内容](#更多内容)

<!-- /TOC -->

Spring Boot 内部日志全部使用 [Commons Logging](https://commons.apache.org/logging) 记录，但保留底层日志实现。为 [Java Util Logging](https://docs.oracle.com/javase/8/docs/api//java/util/logging/package-summary.html)，[Log4J2](https://logging.apache.org/log4j/2.x/)，和 [Logback](http://logback.qos.ch/) 提供了默认配置。在每种情况下，记录器都预先配置为使用控制台输出，并且还提供可选的文件输出。

默认情况下，如果使用“Starters”，则使用 Logback 进行日志记录。还包括适当的 Logback 路由，以确保使用 Java Util Logging，Commons Logging，Log4J 或 SLF4J 的依赖库都能正常工作。

## 日志格式

Spring Boot 日志默认格式类似下面的形式：

```
2014-03-05 10:57:51.112  INFO 45469 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet Engine: Apache Tomcat/7.0.52
2014-03-05 10:57:51.253  INFO 45469 --- [ost-startStop-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2014-03-05 10:57:51.253  INFO 45469 --- [ost-startStop-1] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 1358 ms
2014-03-05 10:57:51.698  INFO 45469 --- [ost-startStop-1] o.s.b.c.e.ServletRegistrationBean        : Mapping servlet: 'dispatcherServlet' to [/]
2014-03-05 10:57:51.702  INFO 45469 --- [ost-startStop-1] o.s.b.c.embedded.FilterRegistrationBean  : Mapping filter: 'hiddenHttpMethodFilter' to: [/*]
```

> 说明：
>
> - 日期和时间：精确到微秒
> - 日志级别：`ERROR`, `WARN`, `INFO`, `DEBUG`, or `TRACE`.
> - 进程 ID
> - `---` 分隔符后面是实际的日志内容
> - 线程名
> - 日志名
> - 日志内容

## 控制台输出

Spring Boot 默认打印信息到控制台，并且仅打印`ERROR`, `WARN`, `INFO` 级别信息。

如果你想打印 debug 级别信息，可以设置 jar 启动参数，如下：

```
$ java -jar myapp.jar --debug
```

此外，也可以在 `application.properties` 中设置 `debug = true` 。

打印 `trace` 级别信息同上所示。

### 彩色打印

如果您的终端支持 ANSI，可以使用彩色打印来提高可读性。您可以将 spring.output.ansi.enabled 设置为支持的值以覆盖自动检测。
使用 ％clr 转换字配置颜色编码。在最简单的形式中，转换器根据日志级别对输出进行着色，如以下示例所示：

```
%clr(%5p)
%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){yellow}
```

支持以下的颜色和样式：

- `blue`
- `cyan`
- `faint`
- `green`
- `magenta`
- `red`
- `yellow`

## 文件输出

默认情况下，Spring Boot 仅记录到控制台，不会写入日志文件。如果除了控制台输出之外还要编写日志文件，则需要设置 `logging.file` 或 `logging.path` 属性（例如，在 application.properties 中）。

详细配置参考：[配置](#配置)

## 日志级别

所有支持的日志系统都可以 在 Spring 环境中通过 `logging.level.<logger-name>=<level>` 属性设置日志级别（例如，在 `application.properties` 中）。其中 level 是 `TRACE`、`DEBUG`、`INFO`、`WARN` 、`ERROR`、`FATAL` 或 `OFF`。可以使用 logging.level.root 配置根记录器。

示例：

```properties
logging.level.root=WARN
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate=ERROR
```

## 日志组

能够将相关记录器组合在一起以便可以同时配置它们通常很有用。例如，您可以更改所有 Tomcat 相关记录器的日志记录级别，但您无法轻松记住顶级软件包。

Spring Boot 通过 logging.group 属性来提供这样的支持。

```properties
logging.group.tomcat=org.apache.catalina, org.apache.coyote, org.apache.tomcat
logging.level.tomcat=TRACE
```

以下是 Spring Boot 预设的日志组：

| 名称 | Loggers                                                                                 |
| ---- | --------------------------------------------------------------------------------------- |
| web  | `org.springframework.core.codec`, `org.springframework.http`, `org.springframework.web` |
| sql  | `org.springframework.jdbc.core`, `org.hibernate.SQL`                                    |

## 日志配置文件

可以通过在 classpath 中包含适当的库来激活各种日志记录系统，并且可以通过在 classpath 的根目录中或在以下 Spring `Environment` 属性指定的位置提供合适的配置文件来进一步自定义：`logging.config`。

您可以使用 `org.springframework.boot.logging.LoggingSystem` 系统属性强制 Spring Boot 使用特定的日志记录系统。该值应该是 `LoggingSystem` 实现的完全限定类名。您还可以使用 `none` 值完全禁用 Spring Boot 的日志记录配置。

由于在创建 `ApplicationContext` 之前初始化日志记录，因此无法在 Spring `@Configuration` 文件中控制来自 `@PropertySources` 的日志记录。更改日志记录系统或完全禁用它的唯一方法是通过系统属性。

## Logback 扩展

### profile 指定配置

可以通过 `<springProfile>` 指定特定的 profile 下的配置，如下：

```xml
<springProfile name="staging">
	<!-- configuration to be enabled when the "staging" profile is active -->
</springProfile>

<springProfile name="dev | staging">
	<!-- configuration to be enabled when the "dev" or "staging" profiles are active -->
</springProfile>

<springProfile name="!production">
	<!-- configuration to be enabled when the "production" profile is not active -->
</springProfile>
```

### 环境属性

`<springProperty>` 标签允许指定从 `Environment` 中获取的属性，并在配置文件中引用。

```xml
<springProperty scope="context" name="fluentHost" source="myapp.fluentd.host"
		defaultValue="localhost"/>
<appender name="FLUENT" class="ch.qos.logback.more.appenders.DataFluentAppender">
	<remoteHost>${fluentHost}</remoteHost>
	...
</appender>
```

## Spring Boot 中的日志配置

```properties
logging.config= # Location of the logging configuration file. For instance, `classpath:logback.xml` for Logback.
logging.exception-conversion-word=%wEx # Conversion word used when logging exceptions.
logging.file= # Log file name (for instance, `myapp.log`). Names can be an exact location or relative to the current directory.
logging.file.max-history=0 # Maximum of archive log files to keep. Only supported with the default logback setup.
logging.file.max-size=10MB # Maximum log file size. Only supported with the default logback setup.
logging.group.*= # Log groups to quickly change multiple loggers at the same time. For instance, `logging.level.db=org.hibernate,org.springframework.jdbc`.
logging.level.*= # Log levels severity mapping. For instance, `logging.level.org.springframework=DEBUG`.
logging.path= # Location of the log file. For instance, `/var/log`.
logging.pattern.console= # Appender pattern for output to the console. Supported only with the default Logback setup.
logging.pattern.dateformat=yyyy-MM-dd HH:mm:ss.SSS # Appender pattern for log date format. Supported only with the default Logback setup.
logging.pattern.file= # Appender pattern for output to a file. Supported only with the default Logback setup.
logging.pattern.level=%5p # Appender pattern for log level. Supported only with the default Logback setup.
logging.register-shutdown-hook=false # Register a shutdown hook for the logging system when it is initialized.
```

> 注：
>
> - 日志配置属性在应用程序生命周期的早期初始化。因此，通过 `@PropertySource` 注释加载的属性文件中找不到日志记录属性。
> - 日志配置属性独立于实际的日志记录基础结构。因此，spring Boot 不管理特定的配置密钥（例如 Logback 的 logback.configurationFile）。

## 源码

完整示例：[源码](https://github.com/dunwu/spring-boot-tutorial/tree/master/codes/log)

分别展示如何在 Spring Boot 中使用 `log4j`, `log4j2`, `logback` 记录日志。

## 更多内容

**引申**

- [细说 Java 主流日志工具库](https://github.com/dunwu/blog/blob/master/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/Java/javastack/javalib/java-log.md)
- [Spring Boot 教程](https://github.com/dunwu/spring-boot-tutorial)

**引用**

- [Spring Boot 官方文档之 boot-features-logging](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-logging)
