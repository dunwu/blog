---
icon: logos:kafka-icon
title: Kafka 面试
cover: https://raw.githubusercontent.com/dunwu/images/master/cs/java/javaweb/distributed/mq/kafka/kafka-event-system.png
date: 2025-02-03 11:15:43
categories:
  - 分布式
  - 分布式通信
  - MQ
  - Kafka
tags:
  - Java
  - 中间件
  - mq
  - kafka
  - 面试
permalink: /pages/404a13d7/
---

# Kafka 面试

## Kafka 简介

### 【简单】Kafka 是什么？

**Apache Kafka 是一款开源的消息引擎系统，也是一个分布式流计算平台，此外，还可以作为数据存储**。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070719480.gif)

### 【简单】Kafka 有哪些应用场景？

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202505111027731.webp)

- **消息队列**：用作高吞吐量的消息系统，将消息从一个系统传递到另一个系统
- **日志收集**：集中收集日志数据，然后通过 Kafka 传递到实时监控系统或存储系统
- **流计算**：处理实时数据流，将数据传递给实时计算系统，如 Apache Storm 或 Apache Flink
- **指标收集和监控**：收集来自不同服务的监控指标，统一存储和处理
- **事件溯源**：记录事件发生的历史，以便稍后进行数据回溯或重新处理

### 【简单】Kafka 有哪些核心术语？

Kafka 的核心术语如下：

- **消息** - Record。Kafka 是消息引擎嘛，这里的消息就是指 Kafka 处理的主要对象。
- **主题** - Topic。主题是承载消息的逻辑容器，在实际使用中多用来区分具体的业务。
- **分区** - Partition。一个有序不变的消息序列。每个主题下可以有多个分区。
- **消息位移** - Offset。表示分区中每条消息的位置信息，是一个单调递增且不变的值。
- **副本** - Replica。Kafka 中同一条消息能够被拷贝到多个地方以提供数据冗余，这些地方就是所谓的副本。副本还分为领导者副本和追随者副本，各自有不同的角色划分。副本是在分区层级下的，即每个分区可配置多个副本实现高可用。
- **生产者** - Producer。向主题发布新消息的应用程序。
- **消费者** - Consumer。从主题订阅新消息的应用程序。
- **消费者位移** - Consumer Offset。表征消费者消费进度，每个消费者都有自己的消费者位移。
- **消费者组** - Consumer Group。多个消费者实例共同组成的一个组，同时消费多个分区以实现高吞吐。
- **分区再均衡** - Rebalance。消费者组内某个消费者实例挂掉后，其他消费者实例自动重新分配订阅主题分区的过程。Rebalance 是 Kafka 消费者端实现高可用的重要手段。

## Kafka 存储

### 【中等】Kafka 是如何存储数据的？

::: tip 关键点

- **逻辑存储**：Topic -> Partition -> Record
- **物理存储**：Log（对应 Partition） -> LogSegment（`<offset>.log`、.`<offset>.index`、`<offset>.timeindex`、`<offset>.txnindex`）

:::

#### Kafka 逻辑存储

Kafka 的数据结构采用三级结构，即：主题（Topic）、分区（Partition）、消息（Record）。

Kafka 的三层消息架构：

- 第一层是主题层，每个主题可以配置 M 个分区，而每个分区又可以配置 N 个副本。
- 第二层是分区层，每个分区的 N 个副本中只能有一个充当领导者角色，对外提供服务；其他 N-1 个副本是追随者副本，只是提供数据冗余之用。
- 第三层是消息层，分区中包含若干条消息，每条消息的位移从 0 开始，依次递增。
- 最后，客户端程序只能与分区的领导者副本进行交互。

在 Kafka 中，任意一个 Topic 维护了一组 Partition 日志，如下所示：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070720162.png)

请注意：这里的主题只是一个逻辑上的抽象概念，实际上，**Kafka 的基本存储单元是 Partition**。Partition 无法在多个 Broker 间进行再细分，也无法在同一个 Broker 的多个磁盘上进行再细分。所以，分区的大小受到单个挂载点可用空间的限制。

Partiton 命名规则为 Topic 名称 + 有序序号，第一个 Partiton 序号从 0 开始，序号最大值为 Partition 数量减 1。

#### Kafka 物理存储

`Log` 是 Kafka 用于表示日志文件的组件。每个 Partiton 对应一个 `Log` 对象，在物理磁盘上则对应一个目录。如：创建一个双分区的主题 `test`，那么，Kafka 会在磁盘上创建两个子目录：`test-0` 和 `test-1`；而在服务器端，这就对应两个 `Log` 对象。

因为在一个大文件中查找和删除消息是非常耗时且容易出错的。所以，Kafka 将每个 Partition 切割成若干个片段，即日志段（Log Segment）。**默认每个 Segment 大小不超过 1G，且只包含 7 天的数据**。如果 Segment 的消息量达到 1G，那么该 Segment 会关闭，同时打开一个新的 Segment 进行写入。

Broker 会为 Partition 里的每个 Segment 打开一个文件句柄（包括不活跃的 Segment），因此打开的文件句柄数通常会比较多，这个需要适度调整系统的进程文件句柄参数。**正在写入的分片称为活跃片段（active segment），活跃片段永远不会被删除**。

Segment 文件命名规则：Partition 全局的第一个 segment 从 0 开始，后续每个 segment 文件名为上一个 segment 文件最后一条消息的 offset 值。数值最大为 64 位 long 大小，19 位数字字符长度，没有数字用 0 填充。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070721654.png)

Segment 文件可以分为两类：

- 索引文件
  - 偏移量索引文件（ `.index` ）
  - 时间戳索引文件（ `.timeindex` ）
  - 已终止事务的索引文件（`.txnindex`）：如果没有使用 Kafka 事务，则不会创建该文件
- 日志数据文件（`.log`）

### 【困难】Kafka 如何检索数据？

- **动态消费起点**
  - 支持从任意有效偏移量开始消费
- **稀疏索引设计**
  - 索引文件（`.index`）存储 offset→position 映射
  - 采用**间隔存储**（可配置`index.interval.bytes`）
  - 每个条目包含：
    - 消息偏移量（offset）
    - 物理位置（position）
- **索引自愈能力**
  - 索引无校验和，损坏后自动重建
  - 删除索引文件安全（Kafka 自动重新生成）
- **文件对应关系**
  - 每个日志分段（Segment）对应：
  - 数据文件（`.log`）
  - 索引文件（`.index`）
  - 按起始偏移量命名（如 `00000000000000368769.index`）

下面是 Kafka 中分段的日志数据文件和偏移量索引文件的对应映射关系图（其中也说明了如何按照起始偏移量来定位到日志数据文件中的具体消息）。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070722556.png)

### 【困难】Kafka 如何清理数据？

**日志分段结构**

- **干净段**：这部分消息之前已经被清理过，每个键只存在一个值。
- **污浊段**：在上一次清理后写入的新消息。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200621135557.png)

如果 Kafka 启用了清理功能（通过 `log.cleaner.enabled` 配置），每个 Broker 启动清理管理线程 + N 个清理线程（按分区分配）

对于一个段，清理前后的效果如下：

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200621140117.png)

Apache Kafka 清理数据主要通过 **日志保留策略（Log Retention）** 和 **压缩策略（Compaction）** 实现，以下是核心要点概括：

**基于时间的清理**

- **配置参数**：`log.retention.hours`（默认 168 小时/7 天）、`log.retention.minutes`、`log.retention.ms`。
- **机制**：删除超过指定时间的旧日志段（log segments）。
- **触发条件**：由 broker 后台线程定期扫描（默认 5 分钟检查一次，通过`log.retention.check.interval.ms`调整）。

**基于大小的清理**

- **配置参数**：`log.retention.bytes`（整个分区的最大字节数）、`log.segment.bytes`（单个日志段大小，默认 1GB）。
- **机制**：当分区总大小超过限制时，删除最旧的日志段。

**日志压缩**

- **适用场景**：保留每个 key 的最新值（适用于 key-value 数据，如数据库变更日志）。
- **配置参数**：
  - `cleanup.policy=compact`（启用压缩）。
  - `min.cleanable.dirty.ratio`（控制压缩触发时机，默认 0.5）。
- **机制**：
  1. 保留每个 key 的最后一条有效记录，删除旧版本。
  2. 周期性合并日志段（由`log.cleaner`线程执行）。

**手动清理**

- **删除 Topic**：`kafka-topics.sh --delete --topic <topic_name>`（需配置`delete.topic.enable=true`）。
- **删除数据文件**：直接删除日志目录（`log.dirs`）中的分区文件（需谨慎，可能导致数据不一致）。

**关键注意事项**

- **清理延迟**：实际清理可能因检查间隔或资源竞争延迟。
- **磁盘空间监控**：依赖清理可能不足，需监控磁盘使用率。
- **压缩与保留策略冲突**：若同时设置`cleanup.policy=compact,delete`，压缩优先于时间/大小删除。
- **消费者偏移量影响**：删除旧数据可能导致消费者无法回溯（需调整`offsets.retention.minutes`）。

## 生产者和消费者

### 【中等】Kafka 发送消息的工作流程是怎样的？

::: tip 关键点

1. **序列化**
2. **选择分区**
3. **暂存缓冲区**
4. **批次传输**

:::

Kafka 生产者用一个 `ProducerRecord` 对象来抽象一条要发送的消息， `ProducerRecord` 对象需要包含目标主题和要发送的内容，还可以指定键或分区。其发送消息流程如下：

（1）**序列化** - 生产者要先把键和值序列化成字节数组，这样它们才能够在网络中传输。

（2）**分区** - 数据被传给分区器。如果在 `ProducerRecord` 中已经指定了分区，那么分区器什么也不会做；否则，分区器会根据 `ProducerRecord` 的键来选择一个分区。选定分区后，生产者就知道该把消息发送给哪个主题的哪个分区。

（3）**批次传输** - 接着，这条记录会被添加到一个记录批次中。这个批次中的所有消息都会被发送到相同的主题和分区上。有一个独立的线程负责将这些记录批次发送到相应 Broker 上。

- **批次，就是一组消息，这些消息属于同一个主题和分区**。
- 发送时，会把消息分成批次传输，如果每次只发送一个消息，会占用大量的网路开销。

（4）**响应** - 服务器收到消息会返回一个响应。

- 如果**成功**，则返回一个 `RecordMetaData` 对象，它包含了主题、分区、偏移量；
- 如果**失败**，则返回一个错误。生产者在收到错误后，可以进行重试，重试次数可以在配置中指定。失败一定次数后，就返回错误消息。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200528224323.png)

生产者向 Broker 发送消息时是怎么确定向哪一个 Broker 发送消息？

- 生产者会向任意 broker 发送一个元数据请求（`MetadataRequest`），获取到每一个分区对应的 Leader 信息，并缓存到本地。
- 生产者在发送消息时，会指定 Partition 或者通过 key 得到到一个 Partition，然后根据 Partition 从缓存中获取相应的 Leader 信息。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200621113043.png)

### 【简单】Kafka 为什么要支持消费者群组？

::: tip 关键点

- 消费者群组，以组为维度订阅 Topic，并分摊分区，以均衡负载。
- 一个分区只能分配给消费者群组中的一个实例。
- 消费者数量发生变化，或主题分区数发生变化时，会触发分区再均衡。

:::

#### 消费者

每个 Consumer 的唯一元数据是该 Consumer 在日志中消费的位置。这个偏移量是由 Consumer 控制的：Consumer 通常会在读取记录时线性的增加其偏移量。但实际上，由于位置由 Consumer 控制，所以 Consumer 可以采用任何顺序来消费记录。

**一条消息只有被提交，才会被消费者获取到**。如下图，只能消费 Message0、Message1、Message2：

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200621113917.png)

#### 消费者群组

**Consumer Group 是 Kafka 提供的可扩展且具有容错性的消费者机制**。

Kafka 的写入数据量很庞大，如果只有一个消费者，消费消息速度很慢，时间长了，就会造成数据积压。为了减少数据积压，Kafka 支持消费者群组，可以让多个消费者并发消费消息，对数据进行分流。

Kafka 消费者从属于消费者群组，**一个群组里的 Consumer 订阅同一个 Topic，一个主题有多个 Partition，每一个 Partition 只能隶属于消费者群组中的一个 Consumer**。

如果超过主题的分区数量，那么有一部分消费者就会被闲置，不会接收到任何消息。

同一时刻，**一条消息只能被同一消费者组中的一个消费者实例消费**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070722981.png)

**不同消费者群组之间互不影响**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070723165.png)

### 【中等】如何消费 Kafka 消息？

::: tip 关键点

- 消费者群组订阅 Topic
- 消费者轮批次拉取消息
- 处理完消息后，提交偏移量（Offset）

:::

Kafka 消费者通过 `pull` 模式来获取消息，但是获取消息时并不是立刻返回结果，需要考虑两个因素：

- 消费者通过 `customer.poll(time)` 中设置等待时间
- Broker 会等待累计一定量数据，然后发送给消费者。这样可以减少网络开销。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070724283.png)

`pull` 除了获取消息外，还有其他作用：

- **发送心跳信息**。消费者通过向被指派为群组协调器的 Broker 发送心跳来维护他和群组的从属关系，当机器宕掉后，群组协调器触发再均衡。

## 集群

### 【中等】什么是分区？为什么要分区？

::: tip 关键点

**分区的作用就是提供负载均衡的能力**，以实现系统的高伸缩性（Scalability）。

:::

Kafka 的数据结构采用三级结构，即：主题（Topic）、分区（Partition）、消息（Record）。

在 Kafka 中，任意一个 Topic 维护了一组 Partition 日志，如下所示：

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javaweb/distributed/mq/kafka/kafka-log-anatomy.png)

每个 Partition 都是一个单调递增的、不可变的日志记录，以不断追加的方式写入数据。Partition 中的每条记录会被分配一个单调递增的 id 号，称为偏移量（Offset），用于唯一标识 Partition 内的每条记录。

为什么 Kafka 的数据结构采用三级结构？

**分区的作用就是提供负载均衡的能力**，以实现系统的高伸缩性（Scalability）。

不同的分区能够被放置到不同节点的机器上，而数据的读写操作也都是针对分区这个粒度而进行的，这样每个节点的机器都能独立地执行各自分区的读写请求处理。并且，我们还可以通过添加新的机器节点来增加整体系统的吞吐量。

### 【中等】Kafka 的分区策略是怎样的？

::: tip 关键点

发送消息，未指定 key 时，选择分区采用**轮询**方式；指定 key 时，选择分区采用**哈希**方式，固定发往同一分区

:::

所谓分区策略是决定生产者将消息发送到哪个分区的算法，也就是负载均衡算法。

Kafka 生产者发送消息使用的对象 `ProducerRecord` ，可以选填 Partition 和 Key。不过，大多数应用会用到 key。key 有两个作用：作为消息的附加信息；也可以用来决定消息该被写到 Topic 的哪个 Partition，拥有相同 key 的消息将被写入同一个 Partition。

**如果 `ProducerRecord` 指定了 Partition，则分区器什么也不做**，否则分区器会根据 key 选择一个 Partition 。

- 没有 key 时的分发逻辑：每隔 `topic.metadata.refresh.interval.ms` 的时间，轮询选择一个 partition。这个时间窗口内的所有记录发送到这个 partition。发送数据出错后会重新选择一个 partition。
- 根据 key 分发：Kafka 的选择分区策略是：根据 key 求 hash 值，然后将 hash 值对 partition 数量求模。这里的关键点在于，**同一个 key 总是被映射到同一个 Partition 上**。所以，在选择分区时，Kafka 会使用 Topic 的所有 Partition ，而不仅仅是可用的 Partition。这意味着，**如果写入数据的 Partition 是不可用的，那么就会出错**。

### 【中等】如何自定义分区策略？

如果 Kafka 的默认分区策略无法满足实际需要，可以自定义分区策略。需要显式地配置生产者端的参数 `partitioner.class`。这个参数该怎么设定呢？

首先，要实现 `org.apache.kafka.clients.producer.Partitioner` 接口。这个接口定义了两个方法：`partition` 和 `close`，通常只需要实现最重要的 `partition` 方法。我们来看看这个方法的方法签名：

```java
int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster);
```

这里的 `topic`、`key`、`keyBytes`、`value`和 `valueBytes` 都属于消息数据，`cluster` 则是集群信息（比如当前 Kafka 集群共有多少主题、多少 Broker 等）。Kafka 给你这么多信息，就是希望让你能够充分地利用这些信息对消息进行分区，计算出它要被发送到哪个分区中。

接着，设置 `partitioner.class` 参数为自定义类的全限定名，那么生产者程序就会按照你的代码逻辑对消息进行分区。

负载均衡算法常见的有：

- 随机算法
- 轮询算法
- 最小活跃数算法
- 源地址哈希算法

可以根据实际需要去实现。

### 【困难】Kafka 如何实现分区再均衡？

#### 什么是分区再均衡

分区的所有权从一个消费者转移到另一个消费者，这样的行为被称为**分区再均衡（Rebalance）**。**Rebalance 实现了消费者群组的高可用性和伸缩性**。

**Rebalance 本质上是一种协议，规定了一个 Consumer Group 下的所有 Consumer 如何达成一致，来分配订阅 Topic 的每个分区**。比如某个 Group 下有 20 个 Consumer 实例，它订阅了一个具有 100 个分区的 Topic。正常情况下，Kafka 平均会为每个 Consumer 分配 5 个分区。这个分配的过程就叫 Rebalance。

当在群组里面新增/移除消费者或者新增/移除 kafka 集群 broker 节点时，群组协调器 Broker 会触发再均衡，重新为每一个 Partition 分配消费者。**Rebalance 期间，消费者无法读取消息，造成整个消费者群组一小段时间的不可用。**

#### 何时生分区再均衡

分区再均衡的触发时机有三种：

- **消费者群组成员数发生变更**。比如有新的 Consumer 加入群组或者离开群组，或者是有 Consumer 实例崩溃被“踢出”群组。
  - 新增消费者。consumer 订阅主题之后，第一次执行 poll 方法
  - 移除消费者。执行 `consumer.close()` 操作或者消费客户端宕机，就不再通过 poll 向群组协调器发送心跳了，当群组协调器检测次消费者没有心跳，就会触发再均衡。
- **订阅主题数发生变更**。Consumer Group 可以使用正则表达式的方式订阅主题，比如 `consumer.subscribe(Pattern.compile(“t.*c”))` 就表明该 Group 订阅所有以字母 t 开头、字母 c 结尾的主题。在 Consumer Group 的运行过程中，你新创建了一个满足这样条件的主题，那么该 Group 就会发生 Rebalance。
- **订阅主题的分区数发生变更**。Kafka 当前只能允许增加一个主题的分区数。当分区数增加时，就会触发订阅该主题的所有 Group 开启 Rebalance。
  - 新增 broker。如重启 broker 节点
  - 移除 broker。如 kill 掉 broker 节点。

#### 分区再均衡的过程

**Rebalance 是通过消费者群组中的称为“群主”消费者客户端进行的**。

（1）选择群主

当消费者要加入群组时，会向群组协调器发送一个 JoinGroup 请求。第一个加入群组的消费者将成为“群主”。**群主从协调器那里获取群组的活跃成员列表，并负责给每一个消费者分配分区**。

> 所谓协调者，在 Kafka 中对应的术语是 Coordinator，它专门为 Consumer Group 服务，负责为 Group 执行 Rebalance 以及提供位移管理和组成员管理等。具体来讲，Consumer 端应用程序在提交位移时，其实是向 Coordinator 所在的 Broker 提交位移。同样地，当 Consumer 应用启动时，也是向 Coordinator 所在的 Broker 发送各种请求，然后由 Coordinator 负责执行消费者组的注册、成员管理记录等元数据管理操作。

（2）消费者通过向被指派为群组协调器（Coordinator）的 Broker 定期发送心跳来维持它们和群组的从属关系以及它们对分区的所有权。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070723810.png)

（3）群主从群组协调器获取群组成员列表，然后给每一个消费者进行分配分区 Partition。有两种分配策略：Range 和 RoundRobin。

- **Range 策略**，就是把若干个连续的分区分配给消费者，如存在分区 1-5，假设有 3 个消费者，则消费者 1 负责分区 1-2, 消费者 2 负责分区 3-4，消费者 3 负责分区 5。
- **RoundRoin 策略**，就是把所有分区逐个分给消费者，如存在分区 1-5，假设有 3 个消费者，则分区 1->消费 1，分区 2->消费者 2，分区 3>消费者 3，分区 4>消费者 1，分区 5->消费者 2。

（4）群主分配完成之后，把分配情况发送给群组协调器。

（5）群组协调器再把这些信息发送给消费者。**每个消费者只能看到自己的分配信息，只有群主知道所有消费者的分配信息**。

#### 如何判定消费者已经死亡

消费者通过向被指定为群组协调器的 Broker 发送心跳来维持它们和群组的从属关系以及它们对分区的所有权关系。只要消费者以正常的时间间隔发送心跳，就被认为是活跃的。消费者会在轮询消息或提交偏移量时发送心跳。如果消费者超时未发送心跳，会话就会过期，群组协调器认定它已经死亡，就会触发一次再均衡。

当一个消费者要离开群组时，会通知协调器，协调器会立即触发一次再均衡，尽量降低处理停顿。

#### 查找协调者

所有 Broker 在启动时，都会创建和开启相应的 Coordinator 组件。也就是说，**所有 Broker 都有各自的 Coordinator 组件**。那么，Consumer Group 如何确定为它服务的 Coordinator 在哪台 Broker 上呢？答案就在我们之前说过的 Kafka 内部位移主题 `__consumer_offsets` 身上。

目前，Kafka 为某个 Consumer Group 确定 Coordinator 所在的 Broker 的算法有 2 个步骤。

1. 第 1 步：确定由位移主题的哪个分区来保存该 Group 数据：`partitionId=Math.abs(groupId.hashCode() % offsetsTopicPartitionCount)`。

2. 第 2 步：找出该分区 Leader 副本所在的 Broker，该 Broker 即为对应的 Coordinator。

### 【困难】分区再均衡存在什么问题？如何避免分区再均衡？

#### 分区再均衡的问题

- 首先，Rebalance 过程对 Consumer Group 消费过程有极大的影响。在 Rebalance 过程中，所有 Consumer 实例都会停止消费，等待 Rebalance 完成。
- 其次，目前 Rebalance 的设计是所有 Consumer 实例共同参与，全部重新分配所有分区。其实更高效的做法是尽量减少分配方案的变动。
- 最后，Rebalance 实在是太慢了。

#### 避免分区再均衡

通过前文，我们已经知道了：分区再均衡的代价很高，应该尽量避免不必要的分区再均衡，以整体提高 Consumer 的吞吐量。

分区再均衡发生的时机有三个：

- **消费群组成员数量发生变化**
- **订阅主题数量发生变化**
- **订阅主题的分区数发生变化**

后面两个通常都是运维的主动操作，所以它们引发的 Rebalance 大都是不可避免的。实际上，大部分情况下，导致分区再均衡的原因是：消费群组成员数量发生变化。

有两种情况，消费者并没有宕机，但也被视为消亡：

- 未及时发送心跳
- Consumer 消费时间过长

##### 未及时发送心跳

**第一类非必要 Rebalance 是因为未能及时发送心跳**，导致 Consumer 被“踢出”Group 而引发的。因此，**需要合理设置会话超时时间**。这里给出一些推荐数值，你可以“无脑”地应用在你的生产环境中。

- 设置 `session.timeout.ms` = 6s。
- 设置 `heartbeat.interval.ms` = 2s。
- 要保证 Consumer 实例在被判定为“dead”之前，能够发送至少 3 轮的心跳请求，即 `session.timeout.ms` >= 3 \* `heartbeat.interval.ms`。

将 `session.timeout.ms` 设置成 6s 主要是为了让 Coordinator 能够更快地定位已经挂掉的 Consumer。毕竟，我们还是希望能尽快揪出那些“尸位素餐”的 Consumer，早日把它们踢出 Group。希望这份配置能够较好地帮助你规避第一类“不必要”的 Rebalance。

##### Consumer 消费时间过长

**第二类非必要 Rebalance 是 Consumer 消费时间过长导致的**。此时，**`max.poll.interval.ms`** 参数值的设置显得尤为关键。如果要避免非预期的 Rebalance，你最好将该参数值设置得大一点，比你的下游最大处理时间稍长一点。

##### GC 参数

如果你按照上面的推荐数值恰当地设置了这几个参数，却发现还是出现了 Rebalance，那么我建议你去排查一下 **Consumer 端的 GC 表现**，比如是否出现了频繁的 Full GC 导致的长时间停顿，从而引发了 Rebalance。为什么特意说 GC？那是因为在实际场景中，我见过太多因为 GC 设置不合理导致程序频发 Full GC 而引发的非预期 Rebalance 了。

### 【困难】Kafka 中的分区分配策略有哪些？如何选择合适的策略？

Kafka 通过分区策略平衡吞吐量、延迟与稳定性。

**Kafka 分区分配策略**

- **Range（范围）**

  - **原理**：按分区范围顺序分配给消费者。
  - **适用场景**：分区数与消费者数接近时。
  - **优势**：实现简单，避免单消费者过载。
  - **劣势**：分区/消费者数差异大时易负载不均。

- **RoundRobin（轮询）**

  - **原理**：均匀轮询分配分区。
  - **适用场景**：分区和消费者数量均较大的场景。
  - **优势**：负载均衡效果佳。
  - **劣势**：消费者动态变化时易触发频繁重平衡，增加延迟。

- **Sticky（粘性）**
  - **原理**：优先保留原有分配，减少变动。
  - **适用场景**：消费者频繁动态调整（如扩缩容）。
  - **优势**：降低重平衡开销，提升稳定性。
  - **劣势**：实现复杂，需调参优化。

**策略选择关键考量因素**

- **集群规模**：分区与消费者数量比例（接近选 Range，悬殊选 RoundRobin）。
- **动态性需求**：消费者频繁变动时，Sticky 策略更优。
- **性能要求**：低延迟优先：Sticky 减少重平衡；高吞吐优先：RoundRobin 均衡负载。

### 【困难】在 Kafka 中，如何优化分区的读写性能？有哪些常见的调优策略？

在 Kafka 中，优化分区的读写性能主要可以通过以下几种常见的调优策略实现：

1. 合理设置分区数（partitions）：根据生产者和消费者的能力，以及集群的规模，设置合适的分区数可以在提高写入和读取性能方面产生显著效果。
2. 增加副本数（replication factor）：副本数的增加可以提升数据的可靠性和读取性能，不过需要在性能和数据冗余之间找到平衡点。
3. 调整 broker 配置参数：通过调优 Kafka broker 的相关配置，如调整 `log.retention.hours`、`log.segment.bytes`、`log.flush.interval.messages` 等参数，可以显著提升读写性能。
4. 调优生产者和消费者的配置：例如调整生产者的批量发送大小（`batch.size`）、压缩类型（`compression.type`）、消费者的最大拉取记录数（`max.poll.records`）等。
5. 硬件配置优化：选择高 IOPS 的磁盘、足够的内存和计算资源来支撑 Kafka 的高并发读写请求。
6. 分区和副本分布优化：确保不同主题的分区和副本分布在不同的 broker 上，以避免潜在的读写瓶颈。

### 【中等】Kafka 如何管理副本？

副本机制是分布式系统实现高可用的不二法门，Kafka 也不例外。

副本机制有哪些好处？

1. **提供可用性**：有句俗语叫：鸡蛋不要放在一个篮子里。副本机制也是一个道理——当部分节点宕机时，系统仍然可以依靠其他正常运转的节点，从整体上对外继续提供服务。
2. **提供伸缩性**：通过增加、减少机器可以控制系统整体的吞吐量。
3. **改善数据局部性**：允许将数据放入与用户地理位置相近的地方，从而降低系统延时。

但是，Kafka 只实现了第一个好处，原因后面会阐述。

- 每个 Partition 都有一个 Leader，零个或多个 Follower。
- Leader 处理一切对 Partition （分区）的读写请求；而 Follower 只需被动的同步 Leader 上的数据。
- 同一个 Topic 的不同 Partition 会分布在多个 Broker 上，而且一个 Partition 还会在其他的 Broker 上面进行备份。

#### Kafka 副本角色

Kafka 使用 Topic 来组织数据，每个 Topic 被分为若干个 Partition，每个 Partition 有多个副本。每个 Broker 可以保存成百上千个属于不同 Topic 和 Partition 的副本。**Kafka 副本的本质是一个只能追加写入的提交日志**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070726284.png)

Kafka 副本有两种角色：

- **Leader 副本（主）**：每个 Partition 都有且仅有一个 Leader 副本。为了保证数据一致性，**Leader 处理一切对 Partition （分区）的读写请求**；
- **Follower 副本（从）**：Leader 副本以外的副本都是 Follower 副本。**Follower 唯一的任务就是从 Leader 那里复制消息，保持与 Leader 一致的状态**。
- 如果 Leader 宕机，其中一个 Follower 会被选举为新的 Leader。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070726185.png)

为了与 Leader 保持同步，Follower 向 Leader 发起获取数据的请求，这种请求与消费者为了读取消息而发送的请求是一样的。请求消息里包含了 Follower 想要获取消息的偏移量，而这些偏移量总是有序的。

Leader 另一个任务是搞清楚哪个 Follower 的状态与自己是一致的。通过查看每个 Follower 请求的最新偏移量，Leader 就会知道每个 Follower 复制的进度。如果跟随者在 10s 内没有请求任何消息，或者虽然在请求消息，但是在 10s 内没有请求最新的数据，那么它就会被认为是**不同步**的。**如果一个副本是不同步的，在 Leader 失效时，就不可能成为新的 Leader**——毕竟它没有包含全部的消息。

除了当前首领之外，每个分区都有一个首选首领——创建 Topic 时选定的首领就是分区的首选首领。之所以叫首选 Leader，是因为在创建分区时，需要在 Broker 之间均衡 Leader。

#### ISR

ISR 即 In-sync Replicas，表示同步副本。Follower 副本不提供服务，只是定期地异步拉取领导者副本中的数据而已。既然是异步的，说明和 Leader 并非数据强一致性的。

**判断 Follower 是否与 Leader 同步的标准**：

Kafka Broker 端参数 `replica.lag.time.max.ms` 参数，指定了 Follower 副本能够落后 Leader 副本的最长时间间隔，默认为 10s。这意味着：只要一个 Follower 副本落后 Leader 副本的时间不连续超过 10 秒，那么 Kafka 就认为该 Follower 副本与 Leader 是**同步**的，即使此时 Follower 副本中保存的消息明显少于 Leader 副本中的消息。

ISR 是一个动态调整的集合，会不断将同步副本加入集合，将不同步副本移除集合。Leader 副本天然就在 ISR 中。

#### Unclean 领导者选举

因为 Leader 副本天然就在 ISR 中，如果 ISR 为空了，就说明 Leader 副本也“挂掉”了，Kafka 需要重新选举一个新的 Leader。

**Kafka 把所有不在 ISR 中的存活副本都称为非同步副本**。通常来说，非同步副本落后 Leader 太多，因此，如果选择这些副本作为新 Leader，就可能出现数据的丢失。毕竟，这些副本中保存的消息远远落后于老 Leader 中的消息。在 Kafka 中，选举这种副本的过程称为 Unclean 领导者选举。**Broker 端参数 `unclean.leader.election.enable` 控制是否允许 Unclean 领导者选举**。

**开启 Unclean 领导者选举可能会造成数据丢失**，但好处是：它使得 Partition Leader 副本一直存在，不至于停止对外提供服务，因此提升了高可用性。反之，禁止 Unclean 领导者选举的好处在于维护了数据的一致性，避免了消息丢失，但牺牲了高可用性。

## 高可用

### 【困难】Kafka 的高可用性是如何实现的？当 Broker 宕机时，如何保证服务不受影响？

- **数据冗余**：多副本存储，防止单点数据丢失。
- **自动容灾**：Leader 自动切换 + 分区再均衡，减少人工干预。
- **灵活一致性**：通过 ACK 和 ISR 机制适配不同业务场景（如高吞吐或强一致性）。

**核心机制**

- **多副本机制**

  - 每个分区（Partition）有多个副本，分布在不同的 Broker 上，确保数据冗余。
  - 副本分为 **Leader**（处理读写请求）和 **Follower**（同步数据）。

- **主从架构**

  - 生产者和消费者仅与 Leader 副本交互。
  - 当 Leader 宕机时，从 Follower 副本中选举新 Leader，保证服务连续性。

- **ZooKeeper 协调**
  - 管理集群元数据（如 Broker 状态、分区 Leader 信息）。
  - 检测 Broker 故障并触发 Leader 选举。

**故障恢复流程**

- **故障检测**：ZooKeeper 发现 Broker 宕机。
- **Leader 选举**：从 ISR（同步副本集）中选出新 Leader。
- **分区再均衡**：将宕机 Broker 的分区重新分配到其他可用 Broker。

**支撑技术**

- **ISR（In-Sync Replicas）**：仅与 Leader 保持同步的副本可参与 Leader 选举，确保数据一致性。
- **ACK 确认机制**：生产者可配置不同级别的确认（如 `0`、`1`、`all`），平衡吞吐量与数据可靠性。
- **控制器（Controller）**：集群中一个 Broker 担任控制器，负责分区 Leader 选举和状态管理。控制器故障时，ZooKeeper 重新选举新控制器。
- **惰性故障检测**：避免短暂故障导致的频繁 Leader 切换，通过延迟判断减少集群波动。

### 【困难】Kafka 的优先副本选举机制是如何工作的？如何配置它？

优先副本选举是 Kafka 维持集群健康的核心机制，通过**自动/手动**结合的方式，确保 Leader 分布合理，兼顾负载均衡与数据可靠性。

**优先副本（Preferred Replica）** 是分区初始分配时的第一个副本（如分区`P0`的副本分配为`[Broker1, Broker2, Broker3]`，则`Broker1`是优先副本）。它的作用是通过选举优先副本为 Leader，实现**负载均衡**，避免部分 Broker 长期承担过多 Leader 角色。

**自动配置方法**

在 `server.properties` 中配置以下参数：

```properties
# 启用自动优先副本选举
auto.leader.rebalance.enable=true
# 检查 Leader 不均衡的频率（默认 300 秒）
leader.imbalance.check.interval.seconds=300
```

**生效条件**：需重启 Kafka 集群。

**手动触发命令**

通过脚本强制触发选举：

```shell
bin/kafka-preferred-replica-election.sh --zookeeper localhost:2181
```

**适用场景**：紧急负载均衡或维护后恢复预期状态。

**核心价值**

| 优势         | 说明                                       |
| :----------- | :----------------------------------------- |
| **负载均衡** | 分散 Leader 压力，避免单节点过热。         |
| **高可用性** | 优先副本通常数据最新，故障切换时恢复更快。 |
| **性能优化** | 均衡的 Leader 分布可提升整体吞吐量。       |

### 【困难】在 Kafka 中，如何实现多集群的数据同步？跨集群复制的实现原理是什么？

**MirrorMaker 核心功能**

- **作用**：实现 Kafka 集群间的**跨集群数据复制**（源集群 → 目标集群）。
- **原理**：基于消费者-生产者模型
  - **Consumer**：从源集群拉取数据。
  - **Producer**：向目标集群推送数据。
- **版本差异**：
  - **MirrorMaker 1.0**：基础复制功能，配置复杂。
  - **MirrorMaker 2.0**（Kafka 2.4+）：支持多租户、动态拓扑、偏移量同步等高级特性。

**快速部署步骤**

1. **准备集群**：确保源集群和目标集群正常运行。
2. **配置 MirrorMaker**：

- **`consumer.config`**：指定源集群地址（`bootstrap.servers`）、消费者组（`group.id`）。
- **`producer.config`**：指定目标集群地址（`bootstrap.servers`）。
- **`whitelist`**：定义需复制的 Topic（支持正则，如 `.*` 表示全部）。

3. **启动命令**：
   ```bash
   bin/kafka-mirror-maker.sh \
     --consumer.config consumer.config \
     --producer.config producer.config \
     --whitelist "your_topic"
   ```

**关键特性与注意事项**

| **特性**       | **说明**                                                        |
| -------------- | --------------------------------------------------------------- |
| **数据一致性** | 保证消息顺序，但存在**延迟**（依赖网络带宽和集群负载）。        |
| **容错性**     | 消费者组自动提交偏移量，故障恢复后可继续复制。                  |
| **性能瓶颈**   | 单线程设计（1.0 版本），高吞吐场景需横向扩展 MirrorMaker 实例。 |
| **监控指标**   | 关注 `consumer-lag`、`producer-throughput` 等指标。             |

**高级配置与优化**

- **MirrorMaker 2.0 优势**：
  - 支持**双向同步**（Active-Active 架构）。
  - 自动同步 Topic 配置（如分区数、ACL）。
- **调优建议**：
  - 增加 `num.streams` 参数提升并发度（1.0 版本）。
  - 使用 `--abort.on.send.failure true` 确保生产失败时快速终止。

**替代工具对比**

| **工具**                 | **适用场景**                             | **特点**                                 |
| ------------------------ | ---------------------------------------- | ---------------------------------------- |
| **Confluent Replicator** | 企业级需求（如 Schema 同步、监控集成）。 | 商业工具，功能全面，支持复杂拓扑。       |
| **uReplicator**          | 高可用、低延迟场景（如 LinkedIn 生产）。 | 开源，支持 Controller 层优化，减少延迟。 |

**常见问题解决**

- **数据延迟高**：
  - 检查网络带宽，增加 MirrorMaker 实例数。
  - 调整 `fetch.min.bytes`（消费者）和 `linger.ms`（生产者）。
- **Topic 配置不同步**：
  - MirrorMaker 2.0 可自动同步，1.0 需手动创建目标 Topic。

**总结**

- **基础场景**：MirrorMaker 1.0 适合简单单向同步。
- **复杂需求**：优先选择 MirrorMaker 2.0 或 Confluent Replicator。
- **核心原则**：监控延迟、保障网络稳定性、合理规划拓扑。

### 【困难】ZooKeeper 在 Kafka 中的作用是什么？

ZooKeeper 在 Kafka 中扮演着**核心的协调者角色**，主要负责集群的元数据管理、Broker 协调和状态维护。

Zookeeper 仍是 Kafka 2.8 之前版本的"大脑"，承担关键协调职能。KRaft 模式将成为标准架构，2023 年后新版本将默认启用。

**Zookeeper 的核心作用**

| **功能**               | **说明**                                                     |
| ---------------------- | ------------------------------------------------------------ |
| **管理 Broker 元数据** | 维护 Broker 注册信息（在线/离线状态）；Broker 的 ID、主机名、端口等元数据；Topic/Partition 元数据 |
| **Controller 选举**    | 通过临时节点（Ephemeral ZNode）选举集群唯一 Controller，负责分区 Leader 选举 |
| **故障恢复**           | 监测节点故障并触发分区 Leader 重选举                         |
| **消费者组 Offset**    | 旧版本（≤0.8）将消费者 Offset 存储在 Zookeeper，新版本改用内部 主题 `_consumer_offsets`。 |
| **配置中心**           | 存储 Kafka 配置和拓扑信息                                    |

**Zookeeper 的局限性**

- **性能瓶颈**：高频元数据操作（如分区重平衡）可能导致 Zookeeper 成为性能瓶颈。
- **运维复杂度**：需单独维护 Zookeeper 集群，增加运维负担。
- **扩展性差**：Zookeeper 的写性能随节点数增加而下降。

**去 Zookeeper 化**

- **目标**：用 Kafka 自身机制替代 Zookeeper，简化架构。
- **实现方案**：
  - **Raft 协议**：通过内置的 Raft 共识算法管理元数据（类似 ZooKeeper 的 ZAB）。
  - **内部 Topic**：将元数据存储在 Kafka 的 `__cluster_metadata` Topic 中，利用副本机制保证高可用。
- **优势**：
  - 减少外部依赖，降低运维成本。
  - 提升元数据操作的吞吐量和延迟。

**运维建议**

- **Zookeeper 集群配置**：
  - 至少部署 **3/5 个节点**（容忍 1/2 个节点故障）。
  - 隔离 Zookeeper 与 Kafka 的磁盘 I/O，避免资源竞争。
- **监控指标**：
  - Zookeeper 的 `znode` 数量、延迟（`avg_latency`）、活跃连接数。
  - Kafka Controller 的存活状态及切换频率。

**总结**

- **现状**：Zookeeper 仍是 Kafka 的核心依赖（3.x 版本），负责集群元数据管理。
- **未来**：KIP-500 将逐步移除 Zookeeper，采用自管理的 Raft 元数据服务。
- **关键措施**：
  - 保障 Zookeeper 集群的高可用（奇数节点+分散部署）。
  - 关注 Kafka 新版本演进，规划架构升级。

### 【困难】Kafka 的 Controller Failover 是如何设计的？在 Controller 宕机时如何进行故障恢复？

Kafka 的 Controller 是集群中负责管理各种元数据（如主题创建、分区分配、副本分配等）以及协调领导者选举的关键组件。Controller Failover 是 Kafka 保证高可用性的重要机制。具体来讲，当 Controller 宕机时，Kafka 会通过 Zookeeper 选举出一个新的 Controller，以确保集群可以继续正常运行。

以下是 Kafka Controller Failover 的主要设计和流程：

1. Zookeeper 作为协调者：每个 Kafka Broker 启动时都会尝试在 Zookeeper 中创建一个特殊的节点（`/controller`）。因为这个节点使用的是 Ephemeral（临时）节点类型，当创建该节点的 Broker 宕机时，这个节点会自动删除。
2. 竞争成为 Controller：一旦当前的 Controller 宕机，所有活着的 Broker 都会尝试在 Zookeeper 中创建 `/controller` 节点。第一个成功创建这个节点的 Broker 会成为新的 Controller，剩下的则会收到失败通知。
3. 通知机制：新的 Controller 会在 Zookeeper 中写入它的选举结果，并通过监听机制通知所有 Broker。这些 Broker 会更新它们本地的 Controller 缓存，从而指向新的 Controller。
4. 恢复任务：新当选的 Controller 需要快速完成集群状态的接管，包括重新分配分区副本、添加主题、调整副本同步等等。这些操作通过监听 Zookeeper 节点和操作 Kafka 内部 Topic（如\_\_consumer_offsets）完成。

### 【困难】Kafka 中的 Controller 是什么角色？它在集群中的作用是什么？

Kafka 中的 Controller 是整个集群的协调者，它是专门负责监控和管理 Kafka 集群中分区（partition）和副本（replica）状态的节点。在整个 Kafka 集群中，Controller 的角色是至关重要的，它帮助集群维持稳定，确保分区和副本的可用性和一致性。

Controller 在集群中的主要作用包括：

- **Leader 选举**：确定哪个副本成为分区的 Leader 来处理读写请求。
- **副本管理**：监控和管理副本的状态，确保同步副本集（ISR）的健康状态。
- **分区迁移**：如果某个 broker 出现故障，Controller 负责重新分配其上的分区到其他可用 Broker 上。
- **Topic 创建和删除**：管理 Topic 的创建和删除操作，并广播这些信息到集群中的所有 Broker。

为进一步了解 Kafka 中 Controller 的重要性，可阅读以下扩展点：

- **Controller 的选举机制**：Kafka 使用 ZooKeeper 来管理 Controller 的选举过程。当 Kafka 集群启动时，第一个向 ZooKeeper 注册的 Broker 被选为 Controller。如果当前 Controller 挂掉，其他 Broker 会竞选成为新的 Controller。
- **高可用性与容错性**：Controller 的设计是为了保证高可用性和容错性。即使当前 Controller 挂了，新选出的 Controller 也会迅速接管，一般不会导致集群不可用。Controller 的状态信息会存储在 ZooKeeper 中，从而保证即使在切换过程中数据也不会丢失。
- **与 ISR 的关系**：Controller 定期与 ISR 中的所有副本保持联系，确保这些副本数据是同步的。如果某个副本落后太多，Controller 会将其从 ISR 中移除，以保证数据的一致性。
- **Controller 负载与性能**：虽然 Controller 承担了大量的管理任务，但其负载相对来说还是较小的，瓶颈更多出现在 Kafka 的数据传输和处理流程中。
- **ZooKeeper 对 Kafka 的作用**：虽然 Kafka 在未来版本中可能会移除 ZooKeeper 的依赖（计划中的 Kafka Raft），目前仍然依赖 ZooKeeper 来维护集群的元数据和进行 Controller 的选举和管理。

### 【中等】Kafka 如何保证消息的持久性和高可用性？

**消息持久性**：Kafka 使用磁盘进行消息存储，确保即使在系统故障的情况下，消息也不会丢失。具体措施包括：

- 分区：Kafka 将每个主题分成多个分区，每个分区是有序且持久的日志。分区方便了数据的存储和读取。
- 日志分段和索引：每个分区被分段为多个日志段，分段之后的日志文件会以可配置的方式进行轮转。Kafka 还会为每个消息生成索引，以快速定位消息。
- 文件系统的强制刷新：Kafka 使用页缓存来提高磁盘 I/O 性能，并定期调用 fsync 系统调用，将数据从页缓存刷新到磁盘，确保数据持久化。

**高可用性**：Kafka 通过复制机制和分布式架构来实现高可用性，具体包括：

- 副本（Replica）：每个分区有一个主副本（Leader）和若干个从副本（Follower）。主副本处理读写请求并将数据同步到从副本，从副本在主副本失败时能顶上处理。
- ISR（In-Sync Replica）：Kafka 维护一个同步副本集合，只有在 ISR 中的副本才被认为是健康的，从而保证了高可用性。
- ACK 机制：在生产者发送消息时，可以配置不同的确认级别（acks），例如 acks=all 则需要等待所有 ISR 中的副本确认收到消息，进一步提高可靠性。

**支撑技术**

- ZooKeeper：Kafka 通过 ZooKeeper 来管理集群的元数据和协调节点之间的工作。比如，分区 Leader 或者 Follower 的选举等操作都是靠 ZooKeeper 来完成的。这样即便某个 Kafka Broker 挂掉了，ZooKeeper 也能迅速协调恢复。
- 高效的存储格式：Kafka 的数据存储采用了顺序写入的方式，而非像传统数据库那样频繁的读写操作跳跃性强。顺序写入拥有很高的磁盘写入速度，极大地提升了 Kafka 的性能。
- Segment 和 Index 文件：Kafka 对每个 Partition 生成多个 Segment 文件和索引文件。Segment 文件是实际存储消息的，而索引文件则是维护消息偏移量和物理位置对照表。这样一来，即使是非常大的数据量，Kafka 也能高效地搜索和读取消息。
- Min ISR 机制：配置 min.insync.replicas 参数可以设定 ISR 阈值，当 ISR 数量低于这个阈值时，Kafka 会拒绝消息写入请求，以确保数据的足够冗余。

### 【中等】Kafka 中的 ISR（In-Sync Replica）是什么？

**ISR 定义**

- 由与 Leader 保持同步的副本组成
- 包含数据最新或仅轻微滞后的副本

**核心价值**：通过动态 ISR 管理实现可靠性与性能的平衡

**消息同步流程**

- Producer 发送消息至 Leader 副本
- Leader 将消息复制给所有 ISR 副本
- ISR 全部确认后，Leader 返回 ACK

**关键机制**

- **Leader 选举**：仅从 ISR 中选出新 Leader
- **副本管理**：
  - 滞后副本会被移出 ISR
  - 恢复同步后重新加入

**配置参数**

| 参数                      | 作用           | 典型值 |
| ------------------------- | -------------- | ------ |
| `acks`                    | 确认副本数     | all    |
| `min.insync.replicas`     | 最小同步副本数 | 2      |
| `replica.lag.time.max.ms` | 最大滞后时间   | 10000  |

**设计权衡**

- **可靠性**：`acks=all`确保数据安全
- **性能**：ISR 副本数越多，写入延迟越高

## 可靠传输

### 【中等】在 Kafka 中，如何通过 Acks 配置提高数据可靠性？Acks 的值如何影响性能？

**选择原则**：根据业务对数据丢失的容忍度进行权衡配置。

**参数选项**

| 配置值   | 可靠性 | 性能 | 适用场景          |
| -------- | ------ | ---- | ----------------- |
| `0`      | 最低   | 最高 | 实时监控/日志收集 |
| `1`      | 中等   | 中等 | 普通业务场景      |
| `all/-1` | 最高   | 最低 | 金融交易/关键数据 |

**优化建议**

- **可靠性优先**：

  - 设置`acks=all`
  - 配合`min.insync.replicas=2`
  - 禁用`unclean.leader.election.enable=false`

- **性能优先**：
  - 选择`acks=0`或`1`
  - 适当降低`replication.factor`（如 2）

**注意事项**

- 副本数`replication.factor`建议≥3
- 高`acks`值会增加网络和存储压力
- 新版 Kafka 优化了高可靠性配置的性能表现

### 【困难】如何保证 Kafka 消息不丢失？

如何保证消息的可靠性传输，或者说，如何保证消息不丢失？这对于任何 MQ 都是核心问题。

一条消息从生产到消费，可以划分三个阶段：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070727544.png)

- **生产阶段**：Producer 创建消息，并通过网络发送给 Broker。
- **存储阶段**：Broker 收到消息并存储，如果是集群，还要同步副本给其他 Broker。
- **消费阶段**：Consumer 向 Broker 请求消息，Broker 通过网络传输给 Consumer。

这三个阶段都可能丢失数据，所以要保证消息丢失，就需要任意一环都保证可靠。通过 **ACK+副本+幂等+手动提交 Offset** 的组合策略，可系统性解决消息丢失问题。根据业务对可靠性和性能的需求调整配置。

- **生产者端**
  - **ACK 机制**：设置 `acks=all`，确保所有副本持久化后才确认发送成功。
  - **幂等生产者**：启用 `enable.idempotence=true`，避免网络重试导致消息重复或丢失。
  - **事务支持**：跨分区的原子性写入（`producer.initTransactions()`）。
- **Broker 端**
  - **多副本机制**：设置 `replication.factor≥3`，保证高可用。
  - **最小同步副本**：配置 `min.insync.replicas≥2`，防止单点故障导致数据丢失。
- **消费者端**
  - **手动提交 Offset**：关闭 `enable.auto.commit=false`，处理完消息后手动提交偏移量。
  - **持久化 Offset**：将 Offset 存储到 Kafka（而非 Zookeeper），避免分区再均衡时丢失。

关键配置：

```properties
# 生产者
acks=all
enable.idempotence=true
# Broker
replication.factor=3
min.insync.replicas=2
# 消费者
enable.auto.commit=false
```

#### 存储阶段不丢消息

存储阶段指的是 Kafka Server，也就是 Broker 如何保证消息不丢失。

一句话概括，**Kafka 只对“已提交”的消息（committed message）做有限度的持久化保证**。

上面的话可以解读为：

- **已提交**：**只有当消息被写入分区的若干同步副本时，才被认为是已提交的**。为什么是若干个 Broker 呢？这取决于你对“已提交”的定义。你可以选择只要 Leader 成功保存该消息就算是已提交，也可以是令所有 Broker 都成功保存该消息才算是已提交。
- **持久化**：Kafka 的数据存储在磁盘上，所以只要写入成功，天然就是持久化的。
- **只要还有一个副本是存活的，那么已提交的消息就不会丢失**。
- **消费者只能读取已提交的消息**。

**Kafka 的副本机制是 kafka 可靠性保证的核心**。

Kafka 的主题被分为多个分区，分区是基本的数据块。每个分区可以有多个副本，有一个是 Leader（主副本），其他是 Follower（从副本）。所有数据都直接发送给 Leader，或者直接从 Leader 读取事件。Follower 只需要与 Leader 保持同步，并及时复制最新的数据。当 Leader 宕机时，从 Follower 中选举一个成为新的 Leader。

Broker 有 3 个配置参数会影响 Kafka 消息存储的可靠性。

- **副本数** - **`replication.factor` 的作用是设置每个分区的副本数**。`replication.factor` 是主题级别配置； `default.replication.factor` 是 broker 级别配置。副本数越多，数据可靠性越高；但由于副本数增多，也会增加同步副本的开销，可能会降低集群的可用性。一般，建议设为 3，这也是 Kafka 的默认值。
- **不完全的选主** - `unclean.leader.election.enable` 用于控制是否支持不同步的副本参与选举 Leader。`unclean.leader.election.enable` 是 broker 级别（实际上是集群范围内）配置，默认值为 true。
  - 如果设为 true，代表着**允许不同步的副本成为主副本**（即不完全的选举），那么将**面临丢失消息的风险**；
  - 如果设为 false，就要**等待原先的主副本重新上线**，从而降低了可用性。
- **最少同步副本** - **`min.insync.replicas` 控制的是消息至少要被写入到多少个副本才算是“已提交”**。`min.insync.replicas` 是主题级别和 broker 级别配置。尽管可以为一个主题配置 3 个副本，但还是可能会出现只有一个同步副本的情况。如果这个同步副本变为不可用，则必须在可用性和数据一致性之间做出选择。Kafka 中，消息只有被写入到所有的同步副本之后才被认为是已提交的。但如果只有一个同步副本，那么在这个副本不可用时，则数据就会丢失。
  - 如果要确保已经提交的数据被已写入不止一个副本，就需要把最小同步副本的设置为大一点的值。
  - 注意：要确保 `replication.factor` > `min.insync.replicas`。如果两者相等，那么只要有一个副本挂机，整个分区就无法正常工作了。我们不仅要改善消息的持久性，防止数据丢失，还要在不降低可用性的基础上完成。推荐设置成 `replication.factor = min.insync.replicas + 1`。

#### 生产阶段不丢消息

在生产消息阶段，消息队列一般通过请求确认机制，来保证消息的可靠传递，Kafka 也不例外。

Kafka 有三种发送方式：同步、异步、异步回调。同步方式能保证消息不丢失，但性能太差；异步方式发送消息，通常会立即返回，但消息可能丢失。

解决生产者丢失消息的方案：

生产者使用异步回调方式 `producer.send(msg, callback)` 发送消息。callback（回调）能准确地告诉你消息是否真的提交成功了。一旦出现消息提交失败的情况，你就可以有针对性地进行处理。

- 如果是因为那些瞬时错误，那么仅仅让 Producer 重试就可以了；
- 如果是消息不合格造成的，那么可以调整消息格式后再次发送。

然后，需要基于以下几点来保证 Kafka 生产者的可靠性：

- **ACK** - 生产者可选的确认模式有三种：`acks=0`、`acks=1`、`acks=all`。
  - `acks=0`、`acks=1` 都有丢失数据的风险。
  - `acks=all` 意味着会等待所有同步副本都收到消息。再结合 `min.insync.replicas` ，就可以决定在得到确认响应前，至少有多少副本能够收到消息。这是最保险的做法，但也会降低吞吐量。
- **重试** - 如果 broker 返回的错误可以通过**重试**来解决，生产者会自动处理这些错误。需要注意的是：有时可能因为网络问题导致没有收到确认，但实际上消息已经写入成功。生产者会认为出现临时故障，重试发送消息，这样就会出现重复记录。所以，尽可能在业务上保证幂等性。设置 `retries` 为一个较大的值。这里的 `retries` 同样是 Producer 的参数，对应前面提到的 Producer 自动重试。当出现网络的瞬时抖动时，消息发送可能会失败，此时配置了 retries > 0 的 Producer 能够自动重试消息发送，避免消息丢失。
  - **可重试错误**，如：`LEADER_NOT_AVAILABLE`，主副本不可用，可能过一段时间，集群就会选举出新的主副本，重试可以解决问题。
  - **不可重试错误**，如：`INVALID_CONFIG`，即使重试，也无法改变配置选项，重试没有意义。
- **错误处理** - 开发者需要自行处理的错误：
  - 不可重试的 broker 错误，如消息大小错误、认证错误等；
  - 消息发送前发生的错误，如序列化错误；
  - 生产者达到重试次数上限或消息占用的内存达到上限时发生的错误。

#### 消费阶段不丢消息

前文已经提到，**消费者只能读取已提交的消息**。这就保证了消费者接收到消息时已经具备了数据一致性。

消费者唯一要做的是确保哪些消息是已经读取过的，哪些是没有读取过的（通过提交偏移量给 Broker 来确认）。如果消费者提交了偏移量却未能处理完消息，那么就有可能造成消息丢失，这也是消费者丢失消息的主要原因。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200727140159.png)

消费者的可靠性配置：

- `group.id` - 如果希望消费者可以看到主题的所有消息，那么需要为它们设置唯一的 `group.id`。
- `auto.offset.reset` - 有两个选项：
  - `earliest` - 消费者会从分区的开始位置读取数据
  - `latest` - 消费者会从分区末尾位置读取数据
- `enable.auto.commit` - 消费者自动提交偏移量。如果设为 true，处理流程更简单，但无法保证重复处理消息。
- `auto.commit.interval.ms` - 自动提交的频率，默认为每 5 秒提交一次。

如果 `enable.auto.commit` 设为 true，即自动提交，就无需考虑提交偏移量的问题。

如果选择显示提交偏移量，需要考虑以下问题：

- 必须在处理完消息后再发送确认（提交偏移量），不要收到消息立即确认。
- 提交频率是性能和重复消息数之间的权衡
- 分区再均衡
- 消费可能需要重试机制
- 超时处理
- 消费者可能需要维护消费状态，如：处理完消息后，记录在数据库中。
- 幂等性设计
  - 写数据库：根据主键判断记录是否存在
  - 写 Redis：set 操作天然具有幂等性
  - 复杂的逻辑处理，则可以在消息中加入全局 ID

### 【困难】如何保证 Kafka 消息不重复？

在 MQTT 协议中，给出了三种传递消息时能够提供的服务质量标准，这三种服务质量从低到高依次是：

- **At most once**：至多一次。消息在传递时，最多会被送达一次。换一个说法就是，没什么消息可靠性保证，允许丢消息。一般都是一些对消息可靠性要求不太高的监控场景使用，比如每分钟上报一次机房温度数据，可以接受数据少量丢失。
- **At least once**: 至少一次。消息在传递时，至少会被送达一次。也就是说，不允许丢消息，但是允许有少量重复消息出现。
- **Exactly once**：恰好一次。消息在传递时，只会被送达一次，不允许丢失也不允许重复，这个是最高的等级。

绝大部分消息队列提供的服务质量都是 At least once，包括 RocketMQ、RabbitMQ 和 Kafka 都是这样。也就是说，消息队列很难保证消息不重复。

一般解决重复消息的办法是，在消费端，**保证消费消息的操作具备幂等性**。

**幂等**（idempotent、idempotence）是一个数学与计算机学概念，指的是：**一个幂等操作的特点是其任意多次执行所产生的影响均与一次执行的影响相同。**

常用的实现幂等操作的方法：

- **消费者幂等处理**
  - 存储已处理消息 ID（如 offset/业务 ID）到 DB/Redis，处理前校验去重。
  - _优点_：实现简单；_缺点_：依赖外部存储性能。
- **Kafka 幂等性与事务**
  - **生产者**：启用`enable.idempotence=true`，避免网络重试导致重复。
  - **消费者**：配合事务提交 Offset，确保"精确一次"处理。
  - _要求_：需 Kafka 0.11+版本支持。
- **业务逻辑去重**
  - 设计天然幂等操作（如订单状态更新："SET status=paid"）。
  - _优势_：高性能；_挑战_：需深度理解业务。

### 【困难】如何保证 Kafka 消息有序？

**对消息有序有要求的场景**

| **场景** | **顺序性要求示例**                                  |
| :------- | :-------------------------------------------------- |
| 金融交易 | 转账指令必须按 `开户→存款→转账` 顺序执行            |
| 日志聚合 | 错误日志需按时间顺序排列：`启动→运行→异常→终止`     |
| 库存管理 | 操作顺序必须为 `入库→出库→盘点`，否则库存数据不一致 |
| 流媒体   | 视频帧需按 `I 帧→P 帧→B 帧` 顺序传输，否则解码失败  |

Kafka 提供了**有限度的顺序性保证**，具体来说：

- 在同一个分区内，消息是有序的。
- 靠消息键将相关消息分配到同一分区，可以保证这些消息在同一分区内依然有序。

**如何保证消息的严格顺序性**

- **分区**：确保生产者将同一类型的消息发送到特定分区。Kafka 保证一个分区内的消息是按顺序存储和消费的。
- **消息键**：使用消息键（Key）来控制消息的分区。相同的 Key 总是被路由到同一个分区，从而保证了具有相同 Key 的消息顺序。
- **单生产者线程**：确保生产者是单线程的或使用有序的发送机制，这样就不会因多线程的并发发送而打乱顺序。
- **生产者中的分区器**：Kafka 的自定义分区器可以确保相同 Key 的消息始终发送到同一个分区。

**高并发场景下如何优化顺序消费**

- **并行处理**：在消费端，可以通过拆分步骤来并行处理部分无顺序依赖的逻辑，从而提高整体吞吐量。
- **异步处理**：利用异步处理机制处理消息，但需要确保消息的核心逻辑是顺序执行的，从而保证顺序。
- **多线程消费**：在不同消费组中根据分区并行消费，但仍需每个分区内的消费线程按照顺序处理消息。

**关键机制**

- **分区机制**：在 Kafka 中，每个 Topic 都可以配置为多个分区，每个分区都是一个有序的、不可变的消息日志。生产者在发送消息时，可以指定消息的键（Key），Kafka 根据这个键来进行哈希运算，将消息写入相应的分区。同一键的消息总会被写入到同一个分区，这样就保证了同一键的消息在同一个分区内是有序的。
- **消息键和分区策略**：当生产者发送消息时，可以通过配置分区策略（Partitioner）决定消息去哪个分区。默认的分区策略是基于消息键的哈希值，比如 `hash(key) mod partitionNum` 。通过这种策略，可以确保相同键的消息被发送到同一个分区，从而保证它们的顺序性。
- **消费端的顺序保证**：消费者在消费消息时，同一个消费者线程只能同时消费一个分区的消息，这样可以保证消费端在处理某个分区内的消息时是按顺序的。如果 Kafka 集群中没有足够的消费者线程，某个消费者线程可能需要同时消费多个分区的消息，但这些分区之间的顺序是无法保证的。
- **顺序性在高可用环境下的挑战**：当 Kafka 分区的 Leader 发生切换时，可能会有短时间的数据不一致。如果处理不当，可能会影响顺序性保证。Kafka 通过保持分区副本（Replica）的一致性，并在重新选举 Leader 时确保新 Leader 从最新的数据点开始处理，尽量减少顺序性的损失。

最佳实践

- **生产者优化**
  - 批量发送：在保证顺序的前提下，尽量使用批量发送来提高吞吐量。
  - 幂等性（Idempotence）：Kafka 生产者支持幂等性，确保消息不会因为重试而导致重复。开启幂等性可以进一步保证消息顺序的一致性。
- **消费者优化**
  - 手工提交消费位移：可以选择在消费每一批消息后，手工提交消费位移，这样可以对某些消息进行重试处理，确保按序消费。
  - 事务性消费：使用 Kafka 的事务性支持，消费者可以确保一组消息要么全部处理成功，要么全部回滚，这在处理批量消息时保证顺序性非常有效。
  - 偏移量管理：合理管理和提交偏移量（Offset），确保在出现错误或重启时能继续保持顺序消费。
- **Kafka 配置调优**
  - min.insync.replicas：确保最小同步副本数，以提高消息的可靠性和顺序性保障。
  - acks 设置：生产者的 acks 设置为 'all'（或 -1），确保所有副本已接收到消息再进行确认，保障消息顺序和持久性。

### 【困难】如何应对 Kafka 消息积压？

- **紧急处理**
  - 增加消费者实例（不超过分区数）
  - 调整参数：增大 max.poll.records
  - 选择性跳过：重置 offset（仅限非关键数据）
- **性能优化**
  - 采用异步处理：分离消息拉取和处理逻辑
  - 优先处理：确保关键业务消息优先消费
- **监控预防**
  - 实时监控 Lag 指标
  - 配置自动扩缩容机制
- **极端情况处理**
  - 拆分 Topic：分散积压消息
  - 离线处理：导出到 HDFS 批量消费

**方案对比**

| 方法        | 见效速度 | 影响         | 适用场景     |
| ----------- | -------- | ------------ | ------------ |
| 增加消费者  | 立即     | 无           | 分区有余量时 |
| 调整参数    | 立即     | 可能内存压力 | 资源充足时   |
| 重置 offset | 立即     | 数据丢失     | 非关键消息   |

**处理原则**

- 先扩容消费者
- 再优化消费逻辑
- 确保核心业务
- 建立预防机制

### 【困难】在 Kafka 中，如何实现幂等性 Producer？它对消息处理的意义是什么？

**最佳实践**：幂等性+事务+合理重试配置，构建高可靠消息系统

**核心配置**

```java
Properties props = new Properties();
props.put("enable.idempotence", "true");  // 启用幂等性
props.put("acks", "all");                 // 确保所有副本确认
props.put("retries", Integer.MAX_VALUE);  // 无限重试
```

**关键特性**

| 特性     | 说明             | 优势           |
| -------- | ---------------- | -------------- |
| 消息去重 | 自动过滤重复消息 | 避免数据重复   |
| 顺序保证 | 单分区内消息有序 | 维护数据一致性 |
| 自动重试 | 内置安全重试机制 | 提升可靠性     |

**高级应用**

- **事务支持**

```java
props.put("transactional.id", "txn-1");
producer.initTransactions();  // 初始化事务
```

- **Exactly-Once 语义**
  - 结合幂等性和事务
  - 确保端到端一次性处理

**使用建议**

- **适用场景**：金融交易、订单处理等关键业务
- **性能影响**：轻微吞吐量下降，换取数据可靠性
- **版本要求**：Kafka 0.11+

## 事务

### 【中等】Kafka 是否支持事务？如何支持事务？

**Kafka 的事务概念是指一系列的生产者生产消息和消费者提交偏移量的操作在一个事务，或者说是是一个原子操作），同时成功或者失败**。

消息可靠性保障，由低到高为：

- 最多一次（at most once）：消息可能会丢失，但绝不会被重复发送。
- 至少一次（at least once）：消息不会丢失，但有可能被重复发送。
- 精确一次（exactly once）：消息不会丢失，也不会被重复发送。

Kafka 支持事务功能主要是为了实现精确一次处理语义的，而精确一次处理是实现流处理的基石。

Kafka 自 0.11 版本开始提供了对事务的支持，目前主要是在 read committed 隔离级别上做事情。它能**保证多条消息原子性地写入到目标分区，同时也能保证 Consumer 只能看到事务成功提交的消息**。

**Kafka 事务机制核心要点：**

- **事务管理器（Transaction Coordinator）**：协调事务生命周期（开始/提交/中止），跟踪生产者状态。
- **生产者（Producer）**：将多条消息绑定为一个事务，提交后生效，失败则回滚。
- **消费者（Consumer）**：仅读取已提交事务的消息，避免中间状态数据。
- **事务日志（Transaction Log）**：持久化记录事务状态（进行中/已提交/已中止）。
- **两阶段提交（2PC）**
  - **阶段 1**：生产者发送消息但不提交。
  - **阶段 2**：事务管理器决定提交或中止，通知生产者执行。

**总结**：Kafka 事务通过协调器、2PC 和日志追踪实现原子消息组，适用于需严格一致的分布式场景。

#### 事务型 Producer

事务型 Producer 能够保证将消息原子性地写入到多个分区中。这批消息要么全部写入成功，要么全部失败。另外，事务型 Producer 也不惧进程的重启。Producer 重启回来后，Kafka 依然保证它们发送消息的精确一次处理。

**事务属性实现前提是幂等性**，即在配置事务属性 `transaction.id` 时，必须还得配置幂等性；但是幂等性是可以独立使用的，不需要依赖事务属性。

在事务属性之前先引入了生产者幂等性，它的作用为：

- **生产者多次发送消息可以封装成一个原子操作**，要么都成功，要么失败。
- consumer-transform-producer 模式下，因为消费者提交偏移量出现问题，导致**重复消费**。需要将这个模式下消费者提交偏移量操作和生产者一系列生成消息的操作封装成一个原子操作。

**消费者提交偏移量导致重复消费消息的场景**：消费者在消费消息完成提交便宜量 o2 之前挂掉了（假设它最近提交的偏移量是 o1），此时执行再均衡时，其它消费者会重复消费消息 (o1 到 o2 之间的消息）。

#### Kafka 事务相关配置

使用 kafka 的事务 api 时的一些注意事项：

- 需要消费者的自动模式设置为 false，并且不能子再手动的进行执行 `consumer#commitSync` 或者 `consumer#commitAsyc`
- 设置 Producer 端参数 `transctional.id`。最好为其设置一个有意义的名字。
- 和幂等性 Producer 一样，开启 `enable.idempotence = true`。如果配置了 `transaction.id`，则此时 `enable.idempotence` 会被设置为 true
- 消费者需要配置事务隔离级别 `isolation.level`。在 `consume-trnasform-produce` 模式下使用事务时，必须设置为 `READ_COMMITTED`。
  - `read_uncommitted`：这是默认值，表明 Consumer 能够读取到 Kafka 写入的任何消息，不论事务型 Producer 提交事务还是终止事务，其写入的消息都可以读取。很显然，如果你用了事务型 Producer，那么对应的 Consumer 就不要使用这个值。
  - `read_committed`：表明 Consumer 只会读取事务型 Producer 成功提交事务写入的消息。当然了，它也能看到非事务型 Producer 写入的所有消息。

### 【困难】Kafka 的事务机制与幂等性机制如何协同工作？它们在保证消息一致性上有什么作用？

Kafka 的事务机制与幂等性机制结合实现**端到端的 Exactly Once**，适用于强一致性要求的分布式系统。

**核心功能**

- **事务机制**：确保消息组的**原子性**（全部成功或全部失败），支持跨分区的**一致性**提交。
- **幂等性机制**：防止生产者重复发送导致消息重复（**Exactly Once **语义）。

**关键实现**

- **事务流程**（生产者端）：

  ```java
  producer.initTransactions();  // 初始化事务
  producer.beginTransaction(); // 开启事务
  producer.send(record);       // 发送消息
  producer.commitTransaction();// 提交（或 abortTransaction() 回滚）
  ```

- **幂等性实现**：

  - 每个生产者分配唯一** PID**，消息附带**递增序列号**。
  - Broker 通过 PID + 序列号去重，拒绝重复消息。

**协同作用**

- **幂等性**：解决单条消息重复问题（如网络重试）。
- **事务**：解决多条消息的原子提交问题（如分布式操作）。

**典型应用场景**

- **金融交易**：转账操作需保证扣款和入账同时成功或失败。
- **日志处理**：确保日志批次完整，且无重复记录。

**故障容错**：事务机制 + 幂等性 = 故障重试时仍保证**数据一致**，避免部分成功或重复消费。

### 【困难】Kafka 的 Exactly Once 语义在分布式系统中是如何实现的？如何处理分布式事务中的异常情况？

Kafka 通过`幂等生产`+`事务`+`精准 offset 控制`，在分布式环境下实现**端到端 Exactly Once**，适用于金融、计费等强一致性场景。

**核心机制**

- **幂等生产者**

  - 通过唯一`Producer ID`和消息`序列号`实现去重
  - 确保单条消息**不重复**（网络重试场景）

- **事务生产者**

  - 提供跨分区的原子操作（`commitTransaction`/`abortTransaction`）
  - 保证一组消息**全成功或全失败**

- **消费端去重**
  - 基于`offset`管理 + 消费者组机制
  - 避免消息被重复处理

**异常处理**

| **方法** | **作用**                           | **场景示例**             |
| -------- | ---------------------------------- | ------------------------ |
| 事务回滚 | 撤销未完成的操作，保持原子性       | 生产者写入部分分区失败时 |
| 自动重试 | 应对临时性故障（如网络抖动）       | Broker 短暂不可用        |
| 幂等消费 | 通过业务 ID 或状态记录避免重复处理 | 消费者重启后重复拉取消息 |

**关键扩展**

- **CAP 权衡**：Kafka 优先保证**高可用**和**分区容错**（AP），通过事务补充一致性
- **Kafka Streams**：利用状态存储和检查点机制实现流处理 Exactly Once
- **消费者组**：`enable.auto.commit=false`时需手动提交 offset 以精准控制消费

## 架构

### 【简单】Kafka 的基本架构包括哪些组件？各组件的作用是什么？

Kafka 通过组件分工+副本机制保障高可用，结合批量/压缩/手动提交等优化手段实现高性能。新版本推荐使用 KRaft 模式简化架构。

**核心组件**

| 组件          | 核心功能                                                                        |
| ------------- | ------------------------------------------------------------------------------- |
| **Producer**  | 发布数据到 Topic，支持轮询/Key 哈希/自定义分区策略                              |
| **Consumer**  | 通过消费组实现负载均衡，同一分区仅限单个消费者消费                              |
| **Broker**    | 存储管理消息，通过分区副本实现高可用，支持故障自动转移                          |
| **Zookeeper** | 管理集群元数据、Leader 选举（注：新版本 Kafka 逐步用 KRaft 协议替代 Zookeeper） |

**工作机制优化**

- **Producer 优化**
  - 批量发送（`linger.ms`+`batch.size`）
  - 压缩算法（Snappy/Gzip 降低带宽占用）
  - 异步发送（`acks=1/all`平衡性能与可靠性）
- **Consumer 优化**
  - 动态分区分配（`range/round-robin`策略）
  - 手动提交 Offset（`enable.auto.commit=false`避免重复/丢失）
  - 并行消费（分区数≥消费者数，避免闲置）
- **Broker 优化**
  - 副本机制（`replication.factor≥2`保障容错）
  - ISR 列表（同步副本快速选举新 Leader）
  - 磁盘顺序写（高吞吐设计，避免随机 IO）

**关键配置建议**

| 场景           | 推荐配置                          | 说明                  |
| -------------- | --------------------------------- | --------------------- |
| 高吞吐场景     | `compression.type=snappy`         | 压缩率与 CPU 开销平衡 |
| 数据持久化要求 | `log.retention.hours=168`（7 天） | 根据存储容量调整      |
| 低延迟场景     | `num.io.threads=8`（默认值翻倍）  | 提升磁盘 IO 并行度    |

**版本演进注意**

- **KRaft 模式**：Kafka 3.0+版本内置元数据管理，逐步淘汰 Zookeeper 依赖
- **性能取舍**：分区数并非越多越好（建议单 Broker≤2000 分区，避免元数据膨胀）

### 【简单】Kafka 的设计目标

- **高性能**
  - **分区、分段、索引**：基于分区机制提供并发处理能力。分段、索引提升了数据读写的查询效率。
  - **顺序读写**：使用顺序读写提升磁盘 IO 性能。
  - **零拷贝**：利用零拷贝技术，提升网络 I/O 效率。
  - **页缓存**：利用操作系统的 PageCache 来缓存数据（典型的利用空间换时间）
  - **批量读写**：批量读写可以有效提升网络 I/O 效率。
  - **数据压缩**：Kafka 支持数据压缩，可以有效提升网络 I/O 效率。
  - **pull 模式**：Kafka 架构基于 pull 模式，可以自主控制消费策略，提升传输效率。
- **高可用**
  - **持久化**：Kafka 所有的消息都存储在磁盘，天然支持持久化。
  - **副本机制**：Kafka 的 Broker 集群支持副本机制，可以通过冗余，来保证其整体的可用性。
  - **选举 Leader**：Kafka 基于 ZooKeeper 支持选举 Leader，实现了故障转移能力。
- **伸缩性**
  - **分区**：Kafka 的分区机制使得其具有良好的伸缩性。

### 【困难】Kafka 为什么性能高？

Kafka 的数据存储在磁盘上，为什么还能这么快？

说 Kafka 很快时，他们通常指的是 Kafka 高效移动大量数据的能力。Kafka 为了提高传输效率，做了很多精妙的设计。

- 写：**顺序追加** + **零拷贝** + **分段管理**
  - 顺序追加：日志追加写入到磁盘（顺序 I/O），提高写入性能。
  - 零拷贝：`sendfile` 系统调用，数据直接从磁盘→网络，减少 CPU 拷贝开销。
  - 分段管理：
    - Topic→Partitions
    - Partition→有序 Log
    - Log→Segments
- 读：**页缓存** + **双索引**
  - 页缓存：缓存热点数据，减少磁盘 IO
  - 双索引：xxx.index（偏移量索引） + xxx.timeindex（时间索引），加速查询
- 存：**压缩** + **日志清理**
  - 批量压缩：支持 GZIP、Snappy 等算法
  - 日志清理：默认超出 7 天或 1GB 删除

::: info 零拷贝

:::

Kafka 数据传输是一个从网络到磁盘，再由磁盘到网络的过程。在网络和磁盘之间传输数据时，消除多余的复制是提高效率的关键。**Kafka 利用零拷贝技术来消除传输过程中的多余复制**。

如果不采用零拷贝，Kafka 将数据同步给消费者的大致流程是：

1. 从磁盘加载数据到 os buffer
2. 拷贝数据到 app buffer
3. 再拷贝数据到 socket buffer
4. 接下来，将数据拷贝到网卡 buffer
5. 最后，通过网络传输，将数据发送到消费者

采用零拷贝技术，Kafka 使用 `sendfile()` 系统方法，将数据从 os buffer 直接复制到网卡 buffer。这个过程中，唯一一次复制数据是从 os buffer 到网卡 buffer。这个复制过程是通过 DMA（Direct Memory Access，直接内存访问） 完成的。使用 DMA 时，CPU 不参与，这使得它非常高效。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070727055.webp)

### 【中等】Kafka 是如何实现横向扩展的？它如何处理大规模集群中的负载均衡？

Kafka 通过分区+副本机制实现横向扩展与负载均衡，配合动态重平衡与 ISR 选举保障高可用性。合理配置分区/副本数和 ACK 策略是关键。

**分区机制**

- **基本概念**
  - 每个 Topic 划分为多个 Partition，分布在集群 Broker 上
  - 单个 Partition 内消息有序，不同 Partition 间无序
- **副本设计**
  - 每个 Partition 配置多个 Replica（默认 1 Leader + N Follower）
  - Leader 处理读写请求，Follower 同步数据
  - ISR（In-Sync Replicas）维护同步副本集合，确保快速故障转移

**负载均衡实现**

| **角色**     | **策略**                          | **作用**                      |
| ------------ | --------------------------------- | ----------------------------- |
| **Producer** | 轮询（Round-robin）               | 均匀分布消息到各分区          |
|              | 按键哈希（Key Hashing）           | 相同 Key 的消息固定到同一分区 |
| **Consumer** | 消费组（Consumer Group）机制      | 组内消费者并行消费不同分区    |
|              | 分区分配策略（Range/Round-robin） | 控制消费者与分区的映射关系    |

**动态扩展与容错**

- **Broker 扩容**
  - 新 Broker 加入时自动触发分区重分配（通过`kafka-reassign-partitions`工具）
  - 支持手动调整副本分布，优化数据均衡
- **故障恢复**
  - Leader 失效时，从 ISR 中选举新 Leader（通常<1 秒）
  - 非同步副本（Out-of-Sync）需完全同步后才能加入 ISR

**关键优化点**

- **减少 Rebalance 影响**
  - 静态成员资格（`group.instance.id`）避免消费者短暂离线触发重平衡
  - 增量再平衡（Kafka 2.4+）仅调整变化的分区
- **性能权衡**
  - 分区数↑ → 并行度↑，但元数据开销↑（建议单 Broker≤2000 分区）
  - 副本数↑ → 可靠性↑，但写入延迟↑（通常`replication.factor=3`）

**数据一致性保障**

生产者 ACK 配置：

- `acks=0`：不等待确认（高性能，可能丢失数据）
- `acks=1`：Leader 写入即确认（平衡选择）
- `acks=all`：所有 ISR 副本确认（高可靠，延迟高）

### 【中等】Kafka 的日志压缩功能是如何实现的？它在什么场景下使用？

日志压缩通过 Key-Level 去重优化存储效率，适用于状态跟踪类场景，需权衡实时性与资源开销。配置时建议结合业务数据更新频率调整`log.cleaner`相关参数。

**基本概念**

- **功能本质**：保留每个键（Key）的最新消息，删除历史重复值
- **触发条件**：需配置`log.cleanup.policy=compact`
- **执行主体**：后台 Cleaner 线程周期性扫描压缩

**工作机制**

| 环节         | 说明                                                      |
| ------------ | --------------------------------------------------------- |
| **写入阶段** | 所有消息（含重复 Key）正常写入日志                        |
| **压缩阶段** | Cleaner 线程扫描日志，对同一 Key 只保留 offset 最大的记录 |
| **清理阶段** | 被标记删除的消息最终被物理清除                            |

**典型应用场景**

- **数据库变更日志**（CDC）：仅保留数据表的最终状态
- **设备状态监控**：存储物联网设备最新上报数据
- **配置管理中心**：记录配置项最新版本
- **会话持久化**：保存用户会话最新信息

**与其他机制的对比**

| **特性**     | **日志压缩**         | **日志删除**（按时间/大小） |
| ------------ | -------------------- | --------------------------- |
| **保留策略** | 按 Key 保留最新值    | 按时间/文件大小删除旧数据   |
| **适用场景** | 需要 Key 级状态追溯  | 只需保留近期数据            |
| **可共存性** | 可与删除策略同时配置 | -                           |

**注意事项**

- **延迟性**：压缩非实时，存在数据最终一致性
- **资源消耗**：压缩过程占用 CPU/IO 资源
- **特殊键处理**：`null`键消息不会被压缩保留
- **监控指标**：关注`kafka.log:type=LogCleanerManager`相关指标

### 【困难】Kafka 的流量控制是如何实现的？如何通过流量控制避免系统过载？

Kafka 通过参数化限速和自适应背压实现多层级流量控制，需根据业务特点（吞吐/延迟/可靠性需求）组合配置。生产环境建议配合监控系统实现动态调节。

**限速控制（Rate Limiting）**

| **组件**   | **关键参数**                            | **控制效果**                       |
| ---------- | --------------------------------------- | ---------------------------------- |
| **生产者** | `max.in.flight.requests.per.connection` | 限制单连接未确认请求数（默认 5）   |
|            | `linger.ms`                             | 批量发送等待时间（0-5000ms）       |
| **消费者** | `fetch.min.bytes`                       | 单次拉取最小数据量（默认 1B）      |
|            | `fetch.max.wait.ms`                     | 拉取请求最长等待时间（默认 500ms） |

**背压机制（Backpressure）**

- **消费者控制**
  - 手动提交偏移量（`enable.auto.commit=false`）
  - 通过处理进度反馈调节消费速率
- **系统级缓冲**
  - 生产者缓冲区（`buffer.memory`，默认 32MB）
  - 消费者 fetch 队列（`queued.max.messages`，默认 500）

**高级控制策略**

- **动态限流**：基于监控指标（如 CPU/网络负载）自动调整生产/消费速率
- **异步批处理**：流处理框架（Flink/Spark）的微批处理优化吞吐量

**配置建议**

| **场景**   | **优化方向**                 | **典型值**               |
| ---------- | ---------------------------- | ------------------------ |
| 高吞吐场景 | 增大`linger.ms`+`batch.size` | `linger.ms=50-100ms`     |
| 低延迟场景 | 减小`fetch.max.wait.ms`      | `fetch.max.wait.ms=10ms` |
| 稳定性优先 | 降低`max.in.flight.requests` | 设为 1（确保顺序性）     |

### 【困难】Kafka 在高吞吐量场景下如何保持低延迟？有哪些性能调优的策略？

通过 **并行化、批处理、硬件加速** 实现高吞吐，同时控制分区/副本数量及网络参数以降低延迟。

**分区与副本优化**

- **分区数**：增加分区提升并行度，但避免过多（管理开销）。
- **副本数**：通常设 **2-3**，平衡可靠性与性能。

**生产端调优**

- **acks=1**：确保至少 1 个副本写入，兼顾性能与可靠性。
- **batch.size ↑** + **linger.ms ↓**：减少网络请求，降低延迟。
- **压缩**：选用 **lz4**（高效压缩/解压），节省带宽。

**消费端调优**

- **fetch.min.bytes** + **fetch.max.wait.ms**：平衡吞吐与延迟。

**硬件优化**

- **磁盘**：SSD（显著提升 I/O 性能）。
- **内存/CPU**：增大内存缓存数据，多核处理并行任务。
- **网络**：确保高带宽，减少传输延迟。

**Broker 配置**

- **log.retention ↑**：减少日志频繁清理开销。
- **socket 缓冲区 ↑**：提升网络传输效率。

### 【困难】Kafka 如何处理数据倾斜问题？有哪些优化手段可以均衡负载？

通过 **分区策略优化 + 动态资源分配 + 流量控制**，实现数据均匀分布与稳定吞吐。

**均衡数据分布**

- **合理设计分区键**：选择高基数字段（如 `user_id`、`order_id`），避免热点。
- **增加分区数**：分散数据压力，但避免过多分区导致管理负担。
- **自定义分区器**：按业务逻辑重写分配策略（如轮询、哈希优化）。

**动态调整与冗余**

- **调整副本因子**：适当增加副本（如 `replication-factor=3`）分散读压力，平衡资源开销。
- **动态监控调整**：实时监控分区负载，必要时触发 `rebalance` 或迁移数据。

**流控与限流**

- **生产者限流**：控制 `producer` 速率（如 `max.in.flight.requests`）。
- **消费者限流**：调整 `fetch.max.bytes` 或使用背压机制，匹配消费能力。

### 【困难】Kafka 与 Flink 的集成是如何实现的？如何优化 Flink 与 Kafka 之间的数据流动？

实现 **高吞吐、低延迟、强一致性** 的流式数据处理管道。

**基础集成步骤**

- **添加依赖**：引入 `flink-connector-kafka`（匹配 Kafka 版本）。
- **配置 Source**：通过 `FlinkKafkaConsumer` 订阅 Kafka Topic。
- **配置 Sink**：通过 `FlinkKafkaProducer` 写入结果到 Kafka。
- **设计作业**：在 Flink 中实现数据处理逻辑（过滤/转换/聚合）。

**性能优化方向**

| **优化项**   | **关键措施**                                                                |
| ------------ | --------------------------------------------------------------------------- |
| **参数调优** | - 调整 `batch.size`/`linger.ms`（生产者）<br>- 设置合理并行度（Flink 任务） |
| **资源分配** | - 平衡 Flink TaskManager 的 CPU/内存<br>- 确保 Kafka Broker 带宽充足        |
| **容错机制** | - 启用 Flink Checkpointing（精确一次语义）<br>- 配置 Kafka 幂等性/事务      |
| **数据压缩** | 选用高效压缩算法（如 `lz4`/`snappy`），减少网络传输压力                     |

**关键代码示例**

```java
// Kafka Source
Properties props = new Properties();
props.setProperty("bootstrap.servers", "kafka:9092");
props.setProperty("group.id", "flink-group");

FlinkKafkaConsumer<String> source = new FlinkKafkaConsumer<>(
    "input-topic",
    new SimpleStringSchema(),
    props
);

// Kafka Sink
FlinkKafkaProducer<String> sink = new FlinkKafkaProducer<>(
    "output-topic",
    new SimpleStringSchema(),
    props
);

// 作业流程
env.addSource(source)
   .map(...)  // 数据处理
   .addSink(sink);
```

**高级特性**

- **动态发现分区**：`setStartFromLatest()`/`setStartFromEarliest()`。
- **水位线生成**：结合 `assignTimestampsAndWatermarks` 处理事件时间。
- **Exactly-Once 保障**：启用 Kafka 事务（需配置 `transaction.timeout.ms`）。

### 【困难】在 Kafka 中，如何优化磁盘 I/O 性能？有哪些策略可以减少 I/O 开销？

**存储架构优化**

| **方法**       | **作用**                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| **增加分区数** | 分散写入负载，利用多磁盘并行 I/O（但避免过多分区导致管理开销）。         |
| **多副本配置** | 提升读取吞吐量（副本数通常 2-3），同时增强容错能力。                     |
| **高性能磁盘** | 优先选择 **NVMe SSD** > SATA SSD > HDD，显著降低读写延迟。               |
| **RAID 配置**  | - RAID 0：纯性能提升（无冗余）<br>- RAID 10：性能+冗余（推荐生产环境）。 |

**参数调优**

| **类型**       | **关键参数**                  | **优化建议**                                   |
| -------------- | ----------------------------- | ---------------------------------------------- |
| **Kafka 配置** | `num.io.threads`              | 增加 I/O 线程数（默认=8，建议=CPU 核数）。     |
|                | `log.flush.interval.messages` | 调高刷盘间隔（减少频繁刷盘开销）。             |
| **生产者配置** | `batch.size` + `linger.ms`    | 增大批次大小（如 64KB）和等待时间（如 50ms）。 |
| **系统级优化** | Linux `vm.dirty_ratio`        | 调大文件系统缓存比例（如 20%-30%）。           |

**高级特性**

- **分层存储（Tiered Storage）**：
  将冷数据迁移至对象存储（如 S3），热数据保留在本地 SSD，降低高速磁盘压力。
- **压缩优化**：
  启用消息压缩（如 `lz4`），减少磁盘写入量和网络传输负载。

**实践示例**

```properties
# Kafka Broker 配置示例
num.io.threads=16
log.flush.interval.messages=10000

# 生产者配置示例
batch.size=65536
linger.ms=50
compression.type=lz4
```

**目标**：通过 **硬件选型 + 并行化设计 + 批量处理**，实现高吞吐、低延迟的磁盘 I/O 性能。

### 【困难】Kafka 的多租户支持是如何实现的？如何通过配额控制各租户的资源使用？

通过 **资源隔离 + 精准配额 + 动态管控**，实现安全、公平的多租户架构。

**租户隔离机制**

| **方法**         | **实现方式**                                                                  |
| ---------------- | ----------------------------------------------------------------------------- |
| **主题隔离**     | 每个租户分配独立 Topic（如 `tenantA_order`、`tenantB_log`），物理隔离数据。   |
| **ACL 权限控制** | 通过 ACL 限制租户仅能访问自有 Topic（配置 CREATE/DESCRIBE/READ/WRITE 权限）。 |

**配额管理配置**

| **配额类型**     | **控制对象**       | **配置示例（CLI）**                                                                |
| ---------------- | ------------------ | ---------------------------------------------------------------------------------- |
| **生产速率限制** | 生产者消息吞吐量   | `--add-config 'producer_byte_rate=1048576'`（限制 1MB/s）                          |
| **消费速率限制** | 消费者消息拉取速度 | `--add-config 'consumer_byte_rate=524288'`（限制 512KB/s）                         |
| **存储空间限制** | Topic 磁盘占用     | 配置 `log.retention.bytes=1073741824`（限制 1GB） + `log.retention.ms`（时间策略） |

**动态管理工具**

- **命令工具**：通过 `kafka-configs.sh` 动态调整配额（无需重启集群）：
  ```sh
  # 设置租户 A 的生产配额
  kafka-configs.sh --bootstrap-server localhost:9092 --alter \
    --entity-type users --entity-name tenantA \
    --add-config 'producer_byte_rate=1048576,consumer_byte_rate=524288'
  ```

**实施建议**

- **命名规范**：Topic 名称包含租户标识（如 `{tenant}_{data_type}`）。
- **监控**：结合 Kafka Metrics 或 Prometheus 监控配额使用情况，避免资源争抢。
- **安全**：启用 SSL/SASL 认证，防止租户越权访问。

### 【困难】Kafka 的 Stream 和 Table 是如何相互转换的？它们在 Kafka Streams 中的应用场景是什么？

通过 **流表转换 + 状态管理**，实现实时计算与状态维护的统一处理。

**核心概念对比**

| **抽象类型** | **特点**                           | **适用场景**                             |
| ------------ | ---------------------------------- | ---------------------------------------- |
| **Stream**   | 无界、有序的键值记录流（事件日志） | 实时分析、事件监控（如点击流、交易记录） |
| **Table**    | 有状态的键值快照（当前数据视图）   | 状态维护（如用户配置、库存数量）         |

**相互转换操作**

**(1) Stream → Table**

通过 **聚合操作** 将动态流转换为状态表：

```java
KStream<String, Long> stream = builder.stream("input-topic");

// 按 Key 分组并累加值
KTable<String, Long> table = stream
    .groupByKey()
    .aggregate(
        () -> 0L,  // 初始值
        (key, newValue, agg) -> agg + newValue,  // 累加逻辑
        Materialized.as("count-store")  // 状态存储
    );
```

**(2) Table → Stream**

通过 **toStream()** 将表变更作为流输出：

```java
KTable<String, Long> table = builder.table("input-topic");
KStream<String, Long> stream = table.toStream();  // 输出表的更新事件
```

**典型应用场景**

- **电商实时统计**

  - **Stream**：处理用户订单事件（如 `order-created`）。
  - **Table**：维护用户总订单数（`user_id → total_orders`）。

- **视频播放分析**
  - **Stream**：接收视频点击事件（`video_id, timestamp`）。
  - **Table**：存储当前视频播放量（`video_id → play_count`）。

**关键设计思想**

- **流表二元性**：
  - Stream 是 Table 的变更日志（Changelog）。
  - Table 是 Stream 的物化视图（Materialized View）。
- **状态管理**：Table 依赖 **RocksDB 状态存储**，支持容错与高效查询。

### 【困难】Kafka 的内部状态是如何管理的？如何通过状态管理优化性能？

通过 **合理分区设计 + 资源分配 + 参数调优**，实现高吞吐、低延迟的稳定集群。

**核心状态管理机制**

| **组件**          | **功能**                                                   |
| ----------------- | ---------------------------------------------------------- |
| **Zookeeper**     | 集群协调（Broker 注册、Leader 选举、Consumer Offset 存储） |
| **Broker 存储**   | 消息持久化（内存 Page Cache + 磁盘日志）                   |
| **Kafka Streams** | 流处理状态管理（RocksDB 状态存储、窗口化操作）             |

**关键性能优化策略**

**(1) 集群设计优化**

| **配置项**     | **优化建议**                                                                     |
| -------------- | -------------------------------------------------------------------------------- |
| **分区数量**   | - 分区数 ≈ 目标吞吐量 / 单分区吞吐能力<br>- 避免过多分区（建议单 Broker ≤ 2000） |
| **副本因子**   | 生产环境建议 2-3（平衡可靠性与存储开销）                                         |
| **Topic 规划** | 按业务拆分 Topic（如 `logs-{service}`），避免热点                                |

**(2) Producer/Consumer 调优**

```properties
# Producer 优化
batch.size=16384       # 增大批次（默认 16KB）
linger.ms=20           # 适当增加等待时间
compression.type=lz4   # 启用压缩
acks=1                 # 平衡可靠性与延迟

# Consumer 优化
fetch.min.bytes=1024   # 减少拉取频次
max.poll.records=500   # 单次拉取最大消息数
```

**(3) Broker 资源配置**

| **资源** | **优化方向**                                                       |
| -------- | ------------------------------------------------------------------ |
| **内存** | - JVM 堆内存 ≤ 6GB（避免 GC 停顿）<br>- 预留 50% 内存给 Page Cache |
| **磁盘** | - 使用 SSD/NVMe<br>- 配置 RAID 10（高性能+冗余）                   |
| **网络** | 万兆网络 + 多网卡绑定（避免带宽瓶颈）                              |

**(4) Kafka Streams 状态优化**

```java
// 启用 RocksDB 状态存储
Stores.persistentKeyValueStore("my-store");

// 窗口化操作（如 5 分钟滚动窗口）
TimeWindows.of(Duration.ofMinutes(5)).grace(Duration.ofSeconds(30));
```

**监控与调优工具**

- **指标监控**：关注 `UnderReplicatedPartitions`、`RequestQueueSize`、`NetworkProcessorAvgIdlePercent`
- **命令行工具**：`kafka-configs.sh`（动态调整配额）、`kafka-topics.sh`（分区扩容）
- **JVM 调优**：G1 GC + 禁用偏向锁（`-XX:-UseBiasedLocking`）

## 参考资料

- [聊聊 Kafka： Kafka 为啥这么快？](https://xie.infoq.cn/article/49bc80d683c373db93d017a99)