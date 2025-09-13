---
title: 《深入理解 Sentinel》笔记
date: 2024-05-27 06:58:23
order: 1
categories:
  - 笔记
  - 分布式
  - 分布式调度
tags:
  - 分布式
  - 调度
  - 限流
  - 熔断
  - 降级
  - Sentinel
permalink: /pages/331a65c9/
---

# 《深入理解 Sentinel》笔记

## 开篇词：一次服务雪崩问题排查经历

> **什么是服务雪崩**

**服务雪崩**是指：在微服务项目中指由于突发流量导致某个服务不可用，从而导致上游服务不可用，并产生级联效应，最终导致整个系统不可用。

当一切正常时，整体系统如下所示：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202401280931974.png)

在分布式系统架构下，这些强依赖的子服务稳定与否对系统的影响非常大。但是，依赖的子服务可能有很多不可控问题：如网络连接、资源繁忙、服务宕机等。例如：下图中有一个 QPS 为 50 的依赖服务 I 出现不可用，但是其他依赖服务是可用的。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202401280931939.png)

当流量很大的情况下，某个依赖的阻塞，会导致上游服务请求被阻塞。当这种级联故障愈演愈烈，就可能造成整个线上服务不可用的雪崩效应，如下图。这种情况若持续恶化，如果上游服务本身还被其他服务所依赖，就可能出现多米洛骨牌效应，导致多个服务都无法正常工作。

![img](https://github.com/Netflix/Hystrix/wiki/images/soa-3-640.png)

## 为什么需要服务降级以及常见的几种降级方式

服务降级是为了保障服务能够稳定运行的一种保护方式，应对流量突增用降级牺牲一些流量换取系统的稳定。常见的服务降级实现方式有：开关降级、限流降级、熔断降级。

限流降级与熔断降级都可以实现在消费端限流或者服务端限流，限流可以根据流量控制策略处理超过阈值的流量。

- 限流即便没有达到系统的瓶颈，只要流量达到设定的阈值，就会触发限流；
- 熔断尽最大的可能去完成所有的请求，容忍一些失败，熔断也能自动恢复。熔断的常见降级策略：
  - 在每秒请求异常数超过多少时触发熔断降级
  - 在每秒请求异常错误率超过多少时触发熔断降级
  - 在每秒请求平均耗时超过多少时触发熔断降级

开关降级适用于促销活动这种可以明确预估到并发会突增的场景。

## 为什么选择 Sentinel，Sentinel 与 Hystrix 的对比

|                | Sentinel                                       | Hystrix                       |
| :------------- | :--------------------------------------------- | :---------------------------- |
| 社区活跃度     | Github 13K star                                | 官方停止维护                  |
| 隔离策略       | 信号量隔离                                     | 线程池隔离/信号量隔离         |
| 熔断降级策略   | 基于响应时间或失败比率                         | 基于失败比率                  |
| 实时指标实现   | 滑动窗口                                       | 滑动窗口（基于 RxJava）       |
| 规则配置       | 支持多种数据源                                 | 支持多种数据源                |
| 扩展性         | 多个 SPI 扩展点                                | 插件的形式                    |
| 基于注解的支持 | 支持                                           | 支持                          |
| 限流           | 基于 QPS，支持基于调用关系的限流               | 有限的支持                    |
| 流量整形       | 支持慢启动、匀速器模式                         | 不支持                        |
| 系统负载保护   | 支持                                           | 不支持                        |
| 控制台         | 开箱即用，可配置规则、查看秒级监控、机器发现等 | 不完善                        |
| 常见框架的适配 | Servlet、Spring Cloud、Dubbo、gRPC 等          | Servlet、Spring Cloud Netflix |

## Sentinel 基于滑动窗口的实时指标数据统计

- WindowWrap 用于包装 Bucket，随着 Bucket 一起创建。
- WindowWrap 数组实现滑动窗口，Bucket 只负责统计各项指标数据，WindowWrap 用于记录 Bucket 的时间窗口信息。
- 定位 Bucket 实际上是定位 WindowWrap，拿到 WindowWrap 就能拿到 Bucket。

## Sentinel 的一些概念与核心类介绍

- 资源：资源是 Sentinel 的关键概念。资源，可以是一个方法、一段代码、由应用提供的接口，或者由应用调用其它应用的接口。
- 规则：围绕资源的实时状态设定的规则，包括流量控制规则、熔断降级规则以及系统保护规则、自定义规则。
- 降级：在流量剧增的情况下，为保证系统能够正常运行，根据资源的实时状态、访问流量以及系统负载有策略的拒绝掉一部分流量。

核心类：

`ResourceWrapper` 类用于表示资源。

`Node` 用于持有实时统计的指标数据。它有几个实现类：`DefaultNode`、`ClusterNode`、`EntranceNode`、`StatisticNode`。

- StatisticNode 是实现实时指标数据统计 Node。
- DefaultNode 是实现以资源为维度的指标数据统计的 Node。
- ClusterNode 统计每个资源全局的指标数据，以及统计该资源按调用来源区分的指标数据。
- EntranceNode 继承 DefaultNode，用于维护一颗树，从根节点到每个叶子节点都是不同请求的调用链路，所经过的每个节点都对应着调用链路上被 Sentinel 保护的资源，一个请求调用链路上的节点顺序正是资源被访问的顺序。
- Context 代表调用链路上下文，贯穿一次调用链路中的所有 Entry。Context 维持着入口节点（entranceNode）、本次调用链路的 curNode、调用来源（origin）等信息。Context 名称即为调用链路入口名称。Context 通过 ThreadLocal 传递，只在调用链路的入口处创建。
- Entry 维护了当前资源的 DefaultNode，以及调用来源的 StatisticNode。
- ProcessorSlot 直译就是处理器插槽，是 Sentinel 实现限流降级、熔断降级、系统自适应降级等功能的切入点。Sentinel 提供的 ProcessorSlot 可以分为两类，一类是辅助完成资源指标数据统计的切入点，一类是实现降级功能的切入点。实现降级功能的 ProcessorSlot：
  - AuthoritySlot：实现黑白名单降级
  - SystemSlot：实现系统自适应降级
  - FlowSlot：实现限流降级
  - DegradeSlot：实现熔断降级

## Sentinel 中的责任链模式与 Sentinel 的整体工作流程

Sentinel 的工作流就是使用责任链模式将所有的 ProcessorSlot 按照一定的顺序串成一个单向链表。

实现将 ProcessorSlot 串成一个单向链表的是 ProcessorSlotChain，这个 ProcessorSlotChain 是由 SlotChainBuilder 构造的。

## Java SPI 及 SPI 在 Sentinel 中的应用

SPI 全称是 Service Provider Interface，直译就是服务提供者接口，是一种服务发现机制，是 Java 的一个内置标准，允许不同的开发者去实现某个特定的服务。SPI 的本质是将接口实现类的全限定名配置在文件中，由服务加载器读取配置文件，加载实现类，实现在运行时动态替换接口的实现类。

在 sentinel-core 模块的 resources 资源目录下，有一个 META-INF/services 目录，该目录下有两个以接口全名命名的文件，其中 com.alibaba.csp.sentinel.slotchain.SlotChainBuilder 文件用于配置 SlotChainBuilder 接口的实现类。

## 08 资源指标数据统计的实现全解析（上）

NodeSelectorSlot 负责为资源的首次访问创建 DefaultNode，以及维护 Context.curNode 和调用树。NodeSelectorSlot 被放在 ProcessorSlotChain 链表的第一个位置，这是因为后续的 ProcessorSlot 都需要依赖这个 ProcessorSlot。

## 09 资源指标数据统计的实现全解析（下）

- 一个调用链路上只会创建一个 Context，在调用链路的入口创建（一个调用链路上第一个被 Sentinel 保护的资源）。
- 一个 Context 名称只创建一个 EntranceNode，也是在调用链路的入口创建，调用 Context#enter 方法时创建。
- 与方法调用的入栈出栈一样，一个线程上调用多少次 SphU#entry 方法就会创建多少个 CtEntry，前一个 CtEntry 作为当前 CtEntry 的父节点，当前 CtEntry 作为前一个 CtEntry 的子节点，构成一个双向链表。Context.curEntry 保存的是当前的 CtEntry，在调用当前的 CtEntry#exit 方法时，由当前 CtEntry 将 Context.curEntry 还原为当前 CtEntry 的父节点 CtEntry。
- 一个调用链路上，如果多次调用 SphU#entry 方法传入的资源名称都相同，那么只会创建一个 DefaultNode，如果资源名称不同，会为每个资源名称创建一个 DefaultNode，当前 DefaultNode 会作为调用链路上的前一个 DefaultNode 的子节点。
- 一个资源有且只有一个 ProcessorSlotChain，一个资源有且只有一个 ClusterNode。
- 一个 ClusterNode 负责统计一个资源的全局指标数据。
- StatisticSlot 负责记录请求是否被放行、请求是否被拒绝、请求是否处理异常、处理请求的耗时等指标数据，在 StatisticSlot 调用 DefaultNode 用于记录某项指标数据的方法时，DefaultNode 也会调用 ClusterNode 的相对应方法，完成两份指标数据的收集。
- DefaultNode 统计当前资源的各项指标数据的维度是同一个 Context（名称相同），而 ClusterNode 统计当前资源各项指标数据的维度是全局。

## 10 限流降级与流量效果控制器（上）

## 11 限流降级与流量效果控制器（中）

## 12 限流降级与流量效果控制器（下）

## 13 熔断降级与系统自适应限流

## 14 黑白名单限流与热点参数限流

## 15 自定义 ProcessorSlot 实现开关降级

## 16 Sentinel 动态数据源：规则动态配置

## 17 Sentinel 主流框架适配

## 18 Sentinel 集群限流的实现（上）

## 19 Sentinel 集群限流的实现（下）

## 20 结束语：Sentinel 对应用的性能影响如何？

## 21 番外篇：Sentinel 1.8.0 熔断降级新特性解读

## 资料

https://wujiuye.com/album/52c96863a60441829497e98226e2c337