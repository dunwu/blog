---
icon: logos:elasticsearch
title: ElasticSearch API 之 HighLevelRestClient
date: 2022-03-01 18:55:46
categories:
  - 数据库
  - 搜索引擎数据库
  - Elasticsearch
tags:
  - 数据库
  - 搜索引擎数据库
  - Elasticsearch
  - API
permalink: /pages/02faef83/
---

# ElasticSearch API 之 HighLevelRestClient

> Elasticsearch 官方的 High Level REST Client 在 7.1.5.0 版本废弃。所以本文中的 API 不推荐使用。

## 快速开始

### 引入依赖

在 pom.xml 中引入以下依赖：

```xml
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
    <version>7.17.1</version>
</dependency>
```

### 创建连接和关闭

```java
// 创建连接
RestHighLevelClient client = new RestHighLevelClient(
        RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http")));

// 关闭
client.close();
```

## 索引 API

### 测试准备

```java
public static final String INDEX = "mytest";
public static final String INDEX_ALIAS = "mytest_alias";
/**
 * {@link User} 的 mapping 结构（json形式）
 */
public static final String MAPPING_JSON =
  "{\n" + "  \"properties\": {\n" + "    \"_class\": {\n" + "      \"type\": \"keyword\",\n"
  + "      \"index\": false,\n" + "      \"doc_values\": false\n" + "    },\n" + "    \"description\": {\n"
  + "      \"type\": \"text\",\n" + "      \"fielddata\": true\n" + "    },\n" + "    \"enabled\": {\n"
  + "      \"type\": \"boolean\"\n" + "    },\n" + "    \"name\": {\n" + "      \"type\": \"text\",\n"
  + "      \"fielddata\": true\n" + "    }\n" + "  }\n" + "}";

@Autowired
private RestHighLevelClient client;
```

### 创建索引

```java
// 创建索引
CreateIndexRequest createIndexRequest = new CreateIndexRequest(INDEX);

  // 设置索引的 settings
  createIndexRequest.settings(
  Settings.builder().put("index.number_of_shards", 3).put("index.number_of_replicas", 2));

  // 设置索引的 mapping
  createIndexRequest.mapping(MAPPING_JSON, XContentType.JSON);

  // 设置索引的别名
  createIndexRequest.alias(new Alias(INDEX_ALIAS));

  AcknowledgedResponse createIndexResponse = client.indices().create(createIndexRequest, RequestOptions.DEFAULT);
  Assertions.assertTrue(createIndexResponse.isAcknowledged());
```

### 删除索引

```java
// 删除索引
DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest(INDEX);
  AcknowledgedResponse deleteResponse = client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
  Assertions.assertTrue(deleteResponse.isAcknowledged());
```

### 判断索引是否存在

```java
GetIndexRequest getIndexRequest = new GetIndexRequest(INDEX);
  Assertions.assertTrue(client.indices().exists(getIndexRequest, RequestOptions.DEFAULT));
  GetIndexRequest getIndexAliasRequest = new GetIndexRequest(INDEX_ALIAS);
  Assertions.assertTrue(client.indices().exists(getIndexAliasRequest, RequestOptions.DEFAULT));
```

## 文档 API

### 文档测试准备

```java
public static final String INDEX = "mytest";
public static final String INDEX_ALIAS = "mytest_alias";
/**
 * {@link User} 的 mapping 结构（json形式）
 */
public static final String MAPPING_JSON =
  "{\n" + "  \"properties\": {\n" + "    \"_class\": {\n" + "      \"type\": \"keyword\",\n"
  + "      \"index\": false,\n" + "      \"doc_values\": false\n" + "    },\n" + "    \"description\": {\n"
  + "      \"type\": \"text\",\n" + "      \"fielddata\": true\n" + "    },\n" + "    \"enabled\": {\n"
  + "      \"type\": \"boolean\"\n" + "    },\n" + "    \"name\": {\n" + "      \"type\": \"text\",\n"
  + "      \"fielddata\": true\n" + "    }\n" + "  }\n" + "}";

@Autowired
private RestHighLevelClient client;

@BeforeEach
public void init() throws IOException {

  // 创建索引
  CreateIndexRequest createIndexRequest = new CreateIndexRequest(INDEX);

  // 设置索引的 settings
  createIndexRequest.settings(
  Settings.builder().put("index.number_of_shards", 3).put("index.number_of_replicas", 2));

  // 设置索引的 mapping
  createIndexRequest.mapping(MAPPING_JSON, XContentType.JSON);

  // 设置索引的别名
  createIndexRequest.alias(new Alias(INDEX_ALIAS));

  AcknowledgedResponse response = client.indices().create(createIndexRequest, RequestOptions.DEFAULT);
  Assertions.assertTrue(response.isAcknowledged());

  // 判断索引是否存在
  GetIndexRequest getIndexRequest = new GetIndexRequest(INDEX_ALIAS);
  Assertions.assertTrue(client.indices().exists(getIndexRequest, RequestOptions.DEFAULT));
  GetIndexRequest getIndexAliasRequest = new GetIndexRequest(INDEX_ALIAS);
  Assertions.assertTrue(client.indices().exists(getIndexAliasRequest, RequestOptions.DEFAULT));
  }

@AfterEach
public void destroy() throws IOException {
  // 删除索引
  DeleteIndexRequest request = new DeleteIndexRequest(INDEX);
  AcknowledgedResponse response = client.indices().delete(request, RequestOptions.DEFAULT);
  Assertions.assertTrue(response.isAcknowledged());
  }
```

### 创建文档

RestHighLevelClient Api 使用 `IndexRequest` 来构建创建文档的请求参数。

【示例】创建 id 为 1 的文档

```java
IndexRequest request = new IndexRequest("product");
  request.id("1");
  Product product = new Product();
  product.setName("机器人");
  product.setDescription("人工智能机器人");
  product.setEnabled(true);
  String jsonString = JSONUtil.toJsonStr(product);
  request.source(jsonString, XContentType.JSON);
```

同步执行

```java
IndexResponse indexResponse = client.index(request, RequestOptions.DEFAULT);
```

异步执行

```java
// 异步执行
client.indexAsync(request, RequestOptions.DEFAULT, new ActionListener<IndexResponse>() {
@Override
public void onResponse(IndexResponse indexResponse) {
  System.out.println(indexResponse);
  }

@Override
public void onFailure(Exception e) {
  System.out.println("执行失败");
  }
  });
```

### 删除文档

RestHighLevelClient Api 使用 `DeleteRequest` 来构建删除文档的请求参数。

【示例】删除 id 为 1 的文档

```java
DeleteRequest deleteRequest = new DeleteRequest(INDEX_ALIAS, "1");
```

同步执行

```java
DeleteResponse deleteResponse = client.delete(deleteRequest, RequestOptions.DEFAULT);
  System.out.println(deleteResponse);
```

异步执行

```java
client.deleteAsync(deleteRequest, RequestOptions.DEFAULT, new ActionListener<DeleteResponse>() {
@Override
public void onResponse(DeleteResponse deleteResponse) {
  System.out.println(deleteResponse);
  }

@Override
public void onFailure(Exception e) {
  System.out.println("执行失败");
  }
  });
```

### 更新文档

RestHighLevelClient Api 使用 `UpdateRequest` 来构建更新文档的请求参数。

【示例】更新 id 为 1 的文档

```java
UpdateRequest updateRequest = new UpdateRequest(INDEX_ALIAS, "1");
  Product product3 = new Product();
  product3.setName("扫地机器人");
  product3.setDescription("人工智能扫地机器人");
  product3.setEnabled(true);
  String jsonString2 = JSONUtil.toJsonStr(product3);
  updateRequest.doc(jsonString2, XContentType.JSON);
```

同步执行

```java
UpdateResponse updateResponse = client.update(updateRequest, RequestOptions.DEFAULT);
  System.out.println(updateResponse);
```

异步执行

```java
client.updateAsync(updateRequest, RequestOptions.DEFAULT, new ActionListener<UpdateResponse>() {
@Override
public void onResponse(UpdateResponse updateResponse) {
  System.out.println(updateResponse);
  }

@Override
public void onFailure(Exception e) {
  System.out.println("执行失败");
  }
  });
```

### 查看文档

RestHighLevelClient Api 使用 `GetRequest` 来构建查看文档的请求参数。

【示例】查看 id 为 1 的文档

```java
GetRequest getRequest = new GetRequest(INDEX_ALIAS, "1");
```

同步执行

```java
GetResponse getResponse = client.get(getRequest, RequestOptions.DEFAULT);
```

异步执行

```java
client.getAsync(getRequest, RequestOptions.DEFAULT, new ActionListener<GetResponse>() {
@Override
public void onResponse(GetResponse getResponse) {
  System.out.println(getResponse);
  }

@Override
public void onFailure(Exception e) {
  System.out.println("执行失败");
  }
});
```

### 获取匹配条件的记录总数

```java
@Test
@DisplayName("获取匹配条件的记录总数")
public void count() throws IOException {
    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
    sourceBuilder.query(QueryBuilders.matchPhraseQuery("customer_gender", "MALE"));
    sourceBuilder.trackTotalHits(true);

    CountRequest countRequest = new CountRequest(INDEX);
    countRequest.source(sourceBuilder);

    CountResponse countResponse = client.count(countRequest, RequestOptions.DEFAULT);
    long count = countResponse.getCount();
    System.out.println("命中记录数：" + count);
}
```

### 分页查询

```java
@ParameterizedTest
@ValueSource(ints = {0, 1, 2, 3})
@DisplayName("分页查询测试")
public void pageTest(int page) throws IOException {

    int size = 10;
    int offset = page * size;
    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
    sourceBuilder.query(QueryBuilders.matchPhraseQuery("customer_gender", "MALE"));
    sourceBuilder.from(offset);
    sourceBuilder.size(size);
    sourceBuilder.trackTotalHits(true);

    SearchRequest searchRequest = new SearchRequest(INDEX);
    searchRequest.source(sourceBuilder);
    SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
        KibanaSampleDataEcommerceBean bean =
            BeanUtil.mapToBean(hit.getSourceAsMap(), KibanaSampleDataEcommerceBean.class, true,
                               CopyOptions.create());
        System.out.println(bean);
    }
}
```

### 条件查询

```java
@Test
@DisplayName("条件查询")
public void matchPhraseQuery() throws IOException {
    SearchRequest searchRequest = new SearchRequest(INDEX);
    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();

    BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
    boolQueryBuilder.must(QueryBuilders.matchPhraseQuery("customer_last_name", "Jensen"));
    sourceBuilder.query(boolQueryBuilder);
    sourceBuilder.trackTotalHits(true);
    searchRequest.source(sourceBuilder);
    SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
        KibanaSampleDataEcommerceBean bean =
            BeanUtil.mapToBean(hit.getSourceAsMap(), KibanaSampleDataEcommerceBean.class, true,
                               CopyOptions.create());
        System.out.println(bean);
    }
}
```

## 参考资料

- **官方**
  - [Java High Level REST Client](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/current/java-rest-high.html)
