---
icon: logos:elasticsearch
title: Elasticsearch 搜索（上）
date: 2024-11-22 07:37:46
categories:
  - 数据库
  - 搜索引擎数据库
  - Elasticsearch
tags:
  - 数据库
  - 搜索引擎数据库
  - Elasticsearch
  - 搜索
permalink: /pages/b630d7a6/
---

# Elasticsearch 搜索（上）

## 搜索简介

Elasticsearch 支持多种搜索：

- [**精确搜索（词项搜索）**](https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html)：搜索数值、日期、IP 或字符串的精确值或范围。
- [**全文搜索**](https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html)：搜索非结构化文本数据并查找与查询项最匹配的文档。
- **向量搜索**：存储向量，并使用 ANN 或 [KNN](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html) 搜索来查找相似的向量，从而支持 [语义搜索](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html) 等场景。

可以使用 [`_search API`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html) 来搜索和聚合 Elasticsearch 数据流或索引中的数据。API 的 `query` 请求采用 [DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) 语义来进行查询。

Elasticsearch 支持两种搜索方式：URI Query 和 Request Body Query（DSL）

::: details URI Query 示例

```shell
GET /kibana_sample_data_ecommerce/_search?q=customer_first_name:Eddie
GET /kibana*/_search?q=customer_first_name:Eddie
GET /_all/_search?q=customer_first_name:Eddie
```

:::

::: details Request Body Query（DSL）示例

```shell
POST /kibana_sample_data_ecommerce/_search
{
	"query": {
		"match_all": {}
	}
}
```

:::

当文档存储在 Elasticsearch 中时，它会在 1 秒内近乎实时地被索引和完全搜索。

Elasticsearch 基于 Lucene 开发，并引入了分段搜索的概念。分段类似于倒排索引，但 Lucene 中的单词 `index` 表示“段的集合加上提交点”。提交后，将向提交点添加新分段并清除缓冲区。

位于 Elasticsearch 和磁盘之间的是文件系统缓存。内存中索引缓冲区的文档会被写入新的分段，然后写入文件系统缓存，然后才刷新到磁盘。

![A Lucene index with new documents in the in-memory buffer](https://www.elastic.co/guide/en/elasticsearch/reference/current/images/lucene-in-memory-buffer.png)

Lucene 允许写入和打开新分段，使其包含的文档对搜索可见，而无需执行完全提交。这是一个比提交到磁盘要轻松得多的过程，并且可以频繁地完成而不会降低性能。

![The buffer contents are written to a segment, which is searchable, but is not yet committed](https://www.elastic.co/guide/en/elasticsearch/reference/current/images/lucene-written-not-committed.png)

在 Elasticsearch 中，写入和打开新分段的这一过程称为刷新。刷新使自上次刷新以来对索引执行的所有操作都可用于搜索。

默认情况下，Elasticsearch 每秒定期刷新一次索引，但仅限于在过去 30 秒内收到一个或多个搜索请求的索引。这就是我们说 Elasticsearch 具有近实时搜索能力的原因：文档更改不会立即对搜索可见，但会在此时间范围内变得可见。

## 排序

在 Elasticsearch 中，默认排序是**按照相关性的评分（`_score`）**进行降序排序。`_score` 是浮点数类型，`_score` 评分越高，相关性越高。评分模型的选择可以通过 `similarity` 参数在映射中指定。

在 5.4 版本以前，默认的相关性算法是 TF-IDF。TF 是**词频**（term frequency），IDF 是**逆文档频率**（inverse document frequency）。一个简短的解释是，一个词条出现在某个文档中的次数越多，它就越相关；但是，如果该词条出现在不同的文档的次数越多，它就越不相关。5.4 版本以后，默认的相关性算法 BM25。

此外，也可以通过 `sort` 自定排序规则，如：按照字段的值排序、多级排序、多值字段排序、基于 geo（地理位置）排序以及自定义脚本排序。

::: details 排序示例

单字段排序

```json
POST /kibana_sample_data_ecommerce/_search
{
  "size": 5,
  "query": {
    "match_all": {}
  },
  "sort": [
    {"order_date": {"order": "desc"}}
  ]
}
```

多字段排序

```json
POST /kibana_sample_data_ecommerce/_search
{
  "size": 5,
  "query": {
    "match_all": {}
  },
  "sort": [
    {"order_date": {"order": "desc"}},
    {"_doc":{"order": "asc"}},
    {"_score":{ "order": "desc"}}
  ]
}
```

:::

> 详情参考：[Sort search results](https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html)

## 分页

默认情况下，Elasticsearch 搜索会返回前 10 个匹配的匹配项。

Elasticsearch 支持三种分页查询方式。

- from + size
- search after
- scroll

### from + size

可以使用 `from` 和 `size` 参数分别指定起始页和每页记录数。

当一个查询：from = 990, size = 10，会在每个分片上先获取 1000 个文档。然后，通过协调节点聚合所有结果。最后，再通过排序选取前 1000 个文档。

页数越深，占用内存越多。为了避免**深分页**问题，ES 默认限定最多搜索 10000 个文档，可以通过 [`index.max_result_window`](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules.html#index-max-result-window) 进行设置。

::: details from + size 分页查询示例

```json
POST /kibana_sample_data_ecommerce/_search
{
  "from": 2,
  "size": 5,
  "query": {
    "match_all": {}
  }
}
```

:::

### scroll

scroll 搜索方式类似于 RDBMS 中的游标，只允许向下翻页。每次下一页查询后，使用返回结果的 scroll id 来作为下一次翻页的标记。

scroll 在搜索初始化阶段会生成快照，后续数据的变化无法及时体现在查询结果，因此更加适合一次性批量查询或非实时数据的分页查询。

启用游标查询时，需要注意设定期望的过期时间（scroll = 1m），以降低维持游标查询窗口所需消耗的资源。

> 注意：Elasticsearch 官方不再建议使用 scroll 查询方式进行深分页，而是推荐使用 [`search_after`](https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#search-after) 和时间点（PIT）一起使用。

::: details scroll 分页查询示例

```json
POST /kibana_sample_data_ecommerce/_search?scroll=1m
{
  "size": 3,
  "query": {
    "match": {
      "currency": "EUR"
    }
  }
}

```

响应结果

```json
{
  "_scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAmTkWRTMzNmxBYmZUbUdsdFNqMnJoTl84Zw==",
  "took": 0,
  "timed_out": false,
  "_shards": {
    // 略
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [] // 略
  }
}
```

:::

> 详情参考：[Paginate search results](https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html)

### search after

search after 搜索方式不支持指定页数，只能向下翻页；并且需要指定 sort，并保证值是唯一的。然后，可以反复使用上次结果中最后一个文档的 sort 值进行查询。

search after 实现的思路同 scroll 方式基本一致，通过记录上一次分页的位置标识，来进行下一次分页查询。相比于 scroll 方式，它的优点是可以实时获取数据的变化，解决了查询快照导致的查询结果延迟问题。

::: details search after 分页查询示例

第一次查询

```json

POST /kibana_sample_data_ecommerce/_search
{
  "size": 5,
  "query": {
    "match_all": {}
  },
  "sort": [
    {"order_date": {"order": "desc"}}
  ]
}
```

响应结果

```json
{
  "took": 2609,
  "timed_out": false,
  "_shards": {
    // 略
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      // 略多条记录
      // 最后一条记录
      {
        // 略
        "sort": [1642893235000]
      }
    ]
  }
}
```

从上次查询的响应中获取 `sort` 值，然后将 sort 值插入 search after 数组：

```json
POST /kibana_sample_data_ecommerce/_search
{
  "size": 5,
  "query": {
    "match_all": {}
  },
  "search_after": [
    1642893235000
  ],
  "sort": [
    {
      "order_date": {
        "order": "desc"
      }
    }
  ]
}
```

:::

## 限定字段

默认情况下，搜索响应中的每个点击都包含 [`_source`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-source-field.html)，该字段保存了原始文本的 JSON 对象。有两种推荐的方法可以从搜索查询中检索所选字段：

- 使用 [`fields`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-fields.html#search-fields-param) 选项指定响应结果中返回的值。
- 如果需要在查询时返回原始文本数据，可以使用 [`_source`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-fields.html#source-filtering) 选项。

## 折叠搜索结果

Elasticsearch 中，可以通过 collapse 对搜索结果进行分组，且每个分组只显示该分组的一个代表文档。

::: details collapse 查询示例

```json
POST /kibana_sample_data_ecommerce/_search
{
  "size": 10,
  "query": {
    "match_all": {}
  },
  "collapse": {
    "field": "day_of_week"
  }
}
```

响应结果：

```json
{
  "took": 106,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "kibana_sample_data_ecommerce",
        "_type": "_doc",
        "_id": "yZUtBX4BU8KXl1YJRBrH",
        "_score": 1,
        "fields": {
          "day_of_week": ["Monday"]
        }
      },
      {
        "_index": "kibana_sample_data_ecommerce",
        "_type": "_doc",
        "_id": "ypUtBX4BU8KXl1YJRBrH",
        "_score": 1,
        "fields": {
          "day_of_week": ["Sunday"]
        }
      },
      {
        "_index": "kibana_sample_data_ecommerce",
        "_type": "_doc",
        "_id": "1JUtBX4BU8KXl1YJRBrH",
        "_score": 1,
        "fields": {
          "day_of_week": ["Tuesday"]
        }
      },
      {
        "_index": "kibana_sample_data_ecommerce",
        "_type": "_doc",
        "_id": "1ZUtBX4BU8KXl1YJRBrH",
        "_score": 1,
        "fields": {
          "day_of_week": ["Wednesday"]
        }
      },
      {
        "_index": "kibana_sample_data_ecommerce",
        "_type": "_doc",
        "_id": "2JUtBX4BU8KXl1YJRBrH",
        "_score": 1,
        "fields": {
          "day_of_week": ["Saturday"]
        }
      },
      {
        "_index": "kibana_sample_data_ecommerce",
        "_type": "_doc",
        "_id": "2ZUtBX4BU8KXl1YJRBrH",
        "_score": 1,
        "fields": {
          "day_of_week": ["Thursday"]
        }
      },
      {
        "_index": "kibana_sample_data_ecommerce",
        "_type": "_doc",
        "_id": "35UtBX4BU8KXl1YJRBrI",
        "_score": 1,
        "fields": {
          "day_of_week": ["Friday"]
        }
      }
    ]
  }
}
```

:::

## 过滤搜索结果

使用带有 `filter` 子句的布尔查询，可以过滤搜索和聚合的结果。

使用 [`post_filter`](https://www.elastic.co/guide/en/elasticsearch/reference/current/filter-search-results.html#post-filter) 可以过滤搜索的结果，但不能过滤聚合结果。

:::details filter 示例

```json
POST /kibana_sample_data_ecommerce/_search
{
  "size": 10,
  "query": {
    "bool": {
      "filter": {
        "range": {
          "taxful_total_price": {
            "gte": 0,
            "lte": 10
          }
        }
      }
    }
  }
}
```

:::

## 高亮

Elasticsearch 的高亮（highlight）可以从搜索结果中的一个或多个字段中获取突出显示的摘要，以便向用户显示查询匹配的位置。当请求突出显示（即高亮）时，响应结果的 `highlight` 字段中包括高亮的字段和高亮的片段。Elasticsearch 默认会用 `<em></em>` 标签标记关键字。

Elasticsearch 提供了三种高亮器，分别是**默认的 highlighter 高亮器**、**postings-highlighter 高亮器** 和 **fast-vector-highlighter 高亮器**。

::: details 高亮结果示例

```json
POST /kibana_sample_data_ecommerce/_search
{
  "size": 10,
  "query": {
    "match_all": {}
  },
  "highlight": {
    "fields": {
      "user": {
        "pre_tags": [
          "<strong>"
        ],
        "post_tags": [
          "</strong>"
        ]
      }
    }
  }
}
```

:::

> 详情参考：[Highlighting](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html)

## 分片路由搜索

Elasticsearch 可以在多个节点上的多个分片中存储索引数据的副本。在运行搜索请求时，Elasticsearch 会选择包含索引数据副本的节点，并将搜索请求转发到该节点的分片。此过程称为**路由**。

默认情况下，Elasticsearch 使用自适应副本选择来路由搜索请求。默认情况下，自适应副本选择从所有符合条件的节点和分片中进行选择。如果要限制符合搜索请求条件的节点和分片集，可以使用 [`preference`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html#search-preference) 查询参数。

> 详情参考：[Search shard routing](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-shard-routing.html)

## 查询规则

Elasticsearch 允许自定义查询规则来进行搜索。

> 详情参考：[Searching with query rules](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-using-query-rules.html)

## 搜索模板

搜索模板是可以使用不同变量运行的存储搜索。

> 详情参考：[Search templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html)

## 参考资料

- [极客时间教程 - Elasticsearch 核心技术与实战](https://time.geekbang.org/course/detail/100030501-102659)
- [ES 官方文档之 Search your data](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-with-elasticsearch.html)
