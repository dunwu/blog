---
title: Java 并发面试二
date: 2024-07-23 07:21:03
categories:
  - Java
  - JavaCore
  - 面试
tags:
  - Java
  - JavaCore
  - 面试
  - 并发
permalink: /pages/696ebf40/
---

# Java 并发面试二

## Java 锁

### 【中等】Java 中，根据不同维度划分，锁有哪些分类？

在 Java 中，锁可以按照 **多个维度** 进行分类，不同维度的锁适用于不同的并发场景。以下是详细的分类：

**按锁的公平性划分**

| **锁类型**   | **特点**                                                                         | **实现类/关键字**                      |
| ------------ | -------------------------------------------------------------------------------- | -------------------------------------- |
| **公平锁**   | 严格按照线程请求顺序（FIFO）分配锁，避免线程饥饿，但性能较低。                   | `ReentrantLock(true)`                  |
| **非公平锁** | 允许插队，新请求的线程可能直接抢到锁，吞吐量高，但可能导致线程饥饿（默认方式）。 | `ReentrantLock(false)`、`synchronized` |

**按锁的获取方式划分**

| **锁类型** | **特点**                                                   | **实现类/关键字**               |
| ---------- | ---------------------------------------------------------- | ------------------------------- |
| **悲观锁** | 认为并发冲突必然发生，先加锁再操作（阻塞其他线程）。       | `synchronized`、`ReentrantLock` |
| **乐观锁** | 认为并发冲突较少，不加锁，更新时检查（CAS 或版本号机制）。 | `AtomicInteger`、`StampedLock`  |

**按锁的可重入性划分**

| **锁类型**     | **特点**                                                          | **实现类/关键字**               |
| -------------- | ----------------------------------------------------------------- | ------------------------------- |
| **可重入锁**   | 同一线程可多次获取同一把锁（避免死锁）。                          | `ReentrantLock`、`synchronized` |
| **不可重入锁** | 同一线程重复获取同一把锁会导致死锁（Java 无原生实现，需自定义）。 | 无（需自行实现）                |

**按锁的共享性划分**

| **锁类型**           | **特点**                                                             | **实现类/关键字**               |
| -------------------- | -------------------------------------------------------------------- | ------------------------------- |
| **独占锁（排他锁）** | 同一时间只有一个线程能持有锁（如 `synchronized`、`ReentrantLock`）。 | `synchronized`、`ReentrantLock` |
| **共享锁**           | 允许多个线程同时读取，但写入时独占（如 `ReadWriteLock`）。           | `ReentrantReadWriteLock`        |

**按锁的阻塞方式划分**

| **锁类型**       | **特点**                                                     | **实现类/关键字**               |
| ---------------- | ------------------------------------------------------------ | ------------------------------- |
| **阻塞锁**       | 获取不到锁时，线程进入阻塞状态（如 `synchronized`）。        | `synchronized`、`ReentrantLock` |
| **自旋锁**       | 获取不到锁时，线程循环尝试（避免线程切换，但消耗 CPU）。     | `AtomicInteger`（CAS 自旋）     |
| **适应性自旋锁** | JVM 自动优化自旋次数（如 `synchronized` 在 JDK 6+ 的优化）。 | JVM 内部优化                    |

**按锁的优化策略划分**

| **锁类型**   | **特点**                                                         | **实现类/关键字**              |
| ------------ | ---------------------------------------------------------------- | ------------------------------ |
| **偏向锁**   | 单线程访问时无同步开销（JDK 6+ 对 `synchronized` 的优化）。      | JVM 自动优化（`synchronized`） |
| **轻量级锁** | 多线程无竞争时，使用 CAS 代替阻塞（JDK 6+ 优化）。               | JVM 自动优化（`synchronized`） |
| **重量级锁** | 真正的互斥锁，涉及 OS 线程阻塞（如 `synchronized` 竞争激烈时）。 | JVM 自动升级（`synchronized`） |

**按锁的实现方式划分**

| **锁类型**           | **特点**                                  | **实现类/关键字**                |
| -------------------- | ----------------------------------------- | -------------------------------- |
| **内置锁（JVM 锁）** | 由 JVM 实现（如 `synchronized`）。        | `synchronized`                   |
| **显式锁**           | 由 Java API 提供（如 `ReentrantLock`）。  | `ReentrantLock`、`ReadWriteLock` |
| **分布式锁**         | 跨 JVM 的锁（如 Redis、ZooKeeper 实现）。 | `Redisson`、`Curator`            |

**总结**

| **分类维度** | **锁类型**                                                                  |
| ------------ | --------------------------------------------------------------------------- |
| **公平性**   | 公平锁、非公平锁                                                            |
| **获取方式** | 悲观锁、乐观锁                                                              |
| **可重入性** | 可重入锁、不可重入锁                                                        |
| **共享性**   | 独占锁、共享锁                                                              |
| **阻塞方式** | 阻塞锁、自旋锁、适应性自旋锁                                                |
| **优化策略** | 偏向锁、轻量级锁、重量级锁                                                  |
| **实现方式** | 内置锁（`synchronized`）、显式锁（`ReentrantLock`）、分布式锁（`Redisson`） |

**选择合适的锁取决于：**

- **并发竞争程度**（高竞争→悲观锁，低竞争→乐观锁）
- **任务执行时间**（长任务→公平锁，短任务→非公平锁）
- **读写比例**（读多→共享锁，写多→独占锁）
- **是否需要跨 JVM**（是→分布式锁）

这些分类帮助开发者根据业务场景选择最优的锁策略，平衡 **性能、公平性、一致性**。

### 【中等】悲观锁和乐观锁有什么区别？

以下是悲观锁与乐观锁的详细对比：

| **对比维度**   | **悲观锁**                                                         | **乐观锁**                                              |
| -------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| **核心思想**   | 假定并发冲突必然发生，先加锁再访问数据                             | 假定并发冲突较少，先操作再检测冲突                      |
| **锁机制**     | 显式加锁（阻塞其他线程）                                           | 无锁机制（依赖 CAS 或版本号控制）                       |
| **实现方式**   | `synchronized`、`ReentrantLock`、数据库`SELECT FOR UPDATE`         | `Atomic`类（CAS）、版本号机制、数据库乐观锁（如 MVCC）  |
| **线程阻塞**   | 会阻塞竞争线程（线程挂起）                                         | 不阻塞线程，但可能自旋重试或失败                        |
| **数据一致性** | 强一致性（独占访问）                                               | 最终一致性（可能需重试）                                |
| **适用场景**   | - 写操作频繁<br>- 临界区代码执行时间长<br>- 强一致性要求高         | - 读多写少<br>- 短平快操作<br>- 高吞吐量需求            |
| **性能特点**   | - 高竞争时性能下降明显（线程切换开销）<br>- 低竞争时仍有固定锁开销 | - 低竞争时性能极佳（无阻塞）<br>- 高竞争时 CPU 自旋浪费 |
| **冲突处理**   | 通过锁排队避免冲突                                                 | 通过重试或放弃处理冲突                                  |
| **典型应用**   | - 银行转账<br>- 订单支付<br>- 数据库行级锁                         | - 库存扣减<br>- 计数器<br>- 点赞系统                    |
| **优缺点**     | ✅ 强一致性<br>❌ 吞吐量低、死锁风险                               | ✅ 高并发性能好<br>❌ 实现复杂、可能 ABA 问题           |

**选择建议**：

- **悲观锁**适合"宁可排队等，不能出错"的场景（如金融交易）。
- **乐观锁**适合"宁可重试，不要阻塞"的场景（如电商库存）。

### 【中等】公平锁和非公平锁有什么区别？

**Java 中公平锁和非公平锁的对比**：

| **对比维度**         | **公平锁 (Fair Lock)**                               | **非公平锁 (Nonfair Lock)**                |
| -------------------- | ---------------------------------------------------- | ------------------------------------------ |
| **锁获取顺序**       | 严格按照线程请求顺序（FIFO）分配锁                   | 允许插队，新请求的线程可能直接抢到锁       |
| **性能表现**         | 吞吐量较低（上下文切换频繁）                         | 吞吐量较高（减少线程切换，但可能线程饥饿） |
| **响应时间**         | 等待时间稳定（适合长任务）                           | 短任务可能更快获取锁（适合高并发短任务）   |
| **适用场景**         | - 需要严格公平性<br>- 线程执行时间差异大（避免饥饿） | - 高并发短任务<br>- 追求吞吐量             |
| **锁实现类**         | `ReentrantLock(true)`                                | `ReentrantLock(false)`（默认）             |
| **实现**             | 依赖 AQS 维护等待线程，先到先得                      | 先尝试 CAS 抢锁，失败后进入 AQS 队列       |
| **线程饥饿**         | 不会发生                                             | 可能发生（高并发时某些线程长期无法获取锁） |
| **操作系统调度影响** | 依赖系统线程调度，可能因优先级反转影响公平性         | 更依赖 JVM 的锁优化策略                    |
| **锁重入性**         | 支持（与公平性无关）                                 | 支持（与公平性无关）                       |
| **适用并发模型**     | 适合任务执行时间不均衡的场景                         | 适合任务执行时间短的场景                   |

**如何选择？**

- **选公平锁**：

  - 需要严格顺序执行（如订单处理）
  - 避免低优先级线程饥饿
  - 线程任务执行时间差异大

- **选非公平锁**：
  - 追求高吞吐量（如秒杀系统）
  - 任务执行时间短且均匀
  - 能接受偶尔的线程饥饿

**注意事项：**

- **默认行为**：`ReentrantLock` 和 `synchronized` 默认都是**非公平锁**（因为性能更好）。
- **性能差异**：非公平锁在高并发下吞吐量可提升 **10%~30%**，但可能增加延迟方差。
- **synchronized 的公平性**：Java 的 `synchronized` **不支持公平锁**，仅 `ReentrantLock` 可配置。

### 【中等】synchronized 和 ReentrantLock 有什么区别？

使用差异：

::: code-tabs#synchronized 和 ReentrantLock 使用差异

@tab synchronized 使用

```java
// 1. 用于代码块
synchronized (this) {}
// 2. 用于对象
synchronized (object) {}
// 3. 用于方法
public synchronized void test () {}
// 4. 可重入
for (int i = 0; i < 100; i++) {
	synchronized (this) {}
}
```

@tab ReentrantLock 使用

```java
public void test () throw Exception {
	// 1. 初始化选择公平锁、非公平锁
	ReentrantLock lock = new ReentrantLock(true);
	// 2. 可用于代码块
	lock.lock();
	try {
		try {
			// 3. 支持多种加锁方式，比较灵活；具有可重入特性
			if(lock.tryLock(100, TimeUnit.MILLISECONDS)){ }
		} finally {
			// 4. 手动释放锁
			lock.unlock()
		}
	} finally {
		lock.unlock();
	}
}
```

:::

以下是 **`synchronized`** 和 **`ReentrantLock`** 的详细对比表格，涵盖 **锁机制、功能、性能、使用场景** 等核心维度：

---

| **对比维度**       | **`synchronized`**                                                | **`ReentrantLock`**                                                 |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| **锁类型**         | JVM 内置关键字（隐式锁）                                          | JDK 提供的类（显式锁）                                              |
| **加锁解锁方式**   | 自动加锁/释放锁（进入同步代码块加锁，退出时释放）                 | 需手动调用 `lock()` 和 `unlock()`（必须配合 `try-finally` 使用）    |
| **是否可重入**     | 支持（同一线程可重复获取）                                        | 支持（同一线程可重复获取）                                          |
| **是否支持公平**   | 仅支持非公平锁                                                    | 可配置公平锁或非公平锁（构造函数传参 `true/false`）                 |
| **是否可中断**     | 不支持中断                                                        | 支持 `lockInterruptibly()`，可响应中断                              |
| **是否支持超时**   | 不支持超时                                                        | 支持 `tryLock(timeout, unit)`，可设置超时时间                       |
| **是否支持多条件** | 通过 `wait()`/`notify()` 实现，单一等待队列                       | 支持多个 `Condition`，可精确控制线程唤醒（如 `await()`/`signal()`） |
| **性能**           | JDK 6+ 优化后（偏向锁→轻量级锁→重量级锁）性能接近 `ReentrantLock` | 在高竞争场景下性能略优（减少上下文切换）                            |
| **死锁检测**       | 无内置死锁检测                                                    | 可通过 `tryLock` 避免死锁                                           |
| **适用场景**       | 简单同步场景（如单方法同步）                                      | 复杂同步需求（如公平锁、可中断锁、超时锁）                          |
| **底层实现**       | JVM 通过 `monitorenter`/`monitorexit` 字节码实现                  | 基于 `AbstractQueuedSynchronizer (AQS)` 实现                        |

**关键区别总结**

- **灵活性**

  - `ReentrantLock` 更强大：支持公平锁、可中断、超时、多条件变量。
  - `synchronized` 更简单：自动管理锁，适合基础同步需求。

- **性能差异**：JDK 6 后两者性能接近，但 `ReentrantLock` 在高竞争场景仍略有优势。

- **使用选择建议**

  - **选择 `synchronized`**：
    - 需要简单的代码块同步。
    - 不需要高级功能（如超时、公平锁）。
  - **选择 `ReentrantLock`**：
    - 需要精细控制（如公平性、可中断）。
    - 需要避免死锁（`tryLock`）。

- **注意**
  - `ReentrantLock` **必须手动释放锁**，否则会导致死锁！
  - `synchronized` 是 Java 并发的基础，而 `ReentrantLock` 是它的增强扩展。

**适用场景**

- **`synchronized` 适用场景**：单例模式的双重检查锁、简单的线程安全计数器。
- **`ReentrantLock` 适用场景**：
  - 需要公平性的任务队列（如订单处理）。
  - 需要超时控制的资源争用（如避免死锁）。
  - 复杂的多条件线程协调（如生产者-消费者模型）。

### 【困难】ReentrantLock 的实现原理是什么？

**ReentrantLock 基于 AQS（AbstractQueuedSynchronizer）实现**：

- **核心依赖**：`ReentrantLock` 通过内部类 `Sync`（继承 `AQS`）实现锁机制。
- **AQS 作用**：提供线程阻塞/唤醒的队列管理（CLH 变体）和状态（`state`）的原子操作。

**锁状态（state）管理**

- **`state` 字段**：
  - `=0`：锁未被占用。
  - `>0`：锁被占用，数值表示重入次数（可重入性）。
- **修改方式**：通过 `CAS`（Compare-And-Swap）保证原子性。

**获取锁（公平 / 非公平）**

- **公平锁**（`FairSync`）：严格按照 FIFO 顺序获取锁（先检查队列是否有等待线程）。
  - 先检查是否有前驱节点（队列中有无等待线程），有则排队。
  - 无则尝试 CAS 获取锁。
- **非公平锁**（`NonfairSync`，默认）：新线程直接尝试 CAS 抢锁（可能插队），失败才进入队列。
  - 直接尝试 CAS 修改 `state`（抢锁）。
  - 失败后调用 `AQS.acquire()` 进入队列等待。

**释放锁**

1. 减少 `state` 值（重入次数减 1）。
2. 若 `state=0`，唤醒队列中的下一个线程（通过 `LockSupport.unpark()`）。

**可重入性**

- 记录当前持有锁的线程（`exclusiveOwnerThread`）。
- 同一线程重复获取锁时，`state` 递增（无需重新排队）。

**关键方法**

- **`tryLock()`**：非阻塞尝试获取锁（直接 CAS）。
- **`lockInterruptibly()`**：支持中断的锁获取。
- **`Condition`**：基于 `AQS` 实现多个等待队列（如 `await()`/`signal()`）。

**性能优化**

- **非公平锁**：减少线程切换，提高吞吐量（但可能饥饿）。
- **自旋优化**：短暂自旋尝试获取锁，避免立即入队。

**总结**

`ReentrantLock` 的核心是通过 **AQS 队列 + CAS 操作** 实现：

- **锁竞争**：通过 `state` 和 CLH 队列管理线程阻塞/唤醒。
- **灵活性**：支持公平性、可中断、超时等高级功能。
- **可重入**：记录持有线程和重入次数。

适用于需要精细控制锁行为的场景（如公平性、条件变量）。

### 【困难】AQS 的实现原理是什么？

AQS（**AbstractQueuedSynchronizer**）是 Java 并发包（`java.util.concurrent.locks`）的核心框架，用于构建锁（如 `ReentrantLock`）和同步器（如 `CountDownLatch`、`Semaphore`）。它的核心思想是 **CLH 队列 + CAS + 状态管理**，提供了一种高效、灵活的同步机制。

**关键属性**

- **状态变量（state）**：一个 `volatile` 整型变量，用于表示同步状态。不同的同步组件对 `state` 有不同的解读，例如在 `ReentrantLock` 里，`state` 为 0 表示锁未被持有，大于 0 表示锁已被持有，且重入次数就是 `state` 的值。
- **等待队列（head 和 tail）**：指向 FIFO 队列的头尾节点。队列中的每个节点都代表一个等待获取同步状态的线程。每个 `Node` 包含以下重要属性：
  - **`thread`**：指向等待获取同步状态的线程。
  - **`prev` 和 `next`**：分别指向前一个节点和后一个节点，从而形成双向链表。
  - **`waitStatus`**：表示节点的等待状态，常见的状态有：
    - `CANCELLED`（1）：表示该节点对应的线程已取消等待。
    - `SIGNAL`（-1）：表示该节点的后继节点需要被唤醒。
    - `CONDITION`（-2）：表示该节点处于条件队列中。
    - `PROPAGATE`（-3）：用于共享模式下，表明状态需要向后传播。

**同步模式**

AQS 支持两种同步模式：

- **独占模式**：同一时刻仅允许一个线程获取同步状态，例如 `ReentrantLock`。
  - **获取锁**：
    - 线程调用 `acquire(int)` → `tryAcquire(int)`（子类实现）。
    - 如果成功（`state` 修改成功），则获取锁。
    - 如果失败，线程被封装成 `Node` 加入 **CLH 队列**，并进入 `park()` 等待。
  - **释放锁**：
    - 线程调用 `release(int)` → `tryRelease(int)`（子类实现）。
    - 如果成功，唤醒队列中的下一个线程（`unparkSuccessor`）。
- **共享模式**：同一时刻允许多个线程获取同步状态，例如 `CountDownLatch` 和 `Semaphore`。
  - **获取锁**：
    - 线程调用 `acquireShared(int)` → `tryAcquireShared(int)`（子类实现）。
    - 如果成功（返回 `≥0`），获取锁；否则进入队列等待。
  - **释放锁**：
    - 线程调用 `releaseShared(int)` → `tryReleaseShared(int)`（子类实现）。
    - 如果成功，唤醒后续等待的线程（可能多个）。

**关键方法**

- **独占模式**
  - **`tryAcquire(int arg)`**：尝试以独占模式获取同步状态，此方法需由子类实现。
  - **`acquire(int arg)`**：以独占模式获取同步状态，若获取失败则将线程加入队列并阻塞。
  - **`tryRelease(int arg)`**：尝试以独占模式释放同步状态，需子类实现。
  - **`release(int arg)`**：以独占模式释放同步状态，若释放成功则唤醒队列中的后继节点。
- **共享模式**
  - **`tryAcquireShared(int arg)`**：尝试以共享模式获取同步状态，需子类实现。
  - **`acquireShared(int arg)`**：以共享模式获取同步状态，若获取失败则将线程加入队列并阻塞。
  - **`tryReleaseShared(int arg)`**：尝试以共享模式释放同步状态，需子类实现。
  - **`releaseShared(int arg)`**：以共享模式释放同步状态，若释放成功则唤醒队列中的后继节点。

::: info AQS 核心机制

**CAS（Compare-And-Swap）**

使用 `Unsafe` 类的 `compareAndSwapXXX` 方法保证 `state` 和队列操作的原子性。

例如：

```java
protected final boolean compareAndSetState(int expect, int update) {
    return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
}
```

**自旋 + `park()` 等待**

- 线程在入队前会自旋尝试获取锁（减少上下文切换）。
- 如果仍然失败，则调用 `LockSupport.park()` 挂起线程。

**公平性控制**

- **公平锁**：严格按照 CLH 队列顺序获取锁（`hasQueuedPredecessors()` 检查是否有前驱节点）。
- **非公平锁**：新线程可以插队（`tryAcquire` 直接尝试获取锁，不检查队列）。

:::

::: tip 扩展

[从 ReentrantLock 的实现看 AQS 的原理及应用](https://tech.meituan.com/2019/12/05/aqs-theory-and-apply.html)

:::

### 【困难】ReentrantReadWriteLock 的实现原理是什么？

**ReentrantReadWriteLock 是为【读多写少】的并发场景设计的锁实现**。

**ReentrantReadWriteLock 允许多个线程同时持有读锁，但同一时刻只允许一个线程持有写锁**。此外，存在读锁时无法获取写锁，存在写锁时无法获取读锁。

ReentrantReadWriteLock 有以下特性：

- **可重入**：读写锁都支持可重入。
- **支持公平锁**，默认为非公平锁。
- **支持锁降级**：**持有写锁可以获取读锁；反之不允许**。

**ReentrantReadWriteLock 基于 AQS 实现的读写锁**，其**核心设计思想是将一个 32 位的 int 状态变量拆分为两部分**：

- **高 16 位**：表示读锁的持有数量（包括重入次数）
- **低 16 位**：表示写锁的重入次数

```
状态变量结构：
+-------------------------------+-------------------------------+
|         读锁状态 (16 位）        |         写锁状态 (16 位）        |
+-------------------------------+-------------------------------+
```

**写锁实现（WriteLock）**

- 排他锁，使用 AQS 的独占模式
- 获取条件：
  - 读锁计数为 0（没有读锁）
  - 写锁计数为 0 或当前线程已持有写锁（可重入）
- 实现方法：
  ```java
  protected final boolean tryAcquire(int acquires) {
      // 检查是否有读锁或其他线程持有写锁
      if (c != 0 && w == 0) return false;
      // 检查重入或 CAS 设置状态
      // ...
  }
  ```

**读锁实现（ReadLock）**

- 共享锁，使用 AQS 的共享模式
- 获取条件：
  - 没有线程持有写锁，或写锁被当前线程持有（锁降级）
- 实现特点：
  - 使用 ThreadLocal 记录每个线程的重入次数
  - 第一个获取读锁的线程会记录自己（firstReader）
  - 后续线程使用 cachedHoldCounter 优化性能

**锁降级实现**

```java
// 锁降级示例代码
writeLock.lock();         // 获取写锁
try {
    // 修改数据。..
    readLock.lock();      // 在保持写锁的情况下获取读锁（锁降级关键步骤）
} finally {
    writeLock.unlock();  // 释放写锁，降级为读锁
}
// 此时仍持有读锁，其他线程可以获取读锁但不能获取写锁
```

**关键数据结构**

**HoldCounter**

```java
static final class HoldCounter {
    int count;          // 重入次数
    final long tid = Thread.currentThread().getId(); // 线程 ID
}
```

**ThreadLocalHoldCounter**

```0java
static final class ThreadLocalHoldCounter
    extends ThreadLocal<HoldCounter> {
    public HoldCounter initialValue() {
        return new HoldCounter();
    }
}
```

**性能优化技巧**

- **firstReader 优化**：记录第一个获取读锁的线程，避免 ThreadLocal 查找
- **cachedHoldCounter**：缓存最近一个获取读锁的线程计数器
- **读锁计数存储**：使用 ThreadLocal 保存每个线程的重入次数，避免竞争

### 【困难】StampedLock 的实现原理是什么？

`StampedLock`是 JDK8 引入的高性能锁，**适合读多写少且追求极致吞吐的场景**，但需谨慎处理乐观读失败和死锁风险。

StampedLock 通过**版本号+状态位拆分**实现无锁读，牺牲重入性和公平性换取更高吞吐，适合短期读操作的并发场景。

**StampedLock 支持三种锁模式**：

- **写锁（独占锁）**：类似`ReentrantLock`，同一时刻只有一个线程能获取。阻塞其他所有读锁和写锁请求。
- **悲观读锁（共享锁）**：允许多线程并发读，但会阻塞写锁请求（类似`ReentrantReadWriteLock`的读锁）。
- **乐观读（无锁优化）**：不阻塞写操作，仅通过`tryOptimisticRead()`获取一个"邮戳"（版本号），读完后需校验邮戳是否有效（未被写操作修改）。

**特性**

- **更高的并发度**：乐观读允许读操作与写操作并发执行（无阻塞）。
- **不可重入**：锁不可重入，嵌套获取可能导致死锁。
- **支持锁升级/降级**：
  - **锁降级**：写锁→悲观读锁（类似`ReentrantReadWriteLock`）。
  - **锁升级**：乐观读→悲观读锁或写锁（需校验邮戳后尝试转换）。
- **不支持 `Condition`**：不能像`ReentrantLock`那样使用`await()`/`signal()`。

**StampedLock vs. ReentrantReadWriteLock**

| 特性         | `StampedLock`        | `ReentrantReadWriteLock` |
| ------------ | -------------------- | ------------------------ |
| **读并发度** | 最高（乐观读无阻塞） | 高（悲观读阻塞写）       |
| **写饥饿**   | 可能发生             | 非公平模式下可能发生     |
| **锁重入**   | 不支持               | 支持                     |
| **公平性**   | 仅非公平             | 支持公平/非公平          |
| **条件变量** | 不支持               | 支持                     |

**状态设计**

- **64 位长整型状态变量**（`state`）拆分为三部分：
  - **写锁标记**（最低位）：`WBIT`（写锁占用标志）
  - **版本号**（中间 7 位）：乐观读的邮戳版本
  - **读锁计数**（剩余 56 位）：记录悲观读锁的持有数量

```
State 结构：
[读锁计数 (56 位） | 版本号 (7 位） | 写锁标记 (1 位）]
```

**关键操作实现**

**写锁获取**

- **CAS 设置 WBIT 位**：若成功则获取写锁，失败则进入队列等待
- **版本号+1**：每次写锁释放时递增版本号（保证乐观读的可见性）

**悲观读锁获取**

- **检查无写锁**（WBIT=0）时通过 CAS 增加读计数
- **写锁占用时**：进入等待队列（类似 AQS 的 CLH 队列）

**乐观读实现**

1. 调用`tryOptimisticRead()`获取当前版本号（不修改状态）
2. 读取共享数据
3. 调用`validate(stamp)`检查版本号是否变化（无写操作则有效）

**锁转换机制**

**tryConvertToXLock()**：核心转换方法（避免释放再获取的开销）

- 乐观读→悲观读：验证邮戳后直接获取读锁
- 读锁→写锁：当读计数=1 且当前线程唯一持有读锁时可转换

**性能优化手段**

- **无锁乐观读**：完全不阻塞写操作（通过版本号校验）
- **延迟唤醒**：读锁释放时不立即唤醒等待线程（减少竞争）
- **自旋优化**：短时冲突时先自旋再入队（类似 AQS）

**与 AQS 的差异**

- **非 AQS 实现**：独立的状态机设计（更轻量）
- **无公平性**：所有锁均为非公平模式
- **无条件队列**：不支持`Condition`功能

**典型使用示例**

```java
StampedLock lock = new StampedLock();

// 乐观读示例
long stamp = lock.tryOptimisticRead();
// 读取共享数据。..
if (!lock.validate(stamp)) {
    // 版本失效，转悲观读
    stamp = lock.readLock();
    try {
        // 重新读取数据。..
    } finally {
        lock.unlockRead(stamp);
    }
}

// 写锁示例
long stamp = lock.writeLock();
try {
    // 修改数据。..
} finally {
    lock.unlockWrite(stamp);
}
```

## Java 无锁

### 【中等】什么是 CAS？CAS 的实现原理是什么？

::: info 什么是 CAS？

:::

**CAS（Compare-And-Swap，比较并交换）** 是一种 **无锁（Lock-Free）** 的并发编程技术，基于 **比较-交换** 实现原子操作。它是现代并发编程的基石，被广泛应用于 Java 的 `Atomic` 类、`ReentrantLock`、`ConcurrentHashMap` 等并发工具中。

CAS 底层实现依赖 CPU 指令（如 `CMPXCHG`），通过 `Unsafe` 类调用本地方法。

CAS 的核心应用有：原子类、自旋锁、无锁数据结构（如 `ConcurrentHashMap`）。

**CAS 的核心思想**：

- **比较**：检查某个内存位置的值是否等于预期值（Expected Value）。
- **交换**：如果相等，则更新为新值（New Value），否则不做任何操作。
- **原子性**：整个操作由 **CPU 指令** 保证不可分割，不会出现线程安全问题。

::: info CAS 的实现原理是什么？

:::

**（1）底层 CPU 指令支持**

**在 Java 中，通过 `Unsafe` 类调用本地方法（Native Method）实现 CAS**。更底层的实现依赖于 **硬件指令**（如 x86 的 `CMPXCHG`、ARM 的 `LL/SC`），确保操作是原子的。

```java
public final native boolean compareAndSwapInt(Object o, long offset, int expected, int newValue);
```

**（2）CAS 操作流程**

```java
// 伪代码
boolean CAS(Variable var, int expected, int newValue) {
    if (var.value == expected) {  // 比较当前值是否等于预期值
        var.value = newValue;     // 如果相等，更新为新值
        return true;
    }
    return false;  // 否则失败
}
```

**实际执行流程**：

1. 读取内存值 `V`。
2. 比较 `V` 和预期值 `A`：
   - 如果 `V == A`，说明没有其他线程修改过，更新为 `B`。
   - 如果 `V != A`，说明值已被修改，放弃更新。
3. 返回操作是否成功。

**（3）Java 中的 CAS 实现（以 AtomicInteger 为例）**

```java
AtomicInteger count = new AtomicInteger(0);

// CAS 操作：如果当前值是 0，则设置为 1
boolean success = count.compareAndSet(0, 1);  // 内部调用 Unsafe.compareAndSwapInt
```

**底层实现**：

```java
public final boolean compareAndSet(int expect, int update) {
    return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
}
```

其中：

- `this`：目标对象（如 `AtomicInteger` 实例）。
- `valueOffset`：字段在对象内存中的偏移量（通过 `Unsafe.objectFieldOffset` 获取）。
- `expect`：预期值。
- `update`：新值。

**CAS 的典型应用**

**（1）原子类**

```java
AtomicInteger atomicInt = new AtomicInteger(0);
atomicInt.incrementAndGet();  // CAS 实现原子自增
```

**底层实现**：

```java
public final int incrementAndGet() {
    return unsafe.getAndAddInt(this, valueOffset, 1) + 1;
}
```

**（2）自旋锁**

```java
while (!CAS(lock, 0, 1)) {  // 尝试获取锁
    // 自旋等待
}
```

**（3）无锁数据结构**

- `ConcurrentHashMap`（JDK 8 使用 CAS + `synchronized` 替代分段锁）。
- `CopyOnWriteArrayList`（CAS 保证写入原子性）。

**CAS 的优缺点**

**优点**

| 优点       | 说明                         |
| ---------- | ---------------------------- |
| **无锁**   | 避免线程阻塞，减少上下文切换 |
| **高性能** | 在低竞争场景下比锁更高效     |
| **可扩展** | 适合高并发读多写少场景       |

**缺点**

| 缺点           | 说明                               |
| -------------- | ---------------------------------- |
| **ABA 问题**   | 值从 `A→B→A`，CAS 无法感知中间变化 |
| **自旋开销**   | 高竞争时 CPU 空转                  |
| **单变量限制** | 只能保证一个变量的原子性           |
| **公平性问题** | 无法保证先来先服务                 |

**CAS vs 锁**

| 对比项       | CAS              | 锁（如 synchronized）              |
| ------------ | ---------------- | ---------------------------------- |
| **实现方式** | 无锁（CPU 指令） | 阻塞（JVM 管理）                   |
| **性能**     | 低竞争时更优     | 高竞争时更稳定                     |
| **适用场景** | 简单原子操作     | 复杂临界区保护                     |
| **公平性**   | 非公平           | 可公平（如 `ReentrantLock(true)`） |

### 【中等】CAS 算法存在哪些问题？

CAS（Compare-And-Swap）是一种无锁并发编程技术，广泛用于 Java 的 `Atomic` 类、AQS、`ConcurrentHashMap` 等并发工具中。但它也存在一些问题和限制：

**ABA 问题**

- **问题描述**：变量值从 `A` → `B` → `A`，CAS 检查时认为没有变化，但实际上已经被修改过。
- **影响**：可能导致数据不一致（如链表操作时节点被替换但指针仍有效）。
- **解决方案**：
  - 使用 **版本号/时间戳**（如 `AtomicStampedReference`）。
  - 使用 `boolean` 标记（如 `AtomicMarkableReference`）。

**自旋产生的 CPU 空转**

- **问题描述**：如果 CAS 长时间失败，线程会持续自旋（`while` 循环），占用 CPU 资源。
- **影响**：高并发竞争时，可能导致 CPU 使用率飙升。
- **解决方案**：
  - 限制自旋次数（如 `LongAdder` 改用分段 CAS）。
  - 结合 `yield()` 或 `Thread.sleep()` 减少竞争。

**只能保证单个变量的原子性**

- **问题描述**：CAS 只能对一个变量进行原子操作，无法保证多个变量的复合操作（如 `i++` 和 `j--`）。
- **影响**：需要额外同步机制（如锁）来保证多变量一致性。
- **解决方案**：
  - 使用 `synchronized` 或 `ReentrantLock`。
  - 设计不可变对象（如 `String`、`BigInteger`）。

**公平性问题**

- **问题描述**：CAS 是非公平的，新线程可能比等待队列中的线程更快获取锁。
- **影响**：可能导致线程饥饿（某些线程长期得不到执行）。
- **解决方案**：
  - 使用公平锁（如 `ReentrantLock(true)`）。
  - 结合队列调度（如 AQS 的 CLH 队列）。

**不适用于复杂操作**

- **问题描述**：CAS 适合简单操作（如 `count++`），但不适合复杂逻辑（如数据库事务）。
- **影响**：需要拆分为多个 CAS 步骤，可能引入中间状态不一致。
- **解决方案**：
  - 使用锁（如 `synchronized`）。
  - 改用事务内存（如 Clojure STM）。

**平台依赖性**

- **问题描述**：CAS 依赖底层 CPU 指令（如 `CMPXCHG`），不同架构性能可能差异较大。
- **影响**：在 ARM 等弱内存模型平台可能出现意外行为。
- **解决方案**：使用 JVM 内置原子类（如 `AtomicInteger`），而非手动实现。

**总结**

| 问题           | 影响           | 解决方案                 |
| -------------- | -------------- | ------------------------ |
| **ABA 问题**   | 数据不一致     | `AtomicStampedReference` |
| **自旋开销**   | CPU 占用高     | 限制自旋次数 / 退让策略  |
| **单变量限制** | 复合操作不安全 | 锁 / 不可变对象          |
| **公平性**     | 线程饥饿       | 公平锁 / 队列调度        |
| **复杂操作**   | 难以实现       | 锁 / 事务内存            |
| **平台依赖**   | 跨平台兼容性差 | 使用标准库               |

CAS 在无锁编程中非常高效，但需结合场景权衡利弊。在高竞争环境下，可能需要改用锁或其他并发策略。

### 【中等】什么是 ThreadLocal？

::: info 什么是 ThreadLocal？

:::

在多线程环境下，共享变量存在并发安全问题。换个思路，如果变量非共享，而是各个线程独享，就不会有并发安全问题。这种思想有个术语叫**线程封闭**，其本质上就是避免共享。没有共享，自然也就没有并发安全问题。在 Java 中，`ThreadLocal` 正是根据这个思路而设计的。

**`ThreadLocal` 为每个线程都创建了一个本地副本**，这个副本只能被当前线程访问，其他线程无法访问，那么自然是线程安全的。

::: info ThreadLocal 有哪些应用场景？

:::

**（1）存储线程私有数据**

- **用户会话（Session）管理**：每个请求线程存储当前用户的 `Session`。

  ```java
  private static final ThreadLocal<User> currentUser = ThreadLocal.withInitial(() -> null);

  // 设置当前用户
  currentUser.set(user);
  // 获取当前用户
  User user = currentUser.get();
  ```

- **数据库连接（Connection）管理**：避免传递 `Connection` 参数。
  ```java
  private static final ThreadLocal<Connection> connectionHolder =
      ThreadLocal.withInitial(() -> dataSource.getConnection());
  ```

**避免参数透传**

**问题**：多层方法调用需要透传某个上下文参数（如 `traceId`）。

**解决**：使用 `ThreadLocal` 存储，避免方法参数传递。

```java
private static final ThreadLocal<String> traceIdHolder = new ThreadLocal<>();

// 在入口处设置 traceId
traceIdHolder.set("req-123");

// 在任意深层方法获取
String traceId = traceIdHolder.get(); // 无需透传参数
```

**（3）线程安全的工具类**

**例如**：`SimpleDateFormat` 是线程不安全的，但可以用 `ThreadLocal` 包装：

```java
private static final ThreadLocal<SimpleDateFormat> dateFormatHolder =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));

// 线程安全地使用
String formattedDate = dateFormatHolder.get().format(new Date());
```

**最佳实践**

（1）**尽量用 `static final`**

```java
private static final ThreadLocal<User> userHolder = new ThreadLocal<>();
```

避免重复创建 `ThreadLocal` 实例。

（2）**必须调用 `remove()`**

尤其在线程池场景，否则会导致内存泄漏。

（3）**推荐初始化默认值**

```java
ThreadLocal<User> userHolder = ThreadLocal.withInitial(() -> new User());
```

（4）**避免在父子线程间传递**

`ThreadLocal` 不能自动继承，需手动处理（可用 `InheritableThreadLocal`）。

### 【中等】`ThreadLocal` 的原理是什么？

**内部结构**

`ThreadLocal` 主要依赖于两个类：`ThreadLocal` 自身和 `ThreadLocalMap`。

- **`Thread` 类**：每个 `Thread` 对象内部都有一个类型为 `ThreadLocalMap` 的成员变量 `threadLocals`，用于存储该线程的所有 `ThreadLocal` 变量及其对应的值。
- **`ThreadLocalMap`**：它是 `ThreadLocal` 的一个静态内部类，类似于 `HashMap`，但它使用弱引用的 `ThreadLocal` 对象作为键，值则是用户设置的对象。

**存储机制**

- 当调用 `ThreadLocal` 的 `set` 方法时，它会首先获取当前线程的 `ThreadLocalMap`。
- 如果 `ThreadLocalMap` 存在，则以当前 `ThreadLocal` 对象为键，将值存储到 `ThreadLocalMap` 中。
- 如果 `ThreadLocalMap` 不存在，则创建一个新的 `ThreadLocalMap`，并将当前 `ThreadLocal` 对象和值作为第一个元素存入其中。

**获取机制**

- 当调用 `ThreadLocal` 的 `get` 方法时，它会先获取当前线程的 `ThreadLocalMap`。
- 如果 `ThreadLocalMap` 存在，则以当前 `ThreadLocal` 对象为键去查找对应的值。
- 如果 `ThreadLocalMap` 不存在或者没有找到对应的值，则调用 `initialValue` 方法（可以通过继承 `ThreadLocal` 类并重写该方法来设置初始值）来获取初始值，并将其存储到 `ThreadLocalMap` 中。

**弱引用机制**

`ThreadLocalMap` 的键是对 `ThreadLocal` 对象的弱引用。这意味着当外部对 `ThreadLocal` 对象的强引用被释放后，`ThreadLocal` 对象会在下次垃圾回收时被回收。这样可以避免内存泄漏，因为如果使用强引用，即使外部不再使用 `ThreadLocal` 对象，它也不会被回收，从而导致 `ThreadLocalMap` 中的条目一直存在。

### 【中等】如何解决 `ThreadLocal` 内存泄漏问题？

**ThreadLocal 的内存泄漏问题源于其特殊的 "弱引用 Key + 强引用 Value" 存储结构**，主要发生在以下两种场景：

**(1) Key 被回收，Value 残留（主要泄漏场景）**

- `ThreadLocal` 实例（Key）是**弱引用**，会被 GC 回收
- 对应的 Value 是**强引用**，会持续占用内存
- 导致 `ThreadLocalMap` 中出现 `key=null` 但 `value≠null` 的无效 Entry

**(2) 线程长期存活时的累积泄漏**

- 线程池复用线程（如 Tomcat worker 线程）
- 每次任务执行后未调用 `remove()`
- 导致多个无效 Entry 堆积在 `ThreadLocalMap` 中

::: code-tabs#内存泄漏的具体场景

@tab 线程池环境未清理

```java
ExecutorService pool = Executors.newFixedThreadPool(5);
ThreadLocal<BigObject> tl = new ThreadLocal<>();

pool.execute(() -> {
    tl.set(new BigObject());  // 存储大对象
    // 业务逻辑。..
    // 缺少 tl.remove()！线程复用后旧 Value 仍然存在
});
```

**后果**：线程被重复使用时，之前的 `BigObject` 实例无法被回收

@tab 静态 ThreadLocal 长期持有

```java
static final ThreadLocal<User> userHolder = new ThreadLocal<>();

void processRequest() {
    userHolder.set(new User()); // 每次请求新 User 对象
    // 业务逻辑。..
    // 忘记调用 userHolder.remove()
}
```

**后果**：Web 应用中，线程处理多个请求后，内存中堆积多个废弃 `User` 对象

@tab 使用非 static 的 ThreadLocal

```java
class Service {
    ThreadLocal<Config> configHolder = new ThreadLocal<>(); // 非 static

    void serve() {
        configHolder.set(loadConfig());
        // ...
    }
}
```

**后果**：每次创建 Service 实例都会产生新的 ThreadLocal，增加内存泄漏风险

:::

**解决方案与最佳实践**

**(1) 强制清理方案**

| 方案            | 实现方式           | 适用场景   |
| --------------- | ------------------ | ---------- |
| **try-finally** | 确保 remove() 执行 | 通用场景   |
| **拦截器清理**  | AOP/@Around        | Web 应用   |
| **线程池钩子**  | `afterExecute`     | 线程池任务 |

**代码示例**：

```java
// 方案 1：try-finally（推荐）
try {
    threadLocal.set(data);
    // 业务逻辑。..
} finally {
    threadLocal.remove();
}

// 方案 2：Spring 拦截器
@Override
public void afterCompletion(HttpServletRequest request,
                          HttpServletResponse response,
                          Object handler, Exception ex) {
    threadLocal.remove();
}
```

**(2) 设计优化方案**

1. **使用 static final 修饰**

   ```java
   private static final ThreadLocal<User> holder = new ThreadLocal<>();
   ```

   - 避免重复创建 ThreadLocal 实例

2. **初始化默认值**

   ```java
   ThreadLocal.withInitial(() -> new LightweightObject());
   ```

   - 避免持有大对象

3. **改用 InheritableThreadLocal**（需谨慎）

   - 适用于需要父子线程传递数据的场景

**ThreadLocalMap 的自动清理机制**

虽然 ThreadLocalMap 有部分自清理能力，但**不可依赖**：

- **set() 触发清理**：探测式清理（expungeStaleEntry）
- **get() 触发清理**：启发式清理（cleanSomeSlots）
- **remove() 触发清理**：完全清理指定 Entry

**重要结论**：

- 自动清理不彻底（只清理部分无效 Entry）
- 高并发场景可能清理不及时
- **必须显式调用 remove()**

### 【中等】InheritableThreadLocal 的实现原理是什么？

**核心设计目标**

- **线程间值继承**：子线程自动继承父线程的 ThreadLocal 值
- **与 ThreadLocal 兼容**：继承自`ThreadLocal`，保持相同 API

**数据存储位置**

继承自`ThreadLocal`，但使用线程对象的**独立字段**；`Thread.inheritableThreadLocals`（专门存储可继承的变量）

**线程创建时的值拷贝**

- **触发时机**：当父线程创建子线程（`Thread.init()`方法）
- **拷贝逻辑**：

  ```java
  if (parent.inheritableThreadLocals != null) {
      this.inheritableThreadLocals =
          ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);
  }
  ```

- **深拷贝保证隔离**：子线程获得父线程值的独立副本（修改互不影响）

**值传递规则**

- **仅初始化时拷贝**：子线程创建后父线程对值的修改不再影响子线程
- **浅拷贝问题**：若存储引用对象，父子线程仍共享同一对象（需开发者自行处理线程安全）

**与 ThreadLocal 的对比**

| 特性         | `InheritableThreadLocal`           | `ThreadLocal`         |
| ------------ | ---------------------------------- | --------------------- |
| **继承性**   | 子线程自动继承父线程值             | 完全隔离              |
| **存储字段** | `Thread.inheritableThreadLocals`   | `Thread.threadLocals` |
| **性能开销** | 略高（需初始化时拷贝数据）         | 更低                  |
| **使用场景** | 需要跨线程传递上下文（如 TraceID） | 线程私有数据          |

**使用注意事项**

- **对象共享风险**：若值是可变的引用对象，需自行保证线程安全
- **线程池陷阱**：线程池复用线程时会导致旧值残留（需手动清理）
- **性能影响**：大量线程创建时，值拷贝可能成为瓶颈

**典型应用场景**

```java
// 父线程设置值
InheritableThreadLocal<String> itl = new InheritableThreadLocal<>();
itl.set("parent_value");

new Thread(() -> {
    // 子线程自动读取到父线程设置的值
    System.out.println(itl.get()); // 输出：parent_value
}).start();
```

**实现局限**

- **不支持动态更新**：子线程启动后父线程的修改不可见
- **无回调机制**：无法像`ThreadLocal`的`initialValue()`那样自定义子线程初始值

### 【中等】Java 中支持哪些原子类？

原子性是确保并发安全三大特性之一。为了兼顾原子性以及锁带来的性能问题，Java 引入了 CAS （主要体现在 `Unsafe` 类）来实现非阻塞同步（也叫乐观锁），CAS 底层基于 CPU 指令（硬件支持）支持，具有原子性。并基于 CAS ，提供了一套原子工具类。

原子类**比锁的粒度更细，更轻量级**，并且对于在多处理器系统上实现高性能的并发代码来说是非常关键的。原子变量将发生竞争的范围缩小到单个变量上。

原子类相当于一种泛化的 `volatile` 变量，能够**支持原子的、有条件的读/改/写操**作。

原子类可以分为 5 个类别，这 5 个类别提供的方法基本上是相似的：

- **基本数据类型**：基本数据类型原子类针对 Java 基本类型提供原子操作。
  - `AtomicBoolean` - 布尔类型原子类
  - `AtomicInteger` - 整型原子类
  - `AtomicLong` - 长整型原子类
- **引用数据类型**：Java 数据类型分为 **基本数据类型** 和 **引用数据类型** 两大类（不了解 Java 数据类型划分可以参考： [Java 基本数据类型](https://dunwu.github.io/waterdrop/pages/17bf2e10/) ）。如果想针对引用类型做原子操作怎么办？Java 也提供了相关的原子类：
  - `AtomicReference` - 引用类型原子类
  - `AtomicMarkableReference` - 带有标记位的引用类型原子类
  - `AtomicStampedReference` - 带有版本号的引用类型原子类
- **数组数据类型**：**数组类型的原子类为数组元素提供了 `volatile` 类型的访问语义**，这是普通数组所不具备的特性——**`volatile` 类型的数组仅在数组引用上具有 `volatile` 语义**。
  - `AtomicIntegerArray` - 整形数组原子类
  - `AtomicLongArray` - 长整型数组原子类
  - `AtomicReferenceArray` - 引用类型数组原子类
- **属性更新器类型**：**属性更新器支持基于反射机制的更新字段值的原子操作**。
  - `AtomicIntegerFieldUpdater` - 整型字段的原子更新器
  - `AtomicLongFieldUpdater` - 长整型字段的原子更新器
  - `AtomicReferenceFieldUpdater` - 原子更新引用类型里的字段
- **累加器**：相比原子化的基本数据类型，速度更快，但是不支持 `compareAndSet()` 方法。
  - `DoubleAdder` - 浮点型原子累加器
  - `LongAdder` - 长整型原子累加器。
  - `DoubleAccumulator` - 更复杂的浮点型原子累加器
  - `LongAccumulator` - 更复杂的长整型原子累加器

**原子类底层实现**

所有原子类都基于 **Unsafe + CAS** 实现：

```java
public final int getAndIncrement() {
    return unsafe.getAndAddInt(this, valueOffset, 1);
}
```

- `Unsafe`：直接操作内存（CAS 原子指令）
- `valueOffset`：字段内存偏移量

**适用场景**

- **读多写少**：`AtomicXXX`
- **高并发写**：`LongAdder`
- **无锁数据结构**：`AtomicReference` + CAS

**注意事项**

- 原子类 **不适用于复合操作**（如 `check-then-act`，仍需锁）
- `LongAdder` 适合统计，但 **不保证实时精确值**（调用 `sum()` 时才合并）。`LongAdder` 在操作后的返回值只是一个近似准确的数值，但是 `LongAdder` 最终返回的是一个准确的数值，所以在一些对实时性要求比较高的场景下，`LongAdder` 并不能取代 `AtomicInteger` 或 `AtomicLong`。