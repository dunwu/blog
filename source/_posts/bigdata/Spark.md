---
title: Spark
date: 2018-09-03
categories:
  - bigdata
tags:
  - bigdata
---

# Spark

<!-- TOC depthFrom:2 depthTo:3 -->

- [Spark 简介](#spark-简介)
    - [Spark 概念](#spark-概念)
    - [Spark 特点](#spark-特点)
- [Spark 原理](#spark-原理)
    - [编程模型](#编程模型)

<!-- /TOC -->

## Spark 简介

### Spark 概念

- 大规模分布式通用计算引擎
  - Spark Core：核心计算框架
  - Spark SQL：结构化数据查询
  - Spark Streaming：实时流处理
  - Spark MLib：机器学习
  - Spark GraphX：图计算
- 具有高吞吐、低延时、通用易扩展、高容错等特点
- 采用 Scala 语言开发
- 提供多种运行模式

### Spark 特点

- 计算高效
  - 利用内存计算、Cache 缓存机制，支持迭代计算和数据共享，减少数据读取的 IO 开销
  - 利用 DAG 引擎，减少中间计算结果写入 HDFS 的开销
  - 利用多线程池模型，减少任务启动开销，避免 Shuffle 中不必要的排序和磁盘 IO 操作
- 通用易用
  - 适用于批处理、流处理、交互式计算、机器学习算法等场景
  - 提供了丰富的开发 API，支持 Scala、Java、Python、R 等
- 运行模式多样
  - Local 模式
  - Standalone 模式
  - YARN/Mesos 模式
- 计算高效
  - 利用内存计算、Cache 缓存机制，支持迭代计算和数据共享，减少数据读取的 IO 开销
  - 利用 DAG 引擎，减少中间计算结果写入 HDFS 的开销
  - 利用多线程池模型，减少任务启动开销，避免 Shuffle 中不必要的排序和磁盘 IO 操作
- 通用易用
  - 适用于批处理、流处理、交互式计算、机器学习等场景
  - 提供了丰富的开发 API，支持 Scala、Java、Python、R 等

## Spark 原理

### 编程模型

#### RDD

- 弹性分布式数据集（Resilient Distributed Datesets）
  - 分布在集群中的只读对象集合
  - 由多个 Partition 组成
  - 通过转换操作构造
  - 失效后自动重构（弹性）
  - 存储在内存或磁盘中
- Spark 基于 RDD 进行计算

#### RDD 操作（Operator）

- Transformation（转换）
  - 将 Scala 集合或 Hadoop 输入数据构造成一个新 RDD
  - 通过已有的 RDD 产生新 RDD
  - 惰性执行：只记录转换关系，不触发计算
  - 例如：map、filter、flatmap、union、distinct、sortbykey
- Action（动作）
  - 通过 RDD 计算得到一个值或一组值
  - 真正触发计算
  - 例如：first、count、collect、foreach、saveAsTextFile

#### RDD 依赖（Dependency）

- 窄依赖（Narrow Dependency）
  - 父 RDD 中的分区最多只能被一个子 RDD 的一个分区使用
  - 子 RDD 如果有部分分区数据丢失或损坏，只需从对应的父 RDD 重新计算恢复
  - 例如：map、filter、union
- 宽依赖（Shuffle/Wide Dependency ）
  - 子 RDD 分区依赖父 RDD 的所有分区
  - 子 RDD 如果部分或全部分区数据丢失或损坏，必须从所有父 RDD 分区重新计算
  - 相对于窄依赖，宽依赖付出的代价要高很多，尽量避免使用
  - 例如：groupByKey、reduceByKey、sortByKey

