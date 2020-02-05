---
title: 系统原理
categories: ['分布式']
tags: ['分布式']
date: 2019-03-08 13:16:53
---

# 系统原理

> 系统原理旨在总结大型系统中常用的核心技术，这也架构设计的基石。

## 内容

- [系统原理面试题](system-theory-interview.md)
- [分布式基础理论](distributed-base-theory.md) - 关键词：拜占庭将军问题、CAP、BASE
- [分布式事务](distributed-transaction.md) - 关键词：2PC、TCC、本地消息表、MQ 消息、SAGA
- [负载均衡](load-balance-theory.md) - 关键词：轮询、随机、最少连接、源地址哈希、一致性哈希
- [缓存](cache-theory.md) - 关键词：进程内缓存、分布式缓存、缓存雪崩、缓存穿透、缓存击穿、缓存更新、缓存预热、缓存降级
- [消息队列](mq-theory.md) - 关键词：重复消费、消息丢失、消息顺序性、消息积压
- [分布式锁](distributed-lock-theory.md)
- [分布式会话](distributed-session-theory.md) - 关键词：粘性 Session、Session 复制共享、基于缓存的 session 共享
- [分布式存储](distributed-storage-theory.md)
- [分布式 ID](distributed-id-theory.md) - 关键词：UUID、自增序列、雪花算法、Leaf
- [分库分表](sharding-theory.md)
- RPC

## 学习资料

- **书籍**
  - [大型网站技术架构：核心原理与案例分析](https://item.jd.com/11322972.html) - 浅显易懂的将解大型网站架构演进之路；简介了大型系统所面临的挑战以及核心技术点。
  - [大型网站系统与 Java 中间件实践](https://item.jd.com/11449803.html)
  - [亿级流量网站架构核心技术：跟开涛学搭建高可用高并发系统](https://item.jd.com/12153914.html)
  - [企业 IT 架构转型之道：阿里巴巴中台战略思想与架构实战](https://item.jd.com/12176278.html) - 阐述阿里巴巴中台系统发展，更多的是讲解应用场景和能力，没有讲解技术细节。
  - [逆流而上：阿里巴巴技术成长之路](https://item.jd.com/12238227.html) - 主要以运维的视角阐述系统运维中遇到的困难，定位思路以及解决方法。

- **教程**
  - [system-design-primer](https://github.com/donnemartin/system-design-primer/blob/master/README-zh-Hans.md)
