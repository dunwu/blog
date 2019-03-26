---
title: MVEL
date: 2019-03-06
---

# MVEL

> MVEL 是一个功能强大的基于 Java 应用程序的表达式语言。
>
> 关键词： 表达式, 规则引擎

<!-- TOC depthFrom:2 depthTo:3 -->

- [MVEL 特性](#mvel-特性)
- [Quickstart](#quickstart)
- [更多内容](#更多内容)
    - [官网](#官网)
    - [博文](#博文)

<!-- /TOC -->

## MVEL 特性

目前最新的版本是 2.0，具有以下特性：

1. 动态 JIT 优化器。当负载超过一个确保代码产生的阈值时，选择性地产生字节代码,这大大减少了内存的使用量。新的静态类型检查和属性支持，允许集成类型安全表达。
2. 错误报告的改善。包括行和列的错误信息。
3. 新的脚本语言特征。MVEL2.0 包含函数定义，如：闭包，lambda 定义，标准循环构造(for, while, do-while, do-until…)，空值安全导航操作，内联 with-context 运营 ，易变的（isdef）的测试运营等等。
4. 改进的集成功能。迎合主流的需求，MVEL2.0 支持基础类型的个性化属性处理器，集成到 JIT 中。
5. 更快的模板引擎，支持线性模板定义，宏定义和个性化标记定义。
6. 新的交互式 shell（MVELSH）。

## Quickstart

（1）引入 pom

```xml
    <dependency>
      <groupId>org.mvel</groupId>
      <artifactId>mvel2</artifactId>
      <version>2.4.2.Final</version>
    </dependency>
```

（2）调用 API

```java
import org.mvel2.MVEL;
import java.util.HashMap;
import java.util.Map;

public class Demo {
    public static void main(String[] args) {
        String expression = "foobar > 99";
        Map vars = new HashMap();
        vars.put("foobar", new Integer(100));
        Boolean result = (Boolean) MVEL.eval(expression, vars);
        System.out.println("result = [" + result + "]");
    }
}
```

## 更多内容

### 官网

- [Github](https://github.com/mvel/mvel/)
- [Language Guide for 2.0](http://mvel.documentnode.com/) - MVEL 语言规范 2.0

### 博文

https://www.cnblogs.com/549294286/p/7979804.html - MVEL 语言规范 2.0（译）
http://camel.apache.org/mvel.html
