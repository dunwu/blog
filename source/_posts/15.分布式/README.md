---
title: 分布式
date: 2019-03-08 13:16:53
categories:
  - 分布式
tags:
  - 分布式
permalink: /pages/5bfcdcbe/
hidden: true
index: false
---

# 分布式

> 大型软件为了应对海量数据、高并发，一般都会被设计为分布式系统。
>
> 分布式系统需要解决很多不同领域的问题。

## 📖 内容

### [分布式综合](00.分布式综合)

- [逻辑时钟](00.分布式综合/逻辑时钟.md) - 关键词：`逻辑时钟`、`向量时钟`、`版本时钟`、`全序`、`偏序`
- [CAP 和 BASE](00.分布式综合/CAP&BASE.md) - 关键词：`ACID`、`CAP`、`BASE`、`一致性`
- [拜占庭将军问题](00.分布式综合/拜占庭将军问题.md) - 关键词：`共识`
- [分布式算法 Paxos](00.分布式综合/Paxos.md) - 关键词：`共识`、`Paxos`
- [分布式算法 Raft](00.分布式综合/Raft.md) - 关键词：`共识`、`Raft`
- [分布式算法 Gossip](00.分布式综合/Gossip.md) - 关键词：`Gossip`
- [ZAB 协议](00.分布式综合/Zab.md) - 关键词：`共识`、`ZAB`、`ZooKeeper`
- [分布式综合面试](00.分布式综合/分布式综合面试.md)

### [分布式协同](11.分布式协同)

- **分布式协同综合**
  - [分布式复制](11.分布式协同/01.分布式协同综合/分布式复制.md) - 关键词：`主从`、`多主`、`无主`
  - [分布式分区](11.分布式协同/01.分布式协同综合/分布式分区.md) - 关键词：`分区再均衡`、`路由`
  - [分布式共识](11.分布式协同/01.分布式协同综合/分布式共识.md) - 关键词：`共识`、`广播`、`epoch`、`quorum`
  - [分布式事务](11.分布式协同/01.分布式协同综合/分布式事务.md) - 关键词：`2PC`、`3PC`、`TCC`、`本地消息表`、`消息事务`、`SAGA`
  - [分布式锁](11.分布式协同/01.分布式协同综合/分布式锁.md) - 关键词：`互斥`、`可重入`、`死锁`、`容错`、`自旋尝试`、`公平性`
  - [分布式 ID](11.分布式协同/01.分布式协同综合/分布式ID.md) - 关键词：`UUID`、`自增序列`、`雪花算法`、`Leaf`
- **ZooKeeper**
  - [ZooKeeper 原理](11.分布式协同/02.ZooKeeper/01.ZooKeeper原理.md)
  - [ZooKeeper Java Api](11.分布式协同/02.ZooKeeper/02.ZooKeeperJavaApi.md)
  - [ZooKeeper 命令](11.分布式协同/02.ZooKeeper/03.ZooKeeper命令.md)
  - [ZooKeeper 运维](11.分布式协同/02.ZooKeeper/04.ZooKeeper运维.md)
  - [ZooKeeper Acl](11.分布式协同/02.ZooKeeper/05.ZooKeeperAcl.md)

### [分布式调度](12.分布式调度)

- [服务注册和发现](12.分布式调度/服务注册和发现.md) - 关键词：`服务注册`、`服务发现`、`元数据`
- [负载均衡](12.分布式调度/负载均衡.md) - 关键词：`轮询`、`随机`、`最少连接`、`源地址哈希`、`一致性哈希`、`虚拟 hash 槽`
- [流量控制](12.分布式调度/流量控制.md) - 关键词：`限流`、`熔断`、`降级`、`计数器法`、`时间窗口法`、`令牌桶法`、`漏桶法`
- [路由和网关](12.分布式调度/网关路由.md) - 关键词：`路由`、`条件路由`、`脚本路由`、`标签路由`

### 分布式高可用

- [服务容错](11.分布式协同/01.分布式协同综合/服务容错.md)

### [分布式通信](21.分布式通信)

#### [RPC](21.分布式通信/01.RPC)

- [Dubbo 面试](21.分布式通信/01.RPC/Dubbo面试.md)
- [RPC 面试](21.分布式通信/01.RPC/RPC面试.md)

#### [MQ](21.分布式通信/02.MQ)

##### [MQ 综合](21.分布式通信/02.MQ/00.MQ综合)

- [MQ 面试](21.分布式通信/02.MQ/00.MQ综合/MQ面试.md)

##### [Kafka](21.分布式通信/02.MQ/01.Kafka)

- [Kafka 快速入门](21.分布式通信/02.MQ/01.Kafka/Kafka快速入门.md)
- [Kafka 生产](21.分布式通信/02.MQ/01.Kafka/Kafka生产.md)
- [Kafka 消费](21.分布式通信/02.MQ/01.Kafka/Kafka消费.md)
- [Kafka 集群](21.分布式通信/02.MQ/01.Kafka/Kafka集群.md)
- [Kafka 可靠传输](21.分布式通信/02.MQ/01.Kafka/Kafka可靠传输.md)
- [Kafka 存储](21.分布式通信/02.MQ/01.Kafka/Kafka存储.md)
- [Kafka 流式处理](21.分布式通信/02.MQ/01.Kafka/Kafka流式处理.md)
- [Kafka 运维](21.分布式通信/02.MQ/01.Kafka/Kafka运维.md)

##### [RocketMQ](21.分布式通信/02.MQ/02.RocketMQ)

- [RocketMQ 快速入门](21.分布式通信/02.MQ/02.RocketMQ/RocketMQ快速入门.md)
- [RocketMQ 基本原理](21.分布式通信/02.MQ/02.RocketMQ/RocketMQ基本原理.md)
- [RocketMQ Faq](21.分布式通信/02.MQ/02.RocketMQ/RocketMQFaq.md)

##### 其他 MQ

- [ActiveMQ](21.分布式通信/02.MQ/99.其他MQ/ActiveMQ.md)

### [分布式存储](22.分布式存储)

- [分布式缓存](22.分布式存储/分布式缓存.md) - 关键词：`进程内缓存`、`分布式缓存`、`缓存雪崩`、`缓存穿透`、`缓存击穿`、`缓存更新`、`缓存预热`、`缓存降级`
- [读写分离](22.分布式存储/读写分离.md)
- [分库分表](22.分布式存储/分库分表.md) - 关键词：`分片`、`路由`、`迁移`、`扩容`、`双写`、`聚合`

## 📚 资料

### 分布式理论资料

#### 分布式理论综合资料

- **教程**
  - [**MIT-6.824**](https://pdos.csail.mit.edu/6.824/index.html) - 麻省理工分布式系统课程
  - [**CMU-15-440**](http://www.cs.cmu.edu/~dga/15-440/S14/) - 卡内基梅隆分布式系统课程
  - [**Standford-CS244b**](https://www.scs.stanford.edu/14au-cs244b/) - 斯坦福分布式系统课程
  - [**UC Berkley-CS294-91**](https://people.eecs.berkeley.edu/~alig/cs294-91/)- 伯克利分布式计算课程
  - [**分布式技术原理与算法解析**](https://time.geekbang.org/column/intro/100036401) - 极客时间教程
  - [**分布式协议与算法实战**](https://time.geekbang.org/column/intro/100046101) - 极客时间教程
- **书籍**
  - [**分布式系统原理与范型**](https://book.douban.com/subject/11691266/)：书原名 Distributed Systems Principles and Paradigms。经典分布式教程，介绍了分布式系统的七大核心原理，并给出了大量的例子；系统讲述了分布式系统的概念和技术，包括通信、进程、命名、同步化、一致性和复制、容错以及安全等。
- **文章**
  - [**Solution of a Problem in Concurrent Programming Control**](https://dl.acm.org/doi/pdf/10.1145/365559.365617)，[**译文**](http://duanple.com/?p=1022) - Dijkstra 首次提出并解决了互斥执行问题
  - [**Time, Clocks, and the Ordering of Events in a Distributed System**](https://lamport.azurewebsites.net/pubs/time-clocks.pdf)，[**译文**](https://cloud.tencent.com/developer/article/1163428)，[**解读**](https://zhuanlan.zhihu.com/p/56146800) - Lamport 介绍 happened before、偏序关系（partial ordering）、逻辑时钟（Logical Clocks）概念，提出解决分布式系统中区分事件发生的时序问题的方法。
  - [**Virtual Time and Global States of Distributed Systems**](http://courses.csail.mit.edu/6.852/01/papers/VirtTime_GlobState.pdf)，[**解读**](https://zhuanlan.zhihu.com/p/56886156) - 逻辑时钟无法描述事件的因果关系。本文提出了向量时钟，这种算法利用了向量这种数据结构将全局各个进程的逻辑时间戳广播给各个进程，通过向量时间戳就能够比较任意两个事件的因果关系。
  - [**Brewer’s Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services**](https://www.comp.nus.edu.sg/~gilbert/pubs/BrewersConjecture-SigAct.pdf)，[**解读**](https://juejin.cn/post/6844903936718012430) - 经典的 CAP 理论，即：在一个分布式系统中，当发生网络分区时，那么强一致性和可用性只能二选一。
  - [**CAP Twelve Years Later: How the “Rules” Have Changed**](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/) - CAP 理论的新解读，并阐述 CAP 理论的一些常见误区。
  - [**BASE: An Acid Alternative**](https://www.semanticscholar.org/paper/BASE%3A-An-Acid-Alternative-Pritchett/2e72e6c022dd33115304ecfcb6dad7ea609534a4)，[**译文**](https://www.cnblogs.com/savorboard/p/base-an-acid-alternative.html) - BASE 理论是对 CAP 中一致性和可用性的权衡，提出采用适当的方式来使系统达到最终一致性。
  - [**A Simple Totally Ordered Broadcast Protocol**](https://diyhpl.us/~bryan/papers2/distributed/distributed-systems/zab.totally-ordered-broadcast-protocol.2008.pdf) - 概述 ZooKeeper 的全序广播协议（Zab）
  - [**The Eight Fallacies of Distributed Computing - Tech Talk**](https://web.archive.org/web/20171107014323/http://blog.fogcreek.com/eight-fallacies-of-distributed-computing-tech-talk/) - 分布式系统新手常犯的 8 个错误，并探讨了其会带来的影响。
  - [**Distributed Systems for Fun and Profit**](http://book.mixu.net/distsys/) - 一本学习小册，涵盖了分布式系统中的关键问题，包括时间的作用和不同的复制策略。
  - [**A Note on Distributed System**s](https://scholar.harvard.edu/files/waldo/files/waldo-94.pdf) - 这是一篇经典的论文，讲述了为什么在分布式系统中，远程交互不能像本地对象那样进行。
  - [**深度探索分布式理论经典论文**](https://zhuanlan.zhihu.com/p/338161857) - 分布式理论论文的导读文章
  - [**Distributed Systems for fun and profit**](http://book.mixu.net/distsys/single-page.html)：分为五章，讲述了扩展性、可用性、性能和容错等基础知识，FLP 不可能性和 CAP 定理，探讨了大量的一致性模型；讨论了时间和顺序，及时钟的各种用法。随后，探讨了复制问题，如何防止差异，以及如何接受差异。此外，每章末尾都给出了针对本章内容的扩展阅读资源列表，这些资料是对本书内容的很好补充。
  - [**An introduction to distributed systems**](https://github.com/aphyr/distsys-class) - 这是一份分布式系统的提纲挈领的介绍，几乎涵盖了所有知识点，并辅以简洁并切中要害的说明文字，适合初学者了解知识全貌，快速与现有知识结合，形成知识体系。

#### 分布式算法资料

- **视频**
  - [**拜占庭将军问题视频讲解**](https://www.bilibili.com/video/av78588312/) - 李永乐老师通俗讲解拜占庭问题
  - [**Paxos 算法讲解视频**](https://www.youtube.com/watch?v=d7nAGI_NZPk)
  - [**Raft 作者讲解 Paxos 视频**](https://www.bilibili.com/video/av36556594)
  - [**Raft 作者讲解视频**](https://www.youtube.com/watch?v=YbZ3zDzDnrw&feature=youtu.be)
  - [**Raft 作者讲解视频对应的 PPT**](http://www2.cs.uh.edu/~paris/6360/PowerPoint/Raft.ppt)
  - [**一致性算法（Paxos、Raft、Zab）**](https://www.bilibili.com/video/BV1TW411M7Fx?from=search&seid=11524608198747599965)
- **动画**
  - [**Raft: Understandable Distributed Consensus**](http://thesecretlivesofdata.com/raft) - 分布式一致性算法 Raft 的动画教程
  - [**The Raft Consensus Algorithm**](https://raft.github.io/) - 分布式一致性算法 Raft 的交互式动画教程
  - [**Goosip 协议仿真动画**](https://flopezluis.github.io/gossip-simulator/)
- **文章**
  - [**The Byzantine Generals Problem**](https://lamport.azurewebsites.net/pubs/byz.pdf) - Lamport 提出拜占庭将军问题——一种解决分布式系统一致性问题的理论。
  - [**The Part-Time Parliament**](https://lamport.azurewebsites.net/pubs/lamport-paxos.pdf) - Lamport 提出分布式一致性算法 Paxos。
  - [**Paxos Made Simple**](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf)，[**译文**](http://duanple.com/?p=166)，[**解读**](https://zhuanlan.zhihu.com/p/31780743) - Lamport 重新阐述 Paxos。
  - [**Paxos Made Live: An Engineering Perspective**](https://www.cs.utexas.edu/users/lorenzo/corsi/cs380d/papers/paper2-1.pdf)，[**译文**](https://blog.mrcroxx.com/posts/paper-reading/paxos-made-live/) - 讲述了 Google 在最初实现 Paxos 碰到的一系列问题及解决方案。
  - [**How to Build a Highly Availability System using Consensus**](http://bwl-website.s3-website.us-east-2.amazonaws.com/58-Consensus/Acrobat.pdf)，[**译文**](http://duanple.com/?p=63) - 以 Paxos 为实例，讲述了如何描述、解决、理解、证明分布式算法。
  - [**Using Paxos to Build a Scalable, Consistent, and Highly Available Datastore**](https://arxiv.org/pdf/1103.2408) - 讲述了 LinkedIn 是如何利用 Paxos 和 ZooKeeper 构建一个名为 Spinnaker 的 KV 数据库。
  - [**Raft: In Search of an Understandable Consensus Algorithm**](https://ramcloud.atlassian.net/wiki/download/attachments/6586375/raft.pdf)，[**译文**](https://github.com/maemual/raft-zh_cn/blob/master/raft-zh_cn.md)，[**解读**](https://zhuanlan.zhihu.com/p/32052223) - 分布式一致性算法 Raft
  - [**A Brief History of Consensus, 2PC and Transaction Commit**](https://betathoughts.blogspot.com/2007/06/brief-history-of-consensus-2pc-and.html) - 一致性, 两阶段提交和事务提交的发展史
  - [**Consensus in the Presence of Partial Synchrony**](https://dl.acm.org/doi/pdf/10.1145/42282.42283) - 部分同步的一致性
  - [**Epidemic Algorithms for Replicated Database Maintenance**](http://bitsavers.trailing-edge.com/pdf/xerox/parc/techReports/CSL-89-1_Epidemic_Algorithms_for_Replicated_Database_Maintenance.pdf)，[**解读**](https://zhuanlan.zhihu.com/p/41228196) - 论文提出 Gossip 协议及应用
  - [**INTRODUCTION TO GOSSIP**](https://managementfromscratch.wordpress.com/2016/04/01/introduction-to-gossip/) - Gossip 协议介绍
- **工具**
  - [sofa-jraft](https://github.com/sofastack/sofa-jraft) - 蚂蚁金服的 Raft 算法实现库（Java 版）

### 分布式通信资料

#### RPC 资料

- **教程**
  - [**极客时间教程 - RPC 实战与核心原理**](https://time.geekbang.org/column/intro/100046201)
- **官方**
  - [Dubbo Github](https://github.com/apache/dubbo)
  - [Dubbo 官方文档](https://dubbo.apache.org/zh-cn/)
- **文章**
  - [如何基于 Dubbo 进行服务治理、服务降级、失败重试以及超时重试？](https://github.com/doocs/advanced-java/blob/master/docs/distributed-system/dubbo-service-management.md)

#### MQ 资料

- **官方**
  - [Kafka 官网](http://kafka.apache.org/)
  - [Kafka Github](https://github.com/apache/kafka)
  - [Kafka 官方文档](https://kafka.apache.org/documentation/)
  - [Kafka Confluent 官网](http://kafka.apache.org/)
  - [Kafka Jira](https://issues.apache.org/jira/projects/KAFKA?selectedItem=com.atlassian.jira.jira-projects-plugin:components-page)
  - [RocketMQ Github](https://github.com/apache/rocketmq)
  - [RocketMQ 官方文档](http://rocketmq.apache.org/docs/quick-start/)
  - [ActiveMQ 官网](http://activemq.apache.org/)
- **书籍**
  - [《Kafka 权威指南》](https://book.douban.com/subject/27665114/)
  - [《深入理解 Kafka：核心设计与实践原理》](https://book.douban.com/subject/30437872/)
  - [《RocketMQ 技术内幕》](https://book.douban.com/subject/30417623/)
- **教程**
  - [**极客时间教程 - 消息队列高手课**](https://time.geekbang.org/column/intro/100032301)
  - [**Kafka 中文文档**](https://github.com/apachecn/kafka-doc-zh)
  - [**极客时间教程 - Kafka 核心技术与实战**](https://time.geekbang.org/column/intro/100029201)
  - [**极客时间教程 - Kafka 核心源码解读**](https://time.geekbang.org/column/intro/304)
- **视频**
  - [Apache Kafka Fundamentals You Should Know](https://www.youtube.com/watch?v=-RDyEFvnTXI)
  - [Top Kafka Use Cases You Should Know](https://www.youtube.com/watch?v=Ajz6dBp_EB4)
  - [System Design: Why is Kafka fast?](https://www.youtube.com/watch?v=UNUz1-msbOM)
  - [System Design: Why is Kafka so Popular?](https://www.youtube.com/watch?v=yIAcHMJzqJc)
- **文章**
  - [**The Log: What every software engineer should know about real-time data’s unifying abstraction**](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)，[**译文**](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)
  - [**Introduction and Overview of Apache Kafka**](https://www.slideshare.net/mumrah/kafka-talk-tri-hug) - Kafka 简介 PPT
  - [Why is Kafka so fast? How does it work?](https://blog.bytebytego.com/p/why-is-kafka-so-fast-how-does-it)
  - [大型网站架构系列：分布式 MQ（一）](https://www.cnblogs.com/itfly8/p/5155983.html)
  - [大型网站架构系列：MQ（二）](https://www.cnblogs.com/itfly8/p/5156155.html)
  - [阿里 RocketMQ 优势对比](https://juejin.im/entry/5a0abfb5f265da43062a4a91)
  - [advanced-java 之 MQ](https://github.com/doocs/advanced-java/blob/master/docs/high-concurrency/mq-interview.md)
  - [浅谈消息队列及常见的消息中间件](https://juejin.im/post/6844903635046924296)
  - [聊聊 Kafka： Kafka 为啥这么快？](https://xie.infoq.cn/article/49bc80d683c373db93d017a99)

### 分布式存储资料

- **书籍**
  - [**数据密集型应用系统设计**](https://book.douban.com/subject/30329536/) - 这可能是目前最好的分布式存储书籍，强力推荐【进阶】
- **文章**
  - Chord: A Scalable Peer-to-Peer Lookup Service for Internet Applications
  - Pastry: Scalable, Distributed Object Location, and Routing for Large-Scale Peerto-Peer Systems
  - Kademlia: A Peer-to-Peer Information System Based on the XOR Metric
  - A Scalable Content-Addressable Network
  - Ceph: A Scalable, High-Performance Distributed File System
  - [**The Log-Structured-Merge-Tree**](https://www.cs.umb.edu/~poneil/lsmtree.pdf)，[**译文**](https://cloud.tencent.com/developer/article/2057367) - LSM 树被广泛应用于 HBase、RocksDB 等 Nosql 数据库。这篇论文详细介绍了 LSM 树的特性和原理。
  - [**HBase: A NoSQL Database**](https://www.researchgate.net/publication/317399857_HBase_A_NoSQL_Database)
  - Tango: Distributed Data Structure over a Shared Log

### 分布式系统架构资料

- [**The Google File System**](https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf) - Google 三驾马车之 GFS
- [**Bigtable: A Distributed Storage System for Structured Data**](https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf) - Google 三驾马车之 BigTable
- [**MapReduce: Simplifed Data Processing on Large Clusters**](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf) - Google 三驾马车之 MapReduce
- The Chubby Lock Service for Loosely-Coupled Distributed Systems
- Finding a Needle in Haystack: Facebook’s Photo Storage
- Windows Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency
- Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing
- Scaling Distributed Machine Learning with the Parameter Server
- Dremel: Interactive Analysis of Web-Scale Datasets
- Pregel: A System for Large-Scale Graph Processing
- Spanner: Google’s Globally-Distributed Database
- Dynamo: Amazon’s Highly Available Key-value Store
- S4: Distributed Stream Computing Platform
- Storm @Twitter
- Large-scale Cluster Management at Google with Borg
- F1 - The Fault-Tolerant Distributed RDBMS Supporting Google’s Ad Business
- Cassandra: A Decentralized Structured Storage System
- MegaStore: Providing Scalable, Highly Available Storage for Interactive Services
- Dapper, a Large-Scale Distributed Systems Tracing Infrastructure
- Kafka: A distributed Messaging System for Log Processing
- Amazon Aurora: Design Considerations for High Throughput Cloud-Native Relational Databases

## 🚪 传送

◾ 💧 [钝悟的 IT 知识图谱](https://dunwu.github.io/waterdrop/) ◾
