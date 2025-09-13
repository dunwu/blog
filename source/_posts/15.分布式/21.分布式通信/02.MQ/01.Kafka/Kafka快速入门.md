---
icon: logos:kafka-icon
title: Kafka 快速入门
date: 2020-06-03 09:55:35
categories:
  - 分布式
  - 分布式通信
  - MQ
  - Kafka
tags:
  - mq
  - kafka
permalink: /pages/d6ebb57d/
---

# Kafka 快速入门

## Kafka 简介

**Apache Kafka 是一款开源的消息引擎系统，也是一个分布式流计算平台，此外，还可以作为数据存储**。

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javaweb/distributed/mq/kafka/kafka-event-system.png)

### Kafka 的功能

Kafka 的核心功能如下：

- **消息引擎** - Kafka 可以作为一个消息引擎系统。
- **流处理** - Kafka 可以作为一个分布式流处理平台。
- **存储** - Kafka 可以作为一个安全的分布式存储。

### Kafka 的特性

Kafka 的设计目标：

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

### Kafka 术语

- **消息**：Kafka 的数据单元被称为消息。消息由字节数组组成。
- **批次**：批次就是一组消息，这些消息属于同一个主题和分区。
- **主题（Topic）**：Kafka 消息通过主题进行分类。主题就类似数据库的表。
  - 不同主题的消息是物理隔离的；
  - 同一个主题的消息保存在一个或多个 Broker 上。但用户只需指定消息的 Topic 即可生产或消费数据而不必关心数据存于何处。
  - 主题有一个或多个分区。
- **分区（Partition）**：分区是一个有序不变的消息序列，消息以追加的方式写入分区，然后以先入先出的顺序读取。Kafka 通过分区来实现数据冗余和伸缩性。
- **消息偏移量（Offset）**：表示分区中每条消息的位置信息，是一个单调递增且不变的值。
- **生产者（Producer）**：生产者是向主题发布新消息的 Kafka 客户端。生产者可以将数据发布到所选择的主题中。生产者负责将记录分配到主题中的哪一个分区中。
- **消费者（Consumer）**：消费者是从主题订阅新消息的 Kafka 客户端。消费者通过检查消息的偏移量来区分消息是否已读。
- **消费者群组（Consumer Group）**：多个消费者共同构成的一个群组，同时消费多个分区以实现高并发。
  - 每个消费者属于一个特定的消费者群组（可以为每个消费者指定消费者群组，若不指定，则属于默认的群组）。
  - 群组中，一个消费者可以消费多个分区。
  - 群组中，每个分区只能被指定给一个消费者。
- **再均衡（Rebalance）**：消费者群组内某个消费者实例挂掉后，其他消费者实例自动重新分配订阅主题分区的过程。分区再均衡是 Kafka 消费者端实现高可用的重要手段。
- **Broker** - 一个独立的 Kafka 服务器被称为 Broker。Broker 接受来自生产者的消息，为消息设置偏移量，并提交消息到磁盘保存；消费者向 Broker 请求消息，Broker 负责返回已提交的消息。
- **副本（Replica）**：Kafka 中同一条消息能够被拷贝到多个地方以提供数据冗余，这些地方就是所谓的副本。副本还分为领导者副本和追随者副本，各自有不同的角色划分。副本是在分区层级下的，即每个分区可配置多个副本实现高可用。

### Kafka 发行版本

Kafka 主要有以下发行版本：

- **Apache Kafka**：也称社区版 Kafka。优势在于迭代速度快，社区响应度高，使用它可以让你有更高的把控度；缺陷在于仅提供基础核心组件，缺失一些高级的特性。
- **Confluent Kafka**：Confluent 公司提供的 Kafka。优势在于集成了很多高级特性且由 Kafka 原班人马打造，质量上有保证；缺陷在于相关文档资料不全，普及率较低，没有太多可供参考的范例。
- **CDH/HDP Kafka**：大数据云公司提供的 Kafka，内嵌 Apache Kafka。优势在于操作简单，节省运维成本；缺陷在于把控度低，演进速度较慢。

### Kafka 重大版本

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

## Kafka 服务端使用入门

### 步骤一、获取 Kafka

下载最新的 Kafka 版本并解压到本地。

```bash
$ tar -xzf kafka_2.13-2.7.0.tgz
$ cd kafka_2.13-2.7.0
```

### 步骤二、启动 Kafka 环境

> 注意：本地必须已安装 Java8

执行以下指令，保证所有服务按照正确的顺序启动：

```bash
# Start the ZooKeeper service
# Note: Soon, ZooKeeper will no longer be required by Apache Kafka.
$ bin/zookeeper-server-start.sh config/zookeeper.properties
```

打开另一个终端会话，并执行：

```bash
# Start the Kafka broker service
$ bin/kafka-server-start.sh config/server.properties
```

一旦所有服务成功启动，您就已经成功运行了一个基本的 kafka 环境。

### 步骤三、创建一个 TOPIC 并存储您的事件

Kafka 是一个分布式事件流处理平台，它可以让您通过各种机制读、写、存储并处理事件（[_events_](https://kafka.apache.org/documentation/#messages)，也被称为记录或消息）

示例事件包括付款交易，手机的地理位置更新，运输订单，物联网设备或医疗设备的传感器测量等等。 这些事件被组织并存储在主题中（[_topics_](https://kafka.apache.org/documentation/#intro_concepts_and_terms)）。 简单来说，主题类似于文件系统中的文件夹，而事件是该文件夹中的文件。

因此，在您写入第一个事件之前，您必须先创建一个 Topic。执行以下指令：

```bash
$ bin/kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092
```

所有的 Kafka 命令行工具都有附加可选项：不加任何参数，运行 `kafka-topics.sh` 命令会显示使用信息。例如，会显示新 Topic 的分区数等细节。

```bash
$ bin/kafka-topics.sh --describe --topic quickstart-events --bootstrap-server localhost:9092
Topic:quickstart-events  PartitionCount:1    ReplicationFactor:1 Configs:
    Topic: quickstart-events Partition: 0    Leader: 0   Replicas: 0 Isr: 0
```

### 步骤四、向 Topic 写入 Event

Kafka 客户端和 Kafka Broker 的通信是通过网络读写 Event。一旦收到信息，Broker 会将其以您需要的时间（甚至永久化）、容错化的方式存储。

执行 `kafka-console-producer.sh` 命令将 Event 写入 Topic。默认，您输入的任意行会作为独立 Event 写入 Topic：

```bash
$ bin/kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092
This is my first event
This is my second event
```

> 您可以通过 `Ctrl-C` 在任何时候中断 `kafka-console-producer.sh`

### 步骤五、读 Event

执行 kafka-console-consumer.sh 以读取写入 Topic 中的 Event

```bash
$ bin/kafka-console-consumer.sh --topic quickstart-events --from-beginning --bootstrap-server localhost:9092
This is my first event
This is my second event
```

> 您可以通过 `Ctrl-C` 在任何时候中断 `kafka-console-consumer.sh`

由于 Event 被持久化存储在 Kafka 中，因此您可以根据需要任意多次地读取它们。 您可以通过打开另一个终端会话并再次重新运行上一个命令来轻松地验证这一点。

### 步骤六、通过 KAFKA CONNECT 将数据作为事件流导入/导出

您可能有大量数据，存储在传统的关系数据库或消息队列系统中，并且有许多使用这些系统的应用程序。 通过 [Kafka Connect](https://kafka.apache.org/documentation/#connect)，您可以将来自外部系统的数据持续地导入到 Kafka 中，反之亦然。 因此，将已有系统与 Kafka 集成非常容易。为了使此过程更加容易，有数百种此类连接器可供使用。

需要了解有关如何将数据导入和导出 Kafka 的更多信息，可以参考：[Kafka Connect section](https://kafka.apache.org/documentation/#connect) 章节。

### 步骤七、使用 Kafka Streams 处理事件

一旦将数据作为 Event 存储在 Kafka 中，就可以使用 [Kafka Streams](https://kafka.apache.org/documentation/streams) 的 Java / Scala 客户端。它允许您实现关键任务的实时应用程序和微服务，其中输入（和/或）输出数据存储在 Kafka Topic 中。

Kafka Streams 结合了 Kafka 客户端编写和部署标准 Java 和 Scala 应用程序的简便性，以及 Kafka 服务器集群技术的优势，使这些应用程序具有高度的可伸缩性、弹性、容错性和分布式。该库支持一次性处理，有状态的操作，以及聚合、窗口化化操作、join、基于事件时间的处理等等。

```java
KStream<String, String> textLines = builder.stream("quickstart-events");

KTable<String, Long> wordCounts = textLines
            .flatMapValues(line -> Arrays.asList(line.toLowerCase().split(" ")))
            .groupBy((keyIgnored, word) -> word)
            .count();

wordCounts.toStream().to("output-topic"), Produced.with(Serdes.String(), Serdes.Long()));
```

[Kafka Streams demo](https://kafka.apache.org/25/documentation/streams/quickstart) 和 [app development tutorial](https://kafka.apache.org/25/documentation/streams/tutorial) 展示了如何从头到尾的编码并运行一个流式应用。

### 步骤八、终止 Kafka 环境

1. 如果尚未停止，请使用 `Ctrl-C` 停止生产者和消费者客户端。
2. 使用 `Ctrl-C` 停止 Kafka 代理。
3. 最后，使用 `Ctrl-C` 停止 ZooKeeper 服务器。

如果您还想删除本地 Kafka 环境的所有数据，包括您在此过程中创建的所有事件，请执行以下命令：

```bash
$ rm -rf /tmp/kafka-logs /tmp/zookeeper
```

## Kafka Java 客户端使用入门

### 引入 maven 依赖

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

### Kafka 核心 API

Kafka 有 5 个核心 API

- [Producer API](https://kafka.apache.org/documentation.html#producerapi) - 允许一个应用程序发布一串流式数据到一个或者多个 Kafka Topic。
- [Consumer API](https://kafka.apache.org/documentation.html#consumerapi) - 允许一个应用程序订阅一个或多个 Kafka Topic，并且对发布给他们的流式数据进行处理。
- [Streams API](https://kafka.apache.org/documentation/streams) - 允许一个应用程序作为一个流处理器，消费一个或者多个 Kafka Topic 产生的输入流，然后生产一个输出流到一个或多个 Kafka Topic 中去，在输入输出流中进行有效的转换。
- [Connector API](https://kafka.apache.org/documentation.html#connect) - 允许构建并运行可重用的生产者或者消费者，将 Kafka Topic 连接到已存在的应用程序或数据库。例如，连接到一个关系型数据库，捕捉表的所有变更内容。
- [Admin API](https://kafka.apache.org/documentation/#adminapi) - 支持管理和检查 Topic，Broker，ACL 和其他 Kafka 对象。

### 发送消息

#### 发送并忽略返回

代码如下，直接通过 `send` 方法来发送

```java
ProducerRecord<String, String> record =
            new ProducerRecord<>("CustomerCountry", "Precision Products", "France");
    try {
            producer.send(record);
    } catch (Exception e) {
            e.printStackTrace();
}
```

#### 同步发送

代码如下，与“发送并忘记”的方式区别在于多了一个 `get` 方法，会一直阻塞等待 `Broker` 返回结果：

```java
ProducerRecord<String, String> record =
            new ProducerRecord<>("CustomerCountry", "Precision Products", "France");
    try {
            producer.send(record).get();
    } catch (Exception e) {
            e.printStackTrace();
}
```

#### 异步发送

代码如下，异步方式相对于“发送并忽略返回”的方式的不同在于：在异步返回时可以执行一些操作，如记录错误或者成功日志。

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

#### 发送消息示例

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

### 消费消息流程

#### 消费流程

具体步骤如下：

1. 创建消费者。
2. 订阅主题。除了订阅主题方式外还有使用指定分组的模式，但是常用方式都是订阅主题方式
3. 轮询消息。通过 poll 方法轮询。
4. 关闭消费者。在不用消费者之后，会执行 close 操作。close 操作会关闭 socket，并触发当前消费者群组的再均衡。

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

#### 消费消息方式

分为订阅主题和指定分组两种方式：

- 消费者分组模式。通过订阅主题方式时，消费者必须加入到消费者群组中，即消费者必须有一个自己的分组；
- 独立消费者模式。这种模式就是消费者是独立的不属于任何消费者分组，自己指定消费那些 `Partition`。

（1）订阅主题方式

```java
consumer.subscribe(Arrays.asList(topic));
```

（2）独立消费者模式

通过 consumer 的 `assign(Collection<TopicPartition> partitions)` 方法来为消费者指定分区。

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
  - [Kafka(03) Kafka 介绍](http://www.heartthinkdo.com/?p=2006#233)