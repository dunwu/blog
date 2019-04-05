---
title: Gitlab 快速教程
date: 2019-03-06
---

# Gitlab 快速教程

> 准备
>
> Git - 如果不熟悉 Git ，可以先阅读：[Git 教程](https://github.com/dunwu/OS/tree/master/docs/git)

## 创建你的 SSH key

1. 使用 Gitlab 的第一步是生成你自己的 SSH 密钥对（Github 也类似）。

2. 登录 Gitlab

3. 打开 **Profile settings**.

<div align="center"><img src="https://docs.gitlab.com/ce/gitlab-basics/img/profile_settings.png"/></div>

4. 跳转到 **SSH keys** tab 页

<div align="center"><img src="https://docs.gitlab.com/ce/gitlab-basics/img/profile_settings_ssh_keys.png"/></div>

5. 黏贴你的 SSH 公钥内容到 Key 文本框

<div align="center"><img src="https://docs.gitlab.com/ce/gitlab-basics/img/profile_settings_ssh_keys_paste_pub.png"/></div>

6. 为了便于识别，你可以为其命名

<div align="center"><img src="https://docs.gitlab.com/ce/gitlab-basics/img/profile_settings_ssh_keys_title.png"/></div>

7. 点击 **Add key** 将 SSH 公钥添加到 GitLab

<div align="center"><img src="https://docs.gitlab.com/ce/gitlab-basics/img/profile_settings_ssh_keys_single_key.png"/></div>

## 创建项目

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/20190131150658.png"/></div>

输入项目信息，点击 Create project 按钮，在 Gitlab 创建项目。

<div align="center"><img src="https://raw.githubusercontent.com/dunwu/images/master/snap/20190131150759.png"/></div>

## 克隆项目到本地

可以选择 SSH 或 HTTPS 方式克隆项目到本地（推荐 SSH）

拷贝项目地址，然后在本地执行 `git clone <url>`

<div align="center"><img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1548919326929.png"/></div>

## 创建 Issue

依次点击 **Project’s Dashboard** > **Issues** > **New Issue** 可以新建 Issue

<div align="center"><img src="https://docs.gitlab.com/ce/user/project/issues/img/new_issue_from_tracker_list.png"/></div>

在项目中直接添加 issue

<div align="center"><img src="https://docs.gitlab.com/ce/user/project/issues/img/new_issue.png"/></div>

在未关闭 issue 中，点击 **New Issue** 添加 issue

<div align="center"><img src="https://docs.gitlab.com/ce/user/project/issues/img/new_issue_from_open_issue.png"/></div>

通过项目面板添加 issue

<div align="center"><img src="https://docs.gitlab.com/ce/user/project/issues/img/new_issue_from_projects_dashboard.png"/></div>

通过 issue 面板添加 issue

<div align="center"><img src="https://docs.gitlab.com/ce/user/project/issues/img/new_issue_from_issue_board.png"/></div>

## 更多内容

- **引申**
  - [操作系统、运维部署总结系列](https://github.com/dunwu/OS)
- **引用**
  - [官网](https://about.gitlab.com/)
