---
title: Vue 教程
date: 2019-03-06
---

# Vue 教程

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [vue 生命周期](#vue-生命周期)
- [更多内容](#更多内容)

<!-- /TOC -->

## 简介

Vue (读音 /vjuː/，类似于 **view**) 是一套用于构建用户界面的**渐进式框架**。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。

Vue.js 的核心是一个允许采用简洁的模板语法来声明式地将数据渲染进 DOM 的系统：

html

```html
<div id="app">{{ message }}</div>
```

Javascript

```javascript
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
});
```

### vue 生命周期

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/front/mvc/vue/vue-lifecycle.png"/></div><br>

## 更多内容

- 官方
  - [vue Github](https://github.com/vuejs/vue)
  - [vue 官方文档](https://cn.vuejs.org/index.html)
  - [vue-router Github](https://github.com/vuejs/vue-router) - vue 官方路由框架
  - [vuex Github](https://github.com/vuejs/vuex) - vue 官方集中式状态管理框架
  - [vue-cli Github](https://github.com/vuejs/vue-cli) - vue 官方开发工具
  - [vue-devtools Github](https://github.com/vuejs/vue-devtools) - vue 官方 debug 工具
- 更多资源
  - [Awesome Vue](https://github.com/vuejs/awesome-vue)
