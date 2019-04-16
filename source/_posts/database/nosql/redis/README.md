---
title: 深入理解 Java 基本数据类型
categories: ['database', 'nosql']
tags: ['database', 'nosql', 'redis']
date: 2019-04-06 19:45
---

# Redis

> :notebook: 本文已归档到：「[blog](https://github.com/dunwu/blog)」

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [Redis 简介](#redis-简介)
    - [Redis 的优势](#redis-的优势)
    - [Redis 与 Memcached](#redis-与-memcached)
- [数据类型](#数据类型)
- [命令](#命令)
    - [字符串命令](#字符串命令)
    - [列表命令](#列表命令)
    - [集合命令](#集合命令)
    - [散列命令](#散列命令)
    - [有序集合命令](#有序集合命令)
    - [发布与订阅命令](#发布与订阅命令)
    - [其它命令](#其它命令)
- [使用场景](#使用场景)
- [Redis 管道](#redis-管道)
- [键的过期时间](#键的过期时间)
- [数据淘汰策略](#数据淘汰策略)
- [持久化](#持久化)
    - [快照持久化](#快照持久化)
    - [AOF 持久化](#aof-持久化)
- [发布与订阅](#发布与订阅)
- [事务](#事务)
    - [EXEC](#exec)
    - [MULTI](#multi)
    - [DISCARD](#discard)
    - [WATCH](#watch)
- [事件](#事件)
    - [文件事件](#文件事件)
    - [时间事件](#时间事件)
    - [事件的调度与执行](#事件的调度与执行)
- [集群](#集群)
    - [复制](#复制)
    - [哨兵](#哨兵)
    - [分片](#分片)
- [资料](#资料)

<!-- /TOC -->

## 简介

### Redis 简介

Redis 是一个速度非常快的非关系型数据库（NoSQL）。

Redis 可以存储键（key）和 5 种不同类型的值（value）之间的映射（mapping）。

Redis 支持很多特性，例如将内存中的数据持久化到硬盘中，使用复制来扩展读性能，使用分片来扩展写性能。

### Redis 的优势

- 性能极高 – Redis 能读的速度是 110000 次/s,写的速度是 81000 次/s。
- 丰富的数据类型 - 支持字符串、列表、集合、有序集合、散列表。
- 原子 - Redis 的所有操作都是原子性的。单个操作是原子性的。多个操作也支持事务，即原子性，通过 MULTI 和 EXEC 指令包起来。
- 持久化 - Redis 支持数据的持久化。可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。
- 备份 - Redis 支持数据的备份，即 master-slave 模式的数据备份。
- 丰富的特性 - Redis 还支持发布订阅, 通知, key 过期等等特性。

### Redis 与 Memcached

Redis 与 Memcached 因为都可以用于缓存，所以常常被拿来做比较，二者主要有以下区别：

**数据类型**

- Memcached 仅支持字符串类型；
- 而 Redis 支持五种不同种类的数据类型，使得它可以更灵活地解决问题。

**数据持久化**

- Memcached 不支持持久化；
- Redis 支持两种持久化策略：RDB 快照和 AOF 日志。

**分布式**

- Memcached 不支持分布式，只能通过在客户端使用像一致性哈希这样的分布式算法来实现分布式存储，这种方式在存储和查询时都需要先在客户端计算一次数据所在的节点。
- Redis Cluster 实现了分布式的支持。

**内存管理机制**

- Memcached 将内存分割成特定长度的块来存储数据，以完全解决内存碎片的问题，但是这种方式会使得内存的利用率不高，例如块的大小为 128 bytes，只存储 100 bytes 的数据，那么剩下的 28 bytes 就浪费掉了。
- 在 Redis 中，并不是所有数据都一直存储在内存中，可以将一些很久没用的 value 交换到磁盘。而 Memcached 的数据则会一直在内存中。

## 数据类型

> 扩展阅读：[《Redis 实战》之 Redis 数据结构简介](http://redisinaction.com/preview/chapter1.html#id7)

Redis 可以存储键与 5 种不同数据结构类型之间的映射，这 5 种数据结构类型分别为`STRING`（字符串）、`LIST`（列表）、`SET`（集合）、`HASH`（散列）和`ZSET`（有序集合）。

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/1554544262008.png"/></div>

## 命令

> 更详细内容可以阅读：
>
> - [《Redis 实战》之 Redis 命令](http://redisinaction.com/preview/chapter3.html)
> - [Redis 官方命令手册](https://redis.io/commands)

### 字符串命令

| 命令          | 用例和描述                                                                                                                                                                                                                      |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `INCR`        | `INCR key-name`——将键存储的值加上 1                                                                                                                                                                                             |
| `DECR`        | `DECR key-name`——将键存储的值减去 1                                                                                                                                                                                             |
| `INCRBY`      | `INCRBY key-name amount`——将键存储的值加上整数`amount`                                                                                                                                                                          |
| `DECRBY`      | `DECRBY key-name amount`——将键存储的值减去整数`amount`                                                                                                                                                                          |
| `INCRBYFLOAT` | `INCRBYFLOAT key-name amount`——将键存储的值加上浮点数`amount`，这个命令在 Redis 2.6 或以上的版本可用                                                                                                                            |
| `APPEND`      | `APPEND key-name value`——将提供的值`value`追加到给定键`key-name`当前存储的值的末尾                                                                                                                                              |
| `GETRANGE`    | `GETRANGE key-name start end`——获取一个由偏移量`start`至偏移量`end`范围内所有字符组成的子串，包括`start`和`end`在内                                                                                                             |
| `SETRANGE`    | `SETRANGE key-name offset value`——将从`start`偏移量开始的子串设置为给定`value`                                                                                                                                                  |
| `GETBIT`      | `GETBIT key-name offset`——将字节串看作是二进制位串（bit string），并返回位串中偏移量为`offset`的二进制位的值                                                                                                                    |
| `SETBIT`      | `SETBIT key-name offset value`——将字节串看作是二进制位串，并将位串中偏移量为`offset`的二进制位的值设置为`value`                                                                                                                 |
| `BITCOUNT`    | `BITCOUNT key-name [start end]`——统计二进制位串里面值为 1 的二进制位的数量，如果给定了可选的`start`偏移量和`end`偏移量，那么只对偏移量指定范围内的二进制位进行统计                                                              |
| `BITOP`       | `BITOP operation dest-key key-name [key-name ...]`——对一个或多个二进制位串执行包括并（`AND`）、或（`OR`）、异或（`XOR`）、 非（`NOT`）在内的任意一种按位运算操作（bitwise operation），并将计算得出的结果保存在`dest-key`键里面 |

### 列表命令

| 命令         | 用例和描述                                                                                                                                                                                                                   |
| :----------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RPUSH`      | `RPUSH key-name value [value ...]`——将一个或多个值推入到列表的右端                                                                                                                                                           |
| `LPUSH`      | `LPUSH key-name value [value ...]`——将一个或多个值推入到列表的左端                                                                                                                                                           |
| `RPOP`       | `RPOP key-name`——移除并返回列表最右端的元素                                                                                                                                                                                  |
| `LPOP`       | `LPOP key-name`——移除并返回列表最左端的元素                                                                                                                                                                                  |
| `LINDEX`     | `LINDEX key-name offset`——返回列表中偏移量为`offset`的元素                                                                                                                                                                   |
| `LRANGE`     | `LRANGE key-name start end`——返回列表从`start`偏移量到`end`偏移量范围内的所有元素，包括`start`和`end`                                                                                                                        |
| `LTRIM`      | `LTRIM key-name start end`——对列表进行修剪，只保留从`start`偏移量到`end`偏移量范围内的元素，包括`start`和`end`                                                                                                               |
| `BLPOP`      | `BLPOP key-name [key-name ...] timeout`——从第一个非空列表中弹出位于最左端的元素，或者在`timeout`秒之内阻塞并等待可弹出的元素出现                                                                                             |
| `BRPOP`      | `BRPOP key-name [key-name ...] timeout`——从第一个非空列表中弹出位于最右端的元素，或者在`timeout`秒之内阻塞并等待可弹出的元素出现                                                                                             |
| `RPOPLPUSH`  | `RPOPLPUSH source-key dest-key`——从`source-key`列表中弹出位于最右端的元素，然后将这个元素推入到`dest-key`列表的最左端，并向用户返回这个元素                                                                                  |
| `BRPOPLPUSH` | `BRPOPLPUSH source-key dest-key timeout`——从`source-key`列表中弹出位于最右端的元素，然后将这个元素推入到`dest-key`列表的最左端， 并向用户返回这个元素；如果`source-key`为空，那么在`timeout`秒之内阻塞并等待可弹出的元素出现 |

### 集合命令

| 命令          | 用例和描述                                                                                                                                                                                               |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SADD`        | `SADD key-name item [item ...]`——将一个或多个元素添加到集合里面，并返回被添加元素当中原本并不存在于集合里面的元素数量                                                                                    |
| `SREM`        | `SREM key-name item [item ...]`——从集合里面移除一个或多个元素，并返回被移除元素的数量                                                                                                                    |
| `SISMEMBER`   | `SISMEMBER key-name item`——检查元素`item`是否存在于集合`key-name`里                                                                                                                                      |
| `SCARD`       | `SCARD key-name`——返回集合包含的元素的数量                                                                                                                                                               |
| `SMEMBERS`    | `SMEMBERS key-name`——返回集合包含的所有元素                                                                                                                                                              |
| `SRANDMEMBER` | `SRANDMEMBER key-name [count]`——从集合里面随机地返回一个或多个元素。当`count`为正数时，命令返回的随机元素不会重复； 当`count`为负数时，命令返回的随机元素可能会出现重复                                  |
| `SPOP`        | `SPOP key-name`——从集合里面移除并返回一个随机元素                                                                                                                                                        |
| `SMOVE`       | `SMOVE source-key dest-key item`——如果集合`source-key`包含元素`item`， 那么从集合`source-key`里面移除元素`item`，并将元素`item`添加到集合`dest-key`中； 如果`item`被成功移除，那么命令返回 1，否则返回 0 |
| `SDIFF`       | `SDIFF key-name [key-name ...]`——返回那些存在于第一个集合、但不存在于其他集合中的元素（数学上的差集运算）                                                                                                |
| `SDIFFSTORE`  | `SDIFFSTORE dest-key key-name [key-name ...]`——将那些存在于第一个集合、但并不存在于其他集合中的元素（数学上的差集运算）存储到`dest-key`中                                                                |
| `SINTER`      | `SINTER key-name [key-name ...]`——返回那些同时存在于所有集合中的元素（数学上的交集运算）                                                                                                                 |
| `SINTERSTORE` | `SINTERSTORE dest-key key-name [key-name ...]`——将那些同时存在于所有集合的元素（数学上的交集运算）保存到键`dest-key`                                                                                     |
| `SUNION`      | `SUNION key-name [key-name ...]`——返回那些至少存在于一个集合中的元素（数学上的并集计算）                                                                                                                 |
| `SUNIONSTORE` | `SUNIONSTORE dest-key key-name [key-name ...]`——将那些至少存在于一个集合中的元素（数学上的并集计算）存储到`dest-key`中                                                                                   |

### 散列命令

| 命令           | 用例和描述                                                                                    |
| :------------- | :-------------------------------------------------------------------------------------------- |
| `HMGET`        | `HMGET key-name key [key ...]`——从散列里面获取一个或多个键的值                                |
| `HMSET`        | `HMSET key-name key value [key value ...]`——为散列里面的一个或多个键设置值                    |
| `HDEL`         | `HDEL key-name key [key ...]`——删除散列里面的一个或多个键值对，返回成功找到并删除的键值对数量 |
| `HLEN`         | `HLEN key-name`——返回散列包含的键值对数量                                                     |
| `HEXISTS`      | `HEXISTS key-name key`——检查给定键是否存在于散列中                                            |
| `HKEYS`        | `HKEYS key-name`——获取散列包含的所有键                                                        |
| `HVALS`        | `HVALS key-name`——获取散列包含的所有值                                                        |
| `HGETALL`      | `HGETALL key-name`——获取散列包含的所有键值对                                                  |
| `HINCRBY`      | `HINCRBY key-name key increment`——将键`key`保存的值加上整数`increment`                        |
| `HINCRBYFLOAT` | `HINCRBYFLOAT key-name key increment`——将键`key`保存的值加上浮点数`increment`                 |

### 有序集合命令

| `ZADD`             | `ZADD key-name score member [score member ...]`——将带有给定分值的成员添加到有序集合里面                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ZREM`             | `ZREM key-name member [member ...]`——从有序集合里面移除给定的成员，并返回被移除成员的数量                                                                      |
| `ZCARD`            | `ZCARD key-name`——返回有序集合包含的成员数量                                                                                                                   |
| `ZINCRBY`          | `ZINCRBY key-name increment member`——将`member`成员的分值加上`increment`                                                                                       |
| `ZCOUNT`           | `ZCOUNT key-name min max`——返回分值介于`min`和`max`之间的成员数量                                                                                              |
| `ZRANK`            | `ZRANK key-name member`——返回成员`member`在`key-name`中的排名                                                                                                  |
| `ZSCORE`           | `ZSCORE key-name member`——返回成员`member`的分值                                                                                                               |
| `ZRANGE`           | `ZRANGE key-name start stop [WITHSCORES]`——返回有序集合中排名介于`start`和`stop`之间的成员，如果给定了可选的`WITHSCORES`选项，那么命令会将成员的分值也一并返回 |
| `ZREVRANK`         | `ZREVRANK key-name member`——返回有序集合里成员`member`所处的位置，成员按照分值从大到小排列                                                                     |
| `ZREVRANGE`        | `ZREVRANGE key-name start stop [WITHSCORES]`——返回有序集合给定排名范围内的成员，成员按照分值从大到小排列                                                       |
| `ZRANGEBYSCORE`    | `ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]`——返回有序集合中，分值介于`min`和`max`之间的所有成员                                              |
| `ZREVRANGEBYSCORE` | `ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]`——获取有序集合中分值介于`min`和`max`之间的所有成员，并按照分值从大到小的顺序来返回它们         |
| `ZREMRANGEBYRANK`  | `ZREMRANGEBYRANK key-name start stop`——移除有序集合中排名介于`start`和`stop`之间的所有成员                                                                     |
| `ZREMRANGEBYSCORE` | `ZREMRANGEBYSCORE key-name min max`——移除有序集合中分值介于`min`和`max`之间的所有成员                                                                          |
| `ZINTERSTORE`      | `ZINTERSTORE dest-key key-count key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]`——对给定的有序集合执行类似于集合的交集运算                 |
| `ZUNIONSTORE`      | `ZUNIONSTORE dest-key key-count key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]`——对给定的有序集合执行类似于集合的并集运算                 |

### 发布与订阅命令

| 命令           | 用例和描述                                                                                                    |
| :------------- | :------------------------------------------------------------------------------------------------------------ |
| `SUBSCRIBE`    | `SUBSCRIBE channel [channel ...]`——订阅给定的一个或多个频道                                                   |
| `UNSUBSCRIBE`  | `UNSUBSCRIBE [channel [channel ...]]`——退订给定的一个或多个频道，如果执行时没有给定任何频道，那么退订所有频道 |
| `PUBLISH`      | `PUBLISH channel message`——向给定频道发送消息                                                                 |
| `PSUBSCRIBE`   | `PSUBSCRIBE pattern [pattern ...]`——订阅与给定模式相匹配的所有频道                                            |
| `PUNSUBSCRIBE` | `PUNSUBSCRIBE [pattern [pattern ...]]`——退订给定的模式，如果执行时没有给定任何模式，那么退订所有模式          |

### 其它命令

| 命令        | 用例和描述                                                                                                                                                                                                 |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SORT`      | `SORT source-key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE dest-key]` ——根据给定的选项，对输入列表、集合或者有序集合进行排序，然后返回或者存储排序的结果 |
| `PERSIST`   | `PERSIST key-name`——移除键的过期时间                                                                                                                                                                       |
| `TTL`       | `TTL key-name`——返回给定键距离过期还有多少秒                                                                                                                                                               |
| `EXPIRE`    | `EXPIRE key-name seconds`——让键`key-name`在给定的`seconds`秒之后过期                                                                                                                                       |
| `EXPIREAT`  | `EXPIREAT key-name timestamp`——将给定键的过期时间设置为给定的 UNIX 时间戳                                                                                                                                  |
| `PTTL`      | `PTTL key-name`——返回给定键距离过期时间还有多少毫秒，这个命令在 Redis 2.6 或以上版本可用                                                                                                                   |
| `PEXPIRE`   | `PEXPIRE key-name milliseconds`——让键`key-name`在`milliseconds`毫秒之后过期，这个命令在 Redis 2.6 或以上版本可用                                                                                           |
| `PEXPIREAT` | `PEXPIREAT key-name timestamp-milliseconds`——将一个毫秒级精度的 UNIX 时间戳设置为给定键的过期时间，这个命令在 Redis 2.6 或以上版本可用                                                                     |

## 使用场景

- **缓存** - 将热点数据放到内存中，设置内存的最大使用量以及过期淘汰策略来保证缓存的命中率。
- **计数器** - Redis 这种内存数据库能支持计数器频繁的读写操作。
- **应用限流** - 限制一个网站访问流量。
- **消息队列** - 使用 List 数据类型，它是双向链表。
- **查找表** - 使用 HASH 数据类型。
- **交集运算** - 使用 SET 类型，例如求两个用户的共同好友。
- **排行榜** - 使用 ZSET 数据类型。
- **分布式 Session** - 多个应用服务器的 Session 都存储到 Redis 中来保证 Session 的一致性。
- **分布式锁** - 除了可以使用 SETNX 实现分布式锁之外，还可以使用官方提供的 RedLock 分布式锁实现。

## Redis 管道

Redis 是一种基于 C/S 模型以及请求/响应协议的 TCP 服务。

Redis 支持管道技术。管道技术允许请求以异步方式发送，即旧请求的应答还未返回的情况下，允许发送新请求。这种方式可以大大提高传输效率。

使用管道发送命令时，服务器将被迫回复一个队列答复，占用很多内存。所以，如果你需要发送大量的命令，最好是把他们按照合理数量分批次的处理。

## 键的过期时间

Redis 可以为每个键设置过期时间，当键过期时，会自动删除该键。

对于散列表这种容器，只能为整个键设置过期时间（整个散列表），而不能为键里面的单个元素设置过期时间。

可以使用 `EXPIRE` 或 `EXPIREAT` 来为 key 设置过期时间。

> 注意：当 `EXPIRE` 的时间如果设置的是负数，`EXPIREAT` 设置的时间戳是过期时间，将直接删除 key。

示例：

```py
redis> SET mykey "Hello"
"OK"
redis> EXPIRE mykey 10
(integer) 1
redis> TTL mykey
(integer) 10
redis> SET mykey "Hello World"
"OK"
redis> TTL mykey
(integer) -1
redis>
```

## 数据淘汰策略

可以设置内存最大使用量，当内存使用量超过时施行淘汰策略，具体有 6 种淘汰策略。

| 策略            | 描述                                                 |
| --------------- | ---------------------------------------------------- |
| volatile-lru    | 从已设置过期时间的数据集中挑选最近最少使用的数据淘汰 |
| volatile-ttl    | 从已设置过期时间的数据集中挑选将要过期的数据淘汰     |
| volatile-random | 从已设置过期时间的数据集中任意选择数据淘汰           |
| allkeys-lru     | 从所有数据集中挑选最近最少使用的数据淘汰             |
| allkeys-random  | 从所有数据集中任意选择数据进行淘汰                   |
| noeviction      | 禁止驱逐数据                                         |

如果使用 Redis 来缓存数据时，要保证所有数据都是热点数据，可以将内存最大使用量设置为热点数据占用的内存量，然后启用 allkeys-lru 淘汰策略，将最近最少使用的数据淘汰。

作为内存数据库，出于对性能和内存消耗的考虑，Redis 的淘汰算法（LRU、TTL）实际实现上并非针对所有 key，而是抽样一小部分 key 从中选出被淘汰 key，抽样数量可通过 maxmemory-samples 配置。

## 持久化

Redis 是内存型数据库，为了保证数据在断电后不会丢失，需要将内存中的数据持久化到硬盘上。

### 快照持久化

将某个时间点的所有数据都存放到硬盘上。

可以将快照复制到其它服务器从而创建具有相同数据的服务器副本。

如果系统发生故障，将会丢失最后一次创建快照之后的数据。

如果数据量很大，保存快照的时间会很长。

### AOF 持久化

将写命令添加到 AOF 文件（Append Only File）的末尾。

对硬盘的文件进行写入时，写入的内容首先会被存储到缓冲区，然后由操作系统决定什么时候将该内容同步到硬盘，用户可以调用 file.flush() 方法请求操作系统尽快将缓冲区存储的数据同步到硬盘。可以看出写入文件的数据不会立即同步到硬盘上，在将写命令添加到 AOF 文件时，要根据需求来保证何时同步到硬盘上。

有以下同步选项：

|   选项   |         同步频率         |
| :------: | :----------------------: |
|  always  |     每个写命令都同步     |
| everysec |       每秒同步一次       |
|    no    | 让操作系统来决定何时同步 |

- always 选项会严重减低服务器的性能；
- everysec 选项比较合适，可以保证系统奔溃时只会丢失一秒左右的数据，并且 Redis 每秒执行一次同步对服务器性能几乎没有任何影响；
- no 选项并不能给服务器性能带来多大的提升，而且也会增加系统奔溃时数据丢失的数量。

随着服务器写请求的增多，AOF 文件会越来越大。Redis 提供了一种将 AOF 重写的特性，能够去除 AOF 文件中的冗余写命令。

## 发布与订阅

订阅者订阅了频道之后，发布者向频道发送字符串消息会被所有订阅者接收到。

某个客户端使用 SUBSCRIBE 订阅一个频道，其它客户端可以使用 PUBLISH 向这个频道发送消息。

发布与订阅模式和观察者模式有以下不同：

- 观察者模式中，观察者和主题都知道对方的存在；而在发布与订阅模式中，发布者与订阅者不知道对方的存在，它们之间通过频道进行通信。
- 观察者模式是同步的，当事件触发时，主题会去调用观察者的方法；而发布与订阅模式是异步的；

## 事务

MULTI 、 EXEC 、 DISCARD 和 WATCH 是 Redis 事务相关的命令。

事务可以一次执行多个命令， 并且有以下两个重要的保证：

- 事务是一个单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。
- 事务是一个原子操作：事务中的命令要么全部被执行，要么全部都不执行。

### EXEC

EXEC 命令负责触发并执行事务中的所有命令：

- 如果客户端在使用 MULTI 开启了一个事务之后，却因为断线而没有成功执行 EXEC ，那么事务中的所有命令都不会被执行。
- 另一方面，如果客户端成功在开启事务之后执行 EXEC ，那么事务中的所有命令都会被执行。

### MULTI

MULTI 命令用于开启一个事务，它总是返回 OK 。 MULTI 执行之后， 客户端可以继续向服务器发送任意多条命令， 这些命令不会立即被执行， 而是被放到一个队列中， 当 EXEC 命令被调用时， 所有队列中的命令才会被执行。

### DISCARD

当执行 DISCARD 命令时， 事务会被放弃， 事务队列会被清空， 并且客户端会从事务状态中退出。

示例：

```py
> SET foo 1
OK
> MULTI
OK
> INCR foo
QUEUED
> DISCARD
OK
> GET foo
"1"
```

### WATCH

WATCH 命令可以为 Redis 事务提供 check-and-set （CAS）行为。

被 WATCH 的键会被监视，并会发觉这些键是否被改动过了。 如果有至少一个被监视的键在 EXEC 执行之前被修改了， 那么整个事务都会被取消， EXEC 返回 nil-reply 来表示事务已经失败。

```
WATCH mykey
val = GET mykey
val = val + 1
MULTI
SET mykey $val
EXEC
```

使用上面的代码， 如果在 WATCH 执行之后， EXEC 执行之前， 有其他客户端修改了 mykey 的值， 那么当前客户端的事务就会失败。 程序需要做的， 就是不断重试这个操作， 直到没有发生碰撞为止。

这种形式的锁被称作乐观锁， 它是一种非常强大的锁机制。 并且因为大多数情况下， 不同的客户端会访问不同的键， 碰撞的情况一般都很少， 所以通常并不需要进行重试。

WATCH 使得 EXEC 命令需要有条件地执行：事务只能在所有被监视键都没有被修改的前提下执行，如果这个前提不能满足的话，事务就不会被执行。

WATCH 命令可以被调用多次。对键的监视从 WATCH 执行之后开始生效，直到调用 EXEC 为止。

用户还可以在单个 WATCH 命令中监视任意多个键，例如：

```py
redis> WATCH key1 key2 key3
OK
```

当 EXEC 被调用时， 不管事务是否成功执行， 对所有键的监视都会被取消。

另外， 当客户端断开连接时， 该客户端对键的监视也会被取消。

使用无参数的 UNWATCH 命令可以手动取消对所有键的监视。 对于一些需要改动多个键的事务， 有时候程序需要同时对多个键进行加锁， 然后检查这些键的当前值是否符合程序的要求。 当值达不到要求时， 就可以使用 UNWATCH 命令来取消目前对键的监视， 中途放弃这个事务， 并等待事务的下次尝试。

## 事件

Redis 服务器是一个事件驱动程序。

### 文件事件

服务器通过套接字与客户端或者其它服务器进行通信，文件事件就是对套接字操作的抽象。

Redis 基于 Reactor 模式开发了自己的网络时间处理器，使用 I/O 多路复用程序来同时监听多个套接字，并将到达的时间传送给文件事件分派器，分派器会根据套接字产生的事件类型调用响应的时间处理器。

### 时间事件

服务器有一些操作需要在给定的时间点执行，时间事件是对这类定时操作的抽象。

时间事件又分为：

- 定时事件：是让一段程序在指定的时间之内执行一次；
- 周期性事件：是让一段程序每隔指定时间就执行一次。

Redis 将所有时间事件都放在一个无序链表中，通过遍历整个链表查找出已到达的时间事件，并调用响应的事件处理器。

### 事件的调度与执行

服务器需要不断监听文件事件的套接字才能得到待处理的文件事件，但是不能监听太久，否则时间事件无法在规定的时间内执行，因此监听时间应该根据距离现在最近的时间事件来决定。

事件调度与执行由 aeProcessEvents 函数负责，伪代码如下：

```python
def aeProcessEvents():

    ## 获取到达时间离当前时间最接近的时间事件
    time_event = aeSearchNearestTimer()

    ## 计算最接近的时间事件距离到达还有多少毫秒
    remaind_ms = time_event.when - unix_ts_now()

    ## 如果事件已到达，那么 remaind_ms 的值可能为负数，将它设为 0
    if remaind_ms < 0:
        remaind_ms = 0

    ## 根据 remaind_ms 的值，创建 timeval
    timeval = create_timeval_with_ms(remaind_ms)

    ## 阻塞并等待文件事件产生，最大阻塞时间由传入的 timeval 决定
    aeApiPoll(timeval)

    ## 处理所有已产生的文件事件
    procesFileEvents()

    ## 处理所有已到达的时间事件
    processTimeEvents()
```

将 aeProcessEvents 函数置于一个循环里面，加上初始化和清理函数，就构成了 Redis 服务器的主函数，伪代码如下：

```python
def main():

    ## 初始化服务器
    init_server()

    ## 一直处理事件，直到服务器关闭为止
    while server_is_not_shutdown():
        aeProcessEvents()

    ## 服务器关闭，执行清理操作
    clean_server()
```

从事件处理的角度来看，服务器运行流程如下：

## 集群

### 复制

通过使用 slaveof host port 命令来让一个服务器成为另一个服务器的从服务器。

一个从服务器只能有一个主服务器，并且不支持主主复制。

#### 12.1. 连接过程

1.  主服务器创建快照文件，发送给从服务器，并在发送期间使用缓冲区记录执行的写命令。快照文件发送完毕之后，开始向从服务器发送存储在缓冲区中的写命令；

2.  从服务器丢弃所有旧数据，载入主服务器发来的快照文件，之后从服务器开始接受主服务器发来的写命令；

3.  主服务器每执行一次写命令，就向从服务器发送相同的写命令。

#### 12.2. 主从链

随着负载不断上升，主服务器可能无法很快地更新所有从服务器，或者重新连接和重新同步从服务器将导致系统超载。为了解决这个问题，可以创建一个中间层来分担主服务器的复制工作。中间层的服务器是最上层服务器的从服务器，又是最下层服务器的主服务器。

### 哨兵

Sentinel（哨兵）可以监听主服务器，并在主服务器进入下线状态时，自动从从服务器中选举出新的主服务器。

### 分片

分片是将数据划分为多个部分的方法，可以将数据存储到多台机器里面，也可以从多台机器里面获取数据，这种方法在解决某些问题时可以获得线性级别的性能提升。

假设有 4 个 Reids 实例 R0，R1，R2，R3，还有很多表示用户的键 user:1，user:2，... 等等，有不同的方式来选择一个指定的键存储在哪个实例中。最简单的方式是范围分片，例如用户 id 从 0\~1000 的存储到实例 R0 中，用户 id 从 1001\~2000 的存储到实例 R1 中，等等。但是这样需要维护一张映射范围表，维护操作代价很高。还有一种方式是哈希分片，使用 CRC32 哈希函数将键转换为一个数字，再对实例数量求模就能知道应该存储的实例。

主要有三种分片方式：

- 客户端分片：客户端使用一致性哈希等算法决定键应当分布到哪个节点。
- 代理分片：将客户端请求发送到代理上，由代理转发请求到正确的节点上。
- 服务器分片：Redis Cluster。

## 资料

> :notebook: 本文已归档到：「[blog](https://github.com/dunwu/blog)」

- 官网
  - [redis 官网](https://redis.io/)
  - [redis github](https://github.com/antirez/redis)
- Sentinel
  - [官方文档](https://redis.io/topics/sentinel) 最全
  - [官方文档翻译](http://ifeve.com/redis-sentinel/) 翻译,排版一般,新
  - [官方文档翻译](http://redisdoc.com/topic/sentinel.html) 翻译有段时间了,但主要部分都包含,排版好
  - [redis sentinel 实战](https://blog.csdn.net/yanggd1987/article/details/78364667) 简要实战,能快速看出来是怎么回事
- redis client
  - [jedis](https://github.com/xetorthio/jedis)
  - [redisson](https://github.com/redisson/redisson)
  - [lettuce](https://github.com/lettuce-io/lettuce-core)
  - [spring-data-redis 官方文档 ](https://docs.spring.io/spring-data/redis/docs/1.8.13.RELEASE/reference/html/)
  - [CRUG | Redisson PRO vs. Jedis: Which Is Faster? 翻译](https://www.jianshu.com/p/82f0d5abb002)
  - [redis 分布锁 Redisson 性能测试](https://blog.csdn.net/everlasting_188/article/details/51073505)
- 站点
  - [awesome-redis](https://github.com/JamzyWang/awesome-redis)
- 书
  - [Redis 实战](https://book.douban.com/subject/26612779/)
  - [Redis 实战在线版](http://redisinaction.com/)
  - [Redis 设计与实现](https://book.douban.com/subject/25900156/)
