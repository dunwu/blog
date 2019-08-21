---
title: 负载均衡
categories: ['design', 'distributed']
tags: ['design', 'distributed']
date: 2018-07-05 15:50
---

# 负载均衡

## 负载均衡原理

系统的扩展可分为垂直扩展和水平扩展。

- 垂直扩展，是从单机的角度通过增加硬件处理能力，比如 CPU 处理能力，内存容量，磁盘等方面，实现服务器处理能力的提升。这种方式不能满足大型分布式系统（网站），大流量，高并发，海量数据的问题。
- 水平扩展，是通过添加机器来满足大型网站服务的处理能力。比如：一台机器不能满足，则增加两台或者多台机器，共同承担访问压力。

  - 应用集群：将同一应用部署到多台机器上，组成处理集群，接收负载均衡设备分发的请求，进行处理，并返回相应数据。
  - 负载均衡设备：将用户访问的请求，根据负载均衡算法，分发到集群中的一台处理服务器。（一种把网络请求分散到一个服务器集群中的可用服务器上去的设备）

负载均衡的作用（解决的问题）：

- 解决并发压力，提高应用处理性能（增加吞吐量，加强网络处理能力）；
- 提供故障转移，实现高可用；
- 通过添加或减少服务器数量，提供网站伸缩性（扩展性）；
- 安全防护；（负载均衡设备上做一些过滤，黑白名单等处理）

## 负载均衡分类

根据实现技术不同，可分为反向代理、HTTP 重定向、DNS 重定向、修改 IP 地址、修改 MAC 地址等。

### 反向代理

> 正向代理与反向代理的区别：
>
> - 正向代理：发生在客户端，是由用户主动发起的。比如翻墙，客户端通过主动访问代理服务器，让代理服务器获得需要的外网数据，然后转发回客户端。
> - 反向代理：发生在服务器端，用户不知道代理的存在。
>
> 反向代理的作用是保护网站安全，所有互联网的请求都必须经过代理服务器，相当于在 web 服务器和可能的网络攻击之间建立了一个屏障。
>
> 优点：部署简单
>
> 缺点：可能成为系统瓶颈

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/代理自动配置.jpg!zp" width="640"/>
</div>

### HTTP 重定向

> HTTP 重定向服务器收到 HTTP 请求之后会返回服务器的地址，并将该地址写入 HTTP 重定向响应中返回给浏览器，浏览器收到后需要再次发送请求。
>
> 缺点：
>
> - 用户访问的延迟会增加；
> - 如果负载均衡器宕机，就无法访问该站点。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/Http重定向.png!zp" width="640"/>
</div>

### DNS 重定向

> **使用 DNS 作为负载均衡器，根据负载情况返回不同服务器的 IP 地址。**
>
> 大型网站基本使用了这种方式做为第一级负载均衡手段，然后在内部使用其它方式做第二级负载均衡。
>
> 优点：
>
> - 使用简单：负载均衡工作，交给 DNS 服务器处理，省掉了负载均衡服务器维护的麻烦
> - 提高性能：可以支持基于地址的域名解析，解析成距离用户最近的服务器地址，可以加快访问速度，改善性能；
>
> 缺点：
>
> - 可用性差：DNS 解析是多级解析，新增/修改 DNS 后，解析时间较长；解析过程中，用户访问网站将失败；
> - 扩展性低：DNS 负载均衡的控制权在域名商那里，无法对其做更多的改善和扩展；
> - 维护性差：也不能反映服务器的当前运行状态；支持的算法少；不能区分服务器的差异（不能根据系统与服务的状态来判断负载）
>
> 建议：
>
> - 将 DNS 作为第一级负载均衡，A 记录对应着内部负载均衡的 IP 地址，通过内部负载均衡将请求分发到真实的 Web 服务器上。一般用于互联网公司，复杂的业务系统不合适使用。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/Dns重定向.png!zp" width="640"/>
</div>

### 修改 IP 地址

> **在网络层修改请求的目的 IP 地址来进行负载均衡。**
>
> 用户请求数据包，到达负载均衡服务器后，负载均衡服务器在操作系统内核进程获取网络数据包，根据负载均衡算法得到一台真实服务器地址，然后将请求目的地址修改为，获得的真实 ip 地址，不需要经过用户进程处理。真实服务器处理完成后，响应数据包回到负载均衡服务器，负载均衡服务器，再将数据包源地址修改为自身的 ip 地址，发送给用户浏览器。
>
> IP 负载均衡，真实物理服务器返回给负载均衡服务器，存在两种方式：
>
> 1. 负载均衡服务器在修改目的 ip 地址的同时修改源地址。将数据包源地址设为自身盘，即[网络地址转换（NAT）](https://www.nginx.com/resources/glossary/layer-4-load-balancing/)。
> 2. 将负载均衡服务器同时作为真实物理服务器集群的网关服务器。
>
> 优点：在内核进程完成数据分发，比在应用层分发性能更好；
>
> 缺点：所有请求响应都需要经过负载均衡服务器，集群最大吞吐量受限于负载均衡服务器网卡带宽；

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/修改IP地址.png!zp" width="640"/>
</div>

### 修改 MAC 地址

> 使用 LVS（Linux Virtual Server）这种链路层负载均衡器，根据负载情况修改请求的 MAC 地址。
>
> 实际处理服务器 ip 和数据请求目的 ip 一致，不需要经过负载均衡服务器进行地址转换，可将响应数据包直接返回给用户浏览器，避免负载均衡服务器网卡带宽成为瓶颈。也称为直接路由模式（DR 模式）。
>
> 优点：性能好；
>
> 缺点：配置复杂；
>
> 建议：DR 模式是目前使用最广泛的一种负载均衡方式。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/修改Mac地址.png!zp" width="640"/>
</div>

### 混合负载均衡

由于多个服务器群内硬件设备、各自的规模、提供的服务等的差异，可以考虑给每个服务器群采用最合适的负载均衡方式，然后又在这多个服务器群间再一次负载均衡或群集起来以一个整体向外界提供服务（即把这多个服务器群当做一个新的服务器群），从而达到最佳的性能。将这种方式称之为混合型负载均衡。

此种方式有时也用于单台均衡设备的性能不能满足大量连接请求的情况下。是目前大型互联网公司，普遍使用的方式。

方式一，如下图：

<div align="center"><img src="https://images2015.cnblogs.com/blog/820332/201512/820332-20151213200106747-94797427.png"/></div>

以上模式适合有动静分离的场景，反向代理服务器（集群）可以起到缓存和动态请求分发的作用，当时静态资源缓存在代理服务器时，则直接返回到浏览器。如果动态页面则请求后面的应用负载均衡（应用集群）。

方式二，如下图：

<div align="center"><img src="https://images2015.cnblogs.com/blog/820332/201512/820332-20151213200117825-1452672107.png"/></div>

以上模式，适合动态请求场景。

因混合模式，可以根据具体场景，灵活搭配各种方式，以上两种方式仅供参考。

## 负载均衡算法

常用的负载均衡算法有：轮询、随机、最少连接、源地址散列、加权等方式。

### 轮询

> 轮询（Round Robin）算法将所有请求，依次分发到每台服务器上，适合服务器硬件同相同的场景。
>
> - 优点：服务器请求数目相同；
> - 缺点：服务器压力不一样，不适合服务器配置不同的情况；

下图中，一共有 6 个客户端产生了 6 个请求，这 6 个请求按 (1, 2, 3, 4, 5, 6) 的顺序发送。最后，(1, 3, 5) 的请求会被发送到服务器 1，(2, 4, 6) 的请求会被发送到服务器 2。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/负载均衡算法之轮询-01.jpg!zp" width="640"/>
</div>

该算法比较适合每个服务器的性能差不多的场景，如果有性能存在差异的情况下，那么性能较差的服务器可能无法承担过大的负载（下图的 Server 2）。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/负载均衡算法之轮询-02.jpg!zp" width="640"/>
</div>

算法示例：

```java
private Integer pos = 0;
public void roundRobin() {
    List<String> keyList = new ArrayList<String>(serverMap.keySet());
    String server = null;
    synchronized (pos) {
        if (pos > keyList.size()) {
            pos = 0;
        }
        server = keyList.get(pos);
        pos++;
    }
    System.out.println(server);
}
```

#### 加权轮询

> 加权轮询（Weighted Round Robbin）算法在轮询算法的基础上，通过加权的方式，进行负载服务器分配。
>
> - 优点：根据权重，调节转发服务器的请求数目；
> - 缺点：使用相对复杂；

加权轮询是在轮询的基础上，根据服务器的性能差异，为服务器赋予一定的权值。例如下图中，服务器 1 被赋予的权值为 5，服务器 2 被赋予的权值为 1，那么 (1, 2, 3, 4, 5) 请求会被发送到服务器 1，(6) 请求会被发送到服务器 2。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/负载均衡算法之加权轮询.jpg!zp" width="640"/>
</div>

算法示例：

```java
public void weightRoundRobin() {
    Set<String> keySet = serverMap.keySet();
    List<String> servers = new ArrayList<String>();
    for (Iterator<String> it = keySet.iterator(); it.hasNext(); ) {
        String server = it.next();
        int weithgt = serverMap.get(server);
        for (int i = 0; i < weithgt; i++) {
            servers.add(server);
        }
    }
    String server = null;
    synchronized (pos) {
        if (pos > keySet.size()) {
            pos = 0;
        }
        server = servers.get(pos);
        pos++;
    }
    System.out.println(server);
}
```

### 最少连接

> 最少连接（Least Busy）算法将请求分配到连接数最少的服务器（目前处理请求最少的服务器）。
>
> - 优点：根据服务器当前的请求处理情况，动态分配；
> - 缺点：算法实现相对复杂，需要监控服务器请求连接数；

由于每个请求的连接时间不一样，使用轮询或者加权轮询算法的话，可能会让一台服务器当前连接数过大，而另一台服务器的连接过小，造成负载不均衡。例如下图中，(1, 3, 5) 请求会被发送到服务器 1，但是 (1, 3) 很快就断开连接，此时只有 (5) 请求连接服务器 1；(2, 4, 6) 请求被发送到服务器 2，只有 (2) 的连接断开。该系统继续运行时，服务器 2 会承担过大的负载。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/负载均衡算法之最少连接-01.jpg!zp" width="640"/>
</div>

最少连接算法就是将请求发送给当前最少连接数的服务器上。例如下图中，服务器 1 当前连接数最小，那么新到来的请求 6 就会被发送到服务器 1 上。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/负载均衡算法之最少连接-02.jpg!zp" width="640"/>
</div>

#### 加权最少连接

> 加权最少连接（Weighted Least Connection）在最少连接的基础上，根据服务器的性能为每台服务器分配权重，再根据权重计算出每台服务器能处理的连接数。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/负载均衡算法之加权最少连接.jpg!zp" width="640"/>
</div>
### 随机

> 随机（Random）算法将请求随机分配到各个服务器。
>
> - 优点：使用简单；
> - 缺点：不适合机器配置不同的场景；

和轮询算法类似，该算法比较适合服务器性能差不多的场景。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/负载均衡算法之随机.jpg!zp" width="640"/>
</div>

### 哈希（Hash）

#### 普通 Hash

> 根据 IP 地址进行 Hash 计算，得到 IP 地址。
>
> - 优点：将来自同一 IP 地址的请求，同一会话期内，转发到相同的服务器；实现会话粘滞。
> - 缺点：目标服务器宕机后，会话会丢失；

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/负载均衡算法之IpHash.jpg!zp" width="640"/>
</div>

算法示例：

```java
public void hash() {
    List<String> keyList = new ArrayList<String>(serverMap.keySet());
    String remoteIp = "192.168.2.215";
    int hashCode = remoteIp.hashCode();
    int idx = hashCode % keyList.size();
    String server = keyList.get(Math.abs(idx));
    System.out.println(server);
}
```

#### 一致性哈希

一致性 Hash，相同参数的请求总是发到同一提供者。当某一台提供者挂时，原本发往该提供者的请求，基于虚拟节点，平摊到其它提供者，不会引起剧烈变动。

## 硬件负载均衡

采用硬件的方式实现负载均衡，一般是单独的负载均衡服务器，价格昂贵，一般土豪级公司可以考虑，业界领先的有两款，F5 和 A10。

- 使用硬件负载均衡，主要考虑一下几个方面：
- 功能考虑：功能全面支持各层级的负载均衡，支持全面的负载均衡算法，支持全局负载均衡；
- 性能考虑：一般软件负载均衡支持到 5 万级并发已经很困难了，硬件负载均衡可以支持
- 稳定性：商用硬件负载均衡，经过了良好的严格的测试，从经过大规模使用，在稳定性方面高；
- 安全防护：硬件均衡设备除具备负载均衡功能外，还具备防火墙，防 DDOS 攻击等安全功能；
- 维护角度：提供良好的维护管理界面，售后服务和技术支持；
- 土豪公司：F5 Big Ip 价格：15w\~55w 不等；A10 价格：55w-100w 不等；

缺点

- 价格昂贵；
- 扩展能力差；

小结

- 一般硬件的负载均衡也要做双机高可用，因此成本会比较高。
- 互联网公司一般使用开源软件，因此大部分应用采用软件负载均衡；部分采用硬件负载均衡。

比如某互联网公司，目前是使用几台 F5 做全局负载均衡，内部使用 Nginx 等软件负载均衡。

## Ngnix 负载均衡

Ngnix 是一款轻量级的 Web 服务器/反向代理服务器，工作在七层 Http 协议的负载均衡系统。具有高性能、高并发、低内存使用等特点。是一个轻量级的 Http 和反向代理服务器。Nginx 使用 epoll and kqueue 作为开发模型。能够支持高达 50,000 个并发连接数的响应。

操作系统：Liunx，Windows（Linux、FreeBSD、Solaris、Mac OS X、AIX 以及 Microsoft Windows）

开发语言：C

并发性能：官方支持每秒 5 万并发，实际国内一般到每秒 2 万并发，有优化到每秒 10 万并发的。具体性能看应用场景。

### Ngnix 特点

- 模块化设计：良好的扩展性，可以通过模块方式进行功能扩展。
- 高可靠性：主控进程和 worker 是同步实现的，一个 worker 出现问题，会立刻启动另一个 worker。
- 内存消耗低：一万个长连接（keep-alive）,仅消耗 2.5MB 内存。
- 支持热部署：不用停止服务器，实现更新配置文件，更换日志文件、更新服务器程序版本。
- 并发能力强：官方数据每秒支持 5 万并发；
- 功能丰富：优秀的反向代理功能和灵活的负载均衡策略

### Ngnix 功能

#### 基本功能

- 支持静态资源的 web 服务器。
- http,smtp,pop3 协议的反向代理服务器、缓存、负载均衡；
- 支持 FASTCGI（fpm）
- 支持模块化，过滤器（让文本可以实现压缩，节约带宽）,ssl 及图像大小调整。
- 内置的健康检查功能
- 基于名称和 ip 的虚拟主机
- 定制访问日志
- 支持平滑升级
- 支持 KEEPALIVE
- 支持 url rewrite
- 支持路径别名
- 支持基于 IP 和用户名的访问控制。
- 支持传输速率限制，支持并发数限制。

#### 扩展功能

#### 性能

Nginx 的高并发，官方测试支持 5 万并发连接。实际生产环境能到 2-3 万并发连接数。10000 个非活跃的 HTTP keep-alive 连接仅占用约 2.5MB 内存。三万并发连接下，10 个 Nginx 进程，消耗内存 150M。淘宝 tengine 团队测试结果是“24G 内存机器上，处理并发请求可达 200 万”。

### Ngnix 架构

#### Nginx 的基本工作模式

<div align="center"><img src="https://images2015.cnblogs.com/blog/820332/201512/820332-20151227195943640-864372763.jpg"/></div>

一个 master 进程，生成一个或者多个 worker 进程。但是这里 master 是使用 root 身份启动的，因为 nginx 要工作在 80 端口。而只有管理员才有权限启动小于低于 1023 的端口。master 主要是负责的作用只是启动 worker，加载配置文件，负责系统的平滑升级。其它的工作是交给 worker。那么当 worker 被启动之后，也只是负责一些 web 最简单的工作，而其他的工作都是有 worker 中调用的模块来实现的。

模块之间是以流水线的方式实现功能的。流水线，指的是一个用户请求，由多个模块组合各自的功能依次实现完成的。比如：第一个模块只负责分析请求首部，第二个模块只负责查找数据，第三个模块只负责压缩数据，依次完成各自工作。来实现整个工作的完成。

他们是如何实现热部署的呢？其实是这样的，我们前面说 master 不负责具体的工作，而是调用 worker 工作，他只是负责读取配置文件，因此当一个模块修改或者配置文件发生变化，是由 master 进行读取，因此此时不会影响到 worker 工作。在 master 进行读取配置文件之后，不会立即的把修改的配置文件告知 worker。而是让被修改的 worker 继续使用老的配置文件工作，当 worker 工作完毕之后，直接当掉这个子进程，更换新的子进程，使用新的规则。

#### Nginx 支持的 sendfile 机制

Sendfile 机制，用户将请求发给内核，内核根据用户的请求调用相应用户进程，进程在处理时需要资源。此时再把请求发给内核（进程没有直接 IO 的能力），由内核加载数据。内核查找到数据之后，会把数据复制给用户进程，由用户进程对数据进行封装，之后交给内核，内核在进行 tcp/ip 首部的封装，最后再发给客户端。这个功能用户进程只是发生了一个封装报文的过程，却要绕一大圈。因此 nginx 引入了 sendfile 机制，使得内核在接受到数据之后，不再依靠用户进程给予封装，而是自己查找自己封装，减少了一个很长一段时间的浪费，这是一个提升性能的核心点。

<div align="center"><img src="https://images2015.cnblogs.com/blog/820332/201512/820332-20151227195957171-1801771404.jpg"/></div>

以上内容摘自网友发布的文章，简单一句话是资源的处理，直接通过内核层进行数据传递，避免了数据传递到应用层，应用层再传递到内核层的开销。

目前高并发的处理，一般都采用 sendfile 模式。通过直接操作内核层数据，减少应用与内核层数据传递。

#### Nginx 通信模型（I/O 复用机制）

开发模型：epoll 和 kqueue。

支持的事件机制：kqueue、epoll、rt signals、/dev/poll 、event ports、select 以及 poll。

支持的 kqueue 特性包括 EV_CLEAR、EV_DISABLE、NOTE_LOWAT、EV_EOF，可用数据的数量，错误代码.

支持 sendfile、sendfile64 和 sendfilev;文件 AIO；DIRECTIO;支持 Accept-filters 和 TCP_DEFER_ACCEP.

以上概念较多，大家自行百度或谷歌，知识领域是网络通信（BIO,NIO,AIO）和多线程方面的知识。

### Ngnix 均衡策略

nginx 的负载均衡策略可以划分为两大类：内置策略和扩展策略。内置策略包含加权轮询和 ip hash，在默认情况下这两种策略会编译进 nginx 内核，只需在 nginx 配置中指明参数即可。扩展策略有很多，如 fair、通用 hash、consistent hash 等，默认不编译进 nginx 内核。由于在 nginx 版本升级中负载均衡的代码没有本质性的变化，因此下面将以 nginx1.0.15 稳定版为例，从源码角度分析各个策略。

#### 加权轮询（weighted round robin）

轮询的原理很简单，首先我们介绍一下轮询的基本流程。如下是处理一次请求的流程图：

<div align="center"><img src="https://images2015.cnblogs.com/blog/820332/201512/820332-20151227201913984-412518987.jpg"/></div>

图中有两点需要注意，第一，如果可以把加权轮询算法分为先深搜索和先广搜索，那么 nginx 采用的是先深搜索算法，即将首先将请求都分给高权重的机器，直到该机器的权值降到了比其他机器低，才开始将请求分给下一个高权重的机器；第二，当所有后端机器都 down 掉时，nginx 会立即将所有机器的标志位清成初始状态，以避免造成所有的机器都处在 timeout 的状态，从而导致整个前端被夯住。

#### ip hash

ip hash 是 nginx 内置的另一个负载均衡的策略，流程和轮询很类似，只是其中的算法和具体的策略有些变化，如下图所示：

<div align="center"><img src="https://images2015.cnblogs.com/blog/820332/201512/820332-20151227201851812-352858632.jpg"/></div>

#### fair

fair 策略是扩展策略，默认不被编译进 nginx 内核。其原理是根据后端服务器的响应时间判断负载情况，从中选出负载最轻的机器进行分流。这种策略具有很强的自适应性，但是实际的网络环境往往不是那么简单，因此要慎用。

#### 通用 hash、一致性 hash

这两种也是扩展策略，在具体的实现上有些差别，通用 hash 比较简单，可以以 nginx 内置的变量为 key 进行 hash，一致性 hash 采用了 nginx 内置的一致性 hash 环，可以支持 memcache。

### Ngnix 场景

Ngnix 一般作为入口负载均衡或内部负载均衡，结合反向代理服务器使用。以下架构示例，仅供参考，具体使用根据场景而定。

#### 入口负载均衡架构

<div align="center"><img src="https://images2015.cnblogs.com/blog/820332/201512/820332-20151227202044781-2116477406.png"/></div>

Ngnix 服务器在用户访问的最前端。根据用户请求再转发到具体的应用服务器或二级负载均衡服务器（LVS）

#### 内部负载均衡架构

<div align="center"><img src="https://images2015.cnblogs.com/blog/820332/201512/820332-20151227202054421-2015542569.png"/></div>

LVS 作为入口负载均衡，将请求转发到二级 Ngnix 服务器，Ngnix 再根据请求转发到具体的应用服务器。

#### Ngnix 高可用

<div align="center"><img src="https://images2015.cnblogs.com/blog/820332/201512/820332-20151227202100921-915093452.png"/></div>

分布式系统中，应用只部署一台服务器会存在单点故障，负载均衡同样有类似的问题。一般可采用主备或负载均衡设备集群的方式节约单点故障或高并发请求分流。

Ngnix 高可用，至少包含两个 Ngnix 服务器，一台主服务器，一台备服务器，之间使用 Keepalived 做健康监控和故障检测。开放 VIP 端口，通过防火墙进行外部映射。

DNS 解析公网的 IP 实际为 VIP。

## LVS 负载均衡

LVS 是一个开源的软件，由毕业于国防科技大学的章文嵩博士于 1998 年 5 月创立，用来实现 Linux 平台下的简单负载均衡。LVS 是 Linux Virtual Server 的缩写，意思是 Linux 虚拟服务器。

基于 IP 层的负载均衡调度技术，它在操作系统核心层上，将来自 IP 层的 TCP/UDP 请求均衡地转移到不同的 服务器，从而将一组服务器构成一个高性能、高可用的虚拟服务器。

操作系统：Liunx

开发语言：C

并发性能：默认 4096，可以修改但需要重新编译。

### LVS 功能

LVS 的主要功能是实现 IP 层（网络层）负载均衡，有 NAT,TUN,DR 三种请求转发模式。

#### LVS/NAT 方式的负载均衡集群

NAT 是指 Network Address Translation，它的转发流程是：Director 机器收到外界请求，改写数据包的目标地址，按相应的调度算法将其发送到相应 Real Server 上，Real Server 处理完该请求后，将结果数据包返回到其默认网关，即 Director 机器上，Director 机器再改写数据包的源地址，最后将其返回给外界。这样就完成一次负载调度。

构架一个最简单的 LVS/NAT 方式的负载均衡集群 Real Server 可以是任何的操作系统，而且无需做任何特殊的设定，惟一要做的就是将其默认网关指向 Director 机器。Real Server 可以使用局域网的内部 IP(192.168.0.0/24)。Director 要有两块网卡，一块网卡绑定一个外部 IP 地址 (10.0.0.1)，另一块网卡绑定局域网的内部 IP(192.168.0.254)，作为 Real Server 的默认网关。

LVS/NAT 方式实现起来最为简单，而且 Real Server 使用的是内部 IP，可以节省 Real IP 的开销。但因为执行 NAT 需要重写流经 Director 的数据包，在速度上有一定延迟；

当用户的请求非常短，而服务器的回应非常大的情况下，会对 Director 形成很大压力，成为新的瓶颈，从而使整个系统的性能受到限制。

#### LVS/TUN 方式的负载均衡集群

TUN 是指 IP Tunneling，它的转发流程是：Director 机器收到外界请求，按相应的调度算法,通过 IP 隧道发送到相应 Real Server，Real Server 处理完该请求后，将结果数据包直接返回给客户。至此完成一次负载调度。

最简单的 LVS/TUN 方式的负载均衡集群架构使用 IP Tunneling 技术，在 Director 机器和 Real Server 机器之间架设一个 IP Tunnel，通过 IP Tunnel 将负载分配到 Real Server 机器上。Director 和 Real Server 之间的关系比较松散，可以是在同一个网络中，也可以是在不同的网络中，只要两者能够通过 IP Tunnel 相连就行。收到负载分配的 Real Server 机器处理完后会直接将反馈数据送回给客户，而不必通过 Director 机器。实际应用中，服务器必须拥有正式的 IP 地址用于与客户机直接通信，并且所有服务器必须支持 IP 隧道协议。

该方式中 Director 将客户请求分配到不同的 Real Server，Real Server 处理请求后直接回应给用户，这样 Director 就只处理客户机与服务器的一半连接，极大地提高了 Director 的调度处理能力，使集群系统能容纳更多的节点数。另外 TUN 方式中的 Real Server 可以在任何 LAN 或 WAN 上运行，这样可以构筑跨地域的集群，其应对灾难的能力也更强，但是服务器需要为 IP 封装付出一定的资源开销，而且后端的 Real Server 必须是支持 IP Tunneling 的操作系统。

#### LVS/TUN 方式的负载均衡集群

DR 是指 Direct Routing，它的转发流程是：Director 机器收到外界请求，按相应的调度算法将其直接发送到相应 Real Server，Real Server 处理完该请求后，将结果数据包直接返回给客户，完成一次负载调度。

构架一个最简单的 LVS/DR 方式的负载均衡集群 Real Server 和 Director 都在同一个物理网段中，Director 的网卡 IP 是 192.168.0.253，再绑定另一个 IP： 192.168.0.254 作为对外界的 virtual IP，外界客户通过该 IP 来访问整个集群系统。Real Server 在 lo 上绑定 IP：192.168.0.254，同时加入相应的路由。

LVS/DR 方式与前面的 LVS/TUN 方式有些类似，前台的 Director 机器也是只需要接收和调度外界的请求，而不需要负责返回这些请求的反馈结果，所以能够负载更多的 Real Server，提高 Director 的调度处理能力，使集群系统容纳更多的 Real Server。但 LVS/DR 需要改写请求报文的 MAC 地址，所以所有服务器必须在同一物理网段内。

### LVS 架构

LVS 架设的服务器集群系统有三个部分组成：最前端的负载均衡层（Loader Balancer），中间的服务器群组层，用 Server Array 表示，最底层的数据共享存储层，用 Shared Storage 表示。在用户看来所有的应用都是透明的，用户只是在使用一个虚拟服务器提供的高性能服务。

LVS 的体系架构如图：

<div align="center"><img src="https://images2015.cnblogs.com/blog/820332/201512/820332-20151227220009109-1768809526.png"/></div>

LVS 的各个层次的详细介绍：

Load Balancer 层：位于整个集群系统的最前端，有一台或者多台负载调度器（Director Server）组成，LVS 模块就安装在 Director Server 上，而 Director 的主要作用类似于一个路由器，它含有完成 LVS 功能所设定的路由表，通过这些路由表把用户的请求分发给 Server Array 层的应用服务器（Real Server）上。同时，在 Director Server 上还要安装对 Real Server 服务的监控模块 Ldirectord，此模块用于监测各个 Real Server 服务的健康状况。在 Real Server 不可用时把它从 LVS 路由表中剔除，恢复时重新加入。

Server Array 层：由一组实际运行应用服务的机器组成，Real Server 可以是 WEB 服务器、MAIL 服务器、FTP 服务器、DNS 服务器、视频服务器中的一个或者多个，每个 Real Server 之间通过高速的 LAN 或分布在各地的 WAN 相连接。在实际的应用中，Director Server 也可以同时兼任 Real Server 的角色。

Shared Storage 层：是为所有 Real Server 提供共享存储空间和内容一致性的存储区域，在物理上，一般有磁盘阵列设备组成，为了提供内容的一致性，一般可以通过 NFS 网络文件系统共享数 据，但是 NFS 在繁忙的业务系统中，性能并不是很好，此时可以采用集群文件系统，例如 Red hat 的 GFS 文件系统，oracle 提供的 OCFS2 文件系统等。

从整个 LVS 结构可以看出，Director Server 是整个 LVS 的核心，目前，用于 Director Server 的操作系统只能是 Linux 和 FreeBSD，linux2.6 内核不用任何设置就可以支持 LVS 功能，而 FreeBSD 作为 Director Server 的应用还不是很多，性能也不是很好。对于 Real Server，几乎可以是所有的系统平台，Linux、windows、Solaris、AIX、BSD 系列都能很好的支持。

### LVS 均衡策略

LVS 默认支持八种负载均衡策略，简述如下：

#### 轮询调度（Round Robin）

调度器通过“轮询”调度算法将外部请求按顺序轮流分配到集群中的真实服务器上，它均等地对待每一台服务器，而不管服务器上实际的连接数和系统负载。

#### 加权轮询（Weighted Round Robin）

调度器通过“加权轮询”调度算法根据真实服务器的不同处理能力来调度访问请求。这样可以保证处理能力强的服务器能处理更多的访问流量。调度器可以自动问询真实服务器的负载情况，并动态地调整其权值。

#### 最少链接（Least Connections）

调度器通过“最少连接”调度算法动态地将网络请求调度到已建立的链接数最少的服务器上。如果集群系统的真实服务器具有相近的系统性能，采用“最小连接”调度算法可以较好地均衡负载。

#### 加权最少链接（Weighted Least Connections）

在集群系统中的服务器性能差异较大的情况下，调度器采用“加权最少链接”调度算法优化负载均衡性能，具有较高权值的服务器将承受较大比例的活动连接负载。调度器可以自动问询真实服务器的负载情况，并动态地调整其权值。

#### 基于局部性的最少链接（Locality-Based Least Connections）

“基于局部性的最少链接”调度算法是针对目标 IP 地址的负载均衡，目前主要用于 Cache 集群系统。该算法根据请求的目标 IP 地址找出该目标 IP 地址最近使用的服务器，若该服务器是可用的且没有超载，将请求发送到该服务器；若服务器不存在，或者该服务器超载且有服务器处于一半的工作负载，则用“最少链接” 的原则选出一个可用的服务器，将请求发送到该服务器。

#### 带复制的基于局部性最少链接（Locality-Based Least Connections with Replication）

“带复制的基于局部性最少链接”调度算法也是针对目标 IP 地址的负载均衡，目前主要用于 Cache 集群系统。它与 LBLC 算法的不同之处是它要维护从一个目标 IP 地址到一组服务器的映射，而 LBLC 算法维护从一个目标 IP 地址到一台服务器的映射。该算法根据请求的目标 IP 地址找出该目标 IP 地址对应的服务器组，按“最小连接”原则从服务器组中选出一台服务器，若服务器没有超载，将请求发送到该服务器；若服务器超载，则按“最小连接”原则从这个集群中选出一台服务器，将该服务器加入到服务器组中，将请求发送到该服务器。同时，当该服务器组有一段时间没有被修改，将最忙的服务器从服务器组中删除，以降低复制的程度。

#### 目标地址散列（Destination Hashing）

“目标地址散列”调度算法根据请求的目标 IP 地址，作为散列键（Hash Key）从静态分配的散列表找出对应的服务器，若该服务器是可用的且未超载，将请求发送到该服务器，否则返回空。

#### 源地址散列（Source Hashing）

“源地址散列”调度算法根据请求的源 IP 地址，作为散列键（Hash Key）从静态分配的散列表找出对应的服务器，若该服务器是可用的且未超载，将请求发送到该服务器，否则返回空。

除具备以上负载均衡算法外，还可以自定义均衡策略。

### LVS 场景

一般作为入口负载均衡或内部负载均衡，结合反向代理服务器使用。相关架构可参考 Ngnix 场景架构。

## HaProxy 负载均衡

HAProxy 也是使用较多的一款负载均衡软件。HAProxy 提供高可用性、负载均衡以及基于 TCP 和 HTTP 应用的代理，支持虚拟主机，是免费、快速并且可靠的一种解决方案。特别适用于那些负载特大的 web 站点。运行模式使得它可以很简单安全的整合到当前的架构中，同时可以保护你的 web 服务器不被暴露到网络上。

### HaProxy 特点

- 支持两种代理模式：TCP（四层）和 HTTP（七层），支持虚拟主机；
- 配置简单，支持 url 检测后端服务器状态；
- 做负载均衡软件使用，在高并发情况下，处理速度高于 nginx；
- TCP 层多用于 Mysql 从（读）服务器负载均衡。 （对 Mysql 进行负载均衡，对后端的 DB 节点进行检测和负载均衡）
- 能够补充 Nginx 的一些缺点比如 Session 的保持，Cookie 引导等工作

### HaProxy 均衡策略

支持四种常用算法：

- roundrobin：轮询，轮流分配到后端服务器；
- static-rr：根据后端服务器性能分配；
- leastconn：最小连接者优先处理；
- source：根据请求源 IP，与 Nginx 的 IP_Hash 类似。

## 资料

- [大型网站架构系列：负载均衡详解（1）](https://www.cnblogs.com/itfly8/p/5043435.html)
- [大型网站架构系列：负载均衡详解（2）](https://www.cnblogs.com/itfly8/p/5043452.html)
- [大型网站架构系列：负载均衡详解（3）](https://www.cnblogs.com/itfly8/p/5080743.html)
- [大型网站架构系列：负载均衡详解（4）](https://www.cnblogs.com/itfly8/p/5080988.html)
- https://segmentfault.com/a/1190000004492447
