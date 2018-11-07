# Angular 教程

## 入门

> 先决条件：Node.js

（1）执行 npm install -g @angular/cli 安装 Angular CLI

（2）创建工作空间和初始应用

Angular 工作空间就是你开发应用的上下文环境。 每个工作空间包含一些供一个或多个项目使用的文件。 每个项目都是一组由应用、库或端到端（e2e）测试构成的文件。

执行命令 `ng new my-app`，根据提示选择需要的特性，Angular CLI 会安装必要的 Angular npm 包及其它依赖。

（3）启动开发服务器

执行下面的命令，ng serve 命令会自动打开浏览器，并访问 http://localhost:4200/

```
cd my-app
ng serve --open
```

![](https://angular.cn/generated/images/guide/cli-quickstart/app-works.png)

（4）添加组件

组件是 Angular 应用中的基本构造块。 它们在屏幕上显示数据、监听用户输入，并根据这些输入采取行动。

修改 ./src/app/app.component.ts

```js
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "My First Angular App!";
}
```

修改 ./src/app/app.component.css

```css
h1 {
  color: #369;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 250%;
}
```

效果：

![](https://angular.cn/generated/images/guide/cli-quickstart/my-first-app.png)

## 引申和引用

> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

- **官方**
  - [Angular 官网](https://angular.io)
  - [Angular 中文网](https://angular.cn/)
  - [Angular Github](https://github.com/angular/angular)
  - [AngularJS Github](https://github.com/angular/angular.js)
