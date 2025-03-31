---
title: Flume
date: 2019-05-07 20:19:25
order: 01
categories:
  - 大数据
tags:
  - 大数据
  - Flume
permalink: /pages/c9b51a18/
---

# Flume

## Flume 简介

Apache Flume 是一个分布式，高可用的数据收集系统。它可以从不同的数据源收集数据，经过聚合后发送到存储系统中，通常用于日志数据的收集。Flume 分为 NG 和 OG (1.0 之前） 两个版本，NG 在 OG 的基础上进行了完全的重构，是目前使用最为广泛的版本。下面的介绍均以 NG 为基础。

## Flume 架构

![Agent component diagram](https://flume.apache.org/releases/content/1.11.0/_images/UserGuide_image00.png)

外部数据源以特定格式向 Flume 发送 `events` （事件），当 `source` 接收到 `events` 时，它将其存储到一个或多个 `channel`，`channel` 会一直保存 `events` 直到它被 `sink` 所消费。`sink` 的主要功能从 `channel` 中读取 `events`，并将其存入外部存储系统或转发到下一个 `source`，成功后再从 `channel` 中移除 `events`。

Flume 基本概念

- **Event** - `Event` 是 Flume NG 数据传输的基本单元。类似于 JMS 和消息系统中的消息。一个 `Event` 由标题和正文组成：前者是键/值映射，后者是任意字节数组。
- **Agent** - 是一个独立的 (JVM) 进程，包含 `Source`、 `Channel`、 `Sink` 等组件。
  - **Source** - 数据收集组件，从外部数据源收集数据，并存储到 Channel 中。
  - **Channel** - `Channel` 是源和接收器之间的管道，用于临时存储数据。可以是内存或持久化的文件系统：
    - `Memory Channel` : 使用内存，优点是速度快，但数据可能会丢失 （如突然宕机）；
    - `File Channel` : 使用持久化的文件系统，优点是能保证数据不丢失，但是速度慢。
  - **Sink** - `Sink` 的主要功能从 `Channel` 中读取 `Event`，并将其存入外部存储系统或将其转发到下一个 `Source`，成功后再从 `Channel` 中移除 `Event`。

Flume 组件种类

Flume 中的每一个组件都提供了丰富的类型，适用于不同场景：

- Source 类型 ：内置了几十种类型，如 `Avro Source`，`Thrift Source`，`Kafka Source`，`JMS Source`；
- Sink 类型 ：`HDFS Sink`，`Hive Sink`，`HBaseSinks`，`Avro Sink` 等；
- Channel 类型 ：`Memory Channel`，`JDBC Channel`，`Kafka Channel`，`File Channel` 等。

对于 Flume 的使用，除非有特别的需求，否则通过组合内置的各种类型的 Source，Sink 和 Channel 就能满足大多数的需求。在 [Flume 官网](http://flume.apache.org/releases/content/1.9.0/FlumeUserGuide.html) 上对所有类型组件的配置参数均以表格的方式做了详尽的介绍，并附有配置样例；同时不同版本的参数可能略有所不同，所以使用时建议选取官网对应版本的 User Guide 作为主要参考资料。

## Flume 架构模式

Flume 支持多种架构模式，分别介绍如下

### multi-agent flow

![Two agents communicating over Avro RPC](https://flume.apache.org/releases/content/1.11.0/_images/UserGuide_image03.png)

Flume 支持跨越多个 Agent 的数据传递，这要求前一个 Agent 的 Sink 和下一个 Agent 的 Source 都必须是 `Avro` 类型，Sink 指向 Source 所在主机名 （或 IP 地址） 和端口（详细配置见下文案例三）。

### Consolidation

![A fan-in flow using Avro RPC to consolidate events in one place](https://flume.apache.org/releases/content/1.11.0/_images/UserGuide_image02.png)

日志收集中常常存在大量的客户端（比如分布式 web 服务），Flume 支持使用多个 Agent 分别收集日志，然后通过一个或者多个 Agent 聚合后再存储到文件系统中。

### Multiplexing the flow

![A fan-out flow using a (multiplexing) channel selector](https://flume.apache.org/releases/content/1.11.0/_images/UserGuide_image01.png)

Flume 支持从一个 Source 向多个 Channel，也就是向多个 Sink 传递事件，这个操作称之为 `Fan Out`（扇出）。默认情况下 `Fan Out` 是向所有的 Channel 复制 `Event`，即所有 Channel 收到的数据都是相同的。同时 Flume 也支持在 `Source` 上自定义一个复用选择器 (multiplexing selector) 来实现自定义的路由规则。

## Flume 配置格式

Flume 配置通常需要以下两个步骤：

（1）分别定义好 Agent 的 Sources，Sinks，Channels，然后将 Sources 和 Sinks 与通道进行绑定。需要注意的是一个 Source 可以配置多个 Channel，但一个 Sink 只能配置一个 Channel。基本格式如下：

```shell
<Agent>.sources = <Source>
<Agent>.sinks = <Sink>
<Agent>.channels = <Channel1> <Channel2>

# set channel for source
<Agent>.sources.<Source>.channels = <Channel1> <Channel2> ...

# set channel for sink
<Agent>.sinks.<Sink>.channel = <Channel1>
```

（2）分别定义 Source，Sink，Channel 的具体属性。基本格式如下：

```shell
<Agent>.sources.<Source>.<someProperty> = <someValue>

# properties for channels
<Agent>.channel.<Channel>.<someProperty> = <someValue>

# properties for sinks
<Agent>.sources.<Sink>.<someProperty> = <someValue>
```

## Flume 使用案例

介绍几个 Flume 的使用案例：

- 案例一：使用 Flume 监听文件内容变动，将新增加的内容输出到控制台。
- 案例二：使用 Flume 监听指定目录，将目录下新增加的文件存储到 HDFS。
- 案例三：使用 Avro 将本服务器收集到的日志数据发送到另外一台服务器。

### 案例一

需求： 监听文件内容变动，将新增加的内容输出到控制台。

实现： 主要使用 `Exec Source` 配合 `tail` 命令实现。

#### 配置

新建配置文件 `exec-memory-logger.properties`, 其内容如下：

```shell
#指定 agent 的 sources,sinks,channels
a1.sources = s1  
a1.sinks = k1  
a1.channels = c1  
   
#配置 sources 属性
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/log.txt
a1.sources.s1.shell = /bin/bash -c

#将 sources 与 channels 进行绑定
a1.sources.s1.channels = c1
   
#配置 sink 
a1.sinks.k1.type = logger

#将 sinks 与 channels 进行绑定  
a1.sinks.k1.channel = c1  
   
#配置 channel 类型
a1.channels.c1.type = memory
```

#### 启动　

```shell
flume-ng agent \
--conf conf \
--conf-file /usr/app/apache-flume-1.6.0-cdh5.15.2-bin/examples/exec-memory-logger.properties \
--name a1 \
-Dflume.root.logger=INFO,console
```

#### 测试

向文件中追加数据：

[![img](https://camo.githubusercontent.com/794055bb44cd4142afdb34675eb08cf073a17173312d8df03ad8258a912bdc34/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d312e706e67)](https://camo.githubusercontent.com/794055bb44cd4142afdb34675eb08cf073a17173312d8df03ad8258a912bdc34/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d312e706e67)

控制台的显示：

[![img](https://camo.githubusercontent.com/46bd80666a18249b3401cc778525ae664849a6b51a3d45c433adbf1c9bb5f7eb/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d322e706e67)](https://camo.githubusercontent.com/46bd80666a18249b3401cc778525ae664849a6b51a3d45c433adbf1c9bb5f7eb/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d322e706e67)

### 案例二

需求： 监听指定目录，将目录下新增加的文件存储到 HDFS。

实现：使用 `Spooling Directory Source` 和 `HDFS Sink`。

#### 配置

```shell
#指定 agent 的 sources,sinks,channels
a1.sources = s1  
a1.sinks = k1  
a1.channels = c1  
   
#配置 sources 属性
a1.sources.s1.type =spooldir  
a1.sources.s1.spoolDir =/tmp/logs
a1.sources.s1.basenameHeader = true
a1.sources.s1.basenameHeaderKey = fileName 
#将 sources 与 channels 进行绑定  
a1.sources.s1.channels =c1 

   
#配置 sink 
a1.sinks.k1.type = hdfs
a1.sinks.k1.hdfs.path = /flume/events/%y-%m-%d/%H/
a1.sinks.k1.hdfs.filePrefix = %{fileName}
#生成的文件类型，默认是 Sequencefile，可用 DataStream，则为普通文本
a1.sinks.k1.hdfs.fileType = DataStream  
a1.sinks.k1.hdfs.useLocalTimeStamp = true
#将 sinks 与 channels 进行绑定  
a1.sinks.k1.channel = c1
   
#配置 channel 类型
a1.channels.c1.type = memory
```

#### 启动

```shell
flume-ng agent \
--conf conf \
--conf-file /usr/app/apache-flume-1.6.0-cdh5.15.2-bin/examples/spooling-memory-hdfs.properties \
--name a1 -Dflume.root.logger=INFO,console
```

#### 测试

拷贝任意文件到监听目录下，可以从日志看到文件上传到 HDFS 的路径：

```shell
# cp log.txt logs/
```

[![img](https://camo.githubusercontent.com/254c73acc86f6e95c78769a0fabfa454607f124314fa34472a9f754765d441cb/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d332e706e67)](https://camo.githubusercontent.com/254c73acc86f6e95c78769a0fabfa454607f124314fa34472a9f754765d441cb/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d332e706e67)

查看上传到 HDFS 上的文件内容与本地是否一致：

```shell
# hdfs dfs -cat /flume/events/19-04-09/13/log.txt.1554788567801
```

[![img](https://camo.githubusercontent.com/74240f5a53dbe0708725cdc065960d79a937aa64240b5d19c375b13fac11e6a5/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d342e706e67)](https://camo.githubusercontent.com/74240f5a53dbe0708725cdc065960d79a937aa64240b5d19c375b13fac11e6a5/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d342e706e67)

### 案例三

需求： 将本服务器收集到的数据发送到另外一台服务器。

实现：使用 `avro sources` 和 `avro Sink` 实现。

#### 配置日志收集 Flume

新建配置 `netcat-memory-avro.properties`，监听文件内容变化，然后将新的文件内容通过 `avro sink` 发送到 hadoop001 这台服务器的 8888 端口：

```shell
#指定 agent 的 sources,sinks,channels
a1.sources = s1
a1.sinks = k1
a1.channels = c1

#配置 sources 属性
a1.sources.s1.type = exec
a1.sources.s1.command = tail -F /tmp/log.txt
a1.sources.s1.shell = /bin/bash -c
a1.sources.s1.channels = c1

#配置 sink
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = hadoop001
a1.sinks.k1.port = 8888
a1.sinks.k1.batch-size = 1
a1.sinks.k1.channel = c1

#配置 channel 类型
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100
```

#### 配置日志聚合 Flume

使用 `avro source` 监听 hadoop001 服务器的 8888 端口，将获取到内容输出到控制台：

```shell
#指定 agent 的 sources,sinks,channels
a2.sources = s2
a2.sinks = k2
a2.channels = c2

#配置 sources 属性
a2.sources.s2.type = avro
a2.sources.s2.bind = hadoop001
a2.sources.s2.port = 8888

#将 sources 与 channels 进行绑定
a2.sources.s2.channels = c2

#配置 sink
a2.sinks.k2.type = logger

#将 sinks 与 channels 进行绑定
a2.sinks.k2.channel = c2

#配置 channel 类型
a2.channels.c2.type = memory
a2.channels.c2.capacity = 1000
a2.channels.c2.transactionCapacity = 100
```

#### 启动

启动日志聚集 Flume：

```shell
flume-ng agent \
--conf conf \
--conf-file /usr/app/apache-flume-1.6.0-cdh5.15.2-bin/examples/avro-memory-logger.properties \
--name a2 -Dflume.root.logger=INFO,console
```

在启动日志收集 Flume:

```shell
flume-ng agent \
--conf conf \
--conf-file /usr/app/apache-flume-1.6.0-cdh5.15.2-bin/examples/netcat-memory-avro.properties \
--name a1 -Dflume.root.logger=INFO,console
```

这里建议按以上顺序启动，原因是 `avro.source` 会先与端口进行绑定，这样 `avro sink` 连接时才不会报无法连接的异常。但是即使不按顺序启动也是没关系的，`sink` 会一直重试，直至建立好连接。

[![img](https://camo.githubusercontent.com/05731fcc095f6f4d19ec46e8bcdd24b695ab5e331eb98ff30c053de3fb3f03b2/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d72657472792e706e67)](https://camo.githubusercontent.com/05731fcc095f6f4d19ec46e8bcdd24b695ab5e331eb98ff30c053de3fb3f03b2/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d72657472792e706e67)

#### 测试

向文件 `tmp/log.txt` 中追加内容：

[![img](https://camo.githubusercontent.com/9e06f24ab35b86302054e9d23e177240c2d194ebded8113a089f2cb2e2bbba50/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d382e706e67)](https://camo.githubusercontent.com/9e06f24ab35b86302054e9d23e177240c2d194ebded8113a089f2cb2e2bbba50/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d382e706e67)

可以看到已经从 8888 端口监听到内容，并成功输出到控制台：

[![img](https://camo.githubusercontent.com/a15934195f40ba109ee621c0cac0371278836088ded74240bfd5f4debea3ad62/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d392e706e67)](https://camo.githubusercontent.com/a15934195f40ba109ee621c0cac0371278836088ded74240bfd5f4debea3ad62/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c756d652d6578616d706c652d392e706e67)

## 参考资料

- [Flume 官网](https://flume.apache.org/)
- [Flume 官方文档](https://flume.apache.org/releases/content/1.11.0/FlumeUserGuide.html)
- [Flume 简介及基本使用](https://github.com/heibaiying/BigData-Notes/blob/master/notes/Flume%E7%AE%80%E4%BB%8B%E5%8F%8A%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8.md)