---
title: 《极客时间教程 - Java 并发编程实战》笔记二
date: 2024-08-26 14:36:05
categories:
  - 笔记
  - Java
tags:
  - Java
  - 并发
permalink: /pages/24d815a8/
---

# 《极客时间教程 - Java 并发编程实战》笔记二

## Lock 和 Condition（上）：隐藏在并发包中的管程

### 再造管程的理由

已有 synchronized，还支持 Lock 的原因是，需要一把锁支持：

1. **能够响应中断**。synchronized 的问题是，持有锁 A 后，如果尝试获取锁 B 失败，那么线程就进入阻塞状态，一旦发生死锁，就没有任何机会来唤醒阻塞的线程。但如果阻塞状态的线程能够响应中断信号，也就是说当我们给阻塞的线程发送中断信号的时候，能够唤醒它，那它就有机会释放曾经持有的锁 A。这样就破坏了不可抢占条件了。
2. **支持超时**。如果线程在一段时间之内没有获取到锁，不是进入阻塞状态，而是返回一个错误，那这个线程也有机会释放曾经持有的锁。这样也能破坏不可抢占条件。
3. **非阻塞地获取锁**。如果尝试获取锁失败，并不进入阻塞状态，而是直接返回，那这个线程也有机会释放曾经持有的锁。这样也能破坏不可抢占条件。

```java
// 支持中断的 API
void lockInterruptibly()
  throws InterruptedException;
// 支持超时的 API
boolean tryLock(long time, TimeUnit unit)
  throws InterruptedException;
// 支持非阻塞获取锁的 API
boolean tryLock();
```

### 如何保证可见性

以 ReentrantLock 为例，内部持有一个 volatile 的成员变量 state，获取锁的时候，会读写 state 的值；解锁的时候，也会读写 state 的值。由 volatile 保证变量的可见性。

### 什么是可重入锁

**所谓可重入锁，指的是线程可以重复获取同一把锁**。

### 公平锁与非公平锁

ReentrantLock 中实现了公平锁和非公平锁。

```java
//无参构造函数：默认非公平锁
public ReentrantLock() {
    sync = new NonfairSync();
}
//根据公平策略参数创建锁
public ReentrantLock(boolean fair){F
    sync = fair ? new FairSync()
                : new NonfairSync();
}
```

锁都对应着一个等待队列，如果一个线程没有获得锁，就会进入等待队列，当有线程释放锁的时候，就需要从等待队列中唤醒一个等待的线程。如果是公平锁，唤醒的策略就是谁等待的时间长，就唤醒谁，很公平；如果是非公平锁，则不提供这个公平保证，有可能等待时间短的线程反而先被唤醒。

### 用锁的最佳实践

1. 永远只在更新对象的成员变量时加锁
2. 永远只在访问可变的成员变量时加锁
3. 永远不在调用其他对象的方法时加锁

## Lock 和 Condition（下）：Dubbo 如何用管程实现异步转同步？

**Condition 实现了管程模型里面的条件变量**。

**如何利用两个条件变量快速实现阻塞队列呢？**

一个阻塞队列，需要两个条件变量，一个是队列不空（空队列不允许出队），另一个是队列不满（队列已满不允许入队）

```java
public class BlockedQueue<T>{
  final Lock lock = new ReentrantLock();
  // 条件变量：队列不满
  final Condition notFull = lock.newCondition();
  // 条件变量：队列不空
  final Condition notEmpty = lock.newCondition();

  // 入队
  void enq(T x) {
    lock.lock();
    try {
      while （队列已满）{
        // 等待队列不满
        notFull.await();
      }
      // 省略入队操作。..
      // 入队后，通知可出队
      notEmpty.signal();
    }finally {
      lock.unlock();
    }
  }
  // 出队
  void deq(){
    lock.lock();
    try {
      while （队列已空）{
        // 等待队列不空
        notEmpty.await();
      }
      // 省略出队操作。..
      // 出队后，通知可入队
      notFull.signal();
    }finally {
      lock.unlock();
    }
  }
}
```

Lock 和 Condition 实现的管程，**线程等待和通知需要调用 await()、signal()、signalAll()**，它们的语义和 wait()、notify()、notifyAll() 是相同的。

### 同步与异步

同步和异步的区别：**调用方是否需要等待结果，如果需要等待结果，就是同步；如果不需要等待结果，就是异步**。

### Dubbo 源码分析

RPC 调用，**在 TCP 协议层面，发送完 RPC 请求后，线程是不会等待 RPC 的响应结果的**。

Dubbo 调用关键代码：

```java
public class DubboInvoker{
  Result doInvoke(Invocation inv){
    // 下面这行就是源码中 108 行
    // 为了便于展示，做了修改
    return currentClient
      .request(inv, timeout)
      .get();
  }
}
```

当 RPC 返回结果之前，阻塞调用线程，让调用线程等待；当 RPC 返回结果后，唤醒调用线程，让调用线程重新执行。

```java
// 创建锁与条件变量
private final Lock lock = new ReentrantLock();
private final Condition done = lock.newCondition();

// 调用方通过该方法等待结果
Object get(int timeout){
  long start = System.nanoTime();
  lock.lock();
  try {
	while (!isDone()) {
	  done.await(timeout);
      long cur=System.nanoTime();
	  if (isDone() ||
          cur-start > timeout){
	    break;
	  }
	}
  } finally {
	lock.unlock();
  }
  if (!isDone()) {
	throw new TimeoutException();
  }
  return returnFromResponse();
}
// RPC 结果是否已经返回
boolean isDone() {
  return response != null;
}
// RPC 结果返回时调用该方法
private void doReceived(Response res) {
  lock.lock();
  try {
    response = res;
    if (done != null) {
      done.signal();
    }
  } finally {
    lock.unlock();
  }
}
```

## Semaphore：如何快速实现一个限流器？

### 信号量模型

信号量模型还是很简单的，可以简单概括为：**一个计数器，一个等待队列，三个方法**。在信号量模型里，计数器和等待队列对外是透明的，所以只能通过信号量模型提供的三个方法来访问它们，这三个方法分别是：init()、down() 和 up()。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408280813940.png)

```java
class Semaphore{
  // 计数器
  int count;
  // 等待队列
  Queue queue;
  // 初始化操作
  Semaphore(int c){
    this.count=c;
  }
  //
  void down(){
    this.count--;
    if(this.count<0){
      // 将当前线程插入等待队列
      // 阻塞当前线程
    }
  }
  void up(){
    this.count++;
    if(this.count<=0) {
      // 移除等待队列中的某个线程 T
      // 唤醒线程 T
    }
  }
}
```

号量模型里面，down()、up() 这两个操作历史上最早称为 P 操作和 V 操作，所以信号量模型也被称为 PV 原语。在 Java SDK 并发包里，down() 和 up() 对应的则是 acquire() 和 release()。

### 如何使用信号量

就像我们用互斥锁一样，只需要在进入临界区之前执行一下 down() 操作，退出临界区之前执行一下 up() 操作就可以了。下面是 Java 代码的示例，acquire() 就是信号量里的 down() 操作，release() 就是信号量里的 up() 操作。

```java
static int count;
// 初始化信号量
static final Semaphore s
    = new Semaphore(1);
// 用信号量保证互斥
static void addOne() {
  s.acquire();
  try {
    count+=1;
  } finally {
    s.release();
  }
}
```

### 快速实现一个限流器

**Semaphore 可以允许多个线程访问一个临界区**。

```java
class ObjPool<T, R> {
  final List<T> pool;
  // 用信号量实现限流器
  final Semaphore sem;
  // 构造函数
  ObjPool(int size, T t){
    pool = new Vector<T>(){};
    for(int i=0; i<size; i++){
      pool.add(t);
    }
    sem = new Semaphore(size);
  }
  // 利用对象池的对象，调用 func
  R exec(Function<T,R> func) {
    T t = null;
    sem.acquire();
    try {
      t = pool.remove(0);
      return func.apply(t);
    } finally {
      pool.add(t);
      sem.release();
    }
  }
}
// 创建对象池
ObjPool<Long, String> pool =
  new ObjPool<Long, String>(10, 2);
// 通过对象池获取 t，之后执行
pool.exec(t -> {
    System.out.println(t);
    return t.toString();
});
```

读写锁与互斥锁的一个重要区别就是**读写锁允许多个线程同时读共享变量**，而互斥锁是不允许的，这是读写锁在读多写少场景下性能优于互斥锁的关键。但**读写锁的写操作是互斥的**，当一个线程在写共享变量的时候，是不允许其他线程执行写操作和读操作。

### 快速实现一个缓存

Cache 这个工具类，我们提供了两个方法，一个是读缓存方法 get()，另一个是写缓存方法 put()。读缓存需要用到读锁，读锁的使用和前面我们介绍的 Lock 的使用是相同的，都是 try{}finally{}这个编程范式。写缓存则需要用到写锁，写锁的使用和读锁是类似的。这样看来，读写锁的使用还是非常简单的。

```java
class Cache<K,V> {
  final Map<K, V> m =
    new HashMap<>();
  final ReadWriteLock rwl =
    new ReentrantReadWriteLock();
  // 读锁
  final Lock r = rwl.readLock();
  // 写锁
  final Lock w = rwl.writeLock();
  // 读缓存
  V get(K key) {
    r.lock();
    try { return m.get(key); }
    finally { r.unlock(); }
  }
  // 写缓存
  V put(K key, V value) {
    w.lock();
    try { return m.put(key, v); }
    finally { w.unlock(); }
  }
}
```

### 实现缓存的按需加载

```java
class Cache<K,V> {
  final Map<K, V> m =
    new HashMap<>();
  final ReadWriteLock rwl =
    new ReentrantReadWriteLock();
  final Lock r = rwl.readLock();
  final Lock w = rwl.writeLock();

  V get(K key) {
    V v = null;
    //读缓存
    r.lock();         ①
    try {
      v = m.get(key); ②
    } finally{
      r.unlock();     ③
    }
    //缓存中存在，返回
    if(v != null) {   ④
      return v;
    }
    //缓存中不存在，查询数据库
    w.lock();         ⑤
    try {
      //再次验证
      //其他线程可能已经查询过数据库
      v = m.get(key); ⑥
      if(v == null){  ⑦
        //查询数据库
        v=省略代码无数
        m.put(key, v);
      }
    } finally{
      w.unlock();
    }
    return v;
  }
}
```

## ReadWriteLock：如何快速实现一个完备的缓存？

### 读写锁的升级与降级

```java
//读缓存
r.lock();         ①
try {
  v = m.get(key); ②
  if (v == null) {
    w.lock();
    try {
      //再次验证并更新缓存
      //省略详细代码
    } finally{
      w.unlock();
    }
  }
} finally{
  r.unlock();     ③
}
```

上面的代码，先是获取读锁，然后再升级为写锁，对此还有个专业的名字，叫**锁的升级**。可惜 ReadWriteLock 并不支持这种升级。

不过，虽然锁的升级是不允许的，但是锁的降级却是允许的。

```java
class CachedData {
  Object data;
  volatile boolean cacheValid;
  final ReadWriteLock rwl =
    new ReentrantReadWriteLock();
  // 读锁
  final Lock r = rwl.readLock();
  //写锁
  final Lock w = rwl.writeLock();

  void processCachedData() {
    // 获取读锁
    r.lock();
    if (!cacheValid) {
      // 释放读锁，因为不允许读锁的升级
      r.unlock();
      // 获取写锁
      w.lock();
      try {
        // 再次检查状态
        if (!cacheValid) {
          data = ...
          cacheValid = true;
        }
        // 释放写锁前，降级为读锁
        // 降级是可以的
        r.lock(); ①
      } finally {
        // 释放写锁
        w.unlock();
      }
    }
    // 此处仍然持有读锁
    try {use(data);}
    finally {r.unlock();}
  }
}
```

## StampedLock：有没有比读写锁更快的锁？

### StampedLock 支持的三种锁模式

ReadWriteLock 支持两种模式：一种是读锁，一种是写锁。而 StampedLock 支持三种模式，分别是：**写锁**、**悲观读锁**和**乐观读**。其中，写锁、悲观读锁的语义和 ReadWriteLock 的写锁、读锁的语义非常类似，允许多个线程同时获取悲观读锁，但是只允许一个线程获取写锁，写锁和悲观读锁是互斥的。不同的是：StampedLock 里的写锁和悲观读锁加锁成功之后，都会返回一个 stamp；然后解锁的时候，需要传入这个 stamp。

```java
final StampedLock sl =
  new StampedLock();

// 获取/释放悲观读锁示意代码
long stamp = sl.readLock();
try {
  //省略业务相关代码
} finally {
  sl.unlockRead(stamp);
}

// 获取/释放写锁示意代码
long stamp = sl.writeLock();
try {
  //省略业务相关代码
} finally {
  sl.unlockWrite(stamp);
}
```

StampedLock 的性能之所以比 ReadWriteLock 还要好，其关键是 StampedLock 支持乐观读的方式。ReadWriteLock 支持多个线程同时读，但是当多个线程同时读的时候，所有的写操作会被阻塞；而 StampedLock 提供的乐观读，是允许一个线程获取写锁的，也就是说不是所有的写操作都被阻塞。

在 distanceFromOrigin() 这个方法中，首先通过调用 tryOptimisticRead() 获取了一个 stamp，这里的 tryOptimisticRead() 就是我们前面提到的乐观读。之后将共享变量 x 和 y 读入方法的局部变量中，不过需要注意的是，由于 tryOptimisticRead() 是无锁的，所以共享变量 x 和 y 读入方法局部变量时，x 和 y 有可能被其他线程修改了。因此最后读完之后，还需要再次验证一下是否存在写操作，这个验证操作是通过调用 validate(stamp) 来实现的。

```java
class Point {
  private int x, y;
  final StampedLock sl =
    new StampedLock();
  //计算到原点的距离
  int distanceFromOrigin() {
    // 乐观读
    long stamp =
      sl.tryOptimisticRead();
    // 读入局部变量，
    // 读的过程数据可能被修改
    int curX = x, curY = y;
    //判断执行读操作期间，
    //是否存在写操作，如果存在，
    //则 sl.validate 返回 false
    if (!sl.validate(stamp)){
      // 升级为悲观读锁
      stamp = sl.readLock();
      try {
        curX = x;
        curY = y;
      } finally {
        //释放悲观读锁
        sl.unlockRead(stamp);
      }
    }
    return Math.sqrt(
      curX * curX + curY * curY);
  }
}
```

### 进一步理解乐观读

StampedLock 的乐观读和数据库的乐观锁有异曲同工之妙。

### StampedLock 使用注意事项

对于读多写少的场景 StampedLock 性能很好，简单的应用场景基本上可以替代 ReadWriteLock，但是** StampedLock 的功能仅仅是 ReadWriteLock 的子集**，在使用的时候，还是有几个地方需要注意一下。

StampedLock 在命名上并没有增加 Reentrant，想必你已经猜测到 StampedLock 应该是不可重入的。事实上，的确是这样的，**StampedLock 不支持重入**。这个是在使用中必须要特别注意的。

另外，StampedLock 的悲观读锁、写锁都不支持条件变量，这个也需要你注意。

还有一点需要特别注意，那就是：如果线程阻塞在 StampedLock 的 readLock() 或者 writeLock() 上时，此时调用该阻塞线程的 interrupt() 方法，会导致 CPU 飙升。

```java
final StampedLock lock
  = new StampedLock();
Thread T1 = new Thread(()->{
  // 获取写锁
  lock.writeLock();
  // 永远阻塞在此处，不释放写锁
  LockSupport.park();
});
T1.start();
// 保证 T1 获取写锁
Thread.sleep(100);
Thread T2 = new Thread(()->
  //阻塞在悲观读锁
  lock.readLock()
);
T2.start();
// 保证 T2 阻塞在读锁
Thread.sleep(100);
//中断线程 T2
//会导致线程 T2 所在 CPU 飙升
T2.interrupt();
T2.join();
```

所以，**使用 StampedLock 一定不要调用中断操作，如果需要支持中断功能，一定使用可中断的悲观读锁 readLockInterruptibly() 和写锁 writeLockInterruptibly()**。这个规则一定要记清楚。

## 总结

StampedLock 读模板：

```java
final StampedLock sl =
  new StampedLock();

// 乐观读
long stamp =
  sl.tryOptimisticRead();
// 读入方法局部变量
......
// 校验 stamp
if (!sl.validate(stamp)){
  // 升级为悲观读锁
  stamp = sl.readLock();
  try {
    // 读入方法局部变量
    .....
  } finally {
    //释放悲观读锁
    sl.unlockRead(stamp);
  }
}
//使用方法局部变量执行业务操作
......
```

StampedLock 写模板：

```java
long stamp = sl.writeLock();
try {
  // 写共享变量
  ......
} finally {
  sl.unlockWrite(stamp);
}
```

## CountDownLatch 和 CyclicBarrier：如何让多线程步调一致？

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292030531.png)

对账系统串行处理流程：

```java
while（存在未对账订单）{
  // 查询未对账订单
  pos = getPOrders();
  // 查询派送单
  dos = getDOrders();
  // 执行对账操作
  diff = check(pos, dos);
  // 差异写入差异库
  save(diff);
}
```

### 利用并行优化对账系统

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292030390.png)

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292030333.png)

### 用 CountDownLatch 实现线程等待

```java
// 创建 2 个线程的线程池
Executor executor =
  Executors.newFixedThreadPool(2);
while（存在未对账订单）{
  // 计数器初始化为 2
  CountDownLatch latch =
    new CountDownLatch(2);
  // 查询未对账订单
  executor.execute(()-> {
    pos = getPOrders();
    latch.countDown();
  });
  // 查询派送单
  executor.execute(()-> {
    dos = getDOrders();
    latch.countDown();
  });

  // 等待两个查询操作结束
  latch.await();

  // 执行对账操作
  diff = check(pos, dos);
  // 差异写入差异库
  save(diff);
}
```

### 进一步优化性能

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292031238.png)

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292031656.png)

### 用 CyclicBarrier 实现线程同步

CyclicBarrier 的计数器有自动重置的功能，当减到 0 的时候，会自动重置你设置的初始值。

```java
// 订单队列
Vector<P> pos;
// 派送单队列
Vector<D> dos;
// 执行回调的线程池
Executor executor =
  Executors.newFixedThreadPool(1);
final CyclicBarrier barrier =
  new CyclicBarrier(2, ()->{
    executor.execute(()->check());
  });

void check(){
  P p = pos.remove(0);
  D d = dos.remove(0);
  // 执行对账操作
  diff = check(p, d);
  // 差异写入差异库
  save(diff);
}

void checkAll(){
  // 循环查询订单库
  Thread T1 = new Thread(()->{
    while（存在未对账订单）{
      // 查询订单库
      pos.add(getPOrders());
      // 等待
      barrier.await();
    }
  });
  T1.start();
  // 循环查询运单库
  Thread T2 = new Thread(()->{
    while（存在未对账订单）{
      // 查询运单库
      dos.add(getDOrders());
      // 等待
      barrier.await();
    }
  });
  T2.start();
}
```

### 总结

**CountDownLatch 主要用来解决一个线程等待多个线程的场景**。

**CyclicBarrier 是一组线程之间互相等待**。

CountDownLatch 的计数器是不能循环利用的，也就是说一旦计数器减到 0，再有线程调用 await()，该线程会直接通过。但 **CyclicBarrier 的计数器是可以循环利用的**，而且具备自动重置的功能，一旦计数器减到 0 会自动重置到你设置的初始值。除此之外，CyclicBarrier 还可以设置回调函数，可以说是功能丰富。

## 并发容器：都有哪些“坑”需要我们填？

### 同步容器及其注意事项

**组合操作需要注意竞态条件问题**，组合操作往往隐藏着竞态条件问题，即便每个操作都能保证原子性，也并不能保证组合操作的原子性。

在容器领域**一个容易被忽视的“坑”是用迭代器遍历容器**。因为遍历元素，进行操作，不能保证原子性。

基于 synchronized 这个同步关键字实现的容器被称为**同步容器**。Java 提供的同步容器还有 Vector、Stack 和 Hashtable。对这三个容器的遍历，同样要加锁保证互斥。

### 并发容器及其注意事项

Java 在 1.5 版本之前所谓的线程安全的容器，主要指的就是**同步容器**。不过同步容器有个最大的问题，那就是性能差，所有方法都用 synchronized 来保证互斥，串行度太高了。因此 Java 在 1.5 及之后版本提供了性能更高的容器，我们一般称为**并发容器**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292032669.png)

#### （一）List

List 里面只有一个实现类就是** CopyOnWriteArrayList**。CopyOnWrite，顾名思义就是写的时候会将共享变量新复制一份出来，这样做的好处是读操作完全无锁。

CopyOnWriteArrayList 内部维护了一个数组，成员变量 array 就指向这个内部数组，所有的读操作都是基于 array 进行的，如下图所示，迭代器 Iterator 遍历的就是 array 数组。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292032762.png)

如果在遍历 array 的同时，还有一个写操作，例如增加元素，CopyOnWriteArrayList 是如何处理的呢？

CopyOnWriteArrayList 会将 array 复制一份，然后在新复制处理的数组上执行增加元素的操作，执行完之后再将 array 指向这个新的数组。通过下图你可以看到，读写是可以并行的，遍历操作一直都是基于原 array 执行，而写操作则是基于新 array 进行。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292032731.png)

使用 CopyOnWriteArrayList 需要注意的“坑”主要有两个方面。一个是应用场景，CopyOnWriteArrayList 仅适用于写操作非常少的场景，而且能够容忍读写的短暂不一致。例如上面的例子中，写入的新元素并不能立刻被遍历到。另一个需要注意的是，CopyOnWriteArrayList 迭代器是只读的，不支持增删改。因为迭代器遍历的仅仅是一个快照，而对快照进行增删改是没有意义的。

#### （二）Map

Map 接口的两个实现是 ConcurrentHashMap 和 ConcurrentSkipListMap，它们从应用的角度来看，主要区别在于** ConcurrentHashMap 的 key 是无序的，而 ConcurrentSkipListMap 的 key 是有序的**。

使用 ConcurrentHashMap 和 ConcurrentSkipListMap 需要注意的地方是，它们的 key 和 value 都不能为空，否则会抛出`NullPointerException`这个运行时异常。下面这个表格总结了 Map 相关的实现类对于 key 和 value 的要求，你可以对比学习。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292033594.png)

ConcurrentSkipListMap 里面的 SkipList 本身就是一种数据结构，中文一般都翻译为“跳表”。跳表插入、删除、查询操作平均的时间复杂度是 O(log n)，理论上和并发线程数没有关系，所以在并发度非常高的情况下，若你对 ConcurrentHashMap 的性能还不满意，可以尝试一下 ConcurrentSkipListMap。

#### （三）Set

Set 接口的两个实现是 CopyOnWriteArraySet 和 ConcurrentSkipListSet，使用场景可以参考前面讲述的 CopyOnWriteArrayList 和 ConcurrentSkipListMap，它们的原理都是一样的，这里就不再赘述了。

#### （四）Queue

Java 并发包里面 Queue 这类并发容器是最复杂的，你可以从以下两个维度来分类。一个维度是**阻塞与非阻塞**，所谓阻塞指的是当队列已满时，入队操作阻塞；当队列已空时，出队操作阻塞。另一个维度是**单端与双端**，单端指的是只能队尾入队，队首出队；而双端指的是队首队尾皆可入队出队。Java 并发包里**阻塞队列都用 Blocking 关键字标识，单端队列使用 Queue 标识，双端队列使用 Deque 标识**。

## 原子类：无锁工具类的典范

无锁方案相对互斥锁方案，最大的好处就是**性能**。互斥锁方案为了保证互斥性，需要执行加锁、解锁操作，而加锁、解锁操作本身就消耗性能；同时拿不到锁的线程还会进入阻塞状态，进而触发线程切换，线程切换对性能的消耗也很大。 相比之下，无锁方案则完全没有加锁、解锁的性能消耗，同时还能保证互斥性，既解决了问题，又没有带来新的问题，可谓绝佳方案。

### 无锁方案的实现原理

CPU 为了解决并发问题，提供了 CAS 指令（CAS，全称是 Compare And Swap，即“比较并交换”）。CAS 指令包含 3 个参数：共享变量的内存地址 A、用于比较的值 B 和共享变量的新值 C；并且只有当内存中地址 A 处的值等于 B 时，才能将内存中地址 A 处的值更新为新值 C。**作为一条 CPU 指令，CAS 指令本身是能够保证原子性的**。

使用 CAS 来解决并发问题，一般都会伴随着自旋，而所谓自旋，其实就是循环尝试。

CAS 存在 ABA 问题。

### 看 Java 如何实现原子化的 count += 1

AtomicLong 的 getAndIncrement() 方法会转调 unsafe.getAndAddLong() 方法。这里 this 和 valueOffset 两个参数可以唯一确定共享变量的内存地址。

```java
final long getAndIncrement() {
  return unsafe.getAndAddLong(
    this, valueOffset, 1L);
}
```

unsafe.getAndAddLong() 方法的源码如下：

```java
public final long getAndAddLong(Object o, long offset, long delta){
  long v;
  do {
    // 读取内存中的值
    v = getLongVolatile(o, offset);
  } while (!compareAndSwapLong(o, offset, v, v + delta));
  return v;
}
//原子性地将变量更新为 x
//条件是内存中的值等于 expected
//更新成功则返回 true
native boolean compareAndSwapLong(
  Object o, long offset,
  long expected,
  long x);
```

### 原子类概览

Java SDK 并发包里提供的原子类内容很丰富，我们可以将它们分为五个类别：**原子化的基本数据类型、原子化的对象引用类型、原子化数组、原子化对象属性更新器**和**原子化的累加器**。这五个类别提供的方法基本上是相似的，并且每个类别都有若干原子类。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292033394.png)

#### 1. 原子化的基本数据类型

相关实现有 AtomicBoolean、AtomicInteger 和 AtomicLong，提供的方法主要有以下这些：

```java
getAndIncrement() //原子化 i++
getAndDecrement() //原子化的 i--
incrementAndGet() //原子化的++i
decrementAndGet() //原子化的--i
//当前值+=delta，返回+=前的值
getAndAdd(delta)
//当前值+=delta，返回+=后的值
addAndGet(delta)
//CAS 操作，返回是否成功
compareAndSet(expect, update)
//以下四个方法
//新值可以通过传入 func 函数来计算
getAndUpdate(func)
updateAndGet(func)
getAndAccumulate(x,func)
accumulateAndGet(x,func)
```

#### 2. 原子化的对象引用类型

相关实现有 AtomicReference、AtomicStampedReference 和 AtomicMarkableReference，利用它们可以实现对象引用的原子化更新。AtomicReference 提供的方法和原子化的基本数据类型差不多。

AtomicStampedReference 和 AtomicMarkableReference 这两个原子类可以解决 ABA 问题。解决思路就是增加一个版本号，类似于乐观锁机制。

AtomicStampedReference 实现的 CAS 方法就增加了版本号参数，方法签名如下：

```java
boolean compareAndSet(
  V expectedReference,
  V newReference,
  int expectedStamp,
  int newStamp)
```

AtomicMarkableReference 的实现机制则更简单，将版本号简化成了一个 Boolean 值，方法签名如下：

```java
boolean compareAndSet(
  V expectedReference,
  V newReference,
  boolean expectedMark,
  boolean newMark)
```

#### 3. 原子化数组

相关实现有 AtomicIntegerArray、AtomicLongArray 和 AtomicReferenceArray，利用这些原子类，我们可以原子化地更新数组里面的每一个元素。这些类提供的方法和原子化的基本数据类型的区别仅仅是：每个方法多了一个数组的索引参数。

#### 4. 原子化对象属性更新器

相关实现有 AtomicIntegerFieldUpdater、AtomicLongFieldUpdater 和 AtomicReferenceFieldUpdater，利用它们可以原子化地更新对象的属性，这三个方法都是利用反射机制实现的，创建更新器的方法如下：

```swift
public static <U>
AtomicXXXFieldUpdater<U>
newUpdater(Class<U> tclass,
  String fieldName)
```

需要注意的是，**对象属性必须是 volatile 类型的，只有这样才能保证可见性**；如果对象属性不是 volatile 类型的，newUpdater() 方法会抛出 IllegalArgumentException 这个运行时异常。

newUpdater() 的方法参数只有类的信息，没有对象的引用，而更新**对象**的属性，一定需要对象的引用，那这个参数是在哪里传入的呢？是在原子操作的方法参数中传入的。例如 compareAndSet() 这个原子操作，相比原子化的基本数据类型多了一个对象引用 obj。原子化对象属性更新器相关的方法，相比原子化的基本数据类型仅仅是多了对象引用参数。

```java
boolean compareAndSet(
  T obj,
  int expect,
  int update)
```

#### 5. 原子化的累加器

DoubleAccumulator、DoubleAdder、LongAccumulator 和 LongAdder，这四个类仅仅用来执行累加操作，相比原子化的基本数据类型，速度更快，但是不支持 compareAndSet() 方法。如果你仅仅需要累加操作，使用原子化的累加器性能会更好。

### 总结

无锁方案相对于互斥锁方案，优点非常多，首先性能好，其次是基本不会出现死锁问题（但可能出现饥饿和活锁问题，因为自旋会反复重试）。Java 提供的原子类大部分都实现了 compareAndSet() 方法。

Java 提供的原子类能够解决一些简单的原子性问题，但是所有原子类的方法都是针对一个共享变量的，如果需要解决多个变量的原子性问题，建议还是使用互斥锁方案。

## Executor 与线程池：如何创建正确的线程池？

**线程是一个重量级的对象，应该避免频繁创建和销毁**。

### 线程池是一种生产者-消费者模式

业界线程池的设计，普遍采用的都是**生产者-消费者模式**。线程池的使用方是生产者，线程池本身是消费者。

### 如何使用 Java 中的线程池

ThreadPoolExecutor 的构造函数：

```cpp
ThreadPoolExecutor(
  int corePoolSize,
  int maximumPoolSize,
  long keepAliveTime,
  TimeUnit unit,
  BlockingQueue<Runnable> workQueue,
  ThreadFactory threadFactory,
  RejectedExecutionHandler handler)
```

参数说明：

- **corePoolSize**：表示线程池保有的最小线程数。有些项目很闲，但是也不能把人都撤了，至少要留 corePoolSize 个人坚守阵地。
- **maximumPoolSize**：表示线程池创建的最大线程数。当项目很忙时，就需要加人，但是也不能无限制地加，最多就加到 maximumPoolSize 个人。当项目闲下来时，就要撤人了，最多能撤到 corePoolSize 个人。
- **keepAliveTime & unit**：上面提到项目根据忙闲来增减人员，那在编程世界里，如何定义忙和闲呢？很简单，一个线程如果在一段时间内，都没有执行任务，说明很闲，keepAliveTime 和 unit 就是用来定义这个“一段时间”的参数。也就是说，如果一个线程空闲了`keepAliveTime & unit`这么久，而且线程池的线程数大于 corePoolSize ，那么这个空闲的线程就要被回收了。
- **workQueue**：工作队列，和上面示例代码的工作队列同义。
- **threadFactory**：通过这个参数你可以自定义如何创建线程，例如你可以给线程指定一个有意义的名字。
- handler：通过这个参数你可以自定义任务的拒绝策略。如果线程池中所有的线程都在忙碌，并且工作队列也满了（前提是工作队列是有界队列），那么此时提交任务，线程池就会拒绝接收。至于拒绝的策略，你可以通过 handler 这个参数来指定。ThreadPoolExecutor 已经提供了以下 4 种策略。
  - CallerRunsPolicy：提交任务的线程自己去执行该任务。
  - AbortPolicy：默认的拒绝策略，会 throws RejectedExecutionException。
  - DiscardPolicy：直接丢弃任务，没有任何异常抛出。
  - DiscardOldestPolicy：丢弃最老的任务，其实就是把最早进入工作队列的任务丢弃，然后把新任务加入到工作队列。

Java 在 1.6 版本还增加了 allowCoreThreadTimeOut(boolean value) 方法，它可以让所有线程都支持超时，这意味着如果项目很闲，就会将项目组的成员都撤走。

### 使用线程池要注意些什么

不建议使用 Executors 的最重要的原因是：Executors 提供的很多方法默认使用的都是无界的 LinkedBlockingQueue，高负载情境下，无界队列很容易导致 OOM，而 OOM 会导致所有请求都无法处理，这是致命问题。所以**强烈建议使用有界队列**。

使用有界队列，当任务过多时，线程池会触发执行拒绝策略，线程池默认的拒绝策略会 throw RejectedExecutionException 这是个运行时异常，对于运行时异常编译器并不强制 catch 它，所以开发人员很容易忽略。因此**默认拒绝策略要慎重使用**。如果线程池处理的任务非常重要，建议自定义自己的拒绝策略；并且在实际工作中，自定义的拒绝策略往往和降级策略配合使用。

使用线程池，还要注意异常处理的问题，例如通过 ThreadPoolExecutor 对象的 execute() 方法提交任务时，如果任务在执行的过程中出现运行时异常，会导致执行任务的线程终止；不过，最致命的是任务虽然异常了，但是你却获取不到任何通知，这会让你误以为任务都执行得很正常。虽然线程池提供了很多用于异常处理的方法，但是最稳妥和简单的方案还是捕获所有异常并按需处理，你可以参考下面的示例代码。

```php
try {
  //业务逻辑
} catch (RuntimeException x) {
  //按需处理
} catch (Throwable x) {
  //按需处理
}
```

## Future：如何用多线程实现最优的“烧水泡茶”程序？

### 如何获取任务执行结果

Java 通过 ThreadPoolExecutor 提供的 3 个 submit() 方法和 1 个 FutureTask 工具类来支持获得任务执行结果的需求。

```java
// 提交 Runnable 任务
Future<?>
  submit(Runnable task);
// 提交 Callable 任务
<T> Future<T>
  submit(Callable<T> task);
// 提交 Runnable 任务及结果引用
<T> Future<T>
  submit(Runnable task, T result);
```

Future 接口有 5 个方法，我都列在下面了，它们分别是**取消任务的方法 cancel()、判断任务是否已取消的方法 isCancelled()、判断任务是否已结束的方法 isDone() **以及** 2 个获得任务执行结果的 get() 和 get(timeout, unit)**，其中最后一个 get(timeout, unit) 支持超时机制。

```java
// 取消任务
boolean cancel(
  boolean mayInterruptIfRunning);
// 判断任务是否已取消
boolean isCancelled();
// 判断任务是否已结束
boolean isDone();
// 获得任务执行结果
get();
// 获得任务执行结果，支持超时
get(long timeout, TimeUnit unit);
```

FutureTask 实现了 Runnable 和 Future 接口，由于实现了 Runnable 接口，所以可以将 FutureTask 对象作为任务提交给 ThreadPoolExecutor 去执行，也可以直接被 Thread 执行；又因为实现了 Future 接口，所以也能用来获得任务的执行结果。

```java
// 创建 FutureTask
FutureTask<Integer> futureTask
  = new FutureTask<>(()-> 1+2);
// 创建线程池
ExecutorService es =
  Executors.newCachedThreadPool();
// 提交 FutureTask
es.submit(futureTask);
// 获取计算结果
Integer result = futureTask.get();
```

FutureTask 对象直接被 Thread 执行的示例代码如下所示。

```java
// 创建 FutureTask
FutureTask<Integer> futureTask
  = new FutureTask<>(()-> 1+2);
// 创建并启动线程
Thread T1 = new Thread(futureTask);
T1.start();
// 获取计算结果
Integer result = futureTask.get();
```

### 实现最优的“烧水泡茶”程序

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292034424.png)

烧水泡茶最优分工方案

首先，我们创建了两个 FutureTask——ft1 和 ft2，ft1 完成洗水壶、烧开水、泡茶的任务，ft2 完成洗茶壶、洗茶杯、拿茶叶的任务；这里需要注意的是 ft1 这个任务在执行泡茶任务前，需要等待 ft2 把茶叶拿来，所以 ft1 内部需要引用 ft2，并在执行泡茶之前，调用 ft2 的 get() 方法实现等待。

```java
// 创建任务 T2 的 FutureTask
FutureTask<String> ft2
  = new FutureTask<>(new T2Task());
// 创建任务 T1 的 FutureTask
FutureTask<String> ft1
  = new FutureTask<>(new T1Task(ft2));
// 线程 T1 执行任务 ft1
Thread T1 = new Thread(ft1);
T1.start();
// 线程 T2 执行任务 ft2
Thread T2 = new Thread(ft2);
T2.start();
// 等待线程 T1 执行结果
System.out.println(ft1.get());

// T1Task 需要执行的任务：
// 洗水壶、烧开水、泡茶
class T1Task implements Callable<String>{
  FutureTask<String> ft2;
  // T1 任务需要 T2 任务的 FutureTask
  T1Task(FutureTask<String> ft2){
    this.ft2 = ft2;
  }
  @Override
  String call() throws Exception {
    System.out.println("T1: 洗水壶。..");
    TimeUnit.SECONDS.sleep(1);

    System.out.println("T1: 烧开水。..");
    TimeUnit.SECONDS.sleep(15);
    // 获取 T2 线程的茶叶
    String tf = ft2.get();
    System.out.println("T1: 拿到茶叶："+tf);

    System.out.println("T1: 泡茶。..");
    return "上茶：" + tf;
  }
}
// T2Task 需要执行的任务：
// 洗茶壶、洗茶杯、拿茶叶
class T2Task implements Callable<String> {
  @Override
  String call() throws Exception {
    System.out.println("T2: 洗茶壶。..");
    TimeUnit.SECONDS.sleep(1);

    System.out.println("T2: 洗茶杯。..");
    TimeUnit.SECONDS.sleep(2);

    System.out.println("T2: 拿茶叶。..");
    TimeUnit.SECONDS.sleep(1);
    return "龙井";
  }
}
// 一次执行结果：
T1: 洗水壶。..
T2: 洗茶壶。..
T1: 烧开水。..
T2: 洗茶杯。..
T2: 拿茶叶。..
T1: 拿到茶叶：龙井
T1: 泡茶。..
上茶：龙井
```

## CompletableFuture：异步编程没那么难

**异步化**，是并行方案得以实施的基础，更深入地讲其实就是：**利用多线程优化性能这个核心方案得以实施的基础**。

### CompletableFuture 的核心优势

```java
// 任务 1：洗水壶 -> 烧开水
CompletableFuture<Void> f1 =
  CompletableFuture.runAsync(()->{
  System.out.println("T1: 洗水壶。..");
  sleep(1, TimeUnit.SECONDS);

  System.out.println("T1: 烧开水。..");
  sleep(15, TimeUnit.SECONDS);
});
// 任务 2：洗茶壶 -> 洗茶杯 -> 拿茶叶
CompletableFuture<String> f2 =
  CompletableFuture.supplyAsync(()->{
  System.out.println("T2: 洗茶壶。..");
  sleep(1, TimeUnit.SECONDS);

  System.out.println("T2: 洗茶杯。..");
  sleep(2, TimeUnit.SECONDS);

  System.out.println("T2: 拿茶叶。..");
  sleep(1, TimeUnit.SECONDS);
  return " 龙井 ";
});
// 任务 3：任务 1 和任务 2 完成后执行：泡茶
CompletableFuture<String> f3 =
  f1.thenCombine(f2, (__, tf)->{
    System.out.println("T1: 拿到茶叶：" + tf);
    System.out.println("T1: 泡茶。..");
    return " 上茶：" + tf;
  });
// 等待任务 3 执行结果
System.out.println(f3.join());

void sleep(int t, TimeUnit u) {
  try {
    u.sleep(t);
  }catch(InterruptedException e){}
}
// 一次执行结果：
T1: 洗水壶。..
T2: 洗茶壶。..
T1: 烧开水。..
T2: 洗茶杯。..
T2: 拿茶叶。..
T1: 拿到茶叶：龙井
T1: 泡茶。..
上茶：龙井
```

### 创建 CompletableFuture 对象

默认情况下 CompletableFuture 会使用公共的 ForkJoinPool 线程池，这个线程池默认创建的线程数是 CPU 的核数（也可以通过 JVM option:-Djava.util.concurrent.ForkJoinPool.common.parallelism 来设置 ForkJoinPool 线程池的线程数）。如果所有 CompletableFuture 共享一个线程池，那么一旦有任务执行一些很慢的 I/O 操作，就会导致线程池中所有线程都阻塞在 I/O 操作上，从而造成线程饥饿，进而影响整个系统的性能。所以，强烈建议你要**根据不同的业务类型创建不同的线程池，以避免互相干扰**。

```java
//使用默认线程池
static CompletableFuture<Void>
  runAsync(Runnable runnable)
static <U> CompletableFuture<U>
  supplyAsync(Supplier<U> supplier)
//可以指定线程池
static CompletableFuture<Void>
  runAsync(Runnable runnable, Executor executor)
static <U> CompletableFuture<U>
  supplyAsync(Supplier<U> supplier, Executor executor)
```

创建完 CompletableFuture 对象之后，会自动地异步执行 runnable.run() 方法或者 supplier.get() 方法。

### 如何理解 CompletionStage 接口

CompletionStage 接口可以清晰地描述任务之间的这种时序关系，例如前面提到的 `f3 = f1.thenCombine(f2, ()->{})` 描述的就是一种汇聚关系。

#### 1. 描述串行关系

CompletionStage 接口里面描述串行关系，主要是 thenApply、thenAccept、thenRun 和 thenCompose 这四个系列的接口。

thenApply 系列函数里参数 fn 的类型是接口 Function，这个接口里与 CompletionStage 相关的方法是 `R apply(T t)`，这个方法既能接收参数也支持返回值，所以 thenApply 系列方法返回的是`CompletionStage<R>`。

而 thenAccept 系列方法里参数 consumer 的类型是接口`Consumer<T>`，这个接口里与 CompletionStage 相关的方法是 `void accept(T t)`，这个方法虽然支持参数，但却不支持回值，所以 thenAccept 系列方法返回的是`CompletionStage<Void>`。

thenRun 系列方法里 action 的参数是 Runnable，所以 action 既不能接收参数也不支持返回值，所以 thenRun 系列方法返回的也是`CompletionStage<Void>`。

这些方法里面 Async 代表的是异步执行 fn、consumer 或者 action。其中，需要你注意的是 thenCompose 系列方法，这个系列的方法会新创建出一个子流程，最终结果和 thenApply 系列是相同的。

```java
CompletionStage<R> thenApply(fn);
CompletionStage<R> thenApplyAsync(fn);
CompletionStage<Void> thenAccept(consumer);
CompletionStage<Void> thenAcceptAsync(consumer);
CompletionStage<Void> thenRun(action);
CompletionStage<Void> thenRunAsync(action);
CompletionStage<R> thenCompose(fn);
CompletionStage<R> thenComposeAsync(fn);
```

#### 2. 描述 AND 汇聚关系

CompletionStage 接口里面描述 AND 汇聚关系，主要是 thenCombine、thenAcceptBoth 和 runAfterBoth 系列的接口，这些接口的区别也是源自 fn、consumer、action 这三个核心参数不同。它们的使用你可以参考上面烧水泡茶的实现程序，这里就不赘述了。

```java
CompletionStage<R> thenCombine(other, fn);
CompletionStage<R> thenCombineAsync(other, fn);
CompletionStage<Void> thenAcceptBoth(other, consumer);
CompletionStage<Void> thenAcceptBothAsync(other, consumer);
CompletionStage<Void> runAfterBoth(other, action);
CompletionStage<Void> runAfterBothAsync(other, action);
```

#### 3. 描述 OR 汇聚关系

CompletionStage 接口里面描述 OR 汇聚关系，主要是 applyToEither、acceptEither 和 runAfterEither 系列的接口，这些接口的区别也是源自 fn、consumer、action 这三个核心参数不同。

```java
CompletionStage applyToEither(other, fn);
CompletionStage applyToEitherAsync(other, fn);
CompletionStage acceptEither(other, consumer);
CompletionStage acceptEitherAsync(other, consumer);
CompletionStage runAfterEither(other, action);
CompletionStage runAfterEitherAsync(other, action);
```

## CompletionService：如何批量执行异步任务？

用三个线程异步执行询价，通过三次调用 Future 的 get() 方法获取询价结果，之后将询价结果保存在数据库中。

```java
// 创建线程池
ExecutorService executor =
  Executors.newFixedThreadPool(3);
// 异步向电商 S1 询价
Future<Integer> f1 =
  executor.submit(
    ()->getPriceByS1());
// 异步向电商 S2 询价
Future<Integer> f2 =
  executor.submit(
    ()->getPriceByS2());
// 异步向电商 S3 询价
Future<Integer> f3 =
  executor.submit(
    ()->getPriceByS3());

// 获取电商 S1 报价并保存
r=f1.get();
executor.execute(()->save(r));

// 获取电商 S2 报价并保存
r=f2.get();
executor.execute(()->save(r));

// 获取电商 S3 报价并保存
r=f3.get();
executor.execute(()->save(r));
```

如果获取电商 S1 报价的耗时很长，那么即便获取电商 S2 报价的耗时很短，也无法让保存 S2 报价的操作先执行，因为这个主线程都阻塞在了 `f1.get()` 操作上。这点小瑕疵你该如何解决呢？

估计你已经想到了，增加一个阻塞队列，获取到 S1、S2、S3 的报价都进入阻塞队列，然后在主线程中消费阻塞队列，这样就能保证先获取到的报价先保存到数据库了。下面的示例代码展示了如何利用阻塞队列实现先获取到的报价先保存到数据库。

```java
// 创建阻塞队列
BlockingQueue<Integer> bq =
  new LinkedBlockingQueue<>();
//电商 S1 报价异步进入阻塞队列
executor.execute(()->
  bq.put(f1.get()));
//电商 S2 报价异步进入阻塞队列
executor.execute(()->
  bq.put(f2.get()));
//电商 S3 报价异步进入阻塞队列
executor.execute(()->
  bq.put(f3.get()));
//异步保存所有报价
for (int i=0; i<3; i++) {
  Integer r = bq.take();
  executor.execute(()->save(r));
}
```

### 利用 CompletionService 实现询价系统

**如何创建 CompletionService 呢？**

CompletionService 接口的实现类是 ExecutorCompletionService，这个实现类的构造方法有两个，分别是：

1. `ExecutorCompletionService(Executor executor)`；
2. `ExecutorCompletionService(Executor executor, BlockingQueue<Future<V>> completionQueue)`。

这两个构造方法都需要传入一个线程池，如果不指定 completionQueue，那么默认会使用无界的 LinkedBlockingQueue。任务执行结果的 Future 对象就是加入到 completionQueue 中。

下面的示例代码完整地展示了如何利用 CompletionService 来实现高性能的询价系统。

```java
// 创建线程池
ExecutorService executor =
  Executors.newFixedThreadPool(3);
// 创建 CompletionService
CompletionService<Integer> cs = new
  ExecutorCompletionService<>(executor);
// 异步向电商 S1 询价
cs.submit(()->getPriceByS1());
// 异步向电商 S2 询价
cs.submit(()->getPriceByS2());
// 异步向电商 S3 询价
cs.submit(()->getPriceByS3());
// 将询价结果异步保存到数据库
for (int i=0; i<3; i++) {
  Integer r = cs.take().get();
  executor.execute(()->save(r));
}
```

### CompletionService 接口说明

CompletionService 接口提供的方法有 5 个，这 5 个方法的方法签名如下所示。

```java
Future<V> submit(Callable<V> task);
Future<V> submit(Runnable task, V result);
Future<V> take()
  throws InterruptedException;
Future<V> poll();
Future<V> poll(long timeout, TimeUnit unit)
  throws InterruptedException;
```

### 利用 CompletionService 实现 Dubbo 中的 Forking Cluster

Dubbo 中有一种叫做** Forking 的集群模式**，这种集群模式下，支持**并行地调用多个查询服务，只要有一个成功返回结果，整个服务就可以返回了**。例如你需要提供一个地址转坐标的服务，为了保证该服务的高可用和性能，你可以并行地调用 3 个地图服务商的 API，然后只要有 1 个正确返回了结果 r，那么地址转坐标这个服务就可以直接返回 r 了。这种集群模式可以容忍 2 个地图服务商服务异常，但缺点是消耗的资源偏多。

```java
geocoder(addr) {
  //并行执行以下 3 个查询服务，
  r1=geocoderByS1(addr);
  r2=geocoderByS2(addr);
  r3=geocoderByS3(addr);
  //只要 r1,r2,r3 有一个返回
  //则返回
  return r1|r2|r3;
}
```

利用 CompletionService 可以快速实现 Forking 这种集群模式，比如下面的示例代码就展示了具体是如何实现的。首先我们创建了一个线程池 executor 、一个 CompletionService 对象 cs 和一个`Future<Integer>`类型的列表 futures，每次通过调用 CompletionService 的 submit() 方法提交一个异步任务，会返回一个 Future 对象，我们把这些 Future 对象保存在列表 futures 中。通过调用 `cs.take().get()`，我们能够拿到最快返回的任务执行结果，只要我们拿到一个正确返回的结果，就可以取消所有任务并且返回最终结果了。

```java
// 创建线程池
ExecutorService executor =
  Executors.newFixedThreadPool(3);
// 创建 CompletionService
CompletionService<Integer> cs =
  new ExecutorCompletionService<>(executor);
// 用于保存 Future 对象
List<Future<Integer>> futures =
  new ArrayList<>(3);
//提交异步任务，并保存 future 到 futures
futures.add(
  cs.submit(()->geocoderByS1()));
futures.add(
  cs.submit(()->geocoderByS2()));
futures.add(
  cs.submit(()->geocoderByS3()));
// 获取最快返回的任务执行结果
Integer r = 0;
try {
  // 只要有一个成功返回，则 break
  for (int i = 0; i < 3; ++i) {
    r = cs.take().get();
    //简单地通过判空来检查是否成功返回
    if (r != null) {
      break;
    }
  }
} finally {
  //取消所有任务
  for(Future<Integer> f : futures)
    f.cancel(true);
}
// 返回结果
return r;
```

### 总结

当需要批量提交异步任务的时候建议你使用 CompletionService。CompletionService 将线程池 Executor 和阻塞队列 BlockingQueue 的功能融合在了一起，能够让批量异步任务的管理更简单。除此之外，CompletionService 能够让异步任务的执行结果有序化，先执行完的先进入阻塞队列，利用这个特性，你可以轻松实现后续处理的有序性，避免无谓的等待，同时还可以快速实现诸如 Forking Cluster 这样的需求。

CompletionService 的实现类 ExecutorCompletionService，需要你自己创建线程池，虽看上去有些啰嗦，但好处是你可以让多个 ExecutorCompletionService 的线程池隔离，这种隔离性能避免几个特别耗时的任务拖垮整个应用的风险。

## Fork_Join：单机版的 MapReduce

**对于简单的并行任务，你可以通过“线程池 +Future”的方案来解决；如果任务之间有聚合关系，无论是 AND 聚合还是 OR 聚合，都可以通过 CompletableFuture 来解决；而批量的并行任务，则可以通过 CompletionService 来解决。**

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292001191.png)

除了简单并行、聚合、批量并行这三种任务模型，还有一种“分治”的任务模型。

**分治**，顾名思义，即分而治之，是一种解决复杂问题的思维方法和模式；具体来讲，指的是**把一个复杂的问题分解成多个相似的子问题，然后再把子问题分解成更小的子问题，直到子问题简单到可以直接求解**。理论上来讲，解决每一个问题都对应着一个任务，所以对于问题的分治，实际上就是对于任务的分治。

### 分治任务模型

这里你需要先深入了解一下分治任务模型，分治任务模型可分为两个阶段：一个阶段是**任务分解**，也就是将任务迭代地分解为子任务，直至子任务可以直接计算出结果；另一个阶段是**结果合并**，即逐层合并子任务的执行结果，直至获得最终结果。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292012846.png)

简版分治任务模型图

在这个分治任务模型里，任务和分解后的子任务具有相似性，这种相似性往往体现在任务和子任务的算法是相同的，但是计算的数据规模是不同的。具备这种相似性的问题，我们往往都采用递归算法。

### Fork/Join 的使用

Fork/Join 是一个并行计算的框架，主要就是用来支持分治任务模型的，这个计算框架里的** Fork 对应的是分治任务模型里的任务分解，Join 对应的是结果合并**。Fork/Join 计算框架主要包含两部分，一部分是**分治任务的线程池 ForkJoinPool**，另一部分是**分治任务 ForkJoinTask**。

ForkJoinTask 是一个抽象类，它的方法有很多，最核心的是 fork() 方法和 join() 方法，其中 fork() 方法会异步地执行一个子任务，而 join() 方法则会阻塞当前线程来等待子任务的执行结果。ForkJoinTask 有两个子类——RecursiveAction 和 RecursiveTask，通过名字你就应该能知道，它们都是用递归的方式来处理分治任务的。这两个子类都定义了抽象方法 compute()，不过区别是 RecursiveAction 定义的 compute() 没有返回值，而 RecursiveTask 定义的 compute() 方法是有返回值的。这两个子类也是抽象类，在使用的时候，需要你定义子类去扩展。

接下来我们就来实现一下，看看如何用 Fork/Join 这个并行计算框架计算斐波那契数列（下面的代码源自 Java 官方示例）。首先我们需要创建一个分治任务线程池以及计算斐波那契数列的分治任务，之后通过调用分治任务线程池的 invoke() 方法来启动分治任务。由于计算斐波那契数列需要有返回值，所以 Fibonacci 继承自 RecursiveTask。分治任务 Fibonacci 需要实现 compute() 方法，这个方法里面的逻辑和普通计算斐波那契数列非常类似，区别之处在于计算 `Fibonacci(n - 1)` 使用了异步子任务，这是通过 `f1.fork()` 这条语句实现的。

```java
static void main(String[] args){
  //创建分治任务线程池
  ForkJoinPool fjp =
    new ForkJoinPool(4);
  //创建分治任务
  Fibonacci fib =
    new Fibonacci(30);
  //启动分治任务
  Integer result =
    fjp.invoke(fib);
  //输出结果
  System.out.println(result);
}
//递归任务
static class Fibonacci extends
    RecursiveTask<Integer>{
  final int n;
  Fibonacci(int n){this.n = n;}
  protected Integer compute(){
    if (n <= 1)
      return n;
    Fibonacci f1 =
      new Fibonacci(n - 1);
    //创建子任务
    f1.fork();
    Fibonacci f2 =
      new Fibonacci(n - 2);
    //等待子任务结果，并合并结果
    return f2.compute() + f1.join();
  }
}
```

## ForkJoinPool 工作原理

ForkJoinPool 本质上也是一个生产者-消费者的实现，但是更加智能，ThreadPoolExecutor 内部只有一个任务队列，而 ForkJoinPool 内部有多个任务队列，当我们通过 ForkJoinPool 的 invoke() 或者 submit() 方法提交任务时，ForkJoinPool 根据一定的路由规则把任务提交到一个任务队列中，如果任务在执行过程中会创建出子任务，那么子任务会提交到工作线程对应的任务队列中。

如果工作线程对应的任务队列空了，是不是就没活儿干了呢？不是的，ForkJoinPool 支持一种叫做“**任务窃取**”的机制，如果工作线程空闲了，那它可以“窃取”其他工作任务队列里的任务，例如下图中，线程 T2 对应的任务队列已经空了，它可以“窃取”线程 T1 对应的任务队列的任务。如此一来，所有的工作线程都不会闲下来了。

ForkJoinPool 中的任务队列采用的是双端队列，工作线程正常获取任务和“窃取任务”分别是从任务队列不同的端消费，这样能避免很多不必要的数据竞争。我们这里介绍的仅仅是简化后的原理，ForkJoinPool 的实现远比我们这里介绍的复杂。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408292016364.png)

### 模拟 MapReduce 统计单词数量

学习 MapReduce 有一个入门程序，统计一个文件里面每个单词的数量，下面我们来看看如何用 Fork/Join 并行计算框架来实现。

我们可以先用二分法递归地将一个文件拆分成更小的文件，直到文件里只有一行数据，然后统计这一行数据里单词的数量，最后再逐级汇总结果，你可以对照前面的简版分治任务模型图来理解这个过程。

思路有了，我们马上来实现。下面的示例程序用一个字符串数组 `String[] fc` 来模拟文件内容，fc 里面的元素与文件里面的行数据一一对应。关键的代码在 `compute()` 这个方法里面，这是一个递归方法，前半部分数据 fork 一个递归任务去处理（关键代码 mr1.fork()），后半部分数据则在当前任务中递归处理（mr2.compute()）。

```java
static void main(String[] args){
  String[] fc = {"hello world",
          "hello me",
          "hello fork",
          "hello join",
          "fork join in world"};
  //创建 ForkJoin 线程池
  ForkJoinPool fjp =
      new ForkJoinPool(3);
  //创建任务
  MR mr = new MR(
      fc, 0, fc.length);
  //启动任务
  Map<String, Long> result =
      fjp.invoke(mr);
  //输出结果
  result.forEach((k, v)->
    System.out.println(k+":"+v));
}
//MR 模拟类
static class MR extends
  RecursiveTask<Map<String, Long>> {
  private String[] fc;
  private int start, end;
  //构造函数
  MR(String[] fc, int fr, int to){
    this.fc = fc;
    this.start = fr;
    this.end = to;
  }
  @Override protected
  Map<String, Long> compute(){
    if (end - start == 1) {
      return calc(fc[start]);
    } else {
      int mid = (start+end)/2;
      MR mr1 = new MR(
          fc, start, mid);
      mr1.fork();
      MR mr2 = new MR(
          fc, mid, end);
      //计算子任务，并返回合并的结果
      return merge(mr2.compute(),
          mr1.join());
    }
  }
  //合并结果
  private Map<String, Long> merge(
      Map<String, Long> r1,
      Map<String, Long> r2) {
    Map<String, Long> result =
        new HashMap<>();
    result.putAll(r1);
    //合并结果
    r2.forEach((k, v) -> {
      Long c = result.get(k);
      if (c != null)
        result.put(k, c+v);
      else
        result.put(k, v);
    });
    return result;
  }
  //统计单词数量
  private Map<String, Long>
      calc(String line) {
    Map<String, Long> result =
        new HashMap<>();
    //分割单词
    String [] words =
        line.split("\\s+");
    //统计单词数量
    for (String w : words) {
      Long v = result.get(w);
      if (v != null)
        result.put(w, v+1);
      else
        result.put(w, 1L);
    }
    return result;
  }
}
```

### 总结

Fork/Join 并行计算框架主要解决的是分治任务。分治的核心思想是“分而治之”：将一个大的任务拆分成小的子任务去解决，然后再把子任务的结果聚合起来从而得到最终结果。这个过程非常类似于大数据处理中的 MapReduce，所以你可以把 Fork/Join 看作单机版的 MapReduce。

Fork/Join 并行计算框架的核心组件是 ForkJoinPool。ForkJoinPool 支持任务窃取机制，能够让所有线程的工作量基本均衡，不会出现有的线程很忙，而有的线程很闲的状况，所以性能很好。Java 1.8 提供的 Stream API 里面并行流也是以 ForkJoinPool 为基础的。不过需要你注意的是，默认情况下所有的并行流计算都共享一个 ForkJoinPool，这个共享的 ForkJoinPool 默认的线程数是 CPU 的核数；如果所有的并行流计算都是 CPU 密集型计算的话，完全没有问题，但是如果存在 I/O 密集型的并行流计算，那么很可能会因为一个很慢的 I/O 计算而拖慢整个系统的性能。所以**建议用不同的 ForkJoinPool 执行不同类型的计算任务**。

如果你对 ForkJoinPool 详细的实现细节感兴趣，也可以参考 [Doug Lea 的论文](http://gee.cs.oswego.edu/dl/papers/fj.pdf)。

## 并发工具类模块热点问题答疑

略

## 参考资料

- [极客时间教程 - Java 并发编程实战](https://time.geekbang.org/column/intro/100023901)
