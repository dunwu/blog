---
title: JavaScript QA 工具总结
date: 2019-03-06
---

# JavaScript QA 工具总结

<!-- TOC -->

- [JavaScript QA 工具总结](#javascript-qa-工具总结)
    - [[JSLint](https://github.com/douglascrockford/JSLint)](#jslinthttpsgithubcomdouglascrockfordjslint)
    - [[JSHint](https://github.com/jshint/jshint)](#jshinthttpsgithubcomjshintjshint)
    - [[ESLint](https://github.com/eslint/eslint) :heavy_check_mark:](#eslinthttpsgithubcomeslinteslint-heavy_check_mark)
    - [[Prettier](https://github.com/prettier/prettier) :heavy_check_mark:](#prettierhttpsgithubcomprettierprettier-heavy_check_mark)
    - [[EditorConfig](https://editorconfig.org/) :heavy_check_mark:](#editorconfighttpseditorconfigorg-heavy_check_mark)
    - [[Standard](https://github.com/feross/standard) :heavy_check_mark:](#standardhttpsgithubcomferossstandard-heavy_check_mark)
    - [[TSlint](https://github.com/palantir/tslint)](#tslinthttpsgithubcompalantirtslint)
    - [更多内容](#更多内容)

<!-- /TOC -->

## [JSLint](https://github.com/douglascrockford/JSLint)

JavaScript 静态检查工具。

- 优点
  - 可以直接使用
- 缺点
  - 没有配置文件，规则不能修改
  - 不支持自定义规则
  - 没有文档记录规则
  - 很难弄清楚哪个规则引起的错误

## [JSHint](https://github.com/jshint/jshint)

JavaScript 静态检查工具。

- 优点
  - 大多是参数可以配置
  - 支持配置文件，在大项目中容易使用
  - 已经支持需要类库，像 jQuery、QUnit、NodeJS、Mocha 等
  - 支持基本的 ES6
- 缺点
  - 难于知道哪个规则产生错误
  - 存在两类选项：强制选项和松散选项。使得配置有些混乱
  - 不支持自定义规则

## [ESLint](https://github.com/eslint/eslint) :heavy_check_mark:

JavaScript 静态检查工具。

- 优点
  - 灵活：任何规则都可以开启闭合，以及有些规则有些额外配置
  - 很容易拓展和有需要可用插件
  - 容易理解产出
  - 包含了在其他检查器中不可用的规则，使得 ESLint 在错误检查上更有用
  - 支持 ES6，唯一支持 JSX 的工具
  - 支持自定义报告
- 缺点
  - 速度慢，但不是主要问题

## [Prettier](https://github.com/prettier/prettier) :heavy_check_mark:

可定制的代码格式化工具。

支持格式：

- JavaScript · TypeScript · Flow · JSX · JSON
- CSS · SCSS · Less
- HTML · Vue · Angular
- GraphQL · Markdown · YAML

Intellij 和 Vscode 都可以安装 Prettier 插件来使用。

[Install](https://prettier.io/docs/en/install.html) · [Options](https://prettier.io/docs/en/options.html) · [CLI](https://prettier.io/docs/en/cli.html) · [API](https://prettier.io/docs/en/api.html)

## [EditorConfig](https://editorconfig.org/) :heavy_check_mark:

可以在编辑器或 IDE 中维护代码格式。

[EditorConfig 应用示例](https://github.com/editorconfig/editorconfig/wiki/Projects-Using-EditorConfig)

## [Standard](https://github.com/feross/standard) :heavy_check_mark:

JavaScript 静态检查工具。

- 优点
- 无须配置。
- 自动代码格式化。 只需运行 standard --fix
- 提前发现风格及程序问题。

## [TSlint](https://github.com/palantir/tslint)

TypeScript 静态检查工具。

## 更多内容

> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)
