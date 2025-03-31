---
icon: openmoji:military-medal
title: MongoDB 面试
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202503062328094.jpg
date: 2025-03-04 21:03:08
categories:
  - 数据库
  - 文档数据库
  - mongodb
tags:
  - 数据库
  - 文档数据库
  - mongodb
  - 面试
permalink: /pages/edc11157/
---

# MongoDB 面试

<!-- more -->

## MongoDB 简介

> 扩展阅读：
>
> - [MongoDB 官方文档之 MongoDB 简介](https://www.mongodb.com/zh-cn/docs/manual/introduction/)
> - [MongoDB 简史](https://www.infoq.cn/article/3d4suwkc2fvikykemnvw)
> - [MongoDB 发展历史及各主要版本新特性概述](https://blog.csdn.net/JiekeXu/article/details/143670868)

### 【基础】MongoDB 是什么？

:::details 要点

MongoDB 是一个**面向文档**的开源 NoSQL 数据库系统，由 **C++** 编写的。MongoDB 支持“**无模式**”的数据建模，可以存储比较复杂的数据类型，是一款非常流行的 **文档类型数据库** 。

在高负载的情况下，MongoDB 天然支持水平扩展和高可用，可以很方便地添加更多的节点/实例，以保证服务性能和可用性。在许多场景下，MongoDB 可以用于代替传统的关系型数据库或键/值存储方式，皆在为 Web 应用提供可扩展的高可用高性能数据存储解决方案。

MongoDB 提供了丰富的功能：

- [**读写操作 (CRUD)**](https://www.mongodb.com/zh-cn/docs/manual/crud/#std-label-crud)
- [**数据聚合**](https://www.mongodb.com/zh-cn/docs/manual/core/aggregation-pipeline/#std-label-aggregation-pipeline)
- [**文本搜索**](https://www.mongodb.com/zh-cn/docs/manual/text-search/#std-label-text-search)
- [**地理空间搜索**](https://www.mongodb.com/zh-cn/docs/manual/tutorial/geospatial-tutorial/)
- ...

:::

### 【基础】MongoDB 有什么特性？

:::details 要点

MongoDB 主要有以下特性：

- **面向文档** - MongoDB 将数据记录存储为 [BSON 文档](https://www.mongodb.com/zh-cn/docs/manual/core/document/#std-label-bson-document-format)。BSON 是 [JSON](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-JSON) 文档的二进制表示形式，尽管它包含的数据类型比 JSON 多。最大 BSON 文档大小为 16 MB。
- **无模式** - MongoDB 中没有预定义模式（predefined schema），文档键值的类型和大小不是固定的。由于没有固定的模式，因此按需添加或删除字段变得更容易。
- **丰富的查询方式** - MongoDB 支持基本的 CRUD 以及数据聚合、文本搜索和地理空间查询。
- **丰富的索引类型** - MongoDB 支持多种类型的索引，包括单字段索引、复合索引、多键索引、哈希索引、文本索引、 地理位置索引等，每种类型的索引有不同的使用场合。
- **支持 ACID 事务** - NoSQL 通常不支持事务，但 MongoDB 支持事务，且 MongoDB 支持 ACID。
  - MongoDB 单文档支持原子性，也具备事务的特性。
  - MongoDB 4.0 加入了对多文档事务的支持，但只支持复制集部署模式下的事务，也就是说事务的作用域限制为一个副本集内。
  - MongoDB 4.2 引入了分布式事务，增加了对分片集群上多文档事务的支持，并合并了对副本集上多文档事务的现有支持。
- **支持压缩**：存储同样的数据所需的资源更少。
- **支持 map-reduce** - 通过分治的方式完成复杂的聚合任务。不过，从 MongoDB 5.0 开始，map-reduce 已经不被官方推荐使用了，替代方案是 [聚合管道](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)。聚合管道提供比 map-reduce 更好的性能和可用性。
- **支持存储大文件**：MongoDB 的单文档存储空间要求不超过 16MB。对于超过 16MB 的大文件，MongoDB 提供了 GridFS 来进行存储，通过 GridFS，可以将大型数据进行分块处理，然后将这些切分后的小文档保存在数据库中。

MongoDB 作为分布式存储，自然也具备了分布式的一般特性：

- **高可用** - 通过**复制**机制实现**高可用**，提供**数据冗余**和**自动故障转移**能力。在 MongoDB 中，这种机制称为 [**副本集**](https://www.mongodb.com/zh-cn/docs/manual/replication/)。[**副本集**](https://www.mongodb.com/zh-cn/docs/manual/replication/) 是一组 MongoDB 服务器，它们维护相同的数据集，并可提供冗余和提高数据可用性。
- **高性能** - 通过**分片**机制提供**水平扩容**能力，以支撑海量数据，海量并发。从 3.4 开始，MongoDB 支持基于 [**分片键**](https://www.mongodb.com/zh-cn/docs/manual/core/zone-sharding/#std-label-zone-sharding) 创建数据的 [**区域**](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard-key)。在均衡的集群中，MongoDB 仅将区域覆盖的读写定向到区域内的那些分片。

:::

### 【基础】MongoDB 适合什么应用场景？

:::details 要点

**MongoDB 的优势在于其数据模型和存储引擎的灵活性、架构的可扩展性以及对强大的索引支持。**

选用 MongoDB 应该充分考虑 MongoDB 的优势，结合实际项目的需求来决定：

- 随着项目的发展，使用类 JSON 格式（BSON）保存数据是否满足项目需求？MongoDB 中的记录就是一个 BSON 文档，它是由键值对组成的数据结构，类似于 JSON 对象，是 MongoDB 中的基本数据单元。
- 是否需要大数据量的存储？是否需要快速水平扩展？MongoDB 支持分片集群，可以很方便地添加更多的节点（实例），让集群存储更多的数据，具备更强的性能。
- 是否需要更多类型索引来满足更多应用场景？MongoDB 支持多种类型的索引，包括单字段索引、复合索引、多键索引、哈希索引、文本索引、 地理位置索引等，每种类型的索引有不同的使用场合。
- ……

:::

### 【基础】MongoDB vs.RDBM？

:::details 要点

MongoDB vs.RDBM：

| 特性      | MongoDB                                          | RDBMS    |
| --------- | ------------------------------------------------ | -------- |
| 数据模型  | 文档模型                                         | 关系型   |
| CRUD 操作 | MQL/SQL                                          | SQL      |
| 高可用    | 复制集                                           | 集群模式 |
| 扩展性    | 支持分片                                         | 数据分区 |
| 扩繁方式  | 垂直扩展+水平扩展                                | 垂直扩展 |
| 索引类型  | B 树、全文索引、地理位置索引、多键索引、TTL 索引 | B 树     |
| 数据容量  | 没有理论上限                                     | 千万、亿 |

:::

### 【基础】MongoDB 有哪些里程碑版本？

:::details 要点

MongoDB 是由 **10gen** 开发的 NoSQL 数据库，该公司由 Dwight Merriman 和 Eliot Horowitz 于 2007 年创立。2013 年，**10gen 更名为 MongoDB Inc**.。以更好地反映其对 MongoDB 数据库开发的关注。2017 年，MongoDB 公司上市。

里程碑版本：

- **1.0** - 2009 年，MongoDB 发布第一版。
- **1.6** - 2010 年，引入分片机制（Sharding），支持水平扩展。
- **2.2** - 2012 年，引入了聚合管道（Pipeline）。
- **2.4** - 2013 年，引入了全文搜索。
- **3.0** - 2015 年，全面支持 **WiredTiger** 存储引擎，并支持可插拔存储引擎。
- **4.0** - 2019 年，支持 ACID 事务。
- **4.2** - 2020 年，支持分布式事务。

> 扩展阅读：
>
> - [MongoDB 简史](https://www.infoq.cn/article/3d4suwkc2fvikykemnvw)
> - [MongoDB 发展历史及各主要版本新特性概述](https://blog.csdn.net/JiekeXu/article/details/143670868)

:::

## MongoDB 聚合

> 扩展阅读：[MongoDB 官方文档之聚合](https://www.mongodb.com/zh-cn/docs/manual/aggregation/)

### 【基础】MongoDB 支持哪些聚合方式？

:::details 要点

聚合操作处理多个文档并返回计算结果。可以使用聚合操作来：

- 将多个文档中的值组合在一起。
- 对分组数据执行操作，返回单一结果。
- 分析一段时间内的数据变化。

若要执行聚合操作，可以使用：

- [聚合管道](https://www.mongodb.com/zh-cn/docs/manual/aggregation/#std-label-aggregation-pipeline-intro)，这是执行聚合的首选方法。
- [单一目的聚合方法](https://www.mongodb.com/zh-cn/docs/manual/aggregation/#std-label-single-purpose-agg-methods)，这些方法很简单，但缺乏聚合管道的功能。
- [Map-Reduce](https://www.mongodb.com/zh-cn/docs/manual/core/Map-Reduce/)，从 MongoDB 5.0 开始，[Map-Reduce](https://www.mongodb.com/zh-cn/docs/manual/core/Map-Reduce/#std-label-Map-Reduce) 已被弃用。聚合管道提供的性能和可用性比 Map-Reduce 更优越。

:::

### 【中级】什么是聚合管道？

:::details 要点

聚合管道由一个或多个处理文档的 [阶段](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference) 组成：

- 每个阶段对输入文档执行一个操作。例如，某个阶段可以过滤文档、对文档进行分组并计算值。
- 从一个阶段输出的文档将传递到下一阶段。
- 一个聚合管道可以返回针对文档组的结果。例如，返回总值、平均值、最大值和最小值。

如使用 [通过聚合管道更新](https://www.mongodb.com/zh-cn/docs/manual/tutorial/update-documents-with-aggregation-pipeline/#std-label-updates-agg-pipeline) 中显示的阶段，则可以通过聚合管道更新文档。

> 注意：使用 [`db.collection.aggregate()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.aggregate/#mongodb-method-db.collection.aggregate) 方法运行的聚合管道不会修改集合中的文档，除非管道包含 [`$merge`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge) 或 [`$out`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out) 阶段。

![MongoDB 聚合](https://raw.githubusercontent.com/dunwu/images/master/snap/20200921092725.png)

[阶段](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference) 的其他要点：

- 阶段不必为每个输入文档输出一个文档。例如，某些阶段可能会产生新文档或过滤掉现有文档。
- 同一个阶段可以在管道中多次出现，但以下阶段例外：[`$out`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)、[`$merge`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge) 和 [`$geoNear`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)。
- 要在阶段中计算平均值和执行其他计算，请使用指定 [聚合操作符](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/#std-label-aggregation-expressions) 的 [聚合表达式](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/#std-label-aggregation-expression-operators)。

MongoDB 聚合管道提供了许多等价于 SQL 中常见聚合语句的操作。 下表概述了常见的 SQL 聚合语句或函数和 MongoDB 聚合操作的映射表：

| RDBM 操作               | MongoDB 聚合操作                                                                                                                                                                                          |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WHERE`                 | [`$match`](https://docs.mongodb.com/manual/reference/operator/aggregation/match/#pipe._S_match)                                                                                                           |
| `GROUP BY`              | [`$group`](https://docs.mongodb.com/manual/reference/operator/aggregation/group/#pipe._S_group)                                                                                                           |
| `HAVING`                | [`$match`](https://docs.mongodb.com/manual/reference/operator/aggregation/match/#pipe._S_match)                                                                                                           |
| `SELECT`                | [`$project`](https://docs.mongodb.com/manual/reference/operator/aggregation/project/#pipe._S_project)                                                                                                     |
| `ORDER BY`              | [`$sort`](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/#pipe._S_sort)                                                                                                              |
| `LIMIT`                 | [`$limit`](https://docs.mongodb.com/manual/reference/operator/aggregation/limit/#pipe._S_limit)                                                                                                           |
| `SUM()`                 | [`$sum`](https://docs.mongodb.com/manual/reference/operator/aggregation/sum/#grp._S_sum)                                                                                                                  |
| `COUNT()`               | [`$sum`](https://docs.mongodb.com/manual/reference/operator/aggregation/sum/#grp._S_sum)[`$sortByCount`](https://docs.mongodb.com/manual/reference/operator/aggregation/sortByCount/#pipe._S_sortByCount) |
| `JOIN`                  | [`$lookup`](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#pipe._S_lookup)                                                                                                        |
| `SELECT INTO NEW_TABLE` | [`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out)                                                                                                                 |
| `MERGE INTO TABLE`      | [`$merge`](https://docs.mongodb.com/manual/reference/operator/aggregation/merge/#pipe._S_merge) (Available starting in MongoDB 4.2)                                                                       |
| `UNION ALL`             | [`$unionWith`](https://docs.mongodb.com/manual/reference/operator/aggregation/unionWith/#pipe._S_unionWith) (Available starting in MongoDB 4.4)                                                           |

下面通过一个示例来展示，如何通过 MongoDB 聚合计算总订单数量：

以下聚合管道示例包含两个 [阶段](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference)，并返回按披萨名称分组后，各款中号披萨的总订单数量：

```javascript
db.orders.aggregate([
  // Stage 1: 根据 size 过滤订单
  {
    $match: { size: 'medium' }
  },
  // Stage 2: 按名称对剩余文档进行分组，并计算总数量
  {
    $group: { _id: '$name', totalQuantity: { $sum: '$quantity' } }
  }
])[
  // 输出
  ({ _id: 'Cheese', totalQuantity: 50 },
  { _id: 'Vegan', totalQuantity: 10 },
  { _id: 'Pepperoni', totalQuantity: 20 })
]
```

[`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段：

- 从披萨订单文档过滤出 `size` 为 `medium` 的披萨。
- 将剩余文档传递到 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 阶段。

[`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 阶段：

- 按披萨 `name` 对剩余文档进行分组。
- 使用 [`$sum`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sum/#mongodb-group-grp.-sum) 计算每种披萨 `name` 的总订单 `quantity`。总数存储在聚合管道返回的 `totalQuantity` 字段中。

:::

### 【基础】RDBM 聚合 vs. MongoDB 聚合？

:::details 要点

MongoDB pipeline 提供了许多等价于 SQL 中常见聚合语句的操作。 下表概述了常见的 SQL 聚合语句或函数和 MongoDB 聚合操作的映射表：

| RDBM 操作               | MongoDB 聚合操作                                                                                                                                                                                          |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WHERE`                 | [`$match`](https://docs.mongodb.com/manual/reference/operator/aggregation/match/#pipe._S_match)                                                                                                           |
| `GROUP BY`              | [`$group`](https://docs.mongodb.com/manual/reference/operator/aggregation/group/#pipe._S_group)                                                                                                           |
| `HAVING`                | [`$match`](https://docs.mongodb.com/manual/reference/operator/aggregation/match/#pipe._S_match)                                                                                                           |
| `SELECT`                | [`$project`](https://docs.mongodb.com/manual/reference/operator/aggregation/project/#pipe._S_project)                                                                                                     |
| `ORDER BY`              | [`$sort`](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/#pipe._S_sort)                                                                                                              |
| `LIMIT`                 | [`$limit`](https://docs.mongodb.com/manual/reference/operator/aggregation/limit/#pipe._S_limit)                                                                                                           |
| `SUM()`                 | [`$sum`](https://docs.mongodb.com/manual/reference/operator/aggregation/sum/#grp._S_sum)                                                                                                                  |
| `COUNT()`               | [`$sum`](https://docs.mongodb.com/manual/reference/operator/aggregation/sum/#grp._S_sum)[`$sortByCount`](https://docs.mongodb.com/manual/reference/operator/aggregation/sortByCount/#pipe._S_sortByCount) |
| `JOIN`                  | [`$lookup`](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#pipe._S_lookup)                                                                                                        |
| `SELECT INTO NEW_TABLE` | [`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out)                                                                                                                 |
| `MERGE INTO TABLE`      | [`$merge`](https://docs.mongodb.com/manual/reference/operator/aggregation/merge/#pipe._S_merge) (Available starting in MongoDB 4.2)                                                                       |
| `UNION ALL`             | [`$unionWith`](https://docs.mongodb.com/manual/reference/operator/aggregation/unionWith/#pipe._S_unionWith) (Available starting in MongoDB 4.4)                                                           |

RDBM 聚合 vs. MongoDB 聚合：

![SQL 聚合 vs. MongoDB 聚合](https://raw.githubusercontent.com/dunwu/images/master/snap/20200921200556.png)

:::

### 【中级】MongoDB Map-Reduce 有什么用？

:::details 要点

> 从 MongoDB 5.0 开始，[Map-Reduce](https://www.mongodb.com/zh-cn/docs/manual/core/Map-Reduce/#std-label-Map-Reduce) 已被弃用。聚合管道提供的性能和可用性比 Map-Reduce 更优越。

Map-Reduce 是一种数据处理范式，用于将大量数据汇总为有用的聚合结果。为了执行 Map-Reduce 操作，MongoDB 提供了 [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) 数据库命令。

![Map-Reduce](https://raw.githubusercontent.com/dunwu/images/master/snap/20200921155546.svg)

在上面的操作中，MongoDB 将 map 阶段应用于每个输入 document（即 collection 中与查询条件匹配的 document）。 map 函数分发出多个键 - 值对。对于具有多个值的那些键，MongoDB 应用 reduce 阶段，该阶段收集并汇总聚合的数据。然后，MongoDB 将结果存储在 collection 中。可选地，reduce 函数的输出可以通过 finalize 函数来进一步汇总聚合结果。

MongoDB 中的所有 Map-Reduce 函数都是 JavaScript，并在 mongod 进程中运行。 Map-Reduce 操作将单个 collection 的 document 作为输入，并且可以在开始 map 阶段之前执行任意排序和限制。 mapReduce 可以将 Map-Reduce 操作的结果作为 document 返回，也可以将结果写入 collection。

:::

## MongoDB 存储

### 【基础】MongoDB 支持哪些数据类型？

:::details 要点

Java 类似数据类型：

| 类型       | 解析                                                                            |
| :--------- | :------------------------------------------------------------------------------ |
| `String`   | 字符串。存储数据常用的数据类型。在 `MongoDB` 中，`UTF-8` 编码的字符串才是合法的 |
| `Integer`  | 整型数值。用于存储数值。根据你所采用的服务器，可分为 32 位或 64 位              |
| `Double`   | 双精度浮点值。用于存储浮点值                                                    |
| `Boolean`  | 布尔值。用于存储布尔值（真/假）                                                 |
| `Arrays`   | 用于将数组或列表或多个值存储为一个键                                            |
| `Datetime` | 记录文档修改或添加的具体时间                                                    |

MongoDB 特有数据类型：

| 类型                 | 解析                                                                        |
| :------------------- | :-------------------------------------------------------------------------- |
| `ObjectId`           | 用于存储文档 `id`,`ObjectId`是基于分布式主键的实现`MongoDB`分片也可继续使用 |
| `Min/Max Keys`       | 将一个值与 BSON（二进制的 JSON）元素的最低值和最高值相对比                  |
| `Code`               | 用于在文档中存储 `JavaScript`代码                                           |
| `Regular Expression` | 用于在文档中存储正则表达式                                                  |
| `Binary Data`        | 二进制数据。用于存储二进制数据                                              |
| `Null`               | 用于创建空值                                                                |
| `Object`             | 用于内嵌文档                                                                |

:::

### 【基础】MongoDB 的逻辑存储是什么？

:::details 要点

MongoDB 将数据记录存储为 [BSON 文档](https://www.mongodb.com/zh-cn/docs/manual/core/document/#std-label-bson-document-format)。BSON 是 [JSON](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-JSON) 文档的二进制表示形式，尽管它包含的数据类型比 JSON 多。最大 BSON 文档大小为 16 MB。

每个 MongoDB 文档都需要一个唯一的 [`_id`](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-_id) 字段作为 [主键](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-primary-key)。如果插入的文档省略了 `_id` 字段，则 MongoDB 驱动程序会自动为 `_id` 字段生成 [ObjectId](https://www.mongodb.com/zh-cn/docs/manual/reference/bson-types/#std-label-objectid)。

这些 [MongoDB 文档](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-document) 收集在 [集合](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-collection) 中。[数据库](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-database) 存储一个或多个文档集合。

为了方便理解 MongoDB 概念，下面将 MongoDB 概念和 RDBM 概念进行对比：

| RDBM 概念          | MongoDB 概念                                                                        |
| :----------------- | :---------------------------------------------------------------------------------- |
| database（数据库） | database（数据库）                                                                  |
| table（表）        | collection（集合）                                                                  |
| row（行）          | document（文档）                                                                    |
| column（列）       | field（字段）                                                                       |
| index（索引）      | index（索引）                                                                       |
| primary key        | [`_id`](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-_id) |

#### 文档

文档是 MongoDB 中的**基本数据单元**。**文档是一组有序键值对（即 BSON）**。MongoDB 的文档不需要设置相同的字段，并且相同的字段不需要相同的数据类型，这与关系型数据库有很大的区别，也是 MongoDB 非常突出的特点。

![MongoDB Document](https://raw.githubusercontent.com/dunwu/images/master/snap/202503041024526.png)

需要注意的是：

- **文档中的键/值对是有序的**。

- 文档的键是字符串。除了少数例外情况，**键可以使用任意 UTF-8 字符**。

- 文档中的值不仅可以是在双引号里面的字符串，还可以是其他几种数据类型（甚至可以是整个嵌入的文档）。

- **MongoDB 区分类型和大小写**。例如，下面这两对文档是不同的：

  ```json
  {"count" : 5}
  {"count" : "5"}

  {"count" : 5}
  {"Count" : 5}
  ```

- MongoDB 的文档不能有重复的键。例如，下面这个文档是不合法的

  ```json
  {"greeting" : "Hello, world!", "greeting" : "Hello, MongoDB!"
  ```

文档键命名规范：

- 键不能含有 `\0` （空字符）。这个字符用来表示键的结尾。
- `.` 和 `$` 有特别的意义，只有在特定环境下才能使用。
- 以下划线 `_` 开头的键是保留的（不是严格要求的）。

#### 集合

集合就是 MongoDB 文档组，类似于 RDBMS （关系数据库管理系统：Relational Database Management System) 中的表（Table）。集合存在于数据库中，集合没有固定的结构，这意味着你在对集合可以插入不同格式和类型的数据，但通常情况下我们插入集合的数据都会有一定的关联性。

![MongoDB Collection](https://raw.githubusercontent.com/dunwu/images/master/snap/202503041024137.png)

集合不需要事先创建，当第一个文档插入或者第一个索引创建时，如果该集合不存在，则会创建一个新的集合。使用 `.` 字符分隔不同命名空间的子集合是一种组织集合的惯例。例如，有一个具有博客功能的应用程序，可能包含名为 `blog.posts` 和名为 `blog.authors` 的集合。

合法的集合名：

- 集合名称不能是空字符串（""）。
- 集合名称不能含有 `\0`（空字符），因为这个字符用于表示一个集合名称的结束。
- 集合名称不能以 `system.` 开头，该前缀是为内部集合保留的。例如，`system.users` 集合中保存着数据库的用户，`system.namespaces` 集合中保存着有关数据库所有集合的信息。
- 用户创建的集合名称中不应包含保留字符 `$`。许多驱动程序确实支持在集合名称中使用 `$`，这是因为某些由系统生成的集合会包含它，但除非你要访问的是这些集合之一，否则不应在名称中使用 `$` 字符。

#### 数据库

数据库用于存储所有集合，而集合又用于存储所有文档。一个 MongoDB 中可以创建多个数据库，每一个数据库都有自己的集合和权限。MongoDB 的单个实例可以容纳多个独立的数据库，每一个都有自己的集合和权限，不同的数据库也放置在不同的文件中。

MongoDB 的默认数据库为"db"，该数据库存储在 data 目录中。

**"show dbs"** 命令可以显示所有数据的列表。

```shell
$ ./mongo
MongoDBshell version: 3.0.6
connecting to: test
> show dbs
local  0.078GB
test   0.078GB
```

执行 **"db"** 命令可以显示当前数据库对象或集合。

```shell
$ ./mongo
MongoDBshell version: 3.0.6
connecting to: test
> db
test
```

运行"use"命令，可以连接到一个指定的数据库。

```shell
> use local
switched to db local
> db
local
```

数据库按照名称进行标识的。数据库名称可以是任意 UTF-8 字符串，但有以下限制：

- 数据库名称不能是空字符串（""）。
- 数据库名称不能包含 `/`、`\`、`.`、`"`、`*`、`<`、`>`、`:`、`|`、`?`、`$`、单一的空格以及 `\0`（空字符），基本上只能使用 ASCII 字母和数字。
- 数据库名称区分大小写。
- 数据库名称的长度限制为 64 字节。

有一些数据库名是保留的，可以直接访问这些有特殊作用的数据库。

- **admin**：admin 数据库会在身份验证和授权时被使用。此外，某些管理操作需要访问此数据库。
- **local**：这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合
- **config**：当 Mongo 用于分片设置时，config 数据库在内部使用，用于保存分片的相关信息。

#### 元数据

数据库的信息是存储在集合中。它们使用了系统的命名空间：`dbname.system.*`

在 MongoDB 数据库中命名空间 `<dbname>.system.*` 是包含多种系统信息的特殊集合 (Collection)，如下：

| 集合命名空间               | 描述                                      |
| :------------------------- | :---------------------------------------- |
| `dbname.system.namespaces` | 列出所有名字空间。                        |
| `dbname.system.indexes`    | 列出所有索引。                            |
| `dbname.system.profile`    | 包含数据库概要 (profile) 信息。           |
| `dbname.system.users`      | 列出所有可访问数据库的用户。              |
| `dbname.local.sources`     | 包含复制对端（slave）的服务器信息和状态。 |

对于修改系统集合中的对象有如下限制。

在 `system.indexes` 插入数据，可以创建索引。但除此之外该表信息是不可变的（特殊的 drop index 命令将自动更新相关信息）。`system.users` 是可修改的。`system.profile` 是可删除的。

:::

### 【中级】MongoDB 支持哪些存储引擎？

:::details 要点

存储引擎（Storage Engine）是数据库的核心组件，负责管理数据在内存和磁盘中的存储方式。

与 MySQL 一样，MongoDB 采用的也是 **插件式的存储引擎架构** ，支持不同类型的存储引擎，不同的存储引擎解决不同场景的问题。在创建数据库或集合时，可以指定存储引擎。

> 插件式的存储引擎架构可以实现 Server 层和存储引擎层的解耦，可以支持多种存储引擎，如 MySQL 既可以支持 B-Tree 结构的 InnoDB 存储引擎，还可以支持 LSM 结构的 RocksDB 存储引擎。

在存储引擎刚出来的时候，默认是使用 MMAPV1 存储引擎，MongoDB4.x 版本不再支持 MMAPv1 存储引擎。

现在主要有下面这两种存储引擎：

- **WiredTiger 存储引擎**：自 MongoDB 3.2 以后，默认的存储引擎为 [WiredTiger 存储引擎](https://www.mongodb.com/docs/manual/core/wiredtiger/) 。非常适合大多数工作负载，建议用于新部署。WiredTiger 提供文档级并发模型、检查点和数据压缩（后文会介绍到）等功能。
- **In-Memory 存储引擎**：[In-Memory 存储引擎](https://www.mongodb.com/docs/manual/core/inmemory/) 在 MongoDB Enterprise 中可用。它不是将文档存储在磁盘上，而是将它们保留在内存中以获得更可预测的数据延迟。

此外，MongoDB 3.0 提供了 **可插拔的存储引擎 API** ，允许第三方为 MongoDB 开发存储引擎，这点和 MySQL 也比较类似。

:::

### 【中级】MongoDB 支持哪些亚索算法？

:::details 要点

借助 WiredTiger 存储引擎（ MongoDB 3.2 后的默认存储引擎），MongoDB 支持对所有集合和索引进行压缩。压缩以额外的 CPU 为代价最大限度地减少存储使用。

默认情况下，WiredTiger 使用 [Snappy](https://github.com/google/snappy) 压缩算法（谷歌开源，旨在实现非常高的速度和合理的压缩，压缩比 3 ～ 5 倍）对所有集合使用块压缩，对所有索引使用前缀压缩。

除了 Snappy 之外，对于集合还有下面这些压缩算法：

- [zlib](https://github.com/madler/zlib)：高度压缩算法，压缩比 5 ～ 7 倍
- [Zstandard](https://github.com/facebook/zstd)（简称 zstd）：Facebook 开源的一种快速无损压缩算法，针对 zlib 级别的实时压缩场景和更好的压缩比，提供更高的压缩率和更低的 CPU 使用率，MongoDB 4.2 开始可用。

WiredTiger 日志也会被压缩，默认使用的也是 Snappy 压缩算法。如果日志记录小于或等于 128 字节，WiredTiger 不会压缩该记录。

:::

### 【中级】WiredTiger 基于 LSM Tree 还是 B+ Tree？

:::details 要点

目前绝大部分流行的数据库存储引擎都是基于 B/B+ Tree 或者 LSM(Log Structured Merge) Tree 来实现的。对于 NoSQL 数据库来说，绝大部分（比如 HBase、Cassandra、RocksDB）都是基于 LSM 树，MongoDB 不太一样。

上面也说了，自 MongoDB 3.2 以后，默认的存储引擎为 WiredTiger 存储引擎。在 WiredTiger 引擎官网上，我们发现 WiredTiger 使用的是 B+ 树作为其存储结构：

```
WiredTiger maintains a table's data in memory using a data structure called a B-Tree ( B+ Tree to be specific), referring to the nodes of a B-Tree as pages. Internal pages carry only keys. The leaf pages store both keys and values.
```

此外，WiredTiger 还支持 [LSM(Log Structured Merge)](https://source.wiredtiger.com/3.1.0/lsm.html) 树作为存储结构，MongoDB 在使用 WiredTiger 作为存储引擎时，默认使用的是 B+ 树。

如果想要了解 MongoDB 使用 B+ 树的原因，可以看看这篇文章：[【驳斥八股文系列】别瞎分析了，MongoDB 使用的是 B+ 树，不是你们以为的 B 树](https://zhuanlan.zhihu.com/p/519658576)。

使用 B+ 树时，WiredTiger 以 **page** 为基本单位往磁盘读写数据。B+ 树的每个节点为一个 page，共有三种类型的 page：

- **root page（根节点）**：B+ 树的根节点。
- **internal page（内部节点）**：不实际存储数据的中间索引节点。
- **leaf page（叶子节点）**：真正存储数据的叶子节点，包含一个页头（page header）、块头（block header）和真正的数据（key/value），其中页头定义了页的类型、页中实际载荷数据的大小、页中记录条数等信息；块头定义了此页的 checksum、块在磁盘上的寻址位置等信息。

其整体结构如下图所示：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503041050392.png)

如果想要深入研究学习 WiredTiger 存储引擎，推荐阅读 MongoDB 中文社区的 [WiredTiger 存储引擎系列](https://mongoing.com/archives/category/wiredtiger 存储引擎系列)。

:::

## MongoDB 索引

> 扩展阅读：
>
> - [MongoDB 官方文档之索引](https://www.mongodb.com/zh-cn/docs/manual/indexes/)
> - [你真的会用索引么？[Mongo]](https://zhuanlan.zhihu.com/p/77971681)

### 【基础】MongoDB 索引有什么用？

:::details 要点

**MongoDB 在 collection 数据级别上定义索引**。

索引通常能够极大的提高查询的效率。如果**没有索引**，MongoDB 在读取数据时**必须扫描 collection 中的每个 document** 并选取那些符合查询条件的记录。这种扫描全集合的查询是非常低效的，特别是在处理大量的数据时。查询可能要花费几十秒甚至几分钟，这种性能开销是不可接受的。索引可提高查询性能，但**添加索引会影响写入操作的性能**。对于写入读取率高的集合，由于每次插入操作都必须同时更新所有索引，因此会带来较高的索引成本。

索引是一种特殊的数据结构，它以易于遍历的形式存储一小部分集合数据集。**MongoDB 索引使用 [B-tree](https://en.wikipedia.org/wiki/B-tree) 数据结构**。索引可存储某个特定字段或多个字段的值，并按字段的值进行排序。索引条目的排序支持高效的相等匹配和基于范围的查询操作。此外，**MongoDB 还可使用索引中的顺序来返回排序后的结果**。

![MongoDB 索引](https://raw.githubusercontent.com/dunwu/images/master/snap/20200921210621.svg)

:::

### 【基础】MongoDB 支持哪些类型的索引？

:::details 要点

MongoDB 支持多种类型的索引，适用于不同的场景。

#### 单字段索引

单个字段索引收集集合内每个文档中单个字段的数据，并对其排序。

下图显示了单个字段 `score` 上的一个索引：

![单字段索引](https://raw.githubusercontent.com/dunwu/images/master/snap/202503052211281.svg)

> 要了解详情，请参阅 [单字段索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-single/#std-label-indexes-single-field)。

#### 复合索引

复合索引从集合中每个文档的两个或多个字段收集数据并对其排序。数据先按索引中的第一个字段分组，再按每个后续字段分组。

例如，下图显示了一个复合索引，其中文档首先按 `userid` 分组并以升序（按字母顺序）排序。然后，每个 `userid` 的 `scores` 按降序排序：

![复合索引](https://raw.githubusercontent.com/dunwu/images/master/snap/202503052213721.svg)

> 要了解详情，请参阅 [复合索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-compound/#std-label-index-type-compound)。

#### 多键索引

多键索引收集数组中存储的数据并进行排序。

无需显式指定多键类型。对包含数组值的字段创建索引时，MongoDB 会自动将该索引设为多键索引。

下图显示了 `addr.zip` 字段的多键索引：

![多键索引](https://raw.githubusercontent.com/dunwu/images/master/snap/202503052214522.svg)

> 要了解详情，请参阅 [多键索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-multikey/#std-label-index-type-multikey)。

#### 文本索引

文本索引支持对包含字符串内容的字段进行文本搜索查询。

> 要了解详情，请参阅 [自管理部署上的文本索引。](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-text/#std-label-index-type-text)

#### 地理空间索引

地理空间索引可提高对地理空间坐标数据进行查询的性能。

MongoDB 提供两种类型的地理空间索引：

- 使用平面几何返回结果的 [2d 索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/geospatial/2d/#std-label-2d-index)。
- 使用球面几何返回结果的 [2dsphere 索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)。

> 要了解详情，请参阅 [地理空间索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-geospatial/#std-label-geospatial-index)。

#### 哈希索引

哈希索引支持 [哈希分片](https://www.mongodb.com/zh-cn/docs/manual/core/hashed-sharding/#std-label-sharding-hashed-sharding)。哈希索引对字段值的哈希值进行索引。

> 要了解详情，请参阅 [哈希索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-hashed/#std-label-index-type-hashed)。

:::

### 【基础】复合索引中字段的顺序有影响吗？

:::details 要点

**排序键的排列顺序必须与其在索引中出现的顺序相同**。例如，索引键模式 `{ a: 1, b: 1 }` 可以支持对 `{ a: 1, b: 1 }` 排序，但不支持对 `{ b: 1, a: 1 }` 排序。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503041116883.png)

在复合索引中，按照何种方式排序，决定了该索引在查询中是否能被应用到。

走复合索引的排序：

```sql
db.s2.find().sort({"userid": 1, "score": -1})
db.s2.find().sort({"userid": -1, "score": 1})
```

不走复合索引的排序：

```sql
db.s2.find().sort({"userid": 1, "score": 1})
db.s2.find().sort({"userid": -1, "score": -1})
db.s2.find().sort({"score": 1, "userid": -1})
db.s2.find().sort({"score": 1, "userid": 1})
db.s2.find().sort({"score": -1, "userid": -1})
db.s2.find().sort({"score": -1, "userid": 1})
```

我们可以通过 explain 进行分析：

```sql
db.s2.find().sort({"score": -1, "userid": 1}).explain()
```

**MongoDB 的复合索引遵循左前缀原则**：拥有多个键的索引，可以同时得到所有这些键的前缀组成的索引，但不包括除左前缀之外的其他子集。比如说，有一个类似 `{a: 1, b: 1, c: 1, ..., z: 1}` 这样的索引，那么实际上也等于有了 `{a: 1}`、`{a: 1, b: 1}`、`{a: 1, b: 1, c: 1}` 等一系列索引，但是不会有 `{b: 1}` 这样的非左前缀的索引。

:::

### 【中级】什么是覆盖索引查询？

:::details 要点

根据官方文档介绍，覆盖查询是以下的查询：

- 所有的查询字段是索引的一部分。
- 结果中返回的所有字段都在同一索引中。
- 查询中没有字段等于`null`。

由于所有出现在查询中的字段是索引的一部分， MongoDB 无需在整个数据文档中检索匹配查询条件和返回使用相同索引的查询结果。因为索引存在于内存中，从索引中获取数据比通过扫描文档读取数据要快得多。

举个例子：我们有如下 `users` 集合：

```json
{
   "_id": ObjectId("53402597d852426020000002"),
   "contact": "987654321",
   "dob": "01-01-1991",
   "gender": "M",
   "name": "Tom Benzamin",
   "user_name": "tombenzamin"
}
```

我们在 `users` 集合中创建联合索引，字段为 `gender` 和 `user_name` :

```sql
db.users.ensureIndex({gender:1,user_name:1})
```

现在，该索引会覆盖以下查询：

```sql
db.users.find({gender:"M"},{user_name:1,_id:0})
```

为了让指定的索引覆盖查询，必须显式地指定 `_id: 0` 来从结果中排除 `_id` 字段，因为索引不包括 `_id` 字段。

:::

## MongoDB 事务

> 扩展阅读：[MongoDB 官方文档之事务](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/)

> 扩展阅读：
>
> - [MongoDB 官方文档之事务](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/)
> - [技术干货| MongoDB 事务原理](https://mongoing.com/archives/82187)
> - [MongoDB 一致性模型设计与实现](https://developer.aliyun.com/article/782494)

### 【基础】MongoDB 是否支持事务？

:::details 要点

在 MongoDB 中，**对单个文档的操作具有原子性**。由于可以使用嵌入式文档和数组来捕获单个文档结构中数据之间的关系，而无需跨多个文档和集合进行标准化，因此这种单文档原子性消除了许多实际使用案例使用分布式事务的必要性。

对于需要对多文档（在单个或多个集合中）的读写操作具有原子性的情况，MongoDB 支持多文档事务。利用分布式事务，可以跨多个操作、集合、数据库、文档和分片使用事务。

分布式事务具有原子性：

- 事务要么应用所有数据更改，要么回滚更改。
- 在事务提交时，事务中所做的所有数据更改都会保存，并且在事务之外可见。
  - 在事务进行提交前，在事务中所做的数据更改在事务外不可见。
  - 不过，当事务写入多个分片时，并非所有外部读取操作都需等待已提交事务的结果在各个分片上可见。例如，如果事务已提交并且写入 1 在分片 A 上可见，但写入 2 在分片 B 上尚不可见，则读关注 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-) 处的外部读取可以在不看到写入 2 的情况下读取写入 1 的结果。
- 事务中止后，在事务中所做的所有数据更改会被丢弃且不会变得可见。例如，如果事务中的任何操作失败，事务就会中止，事务中所做的所有数据更改将被丢弃且不会变得可见。

> 要点：在大多数情况下，与单文档写入操作相比，分布式事务会产生更高的性能成本，并且分布式事务的可用性不应取代有效的模式设计。在许多情况下，[非规范化数据模型（嵌入式文档和数组）](https://www.mongodb.com/zh-cn/docs/manual/data-modeling/concepts/embedding-vs-references/#std-label-data-modeling-embedding) 仍然是数据和使用案例的最佳选择。换言之，对于许多场景，适当的数据建模将最大限度地减少对分布式事务的需求。

:::

### 【中级】MongoDB 事务支持哪些操作？

:::details 要点

可以跨多个操作、集合、数据库、文档和分片使用分布式事务。

对于事务：

- 可以在事务中创建集合和索引。
- 事务中使用的集合可以位于不同的数据库中。

#### 在事务中创建集合和索引

如果事务不是跨分片写入事务，则可以在 [分布式事务](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/#std-label-transactions) 中执行以下操作：

- 创建集合。
- 在先前同一事务中创建的新空集合上创建索引。

在事务中创建集合时：

- 可以 [隐式创建一个集合](https://www.mongodb.com/zh-cn/docs/manual/core/transactions-operations/#std-label-transactions-operations-ddl-implicit)，例如：
  - 对不存在的集合进行 [插入操作](https://www.mongodb.com/zh-cn/docs/manual/core/transactions-operations/#std-label-transactions-operations-ddl-implicit)
  - 对不存在的集合使用 `upsert: true` 进行 [update/findAndModify 操作](https://www.mongodb.com/zh-cn/docs/manual/core/transactions-operations/#std-label-transactions-operations-ddl-implicit)。
- 可以使用 [`create`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create) 命令或其辅助程序 [`db.createCollection()`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create)[显式创建集合](https://www.mongodb.com/zh-cn/docs/manual/core/transactions-operations/#std-label-transactions-operations-ddl-explicit)。

[在事务内创建索引](https://www.mongodb.com/zh-cn/docs/manual/core/transactions-operations/#std-label-transactions-operations-ddl-explicit) 时，要创建的索引必须位于以下位置之一：

- 不存在的集合。集合作为操作的一部分创建。
- 先前在同一事务中创建的新空集合。

#### 计数操作

要在事务内执行计数操作，请使用 [`$count`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/count/#mongodb-pipeline-pipe.-count) 聚合阶段或 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)（带有 [`$sum`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sum/#mongodb-group-grp.-sum) 表达式）聚合阶段。

MongoDB 驱动程序提供集合级 API `countDocuments(filter, options)` 作为辅助方法，该方法使用 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 和 [`$sum`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sum/#mongodb-group-grp.-sum) 表达式来执行计数。

[`mongosh`](https://www.mongodb.com/zh-cn/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 提供 [`db.collection.countDocuments()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.countDocuments/#mongodb-method-db.collection.countDocuments) 辅助方法，该方法使用 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 和 [`$sum`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sum/#mongodb-group-grp.-sum) 表达式进行计数。

#### 去重操作

如要在事务中执行不同的操作：

- 对于未分片的集合，可以使用 [`db.collection.distinct()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.distinct/#mongodb-method-db.collection.distinct) 方法 /[`distinct`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/distinct/#mongodb-dbcommand-dbcmd.distinct) 命令以及带有 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 阶段的聚合管道。

- 对于分片集合，不能使用 [`db.collection.distinct()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.distinct/#mongodb-method-db.collection.distinct) 方法或 [`distinct`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/distinct/#mongodb-dbcommand-dbcmd.distinct) 命令。

  要查找分片集合的不同值，请改用带有 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 阶段的 aggregation pipeline。例如：

  - 不使用 `db.coll.distinct("x")`，而是使用

    ```javascript
    db.coll.aggregate([
      { $group: { _id: null, distinctValues: { $addToSet: '$x' } } },
      { $project: { _id: 0 } }
    ])
    ```

  - 不使用 `db.coll.distinct("x", { status: "A" })`，而是使用

    ```javascript
    db.coll.aggregate([
      { $match: { status: 'A' } },
      { $group: { _id: null, distinctValues: { $addToSet: '$x' } } },
      { $project: { _id: 0 } }
    ])
    ```

  管道返回一个指向文档的游标：

  ```javascript
  { "distinctValues" : [ 2, 3, 1 ] }
  ```

  迭代游标以访问结果文档。

#### 信息操作

事务中允许使用诸如 [`hello`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/hello/#mongodb-dbcommand-dbcmd.hello)、[`buildInfo`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/buildInfo/#mongodb-dbcommand-dbcmd.buildInfo)、[`connectionStatus`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/connectionStatus/#mongodb-dbcommand-dbcmd.connectionStatus)（及其辅助方法）之类的信息命令，但它们不能是事务中的第一项操作。

#### 事务操作限制

事务中不允许执行以下操作：

- 在跨分片写事务中创建新集合。例如，如果在一个分片中写入一个现有集合，并在另一个分片中隐式创建一个集合，那么 MongoDB 将无法在同一事务中执行这两项操作。
- 使用 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/core/transactions-operations/#std-label-transactions-operations-ddl-explicit) 以外的读关注级别时，[显式创建集合](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)（例如 [`db.createCollection()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.createIndexes/#mongodb-method-db.collection.createIndexes) 方法）和索引（例如 [`db.collection.createIndexes()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 和 [`db.collection.createIndex()`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-) 方法）。
- [`listCollections`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections) 和 [`listIndexes`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes) 命令及其辅助方法。
- 其他非 CRUD 和非信息性操作（例如 [`createUser`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/createUser/#mongodb-dbcommand-dbcmd.createUser)、[`getParameter`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/getParameter/#mongodb-dbcommand-dbcmd.getParameter) 和 [`count`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/count/#mongodb-dbcommand-dbcmd.count)）及其辅助程序。
- 并行操作。要同时更新多个命名空间，请考虑改用 [`bulkWrite`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/bulkWrite/#mongodb-dbcommand-dbcmd.bulkWrite) 命令。

:::

## MongoDB 复制

> 扩展阅读：[MongoDB 官方文档之事务](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/)

### 【中级】MongoDB 的副本机制是怎样的？

:::details 要点

MongoDB 的复制集群又称为副本集群，是一组维护相同数据集合的 mongod 进程。

客户端连接到整个 Mongodb 复制集群，主节点机负责整个复制集群的写，从节点可以进行读操作，但默认还是主节点负责整个复制集群的读。主节点发生故障时，自动从从节点中选举出一个新的主节点，确保集群的正常使用，这对于客户端来说是无感知的。

通常来说，一个复制集群包含 1 个主节点（Primary），多个从节点（Secondary）以及零个或 1 个仲裁节点（Arbiter）。

- **主节点**：整个集群的写操作入口，接收所有的写操作，并将集合所有的变化记录到操作日志中，即 oplog。主节点挂掉之后会自动选出新的主节点。
- **从节点**：从主节点同步数据，在主节点挂掉之后选举新节点。不过，从节点可以配置成 0 优先级，阻止它在选举中成为主节点。
- **仲裁节点**：这个是为了节约资源或者多机房容灾用，只负责主节点选举时投票不存数据，保证能有节点获得多数赞成票。

下图是一个典型的三成员副本集群：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503042030712.png)

主节点与备节点之间是通过 **oplog（操作日志）** 来同步数据的。oplog 是 local 库下的一个特殊的 **上限集合 (Capped Collection)** ，用来保存写操作所产生的增量日志，类似于 MySQL 中 的 Binlog。

> 上限集合类似于定长的循环队列，数据顺序追加到集合的尾部，当集合空间达到上限时，它会覆盖集合中最旧的文档。上限集合的数据将会被顺序写入到磁盘的固定空间内，所以，I/O 速度非常快，如果不建立索引，性能更好。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503042030639.png)

当主节点上的一个写操作完成后，会向 oplog 集合写入一条对应的日志，而从节点则通过这个 oplog 不断拉取到新的日志，在本地进行回放以达到数据同步的目的。

副本集最多有一个主节点。 如果当前主节点不可用，一个选举会抉择出新的主节点。MongoDB 的节点选举规则能够保证在 Primary 挂掉之后选取的新节点一定是集群中数据最全的一个。

当主节点上的一个写操作完成后，会向 oplog 集合写入一条对应的日志，而从节点则通过这个 oplog 不断拉取到新的日志，在本地进行回放以达到数据同步的目的。

副本集最多有一个主节点。 如果当前主节点不可用，一个选举会抉择出新的主节点。MongoDB 的节点选举规则能够保证在 Primary 挂掉之后选取的新节点一定是集群中数据最全的一个。

为什么要用复制集群？

- **实现 failover**：提供自动故障恢复的功能，主节点发生故障时，自动从从节点中选举出一个新的主节点，确保集群的正常使用，这对于客户端来说是无感知的。
- **实现读写分离**：我们可以设置从节点上可以读取数据，主节点负责写入数据，这样的话就实现了读写分离，减轻了主节点读写压力过大的问题。MongoDB 4.0 之前版本如果主库压力不大，不建议读写分离，因为写会阻塞读，除非业务对响应时间不是非常关注以及读取历史数据接受一定时间延迟。

:::

## MongoDB 分片

### 【中级】什么是分片集群？

:::details 要点

分片集群是 MongoDB 的分布式版本，相较副本集，分片集群数据被均衡的分布在不同分片中， 不仅大幅提升了整个集群的数据容量上限，也将读写的压力分散到不同分片，以解决副本集性能瓶颈的难题。

MongoDB 的分片集群由如下三个部分组成（下图来源于 [官方文档对分片集群的介绍](https://www.mongodb.com/docs/manual/sharding/)）：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503042043821.png)

**Config Servers**：配置服务器，本质上是一个 MongoDB 的副本集，负责存储集群的各种元数据和配置，如分片地址、Chunks 等

**Mongos**：路由服务，不存具体数据，从 Config 获取集群配置讲请求转发到特定的分片，并且整合分片结果返回给客户端。

**Shard**：每个分片是整体数据的一部分子集，从 MongoDB3.6 版本开始，每个 Shard 必须部署为副本集（replica set）架构

:::

### 【基础】为什么要用分片集群？

:::details 要点

随着系统数据量以及吞吐量的增长，常见的解决办法有两种：垂直扩展和水平扩展。

垂直扩展通过增加单个服务器的能力来实现，比如磁盘空间、内存容量、CPU 数量等；水平扩展则通过将数据存储到多个服务器上来实现，根据需要添加额外的服务器以增加容量。

类似于 Redis Cluster，MongoDB 也可以通过分片实现 **水平扩展** 。水平扩展这种方式更灵活，可以满足更大数据量的存储需求，支持更高吞吐量。并且，水平扩展所需的整体成本更低，仅仅需要相对较低配置的单机服务器即可，代价是增加了部署的基础设施和维护的复杂性。

也就是说当你遇到如下问题时，可以使用分片集群解决：

- 存储容量受单机限制，即磁盘资源遭遇瓶颈。
- 读写能力受单机限制，可能是 CPU、内存或者网卡等资源遭遇瓶颈，导致读写能力无法扩展。

:::

### 【基础】如何选择分片键？

:::details 要点

选择合适的片键对 sharding 效率影响很大，主要基于如下四个因素（摘自 [分片集群使用注意事项 - - 腾讯云文档](https://cloud.tencent.com/document/product/240/44611)）：

- **取值基数** 取值基数建议尽可能大，如果用小基数的片键，因为备选值有限，那么块的总数量就有限，随着数据增多，块的大小会越来越大，导致水平扩展时移动块会非常困难。 例如：选择年龄做一个基数，范围最多只有 100 个，随着数据量增多，同一个值分布过多时，导致 chunck 的增长超出 chuncksize 的范围，引起 jumbo chunk，从而无法迁移，导致数据分布不均匀，性能瓶颈。
- **取值分布** 取值分布建议尽量均匀，分布不均匀的片键会造成某些块的数据量非常大，同样有上面数据分布不均匀，性能瓶颈的问题。
- **查询带分片** 查询时建议带上分片，使用分片键进行条件查询时，mongos 可以直接定位到具体分片，否则 mongos 需要将查询分发到所有分片，再等待响应返回。
- **避免单调递增或递减** 单调递增的 sharding key，数据文件挪动小，但写入会集中，导致最后一篇的数据量持续增大，不断发生迁移，递减同理。

综上，在选择片键时要考虑以上 4 个条件，尽可能满足更多的条件，才能降低 MoveChunks 对性能的影响，从而获得最优的性能体验。

:::

### 【中级】分片策略有哪些？

:::details 要点

MongoDB 支持两种分片算法来满足不同的查询需求（摘自 [MongoDB 分片集群介绍 - 阿里云文档](https://help.aliyun.com/document_detail/64561.html?spm=a2c4g.11186623.0.0.3121565eQhUGGB#h2--shard-key-3)）：

**1、基于范围的分片**：

![基于范围的分片](https://raw.githubusercontent.com/dunwu/images/master/snap/202503042049549.png)

MongoDB 按照分片键（Shard Key）的值的范围将数据拆分为不同的块（Chunk），每个块包含了一段范围内的数据。当分片键的基数大、频率低且值非单调变更时，范围分片更高效。

- 优点：Mongos 可以快速定位请求需要的数据，并将请求转发到相应的 Shard 节点中。
- 缺点：可能导致数据在 Shard 节点上分布不均衡，容易造成读写热点，且不具备写分散性。
- 适用场景：分片键的值不是单调递增或单调递减、分片键的值基数大且重复的频率低、需要范围查询等业务场景。

**2、基于 Hash 值的分片**

![基于 Hash 值的分片](https://raw.githubusercontent.com/dunwu/images/master/snap/202503052222683.png)

MongoDB 计算单个字段的哈希值作为索引值，并以哈希值的范围将数据拆分为不同的块（Chunk）。

- 优点：可以将数据更加均衡地分布在各 Shard 节点中，具备写分散性。
- 缺点：不适合进行范围查询，进行范围查询时，需要将读请求分发到所有的 Shard 节点。
- 适用场景：分片键的值存在单调递增或递减、片键的值基数大且重复的频率低、需要写入的数据随机分发、数据读取随机性较大等业务场景。

除了上述两种分片策略，您还可以配置 **复合片键** ，例如由一个低基数的键和一个单调递增的键组成。

:::

### 【中级】分片数据如何存储？

:::details 要点

**Chunk（块）** 是 MongoDB 分片集群的一个核心概念，其本质上就是由一组 Document 组成的逻辑数据单元。每个 Chunk 包含一定范围片键的数据，互不相交且并集为全部数据，即离散数学中**划分**的概念。

分片集群不会记录每条数据在哪个分片上，而是记录 Chunk 在哪个分片上一级这个 Chunk 包含哪些数据。

默认情况下，一个 Chunk 的最大值默认为 64MB（可调整，取值范围为 1~1024 MB。如无特殊需求，建议保持默认值），进行数据插入、更新、删除时，如果此时 Mongos 感知到了目标 Chunk 的大小或者其中的数据量超过上限，则会触发 **Chunk 分裂**。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503042053916.png)

数据的增长会让 Chunk 分裂得越来越多。这个时候，各个分片上的 Chunk 数量可能会不平衡。Mongos 中的 **均衡器 (Balancer)** 组件就会执行自动平衡，尝试使各个 Shard 上 Chunk 的数量保持均衡，这个过程就是 **再平衡（Rebalance）**。默认情况下，数据库和集合的 Rebalance 是开启的。

如下图所示，随着数据插入，导致 Chunk 分裂，让 AB 两个分片有 3 个 Chunk，C 分片只有一个，这个时候就会把 B 分配的迁移一个到 C 分片实现集群数据均衡。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202503042054456.png)

> Balancer 是 MongoDB 的一个运行在 Config Server 的 Primary 节点上（自 MongoDB 3.4 版本起）的后台进程，它监控每个分片上 Chunk 数量，并在某个分片上 Chunk 数量达到阈值进行迁移。

Chunk 只会分裂，不会合并，即使 chunkSize 的值变大。

Rebalance 操作是比较耗费系统资源的，我们可以通过在业务低峰期执行、预分片或者设置 Rebalance 时间窗等方式来减少其对 MongoDB 正常使用所带来的影响。

:::
