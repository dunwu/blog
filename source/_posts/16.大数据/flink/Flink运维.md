---
title: Flink 运维
date: 2022-02-21 09:44:33
order: 07
categories:
  - 大数据
  - flink
tags:
  - 大数据
  - Flink
  - 运维
permalink: /pages/ee696c77/
---

# Flink 运维

## docker 安装 flink

（1）使用 docker 命令拉取镜像

```bash
docker pull flink
```

（2）编写 `docker-compose.yml`，内容如下：

```yml
version: '2.1'
services:
  jobmanager:
    image: flink
    expose:
      - '6123'
    ports:
      - '8081:8081'
    command: jobmanager
    environment:
      - JOB_MANAGER_RPC_ADDRESS=jobmanager

  taskmanager:
    image: flink
    expose:
      - '6121'
      - '6122'
    depends_on:
      - jobmanager
    command: taskmanager
    links:
      - 'jobmanager:jobmanager'
    environment:
      - JOB_MANAGER_RPC_ADDRESS=jobmanager
```

（3）执行 docker-compose，命令如下：

```
docker-compose up -d
```

（4）打开浏览器，访问 http://127.0.0.1:8081

## Flink 配置

### 基础配置

```yml
# jobManager 的IP地址
jobmanager.rpc.address: localhost

# JobManager 的端口号
jobmanager.rpc.port: 6123

# JobManager JVM heap 内存大小
jobmanager.heap.size: 1024m

# TaskManager JVM heap 内存大小
taskmanager.heap.size: 1024m

# 每个 TaskManager 提供的任务 slots 数量大小
taskmanager.numberOfTaskSlots: 1

# 程序默认并行计算的个数
parallelism.default: 1
# 文件系统来源
# fs.default-scheme
```

### 高可用配置

```yml
# 可以选择 'NONE' 或者 'zookeeper'.
# high-availability: zookeeper

# 文件系统路径，让 Flink 在高可用性设置中持久保存元数据
# high-availability.storageDir: hdfs:///flink/ha/

# zookeeper 集群中仲裁者的机器 ip 和 port 端口号
# high-availability.zookeeper.quorum: localhost:2181

# 默认是 open，如果 zookeeper security 启用了该值会更改成 creator
# high-availability.zookeeper.client.acl: open
```

### 容错和 checkpoint 配置

```yml
# 用于存储和检查点状态
# state.backend: filesystem

# 存储检查点的数据文件和元数据的默认目录
# state.checkpoints.dir: hdfs://namenode-host:port/flink-checkpoints

# savepoints 的默认目标目录(可选)
# state.savepoints.dir: hdfs://namenode-host:port/flink-checkpoints

# 用于启用/禁用增量 checkpoints 的标志
# state.backend.incremental: false
```

### Web UI 配置

```yml
# 基于 Web 的运行时监视器侦听的地址.
#jobmanager.web.address: 0.0.0.0

#  Web 的运行时监视器端口
rest.port: 8081
# 是否从基于 Web 的 jobmanager 启用作业提交
# jobmanager.web.submit.enable: false
```

### 高级配置

```yml
# io.tmp.dirs: /tmp

# 是否应在 TaskManager 启动时预先分配 TaskManager 管理的内存
# taskmanager.memory.preallocate: false

# 类加载解析顺序，是先检查用户代码 jar（“child-first”）还是应用程序类路径（“parent-first”）。 默认设置指示首先从用户代码 jar 加载类
# classloader.resolve-order: child-first

# 用于网络缓冲区的 JVM 内存的分数。 这决定了 TaskManager 可以同时拥有多少流数据交换通道以及通道缓冲的程度。 如果作业被拒绝或者您收到系统没有足够缓冲区的警告，请增加此值或下面的最小/最大值。 另请注意，“taskmanager.network.memory.min”和“taskmanager.network.memory.max”可能会覆盖此分数

# taskmanager.network.memory.fraction: 0.1
# taskmanager.network.memory.min: 67108864
# taskmanager.network.memory.max: 1073741824
```

### Flink 集群安全配置

```
# 指示是否从 Kerberos ticket 缓存中读取
# security.kerberos.login.use-ticket-cache: true

# 包含用户凭据的 Kerberos 密钥表文件的绝对路径
# security.kerberos.login.keytab: /path/to/kerberos/keytab

# 与 keytab 关联的 Kerberos 主体名称
# security.kerberos.login.principal: flink-user

# 以逗号分隔的登录上下文列表，用于提供 Kerberos 凭据（例如，`Client，KafkaClient`使用凭证进行 ZooKeeper 身份验证和 Kafka 身份验证）
# security.kerberos.login.contexts: Client,KafkaClient
```

### Zookeeper 安全配置

```yml
# 覆盖以下配置以提供自定义 ZK 服务名称
# zookeeper.sasl.service-name: zookeeper

# 该配置必须匹配 "security.kerberos.login.contexts" 中的列表（含有一个）
# zookeeper.sasl.login-context-name: Client
```

## 参考资料

- [Flink 官方配置文档](https://ci.apache.org/projects/flink/flink-docs-stable/ops/config.html)
- [Apache Flink Docker Github](https://github.com/apache/flink-docker)
- [借助 Docker 学习大数据：Flink](https://zhuanlan.zhihu.com/p/176855301)