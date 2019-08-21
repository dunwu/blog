---
title: 分布式会话
categories: ['design', 'distributed']
tags: ['design', 'distributed', 'session']
date: 2019-06-04 23:42
---

# 分布式会话

## 概念

### 什么是 Session？

session 是啥？浏览器有个 cookie，在一段时间内这个 cookie 都存在，然后每次发请求过来都带上一个特殊的 `jsessionid cookie`，就根据这个东西，在服务端可以维护一个对应的 session 域，里面可以放点数据。

一般的话只要你没关掉浏览器，cookie 还在，那么对应的那个 session 就在，但是如果 cookie 没了，session 也就没了。常见于什么购物车之类的东西，还有登录状态保存之类的。

### 什么是分布式 Session？

在分布式场景下，一个用户的 Session 如果只存储在一个服务器上，那么当负载均衡器把用户的下一个请求转发到另一个服务器上，该服务器没有用户的 Session，就可能导致用户需要重新进行登录等操作。

分布式 Session 的几种实现策略：

1.  粘性 session
2.  应用服务器间的 session 复制共享
3.  基于缓存的 session 共享 ✅

> 推荐：基于缓存的 session 共享

## 粘性 Session

> 粘性 Session（Sticky Sessions）需要配置负载均衡器，使得一个用户的所有请求都路由到一个服务器节点上，这样就可以把用户的 Session 存放在该服务器节点中。
>
> 缺点：当服务器节点宕机时，将丢失该服务器节点上的所有 Session。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/MultiNode-StickySessions.jpg!zp" />
</div>

## session 复制共享

> Session 复制共享（Session Replication）在服务器节点之间进行 Session 同步操作，这样的话用户可以访问任何一个服务器节点。
>
> 缺点：占用过多内存；同步过程占用网络带宽以及服务器处理器时间。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/MultiNode-SessionReplication.jpg!zp" />
</div>

## 基于缓存的 session 共享

> 使用一个单独的存储服务器存储 Session 数据，可以存在 MySQL 数据库上，也可以存在 Redis 或者 Memcached 这种内存型数据库。
>
> 缺点：需要去实现存取 Session 的代码。

<div align="center">
<img src="http://dunwu.test.upcdn.net/cs/java/javaweb/distributed/architecture/MultiNode-SpringSession.jpg!zp" />
</div>

## 具体实现

### JWT Token

使用 JWT Token 储存用户身份，然后再从数据库或者 cache 中获取其他的信息。这样无论请求分配到哪个服务器都无所谓。

### tomcat + redis

这个其实还挺方便的，就是使用 session 的代码，跟以前一样，还是基于 tomcat 原生的 session 支持即可，然后就是用一个叫做 `Tomcat RedisSessionManager` 的东西，让所有我们部署的 tomcat 都将 session 数据存储到 redis 即可。

在 tomcat 的配置文件中配置：

```xml
<Valve className="com.orangefunction.tomcat.redissessions.RedisSessionHandlerValve" />

<Manager className="com.orangefunction.tomcat.redissessions.RedisSessionManager"
         host="{redis.host}"
         port="{redis.port}"
         database="{redis.dbnum}"
         maxInactiveInterval="60"/>
```

然后指定 redis 的 host 和 port 就 ok 了。

```xml
<Valve className="com.orangefunction.tomcat.redissessions.RedisSessionHandlerValve" />
<Manager className="com.orangefunction.tomcat.redissessions.RedisSessionManager"
	 sentinelMaster="mymaster"
	 sentinels="<sentinel1-ip>:26379,<sentinel2-ip>:26379,<sentinel3-ip>:26379"
	 maxInactiveInterval="60"/>
```

还可以用上面这种方式基于 redis 哨兵支持的 redis 高可用集群来保存 session 数据，都是 ok 的。

### spring session + redis

上面那种 tomcat + redis 的方式好用，但是会**严重依赖于 web 容器**，不好将代码移植到其他 web 容器上去，尤其是你要是换了技术栈咋整？比如换成了 spring cloud 或者是 spring boot 之类的呢？

所以现在比较好的还是基于 Java 一站式解决方案，也就是 spring。人家 spring 基本上承包了大部分我们需要使用的框架，spirng cloud 做微服务，spring boot 做脚手架，所以用 sping session 是一个很好的选择。

在 pom.xml 中配置：

```xml
<dependency>
  <groupId>org.springframework.session</groupId>
  <artifactId>spring-session-data-redis</artifactId>
  <version>1.2.1.RELEASE</version>
</dependency>
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>2.8.1</version>
</dependency>
```

在 spring 配置文件中配置：

```xml
<bean id="redisHttpSessionConfiguration"
     class="org.springframework.session.data.redis.config.annotation.web.http.RedisHttpSessionConfiguration">
    <property name="maxInactiveIntervalInSeconds" value="600"/>
</bean>

<bean id="jedisPoolConfig" class="redis.clients.jedis.JedisPoolConfig">
    <property name="maxTotal" value="100" />
    <property name="maxIdle" value="10" />
</bean>

<bean id="jedisConnectionFactory"
      class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory" destroy-method="destroy">
    <property name="hostName" value="${redis_hostname}"/>
    <property name="port" value="${redis_port}"/>
    <property name="password" value="${redis_pwd}" />
    <property name="timeout" value="3000"/>
    <property name="usePool" value="true"/>
    <property name="poolConfig" ref="jedisPoolConfig"/>
</bean>
```

在 web.xml 中配置：

```xml
<filter>
    <filter-name>springSessionRepositoryFilter</filter-name>
    <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
</filter>
<filter-mapping>
    <filter-name>springSessionRepositoryFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

示例代码：

```java
@RestController
@RequestMapping("/test")
public class TestController {

    @RequestMapping("/putIntoSession")
    public String putIntoSession(HttpServletRequest request, String username) {
        request.getSession().setAttribute("name",  "leo");
        return "ok";
    }

    @RequestMapping("/getFromSession")
    public String getFromSession(HttpServletRequest request, Model model){
        String name = request.getSession().getAttribute("name");
        return name;
    }
}
```

上面的代码就是 ok 的，给 sping session 配置基于 redis 来存储 session 数据，然后配置了一个 spring session 的过滤器，这样的话，session 相关操作都会交给 spring session 来管了。接着在代码中，就用原生的 session 操作，就是直接基于 spring sesion 从 redis 中获取数据了。

实现分布式的会话有很多种方式，我说的只不过是比较常见的几种方式，tomcat + redis 早期比较常用，但是会重耦合到 tomcat 中；近些年，通过 spring session 来实现。

## 参考资料

- [集群/分布式环境 Session 的几种策略](https://github.com/L316476844/distributed-session)
