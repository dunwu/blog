# Spring 的数据访问策略

Spring 的目标之一，就是允许开发人员在开发过程中能够遵循面向对象（OO）原则中的“针对接口编程”。Spring 对数据访问的支持也不例外。

DAO 是 Data Access Object 的缩写，即数据访问对象。它提供了数据读写到数据库中的一种方式。

Spring 支持 DAO 技术主要目的是：使得切换持久化技术十分方便，如 JDBC、JPA、ORM 等。这样数据访问层仅暴露 DAO 接口，而上层不需要关注具体的持久化技术，达到了解耦的目的。

## Spring 的异常体系

- Spring JDBC不同于JDBC，提供了比较丰富的数据异常类型。
- Spring的数据异常并没有与特定的持久化方式相关联，所以异常对于不同的持久化方式都是一致的。
- Spring的数据异常都继承自 DataAccessException，这种异常是非检查型异常。即，不一定非要捕获Spring所抛出的数据访问异常。

![Spring 异常体系继承树](assets/images/spring-data-exception-tree.jpg)

## 数据访问模板化

Spring 在数据访问过程中，采用了模板方法设计模式。
它将数据访问过程分为两块：模板（template）和回调（callback）。模板管理过程中固定的部分，而回调处理自定义的数据访问代码。
下图中，左边属于模板固定部分，右边属于模板回调部分。
![spring数据访问流程](http://upload-images.jianshu.io/upload_images/3101171-d4b685e27d934b52.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**对于不同的持久化平台，Spring 提供了多个可选的模板。**
![模板类表](http://upload-images.jianshu.io/upload_images/3101171-e98a1fe9635b3f1b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 使用DAO支持类

基于模板-回调设计，Spring 提供了 DAO 支持类，而将业务本身的 DAO 类作为它的子类。

下图展示了模板类、DAO 支持类以及自定义 DAO 实现之间的关系。
![DAO关系图](http://upload-images.jianshu.io/upload_images/3101171-4a9bf6f7ce95428a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Spring不仅提供了多个数据模板实现类，还为每种模板提供了对应的 DAO 支持类。
![DAO支持类表](http://upload-images.jianshu.io/upload_images/3101171-373f10dd0d377aed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
