---
icon: logos:elasticsearch
title: Elasticsearch CRUD
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202503062319755.webp
date: 2020-06-16 07:10:44
categories:
  - 数据库
  - 搜索引擎数据库
  - elasticsearch
tags:
  - 数据库
  - 搜索引擎数据库
  - elasticsearch
  - crud
permalink: /pages/6fd84297/
---

# Elasticsearch CRUD

::: info 概述

**CRUD** 由英文单词 **C**reate, **R**ead, **U**pdate, **D**elete 的首字母组成，即**增删改查**。

本文通过介绍基本的 Elasticsearch CRUD 方法，向读者呈现如何访问 Elasticsearch 数据。
:::

<!-- more -->

## CRUD 简介

Elasticsearch 的基本 CRUD 方式如下：

- **新建文档** - ES 提供了 [Index API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-index_.html) 来新建文档。
  - `PUT /<index>/_create/<_id>` - 指定 id，如果 id 已存在，会报错
  - `POST /<index>/_doc` - 自动生成 `_id`
- **删除文档** - ES 提供了 [Delete API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-delete.html) 来删除文档。
  - `DELETE /<index>`
- **更新文档** - ES 提供了 [Update API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html) 来更新文档。
  - `POST /<index>/_update/<_id>`
- **查询文档** - ES 提供了 [Get API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-get.html) 来指定 ID 查询文档。
  - `GET <index>/_doc/<_id>`
- **批量写** - ES 提供了 [Bulk API(`_bulk`)](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html) 来执行批量写操作。Bulk API 支持 Index、Create、Update、Delete 四种操作。
- **批量查** - ES 提供了 [Multi Get API(`_mget`)](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-multi-get.html) 来执行批量指定 ID 查询操作。

## 索引管理

:::details 创建索引

创建索引 `users`：

```bash
PUT users
{
  "mappings": {
    "properties": {
      "name": {
        "type": "keyword"
      },
      "age": {
        "type": "integer"
      },
      "message": {
        "type": "text"
      }
    }
  },
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}
```

响应结果：

```json
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "index": "users"
}
```

:::

:::details 删除索引

删除索引 `users`：

```bash
DELETE users
```

响应结果：

```json
{
  "acknowledged": true
}
```

:::

## 新建文档

ES 提供了 [Index API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-index_.html) 来新建文档。ES 提供了两种创建文档的方式：

- `PUT /<index>/_create/<_id>` - 指定 id，如果 `_id` 已存在，会报错
- `POST /<index>/_doc` - 自动生成 `_id`

:::details 不指定 ID 新建文档

ES 会自动为新建的文档分片一个 UID。

```bash
POST /users/_doc
{
    "user" : "dunwu",
    "age" : 20,
    "message" : "learning Elasticsearch"
}
```

响应结果：

```json
{
  "_index": "users",
  "_type": "_doc",
  "_id": "_JVCi5MBf44xQviy3tpW",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 1,
  "_primary_term": 1
}
```

:::

:::details 指定 ID 新建文档

```bash
PUT users/_create/2
{
    "user" : "jason",
    "age" : 20,
    "message" : "learning Redis"
}
```

响应结果：

```json
{
  "_index": "users",
  "_type": "_doc",
  "_id": "2",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 1,
  "_primary_term": 1
}
```

指定 ID 如果已经存在，返回报错。可以再执行一遍上面的指令，会得到类似下面的错误响应：

```json
{
  "error": {
    "root_cause": [
      {
        "type": "version_conflict_engine_exception",
        "reason": "[2]: version conflict, document already exists (current version [1])",
        "index_uuid": "bkNSOG6RTEet3Q65ynCuBA",
        "shard": "0",
        "index": "users"
      }
    ],
    "type": "version_conflict_engine_exception",
    "reason": "[2]: version conflict, document already exists (current version [1])",
    "index_uuid": "bkNSOG6RTEet3Q65ynCuBA",
    "shard": "0",
    "index": "users"
  },
  "status": 409
}
```

:::

## 删除文档

ES 提供了 [Delete API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-delete.html) 来删除文档。

:::details 指定 ID 删除文档

```bash
DELETE users/_doc/2
```

响应结果：

```json
{
  "_index": "users",
  "_type": "_doc",
  "_id": "2",
  "_version": 2,
  "result": "deleted",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 4,
  "_primary_term": 1
}
```

:::

## 更新文档

ES 提供了 [Update API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html) 来更新文档。

:::details 指定 ID 查询

```bash
POST users/_update/_JVCi5MBf44xQviy3tpW
{
  "doc": {
    "message": "learning HBase"
  }
}
```

响应结果：

```json
{
  "_index": "users",
  "_type": "_doc",
  "_id": "_JVCi5MBf44xQviy3tpW",
  "_version": 2,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 2,
  "_primary_term": 1
}
```

:::

## 查询文档

ES 提供了 [Get API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-get.html) 来指定 ID 查询文档。

:::details 指定 ID 查询

```bash
GET users/_doc/_JVCi5MBf44xQviy3tpW
```

响应结果：

```json
{
  "_index": "users",
  "_type": "_doc",
  "_id": "_JVCi5MBf44xQviy3tpW",
  "_version": 2,
  "_seq_no": 2,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "user": "dunwu",
    "age": 20,
    "message": "learning HBase"
  }
}
```

:::

## 批量写

ES 提供了 [Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html) 来执行批量写操作。批量操作将多条操作合并为一次请求，大大提高了执行效率。Bulk API 支持 Index、Create、Update、Delete 四种操作。

:::details 批量操作

执行第 1 次：

```bash
POST _bulk
{ "index" : { "_index" : "test", "_id" : "1" } }
{ "field1" : "value1" }
{ "delete" : { "_index" : "test", "_id" : "2" } }
{ "create" : { "_index" : "test", "_id" : "3" } }
{ "field1" : "value3" }
{ "update" : {"_id" : "1", "_index" : "test"} }
{ "doc" : {"field2" : "value2"} }
```

响应结果：

```json
{
  "took": 5436,
  "errors": false,
  "items": [
    // 略
  ]
}
```

执行第 2 次：

```bash
POST _bulk
{ "index" : { "_index" : "test", "_id" : "1" } }
{ "field1" : "value1" }
{ "delete" : { "_index" : "test", "_id" : "2" } }
{ "create" : { "_index" : "test", "_id" : "3" } }
{ "field1" : "value3" }
{ "update" : {"_id" : "1", "_index" : "test"} }
{ "doc" : {"field2" : "value2"} }
```

响应结果：

```json
{
  "took": 1870,
  "errors": true,
  "items": [
    // 略
  ]
}
```

:::

## 批量查

ES 提供了 [Multi Get API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-multi-get.html) 来执行批量指定 ID 查询操作。

:::details 批量查询

```bash
GET /_mget
{
  "docs": [
    {
      "_index": "users",
      "_id": "_JVCi5MBf44xQviy3tpW"
    },
    {
      "_index": "users",
      "_id": "2"
    }
  ]
}
```

响应结果：

```json
{
  "docs": [
    {
      "_index": "users",
      "_type": "_doc",
      "_id": "_JVCi5MBf44xQviy3tpW",
      "_version": 2,
      "_seq_no": 2,
      "_primary_term": 1,
      "found": true,
      "_source": {
        "user": "dunwu",
        "age": 20,
        "message": "learning HBase"
      }
    },
    {
      "_index": "users",
      "_type": "_doc",
      "_id": "2",
      "_version": 1,
      "_seq_no": 3,
      "_primary_term": 1,
      "found": true,
      "_source": {
        "user": "jason",
        "age": 20,
        "message": "learning Redis"
      }
    }
  ]
}
```

:::

## 参考资料

- [Elasticsearch 官方文档之快速入门](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html)
- [Elasticsearch 从入门到实践之文档的基础操作](https://www.itshujia.com/read/elasticsearch/343.html)