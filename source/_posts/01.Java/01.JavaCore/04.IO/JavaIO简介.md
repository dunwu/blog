---
title: Java I/O 之 简介
date: 2020-11-21 16:36:40
order: 01
categories:
  - Java
  - JavaCore
  - IO
tags:
  - Java
  - JavaCore
  - IO
permalink: /pages/11934510/
---

# Java I/O 之 简介

IO 即 `Input/Output`（输入和输出），指的是：**计算机内存与外部设备之间拷贝数据的过程**。由于 CPU 访问内存的速度远远高于外部设备，因此 CPU 是先把外部设备的数据读到内存里，然后再进行处理。

## UNIX I/O 模型

UNIX 系统下的 I/O 模型有 5 种：

- 同步阻塞 I/O
- 同步非阻塞 I/O
- I/O 多路复用
- 信号驱动 I/O
- 异步 I/O

如何去理解 UNIX I/O 模型，大致有以下两个维度：

- 区分同步或异步（synchronous/asynchronous）。简单来说，同步是一种可靠的有序运行机制，当我们进行同步操作时，后续的任务是等待当前调用返回，才会进行下一步；而异步则相反，其他任务不需要等待当前调用返回，通常依靠事件、回调等机制来实现任务间次序关系。
- 区分阻塞与非阻塞（blocking/non-blocking）。在进行阻塞操作时，当前线程会处于阻塞状态，无法从事其他任务，只有当条件就绪才能继续，比如 ServerSocket 新连接建立完毕，或数据读取、写入操作完成；而非阻塞则是不管 IO 操作是否结束，直接返回，相应操作在后台继续处理。

不能一概而论认为同步或阻塞就是低效，具体还要看应用和系统特征。

对于一个网络 I/O 通信过程，比如网络数据读取，会涉及两个对象，一个是调用这个 I/O 操作的用户线程，另外一个就是操作系统内核。一个进程的地址空间分为用户空间和内核空间，用户线程不能直接访问内核空间。

当用户线程发起 I/O 操作后，网络数据读取操作会经历两个步骤：

- **用户线程等待内核将数据从网卡拷贝到内核空间。**
- **内核将数据从内核空间拷贝到用户空间。**

各种 I/O 模型的区别就是：它们实现这两个步骤的方式是不一样的。

### 同步阻塞 I/O

用户线程发起 read 调用后就阻塞了，让出 CPU。内核等待网卡数据到来，把数据从网卡拷贝到内核空间，接着把数据拷贝到用户空间，再把用户线程叫醒。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20201121163321.jpg)

### 同步非阻塞 I/O

用户线程不断的发起 read 调用，数据没到内核空间时，每次都返回失败，直到数据到了内核空间，这一次 read 调用后，在等待数据从内核空间拷贝到用户空间这段时间里，线程还是阻塞的，等数据到了用户空间再把线程叫醒。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20201121163344.jpg)

### I/O 多路复用

用户线程的读取操作分成两步了，线程先发起 select 调用，目的是问内核数据准备好了吗？等内核把数据准备好了，用户线程再发起 read 调用。在等待数据从内核空间拷贝到用户空间这段时间里，线程还是阻塞的。那为什么叫 I/O 多路复用呢？因为一次 select 调用可以向内核查多个数据通道（Channel）的状态，所以叫多路复用。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20201121163408.jpg)

### 信号驱动 I/O

首先开启 Socket 的信号驱动 I/O 功能，并安装一个信号处理函数，进程继续运行并不阻塞。当数据准备好时，进程会收到一个 SIGIO 信号，可以在信号处理函数中调用 I/O 操作函数处理数据。**信号驱动式 I/O 模型的优点是我们在数据报到达期间进程不会被阻塞，我们只要等待信号处理函数的通知即可**

### 异步 I/O

用户线程发起 read 调用的同时注册一个回调函数，read 立即返回，等内核将数据准备好后，再调用指定的回调函数完成处理。在这个过程中，用户线程一直没有阻塞。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20201121163428.jpg)

## Java I/O 模型

在 Java 中，主要支持三种 IO 模型：

- BIO（blocking IO）
- NIO（non-blocking IO）
- AIO（Asynchronous IO）

### BIO（blocking IO）

BIO（blocking IO） 是同步阻塞 IO 模型。指的主要是传统的 `java.io` 包，它基于流模型实现。BIO 的数据传输采用同步、阻塞的方式，也就是说，在读取输入流或者写入输出流时，在读、写动作完成之前，线程会一直阻塞在那里。

如果要让 **BIO 通信模型** 能够同时处理多个客户端请求，就必须使用多线程（主要原因是`socket.accept()`、`socket.read()`、`socket.write()` 涉及的三个主要函数都是同步阻塞的），但会造成不必要的线程开销。不过可以通过 **线程池机制** 改善，线程池还可以让线程的创建和回收成本相对较低。

**即使可以用线程池略微优化，但是会消耗宝贵的线程资源，并且在百万级并发场景下也撑不住**。如果并发访问量增加会导致线程数急剧膨胀可能会导致线程堆栈溢出、创建新线程失败等问题，最终导致进程宕机或者僵死，不能对外提供服务。

### NIO（non-blocking IO）

JDK 4 引入了 NIO，源码在 `java.nio` 包中。NIO（non-blocking IO） 属于 I/O 多路复用模型。NIO 提供了 `Channel`、`Selector`、`Buffer` 等新的抽象，可以构建多路复用的、同步非阻塞 IO 程序，同时提供了更接近操作系统底层的高性能数据操作方式。

NIO 具有以下优点：

- 使用缓冲区优化读写流 - NIO 与传统 I/O 不同，它是基于块（Block）的，它以块为基本单位处理数据。在 NIO 中，最为重要的两个组件是缓冲区（`Buffer`）和通道（`Channel`）。`Buffer` 是一块连续的内存块，是 NIO 读写数据的缓冲。`Buffer` 可以将文件一次性读入内存再做后续处理，而传统的方式是边读文件边处理数据。`Channel` 表示缓冲数据的源头或者目的地，它用于读取缓冲或者写入数据，是访问缓冲的接口。
- 使用 DirectBuffer 减少内存复制 - NIO 还提供了一个可以直接访问物理内存的类 `DirectBuffer`。普通的 `Buffer` 分配的是 JVM 堆内存，而 `DirectBuffer` 是直接分配物理内存。数据要输出到外部设备，必须先从用户空间复制到内核空间，再复制到输出设备，而 `DirectBuffer` 则是直接将步骤简化为从内核空间复制到外部设备，减少了数据拷贝。
- 优化 I/O，避免阻塞 - 传统 I/O 的数据读写是在用户空间和内核空间来回复制，而内核空间的数据是通过操作系统层面的 I/O 接口从磁盘读取或写入。NIO 的 `Channel` 有自己的处理器，可以完成内核空间和磁盘之间的 I/O 操作。在 NIO 中，我们读取和写入数据都要通过 `Channel`，由于 `Channel` 是双向的，所以读、写可以同时进行。

### AIO（Asynchronous IO）

AIO（Asynchronous IO） 即异步非阻塞 IO，指的是 JDK7 中，对 NIO 有了进一步的改进，也称为 NIO2，引入了异步非阻塞 IO 方式。异步 IO 操作基于事件和回调机制，可以简单理解为，应用操作直接返回，而不会阻塞在那里，当后台处理完成，操作系统会通知相应线程进行后续工作。

## 参考资料

- [《Java 编程思想（Thinking in java）》](https://book.douban.com/subject/2130190/)
- [《Java 核心技术 卷 I 基础知识》](https://book.douban.com/subject/26880667/)
- [极客时间教程 - Java 核心技术面试精讲](https://time.geekbang.org/column/intro/82)
- [BIO,NIO,AIO 总结](https://github.com/Snailclimb/JavaGuide/blob/master/docs/java/BIO-NIO-AIO.md)
- [深入拆解 Tomcat & Jetty](https://time.geekbang.org/column/intro/100027701)
