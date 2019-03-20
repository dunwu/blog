---
title: Java 泛型
categories: ['programming', 'java', 'javacore', 'basic']
tags: ['programming', 'java', 'javacore', 'basic', 'generic']
date: 2018-06-02 20:51
---

# Java 泛型

> :notebook: 本文已归档到：「[blog](https://github.com/dunwu/blog)」

<!-- TOC depthFrom:2 depthTo:3 -->

- [泛型简介](#泛型简介)
- [泛型的应用](#泛型的应用)
    - [泛型类](#泛型类)
    - [泛型接口](#泛型接口)
    - [泛型方法](#泛型方法)
    - [泛型数组](#泛型数组)
- [类型擦除](#类型擦除)
    - [类型擦除的过程](#类型擦除的过程)
    - [擦除的问题](#擦除的问题)
    - [擦除补偿](#擦除补偿)
- [类型通配符](#类型通配符)
- [小结](#小结)
- [参考资料](#参考资料)

<!-- /TOC -->

## 泛型简介

一般的类和方法，只能使用具体的类型：要么是值类型，要么是引用类型。如果要编写可以应用于多种类型的代码，这种刻板的限制对代码的束缚就会很大。

试想，Java 容器可以存储任意引用类型，如果其内部实现是明确指定实际数据类型的话，代码根本没法写。那么，有人可能会说， Java 中，所有类都继承自 `Object` 类，那么把所有引用类型都当成 Object 去存储，取数据时强转换一下，是不是就可以了呢？实际上，Java 容器以前还真是这么做的。

但是，这么做是存在隐患的，让我们来看一个示例。

```java
public class NoGenericsDemo {
    public static void main(String[] args) {
        List list = new ArrayList<>();
        list.add("abc");
        list.add(18);
        list.add(new double[] {1.0, 2.0});
        Object obj1 = list.get(0);
        Object obj2 = list.get(1);
        Object obj3 = list.get(2);
        System.out.println("obj1 = [" + obj1 + "]");
        System.out.println("obj2 = [" + obj2 + "]");
        System.out.println("obj3 = [" + obj3 + "]");

        int num1 = (int)list.get(0);
        int num2 = (int)list.get(1);
        int num3 = (int)list.get(2);
        System.out.println("num1 = [" + num1 + "]");
        System.out.println("num2 = [" + num2 + "]");
        System.out.println("num3 = [" + num3 + "]");
    }
}
// Output:
// obj1 = [abc]
// obj2 = [18]
// obj3 = [[D@47089e5f]
// Exception in thread "main" java.lang.ClassCastException: java.lang.String cannot be cast to java.lang.Integer
// at io.github.dunwu.javacore.generics.NoGenericsDemo.main(NoGenericsDemo.java:23)
```

> 示例说明：
>
> 在上面的示例中，`List` 容器没有指定存储数据类型，这种情况下，可以向 `List` 添加任意类型数据，编译器不会做类型检查，而是默默的将所有数据都转为 `Object`。
>
> 假设，最初我们希望向 `List` 存储的是整形数据，假设，某个家伙不小心存入了其他数据类型。当你试图从容器中取整形数据时，由于 `List` 当成 `Object` 类型来存储，你不得不使用类型强制转换。在运行时，才会发现 `List` 中数据不存储一致的问题，这就为程序运行带来了很大的风险（无形伤害最为致命）。

为了解决容器中，参数类型安全问题，泛型应运而生。—— **JDK5 引入了泛型机制**。

那么，泛型带来了什么改变？

1. 泛型的意思是：**适用于各种各样的类型**。**泛型实现了参数化类型**的概念，使代码可以应用于多种类型。所谓**参数化类型**，就是说所操作的数据类型被指定为一个参数。注意：参数化类型只能代表引用型类型，不能代表值类型（像 int,double,char 的等）。
2. 泛型的另一个更加重要的作用就是：**泛型要求在声明时指定实际数据类型，编译器在编译时会对使用了泛型的类或方法做类型检查，从而保证类型安全（早发现，早治理，把隐患扼杀于摇篮）**。

泛型技术可以说是 Java 容器的基石，被大量使用。

## 泛型的应用

- 所有泛型声明都有一个类型参数声明部分（由尖括号 `<>` 分隔），该类型参数声明部分在方法返回类型之前。
- 每一个类型参数声明部分包含一个或多个类型参数，参数间用逗号隔开。一个泛型参数，也被称为一个类型变量，是用于指定一个泛型类型名称的标识符。
- 泛型类型不能声明为值类型。
- 泛型可应用于类、接口、方法、数组。

### 泛型类

泛型类的声明和非泛型类的声明类似，除了在类名后面添加了类型参数声明部分。

使用泛型类时，必须在创建对象的时候指定类型参数的值。

```java
public class Info<T> {
    private T value;

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }
}

public class GenericsClassDemo01 {
    public static void main(String[] args) {
        Info<Integer> info = new Info<>();
        info.setValue(10);
        System.out.println(info.getValue());

        Info<String> info2 = new Info<>();
        info2.setValue("xyz");
        System.out.println(info2.getValue());
    }
}
// Output:
// 10
// xyz
```

多个泛型类型示例：

```java
public class MyMap<K,V> {
    private K key;
    private V value;

    public MyMap(K key, V value) {
        this.key = key;
        this.value = value;
    }

    @Override
    public String toString() {
        return "MyMap{" + "key=" + key + ", value=" + value + '}';
    }
}

public class GenericsClassDemo02 {
    public static void main(String[] args) {
        MyMap<Integer, String> map = new MyMap<>(1, "one");
        System.out.println(map);
    }
}
// Output:
// MyMap{key=1, value=one}
```

不指定泛型类型示例：

```java
public static void main(String[] args) {
    Info info = new Info();
    info.setValue(10);
    System.out.println(info.getValue());
    info.setValue("abc");
    System.out.println(info.getValue());
}
```

> 示例说明：
>
> 上面的例子，不会产生编译错误，也能正常运行。但这不是一个好的做法，使用泛型时，应该尽量明确指定内部数据类型。

> 注意：
>
> 一个类的子类可以通过对象多态性为其父类实例化，但是在泛型操作中，**子类的泛型类型是无法使用泛型类型接收的**。
>
> 泛型中无法向上转型。
>
> ```java
> Info<String> info1 = new Info<>();
> Info<Object> info2 = info1; // 试图将 Info<String> 转为 Info<Object> 会报错
> ```

### 泛型接口

不仅可以在类上声明泛型，也可以在接口上声明泛型。

泛型接口有两种实现方式：

（1）实现接口的子类明确声明泛型类型

```java
public interface Content<T> {
    T text();
}

public class GenericsInterfaceDemo01 implements Content<Integer> {
    private int text;

    public GenericsInterfaceDemo01(int text) {
        this.text = text;
    }

    @Override
    public Integer text() { return text; }

    public static void main(String[] args) {
        GenericsInterfaceDemo01 demo = new GenericsInterfaceDemo01(10);
        System.out.print(demo.text());
    }
}
// Output:
// 10
```

（2）实现接口的子类不明确声明泛型类型

```java
public class GenericsInterfaceDemo02<T> implements Content<T> {
    private T text;

    public GenericsInterfaceDemo02(T text) {
        this.text = text;
    }

    @Override
    public T text() { return text; }

    public static void main(String[] args) {
        GenericsInterfaceDemo02<String> gen = new GenericsInterfaceDemo02<>("ABC");
        System.out.print(gen.text());
    }
}
// Output:
// ABC
```

### 泛型方法

是否拥有泛型方法，与其所在的类是否是泛型没有关系。

使用泛型方法的时候，通常不必指明参数类型，因为编译器会为我们找出具体的类型。这称为类型参数推断（type argument inference）。类型推断只对赋值操作有效，其他时候并不起作用。如果将一个泛型方法调用的结果作为参数，传递给另一个方法，这是编译器并不会执行推断。编译器会认为：调用泛型方法后，其返回值被赋给一个 Object 类型的变量。

类型参数能被用来声明返回值类型，并且能作为泛型方法得到的实际参数类型的占位符。

泛型方法体的声明和其他方法一样。

```java
public class GenericsMethodDemo01 {
    public static <T> void printClass(T obj) {
        System.out.println(obj.getClass().toString());
    }

    public static void main(String[] args) {
        printClass("abc");
        printClass(10);
    }
}
// Output:
// class java.lang.String
// class java.lang.Integer
```

> :bulb: 建议：尽量使用泛型方法，而不是将整个类泛型化。这样，有利于明确泛型化的范围。

#### 可变参数

泛型方法与可变参数列表能够很好地共存：

```java
public class GenericVarargsMethodDemo {
    public static <T> List<T> makeList(T... args) {
        List<T> result = new ArrayList<T>();
        Collections.addAll(result, args);
        return result;
    }

    public static void main(String[] args) {
        List<String> ls = makeList("A");
        System.out.println(ls);
        ls = makeList("A", "B", "C");
        System.out.println(ls);
    }
}
// Output:
// [A]
// [A, B, C]
```

### 泛型数组

使用泛型方法时，也可以传递或返回一个泛型数组。

```java
public class GenericArrayDemo {
    public static <T> void print(T[] array) {
        for (T item : array) {
            System.out.printf(item + "\t");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        // 放开注释会报错，泛型不支持值类型
        // int[] iArray = {1, 2, 3};
        // print(iArray);

        Integer[] iArray = {1, 2, 3, 4, 5};
        print(iArray);

        Character[] cArray = {'H', 'E', 'L', 'L', 'O'};
        print(cArray);
    }
}
// Output:
// 1   2  3  4  5
// H   E  L  L  O
```

## 类型擦除

先来看一个例子：

```java
public class ErasedTypeEquivalence {
    public static void main(String[] args) {
        Class c1 = new ArrayList<String>().getClass();
        Class c2 = new ArrayList<Integer>().getClass();
        System.out.println(c1 == c2);
    }
}
```

输出结果是 true。

这是因为：**Java 泛型是使用擦除来实现的，使用泛型时，任何具体的类型信息都被擦除了**。这意味着：`ArrayList<String>` 和 `ArrayList<Integer>` 在运行时，JVM 将它们视为同一类型。

在生成的 Java 字节代码中是不包含泛型中的类型信息的。使用泛型的时候加上的类型参数，会被编译器在编译的时候去掉。这个过程就称为类型擦除。 如在代码中定义的 `ArrayList<String>` 和 `ArrayList<Integer>` 类型，在编译之后都会变成 `ArrayList`。JVM 看到的只是 `ArrayList`，而由泛型附加的类型信息对 JVM 来说是不可见的。Java 编译器会在编译时尽可能的发现可能出错的地方，但是仍然无法避免在运行时刻出现类型转换异常的情况。

C++ 泛型的实现方式是基于模板机制，而 Java 泛型的实现方式是类型擦除，二者有很大的区别。Java 泛型的实现方式不太优雅，但这也是有苦衷的：这样做的目的是因为 Java 泛型是 JDK5 之后才被引入的，为了保持向下的兼容性，所以只能做类型擦除来兼容以前的非泛型代码。

### 类型擦除的过程

类型擦除的基本过程也比较简单，首先是找到用来替换类型参数的具体类。这个具体类一般是 `Object`。如果指定了类型参数的上界的话，则使用这个上界。把代码中的类型参数都替换成具体的类。同时去掉出现的类型声明，即去掉 `<>` 的内容。比如 `T get()` 方法声明就变成了 `Object get()` ；`List<String>` 就变成了 `List`。接下来就可能需要生成一些桥接方法（bridge method）。这是由于擦除了类型之后的类可能缺少某些必须的方法。

### 擦除的问题

擦除的代价是显著的。**泛型不能用于显式地引用运行时类型的操作之中，例如：转型、instanceof 操作和 new 表达式。因为所有关于参数的类型信息都丢失了**，无论如何，当你在编写泛型代码时，必须时刻提醒自己，你只是看起来好像拥有有关参数的类型信息而已。

表现形式如下：

- 泛型类并没有自己独有的 `Class` 类对象。比如并不存在 `List<String>.class` 或是 `List<Interger>.class`，而只有 `List.class`。
- 静态变量是被泛型类的所有实例所共享的。对于声明为 `MyClass<T>` 的类，访问其中的静态变量的方法仍然是 `MyClass.myStaticVar`。不管是通过 `new MyClass<String>` 还是 `new MyClass<Interger>` 创建的对象，都是共享一个静态变量。
- 泛型的类型参数不能用在 Java 异常处理的 catch 语句中。因为异常处理是由 JVM 在运行时刻来进行的。由于类型信息被擦除，JVM 是无法区分两个异常类型 `MyException<String>` 和 `MyException<Interger>` 的。对于 JVM 来说，它们都是 MyException 类型的。也就无法执行与异常对应的 catch 语句。

举例来说：

```java
class Foo<T> { T var; }
```

当创建 Foo 实例时：

```java
Foo<Cat> foo = new Foo<>();
```

虽然，看似是 Cat 替代了 T。但实际上，在运行时，Foo 中的 T 被视为的是 Object。

### 擦除补偿

边界使得你可以在用于泛型的参数类型上设置限制条件。

因为擦除移除了类型信息，所以，可以用无界泛型参数调用的方法只是那些可以用 Ojbect 调用的方法。如果能够将这个参数限制为某个类型子集，那么你就可以用这些类型子集来调用方法。为了执行这种限制，Java 泛型重用了 `extends` 关键字。

可以通过指定形如 `T extends` 的形式限定泛型类型的范围。

```java
public class GenericsExtendsDemo01 {
    static <T extends Comparable<T>> T max(T x, T y, T z) {
        T max = x; // 假设x是初始最大值
        if (y.compareTo(max) > 0) {
            max = y; //y 更大
        }
        if (z.compareTo(max) > 0) {
            max = z; // 现在 z 更大
        }
        return max; // 返回最大对象
    }

    public static void main(String[] args) {
        System.out.println(max(3, 4, 5));
        System.out.println(max(6.6, 8.8, 7.7));
        System.out.println(max("pear", "apple", "orange"));
    }
}
// Output:
// 5
// 8.8
// pear
```

## 类型通配符

类型通配符一般是使用?代替具体的类型参数。例如 `List<?>` 在逻辑上是 `List<String>` ，`List<Integer>` 等所有 `List<具体类型实参>` 的父类。

- 类型通配符上限通过形如 `List<? extends Number>` 来定义，如此定义就是通配符泛型值接受 Number 及其下层子类类型。如果想从一个数据类型里读数据，使用 `? extends` 通配符，但不能写。

```java
public class GenericsExtendsDemo02 {
    static class Fruit{}
    static class Apple extends GenericsSuperDemo01.Fruit {}
    static class Orange extends GenericsSuperDemo01.Fruit {}

    public static void main(String[] args) {
        List<? super Fruit> fruits = new ArrayList<>();
        fruits.add(new Apple()); // 编译会报错
        fruits.add(new Orange()); // 编译会报错
    }
}
```

- 类型通配符下限通过形如 `List<? super Number>` 来定义，表示类型只能接受 Number 及其三层父类类型，如 Objec 类型的实例。`<? super T>` 不影响往里写数据，但往外取只能放在 `Object` 对象里。

```java
public class GenericsSuperDemo01 {

    static class Fruit{}
    static class Apple extends Fruit{}
    static class Orange extends Fruit{}

    public static void main(String[] args) {
        List<? super Fruit> fruits = new ArrayList<>();
        fruits.add(new Apple());
        fruits.add(new Orange());
        Object apple = fruits.get(0);
        // Orange orange = fruits.get(1); // 编译会报错
    }
}
```

## 小结

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/1553097668159.png"/></div>

## 参考资料

- [Java 编程思想](https://book.douban.com/subject/2130190/)
- [JAVA 核心技术（卷 1）](https://book.douban.com/subject/3146174/)
- [Effective java](https://book.douban.com/subject/3360807/)
- [Java 泛型详解](https://juejin.im/post/584d36f161ff4b006cccdb82)
