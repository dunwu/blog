---
title: 《The Log-Structured Merge-Tree (LSM-Tree)》笔记
date: 2023-09-05 19:52:01
order: 02
categories:
  - 笔记
  - 分布式
  - 分布式存储
tags:
  - 分布式
  - 分布式存储
  - HBASE
permalink: /pages/0a571d7d/
---

# 《The Log-Structured Merge-Tree (LSM-Tree)》笔记

LSM 被广泛应用于很多以文件结构存储数据的数据库，如：HBase, Cassandra, LevelDB, SQLite。

LSM 的设计目标：通过顺序写来提高写操作吞吐量，替代传统的 B+ 树或 ISAM。

## 参考资料

- 原文
- [The Log-Structured-Merge-Tree](chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.cs.umb.
  edu/~poneil/lsmtree.pdf)
- 扩展阅读
- [Log Structured Merge Trees(LSM) 原理](https://www.open-open.com/lib/view/open1424916275249.html)
- [Log Structured Merge Tree](chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://lrita.github.io/images/posts/database/lsmtree-170129180333.pdf)