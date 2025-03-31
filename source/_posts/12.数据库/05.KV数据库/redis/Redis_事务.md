---
icon: logos:redis
title: Redis 事务
date: 2020-01-30 21:48:57
categories:
  - 数据库
  - KV数据库
  - redis
tags:
  - 数据库
  - KV数据库
  - redis
  - 事务
  - ACID
permalink: /pages/d6a68f2a/
---

# Redis 事务

> **Redis 仅支持“非严格”的事务**。所谓“非严格”是指：Redis 事务保证“全部执行命令”；但是，Redis 事务“不支持回滚”。
>
> 关键词：`事务`、`ACID`、`MULTI`、`EXEC`、`DISCARD`、`WATCH`

## Redis 事务简介

### 什么是 ACID

ACID 是数据库事务正确执行的四个基本要素。

- **原子性（Atomicity）**
  - 事务被视为不可分割的最小单元，事务中的所有操作**要么全部提交成功，要么全部失败回滚**。
  - 回滚可以用日志来实现，日志记录着事务所执行的修改操作，在回滚时反向执行这些修改操作即可。
- **一致性（Consistency）**
  - 数据库在事务执行前后都保持一致性状态。
  - 在一致性状态下，所有事务对一个数据的读取结果都是相同的。
- **隔离性（Isolation）**
  - 一个事务所做的修改在最终提交以前，对其它事务是不可见的。
- **持久性（Durability）**
  - 一旦事务提交，则其所做的修改将会永远保存到数据库中。即使系统发生崩溃，事务执行的结果也不能丢失。
  - 可以通过数据库备份和恢复来实现，在系统发生奔溃时，使用备份的数据库进行数据恢复。

**一个支持事务（Transaction）中的数据库系统，必需要具有这四种特性，否则在事务过程（Transaction processing）当中无法保证数据的正确性。**

- 只有满足一致性，事务的执行结果才是正确的。
- 在无并发的情况下，事务串行执行，隔离性一定能够满足。此时只要能满足原子性，就一定能满足一致性。
- 在并发的情况下，多个事务并行执行，事务不仅要满足原子性，还需要满足隔离性，才能满足一致性。
- 事务满足持久化是为了能应对系统崩溃的情况。

![ACID](https://raw.githubusercontent.com/dunwu/images/master/cs/database/RDB/数据库ACID.png)

### Redis 事务的特性

Redis 的事务总是支持 ACID 中的原子性、一致性和隔离性， 当服务器运行在 AOF 持久化模式下， 并且 `appendfsync` 选项的值为 `always` 时， 事务也具有持久性。

但需要注意的是：**Redis 仅支持“非严格”的事务**。这里的“非严格”，其实指的是 Redis 事务只能部分保证 ACID 中的原子性。

- **Redis 事务保证全部执行命令** - Redis 事务中的多个命令会被打包到事务队列中，然后按先进先出（FIFO）的顺序执行。事务在执行过程中不会被中断，当事务队列中的所有命令都被执行完毕之后，事务才会结束。
- **Redis 事务不支持回滚** - 如果命令执行失败不会回滚，而是会继续执行下去。

Redis 官方的[事务特性文档](https://redis.io/docs/interact/transactions/)给出的不支持回滚的理由是：

- Redis 命令只会因为错误的语法而失败，或是命令用在了错误类型的键上面。
- 因为不需要对回滚进行支持，所以 Redis 的内部可以保持简单且快速。

## Redis 事务应用

[`MULTI`](https://redis.io/commands/multi)、[`EXEC`](https://redis.io/commands/exec)、[`DISCARD`](https://redis.io/commands/discard) 和 [`WATCH`](https://redis.io/commands/watch) 是 Redis 事务相关的命令。

事务可以一次执行多个命令， 并且有以下两个重要的保证：

- 事务是一个单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。
- 事务是一个原子操作：事务中的命令要么全部被执行，要么全部都不执行。

Redis 有天然解决这个并发竞争问题的类 CAS 乐观锁方案：每次要**写之前，先判断**一下当前这个 value 的时间戳是否比缓存里的 value 的时间戳要新。如果是的话，那么可以写，否则，就不能用旧的数据覆盖新的数据。

### MULTI

**[`MULTI`](https://redis.io/commands/multi) 命令用于开启一个事务，它总是返回 OK 。**

`MULTI` 执行之后， 客户端可以继续向服务器发送任意多条命令， 这些命令不会立即被执行， 而是被放到一个队列中， 当 EXEC 命令被调用时， 所有队列中的命令才会被执行。

以下是一个事务例子， 它原子地增加了 `foo` 和 `bar` 两个键的值：

```python
> MULTI
OK
> INCR foo
QUEUED
> INCR bar
QUEUED
> EXEC
1) (integer) 1
2) (integer) 1
```

### EXEC

**[`EXEC`](https://redis.io/commands/exec) 命令负责触发并执行事务中的所有命令。**

- 如果客户端在使用 `MULTI` 开启了一个事务之后，却因为断线而没有成功执行 `EXEC` ，那么事务中的所有命令都不会被执行。
- 另一方面，如果客户端成功在开启事务之后执行 `EXEC` ，那么事务中的所有命令都会被执行。

`MULTI` 和 `EXEC` 中的操作将会一次性发送给服务器，而不是一条一条发送，这种方式称为流水线，它可以减少客户端与服务器之间的网络通信次数从而提升性能。

### DISCARD

**当执行 [`DISCARD`](https://redis.io/commands/discard) 命令时， 事务会被放弃， 事务队列会被清空， 并且客户端会从事务状态中退出。**

示例：

```python
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

**[`WATCH`](https://redis.io/commands/watch) 命令可以为 Redis 事务提供 check-and-set （CAS）行为。**

被 `WATCH` 的键会被监视，并会发觉这些键是否被改动过了。 如果有至少一个被监视的键在 `EXEC` 执行之前被修改了， 那么整个事务都会被取消， `EXEC` 返回 `nil-reply` 来表示事务已经失败。

```python
WATCH mykey
val = GET mykey
val = val + 1
MULTI
SET mykey $val
EXEC
```

使用上面的代码， 如果在 `WATCH` 执行之后， `EXEC` 执行之前， 有其他客户端修改了 `mykey` 的值， 那么当前客户端的事务就会失败。 程序需要做的， 就是不断重试这个操作， 直到没有发生碰撞为止。

这种形式的锁被称作乐观锁， 它是一种非常强大的锁机制。 并且因为大多数情况下， 不同的客户端会访问不同的键， 碰撞的情况一般都很少， 所以通常并不需要进行重试。

`WATCH` 使得 `EXEC` 命令需要有条件地执行：事务只能在所有被监视键都没有被修改的前提下执行，如果这个前提不能满足的话，事务就不会被执行。

`WATCH` 命令可以被调用多次。对键的监视从 `WATCH` 执行之后开始生效，直到调用 `EXEC` 为止。

用户还可以在单个 `WATCH` 命令中监视任意多个键，例如：

```python
redis> WATCH key1 key2 key3
OK
```

#### 取消 WATCH 的场景

当 `EXEC` 被调用时， 不管事务是否成功执行， 对所有键的监视都会被取消。另外， 当客户端断开连接时， 该客户端对键的监视也会被取消。

使用无参数的 `UNWATCH` 命令可以手动取消对所有键的监视。 对于一些需要改动多个键的事务， 有时候程序需要同时对多个键进行加锁， 然后检查这些键的当前值是否符合程序的要求。 当值达不到要求时， 就可以使用 `UNWATCH` 命令来取消目前对键的监视， 中途放弃这个事务， 并等待事务的下次尝试。

#### 使用 WATCH 创建原子操作

`WATCH` 可以用于创建 Redis 没有内置的原子操作。

举个例子，以下代码实现了原创的 `ZPOP` 命令，它可以原子地弹出有序集合中分值（`score`）最小的元素：

```python
WATCH zset
element = ZRANGE zset 0 0
MULTI
ZREM zset element
EXEC
```

## Lua 脚本

### 为什么使用 Lua

前面提到了，**Redis 仅支持“非严格”的事务**。

Lua 是一种轻量小巧的脚本语言，用标准 C 语言编写并以源代码形式开放， 其设计目的是为了嵌入应用程序中，从而为应用程序提供灵活的扩展和定制功能。

Redis 从 2.6 版本开始支持执行 Lua 脚本，它的功能和事务非常类似。我们可以利用 Lua 脚本来批量执行多条 Redis 命令，这些 Redis 命令会被提交到 Redis 服务器一次性执行完成，大幅减小了网络开销。

**Redis 执行 Lua 是原子操作**。因为 Redis 使用串行化的方式来执行 Redis 命令， 所以在任何特定时间里， 最多都只会有一个脚本能够被放进 Lua 环境里面运行， 因此， 整个 Redis 服务器只需要创建一个 Lua 环境即可。由于，Redis 执行 Lua 具有原子性，所以常被用于需要原子性执行多命令的场景。

不过，如果 Lua 脚本运行时出错并中途结束，出错之后的命令是不会被执行的。并且，出错之前执行的命令是无法被撤销的，无法实现类似关系型数据库执行失败可以回滚的那种原子性效果。因此， **严格来说的话，通过 Lua 脚本来批量执行 Redis 命令实际也是不完全满足原子性的。**

如果想要让 Lua 脚本中的命令全部执行，必须保证语句语法和命令都是对的。

另外，Redis 7.0 新增了 [Redis functions](https://redis.io/docs/manual/programmability/functions-intro/) 特性，你可以将 Redis functions 看作是比 Lua 更强大的脚本。

### Redis 脚本命令

| 命令            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| `EVAL`          | `EVAL` 命令为客户端输入的脚本在 Lua 环境中定义一个函数， 并通过调用这个函数来执行脚本。 |
| `EVALSHA`       | `EVALSHA` 命令通过直接调用 Lua 环境中已定义的函数来执行脚本。 |
| `SCRIPT_FLUSH`  | `SCRIPT_FLUSH` 命令会清空服务器 `lua_scripts` 字典中保存的脚本， 并重置 Lua 环境。 |
| `SCRIPT_EXISTS` | `SCRIPT_EXISTS` 命令接受一个或多个 SHA1 校验和为参数， 并通过检查 `lua_scripts` 字典来确认校验和对应的脚本是否存在。 |
| `SCRIPT_LOAD`   | `SCRIPT_LOAD` 命令接受一个 Lua 脚本为参数， 为该脚本在 Lua 环境中创建函数， 并将脚本保存到 `lua_scripts` 字典中。 |
| `SCRIPT_KILL`   | `SCRIPT_KILL` 命令用于停止正在执行的脚本。                   |

### Redis 执行 Lua 的工作流程

为了在 Redis 服务器中执行 Lua 脚本， Redis 在服务器内嵌了一个 Lua 环境（environment）， 并对这个 Lua 环境进行了一系列修改， 从而确保这个 Lua 环境可以满足 Redis 服务器的需要。

Redis 服务器创建并修改 Lua 环境的整个过程由以下步骤组成：

1. 创建一个基础的 Lua 环境， 之后的所有修改都是针对这个环境进行的。
2. 载入多个函数库到 Lua 环境里面， 让 Lua 脚本可以使用这些函数库来进行数据操作。
3. 创建全局表格 `redis` ， 这个表格包含了对 Redis 进行操作的函数， 比如用于在 Lua 脚本中执行 Redis 命令的 `redis.call` 函数。
4. 使用 Redis 自制的随机函数来替换 Lua 原有的带有副作用的随机函数， 从而避免在脚本中引入副作用。
5. 创建排序辅助函数， Lua 环境使用这个辅佐函数来对一部分 Redis 命令的结果进行排序， 从而消除这些命令的不确定性。
6. 创建 `redis.pcall` 函数的错误报告辅助函数， 这个函数可以提供更详细的出错信息。
7. 对 Lua 环境里面的全局环境进行保护， 防止用户在执行 Lua 脚本的过程中， 将额外的全局变量添加到了 Lua 环境里面。
8. 将完成修改的 Lua 环境保存到服务器状态的 `lua` 属性里面， 等待执行服务器传来的 Lua 脚本。

### Redis 执行 Lua 的要点

- Redis 服务器专门使用一个伪客户端来执行 Lua 脚本中包含的 Redis 命令。
- Redis 使用脚本字典来保存所有被 `EVAL` 命令执行过， 或者被 `SCRIPT_LOAD` 命令载入过的 Lua 脚本， 这些脚本可以用于实现 `SCRIPT_EXISTS` 命令， 以及实现脚本复制功能。
- 服务器在执行脚本之前， 会为 Lua 环境设置一个超时处理钩子， 当脚本出现超时运行情况时， 客户端可以通过向服务器发送 `SCRIPT_KILL` 命令来让钩子停止正在执行的脚本， 或者发送 `SHUTDOWN nosave` 命令来让钩子关闭整个服务器。
- 主服务器复制 `EVAL` 、 `SCRIPT_FLUSH` 、 `SCRIPT_LOAD` 三个命令的方法和复制普通 Redis 命令一样 —— 只要将相同的命令传播给从服务器就可以了。
- 主服务器在复制 `EVALSHA` 命令时， 必须确保所有从服务器都已经载入了 `EVALSHA` 命令指定的 SHA1 校验和所对应的 Lua 脚本， 如果不能确保这一点的话， 主服务器会将 `EVALSHA` 命令转换成等效的 `EVAL` 命令， 并通过传播 `EVAL` 命令来获得相同的脚本执行效果。

### Redis + Lua 实现分布式锁

Redis 应用 Lua 的一个经典使用场景是实现分布式锁。其实现有 3 个重要的考量点：

1. 互斥（只能有一个客户端获取锁）
2. 不能死锁
3. 容错（只要大部分 redis 节点创建了这把锁就可以）

对应的 Redis 指令如下：

- `setnx` - `setnx key val`：当且仅当 key 不存在时，set 一个 key 为 val 的字符串，返回 1；若 key 存在，则什么都不做，返回 0。
- `expire` - `expire key timeout`：为 key 设置一个超时时间，单位为 second，超过这个时间锁会自动释放，避免死锁。
- `delete` - `delete key`：删除 key

> 注意：
>
> 不要将 `setnx` 和 `expire` 作为两个命令组合实现加锁，这样就**无法保证原子性**。如果客户端在 `setnx` 之后崩溃，那么将导致锁无法释放。正确的做法应是在 `setnx` 命令中指定 `expire` 时间。

（1）申请锁

```shell
SET resource_name my_random_value NX PX 30000
```

执行这个命令就 ok。

- `NX`：表示只有 `key` 不存在的时候才会设置成功。（如果此时 redis 中存在这个 key，那么设置失败，返回 `nil`）
- `PX 30000`：意思是 30s 后锁自动释放。别人创建的时候如果发现已经有了就不能加锁了。

（2）释放锁

释放锁就是删除 key ，但是一般可以用 `lua` 脚本删除，判断 value 一样才删除：

```python
-- 删除锁的时候，找到 key 对应的 value，跟自己传过去的 value 做比较，如果是一样的才删除。
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

## 参考资料

- [《Redis 设计与实现》](https://item.jd.com/11486101.html)
