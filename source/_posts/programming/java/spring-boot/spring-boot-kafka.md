---
title: Spring for Apache Kafka
date: 2019-03-06
---

# Spring for Apache Kafka

> spring 基于 `kafka-clients` jar 包。

<!-- TOC depthFrom:2 depthTo:3 -->

- [简介](#简介)
    - [特性](#特性)
- [快速入门](#快速入门)
    - [发送消息](#发送消息)
    - [接收消息](#接收消息)
    - [流处理](#流处理)
    - [其他 Kafka 属性](#其他-kafka-属性)
- [引用和引申](#引用和引申)

<!-- /TOC -->

## 简介

### 特性

- `KafkaTemplate`
- `KafkaMessageListenerContainer`
- `@KafkaListener`
- `KafkaTransactionManager`
- `spring-kafka-test`

## 快速入门

`spring-kafka` 项目支持在 Spring Boot 中自动配置 [Apache Kafka](https://kafka.apache.org/)

Kafka 配置在 `spring.kafka.*` 属性中进行控制。例如：你可以在 `application.properties` 中声明这些配置属性。

```properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=myGroup
```

> 注意：更详细的配置可以参考 - [`KafkaProperties`](https://github.com/spring-projects/spring-boot/tree/v2.1.0.RELEASE/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/kafka/KafkaProperties.java)

### 发送消息

Spring’s `KafkaTemplate` is auto-configured, and you can autowire it directly in your own beans, as shown in the following example:

```java
@Component
public class MyBean {

	private final KafkaTemplate kafkaTemplate;

	@Autowired
	public MyBean(KafkaTemplate kafkaTemplate) {
		this.kafkaTemplate = kafkaTemplate;
	}

	// ...

}
```

> 注意：如果定义了 `spring.kafka.producer.transaction-id-prefix` 属性，一个 `KafkaTransactionManager` 实例会被自动配置。同时，一个 `RecordMessageConverter` bean 也会被定义，并且它被自动关联到 `KafkaTemplate`。

### 接收消息

`@KafkaListener` 注解用于创建一个 listener。如果没有定义 `KafkaListenerContainerFactory`，会根据 `spring.kafka.listener.*` 的属性自动配置一个。

下面是一个监听 `someTopic` Topic 的示例：

```java
@Component
public class MyBean {

	@KafkaListener(topics = "someTopic")
	public void processMessage(String content) {
		// ...
	}

}
```

如果定义了 `KafkaTransactionManager` Bean，它会被自动关联到容器工厂。类似的，如果 `RecordMessageConverter`, `ErrorHandler` 或 `AfterRollbackProcessor` Bean 被定义，也会壁咚关联到默认工厂。

### 流处理

如果项目的 classpath 出现了 `kafka-streams`, Spring Boot 会自动配置 `KafkaStreamsConfiguration` 需要的 Bean，并且 Kafka 流通过 `@EnableKafkaStreams` 注解启动来开启。

启动 Kafka 流意味着 application id 和 bootstrap servers 必须设置。可以通过 `spring.kafka.streams.application-id` 属性配置，如果没有设置，默认为 `spring.application.name`。

示例：

```java
@Configuration
@EnableKafkaStreams
static class KafkaStreamsExampleConfiguration {

	@Bean
	public KStream<Integer, String> kStream(StreamsBuilder streamsBuilder) {
		KStream<Integer, String> stream = streamsBuilder.stream("ks1In");
		stream.map((k, v) -> new KeyValue<>(k, v.toUpperCase())).to("ks1Out",
				Produced.with(Serdes.Integer(), new JsonSerde<>()));
		return stream;
	}

}
```

默认，流是由 `StreamBuilder` 对象管理的。可以使用 `spring.kafka.streams.auto-startup` 属性定制它的行为。

### 其他 Kafka 属性

> 参考：了解更多属性，请参考 - [Appendix A, _Common application properties_](https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html)

`KafkaProperties` 类只支持 Kafka 配置属性的部分子集。如果需要配置一些附加属性，可以使用如下属性：

```properties
spring.kafka.properties.prop.one=first
spring.kafka.admin.properties.prop.two=second
spring.kafka.consumer.properties.prop.three=third
spring.kafka.producer.properties.prop.four=fourth
spring.kafka.streams.properties.prop.five=fifth
```

配置 `JsonDeserializer` 的属性：

```properties
spring.kafka.consumer.value-deserializer=org.springframework.kafka.support.serializer.JsonDeserializer
spring.kafka.consumer.properties.spring.json.value.default.type=com.example.Invoice
spring.kafka.consumer.properties.spring.json.trusted.packages=com.example,org.acme
```

配置 `JsonSerializer` 的属性：

```properties
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer
spring.kafka.producer.properties.spring.json.add.type.headers=false
```

## 引用和引申

- [Spring for Apache Kafka](http://spring.io/projects/spring-kafka)
- [Spring Boot 官方文档之 Apache Kafka Support](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-messaging.html#boot-features-kafka)
