---
icon: logos:kafka-icon
title: Kafka 集群
date: 2021-04-29 08:17:17
categories:
  - 分布式
  - 分布式通信
  - mq
  - kafka
tags:
  - mq
  - kafka
permalink: /pages/32977605/
---

# Kafka 集群

> Kafka 是一个分布式的、可水平扩展的、基于发布/订阅模式的、支持容错的消息系统。

## Kafka 和 ZooKeeper

**Kafka 使用 Zookeeper 来维护集群成员的信息**。每个 Broker 都有一个唯一标识符，这个标识符可以在配置文件里指定，也可以自动生成。在 Broker 启动的时候，它通过创建**临时节点**把自己的 ID 注册到 Zookeeper。Kafka 组件订阅 Zookeeper 的 `/broker/ids` 路径，当有 Broker 加入集群或退出集群时，这些组件就可以获得通知。

如果要启动另一个具有相同 ID 的 Broker，会得到一个错误——新 Broker 会试着进行注册，但不会成功，因为 ZooKeeper 中已经有一个具有相同 ID 的 Broker。

在 Broker 停机、出现网络分区或长时间垃圾回收停顿时，Broker 会与 ZooKeeper 断开连接，此时 Broker 在启动时创建的临时节点会自动被 ZooKeeper 移除。监听 Broker 列表的 Kafka 组件会被告知 Broker 已移除。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070741387.png)

Kafka 在 ZooKeeper 的关键存储信息：

- `admin`：存储管理信息。主要为删除主题事件，分区迁移事件，优先副本选举，信息 (一般为临时节点)
- `brokers`：存储 Broker 相关信息。broker 节点以及节点上的主题相关信息
- `cluster`：存储 kafka 集群信息
- `config`：存储 broker，client，topic，user 以及 changer 相关的配置信息
- `consumers`：存储消费者相关信息
- `controller`：存储控制器节点信息
- `controller_epoch`：存储控制器节点当前的年龄（说明控制器节点变更次数）

> ZooKeeper 两个重要特性：
>
> - 客户端会话结束时，ZooKeeper 就会删除临时节点。
> - 客户端注册监听它关心的节点，当节点状态发生变化（数据变化、子节点增减变化）时，ZooKeeper 服务会通知客户端。
>
> 详细内容可以参考：[ZooKeeper 原理](https://github.com/dunwu/bigdata-tutorial/blob/master/docs/zookeeper/ZooKeeper原理.md)

## 控制器

控制器（Controller），是 Apache Kafka 的核心组件。它的主要作用是在 ZooKeeper 的帮助下管理和协调整个 Kafka 集群。控制器其实就是一个 Broker，只不过它除了具有一般 Broker 的功能以外，还负责 Leader 的选举。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070741426.png)

### 如何选举控制器

集群中任意一台 Broker 都能充当控制器的角色，但是，在运行过程中，只能有一个 Broker 成为控制器，行使其管理和协调的职责。实际上，Broker 在启动时，会尝试去 ZooKeeper 中创建 `/controller` 节点。Kafka 当前选举控制器的规则是：**第一个在 ZooKeeper 成功创建 `/controller` 临时节点的 Broker 会被指定为控制器**。

选举控制器的详细流程：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070742505.png)

1. 第一个在 ZooKeeper 中成功创建 `/controller` 临时节点的 Broker 会被指定为控制器。

2. 其他 Broker 在控制器节点上创建 Zookeeper watch 对象。

3. 如果控制器被关闭或者与 Zookeeper 断开连接，Zookeeper 临时节点就会消失。集群中的其他 Broker 通过 watch 对象得到状态变化的通知，它们会尝试让自己成为新的控制器。

4. 第一个在 Zookeeper 里创建一个临时节点 `/controller` 的 Broker 成为新控制器。其他 Broker 在新控制器节点上创建 Zookeeper watch 对象。

5. 每个新选出的控制器通过 Zookeeper 的条件递增操作获得一个全新的、数值更大的 controller epoch。其他节点会忽略旧的 epoch 的消息。

6. 当控制器发现一个 Broker 已离开集群，并且这个 Broker 是某些 Partition 的 Leader。此时，控制器会遍历这些 Partition，并用轮询方式确定谁应该成为新 Leader，随后，新 Leader 开始处理生产者和消费者的请求，而 Follower 开始从 Leader 那里复制消息。

简而言之，**Kafka 使用 Zookeeper 的临时节点来选举控制器，并在节点加入集群或退出集群时通知控制器。控制器负责在节点加入或离开集群时进行 Partition Leader 选举。控制器使用 epoch 来避免“脑裂”，“脑裂”是指两个节点同时被认为自己是当前的控制器**。

### 控制器的作用

#### Topic 管理（创建、删除、增加分区）

这里的 Topic 管理，就是指控制器帮助我们完成对 Kafka Topic 的创建、删除以及分区增加的操作。换句话说，当我们执行 **kafka-topics 脚本**时，大部分的后台工作都是控制器来完成的。

#### 分区重分配

分区重分配主要是指，**kafka-reassign-partitions 脚本**（关于这个脚本，后面我也会介绍）提供的对已有 Topic 分区进行细粒度的分配功能。这部分功能也是控制器实现的。

#### 选举 Leader

Preferred 领导者选举主要是 Kafka 为了避免部分 Broker 负载过重而提供的一种换 Leader 的方案。在专栏后面说到工具的时候，我们再详谈 Preferred 领导者选举，这里你只需要了解这也是控制器的职责范围就可以了。

#### 集群成员管理

集群成员管理，包括自动检测新增 Broker、Broker 主动关闭及被动宕机。这种自动检测是依赖于前面提到的 Watch 功能和 ZooKeeper 临时节点组合实现的。

比如，控制器组件会利用**Watch 机制**检查 ZooKeeper 的 /brokers/ids 节点下的子节点数量变更。目前，当有新 Broker 启动后，它会在 /brokers 下创建专属的 znode 节点。一旦创建完毕，ZooKeeper 会通过 Watch 机制将消息通知推送给控制器，这样，控制器就能自动地感知到这个变化，进而开启后续的新增 Broker 作业。

侦测 Broker 存活性则是依赖于刚刚提到的另一个机制：**临时节点**。每个 Broker 启动后，会在 /brokers/ids 下创建一个临时 znode。当 Broker 宕机或主动关闭后，该 Broker 与 ZooKeeper 的会话结束，这个 znode 会被自动删除。同理，ZooKeeper 的 Watch 机制将这一变更推送给控制器，这样控制器就能知道有 Broker 关闭或宕机了，从而进行“善后”。

#### 数据服务

控制器的最后一大类工作，就是向其他 Broker 提供数据服务。控制器上保存了最全的集群元数据信息，其他所有 Broker 会定期接收控制器发来的元数据更新请求，从而更新其内存中的缓存数据。

控制器中保存了多种数据，比较重要的的数据有：

- 所有 Topic 信息。包括具体的分区信息，比如领导者副本是谁，ISR 集合中有哪些副本等。
- 所有 Broker 信息。包括当前都有哪些运行中的 Broker，哪些正在关闭中的 Broker 等。
- 所有涉及运维任务的分区。包括当前正在进行 Preferred 领导者选举以及分区重分配的分区列表。

值得注意的是，这些数据其实在 ZooKeeper 中也保存了一份。每当控制器初始化时，它都会从 ZooKeeper 上读取对应的元数据并填充到自己的缓存中。有了这些数据，控制器就能对外提供数据服务了。这里的对外主要是指对其他 Broker 而言，控制器通过向这些 Broker 发送请求的方式将这些数据同步到其他 Broker 上。

## 副本机制

副本机制是分布式系统实现高可用的不二法门，Kafka 也不例外。

副本机制有哪些好处？

1. **提供可用性**：有句俗语叫：鸡蛋不要放在一个篮子里。副本机制也是一个道理——当部分节点宕机时，系统仍然可以依靠其他正常运转的节点，从整体上对外继续提供服务。
2. **提供伸缩性**：通过增加、减少机器可以控制系统整体的吞吐量。
3. **改善数据局部性**：允许将数据放入与用户地理位置相近的地方，从而降低系统延时。

但是，Kafka 只实现了第一个好处，原因后面会阐述。

### Kafka 副本角色

Kafka 使用 Topic 来组织数据，每个 Topic 被分为若干个 Partition，每个 Partition 有多个副本。每个 Broker 可以保存成百上千个属于不同 Topic 和 Partition 的副本。**Kafka 副本的本质是一个只能追加写入的提交日志**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070743894.png)

Kafka 副本有两种角色：

- **Leader 副本（主）**：每个 Partition 都有且仅有一个 Leader 副本。为了保证数据一致性，**Leader 处理一切对 Partition （分区）的读写请求**；
- **Follower 副本（从）**：Leader 副本以外的副本都是 Follower 副本。**Follower 唯一的任务就是从 Leader 那里复制消息，保持与 Leader 一致的状态**。
- 如果 Leader 宕机，其中一个 Follower 会被选举为新的 Leader。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070743006.png)

为了与 Leader 保持同步，Follower 向 Leader 发起获取数据的请求，这种请求与消费者为了读取消息而发送的请求是一样的。请求消息里包含了 Follower 想要获取消息的偏移量，而这些偏移量总是有序的。

Leader 另一个任务是搞清楚哪个 Follower 的状态与自己是一致的。通过查看每个 Follower 请求的最新偏移量，Leader 就会知道每个 Follower 复制的进度。如果跟随者在 10s 内没有请求任何消息，或者虽然在请求消息，但是在 10s 内没有请求最新的数据，那么它就会被认为是**不同步**的。**如果一个副本是不同步的，在 Leader 失效时，就不可能成为新的 Leader**——毕竟它没有包含全部的消息。

除了当前首领之外，每个分区都有一个首选首领——创建 Topic 时选定的首领就是分区的首选首领。之所以叫首选 Leader，是因为在创建分区时，需要在 Broker 之间均衡 Leader。

### ISR

ISR 即 In-sync Replicas，表示同步副本。Follower 副本不提供服务，只是定期地异步拉取领导者副本中的数据而已。既然是异步的，说明和 Leader 并非数据强一致性的。

**判断 Follower 是否与 Leader 同步的标准**：

Kafka Broker 端参数 `replica.lag.time.max.ms` 参数，指定了 Follower 副本能够落后 Leader 副本的最长时间间隔，默认为 10s。这意味着：只要一个 Follower 副本落后 Leader 副本的时间不连续超过 10 秒，那么 Kafka 就认为该 Follower 副本与 Leader 是**同步**的，即使此时 Follower 副本中保存的消息明显少于 Leader 副本中的消息。

ISR 是一个动态调整的集合，会不断将同步副本加入集合，将不同步副本移除集合。Leader 副本天然就在 ISR 中。

### Unclean 领导者选举

因为 Leader 副本天然就在 ISR 中，如果 ISR 为空了，就说明 Leader 副本也“挂掉”了，Kafka 需要重新选举一个新的 Leader。

**Kafka 把所有不在 ISR 中的存活副本都称为非同步副本**。通常来说，非同步副本落后 Leader 太多，因此，如果选择这些副本作为新 Leader，就可能出现数据的丢失。毕竟，这些副本中保存的消息远远落后于老 Leader 中的消息。在 Kafka 中，选举这种副本的过程称为 Unclean 领导者选举。**Broker 端参数 `unclean.leader.election.enable` 控制是否允许 Unclean 领导者选举**。

**开启 Unclean 领导者选举可能会造成数据丢失**，但好处是：它使得 Partition Leader 副本一直存在，不至于停止对外提供服务，因此提升了高可用性。反之，禁止 Unclean 领导者选举的好处在于维护了数据的一致性，避免了消息丢失，但牺牲了高可用性。

## 处理请求

Broker 的大部分工作是处理客户端、Partition 副本和控制器发送给 Partition Leader 的请求。Kafka 提供了一个二进制协议（基于 TCP），指定了请求消息的格式以及 Broker 如何对请求作出响应。

broker 会在它所监听的每一个端口上运行一个 Acceptor 线程，这个线程会创建一个连接，并把它交给 Processor 线程去处理。Processor 线程的数量是可配置的。Processor 线程负责从客户端获取请求消息，把它们放进请求队列，然后从响应队列获取响应消息，把它们发送给客户端。

当请求放进请求队列后，IO 线程负责进行处理。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/10427194506.png)

生产请求和获取请求都需要发送给 Partition 的 Leader 副本处理。如果 Broker 收到一个针对特定分区的请求，而该分区的 Leader 在另一个 Broker 上，那么发送请求的客户端会收到一个“非分区 Leader”的错误响应。Kafka 客户端要自己负责把生成请求和获取请求发送到正确的 Broker 上。

### 元数据请求

客户端怎么知道哪个是 Leader 呢？客户端通过使用另一种类型的请求来实现，那就是**元数据请求（metadata request）**。这种请求包含了客户端感兴趣的 Topic 列表。broker 的响应消息指明了这些 Topic 所包含的 Partition、Partition 有哪些副本，以及哪个副本是 Leader。元数据请求可以发给任意一个 broker，因为所有 Broker 都缓存了这些信息。

客户端会把这些信息缓存起来，并直接往目标 Broker 上发送生产请求和获取请求。它们需要时不时地通过发送元数据请求来刷新这些信息（刷新的时间间隔通过 `metadata.max.age.ms` 来配置），从而知道元数据是否发生了变化。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200621123848.png)

### 生产请求

acks 参数控制多少个副本确认写入成功后生产者才认为消息生产成功。这个参数的取值可以为：

- `acks=0` - 消息发送完毕，生产者认为消息写入成功；
- `acks=1` - Leader 写入成功，生产者认为消息写入成功；
- `acks=all` - 所有同步副本写入成功，生产者才认为消息写入成功。

如果 Leader 收到生产消息，它会执行一些检查逻辑，包含：

- 发送的用户是否有权限写入 Topic？
- 请求的 `acks` 参数取值是否合法（只允许 `0`，`1`，`all`）？
- 如果 `acks` 设置为 `all`，是否有足够的同步副本已经安全写入消息？（我们可以配置如果同步副本数量不足，Leader 拒绝处理新消息）

之后，消息被写入到本地磁盘。一旦消息本地持久化后，如果 `acks` 被设为 `0` 或 `1`，那么会返回结果给客户端；如果 `acks` 被设为 `all` 那么会将请求放置在一个称为 `purgatory` 的缓冲区中等待其他的副本写入完成。

### 消费请求

Leader 处理拉取请求和处理生产请求的方式很相似：

1. 请求需要先到达指定的 Partition Leader 上，然后客户端通过查询元数据来确保请求的路由是正确的。
2. Leader 在收到请求时，会先检查请求是否有效。
3. 如果请求的偏移量存在，Broker 将按照客户端指定的数量上限从 Partition 里读取消息，再把消息返回给客户端。Kafka 使用零拷贝技术向客户端发送消息——也就是说，Kafka 直接把消息从文件（更准确的说，是文件系统缓存）里发送到网络通道，而不需要经过任何中间缓冲区。这避免了内存的字节拷贝和缓冲区维护，极大地提高了性能。

**客户端可以指定 Broker 返回数据量的上限和下限，防止数据量过大造成客户端内存溢出**。同时，**客户端也可以指定返回的最小数据量**，当消息数据量没有达到最小数据量时，请求会一直阻塞直到有足够的数据返回。指定最小的数据量在负载不高的情况下非常有用，通过这种方式**可以减轻网络往返的额外开销**。当然请求也不能永远的阻塞，客户端可以指定最大的阻塞时间，如果到达指定的阻塞时间，即便没有足够的数据也会返回。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200621124516.png)

不是所有 Leader 的数据都能够被读取。**消费者只能读取已提交的消息**。**只有当消息被写入分区的若干同步副本时，才被认为是已提交的**。为什么是若干个 Broker 呢？这取决于你对“已提交”的定义。你可以选择只要 Leader 成功保存该消息就算是已提交，也可以是令所有 Broker 都成功保存该消息才算是已提交。

因为还没有被足够的副本持久化的消息，被认为是不安全的——如果 Leader 发生故障，另一个副本成为新的 Leader，这些消息就丢失了。如果允许读取这些消息，就可能会破坏数据一致性。

这也意味着，如果 Broker 间的消息复制因为某些原因变慢了，那么消息到达消费者的时间也会随之变长。延迟时间可以通过 `replica.lag.time.max.ms` 来配置，它指定了副本在复制消息时可被允许的最大延迟时间。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200621124533.png)

### 其他请求

我们讨论了 Kafka 中最常见的三种请求类型：元信息请求，生产请求和拉取请求。这些请求都是使用的是 Kafka 的自定义二进制协议。集群中 Broker 间的通信请求也是使用同样的协议，这些请求是内部使用的，客户端不能发送。比如在选举 Partition Leader 过程中，控制器会发送 LeaderAndIsr 请求给新的 Leader 和其他跟随副本。

这个协议目前已经支持 20 种请求类型，并且仍然在演进以支持更多的类型。

## 总结

### 副本机制

- 每个 Partition 都有一个 Leader，零个或多个 Follower。
- Leader 处理一切对 Partition （分区）的读写请求；而 Follower 只需被动的同步 Leader 上的数据。
- 同一个 Topic 的不同 Partition 会分布在多个 Broker 上，而且一个 Partition 还会在其他的 Broker 上面进行备份。

### 选举机制

Follower 宕机，啥事儿没有；Leader 宕机了，会从 Follower 中重新选举一个新的 Leader。
生产者/消费者如何知道谁是 Leader

- Kafka 将这种元数据存储在 Zookeeper 服务中。
- 生产者和消费者都和 Zookeeper 连接并通信。

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
  - [Thorough Introduction to Apache Kafka](https://hackernoon.com/thorough-introduction-to-apache-kafka-6fbf2989bbc1)
