---
title: Webpack 代码分离
date: 2019-03-06
---

# Webpack 代码分离

> :pushpin: **提示：**
>
> 1. 版本问题
>
>    本文基于 `webpack 2.x` 版本。`webpack 2.x` 相比 `webpack 1.x` 有重大改变。所以，如果你的项目中已使用了 webpack 1.x ，本教程的示例将不适用，请慎重。
>
>    如果铁了心要升级 webpack ，请参考 [webpack 官方文档 - 从 v1 迁移到 v2](https://doc.webpack-china.org/guides/migrating/)
>
> 2) 阅读建议
>
>    阅读本文前，建议先阅读 [Webpack 概念](https://github.com/dunwu/frontend-tutorial/blob/master/docs/chapter03/webpack/concept.md) 。

代码分离是 webpack 中最引人注目的特性之一。

你可以把你的代码分离到不同的 bundle 中，然后你就可以去按需加载这些文件。

总的来说， `webpack`  分离可以分为两类：

- 资源分离
- 代码分离

## 资源分离(Resource Splitting)

对第三方库(vendor) 和 CSS 进行代码分离，这些方式有助于实现缓存和并行加载。

### 分离 CSS(CSS Splitting)

你可能也想将你的样式代码分离到单独的 bundle 中，以此使其独立于应用程序逻辑。这加强了样式的可缓存性，并且使得浏览器能够并行加载应用程序代码中的样式文件，避免 FOUC 问题 ([无样式内容造成的闪烁](https://en.wikipedia.org/wiki/Flash_of_unstyled_content))。

安装  [`ExtractTextWebpackPlugin`](https://doc.webpack-china.org/plugins/extract-text-webpack-plugin)  如下

```bash
$ npm install --save-dev extract-text-webpack-plugin
```

webpack.config.js 中需要按下面进行配置：

```js
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  // 关于模块配置
  module: {
    // 模块规则（配置 loader、解析器等选项）
    rules: [
      {
        // css 加载
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader"
        })
      }
    ]
  },

  // 附加插件列表
  plugins: [
    // 将样式文件独立打包
    new ExtractTextPlugin("styles.css")
  ]
};
```

> ​:flashlight: **示例 DEMO09：** ([**DEMO**](https://dunwu.github.io/frontend-tutorial/chapter03/webpack2/demo09/dist/index.html) / [**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter03/webpack2/demo09))

### 分离第三方库(Vendor Code Splitting)

一个典型的应用程序，由于框架/功能性需求，会依赖于许多第三方库的代码。不同于应用程序代码，这些第三方库代码不会频繁修改。

如果我们将这些库(library)中的代码，保留在与应用程序代码相独立的 bundle 中，我们就可以利用浏览器缓存机制，把这些文件长时间地缓存在用户机器上。

为了完成这个目标，不管应用程序代码如何变化，vendor 文件名中的  `hash`  部分必须保持不变。学习如何使用  `CommonsChunkPlugin` [分离 vendor/library](https://doc.webpack-china.org/guides/code-splitting-libraries)  代码。

webpack.config.js

```js
const webpack = require("webpack");

module.exports = {
  // 这里应用程序开始执行
  // webpack 开始打包
  // 本例中 entry 为多入口
  entry: {
    main: "./app/index",
    vendor: "react"
  },

  // webpack 如何输出结果的相关选项
  output: {
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    path: path.resolve(__dirname, "dist"),

    // 「入口分块(entry chunk)」的文件名模板（出口分块？）
    // filename: "bundle.min.js",
    // filename: "[name].js", // 用于多个入口点(entry point)（出口点？）
    // filename: "[chunkhash].js", // 用于长效缓存
    filename: "[name].[chunkhash:8].js" // 用于长效缓存
  },

  // 附加插件列表
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor" // 指定公共 bundle 的名字。
    })
  ]
};
```

在上面的配置中，

1. 在 `entry` 属性中，将 react 指定为一个独立的入口 **vendor**；
2. 然后，在 `output` 属性中，将 **filename** 指定为 [name].[chunkhash:8].js，这表示输出文件的文件名样式。
3. 最后在 `plugins` 列表中引入 **CommonsChunkPlugin** 插件，用来指定 bundle 。

执行 webpack 命令后，webpack 会生成 2 个 bundle 文件，形式如：

```
main.bef8f974.js
vendor.2f1bd4c8.js
```

> ​:flashlight: **示例 DEMO10：** ([**DEMO**](https://dunwu.github.io/frontend-tutorial/chapter03/webpack2/demo10/dist/index.html) / [**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter03/webpack2/demo10))

## 代码按需分离(On Demand Code Splitting)

虽然前面几类资源分离，需要用户预先在配置中指定分离模块，但也可以在应用程序代码中创建动态分离模块。

这可以用于更细粒度的代码块，例如，根据我们的应用程序路由，或根据用户行为预测。这可以使用户按照实际需要加载非必要资源。

前一节，我们了解了 webpack 可以将资源拆分为 bundle。接下来，我们要学习如何异步加载。例如，这允许首先提供最低限度的引导 bundle，并在稍后再异步地加载其他功能。

webpack 支持两种相似的技术实现此目的：使用  `import()` (推荐，ECMAScript 提案) 和  `require.ensure()` (遗留，webpack 特定)。本文只介绍官方推荐的 `import()` 方式。

[ES2015 loader 规范](https://whatwg.github.io/loader/)定义了  `import()`  作为一种在运行时(runtime)动态载入 ES2015 模块的方法。

webpack 把  `import()`  作为一个分离点(split-point)，并把引入的模块作为一个单独的 chunk。 `import()`  将模块名字作为参数并返回一个  `Promoise`  对象，即  `import(name) -> Promise`

### 配合 Babel 使用

如果你想要在  [Babel](http://babeljs.io/)  中使用  `import`，但是由于 import() 还是属于 Stage 3 的特性，所以你需要安装/添加  [`syntax-dynamic-import`](http://babeljs.io/docs/plugins/syntax-dynamic-import/)  插件来避免 parser 报错。在草案正式成为规范后，就不再需要这个插件了。

例：

我们来定义一个 Clock 组件，动态引入 moment 库。

首先，安装 moment 库。

```bash
$ npm install --save-dev moment
```

JavaScript 代码：

```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date().toLocaleDateString() };
    this.click = this.click.bind(this);
  }

  click() {
    // 动态引入import()
    import("moment")
      .then(moment => moment().format("MMMM Do YYYY, h:mm:ss a"))
      .then(str => this.setState({ date: str }))
      .catch(err => console.log("Failed to load moment", err));
  }

  render() {
    return (
      <div>
        <h2>It is {this.state.date}.</h2>
        <p onClick={this.click}>Click here to changing the time.</p>
      </div>
    );
  }
}
```

webpack.config.js

```js
// 关于模块配置
module: {

  // 模块规则（配置 loader、解析器等选项）
  rules: [
    {
      // 语义解释器，将 js/jsx 文件中的 es2015/react 语法自动转为浏览器可识别的 Javascript 语法
      test: /\.jsx?$/,
      include: path.resolve(__dirname, "app"),

      // 应该应用的 loader，它相对上下文解析
      // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
      // 查看 webpack 1 升级指南。
      loader: "babel-loader",

      // loader 的可选项
      options: {
        presets: ["es2015", "react"],
        plugins: ['syntax-dynamic-import']
      },
    },
  ]
},
```

> ​:flashlight: **示例 DEMO11：** ([**DEMO**](https://dunwu.github.io/frontend-tutorial/chapter03/webpack2/demo11/dist/index.html) / [**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter03/webpack2/demo11))

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
