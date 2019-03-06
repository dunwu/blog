---
title: 线性表
date: 2019-03-06
---

# 线性表

## 单链表

单链表中的每个结点不仅包含值，还包含链接到下一个结点的`引用字段`。通过这种方式，单链表将所有结点按顺序组织起来。、

下面是一个单链表的例子：

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/data-structure/list/单链表.png"/></div><br>

蓝色箭头显示单个链接列表中的结点是如何组合在一起的。

与数组不同，我们无法在常量时间内访问单链表中的随机元素。 如果我们想要获得第 i 个元素，我们必须从头结点逐个遍历。 我们按`索引`来`访问元素`平均要花费 `O(N)`时间，其中 N 是链表的长度。

## 双链表

双链表以类似的方式工作，但`还有一个引用字段`，称为`“prev”`字段。有了这个额外的字段，您就能够知道当前结点的前一个结点。

让我们看一个例子：

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/data-structure/list/双链表.png"/></div><br>

绿色箭头表示我们的“prev”字段是如何工作的。
