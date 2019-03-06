---
title: ZooKeeper 高级篇
date: 2018-07-10
categories:
- 分布式
tags:
- 分布式
- rpc
---

# ZooKeeper 高级篇

> ZooKeeper 是一个分布式应用协调系统，已经用到了许多分布式项目中，用来完成统一命名服务、状态同步服务、集群管理、分布式应用配置项的管理等工作。
>
> 本文侧重于总结 ZooKeeper 工作原理。

<!-- TOC depthFrom:2 depthTo:3 -->

- [1. 概述](#1-概述)
    - [1.1. ZooKeeper 是什么？](#11-zookeeper-是什么)
    - [1.2. ZooKeeper 提供了什么？](#12-zookeeper-提供了什么)
    - [1.3. Zookeeper 的特性](#13-zookeeper-的特性)
    - [1.4. 工作原理](#14-工作原理)
    - [1.5. Server 工作状态](#15-server-工作状态)
- [2. 文件系统](#2-文件系统)
    - [2.1. znode 类型](#21-znode-类型)
- [3. 通知机制](#3-通知机制)
- [4. 应用场景](#4-应用场景)
    - [4.1. 统一命名服务（Name Service）](#41-统一命名服务name-service)
    - [4.2. 配置管理（Configuration Management）](#42-配置管理configuration-management)
    - [4.3. 集群管理（Group Membership）](#43-集群管理group-membership)
    - [4.4. 分布式锁](#44-分布式锁)
    - [4.5. 队列管理](#45-队列管理)
- [5. 复制](#5-复制)
- [6. 选举流程](#6-选举流程)
- [7. 同步流程](#7-同步流程)
- [8. 资源](#8-资源)
    - [8.1. 官方资源](#81-官方资源)
    - [8.2. 文章](#82-文章)

<!-- /TOC -->

## 1. 概述

### 1.1. ZooKeeper 是什么？

ZooKeeper 作为一个分布式的服务框架，主要用来解决分布式集群中应用系统的一致性问题，它能提供基于类似于文件系统的目录节点树方式的数据存储，但是 ZooKeeper 并不是用来专门存储数据的，它的作用主要是用来维护和监控你存储的数据的状态变化。通过监控这些数据状态的变化，从而可以达到基于数据的集群管理。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/rpc/zookeeper/zookeeper-service.png" />
</div>

### 1.2. ZooKeeper 提供了什么？

1.  文件系统
2.  通知机制

### 1.3. Zookeeper 的特性

- 最终一致性：client 不论连接到哪个 Server，展示给它都是同一个视图，这是 zookeeper 最重要的性能。
- 可靠性：具有简单、健壮、良好的性能，如果消息被到一台服务器接受，那么它将被所有的服务器接受。
- 实时性：Zookeeper 保证客户端将在一个时间间隔范围内获得服务器的更新信息，或者服务器失效的信息。但由于网络延时等原因，Zookeeper 不能保证两个客户端能同时得到刚更新的数据，如果需要最新数据，应该在读数据之前调用 sync()接口。
- 等待无关（wait-free）：慢的或者失效的 client 不得干预快速的 client 的请求，使得每个 client 都能有效的等待。
- 原子性：更新只能成功或者失败，没有中间状态。
- 顺序性：包括全局有序和偏序两种：全局有序是指如果在一台服务器上消息 a 在消息 b 前发布，则在所有 Server 上消息 a 都将在消息 b 前被发布；偏序是指如果一个消息 b 在消息 a 后被同一个发送者发布，a 必将排在 b 前面。

### 1.4. 工作原理

ZooKeeper 的核心是原子广播，这个机制保证了各个 Server 之间的同步。实现这个机制的协议叫做 Zab 协议。Zab 协议有两种模式，它们分别是恢复模式（选主）和广播模式（同步）。当服务启动或者在领导者崩溃后，Zab 就进入了恢复模式，当领导者被选举出来，且大多数 Server 完成了和 leader 的状态同步以后，恢复模式就结束了。状态同步保证了 leader 和 Server 具有相同的系统状态。

为了保证事务的顺序一致性，ZooKeeper 采用了递增的事务 id 号（zxid）来标识事务。所有的提议（proposal）都在被提出的时候加上了 zxid。实现中 zxid 是一个 64 位的数字，它高 32 位是 epoch 用来标识 leader 关系是否改变，每次一个 leader 被选出来，它都会有一个新的 epoch，标识当前属于那个 leader 的统治时期。低 32 位用于递增计数。

### 1.5. Server 工作状态

每个 Server 在工作过程中有三种状态：

- LOOKING - 当前 Server 不知道 leader 是谁，正在搜寻
- LEADING - 当前 Server 即为选举出来的 leader
- FOLLOWING - leader 已经选举出来，当前 Server 与之同步

## 2. 文件系统

ZooKeeper 会维护一个具有层次关系的数据结构，它非常类似于一个标准的文件系统，如下图所示：

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/rpc/zookeeper/Zookeeper数据结构.gif" />
</div>

ZooKeeper 这种数据结构有如下这些特点：

- 每个子目录项如 NameService 都被称作为 znode，这个 znode 是被它所在的路径唯一标识，如 Server1 这个 znode 的标识为 /NameService/Server1
- znode 可以有子节点目录，并且每个 znode 可以存储数据，注意 EPHEMERAL 类型的目录节点不能有子节点目录
- znode 是有版本的，每个 znode 中存储的数据可以有多个版本，也就是一个访问路径中可以存储多份数据
- znode 可以是临时节点，一旦创建这个 znode 的客户端与服务器失去联系，这个 znode 也将自动删除，ZooKeeper 的客户端和服务器通信采用长连接方式，每个客户端和服务器通过心跳来保持连接，这个连接状态称为 session，如果 znode 是临时节点，这个 session 失效，znode 也就删除了
- znode 的目录名可以自动编号，如 App1 已经存在，再创建的话，将会自动命名为 App2
- znode 可以被监控，包括这个目录节点中存储的数据的修改，子节点目录的变化等，一旦变化可以通知设置监控的客户端，这个是 ZooKeeper 的核心特性，ZooKeeper 的很多功能都是基于这个特性实现的，后面在典型的应用场景中会有实例介绍

### 2.1. znode 类型

1.  PERSISTENT(持久化目录节点) - 客户端与 zookeeper 断开连接后，该节点依旧存在
2.  PERSISTENT_SEQUENTIAL(持久化顺序编号目录节点) - 客户端与 zookeeper 断开连接后，该节点依旧存在，只是 Zookeeper 给该节点名称进行顺序编号
3.  EPHEMERAL(临时目录节点) - 客户端与 zookeeper 断开连接后，该节点被删除
4.  EPHEMERAL_SEQUENTIAL(临时顺序编号目录节点) - 客户端与 zookeeper 断开连接后，该节点被删除，只是 Zookeeper 给该节点名称进行顺序编号

## 3. 通知机制

客户端注册监听它关心的目录节点，当目录节点发生变化（数据改变、被删除、子目录节点增加删除）时，zookeeper 会通知客户端。

## 4. 应用场景

### 4.1. 统一命名服务（Name Service）

分布式应用中，通常需要有一套完整的命名规则，既能够产生唯一的名称又便于人识别和记住，通常情况下用树形的名称结构是一个理想的选择，树形的名称结构是一个有层次的目录结构，既对人友好又不会重复。说到这里你可能想到了 JNDI，没错 ZooKeeper 的 Name Service 与 JNDI 能够完成的功能是差不多的，它们都是将有层次的目录结构关联到一定资源上，但是 ZooKeeper 的 Name Service 更加是广泛意义上的关联，也许你并不需要将名称关联到特定资源上，你可能只需要一个不会重复名称，就像数据库中产生一个唯一的数字主键一样。

Name Service 已经是 ZooKeeper 内置的功能，你只要调用 ZooKeeper 的 API 就能实现。如调用 create 接口就可以很容易创建一个目录节点。

### 4.2. 配置管理（Configuration Management）

配置的管理在分布式应用环境中很常见，例如同一个应用系统需要多台 PC Server 运行，但是它们运行的应用系统的某些配置项是相同的，如果要修改这些相同的配置项，那么就必须同时修改每台运行这个应用系统的 PC Server，这样非常麻烦而且容易出错。

像这样的配置信息完全可以交给 ZooKeeper 来管理，将配置信息保存在 ZooKeeper 的某个目录节点中，然后将所有需要修改的应用机器监控配置信息的状态，一旦配置信息发生变化，每台应用机器就会收到 ZooKeeper 的通知，然后从 ZooKeeper 获取新的配置信息应用到系统中。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/rpc/zookeeper/Zookeeper配置管理.gif" />
</div>

### 4.3. 集群管理（Group Membership）

ZooKeeper 能够很容易的实现集群管理的功能，如有多台 Server 组成一个服务集群，那么必须要一个“总管”知道当前集群中每台机器的服务状态，一旦有机器不能提供服务，集群中其它集群必须知道，从而做出调整重新分配服务策略。同样当增加集群的服务能力时，就会增加一台或多台 Server，同样也必须让“总管”知道。

ZooKeeper 不仅能够帮你维护当前的集群中机器的服务状态，而且能够帮你选出一个“总管”，让这个总管来管理集群，这就是 ZooKeeper 的另一个功能 Leader Election。

它们的实现方式都是在 ZooKeeper 上创建一个 EPHEMERAL 类型的目录节点，然后每个 Server 在它们创建目录节点的父目录节点上调用 getChildren(String path, boolean watch) 方法并设置 watch 为 true，由于是 EPHEMERAL 目录节点，当创建它的 Server 死去，这个目录节点也随之被删除，所以 Children 将会变化，这时 getChildren 上的 Watch 将会被调用，所以其它 Server 就知道已经有某台 Server 死去了。新增 Server 也是同样的原理。

ZooKeeper 如何实现 Leader Election，也就是选出一个 Master Server。和前面的一样每台 Server 创建一个 EPHEMERAL 目录节点，不同的是它还是一个 SEQUENTIAL 目录节点，所以它是个 EPHEMERAL_SEQUENTIAL 目录节点。之所以它是 EPHEMERAL_SEQUENTIAL 目录节点，是因为我们可以给每台 Server 编号，我们可以选择当前是最小编号的 Server 为 Master，假如这个最小编号的 Server 死去，由于是 EPHEMERAL 节点，死去的 Server 对应的节点也被删除，所以当前的节点列表中又出现一个最小编号的节点，我们就选择这个节点为当前 Master。这样就实现了动态选择 Master，避免了传统意义上单 Master 容易出现单点故障的问题。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/rpc/zookeeper/Zookeeper集群管理结构.gif" />
</div>

### 4.4. 分布式锁

ZooKeeper 实现分布式锁的步骤：

1.  创建一个目录 mylock；
2.  线程 A 想获取锁就在 mylock 目录下创建临时顺序节点；
3.  获取 mylock 目录下所有的子节点，然后获取比自己小的兄弟节点，如果不存在，则说明当前线程顺序号最小，获得锁；
4.  线程 B 获取所有节点，判断自己不是最小节点，设置监听比自己次小的节点；
5.  线程 A 处理完，删除自己的节点，线程 B 监听到变更事件，判断自己是不是最小的节点，如果是则获得锁。

ZooKeeper 版本的分布式锁问题相对比较来说少。

- 锁的占用时间限制：redis 就有占用时间限制，而 ZooKeeper 则没有，最主要的原因是 redis 目前没有办法知道已经获取锁的客户端的状态，是已经挂了呢还是正在执行耗时较长的业务逻辑。而 ZooKeeper 通过临时节点就能清晰知道，如果临时节点存在说明还在执行业务逻辑，如果临时节点不存在说明已经执行完毕释放锁或者是挂了。由此看来 redis 如果能像 ZooKeeper 一样添加一些与客户端绑定的临时键，也是一大好事。
- 是否单点故障：redis 本身有很多中玩法，如客户端一致性 hash，服务器端 sentinel 方案或者 cluster 方案，很难做到一种分布式锁方式能应对所有这些方案。而 ZooKeeper 只有一种玩法，多台机器的节点数据是一致的，没有 redis 的那么多的麻烦因素要考虑。

总体上来说 ZooKeeper 实现分布式锁更加的简单，可靠性更高。但 ZooKeeper 因为需要频繁的创建和删除节点，性能上不如 Redis 方式。

### 4.5. 队列管理

ZooKeeper 可以处理两种类型的队列：

1.  当一个队列的成员都聚齐时，这个队列才可用，否则一直等待所有成员到达，这种是同步队列。
2.  队列按照 FIFO 方式进行入队和出队操作，例如实现生产者和消费者模型。

同步队列用 ZooKeeper 实现的实现思路如下：

创建一个父目录 /synchronizing，每个成员都监控标志（Set Watch）位目录 /synchronizing/start 是否存在，然后每个成员都加入这个队列，加入队列的方式就是创建 /synchronizing/member_i 的临时目录节点，然后每个成员获取 / synchronizing 目录的所有目录节点，也就是 member_i。判断 i 的值是否已经是成员的个数，如果小于成员个数等待 /synchronizing/start 的出现，如果已经相等就创建 /synchronizing/start。

## 5. 复制

ZooKeeper 作为一个集群提供一致的数据服务，自然，它要在所有机器间做数据复制。

从客户端读写访问的透明度来看，数据复制集群系统分下面两种：

- 写主(WriteMaster) ：对数据的修改提交给指定的节点。读无此限制，可以读取任何一个节点。这种情况下客户端需要对读与写进行区别，俗称读写分离；
- 写任意(Write Any)：对数据的修改可提交给任意的节点，跟读一样。这种情况下，客户端对集群节点的角色与变化透明。

对 ZooKeeper 来说，它采用的方式是写任意。通过增加机器，它的读吞吐能力和响应能力扩展性非常好，而写，随着机器的增多吞吐能力肯定下降（这也是它建立 observer 的原因），而响应能力则取决于具体实现方式，是延迟复制保持最终一致性，还是立即复制快速响应。

## 6. 选举流程

选举状态：

- LOOKING，竞选状态。
- FOLLOWING，随从状态，同步 leader 状态，参与投票。
- OBSERVING，观察状态,同步 leader 状态，不参与投票。
- LEADING，领导者状态。

ZooKeeper 选举流程基于 Paxos 算法。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/JavaWeb/master/images/distributed/rpc/zookeeper/ZooKeeper选举流程图.jpg" width="640"/>
</div>

1.  选举线程由当前 Server 发起选举的线程担任，其主要功能是对投票结果进行统计，并选出推荐的 Server；
2.  选举线程首先向所有 Server 发起一次询问(包括自己)；
3.  选举线程收到回复后，验证是否是自己发起的询问(验证 zxid 是否一致)，然后获取对方的 id(myid)，并存储到当前询问对象列表中，最后获取对方提议的 leader 相关信息(id,zxid)，并将这些信息存储到当次选举的投票记录表中；
4.  收到所有 Server 回复以后，就计算出 zxid 最大的那个 Server，并将这个 Server 相关信息设置成下一次要投票的 Server；
5.  线程将当前 zxid 最大的 Server 设置为当前 Server 要推荐的 Leader，如果此时获胜的 Server 获得 n/2 + 1 的 Server 票数，设置当前推荐的 leader 为获胜的 Server，将根据获胜的 Server 相关信息设置自己的状态，否则，继续这个过程，直到 leader 被选举出来。 通过流程分析我们可以得出：要使 Leader 获得多数 Server 的支持，则 Server 总数必须是奇数 2n+1，且存活的 Server 的数目不得少于 n+1. 每个 Server 启动后都会重复以上流程。在恢复模式下，如果是刚从崩溃状态恢复的或者刚启动的 server 还会从磁盘快照中恢复数据和会话信息，zk 会记录事务日志并定期进行快照，方便在恢复时进行状态恢复。

述 Leader 选择过程中的状态变化，这是假设全部实例中均没有数据，假设服务器启动顺序分别为：A,B,C。

## 7. 同步流程

选完 Leader 以后，zk 就进入状态同步过程。

1.  Leader 等待 server 连接；
2.  Follower 连接 leader，将最大的 zxid 发送给 leader；
3.  Leader 根据 follower 的 zxid 确定同步点；
4.  完成同步后通知 follower 已经成为 uptodate 状态；
5.  Follower 收到 uptodate 消息后，又可以重新接受 client 的请求进行服务了。

## 8. 资源

### 8.1. 官方资源

| [官网](http://zookeeper.apache.org/) | [官网文档](https://cwiki.apache.org/confluence/display/ZOOKEEPER) | [Github](https://github.com/apache/zookeeper) |

### 8.2. 文章

[分布式服务框架 ZooKeeper -- 管理分布式环境中的数据](https://www.ibm.com/developerworks/cn/opensource/os-cn-zookeeper/index.html)
[ZooKeeper 的功能以及工作原理](https://www.cnblogs.com/felixzh/p/5869212.html)
