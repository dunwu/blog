---
title: ZooKeeper 原理
date: 2020-06-02 22:28:54
categories:
  - 分布式
  - 分布式协同
  - ZooKeeper
tags:
  - 分布式
  - 协同
  - zookeeper
  - 面试
permalink: /pages/f261d4e3/
---

# ZooKeeper 面试

## ZooKeeper 简介

### 【基础】什么是 ZooKeeper？

:::details 要点

Zookeeper 是一个开源的分布式协调服务，目前由 Apache 进行维护。Zookeeper 可以用于实现分布式系统中常见的发布/订阅、负载均衡、命令服务、分布式协调/通知、集群管理、Master 选举、分布式锁和分布式队列等功能。

Zookeeper 具有以下特性：

- **顺序一致性**：从一个客户端发起的事务请求，最终都会严格按照其发起顺序被应用到 Zookeeper 中；
- **原子性**：所有事务请求的处理结果在整个集群中所有机器上都是一致的；不存在部分机器应用了该事务，而另一部分没有应用的情况；
- **单一视图**：所有客户端看到的服务端数据模型都是一致的；
- **可靠性**：一旦服务端成功应用了一个事务，则其引起的改变会一直保留，直到被另外一个事务所更改；
- **实时性**：一旦一个事务被成功应用后，Zookeeper 可以保证客户端立即可以读取到这个事务变更后的最新状态的数据。

:::

### 【基础】ZooKeeper 中有哪些应用场景？

:::details 要点

**ZooKeeper 可以用于发布/订阅、负载均衡、命令服务、分布式协调/通知、集群管理、Master 选举、分布式锁和分布式队列等功能** 。

#### 发布订阅

通过 Zookeeper 进行数据的发布与订阅其实可以说是它提供的最基本功能，它能够允许多个客户端同时订阅某一个节点的变更并在变更发生时执行我们预先设置好的回调函数，在运行时改变服务的配置和行为：

```java
ZooKeeper zk = new ZooKeeper("localhost", 3000, null);
zk.getData("/config", new Watcher() {
    public void process(WatchedEvent watchedEvent) {
        System.out.println(watchedEvent.toString());
    }
}, null);
zk.setData("/config", "draven".getBytes(), 0);

// WatchedEvent state:SyncConnected type:NodeDataChanged path:/config
```

发布与订阅是 Zookeeper 提供的一个最基本的功能，它的使用非常的简单，我们可以在 `getData` 中传入实现 `process` 方法的 `Watcher` 对象，在每次改变节点的状态时，`process` 方法都会被调用，在这个方法中就可以对变更进行响应动态修改一些行为。

![zookeeper-pubsub](https://img.draveness.me/2018-09-22-zookeeper-pubsub.png)

通过 Zookeeper 这个中枢，每一个客户端对节点状态的改变都能够推送给节点的订阅者，在发布订阅模型中，Zookeeper 的每一个节点都可以被理解成一个主题，每一个客户端都可以向这个主题推送详细，同时也可以订阅这个主题中的消息；只是 Zookeeper 引入了文件系统的父子层级的概念将发布订阅功能实现得更加复杂。

```java
public static enum EventType {
    None(-1),
    NodeCreated(1),
    NodeDeleted(2),
    NodeDataChanged(3),
    NodeChildrenChanged(4);
}
```

如果我们订阅了一个节点的变更信息，那么该节点的子节点出现数量变更时就会调用 `process` 方法通知观察者，这也意味着更复杂的实现，同时和专门做发布订阅的中间件相比也没有性能优势，在海量推送的应用场景下，消息队列更能胜任，而 Zookeeper 更适合做一些类似服务配置的动态下发的工作。

#### 命名服务

在分布式系统中，通常需要一个全局唯一的名字，如生成全局唯一的订单号等，ZooKeeper 可以通过顺序节点的特性来生成全局唯一 ID，从而可以对分布式系统提供命名服务。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412240736223.png)

#### 配置管理

利用 ZooKeeper 的观察机制，可以将其作为一个高可用的配置存储器，允许分布式应用的参与者检索和更新配置文件。

#### 分布式锁

可以通过 ZooKeeper 的临时节点和 Watcher 机制来实现分布式排它锁。

举例来说，有一个分布式系统，有三个节点 A、B、C，试图通过 ZooKeeper 获取分布式锁。

（1）访问 `/lock` （这个目录路径由程序自己决定），创建 **带序列号的临时节点（EPHEMERAL）** 。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412240738997.png)

（2）每个节点尝试获取锁时，拿到 `/locks`节点下的所有子节点（`id_0000`,`id_0001`,`id_0002`），**判断自己创建的节点是不是序列号最小的**

- 如果序列号是最小的，则成功获取到锁。
  - 释放锁：执行完操作后，把创建的节点给删掉。
- 如果不是，则监听比自己要小 1 的节点变化。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412240738641.png)

（3）释放锁，即删除自己创建的节点。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412240739623.png)

图中，NodeA 删除自己创建的节点 `id_0000`，NodeB 监听到变化，发现自己的节点已经是最小节点，即可获取到锁。

#### 集群管理

ZooKeeper 还能解决大多数分布式系统中的协调问题：

- **可以通过创建临时节点来建立心跳检测机制**。如果分布式系统的某个服务节点宕机了，则其持有的会话会超时，此时该临时节点会被删除，相应的监听事件就会被触发。
- **分布式系统的每个服务节点还可以将自己的节点状态写入临时节点，从而完成状态报告或节点工作进度汇报**。
- **通过数据的订阅和发布功能，ZooKeeper 还能对分布式系统进行模块的解耦和任务的调度**。
- **通过监听机制，还能对分布式系统的服务节点进行动态上下线**，从而实现服务的动态扩容。

#### 选举 Leader 节点

分布式系统一个重要的模式就是主从模式 (Leader/Followers)，ZooKeeper 可以用于该模式下的 Leader 选举。可以让所有服务节点去竞争性地创建同一个 ZNode，由于 ZooKeeper 不能有路径相同的 ZNode，必然只有一个服务节点能够创建成功，这样该服务节点就可以成为 Leader 节点。

#### 队列管理

ZooKeeper 可以处理两种类型的队列：

1. 当一个队列的成员都聚齐时，这个队列才可用，否则一直等待所有成员到达，这种是同步队列。
2. 队列按照 FIFO 方式进行入队和出队操作，例如实现生产者和消费者模型。

同步队列用 ZooKeeper 实现的实现思路如下：

创建一个父目录 `/synchronizing`，每个成员都监控标志（Set Watch）位目录 `/synchronizing/start` 是否存在，然后每个成员都加入这个队列，加入队列的方式就是创建 `/synchronizing/member_i` 的临时目录节点，然后每个成员获取 `/synchronizing` 目录的所有目录节点，也就是 `member_i`。判断 i 的值是否已经是成员的个数，如果小于成员个数等待 `/synchronizing/start` 的出现，如果已经相等就创建 `/synchronizing/start`。

:::

## ZooKeeper 存储

### 【基础】ZooKeeper 如何存储数据？

:::details 要点

**ZooKeeper 采用类似于文件系统的层级结构存储数据**。

树中的节点被称为 **`znode`**，其中根节点为 `/`，每个节点上都会保存自己的数据和节点信息。znode 可以用于存储数据，并且有一个与之相关联的 ACL（详情可见 [ACL](#ACL)）。ZooKeeper 的设计目标是实现协调服务，而不是真的作为一个文件存储，因此 znode 存储数据的**大小被限制在 1MB 以内**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412240730789.png)

**ZooKeeper 的数据访问具有原子性**。其读写操作都是要么全部成功，要么全部失败。

znode 通过路径被引用。**znode 节点路径必须是绝对路径**。

:::

### 【基础】ZooKeeper 有几种节点类型？

:::details 要点

znode 其实有 `PERSISTENT`、`PERSISTENT_SEQUENTIAL`、`EPHEMERAL` 和 `EPHEMERAL_SEQUENTIAL` 四种类型，它们是临时与持久、顺序与非顺序两个不同的方向组合成的四种类型。

临时节点是客户端在连接 Zookeeper 时才会保持存在的节点，一旦客户端和服务端之间的连接中断，当前连接持有的所有节点都会被删除，而持久的节点不会随着会话连接的中断而删除，它们需要被客户端主动删除；Zookeeper 中另一种节点的特性就是顺序和非顺序，如果我们使用 Zookeeper 创建了顺序的节点，那么所有节点就会在名字的末尾附加一个序列号，序列号是一个由父节点维护的单调递增计数器。

:::

## ZooKeeper 架构

### 【中级】ZooKeeper 的设计目标是什么？

:::details 要点

Zookeeper 致力于为那些高吞吐的大型分布式系统提供一个高性能、高可用、且具有严格顺序访问控制能力的分布式协调服务。它具有以下四个目标：

目标一：简单的数据模型

Zookeeper 通过树形结构来存储数据，它由一系列被称为 znode 的数据节点组成，类似于常见的文件系统。不过和常见的文件系统不同，Zookeeper 将数据全量存储在内存中，以此来实现高吞吐，减少访问延迟。

[![img](https://camo.githubusercontent.com/9290aabdd522e9ea5d14d9ea4c3618614daad590ae3d31dc9583c2d4f12f10d9/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f7a6f6f6b65657065722d7a6b6e616d6573706163652e6a7067)](https://camo.githubusercontent.com/9290aabdd522e9ea5d14d9ea4c3618614daad590ae3d31dc9583c2d4f12f10d9/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f7a6f6f6b65657065722d7a6b6e616d6573706163652e6a7067)

目标二：构建集群

可以由一组 Zookeeper 服务构成 Zookeeper 集群，集群中每台机器都会单独在内存中维护自身的状态，并且每台机器之间都保持着通讯，只要集群中有半数机器能够正常工作，那么整个集群就可以正常提供服务。

[![img](https://camo.githubusercontent.com/bd11318040d88613c00aa65c4a1cab6232eadb6d34f398c8a0ae2796207dffdb/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f7a6f6f6b65657065722d7a6b736572766963652e6a7067)](https://camo.githubusercontent.com/bd11318040d88613c00aa65c4a1cab6232eadb6d34f398c8a0ae2796207dffdb/68747470733a2f2f67697465652e636f6d2f68656962616979696e672f426967446174612d4e6f7465732f7261772f6d61737465722f70696374757265732f7a6f6f6b65657065722d7a6b736572766963652e6a7067)

目标三：顺序访问

对于来自客户端的每个更新请求，Zookeeper 都会分配一个全局唯一的递增 ID，这个 ID 反映了所有事务请求的先后顺序。

目标四：高性能高可用

ZooKeeper 将数据存全量储在内存中以保持高性能，并通过服务集群来实现高可用，由于 Zookeeper 的所有更新和删除都是基于事务的，所以其在读多写少的应用场景中有着很高的性能表现。

:::

### 【中级】ZooKeeper 集群有几种角色？

:::details 要点

Zookeeper 集群是一个基于主从复制的高可用集群，集群中每个节点都存储了一份数据副本（内存中）。此外，每个服务器节点承担如下三种角色中的一种：

- **Leader** - 它负责 **发起并维护与各 Follwer 及 Observer 间的心跳。所有的写操作必须要通过 Leader 完成再由 Leader 将写操作广播给其它服务器**。一个 Zookeeper 集群同一时间只会有一个实际工作的 Leader。
- **Follower** - 它会**响应 Leader 的心跳。Follower 可直接处理并返回客户端的读请求，同时会将写请求转发给 Leader 处理，并且负责在 Leader 处理写请求时对请求进行投票**。一个 Zookeeper 集群可能同时存在多个 Follower。
- **Observer** - 角色与 Follower 类似，但是无投票权。

客户端可以从任意 ZooKeeper 服务器节点读取数据，但只能通过 Leader 服务写数据并需要半数以上 Follower 的 ACK，才算写入成功。记住这个重要的知识点，下文会详细讲述。

:::

### 【中级】ZooKeeper 的权限控制如何设计的？

:::details 要点

**ZooKeeper 采用 ACL（Access Control Lists）策略来进行权限控制**。

每个 znode 创建时都会带有一个 ACL 列表，用于决定谁可以对它执行何种操作。

ACL 依赖于 ZooKeeper 的客户端认证机制。ZooKeeper 提供了以下几种认证方式：

- **digest** - 用户名和密码 来识别客户端
- **sasl** - 通过 kerberos 来识别客户端
- **ip** - 通过 IP 来识别客户端

ZooKeeper 定义了如下五种权限：

- **CREATE** - 允许创建子节点；
- **READ** - 允许从节点获取数据并列出其子节点；
- **WRITE** - 允许为节点设置数据；
- **DELETE** - 允许删除子节点；
- **ADMIN** - 允许为节点设置权限。

:::

### 【高级】ZooKeeper 的架构有什么缺点？

:::details 要点

#### ZooKeeper 不是为高可用性设计的

生产环境中常常需要通过多机房部署来容灾。出于成本考虑，一般多机房都是同时提供服务的，即一个机房撑不住所有流量。**ZooKeeper 集群只能有一个 Leader**，一旦机房之间连接出现故障，那么只有 Leader 所在的机房可以正常工作，其他机房只能停摆。于是所有流量集中到 Leader 所在的机房，由于处理不过来而导致崩溃。

即使是在同一个机房里面，由于网段的不同，在调整机房交换机的时候偶尔也会发生网段隔离的情况。实际上机房每个月基本上都会发生短暂的网络隔离之类的子网段调整。在那个时刻 ZooKeeper 将处于不可用状态。如果业务系统重度依赖 ZooKeeper（比如用 Dubbo 作为 RPC，且使用 ZooKeeper 作为注册中心），则系统的可用性将非常脆弱。

由于 ZooKeeper 对于网络隔离的极度敏感，导致 ZooKeeper 对于网络的任何风吹草动都会做出激烈反应。这使得 ZooKeeper 的**不可用**时间比较多。我们不能让 ZooKeeper 的**不可用**，变成系统的**不可用**。

#### ZooKeeper 的选举过程速度很慢

互联网环境中，网络不稳定几乎是必然的，而 ZooKeeper 网络隔离非常敏感。一旦出现网络隔离，zookeeper 就要发起选举流程。

**ZooKeeper 的选举流程通常耗时 30 到 120 秒，期间 ZooKeeper 由于没有 Leader，都是不可用的**。

对于网络里面偶尔出现的，比如半秒一秒的网络隔离，ZooKeeper 会由于选举过程，而把不可用时间放大几十倍。

#### ZooKeeper 的性能是有限的

**典型的 ZooKeeper 的 TPS 大概是一万多，无法支撑每天动辄几十亿次的调用**。因此，每次请求都去 ZooKeeper 获取业务系统信息是不可能的。

为此，ZooKeeper 的 client 必须自己缓存业务系统的信息。这就导致 ZooKeeper 提供的**强一致性**实际上是做不到的。如果我们需要强一致性，还需要其他机制来进行保障：比如用自动化脚本把业务系统的 old master 给 kill 掉，但是这可能会引发很多其他问题。

#### ZooKeeper 无法进行有效的权限控制

**ZooKeeper 的权限控制非常弱**。在大型的复杂系统里面，使用 ZooKeeper 必须自己再额外的开发一套权限控制系统，通过那套权限控制系统再访问 ZooKeeper。

额外的权限控制系统不但增加了系统复杂性和维护成本，而且降低了系统的总体性能。

#### 即使有了 ZooKeeper 也很难避免业务系统的数据不一致

由于 ZooKeeper 的性能限制，我们无法让每次系统内部调用都走 ZooKeeper，因此总有某些时刻，业务系统会存在两份数据（业务系统 client 那边缓存的业务系统信息是定时从 ZooKeeper 更新的，因此会有更新不同步的问题）。

如果要保持数据的强一致性，唯一的方法是“先 kill 掉当前 Leader，再在 ZooKeeper 上更新 Leader 信息”。是否要 kill 掉当前 Leader 这个问题上，程序是无法完全自动决定的（因为网络隔离的时候 ZooKeeper 已经不可用了，自动脚本没有全局信息，不管怎么做都可能是错的，什么都不做也可能是错的。当网络故障的时候，只有运维人员才有全局信息，程序是无法得知其他机房的情况的）。因此系统无法自动的保障数据一致性，必须要人工介入。而人工介入的典型时间是半个小时以上，我们不能让系统这么长时间不可用。因此我们必须在某个方向上进行妥协，最常见的妥协方式是放弃**强一致性**，而接受**最终一致性**。

如果我们需要人工介入才能保证*可靠的强一致性*，那么 ZooKeeper 的价值就大打折扣。

:::

## ZooKeeper 工作流

### 【中级】ZooKeeper 读操作工作流程是怎样的？

:::details 要点

**Leader/Follower/Observer 都可直接处理读请求，从本地内存中读取数据并返回给客户端即可**。

由于处理读请求不需要服务器之间的交互，**Follower/Observer 越多，整体系统的读请求吞吐量越大**，也即读性能越好。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412240730119.png)

:::

### 【中级】ZooKeeper 写操作工作流程是怎样的？

:::details 要点

所有的写请求实际上都要交给 Leader 处理。Leader 将写请求以事务形式发给所有 Follower 并等待 ACK，一旦收到半数以上 Follower 的 ACK，即认为写操作成功。

#### 写 Leader

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412240731595.png)

由上图可见，通过 Leader 进行写操作，主要分为五步：

1. 客户端向 Leader 发起写请求
2. Leader 将写请求以事务 Proposal 的形式发给所有 Follower 并等待 ACK
3. Follower 收到 Leader 的事务 Proposal 后返回 ACK
4. Leader 得到过半数的 ACK（Leader 对自己默认有一个 ACK）后向所有的 Follower 和 Observer 发送 Commmit
5. Leader 将处理结果返回给客户端

> 注意
>
> - Leader 不需要得到 Observer 的 ACK，即 Observer 无投票权。
> - Leader 不需要得到所有 Follower 的 ACK，只要收到过半的 ACK 即可，同时 Leader 本身对自己有一个 ACK。上图中有 4 个 Follower，只需其中两个返回 ACK 即可，因为 $$(2+1) / (4+1) > 1/2$$ 。
> - Observer 虽然无投票权，但仍须同步 Leader 的数据从而在处理读请求时可以返回尽可能新的数据。

#### 写 Follower/Observer

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412240731844.png)

- Follower/Observer 均可接受写请求，但不能直接处理，而需要将写请求转发给 Leader 处理。
- 除了多了一步请求转发，其它流程与直接写 Leader 无任何区别。

:::

### 【中级】ZooKeeper 事务机制是怎样的？

:::details 要点

对于来自客户端的每个更新请求，ZooKeeper 具备严格的顺序访问控制能力。

**为了保证事务的顺序一致性，ZooKeeper 采用了递增的事务 id 号（zxid）来标识事务**。

**Leader 服务会为每一个 Follower 服务器分配一个单独的队列，然后将事务 Proposal 依次放入队列中，并根据 FIFO（先进先出） 的策略进行消息发送**。Follower 服务在接收到 Proposal 后，会将其以事务日志的形式写入本地磁盘中，并在写入成功后反馈给 Leader 一个 Ack 响应。**当 Leader 接收到超过半数 Follower 的 Ack 响应后，就会广播一个 Commit 消息给所有的 Follower 以通知其进行事务提交**，之后 Leader 自身也会完成对事务的提交。而每一个 Follower 则在接收到 Commit 消息后，完成事务的提交。

所有的提议（**`proposal`**）都在被提出的时候加上了 zxid。zxid 是一个 64 位的数字，它的高 32 位是 **`epoch`** 用来标识 Leader 关系是否改变，每次一个 Leader 被选出来，它都会有一个新的 epoch，标识当前属于那个 leader 的统治时期。低 32 位用于递增计数。

详细过程如下：

1. Leader 等待 Server 连接；
2. Follower 连接 Leader，将最大的 zxid 发送给 Leader；
3. Leader 根据 Follower 的 zxid 确定同步点；
4. 完成同步后通知 follower 已经成为 uptodate 状态；
5. Follower 收到 uptodate 消息后，又可以重新接受 client 的请求进行服务了。

:::

### 【中级】ZooKeeper 监听机制是怎样的？

:::details 要点

**ZooKeeper 允许客户端监听它关心的 znode，当 znode 状态发生变化（数据变化、子节点增减变化）时，ZooKeeper 服务会通知客户端**。

需要注意的是：**ZooKeeper 的监听通知是一次性的**。无论是服务端还是客户端，一旦一个 Watcher 被触发，Zookeeper 都会将其从相应的存储中移除。这样的设计有效的减轻了服务端的压力，不然对于更新非常频繁的节点，服务端会不断的向客户端发送事件通知，无论对于网络还是服务端的压力都非常大。

客户端和服务端保持连接一般有两种形式：

- 客户端向服务端不断轮询
- 服务端向客户端推送状态

**Zookeeper 的选择是服务端主动推送状态，也就是观察机制（ `Watch` ）**。

ZooKeeper 的观察机制允许用户在指定节点上针对感兴趣的事件注册监听，当事件发生时，监听器会被触发，并将事件信息推送到客户端。

- 监听器实时触发
- 监听器总是有序的
- 创建新的 znode 数据前，客户端就能收到监听事件。

客户端使用 `getData` 等接口获取 znode 状态时传入了一个用于处理节点变更的回调，那么服务端就会主动向客户端推送节点的变更：

```java
public byte[] getData(final String path, Watcher watcher, Stat stat)
```

从这个方法中传入的 `Watcher` 对象实现了相应的 `process` 方法，每次对应节点出现了状态的改变，`WatchManager` 都会通过以下的方式调用传入 `Watcher` 的方法：

```java
Set<Watcher> triggerWatch(String path, EventType type, Set<Watcher> supress) {
    WatchedEvent e = new WatchedEvent(type, KeeperState.SyncConnected, path);
    Set<Watcher> watchers;
    synchronized (this) {
        watchers = watchTable.remove(path);
    }
    for (Watcher w : watchers) {
        w.process(e);
    }
    return watchers;
}
```

Zookeeper 中的所有数据其实都是由一个名为 `DataTree` 的数据结构管理的，所有的读写数据的请求最终都会改变这颗树的内容，在发出读请求时可能会传入 `Watcher` 注册一个回调函数，而写请求就可能会触发相应的回调，由 `WatchManager` 通知客户端数据的变化。

通知机制的实现其实还是比较简单的，通过读请求设置 `Watcher` 监听事件，写请求在触发事件时就能将通知发送给指定的客户端。

:::

### 【中级】ZooKeeper 会话机制是怎样的？

:::details 要点

**ZooKeeper 客户端通过 TCP 长连接连接到 ZooKeeper 服务集群**。**会话 (Session) 从第一次连接开始就已经建立，之后通过心跳检测机制来保持有效的会话状态**。通过这个连接，客户端可以发送请求并接收响应，同时也可以接收到 Watch 事件的通知。

每个 ZooKeeper 客户端配置中都配置了 ZooKeeper 服务器集群列表。启动时，客户端会遍历列表去尝试建立连接。如果失败，它会尝试连接下一个服务器，依次类推。

一旦一台客户端与一台服务器建立连接，这台服务器会为这个客户端创建一个新的会话。**每个会话都会有一个超时时间，若服务器在超时时间内没有收到任何请求，则相应会话被视为过期**。一旦会话过期，就无法再重新打开，且任何与该会话相关的临时 znode 都会被删除。

通常来说，会话应该长期存在，而这需要由客户端来保证。客户端可以通过心跳方式（ping）来保持会话不过期。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412240732938.png)

ZooKeeper 的会话具有四个属性：

- `sessionID` - 会话 ID，唯一标识一个会话，每次客户端创建新的会话时，Zookeeper 都会为其分配一个全局唯一的 sessionID。
- `TimeOut` - 会话超时时间，客户端在构造 Zookeeper 实例时，会配置 sessionTimeout 参数用于指定会话的超时时间，Zookeeper 客户端向服务端发送这个超时时间后，服务端会根据自己的超时时间限制最终确定会话的超时时间。
- `TickTime` - 下次会话超时时间点，为了便于 Zookeeper 对会话实行”分桶策略”管理，同时为了高效低耗地实现会话的超时检查与清理，Zookeeper 会为每个会话标记一个下次会话超时时间点，其值大致等于当前时间加上 TimeOut。
- `isClosing` - 标记一个会话是否已经被关闭，当服务端检测到会话已经超时失效时，会将该会话的 isClosing 标记为”已关闭”，这样就能确保不再处理来自该会话的心情求了。

Zookeeper 的会话管理主要是通过 `SessionTracker` 来负责，其采用了**分桶策略**（将类似的会话放在同一区块中进行管理）进行管理，以便 Zookeeper 对会话进行不同区块的隔离处理以及同一区块的统一处理。

:::

## Zab 协议

### 【中级】什么是 Zab 协议？

:::details 要点

ZooKeeper 并没有直接采用 Paxos 算法，而是采用了名为 ZAB 的一致性协议。**_ZAB 协议不是 Paxos 算法_**，只是比较类似，二者在操作上并不相同。Multi-Paxos 实现的是一系列值的共识，不关心最终达成共识的值是什么，不关心各值的顺序。而 ZooKeeper 需要确保操作的顺序性。

ZAB 协议是 Zookeeper 专门设计的一种**支持故障恢复的原子广播协议**。ZAB 协议是 ZooKeeper 的数据一致性和高可用解决方案。

ZAB 协议定义了两个可以**无限循环**的流程：

- **`选举 Leader`** - 用于故障恢复，从而保证高可用。
- **`原子广播`** - 用于主从同步，从而保证数据一致性。

:::

### 【高级】Zab 协议中故障恢复的流程是怎样的？

:::details 要点

#### 故障恢复

**ZooKeeper 集群采用一主多从模式，主从节点通过副本机制保证数据一致**。

- **如果 Follower 节点挂了** - ZooKeeper 集群中的每个节点都会单独在内存中维护自身的状态，并且各节点之间都保持着通讯，**只要集群中有半数机器能够正常工作，那么整个集群就可以正常提供服务**。
- **如果 Leader 节点挂了** - 如果 Leader 节点挂了，系统就不能正常工作了。此时，需要通过 ZAB 协议的选举 Leader 机制来进行故障恢复。

ZAB 协议的选举 Leader 机制简单来说，就是：**基于过半选举机制产生新的 Leader**，之后其他机器将从新的 Leader 上同步状态，当有过半机器完成状态同步后，就退出选举 Leader 模式，进入原子广播模式。

#### 术语

- **myid** - 每个 Zookeeper 服务器，都需要在数据文件夹下创建一个名为 myid 的文件，**该文件包含整个 Zookeeper 集群唯一的 ID（整数）**。
- **zxid** - 类似于 RDBMS 中的事务 ID，**用于标识一次更新操作的 Proposal ID**。为了保证顺序性，该 zxid 必须单调递增。因此 Zookeeper 使用一个 64 位的数来表示，高 32 位是 Leader 的 epoch，从 1 开始，每次选出新的 Leader，epoch 加一。低 32 位为该 epoch 内的序号，每次 epoch 变化，都将低 32 位的序号重置。这样保证了 zxid 的全局递增性。

#### 服务器状态

- **_LOOKING_** - 不确定 Leader 状态。该状态下的服务器认为当前集群中没有 Leader，会发起 Leader 选举
- **_FOLLOWING_** - 跟随者状态。表明当前服务器角色是 Follower，并且它知道 Leader 是谁
- **_LEADING_** - 领导者状态。表明当前服务器角色是 Leader，它会维护与 Follower 间的心跳
- **_OBSERVING_** - 观察者状态。表明当前服务器角色是 Observer，与 Folower 唯一的不同在于不参与选举，也不参与集群写操作时的投票

#### 选票数据结构

每个服务器在进行领导选举时，会发送如下关键信息

- **_logicClock_** - 每个服务器会维护一个自增的整数，名为 logicClock，它表示这是该服务器发起的第多少轮投票
- **_state_** - 当前服务器的状态
- **_self_id_** - 当前服务器的 myid
- **_self_zxid_** - 当前服务器上所保存的数据的最大 zxid
- **_vote_id_** - 被推举的服务器的 myid
- **_vote_zxid_** - 被推举的服务器上所保存的数据的最大 zxid

#### 投票流程

（1）**自增选举轮次** - Zookeeper 规定所有有效的投票都必须在同一轮次中。每个服务器在开始新一轮投票时，会先对自己维护的 logicClock 进行自增操作。

（2）**初始化选票** - 每个服务器在广播自己的选票前，会将自己的投票箱清空。该投票箱记录了所收到的选票。例：服务器 2 投票给服务器 3，服务器 3 投票给服务器 1，则服务器 1 的投票箱为 (2, 3), (3, 1), (1, 1)。票箱中只会记录每一投票者的最后一票，如投票者更新自己的选票，则其它服务器收到该新选票后会在自己票箱中更新该服务器的选票。

（3）**发送初始化选票** - 每个服务器最开始都是通过广播把票投给自己。

（4）**接收外部投票** - 服务器会尝试从其它服务器获取投票，并记入自己的投票箱内。如果无法获取任何外部投票，则会确认自己是否与集群中其它服务器保持着有效连接。如果是，则再次发送自己的投票；如果否，则马上与之建立连接。

（5）**判断选举轮次** - 收到外部投票后，首先会根据投票信息中所包含的 logicClock 来进行不同处理

- 外部投票的 logicClock 大于自己的 logicClock。说明该服务器的选举轮次落后于其它服务器的选举轮次，立即清空自己的投票箱并将自己的 logicClock 更新为收到的 logicClock，然后再对比自己之前的投票与收到的投票以确定是否需要变更自己的投票，最终再次将自己的投票广播出去。
- 外部投票的 logicClock 小于自己的 logicClock。当前服务器直接忽略该投票，继续处理下一个投票。
- 外部投票的 logickClock 与自己的相等。当时进行选票 PK。

（6）**选票 PK** - 选票 PK 是基于`(self_id, self_zxid)` 与 `(vote_id, vote_zxid)` 的对比

- 外部投票的 logicClock 大于自己的 logicClock，则将自己的 logicClock 及自己的选票的 logicClock 变更为收到的 logicClock
- 若 logicClock 一致，则对比二者的 vote_zxid，若外部投票的 vote_zxid 比较大，则将自己的票中的 vote_zxid 与 vote_myid 更新为收到的票中的 vote_zxid 与 vote_myid 并广播出去，另外将收到的票及自己更新后的票放入自己的票箱。如果票箱内已存在 (self_myid, self_zxid) 相同的选票，则直接覆盖
- 若二者 vote_zxid 一致，则比较二者的 vote_myid，若外部投票的 vote_myid 比较大，则将自己的票中的 vote_myid 更新为收到的票中的 vote_myid 并广播出去，另外将收到的票及自己更新后的票放入自己的票箱

（7）**统计选票** - 如果已经确定有过半服务器认可了自己的投票（可能是更新后的投票），则终止投票。否则继续接收其它服务器的投票。

（8）**更新服务器状态** - 投票终止后，服务器开始更新自身状态。若过半的票投给了自己，则将自己的服务器状态更新为 LEADING，否则将自己的状态更新为 FOLLOWING

通过以上流程分析，我们不难看出：要使 Leader 获得多数 Server 的支持，则 **ZooKeeper 集群节点数必须是奇数。且存活的节点数目不得少于 `N + 1`** 。

每个 Server 启动后都会重复以上流程。在恢复模式下，如果是刚从崩溃状态恢复的或者刚启动的 server 还会从磁盘快照中恢复数据和会话信息，zk 会记录事务日志并定期进行快照，方便在恢复时进行状态恢复。

:::

### 【高级】Zab 协议中原子广播的流程是怎样的？

:::details 要点

**ZooKeeper 通过副本机制来实现高可用**。

那么，ZooKeeper 是如何实现副本机制的呢？答案是：ZAB 协议的原子广播。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412240735474.png)

ZAB 协议的原子广播要求：

**_所有的写请求都会被转发给 Leader，Leader 会以原子广播的方式通知 Follow。当半数以上的 Follow 已经更新状态持久化后，Leader 才会提交这个更新，然后客户端才会收到一个更新成功的响应_**。这有些类似数据库中的两阶段提交协议。

在整个消息的广播过程中，Leader 服务器会每个事务请求生成对应的 Proposal，并为其分配一个全局唯一的递增的事务 ID(ZXID)，之后再对其进行广播。

> ZAB 是通过“一切以领导者为准”的强领导者模型和严格按照顺序提交日志，来实现操作的顺序性的，这一点和 Raft 是一样的。

:::

### 【中级】Zab 和 Paxos 有什么区别？

:::details 要点

Zab 和 Paxos 协议在实现上其实有非常多的相似点，例如：

- 主节点会向所有的从节点发出提案；
- 主节点在接收到一组从节点中一半以上节点的确认后，才会认为当前提案被提交了；
- Zab 协议中的每一个提案都包含一个 epoch 值，与 Paxos 中的 Ballot 非常相似；

因为它们有一些相同的特点，所以有的观点会认为 Zab 是 Paxos 的一个简化版本，但是 Zab 和 Paxos 在设计理念上就有着比较大的不同，两者的主要区别就在于 Zab 主要是为构建高可用的主备系统设计的，而 Paxos 能够帮助工程师搭建具有一致性的状态机系统。

作为一个一致性状态机系统，它能够保证集群中任意一个状态机副本都按照客户端的请求执行了相同顺序的请求，即使来自客户端请求是异步的并且不同客户端的接收同一个请求的顺序不同，集群中的这些副本就是会使用 Paxos 或者它的变种对提案达成一致；在集群运行的过程中，如果主节点出现了错误导致宕机，其他的节点会重新开始进行选举并处理未提交的请求。

但是在类似 Zookeeper 的高可用主备系统中，所有的副本都需要对增量的状态更新顺序达成一致，这些状态更新的变量都是由主节点创建并发送给其他的从节点的，每一个从节点都会严格按照顺序逐一的执行主节点生成的状态更新请求，如果 Zookeeper 集群中的主节点发生了宕机，新的主节点也必须严格按照顺序对请求进行恢复。

总的来说，使用状态更新节点数据的主备系统相比根据客户端请求改变状态的状态机系统对于请求的执行顺序有着更严格的要求。

> 这一节对于 Zab 和 Paxos 区别的介绍大都来自于 [Zab vs. Paxos](https://cwiki.apache.org/confluence/display/ZOOKEEPER/Zab+vs.+Paxos) ，有兴趣的读者可以阅读相关的内容。

:::

## 参考资料

- [ZooKeeper 官方文档](https://cwiki.apache.org/confluence/display/ZOOKEEPER)
- [《Hadoop 权威指南（第四版）》](https://book.douban.com/subject/27115351/)
- [《从 Paxos 到 Zookeeper 分布式一致性原理与实践》](https://item.jd.com/11622772.html)
- [详解分布式协调服务 ZooKeeper](https://draveness.me/zookeeper-chubby)