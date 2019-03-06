---
title: Html 快速入门
date: 2019-03-06
---

# Html 快速入门

> 超文本标记语言（英语：HyperText Markup Language，简称：HTML）是一种用于创建网页的标准标记语言。
>
> 关键词： `标签`, `元素`, `属性`

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/front/html/html5.jpg"/></div><br>

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [什么是 HTML？](#什么是-html)
    - [HTML 文档 = 网页](#html-文档--网页)
    - [HTML 结构](#html-结构)
    - [HTML 标签](#html-标签)
    - [HTML 元素](#html-元素)
    - [HTML 属性](#html-属性)
- [Quickstart](#quickstart)
    - [基础](#基础)
    - [样式](#样式)
    - [链接、锚点、图片](#链接锚点图片)
    - [列表](#列表)
    - [表单](#表单)
    - [表格](#表格)
    - [区块](#区块)
    - [框架](#框架)
- [Html 基础](#html-基础)
    - [标题](#标题)
    - [段落](#段落)
    - [链接](#链接)
    - [图像](#图像)
    - [水平线](#水平线)
    - [换行](#换行)
    - [注释](#注释)
- [FAQ](#faq)
    - [中文编码](#中文编码)
    - [html 和 htm](#html-和-htm)
    - [HTML 忽略空格和换行](#html-忽略空格和换行)
- [更多内容](#更多内容)

<!-- /TOC -->

## 简介

### 什么是 HTML？

HTML 是用来描述网页的一种语言。

- HTML 指的是超文本标记语言: Hypertext Markup Language
- HTML 不是一种编程语言，而是一种**标记**语言
- 标记语言是一套**标记标签** (markup tag)
- HTML 使用标记标签来**描述**网页
- HTML 文档包含了 HTML**标签**及**文本**内容
- HTML 文档也叫做 **web 页面**

### HTML 文档 = 网页

- HTML 文档**描述网页**
- HTML 文档**包含 HTML 标签**和纯文本
- HTML 文档也被称为**网页**

Web 浏览器的作用是读取 HTML 文档，并以网页的形式显示出它们。浏览器不会显示 HTML 标签，而是使用标签来解释页面的内容。

### HTML 结构

#### 文档类型声明

`<!doctype html>` 声明为 HTML5 文档。

`<!DOCTYPE>` 声明有助于浏览器中正确显示网页。

网络上有很多不同的文件，如果能够正确声明 HTML 的版本，浏览器就能正确显示网页内容。

doctype 声明是不区分大小写的，以下方式均可：

```html
<!DOCTYPE html>
<!DOCTYPE HTML>
<!doctype html>
<!Doctype Html>
```

**通用声明**

- **HTML5**

```html
<!DOCTYPE html>
```

- **HTML 4.01**

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
```

- **XHTML 1.0**

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

#### html 元素

`<html>` 元素是 HTML 页面的根元素。

#### head 元素

`<head>` 元素包含了文档的元（meta）数据。

#### body 元素

`<body>` 元素包含了可见的页面内容。

```html
<!doctype html>
<html>
<head>
<title>页面标题</title>
</head>
<body>
<h1>这是一个标题</h1>
<p>这是一个段落。</p>
</body>
</html>
```

### HTML 标签

HTML 标记标签通常被称为 HTML 标签 (HTML tag)。

- HTML 标签是由**尖括号**包围的关键词，比如 `<html>`
- HTML 标签通常是**成对出现**的，比如 `<b>` 和 `</b>`
- 标签对中的第一个标签是**开始标签**，第二个标签是**结束标签**
- 开始和结束标签也被称为**开放标签**和**闭合标签**

```
<标签>内容</标签>
```

### HTML 元素

"HTML 标签" 和 "HTML 元素" 通常都是描述同样的意思.

但是严格来讲, 一个 HTML 元素包含了开始标签与结束标签，如下实例:

HTML 元素:

```html
<p>这是一个段落。</p>
```

### HTML 属性

- HTML 元素可以设置**属性**

- 属性可以在元素中添加**附加信息**

- 属性一般描述于**开始标签**

- 属性总是以名称/值对的形式出现，**比如：name="value"**。

- 属性和属性值对大小写不敏感。

  不过，万维网联盟在其 HTML 4 推荐标准中推荐小写的属性/属性值。

  而新版本的 (X)HTML 要求使用小写属性。

#### HTML 属性常用引用属性值

属性值应该始终被包括在引号内。

双引号是最常用的，不过使用单引号也没有问题。

**提示:**  在某些个别的情况下，比如属性值本身就含有双引号，那么您必须使用单引号，例如：`name='John "ShotGun" Nelson'`

#### 常用属性

下面列出了适用于大多数 HTML 元素的属性：

| 属性  | 描述                                                            |
| ----- | --------------------------------------------------------------- |
| class | 为 html 元素定义一个或多个类名（classname）(类名从样式文件引入) |
| id    | 定义元素的唯一 id                                               |
| style | 规定元素的行内样式（inline style）                              |
| title | 描述了元素的额外信息 (作为工具条使用)                           |

## Quickstart

### 基础

```html
<!DOCTYPE html>
<html>
<head>
<title>这是文章标题</title>
</head>
<body>
<!-- 这是注释 -->
<h1>这是标题 1</h1>
<h2>这是标题 2</h2>
<h3>这是标题 3</h3>
<h4>这是标题 4</h4>
<h5>这是标题 5</h5>
<h6>这是标题 6</h6>
<p>这是段落</p>
<br> <!-- 这是换行 -->
<hr> <!-- 这是分割线 -->
</body>
</html>
```

### 样式

```html
<b>粗体文本</b>
<i>斜体文本</i>
<u>下划线文本</u>
<em>定义着重文字</em><br />
<strong>定义加重语气</strong><br />
<ins>定义插入字</ins><br />
<sub>定义删除字</sub><br />
<sub>上标</sub>
<sup>下标</sup>

<!-- 计算机样式 -->
<pre>预格式文本</pre>
<code>一段电脑代码</code>
<dfn>定义项目</dfn>
<kbd>键盘输入</kbd>
<samp>计算机样本</samp>
<var>变量</var>

<!-- 特殊含义的样式 -->
<address>
  Written by <a href="mailto:webmaster@example.com">Jon Doe</a>.<br>
  Visit us at:<br>
  Example.com<br>
  Box 564, Disneyland<br>
  USA
</address>

<!-- 该段落文字从左到右显示 -->
<bdo dir="rtl">该段落文字从右到左显示</bdo>

<!-- 长的引用语 -->
<blockquote cite="http://www.worldwildlife.org/who/index.html">
  For 50 years, WWF has been protecting the future of nature. The world's leading conservation organization, WWF works
  in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.
</blockquote>

<!-- 短的引用语 -->
WWF's goal is to: <q>Build a future where people live in harmony with nature.</q>

<!-- 定义引用、引证 -->
<p><cite>The Scream</cite> by Edward Munch. Painted in 1893.</p>
<dfn>定义项目</dfn>
```

### 链接、锚点、图片

```html
<a href="http://www.example.com/">This is a Link</a>
<a href="http://www.example.com/"><img src="URL" alt="Alternate Text"></a>
<a href="mailto:webmaster@example.com">Send e-mail</a>A named anchor:
<a name="tips">Useful Tips Section</a>
<a href="#tips">Jump to the Useful Tips Section</a>
```

### 列表

```html
<!-- 无序列表 -->
<ul>
<li>First item</li>
<li>Next item</li>
</ul>

<!-- 有序列表 -->
<ol>
<li>First item</li>
<li>Next item</li>
</ol>

<!-- 自定义列表 -->
<dl>
<dt>First term</dt>
<dd>Definition</dd>
<dt>Next term</dt>
<dd>Definition</dd>
</dl>
```

### 表单

```html
<form action="http://www.example.com/test.asp" method="post/get">
<input type="text" name="lastname"
value="Nixon" size="30" maxlength="50">
<input type="password">
<input type="checkbox" checked="checked">
<input type="radio" checked="checked">
<input type="submit">
<input type="reset">
<input type="hidden">
<select>
<option>Apples
<option selected>Bananas
<option>Cherries
</select>
<textarea name="Comment" rows="60" cols="20"></textarea>
</form>
```

### 表格

```html
<table border="1">
  <caption>Monthly Savings</caption>
  <colgroup>
    <col span="1" style="background-color:#dcdcdc">
    <col style="background-color:#00bfff">
  </colgroup>
  <thead>
  <tr>
    <th>Month</th>
    <th>Savings</th>
  </tr>
  </thead>
  <tfoot>
  <tr>
    <td>Sum</td>
    <td>$180</td>
  </tr>
  </tfoot>
  <tbody>
  <tr>
    <td>January</td>
    <td>$100</td>
  </tr>
  <tr>
    <td>February</td>
    <td>$80</td>
  </tr>
  </tbody>
</table>
```

### 区块

```html
<div style="color:#0000FF">
  <h3>这是一个在 div 元素中的标题。</h3>
  <p>这是一个在 div 元素中的文本。</p>
</div>

<p><span style="color:red">some text.</span>some other text.</p>
```

### 框架

```html
<iframe src="http://www.runoob.com">
  <p>您的浏览器不支持  iframe 标签。</p>
</iframe>
```

## Html 基础

### 标题

> **标题很重要**
>
> 请确保标题标签只用于标题。不要仅仅是为了产生粗体或大号的文本而使用标题。
>
> 搜索引擎使用标题为您的网页的结构和内容编制索引。
>
> 因为用户可以通过标题来快速浏览您的网页，所以用标题来呈现文档结构是很重要的。

HTML 标题（Heading）是通过 `<h1>` - `<h6>` 标签来定义的。

`<h1>` 定义最大的标题。`<h6>` 定义最小的标题。

默认情况下，HTML 会自动地在块级元素前后添加一个额外的空行，比如段落、标题元素前后。

```html
<h1>这是标题 1</h1>
<h2>这是标题 2</h2>
<h3>这是标题 3</h3>
<h4>这是标题 4</h4>
<h5>这是标题 5</h5>
<h6>这是标题 6</h6>
```

### 段落

> **可以把 HTML 文档分割为若干段落。**

HTML 段落是通过 `<p>` 来定义的。

浏览器会自动地在段落的前后添加空行。（`<p>` 是块级元素）

```html
<p>这是一个段落。</p>
<p>这是另外一个段落。</p>
```

使用空的段落标记 `<p></p>` 去插入一个空行是个坏习惯。用 `<br />` 标签代替它！

### 链接

> **HTML 使用超级链接与网络上的另一个文档相连。**
>
> **几乎可以在所有的网页中找到链接。点击链接可以从一张页面跳转到另一张页面。**

HTML 使用标签 `<a>` 来设置超文本链接。

超链接可以是一个字，一个词，或者一组词，也可以是一幅图像，您可以点击这些内容来跳转到新的文档或者当前文档中的某个部分。

当您把鼠标指针移动到网页中的某个链接上时，箭头会变为一只小手。

我们通过使用 `<a>` 标签在 HTML 中创建链接。有两种使用 `<a>` 标签的方式：

1. 通过使用 `href` 属性 - 创建指向另一个文档的链接
2. 通过使用 `name` 属性 - 创建文档内的书签

```html
<a href="http://www.baidu.com">这是一个链接</a>
```

#### herf 属性

`href` 属性规定链接的目标。

链接的 HTML 代码很简单。它类似这样：

```html
<a href="url">Link text</a>
```

开始标签和结束标签之间的文字被作为超级链接来显示。

**示例**

```
<a href="http://www.example.com/">Visit</a>
```

提示："链接文本" 不必一定是文本。图片或其他 HTML 元素都可以成为链接。

#### name 属性

`name` 属性规定锚（anchor）的名称。

您可以使用 name 属性创建 HTML 页面中的书签。书签不会以任何特殊方式显示，它对读者是不可见的。

当使用命名锚（named anchors）时，我们可以创建直接跳至该命名锚（比如页面中某个小节）的链接，这样使用者就无需不停地滚动页面来寻找他们需要的信息了。

**命名锚的语法：**

```
<a name="label">锚（显示在页面上的文本）</a>
```

提示：锚的名称可以是任何你喜欢的名字。

提示：您可以使用 id 属性来替代 name 属性，命名锚同样有效。

**示例**

首先，我们在 HTML 文档中对锚进行命名（创建一个书签）：

```html
<a name="tips">基本的注意事项 - 有用的提示</a>
```

然后，我们在同一个文档中创建指向该锚的链接：

```html
<a href="#tips">有用的提示</a>
```

您也可以在其他页面中创建指向该锚的链接：

```html
<a href="http://www.example.com/html/html-links.html#tips">有用的提示</a>
```

在上面的代码中，我们将 # 符号和锚名称添加到 URL 的末端，就可以直接链接到 tips 这个命名锚了。

#### target 属性

使用 `target` 属性，你可以定义被链接的文档在何处显示。

下面的这行会在新窗口打开文档：

```html
<a href="http://www.examplel.com/" target="_blank">Visit</a>
```

### 图像

HTML 图像是通过标签 `<img>` 来定义的。

`<img>` 是空标签，意思是说，它只包含属性，并且没有闭合标签。

```html
<img src="/assets/images/html.png" width="600" height="800" />
```

#### src 属性

要在页面上显示图像，你需要使用 `src` 属性。src 指 "source"。源属性的值是图像的 URL 地址。

定义图像的语法是：

```
<img src="url" />
```

URL 指存储图像的位置。如果名为 "boat.gif" 的图像位于 www.example.com 的 images 目录中，那么其 URL 为 http://www.example.com/images/boat.gif。

浏览器将图像显示在文档中图像标签出现的地方。如果你将图像标签置于两个段落之间，那么浏览器会首先显示第一个段落，然后显示图片，最后显示第二段。

#### alt 属性

alt 属性用来为图像定义一串预备的可替换的文本。替换文本属性的值是用户定义的。

```html
<img src="boat.gif" alt="Big Boat">
```

在浏览器无法载入图像时，替换文本属性告诉读者她们失去的信息。此时，浏览器将显示这个替代性的文本而不是图像。为页面上的图像都加上替换文本属性是个好习惯，这样有助于更好的显示信息，并且对于那些使用纯文本浏览器的人来说是非常有用的。

### 水平线

`<hr />` 标签在 HTML 页面中创建水平线。

水平线可用于分隔内容。

```html
<p>这是一个段落。</p>
<hr />
<p>这是一个段落。</p>
<hr />
<p>这是一个段落。</p>
```

### 换行

如果您希望在不产生一个新段落的情况下进行换行（新行），请使用 `<br />` 标签：

```html
<p>这个<br />段落<br />演示了分行的效果</p>
```

`<br />` 元素是一个空的 HTML 元素。由于关闭标签没有任何意义，因此它没有结束标签。

选择 `<br>` 还是 `<br />` ?

您也许发现 `<br>` 与 `<br />` 很相似。

在 XHTML、XML 以及未来的 HTML 版本中，不允许使用没有结束标签（闭合标签）的 HTML 元素。

即使 `<br>` 在所有浏览器中的显示都没有问题，使用 `<br />` 也是**更长远的保障**。

#### HTML 忽略空格和换行

对于 HTML，您无法通过在 HTML 代码中添加额外的空格或换行来改变输出的效果。

当显示页面时，浏览器会移除**源代码中**多余的空格和空行。所有连续的空格或空行都会被算作一个空格。需要注意的是，HTML 代码中的所有连续的空行（换行）也被显示为一个空格。

```html
<html>
<body>
<h1>春晓</h1>
<p>
    春眠不觉晓，
      处处闻啼鸟。
        夜来风雨声，
          花落知多少。
</p>
<p>注意，浏览器忽略了源代码中的排版（省略了多余的空格和换行）。</p>
</body>
</html>
```

说明：HTML 的输出结果并不会按照源代码中那样去排版内容。

### 注释

可以将注释插入 HTML 代码中，这样可以提高其可读性，使代码更易被人理解。浏览器会忽略注释，也不会显示它们。

```html
<!-- 这是一个注释 -->
```

#### 条件注释

您也许会在 HTML 中偶尔发现条件注释：

```
<!--[if IE 8]>
    .... some HTML here ....
<![endif]-->
```

条件注释定义只有 Internet Explorer 执行的 HTML 标签。

## FAQ

### 中文编码

目前在大部分浏览器中，直接输出中文会出现中文乱码的情况，这时候我们就需要在头部将字符声明为 **UTF-8**。

添加 `<meta charset="UTF-8">` 元素。

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>页面标题</title>
</head>
<body>
<h1>我的第一个标题</h1>
<p>我的第一个段落。</p>
</body>
</html>
```

### html 和 htm

`.html` 和 `.htm` 都是 html 文档的后缀名，二者没有区别。

### HTML 忽略空格和换行

对于 HTML，您无法通过在 HTML 代码中添加额外的空格或换行来改变输出的效果。

当显示页面时，浏览器会移除**源代码中**多余的空格和空行。所有连续的空格或空行都会被算作一个空格。需要注意的是，HTML 代码中的所有连续的空行（换行）也被显示为一个空格。

```html
<html>
<body>
<h1>春晓</h1>
<p>
    春眠不觉晓，
      处处闻啼鸟。
        夜来风雨声，
          花落知多少。
</p>
<p>注意，浏览器忽略了源代码中的排版（省略了多余的空格和换行）。</p>
</body>
</html>
```

说明：HTML 的输出结果并不会按照源代码中那样去排版内容。

## 更多内容

> :books: 拓展阅读
>
> - [Html](html.md)
> - [Css](css.md)
> - [Javascript](javascript.md)
>
> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

- [mozilla html 教程](https://developer.mozilla.org/en-US/Learn/HTML)
- [W3school html 教程](http://www.w3school.com.cn/html/index.asp)
