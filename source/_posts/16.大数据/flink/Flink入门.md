---
title: Flink 入门
date: 2020-06-22 00:22:25
order: 01
categories:
  - 大数据
  - flink
tags:
  - 大数据
  - Flink
permalink: /pages/e59a148d/
---

# Flink 入门

> Apache Flink 是一个框架和分布式处理引擎，用于在*无边界和有边界*数据流上进行有状态的计算。Flink 能在所有常见集群环境中运行，并能以内存速度和任意规模进行计算。

![img](https://flink.apache.org/img/flink-home-graphic.png)

## 概念

### 处理无界和有界数据

任何类型的数据都可以形成一种事件流。

数据可以被作为 _无界_ 或者 _有界_ 流来处理。

- **无界流** 有定义流的开始，但没有定义流的结束。它们会无休止地产生数据。无界流的数据必须持续处理，即数据被摄取后需要立刻处理。我们不能等到所有数据都到达再处理，因为输入是无限的，在任何时候输入都不会完成。处理无界数据通常要求以特定顺序摄取事件，例如事件发生的顺序，以便能够推断结果的完整性。
- **有界流** 有定义流的开始，也有定义流的结束。有界流可以在摄取所有数据后再进行计算。有界流所有数据可以被排序，所以并不需要有序摄取。有界流处理通常被称为批处理。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200603134807.png)

### 核心概念

#### 流

显而易见，（数据）流是流处理的基本要素。然而，流也拥有着多种特征。这些特征决定了流如何以及何时被处理。Flink 是一个能够处理任何类型数据流的强大处理框架。

- **有界** 和 **无界** 的数据流：流可以是无界的；也可以是有界的，例如固定大小的数据集。Flink 在无界的数据流处理上拥有诸多功能强大的特性，同时也针对有界的数据流开发了专用的高效算子。
- **实时** 和 **历史记录** 的数据流：所有的数据都是以流的方式产生，但用户通常会使用两种截然不同的方法处理数据。或是在数据生成时进行实时的处理；亦或是先将数据流持久化到存储系统中——例如文件系统或对象存储，然后再进行批处理。Flink 的应用能够同时支持处理实时以及历史记录数据流。

#### 状态

只有在每一个单独的事件上进行转换操作的应用才不需要状态，换言之，每一个具有一定复杂度的流处理应用都是有状态的。任何运行基本业务逻辑的流处理应用都需要在一定时间内存储所接收的事件或中间结果，以供后续的某个时间点（例如收到下一个事件或者经过一段特定时间）进行访问并进行后续处理。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200603135129.png)

应用状态是 Flink 中的一等公民，Flink 提供了许多状态管理相关的特性支持，其中包括：

- **多种状态基础类型**：Flink 为多种不同的数据结构提供了相对应的状态基础类型，例如原子值（value），列表（list）以及映射（map）。开发者可以基于处理函数对状态的访问方式，选择最高效、最适合的状态基础类型。
- **插件化的 State Backend**：State Backend 负责管理应用程序状态，并在需要的时候进行 checkpoint。Flink 支持多种 state backend，可以将状态存在内存或者 [RocksDB](https://rocksdb.org/)。RocksDB 是一种高效的嵌入式、持久化键值存储引擎。Flink 也支持插件式的自定义 state backend 进行状态存储。
- **精确一次语义**：Flink 的 checkpoint 和故障恢复算法保证了故障发生后应用状态的一致性。因此，Flink 能够在应用程序发生故障时，对应用程序透明，不造成正确性的影响。
- **超大数据量状态**：Flink 能够利用其异步以及增量式的 checkpoint 算法，存储数 TB 级别的应用状态。
- **可弹性伸缩的应用**：Flink 能够通过在更多或更少的工作节点上对状态进行重新分布，支持有状态应用的分布式的横向伸缩。

#### 时间

时间是流处理应用另一个重要的组成部分。因为事件总是在特定时间点发生，所以大多数的事件流都拥有事件本身所固有的时间语义。进一步而言，许多常见的流计算都基于时间语义，例如窗口聚合、会话计算、模式检测和基于时间的 join。流处理的一个重要方面是应用程序如何衡量时间，即区分事件时间（event-time）和处理时间（processing-time）。

Flink 提供了丰富的时间语义支持。

- **事件时间模式**：使用事件时间语义的流处理应用根据事件本身自带的时间戳进行结果的计算。因此，无论处理的是历史记录的事件还是实时的事件，事件时间模式的处理总能保证结果的准确性和一致性。
- **Watermark 支持**：Flink 引入了 watermark 的概念，用以衡量事件时间进展。Watermark 也是一种平衡处理延时和完整性的灵活机制。
- **迟到数据处理**：当以带有 watermark 的事件时间模式处理数据流时，在计算完成之后仍会有相关数据到达。这样的事件被称为迟到事件。Flink 提供了多种处理迟到数据的选项，例如将这些数据重定向到旁路输出（side output）或者更新之前完成计算的结果。
- **处理时间模式**：除了事件时间模式，Flink 还支持处理时间语义。处理时间模式根据处理引擎的机器时钟触发计算，一般适用于有着严格的低延迟需求，并且能够容忍近似结果的流处理应用。

### Flink 特性

- Flink 是**基于事件驱动** (Event-driven) 的应用，能够**同时支持流处理和批处理**；
- **基于内存计算**，能够保证高吞吐和低延迟，具有优越的性能表现；
- 支持精确一次 (Exactly-once) 语意，能够完美地保证一致性和正确性；
- 分层 API ，能够满足各个层次的开发需求；
- 支持高可用配置，支持保存点机制，能够提供安全性和稳定性上的保证；
- 多样化的部署方式，支持本地，远端，云端等多种部署方案；
- 具有横向扩展架构，能够按照用户的需求进行动态扩容；
- 活跃度极高的社区和完善的生态圈的支持。

## Flink 架构

### 分层架构

Flink 采用分层的架构设计，从而保证各层在功能和职责上的清晰。

自上而下，分别是 API & Libraries 层、Runtime 核心层以及物理部署层：

#### API & Libraries 层

这一层主要提供了编程 API 和 顶层类库：

- **编程 API** : 用于进行流处理的 DataStream API 和用于进行批处理的 DataSet API；
  - **SQL & Table API** - SQL & Table API 同时适用于批处理和流处理，这意味着你可以对有界数据流和无界数据流以相同的语义进行查询，并产生相同的结果。除了基本查询外， 它还支持自定义的标量函数，聚合函数以及表值函数，可以满足多样化的查询需求。
  - **DataStream & DataSet API** - DataStream & DataSet API 是 Flink 数据处理的核心 API，支持使用 Java 语言或 Scala 语言进行调用，提供了数据读取，数据转换和数据输出等一系列常用操作的封装。
  - **Stateful Stream Processing** - Stateful Stream Processing 是最低级别的抽象，它通过 Process Function 函数内嵌到 DataStream API 中。 Process Function 是 Flink 提供的最底层 API，具有最大的灵活性，允许开发者对于时间和状态进行细粒度的控制。
- **顶层类库**
  - 用于复杂事件处理的 CEP 库；
  - 用于结构化数据查询的 SQL & Table 库；
  - 基于批处理的机器学习库 FlinkML
  - 图形处理库 Gelly。

#### Runtime 核心层

这一层是 Flink 分布式计算框架的核心实现层，包括作业转换，任务调度，资源分配，任务执行等功能，基于这一层的实现，可以在流式引擎下同时运行流处理程序和批处理程序。

#### 物理部署层

Flink 的物理部署层，用于支持在不同平台上部署运行 Flink 应用。

### 集群架构

#### 核心组件

按照上面的介绍，Flink 核心架构的第二层是 Runtime 层， 该层采用标准的 Master - Slave 结构， 其中，Master 部分又包含了三个核心组件：Dispatcher、ResourceManager 和 JobManager，而 Slave 则主要是 TaskManager 进程。它们的功能分别如下：

- **JobManagers** (也称为 _masters_) ：JobManagers **接收由 Dispatcher 传递过来的执行程序，该执行程序包含了作业图 (JobGraph)，逻辑数据流图 (logical dataflow graph) 及其所有的 classes 文件以及第三方类库 (libraries) 等等** 。紧接着 JobManagers 会**将 JobGraph 转换为执行图 (ExecutionGraph)，然后向 ResourceManager 申请资源来执行该任务，一旦申请到资源，就将执行图分发给对应的 TaskManagers** 。因此每个作业 (Job) 至少有一个 JobManager；高可用部署下可以有多个 JobManagers，其中一个作为 _leader_，其余的则处于 _standby_ 状态。
- **TaskManagers** (也称为 _workers_) : TaskManagers **负责实际的子任务 (subtasks) 的执行，每个 TaskManagers 都拥有一定数量的 slots。Slot 是一组固定大小的资源的合集 (如计算能力，存储空间)**。TaskManagers 启动后，会将其所拥有的 slots 注册到 ResourceManager 上，由 ResourceManager 进行统一管理。
- **Dispatcher**：负责接收客户端提交的执行程序，并传递给 JobManager 。除此之外，它还提供了一个 WEB UI 界面，用于监控作业的执行情况。
- **ResourceManager** ：负责管理 slots 并协调集群资源。ResourceManager 接收来自 JobManager 的资源请求，并将存在空闲 slots 的 TaskManagers 分配给 JobManager 执行任务。Flink 基于不同的部署平台，如 YARN , Mesos，K8s 等提供了不同的资源管理器，当 TaskManagers 没有足够的 slots 来执行任务时，它会向第三方平台发起会话来请求额外的资源。

[![img](https://camo.githubusercontent.com/ed20fbb9587516111f11818092687cab984c48a0/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d6170706c69636174696f6e2d7375626d697373696f6e2e706e67)](https://camo.githubusercontent.com/ed20fbb9587516111f11818092687cab984c48a0/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d6170706c69636174696f6e2d7375626d697373696f6e2e706e67)

#### Task & SubTask

上面我们提到：TaskManagers 实际执行的是 SubTask，而不是 Task，这里解释一下两者的区别：

在执行分布式计算时，Flink 将可以链接的操作 (operators) 链接到一起，这就是 Task。之所以这样做， 是为了减少线程间切换和缓冲而导致的开销，在降低延迟的同时可以提高整体的吞吐量。 但不是所有的 operator 都可以被链接，如下 keyBy 等操作会导致网络 shuffle 和重分区，因此其就不能被链接，只能被单独作为一个 Task。 简单来说，一个 Task 就是一个可以链接的最小的操作链 (Operator Chains) 。如下图，source 和 map 算子被链接到一块，因此整个作业就只有三个 Task：

[![img](https://camo.githubusercontent.com/1c4380f4018996ae3df4a4f9fd2e7d910a9e4b23/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d7461736b2d7375627461736b2e706e67)](https://camo.githubusercontent.com/1c4380f4018996ae3df4a4f9fd2e7d910a9e4b23/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d7461736b2d7375627461736b2e706e67)

解释完 Task ，我们在解释一下什么是 SubTask，其准确的翻译是： _A subtask is one parallel slice of a task_，即一个 Task 可以按照其并行度拆分为多个 SubTask。如上图，source & map 具有两个并行度，KeyBy 具有两个并行度，Sink 具有一个并行度，因此整个虽然只有 3 个 Task，但是却有 5 个 SubTask。Jobmanager 负责定义和拆分这些 SubTask，并将其交给 Taskmanagers 来执行，每个 SubTask 都是一个单独的线程。

#### 4.3 资源管理

理解了 SubTasks ，我们再来看看其与 Slots 的对应情况。一种可能的分配情况如下：

[![img](https://camo.githubusercontent.com/65dd3fb991b3cc14fe54f6c0c9248f274daf2565/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d7461736b732d736c6f74732e706e67)](https://camo.githubusercontent.com/65dd3fb991b3cc14fe54f6c0c9248f274daf2565/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d7461736b732d736c6f74732e706e67)

这时每个 SubTask 线程运行在一个独立的 TaskSlot， 它们共享所属的 TaskManager 进程的 TCP 连接（通过多路复用技术）和心跳信息 (heartbeat messages)，从而可以降低整体的性能开销。此时看似是最好的情况，但是每个操作需要的资源都是不尽相同的，这里假设该作业 keyBy 操作所需资源的数量比 Sink 多很多 ，那么此时 Sink 所在 Slot 的资源就没有得到有效的利用。

基于这个原因，Flink 允许多个 subtasks 共享 slots，即使它们是不同 tasks 的 subtasks，但只要它们来自同一个 Job 就可以。假设上面 souce & map 和 keyBy 的并行度调整为 6，而 Slot 的数量不变，此时情况如下：

[![img](https://camo.githubusercontent.com/d642d9225d82a2bae8a7369e7c45ca1ac80fc490/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d7375627461736b2d736c6f74732e706e67)](https://camo.githubusercontent.com/d642d9225d82a2bae8a7369e7c45ca1ac80fc490/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d7375627461736b2d736c6f74732e706e67)

可以看到一个 Task Slot 中运行了多个 SubTask 子任务，此时每个子任务仍然在一个独立的线程中执行，只不过共享一组 Sot 资源而已。那么 Flink 到底如何确定一个 Job 至少需要多少个 Slot 呢？Flink 对于这个问题的处理很简单，默认情况一个 Job 所需要的 Slot 的数量就等于其 Operation 操作的最高并行度。如下， A，B，D 操作的并行度为 4，而 C，E 操作的并行度为 2，那么此时整个 Job 就需要至少四个 Slots 来完成。通过这个机制，Flink 就可以不必去关心一个 Job 到底会被拆分为多少个 Tasks 和 SubTasks。

[![img](https://camo.githubusercontent.com/f9378f52a789629176ba58d333356071c3f9d9d8/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d7461736b2d706172616c6c656c69736d2e706e67)](https://camo.githubusercontent.com/f9378f52a789629176ba58d333356071c3f9d9d8/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d7461736b2d706172616c6c656c69736d2e706e67)

#### 4.4 组件通讯

Flink 的所有组件都基于 Actor System 来进行通讯。Actor system 是多种角色的 actor 的容器，它提供调度，配置，日志记录等多种服务，并包含一个可以启动所有 actor 的线程池，如果 actor 是本地的，则消息通过共享内存进行共享，但如果 actor 是远程的，则通过 RPC 的调用来传递消息。

## Flink 窗口

按照统计维度的不同，Flink 中的窗口可以分为 时间窗口 (Time Windows) 和 计数窗口 (Count Windows) 。

### 时间窗口

时间窗口 (Time Windows) 用于以时间为维度来进行数据聚合，具体分为以下四类：

#### Tumbling Windows

滚动窗口 (Tumbling Windows) 是指彼此之间没有重叠的窗口。例如：每隔 1 小时统计过去 1 小时内的商品点击量，那么 1 天就只能分为 24 个窗口，每个窗口彼此之间是不存在重叠的，具体如下：

![img](https://camo.githubusercontent.com/00d13cef349b16d9c6bd251bd2dbf07a2aa386a8/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d74756d626c696e672d77696e646f77732e706e67)

#### Sliding Windows

滑动窗口（Sliding Windows）用于滚动进行聚合分析，例如：每隔 6 分钟统计一次过去一小时内所有商品的点击量，那么统计窗口彼此之间就是存在重叠的，即 1 天可以分为 240 个窗口。图示如下：

![img](https://camo.githubusercontent.com/998158d5517bf3f4e8af218adc233d76826d4678/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d736c6964696e672d77696e646f77732e706e67)

可以看到 window 1 - 4 这四个窗口彼此之间都存在着时间相等的重叠部分。想要实现滑动窗口，只需要在使用 timeWindow 方法时额外传递第二个参数作为滚动时间即可，具体如下：

```
// 每隔3秒统计一次过去1分钟内的数据
timeWindow(Time.minutes(1),Time.seconds(3))
```

#### Session Windows

当用户在进行持续浏览时，可能每时每刻都会有点击数据，例如在活动区间内，用户可能频繁的将某类商品加入和移除购物车，而你只想知道用户本次浏览最终的购物车情况，此时就可以在用户持有的会话结束后再进行统计。想要实现这类统计，可以通过会话窗口（Session Windows） 来进行实现。

![img](https://camo.githubusercontent.com/e379f3c0c9a3c48114b94a05e934a97e2f5876d5/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d73657373696f6e2d77696e646f77732e706e67)

具体的实现代码如下：

```
// 以处理时间为衡量标准，如果10秒内没有任何数据输入，就认为会话已经关闭，此时触发统计
window(ProcessingTimeSessionWindows.withGap(Time.seconds(10)))
// 以事件时间为衡量标准
window(EventTimeSessionWindows.withGap(Time.seconds(10)))
```

#### Global Windows

最后一个窗口是全局窗口（Global Windows）， 全局窗口会将所有 key 相同的元素分配到同一个窗口中，其通常配合触发器 (trigger) 进行使用。如果没有相应触发器，则计算将不会被执行。

![img](https://camo.githubusercontent.com/36f3b90755c9a95d9bd9fd998d40dc3d752f25e0/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d6e6f6e2d77696e646f7765642e706e67)

这里继续以上面词频统计的案例为例，示例代码如下：

```
// 当单词累计出现的次数每达到10次时，则触发计算，计算整个窗口内该单词出现的总数
window(GlobalWindows.create()).trigger(CountTrigger.of(10)).sum(1).print();
```

### 统计窗口

统计窗口（Count Windows）用于以数量为维度来进行数据聚合，同样也分为滚动窗口和滑动窗口，实现方式也和时间窗口完全一致，只是调用的 API 不同，具体如下：

```
// 滚动计数窗口，每1000次点击则计算一次
countWindow(1000)
// 滑动计数窗口，每10次点击发生后，则计算过去1000次点击的情况
countWindow(1000,10)
```

实际上计数窗口内部就是调用的我们上一部分介绍的全局窗口来实现的，其源码如下：

```
public WindowedStream<T, KEY, GlobalWindow> countWindow(long size) {
    return window(GlobalWindows.create()).trigger(PurgingTrigger.of(CountTrigger.of(size)));
}


public WindowedStream<T, KEY, GlobalWindow> countWindow(long size, long slide) {
    return window(GlobalWindows.create())
        .evictor(CountEvictor.of(size))
        .trigger(CountTrigger.of(slide));
}
```

## Flink 状态

Flink 一个比较重要的特性就是其支持有状态计算。即你可以将中间的计算结果进行保存，并提供给后续的计算使用：

[
![img](https://camo.githubusercontent.com/2a22dceb9623a0e9e07515478552423445cdacef/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d737461746566756c2d73747265616d2e706e67)](https://camo.githubusercontent.com/2a22dceb9623a0e9e07515478552423445cdacef/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d737461746566756c2d73747265616d2e706e67)

具体而言，Flink 又将状态 (State) 分为 Keyed State 与 Operator State：

### 2.1 算子状态

算子状态 (Operator State)：顾名思义，状态是和算子进行绑定的，一个算子的状态不能被其他算子所访问到。官方文档上对 Operator State 的解释是：_each operator state is bound to one parallel operator instance_，所以更为确切的说一个算子状态是与一个并发的算子实例所绑定的，即假设算子的并行度是 2，那么其应有两个对应的算子状态：

[![img](https://camo.githubusercontent.com/f1fe8ecd3503df42f7e16612fad6b0561627e4b0/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d6f70657261746f722d73746174652e706e67)](https://camo.githubusercontent.com/f1fe8ecd3503df42f7e16612fad6b0561627e4b0/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d6f70657261746f722d73746174652e706e67)

### 2.2 键控状态

键控状态 (Keyed State) ：是一种特殊的算子状态，即状态是根据 key 值进行区分的，Flink 会为每类键值维护一个状态实例。如下图所示，每个颜色代表不同 key 值，对应四个不同的状态实例。需要注意的是键控状态只能在 `KeyedStream` 上进行使用，我们可以通过 `stream.keyBy(...)` 来得到 `KeyedStream` 。

[![img](https://camo.githubusercontent.com/39b04c6e1fb1f2d8a88058e14c4bf04ea0967a3b/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d6b657965642d73746174652e706e67)](https://camo.githubusercontent.com/39b04c6e1fb1f2d8a88058e14c4bf04ea0967a3b/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f666c696e6b2d6b657965642d73746174652e706e67)

## Flink 应用场景

### 事件驱动型应用

#### 什么是事件驱动型应用？

事件驱动型应用是一类具有状态的应用，它从一个或多个事件流提取数据，并根据到来的事件触发计算、状态更新或其他外部动作。

事件驱动型应用是在计算存储分离的传统应用基础上进化而来。在传统架构中，应用需要读写远程事务型数据库。

相反，事件驱动型应用是基于状态化流处理来完成。在该设计中，数据和计算不会分离，应用只需访问本地（内存或磁盘）即可获取数据。系统容错性的实现依赖于定期向远程持久化存储写入 checkpoint。下图描述了传统应用和事件驱动型应用架构的区别。

![img](https://flink.apache.org/img/usecases-eventdrivenapps.png)

#### 事件驱动型应用的优势？

事件驱动型应用无须查询远程数据库，本地数据访问使得它具有更高的吞吐和更低的延迟。而由于定期向远程持久化存储的 checkpoint 工作可以异步、增量式完成，因此对于正常事件处理的影响甚微。事件驱动型应用的优势不仅限于本地数据访问。传统分层架构下，通常多个应用会共享同一个数据库，因而任何对数据库自身的更改（例如：由应用更新或服务扩容导致数据布局发生改变）都需要谨慎协调。反观事件驱动型应用，由于只需考虑自身数据，因此在更改数据表示或服务扩容时所需的协调工作将大大减少。

#### Flink 如何支持事件驱动型应用？

事件驱动型应用会受制于底层流处理系统对时间和状态的把控能力，Flink 诸多优秀特质都是围绕这些方面来设计的。它提供了一系列丰富的状态操作原语，允许以精确一次的一致性语义合并海量规模（TB 级别）的状态数据。此外，Flink 还支持事件时间和自由度极高的定制化窗口逻辑，而且它内置的 `ProcessFunction` 支持细粒度时间控制，方便实现一些高级业务逻辑。同时，Flink 还拥有一个复杂事件处理（CEP）类库，可以用来检测数据流中的模式。

Flink 中针对事件驱动应用的明星特性当属 savepoint。Savepoint 是一个一致性的状态映像，它可以用来初始化任意状态兼容的应用。在完成一次 savepoint 后，即可放心对应用升级或扩容，还可以启动多个版本的应用来完成 A/B 测试。

#### 典型的事件驱动型应用实例

- [反欺诈](https://sf-2017.flink-forward.org/kb_sessions/streaming-models-how-ing-adds-models-at-runtime-to-catch-fraudsters/)
- [异常检测](https://sf-2017.flink-forward.org/kb_sessions/building-a-real-time-anomaly-detection-system-with-flink-mux/)
- [基于规则的报警](https://sf-2017.flink-forward.org/kb_sessions/dynamically-configured-stream-processing-using-flink-kafka/)
- [业务流程监控](https://jobs.zalando.com/tech/blog/complex-event-generation-for-business-process-monitoring-using-apache-flink/)
- [（社交网络）Web 应用](https://berlin-2017.flink-forward.org/kb_sessions/drivetribes-kappa-architecture-with-apache-flink/)

### 数据分析应用

#### 什么是数据分析应用？

数据分析任务需要从原始数据中提取有价值的信息和指标。传统的分析方式通常是利用批查询，或将事件记录下来并基于此有限数据集构建应用来完成。为了得到最新数据的分析结果，必须先将它们加入分析数据集并重新执行查询或运行应用，随后将结果写入存储系统或生成报告。

借助一些先进的流处理引擎，还可以实时地进行数据分析。和传统模式下读取有限数据集不同，流式查询或应用会接入实时事件流，并随着事件消费持续产生和更新结果。这些结果数据可能会写入外部数据库系统或以内部状态的形式维护。仪表展示应用可以相应地从外部数据库读取数据或直接查询应用的内部状态。

如下图所示，Apache Flink 同时支持流式及批量分析应用。

![img](https://flink.apache.org/img/usecases-analytics.png)

#### 流式分析应用的优势？

和批量分析相比，由于流式分析省掉了周期性的数据导入和查询过程，因此从事件中获取指标的延迟更低。不仅如此，批量查询必须处理那些由定期导入和输入有界性导致的人工数据边界，而流式查询则无须考虑该问题。

另一方面，流式分析会简化应用抽象。批量查询的流水线通常由多个独立部件组成，需要周期性地调度提取数据和执行查询。如此复杂的流水线操作起来并不容易，一旦某个组件出错将会影响流水线的后续步骤。而流式分析应用整体运行在 Flink 之类的高端流处理系统之上，涵盖了从数据接入到连续结果计算的所有步骤，因此可以依赖底层引擎提供的故障恢复机制。

#### Flink 如何支持数据分析类应用？

Flink 为持续流式分析和批量分析都提供了良好的支持。具体而言，它内置了一个符合 ANSI 标准的 SQL 接口，将批、流查询的语义统一起来。无论是在记录事件的静态数据集上还是实时事件流上，相同 SQL 查询都会得到一致的结果。同时 Flink 还支持丰富的用户自定义函数，允许在 SQL 中执行定制化代码。如果还需进一步定制逻辑，可以利用 Flink DataStream API 和 DataSet API 进行更低层次的控制。此外，Flink 的 Gelly 库为基于批量数据集的大规模高性能图分析提供了算法和构建模块支持。

#### 典型的数据分析应用实例

- [电信网络质量监控](http://2016.flink-forward.org/kb_sessions/a-brief-history-of-time-with-apache-flink-real-time-monitoring-and-analysis-with-flink-kafka-hb/)
- 移动应用中的[产品更新及实验评估分析](https://techblog.king.com/rbea-scalable-real-time-analytics-king/)
- 消费者技术中的[实时数据即席分析](https://eng.uber.com/athenax/)
- 大规模图分析

### 数据管道应用

#### 什么是数据管道？

提取-转换-加载（ETL）是一种在存储系统之间进行数据转换和迁移的常用方法。ETL 作业通常会周期性地触发，将数据从事务型数据库拷贝到分析型数据库或数据仓库。

数据管道和 ETL 作业的用途相似，都可以转换、丰富数据，并将其从某个存储系统移动到另一个。但数据管道是以持续流模式运行，而非周期性触发。因此它支持从一个不断生成数据的源头读取记录，并将它们以低延迟移动到终点。例如：数据管道可以用来监控文件系统目录中的新文件，并将其数据写入事件日志；另一个应用可能会将事件流物化到数据库或增量构建和优化查询索引。

下图描述了周期性 ETL 作业和持续数据管道的差异。

![img](https://flink.apache.org/img/usecases-datapipelines.png)

#### 数据管道的优势？

和周期性 ETL 作业相比，持续数据管道可以明显降低将数据移动到目的端的延迟。此外，由于它能够持续消费和发送数据，因此用途更广，支持用例更多。

#### Flink 如何支持数据管道应用？

很多常见的数据转换和增强操作可以利用 Flink 的 SQL 接口（或 Table API）及用户自定义函数解决。如果数据管道有更高级的需求，可以选择更通用的 DataStream API 来实现。Flink 为多种数据存储系统（如：Kafka、Kinesis、Elasticsearch、JDBC 数据库系统等）内置了连接器。同时它还提供了文件系统的连续型数据源及数据汇，可用来监控目录变化和以时间分区的方式写入文件。

#### 典型的数据管道应用实例

- 电子商务中的[实时查询索引构建](https://ververica.com/blog/blink-flink-alibaba-search)
- 电子商务中的[持续 ETL](https://jobs.zalando.com/tech/blog/apache-showdown-flink-vs.-spark/)

## 参考资料

- [Flink 官网](https://flink.apache.org/zh/)