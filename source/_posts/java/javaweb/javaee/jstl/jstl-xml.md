---
title: JSTL XML标签
date: 2017-11-08
categories:
- javaee
tags:
- javaee
- jstl
---

JSTL XML 标签库提供了创建和操作 XML 文档的标签。引用 XML 标签库的语法如下：

```jsp
<%@ taglib prefix="x"
           uri="http://java.sun.com/jsp/jstl/xml" %>
```

在使用 xml 标签前，你必须将 XML 和 XPath 的相关包拷贝至你的`<Tomcat 安装目录>\lib`下:

- **XercesImpl.jar**下载地址： [http://www.apache.org/dist/xerces/j/](http://www.apache.org/dist/xerces/j/)

- **xalan.jar**下载地址： [http://xml.apache.org/xalan-j/index.html](http://xml.apache.org/xalan-j/index.html)

| 标签            | 描述                                                        |
| --------------- | ----------------------------------------------------------- |
| `<x:out>`       | 与`<%= ... >`,类似，不过只用于 XPath 表达式                 |
| `<x:parse>`     | 解析 XML 数据                                               |
| `<x:set>`       | 设置 XPath 表达式                                           |
| `<x:if>`        | 判断 XPath 表达式，若为真，则执行本体中的内容，否则跳过本体 |
| `<x:forEach>`   | 迭代 XML 文档中的节点                                       |
| `<x:choose>`    | `<x:when>`和`<x:otherwise>`的父标签                         |
| `<x:when>`      | `<x:choose>`的子标签，用来进行条件判断                      |
| `<x:otherwise>` | `<x:choose>`的子标签，当`<x:when>`判断为 false 时被执行     |
| `<x:transform>` | 将 XSL 转换应用在 XML 文档中                                |
| `<x:param>`     | 与`<x:transform>`共同使用，用于设置 XSL 样式表              |

## `<x:out>` 标签

`<x:out>`标签显示 XPath 表达式的结果，与`<%= %>`功能相似。

### 语法格式

```jsp
<x:out select="<string>" escapeXml="<true|false>"/>
```

### 属性

`<x:out>`标签有如下属性：

| **属性**  | **描述**                                     | **是否必要** | **默认值** |
| --------- | -------------------------------------------- | ------------ | ---------- |
| select    | 需要计算的 XPath 表达式，通常使用 XPath 变量 | 是           | 无         |
| escapeXml | 是否忽略 XML 特殊字符                        | 否           | true       |

## `<x:parse>` 标签

`<x:parse>`标签用来解析属性中或标签主体中的 XML 数据。

### 语法格式

```jsp
<x:parse
  var="<string>"
  varDom="<string>"
  scope="<string>"
  scopeDom="<string>"
  doc="<string>"
  systemId="<string>"
  filter="<string>"/>
```

### 属性

`<x:parse>`标签有如下属性：

| **属性** | **描述**                                     | **是否必要** | **默认值** |
| -------- | -------------------------------------------- | ------------ | ---------- |
| var      | 包含已解析 XML 数据的变量                    | 否           | 无         |
| xml      | 需要解析的文档的文本内容（String 或 Reader） | 否           | Body       |
| systemId | 系统标识符 URI，用来解析文档                 | 否           | 无         |
| filter   | 应用于源文档的过滤器                         | 否           | 无         |
| doc      | 需要解析的 XML 文档                          | 否           | Page       |
| scope    | var 属性的作用域                             | 否           | Page       |
| varDom   | 包含已解析 XML 数据的变量                    | 否           | Page       |
| scopeDom | varDom 属性的作用域                          | 否           | Page       |

## `<x:set>` 标签

`<x:set>`标签为 XPath 表达式的值设置一个变量。

如果 XPath 表达式的值是 boolean 类型，则`<x:set>`将会设置一个 java.lang.Boolean 对象，若是字符串，则设置一个 java.lang.String 对象，若是数字，则设置一个 java.lang.Number 对象。

### 语法格式

```jsp
<x:set var="<string>" select="<string>" scope="<string>"/>
```

### 属性

`<x:set>`标签有如下属性：

| **属性** | **描述**                  | **是否必要** | **默认值** |
| -------- | ------------------------- | ------------ | ---------- |
| var      | 代表 XPath 表达式值得变量 | 是           | Body       |
| select   | 需要计算的 XPath 表达式   | 否           | 无         |
| scope    | var 属性的作用域          | 否           | Page       |

## `<x:if>` 标签

`<x:if>`标签用于判断一个 XPath 表达式的值，若为真，则执行其主体中的内容，若为假则其主体的内容将会被忽略。

### 语法格式

```jsp
<x:if
  select="<string>"
  var="<string>"
  scope="<string>">
   ...
</x:if>
```

### 属性

`<x:if>`标签有如下属性：

| **属性** | **描述**                | **是否必要** | **默认值** |
| -------- | ----------------------- | ------------ | ---------- |
| select   | 需要计算的 XPath 表达式 | 是           | 无         |
| var      | 存储条件结果的变量      | 否           | 无         |
| scope    | var 属性的作用域        | 否           | Page       |

## `<x:forEach>` 标签

`<x:forEach>`标签用来循环遍历 XML 文档的节点。

### 语法格式

```jsp
<x:forEach
   var="<string>"
   select="<string>"
   begin="`<int>`"
   end="`<int>`"
   step="`<int>`"
   varStatus="<string>">
```

### 属性

`<x:forEach>`标签有如下属性：

| **属性**  | **描述**                     | **是否必要** | **默认值** |
| --------- | ---------------------------- | ------------ | ---------- |
| select    | 需要计算的 XPath 表达式      | 是           | 无         |
| var       | 用于存储当前项目的变量       | 否           | 无         |
| begin     | 迭代器的开始索引             | 否           | 无         |
| end       | 迭代器的结束索引             | 否           | 无         |
| step      | 迭代的步长                   | 否           | 无         |
| varStatus | 代表迭代器所存储的状态的变量 | 否           | 无         |

## `<x:choose>`, `<x:when>`, `<x:otherwise>` 标签

`<x:choose>`标签与 Java switch 语句有相同的功能。switch 语句有 case 语句，而`<x:choose>`标签有`<x:when>`标签。switch 语句有 default 语句，而`<x:choose>`标签有`<x:otherwise>`标签。

### 语法格式

```jsp
<x:choose>
 <x:when select="<string>">
     ...
 </x:when>
 <x:when select="<string>">
     ...
 </x:when>
     ...
     ...
 <x:otherwise>
     ...
 </x:otherwise>
</x:choose>`
```

### 属性

- `<x:choose>`没有属性。
- `<x:when>`的属性在下表中给出。
- `<x:otherwise>`没有属性。

`<x:when>`标签的属性：

| **属性** | **描述** | **是否必要** | **默认值** |
| -------- | -------- | ------------ | ---------- |
| select   | 条件     | 是           | 无         |

## `<x:transform>` 标签

`<x:transform>`标签在 XML 文档中应用 XSL。

### 语法格式

```jsp
<x:transform
   var="<string>"
   scope="<string>"
   result="<string>"
   doc="<string>"
   docSystemId="<string>"
   xslt="<string>"
   xsltSystemId="<string>"/>
```

### 属性

`<x:transform>`标签有如下属性：

| **属性**     | **描述**                    | **是否必要** | **默认值**    |
| ------------ | --------------------------- | ------------ | ------------- |
| doc          | 源 XML 文档                 | 否           | Body          |
| docSystemId  | 源 XML 文档的 URI           | 否           | 无            |
| xslt         | XSLT 样式表                 | 是           | 无            |
| xsltSystemId | 源 XSLT 文档的 URI          | 否           | 无            |
| result       | 接收转换结果的对象          | 否           | Print to page |
| var          | 代表被转换的 XML 文档的变量 | 否           | Print to page |
| scope        | var 属性的作用域            | 否           | 无            |

## `<x:param>` 标签

`<x:param>`标签与`<x:transform>`标签一同使用，用于设置 XSLT 样式表的参数。

### 语法格式

```jsp
<x:param name="<string>" value="<string>"/>
```

### 属性

`<x:param>`标签有如下属性：

| **属性** | **描述**        | **是否必要** | **默认值** |
| -------- | --------------- | ------------ | ---------- |
| name     | XSLT 参数的名称 | 是           | Body       |
| value    | XSLT 参数的值   | 否           | 无         |
