---
title: ZooKeeper运维
date: 2020-06-02 22:28:38
categories:
  - 分布式
  - 分布式协同
  - ZooKeeper
tags:
  - 分布式
  - 协同
  - zookeeper
permalink: /pages/c26d08a8/
---

# ZooKeeper 运维指南

## 单点服务部署

在安装 ZooKeeper 之前，请确保你的系统是在以下任一操作系统上运行：

- **任意 Linux OS** - 支持开发和部署。适合演示应用程序。
- **Windows OS** - 仅支持开发。
- **Mac OS** - 仅支持开发。

安装步骤如下：

### 下载解压

进入官方下载地址：[http://zookeeper.apache.org/releases.html#download](http://zookeeper.apache.org/releases.html#download) ，选择合适版本。

解压到本地：

```bash
tar -zxf zookeeper-3.4.6.tar.gz
cd zookeeper-3.4.6
```

### 环境变量

执行 `vim /etc/profile`，添加环境变量：

```bash
export ZOOKEEPER_HOME=/usr/app/zookeeper-3.4.14
export PATH=$ZOOKEEPER_HOME/bin:$PATH
```

再执行 `source /etc/profile` ， 使得配置的环境变量生效。

### 修改配置

你必须创建 `conf/zoo.cfg` 文件，否则启动时会提示你没有此文件。

初次尝试，不妨直接使用 Kafka 提供的模板配置文件 `conf/zoo_sample.cfg`：

```bash
cp conf/zoo_sample.cfg conf/zoo.cfg
```

修改后完整配置如下：

```properties
# The number of milliseconds of each tick
tickTime=2000
# The number of ticks that the initial
# synchronization phase can take
initLimit=10
# The number of ticks that can pass between
# sending a request and getting an acknowledgement
syncLimit=5
# the directory where the snapshot is stored.
# do not use /tmp for storage, /tmp here is just
# example sakes.
dataDir=/usr/local/zookeeper/data
dataLogDir=/usr/local/zookeeper/log
# the port at which the clients will connect
clientPort=2181
# the maximum number of client connections.
# increase this if you need to handle more clients
#maxClientCnxns=60
#
# Be sure to read the maintenance section of the
# administrator guide before turning on autopurge.
#
# http://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_maintenance
#
# The number of snapshots to retain in dataDir
#autopurge.snapRetainCount=3
# Purge task interval in hours
# Set to "0" to disable auto purge feature
#autopurge.purgeInterval=1
```

配置参数说明：

- **tickTime**：用于计算的基础时间单元。比如 session 超时：N\*tickTime；
- **initLimit**：用于集群，允许从节点连接并同步到 master 节点的初始化连接时间，以 tickTime 的倍数来表示；
- **syncLimit**：用于集群， master 主节点与从节点之间发送消息，请求和应答时间长度（心跳机制）；
- **dataDir**：数据存储位置；
- **dataLogDir**：日志目录；
- **clientPort**：用于客户端连接的端口，默认 2181

### 启动服务

执行以下命令

```bash
bin/zkServer.sh start
```

执行此命令后，你将收到以下响应

```bash
JMX enabled by default
Using config: /Users/../zookeeper-3.4.6/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
```

### 停止服务

可以使用以下命令停止 zookeeper 服务器。

```bash
bin/zkServer.sh stop
```

## 集群服务部署

分布式系统节点数一般都要求是奇数，且最少为 3 个节点，Zookeeper 也不例外。

这里，规划一个含 3 个节点的最小 ZooKeeper 集群，主机名分别为 hadoop001，hadoop002，hadoop003 。

### 修改配置

修改配置文件 `zoo.cfg`，内容如下：

```properties
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/usr/local/zookeeper-cluster/data/
dataLogDir=/usr/local/zookeeper-cluster/log/
clientPort=2181

# server.1 这个1是服务器的标识，可以是任意有效数字，标识这是第几个服务器节点，这个标识要写到dataDir目录下面myid文件里
# 指名集群间通讯端口和选举端口
server.1=hadoop001:2287:3387
server.2=hadoop002:2287:3387
server.3=hadoop003:2287:3387
```

### 标识节点

分别在三台主机的 `dataDir` 目录下新建 `myid` 文件,并写入对应的节点标识。Zookeeper 集群通过 `myid` 文件识别集群节点，并通过上文配置的节点通信端口和选举端口来进行节点通信，选举出 Leader 节点。

创建存储目录：

```bash
# 三台主机均执行该命令
mkdir -vp  /usr/local/zookeeper-cluster/data/
```

创建并写入节点标识到 `myid` 文件：

```bash
# hadoop001主机
echo "1" > /usr/local/zookeeper-cluster/data/myid
# hadoop002主机
echo "2" > /usr/local/zookeeper-cluster/data/myid
# hadoop003主机
echo "3" > /usr/local/zookeeper-cluster/data/myid
```

### 启动集群

分别在三台主机上，执行如下命令启动服务：

```bash
/usr/app/zookeeper-cluster/zookeeper/bin/zkServer.sh start
```

### 集群验证

启动后使用 `zkServer.sh status` 查看集群各个节点状态。

## 参考资料

- [Zookeeper 安装](https://www.w3cschool.cn/zookeeper/zookeeper_installation.html)
- [Zookeeper 单机环境和集群环境搭建](https://github.com/heibaiying/BigData-Notes/blob/master/notes/installation/Zookeeper%E5%8D%95%E6%9C%BA%E7%8E%AF%E5%A2%83%E5%92%8C%E9%9B%86%E7%BE%A4%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA.md)
- [Zookeeper 客户端基础命令使用](https://www.runoob.com/w3cnote/zookeeper-bs-command.html)