---
title: 《HBase A NoSQL database》笔记
date: 2023-09-05 19:52:01
order: 01
categories:
  - 笔记
  - 分布式
  - 分布式存储
tags:
  - 分布式
  - 分布式存储
  - HBASE
permalink: /pages/b9f4e5f0/
---

# 《HBase: A NoSQL database》笔记

## 简介

HBase 是一种 NoSQL 数据库，它是Java版本的 Google’s Big Table 实现，它原本是 Hadoop 的子项目，现在已独立出来，并成为 apache 的顶级项目。

HBase 的设计目标是用于存储大规模数据集。HBase 是列式数据库，与传统行式数据库相比，其非常适合用于存储稀疏性的数据。

HBase 是基于 HDFS 实现的。

## HBase 和历史

HBase 关键特性：

- 水平扩展
- 分区容错性
- 支持并行处理
- 支持 HDFS 和 MapReduce
- 近实时查询
- 适用于存储大规模数据集
- 适用于存储稀疏型数据（宽表）
- 表的动态负载均衡
- 对于大规模的查询，支持块缓存和布隆过滤器

HBase 发展历史

2007 - Mike Cafarella 发布 BigTable 的开源实现——HBase

2008 ~ 2010 - HBase 成为 Apache 顶级项目。

## HBase 数据结构和架构

HBase 表可以用于 MapReduce 任务的输入、输出对象。

HBase 由行、列族、列、时间戳组成。

HBase 表会被分成多个分区，每个分区会定义起始key、结束key。它们被存于 HDFS 文件中。

HBase 的架构通常为一个 master server，多个 region server，以及 ZooKeeper 集群。

- **master server**
  - 在 ZooKeeper 的帮助下，为分区分配 region server，控制 region server 的负载均衡。
  - 负责 schema 的变更
  - 管理和监控 Hadoop 集群
- **region server**
  - region server 负责处理来自客户端的 CRUD 操作
  - region server 包括内存存储和 HFile
  - region server 运行在 HDFS 的数据节点上
  - region server 有四个核心组件：Block cache（读缓存）、MemStore（写缓存）、WAL、HFile（存储行数据，键值对结构）
- Zookeeper
  - 当 region server 宕机并重新工作时，HBase 会使用 ZooKeeper 作为协调工具，对其进行恢复
  - Zookeeper 是客户端和 master server 的中心，它维护着 master server 和 region server 注册的元数据信息。例如：有多少有效的 region server；任意 region server 持有哪些 data node
  - ZooKeeper 可以用于追踪服务器错误

## HBase 和大数据

HBase 相比于其他 NoSQL，最显著的优势在于，它属于 Hadoop 生态体系中的重要一环，被广泛用于大数据领域。但是，近些年，有 MongoDB、Cassandra 等一些数据库挑战着其地位。

## HBase 的应用

Facebook 的消息平台使用 HBase 存储数据，每月产生约 13.5 亿条信息。

HBase 还被用于存储各种海量操作数据。

## HBase 的挑战和限制

HBase 采用主从架构，一旦 master server 不可用，需要很长时间才能恢复。

HBase 不支持二级索引。

## 参考资料

- [HBase: A NoSQL Database](https://www.researchgate.net/publication/317399857_HBase_A_NoSQL_Database)