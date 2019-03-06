---
title: 
date: 2019-03-06
---

## 坏味道——Switch声明(Switch Statements)

### 特征

> 你有一个复杂的 `switch`  语句或 `if`  序列语句。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/design/refactor/switch-statements-1.png"/></div><br>

### 问题原因

面向对象程序的一个最明显特征就是：少用 `switch`  和 `case` 语句。从本质上说，`switch` 语句的问题在于重复（`if` 序列也同样如此）。你常会发现 `switch` 语句散布于不同地点。如果要为它添加一个新的 `case` 子句，就必须找到所有 `switch` 语句并修改它们。面向对象中的多态概念可为此带来优雅的解决办法。

大多数时候，一看到 `switch` 语句，就应该考虑以多态来替换它。

### 解决方法

-  问题是多态该出现在哪？switch语句常常根据类型码进行选择，你要的是“与该类型码相关的函数或类”，所以应该运用 `提炼函数(Extract Method)` 将 `switch` 语句提炼到一个独立函数中，再以 `搬移函数(Move Method)` 将它搬移到需要多态性的那个类里。
-  如果你的 `switch` 是基于类型码来识别分支，这时可以运用 `以子类取代类型码(Replace Type Code with Subclass)` 或 `以状态/策略模式取代类型码(Replace Type Code with State/Strategy)` 。
-  一旦完成这样的继承结构后，就可以运用 `以多态取代条件表达式(Replace Conditional with Polymorphism)` 了。
-  如果条件分支并不多并且它们使用不同参数调用相同的函数，多态就没必要了。在这种情况下，你可以运用 `以明确函数取代参数(Replace Parameter with Explicit Methods)` 。
-  如果你的选择条件之一是null，可以运用 `引入 Null 对象(Introduce Null Object)` 。

### 收益

- 提升代码组织性。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/design/refactor/switch-statements-2.png"/></div><br>

### 何时忽略

- 如果一个 `switch` 操作只是执行简单的行为，就没有重构的必要了。
- `switch` 常被工厂设计模式族（`工厂方法模式(Factory Method)`和`抽象工厂模式(Abstract Factory) `）所使用，这种情况下也没必要重构。

## 重构方法说明

### 提炼函数(Extract Method)

**问题**

你有一段代码可以组织在一起。

```java
void printOwing() {
  printBanner();

  //print details
  System.out.println("name: " + name);
  System.out.println("amount: " + getOutstanding());
}
```
**解决**

移动这段代码到一个新的函数中，使用函数的调用来替代老代码。

```java
void printOwing() {
  printBanner();
  printDetails(getOutstanding());
}

void printDetails(double outstanding) {
  System.out.println("name: " + name);
  System.out.println("amount: " + outstanding);
}
```

### 搬移函数(Move Method)

**问题**

你的程序中，有个函数与其所驻类之外的另一个类进行更多交流：调用后者，或被后者调用。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/design/refactor/move-method-before.png"/></div><br>

**解决**

在该函数最常引用的类中建立一个有着类似行为的新函数。将旧函数变成一个单纯的委托函数，或是旧函数完全移除。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/design/refactor/move-method-after.png"/></div><br>

### 以子类取代类型码(Replace Type Code with Subclass)

**问题**

你有一个不可变的类型码，它会影响类的行为。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/design/refactor/replace-type-code-with-subclasses-before.png"/></div><br>

**解决**

以子类取代这个类型码。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/design/refactor/replace-type-code-with-subclasses-after.png"/></div><br>

### 以状态/策略模式取代类型码(Replace Type Code with State/Strategy)

**问题**

你有一个类型码，它会影响类的行为，但你无法通过继承消除它。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/design/refactor/replace-type-code-with-state-strategy-before.png"/></div><br>

**解决**

以状态对象取代类型码。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/design/refactor/replace-type-code-with-state-strategy-after.png"/></div><br>

### 以多态取代条件表达式(Replace Conditional with Polymorphism)

**问题**

你手上有个条件表达式，它根据对象类型的不同而选择不同的行为。

```java
class Bird {
  //...
  double getSpeed() {
    switch (type) {
      case EUROPEAN:
        return getBaseSpeed();
      case AFRICAN:
        return getBaseSpeed() - getLoadFactor() * numberOfCoconuts;
      case NORWEGIAN_BLUE:
        return (isNailed) ? 0 : getBaseSpeed(voltage);
    }
    throw new RuntimeException("Should be unreachable");
  }
}
```

**解决**

将这个条件表达式的每个分支放进一个子类内的覆写函数中，然后将原始函数声明为抽象函数。

```java
abstract class Bird {
  //...
  abstract double getSpeed();
}

class European extends Bird {
  double getSpeed() {
    return getBaseSpeed();
  }
}
class African extends Bird {
  double getSpeed() {
    return getBaseSpeed() - getLoadFactor() * numberOfCoconuts;
  }
}
class NorwegianBlue extends Bird {
  double getSpeed() {
    return (isNailed) ? 0 : getBaseSpeed(voltage);
  }
}

// Somewhere in client code
speed = bird.getSpeed();
```

### 以明确函数取代参数(Replace Parameter with Explicit Methods)

**问题**

你有一个函数，其中完全取决于参数值而采取不同的行为。

```java
void setValue(String name, int value) {
  if (name.equals("height")) {
    height = value;
    return;
  }
  if (name.equals("width")) {
    width = value;
    return;
  }
  Assert.shouldNeverReachHere();
}
```

**解决**

针对该参数的每一个可能值，建立一个独立函数。

```java
void setHeight(int arg) {
  height = arg;
}
void setWidth(int arg) {
  width = arg;
}
```

### 引入 Null 对象(Introduce Null Object)

**问题**

你需要再三检查某对象是否为null。

```java
if (customer == null) {
  plan = BillingPlan.basic();
}
else {
  plan = customer.getPlan();
}
```

**解决**

将null值替换为null对象。

```java
class NullCustomer extends Customer {
  Plan getPlan() {
    return new NullPlan();
  }
  // Some other NULL functionality.
}

// Replace null values with Null-object.
customer = (order.customer != null) ? order.customer : new NullCustomer();

// Use Null-object as if it's normal subclass.
plan = customer.getPlan();
```
