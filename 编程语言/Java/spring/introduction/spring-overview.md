---
title: Spring 概述
date: 2017/11/08
categories:
- spring
tags:
- spring
- introduction
---

> Spring 是最受欢迎的企业级 Java 应用程序开发框架。
>
> Spring 框架是一个开源的 Java 平台。
>
> 当谈论到大小和透明度时， Spring 是轻量级的。 Spring 框架的基础版本是在 2 MB 左右的。
>
> Spring 框架的核心特性可以用于开发任何 Java 应用程序，但是在 Java EE 平台上构建 web 应用程序是需要扩展的。 Spring 框架的目标是使 J2EE 开发变得更容易使用，通过启用基于 POJO 编程模型来促进良好的编程实践。
>

## 为什么使用 Spring

下面列出的是使用 Spring 框架主要的好处：

- Spring 可以使开发人员使用 POJOs 开发企业级的应用程序。只使用 POJOs 的好处是你不需要一个 EJB 容器产品，比如一个应用程序服务器，但是你可以选择使用一个健壮的 servlet 容器，比如 Tomcat 或者一些商业产品。
- Spring 在一个单元模式中是有组织的。即使包和类的数量非常大，你只需要选择你需要的部分，而忽略剩余的那部分。
- Spring 不会让你白费力气做重复工作，它真正的利用了一些现有的技术，像几个 ORM 框架、日志框架、JEE、Quartz 和 JDK 计时器，其他视图技术。
- 测试一个用 Spring 编写的应用程序很容易，因为 environment-dependent 代码被放进了这个框架中。此外，通过使用 JavaBean-style POJOs，它在使用依赖注入注入测试数据时变得更容易。
- Spring 的 web 框架是一个设计良好的 web MVC 框架，它为 web 框架，比如 Structs 或者其他工程上的或者很少受欢迎的 web 框架，提供了一个很好的供替代的选择。
- 为将特定技术的异常（例如，由 JDBC、Hibernate，或者 JDO 抛出的异常）翻译成一致的， Spring 提供了一个方便的 API，而这些都是未经检验的异常。
- 轻量级的 IOC 容器往往是轻量级的，例如，特别是当与 EJB 容器相比的时候。这有利于在内存和 CPU 资源有限的计算机上开发和部署应用程序。
- Spring 提供了一个一致的事务管理界面，该界面可以缩小成一个本地事务（例如，使用一个单一的数据库）和扩展成一个全局事务（例如，使用 JTA）。

## 核心思想

Spring最核心的两个技术思想是：IoC 和 Aop

### IoC

`IoC` 即 `Inversion of Control` ，意为控制反转。

Spring 最认同的技术是控制反转的**依赖注入（DI）**模式。控制反转（IoC）是一个通用的概念，它可以用许多不同的方式去表达，依赖注入仅仅是控制反转的一个具体的例子。

当编写一个复杂的 Java 应用程序时，应用程序类应该尽可能的独立于其他的 Java 类来增加这些类可重用可能性，当进行单元测试时，可以使它们独立于其他类进行测试。依赖注入（或者有时被称为配线）有助于将这些类粘合在一起，并且在同一时间让它们保持独立。

到底什么是依赖注入？让我们将这两个词分开来看一看。这里将依赖关系部分转化为两个类之间的关联。例如，类 A 依赖于类 B。现在，让我们看一看第二部分，注入。所有这一切都意味着类 B 将通过 IoC 被注入到类 A 中。

依赖注入可以以向构造函数传递参数的方式发生，或者通过使用 setter 方法 post-construction。由于依赖注入是 Spring 框架的核心部分，所以我将在一个单独的章节中利用很好的例子去解释这一概念。

### Aop

Spring 框架的一个关键组件是**面向方面的程序设计（AOP）**框架。一个程序中跨越多个点的功能被称为**横切关注点**，这些横切关注点在概念上独立于应用程序的业务逻辑。有各种各样常见的很好的关于方面的例子，比如日志记录、声明性事务、安全性，和缓存等等。

在 OOP 中模块化的关键单元是类，而在 AOP 中模块化的关键单元是方面。AOP 帮助你将横切关注点从它们所影响的对象中分离出来，然而依赖注入帮助你将你的应用程序对象从彼此中分离出来。

Spring 框架的 AOP 模块提供了面向方面的程序设计实现，允许你定义拦截器方法和切入点，可以实现将应该被分开的代码干净的分开功能。我将在一个独立的章节中讨论更多关于 Spring AOP 的概念。

## Spring体系结构

Spring当前框架有**20**个jar包，大致可以分为**6**大模块:

- Core Container
- AOP and Instrumentation
- Messaging
- Data Access/Integration
- Web
- Test

Spring框架提供了非常丰富的功能，因此整个架构也很庞大。
在我们实际的应用开发中，并不一定要使用所有的功能，而是可以根据需要选择合适的Spring模块。
![Paste_Image.png](http://oyz7npk35.bkt.clouddn.com/image/spring/introduction/spring-framework.png)

### Core Container

IoC容器是Spring框架的核心。spring容器使用依赖注入管理构成应用的组件，它会创建相互协作的组件之间的关联。毫无疑问，这些对象更简单干净，更容易理解，也更容易重用和测试。
Spring自带了几种容器的实现，可归纳为两种类型：

#### BeanFactory

由org.springframework.beans.factory.BeanFactory接口定义。
它是最简单的容器，提供基本的DI支持。 

#### ApplicationContext

由org.springframework.context.ApplicationContext接口定义。
它是基于BeanFactory 之上构建，并提供面向应用的服务，例如从属性文件解析文本信息的能力，以及发布应用事件给感兴趣的事件监听者的能力。 
***注：Bean工厂对于大多数应用来说往往太低级了，所以应用上下文使用更广泛。推荐在开发中使用应用上下文容器。***

Spring自带了多种应用上下文，最可能遇到的有以下几种：
`ClassPathXmlApplicationContext`：从类路径下的XML配置文件中加载上下文定义，把应用上下文定义文件当做类资源。
`FileSystemXmlApplicationContext`：读取文件系统下的XML配置文件并加载上下文定义。
`XmlWebApplicationContext`：读取Web应用下的XML配置文件并装载上下文定义。

***范例***
```java
ApplicationContext context = new FileSystemXmlApplicationContext("D:\Temp\build.xml");
ApplicationContext context2 = new ClassPathXmlApplicationContext("build.xml");
```
可以看到，加载 `FileSystemXmlApplicationContext` 和 `ClassPathXmlApplicationContext` 十分相似。
差异在于：前者在指定文件系统路径下查找build.xml文件；而后在所有类路径（包含JAR文件）下查找build.xml文件。
通过引用应用上下文，可以很方便的调用 getBean() 方法从 Spring 容器中获取 Bean。 

**相关jar包**

- `spring-core`, `spring-beans`, 提供框架的基础部分，包括IoC和依赖注入特性。

- `spring-context`, 在`spring-core`, `spring-beans`基础上构建。它提供一种框架式的访问对象的方法。它也支持类似Java EE特性，例如：EJB，JMX和基本remoting。ApplicationContext接口是它的聚焦点。
- `springcontext-support`, 集成第三方库到Spring application context。
- `spring-expression`，提供一种强有力的表达语言在运行时来查询和操纵一个对象图。

### AOP and Instrumentation

**相关jar包**

- `spring-aop`，提供了对面向切面编程的丰富支持。
- `spring-aspects`，提供了对AspectJ的集成。
- `spring-instrument`，提供了对类instrumentation的支持和类加载器。
- `spring-instrument-tomcat`，包含了Spring对Tomcat的instrumentation代理。

### Messaging

**相关jar包**

- `spring-messaging`，包含spring的消息处理功能，如Message，MessageChannel，MessageHandler。

### Data Access / Integaration

Data Access/Integration层包含了JDBC / ORM / OXM / JMS和Transaction模块。

**相关jar包**

- `spring-jdbc`，提供了一个JDBC抽象层。

- `spring-tx`，支持编程和声明式事务管理类。
- `spring-orm`，提供了流行的对象关系型映射API集，如JPA，JDO，Hibernate。
- `spring-oxm`，提供了一个抽象层以支持对象/XML 映射的实现，如JAXB，Castor，XMLBeans，JiBX 和 XStream.
- `spring-jms`，包含了生产和消费消息的功能。

### Web

**相关jar包**

- `spring-web`，提供了基本的面向web的功能，如多文件上传、使用Servlet监听器的Ioc容器的初始化。一个面向web的应用层上下文。

- `spring-webmvc`，包括MVC和REST web服务实现。
- `spring-webmvc-portlet`，提供在Protlet环境的MVC实现和`spring-webmvc`功能的镜像。

### Test

**相关jar包**

- `spring-test`，以Junit和TestNG来支持spring组件的单元测试和集成测试。

## 术语

- **应用程序**：是能完成我们所需要功能的成品，比如购物网站、OA系统。
- **框架**：是能完成一定功能的半成品，比如我们可以使用框架进行购物网站开发；框架做一部分功能，我们自己做一部分功能，这样应用程序就创建出来了。而且框架规定了你在开发应用程序时的整体架构，提供了一些基础功能，还规定了类和对象的如何创建、如何协作等，从而简化我们开发，让我们专注于业务逻辑开发。
- **非侵入式设计**：从框架角度可以这样理解，无需继承框架提供的类，这种设计就可以看作是非侵入式设计，如果继承了这些框架类，就是侵入设计，如果以后想更换框架之前写过的代码几乎无法重用，如果非侵入式设计则之前写过的代码仍然可以继续使用。
- **轻量级及重量级**：轻量级是相对于重量级而言的，轻量级一般就是非入侵性的、所依赖的东西非常少、资源占用非常少、部署简单等等，其实就是比较容易使用，而重量级正好相反。
- **POJO**：POJO（Plain Old Java Objects）简单的Java对象，它可以包含业务逻辑或持久化逻辑，但不担当任何特殊角色且不继承或不实现任何其它Java框架的类或接口。
- **容器**：在日常生活中容器就是一种盛放东西的器具，从程序设计角度看就是装对象的的对象，因为存在放入、拿出等操作，所以容器还要管理对象的生命周期。
- **控制反转：**即Inversion of Control，缩写为IoC，控制反转还有一个名字叫做依赖注入（Dependency Injection），就是由容器控制程序之间的关系，而非传统实现中，由程序代码直接操控。
- **JavaBean**：一般指容器管理对象，在Spring中指Spring IoC容器管理对象。
