---
icon: logos:redis
title: Redis 过期删除和内存淘汰
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202309171630222.png
date: 2023-08-23 15:14:13
categories:
  - 数据库
  - KV数据库
  - redis
tags:
  - 数据库
  - KV数据库
  - redis
  - LRU
  - LFU
permalink: /pages/1625eb55/
---

# Redis 内存管理

> 关键词：`定时删除`、`惰性删除`、`定期删除`、`LRU`、`LFU`

## Redis 过期删除

Redis 可以为每个键设置过期时间，当键过期时，会自动删除该键。

### 设置键的生存时间或过期时间

Redis 中，和键的生存时间相关的命令如下所示：

| 命令                                                | 描述                                    |
| --------------------------------------------------- | --------------------------------------- |
| [`EXPIRE`](https://redis.io/commands/expire/)       | 设置 key 的过期时间，单位为秒           |
| [`PEXPIRE`](https://redis.io/commands/pexpire/)     | 设置 key 的过期时间，单位为毫秒         |
| [`EXPIREAT`](https://redis.io/commands/expireat/)   | 设置 key 的过期时间为指定的秒级时间戳   |
| [`PEXPIREAT`](https://redis.io/commands/pexpireat/) | 设置 key 的过期时间为指定的毫秒级时间戳 |
| [`TTL`](https://redis.io/commands/ttl/)             | 返回 key 的剩余生存时间，单位为秒       |
| [`PTTL`](https://redis.io/commands/pttl/)           | 返回 key 的剩余生存时间，单位为毫秒     |
| [`PERSIST`](https://redis.io/commands/persist/)     | 移除 key 的过期时间，key 将持久保持     |

【示例】EXPIRE、TTL 操作

```shell
> set key value
OK
# 设置 key 的生存时间为 60s
> expire key 60
(integer) 1
# 查看 key 的剩余生存时间
> ttl key
(integer) 58
# 60s 之内
> get key
"value"
# 60s 之外
> get key
(nil)
```

【示例】EXPIREAT、TTL 操作

```shell
> set key value
OK
# 设置 key 的生存时间为 1692419299
> expireat key 1692419299
(integer) 1
# 查看 key 的剩余生存时间
> ttl key
(integer) 9948
# 1692419299 之前
> get key
"value"
# 1692419299 之后
> get key
(nil)
```

#### 如何保存过期时间

在 Redis 中，redisDb 结构的 `expires` 字典保存了数据库中所有键的过期时间，这个字典称为过期字典：

- 过期字典的键是一个指针，这个指针指向某个键对象
- 过期字典的值是一个 `long long` 类型的整数，这个整数保存了键的过期时间——一个毫秒精度的 UNIX 时间戳。

```c
typedef struct redisDb {

    // 数据库键空间，保存着数据库中的所有键值对
    dict *dict;

    // 键的过期时间，字典的键为键，字典的值为过期事件 UNIX 时间戳
    dict *expires;

    // ...
} redisDb;
```

下图是一个带有过期字典的示例：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202309171537744.png)

当执行 `EXPIRE`、`PEXPIRE`、`EXPIREAT`、`PEXPIREAT` 命令，Redis 都会将其转为 `PEXPIREAT` 形式的时间戳，然后维护在 `expires` 字典中。

#### 过期键的判定

过期键的判定流程如下：

- 检查指定 key 是否存在于过期字典；如果存在，则取得 key 的过期时间。
- 检查当前时间戳是否大于 key 的过期时间：如果是，key 已过期；反之，key 未过期。

### 过期删除策略

- **定时删除** - 在设置 key 的过期时间的同时，创建一个定时器，让定时器在 key 的过期时间来临时，立即执行对 key 的删除操作。
  - 优点 - 保证过期 key 被尽可能快的删除，释放内存。
  - 缺点 - **如果过期 key 较多，可能会占用相当一部分的 CPU，从而影响服务器的吞吐量和响应时延**。
- **惰性删除** - 放任 key 过期不管，但是每次访问 key 时，都检查 key 是否过期，如果过期的话，就删除该 key ；如果没有过期，就返回该 key。
  - 优点 - 占用 CPU 最少。程序只会在读写键时，对当前键进行过期检查，因此不会有额外的 CPU 开销。
  - 缺点 - **过期的 key 可能因为没有被访问，而一直无法释放，造成内存的浪费，有内存泄漏的风险**。
- **定期删除** - 每隔一段时间，程序就对数据库进行一次检查，删除里面的过期 key 。至于要删除多少过期 key ，以及要检查多少个数据库，则由算法决定。定期删除是前两种策略的一种折中方案。定期删除策略的难点是删除操作执行的时长和频率。
  - 执行太频或执行时间过长，就会出现和定时删除相同的问题；
  - 执行太少或执行时间过短，就会出现和惰性删除相同的问题；

### Redis 的过期删除策略

Redis 同时采用了惰性删除和定期删除策略，以此在合理使用 CPU 和内存之间取得平衡。

**Redis 定期删除策略的实现** - 由 `redis.c/activeExpireCycle` 函数实现，每当 Redis 周期性执行 `redis.c/serverCron` 函数时，`activeExpireCycle` 函数就会被调用。`activeExpireCycle` 函数会在规定时间内，遍历各个数据库，从 `expires` 字典中随机检查一部分键的过期时间，并删除过期的键。

**Redis 惰性删除策略的实现** - 由 `db.c/expireIfNeeded` 函数实现，所有读写命令在执行之前都会调用 `expireIfNeeded` 函数对输入键进行检查：如果输入键已过期，将输入键从数据库中删除；否则，什么也不做。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202309171604805.png)

### AOF、RDB 和复制对过期键的处理

- 生成 RDB 文件 - **执行 `SAVE` 命令或者 `BGSAVE` 命令，所产生的新 RDB 文件“不会包含已经过期的键”**。
- 载入 RDB 文件 - **主服务器“不会载入已过期的键”**；**从服务器会载入“会载入已过期的键”**。
- 生成 AOF 文件 - 当一个过期键未被删除时，不会影响 AOF 文件；当一个过期键被删除之后， 服务器会追加一条 `DEL` 命令到现有 AOF 文件的末尾， 显式地删除过期键。
- 重写 AOF 文件 - **执行 `BGREWRITEAOF` 命令所产生的重写 AOF 文件“不会包含已经过期的键”**。
- 复制 - 当主服务器删除一个过期键之后， 它会向所有从服务器发送一条 `DEL` 命令， 显式地删除过期键。从服务器即使发现过期键， 也不会自作主张地删除它， 而是等待主节点发来 DEL 命令， 这种统一、中心化的过期键删除策略可以保证主从服务器数据的一致性。
- 当 Redis 命令对数据库进行修改之后， 服务器会根据配置， 向客户端发送数据库通知。

## Redis 内存淘汰

### Redis 内存淘汰要点

- **失效时间** - 作为一种定期清理无效数据的重要机制，在 Redis 提供的诸多命令中，`EXPIRE`、`EXPIREAT`、`PEXPIRE`、`PEXPIREAT` 以及 `SETEX` 和 `PSETEX` 均可以用来设置一条键值对的失效时间。而一条键值对一旦被关联了失效时间就会在到期后自动删除（或者说变得无法访问更为准确）。
- **最大缓存** - Redis 允许通过 `maxmemory` 参数来设置内存最大值。当内存达设定的阀值，就会触发**内存淘汰**。
- **内存淘汰** - 内存淘汰是为了更好的利用内存——清理部分缓存，以此换取内存的利用率，即尽量保证 Redis 缓存中存储的是热点数据。
- **非精准的 LRU** - 实际上 Redis 实现的 LRU 并不是可靠的 LRU，也就是名义上我们使用 LRU 算法淘汰键，但是实际上被淘汰的键并不一定是真正的最久没用的。

### Redis 内存淘汰策略

内存淘汰只是 Redis 提供的一个功能，为了更好地实现这个功能，必须为不同的应用场景提供不同的策略，内存淘汰策略讲的是为实现内存淘汰我们具体怎么做，要解决的问题包括淘汰键空间如何选择？在键空间中淘汰键如何选择？

Redis 提供了下面几种内存淘汰策略供用户选：

- **不淘汰**
  - **`noeviction`** - 当内存使用达到阈值的时候，所有引起申请内存的命令会报错。这是 Redis 默认的策略。
- **在过期键中进行淘汰**
  - **`volatile-random`** - 在设置了过期时间的键空间中，随机移除某个 key。
  - **`volatile-ttl`** - 在设置了过期时间的键空间中，具有更早过期时间的 key 优先移除。
  - **`volatile-lru`** - 在设置了过期时间的键空间中，优先移除最近未使用的 key。
  - **`volatile-lfu`** （Redis 4.0 新增）- 淘汰所有设置了过期时间的键值中，最少使用的键值。
- **在所有键中进行淘汰**
  - **`allkeys-lru`** - 在主键空间中，优先移除最近未使用的 key。
  - **`allkeys-random`** - 在主键空间中，随机移除某个 key。
  - **`allkeys-lfu`** (Redis 4.0 新增) - 淘汰整个键值中最少使用的键值。

### 如何选择淘汰策略

- 如果数据呈现幂等分布，也就是一部分数据访问频率高，一部分数据访问频率低，则使用 `allkeys-lru` 或 `allkeys-lfu`。
- 如果数据呈现平均分布，也就是所有的数据访问频率都相同，则使用 `allkeys-random`。
- 若 Redis 既用于缓存，也用于持久化存储时，适用 `volatile-lru` 、`volatile-lfu`、`volatile-random`。但是，这种情况下，也可以部署两个 Redis 集群来达到同样目的。
- 为 key 设置过期时间实际上会消耗更多的内存。因此，如果条件允许，建议使用 `allkeys-lru` 或 `allkeys-lfu`，从而更高效的使用内存。

## 参考资料

- [《Redis 设计与实现》](https://item.jd.com/11486101.html)