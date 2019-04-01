---
title: 深入理解 Java 注解
categories: ['java', 'javacore']
tags: ['java', 'javacore', 'basics', 'annotation']
date: 2017-08-22 10:30
---

# 深入理解 Java 注解

> 本文内容基于 JDK8。注解是 JDK5 引入的，后续 JDK 版本扩展了一些内容，本文中没有明确指明版本的注解都是 JDK5 就已经支持的注解。
>
> :notebook: 本文已归档到：「[blog](https://github.com/dunwu/blog)」
>
> :keyboard: 本文中的示例代码已归档到：「[javacore](https://github.com/dunwu/javacore/tree/master/codes/basics/src/main/java/io/github/dunwu/javacore/annotation)」

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [注解的形式](#注解的形式)
    - [什么是注解](#什么是注解)
    - [注解的作用](#注解的作用)
    - [注解的应用范围](#注解的应用范围)
- [内置注解](#内置注解)
    - [@Override](#override)
    - [@Deprecated](#deprecated)
    - [@SuppressWarnnings](#suppresswarnnings)
    - [@SafeVarargs](#safevarargs)
    - [@FunctionalInterface](#functionalinterface)
- [元注解](#元注解)
    - [@Retention](#retention)
    - [@Documented](#documented)
    - [@Target](#target)
    - [@Inherited](#inherited)
    - [@Repeatable](#repeatable)
- [自定义注解](#自定义注解)
    - [定义注解格式](#定义注解格式)
    - [注解参数的可支持数据类型](#注解参数的可支持数据类型)
    - [注解元素的默认值](#注解元素的默认值)
    - [注解处理器](#注解处理器)
- [自定义注解实战](#自定义注解实战)
    - [实现 `@NotNull`](#实现-notnull)
- [小结](#小结)
- [参考资料](#参考资料)

<!-- /TOC -->

## 简介

### 注解的形式

Java 中，注解是以 `@` 字符开始的修饰符。如下：

```java
@Override
void mySuperMethod() { ... }
```

注释可以包含命名或未命名的元素，并且这些元素有值。

```java
@Author(
   name = "Benjamin Franklin",
   date = "3/27/2003"
)
class MyClass() { ... }
```

如果只有一个名为 value 的元素，那么名称可以省略，如：

```java
@SuppressWarnings("unchecked")
void myMethod() { ... }
```

如果注解没有元素，则称为`标记注解`。如：`@Override`。

### 什么是注解

从本质上来说，**注解是一种标签，其实质上可以视为一种特殊的注释，如果没有解析它的代码，它并不比普通注释强。**

解析一个注解往往有两种形式：

- **编译期直接的扫描** - 编译器的扫描指的是编译器在对 java 代码编译字节码的过程中会检测到某个类或者方法被一些注解修饰，这时它就会对于这些注解进行某些处理。这种情况只适用于 JDK 内置的注解类。
- **运行期的反射** - 如果要自定义注解，Java 编译器无法识别并处理这个注解，它只能根据该注解的作用范围来选择是否编译进字节码文件。如果要处理注解，必须利用反射技术，识别该注解以及它所携带的信息，然后做相应的处理。

`java.lang.annotation.Annotation` 是一个接口，程序可以通过反射来获取指定程序元素的注解对象，然后通过注解对象来获取注解里面的元数据。

```java
public interface Annotation {
    boolean equals(Object obj);

    int hashCode();

    String toString();

    Class<? extends Annotation> annotationType();
}
```

### 注解的作用

注解有许多用途：

- 编译器信息 - 编译器可以使用注解来检测错误或抑制警告。
- 编译时和部署时的处理 - 软件工具可以处理注解信息以生成代码，XML 文件等。
- 运行时处理 - 可以在运行时检查某些注解。

作为 Java 程序员，多多少少都曾经历过被各种配置文件（xml、properties）支配的恐惧。过多的配置文件会使得项目难以维护。

基于这样的背景，注解应运而生。注解通过简单的标记，就可以省去大量的配置。但是注解也有缺点，因为它是侵入式的，所以它存在耦合度较高的问题。所谓，鱼与熊掌不可兼得，合理的使用注解还是非常有价值的。

### 注解的应用范围

注解可以应用于类、字段、方法和其他程序元素的声明。

JDK8 开始，注解的应用范围进一步扩大，以下是新的应用范围：

类实例初始化表达式：

```java
new @Interned MyObject();
```

类型转换：

```java
myString = (@NonNull String) str;
```

实现接口的声明：

```java
class UnmodifiableList<T> implements
    @Readonly List<@Readonly T> {}
```

抛出异常声明：

```java
void monitorTemperature()
    throws @Critical TemperatureException {}
```

## 内置注解

JDK 中内置了以下注解：

- `@Override`
- `@Deprecated`
- `@SuppressWarnnings`
- `@SafeVarargs`（JDK8 引入）
- `@FunctionalInterface`（JDK8 引入）

### @Override

**[`@Override`](https://docs.oracle.com/javase/8/docs/api/java/lang/Override.html) 用于表明被修饰方法覆写了父类的方法。**

如果试图使用 `@Override` 标记一个实际上并没有覆写父类的方法时，java 编译器会告警。

`@Override` 示例：

```java
public class OverrideAnnotationDemo {

    static class Person {
        public String getName() {
            return "getName";
        }
    }


    static class Man extends Person {
        @Override
        public String getName() {
            return "override getName";
        }

        /**
         *  放开下面的注释，编译时会告警
         */
       /*
        @Override
        public String getName2() {
            return "override getName2";
        }
        */
    }

    public static void main(String[] args) {
        Person per = new Man();
        System.out.println(per.getName());
    }
}
```

### @Deprecated

`@Deprecated` 源码：

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})
public @interface Deprecated {}
```

**`@Deprecated` 用于标明被修饰的类或类成员、类方法已经废弃、过时，不建议使用。**

`@Deprecated` 有一定的“延续性”：如果我们在代码中通过继承或者覆盖的方式使用了过时的类或类成员，即使子类或子方法没有标记为 `@Deprecated`，但编译器仍然会告警。

> 注意： `@Deprecated` 这个注解类型和 javadoc 中的 `@deprecated` 这个 tag 是有区别的：前者是 java 编译器识别的；而后者是被 javadoc 工具所识别用来生成文档（包含程序成员为什么已经过时、它应当如何被禁止或者替代的描述）。

`@Deprecated` 示例：

```java
public class DeprecatedAnnotationDemo {
    static class DeprecatedField {
        @Deprecated
        public static final String DEPRECATED_FIELD = "DeprecatedField";
    }


    static class DeprecatedMethod {
        @Deprecated
        public String print() {
            return "DeprecatedMethod";
        }
    }


    @Deprecated
    static class DeprecatedClass {
        public String print() {
            return "DeprecatedClass";
        }
    }

    public static void main(String[] args) {
        System.out.println(DeprecatedField.DEPRECATED_FIELD);

        DeprecatedMethod dm = new DeprecatedMethod();
        System.out.println(dm.print());


        DeprecatedClass dc = new DeprecatedClass();
        System.out.println(dc.print());
    }
}
//Output:
//DeprecatedField
//DeprecatedMethod
//DeprecatedClass
```

### @SuppressWarnnings

**[`@SuppressWarnings`](https://docs.oracle.com/javase/8/docs/api/java/lang/SuppressWarnings.html) 用于关闭对类、方法、成员编译时产生的特定警告。**

`@SuppressWarning` 不是一个标记注解。它有一个类型为 `String[]` 的数组成员，这个数组中存储的是要关闭的告警类型。对于 javac 编译器来讲，对 `-Xlint` 选项有效的警告名也同样对 `@SuppressWarings` 有效，同时编译器会忽略掉无法识别的警告名。

`@SuppressWarning` 示例：

```java
@SuppressWarnings({"rawtypes", "unchecked"})
public class SuppressWarningsAnnotationDemo {
    static class SuppressDemo<T> {
        private T value;

        public T getValue() {
            return this.value;
        }

        public void setValue(T var) {
            this.value = var;
        }
    }

    @SuppressWarnings({"deprecation"})
    public static void main(String[] args) {
        SuppressDemo d = new SuppressDemo();
        d.setValue("南京");
        System.out.println("地名：" + d.getValue());
    }
}
```

`@SuppressWarnings` 注解的常见参数值的简单说明：

| **Type**                 | **Descption**                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| all                      | to suppress all warnings                                                                 |
| boxing                   | to suppress warnings relative to boxing/unboxing operations                              |
| cast                     | to suppress warnings relative to cast operations                                         |
| dep-ann                  | to suppress warnings relative to deprecated annotation                                   |
| deprecation              | to suppress warnings relative to deprecation                                             |
| fallthrough              | to suppress warnings relative to missing breaks in switch statements                     |
| finally                  | to suppress warnings relative to finally block that don’t return                         |
| hiding                   | to suppress warnings relative to locals that hide variable                               |
| incomplete-switch        | to suppress warnings relative to missing entries in a switch statement (enum case)       |
| nls                      | to suppress warnings relative to non-nls string literals                                 |
| null                     | to suppress warnings relative to null analysis                                           |
| rawtypes                 | to suppress warnings relative to un-specific types when using generics on class params   |
| restriction              | to suppress warnings relative to usage of discouraged or forbidden references            |
| serial                   | to suppress warnings relative to missing serialVersionUID field for a serializable class |
| static-access            | to suppress warnings relative to incorrect static access                                 |
| synthetic-access         | to suppress warnings relative to unoptimized access from inner classes                   |
| unchecked                | to suppress warnings relative to unchecked operations                                    |
| unqualified-field-access | to suppress warnings relative to field access unqualified                                |
| unused                   | to suppress warnings relative to unused code                                             |

```java
@SuppressWarnings({"uncheck", "deprecation"})
public class InternalAnnotationDemo {

    /**
     * @SuppressWarnings 标记消除当前类的告警信息
     */
    @SuppressWarnings({"deprecation"})
    static class A {
        public void method1() {
            System.out.println("call method1");
        }

        /**
         * @Deprecated 标记当前方法为废弃方法，不建议使用
         */
        @Deprecated
        public void method2() {
            System.out.println("call method2");
        }
    }

    /**
     * @Deprecated 标记当前类为废弃类，不建议使用
     */
    @Deprecated
    static class B extends A {
        /**
         * @Override 标记显示指明当前方法覆写了父类或接口的方法
         */
        @Override
        public void method1() { }
    }

    public static void main(String[] args) {
        A obj = new B();
        obj.method1();
        obj.method2();
    }
}
```

### @SafeVarargs

**[`@SafeVarargs`](https://docs.oracle.com/javase/8/docs/api/java/lang/SafeVarargs.html) 注解修饰方法或构造函数时，断言代码不会对其 varargs 参数执行潜在的不安全操作。当使用此注释类型时，与 varargs 使用相关的未检查警告将被抑制。**

`@SafeVarargs` 示例：

```java
public class SafeVarargsAnnotationDemo {
    @SafeVarargs
    static void wrongMethod(List<String>... stringLists) {
        Object[] array = stringLists;
        List<Integer> tmpList = Arrays.asList(42);
        array[0] = tmpList; // 语法错误，但是编译不告警
        String s = stringLists[0].get(0); // 运行时报 ClassCastException
    }

    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");

        List<String> list2 = new ArrayList<>();
        list.add("1");
        list.add("2");

        wrongMethod(list, list2);
    }
}
```

### @FunctionalInterface

**[`@FunctionalInterface`](https://docs.oracle.com/javase/8/docs/api/java/lang/FunctionalInterface.html) 表明类型声明是一个功能接口。**

## 元注解

**元注解的作用就是用于定义其它的注解。**

Java 中提供了以下元注解类型：

- `@Retention`
- `@Target`
- `@Documented`
- `@Inherited`（JDK8 引入）
- `@Repeatable`（JDK8 引入）

这些类型和它们所支持的类在 `java.lang.annotation` 包中可以找到。下面我们看一下每个元注解的作用和相应分参数的使用说明。

### @Retention

**[`@Retention`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Retention.html) 指明了注解的保留级别。**

保留级别如下：

- `RetentionPolicy.SOURCE` - 标记的注解仅在源文件中有效，并由编译器忽略。
- `RetentionPolicy.CLASS` - 标记的注解在 class 文件中有效，但 JVM 会忽略。
- `RetentionPolicy.RUNTIME` - 标记的注解在运行时有效。

`@Retention` 示例：

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Column {
    public String name() default "fieldName";
    public String setFuncName() default "setField";
    public String getFuncName() default "getField";
    public boolean defaultDBValue() default false;
}
```

### @Documented

[`@Documented`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Documented.html) 表示无论何时使用指定的注解，都应使用 Javadoc（默认情况下，注释不包含在 Javadoc 中）。更多内容可以参考：[Javadoc tools page](https://docs.oracle.com/javase/8/docs/technotes/guides/javadoc/index.html)。

`@Documented` 示例：

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Column {
    public String name() default "fieldName";
    public String setFuncName() default "setField";
    public String getFuncName() default "getField";
    public boolean defaultDBValue() default false;
}
```

### @Target

**[`@Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html) 指定注解可以修饰的元素类型。**

元素类型如下：

- `ElementType.ANNOTATION_TYPE` - 可以应用于注解类型。
- `ElementType.CONSTRUCTOR` - 可以应用于构造函数。
- `ElementType.FIELD` - 可以应用于字段或属性。
- `ElementType.LOCAL_VARIABLE` - 可以应用于局部变量。
- `ElementType.METHOD` - 可以应用于方法。
- `ElementType.PACKAGE` - 可以应用于包声明。
- `ElementType.PARAMETER` - 可以应用于方法的参数。
- `ElementType.TYPE` - 可以应用于类的任何元素。

`@Target` 示例：

```java
@Target(ElementType.TYPE)
public @interface Table {
    /**
     * 数据表名称注解，默认值为类名称
     * @return
     */
    public String tableName() default "className";
}

@Target(ElementType.FIELD)
public @interface NoDBColumn {
}
```

### @Inherited

**[`@Inherited`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Inherited.html) 表示注解类型可以被继承（默认情况下不是这样）**。

表示自动继承注解类型。 如果注解类型声明中存在 `@Inherited` 元注解，则注解所修饰类的所有子类都将会继承此注解。

> 注意：`@Inherited` 注解类型是被标注过的类的子类所继承。类并不从它所实现的接口继承注解，方法并不从它所覆写的方法继承注解。
>
> 此外，当 `@Inherited` 类型标注的注解的 `@Retention` 是 `RetentionPolicy.RUNTIME`，则反射 API 增强了这种继承性。如果我们使用 `java.lang.reflect` 去查询一个 `@Inherited` 类型的注解时，反射代码检查将展开工作：检查类和其父类，直到发现指定的注解类型被发现，或者到达类继承结构的顶层。

```java
@Inherited
public @interface Greeting {
    public enum FontColor{ BULE,RED,GREEN};
    String name();
    FontColor fontColor() default FontColor.GREEN;
}
```

### @Repeatable

**[`@Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) 表示注解可以重复使用。**

## 自定义注解

使用 `@interface` 自定义注解时，自动继承了 `java.lang.annotation.Annotation` 接口，由编译程序自动完成其他细节。在定义注解时，不能继承其他的注解或接口。`@interface` 用来声明一个注解，其中的每一个方法实际上是声明了一个配置参数。方法的名称就是参数的名称，返回值类型就是参数的类型（返回值类型只能是基本类型、Class、String、enum）。可以通过 `default` 来声明参数的默认值。

### 定义注解格式

```java
public @interface 注解名 {定义体}
```

### 注解参数的可支持数据类型

- 所有基本数据类型（byte、char、short、int、long、float、double、boolean）
- String 类型
- Class 类
- enum 类型
- Annotation 类型
- 以上所有类型的数组

注解类型里面的参数该怎么设定:

- 只能用 public 或默认（default）这两个访问权修饰。

  例如：`String value();` 这里把方法设为 default 默认类型。

- 参数成员只能用基本类型 byte、char、short、int、long、float、double、boolean 八种基本数据类型和 String、Enum、Class、注解等数据类型，以及这一些类型的数组。例如：`String value();` 这里的参数成员就为 String。

- 如果只有一个参数成员，最好把参数名称设为"value"，后加小括号。例：下面的例子 FruitName 注解就只有一个参数成员。

简单的自定义注解和使用注解实例：

自定义注解

```java
// 只有一个参数成员的注解
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FruitName {
    String value() default "";
}

// 值为枚举值的注解
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FruitColor {
    public enum Color{ BULE,RED,GREEN};
    Color fruitColor() default Color.GREEN;
}
```

使用自定义注解

```java
public class Apple {

    @FruitName("Apple")
    private String appleName;

    @FruitColor(fruitColor=Color.RED)
    private String appleColor;

    public void setAppleColor(String appleColor) {
        this.appleColor = appleColor;
    }
    public String getAppleColor() {
        return appleColor;
    }

    public void setAppleName(String appleName) {
        this.appleName = appleName;
    }
    public String getAppleName() {
        return appleName;
    }

    public void displayName(){
        System.out.println("水果的名字是：苹果");
    }
}
```

### 注解元素的默认值

注解元素必须有确定的值，要么在定义注解的默认值中指定，要么在使用注解时指定。非基本类型的注解元素的值不可为 null。因此, 使用空字符串或 0 作为默认值是一种常用的做法。这个约束使得处理器很难表现一个元素的存在或缺失的状态，因为每个注解的声明中，所有元素都存在，并且都具有相应的值，为了绕开这个约束，我们只能定义一些特殊的值，例如空字符串或者负数，一次表示某个元素不存在，在定义注解时，这已经成为一个习惯用法。例如：

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FruitProvider {
    /**
     * 供应商编号
     * @return
     */
    public int id() default -1;

    /**
     * 供应商名称
     * @return
     */
    public String name() default "";

    /**
     * 供应商地址
     * @return
     */
    public String address() default "";
}
```

定义了注解，并在需要的时候给相关类，类属性加上注解信息，如果没有响应的注解信息处理流程，注解可以说是没有实用价值。如何让注解真真的发挥作用，主要就在于注解处理方法，下一步我们将学习注解信息的获取和处理！

### 注解处理器

如果没有用来读取注解的方法和工作，那么注解也就不会比注释更有用处了。使用注解的过程中，很重要的一部分就是创建于使用注解处理器。Java 5 扩展了反射机制的 API，以帮助程序员快速的构造自定义注解处理器。

**注解处理器类库 `java.lang.reflect.AnnotatedElement`**

Java 使用 `java.lang.annotation.Annotation` 接口来代表程序元素前面的注解，该接口是所有注解类型的父接口。除此之外，Java 新增了 `java.lang.reflect.AnnotatedElement` 接口，该接口代表程序中可以接受注解的程序元素，该接口主要有如下几个实现类：

- `Class` - 类定义
- `Constructor` - 构造器定义
- `Field` - 累的成员变量定义
- `Method` - 类的方法定义
- `Package` - 类的包定义

`java.lang.reflect` 包下主要包含一些实现反射功能的工具类。实际上，`java.lang.reflect` 包所有提供的反射 API 扩充了读取运行时注解信息的能力。当一个注解类型被定义为运行时的注解后，该注解才能是运行时可见，当 class 文件被装载时被保存在 class 文件中的注解才会被虚拟机读取。
`AnnotatedElement` 接口是所有程序元素（Class、Method 和 Constructor）的父接口，所以程序通过反射获取了某个类的`AnnotatedElement` 对象之后，程序就可以调用该对象的如下四个个方法来访问注解信息：

- `<T extends Annotation> T getAnnotation(Class<T> annotationClass)` ：返回该程序元素上存在的、指定类型的注解，如果该类型注解不存在，则返回 null。
- `Annotation[] getAnnotations()` ：返回该程序元素上存在的所有注解。
- `boolean isAnnotationPresent(Class<?extends Annotation> annotationClass)` ：判断该程序元素上是否包含指定类型的注解，存在则返回 true，否则返回 false。
- `Annotation[] getDeclaredAnnotations()` ：返回直接存在于此元素上的所有注释。与此接口中的其他方法不同，该方法将忽略继承的注释。（如果没有注释直接存在于此元素上，则返回长度为零的一个数组。）该方法的调用者可以随意修改返回的数组；这不会对其他调用者返回的数组产生任何影响。

## 自定义注解实战

通过以上内容，已经了解了创建一个注解及注解处理器的基本要素。

### 实现 `@NotNull`

也许，你以前曾在很多框架中见过 @NotNull 这个注解（例如：Spring）。现在，让我们来亲手实现一个 `@NotNull` 注解。步骤如下：

（1）定义注解 `@NotNull`

```java
@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface NotNull {}
```

（2）`@NotNull` 注解处理器

```java
public class NotNullUtil {
    public static void check(Object obj) throws IllegalAccessException {
        Field[] fields = obj.getClass().getDeclaredFields();
        for (Field field : fields) {
            if (field.isAnnotationPresent(NotNull.class)) {
                field.setAccessible(true);
                Object value = field.get(obj);
                if (value == null) {
                    String msg = String.format("%s 类中的 %s 字段不能为空！", obj.getClass().getName(), field.getName());
                    throw new NullPointerException(msg);
                }
            }
        }
    }
}
```

（3）使用 `@NotNull`

```java
public class NotNullDemo {
    static class MyBean {
        @NotNull
        private Integer id;
        private String name;

        public MyBean(Integer id, String name) {
            this.id = id;
            this.name = name;
        }

        // getter/setter 略
    }

    public static void main(String[] args) throws IllegalAccessException {
        MyBean myBean = new MyBean(null, "jack");
        NotNullUtil.check(myBean);
    }
}
```

> 说明：
>
> 上例中，使用 `@NotNull` 修饰了 `MyBean` 的 id 字段。如果初始化 `MyBean` 的类实例后，使用注解处理器 `NotNullUtil` 解析  `MyBean` 的类实例，会抛出空指针检查异常。
>
> 至此，一个简单的自定义标记注解已经完成。

## 小结

## 参考资料

- [Java 编程思想](https://book.douban.com/subject/2130190/)
- [JAVA 核心技术（卷 1）](https://book.douban.com/subject/3146174/)
- [Effective java](https://book.douban.com/subject/3360807/)
- [深入理解 Java：注解（Annotation）自定义注解入门](https://www.cnblogs.com/peida/archive/2013/04/24/3036689.html)
- https://blog.csdn.net/briblue/article/details/73824058
- https://docs.oracle.com/javase/tutorial/java/annotations/
