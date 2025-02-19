---
title: RocketMQ 快速入门
date: 2022-02-17 22:34:30
order: 01
categories:
  - 分布式
  - 分布式通信
  - MQ
  - RocketMQ
tags:
  - Java
  - 中间件
  - MQ
  - RocketMQ
permalink: /pages/e3a757f7/
---

# RocketMQ 快速入门

Apache RocketMQ 是一个分布式 MQ 和流处理平台，具有低延迟、高性能和可靠性、万亿级容量和灵活的可扩展性。

RocketMQ 由阿里巴巴孵化，被捐赠给 Apache，成为 Apache 的顶级项目。

## RocketMQ 概念

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javaweb/distributed/mq/rocketmq/rmq-model.png)

### 消息模型（Message Model）

RocketMQ 主要由 Producer、Broker、Consumer 三部分组成，其中 Producer 负责生产消息，Consumer 负责消费消息，Broker 负责存储消息。Broker 在实际部署过程中对应一台服务器，每个 Broker 可以存储多个 Topic 的消息，每个 Topic 的消息也可以分片存储于不同的 Broker。Message Queue 用于存储消息的物理地址，每个 Topic 中的消息地址存储于多个 Message Queue 中。ConsumerGroup 由多个 Consumer 实例构成。

### 消息（Message）

消息系统所传输信息的物理载体，生产和消费数据的最小单位，每条消息必须属于一个主题。RocketMQ 中每个消息拥有唯一的 Message ID，且可以携带具有业务标识的 Key。系统提供了通过 Message ID 和 Key 查询消息的功能。

消息还可以具有可选 Tag 和额外的键值对。例如，您可以为消息设置业务密钥，并在代理服务器上查找消息以诊断开发期间的问题。

### 标签（Tag）

为消息设置的标志，用于同一主题下区分不同类型的消息。来自同一业务单元的消息，可以根据不同业务目的在同一主题下设置不同标签。标签能够有效地保持代码的清晰度和连贯性，并优化 RocketMQ 提供的查询系统。消费者可以根据 Tag 实现对不同子主题的不同消费逻辑，实现更好的扩展性。

Tag 相当于子主题，为用户提供了额外的灵活性。对于 Tag，来自同一业务模块的具有不同目的的消息可以具有相同的主题和不同的 Tag。

### 主题（Topic）

表示一类消息的集合，每个主题包含若干条消息，每条消息只能属于一个主题，是 RocketMQ 进行消息订阅的基本单位。

### 代理服务器（Broker Server）

消息中转角色，负责存储消息、转发消息。代理服务器在 RocketMQ 系统中负责接收从生产者发送来的消息并存储、同时为消费者的拉取请求作准备。代理服务器也存储消息相关的元数据，包括消费者组、消费进度偏移和主题和队列消息等。

### 名称服务（Name Server）

名称服务充当路由消息的提供者。生产者或消费者能够通过名称服务查找各主题相应的 Broker IP 列表。多个 Namesrv 实例组成集群，但相互独立，没有信息交换。

### 消息生产者（Producer）

负责生产消息，一般由业务系统负责生产消息。一个消息生产者会把业务应用系统里产生的消息发送到 broker 服务器。RocketMQ 提供多种发送方式，同步发送、异步发送、顺序发送、单向发送。同步和异步方式均需要 Broker 返回确认信息，单向发送不需要。

### 生产者组（Producer Group）

同一类 Producer 的集合，这类 Producer 发送同一类消息且发送逻辑一致。如果发送的是事务消息且原始生产者在发送之后崩溃，则 Broker 服务器会联系同一生产者组的其他生产者实例以提交或回溯消费。

警告：考虑到提供的 Producer 在发送消息方面足够强大，**每个 Producer 组只允许一个实例，以避免不必要的生成器实例初始化**。

### 消息消费者（Consumer）

负责消费消息，一般是后台系统负责异步消费。一个消息消费者会从 Broker 服务器拉取消息、并将其提供给应用程序。从用户应用的角度而言提供了两种消费形式：拉取式消费、推动式消费。

### 消费者组（Consumer Group）

同一类 Consumer 的集合，这类 Consumer 通常消费同一类消息且消费逻辑一致。消费者组使得在消息消费方面，实现负载均衡和容错的目标变得非常容易。要注意的是，**消费者组的消费者实例必须订阅完全相同的 Topic**。RocketMQ 支持两种消息模式：集群消费（Clustering）和广播消费（Broadcasting）。

### 拉取式消费（Pull Consumer）

Consumer 消费的一种类型，应用通常主动调用 Consumer 的拉消息方法从 Broker 服务器拉消息、主动权由应用控制。一旦获取了批量消息，应用就会启动消费过程。

### 推动式消费（Push Consumer）

Consumer 消费的一种类型，该模式下 Broker 收到数据后会主动推送给消费端，该消费模式一般实时性较高。

### 集群消费（Clustering）

集群消费模式下,相同 Consumer Group 的每个 Consumer 实例平均分摊消息。

### 广播消费（Broadcasting）

广播消费模式下，相同 Consumer Group 的每个 Consumer 实例都接收全量的消息。

### 普通顺序消息（Normal Ordered Message）

普通顺序消费模式下，消费者通过同一个消息队列（ Topic 分区，称作 Message Queue） 收到的消息是有顺序的，不同消息队列收到的消息则可能是无顺序的。

### 严格顺序消息（Strictly Ordered Message）

严格顺序消息模式下，消费者收到的所有消息均是有顺序的。

## RocketMQ 特性

### 订阅与发布

消息的发布是指某个生产者向某个 topic 发送消息；消息的订阅是指某个消费者关注了某个 topic 中带有某些 tag 的消息，进而从该 topic 消费数据。

### 消息顺序

消息有序指的是一类消息消费时，能按照发送的顺序来消费。例如：一个订单产生了三条消息分别是订单创建、订单付款、订单完成。消费时要按照这个顺序消费才能有意义，但是同时订单之间是可以并行消费的。RocketMQ 可以严格的保证消息有序。

顺序消息分为全局顺序消息与分区顺序消息，全局顺序是指某个 Topic 下的所有消息都要保证顺序；部分顺序消息只要保证每一组消息被顺序消费即可。

- 全局顺序 对于指定的一个 Topic，所有消息按照严格的先入先出（FIFO）的顺序进行发布和消费。 适用场景：性能要求不高，所有的消息严格按照 FIFO 原则进行消息发布和消费的场景
- 分区顺序 对于指定的一个 Topic，所有消息根据 sharding key 进行区块分区。 同一个分区内的消息按照严格的 FIFO 顺序进行发布和消费。 Sharding key 是顺序消息中用来区分不同分区的关键字段，和普通消息的 Key 是完全不同的概念。 适用场景：性能要求高，以 sharding key 作为分区字段，在同一个区块中严格的按照 FIFO 原则进行消息发布和消费的场景。

### 消息过滤

RocketMQ 的消费者可以根据 Tag 进行消息过滤，也支持自定义属性过滤。消息过滤目前是在 Broker 端实现的，优点是减少了对于 Consumer 无用消息的网络传输，缺点是增加了 Broker 的负担、而且实现相对复杂。

### 消息可靠性

RocketMQ 支持消息的高可靠，影响消息可靠性的几种情况：

1. Broker 非正常关闭
2. Broker 异常 Crash
3. OS Crash
4. 机器掉电，但是能立即恢复供电情况
5. 机器无法开机（可能是 cpu、主板、内存等关键设备损坏）
6. 磁盘设备损坏

1)、2)、3)、4) 四种情况都属于硬件资源可立即恢复情况，RocketMQ 在这四种情况下能保证消息不丢，或者丢失少量数据（依赖刷盘方式是同步还是异步）。

5)、6)属于单点故障，且无法恢复，一旦发生，在此单点上的消息全部丢失。RocketMQ 在这两种情况下，通过异步复制，可保证 99%的消息不丢，但是仍然会有极少量的消息可能丢失。通过同步双写技术可以完全避免单点，同步双写势必会影响性能，适合对消息可靠性要求极高的场合，例如与 Money 相关的应用。注：RocketMQ 从 3.0 版本开始支持同步双写。

### 至少一次

至少一次(At least Once)指每个消息必须投递一次。Consumer 先 Pull 消息到本地，消费完成后，才向服务器返回 ack，如果没有消费一定不会 ack 消息，所以 RocketMQ 可以很好的支持此特性。

### 回溯消费

回溯消费是指 Consumer 已经消费成功的消息，由于业务上需求需要重新消费，要支持此功能，Broker 在向 Consumer 投递成功消息后，消息仍然需要保留。并且重新消费一般是按照时间维度，例如由于 Consumer 系统故障，恢复后需要重新消费 1 小时前的数据，那么 Broker 要提供一种机制，可以按照时间维度来回退消费进度。RocketMQ 支持按照时间回溯消费，时间维度精确到毫秒。

### 事务消息

RocketMQ 事务消息（Transactional Message）是指应用本地事务和发送消息操作可以被定义到全局事务中，要么同时成功，要么同时失败。RocketMQ 的事务消息提供类似 X/Open XA 的分布事务功能，通过事务消息能达到分布式事务的最终一致。

### 定时消息

定时消息（延迟队列）是指消息发送到 broker 后，不会立即被消费，等待特定时间投递给真正的 topic。 broker 有配置项 messageDelayLevel，默认值为“1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h”，18 个 level。可以配置自定义 messageDelayLevel。注意，messageDelayLevel 是 broker 的属性，不属于某个 topic。发消息时，设置 delayLevel 等级即可：msg.setDelayLevel(level)。level 有以下三种情况：

- level == 0，消息为非延迟消息
- 1<=level<=maxLevel，消息延迟特定时间，例如 level==1，延迟 1s
- level > maxLevel，则 level== maxLevel，例如 level==20，延迟 2h

定时消息会暂存在名为 SCHEDULE_TOPIC_XXXX 的 topic 中，并根据 delayTimeLevel 存入特定的 queue，queueId = delayTimeLevel – 1，即一个 queue 只存相同延迟的消息，保证具有相同发送延迟的消息能够顺序消费。broker 会调度地消费 SCHEDULE_TOPIC_XXXX，将消息写入真实的 topic。

需要注意的是，定时消息会在第一次写入和调度写入真实 topic 时都会计数，因此发送数量、tps 都会变高。

### 消息重试

Consumer 消费消息失败后，要提供一种重试机制，令消息再消费一次。Consumer 消费消息失败通常可以认为有以下几种情况：

- 由于消息本身的原因，例如反序列化失败，消息数据本身无法处理（例如话费充值，当前消息的手机号被注销，无法充值）等。这种错误通常需要跳过这条消息，再消费其它消息，而这条失败的消息即使立刻重试消费，99%也不成功，所以最好提供一种定时重试机制，即过 10 秒后再重试。
- 由于依赖的下游应用服务不可用，例如 db 连接不可用，外系统网络不可达等。遇到这种错误，即使跳过当前失败的消息，消费其他消息同样也会报错。这种情况建议应用 sleep 30s，再消费下一条消息，这样可以减轻 Broker 重试消息的压力。

RocketMQ 会为每个消费组都设置一个 Topic 名称为“%RETRY%+consumerGroup”的重试队列（这里需要注意的是，这个 Topic 的重试队列是针对消费组，而不是针对每个 Topic 设置的），用于暂时保存因为各种异常而导致 Consumer 端无法消费的消息。考虑到异常恢复起来需要一些时间，会为重试队列设置多个重试级别，每个重试级别都有与之对应的重新投递延时，重试次数越多投递延时就越大。RocketMQ 对于重试消息的处理是先保存至 Topic 名称为“SCHEDULE_TOPIC_XXXX”的延迟队列中，后台定时任务按照对应的时间进行 Delay 后重新保存至“%RETRY%+consumerGroup”的重试队列中。

### 消息重投

生产者在发送消息时，同步消息失败会重投，异步消息有重试，oneway 没有任何保证。消息重投保证消息尽可能发送成功、不丢失，但可能会造成消息重复，消息重复在 RocketMQ 中是无法避免的问题。消息重复在一般情况下不会发生，当出现消息量大、网络抖动，消息重复就会是大概率事件。另外，生产者主动重发、consumer 负载变化也会导致重复消息。如下方法可以设置消息重试策略：

- retryTimesWhenSendFailed:同步发送失败重投次数，默认为 2，因此生产者会最多尝试发送 retryTimesWhenSendFailed + 1 次。不会选择上次失败的 broker，尝试向其他 broker 发送，最大程度保证消息不丢。超过重投次数，抛出异常，由客户端保证消息不丢。当出现 RemotingException、MQClientException 和部分 MQBrokerException 时会重投。
- retryTimesWhenSendAsyncFailed:异步发送失败重试次数，异步重试不会选择其他 broker，仅在同一个 broker 上做重试，不保证消息不丢。
- retryAnotherBrokerWhenNotStoreOK:消息刷盘（主或备）超时或 slave 不可用（返回状态非 SEND_OK），是否尝试发送到其他 broker，默认 false。十分重要消息可以开启。

### 量控制

生产者流控，因为 broker 处理能力达到瓶颈；消费者流控，因为消费能力达到瓶颈。

生产者流控：

- commitLog 文件被锁时间超过 osPageCacheBusyTimeOutMills 时，参数默认为 1000ms，返回流控。
- 如果开启 transientStorePoolEnable == true，且 broker 为异步刷盘的主机，且 transientStorePool 中资源不足，拒绝当前 send 请求，返回流控。
- broker 每隔 10ms 检查 send 请求队列头部请求的等待时间，如果超过 waitTimeMillsInSendQueue，默认 200ms，拒绝当前 send 请求，返回流控。
- broker 通过拒绝 send 请求方式实现流量控制。

注意，生产者流控，不会尝试消息重投。

消费者流控：

- 消费者本地缓存消息数超过 pullThresholdForQueue 时，默认 1000。
- 消费者本地缓存消息大小超过 pullThresholdSizeForQueue 时，默认 100MB。
- 消费者本地缓存消息跨度超过 consumeConcurrentlyMaxSpan 时，默认 2000。

消费者流控的结果是降低拉取频率。

### 死信队列

死信队列用于处理无法被正常消费的消息。当一条消息初次消费失败，消息队列会自动进行消息重试；达到最大重试次数后，若消费依然失败，则表明消费者在正常情况下无法正确地消费该消息，此时，消息队列 不会立刻将消息丢弃，而是将其发送到该消费者对应的特殊队列中。

RocketMQ 将这种正常情况下无法被消费的消息称为死信消息（Dead-Letter Message），将存储死信消息的特殊队列称为死信队列（Dead-Letter Queue）。在 RocketMQ 中，可以通过使用 console 控制台对死信队列中的消息进行重发来使得消费者实例再次进行消费。

## RocketMQ 组件

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20220712060550.png)

RocketMQ 由四部分组成：NameServer、Broker、Producer、Consumer。其中任意一个组成都可以水平扩展为集群模式，以避免单点故障问题。

### NameServer（命名服务器）

NameServer 是一个 Topic 路由注册中心，其角色类似 Kafka 中的 zookeeper，支持 Broker 的动态注册与发现。每个 NameServer 记录完整的路由信息，提供相应的读写服务，支持快速存储扩展。

NameServer 主要包括两个功能：

- **Broker 管理**，NameServer 接受 Broker 集群的注册信息并且保存下来作为路由信息的基本数据。然后提供心跳检测机制，检查 Broker 是否还存活；
- **路由信息管理**，每个 NameServer 将保存关于 Broker 集群的整个路由信息和用于客户端查询的队列信息。然后 Producer 和 Conumser 通过 NameServer 就可以知道整个 Broker 集群的路由信息，从而进行消息的投递和消费。

NameServer 通常也是集群的方式部署，各实例间相互不进行信息通讯。Broker 是向每一台 NameServer 注册自己的路由信息，所以每一个 NameServer 实例上面都保存一份完整的路由信息。当某个 NameServer 因某种原因下线了，Broker 仍然可以向其它 NameServer 同步其路由信息，Producer、Consumer 仍然可以动态感知 Broker 的路由的信息。

NameServer 是一个功能齐全的服务器，主要包括两个功能：

1. Broker 管理 - NameServer 接受来自 Broker 集群的注册，并提供心跳机制来检查 Broker 节点是否存活。
2. 路由管理 - 每个 NameServer 将保存有关 Broker 集群的完整路由信息和客户端查询的查询队列。

RocketMQ 客户端（Producer/Consumer）将从 NameServer 查询队列路由信息。

将 NameServer 地址列表提供给客户端有四种方法：

1. 编程方式 - 类似：`producer.setNamesrvAddr("ip:port")`
2. Java 选项 - 使用 `rocketmq.namesrv.addr` 参数
3. 环境变量 - 设置环境变量 `NAMESRV_ADDR`
4. HTTP 端点

> 更详细信息可以参考官方文档：[here](http://rocketmq.apache.org/rocketmq/four-methods-to-feed-name-server-address-list/)

### Broker（代理）

Broker 主要负责消息的存储、投递和查询以及服务高可用保证。

Broker 同时支持推拉模型，包含容错机制（2 副本或 3 副本），并提供强大的峰值填充和按原始时间顺序累积数千亿消息的能力。此外，Broker 提供了灾难恢复、丰富的指标统计和警报机制，这些都是传统 MQ 所缺乏的。

为了实现这些功能，Broker 包含了以下几个重要子模块：

- **Remoting Module**：整个 Broker 的实体，负责处理来自 clients 端的请求。
- **Client Manager**：负责管理客户端(Producer/Consumer)和维护 Consumer 的 Topic 订阅信息。
- **Store Service**：提供方便简单的 API 接口处理消息存储到物理硬盘和查询功能。
- **HA Service**：高可用服务，提供 Master Broker 和 Slave Broker 之间的数据同步功能。
- **Index Service**：根据特定的 Message key 对投递到 Broker 的消息进行索引服务，以提供消息的快速查询。

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javaweb/distributed/mq/rocketmq/rmq-basic-component.png)

### Producer（生产者）

Producers 支持分布式集群方式部署。Producer 通过 MQ 的负载均衡模块选择相应的 Broker 集群队列进行消息投递，投递的过程支持快速失败并且低延迟。

### Consumer（消费者）

Consumer 支持分布式集群方式部署。支持以 push 推，pull 拉两种模式对消息进行消费。同时也支持集群方式和广播方式的消费，它提供实时消息订阅机制，可以满足大多数用户的需求。

## RocketMQ 安装

### 环境要求

- 推荐 64 位操作系统：Linux/Unix/Mac
- 64bit JDK 1.8+
- Maven 3.2.x
- Git

### 下载解压

进入官方下载地址：<https://rocketmq.apache.org/dowloading/releases/，选择合适版本>

建议选择 binary 版本。

解压到本地：

```bash
> unzip rocketmq-all-4.2.0-source-release.zip
> cd rocketmq-all-4.2.0/
```

### 启动 Name Server

```bash
> nohup sh bin/mqnamesrv &
> tail -f ~/logs/rocketmqlogs/namesrv.log
The Name Server boot success...
```

### 启动 Broker

```bash
> nohup sh bin/mqbroker -n localhost:9876 -c conf/broker.conf &
> tail -f ~/logs/rocketmqlogs/broker.log
The broker[%s, 172.30.30.233:10911] boot success...
```

### 收发消息

执行收发消息操作之前，不许告诉客户端命名服务器的位置。在 RocketMQ 中有多种方法来实现这个目的。这里，我们使用最简单的方法——设置环境变量 `NAMESRV_ADDR` ：

> ```bash
> > export NAMESRV_ADDR=localhost:9876
> > sh bin/tools.sh org.apache.rocketmq.example.quickstart.Producer
> SendResult [sendStatus=SEND_OK, msgId= ...
>
> > sh bin/tools.sh org.apache.rocketmq.example.quickstart.Consumer
> ConsumeMessageThread_%d Receive New Messages: [MessageExt...
> ```

### 关闭服务器

```bash
> sh bin/mqshutdown broker
The mqbroker(36695) is running...
Send shutdown request to mqbroker(36695) OK

> sh bin/mqshutdown namesrv
The mqnamesrv(36664) is running...
Send shutdown request to mqnamesrv(36664) OK
```

## RocketMQ 入门级示例

首先在项目中引入 maven 依赖：

```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-client</artifactId>
    <version>4.2.0</version>
</dependency>
```

### Producer

Producer 在 RocketMQ 中负责发送消息。

RocketMQ 有三种消息发送方式：

- 可靠的同步发送
- 可靠的异步发送
- 单项发送

#### 可靠的同步发送

可靠的同步传输用于广泛的场景，如重要的通知消息，短信通知，短信营销系统等。

```java
public class SyncProducer {
    public static void main(String[] args) throws Exception {
        //Instantiate with a producer group name.
        DefaultMQProducer producer = new
            DefaultMQProducer("please_rename_unique_group_name");
        //Launch the instance.
        producer.start();
        for (int i = 0; i < 100; i++) {
            //Create a message instance, specifying topic, tag and message body.
            Message msg = new Message("TopicTest" /* Topic */,
                "TagA" /* Tag */,
                ("Hello RocketMQ " +
                    i).getBytes(RemotingHelper.DEFAULT_CHARSET) /* Message body */
            );
            //Call send message to deliver message to one of brokers.
            SendResult sendResult = producer.send(msg);
            System.out.printf("%s%n", sendResult);
        }
        //Shut down once the producer instance is not longer in use.
        producer.shutdown();
    }
}
```

#### 可靠的异步发送

异步传输通常用于响应时间敏感的业务场景。

```java
public class AsyncProducer {
    public static void main(String[] args) throws Exception {
        //Instantiate with a producer group name.
        DefaultMQProducer producer = new DefaultMQProducer("ExampleProducerGroup");
        //Launch the instance.
        producer.start();
        producer.setRetryTimesWhenSendAsyncFailed(0);
        for (int i = 0; i < 100; i++) {
                final int index = i;
                //Create a message instance, specifying topic, tag and message body.
                Message msg = new Message("TopicTest",
                    "TagA",
                    "OrderID188",
                    "Hello world".getBytes(RemotingHelper.DEFAULT_CHARSET));
                producer.send(msg, new SendCallback() {
                    @Override
                    public void onSuccess(SendResult sendResult) {
                        System.out.printf("%-10d OK %s %n", index,
                            sendResult.getMsgId());
                    }
                    @Override
                    public void onException(Throwable e) {
                        System.out.printf("%-10d Exception %s %n", index, e);
                        e.printStackTrace();
                    }
                });
        }
        //Shut down once the producer instance is not longer in use.
        producer.shutdown();
    }
}
```

#### 单向传输

单向传输用于需要中等可靠性的情况，例如日志收集。

```java
public class OnewayProducer {
    public static void main(String[] args) throws Exception{
        //Instantiate with a producer group name.
        DefaultMQProducer producer = new DefaultMQProducer("ExampleProducerGroup");
        //Launch the instance.
        producer.start();
        for (int i = 0; i < 100; i++) {
            //Create a message instance, specifying topic, tag and message body.
            Message msg = new Message("TopicTest" /* Topic */,
                "TagA" /* Tag */,
                ("Hello RocketMQ " +
                    i).getBytes(RemotingHelper.DEFAULT_CHARSET) /* Message body */
            );
            //Call send message to deliver message to one of brokers.
            producer.sendOneway(msg);

        }
        //Shut down once the producer instance is not longer in use.
        producer.shutdown();
    }
}
```

### Consumer

Consumer 在 RocketMQ 中负责接收消息。

```java
public class OrderedConsumer {
    public static void main(String[] args) throws Exception {
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("example_group_name");
        consumer.setNamesrvAddr(RocketConfig.HOST);

        consumer.setConsumeFromWhere(ConsumeFromWhere.CONSUME_FROM_FIRST_OFFSET);

        consumer.subscribe("TopicTest", "TagA || TagC || TagD");

        consumer.registerMessageListener(new MessageListenerOrderly() {

            AtomicLong consumeTimes = new AtomicLong(0);

            @Override
            public ConsumeOrderlyStatus consumeMessage(List<MessageExt> msgs,
                ConsumeOrderlyContext context) {
                context.setAutoCommit(false);
                System.out.printf(Thread.currentThread().getName() + " Receive New Messages: " + msgs + "%n");
                this.consumeTimes.incrementAndGet();
                if ((this.consumeTimes.get() % 2) == 0) {
                    return ConsumeOrderlyStatus.SUCCESS;
                } else if ((this.consumeTimes.get() % 3) == 0) {
                    return ConsumeOrderlyStatus.ROLLBACK;
                } else if ((this.consumeTimes.get() % 4) == 0) {
                    return ConsumeOrderlyStatus.COMMIT;
                } else if ((this.consumeTimes.get() % 5) == 0) {
                    context.setSuspendCurrentQueueTimeMillis(3000);
                    return ConsumeOrderlyStatus.SUSPEND_CURRENT_QUEUE_A_MOMENT;
                }
                return ConsumeOrderlyStatus.SUCCESS;

            }
        });

        consumer.start();

        System.out.printf("Consumer Started.%n");
    }
}
```

## RocketMQ 官方示例

- [Simple Example](https://rocketmq.apache.org/docs/simple-example/)
  - 使用 RocketMQ 通过三种方式发送消息：可靠同步、可靠异步、单向传输。
  - 使用 RocketMQ 消费消息。
- [Order Example](https://rocketmq.apache.org/docs/order-example/)：RocketMQ 使用 FIFO 顺序提供有序消息。
- [Broadcasting Example](https://rocketmq.apache.org/docs/broadcast-example/)
- [Schedule Example](https://rocketmq.apache.org/docs/schedule-example/)
- [Batch Example](https://rocketmq.apache.org/docs/batch-example/)
- [Filter Example](https://rocketmq.apache.org/docs/filter-by-sql92-example/)
- [Logappender Example](https://rocketmq.apache.org/docs/logappender-example/)
- [OpenMessaging Example](https://rocketmq.apache.org/docs/openmessaging-example/)
- [Transaction Example](https://rocketmq.apache.org/docs/transaction-example/)

## 参考资料

- [RocketMQ 官方文档](http://rocketmq.apache.org/docs/quick-start/)
- [分布式开放消息系统(RocketMQ)的原理与实践](https://www.jianshu.com/p/453c6e7ff81c)