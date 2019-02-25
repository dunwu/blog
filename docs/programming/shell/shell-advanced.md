# Shell 进阶

```
███████╗██╗  ██╗███████╗██╗     ██╗
██╔════╝██║  ██║██╔════╝██║     ██║
███████╗███████║█████╗  ██║     ██║
╚════██║██╔══██║██╔══╝  ██║     ██║
███████║██║  ██║███████╗███████╗███████╗
```

<!-- TOC depthFrom:2 depthTo:3 -->

- [Linux 开机自启动脚本](#linux-开机自启动脚本)
    - [在 /etc/rc.local 文件中添加命令](#在-etcrclocal-文件中添加命令)
    - [在 /etc/rc.d/init.d 目录下添加自启动脚本](#在-etcrcdinitd-目录下添加自启动脚本)
- [引申和引用](#引申和引用)

<!-- /TOC -->

## Linux 开机自启动脚本

### 在 /etc/rc.local 文件中添加命令

如果不想将脚本粘来粘去，或创建链接，可以在 /etc/rc.local 文件中添加启动命令

1. 先修改好脚本，使其所有模块都能在任意目录启动时正常执行;
2. 再在 `/etc/rc.local` 的末尾添加一行以绝对路径启动脚本的行;

例：

执行 vim /etc/rc.local 命令，输入以下内容：

```sh
#!/bin/sh
#
# This script will be executed *after* all the other init scripts.
# You can put your own initialization stuff in here if you don't
# want to do the full Sys V style init stuff.

touch /var/lock/subsys/local
/opt/pjt_test/test.pl
```

### 在 /etc/rc.d/init.d 目录下添加自启动脚本

Linux 在 `/etc/rc.d/init.d` 下有很多的文件，每个文件都是可以看到内容的，其实都是一些 shell 脚本或者可执行二进制文件。

Linux 开机的时候，会加载运行 `/etc/rc.d/init.d` 目录下的程序，因此我们可以把想要自动运行的脚本放到这个目录下即可。系统服务的启动就是通过这种方式实现的。

#### 运行级别设置

简单的说，运行级就是操作系统当前正在运行的功能级别。

```
不同的运行级定义如下:
# 0 - 停机（千万不能把initdefault 设置为0 ）
# 1 - 单用户模式       　　进入方法#init s = init 1
# 2 - 多用户，没有 NFS
# 3 - 完全多用户模式(标准的运行级)
# 4 - 没有用到
# 5 - X11 多用户图形模式（xwindow)
# 6 - 重新启动 （千万不要把initdefault 设置为6 ）
```

这些级别在 `/etc/inittab` 文件里指定，这个文件是 init 程序寻找的主要文件，最先运行的服务是放在/etc/rc.d 目录下的文件。

在 `/etc` 目录下面有这么几个目录值得注意：rcS.d rc0.d rc1.d ... rc6.d  (0，1... 6 代表启动级别 0 代表停止，1 代表单用户模式，2-5 代表多用户模式，6 代表重启)  它们的作用就相当于 redhat 下的 rc.d ，你可以把脚本放到 rcS.d，然后修改文件名，给它一个启动序号，如: S88mysql

不过，最好的办法是放到相应的启动级别下面。具体作法:

（1）先把脚本 mysql 放到 /etc/init.d 目录下

（2）查看当前系统的启动级别

```sh
$ runlevel
N 3
```

（3）设定启动级别

```
#  98 为启动序号
#  2 是系统的运行级别，可自己调整，注意不要忘了结尾的句点
$ update-rc.d mysql start 98 2 .
```

现在我们到 /etc/rc2.d 下，就多了一个 S98mysql 这样的符号链接。

（4）重启系统，验证设置是否有效。

（5）移除符号链接

当你需要移除这个符号连接时，方法有三种：

a. 直接到 `/etc/rc2.d` 下删掉相应的链接，当然不是最好的方法；
b. 推荐做法：`update-rc.d -f s10 remove`
c. 如果 update-rc.d 命令你不熟悉，还可以试试看 rcconf 这个命令，也很方便。

## 引申和引用

- https://blog.csdn.net/linuxshine/article/details/50717272
- https://www.cnblogs.com/ssooking/p/6094740.html
