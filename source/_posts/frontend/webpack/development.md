---
title: Webpack 开发工具
date: 2019-03-06
---

# Webpack 开发工具

> ​:warning: **注意：**
> 永远不要在生产环境中使用这些工具，永远不要。

## devtool

当 JavaScript 异常抛出时，你常会想知道这个错误发生在哪个文件的哪一行。然而因为 webpack 将文件输出为一个或多个 bundle，所以 追踪这一错误会很不方便。

**Source maps**  试图解决这一问题。它有很多选择，各有优劣：

| devtool                      | build | rebuild | production | quality                       |
| ---------------------------- | ----- | ------- | ---------- | ----------------------------- |
| eval                         | +++   | +++     | no         | generated code                |
| cheap-eval-source-map        | +     | ++      | no         | transformed code (lines only) |
| cheap-source-map             | +     | o       | yes        | transformed code (lines only) |
| cheap-module-eval-source-map | o     | ++      | no         | original source (lines only)  |
| cheap-module-source-map      | o     | -       | yes        | original source (lines only)  |
| eval-source-map              | --    | +       | no         | original source               |
| source-map                   | --    | --      | yes        | original source               |
| nosources-source-map         | --    | --      | yes        | without source content        |

> `+`  表示较快，`-`  表示较慢，`o`  表示时间相同

对于开发环境，通常希望更快速的 Source Map，需要添加到 bundle 中以增加体积为代价，但是对于生产环境，则希望更精准的 Source Map，需要从 bundle 中分离并独立存在。

个人建议：开发环境使用 `cheap-module-eval-source-map` ；开发环境使用 `cheap-module-source-map` 。

使用方式非常简单，在 `webpack.config.js` 中配置如下：

```js
module.exports = {
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // devtool: "eval", // 没有模块映射，而是命名模块。以牺牲细节达到最快。
  // devtool: "source-map", // 牺牲了构建速度的 `source-map' 是最详细的
  // devtool: "inline-source-map", // 嵌入到源文件中
  // devtool: "eval-source-map", // 将 SourceMap 嵌入到每个模块中
  // devtool: "hidden-source-map", // SourceMap 不在源文件中引用
  // devtool: "cheap-source-map", // 没有模块映射(module mappings)的 SourceMap 低级变体(cheap-variant)
  // devtool: "cheap-module-source-map", // 有模块映射(module mappings)的 SourceMap 低级变体
  devtool: "cheap-module-eval-source-map"
};
```

## webpack-dev-server

**webpack-dev-server** 可以提供了一个服务器和实时重载（live reloading） 功能。

在开始前，确定你有一个  `index.html`  文件指向你的 bundle。假设  `output.filename`  是  `bunlde.js`。

```html
<html>
<body>
<script type="text/javascript" src="./dist/bundle.js"></script>
</body>
</html>
```

首先从 npm 安装  `webpack-dev-server`：

```bash
$ npm install --save-dev webpack-dev-server
```

安装完成之后，你应该可以使用  `webpack-dev-server`  了，方式如下：

```bash
$ webpack-dev-server --open
```

上述命令应该自动在浏览器中打开  `http://localhost:8080`。

> ​:pushpin: **提示：**
>
> 本教程中的 [**示例代码**](https://github.com/dunwu/frontend-tutorial/tree/master/codes) 除了 `demo00` ，都可以使用 webpack-dev-server 命令启动服务。

在你的文件中做一点更改并且保存。你应该可以在控制台中看到正在编译。编译完成之后，页面应该会刷新。如果控制台中什么都没发生，你可能需要调整下  [`watchOptions`](https://doc.webpack-china.org/configuration/dev-server#devserver-watchoptions-)。

默认情况下 webpack 会使用**inline mode**（内联模式）。这种模式在你的 bundle 中注入客户端（用来 live reloading 和展示构建错误）。Inline 模式下，你会在你的 DevTools 控制台中看到构建错误。

**webpack-dev-server** 可以做很多事情，比如转发请求到你的后端服务器。

**webpack-dev-server** 支持很多 cli 参数，来手动配置服务的选项。

但是，个人建议，一种更好的做法是在 `webpack.config.js` 文件中通过配置 `devServer` 属性来配置 webpack-dev-server 。

更多配置项参考：[官方文档 - 开发中 Server(DevServer)](https://doc.webpack-china.org/configuration/dev-server/)

> ​:flashlight: **示例 DEMO12：** ([**DEMO**](https://dunwu.github.io/frontend-tutorial/chapter03/webpack2/demo12/dist/index.html) / [**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter03/webpack2/demo12))
>
> 在本示例中，devServer 配置如下：
>
> ```
> devServer: {
>   contentBase: [path.join(__dirname, "dist")],
>   compress: true,
>   port: 9000, // 启动端口号
>   inline: true,
> }
> ```
>
> 执行 webpack-dev-server 后，会启动一个端口为 9000 的本地服务。

### 热模块替换（Hot Module Replacement）

> ​:pushpin:​ **提示：**
>
> 模块热替换功能一般用于开发环境。

现在你有了实时重载功能，你甚至可以更进一步：Hot Module Replacement（热模块替换）。这是一个接口，使得你可以替换模块**而不需要刷新页面**。不用每次修改都重新启动服务，这可以极大地提高开发效率。

那么，如何配置 webpack 来实现热替换呢？

请按以下步骤一步步来：

首先，安装依赖  `react-hot-loader`（确保使用这个包的  `next`  版本）

```bash
$ npm install --save babel-loader react-hot-loader@next
```

**配置 entry**

你需要定义几个用于热替换的入口路径

```js
entry: {
  main: [
    // App 入口
    "./app/index",

    // 开启 React 代码的模块热替换(HMR)
    'react-hot-loader/patch',

    // 为 webpack-dev-server 的环境打包代码
    // 然后连接到指定服务器域名与端口
    'webpack-dev-server/client?http://localhost:9000',

    // 为热替换(HMR)打包好代码
    // only- 意味着只有成功更新运行代码才会执行热替换(HMR)
    'webpack/hot/only-dev-server',
  ],
},
```

**配置 output**

`publicPath` 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)

```js
output: {
  ... ...
  // 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)
  publicPath: "/"
},
```

**配置 module**

需要使用 ES2015 模块来使 HMR 正常工作。为此，在我们的 es2015 preset 设置中，将  `module`  选项设置为 false。

并且，在此要引入 `react-hot-loader/babel` 开启 React 代码的模块热替换(HMR)

```js
module: {

    rules: [
      {
        // 语义解释器，将 js/jsx 文件中的 es2015/react 语法自动转为浏览器可识别的 Javascript 语法
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "app"),
        exclude: /node_modules/,

        // 应该应用的 loader，它相对上下文解析
        // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
        // 查看 webpack 1 升级指南。
        loader: "babel-loader",

        // loader 的可选项
        options: {
          presets: [
            // webpack 现在已经支持原生的 import 语句了, 并且将其运用在 tree-shaking 特性上
            [
              "es2015",
              {
                "modules": false
              }
            ],

            "react" // 转译 React 组件为 JavaScript 代码
          ],
          plugins: [
            "react-hot-loader/babel" // 开启 React 代码的模块热替换(HMR)
          ]
        },
      },
    ]
  },
```

**配置 devServer**

此处，也需要引入 `publicPath` ，且和上文 `output` 的 `publicPath` 值保持一致。

`hot` 属性需要置为 true，表示开启服务器的模块热替换。

```js
devServer: {
  contentBase: [path.join(__dirname, "dist")],
  compress: true,
  port: 9000, // 启动端口号
  hot: true, // 启用 webpack 的模块热替换特性
  inline: true,
  publicPath: "/", // 和上文 output 的“publicPath”值保持一致
}
```

**配置 plugins**

最后，需要开启 webpack 自带的 `HotModuleReplacementPlugin` 和 `NamedModulesPlugin` 插件，启动热替换功能。

```js
plugins: [
  // 开启全局的模块热替换(HMR)
  new webpack.HotModuleReplacementPlugin(),

  // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
  new webpack.NamedModulesPlugin(),
],
```

> ​:flashlight: **示例 DEMO13：** ([**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter03/webpack2/demo13))
>
> 在示例中，启动服务后，打开浏览器，访问 http://localhost:9000/ 。
>
> 按快捷键 `F12` 打开浏览器调试窗口，可以看到类似提示信息
>
> ```
> [HMR] Waiting for update signal from WDS...
> [HMR] Waiting for update signal from WDS...
> [WDS] Hot Module Replacement enabled.
> ```
>
> 这表示热替换功能已启动。
>
> 修改 `app/index.jsx` 文件，来看看热替换的效果：
>
> 修改前：
>
> ```js
> ReactDOM.render(
>   <Welcome name="Zhang Peng" />,
>   document.getElementById("root")
> );
> ```
>
> 修改后：
>
> ```js
> ReactDOM.render(<Welcome name="guest" />, document.getElementById("root"));
> ```
>
> 此时，应该看到页面内容会替换为你修改的内容。

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
