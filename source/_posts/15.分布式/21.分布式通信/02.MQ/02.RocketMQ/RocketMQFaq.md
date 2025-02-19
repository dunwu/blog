---
title: RocketMQ FAQ
date: 2022-07-12 07:49:48
order: 99
categories:
  - 分布式
  - 分布式通信
  - MQ
  - RocketMQ
tags:
  - Java
  - 中间件
  - MQ
  - RocketMQ
permalink: /pages/5a9aee9a/
---

# RocketMQ FAQ

## API 问题

### connect to `<172.17.0.1:10909>` failed

启动后，Producer 客户端连接 RocketMQ 时报错：

```java
org.apache.rocketmq.remoting.exception.RemotingConnectException: connect to <172.17.0.1:10909> failed
    at org.apache.rocketmq.remoting.netty.NettyRemotingClient.invokeSync(NettyRemotingClient.java:357)
    at org.apache.rocketmq.client.impl.MQClientAPIImpl.sendMessageSync(MQClientAPIImpl.java:343)
    at org.apache.rocketmq.client.impl.MQClientAPIImpl.sendMessage(MQClientAPIImpl.java:327)
    at org.apache.rocketmq.client.impl.MQClientAPIImpl.sendMessage(MQClientAPIImpl.java:290)
    at org.apache.rocketmq.client.impl.producer.DefaultMQProducerImpl.sendKernelImpl(DefaultMQProducerImpl.java:688)
    at org.apache.rocketmq.client.impl.producer.DefaultMQProducerImpl.sendSelectImpl(DefaultMQProducerImpl.java:901)
    at org.apache.rocketmq.client.impl.producer.DefaultMQProducerImpl.send(DefaultMQProducerImpl.java:878)
    at org.apache.rocketmq.client.impl.producer.DefaultMQProducerImpl.send(DefaultMQProducerImpl.java:873)
    at org.apache.rocketmq.client.producer.DefaultMQProducer.send(DefaultMQProducer.java:369)
    at com.emrubik.uc.mdm.sync.utils.MdmInit.sendMessage(MdmInit.java:62)
    at com.emrubik.uc.mdm.sync.utils.MdmInit.main(MdmInit.java:2149)
```

原因：RocketMQ 部署在虚拟机上，内网 ip 为 10.10.30.63，该虚拟机一个 docker0 网卡，ip 为 172.17.0.1。RocketMQ broker 启动时默认使用了 docker0 网卡，Producer 客户端无法连接 172.17.0.1，造成以上问题。

解决方案

（1）干掉 docker0 网卡或修改网卡名称

（2）停掉 broker，修改 broker 配置文件，重启 broker。

修改 conf/broker.conf，增加两行来指定启动 broker 的 IP：

```
namesrvAddr = 10.10.30.63:9876
brokerIP1 = 10.10.30.63
```

启动时需要指定配置文件

```bash
nohup sh bin/mqbroker -n localhost:9876 -c conf/broker.conf &
```