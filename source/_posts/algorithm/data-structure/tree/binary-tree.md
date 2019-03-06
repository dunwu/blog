---
title: 二叉树
date: 2019-03-06
---

# 二叉树

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/data-structure/tree/二叉树.png"/></div><br>

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
  - [二叉树的性质](#二叉树的性质)
  - [满二叉树](#满二叉树)
  - [完全二叉树](#完全二叉树)

<!-- /TOC -->

## 简介

二叉树是 N 个节点的有限集合，它或者是空树，或者是由一个根节点及两棵不想交的且分别称为左右子树的二叉树所组成。

### 二叉树的性质

1. 二叉树第 i 层上的结点数目最多为 **2<sup>i-1</sup>** (i≥1)。
2. 深度为 k 的二叉树至多有 **2<sup>k</sup>-1** 个结点(k≥1)。
3. 包含 n 个结点的二叉树的高度至少为 **log<sub>2</sub>(n+1)**。
4. 在任意一棵二叉树中，若终端结点的个数为 n0，度为 2 的结点数为 n2，则 n0=n2+1。

### 满二叉树

定义：高度为 h，并且由 **2<sup>h</sup>–1** 个结点的二叉树，被称为满二叉树。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/data-structure/tree/满二叉树.png"/></div><br>

### 完全二叉树

定义：一棵二叉树中，只有最下面两层结点的度可以小于 2，并且最下一层的叶结点集中在靠左的若干位置上。这样的二叉树称为完全二叉树。

特点：叶子结点只能出现在最下层和次下层，且最下层的叶子结点集中在树的左部。显然，一棵满二叉树必定是一棵完全二叉树，而完全二叉树未必是满二叉树。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/data-structure/tree/完全二叉树.png"/></div><br>
