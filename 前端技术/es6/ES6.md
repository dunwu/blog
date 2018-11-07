# ES6

<!-- TOC depthFrom:2 depthTo:3 -->

- [最常用的 ES6 特性](#最常用的-es6-特性)
    - [let, const](#let-const)
    - [class, extends, super](#class-extends-super)
    - [arrow function](#arrow-function)
    - [template string](#template-string)
    - [destructuring](#destructuring)
    - [default, rest](#default-rest)
- [引申和引用](#引申和引用)

<!-- /TOC -->

ECMAScript 6（以下简称 ES6）是 JavaScript 语言的下一代标准。

因为当前版本的 ES6 是在 2015 年发布的，所以又称 ECMAScript 2015。

也就是说，ES6 就是 ES2015。

目前，并非所有的浏览器都支持 ES6。所以，如果要让浏览器能够理解 ES6 的语义，需要使用转码器，比如最流行的 Babel。

## 最常用的 ES6 特性

`let, const, class, extends, super, arrow functions, template string, destructuring, default, rest arguments`
这些是 ES6 最常用的几个语法，基本上学会它们，我们就可以走遍天下都不怕啦！我会用最通俗易懂的语言和例子来讲解它们，保证一看就懂，一学就会。

### let, const

这两个的用途与`var`类似，都是用来声明变量的，但在实际运用中他俩都有各自的特殊用途。
首先来看下面这个例子：

```jsx
var name = "zach";

while (true) {
  var name = "obama";
  console.log(name); //obama
  break;
}

console.log(name); //obama
```

使用`var`两次输出都是 obama，这是因为 ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。第一种场景就是你现在看到的内层变量覆盖外层变量。而`let`则实际上为 JavaScript 新增了块级作用域。用它所声明的变量，只在`let`命令所在的代码块内有效。

```jsx
let name = "zach";

while (true) {
  let name = "obama";
  console.log(name); //obama
  break;
}

console.log(name); //zach
```

另外一个`var`带来的不合理场景就是用来计数的循环变量泄露为全局变量，看下面的例子：

```jsx
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  };
}
a[6](); // 10
```

上面代码中，变量 i 是 var 声明的，在全局范围内都有效。所以每一次循环，新的 i 值都会覆盖旧值，导致最后输出的是最后一轮的 i 的值。而使用 let 则不会出现这个问题。

```jsx
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  };
}
a[6](); // 6
```

再来看一个更常见的例子，了解下如果不用 ES6，而用闭包如何解决这个问题。

```jsx
var clickBoxs = document.querySelectorAll(".clickBox");
for (var i = 0; i < clickBoxs.length; i++) {
  clickBoxs[i].onclick = function() {
    console.log(i);
  };
}
```

我们本来希望的是点击不同的 clickBox，显示不同的 i，但事实是无论我们点击哪个 clickBox，输出的都是 5。下面我们来看下，如何用闭包搞定它。

```jsx
function iteratorFactory(i) {
  var onclick = function(e) {
    console.log(i);
  };
  return onclick;
}
var clickBoxs = document.querySelectorAll(".clickBox");
for (var i = 0; i < clickBoxs.length; i++) {
  clickBoxs[i].onclick = iteratorFactory(i);
}
```

`const`也用来声明变量，但是声明的是常量。一旦声明，常量的值就不能改变。

```jsx
const PI = Math.PI;

PI = 23; //Module build failed: SyntaxError: /es6/app.js: "PI" is read-only
```

当我们尝试去改变用 const 声明的常量时，浏览器就会报错。
const 有一个很好的应用场景，就是当我们引用第三方库的时声明的变量，用 const 来声明可以避免未来不小心重命名而导致出现 bug：

```jsx
const monent = require("moment");
```

### class, extends, super

这三个特性涉及了 ES5 中最令人头疼的的几个部分：原型、构造函数，继承...你还在为它们复杂难懂的语法而烦恼吗？你还在为指针到底指向哪里而纠结万分吗？

有了 ES6 我们不再烦恼！

ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念。新的 class 写法让对象原型的写法更加清晰、更像面向对象编程的语法，也更加通俗易懂。

```
class Animal {
    constructor(){
        this.type = 'animal'
    }
    says(say){
        console.log(this.type + ' says ' + say)
    }
}

let animal = new Animal()
animal.says('hello') //animal says hello

class Cat extends Animal {
    constructor(){
        super()
        this.type = 'cat'
    }
}

let cat = new Cat()
cat.says('hello') //cat says hello
```

上面代码首先用`class`定义了一个“类”，可以看到里面有一个`constructor`方法，这就是构造方法，而`this`关键字则代表实例对象。简单地说，`constructor`内定义的方法和属性是实例对象自己的，而`constructor`外定义的方法和属性则是所有实力对象可以共享的。

Class 之间可以通过`extends`关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。上面定义了一个 Cat 类，该类通过`extends`关键字，继承了 Animal 类的所有属性和方法。

`super`关键字，它指代父类的实例（即父类的 this 对象）。子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类没有自己的`this`对象，而是继承父类的`this`对象，然后对其进行加工。如果不调用`super`方法，子类就得不到`this`对象。

ES6 的继承机制，实质是先创造父类的实例对象 this（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。

P.S 如果你写 react 的话，就会发现以上三个东西在最新版 React 中出现得很多。创建的每个 component 都是一个继承`React.Component`的类。[详见 react 文档](https://facebook.github.io/react/docs/reusable-components.html)

### arrow function

这个恐怕是 ES6 最最常用的一个新特性了，用它来写 function 比原来的写法要简洁清晰很多:

```
function(i){ return i + 1; } //ES5
(i) => i + 1 //ES6
```

简直是简单的不像话对吧...
如果方程比较复杂，则需要用`{}`把代码包起来：

```
function(x, y) {
    x++;
    y--;
    return x + y;
}
(x, y) => {x++; y--; return x+y}
```

除了看上去更简洁以外，arrow function 还有一项超级无敌的功能！
长期以来，JavaScript 语言的`this`对象一直是一个令人头痛的问题，在对象方法中使用 this，必须非常小心。例如：

```
class Animal {
    constructor(){
        this.type = 'animal'
    }
    says(say){
        setTimeout(function(){
            console.log(this.type + ' says ' + say)
        }, 1000)
    }
}

 var animal = new Animal()
 animal.says('hi')  //undefined says hi
```

运行上面的代码会报错，这是因为`setTimeout`中的`this`指向的是全局对象。所以为了让它能够正确的运行，传统的解决方法有两种：

1. 第一种是将 this 传给 self,再用 self 来指代 this

   ```
    says(say){
        var self = this;
        setTimeout(function(){
            console.log(self.type + ' says ' + say)
        }, 1000)
   ```

   2.第二种方法是用`bind(this)`,即

   ```
    says(say){
        setTimeout(function(){
            console.log(self.type + ' says ' + say)
        }.bind(this), 1000)
   ```

   但现在我们有了箭头函数，就不需要这么麻烦了：

```
class Animal {
    constructor(){
        this.type = 'animal'
    }
    says(say){
        setTimeout( () => {
            console.log(this.type + ' says ' + say)
        }, 1000)
    }
}
 var animal = new Animal()
 animal.says('hi')  //animal says hi
```

当我们使用箭头函数时，函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。
并不是因为箭头函数内部有绑定 this 的机制，实际原因是箭头函数根本没有自己的 this，它的 this 是继承外面的，因此内部的 this 就是外层代码块的 this。

### template string

这个东西也是非常有用，当我们要插入大段的 html 内容到文档中时，传统的写法非常麻烦，所以之前我们通常会引用一些模板工具库，比如 mustache 等等。

大家可以先看下面一段代码：

```
$("#result").append(
  "There are <b>" + basket.count + "</b> " +
  "items in your basket, " +
  "<em>" + basket.onSale +
  "</em> are on sale!"
);
```

我们要用一堆的'+'号来连接文本与变量，而使用 ES6 的新特性模板字符串``后，我们可以直接这么来写：

```
$("#result").append(`
  There are <b>${basket.count}</b> items
   in your basket, <em>${basket.onSale}</em>
  are on sale!
`);
```

用反引号`（`）`来标识起始，用`${}`来引用变量，而且所有的空格和缩进都会被保留在输出之中，是不是非常爽？！

React Router 从第 1.0.3 版开始也使用 ES6 语法了，比如这个例子：
`{taco.name}`
[React Router](https://github.com/rackt/react-router/blob/latest/examples/passing-props-to-children/app.js)

### destructuring

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

看下面的例子：

```
let cat = 'ken'
let dog = 'lili'
let zoo = {cat: cat, dog: dog}
console.log(zoo)  //Object {cat: "ken", dog: "lili"}
```

用 ES6 完全可以像下面这么写：

```
let cat = 'ken'
let dog = 'lili'
let zoo = {cat, dog}
console.log(zoo)  //Object {cat: "ken", dog: "lili"}
```

反过来可以这么写：

```
let dog = {type: 'animal', many: 2}
let { type, many} = dog
console.log(type, many)   //animal 2
```

### default, rest

default 很简单，意思就是默认值。大家可以看下面的例子，调用`animal()`方法时忘了传参数，传统的做法就是加上这一句`type = type || 'cat'`来指定默认值。

```
function animal(type){
    type = type || 'cat'
    console.log(type)
}
animal()
```

如果用 ES6 我们而已直接这么写：

```
function animal(type = 'cat'){
    console.log(type)
}
animal()
```

最后一个 rest 语法也很简单，直接看例子：

```
function animals(...types){
    console.log(types)
}
animals('cat', 'dog', 'fish') //["cat", "dog", "fish"]
```

而如果不用 ES6 的话，我们则得使用 ES5 的`arguments`。

## 引申和引用

> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

- **教程**
  - [ECMAScript 6 入门](https://github.com/ruanyf/es6tutorial)
  - [ES6-Learning](https://github.com/ericdouglas/ES6-Learning)
- **文章**
  - [30 分钟掌握 ES6/ES2015 核心内容](http://www.jianshu.com/p/ebfeb687eb70)
  - [ECMAScript 6 in WebStorm: Transpiling](https://blog.jetbrains.com/webstorm/2015/05/ecmascript-6-in-webstorm-transpiling/)
  - [ECMAScript 6 特性](https://github.com/lukehoban/es6features)
