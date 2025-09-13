---
title: Java 并发面试一
date: 2020-06-04 13:51:00
categories:
  - Java
  - JavaCore
  - 面试
tags:
  - Java
  - JavaCore
  - 面试
  - 并发
permalink: /pages/76e764a2/
---

# Java 并发面试一

## 并发简介

### 【简单】并发和并行有什么区别？

> - 什么是并发？
> - 什么是并行？
> - 并发和并行有什么区别？

并发和并行是最容易让新手费解的概念，那么如何理解二者呢？其最关键的差异在于：是否是**同时**发生：

- **并发是指具备处理多个任务的能力，但不一定要同时**。
- **并行是指具备同时处理多个任务的能力**。

下面是我见过最生动的说明，摘自 [并发与并行的区别是什么？——知乎的高票答案](https://www.zhihu.com/question/33515481/answer/58849148)

- 你吃饭吃到一半，电话来了，你一直到吃完了以后才去接，这就说明你不支持并发也不支持并行。
- 你吃饭吃到一半，电话来了，你停了下来接了电话，接完后继续吃饭，这说明你支持并发。
- 你吃饭吃到一半，电话来了，你一边打电话一边吃饭，这说明你支持并行。

### 【简单】同步和异步有什么区别？

> - 什么是同步？
> - 什么是异步？
> - 同步和异步有什么区别？

- **同步**：顺序执行，必须等待当前任务完成才能继续，会阻塞后续操作。
- **异步**：不等待当前任务完成，直接执行后续操作，任务完成后通过回调/通知返回结果。

比喻：

- 同步就像是打电话：不挂电话，通话不会结束。
- 异步就像是发短信：发完短信后，就可以做其他事；当收到回复短信时，手机会通过铃声或振动来提醒。

### 【简单】阻塞和非阻塞有什么区别？

> - 什么是阻塞？
> - 阻塞和非阻塞有什么区别？

阻塞和非阻塞关注的是程序在等待调用结果（消息，返回值）时的状态：

- **阻塞**：是指调用结果返回之前，当前线程会被挂起。调用线程只有在得到结果之后才会返回。
- **非阻塞**：是指在不能立刻得到结果之前，该调用不会阻塞当前线程。

比喻：

- 阻塞：排队等奶茶，不拿到不走；
- 非阻塞：点完奶茶去逛街，店员短信通知后再取。

### 【中等】进程、线程、协程、管程有什么区别？

进程、线程、协程、管程对比：

| **概念** | **定义**                                     | **特点**                                                      | **适用场景**                           |
| -------- | -------------------------------------------- | ------------------------------------------------------------- | -------------------------------------- |
| **进程** | **可视为一个正在运行的程序**                 | 独立内存空间<br>切换开销大<br>进程间通信（IPC）较复杂         | 需要高隔离性的任务（如浏览器多标签）   |
| **线程** | **CPU 调度的基本单位**（属于进程）           | 共享进程内存<br>切换开销较小<br>需同步（锁）避免竞态          | 高并发任务（如Web服务器处理请求）      |
| **协程** | **用户态轻量级线程**（协作式调度）           | 无内核切换开销<br>由程序员控制切换（`yield`）<br>单线程内并发 | I/O密集型高并发（如爬虫、异步编程）    |
| **管程** | **管理共享资源的同步机制**（如锁、条件变量） | 封装线程同步逻辑<br>避免手动操作锁（如Java `synchronized`）   | 多线程共享资源（如线程安全的数据结构） |

**小结**：

- **进程**：隔离性强但开销大。
- **线程**：CPU 调度的基本单位，共享内存但需同步。
- **协程**：用户态线程，高效但需主动让出控制权。
- **管程**：同步工具，简化多线程资源共享。

进程和线程的差异：

- 一个程序至少有一个进程，一个进程至少有一个线程。
- 线程比进程划分更细，所以执行开销更小，并发性更高
- 进程是一个实体，拥有独立的资源；而同一个进程中的多个线程共享进程的资源。

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javacore/concurrent/processes-vs-threads.jpg)

JVM 在单个进程中运行，JVM 中的线程共享属于该进程的堆。这就是为什么几个线程可以访问同一个对象。线程共享堆并拥有自己的堆栈空间。这是一个线程如何调用一个方法以及它的局部变量是如何保持线程安全的。但是堆不是线程安全的并且为了线程安全必须进行同步。

### 【中等】Java 线程和操作系统的线程有什么区别？

以下是 Java 线程与操作系统线程的区别对比表：

| **对比维度**      | **Java 线程**                                       | **操作系统线程**                               |
| ----------------- | --------------------------------------------------- | ---------------------------------------------- |
| **抽象层级**      | JVM 层面的用户态抽象（现代 JVM 1:1 映射到 OS 线程） | 内核直接管理的原生线程（内核态）               |
| **调度机制**      | 依赖 OS 调度，但可通过协程（如虚拟线程）优化        | 完全由内核抢占式调度                           |
| **创建/切换开销** | 高（需系统调用），但线程池可优化                    | 高（上下文切换涉及用户态-内核态切换）          |
| **并发模型**      | 支持 1:1（默认）和 M:N（虚拟线程）                  | 仅 1:1，并发数受内核限制                       |
| **平台依赖性**    | 跨平台（JVM 统一行为，底层实现因 OS 而异）          | 直接依赖 OS 和硬件特性（如线程优先级实现不同） |
| **同步机制**      | 高级抽象（如`synchronized`，映射为 OS 原语）        | 底层原语（如`pthread_mutex`）                  |
| **栈内存占用**    | 默认 1MB（可调），虚拟线程仅 KB 级                  | Linux 默认 8MB（不可跨线程共享）               |
| **典型应用场景**  | 通用并发编程，高并发推荐虚拟线程                    | 直接系统编程，需精细控制线程行为的场景         |

**补充说明**：

1. **现代 JVM**：HotSpot 等主流 JVM 默认将 Java 线程与 OS 线程**1:1 绑定**，但虚拟线程（Project Loom）实现**M:N 映射**，显著提升并发能力。
2. **性能关键点**：
   - Java 线程的阻塞操作（如 I/O）会阻塞 OS 线程，而虚拟线程通过挂起避免资源浪费。
   - OS 线程数量过多会导致内存和调度开销激增，Java 线程池或虚拟线程可缓解。

### 【中等】单核 CPU 支持 Java 多线程吗？

**单核 CPU 可以支持 Java 多线程**，但多个线程**无法真正并行执行**，而是通过**时间片轮转（分时调度）**在单个 CPU 核心上交替运行，实现**并发（Concurrency）**而非**并行（Parallelism）**。

这里顺带提一下 Java 使用的线程调度方式。

操作系统主要通过两种线程调度方式来管理多线程的执行：

- **抢占式调度（Preemptive Scheduling）**：操作系统决定何时暂停当前正在运行的线程，并切换到另一个线程执行。这种切换通常是由系统时钟中断（时间片轮转）或其他高优先级事件（如 I/O 操作完成）触发的。这种方式存在上下文切换开销，但公平性和 CPU 资源利用率较好，不易阻塞。
- **协同式调度（Cooperative Scheduling）**：线程执行完毕后，主动通知系统切换到另一个线程。这种方式可以减少上下文切换带来的性能开销，但公平性较差，容易阻塞。

Java 使用的线程调度是抢占式的。也就是说，JVM 本身不负责线程的调度，而是将线程的调度委托给操作系统。操作系统通常会基于线程优先级和时间片来调度线程的执行，高优先级的线程通常获得 CPU 时间片的机会更多。

### 【简单】并发一定比串行更快吗？

**并发不一定比串行更快**！关键看场景：

**并发更快的情况**

- 📶 **I/O 密集型**：网络/磁盘操作时，CPU 可切换做其他事
- ⚡ **多核 CPU**：真正并行执行计算任务

**串行更快的情况**

- 🔢 **单核 CPU 计算**：线程切换反而增加开销
- 🔒 **高竞争场景**：锁争用导致线程空等
- 🎯 **简单任务**：并发管理开销超过收益

**黄金法则**

- I/O 多用并发，计算多用多核
- 避免无脑加线程，合理控制并发度

### 【简单】什么是并发安全？有哪些线程不安全的情况？

::: info 什么是并发安全？
:::

并发最重要的问题是并发安全问题。所谓**并发安全**，是指保证程序的正确性，使得并发处理结果符合预期。

并发安全需要保证几个基本特性：

- **可见性** - 是一个线程修改了某个共享变量，其状态能够立即被其他线程知晓，通常被解释为将线程本地状态反映到主内存上，`volatile` 就是负责保证可见性的。
- **原子性** - 简单说就是相关操作不会中途被其他线程干扰，一般通过同步机制（加锁：`sychronized`、`Lock`）实现。
- **有序性** - 是保证线程内串行语义，避免指令重排等。

::: info 有哪些线程不安全的情况？
:::

- **竞态条件**：多线程同时修改共享变量（如 `count++`）
- **非原子操作**：多步骤操作被中断（如 `if(x==null) x=new Object()`）
- **可见性问题**：线程 A 的修改对线程 B 不可见
- **死锁**：多个线程互相持有对方需要的锁
- **资源泄漏**：线程未释放资源（如连接、文件）

::: info 线程不安全有哪些解决办法？
:::

- 同步：`synchronized`、`Lock`
- 原子类：`AtomicInteger`
- 不可变对象：`final`
- 并发容器：`ConcurrentHashMap`

> 核心：减少共享数据，合理加锁

### 【中等】为什么会有并发安全问题？

**（1）缓存导致的可见性问题**

一个线程对共享变量的修改，另外一个线程能够立刻看到，称为 **可见性**。

在单核时代，所有的线程都是在一颗 CPU 上执行，CPU 缓存与内存的数据一致性容易解决。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409042331169.png)

多核时代，每颗 CPU 都有自己的缓存，这时 CPU 缓存与内存的数据一致性就没那么容易解决了，当多个线程在不同的 CPU 上执行时，这些线程操作的是不同的 CPU 缓存。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409042332517.png)

**（2）线程切换带来的原子性问题**

Java 的并发也是基于任务切换。Java 中，即使是一条语句，也可能需要执行多条 CPU 指令。**一个或者多个操作在 CPU 执行的过程中不被中断的特性称为原子性**。

CPU 能保证的原子操作是 CPU 指令级别的，而不是高级语言的操作符。违背直觉的是，高级语言里一条语句往往需要多条 CPU 指令完成，例如上面代码中的`count += 1`，至少需要三条 CPU 指令。

- 指令 1：首先，需要把变量 count 从内存加载到 CPU 的寄存器；
- 指令 2：之后，在寄存器中执行+1 操作；
- 指令 3：最后，将结果写入内存（缓存机制导致可能写入的是 CPU 缓存而不是内存）。

因此，执行 `count += 1` 不是原子操作。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409042334004.png)

**（3）编译优化带来的有序性问题**

有序性指的是程序按照代码的先后顺序执行。编译器为了优化性能，有时候会改变程序中语句的先后顺序，例如程序中：`a=6; b=7;` 编译器优化后可能变成 `b=7; a=6;`，在这个例子中，编译器调整了语句的顺序，但是不影响程序的最终结果。不过有时候编译器及解释器的优化可能导致意想不到的 Bug。

### 【中等】哪些场景需要额外注意线程安全问题？

- **访问共享变量或资源** - 典型的场景有访问共享对象的属性，访问 static 静态变量，访问共享的缓存，等等。因为这些信息不仅会被一个线程访问到，还有可能被多个线程同时访问，那么就有可能在并发读写的情况下发生线程安全问题。
- **依赖时序的操作** - 如果我们操作的正确性是依赖时序的，而在多线程的情况下又不能保障执行的顺序和我们预想的一致，这个时候就会发生线程安全问题。
- **不同数据之间存在绑定关系** - 有时候，不同数据之间是成组出现的，存在着相互对应或绑定的关系，最典型的就是 IP 和端口号。有时候我们更换了 IP，往往需要同时更换端口号，如果没有把这两个操作绑定在一起，就有可能出现单独更换了 IP 或端口号的情况，而此时信息如果已经对外发布，信息获取方就有可能获取一个错误的 IP 与端口绑定情况，这时就发生了线程安全问题。
- **对方没有声明自己是线程安全的** - 在我们使用其他类时，如果对方没有声明自己是线程安全的，那么这种情况下对其他类进行多线程的并发操作，就有可能会发生线程安全问题。举个例子，比如说我们定义了 ArrayList，它本身并不是线程安全的，如果此时多个线程同时对 ArrayList 进行并发读/写，那么就有可能会产生线程安全问题，造成数据出错，而这个责任并不在 ArrayList，因为它本身并不是并发安全的。

### 【困难】什么是死锁？如何发现死锁？如何避免死锁？

::: info 什么是死锁？
:::

**死锁**：**一组互相竞争资源的线程因互相等待，导致“永久”阻塞的现象**。

产生死锁的四个必要条件：

- **互斥**：该资源任意一个时刻只由一个线程占用。
- **占有并等待**：一个线程因请求资源而阻塞时，对已获得的资源保持不放。
- **不可抢占**：线程已获得的资源在未使用完之前不能被其他线程强行剥夺，只有自己使用完毕后才释放资源。
- **循环等待**：若干线程之间形成一种头尾相接的循环等待资源关系。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409050712813.png)

::: info 如何发现死锁？
:::

（1）使用 `jstack` 工具

- 运行程序后，执行命令：

  ```shell
  jstack <PID>  # PID 是 Java 进程 ID
  ```

- 如果存在死锁，输出会显示 `Found one Java-level deadlock`，并列出死锁的线程和资源。

（2）使用 `ThreadMXBean` 检测（代码方式）

```java
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadMXBean;

public class DeadlockDetector {
    public static void main(String[] args) {
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        long[] deadlockedThreads = threadMXBean.findDeadlockedThreads(); // 检测死锁线程
        if (deadlockedThreads != null) {
            System.out.println("发现死锁！涉及线程：");
            for (long threadId : deadlockedThreads) {
                System.out.println(threadId);
            }
        } else {
            System.out.println("无死锁。");
        }
    }
}
```

输出示例：

```
发现死锁！涉及线程：
12345
67890
```

（3）使用 VisualVM 或 JConsole（可视化工具）

连接 Java 进程后，查看**线程**选项卡，死锁会被明确标记。

::: info 如何避免死锁？
:::

**如何预防死锁？** 破坏死锁的产生的必要条件即可：

- **互斥**：难以避免
- **占有并等待**：一次性申请所有资源
- **不可抢占**：超时释放锁
- **循环等待**：按序申请资源

**如何避免死锁？**

避免死锁就是在资源分配时，借助于算法（比如银行家算法）对资源分配进行计算评估，使其进入安全状态。

**安全状态** 指的是系统能够按照某种线程推进顺序（P1、P2、P3……Pn）来为每个线程分配所需资源，直到满足每个线程对资源的最大需求，使每个线程都可顺利完成。称 `<P1、P2、P3.....Pn>` 序列为安全序列。

### 【中等】什么是活锁？如何避免活锁？

::: info 什么是活锁？
:::

活锁是一个递归的情况，两个或更多的线程会不断重复一个特定的代码逻辑。预期的逻辑通常为其他线程提供机会继续支持'this'线程。

想象这样一个例子：两个人在狭窄的走廊里相遇，二者都很礼貌，试图移到旁边让对方先通过。但是他们最终在没有取得任何进展的情况下左右摇摆，因为他们都在同一时间向相同的方向移动。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409050740102.png)

如图所示：两个线程想要通过一个 Worker 对象访问共享公共资源的情况，但是当他们看到另一个 Worker（在另一个线程上调用）也是“活动的”时，它们会尝试将该资源交给其他工作者并等待为它完成。如果最初我们让两名工作人员都活跃起来，他们将会面临活锁问题。

::: info 如何避免活锁？
:::

解决“**活锁**”的方案很简单，谦让时，尝试等待一个随机的时间就可以了。由于等待的时间是随机的，所以同时相撞后再次相撞的概率就很低了。“等待一个随机时间”的方案虽然很简单，却非常有效，Raft 这样知名的分布式一致性算法中也用到了它。

### 【中等】什么是饥饿问题？如何避免饥饿？

::: info 什么是饥饿问题？
:::

**定义**：某些线程由于**长期无法获取所需资源**（如 CPU 时间、锁、I/O 等），导致**任务无法执行或执行缓慢**。

**与死锁/活锁的区别**：

- **死锁**：所有相关线程都被阻塞，无法继续。
- **活锁**：线程在运行，但无法取得进展。
- **饥饿**：部分线程能正常运行，但某些线程长期得不到资源。

**饥饿的常见原因**

| **原因**             | **示例**                                               |
| -------------------- | ------------------------------------------------------ |
| **线程优先级不合理** | 高优先级线程总是抢占 CPU，低优先级线程长期得不到执行。 |
| **锁竞争不公平**     | 某些线程总是抢不到锁（如`synchronized`是非公平锁）。   |
| **资源分配不均**     | 线程池任务调度不合理，某些任务被长时间搁置。           |
| **I/O 或网络阻塞**   | 某些线程因 I/O 操作被阻塞，而其他线程持续占用 CPU。    |

::: info 如何避免饥饿？
:::

**（1）使用公平锁（Fair Lock）**

- **`ReentrantLock` 支持公平策略**，避免某些线程长期抢不到锁。

  ```java
  ReentrantLock fairLock = new ReentrantLock(true); // true 表示公平锁
  ```

- **`synchronized` 是非公平的**，无法直接设置公平性。

**（2）合理设置线程优先级**

- 避免滥用高优先级，尽量让所有线程有机会执行。

- Java 线程优先级（1~10，默认 5）：

  ```java
  thread.setPriority(Thread.NORM_PRIORITY); // 5
  ```

**（3）避免长时间占用资源**

- 减少锁的持有时间，尽量只在必要时加锁。

- 使用 `tryLock()` 设置超时，防止无限等待：

  ```java
  if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
      try { /* 临界区 */ }
      finally { lock.unlock(); }
  }
  ```

**（4）优化线程池任务调度**

- 使用 `newFixedThreadPool` 或 `newCachedThreadPool` 时，结合 `BlockingQueue` 避免任务堆积。
- 可改用 `ForkJoinPool` 进行任务拆分，提高公平性。

**（5）监控与调整**

- 使用 **VisualVM、JConsole** 等工具观察线程状态，发现长期阻塞的线程。
- 结合日志分析，优化资源分配策略。

### 【简单】简单介绍一下 Java 并发编程？

并发编程可以抽象成三个核心问题：分工、同步、互斥。

- **分工** - 是指如何高效地拆解任务并分配给线程。
- **同步** - 是指线程之间如何协作。
- **互斥** - 是指保证同一时刻只允许一个线程访问共享资源。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202504221021138.png)

Java 的 `java.util.concurrent` 包（简称 J.U.C）中提供了大量并发工具类，是 Java 并发能力的主要体现（注意，不是全部，有部分并发能力的支持在其他包中）。从功能上，大致可以分为：

- **原子类** - 如：`AtomicInteger`、`AtomicIntegerArray`、`AtomicReference`、`AtomicStampedReference` 等。
- **锁** - 如：`ReentrantLock`、`ReentrantReadWriteLock` 等。
- **并发容器** - 如：`ConcurrentHashMap`、`CopyOnWriteArrayList`、`CopyOnWriteArraySet` 等。
- **阻塞队列** - 如：`ArrayBlockingQueue`、`LinkedBlockingQueue` 等。
- **非阻塞队列** - 如： `ConcurrentLinkedQueue` 、`LinkedTransferQueue` 等。
- **线程池** - 如：`ThreadPoolExecutor`、`Executors` 等。

J.U.C 包中的工具类是基于 `synchronized`、`volatile`、`CAS`、`ThreadLocal` 这样的并发核心机制打造的。所以，要想深入理解 J.U.C 工具类的特性、为什么具有这样那样的特性，就必须先理解这些核心机制。

## Java 线程

### 【中等】Java 线程生命周期有哪些状态？状态之间如何切换？

`java.lang.Thread.State` 中定义了 **6** 种不同的线程状态，在给定的一个时刻，线程只能处于其中的一个状态。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408290809602.png)

以下是各状态的说明，以及状态间的联系：

- **开始（NEW）** - 尚未调用 `start` 方法的线程处于此状态。此状态意味着：**创建的线程尚未启动**。
- **可运行（RUNNABLE）** - 已经调用了 `start` 方法的线程处于此状态。此状态意味着，**线程已经准备好了**，一旦被线程调度器分配了 CPU 时间片，就可以运行线程。
  - 在操作系统层面，线程有 READY 和 RUNNING 状态；而在 JVM 层面，只能看到 RUNNABLE 状态，所以 Java 系统一般将这两个状态统称为 RUNNABLE（运行中） 状态 。
- **阻塞（BLOCKED）** - 此状态意味着：**线程处于被阻塞状态**。表示线程在等待 `synchronized` 的隐式锁（Monitor lock）。`synchronized` 修饰的方法、代码块同一时刻只允许一个线程执行，其他线程只能等待，即处于阻塞状态。当占用 `synchronized` 隐式锁的线程释放锁，并且等待的线程获得 `synchronized` 隐式锁时，就又会从 `BLOCKED` 转换到 `RUNNABLE` 状态。
- **等待（WAITING）** - 此状态意味着：**线程无限期等待，直到被其他线程显式地唤醒**。 阻塞和等待的区别在于，阻塞是被动的，它是在等待获取 `synchronized` 的隐式锁。而等待是主动的，通过调用 `Object.wait` 等方法进入。
  - 进入：`Object.wait()`；退出：`Object.notify` / `Object.notifyAll`
  - 进入：`Thread.join()`；退出：被调用的线程执行完毕
  - 进入：`LockSupport.park()`；退出：`LockSupport.unpark`
- **定时等待（TIMED_WAITING）** - 等待指定时间的状态。一个线程处于定时等待状态，是由于执行了以下方法中的任意方法：
  - 进入：`Thread.sleep(long)`；退出：时间结束
  - 进入：`Object.wait(long)`；退出：时间结束 / `Object.notify` / `Object.notifyAll`
  - 进入：`Thread.join(long)`；退出：时间结束 / 被调用的线程执行完毕
  - 进入：`LockSupport.parkNanos(long)`；退出：`LockSupport.unpark`
  - 进入：`LockSupport.parkUntil(long)`；退出：`LockSupport.unpark`
- **终止 (TERMINATED)** - 线程 `run()` 方法执行结束，或者因异常退出了 `run()` 方法，则该线程结束生命周期。死亡的线程不可再次复生。

> 👉 扩展阅读：
>
> - [Java Thread Methods and Thread States](https://www.w3resource.com/java-tutorial/java-threadclass-methods-and-threadstates.php)
> - [Java 线程的 5 种状态及切换（透彻讲解）](https://blog.csdn.net/pange1991/article/details/53860651)
> - [Java 线程运行怎么有第六种状态？ - Dawell 的回答](https://www.zhihu.com/question/56494969/answer/154053599)

### 【中等】Java 中，创建线程有几种方式？

一般来说，创建线程有很多种方式，例如：

- 实现 `Runnable` 接口（推荐）
- 继承 `Thread` 类（不推荐，因为不灵活，Java 不支持多继承）
- 实现 `Callable` 接口 + `FutureTask`，支持返回值
- 通过线程池（生产环境推荐）
- 使用 `CompletableFuture`
- ...

虽然，看似有多种多样的创建线程方式。但是，**从本质上来说，Java 就只有一种方式可以创建线程，那就是通过 `new Thread().start() ` 创建。不管是哪种方式，最终还是依赖于 `new Thread().start()`**。

> 👉 扩展阅读：[大家都说 Java 有三种创建线程的方式！并发编程中的惊天骗局！](https://mp.weixin.qq.com/s/NspUsyhEmKnJ-4OprRFp9g)。

### 【简单】可以直接调用 `Thread.run()` 方法么？

可以直接调用 `Thread.run()` 方法，但是它的行为和普通方法一样，不会启动新线程去执行。**调用 `start()` 方法方可启动线程并使线程进入就绪状态，直接执行 `run()` 方法的话不会以多线程的方式执行。**

- **`run()` 方法是线程的执行体**。
- **`start()` 方法负责启动线程，然后 JVM 会让这个线程去执行 `run()` 方法**。

### 【简单】一个线程两次调用 `Thread.start()` 方法会怎样？

Java 的线程是不允许启动两次的，**第二次调用 `Thread.start()` 会抛出 `IllegalThreadStateException`**。

### 【简单】`Thread.sleep()`、`Thread.yield()`、`Thread.join()`、`Object.wait()` 有什么区别？

| 方法                        | 所属类   | 作用                                                     | 是否释放锁  | 使用场景                                   |
| --------------------------- | -------- | -------------------------------------------------------- | ----------- | ------------------------------------------ |
| **`Thread.sleep(long ms)`** | `Thread` | **让当前线程暂停执行指定时间**（不释放 CPU 资源）        | ❌ 不释放锁 | 模拟耗时操作、定时任务                     |
| **`Thread.yield()`**        | `Thread` | **提示调度器让出 CPU，但可能立即重新竞争**（不保证让出） | ❌ 不释放锁 | 优化线程调度，减少竞争（极少使用）         |
| **`Thread.join()`**         | `Thread` | **等待目标线程执行完毕**（阻塞当前线程）                 | ❌ 不释放锁 | 线程顺序执行，如主线程等待子线程结束       |
| **`Object.wait()`**         | `Object` | **释放锁并进入等待，直到 `notify()`/`notifyAll()` 唤醒** | ✅ 释放锁   | 线程间通信（需在 `synchronized` 块中使用） |

**锁的释放**

- `wait()` 会释放锁，其他方法不会。
- `sleep()` 和 `yield()` 仅影响线程调度，不涉及锁。

**唤醒机制**

- `wait()` 需依赖 `notify()`/`notifyAll()` 或超时唤醒。
- `sleep()` 和 `join()` 超时后自动恢复。
- `yield()` 立刻重新参与竞争。

**用途**

- `sleep()`：固定时间暂停（如定时任务）。
- `yield()`：礼貌让出 CPU（实际开发很少用）。
- `join()`：线程依赖（如主线程等待子线程）。
- `wait()`：线程间协作（生产者-消费者模型）。

> 👉 扩展阅读：[Java 并发编程：线程间协作的两种方式：wait、notify、notifyAll 和 Condition](http://www.cnblogs.com/dolphin0520/p/3920385.html)

### 【中等】为什么 `Thread.sleep()`、`Thread.yield()` 设计为静态方法？

`Thread.sleep()`、`Thread.yield()` 针对的是 **Running** 状态的线程，也就是说在非 **Running** 状态的线程上执行这两个方法没有意义。这就是为什么这两个方法被设计为静态的。它们只针对正在 **Running** 状态的线程工作，避免程序员错误的认为可以在其他非 **Running** 状态线程上调用。

> 👉 扩展阅读：[Java 线程中 yield 与 join 方法的区别](http://www.importnew.com/14958.html)
> 👉 扩展阅读：[sleep()，wait()，yield() 和 join() 方法的区别](https://blog.csdn.net/xiangwanpeng/article/details/54972952)

### 【中等】为什么 `Object.wait()`、`Object.notify()` 和 `Object.notifyAll()` 被定义在 `Object` 类里？

**因为锁是对象的，`wait()`/`notify()` 是锁的行为，所以必须定义在 `Object` 中**。

- **锁基于对象**：Java 的锁（`synchronized`）是 **对象级别** 的，每个对象关联一个监视器（Monitor），`wait()`/`notify()` 是监视器的核心操作，必须属于 `Object`。

- **任何对象都可作为锁**：不仅 `Thread` 能作为锁，**所有对象** 都能作为锁，因此这些方法需定义在 `Object` 以保证通用性。

- **等待队列绑定对象**：调用 `wait()` 的线程会进入 **该对象的等待队列**，`notify()` 唤醒的也是同一对象队列中的线程，与对象强绑定。

- **与 `Thread` 类职责分离**：`Thread` 类管理线程生命周期（如 `sleep()`、`join()`），而 `wait()`/`notify()` 是 **线程间协作机制**，属于锁（对象）的行为。

- **设计一致性与历史原因**：遵循 **Monitor 模式**（操作系统同步原语），保持 `Thread` 简洁，避免功能混淆（如 `wait()` 和 `sleep()` 的误用）。

### 【中等】为什么 `Object.wait()`、`Object.notify()` 和 `Object.notifyAll()` 必须在 `synchronized` 方法/块中被调用？

当一个线程需要调用对象的 `wait()` 方法的时候，这个线程必须拥有该对象的锁，接着它就会释放这个对象锁并进入等待状态直到其他线程调用这个对象上的 `notify()` 方法。同样的，当一个线程需要调用对象的 `notify()` 方法时，它会释放这个对象的锁，以便其他在等待的线程就可以得到这个对象锁。

由于所有的这些方法都需要线程持有对象的锁，这样就只能通过 `synchronized` 来实现，所以他们只能在 `synchronized` 方法/块中被调用。

### 【中等】如何正确停止 Java 线程？

**对于 Java 而言，最正确的停止线程的方式是：通过 `Thread.interrupt` 和 `Thread.isInterrupted` 配合来控制线程终止**。

- `Thread.interrupt()`：设置线程的中断标志位（不会直接停止线程）。
- `Thread.isInterrupted()`：检查中断状态。

【示例】正确停止线程的方式——`Thread.interrupt`

```java
public class ThreadStopDemo {

    public static void main(String[] args) throws Exception {
        Thread thread = new Thread(new MyTask(), "MyTask");
        thread.start();
        TimeUnit.MILLISECONDS.sleep(10);
        thread.interrupt();
    }

    private static class MyTask implements Runnable {

        private long count = 0L;

        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + " 线程启动");
            // 通过 Thread.interrupted 和 interrupt 配合来控制线程终止
            while (!Thread.currentThread().isInterrupted() && count < 10000) {
                System.out.println("count = " + count++);
            }
            System.out.println(Thread.currentThread().getName() + " 线程终止");
        }

    }

}
// 输出（count 未到 10000，线程就主动结束）：
// MyTask 线程启动
// count = 0
// count = 1
// ...
// count = 840
// count = 841
// count = 842
// MyTask 线程终止
```

### 【中等】可以使用 `Thread.stop`，`Thread.suspend` 和 `Thread.resume` 停止线程吗？为什么？

`Thread.stop`，`Thread.suspend` 和 `Thread.resume` 方法已经被 Java 标记为 `@Deprecated`。为什么废弃呢？

- **`Thread.stop` 会直接把线程停止，这样就没有给线程足够的时间来处理想要在停止前保存数据的逻辑，任务戛然而止，会导致出现数据完整性等问题**。
- 而对于`Thread.suspend` 和 `Thread.resume` 而言，它们的问题在于：**如果线程调用 `Thread.suspend`，它并不会释放锁，就开始进入休眠，但此时有可能仍持有锁，这样就容易导致死锁问题**。因为这把锁在线程被 `Thread.resume` 之前，是不会被释放的。假设线程 A 调用了 `Thread.suspend` 方法让线程 B 挂起，线程 B 进入休眠，而线程 B 又刚好持有一把锁，此时假设线程 A 想访问线程 B 持有的锁，但由于线程 B 并没有释放锁就进入休眠了，所以对于线程 A 而言，此时拿不到锁，也会陷入阻塞，那么线程 A 和线程 B 就都无法继续向下执行。

【示例】`Thread.stop` 终止线程，导致线程任务戛然而止

```java
public class ThreadStopErrorDemo {

    public static void main(String[] args) {
        MyTask thread = new MyTask();
        thread.start();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // 终止线程
        thread.stop();
        // 确保线程终止后，才执行下面的代码
        while (thread.isAlive()) { }
        // 输出两个计数器的最终状态
        thread.print();
    }

    /**
     * 持有两个计数器，run 方法中每次执行都会使计数器自增
     */
    private static class MyTask extends Thread {

        private int i = 0;

        private int j = 0;

        @Override
        public void run() {
            synchronized (this) {
                ++i;
                try {
                    // 模拟耗时操作
                    TimeUnit.SECONDS.sleep(5);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                ++j;
            }
        }

        public void print() {
            System.out.println("i=" + i + " j=" + j);
        }

    }

}
```

### 【中等】使用 `volatile` 标记方式停止线程正确吗？

使用 `volatile` 标记方式仅适用于简单场景（无阻塞、无锁竞争）。**推荐 `Thread.interrupt` 和 `Thread.isInterrupted` 方式停止线程**：更通用，可处理阻塞操作，是 Java 线程停止的标准方式。

**`volatile` 标记停止线程适用场景（正确使用）**

- ✅ **非阻塞循环**
  - 线程在 `while (!stopped)` 循环中运行，且 **无阻塞操作**（如 `sleep()`、`wait()`、I/O）。
  - `volatile` 保证标志位 (`stopped`) 的修改对所有线程 **立即可见**。
- ✅ **短周期任务**：适用于 **纯计算型任务** 或 **高频检查标志位** 的场景。

**`volatile` 标记停止线程不适用场景（可能失效）**

- ❌ **线程被阻塞**（如 `sleep()`、`wait()`、I/O）：阻塞期间无法检测 `volatile` 标志位，必须等阻塞结束才能退出。
- ❌ **依赖外部资源**（如锁竞争、网络请求）：即使 `stopped=true`，线程可能因锁或 I/O 阻塞无法立即退出。

当我们使用 `volatile` 变量来控制线程的停止，通常是通过设置一个 `volatile` 标志位来告诉线程停止执行。例如：

```java
public class MyTask extends Thread {
    private volatile boolean canceled = false;

    public void run() {
        while (!canceled) {
            // 执行任务
        }
    }

    public void stopTask() {
        canceled = true;
    }
}
```

在上述例子中，`canceled` 是一个 `volatile` 变量，用来控制线程的停止。虽然这种方式在某些情况下可以工作，但它并不是一个可靠的停止线程的方式，因为**在多线程环境中，其他线程修改 `canceled` 的值时，可能会出现竞态条件，导致线程无法正确停止**。

### 【中等】Java 线程之间如何进行通信？

在 Java 中，线程间通信（Inter-Thread Communication, ITC）是指多个线程之间协调工作、共享数据或传递消息的机制。常见的线程通信方式包括以下几种：

| 通信方式                | 核心机制                  | 适用场景         | 特点           |
| ----------------------- | ------------------------- | ---------------- | -------------- |
| **共享变量**            | `volatile`/`synchronized` | 简单状态标记     | 需处理竞态条件 |
| **`wait()`/`notify()`** | 对象监视器                | 生产者-消费者    | 需手动同步     |
| **`BlockingQueue`**     | 内置锁和条件队列          | 生产者-消费者    | 无需手动同步   |
| **`CountDownLatch`**    | 计数器                    | 主线程等待子线程 | 一次性         |
| **`CyclicBarrier`**     | 屏障                      | 多线程同步       | 可重复使用     |
| **`Semaphore`**         | 许可证                    | 限流/资源池      | 控制并发数     |
| **管道流**              | 字节流                    | 线程间数据传输   | 效率较低       |

**推荐选择**：

- 需要高效数据交换 → **`BlockingQueue`**
- 线程协作 → **`wait()`/`notify()` 或 `CountDownLatch`**
- 资源控制 → **`Semaphore`**
- 避免重复造轮子，优先使用 JUC（`java.util.concurrent`）工具类！

### 【简单】高优先级的 Java 线程一定先执行吗？

Java 中的线程优先级的范围是 `[1,10]`，一般来说，高优先级的线程在运行时会具有优先权。可以通过 `thread.setPriority(Thread.MAX_PRIORITY)` 的方式设置，默认优先级为 `5`。

即使设置了线程的优先级，也**无法保证高优先级的线程一定先执行**。这是因为 **Java 线程优先级依赖于操作系统的支持**，然而，不同的操作系统支持的线程优先级并不相同，不能很好的和 Java 中线程优先级一一对应。因此，Java 线程优先级控制并不可靠。

## Java 内存模型

### 【中等】什么是 Java 内存模型？

**Java Memory Model (JMM)** 是 Java 规范定义的一套**多线程内存访问规则**，用于解决并发编程中的**可见性、原子性、有序性**问题。目的是让 Java 程序在不同硬件和操作系统上都能正确执行并发操作。

**CPU、内存、I/O 设备存在很大的速度差异** - CPU 远快于内存，内存远快于 I/O 设备。

为了合理利用 CPU 的高性能，平衡这三者的速度差异，计算机体系机构、操作系统、编译程序都做出了贡献，主要体现为：

- **CPU 增加了缓存**，以均衡与 CPU 内存的速度差异；
- **编译程序优化指令执行次序**，使得缓存能够得到更加合理地利用。
- **操作系统增加了进程、线程**，以分时复用 CPU，进而均衡 CPU 与 I/O 的速度差异；

**缓存一致性**

**缓存**导致的可见性问题，**编译优化**带来的有序性问题，**线程切换**带来的原子性问题。

为了解决缓存一致性问题，**需要各个处理器访问缓存时都遵循一些协议，在读写时要根据协议来进行操作**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408290755550.png)

**指令重排序**

为了使缓存得到更加合理地使用，计算机在执行程序代码的时候，会对指令进行重排序。常见的指令重排序有下面 2 种情况：

- **编译器优化重排**：编译器在不改变单线程语义的前提下调整语句顺序。
- **指令并行重排**：处理器利用指令级并行技术（ILP）调整指令执行顺序（无数据依赖时）。

Java 源代码会经历 **编译器优化重排 —> 指令并行重排 —> 内存系统重排** 的过程，最终才变成操作系统可执行的指令序列。指令重排序**可以保证串行语义一致，但是没有义务保证多线程间的语义也一致 ，所以在多线程下，指令重排序可能会导致一些问题。**

解决方案：

- **编译器**：禁止特定类型的编译器重排序。
- **处理器**：通过插入**内存屏障（Memory Barrier/Fence）**禁止特定处理器重排序。

> 👉 扩展阅读：[全面理解 Java 内存模型](https://blog.csdn.net/suifeng3051/article/details/52611310)

### 【困难】什么是 Happens-Before 规则？有什么用？

JMM 为程序中所有的操作定义了一个偏序关系，称之为 **`先行发生原则（Happens-Before）`**。**Happens-Before 是 JMM 的核心规则，用于约束指令重排序和保证多线程可见性。**

**Happens-Before** 非常重要，它是判断数据是否存在竞争、线程是否安全的主要依据，依靠这个原则，我们可以通过几条规则一揽子地解决并发环境下两个操作间是否可能存在冲突的所有问题。

1. **程序顺序规则**：单线程内代码顺序执行（但不影响多线程重排序）。
2. **`volatile` 规则**：**`volatile` 写** Happens-Before **后续的 `volatile` 读**。**volatile 保证可见性 + 禁止指令重排序**。
3. **锁规则**：**解锁** Happens-Before **后续的加锁**（如 `synchronized`、`ReentrantLock`）。
4. **线程启动规则**：**`Thread.start()`** Happens-Before **线程内的所有操作**。
5. **线程终止规则**：**线程中的所有操作** Happens-Before **`Thread.join()` 完成**。
6. **线程中断规则**：**`Thread.interrupt()`** Happens-Before **被中断线程检测到中断（`isInterrupted()` 或 `InterruptedException`）**。
7. **对象终结规则**：**对象的构造函数执行结束** Happens-Before **`finalize()` 方法被调用**。
8. **传递性**：若 A → B 且 B → C，则 A → C。

> 1978 年，Lamport 在论文 [**Time, Clocks, and the Ordering of Events in a Distributed System**](https://lamport.azurewebsites.net/pubs/time-clocks.pdf) （[**译文**](https://cloud.tencent.com/developer/article/1163428)，[**解读**](https://zhuanlan.zhihu.com/p/56146800) ）中第一次提出了 Happens-Before，阐述了偏序关系（partial ordering）、逻辑时钟（Logical Clocks）概念，提出解决分布式系统中区分事件发生的时序问题的方法。Happens-Before 的语义是一种因果关系：如果 A 事件是导致 B 事件的起因，那么 A 事件一定是先于（Happens-Before）B 事件发生的。

### 【困难】什么是 Java 内存屏障？有什么用？

内存屏障（Memory Barrier/Fence）是 JMM 的底层机制，通过 **限制重排序** 和 **强制缓存同步**，实现多线程程序的 **可见性** 和 **有序性**。

- **禁止特定类型的指令重排序**（编译器和处理器优化可能导致乱序执行）。
- **强制刷新 CPU 缓存**，确保多线程间的 **内存可见性**。

JVM 依赖底层 CPU 的内存屏障指令（如 x86 的 `mfence`/`lfence`/`sfence`），抽象为以下四种：

- **LoadLoad**：确保 `Load1` 的读取操作在 `Load2` 及后续读取之前完成。 示例：`volatile` 读后的普通读。
- **StoreStore**：确保 `Store1` 的写入操作在 `Store2` 及后续写入之前对其他线程可见。示例：`volatile` 写前的普通写。
- **LoadStore**：确保 `Load1` 的读取操作在 `Store2` 及后续写入之前完成。
- **StoreLoad**：确保 `Store1` 的写入对所有线程可见后，才执行 `Load2` 的读取。 **开销最大**（如 `volatile` 写后的 `volatile` 读会插入此屏障）。

**内存屏障的应用场景**

- **`volatile` 变量**
  - **写操作**：插入 `StoreStore` + `StoreLoad` 屏障。
  - **读操作**：插入 `LoadLoad` + `LoadStore` 屏障。
- **`synchronized` 锁**
  - 进入临界区（加锁）和退出（解锁）时插入屏障，保证可见性和有序性。
- **`final` 字段**
  - 构造函数中的 `final` 字段写入后插入屏障，确保正确初始化对其他线程可见。

**内存屏障的作用**

- **禁止重排序**：防止编译器和 CPU 优化破坏多线程逻辑（如单例模式的 DCL 问题）。
- **保证可见性**：强制将工作内存的修改刷回主内存，并失效其他线程的缓存。
- **保证有序性**：确保临界区代码按预期顺序执行（如 `happens-before` 规则的实现基础）。

**底层实现**

- **x86 CPU**：`StoreLoad` 对应 `mfence` 指令，其他屏障通常无实际指令（因 x86 强内存模型已满足大部分需求）。
- **ARM/PowerPC**：弱内存模型需显式插入更多屏障指令。
- **JVM 的封装**：通过 `Unsafe` 类提供 `loadFence()`/`storeFence()`/`fullFence()` 方法（如 `VarHandle` 内部使用）。

**示例：`volatile` 的屏障插入**

```java
volatile int flag = 0;
int value = 0;

void write() {
    value = 42;          // 普通写
    // StoreStore 屏障（确保 value=42 先刷入主内存）
    flag = 1;            // volatile 写
    // StoreLoad 屏障（保证写操作对所有线程可见）
}

void read() {
    if (flag == 1) {     // volatile 读
        // LoadLoad + LoadStore 屏障
        System.out.println(value); // 保证读到 value=42
    }
}
```

### 【中等】`volatile` 有什么作用？

`volatile` 是轻量级的线程同步工具。**`volatile` 可以保证可见性和有序性，但不保证原子性**。适用于状态标志、DCL 单例等场景。

**注意事项**

- **不要滥用**：仅适用于简单状态同步，复杂操作仍需锁或原子类。
- **不适用于复合操作**：如 `check-then-act`（需 `synchronized` 或 CAS）。

::: info 保证可见性

:::

- **强制线程每次读取 `volatile` 变量时**，直接从主内存获取最新值（跳过工作内存缓存）。
- **强制线程每次写入 `volatile` 变量时**，立即同步到主内存，使其他线程立即可见。

::: info 禁止指令重排序

:::

- 通过插入 **内存屏障（Memory Barrier）** 禁止编译器和 CPU 对 `volatile` 变量的读写操作进行重排序。
- **双重检查锁（DCL）单例模式** 中必须用 `volatile` 修饰实例变量，防止对象未初始化完成就被使用。

::: info 不保证原子性

:::

`volatile` **不能替代 `synchronized`**，例如 `volatile int i++;` 仍存在竞态条件（需用 `AtomicInteger`）。

适用场景：**单线程写、多线程读** 的变量（如开关标志）。

::: info volatile 底层实现原理

:::

- **写操作**：插入 `StoreStore` + `StoreLoad` 屏障，确保写入前所有操作完成，且结果全局可见。
- **读操作**：插入 `LoadLoad` + `LoadStore` 屏障，确保读取后所有操作依赖最新值。

::: info volatile 应用场景

:::

**状态标志位**

```java
volatile boolean running = true;

void stop() { running = false; }  // 线程 A
void run() { while (running) { ... } } // 线程 B
```

**双重检查锁（DCL）**

```java
class Singleton {
    private static volatile Singleton instance;
    static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton(); // 禁止重排序
                }
            }
        }
        return instance;
    }
}
```

**发布不可变对象**

```java
volatile Map<String, String> config = readConfig(); // 保证引用可见性
```

### 【中等】volatile 能完全保证并发安全吗？

线程安全需要具备：可见性、原子性、顺序性。**`volatile` 不保证原子性，所以决定了它不能彻底地保证线程安全**。

我们通过下面的代码即可证明：

```java
public class VolatileAtomicityDemo {
    public volatile static int inc = 0;

    public void increase() {
        inc++;
    }

    public static void main(String[] args) throws InterruptedException {
        ExecutorService threadPool = Executors.newFixedThreadPool(5);
        VolatileAtomicityDemo volatileAtomicityDemo = new VolatileAtomicityDemo();
        for (int i = 0; i < 5; i++) {
            threadPool.execute(() -> {
                for (int j = 0; j < 500; j++) {
                    volatileAtomicityDemo.increase();
                }
            });
        }
        // 等待 1.5 秒，保证上面程序执行完成
        Thread.sleep(1500);
        System.out.println(inc);
        threadPool.shutdown();
    }
}
```

正常情况下，运行上面的代码理应输出 `2500`。但你真正运行了上面的代码之后，你会发现每次输出结果都小于 `2500`。

为什么会出现这种情况呢？不是说好了，`volatile` 可以保证变量的可见性嘛！

也就是说，如果 `volatile` 能保证 `inc++` 操作的原子性的话。每个线程中对 `inc` 变量自增完之后，其他线程可以立即看到修改后的值。5 个线程分别进行了 500 次操作，那么最终 inc 的值应该是 5\*500=2500。

很多人会误认为自增操作 `inc++` 是原子性的，实际上，`inc++` 其实是一个复合操作，包括三步：

1. 读取 inc 的值。
2. 对 inc 加 1。
3. 将 inc 的值写回内存。

`volatile` 是无法保证这三个操作是具有原子性的，有可能导致下面这种情况出现：

1. 线程 1 对 `inc` 进行读取操作之后，还未对其进行修改。线程 2 又读取了 `inc` 的值并对其进行修改（+1），再将 `inc` 的值写回内存。
2. 线程 2 操作完毕后，线程 1 对 `inc` 的值进行修改（+1），再将 `inc` 的值写回内存。

这也就导致两个线程分别对 `inc` 进行了一次自增操作后，`inc` 实际上只增加了 1。

其实，如果想要保证上面的代码运行正确也非常简单，利用 `synchronized`、`Lock` 或者 `AtomicInteger` 都可以。

使用 `synchronized` 改进：

```java
public synchronized void increase() {
    inc++;
}
```

使用 `AtomicInteger` 改进：

```java
public AtomicInteger inc = new AtomicInteger();

public void increase() {
    inc.getAndIncrement();
}
```

使用 `ReentrantLock` 改进：

```java
Lock lock = new ReentrantLock();
public void increase() {
    lock.lock();
    try {
        inc++;
    } finally {
        lock.unlock();
    }
}
```

### 【中等】`volatile` 和 `synchronized` 有什么区别？`volatile` 能替代 `synchronized` 吗？

**`volatile` 无法替代 `synchronized` ，因为 `volatile` 无法保证操作的原子性**。

**volatile 和 synchronized 的特性区别**：

| 特性       | `volatile`            | `synchronized`        |
| ---------- | --------------------- | --------------------- |
| **原子性** | ❌ 不保证（如 `i++`） | ✅ 保证               |
| **可见性** | ✅ 强制主内存读写     | ✅ 通过锁机制保证     |
| **有序性** | ✅ 禁止重排序         | ✅ 串行化执行         |
| **性能**   | ⚡ 轻量级（无锁）     | 🔒 较重（上下文切换） |

**volatile 和 synchronized 的实现区别**：

- **volatile**：
  - 通过 **内存屏障** 禁止指令重排序
  - 强制 **CPU 缓存失效** 保证可见性
  - 底层使用 **LoadLoad/StoreStore 等屏障指令**
- **synchronized**：
  - 通过 **Monitor 监视器锁**（对象头 Mark Word）
  - 包含 **偏向锁→轻量级锁→重量级锁** 的升级过程
  - 保证 **代码块/方法** 的排他性访问

### 【中等】`synchronized` 有什么作用？

`synchronized` 是 Java 最基础的线程同步机制，通过 **原子性、可见性、有序性** 保障线程安全，适用于需要 **强一致性** 的场景，但需合理控制锁粒度以避免性能问题。

`synchronized` 有 3 种应用方式：

- **同步实例方法** - 对于普通同步方法，锁是当前实例对象
- **同步静态方法** - 对于静态同步方法，锁是当前类的 `Class` 对象
- **同步代码块** - 对于同步方法块，锁是 `synchonized` 括号里配置的对象

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409090719904.png)

### 【中等】`synchronized` 的实现原理是什么？

`synchronized` 的底层实现涉及 **Java 对象头、Monitor（监视器）、锁升级机制** 等。

**`synchronized` 修饰代码块时，在代码块前后植入 monitorenter 和 monitorexit 字节码指令，相当于加锁和解锁**。

**`synchronized` 修饰方法时，会在方法的访问标志上设置一个 `ACC_SYNCHRONIZED` 标记**。线程每次访问方法，会进行检查，若设置了 `ACC_SYNCHRONIZED` 标记，执行线程将先持有 `Monitor` 对象，然后再执行方法。在该方法运行期间，其它线程将无法获取到该 Mointor 对象，当方法执行完成后，再释放该 Monitor 对象。

**（1）对象头与 Mark Word**

每个 Java 对象在内存中由 **对象头（Header）、实例数据（Instance Data）、对齐填充（Padding）** 组成。
`synchronized` 的锁信息存储在 **对象头** 的 **Mark Word** 中，主要包括：

- **锁状态**（无锁、偏向锁、轻量级锁、重量级锁）
- **持有锁的线程 ID**
- **GC 分代年龄**
- **哈希码（HashCode）**

Mark Word 记录了对象和锁有关的信息。Mark Word 在 64 位 JVM 中的长度是 64bit，我们可以一起看下 64 位 JVM 的存储结构是怎么样的。如下图所示：

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200629191250.png)

**（2）Monitor（监视器）**

每个 Java 对象都关联一个 **Monitor（监视器）**，用于实现同步机制。Monitor 的主要结构：

- **`_owner`**：持有锁的线程
- **`_EntryList`**：等待获取锁的线程队列（阻塞状态）
- **`_WaitSet`**：调用 `wait()` 后进入等待状态的线程队列

### 【困难】JDK6 对`synchronized` 进行了哪些优化？

**JDK 6 以后，`synchronized` 做了大量的优化，其性能已经与 `Lock` 、`ReadWriteLock` 基本上持平**。

::: info 锁升级

:::

JDK 1.6 后，`synchronized` 采用 **锁升级** 机制优化性能，避免直接使用重量级锁带来的性能损耗。锁的状态变化如下：

| 锁状态       | 适用场景     | 实现方式              |
| :----------- | :----------- | :-------------------- |
| **无锁**     | 初始状态     | Mark Word 无锁标记    |
| **偏向锁**   | 单线程访问   | Mark Word 记录线程 ID |
| **轻量级锁** | 少量线程竞争 | CAS 自旋              |
| **重量级锁** | 高并发竞争   | 操作系统 Mutex 锁     |

**偏向锁**

- **适用场景**：只有一个线程访问同步块。
- **实现方式**：
  - 在 Mark Word 中记录 **线程 ID**，后续该线程进入时无需 CAS 操作。
  - 如果其他线程尝试获取锁，偏向锁会 **撤销**（Revoke）并升级为轻量级锁。

**轻量级锁**

- **适用场景**：少量线程竞争，且线程交替执行。
- **实现方式**：
  - 线程通过 **CAS（Compare-And-Swap）** 尝试获取锁。
  - 如果失败，会进行 **自旋（Spin）**（循环尝试），避免直接进入阻塞状态。
  - 如果自旋失败，升级为 **重量级锁**。

**重量级锁**

- **适用场景**：高并发竞争。
- **实现方式**：
  - 依赖 **操作系统 Mutex 锁**（互斥量）。
  - 未获取锁的线程会被 **挂起（Blocked）**，进入 `_EntryList` 等待唤醒。

Mark Word 记录了对象和锁有关的信息。Mark Word 在 64 位 JVM 中的长度是 64bit，我们可以一起看下 64 位 JVM 的存储结构是怎么样的。如下图所示：

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200629191250.png)

锁升级功能主要依赖于 Mark Word 中的锁标志位和释放偏向锁标志位，`synchronized` 同步锁就是从偏向锁开始的，随着竞争越来越激烈，偏向锁升级到轻量级锁，最终升级到重量级锁。

::: info 锁消除

:::

锁消除是指在即时编译（JIT）时，JVM 会对代码进行逃逸分析。如果发现一段代码中使用的锁对象不会逃逸到方法外部，也就是其他线程无法访问到该锁对象，那么 JVM 会认为该锁是无意义的，从而将锁的代码消除，避免不必要的锁竞争，提高程序的性能。

**锁消除实现原理**：

（1）**逃逸分析**：JVM 会分析对象的作用域。如果一个对象在方法内部创建，并且不会被外部方法引用，那么这个对象就不会逃逸出该方法。

（2）**锁消除**：由于 `StringBuffer` 的 `append` 方法是 `synchronized` 方法，但 `sb` 对象不会逃逸，JVM 经过逃逸分析后，会将 `append` 方法中的锁代码消除，从而避免了锁的开销。

【示例】锁消除

```java
public class LockEliminationExample {
    public static String concatString(String s1, String s2, String s3) {
        // 创建一个 StringBuffer 对象，它不会逃逸出该方法
        StringBuffer sb = new StringBuffer();
        sb.append(s1);
        sb.append(s2);
        sb.append(s3);
        return sb.toString();
    }

    public static void main(String[] args) {
        String result = concatString("Hello", " ", "World");
        System.out.println(result);
    }
}
```

在这个示例中，`StringBuffer` 对象 `sb` 只在 `concatString` 方法内部使用，不会被其他方法访问。因此，JVM 在即时编译时会进行逃逸分析，并将 `append` 方法中的锁代码消除。

::: info 锁粗化

:::

锁粗化是指：在 JIT 编译器动态编译时，如果发现几个相邻的同步块使用的是同一个锁实例，那么 JIT 编译器将会把这几个同步块合并为一个大的同步块，从而避免一个线程“反复申请、释放同一个锁“所带来的性能开销。

如果**一系列的连续操作都对同一个对象反复加锁和解锁**，频繁的加锁操作就会导致性能损耗。

### 【中等】final 关键字可以保证线程的可见性吗？

**final 本身不能直接保证线程间的可见性**。

**但 final 修饰的字段在正确初始化后，对其他线程是可见的（JMM 保证）**。对象构造完成时，final 字段的初始化值对所有线程立即可见。不需要额外的同步措施（如 volatile/synchronized）。

final 的线程可见性仅限于**初始化阶段**，适用于：

- 声明不可变常量（如 `final int MAX = 100`）
- 构造线程安全对象（如 `final AtomicReference`）

如果需要**持续可见性**（如状态标志位），仍需使用 `volatile` 或同步机制。

非 final 字段对比：

```java
class Example {
    final int x = 42;  // 构造后所有线程看到x=42
    int y = 10;        // 其他线程可能看到y=0（默认值）或10
}
```

**底层实现机制**

- **JVM 会插入内存屏障**：确保 final 字段初始化后对所有线程可见。
- **与 happens-before 规则关联**：对象构造结束 happens-before 于其他线程看到该对象。

**使用限制**

| 场景               | 是否线程安全 | 说明                               |
| ------------------ | ------------ | ---------------------------------- |
| **final 基本类型** | ✔️ 安全      | int/long 等初始化后不可变          |
| **final 引用类型** | ⚠️ 部分安全  | 引用不可变，但对象内部状态可能变化 |
| **非 final 字段**  | ❌ 不安全    | 需要额外同步                       |

危险示例：

```java
final Map<String, Integer> map = new HashMap<>();
// map引用不可变，但map.put()操作非线程安全！
```

**最佳实践**

（1）**优先用 final 修饰不可变数据**

```java
public class SafeCounter {
    private final AtomicLong count = new AtomicLong(0); // 线程安全
}
```

（2）**需要跨线程可见的变量应使用 volatile**

```java
private volatile boolean running = true;
```

（3）**避免以下错误用法**：

```java
// 错误！final 不能保证对象内部线程安全
final List<String> unsafeList = new ArrayList<>();
```