---
title: Java 虚拟机面试一
date: 2024-07-03 07:44:02
categories:
  - Java
  - JavaCore
  - 面试
tags:
  - Java
  - JavaSE
  - 面试
  - 并发
permalink: /pages/46c1e340/
---

# Java 虚拟机面试一

## 引用类型

### Java 支持哪些引用类型？分别用于什么场景？

无论是通过引用计算算法判断对象的引用数量，还是通过可达性分析算法判断对象的引用链是否可达，判定对象是否可被回收都与引用有关。

Java 具有四种强度不同的引用类型：

- 强引用（Strong Reference）
- 软引用（Soft Reference）
- 弱引用（Weak Reference）
- 虚引用

**（1）强引用**

**被强引用（Strong Reference）关联的对象不会被垃圾收集器回收。**

使用 `new` 一个新对象的方式来创建强引用。

```java
Object obj = new Object();
```

**（2）软引用**

**被软引用（Soft Reference）关联的对象，只有在 JVM 内存不够的情况下才会被回收。**JVM 会确保在抛出 `OutOfMemoryError` 之前，清理软引用指向的对象。软引用通常用来实现内存敏感的缓存，如果还有空闲内存，就可以暂时保留缓存，当内存不足时清理掉，这样就保证了使用缓存的同时，不会耗尽内存。

使用 `SoftReference` 类来创建软引用。

```java
Object obj = new Object();
SoftReference<Object> sf = new SoftReference<Object>(obj);
obj = null; // 使对象只被软引用关联
```

**（3）弱引用**

**被弱引用（Weak Reference）关联的对象一定会被垃圾收集器回收，也就是说它只能存活到下一次垃圾收集发生之前。**

使用 `WeakReference` 类来实现弱引用。

```java
Object obj = new Object();
WeakReference<Object> wf = new WeakReference<Object>(obj);
obj = null;
```

`WeakHashMap` 的 `Entry` 继承自 `WeakReference`，主要用来实现缓存。

```java
private static class Entry<K,V> extends WeakReference<Object> implements Map.Entry<K,V>
```

Tomcat 中的 `ConcurrentCache` 就使用了 `WeakHashMap` 来实现缓存功能。`ConcurrentCache` 采取的是分代缓存，经常使用的对象放入 eden 中，而不常用的对象放入 longterm。eden 使用 `ConcurrentHashMap` 实现，longterm 使用 `WeakHashMap`，保证了不常使用的对象容易被回收。

```java
public final class ConcurrentCache<K, V> {

    private final int size;

    private final Map<K, V> eden;

    private final Map<K, V> longterm;

    public ConcurrentCache(int size) {
        this.size = size;
        this.eden = new ConcurrentHashMap<>(size);
        this.longterm = new WeakHashMap<>(size);
    }

    public V get(K k) {
        V v = this.eden.get(k);
        if (v == null) {
            v = this.longterm.get(k);
            if (v != null)
                this.eden.put(k, v);
        }
        return v;
    }

    public void put(K k, V v) {
        if (this.eden.size() >= size) {
            this.longterm.putAll(this.eden);
            this.eden.clear();
        }
        this.eden.put(k, v);
    }
}
```

**（4）虚引用**

又称为幽灵引用或者幻影引用。一个对象是否有虚引用的存在，完全不会对其生存时间构成影响，也无法通过虚引用取得一个对象实例。

**为一个对象设置虚引用关联的唯一目的就是能在这个对象被收集器回收时收到一个系统通知。**

使用 `PhantomReference` 来实现虚引用。

```java
Object obj = new Object();
PhantomReference<Object> pf = new PhantomReference<Object>(obj);
obj = null;
```