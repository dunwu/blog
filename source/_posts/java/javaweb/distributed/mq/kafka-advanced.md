---
title: Kafka
date: 2018-06-13
categories:
  - 分布式
tags:
  - java
  - javaweb
  - 分布式
  - mq
---

# Kafka

> Kafka 是一个分布式的、可水平扩展的、基于发布/订阅模式的、支持容错的消息系统。

<!-- TOC depthFrom:2 depthTo:3 -->

- [1. 概述](#1-概述)
  - [1.1. 分布式](#11-分布式)
  - [1.2. 容错](#12-容错)
  - [1.3. 提交日志](#13-提交日志)
  - [1.4. 消息队列](#14-消息队列)
  - [1.5. 为什么要使用消息系统](#15-为什么要使用消息系统)
  - [1.6. Kafka 的关键功能](#16-kafka-的关键功能)
  - [1.7. Kafka 基本概念](#17-kafka-基本概念)
  - [1.8. Kafka 核心 API](#18-kafka-核心-api)
  - [1.9. Topic 和日志](#19-topic-和日志)
- [2. Kafka 工作原理](#2-kafka-工作原理)
- [3. 持久化](#3-持久化)
- [4. 复制](#4-复制)
- [5. 流处理](#5-流处理)
  - [5.1. 无状态处理](#51-无状态处理)
  - [5.2. 有状态处理](#52-有状态处理)
- [6. Kafka 应用场景](#6-kafka-应用场景)
- [7. 幂等性](#7-幂等性)
  - [7.1. 幂等性实现](#71-幂等性实现)
  - [7.2. 幂等性的应用实例](#72-幂等性的应用实例)
- [8. 事务](#8-事务)
  - [8.1. 事务属性理解](#81-事务属性理解)
  - [8.2. 引入事务目的](#82-引入事务目的)
  - [8.3. 事务操作的 API](#83-事务操作的-api)
  - [8.4. 事务属性的应用实例](#84-事务属性的应用实例)
  - [8.5. 生产者事务的实现](#85-生产者事务的实现)
  - [8.6. 其他思考](#86-其他思考)
- [9. 资料](#9-资料)
  - [9.1. 官方资料](#91-官方资料)
  - [9.2. 第三方资料](#92-第三方资料)

<!-- /TOC -->

## 1. 概述

### 1.1. 分布式

分布式系统是一个由多个运行机器组成的系统，所有这些机器在一个集群中一起工作，对最终端用户表现为一个节点。

Kafka 的分布式意义在于：它在不同的节点上存储、接收和发送消息。

### 1.2. 容错

分布式系统一般都会设计容错机制，保证集群中几个节点出现故障时，仍能对外提供服务。

### 1.3. 提交日志

提交日志（也称为预写日志，事务日志）是仅支持附加的持久有序数据结构。您不能修改或删除记录。它从左到右读取并保证项目排序。

Kafka 实际上将所有的消息存储到磁盘，并在结构中对它们进行排序，以便利用顺序磁盘读取。

### 1.4. 消息队列

消息队列技术是分布式应用间交换信息的一种技术。消息队列可驻留在内存或磁盘上, 队列存储消息直到它们被应用程序读走。通过消息队列，应用程序可独立地执行--它们不需要知道彼此的位置、或在继续执行前不需要等待接收程序接收此消息。在分布式计算环境中，为了集成分布式应用，开发者需要对异构网络环境下的分布式应用提供有效的通信手段。为了管理需要共享的信息，对应用提供公共的信息交换机制是重要的。常用的消息队列技术是 Message Queue。

Message Queue 的通信模式：

- **点对点**：点对点方式是最为传统和常见的通讯方式，它支持一对一、一对多、多对多、多对一等多种配置方式，支持树状、网状等多种拓扑结构。
- **多点广播**：MQ 适用于不同类型的应用。其中重要的，也是正在发展中的是"多点广播"应用，即能够将消息发送到多个目标站点 (Destination List)。可以使用一条 MQ 指令将单一消息发送到多个目标站点，并确保为每一站点可靠地提供信息。MQ 不仅提供了多点广播的功能，而且还拥有智能消息分发功能，在将一条消息发送到同一系统上的多个用户时，MQ 将消息的一个复制版本和该系统上接收者的名单发送到目标 MQ 系统。目标 MQ 系统在本地复制这些消息，并将它们发送到名单上的队列，从而尽可能减少网络的传输量。
- **发布/订阅 (Publish/Subscribe)**：发布/订阅功能使消息的分发可以突破目的队列地理指向的限制，使消息按照特定的主题甚至内容进行分发，用户或应用程序可以根据主题或内容接收到所需要的消息。发布/订阅功能使得发送者和接收者之间的耦合关系变得更为松散，发送者不必关心接收者的目的地址，而接收者也不必关心消息的发送地址，而只是根据消息的主题进行消息的收发。
- **集群 (Cluster)**：为了简化点对点通讯模式中的系统配置，MQ 提供 Cluster(集群) 的解决方案。集群类似于一个域 (Domain)，集群内部的队列管理器之间通讯时，不需要两两之间建立消息通道，而是采用集群 (Cluster) 通道与其它成员通讯，从而大大简化了系统配置。此外，集群中的队列管理器之间能够自动进行负载均衡，当某一队列管理器出现故障时，其它队列管理器可以接管它的工作，从而大大提高系统的高可靠性。

### 1.5. 为什么要使用消息系统

- 解耦
  在项目启动之初来预测将来项目会碰到什么需求，是极其困难的。消息系统在处理过程中间插入了一个隐含的、基于数据的接口层，两边的处理过程都要实现这一接口。这允许你独立的扩展或修改两边的处理过程，只要确保它们遵守同样的接口约束。
- 冗余
  有些情况下，处理数据的过程会失败。除非数据被持久化，否则将造成丢失。消息队列把数据进行持久化直到它们已经被完全处理，通过这一方式规避了数据丢失风险。许多消息队列所采用的"插入-获取-删除"范式中，在把一个消息从队列中删除之前，需要你的处理系统明确的指出该消息已经被处理完毕，从而确保你的数据被安全的保存直到你使用完毕。
- 扩展性
  因为消息队列解耦了你的处理过程，所以增大消息入队和处理的频率是很容易的，只要另外增加处理过程即可。不需要改变代码、不需要调节参数。扩展就像调大电力按钮一样简单。
- 灵活性 & 峰值处理能力
  在访问量剧增的情况下，应用仍然需要继续发挥作用，但是这样的突发流量并不常见；如果为以能处理这类峰值访问为标准来投入资源随时待命无疑是巨大的浪费。使用消息队列能够使关键组件顶住突发的访问压力，而不会因为突发的超负荷的请求而完全崩溃。
- 可恢复性
  系统的一部分组件失效时，不会影响到整个系统。消息队列降低了进程间的耦合度，所以即使一个处理消息的进程挂掉，加入队列中的消息仍然可以在系统恢复后被处理。
- 顺序保证
  在大多使用场景下，数据处理的顺序都很重要。大部分消息队列本来就是排序的，并且能保证数据会按照特定的顺序来处理。Kafka 保证一个 Partition 内的消息的有序性。
- 缓冲
  在任何重要的系统中，都会有需要不同的处理时间的元素。例如，加载一张图片比应用过滤器花费更少的时间。消息队列通过一个缓冲层来帮助任务最高效率的执行———写入队列的处理会尽可能的快速。该缓冲有助于控制和优化数据流经过系统的速度。
- 异步通信
  很多时候，用户不想也不需要立即处理消息。消息队列提供了异步处理机制，允许用户把一个消息放入队列，但并不立即处理它。想向队列中放入多少消息就放多少，然后在需要的时候再去处理它们。

### 1.6. Kafka 的关键功能

- 发布和订阅流记录，类似于消息队列或企业级消息系统。
- 以容错、持久化的方式存储流记录。
- 处理流记录。

### 1.7. Kafka 基本概念

- Kafka 作为一个集群运行在一台或多台可以跨越多个数据中心的服务器上。
- Kafka 集群在称为 Topic 的类别中存储记录流。
- Kafka 的每个记录由一个键，一个值和一个时间戳组成。

### 1.8. Kafka 核心 API

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-core-api.png" width="400"/>
</div>

- Producer - 允许应用程序将记录流发布到一个或多个 Kafka Topic。
- Consumer - 允许应用程序订阅一个或多个 Topic 并处理为他们生成的记录流。
- Streams - 允许应用程序充当流处理器，从一个或多个 Topic 中消费输入流，并将输出流生成为一个或多个输出 Topic，从而将输入流有效地转换为输出流。
- Connector - 允许构建和运行可重复使用的生产者或消费者，将 Kafka Topic 连接到现有的应用程序或数据系统。例如，连接到关系数据库的连接器可能会捕获对表的每个更改。

在 Kafka 中，客户端和服务器之间的通信是采用 TCP 协议方式。

### 1.9. Topic 和日志

Topic 是一个目录名，它保存着发布记录。kafka 的 Topic 始终是多订阅者的，也就是说，一个主题可以有零个，一个或多个订阅写入数据的 Consumer。

在 Kafka 中，任意一个 Topic 维护一个 Partition 的日志，类似下图：

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-log-anatomy.png" width="400"/>
</div>

每个 Partition 都是一个有序的，不可变的记录序列，不断追加到结构化的提交日志中。Partition 中的记录每个分配一个连续的 id 号，称为偏移量，用于唯一标识 Partition 内的每条记录。

Kafka 集群持久化保存（使用可配置的保留期限）所有发布记录——无论它们是否被消费。例如，如果保留期限被设置为两天，则在记录发布后的两天之内，它都可以被消费，超过时间后将被丢弃以释放空间。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-log-consumer.png" width="400"/>
</div>

实际上，保留在每个 Consumer 基础上的唯一元数据是该 Consumer 在日志中的抵消或位置。这个偏移量是由 Consumer 控制的：Consumer 通常会在读取记录时线性地推进其偏移量，但实际上，由于位置由 Consumer 控制，因此它可以按照喜欢的任何顺序消费记录。

这种功能组合意味着 Kafka Consumer 的开销很小——它们的出现对集群和其他 Consumer 没有多少影响。

日志中的 Partition 有多种目的。首先，它们允许日志的大小超出服务器限制的大小。每个单独的 Partition 必须适合承载它的服务器，但是一个主题可能有很多 Partition，因此它可以处理任意数量的数据。其次，它们作为并行的单位。

## 2. Kafka 工作原理

- **Broker** - Kafka 集群包含一个或多个服务器，这种服务器被称为 broker。
- **Topic** - 每条发布到 Kafka 集群的消息都有一个类别，这个类别被称为 Topic。（物理上不同 Topic 的消息分开存储，逻辑上一个 Topic 的消息虽然保存于一个或多个 broker 上但用户只需指定消息的 Topic 即可生产或消费数据而不必关心数据存于何处）。
- **Partition** - Parition 是物理上的概念，每个 Topic 包含一个或多个 Partition。
- **Producer** - 负责发布消息到 Kafka broker。
- **Consumer** - 消息消费者，向 Kafka broker 读取消息的客户端。
- **Consumer Group** - 每个 Consumer 属于一个特定的 Consumer Group（可为每个 Consumer 指定 group name，若不指定 group name 则属于默认的 group）。

Producer 将消息（记录）发送到 Kafka 节点（Broker），消息由称为 Consumer 的其他应用程序处理。消息被存储在 Topic 中，并且 Consumer 订阅该主题以接收新消息。

随着 Topic 变得日益庞大，它们会被分割成更小的 Partition 以提高性能和可伸缩性。Kafka 保证 Partition 内的所有消息按照它们出现的顺序排序。区分特定消息的方式是通过它的偏移量，您可以将它看作普通数组索引，每个新消息都会增加一个序列号在一个 Partition 中。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-log-anatomy.png" width="400"/>
</div>

Kafka 遵循发布/订阅模式。这意味着 Kafka 不会跟踪 Kafka 读取哪些记录并删除它们，而是将它们存储一段时间（例如一天）或直到满足某个大小阈值。Consumer 自己对 Kafka 进行新的消息调查并说出他们想要阅读的记录。这使得他们可以按照自己的意愿递增/递减偏移量，从而能够重播和重新处理事件。

Kafka 集群持久化保存（使用可配置的保留期限）所有发布记录——无论它们是否被消费。例如，如果保留期限被设置为两天，则在记录发布后的两天之内，它都可以被消费，超过时间后将被丢弃以释放空间。

值得注意的是，Consumer 实际上是内部拥有一个或多个 Consumer 流程的 Consumer 群体。为了避免两个进程读两次相同的消息，每个 Partition 仅与每个组的一个 Consumer 进程相关联。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-producer-consumer.png" width="640"/>
</div>

## 3. 持久化

Kafka 实际上将其所有记录存储在磁盘中，并且不会将任何内容保留在 RAM 中。

- Kafka 有一个将消息分组在一起的协议。它允许网络请求将消息分组在一起以减少网络开销。服务器一气呵成的将消息的数据块持久化并立即获取较大的线性块。
- 线性读取/写入磁盘速度很快。现代磁盘速度较慢的概念是由于大量的磁盘搜索，这在大型线性操作中不是问题。
- 所说的线性操作由操作系统通过预读（预取大块数倍）和后写（将小的逻辑写入大物理写入）技术进行了大量优化。
- 现代操作系统将磁盘缓存在可用 RAM 中。这被称为 pagecache。
- 由于 Kafka 在整个流程（生产者 -> 经纪 -> 消费者）中以标准化的二进制格式存储未修改的消息，所以它可以利用零拷贝优化。这就是操作系统将数据从页面缓存直接复制到套接字时，完全绕过了 Kafka 经纪人应用程序。

所有这些优化都允许 Kafka 以接近网络速度传递消息。

## 4. 复制

分区数据在多个代理中复制，以便在一个代理死亡的情况下保存数据。

在任何时候，一个代理“拥有”一个分区，并且是应用程序通过该分区读写数据的节点。这被称为分区领导。它将它收到的数据复制到 N 个其他代理（称为追随者）。他们也存储数据，并准备在领导者节点死亡的情况下取代领导者。这就是典型的一主多从模式。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-replication.png" width="640"/>
</div>

生产者/消费者如何知道分区的领导者是谁？

对于生产者/消费者来说，从一个分区写入/读取，他们需要知道它的领导者，对吧？这些信息需要从某处获得。Kafka 将这种元数据存储在一个名为 Zookeeper 的服务中。

生产者和消费者都和 Zookeeper 连接并通信。Kafka 一直在摆脱这种耦合，自 0.8 和 0.9 版分别开始，客户端直接从 Kafka 经纪人那里获取元数据信息，他们自己与 Zookeeper 交谈。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-metadata-flow.png" width="640"/>
</div>

## 5. 流处理

在 Kafka 中，流处理器是任何需要从输入主题中持续输入数据流，对该输入执行一些处理并生成输出主题的数据流（或外部服务，数据库，垃圾桶，无论哪里真的......）

可以直接使用生产者/消费者 API 进行简单处理，但对于更复杂的转换（如将流连接在一起），Kafka 提供了一个集成的 Streams API 库。

此 API 旨在用于您自己的代码库中，它不在代理上运行。它与消费者 API 类似，可帮助您扩展多个应用程序的流处理工作（类似于消费者群体）。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-stream-processor.png" width="640"/>
</div>

### 5.1. 无状态处理

流的无状态处理是确定性处理，不依赖于任何外部。你知道，对于任何给定的数据，你将总是产生独立于其他任何东西的相同输出。

一个流可以被解释为一个表，一个表可以被解释为一个流。

流可以被解释为数据的一系列更新，其中聚合是表的最终结果。

如果您看看如何实现同步数据库复制，您会发现它是通过所谓的流式复制，其中表中的每个更改都发送到副本服务器。

Kafka 流可以用同样的方式解释 - 当从最终状态积累时的事件。这样的流聚合被保存在本地的 RocksDB 中（默认情况下），被称为 KTable。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-ktable.png" width="640"/>
</div>

可以将表格视为流中每个键的最新值的快照。以同样的方式，流记录可以产生一个表，表更新可以产生一个更新日志流。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-table-as-stream.png" width="640"/>
</div>

### 5.2. 有状态处理

一些简单的操作，如 map() 或 filter() 是无状态的，并且不要求您保留有关处理的任何数据。但是，在现实生活中，你要做的大多数操作都是有状态的（例如 count()），因此需要存储当前的累积状态。

维护流处理器上的状态的问题是流处理器可能会失败！你需要在哪里保持这个状态才能容错？

一种天真的做法是简单地将所有状态存储在远程数据库中，并通过网络连接到该存储。问题在于没有数据的地方和大量的网络往返，这两者都会显著减慢你的应用程序。一个更微妙但重要的问题是，您的流处理作业的正常运行时间将与远程数据库紧密耦合，并且作业不会自成体系（数据库中来自另一个团队的更改可能会破坏您的处理过程）。

那么更好的方法是什么？

回想一下表和流的双重性。这使我们能够将数据流转换为与我们的处理共处一地的表格。它还为我们提供了处理容错的机制 - 通过将流存储在 Kafka 代理中。

流处理器可以将其状态保存在本地表（例如 RocksDB）中，该表将从输入流更新（可能是某种任意转换之后）。当进程失败时，它可以通过重放流来恢复其数据。

您甚至可以让远程数据库成为流的生产者，从而有效地广播更新日志，以便在本地重建表。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-stateful-process.png" width="640"/>
</div>

## 6. Kafka 应用场景

- 构建实时的流数据管道，在系统或应用间获取可靠数据。
- 构建实时的流应用程序，用于转换或响应数据流。

正如我们已经介绍的那样，Kafka 允许您将大量消息通过集中介质存储并存储，而不用担心性能或数据丢失等问题。

这意味着它非常适合用作系统架构的核心，充当连接不同应用程序的集中介质。 Kafka 可以成为事件驱动架构的核心部分，并允许您真正将应用程序彼此分离。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-event-system.png" width="640"/>
</div>

Kafka 允许您轻松分离不同（微）服务之间的通信。利用 Streams API，现在比以往更容易编写业务逻辑，丰富了 Kafka 主题数据以便服务消费。

## 7. 幂等性

幂等性引入目的：生产者重复生产消息。生产者进行 retry 会产生重试时，会重复产生消息。有了幂等性之后，在进行 retry 重试时，只会生成一个消息。

### 7.1. 幂等性实现

#### 7.1.1. PID 和 Sequence Number

为了实现 Producer 的幂等性，Kafka 引入了 Producer ID（即 PID）和 Sequence Number。

- PID。每个新的 Producer 在初始化的时候会被分配一个唯一的 PID，这个 PID 对用户是不可见的。
- Sequence Numbler。（对于每个 PID，该 Producer 发送数据的每个<Topic, Partition>都对应一个从 0 开始单调递增的 Sequence Number。

Broker 端在缓存中保存了这 seq number，对于接收的每条消息，如果其序号比 Broker 缓存中序号大于 1 则接受它，否则将其丢弃。这样就可以实现了消息重复提交了。但是，只能保证单个 Producer 对于同一个<Topic, Partition>的 Exactly Once 语义。不能保证同一个 Producer 一个 topic 不同的 partion 幂等。

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/1-1.png"/></div><br>

实现幂等之后

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/2.png"/></div><br>

#### 7.1.2. 生成 PID 的流程

在执行创建事务时，如下：

```java
Producer<String, String> producer = new KafkaProducer<String, String>(props);
```

会创建一个 Sender，并启动线程，执行如下 run 方法，在 maybeWaitForProducerId()中生成一个 producerId，如下：

```java
====================================
类名：Sender
====================================

void run(long now) {
        if (transactionManager != null) {
            try {
                 ........
                if (!transactionManager.isTransactional()) {
                    // 为idempotent producer生成一个producer id
                    maybeWaitForProducerId();
                } else if (transactionManager.hasUnresolvedSequences() && !transactionManager.hasFatalError()) {
                   ........
```

### 7.2. 幂等性的应用实例

（1）配置属性

需要设置：

- enable.idempotence，需要设置为 ture,此时就会默认把 acks 设置为 all，所以不需要再设置 acks 属性了。

```java
private Producer buildIdempotProducer(){

    // create instance for properties to access producer configs
    Properties props = new Properties();

    // bootstrap.servers是Kafka集群的IP地址。多个时,使用逗号隔开
    props.put("bootstrap.servers", "localhost:9092");

    props.put("enable.idempotence",true);

    //If the request fails, the producer can automatically retry,
    props.put("retries", 3);

    //Reduce the no of requests less than 0
    props.put("linger.ms", 1);

    //The buffer.memory controls the total amount of memory available to the producer for buffering.
    props.put("buffer.memory", 33554432);

    // Kafka消息是以键值对的形式发送,需要设置key和value类型序列化器
    props.put("key.serializer",
            "org.apache.kafka.common.serialization.StringSerializer");

    props.put("value.serializer",
            "org.apache.kafka.common.serialization.StringSerializer");

    Producer<String, String> producer = new KafkaProducer<String, String>(props);


    return producer;
}
```

（2）发送消息

跟一般生产者一样，如下

```java
public void produceIdempotMessage(String topic, String message) {
    // 创建Producer
    Producer producer = buildIdempotProducer();
    // 发送消息
    producer.send(new ProducerRecord<String, String>(topic, message));
    producer.flush();
}
```

此时，因为我们并没有配置 transaction.id 属性，所以不能使用事务相关 API，如下

```java
producer.initTransactions();
```

否则会出现如下错误：

```java
Exception in thread “main” java.lang.IllegalStateException: Transactional method invoked on a non-transactional producer.
    at org.apache.kafka.clients.producer.internals.TransactionManager.ensureTransactional(TransactionManager.java:777)
    at org.apache.kafka.clients.producer.internals.TransactionManager.initializeTransactions(TransactionManager.java:202)
    at org.apache.kafka.clients.producer.KafkaProducer.initTransactions(KafkaProducer.java:544)
```

## 8. 事务

### 8.1. 事务属性理解

事务属性是 2017 年 Kafka 0.11.0.0 引入的新特性。类似于数据库事务，只是这里的数据源是 Kafka，**kafka 事务属性是指一系列的生产者生产消息和消费者提交偏移量的操作在一个事务，或者说是是一个原子操作），同时成功或者失败**。

注意：在理解消息的事务时，一直处于一个错误理解就是如下代码中，把操作 db 的业务逻辑跟操作消息当成是一个事务。其实这个是有问题的，操作 DB 数据库的数据源是 DB，消息数据源是 kfaka，这是完全不同两个数据，一种数据源（如 mysql，kafka）对应一个事务，所以它们是两个独立的事务：kafka 事务指 kafka 一系列 生产、消费消息等操作组成一个原子操作；db 事务是指操作数据库的一系列增删改操作组成一个原子操作。

```java
void  kakfa_in_tranction() {
    // 1.kafa的操作：读取消息或者生产消息
    kafkaOperation();
    // 2.db操作
    dbOperation();
}
```

### 8.2. 引入事务目的

在事务属性之前先引入了生产者幂等性，它的作用为：

- 生产者多次发送消息可以封装成一个原子操作，要么都成功，要么失败
- consumer-transform-producer 模式下，因为消费者提交偏移量出现问题，导致在重复消费消息时，生产者重复生产消息。需要将这个模式下消费者提交偏移量操作和生产者一系列生成消息的操作封装成一个原子操作。

**消费者提交偏移量导致重复消费消息的场景**：消费者在消费消息完成提交便宜量 o2 之前挂掉了（假设它最近提交的偏移量是 o1），此时执行再均衡时，其它消费者会重复消费消息(o1 到 o2 之间的消息）。

### 8.3. 事务操作的 API

producer 提供了 initTransactions, beginTransaction, sendOffsets, commitTransaction, abortTransaction 五个事务方法。

```java
    /**
     * 初始化事务。需要注意的有：
     * 1、前提
     * 需要保证transation.id属性被配置。
     * 2、这个方法执行逻辑是：
     *   （1）Ensures any transactions initiated by previous instances of the producer with the same
     *      transactional.id are completed. If the previous instance had failed with a transaction in
     *      progress, it will be aborted. If the last transaction had begun completion,
     *      but not yet finished, this method awaits its completion.
     *    （2）Gets the internal producer id and epoch, used in all future transactional
     *      messages issued by the producer.
     *
     */
    public void initTransactions();

    /**
     * 开启事务
     */
    public void beginTransaction() throws ProducerFencedException ;

    /**
     * 为消费者提供的在事务内提交偏移量的操作
     */
    public void sendOffsetsToTransaction(Map<TopicPartition, OffsetAndMetadata> offsets,
                                         String consumerGroupId) throws ProducerFencedException ;

    /**
     * 提交事务
     */
    public void commitTransaction() throws ProducerFencedException;

    /**
     * 放弃事务，类似回滚事务的操作
     */
    public void abortTransaction() throws ProducerFencedException ;
```

### 8.4. 事务属性的应用实例

在一个原子操作中，根据包含的操作类型，可以分为三种情况，**前两种情况是事务引入的场景**，最后一种情况没有使用价值。

只有 Producer 生产消息；

消费消息和生产消息并存，**这个是事务场景中最常用的情况**，就是我们常说的“consume-transform-produce ”模式

只有 consumer 消费消息，这种操作其实没有什么意义，跟使用手动提交效果一样，而且也不是事务属性引入的目的，所以一般不会使用这种情况

#### 8.4.1. 相关属性配置

使用 kafka 的事务 api 时的一些注意事项：

- 需要消费者的自动模式设置为 false,并且不能子再手动的进行执行 consumer#commitSync 或者 consumer#commitAsyc
- 生产者配置 transaction.id 属性
- 生产者不需要再配置 enable.idempotence，因为如果配置了 transaction.id，则此时 enable.idempotence 会被设置为 true
- 消费者需要配置 Isolation.level。在 consume-trnasform-produce 模式下使用事务时，必须设置为 READ_COMMITTED。

#### 8.4.2. 只有写

创建一个事务，在这个事务操作中，只有生成消息操作。代码如下：

```java
    /**
     * 在一个事务只有生产消息操作
     */
    public void onlyProduceInTransaction() {
        Producer producer = buildProducer();

        // 1.初始化事务
        producer.initTransactions();

        // 2.开启事务
        producer.beginTransaction();

        try {
            // 3.kafka写操作集合
            // 3.1 do业务逻辑

            // 3.2 发送消息
            producer.send(new ProducerRecord<String, String>("test", "transaction-data-1"));

            producer.send(new ProducerRecord<String, String>("test", "transaction-data-2"));
            // 3.3 do其他业务逻辑,还可以发送其他topic的消息。

            // 4.事务提交
            producer.commitTransaction();


        } catch (Exception e) {
            // 5.放弃事务
            producer.abortTransaction();
        }

    }
```

创建生产者，代码如下,需要:

- 配置 transactional.id 属性
- 配置 enable.idempotence 属性

```java
    /**
     * 需要:
     * 1、设置transactional.id
     * 2、设置enable.idempotence
     * @return
     */
    private Producer buildProducer() {

        // create instance for properties to access producer configs
        Properties props = new Properties();

        // bootstrap.servers是Kafka集群的IP地址。多个时,使用逗号隔开
        props.put("bootstrap.servers", "localhost:9092");

        // 设置事务id
        props.put("transactional.id", "first-transactional");

        // 设置幂等性
        props.put("enable.idempotence",true);

        //Set acknowledgements for producer requests.
        props.put("acks", "all");

        //If the request fails, the producer can automatically retry,
        props.put("retries", 1);

        //Specify buffer size in config,这里不进行设置这个属性,如果设置了,还需要执行producer.flush()来把缓存中消息发送出去
        //props.put("batch.size", 16384);

        //Reduce the no of requests less than 0
        props.put("linger.ms", 1);

        //The buffer.memory controls the total amount of memory available to the producer for buffering.
        props.put("buffer.memory", 33554432);

        // Kafka消息是以键值对的形式发送,需要设置key和value类型序列化器
        props.put("key.serializer",
                "org.apache.kafka.common.serialization.StringSerializer");

        props.put("value.serializer",
                "org.apache.kafka.common.serialization.StringSerializer");


        Producer<String, String> producer = new KafkaProducer<String, String>(props);

        return producer;
    }
```

#### 8.4.3. 消费-生产并存（consume-transform-produce）

在一个事务中，既有生产消息操作又有消费消息操作，即常说的 Consume-tansform-produce 模式。如下实例代码

```java
    /**
     * 在一个事务内,即有生产消息又有消费消息
     */
    public void consumeTransferProduce() {
        // 1.构建上产者
        Producer producer = buildProducer();
        // 2.初始化事务(生成productId),对于一个生产者,只能执行一次初始化事务操作
        producer.initTransactions();

        // 3.构建消费者和订阅主题
        Consumer consumer = buildConsumer();
        consumer.subscribe(Arrays.asList("test"));
        while (true) {
            // 4.开启事务
            producer.beginTransaction();

            // 5.1 接受消息
            ConsumerRecords<String, String> records = consumer.poll(500);

            try {
                // 5.2 do业务逻辑;
                System.out.println("customer Message---");
                Map<TopicPartition, OffsetAndMetadata> commits = Maps.newHashMap();
                for (ConsumerRecord<String, String> record : records) {
                    // 5.2.1 读取消息,并处理消息。print the offset,key and value for the consumer records.
                    System.out.printf("offset = %d, key = %s, value = %s\n",
                            record.offset(), record.key(), record.value());

                    // 5.2.2 记录提交的偏移量
                    commits.put(new TopicPartition(record.topic(), record.partition()),
                            new OffsetAndMetadata(record.offset()));


                    // 6.生产新的消息。比如外卖订单状态的消息,如果订单成功,则需要发送跟商家结转消息或者派送员的提成消息
                    producer.send(new ProducerRecord<String, String>("test", "data2"));
                }

                // 7.提交偏移量
                producer.sendOffsetsToTransaction(commits, "group0323");

                // 8.事务提交
                producer.commitTransaction();

            } catch (Exception e) {
                // 7.放弃事务
                producer.abortTransaction();
            }
        }
    }
```

创建消费者代码，需要：

- 将配置中的自动提交属性（auto.commit）进行关闭
- 而且在代码里面也不能使用手动提交 commitSync( )或者 commitAsync( )
- 设置 isolation.level

```java
    /**
     * 需要:
     * 1、关闭自动提交 enable.auto.commit
     * 2、isolation.level为
     * @return
     */
    public Consumer buildConsumer() {
        Properties props = new Properties();
        // bootstrap.servers是Kafka集群的IP地址。多个时,使用逗号隔开
        props.put("bootstrap.servers", "localhost:9092");
        // 消费者群组
        props.put("group.id", "group0323");
        // 设置隔离级别
        props.put("isolation.level","read_committed");
        // 关闭自动提交
        props.put("enable.auto.commit", "false");
        props.put("session.timeout.ms", "30000");
        props.put("key.deserializer",
                "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer",
                "org.apache.kafka.common.serialization.StringDeserializer");
        KafkaConsumer<String, String> consumer = new KafkaConsumer
                <String, String>(props);

        return consumer;
    }
```

#### 8.4.4. 只有读

创建一个事务，在这个事务操作中，只有生成消息操作，如下代码。这种操作其实没有什么意义，跟使用手动提交效果一样，无法保证消费消息操作和提交偏移量操作在一个事务。

```java
    /**
     * 在一个事务只有消息操作
     */
    public void onlyConsumeInTransaction() {
        Producer producer = buildProducer();

        // 1.初始化事务
        producer.initTransactions();

        // 2.开启事务
        producer.beginTransaction();

        // 3.kafka读消息的操作集合
        Consumer consumer = buildConsumer();
        while (true) {
            // 3.1 接受消息
            ConsumerRecords<String, String> records = consumer.poll(500);

            try {
                // 3.2 do业务逻辑;
                System.out.println("customer Message---");
                Map<TopicPartition, OffsetAndMetadata> commits = Maps.newHashMap();
                for (ConsumerRecord<String, String> record : records) {
                    // 3.2.1 处理消息 print the offset,key and value for the consumer records.
                    System.out.printf("offset = %d, key = %s, value = %s\n",
                            record.offset(), record.key(), record.value());

                    // 3.2.2 记录提交偏移量
                    commits.put(new TopicPartition(record.topic(), record.partition()),
                            new OffsetAndMetadata(record.offset()));
                }

                // 4.提交偏移量
                producer.sendOffsetsToTransaction(commits, "group0323");

                // 5.事务提交
                producer.commitTransaction();

            } catch (Exception e) {
                // 6.放弃事务
                producer.abortTransaction();
            }
        }

    }
```

### 8.5. 生产者事务的实现

#### 8.5.1. 相关配置

#### 8.5.2. 幂等性和事务性的关系

##### 两者关系

事务属性实现前提是幂等性，即在配置事务属性 transaction id 时，必须还得配置幂等性；但是幂等性是可以独立使用的，不需要依赖事务属性。

- 幂等性引入了 Porducer ID
- 事务属性引入了 Transaction Id 属性。、

设置

- enable.idempotence = true，transactional.id 不设置：只支持幂等性。
- enable.idempotence = true，transactional.id 设置：支持事务属性和幂等性
- enable.idempotence = false，transactional.id 不设置：没有事务属性和幂等性的 kafka
- enable.idempotence = false，transactional.id 设置：无法获取到 PID，此时会报错

##### tranaction id 、productid 和 epoch

**一个 app 有一个 tid，同一个应用的不同实例 PID 是一样的，只是 epoch 的值不同**。如：

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/3-1.png"/></div><br>

同一份代码运行两个实例，分步执行如下：_在实例 1 没有进行提交事务前，开始执行实例 2 的初始化事务_

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/4-1-1024x458.png"/></div><br>

**step1 实例 1-初始化事务**。的打印出对应 productId 和 epoch，信息如下：

[2018-04-21 20:56:23,106] INFO [TransactionCoordinator id=0] Initialized transactionalId first-transactional with producerId 8000 and producer epoch 123 on partition \_\_transaction_state-12 (kafka.coordinator.transaction.TransactionCoordinator)

**step2 实例 1-发送消息。**

**step3 实例 2-初始化事务**。初始化事务时的打印出对应 productId 和 epoch，信息如下：

18-04-21 20:56:48,373] INFO [TransactionCoordinator id=0] Initialized transactionalId first-transactional with producerId 8000 and producer epoch 124 on partition \_\_transaction_state-12 (kafka.coordinator.transaction.TransactionCoordinator)

**step4 实例 1-提交事务**，此时报错

org.apache.kafka.common.errors.ProducerFencedException: Producer attempted an operation with an old epoch. Either there is a newer producer with the same transactionalId, or the producer’s transaction has been expired by the broker.

**step5 实例 2-提交事务**

为了避免这种错误，同一个事务 ID，只有保证如下顺序 epch 小 producer 执行 init-transaction 和 committransaction，然后 epoch 较大的 procuder 才能开始执行 init-transaction 和 commit-transaction，如下顺序：

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/80061024.png"/></div><br>

有了 transactionId 后，Kafka 可保证：

- 跨 Session 的数据幂等发送。当具有相同 Transaction ID 的新的 Producer 实例被创建且工作时，旧的且拥有相同 Transaction ID 的 Producer 将不再工作【上面的实例可以验证】。kafka 保证了关联同一个事务的所有 producer（一个应用有多个实例）必须按照顺序初始化事务、和提交事务，否则就会有问题，这保证了同一事务 ID 中消息是有序的（不同实例得按顺序创建事务和提交事务）。

#### 8.5.3. 事务最佳实践-单实例的事务性

通过上面实例中可以看到 kafka 是跨 Session 的数据幂等发送，即如果应用部署多个实例时常会遇到上面的问题“_org.apache.kafka.common.errors.ProducerFencedException: Producer attempted an operation with an old epoch. Either there is a newer producer with the same transactionalId, or the producer’s transaction has been expired by the broker_.”，必须保证这些实例生产者的提交事务顺序和创建顺序保持一致才可以，否则就无法成功。其实，在实践中，我们更多的是**如何实现对应用单实例的事务性**。可以通过 spring-kafaka 实现思路来学习，即**每次创建生产者都设置一个不同的 transactionId 的值**，如下代码：

在 spring-kafka 中，对于一个线程创建一个 producer，事务提交之后，还会关闭这个 producer 并清除，后续同一个线程或者新的线程重新执行事务时，此时就会重新创建 producer。

```java
====================================
类名：ProducerFactoryUtils
====================================
/**
    * Obtain a Producer that is synchronized with the current transaction, if any.
    * @param producerFactory the ConnectionFactory to obtain a Channel for
    * @param <K> the key type.
    * @param <V> the value type.
    * @return the resource holder.
    */
public static <K, V> KafkaResourceHolder<K, V> getTransactionalResourceHolder(
        final ProducerFactory<K, V> producerFactory) {

    Assert.notNull(producerFactory, "ProducerFactory must not be null");

    // 1.对于每一个线程会生成一个唯一key，然后根据key去查找resourceHolder
    @SuppressWarnings("unchecked")
    KafkaResourceHolder<K, V> resourceHolder = (KafkaResourceHolder<K, V>) TransactionSynchronizationManager
            .getResource(producerFactory);
    if (resourceHolder == null) {
        // 2.创建一个消费者
        Producer<K, V> producer = producerFactory.createProducer();
        // 3.开启事务
        producer.beginTransaction();
        resourceHolder = new KafkaResourceHolder<K, V>(producer);
        bindResourceToTransaction(resourceHolder, producerFactory);
    }
    return resourceHolder;
}
```

创建消费者代码

```java
====================================
类名：DefaultKafkaProducerFactory
====================================
protected Producer<K, V> createTransactionalProducer() {
    Producer<K, V> producer = this.cache.poll();
    if (producer == null) {
        Map<String, Object> configs = new HashMap<>(this.configs);
        // 对于每一次生成producer时，都设置一个不同的transactionId
        configs.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG,
                this.transactionIdPrefix + this.transactionIdSuffix.getAndIncrement());
        producer = new KafkaProducer<K, V>(configs, this.keySerializer, this.valueSerializer);
        // 1.初始化话事务。
        producer.initTransactions();
        return new CloseSafeProducer<K, V>(producer, this.cache);
    }
    else {
        return producer;
    }
}
```

#### 8.5.4. Consume-transform-Produce 的流程

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/Snip20180504_56.png"/></div><br>

**流程 1** **：**查找 Tranaction Corordinator。

Producer 向任意一个 brokers 发送 FindCoordinatorRequest 请求来获取 Transaction Coordinator 的地址。

**流程 2：**初始化事务 initTransaction

Producer 发送 InitpidRequest 给事务协调器，获取一个 Pid**。InitpidRequest 的处理过程是同步阻塞的，一旦该调用正确返回，Producer 就可以开始新的事务**。TranactionalId 通过 InitpidRequest 发送给 Tranciton Corordinator，然后在 Tranaciton Log 中记录这<TranacionalId,pid>的映射关系。除了返回 PID 之外，还具有如下功能：

- 对 PID 对应的 epoch 进行递增，这样可以保证同一个 app 的不同实例对应的 PID 是一样的，但是 epoch 是不同的。
- 回滚之前的 Producer 未完成的事务（如果有）。

**流程 3：** 开始事务 beginTransaction

执行 Producer 的 beginTransacion()，它的作用是 Producer 在本地记录下这个 transaction 的状态为开始状态。

注意：这个操作并没有通知 Transaction Coordinator。

**流程 4：** Consume-transform-produce loop

**流程 4.0：** 通过 Consumtor 消费消息，处理业务逻辑

**流程 4.1：** producer 向 TransactionCordinantro 发送 AddPartitionsToTxnRequest

在 producer 执行 send 操作时，如果是第一次给<topic,partion>发送数据，此时会向 Trasaction Corrdinator 发送一个 AddPartitionsToTxnRequest 请求，Transaction Corrdinator 会在 transaction log 中记录下 tranasactionId 和<topic,partion>一个映射关系，并将状态改为 begin。AddPartionsToTxnRequest 的数据结构如下：

```
AddPartitionsToTxnRequest => TransactionalId PID Epoch [Topic [Partition]]
 TransactionalId => string
 PID => int64
 Epoch => int16
 Topic => string
 Partition => int32
```

**流程 4.2：** producer#send 发送 ProduceRequst

生产者发送数据，虽然没有还没有执行 commit 或者 absrot，但是此时消息已经保存到 kafka 上，可以参考如下图断点位置处，此时已经可以查看到消息了，而且即使后面执行 abort，消息也不会删除，只是更改状态字段标识消息为 abort 状态。

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/62059279-1024x437.png"/></div><br>

**流程 4.3：** AddOffsetCommitsToTxnRequest

Producer 通过 KafkaProducer.sendOffsetsToTransaction 向事务协调器器发送一个 AddOffesetCommitsToTxnRequests：

```
AddOffsetsToTxnRequest => TransactionalId PID Epoch ConsumerGroupID
 TransactionalId => string
 PID => int64
 Epoch => int16
 ConsumerGroupID => string
```

在执行事务提交时，可以根据 ConsumerGroupID 来推断\_customer_offsets 主题中相应的 TopicPartions 信息。这样在

**流程 4.4:** TxnOffsetCommitRequest

Producer 通过 KafkaProducer.sendOffsetsToTransaction 还会向消费者协调器 Cosumer Corrdinator 发送一个 TxnOffsetCommitRequest，在主题\_consumer_offsets 中保存消费者的偏移量信息。

```
TxnOffsetCommitRequest   => ConsumerGroupID
                            PID
                            Epoch
                            RetentionTime
                            OffsetAndMetadata
  ConsumerGroupID => string
  PID => int64
  Epoch => int32
  RetentionTime => int64
  OffsetAndMetadata => [TopicName [Partition Offset Metadata]]
    TopicName => string
    Partition => int32
    Offset => int64
    Metadata => string
```

**流程 5：** 事务提交和事务终结(放弃事务)

通过生产者的 commitTransaction 或 abortTransaction 方法来提交事务和终结事务，这两个操作都会发送一个 EndTxnRequest 给 Transaction Coordinator。

**流程 5.1**：EndTxnRequest。Producer 发送一个 EndTxnRequest 给 Transaction Coordinator，然后执行如下操作：

- Transaction Coordinator 会把 PREPARE_COMMIT or PREPARE_ABORT 消息写入到 transaction log 中记录
- 执行流程 5.2
- 执行流程 5.3

**流程 5.2**：WriteTxnMarkerRequest

```
WriteTxnMarkersRequest => [CoorinadorEpoch PID Epoch Marker [Topic [Partition]]]
 CoordinatorEpoch => int32
 PID => int64
 Epoch => int16
 Marker => boolean (false(0) means ABORT, true(1) means COMMIT)
 Topic => string
 Partition => int32
```

- 对于 Producer 生产的消息。Tranaction Coordinator 会发送 WriteTxnMarkerRequest 给当前事务涉及到每个<topic,partion>的 leader，leader 收到请求后，会写入一个 COMMIT(PID) 或者 ABORT(PID)的控制信息到 data log 中
- 对于消费者偏移量信息，如果在这个事务里面包含\_consumer-offsets 主题。Tranaction Coordinator 会发送 WriteTxnMarkerRequest 给 Transaction Coordinartor，Transaction Coordinartor 收到请求后，会写入一个 COMMIT(PID) 或者 ABORT(PID)的控制信息到 data log 中。

**流程 5.3：**Transaction Coordinator 会将最终的 COMPLETE_COMMIT 或 COMPLETE_ABORT 消息写入 Transaction Log 中以标明该事务结束。

- 只会保留这个事务对应的 PID 和 timstamp。然后把当前事务其他相关消息删除掉，包括 PID 和 tranactionId 的映射关系。

##### 文件类型和查看命令

kafka 文件主要包括 broker 的 data（主题：test）、事务协调器对应的 transaction_log（主题：\_\_tranaction_state）、偏移量信息（主题:\_consumer_offsets）三种类型。如下图

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/1-2-207x300.png"/></div><br>

这三种文件类型其实都是 topic 的分区，所以对于每一个目录都包含*.log、*.index、_.timeindex、_.txnindex 文件（仅这个文件是为了实现事务属性引入的）。segment 和 segmengt 对应 index、timeindex、txnindex 文件命名中序号表示的是第几个消息。如下图中，00000000000000368769.index 和 00000000000000568769.log 中“368969”就是表示文件中存储的第一个消息是 468969 个消息。

对于索引文案包含两部分：

- baseOffset：索引对应 segment 文件中的第几条 message。
- position：在 segment 中的绝对位置。

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/67930538-300x179.png"/></div><br>

查看文件内容：

bin/kafka-run-class.sh kafka.tools.DumpLogSegments –files /Users/wuzhonghu/data/kafka-logs/firtstopic-0/00000000000000000002.log –print-data-log

##### ControlMessage 和 Transaction markers

Trasaction markers 就是 kafka 为了实现事务定义的 Controll Message。这个消息和数据消息都存放在 log 中，在 Consumer 读取事务消息时有用，可以参考下面章节-4.5.1 老版本-读取事务消息顺序。

##### Transaction Coordinator 和 Transaction Log

Transaction Log 如下放置在“\_tranaction_state”主题下面，默认是 50 个分区，每一个分区中文件格式和 broker 存储消息是一样的,都有 log/index/timeindex 文件，如下：

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/57646045.png"/></div><br>

#### 8.5.5. 消费读取事务消息(READ_COMMITED)

Consumer 为了实现事务，新增了一个 isolation.level 配置，有两个值如下，

- READ_UNCOMMITTED，类似于没有事务属性的消费者。
- READ_COMMITED，只获取执行了事务提交的消息。

在本小节中我们主要讲 READ_COMMITED 模式下读取消息的流程的两种版本的演化

##### 老版本-读取事务消息顺序

如下图中，按顺序保存到 broker 中消息有：事务 1 消息 T1-M1、对于事务 2 的消息有 T2-M1、事务 1 消息 T1-M2、非事务消息 M1，最终到达 client 端的循序是 M1-> T2-M1 -> T1-M1 -> T1-M2。

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/84999567.png"/></div><br>

具体步骤如下：

- **step1** Consumer 接受到事务消息 T1-M1、T2-M2、T1-M2 和非事务消息 M1，因为没有收到事务 T1 和 T2 的控制消息，所以此时把事务相关消息 T1-M1、T2-M2、T1-M2 保存到内存，然后只把非事务消息 M1 返回给 client。
- **step2** Consumer 接受到事务 2 的控制消息 T2-C，此时就把事务消息 T2-M1 发送给 Clinet。
- **step3** C onsumer 接受到事务 1 的控制消息 T1-C,此时就把事务消息 T1-M1 和 T1-M2 发送给 Client

##### 新版本-读取事务消息顺序

第一种方式，需要在 consumer 客户端缓存消息，当存在耗时比较长的事务时，占用客户端大量的内存资源。为了解决这个问题，通过 LSO 和 Abort Index 文件来解决这个问题，参考：

<https://docs.google.com/document/d/1Rlqizmk7QCDe8qAnVW5e5X8rGvn6m2DCR3JR2yqwVjc/edit>

（1） LSO，Last stable offset。Broker 在缓存中维护了所有处于运行状态的事务对应的 initial offsets,LSO 的值就是这些 offsets 中最小值-1。这样在 LSO 之前数据都是已经 commit 或者 abort 的数据，只有这些数据才对 Consumer 可见，即 consumer 读取数据只能读取到 LSO 的位置。

- LSO 并没有持久化某一个位置，而是实时计算出来的，并保存在缓存中。

（2）Absort Index 文件

Conusmer 发送 FetchRequest 中，新增了 Isolation 字段，表示是那种模式

```
ReplicaId MaxWaitTime MinBytes [TopicName [Partition FetchOffset MaxBytes]]

  ReplicaId => int32
  MaxWaitTime => int32
  MinBytes => int32
  TopicName => string
  Partition => int32
  FetchOffset => int64
  MaxBytes => int32
  Isolation => READ_COMMITTED | READ_UNCOMMITTED
```

返回数据类型为 FetchResponse 的格式为：

ThrottleTime [TopicName [Partition ErrorCode HighwaterMarkOffset AbortedTransactions MessageSetSize MessageSet]]

对应各个给字段类型为

```
 ThrottleTime => int32
  TopicName => string
  Partition => int32
  ErrorCode => int16
  HighwaterMarkOffset => int64
  AbortedTransactions => [PID FirstOffset]
    PID => int64
    FirstOffset => int64
  MessageSetSize => int32
```

- 设置成 READ_UNCOMMITTED 模式时, the AbortedTransactions array is null.
- 设置为 READ_COMMITTED 时，the Last Stable Offset(LSO)，当事务提交之后，LSO 向前移动 offset

数据如下：

- 存放数据的 log

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/1-3.png"/></div><br>

- 存放 Absort Index 的内容如下：

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/3-2.png"/></div><br>

执行读取数据流程如下：

**step1:** 假设 consumer 读取数据的 fetched offsets 的区间是 0 到 4。

- 首先，broker 读取 data log 中数据

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/11-1.png"/></div><br>

- 然后，broker 依次读取 abort index 的内容，发现 LSO 大于等于 4 就停止。如上可以获取到 P2 对应的 offset 从 2 到 5 的消息都是被丢弃的：

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/12-1.png"/></div><br>

- 最后，broker 将上面 data log 和 abort index 中满足条件的数据返回给 consumer。

**step2 ：**在 consumer 端根据 absrot index 中返回的内容，过滤丢弃的消息，最终给用户消息为

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/13-300x103.png"/></div><br>

##### Absorted Transaction Index

在 broker 中数据中新增一个索引文件，保存 aborted tranasation 对应的 offsets，只有事务执行 abort 时，才会往这个文件新增一个记录，初始这个文件是不存在的，只有第一条 abort 时，才会创建这个文件。

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/2-1-300x149.png"/></div><br>

这个索引文件结构的每一行结构是 TransactionEntry：

```
Version => int16
 PID => int64
 FirstOffset => int64
 LastOffset => int64
 LastStableOffset => int64
```

当 broker 接受到控制消息（producer 执行 commitTransaction()或者 abortTransaction()）时, 执行如下操作:

(1)计算 LSO。

Broker 在缓存中维护了所有处于运行状态的事务对应的 initial offsets,LSO 的值就是这些 offsets 中最小值-1。

举例说明下 LSO 的计算，对于一个 data log 中内如如下

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/31.png"/></div><br>

对应的 abort index 文件中内如如下：**LSO 是递增的**

<br><div align="center"><img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/32.png"/></div><br>

(2)第二步 如果事务是提交状态，则在索引文件中新增 TransactionEntry。

(3)第三步 从 active 的 tranaction set 中移除这个 transaton，然后更新 LSO。

##### 问题

1、问题 1：producer 通过事务提交消息时抛异常了， 对于使用非事务的消费者，是否可以获取此消息？

对于事务消息，必须是执行 commit 或者 abstort 之后，消息才对消费者可见，即使是非事务的消费者。只是非事务消费者相比事务消费者区别，在于可以读取执行了 absort 的消息。

### 8.6. 其他思考

1、如何保证消息不丢。

（1）在消费端可以建立一个日志表，和业务处理在一个事务

定时扫描没有表发送没有被处理的消息

（2）消费端，消费消息之后，修改消息表的中消息状态为已处理成功。

2、如何保证消息提交和业务处理在同一个事务内完成

在消费端可以建立一个日志表，和业务处理在一个事务

3、消费者角度，如何保证消息不被重复消费。

（1）通过 seek 操作

（2）通过 kafka 事务操作。

4、生产者角度，如何保证消息不重复生产

（1）kakfka 幂等性

## 9. 资料

### 9.1. 官方资料

[Github](https://github.com/apache/kafka) | [官方文档](https://kafka.apache.org/documentation/)

### 9.2. 第三方资料

- [Kafka Manager](https://github.com/yahoo/kafka-manager) - Kafka 管理工具
- [Kafka 剖析（一）：Kafka 背景及架构介绍](http://www.infoq.com/cn/articles/kafka-analysis-part-1)
- [Thorough Introduction to Apache Kafka](https://hackernoon.com/thorough-introduction-to-apache-kafka-6fbf2989bbc1)
- [Kafak(04) Kafka 生产者事务和幂等](http://www.heartthinkdo.com/?p=2040#43)
