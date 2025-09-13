---
icon: logos:kafka-icon
title: Kafka 运维
date: 2020-06-03 09:55:35
categories:
  - 分布式
  - 分布式通信
  - MQ
  - Kafka
tags:
  - mq
  - kafka
permalink: /pages/233a08bf/
---

# Kafka 运维

> 环境要求：
>
> - JDK8
> - ZooKeeper

## Kafka 单点部署

### 下载解压

进入官方下载地址：<http://kafka.apache.org/downloads，选择合适版本。>

解压到本地：

```shell
tar -xzf kafka_2.11-1.1.0.tgz
cd kafka_2.11-1.1.0
```

现在您已经在您的机器上下载了最新版本的 Kafka。

### 启动服务器

由于 Kafka 依赖于 ZooKeeper，所以运行前需要先启动 ZooKeeper

```shell
$ bin/zookeeper-server-start.sh config/zookeeper.properties
[2013-04-22 15:01:37,495] INFO Reading configuration from: config/zookeeper.properties (org.apache.zookeeper.server.quorum.QuorumPeerConfig)
...
```

然后，启动 Kafka

```shell
$ bin/kafka-server-start.sh config/server.properties
[2013-04-22 15:01:47,028] INFO Verifying properties (kafka.utils.VerifiableProperties)
[2013-04-22 15:01:47,051] INFO Property socket.send.buffer.bytes is overridden to 1048576 (kafka.utils.VerifiableProperties)
...
```

### 停止服务器

执行所有操作后，可以使用以下命令停止服务器

```shell
bin/kafka-server-stop.sh config/server.properties
```

## Kafka 集群部署

### 修改配置

复制配置为多份（Windows 使用 copy 命令代理）：

```shell
cp config/server.properties config/server-1.properties
cp config/server.properties config/server-2.properties
```

修改配置：

```properties
config/server-1.properties:
broker.id=1
listeners=PLAINTEXT://:9093
log.dir=/tmp/kafka-logs-1

config/server-2.properties:
broker.id=2
listeners=PLAINTEXT://:9094
log.dir=/tmp/kafka-logs-2
```

其中，broker.id 这个参数必须是唯一的。

端口故意配置的不一致，是为了可以在一台机器启动多个应用节点。

### 启动

根据这两份配置启动三个服务器节点：

```shell
$ bin/kafka-server-start.sh config/server.properties &
...
$ bin/kafka-server-start.sh config/server-1.properties &
...
$ bin/kafka-server-start.sh config/server-2.properties &
...
```

创建一个新的 Topic 使用 三个备份：

```shell
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 3 --partitions 1 --topic my-replicated-topic
```

查看主题：

```shell
$ bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic my-replicated-topic
Topic:my-replicated-topic   PartitionCount:1    ReplicationFactor:3 Configs:
    Topic: my-replicated-topic  Partition: 0    Leader: 1   Replicas: 1,2,0 Isr: 1,2,0
```

- leader - 负责指定分区的所有读取和写入的节点。每个节点将成为随机选择的分区部分的领导者。
- replicas - 是复制此分区日志的节点列表，无论它们是否为领导者，或者即使它们当前处于活动状态。
- isr - 是“同步”复制品的集合。这是副本列表的子集，该列表当前处于活跃状态并且已经被领导者捕获。

## Kafka 命令

### 主题（Topic）

#### 创建 Topic

```shell
kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 3 --topic my-topic
```

#### 查看 Topic 列表

```shell
kafka-topics --list --zookeeper localhost:2181
```

#### 添加 Partition

```shell
kafka-topics --zookeeper localhost:2181 --alter --topic my-topic --partitions 16
```

#### 删除 Topic

```shell
kafka-topics --zookeeper localhost:2181 --delete --topic my-topic
```

#### 查看 Topic 详细信息

```shell
kafka-topics --zookeeper localhost:2181/kafka-cluster --describe
```

#### 查看备份分区

```shell
kafka-topics --zookeeper localhost:2181/kafka-cluster --describe --under-replicated-partitions
```

### 生产者（Producers）

#### 通过控制台输入生产消息

```shell
kafka-console-producer --broker-list localhost:9092 --topic my-topic
```

#### 通过文件输入生产消息

```shell
kafka-console-producer --broker-list localhost:9092 --topic test < messages.txt
```

#### 通过控制台输入 Avro 生产消息

```shell
kafka-avro-console-producer --broker-list localhost:9092 --topic my.Topic --property value.schema='{"type":"record","name":"myrecord","fields":[{"name":"f1","type":"string"}]}' --property schema.registry.url=http://localhost:8081
```

然后，可以选择输入部分 json key：

```json
{ "f1": "value1" }
```

#### 生成消息性能测试

```shell
kafka-producer-perf-test --topic position-reports --throughput 10000 --record-size 300 --num-records 20000 --producer-props bootstrap.servers="localhost:9092"
```

### 消费者（Consumers）

#### 消费所有未消费的消息

```shell
kafka-console-consumer --bootstrap-server localhost:9092 --topic my-topic --from-beginning
```

#### 消费一条消息

```shell
kafka-console-consumer --bootstrap-server localhost:9092 --topic my-topic  --max-messages 1
```

#### 从指定的 offset 消费一条消息

从指定的 offset `__consumer_offsets` 消费一条消息：

```shell
kafka-console-consumer --bootstrap-server localhost:9092 --topic __consumer_offsets --formatter 'kafka.coordinator.GroupMetadataManager$OffsetsMessageFormatter' --max-messages 1
```

#### 从指定 Group 消费消息

```shell
kafka-console-consumer --topic my-topic --new-consumer --bootstrap-server localhost:9092 --consumer-property group.id=my-group
```

#### 消费 avro 消息

```shell
kafka-avro-console-consumer --topic position-reports --new-consumer --bootstrap-server localhost:9092 --from-beginning --property schema.registry.url=localhost:8081 --max-messages 10
```

```shell
kafka-avro-console-consumer --topic position-reports --new-consumer --bootstrap-server localhost:9092 --from-beginning --property schema.registry.url=localhost:8081
```

#### 查看消费者 Group 列表

```shell
kafka-consumer-groups --new-consumer --list --bootstrap-server localhost:9092
```

#### 查看消费者 Group 详细信息

```shell
kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group testgroup
```

### 配置（Config）

#### 设置 Topic 的保留时间

```shell
kafka-configs --zookeeper localhost:2181 --alter --entity-type topics --entity-name my-topic --add-config retention.ms=3600000
```

#### 查看 Topic 的所有配置

```shell
kafka-configs --zookeeper localhost:2181 --describe --entity-type topics --entity-name my-topic
```

#### 修改 Topic 的配置

```shell
kafka-configs --zookeeper localhost:2181 --alter --entity-type topics --entity-name my-topic --delete-config retention.ms
```

### ACL

#### 查看指定 Topic 的 ACL

```shell
kafka-acls --authorizer-properties zookeeper.connect=localhost:2181 --list --topic topicA
```

#### 添加 ACL

```shell
kafka-acls --authorizer-properties zookeeper.connect=localhost:2181 --add --allow-principal User:Bob --consumer --topic topicA --group groupA
```

```shell
kafka-acls --authorizer-properties zookeeper.connect=localhost:2181 --add --allow-principal User:Bob --producer --topic topicA
```

### ZooKeeper

```shell
zookeeper-shell localhost:2182 ls /
```

## Kafka 工具

- **[kafka-manager](https://github.com/yahoo/kafka-manager)**
- **[KafkaOffsetMonitor](https://github.com/quantifind/KafkaOffsetMonitor)**

## Kafka 核心配置

### Broker 级别配置

#### 存储配置

首先 Broker 是需要配置存储信息的，即 Broker 使用哪些磁盘。那么针对存储信息的重要参数有以下这么几个：

- `log.dirs`：指定了 Broker 需要使用的若干个文件目录路径。这个参数是没有默认值的，必须由使用者亲自指定。
- `log.dir`：注意这是 dir，结尾没有 s，说明它只能表示单个路径，它是补充上一个参数用的。

`log.dirs` 具体格式是一个 CSV 格式，也就是用逗号分隔的多个路径，比如`/home/kafka1,/home/kafka2,/home/kafka3`这样。如果有条件的话你最好保证这些目录挂载到不同的物理磁盘上。这样做有两个好处：

- 提升读写性能：比起单块磁盘，多块物理磁盘同时读写数据有更高的吞吐量。
- 能够实现故障转移：即 Failover。这是 Kafka 1.1 版本新引入的强大功能。要知道在以前，只要 Kafka Broker 使用的任何一块磁盘挂掉了，整个 Broker 进程都会关闭。但是自 1.1 开始，这种情况被修正了，坏掉的磁盘上的数据会自动地转移到其他正常的磁盘上，而且 Broker 还能正常工作。

#### zookeeper 配置

Kafka 与 ZooKeeper 相关的最重要的参数当属 `zookeeper.connect`。这也是一个 CSV 格式的参数，比如我可以指定它的值为`zk1:2181,zk2:2181,zk3:2181`。2181 是 ZooKeeper 的默认端口。

现在问题来了，如果我让多个 Kafka 集群使用同一套 ZooKeeper 集群，那么这个参数应该怎么设置呢？这时候 chroot 就派上用场了。这个 chroot 是 ZooKeeper 的概念，类似于别名。

如果你有两套 Kafka 集群，假设分别叫它们 kafka1 和 kafka2，那么两套集群的`zookeeper.connect`参数可以这样指定：`zk1:2181,zk2:2181,zk3:2181/kafka1`和`zk1:2181,zk2:2181,zk3:2181/kafka2`。切记 chroot 只需要写一次，而且是加到最后的。我经常碰到有人这样指定：`zk1:2181/kafka1,zk2:2181/kafka2,zk3:2181/kafka3`，这样的格式是不对的。

#### Broker 连接配置

- `listeners`：告诉外部连接者要通过什么协议访问指定主机名和端口开放的 Kafka 服务。
- `advertised.listeners`：和 listeners 相比多了个 advertised。Advertised 的含义表示宣称的、公布的，就是说这组监听器是 Broker 用于对外发布的。
- `host.name/port`：列出这两个参数就是想说你把它们忘掉吧，压根不要为它们指定值，毕竟都是过期的参数了。

我们具体说说监听器的概念，从构成上来说，它是若干个逗号分隔的三元组，每个三元组的格式为`<协议名称，主机名，端口号>`。这里的协议名称可能是标准的名字，比如 PLAINTEXT 表示明文传输、SSL 表示使用 SSL 或 TLS 加密传输等；也可能是你自己定义的协议名字，比如`CONTROLLER: //localhost:9092`。

**最好全部使用主机名，即 Broker 端和 Client 端应用配置中全部填写主机名。**

#### Topic 管理

- `auto.create.topics.enable`：是否允许自动创建 Topic。一般设为 false，由运维把控创建 Topic。
- `unclean.leader.election.enable`：是否允许 Unclean Leader 选举。
- `auto.leader.rebalance.enable`：是否允许定期进行 Leader 选举。

第二个参数`unclean.leader.election.enable`是关闭 Unclean Leader 选举的。何谓 Unclean？还记得 Kafka 有多个副本这件事吗？每个分区都有多个副本来提供高可用。在这些副本中只能有一个副本对外提供服务，即所谓的 Leader 副本。

那么问题来了，这些副本都有资格竞争 Leader 吗？显然不是，只有保存数据比较多的那些副本才有资格竞选，那些落后进度太多的副本没资格做这件事。

好了，现在出现这种情况了：假设那些保存数据比较多的副本都挂了怎么办？我们还要不要进行 Leader 选举了？此时这个参数就派上用场了。

如果设置成 false，那么就坚持之前的原则，坚决不能让那些落后太多的副本竞选 Leader。这样做的后果是这个分区就不可用了，因为没有 Leader 了。反之如果是 true，那么 Kafka 允许你从那些“跑得慢”的副本中选一个出来当 Leader。这样做的后果是数据有可能就丢失了，因为这些副本保存的数据本来就不全，当了 Leader 之后它本人就变得膨胀了，认为自己的数据才是权威的。

这个参数在最新版的 Kafka 中默认就是 false，本来不需要我特意提的，但是比较搞笑的是社区对这个参数的默认值来来回回改了好几版了，鉴于我不知道你用的是哪个版本的 Kafka，所以建议你还是显式地把它设置成 false 吧。

第三个参数`auto.leader.rebalance.enable`的影响貌似没什么人提，但其实对生产环境影响非常大。设置它的值为 true 表示允许 Kafka 定期地对一些 Topic 分区进行 Leader 重选举，当然这个重选举不是无脑进行的，它要满足一定的条件才会发生。严格来说它与上一个参数中 Leader 选举的最大不同在于，它不是选 Leader，而是换 Leader！比如 Leader A 一直表现得很好，但若`auto.leader.rebalance.enable=true`，那么有可能一段时间后 Leader A 就要被强行卸任换成 Leader B。

你要知道换一次 Leader 代价很高的，原本向 A 发送请求的所有客户端都要切换成向 B 发送请求，而且这种换 Leader 本质上没有任何性能收益，因此我建议你在生产环境中把这个参数设置成 false。

#### 数据留存

- `log.retention.{hour|minutes|ms}`：都是控制一条消息数据被保存多长时间。从优先级上来说 ms 设置最高、minutes 次之、hour 最低。通常情况下我们还是设置 hour 级别的多一些，比如`log.retention.hour=168`表示默认保存 7 天的数据，自动删除 7 天前的数据。很多公司把 Kafka 当做存储来使用，那么这个值就要相应地调大。
- `log.retention.bytes`：这是指定 Broker 为消息保存的总磁盘容量大小。这个值默认是 -1，表明你想在这台 Broker 上保存多少数据都可以，至少在容量方面 Broker 绝对为你开绿灯，不会做任何阻拦。这个参数真正发挥作用的场景其实是在云上构建多租户的 Kafka 集群：设想你要做一个云上的 Kafka 服务，每个租户只能使用 100GB 的磁盘空间，为了避免有个“恶意”租户使用过多的磁盘空间，设置这个参数就显得至关重要了。
- `message.max.bytes`：控制 Broker 能够接收的最大消息大小。默认的 1000012 太少了，还不到 1MB。实际场景中突破 1MB 的消息都是屡见不鲜的，因此在线上环境中设置一个比较大的值还是比较保险的做法。毕竟它只是一个标尺而已，仅仅衡量 Broker 能够处理的最大消息大小，即使设置大一点也不会耗费什么磁盘空间的。

### Topic 级别配置

- `retention.ms`：规定了该 Topic 消息被保存的时长。默认是 7 天，即该 Topic 只保存最近 7 天的消息。一旦设置了这个值，它会覆盖掉 Broker 端的全局参数值。
- `retention.bytes`：规定了要为该 Topic 预留多大的磁盘空间。和全局参数作用相似，这个值通常在多租户的 Kafka 集群中会有用武之地。当前默认值是 -1，表示可以无限使用磁盘空间。

### 操作系统参数

- 文件描述符限制
- 文件系统类型
- Swappiness
- 提交时间

文件描述符系统资源并不像我们想象的那样昂贵，你不用太担心调大此值会有什么不利的影响。通常情况下将它设置成一个超大的值是合理的做法，比如`ulimit -n 1000000`。其实设置这个参数一点都不重要，但不设置的话后果很严重，比如你会经常看到“Too many open files”的错误。

其次是文件系统类型的选择。这里所说的文件系统指的是如 ext3、ext4 或 XFS 这样的日志型文件系统。根据官网的测试报告，XFS 的性能要强于 ext4，所以生产环境最好还是使用 XFS。对了，最近有个 Kafka 使用 ZFS 的[数据报告](https://www.confluent.io/kafka-summit-sf18/kafka-on-zfs)，貌似性能更加强劲，有条件的话不妨一试。

第三是 swap 的调优。网上很多文章都提到设置其为 0，将 swap 完全禁掉以防止 Kafka 进程使用 swap 空间。我个人反倒觉得还是不要设置成 0 比较好，我们可以设置成一个较小的值。为什么呢？因为一旦设置成 0，当物理内存耗尽时，操作系统会触发 OOM killer 这个组件，它会随机挑选一个进程然后 kill 掉，即根本不给用户任何的预警。但如果设置成一个比较小的值，当开始使用 swap 空间时，你至少能够观测到 Broker 性能开始出现急剧下降，从而给你进一步调优和诊断问题的时间。基于这个考虑，我个人建议将 swappniess 配置成一个接近 0 但不为 0 的值，比如 1。

最后是提交时间或者说是 Flush 落盘时间。向 Kafka 发送数据并不是真要等数据被写入磁盘才会认为成功，而是只要数据被写入到操作系统的页缓存（Page Cache）上就可以了，随后操作系统根据 LRU 算法会定期将页缓存上的“脏”数据落盘到物理磁盘上。这个定期就是由提交时间来确定的，默认是 5 秒。一般情况下我们会认为这个时间太频繁了，可以适当地增加提交间隔来降低物理磁盘的写操作。当然你可能会有这样的疑问：如果在页缓存中的数据在写入到磁盘前机器宕机了，那岂不是数据就丢失了。的确，这种情况数据确实就丢失了，但鉴于 Kafka 在软件层面已经提供了多副本的冗余机制，因此这里稍微拉大提交间隔去换取性能还是一个合理的做法。

## Kafka 集群规划

### 操作系统

部署生产环境的 Kafka，强烈建议操作系统选用 Linux。

**在 Linux 部署 Kafka 能够享受到零拷贝技术所带来的快速数据传输特性。**

**Windows 平台上部署 Kafka 只适合于个人测试或用于功能验证，千万不要应用于生产环境。**

### 磁盘

Kafka 集群部署选择普通的机械磁盘还是固态硬盘？前者成本低且容量大，但易损坏；后者性能优势大，不过单价高。

结论是：**使用普通机械硬盘即可**。

Kafka 采用顺序读写操作，一定程度上规避了机械磁盘最大的劣势，即随机读写操作慢。从这一点上来说，使用 SSD 似乎并没有太大的性能优势，毕竟从性价比上来说，机械磁盘物美价廉，而它因易损坏而造成的可靠性差等缺陷，又由 Kafka 在软件层面提供机制来保证，故使用普通机械磁盘是很划算的。

### 带宽

大部分公司使用普通的以太网络，千兆网络（1Gbps）应该是网络的标准配置。

通常情况下你只能假设 Kafka 会用到 70% 的带宽资源，因为总要为其他应用或进程留一些资源。此外，通常要再额外预留出 2/3 的资源，因为不能让带宽资源总是保持在峰值。

基于以上原因，一个 Kafka 集群数量的大致推算公式如下：

```
Kafka 机器数 = 单位时间需要处理的总数据量 / 单机所占用带宽
```

## 参考资料

- **官方**
  - [Kafka 官网](http://kafka.apache.org/)
  - [Kafka Github](https://github.com/apache/kafka)
  - [Kafka 官方文档](https://kafka.apache.org/documentation/)
- **书籍**
  - [《Kafka 权威指南》](https://book.douban.com/subject/27665114/)
- **教程**
  - [Kafka 中文文档](https://github.com/apachecn/kafka-doc-zh)
  - [Kafka 核心技术与实战](https://time.geekbang.org/column/intro/100029201)
- **文章**
  - [kafka-cheat-sheet](https://github.com/lensesio/kafka-cheat-sheet)