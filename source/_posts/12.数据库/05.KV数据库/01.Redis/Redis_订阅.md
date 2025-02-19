---
icon: logos:redis
title: Redis 发布订阅
date: 2023-09-11 22:22:30
categories:
  - 数据库
  - KV数据库
  - Redis
tags:
  - 数据库
  - KV数据库
  - Redis
  - 订阅
  - 观察者模式
permalink: /pages/c03b7b4f/
---

# Redis 发布订阅

> Redis 发布订阅 (pub/sub) 是一种消息通信模式：发送者 (pub) 发送消息，订阅者 (sub) 接收消息。Redis 客户端可以订阅任意数量的频道。
>
> Redis 有两种发布订阅模式
>
> - 基于频道（Channel）的发布订阅
> - 基于模式（Pattern）的发布订阅
>
> 关键词：`订阅`、`SUBSCRIBE`、`PSUBSCRIBE`、`PUBLISH`、`观察者模式`

## 观察者模式

Redis 发布订阅应用了设计模式中经典的“观察者模式”。

**观察者模式**（Observer）是一种行为设计模式，允许你定义一种订阅机制，可在对象事件发生时通知多个 “观察” 该对象的其他对象。

- 当一个对象状态的改变需要改变其他对象，或实际对象是事先未知的或动态变化的时，可使用观察者模式。
- 当应用中的一些对象必须观察其他对象时，可使用该模式。但仅能在有限时间内或特定情况下使用。

![观察者模式](https://d1.awsstatic.com/product-marketing/Messaging/sns_img_topic.e024462ec88e79ed63d690a2eed6e050e33fb36f.png)

## Redis 订阅模式

Redis 有两种发布订阅模式：

（1）**基于频道（Channel）的发布订阅**

服务器状态在 `pubsub_channels` 字典保存了所有频道的订阅关系： `SUBSCRIBE` 命令负责将客户端和被订阅的频道关联到这个字典里面， 而 `UNSUBSCRIBE` 命令则负责解除客户端和被退订频道之间的关联。

【示例】订阅指定频道示例

打开客户端一，执行以下命令

```shell
> SUBSCRIBE first second
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "first"
3) (integer) 1
1) "subscribe"
2) "second"
3) (integer) 2
```

打开客户端二，执行以下命令

```shell
> PUBLISH second Hello
1) "1"
```

此时，客户端一会收到以下内容

```shell
1) "message"
2) "second"
3) "Hello"
```

（2）**基于模式（Pattern）的发布订阅**

服务器状态在 `pubsub_patterns` 链表保存了所有模式的订阅关系： `PSUBSCRIBE` 命令负责将客户端和被订阅的模式记录到这个链表中， 而 `UNSUBSCRIBE` 命令则负责移除客户端和被退订模式在链表中的记录。

【示例】订阅符合指定模式的频道

打开客户端一，执行以下命令

```shell
> PSUBSCRIBE news.*
Reading messages... (press Ctrl-C to quit)
1) "psubscribe"
2) "news.*"
3) (integer) 1
```

打开客户端二，执行以下命令

```shell
> PUBLISH news.A Hello
1) "1"
```

打开客户端三，执行以下命令

```shell
> PUBLISH news.B World
1) "1"
```

此时，客户端一会收到以下内容

```shell
1) "pmessage"
2) "news.*"
3) "news.A"
4) "Hello"
1) "pmessage"
2) "news.*"
3) "news.B"
4) "World"
```

## 发布订阅命令

Redis 提供了以下与订阅发布有关的命令：

| 命令                                                     | 描述                       |
| -------------------------------------------------------- | -------------------------- |
| [`SUBSCRIBE`](https://redis.io/commands/subscribe/)      | 订阅指定频道               |
| [`UNSUBSCRIBE`](https://redis.io/commands/unsubscribe)   | 取消订阅指定频道           |
| [`PSUBSCRIBE`](https://redis.io/commands/psubscribe)     | 订阅符合指定模式的频道     |
| [`PUNSUBSCRIBE`](https://redis.io/commands/punsubscribe) | 取消订阅符合指定模式的频道 |
| [`PUBLISH`](https://redis.io/commands/publish/)          | 发送信息到指定的频道       |
| [`PUBSUB`](https://redis.io/commands/pubsub/)            | 查看发布订阅状态           |

## 参考资料

- [《Redis 设计与实现》](https://item.jd.com/11486101.html)
