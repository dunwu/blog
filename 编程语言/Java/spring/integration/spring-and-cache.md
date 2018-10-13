---
title: Spring 集成缓存
date: 2017/11/08
categories:
- spring
tags:
- spring
- integration
- cache
- ehcache
---

## 前言

*Ehcache* 是一个成熟的缓存框架，你可以直接使用它来管理你的缓存。
*Spring* 提供了对缓存功能的抽象：即允许绑定不同的缓存解决方案（如Ehcache），但本身不直接提供缓存功能的实现。它支持注解方式使用缓存，非常方便。
本文先通过Ehcache独立应用的范例来介绍它的基本使用方法，然后再介绍与Spring整合的方法。

## 概述

**Ehcache是什么？**
EhCache 是一个纯Java的进程内缓存框架，具有快速、精干等特点。它是Hibernate中的默认缓存框架。
Ehcache已经发布了3.1版本。但是本文的讲解基于2.10.2版本。
为什么不使用最新版呢？因为Spring4还不能直接整合Ehcache 3.x。虽然可以通过JCache间接整合，Ehcache也支持JCache，但是个人觉得不是很方便。

## 安装

**Ehcache**
如果你的项目使用maven管理，添加以下依赖到你的*pom.xml*中。
```xml
<dependency>
  <groupId>net.sf.ehcache</groupId>
  <artifactId>ehcache</artifactId>
  <version>2.10.2</version>
  <type>pom</type>
</dependency>
```
如果你的项目不使用maven管理，请在 [Ehcache官网下载地址](http://www.ehcache.org/downloads/) 下载jar包。

**Spring**
如果你的项目使用maven管理，添加以下依赖到你的*pom.xml*中。
`spring-context-support`这个jar包中含有Spring对于缓存功能的抽象封装接口。
```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-context-support</artifactId>
  <version>4.1.4.RELEASE</version>
</dependency>
```

## Ehcache的使用

### HelloWorld范例

接触一种技术最快最直接的途径总是一个Hello World例子，毕竟动手实践印象更深刻，不是吗？
(1) 在classpath下添加*ehcache.xml*
添加一个名为*helloworld*的缓存。
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="http://ehcache.org/ehcache.xsd">

  <!-- 磁盘缓存位置 -->
  <diskStore path="java.io.tmpdir/ehcache"/>

  <!-- 默认缓存 -->
  <defaultCache
          maxEntriesLocalHeap="10000"
          eternal="false"
          timeToIdleSeconds="120"
          timeToLiveSeconds="120"
          maxEntriesLocalDisk="10000000"
          diskExpiryThreadIntervalSeconds="120"
          memoryStoreEvictionPolicy="LRU"/>

  <!-- helloworld缓存 -->
  <cache name="helloworld"
         maxElementsInMemory="1000"
         eternal="false"
         timeToIdleSeconds="5"
         timeToLiveSeconds="5"
         overflowToDisk="false"
         memoryStoreEvictionPolicy="LRU"/>
</ehcache>
```

(2) *EhcacheDemo.java*
Ehcache会自动加载classpath根目录下名为*ehcache.xml*文件。
EhcacheDemo的工作步骤如下：
在EhcacheDemo中，我们引用*ehcache.xml*声明的名为*helloworld*的缓存来创建`Cache`对象；
然后我们用一个键值对来实例化`Element`对象；
将`Element`对象添加到`Cache`；
然后用`Cache`的get方法获取`Element`对象。
```java
public class EhcacheDemo {
    public static void main(String[] args) throws Exception {
        // Create a cache manager
        final CacheManager cacheManager = new CacheManager();

        // create the cache called "helloworld"
        final Cache cache = cacheManager.getCache("helloworld");

        // create a key to map the data to
        final String key = "greeting";

        // Create a data element
        final Element putGreeting = new Element(key, "Hello, World!");

        // Put the element into the data store
        cache.put(putGreeting);

        // Retrieve the data element
        final Element getGreeting = cache.get(key);

        // Print the value
        System.out.println(getGreeting.getObjectValue());
    }
}
```
输出
```
Hello, World!
```

### Ehcache基本操作

`Element`、`Cache`、`CacheManager`是Ehcache最重要的API。
- Element：缓存的元素，它维护着一个键值对。
- Cache：它是Ehcache的核心类，它有多个`Element`，并被`CacheManager`管理。它实现了对缓存的逻辑行为。
- CacheManager：`Cache`的容器对象，并管理着`Cache`的生命周期。

#### 创建CacheManager

下面的代码列举了创建`CacheManager`的五种方式。
使用静态方法`create()`会以默认配置来创建单例的`CacheManager`实例。
`newInstance()`方法是一个工厂方法，以默认配置创建一个新的`CacheManager`实例。
此外，`newInstance()`还有几个重载函数，分别可以通过传入`String`、`URL`、`InputStream`参数来加载配置文件，然后创建`CacheManager`实例。

```java
// 使用Ehcache默认配置获取单例的CacheManager实例
CacheManager.create();
String[] cacheNames = CacheManager.getInstance().getCacheNames();

// 使用Ehcache默认配置新建一个CacheManager实例
CacheManager.newInstance();
String[] cacheNames = manager.getCacheNames();

// 使用不同的配置文件分别创建一个CacheManager实例
CacheManager manager1 = CacheManager.newInstance("src/config/ehcache1.xml");
CacheManager manager2 = CacheManager.newInstance("src/config/ehcache2.xml");
String[] cacheNamesForManager1 = manager1.getCacheNames();
String[] cacheNamesForManager2 = manager2.getCacheNames();

// 基于classpath下的配置文件创建CacheManager实例
URL url = getClass().getResource("/anotherconfigurationname.xml");
CacheManager manager = CacheManager.newInstance(url);

// 基于文件流得到配置文件，并创建CacheManager实例
InputStream fis = new FileInputStream(new File
("src/config/ehcache.xml").getAbsolutePath());
try {
 CacheManager manager = CacheManager.newInstance(fis);
} finally {
 fis.close();
}
```

#### 添加缓存

***需要强调一点，`Cache`对象在用`addCache`方法添加到`CacheManager`之前，是无效的。***
使用CacheManager的addCache方法可以根据缓存名将ehcache.xml中声明的cache添加到容器中；它也可以直接将Cache对象添加到缓存容器中。
`Cache`有多个构造函数，提供了不同方式去加载缓存的配置参数。
有时候，你可能需要使用API来动态的添加缓存，下面的例子就提供了这样的范例。
```java
// 除了可以使用xml文件中配置的缓存，你也可以使用API动态增删缓存
// 添加缓存
manager.addCache(cacheName);

// 使用默认配置添加缓存
CacheManager singletonManager = CacheManager.create();
singletonManager.addCache("testCache");
Cache test = singletonManager.getCache("testCache");

// 使用自定义配置添加缓存，注意缓存未添加进CacheManager之前并不可用
CacheManager singletonManager = CacheManager.create();
Cache memoryOnlyCache = new Cache("testCache", 5000, false, false, 5, 2);
singletonManager.addCache(memoryOnlyCache);
Cache test = singletonManager.getCache("testCache");

// 使用特定的配置添加缓存
CacheManager manager = CacheManager.create();
Cache testCache = new Cache(
 new CacheConfiguration("testCache", maxEntriesLocalHeap)
 .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.LFU)
 .eternal(false)
 .timeToLiveSeconds(60)
 .timeToIdleSeconds(30)
 .diskExpiryThreadIntervalSeconds(0)
 .persistence(new PersistenceConfiguration().strategy(Strategy.LOCALTEMPSWAP)));
 manager.addCache(testCache);
```

### 删除缓存

删除缓存比较简单，你只需要将指定的缓存名传入`removeCache`方法即可。
```java
CacheManager singletonManager = CacheManager.create();
singletonManager.removeCache("sampleCache1");
```

### 实现基本缓存操作

Cache最重要的两个方法就是put和get，分别用来添加Element和获取Element。
Cache还提供了一系列的get、set方法来设置或获取缓存参数，这里不一一列举，更多API操作可参考[官方API开发手册](http://www.ehcache.org/generated/2.10.2/pdf/Ehcache_API_Developer_Guide.pdf)。
```java
/**
 * 测试：使用默认配置或使用指定配置来创建CacheManager
 *
 * @author Zhang Peng
 */
public class CacheOperationTest {
    private final Logger log = LoggerFactory.getLogger(CacheOperationTest.class);

    /**
     * 使用Ehcache默认配置(classpath下的ehcache.xml)获取单例的CacheManager实例
     */
    @Test
    public void operation() {
        CacheManager manager = CacheManager.newInstance("src/test/resources/ehcache/ehcache.xml");

        // 获得Cache的引用
        Cache cache = manager.getCache("userCache");

        // 将一个Element添加到Cache
        cache.put(new Element("key1", "value1"));

        // 获取Element，Element类支持序列化，所以下面两种方法都可以用
        Element element1 = cache.get("key1");
        // 获取非序列化的值
        log.debug("key:{}, value:{}", element1.getObjectKey(), element1.getObjectValue());
        // 获取序列化的值
        log.debug("key:{}, value:{}", element1.getKey(), element1.getValue());

        // 更新Cache中的Element
        cache.put(new Element("key1", "value2"));
        Element element2 = cache.get("key1");
        log.debug("key:{}, value:{}", element2.getObjectKey(), element2.getObjectValue());

        // 获取Cache的元素数
        log.debug("cache size:{}", cache.getSize());

        // 获取MemoryStore的元素数
        log.debug("MemoryStoreSize:{}", cache.getMemoryStoreSize());

        // 获取DiskStore的元素数
        log.debug("DiskStoreSize:{}", cache.getDiskStoreSize());

        // 移除Element
        cache.remove("key1");
        log.debug("cache size:{}", cache.getSize());

        // 关闭当前CacheManager对象
        manager.shutdown();

        // 关闭CacheManager单例实例
        CacheManager.getInstance().shutdown();
    }
}
```

### 缓存配置

Ehcache支持通过xml文件和API两种方式进行配置。

#### xml方式

Ehcache的`CacheManager`构造函数或工厂方法被调用时，会默认加载classpath下名为*ehcache.xml*的配置文件。如果加载失败，会加载Ehcache jar包中的*ehcache-failsafe.xml*文件，这个文件中含有简单的默认配置。
**ehcache.xml配置参数说明：**
- **name**：缓存名称。
- **maxElementsInMemory**：缓存最大个数。
- **eternal**：缓存中对象是否为永久的，如果是，超时设置将被忽略，对象从不过期。
- **timeToIdleSeconds**：置对象在失效前的允许闲置时间（单位：秒）。仅当eternal=false对象不是永久有效时使用，可选属性，默认值是0，也就是可闲置时间无穷大。
- **timeToLiveSeconds**：缓存数据的生存时间（TTL），也就是一个元素从构建到消亡的最大时间间隔值，这只能在元素不是永久驻留时有效，如果该值是0就意味着元素可以停顿无穷长的时间。
- **maxEntriesLocalDisk**：当内存中对象数量达到maxElementsInMemory时，Ehcache将会对象写到磁盘中。
- **overflowToDisk**：内存不足时，是否启用磁盘缓存。
- **diskSpoolBufferSizeMB**：这个参数设置DiskStore（磁盘缓存）的缓存区大小。默认是30MB。每个Cache都应该有自己的一个缓冲区。
- **maxElementsOnDisk**：硬盘最大缓存个数。
- **diskPersistent**：是否在VM重启时存储硬盘的缓存数据。默认值是false。
- **diskExpiryThreadIntervalSeconds**：磁盘失效线程运行时间间隔，默认是120秒。
- **memoryStoreEvictionPolicy**：当达到maxElementsInMemory限制时，Ehcache将会根据指定的策略去清理内存。默认策略是LRU（最近最少使用）。你可以设置为FIFO（先进先出）或是LFU（较少使用）。
- **clearOnFlush**：内存数量最大时是否清除。

ehcache.xml的一个范例
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="http://ehcache.org/ehcache.xsd">

  <!-- 磁盘缓存位置 -->
  <diskStore path="java.io.tmpdir/ehcache"/>

  <!-- 默认缓存 -->
  <defaultCache
          maxEntriesLocalHeap="10000"
          eternal="false"
          timeToIdleSeconds="120"
          timeToLiveSeconds="120"
          maxEntriesLocalDisk="10000000"
          diskExpiryThreadIntervalSeconds="120"
          memoryStoreEvictionPolicy="LRU">
    <persistence strategy="localTempSwap"/>
  </defaultCache>

  <cache name="userCache"
         maxElementsInMemory="1000"
         eternal="false"
         timeToIdleSeconds="3"
         timeToLiveSeconds="3"
         maxEntriesLocalDisk="10000000"
         overflowToDisk="false"
         memoryStoreEvictionPolicy="LRU"/>
</ehcache>
```

#### API方式

xml配置的参数也可以直接通过编程方式来动态的进行配置（dynamicConfig没有设为false）。
```java
Cache cache = manager.getCache("sampleCache"); 
CacheConfiguration config = cache.getCacheConfiguration(); 
config.setTimeToIdleSeconds(60); 
config.setTimeToLiveSeconds(120); 
config.setmaxEntriesLocalHeap(10000); 
config.setmaxEntriesLocalDisk(1000000);
```
也可以通过`disableDynamicFeatures()`方式关闭动态配置开关。配置以后你将无法再以编程方式配置参数。
```java
Cache cache = manager.getCache("sampleCache"); 
cache.disableDynamicFeatures();
```

## Spring整合Ehcache

Spring3.1开始添加了对缓存的支持。和事务功能的支持方式类似，缓存抽象允许底层使用不同的缓存解决方案来进行整合。
Spring4.1开始支持JSR-107注解。
***注：我本人使用的Spring版本为4.1.4.RELEASE，目前Spring版本仅支持Ehcache2.5以上版本，但不支持Ehcache3。***

### 绑定Ehcache

`org.springframework.cache.ehcache.EhCacheManagerFactoryBean`这个类的作用是加载Ehcache配置文件。
`org.springframework.cache.ehcache.EhCacheCacheManager`这个类的作用是支持net.sf.ehcache.CacheManager。

*spring-ehcache.xml*的配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:cache="http://www.springframework.org/schema/cache"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
        http://www.springframework.org/schema/cache
        http://www.springframework.org/schema/cache/spring-cache-3.2.xsd">

  <description>ehcache缓存配置管理文件</description>

  <bean id="ehcache" class="org.springframework.cache.ehcache.EhCacheManagerFactoryBean">
    <property name="configLocation" value="classpath:ehcache/ehcache.xml"/>
  </bean>

  <bean id="cacheManager" class="org.springframework.cache.ehcache.EhCacheCacheManager">
    <property name="cacheManager" ref="ehcache"/>
  </bean>

  <!-- 启用缓存注解开关 -->
  <cache:annotation-driven cache-manager="cacheManager"/>
</beans>
```

### 使用Spring的缓存注解

#### 开启注解

Spring为缓存功能提供了注解功能，但是你必须启动注解。
你有两个选择：
(1) 在xml中声明
像上一节spring-ehcache.xml中的做法一样，使用`<cache:annotation-driven/>`
```xml
<cache:annotation-driven cache-manager="cacheManager"/>
```

(2) 使用标记注解
你也可以通过对一个类进行注解修饰的方式在这个类中使用缓存注解。
范例如下：
```java
@Configuration
@EnableCaching
public class AppConfig {
}
```

### 注解基本使用方法

Spring对缓存的支持类似于对事务的支持。
首先使用注解标记方法，相当于定义了切点，然后使用Aop技术在这个方法的调用前、调用后获取方法的入参和返回值，进而实现了缓存的逻辑。
下面三个注解都是方法级别：

#### @Cacheable

表明所修饰的方法是可以缓存的：当第一次调用这个方法时，它的结果会被缓存下来，在缓存的有效时间内，以后访问这个方法都直接返回缓存结果，不再执行方法中的代码段。
这个注解可以用`condition`属性来设置条件，如果不满足条件，就不使用缓存能力，直接执行方法。
可以使用`key`属性来指定key的生成规则。

#### @CachePut

与`@Cacheable`不同，`@CachePut`不仅会缓存方法的结果，还会执行方法的代码段。
它支持的属性和用法都与`@Cacheable`一致。

#### @CacheEvict

与`@Cacheable`功能相反，`@CacheEvict`表明所修饰的方法是用来删除失效或无用的缓存数据。
下面是`@Cacheable`、`@CacheEvict`和`@CachePut`基本使用方法的一个集中展示：
```java
@Service
public class UserService {
    // @Cacheable可以设置多个缓存，形式如：@Cacheable({"books", "isbns"})
    @Cacheable(value={"users"}, key="#user.id")
    public User findUser(User user) {
        return findUserInDB(user.getId());
    }

    @Cacheable(value = "users", condition = "#user.getId() <= 2")
    public User findUserInLimit(User user) {
        return findUserInDB(user.getId());
    }

    @CachePut(value = "users", key = "#user.getId()")
    public void updateUser(User user) {
        updateUserInDB(user);
    }

    @CacheEvict(value = "users")
    public void removeUser(User user) {
        removeUserInDB(user.getId());
    }

    @CacheEvict(value = "users", allEntries = true)
    public void clear() {
        removeAllInDB();
    }
}
```

#### @Caching

如果需要使用同一个缓存注解（`@Cacheable`、`@CacheEvict`或`@CachePut`）多次修饰一个方法，就需要用到`@Caching`。
```java
@Caching(evict = { @CacheEvict("primary"), @CacheEvict(cacheNames="secondary", key="#p0") })
public Book importBooks(String deposit, Date date)
```

#### @CacheConfig

与前面的缓存注解不同，这是一个类级别的注解。
如果类的所有操作都是缓存操作，你可以使用`@CacheConfig`来指定类，省去一些配置。
```java
@CacheConfig("books")
public class BookRepositoryImpl implements BookRepository {
	@Cacheable
	public Book findBook(ISBN isbn) {...}
}
```

## 参考

如果想参考我的***完整代码示例***，请[点击这里](https://github.com/dunwu/spring-notes/tree/master/codes/integration/cache)访问我的github。

下面是我在写作时参考的资料或文章。

- [Ehcache github](https://github.com/ehcache/ehcache3)
- [Ehcache官方文档](http://www.ehcache.org/documentation/)
- [Ehcache详细解读](http://raychase.iteye.com/blog/1545906)
- [注释驱动的 Spring cache 缓存介绍](http://www.ibm.com/developerworks/cn/opensource/os-cn-spring-cache/)
- [Spring官方文档4.3.3.RELEASE 第36章缓存抽象](http://docs.spring.io/spring/docs/current/spring-framework-reference/htmlsingle/)
