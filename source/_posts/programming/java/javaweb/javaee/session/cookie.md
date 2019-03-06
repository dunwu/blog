---
title: JavaEE Cookie
date: 2017-11-08
categories:
- javaee
tags:
- javaee
- cookie
- session
---

由于 Http 是一种无状态的协议，服务器单从网络连接上无从知道客户身份。

会话跟踪是 Web 程序中常用的技术，用来跟踪用户的整个会话。常用会话跟踪技术是 Cookie 与 Session。

## Cookie 是什么？

Cookie 实际上是存储在客户端上的文本信息，并保留了各种跟踪的信息。

**Cookie 工作步骤：**

1.  客户端请求服务器，如果服务器需要记录该用户的状态，就是用 response 向客户端浏览器颁发一个 Cookie。
2.  客户端浏览器会把 Cookie 保存下来。
3.  当浏览器再请求该网站时，浏览器把该请求的网址连同 Cookie 一同提交给服务器。服务器检查该 Cookie，以此来辨认用户状态。

**_注：Cookie 功能需要浏览器的支持，如果浏览器不支持 Cookie 或者 Cookie 禁用了，Cookie 功能就会失效。_**

Java 中把 Cookie 封装成了`javax.servlet.http.Cookie`类。

## Cookie 剖析

Cookies 通常设置在 HTTP 头信息中（虽然 JavaScript 也可以直接在浏览器上设置一个 Cookie）。

设置 Cookie 的 Servlet 会发送如下的头信息：

```
HTTP/1.1 200 OK
Date: Fri, 04 Feb 2000 21:03:38 GMT
Server: Apache/1.3.9 (UNIX) PHP/4.0b3
Set-Cookie: name=xyz; expires=Friday, 04-Feb-07 22:03:38 GMT;
                 path=/; domain=w3cschool.cc
Connection: close
Content-Type: text/html
```

正如您所看到的，`Set-Cookie` 头包含了一个名称值对、一个 GMT 日期、一个路径和一个域。名称和值会被 URL 编码。expires 字段是一个指令，告诉浏览器在给定的时间和日期之后"忘记"该 Cookie。

如果浏览器被配置为存储 Cookies，它将会保留此信息直到到期日期。如果用户的浏览器指向任何匹配该 Cookie 的路径和域的页面，它会重新发送 Cookie 到服务器。浏览器的头信息可能如下所示：

```
GET / HTTP/1.0
Connection: Keep-Alive
User-Agent: Mozilla/4.6 (X11; I; Linux 2.2.6-15apmac ppc)
Host: zink.demon.co.uk:1126
Accept: image/gif, */*
Accept-Encoding: gzip
Accept-Language: en
Accept-Charset: iso-8859-1,*,utf-8
Cookie: name=xyz
```

## Cookie 类中的方法

| 方法                                   | 功能                                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| public void setDomain(String pattern)  | 该方法设置 cookie 适用的域。                                                                                       |
| public String getDomain()              | 该方法获取 cookie 适用的域。                                                                                       |
| public void setMaxAge(int expiry)      | 该方法设置 cookie 过期的时间（以秒为单位）。如果不这样设置，cookie 只会在当前 session 会话中持续有效。             |
| public int getMaxAge()                 | 该方法返回 cookie 的最大生存周期（以秒为单位），默认情况下，-1 表示 cookie 将持续下去，直到浏览器关闭。            |
| public String getName()                | 该方法返回 cookie 的名称。名称在创建后不能改变。                                                                   |
| public void setValue(String newValue)  | 该方法设置与 cookie 关联的值。                                                                                     |
| public String getValue()               | 该方法获取与 cookie 关联的值。                                                                                     |
| public void setPath(String uri)        | 该方法设置 cookie 适用的路径。如果您不指定路径，与当前页面相同目录下的（包括子目录下的）所有 URL 都会返回 cookie。 |
| public String getPath()                | 该方法获取 cookie 适用的路径。                                                                                     |
| public void setSecure(boolean flag)    | 该方法设置布尔值，向浏览器指示，只会在 HTTPS 和 SSL 等安全协议中传输此类 Cookie。                                  |
| public void setComment(String purpose) | 该方法规定了描述 cookie 目的的注释。该注释在浏览器向用户呈现 cookie 时非常有用。                                   |
| public String getComment()             | 该方法返回了描述 cookie 目的的注释，如果 cookie 没有注释则返回 null。                                              |

## Cookie 的有效期

`Cookie`的`maxAge`决定着 Cookie 的有效期，单位为秒。

如果 maxAge 为 0，则表示删除该 Cookie；

如果为负数，表示该 Cookie 仅在本浏览器中以及本窗口打开的子窗口内有效，关闭窗口后该 Cookie 即失效。

Cookie 中提供`getMaxAge()`**和**`setMaxAge(int expiry)`方法来读写`maxAge`属性。

## Cookie 的域名

Cookie 是不可以跨域名的。域名 www.google.com 颁发的 Cookie 不会被提交到域名 www.baidu.com 去。这是由 Cookie 的隐私安全机制决定的。隐私安全机制能够禁止网站非法获取其他网站的 Cookie。

正常情况下，同一个一级域名的两个二级域名之间也不能互相使用 Cookie。如果想让某域名下的子域名也可以使用该 Cookie，需要设置 Cookie 的 domain 参数。

Java 中使用`setDomain(Stringdomain)`和`getDomain()`方法来设置、获取 domain。

## Cookie 的路径

Path 属性决定允许访问 Cookie 的路径。

Java 中使用`setPath(Stringuri)`和`getPath()`方法来设置、获取 path。

## Cookie 的安全属性

HTTP 协议不仅是无状态的，而且是不安全的。

使用 HTTP 协议的数据不经过任何加密就直接在网络上传播，有被截获的可能。如果不希望 Cookie 在 HTTP 等非安全协议中传输，可以设置 Cookie 的 secure 属性为 true。浏览器只会在 HTTPS 和 SSL 等安全协议中传输此类 Cookie。

Java 中使用`setSecure(booleanflag)`和`getSecure ()`方法来设置、获取 Secure。

## 实例

### 添加 Cookie

通过 Servlet 添加 Cookies 包括三个步骤：

1.  创建一个 Cookie 对象：您可以调用带有 cookie 名称和 cookie 值的 Cookie 构造函数，cookie 名称和 cookie 值都是字符串。

2.  设置最大生存周期：您可以使用 `setMaxAge` 方法来指定 cookie 能够保持有效的时间（以秒为单位）。

3.  发送 Cookie 到 HTTP 响应头：您可以使用 `response.addCookie` 来添加 HTTP 响应头中的 Cookies。

AddCookies.java

```java
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/servlet/AddCookies")
public class AddCookies extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public AddCookies() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        // 为名字和姓氏创建 Cookie
        Cookie name = new Cookie("name", URLEncoder.encode(request.getParameter("name"), "UTF-8")); // 中文转码
        Cookie url = new Cookie("url", request.getParameter("url"));

        // 为两个 Cookie 设置过期日期为 24 小时后
        name.setMaxAge(60 * 60 * 24);
        url.setMaxAge(60 * 60 * 24);

        // 在响应头中添加两个 Cookie
        response.addCookie(name);
        response.addCookie(url);

        // 设置响应内容类型
        response.setContentType("text/html;charset=UTF-8");

        PrintWriter out = response.getWriter();
        String title = "设置 Cookie 实例";
        String docType = "<!DOCTYPE html>\n";
        out.println(docType + "<html>\n" + "<head><title>" + title + "</title></head>\n"
                        + "<body bgcolor=\"#f0f0f0\">\n" + "<h1 align=\"center\">" + title
                        + "</h1>\n" + "<ul>\n" + "  <li><b>站点名：</b>：" + request.getParameter("name")
                        + "\n</li>" + "  <li><b>站点 URL：</b>：" + request.getParameter("url")
                        + "\n</li>" + "</ul>\n" + "</body></html>");
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        doGet(request, response);
    }

}
```

addCookies.jsp

```jsp
<%@ page language="java" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
  <meta charset="utf-8">
  <title>添加Cookie</title>
</head>
<body>
<form action=/servlet/AddCookies method="GET">
  站点名 ：<input type="text" name="name">
  <br/>
  站点 URL：<input type="text" name="url"/><br>
  <input type="submit" value="提交"/>
</form>
</body>
</html>
```

### 显示 Cookie

要读取 Cookies，您需要通过调用 `HttpServletRequest` 的 `getCookies()` 方法创建一个 `javax.servlet.http.Cookie` 对象的数组。然后循环遍历数组，并使用 `getName()` 和 `getValue()` 方法来访问每个 cookie 和关联的值。

ReadCookies.java

```java
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/servlet/ReadCookies")
public class ReadCookies extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public ReadCookies() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        Cookie cookie = null;
        Cookie[] cookies = null;
        // 获取与该域相关的 Cookie 的数组
        cookies = request.getCookies();

        // 设置响应内容类型
        response.setContentType("text/html;charset=UTF-8");

        PrintWriter out = response.getWriter();
        String title = "Delete Cookie Example";
        String docType = "<!DOCTYPE html>\n";
        out.println(docType + "<html>\n" + "<head><title>" + title + "</title></head>\n"
                        + "<body bgcolor=\"#f0f0f0\">\n");
        if (cookies != null) {
            out.println("<h2>Cookie 名称和值</h2>");
            for (int i = 0; i < cookies.length; i++) {
                cookie = cookies[i];
                if ((cookie.getName()).compareTo("name") == 0) {
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                    out.print("已删除的 cookie：" + cookie.getName() + "<br/>");
                }
                out.print("名称：" + cookie.getName() + "，");
                out.print("值：" + URLDecoder.decode(cookie.getValue(), "utf-8") + " <br/>");
            }
        } else {
            out.println("<h2 class=\"tutheader\">No Cookie founds</h2>");
        }
        out.println("</body>");
        out.println("</html>");
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        doGet(request, response);
    }

}
```

### 删除 Cookie

Java 中并没有提供直接删除 Cookie 的方法，如果想要删除一个 Cookie，直接将这个 Cookie 的有效期设为 0 就可以了。步骤如下：

1.  读取一个现有的 cookie，并把它存储在 Cookie 对象中。

2.  使用 `setMaxAge()` 方法设置 cookie 的年龄为零，来删除现有的 cookie。

3.  把这个 cookie 添加到响应头。

DeleteCookies.java

```java
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/servlet/DeleteCookies")
public class DeleteCookies extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public DeleteCookies() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        Cookie cookie = null;
        Cookie[] cookies = null;
        // 获取与该域相关的 Cookie 的数组
        cookies = request.getCookies();

        // 设置响应内容类型
        response.setContentType("text/html;charset=UTF-8");

        PrintWriter out = response.getWriter();
        String title = "删除 Cookie 实例";
        String docType = "<!DOCTYPE html>\n";
        out.println(docType + "<html>\n" + "<head><title>" + title + "</title></head>\n"
                        + "<body bgcolor=\"#f0f0f0\">\n");
        if (cookies != null) {
            out.println("<h2>Cookie 名称和值</h2>");
            for (int i = 0; i < cookies.length; i++) {
                cookie = cookies[i];
                if ((cookie.getName()).compareTo("url") == 0) {
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                    out.print("已删除的 cookie：" + cookie.getName() + "<br/>");
                }
                out.print("名称：" + cookie.getName() + "，");
                out.print("值：" + cookie.getValue() + " <br/>");
            }
        } else {
            out.println("<h2 class=\"tutheader\">No Cookie founds</h2>");
        }
        out.println("</body>");
        out.println("</html>");
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        doGet(request, response);
    }

}
```
