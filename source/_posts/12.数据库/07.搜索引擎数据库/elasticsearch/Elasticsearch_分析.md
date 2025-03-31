---
icon: logos:elasticsearch
title: Elasticsearch 文本分析
cover: https://raw.githubusercontent.com/dunwu/images/master/snap/202503110802917.png
date: 2022-02-22 21:01:01
categories:
  - 数据库
  - 搜索引擎数据库
  - elasticsearch
tags:
  - 数据库
  - 搜索引擎数据库
  - elasticsearch
  - 分词
permalink: /pages/6bfb0fbf/
---

# Elasticsearch 文本分析

::: info 概述

Elasticsearch 中存储的数据可以粗略分为：

- **词项数据** - 采用**精确查询**。比较两条词项数据是否相对，实际是比较二者的二进制数据，结果只有相等或不相等。
- **文本数据** - 采用**全文搜索**。比较两个文本数据是否相等，没有太大意义，一般只会比较二者是否相似。相似性比较，是通过相关性评分来评估的。而计算相关性评分，需要对全文先分词处理，然后对分词后的词项进行统计才能进行相似性评估。

**Elasticsearch 文本分析是将非结构化文本转换为一组词项（term）的过程**。本文将介绍 Elasticsearch 文本分析的各个关键组件，以及文本分析的处理流程。

:::

## 文本分析简介

Elasticsearch 需要先对文本数据进行文本分析，将原文本分词处理，然后对分词后的词项进行统计才能进行相似性评估。有了相似性计算分值，才能进行相似性匹配。由此可见，文本分析是全文搜索的基础。

文本分析可以分为两个方面：

- **Tokenization（分词化）** - 分词化将文本分解成更小的块，称为分词。在大多数情况下，这些分词是单独的 term（词项）。
- **Normalization（标准化）** - 经过分词后的文本只能进行词项匹配，但是无法进行同义词匹配。为解决这个问题，可以将文本进行标准化处理。例如：将 `foxes` 标准化为 `fox`。

## Analyzer（分析器）

文本分析由 [**analyzer（分析器）**](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer-anatomy.html) 执行，分析器是一组控制整个过程的规则。在 Elasticsearch 中，无论读写，都需要使用分析器。

[**analyzer（分析器）**](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer-anatomy.html) 由三个组件组成：零个或多个 [Character Filters（字符过滤器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-charfilters.html)、有且仅有一个 [Tokenizer（分词器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenizers.html)、零个或多个 [Token Filters（分词过滤器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenfilters.html)。分析的执行顺序为：`character filters -> tokenizer -> token filters`。

![](https://raw.githubusercontent.com/dunwu/images/master/snap/202412012129250.png)

Elasticsearch 内置的分析器：

- [`standard`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-standard-analyzer.html) - 根据单词边界将文本划分为多个 term，如 Unicode 文本分割算法所定义。它删除了大多数标点符号、小写 term，并支持删除停用词。
- [`simple`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-simple-analyzer.html) - 遇到非字母字符时将文本划分为多个 term，并将其转为小写。
- [`whitespace`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-whitespace-analyzer.html) - 遇到任何空格时将文本划分为多个 term，不转换为小写。
- [`stop`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-stop-analyzer.html) - 与 [`simple`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-simple-analyzer.html) 相似，同时支持删除停用词（如：the、a、is）。
- [`keyword`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-keyword-analyzer.html) - 部分词，直接将输入当做输出。
- [`pattern`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-pattern-analyzer.html) - 使用正则表达式将文本拆分为 term。它支持小写和非索引字。
- [`fingerprint`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-fingerprint-analyzer.html) - 可创建用于重复检测的指纹。
- [语言分析器](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lang-analyzer.html) - 提供了 30 多种常见语言的分词器。

默认情况下，Elasticsearch 使用 [**standard analyzer（标准分析器）**](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-standard-analyzer.html)，它开箱即用，适用于大多数使用场景。Elasticsearch 也允许定制分析器。

### 测试分析器

[`_analyze` API](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-analyze.html) 是查看分析器如何分词的工具。

::: details 【示例】直接指定 analyzer 进行测试

查看不同的 analyzer 的效果

```json
GET _analyze
{
  "analyzer": "standard",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening."
}

GET _analyze
{
  "analyzer": "simple",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening."
}

GET _analyze
{
  "analyzer": "stop",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening."
}

GET _analyze
{
  "analyzer": "whitespace",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening."
}

GET _analyze
{
  "analyzer": "keyword",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening."
}

GET _analyze
{
  "analyzer": "pattern",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening."
}
```

:::

::: details 【示例】自由组合分析器组件进行测试

```json
POST _analyze
{
  "tokenizer": "standard",
  "filter":  [ "lowercase", "asciifolding" ],
  "text":      "Is this déja vu?"
}
```

:::

### 指定分析器

内置分析器可以直接使用，无需任何配置。但是，其中一些支持配置选项来更改其行为。

在搜索时，Elasticsearch 通过按顺序检查以下参数来确定要使用的分析器：

1. 搜索查询中的 [`analyzer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer.html) 参数。请参阅 [指定查询的搜索分析器](https://www.elastic.co/guide/en/elasticsearch/reference/current/specify-analyzer.html#specify-search-query-analyzer)。
2. 字段的 [`search_analyzer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-analyzer.html) 映射参数。请参阅 [为字段指定搜索分析器](https://www.elastic.co/guide/en/elasticsearch/reference/current/specify-analyzer.html#specify-search-field-analyzer)。
3. `analysis.analyzer.default_search` 索引设置。请参阅 [指定索引的默认搜索分析器](https://www.elastic.co/guide/en/elasticsearch/reference/current/specify-analyzer.html#specify-search-default-analyzer)。
4. 字段的 [`analyzer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer.html) mapping 参数。请参阅 [为字段指定分析器](https://www.elastic.co/guide/en/elasticsearch/reference/current/specify-analyzer.html#specify-index-field-analyzer)。

如果未指定这些参数，则使用 [`standard`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-standard-analyzer.html) 分析器。

::: details 【示例】设置索引的默认分析器

将 std_english 分析器定义为基于标准分析器，但配置为删除预定义的英语停用词列表

```json
PUT my-index-000001
{
  "settings": {
    "analysis": {
      "analyzer": {
        "std_english": {
          "type":      "standard",
          "stopwords": "_english_"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "my_text": {
        "type":     "text",
        "analyzer": "standard",
        "fields": {
          "english": {
            "type":     "text",
            "analyzer": "std_english"
          }
        }
      }
    }
  }
}
```

:::

::: details 【示例】设置字段的分析器

将字段 title 的分析器设为 `whitespace`：

```json
PUT my-index-000001
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "whitespace"
      }
    }
  }
}
```

:::

::: details 【示例】指定查询的搜索分析器

```json
GET my-index-000001/_search
{
  "query": {
    "match": {
      "message": {
        "query": "Quick foxes",
        "analyzer": "stop"
      }
    }
  }
}
```

:::

::: details 【示例】指定字段的搜索分析器

```json
PUT my-index-000001
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "whitespace",
        "search_analyzer": "simple"
      }
    }
  }
}
```

:::

::: details 【示例】指定索引的默认搜索分析器

创建索引时，可以使用该 `analysis.analyzer.default_search` 设置设置默认搜索分析器。如果提供了搜索分析器，则还必须使用 `analysis.analyzer.default` 设置指定默认索引分析器。

```json
PUT my-index-000001
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default": {
          "type": "simple"
        },
        "default_search": {
          "type": "whitespace"
        }
      }
    }
  }
}
```

:::

### 自定义分析器

自定义分析器，需要指定 type 为 `custom` 类型。

```json
PUT my-index-000001
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "char_filter": [
            "html_strip"
          ],
          "filter": [
            "lowercase",
            "asciifolding"
          ]
        }
      }
    }
  }
}
```

## Character Filters（字符过滤器）

[Character Filters（字符过滤器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-charfilters.html) 将原始文本作为字符流接收，并可以通过添加、删除或更改字符来转换文本。分析器可以有**零个或多个** [Character Filters（字符过滤器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-charfilters.html)，如果配置了多个，它会按照配置的顺序执行。

Elasticsearch 内置的字符过滤器：

- [`html_strip`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-htmlstrip-charfilter.html) - `html_strip`字符过滤器用于去除 HTML 元素（如 `<b>`）并转义 HTML 实体（如 `&amp;`）。
- [`mapping`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-mapping-charfilter.html) - `mapping` 字符过滤器用于将指定字符串的任何匹配项替换为指定的替换项。
- [`pattern_replace`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-pattern-replace-charfilter.html) - `pattern_replace` 字符筛选器将匹配正则表达式的任何字符替换为指定的替换。

## Tokenizer（分词器）

[Tokenizer（分词器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenizers.html) 接收字符流，将其分解为分词（通常是单个单词），并输出一个分词流。分词器还负责记录每个 term 的顺序或位置，以及该 term 所代表的原始单词的开始和结束字符偏移量。分析器**有且仅有一个** [Tokenizer（分词器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenizers.html)。

Elasticsearch 内置的分词器：

- 面向单词的分词器
  - [`standard`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-standard-tokenizer.html) - 将文本划分为单词边界上的 term，如 Unicode 文本分割算法所定义。它会删除大多数标点符号。它是大多数语言的最佳选择。
  - [`letter`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-letter-tokenizer.html) - 遇到非字母字符时将文本划分为多个 term。
  - [`lowercase`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lowercase-tokenizer.html) - 到非字母字符时将文本划分为多个 term，并将其转为小写。
  - [`whitespace`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-whitespace-tokenizer.html) - 遇到任何空格时将文本划分为多个 term。
  - [`uax_url_email`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-uaxurlemail-tokenizer.html) - 与 [`standard`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-standard-tokenizer.html) 相似，不同之处在于它将 URL 和电子邮件地址识别为单个分词。
  - [`classic`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-classic-tokenizer.html) - 基于语法的英语分词器。
  - [`thai`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-thai-tokenizer.html) - 将泰语文本分割为单词。
- 部分单词分词器
  - [`n-gram`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-ngram-tokenizer.html) - 遇到指定字符列表（例如空格或标点符号）中的任何一个时，将文本分解为单词，然后返回每个单词的 n-gram：一个连续字母的滑动窗口，例如 `quick`→ `[qu， ui， ic， ck]`。
  - [`edge_n-gram`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-edgengram-tokenizer.html) - 遇到指定字符列表（例如空格或标点符号）中的任何一个时，将文本分解为单词，然后返回锚定到单词开头的每个单词的 n 元语法，例如 `quick` → `[q， qu， qui， quic， quick]`。
- 结构化文本分词器
  - [`keyword`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-keyword-tokenizer.html) - 接受给定的任何文本，并输出与单个 term 完全相同的文本。它可以与 [`lowercase`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lowercase-tokenfilter.html) 等分词过滤器结合使用，以规范化分析的 term。
  - [`pattern`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-pattern-tokenizer.html) - 使用正则表达式在文本与单词分隔符匹配时将文本拆分为 term，或者将匹配的文本捕获为 term。
  - [`simple_pattern`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-simplepattern-tokenizer.html) - 使用正则表达式将匹配的文本捕获为 term。它使用正则表达式特征的受限子集，并且通常比 [`pattern`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-pattern-tokenizer.html) 更快。
  - [`char_group`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-chargroup-tokenizer.html) - 可以通过要拆分的字符集进行配置，这通常比运行正则表达式代价更小。
  - [`simple_pattern_split`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-simplepatternsplit-tokenizer.html) - 使用与 [`simple_pattern`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-simplepattern-tokenizer.html) 分词器相同的受限正则表达式子集，但在匹配项处拆分输入，而不是将匹配项作为 term 返回。
  - [`path_hierarchy`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-pathhierarchy-tokenizer.html) - 基于文件系统的路径分隔符，进行拆分，例如 `/foo/bar/baz` → `[/foo, /foo/bar, /foo/bar/baz ]` 。

## Token Filters（分词过滤器）

[Token Filters（分词过滤器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenfilters.html) 接收分词流，并可以添加、删除或更改分词。常用的分词过滤器有： [`lowercase`（小写转换）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lowercase-tokenfilter.html)、[`stop`（停用词处理）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-stop-tokenfilter.html)、[`synonym`（同义词处理）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-synonym-tokenfilter.html) 等等。分析器可以有零个或多个 [Token Filters（分词过滤器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenfilters.html)，如果配置了多个，它会按照配置的顺序执行。

Elasticsearch 内置了很多分词过滤器，这里列举几个常见的：

- [`classic`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-classic-tokenfilter.html) - 从单词末尾删除英语所有格 （`'s`），并删除首字母缩略词中的点。它使用 Lucene 的 [ClassicFilter](https://lucene.apache.org/core/9_12_0/analysis/common/org/apache/lucene/analysis/standard/ClassicFilter.html)。
- [`lowercase`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lowercase-tokenfilter.html) - 将分词转为小写。
- [`stop`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-stop-tokenfilter.html) - 从分词中删除 [stop word（停用词）](https://en.wikipedia.org/wiki/Stop_word)。
- [`synonym`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-synonym-tokenfilter.html) - 允许在分析过程中轻松处理 [近义词](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-with-synonyms.html)。

## 中文分词

在英文中，单词有自然的空格作为分隔。

在中文中，分词有以下难点：

- 中文不能根据一个个汉字进行分词
- 不同于英文可以根据自然的空格进行分词；中文中一般不会有空格。
- 同一句话，在不同的上下文中，有不同个理解。例如：这个苹果，不大好吃；这个苹果，不大，好吃！

可以使用一些插件来获得对中文更好的分析能力：

- [analysis-icu](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-icu.html) - 添加了扩展的 Unicode 支持，包括更好地分析亚洲语言、Unicode 规范化、Unicode 感知大小写折叠、排序规则支持和音译。
- [elasticsearch-analysis-ik](https://github.com/infinilabs/analysis-ik) - 支持自定义词库，支持热更新分词字典
- [elasticsearch-thulac-plugin](https://github.com/microbun/elasticsearch-thulac-plugin) - 清华大学自然语言处理和社会人文计算实验室的一套中文分词器。

## 参考资料

- [极客时间教程 - Elasticsearch 核心技术与实战](https://time.geekbang.org/course/detail/100030501-102659)
- [Elasticsearch 官方文档之文本分析](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis.html)
- [Elasticsearch 从入门到实践之分词器](https://www.itshujia.com/read/elasticsearch/356.html)
