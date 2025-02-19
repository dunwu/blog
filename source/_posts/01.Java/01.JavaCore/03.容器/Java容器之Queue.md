---
title: Java 容器之 Queue
date: 2020-02-21 16:26:21
order: 05
categories:
  - Java
  - JavaCore
  - 容器
tags:
  - Java
  - JavaCore
  - 容器
permalink: /pages/798a4c63/
---

# Java 容器之 Queue

## Queue 简介

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/cs/java/javacore/container/Queue-diagrams.png" />
</div>

### Queue 接口

`Queue` 接口定义如下：

```java
public interface Queue<E> extends Collection<E> {}
```

`Queue` 是单端队列，只能从一端插入元素，另一端删除元素，实现上一般遵循 **先进先出（FIFO）** 规则。

`Queue` 扩展了 `Collection` 的接口，根据 **因为容量问题而导致操作失败后处理方式的不同** 可以分为两类方法: 一种在操作失败后会抛出异常，另一种则会返回特殊值。

| `Queue` 接口 | 抛出异常  | 返回特殊值 |
| ------------ | --------- | ---------- |
| 插入队尾     | add(E e)  | offer(E e) |
| 删除队首     | remove()  | poll()     |
| 查询队首元素 | element() | peek()     |

### AbstractQueue 抽象类

**`AbstractQueue` 类提供 `Queue` 接口的核心实现**，以最大限度地减少实现 `Queue` 接口所需的工作。

`AbstractQueue` 抽象类定义如下：

```java
public abstract class AbstractQueue<E>
    extends AbstractCollection<E>
    implements Queue<E> {}
```

### Deque 接口

Deque 接口是 double ended queue 的缩写，即**双端队列**。Deque 继承 Queue 接口，并扩展支持**在队列的两端插入和删除元素**。

所以提供了特定的方法，如:

- 尾部插入时需要的 [addLast(e)](https://docs.oracle.com/javase/9/docs/api/java/util/Deque.html#addLast-E-)、[offerLast(e)](https://docs.oracle.com/javase/9/docs/api/java/util/Deque.html#offerLast-E-)。
- 尾部删除所需要的 [removeLast()](https://docs.oracle.com/javase/9/docs/api/java/util/Deque.html#removeLast--)、[pollLast()](https://docs.oracle.com/javase/9/docs/api/java/util/Deque.html#pollLast--)。

大多数的实现对元素的数量没有限制，但这个接口既支持有容量限制的 deque，也支持没有固定大小限制的。

`Deque` 扩展了 `Queue` 的接口, 增加了在队首和队尾进行插入和删除的方法，同样根据失败后处理方式的不同分为两类：

| `Deque` 接口 | 抛出异常      | 返回特殊值      |
| ------------ | ------------- | --------------- |
| 插入队首     | addFirst(E e) | offerFirst(E e) |
| 插入队尾     | addLast(E e)  | offerLast(E e)  |
| 删除队首     | removeFirst() | pollFirst()     |
| 删除队尾     | removeLast()  | pollLast()      |
| 查询队首元素 | getFirst()    | peekFirst()     |
| 查询队尾元素 | getLast()     | peekLast()      |

事实上，`Deque` 还提供有 `push()` 和 `pop()` 等其他方法，可用于模拟栈。

## ArrayDeque

`ArrayDeque` 是 `Deque` 的顺序表实现。

`ArrayDeque` 用一个动态数组实现了栈和队列所需的所有操作。

## LinkedList

`LinkedList` 是 `Deque` 的链表实现。

示例：

```java
public class LinkedListQueueDemo {

    public static void main(String[] args) {
        //add()和remove()方法在失败的时候会抛出异常(不推荐)
        Queue<String> queue = new LinkedList<>();

        queue.offer("a"); // 入队
        queue.offer("b"); // 入队
        queue.offer("c"); // 入队
        for (String q : queue) {
            System.out.println(q);
        }
        System.out.println("===");
        System.out.println("poll=" + queue.poll()); // 出队
        for (String q : queue) {
            System.out.println(q);
        }
        System.out.println("===");
        System.out.println("element=" + queue.element()); //返回第一个元素
        for (String q : queue) {
            System.out.println(q);
        }
        System.out.println("===");
        System.out.println("peek=" + queue.peek()); //返回第一个元素
        for (String q : queue) {
            System.out.println(q);
        }
    }

}
```

`ArrayDeque` 和 `LinkedList` 都实现了 `Deque` 接口，两者都具有队列的功能，但两者有什么区别呢？

- `ArrayDeque` 是基于可变长的数组和双指针来实现，而 `LinkedList` 则通过链表来实现。
- `ArrayDeque` 不支持存储 `NULL` 数据，但 `LinkedList` 支持。
- `ArrayDeque` 是在 JDK1.6 才被引入的，而`LinkedList` 早在 JDK1.2 时就已经存在。
- `ArrayDeque` 插入时可能存在扩容过程, 不过均摊后的插入操作依然为 O(1)。虽然 `LinkedList` 不需要扩容，但是每次插入数据时均需要申请新的堆空间，均摊性能相比更慢。

从性能的角度上，选用 `ArrayDeque` 来实现队列要比 `LinkedList` 更好。此外，`ArrayDeque` 也可以用于实现栈。

## PriorityQueue

`PriorityQueue` 是在 JDK1.5 中被引入的, 其与 `Queue` 的区别在于元素出队顺序是与优先级相关的，即总是优先级最高的元素先出队。

`PriorityQueue` 类定义如下：

```java
public class PriorityQueue<E> extends AbstractQueue<E>
    implements java.io.Serializable {}
```

`PriorityQueue` 要点：

- `PriorityQueue` 实现了 `Serializable`，支持序列化。
- `PriorityQueue` 类是无界优先级队列。
- `PriorityQueue` 中的元素根据自然顺序或 `Comparator` 提供的顺序排序。
- `PriorityQueue` 不接受 null 值元素。
- `PriorityQueue` 不是线程安全的。
- `PriorityQueue` 利用了二叉堆的数据结构来实现的，底层使用可变长的数组来存储数据
- `PriorityQueue` 通过堆元素的上浮和下沉，实现了在 O(logn) 的时间复杂度内插入元素和删除堆顶元素。
- `PriorityQueue` 默认是小顶堆，但可以接收一个 `Comparator` 作为构造参数，从而来自定义元素优先级的先后。

## 参考资料

- [解读 Java 并发队列 BlockingQueue](http://www.importnew.com/28053.html)