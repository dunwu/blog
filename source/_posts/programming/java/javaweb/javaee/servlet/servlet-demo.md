---
title: JavaEE Servlet 示例
date: 2017-11-08
categories:
- javaee
tags:
- javaee
- servlet
---

## 编写 Servlet

### 部署 Servlet

### web.xml 是什么

### servlet 元素

`<servlet>`元素用于注册 Servlet。

`<servlet>`包含有两个主要的子元素：`<servlet-name>`和`<servlet-class>`，分别用于设置 Servlet 的注册名称和 Servlet 的完整类名。

如果在`<servlet>`元素中配置了一个`<load-on-startup>`元素，那么 WEB 应用程序在启动时，就会装载并创建 Servlet 的实例对象、以及调用 Servlet 实例对象的 init()方法。

```xml
<servlet>
  <servlet-name>HelloServlet</servlet-name>
  <servlet-class>org.zp.notes.javaee.servlet.HelloServlet</servlet-class>
  <load-on-startup>1</load-on-startup>
</servlet>
```

### servlet-mapping 元素

`<servlet-mapping>`元素用于映射一个已注册的 Servlet 的一个对外访问路径。

`<servlet-mapping>`包含有两个子元素：`<servlet-name>`和`<url-pattern>`，分别用于指定 Servlet 的注册名称和 Servlet 的对外访问路径。

**注：同一个 Servlet 可以被映射到多个 URL 上。**例：

```xml
<servlet>
  <servlet-name>HelloServlet</servlet-name>
  <servlet-class>org.zp.notes.javaee.servlet.HelloServlet</servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>HelloServlet</servlet-name>
  <url-pattern>/servlet/HelloServlet</url-pattern>
  <url-pattern>/servlet/HelloServlet.asp</url-pattern>
  <url-pattern>/servlet/HelloServlet.jsp</url-pattern>
  <url-pattern>/servlet/HelloServlet.php</url-pattern>
  <url-pattern>/servlet/HelloServlet.aspx</url-pattern>
</servlet-mapping>
```

### url-pattern 的通配符

`/`

如果某个 Servlet 的映射路径仅仅为一个正斜杠`/`，那么这个 Servlet 就成为当前 Web 应用程序的缺省 Servlet。  凡是在`web.xml`文件中找不到匹配的`<servlet-mapping>`元素的 URL，它们的访问请求都将交给缺省 Servlet 处理，也就是说，缺省 Servlet 用于处理所有其他 Servlet 都不处理的访问请求。

`*`

`*`可以匹配任意的字符。

### init-param 元素和 context-param 元素

`<init-param>`标签用于为当前 servlet 配置一些初始化参数。

`<context-param>`标签用于配置全局的初始化参数，所有 servlet 都可以使用。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="3.0" xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
    http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd">
    <display-name></display-name>
    <!-- 配置WEB应用的初始化参数 -->
    <context-param>
        <param-name>datasource</param-name>
        <param-value>jdbc:mysql://localhost:3306/test</param-value>
    </context-param>

    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>
</web-app>
```
