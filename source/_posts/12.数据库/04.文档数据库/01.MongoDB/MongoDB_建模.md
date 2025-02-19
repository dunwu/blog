---
icon: logos:mongodb
title: MongoDB 建模示例
date: 2020-09-12 10:43:53
categories:
  - 数据库
  - 文档数据库
  - MongoDB
tags:
  - 数据库
  - 文档数据库
  - MongoDB
  - 建模
permalink: /pages/20ae84ea/
---

# MongoDB 建模示例

## 关系型模型

### 嵌入式文档一对一关系模型

#### 嵌入式文档一对一关系模型 - 嵌入式文档模式

```json
// patron document
{
   _id: "joe",
   name: "Joe Bookreader"
}

// address document
{
   patron_id: "joe", // reference to patron document
   street: "123 Fake Street",
   city: "Faketon",
   state: "MA",
   zip: "12345"
}
```

合并为：

```json
{
  "_id": "joe",
  "name": "Joe Bookreader",
  "address": {
    "street": "123 Fake Street",
    "city": "Faketon",
    "state": "MA",
    "zip": "12345"
  }
}
```

#### 嵌入式文档一对一关系模型 - 子集模式

假设，有一个用于描述电影信息的 collection 定义：

```json
{
  "_id": 1,
  "title": "The Arrival of a Train",
  "year": 1896,
  "runtime": 1,
  "released": ISODate("01-25-1896"),
  "poster": "http://ia.media-imdb.com/images/M/MV5BMjEyNDk5MDYzOV5BMl5BanBnXkFtZTgwNjIxMTEwMzE@._V1_SX300.jpg",
  "plot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, ...",
  "fullplot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, the line dissolves. The doors of the railway-cars open, and people on the platform help passengers to get off.",
  "lastupdated": ISODate("2015-08-15T10:06:53"),
  "type": "movie",
  "directors": ["Auguste Lumière", "Louis Lumière"],
  "imdb": {
    "rating": 7.3,
    "votes": 5043,
    "id": 12
  },
  "countries": ["France"],
  "genres": ["Documentary", "Short"],
  "tomatoes": {
    "viewer": {
      "rating": 3.7,
      "numReviews": 59
    },
    "lastUpdated": ISODate("2020-01-09T00:02:53")
  }
}
```

在应用中，有的场景只需要显示电影的简单浏览信息，不需要显示类似 fullplot、poster 这样的详细信息。因为，我们可以考虑将原结构一份为二，并通过 id 字段关联起来。

用于展示摘要信息的 movie collection

```json
// movie collection

{
  "_id": 1,
  "title": "The Arrival of a Train",
  "year": 1896,
  "runtime": 1,
  "released": ISODate("1896-01-25"),
  "type": "movie",
  "directors": ["Auguste Lumière", "Louis Lumière"],
  "countries": ["France"],
  "genres": ["Documentary", "Short"]
}
```

用于展示细节信息的 movie_details collection

```json
// movie_details collection

{
  "_id": 156,
  "movie_id": 1, // reference to the movie collection
  "poster": "http://ia.media-imdb.com/images/M/MV5BMjEyNDk5MDYzOV5BMl5BanBnXkFtZTgwNjIxMTEwMzE@._V1_SX300.jpg",
  "plot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, ...",
  "fullplot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, the line dissolves. The doors of the railway-cars open, and people on the platform help passengers to get off.",
  "lastupdated": ISODate("2015-08-15T10:06:53"),
  "imdb": {
    "rating": 7.3,
    "votes": 5043,
    "id": 12
  },
  "tomatoes": {
    "viewer": {
      "rating": 3.7,
      "numReviews": 59
    },
    "lastUpdated": ISODate("2020-01-29T00:02:53")
  }
}
```

### 嵌入式文档一对多关系模型

#### 嵌入式文档一对多关系模型 - 嵌入式文档模式

```json
// patron document
{
   _id: "joe",
   name: "Joe Bookreader"
}

// address documents
{
   patron_id: "joe", // reference to patron document
   street: "123 Fake Street",
   city: "Faketon",
   state: "MA",
   zip: "12345"
}

{
   patron_id: "joe",
   street: "1 Some Other Street",
   city: "Boston",
   state: "MA",
   zip: "12345"
}
```

合并为：

```json
{
  "_id": "joe",
  "name": "Joe Bookreader",
  "addresses": [
    {
      "street": "123 Fake Street",
      "city": "Faketon",
      "state": "MA",
      "zip": "12345"
    },
    {
      "street": "1 Some Other Street",
      "city": "Boston",
      "state": "MA",
      "zip": "12345"
    }
  ]
}
```

#### 嵌入式文档一对多关系模型 - 子集模式

考虑一个电商网站用于表示商品的 collection：

```json
{
  "_id": 1,
  "name": "Super Widget",
  "description": "This is the most useful item in your toolbox.",
  "price": { "value": NumberDecimal("119.99"), "currency": "USD" },
  "reviews": [
    {
      "review_id": 786,
      "review_author": "Kristina",
      "review_text": "This is indeed an amazing widget.",
      "published_date": ISODate("2019-02-18")
    },
    {
      "review_id": 785,
      "review_author": "Trina",
      "review_text": "Nice product. Slow shipping.",
      "published_date": ISODate("2019-02-17")
    },
    ...{
      "review_id": 1,
      "review_author": "Hans",
      "review_text": "Meh, it's okay.",
      "published_date": ISODate("2017-12-06")
    }
  ]
}
```

评论按时间倒序排列。 当用户访问产品页面时，应用程序将加载十条最近的评论。可以将集合分为两个集合，而不是与产品一起存储所有评论：

产品集合存储有关每个产品的信息，包括产品的十个最新评论：

```json
{
  "_id": 1,
  "name": "Super Widget",
  "description": "This is the most useful item in your toolbox.",
  "price": { "value": NumberDecimal("119.99"), "currency": "USD" },
  "reviews": [
    {
      "review_id": 786,
      "review_author": "Kristina",
      "review_text": "This is indeed an amazing widget.",
      "published_date": ISODate("2019-02-18")
    }
    ...
    {
      "review_id": 776,
      "review_author": "Pablo",
      "review_text": "Amazing!",
      "published_date": ISODate("2019-02-16")
    }
  ]
}
```

review collection 存储所有的评论

```json
{
  "review_id": 786,
  "product_id": 1,
  "review_author": "Kristina",
  "review_text": "This is indeed an amazing widget.",
  "published_date": ISODate("2019-02-18")
}
{
  "review_id": 785,
  "product_id": 1,
  "review_author": "Trina",
  "review_text": "Nice product. Slow shipping.",
  "published_date": ISODate("2019-02-17")
}
...
{
  "review_id": 1,
  "product_id": 1,
  "review_author": "Hans",
  "review_text": "Meh, it's okay.",
  "published_date": ISODate("2017-12-06")
}
```

### 引用式文档一对多关系模型

考虑以下映射出版商和书籍关系的示例。

该示例说明了引用式文档的优点，以避免重复发布者信息。

```json
{
   title: "MongoDB: The Definitive Guide",
   author: [ "Kristina Chodorow", "Mike Dirolf" ],
   published_date: ISODate("2010-09-24"),
   pages: 216,
   language: "English",
   publisher: {
              name: "O'Reilly Media",
              founded: 1980,
              location: "CA"
            }
}

{
   title: "50 Tips and Tricks for MongoDB Developer",
   author: "Kristina Chodorow",
   published_date: ISODate("2011-05-06"),
   pages: 68,
   language: "English",
   publisher: {
              name: "O'Reilly Media",
              founded: 1980,
              location: "CA"
            }
}
```

为避免重复出版商数据，可以使用引用型文档，并将出版商信息与书本分开保存。 使用引用时，关系的增长决定了将引用存储在何处。 如果每个出版商的图书数量很少且增长有限，则有时将图书参考存储在出版商文档中可能会很有用。 否则，如果每个发布者的书籍数量不受限制，则此数据模型将导致可变的，不断增长的数组，如以下示例所示：

```json
{
   name: "O'Reilly Media",
   founded: 1980,
   location: "CA",
   books: [123456789, 234567890, ...]
}

{
    _id: 123456789,
    title: "MongoDB: The Definitive Guide",
    author: [ "Kristina Chodorow", "Mike Dirolf" ],
    published_date: ISODate("2010-09-24"),
    pages: 216,
    language: "English"
}

{
   _id: 234567890,
   title: "50 Tips and Tricks for MongoDB Developer",
   author: "Kristina Chodorow",
   published_date: ISODate("2011-05-06"),
   pages: 68,
   language: "English"
}
```

为了避免可变的，增长的数组，请将发行者参考存储在书籍文档中：

```json
{
   _id: "oreilly",
   name: "O'Reilly Media",
   founded: 1980,
   location: "CA"
}

{
   _id: 123456789,
   title: "MongoDB: The Definitive Guide",
   author: [ "Kristina Chodorow", "Mike Dirolf" ],
   published_date: ISODate("2010-09-24"),
   pages: 216,
   language: "English",
   publisher_id: "oreilly"
}

{
   _id: 234567890,
   title: "50 Tips and Tricks for MongoDB Developer",
   author: "Kristina Chodorow",
   published_date: ISODate("2011-05-06"),
   pages: 68,
   language: "English",
   publisher_id: "oreilly"
}
```

## 树形结构模型

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200911194846.svg)

### 具有父节点的树形结构模型

上图结构可以用父引用来表示：

```json
db.categories.insertMany([
  { "_id": "MongoDB", "parent": "Databases" },
  { "_id": "dbm", "parent": "Databases" },
  { "_id": "Databases", "parent": "Programming" },
  { "_id": "Languages", "parent": "Programming" },
  { "_id": "Programming", "parent": "Books" },
  { "_id": "Books", "parent": null }
])
```

- 检索节点的父节点：

  ```
  db.categories.findOne( { _id: "MongoDB" } ).parent
  ```

- 可以在父字段上创建索引以启用父节点的快速搜索：

  ```
  db.categories.createIndex( { parent: 1 } )
  ```

- 可以通过父字段查询找到其直接子节点：

  ```
  db.categories.find( { parent: "Databases" } )
  ```

- 检索子树，可以参考： [`$graphLookup`](https://docs.mongodb.com/manual/reference/operator/aggregation/graphLookup/#pipe._S_graphLookup).

### 具有子节点的树形结构模型

```json
db.categories.insertMany([
  { "_id": "MongoDB", "children": [] },
  { "_id": "dbm", "children": [] },
  { "_id": "Databases", "children": ["MongoDB", "dbm"] },
  { "_id": "Languages", "children": [] },
  { "_id": "Programming", "children": ["Databases", "Languages"] },
  { "_id": "Books", "children": ["Programming"] }
])
```

- 检索节点的 children：

  ```
  db.categories.findOne( { _id: "Databases" } ).children
  ```

- 可以在 children 字段上创建索引以启用子节点的快速搜索：

  ```
  db.categories.createIndex( { children: 1 } )
  ```

- 可以在 children 字段中查询节点，以找到其父节点及其兄弟节点：

  ```
  db.categories.find( { children: "MongoDB" } )
  ```

### 具有祖先的树形结构模型

```json
db.categories.insertMany([
  {
    "_id": "MongoDB",
    "ancestors": ["Books", "Programming", "Databases"],
    "parent": "Databases"
  },
  {
    "_id": "dbm",
    "ancestors": ["Books", "Programming", "Databases"],
    "parent": "Databases"
  },
  {
    "_id": "Databases",
    "ancestors": ["Books", "Programming"],
    "parent": "Programming"
  },
  {
    "_id": "Languages",
    "ancestors": ["Books", "Programming"],
    "parent": "Programming"
  },
  { "_id": "Programming", "ancestors": ["Books"], "parent": "Books" },
  { "_id": "Books", "ancestors": [], "parent": null }
])
```

- 检索节点的祖先或路径的查询是快速而直接的：

  ```json
  db.categories.findOne({ "_id": "MongoDB" }).ancestors
  ```

- 可以在 ancestors 字段上创建索引，以启用祖先节点的快速搜索：

  ```json
  db.categories.createIndex({ "ancestors": 1 })
  ```

- 可以通过 ancestors 字段查询查找其所有后代：

  ```json
  db.categories.find({ "ancestors": "Programming" })
  ```

### 具有实体化路径的树形结构模型

```json
db.categories.insertMany([
  { "_id": "Books", "path": null },
  { "_id": "Programming", "path": ",Books," },
  { "_id": "Databases", "path": ",Books,Programming," },
  { "_id": "Languages", "path": ",Books,Programming," },
  { "_id": "MongoDB", "path": ",Books,Programming,Databases," },
  { "_id": "dbm", "path": ",Books,Programming,Databases," }
])
```

- 可以查询以检索整个树，并按字段路径排序：

  ```
  db.categories.find().sort( { path: 1 } )
  ```

- 可以在 path 字段上使用正则表达式来查找 Programming 的后代

  ```
  db.categories.find( { path: /,Programming,/ } )
  ```

- 可以检索 Books 的后代，其中 Books 也位于层次结构的最高级别：

  ```
  db.categories.find( { path: /^,Books,/ } )
  ```

- 要在 path 字段上创建索引，请使用以下调用：

  ```
  db.categories.createIndex( { path: 1 } )
  ```

### 具有嵌套集的树形结构模型

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200911204252.svg)

```javascript
db.categories.insertMany([
  { _id: 'Books', parent: 0, left: 1, right: 12 },
  { _id: 'Programming', parent: 'Books', left: 2, right: 11 },
  { _id: 'Languages', parent: 'Programming', left: 3, right: 4 },
  { _id: 'Databases', parent: 'Programming', left: 5, right: 10 },
  { _id: 'MongoDB', parent: 'Databases', left: 6, right: 7 },
  { _id: 'dbm', parent: 'Databases', left: 8, right: 9 }
])
```

可以查询以检索节点的后代：

```javascript
var databaseCategory = db.categories.findOne({ _id: 'Databases' })
db.categories.find({
  left: { $gt: databaseCategory.left },
  right: { $lt: databaseCategory.right }
})
```

## 设计模式

### 大文档，很多列，很多索引

解决方案是：列转行

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200919225901.png)

### 管理文档不同版本

MongoDB 文档格式非常灵活，势必会带来版本维护上的难度。

解决方案是：可以增加一个版本号字段

- 快速过滤掉不需要升级的文档
- 升级时，对不同版本的文档做不同处理

### 统计网页点击量

统计数据精确性要求并不是十分重要。

解决方案：用近似计算

每隔 10 次写一次：

```json
{ "$inc": { "views": 1 } }
```

### 精确统计

解决方案：使用预聚合

## 参考资料

- [Data Model Examples and Patterns](https://docs.mongodb.com/manual/applications/data-models/)
