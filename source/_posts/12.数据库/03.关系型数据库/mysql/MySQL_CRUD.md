---
icon: logos:mysql
title: MySQL CRUD
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202503062319755.webp
date: 2025-03-13 08:05:53
categories:
  - 数据库
  - 关系型数据库
  - mysql
tags:
  - 数据库
  - 关系型数据库
  - mysql
  - crud
permalink: /pages/eb8c04f3/
---

# MySQL CRUD

::: info 概述

**CRUD** 由英文单词 **C**reate, **R**ead, **U**pdate, **D**elete 的首字母组成，即**增删改查**。

本文通过介绍基本的 MySQL CRUD 方法，向读者呈现如何访问 MySQL 数据。

扩展阅读：[SQL 语法必知必会](https://dunwu.github.io/waterdrop/pages/cd3ae5de/)

:::

<!-- more -->

## MySQL 连接

```sql
mysql -u <user> -p
mysql [db_name]
mysql -h <host> -P <port> -u <user> -p [db_name]
mysql -h <host> -u <user> -p [db_name]

-- 退出 MySQL 会话
exit 或 \q
```

## 进程管理

```sql
-- 显示进程列表
show processlist;
-- 删除进程
kill pid;
```

## MySQL 备份恢复

```sql
-- Create a backup
mysqldump -u user -p db_name > db.sql

-- Export db without schema
mysqldump -u user -p db_name --no-data=true --add-drop-table=false > db.sql

-- Restore a backup
mysql -u user -p db_name < db.sql
```

## DDL

### 数据库管理

```sql
-- 创建数据库
CREATE DATABASE db;
-- 删除数据库
DROP DATABASE db;
-- 查看数据库
SHOW DATABASES;
-- 切换数据库
USE db;
```

### 表管理

```sql
-- 显示当前数据库所有表
SHOW TABLES;
-- 显示指定表的所有字段
SHOW FIELDS FROM t;
-- 显示表结构
DESC t;
-- 显示创建表的 SQL
SHOW CREATE TABLE t;
-- 清空表数据
TRUNCATE TABLE t;

-- 创建表
CREATE TABLE t (
     id    INT,
     name  VARCHAR DEFAULT NOT NULL,
     price INT DEFAULT 0
     PRIMARY KEY(id)
);

-- 删除表
DROP TABLE t;

-- 修改表
-- 添加列
ALTER TABLE t ADD column;
-- 删除列
ALTER TABLE t DROP COLUMN c;
-- 添加约束
ALTER TABLE t ADD constraint;
-- 删除约束
ALTER TABLE t DROP constraint;
-- 重命名表
ALTER TABLE t1 RENAME TO t2;
-- 重命名列
ALTER TABLE t1 RENAME c1 TO c2;
```

### 约束

```sql
-- 设置主键
CREATE TABLE t(
    c1 INT, c2 INT, c3 VARCHAR,
    PRIMARY KEY (c1,c2)
);

-- 设置外键
CREATE TABLE t1(
    c1 INT PRIMARY KEY,
    c2 INT,
    FOREIGN KEY (c2) REFERENCES t2(c2)
);

-- 设置唯一键
CREATE TABLE t(
    c1 INT, c1 INT,
    UNIQUE(c2,c3)
);

-- 设置字段取值范围
CREATE TABLE t(
  c1 INT, c2 INT,
  CHECK(c1> 0 AND c1 >= c2)
);

-- 设置字段不为空
CREATE TABLE t(
     c1 INT PRIMARY KEY,
     c2 VARCHAR NOT NULL
);
```

### 索引管理

```sql
-- 创建索引
CREATE INDEX idx_name
ON t(c1,c2);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_name
ON t(c3,c4)

-- 删除索引
DROP INDEX idx_name;
```

## 增删改查

### 插入

```sql
-- 插入一行记录
INSERT INTO t(column_list)
VALUES(value_list);

-- 插入多行记录
INSERT INTO t(column_list)
VALUES (value_list),
       (value_list), …;

-- 复制 t2 多行记录到 t1
INSERT INTO t1(column_list)
SELECT column_list
FROM t2;
```

### 更新

```sql
-- 更新所有行记录
UPDATE t
SET c1 = new_value;
Update values in the column c1, c2 that match the condition

-- 更新符合条件的行记录
UPDATE t
SET c1 = new_value,
        c2 = new_value
WHERE condition;
```

### 删除

```sql
-- 删除所有行记录
DELETE FROM t;

-- 删除符合条件的行记录
DELETE FROM t
WHERE condition;
```

### 查询

```sql
-- 查询表的指定字段
SELECT c1, c2 FROM t

-- 查询表的所有字段
SELECT * FROM t

-- 查询匹配条件的指定字段
SELECT c1, c2 FROM t
WHERE condition

-- 查询指定字段并去重
SELECT DISTINCT c1 FROM t
WHERE condition

-- 查询指定字段，并根据 c1 字段升序（降序）排序
SELECT c1, c2 FROM t
ORDER BY c1 ASC [DESC]
Skip offset of rows and return the next n rows

-- 分页查询
SELECT c1, c2 FROM t
ORDER BY c1
LIMIT n OFFSET offset
Group rows using an aggregate function

-- 分组聚合查询
SELECT c1, aggregate(c2)
FROM t
GROUP BY c1

-- 含查询条件的分组聚合查询
SELECT c1, aggregate(c2)
FROM t
GROUP BY c1
HAVING condition
```

## 参考资料

- [《高性能 MySQL》](https://book.douban.com/subject/23008813/)
- [极客时间教程 - MySQL 实战 45 讲](https://time.geekbang.org/column/intro/139)
- [《SQL 必知必会》](https://book.douban.com/subject/35167240/)
- [MySQL Cheat Sheet](https://quickref.me/mysql.html)