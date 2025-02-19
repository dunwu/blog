---
icon: logos:mongodb
title: MongoDB 事务
date: 2020-09-20 23:12:17
categories:
  - 数据库
  - 文档数据库
  - MongoDB
tags:
  - 数据库
  - 文档数据库
  - MongoDB
  - 事务
permalink: /pages/69582aae/
---

# MongoDB 事务

在 MongoDB 中，**对单个文档的操作是原子的**。由于可以使用嵌入式文档和数组来捕获单个文档结构中数据之间的关系，而不是跨多个文档和集合进行规范化，因此这种单文档原子性在许多实际用例中消除了对分布式事务的需求。

对于需要对多个文档（在单个或多个集合中）进行读取和写入原子性的情况，MongoDB 支持分布式事务。借助分布式事务，可以跨多个操作、集合、数据库、文档和分片使用事务。

【示例】使用 MongoDB Java Driver 进行事务操作

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

【示例】在集群中使用 writeConcern 参数

```javascript
db.transaction.insert({ count: 1 }, { writeConcern: { w: 'majoriy' } })
db.transaction.insert({ count: 1 }, { writeConcern: { w: '4' } })
db.transaction.insert({ count: 1 }, { writeConcern: { w: 'all' } })
```

【示例】配置延迟节点，模拟网络延迟

```
conf=rs.conf()
conf.memebers[2].slaveDelay=5
conf.memebers[2].priority=0
rs.reconfig(conf)
```

MongoDB 事务中不允许以下操作：

**在跨分片写入事务中创建新集合**。例如，如果写入一个分片中的现有集合，并在另一个分片中隐式创建集合，则 MongoDB 无法在同一事务中执行这两个操作。

当使用 [`“local”`](https://www.mongodb.com/zh-cn/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-) 以外的读取关注级别时，[显式创建集合](https://www.mongodb.com/zh-cn/docs/manual/core/transactions-operations/#std-label-transactions-operations-ddl-explicit) - 例如 [`db.createCollection()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection) 方法；例如 [`db.collection.createIndexes()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.createIndexes/#mongodb-method-db.collection.createIndexes) 和 [`db.collection.createIndex()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 方法。

[`listCollections`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections) 和 [`listIndexes`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes) 命令及其帮助程序方法。

其他非 CRUD 和非信息性操作，例如 [`createUser`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/createUser/#mongodb-dbcommand-dbcmd.createUser)、[`getParameter`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/getParameter/#mongodb-dbcommand-dbcmd.getParameter)、[`count`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/count/#mongodb-dbcommand-dbcmd.count) 等方法。
