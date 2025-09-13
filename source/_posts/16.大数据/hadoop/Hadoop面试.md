---
icon: openmoji:military-medal
title: Hadoop 面试
date: 2020-02-24 21:14:47
categories:
  - 大数据
  - hadoop
tags:
  - 大数据
  - hadoop
  - hdfs
  - yarn
  - mapreduce
  - 面试
permalink: /pages/9da66d60/
---

# Hadoop 面试

## 简介

### 【初级】简介一下大数据技术生态？

:::details 要点

- **数据采集**：Flume、Sqoop、Logstash、Filebeat
- **分布式文件存储**：Hadoop HDFS
- **NoSql**
  - **文档数据库**：Mongodb
  - **列式数据库**：HBase
  - **搜索引擎**：Solr、Elasticsearch
- **分布式计算**
  - **批处理**：Hadoop MapReduce
  - **流处理**：Storm、Kafka
  - **混合处理**：Spark、Flink
- **查询分析**：Hive、Spark SQL、Flink SQL、Pig、Phoenix
- **集群资源管理**：Hadoop YARN
- **分布式协调**：Zookeeper
- **任务调度**：Azkaban、Oozie
- **集群部署和监控**：Ambari、Cloudera Manager

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192251433.png)

:::

### 【初级】什么是 HDFS？

:::details 要点

**HDFS** 是 **Hadoop Distributed File System** 的缩写，即 Hadoop 的分布式文件系统。

HDFS 是一种用于**存储具有流数据访问模式的超大文件的文件系统**，它**运行在廉价的机器集群**上。

HDFS 的设计目标是管理数以千计的服务器、数以万计的磁盘，将这么大规模的服务器计算资源当作一个单一的存储系统进行管理，对应用程序提供 **PB 级**的存储容量，让应用程序像使用普通文件系统一样存储大规模的文件数据。

HDFS 是在一个大规模分布式服务器集群上，对数据分片后进行并行读写及冗余存储。因为 HDFS 可以部署在一个比较大的服务器集群上，集群中所有服务器的磁盘都可供 HDFS 使用，所以整个 HDFS 的存储空间可以达到 PB 级容量。

HDFS 的常见使用场景：

- **大数据存储** - HDFS 能够存储 PB 级甚至 EB 级的数据，适合存储日志数据、传感器数据、社交媒体数据等。
- **批处理与分析** - HDFS 是 Hadoop MapReduce 的默认存储系统，MapReduce 作业直接从 HDFS 读取数据并进行分布式计算。
- **数据仓库** - HDFS 可以作为数据仓库的底层存储，支持大规模数据的离线分析。
- **数据冷备** - 由于 HDFS 的高可靠和低成本，适用于存储访问频率较低的冷数据（如历史数据、备份数据）。
- **多媒体数据存储**：HDFS 适合存储大规模的多媒体数据（如图像、视频、音频）。

:::

### 【初级】HDFS 有什么特性（优缺点）？

:::details 要点

**HDFS 的优点**：

- **高可用** - 冗余数据副本，支持自动故障恢复；支持 NameNode HA、安全模式
- **易扩展** - 能够处理 10K 节点的规模；处理数据达到 GB、TB、甚至 PB 级别的数据；能够处理百万规模以上的文件数量，数量相当之大。
- **批处理** - 流式数据访问；数据位置暴露给计算框架
- **低成本** - HDFS 构建在廉价的商用机器上。

**HDFS 的缺点**：

- **不适合低延迟数据访问** - 适合高吞吐率的场景，就是在某一时间内写入大量的数据。但是它在低延时的情况下是不行的，比如毫秒级以内读取数据，它是很难做到的。
- **不适合大量小文件存储**
  - 存储大量小文件（这里的小文件是指小于 HDFS 系统的 Block 大小的文件（默认 64M）) 的话，它会占用 NameNode 大量的内存来存储文件、目录和块信息。这样是不可取的，因为 NameNode 的内存总是有限的。
  - 磁盘寻道时间超过读取时间
- **不支持并发写入** - 一个文件同时只能有一个写入者
- **不支持文件随机修改** - 仅支持追加写入

:::

### 【初级】什么是 YARN？

:::details 要点

**YARN**（Yet Another Resource Negotiator，即另一种资源调度器） 是 Hadoop 的**集群资源管理系统**。YARN 负责资源管理和调度。用户可以将各种服务框架部署在 YARN 上，由 YARN 进行统一地管理和资源分配。

在 Hadoop 1.x 版本，MapReduce 中的 jobTracker 担负了太多的责任，接收任务是它，资源调度是它，监控 TaskTracker 运行情况还是它。这样实现的好处是比较简单，但相对的，就容易出现一些问题，比如常见的单点故障问题。要解决这些问题，只能将 jobTracker 进行拆分，将其中部分功能拆解出来。沿着这个思路，于是有了 YARN。

:::

### 【初级】什么是 MapReduce？

:::details 要点

MapReduce 是 Hadoop 项目中的分布式计算框架。它降低了分布式计算的门槛，可以让用户轻松编写程序，让其以可靠、容错的方式运行在大型集群上并行处理海量数据（TB 级）。

MapReduce 的设计思路是：

- 分而治之，并行计算
- 移动计算，而非移动数据

MapReduce 作业通过将输入的数据集拆分为独立的块，这些块由 `map` 任务以并行的方式处理。框架对 `map` 的输出进行排序，然后将其输入到 `reduce` 任务中。作业的输入和输出都存储在文件系统中。该框架负责调度任务、监控任务并重新执行失败的任务。

通常，计算节点和存储节点是相同的，即 MapReduce 框架和 HDFS 在同一组节点上运行。此配置允许框架在已存在数据的节点上有效地调度任务，从而在整个集群中实现非常高的聚合带宽。

MapReduce 框架由一个主 `ResourceManager`、每个集群节点一个工作程序 `NodeManager` 和每个应用程序的 `MRAppMaster` （YARN 组件） 组成。

MapReduce 框架仅对 `<key、value>` 对进行作，也就是说，框架将作业的输入视为一组 `<key、value>` 对，并生成一组 `<key、value>` 对作为作业的输出，可以想象是不同的类型。`键`和`值`类必须可由框架序列化，因此需要实现 [Writable](https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/io/Writable.html) 接口。此外，关键类必须实现 [WritableComparable](https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/io/WritableComparable.html) 接口，以便于按框架进行排序。

MapReduce 作业的 Input 和 Output 类型：

```
(input) <k1, v1> -> map -> <k2, v2> -> combine -> <k2, v2> -> reduce -> <k3, v3> (output)
```

MapReduce 适用场景：

- 数据统计，如：网站的 PV、UV 统计
- 搜索引擎构建索引
- 海量数据查询

MapReduce 不适用场景：

- OLAP - 要求毫秒或秒级返回结果
- 流计算 - 流计算的输入数据集是动态的，而 MapReduce 是静态的
- DAG 计算
  - 多个作业存在依赖关系，后一个的输入是前一个的输出，构成有向无环图 DAG
  - 每个 MapReduce 作业的输出结果都会落盘，造成大量磁盘 IO，导致性能非常低下

:::

### 【初级】MapReduce 有什么特性（优缺点）？

:::details 要点

MapReduce 有以下特性：

- 移动计算，而非移动数据
- 良好的扩展性：计算能力随着节点数增加，近似线性递增
- 高可用
- 适合海量数据的离线批处理
- 降低了分布式编程的门槛

:::

## 架构

### 【高级】HDFS 的架构是怎样设计的？

:::details 要点

HDFS 架构有以下几个核心要点：

- **主从架构**
- **按块分区**
- **数据副本**
- **命名空间**

![](https://raw.githubusercontent.com/dunwu/images/master/cs/bigdata/hdfs/hdfs-architecture.png)

**（1）HDFS 主从架构**

HDFS 采用 master/slave 架构。一个 HDFS 集群是由一个 NameNode 和一定数目的 DataNode 组成。NameNode 是一个中心服务器，负责管理文件系统的命名空间 (namespace) 以及客户端对文件的访问。集群中的 DataNode 一般是一个节点一个，负责管理它所在节点上的存储。HDFS 暴露了文件系统的命名空间，用户能够以文件的形式在上面存储数据。从内部看，一个文件其实被分成一个或多个数据块，这些块存储在一组 DataNode 上。NameNode 执行文件系统的命名空间操作，比如打开、关闭、重命名文件或目录。它也负责确定数据块到具体 DataNode 节点的映射。DataNode 负责处理文件系统客户端的读写请求。在 NameNode 的统一调度下进行数据块的创建、删除和复制。

- **NameNode** - 负责 HDFS 集群的管理、协调。具体来说，主要有以下职责：
  - **管理命名空间** - 执行有关命名空间的操作，例如打开，关闭、重命名文件和目录等。
  - **管理元数据** - 维护文件的位置、所有者、权限、数据块等。
  - **管理 Block 副本策略** - 默认 3 个副本
  - **客户端读写请求寻址**
- **DataNode**：负责提供来自文件系统客户端的读写请求，执行块的创建，删除等操作。具体来说，主要有以下职责：
  - 执行客户端发送的读写操作
  - 存储 Block 和数据校验和
  - 定期向 NameNode 发送心跳以续活
  - 定期向 NameNode 上报 Block 信息

**（2）按块分区**

**HDFS 将文件数据分割成若干数据块（Block），每个 DataNode 存储一部分数据块**，这样文件就分布存储在整个 HDFS 服务器集群中。

将大文件分割成 Block 的主要目的是为了优化网络传输和数据处理的效率。这种分割机制使得文件的不同部分可以并行处理，大大提高了数据处理的速度。

HDFS Block 有以下要点：

- Block 是 HDFS 最小存储单元
- 文件写入 HDFS 会被切分成若干个 Block
- Block 大小固定，默认为 128MB，可通过 `dfs.blocksize` 参数修改
- 若一个 Block 的大小小于设定值，不会占用整个块空间
- 默认情况下每个 Block 有 3 个副本

这实际上是典型的分布式分区思想，使得 HDFS 具备了扩展能力。

**（3）数据复制**

HDFS 被设计成能够在一个大集群中跨机器可靠地存储超大文件。它将每个文件存储成一系列的数据块，除了最后一个，所有的数据块都是同样大小的。为了容错，文件的所有数据块都会有副本。每个文件的数据块大小和副本系数都是可配置的。应用程序可以指定某个文件的副本数目。副本系数可以在文件创建的时候指定，也可以在之后改变。HDFS 中的文件都是一次性写入的，并且严格要求在任何时候只能有一个写入者。

NameNode 全权管理数据块的复制，它周期性地从集群中的每个 DataNode 接收心跳信号和块状态报告 (Blockreport)。接收到心跳信号意味着该 DataNode 节点工作正常。块状态报告包含了一个该 DataNode 上所有数据块的列表。

**（4）命名空间**

HDFS 支持传统的层次型文件组织结构。用户或者应用程序可以创建目录，然后将文件保存在这些目录里。文件系统命名空间的层次结构和大多数现有的文件系统类似：用户可以创建、删除、移动或重命名文件。HDFS 不支持用户磁盘配额和访问权限控制，也不支持硬链接和软链接。但是 HDFS 架构并不妨碍实现这些特性。

NameNode 负责维护文件系统的命名空间，任何对文件系统命名空间或属性的修改都将被 NameNode 记录下来。应用程序可以设置 HDFS 保存的文件的副本数目。文件副本的数目称为文件的副本系数，这个信息也是由 NameNode 保存的。

:::

### 【中级】HDFS 使用 NameNode 的好处 ？

:::details 要点

HDFS 使用 NameNode 的好处主要体现在以下几个方面：

- **中心化的元数据管理** - NameNode 在 HDFS 中负责存储整个文件系统的元数据，包括文件和目录的结构、每个文件的数据块信息及其在 DataNode 上的位置等。这种中心化的管理，使得文件系统的组织和管理变得更加简洁高效，并且可以确保整个文件系统的一致性。
- **易扩展** - 由于实际的数据存储在 DataNode 上，而 NameNode 只存储元数据，这样的架构设计使得 HDFS 可以轻松扩展到处理 PB 级别甚至更大规模的数据集。
- **快速的文件访问**：用户或应用程序在访问文件时，首先与 NameNode 交互以获得数据块的位置信息，然后直接从 DataNode 读取数据。这种方式可以快速定位数据，提高文件访问的效率。
- **容错和恢复机制**：NameNode 可以监控 DataNode 的状态，实现系统的容错。在 DataNode 发生故障时，NameNode 可以指导其它 DataNode 复制丢失的数据块，保证数据的可靠性。
- **简化数据管理**：NameNode 的存在简化了数据的管理和维护。例如，在进行数据备份、系统升级或扩展时，管理员只需要关注 NameNode 上的元数据，而不是每个节点上存储的实际数据。

然而，由于 NameNode 是中心节点，它也成为了系统的一个潜在瓶颈和单点故障。因此，HDFS 后来引入了主备 NameNode 机制来保证 NameNode 自身的可用性。

:::

### 【中级】HDFS 使用 Block 的好处 ？

:::details 要点

HDFS 采用文件分块（Block）进行存储管理，主要是基于以下几个原因：

- **提高可靠性和容错性** - 通过将文件分成多个块，并在不同的 DataNode 上存储这些块的副本，HDFS 可以提高数据的可靠性。即使某些 DataNode 出现故障，其他节点上的副本仍然可以用于数据恢复。
- **提高数据处理效率**：在处理大规模数据集时，将大文件分割成小块可以提高数据处理的效率。这样，可以并行地在多个节点上处理不同的块，从而加速数据处理和分析。
- **提高网络传输效率**：分块存储还有利于网络传输。当处理或传输一个大文件的部分数据时，只需处理或传输相关的几个块，而不是整个文件，这减少了网络传输负担。
- **易于扩展**：分块机制使得 HDFS 易于扩展。可以简单地通过增加更多的 DataNode 来扩大存储容量和处理能力，而不需要对现有的数据块进行任何修改。
- **负载均衡**：分块存储还有助于在集群中实现负载均衡。不同的数据块可以分布在不同的节点上，从而均衡各个节点的存储和处理负载。

:::

### 【中级】NameNode 与 SecondaryNameNode 的区别与联系 ？

:::details 要点

NameNode 和 SecondaryNameNode 的**区别**：

- NameNode 是 HDFS 的主要节点，负责管理文件系统的命名空间。它维护着整个文件系统的目录和文件结构，以及所有文件的元数据，包括文件的数据块（block）信息、数据块的位置等。
- SecondaryNameNode 是 NameNode 的辅助节点。
  - SecondaryNameNode 不是 NameNode 的备份，不能在 NameNode 故障时接管其功能。
  - HDFS 在运行过程中，所有的事务（如文件创建、删除等）都会首先记录在 NameNode 的内存和 EditLog 中。SecondaryNameNode 定期从 NameNode 获取这些日志文件，与文件系统的命名空间镜像（FsImage）合并，然后把新的 FsImage 送回给 NameNode，以帮助减少 NameNode 的内存压力。

NameNode 和 SecondaryNameNode 的**联系**：

- **共同目标**：二者共同目的是维护 HDFS 的稳定和高效运作。NameNode 作为核心，负责实时的元数据管理；而 SecondaryNameNode 辅助 NameNode，通过定期处理 FsImage 和 EditLog，减轻 NameNode 的负担。
- **数据交互**：SecondaryNameNode 的工作依赖于与 NameNode 的交互，从 NameNode 获取元数据的状态和编辑日志。

:::

### 【中级】什么是 FsImage 和 EditLog？

:::details 要点

HDFS 中，`FsImage`和`EditLog`是两个关键的文件，用于存储和管理文件系统的元数据。它们的主要区别如下：

**FsImage（文件系统镜像）**

- **内容**：`FsImage`包含 HDFS 元数据的完整快照，例如文件系统的目录树、文件和目录的属性等。
- **静态性**：它是在特定时间点上的静态快照。一旦创建，除非进行新的快照操作，否则内容不会改变。
- **使用场景**：在 NameNode 启动时使用，用于加载文件系统的最初状态。此外，在进行系统备份时也会生成新的`FsImage`。
- **更新频率**：不是实时更新的。通常在系统进行 checkpoint 操作时才会更新。

**EditLog（编辑日志）**

- **内容**：`EditLog`记录了自上一个`FsImage`快照以来所有对文件系统所做的增量更改。这些更改包括文件和目录的创建、删除、重命名等操作。
- **动态性**：它是一个动态更新的日志文件。每次对文件系统进行更改时，这个更改就会记录在`EditLog`中。
- **使用场景**：用于记录所有的文件系统更改操作。在 NameNode 重启时，`FsImage`将与`EditLog`结合使用，以重建文件系统的最新状态。
- **更新频率**：实时更新。每次对文件系统的更改都会迅速反映在`EditLog`中。

**结合使用**

在 HDFS 中，`FsImage`和`EditLog`一起工作，以确保文件系统的元数据既能够被可靠地存储，又能够反映最新的更改。定期进行 checkpoint 操作（由 Secondary NameNode 或 Standby NameNode 执行）会将`EditLog`中的更改应用到`FsImage`中，创建一个新的、更新的快照。这样可以保证在系统重启或恢复时，可以快速加载最新的文件系统状态。

:::

### 【中级】YARN 有哪些核心组件？

:::details 要点

![YARN Architecture](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192257406.gif)

YARN 有以下核心组件：

- **ResourceManager** - ResourceManager 是**管理资源**和安排在 YARN 上运行的**中央调度器**。整个系统有且只有一个 ResourceManager，因为号令发布都来自一处，因此不存在调度不一致的情况（很多分布式系统都是通过经典的一主多从模式来解决一致性问题的）。它也包含了两个主要的子组件：
  - **定时调度器（Scheduler）** - 从本质上来说，定时调度器就是一种策略，或者说一种算法。当 Client 提交一个任务的时候，它会根据所需要的资源以及当前集群的资源状况进行分配。注意，它只负责向应用程序分配资源，并不做监控以及应用程序的状态跟踪。
  - **应用管理器（ApplicationManager）** - 应用管理器就是负责管理 Client 提交的应用。上面不是说到定时调度器（Scheduler）不对用户提交的程序监控嘛，其实啊，监控应用的工作正是由应用管理器（ApplicationManager）完成的。
- **NodeManager** - NodeManager 是 ResourceManager 在每台机器的上代理，负责容器的管理，并监控他们的资源使用情况（cpu、内存、磁盘及网络等），以及向 ResourceManager/Scheduler 提供这些资源使用报告。
- **ApplicationMaster** - 每当 Client 提交一个 Application 时候，就会新建一个 ApplicationMaster 。由这个 ApplicationMaster 去与 ResourceManager 申请容器资源，获得资源后会将要运行的程序发送到容器上启动，然后进行分布式计算。这么设计的原因在于，数据量大的时候，移动数据成本太高，耗时太久，改为移动计算代价较小。
- **Container** - `Container` 是 YARN 对资源的抽象，它封装了某个节点上的多维度资源，如内存、CPU、磁盘、网络等。当 AM 向 RM 申请资源时，RM 为 AM 返回的资源是用 `Container` 表示的。
  - YARN 会为每个任务分配一个 `Container`，该任务只能使用该 `Container` 中描述的资源。
  - `ApplicationMaster` 可在 `Container` 内运行任何类型的任务。例如，`MapReduce ApplicationMaster` 请求一个容器来启动 map 或 reduce 任务，而 `Giraph ApplicationMaster` 请求一个容器来运行 Giraph 任务。
  - 容器由 NodeManager 启动和管理，并被它所监控。
  - 容器被 ResourceManager 所调度。

:::

### 【中级】MapReduce 有哪些核心组件？

:::details 要点

MapReduce 有以下核心组件：

- **Job** - [Job](https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/mapreduce/Job.html) 表示 MapReduce 作业配置。`Job` 通常用于指定 `Mapper`、combiner（如果有）、`Partitioner`、`Reducer`、`InputFormat`、`OutputFormat` 实现。
- **Mapper** - [Mapper](https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/mapreduce/Mapper.html) 负责将输入键值对**映射**到一组中间键值对。转换的中间记录不需要与输入记录具有相同的类型。一个给定的输入键值对可能映射到零个或多个输出键值对。
- **Combiner** - `combiner` 是 `map` 运算后的可选操作，它实际上是一个本地化的 `reduce` 操作。它执行中间输出的本地聚合，这有助于减少从 `Mapper` 传输到 `Reducer` 的数据量。
- **Reducer** - [Reducer](http://hadoop.apache.org/docs/current/api/org/apache/hadoop/mapreduce/Reducer.html) 将共享一个 key 的一组中间值归并为一个小的数值集。Reducer 有 3 个主要子阶段：shuffle，sort 和 reduce。
  - **shuffle** - Reducer 的输入就是 mapper 的排序输出。在这个阶段，框架通过 HTTP 获取所有 mapper 输出的相关分区。
  - **sort** - 在这个阶段中，框架将按照 key （因为不同 mapper 的输出中可能会有相同的 key) 对 Reducer 的输入进行分组。shuffle 和 sort 两个阶段是同时发生的。
  - **reduce** - 对按键分组的数据进行聚合统计。
- **Partitioner** - [Partitioner](http://hadoop.apache.org/docs/current/api/org/apache/hadoop/mapreduce/Partitioner.html) 负责控制 map 中间输出结果的键的分区。
  - 键（或者键的子集）用于产生分区，通常通过一个散列函数。
  - 分区总数与作业的 reduce 任务数是一样的。因此，它控制中间输出结果（也就是这条记录）的键发送给 m 个 reduce 任务中的哪一个来进行 reduce 操作。
- **InputFormat** - [InputFormat](http://hadoop.apache.org/docs/current/api/org/apache/hadoop/mapreduce/InputFormat.html) 描述 MapReduce 作业的输入规范。MapReduce 框架依赖作业的 InputFormat 来完成以下工作：
  - 确认作业的输入规范。
  - 把输入文件分割成多个逻辑的 InputSplit 实例，然后将每个实例分配给一个单独的 Mapper。[InputSplit](https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/mapreduce/InputSplit.html) 表示要由单个 `Mapper` 处理的数据。
  - 提供 RecordReader 的实现。[RecordReader](https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/mapreduce/RecordReader.html) 从 `InputSplit` 中读取 `<key， value>` 对，并提供给 `Mapper` 实现进行处理。
- **OutputFormat** - [OutputFormat](http://hadoop.apache.org/docs/current/api/org/apache/hadoop/mapreduce/OutputFormat.html) 描述 MapReduce 作业的输出规范。MapReduce 框架依赖作业的 OutputFormat 来完成以下工作：
  - 确认作业的输出规范，例如检查输出路径是否已经存在。
  - 提供 RecordWriter 实现。[RecordWriter](https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/mapreduce/RecordWriter.html) 将输出 `<key， value>` 对到文件系统。

:::

## 工作流

### 【中级】HDFS 的写数据流程是怎样的？

:::details 要点

HDFS 写数据流程大致为：

1. **按 Block 大小分割数据**
2. **通过 NameNode 寻址 DataNode**
3. **向 DataNode 写数据**
4. **完成后通知 NameNode**

> 扩展：下面的漫画生动的展示了 HDFS 的写入流程，图片引用自博客：[翻译经典 HDFS 原理讲解漫画](https://blog.csdn.net/hudiefenmu/article/details/37655491)
>
> ![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192300702.jpg)
>
> ![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192301943.jpg)
>
> ![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192302127.jpg)

HDFS 写数据的源码流程：

![](https://raw.githubusercontent.com/dunwu/images/master/cs/bigdata/hdfs/hdfs-write.png)

1. 客户端通过对 `DistributedFileSystem` 对象调用 `create()` 函数来**新建文件**。
2. 分布式文件系统对 NameNode 创建一个 RPC 调用，**在文件系统的命名空间中新建一个文件**。
3. NameNode 对新建文件进行检查无误后，分布式文件系统返回给客户端一个 `FSDataOutputStream` 对象，`FSDataOutputStream` 对象封装一个 `DFSoutPutstream` 对象，负责处理 NameNode 和 DataNode 之间的通信，**客户端开始写入数据**。
4. `FSDataOutputStream` 将**数据分成一个一个的数据包，写入内部数据队列**，DataStreamer 负责将数据包依次流式传输到由一组 NameNode 构成的管道中。
5. `DFSOutputStream` 维护着确认队列来等待 DataNode 收到确认回执，**收到管道中所有 DataNode 确认后，数据包从确认队列删除**。
6. **客户端完成数据的写入**，调用 `close()` 方法关闭传输通道。
7. NameNode **确认完成**。

:::

### 【中级】HDFS 的读数据流程是怎样的？

:::details 要点

HDFS 读数据流程大致为：

1. 客户端向 NameNode 查询文件信息
2. NameNode 返回相关信息
   - 该文件的所有数据块
   - 每个数据块对应的 DataNode（按距离客户端的远近排序）
3. 客户端向 DataNode 读数据

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192303732.jpg)

HDFS 读数据的源码流程：

![](https://raw.githubusercontent.com/dunwu/images/master/cs/bigdata/hdfs/hdfs-read.png)

1. 客户端调用 `FileSystem` 对象的 `open()` 方法在 HDFS 中**打开要读取的文件**。
2. HDFS 通过使用 RPC（远程过程调用）来调用 NameNode，**确定文件起始块（Block）的位置**。
3. `DistributedFileSystem` 类返回一个支持文件定位的输入流 `FSDataInputStream` 对象，`FSDataInputStream` 对象接着封装 `DFSInputStream` 对象（**存储着文件起始几个块的 DataNode 地址**），客户端对这个输入流调用 `read()` 方法。
4. `DFSInputStream` 连接距离最近的 DataNode，通过反复调用 `read` 方法，**将数据从 DataNode 传输到客户端**。
5. 到达块的末端时，`DFSInputStream` 关闭与该 DataNode 的连接，**寻找下一个块的最佳 DataNode**。
6. 客户端完成读取，对 `FSDataInputStream` 调用 `close()` 方法**关闭连接**。

:::

### 【中级】MapReduce 是如何工作的？

:::details 要点

MapReduce 任务过程分为两个处理阶段：map 极端和 reduce 阶段。每阶段都以键值对作为输入和输出，其类型由程序员来选择。程序员还需要写两个函数：map 函数和 reduce 函数。

以词频统计为例，其工作流再细分一下，可以划分为以下阶段：

1. **input** - 读取文本文件；
2. **splitting** - 将文件按照行进行拆分，此时得到的 `K1` 行数，`V1` 表示对应行的文本内容；
3. **mapping** - 并行将每一行按照空格进行拆分，拆分得到的 `List(K2,V2)`，其中 `K2` 代表每一个单词，由于是做词频统计，所以 `V2` 的值为 1，代表出现 1 次；
4. **shuffling** - 由于 `Mapping` 操作可能是在不同的机器上并行处理的，所以需要通过 `shuffling` 将相同 `key` 值的数据分发到同一个节点上去合并，这样才能统计出最终的结果，此时得到 `K2` 为每一个单词，`List(V2)` 为可迭代集合，`V2` 就是 Mapping 中的 V2；
5. **reducing** - 这里的案例是统计单词出现的总次数，所以 `Reducing` 对 `List(V2)` 进行归约求和操作，最终输出。

MapReduce 编程模型中 `splitting` 和 `shuffing` 操作都是由框架实现的，需要我们自己编程实现的只有 `mapping` 和 `reducing`，这也就是 MapReduce 这个称呼的来源。

![MapReduce 工作流](https://raw.githubusercontent.com/dunwu/images/master/snap/20200601162305.png)

:::

### 【中级】YARN 是如何工作的？

:::details 要点

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192303306.jpeg)

这张图简单地标明了提交一个程序所经历的流程，接下来我们来具体说说每一步的过程。

1. Client 向 ResourceManager 申请运行一个 Application 进程，这里我们假设是一个 MapReduce 作业。
2. ResourceManager 向 NodeManager 通信，为该 Application 进程分配第一个容器。并在这个容器中运行这个应用程序对应的 ApplicationMaster。
3. ApplicationMaster 启动以后，对作业（也就是 Application） 进行拆分，拆分 task 出来，这些 task 可以运行在一个或多个容器中。然后向 ResourceManager 申请要运行程序的容器，并定时向 ResourceManager 发送心跳。
4. 申请到容器后，ApplicationMaster 会去和容器对应的 NodeManager 通信，而后将作业分发到对应的 NodeManager 中的容器去运行，这里会将拆分后的 MapReduce 进行分发，对应容器中运行的可能是 Map 任务，也可能是 Reduce 任务。
5. 容器中运行的任务会向 ApplicationMaster 发送心跳，汇报自身情况。当程序运行完成后， ApplicationMaster 再向 ResourceManager 注销并释放容器资源。

:::

## 复制

**复制主要指通过网络在多台机器上保存相同数据的副本**。

复制数据，可能出于各种各样的原因：

- **提高可用性** - 当部分组件出现位障，系统依然可以继续工作，系统依然可以继续工作。
- **降低访问延迟** - 使数据在地理位置上更接近用户。
- **提高读吞吐量** - 扩展至多台机器以同时提供数据访问服务。

所有分布式系统都需要支持复制。

### 【中级】HDFS 的副本机制是怎样的？

:::details 要点

#### 基于块的副本

由于 Hadoop 被设计运行在廉价的机器上，这意味着硬件是不可靠的，为了保证容错性，HDFS 提供了副本机制。HDFS 将文件分解为若干 Block，Block 是 HDFS 最小存储单元，每个 Block 有多个副本。

HDFS 的默认副本数为 3，更多的副本意味着更高的数据安全性，但同时也会带来更高的额外开销（存储成本和带宽成本）。3 个副本是在保障数据可靠性和系统成本之间的一个较好的平衡点。

副本数可以通过以下方式修改：

- 在 HDFS 的配置文件 hdfs-site.xml 中，有一个名为 `dfs.replication` 的属性，可以设置**全局的默认副本数**。修改这个值后，需要重启 HDFS 使配置生效。
- 针对单个文件或目录修改副本数：如果只想改变某个特定文件或目录的副本数，而不影响整个系统的默认设置，可以使用 HDFS 的命令行工具。例如，使用命令`hdfs dfs -setrep -w <副本数> <文件/目录路径>` 来修改特定文件或目录的副本数。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/20200224203958.png)

**NameNode 全权管理数据块的复制**，它周期性地从集群中的每个 DataNode 接收心跳信号和块状态报告 (BlockReport)。接收到心跳信号意味着该 DataNode 节点工作正常。块状态报告包含了一个该 DataNode 上所有数据块的列表。

![](https://raw.githubusercontent.com/dunwu/images/master/cs/bigdata/hdfs/hdfs-replica.png)

#### 副本分布策略

副本分布策略是 HDFS 可靠性和性能的关键。优化的副本存放策略是 HDFS 区分于其他大部分分布式文件系统的重要特性。HDFS 采用一种称为机架感知 (rack-aware) 的策略来改进数据的可靠性、可用性和网络带宽的利用率。大型 HDFS 实例一般运行在跨越多个机架的计算机组成的集群上，不同机架上的两台机器之间的通信需要经过交换机。在大多数情况下，同一个机架内的两台机器间的带宽会比不同机架的两台机器间的带宽大。

通过一个机架感知的过程，NameNode 可以确定每个 DataNode 所属的机架 id。一个简单但没有优化的策略就是将副本存放在不同的机架上。这样可以有效防止当整个机架失效时数据的丢失，并且允许读数据的时候充分利用多个机架的带宽。这种策略设置可以将副本均匀分布在集群中，有利于当组件失效情况下的负载均衡。但是，因为这种策略的一个写操作需要传输数据块到多个机架，这增加了写的代价。

HDFS 默认的副本数为 3，此时 HDFS 的副本分布策略是：

- **副本 1** - 放在 Client 所在节点；对于远程 Client，系统会随机选择节点
- **副本 2** - 放在不同机架的节点上
- **副本 3** - 放在与第二个副本同一机架的不同节点上
- **副本 N** - 在满足以下条件的节点中随机选择
  - 每个节点只存储一份副本
  - 每个机架最多存储两份副本
- **优选** - 同等条件下优先选择空闲节点。
  - 如果某个 DataNode 节点上的空闲空间低于特定的临界点，按照均衡策略系统就会自动地将数据从这个 DataNode 移动到其他空闲的 DataNode。

#### 副本选择

为了降低整体的带宽消耗和读取延时，HDFS 会尽量让客户端程序读取离它最近的副本。如果在客户端程序的同一个机架上有一个副本，那么就读取该副本。如果一个 HDFS 集群跨越多个数据中心，那么客户端也将首先读本地数据中心的副本。

为了最大限度地减少带宽消耗和读取延迟，HDFS 在执行读取请求时，优先读取距离读取器最近的副本。如果在与读取器节点相同的机架上存在副本，则优先选择该副本。如果 HDFS 群集跨越多个数据中心，则优先选择本地数据中心上的副本。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192304008.jpg)

:::

### 【中级】HDFS 如何保证数据一致性？

:::details 要点

HDFS 的数据一致性主要依赖以下机制来保证：

- **NameNode 的中心化管理** - NameNode 在 HDFS 中负责存储整个文件系统的元数据，包括文件和目录的结构、每个文件的数据块信息及其在 DataNode 上的位置等。这种中心化的管理，使得文件系统的组织和管理变得更加简洁高效，并且可以确保整个文件系统的一致性。
- **数据块的复制（Replication）** - HDFS 采用副本来保证数据的可靠性。一旦数据写入完成，副本就会分散存储在不同的 DataNodes 上。尽管这种方法不是强一致性模型，但通过足够数量的副本和及时的副本替换策略，HDFS 能够提供较高水平的数据一致性和可靠性。
- **写入和复制的原子性保证** - 在 HDFS 中，文件一旦创建，其内容就不能被更新，只能被追加或重写。这种方式简化了并发控制，因为写操作在文件级别上是原子的。在复制数据块时，HDFS 保证原子性复制，即一个数据块的所有副本在任何时间点上都是相同的。如果复制过程中出现错误，那么不完整的副本会被删除，系统会重新尝试复制直到成功。
- **客户端的一致性协议** - 客户端在与 HDFS 交互时，遵循特定的协议。例如，客户端在完成文件写入之后，需要向 NameNode 通知，以确保 NameNode 更新文件的元数据。这样可以保证 NameNode 的元数据与实际存储的数据保持一致。
- **定期检查和错误恢复**
  - **心跳和健康检查** - DataNodes 定期向 NameNode 发送心跳和 Block 健康状况报告。NameNode 利用这些信息来检查和维护系统的整体一致性。例如，如果某个 DataNode 失败，NameNode 会重新组织数据块的副本。
  - **校验** - HDFS 在存储和传输数据时，会计算数据的校验和。在读取数据时，会验证这些校验和，确保数据的完整性。

通过这些机制，HDFS 确保了系统中的数据在正常操作和故障情况下的一致性和可靠性。虽然 HDFS 不提供像传统数据库那样的强一致性保证，但它的设计和实现确保了在大规模数据处理场景中的有效性和健壮性。

:::

## 容错

### 【中级】HDFS 有哪些故障类型？如何检测故障？

:::details 要点

HDFS 常见故障及检测方法：

- **节点故障**
  - DataNode 每 3 秒向 NameNode 发送心跳
  - 超时未收到心跳，NameNode 判定 DataNode 宕机
- **通信故障**
  - 客户端请求 DataNode 会收到 ACK
- **数据损坏**
  - 磁盘介质在存储过程中受环境或者老化影响，其存储的数据可能会出现错乱。HDFS 的应对措施是，对于存储在 DataNode 上的数据块，计算并存储校验和（CheckSum）。在读取数据的时候，重新计算读取出来的数据的校验和，如果校验不正确就抛出异常，应用程序捕获异常后就到其他 DataNode 上读取备份数据。
  - 如果 DataNode 监测到本机的某块磁盘损坏，就将该块磁盘上存储的所有 BlockID 报告给 NameNode，NameNode 检查这些数据块还在哪些 DataNode 上有备份，通知相应的 DataNode 服务器将对应的数据块复制到其他服务器上，以保证数据块的备份数满足要求。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192304755.jpg)

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192305651.jpg)

:::

### 【中级】HDFS 读写故障如何处理？

:::details 要点

#### 写入故障处理

- 写入数据通过数据包传输
- DataNode 接收数据后，返回 ACK
- 如果客户端没有收到 ACK，就判定 DataNode 宕机，跳过节点
- 没有充分备份的数据块信息通知到 NameNode

#### 读取故障处理

- 读数据先要通过 NameNode 寻址该数据块的所有 DataNode
- 如果某 DataNode 宕机，则读取其他节点

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192305332.jpg)

:::

### 【中级】DataNode 故障如何处理？

:::details 要点

DataNode 每 3 秒会向 NameNode 发送心跳消息，以证明自身正常工作。如果 DataNode 超时未发送心跳，NameNode 就会认为该 DataNode 已经宕机。

NameNode 会立即查找该 DataNode 上存储的数据块有哪些，以及这些数据块还存储在哪些其他 DataNode 上。

随后，NameNode 通知这些 DataNode 再复制一份数据块到其他 DataNode 上，保证 HDFS 存储的数据块副本数符合配置数。即使再出现服务器宕机，也不会丢失数据。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192306957.jpg)

:::

### 【中级】NameNode 故障如何处理？

:::details 要点

NameNode 是整个 HDFS 的核心，记录着 HDFS 文件分配表信息，所有的文件路径和数据块存储信息都保存在 NameNode，如果 NameNode 故障，整个 HDFS 系统集群都无法使用。如果 NameNode 上记录的数据丢失，整个集群所有 DataNode 存储的数据也就没用了。

NameNode 通过主备架构实现故障转移。

- **Active NameNode** - 是正在工作的 NameNode；
- **Standby NameNode** - 是备份的 NameNode。

Active NameNode 宕机后，Standby NameNode 快速升级为新的 Active NameNode。Standby NameNode 周期性同步 `edits` 编辑日志，定期合并 `FsImage` 与 `edits` 到本地磁盘。

> 注：Hadoop 3.0 允许配置多个 Standby NameNode。

#### 元数据文件

- **edits（编辑日志文件）** - 保存了自最新检查点（Checkpoint）之后的所有文件更新操作。
- **FsImage（元数据检查点镜像文件）** - 保存了文件系统中所有的目录和文件信息，如：某个目录下有哪些子目录和文件，以及文件名、文件副本数、文件由哪些 Block 组成等。

Active NameNode 内存中有一份最新的元数据（= FsImage + edits）。

Standby NameNode 在检查点定期将内存中的元数据保存到 FsImage 文件中。

#### 利用 QJM 实现元数据高可用

> 基于 Paxos 算法

QJM 机制（Quorum Journal Manager）

只要保证 Quorum（法定人数）数量的操作成功，就认为这是一次最终成功的操作

QJM 共享存储系统

- 部署奇数（2N+1）个 JournalNode
- JournalNode 负责存储 edits 编辑日志
- 写 edits 的时候，只要超过半数（N+1）的 JournalNode 返回成功，就代表本次写入成功
- 最多可容忍 N 个 JournalNode 宕机

利用 ZooKeeper 实现 Active 节点选举。

:::

### 【中级】HDFS 安全模式有什么作用？

:::details 要点

在启动过程中，NameNode 进入安全模式。在这个模式下，它会检查数据块的健康状况和副本数量。只有在足够数量的数据块可用时，NameNode 才会退出安全模式，开始正常的操作。

:::

## HA

### 【高级】HDFS 如何实现高可用？

:::details 要点

HDFS 高可用架构如下：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192307157.png)

HDFS 高可用架构主要由以下组件所构成：

- **Active NameNode 和 Standby NameNode**：两台 NameNode 形成互备，一台处于 Active 状态，为主 NameNode，另外一台处于 Standby 状态，为备 NameNode，只有主 NameNode 才能对外提供读写服务。
- **主备切换控制器 ZKFailoverController**：ZKFailoverController 作为独立的进程运行，对 NameNode 的主备切换进行总体控制。ZKFailoverController 能及时检测到 NameNode 的健康状况，在主 NameNode 故障时借助 Zookeeper 实现自动的主备选举和切换，当然 NameNode 目前也支持不依赖于 Zookeeper 的手动主备切换。
- **Zookeeper 集群**：为主备切换控制器提供主备选举支持。
- **共享存储系统**：共享存储系统是实现 NameNode 的高可用最为关键的部分，共享存储系统保存了 NameNode 在运行过程中所产生的 HDFS 的元数据。主 NameNode 和 NameNode 通过共享存储系统实现元数据同步。在进行主备切换的时候，新的主 NameNode 在确认元数据完全同步之后才能继续对外提供服务。
- **DataNode 节点**：除了通过共享存储系统共享 HDFS 的元数据信息之外，主 NameNode 和备 NameNode 还需要共享 HDFS 的数据块和 DataNode 之间的映射关系。DataNode 会同时向主 NameNode 和备 NameNode 上报数据块的位置信息。

目前 Hadoop 支持使用 Quorum Journal Manager (QJM) 或 Network File System (NFS) 作为共享的存储系统，这里以 QJM 集群为例进行说明：Active NameNode 首先把 EditLog 提交到 JournalNode 集群，然后 Standby NameNode 再从 JournalNode 集群定时同步 EditLog，当 Active NameNode 宕机后， Standby NameNode 在确认元数据完全同步之后就可以对外提供服务。

需要说明的是向 JournalNode 集群写入 EditLog 是遵循 “过半写入则成功” 的策略，所以你至少要有 3 个 JournalNode 节点，当然你也可以继续增加节点数量，但是应该保证节点总数是奇数。同时如果有 2N+1 台 JournalNode，那么根据过半写的原则，最多可以容忍有 N 台 JournalNode 节点挂掉。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192308642.png)

:::

### 【高级】NameNode 如何实现主备切换？

:::details 要点

NameNode 实现主备切换的流程下图所示：

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192308888.png)

工作流程说明：

1. HealthMonitor 初始化完成之后会启动内部的线程来定时调用对应 NameNode 的 HAServiceProtocol RPC 接口的方法，对 NameNode 的健康状态进行检测。
2. HealthMonitor 如果检测到 NameNode 的健康状态发生变化，会回调 ZKFailoverController 注册的相应方法进行处理。
3. 如果 ZKFailoverController 判断需要进行主备切换，会首先使用 ActiveStandbyElector 来进行自动的主备选举。
4. ActiveStandbyElector 与 Zookeeper 进行交互完成自动的主备选举。
5. ActiveStandbyElector 在主备选举完成后，会回调 ZKFailoverController 的相应方法来通知当前的 NameNode 成为主 NameNode 或备 NameNode。
6. ZKFailoverController 调用对应 NameNode 的 HAServiceProtocol RPC 接口的方法将 NameNode 转换为 Active 状态或 Standby 状态。

主备选举过程：

NameNode 在选举成功后，会在 zk 上创建了一个 `/hadoop-ha/${dfs.nameservices}/ActiveStandbyElectorLock` 节点，而没有选举成功的备 NameNode 会监控这个节点，通过 Watcher 来监听这个节点的状态变化事件，ZKFC 的 ActiveStandbyElector 主要关注这个节点的 NodeDeleted 事件（这部分实现跟 Kafka 中 Controller 的选举一样）。

如果 Active NameNode 对应的 HealthMonitor 检测到 NameNode 的状态异常时， ZKFailoverController 会主动删除当前在 Zookeeper 上建立的临时节点 `/hadoop-ha/${dfs.nameservices}/ActiveStandbyElectorLock`，这样处于 Standby 状态的 NameNode 的 ActiveStandbyElector 注册的监听器就会收到这个节点的 NodeDeleted 事件。收到这个事件之后，会马上再次进入到创建 `/hadoop-ha/${dfs.nameservices}/ActiveStandbyElectorLock` 节点的流程，如果创建成功，这个本来处于 Standby 状态的 NameNode 就选举为主 NameNode 并随后开始切换为 Active 状态。

当然，如果是 Active 状态的 NameNode 所在的机器整个宕掉的话，那么根据 Zookeeper 的临时节点特性，`/hadoop-ha/${dfs.nameservices}/ActiveStandbyElectorLock` 节点会自动被删除，从而也会自动进行一次主备切换。

:::

### 【高级】如何应对 HDFS 脑裂问题？

:::details 要点

在实际中，NameNode 可能会出现这种情况，NameNode 在垃圾回收（GC）时，可能会在长时间内整个系统无响应，因此，也就无法向 zk 写入心跳信息，这样的话可能会导致临时节点掉线，备 NameNode 会切换到 Active 状态，这种情况，可能会导致整个集群会有同时有两个 NameNode，这就是脑裂问题。

脑裂问题的解决方案是隔离（Fencing），主要是在以下三处采用隔离措施：

- 第三方共享存储：任一时刻，只有一个 NN 可以写入；
- DataNode：需要保证只有一个 NN 发出与管理数据副本有关的删除命令；
- Client：需要保证同一时刻只有一个 NN 能够对 Client 的请求发出正确的响应。

关于这个问题目前解决方案的实现如下：

- ActiveStandbyElector 为了实现隔离，会在成功创建 Zookeeper 节点 `hadoop-ha/${dfs.nameservices}/ActiveStandbyElectorLock` 从而成为 Active NameNode 之后，创建另外一个路径为 `/hadoop-ha/${dfs.nameservices}/ActiveBreadCrumb` 的持久节点，这个节点里面保存了这个 Active NameNode 的地址信息；
- Active NameNode 的 ActiveStandbyElector 在正常的状态下关闭 Zookeeper Session 的时候，会一起删除这个持久节点；
- 但如果 ActiveStandbyElector 在异常的状态下 Zookeeper Session 关闭 （比如前述的 Zookeeper 假死），那么由于 `/hadoop-ha/${dfs.nameservices}/ActiveBreadCrumb` 是持久节点，会一直保留下来，后面当另一个 NameNode 选主成功之后，会注意到上一个 Active NameNode 遗留下来的这个节点，从而会回调 ZKFailoverController 的方法对旧的 Active NameNode 进行 fencing。

在进行隔离的时候，会执行以下的操作：

首先尝试调用这个旧 Active NameNode 的 HAServiceProtocol RPC 接口的 transitionToStandby 方法，看能不能把它转换为 Standby 状态； 如果 transitionToStandby 方法调用失败，那么就执行 Hadoop 配置文件之中预定义的隔离措施。

Hadoop 目前主要提供两种隔离措施，通常会选择第一种：sshfence：通过 SSH 登录到目标机器上，执行命令 fuser 将对应的进程杀死； shellfence：执行一个用户自定义的 shell 脚本来将对应的进程隔离。 只有在成功地执行完成 fencing 之后，选主成功的 ActiveStandbyElector 才会回调 ZKFailoverController 的 becomeActive 方法将对应的 NameNode 转换为 Active 状态，开始对外提供服务。

NameNode 选举的实现机制与 Kafka 的 Controller 类似，那么 Kafka 是如何避免脑裂问题的呢？

Controller 给 Broker 发送的请求中，都会携带 controller epoch 信息，如果 broker 发现当前请求的 epoch 小于缓存中的值，那么就证明这是来自旧 Controller 的请求，就会决绝这个请求，正常情况下是没什么问题的； 但是异常情况下呢？如果 Broker 先收到异常 Controller 的请求进行处理呢？现在看 Kafka 在这一部分并没有适合的方案； 正常情况下，Kafka 新的 Controller 选举出来之后，Controller 会向全局所有 broker 发送一个 metadata 请求，这样全局所有 Broker 都可以知道当前最新的 controller epoch，但是并不能保证可以完全避免上面这个问题，还是有出现这个问题的几率的，只不过非常小，而且即使出现了由于 Kafka 的高可靠架构，影响也非常有限，至少从目前看，这个问题并不是严重的问题。

通过标识每次选举的版本号，并以最新版本选举结果为准，是分布式选举避免脑裂的常见做法。在其他分布式系统中，epoch 可能会被称为 term、version 等。

:::

### 【高级】YARN 如何实现高可用？

:::details 要点

YARN ResourceManager 的高可用与 HDFS NameNode 的高可用类似，但是 ResourceManager 不像 NameNode ，没有那么多的元数据信息需要维护，所以它的状态信息可以直接写到 Zookeeper 上，并依赖 Zookeeper 来进行主备选举。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192309573.png)

:::

## 参考资料

- https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html
- https://github.com/heibaiying/BigData-Notes/blob/master/notes/Hadoop-HDFS.md
- [翻译经典 HDFS 原理讲解漫画](https://blog.csdn.net/hudiefenmu/article/details/37655491)