---
title: MapReduce
date: 2018-09-03
categories:
  - bigdata
tags:
  - bigdata
  - hadoop
---

# MapReduce

<!-- TOC depthFrom:2 depthTo:3 -->

- [MapReduce 简介](#mapreduce-简介)
    - [概念](#概念)
    - [思想](#思想)
    - [特点](#特点)
    - [适用场景](#适用场景)
    - [不适用场景](#不适用场景)
- [MapReduce 原理](#mapreduce-原理)
    - [Job & Task（作业与任务）](#job--task作业与任务)
    - [Split（切片）](#split切片)
    - [Map 阶段（映射）](#map-阶段映射)
    - [Reduce 阶段（化简）](#reduce-阶段化简)
    - [Shuffle 阶段（洗牌）](#shuffle-阶段洗牌)
- [Shuffle 详解](#shuffle-详解)
    - [Map 端](#map-端)
    - [Reduce 端](#reduce-端)
- [作业运行模式](#作业运行模式)
    - [JobTracker/TaskTracker 模式（Hadoop 1.X）](#jobtrackertasktracker-模式hadoop-1x)
    - [YARN 模式（Hadoop 2.X）](#yarn-模式hadoop-2x)

<!-- /TOC -->

## MapReduce 简介

### 概念

MapReduce 是一个面向批处理的分布式计算框架。

编程模型：MapReduce 程序被分为 Map（映射）阶段和 Reduce（化简）阶段。

### 思想

分而治之，并行计算
移动计算，而非移动数据

### 特点

- 计算跟着数据走
- 良好的扩展性：计算能力随着节点数增加，近似线性递增
- 高容错
- 状态监控
- 适合海量数据的离线批处理
- 降低了分布式编程的门槛

### 适用场景

- 数据统计，如：网站的 PV、UV 统计
- 搜索引擎构建索引
- 海量数据查询

### 不适用场景

- OLAP
  - 要求毫秒或秒级返回结果
- 流计算
  - 流计算的输入数据集是动态的，而 MapReduce 是静态的
- DAG 计算
  - 多个作业存在依赖关系，后一个的输入是前一个的输出，构成有向无环图 DAG
  - 每个 MapReduce 作业的输出结果都会落盘，造成大量磁盘 IO，导致性能非常低下

## MapReduce 原理

### Job & Task（作业与任务）

- 作业是客户端请求执行的一个工作单元
  - 包括输入数据、MapReduce 程序、配置信息
- 任务是将作业分解后得到的细分工作单元
  - 分为 Map 任务和 Reduce 任务

### Split（切片）

- 输入数据被划分成等长的小数据块，称为输入切片（Input Split），简称切片
- Split 是逻辑概念，仅包含元数据信息，如：数据的起始位置、长度、所在节点等
- 每个 Split 交给一个 Map 任务处理，Split 的数量决定 Map 任务的数量
- Split 的划分方式由程序设定，Split 与 HDFS Block 没有严格的对应关系
- Split 的大小默认等于 Block 大小
- Split 越小，负载越均衡，但集群的开销越大

### Map 阶段（映射）

- 由若干 Map 任务组成，任务数量由 Split 数量决定
- 输入：Split 切片（key-value），输出：中间计算结果（key-value）

### Reduce 阶段（化简）

- 由若干 Reduce 任务组成，任务数量由程序指定
- 输入：Map 阶段输出的中间结果（key-value），输出：最终结果（key-value）

### Shuffle 阶段（洗牌）

- Map、Reduce 阶段的中间环节，负责执行 Partition（分区）、Sort（排序）、Spill（溢写）、Merge（合并）、抓取（Fetch）等工作
- Partition 决定了 Map 任务输出的每条数据放入哪个分区，交给哪个 Reduce 任务处理
- Reduce 任务的数量决定了 Partition 数量
- Partition 编号 = Reduce 任务编号 =“key hashcode % reduce task number”
- 避免和减少 Shuffle 是 MapReduce 程序调优的重点

## Shuffle 详解

### Map 端

Map 任务将中间结果写入专用内存缓冲区 Buffer（默认 100M），同时进行 Partition 和 Sort（先按“key hashcode % reduce task number”对数据进行分区，分区内再按 key 排序）
当 Buffer 的数据量达到阈值（默认 80%）时，将数据溢写（Spill）到磁盘的一个临时文件中，文件内数据先分区后排序
Map 任务结束前，将多个临时文件合并（Merge）为一个 Map 输出文件，文件内数据先分区后排序

### Reduce 端

Reduce 任务从多个 Map 输出文件中主动抓取（Fetch）属于自己的分区数据，先写入 Buffer，数据量达到阈值后，溢写到磁盘的一个临时文件中
数据抓取完成后，将多个临时文件合并为一个 Reduce 输入文件，文件内数据按 key 排序

## 作业运行模式

### JobTracker/TaskTracker 模式（Hadoop 1.X）

**JobTracker 节点（Master）**

- 调度任务在 TaskTracker 上运行
- 若任务失败，指定新 TaskTracker 重新运行

**TaskTracker 节点（Slave）**

- 执行任务，发送进度报告

**存在的问题**

- JobTracker 存在单点故障
- JobTracker 负载太重（上限 4000 节点）
- JobTracker 缺少对资源的全面管理
- TaskTracker 对资源的描述过于简单
- 源码很难理解

### YARN 模式（Hadoop 2.X）

- 提交作业
- 查看作业
- 终止作业

