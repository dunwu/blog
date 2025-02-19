---
title: Java 容器之 Set
date: 2019-12-29 21:49:58
order: 04
categories:
  - Java
  - JavaCore
  - 容器
tags:
  - Java
  - JavaCore
  - 容器
  - Set
  - HashSet
  - TreeSet
  - LinkedHashSet
permalink: /pages/da7e5eeb/
---

# Java 容器之 Set

## Set 简介

![](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javacore/container/Set-diagrams.png)

Set 家族成员简介：

- `Set` 继承了 `Collection` 的接口。实际上 `Set` 就是 `Collection`，只是行为略有不同：`Set` 集合不允许有重复元素。
- `SortedSet` 继承了 `Set` 的接口。`SortedSet` 中的内容是排序的唯一值，排序的方法是通过比较器(Comparator)。
- `NavigableSet` 继承了 `SortedSet` 的接口。它提供了丰富的查找方法：如"获取大于/等于某值的元素"、“获取小于/等于某值的元素”等等。
- `AbstractSet` 是一个抽象类，它继承于 `AbstractCollection`，`AbstractCollection` 实现了 Set 中的绝大部分方法，为实现 `Set` 的实例类提供了便利。
- `HashSet` 类依赖于 `HashMap`，它实际上是通过 `HashMap` 实现的。`HashSet` 中的元素是无序的、散列的。
- `TreeSet` 类依赖于 `TreeMap`，它实际上是通过 `TreeMap` 实现的。`TreeSet` 中的元素是有序的，它是按自然排序或者用户指定比较器排序的 Set。
- `LinkedHashSet` 是按插入顺序排序的 Set。
- `EnumSet` 是只能存放 Emum 枚举类型的 Set。

### Set 接口

`Set` 继承了 `Collection` 的接口。实际上，`Set` 就是 `Collection`，二者提供的方法完全相同。

`Set` 接口定义如下：

```java
public interface Set<E> extends Collection<E> {}
```

### SortedSet 接口

继承了 `Set` 的接口。`SortedSet` 中的内容是排序的唯一值，排序的方法是通过比较器(Comparator)。

`SortedSet` 接口定义如下：

```java
public interface SortedSet<E> extends Set<E> {}
```

`SortedSet` 接口新扩展的方法：

- `comparator` - 返回 Comparator
- `subSet` - 返回指定区间的子集
- `headSet` - 返回小于指定元素的子集
- `tailSet` - 返回大于指定元素的子集
- `first` - 返回第一个元素
- `last` - 返回最后一个元素
- spliterator

### NavigableSet 接口

`NavigableSet` 继承了 `SortedSet`。它提供了丰富的查找方法。

`NavigableSet` 接口定义如下：

```java
public interface NavigableSet<E> extends SortedSet<E> {}
```

`NavigableSet` 接口新扩展的方法：

- lower - 返回小于指定值的元素中最接近的元素
- higher - 返回大于指定值的元素中最接近的元素
- floor - 返回小于或等于指定值的元素中最接近的元素
- ceiling - 返回大于或等于指定值的元素中最接近的元素
- pollFirst - 检索并移除第一个（最小的）元素
- pollLast - 检索并移除最后一个（最大的）元素
- descendingSet - 返回反序排列的 Set
- descendingIterator - 返回反序排列的 Set 的迭代器
- subSet - 返回指定区间的子集
- headSet - 返回小于指定元素的子集
- tailSet - 返回大于指定元素的子集

### AbstractSet 抽象类

`AbstractSet` 类提供 `Set` 接口的核心实现，以最大限度地减少实现 `Set` 接口所需的工作。

`AbstractSet` 抽象类定义如下：

```java
public abstract class AbstractSet<E> extends AbstractCollection<E> implements Set<E> {}
```

事实上，主要的实现已经在 `AbstractCollection` 中完成。

## HashSet 类

`HashSet` 类依赖于 `HashMap`，它实际上是通过 `HashMap` 实现的。`HashSet` 中的元素是无序的、散列的。

`HashSet` 类定义如下：

```java
public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable {}
```

### HashSet 要点

- `HashSet` 通过继承 `AbstractSet` 实现了 `Set` 接口中的骨干方法。
- `HashSet` 实现了 `Cloneable`，所以支持克隆。
- `HashSet` 实现了 `Serializable`，所以支持序列化。
- `HashSet` 中存储的元素是无序的。
- `HashSet` 允许 null 值的元素。
- `HashSet` 不是线程安全的。

### HashSet 原理

**`HashSet` 是基于 `HashMap` 实现的。**

```java
// HashSet 的核心，通过维护一个 HashMap 实体来实现 HashSet 方法
private transient HashMap<E,Object> map;

// PRESENT 是用于关联 map 中当前操作元素的一个虚拟值
private static final Object PRESENT = new Object();
}
```

- `HashSet` 中维护了一个 `HashMap` 对象 map，`HashSet` 的重要方法，如 `add`、`remove`、`iterator`、`clear`、`size` 等都是围绕 map 实现的。
  - `HashSet` 类中通过定义 `writeObject()` 和 `readObject()` 方法确定了其序列化和反序列化的机制。
- PRESENT 是用于关联 map 中当前操作元素的一个虚拟值。

## TreeSet 类

`TreeSet` 类依赖于 `TreeMap`，它实际上是通过 `TreeMap` 实现的。`TreeSet` 中的元素是有序的，它是按自然排序或者用户指定比较器排序的 Set。

`TreeSet` 类定义如下：

```java
public class TreeSet<E> extends AbstractSet<E>
    implements NavigableSet<E>, Cloneable, java.io.Serializable {}
```

### TreeSet 要点

- `TreeSet` 通过继承 `AbstractSet` 实现了 `NavigableSet` 接口中的骨干方法。
- `TreeSet` 实现了 `Cloneable`，所以支持克隆。
- `TreeSet` 实现了 `Serializable`，所以支持序列化。
- `TreeSet` 中存储的元素是有序的。排序规则是自然顺序或比较器（`Comparator`）中提供的顺序规则。
- `TreeSet` 不是线程安全的。

### TreeSet 源码

**TreeSet 是基于 TreeMap 实现的。**

```java
// TreeSet 的核心，通过维护一个 NavigableMap 实体来实现 TreeSet 方法
private transient NavigableMap<E,Object> m;

// PRESENT 是用于关联 map 中当前操作元素的一个虚拟值
private static final Object PRESENT = new Object();
```

- `TreeSet` 中维护了一个 `NavigableMap` 对象 map（实际上是一个 TreeMap 实例），`TreeSet` 的重要方法，如 `add`、`remove`、`iterator`、`clear`、`size` 等都是围绕 map 实现的。
- `PRESENT` 是用于关联 `map` 中当前操作元素的一个虚拟值。`TreeSet` 中的元素都被当成 `TreeMap` 的 key 存储，而 value 都填的是 `PRESENT`。

## LinkedHashSet 类

`LinkedHashSet` 是按插入顺序排序的 Set。

`LinkedHashSet` 类定义如下：

```java
public class LinkedHashSet<E>
    extends HashSet<E>
    implements Set<E>, Cloneable, java.io.Serializable {}
```

### LinkedHashSet 要点

- `LinkedHashSet` 通过继承 `HashSet` 实现了 `Set` 接口中的骨干方法。
- `LinkedHashSet` 实现了 `Cloneable`，所以支持克隆。
- `LinkedHashSet` 实现了 `Serializable`，所以支持序列化。
- `LinkedHashSet` 中存储的元素是按照插入顺序保存的。
- `LinkedHashSet` 不是线程安全的。

### LinkedHashSet 原理

`LinkedHashSet` 有三个构造方法，无一例外，都是调用父类 `HashSet` 的构造方法。

```java
public LinkedHashSet(int initialCapacity, float loadFactor) {
    super(initialCapacity, loadFactor, true);
}
public LinkedHashSet(int initialCapacity) {
    super(initialCapacity, .75f, true);
}
public LinkedHashSet() {
    super(16, .75f, true);
}
```

需要强调的是：**LinkedHashSet 构造方法实际上调用的是父类 HashSet 的非 public 构造方法。**

```java
HashSet(int initialCapacity, float loadFactor, boolean dummy) {
    map = new LinkedHashMap<>(initialCapacity, loadFactor);
}
```

不同于 `HashSet` `public` 构造方法中初始化的 `HashMap` 实例，这个构造方法中，初始化了 `LinkedHashMap` 实例。

也就是说，实际上，`LinkedHashSet` 维护了一个双链表。由双链表的特性可以知道，它是按照元素的插入顺序保存的。所以，这就是 `LinkedHashSet` 中存储的元素是按照插入顺序保存的原理。

## EnumSet 类

`EnumSet` 类定义如下：

```java
public abstract class EnumSet<E extends Enum<E>> extends AbstractSet<E>
    implements Cloneable, java.io.Serializable {}
```

### EnumSet 要点

- `EnumSet` 继承了 `AbstractSet`，所以有 `Set` 接口中的骨干方法。
- `EnumSet` 实现了 `Cloneable`，所以支持克隆。
- `EnumSet` 实现了 `Serializable`，所以支持序列化。
- `EnumSet` 通过 `<E extends Enum<E>>` 限定了存储元素必须是枚举值。
- `EnumSet` 没有构造方法，只能通过类中的 `static` 方法来创建 `EnumSet` 对象。
- `EnumSet` 是有序的。以枚举值在 `EnumSet` 类中的定义顺序来决定集合元素的顺序。
- `EnumSet` 不是线程安全的。

## HashSet vs. LinkedHashSet vs. TreeSet

`HashSet`、`LinkedHashSet` 和 `TreeSet` 都是 `Set` 接口的实现类，都能保证元素唯一，并且都不是线程安全的。

`HashSet`、`LinkedHashSet` 和 `TreeSet` 的主要区别在于底层数据结构不同。`HashSet` 的底层数据结构是哈希表（基于 `HashMap` 实现）。`LinkedHashSet` 的底层数据结构是链表和哈希表，元素的插入和取出顺序满足 FIFO。`TreeSet` 底层数据结构是红黑树，元素是有序的，排序的方式有自然排序和定制排序。

底层数据结构不同又导致这三者的应用场景不同。`HashSet` 用于不需要保证元素插入和取出顺序的场景，`LinkedHashSet` 用于保证元素的插入和取出顺序满足 FIFO 的场景，`TreeSet` 用于支持对元素自定义排序规则的场景。

## 参考资料

- [Java 编程思想（Thinking in java）](https://item.jd.com/10058164.html)
