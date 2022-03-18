# 计算机网络

> 理解计算机网络，首先需要从宏观层面了解计算机网络通信的分层结构。最有代表性的是 OSI 七层结构模型，但现实中更流行的是五层结构模型（本人也比较倾向于这种模型）。
>
> 了解网络分层结构，需要了解每个网络层级在网络通信中的定位，以及这个层级主要的通信设备、通信协议。

## 📖 内容

- [计算机网络指南](network-guide.md) - 关键词：核心概念、拓扑结构、作用范围、性能指标、体系结构

### 网络分层

- [物理层](network-physical.md) - 关键词：调制、解调、数字信号、模拟信号、通信媒介、信道复用
- [链路层](network-data-link.md) - 关键词：点对点信道、广播信道、`PPP`、`CSMA/CD`、局域网、以太网、`MAC`、适配器、集线器、网桥、交换机
- [网络层](network-network.md) - 关键词：`IP`、`ICMP`、`ARP`、路由
- [传输层](network-transport.md) - 关键词：`UDP`、`TCP`、滑动窗口、拥塞控制、三次握手
- [应用层](network-application.md) - 关键词：`HTTP`、`DNS`、`FTP`、`TELNET`、`DHCP`

### 网络技术

> 对计算机网络分层有了基本的认知后，可以根据个人的工作、学习需要，针对性的会接触到的协议或技术加深理解。

- [HTTP](http.md)
- [DNS](dns.md)
- [TCP](tcp.md)
- [UDP](udp.md)
- [ICMP](icmp.md)
- [WebSocket](websocket.md)
- [CDN](cdn.md)
- [VPN](vpn.md)

## 📖 资料

- **书籍**
  - [TCP/IP 详解 卷 1：协议](https://book.douban.com/subject/1088054/) - TCP/IP 红宝书，经典中的经典
  - [TCP/IP 详解 卷 2：实现](https://book.douban.com/subject/1087767/) - TCP/IP 红宝书，经典中的经典
  - [TCP/IP 详解 卷 3：TCP 事务协议、HTTP、NNTP 和 UNIX 域协议](https://book.douban.com/subject/1058634/) - TCP/IP 红宝书，经典中的经典
  - [Web 性能权威指南](https://book.douban.com/subject/25856314/)
  - [HTTP 权威指南](https://book.douban.com/subject/10746113/)
  - [图解 HTTP](https://book.douban.com/subject/25863515/)
  - [图解 TCP/IP](https://book.douban.com/subject/24737674/)
  - [计算机网络（第 7 版）](https://book.douban.com/subject/26960678/) - 国内大学计算机专业经典教材
- **教程**
  - [Computer Network Tutorials](https://www.geeksforgeeks.org/computer-network-tutorials/)
- **RFC**
  - https://www.rfc-editor.org/ - 在线查阅、下载 RFC 文档
  - **DNS**
    - [RFC 1034 DOMAIN NAMES - CONCEPTS AND FACILITIES](https://tools.ietf.org/html/rfc1034) - DNS 最核心 RFC
    - [RFC 1035 DOMAIN NAMES - IMPLEMENTATION AND SPECIFICATION](https://tools.ietf.org/html/rfc1035) - DNS 最核心 RFC
- **工具**
  - [WireShark](https://www.wireshark.org/)
  - [Postman](https://www.getpostman.com/)

## 🚪 传送

◾ 🎯 [我的博客](https://github.com/dunwu/blog) ◾
