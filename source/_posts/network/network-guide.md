---
title: 计算机网络指南
categories: ['网络']
tags: ['网络', '通信']
date: 2019-02-20 22:26
---

# 计算机网络指南

> 📦 本文已归档到：「[blog](https://github.com/dunwu/blog)」
>
> 计算机网络是指将地理位置不同的具有独立功能的多台计算机及其外部设备，通过通信线路连接起来，在网络操作系统，网络管理软件及网络通信协议的管理和协调下，实现资源共享和信息传递的计算机系统。

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/network/network.jpg"/></div>

<!-- TOC depthFrom:2 depthTo:3 -->

- [💡 指南](#💡-指南)
  - [核心概念](#核心概念)
  - [拓扑结构](#拓扑结构)
  - [作用范围](#作用范围)
  - [性能指标](#性能指标)
- [网络分层](#网络分层)
  - [物理层](#物理层)
  - [数据链路层](#数据链路层)
  - [网络层](#网络层)
  - [传输层](#传输层)
  - [\~~会话层\~~](#\会话层\)
  - [\~~表示层\~~](#\表示层\)
  - [应用层](#应用层)
- [资源](#资源)
- [:door: 传送门](#door-传送门)

<!-- /TOC -->

## 💡 指南

学习之前，先看一下入门三问：

> **一、什么是计算机网络？**
>
> 计算机网络是指将地理位置不同的具有独立功能的多台计算机及其外部设备，通过通信线路连接起来，在网络操作系统，网络管理软件及网络通信协议的管理和协调下，实现资源共享和信息传递的计算机系统。
>
> ——摘自百度百科

> **二、为什么学习计算机网络？**
>
> 计算机网络是计算机科学的基础课程，也是计算机专业考研必考科目，可见其重要性。作为一名程序员，了解计算机网络，对于 Web 领域，通信领域的开发有莫大的帮助。
>
> 在浏览器中访问网页的原理是什么？Wifi 是如何工作的？防火墙是如何保障网络安全的？什么是安全证书？Cookie 和 Session 是什么东西？。。。
>
> 如果你接触过这些技术，如果你想了解这些技术的原理，那么你就有必要学习一下计算机网络了。

> **三、如何学习计算机网络？**
>
> 本人有 2 年通信领域开发经验，从事通信设备上的协议开发。就我个人的学习经验来看，学习计算机网络可以分为以下阶段：
>
> - **基础阶段——一般性的了解网络协议分层及各层功能**
>   - 了解计算机网络协议分层（OSI）有哪些层，分层的依据是什么（即每层的功能是什么）
>   - 了解每层的主要通信设备有哪些；
>   - 了解每层有哪些重要网络协议，这些协议有什么作用，基本原理是什么？
>   - 了解每层的传输数据形式（如：报文、帧等）
> - **进阶阶段——系统学习计算机网络知识，将各层主要协议功能串联起来**
>   - 学习 TCP/IP 详解 卷 1、卷 2、卷 3（内容详实，但文字较为晦涩，不适合初学者）
> - **专业阶段——根据业务领域，有针对性的学习**
>   - 网络协议很多，而且专业性非常强。精通所有协议，几乎是不可能的，所以有必要根据自己的业务领域，有针对性的深入学习协议。如果你是做 web 开发，那么你很有必要认真学习一下 HTTP、DNS 协议；如果你是做路由器、交换机领域通信开发，那么你应该更深入学习一下 IP/TCP/UDP 协议。。。
>   - 如何深入学习协议，最好的学习方式，就是深入学习 RFC，并结合实际的协议报文去了解。

### 核心概念

- **计算机网络** - 计算机网络（computer network），通常也简称网络，是利用通信设备和线路将地理位置不同的、功能独立的多个[计算机](https://zh.wikipedia.org/wiki/%E9%9B%BB%E5%AD%90%E8%A8%88%E7%AE%97%E6%A9%9F)系统连接起来，以功能完善的网络[软件](https://zh.wikipedia.org/wiki/%E8%BD%AF%E4%BB%B6)实现网络的[硬件](https://zh.wikipedia.org/wiki/%E7%A1%AC%E4%BB%B6)、[软件](https://zh.wikipedia.org/wiki/%E8%BB%9F%E4%BB%B6)及资源[共享](https://zh.wikipedia.org/wiki/%E5%85%B1%E4%BA%AB)和[信息](https://zh.wikipedia.org/wiki/%E4%BF%A1%E6%81%AF)传递的系统。简单的说即连接两台或多台计算机进行[通信](https://zh.wikipedia.org/wiki/%E9%80%9A%E4%BF%A1)的系统。
- **互联网** - 互联网（Internet），即网络的网络。

### 拓扑结构

计算机网络的拓扑结构可分为：

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/network/overview/network-topological-structure.gif!zp"/></div>

- 网型拓扑网型网（Mesh network）
- 环型拓扑环型网（Ring network）
- 星型拓扑星型网（Star network）
- 树状拓扑树型网（Tree network）
- 总线拓扑总线网（Bus network）

### 作用范围

- 广域网 WAN（Wide Area Network）
- 城域网 MAN（Metropolitan Area Network）
- 局域网 LAN（Local Area Network）
- 个人区域网 PAN（Personal Area Network）

### 性能指标

- **速率** - 速率的单位是 bit/s（比特每秒）。
- **带宽（bandwidth）** - 带宽有以下两种不同的意义。
  - 信号的带宽是指该信号所包含的各种不同频率成分所占据的频率范围。这种意义的带宽的单位是赫 （或千赫，兆赫，吉赫等）。
  - 网络的带宽表示在单位时间内从网络中的某一点到另一点所能通过的**最高数据率**。这种意义的带宽的单位是 bit/s（比特每秒）。
- **吞吐量（throughput）** - 吞吐量表示在单位时间内通过某个网络（或信道、接口）的数据量。例如，对于一个 100 Mbit/s 的以太网，其额定速率是 100 Mbit/s。
- **时延（delay）**
  - 总时延 = 排队时延 + 处理时延 + 传输时延 + 传播时延

## 网络分层

> 计算机网络如何分层？各层的作用是什么？各层的主要协议、设备分别是什么？
>
> 这是学习计算机网络知识宏观层面必须要了解的核心点。知道了这些，对于网络的体系结构就基本上了解了。

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/network/overview/network-layers.png"/></div>

计算机网络分层一般有三种划分体系：OSI 分层；五层协议分层；TCP/IP 协议分层。

- OSI 的七层体系结构概念清楚，理论完整，但是比较复杂且不实用，所以并不流行。
- 五层协议分层是一种折中方案，在现实中更为流行。

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/network/overview/网络分层架构图.png"/></div>

### 物理层

> 物理层（Physical Layer）只接收和发送一串比特(bit)流，不考虑信息的意义和信息结构。
>
> 扩展阅读：[计算机网络之物理层](network-physical.md)

- 关键词：调制、解调、数字信号、模拟信号、通信媒介、信道复用
- 数据单元：比特流。
- 典型设备：光纤、同轴电缆、双绞线、中继器和集线器。

### 数据链路层

> 网络层针对的还是主机之间的数据传输服务，而主机之间可以有很多链路，数据链路层（Data Link Layer）就是为同一链路的主机提供数据传输服务。数据链路层把网络层传下来的分组封装成帧。
>
> 扩展阅读：[计算机网络之数据链路层](network-data-link.md)

- 关键词：点对点信道、广播信道、`PPP`、`CSMA/CD`、局域网、以太网、`MAC`、适配器、集线器、网桥、交换机
- 主要协议：`PPP`、`CSMA/CD` 等。
- 数据单元：帧（frame）。
- 典型设备：二层交换机、网桥、网卡。

### 网络层

> 网络层（network layer）为分组交换网上的不同主机提供通信服务。在发送数据时，网络层把运输层产生的报文段或用户数据报封装成分组或包进行传送。
>
> 扩展阅读：[计算机网络之网络层](network-network.md)

- 关键词：`IP`、`ICMP`、`ARP`、路由
- 主要协议：`IP`。
- 数据单元：IP 数据报（packet）。
- 典型设备：网关、路由器。

### 传输层

> 传输层（transport layer）为两台主机中进程间的通信提供通用的数据传输服务。
>
> 扩展阅读：[计算机网络之网络层](network-network.md)

- 关键词：`UDP`、`TCP`、滑动窗口、拥塞控制、三次握手
- 主要协议：`TCP`、`UDP`。
- 数据单元：报文段（segment）或用户数据报。

### \~~会话层\~~

> \~~会话层（Session Layer）不参与具体的传输，它提供包括访问验证和会话管理在内的建立和维护应用之间通信的机制。\~~

### \~~表示层\~~

> \~~表示层（Presentation Layer）是为在应用过程之间传送的信息提供表示方法的服务，它关心的只是发出信息的语法与语义。表示层要完成某些特定的功能，主要有不同数据编码格式的转换，提供数据压缩、解压缩服务，对数据进行加密、解密。\~~

### 应用层

> 应用层（application layer）通过应用进程间的交互来完成特定网络应用。应用层协议定义的是应用进程间通信和交互的规则。
>
> 扩展阅读：[计算机网络之应用层](network-application.md)

- 关键词：`HTTP`、`DNS`、`FTP`、`TELNET`、`DHCP`
- 主要协议：`HTTP`、`DNS`、`SMTP`、`Telnet`、`FTP`、`SNMP` 等。
- 数据单元：报文（message）。

## 资源

- 书
  - [HTTP 权威指南](https://book.douban.com/subject/10746113/)
  - [TCP/IP 详解 卷 1：协议](https://book.douban.com/subject/1088054/)
  - [TCP/IP 详解 卷 2：实现](https://book.douban.com/subject/1087767/)
  - [TCP/IP 详解 卷 3：TCP 事务协议、HTTP、NNTP 和 UNIX 域协议](https://book.douban.com/subject/1058634/)
  - [Web 性能权威指南](https://book.douban.com/subject/25856314/)
  - [图解 HTTP](https://book.douban.com/subject/25863515/)
  - [图解 TCP/IP](https://book.douban.com/subject/24737674/)
  - [计算机网络（第 7 版）](https://book.douban.com/subject/26960678/) - 谢希仁
- 站点
  - https://www.rfc-editor.org/ - 在线查阅、下载 RFC 文档
- 工具
  - [WireShark](https://www.wireshark.org/)
  - [Postman](https://www.getpostman.com/)

## :door: 传送门

| [回首頁](https://github.com/dunwu/blog) |
