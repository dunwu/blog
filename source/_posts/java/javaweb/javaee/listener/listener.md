---
title: JavaEE 监听器
date: 2017-11-08
categories:
- javaee
tags:
- javaee
- listener
---

监听器是一个专门用于对其他对象身上发生的事件或状态改变进行监听和相应处理的对象，当被监视的对象发生情况时，立即采取相应的行动。监听器其实就是一个实现特定接口的普通 java 程序，这个程序专门用于监听另一个 java 对象的方法调用或属性改变，当被监听对象发生上述事件后，监听器某个方法立即被执行。

## 概述

JavaWeb 中的监听器是 Servlet 规范中定义的一种特殊类，它用于监听 web 应用程序中的`ServletContext`, `HttpSession`和 `ServletRequest`等域对象的创建与销毁事件，以及监听这些域对象中的属性发生修改的事件。

## 监听器的分类

在 Servlet 规范中定义了多种类型的监听器，它们用于监听的事件源分别为`ServletContext`，`HttpSession`和`ServletRequest`这三个域对象
Servlet 规范针对这三个对象上的操作，又把多种类型的监听器划分为三种类型：

1.  监听域对象自身的创建和销毁的事件监听器。
2.  监听域对象中的属性的增加和删除的事件监听器。
3.  监听绑定到 HttpSession 域中的某个对象的状态的事件监听器。

### 监听对象的创建和销毁

#### HttpSessionListener

`HttpSessionListener` 接口用于监听`HttpSession`对象的创建和销毁

创建一个`Session`时，激发`sessionCreated (HttpSessionEvent se)` 方法

销毁一个`Session`时，激发`sessionDestroyed (HttpSessionEvent se)` 方法。

#### ServletContextListener

`ServletContextListener`接口用于监听`ServletContext`对象的创建和销毁事件。

实现了`ServletContextListener`接口的类都可以对`ServletContext`对象的创建和销毁进行监听。

当`ServletContext`对象被创建时，激发`contextInitialized (ServletContextEvent sce)`方法。

当`ServletContext`对象被销毁时，激发`contextDestroyed(ServletContextEvent sce)`方法。

`ServletContext`域对象创建和销毁时机：

- 创建：服务器启动针对每一个 Web 应用创建`ServletContext`
- 销毁：服务器关闭前先关闭代表每一个 web 应用的`ServletContext`

#### ServletRequestListener

`ServletRequestListener`接口用于监听`ServletRequest` 对象的创建和销毁

`Request`对象被创建时，监听器的`requestInitialized(ServletRequestEvent sre)`方法将会被调用

`Request`对象被销毁时，监听器的`requestDestroyed(ServletRequestEvent sre)`方法将会被调用

`ServletRequest`域对象创建和销毁时机：

创建：用户每一次访问都会创建 request 对象

销毁：当前访问结束，request 对象就会销毁

### 监听对象的属性变化

域对象中属性的变更的事件监听器就是用来监听 ServletContext, HttpSession, HttpServletRequest 这三个对象中的属性变更信息事件的监听器。
这三个监听器接口分别是 ServletContextAttributeListener, HttpSessionAttributeListener 和 ServletRequestAttributeListener，这三个接口中都定义了三个方法来处理被监听对象中的属性的增加，删除和替换的事件，同一个事件在这三个接口中对应的方法名称完全相同，只是接受的参数类型不同。

#### attributeAdded 方法

当向被监听对象中增加一个属性时，web 容器就调用事件监听器的`attributeAdded`方法进行响应，这个方法接收一个事件类型的参数，监听器可以通过这个参数来获得正在增加属性的域对象和被保存到域中的属性对象
各个域属性监听器中的完整语法定义为：

```java
public void attributeAdded(ServletContextAttributeEvent scae)
public void attributeReplaced(HttpSessionBindingEvent  hsbe)
public void attributeRmoved(ServletRequestAttributeEvent srae)
```

#### attributeRemoved 方法

当删除被监听对象中的一个属性时，web 容器调用事件监听器的`attributeRemoved`方法进行响应
各个域属性监听器中的完整语法定义为：

```java
public void attributeRemoved(ServletContextAttributeEvent scae)
public void attributeRemoved (HttpSessionBindingEvent  hsbe)
public void attributeRemoved (ServletRequestAttributeEvent srae)
```

#### attributeReplaced 方法

当监听器的域对象中的某个属性被替换时，web 容器调用事件监听器的`attributeReplaced`方法进行响应
各个域属性监听器中的完整语法定义为：

```java
public void attributeReplaced(ServletContextAttributeEvent scae)
public void attributeReplaced (HttpSessionBindingEvent  hsbe)
public void attributeReplaced (ServletRequestAttributeEvent srae)
```

### 监听 Session 内的对象

保存在 Session 域中的对象可以有多种状态：

- 绑定(session.setAttribute("bean",Object))到 Session 中；
- 从 Session 域中解除(session.removeAttribute("bean"))绑定；
- 随 Session 对象持久化到一个存储设备中；
- 随 Session 对象从一个存储设备中恢复

Servlet 规范中定义了两个特殊的监听器接口`HttpSessionBindingListener`和`HttpSessionActivationListener`来帮助 JavaBean 对象了解自己在 Session 域中的这些状态。

实现这两个接口的类不需要 web.xml 文件中进行注册。

#### HttpSessionBindingListener

实现了`HttpSessionBindingListener`接口的 JavaBean 对象可以感知自己被绑定到 Session 中和 Session 中删除的事件。

- 当对象被绑定到`HttpSession`对象中时，web 服务器调用该对象的`valueBound(HttpSessionBindingEvent event)`方法。

- 当对象从`HttpSession`对象中解除绑定时，web 服务器调用该对象的`valueUnbound(HttpSessionBindingEvent event)`方法。

#### HttpSessionActivationListener

实现了`HttpSessionActivationListener`接口的 JavaBean 对象可以感知自己被活化(反序列化)和钝化(序列化)的事件。

当绑定到 HttpSession 对象中的 javabean 对象将要随 HttpSession 对象被钝化(序列化)之前，web 服务器调用该 javabean 对象的`sessionWillPassivate(HttpSessionEvent event)` 方法。这样 javabean 对象就可以知道自己将要和 HttpSession 对象一起被序列化(钝化)到硬盘中.

当绑定到 HttpSession 对象中的 javabean 对象将要随 HttpSession 对象被活化(反序列化)之后，web 服务器调用该 javabean 对象的`sessionDidActive(HttpSessionEvent event)`方法。这样 javabean 对象就可以知道自己将要和 HttpSession 对象一起被反序列化(活化)回到内存中
