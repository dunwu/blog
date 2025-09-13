---
icon: logos:mongodb
title: MongoDB 事务
date: 2020-09-20 23:12:17
categories:
  - 数据库
  - 文档数据库
  - mongodb
tags:
  - 数据库
  - 文档数据库
  - mongodb
  - 事务
permalink: /pages/a9eba9b9/
---

# MongoDB 事务

::: info 概述

通俗的说，**事务将多个读、写操作捆绑在一起成为一个逻辑操作单元**。**事务中的所有读写是一个执行的整体，整个事务要么成功（提交）、要么失败（中止或回滚）**。如果失败，应用程序可以安全地重试。这样，由于不需要担心部分失败的情况（无论出于任何原因），应用层的错误处理就变得简单很多。

大多数 NoSQL 只能部分支持事务，甚至完全不支持事务。但是，MongoDB 支持 ACID 事务，这是它的一大优势。

本文主要介绍了 MongoDB 对于事务的支持力度，以及如何应用事务。

:::

<!-- more -->

## MongoDB 事务简介

在 MongoDB 中，**对单个文档的操作具有原子性**。由于可以使用嵌入式文档和数组来捕获单个文档结构中数据之间的关系，而无需跨多个文档和集合进行标准化，因此这种单文档原子性消除了许多实际使用案例使用分布式事务的必要性。

对于需要对多文档（在单个或多个集合中）的读写操作具有原子性的情况，MongoDB 支持多文档事务。利用分布式事务，可以跨多个操作、集合、数据库、文档和分片使用事务。

:::details 【示例】使用 MongoDB Java Driver 进行事务操作

此示例重点介绍了事务 API 的关键组件。特别是，它使用回调 API。回调 API：

- 启动事务
- 执行指定操作
- 提交结果或出现错误时结束事务

```java
/*
  For a replica set, include the replica set name and a seedlist of the members in the URI string; e.g.
  String uri = "mongodb://mongodb0.example.com:27017,mongodb1.example.com:27017/admin?replicaSet=myRepl";
  For a sharded cluster, connect to the mongos instances.
  For example:
  String uri = "mongodb://mongos0.example.com:27017,mongos1.example.com:27017:27017/admin";
 */
final MongoClient client = MongoClients.create(uri);
/*
    Create collections.
 */
client.getDatabase("mydb1").getCollection("foo")
        .withWriteConcern(WriteConcern.MAJORITY).insertOne(new Document("abc", 0));
client.getDatabase("mydb2").getCollection("bar")
        .withWriteConcern(WriteConcern.MAJORITY).insertOne(new Document("xyz", 0));
/* Step 1: Start a client session. */
final ClientSession clientSession = client.startSession();
/* Step 2: Optional. Define options to use for the transaction. */
TransactionOptions txnOptions = TransactionOptions.builder()
        .writeConcern(WriteConcern.MAJORITY)
        .build();
/* Step 3: Define the sequence of operations to perform inside the transactions. */
TransactionBody txnBody = new TransactionBody<String>() {
    public String execute() {
        MongoCollection<Document> coll1 = client.getDatabase("mydb1").getCollection("foo");
        MongoCollection<Document> coll2 = client.getDatabase("mydb2").getCollection("bar");
        /*
           Important:: You must pass the session to the operations.
         */
        coll1.insertOne(clientSession, new Document("abc", 1));
        coll2.insertOne(clientSession, new Document("xyz", 999));
        return "Inserted into collections in different databases";
    }
};
try {
    /*
       Step 4: Use .withTransaction() to start a transaction,
       execute the callback, and commit (or abort on error).
    */
    clientSession.withTransaction(txnBody, txnOptions);
} catch (RuntimeException e) {
    // some error handling
} finally {
    clientSession.close();
}
```

writeConcern 可以决定写操作到达多少个节点才算成功。

- 默认：多节点复制集不做任何设定，所以是有可能丢失数据。
- `w: "majority"`：大部分节点确认，就视为写成功
- `w: "all"`：全部节点确认，才视为写成功

journal 则定义如何才算成功。取值包括：

- `true`：写操作落到 journal 文件中才算成功；
- `false`：写操作达到内存即算作成功。

:::

## MongoDB 分布式事务

对于需要对多个文档（在单个或多个集合中）原子性读取和写入的情况，MongoDB 支持分布式事务，包括副本集和分片集群上的事务。可以跨多个操作、集合、数据库、文档和分片使用分布式事务。

分布式事务具有原子性：

- 事务要么应用所有数据更改，要么回滚更改。
- 在事务提交时，事务中所做的所有数据更改都会保存，并且在事务之外可见。
  - 在事务进行提交前，在事务中所做的数据更改在事务外不可见。
  - 不过，当事务写入多个分片时，并非所有外部读取操作都需等待已提交事务的结果在各个分片上可见。例如，如果事务已提交并且写入 1 在分片 A 上可见，但写入 2 在分片 B 上尚不可见，则读关注 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-) 处的外部读取可以在不看到写入 2 的情况下读取写入 1 的结果。
- 事务中止后，在事务中所做的所有数据更改会被丢弃且不会变得可见。例如，如果事务中的任何操作失败，事务就会中止，事务中所做的所有数据更改将被丢弃且不会变得可见。

> 要点：在大多数情况下，与单文档写入操作相比，分布式事务会产生更高的性能成本，并且分布式事务的可用性不应取代有效的模式设计。在许多情况下，[非规范化数据模型（嵌入式文档和数组）](https://www.mongodb.com/zh-cn/docs/manual/data-modeling/concepts/embedding-vs-references/#std-label-data-modeling-embedding) 仍然是数据和使用案例的最佳选择。换言之，对于许多场景，适当的数据建模将最大限度地减少对分布式事务的需求。

## MongoDB 事务操作

可以跨多个操作、集合、数据库、文档和分片使用分布式事务。

对于事务：

- 可以在事务中创建集合和索引。
- 事务中使用的集合可以位于不同的数据库中。

### 在事务中创建集合和索引

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

### 计数操作

要在事务内执行计数操作，请使用 [`$count`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/count/#mongodb-pipeline-pipe.-count) 聚合阶段或 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)（带有 [`$sum`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sum/#mongodb-group-grp.-sum) 表达式）聚合阶段。

MongoDB 驱动程序提供集合级 API `countDocuments(filter, options)` 作为辅助方法，该方法使用 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 和 [`$sum`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sum/#mongodb-group-grp.-sum) 表达式来执行计数。

[`mongosh`](https://www.mongodb.com/zh-cn/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 提供 [`db.collection.countDocuments()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.countDocuments/#mongodb-method-db.collection.countDocuments) 辅助方法，该方法使用 [`$group`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group) 和 [`$sum`](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/aggregation/sum/#mongodb-group-grp.-sum) 表达式进行计数。

### 去重操作

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

### 信息操作

事务中允许使用诸如 [`hello`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/hello/#mongodb-dbcommand-dbcmd.hello)、[`buildInfo`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/buildInfo/#mongodb-dbcommand-dbcmd.buildInfo)、[`connectionStatus`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/connectionStatus/#mongodb-dbcommand-dbcmd.connectionStatus)（及其辅助方法）之类的信息命令，但它们不能是事务中的第一项操作。

### 事务操作限制

事务中不允许执行以下操作：

- 在跨分片写事务中创建新集合。例如，如果在一个分片中写入一个现有集合，并在另一个分片中隐式创建一个集合，那么 MongoDB 将无法在同一事务中执行这两项操作。
- 使用 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/core/transactions-operations/#std-label-transactions-operations-ddl-explicit) 以外的读关注级别时，[显式创建集合](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)（例如 [`db.createCollection()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.createIndexes/#mongodb-method-db.collection.createIndexes) 方法）和索引（例如 [`db.collection.createIndexes()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 和 [`db.collection.createIndex()`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-) 方法）。
- [`listCollections`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections) 和 [`listIndexes`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes) 命令及其辅助方法。
- 其他非 CRUD 和非信息性操作（例如 [`createUser`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/createUser/#mongodb-dbcommand-dbcmd.createUser)、[`getParameter`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/getParameter/#mongodb-dbcommand-dbcmd.getParameter) 和 [`count`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/count/#mongodb-dbcommand-dbcmd.count)）及其辅助程序。
- 并行操作。要同时更新多个命名空间，请考虑改用 [`bulkWrite`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/bulkWrite/#mongodb-dbcommand-dbcmd.bulkWrite) 命令。

## 事务和会话

- 事务与会话关联。
- 一个会话一次最多可以具有一个未结事务。
- 使用驱动程序时，事务中的每项操作都必须与会话关联。有关详细信息，请参阅驱动程序特定文档。
- 如果会话结束并且具有打开的事务，则事务将中止。

## 读关注/写关注/读取偏好

### 事务和读取偏好

事务中的操作使用事务级 [读取偏好](https://www.mongodb.com/zh-cn/docs/manual/core/read-preference/#std-label-replica-set-read-preference)。

使用驱动程序，可以在事务启动时设置事务级 [读取偏好](https://www.mongodb.com/zh-cn/docs/manual/core/read-preference/#std-label-replica-set-read-preference)：

- 如果未设置事务级别的读取偏好，则事务将使用会话级别的读取偏好。
- 如果未设置事务级别和会话级别的读取偏好，则事务将使用客户端级别的读取偏好。默认情况下，客户端级别的读取偏好为 [`primary`](https://www.mongodb.com/zh-cn/docs/manual/core/read-preference/#mongodb-readmode-primary)。

包含读取操作的 [分布式事务](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/#std-label-transactions) 必须使用读取偏好 [`primary`](https://www.mongodb.com/zh-cn/docs/manual/core/read-preference/#mongodb-readmode-primary)。给定事务中的所有操作必须路由到同一节点。

### 事务和读关注

事务中的操作使用事务级 [读关注](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern/)。也就是说，在集合和数据库级别设置的任何读关注在事务中都会被忽略。

可以在事务启动时设置事务级别的 [读关注](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern/)。

- 如果未设置事务级别的读关注，则事务级别的读关注默认为会话级别的读关注。
- 如果未设置事务级读关注和会话级读关注，则事务级读关注默认为客户端级读关注。默认情况下，对于主节点上的读取，客户端级读关注是 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)。另请参阅：
  - [事务和读取偏好](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/#std-label-transactions-read-preference)
  - [默认 MongoDB 读关注/写关注](https://www.mongodb.com/zh-cn/docs/manual/reference/mongodb-defaults/)

事务支持以下读关注级别：

#### `"local"`

- 读关注 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-) 返回节点中可用的最新数据，但可以回滚。
- 在副本集上，即使 ACID 事务使用读关注（read concern）`local` ，也可能会观察到更强的读隔离性性，因为该操作会从 ACID 事务打开点的快照中读取。
- 对于分片集群上的事务，读关注 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-) 无法保证数据来自跨分片的同一快照视图。如果需要快照隔离，请使用读关注 [`"snapshot"`](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/#std-label-transactions-read-concern-snapshot)。
- 可以在事务中 [创建集合和索引](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/#std-label-transactions-create-collections-indexes)。如要 [显式](https://www.mongodb.com/zh-cn/docs/manual/core/transactions-operations/#std-label-transactions-operations-ddl-explicit) 创建集合或索引，则事务必须使用读关注 [`"local"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)。如果 [隐式](https://www.mongodb.com/zh-cn/docs/manual/core/transactions-operations/#std-label-transactions-operations-ddl-implicit) 创建集合，则可以使用任何可用于事务的读关注。

#### `"majority"`

- 如果事务以 [写关注“majority”](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/#std-label-transactions-write-concern) 提交，则读关注 [`"majority"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-) 返回已被多数副本集节点确认且无法回滚的数据。否则，读关注 [`"majority"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-) 不保证读取操作读取多数提交的数据。
- 对于分片集群上的事务，读关注 [`"majority"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-) 无法保证数据来自跨分片的同一快照视图。如果需要快照隔离，请使用读关注 [`"snapshot"`。](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/#std-label-transactions-read-concern-snapshot)

#### `"snapshot"`

- **如果**事务使用 [写关注“majority”](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/#std-label-transactions-write-concern) 提交，则读关注 [`"snapshot"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-) 会从多数已提交数据的快照中返回数据。
- 如果事务不使用 [写关注“majority”](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/#std-label-transactions-write-concern) 提交，则 [`"snapshot"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-) 读关注**不**保证读操作会使用大多数已提交数据的快照。
- 对于分片集群上的事务，数据的 [`"snapshot"`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-) 视图**会**在各分片之间同步。

### 事务和写关注

事务使用事务级 [写关注](https://www.mongodb.com/zh-cn/docs/manual/reference/write-concern/) 来提交写入操作。事务内的写入操作必须在没有明确写关注规范的情况下执行，并须使用默认的写关注。在提交时，使用事务级写关注来提交写入。

可以在事务启动时设置事务级[写关注](https://www.mongodb.com/zh-cn/docs/manual/reference/write-concern/)。

- 如果未设置事务级别的写关注，则事务级别的写关注默认为提交的会话级别写关注。
- 如果未设置事务级别的写关注和会话级别的的写关注，则事务级别的写关注默认为 的客户端级别的写关注，
  - [`w: "majority"`](https://www.mongodb.com/zh-cn/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-) - 将提交应用于大多数投票节点后，写关注 [`w: "majority"`](https://www.mongodb.com/zh-cn/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-) 会返回确认消息。
  - [`w: 1`](https://www.mongodb.com/zh-cn/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-) - [`w: 1`](https://www.mongodb.com/zh-cn/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-) 会在提交应用于主节点后返回确认信息。

## 参考资料

- [MongoDB 官方文档之事务](https://www.mongodb.com/zh-cn/docs/manual/core/transactions/)