---
title: 数组
date: 2019-03-06
---

# 数组

> 所谓数组，是有序的元素序列。若将有限个类型相同的变量的集合命名，那么这个名称为数组名。组成数组的各个变量称为数组的分量，也称为数组的元素，有时也称为下标变量。用于区分数组的各个元素的数字编号称为下标。数组是在程序设计中，为了处理方便， 把具有相同类型的若干元素按无序的形式组织起来的一种形式。这些无序排列的同类数据元素的集合称为数组。

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [一维数组](#一维数组)
    - [二维数组](#二维数组)
    - [多维数组](#多维数组)
    - [数组的特性](#数组的特性)
- [数组中的操作](#数组中的操作)
- [更多内容](#更多内容)

<!-- /TOC -->

## 简介

`数组`是一种基本的数据结构，用于按顺序`存储元素的集合`。但是元素可以随机存取，因为数组中的每个元素都可以通过数组`索引`来识别。

数组可以有一个或多个维度。

### 一维数组

一维（或单维）数组是一种线性数组，其中元素的访问是以行或列索引的单一下标表示。

这里有一个例子：

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/data-structure/array/一维数组.png"/></div><br>

在上面的例子中，数组 A 中有 6 个元素。也就是说，A 的长度是 6 。我们可以使用 A[0] 来表示数组中的第一个元素。因此，A[0] = 6 。类似地，A[1] = 3，A[2] = 8，依此类推。

### 二维数组

类似于一维数组，二维数组也是由元素的序列组成。但是这些元素可以排列在矩形网格中而不是直线上。

类似于一维数组，`二维数组`也是由元素的序列组成。但是这些元素可以排列在矩形网格中而不是直线上。

在一些语言中，多维数组实际上是在`内部`作为一维数组实现的，而在其他一些语言中，`实际上`根本没有`多维数组`。

**1. C++ 将二维数组存储为一维数组。**

下图显示了*大小为 M \* N 的数组 A* 的实际结构：

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/data-structure/array/C++二维数组.png"/></div><br>

因此，如果我们将 A 定义为也包含 _M \* N_ 个元素的一维数组，那么实际上 A[i][j] 就等于 A[i * N + j]。

**2. 在 Java 中，二维数组实际上是包含着 M 个元素的一维数组，每个元素都是包含有 N 个整数的数组。**

下图显示了 Java 中二维数组 A 的实际结构：

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/data-structure/array/JAVA二维数组.png"/></div><br>

二维数组示例：

```java
public class TwoDimensionArray {
    private static void printArray(int[][] a) {
        for (int i = 0; i < a.length; ++i) {
            System.out.println(a[i]);
        }
        for (int i = 0; i < a.length; ++i) {
            for (int j = 0; a[i] != null && j < a[i].length; ++j) {
                System.out.print(a[i][j] + " ");
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        System.out.println("Example I:");
        int[][] a = new int[2][5];
        printArray(a);
        System.out.println("Example II:");
        int[][] b = new int[2][];
        printArray(b);
        System.out.println("Example III:");
        b[0] = new int[3];
        b[1] = new int[5];
        printArray(b);
    }
}
```

### 多维数组

普通数组采用一个整数来作下标。多维数组（高维数组）的概念特别是在数值计算和图形应用方面非常有用。我们在多维数组之中采用一系列有序的整数来标注，如在[ 3,1,5 ] 。这种整数列表之中整数的个数始终相同，且被称为数组的“维度”。关于每个数组维度的边界称为“维”。维度为 k 的数组通常被称为 k 维。

多维数组的数组名字，在表达式中自动转换为数组首元素地址值，但这个首元素实际上是去除数组下标第一维之后的数组剩余部分。

### 数组的特性

数组设计之初是在形式上依赖内存分配而成的，所以必须在使用前预先请求空间。这使得数组有以下特性：

1. 请求空间以后大小固定，不能再改变（数据溢出问题）；
2. 在内存中有空间连续性的表现，中间不会存在其他程序需要调用的数据，为此数组的专用内存空间；
3. 在旧式编程语言中（如有中阶语言之称的 C），程序不会对数组的操作做下界判断，也就有潜在的越界操作的风险（比如会把数据写在运行中程序需要调用的核心部分的内存上）。

因为简单数组强烈倚赖计算机硬件之内存，所以不适用于现代的程序设计。欲使用可变大小、硬件无关性的数据类型，Java 等程序设计语言均提供了更高级的数据结构：ArrayList、Vector 等动态数组。

## 数组中的操作

```java
public class Main {
    public static void main(String[] args) {
        // 1. Initialize
        int[] a0 = new int[5];
        int[] a1 = {1, 2, 3};
        // 2. Get Length
        System.out.println("The size of a1 is: " + a1.length);
        // 3. Access Element
        System.out.println("The first element is: " + a1[0]);
        // 4. Iterate all Elements
        System.out.print("[Version 1] The contents of a1 are:");
        for (int i = 0; i < a1.length; ++i) {
            System.out.print(" " + a1[i]);
        }
        System.out.println();
        System.out.print("[Version 2] The contents of a1 are:");
        for (int item: a1) {
            System.out.print(" " + item);
        }
        System.out.println();
        // 5. Modify Element
        a1[0] = 4;
        // 6. Sort
        Arrays.sort(a1);
    }
}
```

## 更多内容

- https://zh.wikipedia.org/wiki/数组
