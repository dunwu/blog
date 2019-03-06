---
title: 计算机网络指南
date: 2019-03-06
---

# 计算机网络指南

<!-- TOC depthFrom:2 depthTo:3 -->

- [核心概念](#核心概念)
- [拓扑结构](#拓扑结构)
- [作用范围](#作用范围)
- [性能指标](#性能指标)
- [体系结构](#体系结构)

<!-- /TOC -->

## 核心概念

- **计算机网络** - 计算机网络（computer network），通常也简称网络，是利用通信设备和线路将地理位置不同的、功能独立的多个[计算机](https://zh.wikipedia.org/wiki/%E9%9B%BB%E5%AD%90%E8%A8%88%E7%AE%97%E6%A9%9F)系统连接起来，以功能完善的网络[软件](https://zh.wikipedia.org/wiki/%E8%BD%AF%E4%BB%B6)实现网络的[硬件](https://zh.wikipedia.org/wiki/%E7%A1%AC%E4%BB%B6)、[软件](https://zh.wikipedia.org/wiki/%E8%BB%9F%E4%BB%B6)及资源[共享](https://zh.wikipedia.org/wiki/%E5%85%B1%E4%BA%AB)和[信息](https://zh.wikipedia.org/wiki/%E4%BF%A1%E6%81%AF)传递的系统。简单的说即连接两台或多台计算机进行[通信](https://zh.wikipedia.org/wiki/%E9%80%9A%E4%BF%A1)的系统。
- **互联网** - 互联网（Internet），即网络的网络。

## 拓扑结构

计算机网络的拓扑结构可分为：

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/network/overview/network-topological-structure.gif"/></div><br>

- 网型拓扑网型网（Mesh network）
- 环型拓扑环型网（Ring network）
- 星型拓扑星型网（Star network）
- 树状拓扑树型网（Tree network）
- 总线拓扑总线网（Bus network）

## 作用范围

- 广域网 WAN（Wide Area Network）
- 城域网 MAN（Metropolitan Area Network）
- 局域网 LAN（Local Area Network）
- 个人区域网 PAN（Personal Area Network）

## 性能指标

- **速率** - 速率的单位是 bit/s（比特每秒）。
- **带宽（bandwidth）** - 带宽有以下两种不同的意义。
  - 信号的带宽是指该信号所包含的各种不同频率成分所占据的频率范围。这种意义的带宽的单位是赫 （或千赫，兆赫，吉赫等）。
  - 网络的带宽表示在单位时间内从网络中的某一点到另一点所能通过的**最高数据率**。这种意义的带宽的单位是 bit/s（比特每秒）。
- **吞吐量（throughput）** - 吞吐量表示在单位时间内通过某个网络（或信道、接口）的数据量。例如，对于一个 100 Mbit/s 的以太网，其额定速率是 100 Mbit/s。
- **时延（delay）**
  - 总时延 = 排队时延 + 处理时延 + 传输时延 + 传播时延

## 体系结构

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/network/overview/network-layers.png"/></div><br>

- **物理层（Physical Layer）** - 物理层只接收和发送一串比特(bit)流，不考虑信息的意义和信息结构。
  - 数据单元：比特流。
  - 典型设备：光纤、同轴电缆、双绞线、中继器和集线器。
- **数据链路层（Data Link Layer）** - 网络层针对的还是主机之间的数据传输服务，而主机之间可以有很多链路，链路层协议就是为同一链路的主机提供数据传输服务。数据链路层把网络层传下来的分组封装成帧。
  - 主要协议：`PPP`、`CSMA/CD` 等。
  - 数据单元：帧（frame）。
  - 典型设备：二层交换机、网桥、网卡。
- **网络层（network layer）** - 为分组交换网上的不同主机提供通信服务。在发送数据时，网络层把运输层产生的报文段或用户数据报封装成分组或包进行传送。
  - 主要协议：`IP`。
  - 数据单元：IP 数据报（packet）。
  - 典型设备：网关、路由器。
- **传输层（transport layer）** - 为两台主机中进程间的通信提供通用的数据传输服务。
  - 主要协议：`TCP`、`UDP`。
  - 数据单元：报文段（segment）或用户数据报。
- **会话层（Session Layer）** - 会话层不参与具体的传输，它提供包括访问验证和会话管理在内的建立和维护应用之间通信的机制。
- **表示层（Presentation Layer）** - 表示层是为在应用过程之间传送的信息提供表示方法的服务，它关心的只是发出信息的语法与语义。表示层要完成某些特定的功能，主要有不同数据编码格式的转换，提供数据压缩、解压缩服务，对数据进行加密、解密。
- **应用层（application layer）** - 通过应用进程间的交互来完成特定网络应用。应用层协议定义的是应用进程间通信和交互的规则。
  - 主要协议：`HTTP`、`DNS`、`SMTP`、`Telnet`、`FTP`、`SNMP` 等。
  - 数据单元：报文（message）。
