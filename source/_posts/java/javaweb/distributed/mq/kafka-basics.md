---
title: Kafka 实战篇
date: 2018-07-12
categories:
  - 分布式
tags:
  - java
  - javaweb
  - 分布式
  - mq
---

# Kafka 实战篇

> Kafka 是一个分布式的、可水平扩展的、基于发布/订阅模式的、支持容错的消息系统。
>
> | [**官网**](http://kafka.apache.org/) | [**官方文档**](https://kafka.apache.org/documentation/) | [**Github**](https://github.com/apache/kafka) |

<!-- TOC depthFrom:2 depthTo:3 -->

- [1. 概述](#1-概述)
    - [1.1. 简介](#11-简介)
    - [1.2. 系统结构和存储结构](#12-系统结构和存储结构)
    - [1.3. 小结](#13-小结)
- [2. 安装部署](#2-安装部署)
    - [2.1. 下载解压](#21-下载解压)
    - [2.2. 启动服务器](#22-启动服务器)
    - [2.3. 停止服务器](#23-停止服务器)
    - [2.4. 创建主题](#24-创建主题)
    - [2.5. 生产者生产消息](#25-生产者生产消息)
    - [2.6. 消费者消费消息](#26-消费者消费消息)
    - [2.7. 集群部署](#27-集群部署)
- [3. API](#3-api)
- [4. 生产者（Producer）](#4-生产者producer)
    - [4.1. 发送消息流程](#41-发送消息流程)
    - [4.2. 发送消息方式](#42-发送消息方式)
- [5. 消费者（Consumer）](#5-消费者consumer)
    - [5.1. 消费者和消费者群组](#51-消费者和消费者群组)
    - [5.2. 消费消息流程](#52-消费消息流程)
    - [5.3. 提交偏移量](#53-提交偏移量)
    - [5.4. 从指定偏移量获取数据](#54-从指定偏移量获取数据)
- [6. Broker](#6-broker)
    - [6.1. 集群控制器](#61-集群控制器)
    - [6.2. 分区 leader 和 follower](#62-分区-leader-和-follower)
    - [6.3. 群组协调器](#63-群组协调器)
- [7. Zookeeper 集群](#7-zookeeper-集群)
    - [7.1. 节点信息](#71-节点信息)
    - [7.2. zookeeper 一些总结](#72-zookeeper-一些总结)
- [8. 资料](#8-资料)

<!-- /TOC -->

## 1. 概述

### 1.1. 简介

Kafka 是一个分布式的、可水平扩展的、基于发布/订阅模式的、支持容错的 MQ 中间件。具有如下特点：

- 伸缩性。随着数据量增长，可以通过对 broker 集群水平扩展来提高系统性能。
- 高性能。通过横向扩展生产者、消费者(通过消费者群组实现)和 broker（通过扩展实现系统伸缩性）可以轻松处理巨大的消息流。
- 消息持久化。基于磁盘的数据存储，消息不会丢失。

通过 Partition 来实现多个生产者（同一个 topic 消息根据 key 放置到一个 Partition 中）和多个消费者（一个 Partition 由消费者群组中每一个消费者来负责）。

### 1.2. 系统结构和存储结构

#### 1.2.1. 系统结构

producer 采用 push 方式向 broker 发送消息；customer 采用 pull 方式从 broker 接受消息。

- **Producer** - 消息生产者，负责发布消息到 Kafka Broker。
- **Consumer** - 消息消费者，从 Kafka Broker 读取消息的客户端。
- **Consumer Group** - 每个 Consumer 属于一个特定的 Consumer Group，若不指定 group name 则属于默认的 group。**在同一个 Group 中，每一个 customer 可以消费多个 Partition，但是一个 Partition 只能指定给一个这个 Group 中一个 Customer**。
- **Broker** - Kafka 集群包含一个或多个服务器，这种服务器被称为 broker

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka系统结构.png" />
</div>

#### 1.2.2. Topic 的存储结构

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/topic存储结构.png" />
</div>

- **Topic** - 每条发布到 Kafka 集群的消息都有一个类别，这个类别被称为 Topic。（物理上不同 Topic 的消息分开存储，逻辑上一个 Topic 的消息虽然保存于一个或多个 broker 上，但用户只需指定消息的 Topic 即可生产或消费数据而不必关心数据存于何处）。
- **Partition** - Partition 是物理上的概念，每个 Topic 包含一个或多个 Partition。为了使得 Kafka 的吞吐率可以线性提高，物理上把 Topic 分成一个或多个 Partition，每个 Partition 在物理上对应一个文件夹，该文件夹下存储这个 Partition 的所有消息和索引文件。
- **Segment** - 是 Partition 目录下的文件，保存存储消息。
- **索引** - 方便查询 segment

#### 1.2.3. Segment 文件格式

可以把 topic 当做一个数据表，表中每一个记录都是 key,value 形式，如下图。

注意： 必须要有一个 key，如果没有，则默认会生成一个 key，可以把 key 当做一个消息的标识，同一个 key 可能有多条数据。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/mq/kafka/kafka-segment结构.png" />
</div>

### 1.3. 小结

**（1）一个主题存在多个分区，每一分区属于哪个 leader broker?**

在任意一个 broker 机器都有每一个分区所属 leader 的信息，所以可以通过访问任意一个 broker 获取这些信息。

**（2）每个消费者群组对应的分区偏移量的元数据存储在哪里。**

最新版本保存在 kafka 中，对应的主题是\_consumer_offsets。老版本是在 zookeeper 中。

**（3）假设某一个消息处理业务逻辑失败了。是否还可以继续向下执行？如果可以的话，那么此时怎么保证这个消息还会继续被处理呢？**

答案是：正常情况下无法再处理有问题的消息。

这里举一个例子，如 M1->M2->M3->M4，假设第一次 poll 时，得到 M1 和 M2，M1 处理成功，M2 处理失败，我们采用提交方式为处理一个消息就提交一次，此时我们提交偏移量是 offset1，但是当我们第二次执行 poll 时，此时只会获取到 M3 和 M4，因为 poll 的时候是根据本地偏移量来获取的，不是 kafka 中保存的初始偏移量。解决这个问题方法是通过 seek 操作定位到 M2 的位置，此时再执行 poll 时就会获取到 M2 和 M3。

**（4）当一个消费者执行了 close 之后，此时会执行再均衡，那么再均衡是在哪里发生的呢？其他同组的消费者如何感知到？**

是通过群组中成为群主的消费者执行再均衡，执行完毕之后,通过群组协调器把每一个消费者负责分区信息发送给消费者，每一个消费者只能知道它负责的分区信息。

**（5）如何保证时序性**

因为 kafkaf 只保证一个分区内的消息才有时序性，所以只要消息属于同一个 topic 且在同一个分区内，就可以保证 kafka 消费消息是有顺序的了。

## 2. 安装部署

环境要求：JDK8、ZooKeeper

### 2.1. 下载解压

进入官方下载地址：http://kafka.apache.org/downloads，选择合适版本。

解压到本地：

```
> tar -xzf kafka_2.11-1.1.0.tgz
> cd kafka_2.11-1.1.0
```

现在您已经在您的机器上下载了最新版本的 Kafka。

### 2.2. 启动服务器

由于 Kafka 依赖于 ZooKeeper，所以运行前需要先启动 ZooKeeper

```
> bin/zookeeper-server-start.sh config/zookeeper.properties
[2013-04-22 15:01:37,495] INFO Reading configuration from: config/zookeeper.properties (org.apache.zookeeper.server.quorum.QuorumPeerConfig)
...
```

然后，启动 Kafka

```
> bin/kafka-server-start.sh config/server.properties
[2013-04-22 15:01:47,028] INFO Verifying properties (kafka.utils.VerifiableProperties)
[2013-04-22 15:01:47,051] INFO Property socket.send.buffer.bytes is overridden to 1048576 (kafka.utils.VerifiableProperties)
...
```

### 2.3. 停止服务器

执行所有操作后，可以使用以下命令停止服务器

```
$ bin/kafka-server-stop.sh config/server.properties
```

### 2.4. 创建主题

创建一个名为 test 的 Topic，这个 Topic 只有一个分区以及一个备份：

```
> bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
```

### 2.5. 生产者生产消息

运行生产者，然后可以在控制台中输入一些消息，这些消息会发送到服务器：

```
> bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
This is a message
This is another message
```

### 2.6. 消费者消费消息

启动消费者，然后获得服务器中 Topic 下的消息：

```
> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
This is a message
This is another message
```

### 2.7. 集群部署

复制配置为多份（Windows 使用 copy 命令代理）：

```
> cp config/server.properties config/server-1.properties
> cp config/server.properties config/server-2.properties
```

修改配置：

```
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

根据这两份配置启动三个服务器节点：

```
> bin/kafka-server-start.sh config/server.properties &
...
> bin/kafka-server-start.sh config/server-1.properties &
...
> bin/kafka-server-start.sh config/server-2.properties &
...
```

创建一个新的 Topic 使用 三个备份：

```
> bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 3 --partitions 1 --topic my-replicated-topic
```

查看主题：

```
> bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic my-replicated-topic
Topic:my-replicated-topic   PartitionCount:1    ReplicationFactor:3 Configs:
    Topic: my-replicated-topic  Partition: 0    Leader: 1   Replicas: 1,2,0 Isr: 1,2,0
```

- leader - 负责指定分区的所有读取和写入的节点。每个节点将成为随机选择的分区部分的领导者。
- replicas - 是复制此分区日志的节点列表，无论它们是否为领导者，或者即使它们当前处于活动状态。
- isr - 是“同步”复制品的集合。这是副本列表的子集，该列表当前处于活跃状态并且已经被领导者捕获。

## 3. API

Stream API 的 maven 依赖：

```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-streams</artifactId>
    <version>1.1.0</version>
</dependency>
```

其他 API 的 maven 依赖：

```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>1.1.0</version>
</dependency>
```

## 4. 生产者（Producer）

### 4.1. 发送消息流程

发送消息流程如下图，需要注意的有：

- 分区器 Partitioner，分区器决定了一个消息被分配到哪个分区。在我们创建消息时，我们可以选择性指定一个键值 key 或者分区 Partition，如果传入的是 key，则通过图中的分区器 Partitioner 选择一个分区来保存这个消息；如果 key 和 Partition 都没有指定，则会默认生成一个 key。
- 批次传输。**批次，就是一组消息，这些消息属于同一个主题和分区**。发送时，会把消息分成批次 Batch 传输，如果每一个消息发送一次，会导致大量的网路开销，
- 如果消息成功写入 kafka，就返回一个 RecoredMetaData 对象，它包含了主题和分区信息，以及记录在分区里的偏移量。
- 如果消息发送失败，可以进行重试，重试次数可以在配置中指定。

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-3cfae88715795068.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

生产者在向 broker 发送消息时是怎么确定向哪一个 broker 发送消息？

- 生产者客户端会向任一个 broker 发送一个元数据请求（MetadataRequest），获取到每一个分区对应的 leader 信息，并缓存到本地。
- step2:生产者在发送消息时，会指定 Partition 或者通过 key 得到到一个 Partition，然后根据 Partition 从缓存中获取相应的 leader 信息。

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-3d7aab3ba2ba13f8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

### 4.2. 发送消息方式

#### 4.2.1. 发送并忘记（fire-and-forget）

代码如下，直接通过 send 方法来发送

```java
ProducerRecord<String, String> record =
            new ProducerRecord<>("CustomerCountry", "Precision Products", "France");
    try {
            producer.send(record);
    } catch (Exception e) {
            e.printStackTrace();
}
```

#### 4.2.2. 同步发送

代码如下，与“发送并忘记”的方式区别在于多了一个 get()方法，会一直阻塞等待 broker 返回结果：

```java
ProducerRecord<String, String> record =
            new ProducerRecord<>("CustomerCountry", "Precision Products", "France");
    try {
            producer.send(record).get();
    } catch (Exception e) {
            e.printStackTrace();
}
```

#### 4.2.3. 异步发送

代码如下，异步方式相对于“发送并忘记”的方式的不同在于，在异步返回时可以执行一些操作，如记录错误或者成功日志。

首先，定义一个 callback

```java
private class DemoProducerCallback implements Callback {
      @Override
        public void onCompletion(RecordMetadata recordMetadata, Exception e) {
           if (e != null) {
               e.printStackTrace();
             }
        }
}
```

然后，使用这个 callback

```java
ProducerRecord<String, String> record =
            new ProducerRecord<>("CustomerCountry", "Biomedical Materials", "USA");
producer.send(record, new DemoProducerCallback());
```

#### 4.2.4. 发送消息示例

```java
import java.util.Properties;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;

/**
 * Kafka 生产者生产消息示例 生产者配置参考：https://kafka.apache.org/documentation/#producerconfigs
 */
public class ProducerDemo {
    private static final String HOST = "localhost:9092";

    public static void main(String[] args) {
        // 1. 指定生产者的配置
        Properties properties = new Properties();
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, HOST);
        properties.put(ProducerConfig.ACKS_CONFIG, "all");
        properties.put(ProducerConfig.RETRIES_CONFIG, 0);
        properties.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
        properties.put(ProducerConfig.LINGER_MS_CONFIG, 1);
        properties.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
            "org.apache.kafka.common.serialization.StringSerializer");
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
            "org.apache.kafka.common.serialization.StringSerializer");

        // 2. 使用配置初始化 Kafka 生产者
        Producer<String, String> producer = new KafkaProducer<>(properties);

        try {
            // 3. 使用 send 方法发送异步消息
            for (int i = 0; i < 100; i++) {
                String msg = "Message " + i;
                producer.send(new ProducerRecord<>("HelloWorld", msg));
                System.out.println("Sent:" + msg);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 4. 关闭生产者
            producer.close();
        }
    }
}
```

## 5. 消费者（Consumer）

### 5.1. 消费者和消费者群组

#### 5.1.1. 消费者介绍

消费者以**pull 方式**从 broker 拉取消息，消费者可以订阅一个或多个主题，然后按照消息生成顺序（**kafka 只能保证分区中消息的顺序**）读取消息。

**一个消息消息只有在所有跟随者节点都进行了同步，才会被消费者获取到**。如下图，只能消费 Message0、Message1、Message2：

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-360a63cf628c7b3f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

#### 5.1.2. 消费者分区组

消费者群组可以实现并发的处理消息。一个消费者群组作为消费一个 topic 消息的单元，每一个 Partition 只能隶属于一个消费者群组中一个 customer，如下图

<div align="center">
<img src="http://www.heartthinkdo.com/wp-content/uploads/2018/05/6-1-259x300.png" />
</div>

#### 5.1.3. 消费者区组的再均衡

当在群组里面 新增/移除消费者 或者 新增/移除 kafka 集群 broker 节点 时，群组协调器 Broker 会触发再均衡，重新为每一个 Partition 分配消费者。**再均衡期间，消费者无法读取消息，造成整个消费者群组一小段时间的不可用。**

- 新增消费者。customer 订阅主题之后，第一次执行 poll 方法
- 移除消费者。执行 customer.close()操作或者消费客户端宕机，就不再通过 poll 向群组协调器发送心跳了，当群组协调器检测次消费者没有心跳，就会触发再均衡。
- 新增 broker。如重启 broker 节点
- 移除 broker。如 kill 掉 broker 节点。

**再均衡是是通过消费者群组中的称为“群主”消费者客户端进行的**。什么是群主呢？“群主”就是第一个加入群组的消费者。消费者第一次加入群组时，它会向群组协调器发送一个 JoinGroup 的请求，如果是第一个，则此消费者被指定为“群主”（群主是不是和 qq 群很想啊，就是那个第一个进群的人）。

群主分配分区的过程如下：

1.  群主从群组协调器获取群组成员列表，然后给每一个消费者进行分配分区 Partition。
2.  两个分配策略：Range 和 RoundRobin。
    - Range 策略，就是把若干个连续的分区分配给消费者，如存在分区 1-5，假设有 3 个消费者，则消费者 1 负责分区 1-2,消费者 2 负责分区 3-4，消费者 3 负责分区 5。
    - RoundRoin 策略，就是把所有分区逐个分给消费者，如存在分区 1-5，假设有 3 个消费者，则分区 1->消费 1，分区 2->消费者 2，分区 3>消费者 3，分区 4>消费者 1，分区 5->消费者 2。
3.  群主分配完成之后，把分配情况发送给群组协调器。
4.  群组协调器再把这些信息发送给消费者。**每一个消费者只能看到自己的分配信息，只有群主知道所有消费者的分配信息**。

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-fd4ab296c5dbeb24.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

### 5.2. 消费消息流程

#### 5.2.1. 消费流程 demo

具体步骤如下

- step1 创建消费者。
- step2 订阅主题。除了订阅主题方式外还有使用指定分组的模式，但是常用方式都是订阅主题方式
- stpe3 轮询消息。通过 poll 方法轮询。
- stpe4 关闭消费者。在不用消费者之后，会执行 close 操作。close 操作会关闭 socket，并触发当前消费者群组的再均衡。

```java
    // 1.构建KafkaCustomer
    Consumer consumer = buildCustomer();

    // 2.设置主题
    consumer.subscribe(Arrays.asList(topic));

    // 3.接受消息
    try {
        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(500);
            System.out.println("customer Message---");
            for (ConsumerRecord<String, String> record : records)

                // print the offset,key and value for the consumer records.
                System.out.printf("offset = %d, key = %s, value = %s\n",
                        record.offset(), record.key(), record.value());
        }
    } finally {
        // 4.关闭消息
            consumer.close();
    }
```

创建消费者的代码如下：

```java
public Consumer buildCustomer() {
    Properties props = new Properties();
    // bootstrap.servers是Kafka集群的IP地址。多个时,使用逗号隔开
    props.put("bootstrap.servers", "localhost:9092");
    // 消费者群组
    props.put("group.id", "test");
    props.put("enable.auto.commit", "true");
    props.put("auto.commit.interval.ms", "1000");
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

#### 5.2.2. 消费消息方式

分为订阅主题和指定分组两种方式：

- 消费者分组模式。通过订阅主题方式时，消费者必须加入到消费者群组中，即消费者必须有一个自己的分组；
- 独立消费者模式。这种模式就是消费者是独立的不属于任何消费者分组，自己指定消费那些 Partition。

1、订阅主题方式

```java
consumer.subscribe(Arrays.asList(topic));
```

2、独立消费者模式

通过 consumer 的 assign(Collection<TopicPartition> partitions)方法来为消费者指定分区。

```java
public void consumeMessageForIndependentConsumer(String topic){
    // 1.构建KafkaCustomer
    Consumer consumer = buildCustomer();

    // 2.指定分区
    // 2.1获取可用分区
    List<PartitionInfo> partitionInfoList = buildCustomer().partitionsFor(topic);
    // 2.2指定分区,这里是指定了所有分区,也可以指定个别的分区
    if(null != partitionInfoList){
        List<TopicPartition> partitions = Lists.newArrayList();
        for(PartitionInfo partitionInfo : partitionInfoList){
            partitions.add(new TopicPartition(partitionInfo.topic(),partitionInfo.partition()));
        }
        consumer.assign(partitions);
    }

    // 3.接受消息
    while (true) {
        ConsumerRecords<String, String> records = consumer.poll(500);
        System.out.println("consume Message---");
        for (ConsumerRecord<String, String> record : records) {

            // print the offset,key and value for the consumer records.
            System.out.printf("offset = %d, key = %s, value = %s\n",
                    record.offset(), record.key(), record.value());

            // 异步提交
            consumer.commitAsync();


        }
    }
}
```

#### 5.2.3. 轮询获取消息

通过 poll 来获取消息，但是获取消息时并不是立刻返回结果，需要考虑两个因素：

- 消费者通过 customer.poll(time)中设置的等待时间
- broker 会等待累计一定量数据，然后发送给消费者。这样可以减少网络开销。

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-d7d111e7c7e7f504.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

poll 处了获取消息外，还有其他作用，如下：

- 发送心跳信息。消费者通过向被指派为群组协调器的 broker 发送心跳来维护他和群组的从属关系，当机器宕掉后，群组协调器触发再分配

### 5.3. 提交偏移量

#### 5.3.1. 偏移量和提交

（1）偏移量

偏移量 offeset，是指一个消息在分区中位置。在通过生产者向 kafka 推送消息返回的结果中包含了这个偏移量值，或者在消费者拉取信息时，也会包含消息的偏移量信息。

（2）提交的解释

我们把消息的偏移量提交到 kafka 的操作叫做**提交或提交偏移量。**

（3）偏移量的应用

目前会有两个位置记录这个偏移量：

a. Kafka Broker 保存。消费者通过提交操作，把读取分区中最新消息的偏移量更新到 kafka 服务器端（老版本的 kafka 是保存在 zookeeper 中），即消费者往一个叫做\_consumer_offset 的特殊主题发送消息，消息里面包消息的偏移量信息,**并且该主题配置清理策略是 compact，即对于每一个 key 只保存最新的值（key 由 groupId、topic 和 partition 组成）**。关于提交操作在本节进行讨论。

如果消费者一直处于运行状态，这个偏移量是没有起到作用，只有当加入或者删除一个群组里消费者，然后进行再均衡操作只有，此时为了可以继续之前工作，新的消费者需要知道上一个消费者处理这个分区的位置信息。

b. 消费者客户端保存。消费者客户端会保存 poll()每一次执行后的最后一个消息的偏移量，这样每次执行轮询操作 poll 时，都从这个位置获取信息。这个信息修改可以通过后续小节中三个 seek 方法来修改。

（4）提交时会遇到两个问题

a. 重复处理

当提交的偏移量小于客户端处理的最后一个消息的偏移量时，会出现重复处理消息的问题，如下图

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-75abe308f9cf21f8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

b. 消息丢失

当提交的偏移量大于客户端处理的最后端最后一个消息的偏移量，会出现消息丢失的问题，如下图：

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-68b1e5fdc020d0f1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

（5）提交方式

主要分为：自动提交和手动提交。

a. 自动提交

auto.commit.commit ,默认为 true 自动提交，自动提交时通过轮询方式来做，时间间通过 auto.commit.interval.ms 属性来进行设置。

b. 手动提交

除了自动提交，还可以进行手动提交，手动提交就是通过代码调用函数的方式提交，在使用手动提交时首先需要将 auto.commit.commit 设置为 false，目前有三种方式：同步提交、异步提交、同步和异步结合。

#### 5.3.2. 同步提交

可以通过 commitSync 来进行提交，**同步提交会一直提交直到成功**。如下

```java
public void customerMessageWithSyncCommit(String topic) {
    // 1.构建KafkaCustomer
    Consumer consumer = buildCustomer();

    // 2.设置主题
    consumer.subscribe(Arrays.asList(topic));

    // 3.接受消息
    while (true) {
        ConsumerRecords<String, String> records = consumer.poll(500);
        System.out.println("customer Message---");
        for (ConsumerRecord<String, String> record : records) {

            // print the offset,key and value for the consumer records.
            System.out.printf("offset = %d, key = %s, value = %s\n",
                    record.offset(), record.key(), record.value());


            // 同步提交
            try {
                consumer.commitSync();
            } catch (Exception e) {
                logger.error("commit error");
            }
        }
    }
}
```

#### 5.3.3. 异步提交

同步提交一个缺点是，在进行提交 commitAysnc()会阻塞整个下面流程。所以引入了异步提交 commitAsync()，如下代码，这里定义了 OffsetCommitCallback，也可以只进行 commitAsync()，不设置任何参数。

```java
public void customerMessageWithAsyncCommit(String topic) {
    // 1.构建KafkaCustomer
    Consumer consumer = buildCustomer();

    // 2.设置主题
    consumer.subscribe(Arrays.asList(topic));

    // 3.接受消息
    while (true) {
        ConsumerRecords<String, String> records = consumer.poll(500);
        System.out.println("customer Message---");
        for (ConsumerRecord<String, String> record : records) {

            // print the offset,key and value for the consumer records.
            System.out.printf("offset = %d, key = %s, value = %s\n",
                    record.offset(), record.key(), record.value());

            // 异步提交
            consumer.commitAsync(new OffsetCommitCallback() {
                public void onComplete(Map<TopicPartition, OffsetAndMetadata> offsets, Exception e) {
                    if (e != null) {
                        logger.error("Commit failed for offsets{}", offsets, e);
                    }
                }
            });


        }
    }
}
```

#### 5.3.4. 同步和异步提交

代码如下：

```java
public void customerMessageWithSyncAndAsyncCommit(String topic) {
    // 1.构建KafkaCustomer
    Consumer consumer = buildCustomer();

    // 2.设置主题
    consumer.subscribe(Arrays.asList(topic));

    // 3.接受消息
    try {
        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(500);
            System.out.println("customer Message---");
            for (ConsumerRecord<String, String> record : records) {

                // print the offset,key and value for the consumer records.
                System.out.printf("offset = %d, key = %s, value = %s\n",
                        record.offset(), record.key(), record.value());

                // 异步提交
                consumer.commitAsync();
            }
        }
    } catch (Exception e) {

    } finally {
        // 同步提交
        try {
            consumer.commitSync();
        } finally {
            consumer.close();
        }
    }
}
```

### 5.4. 从指定偏移量获取数据

我们读取消息是通过 poll 方法。它根据消费者客户端本地保存的当前偏移量来获取消息。如果我们需要从指定偏移量位置获取数据，此时就需要修改这个值为我们想要读取消息开始的地方，目前有如下三个方法：

- seekToBeginning(Collection<TopicPartition> partitions)。可以修改分区当前偏移量为分区的起始位置、
- seekToEnd(Collection<TopicPartition> partitions)。可以修改分区当前偏移量为分区的末尾位置
- seek(TopicPartition partition, long offset); 可以修改分区当前偏移量为分区的起始位置

通过 seek(TopicPartition partition, long offset)可以实现处理消息和提交偏移量在一个事务中完成。思路就是需要在可短建立一个数据表，保证处理消息和和消息偏移量位置写入到这个数据表在一个事务中，此时就可以保证处理消息和记录偏移量要么同时成功，要么同时失败。代码如下：

```java
    consumer.subscribe(topic);
    // 1.第一次调用pool,加入消费者群组
    consumer.poll(0);
    // 2.获取负责的分区，并从本地数据库读取改分区最新偏移量，并通过seek方法修改poll获取消息的位置
    for (TopicPartition partition: consumer.assignment())
        consumer.seek(partition, getOffsetFromDB(partition));

    while (true) {
        ConsumerRecords<String, String> records =
        consumer.poll(100);
        for (ConsumerRecord<String, String> record : records)
        {
            processRecord(record);
            storeRecordInDB(record);
            storeOffsetInDB(record.topic(), record.partition(),
            record.offset());
        }
        commitDBTransaction();
    }
```

## 6. Broker

### 6.1. 集群控制器

控制器除了具有一般 broker 的功能，还负责分区 leader 的选举。

### 6.2. 分区 leader 和 follower

Kafka 在 0.8 以前的版本中，如果一个 broker 机器宕机了，其上面的 Partition 都不能用了。为了实现 High Availablity，引入了复制功能，即一个 Partition 还会在其他的 broker 上面进行备份。为了实现复制功能，引入了分区 leader 和 follower：

（1）Leader 作用

生产者和消费者请求都会经过这个 leader。Producer 和 Concumer 往一个 Partition 写入和读取消息时，都会首先查找这个 Partition 的 leader

保存那些 follower 节点的状态与自己是一致的。

（2）follower 作用：

定时通过类似消费者的 poll 方法从 leader 中获取消息，进行备份

同一个 topic 的不同 Partition 会分布在多个 broker 上，而且一个 Partition 还会在其他的 broker 上面进行备份，Producer 在发布消息到某个 Partition 时，先找到该 Partition 的 Leader，然后向这个 leader 推送消息；每个 Follower 都从 Leader 拉取消息，拉取消息成功之后，向 leader 发送一个 ack 确认。如下一个流程图：

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-371ef1888b65edc9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

### 6.3. 群组协调器

群组协调器，顾名思义就是维护消费者群组 ，消费者通过向被指派为群组协调器的 broker（不同的群组可以有不同的协调器）发送心跳来维护它们和群组的从属关系，以及它们对分区的所有权。

1、触发再均衡

只要消费者以正常的时间间隔发送心跳，就会被认为是活跃的。消费者是通过 poll 获取消息时，发送的心跳的，当消费者客户端宕机之后，群组协调器在一段内没有收到心跳，则此时会认为消费者已死亡，然后触发一次再均衡。具体再均衡流程，可以参考上面的“再均衡”小节。

## 7. Zookeeper 集群

### 7.1. 节点信息

参考：<https://cwiki.apache.org/confluence/display/KAFKA/Kafka+data+structures+in+Zookeeper>

Zookeeper 保存的就是节点信息和节点状态，不会保存 kafka 的消息信息，节点信息包括：

- broker。broer 启动时在 zookeeper 注册、并通过 watcher 监听 broker 节点变化；并且还记录 topic 和 Partition 的信息。
- consumers,消费者节点信息
- admin
- config
- controller 和 controloer_epoch

<div align="center">
<img src="http://upload-images.jianshu.io/upload_images/3101171-8074b42933b41d33.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" />
</div>

#### 7.1.1. broker

（1）Topic 的注册信息

作用：在创建 zookeeper 时，注册 topic 的 Partition 信息，包括每一个分区的复制节点 id。

路径：/brokers/topics/[topic]

数据格式：

```json
Schema:
{ "fields" :
    [ {"name": "version", "type": "int", "doc": "version id"},
      {"name": "partitions",
       "type": {"type": "map",
                "values": {"type": "array", "items": "int", "doc": "a list of replica ids"},
                "doc": "a map from partition id to replica list"},
      }
    ]
}
Example:
{
  "version": 1,
  "partitions": {"0": [0, 1, 3] } }   # 分区0的对应的复制节点是0、1、3.
}
```

（2）分区信息

作用：记录分区信息，如分区的 leader 信息

路径信息：/brokers/topics/[topic]/partitions/[partitionId]/state

格式：

```json
Schema:
{ "fields":
    [ {"name": "version", "type": "int", "doc": "version id"},
      {"name": "isr",
       "type": {"type": "array",
                "items": "int",
                "doc": "an array of the id of replicas in isr"}
      },
      {"name": "leader", "type": "int", "doc": "id of the leader replica"},
      {"name": "controller_epoch", "type": "int", "doc": "epoch of the controller that last updated the leader and isr info"},
      {"name": "leader_epoch", "type": "int", "doc": "epoch of the leader"}
    ]
}

Example:
{
  "version": 1,
  "isr": [0,1],
  "leader": 0,
  "controller_epoch": 1,
  "leader_epoch": 0
}
```

（3）broker 信息

作用：在 borker 启动时，向 zookeeper 注册节点信息

路径：/brokers/ids/[brokerId]

数据格式：

```json
Schema:
{ "fields":
    [ {"name": "version", "type": "int", "doc": "version id"},
      {"name": "host", "type": "string", "doc": "ip address or host name of the broker"},
      {"name": "port", "type": "int", "doc": "port of the broker"},
      {"name": "jmx_port", "type": "int", "doc": "port for jmx"}
    ]
}

Example:
{
  "version": 1,
  "host": "192.168.1.148",
  "port": 9092,
  "jmx_port": 9999
}
```

#### 7.1.2. controller 和 controller_epoch

（1）控制器的 epoch:

/controller_epoch -> int (epoch)

（2）控制器的注册信息:

/controller -> int (broker id of the controller)

#### 7.1.3. consumer

（1）消费者注册信息:

路径：/consumers/[groupId]/ids/[consumerId]

数据格式：

```json
Schema:
{ "fields":
    [ {"name": "version", "type": "int", "doc": "version id"},
      {"name": "pattern", "type": "string", "doc": "can be of static, white_list or black_list"},
      {"name": "subscription", "type" : {"type": "map", "values": {"type": "int"},
                                         "doc": "a map from a topic or a wildcard pattern to the number of streams"}      }    ]
}

Example:
A static subscription:
{
  "version": 1,
  "pattern": "static",
  "subscription": {"topic1": 1, "topic2": 2}
}


A whitelist subscription:
{
  "version": 1,
  "pattern": "white_list",
  "subscription": {"abc": 1}
}

A blacklist subscription:
{
  "version": 1,
  "pattern": "black_list",
  "subscription": {"abc": 1}
}
```

#### 7.1.4. admin

（1）Re-assign partitions

路径：/admin/reassign_partitions

数据格式：

```json
{
   "fields":[
      {
         "name":"version",
         "type":"int",
         "doc":"version id"
      },
      {
         "name":"partitions",
         "type":{
            "type":"array",
            "items":{
               "fields":[
                  {
                     "name":"topic",
                     "type":"string",
                     "doc":"topic of the partition to be reassigned"
                  },
                  {
                     "name":"partition",
                     "type":"int",
                     "doc":"the partition to be reassigned"
                  },
                  {
                     "name":"replicas",
                     "type":"array",
                     "items":"int",
                     "doc":"a list of replica ids"
                  }
               ],
            }
            "doc":"an array of partitions to be reassigned to new replicas"
         }
      }
   ]
}

Example:
{
  "version": 1,
  "partitions":
     [
        {
            "topic": "Foo",
            "partition": 1,
            "replicas": [0, 1, 3]
        }
     ]
}
```

（2）Preferred replication election

路径：/admin/preferred_replica_election

数据格式：

```json
{
   "fields":[
      {
         "name":"version",
         "type":"int",
         "doc":"version id"
      },
      {
         "name":"partitions",
         "type":{
            "type":"array",
            "items":{
               "fields":[
                  {
                     "name":"topic",
                     "type":"string",
                     "doc":"topic of the partition for which preferred replica election should be triggered"
                  },
                  {
                     "name":"partition",
                     "type":"int",
                     "doc":"the partition for which preferred replica election should be triggered"
                  }
               ],
            }
            "doc":"an array of partitions for which preferred replica election should be triggered"
         }
      }
   ]
}

Example:

{
  "version": 1,
  "partitions":
     [
        {
            "topic": "Foo",
            "partition": 1
        },
        {
            "topic": "Bar",
            "partition": 0
        }
     ]
}
```

（3）Delete topics

/admin/delete_topics/[topic_to_be_deleted] (the value of the path in empty)

#### 7.1.5. config

Topic Configuration

/config/topics/[topic_name]

数据格式：

```json
{
  "version": 1,
  "config": {
    "config.a": "x",
    "config.b": "y",
    ...
  }
}
```

### 7.2. zookeeper 一些总结

离开了 Zookeeper, Kafka 不能对 Topic 进行新增操作, 但是仍然可以 produce 和 consume 消息.

## 8. 资料

- [Kafka(03) Kafka 介绍](http://www.heartthinkdo.com/?p=2006#233)
