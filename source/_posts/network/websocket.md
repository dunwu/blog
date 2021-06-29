---
title: 网络协议之 Websocket
categories: ['网络']
tags: ['网络', '通信', '协议']
date: 2019-05-31 11:51
---

# Socket 和 WebSocket

> 📦 本文已归档到：「[blog](https://github.com/dunwu/blog)」

<!-- TOC depthFrom:2 depthTo:3 -->

- [Socket](#socket)
  - [Socket 用法](#socket-用法)
  - [Socket 长连接](#socket-长连接)
- [WebSocket](#websocket)
  - [WebSocket 简介](#websocket-简介)
  - [WebSocket 使用](#websocket-使用)
- [FAQ](#faq)
  - [Http vs. Socket](#http-vs-socket)
  - [HTTP 和 WebSocket 有什么关系？](#http-和-websocket-有什么关系)
  - [Html 和 HTTP 有什么关系？](#html-和-http-有什么关系)
- [参考资料](#参考资料)

<!-- /TOC -->

## Socket

Socket 作为一种抽象层，应用程序通过它来发送和接收数据，使用 Socket 可以将应用程序与处于同一网络中的其他应用程序进行通信交互。简而言之，Socket 提供了应用程序内部与外界通信的端口以及为通信双方提供了数据传输的通道。

### Socket 用法

很多编程语言都支持 Socket。这里以 Java 的 Socket 用法为例。

在 Java 的 SDK 中，socket 的共有两个接口：用于监听客户连接的 `ServerSocket` 和用于通信的 `Socket`。使用 socket 的步骤如下：

- 创建 `ServerSocket` 并监听客户连接
- 使用 `Socket` 连接服务端
- 通过 `Socket` 获取输入输出流进行通信

### Socket 长连接

Socket 长连接，指的是在客户和服务端之间保持一个 socket 连接长时间不断开。

```
socket.setKeepAlive(true);
```

## WebSocket

### WebSocket 简介

#### WebSocket 是什么

[WebSocket](http://websocket.org/) 是一种网络通信协议。[RFC6455](https://tools.ietf.org/html/rfc6455) 定义了它的通信标准。

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

#### 为什么需要 WebSocket

了解计算机网络协议的人，应该都知道：HTTP 协议是一种无状态的、无连接的、单向的应用层协议。它采用了请求/响应模型。通信请求只能由客户端发起，服务端对请求做出应答处理。

这种通信模型有一个弊端：HTTP 协议无法实现服务器主动向客户端发起消息。

这种单向请求的特点，注定了如果服务器有连续的状态变化，客户端要获知就非常麻烦。大多数 Web 应用程序将通过频繁的异步 JavaScript 和 XML（AJAX）请求实现长轮询。轮询的效率低，非常浪费资源（因为必须不停连接，或者 HTTP 连接始终打开）。

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/java/spring/web/ajax-long-polling.png"/></div>
因此，工程师们一直在思考，有没有更好的方法。WebSocket 就是这样发明的。WebSocket 连接允许客户端和服务器之间进行全双工通信，以便任一方都可以通过建立的连接将数据推送到另一端。WebSocket 只需要建立一次连接，就可以一直保持连接状态。这相比于轮询方式的不停建立连接显然效率要大大提高。

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/java/spring/web/websockets-flow.png"/></div>
#### WebSocket 如何工作

Web 浏览器和服务器都必须实现 WebSockets 协议来建立和维护连接。由于 WebSockets 连接长期存在，与典型的 HTTP 连接不同，对服务器有重要的影响。

基于多线程或多进程的服务器无法适用于 WebSockets，因为它旨在打开连接，尽可能快地处理请求，然后关闭连接。任何实际的 WebSockets 服务器端实现都需要一个异步服务器。

### WebSocket 使用

#### WebSocket 客户端

在客户端，没有必要为 WebSockets 使用 JavaScript 库。实现 WebSockets 的 Web 浏览器将通过 WebSockets 对象公开所有必需的客户端功能（主要指支持 Html5 的浏览器）。

以下 API 用于创建 WebSocket 对象。

```
var Socket = new WebSocket(url, [protocol] );
```

以上代码中的第一个参数 url, 指定连接的 URL。第二个参数 protocol 是可选的，指定了可接受的子协议。

##### WebSocket 属性

以下是 WebSocket 对象的属性。假定我们使用了以上代码创建了 Socket 对象：

| 属性                  | 描述                                                                                                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Socket.readyState     | 只读属性 **readyState** 表示连接状态，可以是以下值：0 - 表示连接尚未建立。1 - 表示连接已建立，可以进行通信。2 - 表示连接正在进行关闭。3 - 表示连接已经关闭或者连接不能打开。 |
| Socket.bufferedAmount | 只读属性 **bufferedAmount** 已被 send() 放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数。                                                                          |

##### WebSocket 事件

以下是 WebSocket 对象的相关事件。假定我们使用了以上代码创建了 Socket 对象：

| 事件    | 事件处理程序     | 描述                       |
| ------- | ---------------- | -------------------------- |
| open    | Socket.onopen    | 连接建立时触发             |
| message | Socket.onmessage | 客户端接收服务端数据时触发 |
| error   | Socket.onerror   | 通信发生错误时触发         |
| close   | Socket.onclose   | 连接关闭时触发             |

##### WebSocket 方法

以下是 WebSocket 对象的相关方法。假定我们使用了以上代码创建了 Socket 对象：

| 方法           | 描述             |
| -------------- | ---------------- |
| Socket.send()  | 使用连接发送数据 |
| Socket.close() | 关闭连接         |

WebSocket 客户端代码示例：

```js
// 初始化一个 WebSocket 对象
var ws = new WebSocket('ws://localhost:9998/echo')

// 建立 web socket 连接成功触发事件
ws.onopen = function() {
  // 使用 send() 方法发送数据
  ws.send('发送数据')
  alert('数据发送中...')
}

// 接收服务端数据时触发事件
ws.onmessage = function(evt) {
  var received_msg = evt.data
  alert('数据已接收...')
}

// 断开 web socket 连接成功触发事件
ws.onclose = function() {
  alert('连接已关闭...')
}
```

#### WebSocket 服务端

WebSocket 在服务端的实现非常丰富。Node.js、Java、C++、Python 等多种语言都有自己的解决方案。

以下，介绍我在学习 WebSocket 过程中接触过的 WebSocket 服务端解决方案。

##### Node.js

常用的 Node 实现有以下三种。

- [µWebSockets](https://github.com/uWebSockets/uWebSockets)
- [Socket.IO](http://socket.io/)
- [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node)

##### Java

Java 的 web 一般都依托于 servlet 容器。

我使用过的 servlet 容器有：Tomcat、Jetty、Resin。其中 Tomcat7、Jetty7 及以上版本均开始支持 WebSocket（推荐较新的版本，因为随着版本的更迭，对 WebSocket 的支持可能有变更）。

此外，Spring 框架对 WebSocket 也提供了支持。

虽然，以上应用对于 WebSocket 都有各自的实现。但是，它们都遵循[RFC6455](https://tools.ietf.org/html/rfc6455) 的通信标准，并且 Java API 统一遵循 [JSR 356 - JavaTM API for WebSocket ](http://www.jcp.org/en/jsr/detail?id=356) 规范。所以，在实际编码中，API 差异不大。

##### Spring

Spring 对于 WebSocket 的支持基于下面的 jar 包：

```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-websocket</artifactId>
  <version>${spring.version}</version>
</dependency>
```

在 Spring 实现 WebSocket 服务器大概分为以下几步：

**创建 WebSocket 处理器**

扩展 `TextWebSocketHandler` 或 `BinaryWebSocketHandler` ，你可以覆写指定的方法。Spring 在收到 WebSocket 事件时，会自动调用事件对应的方法。

```java
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;

public class MyHandler extends TextWebSocketHandler {

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        // ...
    }

}
```

`WebSocketHandler` 源码如下，这意味着你的处理器大概可以处理哪些 WebSocket 事件：

```java
public interface WebSocketHandler {

   /**
    * 建立连接后触发的回调
    */
   void afterConnectionEstablished(WebSocketSession session) throws Exception;

   /**
    * 收到消息时触发的回调
    */
   void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception;

   /**
    * 传输消息出错时触发的回调
    */
   void handleTransportError(WebSocketSession session, Throwable exception) throws Exception;

   /**
    * 断开连接后触发的回调
    */
   void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception;

   /**
    * 是否处理分片消息
    */
   boolean supportsPartialMessages();

}
```

**配置 WebSocket**

配置有两种方式：注解和 xml 。其作用就是将 WebSocket 处理器添加到注册中心。

1. 实现 `WebSocketConfigurer`

```java
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(myHandler(), "/myHandler");
    }

    @Bean
    public WebSocketHandler myHandler() {
        return new MyHandler();
    }

}
```

2. xml 方式

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:websocket="http://www.springframework.org/schema/websocket"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/websocket
        http://www.springframework.org/schema/websocket/spring-websocket.xsd">

    <websocket:handlers>
        <websocket:mapping path="/myHandler" handler="myHandler"/>
    </websocket:handlers>

    <bean id="myHandler" class="org.springframework.samples.MyHandler"/>

</beans>
```

> 更多配置细节可以参考：[Spring WebSocket 文档](https://docs.spring.io/spring/docs/4.3.12.RELEASE/spring-framework-reference/htmlsingle/#websocket)

javax.websocket

如果不想使用 Spring 框架的 WebSocket API，你也可以选择基本的 javax.websocket。

首先，需要引入 API jar 包。

```
<!-- To write basic javax.websocket against -->
<dependency>
  <groupId>javax.websocket</groupId>
  <artifactId>javax.websocket-api</artifactId>
  <version>1.0</version>
</dependency>
```

如果使用嵌入式 jetty，你还需要引入它的实现包：

```xml
<!-- To run javax.websocket in embedded server -->
<dependency>
  <groupId>org.eclipse.jetty.websocket</groupId>
  <artifactId>javax-websocket-server-impl</artifactId>
  <version>${jetty-version}</version>
</dependency>
<!-- To run javax.websocket client -->
<dependency>
  <groupId>org.eclipse.jetty.websocket</groupId>
  <artifactId>javax-websocket-client-impl</artifactId>
  <version>${jetty-version}</version>
</dependency>
```

**@ServerEndpoint**

这个注解用来标记一个类是 WebSocket 的处理器。

然后，你可以在这个类中使用下面的注解来表明所修饰的方法是触发事件的回调

```java
// 收到消息触发事件
@OnMessage
public void onMessage(String message, Session session) throws IOException, InterruptedException {
	...
}

// 打开连接触发事件
@OnOpen
public void onOpen(Session session, EndpointConfig config, @PathParam("id") String id) {
	...
}

// 关闭连接触发事件
@OnClose
public void onClose(Session session, CloseReason closeReason) {
	...
}

// 传输消息错误触发事件
@OnError
public void onError(Throwable error) {
	...
}
```

**ServerEndpointConfig.Configurator**

编写完处理器，你需要扩展 ServerEndpointConfig.Configurator 类完成配置：

```java
public class WebSocketServerConfigurator extends ServerEndpointConfig.Configurator {
    @Override
    public void modifyHandshake(ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response) {
        HttpSession httpSession = (HttpSession) request.getHttpSession();
        sec.getUserProperties().put(HttpSession.class.getName(), httpSession);
    }
}
```

然后就没有然后了，就是这么简单。

#### WebSocket 代理

如果把 WebSocket 的通信看成是电话连接，Nginx 的角色则像是电话接线员，负责将发起电话连接的电话转接到指定的客服。

Nginx 从 [1.3 版](http://nginx.com/blog/websocket-nginx/)开始正式支持 WebSocket 代理。如果你的 web 应用使用了代理服务器 Nginx，那么你还需要为 Nginx 做一些配置，使得它开启 WebSocket 代理功能。

以下为参考配置：

```nginx
server {
  # this section is specific to the WebSockets proxying
  location /socket.io {
    proxy_pass http://app_server_wsgiapp/socket.io;
    proxy_redirect off;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 600;
  }
}
```

> 更多配置细节可以参考：[Nginx 官方的 websocket 文档](http://nginx.org/en/docs/http/websocket.html)

#### WebSocket 应用示例

如果需要完整示例代码，可以参考我的 Github 代码：

- [Spring 对 WebSocket 支持的示例](https://github.com/dunwu/spring-notes/tree/master/codes/web/websocket)
- [嵌入式 Jetty 服务器的 WebSocket 示例](https://github.com/dunwu/javaee-notes/tree/master/codes/websocket)

spring-websocket 和 jetty 9.3 版本似乎存在兼容性问题，Tomcat 则木有问题。

我尝试了好几次，没有找到解决方案，只好使用 Jetty 官方的嵌入式示例在 Jetty 中使用 WebSocket 。

## FAQ

### Http vs. Socket

Http 通信与 Socket 通信方式有何差异？

- Http
  - 基于请求/响应模式，采取一问一答方式（客户端请求，服务端才会响应）
- Socket
  - 客户端和服务端建立双向连接。连接成功后，任意一方都可主动发送消息。
  - 数据丢失率低，使用简单，易于移植。

### HTTP 和 WebSocket 有什么关系？

Websocket 其实是一个新协议，跟 HTTP 协议基本没有关系，只是为了兼容现有浏览器的握手规范而已，也就是说它是 HTTP 协议上的一种补充。

### Html 和 HTTP 有什么关系？

Html 是超文本标记语言，是一种用于创建网页的标准标记语言。它是一种技术标准。Html5 是它的最新版本。

Http 是一种网络通信协议。其本身和 Html 没有直接关系。

## 参考资料

- [知乎高票答案——WebSocket 是什么原理](https://www.zhihu.com/question/20215561) - 对 WebSocket 原理的阐述简单易懂。
- [WebSocket 教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html) - 阮一峰大神的科普一如既往的浅显易懂。
- [WebSockets](https://www.fullstackpython.com/websockets.html) - by _fullstackpython_
- [Nginx 官方的 websocket 文档](http://nginx.org/en/docs/http/websocket.html)
- [Spring WebSocket 文档](https://docs.spring.io/spring/docs/4.3.12.RELEASE/spring-framework-reference/htmlsingle/#websocket)
- [Tomcat7 WebSocket 文档](http://tomcat.apache.org/tomcat-7.0-doc/web-socket-howto.html)
- [Jetty WebSocket 文档](https://www.eclipse.org/jetty/documentation/9.4.7.v20170914/websocket-intro.html)
- [Socket，你需要知道的事儿](https://juejin.im/post/57f885370bd1d00058b37d74)
- [手把手教你写 Socket 长连接](https://juejin.im/post/5b3649d751882552f052703b)
