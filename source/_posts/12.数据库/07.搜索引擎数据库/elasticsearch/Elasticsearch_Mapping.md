---
icon: logos:elasticsearch
title: Elasticsearch Mapping
date: 2022-02-22 21:01:01
categories:
  - 数据库
  - 搜索引擎数据库
  - elasticsearch
tags:
  - 数据库
  - 搜索引擎数据库
  - elasticsearch
  - mapping
  - 数据类型
permalink: /pages/0738dca8/
---

# Elasticsearch Mapping

::: info 概述

本文介绍了 Elasticsearch 常用的数据类型，以及如何在 Elasticsearch 中通过 Mapping 定义字段的数据类型。

:::

<!-- more -->

## Mapping 简介

在 Elasticsearch 中，**`Mapping`**（映射），用来定义一个文档以及其所包含的字段如何被存储和索引，可以在映射中事先定义字段的数据类型、字段的权重、分词器等属性，就如同在关系型数据库中创建数据表时会设置字段的类型。简言之，**Mapping 定义了索引中的文档有哪些字段及其类型、这些字段是如何存储和索引的，就好像数据库的表定义一样。**

Mapping 会把 json 文档映射成 Lucene 所需要的扁平格式

一个 Mapping 属于一个索引的 Type

- 每个文档都属于一个 Type
- 一个 Type 有一个 Mapping 定义
- 7.0 开始，不需要在 Mapping 定义中指定 type 信息

每个 `document` 都是 `field` 的集合，每个 `field` 都有自己的数据类型。映射数据时，可以创建一个 `mapping`，其中包含与 `document` 相关的 `field` 列表。映射定义还包括元数据 `field`，例如 `_source` ，它自定义如何处理 `document` 的关联元数据。

## 映射分类

在 Elasticsearch 中，映射可分为**静态映射**和**动态映射**。在关系型数据库中写入数据之前首先要建表，在建表语句中声明字段的属性，在 Elasticsearch 中，则不必如此，Elasticsearch 最重要的功能之一就是让你尽可能快地开始探索数据，文档写入 Elasticsearch 中，它会根据字段的类型自动识别，这种机制称为**动态映射**，而**静态映射**则是写入数据之前对字段的属性进行手工设置。

### 静态映射

Elasticsearch 官方将静态映射称为**显式映射（[Explicit mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/explicit-mapping.html)）**。**静态映射**是在创建索引时手工指定索引映射。静态映射和 SQL 中在建表语句中指定字段属性类似。相比动态映射，通过静态映射可以添加更详细、更精准的配置信息。

例如：

- 哪些字符串字段应被视为全文字段。
- 哪些字段包含数字、日期或地理位置。
- 日期值的格式。
- 用于控制动态添加字段的自定义规则。

【示例】创建索引时，显示指定 mapping

```javascript
PUT /my-index-000001
{
  "mappings": {
    "properties": {
      "age":    { "type": "integer" },
      "email":  { "type": "keyword"  },
      "name":   { "type": "text"  }
    }
  }
}
```

【示例】在已存在的索引中，指定一个 field 的属性

```javascript
PUT /my-index-000001/_mapping
{
  "properties": {
    "employee-id": {
      "type": "keyword",
      "index": false
    }
  }
}
```

【示例】查看 mapping

```
GET /my-index-000001/_mapping
```

【示例】查看指定 field 的 mapping

```
GET /my-index-000001/_mapping/field/employee-id
```

### 动态映射

动态映射机制，允许用户不手动定义映射，Elasticsearch 会自动识别字段类型。在实际项目中，如果遇到的业务在导入数据之前不确定有哪些字段，也不清楚字段的类型是什么，使用动态映射非常合适。当 Elasticsearch 在文档中碰到一个以前没见过的字段时，它会利用动态映射来决定该字段的类型，并自动把该字段添加到映射中。

示例：创建一个名为 `data` 的索引、其 `mapping` 类型为 `_doc`，并且有一个类型为 `long` 的字段 `count`。

```bash
PUT data/_doc/1
{ "count": 5 }
```

### 动态字段映射

动态字段映射（[Dynamic field mappings](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-field-mapping.html)）是用于管理动态字段检测的规则。当 Elasticsearch 在文档中检测到新字段时，默认情况下会动态将该字段添加到类型映射中。

在 mapping 中可以通过将 [`dynamic`](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic.html) 参数设置为 `true` 或 `runtime` 来开启动态映射。

[`dynamic`](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic.html) 不同设置的作用：

| 可选值    | 说明                                                                                                                |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| `true`    | 新字段被添加到 mapping 中。mapping 的默认设置。                                                                     |
| `runtime` | 新字段被添加到 mapping 中并作为运行时字段——这些字段不会被索引，但是可以在查询时出现在 `_source` 中。                |
| `false`   | 新字段不会被索引或搜索，但仍会出现在返回匹配的 `_source` 字段中。这些字段不会添加到映射中，并且必须显式添加新字段。 |
| `strict`  | 如果检测到新字段，则会抛出异常并拒绝文档。必须将新字段显式添加到映射中。                                            |

> 需要注意的是：对已有字段，一旦已经有数据写入，就不再支持修改字段定义。如果希望改变字段类型，必须重建索引。这是由于 Lucene 实现的倒排索引，一旦生成后，就不允许修改。如果修改了字段的数据类型，会导致已被索引的字段无法被搜索。

启用动态字段映射后，Elasticsearch 使用内置规则来确定如何映射每个字段的数据类型。规则如下：

| **JSON 数据类型**                                                                                                                      | **`"dynamic":"true"`**                  | **`"dynamic":"runtime"`**   |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------- |
| `null`                                                                                                                                 | 没有字段被添加                          | 没有字段被添加              |
| `true` or `false`                                                                                                                      | `boolean` 类型                          | `boolean` 类型              |
| 浮点型数字                                                                                                                             | `float` 类型                            | `double` 类型               |
| 数字                                                                                                                                   | 数字型                                  | `long` 类型                 |
| JSON 对象                                                                                                                              | `object` 类型                           | 没有字段被添加              |
| 数组                                                                                                                                   | 由数组中第一个非空值决定                | 由数组中第一个非空值决定    |
| 开启 [日期检测](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-field-mapping.html#date-detection) 的字符串    | `date` 类型                             | `date` 类型                 |
| 开启 [数字检测](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-field-mapping.html#numeric-detection) 的字符串 | `float` 类型或 `long`类型               | `double` 类型或 `long` 类型 |
| 什么也没开启的字符串                                                                                                                   | 带有 `.keyword` 子 field 的 `text` 类型 | `keyword` 类型              |

下面举一个例子认识动态 mapping，在 Elasticsearch 中创建一个新的索引并查看它的 mapping，命令如下：

```bash
PUT books
GET books/_mapping
```

此时 books 索引的 mapping 是空的，返回结果如下：

```json
{
  "books": {
    "mappings": {}
  }
}
```

再往 books 索引中写入一条文档，命令如下：

```bash
PUT books/it/1
{
	"id": 1,
	"publish_date": "2019-11-10",
	"name": "master Elasticsearch"
}
```

文档写入完成之后，再次查看 mapping，返回结果如下：

```json
{
  "books": {
    "mappings": {
      "properties": {
        "id": {
          "type": "long"
        },
        "name": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "publish_date": {
          "type": "date"
        }
      }
    }
  }
}
```

动态映射有时可能会错误的识别字段类型，这种情况下，可能会导致一些功能无法正常使用，如 Range 查询。所以，使用动态 mapping 要结合实际业务需求来综合考虑，如果将 Elasticsearch 当作主要的数据存储使用，并且希望出现未知字段时抛出异常来提醒你注意这一问题，那么开启动态 mapping 并不适用。

### 动态模板

**动态模板（[dynamic templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-templates.html)）**是用于给 `mapping` 动态添加字段的自定义规则。

动态模板可以设置匹配条件，只有匹配的情况下才使用动态模板：

- `match_mapping_type` 对 Elasticsearch 检测到的数据类型进行操作
- `match` 和 `unmatch` 使用模式匹配字段名称
- `path_match` 和 `path_unmatch` 对字段的完整虚线路径进行操作
- 如果动态模板没有定义 `match_mapping_type`、`match` 或 `path_match`，则不会匹配任何字段。您仍然可以在批量请求的 `dynamic_templates` 部分按名称引用模板。

【示例】当设置 `'dynamic':'true'` 时，Elasticsearch 会将字符串字段映射为带有关键字子字段的文本字段。如果只是索引结构化内容并且对全文搜索不感兴趣，可以让 Elasticsearch 仅将字段映射为关键字字段。这种情况下，只有完全匹配才能搜索到这些字段。

```javascript
PUT my-index-000001
{
  "mappings": {
    "dynamic_templates": [
      {
        "strings_as_keywords": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "keyword"
          }
        }
      }
    ]
  }
}
```

## 运行时字段

运行时字段是在查询时评估的字段。运行时字段有以下作用：

- 在不重新索引数据的情况下，向现有文档添加字段
- 在不了解数据结构的情况下，也可以处理数据
- 在查询时覆盖从索引字段返回的值
- 为特定用途定义字段而不修改底层架构

检索 Elasticsearch 时，运行时字段和其他字段并没有什么不同。

需要注意的是：使用 `_search` API 上的 `fields` 参数来检索运行时字段的值。运行时字段不会显示在 `_source` 中，但 `fields` API 适用于所有字段，即使是那些未作为原始 `_source` 的一部分发送的字段。

运行时字段在处理日志数据时很有用，尤其是当日志是不确定的数据结构时：这种情况下，会降低搜索速度，但您的索引大小要小得多，您可以更快地处理日志，而无需为它们设置索引。

因为**运行时字段没有被索引**，所以添加运行时字段不会增加索引大小。用户可以直接在 mapping 中定义运行时字段，从而节省存储成本并提高采集数据的速度。定义了运行时字段后，可以立即在搜索请求、聚合、过滤和排序中使用它。

如果将运行时字段设为索引字段，则无需修改任何引用运行时字段的查询。更好的是，您可以引用字段是运行时字段的一些索引，以及字段是索引字段的其他索引。您可以灵活地选择要索引哪些字段以及保留哪些字段作为运行时字段。

就其核心而言，运行时字段最重要的好处是能够在您提取字段后将字段添加到文档中。此功能简化了映射决策，因为您不必预先决定如何解析数据，并且可以使用运行时字段随时修改映射。使用运行时字段允许更小的索引和更快的摄取时间，这结合使用更少的资源并降低您的运营成本。

## 字段数据类型

在 Elasticsearch 中，每个字段都有一个字段数据类型或字段类型，用于指示字段包含的数据类型（例如字符串或布尔值）及其预期用途。字段类型按系列分组。同一族中的类型具有完全相同的搜索行为，但可能具有不同的空间使用或性能特征。

Elasticsearch 提供了非常丰富的数据类型，官方将其分为以下几类：

- **普通类型**
  - [`binary`](https://www.elastic.co/guide/en/elasticsearch/reference/current/binary.html)：编码为 Base64 字符串的二进制值。
  - [`boolean`](https://www.elastic.co/guide/en/elasticsearch/reference/current/boolean.html)：布尔类型，值为 true 或 false。
  - [Keywords](https://www.elastic.co/guide/en/elasticsearch/reference/current/keyword.html)：keyword 族类型，包括 `keyword`、`constant_keyword` 和 `wildcard`。
  - [Numbers](https://www.elastic.co/guide/en/elasticsearch/reference/current/number.html)：数字类型，如 `long` 和 `double`
  - **Dates**：日期类型，包括 [`date`](https://www.elastic.co/guide/en/elasticsearch/reference/current/date.html) 和 [`date_nanos`](https://www.elastic.co/guide/en/elasticsearch/reference/current/date_nanos.html)。
  - [`alias`](https://www.elastic.co/guide/en/elasticsearch/reference/current/field-alias.html)：用于定义存在字段的别名。
- **对象类型**
  - [`object`](https://www.elastic.co/guide/en/elasticsearch/reference/current/object.html)：JSON 对象
  - [`flattened`](https://www.elastic.co/guide/en/elasticsearch/reference/current/flattened.html)：整个 JSON 对象作为单个字段值。
  - [`nested`](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html)：保留其子字段之间关系的 JSON 对象。
  - [`join`](https://www.elastic.co/guide/en/elasticsearch/reference/current/parent-join.html)：为同一索引中的文档定义父/子关系。
- **结构化数据类型**

  - [Range](https://www.elastic.co/guide/en/elasticsearch/reference/current/range.html)：范围类型，例如：`long_range`、`double_range`、`date_range` 和 `ip_range`。
  - [`ip`](https://www.elastic.co/guide/en/elasticsearch/reference/current/ip.html)：IPv4 和 IPv6 地址。
  - [`version`](https://www.elastic.co/guide/en/elasticsearch/reference/current/version.html)：版本号。支持 [Semantic Versioning](https://semver.org/) 优先规则。
  - [`murmur3`](https://www.elastic.co/guide/en/elasticsearch/plugins/8.2/mapper-murmur3.html)：计算并存储 hash 值。

- **聚合数据类型**

  - [`aggregate_metric_double`](https://www.elastic.co/guide/en/elasticsearch/reference/current/aggregate-metric-double.html)：预先聚合的指标值
  - [`histogram`](https://www.elastic.co/guide/en/elasticsearch/reference/current/histogram.html)：直方图式的预聚合数值。

- **文本搜索类型**
  - [`text` fields](https://www.elastic.co/guide/en/elasticsearch/reference/current/text.html)：text 族类型，包括 `text` 和 `match_only_text`。
  - [`annotated-text`](https://www.elastic.co/guide/en/elasticsearch/plugins/8.2/mapper-annotated-text.html)：包含特殊标记的文本。用于识别命名实体。
  - [`completion`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html#completion-suggester)：用于自动补全。
  - [`search_as_you_type`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html)：键入时完成的类似文本的类型。
  - [`token_count`](https://www.elastic.co/guide/en/elasticsearch/reference/current/token-count.html)：文本中标记的计数。
- **文档排名类型**
  - [`dense_vector`](https://www.elastic.co/guide/en/elasticsearch/reference/current/dense-vector.html)：记录浮点数的密集向量。
  - [`rank_feature`](https://www.elastic.co/guide/en/elasticsearch/reference/current/rank-feature.html)：记录一个数字特征，为了在查询时提高命中率。
  - [`rank_features`](https://www.elastic.co/guide/en/elasticsearch/reference/current/rank-features.html)：记录多个数字特征，为了在查询时提高命中率。
- **空间数据类型**

  - [`geo_point`](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-point.html)：地理经纬度
  - [`geo_shape`](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-shape.html)：复杂的形状，例如多边形
  - [`point`](https://www.elastic.co/guide/en/elasticsearch/reference/current/point.html)：任意笛卡尔点
  - [`shape`](https://www.elastic.co/guide/en/elasticsearch/reference/current/shape.html)：任意笛卡尔几何形状

- **其他类型**
  - [`percolator`](https://www.elastic.co/guide/en/elasticsearch/reference/current/percolator.html)：使用 [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) 编写的索引查询

### 元数据字段

一个文档中，不仅仅包含数据 ，也包含**元数据**。元数据是用于描述文档的信息。

- **标识元数据字段**
  - [`_index`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-index-field.html)：文档所属的索引。
  - [`_id`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-id-field.html)：文档的 ID。
- **文档 source 元数据字段**
  - [`_source`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-source-field.html)：文档正文的原始 JSON。
  - [`_size`](https://www.elastic.co/guide/en/elasticsearch/plugins/8.2/mapper-size.html)：`_source` 字段的大小（以字节为单位），由 [`mapper-size`](https://www.elastic.co/guide/en/elasticsearch/plugins/8.2/mapper-size.html) 插件提供。
- **文档计数元数据字段**
  - [`_doc_count`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-doc-count-field.html)：当文档表示预聚合数据时，用于存储文档计数的自定义字段。
- **索引元数据字段**
  - [`_field_names`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-field-names-field.html)：文档中的所有非空字段。
  - [`_ignored`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-ignored-field.html)：文档中所有的由于 [`ignore_malformed`](https://www.elastic.co/guide/en/elasticsearch/reference/current/ignore-malformed.html) 而在索引时被忽略的字段。
- **路由元数据字段**
  - [`_routing`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-routing-field.html)：将文档路由到特定分片的自定义路由值。
- **其他元数据字段**
  - [`_meta`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-meta-field.html)：应用程序特定的元数据。
  - [`_tier`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-tier-field.html)：文档所属索引的当前数据层首选项。

## 映射参数

Elasticsearch 提供了以下映射参数：

- [`analyzer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer.html)：指定在索引或搜索文本字段时用于文本分析的分析器。
- [`coerce`](https://www.elastic.co/guide/en/elasticsearch/reference/current/coerce.html)：如果开启，Elasticsearch 将尝试清理脏数据以适应字段的数据类型。
- [`copy_to`](https://www.elastic.co/guide/en/elasticsearch/reference/current/copy-to.html)：允许将多个字段的值复制到一个组字段中，然后可以将其作为单个字段进行查询。
- [`doc_values`](https://www.elastic.co/guide/en/elasticsearch/reference/current/doc-values.html)：默认情况下，所有字段都是被
- [`dynamic`](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic.html)：是否开启动态映射。
- [`eager_global_ordinals`](https://www.elastic.co/guide/en/elasticsearch/reference/current/eager-global-ordinals.html)：当在 global ordinals 的时候，refresh 以后下一次查询字典就需要重新构建，在追求查询的场景下很影响查询性能。可以使用 eager_global_ordinals，即在每次 refresh 以后即可更新字典，字典常驻内存，减少了查询的时候构建字典的耗时。
- [`enabled`](https://www.elastic.co/guide/en/elasticsearch/reference/current/enabled.html)：只能应用于顶级 mapping 定义和 `object` 字段。设置为 `false` 后，Elasticsearch 解析时，会完全跳过该字段。
- [`fielddata`](https://www.elastic.co/guide/en/elasticsearch/reference/current/fielddata.html)：默认情况下， `text` 字段是可搜索的，但不可用于聚合、排序或脚本。如果为字段设置 `fielddata=true`，就会通过反转倒排索引将 fielddata 加载到内存中。请注意，这可能会占用大量内存。如果想对 `text` 字段进行聚合、排序或脚本操作，fielddata 是唯一方法。
- [`fields`](https://www.elastic.co/guide/en/elasticsearch/reference/current/multi-fields.html)：有时候，同一个字段需要以不同目的进行索引，此时可以通过 `fields` 进行配置。
- [`format`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-date-format.html)：用于格式化日期类型。
- [`ignore_above`](https://www.elastic.co/guide/en/elasticsearch/reference/current/ignore-above.html)：字符串长度大于 `ignore_above` 所设，则不会被索引或存储。
- [`ignore_malformed`](https://www.elastic.co/guide/en/elasticsearch/reference/current/ignore-malformed.html)：有时候，同一个字段，可能会存储不同的数据类型。默认情况下，Elasticsearch 解析字段数据类型失败时，会引发异常，并拒绝整个文档。 如果设置 `ignore_malformed` 为 `true`，则允许忽略异常。这种情况下，格式错误的字段不会被索引，但文档中的其他字段可以正常处理。
- [`index_options`](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-options.html) 用于控制将哪些信息添加到倒排索引以进行搜索和突出显示。只有 `text` 和 `keyword` 等基于术语（term）的字段类型支持此配置。
- [`index_phrases`](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-phrases.html)：如果启用，两个词的组合（shingles）将被索引到一个单独的字段中。这允许以更大的索引为代价，更有效地运行精确的短语查询（无 slop）。请注意，当停用词未被删除时，此方法效果最佳，因为包含停用词的短语将不使用辅助字段，并将回退到标准短语查询。接受真或假（默认）。
- [`index_prefixes`](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-prefixes.html)：index_prefixes 参数启用 term 前缀索引以加快前缀搜索。
- [`index`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-index.html)：`index` 选项控制字段值是否被索引。默认为 true。
- [`meta`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-field-meta.html)：附加到字段的元数据。此元数据对 Elasticsearch 是不透明的，它仅适用于多个应用共享相同索引的元数据信息，例如：单位。
- [`normalizer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/normalizer.html)：`keyword` 字段的 `normalizer` 属性类似于 [`analyzer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer.html) ，只是它保证分析链只产生单个标记。 `normalizer` 在索引 `keyword` 之前应用，以及在搜索时通过查询解析器（例如匹配查询）或通过术语级别查询（例如术语查询）搜索关键字字段时应用。
- [`norms`](https://www.elastic.co/guide/en/elasticsearch/reference/current/norms.html)：`norms` 存储在查询时使用的各种规范化因子，以便计算文档的相关性评分。
- [`null_value`](https://www.elastic.co/guide/en/elasticsearch/reference/current/null-value.html)：null 值无法被索引和搜索。当一个字段被设为 null，则被视为没有值。`null_value` 允许将空值替换为指定值，以便对其进行索引和搜索。
- [`position_increment_gap`](https://www.elastic.co/guide/en/elasticsearch/reference/current/position-increment-gap.html)：分析的文本字段会考虑术语位置，以便能够支持邻近或短语查询。当索引具有多个值的文本字段时，值之间会添加一个“假”间隙，以防止大多数短语查询在值之间匹配。此间隙的大小使用 `position_increment_gap` 配置，默认为 100。
- [`properties`](https://www.elastic.co/guide/en/elasticsearch/reference/current/properties.html)：类型映射、对象字段和嵌套字段包含的子字段，都称为属性。这些属性可以是任何数据类型，包括对象和嵌套。
- [`search_analyzer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-analyzer.html)：通常，在索引时和搜索时应使用相同的分析器，以确保查询中的术语与倒排索引中的术语格式相同。但是，有时在搜索时使用不同的分析器可能是有意义的，例如使用 [`edge_ngram`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-edgengram-tokenizer.html) 标记器实现自动补全或使用同义词搜索时。
- [`similarity`](https://www.elastic.co/guide/en/elasticsearch/reference/current/similarity.html)：Elasticsearch 允许为每个字段配置文本评分算法或相似度。相似度设置提供了一种选择文本相似度算法的简单方法，而不是默认的 BM25，例如布尔值。只有 `text` 和 `keyword` 等基于文本的字段类型支持此配置。
- [`store`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-store.html)：默认情况下，对字段值进行索引以使其可搜索，但不会存储它们。这意味着可以查询该字段，但无法检索原始字段值。通常这不重要，字段值已经是默认存储的 `_source` 字段的一部分。如果您只想检索单个字段或几个字段的值，而不是整个 `_source`，则可以通过 [source filtering](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-fields.html#source-filtering) 来实现。
- [`term_vector`](https://www.elastic.co/guide/en/elasticsearch/reference/current/term-vector.html)：term_vector 包含有关分析过程产生的术语的信息，包括：
  - 术语列表
  - 每个 term 的位置（或顺序）
  - 起始和结束字符偏移量，用于将 term 和原始字符串进行映射
  - 有效负载（如果可用） - 用户定义的，与 term 位置相关的二进制数据

## 映射配置

- `index.mapping.total_fields.limit`：索引中的最大字段数。字段和对象映射以及字段别名计入此限制。默认值为 `1000`。
- `index.mapping.depth.limit`：字段的最大深度，以内部对象的数量来衡量。例如，如果所有字段都在根对象级别定义，则深度为 `1`。如果有一个对象映射，则深度为 `2`，以此类推。默认值为 `20`。
- `index.mapping.nested_fields.limit`：索引中不同 `nested` 映射的最大数量。 `nested` 类型只应在特殊情况下使用，即需要相互独立地查询对象数组。为了防止设计不佳的映射，此设置限制了每个索引的唯一 `nested` 类型的数量。默认值为 `50`。
- `index.mapping.nested_objects.limit`：单个文档中，所有 `nested` 类型中包含的最大嵌套 JSON 对象数。当文档包含太多 `nested` 对象时，此限制有助于防止出现内存溢出。默认值为 `10000`。
- `index.mapping.field_name_length.limit`：设置字段名称的最大长度。默认为 Long.MAX_VALUE（无限制）。

## 参考资料

- [Elasticsearch 官方文档之 Mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html)
- [Elasticsearch 从入门到实践之 Mapping](https://www.itshujia.com/read/elasticsearch/351.html)