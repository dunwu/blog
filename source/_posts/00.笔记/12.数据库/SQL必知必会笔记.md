---
title: 《SQL 必知必会》笔记
date: 2024-09-29 07:45:34
categories:
  - 笔记
  - 数据库
tags:
  - 数据库
  - 关系型数据库
permalink: /pages/dfbb5978/
---

# 《SQL 必知必会》笔记

## 第 1 课 了解 SQL

### 数据库基础

- 数据库（database） - 保存有组织的数据的容器（通常是一个文件或一组文件）。
- 表（table） - 某种特定类型数据的结构化清单。
- 模式 - 关于数据库和表的布局及特性的信息。
- 列（column） - 表中的一个字段。所有表都是由一个或多个列组成的。
- 数据类型 - 所允许的数据的类型。每个表列都有相应的数据类型，它限制（或允许）该列中存储的数据。
- 行（row） - 表中的一个记录。
- 主键（primary key） - 一列（或一组列），其值能够唯一标识表中每一行。表中的任何列都可以作为主键，只要它满足以下条件：
  - 任意两行都不具有相同的主键值；
  - 每一行都必须具有一个主键值（主键列不允许 NULL 值）；
  - 主键列中的值不允许修改或更新；
  - 主键值不能重用（如果某行从表中删除，它的主键不能赋给以后的新行）。

### 什么是 SQL

SQL 是 Structured Query Language（结构化查询语言）的缩写。SQL 是一种专门用来与数据库沟通的语言。

## 第 2 课 检索数据

作为 SQL 组成部分的保留字。关键字不能用作表或列的名字。

检索单列

```sql
SELECT prod_name
FROM Products;
```

检索多列

```sql
SELECT prod_id, prod_name, prod_price
FROM Products;
```

检索所有列

```sql
SELECT *
FROM Products;
```

检索去重

```sql
SELECT DISTINCT vend_id
FROM Products;
```

限制数量

检索 TOP5 数据：

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

使用注释

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

## 第 3 课 排序检索数据

SQL 语句由子句构成，有些子句是必需的，有些则是可选的。一个子句通常由一个关键字加上所提供的数据组成。例如，SELECT 语句中的 FROM 子句。

ORDER BY 子句取一个或多个列的名字，据此对输出进行排序。ORDER BY 支持两种排序方式：ASC（升序） 和 DESC（降序）。

按单列排序：

```sql
SELECT prod_name
FROM Products
ORDER BY prod_name;
```

按多列排序：

```sql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY prod_price DESC, prod_name;
```

按列位置排序（不推荐）：

```sql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY 2, 3;
```

指定排序方向

```sql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY prod_price DESC;
```

## 第 4 课 过滤数据

只检索所需数据需要指定搜索条件（search criteria），搜索条件也称为过滤条件（filter condition）。

在 SELECT 语句中，数据根据 WHERE 子句中指定的搜索条件进行过滤。

```sql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price = 3.49;
```

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

## 第 5 课 高级数据过滤

- **AND** - AND 用来表示检索满足所有给定条件的行。
- **OR** - OR 用来表示检索匹配任一给定条件的行。

### 组合 WHERE 子句

检索由供应商 DLL01 制造且价格小于等于 4 美元的所有产品的名称和价格

```sql
SELECT prod_id, prod_price, prod_name
FROM Products
WHERE vend_id = 'DLL01' AND prod_price <= 4;
```

检索由供应商 DLL01 或供应商 BRS01 制造的所有产品的名称和价格

```sql
SELECT prod_name, prod_price
FROM Products
WHERE vend_id = 'DLL01' OR vend_id = 'BRS01';
```

WHERE 子句可以包含任意数目的 AND 和 OR 操作符。允许两者结合以进行复杂、高级的过滤。

SQL 在处理 OR 操作符前，优先处理 AND 操作符。

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

### IN 操作符

IN 操作符用来指定条件范围，范围中的每个条件都可以进行匹配。IN 取一组由逗号分隔、括在圆括号中的合法值。

```sql
SELECT prod_name, prod_price
FROM Products
WHERE vend_id IN ( 'DLL01', 'BRS01' )
ORDER BY prod_name;
```

和下面的示例作用相同

```sql
SELECT prod_name, prod_price
FROM Products
WHERE vend_id = 'DLL01' OR vend_id = 'BRS01'
ORDER BY prod_name;
```

为什么要使用 IN 操作符？其优点如下。

- 在有很多合法选项时，IN 操作符的语法更清楚，更直观。
- 在与其他 AND 和 OR 操作符组合使用 IN 时，求值顺序更容易管理。
- IN 操作符一般比一组 OR 操作符执行得更快。
- IN 的最大优点是可以包含其他 SELECT 语句，能够更动态地建立 HERE 子句。

### NOT 操作符

NOT 用来否定其后条件的关键字。

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

## 第 6 课 用通配符进行过滤

通配符（wildcard）用来匹配值的一部分的特殊字符。

搜索模式（search pattern）由字面值、通配符或两者组合构成的搜索条件。

在搜索子句中使用通配符，必须使用 LIKE 操作符。LIKE 指示 DBMS，后跟的搜索模式利用通配符匹配而不是简单的相等匹配进行比较。

### 百分号（%）通配符

%表示任何字符出现任意次数。

检索所有产品名以 Fish 开头的产品

```sql
SELECT prod_id, prod_name
FROM Products
WHERE prod_name LIKE 'Fish%';
```

匹配任何位置上包含文本 bean bag 的值，
不论它之前或之后出现什么字符。

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

### 下划线（\_）通配符

下划线（\_）的用途与%一样，但它只匹配单个字符。

```sql
SELECT prod_id, prod_name
FROM Products
WHERE prod_name LIKE '__ inch teddy bear';
```

### 方括号（[ ]）通配符

方括号（[]）通配符用来指定一个字符集，它必须匹配指定位置（通配符的位置）的一个字符。

> 说明：并不是所有 DBMS 都支持用来创建集合的 []。只有微软的 Access 和 SQL Server 支持集合。

找出所有名字以 J 或 M 开头的联系人：

```sql
SELECT cust_contact
FROM Customers
WHERE cust_contact LIKE '[JM]%'
ORDER BY cust_contact;
```

## 第 7 课 创建计算字段

### 拼接字段

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

去除字符串中的空格

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

### 别名

使用别名

```sql
-- Access 和 SQL Server
SELECT RTRIM(vend_name) + ' (' + RTRIM(vend_country) + ')'
AS vend_title
FROM Vendors
ORDER BY vend_name;

-- DB2、Oracle、PostgreSQL、SQLite 和 Open Office Base
SELECT RTRIM(vend_name) || ' (' || RTRIM(vend_country) || ')'
AS vend_title
FROM Vendors
ORDER BY vend_name;

-- MySQL 和 MariaDB
SELECT Concat(vend_name, ' (', vend_country, ')')
AS vend_title
FROM Vendors
ORDER BY vend_name;
```

### 执行算术计算

汇总物品的价格（单价乘以订购数量）：

```sql
SELECT prod_id,
quantity,
item_price,
quantity*item_price AS expanded_price
FROM OrderItems
WHERE order_num = 20008;
```

## 第 8 课 使用函数处理数据

大多数 SQL 实现支持以下类型的函数：

- 算术函数
- 文本处理函数
- 时间处理函数
- 聚合函数
- 返回 DBMS 正使用的特殊信息（如返回用户登录信息）的系统函数

### 文本处理函数

| 函数                                     | 说明                    |
| ---------------------------------------- | ----------------------- |
| LEFT()（或使用子字符串函数）             | 返回字符串左边的字符    |
| LENGTH()（也使用 DATALENGTH() 或 LEN()） | 返回字符串的长度        |
| LOWER()（Access 使用 LCASE()）           | 将字符串转换为小写      |
| LTRIM()                                  | 去掉字符串左边的空格    |
| RIGHT()（或使用子字符串函数）            | 返回字符串右边的字符    |
| RTRIM()                                  | 去掉字符串右边的空格    |
| SOUNDEX()                                | 返回字符串的 SOUNDEX 值 |
| UPPER()（Access 使用 UCASE()）           | 将字符串转换为大写      |

UPPER() 将文本转换为大写

```sql
SELECT vend_name, UPPER(vend_name) AS vend_name_upcase
FROM Vendors
ORDER BY vend_name;
```

### 日期和时间处理函数

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

### 数值处理函数

| 函数   | 说明               |
| ------ | ------------------ |
| ABS()  | 返回一个数的绝对值 |
| COS()  | 返回一个角度的余弦 |
| EXP()  | 返回一个数的指数值 |
| PI()   | 返回圆周率         |
| SIN()  | 返回一个角度的正弦 |
| SQRT() | 返回一个数的平方根 |
| TAN()  | 返回一个角度的正切 |

## 第 9 课 汇总数据

聚集函数（aggregate function）对某些行运行的函数，计算并返回一个值。

| 函数    | 说明             |
| ------- | ---------------- |
| AVG()   | 返回某列的平均值 |
| COUNT() | 返回某列的行数   |
| MAX()   | 返回某列的最大值 |
| MIN()   | 返回某列的最小值 |
| SUM()   | 返回某列值之和   |

AVG() 通过对表中行数计数并计算其列值之和，求得该列的平均值。

使用 AVG() 返回 Products 表中所有产品的平均价格：

```sql
SELECT AVG(prod_price) AS avg_price
FROM Products;
```

COUNT() 函数进行计数。可利用 COUNT() 确定表中行的数目或符合特定条件的行的数目。

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

MAX() 返回指定列中的最大值。

返回 Products 表中最贵物品的价格：

```sql
SELECT MAX(prod_price) AS max_price
FROM Products;
```

MIN() 返回指定列的最小值。

返回 Products 表中最便宜物品的价格

```sql
SELECT MIN(prod_price) AS min_price
FROM Products;
```

SUM() 用来返回指定列值的和（总计）。

返回订单中所有物品数量之和

```sql
SELECT SUM(quantity) AS items_ordered
FROM OrderItems
WHERE order_num = 20005;
```

### 组合聚集函数

```sql
SELECT COUNT(*) AS num_items,
MIN(prod_price) AS price_min,
MAX(prod_price) AS price_max,
AVG(prod_price) AS price_avg
FROM Products;
```

## 第 10 课 分组数据

分组是使用 SELECT 语句的 GROUP BY 子句建立的。

```sql
SELECT vend_id, COUNT(*) AS num_prods
FROM Products
GROUP BY vend_id;
```

GROUP BY 要点：

- GROUP BY 子句可以包含任意数目的列，因而可以对分组进行嵌套，更细致地进行数据分组。
- 如果在 GROUP BY 子句中嵌套了分组，数据将在最后指定的分组上进行汇总。换句话说，在建立分组时，指定的所有列都一起计算（所以不能从个别的列取回数据）。
- GROUP BY 子句中列出的每一列都必须是检索列或有效的表达式（但不能是聚集函数）。如果在 SELECT 中使用表达式，则必须在 GROUP BY 子句中指定相同的表达式。不能使用别名。
- 大多数 SQL 实现不允许 GROUP BY 列带有长度可变的数据类型（如文本或备注型字段）。
- 除聚集计算语句外，SELECT 语句中的每一列都必须在 GROUP BY 子句中给出。
- 如果分组列中包含具有 NULL 值的行，则 NULL 将作为一个分组返回。如果列中有多行 NULL 值，它们将分为一组。
- GROUP BY 子句必须出现在 WHERE 子句之后，ORDER BY 子句之前。

HAVING 要点：

HAVING 非常类似于 WHERE。唯一的差别是，WHERE 过滤行，而 HAVING 过滤分组。

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

在 SELECT 语句中使用时必须遵循的次序：

```sql
SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY
```

## 第 11 课 使用子查询

子查询（subquery），即嵌套在其他查询中的查询。

假如需要列出订购物品 RGAN01 的所有顾客，应该怎样检索？下面列出具体的步骤。

(1) 检索包含物品 RGAN01 的所有订单的编号。

```sql
SELECT order_num
FROM OrderItems
WHERE prod_id = 'RGAN01';
```

输出

```
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

```
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

## 第 12 课 联结表

笛卡尔积 - 由没有联结条件的表关系返回的结果为笛卡儿积。检索出的行的数目将是第一个表中的行数乘以第二个表中的行数。

内联结

```sql
SELECT vend_name, prod_name, prod_price
FROM vendors INNER JOIN products
ON vendors.vend_id = products.vend_id;
```

联结多个表

下面两个 SQL 等价：

```sql
SELECT cust_name, cust_contact
FROM customers, orders, orderitems
WHERE customers.cust_id = orders.cust_id AND orderitems.order_num = orders.order_num AND prod_id = 'RGAN01';

SELECT cust_name, cust_contact
FROM customers
WHERE cust_id IN (SELECT cust_id
                  FROM orders
                  WHERE order_num IN (SELECT order_num
                                      FROM orderitems
                                      WHERE prod_id = 'RGAN01'));
```

## 第 13 课 创建高级联结

自联结

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

自然联结

```sql
SELECT c.*, o.order_num, o.order_date, oi.prod_id, oi.quantity, oi.item_price
FROM customers AS c, orders AS o, orderitems AS oi
WHERE c.cust_id = o.cust_id AND oi.order_num = o.order_num AND prod_id = 'RGAN01';
```

左外联结

```sqL
SELECT customers.cust_id, orders.order_num
FROM customers
       INNER JOIN orders
ON customers.cust_id = orders.cust_id;

SELECT customers.cust_id, orders.order_num
FROM customers
       LEFT OUTER JOIN orders
ON customers.cust_id = orders.cust_id;
```

右外联结

```sql
SELECT customers.cust_id, orders.order_num
FROM customers
       RIGHT OUTER JOIN orders
ON orders.cust_id = customers.cust_id;
```

全外联结

```sql
SELECT customers.cust_id, orders.order_num
FROM orders
       FULL OUTER JOIN customers
ON orders.cust_id = customers.cust_id;
```

> 注意：Access、MariaDB、MySQL、Open Office Base 和 SQLite 不支持 FULLOUTER JOIN 语法。

使用带聚集函数的联结

```sql
SELECT customers.cust_id,
  COUNT(orders.order_num) AS num_ord
FROM customers
       INNER JOIN orders
ON customers.cust_id = orders.cust_id
GROUP BY customers.cust_id;
```

## 第 14 课 组合查询

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

UNION 默认从查询结果集中自动去除了重复的行；如果想返回所有的匹配行，可使用 UNION ALL

```sql
SELECT cust_name, cust_contact, cust_email
FROM customers
WHERE cust_state IN ('IL', 'IN', 'MI')
UNION ALL
SELECT cust_name, cust_contact, cust_email
FROM customers
WHERE cust_name = 'Fun4All';
```

## 第 15 课 插入数据

插入完整的行

```sql
-- 下面两条 SQL 等价
INSERT INTO Customers
VALUES ('1000000006', 'Toy Land', '123 Any Street', 'New York', 'NY', '11111', 'USA', NULL, NULL);

INSERT INTO Customers(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country, cust_contact, cust_email)
VALUES ('1000000006', 'Toy Land', '123 Any Street', 'New York', 'NY','11111', 'USA', NULL, NULL);
```

插入行的一部分

```sql
INSERT INTO customers(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country)
VALUES ('1000000006', 'Toy Land', '123 Any Street', 'New York', 'NY', '11111', 'USA');
```

插入某些查询的结果

```sql
INSERT INTO Customers(cust_id, cust_contact, cust_email, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country)
SELECT cust_id, cust_contact, cust_email, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country
FROM CustNew;
```

从一个表复制到另一个表

```sql
SELECT *
INTO CustCopy
FROM Customers;

-- MariaDB、MySQL、Oracle、PostgreSQL 和 SQLite
CREATE TABLE CustCopy AS
SELECT * FROM Customers;
```

## 第 16 课 更新和删除数据

更新单列

更新客户 1000000005 的电子邮件地址

```sql
UPDATE Customers
SET cust_email = 'kim@thetoystore.com'
WHERE cust_id = '1000000005';
```

更新多列

```sql
UPDATE customers
SET cust_contact = 'Sam Roberts', cust_email = 'sam@toyland.com'
WHERE cust_id = '1000000006';
```

从表中删除特定的行

```sql
DELETE FROM Customers
WHERE cust_id = '1000000006';
```

更新和删除的指导原则

- 除非确实打算更新和删除每一行，否则绝对不要使用不带 WHERE 子句的 UPDATE 或 DELETE 语句。
- 保证每个表都有主键，尽可能像 WHERE 子句那样使用它（可以指定各主键、多个值或值的范围）。
- 在 UPDATE 或 DELETE 语句使用 WHERE 子句前，应该先用 SELECT 进行测试，保证它过滤的是正确的记录，以防编写的 WHERE 子句不正确。
- 使用强制实施引用完整性的数据库，这样 DBMS 将不允许删除其数据与其他表相关联的行。
- 有的 DBMS 允许数据库管理员施加约束，防止执行不带 WHERE 子句的 UPDATE 或 DELETE 语句。如果所采用的 DBMS 支持这个特性，应该使用它。

## 第 17 课 创建和操纵表

创建表

利用 CREATE TABLE 创建表，必须给出下列信息：

- 新表的名字，在关键字 CREATE TABLE 之后给出；
- 表列的名字和定义，用逗号分隔；
- 有的 DBMS 还要求指定表的位置。

```sql
CREATE TABLE products (
  prod_id CHAR(10) NOT NULL,
  vend_id CHAR(10) NOT NULL,
  prod_name CHAR(254) NOT NULL,
  prod_price DECIMAL(8, 2) NOT NULL,
  prod_desc VARCHAR(1000) NULL
);
```

### 更新表

添加列：

```sql
ALTER TABLE Vendors
ADD vend_phone CHAR(20);
```

删除列：

```sql
ALTER TABLE Vendors
DROP COLUMN vend_phone;
```

### 删除表

```sql
DROP TABLE CustCopy;
```

## 第 18 课 使用视图

视图是虚拟的表。与包含数据的表不一样，视图只包含使用时动态检索数据的查询。

视图的一些常见应用

重用 SQL 语句

- 简化复杂的 SQL 操作。在编写查询后，可以方便地重用它而不必知道其基本查询细节。
- 使用表的一部分而不是整个表。
- 保护数据。可以授予用户访问表的特定部分的权限，而不是整个表的访问权限。
- 更改数据格式和表示。视图可返回与底层表的表示和格式不同的数据。

创建视图

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

## 第 19 课 使用存储过程

创建存储过程

对邮件发送清单中具有邮件地址的顾客进行计数

```sql
CREATE PROCEDURE MailingListCount (
  ListCount OUT INTEGER
) IS
v_rows INTEGER;

BEGIN
SELECT COUNT(*)
INTO v_rows
FROM customers
WHERE NOT cust_email IS NULL;
ListCount := v_rows;
END;
```

## 第 20 课 管理事务处理

使用事务处理（transaction processing），通过确保成批的 SQL 操作要么完全执行，要么完全不执行，来维护数据库的完整性。

- 事务（transaction）指一组 SQL 语句；
- 回退（rollback）指撤销指定 SQL 语句的过程；
- 提交（commit）指将未存储的 SQL 语句结果写入数据库表；
- 保留点（savepoint）指事务处理中设置的临时占位符（placeholder），可以对它发布回退（与回退整个事务处理不同）。

事务开始结束标记

```sql
-- SQL Server
BEGIN TRANSACTION
...
COMMIT TRANSACTION

-- MariaDB 和 MySQL
SET TRANSACTION
...

-- Oracle
SET TRANSACTION
...

-- PostgreSQL
BEGIN
...
```

SQL 的 ROLLBACK 命令用来回退（撤销）SQL 语句

```sql
DELETE FROM Orders;
ROLLBACK;
```

一般的 SQL 语句都是针对数据库表直接执行和编写的。这就是所谓的隐式提交（implicit commit），即提交（写或保存）操作是自动进行的。

在事务处理块中，提交不会隐式进行。进行明确的提交，使用 COMMIT 语句。

```sql
BEGIN TRANSACTION
DELETE OrderItems WHERE order_num = 12345
DELETE Orders WHERE order_num = 12345
COMMIT TRANSACTION
```

要支持回退部分事务，必须在事务处理块中的合适位置放置占位符。这样，如果需要回退，可以回退到某个占位符。在 SQL 中，这些占位符称为保留点。

```sql
-- MariaDB、MySQL 和 Oracle
SAVEPOINT delete1;
...
ROLLBACK TO delete1;

-- SQL Server
SAVE TRANSACTION delete1;
ROLLBACK TRANSACTION delete1;
```

## 第 21 课 使用游标

SQL 检索操作返回一组称为结果集的行，这组返回的行都是与 SQL 语句相匹配的行（零行或多行）。简单地使用 SELECT 语句，没有办法得到第一行、下一行或前 10 行。

有时，需要在检索出来的行中前进或后退一行或多行，这就是游标的用途所在。游标（cursor）是一个存储在 DBMS 服务器上的数据库查询，它不是一条 SELECT 语句，而是被该语句检索出来的结果集。

游标要点

- 能够标记游标为只读，使数据能读取，但不能更新和删除。
- 能控制可以执行的定向操作（向前、向后、第一、最后、绝对位置、相对位置等）。
- 能标记某些列为可编辑的，某些列为不可编辑的。
- 规定范围，使游标对创建它的特定请求（如存储过程）或对所有请求可访问。
- 指示 DBMS 对检索出的数据（而不是指出表中活动数据）进行复制，使数据在游标打开和访问期间不变化。

使用 DECLARE 语句创建游标，这条语句在不同的 DBMS 中有所不同。DECLARE 命名游标，并定义相应的 SELECT 语句，根据需要带 WHERE 和其他子句。

```sql
-- DB2、MariaDB、MySQL 和 SQL Server
DECLARE CustCursor CURSOR
FOR
SELECT * FROM Customers
WHERE cust_email IS NULL

-- Oracle 和 PostgreSQL
DECLARE CURSOR CustCursor
IS
SELECT * FROM Customers
WHERE cust_email IS NULL
```

使用 OPEN CURSOR 语句打开游标，在大多数 DBMS 中的语法相同：

```sql
OPEN CURSOR CustCursor
```

关闭游标

```sql
CLOSE CustCursor
```

## 第 22 课 高级 SQL 特性

### 约束

约束（constraint）管理如何插入或处理数据库数据的规则。

DBMS 通过在数据库表上施加约束来实施引用完整性。大多数约束是在表定义中定义的，用 CREATE TABLE 或 ALTER TABLE 语句。

主键是一种特殊的约束，用来保证一列（或一组列）中的值是唯一的，而且永不改动。换句话说，表中的一列（或多个列）的值唯一标识表中的每一行。

表中任意列只要满足以下条件，都可以用于主键

- 任意两行的主键值都不相同。
- 每行都具有一个主键值（即列中不允许 NULL 值）。
- 包含主键值的列从不修改或更新。
- 主键值不能重用。如果从表中删除某一行，其主键值不分配给新行。

创建表时指定主键

```sql
CREATE TABLE vendors (
  vend_id CHAR(10) NOT NULL PRIMARY KEY,
  vend_name CHAR(50) NOT NULL,
  vend_address CHAR(50) NULL,
  vend_city CHAR(50) NULL,
  vend_state CHAR(5) NULL,
  vend_zip CHAR(10) NULL,
  vend_country CHAR(50) NULL
);
```

更新表时指定主键

```sql
ALTER TABLE Vendors
ADD CONSTRAINT PRIMARY KEY (vend_id);
```

外键是表中的一列，其值必须列在另一表的主键中。

创建表时指定外键

cust_id 中的任何值都必须是 Customers 表的 cust_id 中的值

```sql
CREATE TABLE Orders (
  order_num INTEGER NOT NULL PRIMARY KEY,
  order_date DATETIME NOT NULL,
  cust_id CHAR(10) NOT NULL REFERENCES customers(cust_id)
);
```

更新表时指定外键

```sql
ALTER TABLE Orders
ADD CONSTRAINT
FOREIGN KEY (cust_id) REFERENCES Customers (cust_id)
```

唯一约束用来保证一列（或一组列）中的数据是唯一的。它们类似于主键，但存在以下重要区别。

- 表可包含多个唯一约束，但每个表只允许一个主键。
- 唯一约束列可包含 NULL 值。
- 唯一约束列可修改或更新。
- 唯一约束列的值可重复使用。
- 与主键不一样，唯一约束不能用来定义外键。

检查约束用来保证一列（或一组列）中的数据满足一组指定的条件。检查约束的常见用途有以下几点。

- 检查最小或最大值。例如，防止 0 个物品的订单（即使 0 是合法的数）。
- 指定范围。例如，保证发货日期大于等于今天的日期，但不超过今天起一年后的日期。
- 只允许特定的值。例如，在性别字段中只允许 M 或 F。

利用这个约束，任何插入（或更新）的行都会被检查，保证 quantity 大于 0。

```sql
CREATE TABLE OrderItems (
  order_num INTEGER NOT NULL,
  order_item INTEGER NOT NULL,
  prod_id CHAR(10) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  item_price MONEY NOT NULL
);
```

检查名为 gender 的列只包含 M 或 F，可编写如下的 ALTER TABLE 语句：

```sql
ADD CONSTRAINT CHECK (gender LIKE '[MF]')
```

### 索引

索引用来排序数据以加快搜索和排序操作的速度。

```sql
CREATE INDEX prod_name_ind
ON Products (prod_name);
```

### 触发器

触发器是特殊的存储过程，它在特定的数据库活动发生时自动执行。触发器可以与特定表上的 INSERT、UPDATE 和 DELETE 操作（或组合）相关联。

触发器的一些常见用途

- 保证数据一致。例如，在 INSERT 或 UPDATE 操作中将所有州名转换为大写。
- 基于某个表的变动在其他表上执行活动。例如，每当更新或删除一行时将审计跟踪记录写入某个日志表。
- 进行额外的验证并根据需要回退数据。例如，保证某个顾客的可用资金不超限定，如果已经超出，则阻塞插入。
- 计算计算列的值或更新时间戳。

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

### 数据库安全

安全性使用 SQL 的 GRANT 和 REVOKE 语句来管理。

## 参考资料

- [《SQL 必知必会》](https://book.douban.com/subject/35167240/)