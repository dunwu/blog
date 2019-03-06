---
title: SQLite Java API
date: 2019-03-06
---

# SQLite Java API

> :point_right: [完整示例源码](https://github.com/dunwu/db-tutorial/tree/master/codes/javadb/javadb-sqlite)
> 

## Quick Start

（1）在[官方下载地址](https://bitbucket.org/xerial/sqlite-jdbc/downloads)下载 sqlite-jdbc-(VERSION).jar ，然后将 jar 包放在项目中的 classpath。

（2）通过 API 打开一个 SQLite 数据库连接。

执行方法：

```
> javac Sample.java
> java -classpath ".;sqlite-jdbc-(VERSION).jar" Sample   # in Windows
or
> java -classpath ".:sqlite-jdbc-(VERSION).jar" Sample   # in Mac or Linux
name = leo
id = 1
name = yui
id = 2
```

示例：

```java
public class Sample {
    public static void main(String[] args) {
        Connection connection = null;
        try {
            // 创建数据库连接
            connection = DriverManager.getConnection("jdbc:sqlite:sample.db");
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(30);  // 设置 sql 执行超时时间为 30s

            statement.executeUpdate("drop table if exists person");
            statement.executeUpdate("create table person (id integer, name string)");
            statement.executeUpdate("insert into person values(1, 'leo')");
            statement.executeUpdate("insert into person values(2, 'yui')");
            ResultSet rs = statement.executeQuery("select * from person");
            while (rs.next()) {
                // 读取结果集
                System.out.println("name = " + rs.getString("name"));
                System.out.println("id = " + rs.getInt("id"));
            }
        } catch (SQLException e) {
            // 如果错误信息是 "out of memory"，可能是找不到数据库文件
            System.err.println(e.getMessage());
        } finally {
            try {
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException e) {
                // 关闭连接失败
                System.err.println(e.getMessage());
            }
        }
    }
}
```

### 如何指定数据库文件

Windows

```
Connection connection = DriverManager.getConnection("jdbc:sqlite:C:/work/mydatabase.db");
```

Unix (Linux, Mac OS X, etc) 

```
Connection connection = DriverManager.getConnection("jdbc:sqlite:/home/leo/work/mydatabase.db");
```

### 如何使用内存数据库

```
Connection connection = DriverManager.getConnection("jdbc:sqlite::memory:");
```

## 参考资料

https://github.com/xerial/sqlite-jdbc
http://www.runoob.com/sqlite/sqlite-java.html

