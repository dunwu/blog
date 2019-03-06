---
title: SpringBootTutorialCoreRetry
date: 2019-03-06
---

# SpringBootTutorialCoreRetry

<!-- TOC depthFrom:2 depthTo:3 -->

- [源码](#源码)
- [更多内容](#更多内容)

<!-- /TOC -->

## 简介

### 开启 Retry

使用 `@EnableRetry` 注解开启 Retry 功能。

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@EnableRetry
@SpringBootApplication
public class SbeCoreRetryApplication {
    public static void main(String[] args) {
        SpringApplication.run(SbeCoreRetryApplication.class, args);
    }
}
```

@Retryable

使用 @Retryable 注解修饰方法

## 源码

完整示例：[源码](https://github.com/dunwu/spring-boot-tutorial/tree/master/codes/core/sbe-core-retry)

## 更多内容

**引申**

- [Spring Boot 教程](https://github.com/dunwu/spring-boot-tutorial)

**参考**

- [Bean Definition Profiles](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#beans-definition-profiles)
- [boot-features-profiles](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-profiles)
