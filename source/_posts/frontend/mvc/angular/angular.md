---
title: Angular 教程
date: 2019-03-06
---

# Angular 教程

> **Angular 是一个用 HTML 和 TypeScript 构建客户端应用的平台与框架。**

<!-- TOC depthFrom:2 depthTo:3 -->

- [入门](#入门)
- [架构](#架构)
- [模块](#模块)
    - [@NgModule 元数据](#ngmodule-元数据)
    - [NgModule 和组件](#ngmodule-和组件)
    - [ES2015 模块](#es2015-模块)
- [组件](#组件)
    - [组件的元数据](#组件的元数据)
    - [模板与视图](#模板与视图)
    - [模板语法](#模板语法)
    - [数据绑定](#数据绑定)
    - [管道](#管道)
    - [指令](#指令)
- [服务与依赖注入](#服务与依赖注入)
    - [依赖注入](#依赖注入)
    - [提供服务](#提供服务)
- [路由](#路由)
- [更多内容](#更多内容)

<!-- /TOC -->

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

<br><div align="center"><img src="https://angular.cn/generated/images/guide/cli-quickstart/app-works.png"/></div><br>

（4）添加组件

组件是 Angular 应用中的基本构造块。 它们在屏幕上显示数据、监听用户输入，并根据这些输入采取行动。

修改 ./src/app/app.component.ts

```js
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My First Angular App!';
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

<br><div align="center"><img src="https://angular.cn/generated/images/guide/cli-quickstart/my-first-app.png"/></div><br>

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

## 模块

Angular 应用是模块化的，它拥有自己的模块化系统，称作 **NgModule**。

一个 NgModule 就是一个容器，用于存放一些内聚的代码块，这些代码块专注于某个应用领域、某个工作流或一组紧密相关的功能。 它可以包含一些组件、服务或其它代码文件，其作用域由包含它们的 NgModule 定义。 它还可以导入一些由其它模块中导出的功能，并导出一些指定的功能供其它 NgModule 使用。

每个 Angular 应用都有一个根模块，通常命名为 AppModule，并位于一个名叫 app.module.ts 的文件中。根模块提供了用来启动应用的**引导**机制。 一个应用通常会包含很多功能模块。

把你的代码组织成一些清晰的功能模块，可以帮助管理复杂应用的开发工作并实现可复用性设计。 另外，这项技术还能让你获得惰性加载（也就是按需加载模块）的优点，以尽可能减小启动时需要加载的代码体积。

### @NgModule 元数据

NgModule 是一个带有 `@NgModule()` 装饰器的类。@NgModule() 装饰器是一个函数，它接受一个元数据对象，该对象的属性用来描述这个模块。其中最重要的属性如下。

- declarations（可声明对象表） —— 那些属于本 NgModule 的组件、指令、管道。
- exports（导出表） —— 那些能在其它模块的组件模板中使用的可声明对象的子集。
- imports（导入表） —— 那些导出了本模块中的组件模板所需的类的其它模块。
- providers —— 本模块向全局服务中贡献的那些服务的创建器。 这些服务能被本应用中的任何部分使用。（你也可以在组件级别指定服务提供商，这通常是首选方式。）
- bootstrap —— 应用的主视图，称为根组件。它是应用中所有其它视图的宿主。只有根模块才应该设置这个 bootstrap 属性。

一个简单的根 NgModule 定义：

```js
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [BrowserModule],
  providers: [Logger],
  declarations: [AppComponent],
  exports: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### NgModule 和组件

NgModule 为其中的组件提供了一个**编译上下文环境**。根模块总会有一个根组件，并在引导期间创建它。 但是，任何模块都能包含任意数量的其它组件，这些组件可以通过路由器加载，也可以通过模板创建。那些属于这个 NgModule 的组件会共享同一个编译上下文环境。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/front/mvc/angular/Angular编译上下文环境.png"/></div><br>

组件及其模板共同定义**视图**。组件还可以包含**视图层级结构**，它能让你定义任意复杂的屏幕区域，可以将其作为一个整体进行创建、修改和销毁。 一个视图层次结构中可以混合使用由不同 NgModule 中的组件定义的视图。 这种情况很常见，特别是对一些 UI 库来说。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/front/mvc/angular/Angular视图层级结构.png"/></div><br>

当你创建一个组件时，它直接与一个叫做**宿主视图**的视图关联起来。 宿主视图可以是视图层次结构的根，该视图层次结构可以包含一些**内嵌视图**，这些内嵌视图又是其它组件的宿主视图。 这些组件可以位于相同的 NgModule 中，也可以从其它 NgModule 中导入。 树中的视图可以嵌套到任意深度。

### ES2015 模块

NgModule 系统与 ES201）用来管理对象的模块系统不同，而且也没有直接关联。 这两种模块系统不同但互补。你可以使用它们来共同编写你的应用。

JavaScript 中，每个文件是一个模块，文件中定义的所有对象都从属于那个模块。 通过 export 关键字，模块可以把它的某些对象声明为公共的。 其它 JavaScript 模块可以使用 import 语句来访问这些公共对象。

```js
// 导入模块
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// 导出模块
export class AppModule {}
```

## 组件

组件控制屏幕上被称为**视图**的一小片区域。

每个 Angular 应用都至少有一个组件，也就是**根组件**，它会把组件树和页面中的 DOM 连接起来。 每个组件都会定义一个类，其中包含应用的数据和逻辑，并与一个 HTML **模板**相关联，该模板定义了一个供目标环境下显示的视图。

### 组件的元数据

@Component() 装饰器表明紧随它的那个类是一个组件，并提供模板和该组件专属的元数据。

> @Component() 装饰器表明紧随它的那个类是一个组件，并提供模板和该组件专属的元数据。

组件的元数据告诉 Angular 到哪里获取它需要的主要构造块，以创建和展示这个组件及其视图。 具体来说，它把一个模板（无论是直接内联在代码中还是引用的外部文件）和该组件关联起来。 该组件及其**模板**，共同描述了一个**视图**。

除了包含或指向模板之外，@Component 的元数据还会配置要如何在 HTML 中引用该组件，以及该组件需要哪些服务等等。

最常用的 @Component 配置选项：

- `selector` —— 是一个 CSS 选择器，它会告诉 Angular，一旦在模板 HTML 中找到了这个选择器对应的标签，就创建并插入该组件的一个实例。 比如，如果应用的 HTML 中包含 `<app-hero-list></app-hero-list>`，Angular 就会在这些标签中插入一个 HeroListComponent 实例的视图。
- `templateUrl` —— 该组件的 HTML 模板文件相对于这个组件文件的地址。 另外，你还可以用 template 属性的值来提供内联的 HTML 模板。 这个模板定义了该组件的宿主视图。
- `providers` —— 当前组件所需的服务提供商的一个数组。在这个例子中，它告诉 Angular 该如何提供一个 HeroService 实例，以获取要显示的英雄列表。

### 模板与视图

你要通过组件的配套模板来定义其视图。模板就是一种 HTML，它会告诉 Angular 如何渲染该组件。

视图通常会分层次进行组织，让你能以 UI 分区或页面为单位进行修改、显示或隐藏。与组件直接关联的模板会定义该组件的**宿主视图**。该组件还可以定义一个**带层次结构的视图**，它包含一些**内嵌的视图**作为其它组件的宿主。

带层次结构的视图可以包含同一模块（NgModule）中组件的视图，也可以（而且经常会）包含其它模块中定义的组件的视图。

### 模板语法

模板很像标准的 HTML，但是它还包含 Angular 的[模板语法](https://angular.cn/guide/template-syntax)，这些模板语法可以根据你的应用逻辑、应用状态和 DOM 数据来修改这些 HTML。 你的模板可以使用**数据绑定**来协调应用和 DOM 中的数据，使用**管道**在显示出来之前对其进行转换，使用**指令**来把程序逻辑应用到要显示的内容上。

模板示例：

```html
<h2>Hero List</h2>

<p><i>Pick a hero from the list</i></p>
<ul>
  <li *ngFor="let hero of heroes" (click)="selectHero(hero)">{ {hero.name} }</li>
</ul>

<app-hero-detail *ngIf="selectedHero" [hero]="selectedHero"></app-hero-detail>
```

> 说明：上例中，除了 HTML 元素外，还包括一些 Angular 的模板语法元素：
>
> - `*ngFor` 指令告诉 Angular 在一个列表上进行迭代。
> - `{ {hero.name} }`、`(click)` 和 `[hero]` 把程序数据绑定到及绑定回 DOM，以响应用户的输入。更多内容参见稍后的数据绑定部分。
> - 模板中的 `<app-hero-detail>` 标签是一个代表新组件 HeroDetailComponent 的元素。 HeroDetailComponent（代码略）定义了 HeroListComponent 的英雄详情子视图。 注意观察像这样的自定义组件是如何与原生 HTML 元素无缝的混合在一起的。

### 数据绑定

模板会把 HTML 和 Angular 的标记（markup）组合起来，这些标记可以在 HTML 元素显示出来之前修改它们。模板中的**指令**会提供程序逻辑，而**绑定标记**会把你应用中的数据和 DOM 连接在一起。 有两种类型的数据绑定：

- **事件绑定**让你的应用可以通过更新应用的数据来响应目标环境下的用户输入。
- **属性绑定**让你将从应用数据中计算出来的值插入到 HTML 中。

在视图显示出来之前，Angular 会先根据你的应用数据和逻辑来运行模板中的指令并解析绑定表达式，以修改 HTML 元素和 DOM。

Angular 支持**双向数据绑定**，这意味着 DOM 中发生的变化（比如用户的选择）同样可以反映回你的程序数据中。

下图显示了数据绑定标记的四种形式。每种形式都有一个方向 —— 从组件到 DOM、从 DOM 到组件或双向。

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/front/mvc/angular/Angular数据绑定.png"/></div><br>

在双向绑定中，数据属性值通过属性绑定从组件流到输入框。用户的修改通过事件绑定流回组件，把属性值设置为最新的值。

### 管道

Angular 的管道可以让你在模板中声明显示值的转换逻辑。 带有 `@Pipe` 装饰器的类中会定义一个转换函数，用来把输入值转换成供视图显示用的输出值。

Angular 自带了很多管道，完整的列表参见 [Pipes API 列表](https://angular.cn/api?type=pipe)。你也可以自己定义一些新管道。

要在 HTML 模板中指定值的转换方式，请使用 [管道操作符 (|)](https://angular.cn/guide/template-syntax#pipe)。

```html
{ {interpolated_value | pipe_name} }
```

你可以把管道串联起来，把一个管道函数的输出送给另一个管道函数进行转换。 管道还能接收一些参数，来控制它该如何进行转换。比如，你可以把要使用的日期格式传给 `date` 管道：

```html
<!-- Default format: output 'Jun 15, 2015' -->

<p>Today is { {today | date} }</p>

<!-- fullDate format: output 'Monday, June 15, 2015' -->

<p>The date is { {today | date:'fullDate'} }</p>

<!-- shortTime format: output '9:43 AM' -->

<p>The time is { {today | date:'shortTime'} }</p>
```

### 指令

Angular 的模板是**动态的**。当 Angular 渲染它们的时候，会根据**指令**给出的指示对 DOM 进行转换。 指令就是一个带有 `@Directive()` 装饰器的类。

组件从技术角度上说就是一个指令，但是由于组件对 Angular 应用来说非常独特、非常重要，因此 Angular 专门定义了 `@Component()` 装饰器，它使用一些面向模板的特性扩展了 `@Directive()` 装饰器。

除组件外，还有两种指令：**结构型指令**和**属性型指令**。 Angular 本身定义了一系列这两种类型的指令，你也可以使用 `@Directive()` 装饰器来定义自己的指令。

像组件一样，指令的元数据把它所装饰的指令类和一个 `selector` 关联起来，`selector` 用来把该指令插入到 HTML 中。 在模板中，指令通常作为属性出现在元素标签上，可能仅仅作为名字出现，也可能作为赋值目标或绑定目标出现。

#### 结构型指令

**结构型指令**通过添加、移除或替换 DOM 元素来修改布局。 这个范例模板使用了两个内置的结构型指令来为要渲染的视图添加程序逻辑：

```html
<li *ngFor="let hero of heroes"></li>
<app-hero-detail *ngIf="selectedHero"></app-hero-detail>
```

- `*ngFor` 是一个迭代器，它要求 Angular 为 heroes 列表中的每个 `<li>` 渲染出一个 `<li>`。
- `*ngIf` 是个条件语句，只有当选中的英雄存在时，它才会包含 HeroDetail 组件。

#### 属性型指令

*属性型指令*会修改现有元素的外观或行为。 在模板中，它们看起来就像普通的 HTML 属性一样，因此得名“属性型指令”。

`ngModel` 指令就是属性型指令的一个例子，它实现了双向数据绑定。 `ngModel` 修改现有元素（一般是 `<input>`）的行为：设置其显示属性值，并响应 change 事件。

```html
<input [(ngModel)]="hero.name" />
```

## 服务与依赖注入

**服务**是一个广义的概念，它包括应用所需的任何值、函数或特性。狭义的服务是一个明确定义了用途的类。它应该做一些具体的事，并做好。

Angular 把组件和服务区分开，以提高模块性和复用性。 通过把组件中和视图有关的功能与其他类型的处理分离开，你可以让组件类更加精简、高效。

理想情况下，组件的工作只管用户体验，而不用顾及其它。 它应该提供用于数据绑定的属性和方法，以便作为视图（由模板渲染）和应用逻辑（通常包含一些**模型**的概念）的中介者。

组件应该把诸如从服务器获取数据、验证用户输入或直接往控制台中写日志等工作委托给各种服务。通过把各种处理任务定义到可注入的服务类中，你可以让它被任何组件使用。 通过在不同的环境中注入同一种服务的不同提供商，你还可以让你的应用更具适应性。

Angular 不会**强制**你遵循这些原则。它只会通过**依赖注入**让你能更容易地将应用逻辑分解为服务，并让这些服务可用于各个组件中。

服务范例一：

```js
export class Logger {
  log(msg: any) {
    console.log(msg);
  }
  error(msg: any) {
    console.error(msg);
  }
  warn(msg: any) {
    console.warn(msg);
  }
}
```

服务也可以依赖其它服务。服务范例二：

```js
export class HeroService {
  private heroes: Hero[] = [];

  constructor(
    private backend: BackendService,
    private logger: Logger) { }

  getHeroes() {
    this.backend.getAll(Hero).then( (heroes: Hero[]) => {
      this.logger.log(`Fetched ${heroes.length} heroes.`);
      this.heroes.push(...heroes); // fill cache
    });
    return this.heroes;
  }
}
```

### 依赖注入

对于与特定视图无关并希望跨组件共享的数据或逻辑，可以创建**服务**类。服务类的定义通常紧跟在 `@Injectable()` 装饰器之后。该装饰器提供的元数据可以让你的服务作为**依赖**被**注入**到客户组件中。

- **注入器**是主要的机制。你不用自己创建 Angular 注入器。Angular 会在启动过程中为你创建全应用级注入器以及所需的其它注入器。你不用自己创建注入器。
- 该注入器会创建依赖、维护一个**容器**来管理这些依赖，并尽可能复用它们。
- **提供商**是一个对象，用来告诉注入器应该如何获取或创建依赖。

你的应用中所需的任何依赖，都必须使用该应用的注入器来注册一个提供商，以便注入器可以使用这个提供商来创建新实例。对于服务，该提供商通常就是服务类本身。

> 依赖不一定是服务 —— 它还可能是函数或值。

当 Angular 创建组件类的新实例时，它会通过查看该组件类的构造函数，来决定该组件依赖哪些服务或其它依赖项。 比如 `HeroListComponent` 的构造函数中需要 `HeroService`：

```js
constructor(private service: HeroService) { }
```

当 Angular 发现某个组件依赖某个服务时，它会首先检查是否该注入器中已经有了那个服务的任何现有实例。如果所请求的服务尚不存在，注入器就会使用以前注册的服务提供商来制作一个，并把它加入注入器中，然后把该服务返回给 Angular。

当所有请求的服务已解析并返回时，Angular 可以用这些服务实例为参数，调用该组件的构造函数。

`HeroService` 的注入过程如下所示：

<br><div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/front/mvc/angular/Angular依赖注入.png"/></div><br>

### 提供服务

对于要用到的任何服务，你必须至少注册一个**提供商**。服务可以在自己的元数据中把自己注册为提供商，这样可以让自己随处可用。或者，你也可以为特定的模块或组件注册提供商。要注册提供商，就要在服务的 `@Injectable()` 装饰器中提供它的元数据，或者在`@NgModule()` 或 `@Component()` 的元数据中。

- 默认情况下，Angular CLI 的 [`ng generate service`](https://angular.cn/cli/generate) 命令会在 `@Injectable()` 装饰器中提供元数据来把它注册到根注入器中。本教程就用这种方法注册了 HeroService 的提供商：

```js
@Injectable({
  providedIn: 'root',
})
```

当你在根一级提供服务时，Angular 会为 HeroService 创建一个单一的共享实例，并且把它注入到任何想要它的类中。这种在 `@Injectable` 元数据中注册提供商的方式还让 Angular 能够通过移除那些从未被用过的服务来优化大小。

- 当你使用[特定的 NgModule](https://angular.cn/guide/architecture-modules) 注册提供商时，该服务的同一个实例将会对该 NgModule 中的所有组件可用。要想在这一层注册，请用 `@NgModule()` 装饰器中的 `providers` 属性：

```
content_copy@NgModule({   providers: [    BackendService,    Logger  ],  ... })
```

- 当你在组件级注册提供商时，你会为该组件的每一个新实例提供该服务的一个新实例。 要在组件级注册，就要在 `@Component()` 元数据的 `providers` 属性中注册服务提供商。

src/app/hero-list.component.ts (component providers)`content_copy@Component({ selector: 'app-hero-list', templateUrl: './hero-list.component.html', providers: [ HeroService ] })`

要了解更多细节，请参见[依赖注入](https://angular.cn/guide/dependency-injection)一节。

## 路由

Angular 的 Router 模块提供了一个服务，它可以让你定义在应用的各个不同状态和视图层次结构之间导航时要使用的路径。 它的工作模型基于人们熟知的浏览器导航约定：

- 在地址栏输入 URL，浏览器就会导航到相应的页面。
- 在页面中点击链接，浏览器就会导航到一个新页面。
- 点击浏览器的前进和后退按钮，浏览器就会在你的浏览历史中向前或向后导航。

不过路由器会把类似 URL 的路径映射到视图而不是页面。 当用户执行一个动作时（比如点击链接），本应该在浏览器中加载一个新页面，但是路由器拦截了浏览器的这个行为，并显示或隐藏一个视图层次结构。

如果路由器认为当前的应用状态需要某些特定的功能，而定义此功能的模块尚未加载，路由器就会按需**惰性加载**此模块。

路由器会根据你应用中的导航规则和数据状态来拦截 URL。 当用户点击按钮、选择下拉框或收到其它任何来源的输入时，你可以导航到一个新视图。 路由器会在浏览器的历史日志中记录这个动作，所以前进和后退按钮也能正常工作。

要定义导航规则，你就要把**导航路径**和你的组件关联起来。 路径（path）使用类似 URL 的语法来和程序数据整合在一起，就像模板语法会把你的视图和程序数据整合起来一样。 然后你就可以用程序逻辑来决定要显示或隐藏哪些视图，以根据你制定的访问规则对用户的输入做出响应。

## 更多内容

> :package: 本文归档在 [我的前端技术教程系列：frontend-tutorial](https://github.com/dunwu/frontend-tutorial)

- **官方**
  - [Angular 官网](https://angular.io)
  - [Angular 中文网](https://angular.cn/)
  - [Angular Github](https://github.com/angular/angular)
  - [AngularJS Github](https://github.com/angular/angular.js)
