# Mysql 进阶

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
