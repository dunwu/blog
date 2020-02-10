---
title: Travis CI 入门教程
categories: ['工具']
tags: ['工具', 'CI']
date: 2020-02-10 14:40
---

# Travis CI 入门教程

## 一、简介

[Travis CI](https://travis-ci.org/) 提供的是持续集成服务（Continuous Integration，简称 CI）。我们在软件开发过程中，有构建、测试、部署这些必不可少的步骤，而这些会花掉我们很多的时间。为了提高软件开发的效率，现在涌现了很多自动化工具。[Travis CI](https://travis-ci.org/) 是目前[市场份额](https://github.blog/2017-11-07-github-welcomes-all-ci-tools/)最大的一个，而且有很详细的文档以及可以和 Github 很好的对接。

Travis CI 是 Github 项目最流行的持续集成工具。

### 持续集成

持续集成（Continuous integration，缩写 CI）是一种软件工程流程，即团队开发成员经常集成他们的工作，通常每个成员每天至少集成一次，也就意味着每天可能会发生多次集成。每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。

## 二、使用

### 加载 Github 项目

首先打开官方网站 [travis-ci.org](https://travis-ci.org/)，然后使用 Github 账号登入 Travis CI，然后 Travis 中会列出你 Github 上面所有的仓库，以及你所属于的组织。

然后，勾选你需要 Travis 帮你自动构建的仓库，打开仓库旁边的开关，打开以后，Travis 就会监听这个仓库的所有变化了。

![travis-ci-1](https://neveryu.github.io/images/travis-ci-1.png)

### 配置 `.travis.yml`

Travis 要求项目的根目录下面，必须有一个 `.travis.yml` 文件。这是配置文件，指定了 Travis 的行为。该文件必须保存在 Github 仓库里面，一旦代码仓库有新的 `Commit`，Travis 就会去找这个文件，执行里面的命令。

所以呢，我们就可以在这个文件里，配置我们任务（Travis 监测到仓库有 `commit` 后会自动执行）。

一个简单的 `.travis.yml` 文件如下：

```
language: node_jsscript: true
```

所以呢，我在 `.travis.yml` 里，配置了一个执行脚本的任务；那么现在 Travis 监测到我仓库有 `commit` 后就会找到 `.travis.yml` 这个文件，然后就执行了我的那个脚本了。

#### install 字段

`install` 字段用来指定安装脚本，如果有多个脚本，可以写成下面的形式。

```
install:  - command1  - command2
```

上面代码中，如果 `command1` 失败了，整个构建就会停下来，不再往下进行
如果不需要安装，即跳过安装阶段，就直接设为 `true`。

```
install: true
```

#### script 字段

`script` 字段用来配置构建或者测试脚本，如果有多个脚本，可以写成下面的形式。

```
script:  - command1  - command2
```

注意，`script` 与 `install` 不一样，如果 `command1` 失败，`command2` 会继续执行。但是，整个构建阶段的状态是失败。

如果 `command2` 只有在 `command1` 成功后才能执行，就要写成下面这样。

```
script: command1 && command2
```

## 三、构建

## 四、部署

现在脚本是由 Travis CI 来执行的，部署的时候，怎么让 Travis 有权限往 Github 提交代码呢？

Github 有提供一个 [Personal access tokens](https://github.blog/2013-05-16-personal-api-tokens/)，这个 Token 与 账号密码 以及 SSH Keys 同样具有 Github 写入能力。

前往 Github 帐号 Settings 页面，在左侧选择 `Personal Access Token`，然后在右侧面板点击 `“Generate new token”` 来新建一个 Token。需要注意的是，创建完的 Token 只有第一次可见，之后再访问就无法看见（只能看见他的名称），因此要保存好这个值。

[![travis-ci-2](https://neveryu.github.io/images/travis-ci-2.png)](https://neveryu.github.io/images/travis-ci-2.png)

那么，这个 Token 怎么使用呢。

### 方案一、

一个比较方便快捷的方式，是通过 Travis 网站，写在每个仓库的设置页面里，有一个 `Environment Variables` 的配置项，给我们的 Token 起一个名字 `gh_token` 添加进去。这样以来，脚本内部就可以使用这个环境变量了。
[![travis-ci-1](https://neveryu.github.io/images/travis-ci-3.png)](https://neveryu.github.io/images/travis-ci-3.png)
你可以在你脚本内部使用 `${gh_token}` 的形式来使用这个 Token 了。【当然了，你还可以添加其他的环境变量进去。】【[官方文档在这里](https://docs.travis-ci.com/user/environment-variables)】

使用 `Personal access tokens` 向 GitHub 提交代码的命令格式如下：

```
# ${GH_TOKEN} 对应就是 Personal access tokens ， GH_TOKEN 是环境变量名# ${GH_REF} 对应的是你的 Github 仓库地址，GH_REF 是变量名git push -f "https://${GH_TOKEN}@${GH_REF}" master:gh-pages
```

这里需要注意的是：
1、GitHub 生成的这个 Token ，只有生成的时候可以看到明文，后面就看不到明文了，所以你使用的时候最好一次操作成功。
2、Travis CI 中添加 Token 时，记得用密文，要不然在 `build log` 中是可以被看到的。

### 方案二、

你还可以使用 Travis CI 提供的加密工具来加密我们的这个 Token。加密原理机制如下：

[![travis-ci-encrypt](https://neveryu.github.io/images/travis-encrypt.png)](https://neveryu.github.io/images/travis-encrypt.png)

首先，安装 Ruby 的包 `travis` 。

```
# 安装 Travis CI 命令行工具$ gem install travis
```

然后，就可以用 `travis encrypt` 命令加密信息。
在项目的根目录下，执行下面的命令。

```
$ travis encrypt name=secretvalue
```

上面命令中，`gh_token` 是要加密的变量名，`secretvalue` 是要加密的变量值。执行以后，屏幕上会输出如下信息。

```
secure: "... encrypted data ..."
```

现在，就可以把这一行加入 `.travis.yml` 。

```
env:  global:    - GH_REF: github.com/Neveryu/xxxxx.git    - secure: "... entrypted data ..."
```

然后，脚本里面就可以使用环境变量 `gh_token` 了，Travis 会在运行时自动对它解密。

```
# ${gh_token} 对应就是 Personal access tokens ， gh_token 是环境变量名# ${GH_REF} 对应的是你的 Github 仓库地址，GH_REF 是变量名git push -f "https://${gh_token}@${GH_REF}" master:gh-pages
```

`travis encrypt` 命令的 `--add` 参数会把输出自动写入 `.travis.yml`，省掉了修改 `env` 字段的步骤。

```
$ travis encrypt name=secretvalue --add
```

详细信息请看[官方文档](https://docs.travis-ci.com/user/encryption-keys/)

可以参考我的 [vue-cms](https://github.com/Neveryu/vue-cms) 这个项目中的 `.travis.yml` 文件

## FAQ

### 如何显示 Status Image

[![Build Status](https://travis-ci.org/Neveryu/web-bookmarks.svg?branch=master)](https://travis-ci.org/Neveryu/web-bookmarks)

[![travis-ci-4](https://neveryu.github.io/images/travis-ci-4.png)](https://neveryu.github.io/images/travis-ci-4.png)

### 如何跳过自动构建

如果 commit 不想让 Travis 构建，那么就在 commit message 里加上 [ci skip] 就行了。

```
git commit -m "[ci skip] commit message"
```

### 权限问题

如果遇到脚本权限不够的提示或者问题，你可以给你的脚本加上权限：

```
chmod u+x deploy.sh
```

或者在 `.travis.yml` 里加：

```
before_install:  - chmod u+x deploy.sh
```

## 参考资料
