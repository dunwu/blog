---
title: YARN
date: 2018-09-03
categories:
  - bigdata
tags:
  - bigdata
  - hadoop
---

# YARN

> YARN 的目标是解决 MapReduce 的缺陷。

<!-- TOC depthFrom:2 depthTo:3 -->

- [MapReduce 的缺陷（Hadoop 1.x）](#mapreduce-的缺陷hadoop-1x)
- [YARN 简介](#yarn-简介)
- [YARN 系统架构](#yarn-系统架构)
    - [ResourceManager（RM）](#resourcemanagerrm)
    - [NodeManager（NM）](#nodemanagernm)
    - [ApplicationMaster（AM）](#applicationmasteram)
    - [Container](#container)
- [YARN 高可用](#yarn-高可用)
- [YARN 资源调度策略](#yarn-资源调度策略)
    - [FIFO Scheduler（先进先出调度器）](#fifo-scheduler先进先出调度器)
    - [Capacity Scheduler（容量调度器）](#capacity-scheduler容量调度器)
    - [Fair Scheduler（公平调度器）](#fair-scheduler公平调度器)
- [资源](#资源)

<!-- /TOC -->

## MapReduce 的缺陷（Hadoop 1.x）

- 身兼两职：计算框架 + 资源管理框架
- JobTracker
  - 既做资源管理，又做任务调度
  - 任务太重，开销过大
  - 存在单点故障
- 资源描述模型过于简单，资源利用率较低
  - 仅把 Task 数量看作资源，没有考虑 CPU 和内存
  - 强制把资源分成 Map Task Slot 和 Reduce Task Slot
- 扩展性较差，集群规模上限 4K
- 源码难于理解，升级维护困难

## YARN 简介

YARN(Yet Another Resource Negotiator，另一种资源管理器)是一个**分布式通用资源管理系统**。

设计目标：聚焦资源管理、通用（适用各种计算框架）、高可用、高扩展。

## YARN 系统架构

- 主从结构（master/slave）
- 将 JobTracker 的资源管理、任务调度功能分离
- 三种角色：
  - ResourceManager（Master） - 集群资源的统一管理和分配
  - NodeManager（Slave） - 管理节点资源，以及容器的生命周期
  - ApplicationMaster（新角色） - 管理应用程序实例，包括任务调度和资源申请

### ResourceManager（RM）

**主要功能**

- 统一管理集群的所有资源
- 将资源按照一定策略分配给各个应用（ApplicationMaster）
- 接收 NodeManager 的资源上报信息

**核心组件**

- 用户交互服务（User Service）
- NodeManager 管理
- ApplicationMaster 管理
- Application 管理
- 安全管理
- 资源管理

### NodeManager（NM）

**主要功能**

- 管理单个节点的资源
- 向 ResourceManager 汇报节点资源使用情况
- 管理 Container 的生命周期

**核心组件**

- NodeStatusUpdater
- ContainerManager
- ContainerExecutor
- NodeHealthCheckerService
- Security
- WebServer

### ApplicationMaster（AM）

**主要功能**

- 管理应用程序实例
- 向 ResourceManager 申请任务执行所需的资源
- 任务调度和监管

**实现方式**

- 需要为每个应用开发一个 AM 组件
- YARN 提供 MapReduce 的 ApplicationMaster 实现
- 采用基于事件驱动的异步编程模型，由中央事件调度器统一管理所有事件
- 每种组件都是一种事件处理器，在中央事件调度器中注册

### Container

- 概念：Container 封装了节点上进程的相关资源，是 YARN 中资源的抽象
- 分类：运行 ApplicationMaster 的 Container 、运行应用任务的 Container

## YARN 高可用

ResourceManager 高可用

- 1 个 Active RM、多个 Standby RM
- 宕机后自动实现主备切换
- ZooKeeper 的核心作用
  - Active 节点选举
  - 恢复 Active RM 的原有状态信息
- 重启 AM，杀死所有运行中的 Container
- 切换方式：手动、自动

## YARN 资源调度策略

### FIFO Scheduler（先进先出调度器）

**调度策略**

将所有任务放入一个队列，先进队列的先获得资源，排在后面的任务只有等待

**缺点**

- 资源利用率低，无法交叉运行任务
- 灵活性差，如：紧急任务无法插队，耗时长的任务拖慢耗时短的任务

### Capacity Scheduler（容量调度器）

**核心思想** - 提前**做预算**，在预算指导下分享集群资源。

**调度策略**

- 集群资源由多个队列分享
- 每个队列都要预设资源分配的比例（提前做预算）
- 空闲资源优先分配给“实际资源/预算资源”比值最低的队列
- 队列内部采用 FIFO 调度策略

**特点**

- 层次化的队列设计：子队列可使用父队列资源
- 容量保证：每个队列都要预设资源占比，防止资源独占
- 弹性分配：空闲资源可以分配给任何队列，当多个队列争用时，会按比例进行平衡
- 支持动态管理：可以动态调整队列的容量、权限等参数，也可动态增加、暂停队列
- 访问控制：用户只能向自己的队列中提交任务，不能访问其他队列
- 多租户：多用户共享集群资源

### Fair Scheduler（公平调度器）

**调度策略**

- 多队列公平共享集群资源
- 通过平分的方式，动态分配资源，无需预先设定资源分配比例
- 队列内部可配置调度策略：FIFO、Fair（默认）

**资源抢占**

- 终止其他队列的任务，使其让出所占资源，然后将资源分配给占用资源量少于最小资源量限制的队列

**队列权重**

- 当队列中有任务等待，并且集群中有空闲资源时，每个队列可以根据权重获得不同比例的空闲资源

## 资源
