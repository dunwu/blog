# Mysql 进阶

## mysql 命令行

执行 `mysql -u root -p<password>` 命令可以进入 Mysql 命令行模式。

- `-u` 指定 mysql 用户
- `-p` 后面跟的是密码，注意不要有空格

## 备份与恢复

Mysql 备份数据使用 mysqldump 命令。

mysqldump 将数据库中的数据备份成一个文本文件，表的结构和表中的数据将存储在生成的文本文件中。

### 备份

（1）备份一个数据库

语法：

```
mysqldump -u <username> -p <database> [<table1> <table2> ...] > backup.sql
```

- username 数据库用户
- dbname 数据库名称
- table1 和 table2 参数表示需要备份的表的名称，为空则整个数据库备份；
- BackupName.sql 参数表设计备份文件的名称，文件名前面可以加上一个绝对路径。通常将数据库被分成一个后缀名为 sql 的文件

（2）备份多个数据库

```
mysqldump -u <username> -p --databases <database1> <database2> ... > backup.sql
```

（3）备份所有数据库

```
mysqldump -u <username> -p -all-databases > backup.sql
```

### 恢复

Mysql 恢复数据使用 mysqldump 命令。

语法：

```
mysql -u <username> -p <database> < backup.sql
```

## 问题

### JDBC 与 Mysql 因 CST 时区协商无解导致偏差了14或13小时

**现象**

数据库中存储的 Timestamp 字段值比真实值少了 13 个小时。

**原因**

- 当 JDBC 与 MySQL 开始建立连接时，会获取服务器参数。
- 当 MySQL 的 `time_zone` 值为 `SYSTEM` 时，会取 `system_time_zone` 值作为协调时区，若得到的是 `CST` 那么 Java 会误以为这是 `CST -0500` ，因此会给出错误的时区信息（国内一般是`CST +0800`，即东八区）。

> 查看时区方法：
>
> 通过 `show variables like '%time_zone%';` 命令查看  Mysql 时区配置：
>
> ```
> mysql> show variables like '%time_zone%';
> +------------------+--------+
> | Variable_name    | Value  |
> +------------------+--------+
> | system_time_zone | CST    |
> | time_zone        | SYSTEM |
> +------------------+--------+
> ```

**解决方案**

方案一

```
mysql> set global time_zone = '+08:00';
Query OK, 0 rows affected (0.00 sec)

mysql> set time_zone = '+08:00';
Query OK, 0 rows affected (0.00 sec)
```

方案二

修改 `my.cnf` 文件，在 `[mysqld]` 节下增加 `default-time-zone = '+08:00'` ，然后重启。