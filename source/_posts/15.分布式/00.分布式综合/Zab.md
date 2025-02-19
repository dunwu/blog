---
title: ZAB 协议
date: 2024-04-28 16:41:07
categories:
  - 分布式
  - 分布式综合
tags:
  - 分布式
  - 算法
  - 共识
  - ZAB
permalink: /pages/51168337/
---

# ZAB 协议

> ZooKeeper 并没有直接采用 Paxos 算法，而是采用了名为 ZAB 的一致性协议。**_ZAB 协议不是 Paxos 算法_**，只是比较类似，二者在操作上并不相同。Multi-Paxos 实现的是一系列值的共识，不关心最终达成共识的值是什么，不关心各值的顺序。而 ZooKeeper 需要确保操作的顺序性。
>
> ZAB 协议是 Zookeeper 专门设计的一种**支持故障恢复的原子广播协议**。
>
> ZAB 协议是 ZooKeeper 的数据一致性和高可用解决方案。

ZAB 协议定义了两个可以**无限循环**的流程：

- **`选举 Leader`** - 用于故障恢复，从而保证高可用。
- **`原子广播`** - 用于主从同步，从而保证数据一致性。

## 选举 Leader

### 故障恢复

ZooKeeper 集群采用一主（称为 Leader）多从（称为 Follower）模式，主从节点通过副本机制保证数据一致。

- **如果 Follower 节点挂了** - ZooKeeper 集群中的每个节点都会单独在内存中维护自身的状态，并且各节点之间都保持着通讯，**只要集群中有半数机器能够正常工作，那么整个集群就可以正常提供服务**。
- **如果 Leader 节点挂了** - 如果 Leader 节点挂了，系统就不能正常工作了。此时，需要通过 ZAB 协议的选举 Leader 机制来进行故障恢复。

ZAB 协议的选举 Leader 机制简单来说，就是：基于过半选举机制产生新的 Leader，之后其他机器将从新的 Leader 上同步状态，当有过半机器完成状态同步后，就退出选举 Leader 模式，进入原子广播模式。

### 术语

- **myid** - 每个 Zookeeper 服务器，都需要在数据文件夹下创建一个名为 myid 的文件，该文件包含整个 Zookeeper 集群唯一的 ID（整数）。
- **zxid** - 类似于 RDBMS 中的事务 ID，用于标识一次更新操作的 Proposal ID。为了保证顺序性，该 zxid 必须单调递增。因此 Zookeeper 使用一个 64 位的数来表示，高 32 位是 Leader 的 epoch，从 1 开始，每次选出新的 Leader，epoch 加一。低 32 位为该 epoch 内的序号，每次 epoch 变化，都将低 32 位的序号重置。这样保证了 zxid 的全局递增性。

### 服务器状态

- **_LOOKING_** - 不确定 Leader 状态。该状态下的服务器认为当前集群中没有 Leader，会发起 Leader 选举
- **_FOLLOWING_** - 跟随者状态。表明当前服务器角色是 Follower，并且它知道 Leader 是谁
- **_LEADING_** - 领导者状态。表明当前服务器角色是 Leader，它会维护与 Follower 间的心跳
- **_OBSERVING_** - 观察者状态。表明当前服务器角色是 Observer，与 Folower 唯一的不同在于不参与选举，也不参与集群写操作时的投票

### 选票数据结构

每个服务器在进行领导选举时，会发送如下关键信息

- **_logicClock_** - 每个服务器会维护一个自增的整数，名为 logicClock，它表示这是该服务器发起的第多少轮投票
- **_state_** - 当前服务器的状态
- **_self_id_** - 当前服务器的 myid
- **_self_zxid_** - 当前服务器上所保存的数据的最大 zxid
- **_vote_id_** - 被推举的服务器的 myid
- **_vote_zxid_** - 被推举的服务器上所保存的数据的最大 zxid

### 投票流程

（1）**自增选举轮次** - Zookeeper 规定所有有效的投票都必须在同一轮次中。每个服务器在开始新一轮投票时，会先对自己维护的 logicClock 进行自增操作。

（2）**初始化选票** - 每个服务器在广播自己的选票前，会将自己的投票箱清空。该投票箱记录了所收到的选票。例：服务器 2 投票给服务器 3，服务器 3 投票给服务器 1，则服务器 1 的投票箱为(2, 3), (3, 1), (1, 1)。票箱中只会记录每一投票者的最后一票，如投票者更新自己的选票，则其它服务器收到该新选票后会在自己票箱中更新该服务器的选票。

（3）**发送初始化选票** - 每个服务器最开始都是通过广播把票投给自己。

（4）**接收外部投票** - 服务器会尝试从其它服务器获取投票，并记入自己的投票箱内。如果无法获取任何外部投票，则会确认自己是否与集群中其它服务器保持着有效连接。如果是，则再次发送自己的投票；如果否，则马上与之建立连接。

（5）**判断选举轮次** - 收到外部投票后，首先会根据投票信息中所包含的 logicClock 来进行不同处理

- 外部投票的 logicClock 大于自己的 logicClock。说明该服务器的选举轮次落后于其它服务器的选举轮次，立即清空自己的投票箱并将自己的 logicClock 更新为收到的 logicClock，然后再对比自己之前的投票与收到的投票以确定是否需要变更自己的投票，最终再次将自己的投票广播出去。
- 外部投票的 logicClock 小于自己的 logicClock。当前服务器直接忽略该投票，继续处理下一个投票。
- 外部投票的 logickClock 与自己的相等。当时进行选票 PK。

（6）**选票 PK** - 选票 PK 是基于`(self_id, self_zxid)` 与 `(vote_id, vote_zxid)` 的对比

- 外部投票的 logicClock 大于自己的 logicClock，则将自己的 logicClock 及自己的选票的 logicClock 变更为收到的 logicClock
- 若 logicClock 一致，则对比二者的 vote_zxid，若外部投票的 vote_zxid 比较大，则将自己的票中的 vote_zxid 与 vote_myid 更新为收到的票中的 vote_zxid 与 vote_myid 并广播出去，另外将收到的票及自己更新后的票放入自己的票箱。如果票箱内已存在(self_myid, self_zxid)相同的选票，则直接覆盖
- 若二者 vote_zxid 一致，则比较二者的 vote_myid，若外部投票的 vote_myid 比较大，则将自己的票中的 vote_myid 更新为收到的票中的 vote_myid 并广播出去，另外将收到的票及自己更新后的票放入自己的票箱

（7）**统计选票** - 如果已经确定有过半服务器认可了自己的投票（可能是更新后的投票），则终止投票。否则继续接收其它服务器的投票。

（8）**更新服务器状态** - 投票终止后，服务器开始更新自身状态。若过半的票投给了自己，则将自己的服务器状态更新为 LEADING，否则将自己的状态更新为 FOLLOWING

通过以上流程分析，我们不难看出：要使 Leader 获得多数 Server 的支持，则 **ZooKeeper 集群节点数必须是奇数。且存活的节点数目不得少于 `N + 1`** 。

每个 Server 启动后都会重复以上流程。在恢复模式下，如果是刚从崩溃状态恢复的或者刚启动的 server 还会从磁盘快照中恢复数据和会话信息，zk 会记录事务日志并定期进行快照，方便在恢复时进行状态恢复。

## 原子广播（Atomic Broadcast）

**ZooKeeper 通过副本机制来实现高可用**。

那么，ZooKeeper 是如何实现副本机制的呢？答案是：ZAB 协议的原子广播。

![](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javaweb/distributed/rpc/zookeeper/zookeeper_3.png)

ZAB 协议的原子广播要求：

**_所有的写请求都会被转发给 Leader，Leader 会以原子广播的方式通知 Follow。当半数以上的 Follow 已经更新状态持久化后，Leader 才会提交这个更新，然后客户端才会收到一个更新成功的响应_**。这有些类似数据库中的两阶段提交协议。

在整个消息的广播过程中，Leader 服务器会每个事务请求生成对应的 Proposal，并为其分配一个全局唯一的递增的事务 ID(ZXID)，之后再对其进行广播。

> ZAB 是通过“一切以领导者为准”的强领导者模型和严格按照顺序提交日志，来实现操作的顺序性的，这一点和 Raft 是一样的。

# 参考资料

- [**A Simple Totally Ordered Broadcast Protocol**](https://diyhpl.us/~bryan/papers2/distributed/distributed-systems/zab.totally-ordered-broadcast-protocol.2008.pdf) - 概述 ZooKeeper 的全序广播协议（Zab）
- [ZooKeeper 简介及核心概念](https://github.com/heibaiying/BigData-Notes/blob/master/notes/Zookeeper%E7%AE%80%E4%BB%8B%E5%8F%8A%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5.md)
- [详解分布式协调服务 ZooKeeper](https://draveness.me/zookeeper-chubby)
- [Introduction to Apache ZooKeeper](https://www.slideshare.net/sauravhaloi/introduction-to-apache-zookeeper)
