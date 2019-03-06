---
title: HTTP
date: 2019-03-06
---

# HTTP

<!-- TOC depthFrom:2 depthTo:3 -->

- [HTTP 是什么？](#http-是什么)
- [实例](#实例)
- [工作原理](#工作原理)
- [特点](#特点)
- [客户端请求消息](#客户端请求消息)
- [服务器响应消息](#服务器响应消息)
- [HTTP 状态码](#http-状态码)
- [更多内容](#更多内容)

<!-- /TOC -->

## HTTP 是什么？

HTTP（HyperText Transfer Protocol，超文本传输协议）是 WWW (World Wide Web)实现数据通信的基石。

HTTP 是由 **IETF**(Internet Engineering Task Force，互联网工程工作小组) 和 **W3C**(World Wide Web Consortium，万维网协会) 共同合作制订的，它们发布了一系列的**RFC**(Request For Comments)，其中最著名的是 RFC 2616，它定义了**HTTP /1.1**。

它是一种应用层协议（OSI 七层模型的最顶层），它基于 TCP/IP 通信协议来传递数据（HTML 文件, 图片文件, 查询结果等）。

## 实例

如果你学习过计算机网络，熟悉 OSI 模型，那么你可以跳过这个实例了。

而不了解 OSI 模型的朋友，不妨通过一个实例来对 HTTP 报文有一个感性的认识。

以下是使用 wireshark 抓取的一个实际访问百度首页的 HTTP GET 报文：

<br><div align="center"><img src="http://images2015.cnblogs.com/blog/318837/201601/318837-20160108221137996-786139964.png"/></div><br>

可以清楚的看到它的层级结构如下图，经过了层层的包装。

<br><div align="center"><img src="https://images2015.cnblogs.com/blog/318837/201601/318837-20160108221140731-222242798.png"/></div><br>

## 工作原理

HTTP 工作于 **Client/Server** 模型上。

客户端和服务器之间的通信采用 **request/response** 机制。

客户端是终端（可以是浏览器、爬虫程序等），服务器是网站的 Web 服务器。

一次 HTTP 操作称为一个事务，其工作过程大致可分为四步：

1. **建立连接** - 首先，客户端和服务器需要建立一个到服务器指定端口（默认端口号为 **80**）的 TCP 连接（注：虽然 HTTP 采用 TCP 连接是最流行的方式，但是 RFC 并没有指定一定要采用这种网络传输方式。）。
2. **发送请求信息** - 客户端向服务器发送请求。请求方式的格式为，统一资源标识符、协议版本号，后边是 MIME 信息包括请求修饰符
3. **发送响应信息** - 服务器监听指定接口是否收到请求，一旦发现请求，处理后，返回响应结果给客户端。其格式为一个状态行包括信息的协议版本号、一个成功或错误的代码，后边是 MIME 信息包括服务器信息、实体信息和可能的内容。
4. **关闭连接** - 客户端根据响应，显示结果给用户，最后关闭连接。

## 特点

- **无连接的** - 无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。
- **无状态的** - HTTP 协议是无状态协议。无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。
- **媒体独立的** - 这意味着，只要客户端和服务器知道如何处理的数据内容，任何类型的数据都可以通过 HTTP 发送。客户端以及服务器指定使用适合的 MIME-type 内容类型。
- **C/S 模型的** - 基于 Client/Server 模型工作。

# HTTP 消息结构

HTTP 是基于客户端/服务端（C/S）的架构模型，通过一个可靠的链接来交换信息，是一个无状态的请求/响应协议。

一个 HTTP"客户端"是一个应用程序（Web 浏览器或其他任何客户端），通过连接到服务器达到向服务器发送一个或多个 HTTP 的请求的目的。

一个 HTTP"服务器"同样也是一个应用程序（通常是一个 Web 服务，如 Apache Web 服务器或 IIS 服务器等），通过接收客户端的请求并向客户端发送 HTTP 响应数据。

HTTP 使用统一资源标识符（Uniform Resource Identifiers, URI）来传输数据和建立连接。

一旦建立连接后，数据消息就通过类似 Internet 邮件所使用的格式[RFC5322]和多用途 Internet 邮件扩展（MIME）[RFC2045]来传送。

<br><div align="center"><img src="https://images2015.cnblogs.com/blog/318837/201601/318837-20160108221141668-2097587842.png"/></div><br>

## 客户端请求消息

客户端发送一个 HTTP 请求到服务器的请求消息包括以下格式：请求行（request line）、请求头部（header）、空行和请求数据四个部分组成，下图给出了请求报文的一般格式。

<br><div align="center"><img src="https://images2015.cnblogs.com/blog/318837/201601/318837-20160108221142028-743579086.png"/></div><br>

## 服务器响应消息

HTTP 响应也由四个部分组成，分别是：状态行、消息报头、空行和响应正文。

<br><div align="center"><img src="https://images2015.cnblogs.com/blog/318837/201601/318837-20160108221142606-879279999.jpg"/></div><br>

# HTTP 请求

根据 HTTP 标准，HTTP 请求可以使用多种请求方法。

**HTTP1.0**定义了三种请求方法： **GET**, **POST** 和 **HEAD**方法。

**HTTP1.1**新增了五种请求方法：**OPTIONS**, **PUT**, **DELETE**, **TRACE** 和 **CONNECT**方法。

| 方法    | 描述                                                                                                                                     |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| GET     | 请求指定的页面信息，并返回实体主体。                                                                                                     |
| HEAD    | 类似于 get 请求，只不过返回的响应中没有具体的内容，用于获取报头                                                                          |
| POST    | 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST 请求可能会导致新的资源的建立和/或已有资源的修改。 |
| PUT     | 从客户端向服务器传送的数据取代指定的文档的内容。                                                                                         |
| DELETE  | 请求服务器删除指定的页面。                                                                                                               |
| CONNECT | HTTP/1.1 协议中预留给能够将连接改为管道方式的代理服务器。                                                                                |
| OPTIONS | 允许客户端查看服务器的性能。                                                                                                             |
| TRACE   | 回显服务器收到的请求，主要用于测试或诊断。                                                                                               |

**HTTP** **请求消息头**

| **请求消息头**  | **说明**                                     |
| --------------- | -------------------------------------------- |
| Accept          | 浏览器支持的格式                             |
| Accept-Encoding | 支持的编码格式，如（UTF-8，GBK）             |
| Accept-Language | 支持的语言类型                               |
| User-Agent      | 浏览器信息                                   |
| Cookie          | 记录的是用户当前的状态                       |
| Referer         | 指从哪个页面单击链接进入的页面               |
| HOST            | 目的地址对应的主机名                         |
| Connection      | 连接类型。如 Keep-Alive 表示长连接，不会断开 |
| Content-Length  | 内容长度                                     |
| Content-Type    | 内容类型                                     |

# HTTP 响应

| **响应消息头**   | **说明**                                                     |
| ---------------- | ------------------------------------------------------------ |
| Allow            | 服务器支持哪些请求方法（如 GET、POST 等）。                  |
| Content-Encoding | 文档的编码（Encode）方法。只有在解码之后才可以得到 Content-Type 头指定的内容类型。利用 gzip 压缩文档能够显著地减少 HTML 文档的下载时间。Java 的 GZIPOutputStream 可以很方便地进行 gzip 压缩，但只有 Unix 上的 Netscape 和 Windows 上的 IE 4、IE 5 才支持它。因此，Servlet 应该通过查看 Accept-Encoding 头（即 request.getHeader("Accept-Encoding")）检查浏览器是否支持 gzip，为支持 gzip 的浏览器返回经 gzip 压缩的 HTML 页面，为其他浏览器返回普通页面。 |
| Content-Length   | 表示内容长度。只有当浏览器使用持久 HTTP 连接时才需要这个数据。如果你想要利用持久连接的优势，可以把输出文档写入 ByteArrayOutputStram，完成后查看其大小，然后把该值放入 Content-Length 头，最后通过`byteArrayStream.writeTo(response.getOutputStream()` 发送内容。 |
| Content-Type     | 表示后面的文档属于什么 MIME 类型。Servlet 默认为 `text/plain`，但通常需要显式地指定为 text/html。由于经常要设置 Content-Type，因此 HttpServletResponse 提供了一个专用的方法 setContentType。 |
| Date             | 当前的 GMT 时间。你可以用 setDateHeader 来设置这个头以避免转换时间格式的麻烦。 |
| Expires          | 应该在什么时候认为文档已经过期，从而不再缓存它？             |
| Last-Modified    | 文档的最后改动时间。客户可以通过 If-Modified-Since 请求头提供一个日期，该请求将被视为一个条件 GET，只有改动时间迟于指定时间的文档才会返回，否则返回一个 304（Not Modified）状态。Last-Modified 也可用 setDateHeader 方法来设置。 |
| Location         | 表示客户应当到哪里去提取文档。Location 通常不是直接设置的，而是通过 HttpServletResponse 的 sendRedirect 方法，该方法同时设置状态代码为 302。 |
| Refresh          | 表示浏览器应该在多少时间之后刷新文档，以秒计。除了刷新当前文档之外，你还可以通过 `response.setHeader("Refresh", "5;URL=http://host/path")`让浏览器读取指定的页面。 注意这种功能通常是通过设置 HTML 页面 HEAD 区的 `<META HTTP-EQUIV="Refresh" CONTENT="5;URL=http://host/path">`实现，这是因为，自动刷新或重定向对于那些不能使用 CGI 或 Servlet 的 HTML 编写者十分重要。但是，对于 Servlet 来说，直接设置 Refresh 头更加方便。 注意 Refresh 的意义是"N 秒之后刷新本页面或访问指定页面"，而不是"每隔 N 秒刷新本页面或访问指定页面"。因此，连续刷新要求每次都发送一个 Refresh 头，而发送 204 状态代码则可以阻止浏览器继续刷新，不管是使用 Refresh 头还是 `<META HTTP-EQUIV="Refresh" ...>`。 注意 Refresh 头不属于 HTTP 1.1 正式规范的一部分，而是一个扩展，但 Netscape 和 IE 都支持它。 |
| Server           | 服务器名字。Servlet 一般不设置这个值，而是由 Web 服务器自己设置。 |
| Set-Cookie       | 设置和页面关联的 Cookie。Servlet 不应使用`response.setHeader("Set-Cookie", ...)`，而是应使用 HttpServletResponse 提供的专用方法 addCookie。参见下文有关 Cookie 设置的讨论。 |
| WWW-Authenticate | 客户应该在 Authorization 头中提供什么类型的授权信息？在包含 401（Unauthorized）状态行的应答中这个头是必需的。例如，`response.setHeader("WWW-Authenticate", "BASIC realm=＼"executives＼"")`。 注意 Servlet 一般不进行这方面的处理，而是让 Web 服务器的专门机制来控制受密码保护页面的访问（例如.htaccess）。 |

## HTTP 状态码

当浏览者访问一个网页时，浏览者的浏览器会向网页所在服务器发出请求。当浏览器接收并显示网页前，此网页所在的服务器会返回一个包含 HTTP 状态码的信息头（server header）用以响应浏览器的请求。

HTTP 状态码的英文为 HTTP Status Code。

下面是常见的 HTTP 状态码：

- 200 - 请求成功
- 301 - 资源（网页等）被永久转移到其它 URL
- 404 - 请求的资源（网页等）不存在
- 500 - 内部服务器错误

HTTP 状态码分类

HTTP 状态码由三个十进制数字组成，第一个十进制数字定义了状态码的类型，后两个数字没有分类的作用。HTTP 状态码共分为 5 种类型：

| **分类** | **分类描述**                                   |
| -------- | ---------------------------------------------- |
| 1        | 信息，服务器收到请求，需要请求者继续执行操作   |
| 2        | 成功，操作被成功接收并处理                     |
| 3        | 重定向，需要进一步的操作以完成请求             |
| 4        | 客户端错误，请求包含语法错误或无法完成请求     |
| 5        | 服务器错误，服务器在处理请求的过程中发生了错误 |

**HTTP 状态列表：**

| 状态码 | 状态码英文名称                  |
| ------ | ------------------------------- |
| 100    | Continue                        |
| 101    | Switching Protocols             |
| 200    | OK                              |
| 201    | Created                         |
| 202    | Accepted                        |
| 203    | Non-Authoritative Information   |
| 204    | No Content                      |
| 205    | Reset Content                   |
| 206    | Partial Content                 |
| 300    | Multiple Choices                |
| 301    | Moved Permanently               |
| 302    | Found                           |
| 303    | See Other                       |
| 304    | Not Modified                    |
| 305    | Use Proxy                       |
| 306    | Unused                          |
| 307    | Temporary Redirect              |
| 400    | Bad Request                     |
| 401    | Unauthorized                    |
| 402    | Payment Required                |
| 403    | Forbidden                       |
| 404    | Not Found                       |
| 405    | Method Not Allowed              |
| 406    | Not Acceptable                  |
| 407    | Proxy Authentication Required   |
| 408    | Request Time-out                |
| 409    | Conflict                        |
| 410    | Gone                            |
| 411    | Length Required                 |
| 412    | Precondition Failed             |
| 413    | Request Entity Too Large        |
| 414    | Request-URI Too Large           |
| 415    | Unsupported Media Type          |
| 416    | Requested range not satisfiable |
| 417    | Expectation Failed              |
| 500    | Internal Server Error           |
| 501    | Not Implemented                 |
| 502    | Bad Gateway                     |
| 503    | Service Unavailable             |
| 504    | Gateway Time-out                |
| 505    | HTTP Version not supported      |

## 更多内容

- http://blog.csdn.net/gueter/article/details/1524447
- http://www.runoob.com/http/http-intro.html
- https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol
