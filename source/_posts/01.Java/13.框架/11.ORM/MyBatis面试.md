---
title: MyBatis 面试
date: 2025-04-30 06:33:26
order: 99
categories:
  - Java
  - 框架
  - ORM
tags:
  - Java
  - 框架
  - ORM
  - MyBatis
permalink: /pages/4dec9ccb/
---

# MyBatis 面试

### 【简单】MyBatis 中 #{} 和 ${} 的区别是什么？

**MyBatis 中 `#{}` 和 `${}` 的区别对比**

| **特性**         | **`#{}`（预编译占位符）**                                     | **`${}`（字符串拼接）**                          |
| ---------------- | ------------------------------------------------------------- | ------------------------------------------------ |
| **底层原理**     | 使用 `PreparedStatement`，生成带 `?` 的 SQL，预编译防止注入。 | 直接拼接字符串到 SQL 中，无参数化处理。          |
| **SQL 注入风险** | ❌ 安全（自动转义特殊字符）。                                 | ✔️ 高风险（需手动过滤参数）。                    |
| **适用场景**     | 动态条件值（如 `WHERE id = #{value}`）。                      | 动态表名、列名（如 `ORDER BY ${column}`）。      |
| **数据类型处理** | 自动识别 Java 类型，匹配 JDBC 类型（如 `Date`→`TIMESTAMP`）。 | 原样替换，可能导致语法错误（如字符串未加引号）。 |
| **性能**         | 预编译 SQL 可复用，高效。                                     | 每次生成新 SQL，效率较低。                       |
| **示例**         | `xml SELECT * FROM user WHERE name = #{name}`                 | `xml SELECT * FROM ${tableName}`                 |

**关键结论**

- **优先用 `#{}`**：处理用户输入或条件值，确保安全。
- **谨慎用 `${}`**：仅用于非用户输入的动态 SQL 部分（如动态表名），需手动过滤参数。
- **常见错误**：
  - 错误：`ORDER BY #{column}`（预编译后引号包裹列名，语法错误）。
  - 正确：`ORDER BY ${column} LIMIT #{limit}`（混合使用）。

**底层机制对比**

**`#{}` 的执行流程（安全）**

```sql
-- 生成的 SQL（预编译）
SELECT * FROM user WHERE id = ?;

-- 参数值通过 PreparedStatement 安全传递
pstmt.setInt(1, 5);
```

**`${}` 的执行流程（风险）**

```sql
-- 生成的 SQL（直接拼接）
SELECT * FROM user WHERE name = 'Alice' OR '1'='1';  -- 注入攻击示例
```

**何时必须使用 `${}`？**

1. **动态表名/列名**：

   ```xml
   SELECT * FROM ${tableName} WHERE ${column} = #{value}
   ```

2. **SQL 函数或关键字**：

   ```xml
   ORDER BY ${sortField} ${sortOrder}
   ```

**安全建议**

- 使用 `${}` 时，用 `@Param` 注解白名单校验：
  ```java
  List<User> selectByTable(@Param("tableName") String tableName);
  ```
  ```xml
  <!-- 手动校验表名合法性 -->
  SELECT * FROM ${tableName}
  WHERE 1=1
  <if test="tableName in {'user', 'order'}">
    AND status = #{status}
  </if>
  ```

### 【简单】MyBatis 如何实现一对一、一对多的关联查询 ？

### 【简单】使用 MyBatis 的 mapper 接口调用时有哪些要求？

### 【简单】MyBatis 自带的连接池有了解过吗？

### 【简单】MyBatis 和 Hibernate 有哪些差异？

| **对比维度**     | **MyBatis**                                      | **Hibernate**                                           |
| ---------------- | ------------------------------------------------ | ------------------------------------------------------- |
| **SQL 灵活性**   | 方便优化 SQL，**灵活性高**                       | 自动生成 SQL，复杂查询需 HQL 或原生 SQL，**灵活性较低** |
| **学习成本**     | 需熟悉 SQL 和数据库特性，适合有 SQL 经验的团队。 | 面向对象思维，适合快速上手 ORM 的团队。                 |
| **开发效率**     | 需手动编写 SQL 和结果映射，适合定制化需求。      | 自动化 CRUD，快速开发简单应用。                         |
| **缓存机制**     | 提供一级/二级缓存，需手动管理。                  | 内置多级缓存（查询缓存、集合缓存），自动化程度高。      |
| **数据库兼容性** | SQL 依赖具体数据库语法，**移植性较差**。         | 通过方言（Dialect）适配多数据库，**移植性好**。         |
| **关联映射**     | 需手动配置 `<association>`/`<collection>`。      | 自动管理对象关系（如 `@OneToMany`），配置简洁。         |
| **适用场景**     | 复杂查询、高性能系统（如金融、电商）。           | 快速开发、对象模型复杂的应用（如管理后台）。            |

**总结选择建议**

- **选择 MyBatis**：  
  - 需要精细控制 SQL，追求极致性能。  
  - 项目涉及多表复杂查询或数据库特性优化。  

- **选择 Hibernate**：  
  - 快速开发，业务以简单 CRUD 为主。  
  - 团队熟悉 ORM，希望减少 SQL 编写。  

**混合使用**：部分项目用 MyBatis 处理复杂查询，Hibernate 处理简单模块。

### 【中等】说说 MyBatis 的缓存机制？

### 【中等】MyBatis 写个 Xml 映射文件，再写个 DAO 接口就能执行，这个原理是什么？

### 【中等】MyBatis 动态 sql 有什么用？执行原理？有哪些动态 sql？

### 【中等】MyBatis 是否支持延迟加载？如果支持，它的实现原理是什么？

### 【中等】简述 MyBatis 的插件运行原理，以及如何编写一个插件？

### 【中等】JDBC 编程有哪些不足之处，MyBatis 是如何解决的？

### 【中等】MyBatis 都有哪些 Executor 执行器？它们之间的区别是什么？

### 【中等】MyBatis 如何实现数据库类型和 Java 类型的转换的？

## 【中等】MyBatis  有哪些核心组件？

MyBatis 有以下核心组件：

- **`SqlSessionFactoryBuilder`**：负责创建 `SqlSessionFactory` 实例。用完即弃。
- **`SqlSessionFactory`**：负责创建 `SqlSession` 实例。全局单例，配置中心。
- **`SqlSession`**：通过方法签名和 `Mapper` 相互映射。请求级核心，需及时关闭。
- **`Mapper`**：映射器是一些由用户创建的、绑定 SQL 语句的接口。轻量级对象，随用随建。

下面是它们之间的关系：

```
SqlSessionFactoryBuilder → SqlSessionFactory → SqlSession → Mapper Proxy
       (方法级)               (应用级)           (请求级)        (方法级)
```

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210510113446.png)

### SqlSessionFactoryBuilder

- **生命周期**：**方法级**（最短）
- **作用**：用于构建 `SqlSessionFactory`，解析 XML 配置（如 `mybatis-config.xml`）。
- **特点**：
  - 构建完成后即可销毁，无状态，不占用资源。
  - 通常作为局部变量使用。

```java
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(inputStream);
```

### SqlSessionFactory

- **生命周期**：**应用级**（最长）
- **作用**：创建 `SqlSession`，全局唯一，线程安全。
- **特点**：
  - 通常作为单例存在于整个应用运行期间。
  - 维护数据库连接池和全局配置（如缓存、别名）。

```java
// 推荐通过单例管理
public class MyBatisUtil {
    private static final SqlSessionFactory factory;
    static {
        factory = new SqlSessionFactoryBuilder().build(inputStream);
    }
    public static SqlSessionFactory getFactory() {
        return factory;
    }
}
```

### SqlSession

- **生命周期**：**请求/事务级**
- **作用**：执行 SQL、获取 Mapper 接口实例、管理事务。
- **特点**：
  - **非线程安全**，每次请求需创建新实例，用完后必须关闭（避免连接泄漏）。
  - 默认不自动提交事务，需手动 `commit()` 或 `rollback()`。

```java
try (SqlSession session = factory.openSession()) {  // 自动关闭
    UserMapper mapper = session.getMapper(UserMapper.class);
    User user = mapper.selectById(1);
    session.commit();  // 提交事务
}
```

### Mapper

- **生命周期**：**方法级**（与 `SqlSession` 绑定）
- **作用**：通过动态代理将接口方法调用转换为 SQL 执行。
- **特点**：
  - 由 `SqlSession` 创建，生命周期跟随 `SqlSession`。
  - 无需手动实现，MyBatis 自动生成代理类。

```java
// 代理对象随 SqlSession 销毁而失效
UserMapper mapper = session.getMapper(UserMapper.class);
```

## 【中等】能详细说说 MyBatis 的执行流程吗？

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210512173437.png)

## 【困难】MyBatis 的架构是如何设计的？

MyBatis 的架构设计通过 **分层解耦** 和 **动态代理** 实现了 SQL 与 Java 代码的分离，其核心在于：

- **配置驱动**：集中管理 SQL 和映射规则。
- **组件化**：各层职责单一，易于扩展（如插件）。
- **平衡灵活与易用**：既保留 JDBC 的掌控力，又简化了重复操作。

这种设计使其在需要高性能和灵活 SQL 的场景中表现优异，尤其适合中大型复杂业务系统。

MyBatis 的架构设计以 **SQL 与 Java 对象的灵活映射** 为核心，采用分层模块化设计，平衡了灵活性与易用性。

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210512114852.png)

**分层架构设计**

MyBatis 的架构分为四层，各层职责明确，通过接口解耦：

| **层级**       | **核心组件**                   | **职责**                                                     |
| -------------- | ------------------------------ | ------------------------------------------------------------ |
| **接口层**     | `SqlSession`、`Mapper` 接口    | 提供开发者使用的 API（如 `selectOne`、`insert`），屏蔽底层实现细节。 |
| **核心处理层** | `Executor`、`StatementHandler` | 执行 SQL 语句、处理参数绑定和结果映射，实现插件拦截链。      |
| **基础支撑层** | `DataSource`、`Transaction`    | 管理数据库连接池、事务，提供类型转换（`TypeHandler`）和缓存支持。 |
| **扩展层**     | `Interceptor`（插件）          | 通过动态代理拦截核心组件，实现功能扩展（如分页、性能监控）。 |

### 基础支撑层

**功能**：为上层提供通用能力支持

- **类型处理器 (TypeHandler)**：处理 Java 类型与 JDBC 类型转换（如 `String` ↔ `VARCHAR`）。支持自定义扩展（如枚举类型转换）。
- **连接管理**：集成连接池（如 HikariCP、Druid），管理数据库连接。
- **事务管理**：提供 JDBC 和 Managed 两种事务模式（可集成 Spring 事务）。
- **缓存管理**：一级缓存（`SqlSession` 级别）、二级缓存（`Mapper` 级别）。支持 Redis、Ehcache 等第三方缓存集成。

### 核心处理层

**功能**：执行 SQL 并处理结果映射

- **配置解析 (Configuration)**：加载 `mybatis-config.xml` 和 `Mapper.xml`，存储所有配置信息（如别名、插件）。
- **SQL 解析 (SqlSource & BoundSql)**：解析动态 SQL（`<if>`、`<foreach>`），生成可执行的 SQL 字符串和参数映射。
- **执行器 (Executor)**
  - **类型**：
    - `SimpleExecutor`：默认执行器，每次执行新开 `PreparedStatement`。
    - `ReuseExecutor`：复用 `Statement` 对象。
    - `BatchExecutor`：批量操作优化。
  - **职责**：调用 JDBC 执行 SQL，触发插件拦截链。
- **结果集处理 (ResultSetHandler)**：将 `ResultSet` 转换为 Java 对象（根据 `ResultMap` 或自动映射）。