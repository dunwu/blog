---
title: Webpack 概念
date: 2019-03-06
---

# Webpack 概念

*webpack*  是一个现代的 JavaScript 应用程序的*模块打包器(module bundler)*。当 webpack 处理应用程序时，它会递归地构建一个*依赖关系图表(dependency graph)*，其中包含应用程序需要的每个模块，然后将所有这些模块打包成少量的  *bundle* - 通常只有一个，由浏览器加载。

学习 webpack，需要先了解几个核心概念，下面会一一道来。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/frontend-tutorial/master/docs/assets/images/webpack-introduction.png"/></div><br>

## 模块化(module)

在[模块化编程](https://en.wikipedia.org/wiki/Modular_programming)中，开发者将程序分解相对独立的代码块，并称之为*模块*。

每个模块具有比完整程序更小的接触面，使得校验、调试、测试轻而易举。 精心编写的*模块*提供了可靠的抽象和封装界限，使得应用程序中每个模块都具有条理清楚的设计和明确的目的。

Node.js 从最一开始就支持模块化编程。然而，在 web，*模块化*的支持正缓慢到来。在 web 存在多种支持 JavaScript 模块化的工具，这些工具各有优势和限制。webpack 基于从这些系统获得的经验教训，并将*模块*的概念应用于项目中的任何文件。

### 什么是 webpack 模块

对比  [Node.js 模块](https://nodejs.org/api/modules.html)，webpack *模块*能够以各种方式表达它们的依赖关系，几个例子如下：

- [ES2015 `import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)  语句
- [CommonJS](http://www.commonjs.org/specs/modules/1.0/) `require()`  语句
- [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) `define`  和  `require`  语句
- css/sass/less 文件中的  [`@import`  语句](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。
- 样式(`url(...)`)或 HTML 文件(``)中的图片链接(image url)

> webpack 1 需要特定的 loader 来转换 ES 2015 `import`，然而 webpack 2 天然支持。

### 支持的模块类型

webpack 通过  *loader*  可以支持各种语言和预处理器编写模块。*loader*  描述了 webpack **如何**处理 非 JavaScript(non-JavaScript) *模块*，并且在*bundle*中引入这些*依赖*。 webpack 社区已经为各种流行语言和语言处理器构建了  *loader*，包括：

- [CoffeeScript](http://coffeescript.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESNext (Babel)](https://babeljs.io/)
- [Sass](http://sass-lang.com/)
- [Less](http://lesscss.org/)
- [Stylus](http://stylus-lang.com/)

总的来说，webpack 提供了可定制的、强大和丰富的 API，允许**任何技术栈**使用 webpack，保持了在你的开发、测试和生成流程中**无侵入性(non-opinionated)**。

## 配置文件 - webpack.config.js

> webpack 是高度可配置的，如何模块化打包、加载都可以基于配置文件定制。
>
> webpack 的默认配置文件是 `webpack.config.js`。

因为 webpack 配置是标准的 Node.js CommonJS 模块，你可以使用**如下特性**：

- 通过  `require(...)`  导入其他文件
- 通过  `require(...)`  使用 npm 的工具函数
- 使用 JavaScript 控制流表达式，例如  `?:`  操作符
- 对常用值使用常量或变量
- 编写并执行函数来生成部分配置

## 依赖图表(Dependency Graph)

任何时候，一个文件依赖于另一个文件，webpack 就把此视为文件之间有*依赖关系*。这使得 webpack 可以接收非代码资源(non-code asset)（例如图像或 web 字体），并且可以把它们作为*依赖*提供给你的应用程序。

webpack 从命令行或配置文件中定义的一个模块列表开始，处理你的应用程序。 从这些*入口起点*开始，webpack 递归地构建一个*依赖图表*，这个依赖图表包含着应用程序所需的每个模块，然后将所有这些模块打包为少量的  *bundle*- 通常只有一个 - 可由浏览器加载。

> 对于  *HTTP/1.1*  客户端，由 webpack 打包你的应用程序会尤其强大，因为在浏览器发起一个新请求时，它能够减少应用程序必须等待的时间。对于  *HTTP/2*，你还可以使用代码拆分(Code Splitting)以及通过 webpack 打包来实现[最佳优化](https://medium.com/webpack/webpack-http-2-7083ec3f3ce6#.7y5d3hz59)。

## 入口(entry)

webpack 将创建所有应用程序的**依赖关系图表(dependency graph)**。图表的起点被称之为*入口起点(entry point)*。*入口起点*告诉 webpack *从哪里开始*，并遵循着依赖关系图表知道*要打包什么*。可以将您应用程序的*入口起点*认为是**根上下文(contextual root)**或  **app 第一个启动文件**。

在 webpack 中，我们使用  [webpack 配置对象(webpack configuration object)](https://doc.webpack-china.org/configuration)  中的  `entry`  属性来定义*入口*。

例：

```js
module.exports = {
  entry: "./path/to/my/entry/file.js"
};
```

## 输出(output)

将所有的资源(assets)归拢在一起后，还需要告诉 webpack **在哪里**打包应用程序。webpack 的  `output`  属性描述了**如何处理归拢在一起的代码**(bundled code)。

例：

```js
const path = require("path");

module.exports = {
  entry: "./path/to/my/entry/file.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-first-webpack.bundle.js"
  }
};
```

## 加载(loader)

webpack 的目标是，让  **webpack**  聚焦于项目中的所有资源(asset)，而浏览器不需要关注考虑这些（这并不意味着资源(asset)都必须打包在一起）。webpack 把[每个文件(.css, .html, .scss, .jpg, etc.) 都作为模块](https://doc.webpack-china.org/concepts/modules)处理。然而 webpack **只理解 JavaScript**。

**webpack loader 会将这些文件转换为模块，而转换后的文件会被添加到依赖图表中。**

在更高层面，webpack 的配置有两个目标。

1. 识别出(identify)应该被对应的 loader 进行转换(transform)的那些文件

2. 由于进行过文件转换，所以能够将被转换的文件添加到依赖图表（并且最终添加到 bundle 中）(`use`  属性)

例：

```js
const path = require("path");

const config = {
  entry: "./path/to/my/entry/file.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-first-webpack.bundle.js"
  },
  module: {
    rules: [{ test: /\.(js|jsx)$/, use: "babel-loader" }]
  }
};

module.exports = config;
```

## 插件(plugins)

由于 loader 仅在每个文件的基础上执行转换，而  `插件(plugins)`  最常用于（但不限于）在打包模块的“compilation”和“chunk”生命周期执行操作和自定义功能[（查看更多）](https://doc.webpack-china.org/concepts/plugins)。webpack 的插件系统[极其强大和可定制化](https://doc.webpack-china.org/api/plugins)。

想要使用一个插件，你只需要  `require()`  它，然后把它添加到  `plugins`  数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，你需要使用  `new`  创建实例来调用它。

例：

```js
const HtmlWebpackPlugin = require("html-webpack-plugin"); //installed via npm
const webpack = require("webpack"); //to access built-in plugins
const path = require("path");

const config = {
  entry: "./path/to/my/entry/file.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-first-webpack.bundle.js"
  },
  module: {
    rules: [{ test: /\.(js|jsx)$/, use: "babel-loader" }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({ template: "./src/index.html" })
  ]
};

module.exports = config;
```

## 热替换(Hot Module Replacement)

模块热替换功能会在应用程序运行过程中替换、添加或删除[模块](https://doc.webpack-china.org/concepts/modules/)，而无需重新加载页面。这使得你可以在独立模块变更后，无需刷新整个页面，就可以更新这些模块，极大地加速了开发时间。

### 这一切是如何运行的？

### 站在 App 的角度

1. app 代码要求 HMR runtime 检查更新。
2. HMR runtime （异步）下载更新，然后通知 app 代码更新可用。
3. app 代码要求 HMR runtime 应用更新。
4. HMR runtime （异步）应用更新。

你可以设置 HMR，使此进程自动触发更新，或者你可以选择要求在用户交互后进行更新。

#### 站在编译器(webpack) 的角度

除了普通资源，编译器(compiler)需要发出 "update"，以允许更新之前的版本到新的版本。"update" 由两部分组成：

1. 待更新 manifest (JSON)
2. 一个或多个待更新 chunk (JavaScript)

manifest 包括新的编译 hash 和所有的待更新 chunk 目录。

每个待更新 chunk 包括用于与所有被更新模块相对应 chunk 的代码（或一个 flag 用于表明模块要被移除）。

编译器确保模块 ID 和 chunk ID 在这些构建之间保持一致。通常将这些 ID 存储在内存中（例如，当使用  [webpack-dev-server](https://doc.webpack-china.org/configuration/dev-server/)  时），但是也可能将它们存储在一个 JSON 文件中。

#### 站在模块的角度

HMR 是可选功能，只会影响包含 HMR 代码的模块。举个例子，通过  [`style-loader`](https://github.com/webpack/style-loader)  为 style 样式追加补丁。 为了运行追加补丁，`style-loader`  实现了 HMR 接口；当它通过 HMR 接收到更新，它会使用新的样式替换旧的样式。

类似的，当在一个模块中实现了 HMR 接口，你可以描述出当模块被更新后发生了什么。然而在多数情况下，不需要强制在每个模块中写入 HMR 代码。如果一个模块没有 HMR 处理函数，更新就会冒泡。这意味着一个简单的处理函数能够对整个模块树(complete module tree)进行处理。如果在这个模块树中，一个单独的模块被更新，那么整个模块树都会被重新加载（只会重新加载，不会迁移）。

#### 站在 HMR Runtime 的角度 (Technical)

对于模块系统的 runtime，附加的代码被发送到  `parents`  和  `children`  跟踪模块。

在管理方面，runtime 支持两个方法  `check`  和  `apply`。

`check`  发送 HTTP 请求来更新 manifest。如果请求失败，说明没有可用更新。如果请求成功，待更新 chunk 会和当前加载过的 chunk 进行比较。对每个加载过的 chunk，会下载相对应的待更新 chunk。当所有待更新 chunk 完成下载，就会准备切换到  `ready`  状态。

`apply`  方法将所有被更新模块标记为无效。对于每个无效模块，都需要在模块中有一个更新处理函数，或者在它的父级模块们中有更新处理函数。否则，无效标记冒泡，并将父级也标记为无效。每个冒泡继续直到到达应用程序入口起点，或者到达带有更新处理函数的模块（以最先到达为准）。如果它从入口起点开始冒泡，则此过程失败。

之后，所有无效模块都被（通过 dispose 处理函数）处理和解除加载。然后更新当前 hash，并且调用所有 "accept" 处理函数。runtime 切换回`闲置`状态，一切照常继续。

### 产生的文件 (Technical)

左侧表示初始编译器通过。右侧表示更新了模块 4 和 9 。

<br><div align="center"><img src="https://camo.githubusercontent.com/afdb8057414988ac33b85eb25a225181f9efb7b1/687474703a2f2f7765627061636b2e6769746875622e696f2f6173736574732f484d522e737667"/></div><br>

### 它能够用于？

你可以在开发过程中将 HMR 作为 LiveReload 的替代。[webpack-dev-server](https://doc.webpack-china.org/configuration/dev-server/)  支持热模式，在试图重新加载整个页面之前，热模式会尝试使用 HMR 来更新。查看如何实现[在 React 项目中使用 HMR](https://doc.webpack-china.org/guides/hmr-react)  为例。

一些 loader 已经生成可热更新的模块。例如，`style-loader`  能够置换出页面的样式表。对于这样的模块，你不需要做任何特殊处理。

webpack 的强大之处在于它的可定制化，取决于特定项目需求，这里有*许多*配置 HMR 的方式。

## 更多内容

> :books: 拓展阅读
>
> - [Webpack 入门](webpack.md)
> - [Webpack 概念](concept.md)
> - [Webpack 资源管理](asset-management.md)
> - [Webpack 代码分离](code-splitting.md)
> - [Webpack 开发工具](development.md)
>
> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

- **官方资料**
  - [Webpack 官网](https://webpack.js.org/)
  - [Webpack 中文网](https://webpack.docschina.org/)
  - [webpack Github](https://github.com/webpack/webpack)
  - [webpack-dev-server Github](https://github.com/webpack/webpack-dev-server)
  - [webpack-dev-server 官方文档](http://webpack.github.io/docs/webpack-dev-server.html)
- **入门资料**
  - [webpack-demos](https://github.com/ruanyf/webpack-demos)
  - [webpack-howto](https://github.com/petehunt/webpack-howto/blob/master/README-zh.md)
  - [webpack-handbook](http://zhaoda.net/webpack-handbook/index.html)
- **教程**
  - [如何学习 Webpack](webpack-howto.md)
  - [Webpack 概念](concept.md)
  - [Webpack 入门](webpack.md)
  - [Webpack 资源管理](asset-management.md)
  - [Webpack 代码分离](code-splitting.md)
  - [Webpack 开发工具](development.md)
- **文章**
  - [JavaScript 模块化七日谈](http://huangxuan.me/2015/07/09/js-module-7day/)
  - [前端模块化开发那点历史](https://github.com/seajs/seajs/issues/588)
- **更多资源**
  - [awesome-webpack-cn](https://github.com/webpack-china/awesome-webpack-cn)
