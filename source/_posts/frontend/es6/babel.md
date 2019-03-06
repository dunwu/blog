---
title: Babel 教程
date: 2019-03-06
---

# Babel 教程

> `Babel` 是一个通用的多用途 JavaScript 编译器。
>
> ⚠ **注意：**
>
> Babel 可以与很多构建工具（如 `Browserify`、`Grunt`、`Gulp` 等）进行集成。由于本教程选择 `Webpack` ，所以只讲解与 `Webpack` 的集成。想了解如何与其它工具集成，请参考：[**官方文档 - installation**](https://babeljs.io/docs/setup/#installation)
>
> 关键词： `babel-cli`, `.babelrc`, `preset`, `polyfill`

<!-- TOC depthFrom:2 depthTo:3 -->

- [1. 简介](#1-简介)
    - [1.1. Babel 能做什么？](#11-babel-能做什么)
    - [1.2. Babel 不能做什么？](#12-babel-不能做什么)
- [2. 安装 Babel](#2-安装-babel)
    - [2.1. `babel-cli`](#21-babel-cli)
    - [2.2. `babel-node`](#22-babel-node)
    - [2.3. `babel-register`](#23-babel-register)
    - [2.4. `babel-core`](#24-babel-core)
    - [2.5. 与 webpack 集成](#25-与-webpack-集成)
- [3. 配置 Babel](#3-配置-babel)
    - [3.1. `.babelrc`](#31-babelrc)
    - [3.2. 在其它工具中配置](#32-在其它工具中配置)
- [4. 执行 Babel 生成的代码](#4-执行-babel-生成的代码)
    - [4.1. `babel-polyfill`](#41-babel-polyfill)
    - [4.2. `babel-runtime`](#42-babel-runtime)
- [5. 更多内容](#5-更多内容)

<!-- /TOC -->

## 1. 简介

### 1.1. Babel 能做什么？

- Babel 通过语法转换来支持最新版本的 JavaScript （ES6），而不用等待浏览器的支持。
- Babel 可以转换 React 的 JSX 语法和删除类型注释。
- Babel 是由插件构建的。因此，你可以根据自己的需要订制。
- 支持 source map ，所以您可以轻松调试您编译的代码。

### 1.2. Babel 不能做什么？

- Babel 只转换语法（如箭头函数），不支持新的全局变量。但是，您可以使用 [`babel-polyfill`](http://babeljs.io/docs/usage/polyfill/) 来辅助支持。

## 2. 安装 Babel

### 2.1. `babel-cli`

`babel-cli` 是 Babel 的命令行工具。

**安装**

```bash
# 本地安装
$ npm install --save-dev babel-cli
# 全局安装
$ npm install --global babel-cli
```

**用法**

```bash
# 将编译后的结果直接输出至终端
$ babel example.js

# 将结果写入到指定的文件
$ babel example.js --out-file compiled.js
$ babel example.js -o compiled.js

# 将一个目录整个编译成一个新的目录
$ babel src --out-dir lib
$ babel src -d lib
```

#### 与 `package.json` 集成

> ​:pushpin: **提示：**
>
> 建议使用本地安装方式安装 `babel-cli` 。
>
> 原因在与：
>
> 1. 在同一台机器上的不同项目或许会依赖不同版本的 Babel 并允许你有选择的更新。
> 2. 这意味着你对工作环境没有隐式依赖，这让你的项目有很好的可移植性并且易于安装。

本地安装 `babel-cli` ，直接使用 `babel` 命令将无法识别。你可以选在在  `package.json`  文件的  `scripts`  属性中定义命令。`npm` 会自动找到本地安装的库。

```json
{
  "scripts": {
    "build": "babel src -d lib"
  },
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

现在可以在终端里执行命令：

```bash
$ npm run build
```

> ​:flashlight: **示例 DEMO01：** ([**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter04/babel/demo01))
>
> 说明：
>
> 示例的上一级目录 [`codes/chapter04/babel`](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter04/babel) 已经配好了配置文件。
>
> 在 `codes/chapter04/babel` 路径下执行命令：
>
> ```bash
> $ npm install
> $ npm run demo01
> ```
>
> 会生成一个 `dist/demo01` 目录，其中就是被转码后的文件。

### 2.2. `babel-node`

`babel-cli` 工具自带一个 `babel-node` 命令，提供一个支持 ES6 的 REPL 环境。它支持 Node 的 REPL 环境的所有功能，而且可以直接运行 ES6 代码。

它不用单独安装，而是随 `babel-cli` 一起安装。然后，执行 `babel-node` 就进入 PEPL 环境。

然后用  `babel-node`  来替代  `node`  运行所有的代码：

```bash
$ babel-node
> (x => x * 2)(1)
2
```

`babel-node` 命令可以直接运行 ES6 脚本:

```bash
$ babel-node example.js
```

如果用 npm 的话只需要这样做：

```json
{
  "scripts": {
    "script-name": "babel-node script.js"
  },
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

然后，执行命令：

```bash
$ npm run babel-node
```

### 2.3. `babel-register`

下一个常用的运行 Babel 的方法是通过  `babel-register`。这种方法只需要引入文件就可以运行 Babel，或许能更好地融入你的项目设置。

> ​:warning: **注意：**
>
> 这种方法并不适合正式产品环境使用。 直接部署用此方式编译的代码不是好的做法。 在部署之前预先编译会更好。
>
> 不过用在构建脚本或是其他本地运行的脚本中是非常合适的。

**安装**

```bash
$ npm install --save-dev babel-register
```

**使用**

1. 创建  `index.js`  文件：

```js
console.log('Hello world!');
```

这是，使用  `node index.js`  来运行它是不会使用 Babel 来编译的。所以我们需要设置  `babel-register`。.

2. 创建  `register.js`  文件：

```js
require('babel-register');
require('./index.js');
```

这样做可以把 Babel *注册*到 Node 的模块系统中并开始编译其中  `require`  的所有文件。

3. 执行命令

   现在我们可以使用  `register.js`  来代替  `node index.js`  来运行了。

```bash
$ node register.js
```

需要注意的是：你不能在你要编译的文件内同时注册 Babel，因为 node 会在 Babel 编译它之前就将它执行了。

> ​:flashlight: **示例 DEMO02：** ([**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter04/babel/demo02))
>
> 说明：
>
> 示例的上一级目录 [`codes/chapter04/babel`](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter04/babel) 已经配好了配置文件。
>
> 在 `codes/chapter04/babel` 路径下执行命令：
>
> ```bash
> $ npm install
> $ npm run demo02
> ```
>
> 控制台会打印如下内容：
>
> ```
> > node demo02/register.js
>
> Hello world!
> ```

### 2.4. `babel-core`

如果你需要以编程的方式来使用 Babel，可以使用  `babel-core`  这个包。

**安装**

```bash
$ npm install babel-core
```

**使用**

在代码中引入 `babel-core`

```js
var babel = require('babel-core');
```

**编译 API**

```js
# 如果是字符串形式的 JavaScript 代码，可以使用 transform 编译
babel.transform("code();", options);
// => { code, map, ast }

# 如果是文件的话，异步编译使用 transformFile
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
# 如果是文件的话，同步编译使用 transformFileSync
babel.transformFileSync("filename.js", options);
// => { code, map, ast }

# 要是已经有一个 Babel AST（抽象语法树）了就可以直接从 AST 进行转换
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

### 2.5. 与 webpack 集成

> ​:pushpin: **提示：**
>
> 本教程由于选择的编译工具为 `webpack` ，所以这里只介绍与 `webpack` 的集成。
>
> 实际上，Babel 还可以与其它许多工具集成，更多内容参考：[官方文档 - setup](https://babeljs.io/docs/setup/#installation)

**安装**

```bash
$ npm install --save-dev babel-loader babel-core
```

**配置 **

在 Chapter03 的 [Webpack 资源管理](https://github.com/dunwu/frontend-tutorial/tree/master/docs/chapter03/webpack/asset-management.md) 一文中，介绍过使用 babel-loader 来处理 React 语法。

在 **webpack.config.js** 配置如下：

```js
// 关于模块配置
module: {

  // 模块规则（配置 loader、解析器等选项）
  rules: [
    {
      // 语义解释器，将 js/jsx 文件中的 es2015/react 语法自动转为浏览器可识别的 Javascript 语法
      test: /\.jsx?$/,
      include: path.resolve(__dirname, "app"),
      loader: "babel-loader",
    },
  ]
},
```

> ​:flashlight: **示例**
>
> **chapter03-jigsaw：** ([**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter03/jigsaw))
>
> **chapter04-jigsaw：** ([**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter04/jigsaw))
>
> 说明：
>
> `chapter04-jigsaw` 和 `chapter03-jigsaw` 相比，多了一个 `.babelrc` 文件。它其实是将 `chapter03-jigsaw` 中的 `webpack.common.js` 文件里的 babel-loader 的配置移入了 `.babelrc` 文件。
>
> 这两个代码目录的执行结果完全相同。
>
> 执行方法：
>
> ```bash
> $ npm install
> # 开发环境 - 本地启动一个访问地址为 localhost:9000 的 web app
> $ npm run dev
> # 开发环境 - 生成一个 dist 目录，其中打包了所有资源文件，在浏览器打开 index.html，可以看到和开发环境差不多的展示。
> $ npm run prod
> # 清除输出目录 dist
> $ npm run clean
> ```

## 3. 配置 Babel

> ​:pushpin: 提示：
>
> 由于 `Babel` 是一个非常灵活的通用编译器，因此默认情况下它反而什么都不做。
>
> 你需要通过配置文件，明确地告诉 Babel 应该要做什么。

### 3.1. `.babelrc`

`.babelrc`  文件是 `Babel` 的默认配置文件。

`.babelrc` **文件的内容形式就是序列化的 JSON。**

该文件用来设置转码规则（presets）和插件（plugins），基本格式如下：

```json
{
  "presets": [],
  "plugins": []
}
```

#### 转码规则(preset)

转码规则可以告诉 Babel 去处理什么语法。

常见的转码规则有：

- `babel-preset-es2015`

  这是 ES2015（最新版本的 JavaScript 标准，也叫做 ES6）的转码规则。使用它后，Babel 可以将 ES6 语法转码为普通 JavaScript（即 ES5） 语法。

- `babel-preset-react`

  这是 React 的转码规则。使用它后，Babel 可以将 React 语法转码为普通 JavaScript 语法。

- `babel-preset-stage-x`

  这是 ES7 不同阶段语法提案的转码规则。使用它后，Babel 可以将 ES7 不同阶段语法转码为普通 JavaScript 语法。

  > ​:pushpin: 提示：
  >
  > JavaScript 还有一些提案，正在积极通过 TC39（ECMAScript 标准背后的技术委员会）的流程成为标准的一部分。
  >
  > 这个流程分为 5（0－4）个阶段。 随着提案得到越多的关注就越有可能被标准采纳，于是他们就继续通过各个阶段，最终在阶段 4 被标准正式采纳。以下是 4 个不同阶段的（打包的）预设：
  >
  > - `babel-preset-stage-0`
  > - `babel-preset-stage-1`
  > - `babel-preset-stage-2`
  > - `babel-preset-stage-3`
  >
  > stage-4 预设是不存在的因为它就是上面的  `es2015`  预设。
  >
  > 以上每种预设都依赖于紧随的后期阶段预设。例如，`babel-preset-stage-1`  依赖  `babel-preset-stage-2`，后者又依赖`babel-preset-stage-3`。

**安装**

```bash
# es2015（即ES6）语法转码规则
$ npm install --save-dev babel-preset-es2015

# react 语法转码规则
$ npm install --save-dev babel-preset-react

# stage 是指 ES7 不同阶段的语法转码规则，选装一个即可
$ npm install --save-dev babel-preset-stage-0
$ npm install --save-dev babel-preset-stage-1
$ npm install --save-dev babel-preset-stage-2
$ npm install --save-dev babel-preset-stage-3
```

**使用**

安装完后，需要在配置文件  `.babelrc`  中引入项目中实际需要的预设转码规则，让 Babel 得以知道规则。

形式如下：

```json
{
  "presets": ["es2015", "react", "stage-0"],
  "plugins": []
}
```

#### 插件(plugins)

插件是 Babel 的核心。

Babel 插件大致分为三类：

- 转码插件

  有很多种插件：将 ES6 / ES2015 转换为 ES5，转换为 ES3，minification，JSX，flow，实验功能等等。

* 语法插件

  这些只是使转码插件能够解析某些功能（转码插件已经包含语法插件，因此这两个功能你都不需要）：`babel-plugin-syntax-x`

* 助手

  这些主要用于各种插件内部使用：`babel-helper-x`。

更多插件请在 [npm](https://www.npmjs.com/search?q=babel-plugin) 搜索（真的好多！）

更详细介绍请参考：[官方文档 - 插件](http://babeljs.io/docs/plugins)

### 3.2. 在其它工具中配置

> ​:pushpin:​ **提示：**
>
> 除了在  `.babelrc`  文件中定义 Babel 配置。实际上，还可以在其他工具中对其进行配置。

#### 在 `package.json` 中配置

可以在 `package.json` 文件的 `babel` 属性中配置 Babel 规则。

配置方法与 `.babelrc` 文件完全相同。

形式如下：

```json
"babel": {
  "presets": [
    "es2015"
  ]
  "plugins": []
},
```

#### 在 `webpack.config.js` 中配置

可以在 `webpack.config.js` 文件配置 `babel-loader` 时，直接在 `options` 属性中配置 Babel 规则。

形式如下：

```js
{
  test: /\.jsx?$/,
  include: path.resolve(__dirname, "app"),
  exclude: /node_modules/,
  loader: "babel-loader",
  options: {
    presets: [
      [
        "es2015",
        {
          "modules": false
        }
      ],
      "react"
    ],
    plugins: [
      "syntax-dynamic-import",  // 动态导入插件
      "react-hot-loader/babel" // 开启 React 代码的模块热替换(HMR)
    ]
  },
}
```

## 4. 执行 Babel 生成的代码

即便你已经用 Babel 编译了你的代码，但这还不算完。

### 4.1. `babel-polyfill`

Babel 几乎可以编译所有新潮的 JavaScript 语法，但对于 APIs 来说却并非如此。

比方说，下列含有箭头函数的需要编译的代码：

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

最终会变成这样：

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

然而，它依然无法随处可用。因为并非所有的 JavaScript 环境都支持  `Array.from`。

为了解决这个问题，我们使用一种叫做  [Polyfill（代码填充，也可译作兼容性补丁）](https://remysharp.com/2010/10/08/what-is-a-polyfill)  的技术。 简单地说，polyfill 即是在当前运行环境中用来复制（意指模拟性的复制，而不是拷贝）尚不存在的原生 api 的代码。 能让你提前使用还不可用的 APIs，`Array.from`  就是一个例子。

Babel 提供了 `babel-polyfill` 来支持 polyfill 。

**安装**

```bash
$ npm install --save babel-polyfill
```

**使用**

然后，只需要在文件顶部导入 `babel-polyfill` 就可以了：

```js
import 'babel-polyfill';
```

### 4.2. `babel-runtime`

babel-runtime 与 polyfill 类似，不同之处在于它不修改全局范围，并且与 `babel-plugin-transform-runtime`（通常在库/插件代码中）一起使用。

为了实现 ECMAScript 规范的细节，Babel 会使用“助手”方法来保持生成代码的整洁。

由于这些助手方法可能会特别长并且会被添加到每一个文件的顶部，因此你可以把它们统一移动到一个单一的“运行时（runtime）”中去。

通过安装  `babel-plugin-transform-runtime`  和  `babel-runtime`  来开始。

```bash
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

然后更新  `.babelrc`：

```json
{
  "presets": ["es2015", "react", "stage-0"],
  "plugins": ["transform-runtime", "transform-es2015-classes"]
}
```

现在，Babel 会把这样的代码：

```js
class Foo {
  method() {}
}
```

编译成：

```js
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';

let Foo = (function() {
  function Foo() {
    _classCallCheck(this, Foo);
  }

  _createClass(Foo, [
    {
      key: 'method',
      value: function method() {}
    }
  ]);

  return Foo;
})();
```

这样就不需要把  `_classCallCheck`  和  `_createClass`  这两个助手方法放进每一个需要的文件里去了。

## 5. 更多内容

> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

- **官方**
  - [Babel 官网](https://babeljs.io/)
  - [Babel 中文网](https://www.babeljs.cn/)
  - [Babel Github](https://github.com/babel/babel)
