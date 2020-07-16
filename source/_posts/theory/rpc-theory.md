---
title: RPC 基本原理
categories: ['分布式']
tags: ['分布式', '微服务', 'RPC']
date: 2020-06-10 16:00
---

# RPC 基本原理

## RPC 简介

### 什么是 RPC

RPC 框架能够帮助我们解决系统拆分后的通信问题，并且能让我们像调用本地一样去调用远程方法。

更进一步来讲，RPC 的工作流程如下：

![img](http://dunwu.test.upcdn.net/snap/20200610153311.png)

- RPC 拦截调用方要执行的远程方法，将方法名、参数等序列化为方便在网络中传输的二进制或 JSON 数据，然后将这些请求信息传给服务提供方；
- 服务提供方将请求信息反序列化为本地的方法和请求参数，然后执行，最后将执行结果序列化为二进制或 JSON 数据，再回应给调用方。
- 调用方将应答数据反序列化。

**RPC 的作用**：

- **屏蔽远程调用跟本地调用的区别**
- **隐藏底层网络通信的复杂性**

### RPC 协议

既然有了现成的 HTTP 协议，还有必要设计 RPC 协议吗？

有必要。因为 HTTP 这些通信标准协议，数据包中的实际请求数据相对于数据包本身要小很多，有很多无用的内容；并且 HTTP 属于无状态协议，无法将请求和响应关联，每次请求要重新建立连接。这对于高性能的 RPC 来说，HTTP 协议难以满足需求，所以有必要设计一个紧凑的私有协议。

![img](http://dunwu.test.upcdn.net/snap/20200610163132.png)

## 序列化

> **序列化可以将对象的字节序列持久化——保存在内存、文件、数据库中**。

序列化是 RPC 的要点之一。

![img](http://dunwu.test.upcdn.net/snap/1553224129484.png)

### 常见序列化方式

#### JDK 序列化

> 有兴趣深入了解 JDK 序列化方式，可以参考：[深入理解 Java 序列化](https://github.com/dunwu/javacore/blob/master/docs/io/java-serialization.md)

#### JSON

[jackson](https://github.com/FasterXML/jackson)、[gson](https://github.com/google/gson)、[fastjson](https://github.com/alibaba/fastjson) - 适用于对序列化后的数据要求有良好的可读性（转为 json 、xml 形式）。

#### Hessian

[hessian](http://hessian.caucho.com/doc/hessian-overview.xtp) - 适用于对开发体验敏感，性能有要求的内外部系统。

#### Thrift / Protobuf

[thrift](https://github.com/apache/thrift)、[protobuf](https://github.com/protocolbuffers/protobuf) - 适用于对性能敏感，对开发体验要求不高的内部系统。

初次以外，还有很多其他的序列化方案。那么，RPC 的序列化方式如何选择呢？

![img](http://dunwu.test.upcdn.net/snap/20200610193721.png)

综合以上，Java RPC 框架中序列化方式，一般首选 Protobuf 和 Hessian，二者在性能、通用性、安全性、兼容性、空间开销上都表现不错。其中，Protobuf 性能、通用性更好；而 Hessian 在开发体验上更为便捷。

### 序列化问题

Java 对象序列化，一般要关注以下问题：

常规性问题：

- 当父类继承 `Serializable` 接口时，所有子类都可以被序列化。
- 子类实现了 `Serializable` 接口，父类没有，则父类的属性不会被序列化（不报错，数据丢失），子类的属性仍可以正确序列化。
- 如果序列化的属性是对象，则这个对象也必须实现 `Serializable` 接口，否则会报错。
- 在反序列化时，如果对象的属性有修改或删减，则修改的部分属性会丢失，但不会报错。
- 在反序列化时，如果 `serialVersionUID` 被修改，则反序列化时会失败。

设计问题：

- **对象过于复杂、庞大** - 对象过于复杂、庞大，会降低序列化、反序列化的效率，并增加传输开销，从而导致响应时延增大。
- **对象有复杂的继承关系** - 对象关系越复杂，就越浪费性能，同时又很容易出现序列化上的问题。
- **使用序列化框架不支持的类作为入参类** - 比如 Hessian 框架，他天然是不支持 LinkHashMap、LinkedHashSet 等，而且大多数情况下最好不要使用第三方集合类，如 Guava 中的集合类，很多开源的序列化框架都是优先支持编程语言原生的对象。因此如果入参是集合类，应尽量选用原生的、最为常用的集合类，如 HashMap、ArrayList。

## 反射+动态代理

RPC 的远程过程调用时通过反射+动态代理实现的。

![img](http://dunwu.test.upcdn.net/snap/20200610161617.png)

RPC 框架会自动为要调用的接口生成一个代理类。当在项目中注入接口的时候，运行过程中实际绑定的就是这个接口生成的代理类。在接口方法被调用时，会被代理类拦截，这样，就可以在生成的代理类中，加入远程调用逻辑。

> 反射+动态代理更多详情可以参考：[深入理解 Java 反射和动态代理](https://github.com/dunwu/javacore/blob/master/docs/basics/java-reflection.md)

## 网络通信

常见的网络 IO 模型有：同步阻塞（BIO）、同步非阻塞（NIO）、异步非阻塞（AIO）。

RPC 框架在网络通信上倾向于 Reactor 模式（多路复用模式）。对 Java 而言，首选的框架便是 Netty 框架。

## RPC 架构模型

![img](http://dunwu.test.upcdn.net/snap/20200610164920.png)

### 服务发现

![img](http://dunwu.test.upcdn.net/snap/20200610180056.png)

### 健康检查

使用频率适中的心跳去检测目标机器的健康状态。

- 健康状态：建立连接成功，并且心跳探活也一直成功；
- 亚健康状态：建立连接成功，但是心跳请求连续失败；
- 死亡状态：建立连接失败。

可以使用可用率来作为健康状态的量化标准：

```
可用率 = 一个时间窗口内接口调用成功次数 / 总调用次数
```

当可用率低于某个比例，就认为这个节点存在问题，把它挪到亚健康列表，这样既考虑了高低频的调用接口，
也兼顾了接口响应时间不同的问题。

### 路由策略

对于服务调用方来说，一个接口会有多个服务提供方同时提供服务，所以我们的 RPC 在每次发起请求的时候，都需要从多个服务提供方节点里面选择一个用于发请求的节点。

典型应用场景：

- 灰度发布
- 定点调用

除了特殊场景的路由策略以外，对于机器中多个服务方，如何选择调用哪个服务节点，可以应用负载均衡策略。

> 负载均衡详情可以参考：[负载均衡基本原理](https://github.com/dunwu/blog/blob/master/source/_posts/distributed/load-balance-theory.md)

### 超时重试

超时重试机制是指：当调用端发起的请求失败或超时未收到响应时，RPC 框架自身可以进行重试，再重新发送请求，用户可以自行设置是否开启重试以及重试的次数。

![img](http://dunwu.test.upcdn.net/snap/20200610193748.png)

### 限流、降级、熔断

限流方案：Redis + lua、Sentinel

熔断方案：Hystrix

### 优雅启动关闭

如何避免服务停机带来的业务损失：

![img](http://dunwu.test.upcdn.net/snap/20200610193806.png)

如何避免流量打到没有启动完成的节点：

![img](http://dunwu.test.upcdn.net/snap/20200610193829.png)

## 参考资料

- [《RPC 实战与核心原理》](https://time.geekbang.org/column/intro/280)
