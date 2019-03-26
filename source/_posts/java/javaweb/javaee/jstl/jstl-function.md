---
title: JSTL 函数
date: 2017-11-08
categories:
- javaee
tags:
- javaee
- jstl
---

JSTL 包含一系列标准函数，大部分是通用的字符串处理函数。引用 JSTL 函数库的语法如下：

```jsp
<%@ taglib prefix="fn"
           uri="http://java.sun.com/jsp/jstl/functions" %>
```

| 函数                                                                                       | 描述                                                     |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| [fn:contains()](http://www.runoob.com/jsp/jstl-function-contains.html)                     | 测试输入的字符串是否包含指定的子串                       |
| [fn:containsIgnoreCase()](http://www.runoob.com/jsp/jstl-function-containsignoreCase.html) | 测试输入的字符串是否包含指定的子串，大小写不敏感         |
| [fn:endsWith()](http://www.runoob.com/jsp/jstl-function-endswith.html)                     | 测试输入的字符串是否以指定的后缀结尾                     |
| [fn:escapeXml()](http://www.runoob.com/jsp/jstl-function-escapexml.html)                   | 跳过可以作为 XML 标记的字符                              |
| [fn:indexOf()](http://www.runoob.com/jsp/jstl-function-indexof.html)                       | 返回指定字符串在输入字符串中出现的位置                   |
| [fn:join()](http://www.runoob.com/jsp/jstl-function-join.html)                             | 将数组中的元素合成一个字符串然后输出                     |
| [fn:length()](http://www.runoob.com/jsp/jstl-function-length.html)                         | 返回字符串长度                                           |
| [fn:replace()](http://www.runoob.com/jsp/jstl-function-replace.html)                       | 将输入字符串中指定的位置替换为指定的字符串然后返回       |
| [fn:split()](http://www.runoob.com/jsp/jstl-function-split.html)                           | 将字符串用指定的分隔符分隔然后组成一个子字符串数组并返回 |
| [fn:startsWith()](http://www.runoob.com/jsp/jstl-function-startswith.html)                 | 测试输入字符串是否以指定的前缀开始                       |
| [fn:substring()](http://www.runoob.com/jsp/jstl-function-substring.html)                   | 返回字符串的子集                                         |
| [fn:substringAfter()](http://www.runoob.com/jsp/jstl-function-substringafter.html)         | 返回字符串在指定子串之后的子集                           |
| [fn:substringBefore()](http://www.runoob.com/jsp/jstl-function-substringbefore.html)       | 返回字符串在指定子串之前的子集                           |
| [fn:toLowerCase()](http://www.runoob.com/jsp/jstl-function-tolowercase.html)               | 将字符串中的字符转为小写                                 |
| [fn:toUpperCase()](http://www.runoob.com/jsp/jstl-function-touppercase.html)               | 将字符串中的字符转为大写                                 |
| [fn:trim()](http://www.runoob.com/jsp/jstl-function-trim.html)                             | 移除首位的空白符                                         |
