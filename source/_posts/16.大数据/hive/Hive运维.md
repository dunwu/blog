---
title: hive-ops
date: 2020-02-24 21:14:47
order: 07
categories:
  - 大数据
  - hive
tags:
  - 大数据
  - Hive
  - 运维
permalink: /pages/ffa7d14a/
---

# Hive 运维

## Hive 安装

### 下载并解压

下载所需版本的 Hive，这里我下载版本为 `cdh5.15.2`。下载地址：[http://archive.cloudera.com/cdh5/cdh/5/](http://archive.cloudera.com/cdh5/cdh/5/)

```
# 下载后进行解压
 tar -zxvf hive-1.1.0-cdh5.15.2.tar.gz
```

### 配置环境变量

```
# vim /etc/profile
```

添加环境变量：

```
export HIVE_HOME=/usr/app/hive-1.1.0-cdh5.15.2
export PATH=$HIVE_HOME/bin:$PATH
```

使得配置的环境变量立即生效：

```
# source /etc/profile
```

### 修改配置

**1. hive-env.sh**

进入安装目录下的 `conf/` 目录，拷贝 Hive 的环境配置模板 `flume-env.sh.template`

```
cp hive-env.sh.template hive-env.sh
```

修改 `hive-env.sh`，指定 Hadoop 的安装路径：

```
HADOOP_HOME=/usr/app/hadoop-2.6.0-cdh5.15.2
```

**2. hive-site.xml**

新建 hive-site.xml 文件，内容如下，主要是配置存放元数据的 MySQL 的地址、驱动、用户名和密码等信息：

```
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<configuration>
  <property>
    <name>javax.jdo.option.ConnectionURL</name>
    <value>jdbc:mysql://hadoop001:3306/hadoop_hive?createDatabaseIfNotExist=true</value>
  </property>

  <property>
    <name>javax.jdo.option.ConnectionDriverName</name>
    <value>com.mysql.jdbc.Driver</value>
  </property>

  <property>
    <name>javax.jdo.option.ConnectionUserName</name>
    <value>root</value>
  </property>

  <property>
    <name>javax.jdo.option.ConnectionPassword</name>
    <value>root</value>
  </property>

</configuration>
```

### 拷贝数据库驱动

将 MySQL 驱动包拷贝到 Hive 安装目录的 `lib` 目录下, MySQL 驱动的下载地址为：[https://dev.mysql.com/downloads/connector/j/](https://dev.mysql.com/downloads/connector/j/)。

### 初始化元数据库

- 当使用的 hive 是 1.x 版本时，可以不进行初始化操作，Hive 会在第一次启动的时候会自动进行初始化，但不会生成所有的元数据信息表，只会初始化必要的一部分，在之后的使用中用到其余表时会自动创建；

- 当使用的 hive 是 2.x 版本时，必须手动初始化元数据库。初始化命令：

  ```
  # schematool 命令在安装目录的 bin 目录下，由于上面已经配置过环境变量，在任意位置执行即可
  schematool -dbType mysql -initSchema
  ```

这里我使用的是 CDH 的 `hive-1.1.0-cdh5.15.2.tar.gz`，对应 `Hive 1.1.0` 版本，可以跳过这一步。

### 启动

由于已经将 Hive 的 bin 目录配置到环境变量，直接使用以下命令启动，成功进入交互式命令行后执行 `show databases` 命令，无异常则代表搭建成功。

```
# hive
```

![img](https://github.com/heibaiying/BigData-Notes/raw/master/pictures/hive-install-2.png)

在 Mysql 中也能看到 Hive 创建的库和存放元数据信息的表

![img](https://github.com/heibaiying/BigData-Notes/raw/master/pictures/hive-mysql-tables.png)

## HiveServer2/beeline

Hive 内置了 HiveServer 和 HiveServer2 服务，两者都允许客户端使用多种编程语言进行连接，但是 HiveServer 不能处理多个客户端的并发请求，因此产生了 HiveServer2。

HiveServer2（HS2）允许远程客户端可以使用各种编程语言向 Hive 提交请求并检索结果，支持多客户端并发访问和身份验证。HS2 是由多个服务组成的单个进程，其包括基于 Thrift 的 Hive 服务（TCP 或 HTTP）和用于 Web UI 的 Jetty Web 服务。

HiveServer2 拥有自己的 CLI 工具——Beeline。Beeline 是一个基于 SQLLine 的 JDBC 客户端。由于目前 HiveServer2 是 Hive 开发维护的重点，所以官方更加推荐使用 Beeline 而不是 Hive CLI。以下主要讲解 Beeline 的配置方式。

### 修改 Hadoop 配置

修改 hadoop 集群的 core-site.xml 配置文件，增加如下配置，指定 hadoop 的 root 用户可以代理本机上所有的用户。

```xml
<property>
 <name>hadoop.proxyuser.root.hosts</name>
 <value>*</value>
</property>
<property>
 <name>hadoop.proxyuser.root.groups</name>
 <value>*</value>
</property>
```

之所以要配置这一步，是因为 hadoop 2.0 以后引入了安全伪装机制，使得 hadoop 不允许上层系统（如 hive）直接将实际用户传递到 hadoop 层，而应该将实际用户传递给一个超级代理，由该代理在 hadoop 上执行操作，以避免任意客户端随意操作 hadoop。如果不配置这一步，在之后的连接中可能会抛出 `AuthorizationException` 异常。

> 关于 Hadoop 的用户代理机制，可以参考：[hadoop 的用户代理机制](https://blog.csdn.net/u012948976/article/details/49904675#官方文档解读) 或 [Superusers Acting On Behalf Of Other Users](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/Superusers.html)

### 启动 hiveserver2

由于上面已经配置过环境变量，这里直接启动即可：

```shell
# nohup hiveserver2 &
```

### 使用 beeline

可以使用以下命令进入 beeline 交互式命令行，出现 `Connected` 则代表连接成功。

```shell
beeline -u jdbc:hive2://hadoop001:10000 -n root
```

### Beeline 选项

Beeline 拥有更多可使用参数，可以使用 `beeline --help` 查看，完整参数如下：

```shell
Usage: java org.apache.hive.cli.beeline.BeeLine
   -u <database url>               the JDBC URL to connect to
   -r                              reconnect to last saved connect url (in conjunction with !save)
   -n <username>                   the username to connect as
   -p <password>                   the password to connect as
   -d <driver class>               the driver class to use
   -i <init file>                  script file for initialization
   -e <query>                      query that should be executed
   -f <exec file>                  script file that should be executed
   -w (or) --password-file <password file>  the password file to read password from
   --hiveconf property=value       Use value for given property
   --hivevar name=value            hive variable name and value
                                   This is Hive specific settings in which variables
                                   can be set at session level and referenced in Hive
                                   commands or queries.
   --property-file=<property-file> the file to read connection properties (url, driver, user, password) from
   --color=[true/false]            control whether color is used for display
   --showHeader=[true/false]       show column names in query results
   --headerInterval=ROWS;          the interval between which heades are displayed
   --fastConnect=[true/false]      skip building table/column list for tab-completion
   --autoCommit=[true/false]       enable/disable automatic transaction commit
   --verbose=[true/false]          show verbose error messages and debug info
   --showWarnings=[true/false]     display connection warnings
   --showNestedErrs=[true/false]   display nested errors
   --numberFormat=[pattern]        format numbers using DecimalFormat pattern
   --force=[true/false]            continue running script even after errors
   --maxWidth=MAXWIDTH             the maximum width of the terminal
   --maxColumnWidth=MAXCOLWIDTH    the maximum width to use when displaying columns
   --silent=[true/false]           be more silent
   --autosave=[true/false]         automatically save preferences
   --outputformat=[table/vertical/csv2/tsv2/dsv/csv/tsv]  format mode for result display
   --incrementalBufferRows=NUMROWS the number of rows to buffer when printing rows on stdout,
                                   defaults to 1000; only applicable if --incremental=true
                                   and --outputformat=table
   --truncateTable=[true/false]    truncate table column when it exceeds length
   --delimiterForDSV=DELIMITER     specify the delimiter for delimiter-separated values output format (default: |)
   --isolation=LEVEL               set the transaction isolation level
   --nullemptystring=[true/false]  set to true to get historic behavior of printing null as empty string
   --maxHistoryRows=MAXHISTORYROWS The maximum number of rows to store beeline history.
   --convertBinaryArrayToString=[true/false]    display binary column data as string or as byte array
   --help                          display this message
```

### 常用参数

在 Hive CLI 中支持的参数，Beeline 都支持，常用的参数如下。更多参数说明可以参见官方文档 [Beeline Command Options](https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Clients#HiveServer2Clients-Beeline–NewCommandLineShell)

| 参数                        | 说明                             |
| --------------------------- | -------------------------------- |
| `-u`                        | 数据库地址                       |
| `-n`                        | 用户名                           |
| `-p`                        | 密码                             |
| -d                          | 驱动 (可选)                      |
| `-e`\*                      | 执行 SQL 命令                    |
| `-f`\*                      | 执行 SQL 脚本                    |
| `-i (or)--init`             | 在进入交互模式之前运行初始化脚本 |
| `--property-file`           | 指定配置文件                     |
| `--hiveconf property=value` | 指定配置属性                     |
| `--hivevar name=value`      | 用户自定义属性，在会话级别有效   |

示例： 使用用户名和密码连接 Hive

```shell
beeline -u jdbc:hive2://localhost:10000  -n username -p password
```

## Hive 命令

### Help

使用 `hive -H` 或者 `hive --help` 命令可以查看所有命令的帮助，显示如下：

```shell
usage: hive
 -d,--define <key=value>          Variable subsitution to apply to hive
                                  commands. e.g. -d A=B or --define A=B  --定义用户自定义变量
    --database <databasename>     Specify the database to use  -- 指定使用的数据库
 -e <quoted-query-string>         SQL from command line   -- 执行指定的 SQL
 -f <filename>                    SQL from files   --执行 SQL 脚本
 -H,--help                        Print help information  -- 打印帮助信息
    --hiveconf <property=value>   Use value for given property    --自定义配置
    --hivevar <key=value>         Variable subsitution to apply to hive  --自定义变量
                                  commands. e.g. --hivevar A=B
 -i <filename>                    Initialization SQL file  --在进入交互模式之前运行初始化脚本
 -S,--silent                      Silent mode in interactive shell    --静默模式
 -v,--verbose                     Verbose mode (echo executed SQL to the  console)  --详细模式
```

### 交互式命令行

直接使用 `Hive` 命令，不加任何参数，即可进入交互式命令行。

### 执行 SQL 命令

在不进入交互式命令行的情况下，可以使用 `hive -e`执行 SQL 命令。

```shell
hive -e 'select * from emp';
```

[![img](https://github.com/heibaiying/BigData-Notes/raw/master/pictures/hive-e.png)](https://github.com/heibaiying/BigData-Notes/blob/master/pictures/hive-e.png)

### 执行 SQL 脚本

用于执行的 sql 脚本可以在本地文件系统，也可以在 HDFS 上。

```shell
# 本地文件系统
hive -f /usr/file/simple.sql;

# HDFS文件系统
hive -f hdfs://hadoop001:8020/tmp/simple.sql;
```

其中 `simple.sql` 内容如下：

```sql
select * from emp;
```

### 配置 Hive 变量

可以使用 `--hiveconf` 设置 Hive 运行时的变量。

```shell
hive -e 'select * from emp' \
--hiveconf hive.exec.scratchdir=/tmp/hive_scratch  \
--hiveconf mapred.reduce.tasks=4;
```

> hive.exec.scratchdir：指定 HDFS 上目录位置，用于存储不同 map/reduce 阶段的执行计划和这些阶段的中间输出结果。

### 配置文件启动

使用 `-i` 可以在进入交互模式之前运行初始化脚本，相当于指定配置文件启动。

```shell
hive -i /usr/file/hive-init.conf;
```

其中 `hive-init.conf` 的内容如下：

```shell
set hive.exec.mode.local.auto = true;
```

> hive.exec.mode.local.auto 默认值为 false，这里设置为 true ，代表开启本地模式。

### 用户自定义变量

`--define`和 `--hivevar`在功能上是等价的，都是用来实现自定义变量，这里给出一个示例:

定义变量：

```shell
hive  --define  n=ename --hiveconf  --hivevar j=job;
```

在查询中引用自定义变量：

```shell
# 以下两条语句等价
hive > select ${n} from emp;
hive > select ${hivevar:n} from emp;

# 以下两条语句等价
hive > select ${j} from emp;
hive > select ${hivevar:j} from emp;
```

结果如下：

[![img](https://github.com/heibaiying/BigData-Notes/raw/master/pictures/hive-n-j.png)](https://github.com/heibaiying/BigData-Notes/blob/master/pictures/hive-n-j.png)

## Hive 配置

可以通过三种方式对 Hive 的相关属性进行配置，分别介绍如下：

### 配置文件

方式一为使用配置文件，使用配置文件指定的配置是永久有效的。Hive 有以下三个可选的配置文件：

- `hive-site.xml` - Hive 的主要配置文件；
- `hivemetastore-site.xml` - 关于元数据的配置；
- `hiveserver2-site.xml` - 关于 HiveServer2 的配置。

示例如下,在 hive-site.xml 配置 `hive.exec.scratchdir`：

```xml
<property>
    <name>hive.exec.scratchdir</name>
    <value>/tmp/mydir</value>
    <description>Scratch space for Hive jobs</description>
</property>
```

### hiveconf

方式二为在启动命令行 (Hive CLI / Beeline) 的时候使用 `--hiveconf` 指定配置，这种方式指定的配置作用于整个 Session。

```shell
hive --hiveconf hive.exec.scratchdir=/tmp/mydir
```

### set

方式三为在交互式环境下 (Hive CLI / Beeline)，使用 set 命令指定。这种设置的作用范围也是 Session 级别的，配置对于执行该命令后的所有命令生效。set 兼具设置参数和查看参数的功能。如下：

```
0: jdbc:hive2://hadoop001:10000> set hive.exec.scratchdir=/tmp/mydir;
No rows affected (0.025 seconds)
0: jdbc:hive2://hadoop001:10000> set hive.exec.scratchdir;
+----------------------------------+--+
|               set                |
+----------------------------------+--+
| hive.exec.scratchdir=/tmp/mydir  |
+----------------------------------+--+
```

### 配置优先级

配置的优先顺序如下 (由低到高)：
`hive-site.xml` - >`hivemetastore-site.xml`- > `hiveserver2-site.xml` - >`-- hiveconf`- > `set`

### 配置参数

Hive 可选的配置参数非常多，在用到时查阅官方文档即可[AdminManual Configuration](https://cwiki.apache.org/confluence/display/Hive/AdminManual+Configuration)

## 参考资料

- [BigData-Notes](https://github.com/heibaiying/BigData-Notes)