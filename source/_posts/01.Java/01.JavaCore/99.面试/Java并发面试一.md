---
title: Java 并发面试一
date: 2020-06-04 13:51:00
categories:
  - Java
  - JavaCore
  - 面试
tags:
  - Java
  - JavaSE
  - 面试
  - 并发
permalink: /pages/bbf8a81d/
---

# Java 并发面试一

## 并发术语

### 并发和并行

**典型问题**

- 什么是并发？
- 什么是并行？
- 并发和并行有什么区别？

**知识点**

并发和并行是最容易让新手费解的概念，那么如何理解二者呢？其最关键的差异在于：是否是**同时**发生：

- **并发**：是指具备处理多个任务的能力，但不一定要同时。
- **并行**：是指具备同时处理多个任务的能力。

下面是我见过最生动的说明，摘自 [并发与并行的区别是什么？——知乎的高票答案](https://www.zhihu.com/question/33515481/answer/58849148)

- 你吃饭吃到一半，电话来了，你一直到吃完了以后才去接，这就说明你不支持并发也不支持并行。
- 你吃饭吃到一半，电话来了，你停了下来接了电话，接完后继续吃饭，这说明你支持并发。
- 你吃饭吃到一半，电话来了，你一边打电话一边吃饭，这说明你支持并行。

### 同步和异步

**典型问题**

- 什么是同步？
- 什么是异步？
- 同步和异步有什么区别？

**知识点**

- **同步**：是指在发出一个调用时，在没有得到结果之前，该调用就不返回。但是一旦调用返回，就得到返回值了。
- **异步**：则是相反，调用在发出之后，这个调用就直接返回了，所以没有返回结果。换句话说，当一个异步过程调用发出后，调用者不会立刻得到结果。而是在调用发出后，被调用者通过状态、通知来通知调用者，或通过回调函数处理这个调用。

举例来说明：

- 同步就像是打电话：不挂电话，通话不会结束。
- 异步就像是发短信：发完短信后，就可以做其他事；当收到回复短信时，手机会通过铃声或振动来提醒。

### 阻塞和非阻塞

**典型问题**

- 什么是阻塞？
- 阻塞和非阻塞有什么区别？

**知识点**

阻塞和非阻塞关注的是程序在等待调用结果（消息，返回值）时的状态：

- **阻塞**：是指调用结果返回之前，当前线程会被挂起。调用线程只有在得到结果之后才会返回。
- **非阻塞**：是指在不能立刻得到结果之前，该调用不会阻塞当前线程。

举例来说明：

- 阻塞调用就像是打电话，通话不结束，不能放下。
- 非阻塞调用就像是发短信，发完短信后，就可以做其他事，短信来了，手机会提醒。

### 进程、线程、协程、管程

**典型问题**

- 什么是进程？
- 什么是线程？
- 什么是协程？
- 什么是管程？
- 进程和线程有什么区别？

**知识点**

- **进程（Process）** - 进程是具有一定独立功能的程序关于某个数据集合上的一次运行活动。进程是操作系统进行资源分配的基本单位。**进程可视为一个正在运行的程序**。
- **线程（Thread）** - **线程是操作系统进行调度的基本单位**。
- **管程（Monitor）** - **管程是指管理共享变量以及对共享变量的操作过程，让他们支持并发**。
  - Java 通过 synchronized 关键字及 wait()、notify()、notifyAll() 这三个方法来实现管程技术。
  - **管程和信号量是等价的，所谓等价指的是用管程能够实现信号量，也能用信号量实现管程**。
- **协程（Coroutine）** - **协程可以理解为一种轻量级的线程**。
  - 从操作系统的角度来看，线程是在内核态中调度的，而协程是在用户态调度的，所以相对于线程来说，协程切换的成本更低。
  - 协程虽然也有自己的栈，但是相比线程栈要小得多，典型的线程栈大小差不多有 1M，而协程栈的大小往往只有几 K 或者几十 K。所以，无论是从时间维度还是空间维度来看，协程都比线程轻量得多。
  - Go、Python、Lua、Kotlin 等语言都支持协程；Java OpenSDK 中的 Loom 项目目标就是支持协程。

进程和线程的差异：

- 一个程序至少有一个进程，一个进程至少有一个线程。
- 线程比进程划分更细，所以执行开销更小，并发性更高
- 进程是一个实体，拥有独立的资源；而同一个进程中的多个线程共享进程的资源。

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javacore/concurrent/processes-vs-threads.jpg)

JVM 在单个进程中运行，JVM 中的线程共享属于该进程的堆。这就是为什么几个线程可以访问同一个对象。线程共享堆并拥有自己的堆栈空间。这是一个线程如何调用一个方法以及它的局部变量是如何保持线程安全的。但是堆不是线程安全的并且为了线程安全必须进行同步。

#### 程序计数器为什么是私有的？

程序计数器主要有下面两个作用：

1. 字节码解释器通过改变程序计数器来依次读取指令，从而实现代码的流程控制，如：顺序执行、选择、循环、异常处理。
2. 在多线程的情况下，程序计数器用于记录当前线程执行的位置，从而当线程被切换回来的时候能够知道该线程上次运行到哪儿了。

需要注意的是，如果执行的是 native 方法，那么程序计数器记录的是 undefined 地址，只有执行的是 Java 代码时程序计数器记录的才是下一条指令的地址。

所以，程序计数器私有主要是为了**线程切换后能恢复到正确的执行位置**。

#### 虚拟机栈和本地方法栈为什么是私有的？

- **虚拟机栈：** 每个 Java 方法在执行之前会创建一个栈帧用于存储局部变量表、操作数栈、常量池引用等信息。从方法调用直至执行完成的过程，就对应着一个栈帧在 Java 虚拟机栈中入栈和出栈的过程。
- **本地方法栈：** 和虚拟机栈所发挥的作用非常相似，区别是：**虚拟机栈为虚拟机执行 Java 方法 （也就是字节码）服务，而本地方法栈则为虚拟机使用到的 Native 方法服务。** 在 HotSpot 虚拟机中和 Java 虚拟机栈合二为一。

所以，为了**保证线程中的局部变量不被别的线程访问到**，虚拟机栈和本地方法栈是线程私有的。

#### 一句话简单了解堆和方法区

堆和方法区是所有线程共享的资源，其中堆是进程中最大的一块内存，主要用于存放新创建的对象 （几乎所有对象都在这里分配内存），方法区主要用于存放已被加载的类信息、常量、静态变量、即时编译器编译后的代码等数据。

## 并发概念

### Java 线程和操作系统的线程有啥区别？

JDK 1.2 之前，Java 线程是基于绿色线程（Green Threads）实现的，这是一种用户级线程（用户线程），也就是说 JVM 自己模拟了多线程的运行，而不依赖于操作系统。由于绿色线程和原生线程比起来在使用时有一些限制（比如绿色线程不能直接使用操作系统提供的功能如异步 I/O、只能在一个内核线程上运行无法利用多核），在 JDK 1.2 及以后，Java 线程改为基于原生线程（Native Threads）实现，也就是说 JVM 直接使用操作系统原生的内核级线程（内核线程）来实现 Java 线程，由操作系统内核进行线程的调度和管理。

我们上面提到了用户线程和内核线程，考虑到很多读者不太了解二者的区别，这里简单介绍一下：

- 用户线程：由用户空间程序管理和调度的线程，运行在用户空间（专门给应用程序使用）。
- 内核线程：由操作系统内核管理和调度的线程，运行在内核空间（只有内核程序可以访问）。

顺便简单总结一下用户线程和内核线程的区别和特点：用户线程创建和切换成本低，但不可以利用多核。内核态线程，创建和切换成本高，可以利用多核。

一句话概括 Java 线程和操作系统线程的关系：**现在的 Java 线程的本质其实就是操作系统的线程**。

线程模型是用户线程和内核线程之间的关联方式，常见的线程模型有这三种：

1. 一对一（一个用户线程对应一个内核线程）
2. 多对一（多个用户线程映射到一个内核线程）
3. 多对多（多个用户线程映射到多个内核线程）

在 Windows 和 Linux 等主流操作系统中，Java 线程采用的是一对一的线程模型，也就是一个 Java 线程对应一个系统内核线程。Solaris 系统是一个特例（Solaris 系统本身就支持多对多的线程模型），HotSpot VM 在 Solaris 上支持多对多和一对一。具体可以参考 R 大的回答：[JVM 中的线程模型是用户级的么？](https://www.zhihu.com/question/23096638/answer/29617153)。

虚拟线程在 JDK 21 顺利转正，关于虚拟线程、平台线程（也就是我们上面提到的 Java 线程）和内核线程三者的关系可以阅读我写的这篇文章：[Java 20 新特性概览](https://github.com/Snailclimb/JavaGuide/blob/main/docs/java/new-features/java20.md)。

### 并发（多线程）编程的好处是什么？

- 更有效率的利用多处理器核心
- 更快的响应时间
- 更好的编程模型

### 单核 CPU 支持 Java 多线程吗？

单核 CPU 是支持 Java 多线程的。操作系统通过时间片轮转的方式，将 CPU 的时间分配给不同的线程。尽管单核 CPU 一次只能执行一个任务，但通过快速在多个线程之间切换，可以让用户感觉多个任务是同时进行的。

这里顺带提一下 Java 使用的线程调度方式。

操作系统主要通过两种线程调度方式来管理多线程的执行：

- **抢占式调度（Preemptive Scheduling）**：操作系统决定何时暂停当前正在运行的线程，并切换到另一个线程执行。这种切换通常是由系统时钟中断（时间片轮转）或其他高优先级事件（如 I/O 操作完成）触发的。这种方式存在上下文切换开销，但公平性和 CPU 资源利用率较好，不易阻塞。
- **协同式调度（Cooperative Scheduling）**：线程执行完毕后，主动通知系统切换到另一个线程。这种方式可以减少上下文切换带来的性能开销，但公平性较差，容易阻塞。

Java 使用的线程调度是抢占式的。也就是说，JVM 本身不负责线程的调度，而是将线程的调度委托给操作系统。操作系统通常会基于线程优先级和时间片来调度线程的执行，高优先级的线程通常获得 CPU 时间片的机会更多。

### 并发和性能

**典型问题**

**并发一定比串行更快吗？**

**知识点**

**并发不一定比串行更快！**

对于多线程而言，它不仅可能会带来线程安全问题，还有可能会带来性能问题。

多线程会产生部分额外的开销：

- **线程调度**
  - **上下文切换** - 在实际开发中，线程数往往是大于 CPU 核心数的，比如 CPU 核心数可能是 8 核、16 核，等等，但线程数可能达到成百上千个。这种情况下，操作系统就会按照一定的调度算法，给每个线程分配时间片，让每个线程都有机会得到运行。而在进行调度时就会引起上下文切换，上下文切换会挂起当前正在执行的线程并保存当前的状态，然后寻找下一处即将恢复执行的代码，唤醒下一个线程，以此类推，反复执行。但上下文切换带来的开销是比较大的，假设我们的任务内容非常短，比如只进行简单的计算，那么就有可能发生我们上下文切换带来的性能开销比执行线程本身内容带来的开销还要大的情况。
  - **缓存失效** - 由于程序有很大概率会再次访问刚才访问过的数据，所以为了加速整个程序的运行，会使用缓存，这样我们在使用相同数据时就可以很快地获取数据。可一旦进行了线程调度，切换到其他线程，CPU就会去执行不同的代码，原有的缓存就很可能失效了，需要重新缓存新的数据，这也会造成一定的开销，所以线程调度器为了避免频繁地发生上下文切换，通常会给被调度到的线程设置最小的执行时间，也就是只有执行完这段时间之后，才可能进行下一次的调度，由此减少上下文切换的次数。
- **线程协作** - 因为线程之间如果有共享数据，为了避免数据错乱，为了保证线程安全，就有可能禁止编译器和 CPU 对其进行重排序等优化，也可能出于同步的目的，反复把线程工作内存的数据 flush 到主存中，然后再从主内存 refresh 到其他线程的工作内存中，等等。这些问题在单线程中并不存在，但在多线程中为了确保数据的正确性，就不得不采取上述方法，因为线程安全的优先级要比性能优先级更高，这也间接降低了我们的性能。

### 并发安全

**经典问题**

（1）有哪些线程不安全的情况

（2）哪些场景需要额外注意线程安全问题？

**知识点**

（1）有哪些线程不安全的情况

1. 运行结果错误；
2. 发布和初始化导致线程安全问题；
3. 活跃性问题。典型的有：死锁、活锁和饥饿
   1. 死锁是指两个以上的线程永远相互阻塞的情况。
   2. 活锁 - 活锁是指两个或多个线程在执行各自的逻辑时，相互之间不断地做出反应和改变状态，从而陷入无限循环，而这种循环不会导致任何线程向前推进。
   3. 饥饿 - 饥饿是指线程需要某些资源时始终得不到，尤其是 CPU 资源，就会导致线程一直不能运行而产生的问题。

【示例】运行结果错误

```java
public class WrongResult {

   volatile static int i;

   public static void main(String[] args) throws InterruptedException {

       Runnable r = new Runnable() {

           @Override

           public void run() {

               for (int j = 0; j < 10000; j++) {

                   i++;

               }

           }

       };

       Thread thread1 = new Thread(r);

       thread1.start();

       Thread thread2 = new Thread(r);

       thread2.start();

       thread1.join();

       thread2.join();

       System.out.println(i);

    }

}
```

启动两个线程，分别对变量 i 进行 10000 次 i++ 操作。理论上得到的结果应该是 20000，但实际结果却远小于理论结果。这是因为 i 变量虽然被修饰为 volatile，但由于 i++ 不是原子操作，而 volatile 无法保证原子性，这就导致两个线程在循环 ++ 操作时，无法及时感知 i 的数值变化，最终导致累加数值远小于预期值。

【示例】发布和初始化导致线程安全问题

```java
public class WrongInit {

    private Map<Integer, String> students;

    public WrongInit() {
        new Thread(() -> {
            students = new HashMap<>();
            students.put(1, "王小美");
            students.put(2, "钱二宝");
            students.put(3, "周三");
            students.put(4, "赵四");
        }).start();
    }

    public Map<Integer, String> getStudents() {
        return students;
    }

    public static void main(String[] args) throws InterruptedException {
        WrongInit demo = new WrongInit();
        System.out.println(demo.getStudents().get(1));
    }

}
```

（2）哪些场景需要额外注意线程安全问题？

- **访问共享变量或资源** - 典型的场景有访问共享对象的属性，访问 static 静态变量，访问共享的缓存，等等。因为这些信息不仅会被一个线程访问到，还有可能被多个线程同时访问，那么就有可能在并发读写的情况下发生线程安全问题。
- **依赖时序的操作** - 如果我们操作的正确性是依赖时序的，而在多线程的情况下又不能保障执行的顺序和我们预想的一致，这个时候就会发生线程安全问题。
- **不同数据之间存在绑定关系** - 有时候，不同数据之间是成组出现的，存在着相互对应或绑定的关系，最典型的就是 IP 和端口号。有时候我们更换了 IP，往往需要同时更换端口号，如果没有把这两个操作绑定在一起，就有可能出现单独更换了 IP 或端口号的情况，而此时信息如果已经对外发布，信息获取方就有可能获取一个错误的 IP 与端口绑定情况，这时就发生了线程安全问题。
- **对方没有声明自己是线程安全的** - 在我们使用其他类时，如果对方没有声明自己是线程安全的，那么这种情况下对其他类进行多线程的并发操作，就有可能会发生线程安全问题。举个例子，比如说我们定义了 ArrayList，它本身并不是线程安全的，如果此时多个线程同时对 ArrayList 进行并发读/写，那么就有可能会产生线程安全问题，造成数据出错，而这个责任并不在 ArrayList，因为它本身并不是并发安全的。

### 死锁

**典型问题**

（1）什么是死锁？

（2）如何预防和避免线程死锁？

**知识点**

（1）什么是死锁？

**死锁是指两个以上的线程永远相互阻塞的情况**。产生死锁的四个必要条件：

1. 互斥条件：该资源任意一个时刻只由一个线程占用。
2. 请求与保持条件：一个线程因请求资源而阻塞时，对已获得的资源保持不放。
3. 不剥夺条件：线程已获得的资源在未使用完之前不能被其他线程强行剥夺，只有自己使用完毕后才释放资源。
4. 循环等待条件：若干线程之间形成一种头尾相接的循环等待资源关系。

（2）如何预防和避免线程死锁？

**如何预防死锁？** 破坏死锁的产生的必要条件即可：

1. **破坏请求与保持条件**：一次性申请所有的资源。
2. **破坏不剥夺条件**：占用部分资源的线程进一步申请其他资源时，如果申请不到，可以主动释放它占有的资源。
3. **破坏循环等待条件**：靠按序申请资源来预防。按某一顺序申请资源，释放资源则反序释放。破坏循环等待条件。

**如何避免死锁？**

避免死锁就是在资源分配时，借助于算法（比如银行家算法）对资源分配进行计算评估，使其进入安全状态。

> **安全状态** 指的是系统能够按照某种线程推进顺序（P1、P2、P3……Pn）来为每个线程分配所需资源，直到满足每个线程对资源的最大需求，使每个线程都可顺利完成。称 `<P1、P2、P3.....Pn>` 序列为安全序列。

## 线程基础

### 线程生命周期

**典型问题**

Java 线程生命周期中有哪些状态？各状态之间如何切换？

**知识点**

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202407211143123.png)

`java.lang.Thread.State` 中定义了 **6** 种不同的线程状态，在给定的一个时刻，线程只能处于其中的一个状态。

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

### 线程创建

**典型问题**

- Java 中，如何创建线程？
- Java 中，创建线程有几种方式？

**知识点**

一般来说，创建线程有很多种方式，例如：

- 实现 `Runnable` 接口
- 实现 `Callable` 接口
- 继承 `Thread` 类
- 通过线程池创建线程
- 使用 `CompletableFuture` 创建线程
- ...

虽然，看似有多种多样的创建线程方式。但是，从本质上来说，Java 就只有一种方式可以创建线程，那就是通过 `new Thread().start() ` 创建。不管是哪种方式，最终还是依赖于 `new Thread().start()`。

> 👉 扩展阅读：[大家都说 Java 有三种创建线程的方式！并发编程中的惊天骗局！](https://mp.weixin.qq.com/s/NspUsyhEmKnJ-4OprRFp9g)。

### 线程启动

**典型问题**

（1）`Thread.start()` 和 `Thread.run()` 有什么区别？

（2）可以直接调用 `Thread.run()` 方法么？

（3）一个线程两次调用 `Thread.start()` 方法会怎样

**知识点**

（1）`Thread.start()` 和 `Thread.run()` 的区别：

- `run()` 方法是线程的执行体。
- `start()` 方法负责启动线程，然后 JVM 会让这个线程去执行 `run()` 方法。

（2）可以直接调用 `Thread.run()` 方法，但是它的行为和普通方法一样，不会启动新线程去执行。**调用 `start()` 方法方可启动线程并使线程进入就绪状态，直接执行 `run()` 方法的话不会以多线程的方式执行。**

（3）Java 的线程是不允许启动两次的，第二次调用必然会抛出 `IllegalThreadStateException`。

### 线程等待

**典型问题**

（1）`Thread.sleep()`、`Thread.yield()`、`Thread.join()`、`Object.wait()` 方法有什么区别？

（2）为什么 `Thread.sleep()`、`Thread.yield()` 设计为静态方法？

**知识点**

（1）`Thread.sleep()`、`Thread.yield()`、`Thread.join()` 方法的区别：

- `Thread.sleep()`
  - `Thread.sleep()` 方法需要指定等待的时间，它可以让当前正在执行的线程在指定的时间内暂停执行，进入 **Blocked** 状态。
  - 该方法既可以让其他同优先级或者高优先级的线程得到执行的机会，也可以让低优先级的线程得到执行机会。
  - 但是，`Thread.sleep()` 方法不会释放“锁标志”，也就是说如果有 `synchronized` 同步块，其他线程仍然不能访问共享数据。
- `Thread.yield()`
  - `Thread.yield()` 方法可以让当前正在执行的线程暂停，但它不会阻塞该线程，它只是将该线程从 **Running** 状态转入 **Runnable** 状态。
  - 当某个线程调用了 `Thread.yield()` 方法暂停之后，只有优先级大于等于当前线程的处于就绪状态的线程才会获得执行的机会。
- `Thread.join()`
  - `Thread.join()` 方法会使当前线程转入 **Blocked** 状态，等待调用 `Thread.join()` 方法的线程结束后才能继续执行。
- `Object.wait()`
  - `Object.wait()` 用于使当前线程等待，直到其他线程调用相同对象的 `Object.notify()` 或 `Object.notifyAll()` 方法唤醒它。
  - 调用 `Object.wait()` 时，线程会释放对象锁，并进入等待状态。

（2）为什么 `Thread.sleep()`、`Thread.yield()` 设计为静态方法？

`Thread.sleep()`、`Thread.yield()` 针对的是 **Running** 状态的线程，也就是说在非 **Running** 状态的线程上执行这两个方法没有意义。这就是为什么这两个方法被设计为静态的。它们只针对正在 **Running** 状态的线程工作，避免程序员错误的认为可以在其他非 **Running** 状态线程上调用。

> 👉 扩展阅读：[Java 线程中 yield 与 join 方法的区别](http://www.importnew.com/14958.html)
> 👉 扩展阅读：[sleep()，wait()，yield() 和 join() 方法的区别](https://blog.csdn.net/xiangwanpeng/article/details/54972952)

### 线程通信

线程间通信是线程间共享资源的一种方式。`Object.wait()`, `Object.notify()` 和 `Object.notifyAll()` 是用于线程之间协作和通信的方法，它们通常与`synchronized` 关键字一起使用来实现线程的同步。

**典型问题**

（1）为什么线程通信的方法 `Object.wait()`、`Object.notify()` 和 `Object.notifyAll()` 被定义在 `Object` 类里？

（2）为什么 `Object.wait()`、`Object.notify()` 和 `Object.notifyAll()` 必须在 `synchronized` 方法/块中被调用？

（3） `Object.wait()` 和 `Thread.sleep` 有什么区别？

**知识点**

（1）为什么线程通信的方法 `Object.wait()`、`Object.notify()` 和 `Object.notifyAll()` 被定义在 `Object` 类里？

Java 的每个对象中都有一个称之为 monitor 监视器的锁，由于每个对象都可以上锁，这就要求在对象头中有一个用来保存锁信息的位置。这个锁是对象级别的，而非线程级别的，wait/notify/notifyAll 也都是锁级别的操作，它们的锁属于对象，所以把它们定义在 Object 类中是最合适，因为 Object 类是所有对象的父类。

如果把 wait/notify/notifyAll 方法定义在 Thread 类中，会带来很大的局限性，比如一个线程可能持有多把锁，以便实现相互配合的复杂逻辑，假设此时 wait 方法定义在 Thread 类中，如何实现让一个线程持有多把锁呢？又如何明确线程等待的是哪把锁呢？既然我们是让当前线程去等待某个对象的锁，自然应该通过操作对象来实现，而不是操作线程。

- `Object.wait()`
  - `Object.wait()` 方法用于使当前线程进入等待状态，直到其他线程调用相同对象的 `notify()` 或 `notifyAll()` 方法唤醒它。
  - 在调用 `wait()` 方法时，线程会释放对象的锁，并进入等待状态。通常在使用 `wait()` 方法时需要放在一个循环中，以避免虚假唤醒（spurious wakeups）。
- `Object.notify()`
  - `Object.notify()` 方法用于唤醒正在等待该对象的锁的一个线程。
  - 被唤醒的线程将会尝试重新获取对象的锁，一旦获取到锁，它将继续执行。
- `Object.notifyAll()`
  - `Object.notifyAll()` 方法用于唤醒正在等待该对象的锁的所有线程。
  - 所有被唤醒的线程将会竞争对象的锁，一旦获取到锁，它们将继续执行。

（2）为什么 `Object.wait()`、`Object.notify()` 和 `Object.notifyAll()` 必须在 `synchronized` 方法/块中被调用？

当一个线程需要调用对象的 `wait()` 方法的时候，这个线程必须拥有该对象的锁，接着它就会释放这个对象锁并进入等待状态直到其他线程调用这个对象上的 `notify()` 方法。同样的，当一个线程需要调用对象的 `notify()` 方法时，它会释放这个对象的锁，以便其他在等待的线程就可以得到这个对象锁。

由于所有的这些方法都需要线程持有对象的锁，这样就只能通过 `synchronized` 来实现，所以他们只能在 `synchronized` 方法/块中被调用。

（3） `Object.wait()` 和 `Thread.sleep` 有什么区别？

相同点：

1. 它们都可以让线程阻塞。
2. 它们都可以响应 interrupt 中断：在等待的过程中如果收到中断信号，都可以进行响应，并抛出 InterruptedException 异常。

不同点：

1. wait 方法必须在 synchronized 保护的代码中使用，而 sleep 方法并没有这个要求。
2. 在同步代码中执行 sleep 方法时，并不会释放 monitor 锁，但执行 wait 方法时会主动释放 monitor 锁。
3. sleep 方法中会要求必须定义一个时间，时间到期后会主动恢复，而对于没有参数的 wait 方法而言，意味着永久等待，直到被中断或被唤醒才能恢复，它并不会主动恢复。
4. wait/notify 是 Object 类的方法，而 sleep 是 Thread 类的方法。

> 👉 扩展阅读：[Java 并发编程：线程间协作的两种方式：wait、notify、notifyAll 和 Condition](http://www.cnblogs.com/dolphin0520/p/3920385.html)

### 线程终止

**经典问题**

（1）如何正确停止线程？

（2）可以使用 `Thread.stop`，`Thread.suspend` 和 `Thread.resume` 停止线程吗？为什么？

（3）使用 `volatile` 标记方式停止线程正确吗？

**知识点**

（1）如何正确停止线程？

通常情况下，我们不会手动停止一个线程，而是允许线程运行到结束，然后让它自然停止。但是依然会有许多特殊的情况需要我们提前停止线程，比如：用户突然关闭程序，或程序运行出错重启等。

**对于 Java 而言，最正确的停止线程的方式是：通过 `Thread.interrupt` 和 `Thread.isInterrupted` 配合来控制线程终止**。但 `Thread.interrupt` 仅仅起到通知被停止线程的作用。而对于被停止的线程而言，它拥有完全的自主权，它既可以选择立即停止，也可以选择一段时间后停止，也可以选择压根不停止。

事实上，Java 希望程序间能够相互通知、相互协作地管理线程，因为如果不了解对方正在做的工作，贸然强制停止线程就可能会造成一些安全的问题，为了避免造成问题就需要给对方一定的时间来整理收尾工作。比如：线程正在写入一个文件，这时收到终止信号，它就需要根据自身业务判断，是选择立即停止，还是将整个文件写入成功后停止，而如果选择立即停止就可能造成数据不完整，不管是中断命令发起者，还是接收者都不希望数据出现问题。

一旦调用某个线程的 `Thread.interrupt` 之后，这个线程的中断标记位就会被设置成 `true`。每个线程都有这样的标记位，当线程执行时，应该定期检查这个标记位，如果标记位被设置成 `true`，就说明有程序想终止该线程。回到源码，可以看到在 `while` 循环体判断语句中，首先通过 `Thread.currentThread().isInterrupt()` 判断线程是否被中断，随后检查是否还有工作要做。&& 逻辑表示只有当两个判断条件同时满足的情况下，才会去执行下面的工作。

需要留意一个特殊场景：**`Thread.sleep` 后，线程依然可以感知 `Thread.interrupt`**。

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

（2）可以使用 `Thread.stop`，`Thread.suspend` 和 `Thread.resume` 停止线程吗？为什么？

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

（3）使用 `volatile` 标记方式停止线程正确吗？

使用 `volatile` 标记方式停止线程并不总是正确的。虽然 `volatile` 变量可以确保可见性，即当一个线程修改了 `volatile` 变量的值，其他线程能够立即看到最新的值，但它并不能保证原子性，也就是说并不能保证多个线程对 `volatile` 变量的操作是互斥的。

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

在上述例子中，`canceled` 是一个 `volatile` 变量，用来控制线程的停止。虽然这种方式在某些情况下可以工作，但它并不是一个可靠的停止线程的方式，因为在多线程环境中，其他线程修改 `canceled` 的值时，可能会出现竞态条件，导致线程无法正确停止。

### 线程优先级

**典型问题**

（1）Java 的线程优先级如何控制？

（2）高优先级的 Java 线程一定先执行吗？

**知识点**

（1）Java 中的线程优先级的范围是 `[1,10]`，一般来说，高优先级的线程在运行时会具有优先权。可以通过 `thread.setPriority(Thread.MAX_PRIORITY)` 的方式设置，默认优先级为 `5`。

（2）即使设置了线程的优先级，也**无法保证高优先级的线程一定先执行**。

这是因为 **Java 线程优先级依赖于操作系统的支持**，然而，不同的操作系统支持的线程优先级并不相同，不能很好的和 Java 中线程优先级一一对应。因此，Java 线程优先级控制并不可靠。

### 守护线程

**典型问题**

（1）什么是守护线程？

（2）如何创建守护线程？

**知识点**

（1）什么是守护线程？

守护线程（Daemon Thread）是在后台执行并且不会阻止 JVM 终止的线程。与守护线程（Daemon Thread）相反的，叫用户线程（User Thread），也就是非守护线程。

守护线程的优先级比较低，一般用于为系统中的其它对象和线程提供服务。典型的应用就是垃圾回收器。

（2）创建守护线程的方式：

- 使用 `thread.setDaemon(true)` 可以设置 thread 线程为守护线程。
- 正在运行的用户线程无法设置为守护线程，所以 `thread.setDaemon(true)` 必须在 `thread.start()` 之前设置，否则会抛出 `llegalThreadStateException` 异常；
- 一个守护线程创建的子线程依然是守护线程。
- 不要认为所有的应用都可以分配给守护线程来进行服务，比如读写操作或者计算逻辑。

> 👉 扩展阅读：[Java 中守护线程的总结](https://blog.csdn.net/shimiso/article/details/8964414)

## volatile

被 `volatile` 关键字修饰的变量有两层含义：

- **保证变量的可见性**
- **防止 JVM 的指令重排序**

### volatile 保证线程可见性

**典型问题**

- `volatile` 有什么作用？
- Java 中，如何保证变量的可见性？

**知识点**

**在 Java 并发场景中，`volatile` 可以保证线程可见性**。保证了不同线程对这个变量进行操作时的可见性，即一个线程修改了某个共享变量，另外一个线程能读到这个修改的值。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210102230327.png)

`volatile` 关键字其实并非是 Java 语言特有的，在 C 语言里也有，它最原始的意义就是禁用 CPU 缓存。如果我们将一个变量使用 `volatile` 修饰，这就指示 编译器，这个变量是共享且不稳定的，每次使用它都到主存中进行读取。

`volatile` 关键字能保证数据的可见性，但不能保证数据的原子性。`synchronized` 关键字两者都能保证。

### volatile 防止 JVM 的指令重排序

**典型问题**

- `volatile` 有什么作用？
- Java 中，如何防止 JVM 的指令重排序？

**知识点**

观察加入 `volatile` 关键字和没有加入 `volatile` 关键字时所生成的汇编代码发现，**加入 `volatile` 关键字时，会多出一个 `lock` 前缀指令**。

**`lock` 前缀指令实际上相当于一个内存屏障**（也成内存栅栏），内存屏障会提供 3 个功能：

- 它确保指令重排序时不会把其后面的指令排到内存屏障之前的位置，也不会把前面的指令排到内存屏障的后面；即在执行到内存屏障这句指令时，在它前面的操作已经全部完成；
- 它会强制将对缓存的修改操作立即写入主存；
- 如果是写操作，它会导致其他 CPU 中对应的缓存行无效。

在 Java 中，`Unsafe` 类提供了三个开箱即用的内存屏障相关的方法，屏蔽了操作系统底层的差异：

```java
public native void loadFence();
public native void storeFence();
public native void fullFence();
```

理论上来说，你通过这个三个方法也可以实现和 `volatile` 禁止重排序一样的效果，只是会麻烦一些。

下面我以一个常见的面试题为例讲解一下 `volatile` 关键字禁止指令重排序的效果。

面试中面试官经常会说：“单例模式了解吗？来给我手写一下！给我解释一下双重检验锁方式实现单例模式的原理呗！”

**双重校验锁实现对象单例（线程安全）**：

```java
public class Singleton {

    private volatile static Singleton uniqueInstance;

    private Singleton() {
    }

    public  static Singleton getUniqueInstance() {
       // 先判断对象是否已经实例过，没有实例化过才进入加锁代码
        if (uniqueInstance == null) {
            // 类对象加锁
            synchronized (Singleton.class) {
                if (uniqueInstance == null) {
                    uniqueInstance = new Singleton();
                }
            }
        }
        return uniqueInstance;
    }
}
```

`uniqueInstance` 采用 `volatile` 关键字修饰也是很有必要的， `uniqueInstance = new Singleton();` 这段代码其实是分为三步执行：

1. 为 `uniqueInstance` 分配内存空间
2. 初始化 `uniqueInstance`
3. 将 `uniqueInstance` 指向分配的内存地址

但是由于 JVM 具有指令重排的特性，执行顺序有可能变成 1->3->2。指令重排在单线程环境下不会出现问题，但是在多线程环境下会导致一个线程获得还没有初始化的实例。例如，线程 T1 执行了 1 和 3，此时 T2 调用 `getUniqueInstance`() 后发现 `uniqueInstance` 不为空，因此返回 `uniqueInstance`，但此时 `uniqueInstance` 还未被初始化。

### volatile 不保证原子性

**问题点**

- volatile 能保证原子性吗？
- volatile 能完全保证并发安全吗？

**知识点**

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

### volatile 和 synchronized

**典型问题**

`volatile` 和 `synchronized` 有什么区别？`volatile` 能替代 `synchronized` ？

**知识点**

**`volatile` 无法替代 `synchronized` ，因为 `volatile` 无法保证操作的原子性**。

- `volatile` 本质是在告诉 jvm 当前变量在寄存器（工作内存）中的值是不确定的，需要从主存中读取；`synchronized` 则是锁定当前变量，只有当前线程可以访问该变量，其他线程被阻塞住。
- `volatile` 仅能修饰变量；`synchronized` 可以修饰方法和代码块。
- `volatile` 仅能实现变量的修改可见性，不能保证原子性；而 `synchronized` 则可以保证变量的修改可见性和原子性
- `volatile` 不会造成线程的阻塞；`synchronized` 可能会造成线程的阻塞。
- `volatile` 标记的变量不会被编译器优化；`synchronized` 标记的变量可以被编译器优化。

## synchronized

`synchronized` 有 3 种应用方式：

- **同步实例方法** - 对于普通同步方法，锁是当前实例对象
- **同步静态方法** - 对于静态同步方法，锁是当前类的 `Class` 对象
- **同步代码块** - 对于同步方法块，锁是 `synchonized` 括号里配置的对象

**原理**

`synchronized` 经过编译后，会在同步块的前后分别形成 `monitorenter` 和 `monitorexit` 这两个字节码指令，这两个字节码指令都需要一个引用类型的参数来指明要锁定和解锁的对象。如果 `synchronized` 明确制定了对象参数，那就是这个对象的引用；如果没有明确指定，那就根据 `synchronized` 修饰的是实例方法还是静态方法，去对对应的对象实例或 `Class` 对象来作为锁对象。

`synchronized` 同步块对同一线程来说是可重入的，不会出现锁死问题。

`synchronized` 同步块是互斥的，即已进入的线程执行完成前，会阻塞其他试图进入的线程。

**优化**

Java 1.6 以后，`synchronized` 做了大量的优化，其性能已经与 `Lock` 、`ReadWriteLock` 基本上持平。

`synchronized` 的优化是将锁粒度分为不同级别，`synchronized` 会根据运行状态动态的由低到高调整锁级别（**偏向锁** -> **轻量级锁** -> **重量级锁**），以减少阻塞。

**同步方法 or 同步块？**

- 同步块是更好的选择。
- 因为它不会锁住整个对象（当然你也可以让它锁住整个对象）。同步方法会锁住整个对象，哪怕这个类中有多个不相关联的同步块，这通常会导致他们停止执行并需要等待获得这个对象上的锁。

### synchronized 作用

**典型问题**

`synchronized` 有什么作用？

**知识点**

**`synchronized` 可以保证在同一个时刻，只有一个线程可以执行某个方法或者某个代码块**。

`synchronized` 同步块对同一线程来说是可重入的，不会出现锁死问题。

`synchronized` 同步块是互斥的，即已进入的线程执行完成前，会阻塞其他试图进入的线程。

在 Java 早期版本中，`synchronized` 属于 **重量级锁**，效率低下。这是因为监视器锁（monitor）是依赖于底层的操作系统的 `Mutex Lock` 来实现的，Java 的线程是映射到操作系统的原生线程之上的。如果要挂起或者唤醒一个线程，都需要操作系统帮忙完成，而操作系统实现线程之间的切换时需要从用户态转换到内核态，这个状态之间的转换需要相对比较长的时间，时间成本相对较高。

不过，在 Java 6 之后， `synchronized` 引入了大量的优化如自旋锁、适应性自旋锁、锁消除、锁粗化、偏向锁、轻量级锁等技术来减少锁操作的开销，这些优化让 `synchronized` 锁的效率提升了很多。因此， `synchronized` 还是可以在实际项目中使用的，像 JDK 源码、很多开源框架都大量使用了 `synchronized` 。

关于偏向锁多补充一点：由于偏向锁增加了 JVM 的复杂性，同时也并没有为所有应用都带来性能提升。因此，在 JDK15 中，偏向锁被默认关闭（仍然可以使用 `-XX:+UseBiasedLocking` 启用偏向锁），在 JDK18 中，偏向锁已经被彻底废弃（无法通过命令行打开）。

### synchronized 用法

**典型问题**

- synchronized 可以用在哪些场景？
- synchronized 如何使用？

**知识点**

`synchronized` 关键字的使用方式主要有下面 3 种：

1. 修饰实例方法
2. 修饰静态方法
3. 修饰代码块

**1、修饰实例方法** （锁当前对象实例）

给当前对象实例加锁，进入同步代码前要获得 **当前对象实例的锁** 。

```
synchronized void method() {
    // 业务代码
}
```

**2、修饰静态方法** （锁当前类）

给当前类加锁，会作用于类的所有对象实例 ，进入同步代码前要获得 **当前 class 的锁**。

这是因为静态成员不属于任何一个实例对象，归整个类所有，不依赖于类的特定实例，被类的所有实例共享。

```
synchronized static void method() {
    // 业务代码
}
```

静态 `synchronized` 方法和非静态 `synchronized` 方法之间的调用互斥么？不互斥！如果一个线程 A 调用一个实例对象的非静态 `synchronized` 方法，而线程 B 需要调用这个实例对象所属类的静态 `synchronized` 方法，是允许的，不会发生互斥现象，因为访问静态 `synchronized` 方法占用的锁是当前类的锁，而访问非静态 `synchronized` 方法占用的锁是当前实例对象锁。

**3、修饰代码块** （锁指定对象 / 类）

对括号里指定的对象 / 类加锁：

- `synchronized(object)` 表示进入同步代码库前要获得 **给定对象的锁**。
- `synchronized（类。class)` 表示进入同步代码前要获得 **给定 Class 的锁**

```
synchronized(this) {
    // 业务代码
}
```

**总结：**

- `synchronized` 关键字加到 `static` 静态方法和 `synchronized(class)` 代码块上都是是给 Class 类上锁；
- `synchronized` 关键字加到实例方法上是给对象实例上锁；
- 尽量不要使用 `synchronized(String a)` 因为 JVM 中，字符串常量池具有缓存功能。

### 构造方法可以用 synchronized 修饰么？

构造方法不能使用 synchronized 关键字修饰。不过，可以在构造方法内部使用 synchronized 代码块。

另外，构造方法本身是线程安全的，但如果在构造方法中涉及到共享资源的操作，就需要采取适当的同步措施来保证整个构造过程的线程安全。

### synchronized 底层原理了解吗？

`synchronized` 经过编译后，会在同步块的前后分别形成 `monitorenter` 和 `monitorexit` 这两个字节码指令，这两个字节码指令都需要一个引用类型的参数来指明要锁定和解锁的对象。如果 `synchronized` 明确制定了对象参数，那就是这个对象的引用；如果没有明确指定，那就根据 `synchronized` 修饰的是实例方法还是静态方法，去对对应的对象实例或 `Class` 对象来作为锁对象。

synchronized 关键字底层原理属于 JVM 层面的东西。

#### synchronized 同步语句块的情况

```
public class SynchronizedDemo {
    public void method() {
        synchronized (this) {
            System.out.println("synchronized 代码块");
        }
    }
}
```

通过 JDK 自带的 `javap` 命令查看 `SynchronizedDemo` 类的相关字节码信息：首先切换到类的对应目录执行 `javac SynchronizedDemo.java` 命令生成编译后的 .class 文件，然后执行 `javap -c -s -v -l SynchronizedDemo.class`。

[![synchronized 关键字原理](https://camo.githubusercontent.com/669b67b48f1e58c37ac12eb80239cc5df7df55d7d75f9187e1622ee401a0c230/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f636f6e63757272656e742f73796e6368726f6e697a65642d7072696e6369706c652e706e67)](https://camo.githubusercontent.com/669b67b48f1e58c37ac12eb80239cc5df7df55d7d75f9187e1622ee401a0c230/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f636f6e63757272656e742f73796e6368726f6e697a65642d7072696e6369706c652e706e67)

从上面我们可以看出：**`synchronized` 同步语句块的实现使用的是 `monitorenter` 和 `monitorexit` 指令，其中 `monitorenter` 指令指向同步代码块的开始位置，`monitorexit` 指令则指明同步代码块的结束位置。**

上面的字节码中包含一个 `monitorenter` 指令以及两个 `monitorexit` 指令，这是为了保证锁在同步代码块代码正常执行以及出现异常的这两种情况下都能被正确释放。

当执行 `monitorenter` 指令时，线程试图获取锁也就是获取 **对象监视器 `monitor`** 的持有权。

> 在 Java 虚拟机 (HotSpot) 中，Monitor 是基于 C++ 实现的，由 [ObjectMonitor](https://github.com/openjdk-mirror/jdk7u-hotspot/blob/50bdefc3afe944ca74c3093e7448d6b889cd20d1/src/share/vm/runtime/objectMonitor.cpp) 实现的。每个对象中都内置了一个 `ObjectMonitor` 对象。
>
> 另外，`wait/notify` 等方法也依赖于 `monitor` 对象，这就是为什么只有在同步的块或者方法中才能调用 `wait/notify` 等方法，否则会抛出 `java.lang.IllegalMonitorStateException` 的异常的原因。

在执行 `monitorenter` 时，会尝试获取对象的锁，如果锁的计数器为 0 则表示锁可以被获取，获取后将锁计数器设为 1 也就是加 1。

[![ 执行 monitorenter 获取锁](https://camo.githubusercontent.com/9b5986778b36cc58ea99abe6df0a892dc46acae65bbb73fba6b6dcfc4834da6b/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f636f6e63757272656e742f73796e6368726f6e697a65642d6765742d6c6f636b2d636f64652d626c6f636b2e706e67)](https://camo.githubusercontent.com/9b5986778b36cc58ea99abe6df0a892dc46acae65bbb73fba6b6dcfc4834da6b/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f636f6e63757272656e742f73796e6368726f6e697a65642d6765742d6c6f636b2d636f64652d626c6f636b2e706e67)

对象锁的的拥有者线程才可以执行 `monitorexit` 指令来释放锁。在执行 `monitorexit` 指令后，将锁计数器设为 0，表明锁被释放，其他线程可以尝试获取锁。

[![ 执行 monitorexit 释放锁](https://camo.githubusercontent.com/ff0fb002626c445b1adc69507f430bc0ffd1202c9e0decfc58749f71c8183587/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f636f6e63757272656e742f73796e6368726f6e697a65642d72656c656173652d6c6f636b2d626c6f636b2e706e67)](https://camo.githubusercontent.com/ff0fb002626c445b1adc69507f430bc0ffd1202c9e0decfc58749f71c8183587/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f636f6e63757272656e742f73796e6368726f6e697a65642d72656c656173652d6c6f636b2d626c6f636b2e706e67)

如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止。

#### synchronized 修饰方法的的情况

```
public class SynchronizedDemo2 {
    public synchronized void method() {
        System.out.println("synchronized 方法");
    }
}
```

[![synchronized 关键字原理](https://camo.githubusercontent.com/0ac6ee1ed5d3ca201bd9243767f5a3d239419b6381c9053c7ccfba00890bd4b7/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73796e6368726f6e697a6564254535253835254233254539253934254145254535254144253937254535253845253946254537253930253836322e706e67)](https://camo.githubusercontent.com/0ac6ee1ed5d3ca201bd9243767f5a3d239419b6381c9053c7ccfba00890bd4b7/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73796e6368726f6e697a6564254535253835254233254539253934254145254535254144253937254535253845253946254537253930253836322e706e67)

`synchronized` 修饰的方法并没有 `monitorenter` 指令和 `monitorexit` 指令，取得代之的确实是 `ACC_SYNCHRONIZED` 标识，该标识指明了该方法是一个同步方法。JVM 通过该 `ACC_SYNCHRONIZED` 访问标志来辨别一个方法是否声明为同步方法，从而执行相应的同步调用。

如果是实例方法，JVM 会尝试获取实例对象的锁。如果是静态方法，JVM 会尝试获取当前 class 的锁。

#### 总结

`synchronized` 同步语句块的实现使用的是 `monitorenter` 和 `monitorexit` 指令，其中 `monitorenter` 指令指向同步代码块的开始位置，`monitorexit` 指令则指明同步代码块的结束位置。

`synchronized` 修饰的方法并没有 `monitorenter` 指令和 `monitorexit` 指令，取得代之的确实是 `ACC_SYNCHRONIZED` 标识，该标识指明了该方法是一个同步方法。

**不过两者的本质都是对对象监视器 monitor 的获取。**

相关推荐：[Java 锁与线程的那些事 - 有赞技术团队](https://tech.youzan.com/javasuo-yu-xian-cheng-de-na-xie-shi/) 。

🧗🏻 进阶一下：学有余力的小伙伴可以抽时间详细研究一下对象监视器 `monitor`。

### JDK1.6 之后的 synchronized 底层做了哪些优化？锁升级原理了解吗？

在 Java 6 之后， `synchronized` 引入了大量的优化如自旋锁、适应性自旋锁、锁消除、锁粗化、偏向锁、轻量级锁等技术来减少锁操作的开销，这些优化让 `synchronized` 锁的效率提升了很多（JDK18 中，偏向锁已经被彻底废弃，前面已经提到过了）。

锁主要存在四种状态，依次是：无锁状态、偏向锁状态、轻量级锁状态、重量级锁状态，他们会随着竞争的激烈而逐渐升级。注意锁可以升级不可降级，这种策略是为了提高获得锁和释放锁的效率。

`synchronized` 锁升级是一个比较复杂的过程，面试也很少问到，如果你想要详细了解的话，可以看看这篇文章：[浅析 synchronized 锁升级的原理与实现](https://www.cnblogs.com/star95/p/17542850.html)。

### synchronized 和 volatile 有什么区别？

`synchronized` 关键字和 `volatile` 关键字是两个互补的存在，而不是对立的存在！

- `volatile` 关键字是线程同步的轻量级实现，所以 `volatile` 性能肯定比 `synchronized` 关键字要好 。但是 `volatile` 关键字只能用于变量而 `synchronized` 关键字可以修饰方法以及代码块 。
- `volatile` 关键字能保证数据的可见性，但不能保证数据的原子性。`synchronized` 关键字两者都能保证。
- `volatile` 关键字主要用于解决变量在多个线程之间的可见性，而 `synchronized` 关键字解决的是多个线程之间访问资源的同步性。

## CAS

> 什么是 CAS？
>
> CAS 有什么作用？
>
> CAS 的原理是什么？
>
> CAS 的三大问题？

**作用**

**CAS（Compare and Swap）**，字面意思为**比较并交换**。CAS 有 3 个操作数，分别是：内存值 V，旧的预期值 A，要修改的新值 B。当且仅当预期值 A 和内存值 V 相同时，将内存值 V 修改为 B，否则什么都不做。

**原理**

Java 主要利用 `Unsafe` 这个类提供的 CAS 操作。`Unsafe` 的 CAS 依赖的是 JV M 针对不同的操作系统实现的 `Atomic::cmpxchg` 指令。

**三大问题**

1. **ABA 问题**：因为 CAS 需要在操作值的时候检查下值有没有发生变化，如果没有发生变化则更新，但是如果一个值原来是 A，变成了 B，又变成了 A，那么使用 CAS 进行检查时会发现它的值没有发生变化，但是实际上却变化了。ABA 问题的解决思路就是使用版本号。在变量前面追加上版本号，每次变量更新的时候把版本号加一，那么 A－B－A 就会变成 1A-2B－3A。
2. **循环时间长开销大**。自旋 CAS 如果长时间不成功，会给 CPU 带来非常大的执行开销。如果 JVM 能支持处理器提供的 pause 指令那么效率会有一定的提升，pause 指令有两个作用，第一它可以延迟流水线执行指令（de-pipeline）, 使 CPU 不会消耗过多的执行资源，延迟的时间取决于具体实现的版本，在一些处理器上延迟时间是零。第二它可以避免在退出循环的时候因内存顺序冲突（memory order violation）而引起 CPU 流水线被清空（CPU pipeline flush），从而提高 CPU 的执行效率。
3. **只能保证一个共享变量的原子操作**。当对一个共享变量执行操作时，我们可以使用循环 CAS 的方式来保证原子操作，但是对多个共享变量操作时，循环 CAS 就无法保证操作的原子性，这个时候就可以用锁，或者有一个取巧的办法，就是把多个共享变量合并成一个共享变量来操作。比如有两个共享变量 i ＝ 2,j=a，合并一下 ij=2a，然后用 CAS 来操作 ij。从 Java1.5 开始 JDK 提供了 AtomicReference 类来保证引用对象之间的原子性，你可以把多个变量放在一个对象里来进行 CAS 操作。

## ThreadLocal

> `ThreadLocal` 有什么作用？
>
> `ThreadLocal` 的原理是什么？
>
> 如何解决 `ThreadLocal` 内存泄漏问题？

**作用**

**`ThreadLocal` 是一个存储线程本地副本的工具类**。

**原理**

`Thread` 类中维护着一个 `ThreadLocal.ThreadLocalMap` 类型的成员 `threadLocals`。这个成员就是用来存储当前线程独占的变量副本。

`ThreadLocalMap` 是 `ThreadLocal` 的内部类，它维护着一个 `Entry` 数组， `Entry` 用于保存键值对，其 key 是 `ThreadLocal` 对象，value 是传递进来的对象（变量副本）。 `Entry` 继承了 `WeakReference` ，所以是弱引用。

**内存泄漏问题**

ThreadLocalMap 的 `Entry` 继承了 `WeakReference`，所以它的 key （`ThreadLocal` 对象）是弱引用，而 value （变量副本）是强引用。

- 如果 `ThreadLocal` 对象没有外部强引用来引用它，那么 `ThreadLocal` 对象会在下次 GC 时被回收。
- 此时，`Entry` 中的 key 已经被回收，但是 value 由于是强引用不会被垃圾收集器回收。如果创建 `ThreadLocal` 的线程一直持续运行，那么 value 就会一直得不到回收，产生内存泄露。

那么如何避免内存泄漏呢？方法就是：**使用 `ThreadLocal` 的 `set` 方法后，显示的调用 `remove` 方法** 。

## 内存模型

### 什么是 Java 内存模型

- Java 内存模型即 Java Memory Model，简称 JMM。JMM 定义了 JVM 在计算机内存 (RAM) 中的工作方式。JMM 是隶属于 JVM 的。
- 并发编程领域两个关键问题：线程间通信和线程间同步
- 线程间通信机制
  - 共享内存 - 线程间通过写-读内存中的公共状态来隐式进行通信。
  - 消息传递 - java 中典型的消息传递方式就是 wait() 和 notify()。
- 线程间同步机制
  - 在共享内存模型中，必须显示指定某个方法或某段代码在线程间互斥地执行。
  - 在消息传递模型中，由于发送消息必须在接收消息之前，因此同步是隐式进行的。
- Java 的并发采用的是共享内存模型
- JMM 决定一个线程对共享变量的写入何时对另一个线程可见。
- 线程之间的共享变量存储在主内存（main memory）中，每个线程都有一个私有的本地内存（local memory），本地内存中存储了该线程以读/写共享变量的副本。
- JMM 把内存分成了两部分：线程栈区和堆区
  - 线程栈
    - JVM 中运行的每个线程都拥有自己的线程栈，线程栈包含了当前线程执行的方法调用相关信息，我们也把它称作调用栈。随着代码的不断执行，调用栈会不断变化。
    - 线程栈还包含了当前方法的所有本地变量信息。线程中的本地变量对其它线程是不可见的。
  - 堆区
    - 堆区包含了 Java 应用创建的所有对象信息，不管对象是哪个线程创建的，其中的对象包括原始类型的封装类（如 Byte、Integer、Long 等等）。不管对象是属于一个成员变量还是方法中的本地变量，它都会被存储在堆区。
  - 一个本地变量如果是原始类型，那么它会被完全存储到栈区。
  - 一个本地变量也有可能是一个对象的引用，这种情况下，这个本地引用会被存储到栈中，但是对象本身仍然存储在堆区。
  - 对于一个对象的成员方法，这些方法中包含本地变量，仍需要存储在栈区，即使它们所属的对象在堆区。
  - 对于一个对象的成员变量，不管它是原始类型还是包装类型，都会被存储到堆区。

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javacore/concurrent/java-memory-model_3.png)

> 👉 扩展阅读：[全面理解 Java 内存模型](https://blog.csdn.net/suifeng3051/article/details/52611310)

## 同步容器和并发容器

> 👉 扩展阅读：[Java 并发容器](https://dunwu.github.io/waterdrop/pages/6fd8d836/)

### ⭐ 同步容器

> 什么是同步容器？
>
> 有哪些常见同步容器？
>
> 它们是如何实现线程安全的？
>
> 同步容器真的线程安全吗？

**类型**

`Vector`、`Stack`、`Hashtable`

**作用/原理**

同步容器的同步原理就是在方法上用 `synchronized` 修饰。 **`synchronized` 可以保证在同一个时刻，只有一个线程可以执行某个方法或者某个代码块**。

`synchronized` 的互斥同步会产生阻塞和唤醒线程的开销。显然，这种方式比没有使用 `synchronized` 的容器性能要差。

**线程安全**

同步容器真的绝对安全吗？

其实也未必。在做复合操作（非原子操作）时，仍然需要加锁来保护。常见复合操作如下：

- **迭代**：反复访问元素，直到遍历完全部元素；
- **跳转**：根据指定顺序寻找当前元素的下一个（下 n 个）元素；
- **条件运算**：例如若没有则添加等；

### ⭐⭐⭐ ConcurrentHashMap

> 请描述 ConcurrentHashMap 的实现原理？
>
> ConcurrentHashMap 为什么放弃了分段锁？

基础数据结构原理和 `HashMap` 一样，JDK 1.7 采用 数组＋单链表；JDK 1.8 采用数组＋单链表＋红黑树。

并发安全特性的实现：

JDK 1.7：

- 使用分段锁，设计思路是缩小锁粒度，提高并发吞吐。也就是将内部进行分段（Segment），里面则是 HashEntry 的数组，和 HashMap 类似，哈希相同的条目也是以链表形式存放。
- 写数据时，会使用可重入锁去锁住分段（segment）：HashEntry 内部使用 volatile 的 value 字段来保证可见性，也利用了不可变对象的机制以改进利用 Unsafe 提供的底层能力，比如 volatile access，去直接完成部分操作，以最优化性能，毕竟 Unsafe 中的很多操作都是 JVM intrinsic 优化过的。

JDK 1.8：

- 取消分段锁，直接采用 `transient volatile HashEntry<K,V>[] table` 保存数据，采用 table 数组元素作为锁，从而实现了对每一行数据进行加锁，进一步减少并发冲突的概率。
- 写数据时，使用是 CAS + `synchronized`。
  - 根据 key 计算出 hashcode 。
  - 判断是否需要进行初始化。
  - `f` 即为当前 key 定位出的 Node，如果为空表示当前位置可以写入数据，利用 CAS 尝试写入，失败则自旋保证成功。
  - 如果当前位置的 `hashcode == MOVED == -1`, 则需要进行扩容。
  - 如果都不满足，则利用 synchronized 锁写入数据。
  - 如果数量大于 `TREEIFY_THRESHOLD` 则要转换为红黑树。
