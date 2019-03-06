---
title: JSTL SQL标签
date: 2017-11-08
categories:
- javaee
tags:
- javaee
- jstl
---

JSTL SQL 标签库提供了与关系型数据库（Oracle，MySQL，SQL Server 等等）进行交互的标签。引用 SQL 标签库的语法如下：

```jsp
<%@ taglib prefix="sql"
           uri="http://java.sun.com/jsp/jstl/sql" %>
```

| 标签                  | 描述                                                                         |
| --------------------- | ---------------------------------------------------------------------------- |
| `<sql:setDataSource>` | 指定数据源                                                                   |
| `<sql:query>`         | 运行 SQL 查询语句                                                            |
| `<sql:update>`        | 运行 SQL 更新语句                                                            |
| `<sql:param>`         | 将 SQL 语句中的参数设为指定值                                                |
| `<sql:dateParam>`     | 将 SQL 语句中的日期参数设为指定的 java.util.Date  对象值                     |
| `<sql:transaction>`   | 在共享数据库连接中提供嵌套的数据库行为元素，将所有语句以一个事务的形式来运行 |

## `<sql:setDataSource>` 标签

`<sql:setDataSource>`标签用来配置数据源或者将数据源信息存储在某作用域的变量中，用来作为其它 JSTL 数据库操作的数据源。

### 语法格式

```jsp
<sql:setDataSource
  var="<string>"
  scope="<string>"
  dataSource="<string>"
  driver="<string>"
  url="<string>"
  user="<string>"
  password="<string>"/>
```

### 属性

`<sql:setDataSource>`标签有如下属性：

| **属性**   | **描述**              | **是否必要** | **默认值** |
| ---------- | --------------------- | ------------ | ---------- |
| driver     | 要注册的 JDBC 驱动    | 否           | 无         |
| url        | 数据库连接的 JDBC URL | 否           | 无         |
| user       | 数据库用户名          | 否           | 无         |
| password   | 数据库密码            | 否           | 无         |
| dataSource | 事先准备好的数据库    | 否           | 无         |
| var        | 代表数据库的变量      | 否           | 默认设置   |
| scope      | var 属性的作用域      | 否           | Page       |

## `<sql:update>` 标签

`<sql:update>`标签用来执行一个没有返回值的 SQL 语句，比如 SQL INSERT，UPDATE，DELETE 语句。

### 语法格式

```jsp
<sql:update var="<string>" scope="<string>" sql="<string>" dataSource="<string>"/>
```

### 属性

`<sql:update>`标签有如下属性：

| **属性**   | **描述**                                     | **是否必要** | **默认值** |
| ---------- | -------------------------------------------- | ------------ | ---------- |
| sql        | 需要执行的 SQL 命令（不返回 ResultSet 对象） | 否           | Body       |
| dataSource | 所使用的数据库连接（覆盖默认值）             | 否           | 默认数据库 |
| var        | 用来存储所影响行数的变量                     | 否           | 无         |
| scope      | var 属性的作用域                             | 否           | Page       |

## `<sql:param>` 标签

`<sql:param>`标签与`<sql:query>`标签和`<sql:update>`标签嵌套使用，用来提供一个值占位符。如果是一个 null 值，则将占位符设为 SQL NULL。

### 语法格式

```jsp
<sql:param value="<string>"/>
```

### 属性

`<sql:param>`标签有如下属性：

| **属性** | **描述**         | **是否必要** | **默认值** |
| -------- | ---------------- | ------------ | ---------- |
| value    | 需要设置的参数值 | 否           | Body       |

## `<sql:dateParam>` 标签

`<sql:dateParam>`标签与`<sql:query>`标签和`<sql:update>`标签嵌套使用，用来提供日期和时间的占位符。如果是一个 null 值，则将占位符设为 SQL NULL。

### 语法格式

```jsp
<sql:dateParam value="<string>" type="<string>"/>
```

### 属性

`<sql:dateParam>`标签有如下属性：

| **属性** | **描述**                                                       | **是否必要** | **默认值** |
| -------- | -------------------------------------------------------------- | ------------ | ---------- |
| value    | 需要设置的日期参数（java.util.Date）                           | 否           | Body       |
| type     | DATE （只有日期），TIME（只有时间）， TIMESTAMP （日期和时间） | 否           | TIMESTAMP  |

## `<sql:transaction>` 标签

`<sql:transaction>`标签用来将`<sql:query>`标签和`<sql:update>`标签封装至事务中。可以将大量的`<sql:query>`和`<sql:update>`操作装入`<sql:transaction>`中，使它们成为单一的事务。

它确保对数据库的修改不是被提交就是被回滚。

### 语法格式

```jsp
<sql:transaction dataSource="<string>" isolation="<string>"/>
```

### 属性

`<sql:transaction>`标签有如下属性：

| **属性**   | **描述**                                                                             | **是否必要** | **默认值** |
| ---------- | ------------------------------------------------------------------------------------ | ------------ | ---------- |
| dataSource | 所使用的数据库（覆盖默认值）                                                         | 否           | 默认数据库 |
| isolation  | 事务隔离等级 （READ_COMMITTED,，READ_UNCOMMITTED， REPEATABLE_READ 或 SERIALIZABLE） | 否           | 数据库默认 |
