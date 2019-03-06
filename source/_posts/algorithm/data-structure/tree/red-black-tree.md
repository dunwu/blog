---
title: 红黑树
date: 2018-06-01
categories:
- algorithm
tags:
- algorithm
- tree
---

# 红黑树

> 红黑树（英语：Red–black tree）是一种自平衡二叉查找树，是在计算机科学中用到的一种数据结构，典型的用途是实现关联数组。它是复杂的，但它的操作有着良好的最坏情况运行时间，并且在实践中是高效的：它可以在 $O(\log_2 N)$ 时间内做查找，插入和删除，这里的 n 是树中元素的数目。

## 红黑树的性质

红黑树，顾名思义，通过红黑两种颜色域保证树的高度近似平衡。它的每个节点是一个五元组：color（颜色），key（数据），left（左孩子），right（右孩子）和 p（父节点）。

红黑树的定义也是它的性质，有以下五条：

1.  节点是红色或黑色。

2.  根是黑色。

3.  所有叶子都是黑色（叶子是 NIL 节点）。

4.  每个红色节点必须有两个黑色的子节点。（从每个叶子到根的所有路径上不能有两个连续的红色节点。

5.  从任一节点到其每个叶子的所有简单路径都包含相同数目的黑色节点。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/images/algorithm/tree/red-black-tree-01.png" />
</div>

这五个性质强制了红黑树的关键性质: 从根到叶子的最长的可能路径不多于最短的可能路径的两倍长。为什么呢？性质 4 暗示着任何一个简单路径上不能有两个毗连的红色节点，这样，最短的可能路径全是黑色节点，最长的可能路径有交替的红色和黑色节点。同时根据性质 5 知道：所有最长的路径都有相同数目的黑色节点，这就表明了没有路径能多于任何其他路径的两倍长。

## 红黑树的操作

因为红黑树也是二叉查找树，因此红黑树上的查找操作与普通二叉查找树上的查找操作相同。然而，红黑树上的插入操作和删除操作会导致不再符合红黑树的性质。恢复红黑树的性质需要少量($O(\log_2 N)$)的颜色变更(实际是非常快速的)和不超过三次树旋转(对于插入操作是两次)。虽然插入和删除很复杂，但操作时间仍可以保持为 $O(\log_2 N)$ 次。

### 插入操作

插入操作可以概括为以下几个步骤：

1.  查找要插入的位置，时间复杂度为：$O(N)$

2.  将新节点的 color 赋为红色

3.  自下而上重新调整该树为红黑树

其中，第 1 步的查找方法跟普通二叉查找树一样，第 2 步之所以将新插入的节点的颜色赋为红色，是因为：如果设为黑色，就会导致根到叶子的路径上有一条路上，多一个额外的黑节点，这个是很难调整的。但是设为红色节点后，可能会导致出现两个连续红色节点的冲突，那么可以通过颜色调换（color flips）和树旋转来调整，这样简单多了。下面讨论步骤 3 的一些细节：

设要插入的节点为 N，其父节点为 P，其父节点 P 的兄弟节点为 U（即 P 和 U 是同一个节点的两个子节点）。

* 如果 P 是黑色的，则整棵树不必调整便是红黑树。

* 如果 P 是红色的（可知，其父节点 G 一定是黑色的），则插入 N 后，违背了性质 4，需要进行调整。调整时分以下 3 种情况：

  3.1. 如果父节点 P 和叔父节点 U 二者都是红色

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/images/algorithm/tree/red-black-tree-insert-01.png" />
</div>

如上图所示，我们将 P 和 U 重绘为黑色，并重绘节点 G 为红色(用来保持性质 5)。

现在新节点 N 有了一个黑色的父节点 P，因为通过父节点 P 或叔父节点 U 的任何路径都必定通过祖父节点 G，在这些路径上的黑节点数目没有改变。

但是，红色的祖父节点 G 的父节点也有可能是红色的，这就违反了性质 4。为了解决这个问题，我们在祖父节点 G 上递归调整颜色。

3.2. 父节点 P 是红色而叔父节点 U 是黑色或缺少，新节点 N 是右孩子节点，而父节点 P 又是其父节点 G 的左孩子节点。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/images/algorithm/tree/red-black-tree-insert-02.png" />
</div>

在这种情形下，我们进行一次左旋转调换新节点和其父节点的角色；接着，我们按情形 3.3 处理以前的父节点 P 以解决仍然失效的性质 4。注意这个改变会导致某些路径通过它们以前不通过的新节点 N（比如图中 1 号叶子节点）或不通过节点 P（比如图中 3 号叶子节点），但由于这两个节点都是红色的，所以性质 5 仍有效。

3.3. 父节点 P 是红色而叔父节点 U 是黑色或缺少，新节点 N 是左孩子节点，而父节点 P 又是其父节点 G 的左孩子节点。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/images/algorithm/tree/red-black-tree-insert-03.png" />
</div>

在这种情形下，我们进行针对祖父节点 G 的一次右旋转；在旋转产生的树中，以前的父节点 P 现在是新节点 N 和以前的祖父节点 G 的父节点。我们知道以前的祖父节点 G 是黑色，否则父节点 P 就不可能是红色（如果 P 和 G 都是红色就违反了性质 4，所以 G 必须是黑色）。我们切换以前的父节点 P 和祖父节点 G 的颜色，结果的树满足性质 4。性质 5 也仍然保持满足，因为通过这三个节点中任何一个的所有路径以前都通过祖父节点 G，现在它们都通过以前的父节点 P。在各自的情形下，这都是三个节点中唯一的黑色节点。

### 删除操作

删除操作可以概括为以下几个步骤：

1.  查找要删除位置，时间复杂度为：O(N)

2.  用删除节点后继或者节点替换该节点（只进行数据替换即可，不必调整指针，后继节点是中序遍历中紧挨着该节点的节点，即：右孩子的最左孩子节点）

3.  如果删除节点的替换节点为黑色，则需重新调整该树为红黑树

其中，第 1 步的查找方法跟普通二叉查找树一样，第 2 步之所以用后继节点替换删除节点，是因为这样可以保证该后继节点之上仍是一个红黑树，而后继节点可能是一个叶节点或者只有右子树的节点，这样只需用有节点替换后继节点即可达到删除的目的。如果需要删除的节点有两个儿子，那么问题可以被转化成删除另一个只有一个儿子的节点的问题。

在第 3 步中

* 如果，如果删除节点为红色节点，则他的父亲和孩子全为黑节点，这样直接删除该节点即可，不必进行任何调整。

* 如果删除节点是黑节点，分四种情况：

设要删除的节点为 N，其父节点为 P，其兄弟节点为 S。

由于 N 是黑色的，则 P 可能是黑色的，也可能是红色的，S 也可能是黑色的或者红色的

3.1 S 是红色的

此时 P 肯定是红色的。我们对 N 的父节点进行左旋转，然后把红色兄弟转换成 N 的祖父。我们接着对调 N 的父亲和祖父的颜色。尽管所有的路径仍然有相同数目的黑色节点，现在 N 有了一个黑色的兄弟和一个红色的父亲，所以我们可以接下去按 (2)、(3)或(4)情况来处理。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/images/algorithm/tree/red-black-tree-delete-01.png" />
</div>

3.2 S和S的孩子全是黑色的

在这种情况下，P 可能是黑色的或者红色的，我们简单的重绘 S 为红色。结果是通过 S 的所有路径，它们就是以前不通过 N 的那些路径，都少了一个黑色节点。因为删除 N 的初始的父亲使通过 N 的所有路径少了一个黑色节点，这使事情都平衡了起来。但是，通过 P 的所有路径现在比不通过 P 的路径少了一个黑色节点。接下来，要调整以 P 作为 N 递归调整树。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/images/algorithm/tree/red-black-tree-delete-02.png" />
</div>

3.3 S是黑色的，S的左孩子是红色，右孩子是黑色

这种情况下我们在 S 上做右旋转，这样 S 的左儿子成为 S 的父亲和 N 的新兄弟。我们接着交换 S 和它的新父亲的颜色。所有路径仍有同样数目的黑色节点，但是现在 N 有了一个右儿子是红色的黑色兄弟，所以我们进入了情况（4）。N 和它的父亲都不受这个变换的影响。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/images/algorithm/tree/red-black-tree-delete-03.png" />
</div>

3.4 S是黑色的，S的右孩子是红色

在这种情况下我们在 N 的父亲上做左旋转，这样 S 成为 N 的父亲和 S 的右儿子的父亲。我们接着交换 N 的父亲和 S 的颜色，并使 S 的右儿子为黑色。子树在它的根上的仍是同样的颜色，所以属性 3 没有被违反。但是，N 现在增加了一个黑色祖先: 要么 N 的父亲变成黑色，要么它是黑色而 S 被增加为一个黑色祖父。所以，通过 N 的路径都增加了一个黑色节点。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/images/algorithm/tree/red-black-tree-delete-04.png" />
</div>

## 示例代码

### 红黑树插入操作调整

fixAfterInsertion 方法摘自 JDK8 的 TreeMap.java。

阅读本示例前，请参看本文的“插入操作”一节。

```java
 private void fixAfterInsertion(Entry<K,V> x) {
    // 2. 将新节点的 color 赋为红色
    x.color = RED;

    // 3. 自下而上重新调整该树为红黑树
    while (x != null && x != root && x.parent.color == RED) { // 如果父节点是黑色的，则整棵树不必调整便是红黑树。
        if (parentOf(x) == leftOf(parentOf(parentOf(x)))) { // 父节点是祖父节点的左节点
            Entry<K,V> y = rightOf(parentOf(parentOf(x))); // 叔叔节点
            if (colorOf(y) == RED) { // 3.1 叔叔节点是红色的
                setColor(parentOf(x), BLACK);
                setColor(y, BLACK);
                setColor(parentOf(parentOf(x)), RED);
                x = parentOf(parentOf(x));
            } else {
                // 3.2 新节点是右孩子节点：左旋新节点和父节点；调换新节点和父节点的颜色；右旋祖父节点
                if (x == rightOf(parentOf(x))) {
                    x = parentOf(x);
                    rotateLeft(x); // 父节点左旋
                }
                setColor(parentOf(x), BLACK);
                setColor(parentOf(parentOf(x)), RED);
                rotateRight(parentOf(parentOf(x)));
            }
        } else { // 父节点是祖父节点的右节点
            Entry<K,V> y = leftOf(parentOf(parentOf(x))); // 叔叔节点
            if (colorOf(y) == RED) { // 3.1 叔叔节点是红色的
                setColor(parentOf(x), BLACK);
                setColor(y, BLACK);
                setColor(parentOf(parentOf(x)), RED);
                x = parentOf(parentOf(x));
            } else {
                // 新节点是左孩子节点
                if (x == leftOf(parentOf(x))) {
                    x = parentOf(x);
                    rotateRight(x); // 父节点右旋
                }
                setColor(parentOf(x), BLACK); // 原父亲节点设为黑色
                setColor(parentOf(parentOf(x)), RED); // 原祖父节点设为红色
                rotateLeft(parentOf(parentOf(x)));
            }
        }
    }
    root.color = BLACK;
}
```

### 红黑树删除操作调整

fixAfterDeletion 方法摘自 JDK8 的 TreeMap.java。

阅读本示例前，请参看本文的“删除操作”一节。

```java
private void fixAfterDeletion(Entry<K,V> x) {
    while (x != root && colorOf(x) == BLACK) {
        if (x == leftOf(parentOf(x))) {
            Entry<K,V> sib = rightOf(parentOf(x));

            if (colorOf(sib) == RED) {
                setColor(sib, BLACK);
                setColor(parentOf(x), RED);
                rotateLeft(parentOf(x));
                sib = rightOf(parentOf(x));
            }

            if (colorOf(leftOf(sib))  == BLACK &&
                colorOf(rightOf(sib)) == BLACK) {
                setColor(sib, RED);
                x = parentOf(x);
            } else {
                if (colorOf(rightOf(sib)) == BLACK) {
                    setColor(leftOf(sib), BLACK);
                    setColor(sib, RED);
                    rotateRight(sib);
                    sib = rightOf(parentOf(x));
                }
                setColor(sib, colorOf(parentOf(x)));
                setColor(parentOf(x), BLACK);
                setColor(rightOf(sib), BLACK);
                rotateLeft(parentOf(x));
                x = root;
            }
        } else { // symmetric
            Entry<K,V> sib = leftOf(parentOf(x));

            if (colorOf(sib) == RED) {
                setColor(sib, BLACK);
                setColor(parentOf(x), RED);
                rotateRight(parentOf(x));
                sib = leftOf(parentOf(x));
            }

            if (colorOf(rightOf(sib)) == BLACK &&
                colorOf(leftOf(sib)) == BLACK) {
                setColor(sib, RED);
                x = parentOf(x);
            } else {
                if (colorOf(leftOf(sib)) == BLACK) {
                    setColor(rightOf(sib), BLACK);
                    setColor(sib, RED);
                    rotateLeft(sib);
                    sib = leftOf(parentOf(x));
                }
                setColor(sib, colorOf(parentOf(x)));
                setColor(parentOf(x), BLACK);
                setColor(leftOf(sib), BLACK);
                rotateRight(parentOf(x));
                x = root;
            }
        }
    }

    setColor(x, BLACK);
}
```

## 资料

https://zh.wikipedia.org/wiki/%E7%BA%A2%E9%BB%91%E6%A0%91
