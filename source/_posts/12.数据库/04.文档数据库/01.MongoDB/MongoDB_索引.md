---
icon: logos:mongodb
title: MongoDB 索引
date: 2020-09-21 21:22:57
categories:
  - 数据库
  - 文档数据库
  - MongoDB
tags:
  - 数据库
  - 文档数据库
  - MongoDB
  - 索引
permalink: /pages/567ecac8/
---

# MongoDB 索引

## MongoDB 索引简介

### 索引的作用

**MongoDB 在 collection 数据级别上定义索引**。

索引通常能够极大的提高查询的效率。如果**没有索引**，MongoDB 在读取数据时**必须扫描 collection 中的每个 document** 并选取那些符合查询条件的记录。

这种扫描全集合的查询是非常低效的，特别是在处理大量的数据时。查询可能要花费几十秒甚至几分钟，这种性能开销是不可接受的。

索引是特殊的数据结构，索引存储在一个易于遍历读取的数据集合中，索引是对数据库表中一列或多列的值进行排序的一种结构。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200921210621.svg)

### createIndex() 方法

**MongoDB 使用 `createIndex()` 方法来创建索引**。

`createIndex()` 语法如下：

```javascript
db.collection.createIndex( <key and index type specification>, <options> )
```

`createIndex()` 可选参数列表如下：

| Parameter          | Type          | Description                                                                                                                                      |
| :----------------- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| background         | Boolean       | 建索引过程会阻塞其它数据库操作，background 可指定以后台方式创建索引，即增加 "background" 可选参数。 "background" 默认值为**false**。             |
| unique             | Boolean       | 建立的索引是否唯一。指定为 true 创建唯一索引。默认值为**false**.                                                                                 |
| name               | string        | 索引的名称。如果未指定，MongoDB 的通过连接索引的字段名和排序顺序生成一个索引名称。                                                               |
| dropDups           | Boolean       | **3.0+版本已废弃。**在建立唯一索引时是否删除重复记录,指定 true 创建唯一索引。默认值为 **false**.                                                 |
| sparse             | Boolean       | 对文档中不存在的字段数据不启用索引；这个参数需要特别注意，如果设置为 true 的话，在索引字段中不会查询出不包含对应字段的文档.。默认值为 **false**. |
| expireAfterSeconds | integer       | 指定一个以秒为单位的数值，完成 TTL 设定，设定集合的生存时间。                                                                                    |
| v                  | index version | 索引的版本号。默认的索引版本取决于 mongod 创建索引时运行的版本。                                                                                 |
| weights            | document      | 索引权重值，数值在 1 到 99,999 之间，表示该索引相对于其他索引字段的得分权重。                                                                    |
| default_language   | string        | 对于文本索引，该参数决定了停用词及词干和词器的规则的列表。 默认为英语                                                                            |
| language_override  | string        | 对于文本索引，该参数指定了包含在文档中的字段名，语言覆盖默认的 language，默认值为 language.                                                      |

【示例】使用 name 作为索引，并且按照降序排序

```
db.collection.createIndex( { name: -1 } )
```

## 参考资料

- **官方**
  - [MongoDB 官网](https://www.mongodb.com/)
  - [MongoDB Github](https://github.com/mongodb/mongo)
  - [MongoDB 官方免费教程](https://university.mongodb.com/)
- **教程**
  - [MongoDB 教程](https://www.runoob.com/mongodb/mongodb-tutorial.html)
  - [MongoDB 高手课](https://time.geekbang.org/course/intro/100040001)
