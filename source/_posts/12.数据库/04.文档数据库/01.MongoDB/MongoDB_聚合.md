---
icon: logos:mongodb
title: MongoDB 的聚合操作
date: 2020-09-21 21:22:57
categories:
  - 数据库
  - 文档数据库
  - MongoDB
tags:
  - 数据库
  - 文档数据库
  - MongoDB
  - 聚合
permalink: /pages/02aefb0c/
---

# MongoDB 的聚合操作

聚合操作处理多个文档并返回计算结果。可以使用聚合操作来：

- 将多个文档中的值组合在一起。
- 对分组数据执行操作，返回单一结果。
- 分析一段时间内的数据变化。

若要执行聚合操作，可以使用：

- [聚合管道](https://www.mongodb.com/zh-cn/docs/manual/aggregation/#std-label-aggregation-pipeline-intro)，这是执行聚合的首选方法。
- [单一目的聚合方法](https://www.mongodb.com/zh-cn/docs/manual/aggregation/#std-label-single-purpose-agg-methods)，这些方法很简单，但缺乏聚合管道的功能。

## Pipeline 简介

MongoDB 的聚合框架以数据处理管道（Pipeline）的概念为模型。**MongoDB 通过 [`db.collection.aggregate()`](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate) 方法支持聚合操作 **。并提供了 [`aggregate`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate) 命令来执行 pipeline。

聚合管道由一个或多个处理文档的 [阶段](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference) 组成：

- 每个阶段对输入文档执行一个操作。例如，某个阶段可以过滤文档、对文档进行分组并计算值。
- 从一个阶段输出的文档将传递到下一阶段。
- 一个聚合管道可以返回针对文档组的结果。例如，返回总值、平均值、最大值和最小值。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200921092725.png)

[阶段](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference) 的要点：

- 阶段不必为每个输入文档输出一个文档。例如，某些阶段可能会产生新文档或过滤掉现有文档。
- 同一个阶段可以在管道中多次出现，但以下阶段例外：[`$out`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)、[`$merge`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge) 和 [`$geoNear`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)。
- 要在阶段中计算平均值和执行其他计算，请使用指定 [聚合操作符](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/#std-label-aggregation-expressions) 的 [聚合表达式](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/#std-label-aggregation-expression-operators)。在下一节中，您将了解有关聚合表达式的更多信息。

## Pipeline 示例

初始数据：

```javascript
db.orders.insertMany( [
   { _id: 0, name: "Pepperoni", size: "small", price: 19,
     quantity: 10, date: ISODate( "2021-03-13T08:14:30Z" ) },
   { _id: 1, name: "Pepperoni", size: "medium", price: 20,
     quantity: 20, date : ISODate( "2021-03-13T09:13:24Z" ) },
   { _id: 2, name: "Pepperoni", size: "large", price: 21,
     quantity: 30, date : ISODate( "2021-03-17T09:22:12Z" ) },
   { _id: 3, name: "Cheese", size: "small", price: 12,
     quantity: 15, date : ISODate( "2021-03-13T11:21:39.736Z" ) },
   { _id: 4, name: "Cheese", size: "medium", price: 13,
     quantity:50, date : ISODate( "2022-01-12T21:23:13.331Z" ) },
   { _id: 5, name: "Cheese", size: "large", price: 14,
     quantity: 10, date : ISODate( "2022-01-12T05:08:13Z" ) },
   { _id: 6, name: "Vegan", size: "small", price: 17,
     quantity: 10, date : ISODate( "2021-01-13T05:08:13Z" ) },
   { _id: 7, name: "Vegan", size: "medium", price: 18,
     quantity: 10, date : ISODate( "2021-01-13T05:10:13Z" ) }
] )
```

【示例】计算总订单数量

以下聚合管道示例包含两个 [阶段](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference)，并返回按披萨名称分组后，各款中号披萨的总订单数量：

```javascript
db.orders.aggregate( [
   // Stage 1: 根据 size 过滤订单
   {
      $match: { size: "medium" }
   },
   // Stage 2: 按名称对剩余文档进行分组，并计算总数量
   {
      $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } }
   }
] )

// 输出
[
   { _id: 'Cheese', totalQuantity: 50 },
   { _id: 'Vegan', totalQuantity: 10 },
   { _id: 'Pepperoni', totalQuantity: 20 }
]
```

[`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段：

- 从披萨订单文档过滤出 `size` 为 `medium` 的披萨。
- 将剩余文档传递到 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 阶段。

[`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 阶段：

- 按披萨 `name` 对剩余文档进行分组。
- 使用 [`$sum`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sum/#mongodb-group-grp.-sum) 计算每种披萨 `name` 的总订单 `quantity`。总数存储在聚合管道返回的 `totalQuantity` 字段中。

【示例】计算订单总值和平均订单数

```javascript
db.orders.aggregate( [

   // Stage 1: 根据 date 过滤订单
   {
      $match:
      {
         "date": { $gte: new ISODate( "2020-01-30" ), $lt: new ISODate( "2022-01-30" ) }
      }
   },

   // Stage 2: 按 date 对剩余文档进行分组，并计算
   {
      $group:
      {
         _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
         totalOrderValue: { $sum: { $multiply: [ "$price", "$quantity" ] } },
         averageOrderQuantity: { $avg: "$quantity" }
      }
   },

   // Stage 3: 根据 totalOrderValue 倒序排序
   {
      $sort: {totalOrderValue: -1}
   }

 ] )

// 输出
[
   { _id: '2022-01-12', totalOrderValue: 790, averageOrderQuantity: 30 },
   { _id: '2021-03-13', totalOrderValue: 770, averageOrderQuantity: 15 },
   { _id: '2021-03-17', totalOrderValue: 630, averageOrderQuantity: 30 },
   { _id: '2021-01-13', totalOrderValue: 350, averageOrderQuantity: 10 }
]
```

[`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段：

- 使用 [`$gte`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/gte/#mongodb-expression-exp.-gte) 和 [`$lt`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/lt/#mongodb-expression-exp.-lt)[``](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/lt/#mongodb-expression-exp.-lt) 将披萨订单文档筛选为指定日期范围内的文档。
- 将剩余文档传递到 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 阶段。

[`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 阶段：

- 使用 [`$dateToString`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/dateToString/#mongodb-expression-exp.-dateToString)[``](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/dateToString/#mongodb-expression-exp.-dateToString) 按日期对文档进行分组。
- 对于每个群组，计算：
  - 使用 [`$sum`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sum/#mongodb-group-grp.-sum) 和 [`$multiply`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/multiply/#mongodb-expression-exp.-multiply)[``](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/multiply/#mongodb-expression-exp.-multiply) 的总订单值。
  - 使用 [`$avg`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/avg/#mongodb-group-grp.-avg)[``](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/avg/#mongodb-group-grp.-avg) 计算平均订单数量。
- 将分组的文档传递到 [`$sort`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort) 阶段。

[`$sort`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort) 阶段：

- 按每组的总订单值以降序对文档进行排序 (`-1`)。
- 返回排序文档。

> 更多示例：
>
> - [使用用户偏好数据进行聚合](https://www.mongodb.com/zh-cn/docs/manual/tutorial/aggregation-with-user-preference-data/)
> - [与邮政编码数据集的聚合](https://www.mongodb.com/zh-cn/docs/manual/tutorial/aggregation-zip-code-data-set/)
> - [使用聚合管道进行更新](https://www.mongodb.com/zh-cn/docs/manual/tutorial/update-documents-with-aggregation-pipeline/)

## Pipeline 优化

### 投影优化

聚合管道可确定是否只需文档中的部分字段即可获取结果。如果是，管道则仅会使用这些字段，从而减少通过管道传递的数据量。

使用 [`$project`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project) 阶段时，通常应该是管道的最后一个阶段，用于指定要返回给客户端的字段。

在管道的开头或中间使用 `$project` 阶段来减少传递到后续管道阶段的字段数量不太可能提高性能，因为数据库会自动执行此优化。

### 管道序列优化

（`$project`、`$unset`、`$addFields`、`$set`） + `$match` 序列优化

如果聚合管道包含投影阶段 ([`$addFields`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/addFields/#mongodb-pipeline-pipe.-addFields)、[`$project`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project)、[`$set`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/set/#mongodb-pipeline-pipe.-set) 或 [`$unset`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/unset/#mongodb-pipeline-pipe.-unset)），且其后跟随 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段，MongoDB 会将 `$match` 阶段中无需使用投影阶段计算的值的所有过滤器移动到投影前的新的 `$match` 阶段。

如果聚合管道包含多个投影或 `$match` 阶段，MongoDB 会对每个 `$match` 阶段执行此优化，将每个 `$match` 过滤器移到过滤器不依赖的所有投影阶段之前。

【示例】管道序列优化示例

优化前：

```javascript
{
   $addFields: {
      maxTime: { $max: "$times" },
      minTime: { $min: "$times" }
   }
},
{
   $project: {
      _id: 1,
      name: 1,
      times: 1,
      maxTime: 1,
      minTime: 1,
      avgTime: { $avg: ["$maxTime", "$minTime"] }
   }
},
{
   $match: {
      name: "Joe Schmoe",
      maxTime: { $lt: 20 },
      minTime: { $gt: 5 },
      avgTime: { $gt: 7 }
   }
}
```

优化器会将 `$match` 阶段分解为四个单独的过滤器，每个过滤器对应 `$match` 查询文档中的一个键。然后，优化器会将每个过滤器移至尽可能多的投影阶段之前，从而按需创建新的 `$match` 阶段。

优化后：

```javascript
{ $match: { name: "Joe Schmoe" } },
{ $addFields: {
    maxTime: { $max: "$times" },
    minTime: { $min: "$times" }
} },
{$match: { maxTime: { $lt: 20}, minTime: {$gt: 5} } },
{ $project: {
    _id: 1, name: 1, times: 1, maxTime: 1, minTime: 1,
    avgTime: { $avg: ["$maxTime", "$minTime"] }
} },
{$match: { avgTime: { $gt: 7} } }
```

[`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 筛选器 `{ avgTime: { $gt: 7 } }` 依赖 [`$project`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project) 阶段来计算 `avgTime` 字段。[`$project`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project) 阶段是该管道中的最后一个投影阶段，因此 `avgTime` 上的 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 筛选器无法移动。

`maxTime` 和 `minTime` 字段在 [`$addFields`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/addFields/#mongodb-pipeline-pipe.-addFields) 阶段计算，但不依赖 [`$project`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project) 阶段。优化器已为这些字段上的筛选器创建一个新的 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段，并将其置于 [`$project`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project) 阶段之前。

[`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 筛选器 `{ name: "Joe Schmoe" }` 不使用在 [`$project`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project) 或 [`$addFields`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/addFields/#mongodb-pipeline-pipe.-addFields) 阶段计算的任何值，因此它在这两个投影阶段之前移到了新的 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段。

优化后，筛选器 `{ name: "Joe Schmoe" }` 在管道开始时会处于 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段。此举还允许聚合在最初查询该集合时使用针对 `name` 字段的索引。

#### `$sort` + `$match` 序列优化

当序列中的 [`$sort`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort) 后面是 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 时，[`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 会在 [`$sort`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort) 之前移动，以最大限度地减少要排序的对象数量。例如，如果管道由以下阶段组成：

```
{ $sort: { age : -1 } },
{ $match: { status: 'A' } }
```

在优化阶段，优化器会将序列转换为以下内容：

```
{ $match: { status: 'A' } },
{ $sort: { age : -1 } }
```

#### `$redact` + `$match` 序列优化

如果可能，当管道有 [`$redact`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/redact/#mongodb-pipeline-pipe.-redact) 阶段紧接着 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段时，聚合有时可以在 [`$redact`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段之前添加 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/redact/#mongodb-pipeline-pipe.-redact) 阶段的一部分。如果添加的 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段位于管道的开头，则聚合可以使用索引并查询集合以限制进入管道的文档数量。有关更多信息，请参阅 [使用索引和文档过滤器提高性能](https://www.mongodb.com/zh-cn/docs/manual/core/aggregation-pipeline-optimization/#std-label-aggregation-pipeline-optimization-indexes-and-filters)。

例如，如果管道由以下阶段组成：

```
{ $redact: { $cond: { if: { $eq: [ "$level", 5 ] }, then: "$$PRUNE", else: "$$DESCEND" } } },
{ $match: { year: 2014, category: { $ne: "Z" } } }
```

优化器可以在 [`$redact`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段之前添加相同的 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/redact/#mongodb-pipeline-pipe.-redact) 阶段：

```
{ $match: { year: 2014 } },
{ $redact: { $cond: { if: { $eq: [ "$level", 5 ] }, then: "$$PRUNE", else: "$$DESCEND" } } },
{ $match: { year: 2014, category: { $ne: "Z" } } }
```

#### `$project`/`$unset` + `$skip` 序列优化

如果序列中的 [`$project`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project) 或 [`$unset`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/unset/#mongodb-pipeline-pipe.-unset) 后面是 [`$skip`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/skip/#mongodb-pipeline-pipe.-skip)，则 [`$skip`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/skip/#mongodb-pipeline-pipe.-skip) 在 [`$project`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project) 之前移动。例如，如果管道由以下阶段组成：

```
{ $sort: { age : -1 } },
{ $project: { status: 1, name: 1 } },
{ $skip: 5 }
```

在优化阶段，优化器会将序列转换为以下内容：

```
{ $sort: { age : -1 } },
{ $skip: 5 },
{ $project: { status: 1, name: 1 } }
```

### 管道合并优化

如果可能，优化阶段会将 Pipeline 阶段合并到其前身。通常，合并发生在任意序列重新排序优化之后。

#### `$sort` + `$limit` 合并

当 [`$sort`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort) 在 [`$limit`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit) 之前时，, the optimizer can coalesce the into the 如果没有干预阶段（例如 [`$unwind`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit)、[`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort)）修改文档的数量，则优化器可以将 [`$limit`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/unwind/#mongodb-pipeline-pipe.-unwind) 阶段合并到 [`$sort`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)。如果有管道阶段更改了 [`$sort`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit) 和 [`$limit`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort) 阶段之间的文档数量，则 MongoDB 不会将 [`$limit`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort) 合并到 [`$sort`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit) 中。

例如，如果管道由以下阶段组成：

```
{ $sort : { age : -1 } },
{ $project : { age : 1, status : 1, name : 1 } },
{ $limit: 5 }
```

在优化阶段，优化器会将此序列合并为以下内容：

```
{
    "$sort" : {
       "sortKey" : {
          "age" : -1
       },
       "limit" : NumberLong(5)
    }
},
{ "$project" : {
         "age" : 1,
         "status" : 1,
         "name" : 1
  }
}
```

此操作可让排序操作在推进时仅维护前 `n` 个结果，其中 `n` 为指定的限制，而 MongoDB 仅需要在内存中存储 `n` 个项目 [[1\]](https://www.mongodb.com/zh-cn/docs/manual/core/aggregation-pipeline-optimization/#footnote-coalescence-allowDiskUse)。有关更多信息，请参阅 [`$sort` 操作符和内存](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sort/#std-label-sort-and-memory)。

#### `$limit` + `$limit` 合并

当 [`$limit`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit) 紧随另一个 [`$limit`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit) 时，这两个阶段可以合并为一个 [`$limit`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit)，以两个初始限额中*较小*的为合并后的限额。例如，一个管道包含以下序列：

```
{ $limit: 100 },
{ $limit: 10 }
```

然后第二个 [`$limit`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit) 阶段可以合并到第一个 [`$limit`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit) 阶段，形成一个 [`$limit`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit) 阶段，新阶段的限额 `10` 是两个初始限额 `100` 和 `10` 中的较小者。

```
{ $limit: 10 }
```

#### `$skip` + `$skip` 合并

当 [`$skip`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/skip/#mongodb-pipeline-pipe.-skip) 紧随在另一个 [`$skip`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/skip/#mongodb-pipeline-pipe.-skip) 之后时，这两个阶段可以合并为一个 [`$skip`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/skip/#mongodb-pipeline-pipe.-skip)，其中的跳过数量是两个初始跳过数量的*总和*。例如，一个管道包含以下序列：

```
{ $skip: 5 },
{ $skip: 2 }
```

然后第二个 [`$skip`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/skip/#mongodb-pipeline-pipe.-skip) 阶段可以合并到第一个 [`$skip`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/skip/#mongodb-pipeline-pipe.-skip) 阶段，形成一个 [`$skip`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/skip/#mongodb-pipeline-pipe.-skip) 阶段，新阶段的跳过数量 `7` 是两个初始限额 `5` 和 `2` 的总和。

```
{ $skip: 7 }
```

#### `$match` + `$match` 合并

当 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 紧随另一个 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 之后时，这两个阶段可以合并为一个 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match)，用 [`$and`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/and/#mongodb-expression-exp.-and) 将条件组合在一起。例如，一个管道包含以下序列：

```
{ $match: { year: 2014 } },
{ $match: { status: "A" } }
```

然后第二个 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段可合并到第一个 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段并形成一个 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段

```
{ $match: { $and: [ { "year" : 2014 }, { "status" : "A" } ] } }
```

#### `$lookup`、`$unwind` 和 `$match` Coalescence

当 [`$unwind`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/unwind/#mongodb-pipeline-pipe.-unwind) 紧随 [`$lookup`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup)，且 [`$unwind`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/unwind/#mongodb-pipeline-pipe.-unwind) 在 [`$lookup`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup)`` 的 `as`[``](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) 字段上运行时，优化器将 [`$unwind`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/unwind/#mongodb-pipeline-pipe.-unwind) 合并到 [`$lookup`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) 阶段。这样可以避免创建大型中间文档。此外，如果 [`$unwind`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/unwind/#mongodb-pipeline-pipe.-unwind) 后接 [`$lookup`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 的任意 `as` 子字段上的 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup)，则优化器也会合并 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match)[``](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match)。

例如，一个管道包含以下序列：

```
{
   $lookup: {
     from: "otherCollection",
     as: "resultingArray",
     localField: "x",
     foreignField: "y"
   }
},
{ $unwind: "$resultingArray"  },
{ $match: {
    "resultingArray.foo": "bar"
  }
}
```

优化器将 [`$unwind`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/unwind/#mongodb-pipeline-pipe.-unwind) 和 [`$match`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段合并到 [`$lookup`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) 阶段。如果使用 `explain` 选项运行聚合，`explain` 输出将显示合并阶段：

```
{
   $lookup: {
     from: "otherCollection",
     as: "resultingArray",
     localField: "x",
     foreignField: "y",
     let: {},
     pipeline: [
       {
         $match: {
           "foo": {
             "$eq": "bar"
           }
         }
       }
     ],
     unwinding: {
       "preserveNullAndEmptyArrays": false
     }
   }
}
```

您可以在 [解释计划](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.aggregate/#std-label-example-aggregate-method-explain-option) 中查看此优化后的管道。

## Pipeline 限制

- **大小限制** - [`aggregate`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/aggregate/#mongodb-dbcommand-dbcmd.aggregate) 命令既可以返回一个游标，也可以将结果存储在集合中。结果集中的每个文档存在 16 MB 的 [BSON 文档大小限制](https://www.mongodb.com/zh-cn/docs/manual/reference/limits/#mongodb-limit-BSON-Document-Size)。如果任何单个文档超过 [BSON 文档大小限制](https://www.mongodb.com/zh-cn/docs/manual/reference/limits/#mongodb-limit-BSON-Document-Size)，则聚合会产生错误。该限制仅适用于返回的文档。在管道处理过程中，文档可能会超过此大小。[`db.collection.aggregate()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.aggregate/#mongodb-method-db.collection.aggregate) 方法默认返回一个游标。
- **阶段数量限制** - *在 5.0 版中进行了更改*：MongoDB 5.0 将单个管道中允许的 [聚合管道阶段](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference) 限制为 1000 个。
- **内存限制** - 从 MongoDB 6.0 开始，[`allowDiskUseByDefault`](https://www.mongodb.com/zh-cn/docs/manual/reference/parameters/#mongodb-parameter-param.allowDiskUseByDefault) 参数可控制需要 100 MB 以上内存容量来执行的管道阶段是否默认会将临时文件写入磁盘。
- 如果将 [`allowDiskUseByDefault`](https://www.mongodb.com/zh-cn/docs/manual/reference/parameters/#mongodb-parameter-param.allowDiskUseByDefault) 设为 `true`，则默认情况下，需要 100 MB 以上内存容量的管道阶段会将临时文件写入磁盘。您可以使用 `{ allowDiskUse: false }` 选项来为特定的 `find` 或 `aggregate` 命令禁用将临时文件写入磁盘的功能。
- 如果 [`allowDiskUseByDefault`](https://www.mongodb.com/zh-cn/docs/manual/reference/parameters/#mongodb-parameter-param.allowDiskUseByDefault) 设置为 `false`，则默认情况下，需要超过 100 MB 的内存才能执行的管道阶段会引发错误。您可以使用 `{ allowDiskUse: true }` 选项来为特定 `find` 或 `aggregate` 启用向磁盘写入临时文件的功能。

## Map-Reduce

> 聚合 pipeline 比 map-reduce 提供更好的性能和更一致的接口。

Map-reduce 是一种数据处理范式，用于将大量数据汇总为有用的聚合结果。为了执行 map-reduce 操作，MongoDB 提供了 [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) 数据库命令。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200921155546.svg)

在上面的操作中，MongoDB 将 map 阶段应用于每个输入 document（即 collection 中与查询条件匹配的 document）。 map 函数分发出多个键 - 值对。对于具有多个值的那些键，MongoDB 应用 reduce 阶段，该阶段收集并汇总聚合的数据。然后，MongoDB 将结果存储在 collection 中。可选地，reduce 函数的输出可以通过 finalize 函数来进一步汇总聚合结果。

MongoDB 中的所有 map-reduce 函数都是 JavaScript，并在 mongod 进程中运行。 Map-reduce 操作将单个 collection 的 document 作为输入，并且可以在开始 map 阶段之前执行任意排序和限制。 mapReduce 可以将 map-reduce 操作的结果作为 document 返回，也可以将结果写入 collection。

## 单一目的聚合方法

MongoDB 支持一下单一目的的聚合操作：

- [`db.collection.estimatedDocumentCount()`](https://docs.mongodb.com/manual/reference/method/db.collection.estimatedDocumentCount/#db.collection.estimatedDocumentCount)
- [`db.collection.count()`](https://docs.mongodb.com/manual/reference/method/db.collection.count/#db.collection.count)
- [`db.collection.distinct()`](https://docs.mongodb.com/manual/reference/method/db.collection.distinct/#db.collection.distinct)

所有这些操作都汇总了单个 collection 中的 document。尽管这些操作提供了对常见聚合过程的简单访问，但是它们相比聚合 pipeline 和 map-reduce，缺少灵活性和丰富的功能性。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200921155935.svg)

## RDBM 聚合 vs. MongoDB 聚合

MongoDB pipeline 提供了许多等价于 SQL 中常见聚合语句的操作。

下表概述了常见的 SQL 聚合语句或函数和 MongoDB 聚合操作的映射表：

| RDBM 操作               | MongoDB 聚合操作                                             |
| :---------------------- | :----------------------------------------------------------- |
| `WHERE`                 | [`$match`](https://docs.mongodb.com/manual/reference/operator/aggregation/match/#pipe._S_match) |
| `GROUP BY`              | [`$group`](https://docs.mongodb.com/manual/reference/operator/aggregation/group/#pipe._S_group) |
| `HAVING`                | [`$match`](https://docs.mongodb.com/manual/reference/operator/aggregation/match/#pipe._S_match) |
| `SELECT`                | [`$project`](https://docs.mongodb.com/manual/reference/operator/aggregation/project/#pipe._S_project) |
| `ORDER BY`              | [`$sort`](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/#pipe._S_sort) |
| `LIMIT`                 | [`$limit`](https://docs.mongodb.com/manual/reference/operator/aggregation/limit/#pipe._S_limit) |
| `SUM()`                 | [`$sum`](https://docs.mongodb.com/manual/reference/operator/aggregation/sum/#grp._S_sum) |
| `COUNT()`               | [`$sum`](https://docs.mongodb.com/manual/reference/operator/aggregation/sum/#grp._S_sum)[`$sortByCount`](https://docs.mongodb.com/manual/reference/operator/aggregation/sortByCount/#pipe._S_sortByCount) |
| `JOIN`                  | [`$lookup`](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#pipe._S_lookup) |
| `SELECT INTO NEW_TABLE` | [`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out) |
| `MERGE INTO TABLE`      | [`$merge`](https://docs.mongodb.com/manual/reference/operator/aggregation/merge/#pipe._S_merge) (Available starting in MongoDB 4.2) |
| `UNION ALL`             | [`$unionWith`](https://docs.mongodb.com/manual/reference/operator/aggregation/unionWith/#pipe._S_unionWith) (Available starting in MongoDB 4.4) |

【示例】

```javascript
db.orders.insertMany([
  {
    _id: 1,
    cust_id: 'Ant O. Knee',
    ord_date: new Date('2020-03-01'),
    price: 25,
    items: [
      { sku: 'oranges', qty: 5, price: 2.5 },
      { sku: 'apples', qty: 5, price: 2.5 }
    ],
    status: 'A'
  },
  {
    _id: 2,
    cust_id: 'Ant O. Knee',
    ord_date: new Date('2020-03-08'),
    price: 70,
    items: [
      { sku: 'oranges', qty: 8, price: 2.5 },
      { sku: 'chocolates', qty: 5, price: 10 }
    ],
    status: 'A'
  },
  {
    _id: 3,
    cust_id: 'Busby Bee',
    ord_date: new Date('2020-03-08'),
    price: 50,
    items: [
      { sku: 'oranges', qty: 10, price: 2.5 },
      { sku: 'pears', qty: 10, price: 2.5 }
    ],
    status: 'A'
  },
  {
    _id: 4,
    cust_id: 'Busby Bee',
    ord_date: new Date('2020-03-18'),
    price: 25,
    items: [{ sku: 'oranges', qty: 10, price: 2.5 }],
    status: 'A'
  },
  {
    _id: 5,
    cust_id: 'Busby Bee',
    ord_date: new Date('2020-03-19'),
    price: 50,
    items: [{ sku: 'chocolates', qty: 5, price: 10 }],
    status: 'A'
  },
  {
    _id: 6,
    cust_id: 'Cam Elot',
    ord_date: new Date('2020-03-19'),
    price: 35,
    items: [
      { sku: 'carrots', qty: 10, price: 1.0 },
      { sku: 'apples', qty: 10, price: 2.5 }
    ],
    status: 'A'
  },
  {
    _id: 7,
    cust_id: 'Cam Elot',
    ord_date: new Date('2020-03-20'),
    price: 25,
    items: [{ sku: 'oranges', qty: 10, price: 2.5 }],
    status: 'A'
  },
  {
    _id: 8,
    cust_id: 'Don Quis',
    ord_date: new Date('2020-03-20'),
    price: 75,
    items: [
      { sku: 'chocolates', qty: 5, price: 10 },
      { sku: 'apples', qty: 10, price: 2.5 }
    ],
    status: 'A'
  },
  {
    _id: 9,
    cust_id: 'Don Quis',
    ord_date: new Date('2020-03-20'),
    price: 55,
    items: [
      { sku: 'carrots', qty: 5, price: 1.0 },
      { sku: 'apples', qty: 10, price: 2.5 },
      { sku: 'oranges', qty: 10, price: 2.5 }
    ],
    status: 'A'
  },
  {
    _id: 10,
    cust_id: 'Don Quis',
    ord_date: new Date('2020-03-23'),
    price: 25,
    items: [{ sku: 'oranges', qty: 10, price: 2.5 }],
    status: 'A'
  }
])
```

SQL 和 MongoDB 聚合方式对比：

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200921200556.png)

## 参考资料

- ** 官方 **
  - [MongoDB 官网](https://www.mongodb.com/)
  - [MongoDB Github](https://github.com/mongodb/mongo)
  - [MongoDB 官方免费教程](https://university.mongodb.com/)
- ** 教程 **
  - [MongoDB 教程](https://www.runoob.com/mongodb/mongodb-tutorial.html)
  - [MongoDB 高手课](https://time.geekbang.org/course/intro/100040001)
