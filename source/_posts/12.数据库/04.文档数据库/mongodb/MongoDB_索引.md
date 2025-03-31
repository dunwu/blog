---
icon: logos:mongodb
title: MongoDB 索引
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202503072209292.webp
date: 2020-09-21 21:22:57
categories:
  - 数据库
  - 文档数据库
  - mongodb
tags:
  - 数据库
  - 文档数据库
  - mongodb
  - 索引
permalink: /pages/567ecac8/
---

# MongoDB 索引

::: info 概述

索引通常能够极大的提高查询的效率。如果**没有索引**，MongoDB 在读取数据时**必须扫描 collection 中的每个 document** 并选取那些符合查询条件的记录。这种扫描全集合的查询是非常低效的，特别是在处理大量的数据时。查询可能要花费几十秒甚至几分钟，这种性能开销是不可接受的。索引可提高查询性能，但**添加索引会影响写入操作的性能**。对于写入读取率高的集合，由于每次插入操作都必须同时更新所有索引，因此会带来较高的索引成本。

本文介绍了 MongoDB 的基本索引操作、索引类型，和设置索引的策略。掌握了 MongoDB 索引的要点，有助于提高访问 MongoDB 数据的效率。

:::

<!-- more -->

## 索引简介

索引通常能够极大的提高查询的效率。如果**没有索引**，MongoDB 在读取数据时**必须扫描 collection 中的每个 document** 并选取那些符合查询条件的记录。这种扫描全集合的查询是非常低效的，特别是在处理大量的数据时。查询可能要花费几十秒甚至几分钟，这种性能开销是不可接受的。索引可提高查询性能，但**添加索引会影响写入操作的性能**。对于写入读取率高的集合，由于每次插入操作都必须同时更新所有索引，因此会带来较高的索引成本。

索引是一种特殊的数据结构，它以易于遍历的形式存储一小部分集合数据集。**MongoDB 索引使用 [B-tree](https://en.wikipedia.org/wiki/B-tree) 数据结构**。索引可存储某个特定字段或多个字段的值，并按字段的值进行排序。索引条目的排序支持高效的相等匹配和基于范围的查询操作。此外，**MongoDB 还可使用索引中的顺序来返回排序后的结果**。

**MongoDB 在 collection 数据级别上定义索引**。

![MongoDB 索引](https://raw.githubusercontent.com/dunwu/images/master/snap/20200921210621.svg)

### 默认索引

MongoDB 在创建集合时会在 [`_id`](https://www.mongodb.com/zh-cn/docs/manual/core/index-unique/#std-label-index-type-unique) 字段上创建一个 [唯一索引](https://www.mongodb.com/zh-cn/docs/manual/core/document/#std-label-document-id-field)。`_id` 索引可防止客户端插入两个具有相同 `_id` 字段值的文档。无法删除此索引。

## 索引操作

### 创建索引

**MongoDB 使用 `createIndex()` 方法来创建索引**。

`createIndex()` 语法如下：

```javascript
collection.createIndex( { <key and index type specification> }, function(err, result) {
   console.log(result);
   callback(result);
} )
```

> 扩展阅读：[创建索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/create-index/)

### 删除索引

MongoDB 提供了两个方法来删除索引：

- [`db.collection.dropIndex()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex) - 从集合中删除特定索引。
- [`db.collection.dropIndexes()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes) - 从集合或索引数组中删除所有可移动索引（如果指定）。

> 扩展阅读：[删除索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/drop-index/)

## 索引类型

MongoDB 支持多种类型的索引，适用于不同的场景。

### 单字段索引

单个字段索引收集集合内每个文档中单个字段的数据，并对其排序。

下图显示了单个字段 `score` 上的一个索引：

![单字段索引](https://raw.githubusercontent.com/dunwu/images/master/snap/202503052211281.svg)

> 要了解详情，请参阅 [单字段索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-single/#std-label-indexes-single-field)。

### 复合索引

复合索引从集合中每个文档的两个或多个字段收集数据并对其排序。数据先按索引中的第一个字段分组，再按每个后续字段分组。

例如，下图显示了一个复合索引，其中文档首先按 `userid` 分组并以升序（按字母顺序）排序。然后，每个 `userid` 的 `scores` 按降序排序：

![复合索引](https://raw.githubusercontent.com/dunwu/images/master/snap/202503052213721.svg)

> 要了解详情，请参阅 [复合索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-compound/#std-label-index-type-compound)。

### 多键索引

多键索引收集数组中存储的数据并进行排序。

无需显式指定多键类型。对包含数组值的字段创建索引时，MongoDB 会自动将该索引设为多键索引。

下图显示了 `addr.zip` 字段的多键索引：

![多键索引](https://raw.githubusercontent.com/dunwu/images/master/snap/202503052214522.svg)

> 要了解详情，请参阅 [多键索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-multikey/#std-label-index-type-multikey)。

### 文本索引

文本索引支持对包含字符串内容的字段进行文本搜索查询。

> 要了解详情，请参阅 [自管理部署上的文本索引。](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-text/#std-label-index-type-text)

### 地理空间索引

地理空间索引可提高对地理空间坐标数据进行查询的性能。

MongoDB 提供两种类型的地理空间索引：

- 使用平面几何返回结果的 [2d 索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/geospatial/2d/#std-label-2d-index)。
- 使用球面几何返回结果的 [2dsphere 索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)。

> 要了解详情，请参阅 [地理空间索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-geospatial/#std-label-geospatial-index)。

### 哈希索引

哈希索引支持 [哈希分片](https://www.mongodb.com/zh-cn/docs/manual/core/hashed-sharding/#std-label-sharding-hashed-sharding)。哈希索引对字段值的哈希值进行索引。

> 要了解详情，请参阅 [哈希索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-hashed/#std-label-index-type-hashed)。

## 索引策略

索引通常能够极大的提高查询的效率，但如果索引设置不合理，可能无法提升查询效率。创建索引时，需要考虑以下因素：

- **查询频率** - 优先考虑那些经常用于查询的字段。
- **选择性** - 选择性是指查询使用索引缩小结果范围的能力。为确保选择性，编写查询时应限制索引字段或字段可能包含的文档数。根据索引数据编写具有适当选择性的查询。
- **索引大小** - 索引的大小会影响数据库的内存占用和查询性能。

引用多个字段的索引是 [复合索引](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/#std-label-index-type-compound)。复合索引可以显著缩短查询响应时间。索引键与文档字段相对应。大多数情况下，**应用 ESR（相等、排序、范围）规则来排列索引键有助于创建更有效的 [复合索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-compound/#std-label-index-type-compound)**。

### 相等

“**相等**”指单个值的精确匹配。索引搜索可高效利用精确匹配来限制完成某一查询而需检查的文档数。相等匹配的索引键可以按任何顺序显示。但是，为了满足与索引的相等匹配，完全匹配的所有索引键必须位于任何其他索引字段之前。**MongoDB 无需按特定顺序排列完全匹配字段**。

【示例】相等匹配查询

```javascript
db.cars.find({ model: 'Cordoba' })
db.cars.find({ model: { $eq: 'Cordoba' } })
```

### 排序

当查询字段是索引键的子集时，索引可以支持排序操作。仅当查询包含排序键之前的所有前缀键的相等条件时，才支持对索引键子集进行排序操作。

【示例】利用索引优化排序查询

```javascript
// 按 model 进行排序
db.cars.find({ manufacturer: 'GM' }).sort({ model: 1 })

// 为提高查询性能，可以创建如下索引
db.cars.createIndex({ manufacturer: 1, model: 1 })
```

**排序键的排列顺序必须与其在索引中出现的顺序相同**。例如，索引键模式 `{ a: 1, b: 1 }` 可以支持对 `{ a: 1, b: 1 }` 排序，但不支持对 `{ b: 1, a: 1 }` 排序。

### 范围

“范围”过滤器会扫描字段。此扫描不要求精确匹配，因此范围过滤器会松散绑定到索引键。为提高查询效率，应尽可能缩小范围边界，并使用等值匹配来限制必须扫描的文档数。MongoDB 无法对范围过滤器的结果进行索引排序。将范围过滤器置于排序谓词之后，以便 MongoDB 可使用非阻塞索引排序。

【示例】范围查询

```javascript
db.cars.find({ price: { $gte: 15000 } })
db.cars.find({ age: { $lt: 10 } })
db.cars.find({ priorAccidents: { $ne: null } })
```

> 扩展阅读：[MongoDB 官方文档之索引策略](https://www.mongodb.com/zh-cn/docs/manual/applications/indexes/)

## 参考资料

- [MongoDB 官方文档之索引](https://www.mongodb.com/zh-cn/docs/manual/indexes/)
- [你真的会用索引么？[Mongo]](https://zhuanlan.zhihu.com/p/77971681)
