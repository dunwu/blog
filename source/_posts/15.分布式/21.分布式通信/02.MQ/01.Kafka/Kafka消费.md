---
icon: logos:kafka-icon
title: Kafka 消费
date: 2021-04-14 15:05:34
categories:
  - 分布式
  - 分布式通信
  - MQ
  - Kafka
tags:
  - mq
  - kafka
permalink: /pages/50068496/
---

# Kafka 消费

## 消费者简介

### 获取消息模式

消息引擎获取消息有两种模式：

- **push 模式** - MQ 推送数据给消费者
- **pull 模式** - 消费者主动向 MQ 请求数据

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502031317162.png)

Kafka 消费者（Consumer）以 pull 方式从 Broker 拉取消息。相比于 push 方式，pull 方式灵活度和扩展性更好，因为消费的主动性由消费者自身控制。

push 模式的优缺点：

- 缺点：由 broker 决定消息推送的速率，对于不同消费速率的 consumer 就不太好处理了。push 模式下，当 broker 推送的速率远大于 consumer 消费的速率时，consumer 恐怕就要崩溃了。

push 模式的优缺点：

- 优点：consumer 可以根据自己的消费能力自主的决定消费策略
- 缺点：如果 broker 没有可供消费的消息，将导致 consumer 不断在循环中轮询，直到新消息到达。为了避免这点，Kafka 有个参数可以让 consumer 阻塞直到新消息到达

### 消费者

每个 Consumer 的唯一元数据是该 Consumer 在日志中消费的位置。这个偏移量是由 Consumer 控制的：Consumer 通常会在读取记录时线性的增加其偏移量。但实际上，由于位置由 Consumer 控制，所以 Consumer 可以采用任何顺序来消费记录。

**一条消息只有被提交，才会被消费者获取到**。如下图，只能消费 Message0、Message1、Message2：

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200621113917.png)

### 消费者群组

**Consumer Group 是 Kafka 提供的可扩展且具有容错性的消费者机制**。

Kafka 的写入数据量很庞大，如果只有一个消费者，消费消息速度很慢，时间长了，就会造成数据积压。为了减少数据积压，Kafka 支持消费者群组，可以让多个消费者并发消费消息，对数据进行分流。

Kafka 消费者从属于消费者群组，**一个群组里的 Consumer 订阅同一个 Topic，一个主题有多个 Partition，每一个 Partition 只能隶属于消费者群组中的一个 Consumer**。

如果超过主题的分区数量，那么有一部分消费者就会被闲置，不会接收到任何消息。

同一时刻，**一条消息只能被同一消费者组中的一个消费者实例消费**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070722981.png)

**不同消费者群组之间互不影响**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070723165.png)

### 消费流程

Kafka 消费者通过 `poll` 模式来获取消息，但是获取消息时并不是立刻返回结果，需要考虑两个因素：

- 消费者通过 `customer.poll(time)` 中设置等待时间
- Broker 会等待累计一定量数据，然后发送给消费者。这样可以减少网络开销。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070724283.png)

poll 除了获取消息外，还有其他作用：

- **发送心跳信息**。消费者通过向被指派为群组协调器的 Broker 发送心跳来维护他和群组的从属关系，当机器宕掉后，群组协调器触发再均衡。

## 消费者 API

### 创建消费者

```java
Properties props = new Properties();
// 服务器地址
props.put("bootstrap.servers", "localhost:9092");
// 消费者群组
props.put("group.id", "test");
// 关闭自动提交偏移量
props.put("enable.auto.commit", "false");
// 设置 key 反序列化器
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
// 设置 value 反序列化器
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
```

### 订阅主题

```java
// 订阅主题列表
consumer.subscribe(Arrays.asList("t1", "t2"));
// 订阅所有与 test 相关的主题
consumer.subscribe("test.*");
```

`subscribe` 方法允许传入一个正则表达式，这样就可以匹配多个主题。如果有人创建了新的主题，并且主题名恰好匹配正则表达式，那么会立即触发一次分区再均衡，消费者就可以读取新添加的主题。

### 轮询获取消息

消息轮询是消费者 API 的核心。一旦消费者订阅了主题，轮询就会处理所有细节，包括：群组协调、分区再均衡、发送心跳和获取数据。

```java
try {
    // 3. 轮询
    while (true) {
        // 4. 消费消息
        ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
        for (ConsumerRecord<String, String> record : records) {
            log.debug("topic = {}, partition = {}, offset = {}, key = {}, value = {}",
                record.topic(), record.partition(),
                record.offset(), record.key(), record.value());
        }
    }
} finally {
    // 5. 退出程序前，关闭消费者
    consumer.close();
}
```

### 手动提交偏移量

#### （1）同步提交

**使用 `commitSync()` 提交偏移量最简单也最可靠**。这个 API 会提交由 `poll()` 方法返回的最新偏移量，提交成功后马上返回，如果提交失败就抛出异常。

```java
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(100);
    for (ConsumerRecord<String, String> record : records) {
        System.out.printf("topic = %s, partition = %s, offset = %d, customer = %s, country = %s\n",
            record.topic(), record.partition(),
            record.offset(), record.key(), record.value());
    }
    try {
        consumer.commitSync();
    } catch (CommitFailedException e) {
        log.error("commit failed", e)
    }
}
```

同步提交的缺点：**同步提交方式会一直阻塞，直到接收到 Broker 的响应请求，这会大大限制吞吐量**。

#### （2）异步提交

**在成功提交或碰到无法恢复的错误之前，`commitSync()` 会一直重试，但是 `commitAsync()` 不会**，这也是 `commitAsync()` 不好的一个地方。**它之所以不进行重试，是因为在它收到服务器响应的时候，可能有一个更大的偏移量已经提交成功**。假设我们发出一个请求用于提交偏移量 2000，这个时候发生了短暂的通信问题，服务器收不到请求，自然也不会作出任何响应。与此同时，我们处理了另外一批消息，并成功提交了偏移量 3000。如果 `commitAsync()` 重新尝试提交偏移量 2000，它有可能在偏移量 3000 之后提交成功。这个时候**如果发生再均衡，就会出现重复消息**。

```java
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, String> record : records) {
        System.out.printf("topic = %s, partition = %s, offset = % d, customer = %s, country = %s\n ",
            record.topic(), record.partition(), record.offset(),
            record.key(), record.value());
    }
    consumer.commitAsync();
}
```

**`commitAsync()` 也支持回调**，在 Broker 作出响应时会执行回调。**回调经常被用于记录提交错误或生成度量指标，不过如果要用它来进行重试，则一定要注意提交的顺序**。

```java
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, String> record : records) {
        System.out.printf("topic = %s, partition = %s, offset = % d, customer = %s, country = %s\n ",
            record.topic(), record.partition(), record.offset(),
            record.key(), record.value());
    }
    consumer.commitAsync(new OffsetCommitCallback() {
        @Override
        public void onComplete(Map<TopicPartition, OffsetAndMetadata> offsets, Exception e) {
            if (e != null) { log.error("Commit failed for offsets {}", offsets, e); }
        }
    });
}
```

> **重试异步提交**
>
> 可以使用一个单调递增的序列号来维护异步提交的顺序。在每次提交偏移量之后或在回调里提交偏移量时递增序列号。在进行重试前，先检查回调的序列号和即将提交的偏移量是否相等，如果相等，说明没有新的提交，那么可以安全地进行重试；如果序列号比较大，说明有一个新的提交已经发送出去了，应该停止重试。

#### （3）同步和异步组合提交

一般情况下，针对偶尔出现的提交失败，不进行重试不会有太大问题，因为如果提交失败是因为临时问题导致的，那么后续的提交总会有成功的。但**如果这是发生在关闭消费者或再均衡前的最后一次提交，就要确保能够提交成功**。

因此，在消费者关闭前一般会组合使用 `commitSync()` 和 `commitAsync()`。

```java
try {
    while (true) {
        ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
        for (ConsumerRecord<String, String> record : records) {
            System.out.printf("topic = %s, partition = %s, offset = % d, customer = %s, country = %s\n ",
                record.topic(), record.partition(), record.offset(), record.key(), record.value());
        }
        consumer.commitAsync();
    }
} catch (Exception e) {
    log.error("Unexpected error", e);
} finally {
    try {
        consumer.commitSync();
    } finally {
        consumer.close();
    }
}
```

#### （4）提交特定的偏移量

提交偏移量的频率和处理消息批次的频率是一样的。如果想要更频繁地提交该怎么办？如果 `poll()` 方法返回一大批数据，为了避免因再均衡引起的重复处理整批消息，想要在批次中间提交偏移量该怎么办？这种情况无法通过调用 `commitSync()` 或 `commitAsync()` 来实现，因为它们只会提交最后一个偏移量，而此时该批次里的消息还没有处理完。

解决办法是：**消费者 API 允许在调用 `commitSync()` 和 `commitAsync()` 方法时传进去希望提交的分区和偏移量的 map**。

```java
private int count = 0;
private final Map<TopicPartition, OffsetAndMetadata> currentOffsets = new HashMap<>();


while (true) {
  ConsumerRecords<String, String> records = consumer.poll(100);
  for (ConsumerRecord<String, String> record : records) {
    System.out.printf("topic = %s, partition = %s, offset = % d, customer = %s, country = %s\n ",
                      record.topic(), record.partition(), record.offset(), record.key(), record.value());

    currentOffsets.put(new TopicPartition(record.topic(),
                                          record.partition()), new
                       OffsetAndMetadata(record.offset() + 1, "no metadata"));
    if (count % 1000 == 0) { consumer.commitAsync(currentOffsets, null); }
    count++;
  }
}
```

#### （5）从特定偏移量处开始处理

使用 `poll()` 方法可以从各个分区的最新偏移量处开始处理消息。

不过，有时候，我们可能需要从特定偏移量处开始处理消息。

- 从分区的起始位置开始读消息：`seekToBeginning(Collection<TopicPartition> partitions)` 方法
- 从分区的末尾位置开始读消息：`seekToEnd(Collection<TopicPartition> partitions)` 方法
- 查找偏移量：`seek(TopicPartition partition, long offset)` 方法

通过 `seek(TopicPartition partition, long offset)` 可以实现处理消息和提交偏移量在一个事务中完成。思路就是需要在客户端建立一张数据表，保证处理消息和和消息偏移量位置写入到这张数据表。在一个事务中，此时就可以保证处理消息和记录偏移量要么同时成功，要么同时失败。

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

### 关闭连接

**如果想让消费者从轮询消费消息的无限循环中退出，可以通过另一个线程调用 `consumer.wakeup()` 方法**。 **`consumer.wakeup()` 是消费者唯一一个可以从其他线程里安全调用的方法**。调用 `consumer.wakeup()` 可以退出 `poll()` ，并抛出 `WakeupException` 异常，或者如果调用 `consumer.wakeup()` 时线程没有等待轮询，那么异常将在下一轮调用 `poll()` 时抛出。

```java
Runtime.getRuntime().addShutdownHook(new Thread() {
    public void run() {
        System.out.println("Starting exit...");
        consumer.wakeup();
        try {
            mainThread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});

...

try {
    // looping until ctrl-c, the shutdown hook will cleanup on exit
    while (true) {
        ConsumerRecords<String, String> records =
            movingAvg.consumer.poll(1000);
        System.out.println(System.currentTimeMillis() +
            "--  waiting for data...");
        for (ConsumerRecord<String, String> record : records) {
            System.out.printf("offset = %d, key = %s, value = %s\n",
                record.offset(), record.key(), record.value());
        }
        for (TopicPartition tp: consumer.assignment())
            System.out.println("Committing offset at position:" +
                consumer.position(tp));
            movingAvg.consumer.commitSync();
    }
} catch (WakeupException e) {
    // ignore for shutdown
} finally {
    consumer.close();
    System.out.println("Closed consumer and we are done");
}
```

## 分区再均衡

### 什么是分区再均衡

分区的所有权从一个消费者转移到另一个消费者，这样的行为被称为**分区再均衡（Rebalance）**。**Rebalance 实现了消费者群组的高可用性和伸缩性**。

**Rebalance 本质上是一种协议，规定了一个 Consumer Group 下的所有 Consumer 如何达成一致，来分配订阅 Topic 的每个分区**。比如某个 Group 下有 20 个 Consumer 实例，它订阅了一个具有 100 个分区的 Topic。正常情况下，Kafka 平均会为每个 Consumer 分配 5 个分区。这个分配的过程就叫 Rebalance。

当在群组里面新增/移除消费者或者新增/移除 kafka 集群 broker 节点时，群组协调器 Broker 会触发再均衡，重新为每一个 Partition 分配消费者。**Rebalance 期间，消费者无法读取消息，造成整个消费者群组一小段时间的不可用。**

### 何时生分区再均衡

分区再均衡的触发时机有三种：

- **消费者群组成员数发生变更**。比如有新的 Consumer 加入群组或者离开群组，或者是有 Consumer 实例崩溃被“踢出”群组。
  - 新增消费者。consumer 订阅主题之后，第一次执行 poll 方法
  - 移除消费者。执行 `consumer.close()` 操作或者消费客户端宕机，就不再通过 poll 向群组协调器发送心跳了，当群组协调器检测次消费者没有心跳，就会触发再均衡。
- **订阅主题数发生变更**。Consumer Group 可以使用正则表达式的方式订阅主题，比如 `consumer.subscribe(Pattern.compile(“t.*c”))` 就表明该 Group 订阅所有以字母 t 开头、字母 c 结尾的主题。在 Consumer Group 的运行过程中，你新创建了一个满足这样条件的主题，那么该 Group 就会发生 Rebalance。
- **订阅主题的分区数发生变更**。Kafka 当前只能允许增加一个主题的分区数。当分区数增加时，就会触发订阅该主题的所有 Group 开启 Rebalance。
  - 新增 broker。如重启 broker 节点
  - 移除 broker。如 kill 掉 broker 节点。

### 分区再均衡的过程

**Rebalance 是通过消费者群组中的称为“群主”消费者客户端进行的**。

（1）选择群主

当消费者要加入群组时，会向群组协调器发送一个 JoinGroup 请求。第一个加入群组的消费者将成为“群主”。**群主从协调器那里获取群组的活跃成员列表，并负责给每一个消费者分配分区**。

> 所谓协调者，在 Kafka 中对应的术语是 Coordinator，它专门为 Consumer Group 服务，负责为 Group 执行 Rebalance 以及提供位移管理和组成员管理等。具体来讲，Consumer 端应用程序在提交位移时，其实是向 Coordinator 所在的 Broker 提交位移。同样地，当 Consumer 应用启动时，也是向 Coordinator 所在的 Broker 发送各种请求，然后由 Coordinator 负责执行消费者组的注册、成员管理记录等元数据管理操作。

（2）消费者通过向被指派为群组协调器（Coordinator）的 Broker 定期发送心跳来维持它们和群组的从属关系以及它们对分区的所有权。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502070723810.png)

（3）群主从群组协调器获取群组成员列表，然后给每一个消费者进行分配分区 Partition。有两种分配策略：Range 和 RoundRobin。

- **Range 策略**，就是把若干个连续的分区分配给消费者，如存在分区 1-5，假设有 3 个消费者，则消费者 1 负责分区 1-2,消费者 2 负责分区 3-4，消费者 3 负责分区 5。
- **RoundRoin 策略**，就是把所有分区逐个分给消费者，如存在分区 1-5，假设有 3 个消费者，则分区 1->消费 1，分区 2->消费者 2，分区 3>消费者 3，分区 4>消费者 1，分区 5->消费者 2。

（4）群主分配完成之后，把分配情况发送给群组协调器。

（5）群组协调器再把这些信息发送给消费者。**每个消费者只能看到自己的分配信息，只有群主知道所有消费者的分配信息**。

### 如何判定消费者已经死亡

消费者通过向被指定为群组协调器的 Broker 发送心跳来维持它们和群组的从属关系以及它们对分区的所有权关系。只要消费者以正常的时间间隔发送心跳，就被认为是活跃的。消费者会在轮询消息或提交偏移量时发送心跳。如果消费者超时未发送心跳，会话就会过期，群组协调器认定它已经死亡，就会触发一次再均衡。

当一个消费者要离开群组时，会通知协调器，协调器会立即触发一次再均衡，尽量降低处理停顿。

### 查找协调者

所有 Broker 在启动时，都会创建和开启相应的 Coordinator 组件。也就是说，**所有 Broker 都有各自的 Coordinator 组件**。那么，Consumer Group 如何确定为它服务的 Coordinator 在哪台 Broker 上呢？答案就在我们之前说过的 Kafka 内部位移主题 `__consumer_offsets` 身上。

目前，Kafka 为某个 Consumer Group 确定 Coordinator 所在的 Broker 的算法有 2 个步骤。

1. 第 1 步：确定由位移主题的哪个分区来保存该 Group 数据：`partitionId=Math.abs(groupId.hashCode() % offsetsTopicPartitionCount)`。

2. 第 2 步：找出该分区 Leader 副本所在的 Broker，该 Broker 即为对应的 Coordinator。

### 分区再均衡的问题

- 首先，Rebalance 过程对 Consumer Group 消费过程有极大的影响。**在 Rebalance 过程中，所有 Consumer 实例都会停止消费，等待 Rebalance 完成**。
- 其次，目前 Rebalance 的设计是所有 Consumer 实例共同参与，全部重新分配所有分区。其实更高效的做法是尽量减少分配方案的变动。
- 最后，Rebalance 实在是太慢了。

### 避免分区再均衡

通过前文，我们已经知道了：分区再均衡的代价很高，应该尽量避免不必要的分区再均衡，以整体提高 Consumer 的吞吐量。

分区再均衡发生的时机有三个：

- 组成员数量发生变化
- 订阅主题数量发生变化
- 订阅主题的分区数发生变化

后面两个通常都是运维的主动操作，所以它们引发的 Rebalance 大都是不可避免的。实际上，大部分情况下，导致分区再均衡的原因是：组成员数量发生变化。

有两种情况，消费者并没有宕机，但也被视为消亡：

- 未及时发送心跳
- Consumer 消费时间过长

#### 未及时发送心跳

**第一类非必要 Rebalance 是因为未能及时发送心跳**，导致 Consumer 被“踢出”Group 而引发的。因此，**需要合理设置会话超时时间**。这里给出一些推荐数值，你可以“无脑”地应用在你的生产环境中。

- 设置 `session.timeout.ms` = 6s。
- 设置 `heartbeat.interval.ms` = 2s。
- 要保证 Consumer 实例在被判定为“dead”之前，能够发送至少 3 轮的心跳请求，即 `session.timeout.ms` >= 3 \* `heartbeat.interval.ms`。

将 `session.timeout.ms` 设置成 6s 主要是为了让 Coordinator 能够更快地定位已经挂掉的 Consumer。毕竟，我们还是希望能尽快揪出那些“尸位素餐”的 Consumer，早日把它们踢出 Group。希望这份配置能够较好地帮助你规避第一类“不必要”的 Rebalance。

#### Consumer 消费时间过长

**第二类非必要 Rebalance 是 Consumer 消费时间过长导致的**。此时，**`max.poll.interval.ms`** 参数值的设置显得尤为关键。如果要避免非预期的 Rebalance，你最好将该参数值设置得大一点，比你的下游最大处理时间稍长一点。

#### GC 参数

如果你按照上面的推荐数值恰当地设置了这几个参数，却发现还是出现了 Rebalance，那么我建议你去排查一下**Consumer 端的 GC 表现**，比如是否出现了频繁的 Full GC 导致的长时间停顿，从而引发了 Rebalance。为什么特意说 GC？那是因为在实际场景中，我见过太多因为 GC 设置不合理导致程序频发 Full GC 而引发的非预期 Rebalance 了。

## 提交偏移量

每次调用 `poll()` 方法，它总是会返回由生产者写入 Kafka 但还没有被消费者读取过的记录，Kafka 因此可以追踪哪些记录是被哪个群组的哪个消费者读取的。

**更新分区当前位置的操作叫作提交**。

### 偏移量的用处

如果消费者一直处于运行状态，那么偏移量就没有什么用处。不过，如果消费者发生崩溃或有新的消费者加入群组，就会**触发再均衡**，完成再均衡后，每个消费者可能分配到新的分区，而不是之前处理的那个。为了能够继续之前的工作，消费者需要读取每个分区最后一次提交的偏移量，然后从偏移量指定的地方继续处理。

（1）**如果提交的偏移量小于客户端处理的最后一个消息的偏移量，那么处于两个偏移量之间的消息就会被重复处理**。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210412200354.png)

（2）**如果提交的偏移量大于客户端处理的最后一个消息的偏移量，那么处于两个偏移量之间的消息将会丢失**。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210412200405.png)

由此可知，处理偏移量，会对客户端处理数据产生影响。

### 提交偏移量的旧方案

**老版本的 Consumer Group 把偏移量保存在 ZooKeeper 中**。ZooKeeper 是一个分布式的协调服务框架，Kafka 重度依赖它实现各种各样的协调管理。将偏移量保存在 ZooKeeper 外部系统的做法，最显而易见的好处就是减少了 Kafka Broker 端的状态保存开销，有利于实现伸缩性。

这种方案的问题在于：ZooKeeper 其实并不适合进行高频的写操作，而 Consumer Group 的偏移量更新却是一个非常频繁的操作。这种大吞吐量的写操作会极大地拖慢 ZooKeeper 集群的性能，因此 Kafka 社区渐渐有了这样的共识：将 Consumer 偏移量保存在 ZooKeeper 中是不合适的做法。

### 提交偏移量的新方案

新版本 Consumer 的偏移量管理机制其实也很简单。

消费者向一个叫做 `_consumer_offsets` 的特殊主题发送消息，消息里包含每个分区的偏移量。如果消费者一直处于运行状态，那么偏移量就没有什么用处。不过，如果消费者发生崩溃或有新的消费者加入群组，就会**触发再均衡**，完成再均衡后，每个消费者可能分配到新的分区，而不是之前处理的那个。为了能够继续之前的工作，消费者需要读取每个分区最后一次提交的偏移量，然后从偏移量指定的地方继续处理。

**`_consumer_offsets` 主题的 Key 中应该保存 3 部分内容：`<Group ID，主题名，分区号 >`**。

通常来说，**当 Kafka 集群中的第一个 Consumer 程序启动时，Kafka 会自动创建偏移量主题**。偏移量主题就是普通的 Kafka 主题，那么它自然也有对应的分区数。**如果偏移量主题是 Kafka 自动创建的，那么该主题的分区数是 50，副本数是 3**。分区数可以通过 `offsets.topic.num.partitions` 设置；副本数可以通过 `offsets.topic.replication.factor` 设置。

### 自动提交

自动提交是 Kafka 处理偏移量最简单的方式。

当 `enable.auto.commit` 属性被设为 true，那么每过 `5s`，消费者会自动把从 `poll()` 方法接收到的最大偏移量提交上去。提交时间间隔由 `auto.commit.interval.ms` 控制，默认值是 `5s`。

与消费者里的其他东西一样，**自动提交也是在轮询里进行的**。消费者每次在进行轮询时会检查是否该提交偏移量了，如果是，那么就会提交从上一次轮询返回的偏移量。

假设我们仍然使用默认的 5s 提交时间间隔，在最近一次提交之后的 3s 发生了再均衡，再均衡之后，消费者从最后一次提交的偏移量位置开始读取消息。这个时候偏移量已经落后了 3s（因为没有达到 5s 的时限，并没有提交偏移量），所以在这 3s 的数据将会被重复处理。虽然可以通过修改提交时间间隔来更频繁地提交偏移量，减小可能出现重复消息的时间窗的时间跨度，不过这种情况是无法完全避免的。

在使用自动提交时，每次调用轮询方法都会把上一次调用返回的偏移量提交上去，它并不知道具体哪些消息已经被处理了，所以在再次调用之前最好确保所有当前调用返回的消息都已经处理完毕（在调用 close() 方法之前也会进行自动提交）。一般情况下不会有什么问题，不过在处理异常或提前退出轮询时要格外小心。

**自动提交虽然方便，不过无法避免丢失消息和分区再均衡时重复消息的问题**。

### 手动提交

**自动提交虽然方便，不过无法避免丢失消息和分区再均衡时重复消息的问题**。因此，可以通过手动提交偏移量，由开发者自行控制。

首先，**把 `enable.auto.commit` 设为 false，关闭自动提交**。

如果 Kafka 触发了再均衡，我们需要在消费者失去对一个分区的所有权之前提交最后一个已处理记录的偏移量。如果消费者准备了一个缓冲区用于处理偶发的事件，那么在失去分区所有权之前，需要处理在缓冲区累积下来的记录。可能还需要关闭文件句柄、数据库连接等。

在为消费者分配新分区或移除旧分区时，可以通过消费者 API 执行一些应用程序代码，在调用 `subscribe()` 方法时传进去一个 `ConsumerRebalanceListener` 实例就可以了。 `ConsumerRebalanceListener` 有两个需要实现的方法。

- `public void onPartitionsRevoked(Collection partitions)` 方法会在再均衡开始之前和消费者停止读取消息之后被调用。如果在这里提交偏移量，下一个接管分区的消费者就知道该从哪里开始读取了。
- `public void onPartitionsAssigned(Collection partitions)` 方法会在重新分配分区之后和消费者开始读取消息之前被调用。

```java
private Map<TopicPartition, OffsetAndMetadata> currentOffsets=
  new HashMap<>();

private class HandleRebalance implements ConsumerRebalanceListener {
    public void onPartitionsAssigned(Collection<TopicPartition>
      partitions) {
    }

    public void onPartitionsRevoked(Collection<TopicPartition>
      partitions) {
        System.out.println("Lost partitions in rebalance.
          Committing current
        offsets:" + currentOffsets);
        consumer.commitSync(currentOffsets);
    }
}

try {
    consumer.subscribe(topics, new HandleRebalance());

    while (true) {
        ConsumerRecords<String, String> records =
          consumer.poll(100);
        for (ConsumerRecord<String, String> record : records)
        {
            System.out.println("topic = %s, partition = %s, offset = %d,
             customer = %s, country = %s\n",
             record.topic(), record.partition(), record.offset(),
             record.key(), record.value());
             currentOffsets.put(new TopicPartition(record.topic(),
             record.partition()), new
             OffsetAndMetadata(record.offset()+1, "no metadata"));
        }
        consumer.commitAsync(currentOffsets, null);
    }
} catch (WakeupException e) {
    // 忽略异常，正在关闭消费者
} catch (Exception e) {
    log.error("Unexpected error", e);
} finally {
    try {
        consumer.commitSync(currentOffsets);
    } finally {
        consumer.close();
        System.out.println("Closed consumer and we are done");
    }
}
```

## 反序列化器

生产者需要用**序列化器**将 Java 对象转换成字节数组再发送给 Kafka；同理，消费者需要用**反序列化器**将从 Kafka 接收到的字节数组转换成 Java 对象。

## 独立消费者

通常，会有多个 Kafka 消费者组成群组，关注一个主题。

但可能存在这样的场景：只需要一个消费者从一个主题的所有分区或某个特定的分区读取数据。这时，就不需要消费者群组和再均衡了，只需要**把主题或分区分配给消费者**，然后开始读取消息并提交偏移量。

如果是这样，就不需要订阅主题，取而代之的是为自己分配分区。一个消费者可以订阅主题（并加入消费者群组），或为自己分配分区，但不能同时做这两件事。

```java
List<PartitionInfo> partitionInfos = null;
partitionInfos = consumer.partitionsFor("topic");

if (partitionInfos != null) {
    for (PartitionInfo partition : partitionInfos)
        partitions.add(new TopicPartition(partition.topic(),
            partition.partition()));
    consumer.assign(partitions);

    while (true) {
        ConsumerRecords<String, String> records = consumer.poll(1000);

        for (ConsumerRecord<String, String> record: records) {
            System.out.printf("topic = %s, partition = %s, offset = %d,
                customer = %s, country = %s\n",
                record.topic(), record.partition(), record.offset(),
                record.key(), record.value());
        }
        consumer.commitSync();
    }
}
```

## 消费者的配置

- **`bootstrap.servers`** - Broker 集群地址，格式：ip1:port,ip2:port...，不需要设定全部的集群地址，设置两个或者两个以上即可。
- **`group.id`** - 消费者隶属的消费者组名称，如果为空会报异常，一般而言，这个参数要有一定的业务意义。
- **`fetch.min.bytes`** - 消费者获取记录的最小字节数。Kafka 会等到有足够的数据时才返回消息给消费者，以降低负载。
- **`fetch.max.wait.ms`** - Kafka 需要等待足够的数据才返回给消费者，如果一直没有足够的数据，消费者就会迟迟收不到消息。所以需要指定 Broker 的等待延迟，一旦超时，直接返回数据给消费者。
- **`max.partition.fetch.bytes`** - 指定了服务器从每个分区返回给消费者的最大字节数。默认为 1 MB。
- **`session.timeout.ms`** - 指定了消费者的心跳超时时间。如果消费者没有在有效时间内发送心跳给群组协调器，协调器会视消费者已经消亡，从而触发分区再均衡。默认为 3 秒。
- **`auto.offset.reset`** - 指定了消费者在读取一个没有偏移量的分区或偏移量无效的情况下，该如何处理。
  - `latest` - 表示在偏移量无效时，消费者将从最新的记录开始读取分区记录。
  - `earliest` - 表示在偏移量无效时，消费者将从起始位置读取分区记录。
- **`enable.auto.commit`** - 指定了是否自动提交消息偏移量，默认开启。
- **`partition.assignment.strategy`** - 消费者的分区分配策略。
  - `Range` - 表示会将主题的若干个连续的分区分配给消费者。
  - `RoundRobin` - 表示会将主题的所有分区按照轮询方式分配给消费者。
- **`client.id`** - 客户端标识。
- **`max.poll.records`** - 用于控制单次能获取到的记录数量。
- **`receive.buffer.bytes`** - 用于设置 Socket 接收消息缓冲区（SO_RECBUF）的大小，默认值为 64KB。如果设置为-1，则使用操作系统的默认值。
- **`send.buffer.bytes`** - 用于设置 Socket 发送消息缓冲区（SO_SNDBUF）的大小，默认值为 128KB。与 receive.buffer.bytes 参数一样，如果设置为-1，则使用操作系统的默认值。

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