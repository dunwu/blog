---
icon: logos:hbase
title: HBase 命令
date: 2020-06-02 22:28:18
categories:
  - 数据库
  - 列式数据库
  - hbase
tags:
  - 数据库
  - 列式数据库
  - 大数据
  - hbase
permalink: /pages/4eb16c7d/
---

# HBase 命令

> 进入 HBase Shell 控制台：`./bin/hbase shell`
>
> 如果有 kerberos 认证，需要事先使用相应的 keytab 进行一下认证（使用 kinit 命令），认证成功之后再使用 hbase shell 进入可以使用 whoami 命令可查看当前用户.

## 基本命令

- 获取帮助信息：`help`
- 获取命令的详细帮助信息：`help 'status'`
- 查看服务器状态：`status`
- 查看版本信息：`version`
- 查看当前登录用户：`whoami`

## DDL

### 创建表

【语法】`create '表名称','列族名称 1','列族名称 2','列名称 N'`

【示例】

```shell
# 创建一张名为 test 的表，columnFamliy1、columnFamliy2 是 table1 表的列族。
create 'test','columnFamliy1','columnFamliy2'
```

### 启用、禁用表

- 启用表：`enable 'test'`
- 禁用表：`disable 'test'`
- 检查表是否被启用：`is_enabled 'test'`
- 检查表是否被禁用：`is_disabled 'test'`

### 删除表

注意：删除表前需要先禁用表

```shell
disable 'test'
drop 'test'
```

### 修改表

#### 添加列族

**命令格式**： alter '表名', '列族名'

```shell
alter 'test', 'teacherInfo'
```

#### 删除列族

**命令格式**：alter '表名', {NAME => '列族名', METHOD => 'delete'}

```shell
alter 'test', {NAME => 'teacherInfo', METHOD => 'delete'}
```

#### 更改列族存储版本的限制

默认情况下，列族只存储一个版本的数据，如果需要存储多个版本的数据，则需要修改列族的属性。修改后可通过 `desc` 命令查看。

```shell
alter 'test',{NAME=>'columnFamliy1',VERSIONS=>3}
```

### 查看表

- 查看所有表：`list`
- 查看表的详细信息：`describe 'test'`
- 检查表是否存在：`exists 'test'`

## 增删改

### 插入数据

**命令格式**：`put '表名', '行键','列族:列','值'`

**注意：如果新增数据的行键值、列族名、列名与原有数据完全相同，则相当于更新操作**

```shell
put 'test', 'rowkey1', 'columnFamliy1:a', 'valueA'
put 'test', 'rowkey1', 'columnFamliy1:b', 'valueB'
put 'test', 'rowkey1', 'columnFamliy1:c', 'valueC'

put 'test', 'rowkey2', 'columnFamliy1:a', 'valueA'
put 'test', 'rowkey2', 'columnFamliy1:b', 'valueB'
put 'test', 'rowkey2', 'columnFamliy1:c', 'valueC'

put 'test', 'rowkey3', 'columnFamliy1:a', 'valueA'
put 'test', 'rowkey3', 'columnFamliy1:b', 'valueB'
put 'test', 'rowkey3', 'columnFamliy1:c', 'valueC'

put 'test', 'rowkey1', 'columnFamliy2:a', 'valueA'
put 'test', 'rowkey1', 'columnFamliy2:b', 'valueB'
put 'test', 'rowkey1', 'columnFamliy2:c', 'valueC'
```

### 获取指定行、列族、列

- 获取指定行中所有列的数据信息：`get 'test','rowkey2'`
- 获取指定行中指定列族下所有列的数据信息：`get 'test','rowkey2','columnFamliy1'`
- 获取指定行中指定列的数据信息：`get 'test','rowkey2','columnFamliy1:a'`

### 删除指定行、列

- 删除指定行：`delete 'test','rowkey2'`
- 删除指定行中指定列的数据：`delete 'test','rowkey2','columnFamliy1:a'`

## 查询

hbase 中访问数据有两种基本的方式：

- 按指定 rowkey 获取数据：`get` 方法；
- 按指定条件获取数据：`scan` 方法。

`scan` 可以设置 begin 和 end 参数来访问一个范围内所有的数据。get 本质上就是 begin 和 end 相等的一种特殊的 scan。

### get 查询

- 获取指定行中所有列的数据信息：`get 'test','rowkey2'`
- 获取指定行中指定列族下所有列的数据信息：`get 'test','rowkey2','columnFamliy1'`
- 获取指定行中指定列的数据信息：`get 'test','rowkey2','columnFamliy1:a'`

### scan 查询

#### 查询整表数据

```shell
scan 'test'
```

#### 查询指定列簇的数据

```shell
scan 'test', {COLUMN=>'columnFamliy1'}
```

#### 条件查询

```shell
# 查询指定列的数据
scan 'test', {COLUMNS=> 'columnFamliy1:a'}
```

除了列 `（COLUMNS）` 修饰词外，HBase 还支持 `Limit`（限制查询结果行数），`STARTROW`（`ROWKEY` 起始行，会先根据这个 `key` 定位到 `region`，再向后扫描）、`STOPROW`(结束行)、`TIMERANGE`（限定时间戳范围）、`VERSIONS`（版本数）、和 `FILTER`（按条件过滤行）等。

如下代表从 `rowkey2` 这个 `rowkey` 开始，查找下两个行的最新 3 个版本的 name 列的数据：

```shell
scan 'test', {COLUMNS=> 'columnFamliy1:a',STARTROW => 'rowkey2',STOPROW => 'rowkey3',LIMIT=>2, VERSIONS=>3}
```

#### 条件过滤

Filter 可以设定一系列条件来进行过滤。如我们要查询值等于 24 的所有数据：

```shell
scan 'test', FILTER=>"ValueFilter(=,'binary:24')"
```

值包含 valueA 的所有数据：

```shell
scan 'test', FILTER=>"ValueFilter(=,'substring:valueA')"
```

列名中的前缀为 b 的：

```shell
scan 'test', FILTER=>"ColumnPrefixFilter('b')"
```

FILTER 中支持多个过滤条件通过括号、AND 和 OR 进行组合：

```shell
# 列名中的前缀为 b 且列值中包含1998的数据
scan 'test', FILTER=>"ColumnPrefixFilter('b') AND ValueFilter ValueFilter(=,'substring:A')"
```

`PrefixFilter` 用于对 Rowkey 的前缀进行判断：

```shell
scan 'test', FILTER=>"PrefixFilter('wr')"
```

## 参考资料

- [Hbase 常用 Shell 命令](https://github.com/heibaiying/BigData-Notes/blob/master/notes/Hbase_Shell.md)
