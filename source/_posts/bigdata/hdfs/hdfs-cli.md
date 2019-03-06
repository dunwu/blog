---
title: HDFS 命令
date: 2019-03-06
---

# HDFS 命令

- 列出目录的内容：

```
$ hdfs dfs -ls /
```

- 将文件从本地文件系统加载到HDFS：

```
$ hdfs dfs -put songs.txt /user/adam
```

- 从HDFS读取文件内容：

```
$ hdfs dfs -cat /user/adam/songs.txt
```

- 更改文件的权限：

```
$ hdfs dfs -chmod 700 /user/adam/songs.txt
```

- 将文件的复制因子设置为4：

```
$ hdfs dfs -setrep -w 4 /user/adam/songs.txt
```

- 检查文件的大小：

```
$ hdfs dfs -du -h /user/adam/songs.txt Create a subdirectory in your home directory.
$ hdfs dfs -mkdir songs
```


注意，相对路径总是引用执行命令的用户的主目录。HDFS上没有“当前”目录的概念（换句话说，没有“CD”命令）：



- 将文件移到新创建的子目录：

  $ hdfs dfs -mv songs.txt songs

- 从HDFS中删除一个目录：

  $ hdfs dfs -rm -r songs
