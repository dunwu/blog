---
title: 《极客时间教程 - 深入浅出 Java 虚拟机》笔记
date: 2024-08-06 08:00:04
order: 02
categories:
  - 笔记
  - Java
tags:
  - Java
  - JVM
permalink: /pages/ecf1efce/
---

# 《极客时间教程 - 深入浅出 Java 虚拟机》笔记

## 开篇词：JVM，一块难啃的骨头

略

## 一探究竟：为什么需要 JVM？它处在什么位置？

**JVM** - Java Virtual Machine 的缩写，即 Java 虚拟机。JVM 是运行 Java 字节码的虚拟机。JVM 不理解 Java 源代码，这就是为什么要将 `*.java` 文件编译为 JVM 可理解的 `*.class` 文件（字节码）。Java 有一句著名的口号：“Write Once, Run Anywhere（一次编写，随处运行）”，JVM 正是其核心所在。实际上，JVM 针对不同的系统（Windows、Linux、MacOS）有不同的实现，目的在于用相同的字节码执行同样的结果。

**JRE** - Java Runtime Environment 的缩写，即 Java 运行时环境。它是运行已编译 Java 程序所需的一切的软件包，主要包括 JVM、Java 类库（Class Library）、Java 命令和其他基础结构。但是，它不能用于创建新程序。

**JDK** - Java Development Kit 的缩写，即 Java SDK。它不仅包含 JRE 的所有功能，还包含编译器 (javac) 和工具（如 javadoc 和 jdb）。它能够创建和编译程序。

> 总结来说，JDK、JRE、JVM 三者的关系是：JDK > JRE > JVM
>
> **JDK = JRE + 开发/调试工具**
>
> **JRE = JVM + Java 类库 + Java 运行库**
>
> **JVM = 类加载系统 + 运行时内存区域 + 执行引擎**

![enter image description here](https://raw.githubusercontent.com/dunwu/images/master/snap/202504030804019.png)

> 摘自 [stackoverflow 高票问题 - What is the difference between JDK and JRE?](https://stackoverflow.com/questions/1906445/what-is-the-difference-between-jdk-and-jre)

## 大厂面试题：你不得不掌握的 JVM 内存管理

![img](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/%e6%b7%b1%e5%85%a5%e6%b5%85%e5%87%ba%20Java%20%e8%99%9a%e6%8b%9f%e6%9c%ba-%e5%ae%8c/assets/Cgq2xl4VrjWAPqAuAARqnz6cigo666.png)

![img](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/%e6%b7%b1%e5%85%a5%e6%b5%85%e5%87%ba%20Java%20%e8%99%9a%e6%8b%9f%e6%9c%ba-%e5%ae%8c/assets/Cgq2xl4VrjaANruFAAQKxZvgfSs652.png)

![img](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/%e6%b7%b1%e5%85%a5%e6%b5%85%e5%87%ba%20Java%20%e8%99%9a%e6%8b%9f%e6%9c%ba-%e5%ae%8c/assets/Cgq2xl4VrjaAIlgaAAJKReuKXII670.png)

## 大厂面试题：从覆盖 JDK 的类开始掌握类的加载机制

Java 类的完整生命周期包括以下几个阶段：

- **加载（Loading）** - 将 _.java 文件转为 _.class
- **链接（Linking）**
  - **验证（Verification）** - 确保 Class 文件的字节流中包含的信息符合当前虚拟机的要求
  - **准备（Preparation）** - 为 static 变量在方法区分配内存并初始化为默认值
  - **解析（Resolution）** - 将常量池的符号引用替换为直接引用的过程
- **初始化（Initialization）** - 为类的静态变量赋予正确的初始值，JVM 负责对类进行初始化，主要对类变量进行初始化

![](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/%e6%b7%b1%e5%85%a5%e6%b5%85%e5%87%ba%20Java%20%e8%99%9a%e6%8b%9f%e6%9c%ba-%e5%ae%8c/assets/CgqCHl9ZjveAemjoAAB4J1dCVDo17.jpeg)

类加载器

- Bootstrap ClassLoader - 负责加载 `<JAVA_HOME>\lib` 或被 `-Xbootclasspath` 指定的路径

- ExtClassLoader - 负责加载 `<JAVA_HOME>\lib\ext` 或被`java.ext.dir` 指定的路径

- AppClassLoader - 负载加载 `classpath` 路径
- 自定义类加载器 - 继承自 `java.lang.ClassLoader`

**双亲委派机制** - 除了顶层的启动类加载器以外，其余的类加载器，在加载之前，都会委派给它的父加载器进行加载。

![](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/%e6%b7%b1%e5%85%a5%e6%b5%85%e5%87%ba%20Java%20%e8%99%9a%e6%8b%9f%e6%9c%ba-%e5%ae%8c/assets/Cgq2xl4cQNeAZ4FuAABzsqSozok762.png)

## 动手实践：从栈帧看字节码是如何在 JVM 中进行流转的

![](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/%e6%b7%b1%e5%85%a5%e6%b5%85%e5%87%ba%20Java%20%e8%99%9a%e6%8b%9f%e6%9c%ba-%e5%ae%8c/assets/CgpOIF4ezuOAK_6bAACFY5oeX-Y174.jpg)

![](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/%e6%b7%b1%e5%85%a5%e6%b5%85%e5%87%ba%20Java%20%e8%99%9a%e6%8b%9f%e6%9c%ba-%e5%ae%8c/assets/CgpOIF4ezeKAHVCXAABv7rzSgXE896.jpg)

- javap - javap 是 JDK 自带的反解析工具。它的作用是将 .class 字节码文件解析成可读的文件格式。

- jclasslib - jclasslib 是一个图形化的工具，能够更加直观的查看字节码中的内容。

## 大厂面试题：得心应手应对 OOM 的疑难杂症

![](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/%e6%b7%b1%e5%85%a5%e6%b5%85%e5%87%ba%20Java%20%e8%99%9a%e6%8b%9f%e6%9c%ba-%e5%ae%8c/assets/Cgq2xl4hefWAWKFZAAMwndGjScg437.png)

对象生命周期判断

- 引用计数法
- 可达性分析法 - GC Roots

引用类型：

- 强引用
- 软引用
- 弱引用
- 虚引用

## 深入剖析：垃圾回收你真的了解吗？（上）

垃圾回收算法

- 标记-复制 - 效率最高，但会浪费大量内存空间
- 标记-清除 - 效率一般，会产生大量内存碎片
- 标记-整理 - 效率最差，但是不会浪费空间，也消除了内存碎片

GC 分代收集：年轻代 GC 使用标记-复制算法；老年代 GC 使用标记-清除算法、标记-整理算法。

常见 GC 收集器：

- 年轻代：Serial、ParNew、Parallel
- 老年代：Serial Old、Parallel Old、CMS
- 元空间：G1、ZGC

![](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/%e6%b7%b1%e5%85%a5%e6%b5%85%e5%87%ba%20Java%20%e8%99%9a%e6%8b%9f%e6%9c%ba-%e5%ae%8c/assets/Cgq2xl4lQuiAHmINAACWihcFScA929.jpg)

GC 收集器配置参数：

- **-XX:+UseSerialGC** 年轻代和老年代都用串行收集器
- **-XX:+UseParNewGC** 年轻代使用 ParNew，老年代使用 Serial Old
- **-XX:+UseParallelGC** 年轻代使用 ParallerGC，老年代使用 Serial Old
- **-XX:+UseParallelOldGC** 新生代和老年代都使用并行收集器
- **-XX:+UseConcMarkSweepGC**，表示年轻代使用 ParNew，老年代的用 CMS
- **-XX:+UseG1GC** 使用 G1 垃圾回收器
- **-XX:+UseZGC** 使用 ZGC 垃圾回收器

## 深入剖析：垃圾回收你真的了解吗？（下）

- Minor GC：发生在年轻代的 GC。
- Major GC：发生在老年代的 GC。
- Full GC：全堆垃圾回收。比如 Metaspace 区引起年轻代和老年代的回收。

CMS 垃圾回收器分为四个阶段：

1. 初始标记
2. 并发标记
3. 重新标记
4. 并发清理

CMS 中都会有哪些停顿（STW）：

1. 初始标记，这部分的停顿时间较短；
2. Minor GC（可选），在预处理阶段对年轻代的回收，停顿由年轻代决定；
3. 重新标记，由于 preclaen 阶段的介入，这部分停顿也较短；
4. Serial-Old 收集老年代的停顿，主要发生在预留空间不足的情况下，时间会持续很长；
5. Full GC，永久代空间耗尽时的操作，由于会有整理阶段，持续时间较长。

## 大厂面试题：有了 G1 还需要其他垃圾回收器吗？

G1 最重要的概念，其实就是 Region。它采用分而治之，部分收集的思想，尽力达到我们给它设定的停顿目标。

## 案例实战：亿级流量高并发下如何进行估算和调优

GC 指标：

- 系统容量（Capacity）
- 延迟（Latency）
- 吞吐量（Throughput）

**选择垃圾回收器**

- 如果你的堆大小不是很大（比如 100MB），选择串行收集器一般是效率最高的。参数：-XX:+UseSerialGC。
- 如果你的应用运行在单核的机器上，或者你的虚拟机核数只有 1C，选择串行收集器依然是合适的，这时候启用一些并行收集器没有任何收益。参数：-XX:+UseSerialGC。
- 如果你的应用是“吞吐量”优先的，并且对较长时间的停顿没有什么特别的要求。选择并行收集器是比较好的。参数：-XX:+UseParallelGC。
- 如果你的应用对响应时间要求较高，想要较少的停顿。甚至 1 秒的停顿都会引起大量的请求失败，那么选择 G1、ZGC、CMS 都是合理的。虽然这些收集器的 GC 停顿通常都比较短，但它需要一些额外的资源去处理这些工作，通常吞吐量会低一些。参数：-XX:+UseConcMarkSweepGC、-XX:+UseG1GC、-XX:+UseZGC 等。

## 第 09 讲：案例实战：面对突如其来的 GC 问题如何下手解决

## 第 10 讲：动手实践：自己模拟 JVM 内存溢出场景

## 第 11 讲：动手实践：遇到问题不要慌，轻松搞定内存泄漏

jinfo、jstat、jstack、jhsdb（jmap）等是经常被使用的一些工具，尤其是 jmap，在分析处理内存泄漏问题的时候，是必须的。

## 工具进阶：如何利用 MAT 找到问题发生的根本原因

MAT 是用来分析内存快照的。

## 动手实践：让面试官刮目相看的堆外内存排查

## 预警与解决：深入浅出 GC 监控与调优

## 案例分析：一个高死亡率的报表系统的优化之路

## 案例分析：分库分表后，我的应用崩溃了

## 动手实践：从字节码看方法调用的底层实现

## 大厂面试题：不要搞混 JMM 与 JVM

## 动手实践：从字节码看并发编程的底层实现

## 动手实践：不为人熟知的字节码指令

## 深入剖析：如何使用 Java Agent 技术对字节码进行修改

## 23 动手实践：JIT 参数配置如何影响程序运行？

## 案例分析：大型项目如何进行性能瓶颈调优？

## 未来：JVM 的历史与展望

## 福利：常见 JVM 面试题补充