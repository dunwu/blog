---
icon: logos:redis
title: Redis 哨兵
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202309190748787.png
date: 2020-06-24 10:45:38
categories:
  - 数据库
  - KV数据库
  - Redis
tags:
  - 数据库
  - KV数据库
  - Redis
  - 高可用
  - 选主
  - 故障转移
  - Raft
permalink: /pages/10970a97/
---

# Redis 哨兵

> Redis 2.8 版本，新增了哨兵模式，以支持“自动故障转移”，它是 Redis 的 HA 方案。
>
> Redis 哨兵模式由一个或多个 Sentinel 实例组成 Sentinel 集群，可以监控任意多个主服务器，以及这些主服务器的所有从服务器；并在被监视的主服务器进入下线状态时，自动将下线主服务器的某个从服务器升级为新的主服务器，然后由新的主服务器代替已下线的主服务器继续处理命令请求。
>
> 关键词：`高可用`、`监控`、`选主`、`故障转移`、`Raft`

## 哨兵简介

Redis 的主从复制模式，虽然提供了一定程度的 **高可用性（High Availability）**。但是，当主节点出现故障时，只能通过手动操作将从节点晋升为主节点，这显然是比较低效的。为了解决这个问题，Redis 2.8 版本提供了哨兵模式（Sentinel）来支持“自动故障转移”。

Redis 哨兵模式由一个或多个 Sentinel 实例组成 Sentinel 集群，可以监控任意多个主服务器，以及这些主服务器的所有从服务器；并在被监视的主服务器进入下线状态时，自动将下线主服务器的某个从服务器升级为新的主服务器，然后由新的主服务器代替已下线的主服务器继续处理命令请求。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202309190749810.png)

Sentinel 的主要功能如下：

- **`监控（Monitoring）`** - Sentinel 不断检查主从服务器是否正常在工作。
- **`通知（Notification）`** - Sentinel 可以通过一个 api 来通知系统管理员或者另外的应用程序，被监控的 Redis 实例有一些问题。
- **`自动故障转移（Automatic Failover）`** - 如果一个主服务器下线，Sentinel 会开始自动故障转移：把一个从节点提升为主节点，并重新配置其他的从节点使用新的主节点，使用 Redis 服务的应用程序在连接的时候也被通知新的地址。
- **`配置提供者（Configuration provider）`** - Sentinel 给客户端的服务发现提供来源：对于一个给定的服务，客户端连接到 Sentinels 来寻找当前主节点的地址。当故障转移发生的时候，Sentinel 将报告新的地址。

## 启动哨兵

启动一个 Sentinel 可以使用下面任意一条命令，两条命令效果完全相同。

```shell
redis-sentinel /path/to/sentinel.conf
redis-server /path/to/sentinel.conf --sentinel
```

当一个 Sentinel 启动时，它需要执行以下步骤：

1. 初始化服务器。
2. 使用 Sentinel 专用代码。
3. 初始化 Sentinel 状态。
4. 初始化 Sentinel 的主服务器列表。
5. 创建连向被监视的主服务器的网络连接。

**Sentinel 本质上是一个运行在“特殊模式”下的 Redis 服务器**。Sentinel 模式下 Redis 服务器只支持 `PING`、`SENTINEL`、`INFO`、`SUBSCRIBE`、`UNSUBSCRIBE`、`PSUBSCRIBE`、`PUNSUBSCRIBE` 七个命令。

创建连向被监视的主服务器的网络连接，Sentinel 将成为主服务器的客户端，它可以向主服务器发送命令，并从命令回复中获取相关的信息。Sentinel 会读入用户指定的配置文件， 为每个要被监视的主服务器创建相应的实例结构， 并创建连向主服务器的命令连接和订阅连接：

- **命令连接** - 专门用于向主服务器发送命令，并接受命令回复。
- **订阅连接** - 专门用于订阅主服务器的 `__sentinel__:hello` 频道。

## 监控

### 获取服务器信息

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202309190750857.png)

默认情况下， Sentinel 以“**每十秒一次**”的频率向被监视的主服务器和从服务器**发送 `INFO` 命令**，并通过分析 `INFO` 命令的回复来获取服务器的当前信息。

- 主服务器 - 可以获取主服务器自身信息，以及其所属从服务器的地址信息。
- 从服务器 - 从服务器自身信息，以及其主服务器的了解状态和地址。

**Sentinel 通过向主服务器发送 `INFO` 命令来获得主服务器属下所有从服务器的地址信息， 并为这些从服务器创建相应的实例结构， 以及连向这些从服务器的“命令连接”和“订阅连接**”。

对于监视同一个主服务器和从服务器的多个 Sentinel 来说， 它们会以“每两秒一次”的频率， 通过向被监视服务器的 `__sentinel__:hello` 频道发送消息来向其他 Sentinel 宣告自己的存在。Sentinel 只会与主服务器和从服务器创建命令连接和订阅连接， Sentinel 与 Sentinel 之间则只创建命令连接。

### 判断下线

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202309190801360.png)

#### 主观下线

**默认，每个 Sentinel 以“每秒一次”的频率，向它所知的“所有实例”发送一个 `PING` 命令**。

- “所知”是指，与 Sentinel 创建了命令连接的实例。
- “所有实例”包括了主服务器、从服务器以及其他 Sentinel 实例。

如果，**某实例在指定的时长（ `down-after-milliseconds` 设置的值，单位毫秒）中，未向 Sentinel 发送有效回复， Sentinel 会将该实例判定为“主观下线**”。

- 一个有效的 `PING` 回复可以是：`+PONG`、`-LOADING` 或者 `-MASTERDOWN`。如果服务器返回除以上三种回复之外的其他回复，又或者在 **指定时间** 内没有回复 `PING` 命令， 那么 Sentinel 认为服务器返回的回复无效。
- “主观下线”适用于所有主节点和从节点。

#### 客观下线

当一个“**主服务器**”被 Sentinel 标记为“**主观下线**”后，为了确认其是否真的下线，Sentinel 会向同样监听该主服务器的其他 Sentinel 发起询问。如果有“**足够数量**”的 Sentinel 在指定的时间范围内认为主服务器已下线，那么这个“**主服务器**”被标记为“**客观下线**”。

- Sentinel 节点通过 `sentinel is-master-down-by-addr` 命令，向其它 Sentinel 节点询问对某主服务器的 **状态判断**。
- “足够数量”是指 Sentinel 配置中 `quorum` 参数所设的值。
- 客观下线只适用于主节点。

注：默认情况下， Sentinel 以“**每十秒一次**”的频率向被监视的主服务器和从服务器**发送 `INFO` 命令**。当一个主服务器被 Sentinel 标记为“**客观下线**”时，Sentinel 向该主服务器的所有从服务器发送 `INFO` 命令的频率，会从“**每十秒一次**”改为“**每秒一次**”。

## 选主

> Redis Sentinel 采用 [Raft 协议](https://ramcloud.atlassian.net/wiki/download/attachments/6586375/raft.pdf) 实现了其 Sentinel 选主流程。Raft 是一种共识性算法，想了解其原理，可以参考 [深入剖析共识性算法 Raft](https://dunwu.github.io/waterdrop/pages/9386474c/)。

**当一个“主服务器”被判断为“客观下线”时，监视该主服务器的各个 Sentinel 会进行“协商”，选举出一个领头的 Sentinel（Leader），并由领头 Sentinel 对下线主服务器执行“故障转移”操作**。

所有在线 Sentinel 都有资格被选为 Leader。

1. 当一个 Sentinel 认定某主服务器是“客观下线”后，该 Sentinel 会先看看自己是否投过票。
   - 如果已投票给其他 Sentinel 了，在 2 倍故障转移的超时时间内，都不能竞选 **Leader**——相当于它是一个 **Follower**。
   - 如果未投票，那么该 Sentinel 可以竞选 **Leader**，转为 **Candidate**。
2. 如 Raft 协议所描述的，**Candidate** 需要完成几件事情：
   1. 更新故障转移状态为 start
   2. 将当前纪元（`epoch`） 加 1，表明开始新一轮的选举——这里的 `epoch` 相当于 Raft 协议中的 `term`。
   3. 将自身的超时时间设为当前时间加上一个随机值，随机值为 1s 内的随机毫秒数。
   4. 向其他节点发送 `is-master-down-by-addr` 命令，请求其他节点投票支持自己，命令会携带自己的 `epoch`。
   5. Candidate 会投票给自己。在 Sentinel 中，投票的方式是把自己 `master` 结构体里的 `leader` 和 `leader_epoch` 改成投给的 Sentinel 和它的 `epoch`。
3. 其他 Sentinel 收到 **Candidate** 的 `is-master-down-by-addr` 命令后，如果 Sentinel 当前 `epoch` 和 **Candidate** 传给他的 `epoch` 一样，说明他已经把自己 `master` 结构体里的 `leader` 和 `leader_epoch` 改成其他 **Candidate**，相当于把票投给了其他 **Candidate**。投票给其他 Sentinel 后，在当前 `epoch` 内，该 Sentinel 就只能成为 **Follower**。
4. **Candidate** 会不断的统计自己的票数，如果满足“当选投票条件”，则该 **Candidate** 当选 **Leader**：
   1. 票数超过一半（监控主服务器的 Sentinel 的节点数的一半 + 1）
   2. 票数超过 Sentinel 配置的 `quorum` 参数——注：Raft 协议中没有这个限制，这是 Redis Sentinel 所独有的
5. 如果在一个选举周期内（`epoch`），**Candidate** 没有满足“当选投票条件”（第 4 点描述的），则竞选失败。
6. 如果在一个选举周期内（`epoch`），没有一个 **Candidate** 满足“当选投票条件”，说明所有 **Candidate** 都竞选失败，本轮选举作废。在等待超过 2 倍故障转移的超时时间后，开始新一轮的选举。
7. 与 Raft 协议不同的是，Leader 并不会把自己成为 **Leader** 的消息发给其他 Sentinel。当 **Leader** 完成故障转移后，其他 Sentinel 检测到新的主服务器正常工作后，就会去掉“客观下线”的标识，从而不需要再发起选举。

## 故障转移

在选举产生出 Sentinel Leader 后，Sentinel Leader 将对已下线的主服务器执行故障转移操作。操作含以下三个步骤：

（1）**选出新的主服务器**

故障转移第一步，是 Sentinel Leader 在已下线主服务属下的所有从服务器中，挑选一个状态良好、数据完整的从服务器。然后，向这个从服务器发送 `SLAVEOF no one` 命令，将其转换为主服务器。

Sentinel Leader 如何选出新的主服务器：

- 删除列表中所有处于下线或断线状态的从服务器。
- 删除列表中所有最近五秒没有回复过 Sentinel Leader 的 `INFO` 命令的从服务器。
- 删除所有与已下线主服务器连接断开超过 `down-after-milliseconds * 10` 毫秒的从服务器（`down-after-milliseconds` 指定了判断主服务器下线所需的时间）。
- 之后， Sentinel Leader 先选出优先级最高的从服务器；如果优先级一样高，再选择复制偏移量最大的从服务器；如果结果还不唯一，则选出运行 ID 最小的从服务器。

（2）**修改从服务器的复制目标**

选出新的主服务器后，Sentinel Leader 会向所有从服务器发送 `SLAVEOF` 命令，让它们去复制新的主服务器。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202309190802685.png)

（3）**将旧的主服务器变为从服务器**

Sentinel Leader 将旧的主服务器标记为从服务器。当旧的主服务器重新上线，Sentinel 会向它发送 `SLAVEOF` 命令，让其成为从服务器。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202309190803617.png)

## 参考资料

- [《Redis 设计与实现》](https://item.jd.com/11486101.html)
- [渐进式解析 Redis 源码 - 哨兵 sentinel](http://www.web-lovers.com/redis-source-sentinel.html)
- [深入剖析 Redis 系列(二) - Redis 哨兵模式与高可用集群](https://juejin.im/post/5b7d226a6fb9a01a1e01ff64)
