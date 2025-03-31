---
icon: logos:mongodb
title: MongoDB CRUD
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202503062319755.webp
date: 2020-09-25 21:23:41
categories:
  - 数据库
  - 文档数据库
  - mongodb
tags:
  - 数据库
  - 文档数据库
  - mongodb
permalink: /pages/773f1695/
---

# MongoDB CRUD

::: info 概述

**CRUD** 由英文单词 **C**reate, **R**ead, **U**pdate, **D**elete 的首字母组成，即**增删改查**。

本文通过介绍基本的 MongoDB CRUD 方法，向读者呈现如何访问 MongoDB 数据。

:::

<!-- more -->

## 插入操作

MongoDB 提供了以下方法将文档插入集合：

- [`db.collection.insertOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne)
- [`db.collection.insertMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany)

![插入操作](https://raw.githubusercontent.com/dunwu/images/master/snap/20200924112342.svg)

插入操作的特性：

- MongoDB 中的所有写入操作在单个文档级别上都是原子的。
- 如果要插入的 collection 当前不存在，则插入操作会自动创建 collection。
- 如果文档未指定 `_id` 字段，则 MongoDB 会将 `_id` 字段添加 ObjectId 值到新文档中。
- 可以 MongoDB 写入操作的确认级别来控制写入行为。

【示例】插入一条 document 示例

```javascript
db.inventory.find({ item: 'canvas' })
```

【示例】插入多条 document 示例

```javascript
db.inventory.insertMany([
  {
    item: 'journal',
    qty: 25,
    tags: ['blank', 'red'],
    size: { h: 14, w: 21, uom: 'cm' }
  },
  {
    item: 'mat',
    qty: 85,
    tags: ['gray'],
    size: { h: 27.9, w: 35.5, uom: 'cm' }
  },
  {
    item: 'mousepad',
    qty: 25,
    tags: ['gel', 'blue'],
    size: { h: 19, w: 22.85, uom: 'cm' }
  }
])
```

> 更多详情参考：https://www.mongodb.com/zh-cn/docs/manual/tutorial/insert-documents/

## 查询操作

MongoDB 提供了 [`db.collection.find()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find) 方法从集合中查找文档。

![查询操作](https://raw.githubusercontent.com/dunwu/images/master/snap/20200924113832.svg)

可以在 `{}` 中指定查询条件来查找要匹配的数据。如果 `{}` 为空，则会返回集合中的所有文档。

```javascript
db.inventory.insertMany([
  { item: 'journal', qty: 25, size: { h: 14, w: 21, uom: 'cm' }, status: 'A' },
  {
    item: 'notebook',
    qty: 50,
    size: { h: 8.5, w: 11, uom: 'in' },
    status: 'A'
  },
  { item: 'paper', qty: 100, size: { h: 8.5, w: 11, uom: 'in' }, status: 'D' },
  {
    item: 'planner',
    qty: 75,
    size: { h: 22.85, w: 30, uom: 'cm' },
    status: 'D'
  },
  {
    item: 'postcard',
    qty: 45,
    size: { h: 10, w: 15.25, uom: 'cm' },
    status: 'A'
  }
])

// 查询集合中所有文档
db.inventory.find({})

// 查询集合所有 status 等于 "D" 的文档
db.inventory.find({ status: 'D' })
```

> 更多详情参考：https://www.mongodb.com/zh-cn/docs/manual/tutorial/query-documents/

## 更新操作

MongoDB 提供以下操作来更新集合中的文档：

- [`db.collection.updateOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne)
- [`db.collection.updateMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany)
- [`db.collection.replaceOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#db.collection.replaceOne)

语法格式：

- [`db.collection.updateOne(<filter>, <update>, <options>)`](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne)
- [`db.collection.updateMany(<filter>, <update>, <options>)`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany)
- [`db.collection.replaceOne(<filter>, <update>, <options>)`](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#db.collection.replaceOne)

![更新操作](https://raw.githubusercontent.com/dunwu/images/master/snap/20200924114043.svg)

【示例】插入测试数据

```javascript
db.inventory.insertMany([
  {
    item: 'canvas',
    qty: 100,
    size: { h: 28, w: 35.5, uom: 'cm' },
    status: 'A'
  },
  { item: 'journal', qty: 25, size: { h: 14, w: 21, uom: 'cm' }, status: 'A' },
  { item: 'mat', qty: 85, size: { h: 27.9, w: 35.5, uom: 'cm' }, status: 'A' },
  {
    item: 'mousepad',
    qty: 25,
    size: { h: 19, w: 22.85, uom: 'cm' },
    status: 'P'
  },
  {
    item: 'notebook',
    qty: 50,
    size: { h: 8.5, w: 11, uom: 'in' },
    status: 'P'
  },
  { item: 'paper', qty: 100, size: { h: 8.5, w: 11, uom: 'in' }, status: 'D' },
  {
    item: 'planner',
    qty: 75,
    size: { h: 22.85, w: 30, uom: 'cm' },
    status: 'D'
  },
  {
    item: 'postcard',
    qty: 45,
    size: { h: 10, w: 15.25, uom: 'cm' },
    status: 'A'
  },
  {
    item: 'sketchbook',
    qty: 80,
    size: { h: 14, w: 21, uom: 'cm' },
    status: 'A'
  },
  {
    item: 'sketch pad',
    qty: 95,
    size: { h: 22.85, w: 30.5, uom: 'cm' },
    status: 'A'
  }
])
```

【示例】更新一条 document

```javascript
db.inventory.updateOne(
  { item: 'paper' },
  {
    $set: { 'size.uom': 'cm', status: 'P' },
    $currentDate: { lastModified: true }
  }
)
```

【示例】更新多条 document

```javascript
db.inventory.updateMany(
  { qty: { $lt: 50 } },
  {
    $set: { 'size.uom': 'in', status: 'P' },
    $currentDate: { lastModified: true }
  }
)
```

【示例】替换一条 document

```javascript
db.inventory.replaceOne(
  { item: 'paper' },
  {
    item: 'paper',
    instock: [
      { warehouse: 'A', qty: 60 },
      { warehouse: 'B', qty: 40 }
    ]
  }
)
```

更新操作的特性：

- MongoDB 中的所有写入操作在单个文档级别上都是原子性的。
- 一旦设置了，就无法更新或替换 [`_id`](https://docs.mongodb.com/manual/reference/glossary/#term-id) 字段。
- 除以下情况外，MongoDB 会在执行写操作后保留文档字段的顺序：
  - `_id` 字段始终是文档中的第一个字段。
  - 包括重命名字段名称的更新可能导致文档中字段的重新排序。
- 如果更新操作中包含 `upsert : true` 并且没有 document 匹配过滤器，MongoDB 会新插入一个 document；如果有匹配的 document，MongoDB 会修改或替换这些 document。

## 删除操作

MongoDB 提供了以下操作来删除集合中的文档：

- [`db.collection.deleteOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/#db.collection.deleteOne)
- [`db.collection.deleteMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/#db.collection.deleteMany)

![删除操作](https://raw.githubusercontent.com/dunwu/images/master/snap/20200924120007.svg)

可以指定用于标识要删除的文档的过滤器，这些筛选条件和 find 方法的过滤器语法一致。

【示例】删除集合中的所有文档

```javascript
db.inventory.deleteMany({})
```

【示例】删除 `status` 字段等于 `"A"` 的文档

```javascript
db.inventory.deleteMany({ status: 'A' })
```

【示例】删除 `status` 为 `"D"` 的第一个文档

```javascript
db.inventory.deleteOne({ status: 'D' })
```

## 批量写操作

MongoDB 通过 [`db.collection.bulkWrite()`](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite) 方法来支持批量写操作（包括批量插入、更新、删除）。

此外，[`db.collection.insertMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany) 方法支持批量插入操作。

### 有序和无序的操作

批量写操作可以有序或无序。

- 对于有序列表，MongoDB 串行执行操作。如果在写操作的处理过程中发生错误，MongoDB 将不处理列表中剩余的写操作。
- 对于无序列表，MongoDB 可以并行执行操作，但是不能保证此行为。如果在写操作的处理过程中发生错误，MongoDB 将继续处理列表中剩余的写操作。

在分片集合上执行操作的有序列表通常比执行无序列表要慢，因为对于有序列表，每个操作必须等待上一个操作完成。

默认情况下，[`bulkWrite()`](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite) 执行有序操作。要指定无序写操作，请在选项文档中设置 `ordered : false`。

### bulkWrite() 方法

[`bulkWrite()`](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite) 支持以下写操作：

- [insertOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-insertone)
- [updateOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-updateonemany)
- [updateMany](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-updateonemany)
- [replaceOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-replaceone)
- [deleteOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-deleteonemany)
- [deleteMany](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-deleteonemany)

【示例】批量写操作示例

以下 [`bulkWrite()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.bulkWrite/#mongodb-method-db.collection.bulkWrite) 示例对 `pizzas` 集合运行以下操作：

- 使用 `insertOne` 添加两个文档。
- 使用 `updateOne` 更新一个文档。
- 使用 `deleteOne` 删除文档。
- 使用 `replaceOne` 替换一个文档。

```javascript
db.pizzas.bulkWrite([
  {
    insertOne: { document: { _id: 3, type: 'beef', size: 'medium', price: 6 } }
  },
  {
    insertOne: {
      document: { _id: 4, type: 'sausage', size: 'large', price: 10 }
    }
  },
  {
    updateOne: {
      filter: { type: 'cheese' },
      update: { $set: { price: 8 } }
    }
  },
  { deleteOne: { filter: { type: 'pepperoni' } } },
  {
    replaceOne: {
      filter: { type: 'vegan' },
      replacement: { type: 'tofu', size: 'small', price: 4 }
    }
  }
])
```

### 批量写操作策略

大量的插入操作（包括初始数据插入或常规数据导入）可能会影响分片集群的性能。对于批量插入，请考虑以下策略：

#### 预拆分 collection

如果分片集合为空，则该集合只有一个初始 [chunk](https://docs.mongodb.com/manual/reference/glossary/#term-chunk)，该 [chunk](https://docs.mongodb.com/manual/reference/glossary/#term-chunk) 位于单个分片上。然后，MongoDB 必须花一些时间来接收数据，创建拆分并将拆分的块分发到可用的分片。为了避免这种性能成本，您可以按照拆分群集中的拆分块中的说明预拆分 collection。

#### 无序写操作

要提高对分片集群的写入性能，请使用 [`bulkWrite()`](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite)，并将可选参数顺序设置为 false。[`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) 可以尝试同时将写入操作发送到多个分片。对于空集合，首先按照分片群集中的分割 [chunk](https://docs.mongodb.com/manual/reference/glossary/#term-chunk) 中的说明预拆分 collection。

#### 避免单调限速

如果分片键在插入期间单调增加，则所有已插入数据都会进入集合中的最后一个数据段，该数据段将始终出现在单个分片上。因此，集群的插入容量永远不会超过该单个分片的插入容量。

如果插入量大于单个分片可以处理的容量，并且无法避免分片键的单调增加，则可以考虑对应用程序进行以下修改：

- 反转分片键的二进制位。这样将保留信息，并避免将插入顺序与递增的值序列相关联。
- 交换第一个和最后一个 16 位字，“随机打乱”插入。

## 小结

一图胜千言，下面是 MongoDB CRUD 操作的基础要点：

![CRUD - 原图来自 [MongoDB CRUD Operations – Simplified](https://dbversity.com/mongodb-crud-operations-simplified/)](https://raw.githubusercontent.com/dunwu/images/master/snap/202503062320260.png)

## 参考资料

- [MongoDB 官方文档之 CRUD 操作](https://www.mongodb.com/zh-cn/docs/manual/crud/)
