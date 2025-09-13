---
icon: logos:mysql
title: MySQL 运维
cover: https://miro.medium.com/v2/resize:fit:720/format:webp/0*7EM_33uoR9UdASR2.png
date: 2019-11-26 21:37:17
categories:
  - 数据库
  - 关系型数据库
  - mysql
tags:
  - 数据库
  - 关系型数据库
  - mysql
  - 运维
permalink: /pages/02efbd5a/
---

# MySQL 运维

::: info 概述

如果你的公司有 DBA，那么我恭喜你，你可以无视 MySQL 运维。如果你的公司没有 DBA，那你就好好学两手 MySQL 基本运维操作，行走江湖，防身必备。

:::

## MySQL 安装

### Windows 安装

（1）下载 MySQL 5.7 免安装版

下载地址：https://dev.mysql.com/downloads/mysql/5.7.html#downloads

（2）解压并创建 my.ini 在根目录

my.ini 文件示例：

```ini
[mysqld]
#设置 3306 端口
port = 3306
# 设置 mysql 的安装目录 这块换成自己解压的路径
basedir=D:\\Tools\\DB\\mysql\\mysql-5.7.31
# 允许最大连接数
max_connections=200
# 服务端使用的字符集默认为 8 比特编码的 latin1 字符集
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB

[client]
# 设置 mysql 客户端默认字符集
default-character-set=utf8
```

（3）执行安装命令

在控制台 CMD 中依次执行以下安装命令

```
cd D:\\Tools\\DB\\mysql\\mysql-5.7.31
mysqld --initialize
mysqld -install
```

说明：

- `mysqld --initialize` 会自动初始化创建 data 文件夹并初始化 mysql。
- `mysqld -install` 会安装 mysql 服务。

（4）启动服务

在控制台执行 `net start mysql` 启动服务。

### CentOS 安装

> 本文仅介绍 rpm 安装方式

#### 安装 mysql yum 源

官方下载地址：https://dev.mysql.com/downloads/repo/yum/

（1）下载 yum 源

```shell
wget https://dev.mysql.com/get/mysql80-community-release-el7-1.noarch.rpm
```

（2）安装 yum repo 文件并更新 yum 缓存

```shell
rpm -ivh mysql80-community-release-el7-1.noarch.rpm
```

执行结果：

会在 /etc/yum.repos.d/ 目录下生成两个 repo 文件

```shell
$ ls | grep mysql
mysql-community.repo
mysql-community-source.repo
```

更新 yum：

```shell
yum clean all
yum makecache
```

（3）查看 rpm 安装状态

```shell
$ yum search mysql | grep server
mysql-community-common.i686 : MySQL database common files for server and client
mysql-community-common.x86_64 : MySQL database common files for server and
mysql-community-test.x86_64 : Test suite for the MySQL database server
                       : administering MySQL servers
mysql-community-server.x86_64 : A very fast and reliable SQL database server
```

通过 yum 安装 mysql 有几个重要目录：

```
## 配置文件
/etc/my.cnf
## 数据库目录
/var/lib/mysql/
## 配置文件
/usr/share/mysql（mysql.server 命令及配置文件）
## 相关命令
/usr/bin（mysqladmin mysqldump 等命令）
## 启动脚本
/usr/lib/systemd/system/mysqld.service （注册为 systemd 服务）
```

（4）安装 mysql 服务器

```shell
yum install mysql-community-server
```

#### mysql 服务管理

通过 yum 方式安装 mysql 后，本地会有一个名为 `mysqld` 的 systemd 服务。

其服务管理十分简便：

```shell
## 查看状态
systemctl status mysqld
## 启用服务
systemctl enable mysqld
## 禁用服务
systemctl disable mysqld
## 启动服务
systemctl start mysqld
## 重启服务
systemctl restart mysqld
## 停止服务
systemctl stop mysqld
```

### 初始化数据库密码

查看一下初始密码

```shell
$ grep "password" /var/log/mysqld.log
2018-09-30T03:13:41.727736Z 5 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: %:lt+srWu4k1
```

执行命令：

```shell
mysql -uroot -p<临时密码>
```

输入临时密码，进入 mysql，如果要修改密码，执行以下指令：

```shell
ALTER user 'root'@'localhost' IDENTIFIED BY '你的密码';
```

注：密码强度默认为中等，大小写字母、数字、特殊符号，只有修改成功后才能修改配置再设置更简单的密码

### 配置远程访问

```sql
CREATE USER 'root'@'%' IDENTIFIED BY '你的密码';
GRANT ALL ON *.* TO 'root'@'%';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '你的密码';
FLUSH PRIVILEGES;
```

### 跳过登录认证

```shell
vim /etc/my.cnf
```

在 [mysqld] 下面加上 skip-grant-tables

作用是登录时跳过登录认证，换句话说就是 root 什么密码都可以登录进去。

执行 `systemctl restart mysqld`，重启 mysql

## MySQL 管理

### 客户端连接

语法：`mysql -h<主机> -P<端口> -u<用户名> -p<密码>`

如果没有显式指定密码，会要求输入密码才能访问。

【示例】连接本地 MySQL

```shell
$ mysql -h 127.0.0.1 -P 3306 -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 13501
Server version: 8.0.19 MySQL Community Server - GPL

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

### 查看连接

连接完成后，如果你没有后续的动作，这个连接就处于空闲状态，你可以在 `show processlist` 命令中看到它。客户端如果太长时间没动静，连接器就会自动将它断开。这个时间是由参数 `wait_timeout` 控制的，默认值是 8 小时。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200714115031.png)

### 创建用户

```sql
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
```

说明：

- username：你将创建的用户名
- host：指定该用户在哪个主机上可以登陆，如果是本地用户可用 localhost，如果想让该用户可以**从任意远程主机登陆**，可以使用通配符`%`
- password：该用户的登陆密码，密码可以为空，如果为空则该用户可以不需要密码登陆服务器

示例：

```sql
CREATE USER 'dog'@'localhost' IDENTIFIED BY '123456';
CREATE USER 'pig'@'192.168.1.101_' IDENDIFIED BY '123456';
CREATE USER 'pig'@'%' IDENTIFIED BY '123456';
CREATE USER 'pig'@'%' IDENTIFIED BY '';
CREATE USER 'pig'@'%';
```

> 注意：在 MySQL 8 中，默认密码验证不再是 `password`。所以在创建用户时，`create user 'username'@'%' identified by 'password';` 客户端是无法连接服务的。
>
> 所以，需要加上 `IDENTIFIED WITH mysql_native_password`，例如：`CREATE USER 'slave'@'%' IDENTIFIED WITH mysql_native_password BY '123456';`

### 查看用户

```sql
-- 查看所有用户
SELECT DISTINCT CONCAT('User: ''', user, '''@''', host, ''';') AS query
FROM mysql.user;
```

### 授权

命令：

```sql
GRANT privileges ON databasename.tablename TO 'username'@'host'
```

说明：

- privileges：用户的操作权限，如`SELECT`，`INSERT`，`UPDATE`等，如果要授予所的权限则使用`ALL`
- databasename：数据库名
- tablename：表名，如果要授予该用户对所有数据库和表的相应操作权限则可用`*`表示，如`*.*`

示例：

```sql
GRANT SELECT, INSERT ON test.user TO 'pig'@'%';
GRANT ALL ON *.* TO 'pig'@'%';
GRANT ALL ON maindataplus.* TO 'pig'@'%';
```

注意：

用以上命令授权的用户不能给其它用户授权，如果想让该用户可以授权，用以下命令：

```sql
-- 为指定用户配置指定权限
GRANT privileges ON databasename.tablename TO 'username'@'host' WITH GRANT OPTION;
-- 为 root 用户分配所有权限
GRANT ALL ON *.* TO 'root'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION;
```

### 撤销授权

命令：

```
REVOKE privilege ON databasename.tablename FROM 'username'@'host';
```

说明：

privilege, databasename, tablename：同授权部分

例子：

```sql
REVOKE SELECT ON *.* FROM 'pig'@'%';
```

注意：

假如你在给用户`'pig'@'%'`授权的时候是这样的（或类似的）：`GRANT SELECT ON test.user TO 'pig'@'%'`，则在使用`REVOKE SELECT ON *.* FROM 'pig'@'%';`命令并不能撤销该用户对 test 数据库中 user 表的`SELECT` 操作。相反，如果授权使用的是`GRANT SELECT ON *.* TO 'pig'@'%';`则`REVOKE SELECT ON test.user FROM 'pig'@'%';`命令也不能撤销该用户对 test 数据库中 user 表的`Select`权限。

具体信息可以用命令`SHOW GRANTS FOR 'pig'@'%';` 查看。

### 查看授权

```SQL
-- 查看用户权限
SHOW GRANTS FOR 'root'@'%';
```

### 更改用户密码

```sql
SET PASSWORD FOR 'username'@'host' = PASSWORD('newpassword');
```

如果是当前登陆用户用：

```sql
SET PASSWORD = PASSWORD("newpassword");
```

示例：

```sql
SET PASSWORD FOR 'pig'@'%' = PASSWORD("123456");
```

### 备份与恢复

MySQL 备份数据使用 mysqldump 命令。

mysqldump 将数据库中的数据备份成一个文本文件，表的结构和表中的数据将存储在生成的文本文件中。

备份：

#### 备份一个数据库

语法：

```sql
mysqldump -h <host> -P<port> -u<username> -p<database> [<table1> <table2> ...] > backup.sql
```

- **`host`** - MySQL Server 的 host
- **`port`** - MySQL Server 的端口
- **`username`** - 数据库用户
- **`dbname`** - 数据库名称
- table1 和 table2 参数表示需要备份的表的名称，为空则整个数据库备份；
- BackupName.sql 参数表设计备份文件的名称，文件名前面可以加上一个绝对路径。通常将数据库被分成一个后缀名为 sql 的文件

#### 备份多个数据库

```sql
mysqldump -u <username> -p --databases <database1> <database2> ... > backup.sql
```

#### 备份所有数据库

```sql
mysqldump -u <username> -p --all-databases > backup.sql
```

#### 恢复一个数据库

MySQL 恢复数据使用 mysql 命令。

语法：

```sql
mysql -h <host> -P<port> -u<username> -p<database> < backup.sql
```

#### 恢复所有数据库

```sql
mysql -u<username> -p --all-databases < backup.sql
```

### 卸载

（1）查看已安装的 mysql

```shell
$ rpm -qa | grep -i mysql
perl-DBD-MySQL-4.023-6.el7.x86_64
mysql80-community-release-el7-1.noarch
mysql-community-common-8.0.12-1.el7.x86_64
mysql-community-client-8.0.12-1.el7.x86_64
mysql-community-libs-compat-8.0.12-1.el7.x86_64
mysql-community-libs-8.0.12-1.el7.x86_64
```

（2）卸载 mysql

```shell
yum remove mysql-community-server.x86_64
```

### 主从节点部署

假设需要配置一个主从 MySQL 服务器环境

- master 节点：192.168.8.10
- slave 节点：192.168.8.11

#### 主节点上的操作

（1）修改配置并重启

执行 `vi /etc/my.cnf` ，添加如下配置：

```ini
[mysqld]
server-id=1
log_bin=/var/lib/mysql/binlog
```

- `server-id` - 服务器 ID 号。在主从架构中，每台机器的 ID 必须唯一。
- `log_bin` - 同步的日志路径及文件名，一定注意这个目录要是 mysql 有权限写入的；

修改后，重启 mysql 使配置生效：

```sql
systemctl restart mysql
```

（2）创建用于同步的用户

进入 mysql 命令控制台：

```
$ mysql -u root -p
Password:
```

执行以下 SQL：

```sql
-- a. 创建 slave 用户
CREATE USER 'slave'@'%' IDENTIFIED WITH mysql_native_password BY '密码';
-- 为 slave 赋予 REPLICATION SLAVE 权限
GRANT REPLICATION SLAVE ON *.* TO 'slave'@'%';

-- b. 或者，创建 slave 用户，并指定该用户能在任意主机上登录
-- 如果有多个从节点，又想让所有从节点都使用统一的用户名、密码认证，可以考虑这种方式
CREATE USER 'slave'@'%' IDENTIFIED WITH mysql_native_password BY '密码';
GRANT REPLICATION SLAVE ON *.* TO 'slave'@'%';

-- 刷新授权表信息
FLUSH PRIVILEGES;
```

> 注意：在 MySQL 8 中，默认密码验证不再是 `password`。所以在创建用户时，`create user 'username'@'%' identified by 'password';` 客户端是无法连接服务的。所以，需要加上 `IDENTIFIED WITH mysql_native_password BY 'password'`

补充用户管理 SQL:

```sql
-- 查看所有用户
SELECT DISTINCT CONCAT('User: ''', user, '''@''', host, ''';') AS query
FROM mysql.user;

-- 查看用户权限
SHOW GRANTS FOR 'root'@'%';

-- 创建用户
-- a. 创建 slave 用户，并指定该用户只能在主机 192.168.8.11 上登录
CREATE USER 'slave'@'192.168.8.11' IDENTIFIED WITH mysql_native_password BY '密码';
-- 为 slave 赋予 REPLICATION SLAVE 权限
GRANT REPLICATION SLAVE ON *.* TO 'slave'@'192.168.8.11';

-- 删除用户
DROP USER 'slave'@'192.168.8.11';
```

（3）加读锁

为了主库与从库的数据保持一致，我们先为 mysql 加入读锁，使其变为只读。

```sql
mysql> FLUSH TABLES WITH READ LOCK;
```

（4）查看主节点状态

```sql
mysql> show master status;
+------------------+----------+--------------+---------------------------------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB                            | Executed_Gtid_Set |
+------------------+----------+--------------+---------------------------------------------+-------------------+
| mysql-bin.000001 |     4202 |              | mysql,information_schema,performance_schema |                   |
+------------------+----------+--------------+---------------------------------------------+-------------------+
1 row in set (0.00 sec)
```

> 注意：需要记录下 `File` 和 `Position`，后面会用到。

（5）导出 sql

```shell
mysqldump -u root -p --all-databases --master-data > dbdump.sql
```

（6）解除读锁

```sql
mysql> UNLOCK TABLES;
```

（7）将 sql 远程传送到从节点上

```
scp dbdump.sql root@192.168.8.11:/home
```

#### 从节点上的操作

（1）修改配置并重启

执行 `vi /etc/my.cnf` ，添加如下配置：

```ini
[mysqld]
server-id=2
log_bin=/var/lib/mysql/binlog
```

- `server-id` - 服务器 ID 号。在主从架构中，每台机器的 ID 必须唯一。
- `log_bin` - 同步的日志路径及文件名，一定注意这个目录要是 mysql 有权限写入的；

修改后，重启 mysql 使配置生效：

```shell
systemctl restart mysql
```

（2）导入 sql

```shell
mysql -u root -p < /home/dbdump.sql
```

（3）在从节点上建立与主节点的连接

进入 mysql 命令控制台：

```
$ mysql -u root -p
Password:
```

执行以下 SQL：

```sql
-- 停止从节点服务
STOP SLAVE;

-- 注意：MASTER_USER 和
CHANGE MASTER TO
MASTER_HOST='192.168.8.10',
MASTER_USER='slave',
MASTER_PASSWORD='密码',
MASTER_LOG_FILE='binlog.000001',
MASTER_LOG_POS=4202;
```

- `MASTER_LOG_FILE` 和 `MASTER_LOG_POS` 参数要分别与 `show master status` 指令获得的 `File` 和 `Position` 属性值对应。
- `MASTER_HOST` 是主节点的 HOST。
- `MASTER_USER` 和 `MASTER_PASSWORD` 是在主节点上注册的用户及密码。

（4）启动 slave 进程

```sql
mysql> start slave;
```

（5）查看主从同步状态

```sql
mysql> show slave status\G;
```

说明：如果以下两项参数均为 YES，说明配置正确。

- `Slave_IO_Running`
- `Slave_SQL_Running`

（6）将从节点设为只读

```sql
mysql> set global read_only=1;
mysql> set global super_read_only=1;
mysql> show global variables like "%read_only%";
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| innodb_read_only      | OFF   |
| read_only             | ON    |
| super_read_only       | ON    |
| transaction_read_only | OFF   |
+-----------------------+-------+
```

> 注：设置 slave 服务器为只读，并不影响主从同步。

### 慢查询

查看慢查询是否开启

```sql
show variables like '%slow_query_log';
```

可以通过 `set global slow_query_log` 命令设置慢查询是否开启：ON 表示开启；OFF 表示关闭。

```sql
set global slow_query_log='ON';
```

查看慢查询时间阈值

```sql
show variables like '%long_query_time%';
```

设置慢查询阈值

```sql
set global long_query_time = 3;
```

### 隔离级别

查看隔离级别：

```sql
mysql> show variables like 'transaction_isolation';

+-----------------------+----------------+

| Variable_name | Value |

+-----------------------+----------------+

| transaction_isolation | READ-COMMITTED |

+-----------------------+----------------+
```

## MySQL 配置

> **_大部分情况下，默认的基本配置已经足够应付大多数场景，不要轻易修改 MySQL 服务器配置，除非你明确知道修改项是有益的。_**
>
> 尽量不要使用 MySQL 的缓存功能，因为其要求每次请求参数完全相同，才能命中缓存。这种方式实际上并不高效，还会增加额外开销，实际业务场景中一般使用 Redis 等 key-value 存储来解决缓存问题，性能远高于 MySQL 的查询缓存。

### 配置文件路径

配置 MySQL 首先要确定配置文件在哪儿。

不同 Linux 操作系统上，MySQL 配置文件路径可能不同。通常的路径为 /etc/my.cnf 或 /etc/mysql/my.cnf 。

如果不知道配置文件路径，可以尝试以下操作：

```shell
# which mysqld
/usr/sbin/mysqld
# /usr/sbin/mysqld --verbose --help | grep -A 1 'Default options'
Default options are read from the following files in the given order:
/etc/my.cnf /etc/mysql/my.cnf /usr/etc/my.cnf ~/.my.cnf
```

### 配置项语法

**MySQL 配置项设置都使用小写，单词之间用下划线或横线隔开（二者是等价的）。**

建议使用固定的风格，这样检索配置项时较为方便。

```shell
# 这两种格式等价
/usr/sbin/mysqld --auto-increment-offset=5
/usr/sbin/mysqld --auto_increment_offset=5
```

### 基本配置模板

一个基本的 MySQL 配置模板大概如下：

```ini
[mysqld]
# GENERAL
# -------------------------------------------------------------------------------
datadir = /var/lib/mysql
socket  = /var/lib/mysql/mysql.sock
pid_file = /var/lib/mysql/mysql.pid
user = mysql
port = 3306
default_storage_engine = InnoDB
default_time_zone = '+8：00'
character_set_server = utf8mb4
collation_server = utf8mb4_0900_ai_ci

# LOG
# -------------------------------------------------------------------------------
log_error = /var/log/mysql/mysql-error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log

# InnoDB
# -------------------------------------------------------------------------------
innodb_buffer_pool_size = <value>
innodb_log_file_size = <value>
innodb_file_per_table = 1
innodb_flush_method = O_DIRECT

# MyIsam
# -------------------------------------------------------------------------------
key_buffer_size = <value>

# OTHER
# -------------------------------------------------------------------------------
tmp_table_size = 32M
max_heap_table_size = 32M
max_connections = <value>
open_files_limit = 65535

[client]
socket  = /var/lib/mysql/mysql.sock
port = 3306
```

### 配置项说明

下面是一个较为详尽的 MySQL 配置文件，各配置项有注释说明：

```ini
[mysqld]
# GENERAL
# -------------------------------------------------------------------------------
datadir = /var/lib/mysql
# socket 文件
socket  = /var/lib/mysql/mysql.sock
# PID 文件
pid_file = /var/lib/mysql/mysql.pid
# 启动 mysql 服务进程的用户
user = mysql
# 服务端口号，默认 3306
port = 3306
default_storage_engine = InnoDB
# 默认时区
default_time_zone = '+8:00'
character_set_server = utf8mb4
collation_server = utf8mb4_0900_ai_ci

# MySQL 服务 ID，单点服务时没必要设置
server-id = 1

# 事务隔离级别，默认为可重复读（REPEATABLE-READ）。（此级别下可能参数很多间隙锁，影响性能，但是修改又影响主从复制及灾难恢复，建议还是修改代码逻辑吧）
# 隔离级别可选项目：READ-UNCOMMITTED READ-COMMITTED REPEATABLE-READ SERIALIZABLE
transaction_isolation = REPEATABLE-READ

# 目录配置
# -------------------------------------------------------------------------------

# mysql 安装根目录
basedir = /usr/local/mysql-5.7.21

# mysql 数据文件所在目录
datadir = /var/lib/mysql

# 临时目录 比如 load data infile 会用到，一般都是使用/tmp
tmpdir = /tmp

# 数据库引擎配置
# -------------------------------------------------------------------------------

# mysql 5.1 之后，默认引擎是 InnoDB
default_storage_engine = InnoDB

# 内存临时表默认引擎，默认 InnoDB
default_tmp_storage_engine = InnoDB

# mysql 5.7 新增特性，磁盘临时表默认引擎，默认 InnoDB
internal_tmp_disk_storage_engine = InnoDB

# 字符集配置
# -------------------------------------------------------------------------------

# 数据库默认字符集，主流字符集支持一些特殊表情符号（特殊表情符占用 4 个字节）
character_set_server = utf8mb4

# 数据库字符集对应一些排序等规则，注意要和 character_set_server 对应
collation-server = utf8mb4_0900_ai_ci

# 设置 client 连接 mysql 时的字符集，防止乱码
# init_connect='SET NAMES utf8'

# 是否对 sql 语句大小写敏感，默认值为 0，1 表示不敏感
lower_case_table_names = 1

# 数据库连接配置
# -------------------------------------------------------------------------------

# 最大连接数，可设最大值 16384，一般考虑根据同时在线人数设置一个比较综合的数字，鉴于该数值增大并不太消耗系统资源，建议直接设 10000
# 如果在访问时经常出现 Too Many Connections 的错误提示，则需要增大该参数值
max_connections = 10000

# 默认值 100，最大错误连接数，如果有超出该参数值个数的中断错误连接，则该主机将被禁止连接。如需对该主机进行解禁，执行：FLUSH HOST
# 考虑高并发场景下的容错，建议加大。
max_connect_errors = 10000

# MySQL 打开的文件描述符限制，默认最小 1024;
# 当 open_files_limit 没有被配置的时候，比较 max_connections\*5 和 ulimit -n 的值，哪个大用哪个，
# 当 open_file_limit 被配置的时候，比较 open_files_limit 和 max_connections\*5 的值，哪个大用哪个。
# 注意：仍然可能出现报错信息 Can't create a new thread；此时观察系统 cat /proc/mysql 进程号/limits，观察进程 ulimit 限制情况
# 过小的话，考虑修改系统配置表，/etc/security/limits.conf 和 /etc/security/limits.d/90-nproc.conf
open_files_limit = 65535

# 超时配置
# -------------------------------------------------------------------------------

# MySQL 默认的 wait_timeout 值为 8 个小时，interactive_timeout 参数需要同时配置才能生效
# MySQL 连接闲置超过一定时间后（单位：秒，此处为 1800 秒）将会被强行关闭
interactive_timeout = 1800
wait_timeout = 1800

# 在 MySQL 暂时停止响应新请求之前的短时间内多少个请求可以被存在堆栈中
# 官方建议 back_log = 50 + (max_connections / 5)，封顶数为 900
back_log = 900

# 数据库数据交换配置
# -------------------------------------------------------------------------------
# 该参数限制服务器端，接受的数据包大小，如果有 BLOB 子段，建议增大此值，避免写入或者更新出错。有 BLOB 子段，建议改为 1024M
max_allowed_packet = 128M

# 内存、cache 与 buffer 设置

# 内存临时表的最大值，默认 16M，此处设置成 64M
tmp_table_size = 64M

# 用户创建的内存表的大小，默认 16M，往往和 tmp_table_size 一起设置，限制用户临时表大小。
# 超限的话，MySQL 就会自动地把它转化为基于磁盘的 MyISAM 表，存储在指定的 tmpdir 目录下，增大 IO 压力，建议内存大，增大该数值。
max_heap_table_size = 64M

# 表示这个 mysql 版本是否支持查询缓存。ps：SHOW STATUS LIKE 'qcache%'，与缓存相关的状态变量。
# have_query_cache

# 这个系统变量控制着查询缓存功能的开启和关闭，0 表示关闭，1 表示打开，2 表示只要 select 中明确指定 SQL_CACHE 才缓存。
# 看业务场景决定是否使用缓存，不使用，下面就不用配置了。
# MySQL8 不支持
query_cache_type = 0

# 默认值 1M，优点是查询缓存可以极大的提高服务器速度，如果你有大量的相同的查询并且很少修改表。
# 缺点：在你表经常变化的情况下或者如果你的查询原文每次都不同，查询缓存也许引起性能下降而不是性能提升。
# MySQL8 不支持
query_cache_size = 64M

# 只有小于此设定值的结果才会被缓冲，保护查询缓冲，防止一个极大的结果集将其他所有的查询结果都覆盖。
query_cache_limit = 2M

# 每个被缓存的结果集要占用的最小内存，默认值 4kb，一般不怎么调整。
# 如果 Qcache_free_blocks 值过大，可能是 query_cache_min_res_unit 值过大，应该调小些
# query_cache_min_res_unit 的估计值：(query_cache_size - Qcache_free_memory) / Qcache_queries_in_cache
query_cache_min_res_unit = 4kb

# 在一个事务中 binlog 为了记录 SQL 状态所持有的 cache 大小
# 如果你经常使用大的、多声明的事务，你可以增加此值来获取更大的性能。
# 所有从事务来的状态都将被缓冲在 binlog 缓冲中然后在提交后一次性写入到 binlog 中
# 如果事务比此值大，会使用磁盘上的临时文件来替代。
# 此缓冲在每个连接的事务第一次更新状态时被创建
binlog_cache_size = 1M

# 日志配置
# -------------------------------------------------------------------------------

# 日志文件相关设置，一般只开启三种日志，错误日志，慢查询日志，二进制日志。普通查询日志不开启。
# 普通查询日志，默认值 off，不开启
general_log = 0

# 普通查询日志存放地址
general_log_file = /usr/local/mysql-5.7.21/log/mysql-general.log

# 全局动态变量，默认 3，范围：1 ～ 3
# 表示错误日志记录的信息，1：只记录 error 信息；2：记录 error 和 warnings 信息；3：记录 error、warnings 和普通的 notes 信息。
log_error_verbosity = 2

# 错误日志文件地址
log_error = /usr/local/mysql-5.7.21/log/mysql-error.log

# 开启慢查询
slow_query_log = 1

# 开启慢查询时间，此处为 1 秒，达到此值才记录数据
long_query_time = 3

# 检索行数达到此数值，才记录慢查询日志中
min_examined_row_limit = 100

# mysql 5.6.5 新增，用来表示每分钟允许记录到 slow log 的且未使用索引的 SQL 语句次数，默认值为 0，不限制。
log_throttle_queries_not_using_indexes = 0

# 慢查询日志文件地址
slow_query_log_file = /var/log/mysql/mysql-slow.log

# 开启记录没有使用索引查询语句
log-queries-not-using-indexes = 1

# 开启二进制日志
log_bin = /usr/local/mysql-5.7.21/log/mysql-bin.log

# mysql 清除过期日志的时间，默认值 0，不自动清理，而是使用滚动循环的方式。
expire_logs_days = 0

# 如果二进制日志写入的内容超出给定值，日志就会发生滚动。你不能将该变量设置为大于 1GB 或小于 4096 字节。 默认值是 1GB。
max_binlog_size = 1000M

# binlog 的格式也有三种：STATEMENT，ROW，MIXED。mysql 5.7.7 后，默认值从 MIXED 改为 ROW
# 关于 binlog 日志格式问题，请查阅网络资料
binlog_format = row

# 表示每 N 次写入 binlog 后，持久化到磁盘，默认值 N=1
# 建议设置成 1，这样可以保证 MySQL 异常重启之后 binlog 不丢失。
# sync_binlog = 1

# InnoDB 引擎配置
# -------------------------------------------------------------------------------

# 说明：该参数可以提升扩展性和刷脏页性能。
# 默认值 1，建议值：4-8；并且必须小于 innodb_buffer_pool_instances
innodb_page_cleaners = 4

# 说明：一般 8k 和 16k 中选择，8k 的话，cpu 消耗小些，selcet 效率高一点，一般不用改
# 默认值：16k；建议值：不改，
innodb_page_size = 16384

# 说明：InnoDB 使用一个缓冲池来保存索引和原始数据，不像 MyISAM。这里你设置越大，你在存取表里面数据时所需要的磁盘 I/O 越少。
# 在一个独立使用的数据库服务器上，你可以设置这个变量到服务器物理内存大小的 60%-80%
# 注意别设置的过大，会导致 system 的 swap 空间被占用，导致操作系统变慢，从而减低 sql 查询的效率
# 默认值：128M，建议值：物理内存的 60%-80%
innodb_buffer_pool_size = 512M

# 说明：只有当设置 innodb_buffer_pool_size 值大于 1G 时才有意义，小于 1G，instances 默认为 1，大于 1G，instances 默认为 8
# 但是网络上有评价，最佳性能，每个实例至少 1G 大小。
# 默认值：1 或 8，建议值：innodb_buffer_pool_size/innodb_buffer_pool_instances >= 1G
innodb_buffer_pool_instances = 1

# 说明：mysql 5.7 新特性，defines the chunk size for online InnoDB buffer pool resizing operations。
# 实际缓冲区大小必须为 innodb_buffer_pool_chunk_size*innodb_buffer_pool_instances *倍数，取略大于 innodb_buffer_pool_size
# 默认值 128M，建议值：默认值就好，乱改反而容易出问题，它会影响实际 buffer pool 大小。
innodb_buffer_pool_chunk_size = 128M

# 在启动时把热数据加载到内存。默认值为 on，不修改
innodb_buffer_pool_load_at_startup = 1

# 在关闭时把热数据 dump 到本地磁盘。默认值为 on，不修改
innodb_buffer_pool_dump_at_shutdown = 1

# 说明：影响 Innodb 缓冲区的刷新算法，建议从小到大配置，直到 zero free pages；innodb_lru_scan_depth \* innodb_buffer_pool_instances defines the amount of work performed by the page cleaner thread each second。
# 默认值 1024，建议值： 未知
innodb_lru_scan_depth = 1024

# 说明：事务等待获取资源等待的最长时间，单位为秒，看具体业务情况，一般默认值就好
# 默认值：50，建议值：看业务。
innodb_lock_wait_timeout = 60

# 说明：设置了 MySQL 后台任务（例如页刷新和 merge dadta from buffer pool）每秒 io 操作的上限。
# 默认值：200，建议值：方法一，单盘 sata 设 100，sas10，raid10 设 200，ssd 设 2000，fushion-io 设 50000；方法二，通过测试工具获得磁盘 io 性能后，设置 IOPS 数值/2。
innodb_io_capacity = 2000

# 说明：该参数是所有缓冲区线程 io 操作的总上限。
# 默认值：innodb_io_capacity 的两倍。建议值：例如用 iometer 测试后的 iops 数值就好
innodb_io_capacity_max = 4000

# 说明：控制着 innodb 数据文件及 redo log 的打开、刷写模式，三种模式：fdatasync（默认），O_DSYNC，O_DIRECT
# fdatasync：数据文件，buffer pool->os buffer->磁盘；日志文件，buffer pool->os buffer->磁盘；
# O_DSYNC： 数据文件，buffer pool->os buffer->磁盘；日志文件，buffer pool->磁盘；
# O_DIRECT： 数据文件，buffer pool->磁盘； 日志文件，buffer pool->os buffer->磁盘；
# 默认值为空，建议值：使用 SAN 或者 raid，建议用 O_DIRECT，不懂测试的话，默认生产上使用 O_DIRECT
innodb_flush_method = O_DIRECT

# 说明：mysql5.7 之后默认开启，意思是，每张表一个独立表空间。
# 默认值 1，开启
innodb_file_per_table = 1

# 说明：The path where InnoDB creates undo tablespaces。通常等于 undo log 文件的存放目录。
# 默认值 ./; 自行设置
innodb_undo_directory = /usr/local/mysql-5.7.21/log

# 说明：The number of undo tablespaces used by InnoDB 等于 undo log 文件数量。5.7.21 后开始弃用
# 默认值为 0，建议默认值就好，不用调整了。
innodb_undo_tablespaces = 0

# 说明：定义 undo 使用的回滚段数量。5.7.19 后弃用
# 默认值 128，建议不动，以后弃用了。
innodb_undo_logs = 128

# 说明：5.7.5 后开始使用，在线收缩 undo log 使用的空间。
# 默认值：关闭，建议值：开启
innodb_undo_log_truncate = 1

# 说明：结合 innodb_undo_log_truncate，实现 undo 空间收缩功能
# 默认值：1G，建议值，不改。
innodb_max_undo_log_size = 1G

# 说明：重作日志文件的存放目录
innodb_log_group_home_dir = /usr/local/mysql-5.7.21/log

# 说明：日志文件的大小
# 默认值：48M，建议值：根据你系统的磁盘空间和日志增长情况调整大小
innodb_log_file_size = 128M

# 说明：日志组中的文件数量，mysql 以循环方式写入日志
# 默认值 2，建议值：根据你系统的磁盘空间和日志增长情况调整大小
innodb_log_files_in_group = 3

# 此参数确定些日志文件所用的内存大小，以 M 为单位。缓冲区更大能提高性能，但意外的故障将会丢失数据。MySQL 开发人员建议设置为 1－8M 之间
innodb_log_buffer_size = 16M

# 说明：可以控制 log 从系统 buffer 刷入磁盘文件的刷新频率，增大可减轻系统负荷
# 默认值是 1；建议值不改。系统性能一般够用。
innodb_flush_log_at_timeout = 1

# 说明：参数可设为 0，1，2；
# 参数 0：表示每秒将 log buffer 内容刷新到系统 buffer 中，再调用系统 flush 操作写入磁盘文件。
# 参数 1：表示每次事务提交，redo log 都直接持久化到磁盘。
# 参数 2：表示每次事务提交，隔 1 秒后再将 redo log 持久化到磁盘。
# 建议设置成 1，这样可以保证 MySQL 异常重启之后数据不丢失。
innodb_flush_log_at_trx_commit = 1

# 说明：限制 Innodb 能打开的表的数据，如果库里的表特别多的情况，请增加这个。
# 值默认是 2000，建议值：参考数据库表总数再进行调整，一般够用不用调整。
innodb_open_files = 8192

# innodb 处理 io 读写的后台并发线程数量，根据 cpu 核来确认，取值范围：1-64
# 默认值：4，建议值：与逻辑 cpu 数量的一半保持一致。
innodb_read_io_threads = 4
innodb_write_io_threads = 4

# 默认设置为 0，表示不限制并发数，这里推荐设置为 0，更好去发挥 CPU 多核处理能力，提高并发量
innodb_thread_concurrency = 0

# 默认值为 4，建议不变。InnoDB 中的清除操作是一类定期回收无用数据的操作。mysql 5.5 之后，支持多线程清除操作。
innodb_purge_threads = 4

# 说明：mysql 缓冲区分为 new blocks 和 old blocks；此参数表示 old blocks 占比；
# 默认值：37，建议值，一般不动
innodb_old_blocks_pct = 37

# 说明：新数据被载入缓冲池，进入 old pages 链区，当 1 秒后再次访问，则提升进入 new pages 链区。
# 默认值：1000
innodb_old_blocks_time=1000

# 说明：开启异步 io，可以提高并发性，默认开启。
# 默认值为 1，建议不动
innodb_use_native_aio = 1

# 说明：默认为空，使用 data 目录，一般不改。
innodb_data_home_dir=/usr/local/mysql-5.7.21/data

# 说明：Defines the name，size，and attributes of InnoDB system tablespace data files。
# 默认值，不指定，默认为 ibdata1：12M：autoextend
innodb_data_file_path = ibdata1：12M：autoextend

# 说明：设置了 InnoDB 存储引擎用来存放数据字典信息以及一些内部数据结构的内存空间大小，除非你的数据对象及其多，否则一般默认不改。
# innodb_additional_mem_pool_size = 16M
# 说明：The crash recovery mode。只有紧急情况需要恢复数据的时候，才改为大于 1-6 之间数值，含义查下官网。
# 默认值为 0；
#innodb_force_recovery = 0

# MyISAM 引擎配置
# -------------------------------------------------------------------------------

# 指定索引缓冲区的大小，为 MYISAM 数据表开启供线程共享的索引缓存，对 INNODB 引擎无效。相当影响 MyISAM 的性能。
# 不要将其设置大于你可用内存的 30%，因为一部分内存同样被 OS 用来缓冲行数据
# 甚至在你并不使用 MyISAM 表的情况下，你也需要仍旧设置起 8-64M 内存由于它同样会被内部临时磁盘表使用。
# 默认值 8M，建议值：对于内存在 4GB 左右的服务器该参数可设置为 256M 或 384M。注意：该参数值设置的过大反而会是服务器整体效率降低！
key_buffer_size = 64M

# 为每个扫描 MyISAM 的线程分配参数设置的内存大小缓冲区。
# 默认值 128kb，建议值：16G 内存建议 1M，4G：128kb 或者 256kb 吧
# 注意，该缓冲区是每个连接独占的，所以总缓冲区大小为 128kb *连接数；极端情况 128kb*maxconnectiosns，会超级大，所以要考虑日常平均连接数。
# 一般不需要太关心该数值，稍微增大就可以了，
read_buffer_size = 262144

# 支持任何存储引擎
# MySQL 的随机读缓冲区大小，适当增大，可以提高性能。
# 默认值 256kb；建议值：得参考连接数，16G 内存，有人推荐 8M
# 注意，该缓冲区是每个连接独占的，所以总缓冲区大小为 128kb *连接数；极端情况 128kb*maxconnectiosns，会超级大，所以要考虑日常平均连接数。
read_rnd_buffer_size = 1M

# order by 或 group by 时用到
# 支持所有引擎，innodb 和 myisam 有自己的 innodb_sort_buffer_size 和 myisam_sort_buffer_size 设置
# 默认值 256kb；建议值：得参考连接数，16G 内存，有人推荐 8M。
# 注意，该缓冲区是每个连接独占的，所以总缓冲区大小为 1M *连接数；极端情况 1M*maxconnectiosns，会超级大。所以要考虑日常平均连接数。
sort_buffer_size = 1M

# 此缓冲被使用来优化全联合 (full JOINs 不带索引的联合）
# 类似的联合在极大多数情况下有非常糟糕的性能表现，但是将此值设大能够减轻性能影响。
# 通过 “Select_full_join” 状态变量查看全联合的数量
# 注意，该缓冲区是每个连接独占的，所以总缓冲区大小为 1M *连接数；极端情况 1M*maxconnectiosns，会超级大。所以要考虑日常平均连接数。
# 默认值 256kb; 建议值：16G 内存，设置 8M。
join_buffer_size = 1M

# 缓存 linux 文件描述符信息，加快数据文件打开速度
# 它影响 myisam 表的打开关闭，但是不影响 innodb 表的打开关闭。
# 默认值 2000，建议值：根据状态变量 Opened_tables 去设定
table_open_cache = 2000

# 缓存表定义的相关信息，加快读取表信息速度
# 默认值 1400，最大值 2000，建议值：基本不改。
table_definition_cache = 1400

# 该参数是 myssql 5.6 后引入的，目的是提高并发。
# 默认值 1，建议值：cpu 核数，并且<=16
table_open_cache_instances = 2

# 当客户端断开之后，服务器处理此客户的线程将会缓存起来以响应下一个客户而不是销毁。可重用，减小了系统开销。
# 默认值为 9，建议值：两种取值方式，方式一，根据物理内存，1G —> 8；2G —> 16； 3G —> 32； >3G —> 64；
# 方式二，根据 show status like 'threads%'，查看 Threads_connected 值。
thread_cache_size = 16

# 默认值 256k，建议值：16/32G 内存，512kb，其他一般不改变，如果报错：Thread stack overrun，就增大看看，
# 注意，每个线程分配内存空间，所以总内存空间。你懂得。
thread_stack = 512k

[client]
socket  = /var/lib/mysql/mysql.sock
port = 3306
```

- GENERAL
  - `datadir` - mysql 数据文件所在目录
  - `socket` - scoket 文件
  - `pid_file` - PID 文件
  - `user` - 启动 mysql 服务进程的用户
  - `port` - 服务端口号，默认 `3306`
  - `default_storage_engine` - mysql 5.1 之后，默认引擎是 InnoDB
  - `default_time_zone` - 默认时区。中国大部分地区在东八区，即 `+8:00`
  - `character_set_server` - 数据库默认字符集
  - `collation_server` - 数据库字符集对应一些排序等规则，注意要和 `character_set_server` 对应
- LOG
  - `log_error` - 错误日志文件地址
  - `slow_query_log` - 错误日志文件地址
- InnoDB
  - `innodb_buffer_pool_size` - InnoDB 使用一个缓冲池来保存索引和原始数据，不像 MyISAM。这里你设置越大，你在存取表里面数据时所需要的磁盘 I/O 越少。
    - 在一个独立使用的数据库服务器上，你可以设置这个变量到服务器物理内存大小的 60%-80%
    - 注意别设置的过大，会导致 system 的 swap 空间被占用，导致操作系统变慢，从而减低 sql 查询的效率
    - 默认值：128M，建议值：物理内存的 60%-80%
  - `innodb_log_file_size` - 日志文件的大小。默认值：48M，建议值：根据你系统的磁盘空间和日志增长情况调整大小
  - `innodb_file_per_table` - 说明：mysql5.7 之后默认开启，意思是，每张表一个独立表空间。默认值 1，开启。
  - `innodb_flush_method` - 说明：控制着 innodb 数据文件及 redo log 的打开、刷写模式，三种模式：fdatasync（默认），O_DSYNC，O_DIRECT。默认值为空，建议值：使用 SAN 或者 raid，建议用 O_DIRECT，不懂测试的话，默认生产上使用 O_DIRECT
    - `fdatasync`：数据文件，buffer pool->os buffer->磁盘；日志文件，buffer pool->os buffer->磁盘；
    - `O_DSYNC`： 数据文件，buffer pool->os buffer->磁盘；日志文件，buffer pool->磁盘；
    - `O_DIRECT`： 数据文件，buffer pool->磁盘； 日志文件，buffer pool->os buffer->磁盘；
- MyIsam

  - `key_buffer_size` - 指定索引缓冲区的大小，为 MYISAM 数据表开启供线程共享的索引缓存，对 INNODB 引擎无效。相当影响 MyISAM 的性能。
    - 不要将其设置大于你可用内存的 30%，因为一部分内存同样被 OS 用来缓冲行数据
    - 甚至在你并不使用 MyISAM 表的情况下，你也需要仍旧设置起 8-64M 内存由于它同样会被内部临时磁盘表使用。
    - 默认值 8M，建议值：对于内存在 4GB 左右的服务器该参数可设置为 256M 或 384M。
    - 注意：该参数值设置的过大反而会是服务器整体效率降低！

- OTHER
  - `tmp_table_size` - 内存临时表的最大值，默认 16M，此处设置成 128M
  - `max_heap_table_size` - 用户创建的内存表的大小，默认 16M，往往和 `tmp_table_size` 一起设置，限制用户临时表大小。超限的话，MySQL 就会自动地把它转化为基于磁盘的 MyISAM 表，存储在指定的 tmpdir 目录下，增大 IO 压力，建议内存大，增大该数值。
  - `query_cache_type` - 这个系统变量控制着查询缓存功能的开启和关闭，0 表示关闭，1 表示打开，2 表示只要 `select` 中明确指定 `SQL_CACHE` 才缓存。
  - `query_cache_size` - 默认值 1M，优点是查询缓存可以极大的提高服务器速度，如果你有大量的相同的查询并且很少修改表。缺点：在你表经常变化的情况下或者如果你的查询原文每次都不同，查询缓存也许引起性能下降而不是性能提升。
  - `max_connections` - 最大连接数，可设最大值 16384，一般考虑根据同时在线人数设置一个比较综合的数字，鉴于该数值增大并不太消耗系统资源，建议直接设 10000。如果在访问时经常出现 Too Many Connections 的错误提示，则需要增大该参数值
  - `thread_cache` - 当客户端断开之后，服务器处理此客户的线程将会缓存起来以响应下一个客户而不是销毁。可重用，减小了系统开销。默认值为 9，建议值：两种取值方式，
    - 方式一，根据物理内存，1G —> 8；2G —> 16； 3G —> 32； >3G —> 64；
    - 方式二，根据 show status like 'threads%'，查看 Threads_connected 值。
  - `open_files_limit` - MySQL 打开的文件描述符限制，默认最小 1024;
    - 当 open_files_limit 没有被配置的时候，比较 max_connections\*5 和 ulimit -n 的值，哪个大用哪个，
    - 当 open_file_limit 被配置的时候，比较 open_files_limit 和 max_connections\*5 的值，哪个大用哪个
    - 注意：仍然可能出现报错信息 Can't create a new thread；此时观察系统 `cat /proc/mysql` 进程号/limits，观察进程 ulimit 限制情况
    - 过小的话，考虑修改系统配置表，`/etc/security/limits.conf` 和 `/etc/security/limits.d/90-nproc.conf`

## MySQL FAQ

### Too many connections

**现象**

尝试连接 MySQL 时，遇到 `Too many connections` 错误。

**原因**

数据库连接线程数超过最大值，访问被拒绝。

**解决方案**

如果实际连接线程数过大，可以考虑增加服务器节点来分流；如果实际线程数并不算过大，那么可以配置 `max_connections` 来增加允许的最大连接数。需要注意的是，连接数不宜过大，一般来说，单库每秒有 2000 个并发连接时，就可以考虑扩容了，健康的状态应该维持在每秒 1000 个并发连接左右。

（1）查看最大连接数

```sql
mysql> show variables like '%max_connections%';
+------------------------+-------+
| Variable_name          | Value |
+------------------------+-------+
| max_connections        | 151   |
| mysqlx_max_connections | 100   |
+------------------------+-------+
```

（2）查看服务器响应的最大连接数

```sql
mysql> show global status like 'Max_used_connections';
+----------------------+-------+
| Variable_name        | Value |
+----------------------+-------+
| Max_used_connections | 142   |
+----------------------+-------+
1 row in set (0.00 sec)
```

（3）临时设置最大连接数

```sql
set GLOBAL max_connections=256;
```

注意：当服务器重启时，最大连接数会被重置。

（4）永久设置最大连接数

修改 `/etc/my.cnf` 配置文件，在 `[mysqld]` 添加以下配置：

```sql
max_connections=256
```

重启 mysql 以生效

（5）修改 Linux 最大文件数限制

设置了最大连接数，如果还是没有生效，考虑检查一下 Linux 最大文件数

MySQL 最大连接数会受到最大文件数限制，`vim /etc/security/limits.conf`，添加 mysql 用户配置

```
mysql hard nofile 65535
mysql soft nofile 65535
```

（6）检查 LimitNOFILE

如果是使用 rpm 方式安装 mysql，检查 **mysqld.service** 文件中的 `LimitNOFILE` 是否配置的太小。

### 时区（time_zone）偏差

**现象**

数据库中存储的 Timestamp 字段值比真实值少了 13 个小时。

**原因**

- 当 JDBC 与 MySQL 开始建立连接时，会获取服务器参数。
- 当 MySQL 的 `time_zone` 值为 `SYSTEM` 时，会取 `system_time_zone` 值作为协调时区，若得到的是 `CST` 那么 Java 会误以为这是 `CST -0500` ，因此会给出错误的时区信息（国内一般是`CST +0800`，即东八区）。

查看时区方法：

通过 `show variables like '%time_zone%';` 命令查看 MySQL 时区配置：

```sql
mysql> show variables like '%time_zone%';
+------------------+--------+
| Variable_name    | Value  |
+------------------+--------+
| system_time_zone | CST    |
| time_zone        | SYSTEM |
+------------------+--------+
```

**解决方案**

方案一

```sql
mysql> set global time_zone = '+08:00';
Query OK, 0 rows affected (0.00 sec)

mysql> set time_zone = '+08:00';
Query OK, 0 rows affected (0.00 sec)
```

方案二

修改 `my.cnf` 文件，在 `[mysqld]` 节下增加 `default-time-zone='+08:00'` ，然后重启。

### 数据表损坏如何修复

使用 myisamchk 来修复，具体步骤：

1. 修复前将 mysql 服务停止。
2. 打开命令行方式，然后进入到 mysql 的 `bin` 目录。
3. 执行 myisamchk –recover 数据库所在路 /\*.MYI

使用 repair table 或者 OPTIMIZE table 命令来修复，REPAIR TABLE table_name 修复表 OPTIMIZE TABLE table_name 优化表 REPAIR TABLE 用于修复被破坏的表。 OPTIMIZE TABLE 用于回收闲置的数据库空间，当表上的数据行被删除时，所占据的磁盘空间并没有立即被回收，使用了 OPTIMIZE TABLE 命令后这些空间将被回收，并且对磁盘上的数据行进行重排（注意：是磁盘上，而非数据库）

### 数据结构

> 问题现象：ERROR 1071: Specified key was too long; max key length is 767 bytes

问题原因：MySQL 默认情况下单个列的索引不能超过 767 位（不同版本可能存在差异） 。

解决方法：优化索引结构，索引字段不宜过长。

## MySQL 运维脚本

这里推荐我写的几个一键运维脚本，非常方便，欢迎使用：

- [MySQL 安装脚本](https://github.com/dunwu/linux-tutorial/tree/master/codes/linux/soft/mysql-install.sh)
- [MySQL 备份脚本](https://github.com/dunwu/linux-tutorial/tree/master/codes/linux/soft/mysql-backup.sh)

## 参考资料

- [《高性能 MySQL》](https://book.douban.com/subject/23008813/)
- https://www.cnblogs.com/xiaopotian/p/8196464.html
- https://www.cnblogs.com/bigbrotherer/p/7241845.html
- https://blog.csdn.net/managementandjava/article/details/80039650
- http://www.manongjc.com/article/6996.html
- https://www.cnblogs.com/xyabk/p/8967990.html
- [MySQL 8.0 主从（Master-Slave）配置](https://blog.csdn.net/zyhlwzy/article/details/80569422)
- [MySQL 主从同步实战](https://juejin.im/post/58eb5d162f301e00624f014a)
- [MySQL 备份和恢复机制](https://juejin.im/entry/5a0aa2026fb9a045132a369f)
- [MySQL 配置文件/etc/my.cnf 解析](https://www.jianshu.com/p/5f39c486561b)