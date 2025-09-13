---
icon: logos:elasticsearch
title: Elasticsearch 搜索（下）
date: 2022-01-18 08:01:08
categories:
  - 数据库
  - 搜索引擎数据库
  - elasticsearch
tags:
  - 数据库
  - 搜索引擎数据库
  - elasticsearch
  - 查询
  - DSL
permalink: /pages/47b49254/
---

# Elasticsearch 搜索（下）

Elasticsearch 提供了基于 JSON 的 DSL（Domain Specific Language）来定义查询。

可以将 DSL 视为查询的 AST（抽象语法树），由两种类型的子句组成：

- 叶子查询 - 在指定字段中查找特定值，例如：[`match`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html)、[`term`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html) 和 [`range`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)。
- 组合查询 - 组合其他叶子查询或组合查询，用于以逻辑方式组合多个查询（例如： [`bool`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)、[`dis_max`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-dis-max-query.html)），或更改它们的行为（例如：[`constant_score`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-constant-score-query.html)）。

查询子句的行为会有所不同，具体取决于它们是在 query content 还是 filter context 中使用。

- `query` context - **有相关性计算**，采用相关性算法，计算文档与查询关键词之间的相关度，并根据评分（`_score`）大小排序。
- `filter` context - **无相关性计算**，可以利用缓存，性能更好。

从用法角度，Elasticsearch 查询分类大致分为：

- [Compound（组合查询）](https://www.elastic.co/guide/en/elasticsearch/reference/current/compound-queries.html)
- [Term-level（词项查询）](https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html)
- [Full text（全文查询）](https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html)
- [Joining（联结查询）](https://www.elastic.co/guide/en/elasticsearch/reference/current/joining-queries.html)
- [Specialized（专用查询）](https://www.elastic.co/guide/en/elasticsearch/reference/current/specialized-queries.html)
- [Geo（地理位置查询）](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-queries.html)
- [Span（跨度查询）](https://www.elastic.co/guide/en/elasticsearch/reference/current/span-queries.html)
- [Vector（向量查询）](https://www.elastic.co/guide/en/elasticsearch/reference/current/vector-queries.html)
- [Shape（形状查询）](https://www.elastic.co/guide/en/elasticsearch/reference/current/shape-queries.html)

## 全文查询

[Full Text Search（全文搜索）](https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html) 支持在非结构化文本数据中搜索与查询关键字最匹配的数据。

在 ES 中，支持以下全文搜索方式：

- [intervals](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-intervals-query.html) - 根据匹配词的顺序和近似度返回文档。
- [match](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html) - **匹配查询**，用于执行全文搜索的标准查询，包括模糊匹配和短语或邻近查询。
- [match_bool_prefix](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-bool-prefix-query.html) - 对检索文本分词，并根据这些分词构造一个布尔查询。除了最后一个分词之外的每个分词都进行 term 查询。最后一个分词用于 `prefix` 查询；其他分词都进行 `term` 查询。
- [match_phrase](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html) - **短语匹配查询**，短语匹配会将检索内容分词，这些词语必须全部出现在被检索内容中，并且顺序必须一致，默认情况下这些词都必须连续。
- [match_phrase_prefix](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase-prefix.html) - 与 `match_phrase` 查询类似，但对最后一个单词执行通配符搜索。
- [multi_match](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html) 支持多字段 match 查询
- [combined_fields](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-combined-fields-query.html) - 匹配多个字段，就像它们已索引到一个组合字段中一样。
- [query_string](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html) - 支持紧凑的 Lucene [query string（查询字符串）语法](https://www.elastic.co/guide/en/elasticsearch/reference/8.16/query-dsl-query-string-query.html#query-string-syntax)，允许指定 `AND|OR|NOT` 条件和单个查询字符串中的多字段搜索。仅适用于专家用户。
- [simple_query_string](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html) - 更简单、更健壮的 `query_string` 语法版本，适合直接向用户公开。

### match（匹配查询）

[**`match`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html) 查询用于搜索单个字段。首先，会针对检索文本进行解析（分词），分词后的任何一个词项只要被匹配，文档就会被搜到。默认情况下，相当于对分词后词项进行 or 匹配操作。

:::details match 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "match": {
      "customer_full_name": {
        "query": "George Hubbard"
      }
    }
  }
}
```

响应结果：

```json
{
  "took": 891, // 查询使用的毫秒数
  "timed_out": false, // 是否有分片超时，也就是说是否只返回了部分结果
  "_shards": {
    // 总分片数、响应成功/失败数量信息
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    // 搜索结果
    "total": {
      // 匹配的总记录数
      "value": 82,
      "relation": "eq"
    },
    "max_score": 10.018585, // 所有匹配文档中的最大相关性分值
    "hits": [
      // 匹配文档列表
      {
        "_index": "kibana_sample_data_ecommerce", // 文档所属索引
        "_type": "_doc", // 文档所属 type
        "_id": "2ZUtBX4BU8KXl1YJRBrH", // 文档的唯一性标识
        "_score": 10.018585, // 文档的相关性分值
        "_source": {
          // 文档的原始 JSON 对象
          // 略
        }
      }
      // 省略多条记录
    ]
  }
}
```

:::

可以通过组合 `<field>` 和 `query` 参数来简化匹配查询语法。下面是一个简单的示例。

:::details match 简写示例

下面的查询等价于前面的匹配查询示例：

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "match": {
      "customer_full_name": "George Hubbard"
    }
  }
}
```

:::

在进行全文本字段检索的时候， match API 提供了 operator 和 minimum_should_match 参数：

- **operator** 参数值可以为 “or” 或者 “and” 来控制检索词项间的关系，默认值为 “or”。所以上面例子中，只要书名中含有 “linux” 或者 “architecture” 的文档都可以匹配上。
- **[minimum_should_match](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-minimum-should-match.html)** 可以指定词项的最少匹配个数，其值可以指定为某个具体的数字，但因为我们无法预估检索内容的词项数量，一般将其设置为一个百分比。

:::details minimum_should_match 示例

至少有 50% 的词项匹配的文档才会被返回：

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "match": {
      "category": {
        "query": "Women Clothing Accessories",
        "operator": "or",
        "minimum_should_match": "50%"
      }
    }
  }
}
```

:::

match 查询提供了 fuzziness 参数，**fuzziness** 允许基于被查询字段的类型进行模糊匹配。请参阅 [Fuzziness](https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#fuzziness) 的配置。

在这种情况下可以设置 `prefix_length` 和 `max_expansions` 来控制模糊匹配。如果设置了模糊选项，查询将使用 `top_terms_blended_freqs_${max_expansions}` 作为其重写方法，`fuzzy_rewrite` 参数允许控制查询将如何被重写。

默认情况下允许模糊倒转 (`ab` → `ba`)，但可以通过将 `fuzzy_transpositions` 设置为 `false` 来禁用。

:::details fuzziness 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "match": {
      "customer_first_name": {
        "query": "Gearge",
        "fuzziness": "AUTO"
      }
    }
  }
}
```

:::

如果使用的分析器像 stop 过滤器一样删除查询中的所有标记，则默认行为是不匹配任何文档。可以使用 `zero_terms_query` 选项来改变默认行为，它接受 `none`（默认）和 `all` （相当于 `match_all` 查询）。

:::details zero_terms_query 示例

```bash
GET kibana_sample_data_logs/_search
{
  "query": {
    "match": {
      "message": {
        "query": "Mozilla Linux",
        "operator": "and",
        "zero_terms_query": "all"
      }
    }
  }
}
```

:::

### match_phrase（短语匹配查询）

[**`match_phrase`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html) 查询首先会对检索内容进行分词，分词器可以自定义，同时文档还要满足以下两个条件才会被搜索到：

1. **分词后所有词项都要出现在该字段中（相当于 and 操作）**。
2. **字段中的词项顺序要一致**。

:::details match_phrase 示例

```bash
GET kibana_sample_data_logs/_search
{
  "query": {
    "match_phrase": {
       "agent": {
        "query": "Linux x86_64"
      }
    }
  }
}
```

:::

### match_phrase_prefix（短语前缀匹配查询）

查询和 [**`match_phrase`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html) 查询类似，只不过 [**`match_phrase_prefix`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase-prefix.html) 最后一个 term 会被作为前缀匹配。

:::details match_phrase_prefix 示例

匹配以 `https://www.elastic.co/download` 开头的短语

```bash
GET kibana_sample_data_logs/_search
{
  "query": {
    "match_phrase_prefix": {
      "url": {
        "query": "https://www.elastic.co/download"
      }
    }
  }
}
```

:::

### multi_match（多字段匹配查询）

[**`multi_match`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html) 查询允许对多个字段执行相同的匹配查询。

`multi_match` 查询在内部执行的方式取决于 type 参数，可以设置为：

- [`best_fields`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#type-best-fields) -（默认）将所有与查询匹配的文档作为结果返回，但是只使用评分最高的字段的评分来作为评分结果返回。
- [`most_fields`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#type-most-fields) - 将所有与查询匹配的文档作为结果返回，并将所有匹配字段的评分累加起来作为评分结果。
- [`cross_fields`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#type-cross-fields) - 将具有相同分析器的字段视为一个大字段。在每个字段中查找每个单词。例如当需要查询英文人名的时候，可以将 first_name 和 last_name 两个字段组合起来当作 full_name 来查询。
- [`phrase`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#type-phrase) - 对每个字段运行 `match_phrase` 查询，并将最佳匹配字段的评分作为结果返回。
- [`phrase_prefix`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#type-phrase) - 对每个字段运行 `match_phrase_prefix` 查询，并将最佳匹配字段的评分作为结果返回。
- [`bool_prefix`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#type-bool-prefix) - 在每个字段上创建一个 [match_bool_prefix](https://link.juejin.cn/?target=https%3A%2F%2Fwww.elastic.co%2Fguide%2Fen%2Felasticsearch%2Freference%2F7.13%2Fquery-dsl-match-bool-prefix-query.html) 查询，并且合并每个字段的评分作为评分结果。

:::details multi_match 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "multi_match": {
      "query": 34.98,
      "fields": [
        "taxful_total_price",
        "taxless_total_*" # 可以使用通配符
      ]
    }
  }
}
```

:::

## 词项级别查询

**`Term`（词项）是表达语意的最小单位**。搜索和利用统计语言模型进行自然语言处理都需要处理 Term。

全文查询在执行查询之前会分析查询字符串。与全文查询不同，**词项级别查询不会分词**，而是将输入作为一个整体，在倒排索引中查找准确的词项。并且使用相关度计算公式为每个包含该词项的文档进行相关度计算。一言以概之：**词项查询是对词项进行精确匹配**。词项查询通常用于结构化数据，如数字、日期和枚举类型。

词项查询有以下类型：

- **[exists](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html)** - 返回在指定字段上有值的文档。
- **[fuzzy](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html)** - 模糊查询，返回包含与搜索词相似的词的文档。
- **[ids](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html)** - 根据 ID 返回文档。此查询使用存储在 `_id` 字段中的文档 ID。
- **[prefix](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-prefix-query.html)** - 前缀查询，用于查询某个字段中包含指定前缀的文档。
- **[range](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)** - 范围查询，用于匹配在某一范围内的数值型、日期类型或者字符串型字段的文档。
- **[regexp](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html)** - 正则匹配查询，返回与正则表达式相匹配的词项所属的文档。
- **[term](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html)** - 用来查找指定字段中包含给定单词的文档。
- **[terms](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html)** - 与 [**`term`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html) 相似，但可以搜索多个值。
- **[terms set](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-set-query.html)** - 与 [**`term`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html) 相似，但可以定义返回文档所需的匹配词数。
- **[wildcard](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html)** - 通配符查询，返回与通配符模式匹配的文档。

### exists（字段不为空查询）

[**`exists`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html) 返回在指定字段上有值的文档。

由于多种原因，文档字段可能不存在索引值：

- JSON 中的字段为 `null` 或 `[]`
- 该字段在 mapping 中配置了 `"index" : false`
- 字段值的长度超过了 mapping 中的 `ignore_above` 设置
- 字段值格式错误，并且在 mapping 中定义了 `ignore_malformed`

:::details exists 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "exists": {
      "field": "email"
    }
  }
}
```

:::

### fuzzy（模糊查询）

[**`fuzzy`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html) 返回包含与搜索词相似的词的文档。ES 使用 [Levenshtein edit distance（Levenshtein 编辑距离）](https://en.wikipedia.org/wiki/Levenshtein_distance) 测量相似度或模糊度。

编辑距离是将一个术语转换为另一个术语所需的单个字符更改的数量。这些变化可能包括：

- 改变一个字符：（**b**ox -> **f**ox）
- 删除一个字符：（**b**lack -> lack）
- 插入一个字符：（sic -> sic**k**）
- 反转两个相邻字符：（**ac**t → **ca**t）

为了找到相似的词条，fuzzy query 会在指定的编辑距离内创建搜索词条的所有可能变体或扩展集。然后返回完全匹配任意扩展的文档。

注意：如果配置了 [`search.allow_expensive_queries`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html#query-dsl-allow-expensive-queries) ，则 fuzzy query 不能执行。

:::details fuzzy 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "fuzzy": {
      "customer_full_name": {
        "value": "mary"
      }
    }
  }
}
```

:::

### prefix（前缀查询）

[**`prefix`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-prefix-query.html#prefix-query-ex-request) 用于查询某个字段中包含指定前缀的文档。

比如查询 `user.id` 中含有以 `ki` 为前缀的关键词的文档，那么含有 `kind`、`kid` 等所有以 `ki` 开头关键词的文档都会被匹配。

:::details prefix 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "prefix": {
      "customer_full_name": {
        "value": "mar"
      }
    }
  }
}
```

:::

### range（范围查询）

[**`range`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html) 用于匹配在某一范围内的数值型、日期类型或者字符串型字段的文档。比如搜索哪些书籍的价格在 50 到 100 之间、哪些书籍的出版时间在 2015 年到 2019 年之间。**使用 range 查询只能查询一个字段，不能作用在多个字段上**。

`range` 查询支持的参数有以下几种：

- **`gt`** - 大于
- **`gte`** - 大于等于
- **`lt`** - 小于
- **`lte`** - 小于等于
- **`format`** - 如果字段是 Date 类型，可以设置日期格式化
- **`time_zone`** - 时区
- **`relation`** - 指示范围查询如何匹配范围字段的值。
  - **`INTERSECTS` (Default)** - 匹配与查询字段值范围相交的文档。
  - **`CONTAINS`** - 匹配完全包含查询字段值的文档。
  - **`WITHIN`** - 匹配具有完全在查询范围内的范围字段值的文档。

:::details range 示例

数值范围查询示例：

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "range": {
      "taxful_total_price": {
        "gt": 10,
        "lte": 50
      }
    }
  }
}
```

日期范围查询示例：

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "range": {
      "order_date": {
        "time_zone": "+00:00",
        "gte": "2018-01-01T00:00:00",
        "lte": "now"
      }
    }
  }
}
```

:::

### regexp（正则匹配查询）

[**`regexp`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html) 返回与正则表达式相匹配的词项所属的文档。[正则表达式](https://zh.wikipedia.org/zh-hans/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F) 是一种使用占位符字符匹配数据模式的方法，称为运算符。

注意：如果配置了 [`search.allow_expensive_queries`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html#query-dsl-allow-expensive-queries) ，则 [**`regexp query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html) 会被禁用。

:::details regexp 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "regexp": {
      "email": ".*@.*-family.zzz"
    }
  }
}
```

:::

### term（词项匹配查询）

[**`term`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html) 用来查找指定字段中包含给定单词的文档，term 查询不被解析，只有查询词和文档中的词精确匹配才会被搜索到，应用场景为查询人名、地名等需要精准匹配的需求。

> 注意：**应避免 term 查询对 text 字段使用查询**。默认情况下，Elasticsearch 针对 text 字段的值进行解析分词，这会使查找 text 字段值的精确匹配变得困难。要搜索 text 字段值，需改用 match 查询。
>

:::details term 示例

```bash
# 1. 创建一个索引
DELETE my-index-000001
PUT my-index-000001
{
  "mappings": {
    "properties": {
      "full_text": { "type": "text" }
    }
  }
}

# 2. 使用 "Quick Brown Foxes!" 关键字查 "full_text" 字段
PUT my-index-000001/_doc/1
{
  "full_text": "Quick Brown Foxes!"
}

# 3. 使用 term 查询
GET my-index-000001/_search?pretty
{
  "query": {
    "term": {
      "full_text": "Quick Brown Foxes!"
    }
  }
}
# 因为 full_text 字段不再包含确切的 Term —— "Quick Brown Foxes!"，所以 term query 搜索不到任何结果

# 4. 使用 match 查询
GET my-index-000001/_search?pretty
{
  "query": {
    "match": {
      "full_text": "Quick Brown Foxes!"
    }
  }
}

DELETE my-index-000001
```

> :warning: 注意：应避免 term 查询对 text 字段使用查询。
>
> 默认情况下，Elasticsearch 针对 text 字段的值进行解析分词，这会使查找 text 字段值的精确匹配变得困难。
>
> 要搜索 text 字段值，需改用 match 查询。

:::

### terms（多词项匹配查询）

[**`terms`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html) 与 [**`term`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html) 相同，但可以搜索多个值。

terms query 查询参数：

- **`index`**：索引名
- **`id`**：文档 ID
- **`path`**：要从中获取字段值的字段的名称，即搜索关键字
- **`routing`**（选填）：要从中获取 term 值的文档的自定义路由值。如果在索引文档时提供了自定义路由值，则此参数是必需的。

:::details terms 示例

```bash
# 1. 创建一个索引
DELETE my-index-000001
PUT my-index-000001
{
  "mappings": {
    "properties": {
      "color": { "type": "keyword" }
    }
  }
}

# 2. 写入一个文档
PUT my-index-000001/_doc/1
{
  "color": [
    "blue",
    "green"
  ]
}

# 3. 写入另一个文档
PUT my-index-000001/_doc/2
{
  "color": "blue"
}

# 3. 使用 terms query
GET my-index-000001/_search?pretty
{
  "query": {
    "terms": {
      "color": {
        "index": "my-index-000001",
        "id": "2",
        "path": "color"
      }
    }
  }
}

DELETE my-index-000001
```

:::

### wildcard（通配符查询）

[**`wildcard`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html) 即通配符查询，返回与通配符模式匹配的文档。

`?` 用来匹配一个任意字符，`*` 用来匹配零个或者多个字符。

注意：如果配置了 [`search.allow_expensive_queries`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html#query-dsl-allow-expensive-queries) ，则 [**`wildcard query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html) 会被禁用。

:::details wildcard 示例

示例：以下搜索返回 `user.id` 字段包含以 `ki` 开头并以 `y` 结尾的术语的文档。这些匹配项可以包括 `kiy`、`kity` 或 `kimchy`。

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "wildcard": {
      "email": {
        "value": "*@underwood-family.zzz",
        "boost": 1,
        "rewrite": "constant_score"
      }
    }
  }
}
```

:::

## 复合查询

复合查询就是把一些简单查询组合在一起实现更复杂的查询需求，除此之外，复合查询还可以控制另外一个查询的行为。

复合查询有以下类型：

- [`bool`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html) - 布尔查询，可以组合多个过滤语句来过滤文档。
- [`boosting`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-boosting-query.html) - 提供调整相关性打分的能力，在 `positive` 块中指定匹配文档的语句，同时降低在 `negative` 块中也匹配的文档的得分。
- [`constant_score`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-constant-score-query.html) - 使用 `constant_score` 可以将 `query` 转化为 `filter`，filter 可以忽略相关性算分的环节，并且 filter 可以有效利用缓存，从而提高查询的性能。
- [`dis_max`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-dis-max-query.html) - 返回匹配了一个或者多个查询语句的文档，但只将最佳匹配的评分作为相关性算分返回。
- [`function_score`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html) - 支持使用函数来修改查询返回的分数。

### bool （布尔查询）

[`bool`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html) 查询可以把任意多个简单查询组合在一起，使用 `must`、`should`、`must_not`、`filter` 选项来表示简单查询之间的逻辑，每个选项都可以出现 0 次到多次，它们的含义如下：

- `must` - 文档必须匹配 must 选项下的查询条件，相当于逻辑运算的 AND，且参与文档相关度的评分。
- `should` - 文档可以匹配 should 选项下的查询条件也可以不匹配，相当于逻辑运算的 OR，且参与文档相关度的评分。
- `must_not` - 与 must 相反，匹配该选项下的查询条件的文档不会被返回；需要注意的是，**must_not 语句不会影响评分，它的作用只是将不相关的文档排除**。
- `filter` - 和 must 一样，匹配 filter 选项下的查询条件的文档才会被返回，**但是 filter 不评分，只起到过滤功能，与 must_not 相反**。

:::details bool 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "bool": {
      "filter": {
        "term": {
          "type": "order"
        }
      },
      "must_not": {
        "range": {
          "taxful_total_price": {
            "gte": 30
          }
        }
      },
      "should": [
        {
          "match": {
            "day_of_week": "Sunday"
          }
        },
        {
          "match": {
            "category": "Clothing"
          }
        }
      ],
      "minimum_should_match": 1
    }
  }
}
```

:::

### boosting

[boosting](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-boosting-query.html) 提供了调整相关性打分的能力。

boosting 查询包括 `positive`、`negative` 和 `negative_boost` 三个部分。`positive` 中的查询评分保持不变；`negative` 中的查询会降低文档评分；相关性算分降低的程度将由 `negative_boost` 参数决定，其取值范围为：`[0.0, 1.0]`。

:::details boosting 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "boosting": {
      "positive": {
        "term": {
          "day_of_week": "Monday"
        }
      },
      "negative": {
        "range": {
          "taxful_total_price": {
            "gte": "30"
          }
        }
      },
      "negative_boost": 0.2
    }
  }
}
```

:::

### constant_score

使用 [`constant_score`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-constant-score-query.html) 可以将 `query` 转化为 `filter`，可以忽略相关性算分的环节，并且 filter 可以有效利用缓存，从而提高查询的性能。

:::details constant_score 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "day_of_week": "Monday"
        }
      },
      "boost": 1.2
    }
  }
}
```

:::

### dis_max

[dis_max](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-dis-max-query.html) 查询与 bool 查询有一定联系也有一定区别，`dis_max` 查询支持多并发查询，可返回与任意查询条件子句匹配的任何文档类型。与 `bool` 查询可以将所有匹配查询的分数相结合使用的方式不同，`dis_max` 查询只使用最佳匹配查询条件的分数。

:::details dis_max 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "dis_max": {
      "queries": [
        {
          "term": {
            "currency": "EUR"
          }
        },
        {
          "term": {
            "day_of_week": "Sunday"
          }
        }
      ],
      "tie_breaker": 0.7
    }
  }
}
```

:::

### function_score

[function_score](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html) 查询可以修改查询的文档得分，这个查询在有些情况下非常有用，比如通过评分函数计算文档得分代价较高，可以改用过滤器加自定义评分函数的方式来取代传统的评分方式。

使用 `function_score` 查询，用户需要定义一个查询和一至多个评分函数，评分函数会对查询到的每个文档分别计算得分。

`function_score` 查询提供了以下几种算分函数：

- [**`script_score`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-script-score) - 利用自定义脚本完全控制算分逻辑。
- [**`weight`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-weight) - 为每一个文档设置一个简单且不会被规范化的权重。
- [**`random_score`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-random) - 为每个用户提供一个不同的随机算分，对结果进行排序。
- [**`field_value_factor`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-field-value-factor) - 使用文档字段的值来影响算分，例如将好评数量这个字段作为考虑因数。
- [**`decay functions`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html#function-decay) - 衰减函数，以某个字段的值为标准，距离指定值越近，算分就越高。例如我想让书本价格越接近 10 元，算分越高排序越靠前。

:::details function_score 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "function_score": {
      "query": { "match_all": {} },
      "boost": "5",
      "functions": [
        {
          "filter": { "match": { "day_of_week": "Sunday" } },
          "random_score": {},
          "weight": 23
        },
        {
          "filter": { "match": { "day_of_week": "Monday" } },
          "weight": 42
        }
      ],
      "max_boost": 42,
      "score_mode": "max",
      "boost_mode": "multiply",
      "min_score": 42
    }
  }
}
```

:::

## 推荐搜索

ES 通过 [**`Suggester`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html) 提供了推荐搜索能力，可以用于文本纠错，文本自动补全等场景。

根据使用场景的不同，ES 提供了以下 4 种 Suggester：

- **Term Suggester** - 基于词项的纠错补全。
- **Phrase Suggester** - 基于短语的纠错补全。
- **Completion Suggester** - 自动补全单词，输入词语的前半部分，自动补全单词。
- **Context Suggester** - 基于上下文的补全提示，可以实现上下文感知推荐。

### Term Suggester

Term Suggester **提供了基于单词的纠错、补全功能，其工作原理是基于编辑距离（edit distance）来运作的，编辑距离的核心思想是一个词需要改变多少个字符就可以和另一个词一致**。所以如果一个词转化为原词所需要改动的字符数越少，它越有可能是最佳匹配。

:::details term suggester 示例

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "match": {
      "day_of_week": "Sund"
    }
  },
  "suggest": {
    "my_suggest": {
      "text": "Sund",
      "term": {
        "suggest_mode": "missing",
        "field": "day_of_week"
      }
    }
  }
}
```

响应结果：

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    // 略
  },
  "suggest": {
    "my_suggest": [
      {
        "text": "Sund",
        "offset": 0,
        "length": 4,
        "options": [
          {
            "text": "Sunday",
            "score": 0.5,
            "freq": 614
          }
        ]
      }
    ]
  }
}
```

:::

Term Suggester API 有很多参数，比较常用的有以下几个：

- **text** - 指定了需要产生建议的文本，一般是用户的输入内容。
- **field** - 指定从文档的哪个字段中获取建议。
- **suggest_mode** - 设置建议的模式。其值有以下几个选项：
  - `missing` - 如果索引中存在就不进行建议，默认的选项。
  - `popular` - 推荐出现频率更高的词。
  - `always` - 不管是否存在，都进行建议。
- **analyzer** - 指定分词器来对输入文本进行分词，默认与 field 指定的字段设置的分词器一致。
- **size** - 为每个单词提供的最大建议数量。
- **sort** - 建议结果排序的方式，有以下两个选项 -
  - `score` - 先按相似性得分排序，然后按文档频率排序，最后按词项本身（字母顺序的等）排序。
  - `frequency` - 先按文档频率排序，然后按相似性得分排序，最后按词项本身排序。

### Phrase Suggester

**Phrase Suggester 在 Term Suggester 的基础上增加了一些额外的逻辑，因为是短语形式的建议，所以会考量多个 term 间的关系，比如相邻的程度、词频等**。

:::details phrase suggester 示例

```bash
GET kibana_sample_data_logs/_search
{
  "suggest": {
    "text": "Firefix",
    "simple_phrase": {
      "phrase": {
        "field": "agent",
        "direct_generator": [ {
          "field": "agent",
          "suggest_mode": "always"
        } ],
        "highlight": {
          "pre_tag": "<em>",
          "post_tag": "</em>"
        }
      }
    }
  }
}
```

响应结果：

```json
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : // 略
  "hits" : // 略
  "suggest" : {
    "simple_phrase" : [
      {
        "text" : "Firefix",
        "offset" : 0,
        "length" : 7,
        "options" : [
          {
            "text" : "firefox",
            "highlighted" : "<em>firefox</em>",
            "score" : 0.2000096
          }
        ]
      }
    ]
  }
}
```

:::

Phrase Suggester 可用的参数也是比较多的，下面介绍几个用得比较多的参数选项 -

- `max_error` - 指定最多可以拼写错误的词语的个数。
- `confidence` - 其作用是用来控制返回结果条数的。如果用户输入的数据（短语）得分为 N，那么返回结果的得分需要大于 `N * confidence`。`confidence` 默认值为 1.0。
- `highlight` - 高亮被修改后的词语。

### Completion Suggester

**Completion Suggester 提供了自动补全的功能**。

**Completion Suggester 在实现的时候会将 analyze（将文本分词，并且去除没用的词语，例如 is、at 这样的词语） 后的数据进行编码，构建为 FST 并且和索引存放在一起**。FST（**[finite-state transducer](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFinite-state_transducer)**）是一种高效的前缀查询索引。由于 FST 天生为前缀查询而生，所以其非常适合实现自动补全的功能。ES 会将整个 FST 加载到内存中，所以在使用 FST 进行前缀查询的时候效率是非常高效的。

在使用 Completion Suggester 前需要定义 Mapping，对应的字段需要使用 “completion” type。

:::details completion suggester 示例

构造用于自动补全的测试数据：

```bash
# 先删除原来的索引
DELETE music

# 新增 type 字段，类型为 completion，用于自动补全测试
PUT music
{
  "mappings": {
    "properties": {
      "suggest": {
        "type": "completion"
      }
    }
  }
}

# 添加推荐
PUT music/_doc/1?refresh
{
  "suggest" : {
    "input": [ "Nevermind", "Nirvana" ],
    "weight" : 34
  }
}
PUT music/_doc/1?refresh
{
  "suggest": [
    {
      "input": "Nevermind",
      "weight": 10
    },
    {
      "input": "Nirvana",
      "weight": 3
    }
  ]
}
```

获取推荐：

```bash
POST music/_search
{
  "suggest": {
    "song-suggest": {
      "prefix": "nir",
      "completion": {
        "field": "suggest",
        "size": 5,
        "skip_duplicates": true
      }
    }
  }
}
```

:::

### Context Suggester

**Context Suggester 是 Completion Suggester 的扩展，可以实现上下文感知推荐**。

ES 支持两种类型的上下文：

- **Category**：任意字符串的分类。
- **Geo**：地理位置信息。

在使用 Context Suggester 前需要定义 Mapping，然后在数据中加入相关的 Context 信息。

:::details context suggester 示例

构造用于 Context Suggester 的测试数据：

```bash
# 删除原来的索引
DELETE books_context

# 创建用于测试 Context Suggester 的索引
PUT books_context
{
  "mappings": {
	"properties": {
		"book_id": {
		  "type": "keyword"
		},
		"name": {
		  "type": "text",
		  "analyzer": "standard"
		},
		"name_completion": {
		  "type": "completion",
		  "contexts": [
			{
			  "name": "book_type",
			  "type": "category"
			}
		  ]
		},
		"author": {
		  "type": "keyword"
		},
		"intro": {
		  "type": "text"
		},
		"price": {
		  "type": "double"
		},
		"date": {
		  "type": "date"
		}
	  }
  },
  "settings": {
	"number_of_shards": 3,
	"number_of_replicas": 1
  }
}

# 导入测试数据
PUT books_context/_doc/4
{
  "book_id": "4ee82465",
  "name": "Linux Programming",
  "name_completion": {
	"input": ["Linux Programming"],
	"contexts": {
	  "book_type": "program"
	}
  },
  "author": "Richard Stones",
  "intro": "Happy to Linux Programming",
  "price": 10.9,
  "date": "2022-06-01"
}
PUT books_context/_doc/5
{
  "book_id": "4ee82466",
  "name": "Linus Autobiography",
  "name_completion": {
	"input": ["Linus Autobiography"],
	"contexts": {
	  "book_type": "autobiography"
	}
  },
  "author": "Linus",
  "intro": "Linus Autobiography",
  "price": 14.9,
  "date": "2012-06-01"
}
```

执行 Context Suggester 查询：

```bash
POST books_context/_search
{
  "suggest": {
    "my_suggest": {
      "prefix": "linu",
      "completion": {
        "field": "name_completion",
        "contexts": {
          "book_type": "autobiography"
        }
      }
    }
  }
}
```

:::

## 参考资料

- [极客时间教程 - Elasticsearch 核心技术与实战](https://time.geekbang.org/course/detail/100030501-102659)
- [Elasticsearch 从入门到实践之全文搜索 API 实践](https://www.itshujia.com/read/elasticsearch/344.html)
- [Elasticsearch 从入门到实践之 Term Query API 实践](https://www.itshujia.com/read/elasticsearch/345.html)
- [Elasticsearch 从入门到实践之组合查询](https://www.itshujia.com/read/elasticsearch/346.html)
- [Elasticsearch 从入门到实践之 Suggesters API](https://www.itshujia.com/read/elasticsearch/347.html)
- [Elasticsearch 官方文档之全文查询](https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html)
- [Elasticsearch 官方文档之词项查询](https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html)
- [Elasticsearch 官方文档之组合查询](https://www.elastic.co/guide/en/elasticsearch/reference/current/compound-queries.html)
- [Elasticsearch 官方文档之推荐查询](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html)
- [Elasticsearch 官方文档之查询和过滤上下文](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html)