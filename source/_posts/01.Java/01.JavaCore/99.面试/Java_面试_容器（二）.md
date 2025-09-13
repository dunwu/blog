---
title: Java 容器面试二
date: 2024-07-03 07:44:02
categories:
  - Java
  - JavaCore
  - 面试
tags:
  - Java
  - JavaCore
  - 面试
  - 容器
permalink: /pages/670b8cb5/
---

# Java 容器面试二

## Map

### 【中等】HashMap 和 Hashtable 有什么区别？

`HashMap` 更高效且灵活，`Hashtable` 线程安全但过时，推荐用 `ConcurrentHashMap` 替代。

| **对比项**         | **HashMap** (JDK 1.2+)                      | **Hashtable** (JDK 1.0)                   |
| ------------------ | ------------------------------------------- | ----------------------------------------- |
| **线程安全**       | ❌ 非线程安全（需额外同步）                 | ✅ 线程安全（方法用 `synchronized` 修饰） |
| **性能**           | ⚡ 更高（无锁竞争）                         | ⏳ 较低（同步开销）                       |
| **Null 键/值**     | ✅ 允许 `null` 键和值                       | ❌ 不允许 `null`                          |
| **迭代器**         | **`fail-fast`**（快速失败，并发修改抛异常） | **`enumerator`**（不抛异常）              |
| **继承体系**       | 继承 `AbstractMap`                          | 继承 `Dictionary`（已过时）               |
| **初始容量与扩容** | 默认 16，扩容为 2 倍                        | 默认 11，扩容为 2 倍 + 1                  |
| **哈希冲突解决**   | 链表 + 红黑树（JDK 8+）                     | 仅链表                                    |

**使用建议**：

- **优先用 `HashMap`**：大多数场景（性能更好），搭配 `Collections.synchronizedMap()` 或 `ConcurrentHashMap` 实现线程安全。
- **`Hashtable` 适用场景**：遗留系统兼容，或需要简单线程安全且不介意性能损耗时（现代开发已少用）。

### 【中等】对比一下 HashMap 和 HashSet？

- `HashMap` 是 **键值对容器**，适合快速键值查询。
- `HashSet` 是 **唯一元素集合**，基于 `HashMap` 实现，仅关注元素是否存在。

**核心区别**

| **特性**      | **HashMap**                         | **HashSet**                                |
| ------------- | ----------------------------------- | ------------------------------------------ |
| **数据结构**  | 哈希表（键值对存储）                | 基于 `HashMap`（仅用键，值固定为虚拟对象） |
| **存储内容**  | 键（Key） + 值（Value）             | 仅存储元素（Key）                          |
| **重复规则**  | **Key 不可重复**（Value 可重复）    | **元素（Key）不可重复**                    |
| **Null 支持** | 允许 1 个 `null` 键和多个 `null` 值 | 允许 1 个 `null` 元素                      |

**常用方法对比**

| **操作**     | **HashMap**          | **HashSet**                       |
| ------------ | -------------------- | --------------------------------- |
| **添加元素** | `put(key, value)`    | `add(element)`                    |
| **查询元素** | `get(key)`（返回值） | `contains(element)`（返回布尔值） |
| **删除元素** | `remove(key)`        | `remove(element)`                 |

**底层机制**

`HashSet` 内部直接使用 `HashMap` 实现，元素作为 `Key`，值固定为一个虚拟的 `PRESENT` 对象（占位符）。

两者均依赖哈希表，平均时间复杂度为 `O(1)`（冲突时可能退化为 `O(n)`）。

```java
// HashSet 的简化实现（本质是 HashMap 的包装）
public class HashSet<E> {
    private HashMap<E, Object> map;  // 键存储元素，值固定为 PRESENT
    private static final Object PRESENT = new Object();
    public boolean add(E e) {
        return map.put(e, PRESENT) == null;  // 若 Key 已存在，返回 false
    }
}
```

**使用场景**

- **`HashMap`**：需通过键快速访问值的场景（如缓存、数据库索引）。 示例：`用户 ID → 用户详细信息`。
- **`HashSet`**： 需存储唯一元素的集合（如去重、黑名单）。示例：`IP 黑名单`、`单词去重`。

### 【中等】HashMap、TreeMap、LinkedHashMap 有什么区别？

**核心特性**

| **特性**       | **HashMap**                     | **TreeMap**                        | **LinkedHashMap**             |
| -------------- | ------------------------------- | ---------------------------------- | ----------------------------- |
| **底层结构**   | 哈希表（数组+链表/红黑树）      | 红黑树（平衡二叉搜索树）           | 哈希表 + 双向链表             |
| **顺序性**     | 无序                            | 按键的自然顺序或自定义顺序排序     | 保持插入顺序或访问顺序（LRU） |
| **null 支持**  | 允许 1 个 null 键和多个 null 值 | 不允许 null 键（除非自定义比较器） | 同 HashMap                    |
| **线程安全**   | 非线程安全                      | 非线程安全                         | 非线程安全                    |
| **时间复杂度** | 平均 O(1)                       | 增删查 O(log n)                    | 平均 O(1)                     |

**排序与顺序**

- **HashMap**：完全无序，迭代顺序不可预测。
- **TreeMap**：默认按键的自然顺序排序（Key 需实现`Comparable`）。可通过`Comparator`自定义排序规则。
- **LinkedHashMap**：默认保持**插入顺序**。可配置为**访问顺序**（最近最少使用 LRU）。

**使用场景**

- **HashMap**：
  - 需要最高效的查找、插入和删除操作。
  - 不关心元素的顺序。
  - 示例：缓存、快速查找表。
- **TreeMap**：
  - 需要元素按键排序。
  - 需要范围查询（如`subMap()`、`headMap()`、`tailMap()`）。
  - 示例：字典、有序事件调度。
- **LinkedHashMap**：
  - 需要保持插入顺序或实现 LRU 缓存。
  - 示例：记录访问顺序的缓存、需要按插入顺序迭代的场景。

**性能对比**

| **操作**     | **HashMap** | **TreeMap** | **LinkedHashMap** |
| ------------ | ----------- | ----------- | ----------------- |
| **插入**     | O(1)        | O(log n)    | O(1)              |
| **删除**     | O(1)        | O(log n)    | O(1)              |
| **查找**     | O(1)        | O(log n)    | O(1)              |
| **迭代顺序** | 无序        | 有序（Key） | 插入/访问顺序     |

**选择依据**

- 要**速度**：选`HashMap`。
- 要**排序**：选`TreeMap`。
- 要**顺序**（插入或访问顺序）：选`LinkedHashMap`。

**扩展**

- `LinkedHashMap`可通过`accessOrder`参数实现 LRU 缓存。
- `TreeMap`支持丰富的导航方法（如`ceilingKey()`、`floorKey()`）。

### 【困难】HashMap 底层实现原理是什么？

HashMap 通过哈希函数定位桶，用链表和红黑树解决冲突，动态扩容平衡性能，但非线程安全。

**数据结构**

HashMap 的数据结构是：**数组 + 链表（JDK 8 以前）** ；**数组 + 链表 + 红黑树（JDK 8+）**

- **数组（桶）**：`Node<K,V>[] table`，初始长度默认为 `16`。
- **链表**：相同哈希值的元素组成链表，以解决哈希冲突（拉链地址法）。
- **红黑树**：当链表长度 ≥ 8 且数组长度 ≥ 64 时，链表转为红黑树（提升查询效率至 `O(log n)`）。

**哈希计算**

- **计算哈希值**：高位与低位异或，使哈希分布更均匀。

  ```java
  // JDK 8 的哈希扰动函数（减少碰撞）
  static final int hash(Object key) {
      int h;
      return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
  }
  ```

- **计算桶索引**：

  ```java
  index = (table.length - 1) & hash;  // 等价于 hash % table.length
  ```

**解决哈希冲突**

- **拉链地址法**：冲突的键值对以链表形式存储在同一桶中。
- **红黑树优化**：长链表（≥8）转为红黑树，避免极端情况下性能退化至 `O(n)`。

**扩容机制（Rehash）**

- **触发条件**：当元素数量 > `容量 × 负载因子`（默认负载因子 0.75，容量 16 时阈值为 12）。
- **扩容操作**：
  - 新建 2 倍大小的数组（`newCap = oldCap << 1`）。
  - 重新计算键的索引位置（`newIndex = (newCap - 1) & hash`）。
  - **JDK 8 优化**：无需重新计算哈希，**通过高位掩码判断新索引位置**（`原索引` 或 `原索引 + oldCap`）。

**关键参数**

| **参数**                | **默认值**         | **说明**                                           |
| ----------------------- | ------------------ | -------------------------------------------------- |
| 初始容量                | 16                 | 必须为 2 的幂（方便位运算计算索引）。              |
| 负载因子（Load Factor） | 0.75               | 权衡空间与时间效率（过高增加冲突，过低浪费内存）。 |
| 树化阈值                | 8（链表 → 红黑树） | 需同时满足数组长度 ≥ 64，否则优先扩容。            |
| 退化阈值                | 6（红黑树 → 链表） | 扩容或删除节点时检查。                             |

**线程安全问题**

- **非线程安全**：多线程下可能导致：
  - **死循环**（JDK 7 头插法扩容时产生环形链表）。
  - **数据丢失**（并发插入覆盖节点）。
- **解决方案**：
  - 使用 `ConcurrentHashMap`。
  - 或通过 `Collections.synchronizedMap()` 包装。

**JDK 8 的优化**

- **链表 → 红黑树**：解决哈希攻击导致的性能退化。
- **尾插法**：扩容时保持链表顺序，避免环形链表。
- **高位掩码优化扩容**：减少哈希重计算开销。

**PUT 流程源码**

```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    // 1. 数组为空时初始化
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    // 2. 计算索引，若桶为空直接插入
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        // 3. 处理哈希冲突（链表/红黑树）
        // ...（省略冲突处理逻辑）
    }
    // 4. 检查扩容
    if (++size > threshold) resize();
}
```

### 【困难】HashMap 为什么线程不安全？

HashMap 在多线程环境下会出现：

- **JDK 7**：死循环 + 数据丢失（头插法导致）。
- **JDK 8+**：数据丢失 + 脏读（无死循环，但依然非线程安全）。
- **替代方案**：高并发场景始终优先选择 `ConcurrentHashMap`。

**一句话**：HashMap 的线程不安全源于非原子操作和并发修改冲突，多线程环境下必须使用同步机制。

**（1）并发修改导致数据丢失**

**问题场景（JDK 8+）**

- 两个线程同时执行 `put()`，计算出的 **桶索引相同**，且该位置为 `null`。
- **预期**：两个键值对都成功插入。
- **实际**：后一个线程的 `put` 可能覆盖前一个线程的写入，导致数据丢失。

示例代码（伪并发）：

```java
// 线程 1 和线程 2 同时执行：
if ((p = tab[i = (n - 1) & hash]) == null) {
    tab[i] = newNode(hash, key, value, null); // 可能被覆盖
}
```

**（2）JDK 7 扩容死循环问题**

**问题原因（仅 JDK 7）**

- 扩容时采用 **头插法** 迁移链表，多线程并发可能导致 **环形链表**。
- 后续调用 `get()` 或 `put()` 时，遍历链表进入死循环（CPU 100%）。

示意图：

```
线程 1：A -> B → null
线程 2：B -> A → null
最终：A ⇄ B（环形链表）
```

**（3）并发扩容导致数据错乱**

多个线程同时触发 `resize()`，可能导致：

- **部分节点丢失**（未正确迁移到新数组）。
- **链表断裂**（节点 `next` 指针被错误修改）。

**（4）非原子操作导致脏读**

`size++`、`modCount++` 等操作非原子性，可能导致：

- `size` 不准确（影响扩容判断）。
- 迭代时触发 `ConcurrentModificationException`（快速失败机制）。

**解决方案**

| **问题**        | **解决方案**                             |
| --------------- | ---------------------------------------- |
| 数据丢失/覆盖   | 使用 `ConcurrentHashMap`（CAS + 分段锁） |
| 死循环（JDK 7） | 升级到 JDK 8+（改用尾插法）              |
| 脏读            | 用 `Collections.synchronizedMap()` 包装  |

### 【中等】WeakHashMap 有什么用？

`WeakHashMap` 通过弱引用键实现自动清理，适合管理临时性、生命周期与键对象绑定的数据，但需注意值对象的引用管理和线程安全问题。

**基于弱引用的键（Key）管理**

- **键是弱引用**：当 `WeakHashMap` 的键（Key）不再被其他强引用指向时，该键值对会被垃圾回收器自动回收，避免内存泄漏。
- **适用场景**：适合存储与对象生命周期相关的临时数据（如缓存），当键对象外部不再使用时，自动清理对应条目。

**自动清理无引用键值对**

- **依赖垃圾回收机制**：当键对象仅被 `WeakHashMap` 弱引用时，GC 会回收该键，并移除对应的键值对（通过内部 `ReferenceQueue` 机制触发清理）。
- **无需手动移除**：与普通 `HashMap` 不同，无需显式调用 `remove()` 方法避免内存泄漏。

**典型应用场景**

- **缓存系统**：缓存数据时，若缓存键（如临时对象）不再使用，自动释放对应值（如大对象），防止内存堆积。
- **监听器/元数据存储**：存储对象的附加信息，当对象销毁时，关联数据自动清除。

**注意事项**

- **值（Value）不是弱引用**：仅键是弱引用，值仍可能因强引用导致内存泄漏（需确保值未在其他地方被强引用）。
- **非线程安全**：需外部同步（如使用 `Collections.synchronizedMap`）。
- **不可预测的清理时机**：依赖 GC 运行，条目移除时机不确定。

**示例代码**

```java
WeakHashMap<Object, String> weakMap = new WeakHashMap<>();
Object key = new Object();
weakMap.put(key, "Value");

// 当 key 的强引用置为 null，且发生 GC 后，weakMap 中的条目会被自动移除
key = null;
System.gc(); // 仅示例，实际中不推荐显式调用 GC

// 此时 weakMap 可能已为空（条目被回收）
```

### 【中等】ConcurrentHashMap 和 Hashtable 有什么区别？

- **优先使用 `ConcurrentHashMap`**：适用于现代高并发程序，性能更优。
- **避免 `Hashtable`**：除非维护历史代码，否则建议替换为 `ConcurrentHashMap` 或 `Collections.synchronizedMap()`（非高并发场景）。

以下是 **ConcurrentHashMap 和 Hashtable 的区别对比表格**，清晰展示核心差异：

| **对比项**       | **Hashtable**                                          | **ConcurrentHashMap**                                   |
| ---------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| **线程安全实现** | 全表锁（`synchronized` 方法）                          | **分段锁（JDK7）** 或 **CAS + `synchronized`（JDK8+）** |
| **并发性能**     | 低（串行化操作，高并发时阻塞严重）                     | 高（读写并发优化，锁粒度更细）                          |
| **Null 支持**    | **不允许** `null` 键或值（抛出异常）                   | **不允许** `null` 键或值（避免并发歧义）                |
| **迭代器行为**   | 强一致性（修改会抛 `ConcurrentModificationException`） | 弱一致性（可能部分反映修改，不抛异常）                  |
| **版本与演进**   | JDK1.0 遗留类，已过时                                  | JDK1.5 引入，持续优化（如 JDK8 改用 CAS）               |
| **适用场景**     | 旧代码兼容（不推荐新项目使用）                         | **高并发首选**（缓存、计数器等场景）                    |

### 【困难】ConcurrentHashMap 的底层实现原理是什么？

`ConcurrentHashMap` 是 Java 并发编程中最常用的线程安全 `Map`，其底层实现经历了 **JDK7（分段锁）** 和 **JDK8+（CAS + `synchronized` 优化）** 两个重要阶段。以下是核心实现原理：

::: info JDK7 中，ConcurrentHashMap 的实现原理是什么？
:::

JDK7 中，`ConcurrentHashMap` 的核心实现思想是：将整个哈希表分成多个 `Segment`（默认 16 个），每个 `Segment` 是一个独立的 `HashEntry` 数组，**锁粒度细化到`Segment` 级别**，不同 `Segment` 可并发操作。

**数据结构**

```java
ConcurrentHashMap
  ├── Segment[]（默认 16 个，每个 Segment 继承 ReentrantLock）
  │    └── HashEntry[]（链表结构，存储键值对）
  └── 全局的并发控制参数（如 loadFactor）
```

**关键特点**

- **锁分段（Segment Locking）**
  - 写操作仅锁对应的 `Segment`，其他 `Segment` 仍可并发访问。
  - 读操作无锁（`HashEntry` 的 `value` 用 `volatile` 修饰，保证可见性）。
- **并发度（Concurrency Level）**
  - 默认 16 个 `Segment`，即最多支持 16 个线程并发写。

**缺点**

- 内存占用较高（每个 `Segment` 独立维护数组）。
- 查询时需要两次哈希计算（先定位 `Segment`，再定位 `HashEntry`）。

::: info JDK8 中，ConcurrentHashMap 的实现原理是什么？
:::

JDK8 中，`ConcurrentHashMap` 的核心实现思想是：抛弃 `Segment`，改用 **`Node` 数组 + 链表/红黑树**，锁粒度细化到 **单个桶（链表头节点）**，并引入 **CAS（无锁化）** 和 `synchronized` 结合的方式提升并发性能。

**数据结构**

```java
ConcurrentHashMap
  ├── Node[] table（数组 + 链表/红黑树）
  │    ├── Node（普通链表节点）
  │    └── TreeBin（红黑树封装，维护平衡）
  └── volatile 变量（如 sizeCtl，控制扩容）
```

**关键优化**

- **锁粒度更细（桶级别锁）**

  - 写操作仅锁当前桶（链表头节点），其他桶仍可并发访问。
  - 读操作完全无锁（`Node` 的 `value` 和 `next` 用 `volatile` 修饰）。

- **CAS + `synchronized` 结合**

  - **插入数据**：先尝试 CAS 无锁插入，失败后 `synchronized` 锁住头节点。
  - **扩容**：支持多线程协同扩容（通过 `sizeCtl` 标志位控制）。

- **链表转红黑树（优化查询）**

  - 当链表长度 ≥ 8 且数组长度 ≥ 64 时，链表转为红黑树（`TreeBin`），防止哈希冲突导致性能退化。

- **更高效的计算方式**
  - 使用 `spread()` 方法优化哈希计算，减少冲突。
  - `size()` 方法通过 `CounterCell` 分段统计，避免全局锁。

::: info JDK8 中，ConcurrentHashMap 关键操作流程是怎样的？
:::

**（1）PUT 操作（JDK8）**

1. 计算 `key` 的哈希，定位到桶（数组下标）。
2. 如果桶为空，**CAS 插入新节点**（无锁化）。
3. 如果桶不为空，`synchronized` 锁住头节点，处理链表或红黑树插入。
4. 如果链表长度 ≥ 8，尝试转红黑树。

**（2）GET 操作（完全无锁）**

1. 计算 `key` 的哈希，定位到桶。
2. 遍历链表或红黑树（依赖 `volatile` 保证可见性）。

**（3）扩容（多线程协同）**

1. 当元素数量超过阈值（`sizeCtl`），触发扩容。
2. 其他线程检测到扩容时，可协助迁移数据（`transfer` 方法）。

::: info ConcurrentHashMap 在 JDK7 和 JDK8 中的实现有哪些差异？
:::

| **对比项**       | **JDK7（分段锁）**            | **JDK8+（CAS + `synchronized`）** |
| ---------------- | ----------------------------- | --------------------------------- |
| **锁粒度**       | Segment 级别（粗粒度）        | 桶级别（更细粒度）                |
| **并发度**       | 固定 16 个 Segment            | 动态调整，更高并发                |
| **内存占用**     | 较高（每个 Segment 维护数组） | 更低（单层 Node 数组）            |
| **哈希冲突处理** | 链表                          | 链表 + 红黑树（优化查询）         |
| **扩容机制**     | 单 Segment 扩容               | 多线程协同扩容                    |

**小结**

**JDK7**：分段锁降低冲突，但并发度固定，内存开销大。

**JDK8+**：

- 更细粒度的锁（桶级别），CAS 无锁化优化。
- 红黑树优化极端哈希冲突场景。
- 多线程协同扩容，提升性能。

**适用场景**：高并发读写（如缓存、计数器），是 `Hashtable` 和 `Collections.synchronizedMap()` 的现代替代方案。

### 【中等】ConcurrentHashMap 为什么 key 和 value 不能为 null？

`ConcurrentHashMap` 在设计上明确禁止 `null` 作为 **key** 或 **value**，而普通的 `HashMap` 是允许的。

**`ConcurrentHashMap` 禁止 `null` 是为了避免并发场景下的二义性问题**。

- **替代方案**：使用特殊标记（如 `Optional`）或额外方法（如 `containsKey()`）明确语义。
- **设计一致性**：延续 `Hashtable` 的严格约束，确保线程安全行为的清晰性。

如果业务必须使用 `null`，可以考虑：

- 使用 `HashMap` + 外部同步（如 `synchronized`）。
- 用 `Optional` 或自定义空对象代替 `null`。

`ConcurrentHashMap` 禁止 `null` 的详细原因如下：

**（1）并发场景下的歧义问题（核心原因）**

`ConcurrentHashMap` 是线程安全的，但在高并发环境下，`null` 值会导致 **二义性（Ambiguity）**，无法区分：

- **Key 不存在**（返回 `null`）。
- **Key 存在，但 Value 本身就是 `null`**。

示例场景：

```java
ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();
map.get("non_existent_key");  // 返回 null（表示 key 不存在）
map.put("key", null);        // 如果允许，这里存储 null 值
map.get("key");              // 仍然返回 null，无法区分是 "key 不存在" 还是 "value 是 null"
```

**问题**：在并发环境下，这种歧义会导致业务逻辑错误（比如缓存系统无法判断数据是否有效）。

**（2）`HashMap` 为什么允许 `null`？**

`HashMap` 是单线程使用的，开发者可以自行约束 `null` 的使用逻辑，例如：

```java
if (map.get(key) == null) {
    // 明确知道是 key 不存在，或者 value 是 null（需业务逻辑保证）
}
```

但在并发环境下，这种约束不可靠，因为其他线程可能同时修改数据。

**（3）`ConcurrentHashMap` 的设计哲学**

为了保证 **线程安全** 和 **明确语义**，`ConcurrentHashMap` 直接禁止 `null`，强制开发者：

- **用特殊占位符（如 `Optional.empty()`）代替 `null`**。
- **显式处理 `key` 不存在的情况**（如 `containsKey()` 检查）。

替代方案示例：

```java
ConcurrentHashMap<String, Optional<String>> map = new ConcurrentHashMap<>();
map.put("key", Optional.empty());  // 用 Optional 表示空值
if (!map.containsKey("key")) {
    // key 不存在
} else {
    Optional<String> value = map.get("key");
    if (value.isEmpty()) {
        // value 是 "逻辑上的 null"
    }
}
```

**（4）历史原因（兼容性）**

- `Hashtable`（早期线程安全 `Map`）也不允许 `null`，`ConcurrentHashMap` 延续了这一设计。
- 如果允许 `null`，会导致从 `Hashtable` 迁移到 `ConcurrentHashMap` 时出现兼容性问题。

（5）对比其他 Map

| **Map 类型**                  | **允许 `null` Key** | **允许 `null` Value** | **原因**                      |
| ----------------------------- | ------------------- | --------------------- | ----------------------------- |
| `HashMap`                     | ✅ 是               | ✅ 是                 | 单线程使用，无并发歧义        |
| `Hashtable`                   | ❌ 否               | ❌ 否                 | 线程安全，避免歧义            |
| `ConcurrentHashMap`           | ❌ 否               | ❌ 否                 | 并发安全，避免歧义            |
| `Collections.synchronizedMap` | 取决于底层 Map      | 取决于底层 Map        | 包装类，行为与被包装 Map 一致 |

### 【中等】ConcurrentHashMap 能保证复合操作的原子性吗？

**ConcurrentHashMap 不能保证复合操作的原子性**，尽管它本身提供了高并发性能和线程安全的单个操作。

**说明如下**：

**单个操作的原子性**：

- `put()`, `get()`, `remove()` 等单个操作是线程安全的
- 这些操作在内部使用分段锁或 CAS 操作保证原子性

**复合操作的非原子性**：

像【检查然后执行（check-then-act）】这样的复合操作不是原子的。例如：`if (!map.containsKey(key)) { map.put(key, value); }`，在检查和方法调用之间，其他线程可能已经修改了 `map`。

**解决方案**：

- 使用 `putIfAbsent()`, `computeIfAbsent()`, `computeIfPresent()` 等原子性复合方法
- 使用显式同步（但会降低并发性能）
- 使用 `compute()` 方法原子性地更新值

示例：

```java
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// 非原子性复合操作 - 不安全
if (!map.containsKey("key")) {
    map.put("key", 1);  // 可能有竞态条件
}

// 原子性替代方案
map.putIfAbsent("key", 1);

// 或者使用 computeIfAbsent
map.computeIfAbsent("key", k -> 1);
```

总结：ConcurrentHashMap 只保证单个方法的原子性，复合操作需要特别处理才能保证线程安全。