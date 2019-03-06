---
title: 大数据简介
date: 2018-09-03
categories:
- bigdata
tags:
- bigdata
---

# 大数据简介

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [什么是大数据](#什么是大数据)
    - [应用场景](#应用场景)
    - [Hadoop 编年史](#hadoop-编年史)
- [技术体系](#技术体系)
    - [HDFS](#hdfs)
    - [MapReduce](#mapreduce)
    - [Spark](#spark)
    - [YARN](#yarn)
    - [Hive](#hive)
    - [HBase](#hbase)
    - [ElasticSearch](#elasticsearch)
- [术语](#术语)
- [资源](#资源)

<!-- /TOC -->

## 简介

### 什么是大数据

大数据是指超出传统数据库工具收集、存储、管理和分析能力的数据集。与此同时，及时采集、存储、聚合、管理数据，以及对数据深度分析的新技术和新能力，正在快速增长，就像预测计算芯片增长速度的摩尔定律一样。

- **Volume** - 数据规模巨大
- **Velocity** - 生成和处理速度极快
- **Variety** - 数据规模巨大
- **Value** - 生成和处理速度极快

### 应用场景

基于大数据的数据仓库

基于大数据的实时流处理

### Hadoop 编年史 

| 时间    | 事件                                                             |
|:--------|:-----------------------------------------------------------------|
| 2003.01 | Google发表了Google File System论文                               |
| 2004.01 | Google发表了MapReduce论文                                        |
| 2006.02 | Apache Hadoop项目正式启动，并支持MapReduce和HDFS独立发展         |
| 2006.11 | Google发表了Bigtable论文                                         |
| 2008.01 | Hadoop成为Apache顶级项目                                         |
| 2009.03 | Cloudera推出世界上首个Hadoop发行版——CDH，并完全开放源码          |
| 2012.03 | HDFS NameNode HA加入Hadoop主版本                                 |
| 2014.02 | Spark代替MapReduce成为Hadoop的缺省计算引擎，并成为Apache顶级项目 |

## 技术体系

### HDFS

**概念**

- Hadoop 分布式文件系统（Hadoop Distributed File System）
- 在开源大数据技术体系中，地位无可替代

**特点**

- 高容错：数据多副本，副本丢失后自动恢复
- 高可用：NameNode HA，安全模式
- 高扩展：10K 节点规模
- 简单一致性模型：一次写入多次读取，支持追加，不允许修改
- 流式数据访问：批量读而非随机读，关注吞吐量而非时间
- 大规模数据集：典型文件大小 GB\~TB 级，百万以上文件数量， PB 以上数据规模
- 构建成本低且安全可靠：运行在大量的廉价商用机器上，硬件错误是常态，提供容错机制

### MapReduce

**概念**

- 面向批处理的分布式计算框架
- 编程模型：将 MapReduce 程序分为 Map、Reduce 两个阶段

**核心思想**

- 分而治之，分布式计算
- 移动计算，而非移动数据

**特点**

- 高容错：任务失败，自动调度到其他节点重新执行
- 高扩展：计算能力随着节点数增加，近似线性递增
- 适用于海量数据的离线批处理
- 降低了分布式编程的门槛

### Spark

高性能分布式通用计算引擎

- Spark Core - 基础计算框架（批处理、交互式分析）
- Spark SQL - SQL 引擎（海量结构化数据的高性能查询）
- Spark Streaming - 实时流处理（微批）
- Spark MLlib - 机器学习
- Spark GraphX - 图计算

采用 Scala 语言开发

**特点**

- 计算高效 - 内存计算、Cache 缓存机制、DAG 引擎、多线程池模型
- 通用易用 - 适用于批处理、交互式计算、流处理、机器学习、图计算等多种场景
- 运行模式多样 - Local、Standalone、YARN/Mesos

### YARN

**概念**

- Yet Another Resource Negotiator，另一种资源管理器
- 为了解决 Hadoop 1.x 中 MapReduce 的先天缺陷
- 分布式通用资源管理系统
- 负责集群资源的统一管理
- 从 Hadoop 2.x 开始，YARN 成为 Hadoop 的核心组件

**特点**

- 专注于资源管理和作业调度
- 通用 - 适用各种计算框架，如 - MapReduce、Spark
- 高可用 - ResourceManager 高可用、HDFS 高可用
- 高扩展

### Hive

**概念**

- Hadoop 数据仓库 - 企业决策支持
- SQL 引擎 - 对海量结构化数据进行高性能的 SQL 查询
- 采用 HDFS 或 HBase 为数据存储
- 采用 MapReduce 或 Spark 为计算框架

**特点**

- 提供类 SQL 查询语言
- 支持命令行或 JDBC/ODBC
- 提供灵活的扩展性
- 提供复杂数据类型、扩展函数、脚本等

### HBase

**概念**

- Hadoop Database
- Google BigTable 的开源实现
- 分布式 NoSQL 数据库
- 列式存储 - 主要用于半结构化、非结构化数据
- 采用 HDFS 为文件存储系统

**特点**

- 高性能 - 支持高并发写入和查询
- 高可用 - HDFS 高可用、Region 高可用
- 高扩展 - 数据自动切分和分布，可动态扩容，无需停机
- 海量存储 - 单表可容纳数十亿行，上百万列

### ElasticSearch

- 开源的分布式全文检索引擎
- 基于 Lucene 实现全文数据的快速存储、搜索和分析
- 处理大规模数据 - PB 级以上
- 具有较强的扩展性，集群规模可达上百台
- 首选的分布式搜索引擎

## 术语

**数据仓库（Data Warehouse）** - 数据仓库，是为企业所有级别的决策制定过程，提供所有类型数据支持的战略集合。它是单个数据存储，出于分析性报告和决策支持目的而创建。 为需要业务智能的企业，提供指导业务流程改进、监视时间、成本、质量以及控制。

## 资源

- [awesome-bigdata](https://github.com/onurakpolat/awesome-bigdata)
- [Hadoop](http://hadoop.apache.org/)
- [HBase](http://hbase.apache.org/)
- [Hive](http://hive.apache.org/)
- [Impala](http://impala.apache.org/)
- [Flume](http://flume.apache.org/)
- [Kafka](http://kafka.apache.org/)
- [Spark](http://spark.apache.org/)
- [Sqoop](http://sqoop.apache.org/)
- [ElasticSearch](https://www.elastic.co/guide/index.html)
