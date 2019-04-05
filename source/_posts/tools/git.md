---
title: Git 从入门到精通
categories: ['tools']
tags: ['tools', 'git']
date: 2017-12-09 11:39
---

# Git 从入门到精通

> :notebook: 本文已归档到：「[blog](https://github.com/dunwu/blog)」

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [Git 是什么？](#git-是什么)
    - [什么是版本控制？](#什么是版本控制)
    - [什么是分布式版本控制系统？](#什么是分布式版本控制系统)
    - [为什么使用 Git？](#为什么使用-git)
- [安装](#安装)
- [配置](#配置)
    - [用户信息](#用户信息)
    - [.gitignore](#gitignore)
- [原理](#原理)
    - [版本库](#版本库)
    - [哈希值](#哈希值)
    - [文件状态](#文件状态)
    - [工作区域](#工作区域)
- [命令](#命令)
    - [创建仓库](#创建仓库)
    - [添加修改](#添加修改)
    - [撤销修改](#撤销修改)
    - [更新与推送](#更新与推送)
    - [查看信息](#查看信息)
    - [分支](#分支)
    - [标签](#标签)
    - [合并与重置](#合并与重置)
    - [Github](#github)
- [最佳实践 Git Flow](#最佳实践-git-flow)
- [常见问题](#常见问题)
    - [编辑提交(editting commits)](#编辑提交editting-commits)
    - [暂存(Staging)](#暂存staging)
    - [未暂存(Unstaged)的内容](#未暂存unstaged的内容)
    - [分支(Branches)](#分支branches)
    - [Rebasing 和合并(Merging)](#rebasing-和合并merging)
    - [杂项(Miscellaneous Objects)](#杂项miscellaneous-objects)
    - [跟踪文件(Tracking Files)](#跟踪文件tracking-files)
    - [配置(Configuration)](#配置configuration)
    - [我不知道我做错了些什么](#我不知道我做错了些什么)
- [小结](#小结)
- [参考资料](#参考资料)

<!-- /TOC -->

## 简介

### Git 是什么？

Git 是一个开源的分布式版本控制系统。

### 什么是版本控制？

版本控制是一种记录一个或若干文件内容变化，以便将来查阅特定版本修订情况的系统。

### 什么是分布式版本控制系统？

介绍分布式版本控制系统前，有必要先了解一下传统的集中式版本控制系统。

**集中化的版本控制系统**，诸如 CVS，Subversion 等，都有一个单一的集中管理的服务器，保存所有文件的修订版本，而协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新。

这么做最显而易见的缺点是中央服务器的单点故障。如果宕机一小时，那么在这一小时内，谁都无法提交更新，也就无法协同工作。要是中央服务器的磁盘发生故障，碰巧没做备份，或者备份不够及时，就会有丢失数据的风险。最坏的情况是彻底丢失整个项目的所有历史更改记录。

<div align="center"><img src="https://git-scm.com/figures/18333fig0102-tn.png"/></div>

**分布式版本控制系统**的客户端并不只提取最新版本的文件快照，而是把代码仓库完整地镜像下来。这么一来，任何一处协同工作用的服务器发生故障，事后都可以用任何一个镜像出来的本地仓库恢复。因为每一次的提取操作，实际上都是一次对代码仓库的完整备份。

<div align="center"><img src="https://git-scm.com/figures/18333fig0103-tn.png"/></div>

### 为什么使用 Git？

Git 是分布式的。这是 Git 和其它非分布式的版本控制系统，例如 svn，cvs 等，最核心的区别。分布式带来以下好处：

**工作时不需要联网**

首先，分布式版本控制系统根本没有“中央服务器”，每个人的电脑上都是一个完整的版本库，这样，你工作的时候，就不需要联网了，因为版本库就在你自己的电脑上。既然每个人电脑上都有一个完整的版本库，那多个人如何协作呢？比方说你在自己电脑上改了文件 A，你的同事也在他的电脑上改了文件 A，这时，你们俩之间只需把各自的修改推送给对方，就可以互相看到对方的修改了。

**更加安全**

集中式版本控制系统，一旦中央服务器出了问题，所有人都无法工作。

分布式版本控制系统，每个人电脑中都有完整的版本库，所以某人的机器挂了，并不影响其它人。

## 安装

**Debian/Ubuntu 环境安装**

如果你使用的系统是 Debian/Ubuntu ， 安装命令为：

```bash
$ apt-get install libcurl4-gnutls-dev libexpat1-dev gettext \
> libz-dev libssl-dev
$ apt-get install git-core
$ git --version
git version 1.8.1.2
```

**Centos/RedHat 环境安装**

如果你使用的系统是 Centos/RedHat ，安装命令为：

```bash
$ yum install curl-devel expat-devel gettext-devel \
> openssl-devel zlib-devel
$ yum -y install git-core
$ git --version
git version 1.7.1
```

**Windows 环境安装**

在[Git 官方下载地址](https://git-scm.com/downloads)下载 exe 安装包。按照安装向导安装即可。

建议安装 Git Bash 这个 git 的命令行工具。

**Mac 环境安装**

在[Git 官方下载地址](https://git-scm.com/downloads)下载 mac 安装包。按照安装向导安装即可。

## 配置

Git 自带一个 `git config` 的工具来帮助设置控制 Git 外观和行为的配置变量。 这些变量存储在三个不同的位置：

1. `/etc/gitconfig` 文件: 包含系统上每一个用户及他们仓库的通用配置。 如果使用带有 `--system` 选项的 `git config` 时，它会从此文件读写配置变量。
2. `\~/.gitconfig` 或 `\~/.config/git/config` 文件：只针对当前用户。 可以传递 `--global` 选项让 Git 读写此文件。
3. 当前使用仓库的 Git 目录中的 `config` 文件（就是 `.git/config`）：针对该仓库。

每一个级别覆盖上一级别的配置，所以 `.git/config` 的配置变量会覆盖 `/etc/gitconfig` 中的配置变量。

在 Windows 系统中，Git 会查找 `$HOME` 目录下（一般情况下是 `C:\Users\$USER`）的 `.gitconfig` 文件。 Git 同样也会寻找 `/etc/gitconfig` 文件，但只限于 MSys 的根目录下，即安装 Git 时所选的目标位置。

### 用户信息

当安装完 Git 应该做的第一件事就是设置你的用户名称与邮件地址。 这样做很重要，因为每一个 Git 的提交都会使用这些信息，并且它会写入到你的每一次提交中，不可更改：

```bash
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

再次强调，如果使用了 `--global` 选项，那么该命令只需要运行一次，因为之后无论你在该系统上做任何事情， Git 都会使用那些信息。 当你想针对特定项目使用不同的用户名称与邮件地址时，可以在那个项目目录下运行没有 `--global` 选项的命令来配置。

很多 GUI 工具都会在第一次运行时帮助你配置这些信息。

### .gitignore

`.gitignore` 文件可能从字面含义也不难猜出：这个文件里配置的文件或目录，会自动被 git 所忽略，不纳入版本控制。

在日常开发中，我们的项目经常会产生一些临时文件，如编译 Java 产生的 `*.class` 文件，又或是 IDE 自动生成的隐藏目录（Intellij 的 `.idea` 目录、Eclipse 的 `.settings` 目录等）等等。这些文件或目录实在没必要纳入版本管理。在这种场景下，你就需要用到 `.gitignore` 配置来过滤这些文件或目录。

配置的规则很简单，也没什么可说的，看几个例子，自然就明白了。

这里推荐一下 Github 的开源项目：https://github.com/github/gitignore

在这里，你可以找到很多常用的模板，如：Java、Nodejs、C++ 的 `.gitignore` 模板等等。

## 原理

个人认为，对于 Git 这个版本工具，再不了解原理的情况下，直接去学习命令行，可能会一头雾水。所以，本文特意将原理放在命令使用章节之前讲解。

### 版本库

当你一个项目到本地或创建一个 git 项目，项目目录下会有一个隐藏的 `.git` 子目录。这个目录是 git 用来跟踪管理版本库的，千万不要手动修改。

### 哈希值

Git 中所有数据在存储前都计算校验和，然后以校验和来引用。 这意味着不可能在 Git 不知情时更改任何文件内容或目录内容。 这个功能建构在 Git 底层，是构成 Git 哲学不可或缺的部分。 若你在传送过程中丢失信息或损坏文件，Git 就能发现。

Git 用以计算校验和的机制叫做 SHA-1 散列（hash，哈希）。 这是一个由 40 个十六进制字符（0-9 和 a-f）组成字符串，基于 Git 中文件的内容或目录结构计算出来。 SHA-1 哈希看起来是这样：

```
24b9da6552252987aa493b52f8696cd6d3b00373
```

Git 中使用这种哈希值的情况很多，你将经常看到这种哈希值。 实际上，Git 数据库中保存的信息都是以文件内容的哈希值来索引，而不是文件名。

### 文件状态

在 GIt 中，你的文件可能会处于三种状态之一：

- **已修改（modified）** - 已修改表示修改了文件，但还没保存到数据库中。
- **已暂存（staged）** - 已暂存表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中。
- **已提交（committed）** - 已提交表示数据已经安全的保存在本地数据库中。

### 工作区域

与文件状态对应的，不同状态的文件在 Git 中处于不同的工作区域。

- **工作区（working）** - 当你 `git clone` 一个项目到本地，相当于在本地克隆了项目的一个副本。工作区是对项目的某个版本独立提取出来的内容。 这些从 Git 仓库的压缩数据库中提取出来的文件，放在磁盘上供你使用或修改。
- **暂存区（staging）** - 暂存区是一个文件，保存了下次将提交的文件列表信息，一般在 Git 仓库目录中。 有时候也被称作`‘索引’'，不过一般说法还是叫暂存区。
- **本地仓库（local）** - 提交更新，找到暂存区域的文件，将快照永久性存储到 Git 本地仓库。
- **远程仓库（remote）** - 以上几个工作区都是在本地。为了让别人可以看到你的修改，你需要将你的更新推送到远程仓库。同理，如果你想同步别人的修改，你需要从远程仓库拉取更新。

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/web/git/git-theory.png"/></div>

## 命令

国外网友制作了一张 Git Cheat Sheet，总结很精炼，各位不妨收藏一下。

本节选择性介绍 git 中比较常用的命令行场景。

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/web/git/git-cheat-sheet.png"/></div>

### 创建仓库

克隆一个已创建的仓库：

```bash
# 通过 SSH
$ git clone ssh://user@domain.com/repo.git

#通过 HTTP
$ git clone http://domain.com/user/repo.git
```

创建一个新的本地仓库：

```bash
$ git init
```

### 添加修改

添加修改到暂存区：

```bash
# 把指定文件添加到暂存区
$ git add xxx

# 把当前所有修改添加到暂存区
$ git add .

# 把所有修改添加到暂存区
$ git add -A
```

提交修改到本地仓库：

```bash
# 提交本地的所有修改
$ git commit -a

# 提交之前已标记的变化
$ git commit

# 附加消息提交
$ git commit -m 'commit message'
```

#### 储藏

有时，我们需要在同一个项目的不同分支上工作。当需要切换分支时，偏偏本地的工作还没有完成，此时，提交修改显得不严谨，但是不提交代码又无法切换分支。这时，你可以使用 `git stash` 将本地的修改内容作为草稿储藏起来。

官方称之为储藏，但我个人更喜欢称之为存草稿。

```bash
# 1. 将修改作为当前分支的草稿保存
$ git stash

# 2. 查看草稿列表
$ git stash list
stash@{0}: WIP on master: 6fae349 :memo: Writing docs.

# 3.1 删除草稿
$ git stash drop stash@{0}

# 3.2 读取草稿
$ git stash apply stash@{0}
```

### 撤销修改

撤销本地修改：

```bash
# 移除缓存区的所有文件（i.e. 撤销上次git add）
$ git reset HEAD

# 将HEAD重置到上一次提交的版本，并将之后的修改标记为未添加到缓存区的修改
$ git reset <commit>

# 将HEAD重置到上一次提交的版本，并保留未提交的本地修改
$ git reset --keep <commit>

# 放弃工作目录下的所有修改
$ git reset --hard HEAD

# 将HEAD重置到指定的版本，并抛弃该版本之后的所有修改
$ git reset --hard <commit-hash>

# 用远端分支强制覆盖本地分支
$ git reset --hard <remote/branch> e.g., upstream/master, origin/my-feature

# 放弃某个文件的所有本地修改
$ git checkout HEAD <file>
```

删除添加`.gitignore`文件前错误提交的文件：

```bash
$ git rm -r --cached .
$ git add .
$ git commit -m "remove xyz file"
```

撤销远程修改（创建一个新的提交，并回滚到指定版本）：

```bash
$ git revert <commit-hash>
```

彻底删除指定版本：

```bash
# 执行下面命令后，commit-hash 提交后的记录都会被彻底删除，使用需谨慎
$ git reset --hard <commit-hash>
$ git push -f
```

### 更新与推送

更新：

```bash
# 下载远程端版本，但不合并到HEAD中
$ git fetch <remote>

# 将远程端版本合并到本地版本中
$ git pull origin master

# 以rebase方式将远端分支与本地合并
$ git pull --rebase <remote> <branch>
```

推送：

```bash
# 将本地版本推送到远程端
$ git push remote <remote> <branch>

# 删除远程端分支
$ git push <remote> :<branch> (since Git v1.5.0)
$ git push <remote> --delete <branch> (since Git v1.7.0)

# 发布标签
$ git push --tags
```

### 查看信息

显示工作路径下已修改的文件：

```bash
$ git status
```

显示与上次提交版本文件的不同：

```bash
$ git diff
```

显示提交历史：

```bash
# 从最新提交开始，显示所有的提交记录（显示hash， 作者信息，提交的标题和时间）
$ git log

# 显示某个用户的所有提交
$ git log --author="username"

# 显示某个文件的所有修改
$ git log -p <file>
```

显示搜索内容：

```bash
# 从当前目录的所有文件中查找文本内容
$ git grep "Hello"

# 在某一版本中搜索文本
$ git grep "Hello" v2.5
```

### 分支

增删查分支：

```bash
# 列出所有的分支
$ git branch

# 列出所有的远端分支
$ git branch -r

# 基于当前分支创建新分支
$ git branch <new-branch>

# 基于远程分支创建新的可追溯的分支
$ git branch --track <new-branch> <remote-branch>

# 删除本地分支
$ git branch -d <branch>

# 强制删除本地分支，将会丢失未合并的修改
$ git branch -D <branch>
```

切换分支：

```bash
# 切换分支
$ git checkout <branch>

# 创建并切换到新分支
$ git checkout -b <branch>
```

### 标签

```bash
# 给当前版本打标签
$ git tag <tag-name>

# 给当前版本打标签并附加消息
$ git tag -a <tag-name>
```

### 合并与重置

> merge 与 rebase 虽然是 git 常用功能，但是强烈建议不要使用 git 命令来完成这项工作。
>
> 因为如果出现代码冲突，在没有代码比对工具的情况下，实在太艰难了。
>
> 你可以考虑使用各种 Git GUI 工具。

合并：

```bash
# 将分支合并到当前HEAD中
$ git merge <branch>
```

重置：

```bash
# 将当前HEAD版本重置到分支中，请勿重置已发布的提交
$ git rebase <branch>
```

### Github

Github 作为最著名的代码开源协作社区，在程序员圈想必无人不知，无人不晓。

这里不赘述 Github 的用法，确实有不会用的新手同学，可以参考官方教程：https://guides.github.com/

#### clone 方式

Git 支持三种协议：HTTPS / SSH / GIT

而 Github 上支持 HTTPS 和 SSH。

HTTPS 这种方式要求你每次 push 时都要输入用户名、密码，有些繁琐。

而 SSH 要求你本地生成证书，然后在你的 Github 账户中注册。第一次配置麻烦是麻烦了点，但是以后就免去了每次 push 需要输入用户名、密码的繁琐。

<div align="center"><img src="http://upload-images.jianshu.io/upload_images/3101171-66f60822aeb2c21c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"/></div>

以下介绍以下，如何生成证书，以及在 Github 中注册。

#### 生成 SSH 公钥

如前所述，许多 Git 服务器都使用 SSH 公钥进行认证。 为了向 Git 服务器提供 SSH 公钥，如果某系统用户尚未拥有密钥，必须事先为其生成一份。 这个过程在所有操作系统上都是相似的。 首先，你需要确认自己是否已经拥有密钥。 默认情况下，用户的 SSH 密钥存储在其 `\~/.ssh` 目录下。 进入该目录并列出其中内容，你便可以快速确认自己是否已拥有密钥：

```bash
$ cd ~/.ssh
$ ls
authorized_keys2  id_dsa       known_hosts
config            id_dsa.pub
```

我们需要寻找一对以 `id_dsa` 或 `id_rsa` 命名的文件，其中一个带有 `.pub` 扩展名。 `.pub` 文件是你的公钥，另一个则是私钥。 如果找不到这样的文件（或者根本没有 `.ssh` 目录），你可以通过运行 `ssh-keygen` 程序来创建它们。在 Linux/Mac 系统中，`ssh-keygen` 随 SSH 软件包提供；在 Windows 上，该程序包含于 MSysGit 软件包中。

```bash
$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/schacon/.ssh/id_rsa):
Created directory '/home/schacon/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/schacon/.ssh/id_rsa.
Your public key has been saved in /home/schacon/.ssh/id_rsa.pub.
The key fingerprint is:
d0:82:24:8e:d7:f1:bb:9b:33:53:96:93:49:da:9b:e3 schacon@mylaptop.local
```

首先 `ssh-keygen` 会确认密钥的存储位置（默认是 `.ssh/id_rsa`），然后它会要求你输入两次密钥口令。如果你不想在使用密钥时输入口令，将其留空即可。

现在，进行了上述操作的用户需要将各自的公钥发送给任意一个 Git 服务器管理员（假设服务器正在使用基于公钥的 SSH 验证设置）。 他们所要做的就是复制各自的 `.pub` 文件内容，并将其通过邮件发送。 公钥看起来是这样的：

```bash
$ cat ~/.ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
NrRFi9wrf+M7Q== schacon@mylaptop.local
```

在你的 Github 账户中，依次点击 **Settings** > **SSH and GPG keys** > **New SSH key**

然后，将上面生成的公钥内容粘贴到 `Key` 编辑框并保存。至此大功告成。

后面，你在克隆你的 Github 项目时使用 SSH 方式即可。

如果觉得我的讲解还不够细致，可以参考：https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/

## 最佳实践 Git Flow

> 详细内容，可以参考这篇文章：[Git 在团队中的最佳实践--如何正确使用 Git Flow](http://www.cnblogs.com/cnblogsfans/p/5075073.html)

Git 在实际开发中的最佳实践策略 Git Flow 可以归纳为以下：

- **`master` 分支** - 也就是我们经常使用的主线分支，这个分支是最近发布到生产环境的代码，这个分支只能从其他分支合并，不能在这个分支直接修改。
- **`develop` 分支** - 这个分支是我们的主开发分支，包含所有要发布到下一个 release 的代码，这个分支主要是从其他分支合并代码过来，比如 feature 分支。
- **`feature` 分支** - 这个分支主要是用来开发一个新的功能，一旦开发完成，我们合并回 develop 分支进入下一个 release。
- **`release` 分支** - 当你需要一个发布一个新 release 的时候，我们基于 Develop 分支创建一个 release 分支，完成 release 后，我们合并到 master 和 develop 分支。
- **`hotfix` 分支** - 当我们在 master 发现新的 Bug 时候，我们需要创建一个 hotfix, 完成 hotfix 后，我们合并回 master 和 develop 分支，所以 hotfix 的改动会进入下一个 release。

## 常见问题

### 编辑提交(editting commits)

#### 我刚才提交了什么

如果你用 `git commit -a` 提交了一次变化(changes)，而你又不确定到底这次提交了哪些内容。 你就可以用下面的命令显示当前`HEAD`上的最近一次的提交(commit):

```sh
(master)$ git show
```

或者

```sh
$ git log -n1 -p
```

#### 我的提交信息(commit message)写错了

如果你的提交信息(commit message)写错了且这次提交(commit)还没有推(push), 你可以通过下面的方法来修改提交信息(commit message):

```sh
$ git commit --amend
```

这会打开你的默认编辑器, 在这里你可以编辑信息. 另一方面, 你也可以用一条命令一次完成:

```sh
$ git commit --amend -m 'xxxxxxx'
```

如果你已经推(push)了这次提交(commit), 你可以修改这次提交(commit)然后强推(force push), 但是不推荐这么做。

#### 我提交(commit)里的用户名和邮箱不对

如果这只是单个提交(commit)，修改它：

```sh
$ git commit --amend --author "New Authorname <authoremail@mydomain.com>"
```

如果你需要修改所有历史, 参考 'git filter-branch'的指南页.

#### 我想从一个提交(commit)里移除一个文件

通过下面的方法，从一个提交(commit)里移除一个文件:

```sh
$ git checkout HEAD^ myfile
$ git add -A
$ git commit --amend
```

这将非常有用，当你有一个开放的补丁(open patch)，你往上面提交了一个不必要的文件，你需要强推(force push)去更新这个远程补丁。

#### 我想删除我的的最后一次提交(commit)

如果你需要删除推了的提交(pushed commits)，你可以使用下面的方法。可是，这会不可逆的改变你的历史，也会搞乱那些已经从该仓库拉取(pulled)了的人的历史。简而言之，如果你不是很确定，千万不要这么做。

```sh
$ git reset HEAD^ --hard
$ git push -f [remote] [branch]
```

如果你还没有推到远程, 把 Git 重置(reset)到你最后一次提交前的状态就可以了(同时保存暂存的变化):

```
(my-branch*)$ git reset --soft HEAD@{1}

```

这只能在没有推送之前有用. 如果你已经推了, 唯一安全能做的是 `git revert SHAofBadCommit`， 那会创建一个新的提交(commit)用于撤消前一个提交的所有变化(changes)； 或者, 如果你推的这个分支是 rebase-safe 的 (例如： 其它开发者不会从这个分支拉), 只需要使用 `git push -f`； 更多, 请参考 [the above section](#deleteremove-last-pushed-commit)。

#### 删除任意提交(commit)

同样的警告：不到万不得已的时候不要这么做.

```sh
$ git rebase --onto SHA1_OF_BAD_COMMIT^ SHA1_OF_BAD_COMMIT
$ git push -f [remote] [branch]
```

或者做一个 [交互式 rebase](#interactive-rebase) 删除那些你想要删除的提交(commit)里所对应的行。

#### 我尝试推一个修正后的提交(amended commit)到远程，但是报错：

```sh
To https://github.com/yourusername/repo.git
! [rejected]        mybranch -> mybranch (non-fast-forward)
error: failed to push some refs to 'https://github.com/tanay1337/webmaker.org.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

注意, rebasing(见下面)和修正(amending)会用一个**新的提交(commit)代替旧的**, 所以如果之前你已经往远程仓库上推过一次修正前的提交(commit)，那你现在就必须强推(force push) (`-f`)。 注意 &ndash; _总是_ 确保你指明一个分支!

```sh
(my-branch)$ git push origin mybranch -f
```

一般来说, **要避免强推**. 最好是创建和推(push)一个新的提交(commit)，而不是强推一个修正后的提交。后者会使那些与该分支或该分支的子分支工作的开发者，在源历史中产生冲突。

#### 我意外的做了一次硬重置(hard reset)，我想找回我的内容

如果你意外的做了 `git reset --hard`, 你通常能找回你的提交(commit), 因为 Git 对每件事都会有日志，且都会保存几天。

```sh
(master)$ git reflog
```

你将会看到一个你过去提交(commit)的列表, 和一个重置的提交。 选择你想要回到的提交(commit)的 SHA，再重置一次:

```sh
(master)$ git reset --hard SHA1234
```

这样就完成了。

### 暂存(Staging)

#### 我需要把暂存的内容添加到上一次的提交(commit)

```sh
(my-branch*)$ git commit --amend

```

#### 我想要暂存一个新文件的一部分，而不是这个文件的全部

一般来说, 如果你想暂存一个文件的一部分, 你可这样做:

```sh
$ git add --patch filename.x
```

`-p` 简写。这会打开交互模式， 你将能够用 `s` 选项来分隔提交(commit)； 然而, 如果这个文件是新的, 会没有这个选择， 添加一个新文件时, 这样做:

```sh
$ git add -N filename.x
```

然后, 你需要用 `e` 选项来手动选择需要添加的行，执行 `git diff --cached` 将会显示哪些行暂存了哪些行只是保存在本地了。

#### 我想把在一个文件里的变化(changes)加到两个提交(commit)里

`git add` 会把整个文件加入到一个提交. `git add -p` 允许交互式的选择你想要提交的部分.

#### 我想把暂存的内容变成未暂存，把未暂存的内容暂存起来

这个有点困难， 我能想到的最好的方法是先 stash 未暂存的内容， 然后重置(reset)，再 pop 第一步 stashed 的内容, 最后再 add 它们。

```sh
$ git stash -k
$ git reset --hard
$ git stash pop
$ git add -A
```

### 未暂存(Unstaged)的内容

#### 我想把未暂存的内容移动到一个新分支

```sh
$ git checkout -b my-branch
```

#### 我想把未暂存的内容移动到另一个已存在的分支

```sh
$ git stash
$ git checkout my-branch
$ git stash pop
```

#### 我想丢弃本地未提交的变化(uncommitted changes)

如果你只是想重置源(origin)和你本地(local)之间的一些提交(commit)，你可以：

```sh
## one commit
(my-branch)$ git reset --hard HEAD^
## two commits
(my-branch)$ git reset --hard HEAD^^
## four commits
(my-branch)$ git reset --hard HEAD~4
## or
(master)$ git checkout -f
```

重置某个特殊的文件, 你可以用文件名做为参数:

```sh
$ git reset filename
```

#### 我想丢弃某些未暂存的内容

如果你想丢弃工作拷贝中的一部分内容，而不是全部。

签出(checkout)不需要的内容，保留需要的。

```sh
$ git checkout -p
## Answer y to all of the snippets you want to drop
```

另外一个方法是使用 `stash`， Stash 所有要保留下的内容, 重置工作拷贝, 重新应用保留的部分。

```sh
$ git stash -p
## Select all of the snippets you want to save
$ git reset --hard
$ git stash pop
```

或者, stash 你不需要的部分, 然后 stash drop。

```sh
$ git stash -p
## Select all of the snippets you don't want to save
$ git stash drop
```

### 分支(Branches)

#### 我从错误的分支拉取了内容，或把内容拉取到了错误的分支

这是另外一种使用 `git reflog` 情况，找到在这次错误拉(pull) 之前 HEAD 的指向。

```sh
(master)$ git reflog
ab7555f HEAD@{0}: pull origin wrong-branch: Fast-forward
c5bc55a HEAD@{1}: checkout: checkout message goes here
```

重置分支到你所需的提交(desired commit):

```sh
$ git reset --hard c5bc55a
```

完成。

#### 我想扔掉本地的提交(commit)，以便我的分支与远程的保持一致

先确认你没有推(push)你的内容到远程。

`git status` 会显示你领先(ahead)源(origin)多少个提交:

```sh
(my-branch)$ git status
## On branch my-branch
## Your branch is ahead of 'origin/my-branch' by 2 commits.
##   (use "git push" to publish your local commits)
#
```

一种方法是:

```sh
(master)$ git reset --hard origin/my-branch
```

#### 我需要提交到一个新分支，但错误的提交到了 master

在 master 下创建一个新分支，不切换到新分支,仍在 master 下:

```sh
(master)$ git branch my-branch
```

把 master 分支重置到前一个提交:

```sh
(master)$ git reset --hard HEAD^
```

`HEAD^` 是 `HEAD^1` 的简写，你可以通过指定要设置的`HEAD`来进一步重置。

或者, 如果你不想使用 `HEAD^`, 找到你想重置到的提交(commit)的 hash(`git log` 能够完成)， 然后重置到这个 hash。 使用`git push` 同步内容到远程。

例如, master 分支想重置到的提交的 hash 为`a13b85e`:

```sh
(master)$ git reset --hard a13b85e
HEAD is now at a13b85e
```

签出(checkout)刚才新建的分支继续工作:

```sh
(master)$ git checkout my-branch
```

#### 我想保留来自另外一个 ref-ish 的整个文件

假设你正在做一个原型方案(原文为 working spike (see note)), 有成百的内容，每个都工作得很好。现在, 你提交到了一个分支，保存工作内容:

```sh
(solution)$ git add -A && git commit -m "Adding all changes from this spike into one big commit."
```

当你想要把它放到一个分支里 (可能是`feature`, 或者 `develop`), 你关心是保持整个文件的完整，你想要一个大的提交分隔成比较小。

假设你有:

- 分支 `solution`, 拥有原型方案， 领先 `develop` 分支。
- 分支 `develop`, 在这里你应用原型方案的一些内容。

我去可以通过把内容拿到你的分支里，来解决这个问题:

```sh
(develop)$ git checkout solution -- file1.txt
```

这会把这个文件内容从分支 `solution` 拿到分支 `develop` 里来:

```sh
## On branch develop
## Your branch is up-to-date with 'origin/develop'.
## Changes to be committed:
##  (use "git reset HEAD <file>..." to unstage)
#
##        modified:   file1.txt
```

然后, 正常提交。

Note: Spike solutions are made to analyze or solve the problem. These solutions are used for estimation and discarded once everyone gets clear visualization of the problem. \~ [Wikipedia](https://en.wikipedia.org/wiki/Extreme_programming_practices).

#### 我把几个提交(commit)提交到了同一个分支，而这些提交应该分布在不同的分支里

假设你有一个`master`分支， 执行`git log`, 你看到你做过两次提交:

```sh
(master)$ git log

commit e3851e817c451cc36f2e6f3049db528415e3c114
Author: Alex Lee <alexlee@example.com>
Date:   Tue Jul 22 15:39:27 2014 -0400

    Bug #21 - Added CSRF protection

commit 5ea51731d150f7ddc4a365437931cd8be3bf3131
Author: Alex Lee <alexlee@example.com>
Date:   Tue Jul 22 15:39:12 2014 -0400

    Bug #14 - Fixed spacing on title

commit a13b85e984171c6e2a1729bb061994525f626d14
Author: Aki Rose <akirose@example.com>
Date:   Tue Jul 21 01:12:48 2014 -0400

    First commit
```

让我们用提交 hash(commit hash)标记 bug (`e3851e8` for #21, `5ea5173` for #14).

首先, 我们把`master`分支重置到正确的提交(`a13b85e`):

```sh
(master)$ git reset --hard a13b85e
HEAD is now at a13b85e
```

现在, 我们对 bug #21 创建一个新的分支:

```sh
(master)$ git checkout -b 21
(21)$
```

接着, 我们用 _cherry-pick_ 把对 bug #21 的提交放入当前分支。 这意味着我们将应用(apply)这个提交(commit)，仅仅这一个提交(commit)，直接在 HEAD 上面。

```sh
(21)$ git cherry-pick e3851e8
```

这时候, 这里可能会产生冲突， 参见[交互式 rebasing 章](#interactive-rebase) [**冲突节**](#merge-conflict) 解决冲突.

再者， 我们为 bug #14 创建一个新的分支, 也基于`master`分支

```sh
(21)$ git checkout master
(master)$ git checkout -b 14
(14)$
```

最后, 为 bug #14 执行 `cherry-pick`:

```sh
(14)$ git cherry-pick 5ea5173
```

#### 我想删除上游(upstream)分支被删除了的本地分支

一旦你在 github 上面合并(merge)了一个 pull request, 你就可以删除你 fork 里被合并的分支。 如果你不准备继续在这个分支里工作, 删除这个分支的本地拷贝会更干净，使你不会陷入工作分支和一堆陈旧分支的混乱之中。

```sh
$ git fetch -p
```

#### 我不小心删除了我的分支

如果你定期推送到远程, 多数情况下应该是安全的，但有些时候还是可能删除了还没有推到远程的分支。 让我们先创建一个分支和一个新的文件:

```sh
(master)$ git checkout -b my-branch
(my-branch)$ git branch
(my-branch)$ touch foo.txt
(my-branch)$ ls
README.md foo.txt
```

添加文件并做一次提交

```sh
(my-branch)$ git add .
(my-branch)$ git commit -m 'foo.txt added'
(my-branch)$ foo.txt added
 1 files changed, 1 insertions(+)
 create mode 100644 foo.txt
(my-branch)$ git log

commit 4e3cd85a670ced7cc17a2b5d8d3d809ac88d5012
Author: siemiatj <siemiatj@example.com>
Date:   Wed Jul 30 00:34:10 2014 +0200

    foo.txt added

commit 69204cdf0acbab201619d95ad8295928e7f411d5
Author: Kate Hudson <katehudson@example.com>
Date:   Tue Jul 29 13:14:46 2014 -0400

    Fixes #6: Force pushing after amending commits
```

现在我们切回到主(master)分支，‘不小心的’删除`my-branch`分支

```sh
(my-branch)$ git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'.
(master)$ git branch -D my-branch
Deleted branch my-branch (was 4e3cd85).
(master)$ echo oh noes, deleted my branch!
oh noes, deleted my branch!
```

在这时候你应该想起了`reflog`, 一个升级版的日志，它存储了仓库(repo)里面所有动作的历史。

```
(master)$ git reflog
69204cd HEAD@{0}: checkout: moving from my-branch to master
4e3cd85 HEAD@{1}: commit: foo.txt added
69204cd HEAD@{2}: checkout: moving from master to my-branch
```

正如你所见，我们有一个来自删除分支的提交 hash(commit hash)，接下来看看是否能恢复删除了的分支。

```sh
(master)$ git checkout -b my-branch-help
Switched to a new branch 'my-branch-help'
(my-branch-help)$ git reset --hard 4e3cd85
HEAD is now at 4e3cd85 foo.txt added
(my-branch-help)$ ls
README.md foo.txt
```

看! 我们把删除的文件找回来了。 Git 的 `reflog` 在 rebasing 出错的时候也是同样有用的。

#### 我想删除一个分支

删除一个远程分支:

```sh
(master)$ git push origin --delete my-branch
```

你也可以:

```sh
(master)$ git push origin :my-branch
```

删除一个本地分支:

```sh
(master)$ git branch -D my-branch
```

#### 我想从别人正在工作的远程分支签出(checkout)一个分支

首先, 从远程拉取(fetch) 所有分支:

```sh
(master)$ git fetch --all
```

假设你想要从远程的`daves`分支签出到本地的`daves`

```sh
(master)$ git checkout --track origin/daves
Branch daves set up to track remote branch daves from origin.
Switched to a new branch 'daves'
```

(`--track` 是 `git checkout -b [branch] [remotename]/[branch]` 的简写)

这样就得到了一个`daves`分支的本地拷贝, 任何推过(pushed)的更新，远程都能看到.

### Rebasing 和合并(Merging)

#### 我想撤销 rebase/merge

你可以合并(merge)或 rebase 了一个错误的分支, 或者完成不了一个进行中的 rebase/merge。 Git 在进行危险操作的时候会把原始的 HEAD 保存在一个叫 ORIG_HEAD 的变量里, 所以要把分支恢复到 rebase/merge 前的状态是很容易的。

```sh
(my-branch)$ git reset --hard ORIG_HEAD
```

#### 我已经 rebase 过, 但是我不想强推(force push)

不幸的是，如果你想把这些变化(changes)反应到远程分支上，你就必须得强推(force push)。 是因你快进(Fast forward)了提交，改变了 Git 历史, 远程分支不会接受变化(changes)，除非强推(force push)。这就是许多人使用 merge 工作流, 而不是 rebasing 工作流的主要原因之一， 开发者的强推(force push)会使大的团队陷入麻烦。使用时需要注意，一种安全使用 rebase 的方法是，不要把你的变化(changes)反映到远程分支上, 而是按下面的做:

```sh
(master)$ git checkout my-branch
(my-branch)$ git rebase -i master
(my-branch)$ git checkout master
(master)$ git merge --ff-only my-branch
```

更多, 参见 [this SO thread](http://stackoverflow.com/questions/11058312/how-can-i-use-git-rebase-without-requiring-a-forced-push).

#### 我需要组合(combine)几个提交(commit)

假设你的工作分支将会做对于 `master` 的 pull-request。 一般情况下你不关心提交(commit)的时间戳，只想组合 _所有_ 提交(commit) 到一个单独的里面, 然后重置(reset)重提交(recommit)。 确保主(master)分支是最新的和你的变化都已经提交了, 然后:

```sh
(my-branch)$ git reset --soft master
(my-branch)$ git commit -am "New awesome feature"
```

如果你想要更多的控制, 想要保留时间戳, 你需要做交互式 rebase (interactive rebase):

```sh
(my-branch)$ git rebase -i master
```

如果没有相对的其它分支， 你将不得不相对自己的`HEAD` 进行 rebase。 例如：你想组合最近的两次提交(commit), 你将相对于`HEAD\~2` 进行 rebase， 组合最近 3 次提交(commit), 相对于`HEAD\~3`, 等等。

```sh
(master)$ git rebase -i HEAD~2
```

在你执行了交互式 rebase 的命令(interactive rebase command)后, 你将在你的编辑器里看到类似下面的内容:

```vim
pick a9c8a1d Some refactoring
pick 01b2fd8 New awesome feature
pick b729ad5 fixup
pick e3851e8 another fix

## Rebase 8074d12..b729ad5 onto 8074d12
#
## Commands:
##  p, pick = use commit
##  r, reword = use commit, but edit the commit message
##  e, edit = use commit, but stop for amending
##  s, squash = use commit, but meld into previous commit
##  f, fixup = like "squash", but discard this commit's log message
##  x, exec = run command (the rest of the line) using shell
#
## These lines can be re-ordered; they are executed from top to bottom.
#
## If you remove a line here THAT COMMIT WILL BE LOST.
#
## However, if you remove everything, the rebase will be aborted.
#
## Note that empty commits are commented out
```

所有以 `#` 开头的行都是注释, 不会影响 rebase.

然后，你可以用任何上面命令列表的命令替换 `pick`, 你也可以通过删除对应的行来删除一个提交(commit)。

例如, 如果你想 **单独保留最旧(first)的提交(commit),组合所有剩下的到第二个里面**, 你就应该编辑第二个提交(commit)后面的每个提交(commit) 前的单词为 `f`:

```vim
pick a9c8a1d Some refactoring
pick 01b2fd8 New awesome feature
f b729ad5 fixup
f e3851e8 another fix
```

如果你想组合这些提交(commit) **并重命名这个提交(commit)**, 你应该在第二个提交(commit)旁边添加一个`r`，或者更简单的用`s` 替代 `f`:

```vim
pick a9c8a1d Some refactoring
pick 01b2fd8 New awesome feature
s b729ad5 fixup
s e3851e8 another fix
```

你可以在接下来弹出的文本提示框里重命名提交(commit)。

```vim
Newer, awesomer features

## Please enter the commit message for your changes. Lines starting
## with '#' will be ignored, and an empty message aborts the commit.
## rebase in progress; onto 8074d12
## You are currently editing a commit while rebasing branch 'master' on '8074d12'.
#
## Changes to be committed:
#	modified:   README.md
#

```

如果成功了, 你应该看到类似下面的内容:

```sh
(master)$ Successfully rebased and updated refs/heads/master.
```

##### 安全合并(merging)策略

`--no-commit` 执行合并(merge)但不自动提交, 给用户在做提交前检查和修改的机会。 `no-ff` 会为特性分支(feature branch)的存在过留下证据, 保持项目历史一致。

```sh
(master)$ git merge --no-ff --no-commit my-branch
```

##### 我需要将一个分支合并成一个提交(commit)

```sh
(master)$ git merge --squash my-branch
```

##### 我只想组合(combine)未推的提交(unpushed commit)

有时候，在将数据推向上游之前，你有几个正在进行的工作提交(commit)。这时候不希望把已经推(push)过的组合进来，因为其他人可能已经有提交(commit)引用它们了。

```sh
(master)$ git rebase -i @{u}
```

这会产生一次交互式的 rebase(interactive rebase), 只会列出没有推(push)的提交(commit)， 在这个列表时进行 reorder/fix/squash 都是安全的。

#### 检查是否分支上的所有提交(commit)都合并(merge)过了

检查一个分支上的所有提交(commit)是否都已经合并(merge)到了其它分支, 你应该在这些分支的 head(或任何 commits)之间做一次 diff:

```sh
(master)$ git log --graph --left-right --cherry-pick --oneline HEAD...feature/120-on-scroll
```

这会告诉你在一个分支里有而另一个分支没有的所有提交(commit), 和分支之间不共享的提交(commit)的列表。 另一个做法可以是:

```sh
(master)$ git log master ^feature/120-on-scroll --no-merges
```

#### 交互式 rebase(interactive rebase)可能出现的问题

##### 这个 rebase 编辑屏幕出现'noop'

如果你看到的是这样:

```
noop
```

这意味着你 rebase 的分支和当前分支在同一个提交(commit)上, 或者 _领先(ahead)_ 当前分支。 你可以尝试:

- 检查确保主(master)分支没有问题
- rebase `HEAD\~2` 或者更早

##### 有冲突的情况

如果你不能成功的完成 rebase, 你可能必须要解决冲突。

首先执行 `git status` 找出哪些文件有冲突:

```sh
(my-branch)$ git status
On branch my-branch
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   README.md
```

在这个例子里面, `README.md` 有冲突。 打开这个文件找到类似下面的内容:

```vim
   <<<<<<< HEAD
   some code
   =========
   some code
   >>>>>>> new-commit
```

你需要解决新提交的代码(示例里, 从中间`==`线到`new-commit`的地方)与`HEAD` 之间不一样的地方.

有时候这些合并非常复杂，你应该使用可视化的差异编辑器(visual diff editor):

```sh
(master*)$ git mergetool -t opendiff
```

在你解决完所有冲突和测试过后, `git add` 变化了的(changed)文件, 然后用`git rebase --continue` 继续 rebase。

```sh
(my-branch)$ git add README.md
(my-branch)$ git rebase --continue
```

如果在解决完所有的冲突过后，得到了与提交前一样的结果, 可以执行`git rebase --skip`。

任何时候你想结束整个 rebase 过程，回来 rebase 前的分支状态, 你可以做:

```sh
(my-branch)$ git rebase --abort
```

### 杂项(Miscellaneous Objects)

#### 克隆所有子模块

```sh
$ git clone --recursive git://github.com/foo/bar.git
```

如果已经克隆了:

```sh
$ git submodule update --init --recursive
```

#### 删除标签(tag)

```sh
$ git tag -d <tag_name>
$ git push <remote> :refs/tags/<tag_name>
```

#### 恢复已删除标签(tag)

如果你想恢复一个已删除标签(tag), 可以按照下面的步骤: 首先, 需要找到无法访问的标签(unreachable tag):

```sh
$ git fsck --unreachable | grep tag
```

记下这个标签(tag)的 hash，然后用 Git 的 [update-ref](http://git-scm.com/docs/git-update-ref):

```sh
$ git update-ref refs/tags/<tag_name> <hash>
```

这时你的标签(tag)应该已经恢复了。

#### 已删除补丁(patch)

如果某人在 GitHub 上给你发了一个 pull request, 但是然后他删除了他自己的原始 fork, 你将没法克隆他们的提交(commit)或使用 `git am`。在这种情况下, 最好手动的查看他们的提交(commit)，并把它们拷贝到一个本地新分支，然后做提交。

做完提交后, 再修改作者，参见[变更作者](#commit-wrong-author)。 然后, 应用变化, 再发起一个新的 pull request。

### 跟踪文件(Tracking Files)

#### 我只想改变一个文件名字的大小写，而不修改内容

```sh
(master)$ git mv --force myfile MyFile
```

#### 我想从 Git 删除一个文件，但保留该文件

```sh
(master)$ git rm --cached log.txt
```

### 配置(Configuration)

#### 我想给一些 Git 命令添加别名(alias)

在 OS X 和 Linux 下, 你的 Git 的配置文件储存在 `\~/.gitconfig`。我在`[alias]` 部分添加了一些快捷别名(和一些我容易拼写错误的)，如下:

```vim
[alias]
    a = add
    amend = commit --amend
    c = commit
    ca = commit --amend
    ci = commit -a
    co = checkout
    d = diff
    dc = diff --changed
    ds = diff --staged
    f = fetch
    loll = log --graph --decorate --pretty=oneline --abbrev-commit
    m = merge
    one = log --pretty=oneline
    outstanding = rebase -i @{u}
    s = status
    unpushed = log @{u}
    wc = whatchanged
    wip = rebase -i @{u}
    zap = fetch -p
```

#### 我想缓存一个仓库(repository)的用户名和密码

你可能有一个仓库需要授权，这时你可以缓存用户名和密码，而不用每次推/拉(push/pull)的时候都输入，Credential helper 能帮你。

```sh
$ git config --global credential.helper cache
## Set git to use the credential memory cache
```

```sh
$ git config --global credential.helper 'cache --timeout=3600'
## Set the cache to timeout after 1 hour (setting is in seconds)
```

### 我不知道我做错了些什么

你把事情搞砸了：你 `重置(reset)` 了一些东西, 或者你合并了错误的分支, 亦或你强推了后找不到你自己的提交(commit)了。有些时候, 你一直都做得很好, 但你想回到以前的某个状态。

这就是 `git reflog` 的目的， `reflog` 记录对分支顶端(the tip of a branch)的任何改变, 即使那个顶端没有被任何分支或标签引用。基本上, 每次 HEAD 的改变, 一条新的记录就会增加到`reflog`。遗憾的是，这只对本地分支起作用，且它只跟踪动作 (例如，不会跟踪一个没有被记录的文件的任何改变)。

```sh
(master)$ git reflog
0a2e358 HEAD@{0}: reset: moving to HEAD\~2
0254ea7 HEAD@{1}: checkout: moving from 2.2 to master
c10f740 HEAD@{2}: checkout: moving from master to 2.2
```

上面的 reflog 展示了从 master 分支签出(checkout)到 2.2 分支，然后再签回。 那里，还有一个硬重置(hard reset)到一个较旧的提交。最新的动作出现在最上面以 `HEAD@{0}`标识.

如果事实证明你不小心回移(move back)了提交(commit), reflog 会包含你不小心回移前 master 上指向的提交(0254ea7)。

```sh
$ git reset --hard 0254ea7
```

然后使用 git reset 就可以把 master 改回到之前的 commit，这提供了一个在历史被意外更改情况下的安全网。

## 小结

最后，放一张我总结的脑图总结一下以上的知识点。

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/images/web/git/git-summary.png"/></div>

## 参考资料

- 官方资源
  - [Git 官网](https://git-scm.com/)
  - [Git Github](https://github.com/git/git)
- 模板
  - [gitignore 模板](https://github.com/github/gitignore) - .gitignore 文件模板
  - [gitattributes 模板](https://github.com/alexkaratarakis/gitattributes) - .gitattributes 文件模板
  - [github-cheat-sheet](https://github.com/tiimgreen/github-cheat-sheet) - git 命令简略图表
- Git 书
  - [Git 官方推荐教程](https://git-scm.com/book/zh/v2) - Scott Chacon 的 Git 书。
- Git 教程
  - [Git 中文教程](https://github.com/geeeeeeeeek/git-recipes)
  - [廖雪峰的 Git 教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)
  - [有关 git 的学习资源](https://github.com/xirong/my-git)
- 文章
  - [Git Cookbook](https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md)
  - [Git 奇技淫巧](https://github.com/521xueweihan/git-tips)
  - [Git 风格指南](https://github.com/aseaday/git-style-guide)
  - [Git 在团队中的最佳实践--如何正确使用 Git Flow](http://www.cnblogs.com/cnblogsfans/p/5075073.html)
- Git 工具
  - [guis](https://git-scm.com/downloads/guis) - Git 官网展示的客户端工具列表。
  - [gogs](https://github.com/gogits/gogs) - 极易搭建的自助 Git 服务。
  - [gitflow](https://github.com/nvie/gitflow) - 应用 [fit-flow](http://nvie.com/posts/a-successful-git-branching-model/) 模型的工具。
  - [firstaidgit.io](http://firstaidgit.io/) 一个可搜索的最常被问到的 Git 的问题
  - [git-extra-commands](https://github.com/unixorn/git-extra-commands) - 一堆有用的额外的 Git 脚本
  - [git-extras](https://github.com/tj/git-extras) - GIT 工具集 -- repo summary, repl, changelog population, author commit percentages and more
  - [git-fire](https://github.com/qw3rtman/git-fire) - git-fire 是一个 Git 插件，用于帮助在紧急情况下添加所有当前文件, 做提交(committing), 和推(push)到一个新分支(阻止合并冲突)。
  - [git-tips](https://github.com/git-tips/tips) - Git 小提示
  - [git-town](https://github.com/Originate/git-town) - 通用，高级 Git 工作流支持！ http://www.git-town.com
- GUI 客户端(GUI Clients)
  - [GitKraken](https://www.gitkraken.com/) - 豪华的 Git 客户端 Windows, Mac & Linux
  - [git-cola](https://git-cola.github.io/) - 另外一个 Git 客户端 Windows & OS X
  - [GitUp](https://github.com/git-up/GitUp) - 一个新的 Git 客户端，在处理 Git 的复杂性上有自己的特点
  - [gitx-dev](https://rowanj.github.io/gitx/) - 图形化的 Git 客户端 OS X
  - [Source Tree](https://www.sourcetreeapp.com/) - 免费的图形化 Git 客户端 Windows & OS X
  - [Tower](http://www.git-tower.com/) - 图形化 Git 客户端 OS X(付费)
- git cheat sheet
  - [github-git-cheat-sheet](https://services.github.com/on-demand/downloads/github-git-cheat-sheet.pdf)
