---
title: RocketMQ 原理篇
date: 2018-07-17
categories:
- javaweb
tags:
- java
- javaweb
- mq
---

# RocketMQ 原理篇

<!-- TOC depthFrom:2 depthTo:3 -->

- [架构](#架构)
    - [NameServer](#nameserver)
    - [Broker](#broker)
    - [Producer](#producer)
    - [Consumer](#consumer)
- [关键特性以及其实现原理](#关键特性以及其实现原理)
    - [顺序消息](#顺序消息)
    - [消息重复](#消息重复)
    - [事务消息](#事务消息)
- [资料](#资料)

<!-- /TOC -->

## 架构

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/rocketmq/rmq-basic-arc.png" />
</div

RocketMQ 由四部分组成：NameServer、Broker、Producer、Consumer。其中任意一个组成都可以水平扩展为集群模式，以避免单点故障问题。

### NameServer

NameServer 提供轻量级的服务发现和路由能力。每个 NameServer 节点记录全部的路由信息，支持相应的读写操作，并支持快速存储扩展。

NameServer 是一个功能齐全的服务器，主要包括两个功能：

1.  Broker 管理 - NameServer 接受来自 Broker 集群的注册，并提供心跳机制来检查 Broker 节点是否存活。
2.  路由管理 - 每个 NameServer 将保存有关 Broker 集群的完整路由信息和客户端查询的查询队列。

RocketMQ 客户端（Producer/Consumer）将从 NameServer 查询队列路由信息。

将 NameServer 地址列表提供给客户端有四种方法：

1.  编程方式 - 类似：`producer.setNamesrvAddr("ip:port")`
2.  Java 选项 - 使用 `rocketmq.namesrv.addr` 参数
3.  环境变量 - 设置环境变量 `NAMESRV_ADDR`
4.  HTTP 端点

> 更详细信息可以参考官方文档：[here](http://rocketmq.apache.org/rocketmq/four-methods-to-feed-name-server-address-list/)

### Broker

Broker 通过提供轻量级的 TOPIC 和 QUEUE 机制来处理消息存储。它们支持 Push 和 Pull 模型，包含容错机制（2 个副本或 3 个副本），并提供强大的峰值填充和以原始时间顺序累积数千亿条消息的能力。此外，Brokers 还提供灾难恢复，丰富的指标统计和警报机制。

Broker 有几个重要的子模块：

- Remoting Module - 即代理的条目，处理来自客户端的请求。
- Client Manager - 管理客户（生产者/消费者）并维护消费者的主题订阅。
- Store 服务 - 提供简单的 API 来存储或查询物理磁盘中的消息。
- HA 服务 - 提供主代理和从代理之间的数据同步功能。
- Index 服务 - 按指定密钥构建消息索引，并提供快速消息查询。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/rocketmq/rmq-basic-component.png" />
</div>

### Producer

Producers 支持分布式部署。Distributed Producers 通过多种负载均衡模式向 Broker 集群发送消息。发送过程支持快速故障并具有低延迟。

### Consumer

Consumer 也支持 Push 和 Pull 模型中的分布式部署。它还支持群集消费和消息广播。它提供实时消息订阅机制，可以满足大多数消费者的需求。 RocketMQ 的网站为感兴趣的用户提供了一个简单的快速入门指南。

## 关键特性以及其实现原理

分布式消息系统作为实现分布式系统可扩展、可伸缩性的关键组件，需要具有高吞吐量、高可用等特点。而谈到消息系统的设计，就回避不了两个问题：

1.  消息的顺序问题
2.  消息的重复问题

### 顺序消息

#### 第一种模型

假如生产者产生了 2 条消息：M1、M2，要保证这两条消息的顺序，应该怎样做？你脑中想到的可能是这样：

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-bb5ec534363e2fb4?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

假定 M1 发送到 S1，M2 发送到 S2，如果要保证 M1 先于 M2 被消费，那么需要 M1 到达消费端被消费后，通知 S2，然后 S2 再将 M2 发送到消费端。

这个模型存在的问题是，如果 M1 和 M2 分别发送到两台 Server 上，就不能保证 M1 先达到 MQ 集群，也不能保证 M1 被先消费。换个角度看，如果 M2 先于 M1 达到 MQ 集群，甚至 M2 被消费后，M1 才达到消费端，这时消息也就乱序了，说明以上模型是不能保证消息的顺序的。

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-5a6313fe906a678b?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

#### 第二种模型

如何才能在 MQ 集群保证消息的顺序？一种简单的方式就是将 M1、M2 发送到同一个 Server 上：

这样可以保证 M1 先于 M2 到达 MQServer（生产者等待 M1 发送成功后再发送 M2），根据先达到先被消费的原则，M1 会先于 M2 被消费，这样就保证了消息的顺序。

这个模型也仅仅是理论上可以保证消息的顺序，在实际场景中可能会遇到下面的问题：

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-d430f5a3ec6c48ad?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

只要将消息从一台服务器发往另一台服务器，就会存在网络延迟问题。如上图所示，如果发送 M1 耗时大于发送 M2 的耗时，那么 M2 就仍将被先消费，仍然不能保证消息的顺序。即使 M1 和 M2 同时到达消费端，由于不清楚消费端 1 和消费端 2 的负载情况，仍然有可能出现 M2 先于 M1 被消费的情况。

如何解决这个问题？将 M1 和 M2 发往同一个消费者，且发送 M1 后，需要消费端响应成功后才能发送 M2。

这可能产生另外的问题：如果 M1 被发送到消费端后，消费端 1 没有响应，那是继续发送 M2 呢，还是重新发送 M1？一般为了保证消息一定被消费，肯定会选择重发 M1 到另外一个消费端 2，就如下图所示。

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-3c0e822d37a85e1e?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

这样的模型就严格保证消息的顺序，细心的你仍然会发现问题，消费端 1 没有响应 Server 时有两种情况，一种是 M1 确实没有到达(数据在网络传送中丢失)，另外一种消费端已经消费 M1 且已经发送响应消息，只是 MQ Server 端没有收到。如果是第二种情况，重发 M1，就会造成 M1 被重复消费。也就引入了我们要说的第二个问题，消息重复问题，这个后文会详细讲解。

回过头来看消息顺序问题，严格的顺序消息非常容易理解，也可以通过文中所描述的方式来简单处理。总结起来，要实现严格的顺序消息，简单且可行的办法就是：

**保证生产者 - MQServer - 消费者是一对一对一的关系。**

这样的设计虽然简单易行，但也会存在一些很严重的问题，比如：

1.  并行度就会成为消息系统的瓶颈（吞吐量不够）
2.  更多的异常处理，比如：只要消费端出现问题，就会导致整个处理流程阻塞，我们不得不花费更多的精力来解决阻塞的问题。

RocketMQ 的解决方案：通过合理的设计或者将问题分解来规避。如果硬要把时间花在解决问题本身，实际上不仅效率低下，而且也是一种浪费。从这个角度来看消息的顺序问题，我们可以得出两个结论：

1.  不关注乱序的应用实际大量存在
2.  队列无序并不意味着消息无序

最后我们从源码角度分析 RocketMQ 怎么实现发送顺序消息。

RocketMQ 通过轮询所有队列的方式来确定消息被发送到哪一个队列（负载均衡策略）。比如下面的示例中，订单号相同的消息会被先后发送到同一个队列中：

```java
// RocketMQ 通过 MessageQueueSelector 中实现的算法来确定消息发送到哪一个队列上
// RocketMQ 默认提供了两种 MessageQueueSelector 实现：随机/Hash
// 当然你可以根据业务实现自己的 MessageQueueSelector 来决定消息按照何种策略发送到消息队列中
SendResult sendResult = producer.send(msg, new MessageQueueSelector() {
    @Override
    public MessageQueue select(List<MessageQueue> mqs, Message msg, Object arg) {
        Integer id = (Integer) arg;
        int index = id % mqs.size();
        return mqs.get(index);
    }
}, orderId);
```

在获取到路由信息以后，会根据 MessageQueueSelector 实现的算法来选择一个队列，同一个 OrderId 获取到的肯定是同一个队列。

```java
private SendResult send()  {
    // 获取topic路由信息
    TopicPublishInfo topicPublishInfo = this.tryToFindTopicPublishInfo(msg.getTopic());
    if (topicPublishInfo != null && topicPublishInfo.ok()) {
        MessageQueue mq = null;
        // 根据我们的算法，选择一个发送队列
        // 这里的arg = orderId
        mq = selector.select(topicPublishInfo.getMessageQueueList(), msg, arg);
        if (mq != null) {
            return this.sendKernelImpl(msg, mq, communicationMode, sendCallback, timeout);
        }
    }
}
```

### 消息重复

造成消息重复的根本原因是：网络不可达。只要通过网络交换数据，就无法避免这个问题。所以解决这个问题的办法就是绕过这个问题。那么问题就变成了：如果消费端收到两条一样的消息，应该怎样处理？

1.  消费端处理消息的业务逻辑保持幂等性。
2.  保证每条消息都有唯一编号且保证消息处理成功与去重表的日志同时出现。

第 1 条很好理解，只要保持幂等性，不管来多少条重复消息，最后处理的结果都一样。

第 2 条原理就是利用一张日志表来记录已经处理成功的消息的 ID，如果新到的消息 ID 已经在日志表中，那么就不再处理这条消息。

第 1 条解决方案，很明显应该在消费端实现，不属于消息系统要实现的功能。

第 2 条可以消息系统实现，也可以业务端实现。正常情况下出现重复消息的概率其实很小，如果由消息系统来实现的话，肯定会对消息系统的吞吐量和高可用有影响，所以最好还是由业务端自己处理消息重复的问题，这也是 RocketMQ 不解决消息重复的问题的原因。

**RocketMQ 不保证消息不重复，如果你的业务需要保证严格的不重复消息，需要你自己在业务端去重。**

### 事务消息

RocketMQ 除了支持普通消息，顺序消息，另外还支持事务消息。

假设这样的场景：

<br><div align="center"><img src="https://upload-images.jianshu.io/upload_images/3101171-253d8bd65736694f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"/></div><br>

图中执行本地事务（Bob 账户扣款）和发送异步消息应该保证同时成功或者同时失败，也就是扣款成功了，发送消息一定要成功，如果扣款失败了，就不能再发送消息。那问题是：我们是先扣款还是先发送消息呢？

<br><div align="center"><img src="http://upload-images.jianshu.io/upload_images/3101171-088dc074c4ecd192?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"/></div><br>

RocketMQ 分布式事务步骤：

发送 Prepared 消息 2222222222222222222，并拿到接受消息的地址。
执行本地事务
通过第 1 步骤拿到的地址去访问消息，并修改消息状态。

## 资料

- [RocketMQ 官方文档](http://rocketmq.apache.org/docs/quick-start/)
- [分布式开放消息系统(RocketMQ)的原理与实践](https://www.jianshu.com/p/453c6e7ff81c)
