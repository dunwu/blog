---
title: ZooKeeper 基础篇
date: 2018-07-12
categories:
- 分布式
tags:
- 分布式
- rpc
---

# ZooKeeper 基础篇

> ZooKeeper 是一个针对大型分布式系统的可靠协调系统，提供的功能包括：配置维护、名字服务、分布式同步、组服务等。
>
> ZooKeeper 的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户。
>
> 本文旨在快速入门 ZooKeeper，侧重于介绍如何使用。

<!-- TOC depthFrom:2 depthTo:3 -->

- [1. 安装](#1-安装)
    - [1.1. 下载解压 ZooKeeper](#11-下载解压-zookeeper)
    - [1.2. 创建配置文件](#12-创建配置文件)
    - [1.3. 启动 ZooKeeper 服务器](#13-启动-zookeeper-服务器)
    - [1.4. 启动 CLI](#14-启动-cli)
    - [1.5. 停止 ZooKeeper 服务器](#15-停止-zookeeper-服务器)
- [2. CLI](#2-cli)
    - [2.1. 创建 Znodes](#21-创建-znodes)
    - [2.2. 获取数据](#22-获取数据)
    - [2.3. Watch（监视）](#23-watch监视)
    - [2.4. 设置数据](#24-设置数据)
    - [2.5. 创建子项/子节点](#25-创建子项子节点)
    - [2.6. 列出子项](#26-列出子项)
    - [2.7. 检查状态](#27-检查状态)
    - [2.8. 移除 Znode](#28-移除-znode)
- [3. API](#3-api)
    - [3.1. ZooKeeper API 的基础知识](#31-zookeeper-api-的基础知识)
    - [3.2. Java 绑定](#32-java-绑定)
    - [3.3. 连接到 ZooKeeper 集合](#33-连接到-zookeeper-集合)
    - [3.4. 创建 Znode](#34-创建-znode)
    - [3.5. Exists - 检查 Znode 的存在](#35-exists---检查-znode-的存在)
    - [3.6. getData 方法](#36-getdata-方法)
    - [3.7. setData 方法](#37-setdata-方法)
    - [3.8. getChildren 方法](#38-getchildren-方法)
    - [3.9. 删除 Znode](#39-删除-znode)
- [4. 资源](#4-资源)

<!-- /TOC -->

## 1. 安装

在安装 ZooKeeper 之前，请确保你的系统是在以下任一操作系统上运行：

- **任意 Linux OS** - 支持开发和部署。适合演示应用程序。
- **Windows OS** - 仅支持开发。
- **Mac OS** - 仅支持开发。

环境要求：JDK6+

安装步骤如下：

### 1.1. 下载解压 ZooKeeper

进入官方下载地址：http://zookeeper.apache.org/releases.html#download ，选择合适版本。

解压到本地：

```
$ tar -zxf zookeeper-3.4.6.tar.gz
$ cd zookeeper-3.4.6
```

### 1.2. 创建配置文件

你必须创建 `conf/zoo.cfg` 文件，否则启动时会提示你没有此文件。

初次尝试，不妨直接使用 Kafka 提供的模板配置文件 `conf/zoo_sample.cfg`：

```
$ cp conf/zoo_sample.cfg conf/zoo.cfg
```

### 1.3. 启动 ZooKeeper 服务器

执行以下命令

```
$ bin/zkServer.sh start
```

执行此命令后，你将收到以下响应

```
$ JMX enabled by default
$ Using config: /Users/../zookeeper-3.4.6/bin/../conf/zoo.cfg
$ Starting zookeeper ... STARTED
```

### 1.4. 启动 CLI

键入以下命令

```
$ bin/zkCli.sh
```

键入上述命令后，将连接到 ZooKeeper 服务器，你应该得到以下响应。

```
Connecting to localhost:2181
................
................
................
Welcome to ZooKeeper!
................
................
WATCHER::
WatchedEvent state:SyncConnected type: None path:null
[zk: localhost:2181(CONNECTED) 0]
```

### 1.5. 停止 ZooKeeper 服务器

连接服务器并执行所有操作后，可以使用以下命令停止 zookeeper 服务器。

```
$ bin/zkServer.sh stop
```

> 本节安装内容参考：[Zookeeper 安装](https://www.w3cschool.cn/zookeeper/zookeeper_installation.html)

## 2. CLI

ZooKeeper 命令行界面（CLI）用于与 ZooKeeper 集合进行交互以进行开发。它有助于调试和解决不同的选项。

要执行 ZooKeeper CLI 操作，首先打开 ZooKeeper 服务器（“bin/zkServer.sh start”），然后打开 ZooKeeper 客户端（“bin/zkCli.sh”）。一旦客户端启动，你可以执行以下操作：

- 创建 znode
- 获取数据
- 监视 znode 的变化
- 设置数据
- 创建 znode 的子节点
- 列出 znode 的子节点
- 检查状态
- 移除/删除 znode

现在让我们用一个例子逐个了解上面的命令。

### 2.1. 创建 Znodes

用给定的路径创建一个 znode。flag 参数指定创建的 znode 是临时的，持久的还是顺序的。默认情况下，所有 znode 都是持久的。

当会话过期或客户端断开连接时，临时节点（flag：-e）将被自动删除。

顺序节点保证 znode 路径将是唯一的。

ZooKeeper 集合将向 znode 路径填充 10 位序列号。例如，znode 路径 /myapp 将转换为 /myapp0000000001，下一个序列号将为 /myapp0000000002。如果没有指定 flag，则 znode 被认为是持久的。

语法：

```
create /path /data
```

示例：

```
create /FirstZnode “Myfirstzookeeper-app"
```

输出：

```
[zk: localhost:2181(CONNECTED) 0] create /FirstZnode “Myfirstzookeeper-app"
Created /FirstZnode
```

要创建**顺序节点**，请添加 flag：**-s**，如下所示。

语法：

```
create -s /path /data
```

示例：

```
create -s /FirstZnode second-data
```

输出：

```
[zk: localhost:2181(CONNECTED) 2] create -s /FirstZnode “second-data"
Created /FirstZnode0000000023
```

要创建**临时节点**，请添加 flag：**-e** ，如下所示。

语法：

```
create -e /path /data
```

示例：

```
create -e /SecondZnode “Ephemeral-data"
```

输出：

```
[zk: localhost:2181(CONNECTED) 2] create -e /SecondZnode “Ephemeral-data"
Created /SecondZnode
```

记住当客户端断开连接时，临时节点将被删除。你可以通过退出 ZooKeeper CLI，然后重新打开 CLI 来尝试。

### 2.2. 获取数据

它返回 znode 的关联数据和指定 znode 的元数据。你将获得信息，例如上次修改数据的时间，修改的位置以及数据的相关信息。此 CLI 还用于分配监视器以显示数据相关的通知。

语法：

```
get /path
```

示例：

```
get /FirstZnode
```

输出：

```
[zk: localhost:2181(CONNECTED) 1] get /FirstZnode
“Myfirstzookeeper-app"
cZxid = 0x7f
ctime = Tue Sep 29 16:15:47 IST 2015
mZxid = 0x7f
mtime = Tue Sep 29 16:15:47 IST 2015
pZxid = 0x7f
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 22
numChildren = 0
```

要访问顺序节点，必须输入 znode 的完整路径。

示例：

```
get /FirstZnode0000000023
```

输出：

```
[zk: localhost:2181(CONNECTED) 1] get /FirstZnode0000000023
“Second-data"
cZxid = 0x80
ctime = Tue Sep 29 16:25:47 IST 2015
mZxid = 0x80
mtime = Tue Sep 29 16:25:47 IST 2015
pZxid = 0x80
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 13
numChildren = 0
```

### 2.3. Watch（监视）

当指定的 znode 或 znode 的子数据更改时，监视器会显示通知。你只能在 **get** 命令中设置**watch**。

语法：

```
get /path [watch] 1
```

示例：

```
get /FirstZnode 1
```

输出：

```
[zk: localhost:2181(CONNECTED) 1] get /FirstZnode 1
“Myfirstzookeeper-app"
cZxid = 0x7f
ctime = Tue Sep 29 16:15:47 IST 2015
mZxid = 0x7f
mtime = Tue Sep 29 16:15:47 IST 2015
pZxid = 0x7f
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 22
numChildren = 0
```

输出类似于普通的 **get** 命令，但它会等待后台等待 znode 更改。<从这里开始>

### 2.4. 设置数据

设置指定 znode 的数据。完成此设置操作后，你可以使用 **get** CLI 命令检查数据。

语法：

```
set /path /data
```

示例：

```
set /SecondZnode Data-updated
```

输出：

```
[zk: localhost:2181(CONNECTED) 1] get /SecondZnode “Data-updated"
cZxid = 0x82
ctime = Tue Sep 29 16:29:50 IST 2015
mZxid = 0x83
mtime = Tue Sep 29 16:29:50 IST 2015
pZxid = 0x82
cversion = 0
dataVersion = 1
aclVersion = 0
ephemeralOwner = 0x15018b47db00000
dataLength = 14
numChildren = 0
```

如果你在 **get** 命令中分配了**watch**选项（如上一个命令），则输出将类似如下所示。

输出：

```
[zk: localhost:2181(CONNECTED) 1] get /FirstZnode “Mysecondzookeeper-app"

WATCHER: :

WatchedEvent state:SyncConnected type:NodeDataChanged path:/FirstZnode
cZxid = 0x7f
ctime = Tue Sep 29 16:15:47 IST 2015
mZxid = 0x84
mtime = Tue Sep 29 17:14:47 IST 2015
pZxid = 0x7f
cversion = 0
dataVersion = 1
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 23
numChildren = 0
```

### 2.5. 创建子项/子节点

创建子节点类似于创建新的 znode。唯一的区别是，子 znode 的路径也将具有父路径。

语法：

```
create /parent/path/subnode/path /data
```

示例：

```
create /FirstZnode/Child1 firstchildren
```

输出：

```
[zk: localhost:2181(CONNECTED) 16] create /FirstZnode/Child1 “firstchildren"
created /FirstZnode/Child1
[zk: localhost:2181(CONNECTED) 17] create /FirstZnode/Child2 “secondchildren"
created /FirstZnode/Child2
```

### 2.6. 列出子项

此命令用于列出和显示 znode 的子项。

语法：

```
ls /path
```

示例：

```
ls /MyFirstZnode
```

输出：

```
[zk: localhost:2181(CONNECTED) 2] ls /MyFirstZnode
[mysecondsubnode, myfirstsubnode]
```

### 2.7. 检查状态

状态描述指定的 znode 的元数据。它包含时间戳，版本号，ACL，数据长度和子 znode 等细项。

语法：

```
stat /path
```

示例：

```
stat /FirstZnode
```

输出：

```
[zk: localhost:2181(CONNECTED) 1] stat /FirstZnode
cZxid = 0x7f
ctime = Tue Sep 29 16:15:47 IST 2015
mZxid = 0x7f
mtime = Tue Sep 29 17:14:24 IST 2015
pZxid = 0x7f
cversion = 0
dataVersion = 1
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 23
numChildren = 0
```

### 2.8. 移除 Znode

移除指定的 znode 并递归其所有子节点。只有在这样的 znode 可用的情况下才会发生。

语法：

```
rmr /path
```

示例：

```
rmr /FirstZnode
```

输出：

```
[zk: localhost:2181(CONNECTED) 10] rmr /FirstZnode
[zk: localhost:2181(CONNECTED) 11] get /FirstZnode
Node does not exist: /FirstZnode
```

删除（delete/path）命令类似于 remove 命令，除了它只适用于没有子节点的 znode。

## 3. API

ZooKeeper 有一个绑定 Java 和 C 的官方 API。Zookeeper 社区为大多数语言（.NET，python 等）提供非官方 API。

使用 ZooKeeper API，应用程序可以连接，交互，操作数据，协调，最后断开与 ZooKeeper 集合的连接。

ZooKeeper API 具有丰富的功能，以简单和安全的方式获得 ZooKeeper 集合的所有功能。ZooKeeper API 提供同步和异步方法。

ZooKeeper 集合和 ZooKeeper API 在各个方面都完全相辅相成，对开发人员有很大的帮助。让我们在本章讨论 Java 绑定。

### 3.1. ZooKeeper API 的基础知识

与 ZooKeeper 集合进行交互的应用程序称为 **ZooKeeper 客户端**。

Znode 是 ZooKeeper 集合的核心组件，ZooKeeper API 提供了一小组方法使用 ZooKeeper 集合来操纵 znode 的所有细节。

客户端应该遵循以步骤，与 ZooKeeper 集合进行清晰和干净的交互。

- 连接到 ZooKeeper 集合。ZooKeeper 集合为客户端分配会话 ID。
- 定期向服务器发送心跳。否则，ZooKeeper 集合将过期会话 ID，客户端需要重新连接。
- 只要会话 ID 处于活动状态，就可以获取/设置 znode。
- 所有任务完成后，断开与 ZooKeeper 集合的连接。如果客户端长时间不活动，则 ZooKeeper 集合将自动断开客户端。

### 3.2. Java 绑定

让我们来了解本章中最重要的一组 ZooKeeper API。ZooKeeper API 的核心部分是**ZooKeeper 类**。它提供了在其构造函数中连接 ZooKeeper 集合的选项，并具有以下方法：

- **connect** - 连接到 ZooKeeper 集合
- **create**- 创建 znode
- **exists**- 检查 znode 是否存在及其信息
- **getData** - 从特定的 znode 获取数据
- **setData** - 在特定的 znode 中设置数据
- **getChildren** - 获取特定 znode 中的所有子节点
- **delete** - 删除特定的 znode 及其所有子项
- **close** - 关闭连接

### 3.3. 连接到 ZooKeeper 集合

ZooKeeper 类通过其构造函数提供 connect 功能。构造函数的签名如下 :

```
ZooKeeper(String connectionString, int sessionTimeout, Watcher watcher)
```

- **connectionString** - ZooKeeper 集合主机。
- **sessionTimeout** - 会话超时（以毫秒为单位）。
- **watcher** - 实现“监视器”界面的对象。ZooKeeper 集合通过监视器对象返回连接状态。

让我们创建一个新的帮助类 **ZooKeeperConnection** ，并添加一个方法 **connect** 。 **connect** 方法创建一个 ZooKeeper 对象，连接到 ZooKeeper 集合，然后返回对象。

这里 **CountDownLatch** 用于停止（等待）主进程，直到客户端与 ZooKeeper 集合连接。

ZooKeeper 集合通过监视器回调来回复连接状态。一旦客户端与 ZooKeeper 集合连接，监视器回调就会被调用，并且监视器回调函数调用**CountDownLatch**的**countDown**方法来释放锁，在主进程中**await**。

以下是与 ZooKeeper 集合连接的完整代码。

示例：

```java
// import java classes
import java.io.IOException;
import java.util.concurrent.CountDownLatch;

// import zookeeper classes
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.KeeperState;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.AsyncCallback.StatCallback;
import org.apache.zookeeper.KeeperException.Code;
import org.apache.zookeeper.data.Stat;

public class ZooKeeperConnection {

   // declare zookeeper instance to access ZooKeeper ensemble
   private ZooKeeper zoo;
   final CountDownLatch connectedSignal = new CountDownLatch(1);

   // Method to connect zookeeper ensemble.
   public ZooKeeper connect(String host) throws IOException,InterruptedException {

      zoo = new ZooKeeper(host,5000,new Watcher() {

         public void process(WatchedEvent we) {

            if (we.getState() == KeeperState.SyncConnected) {
               connectedSignal.countDown();
            }
         }
      });

      connectedSignal.await();
      return zoo;
   }

   // Method to disconnect from zookeeper server
   public void close() throws InterruptedException {
      zoo.close();
   }
}
```

保存上面的代码，它将在下一节中用于连接 ZooKeeper 集合。

### 3.4. 创建 Znode

ZooKeeper 类提供了在 ZooKeeper 集合中创建一个新的 znode 的**create**方法。 **create** 方法的签名如下：

```
create(String path, byte[] data, List<ACL> acl, CreateMode createMode)
```

- **path** - Znode 路径。例如，/myapp1，/myapp2，/myapp1/mydata1，myapp2/mydata1/myanothersubdata
- **data** - 要存储在指定 znode 路径中的数据
- **acl** - 要创建的节点的访问控制列表。ZooKeeper API 提供了一个静态接口 **ZooDefs.Ids** 来获取一些基本的 acl 列表。例如，ZooDefs.Ids.OPEN_ACL_UNSAFE 返回打开 znode 的 acl 列表。
- **createMode** - 节点的类型，即临时，顺序或两者。这是一个**枚举**。

让我们创建一个新的 Java 应用程序来检查 ZooKeeper API 的 **create** 功能。创建文件 **ZKCreate.java** 。在 main 方法中，创建一个类型为 **ZooKeeperConnection** 的对象，并调用 **connect** 方法连接到 ZooKeeper 集合。

connect 方法将返回 ZooKeeper 对象 **zk** 。现在，请使用自定义**path**和**data**调用 **zk** 对象的 **create** 方法。

创建 znode 的完整程序代码如下：

示例：

```java
import java.io.IOException;

import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.KeeperState;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.ZooDefs;

public class ZKCreate {
   // create static instance for zookeeper class.
   private static ZooKeeper zk;

   // create static instance for ZooKeeperConnection class.
   private static ZooKeeperConnection conn;

   // Method to create znode in zookeeper ensemble
   public static void create(String path, byte[] data) throws
      KeeperException,InterruptedException {
      zk.create(path, data, ZooDefs.Ids.OPEN_ACL_UNSAFE,
      CreateMode.PERSISTENT);
   }

   public static void main(String[] args) {

      // znode path
      String path = "/MyFirstZnode"; // Assign path to znode

      // data in byte array
      byte[] data = "My first zookeeper app".getBytes(); // Declare data

      try {
         conn = new ZooKeeperConnection();
         zk = conn.connect("localhost");
         create(path, data); // Create the data to the specified path
         conn.close();
      } catch (Exception e) {
         System.out.println(e.getMessage()); //Catch error message
      }
   }
}
```

一旦编译和执行应用程序，将在 ZooKeeper 集合中创建具有指定数据的 znode。你可以使用 ZooKeeper CLI **zkCli.sh** 进行检查。

```
cd /path/to/zookeeper
bin/zkCli.sh
>>> get /MyFirstZnode
```

### 3.5. Exists - 检查 Znode 的存在

ZooKeeper 类提供了 **exists** 方法来检查 znode 的存在。如果指定的 znode 存在，则返回一个 znode 的元数据。**exists**方法的签名如下：

```
exists(String path, boolean watcher)
```

- **path**- Znode 路径
- **watcher** - 布尔值，用于指定是否监视指定的 znode

让我们创建一个新的 Java 应用程序来检查 ZooKeeper API 的“exists”功能。创建文件“ZKExists.java”。在 main 方法中，使用“ZooKeeperConnection”对象创建 ZooKeeper 对象“zk”。然后，使用自定义“path”调用“zk”对象的“exists”方法。完整的列表如下：

示例：

```java
import java.io.IOException;

import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.KeeperState;
import org.apache.zookeeper.data.Stat;

public class ZKExists {
   private static ZooKeeper zk;
   private static ZooKeeperConnection conn;

   // Method to check existence of znode and its status, if znode is available.
   public static Stat znode_exists(String path) throws
      KeeperException,InterruptedException {
      return zk.exists(path, true);
   }

   public static void main(String[] args) throws InterruptedException,KeeperException {
      String path = "/MyFirstZnode"; // Assign znode to the specified path

      try {
         conn = new ZooKeeperConnection();
         zk = conn.connect("localhost");
         Stat stat = znode_exists(path); // Stat checks the path of the znode

         if(stat != null) {
            System.out.println("Node exists and the node version is " +
            stat.getVersion());
         } else {
            System.out.println("Node does not exists");
         }

      } catch(Exception e) {
         System.out.println(e.getMessage()); // Catches error messages
      }
   }
}
```

一旦编译和执行应用程序，你将获得以下输出。

```
Node exists and the node version is 1.
```

### 3.6. getData 方法

ZooKeeper 类提供 **getData** 方法来获取附加在指定 znode 中的数据及其状态。 **getData** 方法的签名如下：

```
getData(String path, Watcher watcher, Stat stat)
```

- **path** - Znode 路径。
- **watcher** - 监视器类型的回调函数。当指定的 znode 的数据改变时，ZooKeeper 集合将通过监视器回调进行通知。这是一次性通知。
- **stat** - 返回 znode 的元数据。

让我们创建一个新的 Java 应用程序来了解 ZooKeeper API 的 **getData** 功能。创建文件 **ZKGetData.java** 。在 main 方法中，使用 **ZooKeeperConnection** 对象创建一个 ZooKeeper 对象 **zk** 。然后，使用自定义路径调用 zk 对象的 **getData** 方法。

下面是从指定节点获取数据的完整程序代码：

示例：

```java
import java.io.IOException;
import java.util.concurrent.CountDownLatch;

import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.KeeperState;
import org.apache.zookeeper.data.Stat;

public class ZKGetData {

   private static ZooKeeper zk;
   private static ZooKeeperConnection conn;
   public static Stat znode_exists(String path) throws
      KeeperException,InterruptedException {
      return zk.exists(path,true);
   }

   public static void main(String[] args) throws InterruptedException, KeeperException {
      String path = "/MyFirstZnode";
      final CountDownLatch connectedSignal = new CountDownLatch(1);

      try {
         conn = new ZooKeeperConnection();
         zk = conn.connect("localhost");
         Stat stat = znode_exists(path);

         if(stat != null) {
            byte[] b = zk.getData(path, new Watcher() {

               public void process(WatchedEvent we) {

                  if (we.getType() == Event.EventType.None) {
                     switch(we.getState()) {
                        case Expired:
                        connectedSignal.countDown();
                        break;
                     }

                  } else {
                     String path = "/MyFirstZnode";

                     try {
                        byte[] bn = zk.getData(path,
                        false, null);
                        String data = new String(bn,
                        "UTF-8");
                        System.out.println(data);
                        connectedSignal.countDown();

                     } catch(Exception ex) {
                        System.out.println(ex.getMessage());
                     }
                  }
               }
            }, null);

            String data = new String(b, "UTF-8");
            System.out.println(data);
            connectedSignal.await();

         } else {
            System.out.println("Node does not exists");
         }
      } catch(Exception e) {
        System.out.println(e.getMessage());
      }
   }
}
```

一旦编译和执行应用程序，你将获得以下输出

```
My first zookeeper app
```

应用程序将等待 ZooKeeper 集合的进一步通知。使用 ZooKeeper CLI **zkCli.sh** 更改指定 znode 的数据。

```
cd /path/to/zookeeper
bin/zkCli.sh
>>> set /MyFirstZnode Hello
```

现在，应用程序将打印以下输出并退出。

```
Hello
```

### 3.7. setData 方法

ZooKeeper 类提供 **setData** 方法来修改指定 znode 中附加的数据。 **setData** 方法的签名如下：

```
setData(String path, byte[] data, int version)
```

- **path**- Znode 路径
- **data** - 要存储在指定 znode 路径中的数据。
- **version**- znode 的当前版本。每当数据更改时，ZooKeeper 会更新 znode 的版本号。

现在让我们创建一个新的 Java 应用程序来了解 ZooKeeper API 的 **setData** 功能。创建文件 **ZKSetData.java** 。在 main 方法中，使用 **ZooKeeperConnection** 对象创建一个 ZooKeeper 对象 **zk** 。然后，使用指定的路径，新数据和节点版本调用 **zk** 对象的 **setData** 方法。

以下是修改附加在指定 znode 中的数据的完整程序代码。

示例：

```java
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.KeeperState;

import java.io.IOException;

public class ZKSetData {
   private static ZooKeeper zk;
   private static ZooKeeperConnection conn;

   // Method to update the data in a znode. Similar to getData but without watcher.
   public static void update(String path, byte[] data) throws
      KeeperException,InterruptedException {
      zk.setData(path, data, zk.exists(path,true).getVersion());
   }

   public static void main(String[] args) throws InterruptedException,KeeperException {
      String path= "/MyFirstZnode";
      byte[] data = "Success".getBytes(); //Assign data which is to be updated.

      try {
         conn = new ZooKeeperConnection();
         zk = conn.connect("localhost");
         update(path, data); // Update znode data to the specified path
      } catch(Exception e) {
         System.out.println(e.getMessage());
      }
   }
}
```

编译并执行应用程序后，指定的 znode 的数据将被改变，并且可以使用 ZooKeeper CLI **zkCli.sh** 进行检查。

```
cd /path/to/zookeeper
bin/zkCli.sh
>>> get /MyFirstZnode
```

### 3.8. getChildren 方法

ZooKeeper 类提供 **getChildren** 方法来获取特定 znode 的所有子节点。 **getChildren** 方法的签名如下：

```
getChildren(String path, Watcher watcher)
```

- **path** - Znode 路径。
- **watcher** - 监视器类型的回调函数。当指定的 znode 被删除或 znode 下的子节点被创建/删除时，ZooKeeper 集合将进行通知。这是一次性通知。

示例：

```java
import java.io.IOException;
import java.util.*;

import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.KeeperState;
import org.apache.zookeeper.data.Stat;

public class ZKGetChildren {
   private static ZooKeeper zk;
   private static ZooKeeperConnection conn;

   // Method to check existence of znode and its status, if znode is available.
   public static Stat znode_exists(String path) throws
      KeeperException,InterruptedException {
      return zk.exists(path,true);
   }

   public static void main(String[] args) throws InterruptedException,KeeperException {
      String path = "/MyFirstZnode"; // Assign path to the znode

      try {
         conn = new ZooKeeperConnection();
         zk = conn.connect("localhost");
         Stat stat = znode_exists(path); // Stat checks the path

         if(stat!= null) {

            // getChildren method - get all the children of znode.It has two args, path and watch
            List <String> children = zk.getChildren(path, false);
            for(int i = 0; i < children.size(); i++)
            System.out.println(children.get(i)); //Print children's
         } else {
            System.out.println("Node does not exists");
         }

      } catch(Exception e) {
         System.out.println(e.getMessage());
      }

   }
}
```

在运行程序之前，让我们使用 ZooKeeper CLI **zkCli.sh** 为 **/MyFirstZnode** 创建两个子节点。

```
cd /path/to/zookeeper
bin/zkCli.sh
>>> create /MyFirstZnode/myfirstsubnode Hi
>>> create /MyFirstZnode/mysecondsubmode Hi
```

现在，编译和运行程序将输出上面创建的 znode。

```
myfirstsubnode
mysecondsubnode
```

### 3.9. 删除 Znode

ZooKeeper 类提供了 **delete** 方法来删除指定的 znode。 **delete** 方法的签名如下：

```
delete(String path, int version)
```

- **path** - Znode 路径。
- **version** - znode 的当前版本。

让我们创建一个新的 Java 应用程序来了解 ZooKeeper API 的 **delete** 功能。创建文件 **ZKDelete.java** 。在 main 方法中，使用 **ZooKeeperConnection** 对象创建一个 ZooKeeper 对象 **zk** 。然后，使用指定的路径和版本号调用 **zk** 对象的 **delete** 方法。

删除 znode 的完整程序代码如下：

示例：

```java
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.KeeperException;

public class ZKDelete {
   private static ZooKeeper zk;
   private static ZooKeeperConnection conn;

   // Method to check existence of znode and its status, if znode is available.
   public static void delete(String path) throws KeeperException,InterruptedException {
      zk.delete(path,zk.exists(path,true).getVersion());
   }

   public static void main(String[] args) throws InterruptedException,KeeperException {
      String path = "/MyFirstZnode"; //Assign path to the znode

      try {
         conn = new ZooKeeperConnection();
         zk = conn.connect("localhost");
         delete(path); //delete the node with the specified path
      } catch(Exception e) {
         System.out.println(e.getMessage()); // catches error messages
      }
   }
}
```

## 4. 资源

| [官网](http://zookeeper.apache.org/) | [官网文档](https://cwiki.apache.org/confluence/display/ZOOKEEPER) | [Github](https://github.com/apache/zookeeper) |
