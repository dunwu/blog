---
title: SpringMVC 简介
date: 2017/11/08
categories:
- spring
tags:
- spring
- web
- mvc
---

## SpringMVC 工作流程描述

Spring MVC的工作流程可以用一幅图来说明：
![Paste_Image.png](http://oyz7npk35.bkt.clouddn.com/image/spring/web/spring-dispatcher-servlet.png)

1. 向服务器发送HTTP请求，请求被前端控制器 `DispatcherServlet` 捕获。
2. `DispatcherServlet` 根据 **<servlet-name>-servlet.xml** 中的配置对请求的URL进行解析，得到请求资源标识符（URI）。然后根据该URI，调用 `HandlerMapping` 获得该Handler配置的所有相关的对象（包括Handler对象以及Handler对象对应的拦截器），最后以`HandlerExecutionChain` 对象的形式返回。
3. `DispatcherServlet` 根据获得的`Handler`，选择一个合适的 `HandlerAdapter`。（附注：如果成功获得`HandlerAdapter`后，此时将开始执行拦截器的preHandler(...)方法）。
4. 提取`Request`中的模型数据，填充`Handler`入参，开始执行`Handler`（`Controller`)。 在填充`Handler`的入参过程中，根据你的配置，Spring将帮你做一些额外的工作：
   - HttpMessageConveter： 将请求消息（如Json、xml等数据）转换成一个对象，将对象转换为指定的响应信息。
   - 数据转换：对请求消息进行数据转换。如`String`转换成`Integer`、`Double`等。
   - 数据根式化：对请求消息进行数据格式化。 如将字符串转换成格式化数字或格式化日期等。
   - 数据验证： 验证数据的有效性（长度、格式等），验证结果存储到`BindingResult`或`Error`中。
5. Handler(Controller)执行完成后，向 `DispatcherServlet` 返回一个 `ModelAndView` 对象；
6. 根据返回的`ModelAndView`，选择一个适合的 `ViewResolver`（必须是已经注册到Spring容器中的`ViewResolver`)返回给`DispatcherServlet`。
7. `ViewResolver` 结合`Model`和`View`，来渲染视图。
8. 视图负责将渲染结果返回给客户端。
