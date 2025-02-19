---
title: Flink Table API & SQL
date: 2022-03-18 14:33:03
order: 08
categories:
  - 大数据
  - flink
tags:
  - 大数据
  - Flink
permalink: /pages/6a507723/
---

# Flink Table API & SQL

Apache Flink 有两种关系型 API 来做流批统一处理：Table API 和 SQL。Table API 是用于 Scala 和 Java 语言的查询 API，它可以用一种非常直观的方式来组合使用选取、过滤、join 等关系型算子。Flink SQL 是基于 [Apache Calcite](https://calcite.apache.org/) 来实现的标准 SQL。无论输入是连续的（流式）还是有界的（批处理），在两个接口中指定的查询都具有相同的语义，并指定相同的结果。

Table API 和 SQL 两种 API 是紧密集成的，以及 DataStream API。你可以在这些 API 之间，以及一些基于这些 API 的库之间轻松的切换。比如，你可以先用 [CEP](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/libs/cep/) 从 DataStream 中做模式匹配，然后用 Table API 来分析匹配的结果；或者你可以用 SQL 来扫描、过滤、聚合一个批式的表，然后再跑一个 [Gelly 图算法](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/libs/gelly/overview/) 来处理已经预处理好的数据。

## jar 依赖

必要依赖：

```xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-table-api-java-bridge_2.11</artifactId>
  <version>1.14.4</version>
  <scope>provided</scope>
</dependency>
```

除此之外，如果你想在 IDE 本地运行你的程序，你需要添加下面的模块，具体用哪个取决于你使用哪个 Planner：

```xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-table-planner_2.11</artifactId>
  <version>1.14.4</version>
  <scope>provided</scope>
</dependency>
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-streaming-scala_2.11</artifactId>
  <version>1.14.4</version>
  <scope>provided</scope>
</dependency>
```

如果你想实现[自定义格式或连接器](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sourcessinks/) 用于（反）序列化行或一组[用户定义的函数](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/functions/udfs/)，下面的依赖就足够了，编译出来的 jar 文件可以直接给 SQL Client 使用：

```xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-table-common</artifactId>
  <version>1.14.4</version>
  <scope>provided</scope>
</dependency>
```

## 概念与通用 API

Table API 和 SQL 集成在同一套 API 中。 这套 API 的核心概念是`Table`，用作查询的输入和输出。

### Table API 和 SQL 程序的结构

所有用于批处理和流处理的 Table API 和 SQL 程序都遵循相同的模式。

```java
import org.apache.flink.table.api.*;
import org.apache.flink.connector.datagen.table.DataGenOptions;

// Create a TableEnvironment for batch or streaming execution.
// See the "Create a TableEnvironment" section for details.
TableEnvironment tableEnv = TableEnvironment.create(/*…*/);

// Create a source table
tableEnv.createTemporaryTable("SourceTable", TableDescriptor.forConnector("datagen")
    .schema(Schema.newBuilder()
      .column("f0", DataTypes.STRING())
      .build())
    .option(DataGenOptions.ROWS_PER_SECOND, 100)
    .build())

// Create a sink table (using SQL DDL)
tableEnv.executeSql("CREATE TEMPORARY TABLE SinkTable WITH ('connector' = 'blackhole') LIKE SourceTable");

// Create a Table object from a Table API query
Table table2 = tableEnv.from("SourceTable");

// Create a Table object from a SQL query
Table table3 = tableEnv.sqlQuery("SELECT * FROM SourceTable");

// Emit a Table API result Table to a TableSink, same for SQL result
TableResult tableResult = table2.executeInsert("SinkTable");
```

### 创建 `TableEnvironment`

`TableEnvironment` 是 Table API 和 SQL 的核心概念。它负责:

- 在内部的 catalog 中注册 `Table`
- 注册外部的 catalog
- 加载可插拔模块
- 执行 SQL 查询
- 注册自定义函数 （scalar、table 或 aggregation）
- `DataStream` 和 `Table` 之间的转换(面向 `StreamTableEnvironment` )

### 在 Catalog 中创建表

`TableEnvironment` 维护着一个由标识符（identifier）创建的表 catalog 的映射。标识符由三个部分组成：catalog 名称、数据库名称以及对象名称。

`Table` 可以是虚拟的（视图 `VIEWS`）也可以是常规的（表 `TABLES`）。视图 `VIEWS`可以从已经存在的`Table`中创建，一般是 Table API 或者 SQL 的查询结果。 表`TABLES`描述的是外部数据，例如文件、数据库表或者消息队列。

### 查询表

Table API 示例

```java
// get a TableEnvironment
TableEnvironment tableEnv = ...; // see "Create a TableEnvironment" section

// register Orders table

// scan registered Orders table
Table orders = tableEnv.from("Orders");
// compute revenue for all customers from France
Table revenue = orders
  .filter($("cCountry").isEqual("FRANCE"))
  .groupBy($("cID"), $("cName"))
  .select($("cID"), $("cName"), $("revenue").sum().as("revSum"));

// emit or convert Table
// execute query
```

SQL 示例

```java
// get a TableEnvironment
TableEnvironment tableEnv = ...; // see "Create a TableEnvironment" section

// register Orders table

// compute revenue for all customers from France
Table revenue = tableEnv.sqlQuery(
    "SELECT cID, cName, SUM(revenue) AS revSum " +
    "FROM Orders " +
    "WHERE cCountry = 'FRANCE' " +
    "GROUP BY cID, cName"
  );

// emit or convert Table
// execute query
```

### 输出表

`Table` 通过写入 `TableSink` 输出。`TableSink` 是一个通用接口，用于支持多种文件格式（如 CSV、Apache Parquet、Apache Avro）、存储系统（如 JDBC、Apache HBase、Apache Cassandra、Elasticsearch）或消息队列系统（如 Apache Kafka、RabbitMQ）。

批处理 `Table` 只能写入 `BatchTableSink`，而流处理 `Table` 需要指定写入 `AppendStreamTableSink`，`RetractStreamTableSink` 或者 `UpsertStreamTableSink`。

## 数据类型

通用类型与（嵌套的）复合类型 （如：POJO、tuples、rows、Scala case 类) 都可以作为行的字段。

复合类型的字段任意的嵌套可被 [值访问函数](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/functions/systemfunctions/#value-access-functions) 访问。

通用类型将会被视为一个黑箱，且可以被 [用户自定义函数](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/functions/udfs/) 传递或引用。

## SQL

Flink 支持以下语句：

- [SELECT (Queries)](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/queries/overview/)
- [CREATE TABLE, DATABASE, VIEW, FUNCTION](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/create/)
- [DROP TABLE, DATABASE, VIEW, FUNCTION](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/drop/)
- [ALTER TABLE, DATABASE, FUNCTION](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/alter/)
- [INSERT](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/insert/)
- [SQL HINTS](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/queries/hints/)
- [DESCRIBE](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/describe/)
- [EXPLAIN](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/explain/)
- [USE](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/use/)
- [SHOW](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/show/)
- [LOAD](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/load/)
- [UNLOAD](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sql/unload/)

## 参考资料

- [Flink 官方文档之 Flink Table API & SQL](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/common/)