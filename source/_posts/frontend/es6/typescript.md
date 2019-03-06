---
title: TypeScript
date: 2019-03-06
---

# TypeScript

> **TypeScript 是 JavaScript 类型的超集，它可以编译成纯 JavaScript。**
>
> TypeScript 可以在任何浏览器、任何计算机和任何操作系统上运行，并且是开源的。
>
> 关键词： `typescript`, `tsc`

## 入门

（1）安装 TypeScript

```sh
npm install -g typescript
```

（2）编写 TypeScript 代码

创建 greeter.ts 文件，内容如下：

```js
class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user);
```

（3）使用 tsc 编译代码

```
tsc greeter.ts
```

输出结果为一个 greeter.js 文件，它包含了和输入文件中相同的 JavsScript 代码。

（4）在 html 中引用编译后的 js 文件

新建 greeter.html 文件，内容如下：

```html
<!DOCTYPE html>
<html>
    <head><title>TypeScript Greeter</title></head>
    <body>
        <script src="greeter.js"></script>
    </body>
</html>
```

在浏览器里打开 greeter.html 运行这个应用。

## 更多内容

> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

- **官方**
  - [TypeScript 官网](http://www.typescriptlang.org/)
  - [TypeScript 中文网](https://www.tslang.cn/index.html)
  - [TypeScript Github](https://github.com/Microsoft/TypeScript/)
  - [TypeScript 样例](https://github.com/Microsoft/TypeScriptSamples/)
- **教程**
  - [TypeScript 入门教程](https://github.com/xcatliu/typescript-tutorial)
