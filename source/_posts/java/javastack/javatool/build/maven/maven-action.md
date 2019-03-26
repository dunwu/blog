---
title: Maven 常见问题和最佳实践
date: 2019-03-06
---

# Maven 常见问题和最佳实践

<!-- TOC depthFrom:2 depthTo:3 -->

- [1. 常见问题](#1-常见问题)
    - [1.1. IDEA 修改 JDK 版本后编译报错](#11-idea-修改-jdk-版本后编译报错)
    - [1.2. 重复引入依赖](#12-重复引入依赖)
- [2. 最佳实践](#2-最佳实践)
    - [2.1. 通过 bom 统一管理版本](#21-通过-bom-统一管理版本)
    - [如何打包一个可以直接运行的 Spring Boot jar 包](#如何打包一个可以直接运行的-spring-boot-jar-包)

<!-- /TOC -->

## 1. 常见问题

### 1.1. IDEA 修改 JDK 版本后编译报错

**错误现象**

修改 JDK 版本，指定 maven-compiler-plugin 的 source 和 target 为 1.8 。

然后，在 Intellij IDEA 中执行 maven 指令，报错：

```
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.0:compile (default-compile) on project apollo-common: Fatal error compiling: 无效的目标版本： 1.8 -> [Help 1]
```

**错误原因**

maven 的 JDK 源与指定的 JDK 编译版本不符。

**排错手段**

- **查看 Project Settings**

Project SDK 是否正确

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/20181127203324.png"/></div><br>

SDK 路径是否正确

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/20181127203427.png"/></div><br>

- **查看 Settings > Maven 的配置**

JDK for importer 是否正确

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/20181127203408.png"/></div><br>

Runner 是否正确

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/20181127203439.png"/></div><br>

### 1.2. 重复引入依赖

在 Idea 中，选中 Module，使用 <kbd>Ctrl+Alt+Shift+U</kbd>，打开依赖图，检索是否存在重复引用的情况。

## 2. 最佳实践

### 2.1. 通过 bom 统一管理版本

采用类似 spring-framework-bom 的方式统一管理依赖版本。

spring-framework-bom 形式：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <modelVersion>4.0.0</modelVersion>
  <groupId>org.springframework</groupId>
  <artifactId>spring-framework-bom</artifactId>
  <version>4.3.13.RELEASE</version>
  <packaging>pom</packaging>

  ...

  <dependencyManagement>
    <dependencies>
    </dependency>
  </dependencyManagement>
</project>
```

其他项目引入 spring-framework-bom 来管理 spring-framework 依赖版本的方式：

```xml
<dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-framework-bom</artifactId>
        <version>${spring.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
</dependencyManagement>
```

### 如何打包一个可以直接运行的 Spring Boot jar 包

可以使用 spring-boot-maven-plugin 插件

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <executions>
        <execution>
          <goals>
            <goal>repackage</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

如果引入了第三方 jar 包，如何打包？

首先，要添加依赖

```xml
<dependency>
  <groupId>io.github.dunwu</groupId>
  <artifactId>dunwu-common</artifactId>
  <version>1.0.0</version>
  <scope>system</scope>
  <systemPath>${project.basedir}/src/main/resources/lib/dunwu-common-1.0.0.jar</systemPath>
</dependency>
```

接着，需要配置 spring-boot-maven-plugin 插件：

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <executions>
        <execution>
          <goals>
            <goal>repackage</goal>
          </goals>
        </execution>
      </executions>
      <configuration>
        <includeSystemScope>true</includeSystemScope>
      </configuration>
    </plugin>
  </plugins>
</build>
```
