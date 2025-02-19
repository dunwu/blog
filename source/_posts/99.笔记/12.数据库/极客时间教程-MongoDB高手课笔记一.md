---
title: 《极客时间教程 - MongoDB 高手课》笔记一
date: 2024-10-17 07:19:53
categories:
  - 笔记
  - 数据库
tags:
  - 数据库
  - 文档数据库
  - MongoDB
permalink: /pages/bbbcae56/
---

# 《极客时间教程 - MongoDB 高手课》笔记一

## 第一章：MongoDB 再入门

### MongoDB 简介

什么是 MongoDB？

一个以 JSON 为数据模型的文档数据库。

为什么叫文档数据库？

文档来自于“JSON Document”，并非我们一般理解的 PDF，WORD 文档。

谁开发 MongDB？

上市公司 MongoDB Inc. ，总部位于美国纽约。

主要用途

- 应用数据库，类似于 Oracle, MySQL
- 海量数据处理，数据平台。

主要特点

- 建模为可选

- JSON 数据模型比较适合开发者

- 横向扩展可以支撑很大数据量和并发

MongoDB 是免费的吗？

MongoDB 有两个发布版本：社区版和企业版。

- 社区版是基于 SSPL，一种和 AGPL 基本类似的开源协议 。
- 企业版是基于商业协议，需付费使用。

### MongoDB vs. RDBMS

|              | MongoDB                                                      | RDBMS                  |
| ------------ | ------------------------------------------------------------ | ---------------------- |
| 数据模型     | 文档模型                                                     | 关系模型               |
| 数据库类型   | OLTP                                                         | OLTP                   |
| CRUD 操作    | MQL/SQL                                                      | SQL                    |
| 高可用       | 复制集                                                       | 集群模式               |
| 横向扩展能力 | 通过原生分片完善支持                                         | 数据分区或者应用侵入式 |
| 索引支持     | B-树、全文索引、地理位置索引、多键 (multikey) 索引、TTL 索引 | B 树                   |
| 开发难度     | 容易                                                         | 困难                   |
| 数据容量     | 没有理论上限                                                 | 千万、亿               |
| 扩展方式     | 垂直扩展+水平扩展                                            | 垂直扩展               |

### MongoDB 特色及优势

文档模型的面向对象特点

灵活：快速响应业务变化

- 多形性：同一个集合中可以包含 不同字段（类型）的文档对象
- 动态性：线上修改数据模式，修 改是应用与数据库均无须下线
- 数据治理：支持使用 JSON Schema 来规范数据模式。在保证模式灵活动态的前提下，提供数据治理能力文档模型的快速开发特点

快速：最简单快速的开发方式

- 数据库引擎只需要在一个存储区读写
- 反范式、无关联的组织极大优化查询速度
- 程序 API 自然，开发快速

MongoDB 优势

- 原生的高可用和横向扩展能力
  - Replica Set – 2 to 50 个成员
  - 自恢复
  - 多中心容灾能力
  - 滚动服务 – 最小化服务终端
- 横向扩展能力
  - 需要的时候无缝扩展
  - 应用全透明
  - 多种数据分布策略
  - 轻松支持 TB – PB 数量级

MongoDB 技术优势总结

- JSON 结构和对象模型接近，开发代码量低
- JSON 的动态模型意味着更容易响应新的业务需求
- 复制集提供 99.999% 高可用
- 分片架构支持海量数据和无缝扩容

### MongoDB 基本操作

#### 使用 insert 完成插入操作

操作格式：

```json
db.<集合>.insertOne(<JSON 对象>)
db.<集合>.insertMany([<JSON 1>, <JSON 2>, …<JSON n>])
```

示例：

```json
db.fruit.insertOne({name: "apple"})
db.fruit.insertMany([
    {name: "apple"},
    {name: "pear"},
    {name: "orange"}
])
```

#### 使用 find 查询文档

find 是 MongoDB 中查询数据的基本指令，相当于 SQL 中的 SELECT 。

find 返回的是游标。

示例：

```json
db.movies.find( { "year" : 1975 } ) //单条件查询

db.movies.find( { "year" : 1989, "title" : "Batman" } ) //多条件 and 查询

db.movies.find( { $and : [ {"title" : "Batman"}, { "category" : "action" }] } ) // and 的另一种形式

db.movies.find( { $or: [{"year" : 1989}, {"title" : "Batman"}] } ) //多条件 or 查询

db.movies.find( { "title" : /^B/} ) //按正则表达式查找
```

##### 查询条件对照表

| SQL      | MQL              |
| -------- | ---------------- |
| `a = 1`  | `{a: 1}`         |
| `a <> 1` | `{a: {$ne: 1}}`  |
| `a > 1`  | `{a: {$gt: 1}}`  |
| `a >= 1` | `{a: {$gte: 1}}` |
| `a < 1`  | `{a: {$lt: 1}}`  |
| `a <= 1` | `{a: {$lte: 1}}` |

##### 查询逻辑对照表

| SQL               | MQL                                          |
| ----------------- | -------------------------------------------- |
| `a = 1 AND b = 1` | `{a: 1, b: 1}` 或 `{$and: [{a: 1}, {b: 1}]}` |
| `a = 1 OR b = 1`  | `{$or: [{a: 1}, {b: 1}]}`                    |
| `a IS NULL`       | `{a: {$exists: false}}`                      |
| `a IN (1, 2, 3)`  | `{a: {$in: [1, 2, 3]}}`                      |

##### 查询逻辑运算符

- `$lt` - 存在并小于
- `$lte` - 存在并小于等于
- `$gt` - 存在并大于
- `$gte` - 存在并大于等于
- `$ne` - 不存在或存在但不等于
- `$in` - 存在并在指定数组中
- `$nin` - 不存在或不在指定数组中
- `$or` - 匹配两个或多个条件中的一个
- `$and` - 匹配全部条件

#### 使用 find 搜索子文档

find 支持使用“field.sub_field”的形式查询子文档。假设有一个文档：

```json
db.fruit.insertOne({
    name: "apple",
    from: {
        country: "China",
        province: "Guangdon"
    }
})
```

```json
db.fruit.find( { "from.country" : "China" } )
db.fruit.find( { "from" : {country: "China"} } )
```

#### 使用 find 搜索数组

find 支持对数组中的元素进行搜索。

```json
db.fruit.insert([
    { "name" : "Apple", color: ["red", "green" ] },
    { "name" : "Mango", color: ["yellow", "green"] }
])

db.fruit.find({color: "red"})
db.fruit.find({$or: [{color: "red"}, {color: "yellow"}]} )
```

#### 使用 find 搜索数组中的对象

```json
db.movies.insertOne( {
    "title" : "Raiders of the Lost Ark",
    "filming_locations" : [
        { "city" : "Los Angeles", "state" : "CA", "country" : "USA" },
        { "city" : "Rome", "state" : "Lazio", "country" : "Italy" },
        { "city" : "Florence", "state" : "SC", "country" : "USA" }
    ]
})
// 查找城市是 Rome 的记录
db.movies.find({"filming_locations.city": "Rome"})
```

在数组中搜索子对象的多个字段时，如果使用 $elemMatch，它表示必须是同一个 子对象满足多个条件。考虑以下两个查询：

```json
db.getCollection('movies').find({
    "filming_locations.city": "Rome",
    "filming_locations.country": "USA"
})

db.getCollection('movies').find({
    "filming_locations": {
    	$elemMatch:{"city":"Rome", "country": "USA"}
    }
})
```

#### 控制 find 返回的字段

- find 可以指定只返回指定的字段；
- `_id`字段必须明确指明不返回，否则默认返回；
- 在 MongoDB 中我们称这为投影（projection）；
- `db.movies.find({"category": "action"},{"_id":0, title:1})`

#### 使用 remove 删除文档

remove 命令需要配合查询条件使用；

匹配查询条件的的文档会被删除；

指定一个空文档条件会删除所有文档；

示例：

```json
db.testcol.remove( { a : 1 } ) // 删除 a 等于 1 的记录
db.testcol.remove( { a : { $lt : 5 } } ) // 删除 a 小于 5 的记录
db.testcol.remove( { } ) // 删除所有记录
db.testcol.remove() //报错
```

#### 使用 update 更新文档

Update 操作执行格式：`db.<集合>.update(<查询条件>, <更新字段>)`

示例：

```json
db.fruit.insertMany([
    {name: "apple"},
    {name: "pear"},
    {name: "orange"}
])

db.fruit.updateOne({name: "apple"}, {$set: {from: "China"}})
```

使用 updateOne 表示无论条件匹配多少条记录，始终只更新第一条；

使用 updateMany 表示条件匹配多少条就更新多少条；

updateOne/updateMany 方法要求更新条件部分必须具有以下之一，否则将报错：

- `$set/$unset`

- `$push/$pushAll/$pop`

- `$pull/$pullAll`

- `$addToSet`

#### 使用 update 更新数组

- `$push`: 增加一个对象到数组底部
- `$pushAll`: 增加多个对象到数组底部
- `$pop`: 从数组底部删除一个对象
- `$pull`: 如果匹配指定的值，从数组中删除相应的对象
- `$pullAll`: 如果匹配任意的值，从数据中删除相应的对象
- `$addToSet`: 如果不存在则增加一个值到数组

#### 使用 drop 删除集合

使用 db.<集合>.drop() 来删除一个集合

集合中的全部文档都会被删除

集合相关的索引也会被删除

```json
db.collection.drop()
```

#### 使用 dropDatabase 删除数据库

使用 db.dropDatabase() 来删除数据库

数据库相应文件也会被删除，磁盘空间将被释放

```json
use tempDB
db.dropDatabase()
show collections // No collections
show dbs // The db is gone
```

### 聚合查詢

#### 什么是 MongoDB 聚合框架

MongoDB 聚合框架（Aggregation Framework）是一个计算框架，它可以：

- 作用在一个或几个集合上；

- 对集合中的数据进行的一系列运算；

- 将这些数据转化为期望的形式；

从效果而言，聚合框架相当于 SQL 查询中的：

- GROUP BY

- LEFT OUTER JOIN

- AS 等

#### 管道（Pipeline）和步骤（Stage）

整个聚合运算过程称为管道（Pipeline），它是由多个步骤（Stage）组成的， 每个管道：

- 接受一系列文档（原始数据）；
- 每个步骤对这些文档进行一系列运算；
- 结果文档输出给下一个步骤；

聚合计算的基本格式：

```
pipeline = [$stage1, $stage2, ...$stageN];

db.<COLLECTION>.aggregate(
    pipeline,
    { options }
);
```

常见步骤：

| 步骤                 | 作用     | SQL 等价运算符    |
| -------------------- | -------- | ----------------- |
| `$match`             | 过滤     | `WHERE`           |
| `$project`           | 投影     | `AS`              |
| `$sort`              | 排序     | `ORDER BY`        |
| `$group`             | 分组     | `GROUP BY`        |
| `$skip` / `$limit`   | 结果限制 | `SKIP` / `LIMIT`  |
| `$lookup`            | 左外连接 | `LEFT OUTER JOIN` |
| `$unwind`            | 展开数组 | N/A               |
| `$graphLookup`       | 图搜索   | N/A               |
| `$facet` / `$bucket` | 分面搜索 | N/A               |

常见步骤中的运算符

| `$match`                                                                                    | `$project`                                                                                                                                                                                   | `$group`                                                                        |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `$eq`/`$gt`/`$gte`/`$lt`/`$lte`<br/>`$and`/`$or`/`$not`/`$in`<br/>`$geoWithin`/`$intersect` | 选择需要的或排除不需要的字段<br/>`$map`/`$reduce`/`$filter`<br/>`$range`<br/>`$multiply`/`$divide`/`$substract`/`$add`<br/>`$year`/`$month`/`$dayOfMonth`/`$hour`/`$minute`/`$second`<br/>…… | `$sum`/`$avg`<br/>`$push`/`$addToSet`<br/>`$first`/`$last`/`$max`/`$min`<br/>…… |

#### 聚合运算的使用场景

聚合查询可以用于 OLAP 和 OLTP 场景。例如：

- OTLP - 计算
- OLAP
  - 分析一段时间内的销售总额、均值
  - 计算一段时间内的净利润
  - 分析购买人的年龄分布
  - 分析学生成绩分布
  - 统计员工绩效

MQL 常用步骤与 SQL 对比

【示例一】

```sql
SELECT
FIRST_NAME AS `名`,
LAST_NAME AS `姓`
FROM Users
WHERE GENDER = '男'
SKIP 100
LIMIT 20
```

等价于

```json
db.users.aggregate([
    {$match: {gender: ’’男”}},
    {$skip: 100},
    {$limit: 20},
    {$project: {
        '名': '$first_name',
        '姓': '$last_name'
    }}
]);
```

【示例二】

```sql
SELECT DEPARTMENT,
COUNT(NULL) AS EMP_QTY
FROM Users
WHERE GENDER = '女'
GROUP BY DEPARTMENT HAVING
COUNT(*) < 10
```

等价于

```json
db.users.aggregate([
    {$match: {gender: '女'}},
    {$group: {
        _id: '$DEPARTMENT’,
        emp_qty: {$sum: 1}
    }},
    {$match: {emp_qty: {$lt: 10}}}
]);
```

【示例三】

```json
> db.students.findOne()
{
    name:'张三',
    score:[
        {subject:'语文',score:84},
        {subject:'数学',score:90},
        {subject:'外语',score:69}
    ]
}

> db.students.aggregate([{$unwind: '$score'}])
{name: '张三', score: {subject: '语文', score: 84}}
{name: '张三', score: {subject: '数学', score: 90}}
{name: '张三', score: {subject: '外语', score: 69}}
```

#### MQL 特有步骤 `$bucket`

```json
db.products.aggregate([{
    $bucket:{
        groupBy: "$price",
        boundaries: [0,10,20,30,40],
        default: "Other",
        output:{"count":{$sum:1}}
    }
}])
```

#### MQL 特有步骤 $facet

```json
db.products.aggregate([{
    $facet:{
        price:{
            $bucket:{…}
        },
        year:{
            $bucket:{…}
        }
    }
}])
```

#### 聚合查询实验

计算到目前为止的所有订单的总销售额

```json
db.orders.aggregate([
	{ $group:
		{
			_id: null,
			total: { $sum: "$total" }
		}
	}
])

// 结果： // { "_id" : null, "total" : NumberDecimal("44019609") }
```

查询 2019 年第一季度（1 月 1 日~3 月 31 日）已完成订单（completed）的订单总金额和订单总数

```json
db.orders.aggregate([

    // 步骤 1：匹配条件
    { $match: { status: "completed", orderDate: {
                                    $gte: ISODate("2019-01-01"),
                                    $lt: ISODate("2019-04-01") } } },

    // 步骤二：聚合订单总金额、总运费、总数量
    { $group: {
                _id: null,
                total: { $sum: "$total" },
                shippingFee: { $sum: "$shippingFee" },
                count: { $sum: 1 } } },
    { $project: {
                // 计算总金额
                grandTotal: { $add: ["$total", "$shippingFee"] },
                count: 1,
                _id: 0 } }
])

// 结果：
// { "count" : 5875, "grandTotal" : NumberDecimal("2636376.00") }
```

### 复制集机制及原理

#### 复制集的作用

MongoDB 复制集的主要意义在于实现服务高可用

它的现实依赖于两个方面的功能：

- 数据写入时将数据迅速复制到另一个独立节点上
- 在接受写入的节点发生故障时自动选举出一个新的替代节点

在实现高可用的同时，复制集实现了其他几个附加作用：

- 数据分发：将数据从一个区域复制到另一个区域，减少另一个区域的读延迟

- 读写分离：不同类型的压力分别在不同的节点上执行

- 异地容灾：在数据中心故障时候快速切换到异地

#### 典型复制集结构

一个典型的复制集由 3 个以上具有投票权的节点组成，包括：

- 一个主节点（PRIMARY）：接受写入操作和选举时投票
- 两个（或多个）从节点（SECONDARY）：复制主节点上的新数据和选举时投票
- 不推荐使用 Arbiter（投票节点）

#### 数据是如何复制的？

当一个修改操作，无论是插入、更新或删除，到达主节点时，它对数据的操作将被 记录下来（经过一些必要的转换），这些记录称为 oplog。

从节点通过在主节点上打开一个 tailable 游标不断获取新进入主节点的 oplog，并 在自己的数据上回放，以此保持跟主节点的数据一致。

#### 通过选举完成故障恢复

- 具有投票权的节点之间两两互相发送心跳；

- 当 5 次心跳未收到时判断为节点失联；

- 如果失联的是主节点，从节点会发起选举，选出新的主节点；

- 如果失联的是从节点则不会产生新的选举；

- 选举基于 RAFT 一致性算法 实现，选举成功的必要条件是大多数投票节点存活；

- 复制集中最多可以有 50 个节点，但具有投票权的节点最多 7 个。

#### 影响选举的因素

整个集群必须有大多数节点（N / 2 + 1）存活；

被选举为主节点的节点必须：

- 能够与多数节点建立连接
- 具有较新的 oplog
- 具有较高的优先级（如果有配置）

#### 常见选项

复制集节点有以下常见的选配项：

- 是否具有投票权（v 参数）：有则参与投票；
- 优先级（priority 参数）：优先级越高的节点越优先成为主节点。优先级为 0 的节点无法成 为主节点；
- 隐藏（hidden 参数）：复制数据，但对应用不可见。隐藏节点可以具有投票仅，但优先 级必须为 0；
- 延迟（slaveDelay 参数）：复制 n 秒之前的数据，保持与主节点的时间差。

#### 复制集注意事项

关于硬件：

- 因为正常的复制集节点都有可能成为主节点，它们的地位是一样的，因此硬件配置上必须一致；
- 为了保证节点不会同时宕机，各节点使用的硬件必须具有独立性。

关于软件：

- 复制集各节点软件版本必须一致，以避免出现不可预知的问题。

增加节点不会增加系统写性能！

### MongoDB 全家桶

| 软件模块                  | 描述                                            |
| ------------------------- | ----------------------------------------------- |
| mongod                    | MongoDB 数据库软件                              |
| mongo                     | MongoDB 命令行工具，管理 MongoDB 数据库         |
| mongos                    | MongoDB 路由进程，分片环境下使用                |
| mongodump / mongorestore  | 命令行数据库备份与恢复工具                      |
| mongoexport / mongoimport | CSV/JSON 导入与导出，主要用于不同系统间数据迁移 |
| Compass                   | MongoDB GUI 管理工具                            |
| Ops Manager（企业版）     | MongoDB 集群管理软件                            |
| BI Connector（企业版）    | SQL 解释器 / BI 套接件                          |
| MongoDB Charts（企业版）  | MongoDB 可视化软件                              |
| Atlas（付费及免费）       | MongoDB 云托管服务，包括永久免费云数据库        |

## 第二章：从熟练到精通的开发之路

### 模型设计基础

#### 数据模型

什么是数据模型？

数据模型是一组由符号、文本组成的集合，用以准确表达信息，达到有效交流、沟通 的目的。

#### 数据模型设计的元素

**实体 Entity**

- 描述业务的主要数据集合

- 谁，什么，何时，何地，为何，如何

**属性 Attribute**

- 描述实体里面的单个信息

**关系 Relationship**

- 描述实体与实体之间的数据规则

- 结构规则：1-N， N-1, N-N

- 引用规则：电话号码不能单独存在

数据模型的三层深度：

- 概念模型，逻辑模型，物理模型
- 一个模型逐步细化的过程

#### MongoDB 文档模型设计的三个误区

1. 不需要模型设计
2. MongoDB 应该用一个超级大文档来组织所有数据
3. MongoDB 不支持关联或者事务

#### 关于 JSON 文档模型设计

文档模型设计处于是物理模型设计阶段 （PDM）

JSON 文档模型通过内嵌数组或引用字段来表示关系

文档模型设计不遵从第三范式，允许冗余。

#### 为什么人们都说 MongoDB 是无模式？

MongoDB 同样需要概念/逻辑建模

文档模型设计的物理层结构可以和逻辑层类似

MongoDB 无模式由来： 可以省略物理建模的具体过程

#### 关系模型 vs 文档模型

|              | 关系数据库                         | JSON 文档模型         |
| ------------ | ---------------------------------- | --------------------- |
| 模型设计层次 | 概念模型<br/>逻辑模型<br/>物理模型 | 概念模型<br/>逻辑模型 |
| 模型实体     | 表                                 | 集合                  |
| 模型属性     | 列                                 | 字段                  |
| 模型关系     | 关联关系，主外键                   | 内嵌数组，引用字段    |

### 文档模型设计之一：基础设计

建立基础文档模型

- 根据概念模型或者业务需求推导出逻辑模型 – 找到对象
- 列出实体之间的关系（及基数） - 明确关系
- 套用逻辑设计原则来决定内嵌方式 – 进行建模
- 完成基础模型构建

基础建模小结

- 90:10 规则： 大部分时候你会使用内嵌来表示 1-1，1-N，N-N
- 内嵌类似于预先聚合（关联）
- 内嵌后对读操作通常有优势（减少关联）

### 文档模型设计之二：工况细化

场景梳理：

- 最频繁的数据查询模式

- 最常用的查询参数

- 最频繁的数据写入模式

- 读写操作的比例

- 数据量的大小

基于内嵌的文档模型

根据业务需求

- 使用引用来避免性能瓶颈
- 使用冗余来优化访问性能

什么时候该使用引用方式？

- 内嵌文档太大，数 MB 或者超过 16MB
- 内嵌文档或数组元素会频繁修改
- 内嵌数组元素会持续增长并且没有封顶

MongoDB 引用设计的限制

- MongoDB 对使用引用的集合之间并无主外键检查
- MongoDB 使用聚合框架的 `$lookup` 来模仿关联查询
- `$lookup` 只支持 left outer join
- `$lookup` 的关联目标（from）不能是分片表

### 文档模型设计之三：模式套用

- 利用文档内嵌数组，将一个时间段的数据聚合到一个文档里。

- 大量减少文档数量

- 大量减少索引占用空间

### 设计模式集锦

大文档，很多字段，很多索引

列转行

模型灵活了，如何管理文档不同版本？

- 增加一个版本号字段
- 快速过滤掉不需要升级的文档
- 升级时候对不同版本的文档做 不同的处理

统计网页点击流量

- 用近似计算

业绩排名，游戏排名，商品统计等精确统计

- 用预聚合字段
- 模型中直接增加统计字段
- 每次更新数据时候同时更新统计值

### 事务开发：写操作事务

writeConcern 决定一个写操作落到多少个节点上才算成功。writeConcern 的取值包括：

- 0：发起写操作，不关心是否成功；

- 1~集群最大数据节点数：写操作需要被复制到指定节点数才算成功；

- majority：写操作需要被复制到大多数节点上才算成功。

发起写操作的程序将阻塞到写操作到达指定的节点数为止。

writeConcern 可以决定写操作到达多少个节点才算成功，journal 则定义如何才算成 功。取值包括：

- true: 写操作落到 journal 文件中才算成功；
- false: 写操作到达内存即算作成功。

### 事务开发：读操作事务之一

在读取数据的过程中我们需要关注以下两个问题：

从哪里读？——由 readPreference 来解决

什么样的数据可以读？ ——由 readConcern 来解决

#### 什么是 readPreference？

readPreference 决定使用哪一个节点来满足 正在发起的读请求。可选值包括：

- primary: 只选择主节点；
- primaryPreferred：优先选择主节点，如 果不可用则选择从节点；
- secondary：只选择从节点；
- secondaryPreferred：优先选择从节点， 如果从节点不可用则选择主节点；
- nearest：选择最近的节点；

#### readPreference 场景举例

用户下订单后马上将用户转到订单详情页——primary/primaryPreferred。因为此时从节点可能还没复制到新订单；

用户查询自己下过的订单——secondary/secondaryPreferred。查询历史订单对时效性通常没有太高要求；

生成报表——secondary。报表对时效性要求不高，但资源需求大，可以在从节点单独处理，避免对线上用户造成影响；

将用户上传的图片分发到全世界，让各地用户能够就近读取——nearest。每个地区的应用选择最近的节点读取数据。

#### readPreference 与 Tag

readPreference 只能控制使用一类节点。Tag 则可以将节点选择控制
到一个或几个节点。考虑以下场景：

- 一个 5 个节点的复制集；

- 3 个节点硬件较好，专用于服务线上客户；

- 2 个节点硬件较差，专用于生成报表；

可以使用 Tag 来达到这样的控制目的：

- 为 3 个较好的节点打上 {purpose: "online"}；

- 为 2 个较差的节点打上 {purpose: "analyse"}；

- 在线应用读取时指定 online，报表读取时指定 reporting。

#### 注意事项

- 指定 readPreference 时也应注意高可用问题。例如将 readPreference 指定 primary，则发生故障转移不存在 primary 期间将没有节点可读。如果业务允许，则应选择 primaryPreferred；

- 使用 Tag 时也会遇到同样的问题，如果只有一个节点拥有一个特定 Tag，则在这个节点失效时将无节点可读。这在有时候是期望的结果，有时候不是。例如：
  - 如果报表使用的节点失效，即使不生成报表，通常也不希望将报表负载转移到其他节点上，此时只有一个节点有报表 Tag 是合理的选择；
  - 如果线上节点失效，通常希望有替代节点，所以应该保持多个节点有同样的 Tag；
- Tag 有时需要与优先级、选举权综合考虑。例如做报表的节点通常不会希望它成为主节点，则优先级应为 0。

### 事务开发：读操作事务之二

#### 什么是 readConcern？

在 readPreference 选择了指定的节点后，readConcern 决定这个节点上的数据哪些 是可读的，类似于关系数据库的隔离级别。可选值包括：

- available：读取所有可用的数据；
- local：读取所有可用且属于当前分片的数据，默认设置；
- majority：读取在大多数节点上提交完成的数据；
- linearizable：可线性化读取文档；增强处理 majority 情况下主节点失联时候的例外情况
- snapshot：读取最近快照中的数据；最高隔离级别，接近于 Seriazable

#### readConcern: local 和 available

在复制集中 local 和 available 是没有区别的。两者的区别主要体现在分片集上。考虑以下场景：

- 一个 chunk x 正在从 shard1 向 shard2 迁移；

- 整个迁移过程中 chunk x 中的部分数据会在 shard1 和 shard2 中同时存在，但源分片 shard1 仍然是 chunk x 的负责方：
  - 所有对 chunk x 的读写操作仍然进入 shard1；
  - config 中记录的信息 chunk x 仍然属于 shard1；
- 此时如果读 shard2，则会体现出 local 和 available 的区别：
  - local：只取应该由 shard2 负责的数据（不包括 x）；
  - available：shard2 上有什么就读什么（包括 x）；

注意事项：

- 虽然看上去总是应该选择 local，但毕竟对结果集进行过滤会造成额外消耗。在一些 无关紧要的场景（例如统计）下，也可以考虑 available；
- `MongoDB <=3.6` 不支持对从节点使用 {readConcern: "local"}；
- 从主节点读取数据时默认 readConcern 是 local，从从节点读取数据时默认 readConcern 是 available（向前兼容原因）。

#### readConcern: majority

只读取大多数据节点上都提交了的数据。考虑如 下场景：

- 集合中原有文档 {x: 0}；
- 将 x 值更新为 1；

如果在各节点上应用 {readConcern: “majority”} 来读取数据：

如何实现？

节点上维护多个 x 版本，MVCC 机制 MongoDB 通过维护多个快照来链接不同的版本：

- 每个被大多数节点确认过的版本都将是一个快照；
- 快照持续到没有人使用为止才被删除；

#### readConcern: majority 与脏读

MongoDB 中的回滚：

- 写操作到达大多数节点之前都是不安全的，一旦主节点崩溃，而从节还没复制到该次操作，刚才的写操作就丢失了；

- 把一次写操作视为一个事务，从事务的角度，可以认为事务被回滚了。

所以从分布式系统的角度来看，事务的提交被提升到了分布式集群的多个节点级别的“提交”，而不再是单个节点上的“提交”。

在可能发生回滚的前提下考虑脏读问题：

- 如果在一次写操作到达大多数节点前读取了这个写操作，然后因为系统故障该操作回滚了，则发生了脏读问题；

使用 {readConcern: “majority”} 可以有效避免脏读

#### readConcern: 如何实现安全的读写分离

考虑如下场景：

向主节点写入一条数据；

立即从从节点读取这条数据。

如何保证自己能够读到刚刚写入的数据？

下述方式有可能读不到刚写入的订单

```json
db.orders.insert({ oid: 101, sku: ”kite", q: 1})
db.orders.find({oid:101}).readPref("secondary")
```

使用 writeConcern + readConcern majority 来解决

```json
db.orders.insert({ oid: 101, sku: "kiteboar", q: 1}, {writeConcern:{w: "majority”}})
db.orders.find({oid:101}).readPref(“secondary”).readConcern("majority")
```

#### readConcern: linearizable

只读取大多数节点确认过的数据。和 majority 最大差别是保证绝对的操作线性顺序 –在写操作自然时间后面的发生的读，一定可以读到之前的写

- 只对读取单个文档时有效；
- 可能导致非常慢的读，因此总是建议配合使用 maxTimeMS；

#### readConcern: snapshot

{readConcern: “snapshot”} 只在多文档事务中生效。将一个事务的 readConcern 设置为 snapshot，将保证在事务中的读：

- 不出现脏读；

- 不出现不可重复读；

- 不出现幻读。

因为所有的读都将使用同一个快照，直到事务提交为止该快照才被释放。

### 事务开发：多文档事务

MongoDB 虽然已经在 4.2 开始全面支持了多文档事务，但并不代表大家应该毫无节制 地使用它。相反，对事务的使用原则应该是：能不用尽量不用。

通过合理地设计文档模型，可以规避绝大部分使用事务的必要性

为什么？事务 = 锁，节点协调，额外开销，性能影响

MongoDB ACID 多文档事务支持

- Atomocity 原子性
  - 单表单文档 ： 1.x 就支持
  - 复制集多表多行：4.0 复制集
  - 分片集群多表多行 4.2
- Consistency 一致性 - writeConcern, readConcern (3.2)
- Isolation 隔离性 - readConcern (3.2)
- Durability 持久性 - Journal and Replication

#### 事务的隔离级别

事务完成前，事务外的操作对该事务所做的修改不可访问

如果事务内使用 {readConcern: “snapshot”}，则可以达到可重复读 Repeatable Read

#### 事务写机制

MongoDB 的事务错误处理机制不同于关系数据库：

- 当一个事务开始后，如果事务要修改的文档在事务外部被修改过，则事务修改这个文档时会触发 Abort 错误，因为此时的修改冲突了；

- 这种情况下，只需要简单地重做事务就可以了；

- 如果一个事务已经开始修改一个文档，在事务以外尝试修改同一个文档，则事务以外的修改会等待事务完成才能继续进行（write-wait.md 实验）。

### Change Stream

Change Stream 是 MongoDB 用于实现变更追踪的解决方案，类似于关系数据库的触 发器，但原理不完全相同：

|          | Change Stream        | 触发器           |
| -------- | -------------------- | ---------------- |
| 触发方式 | 异步                 | 同步（事务保证） |
| 触发位置 | 应用回调事件         | 数据库触发器     |
| 触发次数 | 每个订阅事件的客户端 | 1 次（触发器）   |
| 故障恢复 | 从上次断点重新触发   | 事务回滚         |

#### Change Stream 的实现原理

Change Stream 是基于 oplog 实现的。它在 oplog 上开启一个 tailable cursor 来追踪所有复制集上的变更操作，最终调用应用中定义的回调函数。

被追踪的变更事件主要包括：

- insert/update/delete：插入、更新、删除；

- drop：集合被删除；

- rename：集合被重命名；

- dropDatabase：数据库被删除；

- invalidate：drop/rename/dropDatabase 将导致 invalidate 被触发，并关闭 change stream；

Change Stream 只推送已经在大多数节点上提交的变更操作。即“可重复读”的变更。 这个验证是通过 {readConcern: “majority”} 实现的。因此：

- 未开启 majority readConcern 的集群无法使用 Change Stream；
- 当集群无法满足 {w: “majority”} 时，不会触发 Change Stream（例如 PSA 架构 中的 S 因故障宕机）。

#### Change Stream 使用场景

- 跨集群的变更复制——在源集群中订阅 Change Stream，一旦得到任何变更立即写入目标集群。

- 微服务联动——当一个微服务变更数据库时，其他微服务得到通知并做出相应的变更。

- 其他任何需要系统联动的场景。

#### 注意事项

- Change Stream 依赖于 oplog，因此中断时间不可超过 oplog 回收的最大时间窗；

- 在执行 update 操作时，如果只更新了部分数据，那么 Change Stream 通知的也
  是增量部分；
- 同理，删除数据时通知的仅是删除数据的 `_id`。

## 参考资料

- [MongoDB 高手课](https://time.geekbang.org/course/intro/100040001)