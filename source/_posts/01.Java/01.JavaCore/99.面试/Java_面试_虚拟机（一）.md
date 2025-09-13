---
title: Java 虚拟机面试一
date: 2024-07-03 07:44:02
categories:
  - Java
  - JavaCore
  - 面试
tags:
  - Java
  - JavaCore
  - 面试
  - JVM
permalink: /pages/b2f6beb8/
---

# Java 虚拟机面试一

## JVM 简介

### 【中等】JVM 由哪些部分组成？

**类加载→内存分配→执行引擎运行→GC 回收内存**，通过 JNI 与外部交互。

JVM（Java 虚拟机）主要由以下核心部分组成：

- **类加载子系统**：负责加载、验证、准备、解析和初始化类文件（.class）。
- **运行时数据区**：
  - **方法区**：存储类元数据、常量池等。
  - **堆**：存放对象实例（主 GC 区域）。
  - **虚拟机栈**：存储方法调用的栈帧（局部变量、操作数栈等）。
  - **本地方法栈**：为 Native 方法服务。
  - **程序计数器**：记录当前线程执行的字节码位置。
- **执行引擎**：解释或编译字节码为机器码执行（含 JIT 编译器）。
  - **解释器（Interpreter）**：逐行解释执行字节码（启动快，执行慢）。
  - **即时编译器（JIT Compiler）**：将热点代码（频繁执行的代码）编译为本地机器码（如 HotSpot 的 C1、C2 编译器）。
  - **垃圾回收器（GC）**：自动回收堆中无用的对象（如 Serial、Parallel、G1、ZGC 等算法）。
- **本地方法接口（JNI）**：调用 C/C++实现的 Native 方法。
- **本地方法库（Native Libraries）**：由其他语言（如 C/C++）编写的库，供 JNI 调用（如文件操作、网络通信等底层功能）。

![](https://raw.githubusercontent.com/dunwu/images/master/cs/java/javacore/jvm/jvm-hotspot-architecture.png)

### 【中等】Java 是如何实现跨平台的？

Java 实现跨平台的本质是：**源码 → 统一字节码 → JVM 按需转换为目标平台机器码**，通过分层抽象实现跨平台。

Java **【一次编写，到处执行（Write Once, Run Anywhere）】** 的要点：

- **JVM（Java 虚拟机）—— 统一运行环境**
  - 不同操作系统（Windows/Linux/macOS）安装对应的 JVM，**屏蔽底层硬件和系统差异**。
  - JVM 负责加载、验证并执行字节码，确保相同字节码在不同平台表现一致。
- **字节码（Bytecode）—— 平台无关的中间代码**
  - Java 代码编译成**平台无关的字节码（.class 文件）**，而非直接生成机器码。
  - 由 JVM 解释或 JIT 编译为当前平台的机器指令。
- **标准化的 Java API**：提供统一的 API（如 `java.io`、`java.net`），底层通过 JVM 适配不同操作系统的具体实现。
- **严格的规范与兼容性**：JVM 规范（如字节码格式、内存管理）和 Java 语言规范由 Oracle 统一制定，确保各厂商实现的 JVM 行为一致。

**例外情况（需注意）**

- **JNI（本地方法调用）**：依赖系统原生库时，需为不同平台编译对应的动态库（如 `.dll`、`.so`）。
- **平台相关细节**：如文件路径分隔符、字符编码、GUI 渲染等可能需要适配。

### 【中等】说说 Java 的执行流程？

Java 程序的执行流程经历了从编译到字节码的生成，再到类加载和 JIT 编译的过程，最终在 JVM 中执行。并且在程序运行过程中，JVM 负责内存管理、垃圾回收和线程调度等工作。

主要流程如下：

1. **编写 Java 源代码**：编写 `.java` 文件。
2. **编译**：Java 编译器（javac） 将 `.java` 文件编译为 `.class` 文件（字节码）。
3. **类加载**：JVM 通过类加载子系统加载 `.class` 文件到内存。
   1. **加载**：采用双亲委派机制，分层级加载字节码。
   2. **链接**
      1. **验证**：检查字节码合法性（如魔数 `0xCAFEBABE`）。
      2. **准备**：为静态变量分配内存并赋默认值（如 `static int a` 初始化为 `0`）。
      3. **解析**：将符号引用（如类名、方法名）转为直接引用（内存地址）。
   3. **初始化**：执行静态代码块（`static{}`）和静态变量赋值（如 `static int a = 1;`）。
4. **存储运行时数据区**：加载后的类信息存储到内存区域。
   - **方法区**：存储类结构（如 `HelloWorld` 的类名、方法定义、常量池）。
   - **堆**：存放对象实例（如 `String` 对象）。
   - **虚拟机栈**：线程私有，存储 `main()` 方法的栈帧（局部变量、操作数栈等）。
   - **程序计数器**：记录当前线程执行的字节码指令地址。
5. **执行阶段**
   - **解释执行**：逐行解释字节码指令（如 `invokestatic` 调用 `System.out.println`）。启动快，执行效率低。
   - **本地方法调用（JNI）**：若调用 `native` 方法（如 `Object.clone()`），通过 **JNI** 执行本地库（C/C++）代码。
   - **JIT 编译优化（可选）**：将热点代码（频繁执行的方法）编译为本地机器码。相关优化技术：**方法内联**、**逃逸分析**等。
6. **垃圾回收**：JVM 管理内存，并回收不再使用的对象。
7. **程序结束**：main 方法结束，退出程序。

### 【中等】什么是 JIT?

**JIT（Just-In-Time Compilation，即时编译）**在运行时将**热点代码**（频繁执行的字节码）动态编译为**本地机器码**，提升执行效率。

- **JIT 是 Java 高性能的关键**：通过运行时编译热点代码，平衡解释执行的灵活性和原生代码的速度。
- **核心优化**：方法内联、逃逸分析、分层编译。
- **调优方向**：根据应用特点调整编译阈值、代码缓存大小。

**与解释器的区别**：

- **解释器**：逐行解释执行字节码，启动快但运行慢。
- **JIT**：编译后直接执行机器码，运行快但有编译开销。

**JIT 作用**

- **性能优化**：对重复执行的代码（如循环、高频方法）编译为机器码，避免重复解释。
- **自适应优化**：根据运行时数据（如方法调用次数、分支预测）动态优化代码。

**JIT 工作流程**

- **热点检测**：通过计数器统计方法调用次数或循环执行次数（如 `-XX:CompileThreshold` 默认阈值 10000）。
- **编译优化**：将热点字节码编译为机器码，存入**代码缓存（Code Cache）**。
- **替换执行**：后续调用直接执行编译后的机器码。

**JIT 优化技术**

- **方法内联（Inlining）**：将小方法调用替换为方法体代码（如 `-XX:+InlineSmallMethods`）。
- **逃逸分析（Escape Analysis）**：判断对象作用域，优化为栈分配或标量替换。
- **JIT 分层编译（Tiered Compilation）**
  - **混合模式**：结合解释器、C1（Client Compiler）和 C2（Server Compiler）：
    - **C1**：快速编译，优化启动速度（如 `-client` 模式）。
    - **C2**：深度优化，提升峰值性能（如 `-server` 模式）。
  - **JDK 8+ 默认启用**：`-XX:+TieredCompilation`。
- **循环展开（Loop Unrolling）**：减少循环控制开销。
- **去虚拟化（Devirtualization）**：将虚方法调用转为直接调用。

**JIT 关键参数**

| **参数**                     | **作用**                       |
| ---------------------------- | ------------------------------ |
| `-XX:+UseJIT`                | 启用 JIT（默认开启）           |
| `-XX:CompileThreshold=10000` | 触发 JIT 编译的方法调用阈值    |
| `-XX:+PrintCompilation`      | 打印 JIT 编译日志              |
| `-XX:ReservedCodeCacheSize`  | 设置代码缓存大小（默认 240MB） |
| `-XX:+TieredCompilation`     | 启用分层编译（JDK 8+ 默认）    |

**JIT 特点**

- **优点**：
  - 显著提升热点代码性能（接近原生代码速度）。
  - 自适应优化更灵活。
- **缺点**：
  - 编译开销导致**启动变慢**（如短生命周期应用不适用）。
  - 代码缓存占用内存。

**JIT 适用场景**

- **长期运行应用**：如 Web 服务、大数据处理（JIT 优势明显）。
- **短时任务**：如命令行工具，解释器可能更高效。

### 【困难】什么是逃逸分析？

**逃逸分析** 是 JVM 在 **即时编译（JIT）阶段** 进行的一种优化技术，用于分析对象的动态作用域，判断对象是否会“逃逸”出当前方法或线程，从而决定是否可以进行栈上分配、锁消除或标量替换等优化。

逃逸分析通过判断对象作用域，实现**栈分配、锁消除、标量替换**等优化，是 JVM 提升性能的关键技术之一，尤其在高频代码中效果显著。

- **逃逸对象（Escape）**
- **方法逃逸**：对象被其他方法引用（如作为参数传递或返回值）。
  - **线程逃逸**：对象被其他线程访问（如赋值给静态变量或共享实例变量）。
- **非逃逸对象（Non-Escaping）**：对象仅在当前方法内创建和使用，未被外部引用。

**逃逸分析的优化场景**

- **栈上分配（Stack Allocation）**
  - 对于**非逃逸对象**，JVM 直接在栈帧中分配内存（而非堆），对象随方法调用结束自动销毁，减少 GC 压力。
  - _示例_：方法内部的临时对象。
- **标量替换（Scalar Replacement）**
  - 将非逃逸对象的字段拆解为局部变量（标量），避免创建完整对象。
  - _示例_：`Point` 对象的 `x`、`y` 字段被替换为两个局部变量。
- **锁消除（Lock Elision）**
  - 若对象未线程逃逸且同步块无竞争，JVM 会移除不必要的锁（如 `synchronized`）。
  - _示例_：局部 `StringBuffer` 的同步操作会被优化掉。

**逃逸分析的触发条件**

- 需 JVM 启用逃逸分析（默认开启）：
  ```bash
  -XX:+DoEscapeAnalysis  # 开启（默认）
  -XX:-DoEscapeAnalysis  # 关闭
  ```
- 配合 JIT 编译器（如 C2）在热点代码中应用。

**性能影响**

- **优点**：减少堆分配、降低 GC 开销、提升局部性。
- **限制**：分析本身有开销，复杂对象可能无法优化。

**示例代码**

```java
public void example() {
    // 非逃逸对象（可能被栈分配或标量替换）
    Point p = new Point(1, 2);
    System.out.println(p.x + p.y);
}

static class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
}
```

### 【困难】什么是 AOT？

::: info 什么是 AOT？
:::

Java 9 引入 **AOT（Ahead of Time Compilation，提前编译）** 。AOT 模式下，**程序运行前直接编译为机器码**（类似 C/C++/Rust）。

::: info AOT 和 JIT 有什么区别？
:::

**AOT vs. JIT**

| **维度**     | **AOT**          | **JIT**            |
| :----------- | :--------------- | :----------------- |
| **启动速度** | ⭐⭐⭐（极快）   | ⭐（依赖预热）     |
| **内存占用** | ⭐⭐⭐（低）     | ⭐⭐（较高）       |
| **峰值性能** | ⭐⭐（静态优化） | ⭐⭐⭐（动态优化） |
| **动态支持** | ❌（受限）       | ✅（完整支持）     |
| **适合场景** | 云原生/微服务    | 高吞吐/动态框架    |

提到 AOT 就不得不提 [GraalVM](https://www.graalvm.org/) 了！GraalVM 是一种高性能的 JDK（完整的 JDK 发行版本），它可以运行 Java 和其他 JVM 语言，以及 JavaScript、Python 等非 JVM 语言。 GraalVM 不仅能提供 AOT 编译，还能提供 JIT 编译。感兴趣的同学，可以去看看 [GraalVM 的官方文档](https://www.graalvm.org/latest/docs/)。如果觉得官方文档看着比较难理解的话，也可以找一些文章来看看，比如：

::: tip 扩展

- [基于静态编译构建微服务应用](https://mp.weixin.qq.com/s/4haTyXUmh8m-dBQaEzwDJw)
- [走向 Native 化：Spring&Dubbo AOT 技术示例与原理讲解](https://cn.dubbo.apache.org/zh-cn/blog/2023/06/28/走向-native-化 springdubbo-aot-技术示例与原理讲解/)

:::

::: info 既然 AOT 这么多优点，那为什么不全部使用这种编译方式呢？
:::

**AOT 的局限性在于不支持动态特性**：

- 不支持反射、动态代理、运行时类加载、JNI 等
- 影响框架兼容性（如 Spring、CGLIB 依赖 ASM 技术生成动态字节码）

**AOT 的适用场景**：

- **适合**：启动敏感的微服务、云原生应用
- **不适合**：需动态特性的复杂框架或高频优化的长运行任务

## JVM 内存管理

### 【困难】JVM 的内存区域是如何划分的？

JDK7 和 JDK8 的 JVM 的内存区域划分有所不同，如下图所示：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202505070632861.png)

**线程私有区域**

- **程序计数器**
  - 记录当前线程执行的字节码指令地址（Native 方法时为`undefined`）。
  - **JVM 中唯一无 OOM 的区域**。
- **虚拟机栈**
  - 存储方法调用的**栈帧**（局部变量表、操作数栈、动态链接、返回地址）。
    - **局部变量表**：用于存放方法参数和方法内部定义的局部变量。
    - **操作数栈**：主要作为方法调用的中转站使用，用于存放方法执行过程中产生的中间计算结果。另外，计算过程中产生的临时变量也会放在操作数栈中。
    - **动态连接** - 用于一个方法调用其他方法的场景。Class 文件的常量池中有大量的符号引用，字节码中的方法调用指令就以常量池中指向方法的符号引用为参数。这些符号引用一部分会在类加载阶段或第一次使用的时候转化为直接引用，这种转化称为**静态解析**；另一部分将在每一次的运行期间转化为直接应用，这部分称为**动态连接**。
    - **方法返回地址** - 用于返回方法被调用的位置，恢复上层方法的局部变量和操作数栈。Java 方法有两种返回方式，一种是 `return` 语句正常返回，一种是抛出异常。无论采用何种退出方式，都会导致栈帧被弹出。也就是说，栈帧随着方法调用而创建，随着方法结束而销毁。无论方法正常完成还是异常完成都算作方法结束。
  - 异常：`StackOverflowError`（栈深度超限）、`OOM`（扩展失败）。
  - 可以通过 `-Xss` 指定占内存大小
- **本地方法栈**：与虚拟机栈的作用非常相似，二者区别仅在于：**虚拟机栈为 Java 方法服务；本地方法栈为 Native 方法服务**。

**线程共享区域**

- **堆（Heap）**
  - 存放**所有对象实例和数组**，是 GC 主战场。
  - 分区：新生代（Eden+Survivor）、老年代。
  - 异常：OOM: Java heap space（对象过多或内存泄漏）。
- **字符串常量池**：用于存储字符串字面量，位于堆内存中的一块特殊区域。通过 String 类的 intern() 方法可以将字符串键入到字符串常量池。
- **方法区（JDK 8+：元空间）**
  - 存储类元信息、运行时常量池、静态变量（JDK 7 后移至堆）。
  - **JDK 8 用元空间（本地内存）替代永久代**，默认无上限。
  - 异常：`OOM`（加载过多类）。
- **运行时常量池**：Class 文件中存储编译时生成的常量信息，并在类加载时进入 JVM 方法区。

**直接内存（非 JVM 规范）**

直接内存是 JVM 堆外的本地内存。具有读写快、无 GC 开销，需手动管理的特性。

- 分配：ByteBuffer.allocateDirect()
- 清理：DirectBuffer.cleaner().clean()
- 场景：高频 I/O（如 NIO、Netty、MMAP）
- 异常：Direct buffer memory
- JVM 参数：可以通过 `-XX:MaxDirectMemorySize` 设置直接内存大小，如果无设置，默认大小等于 `-Xmx` 值。

### 【困难】JVM 产生 OOM 有哪几种情况？

JVM 发生 **OutOfMemoryError（OOM）** 的原因多种多样，主要与内存区域划分和对象分配机制相关。以下是所有可能的 OOM 类型及其触发条件、典型案例和排查方法：

#### Java heap space

- **触发条件**：**堆内存不足**，无法分配新对象。
- **常见原因**：

  - 内存泄漏（如静态容器持续增长、未关闭的资源）。
  - 堆内存设置过小（`-Xmx` 值不合理）。
  - 大对象（如一次性加载超大文件到内存）。

- **案例代码**：

  ```java
  List<byte[]> list = new ArrayList<>();
  while (true) {
      list.add(new byte[1024 * 1024]); // 持续分配 1MB 数组
  }
  ```

- **解决方向**：
  - 检查 `-Xmx` 和 `-Xms` 参数是否合理。
  - 使用 `jmap -histo:live <pid>` 或 **MAT（Memory Analyzer Tool）** 分析堆转储（`-XX:+HeapDumpOnOutOfMemoryError`）。

#### Metaspace（JDK 8 及以后）

- **触发条件**：**元空间（Metaspace）不足**，无法加载新的类信息。
- **常见原因**：
  - 动态生成大量类（如反射、CGLIB、动态代理）。
  - 未设置元空间上限（默认依赖本地内存，可能耗尽）。
- **案例代码**：
  ```java
  for (int i = 0; i < 1000000; i++) {
      Enhancer enhancer = new Enhancer(); // CGLIB 动态生成类
      enhancer.setSuperclass(OOM.class);
      enhancer.create();
  }
  ```
- **解决方向**：

  - 调整元空间大小：`-XX:MetaspaceSize=256M -XX:MaxMetaspaceSize=256M`。
  - 检查类加载器泄漏（如热部署未清理旧类）。

#### PermGen space（JDK 7 及以前）

- **类似 Metaspace**，但发生在永久代（PermGen），JDK 8 后被元空间取代。
- **常见原因**：大量字符串常量或类加载未卸载。

#### Direct buffer memory

- **触发条件**：**直接内存（堆外内存）耗尽**。
- **常见原因**：
  - NIO 的 `ByteBuffer.allocateDirect()` 未释放。
  - 直接内存上限过小（`-XX:MaxDirectMemorySize`）。
- **案例代码**：
  ```java
  List<ByteBuffer> buffers = new ArrayList<>();
  while (true) {
      buffers.add(ByteBuffer.allocateDirect(1024 * 1024)); // 1MB 直接内存
  }
  ```
- **解决方向**：

  - 显式调用 `((DirectBuffer) buffer).cleaner().clean()` 或复用缓冲区。
  - 增加 `-XX:MaxDirectMemorySize=1G`。

#### Unable to create new native thread

- **触发条件**：**线程数超过系统限制**（非堆内存问题）。

- **常见原因**：

  - 线程池配置不合理（如无界线程池）。
  - 系统级限制（`ulimit -u` 查看用户最大线程数）。

- **案例代码**：

  ```java
  while (true) {
      new Thread(() -> {
          try { Thread.sleep(100000); } catch (Exception e) {}
      }).start();
  }
  ```

- **解决方向**：

  - 改用线程池（如 `ThreadPoolExecutor`）。
  - 调整系统限制（Linux 下修改 `/etc/security/limits.conf`）。

#### GC overhead limit exceeded

- **触发条件**：GC 耗时超过 98% 且回收内存不足 2%（JVM 自我保护）。
- **本质原因**：堆内存几乎耗尽，GC 无效循环。
- **解决方向**：
  - 同 `heap space` 排查内存泄漏。
  - 关闭保护机制（不推荐）：`-XX:-UseGCOverheadLimit`。

#### CodeCache is full（JIT 编译代码缓存满）

- **触发条件**：JIT 编译的本地代码超出缓存区（`-XX:ReservedCodeCacheSize`）。
- **常见原因**：动态生成大量方法（如频繁调用反射）。
- **解决方向**：
  - 增加缓存：`-XX:ReservedCodeCacheSize=256M`。
  - 关闭分层编译：`-XX:-TieredCompilation`。

#### Requested array size exceeds VM limit

- **触发条件**：尝试分配超过 JVM 限制的数组（如 `Integer.MAX_VALUE - 2`）。

- **案例代码**：

  ```java
  int[] arr = new int[Integer.MAX_VALUE]; // 直接崩溃
  ```

- **解决方向**：检查代码中不合理的数组分配逻辑。

#### OOM 类型速查表

| OOM 类型                          | 关联内存区域  | 典型原因            |
| --------------------------------- | ------------- | ------------------- |
| `Java heap space`                 | 堆            | 内存泄漏/堆太小     |
| `Metaspace` / `PermGen space`     | 元空间/永久代 | 类加载爆炸          |
| `Unable to create native thread`  | 系统线程数    | 线程池失控/系统限制 |
| `Direct buffer memory`            | 堆外内存      | NIO Buffer 未释放   |
| `GC overhead limit exceeded`      | 堆            | GC 无效循环         |
| `CodeCache is full`               | JIT 代码缓存  | 动态方法过多        |
| `Requested array size exceeds VM` | 堆            | 超大数组分配        |

## 类加载

### 【中等】Java 里的对象在虚拟机里面是怎么存储的？

64 位 JVM 中，一个空`Object`占 16 字节（12 字节头 + 4 字节填充）。

每个 Java 对象在堆内存中分为 **3 个部分**：

- **对象头（Header）**
  - **Mark Word**：存储哈希码、GC 年龄、锁状态（如偏向锁信息）。
  - **Class Pointer**：指向类元数据的指针（压缩后占 4 字节，否则 8 字节）。
- **实例数据（Fields）**：对象的所有成员变量（包括继承的字段），按类型对齐存储。
- **对齐填充（Padding）**：确保对象大小为 8 字节的整数倍（优化 CPU 缓存行访问）。

**对象分配策略**

- **新生代分配**：大多数对象优先分配在** Eden 区**（若开启 TLAB，线程先分配至私有缓冲区）。触发 Young GC 后，存活对象移至 Survivor 区或晋升老年代。
- **老年代分配**：大对象（如`-XX:PretenureSizeThreshold=1MB`）直接进入老年代。长期存活对象（年龄 > `MaxTenuringThreshold`）从 Survivor 晋升。

**分配方式**：

- **指针碰撞**（堆内存规整时，如 Serial 收集器）。
- **空闲列表**（堆内存碎片化时，如 CMS 收集器）。

### 【中等】Java 类的生命周期是怎样的？

Java 类的生命周期可以分为 7 个阶段：加载 → 链接（验证→准备→解析） → 初始化 → 使用 → （可能）卸载。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202505070635024.png)

- **加载（Loading）**
  - 读取 `.class` 文件，生成 `Class<?>` 对象。
  - 触发条件：`new`、访问静态成员、反射等。
- **链接（Linking）**
  - **验证（Verification）**：检查字节码合法性（如魔数、继承规则）。
  - **准备（Preparation）**：为 `static` 变量分配内存，赋默认值（如 `int` 为 `0`）。
  - **解析（Resolution）**：将符号引用（如类名）转为直接引用（内存地址）。
- **初始化（Initialization）**
  - 执行 `<clinit>()`，完成 `static` 赋值和静态代码块。
  - 触发条件：首次 `new`、访问非 `final` 静态变量、反射初始化等。
- **使用（Using）**
  - 正常调用方法、创建实例。
- **卸载（Unloading）**
  - 条件：类无实例、`ClassLoader` 被回收、无 `Class<?>` 引用。
  - 典型场景：动态加载的类（如热部署）。

### 【困难】什么是类加载器吗？

Java 类加载器是 **JVM（Java 虚拟机）** 的核心组件之一，负责在运行时动态加载 Java 类（`.class` 文件）到内存，并生成对应的 `Class<?>` 对象。

#### 类加载器层次结构

类加载器采用 **"双亲委派模型"** 进行层次化管理，确保类的唯一性和安全性。按层级自上而下有 4 种类加载器：

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200617115936.png)

| 类加载器                                    | 加载范围                                     | 说明                                             |
| :------------------------------------------ | :------------------------------------------- | :----------------------------------------------- |
| **Bootstrap ClassLoader**（启动类加载器）   | `JRE/lib` 或 `-Xbootclasspath`               | 由 C++ 实现，是 JVM 的一部分，无 Java 父类加载器 |
| **Extension ClassLoader**（扩展类加载器）   | `JRE/lib/ext` 或 `-Djava.ext.dirs`           | 加载 Java 扩展库（如 `javax.*`）                 |
| **Application ClassLoader**（应用类加载器） | `-Djava.class.path` 或 `-cp` 或 `-classpath` | 默认加载用户编写的类（`main()` 方法所在类）      |
| **Custom ClassLoader**（自定义类加载器）    | 用户自定义路径（如网络、加密类）             | 可继承 `ClassLoader` 实现个性化加载逻辑          |

#### 双亲委派模型

双亲委派模型（Parents Delegation Model）要求除了顶层的 Bootstrap ClassLoader 外，其余的类加载器都应有自己的父类加载器。这里类加载器之间的父子关系一般通过组合（Composition）关系来实现，而不是通过继承（Inheritance）的关系实现。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202505070634474.png)

**工作原理**：**只有当父类加载器加载失败的情况下，才会用子类加载器去加载类**。

**优势**

- **避免重复加载**：双亲委派模型使得 Java 类随着它的类加载器一起具有一种带有优先级的层次关系，从而确保类在 JVM 中唯一（如 `java.lang.Object` 只由 `Bootstrap` 加载）。
- **安全性**：防止用户伪造核心类（如自定义 `java.lang.String` 会被父类加载器拦截）。

以下是抽象类 `java.lang.ClassLoader` 的代码片段，其中的 `loadClass()` 方法运行过程如下：

```java
public abstract class ClassLoader {
    // The parent class loader for delegation
    private final ClassLoader parent;

    public Class<?> loadClass(String name) throws ClassNotFoundException {
        return loadClass(name, false);
    }

    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        synchronized (getClassLoadingLock(name)) {
            // 首先判断该类型是否已经被加载
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                // 如果没有被加载，就委托给父类加载或者委派给启动类加载器加载
                try {
                    if (parent != null) {
                        // 如果存在父类加载器，就委派给父类加载器加载
                        c = parent.loadClass(name, false);
                    } else {
                        // 如果不存在父类加载器，就检查是否是由启动类加载器加载的类，通过调用本地方法native Class findBootstrapClass(String name)
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // 如果父类加载器加载失败，会抛出 ClassNotFoundException
                }

                if (c == null) {
                    // 如果父类加载器和启动类加载器都不能完成加载任务，才调用自身的加载功能
                    c = findClass(name);
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }

    protected Class<?> findClass(String name) throws ClassNotFoundException {
        throw new ClassNotFoundException(name);
    }
}
```

【说明】

- 先检查类是否已经加载过，如果没有则让父类加载器去加载。
- 当父类加载器加载失败时抛出 `ClassNotFoundException`，此时尝试自己去加载。

## 字节码

### 【中等】Java 是编译型语言还是解释型语言？

结论：**Java 既是编译型语言，也是解释型语言**。

::: info 什么是编译型语言？什么是解释型语言？
:::

- [**编译型语言**](https://zh.wikipedia.org/wiki/編譯語言) - 程序在执行之前**需要一个专门的编译过程，把程序编译成为机器语言的文件**，运行时不需要重新翻译，直接使用编译的结果就行了。一般情况下，编译型语言的执行速度比较快，开发效率比较低。常见的编译型语言有 C、C++、Go 等。
- [**解释型语言**](https://zh.wikipedia.org/wiki/直譯語言) - 程序不需要编译，只是在程序运行时通过 [解释器](https://zh.wikipedia.org/wiki/直譯器) ，将代码一句一句解释为机器代码后再执行。一般情况下，解释型语言的执行速度比较慢，开发效率比较高。常见的解释型语言有 JavaScript、Python、Ruby 等。

::: info 为什么说 Java 既是编译型语言，也是解释型语言？
:::

Java 语言既具有编译型语言的特征，也具有解释型语言的特征。因此，我们说 Java 是编译和解释并存的。

- **编译**：源码 → 字节码（`.java` → `.class`）。
- **解释/JIT**：字节码 → 机器码（解释执行 + 热点代码编译优化）。

Java 的源代码，首先，**通过 Javac 编译成为字节码（bytecode）**，即 `*.java` 文件转为 `*.class` 文件；然后，在运行时，**通过 Java 虚拟机（JVM）内嵌的解释器将字节码转换成为最终的机器码来执行**。正是由于 JVM 这套机制，使得 Java 可以【**一次编写，到处执行（Write Once, Run Anywhere）**】。

为了改善解释语言的效率而发展出的 [即时编译](https://zh.wikipedia.org/wiki/即時編譯) 技术，已经缩小了这两种语言间的差距。这种技术混合了编译语言与解释型语言的优点，它像编译语言一样，先把程序源代码编译成 [字节码](https://zh.wikipedia.org/wiki/字节码) 。到执行期时，再将字节码直译，之后执行。[Java](https://zh.wikipedia.org/wiki/Java) 与 [LLVM](https://zh.wikipedia.org/wiki/LLVM) 是这种技术的代表产物。常见的 JVM（如 Hotspot JVM），都提供了 JIT（Just-In-Time）编译器，JIT 能够在运行时将热点代码编译成机器码，这种情况下部分热点代码就属于**编译执行**，而不是解释执行了。

::: tip 扩展

[基本功 | Java 即时编译器原理解析及实践](https://tech.meituan.com/2020/10/22/java-jit-practice-in-meituan.html)

:::

### 【中等】什么是 Java 字节码？它与机器码有什么区别？

Java 字节码（Java Bytecode）是 Java 源代码编译后生成的中间代码，它是 Java 虚拟机（JVM）执行的指令集。**JVM 通过解释器或即时编译（JIT）将字节码转换为机器码执行**。字节码是 Java 实现【**一次编写，到处执行（Write Once, Run Anywhere）**】的核心技术之一。

机器码是直接由 CPU 执行的二进制指令。

**Java 字节码要点**：

- **基本概念**
  - 平台无关的中间代码，存储在 `.class` 文件中。
  - 包含类结构、字段、方法及对应的字节码指令。
- **指令集**：包含加载（`aload`/`iload`）、存储（`astore`）、运算（`iadd`）、控制流（`if_icmpgt`）等操作。
- **执行方式**
  - **解释执行**：JVM 逐条解释字节码。
  - **JIT 编译**：热点代码动态编译为机器码优化性能。
- **动态能力**
  - **反射**：运行时动态解析/修改字节码（如生成代理类）。
  - **字节码增强**：框架（Spring AOP 等）通过 ASM、Javassist 等工具修改字节码，实现 AOP 等功能。

::: tip 扩展

[美团 - 字节码增强技术探索](https://tech.meituan.com/2019/09/05/java-bytecode-enhancement.html)

:::

### 【中等】.class 文件的结构包含哪些主要部分？

- 魔数 (Magic Number)
- 版本信息
- 常量池 (Constant Pool)
- 访问标志
- 类索引、父类索引和接口索引
- 字段表
- 方法表
- 属性表

### 【中等】如何查看 Java 字节码？常用工具有哪些？

- javap (JDK 自带）
- ASM
- Bytecode Viewer
- JBE (Java Bytecode Editor)

### 【中等】Java 字节码有哪些典型应用场景？

- **性能优化**：JIT 编译、方法内联、热点代码分析
- **AOP 与动态代理**：Spring AOP、CGLIB、JDK 动态代理
- **ORM 与懒加载**：Hibernate 字节码增强实现延迟加载
- **代码分析与安全**：静态分析（FindBugs）、漏洞检测、代码混淆
- **热部署与热修复**：JRebel、阿里 Sophix（运行时替换字节码）
- **动态语言支持**：Groovy、Kotlin 等 JVM 语言编译成字节码
- **Mock 测试**：Mockito 动态生成 Mock 类字节码
- **序列化优化**：Jackson、FastJSON 使用字节码加速反射
- **调试与监控**：Arthas、JProfiler 插桩分析执行情况
- **JVM 研究与学习**：理解 Java 语法底层实现（如`try-with-resources`、`lambda`）

**核心作用**：

- **运行时增强**（AOP、代理）
- **性能优化**（JIT、减少反射开销）
- **动态能力**（热修复、Mock 测试）
- **跨语言支持**（JVM 生态多语言）

## 调优

### 【简单】JDK 内置了哪些工具？

以下是较常用的 JDK 命令行工具：

| 名称     | 描述                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `jps`    | 查看 Java 进程。显示系统内的所有 JVM 进程。                                                                                           |
| `jstat`  | JVM 统计监控工具。监控虚拟机运行时状态信息，它可以显示出 JVM 进程中的类装载、内存、GC、JIT 编译等运行数据。                           |
| `jmap`   | 生成内存快照（Heap Dump）。用于打印 JVM 进程对象直方图、类加载统计。并且可以生成堆转储快照（一般称为 heapdump 或 dump 文件）。        |
| `jstack` | 线程堆栈分析（排查死锁、线程阻塞）。用于打印 JVM 进程的线程和锁的情况。并且可以生成线程快照（一般称为 threaddump 或 javacore 文件）。 |
| `jhat`   | 用来分析 jmap 生成的 dump 文件。                                                                                                      |
| `jinfo`  | 查看/修改 JVM 运行参数。用于实时查看和调整 JVM 进程参数。                                                                             |

扩展命令行工具：

- **Arthas**：**Arthas 是阿里开源的 Java 诊断工具**，无需重启应用，实时**监控方法调用、查看类加载、分析性能瓶颈、热修复代码**，快速定位线上问题（如 CPU 飙高、内存泄漏、方法阻塞等）。

以下是较常见的 JVM GUI 工具：

| **工具名称**                           | **主要功能**                                                        | **适用场景**                 | **优点**                                 | **缺点**                             |
| :------------------------------------- | :------------------------------------------------------------------ | :--------------------------- | :--------------------------------------- | :----------------------------------- |
| **VisualVM**                           | - 监控内存、CPU、线程、GC - 堆转储分析 - 插件扩展（如 MBeans 监控） | 开发调试、性能分析           | 免费、轻量、JDK 自带                     | 功能较基础，对大堆支持有限           |
| **JConsole**                           | - 监控堆、类、线程、MBean - 简单的 GC 分析                          | 快速监控 JVM 状态            | JDK 自带，使用简单                       | 功能较少，无法深入分析               |
| **Eclipse MAT** (Memory Analyzer Tool) | - 分析堆转储（`heapdump`） - 检测内存泄漏、大对象                   | 内存泄漏排查、OOM 分析       | 强大的内存分析能力，可视化展示对象引用链 | 需要手动导出堆转储，对超大堆分析较慢 |
| **JProfiler**                          | - CPU 分析、内存分析、线程分析 - 实时监控、方法级调用追踪           | 企业级性能调优、生产环境监控 | 功能全面，支持多种分析模式               | 商业软件（付费），学习成本较高       |
| **Java Mission Control** (JMC)         | - 实时监控 JVM - 飞行记录（Flight Recorder） - 低开销性能分析       | 生产环境监控、性能诊断       | JDK 商业版自带，低开销                   | 部分功能需商业授权（Oracle JDK）     |

### 【中等】常用的 JVM 配置参数有哪些？

**内存相关参数**

| **参数**                 | **作用**                                | **适用场景**                                 |
| :----------------------- | :-------------------------------------- | :------------------------------------------- |
| `-Xss`                   | 设置每个线程的栈大小                    |                                              |
| `-Xms`                   | 初始堆大小                              | 避免堆动态扩展带来的性能波动                 |
| `-Xmx`                   | 最大堆大小                              | 防止 OOM，需留 20% 系统内存余量              |
| `-Xmn`                   | 新生代大小（建议占堆 1/3~1/2）          | 优化 GC 频率和停顿时间                       |
| `-XX:PermSize`           | 永久代空间的初始值                      | Java 7 及以前用于设置方法区大小，Java 8 废弃 |
| `-XX:MaxPermSize`        | 永久代空间的最大值                      | Java 7 及以前用于设置方法区大小，Java 8 废弃 |
| `-XX:MetaspaceSize`      | 元空间初始大小（JDK8+）                 | 避免频繁 Full GC 扩容                        |
| `-XX:MaxMetaspaceSize`   | 元空间最大大小（默认无限制）            | 防止元空间占用过多内存                       |
| `-XX:+UseCompressedOops` | 启用压缩指针（64位系统默认开启）        | 减少内存占用（堆 < 32GB 时有效）             |
| `-XX:NewRatio`           | 新生代与年老代的比例（默认为 2）        |                                              |
| `-XX:SurvivorRatio`      | Eden 区与 Survivor 区比例（默认 8:1:1） | 调整新生代对象晋升速度                       |

**GC 相关参数**

| **参数**                          | **作用**                              | **示例/默认值**                     | **适用场景**             |
| :-------------------------------- | :------------------------------------ | :---------------------------------- | :----------------------- |
| `-XX:+UseG1GC`                    | 启用 G1 垃圾收集器（JDK9+ 默认）      | `-XX:+UseG1GC`                      | 大堆（>4GB）低延迟场景   |
| `-XX:MaxGCPauseMillis`            | G1 最大停顿时间目标（毫秒）           | `-XX:MaxGCPauseMillis=200`          | 控制 GC 延迟             |
| `-XX:ParallelGCThreads`           | 并行 GC 线程数（默认=CPU 核数）       | `-XX:ParallelGCThreads=4`           | 多核服务器优化 GC 效率   |
| `-XX:+UseConcMarkSweepGC`         | 启用 CMS 收集器（已废弃，JDK14 移除） | 不推荐使用                          | 老年代低延迟（历史项目） |
| `-XX:+PrintGCDetails`             | 打印详细 GC 日志                      | 配合 `-Xloggc:/path/gc.log`         | 调试 GC 问题             |
| `-XX:+HeapDumpOnOutOfMemoryError` | OOM 时自动生成堆转储文件              | `-XX:HeapDumpPath=/path/dump.hprof` | 内存泄漏分析             |

### 【中等】如何在 Java 中进行内存泄漏分析？

- 内存泄漏的本质是**对象被意外持有无法回收**，通过引用链分析找到“谁在引用它”。
- 生产环境优先配置 `-XX:+HeapDumpOnOutOfMemoryError` 防患未然。

#### 确认内存泄漏现象

- 堆内存持续增长（通过 `jstat -gcutil <pid>` 观察 `Old Gen` 或 `Metaspace` 使用率）。
- Full GC 频繁但无法回收内存（`jstat` 显示 `Full GC` 次数增加）。
- 最终触发 `OutOfMemoryError: Java heap space`。

#### 获取内存快照

**方法 1：主动触发堆转储（Heap Dump）**

```bash
# 使用 jmap 导出堆转储文件（需进程权限）
jmap -dump:format=b,file=heap.hprof <pid>

# 或配置 JVM 参数自动生成（OOM 时触发）
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/path/heap.hprof
```

**方法 2：通过工具生成**

- **VisualVM**：右键进程 → "Heap Dump"。
- **JConsole**："MBeans" → "com.sun.management" → "HotSpotDiagnostic" → "dumpHeap"。

#### 分析堆转储文件

**工具选择**

| **工具**        | **特点**                                                 |
| --------------- | -------------------------------------------------------- |
| **Eclipse MAT** | 功能强大，支持对象引用链分析、泄漏嫌疑报告（推荐首选）。 |
| **VisualVM**    | 基础分析，适合快速查看大对象分布。                       |
| **JProfiler**   | 商业工具，可视化交互好，支持实时监控。                   |

**MAT 关键操作步骤**

1. **打开堆转储文件**：`File` → `Open Heap Dump`。
2. **查看泄漏报告**：
   - 首页会提示 `Leak Suspects`（泄漏嫌疑对象）。
   - 示例报告：`"java.lang.Thread" instances retained by thread stack`（线程未释放）。
3. **分析对象引用链**：
   - 右键对象 → `Path to GC Roots` → `exclude weak/soft references`（排除弱引用）。
   - 查找意外被持有的对象（如静态集合、未关闭的资源）。
4. **统计对象占比**：`Histogram` 视图按类/包名分组，排序 `Retained Heap`（对象总占用内存）。

#### 常见内存泄漏场景与修复

| **泄漏类型**     | **典型原因**                             | **修复方案**                            |
| ---------------- | ---------------------------------------- | --------------------------------------- |
| **静态集合**     | 静态 `Map`/`List` 持续添加对象未清除。   | 使用弱引用（`WeakHashMap`）或定期清理。 |
| **未关闭资源**   | 数据库连接、文件流未调用 `close()`。     | 用 `try-with-resources` 自动关闭。      |
| **线程未终止**   | 线程池或 `Thread` 未销毁（如定时任务）。 | 调用 `shutdown()` 或设为守护线程。      |
| **缓存未清理**   | 本地缓存（如 Guava Cache）无过期策略。   | 设置大小限制或过期时间。                |
| **监听器未注销** | 事件监听器未移除（如 Spring Bean）。     | 在销毁时手动注销监听器。                |

#### 实时诊断工具（无需堆转储）

**Arthas（阿里开源）**

```bash
# 监控对象增长
watch java.util.HashMap size '{params,returnObj}' -n 5

# 查看类实例数量
sc -d *MyClass | grep classLoaderHash
jad --source-only com.example.LeakClass > LeakClass.java

# 生成火焰图分析 CPU/内存
profiler start -d 30 -f /tmp/flamegraph.html
```

**JVisualVM**：安装 **VisualGC** 插件，实时观察各内存区域变化。

### 【中等】如何对 Java 的垃圾回收进行调优？

#### 调优核心目标

- **降低延迟（Latency）**：减少 GC 停顿时间（STW），提升响应速度。
- **提高吞吐量（Throughput）**：最大化应用处理业务的时间占比（GC 时间占比最小化）。
- **控制内存占用（Footprint）**：合理分配堆内存，避免浪费或频繁扩容。

#### 调优原则

- **数据驱动**：基于监控而非猜测调整参数。
- **渐进式修改**：每次只改一个参数，观察效果。
- **权衡取舍**：低延迟可能牺牲吞吐量，需根据业务需求选择。

通过以上步骤，可系统性地优化 Java GC 性能，解决停顿时间长、吞吐不足等问题。

#### 调优步骤

**监控与基线分析**

- **工具**：
  - `jstat -gcutil <pid>`：实时监控 GC 各区域使用率。
  - `GC 日志`：通过 `-Xlog:gc*` 或 `-XX:+PrintGCDetails` 记录详细 GC 行为。
  - **VisualVM**/**Grafana + Prometheus**：可视化内存和 GC 趋势。
- **关键指标**：Young GC / Full GC 频率、平均停顿时间、吞吐量（`1 - GC时间/总时间`）。

**选择垃圾收集器**

| **收集器**      | **适用场景**                 | **关键参数**                                 |
| --------------- | ---------------------------- | -------------------------------------------- |
| **G1 GC**       | 平衡延迟与吞吐（JDK8+ 默认） | `-XX:MaxGCPauseMillis=200`（目标停顿时间）   |
| **ZGC**         | 超低延迟（JDK11+，大堆）     | `-XX:+UseZGC -Xmx>8G`                        |
| **Parallel GC** | 高吞吐量（批处理任务）       | `-XX:+UseParallelGC -XX:ParallelGCThreads=8` |

**堆内存分配优化**

- **总堆大小**（`-Xms`/`-Xmx`）：
  - 建议设为物理内存的 50%~70%（预留空间给 OS 和其他进程）。
  - 容器化环境需启用 `-XX:+UseContainerSupport`。
- **新生代与老年代比例**：G1 无需手动设置（自动调整），Parallel GC 可设 `-Xmn`（如堆的 1/3）。

**关键参数调优**

- **G1 专用参数**：

  ```bash
  -XX:InitiatingHeapOccupancyPercent=45  # 老年代占用阈值触发Mixed GC
  -XX:G1NewSizePercent=20               # 新生代最小占比
  -XX:G1MaxNewSizePercent=50            # 新生代最大占比
  ```

- **通用参数**：

  ```bash
  -XX:MetaspaceSize=512M                # 避免元空间动态扩容
  -XX:+HeapDumpOnOutOfMemoryError       # OOM时自动转储内存
  ```

**避免常见陷阱**

- **Full GC 频繁**：
  - 检查老年代对象晋升过快（调整 `-XX:MaxTenuringThreshold`）。
  - 避免大对象直接进入老年代（如 `-XX:G1HeapRegionSize` 适配对象大小）。
- **MetaSpace OOM**：
  - 增加 `-XX:MaxMetaspaceSize`（如 `1G`），并检查动态类生成（反射/CGLIB）。

**验证与迭代**

- **压测对比**：使用相同负载对比调优前后的 GC 日志。
- **持续监控**：生产环境通过 APM（如 SkyWalking）观察长周期效果。

**调优示例**

**场景：Web 服务（低延迟优先）**

```bash
# G1 GC 配置示例
-Xms4G -Xmx4G
-XX:+UseG1GC
-XX:MaxGCPauseMillis=150
-XX:InitiatingHeapOccupancyPercent=40
-XX:G1HeapRegionSize=4M
-Xlog:gc*,gc+heap=debug:file=gc.log:time,uptime
```

**场景：大数据计算（高吞吐优先）**

```bash
# Parallel GC 配置示例
-Xms8G -Xmx8G
-XX:+UseParallelGC
-XX:ParallelGCThreads=4
-XX:MaxGCPauseMillis=500
-XX:+UseAdaptiveSizePolicy  # 自动调整新生代/老年代比例
```

#### 高级工具

- **JFR（Java Flight Recorder）**：

  ```bash
  -XX:StartFlightRecording=duration=60s,settings=profile,jfr=memory=on
  ```

- **Arthas**：实时诊断内存泄漏（如 `heapdump` 命令）。