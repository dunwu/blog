---
title: 负载均衡基本原理
categories: ['分布式']
tags: ['分布式', '负载均衡']
date: 2018-07-05 15:50
---

# 负载均衡基本原理

> 📦 本文已归档到：「[blog](https://github.com/dunwu/blog)」

![img](http://dunwu.test.upcdn.net/snap/20200528155252.png)

<!-- TOC depthFrom:2 depthTo:3 -->

- [1. 负载均衡简介](#1-负载均衡简介)
  - [1.1. 大型网站面临的挑战](#11-大型网站面临的挑战)
  - [1.2. 什么是负载均衡](#12-什么是负载均衡)
- [2. 负载均衡的分类](#2-负载均衡的分类)
  - [2.1. 载体维度分类](#21-载体维度分类)
  - [2.2. 网络通信分类](#22-网络通信分类)
- [3. 负载均衡算法](#3-负载均衡算法)
  - [3.1. 轮询](#31-轮询)
  - [3.2. 随机](#32-随机)
  - [3.3. 最近最少连接](#33-最近最少连接)
  - [3.4. 源地址哈希](#34-源地址哈希)
  - [3.5. 一致性哈希](#35-一致性哈希)
  - [3.6. 虚拟哈希槽](#36-虚拟哈希槽)
- [4. 参考资料](#4-参考资料)

<!-- /TOC -->

## 1. 负载均衡简介

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210112113136.svg)

### 1.1. 大型网站面临的挑战

大型网站都要面对庞大的用户量，高并发，海量数据等挑战。

为了提升系统整体的性能，可以采用垂直扩展和水平扩展两种方式。

- **垂直扩展**：在网站发展早期，可以从单机的角度通过**增加硬件处理能力**，比如 CPU 处理能力，内存容量，磁盘等方面，实现服务器处理能力的提升。但是，单机是有性能瓶颈的，一旦触及瓶颈，再想提升，付出的成本和代价会极高。这显然不能满足大型分布式系统（网站）所有应对的大流量，高并发，海量数据等挑战。
- **水平扩展**：通过集群来分担大型网站的流量。集群中的应用服务器（节点）通常被设计成无状态，用户可以请求任何一个节点，这些节点共同分担访问压力。水平扩展有两个要点：
  - **应用集群**：将同一应用部署到多台机器上，组成处理集群，接收负载均衡设备分发的请求，进行处理，并返回相应数据。
  - **负载均衡**：将用户访问请求，通过某种算法，分发到集群中的节点。

### 1.2. 什么是负载均衡

负载均衡（Load Balance，简称 LB）是高并发、高可用系统必不可少的关键组件，目标是 **尽力将网络流量平均分发到多个服务器上，以提高系统整体的响应速度和可用性**。

负载均衡的主要作用如下：

- **高并发**：负载均衡通过算法调整负载，尽力均匀的分配应用集群中各节点的工作量，以此提高应用集群的并发处理能力（吞吐量）。
- **伸缩性**：添加或减少服务器数量，然后由负载均衡进行分发控制。这使得应用集群具备伸缩性。
- **高可用**：负载均衡器可以监控候选服务器，当服务器不可用时，自动跳过，将请求分发给可用的服务器。这使得应用集群具备高可用的特性。
- **安全防护**：有些负载均衡软件或硬件提供了安全性功能，如：黑白名单处理、防火墙，防 DDos 攻击等。

## 2. 负载均衡的分类

支持负载均衡的技术很多，我们可以通过不同维度去进行分类。

### 2.1. 载体维度分类

从支持负载均衡的载体来看，可以将负载均衡分为两类：

- 硬件负载均衡
- 软件负载均衡

#### 硬件负载均衡

硬件负载均衡，一般是在定制处理器上运行的独立负载均衡服务器，**价格昂贵，土豪专属**。

硬件负载均衡的 **主流产品** 有：[F5](https://f5.com/zh) 和 [A10](https://www.a10networks.com.cn/)。

硬件负载均衡的 **优点**：

- **功能强大**：支持全局负载均衡并提供较全面的、复杂的负载均衡算法。
- **性能强悍**：硬件负载均衡由于是在专用处理器上运行，因此吞吐量大，可支持单机百万以上的并发。
- **安全性高**：往往具备防火墙，防 DDos 攻击等安全功能。

硬件负载均衡的 **缺点**：

- **成本昂贵**：购买和维护硬件负载均衡的成本都很高。
- **扩展性差**：当访问量突增时，超过限度不能动态扩容。

#### 软件负载均衡

软件负载均衡，**应用最广泛**，无论大公司还是小公司都会使用。

软件负载均衡从软件层面实现负载均衡，一般可以在任何标准物理设备上运行。

软件负载均衡的 **主流产品** 有：[Nginx](https://www.nginx.com/)、[HAProxy](http://www.haproxy.org/)、[LVS](https://github.com/alibaba/LVS)。

- [LVS](https://github.com/alibaba/LVS) 可以作为四层负载均衡器。其负载均衡的性能要优于 Nginx。
- [HAProxy](http://www.haproxy.org/) 可以作为 HTTP 和 TCP 负载均衡器。
- [Nginx](https://www.nginx.com/)、[HAProxy](http://www.haproxy.org/) 可以作为四层或七层负载均衡器。

软件负载均衡的 **优点**：

- **扩展性好**：适应动态变化，可以通过添加软件负载均衡实例，动态扩展到超出初始容量的能力。
- **成本低廉**：软件负载均衡可以在任何标准物理设备上运行，降低了购买和运维的成本。

软件负载均衡的 **缺点**：

- **性能略差**：相比于硬件负载均衡，软件负载均衡的性能要略低一些。

### 2.2. 网络通信分类

软件负载均衡从通信层面来看，又可以分为四层和七层负载均衡。

- 七层负载均衡：就是可以根据访问用户的 HTTP 请求头、URL 信息将请求转发到特定的主机。
  - DNS 重定向
  - HTTP 重定向
  - 反向代理
- 四层负载均衡：基于 IP 地址和端口进行请求的转发。
  - 修改 IP 地址
  - 修改 MAC 地址

#### DNS 负载均衡

DNS 负载均衡一般用于互联网公司，复杂的业务系统不适合使用。大型网站一般使用 DNS 负载均衡作为 **第一级负载均衡手段**，然后在内部使用其它方式做第二级负载均衡。DNS 负载均衡属于七层负载均衡。

DNS 即 **域名解析服务**，是 OSI 第七层网络协议。DNS 被设计为一个树形结构的分布式应用，自上而下依次为：根域名服务器，一级域名服务器，二级域名服务器，... ，本地域名服务器。显然，如果所有数据都存储在根域名服务器，那么 DNS 查询的负载和开销会非常庞大。

因此，DNS 查询相对于 DNS 层级结构，是一个逆向的递归流程，DNS 客户端依次请求本地 DNS 服务器，上一级 DNS 服务器，上上一级 DNS 服务器，... ，根 DNS 服务器（又叫权威 DNS 服务器），一旦命中，立即返回。为了减少查询次数，每一级 DNS 服务器都会设置 DNS 查询缓存。

DNS 负载均衡的工作原理就是：**基于 DNS 查询缓存，按照负载情况返回不同服务器的 IP 地址**。

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210117220007.png)

DNS 重定向的 **优点**：

- **使用简单**：负载均衡工作，交给 DNS 服务器处理，省掉了负载均衡服务器维护的麻烦
- **提高性能**：可以支持基于地址的域名解析，解析成距离用户最近的服务器地址（类似 CDN 的原理），可以加快访问速度，改善性能；

DNS 重定向的 **缺点**：

- **可用性差**：DNS 解析是多级解析，新增/修改 DNS 后，解析时间较长；解析过程中，用户访问网站将失败；
- **扩展性低**：DNS 负载均衡的控制权在域名商那里，无法对其做更多的改善和扩展；
- **维护性差**：也不能反映服务器的当前运行状态；支持的算法少；不能区分服务器的差异（不能根据系统与服务的状态来判断负载）

#### HTTP 负载均衡

**HTTP 负载均衡是基于 HTTP 重定向实现的**。HTTP 负载均衡属于七层负载均衡。

HTTP 重定向原理是：**根据用户的 HTTP 请求计算出一个真实的服务器地址，将该服务器地址写入 HTTP 重定向响应中，返回给浏览器，由浏览器重新进行访问**。

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210117220310.png)

HTTP 重定向的 **优点**：**方案简单**。

HTTP 重定向的 **缺点**：

- **性能较差**：每次访问需要两次请求服务器，增加了访问的延迟。
- **降低搜索排名**：使用重定向后，搜索引擎会视为 SEO 作弊。
- 如果负载均衡器宕机，就无法访问该站点。

由于其缺点比较明显，所以这种负载均衡策略实际应用较少。

#### 反向代理负载均衡

反向代理（Reverse Proxy）方式是指以 **代理服务器** 来接受网络请求，然后 **将请求转发给内网中的服务器**，并将从内网中的服务器上得到的结果返回给网络请求的客户端。反向代理负载均衡属于七层负载均衡。

反向代理服务的主流产品：**Nginx**、**Apache**。

正向代理与反向代理有什么区别？

- 正向代理：发生在 **客户端**，是由用户主动发起的。翻墙软件就是典型的正向代理，客户端通过主动访问代理服务器，让代理服务器获得需要的外网数据，然后转发回客户端。
- 反向代理：发生在 **服务端**，用户不知道代理的存在。

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210117222209.png)

反向代理是如何实现负载均衡的呢？以 Nginx 为例，如下所示：

![img](http://dunwu.test.upcdn.net/cs/web/nginx/nginx-load-balance.png)

首先，在代理服务器上设定好负载均衡规则。然后，当收到客户端请求，反向代理服务器拦截指定的域名或 IP 请求，根据负载均衡算法，将请求分发到候选服务器上。其次，如果某台候选服务器宕机，反向代理服务器会有容错处理，比如分发请求失败 3 次以上，将请求分发到其他候选服务器上。

反向代理的 **优点**：

- **多种负载均衡算法**：支持多种负载均衡算法，以应对不同的场景需求。
- **可以监控服务器**：基于 HTTP 协议，可以监控转发服务器的状态，如：系统负载、响应时间、是否可用、连接数、流量等，从而根据这些数据调整负载均衡的策略。

反向代理的 **缺点**：

- **额外的转发开销**：反向代理的转发操作本身是有性能开销的，可能会包括创建连接，等待连接响应，分析响应结果等操作。

- **增加系统复杂度**：反向代理常用于做分布式应用的水平扩展，但反向代理服务存在以下问题，为了解决以下问题会给系统整体增加额外的复杂度和运维成本：

  - 反向代理服务如果自身宕机，就无法访问站点，所以需要有 **高可用** 方案，常见的方案有：主备模式（一主一备）、双主模式（互为主备）。
  - 反向代理服务自身也存在性能瓶颈，随着需要转发的请求量不断攀升，需要有 **可扩展** 方案。

#### RPC 负载均衡

对于微服务架构，RPC 几乎是标配，它同样需要解决负载均衡问题。

RPC 的负载均衡原理是：服务提供方向服务注册中心注册服务，服务消费方向注册中心请求可用的服务提供方。当服务消费方获取到可用服务方信息后，消费方自身根据一定的负载均衡算法，选择向哪个服务方发送请求。

常见的技术有：Dubbo（支持负载均衡的 RPC 框架）、Thrift、gRpc、Spring Cloud 等。

#### 数据链路层负载均衡

数据链路层负载均衡是指在通信协议的数据链路层修改 mac 地址进行负载均衡。

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210117222127.png)

在 Linux 平台上最好的链路层负载均衡开源产品是 LVS (Linux Virtual Server)。

LVS 是基于 Linux 内核中 netfilter 框架实现的负载均衡系统。netfilter 是内核态的 Linux 防火墙机制，可以在数据包流经过程中，根据规则设置若干个关卡（hook 函数）来执行相关的操作。

LVS 的工作流程大致如下：

- 当用户访问 www.sina.com.cn 时，用户数据通过层层网络，最后通过交换机进入 LVS 服务器网卡，并进入内核网络层。
- 进入 PREROUTING 后经过路由查找，确定访问的目的 VIP 是本机 IP 地址，所以数据包进入到 INPUT 链上
- IPVS 是工作在 INPUT 链上，会根据访问的 `vip+port` 判断请求是否 IPVS 服务，如果是则调用注册的 IPVS HOOK 函数，进行 IPVS 相关主流程，强行修改数据包的相关数据，并将数据包发往 POSTROUTING 链上。
- POSTROUTING 上收到数据包后，根据目标 IP 地址（后端服务器），通过路由选路，将数据包最终发往后端的服务器上。

开源 LVS 版本有 3 种工作模式，每种模式工作原理截然不同，说各种模式都有自己的优缺点，分别适合不同的应用场景，不过最终本质的功能都是能实现均衡的流量调度和良好的扩展性。主要包括三种模式：DR 模式、NAT 模式、Tunnel 模式。

## 3. 负载均衡算法

负载均衡器的实现可以分为两个部分：

- 根据负载均衡算法在候选服务器列表选出一个服务器；
- 将请求数据发送到该服务器上。

负载均衡算法是负载均衡服务核心中的核心。负载均衡产品多种多样，但是各种负载均衡算法原理是共性的。

负载均衡算法有很多种，分别适用于不同的应用场景，本文仅介绍最为常见的负载均衡算法的特性及原理：轮询、随机、最近最少连接、源地址哈希、一致性哈希。

### 3.1. 轮询

#### 轮询算法

**`轮询（Round Robin）`** 算法的策略是：**将请求依次分发到候选服务器**。

如下图所示，负载均衡器收到来自客户端的 6 个请求，(1, 3, 5) 的请求会被发送到服务器 1，(2, 4, 6) 的请求会被发送到服务器 2。

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210117204412.png)

该算法适合场景：各服务器处理能力相近，且每个事务工作量差异不大。如果存在较大差异，那么处理较慢的服务器就可能会积压请求，最终无法承担过大的负载。

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210117204707.png)

【示例】轮询算法示例

```java
private AtomicInteger offset = new AtomicInteger(0);
private Set<V> nodes = Collections.emptyNavigableSet();

// 节点选择算法
private V select() {
    if (CollectionUtil.isEmpty(this.nodes)) {
        return null;
    }

    int size = this.nodes.size();
    offset.compareAndSet(size, 0);
    int number = offset.getAndIncrement();
    Iterator<V> iterator = nodes.iterator();
    while (number-- > 0) {
        iterator.next();
    }
    return iterator.next();
}
```

#### 加权轮询算法

**`加权轮询（Weighted Round Robbin）`** 算法在轮询算法的基础上，增加了权重属性来调节转发服务器的请求数目。性能高、处理速度快的节点应该设置更高的权重，使得分发时优先将请求分发到权重较高的节点上。

如下图所示，服务器 A 设置权重为 5，服务器 B 设置权重为 1，负载均衡器收到来自客户端的 6 个请求，那么 (1, 2, 3, 4, 5) 请求会被发送到服务器 A，(6) 请求会被发送到服务器 B。

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210117204955.png)

【示例】加权轮询算法实现示例

```java
// key 存储实际节点内容，value 存储节点的权重
private Map<V, Integer> nodeMap = new LinkedHashMap<>();

// 选择节点
public V select() {
    if (MapUtil.isEmpty(nodeMap)) {
        return null;
    }

    int totalWeight = nodeMap.values().stream().mapToInt(a -> a).sum();
    int number = offset.getAndIncrement() % totalWeight;

    for (Map.Entry<V, Integer> item : nodeMap.entrySet()) {
        if (item.getValue() > number) {
            return item.getKey();
        }
        number -= item.getValue();
    }
    return null;
}
```

### 3.2. 随机

#### 随机算法

**`随机（Random）`** 算法 **将请求随机分发到候选服务器**。

随机算法 **适合服务器硬件相同的场景**。学习过概率论的都知道，调用量较小的时候，可能负载并不均匀，**调用量越大，负载越均衡**。

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210117205443.png)

【示例】随机算法实现示例

```java
List<V> nodeList = Collections.emptyList();

public V select() {
    if (CollectionUtil.isEmpty(this.nodeList)) {
        return null;
    }

    int offset = random.nextInt(nodeList.size());
    return nodeList.get(offset);
}
```

#### 加权随机算法

**`加权随机（Weighted Random）`** 算法在随机算法的基础上，按照概率调整权重，进行负载分配。

【示例】加权随机算法实现示例

```java
// key 存储实际节点内容，value 存储节点的权重
Map<V, Integer> nodeMap = new LinkedHashMap<>();

public V select() {
    if (MapUtil.isEmpty(keyWeightMap)) {
        return null;
    }

    List<V> list = new ArrayList<>();
    for (Map.Entry<V, Integer> item : keyWeightMap.entrySet()) {
        for (int i = 0; i < item.getValue(); i++) {
            list.add(item.getKey());
        }
    }

    int totalWeight = keyWeightMap.values().stream().mapToInt(a -> a).sum();
    int number = random.nextInt(totalWeight);
    return list.get(number);
}
```

### 3.3. 最近最少连接

#### 最近最少连接算法

**`最近最少连接（Least Connection）`** 算法 **将请求分发到连接数/请求数最少的候选服务器**（目前处理请求最少的服务器）。

- 特点：根据候选服务器当前的请求连接数，动态分配。
- 场景：**适用于对系统负载较为敏感或请求连接时长相差较大的场景**。

由于每个请求的连接时长不一样，如果采用简单的轮循或随机算法，都可能出现**某些服务器当前连接数过大，而另一些服务器的连接过小**的情况，这就造成了负载并非真正均衡。虽然，轮询或算法都可以通过加权重属性的方式进行负载调整，但加权方式难以应对动态变化。

例如下图中，(1, 3, 5) 请求会被发送到服务器 1，但是 (1, 3) 很快就断开连接，此时只有 (5) 请求连接服务器 1；(2, 4, 6) 请求被发送到服务器 2，只有 (2) 的连接断开。该系统继续运行时，服务器 2 会承担过大的负载。

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210117210011.png)

最少连接算法会记录当前时刻，每个候选节点正在处理的连接数，然后选择连接数最小的节点。该策略能够动态、实时地反应服务器的当前状况，较为合理地将负责分配均匀，适用于对当前系统负载较为敏感的场景。

例如下图中，服务器 1 当前连接数最小，那么新到来的请求 6 就会被发送到服务器 1 上。

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210117210248.png)

**加权最少连接（Weighted Least Connection）**在最少连接的基础上，根据服务器的性能为每台服务器分配权重，再根据权重计算出每台服务器能处理的连接数。

### 3.4. 源地址哈希

**`源地址哈希（IP Hash）`**算法 **根据请求源 IP，通过哈希计算得到一个数值，用该数值在候选服务器列表的进行取模运算，得到的结果便是选中的服务器**。

可以保证同一 IP 的客户端的请求会转发到同一台服务器上，用来实现会话粘滞（Sticky Session）。

- 特点：保证特定用户总是请求到相同的服务器，若服务器宕机，会话会丢失。

【示例】源地址哈希算法实现示例

```java
List<V> nodeList = Collections.emptyList();

public V select(final String key) {
    int hashCode = key.hashCode();
    int idx = hashCode % nodeList.size();
    return nodeList.get(Math.abs(idx));
}
```

### 3.5. 一致性哈希

一致性哈希（Consistent Hash）算法的目标是：**相同的请求尽可能落到同一个服务器上**。

**一致性哈希** 可以很好的解决 **稳定性问题**，可以将所有的 **存储节点** 排列在 **首尾相接** 的 `Hash` 环上，每个 `key` 在计算 `Hash` 后会 **顺时针** 找到 **临接** 的 **存储节点** 存放。而当有节点 **加入** 或 **退出** 时，仅影响该节点在 `Hash` 环上 **顺时针相邻** 的 **后续节点**。

![](http://dunwu.test.upcdn.net/cs/design/architecture/partition-consistent-hash.png)

- 相同的请求是指：一般在使用一致性哈希时，需要指定一个 key 用于 hash 计算，可能是：
  - 用户 ID
  - 请求方 IP
  - 请求服务名称，参数列表构成的串
- 尽可能是指：服务器可能发生上下线，少数服务器的变化不应该影响大多数的请求。

当某台候选服务器宕机时，原本发往该服务器的请求，会基于虚拟节点，平摊到其它候选服务器，不会引起剧烈变动。

- **优点**

**加入** 和 **删除** 节点只影响 **哈希环** 中 **顺时针方向** 的 **相邻的节点**，对其他节点无影响。

- **缺点**

**加减节点** 会造成 **哈希环** 中部分数据 **无法命中**。当使用 **少量节点** 时，**节点变化** 将大范围影响 **哈希环** 中 **数据映射**，不适合 **少量数据节点** 的分布式方案。**普通** 的 **一致性哈希分区** 在增减节点时需要 **增加一倍** 或 **减去一半** 节点才能保证 **数据** 和 **负载的均衡**。

> **注意**：因为 **一致性哈希分区** 的这些缺点，一些分布式系统采用 **虚拟槽** 对 **一致性哈希** 进行改进，比如 `Dynamo` 系统。

【示例】一致性哈希算法示例

```java
private final static int VIRTUAL_NODE_SIZE = 1000;
private final static String VIRTUAL_NODE_SUFFIX = "&&";
private Set<V> nodes = new LinkedHashSet<>(collection);
private TreeMap<Integer, V> hashRing = buildConsistentHashRing(this.nodes);

TreeMap<Integer, V> buildConsistentHashRing(Set<V> nodes) {
    TreeMap<Integer, V> hashRing = new TreeMap<>();
    for (V node : nodes) {
        for (int i = 0; i < VIRTUAL_NODE_SIZE; i++) {
            // 新增虚拟节点的方式如果有影响，也可以抽象出一个由物理节点扩展虚拟节点的类
            hashRing.put(hashStrategy.hashCode(node + VIRTUAL_NODE_SUFFIX + i), node);
        }
    }
    return hashRing;
}

public V select(String key) {
    int hashCode = hashStrategy.hashCode(key);
    // 向右找到第一个 key
    Map.Entry<Integer, V> entry = hashRing.ceilingEntry(hashCode);
    if (entry == null) {
        // 想象成一个环，超过尾部则取第一个 key
        entry = hashRing.firstEntry();
    }
    return entry.getValue();
}
```

### 3.6. 虚拟哈希槽

虚拟哈希槽是对一致性 Hash 的改进。

**虚拟槽分区** 巧妙地使用了 **哈希空间**，使用 **分散度良好** 的 **哈希函数** 把所有数据 **映射** 到一个 **固定范围** 的 **整数集合** 中，整数定义为 **槽**（`slot`）。这个范围一般 **远远大于** 节点数，比如 `Redis Cluster` 槽范围是 `0 ~ 16383`。**槽** 是集群内 **数据管理** 和 **迁移** 的 **基本单位**。采用 **大范围槽** 的主要目的是为了方便 **数据拆分** 和 **集群扩展**。每个节点会负责 **一定数量的槽**，如图所示：

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20210112104935.png)

当前集群有 `3` 个节点，每个节点平均大约负责 `5460` 个 **槽**。由于采用 **高质量** 的 **哈希算法**，每个槽所映射的数据通常比较 **均匀**，将数据平均划分到 `3` 个节点进行 **数据分区**。`Redis Cluster` 就是采用 **虚拟槽分区**。

集群中的每个节点负责一部分哈希槽，比如集群中有３个节点，则：

- 节点Ａ存储的哈希槽范围是：0 – 5460
- 节点Ｂ存储的哈希槽范围是：5461 – 10922
- 节点Ｃ存储的哈希槽范围是：10923 – 16383

这种结构很容易 **添加** 或者 **删除** 节点。如果 **增加** 一个节点 `4`，就需要从节点 `1 ~ 3` 获得部分 **槽** 分配到节点 `4` 上。如果想 **移除** 节点 `1`，需要将节点 `1` 中的 **槽** 移到节点 `2 ~ 3` 上，然后将 **没有任何槽** 的节点 `1` 从集群中 **移除** 即可。

> 由于从一个节点将 **哈希槽** 移动到另一个节点并不会 **停止服务**，所以无论 **添加删除** 或者 **改变** 某个节点的 **哈希槽的数量** 都不会造成 **集群不可用** 的状态.

## 4. 参考资料

- [Comparing Load Balancing Algorithms](https://www.youtube.com/watch?reload=9&app=desktop&v=iqOTT7_7qXY)
- [《大型网站技术架构：核心原理与案例分析》](https://item.jd.com/11322972.html)
- [大型网站架构系列：负载均衡详解（1）](https://www.cnblogs.com/itfly8/p/5043435.html)
- [什么是负载均衡](https://zhuanlan.zhihu.com/p/32841479)
- [What Is Load Balancing](https://avinetworks.com/what-is-load-balancing/)
- [负载均衡算法及手段](https://segmentfault.com/a/1190000004492447)
- [利用 dns 解析来实现网站的负载均衡](https://segmentfault.com/a/1190000002578457)
- [负载均衡 LVS 总结 - 基础原理](https://blog.csdn.net/liwei0526vip/article/details/103104483)
