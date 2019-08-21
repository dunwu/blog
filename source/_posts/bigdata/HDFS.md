---
title: HDFS
date: 2018-09-03
categories:
  - bigdata
tags:
  - bigdata
  - hadoop
---

# HDFS

> **HDFS 是 Hadoop 分布式文件系统。**
>
> 关键词：分布式、文件系统

<!-- TOC depthFrom:2 depthTo:3 -->

- [概述](#概述)
    - [HDFS 的特点](#hdfs-的特点)
- [HDFS 的概念](#hdfs-的概念)
    - [NameNode](#namenode)
    - [DataNode](#datanode)
    - [Block 数据块](#block-数据块)
    - [Client](#client)
- [Block 副本策略](#block-副本策略)
- [数据流](#数据流)
    - [HDFS 读文件](#hdfs-读文件)
    - [HDFS 写文件](#hdfs-写文件)
- [HDFS 安全模式](#hdfs-安全模式)
    - [什么是安全模式？](#什么是安全模式)
    - [何时正常离开安全模式](#何时正常离开安全模式)
    - [触发安全模式的原因](#触发安全模式的原因)
    - [故障排查](#故障排查)
- [HDFS 高可用](#hdfs-高可用)
    - [NameNode 的 HA 机制](#namenode-的-ha-机制)
    - [利用 QJM 实现元数据高可用](#利用-qjm-实现元数据高可用)
- [资源](#资源)

<!-- /TOC -->

## 概述

> HDFS 是 Hadoop 的核心子项目。
>
> **HDFS** 是 **Hadoop Distributed File System** 的缩写，即 Hadoop 分布式文件系统。
>
> HDFS 是一种用于存储具有流数据访问模式的超大文件的文件系统，它运行在廉价的机器集群上。

### HDFS 的特点

**优点**

- **高容错** - 数据冗余多副本，副本丢失后自动恢复
- **高可用** - NameNode HA、安全模式
- **高扩展** - 能够处理 10K 节点的规模；处理数据达到 GB、TB、甚至 PB 级别的数据；能够处理百万规模以上的文件数量，数量相当之大。
- **批处理** - 流式数据访问；数据位置暴露给计算框架
- **构建在廉价商用机器上** - 提供了容错和恢复机制

**缺点**

- **不适合低延迟数据访问** - 适合高吞吐率的场景，就是在某一时间内写入大量的数据。但是它在低延时的情况下是不行的，比如毫秒级以内读取数据，它是很难做到的。
- **不适合大量小文件存储**
  - 存储大量小文件(这里的小文件是指小于 HDFS 系统的 Block 大小的文件（默认 64M）)的话，它会占用 NameNode 大量的内存来存储文件、目录和块信息。这样是不可取的，因为 NameNode 的内存总是有限的。
  - 磁盘寻道时间超过读取时间
- **不支持并发写入** - 一个文件同时只能有一个写入者
- **不支持文件随机修改** - 仅支持追加写入

## HDFS 的概念

HDFS 采用 Master/Slave 架构。

一个 HDFS 集群是由一个 Namenode 和一定数目的 Datanodes 组成。Namenode 是一个中心服务器，负责管理文件系统的名字空间(namespace)以及客户端对文件的访问。集群中的 Datanode 一般是一个节点一个，负责管理它所在节点上的存储。HDFS 暴露了文件系统的名字空间，用户能够以文件的形式在上面存储数据。从内部看，一个文件其实被分成一个或多个数据块，这些块存储在一组 Datanode 上。Namenode 执行文件系统的名字空间操作，比如打开、关闭、重命名文件或目录。它也负责确定数据块到具体 Datanode 节点的映射。Datanode 负责处理文件系统客户端的读写请求。在 Namenode 的统一调度下进行数据块的创建、删除和复制。

<div align="center"><img src="http://dunwu.test.upcdn.net/cs/bigdata/hdfs/hdfs-architecture.png"/></div>

### NameNode

**NameNode 就是 master 工作节点。**

- 管理命名空间
- 管理元数据：文件的位置、所有者、权限、数据块等
- 管理 Block 副本策略：默认 3 个副本
- 处理客户端读写请求，为 DataNode 分配任务

#### Active NameNode 和 Standby NameNode

NameNode 通过 HA 机制来容错。

- **Active NameNode** - 是正在工作的 NameNode；
- **Standby NameNode** - 是备份的 NameNode。

Active NameNode 宕机后，Standby NameNode 快速升级为新的 Active NameNode。

Standby NameNode 周期性同步 edits 编辑日志，定期合并 fsimage 与 edits 到本地磁盘。

Hadoop 3.0 允许配置多个 Standby NameNode。

#### 元数据文件

- **edits（编辑日志文件）** - 保存了自最新检查点（Checkpoint）之后的所有文件更新操作。
- **fsimage（元数据检查点镜像文件）** - 保存了文件系统中所有的目录和文件信息，如：某个目录下有哪些子目录和文件，以及文件名、文件副本数、文件由哪些 Block 组成等。

Active NameNode 内存中有一份最新的元数据（= fsimage + edits）。

Standby NameNode 在检查点定期将内存中的元数据保存到 fsimage 文件中。

### DataNode

**DataNode 就是 slave 工作节点。**NameNode 下达命令，DataNode 执行实际的操作。

- 存储 Block 和数据校验和
- 执行客户端发送的读写操作
- 通过心跳机制定期（默认 3 秒）向 NameNode 汇报运行状态和 Block 列表信息
- 集群启动时，DataNode 向 NameNode 提供 Block 列表信息

### Block 数据块

- HDFS 最小存储单元
- 文件写入 HDFS 会被切分成若干个 Block
- Block 大小固定，默认为 128MB，可自定义
- 若一个 Block 的大小小于设定值，不会占用整个块空间
- 默认情况下每个 Block 有 3 个副本

### Client

- 将文件切分为 Block 数据块
- 与 NameNode 交互，获取文件元数据
- 与 DataNode 交互，读取或写入数据
- 管理 HDFS

## Block 副本策略

HDFS 被设计成能够在一个大集群中跨机器可靠地存储超大文件。它将每个文件存储成一系列的数据块，除了最后一个，所有的数据块都是同样大小的。为了容错，文件的所有数据块都会有副本。每个文件的数据块大小和副本系数都是可配置的。应用程序可以指定某个文件的副本数目。副本系数可以在文件创建的时候指定，也可以在之后改变。HDFS 中的文件都是一次性写入的，并且严格要求在任何时候只能有一个写入者。

**Namenode 全权管理数据块的复制**，它周期性地从集群中的每个 Datanode 接收心跳信号和块状态报告(Blockreport)。接收到心跳信号意味着该 Datanode 节点工作正常。块状态报告包含了一个该 Datanode 上所有数据块的列表。

<div align="center"><img src="http://dunwu.test.upcdn.net/cs/bigdata/hdfs/hdfs-replica.png"/></div>

- 副本 1：放在 Client 所在节点
  - 对于远程 Client，系统会随机选择节点
- 副本 2：放在不同的机架节点上
- 副本 3：放在与第二个副本同一机架的不同节点上
- 副本 N：随机选择
- 节点选择：同等条件下优先选择空闲节点

## 数据流

### HDFS 读文件

<div align="center"><img src="http://dunwu.test.upcdn.net/cs/bigdata/hdfs/hdfs-read.png"/></div>

1. 客户端调用 FileSyste 对象的 open() 方法在分布式文件系统中**打开要读取的文件**。
2. 分布式文件系统通过使用 RPC（远程过程调用）来调用 namenode，**确定文件起始块的位置**。
3. 分布式文件系统的 DistributedFileSystem 类返回一个支持文件定位的输入流 FSDataInputStream 对象，FSDataInputStream 对象接着封装 DFSInputStream 对象（**存储着文件起始几个块的 datanode 地址**），客户端对这个输入流调用 read()方法。
4. DFSInputStream 连接距离最近的 datanode，通过反复调用 read 方法，**将数据从 datanode 传输到客户端**。
5. 到达块的末端时，DFSInputStream 关闭与该 datanode 的连接，**寻找下一个块的最佳 datanode**。
6. 客户端完成读取，对 FSDataInputStream 调用 close()方法**关闭连接**。

### HDFS 写文件

<div align="center"><img src="http://dunwu.test.upcdn.net/cs/bigdata/hdfs/hdfs-write.png"/></div>

1. 客户端通过对 DistributedFileSystem 对象调用 create() 函数来**新建文件**。
2. 分布式文件系统对 namenod 创建一个 RPC 调用，在文件系统的**命名空间中新建一个文件**。
3. Namenode 对新建文件进行检查无误后，分布式文件系统返回给客户端一个 FSDataOutputStream 对象，FSDataOutputStream 对象封装一个 DFSoutPutstream 对象，负责处理 namenode 和 datanode 之间的通信，**客户端开始写入数据**。
4. FSDataOutputStream 将**数据分成一个一个的数据包，写入内部队列“数据队列”**，DataStreamer 负责将数据包依次流式传输到由一组 namenode 构成的管线中。
5. DFSOutputStream 维护着确认队列来等待 datanode 收到确认回执，**收到管道中所有 datanode 确认后，数据包从确认队列删**除。
6. **客户端完成数据的写入**，对数据流调用 close() 方法。
7. namenode **确认完成**。

## HDFS 安全模式

### 什么是安全模式？

- 安全模式是 HDFS 的一种特殊状态，在这种状态下，HDFS 只接收读数据请求，而不接收写入、删除、修改等变更请求。
- 安全模式是 HDFS 确保 Block 数据安全的一种保护机制。
- Active NameNode 启动时，HDFS 会进入安全模式，DataNode 主动向 NameNode 汇报可用 Block 列表等信息，在系统达到安全标准前，HDFS 一直处于“只读”状态。

### 何时正常离开安全模式

- Block 上报率：DataNode 上报的可用 Block 个数 / NameNode 元数据记录的 Block 个数
- 当 Block 上报率 >= 阈值时，HDFS 才能离开安全模式，默认阈值为 0.999
- 不建议手动强制退出安全模式

### 触发安全模式的原因

- NameNode 重启
- NameNode 磁盘空间不足
- Block 上报率低于阈值
- DataNode 无法正常启动
- 日志中出现严重异常
- 用户操作不当，如：**强制关机（特别注意！）**

### 故障排查

- 找到 DataNode 不能正常启动的原因，重启 DataNode
- 清理 NameNode 磁盘
- 谨慎操作，有问题找星环，以免丢失数据

## HDFS 高可用

### NameNode 的 HA 机制

Active NameNode 和 Standby NameNode 实现主备。

### 利用 QJM 实现元数据高可用

> 基于 Paxos 算法

QJM 机制（Quorum Journal Manager）

只要保证 Quorum（法定人数）数量的操作成功，就认为这是一次最终成功的操作

QJM 共享存储系统

- 部署奇数（2N+1）个 JournalNode
- JournalNode 负责存储 edits 编辑日志
- 写 edits 的时候，只要超过半数（N+1）的 JournalNode 返回成功，就代表本次写入成功
- 最多可容忍 N 个 JournalNode 宕机

利用 ZooKeeper 实现 Active 节点选举。

## 资源

- [HDFS 官方文档](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html)
- [HDFS 知识点总结](https://www.cnblogs.com/caiyisen/p/7395843.html)
- [《Hadoop: The Definitive Guide, Fourth Edition》](http://shop.oreilly.com/product/0636920033448.do) by Tom White
- http://hadoop.apache.org/docs/r1.0.4/cn/hdfs_design.html
