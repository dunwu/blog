---
icon: logos:mongodb
title: MongoDB 简介
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202503062317588.webp
date: 2020-09-07 07:54:19
categories:
  - 数据库
  - 文档数据库
  - mongodb
tags:
  - 数据库
  - 文档数据库
  - mongodb
  - bson
permalink: /pages/9eca06f6/
---

# MongoDB 简介

::: info 概述

**MongoDB 是一个流行的、开源的文档数据库**。

本文简单介绍了 MongoDB 的功能、特性、发行版本、简史、概念，可以让读者在短时间内对于 MongoDB 有一个初步的认识。

:::

<!-- more -->

## 什么是 MongoDB

MongoDB 是一个**面向文档**的开源 NoSQL 数据库系统，由 **C++** 编写的。MongoDB 支持“**无模式**”的数据建模，可以存储比较复杂的数据类型，是一款非常流行的 **文档类型数据库** 。

在高负载的情况下，MongoDB 天然支持水平扩展和高可用，可以很方便地添加更多的节点/实例，以保证服务性能和可用性。在许多场景下，MongoDB 可以用于代替传统的关系型数据库或键/值存储方式，皆在为 Web 应用提供可扩展的高可用高性能数据存储解决方案。

MongoDB 提供了丰富的功能：

- [**读写操作 (CRUD)**](https://www.mongodb.com/zh-cn/docs/manual/crud/#std-label-crud)
- [**数据聚合**](https://www.mongodb.com/zh-cn/docs/manual/core/aggregation-pipeline/#std-label-aggregation-pipeline)
- [**文本搜索**](https://www.mongodb.com/zh-cn/docs/manual/text-search/#std-label-text-search)
- [**地理空间搜索**](https://www.mongodb.com/zh-cn/docs/manual/tutorial/geospatial-tutorial/)
- ...

## MongoDB 特性

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

## MongoDB 发行版本

MongoDB 有以下发行版本：

- [MongoDB Atlas](https://www.mongodb.com/zh-cn/docs/atlas?tck=docs_server) - 用于云端 MongoDB 部署的完全托管服务
- [MongoDB Enterprise](https://www.mongodb.com/zh-cn/docs/manual/administration/install-enterprise/#std-label-install-mdb-enterprise) - 基于订阅、自行管理的 MongoDB 版本
- [MongoDB Community](https://www.mongodb.com/zh-cn/docs/manual/administration/install-community/#std-label-install-mdb-community-edition) - source-available、可免费使用以及自行管理的 MongoDB 版本

## MongoDB 简史

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

## MongoDB 概念

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

### 文档

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

### 集合

集合就是 MongoDB 文档组，类似于 RDBMS （关系数据库管理系统：Relational Database Management System) 中的表（Table）。集合存在于数据库中，集合没有固定的结构，这意味着你在对集合可以插入不同格式和类型的数据，但通常情况下我们插入集合的数据都会有一定的关联性。

![MongoDB Collection](https://raw.githubusercontent.com/dunwu/images/master/snap/202503041024137.png)

集合不需要事先创建，当第一个文档插入或者第一个索引创建时，如果该集合不存在，则会创建一个新的集合。使用 `.` 字符分隔不同命名空间的子集合是一种组织集合的惯例。例如，有一个具有博客功能的应用程序，可能包含名为 `blog.posts` 和名为 `blog.authors` 的集合。

合法的集合名：

- 集合名称不能是空字符串（""）。
- 集合名称不能含有 `\0`（空字符），因为这个字符用于表示一个集合名称的结束。
- 集合名称不能以 `system.` 开头，该前缀是为内部集合保留的。例如，`system.users` 集合中保存着数据库的用户，`system.namespaces` 集合中保存着有关数据库所有集合的信息。
- 用户创建的集合名称中不应包含保留字符 `$`。许多驱动程序确实支持在集合名称中使用 `$`，这是因为某些由系统生成的集合会包含它，但除非你要访问的是这些集合之一，否则不应在名称中使用 `$` 字符。

### 数据库

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
>
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

### 元数据

数据库的信息是存储在集合中。它们使用了系统的命名空间：`dbname.system.*`

在 MongoDB 数据库中命名空间 `<dbname>.system.*` 是包含多种系统信息的特殊集合 (Collection)，如下：

| 集合命名空间               | 描述                                      |
| :------------------------- | :---------------------------------------- |
| `dbname.system.namespaces` | 列出所有命名空间。                        |
| `dbname.system.indexes`    | 列出所有索引。                            |
| `dbname.system.profile`    | 包含数据库概要 (profile) 信息。           |
| `dbname.system.users`      | 列出所有可访问数据库的用户。              |
| `dbname.local.sources`     | 包含复制对端（slave）的服务器信息和状态。 |

对于修改系统集合中的对象有如下限制。

在 `system.indexes` 插入数据，可以创建索引。但除此之外该表信息是不可变的（特殊的 drop index 命令将自动更新相关信息）。`system.users` 是可修改的。`system.profile` 是可删除的。

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

- [MongoDB 官方文档之 MongoDB 简介](https://www.mongodb.com/zh-cn/docs/manual/introduction/)
- [MongoDB 简史](https://www.infoq.cn/article/3d4suwkc2fvikykemnvw)
- [MongoDB 发展历史及各主要版本新特性概述](https://blog.csdn.net/JiekeXu/article/details/143670868)
