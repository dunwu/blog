---
title: 《极客时间教程 - Java 并发编程实战》笔记一
date: 2024-08-26 14:36:05
categories:
  - 笔记
  - Java
tags:
  - Java
  - 并发
permalink: /pages/fea959b2/
---

# 《极客时间教程 - Java 并发编程实战》笔记一

## 学习攻略 如何才能学好并发编程？

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261435639.png)

## 开篇词 你为什么需要学习并发编程？

**并发编程可以总结为三个核心问题：分工、同步、互斥。**

- **分工**指的是如何高效地拆解任务并分配给线程。
- **同步**指的是线程之间如何协作。
- **互斥**则是保证同一时刻只允许一个线程访问共享资源。

## 可见性、原子性和有序性问题：并发编程 Bug 的源头

CPU、内存、I/O 设备三者的速度存在很大差异。为了合理利用 CPU 的高性能，平衡这三者的速度差异，计算机体系结构、操作系统、编译程序都做出了贡献，主要体现为：

1. CPU 增加了缓存，以均衡与内存的速度差异；
2. 操作系统增加了进程、线程，以分时复用 CPU，进而均衡 CPU 与 I/O 设备的速度差异；
3. 编译程序优化指令执行次序，使得缓存能够得到更加合理地利用。

**缓存**导致的可见性问题，**线程切换**带来的原子性问题，**编译优化**带来的有序性问题。

### 缓存导致的可见性问题

一个线程对共享变量的修改，另外一个线程能够立刻看到，我们称为**可见性**。

对于**单核**，所有的线程都是在一个 CPU 上执行，操作同一个 CPU 的缓存；一个线程对缓存的写，对另外一个线程来说一定是可见的。

例如在下面的图中，线程 A 和线程 B 都是操作同一个 CPU 里面的缓存，所以线程 A 更新了变量 V 的值，那么线程 B 之后再访问变量 V，得到的一定是 V 的最新值（线程 A 写过的值）。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261442765.png)

对于**多核**，当多个线程在不同的 CPU 上执行时，这些线程操作的是不同的 CPU 缓存。这时两个线程对于变量的操作就不具备可见性了。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261444744.png)

【示例】计数器的并发安全问题示例

```java
public class Test {
  private long count = 0;
  private void add10K() {
    int idx = 0;1.
    while(idx++ < 10000) {
      count += 1;
    }
  }
  public static long calc() {
    final Test test = new Test();
    // 创建两个线程，执行 add() 操作
    Thread th1 = new Thread(()->{
      test.add10K();
    });
    Thread th2 = new Thread(()->{
      test.add10K();
    });
    // 启动两个线程
    th1.start();
    th2.start();
    // 等待两个线程执行结束
    th1.join();
    th2.join();
    return count;
  }
}
```

这段程序的目的是将 count 变量累加导 10000，两个线程执行，则应该累加到 20000，但实际结果总是会小于 20000。

### 线程切换带来的原子性问题

操作系统允许某个进程执行一小段时间，例如 50 毫秒，过了 50 毫秒操作系统就会重新选择一个进程来执行（我们称为“任务切换”），这个 50 毫秒称为“**时间片**”。现代的操作系统都基于更轻量的线程来调度，现在我们提到的“任务切换”都是指“线程切换”。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261450096.png)

Java 的并发也是基于任务切换。Java 中，即使是一条语句，也可能需要执行多条 CPU 指令。**一个或者多个操作在 CPU 执行的过程中不被中断的特性称为原子性**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292035170.png)

### 编译优化带来的有序性问题

有序性指的是程序按照代码的先后顺序执行。编译器为了优化性能，有时候会改变程序中语句的先后顺序。

【示例】双重检查创建单例对象

```java
public class Singleton {
  static Singleton instance;
  static Singleton getInstance(){
    if (instance == null) {
      synchronized(Singleton.class) {
        if (instance == null)
          instance = new Singleton();
        }
    }
    return instance;
  }
}
```

我们以为的 new 操作应该是：

1. 分配一块内存 M；
2. 在内存 M 上初始化 Singleton 对象；
3. 然后 M 的地址赋值给 instance 变量。

但是实际上优化后的执行路径却是这样的：

1. 分配一块内存 M；
2. 将 M 的地址赋值给 instance 变量；
3. 最后在内存 M 上初始化 Singleton 对象。

优化后会导致什么问题呢？我们假设线程 A 先执行 getInstance() 方法，当执行完指令 2 时恰好发生了线程切换，切换到了线程 B 上；如果此时线程 B 也执行 getInstance() 方法，那么线程 B 在执行第一个判断时会发现 `instance != null` ，所以直接返回 instance，而此时的 instance 是没有初始化过的，如果我们这个时候访问 instance 的成员变量就可能触发空指针异常。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261457434.png)

## Java 内存模型：看 Java 如何解决可见性和有序性问题

导致可见性的原因是缓存，导致有序性的原因是编译优化，那解决可见性、有序性最直接的办法就是**禁用缓存和编译优化**，但这种方案性能堪忧。

合理的方案应该是**按需禁用缓存以及编译优化**。Java 内存模型规范了 JVM 如何提供按需禁用缓存和编译优化的方法。具体来说，这些方法包括 **volatile**、**synchronized** 和 **final** 三个关键字，以及六项 **Happens-Before 规则**。

### Happens-Before 规则

- **程序次序规则** - 在一个线程中，按照程序顺序，前面的操作 Happens-Before 于后续的任意操作。
- **锁定规则** - 一个 `unLock` 操作 Happens-Before 于后面对同一个锁的 `lock` 操作。
- **volatile 变量规则** - 对一个 `volatile` 变量的写操作 Happens-Before 于后面对这个变量的读操作。
- **线程启动规则** - `Thread` 对象的 `start()` 方法 Happens-Before 于此线程的每个一个动作。
- **线程终止规则** - 线程中所有的操作都 Happens-Before 于线程的终止检测，我们可以通过 `Thread.join()` 方法是否结束、`Thread.isAlive()` 的返回值手段检测到线程已经终止执行。
- **线程中断规则** - 对线程 `interrupt()` 方法的调用 Happens-Before 于被中断线程的代码检测到中断事件的发生，可以通过 `Thread.interrupted()` 方法检测到是否有中断发生。
- **对象终结规则** - 一个对象的初始化完成 Happens-Before 于它的 `finalize()` 方法的开始。
- **传递性** - 如果 A Happens-Before B，且 B Happens-Before C，那么 A Happens-Before C。

## 互斥锁（上）：解决原子性问题

并发原子性问题的源头是**线程切换**。

解决这个问题的直接方法就是禁止线程切换。操作系统做线程切换是依赖 CPU 中断的，所以禁止 CPU 发生中断就能够禁止线程切换。这个方案对于单核场景是可行的，但不适用于多核场景。

举例来说，long 型变量是 64 位，在 32 位 CPU 上执行写操作会被拆分成两次写操作（写高 32 位和写低 32 位，如下图所示）。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261524478.png)

在多核场景下，同一时刻，有可能有两个线程同时在执行，一个线程执行在 CPU-1 上，一个线程执行在 CPU-2 上，此时禁止 CPU 中断，只能保证 CPU 上的线程连续执行，并不能保证同一时刻只有一个线程执行，如果这两个线程同时写 long 型变量高 32 位的话，那就有可能出现我们开头提及的诡异 Bug 了。

“**同一时刻只有一个线程执行**”称之为**互斥**。如果能够保证对共享变量的修改是互斥的，那么，无论是单核 CPU 还是多核 CPU，就都能保证原子性了。

### 简易锁模型

一段需要互斥执行的代码称为**临界区**。线程在进入临界区之前，首先尝试加锁 lock()，如果成功，则进入临界区，此时称这个线程持有锁；否则就等待，直到持有锁的线程解锁；持有锁的线程执行完临界区的代码后，执行解锁 unlock()。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292036259.png)

### 改进后的锁模型

首先，我们要把临界区要保护的资源标注出来，如图中临界区里增加了一个元素：受保护的资源 R；其次，我们要保护资源 R 就得为它创建一把锁 LR；最后，针对这把锁 LR，我们还需在进出临界区时添上加锁操作和解锁操作。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292036343.png)

### Java 语言提供的锁技术：synchronized

Java 中，synchronized 是一种锁的实现方式。

【示例】synchronized 使用示例

```java
class X {
  // 修饰非静态方法
  synchronized void foo() {
    // 临界区
  }
  // 修饰静态方法
  synchronized static void bar() {
    // 临界区
  }
  // 修饰代码块
  Object obj = new Object()；
  void baz() {
    synchronized(obj) {
      // 临界区
    }
  }
}
```

**可以用一把锁来保护多个资源，但是不能用多把锁来保护一个资源**。

### 用 synchronized 解决 count+=1 问题

【示例】synchronized 实现并发安全的计数器

```java
class SafeCalc {
  long value = 0L;
  synchronized long get() {
    return value;
  }
  synchronized void addOne() {
    value += 1;
  }
}
```

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261541380.png)

### 锁和受保护资源的关系

**受保护资源和锁之间的关联关系是 N:1 的关系**。

【示例】synchronized 实现并发安全的计数器错误示例

```java
class SafeCalc {
  static long value = 0L;
  synchronized long get() {
    return value;
  }
  synchronized static void addOne() {
    value += 1;
  }
}
```

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261545832.png)

【示例】synchronized 实现并发安全的计数器错误示例

```java
class SafeCalc {
  long value = 0L;
  long get() {
    synchronized (new Object()) {
      return value;
    }
  }
  void addOne() {
    synchronized (new Object()) {
      value += 1;
    }
  }
}
```

上面的例子中，加锁本质就是在锁对象的对象头中写入当前线程 id，但是 new object 每次在内存中都是新对象，所以加锁无效。

## 互斥锁（下）：如何用一把锁保护多个资源？

### 保护没有关联关系的多个资源

**用不同的锁对受保护资源进行精细化管理，能够提升性能**。这种锁还有个名字，叫**细粒度锁**。

【示例】账户类 Account 有两个成员变量，分别是账户余额 balance 和账户密码 password。取款 withdraw() 和查看余额 getBalance() 操作会访问账户余额 balance，创建一个 final 对象 balLock 作为锁（类比球赛门票）；而更改密码 updatePassword() 和查看密码 getPassword() 操作会修改账户密码 password，创建一个 final 对象 pwLock 作为锁（类比电影票）。不同的资源用不同的锁保护，各自管各自的。

```java
class Account {
  // 锁：保护账户余额
  private final Object balLock
    = new Object();
  // 账户余额
  private Integer balance;
  // 锁：保护账户密码
  private final Object pwLock
    = new Object();
  // 账户密码
  private String password;

  // 取款
  void withdraw(Integer amt) {
    synchronized(balLock) {
      if (this.balance > amt){
        this.balance -= amt;
      }
    }
  }
  // 查看余额
  Integer getBalance() {
    synchronized(balLock) {
      return balance;
    }
  }

  // 更改密码
  void updatePassword(String pw){
    synchronized(pwLock) {
      this.password = pw;
    }
  }
  // 查看密码
  String getPassword() {
    synchronized(pwLock) {
      return password;
    }
  }
}
```

> 思考：如果账户余额用 this.balance 作为互斥锁，账户密码用 this.password 作为互斥锁，你觉得是否可以呢？
>
> 答：不能用可变对象做锁。

### 保护有关联关系的多个资源

【示例】保护临界区多个资源的错误示例

```java
class Account {
  private int balance;
  // 转账
  synchronized void transfer(
      Account target, int amt){
    if (this.balance > amt) {
      this.balance -= amt;
      target.balance += amt;
    }
  }
}
```

synchronized 可以保护 this 对象持有的资源，但不能保护 target 对象持有的资源。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261603806.png)

### 使用锁的正确姿势

```java
class Account {
  private Object lock；
  private int balance;
  private Account();
  // 创建 Account 时传入同一个 lock 对象
  public Account(Object lock) {
    this.lock = lock;
  }
  // 转账
  void transfer(Account target, int amt){
    // 此处检查所有对象共享的锁
    synchronized(lock) {
      if (this.balance > amt) {
        this.balance -= amt;
        target.balance += amt;
      }
    }
  }
}
```

上面代码思路正确，但存在一个问题：如果创建 Account 对象时，传入的 lock 不是同一个对象，就会出现锁自家门来保护他家资产的荒唐事。

因此，可以优化为使用 Class 对象（Account.class）作为共享的锁。Account.class 是所有 Account 对象共享的，而且这个对象是 Java 虚拟机在加载 Account 类的时候创建的，所以不用担心它的唯一性。

```java
class Account {
  private int balance;
  // 转账
  void transfer(Account target, int amt){
    synchronized(Account.class) {
      if (this.balance > amt) {
        this.balance -= amt;
        target.balance += amt;
      }
    }
  }
}
```

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261610209.png)

## 一不小心就死锁了，怎么办？

**死锁**：**一组互相竞争资源的线程因互相等待，导致“永久”阻塞的现象**。

【示例】存在死锁的示例

```java
class Account {
  private int balance;
  // 转账
  void transfer(Account target, int amt){
    // 锁定转出账户
    synchronized(this) {
      // 锁定转入账户
      synchronized(target) {
        if (this.balance > amt) {
          this.balance -= amt;
          target.balance += amt;
        }
      }
    }
  }
}
```

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261612406.png)

### 如何预防死锁

只有以下这四个条件都发生时才会出现死锁：

- **互斥**，共享资源 X 和 Y 只能被一个线程占用；
- **占有且等待**，线程 T1 已经取得共享资源 X，在等待共享资源 Y 的时候，不释放共享资源 X；
- **不可抢占**，其他线程不能强行抢占线程 T1 占有的资源；
- **循环等待**，线程 T1 等待线程 T2 占有的资源，线程 T2 等待线程 T1 占有的资源，就是循环等待。

**也就是说只要我们破坏其中一个，就可以成功避免死锁的发生**。

其中，互斥这个条件我们没有办法破坏，因为我们用锁为的就是互斥。不过其他三个条件都是有办法破坏掉的，到底如何做呢？

1. 对于“**占用且等待**”，可以一次性申请所有的资源，这样就不存在等待了。
2. 对于“**不可抢占**”，占用部分资源的线程进一步申请其他资源时，如果申请不到，可以主动释放它占有的资源，这样不可抢占这个条件就破坏掉了。
3. 对于“**循环等待**”，可以靠按序申请资源来预防。所谓按序申请，是指资源是有线性顺序的，申请的时候可以先申请资源序号小的，再申请资源序号大的，这样线性化后自然就不存在循环了。

#### 破坏占用且等待条件

通过一个 Allocator 来管理临界区。当账户 Account 在执行转账操作的时候，首先向 Allocator 同时申请转出账户和转入账户这两个资源，成功后再锁定这两个资源；当转账操作执行完，释放锁之后，需通知 Allocator 同时释放转出账户和转入账户这两个资源。

```java
class Allocator {
  private List<Object> als =
    new ArrayList<>();
  // 一次性申请所有资源
  synchronized boolean apply(
    Object from, Object to){
    if(als.contains(from) ||
         als.contains(to)){
      return false;
    } else {
      als.add(from);
      als.add(to);
    }
    return true;
  }
  // 归还资源
  synchronized void free(
    Object from, Object to){
    als.remove(from);
    als.remove(to);
  }
}

class Account {
  // actr 应该为单例
  private Allocator actr;
  private int balance;
  // 转账
  void transfer(Account target, int amt){
    // 一次性申请转出账户和转入账户，直到成功
    while(!actr.apply(this, target))
      ；
    try{
      // 锁定转出账户
      synchronized(this){
        // 锁定转入账户
        synchronized(target){
          if (this.balance > amt){
            this.balance -= amt;
            target.balance += amt;
          }
        }
      }
    } finally {
      actr.free(this, target)
    }
  }
}
```

上面的核心代码如下

```java
// 一次性申请转出账户和转入账户，直到成功
while(!actr.apply(this, target))
  ；
```

如果 apply() 操作耗时非常短，而且并发冲突量也不大时，这个方案还挺不错的。但如果 apply() 操作耗时长，或者并发冲突量大的时候，可能遥循环大量次数才能获得锁，太消耗 CPU 了。

在这种场景下，更好的方案应该是：如果线程要求的条件（转出账本和转入账本同在文件架上）不满足，则线程阻塞自己，进入**等待**状态；当线程要求的条件（转出账本和转入账本同在文件架上）满足后，**通知**等待的线程重新执行。其中，使用线程阻塞的方式就能避免循环等待消耗 CPU 的问题。

#### 破坏不可抢占条件

核心是要能够主动释放它占有的资源。

synchronized 做不到这点，但是可以通过 Lock 来解决此类问题。

#### 破坏循环等待条件

破坏这个条件，需要对资源进行排序，然后按序申请资源。

假设每个账户都有不同的属性 id，这个 id 可以作为排序字段，申请的时候，我们可以按照从小到大的顺序来申请。比如下面代码中，①~⑥处的代码对转出账户（this）和转入账户（target）排序，然后按照序号从小到大的顺序锁定账户。这样就不存在“循环”等待了。

```java
class Account {
  private int id;
  private int balance;
  // 转账
  void transfer(Account target, int amt){
    Account left = this        ①
    Account right = target;    ②
    if (this.id > target.id) { ③
      left = target;           ④
      right = this;            ⑤
    }                          ⑥
    // 锁定序号小的账户
    synchronized(left){
      // 锁定序号大的账户
      synchronized(right){
        if (this.balance > amt){
          this.balance -= amt;
          target.balance += amt;
        }
      }
    }
  }
}
```

## 用“等待-通知”机制优化循环等待

### 用 synchronized 实现等待-通知机制

在 Java 中，等待-通知机制有多种实现方式，比如 Java 语言内置的 synchronized 配合 wait()、notify()、notifyAll() 这三个方法就能轻松实现。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292037649.png)

wait()、notify()、notifyAll() 方法操作的等待队列是互斥锁的等待队列，所以如果 synchronized 锁定的是 this，那么对应的一定是 this.wait()、this.notify()、this.notifyAll()；如果 synchronized 锁定的是 target，那么对应的一定是 target.wait()、target.notify()、target.notifyAll() 。而且 wait()、notify()、notifyAll() 这三个方法能够被调用的前提是已经获取了相应的互斥锁，所以我们会发现 wait()、notify()、notifyAll() 都是在 synchronized{}内部被调用的。如果在 synchronized{}外部调用，或者锁定的 this，而用 target.wait() 调用的话，JVM 会抛出一个运行时异常：`java.lang.IllegalMonitorStateException`。

### 小试牛刀：一个更好地资源分配器

等待-通知机制中，需要考虑以下四个要素。

1. 互斥锁：可以用 this 作为互斥锁。
2. 线程要求的条件：转出账户和转入账户都没有被分配过。
3. 何时等待：线程要求的条件不满足就等待。
4. 何时通知：当有线程释放账户时就通知。

```java
class Allocator {
  private List<Object> als;
  // 一次性申请所有资源
  synchronized void apply(Object from, Object to){
    // 经典写法
    while(als.contains(from) ||
         als.contains(to)){
      try{
        wait();
      }catch(Exception e){
      }
    }
    als.add(from);
    als.add(to);
  }
  // 归还资源
  synchronized void free(Object from, Object to){
    als.remove(from);
    als.remove(to);
    notifyAll();
  }
}
```

### 尽量使用 notifyAll()

**notify() 是会随机地通知等待队列中的一个线程，而 notifyAll() 会通知等待队列中的所有线程**。从感觉上来讲，应该是 notify() 更好一些，因为即便通知所有线程，也只有一个线程能够进入临界区。但那所谓的感觉往往都蕴藏着风险，实际上使用 notify() 也很有风险，它的风险在于可能导致某些线程永远不会被通知到。

## 安全性、活跃性以及性能问题

并发编程中，需要注意三类问题：**安全性问题、活跃性问题和性能问题**。

### 安全性问题

并发安全/线程安全的本质就是正确性，即程序按照预期执行。

并发安全问题的三个主要源头是：原子性、可见性、有序性。通俗的说，多线程同时读写共享变量。

对于非共享变量（ThreadLocal）或常量（final），不存在并发安全问题。

对于共享变量，在并发环境下，存在竞态条件。

- **竞态条件（Race Condition）**：程序的执行结果依赖多线程执行的顺序。
- **临界区（Critical Sections）**：导致竞态条件发生的代码区称作临界区。

对于这种情况，解决方案就是互斥（锁）。

### 活跃性问题

活跃性问题主要分为：

- **死锁**
- **活锁** - **有时线程虽然没有发生阻塞，但仍然会存在执行不下去的情况**。解决方案：尝试等待一个随机的时间。
- **饥饿** - **线程因无法访问所需资源而无法执行下去的情况**。解决方案：
  1. 保证资源充足；
  2. 公平地分配资源；
  3. 避免持有锁的线程长时间执行。

### 性能问题

三个核心性能指标：

1. **吞吐量**：指的是单位时间内能处理的请求数量。吞吐量越高，说明性能越好。
2. **延迟**：指的是从发出请求到收到响应的时间。延迟越小，说明性能越好。
3. **并发量**：指的是能同时处理的请求数量，一般来说随着并发量的增加、延迟也会增加。所以延迟这个指标，一般都会是基于并发量来说的。例如并发量是 1000 的时候，延迟是 50 毫秒。

由互斥而产生的阻塞会影响性能。要提升性能有以下思路：

- **无锁化** - 相关的技术有：ThreadLocal、写入时复制 (Copy-on-write)、乐观锁、原子类、Disruptor
- **减少锁持有的时间** - 互斥锁本质上是将并行的程序串行化，所以要增加并行度，一定要减少持有锁的时间。相关的技术有：细粒度锁（ConcurrentHashMap 中的分段锁技术）；读写锁。

## 管程：并发编程的万能钥匙

### 什么是管程

synchronized 关键字及 wait()、notify()、notifyAll() 这三个方法都是管程的组成部分。而**管程和信号量是等价的，所谓等价指的是用管程能够实现信号量，也能用信号量实现管程**。但是管程更容易使用，所以 Java 选择了管程。

管程，对应的英文是 Monitor，很多 Java 领域的同学都喜欢将其翻译成“监视器”，这是直译。操作系统领域一般都翻译成“管程”。

所谓**管程，指的是管理共享变量以及对共享变量的操作过程，让他们支持并发**。翻译为 Java 领域的语言，就是管理类的成员变量和成员方法，让这个类是线程安全的。

### MESA 模型

Java 参考了 MESA 模型，语言内置的管程（synchronized）对 MESA 模型进行了精简。MESA 模型中，条件变量可以有多个，Java 语言内置的管程里只有一个条件变量。

并发领域两大核心问题，管程都是能够解决的。

一个是**互斥**，即同一时刻只允许一个线程访问共享资源；

一个是**同步**，即线程之间如何通信、协作。

管程是如何解决**互斥**问题的：

将共享变量及其对共享变量的操作统一封装起来。在下图中，管程 X 将共享变量 queue 这个队列和相关的操作入队 enq()、出队 deq() 都封装起来了；线程 A 和线程 B 如果想访问共享变量 queue，只能通过调用管程提供的 enq()、deq() 方法来实现；enq()、deq() 保证互斥性，只允许一个线程进入管程。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408261940150.png)

管程是如何解决线程间的**同步**问题的：

在管程模型里，共享变量和对共享变量的操作是被封装起来的，图中最外层的框就代表封装的意思。框的上面只有一个入口，并且在入口旁边还有一个入口等待队列。当多个线程同时试图进入管程内部时，只允许一个线程进入，其他线程则在入口等待队列中等待。管程里还引入了条件变量的概念，而且**每个条件变量都对应有一个等待队列**，如下图，条件变量 A 和条件变量 B 分别都有自己的等待队列。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408270725745.png)

## Java 线程（上）：Java 线程的生命周期

### 通用的线程生命周期

通用的线程生命周期：**初始状态、可运行状态、运行状态、休眠状态**和**终止状态**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408270729535.png)

### Java 中线程的生命周期

Java 中线程共有六种状态：

1. NEW（初始化状态）
2. RUNNABLE（可运行 / 运行状态）
3. BLOCKED（阻塞状态）
4. WAITING（无时限等待）
5. TIMED_WAITING（有时限等待）
6. TERMINATED（终止状态）

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408270731084.png)

## Java 线程（中）：创建多少线程才是合适的？

### 为什么要使用多线程？

度量性能的核心指标：

- **延迟** - 延迟指的是发出请求到收到响应这个过程的时间；延迟越短，意味着程序执行得越快，性能也就越好。
- **吞吐量** - 吞吐量指的是在单位时间内能处理请求的数量；吞吐量越大，意味着程序能处理的请求越多，性能也就越好。

### 多线程的应用场景有哪些？

**降低延迟，提高吞吐量**，有两个方向：一个方向是**优化算法**，另一个方向是**将硬件的性能发挥到极致**。计算机主要有哪些硬件呢？主要是两类：一个是 I/O，一个是 CPU。简言之，**在并发编程领域，提升性能本质上就是提升硬件的利用率，再具体点来说，就是提升 I/O 的利用率和 CPU 的利用率**。

### 创建多少线程合适？

创建多少线程合适，要看多线程具体的应用场景。

程序一般都是 CPU 计算和 I/O 操作交叉执行的。I/O 操作执行时间长的，称为 I/O 密集型计算；CPU 操作执行时间长的，称为 CPU 密集型计算。

**对于 CPU 密集型的计算场景，理论上“线程的数量 =CPU 核数”就是最合适的**。不过在工程上，**线程的数量一般会设置为“CPU 核数 +1”**，这样的话，当线程因为偶尔的内存页失效或其他原因导致阻塞时，这个额外的线程可以顶上，从而保证 CPU 的利用率。

对于 I/O 密集型计算场景，最佳的线程数是与程序中 CPU 计算和 I/O 操作的耗时比相关的，我们可以总结出这样一个公式：

> 最佳线程数 =CPU 核数 \* [ 1 +（I/O 耗时 / CPU 耗时）]

## Java 线程（下）：为什么局部变量是线程安全的？

### 方法是如何被执行的

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408270751420.png)“CPU 去哪里找到调用方法的参数和返回地址？

**通过 CPU 的堆栈寄存器**。CPU 支持一种栈结构，先入后出。因为这个栈是和方法调用相关的，因此经常被称为**调用栈**。

例如，有三个方法 A、B、C，他们的调用关系是 A->B->C（A 调用 B，B 调用 C），在运行时，会构建出下面这样的调用栈。每个方法在调用栈里都有自己的独立空间，称为**栈帧**，每个栈帧里都有对应方法需要的参数和返回地址。当调用方法时，会创建新的栈帧，并压入调用栈；当方法返回时，对应的栈帧就会被自动弹出。也就是说，**栈帧和方法是同生共死的**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408270753265.png)

### 局部变量存哪里？

局部变量的作用域是方法内部，也就是说当方法执行完，局部变量就没用了，局部变量应该和方法同生共死。此时你应该会想到调用栈的栈帧，调用栈的栈帧就是和方法同生共死的，所以局部变量放到调用栈里那儿是相当的合理。事实上，的确是这样的，**局部变量就是放到了调用栈里**。于是调用栈的结构就变成了下图这样。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408270755942.png)

### 调用栈与线程

那调用栈和线程之间是什么关系呢？

答案是：**每个线程都有自己独立的调用栈**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408270756092.png)

因为每个线程都有自己的调用栈，局部变量保存在线程各自的调用栈里面，不会共享，所以自然也就没有并发问题。再次重申一遍：没有共享，就没有伤害。

### 线程封闭

方法里的局部变量，因为不会和其他线程共享，所以没有并发问题，这个思路很好，已经成为解决并发问题的一个重要技术，同时还有个响当当的名字叫做**线程封闭**，比较官方的解释是：**仅在单线程内访问数据**。由于不存在共享，所以即便不同步也不会有并发问题，性能杠杠的。

采用线程封闭技术的案例非常多，例如从数据库连接池里获取的连接 Connection

## 如何用面向对象思想写好并发程序？

### 一、封装共享变量

**将共享变量作为对象属性封装在内部，对所有公共方法制定并发访问策略**。

**对于这些不会发生变化的共享变量，建议你用 final 关键字来修饰**。

### 二、识别共享变量间的约束条件

识别共享变量间的约束条件非常重要。因为**这些约束条件，决定了并发访问策略**。

共享变量之间的约束条件，反映在代码里，基本上都会有 if 语句，所以，一定要特别注意竞态条件。

### 三、制定并发访问策略

并发访问策略方案：

1. 避免共享：避免共享的技术主要是利于线程本地存储以及为每个任务分配独立的线程。
2. 不变模式：这个在 Java 领域应用的很少，但在其他领域却有着广泛的应用，例如 Actor 模式、CSP 模式以及函数式编程的基础都是不变模式。
3. 管程及其他同步工具：Java 领域万能的解决方案是管程，但是对于很多特定场景，使用 Java 并发包提供的读写锁、并发容器等同步工具会更好。

## 理论基础模块热点问题答疑

起源是一个硬件的核心矛盾：CPU 与内存、I/O 的速度差异，系统软件（操作系统、编译器）在解决这个核心矛盾的同时，引入了可见性、原子性和有序性问题，这三个问题就是很多并发程序的 Bug 之源。

如何解决这三个问题呢？Java 中提供了 Java 内存模型，以应对可见性和有序性问题；提供了互斥锁，以应对原子性问题。

互斥锁是解决并发问题的核心工具，但它也可能会带来死锁问题。

管程，是 Java 并发编程技术的基础，是解决并发问题的万能钥匙。并发编程里两大核心问题——互斥和同步，都是可以由管程来解决的。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408270805546.png)

## 参考资料

- [极客时间教程 - Java 并发编程实战](https://time.geekbang.org/column/intro/100023901)