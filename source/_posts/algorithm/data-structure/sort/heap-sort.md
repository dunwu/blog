---
title: 堆排序
date: 2015-03-08
categories:
- algorithm
tags:
- algorithm
- sort
---

# 堆排序

## 要点

在介绍堆排序之前，首先需要说明一下，堆是个什么玩意儿。

**堆**是一棵**顺序存储**的**完全二叉树**。

其中每个结点的关键字都**不大于**其孩子结点的关键字，这样的堆称为**小根堆**。

其中每个结点的关键字都**不小于**其孩子结点的关键字，这样的堆称为**大根堆**。

举例来说，对于 n 个元素的序列 {R0, R1, ... , Rn} 当且仅当满足下列关系之一时，称之为堆：

- **Ri <= R2i+1 且 Ri <= R2i+2 （小根堆）**

- **Ri >= R2i+1 且 Ri >= R2i+2 （大根堆）**

其中 i=1,2,…,n/2 向下取整; 

<br><div align="center"><img src="http://oyz7npk35.bkt.clouddn.com//image/algorithm/sort/heap-sort.png"/></div><br>

如上图所示，序列 R{3, 8,15, 31, 25} 是一个典型的小根堆。

堆中有两个父结点，元素 3 和元素 8。

元素 3 在数组中以 R[0] 表示，它的左孩子结点是 R[1]，右孩子结点是 R[2]。

元素 8 在数组中以 R[1] 表示，它的左孩子结点是 R[3]，右孩子结点是 R[4]，它的父结点是 R[0]。可以看出，它们**满足以下规律**：

设当前元素在数组中以 **R[i]** 表示，那么，

- 它的**左孩子结点**是：**R[2\*i+1]**;

- 它的**右孩子结点**是：**R[2\*i+2]**;

- (3) 它的**父结点**是：**R[(i-1)/2]**;

- R[i] <= R[2*i+1] 且 R[i] <= R[2i+2]。


## 算法思想

- 首先，按堆的定义将数组R[0..n]调整为堆（这个过程称为创建初始堆），交换R[0]和R[n]；

- 然后，将R[0..n-1]调整为堆，交换R[0]和R[n-1]；

- 如此反复，直到交换了R[0]和R[1]为止。


以上思想可归纳为两个操作：

1. 根据初始数组去**构造初始堆**（构建一个完全二叉树，保证所有的父结点都比它的孩子结点数值大）。

2. 每次**交换第一个和最后一个元素，输出最后一个元素**（最大值），然后把剩下元素**重新调整**为大根堆。 


当输出完最后一个元素后，这个数组已经是按照从小到大的顺序排列了。

先通过详细的实例图来看一下，如何构建初始堆。

设有一个无序序列 { 1, 3,4, 5, 2, 6, 9, 7, 8, 0 }。

<br><div align="center"><img src="http://oyz7npk35.bkt.clouddn.com//image/algorithm/sort/heap-sort-02.png"/></div><br>

构造了初始堆后，我们来看一下完整的堆排序处理：

还是针对前面提到的无序序列 { 1,3, 4, 5, 2, 6, 9, 7, 8, 0 } 来加以说明。

<br><div align="center"><img src="http://oyz7npk35.bkt.clouddn.com//image/algorithm/sort/heap-sort-03.png"/></div><br>

相信，通过以上两幅图，应该能很直观的演示堆排序的操作处理。 

**核心代码**

```java
public void HeapAdjust(int[] array, int parent, int length) {
    int temp = array[parent]; // temp保存当前父节点
    int child = 2 * parent + 1; // 先获得左孩子
 
    while (child < length) {
        // 如果有右孩子结点，并且右孩子结点的值大于左孩子结点，则选取右孩子结点
        if (child + 1 < length && array[child] < array[child + 1]) {
            child++;
        }
 
        // 如果父结点的值已经大于孩子结点的值，则直接结束
        if (temp >= array[child])
            break;
 
        // 把孩子结点的值赋给父结点
        array[parent] = array[child];
 
        // 选取孩子结点的左孩子结点,继续向下筛选
        parent = child;
        child = 2 * child + 1;
    }
 
    array[parent] = temp;
}
 
public void heapSort(int[] list) {
    // 循环建立初始堆
    for (int i = list.length / 2; i >= 0; i--) {
        HeapAdjust(list, i, list.length);
    }
 
    // 进行n-1次循环，完成排序
    for (int i = list.length - 1; i > 0; i--) {
        // 最后一个元素和第一元素进行交换
        int temp = list[i];
        list[i] = list[0];
        list[0] = temp;
 
        // 筛选 R[0] 结点，得到i-1个结点的堆
        HeapAdjust(list, 0, i);
        System.out.format("第 %d 趟: \t", list.length - i);
        printPart(list, 0, list.length - 1);
    }
}
```

## 算法分析

**堆排序算法的总体情况**

| 参数        | 结果        |
| --------- | --------- |
| 排序类别      | 选择排序      |
| 排序方法      | 堆排序       |
| 时间复杂度平均情况 | O(nlog2n) |
| 时间复杂度最坏情况 | O(nlog2n) |
| 时间复杂度最好情况 | O(nlog2n) |
| 空间复杂度     | O(1)      |
| 稳定性       | 不稳定       |
| 复杂性       | 较复杂       |

### 时间复杂度

堆的存储表示是**顺序的**。因为堆所对应的二叉树为完全二叉树，而完全二叉树通常采用顺序存储方式。

当想得到一个序列中第 **k** 个最小的元素之前的部分排序序列，最好采用堆排序。

因为堆排序的时间复杂度是 **O(n+klog2n)**，若 **k ≤ n/log2n**，则可得到的时间复杂度为 **O(n)**。

### 算法稳定性

堆排序是一种**不稳定**的排序方法。

因为在堆的调整过程中，关键字进行比较和交换所走的是该结点到叶子结点的一条路径，

因此对于相同的关键字就可能出现排在后面的关键字被交换到前面来的情况。 

## 示例代码

[我的 Github 测试例](https://github.com/dunwu/algorithm-notes/blob/master/codes/src/test/java/io/github/dunwu/algorithm/sort/SortStrategyTest.java)

样本包含：数组个数为奇数、偶数的情况；元素重复或不重复的情况。且样本均为随机样本，实测有效。
