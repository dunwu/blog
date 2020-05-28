---
title: 负载均衡基本原理
categories: ['分布式']
tags: ['分布式', '负载均衡']
date: 2018-07-05 15:50
---

# 负载均衡基本原理

> 📦 本文已归档到：「[blog](https://github.com/dunwu/blog)」

![img](http://dunwu.test.upcdn.net/snap/20200528155252.png)

## 一、负载均衡简介

### 1.1. 负载均衡的作用

负载均衡（Load Balance，简称 LB）是高可用基础架构的关键组件，通常 **用于将网络流量分发到多个服务器上，以提高应用的响应速度和可用性**。

系统的扩展可分为垂直扩展和水平扩展。

- **垂直扩展**，是从单机的角度通过**增加硬件处理能力**，比如 CPU 处理能力，内存容量，磁盘等方面，实现服务器处理能力的提升。这种方式不能满足大型分布式系统（网站），大流量，高并发，海量数据的问题。
- **水平扩展**，是通过**添加机器**来满足大型网站服务的处理能力。比如：一台机器不能满足，则增加两台或者多台机器，共同承担访问压力。
  - 应用集群：将同一应用部署到多台机器上，组成处理集群，接收负载均衡设备分发的请求，进行处理，并返回相应数据。
  - 负载均衡设备：将用户访问的请求，根据负载均衡算法，分发到集群中的一台处理服务器。（一种把网络请求分散到一个服务器集群中的可用服务器上去的设备）

负载均衡的作用：

- **高并发** - 负载均衡通过调整负载，尽力让应用集群中的节点工作量达到均匀，以此提高应用集群的并发处理能力（吞吐量）。
- **伸缩性** - 添加或减少服务器数量，然后由负载均衡进行分发控制。这使得应用集群具备伸缩性。
- **故障转移** - 负载均衡器可以监控候选服务器，当服务器不可用时，自动跳过，将请求分发给可用的服务器。这使得应用集群具备高可用的特性。
- **安全防护** - 有些负载均衡软件或硬件提供了安全性功能，如：黑白名单处理、防火墙，防 DDos 攻击等。

### 1.2. 负载均衡的分类

负载均衡大致可以分为两大类：

- 软件负载均衡
- 硬件负载均衡

#### 软件负载均衡

软件负载均衡，应用最为广泛，无论大公司还是小公司都会使用。

软件负载均衡从软件层面实现负载均衡，一般可以在任何标准物理设备上运行。

软件负载均衡的 **主流产品** 有：[Nginx](https://www.nginx.com/)、[HAProxy](http://www.haproxy.org/)、[LVS](https://github.com/alibaba/LVS)。

- [LVS](https://github.com/alibaba/LVS) 可以作为四层负载均衡器。其负载均衡的性能要优于 Nginx。
- [HAProxy](http://www.haproxy.org/) 可以作为 HTTP 和 TCP 负载均衡器。
- [Nginx](https://www.nginx.com/)、[HAProxy](http://www.haproxy.org/) 可以作为四层或七层负载均衡器。

软件负载均衡的 **优点**：

- **扩展性好** - 适应动态变化，可以通过添加软件负载均衡实例，动态扩展到超出初始容量的能力。
- **成本低廉** - 软件负载均衡可以在任何标准物理设备上运行，降低了购买和运维的成本。

软件负载均衡的 **缺点**：

- **性能略差** - 相比于硬件负载均衡，软件负载均衡的性能要略低一些。

软件负载负载均衡从通信层面来看，又可以分为四层和七层负载均衡。

- 四层负载均衡 - 基于 IP 地址和端口进行请求的转发。
- 七层负载均衡 - 就是可以根据访问用户的 HTTP 请求头、URL 信息将请求转发到特定的主机。

#### 硬件负载均衡

硬件负载均衡，一般是在定制处理器上运行的独立负载均衡服务器，价格昂贵，土豪专属。

硬件负载均衡的 **主流产品** 有：[F5](https://f5.com/zh) 和 [A10](https://www.a10networks.com.cn/)。

硬件负载均衡的 **优点**：

- **功能强大** - 支持全局负载均衡并提供较全面的、复杂的负载均衡算法。
- **性能强悍** - 硬件负载均衡由于是在专用处理器上运行，因此吞吐量大，可支持单机百万以上的并发。
- **安全性高** - 往往具备防火墙，防 DDos 攻击等安全功能。

硬件负载均衡的 **缺点**：

- **成本昂贵** - 购买和维护硬件负载均衡的成本都很高。
- **扩展性差** - 当访问量突增时，超过限度不能动态扩容。

## 二、负载均衡算法

负载均衡算法是负载均衡服务核心中的核心。负载均衡产品多种多样，但是各种负载均衡算法原理是共性的。

负载均衡算法有很多种，分别适用于不同的应用场景，本文仅介绍最为常见的负载均衡算法的特性及原理：轮询、随机、最少连接、一致性 Hash。

### 2.1. 轮询

**`轮询（Round Robin）`** 算法 **将请求依次分发到候选服务器**。

- 特点：**请求完全均匀分发**，即服务器请求被完全均匀的分发到集群的各节点上。
- 场景：**适合服务器硬件相同的场景**。
- 该算法比较适合每个服务器的性能差不多的场景，如果有性能存在差异的情况下，那么性能较差的服务器可能无法承担过大的负载（下图的 Server 2）。

下图中，一共有 6 个客户端产生了 6 个请求，这 6 个请求按 (1, 2, 3, 4, 5, 6) 的顺序发送。最后，(1, 3, 5) 的请求会被发送到服务器 1，(2, 4, 6) 的请求会被发送到服务器 2。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/负载均衡算法之轮询-01.jpg)

该算法比较适合每个服务器的性能差不多的场景，如果有性能存在差异的情况下，那么性能较差的服务器可能无法承担过大的负载（下图的 Server 2）。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/负载均衡算法之轮询-02.jpg)

节点存储结构：

```java
private List<V> nodeList = Collections.emptyList();
```

算法实现示例：

```java
private V select() {
    if (CollectionUtil.isEmpty(this.nodeList)) {
        return null;
    }

    int size = this.nodeList.size();
    offset.compareAndSet(size, 0);
    return nodeList.get(offset.getAndIncrement());
}
```

#### 加权轮询

**`加权轮询（Weighted Round Robbin）`** 算法在轮询算法的基础上，增加了权重属性。性能高、处理速度快的机器应该设置更高的权重，使得分发时优先将请求分发到权重较高的服务器上。

- 优点：根据权重，调节转发服务器的请求数目。
- 缺点：比轮询算法复杂。

加权轮询是在轮询的基础上，根据服务器的性能差异，为服务器赋予一定的权值。例如下图中，服务器 1 被赋予的权值为 5，服务器 2 被赋予的权值为 1，那么 (1, 2, 3, 4, 5) 请求会被发送到服务器 1，(6) 请求会被发送到服务器 2。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/负载均衡算法之加权轮询.jpg)

节点存储结构：

```java
// key 存储实际节点内容，value 存储节点的权重
private Map<V, Integer> nodeMap = new LinkedHashMap<>();
```

算法实现示例：

```java
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

### 2.2. 随机

**`随机（Random）`** 算法 **将请求随机分发到候选服务器**。

- 特点：调用量较小的时候，可能负载并不均匀，**调用量越大，负载越均衡**。
- 场景：**适合服务器硬件相同的场景**。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/负载均衡算法之随机.jpg)

节点存储结构：

```java
List<V> nodeList = Collections.emptyList();
```

算法实现示例：

```java
public V select() {
    if (CollectionUtil.isEmpty(this.nodeList)) {
        return null;
    }

    int offset = random.nextInt(nodeList.size());
    return nodeList.get(offset);
}
```

#### 加权随机

**`加权随机（Weighted Random）`** 算法在随机算法的基础上，按照概率调整权重，进行负载分配。

节点存储结构：

```java
// key 存储实际节点内容，value 存储节点的权重
Map<V, Integer> nodeMap = new LinkedHashMap<>();
```

算法实现示例：

```java
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

### 2.3. 最少连接

**`最少连接（Least Connection）`** 算法 **将请求分发到连接数/请求数最少的候选服务器**（目前处理请求最少的服务器）。

- 特点：根据候选服务器当前的请求连接数，动态分配。
- 场景：**适用于对系统负载较为敏感或请求连接时长相差较大的场景**。

由于每个请求的连接时长不一样，如果采用简单的轮循或随机算法，都可能出现**某些服务器当前连接数过大，而另一些服务器的连接过小**的情况，这就造成了负载并非真正均衡。虽然，轮询或算法都可以通过加权重属性的方式进行负载调整，但加权方式难以应对动态变化。

例如下图中，(1, 3, 5) 请求会被发送到服务器 1，但是 (1, 3) 很快就断开连接，此时只有 (5) 请求连接服务器 1；(2, 4, 6) 请求被发送到服务器 2，只有 (2) 的连接断开。该系统继续运行时，服务器 2 会承担过大的负载。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/负载均衡算法之最少连接-01.jpg)

最少连接算法会记录当前时刻，每个候选节点正在处理的连接数，然后选择连接数最小的节点。该策略能够动态、实时地反应服务器的当前状况，较为合理地将负责分配均匀，适用于对当前系统负载较为敏感的场景。

例如下图中，服务器 1 当前连接数最小，那么新到来的请求 6 就会被发送到服务器 1 上。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1%E7%AE%97%E6%B3%95%E4%B9%8B%E6%9C%80%E5%B0%91%E8%BF%9E%E6%8E%A5-02.jpg)

#### 加权最少连接

加权最少连接（Weighted Least Connection）在最少连接的基础上，根据服务器的性能为每台服务器分配权重，再根据权重计算出每台服务器能处理的连接数。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/负载均衡算法之加权最少连接.jpg)

### 2.4. 源地址哈希

**`源地址哈希（IP Hash）`**算法 **根据请求源 IP，通过哈希计算得到一个数值，用该数值在候选服务器列表的进行取模运算，得到的结果便是选中的服务器**。

- 特点：保证特定用户总是请求到相同的服务器，若服务器宕机，会话会丢失。
- 场景：会话粘滞。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/负载均衡算法之IpHash.jpg)

算法示例：

```java
public V select(final String key) {
    List<V> list = new ArrayList<>(nodes);
    int hashCode = key.hashCode();
    int idx = hashCode % list.size();
    return list.get(Math.abs(idx));
}
```

### 2.5. 一致性哈希

一致性哈希（Consistent Hash）算法的目标是：**相同的请求尽可能落到同一个服务器上**。

- 相同的请求是指：一般在使用一致性哈希时，需要指定一个 key 用于 hash 计算，可能是：
  - 用户 ID
  - 请求方 IP
  - 请求服务名称，参数列表构成的串
- 尽可能是指：服务器可能发生上下线，少数服务器的变化不应该影响大多数的请求。

当某台候选服务器宕机时，原本发往该服务器的请求，会基于虚拟节点，平摊到其它候选服务器，不会引起剧烈变动。

一致性哈希算法示例：

- 构建虚拟 Hash 环

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
```

核心算法

```java
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

## 三、故障处理机制

负载均衡产品需要考虑故障问题。

### 心跳检查

负载均衡类产品，一般都有健康检查机制，来检测集群中的节点状态。

常见的手段就是：心跳检查。

心跳检查原理是：服务方向负载均衡服务定期发送心跳消息以续约，负载均衡服务如果在一定时间内迟迟得不到某个服务方的心跳，则判定其故障，将其从有效服务列表移除。

适用场景：负载均衡是在服务器进行。

### 失败重试机制

请求方向服务方发送请求，一般都会设置**超时时间**和**最大失败重试次数**。

当前请求时间大于超时时间，会重新请求，一旦超过最大失败重试次数，可判定当前请求的服务故障。此时，可以根据失败处理策略（根据业务需要，灵活定制），选择放弃请求，发出告警；或使用负载均衡算法再选出一个新的服务方。

适用场景：负载均衡是在客户端进行。

## 四、负载均衡产品

根据实现技术不同，可分划分如下：

- 七层负载均衡
  - DNS 重定向
  - HTTP 重定向
  - 反向代理
- 四层负载均衡
  - 修改 IP 地址
  - 修改 MAC 地址

### 3.1. 七层负载均衡

#### DNS 负载均衡

DNS 负载均衡一般用于互联网公司，复杂的业务系统不适合使用。大型网站一般使用 DNS 负载均衡作为 **第一级负载均衡手段**，然后在内部使用其它方式做第二级负载均衡。DNS 负载均衡属于七层负载均衡。

DNS 即 **域名解析服务**，是 OSI 第七层网络协议。DNS 被设计为一个树形结构的分布式应用，自上而下依次为：根域名服务器，一级域名服务器，二级域名服务器，... ，本地域名服务器。显然，如果所有数据都存储在根域名服务器，那么 DNS 查询的负载和开销会非常庞大。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200125143248.png)

因此，DNS 查询相对于 DNS 层级结构，是一个逆向的递归流程，DNS 客户端依次请求本地 DNS 服务器，上一级 DNS 服务器，上上一级 DNS 服务器，... ，根 DNS 服务器（又叫权威 DNS 服务器），一旦命中，立即返回。为了减少查询次数，每一级 DNS 服务器都会设置 DNS 查询缓存。

DNS 负载均衡的工作原理就是：**基于 DNS 查询缓存，按照负载情况返回不同服务器的 IP 地址**。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/Dns重定向.png)

DNS 重定向的 **优点**：

- **使用简单** - 负载均衡工作，交给 DNS 服务器处理，省掉了负载均衡服务器维护的麻烦
- **提高性能** - 可以支持基于地址的域名解析，解析成距离用户最近的服务器地址（类似 CDN 的原理），可以加快访问速度，改善性能；

DNS 重定向的 **缺点**：

- **可用性差** - DNS 解析是多级解析，新增/修改 DNS 后，解析时间较长；解析过程中，用户访问网站将失败；
- **扩展性低** - DNS 负载均衡的控制权在域名商那里，无法对其做更多的改善和扩展；
- **维护性差** - 也不能反映服务器的当前运行状态；支持的算法少；不能区分服务器的差异（不能根据系统与服务的状态来判断负载）

#### HTTP 负载均衡

**HTTP 负载均衡是基于 HTTP 重定向实现的**。HTTP 负载均衡属于七层负载均衡。

HTTP 重定向原理是：**根据用户的 HTTP 请求计算出一个真实的服务器地址，将该服务器地址写入 HTTP 重定向响应中，返回给浏览器，由浏览器重新进行访问**。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/Http重定向.png)

HTTP 重定向的 **优点**：**方案简单**。

HTTP 重定向的 **缺点**：

- **性能较差** - 每次访问需要两次请求服务器，增加了访问的延迟。
- **降低搜索排名** - 使用重定向后，搜索引擎会视为 SEO 作弊。
- 如果负载均衡器宕机，就无法访问该站点。

由于其缺点比较明显，所以这种负载均衡策略实际应用较少。

#### 反向代理

反向代理（Reverse Proxy）方式是指以 **代理服务器** 来接受网络请求，然后 **将请求转发给内网中的服务器**，并将从内网中的服务器上得到的结果返回给网络请求的客户端。反向代理负载均衡属于七层负载均衡。

![img](http://dunwu.test.upcdn.net/cs/design/architecture/代理自动配置.jpg)

反向代理服务的主流产品：**Nginx**、**Apache**。

正向代理与反向代理有什么区别？

- 正向代理：发生在 **客户端**，是由用户主动发起的。翻墙软件就是典型的正向代理，客户端通过主动访问代理服务器，让代理服务器获得需要的外网数据，然后转发回客户端。
- 反向代理：发生在 **服务端**，用户不知道代理的存在。

![img](http://dunwu.test.upcdn.net/cs/web/nginx/reverse-proxy.png)

Nginx 可以实现简单的负载均衡功能：

![img](http://dunwu.test.upcdn.net/cs/web/nginx/nginx-load-balance.png)

反向代理的 **优点**：

- **多种负载均衡算法** - 支持多种负载均衡算法，以应对不同的场景需求。
- **可以监控服务器** - 基于 HTTP 协议，可以监控转发服务器的状态，如：系统负载、响应时间、是否可用、连接数、流量等，从而根据这些数据调整负载均衡的策略。

反向代理的 **缺点**：

- **额外的转发开销** - 反向代理的转发操作本身是有性能开销的，可能会包括，创建连接，等待连接响应，分析响应结果等操作。

- **增加系统复杂度** - 反向代理常用于做分布式应用的水平扩展，但反向代理服务存在以下问题，为了解决以下问题会给系统整体增加额外的复杂度和运维成本：

  - 反向代理服务如果宕机，就无法访问站点，所以需要有 **高可用** 方案，常见的方案有：主备模式（一主一备）、双主模式（互为主备）。
  - 反向代理服务自身也存在性能瓶颈，随着需要转发的请求量不断攀升，需要有 **可扩展** 方案。

#### RPC 负载均衡

RPC 负载均衡其原理是：服务提供方向服务注册中心注册服务，服务消费方向注册中心请求可用的服务提供方。当服务消费方获取到可用服务方信息后，消费方自身根据一定的负载均衡算法，选择向哪个服务方发送请求。

常见的应用技术有：Dubbo（支持负载均衡的 RPC 框架）、Spring Cloud Ribbon、Spring Cloud Feign 等。

### 3.2. 四层负载均衡

#### 网络地址转发

**`网络地址转发（Network Address Translation，简称 NAT）`** 是指 **通过修改目的 IP 地址实现负载均衡**。NAT 属于四层负载均衡。

NAT 工作原理：

- 用户请求数据包到达 LB 后，LB 在操作系统内核进程获取网络数据包。
- LB 器根据负载均衡算法得到 RIP，并将请求目的地址修改为 RIP，不需要经过用户进程处理。然后，将请求发送给 RS。
- RS 处理完成请求后，将响应数据包返回到 LB。
- LB 再将数据包源地址修改为自身的 IP 地址，发送给用户浏览器。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200125131843.png)

NAT 的 **优点**：在内核进程完成数据分发，比在应用层分发 **性能更好**；

NAT 的 **缺点**：所有请求响应都需要经过负载均衡服务器，集群 **最大吞吐量受限于负载均衡服务器网卡带宽**；

网络层负载均衡主流的产品是：

- [LVS](https://github.com/alibaba/LVS) 的 NAT 模式。
- HAProxy 的 TCP 四层负载均衡。

在 NAT 模式下，HAProxy 使用比 LVS 更方便。

#### 隧道技术

**`隧道技术（ IP Tunneling，简称 TUN）`** 是指：采用 NAT 模式时，由于请求和响应的报文必须通过负载均衡器重写地址，当客户请求越来越多时，负载均衡器处理能力将成为瓶颈。为了解决这个问题，负载均衡器把请求的报文**通过 IP 隧道转发到真实的服务器**。真实的服务器将响应处理后的数据直接返回给客户端。这样负载均衡器就只需处理请求报文。

TUN 工作原理：

- 客户请求数据包，根据目标地址 VIP 发送到 LB 上。
- LB 接收到客户请求包，根据负载均衡算法计算出分发的 RS。
- 然后，进行 IP Tunnel 封装。即在原有的请求包上封装 IP Tunnel 的包头。然后发送出去。
- RS 根据 IP Tunnel 包头信息（此时就又一种逻辑上的隐形隧道，只有 LB 和 RS 之间懂）收到请求包，然后解开 IP Tunnel 包头信息，得到客户的请求包并进行响应处理。
- 响应处理完毕之后，RS 使用自己的出公网的线路，将这个响应数据包发送给客户端。源 IP 地址还是 VIP 地址。

#### 直接路由

**`直接路由（Direct Routing，简称 DR）`** 是指 **通过修改目的 MAC 地址实现负载均衡**。DR 属于四层负载均衡。

DR 工作原理：

- 客户请求数据包到达 LB 后，LB 根据调度算法选出一台 RS，将数据帧的 MAC 地址改写为 RS 的 MAC 地址，然后发送出去。
- 交换机会根据 MAC 地址将数据封包发送给 RS，RS 将处理完的结果直接返回给客户端。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200125131811.png)

数据链路层负载均衡主流的产品是：[LVS](https://github.com/alibaba/LVS) 的 DR 模式。

DR 的 **优点**：

- 不需要负载均衡服务器进行地址的转换。
- 数据响应时不需要经过负载均衡服务器，性能高于 NAT。

DR 的 **缺点**：

- 对网卡带宽要求较高。
- 提供服务的端口必须一致。VIP 的端口对外端口为 80，但后端服务的真实端口为 8080，通过 LVS 的 DR 模式无法实现。
- LVS 和真实服务器必须在同一网络。

## 五、术语

- LB - Load Balancer，即负载均衡器。
- RS - Real Server，即真实服务器。
- RIP - Real Server IP，即真实服务器 IP。
- VIP - Virtual IP，即虚拟 IP，是外部直接面向用户请求，作为用户请求的目标 IP 地址。
- DIP - Director Server IP，即直连服务器 IP，主要用于和内部主机通信的 IP 地址。
- CIP - Client IP，即客户端 IP。
- NAT - Network Address Translation，即网络地址转发。
- TUN - IP Tunneling，即 IP 隧道技术。
- DR - Direct Routing，即直接路由。

## 参考资料

- [《大型网站技术架构：核心原理与案例分析》](https://item.jd.com/11322972.html)
- [大型网站架构系列：负载均衡详解（1）](https://www.cnblogs.com/itfly8/p/5043435.html)
- [什么是负载均衡](https://zhuanlan.zhihu.com/p/32841479)
- [What Is Load Balancing](https://avinetworks.com/what-is-load-balancing/)
- [负载均衡算法及手段](https://segmentfault.com/a/1190000004492447)
- [Dubbo 负载均衡实现](https://dubbo.apache.org/zh-cn/docs/source_code_guide/loadbalance.html)
- [利用 dns 解析来实现网站的负载均衡](https://segmentfault.com/a/1190000002578457)
- [原理上搞懂 LVS 的 DR 和 NAT 模式的缺陷，不看小心踩坑](https://zhuanlan.zhihu.com/p/31777732)
- [使用 LVS 实现负载均衡原理及安装配置详解](https://www.cnblogs.com/liwei0526vip/p/6370103.html)
