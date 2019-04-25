---
title: Servlet 指南
categories: ['java', 'javaweb', 'javaee']
tags: ['java', 'javaweb', 'javaee', 'servlet']
date: 2017-11-08
---

# Servlet 指南

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [Servlet 是什么？](#servlet-是什么)
    - [Servlet 架构](#servlet-架构)
    - [Servlet 任务](#servlet-任务)
    - [Servlet 包](#servlet-包)
    - [init() 方法](#init-方法)
    - [service() 方法](#service-方法)
    - [doGet() 方法](#doget-方法)
    - [doPost() 方法](#dopost-方法)
    - [destroy() 方法](#destroy-方法)
    - [架构图](#架构图)
- [Servlet 和 HTTP 状态码](#servlet-和-http-状态码)
    - [HTTP 状态码](#http-状态码)
    - [设置 HTTP 状态码的方法](#设置-http-状态码的方法)
    - [HTTP 状态码实例](#http-状态码实例)

<!-- /TOC -->

## 简介

### Servlet 是什么？

Java Servlet 是运行在 Web 服务器或应用服务器上的程序，它是作为来自 Web 浏览器或其他 HTTP 客户端的请求和 HTTP 服务器上的数据库或应用程序之间的中间层。

使用 Servlet，您可以收集来自网页表单的用户输入，呈现来自数据库或者其他源的记录，还可以动态创建网页。

Java Servlet 通常情况下与使用 CGI（Common Gateway Interface，公共网关接口）实现的程序可以达到异曲同工的效果。但是相比于 CGI，Servlet 有以下几点优势：

- 性能明显更好。
- Servlet 在 Web 服务器的地址空间内执行。这样它就没有必要再创建一个单独的进程来处理每个客户端请求。
- Servlet 是独立于平台的，因为它们是用 Java 编写的。
- 服务器上的 Java 安全管理器执行了一系列限制，以保护服务器计算机上的资源。因此，Servlet 是可信的。
- Java 类库的全部功能对 Servlet 来说都是可用的。它可以通过 sockets 和 RMI 机制与 applets、数据库或其他软件进行交互。

### Servlet 架构

下图显示了 Servlet 在 Web 应用程序中的位置。

<div align="center"><img src="http://www.runoob.com/wp-content/uploads/2014/07/servlet-arch.jpg"/></div>

### Servlet 任务

Servlet 执行以下主要任务：

- 读取客户端（浏览器）发送的显式的数据。这包括网页上的 HTML 表单，或者也可以是来自 applet 或自定义的 HTTP 客户端程序的表单。
- 读取客户端（浏览器）发送的隐式的 HTTP 请求数据。这包括 cookies、媒体类型和浏览器能理解的压缩格式等等。
- 处理数据并生成结果。这个过程可能需要访问数据库，执行 RMI 或 CORBA 调用，调用 Web 服务，或者直接计算得出对应的响应。
- 发送显式的数据（即文档）到客户端（浏览器）。该文档的格式可以是多种多样的，包括文本文件（HTML 或 XML）、二进制文件（GIF 图像）、Excel 等。
- 发送隐式的 HTTP 响应到客户端（浏览器）。这包括告诉浏览器或其他客户端被返回的文档类型（例如 HTML），设置 cookies 和缓存参数，以及其他类似的任务。

### Servlet 包

Java Servlet 是运行在带有支持 Java Servlet 规范的解释器的 web 服务器上的 Java 类。

Servlet 可以使用 **javax.servlet** 和 **javax.servlet.http** 包创建，它是 Java 企业版的标准组成部分，Java 企业版是支持大型开发项目的 Java 类库的扩展版本。

这些类实现 Java Servlet 和 JSP 规范。在写本教程的时候，二者相应的版本分别是 Java Servlet 2.5 和 JSP 2.1。

Java Servlet 就像任何其他的 Java 类一样已经被创建和编译。在您安装 Servlet 包并把它们添加到您的计算机上的 Classpath 类路径中之后，您就可以通过 JDK 的 Java 编译器或任何其他编译器来编译 Servlet。

# Servlet 生命周期

Servlet 生命周期可被定义为从创建直到毁灭的整个过程。以下是 Servlet 遵循的过程：

- Servlet 通过调用 **init ()** 方法进行初始化。
- Servlet 调用 **service()** 方法来处理客户端的请求。
- Servlet 通过调用 **destroy()** 方法终止（结束）。
- 最后，Servlet 是由 JVM 的垃圾回收器进行垃圾回收的。

现在让我们详细讨论生命周期的方法。

### init() 方法

init 方法被设计成只调用一次。它在第一次创建 Servlet 时被调用，在后续每次用户请求时不再调用。因此，它是用于一次性初始化，就像 Applet 的 init 方法一样。

Servlet 创建于用户第一次调用对应于该 Servlet 的 URL 时，但是您也可以指定 Servlet 在服务器第一次启动时被加载。

当用户调用一个 Servlet 时，就会创建一个 Servlet 实例，每一个用户请求都会产生一个新的线程，适当的时候移交给 doGet 或 doPost 方法。init() 方法简单地创建或加载一些数据，这些数据将被用于 Servlet 的整个生命周期。

init 方法的定义如下：

```java
public void init() throws ServletException {
  // 初始化代码...
}
```

### service() 方法

service() 方法是执行实际任务的主要方法。Servlet 容器（即 Web 服务器）调用 service() 方法来处理来自客户端（浏览器）的请求，并把格式化的响应写回给客户端。

每次服务器接收到一个 Servlet 请求时，服务器会产生一个新的线程并调用服务。service() 方法检查 HTTP 请求类型（GET、POST、PUT、DELETE 等），并在适当的时候调用 doGet、doPost、doPut，doDelete 等方法。

下面是该方法的特征：

```java
public void service(ServletRequest request,
                    ServletResponse response)
      throws ServletException, IOException{
}
```

service() 方法由容器调用，service 方法在适当的时候调用 doGet、doPost、doPut、doDelete 等方法。所以，您不用对 service() 方法做任何动作，您只需要根据来自客户端的请求类型来重写 doGet() 或 doPost() 即可。

doGet() 和 doPost() 方法是每次服务请求中最常用的方法。下面是这两种方法的特征。

### doGet() 方法

GET 请求来自于一个 URL 的正常请求，或者来自于一个未指定 METHOD 的 HTML 表单，它由 doGet() 方法处理。

```java
public void doGet(HttpServletRequest request,
                  HttpServletResponse response)
    throws ServletException, IOException {
    // Servlet 代码
}
```

### doPost() 方法

POST 请求来自于一个特别指定了 METHOD 为 POST 的 HTML 表单，它由 doPost() 方法处理。

```java
public void doPost(HttpServletRequest request,
                   HttpServletResponse response)
    throws ServletException, IOException {
    // Servlet 代码
}
```

### destroy() 方法

destroy() 方法只会被调用一次，在 Servlet 生命周期结束时被调用。destroy() 方法可以让您的 Servlet 关闭数据库连接、停止后台线程、把 Cookie 列表或点击计数器写入到磁盘，并执行其他类似的清理活动。

在调用 destroy() 方法之后，servlet 对象被标记为垃圾回收。destroy 方法定义如下所示：

```java
  public void destroy() {
    // 终止化代码...
  }
```

### 架构图

下图显示了一个典型的 Servlet 生命周期方案。

- 第一个到达服务器的 HTTP 请求被委派到 Servlet 容器。
- Servlet 容器在调用 service() 方法之前加载 Servlet。
- 然后 Servlet 容器处理由多个线程产生的多个请求，每个线程执行一个单一的 Servlet 实例的 service() 方法。

<div align="center"><img src="http://www.runoob.com/wp-content/uploads/2014/07/Servlet-LifeCycle.jpg"/></div>

## Servlet 和 HTTP 状态码

---

title: JavaEE Servlet HTTP 状态码
date: 2017-11-08
categories:

- javaee
  tags:
- javaee
- servlet
- http

---

### HTTP 状态码

HTTP 请求和 HTTP 响应消息的格式是类似的，结构如下：

- 初始状态行 + 回车换行符（回车+换行）
- 零个或多个标题行+回车换行符
- 一个空白行，即回车换行符
- 一个可选的消息主体，比如文件、查询数据或查询输出

例如，服务器的响应头如下所示：

```
HTTP/1.1 200 OK
Content-Type: text/html
Header2: ...
...
HeaderN: ...
  (Blank Line)
<!doctype ...>
<html>
<head>...</head>
<body>
...
</body>
</html>
```

状态行包括 HTTP 版本（在本例中为 HTTP/1.1）、一个状态码（在本例中为 200）和一个对应于状态码的短消息（在本例中为 OK）。

以下是可能从 Web 服务器返回的 HTTP 状态码和相关的信息列表：

| 代码 | 消息                          | 描述                                                                                                   |
| ---- | ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| 100  | Continue                      | 只有请求的一部分已经被服务器接收，但只要它没有被拒绝，客户端应继续该请求。                             |
| 101  | Switching Protocols           | 服务器切换协议。                                                                                       |
| 200  | OK                            | 请求成功。                                                                                             |
| 201  | Created                       | 该请求是完整的，并创建一个新的资源。                                                                   |
| 202  | Accepted                      | 该请求被接受处理，但是该处理是不完整的。                                                               |
| 203  | Non-authoritative Information |                                                                                                        |
| 204  | No Content                    |                                                                                                        |
| 205  | Reset Content                 |                                                                                                        |
| 206  | Partial Content               |                                                                                                        |
| 300  | Multiple Choices              | 链接列表。用户可以选择一个链接，进入到该位置。最多五个地址。                                           |
| 301  | Moved Permanently             | 所请求的页面已经转移到一个新的 URL。                                                                   |
| 302  | Found                         | 所请求的页面已经临时转移到一个新的 URL。                                                               |
| 303  | See Other                     | 所请求的页面可以在另一个不同的 URL 下被找到。                                                          |
| 304  | Not Modified                  |                                                                                                        |
| 305  | Use Proxy                     |                                                                                                        |
| 306  | _Unused_                      | 在以前的版本中使用该代码。现在已不再使用它，但代码仍被保留。                                           |
| 307  | Temporary Redirect            | 所请求的页面已经临时转移到一个新的 URL。                                                               |
| 400  | Bad Request                   | 服务器不理解请求。                                                                                     |
| 401  | Unauthorized                  | 所请求的页面需要用户名和密码。                                                                         |
| 402  | Payment Required              | _您还不能使用该代码。_                                                                                 |
| 403  | Forbidden                     | 禁止访问所请求的页面。                                                                                 |
| 404  | Not Found                     | 服务器无法找到所请求的页面。.                                                                          |
| 405  | Method Not Allowed            | 在请求中指定的方法是不允许的。                                                                         |
| 406  | Not Acceptable                | 服务器只生成一个不被客户端接受的响应。                                                                 |
| 407  | Proxy Authentication Required | 在请求送达之前，您必须使用代理服务器的验证。                                                           |
| 408  | Request Timeout               | 请求需要的时间比服务器能够等待的时间长，超时。                                                         |
| 409  | Conflict                      | 请求因为冲突无法完成。                                                                                 |
| 410  | Gone                          | 所请求的页面不再可用。                                                                                 |
| 411  | Length Required               | "Content-Length" 未定义。服务器无法处理客户端发送的不带 Content-Length 的请求信息。                    |
| 412  | Precondition Failed           | 请求中给出的先决条件被服务器评估为 false。                                                             |
| 413  | Request Entity Too Large      | 服务器不接受该请求，因为请求实体过大。                                                                 |
| 414  | Request-url Too Long          | 服务器不接受该请求，因为 URL 太长。当您转换一个 "post" 请求为一个带有长的查询信息的 "get" 请求时发生。 |
| 415  | Unsupported Media Type        | 服务器不接受该请求，因为媒体类型不被支持。                                                             |
| 417  | Expectation Failed            |                                                                                                        |
| 500  | Internal Server Error         | 未完成的请求。服务器遇到了一个意外的情况。                                                             |
| 501  | Not Implemented               | 未完成的请求。服务器不支持所需的功能。                                                                 |
| 502  | Bad Gateway                   | 未完成的请求。服务器从上游服务器收到无效响应。                                                         |
| 503  | Service Unavailable           | 未完成的请求。服务器暂时超载或死机。                                                                   |
| 504  | Gateway Timeout               | 网关超时。                                                                                             |
| 505  | HTTP Version Not Supported    | 服务器不支持"HTTP 协议"版本。                                                                          |

### 设置 HTTP 状态码的方法

下面的方法可用于在 Servlet 程序中设置 HTTP 状态码。这些方法通过 `HttpServletResponse` 对象可用。

| 序号 | 方法 & 描述                                                                                                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | **public void setStatus ( int statusCode )**该方法设置一个任意的状态码。setStatus 方法接受一个 int（状态码）作为参数。如果您的反应包含了一个特殊的状态码和文档，请确保在使用 _PrintWriter_ 实际返回任何内容之前调用 setStatus。 |
| 2    | **public void sendRedirect(String url)**该方法生成一个 302 响应，连同一个带有新文档 URL 的 _Location_ 头。                                                                                                                      |
| 3    | **public void sendError(int code, String message)**该方法发送一个状态码（通常为 404），连同一个在 HTML 文档内部自动格式化并发送到客户端的短消息。                                                                               |

### HTTP 状态码实例

下面的例子把 407 错误代码发送到客户端浏览器，浏览器会显示 "Need authentication!!!" 消息。

```java
// 导入必需的 java 库
import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;

// 扩展 HttpServlet 类
public class showError extends HttpServlet {

  // 处理 GET 方法请求的方法
  public void doGet(HttpServletRequest request,
                    HttpServletResponse response)
            throws ServletException, IOException
  {
      // 设置错误代码和原因
      response.sendError(407, "Need authentication!!!" );
  }
  // 处理 POST 方法请求的方法
  public void doPost(HttpServletRequest request,
                     HttpServletResponse response)
      throws ServletException, IOException {
     doGet(request, response);
  }
}
```

现在，调用上面的 Servlet 将显示以下结果：

```
HTTP Status 407 - Need authentication!!!
type Status report
message Need authentication!!!
description The client must first authenticate itself with the proxy (Need authentication!!!).
Apache Tomcat/5.5.29
```
