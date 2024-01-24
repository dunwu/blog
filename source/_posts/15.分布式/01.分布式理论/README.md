---
title: 分布式理论
date: 2022-06-23 17:17:18
categories:
  - 分布式
  - 分布式理论
tags:
  - 分布式
  - 理论
permalink: /pages/86cdf2/
hidden: true
index: false
---

# 分布式理论

## 📖 内容

- [分布式理论](01.分布式基础理论.md) - 关键词：`拜占庭将军`、`错误的分布式假设`
- [分布式一致性](02.分布式一致性.md) - 关键词：`ACID`、`CAP`、`BASE`、`强一致性`、`最终一致性`
- [拜占庭将军问题](10.拜占庭将军问题.md) - 关键词：`共识性`
- [Paxos 算法](11.Paxos算法.md) - 关键词：`共识性`
- [Raft 算法](12.Raft算法.md) - 关键词：`共识性`
- [Gossip 算法](13.Gossip算法.md) - 关键词：`数据传播`
- QuorumNWR 算法
- ZAB 协议

## 📚 资料

### 分布式理论

- [The Google File System](https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf)：Google 三大经典论文之一
- [Bigtable: A Distributed Storage System for Structured Data](https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf)：Google 三大经典论文之一
- [MapReduce: Simplifed Data Processing on Large Clusters](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf)：Google 三大经典论文之一
- [分布式系统原理与范型](https://book.douban.com/subject/11691266/)：书原名 Distributed Systems Principles and Paradigms。经典分布式教程，介绍了分布式系统的七大核心原理，并给出了大量的例子；系统讲述了分布式系统的概念和技术，包括通信、进程、命名、同步化、一致性和复制、容错以及安全等。
- [The Eight Fallacies of Distributed Computing - Tech Talk](https://web.archive.org/web/20171107014323/http://blog.fogcreek.com/eight-fallacies-of-distributed-computing-tech-talk/) - 分布式系统新手常犯的 8 个错误，并探讨了其会带来的影响。
- [Distributed Systems for Fun and Profit](http://book.mixu.net/distsys/) - 一本学习小册，涵盖了分布式系统中的关键问题，包括时间的作用和不同的复制策略。
- [A Note on Distributed Systems](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.41.7628&rep=rep1&type=pdf) - 这是一篇经典的论文，讲述了为什么在分布式系统中，远程交互不能像本地对象那样进行。
- [Amazon’s Highly Available Key-value Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
- [CAP Theorem](https://cryptographics.info/cryptographics/blockchain/cap-theorem/)
- [CAP twelve years later: How the "rules" have changed](https://www.semanticscholar.org/paper/CAP-twelve-years-later%3A-How-the-%22rules%22-have-Brewer/c9c73f5a1668b8bf12aae2efb6ac5a5a2c34002a)
- [CAP 定理的含义](https://www.ruanyifeng.com/blog/2018/07/cap.html) - by 阮一峰
- [神一样的 CAP 理论被应用在何方](https://juejin.im/post/5d720e86f265da03cc08de74)
- [BASE: An Acid Alternative](https://queue.acm.org/detail.cfm?id=1394128)

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
  - [Raft 算法论文原文](https://ramcloud.atlassian.net/wiki/download/attachments/6586375/raft.pdf)
  - [Raft 算法论文译文](https://github.com/maemual/raft-zh_cn/blob/master/raft-zh_cn.md)
  - [Raft 作者讲解视频](https://www.youtube.com/watch?v=YbZ3zDzDnrw&feature=youtu.be)
  - [Raft 作者讲解视频对应的 PPT](http://www2.cs.uh.edu/~paris/6360/PowerPoint/Raft.ppt)
  - [Raft 算法详解](https://zhuanlan.zhihu.com/p/32052223)
  - [Raft: Understandable Distributed Consensus](http://thesecretlivesofdata.com/raft) - 一个动画教程
  - [The Raft Consensus Algorithm](https://raft.github.io/) - 一个交互式动画教程
- **Goosip**
  - [Epidemic Algorithms for Replicated Database Maintenance](http://bitsavers.trailing-edge.com/pdf/xerox/parc/techReports/CSL-89-1_Epidemic_Algorithms_for_Replicated_Database_Maintenance.pdf)
  - [P2P 网络核心技术：Gossip 协议](https://zhuanlan.zhihu.com/p/41228196)
  - [INTRODUCTION TO GOSSIP](https://managementfromscratch.wordpress.com/2016/04/01/introduction-to-gossip/)
  - [Goosip 协议仿真动画](https://flopezluis.github.io/gossip-simulator/)

## 🚪 传送

◾ 💧 [钝悟的 IT 知识图谱](https://dunwu.github.io/waterdrop/) ◾