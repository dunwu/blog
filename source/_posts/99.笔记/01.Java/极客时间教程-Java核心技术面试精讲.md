---
title: 《极客时间教程 - Java 核心技术面试精讲》笔记
date: 2024-09-22 18:33:35
categories:
  - 笔记
  - Java
tags:
  - Java
  - 面试
permalink: /pages/b57a2141/
---

# 《极客时间教程 - Java 核心技术面试精讲》笔记

## 开篇词 以面试题为切入点，有效提升你的 Java 内功

略

## 谈谈你对 Java 平台的理解？

【典型回答】

Java 最显著的特性：

- “**书写一次，到处运行**”（Write once, run anywhere）——跨平台
- **垃圾收集**（GC, Garbage Collection）——回收、分配内存

Java 既是解释型语言，又是编译型语言

【考点分析】

可以由浅入深的梳理 Java 的知识网络

【知识扩展】

## Exception 和 Error 有什么区别？

【典型回答】

Exception 和 Error 都是继承了 Throwable 类，在 Java 中只有 Throwable 类型的实例才可以被抛出（throw）或者捕获（catch）。

Exception 是程序正常运行中，可以预料的意外情况，可能并且应该被捕获，进行相应处理。

Error 是指在正常情况下，不大可能出现的情况，绝大部分的 Error 都会导致程序（比如 JVM 自身）处于非正常的、不可恢复状态。既然是非正常情况，所以不便于也不需要捕获，常见的比如 OutOfMemoryError。

Exception 又分为**可检查**（checked）异常和**不检查**（unchecked）异常，可检查异常在源代码里必须显式地进行捕获处理，这是编译期检查的一部分。不检查异常就是所谓的运行时异常，类似 NullPointerException、ArrayIndexOutOfBoundsException。

【考点分析】

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240656683.png)

**理解 Throwable、Exception、Error 的设计和分类**。

**理解 Java 语言中操作 Throwable 的元素和实践**。了解 `try {} catch {} finally`、try-with-resource、multiple catch、throw/throws 等关键机制。

【知识扩展】

尽量不要捕获 Exception、Throwable、Error——使得程序的容错处理不直观

不要生吞异常——会导致无法诊断问题

不要使用 e.printStackTrace()——这个方法会将堆栈输出到标准错误流，难以判断输出到哪里去了

## 谈谈 final、finally、finalize 有什么不同？

【典型回答】+【考点分析】

final 可以用来修饰类、方法、变量，分别有不同的意义，final 修饰的 class 代表不可以继承扩展，final 的变量是不可以修改的，而 final 的方法也是不可以重写的。

finally 则是 Java 保证重点代码一定要被执行的一种机制。我们可以使用 try-finally 或者 try-catch-finally 来进行类似关闭 JDBC 连接、保证 unlock 锁等动作。

finalize 是基础类 java.lang.Object 的一个方法，它的设计目的是保证对象在被垃圾收集前完成特定资源的回收。finalize 机制现在已经不推荐使用，并且在 JDK 9 开始被标记为 deprecated。finalize 被设计成在对象被**垃圾收集前**调用，这就意味着实现了 finalize 方法的对象是个“特殊公民”，JVM 要对它进行额外处理。finalize 本质上成为了快速回收的阻碍者，可能导致你的对象经过多个垃圾收集周期才能被回收。使用不当会影响性能，导致程序死锁、挂起等。

【知识扩展】

**final 不等于 Immutable！**

```java
 final List<String> strList = new ArrayList<>();
 strList.add("Hello");
 strList.add("world");
 List<String> unmodifiableStrList = List.of("hello", "world");
 unmodifiableStrList.add("again");
```

final 只能约束 strList 这个引用不可以被赋值，但是 strList 对象行为不被 final 影响，添加元素等操作是完全正常的。

要实现 Immutable，需要将类和类中的所有成员变量都定义为 final，并且只允许存在只读方法。

## 强引用、软引用、弱引用、幻象引用有什么区别？

【典型回答】+【考点分析】+【知识扩展】

不同的引用类型，主要体现的是**对象不同的可达性（reachable）状态和对垃圾收集的影响**。

- **强引用（Strong Reference）** - 被强引用关联的对象不会被垃圾收集器回收。
- **软引用（Soft Reference）** - 被软引用关联的对象，只有在内存不够的情况下才会被回收。
- **弱引用（Weak Reference）** - 被弱引用关联的对象一定会被垃圾收集器回收，也就是说它只能存活到下一次垃圾收集发生之前。
- **虚引用（Phantom Reference）** - 又称为幻象引用或幽灵引用。为一个对象设置虚引用关联的唯一目的就是能在这个对象被收集器回收时收到一个系统通知。一个对象是否有虚引用的存在，完全不会对其生存时间构成影响，也无法通过虚引用取得一个对象实例。

## String、StringBuffer、StringBuilder 有什么区别？

【典型回答】+【考点分析】+【知识扩展】

String 是典型的 Immutable 类，被声明成为 final class，所有属性也都是 final 的。也由于它的不可变性，类似拼接、裁剪字符串等动作，都会产生新的 String 对象。

StringBuffer 是线程安全的 String 工具类。

StringBuilder 和 StringBuffer 功能近似，只是去掉了保证线程安全的 synchronized 锁，减少了开销。

**字符串拼接都应该用 StringBuilder 吗？**

每次对 `String` 类型进行改变的时候，都会生成一个新的 `String` 对象，然后将指针指向新的 `String` 对象。

下面一段代码，利用不同版本的 JDK 编译，然后再反编译，例如：

```java
public class StringConcat {
     public static String concat(String str) {
       return str + “aa” + “bb”;
     }
}
```

先编译再反编译，比如使用不同版本的 JDK：

```java
${JAVA_HOME}/bin/javac StringConcat.java
${JAVA_HOME}/bin/javap -v StringConcat.class
```

JDK 8 的输出片段是：

```java
         0: new           #2                  // class java/lang/StringBuilder
         3: dup
         4: invokespecial #3                  // Method java/lang/StringBuilder."<init>":()V
         7: aload_0
         8: invokevirtual #4                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        11: ldc           #5                  // String aa
        13: invokevirtual #4                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        16: ldc           #6                  // String bb
        18: invokevirtual #4                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        21: invokevirtual #7                  // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
```

而在 JDK 9 中，反编译的结果就会有点特别了，片段是：

```java
         // concat method
         1: invokedynamic #2,  0              // InvokeDynamic #0:makeConcatWithConstants:(Ljava/lang/String;)Ljava/lang/String;

         // ...
         // 实际是利用了 MethodHandle, 统一了入口
         0: #15 REF_invokeStatic java/lang/invoke/StringConcatFactory.makeConcatWithConstants:(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/invoke/CallSite;
```

字符串对象通过“+”的字符串拼接方式，实际上是通过 `StringBuilder` 调用 `append()` 方法实现的，拼接完成之后调用 `toString()` 得到一个 `String` 对象 。

不过，在循环内使用“+”进行字符串的拼接的话，存在比较明显的缺陷：**编译器不会创建单个 `StringBuilder` 以复用，会导致创建过多的 `StringBuilder` 对象**。

在 JDK 9 中，字符串相加“+”改为用动态方法 `makeConcatWithConstants()` 来实现，通过提前分配空间从而减少了部分临时对象的创建。然而这种优化主要针对简单的字符串拼接，如： `a+b+c` 。对于循环中的大量拼接操作，仍然会逐个动态分配内存（类似于两个两个 append 的概念），并不如手动使用 StringBuilder 来进行拼接效率高。

**String 内部存储结构为何从 char 数组转为 byte 数组？**

Java 中的 char 是两个 bytes 大小，拉丁语系语言的字符，根本就不需要太宽的 char，这样无区别的实现就造成了一定的浪费。

在 Java 9 中，引入了 Compact Strings 的设计，将数据存储方式从 char 数组，改变为一个 byte 数组加上一个标识编码的所谓 coder，并且将相关字符串操作类都进行了修改。紧凑字符串带来的优势，**即更小的内存占用、更快的操作速度**。

## 动态代理是基于什么原理？

【典型回答】+【考点分析】+【知识扩展】

通过反射可以直接操作类或者对象，比如获取某个对象的类定义，获取类声明的属性和方法，调用方法或者构造对象，甚至可以运行时修改类定义。

反射工具类在 java.lang.reflect 包下，主要有：Class、Field、Method、Constructor 等。官方提供的参考文档：https://docs.oracle.com/javase/tutorial/reflect/index.html 。

反射提供的 AccessibleObject.setAccessible(boolean flag)。它的子类也大都重写了这个方法，这里的所谓 accessible 可以理解成修饰成员的 public、protected、private，这意味着我们可以在运行时修改成员访问限制！

动态代理是一种方便运行时动态构建代理、动态处理代理方法调用的机制，很多场景都是利用类似机制做到的，比如用来包装 RPC 调用、面向切面的编程（AOP）。

实现动态代理的方式很多：JDK 动态代理、ASM、cglib、Javassist

动态代理应用了设计模式中的代理模式。

## int 和 Integer 有什么区别？

【典型回答】+【考点分析】+【知识扩展】

自动装箱、拆箱实际上可以视为一种语法糖。什么是语法糖？可以简单理解为 Java 平台为我们自动进行了一些转换，保证不同的写法在运行时等价，它们发生在编译阶段，也就是生成的字节码是一致的。

javac 替我们自动把装箱转换为 Integer.valueOf()，把拆箱替换为 Integer.intValue()。

```java
Integer integer = 1;
int unboxing = integer++;
```

反编译输出：

```java
1: invokestatic  #2                  // Method
java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
8: invokevirtual #3                  // Method
java/lang/Integer.intValue:()I
```

应尽量避免自动装箱、拆箱行为，尤其是性能敏感的场景。

Java 基本数据类型的包装类型的大部分都用到了缓存机制来提升性能。

`Byte`,`Short`,`Integer`,`Long` 这 4 种包装类默认创建了数值 **[-128，127]** 的相应类型的缓存数据，`Character` 创建了数值在 **[0,127]** 范围的缓存数据，`Boolean` 直接返回 `True` or `False`。

Long 缓存源码：

```java
public static Long valueOf(long l) {
    final int offset = 128;
    if (l >= -128 && l <= 127) { // will cache
        return LongCache.cache[(int)l + offset];
    }
    return new Long(l);
}

private static class LongCache {
    private LongCache(){}

    static final Long cache[] = new Long[-(-128) + 127 + 1];

    static {
        for(int i = 0; i < cache.length; i++)
            cache[i] = new Long(i - 128);
    }
}
```

Java 对于自动装箱和拆箱的设计，依赖于一种叫做享元模式的设计模式。

## 对比 Vector、ArrayList、LinkedList 有何区别？

【典型回答】+【考点分析】+【知识扩展】

三者都是实现集合框架中的 List，具体功能也比较近似。

Vector 是 Java 早期提供的线程**安全的动态数组**，如果不需要线程安全，并不建议选择，毕竟同步是有额外开销的。Vector 内部是使用对象数组来保存数据，可以根据需要自动的增加容量，当数组已满时，会创建新的数组，并拷贝原有数组数据。

ArrayList 是应用更加广泛的**动态数组**实现，它本身不是线程安全的，所以性能要好很多。与 Vector 近似，ArrayList 也是可以根据需要调整容量，不过两者的调整逻辑有所区别，Vector 在扩容时会提高 1 倍，而 ArrayList 则是增加 50%。

LinkedList 顾名思义是 Java 提供的**双向链表**，所以它不需要像上面两种那样调整容量，它也不是线程安全的。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240657167.png)

## 对比 Hashtable、HashMap、TreeMap 有什么不同？

【典型回答】+【考点分析】+【知识扩展】

Hashtable 是早期 Java 类库提供的一个 [哈希表](https://zh.wikipedia.org/wiki/哈希表)实现，本身是同步的，不支持 null 键和值，由于同步导致的性能开销，所以已经很少被推荐使用。

HashMap 是应用更加广泛的哈希表实现，行为上大致上与 HashTable 一致，主要区别在于 HashMap 不是同步的，支持 null 键和值等。通常情况下，HashMap 进行 put 或者 get 操作，可以达到常数时间的性能，所以**它是绝大部分利用键值对存取场景的首选**，比如，实现一个用户 ID 和用户信息对应的运行时存储结构。

TreeMap 则是基于红黑树的一种提供顺序访问的 Map，和 HashMap 不同，它的 get、put、remove 之类操作都是 O(logN) 的时间复杂度，具体顺序可以由指定的 Comparator 或 Comparable 来决定，或者根据键的自然顺序来判断。

LinkedHashMap 通常提供的是遍历顺序符合插入顺序，它的实现是通过为条目（键值对）维护一个双向链表。

**HashMap 的性能表现非常依赖于哈希码的有效性，请务必掌握 hashCode 和 equals 的一些基本约定，**比如：

- equals 相等，hashCode 一定要相等。
- 重写了 hashCode 也要重写 equals。
- hashCode 需要保持一致性，状态改变返回的哈希值仍然要一致。
- equals 的对称、反射、传递等特性。

HashMap 源码实现：

- 容量（capacity）和负载系数（load factor）。
- 树化 。

## 如何保证集合是线程安全的 ConcurrentHashMap 如何实现高效地线程安全？

【典型回答】+【考点分析】+【知识扩展】

### ConcurrentHashMap JDK7 实现

早期 ConcurrentHashMap，其实现是基于：

- 分离锁，也就是将内部进行分段（Segment），里面则是 HashEntry 的数组，和 HashMap 类似，哈希相同的条目也是以链表形式存放。
- HashEntry 内部使用 volatile 的 value 字段来保证可见性，也利用了不可变对象的机制以改进利用 Unsafe 提供的底层能力，比如 volatile access，去直接完成部分操作，以最优化性能，毕竟 Unsafe 中的很多操作都是 JVM intrinsic 优化过的。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240701236.png)

```java
public V get(Object key) {
        Segment<K,V> s; // manually integrate access methods to reduce overhead
        HashEntry<K,V>[] tab;
        int h = hash(key.hashCode());
       //利用位操作替换普通数学运算
       long u = (((h >>> segmentShift) & segmentMask) << SSHIFT) + SBASE;
        // 以 Segment 为单位，进行定位
        // 利用 Unsafe 直接进行 volatile access
        if ((s = (Segment<K,V>)UNSAFE.getObjectVolatile(segments, u)) != null &&
            (tab = s.table) != null) {
           //省略
          }
        return null;
    }
```

而对于 put 操作，首先是通过二次哈希避免哈希冲突，然后以 Unsafe 调用方式，直接获取相应的 Segment，然后进行线程安全的 put 操作：

```java
 public V put(K key, V value) {
        Segment<K,V> s;
        if (value == null)
            throw new NullPointerException();
        // 二次哈希，以保证数据的分散性，避免哈希冲突
        int hash = hash(key.hashCode());
        int j = (hash >>> segmentShift) & segmentMask;
        if ((s = (Segment<K,V>)UNSAFE.getObject          // nonvolatile; recheck
             (segments, (j << SSHIFT) + SBASE)) == null) //  in ensureSegment
            s = ensureSegment(j);
        return s.put(key, hash, value, false);
    }
```

其核心逻辑实现在下面的内部方法中：

```java
final V put(K key, int hash, V value, boolean onlyIfAbsent) {
            // scanAndLockForPut 会去查找是否有 key 相同 Node
            // 无论如何，确保获取锁
            HashEntry<K,V> node = tryLock() ? null :
                scanAndLockForPut(key, hash, value);
            V oldValue;
            try {
                HashEntry<K,V>[] tab = table;
                int index = (tab.length - 1) & hash;
                HashEntry<K,V> first = entryAt(tab, index);
                for (HashEntry<K,V> e = first;;) {
                    if (e != null) {
                        K k;
                        // 更新已有 value...
                    }
                    else {
                        // 放置 HashEntry 到特定位置，如果超过阈值，进行 rehash
                        // ...
                    }
                }
            } finally {
                unlock();
            }
            return oldValue;
        }
```

从上面的源码清晰的看出，在进行并发写操作时：

- ConcurrentHashMap 会获取再入锁，以保证数据一致性，Segment 本身就是基于 ReentrantLock 的扩展实现，所以，在并发修改期间，相应 Segment 是被锁定的。
- 在最初阶段，进行重复性的扫描，以确定相应 key 值是否已经在数组里面，进而决定是更新还是放置操作，你可以在代码里看到相应的注释。重复扫描、检测冲突是 ConcurrentHashMap 的常见技巧。
- ConcurrentHashMap 也存在扩容行为。不过有一个明显区别，就是它进行的不是整体的扩容，而是单独对 Segment 进行扩容，细节就不介绍了。

### ConcurrentHashMap JDK8 实现

- 其内部仍然有 Segment 定义，但仅仅是为了保证序列化时的兼容性而已，不再有任何结构上的用处。
- 因为不再使用 Segment，初始化操作大大简化，修改为 lazy-load 形式，这样可以有效避免初始开销，解决了老版本很多人抱怨的这一点。
- 数据存储利用 volatile 来保证可见性。
- 使用 CAS 等操作，在特定场景进行无锁并发操作。
- 使用 Unsafe、LongAdder 之类底层手段，进行极端情况的优化。

先看看现在的数据存储内部实现，我们可以发现 Key 是 final 的，因为在生命周期中，一个条目的 Key 发生变化是不可能的；与此同时 val，则声明为 volatile，以保证可见性。

```java
 static class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        volatile V val;
        volatile Node<K,V> next;
        // …
    }
```

并发的 put 是如何实现的：

```java
final V putVal(K key, V value, boolean onlyIfAbsent) { if (key == null || value == null) throw new NullPointerException();
    int hash = spread(key.hashCode());
    int binCount = 0;
    for (Node<K,V>[] tab = table;;) {
        Node<K,V> f; int n, i, fh; K fk; V fv;
        if (tab == null || (n = tab.length) == 0)
            tab = initTable();
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            // 利用 CAS 去进行无锁线程安全操作，如果 bin 是空的
            if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value)))
                break;
        }
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f);
        else if (onlyIfAbsent // 不加锁，进行检查
                 && fh == hash
                 && ((fk = f.key) == key || (fk != null && key.equals(fk)))
                 && (fv = f.val) != null)
            return fv;
        else {
            V oldVal = null;
            synchronized (f) {
                   // 细粒度的同步修改操作。..
                }
            }
            // Bin 超过阈值，进行树化
            if (binCount != 0) {
                if (binCount >= TREEIFY_THRESHOLD)
                    treeifyBin(tab, i);
                if (oldVal != null)
                    return oldVal;
                break;
            }
        }
    }
    addCount(1L, binCount);
    return null;
}
```

初始化操作实现在 initTable 里面，这是一个典型的 CAS 使用场景，利用 volatile 的 sizeCtl 作为互斥手段：如果发现竞争性的初始化，就 spin 在那里，等待条件恢复；否则利用 CAS 设置排他标志。如果成功则进行初始化；否则重试。

请参考下面代码：

```java
private final Node<K,V>[] initTable() {
    Node<K,V>[] tab; int sc;
    while ((tab = table) == null || tab.length == 0) {
        // 如果发现冲突，进行 spin 等待
        if ((sc = sizeCtl) < 0)
            Thread.yield();
        // CAS 成功返回 true，则进入真正的初始化逻辑
        else if (U.compareAndSetInt(this, SIZECTL, sc, -1)) {
            try {
                if ((tab = table) == null || tab.length == 0) {
                    int n = (sc > 0) ? sc : DEFAULT_CAPACITY;
                    @SuppressWarnings("unchecked")
                    Node<K,V>[] nt = (Node<K,V>[])new Node<?,?>[n];
                    table = tab = nt;
                    sc = n - (n >>> 2);
                }
            } finally {
                sizeCtl = sc;
            }
            break;
        }
    }
    return tab;
}
```

## Java 提供了哪些 IO 方式？ NIO 如何实现多路复用？

【典型回答】+【考点分析】+【知识扩展】

- BIO - 传统的 java.io 包，它基于流模型实现。很多时候，人们也把 java.net 下面提供的部分网络 API，比如 Socket、ServerSocket、HttpURLConnection 也归类到同步阻塞 IO 类库，因为网络通信同样是 IO 行为。
  - InputStream/OutputStream 和 Reader/Writer 的关系和区别。
- NO - 在 Java 1.4 中引入了 NIO 框架（java.nio 包），提供了 Channel、Selector、Buffer 等新的抽象，可以构建多路复用的、同步非阻塞 IO 程序，同时提供了更接近操作系统底层的高性能数据操作方式。
  - BIO 和 NIO 的设计、原理差异
  - NIO 为什么高性能
  - NIO 组成
    - Buffer，高效的数据容器，除了布尔类型，所有原始数据类型都有相应的 Buffer 实现。
    - Channel，类似在 Linux 之类操作系统上看到的文件描述符，是 NIO 中被用来支持批量式 IO 操作的一种抽象。
    - Selector，是 NIO 实现多路复用的基础，它提供了一种高效的机制，可以检测到注册在 Selector 上的多个 Channel 中，是否有 Channel 处于就绪状态，进而实现了单线程对多 Channel 的高效管理。Selector 同样是基于底层操作系统机制，不同模式、不同版本都存在区别：Linux 上依赖于 [epoll](http://hg.openjdk.java.net/jdk/jdk/file/d8327f838b88/src/java.base/linux/classes/sun/nio/ch/EPollSelectorImpl.java)，Windows 上 NIO2（AIO）模式则是依赖于 [iocp](http://hg.openjdk.java.net/jdk/jdk/file/d8327f838b88/src/java.base/windows/classes/sun/nio/ch/Iocp.java)。
- NIO2 - 在 Java 7 中，NIO 有了进一步的改进，也就是 NIO 2，引入了异步非阻塞 IO 方式，也有很多人叫它 AIO（Asynchronous IO）。异步 IO 操作基于事件和回调机制，可以简单理解为，应用操作直接返回，而不会阻塞在那里，当后台处理完成，操作系统会通知相应线程进行后续工作。

## Java 有几种文件拷贝方式？哪一种最高效？

【典型回答】

字节流方式：

```java
public static void copyFileByStream(File source, File dest) throws
        IOException {
    try (InputStream is = new FileInputStream(source);
         OutputStream os = new FileOutputStream(dest);){
        byte[] buffer = new byte[1024];
        int length;
        while ((length = is.read(buffer)) > 0) {
            os.write(buffer, 0, length);
        }
    }
 }
```

NIO 方式：

```java
public static void copyFileByChannel(File source, File dest) throws
        IOException {
    try (FileChannel sourceChannel = new FileInputStream(source)
            .getChannel();
         FileChannel targetChannel = new FileOutputStream(dest).getChannel
                 ();){
        for (long count = sourceChannel.size() ;count>0 ;) {
            long transferred = sourceChannel.transferTo(
                    sourceChannel.position(), count, targetChannel);            sourceChannel.position(sourceChannel.position() + transferred);
            count -= transferred;
        }
    }
 }
```

【考点分析】

- 不同的 copy 方式，底层机制有什么区别？
- 为什么零拷贝（zero-copy）可能有性能优势？
- Buffer 分类与使用。
- Direct Buffer 对垃圾收集等方面的影响与实践选择。

【知识扩展】

首先，你需要理解用户态空间（User Space）和内核态空间（Kernel Space），这是操作系统层面的基本概念，操作系统内核、硬件驱动等运行在内核态空间，具有相对高的特权；而用户态空间，则是给普通应用和服务使用。你可以参考：https://en.wikipedia.org/wiki/User_space。

当我们使用输入输出流进行读写时，实际上是进行了多次上下文切换，比如应用读取数据时，先在内核态将数据从磁盘读取到内核缓存，再切换到用户态将数据从内核缓存读取到用户缓存。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240702998.png)

基于 NIO transferTo 的实现方式，在 Linux 和 Unix 上，则会使用到零拷贝技术，数据传输并不需要用户态参与，省去了上下文切换的开销和不必要的内存拷贝，进而可能提高应用拷贝性能。注意，transferTo 不仅仅是可以用在文件拷贝中，与其类似的，例如读取磁盘文件，然后进行 Socket 发送，同样可以享受这种机制带来的性能和扩展性提高。

transferTo 的传输过程是：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240702146.png)

## 谈谈接口和抽象类有什么区别？

【典型回答】+【考点分析】

接口是对行为的抽象，它是抽象方法的集合，利用接口可以达到 API 定义和实现分离的目的。接口，不能实例化；不能包含任何非常量成员，任何 field 都是隐含着 public static final 的意义；同时，没有非静态方法实现，也就是说要么是抽象方法，要么是静态方法。

抽象类是不能实例化的类，用 abstract 关键字修饰 class，其目的主要是代码重用。除了不能实例化，形式上和一般的 Java 类并没有太大区别，可以有一个或者多个抽象方法，也可以没有抽象方法。

【知识扩展】

Java 相比于其他面向对象语言，**Java 不支持多继承**。

Java 8 增加了函数式编程的支持，所以又增加了一类定义，即所谓 functional interface，简单说就是只有一个抽象方法的接口，通常建议使用 @FunctionalInterface Annotation 来标记。Lambda 表达式本身可以看作是一类 functional interface，某种程度上这和面向对象可以算是两码事。我们熟知的 Runnable、Callable 之类，都是 functional interface。

从 Java 8 开始，interface 增加了对 default method 的支持。Java 9 以后，甚至可以定义 private default method。Default method 提供了一种二进制兼容的扩展已有接口的办法。

面向对象设计：

- **封装**的目的是隐藏事务内部的实现细节，以便提高安全性和简化编程。封装提供了合理的边界，避免外部调用者接触到内部的细节。
- **继承**是代码复用的基础机制，但要注意，继承可以看作是非常紧耦合的一种关系，父类代码修改，子类行为也会变动。在实践中，过度滥用继承，可能会起到反效果。
- **多态**，你可能立即会想到重写（override）和重载（overload）、向上转型。简单说，重写是父子类中相同名字和参数的方法，不同的实现；重载则是相同名字的方法，但是不同的参数。

面向对象设计原则（S.O.L.I.D）

- 单一职责（Single Responsibility），类或者对象最好是只有单一职责，在程序设计中如果发现某个类承担着多种义务，可以考虑进行拆分。
- 开关原则（Open-Close, Open for extension, close for modification），设计要对扩展开放，对修改关闭。换句话说，程序设计应保证平滑的扩展性，尽量避免因为新增同类功能而修改已有实现，这样可以少产出些回归（regression）问题。
- 里氏替换（Liskov Substitution），这是面向对象的基本要素之一，进行继承关系抽象时，凡是可以用父类或者基类的地方，都可以用子类替换。
- 接口分离（Interface Segregation），我们在进行类和接口设计时，如果在一个接口里定义了太多方法，其子类很可能面临两难，就是只有部分方法对它是有意义的，这就破坏了程序的内聚性。
- 依赖反转（Dependency Inversion），实体应该依赖于抽象而不是实现。也就是说高层次模块，不应该依赖于低层次模块，而是应该基于抽象。实践这一原则是保证产品代码之间适当耦合度的法宝。

## 谈谈你知道的设计模式？

【典型回答】+【考点分析】+【知识扩展】

设计模式可以分为创建型模式、结构型模式和行为型模式。

- 创建型模式，是对对象创建过程的各种问题和解决方案的总结，包括：各种工厂模式（Factory、Abstract Factory）、单例模式（Singleton）、构建器模式（Builder）、原型模式（ProtoType）。
- 结构型模式，是针对软件设计结构的总结，关注于类、对象继承、组合方式的实践经验。常见的结构型模式，包括：桥接模式（Bridge）、适配器模式（Adapter）、装饰者模式（Decorator）、代理模式（Proxy）、组合模式（Composite）、外观模式（Facade）、享元模式（Flyweight）等。
- 行为型模式，是从类或对象之间交互、职责划分等角度总结的模式。比较常见的行为型模式有策略模式（Strategy）、解释器模式（Interpreter）、命令模式（Command）、观察者模式（Observer）、迭代器模式（Iterator）、模板方法模式（Template Method）、访问者模式（Visitor）。

## synchronized 和 ReentrantLock 有什么区别呢？

【典型回答】+【考点分析】+【知识扩展】

synchronized 和 ReentrantLock 的语义基本相同。

synchronized 是内置锁，ReentrantLock 是显式锁，二者的差异有：

- **主动获取锁和释放锁**
  - `synchronized` 不能主动获取锁和释放锁。获取锁和释放锁都是 JVM 控制的。
  - `ReentrantLock` 可以主动获取锁和释放锁。（如果忘记释放锁，就可能产生死锁）。
- **响应中断**
  - `synchronized` 不能响应中断。
  - `ReentrantLock` 可以响应中断。
- **超时机制**
  - `synchronized` 没有超时机制。
  - `ReentrantLock` 有超时机制。`ReentrantLock` 可以设置超时时间，超时后自动释放锁，避免一直等待。
- **支持公平锁**
  - `synchronized` 只支持非公平锁。
  - `ReentrantLock` 支持非公平锁和公平锁。
- **是否支持共享**
  - 被 `synchronized` 修饰的方法或代码块，只能被一个线程访问（独享）。如果这个线程被阻塞，其他线程也只能等待
  - `ReentrantLock` 可以基于 `Condition` 灵活的控制同步条件。

## synchronized 底层如何实现？什么是锁的升级、降级？

【典型回答】+【考点分析】+【知识扩展】

synchronized 代码块是由一对儿 monitorenter/monitorexit 指令实现的，Monitor 对象是同步的基本实现 [单元](https://docs.oracle.com/javase/specs/jls/se10/html/jls-8.html#d5e13622)。

JDK6 以前，由于 synchronized 阻塞度高，导致性能不佳。JDK6 对此，进行了大量优化，其性能与 `ReentrantLock` 已基本持平。

在 JDK1.6 JVM 中，对象实例在堆内存中被分为了三个部分：对象头、实例数据和对齐填充。其中 Java 对象头由 Mark Word、指向类的指针以及数组长度三部分组成。

Mark Word 记录了对象和锁有关的信息。Mark Word 在 64 位 JVM 中的长度是 64bit，我们可以一起看下 64 位 JVM 的存储结构是怎么样的。如下图所示：

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200629191250.png)

锁升级功能主要依赖于 Mark Word 中的锁标志位和释放偏向锁标志位，`synchronized` 同步锁就是从偏向锁开始的，随着竞争越来越激烈，偏向锁升级到轻量级锁，最终升级到重量级锁。

Java 1.6 引入了偏向锁和轻量级锁，从而让 `synchronized` 拥有了四个状态：

- **无锁状态（unlocked）**
- **偏向锁状态（biasble）**
- **轻量级锁状态（lightweight locked）**
- **重量级锁状态（inflated）**

当 JVM 检测到不同的竞争状况时，会自动切换到适合的锁实现。

当没有竞争出现时，默认会使用偏向锁。JVM 会利用 CAS 操作（compare and swap），在对象头上的 Mark Word 部分设置线程 ID，以表示这个对象偏向于当前线程，所以并不涉及真正的互斥锁。这样做的假设是基于在很多应用场景中，大部分对象生命周期中最多会被一个线程锁定，使用偏斜锁可以降低无竞争开销。

如果有另外的线程试图锁定某个已经被偏斜过的对象，JVM 就需要撤销（revoke）偏向锁，并切换到轻量级锁实现。轻量级锁依赖 CAS 操作 Mark Word 来试图获取锁，如果重试成功，就使用普通的轻量级锁；否则，进一步升级为重量级锁。

## 一个线程两次调用 start() 方法会出现什么情况？

【典型回答】+【考点分析】+【知识扩展】

Java 的线程是不允许调用 start() 两次的，第二次调用必然会抛出 IllegalThreadStateException。

线程是系统调度的最小单元，一个进程可以包含多个线程，作为任务的真正运作者，有自己的栈（Stack）、寄存器（Register）、本地存储（Thread Local）等，但是会和进程内其他线程共享文件描述符、虚拟地址空间等。

线程还分为内核线程、用户线程，Java 的线程实现其实是与虚拟机相关的。对于我们最熟悉的 Sun/Oracle JDK，其线程也经历了一个演进过程，基本上在 Java 1.2 之后，JDK 已经抛弃了所谓的 [Green Thread](https://en.wikipedia.org/wiki/Green_threads)，也就是用户调度的线程，现在的模型是一对一映射到操作系统内核线程。

如果我们来看 Thread 的源码，你会发现其基本操作逻辑大都是以 JNI 形式调用的本地代码。

```java
private native void start0();
private native void setPriority0(int newPriority);
private native void interrupt0();
```

近几年的 Go 语言等提供了协程（[coroutine](https://en.wikipedia.org/wiki/Coroutine)），大大提高了构建并发应用的效率。于此同时，Java 也在 [Loom](http://openjdk.java.net/projects/loom/) 项目中，孕育新的类似轻量级用户线程（Fiber）等机制，也许在不久的将来就可以在新版 JDK 中使用到它。

### 线程生命周期

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202408290809602.png)

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

## 什么情况下 Java 程序会产生死锁？如何定位、修复？

【典型回答】+【考点分析】+【知识扩展】

### 什么是死锁

**死锁**：**一组互相竞争资源的线程因互相等待，导致“永久”阻塞的现象**。

死锁是一种特定的程序状态，在实体之间，由于循环依赖导致彼此一直处于等待之中，没有任何个体可以继续前进。死锁不仅仅是在线程之间会发生，存在资源独占的进程之间同样也可能出现死锁。通常来说，我们大多是聚焦在多线程场景中的死锁，指两个或多个线程之间，由于互相持有对方需要的锁，而永久处于阻塞的状态。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409050712813.png)

### 如何检测死锁

首先，可以使用 jps 或者系统的 ps 命令、任务管理器等工具，确定进程 ID。

其次，调用 jstack 获取线程栈：

```java
${JAVA_HOME}\bin\jstack your_pid
```

然后，分析得到的输出，具体片段如下：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240702087.png)

最后，结合代码分析线程栈信息。上面这个输出非常明显，找到处于 BLOCKED 状态的线程，按照试图获取（waiting）的锁 ID（请看我标记为相同颜色的数字）查找，很快就定位问题。 jstack 本身也会把类似的简单死锁抽取出来，直接打印出来。

识别死锁总体上可以理解为：**区分线程状态 -> 查看等待目标 -> 对比 Monitor 等持有状态**

### 如何避免死锁

只有以下这四个条件都发生时才会出现死锁：

- **互斥**，共享资源 X 和 Y 只能被一个线程占用；
- **占有且等待**，线程 T1 已经取得共享资源 X，在等待共享资源 Y 的时候，不释放共享资源 X；
- **不可抢占**，其他线程不能强行抢占线程 T1 占有的资源；
- **循环等待**，线程 T1 等待线程 T2 占有的资源，线程 T2 等待线程 T1 占有的资源，就是循环等待。

**也就是说只要破坏任意一个，就可以避免死锁的发生**。

其中，互斥这个条件我们没有办法破坏，因为我们用锁为的就是互斥。不过其他三个条件都是有办法破坏掉的，到底如何做呢？

1. 对于“占用且等待”这个条件，我们可以一次性申请所有的资源，这样就不存在等待了。
2. 对于“不可抢占”这个条件，占用部分资源的线程进一步申请其他资源时，如果申请不到，可以主动释放它占有的资源，这样不可抢占这个条件就破坏掉了。超时释放锁
3. 对于“循环等待”这个条件，可以靠按序申请资源来预防。所谓按序申请，是指资源是有线性顺序的，申请的时候可以先申请资源序号小的，再申请资源序号大的，这样线性化后自然就不存在循环了。

## Java 并发包提供了哪些并发工具类？

【典型回答】+【考点分析】+【知识扩展】

J.U.C 提供了以下方面的工具：

- 提供了比 synchronized 更加高级的各种同步结构，包括 CountDownLatch、CyclicBarrier、Semaphore 等，可以实现更加丰富的多线程操作，比如利用 Semaphore 作为资源控制器，限制同时进行工作的线程数量。
- 各种线程安全的容器，比如最常见的 ConcurrentHashMap、有序的 ConcurrentSkipListMap，或者通过类似快照机制，实现线程安全的动态数组 CopyOnWriteArrayList 等。
- 各种并发队列实现，如各种 BlockingQueue 实现，比较典型的 ArrayBlockingQueue、 SynchronousQueue 或针对特定场景的 PriorityBlockingQueue 等。
- 强大的 Executor 框架，可以创建各种不同类型的线程池，调度任务运行等，绝大部分情况下，不再需要自己从头实现线程池和任务调度器。

同步工具：

- [CountDownLatch](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/CountDownLatch.html)，允许一个或多个线程等待某些操作完成。
- [CyclicBarrier](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/CyclicBarrier.html)，一种辅助性的同步结构，允许多个线程等待到达某个屏障。
- [Semaphore](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Semaphore.html)，Java 版本的信号量实现。

## 并发包中的 ConcurrentLinkedQueue 和 LinkedBlockingQueue 有什么区别？

【典型回答】+【考点分析】+【知识扩展】

关于问题中它们的区别：

- Concurrent 类型基于 lock-free，在常见的多线程访问场景，一般可以提供较高吞吐量。
- 而 LinkedBlockingQueue 内部则是基于锁，并提供了 BlockingQueue 的等待性方法。

J.U.C 包提供的容器（Queue、List、Set）、Map，从命名上可以大概区分为 Concurrent\*、CopyOnWrite 和 Blocking 等三类，同样是线程安全容器，可以简单认为：

- Concurrent 类型没有类似 CopyOnWrite 之类容器相对较重的修改开销。
- 但是，凡事都是有代价的，Concurrent 往往提供了较低的遍历一致性。你可以这样理解所谓的弱一致性，例如，当利用迭代器遍历时，如果容器发生修改，迭代器仍然可以继续进行遍历。
- 与弱一致性对应的，就是我介绍过的同步容器常见的行为“fail-fast”，也就是检测到容器在遍历过程中发生了修改，则抛出 ConcurrentModificationException，不再继续遍历。
- 弱一致性的另外一个体现是，size 等操作准确性是有限的，未必是 100% 准确。
- 与此同时，读取的性能具有一定的不确定性。

下面这张图是 Java 并发类库提供的各种各样的**线程安全**队列实现，注意，图中并未将非线程安全部分包含进来。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240702121.png)

我们可以从不同的角度进行分类，从基本的数据结构的角度分析，有两个特别的 [Deque](https://docs.oracle.com/javase/9/docs/api/java/util/Deque.html) 实现，ConcurrentLinkedDeque 和 LinkedBlockingDeque。Deque 的侧重点是支持对队列头尾都进行插入和删除，所以提供了特定的方法，如：

- 尾部插入时需要的 [addLast(e)](https://docs.oracle.com/javase/9/docs/api/java/util/Deque.html#addLast-E-)、[offerLast(e)](https://docs.oracle.com/javase/9/docs/api/java/util/Deque.html#offerLast-E-)。
- 尾部删除所需要的 [removeLast()](https://docs.oracle.com/javase/9/docs/api/java/util/Deque.html#removeLast--)、[pollLast()](https://docs.oracle.com/javase/9/docs/api/java/util/Deque.html#pollLast--)。

队列是否有界、无界：

- ArrayBlockingQueue 是最典型的的有界队列，其内部以 final 的数组保存数据，数组的大小就决定了队列的边界，所以我们在创建 ArrayBlockingQueue 时，都要指定容量，如

```java
public ArrayBlockingQueue(int capacity, boolean fair)
```

- LinkedBlockingQueue，容易被误解为无边界，但其实其行为和内部代码都是基于有界的逻辑实现的，只不过如果我们没有在创建队列时就指定容量，那么其容量限制就自动被设置为 Integer.MAX_VALUE，成为了无界队列。
- SynchronousQueue，这是一个非常奇葩的队列实现，每个删除操作都要等待插入操作，反之每个插入操作也都要等待删除动作。那么这个队列的容量是多少呢？是 1 吗？其实不是的，其内部容量是 0。
- PriorityBlockingQueue 是无边界的优先队列，虽然严格意义上来讲，其大小总归是要受系统资源影响。
- DelayedQueue 和 LinkedTransferQueue 同样是无边界的队列。对于无边界的队列，有一个自然的结果，就是 put 操作永远也不会发生其他 BlockingQueue 的那种等待情况。

如果我们分析不同队列的底层实现，BlockingQueue 基本都是基于锁实现。

## Java 并发类库提供的线程池有哪几种？ 分别有什么特点？

【典型回答】+【考点分析】+【知识扩展】

Executors 目前提供了 5 种不同的线程池创建配置：

- `CachedThreadPool`，它是一种用来处理大量短时间工作任务的线程池，具有几个鲜明特点：它会试图缓存线程并重用，当无缓存线程可用时，就会创建新的工作线程；如果线程闲置的时间超过 60 秒，则被终止并移出缓存；长时间闲置时，这种线程池，不会消耗什么资源。其内部使用 `SynchronousQueue` 作为工作队列。
- `FixedThreadPool`，重用指定数目（nThreads）的线程，其背后使用的是无界的工作队列，任何时候最多有 nThreads 个工作线程是活动的。这意味着，如果任务数量超过了活动队列数目，将在工作队列中等待空闲线程出现；如果有工作线程退出，将会有新的工作线程被创建，以补足指定的数目 nThreads。
- `SingleThreadExecutor`，它的特点在于工作线程数目被限制为 1，操作一个无界的工作队列，所以它保证了所有任务的都是被顺序执行，最多会有一个任务处于活动状态，并且不允许使用者改动线程池实例，因此可以避免其改变线程数目。
- `SingleThreadScheduledExecutor` 和 `ScheduledThreadPool`，创建的是个 `ScheduledExecutorService`，可以进行定时或周期性的工作调度，区别在于单一工作线程还是多个工作线程。
- `WorkStealingPool`，这是一个经常被人忽略的线程池，Java 8 才加入这个创建方法，其内部会构建 [ForkJoinPool](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/ForkJoinPool.html)，利用 [Work-Stealing](https://en.wikipedia.org/wiki/Work_stealing) 算法，并行地处理任务，不保证处理顺序。

Executor 框架的基本组成，请参考下面的类图。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240703740.png)

- Executor 是一个基础的接口，其初衷是将任务提交和任务执行细节解耦，这一点可以体会其定义的唯一方法。

```java
void execute(Runnable command);
```

Executor 的设计是源于 Java 早期线程 API 使用的教训，开发者在实现应用逻辑时，被太多线程创建、调度等不相关细节所打扰。就像我们进行 HTTP 通信，如果还需要自己操作 TCP 握手，开发效率低下，质量也难以保证。

- ExecutorService 则更加完善，不仅提供 service 的管理功能，比如 shutdown 等方法，也提供了更加全面的提交任务机制，如返回 [Future](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Future.html) 而不是 void 的 submit 方法。

```java
<T> Future<T> submit(Callable<T> task);
```

线程池设计：

- 工作队列负责存储用户提交的各个任务，这个工作队列，可以是容量为 0 的 SynchronousQueue（使用 newCachedThreadPool），也可以是像固定大小线程池（newFixedThreadPool）那样使用 LinkedBlockingQueue。

```java
private final BlockingQueue<Runnable> workQueue;
```

- 内部的“线程池”，这是指保持工作线程的集合，线程池需要在运行过程中管理线程创建、销毁。例如，对于带缓存的线程池，当任务压力较大时，线程池会创建新的工作线程；当业务压力退去，线程池会在闲置一段时间（默认 60 秒）后结束线程。

```java
private final HashSet<Worker> workers = new HashSet<>();
```

线程池的工作线程被抽象为静态内部类 Worker，基于 [AQS](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/locks/AbstractQueuedSynchronizer.html) 实现。

- ThreadFactory 提供上面所需要的创建线程逻辑。
- 如果任务提交时被拒绝，比如线程池已经处于 SHUTDOWN 状态，需要为其提供处理逻辑，Java 标准库提供了类似 [ThreadPoolExecutor.AbortPolicy](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/ThreadPoolExecutor.AbortPolicy.html) 等默认实现，也可以按照实际需求自定义。

## AtomicInteger 底层实现原理是什么？如何在自己的产品代码中应用 CAS 操作？

【典型回答】+【考点分析】+【知识扩展】

原子类基于 CAS（[compare-and-swap](https://en.wikipedia.org/wiki/Compare-and-swap)）技术。从其代码来看，它依赖于 Unsafe 提供的一些底层能力。

```java
private static final jdk.internal.misc.Unsafe U = jdk.internal.misc.Unsafe.getUnsafe();
private static final long VALUE = U.objectFieldOffset(AtomicInteger.class, "value");
private volatile int value;
```

CAS 底层实现依赖于 CPU 提供的特定原子指令，具体根据体系结构的不同还存在着明显区别。

CAS 的问题：

- 如果并发冲突频繁，CAS 反复自旋重试，会大量消耗 CPU
- ABA 问题——可以通过 `AtomicStampedReference` 解决（增加时间戳、版本号来识别）。

AQS 内部数据和方法，可以简单拆分为：

- 一个 volatile 的整数成员表征状态，同时提供了 setState 和 getState 方法

```java
private volatile int state;
```

- 一个先入先出（FIFO）的等待线程队列，以实现多线程间竞争和等待，这是 AQS 机制的核心之一。
- 各种基于 CAS 的基础操作方法，以及各种期望具体同步结构去实现的 acquire/release 方法。

利用 AQS 实现一个同步结构，至少要实现两个基本类型的方法，分别是 acquire 操作，获取资源的独占权；还有就是 release 操作，释放对某个资源的独占。

以 ReentrantLock 为例，它内部通过扩展 AQS 实现了 Sync 类型，以 AQS 的 state 来反映锁的持有情况。

```java
private final Sync sync;
abstract static class Sync extends AbstractQueuedSynchronizer { …}
```

下面是 ReentrantLock 对应 acquire 和 release 操作，如果是 CountDownLatch 则可以看作是 await()/countDown()，具体实现也有区别。

```java
public void lock() {
    sync.acquire(1);
}
public void unlock() {
    sync.release(1);
}
```

排除掉一些细节，整体地分析 acquire 方法逻辑，其直接实现是在 AQS 内部，调用了 tryAcquire 和 acquireQueued，这是两个需要搞清楚的基本部分。

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

首先，我们来看看 tryAcquire。在 ReentrantLock 中，tryAcquire 逻辑实现在 NonfairSync 和 FairSync 中，分别提供了进一步的非公平或公平性方法，而 AQS 内部 tryAcquire 仅仅是个接近未实现的方法（直接抛异常），这是留个实现者自己定义的操作。

我们可以看到公平性在 ReentrantLock 构建时如何指定的，具体如下：

```java
public ReentrantLock() {
    sync = new NonfairSync(); // 默认是非公平的
}
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```

以非公平的 tryAcquire 为例，其内部实现了如何配合状态与 CAS 获取锁，注意，对比公平版本的 tryAcquire，它在锁无人占有时，并不检查是否有其他等待者，这里体现了非公平的语义。

```java
final boolean nonfairTryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();// 获取当前 AQS 内部状态量
    if (c == 0) { // 0 表示无人占有，则直接用 CAS 修改状态位，
      if (compareAndSetState(0, acquires)) {// 不检查排队情况，直接争抢
          setExclusiveOwnerThread(current);  //并设置当前线程独占锁
          return true;
      }
    } else if (current == getExclusiveOwnerThread()) { //即使状态不是 0，也可能当前线程是锁持有者，因为这是再入锁
      int nextc = c + acquires;
      if (nextc < 0) // overflow
          throw new Error("Maximum lock count exceeded");
      setState(nextc);
      return true;
  }
  return false;
}
```

接下来我再来分析 acquireQueued，如果前面的 tryAcquire 失败，代表着锁争抢失败，进入排队竞争阶段。这里就是我们所说的，利用 FIFO 队列，实现线程间对锁的竞争的部分，算是是 AQS 的核心逻辑。

当前线程会被包装成为一个排他模式的节点（EXCLUSIVE），通过 addWaiter 方法添加到队列中。acquireQueued 的逻辑，简要来说，就是如果当前节点的前面是头节点，则试图获取锁，一切顺利则成为新的头节点；否则，有必要则等待，具体处理逻辑请参考我添加的注释。

```java
final boolean acquireQueued(final Node node, int arg) {
      boolean interrupted = false;
      try {
      for (;;) {// 循环
          final Node p = node.predecessor();// 获取前一个节点
          if (p == head && tryAcquire(arg)) { // 如果前一个节点是头结点，表示当前节点合适去 tryAcquire
              setHead(node); // acquire 成功，则设置新的头节点
              p.next = null; // 将前面节点对当前节点的引用清空
              return interrupted;
          }
          if (shouldParkAfterFailedAcquire(p, node)) // 检查是否失败后需要 park
              interrupted |= parkAndCheckInterrupt();
      }
       } catch (Throwable t) {
      cancelAcquire(node);// 出现异常，取消
      if (interrupted)
              selfInterrupt();
      throw t;
      }
}
```

到这里线程试图获取锁的过程基本展现出来了，tryAcquire 是按照特定场景需要开发者去实现的部分，而线程间竞争则是 AQS 通过 Waiter 队列与 acquireQueued 提供的，在 release 方法中，同样会对队列进行对应操作。

## 请介绍类加载过程，什么是双亲委派模型？

【典型回答】+【考点分析】+【知识扩展】

类加载过程：

- 加载 - 将字节码数据从不同的数据源读取到 JVM 中，并映射为 JVM 认可的数据结构（Class 对象）。
- 链接
  - 验证 - 核验字节信息是符合 Java 虚拟机规范。
  - 准备 - 创建类或接口中的静态变量，并初始化静态变量的初始值。
  - 解析 - 将常量池中的符号引用（symbolic reference）替换为直接引用。
- 初始化 - 真正去执行类初始化的代码逻辑，包括静态字段赋值的动作，以及执行类定义中的静态初始化块内的逻辑，编译器在编译阶段就会把这部分逻辑整理好，父类型的初始化逻辑优先于当前类型的逻辑。

双亲委派

- Bootstrap ClassLoader - 负责加载 /jre/lib 路径下的 jar。可以通过 `java -Xbootclasspath` 参数修改扫描路径。
- Ext ClassLoader - 负责加载 `/jre/lib/ext` 路径下的 jar。可以通过 `-Djava.ext.dirs` 参数修改扫描路径。
- App ClassLoaer- 负责加载 classpath 路径下的内容。可以通过 -Djava.system.class.loader 参数修改扫描路径。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240704663.png)

通常类加载机制有三个基本特征：

- 双亲委派模型。但不是所有类加载都遵守这个模型，有的时候，启动类加载器所加载的类型，是可能要加载用户代码的，比如 JDK 内部的 ServiceProvider/[ServiceLoader](https://docs.oracle.com/javase/9/docs/api/java/util/ServiceLoader.html) 机制，用户可以在标准 API 框架上，提供自己的实现，JDK 也需要提供些默认的参考实现。 例如，Java 中 JNDI、JDBC、文件系统、Cipher 等很多方面，都是利用的这种机制，这种情况就不会用双亲委派模型去加载，而是利用所谓的上下文加载器。
- 可见性，子类加载器可以访问父加载器加载的类型，但是反过来是不允许的，不然，因为缺少必要的隔离，我们就没有办法利用类加载器去实现容器的逻辑。
- 单一性，由于父加载器的类型对于子加载器是可见的，所以父加载器中加载过的类型，就不会在子加载器中重复加载。但是注意，类加载器“邻居”间，同一类型仍然可以被加载多次，因为互相并不可见。

在 JDK 9 中，由于 Jigsaw 项目引入了 Java 平台模块化系统（JPMS），Java SE 的源代码被划分为一系列模块。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240704856.png)

类加载器，类文件容器等都发生了非常大的变化：

- -Xbootclasspath 参数不可用了。API 已经被划分到具体的模块，所以上文中，利用“-Xbootclasspath/p”替换某个 Java 核心类型代码，实际上变成了对相应的模块进行的修补，可以采用下面的解决方案：

首先，确认要修改的类文件已经编译好，并按照对应模块（假设是 java.base）结构存放， 然后，给模块打补丁：

```bash
java --patch-module java.base=your_patch yourApp
```

- 扩展类加载器被重命名为平台类加载器（Platform Class-Loader），而且 extension 机制则被移除。也就意味着，如果我们指定 java.ext.dirs 环境变量，或者 lib/ext 目录存在，JVM 将直接返回**错误**！建议解决办法就是将其放入 classpath 里。
- 部分不需要 AllPermission 的 Java 基础模块，被降级到平台类加载器中，相应的权限也被更精细粒度地限制起来。
- rt.jar 和 tools.jar 同样是被移除了！JDK 的核心类库以及相关资源，被存储在 jimage 文件中，并通过新的 JRT 文件系统访问，而不是原有的 JAR 文件系统。虽然看起来很惊人，但幸好对于大部分软件的兼容性影响，其实是有限的，更直接地影响是 IDE 等软件，通常只要升级到新版本就可以了。
- 增加了 Layer 的抽象， JVM 启动默认创建 BootLayer，开发者也可以自己去定义和实例化 Layer，可以更加方便的实现类似容器一般的逻辑抽象。

结合了 Layer，目前的 JVM 内部结构就变成了下面的层次，内建类加载器都在 BootLayer 中，其他 Layer 内部有自定义的类加载器，不同版本模块可以同时工作在不同的 Layer。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240704234.png)

## 有哪些方法可以在运行时动态生成一个 Java 类？

【典型回答】+【考点分析】+【知识扩展】

可以利用 Java 字节码操纵工具和类库来实现，如：[ASM](https://asm.ow2.io/)、[Javassist](http://www.javassist.org/)、cglib 等

类从字节码到 Class 对象的转换，在类加载过程中，这一步是通过下面的方法提供的功能，或者 defineClass 的其他本地对等实现。

```java
protected final Class<?> defineClass(String name, byte[] b, int off, int len,
                                   ProtectionDomain protectionDomain)
protected final Class<?> defineClass(String name, java.nio.ByteBuffer b,
                                   ProtectionDomain protectionDomain)
```

JDK 提供的 defineClass 方法，最终都是本地代码实现的。

```java
static native Class<?> defineClass1(ClassLoader loader, String name, byte[] b, int off, int len,
                                  ProtectionDomain pd, String source);

static native Class<?> defineClass2(ClassLoader loader, String name, java.nio.ByteBuffer b,
                                  int off, int len, ProtectionDomain pd,
                                  String source);
```

## 谈谈 JVM 内存区域的划分，哪些区域可能发生 OutOfMemoryError

【典型回答】+【考点分析】+【知识扩展】

- 首先，**程序计数器**（PC，Program Counter Register）。在 JVM 规范中，每个线程都有它自己的程序计数器，并且任何时间一个线程都只有一个方法在执行，也就是所谓的当前方法。程序计数器会存储当前线程正在执行的 Java 方法的 JVM 指令地址；或者，如果是在执行本地方法，则是未指定值（undefined）。
- 第二，**Java 虚拟机栈**（Java Virtual Machine Stack），早期也叫 Java 栈。每个线程在创建时都会创建一个虚拟机栈，其内部保存一个个的栈帧（Stack Frame），对应着一次次的 Java 方法调用。
  - 前面谈程序计数器时，提到了当前方法；同理，在一个时间点，对应的只会有一个活动的栈帧，通常叫作当前帧，方法所在的类叫作当前类。如果在该方法中调用了其他方法，对应的新的栈帧会被创建出来，成为新的当前帧，一直到它返回结果或者执行结束。JVM 直接对 Java 栈的操作只有两个，就是对栈帧的压栈和出栈。
  - 栈帧中存储着局部变量表、操作数（operand）栈、动态链接、方法正常退出或者异常退出的定义等。
- 第三，**堆**（Heap），它是 Java 内存管理的核心区域，用来放置 Java 对象实例，几乎所有创建的 Java 对象实例都是被直接分配在堆上。堆被所有的线程共享，在虚拟机启动时，我们指定的“Xmx”之类参数就是用来指定最大堆空间等指标。
  - 理所当然，堆也是垃圾收集器重点照顾的区域，所以堆内空间还会被不同的垃圾收集器进行进一步的细分，最有名的就是新生代、老年代的划分。
- 第四，**方法区**（Method Area）。这也是所有线程共享的一块内存区域，用于存储所谓的元（Meta）数据，例如类结构信息，以及对应的运行时常量池、字段、方法代码等。
  - 由于早期的 Hotspot JVM 实现，很多人习惯于将方法区称为永久代（Permanent Generation）。Oracle JDK 8 中将永久代移除，同时增加了元数据区（Metaspace）。
- 第五，**运行时常量池**（Run-Time Constant Pool），这是方法区的一部分。如果仔细分析过反编译的类文件结构，你能看到版本号、字段、方法、超类、接口等各种信息，还有一项信息就是常量池。Java 的常量池可以存放各种常量信息，不管是编译期生成的各种字面量，还是需要在运行时决定的符号引用，所以它比一般语言的符号表存储的信息更加宽泛。
- 第六，**本地方法栈**（Native Method Stack）。它和 Java 虚拟机栈是非常相似的，支持对本地方法的调用，也是每个线程都会创建一个。在 Oracle Hotspot JVM 中，本地方法栈和 Java 虚拟机栈是在同一块儿区域，这完全取决于技术实现的决定，并未在规范中强制。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240705853.png)

OOM 场景：

- Java heap space - 堆空间溢出
- GC overhead limit exceeded - GC 开销超过限制。官方给出的定义是：**超过 `98%` 的时间用来做 GC 并且回收了不到 `2%` 的堆内存时会抛出此异常**。这意味着，发生在 GC 占用大量时间为释放很小空间的时候发生的，是一种保护机制。导致异常的原因：一般是因为堆太小，没有足够的内存。
- PermGen space - Perm （永久代）空间主要用于存放 `Class` 和 Meta 信息，包括类的名称和字段，带有方法字节码的方法，常量池信息，与类关联的对象数组和类型数组以及即时编译器优化。GC 在主程序运行期间不会对永久代空间进行清理，默认是 64M 大小。根据上面的定义，可以得出 **PermGen 大小要求取决于加载的类的数量以及此类声明的大小**。因此，可以说造成该错误的主要原因是永久代中装入了太多的类或太大的类。在 JDK8 之前的版本中，可以通过 `-XX:PermSize` 和 `-XX:MaxPermSize` 设置永久代空间大小，从而限制方法区大小，并间接限制其中常量池的容量。
- Metaspace - Java8 以后，JVM 内存空间发生了很大的变化。取消了永久代，转而变为元数据区。
- Unable to create new native thread - 无法新建本地线程。这个错误意味着：**Java 应用程序已达到其可以启动线程数的限制**。
- 直接内存溢出 - 由直接内存导致的内存溢出，一个明显的特征是在 Heap Dump 文件中不会看见有什么明显的异常情况，如果读者发现内存溢出之后产生的 Dump 文件很小，而程序中又直接或间接使用了 DirectMemory（典型的间接使用就是 NIO），那就可以考虑重点检查一下直接内存方面的原因了。

## 如何监控和诊断 JVM 堆内和堆外内存使用？

【典型回答】+【考点分析】+【知识扩展】

- `jps` - 显示指定系统内所有的 JVM 进程
- `jstat` - 查看 JVM 统计信息（类装载、内存、垃圾收集、JIT 编译等运行数据）
- `jmap` - 生成堆内存快照（称为 heapdump 或 dump 文件）
- `jhat` - 用来分析 jmap 生成的 dump 文件
- `jstack` - 生成线程快照（称为 threaddump 或 coredump 文件）
- jinfo - 用于实时查看和调整虚拟机运行参数
- `JConsole` - 基于 JMX 的可视化监视与管理工具
- `VisualVM` - 多合一故障处理工具
- `MAT` - Eclipse 提供的内存分析工具
- JMC - [Java Mission Control](http://www.oracle.com/technetwork/java/javaseproducts/mission-control/java-mission-control-1998576.html) 不仅仅能够使用 [JMX](https://en.wikipedia.org/wiki/Java_Management_Extensions) 进行普通的管理、监控任务，还可以配合 [Java Flight Recorder](https://docs.oracle.com/javacomponents/jmc-5-4/jfr-runtime-guide/about.htm#JFRUH171)（JFR）技术，以非常低的开销，收集和分析 JVM 底层的 Profiling 和事件等信息。
- `JProfile`

堆结构示意图。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240705463.png)

### 年轻代

新生代是大部分对象创建和销毁的区域，在通常的 Java 应用中，绝大部分对象生命周期都是很短暂的。其内部又分为 Eden 区域，作为对象初始分配的区域；两个 Survivor，有时候也叫 from、to 区域，被用来放置从 Minor GC 中保留下来的对象。

JVM 会随意选取一个 Survivor 区域作为“to”，然后会在 GC 过程中进行区域间拷贝，也就是将 Eden 中存活下来的对象和 from 区域的对象，拷贝到这个“to”区域。这种设计主要是为了防止内存的碎片化，并进一步清理无用对象。

从内存模型而不是垃圾收集的角度，对 Eden 区域继续进行划分，Hotspot JVM 还有一个概念叫做 Thread Local Allocation Buffer（TLAB）。这是 JVM 为每个线程分配的一个私有缓存区域，否则，多线程同时分配内存时，为避免操作同一地址，可能需要使用加锁等机制，进而影响分配速度。TLAB 仍然在堆上，它是分配在 Eden 区域内的。其内部结构比较直观易懂，start、end 就是起始地址，top（指针）则表示已经分配到哪里了。所以我们分配新对象，JVM 就会移动 top，当 top 和 end 相遇时，即表示该缓存已满，JVM 会试图再从 Eden 里分配一块儿。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240705117.png)

### 老年代

放置长生命周期的对象，通常都是从 Survivor 区域拷贝过来的对象。当然，也有特殊情况，我们知道普通的对象会被分配在 TLAB 上；如果对象较大，JVM 会试图直接分配在 Eden 其他位置上；如果对象太大，完全无法在新生代找到足够长的连续空闲空间，JVM 就会直接分配到老年代。

### 永久代

这部分就是早期 Hotspot JVM 的方法区实现方式了，储存 Java 类元数据、常量池、Intern 字符串缓存，在 JDK 8 之后，这些数据被存储在元数据空间。

### JVM 参数

- 最大堆体积

```java
-Xmx value
```

- 初始的最小堆体积

```java
-Xms value
```

- 老年代和新生代的比例

```java
-XX:NewRatio=value
```

默认情况下，这个数值是 2，意味着老年代是新生代的 2 倍大；换句话说，新生代是堆大小的 1/3。

- 当然，也可以不用比例的方式调整新生代的大小，直接指定下面的参数，设定具体的内存大小数值。

```java
-XX:NewSize=value
```

- Eden 和 Survivor 的大小是按照比例设置的，如果 SurvivorRatio 是 8，那么 Survivor 区域就是 Eden 的 1⁄8 大小，也就是新生代的 1/10，因为 YoungGen=Eden + 2\*Survivor，JVM 参数格式是

```java
-XX:SurvivorRatio=value
```

- TLAB 当然也可以调整，JVM 实现了复杂的适应策略，如果你有兴趣可以参考这篇 [说明](https://blogs.oracle.com/jonthecollector/the-real-thing)。

## Java 常见的垃圾收集器有哪些？

【典型回答】+【考点分析】+【知识扩展】

### 垃圾收集器

- Serial GC，它是最古老的垃圾收集器，“Serial”体现在其收集工作是单线程的，并且在进行垃圾收集过程中，会进入臭名昭著的“Stop-The-World”状态。当然，其单线程设计也意味着精简的 GC 实现，无需维护复杂的数据结构，初始化也简单，所以一直是 Client 模式下 JVM 的默认选项。从年代的角度，通常将其老年代实现单独称作 Serial Old，它采用了标记 - 整理（Mark-Compact）算法，区别于新生代的复制算法。

- ParNew GC，很明显是个新生代 GC 实现，它实际是 Serial GC 的多线程版本，最常见的应用场景是配合老年代的 CMS GC 工作

- CMS（Concurrent Mark Sweep） GC，基于标记 - 清除（Mark-Sweep）算法，设计目标是尽量减少停顿时间，这一点对于 Web 等反应时间敏感的应用非常重要，一直到今天，仍然有很多系统使用 CMS GC。但是，CMS 采用的标记 - 清除算法，存在着内存碎片化问题，所以难以避免在长时间运行等情况下发生 full GC，导致恶劣的停顿。另外，既然强调了并发（Concurrent），CMS 会占用更多 CPU 资源，并和用户线程争抢。
- Parallel GC，在早期 JDK 8 等版本中，它是 server 模式 JVM 的默认 GC 选择，也被称作是吞吐量优先的 GC。它的算法和 Serial GC 比较相似，尽管实现要复杂的多，其特点是新生代和老年代 GC 都是并行进行的，在常见的服务器环境中更加高效。

- G1 GC 这是一种兼顾吞吐量和停顿时间的 GC 实现，是 Oracle JDK 9 以后的默认 GC 选项。G1 可以直观的设定停顿时间的目标，相比于 CMS GC，G1 未必能做到 CMS 在最好情况下的延时停顿，但是最差情况要好很多。

### 对象是否回收算法

**引用计数法** - 就是为对象添加一个引用计数，用于记录对象被引用的情况，如果计数为 0，即表示对象可回收。引用计数法最大的问题是难以处理循环引用。

**可达性分析法** - 就是将对象及其引用关系看作一个图，选定活动的对象作为 GC Roots，然后跟踪引用链条，如果一个对象和 GC Roots 之间不可达，也就是不存在引用链条，那么即可认为是可回收对象。JVM 会把虚拟机栈和本地方法栈中正在引用的对象、静态属性引用的对象和常量，作为 GC Roots。

### 垃圾收集算法

**标记 - 复制（Copying）** - 将内存划分为大小相等的两块，每次只使用其中一块，当这一块内存用完了就将还存活的对象复制到另一块上面，然后再把使用过的内存空间进行一次清理。这实际上也是利用了 CoW 机制。

**标记 - 清除（Mark-Sweep）** - 将需要回收的对象进行标记，然后清除。标记和清除过程效率都不高，会产生大量碎片，导致无法给大对象分配内存。

**标记 - 整理（Mark-Compact）** - 让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存。

### 垃圾收集过程

第一，Java 应用不断创建对象，通常都是分配在 Eden 区域，当其空间占用达到一定阈值时，触发 minor GC。仍然被引用的对象（绿色方块）存活下来，被复制到 JVM 选择的 Survivor 区域，而没有被引用的对象（黄色方块）则被回收。注意，我给存活对象标记了“数字 1”，这是为了表明对象的存活时间。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240706966.png)

第二， 经过一次 Minor GC，Eden 就会空闲下来，直到再次达到 Minor GC 触发条件，这时候，另外一个 Survivor 区域则会成为 to 区域，Eden 区域的存活对象和 From 区域对象，都会被复制到 to 区域，并且存活的年龄计数会被加 1。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240706215.png)

第三， 类似第二步的过程会发生很多次，直到有对象年龄计数达到阈值，这时候就会发生所谓的晋升（Promotion）过程，如下图所示，超过阈值的对象会被晋升到老年代。这个阈值是可以通过参数指定：

`-XX:MaxTenuringThreshold=<N>`

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240706521.png)

后面就是老年代 GC，具体取决于选择的 GC 选项，对应不同的算法。下面是一个简单标记 - 整理算法过程示意图，老年代中的无用对象被清除后， GC 会将对象进行整理，以防止内存碎片化。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240707750.png)

通常我们把老年代 GC 叫作 Major GC，将对整个堆进行的清理叫作 Full GC，但是这个也没有那么绝对，因为不同的老年代 GC 算法其实表现差异很大，例如 CMS，“concurrent”就体现在清理工作是与工作线程一起并发运行的。

## 谈谈你的 GC 调优思路

【典型回答】+【考点分析】+【知识扩展】

GC 调优，从性能角度来看，通常关注三个方面，内存占用（footprint）、延时（latency）和吞吐量（throughput），大多数情况下调优会侧重于其中一个或者两个方面的目标，很少有情况可以兼顾三个不同的角度。

调优思路：

- 理解应用需求和问题，确定调优目标。假设，我们开发了一个应用服务，但发现偶尔会出现性能抖动，出现较长的服务停顿。评估用户可接受的响应时间和业务量，将目标简化为，希望 GC 暂停尽量控制在 200ms 以内，并且保证一定标准的吞吐量。
- 掌握 JVM 和 GC 的状态，定位具体的问题，确定真的有 GC 调优的必要。具体有很多方法，比如，通过 jstat 等工具查看 GC 等相关状态，可以开启 GC 日志，或者是利用操作系统提供的诊断工具等。例如，通过追踪 GC 日志，就可以查找是不是 GC 在特定时间发生了长时间的暂停，进而导致了应用响应不及时。
- 这里需要思考，选择的 GC 类型是否符合我们的应用特征，如果是，具体问题表现在哪里，是 Minor GC 过长，还是 Mixed GC 等出现异常停顿情况；如果不是，考虑切换到什么类型，如 CMS 和 G1 都是更侧重于低延迟的 GC 选项。
- 通过分析确定具体调整的参数或者软硬件配置。
- 验证是否达到调优目标，如果达到目标，即可以考虑结束调优；否则，重复完成分析、调整、验证这个过程。

### G1 GC 机制

G1 内存区域如下图所示：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240707671.png)

region 的大小是一致的，数值是在 1M 到 32M 字节之间的一个 2 的幂值数，JVM 会尽量划分 2048 个左右、同等大小的 region。这个数字既可以手动调整，G1 也会根据堆大小自动进行调整。

在 G1 实现中，年代是个逻辑概念，具体体现在，一部分 region 是作为 Eden，一部分作为 Survivor，除了意料之中的 Old region，G1 会将超过 region 50% 大小的对象（在应用中，通常是 byte 或 char 数组）归类为 Humongous 对象，并放置在相应的 region 中。逻辑上，Humongous region 算是老年代的一部分，因为复制这样的大对象是很昂贵的操作，并不适合新生代 GC 的复制算法。

从 GC 算法的角度，G1 选择的是复合算法，可以简化理解为：

- 在新生代，G1 采用的仍然是并行的复制算法，所以同样会发生 Stop-The-World 的暂停。
- 在老年代，大部分情况下都是并发标记，而整理（Compact）则是和新生代 GC 时捎带进行，并且不是整体性的整理，而是增量进行的。

## Java 内存模型中的 happen-before 是什么？

【典型回答】+【考点分析】+【知识扩展】

JMM 为程序中所有的操作定义了一个偏序关系，称之为 **`先行发生原则（Happens-Before）`**。**Happens-Before** 是指 **前面一个操作的结果对后续操作是可见的**。

**Happens-Before** 非常重要，它是判断数据是否存在竞争、线程是否安全的主要依据，依靠这个原则，我们可以通过几条规则一揽子地解决并发环境下两个操作间是否可能存在冲突的所有问题。

- **程序顺序规则** - 在一个线程中，按照程序顺序，前面的操作 Happens-Before 于后续的任意操作。
- **锁定规则** - 一个 `unLock` 操作 Happens-Before 于后面对同一个锁的 `lock` 操作。
- **volatile 变量规则** - 对一个 `volatile` 变量的写操作 Happens-Before 于后面对这个变量的读操作。
- **线程启动规则** - `Thread` 对象的 `start()` 方法 Happens-Before 于此线程的每个一个动作。
- **线程终止规则** - 线程中所有的操作都 Happens-Before 于线程的终止检测，我们可以通过 `Thread.join()` 方法是否结束、`Thread.isAlive()` 的返回值手段检测到线程已经终止执行。
- **线程中断规则** - 对线程 `interrupt()` 方法的调用 Happens-Before 于被中断线程的代码检测到中断事件的发生，可以通过 `Thread.interrupted()` 方法检测到是否有中断发生。
- **对象终结规则** - 一个对象的初始化完成 Happens-Before 于它的 `finalize()` 方法的开始。
- **传递性** - 如果 A Happens-Before B，且 B Happens-Before C，那么 A Happens-Before C。

## Java 程序运行在 Docker 等容器环境有哪些新问题？

【典型回答】+【考点分析】+【知识扩展】

虽然看起来 Docker 之类容器和虚拟机非常相似，例如，它也有自己的 shell，能独立安装软件包，运行时与其他容器互不干扰。但是，如果深入分析你会发现，Docker 并不是一种完全的**虚拟化**技术，而更是一种轻量级的**隔离**技术。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240707589.png)

基于 namespace，Docker 为每个容器提供了单独的命名空间，对网络、PID、用户、IPC 通信、文件系统挂载点等实现了隔离。对于 CPU、内存、磁盘 IO 等计算资源，则是通过 CGroup 进行管理。

Docker 仅在类似 Linux 内核之上实现了有限的隔离和虚拟化，并不是像传统虚拟化软件那样，独立运行一个新的操作系统。对于 Java 来说，Docker 未完全隐藏底层信息，会产生以下问题：

第一，容器环境对于计算资源的管理方式是全新的，CGroup 作为相对比较新的技术，历史版本的 Java 显然并不能自然地理解相应的资源限制。

第二，namespace 对于容器内的应用细节增加了一些微妙的差异，比如 jcmd、jstack 等工具会依赖于“/proc//”下面提供的部分信息，但是 Docker 的设计改变了这部分信息的原有结构，我们需要对原有工具进行修改以适应这种变化。

**从 JVM 运行机制的角度，为什么这些“沟通障碍”会导致 OOM 等问题呢？**

- JVM 会大概根据检测到的内存大小，设置最初启动时的堆大小为系统内存的 1/64；并将堆最大值，设置为系统内存的 1/4。
- 而 JVM 检测到系统的 CPU 核数，则直接影响到了 Parallel GC 的并行线程数目和 JIT complier 线程数目，甚至是我们应用中 ForkJoinPool 等机制的并行等级。

这些默认参数，是根据通用场景选择的初始值。但是由于容器环境的差异，Java 的判断很可能是基于错误信息而做出的。更加严重的是，JVM 的一些原有诊断或备用机制也会受到影响。为保证服务的可用性，一种常见的选择是依赖“-XX:OnOutOfMemoryError”功能，通过调用处理脚本的形式来做一些补救措施，比如自动重启服务等。但是，这种机制是基于 fork 实现的，当 Java 进程已经过度提交内存时，fork 新的进程往往已经不可能正常运行了。

**如何解决这些问题呢？**

首先，如果你能够**升级到最新的 JDK 版本**，这个问题就迎刃而解了。针对这种情况，JDK 9 中引入了一些实验性的参数，以方便 Docker 和 Java“沟通”。

如果你可以切换到 JDK 10 或者更新的版本，问题就更加简单了。Java 对容器（Docker）的支持已经比较完善，默认就会自适应各种资源限制和实现差异。

JDK 9 中的实验性改进已经被移植到 Oracle JDK 8u131 之中。

## 你了解 Java 应用开发中的注入攻击吗？

【典型回答】+【考点分析】+【知识扩展】

注入攻击其基本特征是程序允许攻击者将不可信的动态内容注入到程序中，并将其执行，这就可能完全改变最初预计的执行过程，产生恶意效果。

- SQL 注入攻击
- 系统命令注入
- XML 注入攻击

## 如何写出安全的 Java 代码？

【典型回答】+【考点分析】+【知识扩展】

略

## 后台服务出现明显“变慢”，谈谈你的诊断思路？

【典型回答】+【考点分析】+【知识扩展】

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240708746.png)

## 有人说“Lambda 能让 Java 程序慢 30 倍”，你怎么看？

【典型回答】+【考点分析】+【知识扩展】

在实际运行中，基于 Lambda/Stream 的版本（lambdaMaxInteger），比传统的 for-each 版本（forEachLoopMaxInteger）慢很多。

```java
// 一个大的 ArrayList，内部是随机的整形数据
volatile List<Integer> integers = …

// 基准测试 1
public int forEachLoopMaxInteger() {
   int max = Integer.MIN_VALUE;
   for (Integer n : integers) {
    max = Integer.max(max, n);
   }
   return max;
}

// 基准测试 2
public int lambdaMaxInteger() {
   return integers.stream().reduce(Integer.MIN_VALUE, (a, b) -> Integer.max(a, b));
}
```

以上代码片段更多的开销是源于自动装箱、拆箱（auto-boxing/unboxing），而不是源自 Lambda 和 Stream。

一般来说，可以认为 Lambda/Stream 提供了与传统方式接近对等的性能，但是如果对于性能非常敏感，就不能完全忽视它在特定场景的性能差异了，例如：**初始化的开销**。 Lambda 并不算是语法糖，而是一种新的工作机制，在首次调用时，JVM 需要为其构建 [CallSite](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/CallSite.html) 实例。这意味着，如果 Java 应用启动过程引入了很多 Lambda 语句，会导致启动过程变慢。其实现特点决定了 JVM 对它的优化可能与传统方式存在差异。

## JVM 优化 Java 代码时都做了什么？

【典型回答】+【考点分析】+【知识扩展】

略

## 谈谈 MySQL 支持的事务隔离级别，以及悲观锁和乐观锁的原理和应用场景？

【典型回答】+【考点分析】+【知识扩展】

以最常见的 MySQL InnoDB 引擎为例，它是基于 MVCC（Multi-Versioning Concurrency Control）和锁的复合实现，按照隔离程度从低到高，MySQL 事务隔离级别分为四个不同层次：

- 读未提交（Read uncommitted），就是一个事务能够看到其他事务尚未提交的修改，这是最低的隔离水平，允许脏读出现。
- 读已提交（Read committed），事务能够看到的数据都是其他事务已经提交的修改，也就是保证不会看到任何中间性状态，当然脏读也不会出现。读已提交仍然是比较低级别的隔离，并不保证再次读取时能够获取同样的数据，也就是允许其他事务并发修改数据，允许不可重复读和幻象读（Phantom Read）出现。
- 可重复读（Repeatable reads），保证同一个事务中多次读取的数据是一致的，这是 MySQL InnoDB 引擎的默认隔离级别，但是和一些其他数据库实现不同的是，可以简单认为 MySQL 在可重复读级别不会出现幻象读。
- 串行化（Serializable），并发事务之间是串行化的，通常意味着读取需要获取共享读锁，更新需要获取排他写锁，如果 SQL 使用 WHERE 语句，还会获取区间锁（MySQL 以 GAP 锁形式实现，可重复读级别中默认也会使用），这是最高的隔离级别。

悲观锁和乐观锁：

悲观锁 - 悲观锁一般就是利用类似 `SELECT … FOR UPDATE` 这样的语句，对数据加锁，避免其他事务意外修改数据。

乐观锁 - 乐观锁则与 Java 并发包中的 AtomicFieldUpdater 类似，也是利用 CAS 机制，并不会对数据加锁，而是通过对比数据的时间戳或者版本号，来实现乐观锁需要的版本判断。

## 谈谈 Spring Bean 的生命周期和作用域？

【典型回答】+【考点分析】+【知识扩展】

### Spring 创建 Bean

- 实例化 Bean 对象。
- 设置 Bean 属性。
- 如果我们通过各种 Aware 接口声明了依赖关系，则会注入 Bean 对容器基础设施层面的依赖。具体包括 BeanNameAware、BeanFactoryAware 和 ApplicationContextAware，分别会注入 Bean ID、Bean Factory 或者 ApplicationContext。
- 调用 BeanPostProcessor 的前置初始化方法 postProcessBeforeInitialization。
- 如果实现了 InitializingBean 接口，则会调用 afterPropertiesSet 方法。
- 调用 Bean 自身定义的 init 方法。
- 调用 BeanPostProcessor 的后置初始化方法 postProcessAfterInitialization。
- 创建过程完毕。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240708158.png)

### Spring 销毁 Bean

Spring Bean 的销毁过程会依次调用 DisposableBean 的 destroy 方法和 Bean 自身定制的 destroy 方法。

Spring Bean 有五个作用域，其中最基础的有下面两种：

- Singleton，这是 Spring 的默认作用域，也就是为每个 IOC 容器创建唯一的一个 Bean 实例。
- Prototype，针对每个 getBean 请求，容器都会单独创建一个 Bean 实例。

从 Bean 的特点来看，Prototype 适合有状态的 Bean，而 Singleton 则更适合无状态的情况。另外，使用 Prototype 作用域需要经过仔细思考，毕竟频繁创建和销毁 Bean 是有明显开销的。

如果是 Web 容器，则支持另外三种作用域：

- Request，为每个 HTTP 请求创建单独的 Bean 实例。
- Session，很显然 Bean 实例的作用域是 Session 范围。
  - GlobalSession，用于 Portlet 容器，因为每个 Portlet 有单独的 Session，GlobalSession 提供一个全局性的 HTTP Session。·

## 对比 Java 标准 NIO 类库，你知道 Netty 是如何实现更高性能的吗？

【典型回答】+【考点分析】+【知识扩展】

多路复用

零拷贝

从 API 能力范围来看，Netty 完全是 Java NIO 框架的一个大大的超集

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240708363.png)

Netty 官方提供的 Server 部分，完整用例请点击 [链接](http://netty.io/4.1/xref/io/netty/example/echo/package-summary.html)。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240708879.png)

- [ServerBootstrap](https://github.com/netty/netty/blob/2c13f71c733c5778cd359c9148f50e63d1878f7f/transport/src/main/java/io/netty/bootstrap/ServerBootstrap.java)，服务器端程序的入口，这是 Netty 为简化网络程序配置和关闭等生命周期管理，所引入的 Bootstrapping 机制。我们通常要做的创建 Channel、绑定端口、注册 Handler 等，都可以通过这个统一的入口，以 **Fluent** API 等形式完成，相对简化了 API 使用。与之相对应， [Bootstrap](https://github.com/netty/netty/blob/2c13f71c733c5778cd359c9148f50e63d1878f7f/transport/src/main/java/io/netty/bootstrap/Bootstrap.java) 则是 Client 端的通常入口。
- [Channel](https://github.com/netty/netty/blob/2c13f71c733c5778cd359c9148f50e63d1878f7f/transport/src/main/java/io/netty/channel/Channel.java)，作为一个基于 NIO 的扩展框架，Channel 和 Selector 等概念仍然是 Netty 的基础组件，但是针对应用开发具体需求，提供了相对易用的抽象。
- [EventLoop](https://github.com/netty/netty/blob/2c13f71c733c5778cd359c9148f50e63d1878f7f/transport/src/main/java/io/netty/channel/EventLoop.java)，这是 Netty 处理事件的核心机制。例子中使用了 EventLoopGroup。我们在 NIO 中通常要做的几件事情，如注册感兴趣的事件、调度相应的 Handler 等，都是 EventLoop 负责。
- [ChannelFuture](https://github.com/netty/netty/blob/2c13f71c733c5778cd359c9148f50e63d1878f7f/transport/src/main/java/io/netty/channel/ChannelFuture.java)，这是 Netty 实现异步 IO 的基础之一，保证了同一个 Channel 操作的调用顺序。Netty 扩展了 Java 标准的 Future，提供了针对自己场景的特有 [Future](https://github.com/netty/netty/blob/eb7f751ba519cbcab47d640cd18757f09d077b55/common/src/main/java/io/netty/util/concurrent/Future.java) 定义。
- ChannelHandler，这是应用开发者**放置业务逻辑的主要地方**，也是我上面提到的“Separation Of Concerns”原则的体现。
- [ChannelPipeline](https://github.com/netty/netty/blob/2c13f71c733c5778cd359c9148f50e63d1878f7f/transport/src/main/java/io/netty/channel/ChannelPipeline.java)，它是 ChannelHandler 链条的容器，每个 Channel 在创建后，自动被分配一个 ChannelPipeline。在上面的示例中，我们通过 ServerBootstrap 注册了 ChannelInitializer，并且实现了 initChannel 方法，而在该方法中则承担了向 ChannelPipleline 安装其他 Handler 的任务。

参考下面的简化示意图，忽略 Inbound/OutBound Handler 的细节，理解这几个基本单元之间的操作流程和对应关系。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240709828.png)

对比 Java 标准 NIO 的代码，Netty 提供的相对高层次的封装，减少了对 Selector 等细节的操纵，而 EventLoop、Pipeline 等机制则简化了编程模型，开发者不用担心并发等问题，在一定程度上简化了应用代码的开发。

## 谈谈常用的分布式 ID 的设计方案？Snowflake 是否受冬令时切换影响？

【典型回答】+【考点分析】+【知识扩展】

分布式 ID 基本要求：

- 全局唯一，区别于单点系统的唯一，全局是要求分布式系统内唯一。
- 有序性，通常都需要保证生成的 ID 是有序递增的。例如，在数据库存储等场景中，有序 ID 便于确定数据位置，往往更加高效。

业界方案：

UUID

各种数据库自增序列

雪花算法 - 如 Twitter 早期开源的 [Snowflake](https://github.com/twitter/snowflake) 的实现，其结构定义可以参考下图：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202409240710538.png)

## 周末福利 一份 Java 工程师必读书单

- 《Java 编程思想》

- 《Java 核心技术》

- 《Effective Java》

- 《Head First 设计模式》

- 《Java 并发编程实战》

- 《深入理解 Java 虚拟机》

- 《Java 性能优化权威指南》

- 《Spring 实战》

- 《Netty 实战》

- 《大型分布式网站架构设计与实践》

- 《深入分布式缓存：从原理到实践》

## 周末福利 谈谈我对 Java 学习和面试的看法

略

## 结束语 技术没有终点

## 参考资料

- [极客时间教程 - Java 核心技术面试精讲](https://time.geekbang.org/column/intro/82) - 极客时间教程——从面试官视角梳理如何解答常见 Java 面试问题
