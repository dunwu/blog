---
title: JavaEE Session
date: 2017-11-08
categories:
- javaee
tags:
- javaee
- session
---

## Session 是什么？

不同于 Cookie 保存在客户端浏览器中，Session 保存在服务器上。

如果说 Cookie 机制是通过检查客户身上的“通行证”来确定客户身份的话，那么 Session 机制就是通过检查服务器上的“客户明细表”来确认客户身份。

Session 对应的类为 `javax.servlet.http.HttpSession` 类。Session 对象是在客户第一次请求服务器时创建的。

## Session 类中的方法

`javax.servlet.http.HttpSession` 类中的方法：

| **方法**                                            | **功能**                                                                                                                  |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| public Object getAttribute(String name)             | 该方法返回在该 session 会话中具有指定名称的对象，如果没有指定名称的对象，则返回 null。                                    |
| public Enumeration getAttributeNames()              | 该方法返回 String 对象的枚举，String 对象包含所有绑定到该 session 会话的对象的名称。                                      |
| public long getCreationTime()                       | 该方法返回该 session 会话被创建的时间，自格林尼治标准时间 1970 年 1 月 1 日午夜算起，以毫秒为单位。                       |
| public String getId()                               | 该方法返回一个包含分配给该 session 会话的唯一标识符的字符串。                                                             |
| public long getLastAccessedTime()                   | 该方法返回客户端最后一次发送与该 session 会话相关的请求的时间自格林尼治标准时间 1970 年 1 月 1 日午夜算起，以毫秒为单位。 |
| public int getMaxInactiveInterval()                 | 该方法返回 Servlet 容器在客户端访问时保持 session 会话打开的最大时间间隔，以秒为单位。                                    |
| public void invalidate()                            | 该方法指示该 session 会话无效，并解除绑定到它上面的任何对象。                                                             |
| public boolean isNew()                              | 如果客户端还不知道该 session 会话，或者如果客户选择不参入该 session 会话，则该方法返回 true。                             |
| public void removeAttribute(String name)            | 该方法将从该 session 会话移除指定名称的对象。                                                                             |
| public void setAttribute(String name, Object value) | 该方法使用指定的名称绑定一个对象到该 session 会话。                                                                       |
| public void setMaxInactiveInterval(int interval)    | 该方法在 Servlet 容器指示该 session 会话无效之前，指定客户端请求之间的时间，以秒为单位。                                  |

## Session 的有效期

由于会有越来越多的用户访问服务器，因此 Session 也会越来越多。为防止内存溢出，服务器会把长时间没有活跃的 Session 从内存中删除。

Session 的超时时间为`maxInactiveInterval`属性，可以通过`getMaxInactiveInterval()`、`setMaxInactiveInterval(longinterval)`来读写这个属性。

Tomcat 中 Session 的默认超时时间为 20 分钟。可以修改 web.xml 改变 Session 的默认超时时间。

例：

```xml
<session-config>
  <session-timeout>60</session-timeout>
</session-config>
```

## Session 对浏览器的要求

HTTP 协议是无状态的，Session 不能依据 HTTP 连接来判断是否为同一客户。因此服务器向客户端浏览器发送一个名为 JESSIONID 的 Cookie，他的值为该 Session 的 id（也就是 HttpSession.getId()的返回值）。Session 依据该 Cookie 来识别是否为同一用户。

该 Cookie 为服务器自动生成的，它的`maxAge`属性一般为-1，表示仅当前浏览器内有效，并且各浏览器窗口间不共享，关闭浏览器就会失效。

## URL 地址重写

URL 地址重写的原理是将该用户 Session 的 id 信息重写到 URL 地址中。服务器能够解析重写后的 URL 获取 Session 的 id。这样即使客户端不支持 Cookie，也可以使用 Session 来记录用户状态。

`HttpServletResponse`类提供了`encodeURL(Stringurl)`实现 URL 地址重写。

## Session 中禁用 Cookie

在`META-INF/context.xml`中编辑如下：

```xml
<Context path="/SessionNotes" cookies="true">
</Context>
```

部署后，TOMCAT 便不会自动生成名 JESSIONID 的 Cookie，Session 也不会以 Cookie 为识别标志，而仅仅以重写后的 URL 地址为识别标志了。

## 实例

### Session 跟踪

SessionTrackServlet.java

```java
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/servlet/SessionTrackServlet")
public class SessionTrackServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        // 如果不存在 session 会话，则创建一个 session 对象
        HttpSession session = request.getSession(true);
        // 获取 session 创建时间
        Date createTime = new Date(session.getCreationTime());
        // 获取该网页的最后一次访问时间
        Date lastAccessTime = new Date(session.getLastAccessedTime());

        // 设置日期输出的格式
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        String title = "Servlet Session 实例";
        Integer visitCount = new Integer(0);
        String visitCountKey = new String("visitCount");
        String userIDKey = new String("userID");
        String userID = new String("admin");

        // 检查网页上是否有新的访问者
        if (session.isNew()) {
            session.setAttribute(userIDKey, userID);
        } else {
            visitCount = (Integer) session.getAttribute(visitCountKey);
            visitCount = visitCount + 1;
            userID = (String) session.getAttribute(userIDKey);
        }
        session.setAttribute(visitCountKey, visitCount);

        // 设置响应内容类型
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        String docType = "<!DOCTYPE html>\n";
        out.println(docType + "<html>\n" + "<head><title>" + title + "</title></head>\n"
                        + "<body bgcolor=\"#f0f0f0\">\n" + "<h1 align=\"center\">" + title
                        + "</h1>\n" + "<h2 align=\"center\">Session 信息</h2>\n"
                        + "<table border=\"1\" align=\"center\">\n" + "<tr bgcolor=\"#949494\">\n"
                        + "  <th>Session 信息</th><th>值</th></tr>\n" + "<tr>\n" + "  <td>id</td>\n"
                        + "  <td>" + session.getId() + "</td></tr>\n" + "<tr>\n"
                        + "  <td>创建时间</td>\n" + "  <td>" + df.format(createTime) + "  </td></tr>\n"
                        + "<tr>\n" + "  <td>最后访问时间</td>\n" + "  <td>" + df.format(lastAccessTime)
                        + "  </td></tr>\n" + "<tr>\n" + "  <td>用户 ID</td>\n" + "  <td>" + userID
                        + "  </td></tr>\n" + "<tr>\n" + "  <td>访问统计：</td>\n" + "  <td>" + visitCount
                        + "</td></tr>\n" + "</table>\n" + "</body></html>");
    }
}
```

web.xml

```xml
<servlet>
	<servlet-name>SessionTrackServlet</servlet-name>
	<servlet-class>SessionTrackServlet</servlet-class>
</servlet>
<servlet-mapping>
	<servlet-name>SessionTrackServlet</servlet-name>
	<url-pattern>/servlet/SessionTrackServlet</url-pattern>
</servlet-mapping>
```

### 删除 Session 会话数据

当您完成了一个用户的 session 会话数据，您有以下几种选择：

**移除一个特定的属性：**您可以调用  `removeAttribute(String name)` 方法来删除与特定的键相关联的值。

**删除整个 session 会话：**您可以调用  `invalidate()`  方法来丢弃整个 session 会话。

**设置 session 会话过期时间：**您可以调用 `setMaxInactiveInterval(int interval)`  方法来单独设置 session 会话超时。

**注销用户：**如果使用的是支持 servlet 2.4 的服务器，您可以调用  `logout`  来注销 Web 服务器的客户端，并把属于所有用户的所有 session 会话设置为无效。

**web.xml 配置：**如果您使用的是 Tomcat，除了上述方法，您还可以在 web.xml 文件中配置 session 会话超时，如下所示：

```xml
<session-config>
  <session-timeout>15</session-timeout>
</session-config>
```

上面实例中的超时时间是以分钟为单位，将覆盖 Tomcat 中默认的 30 分钟超时时间。

在一个 Servlet 中的 `getMaxInactiveInterval()` 方法会返回 session 会话的超时时间，以秒为单位。所以，如果在 web.xml 中配置 session 会话超时时间为 15 分钟，那么`getMaxInactiveInterval()` 会返回 900。
