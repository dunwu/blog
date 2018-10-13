# Spring 中使用 JDBC 访问数据

## 准备

使用 Spring 的 JDBC 功能，你需要在 pom.xml 中引入以下依赖：

```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-jdbc</artifactId>
  <version>4.1.4.RELEASE</version>
</dependency>
```

## 配置数据源

### 使用 JNDI 数据源

如果 Spring 应用部署在支持 JNDI 的WEB服务器上（如WebSphere、JBoss、Tomcat等），就可以使用JNDI获取数据源。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:jee="http://www.springframework.org/schema/jee"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
http://www.springframework.org/schema/jee
http://www.springframework.org/schema/jee/spring-jee-3.2.xsd">
 
  <!-- 1.使用bean配置jndi数据源 -->
  <bean id="dataSource" class="org.springframework.jndi.JndiObjectFactoryBean">
    <property name="jndiName" value="java:comp/env/jdbc/orclight" />
  </bean>
 
  <!-- 2.使用jee标签配置jndi数据源，与1等价，但是需要引入命名空间 -->
  <jee:jndi-lookup id="dataSource" jndi-name=" java:comp/env/jdbc/orclight" />
</beans>
```

### 使用数据源连接池

Spring 本身并没有提供数据源连接池的实现。

推荐使用 [Druid](https://github.com/alibaba/druid) 。

```xml
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource"
        init-method="init" destroy-method="close">
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
  
    <!-- 配置初始化大小、最小、最大 -->
    <property name="initialSize" value="1"/>
    <property name="minIdle" value="1"/>
    <property name="maxActive" value="10"/>

    <!-- 配置获取连接等待超时的时间 -->
    <property name="maxWait" value="10000"/>

    <!-- 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒 -->
    <property name="timeBetweenEvictionRunsMillis" value="60000"/>

    <!-- 配置一个连接在池中最小生存的时间，单位是毫秒 -->
    <property name="minEvictableIdleTimeMillis" value="300000"/>

    <property name="testWhileIdle" value="true"/>

    <!-- 这里建议配置为TRUE，防止取到的连接不可用 -->
    <property name="testOnBorrow" value="true"/>
    <property name="testOnReturn" value="false"/>

    <!-- 打开PSCache，并且指定每个连接上PSCache的大小 -->
    <property name="poolPreparedStatements" value="true"/>
    <property name="maxPoolPreparedStatementPerConnectionSize"
              value="20"/>

    <!-- 这里配置提交方式，默认就是TRUE，可以不用配置 -->

    <property name="defaultAutoCommit" value="true"/>

    <!-- 验证连接有效与否的SQL，不同的数据配置不同 -->
    <property name="validationQuery" value="select 1 "/>
    <property name="filters" value="stat"/>
  </bean>
```

### 基于JDBC驱动的数据源

```xml
<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
  <property name="driverClassName" value="${jdbc.driver}"/>
  <property name="url" value="${jdbc.url}"/>
  <property name="username" value="${jdbc.username}"/>
  <property name="password" value="${jdbc.password}"/>
</bean>
```

## 使用 JDBC 模板

Spring 将数据访问的样板式代码提取到模板类中。Spring 提供了 3 个模板类：

JdbcTemplate：最基本的 Spring JDBC 模板，这个模板支持最简单的 JDBC 数据库访问功能以及简单的索引参数查询。

SimpleJdbcTemplate：改模板类利用 Java 5 的一些特性，如自动装箱、泛型以及可变参数列表来简化 JDBC 模板的使用。

NamedParameterJdbcTemplate：使用该模板类执行查询时，可以将查询值以命名参数的形式绑定到 SQL 中，而不是使用简单的索引参数。

注：Spring 实战推荐使用 SimpleJdbcTemplate。

使用 Spring JDBC 的步骤如下：

1. 创建 DTO 类。DTO 是 Data Transfer Object 的缩写，即数据传输对象。
2. 创建实现 RowMapper 接口的类。它可以看成是数据表实际实体和 DTO 之间的映射关系。
3. 声明数据库读写接口的 DAO 接口。定义 DAO 的好处在于对于数据层上层的业务，调用 DAO 时仅关注对外暴露的读写方法，而不考虑底层的具体持久化方式。这样，便于替换持久化方式。
4. 创建一个 DAO 接口的实现类，使用 Spring 的 JDBC 模板去实现接口。
5. 最后，只需要按照 Spring 的 JDBC 规范配置 xml。定义一个 DAO 接口的实现类的 JavaBean，并将数据源注入进去。

## 实例

实例可以参考 [spring-data-jdbc]() 中的实例。

执行 `io.github.dunwu.spring.data.jdbc` 包中的 Test 单元测试，即可看到测试结果。
