---
title: SQL 语法必知必会
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202410022047122.png
date: 2018-06-15 16:07:17
order: 02
categories:
  - 数据库
  - 关系型数据库
  - 综合
tags:
  - 数据库
  - 关系型数据库
  - SQL
permalink: /pages/cd3ae5de/
---

# SQL 语法必知必会

> 本文针对关系型数据库的基本语法。限于篇幅，本文侧重说明用法，不会展开讲解特性、原理。
>
> 本文语法主要针对 Mysql，但大部分的语法对其他关系型数据库也适用。

## SQL 简介

### 数据库术语

- **数据库（database）** - 保存有组织的数据的容器（通常是一个文件或一组文件）。
- **数据表（table）** - 某种特定类型数据的结构化清单。
- **模式（schema）** - 关于数据库和表的布局及特性的信息。模式定义了数据在表中如何存储，包含存储什么样的数据，数据如何分解，各部分信息如何命名等信息。数据库和表都有模式。
- **行（row）** - 表中的一条记录。
- **列（column）** - 表中的一个字段。所有表都是由一个或多个列组成的。
- **主键（primary key）** - 一列（或一组列），其值能够唯一标识表中每一行。

### SQL 语法

> SQL（Structured Query Language)，标准 SQL 由 ANSI 标准委员会管理，从而称为 ANSI SQL。各个 DBMS 都有自己的实现，如 PL/SQL、Transact-SQL 等。

#### SQL 语法结构

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/database/mysql/sql-syntax.png)

SQL 语法结构包括：

- **子句** - 是语句和查询的组成成分。（在某些情况下，这些都是可选的。）
- **表达式** - 可以产生任何标量值，或由列和行的数据库表
- **谓词** - 给需要评估的 SQL 三值逻辑（3VL）（true/false/unknown）或布尔真值指定条件，并限制语句和查询的效果，或改变程序流程。
- **查询** - 基于特定条件检索数据。这是 SQL 的一个重要组成部分。
- **语句** - 可以持久地影响纲要和数据，也可以控制数据库事务、程序流程、连接、会话或诊断。

#### SQL 语法要点

- **SQL 语句不区分大小写**，但是数据库表名、列名和值是否区分，依赖于具体的 DBMS 以及配置。

例如：`SELECT` 与 `select` 、`Select` 是相同的。

- **多条 SQL 语句必须以分号（`;`）分隔**。

- 处理 SQL 语句时，**所有空格都被忽略**。SQL 语句可以写成一行，也可以分写为多行。

```sql
-- 一行 SQL 语句
UPDATE user SET username='robot', password='robot' WHERE username = 'root';

-- 多行 SQL 语句
UPDATE user
SET username='robot', password='robot'
WHERE username = 'root';
```

- SQL 支持三种注释

```sql
SELECT prod_name -- 这是一条注释
FROM Products;

# 这是一条注释
SELECT prod_name
FROM Products;

/* SELECT prod_name, vend_id
FROM Products; */
SELECT prod_name
FROM Products;
```

#### SQL 分类

- DDL - **DDL**，英文叫做 Data Definition Language，即**“数据定义语言”**。
  - **DDL 用于定义数据库对象**。
  - DDL 定义操作包括创建（`CREATE`）、删除（`DROP`）、修改（`ALTER`）；而被操作的对象包括：数据库、数据表和列、视图、索引。
- DML - **DML**，英文叫做 Data Manipulation Language，即**“数据操作语言”**。
  - **DML 用于访问数据库的数据**。
  - DML 访问操作包括插入（`INSERT`）、删除（`DELETE`）、修改（`UPDATE`）、查询（`SELECT`）。这四个指令合称 **CRUD**，英文单词为 Create, Read, Update, Delete，即增删改查。
- TCL - **TCL**，英文叫做 Transaction Control Language，即**“事务控制语言”**。
  - **TCL 用于管理数据库中的事务**，实际上就是用于管理由 DML 语句所产生的数据变更，它还允许将语句分组为逻辑事务。
  - TCL 的核心指令是 `COMMIT`、`ROLLBACK`。
- DCL - **DCL**，英文叫做 Data Control Language，即**“数据控制语言”**。
  - **DCL 用于对数据访问权限进行控制**，它可以控制特定用户账户对数据表、查看表、预存程序、用户自定义函数等数据库对象的控制权。
  - DCL 的核心指令是 `GRANT`、`REVOKE`。
  - DCL 以**控制用户的访问权限**为主，因此其指令作法并不复杂，可利用 DCL 控制的权限有：`CONNECT`、`SELECT`、`INSERT`、`UPDATE`、`DELETE`、`EXECUTE`、`USAGE`、`REFERENCES`。
  - 根据不同的 DBMS 以及不同的安全性实体，其支持的权限控制也有所不同。

## 数据定义（CREATE、ALTER、DROP）

DDL 的主要功能是定义数据库对象（如：数据库、数据表、视图、索引等）。

### 数据库（DATABASE）

以下为数据库定义示例：

::: tabs#数据库定义

@tab 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS db_tutorial;
```

@tab 删除数据库

```sql
DROP DATABASE IF EXISTS db_tutorial;
```

@tab 选择数据库

```sql
USE db_tutorial;
```

:::

### 数据表（TABLE）

以下为数据表定义示例：

::: tabs#数据表定义

@tab 创建数据表

利用 `CREATE TABLE` 创建表，必须给出下列信息：

- 新表的名字，在关键字 `CREATE TABLE` 之后给出；
- 表列的名字和定义，用逗号分隔；
- 有的 DBMS 还要求指定表的位置。

```sql
CREATE TABLE user (
    id       INT(10) UNSIGNED NOT NULL COMMENT 'Id',
    username VARCHAR(64)      NOT NULL DEFAULT 'default' COMMENT '用户名',
    password VARCHAR(64)      NOT NULL DEFAULT 'default' COMMENT '密码',
    email    VARCHAR(64)      NOT NULL DEFAULT 'default' COMMENT '邮箱'
) COMMENT ='用户表';
```

@tab 删除数据表

```sql
DROP TABLE IF EXISTS user;
DROP TABLE CustCopy;
```

@tab 复制表

```sql
CREATE TABLE vip_user AS
SELECT * FROM user;
```

@tab 数据表添加列

```sql
ALTER TABLE user
ADD age int(3);
```

@tab 数据表删除列

```sql
ALTER TABLE user
DROP COLUMN age;
```

@tab 数据表修改列

```sql
ALTER TABLE user
MODIFY COLUMN age tinyint;
```

@tab 修改表的编码格式

utf8mb4 编码是 utf8 编码的超集，兼容 utf8，并且能存储 4 字节的表情字符。如果表的编码指定为 utf8，在保存 emoji 字段时会报错。

```sql
ALTER TABLE user CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

:::

以下为数据表信息查看示例：

::: tabs#数据表查看

@tab 查看表的基本信息

```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'test' AND table_name = 'user';
```

@tab 查看表的列信息

```sql
SELECT * FROM information_schema.columns
WHERE table_schema = 'test' AND table_name = 'user';
```

:::

### 视图（VIEW）

**“视图”是基于 SQL 语句的结果集的可视化的表**。视图是虚拟的表，本身不存储数据，也就不能对其进行索引操作。对视图的操作和对普通表的操作一样。

视图的作用：

- 简化复杂的 SQL 操作，比如复杂的连接。
- 只使用实际表的一部分数据。
- 通过只给用户访问视图的权限，保证数据的安全性。
- 更改数据格式和表示。

以下为视图定义示例：

::: tabs#视图定义

@tab 创建视图

创建一个名为 ProductCustomers 的视图，它联结三个表，返回已订购了任意产品的所有顾客的列表。

```sql
CREATE VIEW ProductCustomers AS
SELECT cust_name, cust_contact, prod_id
FROM Customers, Orders, OrderItems
WHERE Customers.cust_id = Orders.cust_id
AND OrderItems.order_num = Orders.order_num;
```

检索订购了产品 RGAN01 的顾客

```sql
SELECT cust_name, cust_contact
FROM ProductCustomers
WHERE prod_id = 'RGAN01';
```

@tab 删除视图

```sql
DROP VIEW top_10_user_view;
```

:::

### 索引（INDEX）

**“索引”是数据库为了提高查找效率的一种数据结构**。

日常生活中，我们可以通过检索目录，来快速定位书本中的内容。索引和数据表，就好比目录和书，想要高效查询数据表，索引至关重要。在数据量小且负载较低时，不恰当的索引对于性能的影响可能还不明显；但随着数据量逐渐增大，性能则会急剧下降。因此，**设置合理的索引是数据库查询性能优化的最有效手段**。

更新一个包含索引的表需要比更新一个没有索引的表花费更多的时间，这是由于索引本身也需要更新。因此，理想的做法是仅仅在常常被搜索的列（以及表）上面创建索引。

“唯一索引”表明此索引的每一个索引值只对应唯一的数据记录。

以下为视图定义示例：

::: tabs#索引定义

@tab 创建索引

```sql
CREATE INDEX idx_email ON user(email);
```

@tab 创建唯一索引

```sql
CREATE UNIQUE INDEX uniq_name ON user(name);
```

@tab 删除索引

```sql
ALTER TABLE user DROP INDEX idx_email;
ALTER TABLE user DROP INDEX uniq_name;
```

@tab 添加主键

```sql
ALTER TABLE user ADD PRIMARY KEY (id);
```

@tab 删除主键

```sql
ALTER TABLE user DROP PRIMARY KEY;
```

:::

### 约束（CONSTRAINT）

约束（constraint）管理如何插入或处理数据库数据的规则。

如果存在违反约束的数据行为，行为会被约束终止。约束可以在创建表时规定（通过 `CREATE TABLE` 语句），或者在表创建之后规定（通过 `ALTER TABLE` 语句）。

定义约束的语法：

```sql
CREATE TABLE table_name (
    column_name1 data_type(size) constraint_name,
    column_name2 data_type(size) constraint_name,
    column_name3 data_type(size) constraint_name,
    ....
);
```

约束类型

- `NOT NULL` - 指示字段不能存储 `NULL` 值。
- `UNIQUE KEY` - 保证字段的每行必须有唯一的值。
- `PRIMARY KEY` - PRIMARY KEY 的作用是唯一标识一条记录，不能重复，不能为空，即相当于 `NOT NULL` + `UNIQUE`。确保字段（或两个列多个列的结合）有唯一标识，有助于更容易更快速地找到表中的一个特定的记录。
- `FOREIGN KEY` - 保证一个表中的数据匹配另一个表中的值的参照完整性。
- `CHECK` - 用于检查字段取值范围的有效性。
- `DEFAULT` - 表明字段的默认值。如果插入数据时，该字段没有赋值，就会被设置为默认值。

以下为约束定义示例：

::: tabs#约束定义

@tab NOT NULL

```sql
CREATE TABLE demo (
	id INT UNSIGNED NOT NULL
);
```

@tab UNIQUE KEY

```sql
CREATE TABLE demo2 (
	id INT UNSIGNED NOT NULL,
	name VARCHAR(50) NOT NULL UNIQUE KEY
);
```

@tab PRIMARY KEY

```sql
CREATE TABLE demo3 (
	id INT UNSIGNED NOT NULL PRIMARY KEY,
	name VARCHAR(50) NOT NULL UNIQUE KEY
);
```

@tab FOREIGN KEY

```sql
CREATE TABLE demo4 (
	id INT UNSIGNED NOT NULL PRIMARY KEY,
	name VARCHAR(50) NOT NULL UNIQUE KEY,
	fid INT UNSIGNED,
	FOREIGN KEY (fid) REFERENCES demo3(id)
);
```

@tab CHECK

```sql
CREATE TABLE demo5 (
	id INT UNSIGNED NOT NULL PRIMARY KEY,
	name VARCHAR(50) NOT NULL UNIQUE KEY,
	age INT CHECK (age > 0)
);
```

@tab DEFAULT

```sql
CREATE TABLE demo6 (
	id INT UNSIGNED NOT NULL PRIMARY KEY,
	name VARCHAR(50) NOT NULL UNIQUE KEY,
	age INT DEFAULT 0
);
```

:::

## 增删改查（CRUD）

增删改查，又称为 **`CRUD`**，是数据库基本操作中的基本操作。

### 插入数据（INSERT）

`INSERT INTO` 语句用于向表中插入新记录。

以下为插入数据示例：

::: tabs#插入数据

@tab 插入完整的行

```sql
-- 下面两条 SQL 等价
INSERT INTO Customers
VALUES ('1000000006', 'Toy Land', '123 Any Street', 'New York', 'NY', '11111', 'USA', NULL, NULL);

INSERT INTO Customers(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country, cust_contact, cust_email)
VALUES ('1000000006', 'Toy Land', '123 Any Street', 'New York', 'NY','11111', 'USA', NULL, NULL);
```

@tab 插入行的一部分

```sql
INSERT INTO customers(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country)
VALUES ('1000000006', 'Toy Land', '123 Any Street', 'New York', 'NY', '11111', 'USA');
```

@tab 插入查询出来的数据

```sql
INSERT INTO Customers(cust_id, cust_contact, cust_email, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country)
SELECT cust_id, cust_contact, cust_email, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country
FROM CustNew;
```

@tab 从一个表复制到另一个表

```sql
SELECT *
INTO CustCopy
FROM Customers;

-- MariaDB、MySQL、Oracle、PostgreSQL 和 SQLite
CREATE TABLE CustCopy AS
SELECT * FROM Customers;
```

:::

### 更新数据（UPDATE）

`UPDATE` 语句用于更新表中的记录。

::: tabs#更新数据

@tab 更新单列

更新客户 1000000005 的电子邮件地址

```sql
UPDATE Customers
SET cust_email = 'kim@thetoystore.com'
WHERE cust_id = '1000000005';
```

@tab 更新多列

```sql
UPDATE customers
SET cust_contact = 'Sam Roberts', cust_email = 'sam@toyland.com'
WHERE cust_id = '1000000006';
```

@tab 从表中删除特定的行

```sql
DELETE FROM Customers
WHERE cust_id = '1000000006';
```

:::

### 删除数据（DELETE）

- `DELETE` 语句用于删除表中的记录。
- `TRUNCATE TABLE` 可以清空表，也就是删除所有行。

以下为删除数据示例：

::: tabs#删除数据

@tab 删除表中的指定数据

```sql
DELETE FROM user WHERE username = 'robot';
```

@tab 清空表中的数据

```sql
TRUNCATE TABLE user;
```

@tab 批量删除大量数据

如果要根据时间范围批量删除大量数据，最简单的语句如下：

```sql
DELETE FROM order
WHERE timestamp < SUBDATE(CURDATE(), INTERVAL 3 MONTH);
```

上面的语句，大概率执行会报错，提示删除失败，因为需要删除的数据量太大了，所以需要分批删除。

可以先通过一次查询，找到符合条件的历史订单中最大的那个订单 ID，然后在删除语句中把删除的条件转换成按主键删除。

```sql
SELECT max(id) FROM order
WHERE timestamp < SUBDATE(CURDATE(), INTERVAL 3 MONTH);

-- 分批删除，? 填上一条语句查到的最大 ID
DELETE FROM order
WHERE id <= ? ORDER BY id LIMIT 1000;
```

:::

### 查询数据（SELECT）

- `SELECT` 语句用于从数据库中查询数据。
- `DISTINCT` 用于返回唯一不同的值。它作用于所有列，也就是说所有列的值都相同才算相同。
- `LIMIT` 限制返回的行数。可以有两个参数，第一个参数为起始行，从 0 开始；第二个参数为返回的总行数。
  - `ASC` ：升序（默认）
  - `DESC` ：降序

#### SELECT 的用法

以下为查询数据示例：

::: tabs#删除数据

@tab 查询单列

```sql
SELECT prod_name
FROM Products;
```

@tab 查询多列

```sql
SELECT prod_id, prod_name, prod_price
FROM Products;
```

@tab 查询所有列

```sql
SELECT *
FROM Products;
```

@tab 查询去重

```sql
SELECT DISTINCT vend_id
FROM Products;
```

@tab 限制查询数量

```sql
-- SQL Server 和 Access
SELECT TOP 5 prod_name
FROM Products;

-- DB2
SELECT prod_name
FROM Products
FETCH FIRST 5 ROWS ONLY;

-- Oracle
SELECT prod_name
FROM Products
WHERE ROWNUM <=5;

-- MySQL、MariaDB、PostgreSQL 或者 SQLite
SELECT prod_name
FROM Products
LIMIT 5;
-- 检索从第 5 行起的 5 行数据
SELECT prod_name
FROM Products
LIMIT 5 OFFSET 5;
-- MySQL 和 MariaDB 中，上面的示例可以简化如下
SELECT prod_name
FROM Products
LIMIT 5, 5;
```

:::

#### SELECT 的执行顺序

关键字的顺序是不能颠倒的：

```sql
SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ...
```

SELECT 语句的执行顺序（在 MySQL 和 Oracle 中，SELECT 执行顺序基本相同）：

```sql
FROM > WHERE > GROUP BY > HAVING > SELECT 的字段 > DISTINCT > ORDER BY > LIMIT
```

比如你写了一个 SQL 语句，那么它的关键字顺序和执行顺序是下面这样的：

```sql
SELECT DISTINCT player_id, player_name, count(*) as num -- 顺序 5
FROM player JOIN team ON player.team_id = team.team_id -- 顺序 1
WHERE height > 1.80 -- 顺序 2
GROUP BY player.team_id -- 顺序 3
HAVING num > 2 -- 顺序 4
ORDER BY num DESC -- 顺序 6
LIMIT 2 -- 顺序 7
```

## 过滤数据（WHERE）

数据库表一般包含大量的数据，很少需要检索表中的所有行。通常只会根据特定操作或报告的需要提取表数据的子集。只检索所需数据需要指 定搜索条件（search criteria），搜索条件也称为过滤条件（filter condition）。

### WHERE

在 SQL 语句中，数据根据 `WHERE` 子句中指定的搜索条件进行过滤。

`WHERE` 子句的基本格式如下：

```sql
SELECT ……（列名） FROM ……（表名） WHERE ……（子句条件）
```

`WHERE` 的常见用法：

```sql
SELECT column1, column2 FROM table_name WHERE condition;
SELECT * FROM table_name WHERE condition1 AND condition2;
SELECT * FROM table_name WHERE condition1 OR condition2;
SELECT * FROM table_name WHERE NOT condition;
SELECT * FROM table_name WHERE condition1 AND (condition2 OR condition3);
SELECT * FROM table_name WHERE EXISTS (SELECT column_name FROM table_name WHERE condition)
```

`WHERE` 可以与 `SELECT`，`UPDATE` 和 `DELETE` 一起使用。

::: tabs#WHERE 示例

@tab `SELECT` 语句中的 `WHERE` 子句

检索所有价格小于 10 美元的产品。

```sql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price < 10;
```

检索所有不是供应商 DLL01 制造的产品

```sql
-- 下面两条查询语句作用相同

SELECT vend_id, prod_name
FROM Products
WHERE vend_id <> 'DLL01';

SELECT vend_id, prod_name
FROM Products
WHERE vend_id != 'DLL01';
```

检索价格在 5 美元和 10 美元之间的所有产品

```sql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price BETWEEN 5 AND 10;
```

检索所有没有邮件地址的顾客

```sql
SELECT cust_name
FROM CUSTOMERS
WHERE cust_email IS NULL;
```

@tab `UPDATE` 语句中的 `WHERE` 子句

```sql
UPDATE Customers
SET cust_name = 'Jack Jones'
WHERE cust_name = 'Kids Place';
```

@tab `DELETE` 语句中的 `WHERE` 子句

```sql
DELETE FROM Customers
WHERE cust_name = 'Kids Place';
```

:::

### 比较操作符

| 操作符  | 描述                                                   |
| ------- | ------------------------------------------------------ |
| `=`     | 等于                                                   |
| `<>`    | 不等于。注释：在 SQL 的一些版本中，该操作符可被写成 != |
| `>`     | 大于                                                   |
| `<`     | 小于                                                   |
| `>=`    | 大于等于                                               |
| `<=`    | 小于等于                                               |
| IS NULL | 是否为空                                               |

【示例】查询所有价格小于 10 美元的产品

```sql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price < 10;
```

【示例】查询所有不是供应商 DLL01 制造的产品

```sql
SELECT vend_id, prod_name
FROM Products
WHERE vend_id != 'DLL01';
```

【示例】查询邮件地址为空的客户

```sql
SELECT cust_name
FROM CUSTOMERS
WHERE cust_email IS NULL;
```

### 范围操作符

| 操作符    | 描述                       |
| --------- | -------------------------- |
| `BETWEEN` | 在某个范围内               |
| `IN`      | 指定针对某个列的多个可能值 |

`BETWEEN` 操作符在 `WHERE` 子句中使用，作用是选取介于某个范围内的值。

`IN` 操作符用来指定条件范围，范围中的每个条件都可以进行匹配。`IN` 取一组由逗号分隔、括在圆括号中的合法值。

为什么要使用 IN 操作符？其优点如下。

- 在有很多合法选项时，IN 操作符的语法更清楚，更直观。
- 在与其他 AND 和 OR 操作符组合使用 IN 时，求值顺序更容易管理。
- IN 操作符一般比一组 OR 操作符执行得更快（在上面这个合法选项很 少的例子中，你看不出性能差异）。
- IN 的最大优点是可以包含其他 SELECT 语句，能够更动态地建立 WHERE 子句。

以下为范围操作符使用示例：

::: tabs#范围操作符

@tab IN 示例

下面两条 SQL 的语义等价：

```sql
SELECT prod_name, prod_price
FROM Products
WHERE vend_id IN ( 'DLL01', 'BRS01' )
ORDER BY prod_name;

SELECT prod_name, prod_price
FROM Products
WHERE vend_id = 'DLL01' OR vend_id = 'BRS01'
ORDER BY prod_name;
```

@tab BETWEEN 示例

```sql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price BETWEEN 5 AND 10;
```

:::

### 逻辑操作符

| 操作符 | 描述       |
| ------ | ---------- |
| `AND`  | 并且（与） |
| `OR`   | 或者（或） |
| `NOT`  | 否定（非） |

`AND`、`OR`、`NOT` 是用于对过滤条件的逻辑处理指令。

- `AND` 优先级高于 `OR`，为了明确处理顺序，可以使用 `()`。`AND` 操作符表示左右条件都要满足。
- `OR` 操作符表示左右条件满足任意一个即可。

- `NOT` 操作符用于否定其后条件。

以下为逻辑操作符使用示例：

::: tabs#逻辑操作符

@tab `AND` 示例

检索由供应商 DLL01 制造且价格小于等于 4 美元的所有产品的名称和价格

```sql
SELECT prod_id, prod_price, prod_name
FROM Products
WHERE vend_id = 'DLL01' AND prod_price <= 4;
```

@tab `OR` 示例

检索由供应商 DLL01 或供应商 BRS01 制造的所有产品的名称和价格

```sql
SELECT prod_id, prod_price, prod_name
FROM Products
WHERE vend_id = 'DLL01' OR vend_id = 'BRS01';
```

@tab NOT 示例

检索除 DLL01 之外的所有供应商制造的产品

```sql
SELECT prod_name
FROM Products
WHERE NOT vend_id = 'DLL01'
ORDER BY prod_name;
```

和下面的示例作用相同

```sql
SELECT prod_name
FROM Products
WHERE vend_id <> 'DLL01'
ORDER BY prod_name;
```

@tab `AND` 和 `OR` 优先级示例

SQL 在处理 `OR` 操作符前，优先处理 `AND` 操作符。

下面的示例中，SQL 会理解为由供应商 BRS01 制造的价格为 10 美元以上的所有产品，以及由供应商 DLL01 制造的所有产品，而不管其价格如何。

```sql
SELECT prod_name, prod_price
FROM Products
WHERE vend_id = 'DLL01' OR vend_id = 'BRS01'
AND prod_price >= 10;
```

任何时候使用具有 AND 和 OR 操作符的 WHERE 子句，都应该使用圆括号明确地分组操作符。

```sql
SELECT prod_name, prod_price
FROM Products
WHERE (vend_id = 'DLL01' OR vend_id = 'BRS01')
AND prod_price >= 10;
```

:::

### 通配符

`LIKE` 操作符在 `WHERE` 子句中使用，作用是确定字符串是否匹配模式。只有字段是文本值时才使用 `LIKE`。**不要滥用通配符，通配符位于开头处匹配会非常慢**。

`LIKE` 支持以下通配符匹配选项：

- `%` 表示任何字符出现任意次数。
- `_` 表示任何字符出现一次。
- `[]` 必须匹配指定位置的一个字符。

> 说明：并不是所有 DBMS 都支持 `[]`。只有微软的 Access 和 SQL Server 支持 `[]`。

以下为通配符使用示例：

::: tabs#逻辑操作符

@tab `%` 示例

检索所有产品名以 Fish 开头的产品

```sql
SELECT prod_id, prod_name
FROM Products
WHERE prod_name LIKE 'Fish%';
```

检索产品名中包含 bean bag 的产品

```sql
SELECT prod_id, prod_name
FROM Products
WHERE prod_name LIKE '%bean bag%';
```

检索产品名中以 F 开头，y 结尾的产品

```sql
SELECT prod_name
FROM Products
WHERE prod_name LIKE 'F%y';
```

@tab `_` 示例

```sql
SELECT * FROM Products
WHERE prod_name LIKE '__ inch teddy bear';
```

@tab `[]` 示例

找出所有名字以 J 或 M 开头的联系人：

```sql
SELECT cust_contact
FROM Customers
WHERE cust_contact LIKE '[JM]%'
ORDER BY cust_contact;
```

:::

### 子查询

子查询（subquery），即嵌套在其他查询中的查询。

子查询可以分为关联子查询和非关联子查询。

- 子查询从数据表中查询了数据结果，如果这个数据结果只执行一次，然后这个数据结果作为主查询的条件进行执行，那么这样的子查询叫做**非关联子查询**。

- 如果子查询需要执行多次，即采用循环的方式，先从外部查询开始，每次都传入子查询进行查询，然后再将结果反馈给外部，这种嵌套的执行方式就称为**关联子查询**。

![](https://raw.githubusercontent.com/dunwu/images/master/cs/database/mysql/sql-subqueries.gif)

假如需要列出订购物品 RGAN01 的所有顾客，应该怎样检索？下面列出具体的步骤。

(1) 检索包含物品 RGAN01 的所有订单的编号。

```sql
SELECT order_num
FROM OrderItems
WHERE prod_id = 'RGAN01';
```

输出

```text
order_num
-----------
20007
20008
```

(2) 检索具有前一步骤列出的订单编号的所有顾客的 ID。

```sql
SELECT cust_id
FROM Orders
WHERE order_num IN (20007,20008);
```

输出

```text
cust_id
----------
1000000004
1000000005
```

(3) 检索前一步骤返回的所有顾客 ID 的顾客信息。

```sql
SELECT cust_name, cust_contact
FROM Customers
WHERE cust_id IN ('1000000004','1000000005');
```

现在，结合这两个查询，把第一个查询（返回订单号的那一个）变为子查询。

```sql
SELECT cust_id
FROM orders
WHERE order_num IN (SELECT order_num
                    FROM orderitems
                    WHERE prod_id = 'RGAN01');
```

再进一步结合第三个查询

```sql
SELECT cust_name, cust_contact
FROM customers
WHERE cust_id IN (SELECT cust_id
                  FROM orders
                  WHERE order_num IN (SELECT order_num
                                      FROM orderitems
                                      WHERE prod_id = 'RGAN01'));
```

## 排序和分组

### ORDER BY

`ORDER BY` 用于对结果集进行排序。`ORDER BY` 子句取一个或多个列的名字，据此对输出进行排序。`ORDER BY` 支持两种排序方式：

- `ASC` ：升序（默认）
- `DESC` ：降序

单列排序示例：

```sql
SELECT prod_name
FROM Products
ORDER BY prod_name;
```

可以按多个列进行排序，并且为每个列指定不同的排序方式。

多列排序示例：

```sql
SELECT * FROM Products
ORDER BY prod_price DESC, prod_name ASC;
```

按列位置排序（不推荐）：

```sql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY 2, 3;
```

### GROUP BY

`GROUP BY` 子句将记录分组到汇总行中，`GROUP BY` 为每个组返回一个记录。

GROUP BY 要点：

- GROUP BY 子句可以包含任意数目的列，因而可以对分组进行嵌套，更细致地进行数据分组。
- 如果在 GROUP BY 子句中嵌套了分组，数据将在最后指定的分组上进行汇总。换句话说，在建立分组时，指定的所有列都一起计算（所以不能从个别的列取回数据）。
- GROUP BY 子句中列出的每一列都必须是检索列或有效的表达式（但不能是聚集函数）。如果在 SELECT 中使用表达式，则必须在 GROUP BY 子句中指定相同的表达式。不能使用别名。
- 大多数 SQL 实现不允许 GROUP BY 列带有长度可变的数据类型（如文本或备注型字段）。
- 除聚集计算语句外，SELECT 语句中的每一列都必须在 GROUP BY 子句中给出。
- 如果分组列中包含具有 NULL 值的行，则 NULL 将作为一个分组返回。如果列中有多行 NULL 值，它们将分为一组。
- GROUP BY 子句必须出现在 WHERE 子句之后，ORDER BY 子句之前。

分组示例：

```sql
SELECT cust_name, COUNT(cust_address) AS addr_num
FROM Customers GROUP BY cust_name;
```

分组后排序示例：

```sql
SELECT cust_name, COUNT(cust_address) AS addr_num
FROM Customers GROUP BY cust_name
ORDER BY cust_name DESC;
```

### HAVING

`HAVING` 用于对汇总的 `GROUP BY` 结果进行过滤。`HAVING` 要求存在一个 `GROUP BY` 子句。

`WHERE` 和 `HAVING` 可以在相同的查询中。

`HAVING` vs `WHERE`：

- `HAVING` 非常类似于 `WHERE`。`WHERE` 和 `HAVING` 都是用于过滤。
- `WHERE` 过滤行，而 `HAVING` 过滤分组。

使用 `WHERE` 和 `HAVING` 过滤数据示例：

过滤两个以上订单的分组

```sql
SELECT cust_id, COUNT(*) AS orders
FROM Orders
GROUP BY cust_id
HAVING COUNT(*) >= 2;
```

列出具有两个以上产品且其价格大于等于 4 的供应商：

```sql
SELECT vend_id, COUNT(*) AS num_prods
FROM Products
WHERE prod_price >= 4
GROUP BY vend_id
HAVING COUNT(*) >= 2;
```

检索包含三个或更多物品的订单号和订购物品的数目：

```sql
SELECT order_num, COUNT(*) AS items
FROM orderitems
GROUP BY order_num
HAVING COUNT(*) >= 3;
```

要按订购物品的数目排序输出，需要添加 ORDER BY 子句

```sql
SELECT order_num, COUNT(*) AS items
FROM orderitems
GROUP BY order_num
HAVING COUNT(*) >= 3
ORDER BY items, order_num;
```

## 联结和组合

### 联结（JOIN）

**在 SELECT, UPDATE 和 DELETE 语句中，“联结”可以用于联合多表查询。联结使用 `JOIN` 关键字，并且条件语句使用 `ON` 而不是 `WHERE`**。

**联结可以替换子查询，并且一般比子查询的效率更快**。

`JOIN` 有以下类型：

- **内联结** - 内联结又称等值联结，用于获取两个表中字段匹配关系的记录，**使用 `INNER JOIN` 关键字**。在没有条件语句的情况下**返回笛卡尔积**。
  - **笛卡尔积** - “笛卡尔积”也称为交叉联结（`CROSS JOIN`）。由没有联结条件的表关系返回的结果为笛卡儿积。检索出的行的数目将是第一个表中的行数乘以第二个表中的行数。
  - **自联结（=）** - “自联结（=）”可以看成内联结的一种，只是联结的表是自身而已。
  - **自然联结（NATURAL JOIN）** - “自然联结”会自动联结所有同名列。自然联结使用 `NATURAL JOIN` 关键字。
- **外联结**
  - **左联结（LEFT JOIN）** - “左外联结”会获取左表所有记录，即使右表没有对应匹配的记录。左外联结使用 `LEFT JOIN` 关键字。
  - **右联结（RIGHT JOIN）** - “右外联结”会获取右表所有记录，即使左表没有对应匹配的记录。右外联结使用 `RIGHT JOIN` 关键字。

<div align="center">
  <img src="https://raw.githubusercontent.com/dunwu/images/master/cs/database/mysql/sql-join.png" alt="sql-join">
</div>
#### 内联结（INNER JOIN）

内联结又称等值联结，用于获取两个表中字段匹配关系的记录，**使用 `INNER JOIN` 关键字**。在没有条件语句的情况下**返回笛卡尔积**。

```sql
SELECT vend_name, prod_name, prod_price
FROM vendors INNER JOIN products
ON vendors.vend_id = products.vend_id;

-- 也可以省略 INNER 使用 JOIN，与上面一句效果一样
SELECT vend_name, prod_name, prod_price
FROM vendors JOIN products
ON vendors.vend_id = products.vend_id;
```

##### 笛卡尔积

**“笛卡尔积”也称为交叉联结（`CROSS JOIN`），它的作用就是可以把任意表进行联结，即使这两张表不相关**。但通常进行联结还是需要筛选的，因此需要在联结后面加上 `WHERE` 子句，也就是作为过滤条件对联结数据进行筛选。

笛卡尔积是一个数学运算。假设我有两个集合 X 和 Y，那么 X 和 Y 的笛卡尔积就是 X 和 Y 的所有可能组合，也就是第一个对象来自于 X，第二个对象来自于 Y 的所有可能。

【示例】求 t1 和 t2 两张表的笛卡尔积

```sql
-- 以下两条 SQL，执行结果相同
SELECT * FROM t1, t2;
SELECT * FROM t1 CROSS JOIN t2;
```

##### 自联结（=）

**“自联结”可以看成内联结的一种，只是联结的表是自身而已**。

给与 Jim Jones 同一公司的所有顾客发送一封信件：

```sql
-- 子查询方式
SELECT cust_id, cust_name, cust_contact
FROM customers
WHERE cust_name = (SELECT cust_name
                   FROM customers
                   WHERE cust_contact = 'Jim Jones');

-- 自联结方式
SELECT c1.cust_id, c1.cust_name, c1.cust_contact
FROM customers AS c1, customers AS c2
WHERE c1.cust_name = c2.cust_name AND c2.cust_contact = 'Jim Jones';
```

##### 自然联结（NATURAL JOIN）

**“自然联结”会自动联结所有同名列**。自然联结使用 `NATURAL JOIN` 关键字。

```sql
SELECT *
FROM Products
NATURAL JOIN Customers;
```

#### 外联结（OUTER JOIN）

外联结返回一个表中的所有行，并且仅返回来自此表中满足联结条件的那些行，即两个表中的列是相等的。外联结分为左外联结、右外联结、全外联结（Mysql 不支持）。

##### 左联结（LEFT JOIN）

**“左外联结”会获取左表所有记录，即使右表没有对应匹配的记录**。左外联结使用 `LEFT JOIN` 关键字。

```sql
SELECT customers.cust_id, orders.order_num
FROM customers LEFT JOIN orders
ON customers.cust_id = orders.cust_id;
```

##### 右联结（RIGHT JOIN）

**“右外联结”会获取右表所有记录，即使左表没有对应匹配的记录**。右外联结使用 `RIGHT JOIN` 关键字。

```sql
SELECT customers.cust_id, orders.order_num
FROM customers RIGHT JOIN orders
ON customers.cust_id = orders.cust_id;
```

### 组合（UNION）

`UNION` 运算符**将两个或更多查询的结果组合起来，并生成一个结果集**，其中包含来自 `UNION` 中参与查询的提取行。

`UNION` 基本规则：

- 所有查询的列数和列顺序必须相同。
- 每个查询中涉及表的列的数据类型必须相同或兼容。
- 通常返回的列名取自第一个查询。

主要有两种情况需要使用组合查询：

- 在一个查询中从不同的表返回结构数据；
- 对一个表执行多个查询，按一个查询返回数据。

把 Illinois、Indiana、Michigan 等州的缩写传递给 IN 子句，检索出这些州的所有行

```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state IN ('IL','IN','MI');
```

找出所有 Fun4All

```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_name = 'Fun4All';
```

组合这两条语句

```sql
SELECT cust_name, cust_contact, cust_email
FROM customers
WHERE cust_state IN ('IL', 'IN', 'MI')
UNION
SELECT cust_name, cust_contact, cust_email
FROM customers
WHERE cust_name = 'Fun4All';
```

`UNION` 默认从查询结果集中自动去除了重复的行；如果想返回所有的匹配行，可使用 `UNION ALL`。

```sql
SELECT cust_name, cust_contact, cust_email
FROM customers
WHERE cust_state IN ('IL', 'IN', 'MI')
UNION ALL
SELECT cust_name, cust_contact, cust_email
FROM customers
WHERE cust_name = 'Fun4All';
```

### JOIN vs UNION

- `JOIN` 中联结表的列可能不同，但在 `UNION` 中，所有查询的列数和列顺序必须相同。
- `UNION` 将查询之后的行放在一起（垂直放置），但 `JOIN` 将查询之后的列放在一起（水平放置），即它构成一个笛卡尔积。

## 函数

> 🔔 注意：不同数据库的函数往往各不相同，因此不可移植。本节主要以 Mysql 的函数为例。

### 字符串函数

|         函数         |          说明          |
| :------------------: | :--------------------: |
|      `CONCAT()`      |       合并字符串       |
| `LEFT()`、`RIGHT()`  |   左边或者右边的字符   |
| `LOWER()`、`UPPER()` |   转换为小写或者大写   |
| `LTRIM()`、`RTIM()`  | 去除左边或者右边的空格 |
|      `LENGTH()`      |          长度          |
|     `SOUNDEX()`      |      转换为语音值      |

其中， **SOUNDEX()** 可以将一个字符串转换为描述其语音表示的字母数字模式。

以下为部分字符串函数的使用示例

拼接字符串值：

```sql
-- Access 和 SQL Server
SELECT vend_name + ' (' + vend_country + ')'
FROM Vendors
ORDER BY vend_name;

-- DB2、Oracle、PostgreSQL、SQLite 和 Open Office Base
SELECT vend_name || ' (' || vend_country || ')'
FROM Vendors
ORDER BY vend_name;

-- MySQL 或 MariaDB
SELECT Concat(vend_name, ' (', vend_country, ')')
FROM Vendors
ORDER BY vend_name;
```

去除字符串中的空格：

```sql
-- Access 和 SQL Server
SELECT RTRIM(vend_name) + ' (' + RTRIM(vend_country) + ')'
FROM Vendors
ORDER BY vend_name;

-- DB2、Oracle、PostgreSQL、SQLite 和 Open Office Base
SELECT RTRIM(vend_name) || ' (' || RTRIM(vend_country) || ')'
FROM Vendors
ORDER BY vend_name;
```

### 时间函数

- 日期格式：`YYYY-MM-DD`
- 时间格式：`HH:MM:SS`

|      函 数       |             说 明              |
| :--------------: | :----------------------------: |
|   `ADDDATE()`    |    增加一个日期（天、周等）    |
|   `ADDTIME()`    |    增加一个时间（时、分等）    |
| `CURRENT_DATE()` |          返回当前日期          |
| `CURRENT_TIME()` |          返回当前时间          |
|     `DATE()`     |     返回日期时间的日期部分     |
|   `DATEDIFF()`   |        计算两个日期之差        |
|   `DATE_ADD()`   |     高度灵活的日期运算函数     |
| `DATE_FORMAT()`  |  返回一个格式化的日期或时间串  |
|     `DAY()`      |     返回一个日期的天数部分     |
|  `DAYOFWEEK()`   | 对于一个日期，返回对应的星期几 |
|     `HOUR()`     |     返回一个时间的小时部分     |
|    `MINUTE()`    |     返回一个时间的分钟部分     |
|    `MONTH()`     |     返回一个日期的月份部分     |
|     `NOW()`      |       返回当前日期和时间       |
|    `SECOND()`    |      返回一个时间的秒部分      |
|     `TIME()`     |   返回一个日期时间的时间部分   |
|     `YEAR()`     |     返回一个日期的年份部分     |

部分日期和时间处理函数使用示例：

```sql
-- SQL Server
SELECT order_num
FROM Orders
WHERE DATEPART(yy, order_date) = 2012;

-- Access
SELECT order_num
FROM Orders
WHERE DATEPART('yyyy', order_date) = 2012;

-- PostgreSQL
SELECT order_num
FROM Orders
WHERE DATE_PART('year', order_date) = 2012;

-- Oracle
SELECT order_num
FROM Orders
WHERE to_number(to_char(order_date, 'YYYY')) = 2012;

-- MySQL 和 MariaDB
SELECT order_num
FROM Orders
WHERE YEAR(order_date) = 2012;
```

### 数学函数

常见 Mysql 数学函数：

|   函数   | 说明               |
| :------: | ------------------ |
| `ABS()`  | 返回一个数的绝对值 |
| `COS()`  | 返回一个角度的余弦 |
| `EXP()`  | 返回一个数的指数值 |
|  `PI()`  | 返回圆周率         |
| `SIN()`  | 返回一个角度的正弦 |
| `SQRT()` | 返回一个数的平方根 |
| `TAN()`  | 返回一个角度的正切 |

### 聚合函数

|   函 数   |      说 明       |
| :-------: | :--------------: |
|  `AVG()`  | 返回某列的平均值 |
| `COUNT()` |  返回某列的行数  |
|  `MAX()`  | 返回某列的最大值 |
|  `MIN()`  | 返回某列的最小值 |
|  `SUM()`  |  返回某列值之和  |

`AVG()` 通过对表中行数计数并计算其列值之和，求得该列的平均值。

使用 DISTINCT 可以让汇总函数值汇总不同的值。

::: tabs#聚合函数示例

@tab `AVG()` 示例

使用 `AVG()` 返回 Products 表中所有产品的平均价格：

```sql
SELECT AVG(prod_price) AS avg_price
FROM Products;
```

@tab `COUNT()` 示例

`COUNT()` 函数进行计数。可利用 `COUNT()` 确定表中行的数目或符合特定条件的行的数目。

返回 Customers 表中顾客的总数：

```sql
SELECT COUNT(*) AS num_cust
FROM Customers;
```

只对具有电子邮件地址的客户计数：

```sql
SELECT COUNT(cust_email) AS num_cust
FROM Customers;
```

@tab `MAX()` 示例

返回 Products 表中最贵物品的价格：

```sql
SELECT MAX(prod_price) AS max_price
FROM Products;
```

@tab `MIN()` 示例

返回 Products 表中最便宜物品的价格

```sql
SELECT MIN(prod_price) AS min_price
FROM Products;
```

@tab `SUM()` 示例

返回订单中所有物品数量之和

```sql
SELECT SUM(quantity) AS items_ordered
FROM OrderItems
WHERE order_num = 20005;
```

:::

### 转换函数

|  函 数   |    说 明     | 示例                                               |
| :------: | :----------: | -------------------------------------------------- |
| `CAST()` | 转换数据类型 | `SELECT CAST("2017-08-29" AS DATE); -> 2017-08-29` |

## 事务

不能回退 `SELECT` 语句，回退 `SELECT` 语句也没意义；也不能回退 `CREATE` 和 `DROP` 语句。

**MySQL 默认采用隐式提交策略（`autocommit`）**，每执行一条语句就把这条语句当成一个事务然后进行提交。当出现 `START TRANSACTION` 语句时，会关闭隐式提交；当 `COMMIT` 或 `ROLLBACK` 语句执行后，事务会自动关闭，重新恢复隐式提交。

通过 `set autocommit=0` 可以取消自动提交，直到 `set autocommit=1` 才会提交；`autocommit` 标记是针对每个连接而不是针对服务器的。

事务处理指令：

- `START TRANSACTION` - 指令用于标记事务的起始点。
- `SAVEPOINT` - 指令用于创建保留点。
- `ROLLBACK TO` - 指令用于回滚到指定的保留点；如果没有设置保留点，则回退到 `START TRANSACTION` 语句处。
- `COMMIT` - 提交事务。
- `RELEASE SAVEPOINT`：删除某个保存点。
- `SET TRANSACTION`：设置事务的隔离级别。

事务处理示例：

```sql
-- 开始事务
START TRANSACTION;

-- 插入操作 A
INSERT INTO `user`
VALUES (1, 'root1', 'root1', 'xxxx@163.com');

-- 创建保留点 updateA
SAVEPOINT updateA;

-- 插入操作 B
INSERT INTO `user`
VALUES (2, 'root2', 'root2', 'xxxx@163.com');

-- 回滚到保留点 updateA
ROLLBACK TO updateA;

-- 提交事务，只有操作 A 生效
COMMIT;
```

### ACID

### 事务隔离级别

---

**（以下为 DCL 语句用法）**

## 权限控制

`GRANT` 和 `REVOKE` 可在几个层次上控制访问权限：

- 整个服务器，使用 `GRANT ALL` 和 `REVOKE ALL`；
- 整个数据库，使用 ON database.\*；
- 特定的表，使用 ON database.table；
- 特定的列；
- 特定的存储过程。

新创建的账户没有任何权限。

账户用 `username@host` 的形式定义，`username@%` 使用的是默认主机名。

MySQL 的账户信息保存在 mysql 这个数据库中。

```sql
USE mysql;
SELECT user FROM user;
```

### 创建账户

```sql
CREATE USER myuser IDENTIFIED BY 'mypassword';
```

### 修改账户名

```sql
UPDATE user SET user='newuser' WHERE user='myuser';
FLUSH PRIVILEGES;
```

### 删除账户

```sql
DROP USER myuser;
```

### 查看权限

```sql
SHOW GRANTS FOR myuser;
```

### 授予权限

```sql
GRANT SELECT, INSERT ON *.* TO myuser;
```

### 删除权限

```sql
REVOKE SELECT, INSERT ON *.* FROM myuser;
```

### 更改密码

```sql
SET PASSWORD FOR myuser = 'mypass';
```

## 存储过程

存储过程的英文是 Stored Procedure。它可以视为一组 SQL 语句的批处理。一旦存储过程被创建出来，使用它就像使用函数一样简单，我们直接通过调用存储过程名即可。

定义存储过程的语法格式：

```sql
CREATE PROCEDURE 存储过程名称 ([参数列表])
BEGIN
    需要执行的语句
END
```

存储过程定义语句类型：

- `CREATE PROCEDURE` 用于创建存储过程
- `DROP PROCEDURE` 用于删除存储过程
- `ALTER PROCEDURE` 用于修改存储过程

### 使用存储过程

创建存储过程的要点：

- `DELIMITER` 用于定义语句的结束符
- 存储过程的 3 种参数类型：
  - `IN`：存储过程的入参
  - `OUT`：存储过程的出参
  - `INPUT`：既是存储过程的入参，也是存储过程的出参
- 流控制语句：
  - `BEGIN…END`：`BEGIN…END` 中间包含了多个语句，每个语句都以（`;`）号为结束符。
  - `DECLARE`：`DECLARE` 用来声明变量，使用的位置在于 `BEGIN…END` 语句中间，而且需要在其他语句使用之前进行变量的声明。
  - `SET`：赋值语句，用于对变量进行赋值。
  - `SELECT…INTO`：把从数据表中查询的结果存放到变量中，也就是为变量赋值。每次只能给一个变量赋值，不支持集合的操作。
  - `IF…THEN…ENDIF`：条件判断语句，可以在 `IF…THEN…ENDIF` 中使用 `ELSE` 和 `ELSEIF` 来进行条件判断。
  - `CASE`：`CASE` 语句用于多条件的分支判断。

创建存储过程示例：

```sql
DROP PROCEDURE IF EXISTS `proc_adder`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_adder`(IN a int, IN b int, OUT sum int)
BEGIN
    DECLARE c int;
    if a is null then set a = 0;
    end if;

    if b is null then set b = 0;
    end if;

    set sum  = a + b;
END
;;
DELIMITER ;
```

使用存储过程示例：

```sql
set @b=5;
call proc_adder(2,@b,@s);
select @s as sum;
```

### 存储过程的利弊

存储过程的优点：

- **执行效率高**：一次编译多次使用。
- **安全性强**：在设定存储过程的时候可以设置对用户的使用权限，这样就和视图一样具有较强的安全性。
- **可复用**：将代码封装，可以提高代码复用。
- **性能好**
  - 由于是预先编译，因此具有很高的性能。
  - 一个存储过程替代大量 T_SQL 语句 ，可以降低网络通信量，提高通信速率。

存储过程的缺点：

- **可移植性差**：存储过程不能跨数据库移植。由于不同数据库的存储过程语法几乎都不一样，十分难以维护（不通用）。
- **调试困难**：只有少数 DBMS 支持存储过程的调试。对于复杂的存储过程来说，开发和维护都不容易。
- **版本管理困难**：比如数据表索引发生变化了，可能会导致存储过程失效。我们在开发软件的时候往往需要进行版本管理，但是存储过程本身没有版本控制，版本迭代更新的时候很麻烦。
- **不适合高并发的场景**：高并发的场景需要减少数据库的压力，有时数据库会采用分库分表的方式，而且对可扩展性要求很高，在这种情况下，存储过程会变得难以维护，增加数据库的压力，显然就不适用了。

> _综上，存储过程的优缺点都非常突出，是否使用一定要慎重，需要根据具体应用场景来权衡_。

### 触发器

触发器是特殊的存储过程，它在特定的数据库活动发生时自动执行。触发器可以与特定表上的 INSERT、UPDATE 和 DELETE 操作（或组合）相关联。

触发器是一种与表操作有关的数据库对象，当触发器所在表上出现指定事件时，将调用该对象，即表的操作事件触发表上的触发器的执行。

触发器的一些常见用途

- 保证数据一致。例如，在 INSERT 或 UPDATE 操作中将所有州名转换为大写。
- 基于某个表的变动在其他表上执行活动。例如，每当更新或删除一行时将审计跟踪记录写入某个日志表。
- 进行额外的验证并根据需要回退数据。例如，保证某个顾客的可用资金不超限定，如果已经超出，则阻塞插入。
- 计算计算列的值或更新时间戳。

#### 触发器特性

可以使用触发器来进行审计跟踪，把修改记录到另外一张表中。

MySQL 不允许在触发器中使用 `CALL` 语句 ，也就是不能调用存储过程。

**`BEGIN` 和 `END`**

当触发器的触发条件满足时，将会执行 `BEGIN` 和 `END` 之间的触发器执行动作。

> 🔔 注意：在 MySQL 中，分号 `;` 是语句结束的标识符，遇到分号表示该段语句已经结束，MySQL 可以开始执行了。因此，解释器遇到触发器执行动作中的分号后就开始执行，然后会报错，因为没有找到和 BEGIN 匹配的 END。
>
> 这时就会用到 `DELIMITER` 命令（`DELIMITER` 是定界符，分隔符的意思）。它是一条命令，不需要语句结束标识，语法为：`DELIMITER new_delemiter`。`new_delemiter` 可以设为 1 个或多个长度的符号，默认的是分号 `;`，我们可以把它修改为其他符号，如 `$` - `DELIMITER $` 。在这之后的语句，以分号结束，解释器不会有什么反应，只有遇到了 `$`，才认为是语句结束。注意，使用完之后，我们还应该记得把它给修改回来。

**`NEW` 和 `OLD`**

- MySQL 中定义了 `NEW` 和 `OLD` 关键字，用来表示触发器的所在表中，触发了触发器的那一行数据。
- 在 `INSERT` 型触发器中，`NEW` 用来表示将要（`BEFORE`）或已经（`AFTER`）插入的新数据；
- 在 `UPDATE` 型触发器中，`OLD` 用来表示将要或已经被修改的原数据，`NEW` 用来表示将要或已经修改为的新数据；
- 在 `DELETE` 型触发器中，`OLD` 用来表示将要或已经被删除的原数据；
- 使用方法： `NEW.columnName` （columnName 为相应数据表某一列名）

#### 触发器指令

> 提示：为了理解触发器的要点，有必要先了解一下创建触发器的指令。

`CREATE TRIGGER` 指令用于创建触发器。

语法：

```sql
CREATE TRIGGER trigger_name
trigger_time
trigger_event
ON table_name
FOR EACH ROW
BEGIN
  trigger_statements
END;
```

说明：

- trigger_name：触发器名
- trigger_time: 触发器的触发时机。取值为 `BEFORE` 或 `AFTER`。
- trigger_event: 触发器的监听事件。取值为 `INSERT`、`UPDATE` 或 `DELETE`。
- table_name: 触发器的监听目标。指定在哪张表上建立触发器。
- FOR EACH ROW: 行级监视，Mysql 固定写法，其他 DBMS 不同。
- trigger_statements: 触发器执行动作。是一条或多条 SQL 语句的列表，列表内的每条语句都必须用分号 `;` 来结尾。

创建触发器示例：

```sql
-- SQL Server
CREATE TRIGGER customer_state
ON Customers
FOR INSERT, UPDATE
AS
UPDATE Customers
SET cust_state = Upper(cust_state)
WHERE Customers.cust_id = inserted.cust_id;

-- Oracle 和 PostgreSQL
CREATE TRIGGER customer_state
AFTER INSERT OR UPDATE
FOR EACH ROW
BEGIN
UPDATE Customers
SET cust_state = Upper(cust_state)
WHERE Customers.cust_id = :OLD.cust_id
END;
```

查看触发器示例：

```sql
SHOW TRIGGERS;
```

删除触发器示例：

```sql
DROP TRIGGER IF EXISTS trigger_insert_user;
```

## 游标

游标（CURSOR）是一个存储在 DBMS 服务器上的数据库查询，它不是一条 `SELECT` 语句，而是被该语句检索出来的结果集。在存储过程中使用游标可以对一个结果集进行移动遍历。

游标主要用于交互式应用，其中用户需要对数据集中的任意行进行浏览和修改。

游标要点

- 能够标记游标为只读，使数据能读取，但不能更新和删除。
- 能控制可以执行的定向操作（向前、向后、第一、最后、绝对位置、相对位置等）。
- 能标记某些列为可编辑的，某些列为不可编辑的。
- 规定范围，使游标对创建它的特定请求（如存储过程）或对所有请求可访问。
- 指示 DBMS 对检索出的数据（而不是指出表中活动数据）进行复制，使数据在游标打开和访问期间不变化。

使用游标的步骤：

1. **定义游标**：通过 `DECLARE cursor_name CURSOR FOR <语句>` 定义游标。这个过程没有实际检索出数据。
2. **打开游标**：通过 `OPEN cursor_name` 打开游标。
3. **取出数据**：通过 `FETCH cursor_name INTO var_name ...` 获取数据。
4. **关闭游标**：通过 `CLOSE cursor_name` 关闭游标。
5. **释放游标**：通过 `DEALLOCATE PREPARE` 释放游标。

游标使用示例：

```sql
DELIMITER $
CREATE PROCEDURE getTotal()
BEGIN
    DECLARE total INT;
    -- 创建接收游标数据的变量
    DECLARE sid INT;
    DECLARE sname VARCHAR(10);
    -- 创建总数变量
    DECLARE sage INT;
    -- 创建结束标志变量
    DECLARE done INT DEFAULT false;
    -- 创建游标
    DECLARE cur CURSOR FOR SELECT id,name,age from cursor_table where age>30;
    -- 指定游标循环结束时的返回值
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = true;
    SET total = 0;
    -- 打开游标
    OPEN cur;
    FETCH cur INTO sid, sname, sage;
    WHILE(NOT done)
    DO
        SET total = total + 1;
        FETCH cur INTO sid, sname, sage;
    END WHILE;
    -- 关闭游标
    CLOSE cur;
    SELECT total;
END $
DELIMITER ;

-- 调用存储过程
call getTotal();
```

## 参考资料

- [《SQL 必知必会》](https://book.douban.com/subject/35167240/)
- [“浅入深出”MySQL 中事务的实现](https://draveness.me/mysql-transaction)
- [MySQL 的学习--触发器](https://www.cnblogs.com/CraryPrimitiveMan/p/4206942.html)
- [维基百科词条 - SQL](https://zh.wikipedia.org/wiki/SQL)
- [https://www.sitesbay.com/sql/index](https://www.sitesbay.com/sql/index)
- [SQL Subqueries](https://www.w3resource.com/sql/subqueries/understanding-sql-subqueries.php)
- [Quick breakdown of the types of joins](https://stackoverflow.com/questions/6294778/mysql-quick-breakdown-of-the-types-of-joins)
- [SQL UNION](https://www.w3resource.com/sql/sql-union.php)
- [SQL database security](https://www.w3resource.com/sql/database-security/create-users.php)
- [Mysql 中的存储过程](https://www.cnblogs.com/chenpi/p/5136483.html)
