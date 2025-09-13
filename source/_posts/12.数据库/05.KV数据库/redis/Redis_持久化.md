---
icon: logos:redis
title: Redis 持久化
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202309150716562.png
date: 2020-06-24 10:45:38
categories:
  - 数据库
  - KV数据库
  - redis
tags:
  - 数据库
  - KV数据库
  - redis
  - 持久化
  - CoW
permalink: /pages/a57cb309/
---

# Redis 持久化

> Redis 是内存型数据库，为了保证数据在宕机后不会丢失，需要将内存中的数据持久化到硬盘上。
>
> Redis 支持两种持久化方式：RDB 和 AOF。这两种持久化方式既可以同时使用，也可以单独使用。
>
> 关键词：`RDB`、`AOF`、`SAVE`、`BGSAVE`、`appendfsync`

## RDB 快照

### RDB 简介

**RDB 即“快照”，它将某时刻的所有 Redis 数据库中的所有键值对数据保存到一个经过压缩的“二进制文件”（RDB 文件）中**。

**RDB 持久化即可以“手动”执行，也可以定期“自动”执行**。

**RDB 文件的“载入”工作是在服务器“启动”时“自动”执行的**。

对于不同类型的键值对， RDB 文件会使用不同的方式来保存它们。

创建 RDB 后，用户可以对 RDB 进行备份，可以将 RDB 复制到其他服务器从而创建具有相同数据的服务器副本，还可以在重启服务器时使用。一句话来说：**RDB 适用于作为“冷备”**。

### RDB 的优点和缺点

**RDB 的优点**

- RDB 文件非常紧凑，**适合作为“冷备”**。比如你可以在每个小时报保存一下过去 24 小时内的数据，同时每天保存过去 30 天的数据，这样即使出了问题你也可以根据需求恢复到不同版本的数据集。
- 快照在保存 RDB 文件时父进程唯一需要做的就是 fork 出一个子进程，接下来的工作全部由子进程来做，父进程不需要再做其他 IO 操作，所以快照持久化方式可以最大化 Redis 的性能。
- **恢复大数据集时，RDB 比 AOF 更快**。

**RDB 的缺点**

- **如果系统发生故障，将会丢失最后一次创建快照之后的数据**。如果你希望在 Redis 意外停止工作（例如电源中断）的情况下丢失的数据最少的话，那么 快照不适合你。虽然你可以配置不同的 save 时间点(例如每隔 5 分钟并且对数据集有 100 个写的操作)，是 Redis 要完整的保存整个数据集是一个比较繁重的工作，你通常会每隔 5 分钟或者更久做一次完整的保存，万一在 Redis 意外宕机，你可能会丢失几分钟的数据。
- **如果数据量很大，保存快照的时间会很长**。快照需要经常 fork 子进程来保存数据集到硬盘上。当数据集比较大的时候，fork 的过程是非常耗时的，可能会导致 Redis 在一些毫秒级内不能响应客户端的请求。如果数据集巨大并且 CPU 性能不是很好的情况下，这种情况会持续 1 秒。AOF 也需要 fork，但是你可以调节重写日志文件的频率来提高数据集的耐久度。

### RDB 的创建

有两个 Redis 命令可以用于生成 RDB 文件：[**`SAVE`**](https://redis.io/commands/save) 和 [**`BGSAVE`**](https://redis.io/commands/bgsave) 。

[**`SAVE`**](https://redis.io/commands/save) 命令由服务器进程直接执行保存操作，直到 RDB 创建完成为止。所以**该命令“会阻塞”服务器**，在阻塞期间，服务器不能响应任何命令请求。

```shell
>SAVE
"OK"
```

[**`BGSAVE`**](https://redis.io/commands/bgsave) 命令会**“派生”**（fork）一个子进程，由子进程负责创建 RDB 文件，服务器进程继续处理命令请求，所以**该命令“不会阻塞”服务器**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503272238061.png)

```shell
>BGSAVE
"Background saving started"
```

> 🔔 **【注意】**
>
> `BGSAVE` 命令的实现采用的是写时复制技术（Copy-On-Write，缩写为 CoW）。
>
> `BGSAVE` 命令执行期间，`SAVE`、`BGSAVE`、`BGREWRITEAOF` 三个命令会被拒绝，以免与当前的 `BGSAVE` 操作产生竞态条件，降低性能。

创建 RDB 的工作由 `rdb.c/rdbSave` 函数完成。

### RDB 的载入

**RDB 文件的“载入”工作是在服务器“启动”时“自动”执行的**。Redis 并没有专门用于载入 RDB 文件的命令。

服务器载入 RDB 文件期间，会一直处于阻塞状态，直到载入完成为止。

载入 RDB 的工作由 `rdb.c/rdbLoad` 函数完成。

> 🔔 **【注意】**
>
> 因为 AOF 的更新频率通常比 RDB 的更新频率高，所以：
>
> - 如果服务器开了 AOF，则服务器会优先使用 AOF 来还原数据。
> - 只有在 AOF 处于关闭时，服务器才会使用 RDB 来还原数据。

### 自动间隔保存

Redis 支持通过在 `redis.conf` 文件中配置 `save` 选项，让服务器每隔一段时间自动执行一次 `BGSAVE` 命令。`save` 选项可以设置多个保存条件，只要其中任意一个条件被满足，服务器就会执行 `BGSAVE` 命令。

【示例】`redis.conf` 中自动保存配置

```shell
# 900 秒内，至少对数据库进行了 1 次修改
save 900 1
# 300 秒内，至少对数据库进行了 10 次修改
save 300 10
# 60 秒内，至少对数据库进行了 10000 次修改
save 60 10000
```

只要满足以上任意条件，Redis 服务就会执行 `BGSAVE` 命令。

自动间隔的保存条件定义在 `redis.h/redisServer` 中：

```c
struct redisServer {
    // 记录了保存条件的数组
	struct saveparam *saveparams;

    // 自从上次 SAVE 执行以来，数据库被修改的次数
    long long dirty;

    // 上一次完成 SAVE 的时间
    time_t lastsave;
}

// 服务器的保存条件（BGSAVE 自动执行的条件）
struct saveparam {

    // 多少秒之内
    time_t seconds;

    // 发生多少次修改
    int changes;

};
```

redisServer 中的 `saveparams` 数组维护了多个自动间隔保存条件。

服务每次成功执行一个修改命令后，`dirty` 计数器就会加 1；而 `lastsave` 则记录了上一次完成 SAVE 的时间。Redis 会通过一个 `serverCron` 函数周期性检查 `save` 选项所设条件是否满足，如果满足，则执行 `BGSVAE` 命令。

### RDB 的文件结构

**RDB 文件是一个经过压缩的“二进制文件”**，由多个部分组成。

对于不同类型（STRING、HASH、LIST、SET、SORTED SET）的键值对，RDB 文件会使用不同的方式来保存它们。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503272240429.png)

Redis 本身提供了一个 RDB 文件检查工具 `redis-check-dump`。

### RDB 的配置

Redis RDB 默认配置如下：

```
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir ./
```

Redis 的配置文件 `redis.conf` 中与 RDB 有关的选项：

- `save` - Redis 会根据 `save` 选项，让服务器每隔一段时间自动执行一次 `BGSAVE` 命令

- `stop-writes-on-bgsave-error` - 当 `BGSAVE` 命令出现错误时停止写 RDB 文件
- `rdbcompression` - RDB 文件开启压缩功能
- `rdbchecksum` - 对 RDB 文件进行校验
- `dbfilename` - RDB 文件名
- `dir` - RDB 文件和 AOF 文件的存储路径

## AOF 日志

### AOF 简介

`AOF(Append Only File)` 是将所有写命令追加写入“日志文件”，以此来记录数据的变化。当服务器重启时，会重新载入和执行 AOF 文件中的命令，就可以恢复原始的数据。AOF 适合作为**“热备”**。

AOF 可以通过 `appendonly yes` 配置选项来开启。

### AOF 的优点和缺点

**AOF 的优点**

- **如果系统发生故障，AOF 丢失数据比 RDB 少**。你可以使用不同的 fsync 策略：无 fsync；每秒 fsync；每次写的时候 fsync。使用默认的每秒 fsync 策略，Redis 的性能依然很好(fsync 是由后台线程进行处理的,主线程会尽力处理客户端请求)，一旦出现故障，你最多丢失 1 秒的数据。
- **AOF 文件可修复** - AOF 文件是一个只进行追加的日志文件，所以不需要写入 seek，即使由于某些原因(磁盘空间已满，写的过程中宕机等等)未执行完整的写入命令，你也也可使用 redis-check-aof 工具修复这些问题。
- **AOF 文件可压缩**。Redis 可以在 AOF 文件体积变得过大时，自动地在后台对 AOF 进行重写：重写后的新 AOF 文件包含了恢复当前数据集所需的最小命令集合。整个重写操作是绝对安全的，因为 Redis 在创建新 AOF 文件的过程中，会继续将命令追加到现有的 AOF 文件里面，即使重写过程中发生停机，现有的 AOF 文件也不会丢失。而一旦新 AOF 文件创建完毕，Redis 就会从旧 AOF 文件切换到新 AOF 文件，并开始对新 AOF 文件进行追加操作。
- **AOF 文件可读** - AOF 文件有序地保存了对数据库执行的所有写入操作，这些写入操作以 Redis 命令的格式保存。因此 AOF 文件的内容非常容易被人读懂，对文件进行分析（parse）也很轻松。 导出（export） AOF 文件也非常简单。举个例子，如果你不小心执行了 FLUSHALL 命令，但只要 AOF 文件未被重写，那么只要停止服务器，移除 AOF 文件末尾的 FLUSHALL 命令，并重启 Redis ，就可以将数据集恢复到 FLUSHALL 执行之前的状态。

**AOF 的缺点**

- **AOF 文件体积一般比 RDB 大** - 对于相同的数据集来说，AOF 文件的体积通常要大于 RDB 文件的体积。
- **恢复大数据集时，AOF 比 RDB 慢。** - 根据所使用的 fsync 策略，AOF 的速度可能会慢于快照。在一般情况下，每秒 fsync 的性能依然非常高，而关闭 fsync 可以让 AOF 的速度和快照一样快，即使在高负荷之下也是如此。不过在处理巨大的写入载入时，快照可以提供更有保证的最大延迟时间（latency）。

### AOF 的创建

**Redis 命令请求会先保存到 AOF 缓冲区，再定期写入并同步到 AOF 文件**。

AOF 的实现可以分为命令追加（append）、文件写入、文件同步（sync）三个步骤。

- **命令追加** - 当 Redis 服务器开启 AOF 功能时，服务器在执行完一个写命令后，会以 Redis 命令协议格式将被执行的写命令追加到 AOF 缓冲区的末尾。
- **文件写入**和**文件同步**
  - Redis 的服务器进程就是一个事件循环，这个循环中的文件事件负责接收客户端的命令请求，以及向客户端发送命令回复。而时间事件则负责执行想 `serverCron` 这样的定时运行的函数。
  - 因为服务器在处理文件事件时可能会执行写命令，这些写命令会被追加到 AOF 缓冲区，服务器每次结束事件循环前，都会根据 `appendfsync` 选项来判断 AOF 缓冲区内容是否需要写入和同步到 AOF 文件中。

`appendfsync` 不同选项决定了不同的持久化行为：

- **`always`** - 将 AOF 缓冲区中所有内容写入并同步到 AOF 文件。这种方式是最数据最安全的，但也是性能最差的。
- **`no`** - 将 AOF 缓冲区所有内容写入到 AOF 文件，但并不对 AOF 文件进行同步，何时同步由操作系统决定。这种方式是数据最不安全的，一旦出现故障，未来得及同步的所有数据都会丢失。
- **`everysec`** - `appendfsync` 默认选项。将 AOF 缓冲区所有内容写入到 AOF 文件，如果上次同步 AOF 文件的时间距离现在超过一秒钟，那么再次对 AOF 文件进行同步，这个同步操作是有一个线程专门负责执行的。这张方式是前面两种的这种方案——性能足够好，且即使出现故障，仅丢失一秒钟内的数据。

`appendfsync` 选项的不同值对 AOF 持久化功能的安全性、以及 Redis 服务器的性能有很大的影响。

### AOF 的载入

因为 AOF 文件中包含了重建数据库所需的所有写命令，所以服务器只要载入并执行一遍 AOF 文件中保存的写命令，就可以还原服务器关闭前的数据库状态。

AOF 载入过程如下：

1. 服务器启动载入程序。
2. 创建一个伪客户端。因为 Redis 命令只能在客户端上下文中执行，所以需要创建一个伪客户端来载入、执行 AOF 文件中记录的命令。
3. 从 AOF 文件中分析并读取一条写命令。
4. 使用伪客户端执行写命令。
5. 循环执行步骤 3、4，直到所有写命令都被处理完毕为止。
6. 载入完毕。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503272247006.png)

### AOF 的重写

随着 Redis 不断运行，AOF 的体积也会不断增长，这将导致两个问题：

- AOF 耗尽磁盘可用空间。
- Redis 重启后需要执行 AOF 文件记录的所有写命令来还原数据集，如果 AOF 过大，则还原操作执行的时间就会非常长。

为了解决 AOF 体积膨胀问题，Redis 提供了 AOF 重写功能，来对 AOF 文件进行压缩。**AOF 重写可以产生一个新的 AOF 文件，这个新的 AOF 文件和原来的 AOF 文件所保存的数据库状态一致，但体积更小**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503272248857.png)

AOF 重写并非读取和分析现有 AOF 文件的内容，而是直接从数据库中读取当前的数据库状态。即**从数据库中读取键的当前值，然后用一条命令去记录该键值对**，以此代替之前可能存在冗余的命令。

### AOF 后台重写

作为一种辅助性功能，显然 Redis 并不想在 AOF 重写时阻塞 Redis 服务接收其他命令。因此，Redis 决定通过 `BGREWRITEAOF` 命令创建一个子进程，然后由子进程负责对 AOF 文件进行重写，这与 `BGSAVE` 原理类似。

- 在执行 `BGREWRITEAOF` 命令时，Redis 服务器会维护一个 AOF 重写缓冲区。当 AOF 重写子进程开始工作后，Redis 每执行完一个写命令，会同时将这个命令发送给 AOF 缓冲区和 AOF 重写缓冲区。
- 由于彼此不是在同一个进程中工作，AOF 重写不影响 AOF 写入和同步。当子进程完成创建新 AOF 文件的工作之后，服务器会将重写缓冲区中的所有内容追加到新 AOF 文件的末尾，使得新旧两个 AOF 文件所保存的数据库状态一致。
- 最后，服务器用新的 AOF 文件替换就的 AOF 文件，以此来完成 AOF 重写操作。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503272248959.png)

> `BGREWRITEAOF` 命令的实现采用的是写时复制技术（Copy-On-Write，缩写为 CoW）。

可以通过设置 `auto-aof-rewrite-percentage` 和 `auto-aof-rewrite-min-size`，使得 Redis 在满足条件时，自动执行 `BGREWRITEAOF`。

假设配置如下：

```
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

表明，当 AOF 大于 `64MB`，且 AOF 体积比上一次重写后的体积大了至少 `100%` 时，执行 `BGREWRITEAOF`。

### AOF 的配置

AOF 的默认配置：

```
appendonly no
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

AOF 持久化通过在 `redis.conf` 中的 `appendonly yes` 配置选项来开启。

- **`appendonly`** - 开启 AOF 功能。
- **`appendfilename`** - AOF 文件名。
- **`appendfsync`** - 用于设置同步频率，它有以下可选项：
  - **`always`** - 每个 Redis 写命令都要同步写入硬盘。这样做会严重降低 Redis 的速度。
  - **`everysec`** - 每秒执行一次同步，显示地将多个写命令同步到硬盘。为了兼顾数据安全和写入性能，推荐使用 `appendfsync everysec` 选项。Redis 每秒同步一次 AOF 文件时的性能和不使用任何持久化特性时的性能相差无几。
  - **`no`** - 让操作系统来决定应该何时进行同步。
- `no-appendfsync-on-rewrite` - AOF 重写时不支持追加命令。
- `auto-aof-rewrite-percentage` - AOF 重写百分比。
- `auto-aof-rewrite-min-size` - AOF 重写文件的最小大小。
- `dir` - RDB 文件和 AOF 文件的存储路径。

## RDB 和 AOF

> 当 Redis 启动时， 如果 RDB 和 AOF 功能都开启了，那么程序会优先使用 AOF 文件来恢复数据集，因为 AOF 文件所保存的数据通常是最完整的。

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_lossy/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F89970b2c-fd40-47ea-bd39-18db11b69fe8_1280x1664.gif)

### 如何选择持久化

- 如果不关心数据丢失，可以不持久化。
- 如果可以承受数分钟以内的数据丢失，可以只使用 RDB。
- 如果不能承受数分钟以内的数据丢失，可以同时使用 RDB 和 AOF。

有很多用户都只使用 AOF 持久化， 但并不推荐这种方式： 因为定时生成 RDB 快照（snapshot）非常便于进行数据库备份，并且快照恢复数据集的速度也要比 AOF 恢复的速度要快，除此之外，使用快照还可以避免之前提到的 AOF 程序的 bug 。

### RDB 切换为 AOF

在 Redis 2.2 或以上版本，可以在不重启的情况下，从 RDB 切换为 AOF ：

- 为最新的 dump.rdb 文件创建一个备份。
- 将备份放到一个安全的地方。
- 执行以下两条命令:
- redis-cli config set appendonly yes
- redis-cli config set save
- 确保写命令会被正确地追加到 AOF 文件的末尾。
- 执行的第一条命令开启了 AOF 功能： Redis 会阻塞直到初始 AOF 文件创建完成为止， 之后 Redis 会继续处理命令请求， 并开始将写入命令追加到 AOF 文件末尾。

执行的第二条命令用于关闭快照功能。 这一步是可选的， 如果你愿意的话， 也可以同时使用快照和 AOF 这两种持久化功能。

> 🔔 重要：别忘了在 `redis.conf` 中打开 AOF 功能！否则的话，服务器重启之后，之前通过 CONFIG SET 设置的配置就会被遗忘，程序会按原来的配置来启动服务器。

### AOF 和 RDB 的相互作用

`BGSAVE` 和 `BGREWRITEAOF` 命令不可以同时执行。这是为了避免两个 Redis 后台进程同时对磁盘进行大量的 I/O 操作。

如果 `BGSAVE` 正在执行，并且用户显示地调用 `BGREWRITEAOF` 命令，那么服务器将向用户回复一个 OK 状态，并告知用户，`BGREWRITEAOF` 已经被预定执行。一旦 `BGSAVE` 执行完毕， `BGREWRITEAOF` 就会正式开始。

### 混合持久化

RDB 优点是数据恢复速度快，但是快照的频率不好把握。频率太低，丢失的数据就会比较多，频率太高，就会影响性能。AOF 优点是丢失数据少，但是数据恢复不快。

为了集成了两者的优点，Redis 4.0 提出了**混合使用 AOF 日志和内存快照**，也叫混合持久化，既保证了 Redis 重启速度，又降低数据丢失风险。

混合持久化工作在 **AOF 日志重写过程**，当开启了混合持久化时，在 AOF 重写日志时，fork 出来的重写子进程会先将与主线程共享的内存数据以 RDB 方式写入到 AOF 文件，然后主线程处理的操作命令会被记录在重写缓冲区里，重写缓冲区里的增量命令会以 AOF 方式写入到 AOF 文件，写入完成后通知主进程将新的含有 RDB 格式和 AOF 格式的 AOF 文件替换旧的的 AOF 文件。

也就是说，使用了混合持久化，AOF 文件的**前半部分是 RDB 格式的全量数据，后半部分是 AOF 格式的增量数据**。

这样的好处在于，重启 Redis 加载数据的时候，由于前半部分是 RDB 内容，这样**加载的时候速度会很快**。

加载完 RDB 的内容后，才会加载后半部分的 AOF 内容，这里的内容是 Redis 后台子进程重写 AOF 期间，主线程处理的操作命令，可以使得**数据更少的丢失**。

**混合持久化优点**：

- 混合持久化结合了 RDB 和 AOF 持久化的优点，开头为 RDB 的格式，使得 Redis 可以更快的启动，同时结合 AOF 的优点，有减低了大量数据丢失的风险。

**混合持久化缺点**：

- AOF 文件中添加了 RDB 格式的内容，使得 AOF 文件的可读性变得很差；
- 兼容性差，如果开启混合持久化，那么此混合持久化 AOF 文件，就不能用在 Redis 4.0 之前版本了。

## Redis 备份

应该确保 Redis 数据有完整的备份。

备份 Redis 数据建议采用 RDB。

### 备份过程

1. 创建一个定期任务（cron job），每小时将一个 RDB 文件备份到一个文件夹，并且每天将一个 RDB 文件备份到另一个文件夹。
2. 确保快照的备份都带有相应的日期和时间信息，每次执行定期任务脚本时，使用 find 命令来删除过期的快照：比如说，你可以保留最近 48 小时内的每小时快照，还可以保留最近一两个月的每日快照。
3. 至少每天一次，将 RDB 备份到你的数据中心之外，或者至少是备份到你运行 Redis 服务器的物理机器之外。

### 容灾备份

Redis 的容灾备份基本上就是对数据进行备份，并将这些备份传送到多个不同的外部数据中心。

容灾备份可以在 Redis 运行并产生快照的主数据中心发生严重的问题时，仍然让数据处于安全状态。

## 参考资料

- [《Redis 设计与实现》](https://item.jd.com/11486101.html)