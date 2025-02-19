---
title: 《Kafka 核心技术与实战》笔记
date: 2025-02-14 17:08:28
categories:
  - 笔记
  - 分布式
  - 分布式通信
tags:
  - 分布式
  - 分布式通信
  - MQ
  - Kafka
permalink: /pages/be7a7dd7/
---

# 《Kafka 核心技术与实战》笔记

## 开篇词 为什么要学习 Kafka？

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170734255.jpeg)

## 消息引擎系统 ABC

消息引擎系统的作用：

- 消息引擎传输的对象是消息；
- 如何传输消息属于消息引擎设计机制的一部分。

设计消息引擎系统的关键点：

- **序列化** - 决定了在网络中传输数据的形式。
  - 代表：CSV、XML、JSON、Protocol Buffer、Thrift。
  - kafka 默认使用纯二进制的字节序列。
- **传输模型**：Kafka 同时支持以下两种模型
  - **点对点模型**
  - **发布/订阅模型**

消息引擎的作用：

- **异步处理**
- **削峰填谷**
- **系统解耦**
- **系统间通信**
- **数据缓冲**
- **最终一致性**

## 一篇文章带你快速搞定 Kafka 术语

Kafka 术语：

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

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170734395.jpeg)

Kafka 的三层消息架构：

- 第一层是主题层，每个主题可以配置 M 个分区，而每个分区又可以配置 N 个副本。
- 第二层是分区层，每个分区的 N 个副本中只能有一个充当领导者角色，对外提供服务；其他 N-1 个副本是追随者副本，只是提供数据冗余之用。
- 第三层是消息层，分区中包含若干条消息，每条消息的位移从 0 开始，依次递增。
- 最后，客户端程序只能与分区的领导者副本进行交互。

## Kafka 只是消息引擎系统吗？

Kafka 在设计之初就旨在提供三个方面的特性：

- 提供一套 API 实现生产者和消费者；
- 降低网络传输和磁盘存储开销；
- 实现高伸缩性架构。

作为流处理平台，Kafka 与其他主流大数据流式计算框架相比，优势在哪里呢？

- **更容易实现端到端的正确性（Correctness）** - 因为所有的数据流转和计算都在 Kafka 内部完成，故 Kafka 可以实现端到端的精确一次处理语义。
- **Kafka 自己对于流式计算的定位** - 官网上明确标识 Kafka Streams 是一个用于搭建实时流处理的客户端库而非是一个完整的功能系统。

## 我应该选择哪种 Kafka？

- Apache Kafka，也称社区版 Kafka。优势在于迭代速度快，社区响应度高，使用它可以让你有更高的把控度；缺陷在于仅提供基础核心组件，缺失一些高级的特性。
- Confluent Kafka，Confluent 公司提供的 Kafka。优势在于集成了很多高级特性且由 Kafka 原班人马打造，质量上有保证；缺陷在于相关文档资料不全，普及率较低，没有太多可供参考的范例。
- CDH/HDP Kafka，大数据云公司提供的 Kafka，内嵌 Apache Kafka。优势在于操作简单，节省运维成本；缺陷在于把控度低，演进速度较慢。

## 聊聊 Kafka 的版本号

Kafka 有以下重大版本：

- 0.7 - 只提供了最基础的消息队列功能
- 0.8
  - 正式引入了副本机制
  - 至少升级到 0.8.2.2
- 0.9
  - 增加了基础的安全认证 / 权限功能
  - 用 Java 重写了新版本消费者 API
  - 引入了 Kafka Connect 组件
  - 新版本 Producer API 在这个版本中算比较稳定
- 0.10
  - 引入了 Kafka Streams，正式升级成分布式流处理平台
  - 至少升级到 0.10.2.2
  - 修复了一个可能导致 Producer 性能降低的 Bug
- 0.11
  - 提供幂等性 Producer API 以及事务
  - 对 Kafka 消息格式做了重构
  - 至少升级到 0.11.0.3
- 1.0 和 2.0 - Kafka Streams 的改进

## Kafka 线上集群部署方案怎么做？

**系统**

在 Linux 部署 Kafka 能够享受到零拷贝技术所带来的快速数据传输特性。

**磁盘**

使用机械磁盘完全能够胜任 Kafka 线上环境。

**磁盘容量**

假设你所在公司有个业务每天需要向 Kafka 集群发送 1 亿条消息，每条消息保存两份以防止数据丢失，另外消息默认保存两周时间。现在假设消息的平均大小是 1KB，那么你能说出你的 Kafka 集群需要为这个业务预留多少磁盘空间吗？

我们来计算一下：每天 1 亿条 1KB 大小的消息，保存两份且留存两周的时间，那么总的空间大小就等于`1 亿 * 1KB * 2 / 1000 / 1000 = 200GB`。一般情况下 Kafka 集群除了消息数据还有其他类型的数据，比如索引数据等，故我们再为这些数据预留出 10%的磁盘空间，因此总的存储容量就是 220GB。既然要保存两周，那么整体容量即为 `220GB * 14`，大约 3TB 左右。Kafka 支持数据的压缩，假设压缩比是 0.75，那么最后你需要规划的存储空间就是 `0.75 * 3 = 2.25TB`。

总之在规划磁盘容量时你需要考虑下面这几个元素：

- 新增消息数
- 消息留存时间
- 平均消息大小
- 备份数
- 是否启用压缩

**带宽**

通常使用的都是普通的以太网络，带宽也主要有两种：1Gbps 的千兆网络和 10Gbps 的万兆网络。

假设你公司的机房环境是千兆网络，即 1Gbps，现在你有个业务，其业务目标或 SLA 是在 1 小时内处理 1TB 的业务数据。那么问题来了，你到底需要多少台 Kafka 服务器来完成这个业务呢？

让我们来计算一下，由于带宽是 1Gbps，即每秒处理 1Gb 的数据，假设每台 Kafka 服务器都是安装在专属的机器上，也就是说每台 Kafka 机器上没有混部其他服务，毕竟真实环境中不建议这么做。通常情况下你只能假设 Kafka 会用到 70%的带宽资源，因为总要为其他应用或进程留一些资源。

根据实际使用经验，超过 70%的阈值就有网络丢包的可能性了，故 70%的设定是一个比较合理的值，也就是说单台 Kafka 服务器最多也就能使用大约 700Mb 的带宽资源。

稍等，这只是它能使用的最大带宽资源，你不能让 Kafka 服务器常规性使用这么多资源，故通常要再额外预留出 2/3 的资源，即单台服务器使用带宽 700Mb / 3 ≈ 240Mbps。需要提示的是，这里的 2/3 其实是相当保守的，你可以结合你自己机器的使用情况酌情减少此值。

好了，有了 240Mbps，我们就可以计算 1 小时内处理 1TB 数据所需的服务器数量了。根据这个目标，我们每秒需要处理 2336Mb 的数据，除以 240，约等于 10 台服务器。如果消息还需要额外复制两份，那么总的服务器台数还要乘以 3，即 30 台。

## 最最最重要的集群参数配置（上）

**与存储信息相关的参数**

- `log.dirs`：这是非常重要的参数，指定了 Broker 需要使用的若干个文件目录路径。要知道这个参数是没有默认值的，这说明什么？这说明它必须由你亲自指定。
- `log.dir`：注意这是 dir，结尾没有 s，说明它只能表示单个路径，它是补充上一个参数用的。

只要设置`log.dirs`，即第一个参数就好了，不要设置`log.dir`。而且更重要的是，在线上生产环境中一定要为`log.dirs`配置多个路径，具体格式是一个 CSV 格式，也就是用逗号分隔的多个路径，比如`/home/kafka1,/home/kafka2,/home/kafka3`这样。如果有条件的话你最好保证这些目录挂载到不同的物理磁盘上。这样做有两个好处：

- 提升读写性能：比起单块磁盘，多块物理磁盘同时读写数据有更高的吞吐量。
- 能够实现故障转移：即 Failover。这是 Kafka 1.1 版本新引入的强大功能。要知道在以前，只要 Kafka Broker 使用的任何一块磁盘挂掉了，整个 Broker 进程都会关闭。但是自 1.1 开始，这种情况被修正了，坏掉的磁盘上的数据会自动地转移到其他正常的磁盘上，而且 Broker 还能正常工作。还记得上一期我们关于 Kafka 是否需要使用 RAID 的讨论吗？这个改进正是我们舍弃 RAID 方案的基础：没有这种 Failover 的话，我们只能依靠 RAID 来提供保障。

**与 ZooKeeper 相关的参数**

`zookeeper.connect`。这也是一个 CSV 格式的参数，比如我可以指定它的值为`zk1:2181,zk2:2181,zk3:2181`。2181 是 ZooKeeper 的默认端口。

如果我让多个 Kafka 集群使用同一套 ZooKeeper 集群，那么这个参数应该怎么设置呢？这时候 chroot 就派上用场了。这个 chroot 是 ZooKeeper 的概念，类似于别名。

如果你有两套 Kafka 集群，假设分别叫它们 kafka1 和 kafka2，那么两套集群的`zookeeper.connect`参数可以这样指定：`zk1:2181,zk2:2181,zk3:2181/kafka1`和`zk1:2181,zk2:2181,zk3:2181/kafka2`。切记 chroot 只需要写一次，而且是加到最后的。我经常碰到有人这样指定：`zk1:2181/kafka1,zk2:2181/kafka2,zk3:2181/kafka3`，这样的格式是不对的。

**与 Broker 连接相关的参数**

- `listeners`：学名叫监听器，其实就是告诉外部连接者要通过什么协议访问指定主机名和端口开放的 Kafka 服务。
- `advertised.listeners`：和 listeners 相比多了个 advertised。Advertised 的含义表示宣称的、公布的，就是说这组监听器是 Broker 用于对外发布的。
- `host.name/port`：列出这两个参数就是想说你把它们忘掉吧，压根不要为它们指定值，毕竟都是过期的参数了。

**关于 Topic 管理的参数**

- `auto.create.topics.enable`：是否允许自动创建 Topic。
- `unclean.leader.election.enable`：是否允许 Unclean Leader 选举。
- `auto.leader.rebalance.enable`：是否允许定期进行 Leader 选举。

**关于数据留存的参数**

- `log.retention.{hours|minutes|ms}`：这是个“三兄弟”，都是控制一条消息数据被保存多长时间。从优先级上来说 ms 设置最高、minutes 次之、hours 最低。
- `log.retention.bytes`：这是指定 Broker 为消息保存的总磁盘容量大小。
- `message.max.bytes`：控制 Broker 能够接收的最大消息大小。

## 最最最重要的集群参数配置（下）

**Topic 级别参数**

- `retention.ms`：规定了该 Topic 消息被保存的时长。默认是 7 天，即该 Topic 只保存最近 7 天的消息。一旦设置了这个值，它会覆盖掉 Broker 端的全局参数值。
- `retention.bytes`：规定了要为该 Topic 预留多大的磁盘空间。和全局参数作用相似，这个值通常在多租户的 Kafka 集群中会有用武之地。当前默认值是-1，表示可以无限使用磁盘空间。

JVM 参数

- `KAFKA_HEAP_OPTS`：指定堆大小。
- `KAFKA_JVM_PERFORMANCE_OPTS`：指定 GC 参数。

操作系统参数

- 文件描述符限制 - 通常情况下将它设置成一个超大的值是合理的做法，比如`ulimit -n 1000000`。
- 文件系统类型 - 生产环境最好还是使用 XFS
- Swappiness - 建议将 swappniess 配置成一个接近 0 但不为 0 的值，比如 1。
- 提交时间

## 生产者消息分区机制原理剖析

Kafka 的消息组织方式实际上是三级结构：主题-分区-消息。主题下的每条消息只会保存在某一个分区中，而不会在多个分区中被保存多份。

分区是实现负载均衡以及高吞吐量的关键。

所谓分区策略，就是决定生产者将消息发送到哪个分区的算法。Kafka 提供了默认的分区策略，同时也支持自定义分区策略。

## 生产者压缩算法面面观

压缩秉承了用时间去换空间的思想。具体来说，就是用 CPU 时间去换磁盘空间或网络 I/O 传输量，希望以较小的 CPU 开销带来更少的磁盘占用或更少的网络 I/O 传输。

Kafka 压缩、解压流程：**Producer 端压缩、Broker 端保持、Consumer 端解压缩**。

每个压缩过的消息集合在 Broker 端写入时都要发生解压缩操作，目的就是为了对消息执行各种验证。

让 Broker 重新压缩消息的 2 种例外：Broker 端指定了和 Producer 端不同的压缩算法；Broker 发生了消息格式转换。

在 Kafka 2.1.0 版本之前，Kafka 支持 3 种压缩算法：GZIP、Snappy 和 LZ4。从 2.1.0 开始，Kafka 正式支持 Zstandard 算法（简写为 zstd）。

对于 Kafka 而言，它们的性能测试结果却出奇得一致：

- 在吞吐量方面：`LZ4 > Snappy > zstd 和 GZIP`；
- 在压缩比方面，`zstd > LZ4 > GZIP > Snappy`。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170735260.png)

## 无消息丢失配置怎么实现？

**Kafka 只对“已提交”的消息（committed message）做有限度的持久化保证。**

- 生产阶段使用异步回调方式发送消息，业务侧做好对于发送失败的容错处理。
  - 不要使用 `producer.send(msg)`，而要使用 `producer.send(msg, callback)`。记住，一定要使用带有回调通知的 `send` 方法。
  - 设置 `retries` 为一个较大的值。这里的 `retries` 同样是 Producer 的参数，对应前面提到的 Producer 自动重试。当出现网络的瞬时抖动时，消息发送可能会失败，此时配置了 `retries > 0` 的 Producer 能够自动重试消息发送，避免消息丢失。
- 存储阶段需要保证写入数据同步副本，以及可靠的故障恢复。
  - 设置 `acks = all`。`acks` 是 Producer 的一个参数，代表了你对“已提交”消息的定义。如果设置成 all，则表明所有副本 Broker 都要接收到消息，该消息才算是“已提交”。这是最高等级的“已提交”定义。
  - 设置 `unclean.leader.election.enable = false`。这是 Broker 端的参数，它控制的是哪些 Broker 有资格竞选分区的 Leader。如果一个 Broker 落后原先的 Leader 太多，那么它一旦成为新的 Leader，必然会造成消息的丢失。故一般都要将该参数设置成 false，即不允许这种情况的发生。
  - 设置 `replication.factor >= 3`。这也是 Broker 端的参数。其实这里想表述的是，最好将消息多保存几份，毕竟目前防止消息丢失的主要机制就是冗余。
  - 设置 `min.insync.replicas > 1`。这依然是 Broker 端参数，控制的是消息至少要被写入到多少个副本才算是“已提交”。设置成大于 1 可以提升消息持久性。在实际环境中千万不要使用默认值 1。
  - 确保 `replication.factor > min.insync.replicas`。如果两者相等，那么只要有一个副本挂机，整个分区就无法正常工作了。我们不仅要改善消息的持久性，防止数据丢失，还要在不降低可用性的基础上完成。推荐设置成 `replication.factor = min.insync.replicas + 1`。
- 消费阶段确保消息消费完成再提交。Consumer 端有个参数 `enable.auto.commit`，最好把它设置成 false，并采用手动提交位移的方式。就像前面说的，这对于单 Consumer 多线程处理的场景而言是至关重要的。

## 客户端都有哪些不常见但是很高级的功能？

拦截器基本思想就是允许应用程序在不修改逻辑的情况下，动态地实现一组可插拔的事件处理逻辑链。它能够在主业务操作的前后多个时间点上插入对应的“拦截”逻辑。

**Kafka 拦截器分为生产者拦截器和消费者拦截器**。生产者拦截器允许你在发送消息前以及消息提交成功后植入你的拦截器逻辑；而消费者拦截器支持在消费消息前以及提交位移后编写特定逻辑。**指定拦截器类时要指定它们的全限定名**。

**Kafka 拦截器可以应用于包括客户端监控、端到端系统性能检测、消息审计等多种功能在内的场景**。

## Java 生产者是如何管理 TCP 连接的？

开发客户端时，能够利用 TCP 本身提供的一些高级功能，比如多路复用请求以及同时轮询多个连接的能力。

对最新版本的 Kafka（2.1.0）而言，Java Producer 端管理 TCP 连接的方式是：

1. KafkaProducer 实例创建时启动 Sender 线程，从而创建与 bootstrap.servers 中所有 Broker 的 TCP 连接。
   - **不需要把集群中所有的 Broker 信息都配置到 bootstrap.servers 中**，通常你指定 3～4 台就足以了。因为 Producer 一旦连接到集群中的任一台 Broker，就能拿到整个集群的 Broker 信息，故没必要为 bootstrap.servers 指定所有的 Broker。
2. **TCP 连接还可能在两个地方被创建：一个是在更新元数据后，另一个是在消息发送时**。
   1. KafkaProducer 实例首次更新元数据信息之后，还会再次创建与集群中所有 Broker 的 TCP 连接。
   2. 如果 Producer 端发送消息到某台 Broker 时发现没有与该 Broker 的 TCP 连接，那么也会立即创建连接。
3. Producer 端关闭 TCP 连接的方式有两种：**一种是用户主动关闭；一种是 Kafka 自动关闭**。如果设置 Producer 端 connections.max.idle.ms 参数大于 0，则步骤 1 中创建的 TCP 连接会被自动关闭；如果设置该参数=-1，那么步骤 1 中创建的 TCP 连接将无法被关闭，从而成为“僵尸”连接。

## 幂等生产者和事务生产者是一回事吗？

消息可靠性保证有以下几种：

- 最多一次（at most once）：消息可能会丢失，但绝不会被重复发送。
- 至少一次（at least once）：消息不会丢失，但有可能被重复发送。
- 精确一次（exactly once）：消息不会丢失，也不会被重复发送。

大部分 MQ 都支持 at least once，要实现 exactly once，需要消费方保证，通常是通过幂等性设计来实现。

Kafka 也提供了一些相关的功能：

幂等性 Producer 只能保证单分区上的幂等性，同时也只能实现单会话上的幂等性。

事务型 Producer 能够保证将消息原子性地写入到多个分区中，而且不惧进程的重启。

## 消费者组到底是什么？

**Consumer Group 是 Kafka 提供的可扩展且具有容错性的消费者机制**。

Consumer Group 特性：

- Consumer Group 下可以有一个或多个 Consumer 实例。这里的实例可以是一个单独的进程，也可以是同一进程下的线程。在实际场景中，使用进程更为常见一些。
- Group ID 是一个字符串，在一个 Kafka 集群中，它标识唯一的一个 Consumer Group。
- Consumer Group 下所有实例订阅的主题的单个分区，只能分配给组内的某个 Consumer 实例消费。这个分区当然也可以被其他的 Group 消费。

**Kafka 仅仅使用 Consumer Group 这一种机制，却同时实现了传统消息引擎系统的两大模型**：如果所有实例都属于同一个 Group，那么它实现的就是消息队列模型；如果所有实例分别属于不同的 Group，那么它实现的就是发布/订阅模型。

**理想情况下，Consumer 实例的数量应该等于该 Group 订阅主题的分区总数。**

分区再均衡**规定了一个 Consumer Group 下的所有 Consumer 如何达成一致，来分配订阅 Topic 的每个分区**。

Rebalance 的触发条件：

1. 组成员数发生变更。
2. 订阅主题数发生变更。
3. 订阅主题的分区数发生变更。

Rebalance 的问题：

- 在 Rebalance 过程中，所有 Consumer 实例都会停止消费，等待 Rebalance 完成。
- Rebalance 的设计是所有 Consumer 实例共同参与，全部重新分配所有分区。其实更高效的做法是尽量减少分配方案的变动。
- Rebalance 实在是太慢了。

最好的解决方案就是避免 Rebalance 的发生吧。

## 揭开神秘的“位移主题”面纱

**consumer_offsets 在 Kafka 源码中有个更为正式的名字，叫位移主题，即 Offsets Topic。**

老版本 Consumer 的位移管理是依托于 Apache ZooKeeper 的，它会自动或手动地将位移数据提交到 ZooKeeper 中保存。当 Consumer 重启后，它能自动从 ZooKeeper 中读取位移数据，从而在上次消费截止的地方继续消费。这种设计使得 Kafka Broker 不需要保存位移数据，减少了 Broker 端需要持有的状态空间，因而有利于实现高伸缩性。但是，**ZooKeeper 其实并不适用于这种高频的写操作**。

新版本 Consumer 的位移管理机制其实也很简单，就是**将 Consumer 的位移数据作为一条条普通的 Kafka 消息，提交到 consumer_offsets 中。可以这么说，consumer_offsets 的主要作用是保存 Kafka 消费者的位移信息。**它要求这个提交过程不仅要实现高持久性，还要支持高频的写操作。显然，Kafka 的主题设计天然就满足这两个条件，因此，使用 Kafka 主题来保存位移这件事情，实际上就是一个水到渠成的想法了。

虽说位移主题是一个普通的 Kafka 主题，但**它的消息格式却是 Kafka 自己定义的**，不能随意地向这个主题写消息。

**当 Kafka 集群中的第一个 Consumer 程序启动时，Kafka 会自动创建位移主题**。

Kafka 使用** Compact 策略**来删除位移主题中的过期消息，避免该主题无限期膨胀。

## 消费者组重平衡能避免吗？

Rebalance 就是让一个 Consumer Group 下所有的 Consumer 实例就如何消费订阅主题的所有分区达成共识的过程。在 Rebalance 过程中，所有 Consumer 实例共同参与，在协调者组件的帮助下，完成订阅主题分区的分配。

Consumer 端应用程序在提交位移时，其实是向 Coordinator 所在的 Broker 提交位移。

**第一类非必要 Rebalance 是因为未能及时发送心跳，导致 Consumer 被“踢出”Group 而引发的**。

- 设置 session.timeout.ms = 6s。
- 设置 heartbeat.interval.ms = 2s。
- 要保证 Consumer 实例在被判定为“dead”之前，能够发送至少 3 轮的心跳请求，即 session.timeout.ms >= 3 \* heartbeat.interval.ms。

**第二类非必要 Rebalance 是 Consumer 消费时间过长导致的**。

**max.poll.interval.ms** 参数值要大于下游最大处理时间。

## Kafka 中位移提交那些事儿

**Consumer 需要向 Kafka 汇报自己的位移数据，这个汇报过程被称为提交位移**（Committing Offsets）。因为 Consumer 能够同时消费多个分区的数据，所以位移的提交实际上是在分区粒度上进行的，即** Consumer 需要为分配给它的每个分区提交各自的位移数据**。

位移提交分为自动提交和手动提交，而手动提交又分为同步提交和异步提交。

## CommitFailedException 异常怎么处理？

**CommitFailedException，就是 Consumer 客户端在提交位移时出现了错误或异常，而且还是那种不可恢复的严重异常**。

CommitFailedException 最常见的场景：当消息处理的总时间超过预设的 max.poll.interval.ms 参数值时，Kafka Consumer 端会抛出 CommitFailedException 异常。

## 多线程开发消费者实例

**消费者程序启动多个线程，每个线程维护专属的 KafkaConsumer 实例，负责完整的消息获取、消息处理流程**。如下图所示：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170735535.jpeg)

**消费者程序使用单或多线程获取消息，同时创建多个消费线程执行消息处理逻辑**。获取消息的线程可以是一个，也可以是多个，每个线程维护专属的 KafkaConsumer 实例，处理消息则交由**特定的线程池**来做，从而实现消息获取与消息处理的真正解耦。具体架构如下图所示：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170735276.jpeg)

方案对比：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170735905.jpeg)

## Java 消费者是如何管理 TCP 连接的

**和生产者不同的是，构建 KafkaConsumer 实例时是不会创建任何 TCP 连接的**。

**TCP 连接是在调用 KafkaConsumer.poll 方法时被创建的**。再细粒度地说，在 poll 方法内部有 3 个时机可以创建 TCP 连接。

- 发起 FindCoordinator 请求时
- 连接协调者时
- 消费数据时

消费者程序会创建 3 类 TCP 连接：

- 确定协调者和获取集群元数据
- 连接协调者，令其执行组成员管理操作
- 执行实际的消息获取

## 消费者组消费进度监控都怎么实现？

对于 Kafka 消费者来说，最重要的事情就是监控它们的消费进度了，或者说是监控它们消费的滞后程度。**所谓滞后程度，就是指消费者当前落后于生产者的程度**。

监控消费者组以及独立消费者程序消费进度的 3 种方法：

1. 使用 Kafka 自带的命令行工具 kafka-consumer-groups 脚本
2. 使用 Kafka Java Consumer API 编程
3. 使用 Kafka 自带的 JMX 监控指标

## Kafka 副本机制详解

### 副本

副本机制好处：

1. **提供数据冗余**。即使系统部分组件失效，系统依然能够继续运转，因而增加了整体可用性以及数据持久性。
2. **提供高伸缩性**。支持横向扩展，能够通过增加机器的方式来提升读性能，进而提高读操作吞吐量。
3. **改善数据局部性**。允许将数据放入与用户地理位置相近的地方，从而降低系统延时。

**所谓副本（Replica），本质就是一个只能追加写消息的提交日志**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170736678.jpeg)

基于领导者的副本机制

在 Kafka 中，副本分成两类：领导者副本（Leader Replica）和追随者副本（Follower Replica）。每个分区在创建时都要选举一个副本，称为领导者副本，其余的副本自动称为追随者副本。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170736956.jpeg)

### In-sync Replicas（ISR）

追随者副本不提供服务，只是定期地异步拉取领导者副本中的数据而已。

Kafka 引入了 In-sync Replicas（ISR）机制来明确追随者副本到底在什么条件下才算与 Leader 同步。

**ISR 不只是追随者副本集合，它必然包括 Leader 副本。甚至在某些情况下，ISR 只有 Leader 这一个副本**。

**Broker 端参数 replica.lag.time.max.ms** 用于配置 Follower 副本能够落后 Leader 副本的最长时间间隔，当前默认值是 10 秒。这就是说，只要一个 Follower 副本落后 Leader 副本的时间不连续超过 10 秒，那么 Kafka 就认为该 Follower 副本与 Leader 是同步的，即使此时 Follower 副本中保存的消息明显少于 Leader 副本中的消息。

### Unclean 领导者选举（Unclean Leader Election）

因为 Leader 副本天然就在 ISR 中，如果 ISR 为空了，就说明 Leader 副本也“挂掉”了，Kafka 需要重新选举一个新的 Leader。**Broker 端参数 unclean.leader.election.enable 控制是否允许 Unclean 领导者选举**。

开启 Unclean 领导者选举可能会造成数据丢失，但好处是，它使得分区 Leader 副本一直存在，不至于停止对外提供服务，因此提升了高可用性。反之，禁止 Unclean 领导者选举的好处在于维护了数据的一致性，避免了消息丢失，但牺牲了高可用性。

**Kafka 把所有不在 ISR 中的存活副本都称为非同步副本**。

## 请求是怎么被处理的？

Kafka 所有的请求都是通过 TCP 网络以 Socket 的方式进行通讯的。

**Reactor 模式是事件驱动架构的一种实现方式，特别适合应用于处理多个客户端并发向服务器端发送请求的场景**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170736577.jpeg)

Kafka 采用了类 Reactor 架构

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170736471.jpeg)

Acceptor 线程采用轮询的方式将入站请求公平地发到所有网络线程中，因此，在实际使用过程中，这些线程通常都有相同的几率被分配到待处理请求。

当网络线程拿到请求后，将请求放入到一个共享请求队列中。Broker 端还有个 IO 线程池，负责从该队列中取出请求，执行真正的处理。如果是 PRODUCE 生产请求，则将消息写入到底层的磁盘日志中；如果是 FETCH 请求，则从磁盘或页缓存中读取消息。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170736893.jpeg)

Purgatory 是用来**缓存延时请求**（Delayed Request）的。**所谓延时请求，就是那些一时未满足条件不能立刻处理的请求**。比如设置了 acks=all 的 PRODUCE 请求，一旦设置了 acks=all，那么该请求就必须等待 ISR 中所有副本都接收了消息后才能返回，此时处理该请求的 IO 线程就必须等待其他 Broker 的写入结果。当请求不能立刻处理时，它就会暂存在 Purgatory 中。稍后一旦满足了完成条件，IO 线程会继续处理该请求，并将 Response 放入对应网络线程的响应队列中。

## 消费者组重平衡全流程解析

重平衡的 3 个触发条件：

1. 组成员数量发生变化。
2. 订阅主题数量发生变化。
3. 订阅主题的分区数发生变化。

消费者端重平衡流程：

Rebalance 是通过消费者群组中的称为“群主”消费者客户端进行的\*\*。

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

## 你一定不能错过的 Kafka 控制器

**控制器组件（Controller），是 Apache Kafka 的核心组件。它的主要作用是在 Apache ZooKeeper 的帮助下管理和协调整个 Kafka 集群**。每台 Broker 都能充当控制器，**第一个成功创建 `/controller` 节点的 Broker 会被指定为控制器**。

**ZooKeeper 是一个提供高可靠性的分布式协调服务框架**。ZooKeeper 常被用来实现**集群成员管理、分布式锁、领导者选举**等功能。Kafka 控制器大量使用 Watch 功能实现对集群的协调管理。

下图展示了 Kafka 在 ZooKeeper 中创建的 znode 分布：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170738496.jpeg)

控制器的职责：

- **主题管理（创建、删除、增加分区）**
- **分区重分配**
- **Preferred 领导者选举**
- **集群成员管理（新增 Broker、Broker 主动关闭、Broker 宕机）**
- **数据服务**

控制器保存的数据：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170738150.jpeg)

控制器故障转移

**故障转移指的是，当运行中的控制器突然宕机或意外终止时，Kafka 能够快速地感知到，并立即启用备用控制器来代替之前失败的控制器**。这个过程就被称为 Failover，该过程是自动完成的，无需你手动干预。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170739678.jpeg)

## 关于高水位和 Leader Epoch 的讨论

水位一词多用于流式处理领域，比如，Spark Streaming 或 Flink 框架中都有水位的概念。

水位是一个单调增加且表征最早未完成工作（oldest work not yet completed）的时间戳。

### 高水位的作用

在 Kafka 中，高水位的作用主要有 2 个。

- 定义消息可见性，即用来标识分区下的哪些消息是可以被消费者消费的。
  - 在分区高水位以下的消息被认为是已提交消息，反之就是未提交消息。消费者只能消费已提交消息。
  - **同一个副本对象，其高水位值不会大于 LEO 值**。
  - **分区的高水位就是其 Leader 副本的高水位**。
- 帮助 Kafka 完成副本同步。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170739112.jpeg)

### 高水位更新机制

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170740521.jpeg)

Broker 0 上保存了某分区的 Leader 副本和所有 Follower 副本的 LEO 值，而 Broker 1 上仅仅保存了该分区的某个 Follower 副本。Kafka 把 Broker 0 上保存的这些 Follower 副本又称为**远程副本**（Remote Replica）。Kafka 副本机制在运行过程中，会更新 Broker 1 上 Follower 副本的高水位和 LEO 值，同时也会更新 Broker 0 上 Leader 副本的高水位和 LEO 以及所有远程副本的 LEO，但它不会更新远程副本的高水位值，也就是我在图中标记为灰色的部分。

为什么要在 Broker 0 上保存这些远程副本呢？其实，它们的主要作用是，**帮助 Leader 副本确定其高水位，也就是分区高水位**。

### 副本同步机制解析

首先是初始状态。下面这张图中的 remote LEO 就是刚才的远程副本的 LEO 值。在初始状态时，所有值都是 0。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170740419.jpeg)

当生产者给主题分区发送一条消息后，状态变更为：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170741966.jpeg)

此时，Leader 副本成功将消息写入了本地磁盘，故 LEO 值被更新为 1。

Follower 再次尝试从 Leader 拉取消息。和之前不同的是，这次有消息可以拉取了，因此状态进一步变更为：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170741603.jpeg)

这时，Follower 副本也成功地更新 LEO 为 1。此时，Leader 和 Follower 副本的 LEO 都是 1，但各自的高水位依然是 0，还没有被更新。**它们需要在下一轮的拉取中被更新**，如下图所示：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502170741850.jpeg)

在新一轮的拉取请求中，由于位移值是 0 的消息已经拉取成功，因此 Follower 副本这次请求拉取的是位移值=1 的消息。Leader 副本接收到此请求后，更新远程副本 LEO 为 1，然后更新 Leader 高水位为 1。做完这些之后，它会将当前已更新过的高水位值 1 发送给 Follower 副本。Follower 副本接收到以后，也将自己的高水位值更新成 1。至此，一次完整的消息同步周期就结束了。事实上，Kafka 就是利用这样的机制，实现了 Leader 和 Follower 副本之间的同步。

### Leader Epoch

所谓 Leader Epoch，我们大致可以认为是 Leader 版本。它由两部分数据组成。

1. Epoch。一个单调增加的版本号。每当副本领导权发生变更时，都会增加该版本号。小版本号的 Leader 被认为是过期 Leader，不能再行使 Leader 权力。
2. 起始位移（Start Offset）。Leader 副本在该 Epoch 值上写入的首条消息的位移。

## 主题管理知多少

**Kafka 提供了自带的 kafka-topics 脚本，用于帮助用户创建主题**。

特殊主题：

- consumer_offsets
- transaction_state

## Kafka 动态配置了解下？

略

## 怎么重设消费者组位移？

略

## 常见工具脚本大汇总

略

## KafkaAdminClient：Kafka 的运维利器

略

## Kafka 认证机制用哪家？

略

## 云环境下的授权该怎么做？

略

## 跨集群备份解决方案 MirrorMaker

略

## 你应该怎么监控 Kafka？

略

## 主流的 Kafka 监控框架

略

## 调优 Kafka，你做到了吗？

略

## 从 0 搭建基于 Kafka 的企业级实时日志流处理平台

略

## Kafka Streams 与其他流处理平台的差异在哪里？

略

## Kafka Streams DSL 开发实例

略

## Kafka Streams 在金融领域的应用

略

## 参考资料

- [**极客时间教程 - Kafka 核心技术与实战**](https://time.geekbang.org/column/intro/100029201)
