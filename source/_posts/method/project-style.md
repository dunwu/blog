---
title: 项目规范
categories: ['method']
tags: ['method', 'project']
date: 2019-03-06
---

# 项目规范

> 软件项目开发规范。

<!-- TOC depthFrom:2 depthTo:3 -->

- [项目结构](#项目结构)
    - [目录](#目录)
    - [文件](#文件)
- [命名规则](#命名规则)
    - [目录名](#目录名)
    - [文件名](#文件名)
- [Java 日志规范](#java-日志规范)
- [参考资料](#参考资料)

<!-- /TOC -->

## 项目结构

以下为项目根目录下的文件和目录的组织结构：

### 目录

**codes** - 代码目录。
**configurations** - 配置目录。一般存放项目相关的配置文件。如 maven 的 settings.xml，nginx 的 nginx.conf 等。
**demos** - 示例目录。
**docs** - 文档目录。
**libs** - 第三方库文件。
**scripts** - 脚本目录。一般存放用于启动、构建项目的可执行脚本文件。
**packages** - 打包文件目录。Java 项目中可能是 jar、war 等；前端项目中可能是 zip、rar 等；电子书项目中可能是 pdf 等。

### 文件

**.gitignore** - git 忽略规则。
**.gitattributes** - git 属性规则。
**.editorconfig** - 编辑器书写规则。
**README.md** - 项目说明文件。
**LICENSE** - 开源协议。如果项目是开源文件，需要添加。

## 命名规则

### 目录名

目录名必须使用半角字符，不得使用全角字符。这也意味着，中文不能用于文件名。

目录名建议只使用小写字母，不使用大写字母。

```
不佳： Test
正确： test
```

目录名可以使用数字，但不应该是首字符。

```
不佳： 1-demo
正确： demo1
```

目录名包含多个单词时，单词之间建议使用半角的连词线（`-`）分隔。

```
不佳： common_demo
正确： common-demo
```

### 文件名

文档的文件名不得含有空格。

文件名必须使用半角字符，不得使用全角字符。这也意味着，中文不能用于文件名。

```
错误： 名词解释.md
正确： glossary.md
```

文件名建议只使用小写字母，不使用大写字母。

```
错误：TroubleShooting.md
正确：troubleshooting.md
```

为了醒目，某些说明文件的文件名，可以使用大写字母，比如`README`、`LICENSE`。

一些约定俗成的习惯可以保持传统写法，如：Java 的文件名一般使用驼峰命名法，且首字母大写；配置文件 `applicationContext.xml` ；React 中的 JSX 组件文件名一般使用驼峰命名法，且首字母大写等。

文件名包含多个单词时，单词之间建议使用半角的连词线（`-`）分隔。

```
不佳：advanced_usage.md
正确：advanced-usage.md
```

## Java 日志规范

> 这里基于[阿里巴巴 Java 开发手册](https://yq.aliyun.com/attachment/download/?id=4942)日志规约章节，结合自己的开发经验做了一些增删和调整。

1. 【强制】应用中不可直接使用日志系统（Log4j、Logback）中的 API，而应依赖使用日志框架 SLF4J 中的 API，使用门面模式的日志框架，有利于维护和各个类的日志处理方式统一。

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
private static final Logger logger = LoggerFactory.getLogger(Abc.class);
```

2. 【强制】日志文件推荐至少保存 `30` 天，因为有些异常具备以“周”为频次发生的特点。

3. 【强制】应用中的扩展日志（如打点、临时监控、访问日志等）命名方式：`appName_logType_logName.log`。logType:日志类型，推荐分类有 stats/desc/monitor/visit 等；logName:日志描述。这种命名的好处：通过文件名就可知道日志文件属于什么应用，什么类型，什么目的，也有利于归类查找。

**正例**：mppserver 应用中单独监控时区转换异常，如：`mppserver_monitor_timeZoneConvert.log`

**说明**：推荐对日志进行分类，如将错误日志和业务日志分开存放，便于开发人员查看，也便于通过日志对系统进行及时监控。

4. 【强制】对 `trace/debug/info` 级别的日志输出，必须使用条件输出形式或者使用占位符的方式。

说明：`logger.debug("Processing trade with id: " + id + " and symbol: " + symbol);` 如果日志级别是 warn，上述日志不会打印，但是会执行字符串拼接操作，如果 symbol 是对象，会执行 toString()方法，浪费了系统资源，执行了上述操作，最终日志却没有打印。

**正例：（条件）**

```
if (logger.isDebugEnabled()) {
logger.debug("Processing trade with id: " + id + " and symbol: " + symbol);
}
```

**正例：（占位符）**

```
logger.debug("Processing trade with id: {} and symbol : {} ", id, symbol);
```

5. 【强制】避免重复打印日志，浪费磁盘空间。务必在 `log4j.xml` 或 `logback.xml` 中设置 `additivity=false`。

**正例**：

```xml
<logger name="com.taobao.dubbo.config" additivity="false">
```

6. 【强制】异常信息应该包括两类信息：案发现场信息和异常堆栈信息。如果不处理，那么通过关键字 throws 往上抛出。

**正例**：logger.error(各类参数或者对象 toString + "\_" + e.getMessage(), e);

9. 【强制】日志格式遵循如下格式：

<div align="center"><img src="http://dunwu.test.upcdn.net/cs/java/javalib/log/logback/log-pattern.png"/></div>

打印出的日志信息如：

```
2018-03-29 15:06:57.277 [javalib] [main] [TRACE] i.g.dunwu.javalib.log.LogbackDemo#main - 这是一条 trace 日志记录
2018-03-29 15:06:57.282 [javalib] [main] [DEBUG] i.g.dunwu.javalib.log.LogbackDemo#main - 这是一条 debug 日志记录
2018-03-29 15:06:57.282 [javalib] [main] [INFO] i.g.dunwu.javalib.log.LogbackDemo#main - 这是一条 info 日志记录
2018-03-29 15:06:57.282 [javalib] [main] [WARN] i.g.dunwu.javalib.log.LogbackDemo#main - 这是一条 warn 日志记录
2018-03-29 15:06:57.282 [javalib] [main] [ERROR] i.g.dunwu.javalib.log.LogbackDemo#main - 这是一条 error 日志记录
```

8. 【参考】slf4j 支持的日志级别，按照级别从低到高，分别为：`trace < debug < info < warn < error`。

建议只使用 `debug < info < warn < error` 四个级别。

- `error` 日志级别只记录系统逻辑出错、异常等重要的错误信息。如非必要，请不要在此场景打出 error 级别。
- `warn` 日志级别记录用户输入参数错误的情况，避免用户投诉时，无所适从。
- `info` 日志级别记录业务逻辑中一些重要步骤信息。
- `debug` 日志级别记录一些用于调试的信息。

10. 【参考】有一些第三方框架或库的日志对于排查问题具有一定的帮助，如 Spring、Dubbo、Mybatis 等。这些框架所使用的日志库未必和本项目一样，为了避免出现日志无法输出的问题，请引入对应的桥接 jar 包。

## 参考资料

- [阿里巴巴 Java 开发手册](https://yq.aliyun.com/attachment/download/?id=4942)日志规约章节
