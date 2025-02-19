---
icon: logos:mongodb
title: MongoDB 简介
date: 2020-09-07 07:54:19
categories:
  - 数据库
  - 文档数据库
  - MongoDB
tags:
  - 数据库
  - 文档数据库
  - MongoDB
  - BSON
permalink: /pages/9eca06f6/
---

# MongoDB 简介

## 什么是 MongoDB

MongoDB 是一个分布式文档数据库，由 C++ 语言编写。

面向文档的数据库使用更灵活的“文档”模型取代了“行”的概念。通过嵌入文档和数组，面向文档的方式可以仅用一条记录来表示复杂的层次关系。

## 面向文档

MongoDB 中的记录是一个文档，它是由字段和值对组成的数据结构。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档、数组和文档数组。

![A MongoDB document.](https://www.mongodb.com/zh-cn/docs/manual/images/crud-annotated-document.bakedsvg.svg)

MongoDB 中没有预定义模式（predefined schema）：文档键值的类型和大小不是固定的。由于没有固定的模式，因此按需添加或删除字段变得更容易。

综上，**MongoDB 支持结构化、半结构化数据模型，可以动态响应结构变化**。

## 为什么使用 MongoDB

### 主要功能

MongoDB 提供了丰富的功能：

- [**读写操作 (CRUD)**](https://www.mongodb.com/zh-cn/docs/manual/crud/#std-label-crud)
- [**数据聚合**](https://www.mongodb.com/zh-cn/docs/manual/core/aggregation-pipeline/#std-label-aggregation-pipeline)
- [**文本搜索**](https://www.mongodb.com/zh-cn/docs/manual/text-search/#std-label-text-search)
- [**地理空间搜索**](https://www.mongodb.com/zh-cn/docs/manual/tutorial/geospatial-tutorial/)
- ...

### 分布式

MongoDB 作为分布式存储，自然也具备了分布式的一般特性：

- **高可用** - 通过**复制**机制实现**高可用**，提供**数据冗余**和**自动故障转移**能力。在 MongoDB 中，这种机制称为**[副本集](https://www.mongodb.com/zh-cn/docs/manual/replication/)**。**[副本集](https://www.mongodb.com/zh-cn/docs/manual/replication/)** 是一组 MongoDB 服务器，它们维护相同的数据集，并可提供冗余和提高数据可用性。
- **高性能** - 通过**分片**机制提供**水平扩容**能力，以支撑海量数据，海量并发。从 3.4 开始，MongoDB 支持基于[**分片键**](https://www.mongodb.com/zh-cn/docs/manual/core/zone-sharding/#std-label-zone-sharding)创建数据的[**区域**](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard-key)。在均衡的集群中，MongoDB 仅将区域覆盖的读写定向到区域内的那些分片。

### 存储引擎

MongoDB 支持[多种存储引擎：](https://www.mongodb.com/zh-cn/docs/manual/core/storage-engines/)

- [WiredTiger Storage Engine](https://www.mongodb.com/zh-cn/docs/manual/core/wiredtiger/)（包括对[静态加密](https://www.mongodb.com/zh-cn/docs/manual/core/security-encryption-at-rest/)的支持）
- [用于自我管理部署的内存存储引擎。](https://www.mongodb.com/zh-cn/docs/manual/core/inmemory/)

此外，MongoDB 还提供可插拔的存储引擎 API，从而允许第三方基于 MongoDB 开发存储引擎。

## MongoDB 历史

- 1.x - 支持复制和分片
- 2.x - 更丰富的数据库功能
- 3.x - WiredTiger 和周边生态
- 4.x - 支持分布式事务

## MongoDB 概念

MongoDB 将数据记录存储为 [BSON 文档](https://www.mongodb.com/zh-cn/docs/manual/core/document/#std-label-bson-document-format)。BSON 是 [JSON](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-JSON) 文档的二进制表示形式，尽管它包含的数据类型比 JSON 多。最大 BSON 文档大小为 16 MB。

每个MongoDB 文档都需要一个唯一的 [\_id](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-_id) 字段作为[主键](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-primary-key)。如果插入的文档省略了 `_id` 字段，则 MongoDB 驱动程序会自动为 `_id` 字段生成 [ObjectId](https://www.mongodb.com/zh-cn/docs/manual/reference/bson-types/#std-label-objectid)。

这些 [MongoDB 文档](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-document)收集在[集合](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-collection)中。[数据库](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-database)存储一个或多个文档集合。

为了方便理解MongoDB 概念，下面将MongoDB概念和 RDBM 概念进行对比：

| RDBM 概念          | MongoDB 概念                                                                       |
| :----------------- | :--------------------------------------------------------------------------------- |
| database（数据库） | database（数据库）                                                                 |
| table（表）        | collection（集合）                                                                 |
| row（行）          | document（文档）                                                                   |
| column（列）       | field（字段）                                                                      |
| index（索引）      | index（索引）                                                                      |
| primary key        | [\_id](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-_id) |

### 数据库

一个 MongoDB 中可以建立多个数据库。

MongoDB 的默认数据库为"db"，该数据库存储在 data 目录中。

MongoDB 的单个实例可以容纳多个独立的数据库，每一个都有自己的集合和权限，不同的数据库也放置在不同的文件中。

**"show dbs"** 命令可以显示所有数据的列表。

```shell
$ ./mongo
MongoDBshell version: 3.0.6
connecting to: test
> show dbs
local  0.078GB
test   0.078GB
>
```

执行 **"db"** 命令可以显示当前数据库对象或集合。

```shell
$ ./mongo
MongoDBshell version: 3.0.6
connecting to: test
> db
test
>
```

运行"use"命令，可以连接到一个指定的数据库。

```shell
> use local
switched to db local
> db
local
>
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

### 文档

文档是 MongoDB 中的基本数据单元。

文档是一组有序键值对(即 BSON)。MongoDB 的文档不需要设置相同的字段，并且相同的字段不需要相同的数据类型，这与关系型数据库有很大的区别，也是 MongoDB 非常突出的特点。

需要注意的是：

- 文档中的键/值对是有序的。

- 文档的键是字符串。除了少数例外情况，键可以使用任意 UTF-8 字符。

- 文档中的值不仅可以是在双引号里面的字符串，还可以是其他几种数据类型（甚至可以是整个嵌入的文档)。

- MongoDB 区分类型和大小写。例如，下面这两对文档是不同的：

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

- 键不能含有 `\0` (空字符)。这个字符用来表示键的结尾。
- `.` 和 `$` 有特别的意义，只有在特定环境下才能使用。
- 以下划线 `_` 开头的键是保留的(不是严格要求的)。

### 集合

集合就是 MongoDB 文档组，类似于 RDBMS （关系数据库管理系统：Relational Database Management System)中的表格。

集合存在于数据库中，集合没有固定的结构，这意味着你在对集合可以插入不同格式和类型的数据，但通常情况下我们插入集合的数据都会有一定的关联性。

使用 `.` 字符分隔不同命名空间的子集合是一种组织集合的惯例。例如，有一个具有博客功能的应用程序，可能包含名为 `blog.posts` 和名为 `blog.authors` 的集合。

合法的集合名：

- 集合名称不能是空字符串（""）。
- 集合名称不能含有 `\0`（空字符），因为这个字符用于表示一个集合名称的结束。
- 集合名称不能以 `system.` 开头，该前缀是为内部集合保留的。例如，`system.users` 集合中保存着数据库的用户，`system.namespaces` 集合中保存着有关数据库所有集合的信息。
- 用户创建的集合名称中不应包含保留字符 `$`。许多驱动程序确实支持在集合名称中使用 `$`，这是因为某些由系统生成的集合会包含它，但除非你要访问的是这些集合之一，否则不应在名称中使用 `$` 字符。

### 元数据

数据库的信息是存储在集合中。它们使用了系统的命名空间：`dbname.system.*`

在 MongoDB 数据库中名字空间 `<dbname>.system.*` 是包含多种系统信息的特殊集合(Collection)，如下:

| 集合命名空间             | 描述                                      |
| :----------------------- | :---------------------------------------- |
| dbname.system.namespaces | 列出所有名字空间。                        |
| dbname.system.indexes    | 列出所有索引。                            |
| dbname.system.profile    | 包含数据库概要(profile)信息。             |
| dbname.system.users      | 列出所有可访问数据库的用户。              |
| dbname.local.sources     | 包含复制对端（slave）的服务器信息和状态。 |

对于修改系统集合中的对象有如下限制。

在 `system.indexes` 插入数据，可以创建索引。但除此之外该表信息是不可变的(特殊的 drop index 命令将自动更新相关信息)。`system.users` 是可修改的。`system.profile` 是可删除的。

## BSON 数据类型

MongoDB 文档由键值对组成。字段名称是字符串；字段的值可以是任何 [BSON 数据类型](https://www.mongodb.com/zh-cn/docs/manual/reference/bson-types/#std-label-bson-types)，包括其他文档、数组和文档数组。

| 数据类型           | 描述                                                                                                       |
| :----------------- | :--------------------------------------------------------------------------------------------------------- |
| String             | 字符串。存储数据常用的数据类型。在 MongoDB 中，UTF-8 编码的字符串才是合法的。                              |
| Integer            | 整型数值。用于存储数值。根据你所采用的服务器，可分为 32 位或 64 位。                                       |
| Boolean            | 布尔值。用于存储布尔值（真/假）。                                                                          |
| Double             | 双精度浮点值。用于存储浮点值。                                                                             |
| Min/Max keys       | 将一个值与 BSON（二进制的 JSON）元素的最低值和最高值相对比。                                               |
| Array              | 用于将数组或列表或多个值存储为一个键。                                                                     |
| Timestamp          | 时间戳。记录文档修改或添加的具体时间。                                                                     |
| Object             | 用于内嵌文档。                                                                                             |
| Null               | 用于创建空值。                                                                                             |
| Symbol             | 符号。该数据类型基本上等同于字符串类型，但不同的是，它一般用于采用特殊符号类型的语言。                     |
| Date               | 日期时间。用 UNIX 时间格式来存储当前日期或时间。你可以指定自己的日期时间：创建 Date 对象，传入年月日信息。 |
| Object ID          | 对象 ID。用于创建文档的 ID。                                                                               |
| Binary Data        | 二进制数据。用于存储二进制数据。                                                                           |
| Code               | 代码类型。用于在文档中存储 JavaScript 代码。                                                               |
| Regular expression | 正则表达式类型。用于存储正则表达式。                                                                       |

## MongoDB vs.RDBM

| 特性      | MongoDB                                          | RDBMS    |
| --------- | ------------------------------------------------ | -------- |
| 数据模型  | 文档模型                                         | 关系型   |
| CRUD 操作 | MQL/SQL                                          | SQL      |
| 高可用    | 复制集                                           | 集群模式 |
| 扩展性    | 支持分片                                         | 数据分区 |
| 扩繁方式  | 垂直扩展+水平扩展                                | 垂直扩展 |
| 索引类型  | B 树、全文索引、地理位置索引、多键索引、TTL 索引 | B 树     |
| 数据容量  | 没有理论上限                                     | 千万、亿 |

## 参考资料

- [MongoDB 官网](https://www.mongodb.com/)
- [MongoDB Github](https://github.com/mongodb/mongo)
- [MongoDB 教程](https://www.runoob.com/mongodb/mongodb-tutorial.html)
