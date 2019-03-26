---
title: JSTL 格式化标签
date: 2017-11-08
categories:
- javaee
tags:
- javaee
- jstl
---

JSTL 格式化标签用来格式化并输出文本、日期、时间、数字。引用格式化标签库的语法如下：

```jsp
<%@ taglib prefix="fmt"
           uri="http://java.sun.com/jsp/jstl/fmt" %>
```

| 标签                    | 描述                                     |
| ----------------------- | ---------------------------------------- |
| `<fmt:formatNumber>`    | 使用指定的格式或精度格式化数字           |
| `<fmt:parseNumber>`     | 解析一个代表着数字，货币或百分比的字符串 |
| `<fmt:formatDate>`      | 使用指定的风格或模式格式化日期和时间     |
| `<fmt:parseDate>`       | 解析一个代表着日期或时间的字符串         |
| `<fmt:bundle>`          | 绑定资源                                 |
| `<fmt:setLocale>`       | 指定地区                                 |
| `<fmt:setBundle>`       | 绑定资源                                 |
| `<fmt:timeZone>`        | 指定时区                                 |
| `<fmt:setTimeZone>`     | 指定时区                                 |
| `<fmt:message>`         | 显示资源配置文件信息                     |
| `<fmt:requestEncoding>` | 设置 request 的字符编码                  |

## `<fmt:formatNumber>`标签

`<fmt:formatNumber>`标签用于格式化数字，百分比，货币。

### 语法格式

```jsp
<fmt:formatNumber
  value="<string>"
  type="<string>"
  pattern="<string>"
  currencyCode="<string>"
  currencySymbol="<string>"
  groupingUsed="<string>"
  maxIntegerDigits="<string>"
  minIntegerDigits="<string>"
  maxFractionDigits="<string>"
  minFractionDigits="<string>"
  var="<string>"
  scope="<string>"/>
```

### 属性

`<fmt:formatNumber>`标签有如下属性：

| **属性**          | **描述**                           | **是否必要** | **默认值**     |
| ----------------- | ---------------------------------- | ------------ | -------------- |
| value             | 要显示的数字                       | 是           | 无             |
| type              | NUMBER，CURRENCY，或 PERCENT 类型  | 否           | Number         |
| pattern           | 指定一个自定义的格式化模式用与输出 | 否           | 无             |
| currencyCode      | 货币码（当 type="currency"时）     | 否           | 取决于默认区域 |
| currencySymbol    | 货币符号 (当 type="currency"时)    | 否           | 取决于默认区域 |
| groupingUsed      | 是否对数字分组 (TRUE 或 FALSE)     | 否           | true           |
| maxIntegerDigits  | 整型数最大的位数                   | 否           | 无             |
| minIntegerDigits  | 整型数最小的位数                   | 否           | 无             |
| maxFractionDigits | 小数点后最大的位数                 | 否           | 无             |
| minFractionDigits | 小数点后最小的位数                 | 否           | 无             |
| var               | 存储格式化数字的变量               | 否           | Print to page  |
| scope             | var 属性的作用域                   | 否           | page           |

如果`type`属性为 percent 或 number，那么您就可以使用其它几个格式化数字属性。

`maxIntegerDigits`属性和`minIntegerDigits`属性允许您指定整数的长度。若实际数字超过了`maxIntegerDigits`所指定的最大值，则数字将会被截断。

有一些属性允许您指定小数点后的位数。`minFractionalDigits`属性和`maxFractionalDigits`属性允许您指定小数点后的位数。若实际的数字超出了所指定的范围，则这个数字会被截断。

数字分组可以用来在每三个数字中插入一个逗号。`groupingIsUsed`属性用来指定是否使用数字分组。当与`minIntegerDigits`属性一同使用时，就必须要很小心地来获取预期的结果了。

您或许会使用`pattern`属性。这个属性可以让您在对数字编码时包含指定的字符。接下来的表格中列出了这些字符。

| **符号** | **描述**                         |
| -------- | -------------------------------- |
| 0        | 代表一位数字                     |
| E        | 使用指数格式                     |
| #        | 代表一位数字，若没有则显示 0     |
| .        | 小数点                           |
| ,        | 数字分组分隔符                   |
| ;        | 分隔格式                         |
| -        | 使用默认负数前缀                 |
| %        | 百分数                           |
| ?        | 千分数                           |
| ¤        | 货币符号，使用实际的货币符号代替 |
| X        | 指定可以作为前缀或后缀的字符     |
| '        | 在前缀或后缀中引用特殊字符       |

## `<fmt:parseNumber>` 标签

`<fmt:parseNumber>`标签用来解析数字，百分数，货币。

### 语法格式

```jsp
<fmt:parseNumber
  value="<string>"
  type="<string>"
  pattern="<string>"
  parseLocale="<string>"
  integerOnly="<string>"
  var="<string>"
  scope="<string>"/>
```

### 属性

`<fmt:parseNumber>`标签有如下属性：

| **属性**    | **描述**                                  | **是否必要** | **默认值**    |
| ----------- | ----------------------------------------- | ------------ | ------------- |
| value       | 要解析的数字                              | 否           | Body          |
| type        | NUMBER,，CURRENCY，或 PERCENT             | 否           | number        |
| parseLocale | 解析数字时所用的区域                      | 否           | 默认区域      |
| integerOnly | 是否只解析整型数（true）或浮点数（false） | 否           | false         |
| pattern     | 自定义解析模式                            | 否           | 无            |
| timeZone    | 要显示的日期的时区                        | 否           | 默认时区      |
| var         | 存储待解析数字的变量                      | 否           | Print to page |
| scope       | var 属性的作用域                          | 否           | page          |

`pattern`属性与`<fmt:formatNumber>`标签中的`pattern`有相同的作用。在解析时，`pattern`属性告诉解析器期望的格式。

## `<fmt:formatDate>` 标签

`<fmt:formatDate>`标签用于使用不同的方式格式化日期。

### 语法格式

```jsp
<fmt:formatDate
  value="<string>"
  type="<string>"
  dateStyle="<string>"
  timeStyle="<string>"
  pattern="<string>"
  timeZone="<string>"
  var="<string>"
  scope="<string>"/>
```

### 属性

`<fmt:formatDate>`标签有如下属性：

| 属性      | 描述                                  | 是否必要 | 默认值     |
| --------- | ------------------------------------- | -------- | ---------- |
| value     | 要显示的日期                          | 是       | 无         |
| type      | DATE, TIME, 或 BOTH                   | 否       | date       |
| dateStyle | FULL, LONG, MEDIUM, SHORT, 或 DEFAULT | 否       | default    |
| timeStyle | FULL, LONG, MEDIUM, SHORT, 或 DEFAULT | 否       | default    |
| pattern   | 自定义格式模式                        | 否       | 无         |
| timeZone  | 显示日期的时区                        | 否       | 默认时区   |
| var       | 存储格式化日期的变量名                | 否       | 显示在页面 |
| scope     | 存储格式化日志变量的范围              | 否       | 页面       |

`<fmt:formatDate>` 标签格式模式

| 代码 | 描述                                                                      | 实例                       |
| ---- | ------------------------------------------------------------------------- | -------------------------- |
| G    | 时代标志                                                                  | AD                         |
| y    | 不包含纪元的年份。如果不包含纪元的年份小于 10，则显示不具有前导零的年份。 | 2002                       |
| M    | 月份数字。一位数的月份没有前导零。                                        | April & 04                 |
| d    | 月中的某一天。一位数的日期没有前导零。                                    | 20                         |
| h    | 12 小时制的小时。一位数的小时数没有前导零。                               | 12                         |
| H    | 24 小时制的小时。一位数的小时数没有前导零。                               | 0                          |
| m    | 分钟。一位数的分钟数没有前导零。                                          | 45                         |
| s    | 秒。一位数的秒数没有前导零。                                              | 52                         |
| S    | 毫秒                                                                      | 970                        |
| E    | 周几                                                                      | Tuesday                    |
| D    | 一年中的第几天                                                            | 180                        |
| F    | 一个月中的第几个周几                                                      | 2 (一个月中的第二个星期三) |
| w    | 一年中的第几周 r                                                          | 27                         |
| W    | 一个月中的第几周                                                          | 2                          |
| a    | a.m./p.m. 指示符                                                          | PM                         |
| k    | 小时(12 小时制的小时)                                                     | 24                         |
| K    | 小时(24 小时制的小时)                                                     | 0                          |
| z    | 时区                                                                      | 中部标准时间               |
| '    |                                                                           | 转义文本                   |
| ''   |                                                                           | 单引号                     |

## `<fmt:parseDate>` 标签

`<fmt:parseDate>` 标签用于解析日期。

### 语法格式

```jsp
<fmt:parseDate
   value="<string>"
   type="<string>"
   dateStyle="<string>"
   timeStyle="<string>"
   pattern="<string>"
   timeZone="<string>"
   parseLocale="<string>"
   var="<string>"
   scope="<string>"/>
```

### 属性

`<fmt:parseDate>`标签有如下属性：

| 属性      | 描述                                  | 是否必要 | 默认值     |
| --------- | ------------------------------------- | -------- | ---------- |
| value     | 要显示的日期                          | 是       | 无         |
| type      | DATE, TIME, 或 BOTH                   | 否       | date       |
| dateStyle | FULL, LONG, MEDIUM, SHORT, 或 DEFAULT | 否       | default    |
| timeStyle | FULL, LONG, MEDIUM, SHORT, 或 DEFAULT | 否       | default    |
| pattern   | 自定义格式模式                        | 否       | 无         |
| timeZone  | 显示日期的时区                        | 否       | 默认时区   |
| var       | 存储格式化日期的变量名                | 否       | 显示在页面 |
| scope     | 存储格式化日志变量的范围              | 否       | 页面       |

属性设置我们需要的输出的时间格式。

## `<fmt:bundle>` 标签

`<fmt:bundle>`标签将指定的资源束对出现在`<fmt:bundle>`标签中的`<fmt:message>`标签可用。这可以使您省去为每个`<fmt:message>`标签指定资源束的很多步骤。

举例来说，下面的两个`<fmt:bundle>`块将产生同样的输出：

```jsp
<fmt:bundle basename="com.tutorialspoint.Example">
    <fmt:message key="count.one"/>
</fmt:bundle>

<fmt:bundle basename="com.tutorialspoint.Example" prefix="count.">
    <fmt:message key="title"/>
</fmt:bundle>
```

### 语法格式

```jsp
<fmt:bundle baseName="<string>" prefix="<string>"/>
```

### 属性

`<fmt:bundle>`标签有如下属性：

| **属性** | **描述**                               | **是否必要** | **默认值** |
| -------- | -------------------------------------- | ------------ | ---------- |
| basename | 指定被载入的资源束的基础名称           | 是           | 无         |
| prefix   | 指定`<fmt:message>`标签 key 属性的前缀 | 否           | 无         |

## `<fmt:setLocale>` 标签

`<fmt:setLocale>`标签用来将给定的区域存储在 locale 配置变量中。

### 语法格式

```jsp
<fmt:setLocale value="<string>" variant="<string>" scope="<string>"/>
```

### 属性

`<fmt:setLocale>`标签有如下属性：

| **属性** | **描述**                              | **是否必要** | **默认值** |
| -------- | ------------------------------------- | ------------ | ---------- |
| value    | 指定 ISO-639 语言码和 ISO-3166 国家码 | 是           | en_US      |
| variant  | 特定浏览器变体                        | 否           | 无         |
| scope    | Locale 配置变量的作用域               | 否           | Page       |

## `<fmt:timeZone>` 标签

`<fmt:timeZone>`标签用来指定时区，供其它标签使用。

### 语法格式

```jsp
<fmt:setLocale value="<string>" variant="<string>" scope="<string>"/>
```

### 属性

`<fmt:timeZone>`标签有如下属性：

| **属性** | **描述** | **是否必要** | **默认值** |
| -------- | -------- | ------------ | ---------- |
| value    | 时区     | 是           | 无         |

## `<fmt:setTimeZone>` 标签

`<fmt:setTimeZone>`标签用来复制一个时区对象至指定的作用域。

### 语法格式

```jsp
<fmt:setTimeZone value="<string>" var="<string>" scope="<string>"/>
```

### 属性

`<fmt:setTimeZone>`标签有如下属性：

| **属性** | **描述**           | **是否必要** | **默认值**      |
| -------- | ------------------ | ------------ | --------------- |
| value    | 时区               | 是           | 无              |
| var      | 存储新时区的变量名 | 否           | Replace default |
| scope    | 变量的作用域       | 否           | Page            |

## `<fmt:message>` 标签

`<fmt:message>`标签映射一个关键字给局部消息，然后执行参数替换。

### 语法格式

```jsp
<fmt:message
   key="<string>"
   bundle="<string>"
   var="<string>"
   scope="<string>"/>
```

### 属性

`<fmt:message>`标签有如下属性：

| **属性** | **描述**             | **是否必要** | **默认值**    |
| -------- | -------------------- | ------------ | ------------- |
| key      | 要检索的消息关键字   | 否           | Body          |
| bundle   | 要使用的资源束       | 否           | 默认资源束    |
| var      | 存储局部消息的变量名 | 否           | Print to page |
| scope    | var 属性的作用域     | 否           | Page          |

## `<fmt:requestEncoding>` 标签

`<fmt:requestEncoding>`标签用来指定返回给 Web 应用程序的表单编码类型。

### 语法格式

```jsp
<fmt:requestEncoding value="<string>"/>
```

### 属性

`<fmt:requestEncoding>`标签有如下属性：

| **属性** | **描述**                                | **是否必要** | **默认值** |
| -------- | --------------------------------------- | ------------ | ---------- |
| key      | 字符编码集的名称，用于解码 request 参数 | 是           | 无         |

使用`<fmt:requestEncoding>`标签来指定字符集，用于解码来自表单的数据。在字符集不是 ISO-8859-1 时必须使用这个标签。由于大多数浏览器在它们的请求中不包含 Content-Type 头，所以需要这个标签。

`<fmt:requestEncoding>`标签的目的就是用来指定请求的 Content-Type。您必须指定一个 Content-Type，就算 response 是通过 Page 指令的 contentType 属性来编码。这是因为 response 的实际区域可能与 Page 指令所指定的不同。

如果页面包含 I18N-capable 格式行为用于设置 response 的 locale 属性（通过调用 ServletResponse.setLocale()方法），任何在页面中指定的编码集将会被覆盖。
