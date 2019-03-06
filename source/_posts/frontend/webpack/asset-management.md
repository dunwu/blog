---
title: Webpack 资源管理
date: 2019-03-06
---

# Webpack 资源管理

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

## webpack 的优势

**webpack** 最重要的功能就是资源管理。

JavaScript 世界已有好几个有名的资源管理工具，webpack 有什么独到之处呢？

在 **webpack** 出现之前，前端开发人员会使用 **grunt** 和 **gulp** 等工具来处理这些 web 资源，如样式文件（例如  `.css`, `.less`, `.sass`），图片（例如  `.png`, `.jpg`, `.svg`），字体（例如  `.woff`, `.woff2`, `.eot`）和数据（例如  `.json`, `.xml`, `.csv`）等，并将它们从  `/src`  文件夹移动到  `/dist`  或  `/build`  目录中。

而 webpack 从 `entry(入口)` 开始，访问应用程序，并**动态打包(dynamically bundle)**所有依赖项。这是极好的创举，因为现在每个模块都可以明确表述它自身的依赖，这可以避免打包未使用的模块。

## Loader

`Loader(加载器)` 用于对模块的源代码进行转换。

使用加载器一般遵循几步：

1. 安装加载器
2. 配置 Loader
3. 引用资源文件

### 安装加载器

根据需要加载的资源文件，选择下载对应的加载器。

```bash
$ npm install --save-dev css-loader
```

更多 webpack 可用 Loader 请查看：[webpack loaders](https://doc.webpack-china.org/loaders/)

### 配置 Loader

> ​:warning: **注意：**
>
> `webpack 2.x` 版本的 Loader 配置和 `webpack 1.x` 版本差别很大。

Loader 在 `webpack.config.js` 文件的 `module` 属性中配置。

**资源类型对应单一加载器**

```js
module: {
  rules: [
    {test: /\.css$/, loader: 'css-loader'}
  ]
},
```

**资源类型对应多个加载器**

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    }
  ]
},
```

**加载器含配置选项**

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }
      ]
    }
  ]
},
```

### 引用资源文件

完成上两步后，就可以在 JavaScript 中使用 `import` ，`require` 关键字引用相应类型资源文件。

```js
import "./index.css";
require("./index.css");
```

## Plugin

`Plugin(插件)` 用于解决 Loader 无法解决的问题，它是 Loader 的辅助。

由于  **plugin**  可以携带参数/选项，你必须在 wepback 配置中，向  `plugins`  属性传入  `new`  实例。

### 安装插件

webpack 自身包含了一些常用插件，你可以通过 webpack 来引用。除此之外的插件，使用前需要安装

```bash
$ npm install --save-dev html-webpack-plugin OpenBrowserPlugin
```

更多 webpack Plugins 可以查看： [webpack plugins](https://doc.webpack-china.org/plugins/)

### 配置 Plugin

```js
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");

module.exports = {
  // 附加插件列表
  plugins: [
    // 压缩 js 插件
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    // 用于简化 HTML 文件（index.html）的创建，提供访问 bundle 的服务。
    new HtmlWebpackPlugin({
      title: "frontend-tutorial",
      template: "./index.html"
    }),

    // 自动打开浏览器
    new OpenBrowserPlugin({
      url: "http://localhost:8080"
    })
  ]
};
```

## 加载资源专题

### 加载 React

很多浏览器并不识别 React 语法，为了让浏览器支持，你需要使用 **babel-loader** 解释器来转义 React 语法为普通的 Javascript 语法。

> :warning: **注意：**
>
> 官方推荐 babel-loader 和 webpack 的对应版本
>
> webpack 1.x | babel-loader <= 6.x
>
> webpack 2.x | babel-loader >= 7.x （推荐）（^6.2.10 也可以运行，但会有不赞成的警告(deprecation warnings)）

首先，安装需要使用的库：

```bash
$ npm install --save-dev babel-loader babel-preset-es2015 babel-preset-react
```

babel-preset-xxx 表示你希望转义的语法。

webpack.config.js 中的模块配置如下：

```js
// 关于模块配置
module: {

  // 模块规则（配置 loader、解析器等选项）
  rules: [
    // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
    // test 和 include 具有相同的作用，都是必须匹配选项
    // exclude 是必不匹配选项（优先于 test 和 include）
    // 最佳实践：
    // - 只在 test 和 文件名匹配 中使用正则表达式
    // - 在 include 和 exclude 中使用绝对路径数组
    // - 尽量避免 exclude，更倾向于使用 include
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
        presets: ["es2015", "react"]
      },
    },
  ]
},
```

> ​:flashlight: **示例 DEMO04：** ([**DEMO**](https://dunwu.github.io/frontend-tutorial/chapter03/webpack2/demo04/dist/index.html) / [**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter03/webpack2/demo04))

### 加载 CSS

为了从 JavaScript 模块中  `import`  一个 CSS 文件，你只需要在 module 中安装并添加  [style-loader](https://doc.webpack-china.org/loaders/style-loader)  和  [css-loader](https://doc.webpack-china.org/loaders/css-loader) 。

```bash
$ npm install --save-dev style-loader css-loader
```

**webpack.config.js**

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["css-loader", "style-loader"]
      }
    ]
  }
  //...
};
```

好了，此时你就可以在代码中通过  `import './style.css'` 的方式引入 CSS 文件。

其余，加载 less，sass 等样式文件也是大同小异，不一一细说。

> :flashlight: **示例 DEMO06：** ([**DEMO**](https://dunwu.github.io/frontend-tutorial/chapter03/webpack2/demo06/dist/index.html) / [**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter03/webpack2/demo06))

### 加载图片

如何打包、加载图片呢？你可以使用 file-loader 来指定要加载的图片。

```bash
$ npm install --save-dev file-loader
```

**webpack.config.js**

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
  //...
};
```

然后，你可以通过 `import imgBig from './lion.png'` 的方式引入图片。例：

```jsx
import React from "react";
import imgBig from "./lion.png";

class Welcome extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Hello, {this.props.name}</h1>
        <img src={imgBig} />
      </div>
    );
  }
}
export default Welcome;
```

#### 压缩图片

这还不算完，日常开发中，经常会遇到有些图片文件过大的问题，这会影响你的 app 的加载速度。webpack 提供了压缩图片的方法帮你解决图片大的问题。

首先，你需要安装 **image-webpack-loader**

```bash
$ npm i --save-dev image-webpack-loader
```

接下来，修改 webpack.config.js

```js
{
  // 图片加载 + 图片压缩
  test: /\.(png|svg|jpg|gif)$/,
  loaders: [
    "file-loader",
    {
      loader: "image-webpack-loader",
      query: {
        progressive: true,
        pngquant: {
          quality: "65-90",
          speed: 4
        }
      }
    }
  ]
}
```

> :flashlight: **示例 DEMO07：** ([**DEMO**](https://dunwu.github.io/frontend-tutorial/chapter03/webpack2/demo07/dist/index.html) / [**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter03/webpack2/demo07))

### 加载字体

那么，像字体这样的其他资源如何处理呢？file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录。这就是说，我们可以将它们用于任何类型的文件，包括字体：

**webpack.config.js**

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        use: ["file-loader"]
      }
    ]
  }
  //...
};
```

一切就绪后，你可以在 css 文件中这样引入字体：

```css
@font-face {
  font-family: "MyDiyFont";
  src: url("./font/iconfont.eot"); /* IE9*/
  src: url("./font/iconfont.eot?#iefix") format("embedded-opentype"), /* IE6-IE8 */
      url("./font/iconfont.woff") format("woff"),
    /* chrome、firefox */ url("./font/iconfont.ttf") format("truetype"), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url("./font/iconfont.svg#iconfont") format("svg"); /* iOS 4.1- */
}

h1 {
  font-family: "MyDiyFont";
  font-size: 24px;
}

p {
  font-family: "MyDiyFont";
  font-size: 18px;
}
```

然后，相对路径，会被替换为构建目录中的完整路径/文件名。

> :flashlight: **示例 DEMO08：** ([**DEMO**](https://dunwu.github.io/frontend-tutorial/chapter03/webpack2/demo08/dist/index.html) / [**SOURCE**](https://github.com/dunwu/frontend-tutorial/tree/master/codes/chapter03/webpack2/demo08))

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
