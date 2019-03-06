---
title: Jetty 使用小结
date: 2017-11-08
categories:
- javatool
tags:
- java
- javatool
- server
---

# Jetty 使用小结

<!-- TOC depthFrom:2 depthTo:3 -->

- [概述](#概述)
- [jetty 的嵌入式启动](#jetty-的嵌入式启动)
    - [API 方式](#api-方式)
    - [Maven 插件方式](#maven-插件方式)
- [参考](#参考)

<!-- /TOC -->

## 概述

**jetty 是什么？**

jetty 是轻量级的 web 服务器和 servlet 引擎。

它的最大特点是：可以很方便的作为**嵌入式服务器**。

它是 eclipse 的一个开源项目。不用怀疑，就是你常用的那个 eclipse。

它是使用 Java 开发的，所以天然对 Java 支持良好。

[官方网址](http://www.eclipse.org/jetty/index.html)

[github 源码地址](https://github.com/eclipse/jetty.project)

**什么是嵌入式服务器？**

以 jetty 来说明，就是只要引入 jetty 的 jar 包，可以通过直接调用其 API 的方式来启动 web 服务。

用过 Tomcat、Resin 等服务器的朋友想必不会陌生那一套安装、配置、部署的流程吧，还是挺繁琐的。使用 jetty，就不需要这些过程了。

jetty 非常适用于项目的开发、测试，因为非常快捷。如果想用于生产环境，则需要谨慎考虑，它不一定能像成熟的 Tomcat、Resin 等服务器一样支持企业级 Java EE 的需要。

## jetty 的嵌入式启动

我觉得嵌入式启动方式的一个好处在于：可以直接运行项目，无需每次部署都得再配置服务器。

jetty 的嵌入式启动使用有两种方式：

API 方式

maven 插件方式

### API 方式

添加 maven 依赖

```xml
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-webapp</artifactId>
  <version>9.3.2.v20150730</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-annotations</artifactId>
  <version>9.3.2.v20150730</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>apache-jsp</artifactId>
  <version>9.3.2.v20150730</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>apache-jstl</artifactId>
  <version>9.3.2.v20150730</version>
  <scope>test</scope>
</dependency>
```

官方的启动代码

```java
public class SplitFileServer
{
    public static void main( String[] args ) throws Exception
    {
        // 创建Server对象，并绑定端口
        Server server = new Server();
        ServerConnector connector = new ServerConnector(server);
        connector.setPort(8090);
        server.setConnectors(new Connector[] { connector });

        // 创建上下文句柄，绑定上下文路径。这样启动后的url就会是:http://host:port/context
        ResourceHandler rh0 = new ResourceHandler();
        ContextHandler context0 = new ContextHandler();
        context0.setContextPath("/");

        // 绑定测试资源目录（在本例的配置目录dir0的路径是src/test/resources/dir0）
        File dir0 = MavenTestingUtils.getTestResourceDir("dir0");
        context0.setBaseResource(Resource.newResource(dir0));
        context0.setHandler(rh0);

        // 和上面的例子一样
        ResourceHandler rh1 = new ResourceHandler();
        ContextHandler context1 = new ContextHandler();
        context1.setContextPath("/");
        File dir1 = MavenTestingUtils.getTestResourceDir("dir1");
        context1.setBaseResource(Resource.newResource(dir1));
        context1.setHandler(rh1);

        // 绑定两个资源句柄
        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.setHandlers(new Handler[] { context0, context1 });
        server.setHandler(contexts);

        // 启动
        server.start();

        // 打印dump时的信息
        System.out.println(server.dump());

        // join当前线程
        server.join();
    }
}
```

直接运行 Main 方法，就可以启动 web 服务。

**_注：以上代码在 eclipse 中运行没有问题，如果想在 Intellij 中运行还需要为它指定配置文件。_**

如果想了解在 Eclipse 和 Intellij 都能运行的通用方法可以参考我的 github 代码示例。

我的实现也是参考 springside 的方式。

代码行数有点多，不在这里贴代码了。

[完整参考代码](https://github.com/dunwu/spring-notes)

### Maven 插件方式

如果你熟悉 maven，那么实在太简单了

**_注： Maven 版本必须在 3.3 及以上版本。_**

(1) 添加 maven 插件

```xml
<plugin>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-maven-plugin</artifactId>
  <version>9.3.12.v20160915</version>
</plugin>
```

(2) 执行 maven 命令：

```
mvn jetty:run
```

讲真，就是这么简单。jetty 默认会为你创建一个 web 服务，地址为 127.0.0.1:8080。

当然，你也可以在插件中配置你的 webapp 环境

```xml
<plugin>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-maven-plugin</artifactId>
  <version>9.3.12.v20160915</version>

  <configuration>
 <webAppSourceDirectory>${project.basedir}/src/staticfiles</webAppSourceDirectory>

    <!-- 配置webapp -->
 <webApp>
   <contextPath>/</contextPath>
   <descriptor>${project.basedir}/src/over/here/web.xml</descriptor>
   <jettyEnvXml>${project.basedir}/src/over/here/jetty-env.xml</jettyEnvXml>
 </webApp>

    <!-- 配置classes -->
 <classesDirectory>${project.basedir}/somewhere/else</classesDirectory>
 <scanClassesPattern>
   <excludes>
  <exclude>**/Foo.class</exclude>
   </excludes>
 </scanClassesPattern>
 <scanTargets>
   <scanTarget>src/mydir</scanTarget>
   <scanTarget>src/myfile.txt</scanTarget>
 </scanTargets>

    <!-- 扫描target目录下的资源文件 -->
 <scanTargetPatterns>
   <scanTargetPattern>
 <directory>src/other-resources</directory>
 <includes>
   <include>**/*.xml</include>
   <include>**/*.properties</include>
 </includes>
 <excludes>
   <exclude>**/myspecial.xml</exclude>
   <exclude>**/myspecial.properties</exclude>
 </excludes>
   </scanTargetPattern>
 </scanTargetPatterns>
  </configuration>
</plugin>
```

官方给的 jetty-env.xml 范例

```xml
 <?xml version="1.0"?>
 <!DOCTYPE Configure PUBLIC "-//Mort Bay Consulting//DTD Configure//EN" "http://jetty.mortbay.org/configure.dtd">

 <Configure class="org.eclipse.jetty.webapp.WebAppContext">

   <!-- Add an EnvEntry only valid for this webapp               -->
   <New id="gargle"  class="org.eclipse.jetty.plus.jndi.EnvEntry">
     <Arg>gargle</Arg>
     <Arg type="java.lang.Double">100</Arg>
     <Arg type="boolean">true</Arg>
   </New>

  <!-- Add an override for a global EnvEntry                           -->
   <New id="wiggle"  class="org.eclipse.jetty.plus.jndi.EnvEntry">
     <Arg>wiggle</Arg>
     <Arg type="java.lang.Double">55.0</Arg>
     <Arg type="boolean">true</Arg>
   </New>

   <!-- an XADataSource                                                -->
   <New id="mydatasource99" class="org.eclipse.jetty.plus.jndi.Resource">
     <Arg>jdbc/mydatasource99</Arg>
     <Arg>
       <New class="com.atomikos.jdbc.SimpleDataSourceBean">
         <Set name="xaDataSourceClassName">org.apache.derby.jdbc.EmbeddedXADataSource</Set>
         <Set name="xaDataSourceProperties">databaseName=testdb99;createDatabase=create</Set>
         <Set name="UniqueResourceName">mydatasource99</Set>
       </New>
     </Arg>
   </New>

 </Configure>
```

## 参考

- [jetty wiki](http://wiki.eclipse.org/Jetty/Reference/jetty-env.xml)
- [jetty 官方文档](http://www.eclipse.org/jetty/documentation/current/)
