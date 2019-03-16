---
id: react-quickstart
title: React 快速入门
---

# React 快速入门

<!-- TOC depthFrom:2 depthTo:3 -->

- [安装](#安装)
- [Introducing JSX](#introducing-jsx)
    - [JSX 中嵌入表达式](#jsx-中嵌入表达式)
    - [JSX 也是一个表达式](#jsx-也是一个表达式)
    - [用 JSX 指定属性值](#用-jsx-指定属性值)
    - [用 JSX 指定子元素](#用-jsx-指定子元素)
    - [JSX 防止注入攻击](#jsx-防止注入攻击)
    - [JSX 表示对象](#jsx-表示对象)
- [渲染元素](#渲染元素)
    - [渲染一个元素到 DOM](#渲染一个元素到-dom)
    - [更新已渲染的元素](#更新已渲染的元素)
    - [React 只更新必需要更新的部分](#react-只更新必需要更新的部分)
- [组件(Components) 和 属性(Props)](#组件components-和-属性props)
    - [函数式组件和类组件](#函数式组件和类组件)
    - [渲染一个组件](#渲染一个组件)
    - [构成组件](#构成组件)
    - [提取组件](#提取组件)
    - [Props 是只读的](#props-是只读的)
- [把函数式组件转化为类组件](#把函数式组件转化为类组件)
- [在类组件中添加本地状态(state)](#在类组件中添加本地状态state)
- [在类中添加生命周期方法](#在类中添加生命周期方法)
- [正确地使用 State(状态)](#正确地使用-state状态)
    - [不要直接修改 state(状态)](#不要直接修改-state状态)
    - [state(状态) 更新可能是异步的](#state状态-更新可能是异步的)
    - [state(状态)更新会被合并](#state状态更新会被合并)
- [数据向下流动](#数据向下流动)
    - [元素变量](#元素变量)
    - [使用逻辑 && 操作符的内联 if 用法](#使用逻辑--操作符的内联-if-用法)
    - [使用条件操作符的内联 If-Else](#使用条件操作符的内联-if-else)
    - [防止组件渲染](#防止组件渲染)
    - [多组件渲染](#多组件渲染)
    - [基本列表组件](#基本列表组件)
- [键(Keys)](#键keys)
    - [使用 keys 提取组件](#使用-keys-提取组件)
    - [keys 在同辈元素中必须是唯一的](#keys-在同辈元素中必须是唯一的)
    - [在 JSX 中嵌入 map()](#在-jsx-中嵌入-map)
- [受控组件(Controlled Components)](#受控组件controlled-components)
- [textare 标签](#textare-标签)
- [select 标签](#select-标签)
- [处理多个输入元素](#处理多个输入元素)
- [受控组件的替代方案](#受控组件的替代方案)
- [添加第二个输入](#添加第二个输入)
- [编写转换函数](#编写转换函数)
- [状态提升(Lifting State Up)](#状态提升lifting-state-up)
- [经验总结](#经验总结)
- [包含](#包含)
- [特例](#特例)
- [如何看待？](#如何看待)

<!-- /TOC -->

## 安装

1. 直接下载使用

React 可以直接下载使用，下载包中也提供了很多学习的实例。

你可以在官网  [http://facebook.github.io/react/](http://facebook.github.io/react/)  下载最新版。

2. 通过 npm 使用 React

```sh
$ npm install -S react react-dom
```

3. 通过 yarn 使用 React

```sh
$ yarn add react react-dom
```

4. 使用各种快速构建工具

   目前最流行的构建工具应该是 create-react-app，它使得用户可以通过命令就能快速构建 React 开发环境。

   create-react-app 自动创建的项目是基于 Webpack + ES6 。

```sh
$ npm install -g create-react-app
$ create-react-app my-app
$ cd my-app/
$ npm start
```

## Introducing JSX

考虑一下这个变量的声明：

```
const element = <h1>Hello, world!</h1>;

```

这种有趣的标签语法既不是字符串也不是 HTML。

这就是 JSX ，他是 JavaScrip 的一种扩展语法。我们推荐在 React 中使用这种语法来描述 UI 信息。JSX 可能会让你想起某种模板语言，但是它具有 JavaScrip 的全部能力。

JSX 可以生成 React "元素"。我们将在[下一章](http://www.css88.com/react/docs/rendering-elements.html)探索如何把它渲染到 DOM 上。下面你可以找到 JSX 的基础知识，以帮助您开始使用。

### JSX 中嵌入表达式

你可以用 花括号 把任意的  [JavaScript 表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions)  嵌入到 JSX 中。

例如，`2 + 2`， `user.firstName`， 和  `formatName(user)`，这些都是可用的表达式。

```
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/PGEjdG?editors=0010)。

为便于阅读，我们将 JSX 分割成多行。我们推荐使用括号将 JSX 包裹起来，虽然这不是必须的，但这样做可以避免[分号自动插入](http://stackoverflow.com/q/2846283)的陷阱。

### JSX 也是一个表达式

编译之后，JSX 表达式就变成了常规的 JavaScript 对象。

这意味着你可以在  `if`  语句或者是  `for`  循环中使用 JSX，用它给变量赋值，当做参数接收，或者作为函数的返回值。

```
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}

```

### 用 JSX 指定属性值

您可以使用双引号来指定字符串字面量作为属性值：

```
const element = <div tabIndex="0"></div>;

```

您也可以用花括号嵌入一个 JavaScript 表达式作为属性值:

```
const element = <img src={user.avatarUrl}></img>;

```

在属性中嵌入 JavaScript 表达式时，不要使用引号来包裹大括号。否则，JSX 将该属性视为字符串字面量而不是表达式。对于字符串值你应该使用引号，对于表达式你应该使用大括号，但两者不能同时用于同一属性。

### 用 JSX 指定子元素

如果是空标签，您应该像 XML 一样，使用  `/>`立即闭合它：

```
const element = <img src={user.avatarUrl} />;

```

JSX 标签可能包含子元素：

```
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);

```

> **警告：**
>
> 比起 HTML ， JSX 更接近于 JavaScript ， 所以 React DOM 使用驼峰(`camelCase`)属性命名约定, 而不是 HTML 属性名称。
>
> 例如，`class`  在 JSX 中变为[`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)，`tabindex`  变为  [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex)。

### JSX 防止注入攻击

在 JSX 中嵌入用户输入是安全的：

```
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;

```

默认情况下， 在渲染之前, React DOM 会格式化([escapes](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html)) JSX 中的所有值. 从而保证用户无法注入任何应用之外的代码. 在被渲染之前，所有的数据都被转义成为了字符串处理。 以避免  [XSS(跨站脚本)](https://en.wikipedia.org/wiki/Cross-site_scripting)  攻击。

### JSX 表示对象

Babel 将 JSX 编译成  `React.createElement()`  调用。

下面的两个例子是是完全相同的：

```
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);

```

```
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);

```

`React.createElement()`  会执行一些检查来帮助你编写没有 bug 的代码，但基本上它会创建一个如下所示的对象：

```
// 注意: 这是简化的结构
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world'
  }
};

```

这些对象被称作“React 元素”。你可以把他们想象成为你想在屏幕上显示内容的一种描述。React 会读取这些对象，用他们来构建 DOM，并且保持它们的不断更新。

我们将在下一节中来探索如何将 React 元素渲染到 DOM 上。

> **提示:**
>
> 我们建议你去搜一下你用的编辑器的 "Babel" 语法方案, 以便 ES6 和 JSX 代码都能够被正确高亮的显示。

## 渲染元素

元素(Elements)是 React 应用中最小的建造部件（或者说构建块，building blocks）。

一个元素用于描述你在将在屏幕上看到的内容：

```
const element = <h1>Hello, world</h1>;

```

不同于浏览器的 DOM 元素， React 元素是普通的对象，非常容易创建。React DOM 会负责更新 DOM ，以匹配 React 元素（愚人码头注：DOM 元素与 React 元素保持一致）。

> **注意：**
>
> 有人可能会将元素与更广为人知的 "组件(Components)" 概念相混淆。我们将在[下一节](http://www.css88.com/react/docs/components-and-props.html)介绍组件。元素是构成组件的"材料"， 所以我们建议你看完本节再进入下一节。

### 渲染一个元素到 DOM

我们假设你的 HTML 文件中的什么地方有这么一个``：

```
<div id="root"></div>

```

我们称这个是一个 "根" DOM 节点，因为该节点内的所有内容都由 React DOM 管理。

单纯用 React 构建的应用程序通常只有一个单独的 根 DOM 节点。但如果你要把 React 整合进现有的 app 中 ，那你可能会有多个相互独立的根 DOM 节点。

要渲染一个 React 元素到一个 根 DOM 节点，吧它们传递给  `ReactDOM.render()`  方法：

```
const element = <h1>Hello, world</h1>;
ReactDOM.render(
  element,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/rrpgNB?editors=1010)。

上面代码会在页面上显示 "Hello, world" 。

### 更新已渲染的元素

React 元素是  [不可突变（immutable）](https://en.wikipedia.org/wiki/Immutable_object)  的. 一旦你创建了一个元素, 就不能再修改其子元素或任何属性。一个元素就像电影里的一帧: 它表示在某一特定时间点的 UI 。

就我们所知, 更新 UI 的唯一方法是创建一个新的元素, 并将其传入`ReactDOM.render()`方法.

思考以下时钟例子:

```
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)。

以上代码每隔 1 秒, 就会通过  [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)  回调  `ReactDOM.render()`  方法来重新渲染元素。

> **注意：**
>
> 实际上，大多数 React 应用只会调用  `ReactDOM.render()`  一次。在接下来的章节中，我们将学习如何将这些代码封装到[有状态的组件中](http://www.css88.com/react/docs/state-and-lifecycle.html)。
>
> 我们建议您不要跳过任何一节，因为每一节之间都是彼此有联系的。

### React 只更新必需要更新的部分

React DOM 会将元素及其子元素与之前版本逐一对比, 并只对有必要更新的 DOM 进行更新, 以达到 DOM 所需的状态。

你可以用浏览器工具对  [上一个例子](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)  进行检查来验证这一点:

<br><div align="center"><img src="http://www.css88.com/react/img/docs/granular-dom-updates.gif"/></div><br>

即使我们我们每隔 1 秒都重建了整个元素, 但实际上 React DOM 只更新了修改过的文本节点.

在我们的经验中, 关注每个时间点 UI 的表现, 而不是关注随着时间不断更新 UI 的状态, 可以减少很多奇怪的 bug 。

## 组件(Components) 和 属性(Props)

组件使你可以将 UI 划分为一个一个独立，可复用的小部件，并可以对每个部件进行单独的设计。

从定义上来说， 组件就像 JavaScript 的函数。组件可以接收任意输入(称为"props")， 并返回 React 元素，用以描述屏幕显示内容。

> 愚人码头注：Props ， 即属性(Property)， 在代码中写作 props ， 故可用 props 指代 properties .

### 函数式组件和类组件

最简单的定义组件的方法是写一个 JavaScript 函数:

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

```

这个函数是一个合法的 React 组件，因为它接收一个  `props`  参数, 并返回一个 React 元素。 我们把此类组件称为"函数式(Functional)"组件， 因为从字面上看来它就是一个 JavaScript 函数。

你也可以用一个  [ES6 的 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)  来定义一个组件:

```
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

```

上面两个组件从 React 的角度来看是等效的。

类组件有一些额外的特性，我们将在[下一节](http://www.css88.com/react/docs/state-and-lifecycle.html)讨论。在此之前, 我们先用函数式组件，因为它们更加简洁。

### 渲染一个组件

在前面, 我们只遇到代表 DOM 标签的 React 元素：

```
const element = <div />;

```

然而，元素也可以代表用户定义的组件：

```
const element = <Welcome name="Sara" />;

```

当 React 遇到一个代表用户定义组件的元素时，它将 JSX 属性以一个单独对象的形式传递给相应的组件。 我们将其称为 "props" 对象。

比如, 以下代码在页面上渲染 "Hello, Sara" ：

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/YGYmEG?editors=0010)。

我们简单扼要重述一下上面这个例子:

1. 我们调用了  `ReactDOM.render()`  方法并向其中传入了  ``  元素。
2. React 调用  `Welcome`  组件，并向其中传入了  `{name: 'Sara'}`  作为 props 对象。
3. `Welcome`  组件返回  `Hello, Sara`。
4. React DOM 迅速更新 DOM ，使其显示为  `Hello, Sara`。

> **警告：**
>
> 组件名称总是以大写字母开始。
>
> 举例来说, `代表一个 DOM 标签，而`  则代表一个组件，并且需要在作用域中有一个  `Welcome`  组件。

### 构成组件

组件可以在它们的输出中引用其它组件。这使得我们可以使用同样的组件来抽象到任意层级。一个按钮，一个表单，一个对话框，一个屏幕：在 React 应用中，所有这些都通常描述为组件。

例如，我们可以创建一个  `App`  组件，并在其内部多次渲染  `Welcome`：

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/KgQKPr?editors=0010)。

通常，新的 React apps 都有一个单独的顶层  `App`  组件。然而，如果你在已有的应用中整合 React，你可以需要由下至上地, 从类似于  `Button`  这样的小组件开始, 逐渐整合到视图层的顶层。

> **警告：**
>
> 组件必须返回一个单独的根元素。这就是为什么我们添加一个  `来包含所有`  元素的原因。

### 提取组件

不要害怕把一个组件分为多个更小的组件。

举个例子，思考下名  `Comment`  组件：

```
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/VKQwEo?editors=0010)。

它接受  `author`（一个对象），`text`（一个字符串）和  `date`（一个日期）作为 props，并用于在某社交网站中描述一条评论。

这个组件修改起来很麻烦，因为它是被嵌套的，而且很难复用其中的某个部分。让我们从其中提取一些组件。

首先，提取头像  `Avatar`：

```
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}

```

`Avatar`  组件不用关心它在  `Comment`  中是如何渲染的。这是为什么我们它的 prop 一个更通用的属性名: `user`, 而不是  `author`  的原因。

我们建议从组件本身的角度来命名 props 而不是它被使用的上下文环境。

我们可以稍微简化一下  `Comment`  组件:

```
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}

```

接下来，我们提取用户信息  `UserInfo`  组件， 用于将  `Avatar`  显示在用户名旁边：

```
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}

```

这使我们可以进一步简化  `Comment`  组件：

```
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/rrJNJY?editors=0010)。

提取组件可能看起来是一个繁琐的工作，但是在大型的 Apps 中可以回报给我们的是大量的可复用组件。一个好的经验准则是如果你 UI 的一部分需要用多次 (`Button`，`Panel`，`Avatar`)，或者本身足够复杂(`App`，`FeedStory`，`Comment`)，最好的做法是使其成为可复用组件。

### Props 是只读的

无论你用[函数或类](http://www.css88.com/react/docs/components-and-props.html#functional-and-class-components)的方法来声明组件, 它都无法修改其自身 props. 思考下列  `sum` (求和)函数:

```
function sum(a, b) {
  return a + b;
}

```

这种函数称为  [“纯函数”](https://en.wikipedia.org/wiki/Pure_function) ，因为它们不会试图改变它们的输入，并且对于同样的输入,始终可以得到相同的结果。

反之， 以下是非纯函数， 因为它改变了自身的输入值：

```
function withdraw(account, amount) {
  account.total -= amount;
}

```

虽然 React 很灵活，但是它有一条严格的规则：

**所有 React 组件都必须是纯函数，并禁止修改其自身 props 。**

当然， 应用 UI 总是动态的，并且随时有可以改变。 所以在[下一节](http://www.css88.com/react/docs/state-and-lifecycle.html), 我们会介绍一个新的概念`state`(状态) 。`state`  允许 React 组件在不违反上述规则的情况下, 根据用户操作, 网络响应, 或者其他随便什么东西, 来动态地改变其输出。

# 状态(State) 和生命周期

思考[前面章节](http://www.css88.com/react/docs/rendering-elements.html#updating-the-rendered-element)中提到过的时钟例子.

目前为止我们只学了一种更新 UI 的方式。

我们通过调  `ReactDOM.render()`  方法来更新渲染的输出:

```
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)。

在本节中，我们将学习如何使  `Clock`  组件变得真正可复用 和 封装的更好。它将设置自己的计时器，并在每秒更新自身。

我们可以从封装时钟开始：

```
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)。

然而，它没有满足一个关键的要求：`Clock`  设置定时器并每秒更新 UI ，事实上应该是  `Clock`自身实现的一部分。

理想情况下，我们应该只引用一个  `Clock` , 然后让它自动计时并更新:

```
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);

```

要实现这点，我们需要添加  `state`  到  `Clock`  组件。

`state`  和  `props`  类似，但是它是私有的，并且由组件本身完全控制。

我们[之前提到过](http://www.css88.com/react/docs/components-and-props.html#functional-and-class-components), 用类定义的组件有一些额外的特性。 这个"类专有的特性"， 指的就是局部状态。

## 把函数式组件转化为类组件

你可以遵从以下 5 步, 把一个类似  `Clock`  这样的函数式组件转化为类组件：

1. 创建一个继承自  `React.Component`  类的  [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)  同名类。
2. 添加一个名为  `render()`  的空方法。
3. 把原函数中的所有内容移至  `render()`  中。
4. 在  `render()`  方法中使用  `this.props`  替代  `props`。
5. 删除保留的空函数声明。

```
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)。

`Clock`  现在被定为类组件，而不是函数式组件。

类允许我们在其中添加本地状态(state)和生命周期钩子。

## 在类组件中添加本地状态(state)

我们现在通过以下 3 步, 把`date`从属性(`props`) 改为 状态(`state`)：

We will move the `date` from props to state in three steps:

1. 替换  `render()`  方法中的  `this.props.date`  为  `this.state.date`：

```
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

```

2. 添加一个  [类构造函数(class constructor)](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor)  初始化  `this.state`:

```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

```

注意我们如何将  `props`  传递给基础构造函数：

```
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

```

类组件应始终使用  `props`  调用基础构造函数。

3. 移除  ``  元素中的  `date`  属性：

```
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);

```

我们稍后再把 计时器代码 添加到组件内部。

现有的结果是这样:

```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)。

接下来，我们将使  `Clock`  设置自己的计时器，并每秒更新一次。

## 在类中添加生命周期方法

在一个具有许多组件的应用程序中，在组件被销毁时释放所占用的资源是非常重要的。

当  `Clock`  第一次渲染到 DOM 时，我们要[设置一个定时器](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) 。 这在 React 中称为 "挂载(mounting)" 。

当  `Clock`  产生的 DOM 被销毁时，我们也想[清除该计时器](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval)。 这在 React 中称为 "卸载(unmounting)" 。

当组件挂载和卸载时，我们可以在组件类上声明特殊的方法来运行一些代码：

```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

```

这些方法称为 "生命周期钩子"。

`componentDidMount()`  钩子在组件输出被渲染到 DOM 之后运行。这是设置时钟的不错的位置：

```
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

```

注意我们把计时器 ID 直接存在  `this`  中。

`this.props`  由 React 本身设定, 而  `this.state`  具有特殊的含义，但如果需要存储一些不用于视觉输出的内容，则可以手动向类中添加额外的字段。

如果在  `render()`  方法中没有被引用, 它不应该出现在 state 中。

我们在`componentWillUnmount()`生命周期钩子中取消这个计时器：

```
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

```

最后，我们将会实现每秒运行的  `tick()`  方法。

它将使用  `this.setState()`  来来周期性地更新组件本地状态：

```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/amqdNA?editors=0010)。

现在这个时钟每秒都会走了。

我们来快速回顾一下该过程，以及调用方法的顺序：

1. 当  ``  被传入  `ReactDOM.render()`  时, React 会调用  `Clock`组件的构造函数。 因为`Clock`  要显示的是当前时间，所以它将使用包含当前时间的对象来初始化  `this.state`。我们稍后会更新此状态。
2. 然后 React 调用了  `Clock`  组件的  `render()`  方法。 React 从该方法返回内容中得到要显示在屏幕上的内容。然后，React 然后更新 DOM 以匹配  `Clock`  的渲染输出。
3. 当  `Clock`  输出被插入到 DOM 中时，React 调用  `componentDidMount()`  生命周期钩子。在该方法中，`Clock`  组件请求浏览器设置一个定时器来一次调用  `tick()`。
4. 浏览器会每隔一秒调用一次  `tick()`方法。在该方法中， `Clock`  组件通过  `setState()`  方法并传递一个包含当前时间的对象来安排一个 UI 的更新。通过  `setState()`, React 得知了组件  `state`(状态)的变化, 随即再次调用  `render()`  方法，获取了当前应该显示的内容。 这次，`render()`  方法中的  `this.state.date`  的值已经发生了改变， 从而，其输出的内容也随之改变。React 于是据此对 DOM 进行更新。
5. 如果通过其他操作将  `Clock`  组件从 DOM 中移除了, React 会调用`componentWillUnmount()`  生命周期钩子, 所以计时器也会被停止。

## 正确地使用 State(状态)

关于  `setState()`  有三件事是你应该知道的。

### 不要直接修改 state(状态)

例如，这样将不会重新渲染一个组件：

```
// 错误
this.state.comment = 'Hello';

```

用  `setState()`  代替：

```
// 正确
this.setState({comment: 'Hello'});

```

唯一可以分配  `this.state`  的地方是构造函数。

### state(状态) 更新可能是异步的

React 为了优化性能，有可能会将多个  `setState()`  调用合并为一次更新。

因为  `this.props`  和  `this.state`  可能是异步更新的，你不能依赖他们的值计算下一个 state(状态)。

例如, 以下代码可能导致  `counter`(计数器)更新失败：

```
// 错误
this.setState({
  counter: this.state.counter + this.props.increment,
});

```

要解决这个问题，应该使用第 2 种  `setState()`  的格式，它接收一个函数，而不是一个对象。该函数接收前一个状态值作为第 1 个参数， 并将更新后的值作为第 21 个参数:

要弥补这个问题，使用另一种 setState() 的形式，它接受一个函数而不是一个对象。这个函数将接收前一个状态作为第一个参数，应用更新时的 props 作为第二个参数：

```
// 正确
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));

```

我们在上面使用了一个[箭头函数](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，但是也可以使用一个常规的函数：

```
// 正确
this.setState(function(prevState, props) {
  return {
    counter: prevState.counter + props.increment
  };
});

```

### state(状态)更新会被合并

当你调用  `setState()`， React 将合并你提供的对象到当前的状态中。

例如，你的状态可能包含几个独立的变量：

```
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }

```

然后通过调用独立的  `setState()`  调用分别更新它们:

```
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }

```

合并是浅合并，所以  `this.setState({comments})`  不会改变  `this.state.posts`  的值，但会完全替换`this.state.comments`  的值。

## 数据向下流动

无论作为父组件还是子组件，它都无法获悉一个组件是否有状态，同时也不需要关心另一个组件是定义为函数组件还是类组件。

这就是 state(状态) 经常被称为 本地状态 或 封装状态的原因。 它不能被拥有并设置它的组件 以外的任何组件访问。

一个组件可以选择将 state(状态) 向下传递，作为其子组件的 props(属性)：

```
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>

```

同样适用于用户定义组件:

```
<FormattedDate date={this.state.date} />

```

`FormattedDate`  组件通过 props(属性) 接收了  `date`  的值，但它仍然不能获知该值是来自于`Clock`的 state(状态) ，还是  `Clock`  的 props(属性)，或者是直接手动创建的：

```
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)。

这通常称为一个“从上到下”，或者“单向”的数据流。任何 state(状态) 始终由某个特定组件所有，并且从该 state(状态) 导出的任何数据 或 UI 只能影响树中 “下方” 的组件。

如果把组件树想像为 props(属性) 的瀑布，所有组件的 state(状态) 就如同一个额外的水源汇入主流，且只能随着主流的方向向下流动。

要证明所有组件都是完全独立的， 我们可以创建一个  `App`  组件，并在其中渲染 3 个``:

```
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)。

每个  `Clock`  都设置它自己的计时器并独立更新。

在 React 应用中，一个组件是否是有状态或者无状态的，被认为是组件的一个实现细节，随着时间推移可能发生改变。你可以在有状态的组件中使用无状态组件，反之亦然。

通过 React 元素处理事件跟在 DOM 元素上处理事件非常相似。但是有一些语法上的区别：

- React 事件使用驼峰命名，而不是全部小写。
- 通过 JSX , 你传递一个函数作为事件处理程序，而不是一个字符串。

例如，HTML：

```
<button onclick="activateLasers()">
  Activate Lasers
</button>

```

在 React 中略有不同：

```
<button onClick={activateLasers}>
  Activate Lasers
</button>

```

另一个区别是，在 React 中你不能通过返回  `false`（愚人码头注：即  `return false;`  语句） 来阻止默认行为。必须明确调用  `preventDefault` 。例如，对于纯 HTML ，要阻止链接打开一个新页面的默认行为，可以这样写：

```
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>

```

在 React 中, 应该这么写:

```
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}

```

这里， e 是一个合成的事件。 React 根据  [W3C 规范](https://www.w3.org/TR/DOM-Level-3-Events/)  定义了这个合成事件，所以你不需要担心跨浏览器的兼容性问题。查看  [`SyntheticEvent`](http://www.css88.com/react/docs/events.html)  参考指南了解更多。

当使用 React 时，你一般不需要调用  `addEventListener`  在 DOM 元素被创建后添加事件监听器。相反，只要当元素被初始渲染的时候提供一个监听器就可以了。

当使用一个  [ES6 类](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)  定义一个组件时，通常的一个事件处理程序是类上的一个方法。例如，`Toggle`  组件渲染一个按钮，让用户在 “ON” 和 "OFF" 状态之间切换：

```
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 这个绑定是必要的，使`this`在回调中起作用
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/xEmzGg?editors=0010)。

在 JSX 回调中你必须注意  `this`  的指向。 在 JavaScript 中，类方法默认没有  [绑定](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind)  的。如果你忘记绑定  `this.handleClick`  并将其传递给`onClick`，那么在直接调用该函数时，`this`  会是`undefined` 。

这不是 React 特有的行为；这是  [JavaScript 中的函数如何工作](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/)的一部分。 一般情况下，如果你引用一个后面没跟  `()`  的方法，例如  `onClick={this.handleClick}` ，那你就应该 绑定(bind) 该方法。

如果调用  `bind`  令你烦恼，有两种方法可以解决这个问题。 如果您使用实验性的  [属性初始化语法](https://babeljs.io/docs/plugins/transform-class-properties/) ，那么你可以使用属性初始值设置来正确地 绑定(bind) 回调：

```
class LoggingButton extends React.Component {
  // 这个语法确保 `this` 绑定在 handleClick 中。
  // 警告：这是 *实验性的* 语法。
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}

```

这个语法在  [创建 React App](https://github.com/facebookincubator/create-react-app)  中是默认开启的。

如果你没有使用属性初始化语法，可以在回调中使用一个  [箭头函数](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)：

```
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 这个语法确保 `this` 被绑定在 handleClick 中
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}

```

这个语法的问题是，每次  `LoggingButton`  渲染时都创建一个不同的回调。在多数情况下，没什么问题。然而，如果这个回调被作为 prop(属性) 传递给下级组件，这些组件可能需要额外的重复渲染。我们通常建议在构造函数中进行绑定，以避免这类性能问题。

# 条件渲染

在 React 中，你可以创建不同的组件封装你所需要的行为。然后，只渲染它们之中的一些，取决于你的应用的状态。

React 中的条件渲染就和在 JavaScript 中的条件语句一样。使用 JavaScript 操作符如  [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)  或者[条件操作符](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)来创建渲染当前状态的元素，并且让 React 更新匹配的 UI 。

思考以下两个组件：

```
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}

```

我们需要创建一个  `Greeting`  组件, 用来根据用户是否登录, 判断并显示上述两个组件之一：

```
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // 修改为 isLoggedIn={true} 试试:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)。

这个例子根据  `isLoggedIn` prop 渲染了不同的问候语 。

### 元素变量

你可以用变量来存储元素。这可以帮助您有条件地渲染组件的一部分，而输出的其余部分不会更改。

思考以下两个新组件，分别用于显示登出和登入按钮：

```
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}

```

在接下来的例子中，我们将会创建一个[有状态组件](http://www.css88.com/react/docs/state-and-lifecycle.html#adding-local-state-to-a-class)，叫做  `LoginControl` 。

它将渲染  `或者` ，取决于当前状态。同时渲染前面提到的``  组件:

```
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    let button = null;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)。

虽然声明一个变量并使用一个  `if`  语句是一个有条件地渲染组件的好方法，有时你可能想要使用一个更简短的语法。在 JSX 中有几种内联条件的方法，如下所述。

### 使用逻辑 && 操作符的内联 if 用法

您可以  [在 JSX 中嵌入任何表达式](http://www.css88.com/react/docs/introducing-jsx.html#embedding-expressions-in-jsx) ，方法是将其包裹在花括号中。这也包括 JavaScript 逻辑`&&`  运算符。 它有助于有条件地包含一个元素：

```
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/ozJddz?editors=0010)。

它可以正常运行，因为在 JavaScript 中， `true && expression`  总是会评估为  `expression` ，而`false && expression`  总是执行为  `false` 。

因此，如果条件为  `true` ，则  `&&`  后面的元素将显示在输出中。 如果是  `false`，React 将会忽略并跳过它。

### 使用条件操作符的内联 If-Else

另一个用于条件渲染元素的内联方法是使用 JavaScript 的条件操作符  [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 。

在下面这个例子中，我们使用它来进行条件渲染一个小的文本块：

```
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}

```

它也可以用于更大的表达式，虽然不太明显发生了什么：

```
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}

```

就像 JavaScript 一样，你可以根据你和你的团队认为更易于阅读的方式选择合适的风格。还要记住，无论何时何地，当条件变得太复杂时，可能是[提取组件](http://www.css88.com/react/docs/components-and-props.html#extracting-components)的好时机。

### 防止组件渲染

在极少数情况下，您可能希望组件隐藏自身，即使它是由另一个组件渲染的。为此，返回`null`  而不是其渲染输出。

在下面的例子中，根据名为`warn`的 prop 值，呈现  `` 。如果 prop 值为  `false`，则该组件不渲染：

```
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true}
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)。

从组件的  `render`  方法返回  `null`  不会影响组件生命周期方法的触发。 例如，`componentWillUpdate`  和  `componentDidUpdate`  仍将被调用。

# 列表(Lists) 和 键(Keys)

首先，让我们回顾一下在 JavaScript 中如何转换列表。

给定下面的代码，我们使用  [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)  函数使  `numbers`  数组中的元素值翻倍。我们将  `map()`  返回的新数组分配给变量  `doubled`，并且打印这个它：

```
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);

```

这段代码在控制台中打印为  `[2, 4, 6, 8, 10]`。

在 React 中，转换数组为  [元素列表](http://www.css88.com/react/docs/rendering-elements.html)  的方式，和上述方法基本相同。

### 多组件渲染

可以创建元素集合，并用一对大括号  `{}` [在 JSX 中直接将其引用](http://www.css88.com/react/docs/introducing-jsx.html#embedding-expressions-in-jsx)即可。

下面，我们用 JavaScript 的  [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)  函数将  `numbers`  数组循环处理。对于每一项，我们返回一个  ``  元素。最终，我们将结果元素数组分配给  `listItems`：

```
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);

```

把整个  `listItems`  数组包含到一个  ``  元素，并[渲染到 DOM](http://www.css88.com/react/docs/rendering-elements.html#rendering-an-element-into-the-dom)：

```
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)。

这段代码显示从 1 到 5 的数字列表。

### 基本列表组件

通常情况下，我们会在一个[组件](http://www.css88.com/react/docs/components-and-props.html)中渲染列表。

我们可以重构前面的例子到一个组件，它接受一个  `numbers`  数组，并输出一个元素的无序列表。

```
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);

```

当运行上述代码的时候，将会收到一个警告：a key should be provided for list items（应该为列表元素提供一个键）（愚人码头注 ：CodeOpen 中没有报警告，是因为其示例中使用的是 min 版本的 React，换成非 min 版本的就可以看到）。当创建元素列表时，“key” 是一个你需要包含的特殊字符串属性。我们将在下一节讨论它的重要性。

我们在  `numbers.map()`  中赋值一个  `key`  给我们的列表元素，解决丢失 key 的问题。

```
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)。

## 键(Keys)

键(Keys) 帮助 React 标识哪个项被修改、添加或者移除了。数组中的每一个元素都应该有一个唯一不变的键(Keys)来标识：

```
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);

```

挑选 key 最好的方式是使用一个在它的同辈元素中不重复的标识字符串。多数情况你可以使用数据中的 IDs 作为 keys：

```
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);

```

当要渲染的列表项中没有稳定的 IDs 时，你可以使用数据项的索引值作为 key 的最后选择：

```
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);

```

如果列表项可能被重新排序时，我们不建议使用索引作为 keys，因为这导致一定的性能问题，会很慢。如果感兴趣，你可以阅读一下[深入的介绍关于为什么 keys 是必须的](http://www.css88.com/react/docs/reconciliation.html#recursing-on-children)。

### 使用 keys 提取组件

keys 只在数组的上下文中存在意义。

例如，如果你[提取](http://www.css88.com/react/docs/components-and-props.html#extracting-components)  一个  `ListItem`  组件，应该把 key 放置在数组处理的  `` 元素中，不能放在 `ListItem` 组件自身中的 ``  根元素上。

**例子：错误的 key 用法**

```
function ListItem(props) {
  const value = props.value;
  return (
    // 错误！不需要在这里指定 key：
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 错误！key 应该在这里指定：
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);

```

**错误！key 应该在这里指定：**

```
function ListItem(props) {
  // 正确！这里不需要指定 key ：
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 正确！key 应该在这里被指定
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](https://codepen.io/rthor/pen/QKzJKG?editors=0010)。

一个好的经验准则是元素中调用  `map()`  需要 keys 。

### keys 在同辈元素中必须是唯一的

在数组中使用的 keys 必须在它们的同辈之间唯一。然而它们并不需要全局唯一。我们可以在操作两个不同数组的时候使用相同的 keys ：

```
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)。

键是 React 的一个内部映射，但其不会传递给组件的内部。如果你需要在组件中使用相同的值，可以明确使用一个不同名字的 prop 传入。

```
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);

```

上面的例子中， `Post`  组件可以读取  `props.id`，但是不能读取  `props.key` 。

### 在 JSX 中嵌入 map()

在上面的例子中，我们单独声明了一个  `listItems`  变量，并在 JSX 中引用了该变量：

```
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

```

JSX 允许在大括号中[嵌入任何表达式](http://www.css88.com/react/docs/introducing-jsx.html#embedding-expressions-in-jsx)，因此可以 内联  `map()`  结果：

```
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)。

有时这可以产生清晰的代码，但是这个风格也可能被滥用。就像在 JavaScript 中，是否有必要提取一个变量以提高程序的可读性，这取决于你。但是记住，如果  `map()`  体中有太多嵌套，可能是[提取组件](http://www.css88.com/react/docs/components-and-props.html#extracting-components)的好时机。

# 表单(Forms)

HTML 表单元素与 React 中的其他 DOM 元素有所不同，因为表单元素自然地保留了一些内部状态。例如，这个纯 HTML 表单接受一个单独的 name：

```
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>

```

该表单和 HTML 表单的默认行为一致，当用户提交此表单时浏览器会打开一个新页面。如果你希望 React 中保持这个行为，也可以工作。但是多数情况下，用一个处理表单提交并访问用户输入到表单中的数据的 JavaScript 函数也很方便。实现这一点的标准方法是使用一种称为“受控组件(controlled components)”的技术。

## 受控组件(Controlled Components)

在 HTML 中，表单元素如  `，`  和  ``  表单元素通常保持自己的状态，并根据用户输入进行更新。而在 React 中，可变状态一般保存在组件的 state(状态) 属性中，并且只能通过  [`setState()`](http://www.css88.com/react/docs/react-component.html#setstate)  更新。

我们可以通过使 React 的 state 成为 “单一数据源原则” 来结合这两个形式。然后渲染表单的 React 组件也可以控制在用户输入之后的行为。这种形式，其值由 React 控制的输入表单元素称为“受控组件”。

例如，如果我们想使上一个例子在提交时记录名称，我们可以将表单写为受控组件：

```
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)。

设置表单元素的 value 属性之后，其显示值将由 this.state.value 决定，以满足 React 状态的同一数据理念。每次键盘敲击之后会执行 handleChange 方法以更新 React 状态，显示值也将随着用户的输入改变。

由于  `value`  属性设置在我们的表单元素上，显示的值总是  `this.state.value`，以满足 state 状态的同一数据理念。由于  `handleChange`  在每次敲击键盘时运行，以更新 React state(状态)，显示的值将更新为用户的输入。

对于受控组件来说，每一次 state(状态) 变化都会伴有相关联的处理函数。这使得可以直接修改或验证用户的输入。比如，如果我们希望强制 name 的输入都是大写字母，可以这样来写`handleChange`  方法：

```
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}

```

## textare 标签

在 HTML 中，``  元素通过它的子节点定义了它的文本值：

```
<textarea>
  Hello there, this is some text in a text area
</textarea>

```

在 React 中，`` 的赋值使用 `value` 属性替代。这样一来，表单中 ``  的书写方式接近于单行文本输入框 ：

```
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

```

注意，`this.state.value`  在构造函数中初始化，所以这些文本一开始就出现在文本域中。

## select 标签

在 HTML 中，``  创建了一个下拉列表。例如，这段 HTML 创建一个下拉的口味(flavors)列表：

```
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>

```

注意，Coconut 选项是初始化选中的，因为它的  `selected`  属性。React 中，并不使用这个`selected`  属性，而是在根  `select`  标签中使用了一个  `value`  属性。这使得受控组件使用更方便，因为你只需要更新一处即可。例如：

```
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite La Croix flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)。

总的来说，这使  `，`  和  ``  都以类似的方式工作 —— 它们都接受一个  `value`  属性可以用来实现一个受控组件。

## 处理多个输入元素

当您需要处理多个受控的  `input`  元素时，您可以为每个元素添加一个  `name`  属性，并且让处理函数根据  `event.target.name`  的值来选择要做什么。

例如：

```
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}

```

[在 CodePen 中尝试](https://codepen.io/gaearon/pen/wgedvV?editors=0010)。

注意我们如何使用 ES6[计算的属性名称](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names)语法来更新与给定输入名称相对应的 state(状态) 键：

```
this.setState({
  [name]: value
});

```

这段代码等价于 ES5 代码:

```
var partialState = {};
partialState[name] = value;
this.setState(partialState);

```

此外，由于  `setState()`  自动[将部分状态合并到当前状态](http://www.css88.com/react/docs/state-and-lifecycle.html#state-updates-are-merged)，所以我们只需要调用更改的部分即可。

## 受控组件的替代方案

有时使用受控组件有些乏味，因为你需要为每一个可更改的数据提供事件处理器，并通过 React 组件管理所有输入状态。当你将已经存在的代码转换为 React 时，或将 React 应用程序与非 React 库集成时，这可能变得特别烦人。在这些情况下，您可能需要使用[不受控的组件](http://www.css88.com/react/docs/uncontrolled-components.html)，用于实现输入表单的替代技术。

# 状态提升(Lifting State Up)

通常情况下，同一个数据的变化需要几个不同的组件来反映。我们建议提升共享的状态到它们最近的祖先组件中。我们看下这是如何运作的。

在本节，我们将会创建一个温度计算器，用来计算水在一个给定温度下是否会沸腾。

我们通过一个称为  `BoilingVerdict`  的组件开始。它接受  `celsius`（摄氏温度）作为 prop ，并打印是否足以使水沸腾：

```
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}

```

接下来，我们将会创建一个  `Calculator`  组件。它渲染一个  ``  让你输入温度，并在`this.state.temperature`  中保存它的值。

另外，它会根据当前输入的温度来渲染  `BoilingVerdict` 。

```
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}

```

[在 CodePen 中尝试](http://codepen.io/valscion/pen/VpZJRZ?editors=0010)。

## 添加第二个输入

我们新的需求是，除了一个摄氏温度输入之外，我们再提供了一个华氏温度输入，并且两者保持自动同步。

我们可以从  `Calculator`  中提取一个  `TemperatureInput`  组件开始。我们将添加一个新的  `scale`属性，值可能是  `"c"`  或者  `"f"` ：

```
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}

```

现在我们可以修改  `Calculator`  来渲染两个独立的温度输入：

```
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}

```

[在 CodePen 中尝试](http://codepen.io/valscion/pen/GWKbao?editors=0010)。

我们现在有两个 (input)输入框 了，但是当你输入其中一个温度时，另一个输入并没有更新。这是跟我们的需要不符的：我们希望它们保持同步。

我们也不能在  `Calculator`  中显示  `BoilingVerdict` 。 `Calculator`  不知道当前的温度，因为它是在  `TemperatureInput`  中隐藏的。

## 编写转换函数

首先，我们编写两个函数来在摄氏温度和华氏温度之间转换：

```
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

```

这两个函数用来转化数字。接下来再编写一个函数用来接收一个字符串  `temperature`  和一个 转化器函数 作为参数，并返回一个字符串。这个函数用来在两个输入之间进行相互转换。

对于无效的  `temperature`  值，它返回一个空字符串，输出结果保留 3 位小数：

```
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

```

例如， `tryConvert('abc', toCelsius)`  将返回一个空字符串，而  `tryConvert('10.22', toFahrenheit)`  返回  `'50.396'` 。

## 状态提升(Lifting State Up)

目前，两个  `TemperatureInput`  组件都将其值保持在本地状态中：

```
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;

```

但是，我们希望这两个输入是相互同步的。当我们更新摄氏温度输入时，华氏温度输入应反映转换后的温度，反之亦然。

在 React 中，共享 state(状态) 是通过将其移动到需要它的组件的最接近的共同祖先组件来实现的。 这被称为“状态提升(Lifting State Up)”。我们将从  `TemperatureInput`  中移除相关状态本地状态，并将其移动到  `Calculator`  中。

如果  `Calculator`  拥有共享状态，那么它将成为两个输入当前温度的“单一数据来源”。它可以指示他们具有彼此一致的值。由于两个  `TemperatureInput`  组件的 props 都来自同一个父级`Calculator`组件，两个输入将始终保持同步。

让我们一步一步看看这是如何工作的。

首先，我们将在  `TemperatureInput`  组件中用  `this.props.temperature`  替换`this.state.temperature` 。 现在，我们假装  `this.props.temperature`  已经存在，虽然我们将来需要从  `Calculator`  传递过来：

```
  render() {
    // 之前是: const temperature = this.state.temperature;
    const temperature = this.props.temperature;

```

我们知道  [props(属性) 是只读的](http://www.css88.com/react/docs/components-and-props.html#props-are-read-only)。 当  `temperature`  是 本地 state(状态)时， `TemperatureInput`可以调用  `this.setState()`  来更改它。 然而，现在  `temperature`  来自父级作为 prop(属性) ，`TemperatureInput`  就无法控制它。

在 React 中，通常通过使组件“受控”的方式来解决。就像 DOM ``一样接受一个  `value`和一个  `onChange` prop(属性) ，所以可以定制  `TemperatureInput`  接受来自其父级  `Calculator`  的`temperature`  和  `onTemperatureChange` 。

现在，当  `TemperatureInput`  想要更新其温度时，它就会调用`this.props.onTemperatureChange`：

```
  handleChange(e) {
    // 之前是: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);

```

请注意，自定义组件中的  `temperature`  或  `onTemperatureChange` prop(属性) 名称没有特殊的含义。我们可以命名为任何其他名称，像命名他们为  `value`  和  `onChange`，是一个常见的惯例。

`onTemperatureChange` prop(属性) 和  `temperature` prop(属性) 一起由父级的  `Calculator`  组件提供。它将通过修改自己的本地 state(状态) 来处理变更，从而通过新值重新渲染两个输入。我们将很快看到新的  `Calculator`  实现。

在修改  `Calculator`  之前，让我们回顾一下对  `TemperatureInput`  组件的更改。我们已经从中删除了本地 state(状态) ，不是读取`this.state.temperature` ，我们现在读取`this.props.temperature` 。当我们想要更改时， 不是调用  `this.setState()` ，而是调用`this.props.onTemperatureChange()`， 这将由  `Calculator`  提供：

```
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}

```

现在我们来看一下  `Calculator`  组件。

我们将当前输入的  `temperature`  和  `scale`  存储在本地 state(状态) 中。这是我们从输入 “提升” 的 state(状态) ，它将作为两个输入的 “单一数据来源” 。为了渲染两个输入，我们需要知道的所有数据的最小表示。

例如，如果我们在摄氏度输入框中输入 37 ，则  `Calculator`  组件的状态将是：

```
{
  temperature: '37',
  scale: 'c'
}

```

如果我们稍后将华氏温度字段编辑为 212 ，则  `Calculator`  组件的状态将是：

```
{
  temperature: '212',
  scale: 'f'
}

```

我们可以存储两个输入框的值，但事实证明是不必要的。存储最近更改的输入框的值，以及它所表示的度量衡就够了。然后，我们可以基于当前的  `temperature`(温度) 和  `scale`(度量衡) 来推断其他输入的值。

输入框保持同步，因为它们的值是从相同的 state(状态) 计算出来的：

```
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}

```

[在 CodePen 中尝试](http://codepen.io/valscion/pen/jBNjja?editors=0010)。

现在，无论你编辑哪个输入框，`Calculator`  中的  `this.state.temperature`  和  `this.state.scale`都会更新。其中一个输入框获取值，所以任何用户输入都被保留，并且另一个输入总是基于它重新计算值。

让我们回顾一下编辑输入时会发生什么：

- React 调用在 DOM ``  上的  `onChange`  指定的函数。在我们的例子中，这是`TemperatureInput`  组件中的  `handleChange`  方法。
- `TemperatureInput`  组件中的  `handleChange`  方法使用 新的期望值 调用`this.props.onTemperatureChange()`。`TemperatureInput`  组件中的 props(属性) ，包括`onTemperatureChange`，由其父组件  `Calculator`  提供。
- 当它预先呈现时， `Calculator`  指定了摄氏  `TemperatureInput`  的  `onTemperatureChange`  是`Calculator`  的  `handleCelsiusChange`  方法，并且华氏  `TemperatureInput`  的`onTemperatureChange`  是  `Calculator`  的  `handleFahrenheitChange`  方法。因此，会根据我们编辑的输入框，分别调用这两个  `Calculator`  方法。
- 在这些方法中， `Calculator`  组件要求 React 通过使用 新的输入值 和 刚刚编辑的输入框的当前度量衡 来调用  `this.setState()`  来重新渲染自身。
- React 调用  `Calculator`  组件的  `render`  方法来了解 UI 外观应该是什么样子。基于当前温度和激活的度量衡来重新计算两个输入框的值。这里进行温度转换。
- React 使用  `Calculator`  指定的新 props(属性) 调用各个  `TemperatureInput`  组件的  `render`方法。 它了解 UI 外观应该是什么样子。
- React DOM 更新 DOM 以匹配期望的输入值。我们刚刚编辑的输入框接收当前值，另一个输入框更新为转换后的温度。

每个更新都会执行相同的步骤，以便输入保持同步。

## 经验总结

在一个 React 应用中，对于任何可变的数据都应该循序“单一数据源”原则。通常情况下，state 首先被添加到需要它进行渲染的组件。然后，如果其它的组件也需要它，你可以提升状态到它们最近的祖先组件。你应该依赖  [从上到下的数据流向](http://www.css88.com/react/docs/state-and-lifecycle.html#the-data-flows-down) ，而不是试图在不同的组件中同步状态。

提升状态相对于双向绑定方法需要写更多的“模板”代码，但是有一个好处，它可以更方便的找到和隔离 bugs。由于任何 state(状态) 都 “存活” 在若干的组件中，而且可以分别对其独立修改，所以发生错误的可能大大减少。另外，你可以实现任何定制的逻辑来拒绝或者转换用户输入。

如果某个东西可以从 props(属性) 或者 state(状态) 得到，那么它可能不应该在 state(状态) 中。例如，我们只保存最后编辑的  `temperature`  和它的  `scale`，而不是保存  `celsiusValue`  和`fahrenheitValue` 。另一个输入框的值总是在  `render()`  方法中计算得来的。这使我们对其进行清除和四舍五入到其他字段同时不会丢失用户输入的精度。

当你看到 UI 中的错误，你可以使用  [React 开发者工具](https://github.com/facebook/react-devtools)来检查 props ，并向上遍历树，直到找到负责更新状态的组件。这使你可以跟踪到 bug 的源头：

# 组合和继承对比（Composition vs Inheritance）

React 拥有一个强大的组合模型，我们建议使用组合而不是继承以实现代码的重用。

在本节中，我们将考虑几个问题，即 React 新手经常会使用继承，并展示我们如何通过组合来解决它们。

## 包含

一些组件在设计前无法获知自己要使用什么子组件，尤其在  `Sidebar`  和  `Dialog`  等通用 “容器” 中比较常见。

我们建议这种组件使用特别的  `children` prop 来直接传递 子元素到他们的输出中：

```
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}

```

这允许其他组件通过嵌套 JSX 传递任意子组件给他们：

```
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/ozqNOV?editors=0010)。

在  `` JSX 标签中的任何内容被传递到 `FancyBorder` 组件中，作为一个 `children`prop(属性)。由于 `FancyBorder` 渲染 `{props.children}` 到一个 ``  中，传递的元素会呈现在最终的输出中。

然而这并不常见，有时候，在一个组件中你可能需要多个 “占位符” 。在这种情况下，你可以使用自定义的 prop(属性)，而不是使用  `children` ：

```
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/gwZOJp?editors=0010)。

如  `和`  等 React 元素本质上也是对象，所以可以将其像其他数据一样作为 props(属性) 传递使用。

## 特例

有时候，我们考虑组件作为其它组件的“特殊情况”。例如，我们可能说一个  `WelcomeDialog`  是`Dialog`  的一个特殊用例。

在 React 中，也可以使用组合来实现，一个偏“特殊”的组件渲染出一个偏“通用”的组件，通过 props(属性) 配置它：

```
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/kkEaOZ?editors=0010)。

对于用类定义的组件组合也同样适用：

```
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}

```

[在 CodePen 中尝试](http://codepen.io/gaearon/pen/gwZbYa?editors=0010)。

## 如何看待？

在 Facebook ，我们在千万的组件中使用 React，我们还没有发现任何用例，值得我们建议你用继承层次结构来创建组件。

使用 props(属性) 和 组合已经足够灵活来明确、安全的定制一个组件的外观和行为。切记，组件可以接受任意的 props(属性) ，包括原始值、React 元素，或者函数。

如果要在组件之间重用非 UI 功能，我们建议将其提取到单独的 JavaScript 模块中。组件可以导入它并使用该函数，对象或类，而不扩展它。
