---
title: Flink简介
date: 2022-02-17 22:28:55
order: 02
categories:
  - 大数据
  - flink
tags:
  - 大数据
  - Flink
permalink: /pages/c621d72e/
---

# Flink 简介

> 关键概念：源源不断的流式数据处理、事件时间、有状态流处理和状态快照

## 流处理

任何类型的数据都可以形成一种事件流。信用卡交易、传感器测量、机器日志、网站或移动应用程序上的用户交互记录，所有这些数据都形成一种流。

数据可以被作为 _无界_ 或者 _有界_ 流来处理。

1. **无界流** 有定义流的开始，但没有定义流的结束。它们会无休止地产生数据。无界流的数据必须持续处理，即数据被摄取后需要立刻处理。我们不能等到所有数据都到达再处理，因为输入是无限的，在任何时候输入都不会完成。处理无界数据通常要求以特定顺序摄取事件，例如事件发生的顺序，以便能够推断结果的完整性。
2. **有界流** 有定义流的开始，也有定义流的结束。有界流可以在摄取所有数据后再进行计算。有界流所有数据可以被排序，所以并不需要有序摄取。有界流处理通常被称为批处理。

![Bounded and unbounded streams](https://nightlies.apache.org/flink/flink-docs-release-1.14/fig/bounded-unbounded.png)

**Apache Flink 擅长处理无界和有界数据集** 精确的时间控制和状态化使得 Flink 的运行时(runtime)能够运行任何处理无界流的应用。有界流则由一些专为固定大小数据集特殊设计的算法和数据结构进行内部处理，产生了出色的性能。

**批处理**是有界数据流处理的范例。在这种模式下，你可以选择在计算结果输出之前输入整个数据集，这也就意味着你可以对整个数据集的数据进行排序、统计或汇总计算后再输出结果。

**流处理**正相反，其涉及无界数据流。至少理论上来说，它的数据输入永远不会结束，因此程序必须持续不断地对到达的数据进行处理。

在 Flink 中，应用程序由用户自定义**算子**转换而来的**流式 dataflows** 所组成。这些流式 dataflows 形成了有向图，以一个或多个**源**（source）开始，并以一个或多个**汇**（sink）结束。

![A DataStream program, and its dataflow.](https://nightlies.apache.org/flink/flink-docs-release-1.14/fig/program_dataflow.svg)

通常，程序代码中的 transformation 和 dataflow 中的算子（operator）之间是一一对应的。但有时也会出现一个 transformation 包含多个算子的情况，如上图所示。

Flink 应用程序可以消费来自消息队列或分布式日志这类流式数据源（例如 Apache Kafka 或 Kinesis）的实时数据，也可以从各种的数据源中消费有界的历史数据。同样，Flink 应用程序生成的结果流也可以发送到各种数据汇中。

![Flink application with sources and sinks](https://nightlies.apache.org/flink/flink-docs-release-1.14/fig/flink-application-sources-sinks.png)

### 并行 Dataflows

Flink 程序本质上是分布式并行程序。在程序执行期间，一个流有一个或多个**流分区**（Stream Partition），每个算子有一个或多个**算子子任务**（Operator Subtask）。每个子任务彼此独立，并在不同的线程中运行，或在不同的计算机或容器中运行。

算子子任务数就是其对应算子的**并行度**。在同一程序中，不同算子也可能具有不同的并行度。

![A parallel dataflow](https://nightlies.apache.org/flink/flink-docs-release-1.14/fig/parallel_dataflow.svg)

Flink 算子之间可以通过*一对一*（_直传_）模式或*重新分发*模式传输数据：

- **一对一**模式（例如上图中的 _Source_ 和 _map()_ 算子之间）可以保留元素的分区和顺序信息。这意味着 _map()_ 算子的 subtask[1] 输入的数据以及其顺序与 _Source_ 算子的 subtask[1] 输出的数据和顺序完全相同，即同一分区的数据只会进入到下游算子的同一分区。
- **重新分发**模式（例如上图中的 _map()_ 和 _keyBy/window_ 之间，以及 _keyBy/window_ 和 _Sink_ 之间）则会更改数据所在的流分区。当你在程序中选择使用不同的 _transformation_，每个*算子子任务*也会根据不同的 transformation 将数据发送到不同的目标子任务。例如以下这几种 transformation 和其对应分发数据的模式：_keyBy()_（通过散列键重新分区）、_broadcast()_（广播）或 _rebalance()_（随机重新分发）。在*重新分发*数据的过程中，元素只有在每对输出和输入子任务之间才能保留其之间的顺序信息（例如，_keyBy/window_ 的 subtask[2] 接收到的 _map()_ 的 subtask[1] 中的元素都是有序的）。因此，上图所示的 _keyBy/window_ 和 _Sink_ 算子之间数据的重新分发时，不同键（key）的聚合结果到达 Sink 的顺序是不确定的。

### 自定义时间流处理

对于大多数流数据处理应用程序而言，能够使用处理实时数据的代码重新处理历史数据并产生确定并一致的结果非常有价值。

在处理流式数据时，我们通常更需要关注事件本身发生的顺序而不是事件被传输以及处理的顺序，因为这能够帮助我们推理出一组事件（事件集合）是何时发生以及结束的。例如电子商务交易或金融交易中涉及到的事件集合。

为了满足上述这类的实时流处理场景，我们通常会使用记录在数据流中的事件时间的时间戳，而不是处理数据的机器时钟的时间戳。

### 有状态流处理

Flink 中的算子可以是有状态的。这意味着如何处理一个事件可能取决于该事件之前所有事件数据的累积结果。Flink 中的状态不仅可以用于简单的场景（例如统计仪表板上每分钟显示的数据），也可以用于复杂的场景（例如训练作弊检测模型）。

Flink 应用程序可以在分布式集群上并行运行，其中每个算子的各个并行实例会在单独的线程中独立运行，并且通常情况下是会在不同的机器上运行。

有状态算子的并行实例组在存储其对应状态时通常是按照键（key）进行分片存储的。每个并行实例算子负责处理一组特定键的事件数据，并且这组键对应的状态会保存在本地。

如下图的 Flink 作业，其前三个算子的并行度为 2，最后一个 sink 算子的并行度为 1，其中第三个算子是有状态的，并且你可以看到第二个算子和第三个算子之间是全互联的（fully-connected），它们之间通过网络进行数据分发。通常情况下，实现这种类型的 Flink 程序是为了通过某些键对数据流进行分区，以便将需要一起处理的事件进行汇合，然后做统一计算处理。

![State is sharded](https://nightlies.apache.org/flink/flink-docs-release-1.14/fig/parallel-job.png)

Flink 应用程序的状态访问都在本地进行，因为这有助于其提高吞吐量和降低延迟。通常情况下 Flink 应用程序都是将状态存储在 JVM 堆上，但如果状态太大，我们也可以选择将其以结构化数据格式存储在高速磁盘中。

![State is local](https://nightlies.apache.org/flink/flink-docs-release-1.14/fig/local-state.png)

### 通过状态快照实现的容错

通过状态快照和流重放两种方式的组合，Flink 能够提供可容错的，精确一次计算的语义。这些状态快照在执行时会获取并存储分布式 pipeline 中整体的状态，它会将数据源中消费数据的偏移量记录下来，并将整个 job graph 中算子获取到该数据（记录的偏移量对应的数据）时的状态记录并存储下来。当发生故障时，Flink 作业会恢复上次存储的状态，重置数据源从状态中记录的上次消费的偏移量开始重新进行消费处理。而且状态快照在执行时会异步获取状态并存储，并不会阻塞正在进行的数据处理逻辑。

## 状态

只有在每一个单独的事件上进行转换操作的应用才不需要状态，换言之，每一个具有一定复杂度的流处理应用都是有状态的。任何运行基本业务逻辑的流处理应用都需要在一定时间内存储所接收的事件或中间结果，以供后续的某个时间点（例如收到下一个事件或者经过一段特定时间）进行访问并进行后续处理。

![img](https://flink.apache.org/img/function-state.png)

应用状态是 Flink 中的一等公民，Flink 提供了许多状态管理相关的特性支持，其中包括：

- **多种状态基础类型**：Flink 为多种不同的数据结构提供了相对应的状态基础类型，例如原子值（value），列表（list）以及映射（map）。开发者可以基于处理函数对状态的访问方式，选择最高效、最适合的状态基础类型。
- **插件化的 State Backend**：State Backend 负责管理应用程序状态，并在需要的时候进行 checkpoint。Flink 支持多种 state backend，可以将状态存在内存或者 [RocksDB](https://rocksdb.org/)。RocksDB 是一种高效的嵌入式、持久化键值存储引擎。Flink 也支持插件式的自定义 state backend 进行状态存储。
- **精确一次语义**：Flink 的 checkpoint 和故障恢复算法保证了故障发生后应用状态的一致性。因此，Flink 能够在应用程序发生故障时，对应用程序透明，不造成正确性的影响。
- **超大数据量状态**：Flink 能够利用其异步以及增量式的 checkpoint 算法，存储数 TB 级别的应用状态。
- **可弹性伸缩的应用**：Flink 能够通过在更多或更少的工作节点上对状态进行重新分布，支持有状态应用的分布式的横向伸缩。

## 时间

### 时间语义

Flink 支持以下三种时间语义:

- **事件时间(event time)**： 事件产生的时间，记录的是设备生产(或者存储)事件的时间
- **摄取时间(ingestion time)**： Flink 读取事件时记录的时间
- **处理时间(processing time)**： Flink pipeline 中具体算子处理事件的时间

为了获得可重现的结果，例如在计算过去的特定一天里第一个小时股票的最高价格时，我们应该使用事件时间。这样的话，无论什么时间去计算都不会影响输出结果。然而如果使用处理时间的话，实时应用程序的结果是由程序运行的时间所决定。多次运行基于处理时间的实时程序，可能得到的结果都不相同，也可能会导致再次分析历史数据或者测试新代码变得异常困难。

### Event Time

如果想要使用事件时间，需要额外给 Flink 提供一个时间戳提取器和 Watermark 生成器，Flink 将使用它们来跟踪事件时间的进度。

### Watermark

让我们通过一个简单的示例来演示为什么需要 watermarks 及其工作方式。

在此示例中，我们将看到带有混乱时间戳的事件流，如下所示。显示的数字表达的是这些事件实际发生时间的时间戳。到达的第一个事件发生在时间 4，随后发生的事件发生在更早的时间 2，依此类推：

··· 23 19 22 24 21 14 17 13 12 15 9 11 7 2 4 →

假设我们要对数据流排序，我们想要达到的目的是：应用程序应该在数据流里的事件到达时就有一个算子（我们暂且称之为排序）开始处理事件，这个算子所输出的流是按照时间戳排序好的。

让我们重新审视这些数据:

(1) 我们的排序器看到的第一个事件的时间戳是 4，但是我们不能立即将其作为已排序的流释放。因为我们并不能确定它是有序的，并且较早的事件有可能并未到达。事实上，如果站在上帝视角，我们知道，必须要等到时间戳为 2 的元素到来时，排序器才可以有事件输出。

_需要一些缓冲，需要一些时间，但这都是值得的_

(2) 接下来的这一步，如果我们选择的是固执的等待，我们永远不会有结果。首先，我们看到了时间戳为 4 的事件，然后看到了时间戳为 2 的事件。可是，时间戳小于 2 的事件接下来会不会到来呢？可能会，也可能不会。再次站在上帝视角，我们知道，我们永远不会看到时间戳 1。

_最终，我们必须勇于承担责任，并发出指令，把带有时间戳 2 的事件作为已排序的事件流的开始_

(3) 然后，我们需要一种策略，该策略定义：对于任何给定时间戳的事件，Flink 何时停止等待较早事件的到来。

_这正是 watermarks 的作用_ — 它们定义何时停止等待较早的事件。

Flink 中事件时间的处理取决于 _watermark 生成器_，后者将带有时间戳的特殊元素插入流中形成 _watermarks_。事件时间 _t_ 的 watermark 代表 _t_ 之前（很可能）都已经到达。

当 watermark 以 2 或更大的时间戳到达时，事件流的排序器应停止等待，并输出 2 作为已经排序好的流。

(4) 我们可能会思考，如何决定 watermarks 的不同生成策略

每个事件都会延迟一段时间后到达，然而这些延迟有所不同，有些事件可能比其他事件延迟得更多。一种简单的方法是假定这些延迟受某个最大延迟的限制。Flink 将此策略称为 _最大无序边界 (bounded-out-of-orderness)_ watermark。当然，我们可以想像出更好的生成 watermark 的方法，但是对于大多数应用而言，固定延迟策略已经足够了。

### 延迟 VS 正确性

watermarks 给了开发者流处理的一种选择，它们使开发人员在开发应用程序时可以控制延迟和完整性之间的权衡。与批处理不同，批处理中的奢侈之处在于可以在产生任何结果之前完全了解输入，而使用流式传输，我们不被允许等待所有的时间都产生了，才输出排序好的数据，这与流相违背。

我们可以把 watermarks 的边界时间配置的相对较短，从而冒着在输入了解不完全的情况下产生结果的风险-即可能会很快产生错误结果。或者，你可以等待更长的时间，并利用对输入流的更全面的了解来产生结果。

当然也可以实施混合解决方案，先快速产生初步结果，然后在处理其他（最新）数据时向这些结果提供更新。对于有一些对延迟的容忍程度很低，但是又对结果有很严格的要求的场景下，或许是一个福音。

### 延迟

延迟是相对于 watermarks 定义的。`Watermark(t)` 表示事件流的时间已经到达了 _t_; watermark 之后的时间戳 ≤ _t_ 的任何事件都被称之为延迟事件。

### 使用 Watermarks

如果想要使用基于带有事件时间戳的事件流，Flink 需要知道与每个事件相关的时间戳，而且流必须包含 watermark。

动手练习中使用的出租车数据源已经为我们处理了这些详细信息。但是，在您自己的应用程序中，您将必须自己进行处理，这通常是通过实现一个类来实现的，该类从事件中提取时间戳，并根据需要生成 watermarks。最简单的方法是使用 `WatermarkStrategy`：

```java
DataStream<Event> stream = ...

WatermarkStrategy<Event> strategy = WatermarkStrategy
        .<Event>forBoundedOutOfOrderness(Duration.ofSeconds(20))
        .withTimestampAssigner((event, timestamp) -> event.timestamp);

DataStream<Event> withTimestampsAndWatermarks =
    stream.assignTimestampsAndWatermarks(strategy);
```

## 窗口

我们在操作无界数据流时，经常需要应对以下问题，我们经常把无界数据流分解成有界数据流聚合分析：

- 每分钟的浏览量
- 每位用户每周的会话数
- 每个传感器每分钟的最高温度

用 Flink 计算窗口分析取决于两个主要的抽象操作：_Window Assigners_，将事件分配给窗口（根据需要创建新的窗口对象），以及 _Window Functions_，处理窗口内的数据。

Flink 的窗口 API 还具有 _Triggers_ 和 _Evictors_ 的概念，_Triggers_ 确定何时调用窗口函数，而 _Evictors_ 则可以删除在窗口中收集的元素。

举一个简单的例子，我们一般这样使用键控事件流（基于 key 分组的输入事件流）：

```java
stream.
    .keyBy(<key selector>)
    .window(<window assigner>)
    .reduce|aggregate|process(<window function>)
```

您不是必须使用键控事件流（keyed stream），但是值得注意的是，如果不使用键控事件流，我们的程序就不能 _并行_ 处理。

```java
stream.
    .windowAll(<window assigner>)
    .reduce|aggregate|process(<window function>)
```

### 窗口分配器

Flink 有一些内置的窗口分配器，如下所示：

![Window assigners](https://nightlies.apache.org/flink/flink-docs-release-1.14/fig/window-assigners.svg)

通过一些示例来展示关于这些窗口如何使用，或者如何区分它们：

- 滚动时间窗口
  - _每分钟页面浏览量_
  - `TumblingEventTimeWindows.of(Time.minutes(1))`
- 滑动时间窗口
  - _每 10 秒钟计算前 1 分钟的页面浏览量_
  - `SlidingEventTimeWindows.of(Time.minutes(1), Time.seconds(10))`
- 会话窗口
  - _每个会话的网页浏览量，其中会话之间的间隔至少为 30 分钟_
  - `EventTimeSessionWindows.withGap(Time.minutes(30))`

以下都是一些可以使用的间隔时间 `Time.milliseconds(n)`, `Time.seconds(n)`, `Time.minutes(n)`, `Time.hours(n)`, 和 `Time.days(n)`。

基于时间的窗口分配器（包括会话时间）既可以处理 `事件时间`，也可以处理 `处理时间`。这两种基于时间的处理没有哪一个更好，我们必须折衷。使用 `处理时间`，我们必须接受以下限制：

- 无法正确处理历史数据,
- 无法正确处理超过最大无序边界的数据,
- 结果将是不确定的,

但是有自己的优势，较低的延迟。

使用基于计数的窗口时，请记住，只有窗口内的事件数量到达窗口要求的数值时，这些窗口才会触发计算。尽管可以使用自定义触发器自己实现该行为，但无法应对超时和处理部分窗口。

我们可能在有些场景下，想使用全局 window assigner 将每个事件（相同的 key）都分配给某一个指定的全局窗口。 很多情况下，一个比较好的建议是使用 `ProcessFunction`，具体介绍在[这里](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/learn-flink/event_driven/#process-functions)。

### 窗口应用函数

我们有三种最基本的操作窗口内的事件的选项:

1. 像批量处理，`ProcessWindowFunction` 会缓存 `Iterable` 和窗口内容，供接下来全量计算；
2. 或者像流处理，每一次有事件被分配到窗口时，都会调用 `ReduceFunction` 或者 `AggregateFunction` 来增量计算；
3. 或者结合两者，通过 `ReduceFunction` 或者 `AggregateFunction` 预聚合的增量计算结果在触发窗口时， 提供给 `ProcessWindowFunction` 做全量计算。

接下来展示一段 1 和 3 的示例，每一个实现都是计算传感器的最大值。在每一个一分钟大小的事件时间窗口内, 生成一个包含 `(key,end-of-window-timestamp, max_value)` 的一组结果。

#### ProcessWindowFunction 示例

```java
DataStream<SensorReading> input = ...

input
    .keyBy(x -> x.key)
    .window(TumblingEventTimeWindows.of(Time.minutes(1)))
    .process(new MyWastefulMax());

public static class MyWastefulMax extends ProcessWindowFunction<
        SensorReading,                  // 输入类型
        Tuple3<String, Long, Integer>,  // 输出类型
        String,                         // 键类型
        TimeWindow> {                   // 窗口类型

    @Override
    public void process(
            String key,
            Context context,
            Iterable<SensorReading> events,
            Collector<Tuple3<String, Long, Integer>> out) {

        int max = 0;
        for (SensorReading event : events) {
            max = Math.max(event.value, max);
        }
        out.collect(Tuple3.of(key, context.window().getEnd(), max));
    }
}
```

在当前实现中有一些值得关注的地方：

- Flink 会缓存所有分配给窗口的事件流，直到触发窗口为止。这个操作可能是相当昂贵的。
- Flink 会传递给 `ProcessWindowFunction` 一个 `Context` 对象，这个对象内包含了一些窗口信息。`Context` 接口 展示大致如下:

```java
public abstract class Context implements java.io.Serializable {
    public abstract W window();

    public abstract long currentProcessingTime();
    public abstract long currentWatermark();

    public abstract KeyedStateStore windowState();
    public abstract KeyedStateStore globalState();
}
```

`windowState` 和 `globalState` 可以用来存储当前的窗口的 key、窗口或者当前 key 的每一个窗口信息。这在一些场景下会很有用，试想，我们在处理当前窗口的时候，可能会用到上一个窗口的信息。

#### 增量聚合示例

```java
DataStream<SensorReading> input = ...

input
    .keyBy(x -> x.key)
    .window(TumblingEventTimeWindows.of(Time.minutes(1)))
    .reduce(new MyReducingMax(), new MyWindowFunction());

private static class MyReducingMax implements ReduceFunction<SensorReading> {
    public SensorReading reduce(SensorReading r1, SensorReading r2) {
        return r1.value() > r2.value() ? r1 : r2;
    }
}

private static class MyWindowFunction extends ProcessWindowFunction<
    SensorReading, Tuple3<String, Long, SensorReading>, String, TimeWindow> {

    @Override
    public void process(
            String key,
            Context context,
            Iterable<SensorReading> maxReading,
            Collector<Tuple3<String, Long, SensorReading>> out) {

        SensorReading max = maxReading.iterator().next();
        out.collect(Tuple3.of(key, context.window().getEnd(), max));
    }
}
```

请注意 `Iterable<SensorReading>` 将只包含一个读数 – `MyReducingMax` 计算出的预先汇总的最大值。

### 晚到的事件

默认场景下，超过最大无序边界的事件会被删除，但是 Flink 给了我们两个选择去控制这些事件。

您可以使用一种称为[旁路输出](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/learn-flink/event_driven/#side-outputs) 的机制来安排将要删除的事件收集到侧输出流中，这里是一个示例:

```java
OutputTag<Event> lateTag = new OutputTag<Event>("late"){};

SingleOutputStreamOperator<Event> result = stream.
    .keyBy(...)
    .window(...)
    .sideOutputLateData(lateTag)
    .process(...);

DataStream<Event> lateStream = result.getSideOutput(lateTag);
```

我们还可以指定 _允许的延迟(allowed lateness)_ 的间隔，在这个间隔时间内，延迟的事件将会继续分配给窗口（同时状态会被保留），默认状态下，每个延迟事件都会导致窗口函数被再次调用（有时也称之为 _late firing_ ）。

默认情况下，允许的延迟为 0。换句话说，watermark 之后的元素将被丢弃（或发送到侧输出流）。

举例说明:

```java
stream.
    .keyBy(...)
    .window(...)
    .allowedLateness(Time.seconds(10))
    .process(...);
```

当允许的延迟大于零时，只有那些超过最大无序边界以至于会被丢弃的事件才会被发送到侧输出流（如果已配置）。

### 深入了解窗口操作

Flink 的窗口 API 某些方面有一些奇怪的行为，可能和我们预期的行为不一致。 根据 [Flink 用户邮件列表](https://flink.apache.org/community.html#mailing-lists) 和其他地方一些频繁被问起的问题, 以下是一些有关 Windows 的底层事实，这些信息可能会让您感到惊讶。

#### 滑动窗口是通过复制来实现的

滑动窗口分配器可以创建许多窗口对象，并将每个事件复制到每个相关的窗口中。例如，如果您每隔 15 分钟就有 24 小时的滑动窗口，则每个事件将被复制到 4 \* 24 = 96 个窗口中。

#### 时间窗口会和时间对齐

仅仅因为我们使用的是一个小时的处理时间窗口并在 12:05 开始运行您的应用程序，并不意味着第一个窗口将在 1:05 关闭。第一个窗口将长 55 分钟，并在 1:00 关闭。

请注意，滑动窗口和滚动窗口分配器所采用的 offset 参数可用于改变窗口的对齐方式。有关详细的信息，请参见 [滚动窗口](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/datastream/operators/windows/#tumbling-windows) 和 [滑动窗口](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/datastream/operators/windows/#sliding-windows) 。

#### window 后面可以接 window

比如说:

```java
stream
    .keyBy(t -> t.key)
    .window(<window assigner>)
    .reduce(<reduce function>)
    .windowAll(<same window assigner>)
    .reduce(<same reduce function>)
```

可能我们会猜测以 Flink 的能力，想要做到这样看起来是可行的（前提是你使用的是 ReduceFunction 或 AggregateFunction ），但不是。

之所以可行，是因为时间窗口产生的事件是根据窗口结束时的时间分配时间戳的。例如，一个小时小时的窗口所产生的所有事件都将带有标记一个小时结束的时间戳。后面的窗口内的数据消费和前面的流产生的数据是一致的。

#### 空的时间窗口不会输出结果

事件会触发窗口的创建。换句话说，如果在特定的窗口内没有事件，就不会有窗口，就不会有输出结果。

#### 延迟时间会导致延迟聚合

会话窗口的实现是基于窗口的一个抽象能力，窗口可以 _聚合_。会话窗口中的每个数据在初始被消费时，都会被分配一个新的窗口，但是如果窗口之间的间隔足够小，多个窗口就会被聚合。延迟事件可以弥合两个先前分开的会话间隔，从而产生一个虽然有延迟但是更加准确地结果。

## 参考资料

- [Flink 官方文档](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/)