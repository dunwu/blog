---
title: 快速排序
date: 2015-03-04
categories:
- algorithm
tags:
- algorithm
- sort
---

# 快速排序

## 要点

> 快速排序是一种交换排序。

快速排序由C. A. R. Hoare在1962年提出。

## 算法思想

它的基本思想是：

通过一趟排序将要排序的数据分割成独立的两部分：分割点左边都是比它小的数，右边都是比它大的数。

然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。

详细的图解往往比大堆的文字更有说明力，所以直接上图：

<br><div align="center"><img src="http://oyz7npk35.bkt.clouddn.com//image/algorithm/sort/quick-sort.png"/></div><br>

上图中，演示了快速排序的处理过程：

1. 初始状态为一组无序的数组：2、4、5、1、3。

2. 经过以上操作步骤后，完成了第一次的排序，得到新的数组：1、2、5、4、3。

3. 新的数组中，以 2 为分割点，左边都是比 2 小的数，右边都是比 2 大的数。

4. 因为2已经在数组中找到了合适的位置，所以不用再动。

5. 2左边的数组只有一个元素 1，所以显然不用再排序，位置也被确定。（注：这种情况时，left指针和right指针显然是重合的。因此在代码中，我们可以通过设置判定条件left必须小于right，如果不满足，则不用排序了）。

6. 而对于2右边的数组 5、4、3，设置left指向 5，right指向 3，开始继续重复图中的一、二、三、四步骤，对新的数组进行排序。

**核心代码**

```java
public int division(int[] list, int left, int right) {
    // 以最左边的数(left)为基准
    int base = list[left];
    while (left < right) {
        // 从序列右端开始，向左遍历，直到找到小于base的数
        while (left < right && list[right] >= base)
            right--;
        // 找到了比base小的元素，将这个元素放到最左边的位置
        list[left] = list[right];
 
        // 从序列左端开始，向右遍历，直到找到大于base的数
        while (left < right && list[left] <= base)
            left++;
        // 找到了比base大的元素，将这个元素放到最右边的位置
        list[right] = list[left];
    }
 
    // 最后将base放到left位置。此时，left位置的左侧数值应该都比left小；
    // 而left位置的右侧数值应该都比left大。
    list[left] = base;
    return left;
}
 
private void quickSort(int[] list, int left, int right) {
 
    // 左下标一定小于右下标，否则就越界了
    if (left < right) {
        // 对数组进行分割，取出下次分割的基准标号
        int base = division(list, left, right);
 
        System.out.format("base = %d:\t", list[base]);
        printPart(list, left, right);
 
        // 对“基准标号“左侧的一组数值进行递归的切割，以至于将这些数值完整的排序
        quickSort(list, left, base - 1);
 
        // 对“基准标号“右侧的一组数值进行递归的切割，以至于将这些数值完整的排序
        quickSort(list, base + 1, right);
    }
}
```

## 算法分析

快速排序算法的性能

| 参数        | 结果        |
| --------- | --------- |
| 排序类别      | 交换排序      |
| 排序方法      | 快速排序      |
| 时间复杂度平均情况 | O(Nlog2N) |
| 时间复杂度最坏情况 | O(N2)     |
| 时间复杂度最好情况 | O(Nlog2N) |
| 空间复杂度     | O(Nlog2N) |
| 稳定性       | 不稳定       |
| 复杂性       | 较复杂       |

### 时间复杂度

当数据有序时，以第一个关键字为基准分为两个子序列，前一个子序列为空，此时执行效率最差。

而当数据随机分布时，以第一个关键字为基准分为两个子序列，两个子序列的元素个数接近相等，此时执行效率最好。

所以，数据越随机分布时，快速排序性能越好；数据越接近有序，快速排序性能越差。

### 空间复杂度

快速排序在每次分割的过程中，需要 1 个空间存储基准值。而快速排序的大概需要 Nlog2N 次的分割处理，所以占用空间也是 Nlog2N 个。

### 算法稳定性

在快速排序中，相等元素可能会因为分区而交换顺序，所以它是不稳定的算法。

## 示例代码

[我的 Github 测试例](https://github.com/dunwu/algorithm-notes/blob/master/codes/src/test/java/io/github/dunwu/algorithm/sort/SortStrategyTest.java)

样本包含：数组个数为奇数、偶数的情况；元素重复或不重复的情况。且样本均为随机样本，实测有效。
