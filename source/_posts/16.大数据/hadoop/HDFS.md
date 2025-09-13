---
icon: devicon:hadoop
title: HDFS 应用
date: 2020-02-24 21:14:47
categories:
  - 大数据
  - hadoop
tags:
  - 大数据
  - hadoop
  - hdfs
permalink: /pages/493f6a7c/
---

# HDFS 应用

**HDFS** 是 **Hadoop Distributed File System** 的缩写，即 Hadoop 的分布式文件系统。

HDFS 是一种用于**存储具有流数据访问模式的超大文件的文件系统**，它**运行在廉价的机器集群**上。

HDFS 的设计目标是管理数以千计的服务器、数以万计的磁盘，将这么大规模的服务器计算资源当作一个单一的存储系统进行管理，对应用程序提供 **PB 级**的存储容量，让应用程序像使用普通文件系统一样存储大规模的文件数据。

HDFS 是在一个大规模分布式服务器集群上，对数据分片后进行并行读写及冗余存储。因为 HDFS 可以部署在一个比较大的服务器集群上，集群中所有服务器的磁盘都可供 HDFS 使用，所以整个 HDFS 的存储空间可以达到 PB 级容量。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202502192251433.png)

## HDFS 命令

### 显示当前目录结构

```shell
# 显示当前目录结构
hdfs dfs -ls <path>
# 递归显示当前目录结构
hdfs dfs -ls -R <path>
# 显示根目录下内容
hdfs dfs -ls /
```

### 创建目录

```shell
# 创建目录
hdfs dfs -mkdir <path>
# 递归创建目录
hdfs dfs -mkdir -p <path>
```

### 删除操作

```shell
# 删除文件
hdfs dfs -rm <path>
# 递归删除目录和文件
hdfs dfs -rm -R <path>
```

### 导入文件到 HDFS

```shell
# 二选一执行即可
hdfs dfs -put [localsrc] [dst]
hdfs dfs -copyFromLocal [localsrc] [dst]
```

### 从 HDFS 导出文件

```shell
# 二选一执行即可
hdfs dfs -get [dst] [localsrc]
hdfs dfs -copyToLocal [dst] [localsrc]
```

### 查看文件内容

```shell
# 二选一执行即可
hdfs dfs -text <path>
hdfs dfs -cat <path>
```

### 显示文件的最后一千字节

```shell
hdfs dfs -tail <path>
# 和 Linux 下一样，会持续监听文件内容变化 并显示文件的最后一千字节
hdfs dfs -tail -f <path>
```

### 拷贝文件

```shell
hdfs dfs -cp [src] [dst]
```

### 移动文件

```shell
hdfs dfs -mv [src] [dst]
```

### 统计当前目录下各文件大小

- 默认单位字节
- -s : 显示所有文件大小总和，
- -h : 将以更友好的方式显示文件大小（例如 64.0m 而不是 67108864）

```shell
hdfs dfs -du <path>
```

### 合并下载多个文件

- -nl 在每个文件的末尾添加换行符（LF）
- -skip-empty-file 跳过空文件

```shell
hdfs dfs -getmerge
# 示例 将 HDFS 上的 hbase-policy.xml 和 hbase-site.xml 文件合并后下载到本地的/usr/test.xml
hdfs dfs -getmerge -nl  /test/hbase-policy.xml /test/hbase-site.xml /usr/test.xml
```

### 统计文件系统的可用空间信息

```shell
hdfs dfs -df -h /
```

### 更改文件复制因子

```shell
hdfs dfs -setrep [-R] [-w] <numReplicas> <path>
```

- 更改文件的复制因子。如果 path 是目录，则更改其下所有文件的复制因子
- -w : 请求命令是否等待复制完成

```shell
# 示例
hdfs dfs -setrep -w 3 /user/hadoop/dir1
```

### 权限控制

```shell
# 权限控制和 Linux 上使用方式一致
# 变更文件或目录的所属群组。 用户必须是文件的所有者或超级用户。
hdfs dfs -chgrp [-R] GROUP URI [URI ...]
# 修改文件或目录的访问权限  用户必须是文件的所有者或超级用户。
hdfs dfs -chmod [-R] <MODE[,MODE]... | OCTALMODE> URI [URI ...]
# 修改文件的拥有者  用户必须是超级用户。
hdfs dfs -chown [-R] [OWNER][:[GROUP]] URI [URI ]
```

### 文件检测

```shell
hdfs dfs -test - [defsz]  URI
```

可选选项：

- -d：如果路径是目录，返回 0。
- -e：如果路径存在，则返回 0。
- -f：如果路径是文件，则返回 0。
- -s：如果路径不为空，则返回 0。
- -r：如果路径存在且授予读权限，则返回 0。
- -w：如果路径存在且授予写入权限，则返回 0。
- -z：如果文件长度为零，则返回 0。

```
# 示例
hdfs dfs -test -e filename
```

## HDFS API

### 简介

想要使用 HDFS API，需要导入依赖 `hadoop-client`。如果是 CDH 版本的 Hadoop，还需要额外指明其仓库地址：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.heibaiying</groupId>
    <artifactId>hdfs-java-api</artifactId>
    <version>1.0</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <hadoop.version>2.6.0-cdh5.15.2</hadoop.version>
    </properties>

    <!---配置 CDH 仓库地址-->
    <repositories>
        <repository>
            <id>cloudera</id>
            <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
        </repository>
    </repositories>

    <dependencies>
        <!--Hadoop-client-->
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>${hadoop.version}</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

### FileSystem

`FileSystem` 是所有 HDFS 操作的主入口。由于之后的每个单元测试都需要用到它，这里使用 `@Before` 注解进行标注。

```java
private static final String HDFS_PATH = "hdfs://192.168.0.106:8020";
private static final String HDFS_USER = "root";
private static FileSystem fileSystem;

@Before
public void prepare() {
    try {
        Configuration configuration = new Configuration();
        // 这里我启动的是单节点的 Hadoop, 所以副本系数设置为 1, 默认值为 3
        configuration.set("dfs.replication", "1");
        fileSystem = FileSystem.get(new URI(HDFS_PATH), configuration, HDFS_USER);
    } catch (IOException e) {
        e.printStackTrace();
    } catch (InterruptedException e) {
        e.printStackTrace();
    } catch (URISyntaxException e) {
        e.printStackTrace();
    }
}

@After
public void destroy() {
    fileSystem = null;
}
```

> [FileSystem 官方 Java API 文档](https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/fs/FileSystem.html)

### 创建目录

支持递归创建目录：

```java
@Test
public void mkDir() throws Exception {
    fileSystem.mkdirs(new Path("/hdfs-api/test0/"));
}
```

### 创建指定权限的目录

`FsPermission(FsAction u, FsAction g, FsAction o)` 的三个参数分别对应：创建者权限，同组其他用户权限，其他用户权限，权限值定义在 `FsAction` 枚举类中。

```java
@Test
public void mkDirWithPermission() throws Exception {
    fileSystem.mkdirs(new Path("/hdfs-api/test1/"),
            new FsPermission(FsAction.READ_WRITE, FsAction.READ, FsAction.READ));
}
```

### 创建文件，并写入内容

```java
@Test
public void create() throws Exception {
    // 如果文件存在，默认会覆盖，可以通过第二个参数进行控制。第三个参数可以控制使用缓冲区的大小
    FSDataOutputStream out = fileSystem.create(new Path("/hdfs-api/test/a.txt"),
                                               true, 4096);
    out.write("hello hadoop!".getBytes());
    out.write("hello spark!".getBytes());
    out.write("hello flink!".getBytes());
    // 强制将缓冲区中内容刷出
    out.flush();
    out.close();
}
```

### 判断文件是否存在

```java
@Test
public void exist() throws Exception {
    boolean exists = fileSystem.exists(new Path("/hdfs-api/test/a.txt"));
    System.out.println(exists);
}
```

### 查看文件内容

查看小文本文件的内容，直接转换成字符串后输出：

```java
@Test
public void readToString() throws Exception {
    FSDataInputStream inputStream = fileSystem.open(new Path("/hdfs-api/test/a.txt"));
    String context = inputStreamToString(inputStream, "utf-8");
    System.out.println(context);
}
```

`inputStreamToString` 是一个自定义方法，代码如下：

```java
/**
 * 把输入流转换为指定编码的字符
 *
 * @param inputStream 输入流
 * @param encode      指定编码类型
 */
private static String inputStreamToString(InputStream inputStream, String encode) {
    try {
        if (encode == null || ("".equals(encode))) {
            encode = "utf-8";
        }
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, encode));
        StringBuilder builder = new StringBuilder();
        String str = "";
        while ((str = reader.readLine()) != null) {
            builder.append(str).append("\n");
        }
        return builder.toString();
    } catch (IOException e) {
        e.printStackTrace();
    }
    return null;
}
```

### 文件重命名

```java
@Test
public void rename() throws Exception {
    Path oldPath = new Path("/hdfs-api/test/a.txt");
    Path newPath = new Path("/hdfs-api/test/b.txt");
    boolean result = fileSystem.rename(oldPath, newPath);
    System.out.println(result);
}
```

### 删除目录或文件

```java
public void delete() throws Exception {
    /*
     *  第二个参数代表是否递归删除
     *    +  如果 path 是一个目录且递归删除为 true, 则删除该目录及其中所有文件；
     *    +  如果 path 是一个目录但递归删除为 false, 则会则抛出异常。
     */
    boolean result = fileSystem.delete(new Path("/hdfs-api/test/b.txt"), true);
    System.out.println(result);
}
```

### 上传文件到 HDFS

```java
@Test
public void copyFromLocalFile() throws Exception {
    // 如果指定的是目录，则会把目录及其中的文件都复制到指定目录下
    Path src = new Path("D:\\BigData-Notes\\notes\\installation");
    Path dst = new Path("/hdfs-api/test/");
    fileSystem.copyFromLocalFile(src, dst);
}
```

### 上传大文件并显示上传进度

```java
@Test
    public void copyFromLocalBigFile() throws Exception {

        File file = new File("D:\\kafka.tgz");
        final float fileSize = file.length();
        InputStream in = new BufferedInputStream(new FileInputStream(file));

        FSDataOutputStream out = fileSystem.create(new Path("/hdfs-api/test/kafka5.tgz"),
                new Progressable() {
                  long fileCount = 0;

                  public void progress() {
                     fileCount++;
                     // progress 方法每上传大约 64KB 的数据后就会被调用一次
                     System.out.println("上传进度：" + (fileCount * 64 * 1024 / fileSize) * 100 + " %");
                   }
                });

        IOUtils.copyBytes(in, out, 4096);

    }
```

### 从 HDFS 上下载文件

```java
@Test
public void copyToLocalFile() throws Exception {
    Path src = new Path("/hdfs-api/test/kafka.tgz");
    Path dst = new Path("D:\\app\\");
    /*
     * 第一个参数控制下载完成后是否删除源文件，默认是 true, 即删除；
     * 最后一个参数表示是否将 RawLocalFileSystem 用作本地文件系统；
     * RawLocalFileSystem 默认为 false, 通常情况下可以不设置，
     * 但如果你在执行时候抛出 NullPointerException 异常，则代表你的文件系统与程序可能存在不兼容的情况 (window 下常见）,
     * 此时可以将 RawLocalFileSystem 设置为 true
     */
    fileSystem.copyToLocalFile(false, src, dst, true);
}
```

### 查看指定目录下所有文件的信息

```java
public void listFiles() throws Exception {
    FileStatus[] statuses = fileSystem.listStatus(new Path("/hdfs-api"));
    for (FileStatus fileStatus : statuses) {
        //fileStatus 的 toString 方法被重写过，直接打印可以看到所有信息
        System.out.println(fileStatus.toString());
    }
}
```

`FileStatus` 中包含了文件的基本信息，比如文件路径，是否是文件夹，修改时间，访问时间，所有者，所属组，文件权限，是否是符号链接等，输出内容示例如下：

```properties
FileStatus{
path=hdfs://192.168.0.106:8020/hdfs-api/test;
isDirectory=true;
modification_time=1556680796191;
access_time=0;
owner=root;
group=supergroup;
permission=rwxr-xr-x;
isSymlink=false
}
```

### 递归查看指定目录下所有文件的信息

```java
@Test
public void listFilesRecursive() throws Exception {
    RemoteIterator<LocatedFileStatus> files = fileSystem.listFiles(new Path("/hbase"), true);
    while (files.hasNext()) {
        System.out.println(files.next());
    }
}
```

和上面输出类似，只是多了文本大小，副本系数，块大小信息。

```properties
LocatedFileStatus{
path=hdfs://192.168.0.106:8020/hbase/hbase.version;
isDirectory=false;
length=7;
replication=1;
blocksize=134217728;
modification_time=1554129052916;
access_time=1554902661455;
owner=root; group=supergroup;
permission=rw-r--r--;
isSymlink=false}
```

### 查看文件的块信息

```java
@Test
public void getFileBlockLocations() throws Exception {

    FileStatus fileStatus = fileSystem.getFileStatus(new Path("/hdfs-api/test/kafka.tgz"));
    BlockLocation[] blocks = fileSystem.getFileBlockLocations(fileStatus, 0, fileStatus.getLen());
    for (BlockLocation block : blocks) {
        System.out.println(block);
    }
}
```

块输出信息有三个值，分别是文件的起始偏移量 (offset)，文件大小 (length)，块所在的主机名 (hosts)。

```
0,57028557,hadoop001
```

这里我上传的文件只有 57M（小于 128M)，且程序中设置了副本系数为 1，所有只有一个块信息。

## 参考资料

- https://github.com/heibaiying/BigData-Notes/blob/master/notes/HDFS%E5%B8%B8%E7%94%A8Shell%E5%91%BD%E4%BB%A4.md
- https://github.com/heibaiying/BigData-Notes/blob/master/notes/HDFS-Java-API.md