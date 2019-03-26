---
title: SpringApplication
date: 2019-03-06
---

# SpringApplication

<!-- TOC depthFrom:2 depthTo:3 -->

- [启动成功](#启动成功)
- [启动失败](#启动失败)
- [定制 SpringApplication](#定制-springapplication)
- [Build API](#build-api)
- [应用事件和监听器](#应用事件和监听器)
- [Web 环境变量](#web-环境变量)
- [访问应用参数](#访问应用参数)
- [使用 ApplicationRunner 或 CommandLineRunner](#使用-applicationrunner-或-commandlinerunner)
- [退出应用](#退出应用)
- [管理功能](#管理功能)
- [更多内容](#更多内容)

<!-- /TOC -->

`SpringApplication` 类提供了 `run()` 方法作为 Spring Boot 工程的启动方法。

```java
public static void main(String[] args) {
	SpringApplication.run(MySpringConfiguration.class, args);
}
```

## 启动成功

启动后，你会看到如下控制台信息：

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::   v2.1.1.RELEASE

2013-07-31 00:08:16.117  INFO 56603 --- [           main] o.s.b.s.app.SampleApplication            : Starting SampleApplication v0.1.0 on mycomputer with PID 56603 (/apps/myapp.jar started by pwebb)
2013-07-31 00:08:16.166  INFO 56603 --- [           main] ationConfigServletWebServerApplicationContext : Refreshing org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext@6e5a8246: startup date [Wed Jul 31 00:08:16 PDT 2013]; root of context hierarchy
2014-03-04 13:09:54.912  INFO 41370 --- [           main] .t.TomcatServletWebServerFactory : Server initialized with port: 8080
2014-03-04 13:09:56.501  INFO 41370 --- [           main] o.s.b.s.app.SampleApplication            : Started SampleApplication in 2.992 seconds (JVM running for 3.658)
```

## 启动失败

启动失败，你会看到如下信息：

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Embedded servlet container failed to start. Port 8080 was already in use.

Action:

Identify and stop the process that's listening on port 8080 or configure this application to listen on another port.
```

Spring Boot 通过 `FailureAnalyzers` 类来打印错误信息。事实上，`FailureAnalyzers` 维护所有 `FailureAnalyzer` 接口实现类，统一管理错误分析信息。如果想自定义 `FailureAnalyzer` 实现，可以参考： [howto-failure-analyzer](https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/reference/htmlsingle/#howto-failure-analyzer)。

如果没有合适的 `FailureAnalyzer` 处理异常，也可以通过设置 `debug = true` 属性来开启 debug 模式。开启 debug 模式相当于开启 `org.springframework.boot.autoconfigure.logging.ConditionEvaluationReportLoggingListener` 类的 debug 日志打印。

你也可以通过启动参数方式来开启 debug 模式：

```
$ java -jar myproject-0.0.1-SNAPSHOT.jar --debug
```

## 定制 SpringApplication

如果 `SpringApplication` 不能满足项目需要，你也可以自定制一个实例。

示例：

```java
public static void main(String[] args) {
	SpringApplication app = new SpringApplication(MySpringConfiguration.class);
	app.setBannerMode(Banner.Mode.OFF);
	app.run(args);
}
```

`SpringApplication` 常常和 `@Configuration` 搭配使用，如下所示：

```java
@Configuration
@EnableAutoConfiguration
public class MyApplication  {

   // ... Bean definitionsjava

	public static void main(String[] args) throws Exception {
		SpringApplication.run(MyApplication.class, args);
	}
}
```

`SpringApplication` 也可以通过 `application.properties` 读取应用配置属性。支持的配置属性可以参考：[SpringApplication javadoc](https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/api/org/springframework/boot/SpringApplication.html)

## Build API

`ApplicationContext` 支持 build 式 API，如下所示：

```java
new SpringApplicationBuilder()
		.sources(Parent.class)
		.child(Application.class)
		.bannerMode(Banner.Mode.OFF)
		.run(args);
```

## 应用事件和监听器

为了利用 Spring 框架事件（例如 [`ContextRefreshedEvent`](https://docs.spring.io/spring/docs/5.1.3.RELEASE/javadoc-api/org/springframework/context/event/ContextRefreshedEvent.html)），`SpringApplication` 会发送一些应用事件。

> 注：一些事件实际上是在创建 `ApplicationContext` 之前就触发，所以对于这样的事件，无法以 Bean 的方式注册监听器。你可以通过 `SpringApplication.addListeners(…)` 或 `SpringApplicationBuilder.listeners(…)` 来注册监听器。如果希望自动注册这些监听器，可以添加一个 `META-INF/spring.factories` 文件，并使用 `org.springframework.context.ApplicationListener` key 引用你的监听器。如下所示：
>
> ```
> org.springframework.context.ApplicationListener=com.example.project.MyListener
> ```

`SpringApplication` 事件触发顺序如下：

1. `ApplicationStartingEvent` - 在启动 run 方法时触发，优先于除了注册 listeners 和 initializers 以外的任何处理。
2. `ApplicationEnvironmentPreparedEvent` - 在上下文中使用 `Environment` 时触发，这个处理在创建上下文之前。
3. `ApplicationPreparedEvent` - 在启动刷新之前，加载 bean 之后触发。
4. `ApplicationStartedEvent` - 在上下文刷新后，任何应用命令行 runner 被调用前触发。
5. `ApplicationReadyEvent` - 在任意应用命令行 runner 被调用后触发。这意味着应用已经准备好相应服务请求。
6. `ApplicationFailedEvent` - 启动时出现异常则触发。

除了`SpringApplication` 事件，可能你会希望注册自定义监听器。那么，你只需要实现并注入 `ApplicationContextAware` 接口。

## Web 环境变量

`SpringApplication` 会根据你的配置尝试创建正确类型的 `ApplicationContext`。

创建的算法如下：

- 如果 Spring MVC 存在，会使用 `AnnotationConfigServletWebServerApplicationContext` 。
- 如果 Spring MVC 不存在，Spring WebFlux 存在，会使用 `AnnotationConfigReactiveWebServerApplicationContext` 。
- 否则，使用 `AnnotationConfigApplicationContext` 。

此外，也可以通过调用 `setApplicationContextClass(…)` 来主动控制 `ApplicationContext` 类型。

> 注：如果是在 Junit 单元测试中使用 `SpringApplication` ，通常会调用 `setWebApplicationType(WebApplicationType.NONE)`

## 访问应用参数

如果需要访问通过 `SpringApplication.run(…)` 传入的参数，可以注入 `org.springframework.boot.ApplicationArguments` Bean。`ApplicationArguments` 接口支持 `String[]` 型参数，同时支持 `option` 和 `non-option` 参数。如下所示：

```java
import org.springframework.boot.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

@Component
public class MyBean {

	@Autowired
	public MyBean(ApplicationArguments args) {
		boolean debug = args.containsOption("debug");
		List<String> files = args.getNonOptionArgs();
		// if run with "--debug logfile.txt" debug=true, files=["logfile.txt"]
	}

}
```

Spring Boot 还在 Spring `Environment` 中注册了一个 `CommandLinePropertySource`。它可以允许你通过 `@Value` 注解注入一个应用参数。

## 使用 ApplicationRunner 或 CommandLineRunner

如果需要在 `SpringApplication` 启动后立即运行一次指定的代码，你可以实现 `ApplicationRunner` 或 `CommandLineRunner` 接口。这两个接口以相同方式工作，并且都提供 `run` 方法，这个方法会在 `SpringApplication.run(…)` 方法完成前调用。

`CommandLineRunner` 接口提供对应用程序参数的访问，作为简单的字符串数组；而 `ApplicationRunner` 使用前面讨论的 `ApplicationArguments` 接口。

```java
import org.springframework.boot.*;
import org.springframework.stereotype.*;

@Component
public class MyBean implements CommandLineRunner {

	public void run(String... args) {
		// Do something...
	}

}
```

如果有多个 `CommandLineRunner` 或 `ApplicationRunner` 被定义，则必须指定顺序，你可以实现 `org.springframework.core.Ordered` 接口，或使用 `org.springframework.core.annotation.Order` 注解。

## 退出应用

每个 `SpringApplication` 会向 JVM 注册一个 shutdown 钩子，以确保 `ApplicationContext` 可以优雅退出。可以使用所有 Spring 标准生命周期回调函数（例如 `DisposableBean` 接口或 `@PreDestroy` 注解）。

此外，如果希望在调用 `SpringApplication.exit()` 时返回一个指定的退出码，可以实现 `org.springframework.boot.ExitCodeGenerator` 接口。这个退出码会被作为一个状态码被传递给 `System.exit()` ，如下所示：

```java
@SpringBootApplication
public class ExitCodeApplication {

	@Bean
	public ExitCodeGenerator exitCodeGenerator() {
		return () -> 42;
	}

	public static void main(String[] args) {
		System.exit(SpringApplication
				.exit(SpringApplication.run(ExitCodeApplication.class, args)));
	}

}
```

`ExitCodeGenerator` 接口也可以被异常类实现。当一个异常发生，Spring Boot 会根据实现的 `getExitCode()` 方法返回退出码。

## 管理功能

可以通过 `spring.application.admin.enabled` 属性开启应用的管理功能。这会在平台 `MBeanServer` 上暴露`SpringApplicationAdminMXBean`。您可以使用此功能远程管理 Spring Boot 应用程序。

> 注：如果想知道应用使用的 HTTP 端口是什么，可以通过 local.server.port 获取。

## 更多内容

**引申**

- [Spring Boot 教程](https://github.com/dunwu/spring-boot-tutorial)

**参考**

- [Spring Boot 官方文档之 SpringApplication](https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/reference/htmlsingle/#boot-features-spring-application)
