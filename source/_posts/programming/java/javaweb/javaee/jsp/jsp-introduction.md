---
title: JSP 概述
date: 2017-11-08
categories:
- javaee
tags:
- javaee
- jsp
---

## 什么是 Java Server Pages?

`JSP`全称`Java Server Pages`，是一种动态网页开发技术。

它使用 JSP 标签在 HTML 网页中插入 Java 代码。标签通常以`<%`开头以`%>`结束。

JSP 是一种 Java servlet，主要用于实现 Java web 应用程序的用户界面部分。网页开发者们通过结合 HTML 代码、XHTML 代码、XML 元素以及嵌入 JSP 操作和命令来编写 JSP。

JSP 通过网页表单获取用户输入数据、访问数据库及其他数据源，然后动态地创建网页。

JSP 标签有多种功能，比如访问数据库、记录用户选择信息、访问 JavaBeans 组件等，还可以在不同的网页中传递控制信息和共享信息。

## 为什么使用 JSP？

JSP 也是一种 Servlet，因此 JSP 能够完成 Servlet 能完成的任何工作。

JSP 程序与 CGI 程序有着相似的功能，但和 CGI 程序相比，JSP 程序有如下优势：

- 性能更加优越，因为 JSP 可以直接在 HTML 网页中动态嵌入元素而不需要单独引用 CGI 文件。
- 服务器调用的是已经编译好的 JSP 文件，而不像 CGI/Perl 那样必须先载入解释器和目标脚本。
- JSP 基于 Java Servlets API，因此，JSP 拥有各种强大的企业级 Java API，包括 JDBC，JNDI，EJB，JAXP 等等。
- JSP 页面可以与处理业务逻辑的 servlets 一起使用，这种模式被 Java servlet 模板引擎所支持。

最后，JSP 是 Java EE 不可或缺的一部分，是一个完整的企业级应用平台。这意味着 JSP 可以用最简单的方式来实现最复杂的应用。

## JSP 的优势

以下列出了使用 JSP 带来的其他好处：

- 与 ASP 相比：JSP 有两大优势。首先，动态部分用 Java 编写，而不是 VB 或其他 MS 专用语言，所以更加强大与易用。第二点就是 JSP 易于移植到非 MS 平台上。
- 与纯 Servlets 相比：JSP 可以很方便的编写或者修改 HTML 网页而不用去面对大量的 println 语句。
- 与 SSI 相比：SSI 无法使用表单数据、无法进行数据库链接。
- 与 JavaScript 相比：虽然 JavaScript 可以在客户端动态生成 HTML，但是很难与服务器交互，因此不能提供复杂的服务，比如访问数据库和图像处理等等。
- 与静态 HTML 相比：静态 HTML 不包含动态信息。

# JSP 工作原理

**JSP 是一种 Servlet**，但工作方式和 Servlet 有所差别。

Servlet 是先将源代码编译为 class 文件后部署到服务器下的，**先编译后部署**。

Jsp 是先将源代码部署到服务器再编译，**先部署后编译**。

Jsp 会在客户端第一次请求 Jsp 文件时被编译为 HttpJspPage 类（Servlet 的一个子类）。该类会被服务器临时存放在服务器工作目录里。所以，第一次请求 Jsp 后，访问速度会变快就是这个道理。

## JSP 工作流程

网络服务器需要一个 JSP 引擎，也就是一个容器来处理 JSP 页面。容器负责截获对 JSP 页面的请求。本教程使用内嵌 JSP 容器的 Apache 来支持 JSP 开发。

JSP 容器与 Web 服务器协同合作，为 JSP 的正常运行提供必要的运行环境和其他服务，并且能够正确识别专属于 JSP 网页的特殊元素。

下图显示了 JSP 容器和 JSP 文件在 Web 应用中所处的位置。

<br><div align="center"><img src="http://www.runoob.com/wp-content/uploads/2014/01/jsp-arch.jpg"/></div><br>

### 工作步骤

以下步骤表明了 Web 服务器是如何使用 JSP 来创建网页的：

- 就像其他普通的网页一样，您的浏览器发送一个 HTTP 请求给服务器。
- Web 服务器识别出这是一个对 JSP 网页的请求，并且将该请求传递给 JSP 引擎。通过使用 URL 或者.jsp 文件来完成。
- JSP 引擎从磁盘中载入 JSP 文件，然后将它们转化为 servlet。这种转化只是简单地将所有模板文本改用 println()语句，并且将所有的 JSP 元素转化成 Java 代码。
- JSP 引擎将 servlet 编译成可执行类，并且将原始请求传递给 servlet 引擎。
- Web 服务器的某组件将会调用 servlet 引擎，然后载入并执行 servlet 类。在执行过程中，servlet 产生 HTML 格式的输出并将其内嵌于 HTTP response 中上交给 Web 服务器。
- Web 服务器以静态 HTML 网页的形式将 HTTP response 返回到您的浏览器中。
- 最终，Web 浏览器处理 HTTP response 中动态产生的 HTML 网页，就好像在处理静态网页一样。

以上提及到的步骤可以用下图来表示：

一般情况下，JSP 引擎会检查 JSP 文件对应的 servlet 是否已经存在，并且检查 JSP 文件的修改日期是否早于 servlet。如果 JSP 文件的修改日期早于对应的 servlet，那么容器就可以确定 JSP 文件没有被修改过并且 servlet 有效。这使得整个流程与其他脚本语言（比如 PHP）相比要高效快捷一些。

# JSP  生命周期

理解 JSP 底层功能的关键就是去理解它们所遵守的生命周期。

JSP 生命周期就是从创建到销毁的整个过程，类似于 servlet 生命周期，区别在于 JSP 生命周期还包括将 JSP 文件编译成 servlet。

以下是 JSP 生命周期中所走过的几个阶段：

- **编译阶段：**servlet 容器编译 servlet 源文件，生成 servlet 类
- **初始化阶段：**加载与 JSP 对应的 servlet 类，创建其实例，并调用它的初始化方法
- **执行阶段：**调用与 JSP 对应的 servlet 实例的服务方法
- **销毁阶段：**调用与 JSP 对应的 servlet 实例的销毁方法，然后销毁 servlet 实例

很明显，JSP 生命周期的四个主要阶段和 servlet 生命周期非常相似，下面给出图示：

<br><div align="center"><img src="http://www.runoob.com/wp-content/uploads/2014/01/jsp_life_cycle.jpg"/></div><br>

## JSP 编译

当浏览器请求 JSP 页面时，JSP 引擎会首先去检查是否需要编译这个文件。如果这个文件没有被编译过，或者在上次编译后被更改过，则编译这个 JSP 文件。

编译的过程包括三个步骤：

- 解析 JSP 文件。
- 将 JSP 文件转为 servlet。
- 编译 servlet。

## JSP 初始化

容器载入 JSP 文件后，它会在为请求提供任何服务前调用 jspInit()方法。如果您需要执行自定义的 JSP 初始化任务，复写 jspInit()方法就行了，就像下面这样：

```
public void jspInit(){
  // 初始化代码
}
```

一般来讲程序只初始化一次，servlet 也是如此。通常情况下您可以在 jspInit()方法中初始化数据库连接、打开文件和创建查询表。

## JSP 执行

这一阶段描述了 JSP 生命周期中一切与请求相关的交互行为，直到被销毁。

当 JSP 网页完成初始化后，JSP 引擎将会调用\_jspService()方法。

\_jspService()方法需要一个 HttpServletRequest 对象和一个 HttpServletResponse 对象作为它的参数，就像下面这样：

```
void _jspService(HttpServletRequest request,
                 HttpServletResponse response)
{
   // 服务端处理代码
}
```

\_jspService()方法在每个 request 中被调用一次并且负责产生与之相对应的 response，并且它还负责产生所有 7 个 HTTP 方法的回应，比如 GET、POST、DELETE 等等。

## JSP 清理

JSP 生命周期的销毁阶段描述了当一个 JSP 网页从容器中被移除时所发生的一切。

jspDestroy()方法在 JSP 中等价于 servlet 中的销毁方法。当您需要执行任何清理工作时复写 jspDestroy()方法，比如释放数据库连接或者关闭文件夹等等。

jspDestroy()方法的格式如下：

```
public void jspDestroy()
{
   // 清理代码
}
```
