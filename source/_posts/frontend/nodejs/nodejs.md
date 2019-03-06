---
title: Node.js 入门
date: 2019-03-06
---

# Node.js 入门

> Node.js 是一个能够在服务器端运行 JavaScript 源代码的跨平台运行环境。
>
> 关键词： `nodejs`, `REPL`， `require`, `exports`

<!-- TOC depthFrom:2 depthTo:3 -->

- [安装配置](#安装配置)
    - [Windows / IOS](#windows--ios)
    - [Linux / Ubuntu / Debian](#linux--ubuntu--debian)
    - [第一个应用](#第一个应用)
- [交互式解释器（REPL）](#交互式解释器repl)
    - [简单的表达式运算](#简单的表达式运算)
    - [使用变量](#使用变量)
    - [多行表达式](#多行表达式)
- [Node 的代码组织](#node-的代码组织)
    - [模块路径解析规则](#模块路径解析规则)
    - [包（package）](#包package)
    - [index.js](#indexjs)
    - [package.json](#packagejson)
    - [命令行程序](#命令行程序)
    - [工程目录](#工程目录)
- [Node 的 IO 操作](#node-的-io-操作)
    - [Buffer](#buffer)
    - [Stream](#stream)
    - [文件系统](#文件系统)
- [Node.js 工具](#nodejs-工具)
    - [nvm](#nvm)
- [更多内容](#更多内容)

<!-- /TOC -->

## 安装配置

### Windows / IOS

可以在官方下载安装文件：[https://nodejs.org/en/download/](https://nodejs.org/en/download/)。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/20181106200239.png"/></div><br>

### Linux / Ubuntu / Debian

命令格式如下：

```sh
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```

详细内容参考官方文档：[通过包管理器安装 Node.js](https://nodejs.org/en/download/package-manager/)

### 第一个应用

创建 helloworld.js 文件，内容如下：

```js
function helloworld() {
  console.log("Hello World!");
}
helloworld();
```

执行命令 `node helloworld.js` 运行脚本。

## 交互式解释器（REPL）

Node.js REPL(Read Eval Print Loop:交互式解释器) 表示一个电脑的环境，类似 Window 系统的终端或 Unix/Linux shell，我们可以在终端中输入命令，并接收系统的响应。

Node 自带了交互式解释器，可以执行以下任务：

- **读取** - 读取用户输入，解析输入了 Javascript 数据结构并存储在内存中。
- **执行** - 执行输入的数据结构
- **打印** - 输出结果
- **循环** - 循环操作以上步骤直到用户两次按下  **ctrl-c**  按钮退出。

Node 的交互式解释器可以很好的调试 Javascript 代码。

我们可以输入 `node` 命令来启动 Node 的终端：

### 简单的表达式运算

```node
$ node
> 1 + 4
5
> 1 + ( 2 * 3 ) - 4
2.5
```

### 使用变量

你可以将数据存储在变量中，并在你需要的时候使用它。

变量声明需要使用  `var`  关键字，如果没有使用 `var` 关键字变量会直接打印出来。

使用  `var`  关键字的变量可以使用 `console.log()` 来输出变量。

```node
$ node
> x = 10
10
> var y = 10
undefined
> x + y
20
> console.log("Hello World")
Hello World
undefined
> console.log("www.runoob.com")
www.runoob.com
undefined
```

### 多行表达式

Node REPL 支持输入多行表达式，这就有点类似 JavaScript。接下来让我们来执行一个 do-while 循环：

```node
$ node
> var x = 0
undefined
> do {
... x++;
... console.log("x: " + x);
... } while ( x < 5 );
x: 1
x: 2
x: 3
x: 4
x: 5
undefined
>
```

**...**  三个点的符号是系统自动生成的，你回车换行后即可。Node 会自动检测是否为连续的表达式。

不会打乱对象原有的继承关系。

## Node 的代码组织

有经验的 C 程序员在编写一个新程序时首先从 make 文件写起。同样的，使用 Node.js 编写程序前，为了有个良好的开端，首先需要准备好代码的目录结构和部署方式，就如同修房子要先搭脚手架。本章将介绍与之相关的各种知识。

### 模块路径解析规则

我们已经知道，`require` 函数支持斜杠（`/`）或盘符（`C:`）开头的绝对路径，也支持`./`开头的相对路径。但这两种路径在模块之间建立了强耦合关系，一旦某个模块文件的存放位置需要变更，使用该模块的其它模块的代码也需要跟着调整，变得牵一发动全身。因此，`require`函数支持第三种形式的路径，写法类似于`foo/bar`，并依次按照以下规则解析路径，直到找到模块位置。

#### 内置模块

如果传递给 `require` 函数的是 Node.js 内置模块名称，不做路径解析，直接返回内部模块的导出对象，例如`require("fs")`。

#### node_modules 目录

Node.js 定义了一个特殊的 `node_modules` 目录用于存放模块。

例如某个模块的绝对路径是 `/home/user/hello.js`，在该模块中使用 `require('foo/bar')` 方式加载模块时，则 Node.js 会依次尝试使用以下路径。

```
/home/user/node_modules/foo/bar
/home/node_modules/foo/bar
/node_modules/foo/bar
```

#### NODE_PATH 环境变量

与 `PATH` 环境变量类似，Node.js 允许通过 `NODE_PATH` 环境变量来指定额外的模块搜索路径。

`NODE_PATH` 环境变量中包含一到多个目录路径，路径之间在 Linux 下使用`:`分隔，在 Windows 下使用`;`分隔。例如定义了以下 `NODE_PATH` 环境变量：

```
NODE_PATH=/home/user/lib:/home/lib
```

当使用 `require('foo/bar')` 的方式加载模块时，则 Node.js 依次尝试以下路径。

```
/home/user/lib/foo/bar
/home/lib/foo/bar
```

### 包（package）

我们已经知道了 JS 模块的基本单位是单个 JS 文件，但复杂些的模块往往由多个子模块组成。为了便于管理和使用，我们可以把由多个子模块组成的大模块称做`包`，并把所有子模块放在同一个目录里。

在组成一个包的所有子模块中，需要有一个入口模块，入口模块的导出对象被作为包的导出对象。例如有以下目录结构。

```
- /home/user/lib/
    - cat/
        head.js
        body.js
        main.js
```

其中`cat`目录定义了一个包，其中包含了 3 个子模块。`main.js`作为入口模块，其内容如下：

```js
var head = require("./head");
var body = require("./body");

exports.create = function(name) {
  return {
    name: name,
    head: head.create(),
    body: body.create()
  };
};
```

在其它模块里使用包的时候，需要加载包的入口模块。接着上例，使用`require('/home/user/lib/cat/main')`能达到目的，但是入口模块名称出现在路径里看上去不是个好主意。因此我们需要做点额外的工作，让包使用起来更像是单个模块。

### index.js

当模块的文件名是`index.js`，加载模块时可以使用模块所在目录的路径代替模块文件路径，因此接着上例，以下两条语句等价。

```js
var cat = require("/home/user/lib/cat");
var cat = require("/home/user/lib/cat/index");
```

这样处理后，就只需要把包目录路径传递给`require`函数，感觉上整个目录被当作单个模块使用，更有整体感。

### package.json

如果想自定义入口模块的文件名和存放位置，就需要在包目录下包含一个`package.json`文件，并在其中指定入口模块的路径。上例中的`cat`模块可以重构如下。

```
- /home/user/lib/
    - cat/
        + doc/
        - lib/
            head.js
            body.js
            main.js
        + tests/
        package.json
```

其中`package.json`内容如下。

```json
{
  "name": "cat",
  "main": "./lib/main.js"
}
```

如此一来，就同样可以使用`require('/home/user/lib/cat')`的方式加载模块。Node.js 会根据包目录下的`package.json`找到入口模块所在位置。

### 命令行程序

使用 Node.js 编写的东西，要么是一个包，要么是一个命令行程序，而前者最终也会用于开发后者。因此我们在部署代码时需要一些技巧，让用户觉得自己是在使用一个命令行程序。

例如我们用 Node.js 写了个程序，可以把命令行参数原样打印出来。该程序很简单，在主模块内实现了所有功能。并且写好后，我们把该程序部署在`/home/user/bin/node-echo.js`这个位置。为了在任何目录下都能运行该程序，我们需要使用以下终端命令。

```
$ node /home/user/bin/node-echo.js Hello World
Hello World
```

这种使用方式看起来不怎么像是一个命令行程序，下边的才是我们期望的方式。

```
$ node-echo Hello World
```

#### Linux

在 Linux 系统下，我们可以把 JS 文件当作 shell 脚本来运行，从而达到上述目的，具体步骤如下：

（1）在 shell 脚本中，可以通过`#!`注释来指定当前脚本使用的解析器。所以我们首先在`node-echo.js`文件顶部增加以下一行注释，表明当前脚本使用 Node.js 解析。

```
#! /usr/bin/env node
```

Node.js 会忽略掉位于 JS 模块首行的`#!`注释，不必担心这行注释是非法语句。

（2）然后，我们使用以下命令赋予`node-echo.js`文件执行权限。

```
$ chmod +x /home/user/bin/node-echo.js
```

（3）最后，我们在 PATH 环境变量中指定的某个目录下，例如在`/usr/local/bin`下边创建一个软链文件，文件名与我们希望使用的终端命令同名，命令如下：

```
$ sudo ln -s /home/user/bin/node-echo.js /usr/local/bin/node-echo
```

这样处理后，我们就可以在任何目录下使用`node-echo`命令了。

#### Windows

在 Windows 系统下的做法完全不同，我们得靠`.cmd`文件来解决问题。假设`node-echo.js`存放在`C:\Users\user\bin`目录，并且该目录已经添加到 PATH 环境变量里了。接下来需要在该目录下新建一个名为`node-echo.cmd`的文件，文件内容如下：

```
@node "C:\User\user\bin\node-echo.js" %*
```

这样处理后，我们就可以在任何目录下使用`node-echo`命令了。

### 工程目录

了解了以上知识后，现在我们可以来完整地规划一个工程目录了。以编写一个命令行程序为例，一般我们会同时提供命令行模式和 API 模式两种使用方式，并且我们会借助三方包来编写代码。除了代码外，一个完整的程序也应该有自己的文档和测试用例。因此，一个标准的工程目录都看起来像下边这样。

```
- /home/user/workspace/node-echo/   ## 工程目录
    - bin/                          ## 存放命令行相关代码
        node-echo
    + docs/                          ## 存放文档
    - libs/                          ## 存放API相关代码
        echo.js
    - node_modules/                 ## 存放三方包
        + argv/
    + tests/                        ## 存放测试用例
    package.json                    ## 元数据文件
    README.md                       ## 说明文件
```

其中部分文件内容如下：

```js
/* bin/node-echo */
var argv = require('argv'),
    echo = require('../lib/echo');
console.log(echo(argv.join(' ')));

/* lib/echo.js */
module.exports = function (message) {
    return message;
};

/* package.json */
{
    "name": "node-echo",
    "main": "./lib/echo.js"
}
```

以上例子中分类存放了不同类型的文件，并通过`node_moudles`目录直接使用三方包名加载模块。此外，定义了`package.json`之后，`node-echo`目录也可被当作一个包来使用。

## Node 的 IO 操作

### Buffer

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像 TCP 流或文件流时，必须使用到二进制数据。因此在 Node.js 中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。

在 Node.js 中，Buffer 类是随 Node 内核一起发布的核心库。Buffer 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据，每当需要在 Node.js 中处理 I/O 操作中移动的数据时，就有可能使用 Buffer 库。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

#### 创建 Buffer

Node Buffer 类可以通过多种方式来创建。

1. 创建指定长度的的 Buffer 实例：

```js
var buf = new Buffer(10);
```

2. 通过给定的数组创建 Buffer 实例：

```js
var buf = new Buffer([10, 20, 30, 40, 50]);
```

3. 通过一个字符串来创建 Buffer 实例：

```js
var buf = new Buffer("How are you?", "utf-8");
```

`utf-8` 是默认的编码方式，此外它同样支持以下编码：`ascii`, `utf8`, `utf16le`, `ucs2`, `base64` 和 `hex`。

#### 写入缓冲区

**语法**

```js
buf.write(string[, offset[, length]][, encoding])
```

**参数**

- **string** - 写入缓冲区的字符串。
- **offset** - 缓冲区开始写入的索引值，默认为 0 。
- **length** - 写入的字节数，默认为 buffer.length
- **encoding** - 使用的编码。默认为 'utf8' 。

**返回值**

返回实际写入的大小。如果 buffer 空间不足， 则只会写入部分字符串。

**示例**

```js
var buf1 = new Buffer(10);
console.log("buf1 写入字节数: " + buf1.write("0123456789"));

var buf2 = new Buffer(5);
console.log("buf2 写入字节数: " + buf2.write("0123456789"));
```

执行以上代码，输出结果为：

```
10
5
```

#### 从缓冲区读取数据

**语法**

```js
buf.toString([encoding[, start[, end]]])
```

**参数**

- **encoding** - 使用的编码。默认为 'utf8' 。
- **start** - 指定开始读取的索引位置，默认为 0。
- **end** - 结束位置，默认为缓冲区的末尾。

**返回值**

解码缓冲区数据并使用指定的编码返回字符串。

**实例**

```js
buf = new Buffer(26);
for (var i = 0; i < 26; i++) {
  buf[i] = i + 97;
}

console.log(buf.toString("ascii")); // 输出: abcdefghijklmnopqrstuvwxyz
console.log(buf.toString("ascii", 0, 5)); // 输出: abcde
console.log(buf.toString("utf8", 0, 5)); // 输出: abcde
console.log(buf.toString(undefined, 0, 5)); // 使用 'utf8' 编码, 并输出: abcde
```

#### 将 Buffer 转换为 JSON 对象

**语法**

```js
buf.toJSON();
```

**返回**值

返回 JSON 对象。

**实例**

```js
var buf = new Buffer("goodbye");
var json = buf.toJSON(buf);
console.log(json);
```

执行以上代码，输出结果为：

```js
{ type: 'Buffer', data: [ 103, 111, 111, 100, 98, 121, 101 ] }
```

#### 缓冲区合并

**语法**

```js
Buffer.concat(list[, totalLength])
```

**参数**

- **list** - 用于合并的 Buffer 对象数组列表。
- **totalLength** - 指定合并后 Buffer 对象的总长度。

**返回值**

返回一个多个成员合并的新 Buffer 对象。

**实例**

```js
var buffer1 = new Buffer("Nothing is ");
var buffer2 = new Buffer("impossible");
var buffer3 = Buffer.concat([buffer1, buffer2]);
console.log("buffer3 内容: " + buffer3.toString());
```

执行以上代码，输出结果为：

```
buffer3 内容: Nothing is impossible
```

#### 缓冲区比较

**语法**

```js
buf.compare(otherBuffer);
```

**参数**

参数描述如下：

- **otherBuffer**  与  **buf**  对象比较的另外一个 Buffer 对象。

**返回值**

返回一个数字，表示  **buf**  在  **otherBuffer**  之前，之后或相同。

**实例**

```js
var buffer1 = new Buffer("ABC");
var buffer2 = new Buffer("ABCD");
var result = buffer1.compare(buffer2);

if (result < 0) {
  console.log(buffer1 + " 在 " + buffer2 + "之前");
} else if (result == 0) {
  console.log(buffer1 + " 与 " + buffer2 + "相同");
} else {
  console.log(buffer1 + " 在 " + buffer2 + "之后");
}
```

执行以上代码，输出结果为：

```
ABC在ABCD之前
```

#### 拷贝缓冲区

**语法**

```js
buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])
```

**参数**

- **targetBuffer** - 要拷贝的 Buffer 对象。
- **targetStart** - 数字, 可选, 默认: 0
- **sourceStart** - 数字, 可选, 默认: 0
- **sourceEnd** - 数字, 可选, 默认: buffer.length

**返回值**

没有返回值。

**实例**

```js
var buffer1 = new Buffer("ABC");
var buffer2 = new Buffer(3);
buffer1.copy(buffer2);
console.log("buffer2 内容: " + buffer2.toString());
```

执行以上代码，输出结果为：

```
buffer2 内容: ABC
```

#### 剪切缓冲区

**语法**

```js
buf.slice([start[, end]])
```

**参数**

- **start** - 数字, 可选, 默认: 0
- **end** - 数字, 可选, 默认: buffer.length

**返回值**

返回一个新的缓冲区，它和旧缓冲区指向同一块内存，但是从索引 start 到 end 的位置剪切。

实例

```js
var buffer1 = new Buffer("goodbye");
var buffer2 = buffer1.slice(0, 2);
console.log("buffer2 内容: " + buffer2.toString());
```

执行以上代码，输出结果为：

```
buffer2 内容: go
```

#### 缓冲区长度

**语法**

```js
buf.length;
```

**返回值**

返回 Buffer 对象所占据的内存长度。

**实例**

```js
var buffer = new Buffer("made in China");
console.log("buffer length: " + buffer.length);
```

执行以上代码，输出结果为：

```
buffer length: 13
```

### Stream

Stream 是一个抽象接口，Node 中有很多对象实现了这个接口。例如，对 http 服务器发起请求的 request 对象就是一个 Stream，还有 stdout（标准输出）。

Node.js，Stream 有四种流类型：

- **Readable** - 可读操作。
- **Writable** - 可写操作。
- **Duplex** - 可读可写操作.
- **Transform** - 操作被写入数据，然后读出结果。

所有的 Stream 对象都是 EventEmitter 的实例。常用的事件有：

- **data** - 当有数据可读时触发。
- **end** - 没有更多的数据可读时触发。
- **error** - 在接收和写入过程中发生错误时触发。
- **finish** - 所有数据已被写入到底层系统时触发。

本教程会为大家介绍常用的流操作。

#### 读取流

获取读取流

```js
var readerStream = fs.createReadStream(pathname);

readerStream.on("data", function(chunk) {
  doSomething(chunk);
});

readerStream.on("end", function() {
  cleanUp();
});
```

完整示例代码见：codes/chapter01/node/stream/streamDemo01.js

#### 写入流

获取写入流

```js
var writerStream = fs.createWriteStream("output.txt");
writerStream.write(data, "UTF8");
writerStream.end();
```

完整示例代码见：codes/chapter01/node/stream/streamDemo02.js

#### 管道流

管道提供了一个输出流到输入流的机制。通常我们用于从一个流中获取数据并将数据传递到另外一个流中。

```js
var fs = require("fs");
var readerStream = fs.createReadStream("input.txt");
var writerStream = fs.createWriteStream("output.txt");
readerStream.pipe(writerStream);
```

完整示例代码见：codes/chapter01/node/stream/streamDemo03.js

#### 链式流

链式是通过连接输出流到另外一个流并创建多个对个流操作链的机制。链式流一般用于管道操作。

```js
var fs = require("fs");
var zlib = require("zlib");
fs.createReadStream("input.txt")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("input.txt.gz"));
```

完整示例代码见：codes/chapter01/node/stream/streamDemo04.js

### 文件系统

Node.js 提供一组类似 UNIX（POSIX）标准的文件操作 API。 Node 导入文件系统模块(fs)语法如下所示：

```js
var fs = require("fs");
```

#### 异步和同步

Node.js 文件系统（fs 模块）模块中的方法均有异步和同步版本，例如读取文件内容的函数有异步的 fs.readFile() 和同步的 fs.readFileSync()。

异步的方法函数最后一个参数为回调函数，回调函数的第一个参数包含了错误信息(error)。

建议大家是用异步方法，比起同步，异步方法性能更高，速度更快，而且没有阻塞。

**完整代码示例**：codes/chapter01/node/fs/fsDemo01.js

#### 打开文件

**语法**

```js
fs.open(path, flags[, mode], callback)
```

**参数**

- **path** - 文件的路径。
- **flags** - 文件打开的行为。具体值详见下文。
- **mode** - 设置文件模式(权限)，文件创建默认权限为 0666(可读，可写)。
- **callback** - 回调函数，带有两个参数如：callback(err, fd)。

flags 参数可以是以下值：

| Flag | 描述                                                   |
| ---- | ------------------------------------------------------ |
| r    | 以读取模式打开文件。如果文件不存在抛出异常。           |
| r+   | 以读写模式打开文件。如果文件不存在抛出异常。           |
| rs   | 以同步的方式读取文件。                                 |
| rs+  | 以同步的方式读取和写入文件。                           |
| w    | 以写入模式打开文件，如果文件不存在则创建。             |
| wx   | 类似 'w'，但是如果文件路径存在，则文件写入失败。       |
| w+   | 以读写模式打开文件，如果文件不存在则创建。             |
| wx+  | 类似 'w+'， 但是如果文件路径存在，则文件读写失败。     |
| a    | 以追加模式打开文件，如果文件不存在则创建。             |
| ax   | 类似 'a'， 但是如果文件路径存在，则文件追加失败。      |
| a+   | 以读取追加模式打开文件，如果文件不存在则创建。         |
| ax+  | 类似 'a+'， 但是如果文件路径存在，则文件读取追加失败。 |

**完整代码示例**：codes/chapter01/node/fs/fsDemo02.js

#### 获取文件信息

**语法**

```js
fs.stat(path, callback);
```

**参数**

- **path** - 文件路径。
- **callback** - 回调函数，带有两个参数如：(err, stats), **stats**  是 fs.Stats 对象。

fs.stat(path)执行后，会将 stats 类的实例返回给其回调函数。可以通过 stats 类中的提供方法判断文件的相关属性。

stats 类中的方法有：

| 方法                      | 描述                                                                              |
| ------------------------- | --------------------------------------------------------------------------------- |
| stats.isFile()            | 如果是文件返回 true，否则返回 false。                                             |
| stats.isDirectory()       | 如果是目录返回 true，否则返回 false。                                             |
| stats.isBlockDevice()     | 如果是块设备返回 true，否则返回 false。                                           |
| stats.isCharacterDevice() | 如果是字符设备返回 true，否则返回 false。                                         |
| stats.isSymbolicLink()    | 如果是软链接返回 true，否则返回 false。                                           |
| stats.isFIFO()            | 如果是 FIFO，返回 true，否则返回 false。FIFO 是 UNIX 中的一种特殊类型的命令管道。 |
| stats.isSocket()          | 如果是 Socket 返回 true，否则返回 false。                                         |

**完整代码示例**：codes/chapter01/node/fs/fsDemo03.js

#### 写入文件

**语法**

```js
fs.writeFile(file, data[, options], callback)
```

如果文件存在，该方法写入的内容会覆盖旧的文件内容。

**参数**

- **file** - 文件名或文件描述符。
- **data** - 要写入文件的数据，可以是 String(字符串) 或 Buffer(流) 对象。
- **options** - 该参数是一个对象，包含 {encoding, mode, flag}。默认编码为 utf8, 模式为 0666 ， flag 为 'w'
- **callback** - 回调函数，回调函数只包含错误信息参数(err)，在写入失败时返回。

**完整代码示例**：codes/chapter01/node/fs/fsDemo04.js

#### 读取文件

**语法**

```js
fs.read(fd, buffer, offset, length, position, callback);
```

该方法使用了文件描述符来读取文件。

**参数**

- **fd** - 通过 fs.open() 方法返回的文件描述符。
- **buffer** - 数据写入的缓冲区。
- **offset** - 缓冲区写入的写入偏移量。
- **length** - 要从文件中读取的字节数。
- **position** - 文件读取的起始位置，如果 position 的值为 null，则会从当前文件指针的位置读取。
- **callback** - 回调函数，有三个参数 err, bytesRead, buffer，err 为错误信息， bytesRead 表示读取的字节数，buffer 为缓冲区对象。

**完整代码示例**：codes/chapter01/node/fs/fsDemo05.js

#### 关闭文件

**语法**

```js
fs.close(fd, callback);
```

该方法使用了文件描述符来读取文件。

**参数**

- **fd** - 通过 fs.open() 方法返回的文件描述符。
- **callback** - 回调函数，没有参数。

**完整代码示例**：codes/chapter01/node/fs/fsDemo06.js

#### 截取文件

**语法**

```js
fs.ftruncate(fd, len, callback);
```

该方法使用了文件描述符来读取文件。

**参数**

- **fd** - 通过 fs.open() 方法返回的文件描述符。
- **len** - 文件内容截取的长度。
- **callback** - 回调函数，没有参数。

**完整代码示例**：codes/chapter01/node/fs/fsDemo07.js

#### 删除文件

**语法**

```js
fs.unlink(path, callback);
```

**参数**

- **path** - 文件路径。
- **callback** - 回调函数，没有参数。

**完整代码示例**：codes/chapter01/node/fs/fsDemo08.js

#### 创建目录

**语法**

```js
fs.mkdir(path[, mode], callback)
```

**参数**

- **path** - 文件路径。
- **mode** - 设置目录权限，默认为 0777。
- **callback** - 回调函数，没有参数。

**完整代码示例**：codes/chapter01/node/fs/fsDemo09.js

#### 读取目录

**语法**

```js
fs.readdir(path, callback);
```

**参数**

- **path** - 文件路径。
- **callback** - 回调函数，回调函数带有两个参数 err, files，err 为错误信息，files 为 目录下的文件数组列表。

**完整代码示例**：codes/chapter01/node/fs/fsDemo10.js

#### 删除目录

**语法**

```js
fs.rmdir(path, callback);
```

**参数**

- **path** - 文件路径。
- **callback** - 回调函数，没有参数。

**完整代码示例**：codes/chapter01/node/fs/fsDemo11.js

## Node.js 工具

### nvm

[nvm](https://github.com/creationix/nvm) 是 Node 版本管理器。

安装

```sh
# 两条命令效果相同
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

设置环境变量

```sh
export NVM_DIR="${XDG_CONFIG_HOME/:-$HOME/.}nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

使用

```sh
nvm install 6.14.4  # 安装 Node.js 版本
nvm use node6.14.4  # 指定 Node.js 版本（必须已安装）
```

## 更多内容

> :books: 拓展阅读
>
> - [Node.js](nodejs.md)
> - [Npm](npm.md)
> - [Yarn](yarn.md)
>
> :package: 本文归档在 [前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

- **官方**
  - [Node.js 官网](https://nodejs.org/zh-cn/)
  - [Node.js Github](https://github.com/nodejs/node)
- **教程**
  - [Node.js 包教不包会](https://github.com/alsotang/node-lessons)
  - [一起学 Node.js](https://github.com/nswbmw/N-blog)
  - [七天学会 NodeJS](https://github.com/nqdeng/7-days-nodejs)
- **规范**
  - [Node.JS 最佳实践](https://github.com/i0natan/nodebestpractices)
- **工具**
  - [nvm](https://github.com/creationix/nvm) - Node 版本管理器
- **更多资源**
  - [awesome-nodejs](https://github.com/sindresorhus/awesome-nodejs)
