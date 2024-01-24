---
title: 关系型数据库
date: 2022-04-11 16:52:35
categories:
  - 数据库
  - 关系型数据库
tags:
  - 数据库
  - 关系型数据库
permalink: /pages/bb43eb/
hidden: true
index: false
---

# 关系型数据库

## 📖 内容

### 关系型数据库综合

- [SQL 语法速成](01.综合/02.SQL语法.md)
- [扩展 SQL](01.综合/03.扩展SQL.md)
- [SQL Cheat Sheet](01.综合/99.SqlCheatSheet.md)

### Mysql

- [Mysql 架构](02.Mysql/01.Mysql架构.md)
- [Mysql 存储引擎](02.Mysql/02.Mysql存储引擎.md)
- [Mysql 索引](02.Mysql/03.Mysql索引.md)
- [Mysql 事务](02.Mysql/04.Mysql事务.md)
- [Mysql 锁](02.Mysql/05.Mysql锁.md)
- [Mysql 高可用](02.Mysql/06.Mysql高可用.md)
- [Mysql 优化](02.Mysql/07.Mysql优化.md)
- [Mysql 运维](02.Mysql/20.Mysql运维.md)
- [Mysql 面试](02.Mysql/99.Mysql面试.md)

### 其他

- [PostgreSQL 应用指南](99.其他/01.PostgreSQL.md)
- [H2 应用指南](99.其他/02.H2.md)
- [SqLite 应用指南](99.其他/03.Sqlite.md)

## 📚 资料

### 综合

- [《数据库的索引设计与优化》](https://book.douban.com/subject/26419771/)
- [《SQL 必知必会》](https://book.douban.com/subject/35167240/) - SQL 入门经典
- [SQL 必知必会](https://time.geekbang.org/column/intro/192) - 极客时间 SQL 入门教程

### Mysql

- **官方**
  - [Mysql 官网](https://www.mysql.com/)
  - [Mysql 官方文档](https://dev.mysql.com/doc/)
  - **官方 PPT**
    - [How to Analyze and Tune MySQL Queries for Better Performance](https://www.mysql.com/cn/why-mysql/presentations/tune-mysql-queries-performance/)
    - [MySQL Performance Tuning 101](https://www.mysql.com/cn/why-mysql/presentations/mysql-performance-tuning101/)
    - [MySQL Performance Schema & Sys Schema](https://www.mysql.com/cn/why-mysql/presentations/mysql-performance-sys-schema/)
    - [MySQL Performance: Demystified Tuning & Best Practices](https://www.mysql.com/cn/why-mysql/presentations/mysql-performance-tuning-best-practices/)
    - [MySQL Security Best Practices](https://www.mysql.com/cn/why-mysql/presentations/mysql-security-best-practices/)
    - [MySQL Cluster Deployment Best Practices](https://www.mysql.com/cn/why-mysql/presentations/mysql-cluster-deployment-best-practices/)
    - [MySQL High Availability with InnoDB Cluster](https://www.mysql.com/cn/why-mysql/presentations/mysql-high-availability-innodb-cluster/)
- **书籍**
  - [《高性能 MySQL》](https://book.douban.com/subject/23008813/) - 经典，适合 DBA 或作为开发者的参考手册【进阶】
  - [《MySQL 技术内幕：InnoDB 存储引擎》](https://book.douban.com/subject/24708143/)
  - [《MySQL 必知必会》](https://book.douban.com/subject/3354490/) - Mysql 的基本概念和语法【入门】
- **教程**
  - [MySQL 实战 45 讲](https://time.geekbang.org/column/intro/139)
  - [runoob.com MySQL 教程](http://www.runoob.com/mysql/mysql-tutorial.md) - 入门级 SQL 教程
  - [mysql-tutorial](https://github.com/jaywcjlove/mysql-tutorial)
- **文章**
  - [MySQL 索引背后的数据结构及算法原理](http://blog.codinglabs.org/articles/theory-of-mysql-index.md)
  - [Some study on database storage internals](https://medium.com/@kousiknath/data-structures-database-storage-internals-1f5ed3619d43)
  - [Sharding Pinterest: How we scaled our MySQL fleet](https://medium.com/@Pinterest_Engineering/sharding-pinterest-how-we-scaled-our-mysql-fleet-3f341e96ca6f)
  - [Guide to MySQL High Availability](https://www.mysql.com/cn/why-mysql/white-papers/mysql-guide-to-high-availability-solutions/)
  - [Choosing MySQL High Availability Solutions](https://dzone.com/articles/choosing-mysql-high-availability-solutions)
  - [High availability with MariaDB TX: The definitive guide](https://mariadb.com/sites/default/files/content/Whitepaper_High_availability_with_MariaDB-TX.pdf)
  - [How to create unique row ID in sharded databases?](https://stackoverflow.com/questions/788829/how-to-create-unique-row-id-in-sharded-databases)
  - [SQL Azure Federation – Introduction](http://geekswithblogs.net/shaunxu/archive/2012/01/07/sql-azure-federation-ndash-introduction.aspx)
  - Mysql 相关经验
    - [20+ 条 MySQL 性能优化的最佳经验](https://www.jfox.info/20-tiao-mysql-xing-nen-you-hua-de-zui-jia-jing-yan.html)
    - [Booking.com: Evolution of MySQL System Design](https://www.percona.com/live/mysql-conference-2015/sessions/bookingcom-evolution-mysql-system-design) ，Booking.com 的 MySQL 数据库使用的演化，其中有很多不错的经验分享，我相信也是很多公司会遇到的的问题。
    - [Tracking the Money - Scaling Financial Reporting at Airbnb](https://medium.com/airbnb-engineering/tracking-the-money-scaling-financial-reporting-at-airbnb-6d742b80f040) ，Airbnb 的数据库扩展的经验分享。
    - [Why Uber Engineering Switched from Postgres to MySQL](https://eng.uber.com/mysql-migration/) ，无意比较两个数据库谁好谁不好，推荐这篇 Uber 的长文，主要是想让你从中学习到一些经验和技术细节，这是一篇很不错的文章。
  - Mysql 集群复制
    - [Monitoring Delayed Replication, With A Focus On MySQL](https://engineering.imvu.com/2013/01/09/monitoring-delayed-replication-with-a-focus-on-mysql/)
    - [Mitigating replication lag and reducing read load with freno](https://githubengineering.com/mitigating-replication-lag-and-reducing-read-load-with-freno/)
    - [Better Parallel Replication for MySQL](https://medium.com/booking-com-infrastructure/better-parallel-replication-for-mysql-14e2d7857813)
    - [Evaluating MySQL Parallel Replication Part 2: Slave Group Commit](https://medium.com/booking-com-infrastructure/evaluating-mysql-parallel-replication-part-2-slave-group-commit-459026a141d2)
    - [Evaluating MySQL Parallel Replication Part 3: Benchmarks in Production](https://medium.com/booking-com-infrastructure/evaluating-mysql-parallel-replication-part-3-benchmarks-in-production-db5811058d74)
    - [Evaluating MySQL Parallel Replication Part 4: More Benchmarks in Production](https://medium.com/booking-com-infrastructure/evaluating-mysql-parallel-replication-part-4-more-benchmarks-in-production-49ee255043ab)
    - [Evaluating MySQL Parallel Replication Part 4, Annex: Under the Hood](https://medium.com/booking-com-infrastructure/evaluating-mysql-parallel-replication-part-4-annex-under-the-hood-eb456cf8b2fb)
  - Mysql 数据分区
    - [StackOverflow: MySQL sharding approaches?](https://stackoverflow.com/questions/5541421/mysql-sharding-approaches)
    - [Why you don’t want to shard](https://www.percona.com/blog/2009/08/06/why-you-dont-want-to-shard/)
    - [How to Scale Big Data Applications](https://www.percona.com/sites/default/files/presentations/How to Scale Big Data Applications.pdf)
    - [MySQL Sharding with ProxySQL](https://www.percona.com/blog/2016/08/30/mysql-sharding-with-proxysql/)
  - 各公司的 Mysql 数据分区经验分享
    - [MailChimp: Using Shards to Accommodate Millions of Users](https://devs.mailchimp.com/blog/using-shards-to-accommodate-millions-of-users/)
    - [Uber: Code Migration in Production: Rewriting the Sharding Layer of Uber’s Schemaless Datastore](https://eng.uber.com/schemaless-rewrite/)
    - [Sharding & IDs at Instagram](https://instagram-engineering.com/sharding-ids-at-instagram-1cf5a71e5a5c)
    - [Airbnb: How We Partitioned Airbnb’s Main Database in Two Weeks](https://medium.com/airbnb-engineering/how-we-partitioned-airbnb-s-main-database-in-two-weeks-55f7e006ff21)
- **更多资源**
  - [awesome-mysql](https://github.com/jobbole/awesome-mysql-cn) - MySQL 的资源列表

### 其他

- [《Oracle Database 9i/10g/11g 编程艺术》](https://book.douban.com/subject/5402711/)

## 🚪 传送

◾ 💧 [钝悟的 IT 知识图谱](https://dunwu.github.io/waterdrop/) ◾
