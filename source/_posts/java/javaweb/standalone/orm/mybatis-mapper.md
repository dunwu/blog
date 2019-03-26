---
title: Mapper 指南
date: 2019-03-06
---

# Mapper 指南

<!-- TOC depthFrom:2 depthTo:4 -->

- [快速入门](#快速入门)
    - [安装](#安装)
    - [配置实体类](#配置实体类)
    - [创建 Mapper 接口](#创建-mapper-接口)
    - [配置通用 Mapper](#配置通用-mapper)
    - [简单使用](#简单使用)
- [集成通用 Mapper](#集成通用-mapper)
- [对象关系映射](#对象关系映射)
- [配置](#配置)
- [引用和引申](#引用和引申)

<!-- /TOC -->

## 快速入门

### 安装

在 Maven 项目的 pom.xml 中添加通用 Mapper 依赖

```xml
<dependency>
    <groupId>tk.mybatis</groupId>
    <artifactId>mapper</artifactId>
    <version>最新版本</version>
</dependency>
```

### 配置实体类

通过 MBG 配合 专用代码生成器 可以直接生成实体类等基础代码，为了避免信息量过大，这里当作手工编写和配置。

有如下类：

```java
public class Country implements Serializable {
​    private static final long serialVersionUID = 1L;
​    @Id
​    @KeySql(useGeneratedKeys = true)
​    private Long id;
​    private String countryname;
​    private String countrycode;

    //setter 和 getter 方法
}
```

在上面类中，我们给主键添加了 `@Id`，标记该字段为数据库主键。还有一个通用 Mapper 的特殊注解 `@KeySql`，配置的 `useGeneratedKeys = true` 和 MyBatis 中的 useGeneratedKeys 含义相同，意思是说使用 JDBC 的方式获取数据库自增的主键值。

该类对应数据表为 country，因为类名和数据库名对应（当前数据库忽略大小写），因此不需要在类上添加 `@Table(name = "country")`。
经过上面简单的配置后，相当于就有了 MyBatis 中的 `<resultMap>` 关系映射了，特别注意，这个映射关系只对通用 Mapper 有效，自己手写方法时，需要自己处理映射关系。

这部分的详细内容参考文档：对象关系映射

### 创建 Mapper 接口

根据上述实体类，创建对应的 CountryMapper 接口如下：

```java
import tk.mybatis.mapper.common.Mapper;

public interface CountryMapper extends Mapper<Country> {}
```

这里继承了 `tk.mybatis.mapper.common.Mapper` 接口，在接口上指定了泛型类型 Country。当你继承了 Mapper 接口后，此时就已经有了针对 Country 的大量方法，方法如下：

这些方法中和 MBG 生成的大部分方法都一致，还有一部分 MBG 之外的常用方法。

### 配置通用 Mapper

为了让上述方法可以直接使用，还需要配置通用 Mapper，让项目在启动的时候，把上述方法都自动生成好，这样在运行时就可以使用上面所有的方法。

根据不同的开发环境，需要不同的配置方式，完整的内容可以 集成通用 Mapper，我们这里以最常见的 Spring 和 MyBatis 集成为例。

在集成 Spring 的环境中使用 MyBatis 接口方式时，需要配置 `MapperScannerConfigurer`，在这种情况下使用通用 Mapper，只需要修改配置如下：

```xml
<bean class="tk.mybatis.spring.mapper.MapperScannerConfigurer">
​    <property name="basePackage" value="扫描包名"/>
​    <!-- 其他配置 -->
</bean>
```

注意官方的包名和这里 tk 包名的区别：

```
tk.mybatis.spring.mapper.MapperScannerConfigurer
org.mybatis.spring.mapper.MapperScannerConfigurer
```

只有第一部分从 org 换成了 tk。

此时通用 Mapper 最简单的配置就完成了，完整的配置可以看这里 和 Spring 集成。

### 简单使用

下面是一个简单的测试用例，实际使用中，可以直接注入 CountryMapper。

```java
public class SpringXmlTest {

    private ClassPathXmlApplicationContext context;

    @Test
    public void testCountryMapper() {
        context = new ClassPathXmlApplicationContext("tk/mybatis/mapper/xml/spring.xml");
        CountryMapper countryMapper = context.getBean(CountryMapper.class);
    	//获取全部信息
        List<Country> countries = countryMapper.selectAll();
        Assert.assertNotNull(countries);
        Assert.assertEquals(183, countries.size());
    }

}
```

## 集成通用 Mapper

> 详情参考：[集成通用 Mapper](https://github.com/abel533/Mapper/wiki/1.integration)

## 对象关系映射

## 配置

## 引用和引申

[Github](https://github.com/abel533/Mapper)
https://blog.csdn.net/isea533/article/details/83045335
