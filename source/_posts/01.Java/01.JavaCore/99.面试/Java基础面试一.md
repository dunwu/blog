---
title: Java 基础面试一
date: 2024-06-18 22:46:20
categories:
  - Java
  - JavaCore
  - 面试
tags:
  - Java
  - JavaSE
  - 面试
permalink: /pages/5fe7db38/
---

# Java 基础面试一

## Java 常识

### Oracle JDK 和 Open JDK

**典型问题**

Oracle JDK 和 Open JDK 有什么区别？

**知识点**

|          | OpenJDK                                           | Oracle JDK                                             |
| -------- | ------------------------------------------------- | ------------------------------------------------------ |
| 是否开源 | 完全开源                                          | 闭源                                                   |
| 是否免费 | 完全免费                                          | JDK8u221 之后存在限制                                  |
| 更新频率 | 一般每 3 个月发布一个版本；不提供 LTS 服务        | 一般每 6 个月发布一个版本；大概每三年推出一个 LTS 版本 |
| 功能性   | Java 11 之后，OracleJDK 和 OpenJDK 的功能基本一致 |                                                        |
| 协议     | GPL v2                                            | BCL/OTN                                                |

![img](https://i.sstatic.net/mmVJs.png)

### Java SE 和 Java EE

**典型问题**

Java SE 和 Java EE 有什么区别？

**知识点**

Java 技术既是一种编程语言，又是一种平台。Java 编程语言是一种具有特定语法和风格的高级面向对象语言。Java 平台是 Java 编程语言应用程序运行的特定环境。

- Java SE（Java Platform, Standard Edition） - Java 平台标准版。Java SE 的 API 提供了 Java 编程语言的核心功能。它定义了从 Java 编程语言的基本类型和对象到用于网络、安全、数据库访问、图形用户界面 (GUI) 开发和 XML 解析的高级类的所有内容。除了核心 API 之外，Java SE 平台还包括虚拟机、开发工具、部署技术以及 Java 技术应用程序中常用的其他类库和工具包。
- Java EE（Java Platform, Enterprise Edition） - Java 平台企业版。Java EE 构建在 Java SE 基础之上。 Java EE 定义了企业级应用程序开发和部署的标准和规范，如：Servlet、JSP、EJB、JDBC、JPA、JTA、JavaMail、JMS。

> 摘自 [**Your First Cup**](https://docs.oracle.com/javaee/6/firstcup/doc/gkhoy.html)

### JDK、JRE、JVM 之间有什么关系

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

![enter image description here](https://i.sstatic.net/CBNux.png)

> 摘自 [stackoverflow 高票问题 - What is the difference between JDK and JRE?](https://stackoverflow.com/questions/1906445/what-is-the-difference-between-jdk-and-jre)

### 什么是字节码？采用字节码的好处是什么？

在 Java 中，JVM 可以理解的代码就叫做字节码（即扩展名为 `.class` 的文件），它不面向任何特定的处理器，只面向虚拟机。Java 语言通过字节码的方式，在一定程度上解决了传统解释型语言执行效率低的问题，同时又保留了解释型语言可移植的特点。所以， Java 程序运行时相对来说还是高效的（不过，和 C、 C++，Rust，Go 等语言还是有一定差距的），而且，由于字节码并不针对一种特定的机器，因此，Java 程序无须重新编译便可在多种不同操作系统的计算机上运行。

我们需要格外注意的是 `.class->机器码` 这一步。在这一步 JVM 类加载器首先加载字节码文件，然后通过解释器逐行解释执行，这种方式的执行速度会相对比较慢。而且，有些方法和代码块是经常需要被调用的（也就是所谓的热点代码），所以后面引进了 **JIT（Just in Time Compilation）** 编译器，而 JIT 属于运行时编译。当 JIT 编译器完成第一次编译后，其会将字节码对应的机器码保存下来，下次可以直接使用。而我们知道，机器码的运行效率肯定是高于 Java 解释器的。这也解释了我们为什么经常会说 **Java 是编译与解释共存的语言** 。

### Java 是编译型语言还是解释型语言？

结论：**Java 既是编译型语言，也是解释型语言**。

知识点：

（1）什么是编译型语言？什么是解释型语言？

- [**编译型语言**](https://zh.wikipedia.org/wiki/編譯語言) - 程序在执行之前需要一个专门的编译过程，把程序编译成为机器语言的文件，运行时不需要重新翻译，直接使用编译的结果就行了。一般情况下，编译型语言的执行速度比较快，开发效率比较低。常见的编译型语言有 C、C++、Go 等。
- [**解释型语言**](https://zh.wikipedia.org/wiki/直譯語言） - 程序不需要编译，只是在程序运行时通过 [解释器](https://zh.wikipedia.org/wiki/直譯器)，将代码一句一句解释为机器代码后再执行。一般情况下，解释型语言的执行速度比较慢，开发效率比较高。常见的解释型语言有 JavaScript、Python、Ruby 等。

（2）为什么说 Java 既是编译型语言，也是解释型语言

Java 语言既具有编译型语言的特征，也具有解释型语言的特征。因此，我们说 Java 是编译和解释并存的。

Java 的源代码，首先通过 Javac 编译成为字节码（bytecode），即 `*.java` 文件转为 `*.class` 文件；然后，在运行时，通过 Java 虚拟机（JVM）内嵌的解释器将字节码转换成为最终的机器码来执行。正是由于 JVM 这套机制，使得 Java 可以“一次编写，到处执行（Write once, run anywhere）”。

为了改善解释语言的效率而发展出的 [即时编译](https://zh.wikipedia.org/wiki/即時編譯）技术，已经缩小了这两种语言间的差距。这种技术混合了编译语言与解释型语言的优点，它像编译语言一样，先把程序源代码编译成 [字节码](https://zh.wikipedia.org/wiki/字节码）。到执行期时，再将字节码直译，之后执行。[Java](https://zh.wikipedia.org/wiki/Java) 与 [LLVM](https://zh.wikipedia.org/wiki/LLVM) 是这种技术的代表产物。常见的 JVM（如 Hotspot JVM），都提供了 JIT（Just-In-Time）编译器，JIT 能够在运行时将热点代码编译成机器码，这种情况下部分热点代码就属于**编译执行**，而不是解释执行了。

> 扩展阅读：[基本功 | Java 即时编译器原理解析及实践](https://tech.meituan.com/2020/10/22/java-jit-practice-in-meituan.html)

### AOT 有什么优点？为什么不全部使用 AOT 呢？

JDK 9 引入了一种新的编译模式 **AOT(Ahead of Time Compilation)** 。和 JIT 不同的是，这种编译模式会在程序被执行前就将其编译成机器码，属于静态编译（C、 C++，Rust，Go 等语言就是静态编译）。AOT 避免了 JIT 预热等各方面的开销，可以提高 Java 程序的启动速度，避免预热时间长。并且，AOT 还能减少内存占用和增强 Java 程序的安全性（AOT 编译后的代码不容易被反编译和修改），特别适合云原生场景。

AOT 的主要优势在于启动时间、内存占用和打包体积。JIT 的主要优势在于具备更高的极限处理能力，可以降低请求的最大延迟。

提到 AOT 就不得不提 [GraalVM](https://www.graalvm.org/) 了！GraalVM 是一种高性能的 JDK（完整的 JDK 发行版本），它可以运行 Java 和其他 JVM 语言，以及 JavaScript、Python 等非 JVM 语言。 GraalVM 不仅能提供 AOT 编译，还能提供 JIT 编译。感兴趣的同学，可以去看看 GraalVM 的官方文档：https://www.graalvm.org/latest/docs/。如果觉得官方文档看着比较难理解的话，也可以找一些文章来看看，比如：

- [基于静态编译构建微服务应用](https://mp.weixin.qq.com/s/4haTyXUmh8m-dBQaEzwDJw)
- [走向 Native 化：Spring&Dubbo AOT 技术示例与原理讲解](https://cn.dubbo.apache.org/zh-cn/blog/2023/06/28/走向-native-化 springdubbo-aot-技术示例与原理讲解/)

**既然 AOT 这么多优点，那为什么不全部使用这种编译方式呢？**

我们前面也对比过 JIT 与 AOT，两者各有优点，只能说 AOT 更适合当下的云原生场景，对微服务架构的支持也比较友好。除此之外，AOT 编译无法支持 Java 的一些动态特性，如反射、动态代理、动态加载、JNI（Java Native Interface）等。然而，很多框架和库（如 Spring、CGLIB）都用到了这些特性。如果只使用 AOT 编译，那就没办法使用这些框架和库了，或者说需要针对性地去做适配和优化。举个例子，CGLIB 动态代理使用的是 ASM 技术，而这种技术大致原理是运行时直接在内存中生成并加载修改后的字节码文件也就是 `.class` 文件，如果全部使用 AOT 提前编译，也就不能使用 ASM 技术了。为了支持类似的动态特性，所以选择使用 JIT 即时编译器。

## 注释

### Java 有几种注释形式

注释用于在源代码中解释代码的作用，可以增强程序的可读性，可维护性。 空白行，或者注释的内容，都会被 Java 编译器忽略掉。

Java 注释主要有三种类型：

- 单行注释
- 多行注释
- 文档注释（JavaDoc）

```java
public class HelloWorld {
    /*
     * JavaDoc 注释
     */
    public static void main(String[] args) {
        // 单行注释
        /* 多行注释
           1. 注意点 a
           2. 注意点 b
         */
        System.out.println("Hello World");
    }
}
```

## 数据类型

### Java 有哪些值类型？

Java 中的数据类型有两类：

- 值类型（又叫内置数据类型，基本数据类型）
- 引用类型（除值类型以外，都是引用类型，包括 `String`、数组等）

Java 语言提供了 **8** 种基本类型，大致分为 **4** 类：布尔型、字符型、整数型、浮点型。

| 基本数据类型 | 分类       | 大小   | 默认值    | 取值范围                      | 包装类    | 说明                                        |
| ------------ | ---------- | ------ | --------- | ----------------------------- | --------- | ------------------------------------------- |
| `boolean`    | **布尔型** | -      | `false`   | {false, true}                 | Boolean   | `boolean` 的大小，是由具体的 JVM 实现来决定的 |
| `char`       | **字符型** | 16 bit | `'u0000'` | [0, $2^{16} - 1$]             | Character | 存储 Unicode 码，用单引号赋值               |
| `byte`       | **整数型** | 8 bit  | `0`       | [-$2^7$, $2^7 - 1$]           | Byte      |                                             |
| `short`      | **整数型** | 16 bit | `0`       | [-$2^{15}$, $2^{15} - 1$]     | Short     |                                             |
| `int`        | **整数型** | 32 bit | `0`       | [-$2^{31}$, $2^{31} - 1$]     | Integer   |                                             |
| `long`       | **整数型** | 64 bit | `0L`      | [-$2^{63}$, $2^{63} - 1$]     | Long      | 赋值时一般在数字后加上 `l` 或 `L`           |
| `float`      | **浮点型** | 32 bit | `0.0f`    | [$2^{-149}$, $2^{128} - 1$]   | Float     | 赋值时必须在数字后加上 `f` 或 `F`           |
| `double`     | **浮点型** | 64 bit | `0.0d`    | [$2^{-1074}$, $2^{1024} - 1$] | Double    | 赋值时一般在数字后加 `d` 或 `D`             |

### 什么是装箱、拆箱？

Java 中为每一种基本数据类型提供了相应的包装类，如下：

```
Byte <-> byte
Short <-> short
Integer <-> int
Long <-> long
Float <-> float
Double <-> double
Character <-> char
Boolean <-> boolean
```

**引入包装类的目的**就是：提供一种机制，使得**基本数据类型可以与引用类型互相转换**。

基本数据类型与包装类的转换被称为装箱和拆箱。

- **装箱（boxing）是将值类型转换为引用类型**。例如：`int` 转 `Integer`
  - 装箱过程是通过调用包装类的 `valueOf` 方法实现的。
- **拆箱（unboxing）是将引用类型转换为值类型**。例如：`Integer` 转 `int`
  - 拆箱过程是通过调用包装类的 `xxxValue` 方法实现的。（xxx 代表对应的基本数据类型）。

### 包装类型的缓存机制了解么？

Java 基本数据类型的包装类型的大部分都用到了缓存机制来提升性能。

`Byte`,`Short`,`Integer`,`Long` 这 4 种包装类默认创建了数值 **[-128，127]** 的相应类型的缓存数据，`Character` 创建了数值在 **[0,127]** 范围的缓存数据，`Boolean` 直接返回 `True` or `False`。

**Integer 缓存源码：**

```
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
private static class IntegerCache {
    static final int low = -128;
    static final int high;
    static {
        // high value may be configured by property
        int h = 127;
    }
}
```

**`Character` 缓存源码：**

```
public static Character valueOf(char c) {
    if (c <= 127) { // must cache
      return CharacterCache.cache[(int)c];
    }
    return new Character(c);
}

private static class CharacterCache {
    private CharacterCache(){}
    static final Character cache[] = new Character[127 + 1];
    static {
        for (int i = 0; i < cache.length; i++)
            cache[i] = new Character((char)i);
    }

}
```

**`Boolean` 缓存源码：**

```
public static Boolean valueOf(boolean b) {
    return (b ? TRUE : FALSE);
}
```

如果超出对应范围仍然会去创建新的对象，缓存的范围区间的大小只是在性能和资源之间的权衡。

两种浮点数类型的包装类 `Float`,`Double` 并没有实现缓存机制。

```
Integer i1 = 33;
Integer i2 = 33;
System.out.println(i1 == i2);// 输出 true

Float i11 = 333f;
Float i22 = 333f;
System.out.println(i11 == i22);// 输出 false

Double i3 = 1.2;
Double i4 = 1.2;
System.out.println(i3 == i4);// 输出 false
```

下面我们来看一个问题：下面的代码的输出结果是 `true` 还是 `false` 呢？

```
Integer i1 = 40;
Integer i2 = new Integer(40);
System.out.println(i1==i2);
```

`Integer i1=40` 这一行代码会发生装箱，也就是说这行代码等价于 `Integer i1=Integer.valueOf(40)` 。因此，`i1` 直接使用的是缓存中的对象。而`Integer i2 = new Integer(40)` 会直接创建新的对象。

因此，答案是 `false` 。你答对了吗？

记住：**所有整型包装类对象之间值的比较，全部使用 equals 方法比较**。

### 自动装箱与拆箱的原理是什么？

```java
Integer a = 10;  //装箱
int b = a;   //拆箱
```

上面这两行代码对应的字节码为：

```java
   L1

    LINENUMBER 8 L1

    ALOAD 0

    BIPUSH 10

    INVOKESTATIC java/lang/Integer.valueOf (I)Ljava/lang/Integer;

    PUTFIELD AutoBoxTest.i : Ljava/lang/Integer;

   L2

    LINENUMBER 9 L2

    ALOAD 0

    ALOAD 0

    GETFIELD AutoBoxTest.i : Ljava/lang/Integer;

    INVOKEVIRTUAL java/lang/Integer.intValue ()I

    PUTFIELD AutoBoxTest.n : I

    RETURN
```

通过字节码代码，不难发现，装箱其实就是调用了 包装类的 `valueOf()` 方法；而拆箱其实就是调用了 `xxxValue()` 方法。

因此，

- `Integer a = 10` 等价于 `Integer a = Integer.valueOf(10)`
- `int b = a` 等价于 `int b = a.intValue()`;

### 比较包装类型为什么不能用 ==？

Java 值类型的包装类大部分都使用了缓存机制来提升性能：

- `Byte`、`Short`、`Integer`、`Long` 这 4 种包装类，默认都创建了数值在 **[-128，127]** 范围之间的相应类型缓存数据；
- `Character` 创建了数值在 **[0,127]** 范围之间的缓存数据；
- `Boolean` 直接返回 `True` or `False`；

试图装箱的数值，如果超出缓存范围，则会创建新的对象。

以 `Long.valueOf` 方法为例：

```java
public static Long valueOf(long l) {
    final int offset = 128;
    if (l >= -128 && l <= 127) { // will cache
        return LongCache.cache[(int)l + offset];
    }
    return new Long(l);
}
```

### 为什么浮点数运算的时候会有精度丢失的风险？

浮点数运算精度丢失代码演示：

```
float a = 2.0f - 1.9f;
float b = 1.8f - 1.7f;
System.out.println(a);// 0.100000024
System.out.println(b);// 0.099999905
System.out.println(a == b);// false
```

为什么会出现这个问题呢？

这个和计算机保存浮点数的机制有很大关系。我们知道计算机是二进制的，而且计算机在表示一个数字时，宽度是有限的，无限循环的小数存储在计算机时，只能被截断，所以就会导致小数精度发生损失的情况。这也就是解释了为什么浮点数没有办法用二进制精确表示。

就比如说十进制下的 0.2 就没办法精确转换成二进制小数：

```
// 0.2 转换为二进制数的过程为，不断乘以 2，直到不存在小数为止，
// 在这个计算过程中，得到的整数部分从上到下排列就是二进制的结果。
0.2 * 2 = 0.4 -> 0
0.4 * 2 = 0.8 -> 0
0.8 * 2 = 1.6 -> 1
0.6 * 2 = 1.2 -> 1
0.2 * 2 = 0.4 -> 0（发生循环）
...
```

### 如何解决浮点数运算的精度丢失问题？

`BigDecimal` 可以实现对浮点数的运算，不会造成精度丢失。通常情况下，大部分需要浮点数精确运算结果的业务场景（比如涉及到钱的场景）都是通过 `BigDecimal` 来做的。

```
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("0.9");
BigDecimal c = new BigDecimal("0.8");

BigDecimal x = a.subtract(b);
BigDecimal y = b.subtract(c);

System.out.println(x); /* 0.1 */
System.out.println(y); /* 0.1 */
System.out.println(Objects.equals(x, y)); /* true */
```

### 超过 long 整型的数据应该如何表示？

基本数值类型都有一个表达范围，如果超过这个范围就会有数值溢出的风险。

在 Java 中，64 位 long 整型是最大的整数类型。

```
long l = Long.MAX_VALUE;
System.out.println(l + 1); // -9223372036854775808
System.out.println(l + 1 == Long.MIN_VALUE); // true
```

`BigInteger` 内部使用 `int[]` 数组来存储任意大小的整形数据。

相对于常规整数类型的运算来说，`BigInteger` 运算的效率会相对较低。

## 标识符

### 标识符命名规则

Java 所有的组成部分都需要名字。类名、变量名以及方法名都被称为标识符。

关于 Java 标识符，有以下几点需要注意：

- 所有的标识符都应该以字母（A-Z 或者 a-z）, 美元符（$）、或者下划线（\_）开始
- 首字符之后可以是字母（A-Z 或者 a-z）, 美元符（$）、下划线（\_）或数字的任何字符组合
- 关键字不能用作标识符
- 标识符是大小写敏感的
- 合法标识符举例：age、$salary、\_value、\_\_1_value
- 非法标识符举例：123abc、-salary

在 Java 中，标识符通常遵循 [驼峰命名法](https://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB)。

- **类名、接口名一般采用大驼峰式命名法（upper camel case）**，即：每一个单字的首字母都采用大写字母，例如：FirstName、LastName、CamelCase。
- **方法名、变量名一般采用小驼峰式命名法（lower camel case）**，即：第一个单词以小写字母开始；第二个单词的首字母大写，例如：firstName、lastName。
- **常量名一般采用全大写的蛇形命名法（snake_case）**，即：单词之间用下划线（`_`）分隔，例如：SCREAMING_SNAKE_CASE。

### Java 中有哪些关键字？

下面列出了 Java 保留字，这些保留字不能用于常量、变量、和任何标识符的名称。

| 分类                 | 关键字                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 访问级别修饰符       | private、protected、public、default                                                                                            |
| 类，方法和变量修饰符 | abstract、class、extends、final、implements、interface、native、new、static、strictfp、synchronized、transient、volatile、enum |
| 程序控制语句         | break、continue、return、do、while、if、else、for、instanceof、switch、case                                                    |
| 错误处理             | assert、try、catch、throw、throws、finally                                                                                     |
| 包相关               | import、package                                                                                                                |
| 数据类型             | boolean、byte、char、short、int、long、float、double、enum                                                                     |
| 变量引用             | super、this、void                                                                                                              |
| 其他保留字           | goto、const                                                                                                                    |

> **注意：**Java 的 null 不是关键字，类似于 true 和 false，它是一个字面常量，不允许作为标识符使用。
>
> **官方文档**：https://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html

## 变量

Java 支持的变量类型有：

- `局部变量` - 类方法中的变量。
- `成员变量（也叫实例变量）` - 类方法外的变量，不过没有 `static` 修饰。
- `静态变量（也叫类变量）` - 类方法外的变量，用 `static` 修饰。

```java
public class VariableDemo {

    // 静态变量
    private static String v1 = "静态变量";

    // 成员变量
    private String v2 = "成员变量";

    public void test(String v4) {
        // 局部变量
        String v3 = "局部变量";
        System.out.println(v1);
        System.out.println(v2);
        System.out.println(v3);
        System.out.println(v4);
    }

    public static void main(String[] args) {
        VariableDemo demo = new VariableDemo();
        demo.test("参数变量");
    }

}
```

### 成员变量与局部变量的区别？

- **语法形式**：从语法形式上看，成员变量是属于类的，而局部变量是在代码块或方法中定义的变量或是方法的参数；成员变量可以被 `public`,`private`,`static` 等修饰符所修饰，而局部变量不能被访问控制修饰符及 `static` 所修饰；但是，成员变量和局部变量都能被 `final` 所修饰。
- **存储方式**：从变量在内存中的存储方式来看，如果成员变量是使用 `static` 修饰的，那么这个成员变量是属于类的，如果没有使用 `static` 修饰，这个成员变量是属于实例的。而对象存在于堆内存，局部变量则存在于栈内存。
- **生存时间**：从变量在内存中的生存时间上看，成员变量是对象的一部分，它随着对象的创建而存在，而局部变量随着方法的调用而自动生成，随着方法的调用结束而消亡。
- **默认值**：从变量是否有默认值来看，成员变量如果没有被赋初始值，则会自动以类型的默认值而赋值（一种情况例外：被 `final` 修饰的成员变量也必须显式地赋值），而局部变量则不会自动赋值。

### 为什么成员变量有默认值？

1. 先不考虑变量类型，如果没有默认值会怎样？变量存储的是内存地址对应的任意随机值，程序读取该值运行会出现意外。
2. 默认值有两种设置方式：手动和自动，根据第一点，没有手动赋值一定要自动赋值。成员变量在运行时可借助反射等方法手动赋值，而局部变量不行。
3. 对于编译器（javac）来说，局部变量没赋值很好判断，可以直接报错。而成员变量可能是运行时赋值，无法判断，误报“没默认值”又会影响用户体验，所以采用自动赋默认值。

成员变量与局部变量代码示例：

```
public class VariableExample {

    // 成员变量
    private String name;
    private int age;

    // 方法中的局部变量
    public void method() {
        int num1 = 10; // 栈中分配的局部变量
        String str = "Hello, world!"; // 栈中分配的局部变量
        System.out.println(num1);
        System.out.println(str);
    }

    // 带参数的方法中的局部变量
    public void method2(int num2) {
        int sum = num2 + 10; // 栈中分配的局部变量
        System.out.println(sum);
    }

    // 构造方法中的局部变量
    public VariableExample(String name, int age) {
        this.name = name; // 对成员变量进行赋值
        this.age = age; // 对成员变量进行赋值
        int num3 = 20; // 栈中分配的局部变量
        String str2 = "Hello, " + this.name + "!"; // 栈中分配的局部变量
        System.out.println(num3);
        System.out.println(str2);
    }
}
```

### 静态变量有什么作用？

静态变量也就是被 `static` 关键字修饰的变量。它可以被类的所有实例共享，无论一个类创建了多少个对象，它们都共享同一份静态变量。也就是说，静态变量只会被分配一次内存，即使创建多个对象，这样可以节省内存。

静态变量是通过类名来访问的，例如`StaticVariableExample.staticVar`（如果被 `private`关键字修饰就无法这样访问了）。

```
public class StaticVariableExample {
    // 静态变量
    public static int staticVar = 0;
}
```

通常情况下，静态变量会被 `final` 关键字修饰成为常量。

```
public class ConstantVariableExample {
    // 常量
    public static final int constantVar = 0;
}
```

### 字符型常量和字符串常量的区别？

- **形式** : 字符常量是单引号引起的一个字符，字符串常量是双引号引起的 0 个或若干个字符。
- **含义** : 字符常量相当于一个整型值 ( ASCII 值）, 可以参加表达式运算；字符串常量代表一个地址值（该字符串在内存中存放位置）。
- **占内存大小**：字符常量只占 2 个字节；字符串常量占若干个字节。

⚠️ 注意 `char` 在 Java 中占两个字节。

字符型常量和字符串常量代码示例：

```
public class StringExample {
    // 字符型常量
    public static final char LETTER_A = 'A';

    // 字符串常量
    public static final String GREETING_MESSAGE = "Hello, world!";
    public static void main(String[] args) {
        System.out.println("字符型常量占用的字节数为："+Character.BYTES);
        System.out.println("字符串常量占用的字节数为："+GREETING_MESSAGE.getBytes().length);
    }
}
```

输出：

```
字符型常量占用的字节数为：2
字符串常量占用的字节数为：13
```

## 操作符

### 如果移位的位数超过数值所占有的位数会怎样？

当 int 类型左移/右移位数大于等于 32 位操作时，会先求余（%）后再进行左移/右移操作。也就是说左移/右移 32 位相当于不进行移位操作（32%32=0），左移/右移 42 位相当于左移/右移 10 位（42%32=10）。当 long 类型进行左移/右移操作时，由于 long 对应的二进制是 64 位，因此求余操作的基数也变成了 64。

也就是说：`x<<42`等同于`x<<10`，`x>>42`等同于`x>>10`，`x >>>42`等同于`x >>> 10`。

**左移运算符代码示例**：

```
int i = -1;
System.out.println("初始数据：" + i);
System.out.println("初始数据对应的二进制字符串：" + Integer.toBinaryString(i));
i <<= 10;
System.out.println("左移 10 位后的数据 " + i);
System.out.println("左移 10 位后的数据对应的二进制字符 " + Integer.toBinaryString(i));
```

输出：

```
初始数据：-1
初始数据对应的二进制字符串：11111111111111111111111111111111
左移 10 位后的数据 -1024
左移 10 位后的数据对应的二进制字符 11111111111111111111110000000000
```

由于左移位数大于等于 32 位操作时，会先求余（%）后再进行左移操作，所以下面的代码左移 42 位相当于左移 10 位（42%32=10），输出结果和前面的代码一样。

```
int i = -1;
System.out.println("初始数据：" + i);
System.out.println("初始数据对应的二进制字符串：" + Integer.toBinaryString(i));
i <<= 42;
System.out.println("左移 10 位后的数据 " + i);
System.out.println("左移 10 位后的数据对应的二进制字符 " + Integer.toBinaryString(i));
```

右移运算符使用类似，篇幅问题，这里就不做演示了。

## 方法

### 什么是方法的返回值？方法有哪几种类型？

**方法的返回值** 是指我们获取到的某个方法体中的代码执行后产生的结果！（前提是该方法可能产生结果）。返回值的作用是接收出结果，使得它可以用于其他的操作！

我们可以按照方法的返回值和参数类型将方法分为下面这几种：

**1、无参数无返回值的方法**

```
public void f1() {
    //......
}
// 下面这个方法也没有返回值，虽然用到了 return
public void f(int a) {
    if (...) {
        // 表示结束方法的执行，下方的输出语句不会执行
        return;
    }
    System.out.println(a);
}
```

**2、有参数无返回值的方法**

```
public void f2(Parameter 1, ..., Parameter n) {
    //......
}
```

**3、有返回值无参数的方法**

```
public int f3() {
    //......
    return x;
}
```

**4、有返回值有参数的方法**

```
public int f4(int a, int b) {
    return a * b;
}
```

### 静态方法为什么不能调用非静态成员？

这个需要结合 JVM 的相关知识，主要原因如下：

1. 静态方法是属于类的，在类加载的时候就会分配内存，可以通过类名直接访问。而非静态成员属于实例对象，只有在对象实例化之后才存在，需要通过类的实例对象去访问。
2. 在类的非静态成员不存在的时候静态方法就已经存在了，此时调用在内存中还不存在的非静态成员，属于非法操作。

```
public class Example {
    // 定义一个字符型常量
    public static final char LETTER_A = 'A';

    // 定义一个字符串常量
    public static final String GREETING_MESSAGE = "Hello, world!";

    public static void main(String[] args) {
        // 输出字符型常量的值
        System.out.println("字符型常量的值为：" + LETTER_A);

        // 输出字符串常量的值
        System.out.println("字符串常量的值为：" + GREETING_MESSAGE);
    }
}
```

### 静态方法和实例方法有何不同？

**1、调用方式**

在外部调用静态方法时，可以使用 `类名。方法名` 的方式，也可以使用 `对象。方法名` 的方式，而实例方法只有后面这种方式。也就是说，**调用静态方法可以无需创建对象** 。

不过，需要注意的是一般不建议使用 `对象。方法名` 的方式来调用静态方法。这种方式非常容易造成混淆，静态方法不属于类的某个对象而是属于这个类。

因此，一般建议使用 `类名。方法名` 的方式来调用静态方法。

```
public class Person {
    public void method() {
      //......
    }

    public static void staicMethod(){
      //......
    }
    public static void main(String[] args) {
        Person person = new Person();
        // 调用实例方法
        person.method();
        // 调用静态方法
        Person.staicMethod()
    }
}
```

**2、访问类成员是否存在限制**

静态方法在访问本类的成员时，只允许访问静态成员（即静态成员变量和静态方法），不允许访问实例成员（即实例成员变量和实例方法），而实例方法不存在这个限制。

### 重载和重写有什么区别？

> 重载就是同样的一个方法能够根据输入数据的不同，做出不同的处理
>
> 重写就是当子类继承自父类的相同方法，输入数据一样，但要做出有别于父类的响应时，你就要覆盖父类方法

#### 重载

发生在同一个类中（或者父类和子类之间），方法名必须相同，参数类型不同、个数不同、顺序不同，方法返回值和访问修饰符可以不同。

《Java 核心技术》这本书是这样介绍重载的：

> 如果多个方法（比如 `StringBuilder` 的构造方法）有相同的名字、不同的参数， 便产生了重载。
>
> ```
> StringBuilder sb = new StringBuilder();
> StringBuilder sb2 = new StringBuilder("HelloWorld");
> ```
>
> 编译器必须挑选出具体执行哪个方法，它通过用各个方法给出的参数类型与特定方法调用所使用的值类型进行匹配来挑选出相应的方法。 如果编译器找不到匹配的参数， 就会产生编译时错误， 因为根本不存在匹配， 或者没有一个比其他的更好（这个过程被称为重载解析 (overloading resolution))。
>
> Java 允许重载任何方法， 而不只是构造器方法。

综上：重载就是同一个类中多个同名方法根据不同的传参来执行不同的逻辑处理。

#### 重写

重写发生在运行期，是子类对父类的允许访问的方法的实现过程进行重新编写。

1. 方法名、参数列表必须相同，子类方法返回值类型应比父类方法返回值类型更小或相等，抛出的异常范围小于等于父类，访问修饰符范围大于等于父类。
2. 如果父类方法访问修饰符为 `private/final/static` 则子类就不能重写该方法，但是被 `static` 修饰的方法能够被再次声明。
3. 构造方法无法被重写

#### 总结

综上：**重写就是子类对父类方法的重新改造，外部样子不能改变，内部逻辑可以改变。**

| 区别点     | 重载方法 | 重写方法                                                         |
| ---------- | -------- | ---------------------------------------------------------------- |
| 发生范围   | 同一个类 | 子类                                                             |
| 参数列表   | 必须修改 | 一定不能修改                                                     |
| 返回类型   | 可修改   | 子类方法返回值类型应比父类方法返回值类型更小或相等               |
| 异常       | 可修改   | 子类方法声明抛出的异常类应比父类方法声明抛出的异常类更小或相等； |
| 访问修饰符 | 可修改   | 一定不能做更严格的限制（可以降低限制）                           |
| 发生阶段   | 编译期   | 运行期                                                           |

**方法的重写要遵循“两同两小一大”**（以下内容摘录自《疯狂 Java 讲义》，[issue#892](https://github.com/Snailclimb/JavaGuide/issues/892) ）：

- “两同”即方法名相同、形参列表相同；
- “两小”指的是子类方法返回值类型应比父类方法返回值类型更小或相等，子类方法声明抛出的异常类应比父类方法声明抛出的异常类更小或相等；
- “一大”指的是子类方法的访问权限应比父类方法的访问权限更大或相等。

⭐️ 关于 **重写的返回值类型** 这里需要额外多说明一下，上面的表述不太清晰准确：如果方法的返回类型是 void 和基本数据类型，则返回值重写时不可修改。但是如果方法的返回值是引用类型，重写时是可以返回该引用类型的子类的。

```
public class Hero {
    public String name() {
        return "超级英雄";
    }
}
public class SuperMan extends Hero{
    @Override
    public String name() {
        return "超人";
    }
    public Hero hero() {
        return new Hero();
    }
}

public class SuperSuperMan extends SuperMan {
    public String name() {
        return "超级超级英雄";
    }

    @Override
    public SuperMan hero() {
        return new SuperMan();
    }
}
```

### 什么是可变长参数？

从 Java5 开始，Java 支持定义可变长参数，所谓可变长参数就是允许在调用方法时传入不定长度的参数。就比如下面这个方法就可以接受 0 个或者多个参数。

```
public static void method1(String... args) {
   //......
}
```

另外，可变参数只能作为函数的最后一个参数，但其前面可以有也可以没有任何其他参数。

```
public static void method2(String arg1, String... args) {
   //......
}
```

**遇到方法重载的情况怎么办呢？会优先匹配固定参数还是可变参数的方法呢？**

答案是会优先匹配固定参数的方法，因为固定参数的方法匹配度更高。

我们通过下面这个例子来证明一下。

```
/**
 * 微信搜 JavaGuide 回复"面试突击"即可免费领取个人原创的 Java 面试手册
 *
 * @author Guide 哥
 * @date 2021/12/13 16:52
 **/
public class VariableLengthArgument {

    public static void printVariable(String... args) {
        for (String s : args) {
            System.out.println(s);
        }
    }

    public static void printVariable(String arg1, String arg2) {
        System.out.println(arg1 + arg2);
    }

    public static void main(String[] args) {
        printVariable("a", "b");
        printVariable("a", "b", "c", "d");
    }
}
```

输出：

```
ab
a
b
c
d
```

另外，Java 的可变参数编译后实际会被转换成一个数组，我们看编译后生成的 `class`文件就可以看出来了。

```
public class VariableLengthArgument {

    public static void printVariable(String... args) {
        String[] var1 = args;
        int var2 = args.length;

        for(int var3 = 0; var3 < var2; ++var3) {
            String s = var1[var3];
            System.out.println(s);
        }

    }
    // ......
}
```

## 异常

![](https://cdn.javarush.com/images/article/2e4a84d4-3d29-41a2-b6f9-32ae87e9ee96/1024.webp)

### Exception 和 Error 有什么区别？

在 Java 中，所有的异常都有一个共同的祖先 `java.lang` 包中的 `Throwable` 类。`Throwable` 类有两个重要的子类：

- **`Exception`** - 程序本身可以处理的异常，可以通过 `catch` 来进行捕获。`Exception` 又分为**检查**（checked）异常和**非检查**（unchecked）异常，检查异常在源代码里必须显式地进行捕获处理，这是编译期检查的一部分。
- **`Error`** - `Error` 属于程序无法处理的错误。例如 Java 虚拟机运行错误（`Virtual MachineError`）、虚拟机内存不够错误（`OutOfMemoryError`）、类定义错误（`NoClassDefFoundError`）等 。这些异常发生时，Java 虚拟机（JVM）一般会选择线程终止。

### Checked Exception 和 Unchecked Exception 有什么区别？

**Checked Exception** 即 受检查异常 ，Java 代码在编译过程中，如果受检查异常没有被 `catch`或者`throws` 关键字处理的话，就没办法通过编译。

除了`RuntimeException`及其子类以外，其他的`Exception`类及其子类都属于受检查异常 。常见的受检查异常有：IO 相关的异常、`ClassNotFoundException`、`SQLException`...。

**Unchecked Exception** 即 **不受检查异常** ，Java 代码在编译过程中 ，我们即使不处理不受检查异常也可以正常通过编译。

`RuntimeException` 及其子类都统称为非受检查异常，常见的有（建议记下来，日常开发中会经常用到）：

- `NullPointerException`（空指针错误）
- `IllegalArgumentException`（参数错误比如方法入参类型错误）
- `NumberFormatException`（字符串转换为数字格式错误，`IllegalArgumentException`的子类）
- `ArrayIndexOutOfBoundsException`（数组越界错误）
- `ClassCastException`（类型转换错误）
- `ArithmeticException`（算术错误）
- `SecurityException` （安全错误比如权限不够）
- `UnsupportedOperationException`（不支持的操作错误比如重复创建同一用户）
- ……

[![img](https://camo.githubusercontent.com/2179fd845ca1fc9c022437576fd996dfeddb7722d41b32aa3d799199a2490d81/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f62617369732f756e636865636b65642d657863657074696f6e2e706e67)](https://camo.githubusercontent.com/2179fd845ca1fc9c022437576fd996dfeddb7722d41b32aa3d799199a2490d81/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f62617369732f756e636865636b65642d657863657074696f6e2e706e67)

### Throwable 类常用方法有哪些？

- `String getMessage()`: 返回异常发生时的简要描述
- `String toString()`: 返回异常发生时的详细信息
- `String getLocalizedMessage()`: 返回异常对象的本地化信息。使用 `Throwable` 的子类覆盖这个方法，可以生成本地化信息。如果子类没有覆盖该方法，则该方法返回的信息与 `getMessage()`返回的结果相同
- `void printStackTrace()`: 在控制台上打印 `Throwable` 对象封装的异常信息

### try-catch-finally 如何使用？

- `try`块：用于捕获异常。其后可接零个或多个 `catch` 块，如果没有 `catch` 块，则必须跟一个 `finally` 块。
- `catch`块：用于处理 try 捕获到的异常。
- `finally` 块：无论是否捕获或处理异常，`finally` 块里的语句都会被执行。当在 `try` 块或 `catch` 块中遇到 `return` 语句时，`finally` 语句块将在方法返回之前被执行。

代码示例：

```
try {
    System.out.println("Try to do something");
    throw new RuntimeException("RuntimeException");
} catch (Exception e) {
    System.out.println("Catch Exception -> " + e.getMessage());
} finally {
    System.out.println("Finally");
}
```

输出：

```
Try to do something
Catch Exception -> RuntimeException
Finally
```

**注意：不要在 finally 语句块中使用 return!** 当 try 语句和 finally 语句中都有 return 语句时，try 语句块中的 return 语句会被忽略。这是因为 try 语句中的 return 返回值会先被暂存在一个本地变量中，当执行到 finally 语句中的 return 之后，这个本地变量的值就变为了 finally 语句中的 return 返回值。

[jvm 官方文档](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-4.html#jvms-4.10.2.5) 中有明确提到：

> If the `try` clause executes a _return_, the compiled code does the following:
>
> 1. Saves the return value (if any) in a local variable.
> 2. Executes a _jsr_ to the code for the `finally` clause.
> 3. Upon return from the `finally` clause, returns the value saved in the local variable.

代码示例：

```
public static void main(String[] args) {
    System.out.println(f(2));
}

public static int f(int value) {
    try {
        return value * value;
    } finally {
        if (value == 2) {
            return 0;
        }
    }
}
```

输出：

```
0
```

### finally 中的代码一定会执行吗？

不一定的！在某些情况下，finally 中的代码不会被执行。

就比如说 finally 之前虚拟机被终止运行的话，finally 中的代码就不会被执行。

```
try {
    System.out.println("Try to do something");
    throw new RuntimeException("RuntimeException");
} catch (Exception e) {
    System.out.println("Catch Exception -> " + e.getMessage());
    // 终止当前正在运行的 Java 虚拟机
    System.exit(1);
} finally {
    System.out.println("Finally");
}
```

输出：

```
Try to do something
Catch Exception -> RuntimeException
```

另外，在以下 2 种特殊情况下，`finally` 块的代码也不会被执行：

1. 程序所在的线程死亡。
2. 关闭 CPU。

相关 issue：[#190](https://github.com/Snailclimb/JavaGuide/issues/190)。

🧗🏻 进阶一下：从字节码角度分析`try catch finally`这个语法糖背后的实现原理。

### 如何使用 `try-with-resources` 代替`try-catch-finally`？

1. **适用范围（资源的定义）：** 任何实现 `java.lang.AutoCloseable`或者 `java.io.Closeable` 的对象
2. **关闭资源和 finally 块的执行顺序：** 在 `try-with-resources` 语句中，任何 catch 或 finally 块在声明的资源关闭后运行

《Effective Java》中明确指出：

> 面对必须要关闭的资源，我们总是应该优先使用 `try-with-resources` 而不是`try-finally`。随之产生的代码更简短，更清晰，产生的异常对我们也更有用。`try-with-resources`语句让我们更容易编写必须要关闭的资源的代码，若采用`try-finally`则几乎做不到这点。

Java 中类似于`InputStream`、`OutputStream`、`Scanner`、`PrintWriter`等的资源都需要我们调用`close()`方法来手动关闭，一般情况下我们都是通过`try-catch-finally`语句来实现这个需求，如下：

```
//读取文本文件的内容
Scanner scanner = null;
try {
    scanner = new Scanner(new File("D://read.txt"));
    while (scanner.hasNext()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException e) {
    e.printStackTrace();
} finally {
    if (scanner != null) {
        scanner.close();
    }
}
```

使用 Java 7 之后的 `try-with-resources` 语句改造上面的代码：

```
try (Scanner scanner = new Scanner(new File("test.txt"))) {
    while (scanner.hasNext()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException fnfe) {
    fnfe.printStackTrace();
}
```

当然多个资源需要关闭的时候，使用 `try-with-resources` 实现起来也非常简单，如果你还是用`try-catch-finally`可能会带来很多问题。

通过使用分号分隔，可以在`try-with-resources`块中声明多个资源。

```
try (BufferedInputStream bin = new BufferedInputStream(new FileInputStream(new File("test.txt")));
     BufferedOutputStream bout = new BufferedOutputStream(new FileOutputStream(new File("out.txt")))) {
    int b;
    while ((b = bin.read()) != -1) {
        bout.write(b);
    }
}
catch (IOException e) {
    e.printStackTrace();
}
```

### NoClassDefFoundError 和 ClassNotFoundException 有什么区别

`NoClassDefFoundError`是一个 Error，而 `ClassNOtFoundException` 是一个 Exception。

`ClassNotFoundException` 产生的原因：

- 使用 `Class.forName`、`ClassLoader.loadClass`、`ClassLOader.findSystemClass` 方法动态加载类，如果这个类没有被找到，那么就会在运行时抛出 `ClassNotFoundException` 异常；
- 当一个类已经被某个类加载器加载到内存中了，此时另一个类加载器又尝试着动态地从同一个包中加载这个类。

`NoClassDefFoundError` 产生的原因：当 JVM 或 `ClassLoader` 试图加载类，却找不到类的定义时（编译时存在，运行时找不到），抛出异常。

### 异常使用有哪些需要注意的地方？

- 不要把异常定义为静态变量，因为这样会导致异常栈信息错乱。每次手动抛出异常，我们都需要手动 new 一个异常对象抛出。
- 抛出的异常信息一定要有意义。
- 建议抛出更加具体的异常比如字符串转换为数字格式错误的时候应该抛出`NumberFormatException`而不是其父类`IllegalArgumentException`。
- 避免重复记录日志：如果在捕获异常的地方已经记录了足够的信息（包括异常类型、错误信息和堆栈跟踪等），那么在业务代码中再次抛出这个异常时，就不应该再次记录相同的错误信息。重复记录日志会使得日志文件膨胀，并且可能会掩盖问题的实际原因，使得问题更难以追踪和解决。
- ……

## 参考资料

- **书籍**
  - [《Java 并发编程实战》](https://book.douban.com/subject/10484692/)
  - [《Java 并发编程的艺术》](https://book.douban.com/subject/26591326/)
  - [《深入理解 Java 虚拟机》](https://book.douban.com/subject/34907497/)
  - [极客时间教程 - Java 核心技术面试精讲](https://time.geekbang.org/column/intro/82)
