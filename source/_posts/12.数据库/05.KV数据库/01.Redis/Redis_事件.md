---
icon: logos:redis
title: Redis 事件
date: 2023-09-11 22:22:32
order: 13
categories:
  - 数据库
  - KV数据库
  - Redis
tags:
  - 数据库
  - KV数据库
  - Redis
permalink: /pages/83bd4bff/
---

# Redis 事件

> Redis 服务器是一个事件驱动程序，服务器需要处理两类事件：
>
> - **`文件事件（file event）`** - Redis 服务器通过套接字（Socket）与客户端或者其它服务器进行通信，文件事件就是对套接字操作的抽象。服务器与客户端（或其他的服务器）的通信会产生文件事件，而服务器通过监听并处理这些事件来完成一系列网络通信操作。
> - **`时间事件（time event）`** - Redis 服务器有一些操作需要在给定的时间点执行，时间事件是对这类定时操作的抽象。
>
> 关键词：`文件事件`、`时间事件`

## 文件事件

Redis 基于 Reactor 模式开发了自己的网络时间处理器。

- Redis 文件事件处理器使用 I/O 多路复用程序来同时监听多个套接字，并根据套接字目前执行的任务来为套接字关联不同的事件处理器。
- 当被监听的套接字准备好执行连接应答、读取、写入、关闭操作时，与操作相对应的文件事件就会产生，这时文件事件处理器就会调用套接字之前关联好的事件处理器来处理这些事件。

**虽然文件事件处理器以单线程方式运行，但通过使用 I/O 多路复用程序来监听多个套接字**，文件事件处理器既实现了高性能的网络通信模型，又可以很好地与 Redis 服务器中其他同样以单线程方式运行的模块进行对接，这保持了 Redis 内部单线程设计的简单性。

Redis 通过 **IO 多路复用程序** 来监听来自客户端的大量连接（或者说是监听多个 socket），它会将感兴趣的事件及类型（读、写）注册到内核中并监听每个事件是否发生。

这样的好处非常明显：**I/O 多路复用技术的使用让 Redis 不需要额外创建多余的线程来监听客户端的大量连接，降低了资源的消耗**（和 NIO 中的 `Selector` 组件很像）。

文件事件处理器有四个组成部分：

- 多个 Socket（客户端连接）
- IO 多路复用程序（支持多个客户端连接的关键）
- 文件事件分派器（将 Socket 关联到相应的事件处理器）
- 事件处理器（连接应答处理器、命令请求处理器、命令回复处理器）

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200130172525.png)

## 时间事件

时间事件又分为：

- **定时事件**：是让一段程序在指定的时间之内执行一次；
- **周期性事件**：是让一段程序每隔指定时间就执行一次。

Redis 将所有时间事件都放在一个无序链表中，每当时间事件执行器运行时，通过遍历整个链表查找出已到达的时间事件，并调用响应的事件处理器。

## 事件的调度与执行

服务器需要不断监听文件事件的套接字才能得到待处理的文件事件，但是不能一直监听，否则时间事件无法在规定的时间内执行，因此监听时间应该根据距离现在最近的时间事件来决定。

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

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/cs/database/redis/redis-event.png" />
</div>
## 线程模型

虽然说 Redis 是单线程模型，但实际上，**Redis 在 4.0 之后的版本中就已经加入了对多线程的支持。**

不过，Redis 4.0 增加的多线程主要是针对一些大键值对的删除操作的命令，使用这些命令就会使用主线程之外的其他线程来“异步处理”，从而减少对主线程的影响。

为此，Redis 4.0 之后新增了几个异步命令：

- `UNLINK`：可以看作是 `DEL` 命令的异步版本。
- `FLUSHALL ASYNC`：用于清空所有数据库的所有键，不限于当前 `SELECT` 的数据库。
- `FLUSHDB ASYNC`：用于清空当前 `SELECT` 数据库中的所有键。

总的来说，直到 Redis 6.0 之前，Redis 的主要操作仍然是单线程处理的。

**Redis6.0 之前为什么不使用多线程？** 我觉得主要原因有 3 点：

- 单线程编程容易并且更容易维护；
- Redis 的性能瓶颈不在 CPU ，主要在内存和网络；
- 多线程就会存在死锁、线程上下文切换等问题，甚至会影响性能。

**Redis6.0 引入多线程主要是为了提高网络 IO 读写性能**，因为这个算是 Redis 中的一个性能瓶颈（Redis 的瓶颈主要受限于内存和网络）。

虽然，Redis6.0 引入了多线程，但是 Redis 的多线程只是在网络数据的读写这类耗时操作上使用了，执行命令仍然是单线程顺序执行。因此，你也不需要担心线程安全问题。

Redis6.0 的多线程默认是禁用的，只使用主线程。如需开启需要设置 IO 线程数 > 1，需要修改 redis 配置文件 `redis.conf`：

```
io-threads 4 #设置1的话只会开启主线程，官网建议4核的机器建议设置为2或3个线程，8核的建议设置为6个线程
```

另外：

- io-threads 的个数一旦设置，不能通过 config 动态设置。
- 当设置 ssl 后，io-threads 将不工作。

开启多线程后，默认只会使用多线程进行 IO 写入 writes，即发送数据给客户端，如果需要开启多线程 IO 读取 reads，同样需要修改 redis 配置文件 `redis.conf` :

```
io-threads-do-reads yes
```

但是官网描述开启多线程读并不能有太大提升，因此一般情况下并不建议开启

## 参考资料

- [《Redis 设计与实现》](https://item.jd.com/11486101.html)
