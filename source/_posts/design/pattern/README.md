---
title: 设计模式
categories: ['设计', '设计模式']
tags: ['设计', '设计模式']
date: 2015-01-27 16:50
---

# 设计模式

设计模式（Design pattern）代表了最佳的实践，通常被有经验的面向对象的软件开发人员所采用。设计模式是软件开发人员在软件开发过程中面临的一般问题的解决方案。这些解决方案是众多软件开发人员经过相当长的一段时间的试验和错误总结出来的。

## 创建型模式

### 创建型模式简介

**创建型模式**抽象了**实例化**的过程。它将**系统**与它的**对象**创建、结合、表示的方式**分离**。

创建型模式都会将关于该系统使用哪些具体的类的信息**封装**起来。

在软件工程中，创建型模式是处理对象创建的设计模式，试图根据实际情况使用合适的方式创建对象。

基本的对象创建方式可能会导致设计上的问题，或增加设计的复杂度。创建型模式通过以某种方式控制对象的创建来解决问题。

创建型模式的**指导思想**是：

- 将系统使用的具体类封装起来。
- 隐藏这些具体类的实例创建和结合的方式。

创建型模式又分为**对象创建型模式**和**类创建型模式**。对象创建型模式处理对象的创建，类创建型模式处理类的创建。

- **对象创建型模式**把对象创建的一部分推迟到另一个对象中。（代表模式：**单例模式**、**建造者模式**、**原型模式**、**抽象工厂模式**）
- **类创建型模式**将它对象的创建推迟到子类中。（代表模式：**工厂方法模式**）

### 创建型模式应用

现代软件工程更加依赖对象的组合，而不是类的继承，强调从硬编码的行为转变到定义一组基本行为来组合成复杂的行为。

硬编码的行为不够灵活，因为如果想要改变设计的一部分，需要通过重写或者重新实现才能完成。

另外，硬编码没有提高重用性，而且难以跟踪错误。由于这些原因，创建型模式比硬编码的行为更有用。

创建型模式使设计变得更灵活，提供了不同的方式，从代码中移除了对需要实例化的具体类的引用。换句话说，这些模式增强了对象和类之间的独立性。

在以下情况中，可以考虑应用创建型模式：

- 一个系统需要和它的对象和产品的创建相互独立。
- 一组相关的对象被设计为一起使用。
- 隐藏一个类库的具体实现，仅暴露它们的接口。
- 创建独立复杂对象的不同表示。
- 一个类希望它的子类实现它所创建的对象。
- 类的实例化在运行时才指定。
- 一个类只能有一个实例，而且这个实例能在任何时候访问到。
- 实例应该能在不修改的情况下具有可扩展性。

### 创建型模式代表

- [单例模式 (Singleton Pattern)](单例模式.md)
- [简单工厂模式 (Simple Factory Pattern)](简单工厂模式.md)
- [工厂方法模式 (Factory Method Pattern)](工厂方法模式.md)
- [抽象工厂模式 (Abstract Factory Pattern)](抽象工厂模式.md)
- [构造者模式 (Builder Pattern)](构造者模式.md)
- [原型模式 (Prototype Pattern)](原型模式.md)

## 结构型模式

- [适配器模式 (Adapter Pattern)](适配器模式.md)
- [桥接模式 (Bridge Pattern)](桥接模式.md)
- [装饰者模式 (Decorator Pattern)](装饰者模式.md)
- [组合模式 (Composite Pattern)](组合模式.md)
- [外观模式 (Facade Pattern)](外观模式.md)
- [享元模式 (Flyweight Pattern)](享元模式.md)
- [代理模式 (Proxy Pattern)](代理模式.md)

## 行为型模式

- [模板方法模式 (Template Method Pattern)](http://www.cnblogs.com/jingmoxukong/p/4203714.html)
- [命令模式 (Command Pattern)](http://www.cnblogs.com/jingmoxukong/p/4234281.html)
- [迭代器模式 (Iterator Pattern)](http://www.cnblogs.com/jingmoxukong/p/4236056.html)
- [观察者模式 (Observer Pattern)](http://www.cnblogs.com/jingmoxukong/p/4236338.html)
- [解释器模式 (Interpreter Pattern)](http://www.cnblogs.com/jingmoxukong/p/4236961.html)
- [中介者模式 (Mediator Pattern)](http://www.cnblogs.com/jingmoxukong/p/4238479.html)
- [职责链模式 (Chain of Responsibility Pattern)](http://www.cnblogs.com/jingmoxukong/p/4241496.html)
- [备忘录模式 (Memento Pattern)](http://www.cnblogs.com/jingmoxukong/p/4241659.html)
- [策略模式 (Strategy Pattern)](http://www.cnblogs.com/jingmoxukong/p/4241965.html)
- [访问者模式 (Visitor Pattern)](http://www.cnblogs.com/jingmoxukong/p/4242418.html)
- [状态模式 (State Pattern)](http://www.cnblogs.com/jingmoxukong/p/4243478.html)

## 资料

- [O'Reilly：Head First 设计模式](https://item.jd.com/10100236.html)
- [大话设计模式](https://item.jd.com/10079261.html)
