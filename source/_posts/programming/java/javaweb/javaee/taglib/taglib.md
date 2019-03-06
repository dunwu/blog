---
title: 
date: 2019-03-06
---

自定义标签是用户定义的 JSP 语言元素。

当 JSP 页面包含一个自定义标签时将被转化为 servlet，标签转化为对被称为 tag handler 的对象的操作，即当 servlet 执行时 Web container 调用那些操作。

JSP 标签扩展可以让你创建新的标签并且可以直接插入到一个 JSP 页面。 JSP 2.0 规范中引入 Simple Tag Handlers 来编写这些自定义标记。

编写自定义步骤的方法

任何一个标签都对应一个 Java 类，该类必须实现 Tag 接口。

声明一个 tld 标签库描述文件

如果 tld 文件位于/WEB-INF 目录下面，Tomcat 会自动加载 tld 文件中的标签库。如果是某些不支持自动加载或者放于其他位置的 tld 文件，可以在 web.xml 中配置。
