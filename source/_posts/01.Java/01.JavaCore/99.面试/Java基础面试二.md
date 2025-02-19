---
title: Java 基础面试二
date: 2024-07-03 07:44:02
categories:
  - Java
  - JavaCore
  - 面试
tags:
  - Java
  - JavaSE
  - 面试
permalink: /pages/dd562d6e/
---

# Java 基础面试二

## 面向对象

### 面向对象和面向过程

**典型问题**

面向对象编程和面向过程编程有什么区别？

**知识点**

二者的主要区别在于解决问题的方式不同：

- 面向过程把解决问题的过程拆成一个个方法，通过一个个方法的执行解决问题。
- 面向对象会先抽象出对象，然后用对象执行方法的方式解决问题。

另外，面向对象开发的程序一般更易维护、易复用、易扩展。

### 类和对象

**典型问题**

（1）什么是对象？

（2）什么是类？

（3）对象实体与对象引用有何不同？

**知识点**

（1）**对象是用来描述客观事物的一个抽象**。一个对象由一组属性和对这组属性进行操作的一组服务组成。

（2）**类是具有相同属性和方法的一组对象的集合**，它为属于该类的所有对象提供了统一的抽象描述，其内部包括属性和方法两个主要部分。

（3）对象实体与对象引用的不同之处在于：

- new 创建对象实例（对象实例在堆内存中），对象引用指向对象实例（对象引用存放在栈内存中）
- 一个对象引用可以指向 0 个或 1 个对象（一根绳子可以不系气球，也可以系一个气球）；
- 一个对象可以有 n 个引用指向它（可以用 n 条绳子系住一个气球）。

### 构造方法

**典型问题**

（1）构造方法有什么用？

（2）构造方法有哪些特点？

（3）如果一个类没有声明构造方法，该程序能正确执行吗？

（4）构造方法能否可被重写（Override）？

**知识点**

（1）构造方法是一种特殊的方法，主要作用是完成对象的初始化工作。

（2）构造方法特点如下：

- 名字与类名相同。
- 没有返回值，但不能用 void 声明构造函数。
- 生成类的对象时自动执行，无需调用。

（3）如果一个类没有声明构造方法，也可以执行！因为一个类即使没有声明构造方法也会有默认的不带参数的构造方法。如果我们自己添加了类的构造方法（无论是否有参），Java 就不会添加默认的无参数的构造方法了。

（4）构造方法不能被重写（Override），但可以重载（Overload）。

### 接口和抽象类

**典型问题**

（1）什么是接口？接口有什么特性？

（2）什么是抽象类？抽象类有什么特性？

（3）接口和抽象类有什么相同点和不同点？

（4）类支持多继承吗？接口支持多继承吗？

**知识点**

（1）接口是对行为的抽象，它是抽象方法的集合，利用接口可以达到 API 定义和实现分离的目的。

接口的主要特性有：

- 接口不能实例化。
- 接口不能包含任何非常量成员，任何字段都隐式的被 `public static final` 修饰。
- 接口中没有非静态方法，也就是说要么是抽象方法，要么是静态方法。
- 从 Java8 开始，接口增加了 `default` 方法特性，可以定义方法的默认实现；Java 9 以后，甚至可以定义私有的 `default` 方法。

（2）抽象类是不能实例化的类，用 abstract 关键字修饰 class，其目的主要是代码重用。除了不能实例化，形式上和一般的 Java 类并没有太大区别，可以有一个或者多个抽象方法，也可以没有抽象方法。抽象类大多用于抽取相关 Java 类的共用方法实现或者是共同成员变量，然后通过继承的方式达到代码复用的目的。

（3）接口和抽象类有什么相同点和不同点？

Java 中的类可以实现多个接口。

（4）与 C++ 等语言不一样，Java 类不支持多继承。这意味着，Java 不能通过继承多个抽象类来重用逻辑。那么，如何来实现重用呢？Java 的解决方案是：接口支持多继承，准确的说，接口支持扩展多个接口，而接口也支持实现多个接口。

### 深拷贝和浅拷贝

**典型问题**

（1）什么是深拷贝？什么是浅拷贝？深拷贝和浅拷贝有什么区别？

（2）如何实现深拷贝？

**知识点**

（1）深拷贝和浅拷贝的区别：

- **浅拷贝** - 只拷贝栈内存中的数据，不拷贝堆内存中数据。
- **深拷贝** - 既拷贝栈内存中的数据，又拷贝堆内存中的数据。

（2）深拷贝的实现方式

- 构造方法
- 重写 `Cloneable` 接口的 `clone()` 方法
- Apache Commons Lang 序列化
- JSON 序列化

### 面向对象设计

**典型问题**

（1）面向对象三大特征是什么？

（2）面向对象的五大原则是什么？

**知识点**

（1）封装、继承和多态是面向对象编程的三大特征。

- **封装** - **封装**的目的是隐藏事务内部的实现细节，以便提高安全性和简化编程。封装提供了合理的边界，避免外部调用者接触到内部的细节。
- **继承** - **继承**是代码复用的基础机制。当多个类存在相同的属性（变量）和方法时，可以从这些类中**抽象出父类**，在父类中定义**相同的属性和方法**，所有的**子类不需要重新定义这些属性和方法**，只需要通过 extends 关键字来声明继承父类即可。
- **多态** - 你可能立即会想到重写（override）和重载（overload）、向上转型。简单说，重写是父子类中相同名字和参数的方法，不同的实现；重载则是相同名字的方法，但是不同的参数，本质上这些方法签名是不一样的。

（2）面向对象的五大原则也就是所谓的 S.O.L.I.D 原则：

- **单一职责原则（Single Responsibility）** - 类或者对象最好是只有单一职责，在程序设计中如果发现某个类承担着多种义务，可以考虑进行拆分。
- **开闭原则（Open-Close）** - 设计要对扩展开放，对修改关闭。换句话说，程序设计应保证平滑的扩展性，尽量避免因为新增同类功能而修改已有实现，这样可以少产出些回归（regression）问题。
- **里氏替换原则（Liskov Substitution）** - 这是面向对象的基本要素之一，进行继承关系抽象时，凡是可以用父类或者基类的地方，都可以用子类替换。
- **接口分离原则** - 我们在进行类和接口设计时，如果在一个接口里定义了太多方法，其子类很可能面临两难，就是只有部分方法对它是有意义的，这就破坏了程序的内聚性。- 对于这种情况，可以通过拆分成功能单一的多个接口，将行为进行解耦。在未来维护中，如果某个接口设计有变，不会对使用其他接口的子类构成影响。
- **依赖反转原则** - 实体应该依赖于抽象而不是实现。也就是说高层次模块，不应该依赖于低层次模块，而是应该基于抽象。实践这一原则是保证产品代码之间适当耦合度的法宝。

### 设计模式

**典型问题**

（1）你知道哪些设计模式？

（2）你知道哪些设计模式在 Java 源码中的应用案例？

（3）你知道哪些设计模式在主流框架中的应用案例？

**知识点**

（1）23 种经典设计模式分类如下：

- 创建型模式，是对对象创建过程的各种问题和解决方案的总结，包括各种工厂模式（Factory、Abstract Factory）、单例模式（Singleton）、构建器模式（Builder）、原型模式（ProtoType）。
- 结构型模式，是针对软件设计结构的总结，关注于类、对象继承、组合方式的实践经验。常见的结构型模式，包括桥接模式（Bridge）、适配器模式（Adapter）、装饰者模式（Decorator）、代理模式（Proxy）、组合模式（Composite）、外观模式（Facade）、享元模式（Flyweight）等。
- 行为型模式，是从类或对象之间交互、职责划分等角度总结的模式。比较常见的行为型模式有策略模式（Strategy）、解释器模式（Interpreter）、命令模式（Command）、观察者模式（Observer）、迭代器模式（Iterator）、模板方法模式（Template Method）、访问者模式（Visitor）。

（2）设计模式在 Java 源码中应用的经典案例：

InputStream 是一个抽象类，标准类库中提供了 FileInputStream、ByteArrayInputStream 等各种不同的子类，分别从不同角度对 InputStream 进行了功能扩展，这是典型的装饰器模式应用案例。

（3）设计模式在主流框架中应用的经典案例：

如 Spring 等如何在 API 设计中使用设计模式。你至少要有个大体的印象，如：

- [BeanFactory](https://github.com/spring-projects/spring-framework/blob/master/spring-beans/src/main/java/org/springframework/beans/factory/BeanFactory.java) 和 [ApplicationContext](https://github.com/spring-projects/spring-framework/blob/master/spring-context/src/main/java/org/springframework/context/ApplicationContext.java) 应用了工厂模式。
- 在 Bean 的创建中，Spring 也为不同 scope 定义的对象，提供了单例和原型等模式实现。
- Spring Aop 使用了代理模式、装饰器模式、适配器模式等。
- 各种事件监听器，是观察者模式的典型应用。
- 类似 JdbcTemplate 等则是应用了模板模式。

## Object

### Object 类的常见方法有哪些？

Object 类是一个特殊的类，是所有类的父类。它主要提供了以下 11 个方法：

```java
/**
 * native 方法，用于返回当前运行时对象的 Class 对象，使用了 final 关键字修饰，故不允许子类重写。
 */
public final native Class<?> getClass()
/**
 * native 方法，用于返回对象的哈希码，主要使用在哈希表中，比如 JDK 中的 HashMap。
 */
public native int hashCode()
/**
 * 用于比较 2 个对象的内存地址是否相等，String 类对该方法进行了重写以用于比较字符串的值是否相等。
 */
public boolean equals(Object obj)
/**
 * native 方法，用于创建并返回当前对象的一份拷贝。
 */
protected native Object clone() throws CloneNotSupportedException
/**
 * 返回类的名字实例的哈希码的 16 进制的字符串。建议 Object 所有的子类都重写这个方法。
 */
public String toString()
/**
 * native 方法，并且不能重写。唤醒一个在此对象监视器上等待的线程（监视器相当于就是锁的概念）。如果有多个线程在等待只会任意唤醒一个。
 */
public final native void notify()
/**
 * native 方法，并且不能重写。跟 notify 一样，唯一的区别就是会唤醒在此对象监视器上等待的所有线程，而不是一个线程。
 */
public final native void notifyAll()
/**
 * native 方法，并且不能重写。暂停线程的执行。注意：sleep 方法没有释放锁，而 wait 方法释放了锁 ，timeout 是等待时间。
 */
public final native void wait(long timeout) throws InterruptedException
/**
 * 多了 nanos 参数，这个参数表示额外时间（以纳秒为单位，范围是 0-999999）。 所以超时的时间还需要加上 nanos 纳秒。
 */
public final void wait(long timeout, int nanos) throws InterruptedException
/**
 * 跟之前的 2 个 wait 方法一样，只不过该方法一直等待，没有超时时间这个概念
 */
public final void wait() throws InterruptedException
/**
 * 实例被垃圾回收器回收的时候触发的操作
 */
protected void finalize() throws Throwable { }
```

### == 和 equals() 的区别

> 有`==`运算符了，为什么还需要 equals 啊？
>
> 说一说你对 java.lang.Object 对象中 hashCode 和 equals 方法的理解。在什么场景下需
> 要重新实现这两个方法。
>
> 有没有可能 2 个不相等的对象有相同的 hashcode

**`==`** 对于基本类型和引用类型的作用效果是不同的：

- 对于基本数据类型来说，`==` 比较的是值。
- 对于引用数据类型来说，`==` 比较的是对象的内存地址。

> 因为 Java 只有值传递，所以，对于 == 来说，不管是比较基本数据类型，还是引用数据类型的变量，其本质比较的都是值，只是引用类型变量存的值是对象的地址。

**`equals()`** 不能用于判断基本数据类型的变量，只能用来判断两个对象是否相等。`equals()`方法存在于`Object`类中，而`Object`类是所有类的直接或间接父类，因此所有的类都有`equals()`方法。

`Object` 类 `equals()` 方法：

```java
public boolean equals(Object obj) {
     return (this == obj);
}
```

`equals()` 方法存在两种使用情况：

- **类没有重写 `equals()`方法**：通过`equals()`比较该类的两个对象时，等价于通过“==”比较这两个对象，使用的默认是 `Object`类`equals()`方法。
- **类重写了 `equals()`方法**：一般我们都重写 `equals()`方法来比较两个对象中的属性是否相等；若它们的属性相等，则返回 true（即，认为这两个对象相等）。

举个例子（这里只是为了举例。实际上，你按照下面这种写法的话，像 IDEA 这种比较智能的 IDE 都会提示你将 `==` 换成 `equals()` ）：

```java
String a = new String("ab"); // a 为一个引用
String b = new String("ab"); // b 为另一个引用，对象的内容一样
String aa = "ab"; // 放在常量池中
String bb = "ab"; // 从常量池中查找
System.out.println(aa == bb);// true
System.out.println(a == b);// false
System.out.println(a.equals(b));// true
System.out.println(42 == 42.0);// true
```

`String` 中的 `equals` 方法是被重写过的，因为 `Object` 的 `equals` 方法是比较的对象的内存地址，而 `String` 的 `equals` 方法比较的是对象的值。

当创建 `String` 类型的对象时，虚拟机会在常量池中查找有没有已经存在的值和要创建的值相同的对象，如果有就把它赋给当前引用。如果没有就在常量池中重新创建一个 `String` 对象。

`String`类`equals()`方法：

```java
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String anotherString = (String)anObject;
        int n = value.length;
        if (n == anotherString.value.length) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;
            while (n-- != 0) {
                if (v1[i] != v2[i])
                    return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```

### hashCode() 有什么用？

`hashCode()` 的作用是获取哈希码（`int` 整数），也称为散列码。这个哈希码的作用是确定该对象在哈希表中的索引位置。

`hashCode()` 定义在 JDK 的 `Object` 类中，这就意味着 Java 中的任何类都包含有 `hashCode()` 函数。另外需要注意的是：`Object` 的 `hashCode()` 方法是本地方法，也就是用 C 语言或 C++ 实现的。

> ⚠️ 注意：该方法在 **Oracle OpenJDK8** 中默认是 "使用线程局部状态来实现 Marsaglia's xor-shift 随机数生成", 并不是 "地址" 或者 "地址转换而来", 不同 JDK/VM 可能不同在 **Oracle OpenJDK8** 中有六种生成方式 （其中第五种是返回地址）, 通过添加 VM 参数：-XX:hashCode=4 启用第五种。参考源码：
>
> - https://hg.openjdk.org/jdk8u/jdk8u/hotspot/file/87ee5ee27509/src/share/vm/runtime/globals.hpp（1127 行）
> - https://hg.openjdk.org/jdk8u/jdk8u/hotspot/file/87ee5ee27509/src/share/vm/runtime/synchronizer.cpp（537 行开始）

```java
public native int hashCode();
```

散列表存储的是键值对 (key-value)，它的特点是：**能根据“键”快速的检索出对应的“值”。这其中就利用到了散列码！（可以快速找到所需要的对象）**

### 为什么要有 hashCode？

我们以“`HashSet` 如何检查重复”为例子来说明为什么要有 `hashCode`？

下面这段内容摘自我的 Java 启蒙书《Head First Java》:

> 当你把对象加入 `HashSet` 时，`HashSet` 会先计算对象的 `hashCode` 值来判断对象加入的位置，同时也会与其他已经加入的对象的 `hashCode` 值作比较，如果没有相符的 `hashCode`，`HashSet` 会假设对象没有重复出现。但是如果发现有相同 `hashCode` 值的对象，这时会调用 `equals()` 方法来检查 `hashCode` 相等的对象是否真的相同。如果两者相同，`HashSet` 就不会让其加入操作成功。如果不同的话，就会重新散列到其他位置。这样我们就大大减少了 `equals` 的次数，相应就大大提高了执行速度。

其实， `hashCode()` 和 `equals()`都是用于比较两个对象是否相等。

**那为什么 JDK 还要同时提供这两个方法呢？**

这是因为在一些容器（比如 `HashMap`、`HashSet`）中，有了 `hashCode()` 之后，判断元素是否在对应容器中的效率会更高（参考添加元素进`HashSet`的过程）！

我们在前面也提到了添加元素进`HashSet`的过程，如果 `HashSet` 在对比的时候，同样的 `hashCode` 有多个对象，它会继续使用 `equals()` 来判断是否真的相同。也就是说 `hashCode` 帮助我们大大缩小了查找成本。

**那为什么不只提供 `hashCode()` 方法呢？**

这是因为两个对象的`hashCode` 值相等并不代表两个对象就相等。

**那为什么两个对象有相同的 `hashCode` 值，它们也不一定是相等的？**

因为 `hashCode()` 所使用的哈希算法也许刚好会让多个对象传回相同的哈希值。越糟糕的哈希算法越容易碰撞，但这也与数据值域分布的特性有关（所谓哈希碰撞也就是指的是不同的对象得到相同的 `hashCode` )。

总结下来就是：

- 如果两个对象的`hashCode` 值相等，那这两个对象不一定相等（哈希碰撞）。
- 如果两个对象的`hashCode` 值相等并且`equals()`方法也返回 `true`，我们才认为这两个对象相等。
- 如果两个对象的`hashCode` 值不相等，我们就可以直接认为这两个对象不相等。

相信大家看了我前面对 `hashCode()` 和 `equals()` 的介绍之后，下面这个问题已经难不倒你们了。

### 为什么重写 equals() 时必须重写 hashCode() 方法？

因为两个相等的对象的 `hashCode` 值必须是相等。也就是说如果 `equals` 方法判断两个对象是相等的，那这两个对象的 `hashCode` 值也要相等。

如果重写 `equals()` 时没有重写 `hashCode()` 方法的话就可能会导致 `equals` 方法判断是相等的两个对象，`hashCode` 值却不相等。

**思考**：重写 `equals()` 时没有重写 `hashCode()` 方法的话，使用 `HashMap` 可能会出现什么问题。

**总结**：

- `equals` 方法判断两个对象是相等的，那这两个对象的 `hashCode` 值也要相等。
- 两个对象有相同的 `hashCode` 值，他们也不一定是相等的（哈希碰撞）。

更多关于 `hashCode()` 和 `equals()` 的内容可以查看：[Java hashCode() 和 equals() 的若干问题解答](https://www.cnblogs.com/skywang12345/p/3324958.html)

### finalize 有什么用？

首先，不推荐使用 finalize，在 Java 9 中，甚至明确将 Object.finalize() 标记为 deprecated！

finalize 的目的是保证对象在被垃圾收集前完成特定资源的回收。实际上，无法保证 finalize 什么时候执行，执行的是否符合预期。finalize 使用不当会影响性能，导致程序死锁、挂起等。

有什么机制可以替换 finalize 吗？

Java 目前在逐步使用 java.lang.ref.Cleaner 来替换掉原有的 finalize 实现。Cleaner 的实现利用了幻象引用（PhantomReference），这是一种常见的所谓 post-mortem 清理机制。吸取了 finalize 里的教训，每个 Cleaner 的操作都是独立的，它有自己的运行线程，所以可以避免意外死锁等问题。

## String

### String、StringBuffer、StringBuilder 的区别？

**可变性**

`String` 类中使用 `final` 关键字修饰字符数组来保存字符串，是典型的 Immutable 类。由于它的不可变性，类似拼接、裁剪字符串等动作，都会产生新的 String 对象。

`StringBuilder` 与 `StringBuffer` 都继承自 `AbstractStringBuilder` 类，在 `AbstractStringBuilder` 中也是使用字符数组保存字符串，不过没有使用 `final` 和 `private` 关键字修饰，最关键的是这个 `AbstractStringBuilder` 类还提供了很多修改字符串的方法比如 `append` 方法。

```
abstract class AbstractStringBuilder implements Appendable, CharSequence {
    char[] value;
    public AbstractStringBuilder append(String str) {
        if (str == null)
            return appendNull();
        int len = str.length();
        ensureCapacityInternal(count + len);
        str.getChars(0, len, value, count);
        count += len;
        return this;
    }
    //...
}
```

**线程安全性**

`String` 中的对象是不可变的，也就可以理解为常量，线程安全。`AbstractStringBuilder` 是 `StringBuilder` 与 `StringBuffer` 的公共父类，定义了一些字符串的基本操作，如 `expandCapacity`、`append`、`insert`、`indexOf` 等公共方法。`StringBuffer` 对方法加了同步锁或者对调用的方法加了同步锁，所以是线程安全的。`StringBuilder` 并没有对方法进行加同步锁，所以是非线程安全的。

**性能**

每次对 `String` 类型进行改变的时候，都会生成一个新的 `String` 对象，然后将指针指向新的 `String` 对象。`StringBuffer` 每次都会对 `StringBuffer` 对象本身进行操作，而不是生成新的对象并改变对象引用。相同情况下使用 `StringBuilder` 相比使用 `StringBuffer` 仅能获得 10%~15% 左右的性能提升，但却要冒多线程不安全的风险。

**对于三者使用的总结：**

- 操作少量的数据：适用 `String`
- 单线程操作字符串缓冲区下操作大量数据：适用 `StringBuilder`
- 多线程操作字符串缓冲区下操作大量数据：适用 `StringBuffer`

### String 为什么是不可变的？

`String` 类中使用 `final` 关键字修饰字符数组来保存字符串，是典型的 Immutable 类。由于它的不可变性，类似拼接、裁剪字符串等动作，都会产生新的 String 对象。

```
public final class String implements java.io.Serializable, Comparable<String>, CharSequence {
    private final char value[];
  //...
}
```

> 🐛 修正：我们知道被 `final` 关键字修饰的类不能被继承，修饰的方法不能被重写，修饰的变量是基本数据类型则值不能改变，修饰的变量是引用类型则不能再指向其他对象。因此，`final` 关键字修饰的数组保存字符串并不是 `String` 不可变的根本原因，因为这个数组保存的字符串是可变的（`final` 修饰引用类型变量的情况）。
>
> `String` 真正不可变有下面几点原因：
>
> 1. 保存字符串的数组被 `final` 修饰且为私有的，并且`String` 类没有提供/暴露修改这个字符串的方法。
> 2. `String` 类被 `final` 修饰导致其不能被继承，进而避免了子类破坏 `String` 不可变。
>
> 相关阅读：[如何理解 String 类型值的不可变？ - 知乎提问](https://www.zhihu.com/question/20618891/answer/114125846)
>
> 补充（来自 [issue 675](https://github.com/Snailclimb/JavaGuide/issues/675)）：在 Java 9 之后，`String`、`StringBuilder` 与 `StringBuffer` 的实现改用 `byte` 数组存储字符串。
>
> ```
> public final class String implements java.io.Serializable,Comparable<String>, CharSequence {
>     // @Stable 注解表示变量最多被修改一次，称为“稳定的”。
>     @Stable
>     private final byte[] value;
> }
>
> abstract class AbstractStringBuilder implements Appendable, CharSequence {
>     byte[] value;
>
> }
> ```
>
> **Java 9 为何要将 `String` 的底层实现由 `char[]` 改成了 `byte[]` ?**
>
> 新版的 String 其实支持两个编码方案：Latin-1 和 UTF-16。如果字符串中包含的汉字没有超过 Latin-1 可表示范围内的字符，那就会使用 Latin-1 作为编码方案。Latin-1 编码方案下，`byte` 占一个字节 (8 位），`char` 占用 2 个字节（16），`byte` 相较 `char` 节省一半的内存空间。
>
> JDK 官方就说了绝大部分字符串对象只包含 Latin-1 可表示的字符。
>
> [![img](https://camo.githubusercontent.com/3c9b36a376eac3142dedec2c23fe59867890bafa9edb26450c56cba6c0d40c4a/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a646b392d737472696e672d6c6174696e312e706e67)](https://camo.githubusercontent.com/3c9b36a376eac3142dedec2c23fe59867890bafa9edb26450c56cba6c0d40c4a/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a646b392d737472696e672d6c6174696e312e706e67)
>
> 如果字符串中包含的汉字超过 Latin-1 可表示范围内的字符，`byte` 和 `char` 所占用的空间是一样的。
>
> 这是官方的介绍：https://openjdk.java.net/jeps/254 。

### 字符串拼接用“+” 还是 StringBuilder?

Java 语言本身并不支持运算符重载，“+”和“+=”是专门为 String 类重载过的运算符，也是 Java 中仅有的两个重载过的运算符。

```
String str1 = "he";
String str2 = "llo";
String str3 = "world";
String str4 = str1 + str2 + str3;
```

上面的代码对应的字节码如下：

[![img](https://camo.githubusercontent.com/605d21c93ba1ea24d5c41fef5a6df008bc7b086def34ed4446aa854fc8a7ea9f/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f696d6167652d32303232303432323136313633373932392e706e67)](https://camo.githubusercontent.com/605d21c93ba1ea24d5c41fef5a6df008bc7b086def34ed4446aa854fc8a7ea9f/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f696d6167652d32303232303432323136313633373932392e706e67)

可以看出，字符串对象通过“+”的字符串拼接方式，实际上是通过 `StringBuilder` 调用 `append()` 方法实现的，拼接完成之后调用 `toString()` 得到一个 `String` 对象 。

不过，在循环内使用“+”进行字符串的拼接的话，存在比较明显的缺陷：**编译器不会创建单个 `StringBuilder` 以复用，会导致创建过多的 `StringBuilder` 对象**。

```
String[] arr = {"he", "llo", "world"};
String s = "";
for (int i = 0; i < arr.length; i++) {
    s += arr[i];
}
System.out.println(s);
```

`StringBuilder` 对象是在循环内部被创建的，这意味着每循环一次就会创建一个 `StringBuilder` 对象。

[![img](https://camo.githubusercontent.com/04e5f5d98c90ab0482c6d5a76c1fa171f85cdc96b4ff1e543ff4e87e6a37cd10/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f696d6167652d32303232303432323136313332303832332e706e67)](https://camo.githubusercontent.com/04e5f5d98c90ab0482c6d5a76c1fa171f85cdc96b4ff1e543ff4e87e6a37cd10/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f696d6167652d32303232303432323136313332303832332e706e67)

如果直接使用 `StringBuilder` 对象进行字符串拼接的话，就不会存在这个问题了。

```java
String[] arr = {"he", "llo", "world"};
StringBuilder s = new StringBuilder();
for (String value : arr) {
    s.append(value);
}
System.out.println(s);
```

[![img](https://camo.githubusercontent.com/4459c04a5826598d584e7b08713a6c58cdbd1dc437e5d2776d7fa7852e7c36d7/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f696d6167652d32303232303432323136323332373431352e706e67)](https://camo.githubusercontent.com/4459c04a5826598d584e7b08713a6c58cdbd1dc437e5d2776d7fa7852e7c36d7/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6a6176612f696d6167652d32303232303432323136323332373431352e706e67)

如果你使用 IDEA 的话，IDEA 自带的代码检查机制也会提示你修改代码。

不过，使用 “+” 进行字符串拼接会产生大量的临时对象的问题在 JDK9 中得到了解决。在 JDK9 当中，字符串相加 “+” 改为了用动态方法 `makeConcatWithConstants()` 来实现，而不是大量的 `StringBuilder` 了。这个改进是 JDK9 的 [JEP 280](https://openjdk.org/jeps/280) 提出的，这也意味着 JDK 9 之后，你可以放心使用“+” 进行字符串拼接了。关于这部分改进的详细介绍，推荐阅读这篇文章：还在无脑用 [StringBuilder？来重温一下字符串拼接吧](https://juejin.cn/post/7182872058743750715) 。

### String#equals() 和 Object#equals() 有何区别？

`String` 中的 `equals` 方法是被重写过的，比较的是 String 字符串的值是否相等。 `Object` 的 `equals` 方法是比较的对象的内存地址。

### 字符串常量池的作用了解吗？

**字符串常量池** 是 JVM 为了提升性能和减少内存消耗针对字符串（String 类）专门开辟的一块区域，主要目的是为了避免字符串的重复创建。

```java
// 在堆中创建字符串对象”ab“
// 将字符串对象”ab“的引用保存在字符串常量池中
String aa = "ab";
// 直接返回字符串常量池中字符串对象”ab“的引用
String bb = "ab";
System.out.println(aa==bb);// true
```

更多关于字符串常量池的介绍可以看一下 [Java 内存区域详解](https://javaguide.cn/java/jvm/memory-area.html) 这篇文章。

### String s1 = new String("abc"); 这句话创建了几个字符串对象？

会创建 1 或 2 个字符串对象。

1、如果字符串常量池中不存在字符串对象“abc”的引用，那么它会在堆上创建两个字符串对象，其中一个字符串对象的引用会被保存在字符串常量池中。

示例代码（JDK 1.8）：

```java
String s1 = new String("abc");
```

对应的字节码：

[![img](https://camo.githubusercontent.com/085d4875332e2a5176d46e9cf6b0f08a2d1f0ddac26ef2ec7bc1a1cbdb221e34/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6f70656e2d736f757263652d70726f6a6563742f696d6167652d32303232303431333137353830393935392e706e67)](https://camo.githubusercontent.com/085d4875332e2a5176d46e9cf6b0f08a2d1f0ddac26ef2ec7bc1a1cbdb221e34/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6f70656e2d736f757263652d70726f6a6563742f696d6167652d32303232303431333137353830393935392e706e67)

`ldc` 命令用于判断字符串常量池中是否保存了对应的字符串对象的引用，如果保存了的话直接返回，如果没有保存的话，会在堆中创建对应的字符串对象并将该字符串对象的引用保存到字符串常量池中。

2、如果字符串常量池中已存在字符串对象“abc”的引用，则只会在堆中创建 1 个字符串对象“abc”。

示例代码（JDK 1.8）：

```java
// 字符串常量池中已存在字符串对象“abc”的引用
String s1 = "abc";
// 下面这段代码只会在堆中创建 1 个字符串对象“abc”
String s2 = new String("abc");
```

对应的字节码：

[![img](https://camo.githubusercontent.com/241ade2583eac806483db5ae9ac0b246e85048cc67699b2c00e5fa97d16ec008/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6f70656e2d736f757263652d70726f6a6563742f696d6167652d32303232303431333138303032313037322e706e67)](https://camo.githubusercontent.com/241ade2583eac806483db5ae9ac0b246e85048cc67699b2c00e5fa97d16ec008/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f6f70656e2d736f757263652d70726f6a6563742f696d6167652d32303232303431333138303032313037322e706e67)

这里就不对上面的字节码进行详细注释了，7 这个位置的 `ldc` 命令不会在堆中创建新的字符串对象“abc”，这是因为 0 这个位置已经执行了一次 `ldc` 命令，已经在堆中创建过一次字符串对象“abc”了。7 这个位置执行 `ldc` 命令会直接返回字符串常量池中字符串对象“abc”对应的引用。

### String#intern 方法有什么作用？

String 在 Java 6 以后提供了 intern() 方法，目的是提示 JVM 把相应字符串缓存起来，以备重复使用。在我们创建字符串对象并调用 intern() 方法的时候，如果已经有缓存的字符串，就会返回缓存里的实例，否则将其缓存起来。

被缓存的字符串是存在永久代（PermGen）里的，而这个空间是很有限的，也基本不会被 FullGC 之外的垃圾收集照顾到。所以，如果使用不当，就可能产生 OOM。

在后续版本中，这个缓存被放置在堆中，这样就极大避免了永久代占满的问题，甚至永久代在 JDK 8 中被 MetaSpace（元数据区）替代了。而且，默认缓存大小也在不断地扩大中，从最初的 1009，到 7u40 以后被修改为 60013。

### String 类型的变量和常量做“+”运算时发生了什么？

先来看字符串不加 `final` 关键字拼接的情况（JDK1.8）：

```java
String str1 = "str";
String str2 = "ing";
String str3 = "str" + "ing";
String str4 = str1 + str2;
String str5 = "string";
System.out.println(str3 == str4);//false
System.out.println(str3 == str5);//true
System.out.println(str4 == str5);//false
```

> **注意**：比较 String 字符串的值是否相等，可以使用 `equals()` 方法。 `String` 中的 `equals` 方法是被重写过的。 `Object` 的 `equals` 方法是比较的对象的内存地址，而 `String` 的 `equals` 方法比较的是字符串的值是否相等。如果你使用 `==` 比较两个字符串是否相等的话，IDEA 还是提示你使用 `equals()` 方法替换。

[![img](https://camo.githubusercontent.com/b94bf51c6a148c3b1e87cc6ddc5a150d5fb40b7838ae21754034cca5b100d569/68747470733a2f2f6f73732e6a61766167756964652e636e2f6a6176612d67756964652d626c6f672f696d6167652d32303231303831373132333235323434312e706e67)](https://camo.githubusercontent.com/b94bf51c6a148c3b1e87cc6ddc5a150d5fb40b7838ae21754034cca5b100d569/68747470733a2f2f6f73732e6a61766167756964652e636e2f6a6176612d67756964652d626c6f672f696d6167652d32303231303831373132333235323434312e706e67)

**对于编译期可以确定值的字符串，也就是常量字符串 ，jvm 会将其存入字符串常量池。并且，字符串常量拼接得到的字符串常量在编译阶段就已经被存放字符串常量池，这个得益于编译器的优化。**

在编译过程中，Javac 编译器（下文中统称为编译器）会进行一个叫做 **常量折叠 (Constant Folding)** 的代码优化。《深入理解 Java 虚拟机》中是也有介绍到：

[![img](https://camo.githubusercontent.com/0c22c82bb7b2e76aa639af321b67774bb5a7bed3efb284d7d55aa8bc5337dd2c/68747470733a2f2f6f73732e6a61766167756964652e636e2f6a61766167756964652f696d6167652d32303231303831373134323731353339362e706e67)](https://camo.githubusercontent.com/0c22c82bb7b2e76aa639af321b67774bb5a7bed3efb284d7d55aa8bc5337dd2c/68747470733a2f2f6f73732e6a61766167756964652e636e2f6a61766167756964652f696d6167652d32303231303831373134323731353339362e706e67)

常量折叠会把常量表达式的值求出来作为常量嵌在最终生成的代码中，这是 Javac 编译器会对源代码做的极少量优化措施之一（代码优化几乎都在即时编译器中进行）。

对于 `String str3 = "str" + "ing";` 编译器会给你优化成 `String str3 = "string";` 。

并不是所有的常量都会进行折叠，只有编译器在程序编译期就可以确定值的常量才可以：

- 基本数据类型 ( `byte`、`boolean`、`short`、`char`、`int`、`float`、`long`、`double`) 以及字符串常量。
- `final` 修饰的基本数据类型和字符串变量
- 字符串通过 “+”拼接得到的字符串、基本数据类型之间算数运算（加减乘除）、基本数据类型的位运算（<<、>>、>>> ）

**引用的值在程序编译期是无法确定的，编译器无法对其进行优化。**

对象引用和“+”的字符串拼接方式，实际上是通过 `StringBuilder` 调用 `append()` 方法实现的，拼接完成之后调用 `toString()` 得到一个 `String` 对象 。

```java
String str4 = new StringBuilder().append(str1).append(str2).toString();
```

我们在平时写代码的时候，尽量避免多个字符串对象拼接，因为这样会重新创建对象。如果需要改变字符串的话，可以使用 `StringBuilder` 或者 `StringBuffer`。

不过，字符串使用 `final` 关键字声明之后，可以让编译器当做常量来处理。

示例代码：

```java
final String str1 = "str";
final String str2 = "ing";
// 下面两个表达式其实是等价的
String c = "str" + "ing";// 常量池中的对象
String d = str1 + str2; // 常量池中的对象
System.out.println(c == d);// true
```

被 `final` 关键字修饰之后的 `String` 会被编译器当做常量来处理，编译器在程序编译期就可以确定它的值，其效果就相当于访问常量。

如果 ，编译器在运行时才能知道其确切值的话，就无法对其优化。

示例代码（`str2` 在运行时才能确定其值）：

```java
final String str1 = "str";
final String str2 = getStr();
String c = "str" + "ing";// 常量池中的对象
String d = str1 + str2; // 在堆上创建的新的对象
System.out.println(c == d);// false
public static String getStr() {
      return "ing";
}
```