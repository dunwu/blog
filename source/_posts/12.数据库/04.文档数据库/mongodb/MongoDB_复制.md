---
icon: logos:mongodb
title: MongoDB 复制
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/20200920204024.svg
date: 2020-09-20 23:12:17
categories:
  - 数据库
  - 文档数据库
  - mongodb
tags:
  - 数据库
  - 文档数据库
  - mongodb
  - 复制
permalink: /pages/cd111ced/
---

# MongoDB 复制

::: info 概述

**复制主要指通过网络在多台机器上保存相同数据的副本**。

复制数据，可能出于各种各样的原因：

- **提高可用性** - 当部分组件出现位障，系统依然可以继续工作，系统依然可以继续工作。
- **降低访问延迟** - 使数据在地理位置上更接近用户。
- **提高读吞吐量** - 扩展至多台机器以同时提供数据访问服务。

综上可知，复制是所有分布式系统的核心特性，是高可用的重要保证。

MongoDB 本身是一个分布式数据库，自然也需要具备复制的能力。MongoDB 复制采用了经典的主从架构。**所有的写入操作都发送到主节点**，由主节点负责将数据更改事件发送到从节点，每个从节点都可以接收读请求。

本文将逐一阐述 MongoDB 复制的各个要点，以及如何基于复制来保证 MongoDB 的高可用。

:::

<!-- more -->

## 复制模式

**复制主要指通过网络在多台机器上保存相同数据的副本**。

分布式系统复制的模式有以下几种：

- **主从复制** - **所有的写入操作都发送到主节点**，由主节点负责将数据更改事件发送到从节点。每个从节点都可以接收读请求，但内容可能是过期值。
- **多主复制** - **系统存在多个主节点，每个都可以接收写请求**，客户端将写请求发送到其中的一个主节点上，由该主节点负责将数据更改事件同步到其他主节点和自己的从节点。
- **无主复制** - **系统中不存在主节点，每一个节点都能接受客户端的写请求**。接受写请求的副本不会将数据变更同步到其他的副本。此外，**读取时从多个节点上并行读取，以此检测和纠正某些过期数据**。

**MongoDB 复制采用了主从架构**。

## 副本集

在 MongoDB 中，**副本集**是一组维护相同数据集的 [`mongod`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 进程，副本集提供了冗余和 [高可用性](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-high-availability)。MongoDB 副本集中有三种节点类型：

- [主节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-primary/#std-label-replica-set-primary) - 主节点接收所有写入操作。
- [从节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-secondary/#std-label-replica-set-secondary-members-ref) - 从节点复制主节点的操作以维护相同的数据集。
- [仲裁节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration) - 仲裁节点将参与 [主节点的选举](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)，但仲裁节点**没有**数据集的副本，从而**无法**成为主节点。

一个副本集中，有且只有一个主节点，可以有一个 [仲裁节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration)（可选），多个 [从节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-secondary/#std-label-replica-set-secondary-members-ref)。

### 主节点

[主节点（Primary）](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-primary/#std-label-replica-set-primary) 会接收所有写入操作。副本集只能有一个可以使用 [`{ w: "majority" }`](https://www.mongodb.com/zh-cn/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-) 写关注（write concern）级别对写入请求进行确认的主节点；尽管在某些情况下，另一 mongod 实例可能会暂时将自身视为主节点。主节点在其操作日志（即 [oplog](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-oplog/)）中记录对其数据集的所有更改。

> 扩展阅读：[副本集主节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-primary/)

![读写请求路由到主节点](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920165054.svg)

### 从节点

[从节点（Secondary）](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-secondary/#std-label-replica-set-secondary-members-ref) 负责复制 [主节点](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-primary) 的数据集副本。为了复制数据，从节点异步的将来自主节点的 [oplog](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-oplog/#std-label-replica-set-oplog) 操作同步到自己的数据集。如果主节点不可用，则某个符合条件的从节点将进行选举，以将自己选举为新的主节点。

尽管客户端无法将数据写入从节点，但客户端可以自从节点读取数据。

> 扩展阅读：[副本集从节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-secondary/)

![一主两从集群](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920165055.svg)

### 仲裁节点

在某些情况下（例如存在一个主节点和一个从节点，但由于成本有限无法再添加另一个从节点），可以选择将一个 [`mongod`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例作为 [仲裁节点（Arbiter）](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration) 添加到副本集中。仲裁节点参与 [选举](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)，但不持有数据（即不提供数据冗余）。

> 扩展阅读：[副本集仲裁节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-arbiter/)

![一主一从一仲裁集群](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920165053.svg)

[仲裁节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration) 将永远是仲裁节点，而在选举期间，[主节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-primary/#std-label-replica-set-primary) 可能被降级成为 [从节点](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-secondary/#std-label-replica-set-secondary-members-ref)，从节点可能变为主节点。

> 注意：不要在同时托管主节点或从节点的服务器上运行投票节点。

## 异步复制

从节点会复制主节点的 oplog 并将操作异步应用于其数据集。通过使从节点的数据集反应主节点数据集的状态，即便一个或多个节点出现故障，副本集也可继续运行。

> 扩展阅读：
>
> - [副本集 Oplog](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-oplog/#std-label-replica-set-oplog)
> - [副本集数据同步](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-sync/#std-label-replica-set-sync)

### 复制延迟和流控

副本集的从节点会记录应用时间超过慢操作阈值的 [oplog 条目](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-oplog/#std-label-slow-oplog-application)。

[复制延迟](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-replication-lag) 是指 [主节点](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-primary) 上的操作与将该操作从 [oplog](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-oplog) 应用到 [从节点](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-secondary) 之间的延迟。一些小的延迟是可以接受的，但随着复制延迟的增加，会出现严重的问题，包括在主节点上创建缓存压力。

管理员可以限制主节点应用写入的速率，目标是将 [`majority committed`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime) 延迟保持在可配置的最大 [`flowControlTargetLagSeconds`](https://www.mongodb.com/zh-cn/docs/manual/reference/parameters/#mongodb-parameter-param.flowControlTargetLagSeconds) 值以下。默认情况下，流量控制为 [`enabled`。](https://www.mongodb.com/zh-cn/docs/manual/reference/parameters/#mongodb-parameter-param.enableFlowControl)

启用流量控制后，随着延迟接近 [`flowControlTargetLagSeconds`](https://www.mongodb.com/zh-cn/docs/manual/reference/parameters/#mongodb-parameter-param.flowControlTargetLagSeconds)，主节点上的写入操作必须先获取令牌，然后才能进行锁定并执行写操作。通过限制每秒发出的令牌数量，流量控制机制将尝试将延迟保持在目标延迟以下。

## 故障转移

当主节点在超过配置的 [`electionTimeoutMillis`](https://www.mongodb.com/zh-cn/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.electionTimeoutMillis) 时间段（默认 10 秒）内未与副本集中的其他节点通信时，一个符合条件的从节点将发起选举，并提名自己成为新的主节点。集群将尝试完成新主节点的选举并恢复其正常运转。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920175429.svg)

在成功完成选举之前，副本集无法处理写操作。如果将读取查询配置为当主节点离线时 [在从节点上运行](https://www.mongodb.com/zh-cn/docs/manual/core/read-preference/#std-label-replica-set-read-preference)，那么副本集可以继续为读取查询提供服务。

假设采用默认 [`replica configuration settings`](https://www.mongodb.com/zh-cn/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings)（副本配置设置），那么集群选举新的主节点之前的平均时间通常不应超过 12 秒。这包括将主节点标记为 [不可用](https://www.mongodb.com/zh-cn/docs/manual/replication/#std-label-replication-auto-failover) 以及召集和完成 [选举](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-elections/#std-label-replica-set-elections) 所需的时间。可以通过修改 [`settings.electionTimeoutMillis`](https://www.mongodb.com/zh-cn/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.electionTimeoutMillis) 复制配置选项来调整该时间段。网络延迟等因素可能会延长副本集选举完成所需的时间，这反过来又会影响集群在没有主节点的情况下运行的时间。这些因素取决于具体集群架构。

将 [`electionTimeoutMillis`](https://www.mongodb.com/zh-cn/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.electionTimeoutMillis) 复制配置选项从默认的 `10000`（10 秒）降低，可以更快地检测到主节点故障。然而，由于临时网络延迟等因素，即使主节点在其他方面是健康的，集群也可能会更频繁地进行选举。这可能导致 [w: 1](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-rollbacks/#std-label-replica-set-rollback) 写入操作的 [回滚次数增加](https://www.mongodb.com/zh-cn/docs/manual/reference/write-concern/#std-label-wc-w)。

应用程序连接逻辑应包括对自动故障转移和后续选举的容忍度。MongoDB 驱动程序可检测到主节点丢失，并一次性自动 [重试某些写入操作](https://www.mongodb.com/zh-cn/docs/manual/core/retryable-writes/#std-label-retryable-writes)，从而为自动故障转移和选举提供额外的内置处理功能：

MongoDB 提供 [镜像读](https://www.mongodb.com/zh-cn/docs/manual/replication/#std-label-mirrored-reads) 功能，用最近访问的数据预热可选从节点缓存。预热从节点的缓存有助于在选举后更快地恢复性能。

## 读操作

### 读取偏好

默认情况下，客户端从主节点读取数据；但是，客户端可以指定 [读取偏好](https://www.mongodb.com/zh-cn/docs/manual/core/read-preference/) 以向从节点发送读取操作。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920204024.svg)

[异步复制](https://www.mongodb.com/zh-cn/docs/manual/replication/#std-label-asynchronous-replication) 到从节点意味着在从节点读取到的数据可能不会反映主节点上数据的状态。

包含读操作的 [分布式事务](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/#std-label-transactions) 必须使用读取偏好 [`primary`](https://www.mongodb.com/zh-cn/docs/manual/core/read-preference/#mongodb-readmode-primary)。给定事务中的所有操作必须路由至同一节点。

> 扩展阅读：[读取偏好](https://www.mongodb.com/zh-cn/docs/manual/core/read-preference/)

### 数据可见性

根据读关注，客户端可在写入操作 [持久化](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-durable) 之前看到写入结果：

- 无论写入操作的 [写关注级别](https://www.mongodb.com/zh-cn/docs/manual/reference/write-concern/#std-label-write-concern) 如何，使用 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-) 或 [`"available"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-available/#mongodb-readconcern-readconcern.-available-) 读关注（read concern）的其他客户端均可在写入操作被发起它的客户端确认之前，看到该操作的结果。
- 使用 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-) 或 [`"available"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-available/#mongodb-readconcern-readconcern.-available-) 读关注的客户端可读取数据，而这些数据后续可能会在副本集故障转移期间进行 [回滚](https://www.mongodb.com/zh-cn/docs/manual/core/replica-set-rollbacks/)。

对于 [多文档事务](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/) 中的操作，当事务提交时，该事务中进行的所有数据更改都将保存并在事务外部可见。换言之，一个事务不会在回滚其他事务的同时提交某些更改。

在事务进行提交前，在事务中所做的数据更改在事务外不可见。不过，当事务写入多个分片时，并非所有外部读取操作都需等待已提交事务的结果在各个分片上可见。例如，如果事务已提交并且写入 1 在分片 A 上可见，但写入 2 在分片 B 上尚不可见，则读关注 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-) 处的外部读取可以在不看到写入 2 的情况下读取写入 1 的结果。

> 有关 MongoDB 读取隔离性、一致性和新近度的更多信息，请参阅 [读取隔离性、一致性和新近度](https://www.mongodb.com/zh-cn/docs/manual/core/read-isolation-consistency-recency/)。

### 镜像读取

镜像读取可减少由于中断或计划维护后主节点选举对系统的影响。在副本集发生 [故障转移](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-failover) 后，接管成为新主节点的从节点会在新查询请求传入时更新其缓存。在缓存预热期间，性能可能会受到影响。

镜像读会预热 [`electable`](https://www.mongodb.com/zh-cn/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority) 从节点副本集成员的缓存。为了预热可选举从节点的缓存，主节点会将其接收到的 [受支持操作](https://www.mongodb.com/zh-cn/docs/manual/replication/#std-label-mirrored-reads-supported-operations) 的示例镜像到可选举的从节点。

可以使用 [`mirrorReads`](https://www.mongodb.com/zh-cn/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority) 参数来配置接收镜像读的 [`electable`](https://www.mongodb.com/zh-cn/docs/manual/reference/parameters/#mongodb-parameter-param.mirrorReads) 从节点副本集节点的子集的大小。有关更多详细信息，请参见 [启用/禁用对镜像读的支持](https://www.mongodb.com/zh-cn/docs/manual/replication/#std-label-mirrored-reads-parameters)。

## 参考资料

- [MongoDB 官方文档之复制](https://www.mongodb.com/zh-cn/docs/manual/replication/)