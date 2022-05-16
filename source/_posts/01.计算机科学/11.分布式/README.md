---
title: 分布式
date: 2019-03-08 13:16:53
categories:
  - 计算机科学
  - 分布式
tags:
  - 分布式
permalink: /pages/f21e8c/
abbrlink: fe3c2cd2
hidden: true
---

# 分布式

> 大型软件为了应对海量数据、高并发，一般都会被设计为分布式系统。
>
> 分布式系统需要解决很多不同领域的问题。

## 📖 内容

### 分布式综合

- [分布式面试总结](01.分布式综合/01.分布式面试.md)

### 分布式理论

- [分布式理论](02.分布式理论/01.分布式理论.md) - 关键词：`拜占庭将军`、`CAP`、`BASE`、`错误的分布式假设`
- [分布式算法 Paxos](02.分布式理论/02.分布式算法Paxos.md) - 关键词：`共识性算法`
- [分布式算法 Raft](02.分布式理论/03.分布式算法Raft.md) - 关键词：`共识性算法`
- [分布式算法 Gossip](02.分布式理论/04.分布式算法Gossip.md) - 关键词：`数据传播`

### 分布式关键技术

- 集群
- 复制
- 分区
- 选主

#### 流量调度

- [流量控制](03.分布式关键技术/01.流量调度/01.流量控制.md) - 关键词：`限流`、`熔断`、`降级`、`计数器法`、`时间窗口法`、`令牌桶法`、`漏桶法`
- [负载均衡](03.分布式关键技术/01.流量调度/02.负载均衡.md) - 关键词：`轮询`、`随机`、`最少连接`、`源地址哈希`、`一致性哈希`、`虚拟 hash 槽`
- [服务路由](03.分布式关键技术/01.流量调度/03.服务路由.md) - 关键词：`路由`、`条件路由`、`脚本路由`、`标签路由`
- 服务网关
- [分布式会话](03.分布式关键技术/01.流量调度/10.分布式会话.md) - 关键词：`粘性 Session`、`Session 复制共享`、`基于缓存的 session 共享`

#### 数据调度

- [数据缓存](03.分布式关键技术/02.数据调度/01.数据缓存.md) - 关键词：`进程内缓存`、`分布式缓存`、`缓存雪崩`、`缓存穿透`、`缓存击穿`、`缓存更新`、`缓存预热`、`缓存降级`
- [读写分离](03.分布式关键技术/02.数据调度/02.读写分离.md)
- [分库分表](03.分布式关键技术/02.数据调度/03.分库分表.md) - 关键词：`分片`、`路由`、`迁移`、`扩容`、`双写`、`聚合`
- [分布式 ID](03.分布式关键技术/02.数据调度/04.分布式ID.md) - 关键词：`UUID`、`自增序列`、`雪花算法`、`Leaf`
- [分布式事务](03.分布式关键技术/02.数据调度/05.分布式事务.md) - 关键词：`2PC`、`3PC`、`TCC`、`本地消息表`、`MQ 消息`、`SAGA`
- [分布式锁](03.分布式关键技术/02.数据调度/06.分布式锁.md) - 关键词：`数据库`、`Redis`、`ZooKeeper`、`互斥`、`可重入`、`死锁`、`容错`、`自旋尝试`

#### 资源调度

- 弹性伸缩

#### 通信

- [消息队列](03.分布式关键技术/04.通信/01.消息队列.md) - 关键词：`重复消费`、`消息丢失`、`消息顺序性`、`消息积压`

#### 服务治理

- [服务注册和发现](03.分布式关键技术/05.服务治理/01.服务注册和发现.md)
- [服务监控](03.分布式关键技术/05.服务治理/02.服务监控.md)
- [服务链路监控](03.分布式关键技术/05.服务治理/03.服务链路监控.md)
- [服务容错](03.分布式关键技术/05.服务治理/04.服务容错.md)
- 服务编排
- 服务版本管理
- 流量调度
  - [流量控制](03.分布式关键技术/01.流量调度/01.流量控制.md) - 关键词：`限流`、`熔断`、`降级`、`计数器法`、`时间窗口法`、`令牌桶法`、`漏桶法`
  - [负载均衡](03.分布式关键技术/01.流量调度/02.负载均衡.md) - 关键词：`轮询`、`随机`、`最少连接`、`源地址哈希`、`一致性哈希`、`虚拟 hash 槽`
  - [服务路由](03.分布式关键技术/01.流量调度/03.服务路由.md) - 关键词：`路由`、`条件路由`、`脚本路由`、`标签路由`
  - 服务网关

## 📚 资料

### 分布式理论

- [The Google File System](https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf)：Google 三大经典论文之一
- [Bigtable: A Distributed Storage System for Structured Data](https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf)：Google 三大经典论文之一
- [MapReduce: Simplifed Data Processing on Large Clusters](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf)：Google 三大经典论文之一
- [分布式系统原理与范型](https://book.douban.com/subject/11691266/)：书原名 Distributed Systems Principles and Paradigms。经典分布式教程，介绍了分布式系统的七大核心原理，并给出了大量的例子；系统讲述了分布式系统的概念和技术，包括通信、进程、命名、同步化、一致性和复制、容错以及安全等。
- [The fallacies of distributed computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing)
- [Distributed Systems for fun and profit](http://book.mixu.net/distsys/single-page.html)：全书分为五章，讲述了扩展性、可用性、性能和容错等基础知识，FLP 不可能性和 CAP 定理，探讨了大量的一致性模型；讨论了时间和顺序，及时钟的各种用法。随后，探讨了复制问题，如何防止差异，以及如何接受差异。此外，每章末尾都给出了针对本章内容的扩展阅读资源列表，这些资料是对本书内容的很好补充。

### 分布式算法

- **Paxos**
  - [Part-time Parliament 论文](https://research.microsoft.com/en-us/um/people/lamport/pubs/lamport-paxos.pdf) - Lamport 的 Paxos 论文。这篇论文很权威，但较为晦涩难懂。
  - [Paxos Made Simple 论文](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf)
  - [Paxos 算法详解](https://zhuanlan.zhihu.com/p/31780743)
  - Neat Algorithms - Paxos
  - [Wiki - Paxos 算法](https://zh.wikipedia.org/w/index.php?title=Paxos%E7%AE%97%E6%B3%95)
  - [一致性算法（Paxos、Raft、Zab）](https://www.bilibili.com/video/BV1TW411M7Fx?from=search&seid=11524608198747599965)
  - [Raft 作者讲解 Paxos 视频](https://www.bilibili.com/video/av36556594)
  - [Paxos 算法讲解视频](https://www.youtube.com/watch?v=d7nAGI_NZPk)
- **Raft**
  - [Raft 一致性算法论文原文](https://ramcloud.atlassian.net/wiki/download/attachments/6586375/raft.pdf)
  - [Raft 一致性算法论文译文](https://github.com/maemual/raft-zh_cn/blob/master/raft-zh_cn.md)
  - [Raft 作者讲解视频](https://www.youtube.com/watch?v=YbZ3zDzDnrw&feature=youtu.be)
  - [Raft 作者讲解视频对应的 PPT](http://www2.cs.uh.edu/~paris/6360/PowerPoint/Raft.ppt)
  - [Raft 算法详解](https://zhuanlan.zhihu.com/p/32052223)
  - [Raft: Understandable Distributed Consensus](http://thesecretlivesofdata.com/raft) - 一个动画教程
  - [The Raft Consensus Algorithm](https://raft.github.io/) - 一个交互式动画教程

### 分布式架构

- [An introduction to distributed systems](https://github.com/aphyr/distsys-class) - 这是一份分布式系统的提纲挈领的介绍，几乎涵盖了所有知识点，并辅以简洁并切中要害的说明文字，适合初学者了解知识全貌，快速与现有知识结合，形成知识体系。

## 🚪 传送

◾ 💧 [我的IT知识图谱](https://dunwu.github.io/waterdrop/) ◾ 🎯 [我的博客](https://dunwu.github.io/blog/) ◾
