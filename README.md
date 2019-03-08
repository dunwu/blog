<div align="center"><a href="https://dunwu.github.io/blog/"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/others/zpblog.png"/></a></div>

> 本项目用于归档我个人的技术文档。

|      :keyboard:       |            :game_die:             |     :package:     |       :spider_web:        |      :computer:       | :globe_with_meridians: |     :art:     |      :cloud:      |    :bulb:     | :building_construction: |
| :-------------------: | :-------------------------------: | :---------------: | :-----------------------: | :-------------------: | :--------------------: | :-----------: | :---------------: | :-----------: | :---------------------: |
| [编程语言](#编程语言) | [算法和数据结构](#算法和数据结构) | [数据库](#数据库) | [网络通信](#网络通信) | [操作系统](#操作系统) |      [Web](#web)       | [前端](#前端) | [大数据](#大数据) | [设计](#设计) |  [软件工程](#软件工程)  |

## [编程语言](source/_posts/programming)

- [Java](source/_posts/programming/java) - Java 语法、JVM、并发编程、JavaEE、Spring、Spring Boot、Mybatis
- [Python](source/_posts/programming/python.md)
- [一篇文章让你彻底掌握 shell 语言](source/_posts/programming/shell.md)

## [算法和数据结构](source/_posts/algorithm)

- [数据结构](source/_posts/algorithm/data-structure) - 关键词：数组、线性表、栈、队列、哈希、树、图、查找、排序
- 算法（:construction: 待整理补充）

## [数据库](source/_posts/database)

- [关系型数据库](source/_posts/database/sql)
  - [关系型数据库 SQL 基本语法](source/_posts/database/sql/sql.md)
  - [关系型数据库基本原理](source/_posts/database/sql/关系型数据库基本原理.md)
  - [关系型数据库面试题](source/_posts/database/sql/关系型数据库面试题.md)
  - [Mysql](source/_posts/database/sql/mysql)
  - [PostgreSQL](source/_posts/database/sql/postgresql.md)
  - [H2](source/_posts/database/sql/h2.md)
- [非关系型数据库](source/_posts/database/nosql)
  - [Redis](source/_posts/database/nosql/redis)
  - [MongoDB](source/_posts/database/nosql/mongodb)
  - [Cassandra](source/_posts/database/nosql/Cassandra.md)

## [网络通信](source/_posts/communication)

> 网络通信的学习要点就是：记住网络分层结构，各层级上有哪些主要的网络协议和网络设备，它们的基本工作原理是什么。
>
> 如果你是互联网从业者，那么有必要更深入理解一下 HTTP、DNS、Socket。

- [计算机网络指南](https://github.com/dunwu/blog/blob/master/source/_posts/communication/network-guide.md) - 关键词：核心概念、拓扑结构、作用范围、性能指标、体系结构
- [计算机网络之物理层](https://github.com/dunwu/blog/blob/master/source/_posts/communication/network-physical.md) - 关键词：调制、解调、数字信号、模拟信号、通信媒介、信道复用
- [计算机网络之数据链路层](https://github.com/dunwu/blog/blob/master/source/_posts/communication/network-data-link.md) - 关键词：点对点信道、广播信道、`PPP`、`CSMA/CD`、局域网、以太网、`MAC`、适配器、集线器、网桥、交换机
- [计算机网络之网络层](https://github.com/dunwu/blog/blob/master/source/_posts/communication/network-network.md) - 关键词：`IP`、`ICMP`、`ARP`、路由
- [计算机网络之传输层](https://github.com/dunwu/blog/blob/master/source/_posts/communication/network-transport.md) - 关键词：`UDP`、`TCP`、滑动窗口、拥塞控制、三次握手
- [计算机网络之应用层](https://github.com/dunwu/blog/blob/master/source/_posts/communication/network-application.md) - 关键词：`HTTP`、`DNS`、`FTP`、`TELNET`、`DHCP`
- [网络协议之 HTTP](https://github.com/dunwu/blog/blob/master/source/_posts/communication/http.md) - 关键词：`HTTP`、`DNS`、`FTP`、`TELNET`、`DHCP`
- [网络协议之 DNS](https://github.com/dunwu/blog/blob/master/source/_posts/communication/dns.md) - 关键词：`HTTP`、`DNS`、`FTP`、`TELNET`、`DHCP`
- [网络协议之 ICMP](https://github.com/dunwu/blog/blob/master/source/_posts/communication/icmp.md) - 关键词：`HTTP`、`DNS`、`FTP`、`TELNET`、`DHCP`

## [操作系统](source/_posts/os)

- [Linux](source/_posts/os/linux) - 文件目录管理、文件内容查看、文件压缩和解压、用户管理、系统管理、网络管理、硬件管理、软件管理
- [Windows](source/_posts/os/windows)
- [Docker](source/_posts/os/docker)

## [Web](source/_posts/web)

- [Nginx](source/_posts/web/nginx) - 关键词：反向代理、负载均衡、缓存、跨域

## [前端](source/_posts/frontend)

- [前端基础](source/_posts/frontend/base) - `html` , `css` , `js`
- [nodejs, npm, yarn](source/_posts/frontend/nodejs) - `nodejs`, `npm`, `yarn`
- [es6, typescript, babel](source/_posts/frontend/es6) - `es6`, `typescript`, `babel`
- [webpack](source/_posts/frontend/webpack)
- [mvc](source/_posts/frontend/mvc) - `react`, `vue`, `angular`
- [qa](source/_posts/frontend/qa) - `eslint`
- [tool](source/_posts/frontend/tool) - `gitbook`

## [大数据](source/_posts/bigdata)

- [HDFS](source/_posts/bigdata/HDFS.md)
- [YARN](source/_posts/bigdata/YARN.md)
- [MapReduce](source/_posts/bigdata/MapReduce.md)
- [HBase](source/_posts/bigdata/hbase) - 建立在 HDFS 基础上的面向列的分布式数据库。

## [设计](source/_posts/design)

### [架构](source/_posts/design/architecture)

> 软件整体结构与组件的抽象描述，用于指导大型软件系统各个方面的设计。重点是分而治之，先将大型系统抽象为各个组件或模块；然后逐一解决各组件、各模块的功能、性能问题；最后将这些组件、模块整合成对外服务的一个整体。

- [分布式原理](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/分布式原理.md)
- [分布式技术实现](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/分布式技术实现.md)
- [分布式技术面试题](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/分布式技术面试题.md)
- [分布式架构](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/分布式架构.md)
- [大型分布式网站架构](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/大型分布式网站架构.md)
- [大型系统设计](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/大型系统设计.md)
- [大型网站架构概述](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/大型网站架构概述.md)
- [网站典型故障](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/网站典型故障.md)
- [网站的伸缩性架构](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/网站的伸缩性架构.md)
- [网站的可扩展架构](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/网站的可扩展架构.md)
- [网站的安全架构](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/网站的安全架构.md)
- [网站的高可用架构](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/网站的高可用架构.md)
- [网站的高性能架构](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/网站的高性能架构.md)
- [负载均衡](https://github.com/dunwu/blog/blob/master/source/_posts/design/architecture/负载均衡.md)

### [重构](source/_posts/design/refactor)

> **改善既有代码的设计**
>
> 关键词：过长函数、过大的类、基本类型偏执、过长参数列、数据泥团、switch 声明、临时字段、被拒绝的馈赠、异曲同工的类、发散式变化、霰弹式修改、平行继承体系、过多的注释、重复代码、冗余类、纯稚的数据类、夸夸其谈未来性、依恋情结、狎昵关系、过度耦合的消息链、中间人、不完美的库类

- [代码的坏味道和重构](https://github.com/dunwu/blog/blob/master/source/_posts/design/refactor/代码的坏味道和重构.md)
- [代码坏味道之代码臃肿](https://github.com/dunwu/blog/blob/master/source/_posts/design/refactor/代码坏味道之代码臃肿.md)
- [代码坏味道之滥用面向对象](https://github.com/dunwu/blog/blob/master/source/_posts/design/refactor/代码坏味道之滥用面向对象.md)
- [代码坏味道之变革的障碍](https://github.com/dunwu/blog/blob/master/source/_posts/design/refactor/代码坏味道之变革的障碍.md)
- [代码坏味道之非必要的](https://github.com/dunwu/blog/blob/master/source/_posts/design/refactor/代码坏味道之非必要的.md)
- [代码坏味道之耦合](https://github.com/dunwu/blog/blob/master/source/_posts/design/refactor/代码坏味道之耦合.md)

### [UML](source/_posts/design/UML.md)

> 关键词：类图、对象图、包图、组件图、部署图、复合结构图、活动图、状态图、用例图、通信图、交互概述图、时序图、时间图

### [设计模式](source/_posts/design/design-patterns)

> 关键词：简单工厂模式、单例模式、工厂方法模式、抽象工厂模式、建造者模式、原型模式、适配器模式、桥接模式、装饰者模式、组合模式、外观模式、享元模式、代理模式、模板方法模式、命令模式、迭代器模式、观察者模式、解释器模式、中介者模式、职责链模式、备忘录模式、策略模式、访问者模式、状态模式

## [软件工程](source/_posts/software)

## 说明

1. 本项目中的文档采用『[Markdown](https://github.com/guodongxiaren/README)』语法书写。
2. 本项目中的文档遵循『[技术文档规范](source/_posts/style/doc-style.md)』。

## License

本博客所有文章除特别声明外，均采用 [![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/80x15.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。
