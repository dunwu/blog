---
icon: logos:mongodb
title: 《MongoDB 权威指南》笔记一
date: 2024-09-29 07:45:34
categories:
  - 笔记
  - 数据库
tags:
  - 数据库
  - 文档数据库
  - mongodb
permalink: /pages/ee6834b2/
---

# 《MongoDB 权威指南》笔记一

[《MongoDB 权威指南》](https://book.douban.com/subject/35688800/) 学习笔记

<!-- more -->

## 第 1 章 MongoDB 简介

### MongoDB 简介

MongoDB 是一个分布式文档数据库，由 C++ 语言编写。

#### 面向文档

面向文档的数据库使用更灵活的“文档”模型取代了“行”的概念。通过嵌入文档和数组，面向文档的方式可以仅用一条记录来表示复杂的层次关系。

MongoDB 中也没有预定义模式（predefined schema）：文档键值的类型和大小不是固定的。由于没有固定的模式，因此按需添加或删除字段变得更容易。

综上，**MongoDB 支持结构化、半结构化数据模型，可以动态响应结构变化**。

#### 功能丰富

MongoDB 提供了丰富的功能：

- **索引** - MongoDB 支持通用的二级索引，并提供唯一索引、复合索引、地理空间索引及全文索引功能。此外，它还支持在不同层次结构（如嵌套文档和数组）上建立二级索引。
- **聚合** - MongoDB 提供了一种基于数据处理管道的聚合框架。
- **特殊的集合和索引类型** - MongoDB 支持有限生命周期（TTL）集合，适用于保存将在特定时间过期的数据，比如会话和固定大小的集合，以及用于保存最近的数据（日志）。MongoDB 还支持部分索引，可以仅对符合某个条件的文档创建索引，以提高效率并减少所需的存储空间。
- **文件存储** - 针对大文件及文件元数据的存储，MongoDB 使用了一种非常易用的协议。
- ...

#### 分布式

MongoDB 作为分布式存储，自然也具备了分布式的一般特性：

- 通过副本机制提供高可用
- 通过分片提供扩容能力

## 第 2 章 入门指南

文档是 MongoDB 中的基本数据单元，可以粗略地认为其相当于关系数据库管理系统中的行（但表达力要强得多）。

类似地，集合可以被看作具有动态模式的表。

一个 MongoDB 实例可以拥有多个独立的数据库，每个数据库都拥有自己的集合。

每个文档都有一个特殊的键 "`_id`"，其在所属的集合中是唯一的。

MongoDB 自带了一个简单但功能强大的工具：mongo shell。mongo shell 对管理 MongoDB 实例和使用 MongoDB 的查询语言操作数据提供了内置的支持。它也是一个功能齐全的 JavaScript 解释器，用户可以根据需求创建或加载自己的脚本。

### 文档

文档是一组有序键值的集合。

文档中的值不仅仅是“二进制大对象”，它们可以是几种不同的数据类型之一（甚至可以是一个完整的嵌入文档）。

文档中的键是字符串类型。除了少数例外的情况，可以使用任意 UTF-8 字符作为键。

键中不能含有 `\0`（空字符）。这个字符用于表示一个键的结束。

`.` 和 `$` 是特殊字符，只能在某些特定情况下使用。

MongoDB 会区分类型和大小写。

下面这两个文档是不同的：

```json
{"count" : 5}
{"count" : "5"}
```

下面这两个文档也不同：

```json
{"count" : 5}
{"Count" : 5}
```

需要注意，MongoDB 中的文档不能包含重复的键。例如，下面这个文档是不合法的。

```json
{ "greeting": "Hello, world!", "greeting": "Hello, MongoDB!" }
```

### 集合

集合就是一组文档。如果将文档比作关系数据库中的行，那么一个集合就相当于一张表。

集合具有**动态模式**的特性。这意味着一个集合中的文档可以具有任意数量的不同“形状”。例如，以下两个文档可以存储在同一个集合中：

```json
{"greeting" : "Hello, world!", "views": 3}
{"signoff": "Good night, and good luck"}
```

集合由其名称进行标识。集合名称可以是任意 UTF-8 字符串，但有以下限制。

- 集合名称不能是空字符串（""）。
- 集合名称不能含有 `\0`（空字符），因为这个字符用于表示一个集合名称的结束。
- 集合名称不能以 `system.` 开头，该前缀是为内部集合保留的。例如，`system.users` 集合中保存着数据库的用户，`system.namespaces` 集合中保存着有关数据库所有集合的信息。
- 用户创建的集合名称中不应包含保留字符 `$`。许多驱动程序确实支持在集合名称中使用 `$`，这是因为某些由系统生成的集合会包含它，但除非你要访问的是这些集合之一，否则不应在名称中使用 `$` 字符。

使用 `.` 字符分隔不同命名空间的子集合是一种组织集合的惯例。例如，有一个具有博客功能的应用程序，可能包含名为 `blog.posts` 和名为 `blog.authors` 的集合。这只是一种组织管理的方式，blog 集合（它甚至不必存在）与其“子集合”之间没有任何关系。

### 数据库

MongoDB 使用集合对文档进行分组，使用数据库对集合进行分组。一个 MongoDB 实例可以承载多个数据库，每个数据库有零个或多个集合。

数据库按照名称进行标识的。数据库名称可以是任意 UTF-8 字符串，但有以下限制：

- 数据库名称不能是空字符串（""）。
- 数据库名称不能包含 `/`、`\`、`.`、`"`、`*`、`<`、`>`、`:`、`|`、`?`、`$`、单一的空格以及 `\0`（空字符），基本上只能使用 ASCII 字母和数字。
- 数据库名称区分大小写。
- 数据库名称的长度限制为 64 字节。

MongoDB 使用 WiredTiger 存储引擎之前，数据库名称会对应文件系统中的文件名。尽管现在已经不这样处理了，但之前的许多限制遗留了下来。

此外，还有一些数据库名称是保留的。这些数据库可以被访问，但它们具有特殊的语义。具体如下。

- **admin**：`admin` 数据库会在身份验证和授权时被使用。此外，某些管理操作需要访问此数据库。
- **local**：在副本集中，`local` 用于存储复制过程中所使用的数据，而 `local` 数据库本身不会被复制。
- **config**：MongoDB 的分片集群会使用 config 数据库存储关于每个分片的信息。通过将数据库名称与该库中的集合名称连接起来，可以获得一个完全限定的集合名称，称为命名空间

### 启动 MongoDB

启动 MongoDB 的方式：

- Unix 系统 - 执行 mongod
- Windows 系统 - 执行 mongod.exe

如果没有指定参数，则 mongod 会使用默认的数据目录 `/data/db/`。如果数据目录不存在或不可写，那么服务器端将无法启动。因此在启动 MongoDB 之前，创建数据目录（如 mkdir -p /data/db/）并确保对该目录有写权限非常重要。

默认情况下，MongoDB 会监听 27017 端口上的套接字连接。如果端口不可用，那么服务器将无法启动。

### MongoDB Shell

MongoDB 内置了 MongoDB Shell 工具来提供命令行交互工具。

要启动 shell，可以执行 mongo 文件。

【示例】MongoDB Shell 基本操作

```shell
# 查看有哪些数据库
> show dbs
admin            0.000GB
config           0.000GB
fc_open_core     0.000GB
local            0.000GB
spring-tutorial  0.000GB
test             0.919GB

# 切换到 test 数据库
> use test
switched to db test

# 插入文档
> db.user.insertOne({ name: "dunwu", sex: 'man' })
{
        "acknowledged" : true,
        "insertedId" : ObjectId("670a281a2647017bf5f42962")
}

# 查询文档
}
> db.user.find()
{ "_id" : ObjectId("670a281a2647017bf5f42962"), "name" : "dunwu", "sex" : "man" }

# 更新文档
> db.user.updateOne({ name: "dunwu" }, { $set: { age: 30 } })
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

# 删除文档
> db.user.deleteOne({ name: "dunwu" })
{ "acknowledged" : true, "deletedCount" : 1 }

# 退出 MongoDB Shell
> quit()
```

### 数据类型

MongoDB 中的文档可以被认为是“类似于 JSON”的形式。

MongoDB 基本数据类型如下：

**`null`** - `null` 类型用于表示空值或不存在的字段。

```json
{ "x": null }
```

**布尔类型** - 布尔类型的值可以为 true 或者 false。

```json
{ "x": true }
```

**数值类型** - shell 默认使用 64 位的浮点数来表示数值类型。因此，下面的数值在 shell 中看起来是“正常”的：

```json
{"x" : 3.14}
{"x" : 3}
```

对于整数，可以使用 NumberInt 或 NumberLong 类，它们分别表示 4 字节和 8 字节的有符号整数。

```json
{"x" : NumberInt("3")}
{"x" : NumberLong("3")}
```

**字符串类型** - 任何 UTF-8 字符串都可以使用字符串类型来表示。

```json
{ "x": "foobar" }
```

**日期类型** - MongoDB 会将日期存储为 64 位整数，表示自 Unix 纪元（1970 年 1 月 1 日）以来的毫秒数，不包含时区信息。

```json
{"x" : new Date()}
```

**正则表达式** - 查询时可以使用正则表达式，语法与 JavaScript 的正则表达式语法相同。

```json
{"x" : /foobar/i}
```

**数组类型** - 集合或者列表可以表示为数组。

```json
{ "x": ["a", "b", "c"] }
```

**内嵌文档** - 文档可以嵌套其他文档，此时被嵌套的文档就成了父文档的值。

```json
{ "x": { "foo": "bar" } }
```

**Object ID** - Object ID 是一个 12 字节的 ID，是文档的唯一标识。MongoDB 中存储的每个文档都必须有一个 "`_id`" 键。"`_id`" 的值可以是任何类型，但其默认为 ObjectId。在单个集合中，每个文档的 "`_id`" 值都必须是唯一的，以确保集合中的每个文档都可以被唯一标识。

```json
{"x" : ObjectId()}
```

ObjectId 占用了 12 字节的存储空间，可以用 24 个十六进制数字组成的字符串来表示。

```
0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  |  10  |  11
         时间戳       |           随机值            | 计数器（起始值随机）
```

ObjectId 的前 4 字节是从 Unix 纪元开始以秒为单位的时间戳。这提供了一些有用的属性。时间戳与接下来的 5 字节（稍后会介绍）组合在一起，在秒级别的粒度上提供了唯一性。

**二进制数据** - 二进制数据是任意字节的字符串，不能通过 shell 操作。如果要将非 UTF-8 字符串存入数据库，那么使用二进制数据是唯一的方法。

代码 - MongoDB 还可以在查询和文档中存储任意的 JavaScript 代码：

```json
{"x" : function() { /* ... */ }}
```

最后，还有一些类型主要在内部使用（或被其他类型取代）。这些将根据需要在文中特别说明

### 使用 MongoDB shell（略）

## 第 3 章 创建、更新和删除文档

### 插入文档

#### insertOne

`insertOne` 方法用于**插入单条文档**。

insertOne 方法语法如下：

```
db.collection.insertOne(document, options)
```

- document - 要插入的单个文档。
- options（可选） - 一个可选参数对象，可以包含 `writeConcern` 和 `bypassDocumentValidation` 等。

【示例】向 `movies` 集合中插入一条文档

```json
> db.movies.insertOne({"title" : "Stand by Me"})
```

#### insertMany

`insertMany` 方法用于**批量插入文档**。

`insertMany` 方法语法如下：

```
db.collection.insertMany(documents, options)
```

- documents - 要插入的文档数组。
- options（可选） - 一个可选参数对象，可以包含 `ordered`、`writeConcern` 和 `bypassDocumentValidation` 等。

```json
> db.movies.insertMany([{"title" : "Ghostbusters"},{"title" : "E.T."},{"title" : "Blade Runner"}]);
```

在当前版本中，MongoDB 能够接受的最大消息长度是 48MB，因此在单次批量插入中能够插入的文档是有限制的。如果尝试插入超过 48MB 的数据，则多数驱动程序会将这个批量插入请求拆分为多个 48MB 的批量插入请求。

MongoDB 会对要插入的数据进行最基本的检查：检查文档的基本结构，如果不存在 "`_id`" 字段，则自动添加一个。

### 删除文档

#### deleteOne

`deleteOne` 方法用于**删除单条文档**

```json
> db.movies.find()
{ "_id" : ObjectId("670a31a206fe06538fb4d138"), "title" : "Stand by Me" }
{ "_id" : ObjectId("670a31ab06fe06538fb4d139"), "title" : "Ghostbusters" }
{ "_id" : ObjectId("670a31ab06fe06538fb4d13a"), "title" : "E.T." }
{ "_id" : ObjectId("670a31ab06fe06538fb4d13b"), "title" : "Blade Runner" }

> db.movies.deleteOne({"_id" : ObjectId("670a31a206fe06538fb4d138")})
{ "acknowledged" : true, "deletedCount" : 1 }

> db.movies.find()
{ "_id" : ObjectId("670a31ab06fe06538fb4d139"), "title" : "Ghostbusters" }
{ "_id" : ObjectId("670a31ab06fe06538fb4d13a"), "title" : "E.T." }
{ "_id" : ObjectId("670a31ab06fe06538fb4d13b"), "title" : "Blade Runner" }
```

#### deleteMany

`deleteMany` 方法用于**删除满足筛选条件的所有文档**

```json
> db.movies.find()
{ "_id" : 0, "title" : "Top Gun", "year" : 1986 }
{ "_id" : 1, "title" : "Back to the Future", "year" : 1985 }
{ "_id" : 3, "title" : "Sixteen Candles", "year" : 1984 }
{ "_id" : 4, "title" : "The Terminator", "year" : 1984 }
{ "_id" : 5, "title" : "Scarface", "year" : 1983 }

> db.movies.deleteMany({"year" : 1984}){ "acknowledged" : true, "deletedCount" : 2 }

> db.movies.find()
{ "_id" : 0, "title" : "Top Gun", "year" : 1986 }
{ "_id" : 1, "title" : "Back to the Future", "year" : 1985 }
{ "_id" : 5, "title" : "Scarface", "year" : 1983 }
```

可以使用 `deleteMany` 来**删除集合中的所有文档**

```json
> db.movies.find()
{ "_id" : 0, "titl
e" : "Top Gun", "year" : 1986 }{ "_id" : 1, "titl
e" : "Back to the Future", "year" : 1985 }{ "_id" : 3, "titl
e" : "Sixteen Candles", "year" : 1984 }{ "_id" : 4, "titl
e" : "The Terminator", "year" : 1984 }{ "_id" : 5, "titl
e" : "Scarface", "year" : 1983 }

> db.movies.deleteMany({})
{ "acknowledged" :true, "deletedCount" : 5 }

> db.movies.find()
```

### 更新文档

#### replaceOne

`replaceOne` 方法用于**将新文档完全替换匹配的文档**。这对于进行大规模模式迁移的场景非常有用。

```
db.collection.replaceOne(filter, replacement, options)
```

- **filter** - 用于查找文档的查询条件。
- **replacement** - 新的文档，将替换旧的文档。
- **options** - 可选参数对象，如 `upsert` 等。

【示例】replaceOne 示例

```json
db.collection.replaceOne(
    { name: "Tom" },                  // 过滤条件
    { name: "Tom", age: 18 }          // 新文档
);
```

#### updateOne

`updateOne` 方法用于**更新单条文档**。

`updateOne` 方法语法如下：

```
db.collection.updateOne(filter, update, options)
```

- **filter** - 用于查找文档的查询条件。
- **update** - 指定更新操作的文档或更新操作符。
- **options** - 可选参数对象，如 `upsert`、`arrayFilters` 等。

【示例】updateOne 示例

```json
db.collection.updateOne(
    { name: "Tom" },                // 过滤条件
    { $set: { age: 19 } },            // 更新操作
    { upsert: false }                 // 可选参数
);
```

#### updateMany

`updateMany` 方法用于**批量更新文档**。

`updateMany` 方法语法如下：

```
db.collection.updateMany(filter, update, options)
```

- **filter** - 用于查找文档的查询条件。
- **update** - 指定更新操作的文档或更新操作符。
- **options** - 可选参数对象，如 `upsert`、`arrayFilters` 等。

【示例】updateMany 示例

```json
db.collection.updateMany(
    { age: { $lt: 30 } },             // 过滤条件
    { $set: { status: "active" } },   // 更新操作
    { upsert: false }                  // 可选参数
);
```

#### 更新运算符

**"$set" 用来设置一个字段的值**。如果这个字段不存在，则创建该字段。

```json
// 使用 "$set" 来修改值
> db.users.updateOne({"name" : "joe"},{"$set" : {"favorite book" : "Green Eggs and Ham"}})

// 使用 "$set" 来修改键的类型
// 将 "favorite book" 键的值更改为一个数组
> db.users.updateOne({"name" : "joe"},{"$set" : {"favorite book" : "Green Eggs and Ham"}})

// 如果用户发现自己其实不爱读书，则可以用 "$unset" 将这个键完全删除
> db.users.updateOne({"name" : "joe"},{"$unset" : {"favorite book" : 1}})
```

**"$inc" 运算符可以用来修改已存在的键值或者在该键不存在时创建它**。对于更新分析数据、因果关系、投票或者其他有数值变化的地方，使用这个会非常方便。

```json
> db.games.updateOne({"game":"pinball","user":"joe"},{"$inc":{"score":50}})
```

**如果数组已存在，"$push" 就会将元素添加到数组末尾；如果数组不存在，则会创建一个新的数组**。

```json
> db.blog.posts.updateOne({"title":"A blog post"},{"$push":{"comments":{"name":"joe","email":"joe@example.com","content":"nice post."}}})
```

**如果将数组视为队列或者栈，那么可以使用 "$pop"从任意一端删除元素**。`{"$pop":{"key":1}}` 会从数组末尾删除一个元素，`{"$pop":{"key":-1}}` 则会从头部删除它。

**"$pull" 用于删除与给定条件匹配的数组元素**。

```json
> db.lists.updateOne({}, {"$pull" : {"todo" : "laundry"}})
```

#### upsert

upsert 是一种特殊类型的更新。如果找不到与筛选条件相匹配的文档，则会以这个条件和更新文档为基础来创建一个新文档；如果找到了匹配的文档，则进行正常的更新。

```json
> db.users.updateOne({"rep" : 25}, {"$inc" : {"rep" : 3}}, {"upsert" : true})
```

## 第 4 章 查询

### find 简介

**MongoDB 中使用 find 方法来进行查询**。查询就是返回集合中文档的一个子集，子集的范围从 0 个文档到整个集合。要返回哪些文档由 find 的第一个参数决定，该参数是一个用于指定查询条件的文档。

find 的语法格式如下：

```json
db.collection.find(query, projection)
```

- **query** - 用于查找文档的查询条件。默认为 `{}`，即匹配所有文档。
- **projection**（可选） - 指定返回结果中包含或排除的字段。

【示例】查找示例

```json
// 查找所有文档
> db.collection.find()

// 按条件查找文档
> db.collection.find({ age: { $gt: 25 } })

// 按条件查找文档，并只返回指定字段
> db.collection.find(
    { age: { $gt: 25 } },
    { name: 1, age: 1, _id: 0 }
)

// 以格式化的方式来显示所有文档
> db.collection.find().pretty()
```

### 查询条件

#### 比较操作符

| 操作符 | 描述             | 示例                              |
| :----- | :--------------- | :-------------------------------- |
| `$eq`  | 等于             | `{ age: { $eq: 25 } }`            |
| `$ne`  | 不等于           | `{ age: { $ne: 25 } }`            |
| `$gt`  | 大于             | `{ age: { $gt: 25 } }`            |
| `$gte` | 大于等于         | `{ age: { $gte: 25 } }`           |
| `$lt`  | 小于             | `{ age: { $lt: 25 } }`            |
| `$lte` | 小于等于         | `{ age: { $lte: 25 } }`           |
| `$in`  | 在指定的数组中   | `{ age: { $in: [25, 30, 35] } }`  |
| `$nin` | 不在指定的数组中 | `{ age: { $nin: [25, 30, 35] } }` |

【示例】查找年龄大于 25 且城市为 "New York" 的文档：

```json
db.collection.find({ age: { $gt: 25 }, city: "New York" });
```

#### 逻辑操作符

| 操作符 | 描述                   | 示例                                                       |
| :----- | :--------------------- | :--------------------------------------------------------- |
| `$and` | 逻辑与，符合所有条件   | `{ $and: [ { age: { $gt: 25 } }, { city: "New York" } ] }` |
| `$or`  | 逻辑或，符合任意条件   | `{ $or: [ { age: { $lt: 25 } }, { city: "New York" } ] }`  |
| `$not` | 取反，不符合条件       | `{ age: { $not: { $gt: 25 } } }`                           |
| `$nor` | 逻辑与非，均不符合条件 | `{ $nor: [ { age: { $gt: 25 } }, { city: "New York" } ] }` |

【示例】查找年龄大于 25 或城市为 "New York" 的文档：

```json
db.collection.find({ $or: [ { age: { $gt: 25 } }, { city: "New York" } ] });
```

#### 元素操作符

| 操作符    | 描述             | 示例                         |
| :-------- | :--------------- | :--------------------------- |
| `$exists` | 字段是否存在     | `{ age: { $exists: true } }` |
| `$type`   | 字段的 BSON 类型 | `{ age: { $type: "int" } }`  |

【示例】查找包含 age 字段的文档：

```json
db.myCollection.find({ age: { $exists: true } });
```

#### 数组操作符

| 操作符       | 描述                       | 示例                                                           |
| :----------- | :------------------------- | :------------------------------------------------------------- |
| `$all`       | 数组包含所有指定的元素     | `{ tags: { $all: ["red", "blue"] } }`                          |
| `$elemMatch` | 数组中的元素匹配指定条件   | `{ results: { $elemMatch: { score: { $gt: 80, $lt: 85 } } } }` |
| `$size`      | 数组的长度等于指定值       | `{ tags: { $size: 3 } }`                                       |
| `slice`      | 返回一个数组键中元素的子集 |                                                                |

查询数组元素的方式与查询标量值相同。

```json
// 插入数组列表
db.food.insertOne({"fruit" : ["apple", "banana", "peach"]}
// 查找数组中的 banana 元素
db.food.find({"fruit" : "banana"})
```

如果需要通过多个元素来匹配数组，那么可以使用 "$all"。

```json
db.food.insertOne({"_id" : 1, "fruit" : ["apple", "banana", "peach"]})
db.food.insertOne({"_id" : 2, "fruit" : ["apple", "kumquat", "orange"]})
db.food.insertOne({"_id" : 3, "fruit" : ["cherry", "banana", "apple"]})

// 查询同时包含元素 "apple" 和 "banana" 的文档
db.food.find({fruit : {$all : ["apple", "banana"]}})
```

查询特定长度的数组

```json
db.food.find({"fruit" : {"$size" : 3}})
```

#### 其他操作符

还有一些其他操作符如下：

| 操作符   | 描述                               | 示例                               |
| :------- | :--------------------------------- | :--------------------------------- |
| `$regex` | 匹配正则表达式                     | `{ name: { $regex: /^A/ } }`       |
| `$text`  | 进行文本搜索                       | `{ $text: { $search: "coffee" } }` |
| `$where` | 使用 JavaScript 表达式进行条件过滤 | `{ $where: "this.age > 25" }`      |

查找名字以 "A" 开头的文档：

```json
db.myCollection.find({ name: { $regex: /^A/ } })
```

### 特定类型查询

#### null

null 会匹配值为 null 的文档以及缺少这个键的所有文档

```json
> db.c.find({"z" : null})
```

如果仅想匹配键值为 null 的文档，则需要检查该键的值是否为 null，并且通过 "$exists" 条件确认该键已存在。

```json
db.c.find({"z" : {"$eq" : null, "$exists" : true}})
```

#### 正则表达式

$regex" 可以在查询中为字符串的模式匹配提供正则表达式功能。正则表达式对于灵活的字符串匹配非常有用。

```json
> db.users.find( {"name" : {"$regex" : /joe/i } })
```

MongoDB 会使用 Perl 兼容的正则表达式（PCRE）库来对正则表达式进行匹配。任何 PCRE 支持的正则表达式语法都能被 MongoDB 接受。在查询中使用正则表达式之前，最好先在 JavaScript shell 中检查一下语法，这样可以确保匹配与预想的一致。

#### 查询内嵌文档

假设文档形式如下：

```json
{
  "name": {
    "first": "Joe",
    "last": "Schmoe"
  },
  "age": 45
}
```

查询 first 属性为 Joe，last 属性为 Schmoe 的文档：

```
db.people.find({"name.first" : "Joe", "name.last" : "Schmoe"})
```

#### `$where` 查询

`$where` 允许你在查询中执行任意的 JavaScript 代码。这样就能在查询中做大部分事情了。除非绝对必要，否则不应该使用 "$where" 查询：它们比常规查询慢得多。

```json
db.foo.find({"$where" : function () {
	for (var current in this) {
		for (var other in this) {
			if (current != other && this[current] == this[other]) {
				return true;
			}
		}
	}
	return false;
}});
```

#### 游标

数据库会使用游标返回 find 的执行结果。

```json
var cursor = db.people.find();
cursor.forEach(function(x) {
	print(x.name);
});
```

`limit()` 方法用于限制查询结果返回的文档数量。

```json
db.collection.find().limit(10);
```

`skip()` 方法用于跳过指定数量的文档，从而实现分页或分批查询。

```json
// 跳过前 10 个文档，返回接下来的 10 个文档
db.collection.find().skip(10).limit(10);
```

`sort()` 方法可以通过参数指定排序的字段。

```json
// 先按 age 字段升序排序，再按 createdAt 字段降序排序
db.myCollection.find().sort({ age: 1, createdAt: -1 });
```

## 参考资料

- [《MongoDB 权威指南》](https://book.douban.com/subject/35688800/)
