---
icon: logos:redis
title: Redis 运维
date: 2020-06-24 10:45:38
categories:
  - 数据库
  - KV数据库
  - Redis
tags:
  - 数据库
  - KV数据库
  - Redis
  - 运维
permalink: /pages/246e9f5c/
---

# Redis 运维

> **Redis** 是一个高性能的 key-value 数据库。
>
> SET 操作每秒钟 110000 次；GET 操作每秒钟 81000 次。

## Redis 安装

### Window 下安装

**下载地址：**[https://github.com/MSOpenTech/redis/releases](https://github.com/MSOpenTech/redis/releases)。

Redis 支持 32 位和 64 位。这个需要根据你系统平台的实际情况选择，这里我们下载 **Redis-x64-xxx.zip**压缩包到 C 盘，解压后，将文件夹重新命名为 **redis**。

打开一个 **cmd** 窗口 使用 cd 命令切换目录到 **C:\redis** 运行 **redis-server.exe redis.windows.conf** 。

如果想方便的话，可以把 redis 的路径加到系统的环境变量里，这样就省得再输路径了，后面的那个 redis.windows.conf 可以省略，如果省略，会启用默认的。

这时候另启一个 cmd 窗口，原来的不要关闭，不然就无法访问服务端了。

切换到 redis 目录下运行 **redis-cli.exe -h 127.0.0.1 -p 6379** 。

### Linux 下安装

**下载地址：** http://redis.io/download，下载最新文档版本。

下载、解压、编译 Redis

```shell
wget http://download.redis.io/releases/redis-5.0.4.tar.gz
tar xzf redis-5.0.4.tar.gz
cd redis-5.0.4
make
```

为了编译 Redis 源码，你需要 gcc-c++和 tcl。如果你的系统是 CentOS，可以直接执行命令：`yum install -y gcc-c++ tcl` 来安装。

进入到解压后的 `src` 目录，通过如下命令启动 Redis:

```shell
src/redis-server
```

您可以使用内置的客户端与 Redis 进行交互:

```shell
$ src/redis-cli
redis> set foo bar
OK
redis> get foo
"bar"
```

### Ubuntu 下安装

在 Ubuntu 系统安装 Redis 可以使用以下命令:

```shell
sudo apt-get update
sudo apt-get install redis-server
```

### 开机启动

- 开机启动配置：`echo "/usr/local/bin/redis-server /etc/redis.conf" >> /etc/rc.local`

### 开放防火墙端口

- 添加规则：`iptables -I INPUT -p tcp -m tcp --dport 6379 -j ACCEPT`
- 保存规则：`service iptables save`
- 重启 iptables：`service iptables restart`

### Redis 安装脚本

> CentOS7 环境安装脚本：[软件运维配置脚本集合](https://github.com/dunwu/linux-tutorial/tree/master/codes/linux/soft)

**安装说明**

- 采用编译方式安装 Redis, 并将其注册为 systemd 服务
- 安装路径为：`/usr/local/redis`
- 默认下载安装 `5.0.4` 版本，端口号为：`6379`，密码为空

**使用方法**

- 默认安装 - 执行以下任意命令即可：

```shell
curl -o- https://gitee.com/turnon/linux-tutorial/raw/master/codes/linux/soft/redis-install.sh | bash
wget -qO- https://gitee.com/turnon/linux-tutorial/raw/master/codes/linux/soft/redis-install.sh | bash
```

- 自定义安装 - 下载脚本到本地，并按照以下格式执行：

```shell
sh redis-install.sh [version] [port] [password]
```

参数说明：

- `version` - redis 版本号
- `port` - redis 服务端口号
- `password` - 访问密码

## Redis 单机使用和配置

### 启动 Redis

**启动 redis 服务**

```shell
cd /usr/local/redis/src
./redis-server
```

**启动 redis 客户端**

```shell
cd /usr/local/redis/src
./redis-cli
```

**查看 redis 是否启动**

```shell
redis-cli
```

以上命令将打开以下终端：

```shell
redis 127.0.0.1:6379>
```

127.0.0.1 是本机 IP ，6379 是 redis 服务端口。现在我们输入 PING 命令。

```shell
redis 127.0.0.1:6379> ping
PONG
```

以上说明我们已经成功启动了 redis。

### Redis 常见配置

> Redis 默认的配置文件是根目录下的 `redis.conf` 文件。
>
> 如果需要指定特定文件作为配置文件，需要使用命令： `./redis-server -c xxx.conf`
>
> 每次修改配置后，需要重启才能生效。
>
> Redis 官方默认配置：
>
> - 自描述文档 [redis.conf for Redis 2.8](https://raw.githubusercontent.com/antirez/redis/2.8/redis.conf)
> - 自描述文档 [redis.conf for Redis 2.6](https://raw.githubusercontent.com/antirez/redis/2.6/redis.conf).
> - 自描述文档 [redis.conf for Redis 2.4](https://raw.githubusercontent.com/antirez/redis/2.4/redis.conf).
>
> 自 Redis2.6 起就可以直接通过命令行传递 Redis 配置参数。这种方法可以用于测试。自 Redis2.6 起就可以直接通过命令行传递 Redis 配置参数。这种方法可以用于测试。

### 设为守护进程

Redis 默认以非守护进程方式启动，而通常我们会将 Redis 设为守护进程启动方式，配置：`daemonize yes`

#### 远程访问

Redis 默认绑定 127.0.0.1，这样就只能本机才能访问，若要 Redis 允许远程访问，需要配置：`bind 0.0.0.0`

#### 设置密码

Redis 默认访问不需要密码，如果需要设置密码，需要如下配置：

- `protected-mode yes`
- `requirepass <密码>`

#### 配置参数表

| 配置项                                                                                                                                                                                                                 | 说明                                                                                                                                                                                                                                                                                     |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `daemonize no`                                                                                                                                                                                                         | Redis 默认不是以守护进程的方式运行，可以通过该配置项修改，使用 yes 启用守护进程（Windows 不支持守护线程的配置为 no ）                                                                                                                                                                    |
| `pidfile /var/run/redis.pid`                                                                                                                                                                                           | 当 Redis 以守护进程方式运行时，Redis 默认会把 pid 写入 /var/run/redis.pid 文件，可以通过 pidfile 指定                                                                                                                                                                                    |
| `port 6379`                                                                                                                                                                                                            | 指定 Redis 监听端口，默认端口为 6379，作者在自己的一篇博文中解释了为什么选用 6379 作为默认端口，因为 6379 在手机按键上 MERZ 对应的号码，而 MERZ 取自意大利歌女 Alessia Merz 的名字                                                                                                       |
| `bind 127.0.0.1`                                                                                                                                                                                                       | 绑定的主机地址                                                                                                                                                                                                                                                                           |
| `timeout 300`                                                                                                                                                                                                          | 当客户端闲置多长时间后关闭连接，如果指定为 0，表示关闭该功能                                                                                                                                                                                                                             |
| `loglevel notice`                                                                                                                                                                                                      | 指定日志记录级别，Redis 总共支持四个级别：debug、verbose、notice、warning，默认为 notice                                                                                                                                                                                                 |
| `logfile stdout`                                                                                                                                                                                                       | 日志记录方式，默认为标准输出，如果配置 Redis 为守护进程方式运行，而这里又配置为日志记录方式为标准输出，则日志将会发送给 /dev/null                                                                                                                                                        |
| `databases 16`                                                                                                                                                                                                         | 设置数据库的数量，默认数据库为 0，可以使用 SELECT 命令在连接上指定数据库 id                                                                                                                                                                                                              |
| `save <seconds> <changes>` Redis 默认配置文件中提供了三个条件：**save 900 1**、**save 300 10**、**save 60 10000** 分别表示 900 秒（15 分钟）内有 1 个更改，300 秒（5 分钟）内有 10 个更改以及 60 秒内有 10000 个更改。 | 指定在多长时间内，有多少次更新操作，就将数据同步到数据文件，可以多个条件配合                                                                                                                                                                                                             |
| `rdbcompression yes`                                                                                                                                                                                                   | 指定存储至本地数据库时是否压缩数据，默认为 yes，Redis 采用 LZF 压缩，如果为了节省 CPU 时间，可以关闭该选项，但会导致数据库文件变的巨大                                                                                                                                                   |
| `dbfilename dump.rdb`                                                                                                                                                                                                  | 指定本地数据库文件名，默认值为 dump.rdb                                                                                                                                                                                                                                                  |
| `dir ./`                                                                                                                                                                                                               | 指定本地数据库存放目录                                                                                                                                                                                                                                                                   |
| `slaveof <masterip> <masterport>`                                                                                                                                                                                      | 设置当本机为 slav 服务时，设置 master 服务的 IP 地址及端口，在 Redis 启动时，它会自动从 master 进行数据同步                                                                                                                                                                              |
| `masterauth <master-password>`                                                                                                                                                                                         | 当 master 服务设置了密码保护时，slav 服务连接 master 的密码                                                                                                                                                                                                                              |
| `requirepass foobared`                                                                                                                                                                                                 | 设置 Redis 连接密码，如果配置了连接密码，客户端在连接 Redis 时需要通过 `AUTH <password>` 命令提供密码，默认关闭                                                                                                                                                                          |
| `maxclients 128`                                                                                                                                                                                                       | 设置同一时间最大客户端连接数，默认无限制，Redis 可以同时打开的客户端连接数为 Redis 进程可以打开的最大文件描述符数，如果设置 maxclients 0，表示不作限制。当客户端连接数到达限制时，Redis 会关闭新的连接并向客户端返回 max number of clients reached 错误信息                              |
| `maxmemory <bytes>`                                                                                                                                                                                                    | 指定 Redis 最大内存限制，Redis 在启动时会把数据加载到内存中，达到最大内存后，Redis 会先尝试清除已到期或即将到期的 Key，当此方法处理 后，仍然到达最大内存设置，将无法再进行写入操作，但仍然可以进行读取操作。Redis 新的 vm 机制，会把 Key 存放内存，Value 会存放在 swap 区                |
| `appendonly no`                                                                                                                                                                                                        | 指定是否在每次更新操作后进行日志记录，Redis 在默认情况下是异步的把数据写入磁盘，如果不开启，可能会在断电时导致一段时间内的数据丢失。因为 redis 本身同步数据文件是按上面 save 条件来同步的，所以有的数据会在一段时间内只存在于内存中。默认为 no                                           |
| `appendfilename appendonly.aof`                                                                                                                                                                                        | 指定更新日志文件名，默认为 appendonly.aof                                                                                                                                                                                                                                                |
| `appendfsync everysec`                                                                                                                                                                                                 | 指定更新日志条件，共有 3 个可选值：**no**：表示等操作系统进行数据缓存同步到磁盘（快）**always**：表示每次更新操作后手动调用 fsync() 将数据写到磁盘（慢，安全）**everysec**：表示每秒同步一次（折中，默认值）                                                                             |
| `vm-enabled no`                                                                                                                                                                                                        | 指定是否启用虚拟内存机制，默认值为 no，简单的介绍一下，VM 机制将数据分页存放，由 Redis 将访问量较少的页即冷数据 swap 到磁盘上，访问多的页面由磁盘自动换出到内存中（在后面的文章我会仔细分析 Redis 的 VM 机制）                                                                           |
| `vm-swap-file /tmp/redis.swap`                                                                                                                                                                                         | 虚拟内存文件路径，默认值为 /tmp/redis.swap，不可多个 Redis 实例共享                                                                                                                                                                                                                      |
| `vm-max-memory 0`                                                                                                                                                                                                      | 将所有大于 vm-max-memory 的数据存入虚拟内存，无论 vm-max-memory 设置多小，所有索引数据都是内存存储的(Redis 的索引数据 就是 keys)，也就是说，当 vm-max-memory 设置为 0 的时候，其实是所有 value 都存在于磁盘。默认值为 0                                                                  |
| `vm-page-size 32`                                                                                                                                                                                                      | Redis swap 文件分成了很多的 page，一个对象可以保存在多个 page 上面，但一个 page 上不能被多个对象共享，vm-page-size 是要根据存储的 数据大小来设定的，作者建议如果存储很多小对象，page 大小最好设置为 32 或者 64bytes；如果存储很大大对象，则可以使用更大的 page，如果不确定，就使用默认值 |
| `vm-pages 134217728`                                                                                                                                                                                                   | 设置 swap 文件中的 page 数量，由于页表（一种表示页面空闲或使用的 bitmap）是在放在内存中的，，在磁盘上每 8 个 pages 将消耗 1byte 的内存。                                                                                                                                                 |
| `vm-max-threads 4`                                                                                                                                                                                                     | 设置访问 swap 文件的线程数,最好不要超过机器的核数,如果设置为 0,那么所有对 swap 文件的操作都是串行的，可能会造成比较长时间的延迟。默认值为 4                                                                                                                                              |
| `glueoutputbuf yes`                                                                                                                                                                                                    | 设置在向客户端应答时，是否把较小的包合并为一个包发送，默认为开启                                                                                                                                                                                                                         |
| `hash-max-zipmap-entries 64 hash-max-zipmap-value 512`                                                                                                                                                                 | 指定在超过一定的数量或者最大的元素超过某一临界值时，采用一种特殊的哈希算法                                                                                                                                                                                                               |
| `activerehashing yes`                                                                                                                                                                                                  | 指定是否激活重置哈希，默认为开启（后面在介绍 Redis 的哈希算法时具体介绍）                                                                                                                                                                                                                |
| `include /path/to/local.conf`                                                                                                                                                                                          | 指定包含其它的配置文件，可以在同一主机上多个 Redis 实例之间使用同一份配置文件，而同时各个实例又拥有自己的特定配置文件                                                                                                                                                                    |

### 压力测试

> 参考官方文档：[How fast is Redis?](https://redis.io/topics/benchmarks)

Redis 自带了一个性能测试工具：`redis-benchmark`

**（1）基本测试**

```shell
redis-benchmark -q -n 100000
```

- `-q` 表示静默（quiet）执行
- `-n 100000` 请求 10 万次

**（2）测试指定读写指令**

```shell
$ redis-benchmark -t set,lpush -n 100000 -q
SET: 74239.05 requests per second
LPUSH: 79239.30 requests per second
```

**（3）测试 pipeline 模式下指定读写指令**

```shell
redis-benchmark -n 1000000 -t set,get -P 16 -q
SET: 403063.28 requests per second
GET: 508388.41 requests per second
```

## Redis 集群使用和配置

Redis 3.0 后支持集群模式。

### 集群规划

`Redis` 集群一般由 **多个节点** 组成，节点数量至少为 `6` 个，才能保证组成 **完整高可用** 的集群。

![img](https://user-gold-cdn.xitu.io/2019/10/10/16db5250b0d1c392?w=1467&h=803&f=png&s=43428)

理想情况当然是所有节点各自在不同的机器上，首先于资源，本人在部署 Redis 集群时，只得到 3 台服务器。所以，我计划每台服务器部署 2 个 Redis 节点。

【示例】最简高可用 Redis 集群规划

机器配置：16G 内存 + 8 核 CPU + 1T 磁盘

Redis 进程分配 10 G 内存。一般线上生产环境，Redis 的内存尽量不要超过 10g，超过 10g 可能会有问题。

集群拓扑：三主三从；三哨兵，每个哨兵监听所有主节点。

估算性能：

- 容量：三主，占用 30 G 内存，所以最大存储容量为 30 G。假设每条数据记录平均 大小为 10 K，则最大能存储 300 万条数据。
- 吞吐量：单机一般 TPS/QPS 为 五万到八万左右。假设为五万，那么三主三从架构理论上能达到 TPS 15 万，QPS 30 万。

### 部署集群

> Redis 集群节点的安装与单节点服务相同，差异仅在于部署方式。
>
> 注意：为了演示方便，本示例将所有 Redis 集群节点都部署在一台机器上，实际生产环境中，基本都会将节点部署在不同机器上。要求更高的，可能还要考虑多机房部署。

（1）创建节点目录

我个人偏好将软件放在 `/opt` 目录下，在我的机器中，Redis 都安装在 `/usr/local/redis` 目录下。所以，下面的命令和配置都假设 Redis 安装目录为 `/usr/local/redis` 。

确保机器上已经安装了 Redis 后，执行以下命令，创建 Redis 集群节点实例目录：

```shell
sudo mkdir -p /usr/local/redis/conf/7001
sudo mkdir -p /usr/local/redis/conf/7002
sudo mkdir -p /usr/local/redis/conf/7003
sudo mkdir -p /usr/local/redis/conf/7004
sudo mkdir -p /usr/local/redis/conf/7005
sudo mkdir -p /usr/local/redis/conf/7006
```

（2）配置集群节点

每个实例目录下，新建 `redis.conf` 配置文件。

实例配置模板以 7001 节点为例（其他节点，完全替换配置中的端口号 7001 即可），如下：

```shell
# 端口号
port 7001
# 绑定的主机端口（0.0.0.0 表示允许远程访问）
bind 0.0.0.0
# 以守护进程方式启动
daemonize yes

# 开启集群模式
cluster-enabled yes
# 集群的配置，配置文件首次启动自动生成
cluster-config-file /usr/local/redis/conf/7001/7001.conf
# 请求超时时间，设置 10 秒
cluster-node-timeout 10000

# 开启 AOF 持久化
appendonly yes
# 数据存放目录
dir /usr/local/redis/conf/7001
# 进程文件
pidfile /usr/local/redis/conf/7001/7001.pid
# 日志文件
logfile /usr/local/redis/conf/7001/7001.log
```

（3）批量启动 Redis 节点

Redis 的 utils/create-cluster 目录下自带了一个名为 create-cluster 的脚本工具，可以利用它来新建、启动、停止、重启 Redis 节点。

脚本中有几个关键参数：

- `PORT`=30000 - 初始端口号
- `TIMEOUT`=2000 - 超时时间
- `NODES`=6 - 节点数
- `REPLICAS`=1 - 备份数

脚本中的每个命令项会根据初始端口号，以及设置的节点数，遍历的去执行操作。

由于前面的规划中，节点端口是从 7001 ~ 7006，所以需要将 PORT 变量设为 7000。

脚本中启动每个 Redis 节点是通过指定命令行参数来配置属性。所以，我们需要改一下：

```shell
PORT=7000
TIMEOUT=2000
NODES=6
ENDPORT=$((PORT+NODES))

# ...

if [ "$1" == "start" ]
then
    while [ $((PORT < ENDPORT)) != "0" ]; do
        PORT=$((PORT+1))
        echo "Starting $PORT"
        /usr/local/redis/src/redis-server /usr/local/redis/conf/${PORT}/redis.conf
    done
    exit 0
fi
```

好了，在每台服务器上，都执行 `./create-cluster start` 来启动节点。

然后，通过 ps 命令来确认 Redis 进程是否已经工作：

```shell
# root @ dbClusterDev01 in /usr/local/redis/conf [11:07:55]
$ ps -ef | grep redis
root      4604     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7001 [cluster]
root      4609     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7002 [cluster]
root      4614     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7003 [cluster]
root      4619     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7004 [cluster]
root      4624     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7005 [cluster]
root      4629     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7006 [cluster]
```

（4）启动集群

通过 `redis-cli --cluster create` 命令可以自动配置集群，如下：

```shell
./redis-cli --cluster create 127.0.0.1:7001 127.0.0.1:7002 127.0.0.2:7003 127.0.0.2:7004 127.0.0.3:7005 127.0.0.3:7006 --cluster-replicas 1
```

redis-cluster 会根据设置的节点数和副本数自动分片（分配 Hash 虚拟槽 slot），如果满意，输入 yes ，直接开始分片。

```shell
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 127.0.0.2:7004 to 127.0.0.1:7001
Adding replica 127.0.0.3:7006 to 127.0.0.2:7003
Adding replica 127.0.0.1:7002 to 127.0.0.3:7005
M: b721235997deb6b9a7a2be690b5b9663db8057c6 127.0.0.1:7001
   slots:[0-5460] (5461 slots) master
S: bda9b7036df0bbefe601bda4ce45d3787a2e9bd9 127.0.0.1:7002
   replicates 3623fff69b5243ed18c02a2fbb6f53069b0f1505
M: 91523c0391a044da6cc9f53bb965aabe89502187 127.0.0.2:7003
   slots:[5461-10922] (5462 slots) master
S: 9d899cbe49dead7b8c4f769920cdb75714a441ae 127.0.0.2:7004
   replicates b721235997deb6b9a7a2be690b5b9663db8057c6
M: 3623fff69b5243ed18c02a2fbb6f53069b0f1505 127.0.0.3:7005
   slots:[10923-16383] (5461 slots) master
S: a2869dc153ea4977ca790b76483574a5d56cb40e 127.0.0.3:7006
   replicates 91523c0391a044da6cc9f53bb965aabe89502187
Can I set the above configuration? (type 'yes' to accept): yes
>>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join
....
>>> Performing Cluster Check (using node 127.0.0.1:7001)
M: b721235997deb6b9a7a2be690b5b9663db8057c6 127.0.0.1:7001
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
S: a2869dc153ea4977ca790b76483574a5d56cb40e 127.0.0.1:7006
   slots: (0 slots) slave
   replicates 91523c0391a044da6cc9f53bb965aabe89502187
M: 91523c0391a044da6cc9f53bb965aabe89502187 127.0.0.1:7003
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
M: 3623fff69b5243ed18c02a2fbb6f53069b0f1505 127.0.0.1:7005
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
S: 9d899cbe49dead7b8c4f769920cdb75714a441ae 127.0.0.1:7004
   slots: (0 slots) slave
   replicates b721235997deb6b9a7a2be690b5b9663db8057c6
S: bda9b7036df0bbefe601bda4ce45d3787a2e9bd9 127.0.0.1:7002
   slots: (0 slots) slave
   replicates 3623fff69b5243ed18c02a2fbb6f53069b0f1505
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```

（5）日常维护操作

- 关闭集群 - `./create-cluster stop`
- 检查集群是否健康（指定任意节点即可）：`./redis-cli --cluster check <ip:port>`
- 尝试修复集群节点：`./redis-cli --cluster fix <ip:port>`

### 部署哨兵

redis-cluster 实现了 Redis 的分片、复制。

但 redis-cluster 没有解决故障转移问题，一旦任意分片的 Master 节点宕机、网络不通，就会导致 redis-cluster 的集群不能工作。为了解决高可用的问题，Redis 提供了 Redis 哨兵来监控 Redis 节点状态，并且会在 Master 宕机时，发起选举，将这个 Master 的一个 Slave 节点选举为 Master。

（1）创建节点目录

我个人偏好将软件放在 `/opt` 目录下，在我的机器中，Redis 都安装在 `/usr/local/redis` 目录下。所以，下面的命令和配置都假设 Redis 安装目录为 `/usr/local/redis` 。

确保机器上已经安装了 Redis 后，执行以下命令，创建 Redis 集群节点实例目录：

```shell
sudo mkdir -p /usr/local/redis/conf/27001
sudo mkdir -p /usr/local/redis/conf/27002
sudo mkdir -p /usr/local/redis/conf/27003
```

（2）配置集群节点

每个实例目录下，新建 `redis.conf` 配置文件。

实例配置模板以 7001 节点为例（其他节点，完全替换配置中的端口号 7001 即可），如下：

```shell
port 27001
daemonize yes
sentinel monitor redis-master 172.22.6.3 7001 2
sentinel down-after-milliseconds redis-master 5000
sentinel failover-timeout redis-master 900000
sentinel parallel-syncs redis-master 1
#sentinel auth-pass redis-master 123456
logfile /usr/local/redis/conf/27001/27001.log
```

（3）批量启动哨兵节点

```
/opt/redis/src/redis-sentinel /usr/local/redis/conf/27001/sentinel.conf
/opt/redis/src/redis-sentinel /usr/local/redis/conf/27002/sentinel.conf
/opt/redis/src/redis-sentinel /usr/local/redis/conf/27003/sentinel.conf
```

### 扩容

（1）查看信息

进入任意节点

```
./redis-cli -h 172.22.6.3 -p 7001
```

cluster info 查看集群节点状态

```
172.22.6.3:7001> cluster nodes
f158bf70bb2767cac271ce4efcfc14ba0b7ca98b 172.22.6.3:7006@17006 slave e7aa182e756b76ec85b471797db9b66e4b2da725 0 1594528179000 6 connected
f348e67648460c7a800120d69b4977bf2e4524cb 172.22.6.3:7001@17001 myself,master - 0 1594528179000 1 connected 0-5460
52601e2d4af0e64b83f4cc6d20e8316d0ac38b99 172.22.6.3:7004@17004 slave 4802fafe897160c46392c6e569d6f5e466cca696 0 1594528178000 4 connected
c6c6a68674ae8aac3c6ec792c8af4dc1228c6c31 172.22.6.3:7005@17005 slave f348e67648460c7a800120d69b4977bf2e4524cb 0 1594528179852 5 connected
e7aa182e756b76ec85b471797db9b66e4b2da725 172.22.6.3:7002@17002 master - 0 1594528178000 2 connected 5461-10922
4802fafe897160c46392c6e569d6f5e466cca696 172.22.6.3:7003@17003 master - 0 1594528178000 3 connected 10923-16383
```

cluster info 查看集群信息

```
172.22.6.3:7001> cluster info
cluster_state:ok
cluster_slots_assigned:16384
cluster_slots_ok:16384
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6
cluster_size:3
cluster_current_epoch:6
cluster_my_epoch:1
cluster_stats_messages_ping_sent:3406
cluster_stats_messages_pong_sent:3569
cluster_stats_messages_publish_sent:5035
cluster_stats_messages_sent:12010
cluster_stats_messages_ping_received:3564
cluster_stats_messages_pong_received:3406
cluster_stats_messages_meet_received:5
cluster_stats_messages_publish_received:5033
cluster_stats_messages_received:12008
```

（2）添加节点到集群

将已启动的节点实例添加到集群中

```
redis-cli --cluster add-node 127.0.0.1:7007 127.0.0.1:7008
```

**添加主节点**

添加一组主节点

```
./redis-cli --cluster add-node 172.22.6.3:7007 172.22.6.3:7001
./redis-cli --cluster add-node 172.22.6.3:7008 172.22.6.3:7001
./redis-cli --cluster add-node 172.22.6.3:7009 172.22.6.3:7001
```

查看节点状态

```
172.22.6.3:7001> cluster nodes
f158bf70bb2767cac271ce4efcfc14ba0b7ca98b 172.22.6.3:7006@17006 slave e7aa182e756b76ec85b471797db9b66e4b2da725 0 1594529342575 6 connected
f348e67648460c7a800120d69b4977bf2e4524cb 172.22.6.3:7001@17001 myself,master - 0 1594529340000 1 connected 0-5460
55cacf121662833a4a19dbeb4a5df712cfedf77f 172.22.6.3:7009@17009 master - 0 1594529342000 0 connected
c6c6a68674ae8aac3c6ec792c8af4dc1228c6c31 172.22.6.3:7005@17005 slave f348e67648460c7a800120d69b4977bf2e4524cb 0 1594529341573 5 connected
4802fafe897160c46392c6e569d6f5e466cca696 172.22.6.3:7003@17003 master - 0 1594529343577 3 connected 10923-16383
e7aa182e756b76ec85b471797db9b66e4b2da725 172.22.6.3:7002@17002 master - 0 1594529342000 2 connected 5461-10922
e5ba78fe629115977a74fbbe1478caf8868d6d55 172.22.6.3:7007@17007 master - 0 1594529341000 0 connected
52601e2d4af0e64b83f4cc6d20e8316d0ac38b99 172.22.6.3:7004@17004 slave 4802fafe897160c46392c6e569d6f5e466cca696 0 1594529340000 4 connected
79d4fffc2cec210556c3b4c44e63ab506e87eda3 172.22.6.3:7008@17008 master - 0 1594529340000 7 connected
```

可以发现，新加入的三个主节点，还没有分配哈希槽，所以，暂时还无法访问。

**添加从节点**

--slave：设置该参数，则新节点以 slave 的角色加入集群  
--master-id：这个参数需要设置了--slave 才能生效，--master-id 用来指定新节点的 master 节点。如果不设置该参数，则会随机为节点选择 master 节点。

语法

```
redis-cli --cluster add-node  新节点IP地址：端口    存在节点IP：端口 --cluster-slave （从节点） --cluster-master-id （master节点的ID）
redis-cli --cluster add-node   10.42.141.119:6379  10.42.166.105:6379  --cluster-slave   --cluster-master-id  dfa238fff8a7a49230cff7eb74f573f5645c8ec5
```

示例

```
./redis-cli --cluster add-node 172.22.6.3:7010 172.22.6.3:7007 --cluster-slave
./redis-cli --cluster add-node 172.22.6.3:7011 172.22.6.3:7008 --cluster-slave
./redis-cli --cluster add-node 172.22.6.3:7012 172.22.6.3:7009 --cluster-slave
```

查看状态

```
172.22.6.3:7001> cluster nodes
ef5c1b9ce4cc795dc12b2c1e8736a572647b4c3e 172.22.6.3:7011@17011 slave 79d4fffc2cec210556c3b4c44e63ab506e87eda3 0 1594529492043 7 connected
f158bf70bb2767cac271ce4efcfc14ba0b7ca98b 172.22.6.3:7006@17006 slave e7aa182e756b76ec85b471797db9b66e4b2da725 0 1594529491943 6 connected
f348e67648460c7a800120d69b4977bf2e4524cb 172.22.6.3:7001@17001 myself,master - 0 1594529488000 1 connected 0-5460
5140d1129ed850df59c51cf818c4eb74545d9959 172.22.6.3:7010@17010 slave e5ba78fe629115977a74fbbe1478caf8868d6d55 0 1594529488000 0 connected
55cacf121662833a4a19dbeb4a5df712cfedf77f 172.22.6.3:7009@17009 master - 0 1594529488000 8 connected
c6c6a68674ae8aac3c6ec792c8af4dc1228c6c31 172.22.6.3:7005@17005 slave f348e67648460c7a800120d69b4977bf2e4524cb 0 1594529490000 5 connected
4802fafe897160c46392c6e569d6f5e466cca696 172.22.6.3:7003@17003 master - 0 1594529489939 3 connected 10923-16383
e7aa182e756b76ec85b471797db9b66e4b2da725 172.22.6.3:7002@17002 master - 0 1594529491000 2 connected 5461-10922
e5ba78fe629115977a74fbbe1478caf8868d6d55 172.22.6.3:7007@17007 master - 0 1594529490942 0 connected
52601e2d4af0e64b83f4cc6d20e8316d0ac38b99 172.22.6.3:7004@17004 slave 4802fafe897160c46392c6e569d6f5e466cca696 0 1594529491000 4 connected
02e9f57b5b45c350dc57acf1c8efa8db136db7b7 172.22.6.3:7012@17012 master - 0 1594529489000 0 connected
79d4fffc2cec210556c3b4c44e63ab506e87eda3 172.22.6.3:7008@17008 master - 0 1594529489000 7 connected
```

分配哈希槽

执行 `./redis-cli --cluster rebalance 172.22.6.3:7001 --cluster-threshold 1 --cluster-use-empty-masters`

参数说明：

rebalance：表明让 Redis 自动根据节点数进行均衡哈希槽分配。

--cluster-use-empty-masters：表明

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200712125827.png)

执行结束后，查看状态：

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200712130234.png)

## Redis 命令

### 通用命令

> 命令详细用法，请参考 [**Redis 命令官方文档**](https://redis.io/commands)
>
> 搬迁两张 cheat sheet 图，原址：https://www.cheatography.com/tasjaevan/cheat-sheets/redis/

![img](https://user-gold-cdn.xitu.io/2019/10/10/16db5250b0b8ea57?w=2230&h=2914&f=png&s=246433)

![img](https://user-gold-cdn.xitu.io/2019/10/10/16db5250b0e9ba3c?w=2229&h=2890&f=png&s=192997)

### 集群命令

- **集群**
  - `cluster info` - 打印集群的信息
  - `cluster nodes` - 列出集群当前已知的所有节点（ node），以及这些节点的相关信息。
- **节点**
  - `cluster meet <ip> <port>` - 将 ip 和 port 所指定的节点添加到集群当中，让它成为集群的一份子。
  - `cluster forget <node_id>` - 从集群中移除 node_id 指定的节点。
  - `cluster replicate <node_id>` - 将当前节点设置为 node_id 指定的节点的从节点。
  - `cluster saveconfig` - 将节点的配置文件保存到硬盘里面。
- **槽(slot)**
  - `cluster addslots <slot> [slot ...]` - 将一个或多个槽（ slot）指派（ assign）给当前节点。
  - `cluster delslots <slot> [slot ...]` - 移除一个或多个槽对当前节点的指派。
  - `cluster flushslots` - 移除指派给当前节点的所有槽，让当前节点变成一个没有指派任何槽的节点。
  - `cluster setslot <slot> node <node_id>` - 将槽 slot 指派给 node_id 指定的节点，如果槽已经指派给另一个节点，那么先让另一个节点删除该槽>，然后再进行指派。
  - `cluster setslot <slot> migrating <node_id>` - 将本节点的槽 slot 迁移到 node_id 指定的节点中。
  - `cluster setslot <slot> importing <node_id>` - 从 node_id 指定的节点中导入槽 slot 到本节点。
  - `cluster setslot <slot> stable` - 取消对槽 slot 的导入（ import）或者迁移（ migrate）。
- **键**
  - `cluster keyslot <key>` - 计算键 key 应该被放置在哪个槽上。
  - `cluster countkeysinslot <slot>` - 返回槽 slot 目前包含的键值对数量。
  - `cluster getkeysinslot <slot> <count>` - 返回 count 个 slot 槽中的键。

### 重新分片

添加节点：./redis-cli --cluster add-node 192.168.1.136:7007 192.168.1.136:7001 --cluster-slave

redis-cli --cluster reshard 172.22.6.3 7001

## 客户端

推荐使用 [**RedisDesktopManager**](https://github.com/uglide/RedisDesktopManager)

## 参考资料

- **官网**
  - [Redis 官网](https://redis.io/)
  - [Redis Github](https://github.com/antirez/redis)
  - [Redis 官方文档中文版](http://redis.cn/)
- **书籍**
  - [《Redis 实战》](https://item.jd.com/11791607.html)
  - [《Redis 设计与实现》](https://item.jd.com/11486101.html)
- **教程**
  - [Redis 命令参考](http://redisdoc.com/)
- **文章**
  - [深入剖析 Redis 系列(三) - Redis 集群模式搭建与原理详解](https://juejin.im/post/5b8fc5536fb9a05d2d01fb11)
