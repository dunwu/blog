---
title: 《Kafka 核心源码解读》笔记
date: 2022-07-03 14:53:05
categories:
  - 笔记
  - 分布式
  - 分布式通信
tags:
  - 分布式
  - 分布式通信
  - MQ
  - Kafka
permalink: /pages/5ad2bb8a/
---

# 《Kafka 核心源码解读》笔记

## 开篇词

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20220703152740.png)

从功能上讲，Kafka 源码分为四大模块。

- 服务器端源码：实现 Kafka 架构和各类优秀特性的基础。
- Java 客户端源码：定义了与 Broker 端的交互机制，以及通用的 Broker 端组件支撑代码。
- Connect 源码：用于实现 Kafka 与外部系统的高性能数据传输。
- Streams 源码：用于实现实时的流处理功能。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20220703152803.png)

## 导读

> 构建 Kafka 工程和源码阅读环境、Scala 语言热身

kafka 项目主要目录结构

- **bin** 目录：保存 Kafka 工具行脚本，我们熟知的 kafka-server-start 和 kafka-consoleproducer 等脚本都存放在这里。
- **clients** 目录：保存 Kafka 客户端代码，比如生产者和消费者的代码都在该目录下。
- **config** 目录：保存 Kafka 的配置文件，其中比较重要的配置文件是 server.properties。
- **connect** 目录：保存 Connect 组件的源代码。我在开篇词里提到过，Kafka Connect 组件是用来实现 Kafka 与外部系统之间的实时数据传输的。
- **core** 目录：保存 Broker 端代码。Kafka 服务器端代码全部保存在该目录下。
- **streams** 目录：保存 Streams 组件的源代码。Kafka Streams 是实现 Kafka 实时流处理的组件。

## 日志段

> 保存消息文件的对象是怎么实现的？

### Kafka 日志结构

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20220704204019.png)

Kafka 日志对象由多个日志段对象组成，而每个日志段对象会在磁盘上创建一组文件，包括**消息日志文件（.log）**、**位移索引文件（.index）**、**时间戳索引文件（.timeindex）**以及已中止（Aborted）事务的**索引文件（.txnindex）**。当然，如果你没有使用 Kafka 事务，已中止事务的索引文件是不会被创建出来的。

一个 Kafka 主题有很多分区，每个分区就对应一个 Log 对象，在物理磁盘上则对应于一个子目录。比如你创建了一个双分区的主题 test-topic，那么，Kafka 在磁盘上会创建两个子目录：test-topic-0 和 test-topic-1。而在服务器端，这就是两个 **`Log`** 对象。每个子目录下存在多组日志段，也就是多组 **`.log`**、**`.index`**、**`.timeindex`** 文件组合，只不过文件名不同，因为每个日志段的起始位移不同。

### 日志段源码解析

日志段源码位于 Kafka 的 core 工程的 `LogSegment.scala` 中。该文件下定义了三个 Scala 对象：

- `LogSegment class`：日志段类
- `LogSegment object`：保存静态变量或静态方法。相当于 `LogSegment class` 的工具类。
- `LogFlushStats object`：尾部有个 stats，用于统计，负责为日志落盘进行计时。

#### LogSegment class 声明

```scala
class LogSegment private[log] (val log: FileRecords,
                               val lazyOffsetIndex: LazyIndex[OffsetIndex],
                               val lazyTimeIndex: LazyIndex[TimeIndex],
                               val txnIndex: TransactionIndex,
                               val baseOffset: Long,
                               val indexIntervalBytes: Int,
                               val rollJitterMs: Long,
                               val time: Time) extends Logging { ... }
```

参数说明：

- `log`：**包含日志条目的文件记录**。`FileRecords` 就是实际保存 Kafka 消息的对象。
- `lazyOffsetIndex`：**偏移量索引**。
- `lazyTimeIndex`：**时间戳索引**。
- `txnIndex`：**事务索引**。
- `baseOffset`：**此段中偏移量的下限**。事实上，在磁盘上看到的 Kafka 文件名就是 `baseOffset` 的值。每个 `LogSegment` 对象实例一旦被创建，它的起始位移就是固定的了，不能再被更改。
- `indexIntervalBytes`：**索引中条目之间的近似字节数**。indexIntervalBytes 值其实就是 Broker 端参数 `log.index.interval.bytes` 值，它控制了日志段对象新增索引项的频率。默认情况下，日志段至少新写入 4KB 的消息数据才会新增一条索引项。
- `rollJitterMs`：**日志段对象新增倒计时的“扰动值”**。因为目前 Broker 端日志段新增倒计时是全局设置，这就是说，在未来的某个时刻可能同时创建多个日志段对象，这将极大地增加物理磁盘 I/O 压力。有了 rollJitterMs 值的干扰，每个新增日志段在创建时会彼此岔开一小段时间，这样可以缓解物理磁盘的 I/O 负载瓶颈。
- `time`：**`Timer` 实例**。

#### append 方法

append 方法接收 4 个参数：分别表示

- `largestOffset`：待写入消息批次中消息的最大位移值
- `largestTimestamp`：最大时间戳
- `shallowOffsetOfMaxTimestamp`：最大时间戳对应消息的位移
- `records`：真正要写入的消息集合

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20220705062643.png)

- 第一步：在源码中，首先调用 `log.sizeInBytes` 方法判断该日志段是否为空，如果是空的话， Kafka 需要记录要写入消息集合的最大时间戳，并将其作为后面新增日志段倒计时的依据。
- 第二步：代码调用 `ensureOffsetInRange` 方法确保输入参数最大位移值是合法的。那怎么判断是不是合法呢？标准就是看它与日志段起始位移的差值是否在整数范围内，即 `largestOffset - baseOffset` 的值是不是 介于 `[0，Int.MAXVALUE]` 之间。在极个别的情况下，这个差值可能会越界，这时， `append` 方法就会抛出异常，阻止后续的消息写入。一旦你碰到这个问题，你需要做的是升级你的 Kafka 版本，因为这是由已知的 Bug 导致的。
- 第三步：待这些做完之后，`append` 方法调用 `FileRecords` 的 `append` 方法执行真正的写入。它的工作是将内存中的消息对象写入到操作系统的页缓存就可以了。
- 第四步：再下一步，就是更新日志段的最大时间戳以及最大时间戳所属消息的位移值属性。每个日志段都要保存当前最大时间戳信息和所属消息的位移信息。还记得 Broker 端提供定期删除日志的功能吗？比如我只想保留最近 7 天的日志，没错，当前最大时间戳这个值就是判断的依据；而最大时间戳对应的消息的位移值则用于时间戳索引项。虽然后面我会详细介绍，这里我还是稍微提一下：时间戳索引项保存时间戳与消息位移的对应关系。在这步操作中，Kafka 会更新并保存这组对应关系。
- 第五步：append 方法的最后一步就是更新索引项和写入的字节数了。我在前面说过，日志段每写入 4KB 数据就要写入一个索引项。当已写入字节数超过了 4KB 之后，append 方法会调用索引对象的 append 方法新增索引项，同时清空已写入字节数，以备下次重新累积计算。

#### read 方法

read 方法作用：从第一个偏移量 >= startOffset 的 Segment 开始读取消息集。如果指定了 maxOffset，则消息集将包含不超过 maxSize 字节，并将在 maxOffset 之前结束。

read 方法入参

- `startOffset`：要读取的第一条消息的位移；
- `maxSize`：能读取的最大字节数；
- `maxPosition` ：能读到的最大文件位置；
- `minOneMessage`：是否允许在消息体过大时至少返回第一条消息。

read 方法代码逻辑：

1. 调用 `translateOffset` 方法定位要读取的起始文件位置 （`startPosition`）。输入参数 `startOffset` 仅仅是位移值，Kafka 需要根据索引信息找到对应的物理文件位置才能开始读取消息。
2. 待确定了读取起始位置，日志段代码需要根据这部分信息以及 `maxSize` 和 `maxPosition` 参数共同计算要读取的总字节数。举个例子，假设 maxSize=100，maxPosition=300，startPosition=250，那么 read 方法只能读取 50 字节，因为 maxPosition - startPosition = 50。我们把它和 maxSize 参数相比较，其中的最小值就是最终能够读取的总字节数。
3. 调用 `FileRecords` 的 `slice` 方法，从指定位置读取指定大小的消息集合。

#### recover 方法

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20220705064515.png)

recover 开始时，代码依次调用索引对象的 reset 方法清空所有的索引文件，之后会开始遍历日志段中的所有消息集合或消息批次（RecordBatch）。对于读取到的每个消息集合，日志段必须要确保它们是合法的，这主要体现在两个方面：

- 该集合中的消息必须要符合 Kafka 定义的二进制格式；
- 该集合中最后一条消息的位移值不能越界，即它与日志段起始位移的差值必须是一个正整数值。

校验完消息集合之后，代码会更新遍历过程中观测到的最大时间戳以及所属消息的位移值。同样，这两个数据用于后续构建索引项。再之后就是不断累加当前已读取的消息字节数，并根据该值有条件地写入索引项。最后是更新事务型 Producer 的状态以及 Leader Epoch 缓存。不过，这两个并不是理解 Kafka 日志结构所必需的组件，因此，我们可以忽略它们。

遍历执行完成后，Kafka 会将日志段当前总字节数和刚刚累加的已读取字节数进行比较，如果发现前者比后者大，说明日志段写入了一些非法消息，需要执行截断操作，将日志段大小调整回合法的数值。同时， Kafka 还必须相应地调整索引文件的大小。把这些都做完之后，日志段恢复的操作也就宣告结束了。

## 日志

日志是日志段的容器，里面定义了很多管理日志段的操作。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20220705195916.png)

### Log 源码结构

- `LogAppendInfo`（C）：保存消息元数据信息
- `LogAppendInfo`（O）：`LogAppendInfo`（C）工厂方法类
- `UnifiedLog`（C）：`UnifiedLog.scala` 中最核心的代码
- `UnifiedLog`（O）：`UnifiedLog`（C）工厂方法类
- `RollParams`（C）：用于控制日志段是否切分（Roll）的数据结构。
- `RollParams`（O）：RollParams 伴生类的工厂方法。
- `LogMetricNames`（O）：定义了 Log 对象的监控指标。
- `LogOffsetSnapshot`（C）：封装分区所有位移元数据的容器类。
- `LogReadInfo`（C）：封装读取日志返回的数据及其元数据。
- `CompletedTxn`（C）：记录已完成事务的元数据，主要用于构建事务索引。

### Log Class & Object

Log Object 作用：

- 定义了 Kafka 支持的文件类型
  - .log：Kafka 日志文件
  - .index：Kafka 偏移量索引文件
  - .timeindex：Kafka 时间戳索引文件
  - .txnindex：Kafka 事务索引文件
  - .snapshot：Kafka 为幂等型或事务型 Producer 所做的快照文件
  - .deleted：被标记为待删除的文件
  - .cleaned：用于日志清理的临时文件
  - .swap：将文件交换到日志中时使用的临时文件
  - -delete：被标记为待删除的目录
  - -future：用于变更主题分区文件夹地址的目录
- 定义了多种工具类方法

UnifiedLog Class 定义：

```scala
// UnifiedLog 定义
class UnifiedLog(@volatile var logStartOffset: Long,
                 private val localLog: LocalLog,
                 brokerTopicStats: BrokerTopicStats,
                 val producerIdExpirationCheckIntervalMs: Int,
                 @volatile var leaderEpochCache: Option[LeaderEpochFileCache],
                 val producerStateManager: ProducerStateManager,
                 @volatile private var _topicId: Option[Uuid],
                 val keepPartitionMetadataFile: Boolean) extends Logging with KafkaMetricsGroup { ... }

// LocalLog 定义
class LocalLog(@volatile private var _dir: File,
               @volatile private[log] var config: LogConfig,
               private[log] val segments: LogSegments,
               @volatile private[log] var recoveryPoint: Long,
               @volatile private var nextOffsetMetadata: LogOffsetMetadata,
               private[log] val scheduler: Scheduler,
               private[log] val time: Time,
               private[log] val topicPartition: TopicPartition,
               private[log] val logDirFailureChannel: LogDirFailureChannel) extends Logging with KafkaMetricsGroup { ... }
```

上面属性中最重要的两个属性是：`_dir` 和 `logStartOffset`。`_dir` 就是这个日志所在的文件夹路径，也就是主题分区的路径。`logStartOffset`，表示日志的当前最早位移。`_dir` 和 `logStartOffset` 都是 `volatile var` 类型，表示它们的值是变动的，而且可能被多个线程更新。

Log End Offset（LEO），是表示日志下一条待插入消息的位移值，而这个 Log Start Offset 是跟它相反的，它表示日志当前对外可见的最早一条消息的位移值。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20220705201758.png)

图中绿色的位移值 3 是日志的 Log Start Offset，而位移值 15 表示 LEO。另外，位移值 8 是高水位值，它是区分已提交消息和未提交消息的分水岭。

有意思的是，Log End Offset 可以简称为 LEO，但 Log Start Offset 却不能简称为 LSO。因为在 Kafka 中，LSO 特指 Log Stable Offset，属于 Kafka 事务的概念。

Log 类的其他属性你暂时不用理会，因为它们要么是很明显的工具类属性，比如 timer 和 scheduler，要么是高阶用法才会用到的高级属性，比如 producerStateManager 和 logDirFailureChannel。工具类的代码大多是做辅助用的，跳过它们也不妨碍我们理解 Kafka 的核心功能；而高阶功能代码设计复杂，学习成本高，性价比不高。

其他一些重要属性：

- nextOffsetMetadata：它封装了下一条待插入消息的位移值，你基本上可以把这个属性和 LEO 等同起来。
- highWatermarkMetadata：是分区日志高水位值。
- segments：我认为这是 Log 类中最重要的属性。它保存了分区日志下所有的日志段信息，只不过是用 Map 的数据结构来保存的。Map 的 Key 值是日志段的起始位移值，Value 则是日志段对象本身。Kafka 源码使用 ConcurrentNavigableMap 数据结构来保存日志段对象，就可以很轻松地利用该类提供的线程安全和各种支持排序的方法，来管理所有日志段对象。
- Leader Epoch Cache 对象。Leader Epoch 是社区于 0.11.0.0 版本引入源码中的，主要是用来判断出现 Failure 时是否执行日志截断操作（Truncation）。之前靠高水位来判断的机制，可能会造成副本间数据不一致的情形。这里的 Leader Epoch Cache 是一个缓存类数据，里面保存了分区 Leader 的 Epoch 值与对应位移值的映射关系，我建议你查看下 LeaderEpochFileCache 类，深入地了解下它的实现原理。

### LOG 类初始化逻辑

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20220705204919.png)

### Log 的常见操作

Log 的常见操作可以分为 4 类：

- 高水位管理操作：高水位的概念在 Kafka 中举足轻重，对它的管理，是 Log 最重要的功能之一。
- 日志段管理：Log 是日志段的容器。高效组织与管理其下辖的所有日志段对象，是源码要解决的核心问题。
- 关键位移值管理：日志定义了很多重要的位移值，比如 Log Start Offset 和 LEO 等。确保这些位移值的正确性，是构建消息引擎一致性的基础。
- 读写操作：所谓的操作日志，大体上就是指读写日志。读写操作的作用之大，不言而喻。

#### 高水位管理操作

高水位定义：

```scala
@volatile private var highWatermarkMetadata: LogOffsetMetadata = LogOffsetMetadata(logStartOffset)
```

高水位值是 volatile（易变型）的。因为多个线程可能同时读取它，因此需要设置成 volatile，保证内存可见性。另外，由于高水位值可能被多个线程同时修改，因此源码使用 Java Monitor 锁来确保并发修改的线程安全。

高水位值的初始值是 Log Start Offset 值。上节课我们提到，每个 Log 对象都会维护一个 Log Start Offset 值。当首次构建高水位时，它会被赋值成 Log Start Offset 值。

LogOffsetMetadata 定义

```scala
case class LogOffsetMetadata(messageOffset: Long,
                             segmentBaseOffset: Long = Log.UnknownOffset,
                             relativePositionInSegment: Int = LogOffsetMetadata.UnknownFilePosition) {
```

三个参数：

- `messageOffset`：消息位移值，这是最重要的信息。我们总说高水位值，其实指的就是这个变量的值。
- `segmentBaseOffset`：保存该位移值所在日志段的起始位移。日志段起始位移值辅助计算两条消息在物理磁盘文件中位置的差值，即两条消息彼此隔了多少字节。这个计算有个前提条件，即两条消息必须处在同一个日志段对象上，不能跨日志段对象。否则它们就位于不同的物理文件上，计算这个值就没有意义了。这里的 segmentBaseOffset，就是用来判断两条消息是否处于同一个日志段的。
- `relativePositionSegment`：保存该位移值所在日志段的物理磁盘位置。这个字段在计算两个位移值之间的物理磁盘位置差值时非常有用。你可以想一想，Kafka 什么时候需要计算位置之间的字节数呢？答案就是在读取日志的时候。假设每次读取时只能读 1MB 的数据，那么，源码肯定需要关心两个位移之间所有消息的总字节数是否超过了 1MB。

##### 获取和设置高水位值

```scala
  private def updateHighWatermarkMetadata(newHighWatermark: LogOffsetMetadata): Unit = {
    if (newHighWatermark.messageOffset < 0) // 高水位值不能是负数
      throw new IllegalArgumentException("High watermark offset should be non-negative")

    lock synchronized { // 保护Log对象修改的Monitor锁
      highWatermarkMetadata = newHighWatermark // 赋值新的高水位值
      producerStateManager.onHighWatermarkUpdated(newHighWatermark.messageOffset)
      maybeIncrementFirstUnstableOffset() // First Unstable Offset是Kafka事务机制
    }
    trace(s"Setting high watermark $newHighWatermark")
  }
```

##### 更新高水位值

```scala
  def updateHighWatermark(hw: Long): Long = {
    // 新高水位值一定介于[Log Start Offset，Log End Offset]之间
    val newHighWatermark = if (hw < logStartOffset)
      logStartOffset
    else if (hw > logEndOffset)
      logEndOffset
    else
      hw
    // 设置高水位值
    updateHighWatermarkMetadata(LogOffsetMetadata(newHighWatermark))
    // 最后返回新高水位值
    newHighWatermark
  }

  def maybeIncrementHighWatermark(newHighWatermark: LogOffsetMetadata): Option[LogOffsetMetadata] = {
    // 新高水位值不能越过Log End Offset
    if (newHighWatermark.messageOffset > logEndOffset)
      throw new IllegalArgumentException(s"High watermark $newHighWatermark update exceeds current " +
        s"log end offset $logEndOffsetMetadata")

    lock.synchronized {
      val oldHighWatermark = fetchHighWatermarkMetadata // 获取老的高水位值

      // 保证高水位单调递增。当新的偏移元数据位于较新的段上时，我们还会更新高水位线，每当日志滚动到新段时就会发生这种情况。
      if (oldHighWatermark.messageOffset < newHighWatermark.messageOffset ||
        (oldHighWatermark.messageOffset == newHighWatermark.messageOffset && oldHighWatermark.onOlderSegment(newHighWatermark))) {
        updateHighWatermarkMetadata(newHighWatermark)
        Some(oldHighWatermark) // 返回老的高水位值
      } else {
        None
      }
    }
  }
```

这两个方法有着不同的用途。updateHighWatermark 方法，主要用在 Follower 副本从 Leader 副本获取到消息后更新高水位值。一旦拿到新的消息，就必须要更新高水位值；而 maybeIncrementHighWatermark 方法，主要是用来更新 Leader 副本的高水位值。需要注意的是，Leader 副本高水位值的更新是有条件的——某些情况下会更新高水位值，某些情况下可能不会。

##### 读取高水位值

```
  private def fetchHighWatermarkMetadata: LogOffsetMetadata = {
    checkIfMemoryMappedBufferClosed() // 读取时确保日志不能被关闭

    val offsetMetadata = highWatermarkMetadata // 保存当前高水位值到本地变量
    if (offsetMetadata.messageOffsetOnly) { // 没有获得到完整的高水位元数据
      lock.synchronized {
        // 给定消息偏移量，在日志中找到其对应的偏移量元数据。如果消息偏移量超出范围，则抛出异常
        val fullOffset = convertToOffsetMetadataOrThrow(highWatermark)
        updateHighWatermarkMetadata(fullOffset) // 然后再更新一下高水位对象
        fullOffset
      }
    } else {
      offsetMetadata
    }
  }
```

#### 日志段管理

添加

```scala
  @threadsafe
  def addSegment(segment: LogSegment): LogSegment = this.segments.put(segment.baseOffset, segment)
```

删除

```scala
  def deleteOldSegments(): Int = {
    if (config.delete) {
      deleteRetentionMsBreachedSegments() + deleteRetentionSizeBreachedSegments() + deleteLogStartOffsetBreachedSegments()
    } else {
      deleteLogStartOffsetBreachedSegments()
    }
  }

  private def deleteOldSegments(predicate: (LogSegment, Option[LogSegment]) => Boolean, reason: String): Int = {
    lock synchronized {
      val deletable = deletableSegments(predicate)
      if (deletable.nonEmpty)
        info(s"Found deletable segments with base offsets [${deletable.map(_.baseOffset).mkString(",")}] due to $reason")
      deleteSegments(deletable)
    }
  }
```

修改

源码里面不涉及修改日志段对象，所谓的修改或更新也就是替换而已，用新的日志段对象替换老的日志段对象。举个简单的例子。segments.put(1L, newSegment) 语句在没有 Key=1 时是添加日志段，否则就是替换已有日志段。

查询

主要都是利用了 ConcurrentSkipListMap 的现成方法。

- segments.firstEntry：获取第一个日志段对象；
- segments.lastEntry：获取最后一个日志段对象，即 Active Segment；
- segments.higherEntry：获取第一个起始位移值 ≥ 给定 Key 值的日志段对象；
- segments.floorEntry：获取最后一个起始位移值 ≤ 给定 Key 值的日志段对象。

#### 关键位移值管理

Log 对象维护了一些关键位移值数据，比如 Log Start Offset、LEO 等。

Log 对象中的 LEO 永远指向下一条待插入消息，也就是说，LEO 值上面是没有消息的

```
@volatile private var nextOffsetMetadata: LogOffsetMetadata = _
```

Log End Offset 对象被更新的时机：

- **对象初始化时**：当 Log 对象初始化时，我们必须要创建一个 LEO 对象，并对其进行初始化。
- **写入新消息时**：这个最容易理解。以上面的图为例，当不断向 Log 对象插入新消息时，LEO 值就像一个指针一样，需要不停地向右移动，也就是不断地增加。
- **Log 对象发生日志切分（Log Roll）时**：日志切分是啥呢？其实就是创建一个全新的日志段对象，并且关闭当前写入的日志段对象。这通常发生在当前日志段对象已满的时候。一旦发生日志切分，说明 Log 对象切换了 Active Segment，那么，LEO 中的起始位移值和段大小数据都要被更新，因此，在进行这一步操作时，我们必须要更新 LEO 对象。
- **日志截断（Log Truncation）时**：这个也是显而易见的。日志中的部分消息被删除了，自然可能导致 LEO 值发生变化，从而要更新 LEO 对象。

Log Start Offset 被更新的时机：

- **Log 对象初始化时**：和 LEO 类似，Log 对象初始化时要给 Log Start Offset 赋值，一般是将第一个日志段的起始位移值赋值给它。
- **日志截断时**：同理，一旦日志中的部分消息被删除，可能会导致 Log Start Offset 发生变化，因此有必要更新该值。
- **Follower 副本同步时**：一旦 Leader 副本的 Log 对象的 Log Start Offset 值发生变化。为了维持和 Leader 副本的一致性，Follower 副本也需要尝试去更新该值。
- **删除日志段时**：这个和日志截断是类似的。凡是涉及消息删除的操作都有可能导致 LogStart Offset 值的变化。
- **删除消息时**：严格来说，这个更新时机有点本末倒置了。在 Kafka 中，删除消息就是通过抬高 Log Start Offset 值来实现的，因此，删除消息时必须要更新该值。

#### 读写操作

写操作流程：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20220706104752.png)

读操作

read 方法中有 4 个参数：

- startOffset，即从 Log 对象的哪个位移值开始读消息。
- maxLength，即最多能读取多少字节。
- isolation，设置读取隔离级别，主要控制能够读取的最大位移值，多用于 Kafka 事务。
- minOneMessage，即是否允许至少读一条消息。设想如果消息很大，超过了 maxLength，正常情况下 read 方法永远不会返回任何消息。但如果设置了该参数为 true，read 方法就保证至少能够返回一条消息。

## 索引

### 索引类图及源文件组织架构

- AbstractIndex.scala：它定义了最顶层的抽象类，这个类封装了所有索引类型的公共操作。
- LazyIndex.scala：它定义了 AbstractIndex 上的一个包装类，实现索引项延迟加载。这个类主要是为了提高性能。
- OffsetIndex.scala：定义位移索引，保存“< 位移值，文件磁盘物理位置 >”对。
- TimeIndex.scala：定义时间戳索引，保存“< 时间戳，位移值 >”对。
- TransactionIndex.scala：定义事务索引，为已中止事务（Aborted Transcation）保存重要的元数据信息。只有启用 Kafka 事务后，这个索引才有可能出现。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20220706142040.png)

### AbstractIndex 代码结构

- 索引文件（file）。每个索引对象在磁盘上都对应了一个索引文件。你可能注意到了，这个字段是 var 型，说明它是可以被修改的。难道索引对象还能动态更换底层的索引文件吗？是的。自 1.1.0 版本之后，Kafka 允许迁移底层的日志路径，所以，索引文件自然要是可以更换的。
- 起始位移值（baseOffset）。索引对象对应日志段对象的起始位移值。举个例子，如果你查看 Kafka 日志路径的话，就会发现，日志文件和索引文件都是成组出现的。比如说，如果日志文件是 00000000000000000123.log，正常情况下，一定还有一组索引文件 00000000000000000123.index、00000000000000000123.timeindex 等。这里的“123”就是这组文件的起始位移值，也就是 baseOffset 值。
- 索引文件最大字节数（maxIndexSize）。它控制索引文件的最大长度。Kafka 源码传入该参数的值是 Broker 端参数 segment.index.bytes 的值，即 10MB。这就是在默认情况下，所有 Kafka 索引文件大小都是 10MB 的原因。
- 索引文件打开方式（writable）。“True”表示以“读写”方式打开，“False”表示以“只读”方式打开。

### 位移索引

位移索引也就是所谓的 OffsetIndex。Key 就是消息的相对位移，Value 是保存该消息的日志段文件中该消息第一个字节的物理文件位置。

## 参考资料

- [Kafka 核心源码解读](https://time.geekbang.org/column/intro/304)
