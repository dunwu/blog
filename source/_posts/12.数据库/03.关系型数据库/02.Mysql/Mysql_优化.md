---
icon: logos:mysql
title: Mysql 优化
date: 2020-06-03 20:16:48
order: 07
categories:
  - 数据库
  - 关系型数据库
  - Mysql
tags:
  - 数据库
  - 关系型数据库
  - Mysql
  - 优化
permalink: /pages/b17b5f4a/
---

# Mysql 优化

## 慢查询

慢查询日志可以帮我们找到执行慢的 SQL。

可以通过以下命令查看慢查询日志是否开启：

```sql
mysql> show variables like '%slow_query_log';
+----------------+-------+
| Variable_name  | Value |
+----------------+-------+
| slow_query_log | ON    |
+----------------+-------+
1 row in set (0.02 sec)
```

启停慢查询日志开关：

```sql
# 开启慢查询日志
mysql > set global slow_query_log='ON';

# 关闭慢查询日志
mysql > set global slow_query_log='OFF';
```

查看慢查询的时间阈值：

```sql
mysql> show variables like '%long_query_time%';
+-----------------+-----------+
| Variable_name   | Value     |
+-----------------+-----------+
| long_query_time | 10.000000 |
+-----------------+-----------+
1 row in set (0.02 sec)
```

设置慢查询的时间阈值：

```sql
mysql > set global long_query_time = 3;
```

MySQL 自带了一个 mysqldumpslow 工具，用于统计慢查询日志（这个工具是个 Perl 脚本，需要先安装好 Perl）。

mysqldumpslow 命令的具体参数如下：

- `-s` - 采用 order 排序的方式，排序方式可以有以下几种。分别是 c（访问次数）、t（查询时间）、l（锁定时间）、r（返回记录）、ac（平均查询次数）、al（平均锁定时间）、ar（平均返回记录数）和 at（平均查询时间）。其中 at 为默认排序方式。
- `-t` - 返回前 N 条数据 。
- `-g` - 后面可以是正则表达式，对大小写不敏感。

比如想要按照查询时间排序，查看前两条 SQL 语句，可以执行如下命令：

```shell
perl mysqldumpslow.pl -s t -t 2 "C:\ProgramData\MySQL\MySQL Server 8.0\Data\slow.log"
```

## 执行计划（EXPLAIN）

**“执行计划”是对 SQL 查询语句在数据库中执行过程的描述**。 如果要分析某条 SQL 的性能问题，通常需要先查看 SQL 的执行计划，排查每一步 SQL 执行是否存在问题。

很多数据库都支持执行计划，Mysql 也不例外。在 Mysql 中，用户可以通过 `EXPLAIN` 命令查看优化器针对指定 SQL 生成的逻辑执行计划。 

【示例】Mysql 执行计划示例

```sql
mysql> explain select * from user_info where id = 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: user_info
   partitions: NULL
         type: const
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 8
          ref: const
         rows: 1
     filtered: 100.00
        Extra: NULL
1 row in set, 1 warning (0.00 sec)
```

执行计划返回结果参数说明：

- `id` - SELECT 查询的标识符。每个 `SELECT` 都会自动分配一个唯一的标识符。
- `select_type` - `SELECT` 查询的类型。
  - `SIMPLE` - 表示此查询不包含 `UNION` 查询或子查询。
  - `PRIMARY` - 表示此查询是最外层的查询。
  - `UNION` - 表示此查询是 `UNION` 的第二或随后的查询。
  - `DEPENDENT UNION` - `UNION` 中的第二个或后面的查询语句, 取决于外面的查询。
  - `UNION RESULT` - `UNION` 的结果。
  - `SUBQUERY` - 子查询中的第一个 `SELECT`。
  - `DEPENDENT SUBQUERY` - 子查询中的第一个 `SELECT`, 取决于外面的查询. 即子查询依赖于外层查询的结果。
- `table` - 查询的是哪个表，如果给表起别名了，则显示别名。
- `partitions` - 匹配的分区。
- `type` - 表示从表中查询到行所执行的方式，查询方式是 SQL 优化中一个很重要的指标，执行效率由高到低依次为：
  - `system`/`const` - 表中只有一行数据匹配。此时根据索引查询一次就能找到对应的数据。如果是 B+ 树索引，我们知道此时索引构造成了多个层级的树，当查询的索引在树的底层时，查询效率就越低。`const` 表示此时索引在第一层，只需访问一层便能得到数据。
  - `eq_ref` - 使用唯一索引扫描。常见于多表连接中使用主键和唯一索引作为关联条件。
  - `ref` - 非唯一索引扫描。还可见于唯一索引最左原则匹配扫描。
  - `range` - 索引范围扫描。比如 `<`，`>`，`between` 等操作。
  - `index` - 索引全表扫描。此时遍历整个索引树。
  - `ALL` - 表示全表扫描。需要遍历全表来找到对应的行。
- `possible_keys` - 此次查询中可能选用的索引。
- `key` - 此次查询中实际使用的索引。如果这一项为 `NULL`，说明没有使用索引。
- `ref` - 哪个字段或常数与 key 一起被使用。
- `rows` - 显示此查询一共扫描了多少行，这个是一个估计值。
- `filtered` - 表示此查询条件所过滤的数据的百分比。
- `extra` - 额外的信息。
  - `Using filesort` - 当查询语句中包含 `GROUP BY` 操作，而且无法利用索引完成排序操作的时候， 这时不得不选择相应的排序算法进行，甚至可能会通过文件排序，效率是很低的，所以要避免这种问题的出现。
  - `Using temporary` - 使了用临时表保存中间结果，MySQL 在对查询结果排序时使用临时表，常见于排序 `ORDER BY` 和分组查询 `GROUP BY`。效率低，要避免这种问题的出现。
  - `Using index` - 所需数据只需在索引即可全部获得，不须要再到表中取数据，也就是使用了覆盖索引，避免了回表操作，效率不错。

> 更多内容请参考：[MySQL 性能优化神器 Explain 使用分析](https://segmentfault.com/a/1190000008131735)

## optimizer trace

在 MySQL 5.6 及之后的版本中，我们可以使用 optimizer trace 功能查看优化器生成执行计划的整个过程。有了这个功能，我们不仅可以了解优化器的选择过程，更可以了解每一个执行环节的成本，然后依靠这些信息进一步优化查询。

如下代码所示，打开 optimizer_trace 后，再执行 SQL 就可以查询 information_schema.OPTIMIZER_TRACE 表查看执行计划了，最后可以关闭 optimizer_trace 功能：

```sql
SET optimizer_trace="enabled=on";
SELECT * FROM person WHERE NAME >'name84059' AND create_time>'2020-01-24 05:00
SELECT * FROM information_schema.OPTIMIZER_TRACE;
SET optimizer_trace="enabled=off";
```

## SQL 优化

### SQL 优化基本思路

使用 `EXPLAIN` 命令查看当前 SQL 是否使用了索引，优化后，再通过执行计划（`EXPLAIN`）来查看优化效果。

SQL 优化的基本思路：

- **只返回必要的列** - 最好不要使用 `SELECT *` 语句。

- **只返回必要的行** - 使用 `WHERE` 子查询语句进行过滤查询，有时候也需要使用 `LIMIT` 语句来限制返回的数据。

- **缓存重复查询的数据** - 应该考虑在客户端使用缓存，尽量不要使用 Mysql 服务器缓存（存在较多问题和限制）。

- **使用索引覆盖查询**

### 优化分页

当需要分页操作时，通常会使用 `LIMIT` 加上偏移量的办法实现，同时加上合适的 `ORDER BY` 字句。**如果有对应的索引，通常效率会不错，否则，MySQL 需要做大量的文件排序操作**。

一个常见的问题是当偏移量非常大的时候，比如：`LIMIT 1000000 20` 这样的查询，MySQL 需要查询 1000020 条记录然后只返回 20 条记录，前面的 1000000  条都将被抛弃，这样的代价非常高。

针对分页优化，有以下两种方案

（1）方案 - 延迟关联

优化这种查询一个最简单的办法就是尽可能的使用覆盖索引扫描，而不是查询所有的列。然后根据需要做一次关联查询再返回所有的列。对于偏移量很大时，这样做的效率会提升非常大。考虑下面的查询：

```sql
SELECT film_id,description FROM film ORDER BY title LIMIT 1000000,5;
```

如果这张表非常大，那么这个查询最好改成下面的样子：

```sql
SELECT film.film_id,film.description
FROM film INNER JOIN (
    SELECT film_id FROM film ORDER BY title LIMIT 50,5
) AS tmp USING(film_id);
```

这里的延迟关联将大大提升查询效率，让 MySQL 扫描尽可能少的页面，获取需要访问的记录后在根据关联列回原表查询所需要的列。

（2）方案 - 书签方式

有时候如果可以使用书签记录上次取数据的位置，那么下次就可以直接从该书签记录的位置开始扫描，这样就可以避免使用 `OFFSET`，比如下面的查询：

```sql
-- 原语句
SELECT id FROM t LIMIT 1000000, 10;
-- 优化语句
SELECT id FROM t WHERE id > 1000000 LIMIT 10;
```

其他优化的办法还包括使用预先计算的汇总表，或者关联到一个冗余表，冗余表中只包含主键列和需要做排序的列。

### 优化 JOIN

优化子查询

尽量使用 `JOIN` 语句来替代子查询。因为子查询是嵌套查询，而嵌套查询会新创建一张临时表，而临时表的创建与销毁会占用一定的系统资源以及花费一定的时间，同时对于返回结果集比较大的子查询，其对查询性能的影响更大。

小表驱动大表

JOIN 查询时，应该用小表驱动大表。因为 JOIN 时，MySQL 内部会先遍历驱动表，再去遍历被驱动表。

比如 left join，左表就是驱动表，A 表小于 B 表，建立连接的次数就少，查询速度就被加快了。

```sql
select name from A left join B ;
```

适当冗余字段

增加冗余字段可以减少大量的连表查询，因为多张表的连表查询性能很低，所有可以适当的增加冗余字段，以减少多张表的关联查询，这是以空间换时间的优化策略

避免 JOIN 太多表

《阿里巴巴 Java 开发手册》规定不要 join 超过三张表，第一 join 太多降低查询的速度，第二 join 的 buffer 会占用更多的内存。

如果不可避免要 join 多张表，可以考虑使用数据异构的方式异构到 ES 中查询。

### 优化 UNION

MySQL 执行 `UNION` 的策略是：先创建临时表，然后将各个查询结果填充到临时表中，最后再进行查询。很多优化策略在 `UNION` 查询中都会失效，因为它无法利用索引。

最好将 `WHERE`、`LIMIT` 等子句下推到 `UNION` 的各个子查询中，以便优化器可以充分利用这些条件进行优化。

此外，尽量使用 `UNION ALL`，避免使用 `UNION`。

`UNION` 和 `UNION ALL` 都是将两个结果集合并为一个，**两个要联合的 SQL 语句字段个数必须一样，而且字段类型要“相容”（一致）**。

- `UNION` 需要进行去重扫描，因此消息较低；而 `UNION ALL` 不会进行去重。
- `UNION` 会按照字段的顺序进行排序；而 `UNION ALL` 只是简单的将两个结果合并就返回。

### 优化 COUNT() 查询

`COUNT()` 有两种作用：

- 统计某个列值的数量。统计列值时，要求列值是非 `NULL` 的，它不会统计 `NULL`。
- 统计行数。

**统计列值时，要求列值是非空的，它不会统计 NULL**。如果确认括号中的表达式不可能为空时，实际上就是在统计行数。最简单的就是当使用 `COUNT(*)` 时，并不是我们所想象的那样扩展成所有的列，实际上，它会忽略所有的列而直接统计行数。

我们最常见的误解也就在这儿，在括号内指定了一列却希望统计结果是行数，而且还常常误以为前者的性能会更好。但实际并非这样，如果要统计行数，直接使用 `COUNT(*)`，意义清晰，且性能更好。

（1）简单优化

```sql
SELECT count(*) FROM world.city WHERE id > 5;

SELECT (SELECT count(*) FROM world.city) - count(*)
FROM world.city WHERE id <= 5;
```

（2）使用近似值

有时候某些业务场景并不需要完全精确的统计值，可以用近似值来代替，`EXPLAIN` 出来的行数就是一个不错的近似值，而且执行 `EXPLAIN` 并不需要真正地去执行查询，所以成本非常低。通常来说，执行 `COUNT()` 都需要扫描大量的行才能获取到精确的数据，因此很难优化，MySQL 层面还能做得也就只有覆盖索引了。如果不还能解决问题，只有从架构层面解决了，比如添加汇总表，或者使用 Redis 这样的外部缓存系统。

### 优化查询方式

#### 切分大查询

一个大查询如果一次性执行的话，可能一次锁住很多数据、占满整个事务日志、耗尽系统资源、阻塞很多小的但重要的查询。

```sql
DELEFT FROM messages WHERE create < DATE_SUB(NOW(), INTERVAL 3 MONTH);
```

```sql
rows_affected = 0
do {
    rows_affected = do_query(
    "DELETE FROM messages WHERE create  < DATE_SUB(NOW(), INTERVAL 3 MONTH) LIMIT 10000")
} while rows_affected > 0
```

#### 分解大连接查询

将一个大连接查询（JOIN）分解成对每一个表进行一次单表查询，然后将结果在应用程序中进行关联，这样做的好处有：

- 让缓存更高效。对于连接查询，如果其中一个表发生变化，那么整个查询缓存就无法使用。而分解后的多个查询，即使其中一个表发生变化，对其它表的查询缓存依然可以使用。
- 分解成多个单表查询，这些单表查询的缓存结果更可能被其它查询使用到，从而减少冗余记录的查询。
- 减少锁竞争；
- 在应用层进行连接，可以更容易对数据库进行拆分，从而更容易做到高性能和可扩展。
- 查询本身效率也可能会有所提升。例如下面的例子中，使用 IN() 代替连接查询，可以让 MySQL 按照 ID 顺序进行查询，这可能比随机的连接要更高效。

```sql
SELECT * FROM tag
JOIN tag_post ON tag_post.tag_id=tag.id
JOIN post ON tag_post.post_id=post.id
WHERE tag.tag='mysql';
```

```sql
SELECT * FROM tag WHERE tag='mysql';
SELECT * FROM tag_post WHERE tag_id=1234;
SELECT * FROM post WHERE post.id IN (123,456,567,9098,8904);
```

### 索引优化

通过索引覆盖查询，可以优化排序、分组。

详情见 [Mysql 索引](https://dunwu.github.io/waterdrop/pages/2ce0ae87/)

## 数据结构优化

良好的逻辑设计和物理设计是高性能的基石。

### 数据类型优化

#### 数据类型优化基本原则

- **更小的通常更好** - 越小的数据类型通常会更快，占用更少的磁盘、内存，处理时需要的 CPU 周期也更少。
  - 例如：整型比字符类型操作代价低，因而会使用整型来存储 IP 地址，使用 `DATETIME` 来存储时间，而不是使用字符串。
- **简单就好** - 如整型比字符型操作代价低。
  - 例如：很多软件会用整型来存储 IP 地址。
  - 例如：**`UNSIGNED` 表示不允许负值，大致可以使正数的上限提高一倍**。
- **尽量避免 NULL** - 可为 NULL 的列会使得索引、索引统计和值比较都更复杂。

#### 类型的选择

- 整数类型通常是标识列最好的选择，因为它们很快并且可以使用 `AUTO_INCREMENT`。

- `ENUM` 和 `SET` 类型通常是一个糟糕的选择，应尽量避免。
- 应该尽量避免用字符串类型作为标识列，因为它们很消耗空间，并且通常比数字类型慢。对于 `MD5`、`SHA`、`UUID` 这类随机字符串，由于比较随机，所以可能分布在很大的空间内，导致 `INSERT` 以及一些 `SELECT` 语句变得很慢。
  - 如果存储 UUID ，应该移除 `-` 符号；更好的做法是，用 `UNHEX()` 函数转换 UUID 值为 16 字节的数字，并存储在一个 `BINARY(16)` 的列中，检索时，可以通过 `HEX()` 函数来格式化为 16 进制格式。

### 表设计

应该避免的设计问题：

- **太多的列** - 设计者为了图方便，将大量冗余列加入表中，实际查询中，表中很多列是用不到的。这种宽表模式设计，会造成不小的性能代价，尤其是 `ALTER TABLE` 非常耗时。
- **太多的关联** - 所谓的实体 - 属性 - 值（EAV）设计模式是一个常见的糟糕设计模式。Mysql 限制了每个关联操作最多只能有 61 张表，但 EAV 模式需要许多自关联。
- **枚举** - 尽量不要用枚举，因为添加和删除字符串（枚举选项）必须使用 `ALTER TABLE`。
- 尽量避免 `NULL`

### 范式和反范式

**范式化目标是尽量减少冗余，而反范式化则相反**。

范式化的优点：

- 比反范式更节省空间
- 更新操作比反范式快
- 更少需要 `DISTINCT` 或 `GROUP BY` 语句

范式化的缺点：

- 通常需要关联查询。而关联查询代价较高，如果是分表的关联查询，代价更是高昂。

在真实世界中，很少会极端地使用范式化或反范式化。实际上，应该权衡范式和反范式的利弊，混合使用。

### 索引优化

> 索引优化应该是查询性能优化的最有效手段。
>
> 如果想详细了解索引特性请参考：[Mysql 索引](https://github.com/dunwu/db-tutorial/blob/master/docs/sql/mysql/mysql-index.md)

#### 何时使用索引

- 对于非常小的表，大部分情况下简单的全表扫描更高效。
- 对于中、大型表，索引非常有效。
- 对于特大型表，建立和使用索引的代价将随之增长。可以考虑使用分区技术。
- 如果表的数量特别多，可以建立一个元数据信息表，用来查询需要用到的某些特性。

#### 索引优化策略

- **索引基本原则**
  - 索引不是越多越好，不要为所有列都创建索引。
  - 要尽量避免冗余和重复索引。
  - 要考虑删除未使用的索引。
  - 尽量的扩展索引，不要新建索引。
  - 频繁作为 `WHERE` 过滤条件的列应该考虑添加索引。
- **独立的列** - “独立的列” 是指索引列不能是表达式的一部分，也不能是函数的参数。
- **前缀索引** - 索引很长的字符列，可以索引开始的部分字符，这样可以大大节约索引空间。
- **最左匹配原则** - 将选择性高的列或基数大的列优先排在多列索引最前列。
- **使用索引来排序** - 索引最好既满足排序，又用于查找行。这样，就可以使用索引来对结果排序。
- `=`、`IN` 可以乱序 - 不需要考虑 `=`、`IN` 等的顺序
- **覆盖索引**
- **自增字段作主键**

## 数据模型和业务

- 表字段比较复杂、易变动、结构难以统一的情况下，可以考虑使用 Nosql 来代替关系数据库表存储，如 ElasticSearch、MongoDB。
- 在高并发情况下的查询操作，可以使用缓存（如 Redis）代替数据库操作，提高并发性能。
- 数据量增长较快的表，需要考虑水平分表或分库，避免单表操作的性能瓶颈。
- 除此之外，我们应该通过一些优化，尽量避免比较复杂的 JOIN 查询操作，例如冗余一些字段，减少 JOIN 查询；创建一些中间表，减少 JOIN 查询。

## 参考资料

- [《高性能 MySQL》](https://book.douban.com/subject/23008813/)
- [MySQL 实战 45 讲](https://time.geekbang.org/column/intro/139)
- [极客时间教程 - Java 性能调优实战](https://time.geekbang.org/column/intro/100028001)
- [我必须得告诉大家的 MySQL 优化原理](https://www.jianshu.com/p/d7665192aaaf)
- [20+ 条 MySQL 性能优化的最佳经验](https://www.jfox.info/20-tiao-mysql-xing-nen-you-hua-de-zui-jia-jing-yan.html)
- [Mysql 官方文档之执行计划](https://dev.mysql.com/doc/refman/8.0/en/execution-plan-information.html)
- [MySQL 性能优化神器 Explain 使用分析](https://segmentfault.com/a/1190000008131735)
