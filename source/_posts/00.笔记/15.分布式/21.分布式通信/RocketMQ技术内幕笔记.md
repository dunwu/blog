---
title: 《RocketMQ 技术内幕》笔记
date: 2022-07-12 16:58:58
categories:
  - 笔记
  - 分布式
  - 分布式通信
tags:
  - 分布式
  - 分布式通信
  - MQ
  - RocketMQ
permalink: /pages/73fdf38a/
---

# 《RocketMQ 技术内幕》笔记

## 读源代码前的准备

### RocketMQ 源代码的目录结构

- `broker`：broker 模块（broker 启动进程） 。
- `client`：消息客户端，包含生产者、消息消费者相关类。
- `common`：公共包。
- `dev`：开发者信息（非源代码） 。
- `distribution`：部署实例文件夹（非源代码） 。
- `example`：RocketMQ 示例代码。
- `filter`：消息过滤相关基础类。
- `filter`：消息过滤服务器实现相关类（Filter 启动进程） 。
- `logappender`：日志实现相关类。
- `namesrv`：N ameServer 实现相关类（Names 巳 rver 启动进程） 。
- `openmessaging`：消息开放标准，正在制定中。
- `remoting`：远程通信模块，基于 Netty 。
- `srvutil`：服务器工具类。
- `store`：消息存储实现相关类。
- `style`：checkstyle 相关实现。
- `test`：测试相关类。
- `tools`：工具类，监控命令相关实现类。

### RocketMQ 的设计理念和目标

#### 设计理念

RocketMQ 设计基于主题的订阅与发布模式， 其核心功能包括：消息发送、消息存储( Broker ）、消息消费。其整体设计追求简单与性能第一，主要体现在如下三个方面：

- 自研 NameServer，而不是用 ZooKeeper 作为注册中心。因为 ZooKeeper 采用 CAP 模型中的 CP 模型，其实并不适用于注册中心的业务模式。
- RocketMQ 的消息存储文件设计成文件组的概念，组内单个文件大小固定，方便引入内存映射机制，所有主
  题的消息存储基于顺序写， 极大地提供了消息写性能，同时为了兼顾消息消费与消息查找，引入了消息消费队列文件与索引文件。
- 容忍存在设计缺陷，适当将某些工作下放给 RocketMQ 使用者。消息中间件的实现者经常会遇到一个难题：如何保证消息一定能被消息消费者消费，并且保证只消费一次。RocketMQ 的设计者给出的解决办法是不解决这个难题，而是退而求其次，只保证消息被消费者消费，但设计上允许消息被重复消费，这样极大地简化了消息中间件的内核，使得实现消息发送高可用变得非常简单与高效，消息重复问题由消费者在消息消费时实现幂等。

#### 设计目标

- **架构模式**：RocketMQ 与大部分消息中间件一样，采用发布订阅模式，基本的参与组件主要包括：消息发送者、消息服务器（消息存储）、消息消费、路由发现。
- **顺序消息**：所谓顺序消息，就是消息消费者按照消息达到消息存储服务器的顺序消费。RocketMQ 可以严格保证消息有序。
- **消息过滤**：消息过滤是指在消息消费时，消息消费者可以对同一主题下的消息按照规则只消费自己感兴趣的消息。RocketMQ 消息过滤支持在服务端与消费端的消息过滤机制。
- 消息在 Broker 端过滤。Broker 只将消息消费者感兴趣的消息发送给消息消费者。
- 消息在消息消费端过滤，消息过滤方式完全由消息消费者自定义，但缺点是有很多无用的消息会从 Broker 传输到消费端。
- **消息存储**：消息中间件的一个核心实现是消息的存储，对消息存储一般有如下两个维度的考量：消息堆积能力和消息存储性能。RocketMQ 追求消息存储的高性能，引人内存映射机制，所有主题的消息顺序存储在同一个文件中。同时为了避免消息无限在消息存储服务器中累积，引入了消息文件过期机制与文件存储空间报警机制。
- **消息高可用性**：
  - 通常影响消息可靠性的有以下几种情况。
    1. Broker 正常关机。
    2. Broker 异常 Crash 。
    3. OS Crash 。
    4. 机器断电，但是能立即恢复供电情况。
    5. 机器无法开机（可能是 CPU 、主板、内存等关键设备损坏） 。
    6. 磁盘设备损坏。
  - 针对上述情况，情况 1~4 的 RocketMQ 在同步刷盘机制下可以确保不丢失消息，在异步刷盘模式下，会丢失少量消息。情况 5-6 属于单点故障，一旦发生，该节点上的消息全部丢失，如果开启了异步复制机制， RoketMQ 能保证只丢失少量消息， RocketMQ 在后续版本中将引人双写机制，以满足消息可靠性要求极高的场合。
- **消息到达（ 消费）低延迟**：RocketMQ 在消息不发生消息堆积时，以长轮询模式实现准实时的消息推送模式。
- **确保消息必须被消费一次**：RocketMQ 通过消息消费确认机制（ACK）来确保消息至少被消费一次，但由于 ACK 消息有可能丢失等其他原因， RocketMQ 无法做到消息只被消费一次，有重复消费的可能。
- **回溯消息**：回溯消息是指消息消费端已经消费成功的消息，由于业务要求需要重新消费消息。RocketMQ 支持按时间回溯消息，时间维度可精确到毫秒，可以向前或向后回溯。
- **消息堆积**：消息中间件的主要功能是异步解耦，必须具备应对前端的数据洪峰，提高后端系统的可用性，必然要求消息中间件具备一定的消息堆积能力。RocketMQ 消息存储使用磁盘文件（内存映射机制），并且在物理布局上为多个大小相等的文件组成逻辑文件组，可以无限循环使用。RocketMQ 消息存储文件并不是永久存储在消息服务器端，而是提供了过期机制，默认保留 3 天。
- **定时消息**：定时消息是指消息发送到 Broker 后， 不能被消息消费端立即消费，要到特定的时间点或者等待特定的时间后才能被消费。如果要支持任意精度的定时消息消费，必须在消息服务端对消息进行排序，势必带来很大的性能损耗，故 RocketMQ 不支持任意进度的定时消息，而只支持特定延迟级别。
- **消息重试机制**：消息重试是指消息在消费时，如果发送异常，消息中间件需要支持消息重新投递，RocketMQ 支持消息重试机制。

## RocketMQ 路由中心 NameServer

### NameServer 架构设计

Broker 消息服务器在启动时向所有 NameServer 注册，生产者（Producer）在发送消息之前先从 NameServer 获取 Broker 服务器地址列表，然后根据负载算法从列表中选择一台消息服务器进行消息发送。NameServer 与每台 Broker 服务器保持长连接，并间隔 30s 检测 Broker 是否存活，如果检测到 Broker 宕机， 则从路由注册表中将其移除。但是路由变化不会马上通知生产者，为什么要这样设计呢？这是为了降低 NameServer 实现的复杂性，在消息发送端提供容错机制来保证消息发送的高可用性。

NameServer 本身的高可用可通过部署多台 NameServer 服务器来实现，但彼此之间互不通信，也就是说 NameServer 服务器之间在某一时刻的数据并不会完全相同，但这对消息发送不会造成任何影响。

### NameServer 启动流程

1. 加载配置，然后根据配置初始化 `NamesrvController`

```java
    public static NamesrvController createNamesrvController(String[] args) throws IOException, JoranException {
        System.setProperty(RemotingCommand.REMOTING_VERSION_KEY, Integer.toString(MQVersion.CURRENT_VERSION));
        //PackageConflictDetect.detectFastjson();

        Options options = ServerUtil.buildCommandlineOptions(new Options());
        commandLine = ServerUtil.parseCmdLine("mqnamesrv", args, buildCommandlineOptions(options), new PosixParser());
        if (null == commandLine) {
            System.exit(-1);
            return null;
        }

        // 1. 初始化 NamesrvConfig 配置和 NettyServerConfig 配置
        final NamesrvConfig namesrvConfig = new NamesrvConfig();
        final NettyServerConfig nettyServerConfig = new NettyServerConfig();
        nettyServerConfig.setListenPort(9876);

        // 1.1. 加载配置文件中的配置
        if (commandLine.hasOption('c')) {
            String file = commandLine.getOptionValue('c');
            if (file != null) {
                InputStream in = new BufferedInputStream(new FileInputStream(file));
                properties = new Properties();
                properties.load(in);
                MixAll.properties2Object(properties, namesrvConfig);
                MixAll.properties2Object(properties, nettyServerConfig);

                namesrvConfig.setConfigStorePath(file);

                System.out.printf("load config properties file OK, %s%n", file);
                in.close();
            }
        }

        // 1.2. 加载启动命令中的配置
        if (commandLine.hasOption('p')) {
            InternalLogger console = InternalLoggerFactory.getLogger(LoggerName.NAMESRV_CONSOLE_NAME);
            MixAll.printObjectProperties(console, namesrvConfig);
            MixAll.printObjectProperties(console, nettyServerConfig);
            System.exit(0);
        }

        MixAll.properties2Object(ServerUtil.commandLine2Properties(commandLine), namesrvConfig);

        // 2. 强制必须设置环境变量 ROCKETMQ_HOME
        if (null == namesrvConfig.getRocketmqHome()) {
            System.out.printf("Please set the %s variable in your environment to match the location of the RocketMQ installation%n", MixAll.ROCKETMQ_HOME_ENV);
            System.exit(-2);
        }

        // 3. 打印配置项
        LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();
        JoranConfigurator configurator = new JoranConfigurator();
        configurator.setContext(lc);
        lc.reset();
        configurator.doConfigure(namesrvConfig.getRocketmqHome() + "/conf/logback_namesrv.xml");

        log = InternalLoggerFactory.getLogger(LoggerName.NAMESRV_LOGGER_NAME);

        MixAll.printObjectProperties(log, namesrvConfig);
        MixAll.printObjectProperties(log, nettyServerConfig);

        final NamesrvController controller = new NamesrvController(namesrvConfig, nettyServerConfig);

        // remember all configs to prevent discard
        controller.getConfiguration().registerConfig(properties);

        return controller;
    }

```

2. 根据启动属性创建 NamesrvController 实例，并初始化该实例， NameServerController 实例为 NameServer 核心控制器。

```java
public boolean initialize() {

    // 加载KV 配置
    this.kvConfigManager.load();

    // 创建 NettyRemotingServer 网络处理对象
    this.remotingServer = new NettyRemotingServer(this.nettyServerConfig, this.brokerHousekeepingService);

    this.remotingExecutor =
        Executors.newFixedThreadPool(nettyServerConfig.getServerWorkerThreads(), new ThreadFactoryImpl("RemotingExecutorThread_"));

    // 注册进程
    this.registerProcessor();

    // 开启两个定时任务（心跳检测）
    // 任务一：NameServer 每隔 1O 秒扫描一次 Broker，移除不活跃的 Broker
    this.scheduledExecutorService.scheduleAtFixedRate(new Runnable() {

        @Override
        public void run() {
            NamesrvController.this.routeInfoManager.scanNotActiveBroker();
        }
    }, 5, 10, TimeUnit.SECONDS);
    // 任务二：NameServer 每隔 1O 分钟打印一次 KV 配置
    this.scheduledExecutorService.scheduleAtFixedRate(new Runnable() {

        @Override
        public void run() {
            NamesrvController.this.kvConfigManager.printAllPeriodically();
        }
    }, 1, 10, TimeUnit.MINUTES);

    // 如果是 TLS 模式，加载证书，开启安全模式
    if (TlsSystemConfig.tlsMode != TlsMode.DISABLED) {
        // Register a listener to reload SslContext
        try {
            fileWatchService = new FileWatchService(
                new String[] {
                    TlsSystemConfig.tlsServerCertPath,
                    TlsSystemConfig.tlsServerKeyPath,
                    TlsSystemConfig.tlsServerTrustCertPath
                },
                new FileWatchService.Listener() {
                    boolean certChanged, keyChanged = false;
                    @Override
                    public void onChanged(String path) {
                        if (path.equals(TlsSystemConfig.tlsServerTrustCertPath)) {
                            log.info("The trust certificate changed, reload the ssl context");
                            reloadServerSslContext();
                        }
                        if (path.equals(TlsSystemConfig.tlsServerCertPath)) {
                            certChanged = true;
                        }
                        if (path.equals(TlsSystemConfig.tlsServerKeyPath)) {
                            keyChanged = true;
                        }
                        if (certChanged && keyChanged) {
                            log.info("The certificate and private key changed, reload the ssl context");
                            certChanged = keyChanged = false;
                            reloadServerSslContext();
                        }
                    }
                    private void reloadServerSslContext() {
                        ((NettyRemotingServer) remotingServer).loadSslContext();
                    }
                });
        } catch (Exception e) {
            log.warn("FileWatchService created error, can't load the certificate dynamically");
        }
    }

    return true;
}
```

3. 注册 JVM 钩子函数并启动服务器，以便监昕 Broker 、生产者的网络请求。

```java
        // 注册 JVM 钩子函数并启动服务器，以便监昕Broker、 生产者的网络请求
        // 如果代码中使用了线程池，一种优雅停机的方式就是注册一个 JVM 钩子函数，在 JVM 进程关闭之前，先将线程池关闭，及时释放资源
        Runtime.getRuntime().addShutdownHook(new ShutdownHookThread(log, new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                controller.shutdown();
                return null;
            }
        }));
```

### NameServer 路由注册、故障剔除

NameServer 主要作用是为生产者和消息消费者提供关于主题 Topic 的路由信息，那么 NameServer 需要存储路由的基础信息，还要能够管理 Broker 节点，包括路由注册、路由删除等功能。

#### 路由元信息

NameServer 路由实现类：org.apache.rocketmq.namesrv.routeinfo.RouteInfoManager。它主要存储了以下信息：

- `topicQueueTable`：Topic 消息队列路由信息，消息发送时根据路由表进行负载均衡。
- `brokerAddrTable`：Broker 基础信息， 包含 brokerName 、所属集群名称、主备 Broker 地址。
- `clusterAddrTable`：Broker 集群信息，存储集群中所有 Broker 名称。
- `brokerLiveTable`：Broker 状态信息。NameServer 每次收到心跳包时会替换该信息。
- `filterServerTable`：Broker 上的 FilterServer 列表，用于类模式消息过滤。

RocketMQ 基于订阅发布机制，一个 Topic 拥有多个消息队列，一个 Broker 为每一主题默认创建 4 个读队列 4 个写队列。多个 Broker 组成一个集群，BrokerName 由相同的多台 Broker 组成 Master-Slave 架构， brokerId 为 0 代表 Master，大于 0 表示 Slave。BrokerLiveInfo 中的 lastUpdateTimestamp 存储上次收到 Broker 心跳包的时间。

#### 路由注册

RocketMQ 路由注册是通过 Broker 与 NameServer 的心跳功能实现的。Broker 启动时向集群中所有的 NameServer 发送心跳语句，每隔 30s 向集群中所有 NameServer 发送心跳包， NameServer 收到 Broker 心跳包时会更新 brokerLiveTable 缓存中 BrokerLiveInfo 的 lastUpdateTimestamp ，然后 NameServer 每隔 10s 扫描 brokerLiveTable ，如果连续 120s 没有收到心跳包， NameServer 将移除该 Broker 的路由信息同时关闭 Socket 连接。

（1）Broker 发送心跳包

Broker 会遍历 NameServer 列表， 依次向所有 NameServer 发送心跳包。

（2）NameServer 处理心跳包

- 路由注册需要加写锁，防止并发修改 RouteInfoManager 中的路由表。
- 判断 Broker 所属集群是否存在，如果不存在，则创建，然后将 broker 加入到 Broker 集群。
- 维护 BrokerData 信息，首先从 brokerAddrTable 根据 BrokerName 尝试获取 Broker 信息。
  - 如果不存在，则新建 BrokerData 并放入到 brokerAddrTable, registerFirst 设置为 true；
  - 如果存在，直接将 registerFirst 设置为 false，表示非第一次注册。
- 如果 Broker 为 Master，并且 Broker Topic 配置信息发生变化或者是初次注册，则需要创建或更新 Topic 路由元数据。填充 topicQueueTable，其实就是为默认主题自动注册路由信息，其中包含 MixAII.DEFAULT_TOPIC 的路由信息。当生产者发送主题时，如果该主题未创建并且 BrokerConfig 的 autoCreateTopicEnable 为 true 时，将返回 MixAII.DEFAULT_TOPIC 的路由信息。
- 更新 BrokerLiveInfo，存活 Broker 信息表，BrokeLiveInfo 是执行路由删除的重要依据。
- 注册 Broker 的过滤器 Server 地址列表，一个 Broker 上会关联多个 FilterServer 消息过滤服务器；如果此 Broker 为从节点，则需要查找该 Broker 的 Master 的节点信息，并更新对应的 masterAddr 属性。

设计亮点： NameServe 与 Broker 保持长连接， Broker 状态存储在 brokerLiveTable 中，NameServer 每收到一个心跳包，将更新 brokerLiveTable 中关于 Broker 的状态信息以及路由表（topicQueueTable 、brokerAddrTable 、brokerLiveTable 、filterServerTable） 。更新上述路由表（HashTable）使用了锁粒度较少的读写锁，允许多个消息发送者（Producer ）并发读，保证消息发送时的高并发。但同一时刻 NameServer 只处理一个 Broker 心跳包，多个心跳包请求串行执行。

#### 路由删除

Broker 每隔 30s 向 NameServe 发送一个心跳包，心跳包中包含 BrokerId 、Broker 地址、Broker 名称、Broker 所属集群名称、Broker 关联的 FilterServer 列表。但是如果 Broker 宕机，NameServer 无法收到心跳包，此时 NameServer 如何来剔除这些失效的 Broker 呢？ NameServer 会每隔 10s 扫描 brokerLiveTable 状态表，如果 BrokerLive 的 lastUpdateTimestamp 的时间戳距当前时间超过 120s ，则认为 Broker 失效，移除该 Broker，关闭与 Broker 连接，并同时更新 topicQueueTable 、brokerAddrTable 、brokerLiveTable 、filterServerTable 。

RocktMQ 有两个触发点来触发路由删除。

- NameServer 定时扫描 brokerLiveTable 检测上次心跳包与当前系统时间的时间差，如果时间戳大于 120s ，则需要移除该 Broker 信息。

- Broker 在正常被关闭的情况下，会执行 unregisterBroker 指令。

由于不管是何种方式触发的路由删除，路由删除的方法都是一样的，就是从 topicQueueTable 、rokerAddrTable 、brokerLiveTable 、filterServerTable 删除与该 Broker 相关的信息，但 RocketMQ 这两种方式维护路由信息时会抽取公共代码。

scanNotActiveBroker 在 NameServer 中每 10s 执行一次。逻辑很简单：遍历 brokerLiveInfo 路由表（HashMap），检测 BrokerLiveInfo 的 lastUpdateTimestamp。上次收到心跳包的时间如果超过当前时间 120s，NameServer 则认为该 Broker 已不可用，故需要将它移除，关闭 Channel，然后删除与该 Broker 相关的路由信息，路由表维护过程，需要申请写锁。

（1）申请写锁，根据 brokerAddress 从 brokerLiveTable 、filterServerTable 移除

（2）维护 brokerAddrTable 。遍历从 `HashMap<String /* brokerName */, BrokerData> brokerAddrTable`，从 BrokerData 的 `HashMap<Long /* brokerId */, String /* broker address */> brokerAddrs` 中，找到具体的 Broker ，从 BrokerData 中移除，如果移除后在 BrokerData 中不再包含其他 Broker，则在 brokerAddrTable 中移除该 brokerName 对应的条目。

（3）根据 brokerName，从 clusterAddrTable 中找到 Broker 并从集群中移除。如果移除后，集群中不包含任何 Broker，则将该集群从 clusterAddrTable 中移除。

（4）根据 brokerName，遍历所有主题的队列，如果队列中包含了当前 Broker 的队列， 则移除，如果 topic 只包含待移除 Broker 的队列的话，从路由表中删除该 topic。

#### 路由发现

RocketMQ 路由发现是非实时的，当 Topic 路由出现变化后，NameServer 不主动推送给客户端，而是由客户端定时拉取主题最新的路由。根据主题名称拉取路由信息的命令编码为：GET_ROUTEINTO_BY_TOPIC 。

orderTopicConf ：顺序消息配置内容，来自于 kvConfig 。

`List<QueueData> queueData`：topic 队列元数据。

`List<BrokerData> brokerDatas`：topic 分布的 broker 元数据。

`HashMap<String/*brokerAdress*/,List<String> /*filterServer*/>` ：broker 上过滤服务器地址列表。

NameServer 路由发现实现方法：`DefaultRequestProcessor#getRouteInfoByTopic`

1. 调用 RouterlnfoManager 的方法，从路由表 topicQueueTable 、brokerAddrTable 、filterServerTable 中分别填充 TopicRouteData 中的 `List<QueueData>`、`List<BrokerData>` 和 filterServer 地址表。

2. 如果找到主题对应的路由信息并且该主题为顺序消息，则从 NameServer KVconfig 中获取关于顺序消息相关的配置填充路由信息。

如果找不到路由信息 CODE 则使用 TOPIC NOT_EXISTS ，表示没有找到对应的路由。

## RocketMQ 消息发送

### 漫谈 RocketMQ 消息发送

RocketMQ 支持 3 种消息发送方式：同步（sync） 、异步（async）、单向（oneway） 。

- **同步**：发送者向 MQ 执行发送消息 API 时，同步等待， 直到消息服务器返回发送结果。
- **异步**：发送者向 MQ 执行发送消息 API 时，指定消息发送成功后的回掉函数，然后调用消息发送 API 后，立即返回，消息发送者线程不阻塞，直到运行结束，消息发送成功或失败的回调任务在一个新的线程中执行。
- **单向**：消息发送者向 MQ 执行发送消息 API 时，直接返回，不等待消息服务器的结果，也不注册回调函数，简单地说，就是只管发，不在乎消息是否成功存储在消息服务器上。

RocketMQ 消息发送需要考虑以下几个问题。

- 消息队列如何进行负载？
- 消息发送如何实现高可用？
- 批量消息发送如何实现一致性？

### 认识 RocketMQ 消息

RocketMQ 消息的封装类是 `org.apache.rocketmq.common.message.Message`。其主要属性有：

- `topic`：主题
- `properties`：属性容器。RocketMQ 会向其中添加一些扩展属性：
  - `tags`：消息标签，用于消息过滤。
  - `keys`：消息索引，多个用空格隔开，RocketMQ 可以根据这些 key 快速检索到消息。
  - `waitStoreMsgOK`：消息发送时是否等消息存储完成后再返回。
  - `delayTimeLevel`：消息延迟级别，用于定时消息或消息重试。
- `body`：消息体
- `transactionId`：事务 ID

### 生产者启动流程

`DefaultMQProducer` 是默认的生产者实现类。它实现了 `MQAdmin` 的接口。

#### 初识 `DefaultMQProducer` 消息发送者

##### `DefaultMQProducer` 的主要方法

- `void createTopic(String key, String newTopic, int queueNum, int topicSysFlag)`：创建主题
  - `key`：目前未实际作用，可以与 newTopic 相同。
  - `newTopic`：主题名称。
  - `queueNum`：队列数量。
  - `topicSysFlag`：主题系统标签，默认为 0 。
- `long searchOffset(final MessageQueue mq, final long timestamp)`：根据时间戳从队列中查找其偏移量。
- `long maxOffset(final MessageQueue mq)`：查找该消息队列中最大的物理偏移量。
- `long minOffset(final MessageQueue mq)`：查找该消息队列中最小物理偏移量。
- `MessageExt viewMessage(final String offsetMsgld)`：根据消息偏移量查找消息。
- `QueryResult queryMessage(final String topic, final String key, final int maxNum, final long begin, final long end)`：根据条件查询消息。
  - `topic`：消息主题。
  - `key`：消息索引字段。
  - `maxNum`：本次最多取出消息条数。
  - `begin`：开始时间。
  - `end`：结束时间。
- `MessageExt viewMessage(String topic,String msgld)`：根据主题与消息 ID 查找消息。
- `List<MessageQueue> fetchPublishMessageQueues(final String topic)`：查找该主题下所有的消息队列。
- `SendResult send(final Message msg)`：同步发送消息，具体发送到主题中的哪个消息队列由负载算法决定。
- `SendResult send(final Message msg, final long timeout)`：同步发送消息，如果发送超过 timeout 则抛出超时异常。
- `void send(final Message msg, final SendCallback sendCallback)`：异步发送消息， sendCallback 参数是消息发送成功后的回调方法。
- `void send(final Message msg, final SendCallback sendCallback, final long timeout)`：异步发送消息，如果发送超过 timeout 指定的值，则抛出超时异常。
- `void sendOneway(final Message msg)`：单向消息发送，就是不在乎发送结果，消息发送出去后该方法立即返回。
- `SendResult send(final Message msg, final MessageQueue mq)`：同步方式发送消息，发送到指定消息队列。
- `void send(final Message msg, final MessageQueue mq, final SendCallback sendCallback)`：异步方式发送消息，发送到指定消息队列。
- `void sendOneway(final Message msg, final MessageQueue mq)`：单向方式发送消息，发送到指定的消息队列。
- `SendResult send(final Message msg , final MessageQueueSelector selector, final Object arg)`：消息发送，指定消息选择算法，覆盖生产者默认的消息队列负载。
- `SendResult send(final Collection<Message> msgs, final MessageQueue mq, final long timeout)`：同步批量消息发送。

##### `DefaultMQProducer` 的核心属性

- `producerGroup`：生产者所属组，消息服务器在回查事务状态时会随机选择该组中任何一个生产者发起事务回查请求。
- `createTopicKey`：默认 topicKey 。
- `defaultTopicQueueNums`：默认主题在每一个 Broker 队列数量。
- `sendMsgTimeout`：发送消息默认超时时间， 默认 3s 。
- `compressMsgBodyOverHowmuch`：消息体超过该值则启用压缩，默认 4K。
- `retryTimesWhenSendFailed`：同步方式发送消息重试次数，默认为 2 ，总共执行 3 次。
- `retryTimesWhenSendAsyncFailed`：异步方式发送消息重试次数，默认为 2 。
- `retryAnotherBrokerWhenNotStoreOK`：消息重试时选择另外一个 Broker ，是否不等待存储结果就返回， 默认为 false 。
- `maxMessageSize`：允许发送的最大消息长度，默认为 4M ，眩值最大值为 2^32-1 。

#### 生产者启动流程

`DefaultMQProducerImpl#start()` 是生产者的启动方法，其主要工作流程如下：

1. 检查生产者组（`productGroup`）是否符合要求；并改变生产者的 `instanceName` 为进程 ID 。
2. 获取或创建 `MQClientInstance` 实例。
   - 整个 JVM 实例中只存在一个 `MQClientManager` 实例（单例）。
   - `MQClientManager` 中维护一个 `ConcurrentMap` 类型的缓存，用于保证同一个 `clientId` 只会创建一个 `MQClientInstance`。
3. 将当前生产者注册到 `MQClientInstance` 中，方便后续调用网络请求、进行心跳检测等。
4. 启动 `MQClientInstance` ，如果 `MQClientInstance` 已经启动，则本次启动不会真正执行。
5. 向所有 Broker 发送心跳。
6. 启动一个定时任务，用于定期清理过时的发送请求。

### 消息发送基本流程

消息发送的核心方法是 `DefaultMQProducerImpl#sendDefaultImpl`。

#### 消息长度验证

消息发送之前，首先确保生产者处于运行状态，然后验证消息是否符合相应的规范，具体的规范要求是主题名称、消息体不能为空、消息长度不能等于 0 且默认不能超过允许发送消息的最大长度 4M（`maxMessageSize=l024 * 1024 * 4`） 。

#### 查找主题路由信息

消息发送之前，首先需要获取主题的路由信息，只有获取了这些信息我们才知道消息要发送到具体的 Broker 节点。

tryToFindTopicPublishInfo 是查找主题的路由信息的方法。

如果生产者中缓存了 topic 的路由信息，或路由信息中包含了消息队列，则直接返回该路由信息。

如果没有缓存或没有包含消息队列， 则向 NameServer 查询该 topic 的路由信息。

如果最终未找到路由信息，则抛出异常：无法找到主题相关路由信息异常。

`TopicPublishinfo` 的属性：

- `orderTopic`：是否为顺序消息。
- `haveTopicRouterInfo`：是否有主题路由信息。
- `List<MessageQueue> messageQueueList`：Topic 的消息队列。
- `sendWhichQueue`：用于选择消息队列。每选择一次消息队列， 该值会自增 1。
- `topicRouteData`：主题路由数据。

`MQClientlnstance#updateTopicRouteInfoFromNameServer` 这个方法的功能是生产者更新和维护路由缓存。

1. 如果 `isDefault` 为 true，则使用默认主题去查询，如果查询到路由信息，则替换路由信息中读写队列个数为生产者默认的队列个数（`defaultTopicQueueNums`）；如果 `isDefault` 为 false，则使用参数 topic 去查询；如果未查询到路由信息，则返回 false ，表示路由信息未变化。
2. 如果路由信息找到，与本地缓存中的路由信息进行对比，判断路由信息是否发生了改变，如果未发生变化，则直接返回 false 。
3. 更新 `MQClientInstance` 的 Broker 地址缓存表。
4. 根据 `topicRouteData` 中的 `List<QueueData>` 转换成 `topicPublishInfo` 的 `List<MessageQueue>` 列表。其具体实现在 `topicRouteData2TopicPublishInfo` 中， 然后会更新该 `MQClientInstance` 所管辖的所有消息，发送关于 topic 的路由信息。
5. 循环遍历路由信息的 QueueData 信息，如果队列没有写权限，则继续遍历下一个 QueueData；根据 brokerName 找到 brokerData 信息，找不到或没有找到 Master 节点，则遍历下一个 QueueData；根据写队列个数，根据 topic ＋序号 创建 `MessageQueue` ，填充 `TopicPublishInfo` 的 `List<QueueMessage>`。

#### 选择 Broker

#### 消息发送

## RocketMQ 消息存储

## RocketMQ 消息消费

## 消息过滤 FilterServer

## RocketMQ 主从同步

## RocketMQ 事务消息

## RocketMQ 实战

## 参考资料

- [RocketMQ 技术内幕](https://book.douban.com/subject/35626441/)