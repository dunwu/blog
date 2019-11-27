<div align="center"><a href="https://dunwu.github.io/blog/"><img src="http://dunwu.test.upcdn.net/cs/others/zpblog.png"/></a></div>
<div align="center"><h1>Blog</h1></div>

## 计算机科学

- **数据库**
  - [数据库教程 📚](https://dunwu.github.io/db-tutorial/)
- **操作系统**
  - [Linux 教程 📚](https://dunwu.github.io/linux-tutorial/)
  - [Windows 常用技巧总结](source/_posts/os/windows.md)
  - [Mac 常用技巧总结](source/_posts/os/mac.md)
- **网络通信**
  - **面试**
    - [网络通信面经](source/_posts/communication/network-interview.md)
  - **网络分层**
    - [计算机网络指南](source/_posts/communication/network-guide.md) - 关键词：核心概念、拓扑结构、作用范围、性能指标、体系结构
    - [计算机网络之物理层](source/_posts/communication/network-physical.md) - 关键词：调制、解调、数字信号、模拟信号、通信媒介、信道复用
    - [计算机网络之链路层](source/_posts/communication/network-data-link.md) - 关键词：点对点信道、广播信道、`PPP`、`CSMA/CD`、局域网、以太网、`MAC`、适配器、集线器、网桥、交换机
    - [计算机网络之网络层](source/_posts/communication/network-network.md) - 关键词：`IP`、`ICMP`、`ARP`、路由
    - [计算机网络之传输层](source/_posts/communication/network-transport.md) - 关键词：`UDP`、`TCP`、滑动窗口、拥塞控制、三次握手
    - [计算机网络之应用层](source/_posts/communication/network-application.md) - 关键词：`HTTP`、`DNS`、`FTP`、`TELNET`、`DHCP`
  - **重要技术**
    - [网络协议之 HTTP](source/_posts/communication/http.md)
    - [网络协议之 DNS](source/_posts/communication/dns.md)
    - [网络协议之 TCP](source/_posts/communication/tcp.md)
    - [网络协议之 UDP](source/_posts/communication/udp.md)
    - [网络协议之 ICMP](source/_posts/communication/icmp.md)
    - [网络协议之 WebSocket](source/_posts/communication/websocket.md)
    - [网络通信之 CDN](source/_posts/communication/cdn.md)
- **大数据**
  - [HDFS](source/_posts/bigdata/HDFS.md)
  - [YARN](source/_posts/bigdata/YARN.md)
  - [MapReduce](source/_posts/bigdata/MapReduce.md)
  - [HBase](source/_posts/bigdata/hbase) - 建立在 HDFS 基础上的面向列的分布式数据库。

## 设计

### 架构

> 软件整体结构与组件的抽象描述，用于指导大型软件系统各个方面的设计。重点是分而治之，先将大型系统抽象为各个组件或模块；然后逐一解决各组件、各模块的功能、性能问题；最后将这些组件、模块整合成对外服务的一个整体。

- [分布式技术面试题](source/_posts/design/architecture/分布式技术面试题.md)
- [分布式技术实现](source/_posts/design/architecture/分布式技术实现.md)
- [分布式架构](source/_posts/design/architecture/分布式架构.md)
- [大型分布式网站架构](source/_posts/design/architecture/大型分布式网站架构.md)
- [大型网站架构概述](source/_posts/design/architecture/大型网站架构概述.md)
- [网站典型故障](source/_posts/design/architecture/网站典型故障.md)
- [网站的伸缩性架构](source/_posts/design/architecture/网站的伸缩性架构.md)
- [网站的可扩展架构](source/_posts/design/architecture/网站的可扩展架构.md)
- [网站的安全架构](source/_posts/design/architecture/网站的安全架构.md)
- [网站的高可用架构](source/_posts/design/architecture/网站的高可用架构.md)
- [网站的高性能架构](source/_posts/design/architecture/网站的高性能架构.md)

### 系统原理

- [系统原理面试题](source/_posts/design/theory/system-theory-interview.md)
- [分布式基本原理](source/_posts/design/theory/distributed-base-theory.md)
- [负载均衡基本原理](source/_posts/design/theory/load-balance-theory.md)
- [缓存基本原理](source/_posts/design/theory/cache-theory.md)
- [消息队列基本原理](source/_posts/design/theory/mq-theory.md)
- [分布式锁基本原理](source/_posts/design/theory/distributed-lock-theory.md)
- [分布式会话基本原理](source/_posts/design/theory/distributed-session-theory.md)
- [分布式存储基本原理](source/_posts/design/theory/distributed-storage-theory.md)
- [分布式 ID 基本原理](source/_posts/design/theory/distributed-id-theory.md)
- [分布式事务基本原理](source/_posts/design/theory/distributed-transaction-theory.md)
- [分库分表基本原理](source/_posts/design/theory/sharding-theory.md)
- [常见安全手段基本原理](source/_posts/design/theory/security-theory.md)

### 重构

> **改善既有代码的设计**
>
> 关键词：过长函数、过大的类、基本类型偏执、过长参数列、数据泥团、switch 声明、临时字段、被拒绝的馈赠、异曲同工的类、发散式变化、霰弹式修改、平行继承体系、过多的注释、重复代码、冗余类、纯稚的数据类、夸夸其谈未来性、依恋情结、狎昵关系、过度耦合的消息链、中间人、不完美的库类

- [代码的坏味道和重构](source/_posts/design/refactor/代码的坏味道和重构.md)
- [代码坏味道之代码臃肿](source/_posts/design/refactor/代码坏味道之代码臃肿.md)
- [代码坏味道之滥用面向对象](source/_posts/design/refactor/代码坏味道之滥用面向对象.md)
- [代码坏味道之变革的障碍](source/_posts/design/refactor/代码坏味道之变革的障碍.md)
- [代码坏味道之非必要的](source/_posts/design/refactor/代码坏味道之非必要的.md)
- [代码坏味道之耦合](source/_posts/design/refactor/代码坏味道之耦合.md)

## 开发

- **编程**
  - [如何学习一门编程语言](source/_posts/coding/programming-guide.md)
  - [一篇文章让你彻底掌握 Python](source/_posts/coding/python.md)
  - [一篇文章让你彻底掌握 Shell](source/_posts/coding/shell.md)
  - [Java 教程](https://turnon.gitee.io/java-tutorial/) 📚 - 本人作为一名 Java 程序员，十年的技术积累，汇总与此。
    - [JavaCore 教程](https://dunwu.github.io/javacore/) 📚 - 内容包含：Java 基础特性、Java 高级特性、Java 并发、JVM、Java IO 等。
    - [JavaWeb 教程](https://dunwu.github.io/javaweb/) 📚 - 内容包含：JavaEE、分布式应用技术及原理等。
    - [Spring 教程](https://dunwu.github.io/spring-tutorial/) 📚 - Spring 各种实战。
    - [Spring Boot 教程](https://dunwu.github.io/spring-boot-tutorial/) 📚 - Spring Boot 各种实战。
  - [前端编程教程](https://dunwu.github.io/frontend-tutorial/) 📚 - 不会前端的后端不是好后端，这里是二手前端技术的总结。

## 工具

- [Git 从入门到精通](source/_posts/tools/git.md) - Git 的特性、原理、配置、命令、最佳实践、常见问题。学习 Git，基本上这篇文章就够了。
- [UML 教程](source/_posts/tools/uml.md) - 全面介绍 UML 各种图：类图、对象图、包图、组件图、部署图、复合结构图、活动图、状态图、用例图、通信图、交互概述图、时序图、时间图
- [正则教程](source/_posts/tools/regex.md) - 正则语义很晦涩，但是一旦掌握，编程绝对是一件神兵利器。
- [使用 Gitbook 打造你的电子书](https://dunwu.gitbooks.io/gitbook-notes/)

## 效率提升

> 方法论，是人们认识世界、改造世界的方法的理论。同样，项目管理、编程、写文档都应该有一定的方式方法，帮助我们合理、高效、快速的达成目标。

- [软件工程与项目管理](source/_posts/efficiency/software-engineering.md)
- [合理规划项目](source/_posts/efficiency/style/project-style.md)
- [合理对文档进行归类](source/_posts/efficiency/style/dir-style.md)
- [合理编排技术文档](source/_posts/efficiency/style/doc-style.md)

## License

本博客所有文章除特别声明外，均采用 [![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/80x15.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。
