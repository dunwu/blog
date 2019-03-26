---
title: JavaEE Cookie vs. Session
date: 2017-11-08
categories:
- javaee
tags:
- javaee
- cookie
- session
---

## 存取方式

Cookie 只能保存`ASCII`字符串，如果需要存取 Unicode 字符或二进制数据，需要进行`UTF-8`、`GBK`或`BASE64`等方式的编码。

Session 可以存取任何类型的数据，甚至是任何 Java 类。可以将 Session 看成是一个 Java 容器类。

## 隐私安全

Cookie 存于客户端浏览器，一些客户端的程序可能会窥探、复制或修改 Cookie 内容。

Session 存于服务器，对客户端是透明的，不存在敏感信息泄露的危险。

## 有效期

使用 Cookie 可以保证长时间登录有效，只要设置 Cookie 的`maxAge`属性为一个很大的数字。

而 Session 虽然理论上也可以通过设置很大的数值来保持长时间登录有效，但是，由于 Session 依赖于名为`JESSIONID`的 Cookie，而 Cookie `JESSIONID`的`maxAge`默认为-1，只要关闭了浏览器该 Session 就会失效，因此，Session 不能实现信息永久有效的效果。使用 URL 地址重写也不能实现。

## 服务器的开销

由于 Session 是保存在服务器的，每个用户都会产生一个 Session，如果并发访问的用户非常多，会产生很多的 Session，消耗大量的内存。

而 Cookie 由于保存在客户端浏览器上，所以不占用服务器资源。

## 浏览器的支持

Cookie 需要浏览器支持才能使用。

如果浏览器不支持 Cookie，需要使用 Session 以及 URL 地址重写。

需要注意的事所有的用到 Session 程序的 URL 都要使用`response.encodeURL(StringURL)` 或`response.encodeRediretURL(String URL)`进行 URL 地址重写，否则导致 Session 会话跟踪失效。

## 跨域名

Cookie 支持跨域名。

Session 不支持跨域名。
