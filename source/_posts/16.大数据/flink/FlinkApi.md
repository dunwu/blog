---
title: Flink API
date: 2022-02-17 22:28:55
order: 05
categories:
  - 大数据
  - flink
tags:
  - 大数据
  - Flink
permalink: /pages/dc12c339/
---

# Flink API

## Flink API 的分层

Flink 为流式/批式处理应用程序的开发提供了不同级别的抽象。

![Programming levels of abstraction](https://nightlies.apache.org/flink/flink-docs-release-1.14/fig/levels_of_abstraction.svg)

- Flink API 最底层的抽象为**有状态实时流处理**。其抽象实现是 [Process Function](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/datastream/operators/process_function/)，并且 **Process Function** 被 Flink 框架集成到了 [DataStream API](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/datastream/overview/) 中来为我们使用。它允许用户在应用程序中自由地处理来自单流或多流的事件（数据），并提供具有全局一致性和容错保障的*状态*。此外，用户可以在此层抽象中注册事件时间（event time）和处理时间（processing time）回调方法，从而允许程序可以实现复杂计算。

- Flink API 第二层抽象是 **Core APIs**。实际上，许多应用程序不需要使用到上述最底层抽象的 API，而是可以使用 **Core APIs** 进行编程：其中包含 [DataStream API](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/datastream/overview/)（应用于有界/无界数据流场景）和 [DataSet API](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/dataset/overview/)（应用于有界数据集场景）两部分。Core APIs 提供的流式 API（Fluent API）为数据处理提供了通用的模块组件，例如各种形式的用户自定义转换（transformations）、联接（joins）、聚合（aggregations）、窗口（windows）和状态（state）操作等。此层 API 中处理的数据类型在每种编程语言中都有其对应的类。

  _Process Function_ 这类底层抽象和 _DataStream API_ 的相互集成使得用户可以选择使用更底层的抽象 API 来实现自己的需求。_DataSet API_ 还额外提供了一些原语，比如循环/迭代（loop/iteration）操作。

- Flink API 第三层抽象是 **Table API**。**Table API** 是以表（Table）为中心的声明式编程（DSL）API，例如在流式数据场景下，它可以表示一张正在动态改变的表。[Table API](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/overview/) 遵循（扩展）关系模型：即表拥有 schema（类似于关系型数据库中的 schema），并且 Table API 也提供了类似于关系模型中的操作，比如 select、project、join、group-by 和 aggregate 等。Table API 程序是以声明的方式定义*应执行的逻辑操作*，而不是确切地指定程序*应该执行的代码*。尽管 Table API 使用起来很简洁并且可以由各种类型的用户自定义函数扩展功能，但还是比 Core API 的表达能力差。此外，Table API 程序在执行之前还会使用优化器中的优化规则对用户编写的表达式进行优化。

  表和 _DataStream_/_DataSet_ 可以进行无缝切换，Flink 允许用户在编写应用程序时将 _Table API_ 与 _DataStream_/_DataSet_ API 混合使用。

- Flink API 最顶层抽象是 **SQL**。这层抽象在语义和程序表达式上都类似于 _Table API_，但是其程序实现都是 SQL 查询表达式。[SQL](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/overview/#sql) 抽象与 Table API 抽象之间的关联是非常紧密的，并且 SQL 查询语句可以在 _Table API_ 中定义的表上执行。

## ProcessFunction

[ProcessFunction](https://nightlies.apache.org/flink/flink-docs-stable/dev/stream/operators/process_function.html) 是 Flink 所提供的最具表达力的接口。ProcessFunction 可以处理一或两条输入数据流中的单个事件或者归入一个特定窗口内的多个事件。它提供了**对于时间和状态的细粒度控制**。开发者可以在其中任意地修改状态，也能够注册定时器用以在未来的某一时刻触发回调函数。因此，你可以利用 ProcessFunction 实现许多[有状态的事件驱动应用](https://flink.apache.org/zh/usecases.html#eventDrivenApps)所需要的基于单个事件的复杂业务逻辑。

下面的代码示例展示了如何在 `KeyedStream` 上利用 `KeyedProcessFunction` 对标记为 `START` 和 `END` 的事件进行处理。当收到 `START` 事件时，处理函数会记录其时间戳，并且注册一个时长 4 小时的计时器。如果在计时器结束之前收到 `END` 事件，处理函数会计算其与上一个 `START` 事件的时间间隔，清空状态并将计算结果返回。否则，计时器结束，并清空状态。

```java
/**

 * 将相邻的 keyed START 和 END 事件相匹配并计算两者的时间间隔
 * 输入数据为 Tuple2<String, String> 类型，第一个字段为 key 值，
 * 第二个字段标记 START 和 END 事件。
    */
public static class StartEndDuration
    extends KeyedProcessFunction<String, Tuple2<String, String>, Tuple2<String, Long>> {

  private ValueState<Long> startTime;

  @Override
  public void open(Configuration conf) {
    // obtain state handle
    startTime = getRuntimeContext()
      .getState(new ValueStateDescriptor<Long>("startTime", Long.class));
  }

  /** Called for each processed event. */
  @Override
  public void processElement(
      Tuple2<String, String> in,
      Context ctx,
      Collector<Tuple2<String, Long>> out) throws Exception {

    switch (in.f1) {
      case "START":
        // set the start time if we receive a start event.
        startTime.update(ctx.timestamp());
        // register a timer in four hours from the start event.
        ctx.timerService()
          .registerEventTimeTimer(ctx.timestamp() + 4 * 60 * 60 * 1000);
        break;
      case "END":
        // emit the duration between start and end event
        Long sTime = startTime.value();
        if (sTime != null) {
          out.collect(Tuple2.of(in.f0, ctx.timestamp() - sTime));
          // clear the state
          startTime.clear();
        }
      default:
        // do nothing
    }
  }

  /** Called when a timer fires. */
  @Override
  public void onTimer(
      long timestamp,
      OnTimerContext ctx,
      Collector<Tuple2<String, Long>> out) {

    // Timeout interval exceeded. Cleaning up the state.
    startTime.clear();
  }
}
```

这个例子充分展现了 `KeyedProcessFunction` 强大的表达力，也因此是一个实现相当复杂的接口。

## DataStream API

[DataStream API](https://nightlies.apache.org/flink/flink-docs-stable/dev/datastream_api.html) 为许多通用的流处理操作提供了处理原语。这些操作包括窗口、逐条记录的转换操作，在处理事件时进行外部数据库查询等。DataStream API 支持 Java 和 Scala 语言，预先定义了例如`map()`、`reduce()`、`aggregate()` 等函数。你可以通过扩展实现预定义接口或使用 Java、Scala 的 lambda 表达式实现自定义的函数。

下面的代码示例展示了如何捕获会话时间范围内所有的点击流事件，并对每一次会话的点击量进行计数。

```java
// 网站点击 Click 的数据流
DataStream<Click> clicks = ...

DataStream<Tuple2<String, Long>> result = clicks
  // 将网站点击映射为 (userId, 1) 以便计数
  .map(
    // 实现 MapFunction 接口定义函数
    new MapFunction<Click, Tuple2<String, Long>>() {
      @Override
      public Tuple2<String, Long> map(Click click) {
        return Tuple2.of(click.userId, 1L);
      }
    })
  // 以 userId (field 0) 作为 key
  .keyBy(0)
  // 定义 30 分钟超时的会话窗口
  .window(EventTimeSessionWindows.withGap(Time.minutes(30L)))
  // 对每个会话窗口的点击进行计数，使用 lambda 表达式定义 reduce 函数
  .reduce((a, b) -> Tuple2.of(a.f0, a.f1 + b.f1));
```

## SQL & Table API

Flink 支持两种关系型的 API，[Table API 和 SQL](https://nightlies.apache.org/flink/flink-docs-stable/dev/table/index.html)。这两个 API 都是批处理和流处理统一的 API，这意味着在无边界的实时数据流和有边界的历史记录数据流上，关系型 API 会以相同的语义执行查询，并产生相同的结果。Table API 和 SQL 借助了 [Apache Calcite](https://calcite.apache.org/) 来进行查询的解析，校验以及优化。它们可以与 DataStream 和 DataSet API 无缝集成，并支持用户自定义的标量函数，聚合函数以及表值函数。

Flink 的关系型 API 旨在简化[数据分析](https://flink.apache.org/zh/usecases.html#analytics)、[数据流水线和 ETL 应用](https://flink.apache.org/zh/usecases.html#pipelines)的定义。

下面的代码示例展示了如何使用 SQL 语句查询捕获会话时间范围内所有的点击流事件，并对每一次会话的点击量进行计数。此示例与上述 DataStream API 中的示例有着相同的逻辑。

```sql
SELECT userId, COUNT(*)
FROM clicks
GROUP BY SESSION(clicktime, INTERVAL '30' MINUTE), userId
```

## Flink 库

Flink 具有数个适用于常见数据处理应用场景的扩展库。这些库通常嵌入在 API 中，且并不完全独立于其它 API。它们也因此可以受益于 API 的所有特性，并与其他库集成。

- **[复杂事件处理(CEP)](https://nightlies.apache.org/flink/flink-docs-stable/dev/libs/cep.html)**：模式检测是事件流处理中的一个非常常见的用例。Flink 的 CEP 库提供了 API，使用户能够以例如正则表达式或状态机的方式指定事件模式。CEP 库与 Flink 的 DataStream API 集成，以便在 DataStream 上评估模式。CEP 库的应用包括网络入侵检测，业务流程监控和欺诈检测。
- **[DataSet API](https://nightlies.apache.org/flink/flink-docs-stable/dev/batch/index.html)**：DataSet API 是 Flink 用于批处理应用程序的核心 API。DataSet API 所提供的基础算子包括*map*、_reduce_、_(outer) join_、_co-group_、*iterate*等。所有算子都有相应的算法和数据结构支持，对内存中的序列化数据进行操作。如果数据大小超过预留内存，则过量数据将存储到磁盘。Flink 的 DataSet API 的数据处理算法借鉴了传统数据库算法的实现，例如混合散列连接（hybrid hash-join）和外部归并排序（external merge-sort）。
- **[Gelly](https://nightlies.apache.org/flink/flink-docs-stable/dev/libs/gelly/index.html)**: Gelly 是一个可扩展的图形处理和分析库。Gelly 是在 DataSet API 之上实现的，并与 DataSet API 集成。因此，它能够受益于其可扩展且健壮的操作符。Gelly 提供了[内置算法](https://nightlies.apache.org/flink/flink-docs-stable/dev/libs/gelly/library_methods.html)，如 label propagation、triangle enumeration 和 page rank 算法，也提供了一个简化自定义图算法实现的 [Graph API](https://nightlies.apache.org/flink/flink-docs-stable/dev/libs/gelly/graph_api.html)。

## 参考资料

- [Flink 官方文档](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/)