---
title: Flume
date: 2018-09-04
categories:
  - bigdata
tags:
  - bigdata
  - hadoop
---

# Flume

> **Sqoop 是一个主要在 Hadoop 和关系数据库之间进行批量数据迁移的工具。**

<!-- TOC depthFrom:2 depthTo:3 -->

- [Flume 简介](#flume-简介)
    - [什么是 Flume ？](#什么是-flume-)
    - [应用场景](#应用场景)
- [Flume 原理](#flume-原理)
    - [Flume 基本概念](#flume-基本概念)
    - [Flume 基本组件](#flume-基本组件)
    - [Flume 数据流](#flume-数据流)
- [资源](#资源)

<!-- /TOC -->

## Flume 简介

### 什么是 Flume ？

Flume 是一个分布式海量数据采集、聚合和传输系统。

特点

- 基于事件的海量数据采集
- 数据流模型：Source -> Channel -> Sink
- 事务机制：支持重读重写，保证消息传递的可靠性
- 内置丰富插件：轻松与各种外部系统集成
- 高可用：Agent 主备切换
- Java 实现：开源，优秀的系统设计

### 应用场景

## Flume 原理

### Flume 基本概念

- Event：事件，最小数据传输单元，由 Header 和 Body 组成。
- Agent：代理，JVM 进程，最小运行单元，由 Source、Channel、Sink 三个基本组件构成，负责将外部数据源产生的数据以 Event 的形式传输到目的地
  - Source：负责对接各种外部数据源，将采集到的数据封装成 Event，然后写入 Channel
  - Channel：Event 暂存容器，负责保存 Source 发送的 Event，直至被 Sink 成功读取
  - Sink：负责从 Channel 读取 Event，然后将其写入外部存储，或传输给下一阶段的 Agent
  - 映射关系：1 个 Source -> 多个 Channel，1 个 Channel -> 多个 Sink，1 个 Sink -> 1 个 Channel

### Flume 基本组件

#### Source 组件

- 对接各种外部数据源，将采集到的数据封装成 Event，然后写入 Channel
- 一个 Source 可向多个 Channel 发送 Event
- Flume 内置类型丰富的 Source，同时用户可自定义 Source

#### Channel 组件

- Event 中转暂存区，存储 Source 采集但未被 Sink 读取的 Event
- 为了平衡 Source 采集、Sink 读取的速度，可视为 Flume 内部的消息队列
- 线程安全并具有事务性，支持 Source 写失败重写和 Sink 读失败重读

#### Sink 组件

- 从 Channel 读取 Event，将其写入外部存储，或传输到下一阶段的 Agent
- 一个 Sink 只能从一个 Channel 中读取 Event
- Sink 成功读取 Event 后，向 Channel 提交事务，Event 被删除，否则 Channel 会等待 Sink 重新读取

### Flume 数据流

单层架构

优点：架构简单，使用方便，占用资源较少
缺点
如果采集的数据源或Agent较多，将Event写入到HDFS会产生很多小文件
外部存储升级维护或发生故障，需对采集层的所有Agent做处理，人力成本较高，系统稳定性较差
系统安全性较差
数据源管理较混乱


## 资源
