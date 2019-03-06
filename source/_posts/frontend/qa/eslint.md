---
title: ESLint
date: 2019-03-06
---

# ESLint

ESLint 是一种用于识别和报告 ECMAScript / JavaScript 代码中的模式的工具。在许多方面，它类似于 JSLint 和 JSHint，但有一些例外：

- ESLint 使用 Espree 进行 JavaScript 解析。
- ESLint 使用 AST 来评估代码中的模式。
- ESLint 是完全可插拔的，每个规则都是一个插件，您可以在运行时添加更多。

<!-- TOC depthFrom:2 depthTo:3 -->

- [安装](#安装)
- [ESLint 配置](#eslint-配置)
    - [指定解析器选项](#指定解析器选项)
    - [指定解析器](#指定解析器)
    - [指定环境](#指定环境)
    - [指定全局变量](#指定全局变量)
    - [配置插件](#配置插件)
    - [配置规则](#配置规则)
    - [使用行注释禁用规则](#使用行注释禁用规则)
    - [添加分享配置](#添加分享配置)
    - [使用配置文件](#使用配置文件)
    - [配置文件文件格式](#配置文件文件格式)
    - [配置的层级和继承](#配置的层级和继承)
    - [扩展配置文件](#扩展配置文件)
    - [基于 glob 模式的配置](#基于-glob-模式的配置)
    - [在配置文件中注释](#在配置文件中注释)
    - [指定需要检查的文件扩展名](#指定需要检查的文件扩展名)
    - [忽略文件和目录](#忽略文件和目录)
- [实战](#实战)
    - [ESLint 集成 Airbnb](#eslint-集成-airbnb)
- [ESLint 命令](#eslint-命令)
    - [选项](#选项)
    - [.eslintignore 文件](#eslintignore-文件)
- [更多内容](#更多内容)

<!-- /TOC -->

## 安装

（1）本地安装

如果要将 ESLint 作为项目构建系统的一部分，我们建议在本地进行安装。你可以使用 npm：

```sh
$ npm install eslint --save-dev
```

然后您应该设置一个配置文件：

```sh
$ ./node_modules/.bin/eslint --init
```

之后，您可以在项目的根目录中运行 ESLint，如下所示：

```sh
$ ./node_modules/.bin/eslint yourfile.js
```

您使用的任何插件或可共享配置也必须在本地安装以与本地安装的 ESLint 配合使用。

（2）全局安装

如果要使 ESLint 可用于跨所有项目运行的工具，我们建议在全局安装 ESLint。你可以使用 npm：

```sh
$ npm install -g eslint
```

然后您应该设置一个配置文件：

```sh
$ eslint --init
```

之后，您可以在任何文件或目录下运行 ESLint，如下所示：

```sh
$ eslint yourfile.js
```

您使用的任何插件或可共享配置也必须全局安装，才能使用全局安装的 ESLint。

> 注意：eslint --init 旨在根据每个项目设置和配置 ESLint，并将 ESLint 及其插件的本地安装运行在其运行的目录中。如果您希望使用 ESLint 的全局安装，则配置中使用的任何插件也必须全局安装

## ESLint 配置

运行 `eslint --init` 后，您的目录中将有一个 `.eslintrc` 文件。在其中，您将看到一些如下配置的规则：

```json
{
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
  }
}
```

`semi` 和 `quotes` 是 ESLint 中规则的名称。第一个值是规则的错误级别，可以是以下值之一：

- `off` or `0` -  关闭规则
- `warn` or `1` -  将规则作为警告（不影响退出代码）
- `error` or `2` -  将规则作为错误（退出代码将为 1）

这三个错误级别允许您细分控制 ESLint 如何应用规则（有关更多配置选项和详细信息，请参阅[配置文档](https://eslint.org/docs/user-guide/configuring)）。

您的 `.eslintrc` 配置文件也将包括以下行：

```json
"extends": "eslint:recommended"
```

由于这一行，[规则页面](https://eslint.org/docs/rules/)上的所有打钩的规则都将被打开。或者，您可以通过在  [npmjs.com](https://www.npmjs.com/search?q=eslint-config) 上搜索 “eslint-config” 来使用其他人创建的配置。 ESLint 不会删除您的代码，除非您从共享配置中扩展或在配置中明确地打开规则。

ESlint 被设计为完全可配置的，这意味着你可以关闭每一个规则而只运行基本语法验证，或混合和匹配 ESLint 默认绑定的规则和你的自定义规则，以让 ESLint 更适合你的项目。有两种主要的方式来配置 ESLint：

1. **Configuration Comments** - 使用 JavaScript 注释把配置信息直接嵌入到一个代码源文件中。
2. **Configuration Files** - 使用 JavaScript、JSON 或者 YAML 文件为整个目录和它的子目录指定配置信息。可以配置一个独立的  [.eslintrc.\*](https://cn.eslint.org/docs/user-guide/configuring#configuration-file-formats)  文件，或者直接在  [`package.json`](https://docs.npmjs.com/files/package.json)  文件里的  `eslintConfig`  字段指定配置，ESLint 会查找和自动读取它们，再者，你可以在[命令行](https://cn.eslint.org/docs/user-guide/command-line-interface)运行时指定一个任意的配置文件。

有很多信息可以配置：

- **Environments** - 指定脚本的运行环境。每种环境都会有一组特定的预定义全局变量。
- **Globals** - 脚本在执行期间访问的额外的全局变量。
- **Rules** - 启用的规则及其各自的错误级别。

所有这些选项让你可以细粒度地控制 ESLint 如何对待你的代码。

### 指定解析器选项

ESLint 允许你指定你想要支持的 JavaScript 语言选项。默认情况下，ESLint 支持 ECMAScript 5 语法。你可以覆盖该设置，以启用对 ECMAScript 其它版本和 JSX 的支持。

请注意，对 JSX 语法的支持不用于对 React 的支持。React 使用了一些特定的 ESLint 无法识别的 JSX 语法。如果你正在使用 React 并且想要 React 语义支持，我们推荐你使用  [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)。

同样的，支持 ES6 语法并不意味着同时支持新的 ES6 全局变量或类型（比如  `Set`  等新类型）。使用  `{ "parserOptions": { "ecmaVersion": 6 } }`  来启用 ES6 语法支持；要额外支持新的 ES6 全局变量，使用  `{ "env":{ "es6": true } }`(这个设置会同时自动启用 ES6 语法支持)。

解析器选项可以在  `.eslintrc.*`  文件使用  `parserOptions`  属性设置。可用的选项有：

- `ecmaVersion` - 默认设置为 5， 你可以使用 3、5、6、7 或 8 来指定你想要使用的 ECMAScript 版本。你也可以用使用年份命名的版本号指定为 2015（同 6），2016（同 7），或 2017（同 8）
- `sourceType` - 设置为  `script` (默认) 或  `module`（如果你的代码是 ECMAScript 模块)。
- `ecmaFeatures` - 这是个对象，表示你想使用的额外的语言特性:`globalReturn` - 允许在全局作用域下使用  `return`  语句`impliedStrict` - 启用全局  [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) (如果  `ecmaVersion`  是 5 或更高)`jsx` - 启用  [JSX](http://facebook.github.io/jsx/)`experimentalObjectRestSpread` - 启用实验性的  [object rest/spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread)  支持。(**重要：**这是一个实验性的功能,在未来可能会有明显改变。 建议你写的规则  **不要**  依赖该功能，除非当它发生改变时你愿意承担维护成本。)

`.eslintrc.json`  文件示例：

```
{
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "semi": 2
    }
}

```

设置解析器选项能帮助 ESLint 确定什么是解析错误，所有语言选项默认都是  `false`。

### 指定解析器

ESLint 默认使用[Espree](https://github.com/eslint/espree)作为其解析器，你可以在配置文件中指定一个不同的解析器，只要该解析器符合下列要求：

1. 它必须是本地安装的一个 npm 模块。
2. 它必须有兼容 Esprima 的接口（它必须输出一个  `parse()`  方法）
3. 它必须产出兼容 Esprima 的 AST 和 token 对象。

注意，即使满足这些兼容性要求，也不能保证一个外部解析器可以与 ESLint 正常配合工作，ESLint 也不会修复与其它解析器不兼容的相关 bug。

为了表明使用该 npm 模块作为你的解析器，你需要在你的  `.eslintrc`  文件里指定  `parser`  选项。例如，下面的配置指定了 Esprima 作为解析器：

```
{
    "parser": "esprima",
    "rules": {
        "semi": "error"
    }
}

```

以下解析器与 ESLint 兼容：

- [Esprima](https://npmjs.com/package/esprima)
- [Babel-ESLint](https://npmjs.com/package/babel-eslint) - 一个对[Babel](http://babeljs.io/)解析器的包装，使其能够与 ESLint 兼容。
- [typescript-eslint-parser(实验)](https://npmjs.com/package/typescript-eslint-parser) - 一个把 TypeScript 转换为 ESTree 兼容格式的解析器，这样它就可以在 ESLint 中使用了。这样做的目的是通过 ESLint 来解析 TypeScript 文件（尽管不一定必须通过所有的 ESLint 规则）。

注意，在使用自定义解析器时，为了让 ESLint 在处理非 ECMAScript 5 特性时正常工作，配置属性  `parserOptions`  仍然是必须的。解析器会被传入  `parserOptions`，但是不一定会使用它们来决定功能特性的开关。

### 指定环境

一个“环境”定义了一组预定义的全局变量。可用的环境包括：

- `browser` - 浏览器环境中的全局变量。
- `node` - Node.js 全局变量和 Node.js 作用域。
- `commonjs` - CommonJS 全局变量和 CommonJS 作用域 (一般用于 Browserify/WebPack 打包的只在浏览器中运行的代码)。
- `shared-node-browser` - Node 和 Browser 通用全局变量。
- `es6` - 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置  `ecmaVersion`  解析器选项为 6）。
- `worker` - Web Workers 全局变量。
- `amd` - 将  `require()`  和  `define()`  定义为像  [amd](https://github.com/amdjs/amdjs-api/wiki/AMD)  一样的全局变量。
- `mocha` - 添加所有的 Mocha 测试全局变量。
- `jasmine` - 添加所有的 Jasmine 版本 1.3 和 2.0 的测试全局变量。
- `jest` - Jest 全局变量。
- `phantomjs` - PhantomJS 全局变量。
- `protractor` - Protractor 全局变量。
- `qunit` - QUnit 全局变量。
- `jquery` - jQuery 全局变量。
- `prototypejs` - Prototype.js 全局变量。
- `shelljs` - ShellJS 全局变量。
- `meteor` - Meteor 全局变量。
- `mongo` - MongoDB 全局变量。
- `applescript` - AppleScript 全局变量。
- `nashorn` - Java 8 Nashorn 全局变量。
- `serviceworker` - Service Worker 全局变量。
- `atomtest` - Atom 测试全局变量。
- `embertest` - Ember 测试全局变量。
- `webextensions` - WebExtensions 全局变量。
- `greasemonkey` - GreaseMonkey 全局变量。

这些环境并不是互斥的，所以你可以同时定义多个。

可以在源文件里、在配置文件中或使用  [命令行](https://cn.eslint.org/docs/user-guide/command-line-interface)  的  `--env`  选项来指定环境。

要在你的 JavaScript 文件中使用注释来指定环境，格式如下：

```
/* eslint-env node, mocha */

```

该设置启用了 Node.js 和 Mocha 环境。

要在配置文件里指定环境，使用  `env`  关键字指定你想启用的环境，并设置它们为  `true`。例如，以下示例启用了 browser 和 Node.js 的环境：

```
{
    "env": {
        "browser": true,
        "node": true
    }
}

```

或在  `package.json`  文件中：

```
{
    "name": "mypackage",
    "version": "0.0.1",
    "eslintConfig": {
        "env": {
            "browser": true,
            "node": true
        }
    }
}

```

在 YAML 文件中：

```
---
  env:
    browser: true
    node: true

```

如果你想在一个特定的插件中使用一种环境，确保提前在  `plugins`  数组里指定了插件名，然后在 env 配置中不带前缀的插件名后跟一个  `/` ，紧随着环境名。例如：

```
{
    "plugins": ["example"],
    "env": {
        "example/custom": true
    }
}

```

或在  `package.json`  文件中

```
{
    "name": "mypackage",
    "version": "0.0.1",
    "eslintConfig": {
        "plugins": ["example"],
        "env": {
            "example/custom": true
        }
    }
}

```

在 YAML 文件中：

```
---
  plugins:
    - example
  env:
    example/custom: true

```

### 指定全局变量

当访问当前源文件内未定义的变量时，[no-undef](https://cn.eslint.org/docs/rules/no-undef)  规则将发出警告。如果你想在一个源文件里使用全局变量，推荐你在 ESLint 中定义这些全局变量，这样 ESLint 就不会发出警告了。你可以使用注释或在配置文件中定义全局变量。

要在你的 JavaScript 文件中，用注释指定全局变量，格式如下：

```
/* global var1, var2 */

```

这里定义了两个全局变量：`var1`  和  `var2`。如果你想指定这些变量不应被重写（只读），你可以将它们设置为  `false`：

```
/* global var1:false, var2:false */

```

在配置文件里配置全局变量时，使用  `globals`  指出你要使用的全局变量。将变量设置为  `true`  将允许变量被重写，或  `false`  将不允许被重写。比如：

```
{
    "globals": {
        "var1": true,
        "var2": false
    }
}

```

在 YAML 中：

```
---
  globals:
    var1: true
    var2: false

```

在这些例子中  `var1`  允许被重写，`var2`  不允许被重写。

**注意：**  要启用[no-global-assign](https://cn.eslint.org/docs/rules/no-global-assign)规则来禁止对只读的全局变量进行修改。

### 配置插件

ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它。

在配置文件里配置插件时，可以使用  `plugins`  关键字来存放插件名字的列表。插件名称可以省略  `eslint-plugin-`  前缀。

```
{
    "plugins": [
        "plugin1",
        "eslint-plugin-plugin2"
    ]
}

```

在 YAML 中：

```
---
  plugins:
    - plugin1
    - eslint-plugin-plugin2

```

**注意：**全局安装的 ESLint 只能使用全局安装的插件。本地安装的 ESLint 不仅可以使用本地安装的插件，也可以使用全局安装的插件。

### 配置规则

ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则。要改变一个规则设置，你必须将规则 ID 设置为下列值之一：

- `off`  或  `0` - 关闭规则
- `warn`  或  `1` - 开启规则，使用警告级别的错误：`warn` (不会导致程序退出)
- `error`  或  `2` - 开启规则，使用错误级别的错误：`error` (当被触发的时候，程序会退出)

为了在文件注释里配置规则，使用以下格式的注释：

```
/* eslint eqeqeq: "off", curly: "error" */

```

在这个例子里，[`eqeqeq`](https://cn.eslint.org/docs/rules/eqeqeq)  规则被关闭，[`curly`](https://cn.eslint.org/docs/rules/curly)  规则被打开，定义为错误级别。你也可以使用对应的数字定义规则严重程度：

```
/* eslint eqeqeq: 0, curly: 2 */

```

这个例子和上个例子是一样的，只不过它是用的数字而不是字符串。`eqeqeq`  规则是关闭的，`curly`  规则被设置为错误级别。

如果一个规则有额外的选项，你可以使用数组字面量指定它们，比如：

```
/* eslint quotes: ["error", "double"], curly: 2 */

```

这条注释为规则  [`quotes`](https://cn.eslint.org/docs/rules/quotes)  指定了 “double”选项。数组的第一项总是规则的严重程度（数字或字符串）。

还可以使用  `rules`  连同错误级别和任何你想使用的选项，在配置文件中进行规则配置。例如：

```
{
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"]
    }
}

```

在 YAML 中：

```
---
rules:
  eqeqeq: off
  curly: error
  quotes:
    - error
    - double

```

配置定义在插件中的一个规则的时候，你必须使用  `插件名/规则ID`  的形式。比如：

```
{
    "plugins": [
        "plugin1"
    ],
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"],
        "plugin1/rule1": "error"
    }
}

```

在 YAML 中：

```
---
plugins:
  - plugin1
rules:
  eqeqeq: 0
  curly: error
  quotes:
    - error
    - "double"
  plugin1/rule1: error

```

在这些配置文件中，规则  `plugin1/rule1`  表示来自插件  `plugin1`  的  `rule1`  规则。你也可以使用这种格式的注释配置，比如：

```
/* eslint "plugin1/rule1": "error" */

```

**注意：**当指定来自插件的规则时，确保删除  `eslint-plugin-`  前缀。ESLint 在内部只使用没有前缀的名称去定位规则。

### 使用行注释禁用规则

可以在你的文件中使用以下格式的块注释来临时禁止规则出现警告：

```
/* eslint-disable */

alert('foo');

/* eslint-enable */

```

你也可以对指定的规则启用或禁用警告:

```
/* eslint-disable no-alert, no-console */

alert('foo');
console.log('bar');

/* eslint-enable no-alert, no-console */


```

如果在整个文件范围内禁止规则出现警告，将  `/* eslint-disable */`  块注释放在文件顶部：

```
/* eslint-disable */

alert('foo');

```

你也可以对整个文件启用或禁用警告:

```
/* eslint-disable no-alert */

// Disables no-alert for the rest of the file
alert('foo');

```

可以在你的文件中使用以下格式的行注释在某一特定的行上禁用所有规则：

```
alert('foo'); // eslint-disable-line

// eslint-disable-next-line
alert('foo');

```

在某一特定的行上禁用某个指定的规则：

```
alert('foo'); // eslint-disable-line no-alert

// eslint-disable-next-line no-alert
alert('foo');

```

在某个特定的行上禁用多个规则：

```
alert('foo'); // eslint-disable-line no-alert, quotes, semi

// eslint-disable-next-line no-alert, quotes, semi
alert('foo');

```

上面的所有方法同样适用于插件规则。例如，禁止  `eslint-plugin-example`  的  `rule-name`  规则，把插件名（`example`）和规则名（`rule-name`）结合为  `example/rule-name`：

```
foo(); // eslint-disable-line example/rule-name

```

**注意：**为文件的某部分禁用警告的注释，告诉 ESLint 不要对禁用的代码报告规则的冲突。ESLint 仍解析整个文件，然而，禁用的代码仍需要是有效的 JavaScript 语法。

### 添加分享配置

ESLint 支持在配置文件添加共享设置。你可以添加  `settings`  对象到配置文件，它将提供给每一个将被执行的规则。如果你想添加的自定义规则而且使它们可以访问到相同的信息，这将会很有用，并且很容易配置。

在 JSON 中：

```
{
    "settings": {
        "sharedData": "Hello"
    }
}

```

在 YAML 中：

```
---
  settings:
    sharedData: "Hello"

```

### 使用配置文件

有两种方式可以使用配置文件。第一种是将文件保存到你喜欢的地方，然后将它的位置使用  `-c`  选项传递命令行，比如：

```
eslint -c myconfig.json myfiletotest.js

```

第二种方式是通过  `.eslintrc.*`  和  `package.json`。ESLint 将自动在要检测的文件目录里寻找它们，紧接着是父级目录，一直到文件系统的根目录。当你想对一个项目的不同部分的使用不同配置，或当你希望别人能够直接使用 ESLint，而无需记住要在配置文件中传递什么，这种方式就很有用。

每种情况，配置文件都会覆盖默认设置。

### 配置文件文件格式

ESLint 支持几种格式的配置文件：

- **JavaScript** - 使用  `.eslintrc.js`  然后输出一个配置对象。
- **YAML** - 使用  `.eslintrc.yaml`  或  `.eslintrc.yml`  去定义配置的结构。
- **JSON** - 使用  `.eslintrc.json`  去定义配置的结构，ESLint 的 JSON 文件允许 JavaScript 风格的注释。
- **(不推荐)** - 使用  `.eslintrc`，可以使 JSON 也可以是 YAML。
- **package.json** - 在  `package.json`  里创建一个  `eslintConfig`属性，在那里定义你的配置。

如果同一个目录下有多个配置文件，ESLint 只会使用一个。优先级顺序如下：

1. `.eslintrc.js`
2. `.eslintrc.yaml`
3. `.eslintrc.yml`
4. `.eslintrc.json`
5. `.eslintrc`
6. `package.json`

### 配置的层级和继承

当使用  `.eslintrc.*`  和  `package.json`文件的配置时，你可以利用层叠配置。例如，假如你有以下结构：

```
your-project
├── .eslintrc
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc
  └── test.js

```

层叠配置使用离要检测的文件最近的  `.eslintrc`文件作为最高优先级，然后才是父目录里的配置文件，等等。当你在这个项目中允许 ESLint 时，`lib/`下面的所有文件将使用项目根目录里的  `.eslintrc`  文件作为它的配置文件。当 ESLint 遍历到  `test/`  目录，`your-project/.eslintrc`  之外，它还会用到  `your-project/tests/.eslintrc`。所以  `your-project/tests/test.js`  是基于它的目录层次结构中的两个`.eslintrc`  文件的组合，并且离的最近的一个优先。通过这种方式，你可以有项目级 ESLint 设置，也有覆盖特定目录的 ESLint 设置。

同样的，如果在根目录的  `package.json`  文件中有一个  `eslintConfig`  字段，其中的配置将使用于所有子目录，但是当  `tests`  目录下的  `.eslintrc`  文件中的规则与之发生冲突时，就会覆盖它。

```
your-project
├── package.json
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc
  └── test.js

```

如果同一目录下  `.eslintrc`  和  `package.json`  同时存在，`.eslintrc`  优先级高会被使用，`package.json`  文件将不会被使用。

**注意：**如果在你的主目录下有一个自定义的配置文件 (`\~/.eslintrc`) ，如果没有其它配置文件时它才会被使用。因为个人配置将适用于用户目录下的所有目录和文件，包括第三方的代码，当 ESLint 运行时可能会导致问题。

默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。如果你想要你所有项目都遵循一个特定的约定时，这将会很有用，但有时候会导致意想不到的结果。为了将 ESLint 限制到一个特定的项目，在你项目根目录下的  `package.json`  文件或者  `.eslintrc.*`  文件里的  `eslintConfig`  字段下设置  `root": true`。ESLint 一旦发现配置文件中有  `root": true`，它就会停止在父级目录中寻找。

```
{
    "root": true
}

```

在 YAML 中：

```
---
  root: true

```

例如，`projectA`  的  `lib/`  目录下的  `.eslintrc`  文件中设置了  `root": true`。这种情况下，当检测  `main.js`  时，`lib/`  下的配置将会被使用，`projectA/`  下的  `.eslintrc`  将不会被使用。

```
home
└── user
    ├── .eslintrc <- Always skipped if other configs present
    └── projectA
        ├── .eslintrc  <- Not used
        └── lib
            ├── .eslintrc  <- { "root": true }
            └── main.js

```

完整的配置层次结构，从最高优先级最低的优先级，如下:

1. 行内配置
   1. `/*eslint-disable*/`  和  `/*eslint-enable*/`
   2. `/*global*/`
   3. `/*eslint*/`
   4. `/*eslint-env*/`
2. 命令行选项：
   1. `--global`
   2. `--rule`
   3. `--env`
   4. `-c`、`--config`
3. 项目级配置：
   1. 与要检测的文件在同一目录下的  `.eslintrc.*`  或  `package.json`  文件
   2. 继续在父级目录寻找  `.eslintrc`  或  `package.json`文件，直到根目录（包括根目录）或直到发现一个有`root": true`的配置。
   3. 如果不是（1）到（3）中的任何一种情况，退回到  `\~/.eslintrc`  中自定义的默认配置。

### 扩展配置文件

一个配置文件可以被基础配置中的已启用的规则继承。

`extends`  属性值可以是：

- 在配置中指定的一个字符串
- 字符串数组：每个配置继承它前面的配置

ESLint 递归地进行扩展配置，所以一个基础的配置也可以有一个  `extends`  属性。

`rules`  属性可以做下面的任何事情以扩展（或覆盖）规则：

- 启用额外的规则
- 改变继承的规则级别而不改变它的选项：
  - 基础配置：`eqeqeq": ["error", "allow-null"]`
  - 派生的配置：`eqeqeq": "warn`
  - 最后生成的配置：`eqeqeq": ["warn", "allow-null"]`
- 覆盖基础配置中的规则的选项
  - 基础配置：`quotes": ["error", "single", "avoid-escape"]`
  - 派生的配置：`quotes": ["error", "single"]`
  - 最后生成的配置：`quotes": ["error", "single"]`

#### 使用  eslint:recommended

值为  `eslint:recommended`  的  `extends`  属性启用一系列核心规则，这些规则报告一些常见问题，在  [规则页面](https://cn.eslint.org/docs/rules/)  中被标记为   。这个推荐的子集只能在 ESLint 主要版本进行更新。

如果你的配置集成了推荐的规则：在你升级到 ESLint 新的主版本之后，在你使用[命令行](https://cn.eslint.org/docs/user-guide/command-line-interface#fix)的  `--fix`  选项之前，检查一下报告的问题，这样你就知道一个新的可修复的推荐的规则将更改代码。

`eslint --init`  命令可以创建一个配置，这样你就可以继承推荐的规则。

JavaScript 格式的一个配置文件的例子：

```
module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        // enable additional rules
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        // override default options for rules from base configurations
        "comma-dangle": ["error", "always"],
        "no-cond-assign": ["error", "always"],

        // disable rules from base configurations
        "no-console": "off",
    }
}
```

#### 使用可共享的配置包

[可共享的配置](https://cn.eslint.org/docs/developer-guide/shareable-configs)  是一个 npm 包，它输出一个配置对象。要确保这个包安装在 ESLint 能请求到的目录下。

`extends`  属性值可以省略包名的前缀  `eslint-config-`。

`eslint --init`  命令可以创建一个配置，这样你就可以扩展一个流行的风格指南（比如，`eslint-config-standard`）。

YAML 格式的一个配置文件的例子：

```
extends: standard
rules:
  comma-dangle:
    - error
    - always
  no-empty: warn

```

#### 使用插件中的配置

[插件](https://cn.eslint.org/docs/developer-guide/working-with-plugins)  是一个 npm 包，通常输出规则。一些插件也可以输出一个或多个命名的  [配置](https://cn.eslint.org/docs/developer-guide/working-with-plugins#configs-in-plugins)。要确保这个包安装在 ESLint 能请求到的目录下。

`plugins` [属性值](https://cn.eslint.org/docs/user-guide/configuring#configuring-plugins)  可以省略包名的前缀  `eslint-plugin-`。

`extends`  属性值可以由以下组成：

- `plugin:`
- 包名 (省略了前缀，比如，`react`)
- `/`
- 配置名称 (比如  `recommended`)

JSON 格式的一个配置文件的例子：

```
{
    "plugins": [
        "react"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
       "no-set-state": "off"
    }
}

```

#### 使用一个配置文件

`extends`  属性值可以是基本[配置文件](https://cn.eslint.org/docs/user-guide/configuring#using-configuration-files)的绝对路径或相对路径。

ESLint 解析基本配置文件的相对路径相对你你使用的配置文件，**除非**那个文件在你的主目录或非 ESLint 安装目录的父级目录。在这些情况下，ESLint 解析基本配合文件的相对路径相对于被检测的  **项目**目录（尤其是当前工作目录）。

JSON 格式的一个配置文件的例子：

```
{
    "extends": [
        "./node_modules/coding-standard/eslintDefaults.js",
        "./node_modules/coding-standard/.eslintrc-es6",
        "./node_modules/coding-standard/.eslintrc-jsx"
    ],
    "rules": {
        "eqeqeq": "warn"
    }
}

```

#### 使用  eslint:all

`extends`  属性值可以是  `eslint:all`，启用当前安装的 ESLint 中所有的核心规则。这些规则可以在 ESLint 的任何版本进行更改。

**重要：**这些配置  **不推荐在产品中使用**，因为它随着 ESLint 版本进行更改。使用的话，请自己承担风险。

如果你配置 ESLint 升级时自动地启用新规则，当源码没有任何改变时，ESLint 可以报告新问题，因此任何 ESLint 的新的小版本好像有破坏性的更改。

当你决定在一个项目上使用的规则和选项，尤其是如果你很少覆盖选项或禁用规则，你可能启用所有核心规则作为一种快捷方式使用。规则的默认选项并不是 ESLint 推荐的（例如，`quotes`  规则的默认选项并不意味着双引号要比单引号好）。

如果你的配置扩展了所有的核心规则：在你升级到一个新的大或小的 ESLint 版本，在你使用[命令行](https://cn.eslint.org/docs/user-guide/command-line-interface#fix)的  `--fix`  选项之前，检查一下报告的问题，这样你就知道一个新的可修复的规则将更改代码。

JavaScript 格式的一个配置文件的例子：

```
module.exports = {
    "extends": "eslint:all",
    "rules": {
        // override default options
        "comma-dangle": ["error", "always"],
        "indent": ["error", 2],
        "no-cond-assign": ["error", "always"],

        // disable now, but enable in the future
        "one-var": "off", // ["error", "never"]

        // disable
        "init-declarations": "off",
        "no-console": "off",
        "no-inline-comments": "off",
    }
}

```

### 基于 glob 模式的配置

有时，你可能需要更精细的配置，比如，如果同一个目录下的文件需要有不同的配置。因此，你可以在配置中使用  `overrides`  键，它只适用于匹配特定的 glob 模式的文件，使用你在命令行上传递的格式 (e.g., `app/**/*.test.js`)。

#### 怎么工作

- Glob 模式覆盖只能在配置文件 (`.eslintrc.*`  或  `package.json`) 中进行配置。
- 模式应用于相对于配置文件的目录的文件路径。 比如，如果你的配置文件的路径为  `/Users/john/workspace/any-project/.eslintrc.js`  而你要检测的路径为  `/Users/john/workspace/any-project/lib/util.js`，那么你在  `.eslintrc.js`  中提供的模式是相对于 `lib/util.js` 来执行的.
- 在相同的配置文件中，Glob 模式覆盖比其他常规配置具有更高的优先级。 同一个配置中的多个覆盖将按顺序被应用。也就是说，配置文件中的最后一个覆盖会有最高优先级。
- 一个 glob 特定的配置几乎与 ESLint 的其他配置相同。覆盖块可以包含常规配置中的除了  `extends`、`overrides`  和  `root`  之外的其他任何有效配置选项，
- 可以在单个覆盖块中提供多个 glob 模式。一个文件必须匹配至少一个配置中提供的模式。
- 覆盖块也可以指定从匹配中排除的模式。如果一个文件匹配了任何一个排除模式，该配置将不再被应用。

#### 相对 glob 模式

```
project-root
├── app
│   ├── lib
│   │   ├── foo.js
│   │   ├── fooSpec.js
│   ├── components
│   │   ├── bar.js
│   │   ├── barSpec.js
│   ├── .eslintrc.json
├── server
│   ├── server.js
│   ├── serverSpec.js
├── .eslintrc.json

```

`app/.eslintrc.json`  文件中的配置定义了 glob 模式  `**/*Spec.js`。该模式是相对  `app/.eslintrc.json`  的基本目录的。因此，该模式将匹配  `app/lib/fooSpec.js`  和  `app/components/barSpec.js`  但  **不匹配** `server/serverSpec.js`。如果你在项目根目录下的  `.eslintrc.json`  文件中定义了同样的模式，它将匹配这三个  `*Spec`  文件。

#### 配置示例

在你的  `.eslintrc.json`  文件中：

```
{
  "rules": {
    "quotes": [ 2, "double" ]
  },

  "overrides": [
    {
      "files": [ "bin/*.js", "lib/*.js" ],
      "excludedFiles": "*.test.js",
      "rules": {
        "quotes": [ 2, "single" ]
      }
    }
  ]
}

```

### 在配置文件中注释

JSON 和 YAML 配置文件格式都支持注释 ( `package.json`  文件不应该包括注释)。你可以在其他类型的文件中使用 JavaScript 风格的注释或使用 YAML 风格的注释，ESLint 会忽略它们。这允许你的配置更加人性化。例如：

```
{
    "env": {
        "browser": true
    },
    "rules": {
        // Override our default settings just for this directory
        "eqeqeq": "warn",
        "strict": "off"
    }
}

```

### 指定需要检查的文件扩展名

目前，告诉 ESLint 哪个文件扩展名要检测的唯一方法是使用  [`--ext`](https://cn.eslint.org/docs/user-guide/command-line-interface#ext)  命令行选项指定一个逗号分隔的扩展名列表。注意，该标记只在与目录一起使用时有效，如果使用文件名或 glob 模式，它将会被忽略。

### 忽略文件和目录

你可以通过在项目根目录创建一个  `.eslintignore`  文件告诉 ESLint 去忽略特定的文件和目录。`.eslintignore`  文件是一个纯文本文件，其中的每一行都是一个 glob 模式表明哪些路径应该忽略检测。例如，以下将忽略所有的 JavaScript 文件：

```
**/*.js

```

当 ESLint 运行时，在确定哪些文件要检测之前，它会在当前工作目录中查找一个  `.eslintignore`  文件。如果发现了这个文件，当遍历目录时，将会应用这些偏好设置。一次只有一个  `.eslintignore`  文件会被使用，所以，不是当前工作目录下的  `.eslintignore`  文件将不会被用到。

Globs 匹配使用  [node-ignore](https://github.com/kaelzhang/node-ignore)，所以大量可用的特性有：

- 以  `#`  开头的行被当作注释，不影响忽略模式。
- 路径是相对于  `.eslintignore`  的位置或当前工作目录。这也会影响通过  `--ignore-pattern`传递的路径。
- 忽略模式同  `.gitignore` [规范](http://git-scm.com/docs/gitignore)
- 以  `!`  开头的行是否定模式，它将会重新包含一个之前被忽略的模式。

除了  `.eslintignore`  文件中的模式，ESLint 总是忽略  `/node_modules/*`  和  `/bower_components/*`  中的文件。

例如：把下面  `.eslintignore`  文件放到当前工作目录里，将忽略  `node_modules`，`bower_components`  以及  `build/`  目录下除了  `build/index.js`  的所有文件。

```
## /node_modules/* and /bower_components/* ignored by default

## Ignore built files except build/index.js
build/*
!build/index.js

```

#### 使用备用文件

如果相比于当前工作目录下  `.eslintignore`  文件，你更想使用一个不同的文件，你可以在命令行使用  `--ignore-path`  选项指定它。例如，你可以使用  `.jshintignore`  文件，因为它有相同的格式：

```
eslint --ignore-path .jshintignore file.js

```

你也可以使用你的  `.gitignore`  文件：

```
eslint --ignore-path .gitignore file.js
```

任何文件只要满足标准忽略文件格式都可以用。记住，指定  `--ignore-path`  意味着任何现有的  `.eslintignore`  文件将不被使用。请注意，`.eslintignore`  中的匹配规则比  `.gitignore`  中的更严格。

#### 在 package.json 中使用 eslintConfig

```
{
  "name": "mypackage",
  "version": "0.0.1",
  "eslintConfig": {
      "env": {
          "browser": true,
          "node": true
      }
  },
  "eslintIgnore": ["hello.js", "world.js"]
}
```

#### 忽略文件告警

当您将目录传递给 ESLint 时，文件和目录将被忽略。如果将特定文件传递给 ESLint，则会看到一条警告，指示该文件已被跳过。例如，假设你有一个 `.eslintignore` 文件，如下所示：

```
foo.js

```

然后，您执行：

```
eslint foo.js

```

您将会看到以下告警：

```
foo.js
  0:0  warning  File ignored because of your .eslintignore file. Use --no-ignore to override.

✖ 1 problem (0 errors, 1 warning)

```

发生此消息是因为 ESLint 不确定是否要检查该文件。如消息所示，您可以使用 `--no-ignore` 省略使用忽略规则。

## 实战

React 项目中，通常会使用 React、JSX、ES6 等特性，所以 ESLint 推荐的检查规则可能还不能满足我们对代码检查的需要。

### ESLint 集成 Airbnb

业界比较流行的 [Airbnb JavaScript Style](https://github.com/airbnb/javascript) 可以说是一个不错的选择。

**那么如何让 ESLint 支持 Airbnb 呢？**

下面将一一道来。

#### eslint-config-airbnb

[eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) 该包将 Airbnb 的规则作为 ESLint 可扩展的共享配置。

**安装方法一**

执行 `eslint --init` 命令，依次选择 **Use a popular style guide** -> **Airbnb**

ESLint 会自动下载 Airbnb 扩展所需的所有插件。

**安装方法二**

ESLint 默认的下载地址是 https://registry.npmjs.org/ ，由于是外网，可能会很慢。

如果你使用淘宝的 cnpm，也可以自己下载 Airbnb 扩展所需的插件：

- [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)
- [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)

执行安装命令：

```sh
$ cnpm i -D eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-config-airbnb
```

#### babel-eslint

由于 React 项目往往会使用 ES6 特性。ES6 若想识别 ES6 特性，需要相应的解析器，[babel-eslint](https://github.com/babel/babel-eslint) 是比较流行的选择。

执行安装命令：

```sh
$ cnpm i -D babel-eslint
```

#### 配置

ESLint 支持几种格式的配置文件，个人推荐使用 `.eslintrc.js` ，这是官方优先级最高的配置文件。

配置文件中配置 Airbnb 有几个重点项：

```json
{
  // 指定校验的环境
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
    'commonjs': true
  },
  // 指定扩展标准
  'extends': ['airbnb'],
  // 指定解析器
  'parser': 'babel-eslint',
  // 指定插件
  'plugins': [
    'import',
    'jsx-a11y',
    'react'
  ],
  'rules': {
    ...
  }
}
```

Airbnb 的检查规则是比较严格的，如果你认为有些检查项没有必要，也可以自行在 `rules` 中修改。

## ESLint 命令

为了在 Node.js 上运行 ESLint，你必须先安装 npm。如果还没有安装 npm ，按照这里的说明进行安装：[https://www.npmjs.com/](https://www.npmjs.com/)。

一旦安装了 npm，运行下面的命令

```
npm i -g eslint
```

这句命令从 npm 仓库安装了 ESLint CLI。使用以下格式运行 ESLint：

```
eslint [options] [file|dir|glob]*
```

比如：

```
eslint file1.js file2.js
```

或者：

```
eslint lib/**
```

请注意，传递一个 glob 模式作为参数时，它将由你的 shell 进行扩展。扩展的结果取决于你的 shell 及其配置。如果你想使用 node 的  `glob`  语法，你需要给参数加上引号（在 windows 系统运行时，如果你需要，也可以使用双引号 ），像下面这样：

```
eslint "lib/**"
```

### 选项

命令行工具有几个选项，你可以通过运行  `eslint -h`  查看所有选项。

```sh
eslint [options] file.js [file.js] [dir]

Basic configuration:
  -c, --config path::String    Use configuration from this file or shareable config
  --no-eslintrc                Disable use of configuration from .eslintrc
  --env [String]               Specify environments
  --ext [String]               Specify JavaScript file extensions - default: .js
  --global [String]            Define global variables
  --parser String              Specify the parser to be used
  --parser-options Object      Specify parser options

Caching:
  --cache                      Only check changed files - default: false
  --cache-file path::String    Path to the cache file. Deprecated: use --cache-location - default: .eslintcache
  --cache-location path::String  Path to the cache file or directory

Specifying rules and plugins:
  --rulesdir [path::String]    Use additional rules from this directory
  --plugin [String]            Specify plugins
  --rule Object                Specify rules

Ignoring files:
  --ignore-path path::String   Specify path of ignore file
  --no-ignore                  Disable use of ignore files and patterns
  --ignore-pattern [String]    Pattern of files to ignore (in addition to those in .eslintignore)

Using stdin:
  --stdin                      Lint code provided on <STDIN> - default: false
  --stdin-filename String      Specify filename to process STDIN as

Handling warnings:
  --quiet                      Report errors only - default: false
  --max-warnings Int           Number of warnings to trigger nonzero exit code - default: -1

Output:
  -o, --output-file path::String  Specify file to write report to
  -f, --format String          Use a specific output format - default: stylish
  --color, --no-color          Force enabling/disabling of color

Miscellaneous:
  --init                       Run config initialization wizard - default: false
  --fix                        Automatically fix problems
  --debug                      Output debugging information
  -h, --help                   Show help
  -v, --version                Output the version number
  --no-inline-config           Prevent comments from changing config or rules
  --print-config path::String  Print the configuration for the given file
```

这些选项可以通过重复该选项或使用逗号分隔的列表进行指定（除了  `--ignore-pattern`  不允许第二种风格）。

示例：

```sh
eslint --ext .jsx --ext .js  lib/
eslint --ext .jsx,.js  lib/
```

#### 基本配置

##### `-c`, `--config`

该选项允许你为 ESLint (查看  [Configuring ESLint](https://cn.eslint.org/docs/user-guide/configuring)  了解更多)指定一个额外的配置文件。

例如：

```
eslint -c ~/my-eslint.json file.js
```

这个例子使用了  `\~/my-eslint.json`  作为配置文件。

它还接受  [sharable config](https://cn.eslint.org/docs/developer-guide/shareable-configs)  的一个模块的 ID。

例如：

```
eslint -c myconfig file.js
```

这个例子直接使用可共享的配置  `eslint-config-myconfig`。

##### `--no-eslintrc`

禁用  `.eslintrc`  和  `package.json`  文件中的配置。

示例：

```
eslint --no-eslintrc file.js
```

##### `--env`

这个选项用来指定环境。关于每种环境中定义的全局变量的详细信息请查看  [configuration](https://cn.eslint.org/docs/user-guide/configuring)  文档。该选项只能启用环境，不能禁用在其它配置文件中设置的环境。要指定多个环境的话，使用逗号分隔它们，或多次使用这个选项。

例如：

```
eslint --env browser,node file.js
eslint --env browser --env node file.js
```

##### `--ext`

这个选项允许你指定 ESLint 在指定的目录下查找 JavaScript 文件时要使用的文件扩展名。默认情况下，它使用  `.js`  作为唯一性文件扩展名。

示例：

```
## Use only .js2 extension
eslint . --ext .js2

## Use both .js and .js2
eslint . --ext .js --ext .js2

## Also use both .js and .js2
eslint . --ext .js,.js2
```

**注意：**如果你使用了 glob 模式，则  `--ext`  被忽略

例如，`eslint lib/* --ext .js`  将匹配  `lib/`  下的所有文件，忽略扩展名。

##### `--global`

这个选项定义了全局变量，这样它们就不会被  `no-undef`  规则标记为未定义了。任何指定的全局变量默认是只读的，在变量名字后加上  `:true`  后会使它变为可写。要指定多个变量，使用逗号分隔它们，或多次使用这个选项。

示例：

```
eslint --global require,exports:true file.js
eslint --global require --global exports:true
```

##### `--parser`

该选项允许你为 ESLint 指定一个解析器。默认情况下，使用  `espree`。

##### `--parser-options`

该选项允许你指定 ESLint 要使用的解析器选项。注意，可用的解析器选项取决于你所选用的解析器。

示例：

```
echo '3 ** 4' | eslint --stdin --parser-options=ecmaVersion:6 ## will fail with a parsing error
echo '3 ** 4' | eslint --stdin --parser-options=ecmaVersion:7 ## succeeds, yay!
```

#### 缓存

##### `--cache`

存储处理过的文件的信息以便只对有改变的文件进行操作。缓存默认被存储在  `.eslintcache`。启用这个选项可以显著改善 ESLint 的运行时间，确保只对有改变的文件进行检测。

**注意：**如果你运行 ESLint `--cache`，然后又运行 ESLint 不带  `--cache`，`.eslintcache`  文件将被删除。这是必要的，因为检测的结果可能会改变，使  `.eslintcache`  无效。如果你想控制缓存文件何时被删除，那么使用  `--cache-location`  来指定一个缓存文件的位置。

##### `--cache-file`

缓存文件的路径。如果没有指定，则使用  `.eslintcache`。这个文件会在  `eslint`  命令行被执行的文件目录中被创建。 **已弃用：**  请使用  `--cache-location`。

##### `--cache-location`

缓存文件的路径。可以是一个文件或者一个目录。如果没有指定，则使用  `.eslintcache` 。这个文件会在  `eslint`  命令行被执行的文件目录中被创建。

如果指定一个目录，缓存文件将在指定的文件夹下被创建。文件名将基于当前工作目录（CWD) 的 hash 值，比如：`.cache_hashOfCWD`。

**重要提示：**如果不存在缓存文件的目录，请确保在尾部添加  `/`（\*nix 系统）或  `\`（windows 系统）。否则该路径将被假定为是一个文件。

示例：

```
eslint "src/**/*.js" --cache --cache-location "/Users/user/.eslintcache/"
```

#### 指定规则和插件

##### `--rulesdir`

这个选项允许你指定另一个加载规则文件的目录。这允许你在运行时动态加载新规则。当你有自定义规则，而且这些规则不适合绑定到 ESLint 时，这会很有用。

示例：

```
eslint --rulesdir my-rules/ file.js
```

为了使你自定义的规则目录下的规则正常工作，必须遵照同绑定的规则一样的格式。你也可以通过包含多个  `--rulesdir`  选项来为自定义规则指定多个位置。

```
eslint --rulesdir my-rules/ --rulesdir my-other-rules/ file.js
```

注意，与核心规则和插件规则一样，你仍需要在配置文件或通过  `--rule`  命令行选项启用这些规则，以便在检测过程中实际运行这些规则。使用  `--rulesdir`  指定一个规则目录不会自动启用那些目录下的规则。

##### `--plugin`

这个选项指定一个要加载的插件。你可以省略插件名的前缀  `eslint-plugin-`。在你使用插件直接，你必须使用 npm 安装它。

示例：

```
eslint --plugin jquery file.js
eslint --plugin eslint-plugin-mocha file.js
```

##### `--rule`

这个选项指定要使用的规则。这些规则将会与配制文件中指定的规则合并。（你可以使用  `--no-eslintrc`  改变这种行为。）要定义多个规则，使用逗号分隔它们，或多次使用这个选项。[levn](https://github.com/gkz/levn#levn--)  格式被用来指定规则。

如果这个规则定义在插件内，你必须在规则 ID 前使用插件名和  `/`，即  `插件名/规则ID`。

示例：

```
eslint --rule 'quotes: [2, double]'
eslint --rule 'guard-for-in: 2' --rule 'brace-style: [2, 1tbs]'
eslint --rule 'jquery/dollar-sign: 2'
```

#### 忽略文件

##### `--ignore-path`

这个选项允许你指定一个文件作为  `.eslintignore`。默认情况下，ESLint 在当前工作目录下查找  `.eslintignore`。你可以通过提供另一个文件的路径改变这种行为。

示例：

```
eslint --ignore-path tmp/.eslintignore file.js
eslint --ignore-path .gitignore file.js
```

##### `--no-ignore`

禁止排除  `.eslintignore`、`--ignore-path`  和  `--ignore-pattern`  文件中指定的文件。

示例：

```
eslint --no-ignore file.js
```

##### `--ignore-pattern`

该选项允许你指定要忽略的文件模式(除了那些在  `.eslintignore`  的)。你可以重复该选项已提供多个模式。语法同  `.eslintignore`  文件中的相同。你应该将你的模式用引号括起来，以避免命令行解析器的解析。

示例：

```
eslint --ignore-pattern '/lib/' --ignore-pattern '/src/vendor/*' .
```

#### 使用 stdin

##### `--stdin`

这个选项告诉 ESLint 从 STDIN 而不是从文件中读取和检测源码。你可以使用该选项向 ESLint 来输入代码。

示例：

```
cat myfile.js | eslint --stdin
```

##### `--stdin-filename`

这个选项允许你指定一个文件名去处理 STDIN。当你处理从 STDIN 来的文件和有规则依赖于这个文件名时，这会很有用。

示例：

```
cat myfile.js | eslint --stdin --stdin-filename=myfile.js
```

#### 处理告警

##### `--quiet`

这个选项允许你禁止报告警告。如果开启这个选项，ESLint 只会报告错误。

示例：

```
eslint --quiet file.js
```

##### `--max-warnings`

这个选项允许你指定一个警告的阈值，当你的项目中有太多违反规则的警告时，这个阈值被用来强制 ESLint 以错误状态退出。

通常情况下，如果 ESLint 运行过程中，没有出现错误（只有警告），它将以成功的状态退出。然而，如果指定了  `--max-warnings`，而且警告的总数超过了指定的阈值，ESLint 将以错误的状态退出。通过指定一个  `-1`  的阈值或省略这个选项将会避免这种行为。

示例：

```
eslint --max-warnings 10 file.js
```

#### 输出

##### `-o`, `--output-file`

将报告写到一个文件。

示例：

```
eslint -o ./test/test.html
```

当指定这个选项时，就会按给定的格式输出到指定的文件名。

##### `-f`, `--format`

这个选项指定了控制台的输出格式。可用的格式是：

- [codeframe](https://cn.eslint.org/docs/user-guide/formatters/#codeframe)
- [compact](https://cn.eslint.org/docs/user-guide/formatters/#compact)
- [html](https://cn.eslint.org/docs/user-guide/formatters/#html)
- [jslint-xml](https://cn.eslint.org/docs/user-guide/formatters/#jslint-xml)
- [json](https://cn.eslint.org/docs/user-guide/formatters/#json)
- [junit](https://cn.eslint.org/docs/user-guide/formatters/#junit)
- [stylish](https://cn.eslint.org/docs/user-guide/formatters/#stylish) (the default)
- [table](https://cn.eslint.org/docs/user-guide/formatters/#table)
- [tap](https://cn.eslint.org/docs/user-guide/formatters/#tap)
- [unix](https://cn.eslint.org/docs/user-guide/formatters/#unix)
- [visualstudio](https://cn.eslint.org/docs/user-guide/formatters/#visualstudio)

例如：

```
eslint -f compact file.js
```

你也可以在命令行中通过指定一个自定义的格式的文件路径来使用自定义的格式。

示例：

```
eslint -f ./customformat.js file.js
```

当指定之后，给定的格式就输出到控制台。如果你想将输出保存到一个文件，你可以在命令行上这样操作：

```
eslint -f compact file.js > results.txt
```

这会将输出保存到  `results.txt`  文件。

##### `--color`, `--no-color`

在管道输出中禁用颜色。

示例：

```
eslint --color file.js | cat
eslint --no-color file.js
```

#### 杂项

##### `--init`

这个选项将会配置初始化向导。它被用来帮助新用户快速地创建  `.eslintrc`  文件，用户通过回答一些问题，选择一个流行的风格指南，或检查你的源文件，自动生成一个合适的配置。

生成的配置文件将被创建在当前目录。

##### `--fix`

该选项指示 ESLint 试图修复尽可能多的问题。修复只针对实际文件本身，而且剩下的未修复的问题才会输出。不是所有的问题都能使用这个选项进行修复，该选项在以下情形中不起作用：

1. 当代码传递给 ESLint 时，这个选项抛出一个错误。
2. 这个选项对使用处理器的代码不起作用。

##### `--debug`

这个选项将调试信息输出到控制台。当你看到一个问题并且很难定位它时，这些调试信息会很有用。ESLint 团队可能会通过询问这些调试信息帮助你解决 bug。

##### `-h`, `--help`

这个选项会输出帮助菜单，显示所有可用的选项。当有这个选项时，忽略其他所有选项。

##### `-v`, `--version`

这个选项在控制台输出当前 ESlint 的版本。当有这个标记时，忽略其他所有标记。

##### `--no-inline-config`

这个选项会阻止像  `/*eslint-disable*/`  或者  `/*global foo*/`  这样的内联注释起作用。这允许你在不修改文件的情况下设置一个 ESLint 配置。所有的内联注释都会被忽略，比如：

- `/*eslint-disable*/`
- `/*eslint-enable*/`
- `/*global*/`
- `/*eslint*/`
- `/*eslint-env*/`
- `// eslint-disable-line`
- `// eslint-disable-next-line`

示例：

```
eslint --no-inline-config file.js
```

##### `--print-config`

这个选项输出传递的文件使用的配置。当有这个标记时，不进行检测，只有配置相关的选项才是有效的。

示例：

```
eslint --print-config file.js
```

### .eslintignore 文件

当 ESLint 作用于一个目录时，ESLint 支持使用  `.eslintignore`  文件来避免检测处理。通过特定的命令行参数指定的文件就可以免除被忽略。`.eslintignore`  文件是个纯文本文件，每一行都包含一种模式。它可以放在目标目录的任何父级目录；它将影响到它所在的当前目录和所有子目录。这里是  `.eslintignore`  文件的一个简单示例：

```
node_modules/*
**/vendor/*.js
```

ESLint 默认忽略的模式分解和目录的更多详细信息可以在  [Configuring ESLint](https://cn.eslint.org/docs/user-guide/configuring#ignoring-files-and-directories)  中找到。

## 更多内容

> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

[ESLint](https://github.com/eslint/eslint)
