---
icon: logos:mysql
title: MySQL 复制
date: 2023-09-21 21:25:58
categories:
  - 数据库
  - 关系型数据库
  - mysql
tags:
  - 数据库
  - 关系型数据库
  - mysql
  - 复制
  - 读写分离
permalink: /pages/f3f7b97e/
---

# MySQL 复制

## 复制

复制是解决系统高可用的常见手段。其思路就是：不要把鸡蛋都放在一个篮子里。

复制解决的基本问题是让一台服务器的数据与其他服务器保持同步。一台主库的数据可以同步到多台从库上，从库本身也可以被配置成另外一台服务器的主库。主库和从库之 间可以有多种不同的组合方式。

MySQL 支持两种复制方式：基于行的复制和基于语句的复制。这两种方式都是通过在主库上记录 bin log、在从库重放日志的方式来实现异步的数据复制。这意味着：复制过程存在时延，这段时间内，主从数据可能不一致。

### 复制如何工作

在 MySQL 中，复制分为三个步骤，分别由三个线程完成：

- **binlog dump 线程** - 主库上有一个特殊的 binlog dump 线程，负责将主服务器上的数据更改写入 binlog 中。
- **I/O 线程** - 从库上有一个 I/O 线程，负责从主库上读取 binlog，并写入从库的中继日志（relay log）中。
- **SQL 线程** - 从库上有一个 SQL 线程，负责读取中继日志（relay log）并重放其中的 SQL 语句。

![](https://raw.githubusercontent.com/dunwu/images/master/cs/database/mysql/master-slave.png)

这种架构实现了数据备份和数据同步的异步解耦。但这种架构也限制了复制的过程，其中最重要的一点是在主库上并发运行的查询在从库只能串行化执行，因为只有一个 SQL 线程来重放 中继日志中的事件。

### 主备配置

假设需要配置一对 MySQL 主备节点，环境如下：

- 主库节点：192.168.8.10
- 从库节点：192.168.8.11

#### 主库上的操作

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

```shell
systemctl restart mysql
```

（2）创建用于同步的用户

进入 mysql 命令控制台：

```sh
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
-- 如果有多个从库，又想让所有从库都使用统一的用户名、密码认证，可以考虑这种方式
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

（4）查看主库状态

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

（7）将 sql 远程传送到从库上

```shell
scp dbdump.sql root@192.168.8.11:/home
```

#### 从库上的操作

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

（3）在从库上建立与主库的连接

进入 mysql 命令控制台：

```shell
$ mysql -u root -p
Password:
```

执行以下 SQL：

```sql
-- 停止从库服务
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
- `MASTER_HOST` 是主库的 HOST。
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

（6）将从库设为只读

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

## 读写分离

主服务器用来处理写操作以及实时性要求比较高的读操作，而从服务器用来处理读操作。

读写分离常用代理方式来实现，代理服务器接收应用层传来的读写请求，然后决定转发到哪个服务器。

MySQL 读写分离能提高性能的原因在于：

- 主从服务器负责各自的读和写，极大程度缓解了锁的争用；
- 从服务器可以配置 MyISAM 引擎，提升查询性能以及节约系统开销；
- 增加冗余，提高可用性。

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/master/cs/database/mysql/master-slave-proxy.png" />
</div>

## 参考资料

- [《高性能 MySQL》](https://book.douban.com/subject/23008813/)
- [极客时间教程 - MySQL 实战 45 讲](https://time.geekbang.org/column/intro/139)