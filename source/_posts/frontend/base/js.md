---
title: Javascript 教程
date: 2019-03-06
---

# Javascript 教程

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
- [用法](#用法)
- [输出](#输出)
- [变量](#变量)
- [数据类型](#数据类型)
- [操作符](#操作符)
- [语句](#语句)
- [控制语句](#控制语句)
    - [if...else if....else 语句](#ifelse-ifelse-语句)
    - [switch 语句](#switch-语句)
    - [for 循环](#for-循环)
    - [while 循环](#while-循环)
    - [break 和 continue](#break-和-continue)
- [函数](#函数)
- [注释](#注释)
- [更多内容](#更多内容)

<!-- /TOC -->

## 简介

JavaScript 是一种脚本，一门编程语言，它可以在网页上实现复杂的功能，网页展现给你的不再是简单的静态信息，实时的内容更新，交互式的地图，2D/3D 动画，滚动播放的视频，等等。

## 用法

- HTML 中的脚本必须位于 `<script>` 与 `</script>` 标签之间。
- 脚本可被放置在 HTML 页面的 `<body>` 和 `<head>` 部分中。

（1）如需在 HTML 页面中插入 JavaScript，请使用 `<script>` 标签。

```js
<script>alert("我的第一个 JavaScript");</script>
```

（2）如需使用外部文件，请在 `<script>` 标签的 `src` 属性中设置该 .js 文件：

```html
<!DOCTYPE html>
<html>
  <body>
    <script src="myScript.js"></script>
  </body>
</html>
```

## 输出

JavaScript 没有任何打印或者输出的函数。

JavaScript 可以通过不同的方式来输出数据：

- 使用 window.alert() 弹出警告框。
- 使用 document.write() 方法将内容写到 HTML 文档中。
- 使用 innerHTML 写入到 HTML 元素。
- 使用 console.log() 写入到浏览器的控制台。

## 变量

JavaScript 使用关键字 `var` 来定义变量， 使用等号 `=` 来为变量赋值。

```js
var x, length;
x = 5;
length = 6;
```

变量命名要求：

- 变量必须以字母开头
- 变量也能以 \$ 和 \_ 符号开头（不过我们不推荐这么做）
- 变量名称对大小写敏感（y 和 Y 是不同的变量）

## 数据类型

JavaScript 有多种数据类型：字符串（String）、数字(Number)、布尔(Boolean)、数组(Array)、对象(Object)、空（Null）、未定义（Undefined）。

```js
var length = 16; // Number 通过数字字面量赋值
var points = x * 10; // Number 通过表达式字面量赋值
var lastName = "Johnson"; // String 通过字符串字面量赋值
var cars = ["Saab", "Volvo", "BMW"]; // Array  通过数组字面量赋值
var person = { firstName: "John", lastName: "Doe" }; // Object 通过对象字面量赋值
```

## 操作符

JavaScript 支持的操作符：

- 赋值，算术和位运算符
- 条件，比较及逻辑运算符

## 语句

语句是用分号 `;` 分隔。

```js
x = 5 + 6;
y = x * 10;
```

## 控制语句

分支：

### if...else if....else 语句

```js
if (condition1) {
  // 当条件 1 为 true 时执行的代码
} else if (condition2) {
  // 当条件 2 为 true 时执行的代码
} else {
  // 当条件 1 和 条件 2 都不为 true 时执行的代码
}
```

### switch 语句

```js
switch (n) {
  case 1:
    // 执行代码块 1
    break;
  case 2:
    // 执行代码块 2
    break;
  default:
    // n 与 case 1 和 case 2 不同时执行的代码
    break;
}
```

### for 循环

```js
for (语句 1; 语句 2; 语句 3) {
  // 被执行的代码块
}
```

### while 循环

```js
while (条件) {
  // 需要执行的代码
}
```

### break 和 continue

- break 语句可用于跳出循环。
- continue 语句中断循环中的迭代，如果出现了指定的条件，然后继续循环中的下一个迭代。

## 函数

函数就是包裹在花括号中的代码块，前面使用了关键词 function：

```js
function myFunction(a, b) {
  return a * b; // 返回 a 乘于 b 的结果
}
```

## 注释

- 单行注释以 `//` 开头。
- 多行注释以 `/*` 开始，以 `*/` 结尾。

JavaScript 不会执行注释。

可以添加注释来对 JavaScript 进行解释，或者提高代码的可读性。

```js
/* 
多行注释
*/

// 单行注释
```

## 更多内容

> :books: 拓展阅读
>
> - [Html](html.md)
> - [Css](css.md)
> - [Javascript](javascript.md)
>
> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

- 书籍
  - [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
- 教程
  - [W3Cschool JavaScript 教程](https://www.w3cschool.cn/javascript/)
  - [MDN JavaScript 教程](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript)
- 规范
  - [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) - JavaScript 编程规范
  - [JavaScript Standard Style](https://github.com/standard/standard/blob/master/docs/README-zhcn.md) - 自带 linter & 代码自动修正
- 更多资源
  - [awesome-javascript](https://github.com/sorrycc/awesome-javascript)
