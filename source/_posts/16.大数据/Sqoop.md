---
title: sqoop
date: 2020-09-09 17:53:08
order: 02
categories:
  - 大数据
  - 其他
tags:
  - 大数据
  - Sqoop
permalink: /pages/42e9e354/
---

# Sqoop

> **Sqoop 是一个主要在 Hadoop 和关系数据库之间进行批量数据迁移的工具。**

## Sqoop 简介

**Sqoop 是一个主要在 Hadoop 和关系数据库之间进行批量数据迁移的工具。**

- Hadoop：HDFS、Hive、HBase、Inceptor、Hyperbase
- 面向大数据集的批量导入导出
- 将输入数据集分为 N 个切片，然后启动 N 个 Map 任务并行传输
- 支持全量、增量两种传输方式

### 提供多种 Sqoop 连接器

#### 内置连接器

- 经过优化的专用 RDBMS 连接器：MySQL、PostgreSQL、Oracle、DB2、SQL Server、Netzza 等
- 通用的 JDBC 连接器：支持 JDBC 协议的数据库

#### 第三方连接器

- 数据仓库：Teradata
- NoSQL 数据库：Couchbase

### Sqoop 版本

#### Sqoop 1 优缺点

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/bigdata/Sqoop/sqoop-architecture.png)

优点

- 架构简单
- 部署简单
- 功能全面
- 稳定性较高
- 速度较快

缺点

- 访问方式单一
- 命令行方式容易出错，格式紧耦合
- 安全机制不够完善，存在密码泄露风险

#### Sqoop 2 优缺点

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/bigdata/Sqoop/sqoop-v2-architecture.png)

优点

- 访问方式多样
- 集中管理连接器
- 安全机制较完善
- 支持多用户

缺点

- 架构较复杂
- 部署较繁琐
- 稳定性一般
- 速度一般

## Sqoop 原理

### 导入

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/bigdata/Sqoop/sqoop-import.png)

### 导出

![img](https://raw.githubusercontent.com/dunwu/images/master/cs/bigdata/Sqoop/sqoop-export.png)