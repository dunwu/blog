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
hbase(main):001:0> help
HBase Shell, version 1.3.1, r930b9a55528fe45d8edce7af42fef2d35e77677a, Thu Apr  6 19:36:54 PDT 2017
Type 'help "COMMAND"', (e.g. 'help "get"' -- the quotes are necessary) for help on a specific command.
Commands are grouped. Type 'help "COMMAND_GROUP"', (e.g. 'help "general"') for help on a command group
...
```

## 3. 创建表

```
hbase(main):001:0> create 'test', 'cf'
0 row(s) in 0.4170 seconds

=> Hbase::Table - test
```

## 4. 查看表信息

```
hbase(main):002:0> list 'test'
TABLE
test
1 row(s) in 0.0180 seconds

=> ["test"]
```

## 5. 查看表详细信息

```
hbase(main):003:0> describe 'test'
Table test is ENABLED
test
COLUMN FAMILIES DESCRIPTION
{NAME => 'cf', VERSIONS => '1', EVICT_BLOCKS_ON_CLOSE => 'false', NEW_VERSION_BEHAVIOR => 'false', KEEP_DELETED_CELLS => 'FALSE', CACHE_DATA_ON_WRITE =>
'false', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', MIN_VERSIONS => '0', REPLICATION_SCOPE => '0', BLOOMFILTER => 'ROW', CACHE_INDEX_ON_WRITE => 'f
alse', IN_MEMORY => 'false', CACHE_BLOOMS_ON_WRITE => 'false', PREFETCH_BLOCKS_ON_OPEN => 'false', COMPRESSION => 'NONE', BLOCKCACHE => 'true', BLOCKSIZE
 => '65536'}
1 row(s)
Took 0.9998 seconds
```

## 6. 向表中写数据

```
hbase(main):003:0> put 'test', 'row1', 'cf:a', 'value1'
0 row(s) in 0.0850 seconds

hbase(main):004:0> put 'test', 'row2', 'cf:b', 'value2'
0 row(s) in 0.0110 seconds

hbase(main):005:0> put 'test', 'row3', 'cf:c', 'value3'
0 row(s) in 0.0100 seconds
```

## 7. 扫描表

```
hbase(main):006:0> scan 'test'
ROW                                      COLUMN+CELL
 row1                                    column=cf:a, timestamp=1421762485768, value=value1
 row2                                    column=cf:b, timestamp=1421762491785, value=value2
 row3                                    column=cf:c, timestamp=1421762496210, value=value3
3 row(s) in 0.0230 seconds
```

## 8. 查询 row

```
hbase(main):007:0> get 'test', 'row1'
COLUMN                                   CELL
 cf:a                                    timestamp=1421762485768, value=value1
1 row(s) in 0.0350 seconds
```

## 9. 禁用、启用表

```
hbase(main):008:0> disable 'test'
0 row(s) in 1.1820 seconds

hbase(main):009:0> enable 'test'
0 row(s) in 0.1770 seconds
```

## 10. 删除表

```
hbase(main):011:0> drop 'test'
0 row(s) in 0.1370 seconds
```

## 11. 停止 HBase

```
$ ./bin/stop-hbase.sh
stopping hbase....................
$
```
