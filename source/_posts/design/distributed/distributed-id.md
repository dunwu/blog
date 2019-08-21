---
title: 分布式 ID
categories: ['design', 'distributed']
tags: ['design', 'distributed']
date: 2019-07-24 11:55
---

# 分布式 ID

## UUID

UUID 是通用唯一识别码（Universally Unique Identifier)的缩写，开放软件基金会(OSF)规范定义了包括网卡 MAC 地址、时间戳、名字空间（Namespace）、随机或伪随机数、时序等元素。利用这些元素来生成 UUID。

UUID 是由 128 位二进制组成，一般转换成十六进制，然后用 String 表示。在 java 中有个 UUID 类,在他的注释中我们看见这里有 4 种不同的 UUID 的生成策略:

- random - 基于随机数生成 UUID，由于 Java 中的随机数是伪随机数，其重复的概率是可以被计算出来的。这个一般我们用下面的代码获取基于随机数的 UUID:

```java
String id = UUID.randomUUID().toString();
```

- time-based - 基于时间的 UUID,这个一般是通过当前时间，随机数，和本地 Mac 地址来计算出来，自带的 JDK 包并没有这个算法的我们在一些 UUIDUtil 中，比如我们的 log4j.core.util，会重新定义 UUID 的高位和低位。

```java
 public static UUID getTimeBasedUuid() {
     long time = System.currentTimeMillis() * 10000L + 122192928000000000L + (long)(COUNT.incrementAndGet() % 10000);
     long timeLow = (time & 4294967295L) << 32;
     long timeMid = (time & 281470681743360L) >> 16;
     long timeHi = (time & 1152640029630136320L) >> 48;
     long most = timeLow | timeMid | 4096L | timeHi;
     return new UUID(most, LEAST);
 }
```

- DCE security - DCE 安全的 UUID。

- name-based - 基于名字的 UUID，通过计算名字和名字空间的 MD5 来计算 UUID。

UUID 的优点:

- 通过本地生成，没有经过网络 I/O，性能较快

UUID 的缺点:

- **长度过长** - UUID 太长，16 字节 128 位，通常以 36 长度的字符串表示，很多场景不适用。例如：Mysql 官方明确建议主键越短越好，36 个字符长度的 UUID 不符合要求。
- **信息不安全** - 基于 MAC 地址生成 UUID 的算法可能会造成 MAC 地址泄露，这个漏洞曾被用于寻找梅丽莎病毒的制作者位置。
- **无序性** - 不能生成递增有序的数字。这对于一些特定场景不利。例如：如果作为数据库主键，在 InnoDB 引擎下，UUID 的无序性可能会引起数据位置频繁变动，严重影响性能。

适用场景：UUID 的适用场景可以为不需要担心过多的空间占用，以及不需要生成有递增趋势的数字。在 Log4j 里 `UuidPatternConverter` 中加入了 UUID 来标识每一条日志。

## 数据库主键自增

大家对于唯一标识最容易想到的就是主键自增，这个也是我们最常用的方法。例如我们有个订单服务，那么把订单 id 设置为主键自增即可。

优点:

- 简单方便，有序递增，方便排序和分页

缺点:

- 分库分表会带来问题，需要进行改造。
- 并发性能不高，受限于数据库的性能。
- 简单递增容易被其他人猜测利用，比如你有一个用户服务用的递增，那么其他人可以根据分析注册的用户 ID 来得到当天你的服务有多少人注册，从而就能猜测出你这个服务当前的一个大概状况。
- 数据库宕机服务不可用。

适用场景: 根据上面可以总结出来，当数据量不多，并发性能不高的时候这个很适合，比如一些 to B 的业务，商家注册这些，商家注册和用户注册不是一个数量级的，所以可以数据库主键递增。如果对顺序递增强依赖，那么也可以使用数据库主键自增。

## Redis

熟悉 Redis 的同学，应该知道在 Redis 中有两个命令 Incr，IncrBy,因为 Redis 是单线程的所以能保证原子性。

优点：

- 性能比数据库好，能满足有序递增。

缺点：

- 由于 redis 是内存的 KV 数据库，即使有 AOF 和 RDB，但是依然会存在数据丢失，有可能会造成 ID 重复。
- 依赖于 redis，redis 要是不稳定，会影响 ID 生成。

适用：由于其性能比数据库好，但是有可能会出现 ID 重复和不稳定，这一块如果可以接受那么就可以使用。也适用于到了某个时间，比如每天都刷新 ID，那么这个 ID 就需要重置，通过(Incr Today)，每天都会从 0 开始加。

## Zookeeper

利用 ZK 的 Znode 数据版本如下面的代码，每次都不获取期望版本号也就是每次都会成功，那么每次都会返回最新的版本号:

<div align="center"><img src="https://user-gold-cdn.xitu.io/2018/9/29/166243d8d5897f41?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"/></div>

Zookeeper 这个方案用得较少，严重依赖 Zookeeper 集群，并且性能不是很高，所以不予推荐。

## 数据库分段+服务缓存 ID

这个方法在美团的 Leaf 中有介绍，详情可以参考美团技术团队的发布的技术文章:[Leaf——美团点评分布式 ID 生成系统](https://link.juejin.im?target=https%3A%2F%2Ftech.meituan.com%2FMT_Leaf.html),这个方案是将数据库主键自增进行优化。

<div align="center"><img src="https://user-gold-cdn.xitu.io/2018/9/29/1662445bec45eb5d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"/></div>

biz_tag 代表每个不同的业务，max_id 代表每个业务设置的大小，step 代表每个 proxyServer 缓存的步长。 之前我们的每个服务都访问的是数据库，现在不需要，每个服务直接和我们的 ProxyServer 做交互，减少了对数据库的依赖。我们的每个 ProxyServer 回去数据库中拿出步长的长度，比如 server1 拿到了 1-1000,server2 拿到来 1001-2000。如果用完会再次去数据库中拿。

优点:

- 比主键递增性能高，能保证趋势递增。
- 如果 DB 宕机，proxServer 由于有缓存依然可以坚持一段时间。

缺点:

- 和主键递增一样，容易被人猜测。
- DB 宕机，虽然能支撑一段时间但是仍然会造成系统不可用。

适用场景:需要趋势递增，并且 ID 大小可控制的，可以使用这套方案。

当然这个方案也可以通过一些手段避免被人猜测，把 ID 变成是无序的，比如把我们生成的数据是一个递增的 long 型，把这个 Long 分成几个部分，比如可以分成几组三位数，几组四位数，然后在建立一个映射表，将我们的数据变成无序。

## 雪花算法-Snowflake

算法原理：

Snowflake 是 Twitter 提出来的一个算法，其目的是生成一个 64bit 的整数:

<div align="center"><img src="https://user-gold-cdn.xitu.io/2018/9/29/16624602fd5d9c4c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"/></div>

- 1bit:一般是符号位，不做处理
- 41bit:用来记录时间戳，这里可以记录 69 年，如果设置好起始时间比如今年是 2018 年，那么可以用到 2089 年，到时候怎么办？要是这个系统能用 69 年，我相信这个系统早都重构了好多次了。
- 10bit:10bit 用来记录机器 ID，总共可以记录 1024 台机器，一般用前 5 位代表数据中心，后面 5 位是某个数据中心的机器 ID
- 12bit:循环位，用来对同一个毫秒之内产生不同的 ID，12 位可以最多记录 4095 个，也就是在同一个机器同一毫秒最多记录 4095 个，多余的需要进行等待下毫秒。

上面只是一个将 64bit 划分的标准，当然也不一定这么做，可以根据不同业务的具体场景来划分，比如下面给出一个业务场景：

- 服务目前 QPS10 万，预计几年之内会发展到百万。
- 当前机器三地部署，上海，北京，深圳都有。
- 当前机器 10 台左右，预计未来会增加至百台。

这个时候我们根据上面的场景可以再次合理的划分 62bit,QPS 几年之内会发展到百万，那么每毫秒就是千级的请求，目前 10 台机器那么每台机器承担百级的请求，为了保证扩展，后面的循环位可以限制到 1024，也就是 2^10，那么循环位 10 位就足够了。

机器三地部署我们可以用 3bit 总共 8 来表示机房位置，当前的机器 10 台，为了保证扩展到百台那么可以用 7bit 128 来表示，时间位依然是 41bit,那么还剩下 64-10-3-7-41-1 = 2bit,还剩下 2bit 可以用来进行扩展。

<div align="center"><img src="https://user-gold-cdn.xitu.io/2018/9/29/16624909d2007c22?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"/></div>

适用场景:当我们需要无序不能被猜测的 ID，并且需要一定高性能，且需要 long 型，那么就可以使用我们雪花算法。比如常见的订单 ID，用雪花算法别人就无法猜测你每天的订单量是多少。

优点：

- 毫秒数在高位，自增序列在低位，整个 ID 都是趋势递增的。
- 不依赖数据库等第三方系统，以服务的方式部署，稳定性更高，生成 ID 的性能也是非常高的。
- 可以根据自身业务特性分配 bit 位，非常灵活。

缺点：

- 强依赖机器时钟，如果机器上时钟回拨，会导致发号重复或者服务会处于不可用状态。

### 一个简单的 Snowflake

```java
public static class DistributedId {
    private long workerId; // 这个就是代表了机器id
    private long datacenterId; // 这个就是代表了机房id
    private long sequence; // 这个就是代表了一毫秒内生成的多个id的最新序号

    public DistributedId(long workerId, long datacenterId, long sequence) {

        // sanity check for workerId
        // 这儿就不检查了，要求就是你传递进来的机房id和机器id不能超过32，不能小于0
        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException(
                String.format("worker Id can't be greater than %d or less than 0", maxWorkerId));
        }

        if (datacenterId > maxDatacenterId || datacenterId < 0) {

            throw new IllegalArgumentException(
                String.format("datacenter Id can't be greater than %d or less than 0", maxDatacenterId));
        }

        this.workerId = workerId;
        this.datacenterId = datacenterId;
        this.sequence = sequence;
    }

    private long twepoch = 1288834974657L;
    private long workerIdBits = 5L;
    private long datacenterIdBits = 5L;

    // 这个是二进制运算，就是5 bit最多只能有31个数字，也就是说机器id最多只能是32以内
    private long maxWorkerId = -1L ^ (-1L << workerIdBits);

    // 这个是一个意思，就是5 bit最多只能有31个数字，机房id最多只能是32以内
    private long maxDatacenterId = -1L ^ (-1L << datacenterIdBits);
    private long sequenceBits = 12L;

    private long workerIdShift = sequenceBits;
    private long datacenterIdShift = sequenceBits + workerIdBits;
    private long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits;
    private long sequenceMask = -1L ^ (-1L << sequenceBits);

    private long lastTimestamp = -1L;

    public long getWorkerId() {
        return workerId;
    }

    public long getDatacenterId() {
        return datacenterId;
    }

    public long getTimestamp() {
        return System.currentTimeMillis();
    }

    // 这个是核心方法，通过调用nextId()方法，让当前这台机器上的snowflake算法程序生成一个全局唯一的id
    public synchronized long nextId() {

        // 这儿就是获取当前时间戳，单位是毫秒
        long timestamp = timeGen();

        if (timestamp < lastTimestamp) {
            System.err.printf("clock is moving backwards. Rejecting requests until %d.", lastTimestamp);
            throw new RuntimeException(
                String.format("Clock moved backwards. Refusing to generate id for %d milliseconds",
                              lastTimestamp - timestamp));
        }


        // 下面是说假设在同一个毫秒内，又发送了一个请求生成一个id
        // 这个时候就得把seqence序号给递增1，最多就是4096
        if (lastTimestamp == timestamp) {

            // 这个意思是说一个毫秒内最多只能有4096个数字，无论你传递多少进来，
            //这个位运算保证始终就是在4096这个范围内，避免你自己传递个sequence超过了4096这个范围
            sequence = (sequence + 1) & sequenceMask;

            if (sequence == 0) {
                timestamp = tilNextMillis(lastTimestamp);
            }

        } else {
            sequence = 0;
        }

        // 这儿记录一下最近一次生成id的时间戳，单位是毫秒
        lastTimestamp = timestamp;

        // 这儿就是最核心的二进制位运算操作，生成一个64bit的id
        // 先将当前时间戳左移，放到41 bit那儿；将机房id左移放到5 bit那儿；将机器id左移放到5 bit那儿；将序号放最后12 bit
        // 最后拼接起来成一个64 bit的二进制数字，转换成10进制就是个long型
        return ((timestamp - twepoch) << timestampLeftShift) | (datacenterId << datacenterIdShift) | (workerId
            << workerIdShift) | sequence;
    }

    private long tilNextMillis(long lastTimestamp) {

        long timestamp = timeGen();

        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }

    private long timeGen() {
        return System.currentTimeMillis();
    }
}
```

上面定义了雪花算法的实现，在 nextId 中是我们生成雪花算法的关键。

### 防止时钟回拨

因为机器的原因会发生时间回拨，我们的雪花算法是强依赖我们的时间的，如果时间发生回拨，有可能会生成重复的 ID，在我们上面的 nextId 中我们用当前时间和上一次的时间进行判断，如果当前时间小于上一次的时间那么肯定是发生了回拨，普通的算法会直接抛出异常,这里我们可以对其进行优化,一般分为两个情况:

- 如果时间回拨时间较短，比如配置 5ms 以内，那么可以直接等待一定的时间，让机器的时间追上来。
- 如果时间的回拨时间较长，我们不能接受这么长的阻塞等待，那么又有两个策略:

1. 直接拒绝，抛出异常，打日志，通知 RD 时钟回滚。
2. 利用扩展位，上面我们讨论过不同业务场景位数可能用不到那么多，那么我们可以把扩展位数利用起来了，比如当这个时间回拨比较长的时候，我们可以不需要等待，直接在扩展位加 1。2 位的扩展位允许我们有 3 次大的时钟回拨，一般来说就够了，如果其超过三次我们还是选择抛出异常，打日志。

通过上面的几种策略可以比较的防护我们的时钟回拨，防止出现回拨之后大量的异常出现。下面是修改之后的代码，这里修改了时钟回拨的逻辑:

<div align="center"><img src="https://user-gold-cdn.xitu.io/2018/9/29/166252f2a1edac10?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"/></div>

## 参考资料

- [百度分布式 ID](https://github.com/baidu/uid-generator/blob/master/README.zh_cn.md)
- [如果再有人问你分布式 ID，这篇文章丢给他](https://juejin.im/post/5bb0217ef265da0ac2567b42)
- [理解分布式 id 生成算法 SnowFlake](https://segmentfault.com/a/1190000011282426)
- [Leaf——美团点评分布式 ID 生成系统](https://tech.meituan.com/2017/04/21/mt-leaf.html)
- [UUID 规范](https://www.ietf.org/rfc/rfc4122.txt)
