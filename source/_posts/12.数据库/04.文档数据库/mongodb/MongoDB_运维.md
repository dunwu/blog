---
icon: logos:mongodb
title: MongoDB 运维
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202503072222372.png
date: 2020-09-09 20:47:14
categories:
  - 数据库
  - 文档数据库
  - mongodb
tags:
  - 数据库
  - 文档数据库
  - mongodb
  - 运维
permalink: /pages/79c04432/
---

# MongoDB 运维

::: info 概述

本文介绍了 MongoDB 的基本安装、备份和恢复、数据导入导出。

:::

<!-- more -->

## MongoDB 安装

### Windows

（1）下载并解压到本地

进入官网下载地址：[**官方下载地址**](https://www.mongodb.com/try/download/community) ，选择合适的版本下载。

（2）创建数据目录

MongoDB 将数据目录存储在 db 目录下。但是这个数据目录不会主动创建，我们在安装完成后需要创建它。

例如：`D:\Tools\Server\mongodb\mongodb-4.4.0\data\db`

（3）运行 MongoDB 服务

```shell
mongod --dbpath D:\Tools\Server\mongodb\mongodb-4.4.0\data\db
```

（4）客户端连接 MongoDB

可以在命令窗口中运行 mongo.exe 命令即可连接上 MongoDB

（5）配置 MongoDB 服务

### Linux

（1）使用安装包安装

安装前我们需要安装各个 Linux 平台依赖包。

**Red Hat/CentOS：**

```
sudo yum install libcurl openssl
```

**Ubuntu 18.04 LTS ("Bionic")/Debian 10 "Buster"：**

```
sudo apt-get install libcurl4 openssl
```

**Ubuntu 16.04 LTS ("Xenial")/Debian 9 "Stretch"：**

```
sudo apt-get install libcurl3 openssl
```

（2）创建数据目录

默认情况下 MongoDB 启动后会初始化以下两个目录：

- 数据存储目录：/var/lib/mongodb
- 日志文件目录：/var/log/mongodb

我们在启动前可以先创建这两个目录并设置当前用户有读写权限：

```shell
sudo mkdir -p /var/lib/mongo
sudo mkdir -p /var/log/mongodb
sudo chown `whoami` /var/lib/mongo     # 设置权限
sudo chown `whoami` /var/log/mongodb   # 设置权限
```

（3）运行 MongoDB 服务

```shell
mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork
```

打开 /var/log/mongodb/mongod.log 文件看到以下信息，说明启动成功。

```shell
# tail -10f /var/log/mongodb/mongod.log
2020-07-09T12:20:17.391+0800 I  NETWORK  [listener] Listening on /tmp/mongodb-27017.sock
2020-07-09T12:20:17.392+0800 I  NETWORK  [listener] Listening on 127.0.0.1
2020-07-09T12:20:17.392+0800 I  NETWORK  [listener] waiting for connections on port 27017
```

（4）客户端连接 MongoDB

```shell
cd /usr/local/mongodb4/bin
./mongo
```

> [Linux 安装脚本](https://github.com/dunwu/linux-tutorial/tree/master/codes/linux/soft)

### 设置用户名、密码

```shell
> use admin
switched to db admin
> db.createUser({"user":"root","pwd":"root","roles":[{"role":"userAdminAnyDatabase","db":"admin"}]})
Successfully added user: {
        "user" : "root",
        "roles" : [
                {
                        "role" : "userAdminAnyDatabase",
                        "db" : "admin"
                }
        ]
}
>
```

## 备份和恢复

### 数据备份

在 Mongodb 中，使用 `mongodump` 命令来备份 MongoDB 数据。该命令可以导出所有数据到指定目录中。

`mongodump` 命令可以通过参数指定导出的数据量级转存的服务器。

mongodump 命令语法如下：

```
mongodump -h dbhost -d dbname -o dbdirectory
```

- -h：MongDB 所在服务器地址，例如：127.0.0.1，当然也可以指定端口号：127.0.0.1:27017

- -d：需要备份的数据库实例，例如：test

- -o：备份的数据存放位置，例如：c:\data\dump，当然该目录需要提前建立，在备份完成后，系统自动在 dump 目录下建立一个 test 目录，这个目录里面存放该数据库实例的备份数据。

`mongodump` 命令可选参数列表如下所示：

| 语法                                              | 描述                           | 实例                                             |
| :------------------------------------------------ | :----------------------------- | :----------------------------------------------- |
| mongodump --host HOST_NAME --port PORT_NUMBER     | 该命令将备份所有 MongoDB 数据  | mongodump --host runoob.com --port 27017         |
| mongodump --dbpath DB_PATH --out BACKUP_DIRECTORY |                                | mongodump --dbpath /data/db/ --out /data/backup/ |
| mongodump --collection COLLECTION --db DB_NAME    | 该命令将备份指定数据库的集合。 | mongodump --collection mycol --db test           |

【示例】备份全量数据

```shell
$ mongodump -h 127.0.0.1 --port 27017 -o test2
...
2020-09-11T11:55:58.086+0800    done dumping test.company (18801 documents)
2020-09-11T11:56:00.725+0800    [#############...........]  test.people  559101/1000000  (55.9%)
2020-09-11T11:56:03.725+0800    [###################.....]  test.people  829496/1000000  (82.9%)
2020-09-11T11:56:06.725+0800    [#####################...]  test.people  884614/1000000  (88.5%)
2020-09-11T11:56:08.088+0800    [########################]  test.people  1000000/1000000  (100.0%)
2020-09-11T11:56:08.350+0800    done dumping test.people (1000000 documents)
```

【示例】备份指定数据库

```shell
mongodump -h 127.0.0.1 --port 27017 -d admin -o test3
```

### 数据恢复

mongodb 使用 `mongorestore` 命令来恢复备份的数据。

`mongorestore` 命令语法如下：

```shell
> mongorestore -h <hostname><:port> -d dbname <path>
```

- `--host <:port>`, `-h <:port>`：MongoDB 所在服务器地址，默认为： localhost:27017

- `--db` , `-d` ：需要恢复的数据库实例，例如：test，当然这个名称也可以和备份时候的不一样，比如 test2

- `--drop`：恢复的时候，先删除当前数据，然后恢复备份的数据。就是说，恢复后，备份后添加修改的数据都会被删除，慎用哦！

- `<path>`：mongorestore 最后的一个参数，设置备份数据所在位置，例如：c:\data\dump\test。你不能同时指定 `<path>` 和 `--dir` 选项，`--dir` 也可以设置备份目录。

- `--dir`：指定备份的目录。你不能同时指定 `<path>` 和 `--dir` 选项。

【示例】

```shell
$ mongorestore -h 127.0.0.1 --port 27017 -d test --dir test --drop
...
2020-09-11T11:46:16.053+0800    finished restoring test.tweets (966 documents, 0 failures)
2020-09-11T11:46:18.256+0800    [###.....................]  test.people  164MB/1.03GB  (15.6%)
2020-09-11T11:46:21.255+0800    [########................]  test.people  364MB/1.03GB  (34.6%)
2020-09-11T11:46:24.256+0800    [############............]  test.people  558MB/1.03GB  (53.0%)
2020-09-11T11:46:27.255+0800    [###############.........]  test.people  700MB/1.03GB  (66.5%)
2020-09-11T11:46:30.257+0800    [###################.....]  test.people  846MB/1.03GB  (80.3%)
2020-09-11T11:46:33.255+0800    [######################..]  test.people  990MB/1.03GB  (94.0%)
2020-09-11T11:46:34.542+0800    [########################]  test.people  1.03GB/1.03GB  (100.0%)
2020-09-11T11:46:34.543+0800    no indexes to restore
2020-09-11T11:46:34.543+0800    finished restoring test.people (1000000 documents, 0 failures)
2020-09-11T11:46:34.544+0800    1000966 document(s) restored successfully. 0 document(s) failed to restore.
```

## 导入导出

`mongoimport` 和 `mongoexport` 并不能可靠地保存所有的富文本 BSON 数据类型，因为 JSON 仅能代表一种 BSON 支持的子集类型。因此，数据用这些工具导出导入或许会丢失一些精确程度。

### 导入操作

在 MongoDB 中，使用 `mongoimport` 来导入数据。 默认情况下，`mongoimport` 会将数据导入到本地主机端口 27017 上的 MongoDB 实例中。要将数据导入在其他主机或端口上运行的 MongoDB 实例中，请通过包含 `--host` 和 `--port` 选项来指定主机名或端口。 使用 `--drop` 选项删除集合（如果已经存在）。 这样可以确保该集合仅包含您要导入的数据。

语法格式：

```bash
mongoimport -h IP --port 端口 -u 用户名 -p 密码 -d 数据库 -c 表名 --type 类型 --headerline --upsert --drop 文件名
```

【示例】导入表数据

```shell
$ mongoimport -h 127.0.0.1 --port 27017 -d test -c book --drop test/book.dat
2020-09-11T10:53:56.359+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T10:53:56.372+0800    dropping: test.book
2020-09-11T10:53:56.628+0800    431 document(s) imported successfully. 0 document(s) failed to import.
```

【示例】从 json 文件中导入表数据

```shell
$ mongoimport -h 127.0.0.1 --port 27017 -d test -c student --upsert test/student.json
2020-09-11T11:02:55.907+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T11:02:56.068+0800    200 document(s) imported successfully. 0 document(s) failed to import.
```

【示例】从 csv 文件中导入表数据

```shell
$ mongoimport -h 127.0.0.1 --port 27017 -d test -c product --type csv --headerline test/product.csv
2020-09-11T11:07:49.788+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T11:07:51.051+0800    11 document(s) imported successfully. 0 document(s) failed to import.
```

【示例】导入部分表字段数据

```shell
$ mongoimport -h 127.0.0.1 --port 27017 -d test -c product --type json --upsertFields name,price test/product.json
2020-09-11T11:14:05.410+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T11:14:05.612+0800    11 document(s) imported successfully. 0 document(s) failed to import.
```

### 导出操作

语法格式：

```shell
mongoexport -h <IP> --port <端口> -u <用户名> -p <密码> -d <数据库> -c <表名> -f <字段> -q <条件导出> --csv -o <文件名>
```

- `-f`：导出指字段，以逗号分割，`-f name,email,age` 导出 name,email,age 这三个字段
- `-q`：可以根查询条件导出，`-q '{ "uid" : "100" }'` 导出 uid 为 100 的数据
- `--csv`：表示导出的文件格式为 csv 的，这个比较有用，因为大部分的关系型数据库都是支持 csv，在这里有共同点

【示例】导出整张表

```shell
$ mongoexport -h 127.0.0.1 --port 27017 -d test -c product -o test/product.dat
2020-09-11T10:44:23.161+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T10:44:23.177+0800    exported 11 records
```

【示例】导出表到 json 文件

```shell
$ mongoexport -h 127.0.0.1 --port 27017 -d test -c product --type json -o test/product.json
2020-09-11T10:49:52.735+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T10:49:52.750+0800    exported 11 records
```

【示例】导出表中部分字段到 csv 文件

```shell
$ mongoexport -h 127.0.0.1 --port 27017 -d test -c product --type csv -f name,price -o test/product.csv
2020-09-11T10:47:33.160+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T10:47:33.176+0800    exported 11 records
```

## 参考资料

- [MongoDB 官网](https://www.mongodb.com/)
- [MongoDB Github](https://github.com/mongodb/mongo)
- [MongoDB 官方免费教程](https://learn.mongodb.com/)
- [MongoDB 教程](https://www.runoob.com/mongodb/mongodb-tutorial.html)