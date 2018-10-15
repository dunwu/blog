# UML

> 统一建模语言（英语 - Unified Modeling Language，缩写 UML）是非专利的第三代建模和规约语言。UML 是一种开放的方法，用于说明、可视化、构建和编写一个正在开发的、面向对象的、软件密集系统的制品的开放方法。UML 展现了一系列最佳工程实践，这些最佳实践在对大规模，复杂系统进行建模方面，特别是在软件架构层次已经被验证有效。

![](http://oyz7npk35.bkt.clouddn.com/images/20180920181015132713.png)

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [模型](#模型)
    - [图](#图)
    - [概念](#概念)
- [参考资料](#参考资料)

<!-- /TOC -->

## 简介

### 模型

在 UML 系统开发中有三个主要的模型：

- **功能模型** - 从用户的角度展示系统的功能，包括用例图。
- **对象模型** - 采用对象，属性，操作，关联等概念展示系统的结构和基础，包括类别图、对象图。
- **动态模型** - 展现系统的内部行为。包括序列图，活动图，状态图。

区分 UML 模型和 UML 图是非常重要的，UML 图，包括用例图、协作图、活动图、序列图、部署图、构件图、类图、状态图，是模型中信息的图形表达方式，但是 UML 模型独立于 UML 图存在。UML 的当前版本只提供了模型信息的交换，而没有提供图信息的交换。

### 图

UML2 中一共定义了 14 种图。

![](http://dunwu.test.upcdn.net/images/design/uml/uml-diagrams.png)

- 结构性图（Structure diagrams）强调的是系统式的建模：
  - 静态图（static diagram）
    - 类图
    - 对象图
    - 包图
  - 实现图（implementation diagram）
    - 组件图
    - 部署图
  - 剖面图
  - 复合结构图
- 行为式图（Behavior diagrams）强调系统模型中触发的事件：
  - 活动图
  - 状态图
  - 用例图
- 交互性图（Interaction diagrams），属于行为图形的子集合，强调系统模型中的资料流程：
  - 通信图
  - 交互概述图（UML 2.0）
  - 时序图（UML 2.0）
  - 时间图（UML 2.0）

### 概念

UML 从来源中使用相当多的概念。我们将之定义于统一建模语言术语汇表。下面仅列代表性的概念。

- 对于结构而言 - 执行者，属性，类，元件，接口，对象，包。
- 对于行为而言 - 活动（UML），事件（UML），消息（UML），方法（UML），操作（UML），状态（UML），用例（UML）。
- 对于关系而言 - 聚合，关联，组合，相依，广义化（or 继承）。
- 其他概念
  - 构造型—这规范符号应用到的模型
  - 多重性—多重性标记法与资料库建模基数对应，例如：`1, 0..1, 1..*`

## 参考资料

https://zh.wikipedia.org/wiki/统一建模语言
https://sparxsystems.cn/resources/uml2_tutorial/index.html
https://www.omg.org/spec/UML
https://www.tutorialspoint.com/uml/index.htm
https://www.w3cschool.cn/uml_tutorial/