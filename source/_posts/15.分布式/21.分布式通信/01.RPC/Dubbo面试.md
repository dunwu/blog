---
title: Dubbo 面试
date: 2024-12-12 08:18:57
categories:
  - 分布式
  - 分布式通信
  - RPC
tags:
  - 分布式
  - 通信
  - RPC
  - 微服务
  - Dubbo
  - 面试
permalink: /pages/02820fbd/
---

# Dubbo 面试

## 简介

### 【基础】Dubbo 是什么？为什么使用 Dubbo？

:::details 要点

[Dubbo](https://dubbo.apache.org/zh-cn/) 是一款高性能、轻量级的开源 Java RPC 框架。

Dubbo 提供了三大核心能力：

- **面向接口的远程过程调用（RPC）**：提供高性能的基于代理的远程调用能力，服务以接口为粒度，为开发者屏蔽远程调用底层细节。
- **智能容错和负载均衡**：内置多种负载均衡策略，智能感知下游节点健康状况，显著减少调用延迟，提高系统吞吐量。
- **服务自动注册和发现**：支持多种注册中心服务，服务实例上下线实时感知。

:::

### 【基础】Dubbo3 有什么新特性？

:::details 要点

Dubbo3 的核心新特性：

- [新通信协议 - Triple](https://cn.dubbo.apache.org/zh-cn/overview/reference/protocols/triple/) - Triple 协议是 Dubbo3 设计的基于 HTTP 的 RPC 通信协议规范。它**完全兼容 gRPC 协议**，支持 Request-Response、Streaming 流式等通信模型，**可同时运行在 HTTP/1 和 HTTP/2 之上**。
- [应用级服务发现](https://cn.dubbo.apache.org/zh-cn/blog/2023/01/30/dubbo3-%E5%BA%94%E7%94%A8%E7%BA%A7%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0%E8%AE%BE%E8%AE%A1/)
  - 接口级服务发现，以接口为粒度将信息注册到注册中心。举例来说，如果有 10 个 RPC Provider，部署在 100 台机器实例上，就要注册 `10 * 100` 条数据。
  - 应用级服务发现,，以应用为粒度将信息注册到注册中心。将信息进行了**拆分**：接口元数据信息、接口和应用的映射关系维护在元数据中心；应用信息维护在注册中心。这样的好处是，存储的数据量大大减少，则传输数据的 I/O 开销也随之显著减少。
- [Dubbo Mesh](https://cn.dubbo.apache.org/zh/docs3-v2/java-sdk/concepts-and-architecture/mesh/) - 让 Dubbo 应用能够无缝接入 Istio 等业界主流服务网格产品。

> 扩展：[技术创想66 | Dubbo3.0应用级服务注册原理](https://zhuanlan.zhihu.com/p/581776302)

:::

## 架构

### 【基础】Dubbo 有哪些核心组件？

:::details 要点

![](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javaweb/distributed/rpc/dubbo/dubbo基本架构.png)

节点角色：

| 节点      | 角色说明                               |
| --------- | -------------------------------------- |
| Provider  | 暴露服务的服务提供方                   |
| Consumer  | 调用远程服务的服务消费方               |
| Registry  | 服务注册与发现的注册中心               |
| Monitor   | 统计服务的调用次数和调用时间的监控中心 |
| Container | 服务运行容器                           |

调用关系：

1. 服务容器负责启动，加载，运行服务提供者。
2. 服务提供者在启动时，向注册中心注册自己提供的服务。
3. 服务消费者在启动时，向注册中心订阅自己所需的服务。
4. 注册中心返回服务提供者地址列表给消费者，如果有变更，注册中心将基于长连接推送变更数据给消费者。
5. 服务消费者，从提供者地址列表中，基于软负载均衡算法，选一台提供者进行调用，如果调用失败，再选另一台调用。
6. 服务消费者和提供者，在内存中累计调用次数和调用时间，定时每分钟发送一次统计数据到监控中心。

**重要知识点总结：**

- 注册中心负责服务地址的注册与查找，相当于元数据管理服务，服务提供者和消费者只在启动时与注册中心交互，注册中心不转发请求，压力较小。
- 监控中心负责统计各服务调用次数，调用时间等，统计先在内存汇总后每分钟一次发送到监控中心服务器，并以报表展示。
- 注册中心，服务提供者，服务消费者三者之间均为长连接，监控中心除外.
- 注册中心通过长连接感知服务提供者的存在，服务提供者宕机，注册中心将立即推送事件通知消费者。
- 注册中心和监控中心全部宕机，不影响已运行的提供者和消费者，消费者在本地缓存了提供者列表。
- 注册中心和监控中心都是可选的，服务消费者可以直连服务提供者。
- 服务提供者无状态，任意一台宕掉后，不影响使用。
- 服务提供者全部宕掉后，服务消费者应用将无法使用，并无限次重连等待服务提供者恢复。

:::

### 【高级】Dubbo 框架整体如何设计的？

:::details 要点

Dubbo 的整体设计原则如下：

- 采用 Microkernel + Plugin 模式，Microkernel 只负责组装 Plugin，Dubbo 自身的功能也是通过扩展点实现的，也就是 Dubbo 的所有功能点都可被用户自定义扩展所替换。
- 采用 URL 作为配置信息的统一格式，所有扩展点都通过传递 URL 携带配置信息。

#### 整体设计

![总设计图](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javaweb/distributed/rpc/dubbo/dubbo整体设计.jpg)

- 图中左边淡蓝背景的为服务消费方使用的接口，右边淡绿色背景的为服务提供方使用的接口，位于中轴线上的为双方都用到的接口。
- 图中从下至上分为十层，各层均为单向依赖，右边的黑色箭头代表层之间的依赖关系，每一层都可以剥离上层被复用，其中，Service 和 Config 层为 API，其它各层均为 SPI。
- 图中绿色小块的为扩展接口，蓝色小块为实现类，图中只显示用于关联各层的实现类。
- 图中蓝色虚线为初始化过程，即启动时组装链，红色实线为方法调用过程，即运行时调时链，紫色三角箭头为继承，可以把子类看作父类的同一个节点，线上的文字为调用的方法。

#### 各层说明

- **config 配置层**：对外配置接口，以 `ServiceConfig`、`ReferenceConfig` 为中心，可以直接初始化配置类，也可以通过 Spring 解析配置生成配置类
- **proxy 服务代理层**：服务接口透明代理，生成服务的客户端 Stub 和服务器端 Skeleton，以 `ServiceProxy` 为中心，扩展接口为 `ProxyFactory`。
- **registry 注册中心层**：封装服务地址的注册与发现，以服务 URL 为中心，扩展接口为 `RegistryFactory`、`Registry`、`RegistryService`。
- **cluster 路由层**：封装多个提供者的路由及负载均衡，并桥接注册中心，以 `Invoker` 为中心，扩展接口为 `Cluster`、`Directory`、`Router`、`LoadBalance`。
- **monitor 监控层**：RPC 调用次数和调用时间监控，以 `Statistics` 为中心，扩展接口为 `MonitorFactory`、`Monitor`、`MonitorService`。
- **protocol 远程调用层**：封装 RPC 调用，以 `Invocation`、`Result` 为中心，扩展接口为 `Protocol`、`Invoker`、`Exporter`。
- **exchange 信息交换层**：封装请求响应模式，同步转异步，以 `Request`、`Response` 为中心，扩展接口为 `Exchanger`、`ExchangeChannel`、`ExchangeClient`、`ExchangeServer`。
- **transport 网络传输层**：抽象 mina 和 netty 为统一接口，以 `Message` 为中心，扩展接口为 `Channel`、`Transporter`、`Client`、`Server`、`Codec`。
- **serialize 数据序列化层**：可复用的一些工具，扩展接口为 `Serialization`、`ObjectInput`、`ObjectOutput`、`ThreadPool`。

#### 关系说明

- 在 RPC 中，**`Protocol` 是核心层，也就是只要有 `Protocol` + `Invoker` + `Exporter` 就可以完成非透明的 RPC 调用**，然后在 `Invoker` 的主过程上设置拦截点（Filter）。
- 图中的 `Consumer` 和 `Provider` 是抽象概念，只是想让看图者更直观的了解哪些类分属于客户端与服务器端，不用 Client 和 Server 的原因是 Dubbo 在很多场景下都使用 `Provider`、`Consumer`、Registry、`Monitor` 划分逻辑拓普节点，保持统一概念。
- 而 Cluster 是外围概念，所以 **Cluster 的目的是将多个 Invoker 伪装成一个 Invoker**，这样其它人只要关注 Protocol 层 Invoker 即可，加上 Cluster 或者去掉 Cluster 对其它层都不会造成影响，因为只有一个提供者时，是不需要 Cluster 的。
- **Proxy 层封装了所有接口的透明化代理**。在其它层都以 `Invoker` 为中心，只有到了暴露给用户使用时，才用 `Proxy` 将 `Invoker` 转成接口，或将接口实现转成 `Invoker`，也就是去掉 Proxy 层 RPC 是可以 Run 的，只是不那么透明，不那么看起来像调本地服务一样调远程服务。
- 而 Remoting 实现是 Dubbo 协议的实现，如果你选择 RMI 协议，整个 Remoting 都不会用上，Remoting 内部再划为 Transport 传输层和 Exchange 信息交换层，**Transport 层只负责单向消息传输**，是对 Mina, Netty, Grizzly 的抽象，它也可以扩展 UDP 传输，而 **Exchange 层是在传输层之上封装了 Request-Response 语义**。
- Registry 和 Monitor 实际上不算一层，而是一个独立的节点，只是为了全局概览，用层的方式画在一起。

#### 依赖关系

![依赖关系](https://cn.dubbo.apache.org/imgs/dev/dubbo-relation.jpg)

- 图中小方块 Protocol, Cluster, Proxy, Service, Container, Registry, Monitor 代表层或模块，蓝色的表示与业务有交互，绿色的表示只对 Dubbo 内部交互。
- 图中背景方块 Consumer, Provider, Registry, Monitor 代表部署逻辑拓扑节点。
- 图中蓝色虚线为初始化时调用，红色虚线为运行时异步调用，红色实线为运行时同步调用。
- 图中只包含 RPC 的层，不包含 Remoting 的层，Remoting 整体都隐含在 Protocol 中。

#### 调用链

展开总设计图的红色调用链，如下：

![总设计图的红色调用链](https://cn.dubbo.apache.org/imgs/dev/dubbo-extension.jpg)

> 扩展阅读：[Dubbo 框架设计](https://cn.dubbo.apache.org/zh-cn/docsv2.7/dev/design/)

:::

### 【高级】Dubbo 架构是如何实现高度可扩展的？

:::details 要点

#### 微内核+插件架构

Dubbo 的架构设计采用**微内核+插件**架构，高度支持可扩展。

基于扩展点，用户完全可以基于自身需求，替换 Dubbo 原生实现，来满足自身业务需求。

![Admin 效果图](https://cn.dubbo.apache.org/imgs/v3/advantages/extensibility.png)

- **协议与编码扩展**。通信协议、序列化编码协议等
- **流量管控扩展**。集群容错策略、路由规则、负载均衡、限流降级、熔断策略等
- **服务治理扩展**。注册中心、配置中心、元数据中心、分布式事务、全链路追踪、监控系统等
- **诊断与调优扩展**。流量统计、线程池策略、日志、QoS 运维命令、健康检查、配置加载等

#### 基于扩展的生态

Dubbo 调用链路中几乎所有核心节点都被定义为扩展点。

![extensibility-echosystem.png](https://cn.dubbo.apache.org/imgs/v3/feature/extensibility/arc.png)

以上是按架构层次划分的 Dubbo 内的一些核心扩展点定义及实现，可以从三个层次来展开：

1. 协议通信层
2. 流量管控层
3. 服务治理层

##### 协议通信层

- **Protocol** - Protocol 定义了 RPC 协议，利用这个扩展点可以实现灵活切换通信协议。Dubbo 官方提供了 Triple、gRPC、Dubbo2、REST 等 RPC 协议。
- **Serialization** - Serialization 定义了序列化协议，利用这个扩展点可以实现灵活切换序列化协议。Dubbo 官方提供了 Fastjson、Protobuf、Hessian2、Kryo、FST 等序列化协议。

![协议与编码原理图](https://cn.dubbo.apache.org/imgs/v3/feature/extensibility/protocol.png)

##### 流量管控层

Dubbo 在服务调用链路上预置了大量扩展点，通过这些扩展点用户可以控制运行态的流量走向、改变运行时调用行为等，包括 Dubbo 内置的一些负载均衡策略、流量路由策略、超时等很多流量管控能力都是通过这类扩展点实现的。

![协议与编码原理图](https://cn.dubbo.apache.org/imgs/v3/feature/extensibility/traffic.png)

- **Filter** - Filter 流量拦截器是 Dubbo 服务调用之上的 AOP 设计模式，Filter 用来对每次服务调用做一些预处理、后处理动作，使用 Filter 可以完成访问日志、加解密、流量统计、参数验证等任务，Dubbo 中的很多生态适配如限流降级 Sentinel、全链路追踪 Tracing 等都是通过 Fitler 扩展实现的。Filter 以链式串联工作，彼此独立。
  - 从消费端视角，它在请求发起前基于请求参数等做一些预处理工作，在接收到响应后，对响应结果做一些后置处理；
  - 从提供者视角则，在接收到访问请求后，在返回响应结果前做一些预处理，
- **Router** - Router 将符合一定条件的流量转发到特定分组的地址子集，是 Dubbo 中一些关键能力如按比例流量转发、流量隔离等的基础。每次服务调用请求都会流经一组路由器 (路由链)，每个路由器根据预先设定好的规则、全量地址列表以及当前请求上下文计算出一个地址子集，再传给下一个路由器，重复这一过程直到最后得出一个有效的地址子集。
- **Load Balance** - 在 Dubbo 中，Load Balance 负载均衡工作在 Router 之后，对于每次服务调用，负载均衡负责在 Router 链输出的地址子集中选择一台机器实例进行访问，保证一段时间内的调用都均匀的分布在地址子集的所有机器上。Dubbo 官方提供了加权随机、加权轮询、一致性哈希、最小活跃度优先、最短响应时间优先等负载均衡策略，还提供了根据集群负载自适应调度的负载均衡算法。

##### 服务治理层

Dubbo3 由注册中心 (服务发现)、配置中心和元数据中心构成了整个服务治理的核心。

![服务治理架构图](https://cn.dubbo.apache.org/imgs/v3/concepts/threecenters.png)

Dubbo 很多服务治理的核心能力都是通过上图描述的几个关键组件实现的。用户通过控制面或者 Admin 下发的各种规则与配置、各类微服务集群状态的展示等都是直接与注册中心、配置中心和元数据中心交互。在具体实现或者部署上，注册中心、配置中心和元数据中心可以是同一组件，比如 Zookeeper 可同时作为注册、配置和元数据中心，Nacos 也是如此。因此，三个中心只是从架构职责上的划分，你甚至可以用同一个 Zookeeper 集群来承担所有三个职责，只需要在应用里将他们设置为同一个集群地址就可以了。

- **Registry** - **注册中心是 Dubbo 实现服务发现能力的基础**。Dubbo 官方支持 Zookeeper、Nacos、Etcd、Consul、Eureka 等注册中心。通过对 Consul、Eureka 的支持，Dubbo 也实现了与 Spring Cloud 体系在地址和通信层面的互通，让用户同时部署 Dubbo 与 Spring Cloud，或者从 Spring Cloud 迁移到 Dubbo 变得更容易。
- **Config Center** - **配置中心是用户实现动态控制 Dubbo 行为的关键组件**。Dubbo 所有的路由规则，都是先下发到配置中心保存起来，进而 Dubbo 实例通过监听配置中心的变化，收到路由规则并达到控制流量的行为。Dubbo 官方支持 Zookeeper、Nacos、Etcd、Redis、Apollo 等配置中心实现。
- **Metadata Center** - 与配置中心相反，从用户视角来看元数据中心是只读的，元数据中心唯一的写入方是 Dubbo 进程实例，Dubbo 实例会在启动之后将一些内部状态（如服务列表、服务配置、服务定义格式等）上报到元数据中心，供一些治理能力作为数据来源，如服务测试、文档管理、服务状态展示等。Dubbo 官方支持 Zookeeper、Nacos、Etcd、Redis 等元数据中心实现。

> 扩展阅读：[Dubbo 官方文档之扩展适配](https://cn.dubbo.apache.org/zh-cn/overview/what/core-features/extensibility/)

:::

### 【高级】Dubbo 的 SPI 机制是如何设计的？

:::details 要点

#### Java SPI

**SPI** 全称 Service Provider Interface，**旨在由第三方实现或扩展的 API，它是一种用于动态加载服务的机制**。SPI 的本质是**将接口实现类的全限定名配置在文件中，并由服务加载器读取配置文件，加载实现类**。这样可以在运行时，动态为接口替换实现类。

Java 中 SPI 机制主要思想是将装配的控制权移到程序之外，在模块化设计中这个机制尤其重要，其核心思想就是 **解耦**。

Java SPI 有四个要素：

- **SPI 接口**：为服务提供者实现类约定的的接口或抽象类。
- **SPI 实现类**：实际提供服务的实现类。
- **SPI 配置**：Java SPI 机制约定的配置文件，提供查找服务实现类的逻辑。配置文件必须置于 `META-INF/services` 目录中，并且，文件名应与服务提供者接口的完全限定名保持一致。文件中的每一行都有一个实现服务类的详细信息，同样是服务提供者类的完全限定名称。
- **`ServiceLoader`**：Java SPI 的核心类，用于加载 SPI 实现类。 `ServiceLoader` 中有各种实用方法来获取特定实现、迭代它们或重新加载服务。

Java SPI 存在一些不足：

- **不能按需加载**，需要遍历所有的实现并实例化，然后在循环中才能找到我们需要的实现。如果不想用某些实现类，或者某些类实例化很耗时，它也被载入并实例化了，这就造成了浪费。
- 获取某个实现类的方式不够灵活，**只能通过 `Iterator` 形式获取**，不能根据某个参数来获取对应的实现类。
- 并发多线程使用 `ServiceLoader` 类的实例是**不安全**的。

#### Dubbo SPI

正是有 Java SPI 存在以上不足点，Dubbo 并未使用 Java 原生的 SPI 机制，而是对其进行了增强，使其能够更好的满足需求。在 Dubbo 中，SPI 是一个非常重要的模块。基于 SPI，我们可以很容易的对 Dubbo 进行拓展。

Dubbo SPI 所需的配置文件需放置在 `META-INF/dubbo` 路径下。配置内容形式如下：

```
optimusPrime = org.apache.spi.OptimusPrime
bumblebee = org.apache.spi.Bumblebee
```

与 Java SPI 实现类配置不同，Dubbo SPI 是**通过键值对的方式进行配置**，这样可以**按需加载**指定的实现类。Dubbo SPI 除了支持按需加载接口实现类，还增加了 IOC 和 AOP 等特性。

Dubbo SPI 的相关逻辑被封装在了 `ExtensionLoader` 类中，通过 `ExtensionLoader`，可以加载指定的实现类。`ExtensionLoader` 的 `getExtension` 方法是其入口方法。

> 扩展阅读：
>
> - [Dubbo SPI 概述](https://cn.dubbo.apache.org/zh-cn/overview/mannual/java-sdk/reference-manual/spi/overview/)
> - [源码级深度理解 Java SPI](https://dunwu.github.io/waterdrop/pages/2131c240/)

:::

### 【高级】Dubbo 中的时钟轮机制是如何设计的？

:::details 要点

#### JDK 中定时任务的实现

在很多开源框架中，都需要定时任务的管理功能，例如 ZooKeeper、Netty、Quartz、Kafka 以及 Linux 操作系统。

定时器的本质是设计一种数据结构，能够存储和调度任务集合，而且 deadline 越近的任务拥有更高的优先级。那么定时器如何知道一个任务是否到期了呢？定时器需要通过轮询的方式来实现，每隔一个时间片去检查任务是否到期。

所以定时器的内部结构一般需要一个任务队列和一个异步轮询线程，并且能够提供三种基本操作：

- Schedule 新增任务至任务集合；
- Cancel 取消某个任务；
- Run 执行到期的任务。

JDK 原生提供了三种常用的定时器实现方式，分别为 `Timer`、`DelayedQueue` 和 `ScheduledThreadPoolExecutor`。

JDK 内置的三种实现定时器的方式，实现思路都非常相似，都离不开**任务**、**任务管理**、**任务调度**三个角色。三种定时器新增和取消任务的时间复杂度都是 `O(logn)`，面对海量任务插入和删除的场景，这三种定时器都会遇到比较严重的性能瓶颈。

**对于性能要求较高的场景，一般都会采用时间轮算法来实现定时器**。时间轮（Timing Wheel）是 George Varghese 和 Tony Lauck 在 1996 年的论文 [Hashed and Hierarchical Timing Wheels: data structures to efficiently implement a timer facility](https://www.cse.wustl.edu/~cdgill/courses/cs6874/TimingWheels.ppt) 实现的，它在 Linux 内核中使用广泛，是 Linux 内核定时器的实现方法和基础之一。

#### 时间轮的基本原理

**时间轮是一种高效的、批量管理定时任务的调度模型**。时间轮可以理解为一种环形结构，像钟表一样被分为多个 slot 槽位。每个 slot 代表一个时间段，每个 slot 中可以存放多个任务，使用的是链表结构保存该时间段到期的所有任务。时间轮通过一个时针随着时间一个个 slot 转动，并执行 slot 中的所有到期任务。

![图片 22.png](https://learn.lianglianglee.com/%E4%B8%93%E6%A0%8F/Netty%20%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E5%89%96%E6%9E%90%E4%B8%8E%20RPC%20%E5%AE%9E%E8%B7%B5-%E5%AE%8C/assets/CgpVE1_okKiAGl0gAAMLshtTq-M933.png)

任务是如何添加到时间轮当中的呢？可以根据任务的到期时间进行取模，然后将任务分布到不同的 slot 中。如上图所示，时间轮被划分为 8 个 slot，每个 slot 代表 1s，当前时针指向 2。假如现在需要调度一个 3s 后执行的任务，应该加入 `2+3=5` 的 slot 中；如果需要调度一个 12s 以后的任务，需要等待时针完整走完一圈 round 零 4 个 slot，需要放入第 `(2+12)%8=6` 个 slot。

那么当时针走到第 6 个 slot 时，怎么区分每个任务是否需要立即执行，还是需要等待下一圈，甚至更久时间之后执行呢？所以我们需要把 round 信息保存在任务中。例如图中第 6 个 slot 的链表中包含 3 个任务，第一个任务 round=0，需要立即执行；第二个任务 round=1，需要等待 `1*8=8s` 后执行；第三个任务 round=2，需要等待 `2*8=8s` 后执行。所以当时针转动到对应 slot 时，只执行 round=0 的任务，slot 中其余任务的 round 应当减 1，等待下一个 round 之后执行。

上面介绍了时间轮算法的基本理论，可以看出时间轮有点类似 HashMap，如果多个任务如果对应同一个 slot，处理冲突的方法采用的是拉链法。在任务数量比较多的场景下，适当增加时间轮的 slot 数量，可以减少时针转动时遍历的任务个数。

时间轮定时器最大的优势就是，任务的新增和取消都是 `O(1)` 时间复杂度，而且只需要一个线程就可以驱动时间轮进行工作。

#### Dubbo 中的时间轮

`org.apache.dubbo.common.timer.HashedWheelTimer` 是 Dubbo 中时间轮的算法实现。它主要应用于以下方面：

- **失败重试，** 例如，Provider 向注册中心进行注册失败时的重试操作，或是 Consumer 向注册中心订阅时的失败重试等。
- **周期性定时任务，** 例如，定期发送心跳请求，请求超时的处理，或是网络连接断开后的重连机制。

:::

### 【高级】Dubbo 中的线程模型是如何设计的？

:::details 要点

#### Consumer 线程模型

对 2.7.5 版本之前的 Dubbo 应用，尤其是一些消费端应用，当面临需要消费大量服务且并发数比较大的大流量场景时（典型如网关类场景），经常会出现消费端线程数分配过多的问题，具体问题讨论可参见 [Need a limited Threadpool in consumer side #2013](https://github.com/apache/dubbo/issues/2013)

改进后的消费端线程池模型，通过复用业务端被阻塞的线程，很好的解决了这个问题。

**老的线程池模型**

![消费端线程池.png](https://cn.dubbo.apache.org/imgs/user/consumer-threadpool0.png)

我们重点关注 Consumer 部分：

1. 业务线程发出请求，拿到一个 `Future` 实例。
2. 业务线程紧接着调用 `future.get` 阻塞等待业务结果返回。
3. 当业务数据返回后，交由独立的 `Consumer` 端线程池进行反序列化等处理，并调用 `future.set` 将反序列化后的业务结果置回。
4. 业务线程拿到结果直接返回

**当前线程池模型**

![消费端线程池新.png](https://cn.dubbo.apache.org/imgs/user/consumer-threadpool1.png)

1. 业务线程发出请求，拿到一个 `Future` 实例。
2. 在调用 `future.get()` 之前，先调用 `ThreadlessExecutor.wait()`，`wait` 会使业务线程在一个阻塞队列上等待，直到队列中被加入元素。
3. 当业务数据返回后，生成一个 `Runnable Task` 并放入 `ThreadlessExecutor` 队列
4. 业务线程将 `Task` 取出并在本线程中执行：反序列化业务数据并 `set` 到 `Future`。
5. 业务线程拿到结果直接返回

这样，相比于老的线程池模型，由业务线程自己负责监测并解析返回结果，免去了额外的消费端线程池开销。

#### Provider 线程模型

Dubbo 协议的和 Triple 协议目前的线程模型还并没有对齐。

Dubbo 对 channel 上的操作抽象成了五种行为：

- **建立连接（connected）** - 主要是的职责是在 channel 记录 read、write 的时间，以及处理建立连接后的回调逻辑，比如 dubbo 支持在断开后自定义回调的 hook（onconnect），即在该操作中执行。
- **断开连接（disconnected）** - 主要是的职责是在 channel 移除 read、write 的时间，以及处理端开连接后的回调逻辑，比如 dubbo 支持在断开后自定义回调的 hook（ondisconnect），即在该操作中执行。
- **发送消息（sent）** - 包括发送请求和发送响应。记录 write 的时间。
- **接收消息（received）** - 包括接收请求和接收响应。记录 read 的时间。
- **异常捕获（caught）** - 用于处理在 channel 上发生的各类异常。

Dubbo 框架的线程模型与以上这五种行为息息相关，Dubbo 协议 Provider 线程模型可以分为五类，也就是 AllDispatcher、DirectDispatcher、MessageOnlyDispatcher、ExecutionDispatcher、ConnectionOrderedDispatcher。

##### All Dispatcher

所有消息都派发到 Dubbo 线程池。

![dubbo-provider-alldispatcher](https://cn.dubbo.apache.org/imgs/v3/feature/performance/threading-model/dubbo-provider-alldispatcher.png)

在 IO 线程中执行的操作有：

1. `sent` 操作在 IO 线程上执行。
2. 序列化响应在 IO 线程上执行。

在 Dubbo 线程中执行的操作有：

1. `received`、`connected`、`disconnected`、`caught` 都是在 Dubbo 线程上执行的。
2. 反序列化请求的行为在 Dubbo 中做的。

##### Direct Dispatcher

所有消息都不派发到 Dubbo 线程池，全部在 IO 线程上直接执行。

![dubbo-provider-directDispatcher](https://cn.dubbo.apache.org/imgs/v3/feature/performance/threading-model/dubbo-provider-directDispatcher.png)

在 IO 线程中执行的操作有：

1. `received`、`connected`、`disconnected`、`caught`、`sent` 操作在 IO 线程上执行。
2. 反序列化请求和序列化响应在 IO 线程上执行。

并没有在 Dubbo 线程操作的行为。

##### Execution Dispatcher

只有请求消息派发到 Dubbo 线程池，不含响应，响应和其它连接断开事件，心跳等消息，直接在 IO 线程上执行。

![dubbo-provider-ExecutionDispatcher](https://cn.dubbo.apache.org/imgs/v3/feature/performance/threading-model/dubbo-provider-executionDispatcher.png)

在 IO 线程中执行的操作有：

1. `sent`、`connected`、`disconnected`、`caught` 操作在 IO 线程上执行。
2. 序列化响应在 IO 线程上执行。

在 Dubbo 线程中执行的操作有：

1. `received` 都是在 Dubbo 线程上执行的。
2. 反序列化请求的行为在 Dubbo 中做的。

##### Message Only Dispatcher

在 Provider 端，Message Only Dispatcher 和 Execution Dispatcher 的线程模型是一致的，所以下图和 Execution Dispatcher 的图一致，区别在 Consumer 端。见下方 Consumer 端的线程模型。

![dubbo-provider-ExecutionDispatcher](https://cn.dubbo.apache.org/imgs/v3/feature/performance/threading-model/dubbo-provider-executionDispatcher.png)

在 IO 线程中执行的操作有：

1. `sent`、`connected`、`disconnected`、`caught` 操作在 IO 线程上执行。
2. 序列化响应在 IO 线程上执行。

在 Dubbo 线程中执行的操作有：

1. `received` 都是在 Dubbo 线程上执行的。
2. 反序列化请求的行为在 Dubbo 中做的。

##### Connection Ordered Dispatcher

![dubbbo-provider-connectionOrderedDispatcher](https://cn.dubbo.apache.org/imgs/v3/feature/performance/threading-model/dubbbo-provider-connectionOrderedDispatcher.png)

在 IO 线程中执行的操作有：

1. `sent` 操作在 IO 线程上执行。
2. 序列化响应在 IO 线程上执行。

在 Dubbo 线程中执行的操作有：

1. `received`、`connected`、`disconnected`、`caught` 都是在 Dubbo 线程上执行的。但是 `connected` 和 `disconnected` 两个行为是与其他两个行为通过线程池隔离开的。并且在 Dubbo connected thread pool 中提供了链接限制、告警灯能力。
2. 反序列化请求的行为在 Dubbo 中做的。

:::

### 【中级】Dubbo 中用到哪些设计模式？

:::details 要点

**单例模式**

Dubbo 中大量使用单例模式来确保一些特定类在整个应用中只有一个实例。举例来说，`ExtensionLoader` 是 Dubbo SPI 加载器，负责管理 Dubbo 中的扩展点。`ExtensionLoader` 使用了单例模式来确保 `ExtensionLoader` 在整个应用中只有一个实例。

```java
public class ExtensionLoader<T> {
    private static final ConcurrentMap<Class<?>, ExtensionLoader<?>> EXTENSION_LOADERS = new ConcurrentHashMap<>();

    public static <T> ExtensionLoader<T> getExtensionLoader(Class<T> type) {
        ExtensionLoader<T> loader = (ExtensionLoader<T>) EXTENSION_LOADERS.get(type);
        if (loader == null) {
            EXTENSION_LOADERS.putIfAbsent(type, new ExtensionLoader<T>(type));
            loader = (ExtensionLoader<T>) EXTENSION_LOADERS.get(type);
        }
        return loader;
    }
}
```

**责任链模式**

Dubbo 的调用链是基于责任链模式组织起来的。责任链中的每个节点实现 `Filter` 接口，然后由 `ProtocolFilterWrapper` 将所有 `Filter` 串连起来。Dubbo 的许多功能都是通过 `Filter` 扩展实现的，比如监控、日志、缓存、安全等。

**装饰器模式**

Dubbo 中大量用到了修饰器模式。比如 `ProtocolFilterWrapper` 类是对 `Protocol` 类的修饰。在 `export` 和 `refer` 方法中，配合责任链模式，把 `Filter` 组装成责任链，实现对 `Protocol` 功能的修饰。其他还有 `ProtocolListenerWrapper`、 `ListenerInvokerWrapper`、`InvokerWrapper` 等。

**策略模式**

Dubbo 中的负载均衡器采用了策略模式，以便灵活的替换算法。在 Dubbo 中，`LoadBalance` 接口定义了负载均衡的策略接口，它有以下具体实现：`AdaptiveLoadBalance`、`ConsistentHashLoadBalance`、`LeastActiveLoadBalance`、`RandomLoadBalance`、`RoundRobinLoadBalance`、`ServerCpuLoadBalance2`、`ShortestResponseLoadBalance`。

```java
public interface LoadBalance {
    <T> Invoker<T> select(List<Invoker<T>> invokers, URL url, Invocation invocation) throws RpcException;
}
```

**抽象工厂模式**

Dubbo 中的 `ProxyFactory` 采用了**抽象工厂模式**。`AbstractProxyFactory` 实现了 `ProxyFactory` 接口，并且有 `JdkProxyFactory` 和 `JavassistProxyFactory` 两个子类，可以分别生产不同序列化方式的 `Proxy` 和 `Invoke`。

**代理模式**

Dubbo 使用代理模式隐藏远程调用的细节。`ProxyFactory` 接口及其实现类负责为服务创建代理对象，使得调用者无需关心实际的服务调用过程。

**适配器模式**

Dubbo 中 `RegistryProtocol` 类负责将不同的注册中心协议适配到统一的接口 `Protocol` 中，以便在不同的注册中心下工作。`RegistryProtocol` 通过适配不同的注册中心实现，使得 Dubbo 能够在多种注册中心协议下工作，而不必修改客户端代码。

> 扩展：[长文详解：DUBBO源码使用了哪些设计模式](https://juejin.cn/post/7126675470107541534#heading-24)

:::

## 服务注册和发现

### 【基础】服务注册和发现的流程是怎样的？

:::details 要点

服务提供者注册服务的过程：

Dubbo 配置项 `dubbo://registry` 声明了注册中心的地址，Dubbo 会把以上配置项解析成类似下面的 URL 格式：

```
registry://multicast://224.5.6.7:1234/com.alibaba.dubbo.registry.RegistryService?export=URL.encode("dubbo://host-ip:20880/com.alibaba.dubbo.demo.DemoService")
```

然后基于扩展点自适应机制，通过 URL 的 `registry://` 协议头识别，就会调用 `RegistryProtocol` 的 `export` 方法，将 `export` 参数中的提供者 URL，注册到注册中心。

服务消费者发现服务的过程：

Dubbo 配置项 `dubbo://registry` 声明了注册中心的地址，跟服务注册的原理类似，Dubbo 也会把以上配置项解析成下面的 URL 格式：

```
registry://multicast://224.5.6.7:1234/com.alibaba.dubbo.registry.RegistryService?refer=URL.encode("consummer://host-ip/com.alibaba.dubbo.demo.DemoService")
```

然后基于扩展点自适应机制，通过 URL 的 `registry://` 协议头识别，就会调用 `RegistryProtocol` 的 `refer` 方法，基于 `refer` 参数中的条件，查询服务 `demoService` 的地址。

:::

### 【基础】Dubbo 支持哪些注册中心？

:::details 要点

不同于传统的 Dubbo2，Dubbo3 中定义了三种中心：注册中心、配置中心、元数据中心。配置中心、元数据中心是实现 Dubbo 高阶服务治理能力会依赖的组件，如流量管控规则等，相比于注册中心通常这两个组件的配置是可选的。

配置方式如下：

```yaml
dubbo
 registry
  address: nacos://localhost:8848
 config-center
  address: nacos://localhost:8848
 metadata-report
  address: nacos://localhost:8848
```

需要注意的是，**对于部分注册中心类型（如 Zookeeper、Nacos 等），Dubbo 会默认同时将其用作元数据中心和配置中心（建议保持默认开启状态）。**

Dubbo 目前支持的主流注册中心实现包括：

- Zookeeper
- Nacos
- Redis
- Consul
- Etcd
- 更多实现

同时也支持 Kubernetes、Mesh 体系的服务发现，具体请参考 [使用教程 - kubernetes部署](http://localhost:1313/zh-cn/overview/mannual/java-sdk/tasks/deploy/)

:::

### 【中级】注册中心是选择 CP 还是 AP？

:::details 要点

#### 什么是 CAP

在分布式系统领域，有一个著名的 [CAP 理论](https://en.wikipedia.org/wiki/CAP_theorem)。CAP 定理提出：分布式系统有三个指标，这三个指标不能同时做到：

- **一致性（Consistency）** - 在任何给定时间，网络中的所有节点都具有完全相同（最近）的值。
- **可用性（Availability）** - 对网络的每个请求都会返回响应，但不能保证返回的数据是最新的。
- **分区容错性（Partition Tolerance）** - 即使任意数量的节点出现故障，网络仍会继续运行。

CAP 就是取 Consistency、Availability、Partition Tolerance 的首字母而命名。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202405160639643.png)

在分布式系统中，分区容错性是一个既定的事实：因为分布式系统总会出现各种各样的问题，如由于网络原因而导致节点失联；发生机器故障；机器重启或升级等等。因此，**CAP 定理实际上是要在可用性（A）和一致性（C）之间做权衡**。

#### 注册中心选 AP 还是 CP

注册中心作为服务提供者和服务消费者之间沟通的桥梁，它的重要性不言而喻。所以注册中心一般都是采用集群部署来保证高可用性，并通过分布式一致性协议来确保集群中不同节点之间的数据保持一致。

根据 [CAP 理论](https://en.wikipedia.org/wiki/CAP_theorem)，三种特性无法同时达成，必须在可用性和一致性之间做取舍。于是，根据不同侧重点，注册中心可以分为 CP 和 AP 两个阵营：

- **CP 型注册中心** - **牺牲可用性来换取数据强一致性**，最典型的例子就是 ZooKeeper，etcd，Consul 了。ZooKeeper 集群内只有一个 Leader，而且在 Leader 无法使用的时候通过算法选举出一个新的 Leader。这个 Leader 的目的就是保证写信息的时候只向这个 Leader 写入，Leader 会同步信息到 Followers，这个过程就可以保证数据的强一致性。但如果多个 ZooKeeper 之间网络出现问题，造成出现多个 Leader，发生脑裂的话，注册中心就不可用了。而 etcd 和 Consul 集群内都是通过 Raft 协议来保证强一致性，如果出现脑裂的话， 注册中心也不可用。
- **AP 型注册中心** - **牺牲一致性（只保证最终一致性）来换取可用性**，最典型的例子就是 Eureka 了。Eureka 在设计的时候就是优先保证 A （可用性）。在 Eureka 中不存在什么 Leader 节点，每个节点都是一样的、平等的。因此 Eureka 不会像 ZooKeeper 那样出现选举过程中或者半数以上的机器不可用的时候服务就是不可用的情况。 Eureka 保证即使大部分节点挂掉也不会影响正常提供服务，只要有一个节点是可用的就行了。只不过这个节点上的数据可能并不是最新的。
- **CP & AP 都支持型注册中心** - Nacos的内在设计偏向于 CP，即在发生网络分区的情况下优先保证数据的一致性和分区容错性，牺牲一定的可用性。虽然 Nacos 的内在设计偏向于CP，但通过合理的配置与实践，可以在一定程度上优化其可用性。例如：调整副本数、配置同步策略。更多详情可以参考：[Nacos CAP](https://nacos.io/en/blog/faq/nacos-user-question-history10508/?spm=5238cd80.e9131ff.0.0.69845e2958zjvo&source=wuyi)

选择 CP 还是 AP，根据实际需要来定：如果业务场景要求强一致，优先选择 CP 型注册中心；如果业务场景强调可用性，优先选择 AP 型注册中心。

:::

### 【基础】注册中心挂了可以继续通信吗？

可以。Dubbo 消费者在应用启动时会从注册中心拉取已注册的生产者的地址接口，并缓存在本地。每次调用时，按照本地存储的地址进行调用。

## 通信协议和序列化

### 【基础】Dubbo 支持哪些通信协议，各有什么利弊？

:::details 要点

Dubbo 框架提供了自定义的高性能 RPC 通信协议：基于 HTTP/2 的 Triple 协议 和 基于 TCP 的 Dubbo2 协议。除此之外，Dubbo 框架支持任意第三方通信协议，如官方支持的 gRPC、Thrift、REST、JsonRPC、Hessian2 等，更多协议可以通过自定义扩展实现。这对于微服务实践中经常要处理的多协议通信场景非常有用。

**Dubbo 框架不绑定任何通信协议，在实现上 Dubbo 对多协议的支持也非常灵活，它可以让你在一个应用内发布多个使用不同协议的服务，并且支持用同一个 port 端口对外发布所有协议。**

![protocols](https://cn.dubbo.apache.org/imgs/v3/feature/protocols/protocol1.png)

Dubbo 官方支持的协议如下：

- **HTTP/2 (Triple)** - Dubbo3 新增，基于 HTTP/2 并且完全兼容 gRPC 协议，原生支持 Streaming 通信语义，Triple 可同时运行在 HTTP/1 和 HTTP/2 传输协议之上，让你可以直接使用 curl、浏览器访问后端 Dubbo 服务。自 Triple 协议开始，Dubbo 还支持基于 Protocol Buffers 的服务定义与数据传输，但 Triple 实现并不绑定 IDL。Triple 具备更好的网关、代理穿透性，因此非常适合于跨网关、代理通信的部署架构，如服务网格等。更多详情见：Triple 协议详情见 [Triple 协议开发任务](https://cn.dubbo.apache.org/zh-cn/overview/what/tasks/protocols/triple/)、[Triple 设计思路与协议规范](https://cn.dubbo.apache.org/zh-cn/overview/reference/protocols/triple/)。
- **Dubbo2** - Dubbo2 协议是基于 TCP 传输层协议之上构建的一套 RPC 通信协议，具有紧凑、灵活、高性能等特点。它是 Dubbo 的默认通信协议，采用单一长连接和 NIO 异步通信，基于 hessian 作为序列化协议。Dubbo2 协议适合于小数据量大并发的服务调用，以及服务消费者机器数远大于服务提供者机器数的情况。反之，Dubbo 缺省协议不适合传送大数据量的服务，比如传文件，传视频等，除非请求量很低。Dubbo 协议详情见 [Dubbo2 协议开发任务](https://cn.dubbo.apache.org/zh-cn/overview/what/tasks/protocols/dubbo/)、[Dubbo2 设计思路与协议规范](https://cn.dubbo.apache.org/zh-cn/overview/reference/protocols/tcp/)。
- **gRPC** - gRPC 是谷歌开源的基于 HTTP/2 的通信协议。gRPC 的定位是通信协议与实现，是一款纯粹的 RPC 框架，而 Dubbo 定位是一款微服务框架，为微服务实践提供解决方案。在 Dubbo 体系下使用 gRPC 协议是一个非常高效和轻量的选择，它让你既能使用原生的 gRPC 协议通信，又避免了基于 gRPC 进行二次定制与开发的复杂度。gRPC 协议详情见 [gRPC over Dubbo 示例](https://cn.dubbo.apache.org/zh-cn/overview/what/tasks/protocols/grpc/)。
- **REST** - 微服务领域常用的一种通信模式是 HTTP + JSON，包括 Spring Cloud、Microprofile 等一些主流的微服务框架都默认使用的这种通信模式，Dubbo 同样提供了对基于 HTTP 的编程、通信模式的支持。REST 协议详情见 [HTTP over Dubbo 示例](https://cn.dubbo.apache.org/zh-cn/overview/what/tasks/protocols/web/)、[Dubbo 与 Spring Cloud 体系互通](https://cn.dubbo.apache.org/zh-cn/overview/what/tasks/protocols/springcloud/)。
- **Hessian** - [hessian](http://dubbo.apache.org/zh-cn/docs/user/references/protocol/hessian.html) 协议用于集成 Hessian 的服务，Hessian 底层采用 Http 通讯，采用 Servlet 暴露服务，Dubbo 缺省内嵌 Jetty 作为服务器实现。Dubbo 的 Hessian 协议可以和原生 Hessian 服务互操作，即：
  - 提供者用 Dubbo 的 Hessian 协议暴露服务，消费者直接用标准 Hessian 接口调用
  - 或者提供方用标准 Hessian 暴露服务，消费方用 Dubbo 的 Hessian 协议调用。
- **Thrift** - dubbo 支持的 [thrift](http://dubbo.apache.org/zh-cn/docs/user/references/protocol/thrift.html) 协议是对 thrift 原生协议的扩展，在原生协议的基础上添加了一些额外的头信息，比如 service name，magic number 等。使用 dubbo thrift 协议同样需要使用 thrift 的 idl compiler 编译生成相应的 java 代码。

扩展：[Dubbo 官方文档之通信协议](https://cn.dubbo.apache.org/zh-cn/overview/what/core-features/protocols/)

:::

## 负载均衡

### 【中级】Dubbo 支持哪些负载均衡方式？各有什么利弊？

:::details 要点

Dubbo 提供了多种均衡策略，缺省为 `weighted random` 基于权重的随机负载均衡策略。

具体实现上，Dubbo 提供的是客户端负载均衡，即由 Consumer 通过负载均衡算法得出需要将请求提交到哪个 Provider 实例。

目前 Dubbo 内置了如下负载均衡算法，可通过调整配置项启用。

| 算法                          | 特性                    | 备注                                                 |
| :---------------------------- | :---------------------- | :--------------------------------------------------- |
| Weighted Random LoadBalance   | 加权随机                | 默认算法，默认权重相同                               |
| RoundRobin LoadBalance        | 加权轮询                | 借鉴于 Nginx 的平滑加权轮询算法，默认权重相同，      |
| LeastActive LoadBalance       | 最少活跃优先 + 加权随机 | 背后是能者多劳的思想                                 |
| Shortest-Response LoadBalance | 最短响应优先 + 加权随机 | 更加关注响应速度                                     |
| ConsistentHash LoadBalance    | 一致性哈希              | 确定的入参，确定的提供者，适用于有状态请求           |
| P2C LoadBalance               | Power of Two Choice     | 随机选择两个节点后，继续选择“连接数”较小的那个节点。 |
| Adaptive LoadBalance          | 自适应负载均衡          | 在 P2C 算法基础上，选择二者中 load 最小的那个节点    |

Dubbo 的负载均衡配置可以细粒度到服务、方法级别，且 `dubbo:service` 和 `dubbo:reference` 均可配置。

```xml
<!-- 服务端服务级别 -->
<dubbo:service interface="..." loadbalance="roundrobin" />
<!-- 客户端服务级别 -->
<dubbo:reference interface="..." loadbalance="roundrobin" />
<!-- 服务端方法级别 -->
<dubbo:service interface="...">
    <dubbo:method name="..." loadbalance="roundrobin"/>
</dubbo:service>
<!-- 客户端方法级别 -->
<dubbo:reference interface="...">
    <dubbo:method name="..." loadbalance="roundrobin"/>
</dubbo:reference>
```

#### Weighted Random

- **加权随机**，按权重设置随机概率。
- 在一个截面上碰撞的概率高，但调用量越大分布越均匀，而且按概率使用权重后也比较均匀，有利于动态调整提供者权重。
- 缺点：存在慢的提供者累积请求的问题，比如：第二台机器很慢，但没挂，当请求调到第二台时就卡在那，久而久之，所有请求都卡在调到第二台上。

#### RoundRobin

- **加权轮询**，按公约后的权重设置轮询比率，循环调用节点
- 缺点：同样存在慢的提供者累积请求的问题。

#### LeastActive

- **加权最少活跃调用优先**，活跃数越低，越优先调用，相同活跃数的进行加权随机。活跃数指调用前后计数差（针对特定提供者：请求发送数 - 响应返回数），表示特定提供者的任务堆积量，活跃数越低，代表该提供者处理能力越强。
- 使慢的提供者收到更少请求，因为越慢的提供者的调用前后计数差会越大；相对的，处理能力越强的节点，处理更多的请求。

#### ShortestResponse

- **加权最短响应优先**，在最近一个滑动窗口中，响应时间越短，越优先调用。相同响应时间的进行加权随机。
- 使得响应时间越快的提供者，处理更多的请求。
- 缺点：可能会造成流量过于集中于高性能节点的问题。

这里的响应时间 = 某个提供者在窗口时间内的平均响应时间，窗口时间默认是 30s。

#### ConsistentHash

- **一致性 Hash**，相同参数的请求总是发到同一提供者。
- 当某一台提供者挂时，原本发往该提供者的请求，基于虚拟节点，平摊到其它提供者，不会引起剧烈变动。
- 算法参见：[Consistent Hashing | WIKIPEDIA](http://en.wikipedia.org/wiki/Consistent_hashing)
- 缺省只对第一个参数 Hash，如果要修改，请配置 `<dubbo:parameter key="hash.arguments" value="0,1" />`
- 缺省用 160 份虚拟节点，如果要修改，请配置 `<dubbo:parameter key="hash.nodes" value="320" />`

#### P2C Load Balance

Power of Two Choice 算法简单但是经典，主要思路如下：

1. 对于每次调用，从可用的 provider 列表中做两次随机选择，选出两个节点 providerA 和 providerB。
2. 比较 providerA 和 providerB 两个节点，选择其“当前正在处理的连接数”较小的那个节点。

以下是 [Dubbo P2C 算法实现提案](https://cn.dubbo.apache.org/zh-cn/overview/reference/proposals/heuristic-flow-control/#p2c算法)

#### Adaptive Load Balance

Adaptive 即自适应负载均衡，是一种能根据后端实例负载自动调整流量分布的算法实现，它总是尝试将请求转发到负载最小的节点。

以下是 [Dubbo Adaptive 算法实现提案](https://cn.dubbo.apache.org/zh-cn/overview/reference/proposals/heuristic-flow-control/#adaptive算法)

> 扩展：
>
> - [Dubbo 官方文档之负载均衡](https://cn.dubbo.apache.org/zh-cn/overview/what/core-features/load-balance/)
> - [负载均衡](https://dunwu.github.io/waterdrop/pages/bcf0fb8c/)

:::

## 路由

### 【中级】Dubbo 路由是怎样工作的？

:::details 要点

以下是 Dubbo 单个路由器的工作过程，路由器接收一个服务的实例地址集合作为输入，基于请求上下文 (Request Context) 和 (Router Rule) 实际的路由规则定义对输入地址进行匹配，所有匹配成功的实例组成一个地址子集，最终地址子集作为输出结果继续交给下一个路由器或者负载均衡组件处理。

![Router](https://cn.dubbo.apache.org/imgs/v3/feature/traffic/router1.png)

通常，在 Dubbo 中，多个路由器组成一条路由链共同协作，前一个路由器的输出作为另一个路由器的输入，经过层层路由规则筛选后，最终生成有效的地址集合。

- Dubbo 中的每个服务都有一条完全独立的路由链，每个服务的路由链组成可能不通，处理的规则各异，各个服务间互不影响。
- 对单条路由链而言，即使每次输入的地址集合相同，根据每次请求上下文的不同，生成的地址子集结果也可能不同。

![Router](https://cn.dubbo.apache.org/imgs/v3/feature/traffic/router2.png)

:::

### 【中级】Dubbo 支持哪些路由方式？分别适用于什么场景？

:::details 要点

Dubbo 的路由规则可以基于应用、服务、方法、参数等粒度精准的控制请求分发，根据请求的目标服务、方法以及请求体中的其他附加参数进行匹配，符合匹配条件的请求会进一步的按照特定规则转发到一个地址子集。

Dubbo 支持以下路由规则：

- 标签路由规则
- 条件路由规则
- 脚本路由规则
- 动态配置规则

#### 标签路由规则

**标签路由**通过将某一个服务的实例划分到不同的**分组**，**约束具有特定标签的流量只能在指定分组中流转**，不同分组为不同的流量场景服务，从而实现流量隔离的目的。**标签路由可以作为蓝绿发布、灰度发布等场景能力的基础**。

标签路由规则是一个非此即彼的流量隔离方案，也就是匹配标签的请求会 100% 转发到有相同标签的实例，没有匹配标签的请求会 100% 转发到其余未匹配的实例。如果您需要按比例的流量调度方案，请参考示例 [基于权重的按比例流量路由](https://cn.dubbo.apache.org/zh-cn/overview/what/core-features/tasks/traffic-management/weight/)。

**标签主要是指对 Provider 端应用实例的分组**，目前有两种方式可以完成实例分组，分别是动态规则打标和静态规则打标。**动态规则打标**可以在运行时动态的圈住一组机器实例，而**静态规则打标**则需要实例重启后才能生效，其中，动态规则相较于静态规则优先级更高，而当两种规则同时存在且出现冲突时，将以动态规则为准。

#### 条件路由规则

条件路由与标签路由的工作模式非常相似，也是首先对请求中的参数进行匹配，**符合匹配条件的请求将被转发到包含特定实例地址列表的子集**。相比于标签路由，条件路由的匹配方式更灵活：

- 在标签路由中，一旦给某一台或几台机器实例打了标签，则这部分实例就会被立马从通用流量集合中移除，不同标签之间不会再有交集。有点类似下图，地址集合在输入阶段就已经划分明确。

![tag-condition-compare](https://cn.dubbo.apache.org/imgs/v3/feature/traffic/tag-condition-compare1.png)

- 而从条件路由的视角，所有的实例都是一致的，路由过程中不存在分组隔离的问题，每次路由过滤都是基于全量地址中执行

![tag-condition-compare](https://cn.dubbo.apache.org/imgs/v3/feature/traffic/tag-condition-compare2.png)

条件路由规则的主体 `conditions` 主要包含两部分内容：

- => 之前的为请求参数匹配条件，指定的**匹配条件指定的参数**将与**消费者的请求上下文 (URL)**、甚至**方法参数**进行对比，当消费者满足匹配条件时，对该消费者执行后面的地址子集过滤规则。
- => 之后的为地址子集过滤条件，指定的**过滤条件指定的参数**将与**提供者实例地址 (URL)**进行对比，消费者最终只能拿到符合过滤条件的实例列表，从而确保流量只会发送到符合条件的地址子集。
  - 如果匹配条件为空，表示对所有请求生效，如：`=> status != staging`
  - 如果过滤条件为空，表示禁止来自相应请求的访问，如：`application = product =>`

#### 动态配置规则

通过 Dubbo 提供的动态配置规则，可以动态的修改 Dubbo 服务进程的运行时行为，整个过程不需要重启，配置参数实时生效。基于这个强大的功能，基本上所有运行期参数都可以动态调整，比如超时时间、临时开启 Access Log、修改 Tracing 采样率、调整限流降级参数、负载均衡、线程池配置、日志等级、给机器实例动态打标签等。与上文讲到的流量管控规则类似，动态配置规则支持应用、服务两个粒度，也就是说一次可以选择只调整应用中的某一个或几个服务的参数配置。

当然，出于系统稳定性、安全性的考量，有些特定的参数是不允许动态修改的，但除此之外，基本上所有参数都允许动态修改，很多强大的运行态能力都可以通过这个规则实现。通常 URL 地址中的参数均可以修改，这在每个语言实现的参考手册里也记录了一些更详细的说明。

#### 脚本路由规则

脚本路由是最直观的路由方式，同时它也是当前最灵活的路由规则，因为你可以在脚本中定义任意的地址筛选规则。如果我们为某个服务定义一条脚本规则，则后续所有请求都会先执行一遍这个脚本，脚本过滤出来的地址即为请求允许发送到的、有效的地址集合。

```yaml
configVersion: v3.0
key: demo-provider
type: javascript
enabled: true
script: |
  (function route(invokers,invocation,context) {
      var result = new java.util.ArrayList(invokers.size());
      for (i = 0; i < invokers.size(); i ++) {
          if ("10.20.3.3".equals(invokers.get(i).getUrl().getHost())) {
              result.add(invokers.get(i));
          }
      }
      return result;
  } (invokers, invocation, context)); // 表示立即执行方法
```

:::

## 服务治理

### 【中级】Dubbo 有哪些集群容错策略？

:::details 要点

在集群调用失败时，Dubbo 提供了多种容错方案，缺省为 failover 重试。

![Dubbo 容错](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javaweb/distributed/rpc/dubbo/dubbo集群容错.jpg)

图中节点关系说明：

- 这里的 `Invoker` 是 `Provider` 的一个可调用 `Service` 的抽象，`Invoker` 封装了 `Provider` 地址及 `Service` 接口信息
- `Directory` 代表多个 `Invoker`，可以把它看成 `List<Invoker>` ，但与 `List` 不同的是，它的值可能是动态变化的，比如注册中心推送变更
- `Cluster` 将 `Directory` 中的多个 `Invoker` 伪装成一个 `Invoker`，对上层透明，伪装过程包含了容错逻辑，调用失败后，重试另一个
- `Router` 负责从多个 `Invoker` 中按路由规则选出子集，比如读写分离，应用隔离等
- `LoadBalance` 负责从多个 `Invoker` 中选出具体的一个用于本次调用，选的过程包含了负载均衡算法，调用失败后，需要重选

Dubbo 支持的容错策略：

- **Failover** - **失败自动切换**。当出现失败，重试其它服务器。通常用于读操作，但重试会带来更长延迟。可通过 `retries="2"` 来设置重试次数(不含第一次)。
- **Failfast** - **快速失败**。只发起一次调用，失败立即报错。通常用于非幂等性的写操作，比如新增记录。
- **Failsafe** - **失败安全**。出现异常时，直接忽略。通常用于写入审计日志等操作。
- **Failback** - **失败自动恢复**。后台记录失败请求，定时重发。通常用于消息通知操作。
- **Forking** - **并行调用多个服务器**。只要一个成功即返回。通常用于实时性要求较高的读操作，但需要浪费更多服务资源。可通过 `forks="2"` 来设置最大并行数。
- **Broadcast** - **广播调用所有提供者**。逐个调用，任意一台报错则报错。通常用于通知所有提供者更新缓存或日志等本地资源信息。

集群容错配置示例：

```xml
<dubbo:service cluster="failsafe" />
<dubbo:reference cluster="failsafe" />
```

:::

### 【中级】Dubbo 提供了哪些监控能力？

:::details 要点

Dubbo 内部维护了多个纬度的可观测指标，并且支持多种方式的可视化监测。可观测性指标从总体上来说分为三个度量纬度：

- **Admin** - Admin 控制台可视化展示了集群中的应用、服务、实例及依赖关系，支持流量治理规则下发，同时还提供如服务测试、mock、文档管理等提升研发测试效率的工具。
- **Metrics** - Dubbo 统计了一系列的流量指标如 QPS、RT、成功请求数、失败请求数等，还包括一系列的内部组件状态如线程池数、服务健康状态等。
- **Tracing** - Dubbo 与业界主流的链路追踪工作做了适配，包括 Skywalking、Zipkin、Jaeger 都支持 Dubbo 服务的链路追踪。
- **Logging** - Dubbo 支持多种日志框架适配。以 Java 体系为例，支持包括 Slf4j、Log4j2、Log4j、Logback、Jcl 等，用户可以基于业务需要选择合适的框架；同时 Dubbo 还支持 Access Log 记录请求踪迹。

:::

## 应用

### 【基础】接口不同版本如何兼容？

:::details 要点

#### 版本和分组

Dubbo服务中，接口并不能唯一确定一个服务，只有 `接口+分组+版本号` 的三元组才能唯一确定一个服务。

- 当同一个接口针对不同的业务场景、不同的使用需求或者不同的功能模块等场景，可使用服务分组来区分不同的实现方式。同时，这些不同实现所提供的服务是可并存的，也支持互相调用。
- 当接口实现需要升级又要保留原有实现的情况下，即出现不兼容升级时，我们可以使用不同版本号进行区分。

下面以官方示例来解释一下如何指定版本。

假设，接口定义如下：

```java
public interface DevelopService {
    String invoke(String param);
}
```

版本 1 实现：

```java
@DubboService(group = "group1", version = "1.0")
public class DevelopProviderServiceV1 implements DevelopService{
    @Override
    public String invoke(String param) {
        StringBuilder s = new StringBuilder();
        s.append("ServiceV1 param:").append(param);
        return s.toString();
    }
}
```

版本 2 实现：

```java
@DubboService(group = "group2", version = "2.0")
public class DevelopProviderServiceV2 implements DevelopService{
    @Override
    public String invoke(String param) {
        StringBuilder s = new StringBuilder();
        s.append("ServiceV2 param:").append(param);
        return s.toString();
    }
}
```

#### 跨版本升级

可以按照以下的步骤进行版本迁移：

1. 在低压力时间段，先升级一半提供者为新版本
2. 再将所有消费者升级为新版本
3. 然后将剩下的一半提供者升级为新版本

当一个接口实现，出现不兼容升级时，可以用版本号过渡，版本号不同的服务相互间不引用。

> 参考用例 [https://github.com/apache/dubbo-samples/tree/master/dubbo-samples-version](https://github.com/apache/dubbo-samples/tree/master/2-advanced/dubbo-samples-version)

**服务提供者**

老版本服务提供者配置：

```xml
<dubbo:service interface="com.foo.BarService" version="1.0.0" />
```

新版本服务提供者配置：

```xml
<dubbo:service interface="com.foo.BarService" version="2.0.0" />
```

**服务消费者**

老版本服务消费者配置：

```xml
<dubbo:reference id="barService" interface="com.foo.BarService" version="1.0.0" />
```

新版本服务消费者配置：

```xml
<dubbo:reference id="barService" interface="com.foo.BarService" version="2.0.0" />
```

**不区分版本**

如果不需要区分版本，可以按照以下的方式配置：

```xml
<dubbo:reference id="barService" interface="com.foo.BarService" version="*" />
```

通过以上描述，可以看到，通过版本号来进行 Dubbo 接口升级实际上较为麻烦。如果接口提供方和消费方分属不同的业务团队，同步发版就更加麻烦了。因此，在实际应用中，更常见的操作是应该尽量充分考虑接口的后向兼容性，确保不会影响旧版本的调用。需要考虑的点如下：

- 如果方法签名无任何变化，不会影响旧版本的调用。服务提供方可以直接先全量上线。
- 如果入参、出参上新增属性，不会影响旧版本的调用（当然，对于新增属性的逻辑处理要充分考虑兼容性）。服务提供方可以直接先全量上线，消费方根据需要选择是否后续安排对接。
- 如果入参、出参上删除或修改属性，老接口无法正常调用，会出现序列化问题。这种情况，可以添加新的方法来实现。

> 扩展阅读：[Dubbo 官方文档之版本与分组](https://cn.dubbo.apache.org/zh-cn/overview/mannual/java-sdk/tasks/framework/version_group/)

:::

## 参考资料

- [Dubbo Github](https://github.com/apache/dubbo)
- [Dubbo 官方文档](https://dubbo.apache.org/zh-cn/)
- [Dubbo 框架设计](https://cn.dubbo.apache.org/zh-cn/docsv2.7/dev/design/)
- [如何基于 Dubbo 进行服务治理、服务降级、失败重试以及超时重试？](https://github.com/doocs/advanced-java/blob/master/docs/distributed-system/dubbo-service-management.md)