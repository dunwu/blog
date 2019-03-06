---
title: HBase 命令
date: 2019-03-06
---

# HBase 命令

<!-- TOC depthFrom:2 depthTo:3 -->

- [1. 连接 HBase](#1-连接-hbase)
- [2. 查询帮助](#2-查询帮助)
- [3. 创建表](#3-创建表)
- [4. 查看表信息](#4-查看表信息)
- [5. 查看表详细信息](#5-查看表详细信息)
- [6. 向表中写数据](#6-向表中写数据)
- [7. 扫描表](#7-扫描表)
- [8. 查询 row](#8-查询-row)
- [9. 禁用、启用表](#9-禁用启用表)
- [10. 删除表](#10-删除表)
- [11. 停止 HBase](#11-停止-hbase)

<!-- /TOC -->

## 1. 连接 HBase

```bash
$ ./bin/hbase shell
hbase(main):001:0>
```

## 2. 查询帮助

```bash
help
```

## 3. 创建表

```bash
create 'table1','columnFamliy1','columnFamliy2'
```

说明：

创建一张名为 table1 的 HBase 表，columnFamliy1、columnFamliy2 是 table1 表的列族。

## 4. 查看表信息

```bash
list 'table1'
```

## 5. 查看表详细信息

```bash
describe 'table1'
```

## 6. 向表中写数据

```bash
put 'table1', 'row1', 'columnFamliy1:a', 'valueA'
put 'table1', 'row1', 'columnFamliy1:b', 'valueB'
put 'table1', 'row1', 'columnFamliy1:c', 'valueC'

put 'table1', 'row2', 'columnFamliy1:a', 'valueA'
put 'table1', 'row2', 'columnFamliy1:b', 'valueB'
put 'table1', 'row2', 'columnFamliy1:c', 'valueC'

put 'table1', 'row1', 'columnFamliy2:a', 'valueA'
put 'table1', 'row1', 'columnFamliy2:b', 'valueB'
put 'table1', 'row1', 'columnFamliy2:c', 'valueC'
```

## 7. 扫描表

```bash
hbase> scan 'hbase:meta'
hbase> scan 'hbase:meta', {COLUMNS => 'info:regioninfo'}
hbase> scan 'ns1:
hbase> scan 't1', {COLUMNS => ['c1', 'c2'], LIMIT => 10, STARTROW => 'xyz'}
hbase> scan 't1', {COLUMNS => 'c1', TIMERANGE => [1303668804, 1303668904]}
hbase> scan 't1', {REVERSED => true}
hbase> scan 't1', {ALL_METRICS => true}
hbase> scan 't1', {METRICS => ['RPC_RETRIES', 'ROWS_FILTERED']}
hbase> scan 't1', {ROWPREFIXFILTER => 'row2', FILTER => "
  (QualifierFilter (>=, 'binary:xyz')) AND (TimestampsFilter ( 123, 456))"}
hbase> scan 't1', {FILTER =>
  org.apache.hadoop.hbase.filter.ColumnPaginationFilter.new(1, 0)}
hbase> scan 't1', {CONSISTENCY => 'TIMELINE'}
For setting the Operation Attributes 
hbase> scan 't1', { COLUMNS => ['c1', 'c2'], ATTRIBUTES => {'mykey' => 'myvalue'}}
hbase> scan 't1', { COLUMNS => ['c1', 'c2'], AUTHORIZATIONS => ['PRIVATE','SECRET']}
For experts, there is an additional option -- CACHE_BLOCKS -- which
switches block caching for the scanner on (true) or off (false).  By
default it is enabled.  Examples:

hbase> scan 't1', {COLUMNS => ['c1', 'c2'], CACHE_BLOCKS => false}
```

## 8. 查询 row

```bash
get 'table1', 'row1'
get 'table1', 'row1', 'columnFamliy1'
get 'table1', 'row1', 'columnFamliy1:a'
```

## 9. 禁用、启用表

```bash
hbase(main):008:0> disable 'test'
0 row(s) in 1.1820 seconds

hbase(main):009:0> enable 'test'
0 row(s) in 0.1770 seconds
```

## 10. 删除表

```bash
hbase(main):011:0> drop 'test'
0 row(s) in 0.1370 seconds
```

## 11. 停止 HBase

```bash
$ ./bin/stop-hbase.sh
stopping hbase....................
$
```
