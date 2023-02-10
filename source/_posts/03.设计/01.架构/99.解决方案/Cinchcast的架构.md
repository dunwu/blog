---
title: Cinchcast 的架构
date: 2021-11-08 08:15:33
categories:
  - 设计
  - 架构
  - 解决方案
tags:
  - 架构
  - 解决方案
permalink: /pages/3f25aa/
---

# Cinchcast 的架构

Cinchcast 提供的解决方案允许公司创建、共享、衡量和货币化音频内容，以接触和吸引对其业务最重要的人。我们的技术将会议桥接器与实时音频流相结合，以简化在线活动并增强参与者的参与度。 Cinchcast 技术还用于为全球最大的音频社交网络 Blogtalkradio 提供动力。今天，我们的平台每天制作和分发超过 1,500 小时的原创内容。在本文中，我们描述了我们为扩展平台以支持这种规模的数据而做出的工程决策。

## 统计数据

- 浏览量每月超过 5000 万
- 创建了 50000 小时的音频内容
- 1500 万个流媒体
- 175,000,000 次广告展示
- 峰值每秒 40000 并发请求
- MSSQL、Redis、ElasticSearch 集群中存储的数据达到每天数 TB，
- 10 人工程师团队
- 生产环境大概有 100 左右的硬件节点

## 数据中心

线上网站部署在布鲁克林的数据中心。但 QA 和 Staging 环境则使用了 Amazon EC2 云实例。

——考虑到数据安全，大部分公司不愿意把真实数据部署在云端。

## 硬件

- 大概有 50 台 Web 服务器
- 15 台 MS SQL 数据库服务器
- 2 台 Redis 的 NoSQL 的键值服务器
- 2 台 NodeJS 服务器
- 2 台 弹性搜索集群服务器

## 开发工具

- NET 4 C#：ASP.NET 和 MVC3
- IDE 用的是 Visual Studio 2010 Team Suite
- 用 StyleCop、ReSharper 来强化代码标准
- 使用敏捷。其中大的功能用 Scrum，小任务则通过看板任务墙管理
- 测试和持续集成使用 Jenkins + Nunit
- 自动化测试则是 Selenium 和 Sauce On Demand

## 软件和使用的技术

- Windows Server 2008 R2 的 64 位操作系统
- 基于微软 Windows Server 2008 Web 服务器下运行的 SQL Server 2005
- 负载均衡是 EQL(Equalizer load balancers)
- Redis 作为分布式缓存层和消息分发队列
- NodeJS 用来进行实时分析和更新仪表盘
- 搜索用得是 ElasticSearch，日志分析是通过 Sawmill+自定义分析器脚本

## 监测

- NewRelic：性能监控
- 性能对 KPI（转换率，页面浏览量）的影响：Chartbeat：
- Gomez，WhatsupGold，Nagios 等用来各种预警和报警
- SQL Server monitoring 的监控：来自 Red Gate 的 SQL Monitor

## 我们的原则

- 尊重他人的时间。不要带着问题来，要拿出解决办法。
- 不要去追逐当下的热点技术，先实现基本功能，然后再做锦上添花的。务实是最重要的。
- 成为一个“如何做”的团队而不是总是说“不”的团队
- 预先处理总比亡羊补牢要好，把安全植入到软件开发生命周期中，通过培训开发人员如何写出安全的软件并把它从一开始就作为业务优先考虑之处。

## 架构

- 所有 Javascript、CSS 和图像都缓存在 CDN 级别。 DNS 指向一个 CDN，它将请求传递给源服务器。我们使用 Cotendo 是因为它允许在 CDN 上做出 L7 路由决策。
- 单独的 Web 服务器集群用于为普通用户和广告用户的请求提供服务，通过 cookie 进行区分。
- 我们正在转向面向服务的架构，其中系统的关键部分，例如搜索、身份验证、缓存，都是以各种语言实现的 RESTFUL 服务。这些服务还提供了一个缓存层。
- REDIS NOSQL 键值存储（redis.io）用作数据库调用之前的缓存层。
- Scaleout 用于在网络服务器集群中维护会话状态。但是，我们正在考虑切换到 REDIS。

## 经验教训

- SQL Server 数据库中的文本搜索不好用，经常出现 CPU 阻塞，所以 Cinchcast 切换到 ElasticSearch，一个 Lucene 的衍生工具。
- 微软内置的会话模块容易出现死锁，他们用 AngiesList 会话模块取代了它，并把数据存储到 Redis。
- 日志是发现问题的关键。
- 重新发明轮子，有时候也可以是一件好事。例如，在一个供应商的提供的 JS / CSS 的产品导致性能问题的时候，他们通过重写显著改善了网站的性能。
- 并不是所有的数据都是关系型的。
- 在开发中不使用指标检测就像在风暴中不参考高度表来降落飞机，因此整个开发过程中，一定要通过网站吞吐量，解决错误的时间、代码覆盖率，等指标来衡量你的效率。 总的来说，对于日 PV 百万级的网站来说，Cinchcast 的架构、研发、运维等层面的技术选型和经验值得学习和参考。

## 参考资料

- [每天产生 1500 小时的音频](http://highscalability.com/blog/2012/7/16/cinchcast-architecture-producing-1500-hours-of-audio-every-d.html)