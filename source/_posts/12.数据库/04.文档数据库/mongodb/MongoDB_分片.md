---
icon: logos:mongodb
title: MongoDB 分片
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202503062347036.avif
date: 2020-09-20 23:12:17
categories:
  - 数据库
  - 文档数据库
  - mongodb
tags:
  - 数据库
  - 文档数据库
  - mongodb
  - 分区
permalink: /pages/ea60b1cc/
---

# MongoDB 分片

::: info 概述

分区通常是这样定义的，即每一条数据（或者每条记录，每行或每个文档）只属于某个特定分区。实际上，每个分区都可以视为一个完整的小型数据库，虽然数据库可能存在一些跨分区的操作。

在不同系统中，分区有着不同的称呼，例如它对应于 MongoDB, Elasticsearch 和 SolrCloud 中的 shard, HBase 的 region, Bigtable 中的 tablet, Cassandra 和 Riak 中的 vnode ，以及 Couch base 中的 vBucket。

数据量如果太大，单台机器进行存储和处理就会成为瓶颈，因此需要引入数据分区机制。分区的目地是通过多台机器均匀分布数据和查询负载，避免出现热点。这需要选择合适的数据分区方案，在节点添加或删除时重新动态平衡分区。

分区通常与复制结合使用，即每个分区在多个节点都存有副本。这意味着某条记录属于特定的分区，而同样的内容会保存在不同的节点上以提高系统的容错性。一个节点上可能存储了多个分区。每个分区都有自己的主副本，例如被分配给某节点，而从副本则分配在其他一些节点。一个节点可能既是某些分区的主副本，同时又是其他分区的从副本。

:::

<!-- more -->

## 分片简介

**可扩展性（Scalability）**指的是分布式系统通过扩展集群机器规模提高系统性能 （吞吐、响应时间、 完成时间）、存储容量、计算能力的特性，是分布式系统的特有性质。

系统扩展可以分为垂直扩展、水平扩展。

- **垂直扩展**，即**提升单机的硬件处理能力**，比如 CPU 处理能力，内存容量，磁盘等方面。但是，单机是有性能瓶颈的，一旦触及瓶颈，再想提升，付出的成本和代价会极高。通俗来说，就三个字：**得加钱**！
- **水平扩展**：采用分而治之的思想，通过集群来分担吞吐量。集群中的应用机器（节点）通常被设计成无状态，用户可以请求任何一个节点，这些节点共同分担访问压力。水平扩展有两个要点：
  - **集群化、分区化**：将一个完整的应用化整为零，如果是无状态应用，可以直接集群化部署；如果是有状态应用，可以将状态数据分区（分片），然后部署到多台机器上。
  - **负载均衡**：集群化、分区化后，要解决的问题是，请求应该被分发（寻址）到哪台机器上。这就需要通过某种策略来控制分发，这种技术就是负载均衡。

MongoDB 支持通过 [分片](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-sharding) 进行**水平扩展**。

MongoDB [分片集群](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-sharded-cluster) 由以下组件构成：

- [shard（分片）](https://docs.mongodb.com/manual/core/sharded-cluster-shards/)：[分片](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard) 包含 [分片集群](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-sharded-cluster) 的分片数据的子集。集群的分片共同保存集群的整个数据集。分片必须作为 [副本集](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-replica-set) 部署，以提供冗余和高可用性。
- [mongos（路由器）](https://docs.mongodb.com/manual/core/sharded-cluster-query-router/)：mongos 充当查询路由器，在客户端应用程序和分片集群之间提供接口。从 MongoDB 4.4 开始，mongos 可以支持 [hedged reads](https://docs.mongodb.com/manual/core/sharded-cluster-query-router/#mongos-hedged-reads) 以最大程度地减少延迟。
- [config servers（配置服务器）](https://docs.mongodb.com/manual/core/sharded-cluster-config-servers/)：提供集群元数据存储和分片数据分布的映射。

下图描述了分片集群内各组件之间的交互：

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920210057.svg)

MongoDB 在 [集合](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-collection) 级别对数据进行分片，从而将集合数据分布到集群中的分片上。

## 分片集群组件

### 分片

分片集群中的每个数据库都有一个主分片。它是数据库中所有未分片集合的默认分片。默认情况下，数据库的所有未分片集合均在数据库主分片上创建。

在创建新数据库时，[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 通过选择集群中数据量最少的分片来选择主分片。[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 使用 [`listDatabases`](https://www.mongodb.com/zh-cn/docs/manual/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases) 命令返回的 `totalSize` 字段作为选择标准的一部分。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920212159.svg)

### 配置服务器

配置服务器用于存储 [分片集群](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-sharded-cluster) 上的元数据。元数据反映了分片集群内所有数据和组件的状态和组织。元数据包括每个分片上的数据段列表以及定义数据段的范围。

[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例缓存此数据，并使用它来将读取和写入操作路由到正确的分片。[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 在集群的元数据发生变化（例如 [添加分片](https://www.mongodb.com/zh-cn/docs/manual/tutorial/add-shards-to-shard-cluster/#std-label-sharding-procedure-add-shard)）时更新缓存。分片还从配置服务器读取数据段元数据。

配置服务器还存储 [“自管理部署上的身份验证”](https://www.mongodb.com/zh-cn/docs/manual/core/authentication/#std-label-authentication) 配置信息，例如 [基于角色的访问控制](https://www.mongodb.com/zh-cn/docs/manual/core/authorization/#std-label-authorization) 或集群的 [内部身份验证](https://www.mongodb.com/zh-cn/docs/manual/core/security-internal-authentication/#std-label-replica-set-security) 设置。

MongoDB 还使用配置服务器来管理分布式锁。

每个分片集群必须拥有自己的配置服务器。请勿对不同的分片集群使用相同的配置服务器。

### 路由节点

MongoDB [`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例将查询和写入操作路由到分片集群中的 [分片](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard)。从应用程序的角度来看，`mongos` 提供了通向分片集群的唯一接口。应用程序永远不会直接与分片连接或通信。

`mongos` 通过缓存来自 [配置服务器](https://www.mongodb.com/zh-cn/docs/manual/core/sharded-cluster-config-servers/#std-label-sharded-cluster-config-server) 的元数据来跟踪哪个分片上有哪些数据。`mongos` 使用该元数据将操作从应用程序和客户端路由到 [`mongod`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。`mongos` 没有*持久*状态，且会使用最少的系统资源。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920212157.svg)

#### 路由和结果进程

[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例通过以下方式将查询路由到 [集群](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-sharded-cluster)：

1. 确定必须接收查询的 [分片](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard) 的列表。
2. 在所有目标分片上建立游标。

然后，`mongos` 会合并来自每个目标分片的数据，并返回结果文档。在 `mongos` 检索结果之前，会对每个分片执行某些查询修饰符，例如 [排序](https://www.mongodb.com/zh-cn/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-sort)。

如果结果不需要在数据库的 [主分片](https://www.mongodb.com/zh-cn/docs/manual/core/aggregation-pipeline/#std-label-aggregation-pipeline) 上运行，则在多个分片上运行的 [聚合操作](https://www.mongodb.com/zh-cn/docs/manual/core/aggregation-pipeline/#std-label-aggregation-pipeline) 可能会将结果路由回 [`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 以合并结果。

在某些情况下，当 [分片键](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard-key) 或分片键的前缀是查询的一部分时，[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 会执行 [定向操作](https://www.mongodb.com/zh-cn/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-targeted)，将查询路由到集群中的分片子集。

`mongos` 对*不* 包含 [分片键](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard-key) 的查询执行 [广播操作](https://www.mongodb.com/zh-cn/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-broadcast)，将查询路由到集群中的*所有* 分片。某些包含分片键的查询仍可能导致广播操作，具体取决于集群中数据的分布和查询的选择性。

#### `mongos` 如何处理查询修饰符

- **排序** - 如果查询结果未进行排序，[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例则会将打开一个结果游标，而该游标由分片上的所有游标“循环”生成。
- **限制** - 如果查询使用 [`limit()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/cursor.limit/#mongodb-method-cursor.limit) 游标方法限制结果集的大小，则 [`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例会将该限制传递给分片，然后在将结果返回给客户端之前将限制重新应用于结果。
- **跳过** - 如果查询使用 [`skip()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/cursor.skip/#mongodb-method-cursor.skip) 游标方法指定要跳过的记录数量，则 [`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) *无法*将此跳过传递给分片，而是从分片中检索未跳过的结果，并在汇编完整结果时跳过相应数量的文档。与 [`limit()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/cursor.limit/#mongodb-method-cursor.limit) 一起使用时，[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 会将*限值*加上 [`skip()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/cursor.skip/#mongodb-method-cursor.skip) 的值传递给分片以提高这些操作的效率。

#### 广播操作

[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例会向集合的所有分片广播查询，**除非** [`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 可以确定哪个分片或分片子集存储此数据。

![MongoDB 分片路由-广播操作](https://raw.githubusercontent.com/dunwu/images/master/snap/202503070820935.svg)

在 [`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 收到所有分片的响应后，它会合并数据并返回结果文档。广播操作性能取决于集群的整体负载，以及网络延迟、单个分片负载和每个分片返回的文档数量等变量。尽可能选择引起 [针对性操作](https://www.mongodb.com/zh-cn/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-targeted) 而非广播操作的操作。

多更新操作始终是广播操作。

[`updateMany()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany) 和 [`deleteMany()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany) 方法为广播操作，除非查询文档完整指定了分片键。

#### 定向操作

[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 可以将包含分片键或 [复合](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-compound-index) 分片键前缀的查询路由到特定分片或分片集。[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 使用分片键值来定位范围包含分片键值的 [数据段](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-chunk)，并将查询指向包含该数据段的 [分片](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard)。

![MongoDB 分片路由-定向操作](https://raw.githubusercontent.com/dunwu/images/master/snap/202503070821719.svg)

例如，如果分片键是：

```json
{ "a": 1, "b": 1, "c": 1 }
```

[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 程序*可以*可以将包含完整分片键或以下任一分片键前缀的查询路由到特定的分片或分片集：

```json
{ a: 1 }
{ a: 1, b: 1 }
```

所有 [`insertOne()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) 操作都以一个分片为目标。[`insertMany()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany) 数组中的每个文档都以单个分片为目标，但不能保证数组中的所有文档都插入到单个分片中。

所有 [`updateOne()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne)、[`replaceOne()` 和](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.replaceOne/#mongodb-method-db.collection.replaceOne) [`deleteOne()`](https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne) 操作都*必须*在查询文档中包含 [分片键](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard-key) 或 `_id`。 如果在没有分片键或`_id`的情况下使用这些方法，MongoDB 将返回错误。

根据集群中数据的分布和查询的选择性，[`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 仍可能执行 [广播业务](https://www.mongodb.com/zh-cn/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-broadcast) 来完成这些查询。

## 分片键

分片键可以是单个索引 [字段](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-field)，也可以是 [复合索引](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-compound-index) 涵盖的多个字段，复合索引决定集合 [文档](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-document) 在集群 [分片](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard) 中的分布。

MongoDB 将分片键值（或哈希分片键值）的取值区间划分为不重叠的分片键值（或哈希分片键值）范围。每个范围都与一个 [数据块](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-chunk) 相关联，MongoDB 会尝试在集群中的各个分片之间均匀分配这些数据块。

## 分片策略

MongoDB 支持两种分片策略：Hash 分片和范围分片。

### 哈希分片

哈希分片使用 [单字段哈希索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-hashed/#std-label-index-hashed-index) 或 [组合哈希索引](https://www.mongodb.com/zh-cn/docs/manual/core/indexes/index-types/index-hashed/create/#std-label-index-type-compound-hashed) 作为分片键，在分片集群中对数据进行分区。

> 注意：使用哈希索引解析查询时，MongoDB 会自动计算哈希值，应用程序不需要计算哈希。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920213343.svg)

虽然分片键的范围可能“相近”，但它们的哈希值却不太可能位于同一 [数据段](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-chunk)。基于哈希值的数据分配可促进更均匀的数据分布，尤其是在分片键 [单调](https://www.mongodb.com/zh-cn/docs/manual/core/sharding-choose-a-shard-key/#std-label-shard-key-monotonic) 变化的数据集中。

然而，哈希分布意味着对分片键进行基于范围的查询时，不太可能以单个分片为目标，从而导致更多的集群范围的 [广播操作](https://www.mongodb.com/zh-cn/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-broadcast)

### 范围分片

范围分片涉及根据分片键值将数据划分为多个范围。然后，根据分片键值为每个 [数据段](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-chunk) 分配一个范围。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920213345.svg)

具有“相近”数值的一系列分片键更有可能位于同一个 [数据段](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-chunk) 上。这允许进行 [有针对性的操作](https://www.mongodb.com/zh-cn/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-targeted)，因为 [`mongos`](https://www.mongodb.com/zh-cn/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 只能将操作路由到包含所需数据的分片。

范围分片的效率取决于所选分片键。考虑不周的分片键可能会导致数据分布不均，从而抵消分片的某些好处甚或导致性能瓶颈。

> 扩展阅读：[范围分片](https://www.mongodb.com/zh-cn/docs/manual/core/ranged-sharding/)

## 分片负载均衡

MongoDB 负载均衡器是一个后台进程，用于监控每个分片集合的每个 [分片](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard) 上的数据量。当给定分片上的分片集合的数据量达到特定 [迁移阈值](https://www.mongodb.com/zh-cn/docs/manual/core/sharding-balancer-administration/#std-label-sharding-migration-thresholds) 时，负载均衡器会尝试在分片之间自动迁移数据，并在遵从 [区域](https://www.mongodb.com/zh-cn/docs/manual/core/zone-sharding/#std-label-zone-sharding) 的前提下实现每个分片的数据量均衡。默认情况下，负载均衡器进程始终处于启用状态。

[分片集群](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-sharded-cluster) 的均衡过程对用户和应用程序层是完全透明的，不过在执行过程中可能会对性能产生一些影响。

![Diagram of a collection distributed across three shards. For this collection, the difference in the number of chunks between the shards reaches the *migration thresholds* (in this case, 2) and triggers migration.](https://www.mongodb.com/zh-cn/docs/manual/images/sharding-migrating.bakedsvg.svg)

负载均衡器在配置服务器副本集 (CSRS) 的主节点上运行。

## 分片集群中的区域

区域可帮助改善跨多个数据中心的分片集群的数据局部性。

在分片集群中，可以根据 [分片键](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-zone) 创建分片数据 [区域](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard-key)。可以将每个区域与集群中的一个或多个分片相关联。一个分片可以与任意数量的区域关联。在均衡的集群中，MongoDB 仅将区域覆盖的 [数据段](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-chunk) 迁移到与该区域相关联的分片。

每个区域涵盖 [分片键](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard-key) 值的一个或多个范围。某一区域所覆盖的每个范围始终包括其下边界，而不包括其上边界。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200920214854.svg)

为要覆盖的区域定义范围时，必须使用 [分片键](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-shard-key) 中包含的字段。如果使用的是 [复合](https://www.mongodb.com/zh-cn/docs/manual/reference/glossary/#std-term-compound-index) 分片键，此范围则须包含分片键的前缀。在选择分片键时，应考虑将来可能使用区域的情况。

扩展阅读：[区域中的分片键](https://www.mongodb.com/zh-cn/docs/manual/core/zone-sharding/#std-label-zone-sharding-shard-key)

## 参考资料

- [MongoDB 官方文档之分片](https://www.mongodb.com/zh-cn/docs/manual/sharding/)