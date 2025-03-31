---
icon: logos:redis
title: Redis 基本数据类型
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/20230901071808.png
date: 2020-06-24 10:45:38
categories:
  - 数据库
  - KV数据库
  - redis
tags:
  - 数据库
  - KV 数据库
  - redis
  - 数据类型
permalink: /pages/cbe4e503/
---

# Redis 基本数据类型

> 关键词：`String`、`Hash`、`List`、`Set`、`Zset`

Redis 提供了多种数据类型，每种数据类型有丰富的命令支持。

Redis 支持的基本数据类型：STRING、HASH、LIST、SET、ZSET

Redis 支持的高级数据类型：BitMap、HyperLogLog、GEO、Stream

使用 Redis ，不仅要了解其数据类型的特性，还需要根据业务场景，灵活的、高效的使用其数据类型来建模。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202309232155082.png)

## String

### String 简介

String 类型是键值对结构。

String 类型是**二进制安全**的。二进制安全是指，String 类型不仅可以保存文本数据，还可以保存任意格式的二进制数据，如：图片、音频、视频、压缩文件等。

默认情况下，String 类型的值最大可为 **512 MB**。

![](https://raw.githubusercontent.com/dunwu/images/master/cs/database/redis/redis-datatype-string.png)

### String 实现

String 类型的底层的数据结构实现主要是 int 和 SDS（简单动态字符串）。

SDS 和我们认识的 C 字符串不太一样，之所以没有使用 C 语言的字符串表示，因为 SDS 相比于 C 的原生字符串：

- **SDS 不仅可以保存文本数据，还可以保存二进制数据**。因为 `SDS` 使用 `len` 属性的值而不是空字符来判断字符串是否结束，并且 SDS 的所有 API 都会以处理二进制的方式来处理 SDS 存放在 `buf[]` 数组里的数据。所以 SDS 不光能存放文本数据，而且能保存图片、音频、视频、压缩文件这样的二进制数据。
- **SDS 获取字符串长度的时间复杂度是 O(1)**。因为 C 语言的字符串并不记录自身长度，所以获取长度的复杂度为 O(n)；而 SDS 结构里用 `len` 属性记录了字符串长度，所以复杂度为 `O(1)`。
- **Redis 的 SDS API 是安全的，拼接字符串不会造成缓冲区溢出**。因为 SDS 在拼接字符串之前会检查 SDS 空间是否满足要求，如果空间不够会自动扩容，所以不会导致缓冲区溢出的问题。

**字符串对象的编码可以是 `int` 、 `raw` 或者 `embstr`** 。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100759580.svg)

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100759674.svg)

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100800212.svg)

字符串对象保存各类型值的编码方式：

| 值                                                                                                                          | 编码                |
| :-------------------------------------------------------------------------------------------------------------------------- | :------------------ |
| 可以用 `long` 类型保存的整数。                                                                                              | `int`               |
| 可以用 `long double` 类型保存的浮点数。                                                                                     | `embstr` 或者 `raw` |
| 字符串值， 或者因为长度太大而没办法用 `long` 类型表示的整数， 又或者因为长度太大而没办法用 `long double` 类型表示的浮点数。 | `embstr` 或者 `raw` |

如果一个字符串对象保存的是整数值， 并且这个整数值可以用 `long` 类型来表示， 那么字符串对象会将整数值保存在字符串对象结构的 `ptr` 属性里面（将 `void*` 转换成 `long` ）， 并将字符串对象的编码设置为 `int` 。

【示例】set 整数值

```shell
> SET number 10086
OK

> OBJECT ENCODING number
"int"
```

如果字符串对象保存的是一个字符串值， 并且这个字符串值的长度大于 `39` 字节， 那么字符串对象将使用一个简单动态字符串（SDS）来保存这个字符串值， 并将对象的编码设置为 `raw` 。

```c
> SET story "Long, long, long ago there lived a king ..."
OK

> STRLEN story
(integer) 43

> OBJECT ENCODING story
"raw"
```

如果字符串对象保存的是一个字符串值， 并且这个字符串值的长度小于等于 `39` 字节， 那么字符串对象将使用 `embstr` 编码的方式来保存这个字符串值。`embstr` 编码是专门用于保存短字符串的一种优化编码方式。

【示例】set 字符串值

```c
> SET msg "hello"
OK

> OBJECT ENCODING msg
"embstr"
```

### String 命令

| 命令     | 说明                                |
| -------- | ----------------------------------- |
| `SET`    | 存储一个字符串值                    |
| `SETNX`  | 仅当键不存在时，才存储字符串值      |
| `GET`    | 获取指定 key 的值                   |
| `MGET`   | 获取一个或多个指定 key 的值         |
| `INCRBY` | 将 key 中储存的数字加上指定的增量值 |
| `DECRBY` | 将 key 中储存的数字减去指定的减量值 |

> 更多命令请参考：[Redis String 类型官方命令文档](https://redis.io/commands#string)

【示例】SET、GET、DEL 操作

```shell
# 将 key(name) 的 value 保存为 dunwu
> set name dunwu
OK
# 获取 key(name) 的 value
> get name
"dunwu"
# 将 key(name) 的 value 保存为 unknown（覆盖原 value）
> set name unknown
OK
> get name
"unknown"
# 检查 key(name) 是否存在
> exists name
(integer) 1
# 删除 key(name)
> del name
(integer) 1
> exists name
(integer) 0
> get name
(nil)
```

【示例】SETNX 操作

```shell
# 检查 key(lock) 是否存在
> exists lock
(integer) 0
# 将 key(lock) 的 value 保存为 1，保存成功
> setnx lock 1
(integer) 1
# 将 key(lock) 的 value 保存为 2，由于 key 已存在，保存失败
> setnx lock 2
(integer) 0
# 获取 key(lock) 的 value
> get lock
"1"
```

【示例】MSET、MGET 操作

```shell
# 批量设置 one、two、three 这 3 个 key
> mset one 1 tow 2 three 3
OK
# 批量获取 one、two、three 3 个 key 的 value
> mget one tow three
1) "1"
2) "2"
3) "3"
```

【示例】INCR、DECR、INCRBY、DECRBY 操作

```shell
# 将 key(counter) 的 value 保存为 0
> set counter 0
OK
# 将 key(counter) 的 value 加 1
> incr counter
(integer) 1
# 将 key(counter) 的 value 加 9
> incrby counter 9
(integer) 10
# 将 key(counter) 的 value 减 1
> decr counter
(integer) 9
# 将 key(counter) 的 value 减 9
> decrby counter 9
(integer) 0
```

### String 应用

**适用场景：缓存、计数器、共享 Session**

#### 缓存对象

使用 String 来缓存对象有两种方式：

（1）缓存对象的 JSON 值

```shell
> set user:1 {"name":"dunwu","sex":"man"}
```

（2）将 key 分离为 user:ID: 属性的形式，采用 MSET 存储，用 MGET 获取各属性值

```shell
> mset user:1:name dunwu user:1:sex man
OK
> mget user:1:name user:1:sex
1) "dunwu"
2) "man"
```

#### 计数器

【需求场景】

统计网站某内容的点击量、收藏量、点赞数等等。

【解决方案】

> 使用 Redis 的 String 类型存储一个计数器。

维护计数器的常见操作如下：

- 增加统计值 - 使用 `INCR`、`DECR` 命令
- 减少统计值 - 使用 `INCRBY`、`DECRBY` 操作

【示例代码】

```shell
# 初始化 ID 为 1024 的博文访问量为 0
> set blog:view:1024 0
OK
# ID 为 1024 的博文访问量加 1
> incr blog:view:1024
(integer) 1
# ID 为 1024 的博文访问量加 1
> incr blog:view:1024
(integer) 2
# 查看 ID 为 1024 的博文访问量
> get blog:view:1024
"2"
```

#### 分布式锁

（1）申请锁

SET 命令有个 NX 参数可以实现“key 不存在才插入”，可以用它来实现分布式锁：

- 如果 key 不存在，则显示插入成功，可以用来表示加锁成功；
- 如果 key 存在，则会显示插入失败，可以用来表示加锁失败。

一般而言，还会对分布式锁加上过期时间，分布式锁的命令如下：

```shell
SET key value NX PX 30000
```

- key - 就是分布式锁的关键字；
- value - 是客户端生成的唯一的标识；
- NX - 表示只有 `key` 不存在的时候才会设置成功。（如果此时 redis 中存在这个 key，那么设置失败，返回 `nil`）
- PX 30000 - 表示：30s 后，key 会被删除（这意味着锁被释放了）。设置过期时间，是为了防止出现各种意外，导致锁始终无法释放的情况。

（2）释放锁

释放锁就是删除 key ，但是一般可以用 `lua` 脚本删除，判断 value 一样才删除，这是为了保证释放锁操作和申请所操作是同一个客户端。由于涉及两个操作，为了保证原子性，可以使用 lua 脚本来实现，因为 Redis 执行 Lua 脚本时，是以原子性方式执行的。

```Lua
-- 删除锁的时候，找到 key 对应的 value，跟自己传过去的 value 做比较，如果是一样的才删除。
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

#### 共享 Session 信息

在分布式场景下，一个用户的 Session 如果只存储在一个服务器上，那么当负载均衡器把用户的下一个请求转发到另一个服务器上，该服务器没有用户的 Session，就可能导致用户需要重新进行登录等操作。

分布式 Session 的几种实现策略：

1. 粘性 session
2. 应用服务器间的 session 复制共享
3. 基于缓存的 session 共享 ✅

基于缓存的 session 共享实现

> **使用一个单独的存储服务器存储 Session 数据**，可以存在 MySQL 数据库上，也可以存在 Redis 或者 Memcached 这种内存型数据库。
>
> 缺点：需要去实现存取 Session 的代码。

![](https://raw.githubusercontent.com/dunwu/images/master/cs/design/architecture/MultiNode-SpringSession.jpg)

## Hash

### Hash 简介

![](https://raw.githubusercontent.com/dunwu/images/master/cs/database/redis/redis-datatype-hash.png)

Hash 是一个键值对（key - value）集合，其中 value 的形式如： `value=[{field1，value1}，...{fieldN，valueN}]`。Hash 特别适合用于存储对象。

### Hash 实现

哈希对象的编码可以是 `ziplist` 或者 `hashtable` 。

`ziplist` 编码的哈希对象使用压缩列表作为底层实现，每当有新的键值对要加入到哈希对象时， 程序会先将保存了键的压缩列表节点推入到压缩列表表尾， 然后再将保存了值的压缩列表节点推入到压缩列表表尾。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100803215.svg)

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100804441.svg)

`hashtable` 编码的哈希对象使用字典作为底层实现， 哈希对象中的每个键值对都使用一个字典键值对来保存。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100805761.svg)

当哈希对象同时满足以下两个条件时， 使用 `ziplist` 编码；否则，使用 `hashtable` 编码。

1. 哈希对象保存的所有键值对的键和值的字符串长度都小于 `64` 字节（可由 `hash-max-ziplist-value` 配置）；
2. 哈希对象保存的键值对数量小于 `512` 个（可由 `hash-max-ziplist-entries` 配置）；

> 注意：这两个条件的上限值是可以修改的， 具体请看配置文件中关于 `hash-max-ziplist-value` 选项和 `hash-max-ziplist-entries` 选项的说明。

### Hash 命令

| 命令      | 行为                       |
| --------- | -------------------------- |
| `HSET`    | 将指定字段的值设为 value   |
| `HGET`    | 获取指定字段的值           |
| `HGETALL` | 获取所有键值对             |
| `HMSET`   | 设置多个键值对             |
| `HMGET`   | 获取所有指定字段的值       |
| `HDEL`    | 删除指定字段               |
| `HINCRBY` | 为指定字段的整数值加上增量 |
| `HKEYS`   | 获取所有字段               |

> 更多命令请参考：[Redis Hash 类型官方命令文档](https://redis.io/commands#hash)

```shell
# 存储一个哈希表 key 的键值
HSET key field value
# 获取哈希表 key 对应的 field 键值
HGET key field

# 在一个哈希表 key 中存储多个键值对
HMSET key field value [field value...]
# 批量获取哈希表 key 中多个 field 键值
HMGET key field [field ...]
# 删除哈希表 key 中的 field 键值
HDEL key field [field ...]

# 返回哈希表 key 中 field 的数量
HLEN key
# 返回哈希表 key 中所有的键值
HGETALL key

# 为哈希表 key 中 field 键的值加上增量 n
HINCRBY key field n
```

### Hash 应用

> **Hash 类型适用于存储结构化数据**。

#### 缓存对象

Hash 类型的（key，field，value）的结构与对象的（对象 id，属性，值）的结构相似，也可以用来存储对象。

我们以用户信息为例，它在关系型数据库中的结构是这样的：

我们可以使用如下命令，将用户对象的信息存储到 Hash 类型：

```shell
# 存储一个哈希表 uid:1 的键值
> HMSET uid:1 name Tom age 15
2
# 存储一个哈希表 uid:2 的键值
> HMSET uid:2 name Jerry age 13
2
# 获取哈希表用户 id 为 1 中所有的键值
> HGETALL uid:1
1) "name"
2) "Tom"
3) "age"
4) "15"
```

Redis Hash 存储其结构如下图：

在介绍 String 类型的应用场景时有所介绍，String + Json 也是存储对象的一种方式，那么存储对象时，到底用 String + json 还是用 Hash 呢？

一般对象用 String + Json 存储，对象中某些频繁变化的属性可以考虑抽出来用 Hash 类型存储。

#### 购物车

【需求场景】

用户浏览电商平台，添加商品到购物车，并支持查看购物车。需要考虑未登录的情况。

【解决方案】

> 可以使用 HASH 类型来实现购物车功能。
>
> 以用户 session 为 key，存储了商品 ID 和商品数量的映射。其中，商品 id 为 field，商品数量为 value。
>
> 为什么不使用用户 ID？
>
> 因为很多场景下需要支持用户在免登陆的情况下使用购物车的，因为未登录，所以无法知道用户的用户 ID，这种情况下使用用户 session 更合适。并且由于绑定的是 session，可以在清空 session 时，顺便清空购物车缓存，更加方便。

维护购物车的常见操作如下：

- 添加商品 - `HSET cart:{session} {商品 id} 1`
- 添加数量 - `HINCRBY cart:{session} {商品 id} 1`
- 商品总数 - `HLEN cart:{session}`
- 删除商品 - `HDEL cart:{session} {商品 id}`
- 获取购物车所有商品 - `HGETALL cart:{session}`

当前仅仅是将商品 ID 存储到了 Redis 中，在回显商品具体信息的时候，还需要拿着商品 id 查询一次数据库，获取完整的商品的信息。

## List

Redis 中的 List 类型就是有序列表。

### List 简介

![](https://raw.githubusercontent.com/dunwu/images/master/cs/database/redis/redis-datatype-list.png)

List 列表是简单的字符串列表，**按照插入顺序排序**，可以从头部或尾部向 List 列表添加元素。

列表的最大长度为 `2^32 - 1`，也即每个列表支持超过 `40 亿`个元素。

### List 实现

列表对象的编码可以是 `ziplist` 或者 `linkedlist` 。

`ziplist` 编码的列表对象使用压缩列表作为底层实现， 每个压缩列表节点（entry）保存了一个列表元素。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100802398.svg)

`inkedlist` 编码的列表对象使用双链表作为底层实现。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100802787.svg)

当列表对象可以同时满足以下两个条件时， 列表对象使用 `ziplist` 编码；否则，使用 `linkedlist` 编码

1. 列表对象保存的所有字符串元素的长度都小于 `64` 字节；
2. 列表对象保存的元素数量小于 `512` 个；

> 注意
>
> 以上两个条件的上限值是可以修改的， 具体请看配置文件中关于 `list-max-ziplist-value` 选项和 `list-max-ziplist-entries` 选项的说明。

### List 命令

| 命令     | 行为                                       |
| -------- | ------------------------------------------ |
| `LPUSH`  | 将给定值推入列表的右端。                   |
| `RPUSH`  | 将给定值推入列表的右端。                   |
| `LPOP`   | 从列表的左端弹出一个值，并返回被弹出的值。 |
| `RPOP`   | 从列表的右端弹出一个值，并返回被弹出的值。 |
| `LRANGE` | 获取列表在给定范围上的所有值。             |
| `LINDEX` | 获取列表在给定位置上的单个元素。           |
| `LREM`   | 从列表的左端弹出一个值，并返回被弹出的值。 |
| `LTRIM`  | 只保留指定区间内的元素，删除其他元素。     |

> 更多命令请参考：[Redis List 类型官方命令文档](https://redis.io/commands#list)

```shell
# 将一个或多个值 value 插入到 key 列表的表头（最左边），最后的值在最前面
LPUSH key value [value ...]
# 将一个或多个值 value 插入到 key 列表的表尾（最右边）
RPUSH key value [value ...]
# 移除并返回 key 列表的头元素
LPOP key
# 移除并返回 key 列表的尾元素
RPOP key

# 返回列表 key 中指定区间内的元素，区间以偏移量 start 和 stop 指定，从 0 开始
LRANGE key start stop

# 从 key 列表表头弹出一个元素，没有就阻塞 timeout 秒，如果 timeout=0 则一直阻塞
BLPOP key [key ...] timeout
# 从 key 列表表尾弹出一个元素，没有就阻塞 timeout 秒，如果 timeout=0 则一直阻塞
BRPOP key [key ...] timeout
```

### List 应用

#### 消息队列

消息队列在存取消息时，必须要满足三个需求，分别是**消息保序、处理重复的消息和保证消息可靠性**。

Redis 的 List 和 Stream 两种数据类型，就可以满足消息队列的这三个需求。我们先来了解下基于 List 的消息队列实现方法，后面在介绍 Stream 数据类型时候，在详细说说 Stream。

_1、如何满足消息保序需求？_

List 本身就是按先进先出的顺序对数据进行存取的，所以，如果使用 List 作为消息队列保存消息的话，就已经能满足消息保序的需求了。

List 可以使用 LPUSH + RPOP（或者反过来，RPUSH+LPOP）命令实现消息队列。

- 生产者使用 `LPUSH key value[value...]` 将消息插入到队列的头部，如果 key 不存在则会创建一个空的队列再插入消息。

- 消费者使用 `RPOP key` 依次读取队列的消息，先进先出。

不过，在消费者读取数据时，有一个潜在的性能风险点。

在生产者往 List 中写入数据时，List 并不会主动地通知消费者有新消息写入，如果消费者想要及时处理消息，就需要在程序中不停地调用 `RPOP` 命令（比如使用一个 while(1) 循环）。如果有新消息写入，RPOP 命令就会返回结果，否则，RPOP 命令返回空值，再继续循环。

所以，即使没有新消息写入 List，消费者也要不停地调用 RPOP 命令，这就会导致消费者程序的 CPU 一直消耗在执行 RPOP 命令上，带来不必要的性能损失。

为了解决这个问题，Redis 提供了 BRPOP 命令。**BRPOP 命令也称为阻塞式读取，客户端在没有读到队列数据时，自动阻塞，直到有新的数据写入队列，再开始读取新数据**。和消费者程序自己不停地调用 RPOP 命令相比，这种方式能节省 CPU 开销。

_2、如何处理重复的消息？_

消费者要实现重复消息的判断，需要 2 个方面的要求：

- 每个消息都有一个全局的 ID。
- 消费者要记录已经处理过的消息的 ID。当收到一条消息后，消费者程序就可以对比收到的消息 ID 和记录的已处理过的消息 ID，来判断当前收到的消息有没有经过处理。如果已经处理过，那么，消费者程序就不再进行处理了。

但是 **List 并不会为每个消息生成 ID 号，所以我们需要自行为每个消息生成一个全局唯一 ID**，生成之后，我们在用 LPUSH 命令把消息插入 List 时，需要在消息中包含这个全局唯一 ID。

例如，我们执行以下命令，就把一条全局 ID 为 111000102、库存量为 99 的消息插入了消息队列：

```shell
> LPUSH mq "111000102:stock:99"
(integer) 1
```

_3、如何保证消息可靠性？_

当消费者程序从 List 中读取一条消息后，List 就不会再留存这条消息了。所以，如果消费者程序在处理消息的过程出现了故障或宕机，就会导致消息没有处理完成，那么，消费者程序再次启动后，就没法再次从 List 中读取消息了。

为了留存消息，List 类型提供了 `BRPOPLPUSH` 命令，这个命令的**作用是让消费者程序从一个 List 中读取消息，同时，Redis 会把这个消息再插入到另一个 List（可以叫作备份 List）留存**。

这样一来，如果消费者程序读了消息但没能正常处理，等它重启后，就可以从备份 List 中重新读取消息并进行处理了。

好了，到这里可以知道基于 List 类型的消息队列，满足消息队列的三大需求（消息保序、处理重复的消息和保证消息可靠性）。

- 消息保序：使用 LPUSH + RPOP；
- 阻塞读取：使用 BRPOP；
- 重复消息处理：生产者自行实现全局唯一 ID；
- 消息的可靠性：使用 BRPOPLPUSH

> List 作为消息队列有什么缺陷？

**List 不支持多个消费者消费同一条消息**，因为一旦消费者拉取一条消息后，这条消息就从 List 中删除了，无法被其它消费者再次消费。

要实现一条消息可以被多个消费者消费，那么就要将多个消费者组成一个消费组，使得多个消费者可以消费同一条消息，但是 **List 类型并不支持消费组的实现**。

这就要说起 Redis 从 5.0 版本开始提供的 Stream 数据类型了，Stream 同样能够满足消息队列的三大需求，而且它还支持“消费组”形式的消息读取。

#### 输入自动补全

【需求场景】

根据用户输入，自动补全信息，如：联系人、商品名等。

- 典型场景一 - 社交网站后台记录用户最近联系过的 100 个好友，当用户查找好友时，根据输入的关键字自动补全姓名。
- 典型场景二 - 电商网站后台记录用户最近浏览过的 10 件商品，当用户查找商品是，根据输入的关键字自动补全商品名称。

【解决方案】

> 使用 Redis 的 List 类型存储一个最近信息列表，然后在需要自动补全信息时展示相应数量的数据。

维护最近信息列表的常见操作如下：

- 如果指定信息已经存在于最近信息列表里，那么从列表里移除。使用 `LREM` 命令。
- 将指定信息添加到最近信息列表的头部。使用 `LPUSH` 命令。
- 添加操作完成后，如果最近信息列表中的数量超过上限 N，进行裁剪操作。使用 `LTRIM` 命令。

## Set

Redis 中的 Set 类型就是无序且去重的集合。

### Set 简介

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/cs/database/redis/redis-datatype-set.png" width="400"/>
</div>

Set 类型是一个无序并唯一的键值集合，它的存储顺序不会按照插入的先后顺序进行存储。

一个集合最多可以存储 `2^32-1` 个元素。概念和数学中个的集合基本类似，可以交集，并集，差集等等，所以 Set 类型除了支持集合内的增删改查，同时还支持多个集合取交集、并集、差集。

Set 类型和 List 类型的区别如下：

- List 可以存储重复元素，Set 只能存储非重复元素；
- List 是按照元素的先后顺序存储元素的，而 Set 则是无序方式存储元素的。

### Set 实现

集合对象的编码可以是 `intset` 或者 `hashtable` 。

`intset` 编码的集合对象使用整数集合作为底层实现， 集合对象包含的所有元素都被保存在整数集合里面。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100806680.svg)

`hashtable` 编码的集合对象使用字典作为底层实现， 字典的每个键都是一个字符串对象， 每个字符串对象包含了一个集合元素， 而字典的值则全部被设置为 `NULL` 。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100806732.svg)

当集合对象可以同时满足以下两个条件时，集合对象使用 `intset` 编码；否则，使用 `hashtable` 编码：

1. 集合对象保存的所有元素都是整数值；
2. 集合对象保存的元素数量不超过 `512` 个；

> 注意：第二个条件的上限值是可以修改的， 具体请看配置文件中关于 `set-max-intset-entries` 选项的说明。

### Set 命令

| 命令        | 行为                                           |
| ----------- | ---------------------------------------------- |
| `SADD`      | 将给定元素添加到集合。                         |
| `SMEMBERS`  | 返回集合包含的所有元素。                       |
| `SISMEMBER` | 检查给定元素是否存在于集合中。                 |
| `SREM`      | 如果给定的元素存在于集合中，那么移除这个元素。 |

> 更多命令请参考：[Redis Set 类型官方命令文档](https://redis.io/commands#set)

Set 常用操作：

```shell
# 往集合 key 中存入元素，元素存在则忽略，若 key 不存在则新建
SADD key member [member ...]
# 从集合 key 中删除元素
SREM key member [member ...]
# 获取集合 key 中所有元素
SMEMBERS key
# 获取集合 key 中的元素个数
SCARD key

# 判断 member 元素是否存在于集合 key 中
SISMEMBER key member

# 从集合 key 中随机选出 count 个元素，元素不从 key 中删除
SRANDMEMBER key [count]
# 从集合 key 中随机选出 count 个元素，元素从 key 中删除
SPOP key [count]
```

Set 运算操作：

```shell
# 交集运算
SINTER key [key ...]
# 将交集结果存入新集合 destination 中
SINTERSTORE destination key [key ...]

# 并集运算
SUNION key [key ...]
# 将并集结果存入新集合 destination 中
SUNIONSTORE destination key [key ...]

# 差集运算
SDIFF key [key ...]
# 将差集结果存入新集合 destination 中
SDIFFSTORE destination key [key ...]
```

### Set 应用

集合的主要几个特性，无序、不可重复、支持并交差等操作。

因此 Set 类型比较适合用来数据去重和保障数据的唯一性，还可以用来统计多个集合的交集、错集和并集等，当我们存储的数据是无序并且需要去重的情况下，比较适合使用集合类型进行存储。

但是要提醒你一下，这里有一个潜在的风险。**Set 的差集、并集和交集的计算复杂度较高，在数据量较大的情况下，如果直接执行这些计算，会导致 Redis 实例阻塞**。

在主从集群中，为了避免主库因为 Set 做聚合计算（交集、差集、并集）时导致主库被阻塞，我们可以选择一个从库完成聚合统计，或者把数据返回给客户端，由客户端来完成聚合统计。

#### 点赞

Set 类型可以保证一个用户只能点一个赞，这里举例子一个场景，key 是文章 id，value 是用户 id。

`uid:1` 、`uid:2`、`uid:3` 三个用户分别对 article:1 文章点赞了。

```shell
# uid:1 用户对文章 article:1 点赞
> SADD article:1 uid:1
(integer) 1
# uid:2 用户对文章 article:1 点赞
> SADD article:1 uid:2
(integer) 1
# uid:3 用户对文章 article:1 点赞
> SADD article:1 uid:3
(integer) 1
```

`uid:1` 取消了对 article:1 文章点赞。

```plain
> SREM article:1 uid:1
(integer) 1
```

获取 article:1 文章所有点赞用户 :

```shell
> SMEMBERS article:1
1) "uid:3"
2) "uid:2"
```

获取 article:1 文章的点赞用户数量：

```shell
> SCARD article:1
(integer) 2
```

判断用户 `uid:1` 是否对文章 article:1 点赞了：

```shell
> SISMEMBER article:1 uid:1
(integer) 0  # 返回 0 说明没点赞，返回 1 则说明点赞了
```

#### 共同关注

Set 类型支持交集运算，所以可以用来计算共同关注的好友、公众号等。

key 可以是用户 id，value 则是已关注的公众号的 id。

`uid:1` 用户关注公众号 id 为 5、6、7、8、9，`uid:2` 用户关注公众号 id 为 7、8、9、10、11。

```shell
# uid:1 用户关注公众号 id 为 5、6、7、8、9
> SADD uid:1 5 6 7 8 9
(integer) 5
# uid:2  用户关注公众号 id 为 7、8、9、10、11
> SADD uid:2 7 8 9 10 11
(integer) 5
```

`uid:1` 和 `uid:2` 共同关注的公众号：

```shell
# 获取共同关注
> SINTER uid:1 uid:2
1) "7"
2) "8"
3) "9"
```

给 `uid:2` 推荐 `uid:1` 关注的公众号：

```shell
> SDIFF uid:1 uid:2
1) "5"
2) "6"
```

验证某个公众号是否同时被 `uid:1` 或 `uid:2` 关注：

```shell
> SISMEMBER uid:1 5
(integer) 1 # 返回 1，说明关注了
> SISMEMBER uid:2 5
(integer) 0 # 返回 0，说明没关注
```

#### 抽奖活动

存储某活动中中奖的用户名，Set 类型因为有去重功能，可以保证同一个用户不会中奖两次。

key 为抽奖活动名，value 为员工名称，把所有员工名称放入抽奖箱：

```shell
> SADD lucky Tom Jerry John Sean Marry Lindy Sary Mark
(integer) 5
```

如果允许重复中奖，可以使用 SRANDMEMBER 命令。

```shell
# 抽取 1 个一等奖：
> SRANDMEMBER lucky 1
1) "Tom"
# 抽取 2 个二等奖：
> SRANDMEMBER lucky 2
1) "Mark"
2) "Jerry"
# 抽取 3 个三等奖：
> SRANDMEMBER lucky 3
1) "Sary"
2) "Tom"
3) "Jerry"
```

如果不允许重复中奖，可以使用 SPOP 命令。

```shell
# 抽取一等奖 1 个
> SPOP lucky 1
1) "Sary"
# 抽取二等奖 2 个
> SPOP lucky 2
1) "Jerry"
2) "Mark"
# 抽取三等奖 3 个
> SPOP lucky 3
1) "John"
2) "Sean"
3) "Lindy"
```

## Zset

Redis 中的 Zset 类型就是有序且去重的集合。

### Zset 简介

Zset 类型（有序集合类型）相比于 Set 类型多了一个排序属性 score（分值），对于有序集合 ZSet 来说，每个存储元素相当于有两个值组成的，一个是有序结合的元素值，一个是排序值。

有序集合保留了集合不能有重复成员的特性（分值可以重复），但不同的是，有序集合中的元素可以排序。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/cs/database/redis/redis-datatype-zset.png" width="400"/>
</div>

### Zset 实现

有序集合的编码可以是 `ziplist` 或者 `skiplist` 。

`ziplist` 编码的有序集合对象使用压缩列表作为底层实现， 每个集合元素使用两个紧挨在一起的压缩列表节点来保存， 第一个节点保存元素的成员（member）， 而第二个元素则保存元素的分值（score）。压缩列表内的集合元素按分值从小到大进行排序， 分值较小的元素被放置在靠近表头的方向， 而分值较大的元素则被放置在靠近表尾的方向。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100808991.svg)

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100808319.svg)

`skiplist` 编码的有序集合对象使用 `zset` 结构作为底层实现， 一个 `zset` 结构同时包含一个字典和一个跳跃表

```c
typedef struct zset {

    zskiplist *zsl;

    dict *dict;

} zset;
```

`zset` 结构中的 `zsl` 跳跃表按分值从小到大保存了所有集合元素， 每个跳跃表节点都保存了一个集合元素： 跳跃表节点的 `object` 属性保存了元素的成员， 而跳跃表节点的 `score` 属性则保存了元素的分值。 通过这个跳跃表， 程序可以对有序集合进行范围型操作， 比如 ZRANK 、 ZRANGE 等命令就是基于跳跃表 API 来实现的。

除此之外， `zset` 结构中的 `dict` 字典为有序集合创建了一个从成员到分值的映射， 字典中的每个键值对都保存了一个集合元素： 字典的键保存了元素的成员， 而字典的值则保存了元素的分值。 通过这个字典， 程序可以用 O(1) 复杂度查找给定成员的分值， ZSCORE 命令就是根据这一特性实现的， 而很多其他有序集合命令都在实现的内部用到了这一特性。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100810255.svg)

有序集合每个元素的成员都是一个字符串对象， 而每个元素的分值都是一个 `double` 类型的浮点数。 值得一提的是， 虽然 `zset` 结构同时使用跳跃表和字典来保存有序集合元素， 但这两种数据结构都会通过指针来共享相同元素的成员和分值， 所以同时使用跳跃表和字典来保存集合元素不会产生任何重复成员或者分值， 也不会因此而浪费额外的内存。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202410100812776.svg)

当有序集合对象可以同时满足以下两个条件时，有序集合对象使用 `ziplist` 编码；否则，使用 `skiplist` 编码。

- 有序集合保存的元素数量小于 `128` 个；
- 有序集合保存的所有元素成员的长度都小于 `64` 字节；

> 注意：以上两个条件的上限值是可以修改的， 具体请看配置文件中关于 `zset-max-ziplist-entries` 选项和 `zset-max-ziplist-value` 选项的说明。

**在 Redis 7.0 中，压缩列表数据结构已经废弃了，交由 listpack 数据结构来实现了。**

### Zset 命令

| 命令               | 行为                                       |
| ------------------ | ------------------------------------------ |
| `ZADD`             | 将一个带有给定分值的成员添加到有序集合里面 |
| `ZRANGE`           | 顺序排序，并返回指定排名区间的成员         |
| `ZREVRANGE`        | 反序排序，并返回指定排名区间的成员         |
| `ZRANGEBYSCORE`    | 顺序排序，并返回指定排名区间的成员及其分值 |
| `ZREVRANGEBYSCORE` | 反序排序，并返回指定排名区间的成员及其分值 |
| `ZREM`             | 移除指定的成员                             |
| `ZSCORE`           | 返回指定成员的分值                         |
| `ZCARD`            | 返回所有成员数                             |

> 更多命令请参考：[Redis ZSet 类型官方命令文档](https://redis.io/commands#sorted_set)

Zset 常用操作：

```shell
# 往有序集合 key 中加入带分值元素
ZADD key score member [[score member]...]
# 往有序集合 key 中删除元素
ZREM key member [member...]
# 返回有序集合 key 中元素 member 的分值
ZSCORE key member
# 返回有序集合 key 中元素个数
ZCARD key

# 为有序集合 key 中元素 member 的分值加上 increment
ZINCRBY key increment member

# 正序获取有序集合 key 从 start 下标到 stop 下标的元素
ZRANGE key start stop [WITHSCORES]
# 倒序获取有序集合 key 从 start 下标到 stop 下标的元素
ZREVRANGE key start stop [WITHSCORES]

# 返回有序集合中指定分数区间内的成员，分数由低到高排序。
ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]

# 返回指定成员区间内的成员，按字典正序排列，分数必须相同。
ZRANGEBYLEX key min max [LIMIT offset count]
# 返回指定成员区间内的成员，按字典倒序排列，分数必须相同
ZREVRANGEBYLEX key max min [LIMIT offset count]
```

Zset 运算操作（相比于 Set 类型，ZSet 类型没有支持差集运算）：

```shell
# 并集计算（相同元素分值相加），numberkeys 一共多少个 key，WEIGHTS 每个 key 对应的分值乘积
ZUNIONSTORE destkey numberkeys key [key...]
# 交集计算（相同元素分值相加），numberkeys 一共多少个 key，WEIGHTS 每个 key 对应的分值乘积
ZINTERSTORE destkey numberkeys key [key...]
```

### Zset 应用

Zset 类型（Sorted Set，有序集合）可以根据元素的权重来排序，我们可以自己来决定每个元素的权重值。比如说，我们可以根据元素插入 Sorted Set 的时间确定权重值，先插入的元素权重小，后插入的元素权重大。

在面对需要展示最新列表、排行榜等场景时，如果数据更新频繁或者需要分页显示，可以优先考虑使用 Sorted Set。

#### 排行榜

【需求场景】

各种排行榜，如：内容平台（视频、歌曲、文章）的播放量/收藏量/评分排行榜；电商网站的销售排行榜；

【解决方案】

有序集合比较典型的使用场景就是排行榜。例如学生成绩的排名榜、游戏积分排行榜、视频播放排名、电商系统中商品的销量排名等。

我们以博文点赞排名为例，dunwu 发表了五篇博文，分别获得赞为 200、40、100、50、150。

```shell
# article:1 文章获得了 200 个赞
> ZADD user:dunwu:ranking 200 article:1
(integer) 1
# article:2 文章获得了 40 个赞
> ZADD user:dunwu:ranking 40 article:2
(integer) 1
# article:3 文章获得了 100 个赞
> ZADD user:dunwu:ranking 100 article:3
(integer) 1
# article:4 文章获得了 50 个赞
> ZADD user:dunwu:ranking 50 article:4
(integer) 1
# article:5 文章获得了 150 个赞
> ZADD user:dunwu:ranking 150 article:5
(integer) 1
```

文章 article:4 新增一个赞，可以使用 ZINCRBY 命令（为有序集合 key 中元素 member 的分值加上 increment）：

```shell
> ZINCRBY user:dunwu:ranking 1 article:4
"51"
```

查看某篇文章的赞数，可以使用 ZSCORE 命令（返回有序集合 key 中元素个数）：

```shell
> ZSCORE user:dunwu:ranking article:4
"50"
```

获取 dunwu 文章赞数最多的 3 篇文章，可以使用 ZREVRANGE 命令（倒序获取有序集合 key 从 start 下标到 stop 下标的元素）：

```shell
# WITHSCORES 表示把 score 也显示出来
> ZREVRANGE user:dunwu:ranking 0 2 WITHSCORES
1) "article:1"
2) "200"
3) "article:5"
4) "150"
5) "article:3"
6) "100"
```

获取 dunwu 100 赞到 200 赞的文章，可以使用 ZRANGEBYSCORE 命令（返回有序集合中指定分数区间内的成员，分数由低到高排序）：

```shell
> ZRANGEBYSCORE user:dunwu:ranking 100 200 WITHSCORES
1) "article:3"
2) "100"
3) "article:5"
4) "150"
5) "article:1"
6) "200"
```

#### 前缀排序

使用有序集合的 `ZRANGEBYLEX` 或 `ZREVRANGEBYLEX` 可以帮助我们实现电话号码或姓名的排序，我们以 `ZRANGEBYLEX` （返回指定成员区间内的成员，按 key 正序排列，分数必须相同）为例。

**注意：不要在分数不一致的 SortSet 集合中去使用 ZRANGEBYLEX 和 ZREVRANGEBYLEX 指令，因为获取的结果会不准确。**

_1、电话排序_

我们可以将电话号码存储到 SortSet 中，然后根据需要来获取号段：

```shell
> ZADD phone 0 13100111100 0 13110114300 0 13132110901
(integer) 3
> ZADD phone 0 13200111100 0 13210414300 0 13252110901
(integer) 3
> ZADD phone 0 13300111100 0 13310414300 0 13352110901
(integer) 3
```

获取所有号码：

```shell
> ZRANGEBYLEX phone - +
1) "13100111100"
2) "13110114300"
3) "13132110901"
4) "13200111100"
5) "13210414300"
6) "13252110901"
7) "13300111100"
8) "13310414300"
9) "13352110901"
```

获取 132 号段的号码：

```shell
> ZRANGEBYLEX phone [132 (133
1) "13200111100"
2) "13210414300"
3) "13252110901"
```

获取 132、133 号段的号码：

```shell
> ZRANGEBYLEX phone [132 (134
1) "13200111100"
2) "13210414300"
3) "13252110901"
4) "13300111100"
5) "13310414300"
6) "13352110901"
```

_2、姓名排序_

```shell
> zadd names 0 Toumas 0 Jake 0 Bluetuo 0 Gaodeng 0 Aimini 0 Aidehua
(integer) 6
```

获取所有人的名字：

```shell
> ZRANGEBYLEX names - +
1) "Aidehua"
2) "Aimini"
3) "Bluetuo"
4) "Gaodeng"
5) "Jake"
6) "Toumas"
```

获取名字中大写字母 A 开头的所有人：

```shell
> ZRANGEBYLEX names [A (B
1) "Aidehua"
2) "Aimini"
```

获取名字中大写字母 C 到 Z 的所有人：

```shell
> ZRANGEBYLEX names [C [Z
1) "Gaodeng"
2) "Jake"
3) "Toumas"
```

## 总结

Redis 常见的五种数据类型：**String（字符串），Hash（哈希），List（列表），Set（集合）及 Zset（sorted set：有序集合）**。

这五种数据类型都由多种数据结构实现的，主要是出于时间和空间的考虑，当数据量小的时候使用更简单的数据结构，有利于节省内存，提高性能。

可以看到，Redis 数据类型的底层数据结构随着版本的更新也有所不同，比如：

- 在 Redis 3.0 版本中 List 对象的底层数据结构由“双向链表”或“压缩表列表”实现，但是在 3.2 版本之后，List 数据类型底层数据结构是由 quicklist 实现的；
- 在最新的 Redis 代码中，压缩列表数据结构已经废弃了，交由 listpack 数据结构来实现了。

Redis 五种数据类型的应用场景：

- String 类型的应用场景：缓存对象、分布式锁、共享 session、计数器、限流、分布式 ID 等。
- List 类型的应用场景：消息队列（有两个问题：1. 生产者需要自行实现全局唯一 ID；2. 不能以消费组形式消费数据）、输入自动补全等。
- Hash 类型：缓存对象、购物车等。
- Set 类型：聚合计算（并集、交集、差集）场景，比如点赞、共同关注、抽奖活动等。
- Zset 类型：排序场景，比如排行榜、电话和姓名排序等。

Redis 后续版本又支持四种数据类型，它们的应用场景如下：

- BitMap（2.2 版新增）：二值状态统计的场景，比如签到、判断用户登陆状态、连续签到用户总数等；
- HyperLogLog（2.8 版新增）：海量数据基数统计的场景，比如百万级网页 UV 计数等；
- GEO（3.2 版新增）：存储地理位置信息的场景，比如滴滴叫车；
- Stream（5.0 版新增）：消息队列，相比于基于 List 类型实现的消息队列，有这两个特有的特性：自动生成全局唯一消息 ID，支持以消费组形式消费数据。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202309232144470.jpg)

针对 Redis 是否适合做消息队列，关键看你的业务场景：

- 如果你的业务场景足够简单，对于数据丢失不敏感，而且消息积压概率比较小的情况下，把 Redis 当作队列是完全可以的。
- 如果你的业务有海量消息，消息积压的概率比较大，并且不能接受数据丢失，那么还是用专业的消息队列中间件吧。

## 参考资料

- [《Redis 实战》](https://item.jd.com/11791607.html)
- [《Redis 设计与实现》](https://item.jd.com/11486101.html)
- [Redis 常见数据类型和应用场景](https://dunwucoding.com/redis/data_struct/command.html#string)