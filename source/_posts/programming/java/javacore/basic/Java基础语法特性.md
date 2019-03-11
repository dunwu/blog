---
title: Java 基础语法特性
categories: ['programming', 'java', 'javacore', 'basic']
tags: ['programming', 'java', 'javacore', 'basic']
date: 2019-03-10 22:28
---

# Java 基础语法特性

## 基本数据类型

（1）Java 中的数据类型有两类：

- 值类型（`byte`、`short`、`int`、`long`、`float`、`double`、`char`、`boolean`）
- 引用类型（除值类型以外，都是引用类型，包括 `String`、数组）

（2）Java 中，数据类型转换有两种方式：

- 自动换行
- 强制转换

强制转换使用括号 `()` 。

基础数据类型可以自动转换，转换原则如下：

- 由小数据转换为大数据
- 转换前后的数据类型要兼容
- 整型类型和浮点型进行计算后，结果会转为浮点类型

（3）包装类有如下种类：

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

（4）什么是装箱、拆箱

- **`装箱`（boxing）是将值类型转换为引用类型。**例如：`int` 转 `Integer`
  - 装箱过程是通过调用包装类的 `valueOf` 方法实现的。
- **`拆箱`（unboxing）是将引用类型转换为值类型。**例如：`Integer` 转 `int`
  - 拆箱过程是通过调用包装类的 `xxxValue` 方法实现的。（xxx 代表对应的基本数据类型）。

（5）装箱、拆箱的应用场景

- 含类型为 `Object` 参数的方法
- 非泛型的容器
- 当 `==` 运算符的两个操作，一个操作数是包装类，另一个操作数是表达式（即包含算术运算）则比较的是数值（即会触发自动拆箱的过程）。

（6）装箱、拆箱的应用注意点

- 装箱操作会创建对象，频繁的装箱操作会造成不必要的内存消耗，影响性能。所以**应该尽量避免装箱。**
- 基础数据类型的比较操作使用 `==`，包装类的比较操作使用 `equals` 方法。

> :point_right: 扩展阅读：[深入理解 Java 基本数据类型](深入理解Java基本数据类型.md)

## 异常

（1）**`Throwable` 是 Java 语言中所有错误（`Error`）和异常（`Exception`）的超类。**

（2）`Error` 是 `Throwable` 的一个子类。**`Error` 表示合理的应用程序不应该尝试捕获的严重问题。**大多数此类错误都是异常情况。**编译器不会检查 `Error`。**

（3）`Exception` 是 `Throwable` 的一个子类。**`Exception` 表示合理的应用程序可能想要捕获的条件。编译器会检查 `Exception` 异常。**此类异常，要么通过 `throws` 进行声明抛出，要么通过 `try catch` 进行捕获处理，否则不能通过编译。

（4）`RuntimeException` 是 `Exception` 的一个子类。`RuntimeException` 是那些可能在 Java 虚拟机正常运行期间抛出的异常的超类。**编译器不会检查 `RuntimeException` 异常。**当程序中可能出现这类异常时，倘若既没有通过 `throws` 声明抛出它，也没有用 `try catch` 语句捕获它，程序还是会编译通过。

（5）**自定义一个异常类，只需要继承 `Exception` 或 `RuntimeException` 即可。**

（6）如果想在程序中明确地引发异常，则需要用到 `throw` 和 `throws` 。

（7）**使用 try 和 catch 关键字可以捕获异常。**

- `try` - **`try` 语句用于监听。将要被监听的代码(可能抛出异常的代码)放在 `try` 语句块之内，当 `try` 语句块内发生异常时，异常就被抛出。**
- `catch` - `catch` 语句包含要捕获异常类型的声明。当保护代码块中发生一个异常时，`try` 后面的 `catch` 块就会被检查。
- `finally` - **`finally` 语句块总是会被执行，无论是否出现异常。**`try catch` 语句后不一定非要`finally` 语句。`finally` 常用于这样的场景：由于`finally` 语句块总是会被执行，所以那些在 `try` 代码块中打开的，并且必须回收的物理资源(如数据库连接、网络连接和文件)，一般会放在`finally` 语句块中释放资源。

> :point_right: 扩展阅读：[深入理解 Java 异常](深入理解Java异常.md)
