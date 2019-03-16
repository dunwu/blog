---
title: Angular 教程
date: 2019-03-06
---

# Angular 教程

> :notebook: 本文已归档到：「[blog](https://github.com/dunwu/blog)」

> **Angular 是一个用 HTML 和 TypeScript 构建客户端应用的平台与框架。**

<!-- TOC depthFrom:2 depthTo:3 -->

- [入门](#入门)
    - [Angular CLI](#angular-cli)
    - [入门示例](#入门示例)
- [架构](#架构)
- [组件与模块](#组件与模块)
- [表单](#表单)
- [Observable 和 RxJS](#observable-和-rxjs)
- [引导启动](#引导启动)
- [NgModule](#ngmodule)
- [依赖注入](#依赖注入)
- [HttpClient](#httpclient)
- [路由和导航](#路由和导航)
- [动画](#动画)
- [参考资料](#参考资料)

<!-- /TOC -->

## 入门

### Angular CLI

Angular 提供了 Angular CLI，帮助用户创建项目、创建应用和库代码，并执行多种开发任务，比如测试、打包和发布。

Angular CLI，非常适合 Angular 初学者入门。

安装 Angular CLI：

```bash
npm install -g @angular/cli
```

创建项目：

```bash
ng new my-first-project
cd my-first-project
```

创建组件：

```bash
# 语法
ng generate <schematic> [options]
ng g <schematic> [options]

# 示例
ng g c new-component # 创建组件
ng g module new-module # 创建模块
ng g pipe new-pipe # 创建模块
ng g service new-service # 创建模块
...
```

> ng generate 扩展阅读：https://angular.cn/cli/generate

启动服务：

```bash
ng serve --open
ng s --open # 简写版
```

构建项目：

```bash
ng build my-app -c production
```

> Angular CLI 扩展阅读：
>
> - [快速上手](https://angular.cn/guide/quickstart#getting-started) -
> - [angular-cli 命令参考手册](https://angular.cn/cli)
> - [angular-cli Github](https://github.com/angular/angular-cli)

### 入门示例

> 扩展阅读：
>
> - [Angular 官方的英雄教程](https://angular.cn/tutorial) - 通过一个小项目，一步步引导读者去使用、了解 Angular 基础特性。

## 架构

**Angular 是一个用 HTML 和 TypeScript 构建客户端应用的平台与框架。**

Angular 的基本构造块是 **NgModule**，它为**组件**提供了编译的上下文环境。 NgModule 会把相关的代码收集到一些功能集中。Angular 应用就是由一组 NgModule 定义出的。 应用至少会有一个用于引导应用的**根模块**，通常还会有很多**特性模块**。

- 组件定义**视图**。视图是一组可见的屏幕元素，Angular 可以根据你的程序逻辑和数据来选择和修改它们。 每个应用都至少有一个根组件。
- 组件使用**服务**。服务会提供那些与视图不直接相关的功能。服务提供商可以作为**依赖**被**注入**到组件中， 这能让你的代码更加模块化、可复用，而且高效。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/front/mvc/angular/Angular架构.png"/></div><br>

组件和模板共同定义了 Angular 的视图。

- 组件类上的装饰器为其添加了元数据，其中包括指向相关模板的指针。
- 组件模板中的指令和绑定标记会根据程序数据和程序逻辑修改这些视图。

依赖注入器会为组件提供一些服务，比如路由器服务就能让你定义如何在视图之间导航。

## 组件与模块

## 表单

## Observable 和 RxJS

## 引导启动

## NgModule

## 依赖注入

## HttpClient

## 路由和导航

## 动画

## 参考资料

- **官方**
  - [Angular 官网](https://angular.io)
  - [Angular 中文网](https://angular.cn/)
  - [Angular Github](https://github.com/angular/angular)
  - [AngularJS Github](https://github.com/angular/angular.js)
