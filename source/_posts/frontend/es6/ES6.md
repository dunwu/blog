---
title: ES6
date: 2019-03-06
---

# ES6

> 关键词： `ES6`, `ECMAScript`, `arrow`, `this`, `let`, `const`, `class`, `extends`, `super`, `arrow` ...

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
- [最常用的 ES6 特性](#最常用的-es6-特性)
    - [arrow, this](#arrow-this)
    - [let, const](#let-const)
    - [class, extends, super](#class-extends-super)
    - [template strings](#template-strings)
    - [Destructuring](#destructuring)
    - [default, rest, spread](#default-rest-spread)
    - [增强的对象字面量](#增强的对象字面量)
    - [Iterator，for..Of](#iteratorforof)
    - [Generators](#generators)
    - [Unicode](#unicode)
    - [Module](#module)
    - [Module Loader](#module-loader)
    - [Map + Set + WeakMap + WeakSet](#map--set--weakmap--weakset)
    - [Proxy](#proxy)
    - [Symbols](#symbols)
    - [可以被继承的内建对象](#可以被继承的内建对象)
    - [Math + Number + String + Object APIs](#math--number--string--object-apis)
    - [二进制和八进制字面量](#二进制和八进制字面量)
    - [Promises](#promises)
    - [Reflect API](#reflect-api)
    - [Tail Calls(尾调用)](#tail-calls尾调用)
- [更多内容](#更多内容)

<!-- /TOC -->

## 简介

ECMAScript 6（以下简称 ES6）是 JavaScript 语言的下一代标准。

因为当前版本的 ES6 是在 2015 年发布的，所以又称 ECMAScript 2015。

也就是说，ES6 就是 ES2015。

注意：并非所有的浏览器都支持 ES6。所以，如果要让浏览器能够理解 ES6 的语义，需要使用转码器，比如最流行的 [Babel](https://babeljs.io/)。

## 最常用的 ES6 特性

### arrow, this

这个恐怕是 ES6 最最常用的一个新特性了，用它来写 `function` 比原来的写法要简洁清晰很多。

箭头函数用 `=>` 来代表一个函数，语法上类似于 C#, Java8 和 CoffeeScript 中的相关特性。它同时支持表达式（Expression bodies）和语句（Statement bodies）的写法。值得注意的是，与一般的函数不同，箭头函数与包裹它的代码共享相同的 `this` 对象，如果箭头函数在其它函数的内部，它也将共享该函数的 `arguments` 变量。

```js
function(i){ return i + 1; } //ES5
(i) => i + 1 //ES6
```

简直是简单的不像话对吧...

如果函数比较复杂，则需要用 `{}` 把代码包起来：

```js
function(x, y) {
    x++;
    y--;
    return x + y;
}
(x, y) => {x++; y--; return x+y}
```

除了看上去更简洁以外，arrow function 还有一项超级无敌的功能！

长期以来，JavaScript 语言的 `this` 对象一直是一个令人头痛的问题，在对象方法中使用 `this`，必须非常小心。例如：

```js
class Animal {
  constructor() {
    this.type = "animal";
  }
  says(say) {
    setTimeout(function() {
      console.log(this.type + " says " + say);
    }, 1000);
  }
}

var animal = new Animal();
animal.says("hi"); //undefined says hi
```

运行上面的代码会报错，这是因为`setTimeout`中的`this`指向的是全局对象。所以为了让它能够正确的运行，传统的解决方法有两种：

（1）第一种是将 this 传给 self,再用 self 来指代 this

```js
 says(say){
     var self = this;
     setTimeout(function(){
         console.log(self.type + ' says ' + say)
     }, 1000)
```

（2）第二种方法是用`bind(this)`,即

```js
says(say){
    setTimeout(function(){
        console.log(self.type + ' says ' + say)
    }.bind(this), 1000)
```

但现在我们有了箭头函数，就不需要这么麻烦了：

```js
class Animal {
  constructor() {
    this.type = "animal";
  }
  says(say) {
    setTimeout(() => {
      console.log(this.type + " says " + say);
    }, 1000);
  }
}
var animal = new Animal();
animal.says("hi"); //animal says hi
```

当我们使用箭头函数时，函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。

并不是因为箭头函数内部有绑定 this 的机制，实际原因是箭头函数根本没有自己的 this，它的 this 是继承外面的，因此内部的 this 就是外层代码块的 this。

### let, const

这两个关键字具有块级作用域。

- `let` 用于声明变量；
- `const` 用于声明常量。`const` 仅允许被赋值一次，通过静态限制（Static restrictions ）的方式阻止变量在赋值前被使用。

#### let

ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。

（1）内层变量覆盖外层变量

`var` vs. `let` 示例 1：

```js
// ES5 示例
var name = "zach";

while (true) {
  var name = "obama";
  console.log(name); //obama
  break;
}

console.log(name); //obama

--------------------------------------

// ES6 示例
let name = "zach";

while (true) {
  let name = "obama";
  console.log(name); //obama
  break;
}

console.log(name); //zach
```

> 说明：使用 `var` 两次输出都是 obama。而 `let` 则实际上为 JavaScript 新增了块级作用域。用它所声明的变量，只在 `let` 命令所在的代码块内有效。

（2）用来计数的循环变量泄露为全局变量

`var` vs. `let` 示例 2：

```js
// ES5
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  };
}
a[6](); // 10

// ES6
let a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  };
}
a[6](); // 6
```

说明：上面代码中，变量 i 是 `var` 声明的，在全局范围内都有效。所以每一次循环，新的 i 值都会覆盖旧值，导致最后输出的是最后一轮的 i 的值。而使用 `let` 则不会出现这个问题。

#### const

`const` 用于声明常量，一旦声明，常量的值就不能改变。

```js
const PI = Math.PI;
PI = 23; //Module build failed: SyntaxError: /es6/app.js: "PI" is read-only
```

当我们尝试去改变用 const 声明的常量时，浏览器就会报错。

`const` 有一个很好的应用场景，就是当我们引用第三方库的时声明的变量，用 `const` 来声明可以避免未来不小心重命名而导致出现 bug：

```js
const monent = require("moment");
```

### class, extends, super

这三个特性涉及了 ES5 中最令人头疼的的几个部分：原型、构造函数，继承。
有了 ES6 我们不再烦恼！

ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念。新的 class 写法让对象原型的写法更加清晰、更像面向对象编程的语法，也更加通俗易懂。

```js
class Animal {
  constructor() {
    this.type = "animal";
  }
  says(say) {
    console.log(this.type + " says " + say);
  }
}

let animal = new Animal();
animal.says("hello"); //animal says hello

class Cat extends Animal {
  constructor() {
    super();
    this.type = "cat";
  }
}

let cat = new Cat();
cat.says("hello"); //cat says hello
```

上面代码首先用 `class` 定义了一个类，可以看到里面有一个 `constructor` 方法，这就是构造方法，而 `this` 关键字则代表实例对象。简单地说，`constructor` 内定义的方法和属性是实例对象自己的，而 `constructor` 外定义的方法和属性则是所有实力对象可以共享的。

ES2015 的类只是一个语法糖，通过 class 关键字让语法更接近传统的面向对象模式，本质上还是基于原型的。使用单一便捷的声明格式，使得类使用起来更方便，也更具互操作性。类支持基于原型的继承，调用父类的构造函数，生成实例，静态方法和构造函数。

`Class` 之间可以通过 `extends` 关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。上面定义了一个 Cat 类，该类通过 `extends` 关键字，继承了 Animal 类的所有属性和方法。

`super` 关键字，它指代父类的实例（即父类的 this 对象）。子类必须在 `constructor` 方法中调用 `super` 方法，否则新建实例时会报错。这是因为子类没有自己的 `this` 对象，而是继承父类的 `this` 对象，然后对其进行加工。如果不调用 `super` 方法，子类就得不到 `this` 对象。

ES6 的继承机制，实质是先创造父类的实例对象 `this`（所以必须先调用 `super` 方法），然后再用子类的构造函数修改 `this`。

P.S 如果你写 react 的话，就会发现以上三个东西在最新版 React 中出现得很多。创建的每个 component 都是一个继承`React.Component`的类。[详见 react 文档](https://facebook.github.io/react/docs/reusable-components.html)

### template strings

模版字符串提供了构建字符串的语法糖，类似于 Perl，Python 等语言中的字符串插值。可以构建一个自定义标签，避免注入攻击或者从字符串内容中构建更加高级的数据结构。

当我们要插入大段的 html 内容到文档中时，传统的写法非常麻烦：

```js
// ES5
$("#result").append(
  "There are <b>" +
    basket.count +
    "</b> " +
    "items in your basket, " +
    "<em>" +
    basket.onSale +
    "</em> are on sale!"
);
```

我们要用一堆的'+'号来连接文本与变量，而使用 ES6 的新特性模板字符串 `` 后，我们可以直接这么来写：

```js
// ES6
$("#result").append(`
  There are <b>${basket.count}</b> items
   in your basket, <em>${basket.onSale}</em>
  are on sale!
`);
```

用反引号 `\`` 来标识起始，用 ${}来引用变量，而且所有的空格和缩进都会被保留在输出之中。

```js
// 创建基本的模板字符串
`This is a pretty little template string.``In ES5 this is // 多行字符串
 not legal.`;

// 插入变量
var name = "Bob",
  time = "today";
`Hello ${name}, how are you ${time}?`;

// 不用转义
String.raw`In ES5 "\n" is a line-feed.`;

// 创建一个HTTP请求头的模版字符串，通过替换内容来构建请求
GET`http://foo.org/bar?a=${a}&b=${b}
    Content-Type: application/json
    X-Credentials: ${credentials}
    { "foo": ${foo},
      "bar": ${bar} }`(myOnReadyStateChangeHandler);
```

### Destructuring

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

看下面的例子：

```js
var cat = "ken";
var dog = "lili";
var zoo = { cat: cat, dog: dog };
console.log(zoo); //Object {cat: "ken", dog: "lili"}
```

用 ES6 完全可以像下面这么写：

```js
let cat = "ken";
let dog = "lili";
let zoo = { cat, dog };
console.log(zoo); //Object {cat: "ken", dog: "lili"}
```

反过来可以这么写：

```js
let dog = { type: "animal", many: 2 };
let { type, many } = dog;
console.log(type, many); //animal 2
```

解构允许使用模式匹配的方式进行绑定，并支持匹配 数组和对象。解构具有一定的容错机制，就像查找普通对象`foo['foo']`这样，当没有找到时会返回`undefined`（而不会直接报错）。

> 注：当上层结构都不存在时，解构是会报错的，如`const [{id: id}] = []`，解构数组为空，导致整个 obj 为`undefined`，此时再去找`obj.id`就会报错。

```js
// 列表（数组）匹配
var [a, , b] = [1, 2, 3];

// 对象匹配
var {
  op: a,
  lhs: { op: b },
  rhs: c
} = getASTNode();

// 对象匹配的简写
// 绑定当前作用域的 `op`, `lhs` 和 `rhs`
var { op, lhs, rhs } = getASTNode();

// 可以用在函数的参数中
function g({ name: x }) {
  console.log(x);
}
g({ name: 5 });

// 解构容错机制
var [a] = [];
a === undefined;

// 带默认值的解构容错
var [a = 1] = [];
a === 1;

// 解构 + 默认参数
function r({ x, y, w = 10, h = 10 }) {
  return x + y + w + h;
}
r({ x: 1, y: 2 }) === 23;
```

### default, rest, spread

（1）默认参数

默认参数(default)的功能是在函数被调用时对参数做自动估值(若没被赋值，则自动赋值)

大家可以看下面的例子，调用`animal()`方法时忘了传参数，传统的做法就是加上这一句`type = type || 'cat'`来指定默认值。

```js
// ES5
function animal(type) {
  type = type || "cat";
  console.log(type);
}
animal();

// ES6
function animal(type = "cat") {
  console.log(type);
}
animal();
```

（2）不定参数

不定参数(rest)用在参数末尾，将最末尾的参数转换为数组。不定参数(rest)让我们不再需要`arguments`，更直接地解决了一些常见的问题。

最后一个 rest 语法也很简单，直接看例子：

```js
function animals(...types) {
  console.log(types);
}
animals("cat", "dog", "fish"); //["cat", "dog", "fish"]
```

而如果不用 ES6 的话，我们则得使用 ES5 的`arguments`。

（3）扩展运算符

扩展运算符(spread)则可以将数组转换为连续的函数参数，

```js
function f(x, y, z) {
  return x + y + z;
}
// 将数组中的每个元素展开为函数参数
f(...[1, 2, 3]) == 6;
```

### 增强的对象字面量

经扩展后的对象字面量，允许在结构中设置原型，简化了`foo: foo`这样的赋值，定义方法和调用父级。这样使得对象字面量（Object Literals）更接近类的声明，并且使得基于对象的设计更加方便。

```js
var obj = {
  // 设置 prototype
  __proto__: theProtoObj,
  // 计算属性不会重复设置__proto__，或者将直接触发错误。
  ["__proto__"]: somethingElse,
  // ‘handler: handler’ 简写
  handler,
  // 方法
  toString() {
    // 调用父级方法
    return "d " + super.toString();
  },
  // 设置动态的属性名
  ["prop_" + (() => 42)()]: 42
};
```

> `__proto__` 需要原生支持, 并且在 之前的 ECMAScript 版本中已被弃用。虽然现在大多数引擎支持, 但是 [仍有些引擎](https://kangax.github.io/compat-table/es6/#__proto___in_object_literals)是不支持的。另外，值得注意的是，如同[附录 B](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.prototype.__proto__)所示，只有 [web 浏览器](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-additional-ecmascript-features-for-web-browsers) 仍然需要支持该属性。在 node 中已经被支持。

### Iterator，for..Of

ES6 中的迭代器(Iterators)对象允许像 CLR(Common Language Runtime)的 IEnumerable 接口或者 Java 的 Iterable 一样创建自定义迭代器，可以将`for..in`这种遍历模式更加一般化为`for..of`的形式。它是支持惰性模式的，不需要真正实现一个数组（只需要实现 Iterator 接口），就像 LINQ 语言那样。

```js
// 实现斐波那契数列的迭代器
let fibonacci = {
  [Symbol.iterator]() {
    let pre = 0,
      cur = 1;
    return {
      next() {
        [pre, cur] = [cur, pre + cur];
        return { done: false, value: cur };
      }
    };
  }
};

for (var n of fibonacci) {
  // 循环将在n > 1000 时结束
  if (n > 1000) break;
  console.log(n);
}
```

迭代器还可以基于”鸭子类型”来实现（使用[TypeScript](http://typescriptlang.org/) 这种基于类型的语法来说明）：

```js
interface IteratorResult {
  done: boolean;
  value: any;
}
interface Iterator {
  next(): IteratorResult;
}
interface Iterable {
  [Symbol.iterator](): Iterator
}
```

> 通过 polyfill 支持
>
> 为了使用迭代器你必须引入 Babel 的 [polyfill](https://www.babeljs.cn/docs/usage/polyfill).

### Generators

Generator 通过使用`function*`和`yield`关键字简化了迭代器的编写。通过`function*`声明的函数会返回一个 Generators 实例。Generator 可以看做是迭代器的子类，包含了额外的`next`和`throw`方法。这些特性可以让得到的结果值再传回 Generator，因此`yield`是一个具有返回值（或抛出一个值）的表达式。

注意：Generator 也可以用于使用‘await’这样的异步编程中，详见 ES7 `await` [协议](https://github.com/lukehoban/ecmascript-asyncawait).

```js
var fibonacci = {
  [Symbol.iterator]: function*() {
    var pre = 0,
      cur = 1;
    for (;;) {
      var temp = pre;
      pre = cur;
      cur += temp;
      yield cur;
    }
  }
};

for (var n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 1000) break;
  console.log(n);
}
```

Generator 接口 (使用[TypeScript](http://typescriptlang.org/) 这种基于类型的语法来说明):

```js
interface Generator extends Iterator {
    next(value?: any): IteratorResult;
    throw(exception: any);
}
```

> 通过 polyfill 支持
>
> 要使用 Generator，你需要在项目中包含 Babel 的 [polyfill](https://www.babeljs.cn/docs/usage/polyfill).

### Unicode

ES6 加强了对 Unicode 编码 的支持，包括新的 unicode 表示法，正则表达式的`u`模式来匹配码点（code points），也提供新的 API 去处理 21 位的码点（code points）。这些新特性允许我们使用 JavaScript 构建国际化的应用。

```js
// 和ES5.1相同
"𠮷".length == 2;

// 正则表达式新的u模式
"𠮷".match(/./u)[0].length == 2;

// 新的unicode表示法
("\u{20BB7}" == "𠮷") == "\uD842\uDFB7";

// 新的字符串方法
"𠮷".codePointAt(0) == 0x20bb7;

// for of迭代码点
for (var c of "𠮷") {
  console.log(c);
}
```

### Module

ES6 从语言层面对模块进行了支持。编写方式借鉴了流行的 JavaScript 模块加载器（AMD, CommonJS）。由宿主环境的默认加载器定义模块运行时的行为，采取隐式异步模式——在模块可以被获取和加载前不会有代码执行。

```js
// lib/math.js
export function sum(x, y) {
  return x + y;
}
export var pi = 3.141593;
// app.js
import * as math from "lib/math";
console.log("2π = " + math.sum(math.pi, math.pi));
// otherApp.js
import { sum, pi } from "lib/math";
console.log("2π = " + sum(pi, pi));
```

还有的功能包括：`export default` and `export *`:

```js
// lib/mathplusplus.js
export * from "lib/math";
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}
// app.js
import exp, { pi, e } from "lib/mathplusplus";
console.log("e^π = " + exp(pi));
```

> 模块的格式：
>
> Babel 可以将 ES2015 的模块转换为一下几种格式：Common.js，AMD，System，以及 UMD。你甚至可以创建你自己的方式。详见[模块文档](https://www.babeljs.cn/docs/plugins/).

### Module Loader

> 非 ES2015 部分
>
> 这并不是 ES2015 的一部分：这部分 ECMAScript 2015 规范是由实现定义（implementation-defined）的。最终的标准将在 WHATWG 的[Loader 规范](https://whatwg.github.io/loader/)中确定，目前这项工作正在进行中，下面的内容来自于之前的 ES2015 草稿。

模块加载器支持以下功能：

- 动态加载（Dynamic loading）
- 状态一致性（State isolation）
- 全局空间一致性（Global namespace isolation）
- 编译钩子（Compilation hooks）
- 嵌套虚拟化（Nested virtualization）

你可以对默认的加载器进行配置，构建出新的加载器，可以被加载于独立或受限的执行环境。

```js
// 动态加载 – ‘System’ 是默认的加载器
System.import("lib/math").then(function(m) {
  alert("2π = " + m.sum(m.pi, m.pi));
});

// 创建执行沙箱 – new Loaders
var loader = new Loader({
  global: fixup(window) // replace ‘console.log’
});
loader.eval('console.log("hello world!");');

// 直接操作模块的缓存
System.get("jquery");
System.set("jquery", Module({ $: $ })); // WARNING: not yet finalized
```

> 需要额外的 polyfill
>
> 由于 Babel 默认使用 common.js 的模块，你需要一个 polyfill 来使用加载器 API。 [点击获取](https://github.com/ModuleLoader/es6-module-loader).

> 使用模块加载器
>
> 为了使用此功能，你需要告诉 Babel 使用`system`模块格式化工具。在此查看 [System.js](https://github.com/systemjs/systemjs)

### Map + Set + WeakMap + WeakSet

为常见算法的实现提供了更有效的数据结构。WeakMaps 提供了对对象的弱引用（不会被垃圾回收计数）。

```js
// Sets
var s = new Set();
s.add("hello")
  .add("goodbye")
  .add("hello");
s.size === 2;
s.has("hello") === true;

// Maps
var m = new Map();
m.set("hello", 42);
m.set(s, 34);
m.get(s) == 34;

// Weak Maps
var wm = new WeakMap();
wm.set(s, { extra: 42 });
wm.size === undefined;

// Weak Sets
var ws = new WeakSet();
ws.add({ data: 42 });
// 由于传入的对象没有其它引用，故将不会被set保存。
```

> 需要 polyfill 支持
>
> 为了在所有环境下使用 Maps，Sets，WeakMaps 和 WeakSets，你需要使用 Babel 的 [polyfill](https://www.babeljs.cn/docs/usage/polyfill).

### Proxy

Proxy(代理对象) 允许创建一个可以全范围控制宿主对象行为的对象，可用于拦截，对象的虚拟化，日志记录/性能分析等。

```js
// 代理普通对象
var target = {};
var handler = {
  get: function(receiver, name) {
    return `Hello, ${name}!`;
  }
};

var p = new Proxy(target, handler);
p.world === "Hello, world!";
// 代理函数对象
var target = function() {
  return "I am the target";
};
var handler = {
  apply: function(receiver, ...args) {
    return "I am the proxy";
  }
};

var p = new Proxy(target, handler);
p() === "I am the proxy";
```

下面是完全在运行态的元操作（meta-operations）中可能出现的 trap：

```js
var handler =
{
  // target.prop
  get: ...,
  // target.prop = value
  set: ...,
  // 'prop' in target
  has: ...,
  // delete target.prop
  deleteProperty: ...,
  // target(...args)
  apply: ...,
  // new target(...args)
  construct: ...,
  // Object.getOwnPropertyDescriptor(target, 'prop')
  getOwnPropertyDescriptor: ...,
  // Object.defineProperty(target, 'prop', descriptor)
  defineProperty: ...,
  // Object.getPrototypeOf(target), Reflect.getPrototypeOf(target),
  // target.__proto__, object.isPrototypeOf(target), object instanceof target
  getPrototypeOf: ...,
  // Object.setPrototypeOf(target), Reflect.setPrototypeOf(target)
  setPrototypeOf: ...,
  // for (let i in target) {}
  enumerate: ...,
  // Object.keys(target)
  ownKeys: ...,
  // Object.preventExtensions(target)
  preventExtensions: ...,
  // Object.isExtensible(target)
  isExtensible :...
}
```

> 不支持的特性
>
> 由于 ES5 的局限性，Proxies 无法被转换或者通过 polyfill 兼容，查看[不同 JavaScript 引擎](https://kangax.github.io/compat-table/es6/#test-Proxy).

### Symbols

Symbol 对对象的状态进行访问控制。Symbol 允许对象的属性不仅可以通过`string（ES5）`命名，还可以通过`symbol`命名。`symbol`是一种基本数据类型。可选的`name`参数用于调试——但并不是它本身的一部分。Symbol 是唯一的，但不是私有的，因为它们使用诸如`Object.getOwnPropertySymbols`这样的方法来使用。

```js
(function() {

  // 模块内的 symbol
  var key = Symbol("key");

  function MyClass(privateData) {
    this[key] = privateData;
  }

  MyClass.prototype = {
    doStuff: function() {
      ... this[key] ...
    }
  };

  // Bable只能有限支持，完全支持需要原生实现
  typeof key === "symbol"
})();

var c = new MyClass("hello")
c["key"] === undefined
```

> 通过 polyfill 部分实现：
>
> 通过 Babel 的[polyfill](https://www.babeljs.cn/docs/usage/polyfill).部分实现。由于语言的限制，部分功能不能转换或通过 polyfill 兼容。您可以查看 code.js 的 [注意事项](https://github.com/zloirock/core-js#caveats-when-using-symbol-polyfill) 获取更多信息.

### 可以被继承的内建对象

在 ES2015 中，可以创建内建对象如`Array`，`Date`以及`DOMElement`的子类。

```js
// 创建Array的子类
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[1] = 12;
arr.length == 2;
```

> 部分支持
>
> 部分支持：由于 ES5 引擎的限制，可以创建 HTMLElement 的子类，但不能创建诸如 Array，Date 和 Error 等对象的子类。

### Math + Number + String + Object APIs

新增很多功能，如核心的 Math 库，数组转换和用于对象复制的 Object.assign()。

```js
Number.EPSILON;
Number.isInteger(Infinity); // false
Number.isNaN("NaN"); // false

Math.acosh(3); // 1.762747174039086
Math.hypot(3, 4); // 5
Math.imul(Math.pow(2, 32) - 1, Math.pow(2, 32) - 2); // 2

"abcde".includes("cd"); // true
"abc".repeat(3); // "abcabcabc"

Array.from(document.querySelectorAll("*")); // Returns a real Array
Array.of(1, 2, 3) // Similar to new Array(...), but without special one-arg behavior
  [(0, 0, 0)].fill(7, 1) // [0,7,7]
  [(1, 2, 3)].findIndex(x => x == 2) // 1
  [("a", "b", "c")].entries() // iterator [0, "a"], [1,"b"], [2,"c"]
  [("a", "b", "c")].keys() // iterator 0, 1, 2
  [("a", "b", "c")].values(); // iterator "a", "b", "c"

Object.assign(Point, { origin: new Point(0, 0) });
```

> 通过 polyfill 有限的支持
>
> 上述许多 API 都通过 polyfill 进行了支持，但是部分特性由于多种原因没有被实现（如，String.prototype.normalize 需要编写大量额外的代码来实现），你可以在 [这里](https://github.com/addyosmani/es6-tools#polyfills)找到更多的 polyfill。

### 二进制和八进制字面量

新增两种数字字面量：二进制`b`和八进制`o`。

```js
0b111110111 === 503; // true
0o767 === 503; // true
```

> 仅支持字面模式
>
> Babel 仅可以转换 0o767，并不能转换 Number("0o767")。

### Promises

Promises 是一种异步编程的方式。Promises 在将来可能会得到支持。目前很多的 JavaScript 库都使用了 Promises。

```js
function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

var p = timeout(1000)
  .then(() => {
    return timeout(2000);
  })
  .then(() => {
    throw new Error("hmm");
  })
  .catch(err => {
    return Promise.all([timeout(100), timeout(200)]);
  });
```

> 通过 polyfill
>
> 要使用 Promises，你需要引入 Babel 的 [polyfill](https://www.babeljs.cn/docs/usage/polyfill).

### Reflect API

完整的 Reflect API 暴露在对象的运行级元操作上。它可以用来有效地还原 Proxy API，并允许调用相应的 proxy traps，尤其是在执行 proxies 时非常有用。

```js
var O = { a: 1 };
Object.defineProperty(O, "b", { value: 2 });
O[Symbol("c")] = 3;

Reflect.ownKeys(O); // ['a', 'b', Symbol(c)]

function C(a, b) {
  this.c = a + b;
}
var instance = Reflect.construct(C, [20, 22]);
instance.c; // 42
```

> 通过 polyfill
>
> 要使用 Reflect API，你需要引入 Babel 的 [polyfill](https://www.babeljs.cn/docs/usage/polyfill).

### Tail Calls(尾调用)

尾递归调用可以保证调用栈不会无限增长，使得在无界输入的情况下，递归算法是安全的。

```js
function factorial(n, acc = 1) {
    "use strict";
    if (n <= 1) return acc;
    return factorial(n - 1, n * acc);
}

// 在绝大多数JS引擎中运行这段代码会导致栈溢出
// 但是在ES2015中，即便输入很随意也可以安全运行
factorial(100000)
```

## 更多内容

> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

- **官方**
  - [ECMAScript 2015](https://www.ecma-international.org/ecma-262/6.0/index.html)
- **教程**
  - [ECMAScript 6 入门](https://github.com/ruanyf/es6tutorial)
  - [ES6-Learning](https://github.com/ericdouglas/ES6-Learning)
- **文章**
  - [30 分钟掌握 ES6/ES2015 核心内容](http://www.jianshu.com/p/ebfeb687eb70)
  - [ECMAScript 6 in WebStorm: Transpiling](https://blog.jetbrains.com/webstorm/2015/05/ecmascript-6-in-webstorm-transpiling/)
  - [ECMAScript 6 特性](https://github.com/lukehoban/es6features)
