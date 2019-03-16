---
title: ngular、React、Vue
date: 2019-03-06
---

# ngular、React、Vue

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/20181106151530.png"/></div><br>

<!-- TOC depthFrom:2 depthTo:3 -->

- [框架成熟度](#框架成熟度)
- [React，Angular 和 Vue 的比较](#reactangular-和-vue-的比较)
    - [Typescript，ES6 与 ES5](#typescriptes6-与-es5)
    - [JSX 还是 HTML](#jsx-还是-html)
    - [框架和库](#框架和库)
    - [状态管理和数据绑定](#状态管理和数据绑定)
    - [其他的编程概念](#其他的编程概念)
    - [灵活性与精简到微服务](#灵活性与精简到微服务)
    - [体积和性能](#体积和性能)
    - [测试](#测试)
    - [通用与原生 app](#通用与原生-app)
    - [学习曲线](#学习曲线)
- [总结](#总结)
    - [如何选择 React、Vue、Angular？](#如何选择-reactvueangular)
- [更多内容](#更多内容)

<!-- /TOC -->

## 框架成熟度

活跃度：

Github Star 数：React > Vue > Angular
贡献者数：React > Angular > Vue

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/20181106151737.png"/></div><br>

## React，Angular 和 Vue 的比较

React 和 Vue 都擅长处理组件：小型的无状态的函数接收输入和返回元素作为输出。

### Typescript，ES6 与 ES5

- React 专注于使用 Javascript ES6；
- Vue 使用 Javascript ES5 或 ES6；
- Angular 依赖于 TypeScript。

> 注：与整个 JavaScript 语言相比，TypeScript 的用户群仍然很小。TypeScript 存在消失的可能性。

### JSX 还是 HTML

JSX 是一个类似 HTML 语法的可选预处理器，并随后在 JavaScript 中进行编译。JSX 对于开发来说是一个很大的优势，因为代码写在同一个地方，可以在代码完成和编译时更好地检查工作成果。当你在 JSX 中输入错误时，React 将不会编译，并打印输出错误的行号。

JSX 意味着 React 中的所有内容都是 Javascript -- 用于 JSX 模板和逻辑。

- React 使用 JSX；
- Angular 2 继续把 'JS' 放到 HTML 中；Angular 模板使用特殊的 Angular 语法来增强 HTML；
- Vue 具有“单个文件组件”。这似乎是对于关注分离的权衡 - 模板，脚本和样式在一个文件中，但在三个不同的有序部分中。

注：把 html 放到 js 是好的选择，因为 js 比 html 更强大。

### 框架和库

- Angular 是一个框架而不是一个库，因为它提供了关于如何构建应用程序的强有力的约束，并且还提供了更多开箱即用的功能。
- React 和 Vue 是很灵活的。他们的库可以和各种包搭配。

### 状态管理和数据绑定

React 经常与 Redux 在一起使用。Redux 以三个基本原则来自述：

- 单一数据源（Single source of truth）
- State 是只读的（State is read-only）
- 使用纯函数执行修改（Changes are made with pure functions）

整个应用程序的状态存储在单个 store 的状态树中。这有助于调试应用程序，一些功能更容易实现。状态是只读的，只能通过 action 来改变，以避免竞争条件（这也有助于调试）。

React 和 Angular 之间的巨大差异是 单向与双向绑定。

Vue 支持单向绑定和双向绑定（默认为单向绑定）。

### 其他的编程概念

Angular 包含依赖注入（dependency injection），即一个对象将依赖项（服务）提供给另一个对象（客户端）的模式。这导致更多的灵活性和更干净的代码。

模型 - 视图 - 控制器模式（MVC）将项目分为三个部分：模型，视图和控制器。Angular（MVC 模式的框架）有开箱即用的 MVC 特性。React 只有 V —— 你需要自己解决 M 和 C。

### 灵活性与精简到微服务

React 和 Vue 通过只选择真正需要的东西，你可以更好地控制应用程序的大小。它们提供了更灵活的方式去把一个老应用的一部分从单页应用（SPA）转移到微服务。Angular 最适合单页应用（SPA），因为它可能太臃肿而不能用于微服务。

React 可以让你将应用程序的一小部分替换成更好用的 JS 库，而不是期待你的框架能够创新。小巧，可组合的单一用途工具的理念永远不会过时。

总结一下：Vue 有着很好的性能和高深的内存分配技巧。如果比较快慢的话，这些框架都非常接近（比如 Inferno）。请记住，性能基准只能作为考虑的附注，而不是作为判断标准。

### 体积和性能

Angular 框架非常臃肿。gzip 文件大小为 143k，而 Vue 为 23K，React 为 43k。

为了提高性能，React 和 Vue 都使用了虚拟 DOM（Virtual DOM）。

### 测试

- Facebook 使用 Jest 来测试其 React 代码。
- Angular 2 中使用 Jasmine 作为测试框架。
- Vue 缺乏测试指导

### 通用与原生 app

React 和 Angular 都支持原生开发。Angular 拥有用于原生应用的 NativeScript（由 Telerik 支持）和用于混合开发的 Ionic 框架。借助 React，你可以试试 react-native-renderer 来构建跨平台的 iOS 和 Android 应用程序，或者用 react-native 开发原生 app。许多 app（包括 Facebook；查看更多的展示）都是用 react-native 构建的。

### 学习曲线

Angular 的学习曲线确实很陡。
对于 React，你可能需要针对第三方库进行大量重大决策。
Vue 学习起来很容易。

总结：如果你是一个没有经验的 Javascript 开发人员 - 或者如果你在过去十年中主要使用 jQuery，那么你应该考虑使用 Vue。转向 React 时，思维方式的转换更为明显。Vue 看起来更像是简单的 Javascript，同时也引入了一些新的概念：组件，事件驱动模型和单向数据流。这同样是很小的部分。

在调试方面，React 和 Vue 的黑魔法更少是一个加分项。找出 bug 更容易，因为需要看的地方少了，堆栈跟踪的时候，自己的代码和那些库之间有更明显的区别。

## 总结

### 如何选择 React、Vue、Angular？

- 我应该选什么？如果你在 Google 工作：Angular
- 如果你喜欢 TypeScript：Angular（或 React）
- 如果你喜欢面向对象编程（OOP）: Angular
- 如果你需要指导手册，架构和帮助：Angular
- 如果你在 Facebook 工作：React
- 如果你喜欢灵活性：React
- 如果你喜欢大型的技术生态系统：React
- 如果你喜欢在几十个软件包中进行选择：React
- 如果你喜欢 JS 和“一切都是 Javascript 的方法”：React
- 如果你喜欢真正干净的代码：Vue
- 如果你想要最平缓的学习曲线：Vue
- 如果你想要最轻量级的框架：Vue
- 如果你想在一个文件中分离关注点：Vue
- 如果你一个人工作，或者有一个小团队：Vue（或 React）
- 如果你的应用程序往往变得非常大：Angular（或 React）
- 如果你想用 react-native 构建一个应用程序：React
- 如果你想在圈子中有很多的开发者：Angular 或 React
- 如果你与设计师合作，并需要干净的 HTML 文件：Angular or Vue
- 如果你喜欢 Vue 但是害怕有限的技术生态系统：React
- 如果你不能决定，先学习 React，然后 Vue，然后 Angular。

## 更多内容

- [[译] 2017 年比较 Angular、React、Vue 三剑客](https://juejin.im/post/5a0d5df1f265da43062a542f)
