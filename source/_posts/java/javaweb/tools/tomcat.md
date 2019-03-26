---
title: Tomcat 快速入门
date: 2018-01-08
categories:
- javatool
tags:
- java
- javatool
- server
---

# Tomcat 快速入门

> 版本说明
>
> 本文使用 Tomcat 版本为 Tomcat 8.5.24。
>
> Tomcat 8.5 要求 JDK 版本为 1.7 以上。

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [Tomcat 是什么](#tomcat-是什么)
    - [Tomcat 重要目录](#tomcat-重要目录)
    - [web 工程发布目录结构](#web-工程发布目录结构)
- [QuickStart](#quickstart)
    - [安装](#安装)
    - [配置](#配置)
    - [启动](#启动)
- [Tomcat 工作原理](#tomcat-工作原理)
    - [Tomcat 主要组件](#tomcat-主要组件)
    - [Tomcat 生命周期](#tomcat-生命周期)
    - [Connector](#connector)
    - [Comet](#comet)
    - [异步 Servlet](#异步-servlet)
- [资料](#资料)
    - [官方](#官方)
    - [第三方](#第三方)

<!-- /TOC -->

## 简介

### Tomcat 是什么

Tomcat 是由 Apache 开发的一个 Servlet 容器，实现了对 Servlet 和 JSP 的支持，并提供了作为 Web 服务器的一些特有功能，如 Tomcat 管理和控制平台、安全域管理和 Tomcat 阀等。

由于 Tomcat 本身也内含了一个 HTTP 服务器，它也可以被视作一个单独的 Web 服务器。但是，不能将 Tomcat 和 Apache HTTP 服务器混淆，Apache HTTP 服务器是一个用 C 语言实现的 HTTP Web 服务器；这两个 HTTP web server 不是捆绑在一起的。Tomcat 包含了一个配置管理工具，也可以通过编辑 XML 格式的配置文件来进行配置。

### Tomcat 重要目录

- **/bin** - Tomcat 脚本存放目录（如启动、关闭脚本）。 `*.sh` 文件用于 Unix 系统； `*.bat` 文件用于 Windows 系统。
- **/conf** - Tomcat 配置文件目录。
- **/logs** - Tomcat 默认日志目录。
- **/webapps** - webapp 运行的目录。

### web 工程发布目录结构

一般 web 项目路径结构

```
|-- webapp                         # 站点根目录
    |-- META-INF                   # META-INF 目录
    |   `-- MANIFEST.MF            # 配置清单文件
    |-- WEB-INF                    # WEB-INF 目录
    |   |-- classes                # class文件目录
    |   |   |-- *.class            # 程序需要的 class 文件
    |   |   `-- *.xml              # 程序需要的 xml 文件
    |   |-- lib                    # 库文件夹
    |   |   `-- *.jar              # 程序需要的 jar 包
    |   `-- web.xml                # Web应用程序的部署描述文件
    |-- <userdir>                  # 自定义的目录
    |-- <userfiles>                # 自定义的资源文件
```

`webapp`：工程发布文件夹。其实每个 war 包都可以视为 webapp 的压缩包。

`META-INF`：META-INF 目录用于存放工程自身相关的一些信息，元文件信息，通常由开发工具，环境自动生成。

`WEB-INF`：Java web 应用的安全目录。所谓安全就是客户端无法访问，只有服务端可以访问的目录。

`/WEB-INF/classes`：存放程序所需要的所有 Java class 文件。

`/WEB-INF/lib`：存放程序所需要的所有 jar 文件。

`/WEB-INF/web.xml`：web 应用的部署配置文件。它是工程中最重要的配置文件，它描述了 servlet 和组成应用的其它组件，以及应用初始化参数、安全管理约束等。

## QuickStart

### 安装

**前提条件**

Tomcat 8.5 要求 JDK 版本为 1.7 以上。

进入 [Tomcat 官方下载地址](https://tomcat.apache.org/download-80.cgi) 选择合适版本下载，并解压到本地。

**Windows**

添加环境变量 `CATALINA_HOME` ，值为 Tomcat 的安装路径。

进入安装目录下的 bin 目录，运行 startup.bat 文件，启动 Tomcat

**Linux / Unix**

下面的示例以 8.5.24 版本为例，包含了下载、解压、启动操作。

```sh
# 下载解压到本地
wget http://mirrors.hust.edu.cn/apache/tomcat/tomcat-8/v8.5.24/bin/apache-tomcat-8.5.24.tar.gz
tar -zxf apache-tomcat-8.5.24.tar.gz
# 启动 Tomcat
./apache-tomcat-8.5.24/bin/startup.sh
```

启动后，访问 http://localhost:8080 ，可以看到 Tomcat 安装成功的测试页面。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/tomcat.png"/></div><br>

### 配置

本节将列举一些重要、常见的配置项。详细的 Tomcat8 配置可以参考 [Tomcat 8 配置官方参考文档](http://tomcat.apache.org/tomcat-8.5-doc/config/index.html) 。

#### Server

> Server 元素表示整个 Catalina servlet 容器。
>
> 因此，它必须是 `conf/server.xml` 配置文件中的根元素。它的属性代表了整个 servlet 容器的特性。

**属性表**

| 属性      | 描述                                                                     | 备注                                         |
| --------- | ------------------------------------------------------------------------ | -------------------------------------------- |
| className | 这个类必须实现 org.apache.catalina.Server 接口。                         | 默认 org.apache.catalina.core.StandardServer |
| address   | 服务器等待关机命令的 TCP / IP 地址。如果没有指定地址，则使用 localhost。 |                                              |
| port      | 服务器等待关机命令的 TCP / IP 端口号。设置为-1 以禁用关闭端口。          |                                              |
| shutdown  | 必须通过 TCP / IP 连接接收到指定端口号的命令字符串，以关闭 Tomcat。      |                                              |

#### Service

> Service 元素表示一个或多个连接器组件的组合，这些组件共享一个用于处理传入请求的引擎组件。Server 中可以有多个 Service。

**属性表**

| 属性      | 描述                                                                                                               | 备注                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| className | 这个类必须实现`org.apache.catalina.Service`接口。                                                                  | 默认 `org.apache.catalina.core.StandardService` |
| name      | 此服务的显示名称，如果您使用标准 Catalina 组件，将包含在日志消息中。与特定服务器关联的每个服务的名称必须是唯一的。 |                                                 |

**实例 - `conf/server.xml` 配置文件示例**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Server port="8080" shutdown="SHUTDOWN">
  <Service name="xxx">
  ...
  </Service>
</Server>
```

#### Executor

> Executor 表示可以在 Tomcat 中的组件之间共享的线程池。

**属性表**

| 属性            | 描述                                                             | 备注                                                   |
| --------------- | ---------------------------------------------------------------- | ------------------------------------------------------ |
| className       | 这个类必须实现`org.apache.catalina.Executor`接口。               | 默认 `org.apache.catalina.core.StandardThreadExecutor` |
| name            | 线程池名称。                                                     | 要求唯一, 供 Connector 元素的 executor 属性使用        |
| namePrefix      | 线程名称前缀。                                                   |                                                        |
| maxThreads      | 最大活跃线程数。                                                 | 默认 200                                               |
| minSpareThreads | 最小活跃线程数。                                                 | 默认 25                                                |
| maxIdleTime     | 当前活跃线程大于 minSpareThreads 时,空闲线程关闭的等待最大时间。 | 默认 60000ms                                           |
| maxQueueSize    | 线程池满情况下的请求排队大小。                                   | 默认 Integer.MAX_VALUE                                 |

```xml
<Service name="xxx">
  <Executor name="tomcatThreadPool" namePrefix="catalina-exec-" maxThreads="300" minSpareThreads="25"/>
</Service>
```

#### Connector

> Connector 代表连接组件。Tomcat 支持三种协议：HTTP/1.1、HTTP/2.0、AJP。

**属性表**

| 属性                  | 说明                                                                                        | 备注                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| asyncTimeout          | Servlet3.0 规范中的异步请求超时                                                             | 默认 30s                                                                                                                                        |
| port                  | 请求连接的 TCP Port                                                                         | 设置为 0,则会随机选取一个未占用的端口号                                                                                                         |
| protocol              | 协议. 一般情况下设置为 HTTP/1.1,这种情况下连接模型会在 NIO 和 APR/native 中自动根据配置选择 |                                                                                                                                                 |
| URIEncoding           | 对 URI 的编码方式.                                                                          | 如果设置系统变量 org.apache.catalina.STRICT_SERVLET_COMPLIANCE 为 true,使用 ISO-8859-1 编码;如果未设置此系统变量且未设置此属性, 使用 UTF-8 编码 |
| useBodyEncodingForURI | 是否采用指定的 contentType 而不是 URIEncoding 来编码 URI 中的请求参数                       |                                                                                                                                                 |

以下属性在标准的 Connector(NIO, NIO2 和 APR/native)中有效:

| 属性              | 说明                                                                        | 备注                                                                                                                                                                                                            |
| ----------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| acceptCount       | 当最大请求连接 maxConnections 满时的最大排队大小                            | 默认 100,注意此属性和 Executor 中属性 maxQueueSize 的区别.这个指的是请求连接满时的堆栈大小,Executor 的 maxQueueSize 指的是处理线程满时的堆栈大小                                                                |
| connectionTimeout | 请求连接超时                                                                | 默认 60000ms                                                                                                                                                                                                    |
| executor          | 指定配置的线程池名称                                                        |                                                                                                                                                                                                                 |
| keepAliveTimeout  | keeAlive 超时时间                                                           | 默认值为 connectionTimeout 配置值.-1 表示不超时                                                                                                                                                                 |
| maxConnections    | 最大连接数                                                                  | 连接满时后续连接放入最大为 acceptCount 的队列中. 对 NIO 和 NIO2 连接,默认值为 10000;对 APR/native,默认值为 8192                                                                                                 |
| maxThreads        | 如果指定了 Executor, 此属性忽略;否则为 Connector 创建的内部线程池最大值     | 默认 200                                                                                                                                                                                                        |
| minSpareThreads   | 如果指定了 Executor, 此属性忽略;否则为 Connector 创建线程池的最小活跃线程数 | 默认 10                                                                                                                                                                                                         |
| processorCache    | 协议处理器缓存 Processor 对象的大小                                         | -1 表示不限制.当不使用 servlet3.0 的异步处理情况下: 如果配置 Executor,配置为 Executor 的 maxThreads;否则配置为 Connnector 的 maxThreads. 如果使用 Serlvet3.0 异步处理, 取 maxThreads 和 maxConnections 的最大值 |

#### Context

> Context 元素表示一个 Web 应用程序，它在特定的虚拟主机中运行。每个 Web 应用程序都基于 Web 应用程序存档（WAR）文件，或者包含相应的解包内容的相应目录，如 Servlet 规范中所述。

**属性表**

| 属性                       | 说明                                                                        | 备注                                                 |
| -------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------- |
| altDDName                  | web.xml 部署描述符路径                                                      | 默认 /WEB-INF/web.xml                                |
| docBase                    | Context 的 Root 路径                                                        | 和 Host 的 appBase 相结合, 可确定 web 应用的实际目录 |
| failCtxIfServletStartFails | 同 Host 中的 failCtxIfServletStartFails, 只对当前 Context 有效              | 默认为 false                                         |
| logEffectiveWebXml         | 是否日志打印 web.xml 内容(web.xml 由默认的 web.xml 和应用中的 web.xml 组成) | 默认为 false                                         |
| path                       | web 应用的 context path                                                     | 如果为根路径,则配置为空字符串(""), 不能不配置        |
| privileged                 | 是否使用 Tomcat 提供的 manager servlet                                      |                                                      |
| reloadable                 | /WEB-INF/classes/ 和/WEB-INF/lib/ 目录中 class 文件发生变化是否自动重新加载 | 默认为 false                                         |
| swallowOutput              | true 情况下, System.out 和 System.err 输出将被定向到 web 应用日志中         | 默认为 false                                         |

#### Engine

> Engine 元素表示与特定的 Catalina 服务相关联的整个请求处理机器。它接收并处理来自一个或多个连接器的所有请求，并将完成的响应返回给连接器，以便最终传输回客户端。

**属性表**

| 属性        | 描述                                                                                 | 备注                                                               |
| ----------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| defaultHost | 默认主机名，用于标识将处理指向此服务器上主机名称但未在此配置文件中配置的请求的主机。 | 这个名字必须匹配其中一个嵌套的主机元素的名字属性。                 |
| name        | 此引擎的逻辑名称，用于日志和错误消息。                                               | 在同一服务器中使用多个服务元素时，每个引擎必须分配一个唯一的名称。 |

#### Host

> Host 元素表示一个虚拟主机，它是一个服务器的网络名称（如“www.mycompany.com”）与运行 Tomcat 的特定服务器的关联。

**属性表**

| 属性                       | 说明                                                                                         | 备注                                         |
| -------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------- |
| name                       | 名称                                                                                         | 用于日志输出                                 |
| appBase                    | 虚拟主机对应的应用基础路径                                                                   | 可以是个绝对路径, 或${CATALINA_BASE}相对路径 |
| xmlBase                    | 虚拟主机 XML 基础路径,里面应该有 Context xml 配置文件                                        | 可以是个绝对路径, 或${CATALINA_BASE}相对路径 |
| createDirs                 | 当 appBase 和 xmlBase 不存在时,是否创建目录                                                  | 默认为 true                                  |
| autoDeploy                 | 是否周期性的检查 appBase 和 xmlBase 并 deploy web 应用和 context 描述符                      | 默认为 true                                  |
| deployIgnore               | 忽略 deploy 的正则                                                                           |                                              |
| deployOnStartup            | Tomcat 启动时是否自动 deploy                                                                 | 默认为 true                                  |
| failCtxIfServletStartFails | 配置为 true 情况下,任何 load-on-startup >=0 的 servlet 启动失败,则其对应的 Contxt 也启动失败 | 默认为 false                                 |

#### Cluster

由于在实际开发中，我从未用过 Tomcat 集群配置，所以没研究。

### 启动

#### 部署方式

这种方式要求本地必须安装 Tomcat 。

将打包好的 war 包放在 Tomcat 安装目录下的 `webapps` 目录下，然后在 bin 目录下执行 `startup.bat` 或 `startup.sh` ，Tomcat 会自动解压 `webapps` 目录下的 war 包。

成功后，可以访问 http://localhost:8080/xxx （xxx 是 war 包文件名）。

> **注意**
>
> 以上步骤是最简单的示例。步骤中的 war 包解压路径、启动端口以及一些更多的功能都可以修改配置文件来定制 （主要是 `server.xml` 或 `context.xml` 文件）。

#### 嵌入式

##### API 方式

在 pom.xml 中添加依赖

```xml
<dependency>
  <groupId>org.apache.tomcat.embed</groupId>
  <artifactId>tomcat-embed-core</artifactId>
  <version>8.5.24</version>
</dependency>
```

添加 SimpleEmbedTomcatServer.java 文件，内容如下：

```java
import java.util.Optional;
import org.apache.catalina.startup.Tomcat;

public class SimpleTomcatServer {
    private static final int PORT = 8080;
    private static final String CONTEXT_PATH = "/javatool-server";

    public static void main(String[] args) throws Exception {
        // 设定 profile
        Optional<String> profile = Optional.ofNullable(System.getProperty("spring.profiles.active"));
        System.setProperty("spring.profiles.active", profile.orElse("develop"));

        Tomcat tomcat = new Tomcat();
        tomcat.setPort(PORT);
        tomcat.getHost().setAppBase(".");
        tomcat.addWebapp(CONTEXT_PATH, getAbsolutePath() + "src/main/webapp");
        tomcat.start();
        tomcat.getServer().await();
    }

    private static String getAbsolutePath() {
        String path = null;
        String folderPath = SimpleEmbedTomcatServer.class.getProtectionDomain().getCodeSource().getLocation().getPath()
                .substring(1);
        if (folderPath.indexOf("target") > 0) {
            path = folderPath.substring(0, folderPath.indexOf("target"));
        }
        return path;
    }
}
```

成功后，可以访问 http://localhost:8080/javatool-server 。

> **说明**
>
> 本示例是使用 `org.apache.tomcat.embed` 启动嵌入式 Tomcat 的最简示例。
>
> 这个示例中使用的是 Tomcat 默认的配置，但通常，我们需要对 Tomcat 配置进行一些定制和调优。为了加载配置文件，启动类就要稍微再复杂一些。这里不想再贴代码，有兴趣的同学可以参考：
>
> [**示例项目**](https://github.com/dunwu/JavaStack/tree/master/codes/javatool/server)

##### 使用 maven 插件启动（不推荐）

不推荐理由：这种方式启动 maven 虽然最简单，但是有一个很大的问题是，真的很久很久没发布新版本了（最新版本发布时间：2013-11-11）。且貌似只能找到 Tomcat6 、Tomcat7 插件。

**使用方法**

在 pom.xml 中引入插件

```xml
<plugin>
  <groupId>org.apache.tomcat.maven</groupId>
  <artifactId>tomcat7-maven-plugin</artifactId>
  <version>2.2</version>
  <configuration>
    <port>8080</port>
    <path>/${project.artifactId}</path>
    <uriEncoding>UTF-8</uriEncoding>
  </configuration>
</plugin>
```

运行 `mvn tomcat7:run` 命令，启动 Tomcat。

成功后，可以访问 http://localhost:8080/xxx （xxx 是 ${project.artifactId} 指定的项目名）。

#### IDE 插件

常见 Java IDE 一般都有对 Tomcat 的支持。

以 Intellij IDEA 为例，提供了 **Tomcat and TomEE Integration** 插件（一般默认会安装）。

**使用步骤**

- 点击 Run/Debug Configurations > New Tomcat Server > local ，打开 Tomcat 配置页面。
- 点击 Confiure... 按钮，设置 Tomcat 安装路径。
- 点击 Deployment 标签页，设置要启动的应用。
- 设置启动应用的端口、JVM 参数、启动浏览器等。
- 成功后，可以访问 http://localhost:8080/（当然，你也可以在 url 中设置上下文名称）。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/tomcat-intellij-run-config.png"/></div><br>

> **说明**
>
> 个人认为这个插件不如 Eclipse 的 Tomcat 插件好用，Eclipse 的 Tomcat 插件支持对 Tomcat xml 配置文件进行配置。而这里，你只能自己去 Tomcat 安装路径下修改配置文件。

文中的嵌入式启动示例可以参考[**我的示例项目**](https://github.com/dunwu/JavaStack/tree/master/codes/javatool/server)

## Tomcat 工作原理

### Tomcat 主要组件

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/Tomcat主要组件.jpg" width="500" >
</div>

- **Server** - 指的就是整个 Tomcat 服 务器，包含多组服务，负责管理和 启动各个 Service，同时监听 8005 端口发过来的 shutdown 命令，用 于关闭整个容器。
- **Service** - Tomcat 封装的、对外提 供完整的、基于组件的 web 服务， 包含 Connectors、Container 两个核心组件，以及多个功能组件，各 个 Service 之间是独立的，但是共享 同一 JVM 的资源。
- **Connector** - Tomcat 与外部世界的连接器，监听固定端口接收外部请求，传递给 Container，并 将 Container 处理的结果返回给外部；
- **Container** - Catalina，Servlet 容器，内部有多层容器组成，用于管理 Servlet 生命周期，调用 servlet 相关方法。
- **Loader** - 封装了 Java ClassLoader，用于 Container 加载类文件； Realm - Tomcat 中为 web 应用程序提供访问认证和角色管理的机制。
- **JMX** - Java SE 中定义技术规范，是一个为应用程序、设备、系统等植入管理功能的框架，通过 JMX 可以远程监控 Tomcat 的运行状态。
- **Jasper** - Tomcat 的 Jsp 解析引擎，用于将 Jsp 转换成 Java 文件，并编译成 class 文件。 Session - 负责管理和创建 session，以及 Session 的持久化(可自定义)，支持 session 的集
- 群。
- **Pipeline** - 在容器中充当管道的作用，管道中可以设置各种 valve(阀门)，请求和响应在经由管 道中各个阀门处理，提供了一种灵活可配置的处理请求和响应的机制。
- **Naming** - 命名服务，JNDI， Java 命名和目录接口，是一组在 Java 应用中访问命名和目录服务的 API。命名服务将名称和对象联系起来，使得我们可以用名称访问对象，目录服务也是一种命名 服务，对象不但有名称，还有属性。Tomcat 中可以使用 JNDI 定义数据源、配置信息，用于开发 与部署的分离。

#### Container 组件

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/Tomcat-Container组件.jpg" width="400" >
</div>

- **Engine** - Servlet 的顶层容器，包含一 个或多个 Host 子容器；
- **Host** - 虚拟主机，负责 web 应用的部 署和 Context 的创建；
- **Context** - Web 应用上下文，包含多个 Wrapper，负责 web 配置的解析、管 理所有的 Web 资源；
- **Wrapper** - 最底层的容器，是对 Servlet 的封装，负责 Servlet 实例的创 建、执行和销毁。

### Tomcat 生命周期

#### Tomcat 生命周期管理

Tomcat 为了方便管理组件和容器的生命周期，定义了从创建、启动、到停止、销毁共 12 中状态，tomcat 生命周期管理了内部状态变化的规则控制，组件和容器只需实现相应的生命周期 方法即可完成各生命周期内的操作(initInternal、startInternal、stopInternal、 destroyInternal)；

比如执行初始化操作时，会判断当前状态是否 New，如果不是则抛出生命周期异常；是的 话则设置当前状态为 Initializing，并执行 initInternal 方法，由子类实现，方法执行成功则设置当 前状态为 Initialized，执行失败则设置为 Failed 状态；

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/Tomcat生命周期.jpg" width="600">
</div>

Tomcat 的生命周期管理引入了事件机制，在组件或容器的生命周期状态发生变化时会通 知事件监听器，监听器通过判断事件的类型来进行相应的操作。
事件监听器的添加可以在 server.xml 文件中进行配置;

Tomcat 各类容器的配置过程就是通过添加 listener 的方式来进行的，从而达到配置逻辑与 容器的解耦。如 EngineConfig、HostConfig、ContextConfig。

- **EngineConfig** - 主要打印启动和停止日志
- **HostConfig** - 主要处理部署应用，解析应用 META-INF/context.xml 并创建应用的 Context。
- **ContextConfig** - 主要解析并合并 web.xml，扫描应用的各类 web 资源 (filter、servlet、listener)。

#### Tomcat 的启动过程

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/Tomcat启动过程.jpg" width="600">
</div>

启动从 Tomcat 提供的 start.sh 脚本开始，shell 脚本会调用 Bootstrap 的 main 方法，实际 调用了 Catalina 相应的 load、start 方法。

load 方法会通过 Digester 进行 config/server.xml 的解析，在解析的过程中会根据 xml 中的关系 和配置信息来创建容器，并设置相关的属性。接着 Catalina 会调用 StandardServer 的 init 和 start 方法进行容器的初始化和启动。

按照 xml 的配置关系，server 的子元素是 service，service 的子元素是顶层容器 Engine，每层容器有持有自己的子容器，而这些元素都实现了生命周期管理 的各个方法，因此就很容易的完成整个容器的启动、关闭等生命周期的管理。

StandardServer 完成 init 和 start 方法调用后，会一直监听来自 8005 端口(可配置)，如果接收 到 shutdown 命令，则会退出循环监听，执行后续的 stop 和 destroy 方法，完成 Tomcat 容器的 关闭。同时也会调用 JVM 的 Runtime.getRuntime()﴿.addShutdownHook 方法，在虚拟机意外退 出的时候来关闭容器。

所有容器都是继承自 ContainerBase，基类中封装了容器中的重复工作，负责启动容器相关的组 件 Loader、Logger、Manager、Cluster、Pipeline，启动子容器(线程池并发启动子容器，通过 线程池 submit 多个线程，调用后返回 Future 对象，线程内部启动子容器，接着调用 Future 对象 的 get 方法来等待执行结果)。

```java
List<Future<Void>> results = new ArrayList<Future<Void>>();
for (int i = 0; i < children.length; i++) {
    results.add(startStopExecutor.submit(new StartChild(children[i])));
}
boolean fail = false;
for (Future<Void> result ： results) {
    try {
        result.get();
    } catch (Exception e) {
        log.error(sm.getString("containerBase.threadedStartFailed")， e);
        fail = true;
    }
}
```

##### Web 应用的部署方式

注：catalina.home：安装目录;catalina.base：工作目录;默认值 user.dir

- Server.xml 配置 Host 元素，指定 appBase 属性，默认\$catalina.base/webapps/
- Server.xml 配置 Context 元素，指定 docBase，元素，指定 web 应用的路径
- 自定义配置：在\$catalina.base/EngineName/HostName/XXX.xml 配置 Context 元素

HostConfig 监听了 StandardHost 容器的事件，在 start 方法中解析上述配置文件：

- 扫描 appbase 路径下的所有文件夹和 war 包，解析各个应用的 META-INF/context.xml，并 创建 StandardContext，并将 Context 加入到 Host 的子容器中。
- 解析$catalina.base/EngineName/HostName/下的所有 Context 配置，找到相应 web 应 用的位置，解析各个应用的 META-INF/context.xml，并创建 StandardContext，并将 Context 加入到 Host 的子容器中。

注：

- HostConfig 并没有实际解析 Context.xml，而是在 ContextConfig 中进行的。
- HostConfig 中会定期检查 watched 资源文件(context.xml 配置文件)

ContextConfig 解析 context.xml 顺序：

- 先解析全局的配置 config/context.xml
- 然后解析 Host 的默认配置 EngineName/HostName/context.xml.default
- 最后解析应用的 META-INF/context.xml

ContextConfig 解析 web.xml 顺序：

- 先解析全局的配置 config/web.xml
- 然后解析 Host 的默认配置 EngineName/HostName/web.xml.default 接着解析应用的 MEB-INF/web.xml
- 扫描应用 WEB-INF/lib/下的 jar 文件，解析其中的 META-INF/web-fragment.xml 最后合并 xml 封装成 WebXml，并设置 Context

注：

- 扫描 web 应用和 jar 中的注解(Filter、Listener、Servlet)就是上述步骤中进行的。
- 容器的定期执行：backgroundProcess，由 ContainerBase 来实现的，并且只有在顶层容器 中才会开启线程。(backgroundProcessorDelay=10 标志位来控制)

#### 请求处理过程

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/请求处理过程.png" width="600">
</div>

1.  根据 server.xml 配置的指定的 connector 以及端口监听 http、或者 ajp 请求
2.  请求到来时建立连接,解析请求参数,创建 Request 和 Response 对象,调用顶层容器 pipeline 的 invoke 方法
3.  容器之间层层调用,最终调用业务 servlet 的 service 方法
4.  Connector 将 response 流中的数据写到 socket 中

#### Pipeline 与 Valve

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/Pipeline与Valve.png" width="600">
</div>

Pipeline 可以理解为现实中的管道,Valve 为管道中的阀门,Request 和 Response 对象在管道中 经过各个阀门的处理和控制。

每个容器的管道中都有一个必不可少的 basic valve,其他的都是可选的,basic valve 在管道中最 后调用,同时负责调用子容器的第一个 valve。

Valve 中主要的三个方法:setNext、getNext、invoke;valve 之间的关系是单向链式结构,本身 invoke 方法中会调用下一个 valve 的 invoke 方法。

各层容器对应的 basic valve 分别是 StandardEngineValve、StandardHostValve、 StandardContextValve、StandardWrapperValve。

### Connector

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/connector.png" width="600">
</div>

#### 阻塞 IO

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/阻塞IO.png" width="600">
</div>

#### 非阻塞 IO

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/非阻塞IO.png" width="600">
</div>

####  IO 多路复用

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/IO多路复用.png" width="600">
</div>

阻塞与非阻塞的区别在于进行读操作和写操作的系统调用时，如果此时内核态没有数据可读或者没有缓冲空间可写时，是否阻塞。

IO 多路复用的好处在于可同时监听多个 socket 的可读和可写事件，这样就能使得应用可以同时监听多个 socket，释放了应用线程资源。

#### Tomcat 各类 Connector 对比

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/Tomcat各类Connector对比.jpg" width="500"> 
</div>

- JIO：用 java.io 编写的 TCP 模块，阻塞 IO
- NIO：用 java.nio 编写的 TCP 模块，非阻塞 IO，（IO 多路复用）
- APR：全称 Apache Portable Runtime，使用 JNI 的方式来进行读取文件以及进行网络传输

Apache Portable Runtime 是一个高度可移植的库，它是 Apache HTTP Server 2.x 的核心。 APR 具有许多用途，包括访问高级 IO 功能（如 sendfile，epoll 和 OpenSSL），操作系统级功能（随机数生成，系统状态等）和本地进程处理（共享内存，NT 管道和 Unix 套接字）。

表格中字段含义说明：

- Support Polling - 是否支持基于 IO 多路复用的 socket 事件轮询
- Polling Size - 轮询的最大连接数
- Wait for next Request - 在等待下一个请求时，处理线程是否释放，BIO 是没有释放的，所以在 keep-alive=true 的情况下处理的并发连接数有限
- Read Request Headers - 由于 request header 数据较少，可以由容器提前解析完毕，不需要阻塞
- Read Request Body - 读取 request body 的数据是应用业务逻辑的事情，同时 Servlet 的限制，是需要阻塞读取的
- Write Response - 跟读取 request body 的逻辑类似，同样需要阻塞写

**NIO 处理相关类**

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/NIO处理相关类.jpg" width="500"> 
</div>

Poller 线程从 EventQueue 获取 PollerEvent，并执行 PollerEvent 的 run 方法，调用 Selector 的 select 方法，如果有可读的 Socket 则创建 Http11NioProcessor，放入到线程池中执行；

CoyoteAdapter 是 Connector 到 Container 的适配器，Http11NioProcessor 调用其提供的 service 方法，内部创建 Request 和 Response 对象，并调用最顶层容器的 Pipeline 中的第一个 Valve 的 invoke 方法

Mapper 主要处理 http url 到 servlet 的映射规则的解析，对外提供 map 方法

### Comet

Comet 是一种用于 web 的推送技术，能使服务器实时地将更新的信息传送到客户端，而无须客户端发出请求
在 WebSocket 出来之前，如果不适用 comet，只能通过浏览器端轮询 Server 来模拟实现服务器端推送。
Comet 支持 servlet 异步处理 IO，当连接上数据可读时触发事件，并异步写数据(阻塞)

Tomcat 要实现 Comet，只需继承 HttpServlet 同时，实现 CometProcessor 接口

- Begin：新的请求连接接入调用，可进行与 Request 和 Response 相关的对象初始化操作，并保存 response 对象，用于后续写入数据
- Read：请求连接有数据可读时调用
- End：当数据可用时，如果读取到文件结束或者 response 被关闭时则被调用
- Error：在连接上发生异常时调用，数据读取异常、连接断开、处理异常、socket 超时

Note：

- Read：在 post 请求有数据，但在 begin 事件中没有处理，则会调用 read，如果 read 没有读取数据，在会触发 Error 回调，关闭 socket
- End：当 socket 超时，并且 response 被关闭时也会调用；server 被关闭时调用
- Error：除了 socket 超时不会关闭 socket，其他都会关闭 socket
- End 和 Error 时间触发时应关闭当前 comet 会话，即调用 CometEvent 的 close 方法
  Note：在事件触发时要做好线程安全的操作

### 异步 Servlet

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/传统Servlet处理流程.png" > 
</div>

传统流程：

- 首先，Servlet 接收到请求之后，request 数据解析；
- 接着，调用业务接口的某些方法，以完成业务处理；
- 最后，根据处理的结果提交响应，Servlet 线程结束

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/tools/tomcat/异步Servlet处理流程.png" > 
</div>

异步处理流程：

- 客户端发送一个请求
- Servlet 容器分配一个线程来处理容器中的一个 servlet
- servlet 调用 request.startAsync()，保存 AsyncContext, 然后返回
- 任何方式存在的容器线程都将退出，但是 response 仍然保持开放
- 业务线程使用保存的 AsyncContext 来完成响应（线程池）
- 客户端收到响应

Servlet 线程将请求转交给一个异步线程来执行业务处理，线程本身返回至容器，此时 Servlet 还没有生成响应数据，异步线程处理完业务以后，可以直接生成响应数据（异步线程拥有 ServletRequest 和 ServletResponse 对象的引用）

**为什么 web 应用中支持异步？**

推出异步，主要是针对那些比较耗时的请求：比如一次缓慢的数据库查询，一次外部 REST API 调用, 或者是其他一些 I/O 密集型操作。这种耗时的请求会很快的耗光 Servlet 容器的线程池，继而影响可扩展性。

Note：从客户端的角度来看，request 仍然像任何其他的 HTTP 的 request-response 交互一样，只是耗费了更长的时间而已

**异步事件监听**

- onStartAsync：Request 调用 startAsync 方法时触发
- onComplete：syncContext 调用 complete 方法时触发
- onError：处理请求的过程出现异常时触发
- onTimeout：socket 超时触发

Note :
onError/ onTimeout 触发后，会紧接着回调 onComplete
onComplete 执行后，就不可再操作 request 和 response

## 资料

### 官方

- [Tomcat 官方网站](http://tomcat.apache.org/)
- [Tomcat Wiki](http://wiki.apache.org/tomcat/FrontPage)
- [Tomee 官方网站](http://tomee.apache.org/)

### 第三方

- [Creating a Web App with Bootstrap and Tomcat Embedded](http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/basic_app_embedded_tomcat/basic_app-tomcat-embedded.html)
- [Tomcat 组成与工作原理](https://juejin.im/post/58eb5fdda0bb9f00692a78fc)
- [Tomcat 工作原理](https://www.ibm.com/developerworks/cn/java/j-lo-tomcat1/index.html)
- [Tomcat 设计模式分析](https://www.ibm.com/developerworks/cn/java/j-lo-tomcat2/index.html?ca=drs-)
