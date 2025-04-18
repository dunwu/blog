---
icon: logos:hbase
title: HBase 运维
date: 2019-05-07 20:19:25
categories:
  - 数据库
  - 列式数据库
  - hbase
tags:
  - 数据库
  - 列式数据库
  - 大数据
  - hbase
  - 运维
permalink: /pages/e1c3bf67/
---

# HBase 运维

## 配置文件

- `backup-masters` - 默认情况下不存在。列出主服务器应在其上启动备份主进程的主机，每行一个主机。
- `hadoop-metrics2-hbase.properties` - 用于连接 HBase Hadoop 的 Metrics2 框架。
- `hbase-env.cmd` and hbase-env.sh - 用于 Windows 和 Linux / Unix 环境的脚本，用于设置 HBase 的工作环境，包括 Java，Java 选项和其他环境变量的位置。
- `hbase-policy.xml` - RPC 服务器用于对客户端请求进行授权决策的默认策略配置文件。仅在启用 HBase 安全性时使用。
- `hbase-site.xml` - 主要的 HBase 配置文件。此文件指定覆盖 HBase 默认配置的配置选项。您可以在 docs / hbase-default.xml 中查看（但不要编辑）默认配置文件。您还可以在 HBase Web UI 的 HBase 配置选项卡中查看群集的整个有效配置（默认值和覆盖）。
- `log4j.properties` - log4j 日志配置。
- `regionservers` - 包含应在 HBase 集群中运行 RegionServer 的主机列表。默认情况下，此文件包含单个条目 localhost。它应包含主机名或 IP 地址列表，每行一个，并且如果群集中的每个节点将在其 localhost 接口上运行 RegionServer，则应仅包含 localhost。

## 环境要求

- Java
  - HBase 2.0+ 要求 JDK8+
  - HBase 1.2+ 要求 JDK7+
- SSH - 环境要支持 SSH
- DNS - 环境中要在 hosts 配置本机 hostname 和本机 IP
- NTP - HBase 集群的时间要同步，可以配置统一的 NTP
- 平台 - 生产环境不推荐部署在 Windows 系统中
- Hadoop - 依赖 Hadoop 配套版本
- Zookeeper - 依赖 Zookeeper 配套版本

## 运行模式

### 单点

hbase-site.xml 配置如下：

```xml
<configuration>
  <property>
    <name>hbase.rootdir</name>
    <value>hdfs://namenode.example.org:8020/hbase</value>
  </property>
  <property>
    <name>hbase.cluster.distributed</name>
    <value>false</value>
  </property>
</configuration>
```

### 分布式

hbase-site.xm 配置如下：

```xml
<configuration>
  <property>
    <name>hbase.rootdir</name>
    <value>hdfs://namenode.example.org:8020/hbase</value>
  </property>
  <property>
    <name>hbase.cluster.distributed</name>
    <value>true</value>
  </property>
  <property>
    <name>hbase.zookeeper.quorum</name>
    <value>node-a.example.com,node-b.example.com,node-c.example.com</value>
  </property>
</configuration>
```

## 引用和引申

### 扩展阅读

- [Apache HBase Configuration](http://hbase.apache.org/book.html#configuration)
