---
title: 《极客时间教程 - Elasticsearch 核心技术与实战》笔记二
date: 2024-11-12 07:58:46
categories:
  - 笔记
  - 数据库
tags:
  - 数据库
  - 搜索引擎数据库
  - elasticsearch
permalink: /pages/87ebfd72/
---

# 《极客时间教程 - Elasticsearch 核心技术与实战》笔记二

[极客时间教程 - Elasticsearch 核心技术与实战](https://time.geekbang.org/course/detail/100030501-102659) 学习笔记

<!-- more -->

## 第四章：深入搜索

### 基于词项和基于全文的搜索

#### 基于词项的查询

Term 是表达语意的最小单位。搜索和利用统计语言模型进行自然语言处理都需要处理 Term

Term 级别查询：Term / Range / Exists / Prefix / Wildcard

在 ES 中，Term 查询，对输入不做分词。会将输入作为一个整体，在倒排索引中查找准确的词项，并且使用相关度计算公式为每个包含该词项的文档进行相关度计算。

可以通过 Constant Score 将查询转换成一个 Filtering，避免算法，并利用缓存，提高性能。

#### 基于文本的查询

文本查询：match、match_phrase、query_string

索引和搜索时都会进行分词，查询字符串先传递到一个合适的分词器，然后生成一个供查询的词项列表。

查询时，会先对输入的查询进行分词，然后每个词项柱哥进行底层的查询，最终将结果进行合并，并为每个文档计算一个相关度分值。

【示例】

```shell
DELETE products
PUT products
{
  "settings": {
    "number_of_shards": 1
  }
}

POST /products/_bulk
{ "index": { "_id": 1 }}
{ "productID" : "XHDK-A-1293-#fJ3","desc":"iPhone" }
{ "index": { "_id": 2 }}
{ "productID" : "KDKE-B-9947-#kL5","desc":"iPad" }
{ "index": { "_id": 3 }}
{ "productID" : "JODL-X-1937-#pV7","desc":"MBP" }

GET /products

POST /products/_search
{
  "query": {
    "term": {
      "desc": {
        //"value": "iPhone"
        "value":"iphone"
      }
    }
  }
}

POST /products/_search
{
  "query": {
    "term": {
      "desc.keyword": {
        //"value": "iPhone"
        //"value":"iphone"
      }
    }
  }
}

POST /products/_search
{
  "query": {
    "term": {
      "productID": {
        "value": "XHDK-A-1293-#fJ3"
      }
    }
  }
}

POST /products/_search
{
  //"explain": true,
  "query": {
    "term": {
      "productID.keyword": {
        "value": "XHDK-A-1293-#fJ3"
      }
    }
  }
}

POST /products/_search
{
  "explain": true,
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "productID.keyword": "XHDK-A-1293-#fJ3"
        }
      }

    }
  }
}

#设置 position_increment_gap
DELETE groups
PUT groups
{
  "mappings": {
    "properties": {
      "names":{
        "type": "text",
        "position_increment_gap": 0
      }
    }
  }
}

GET groups/_mapping

POST groups/_doc
{
  "names": [ "John Water", "Water Smith"]
}

POST groups/_search
{
  "query": {
    "match_phrase": {
      "names": {
        "query": "Water Water",
        "slop": 100
      }
    }
  }
}

POST groups/_search
{
  "query": {
    "match_phrase": {
      "names": "Water Smith"
    }
  }
}
```

### 结构化搜索

结构化搜索是指对结构化数据的搜索。

日期、布尔、和数字类型都是结构化的。它们都有精确的格式，可以根据这些格式进行逻辑操作，如：比较范围、判定大小。

文本也可以是结构化的。结构化的文本可以精确匹配（term）或部分匹配（prefix）

结构化结果只有是或否两个选项。

【示例】

```shell
#结构化搜索，精确匹配
DELETE products
POST /products/_bulk
{ "index": { "_id": 1 }}
{ "price" : 10,"avaliable":true,"date":"2018-01-01", "productID" : "XHDK-A-1293-#fJ3" }
{ "index": { "_id": 2 }}
{ "price" : 20,"avaliable":true,"date":"2019-01-01", "productID" : "KDKE-B-9947-#kL5" }
{ "index": { "_id": 3 }}
{ "price" : 30,"avaliable":true, "productID" : "JODL-X-1937-#pV7" }
{ "index": { "_id": 4 }}
{ "price" : 30,"avaliable":false, "productID" : "QQPX-R-3956-#aD8" }

GET products/_mapping

#对布尔值 match 查询，有算分
POST products/_search
{
  "profile": "true",
  "query": {
    "term": {
      "avaliable": true
    }
  }
}

#对布尔值，通过 constant score 转成 filtering，没有算分
POST products/_search
{
  "profile": "true",
  "explain": true,
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "avaliable": true
        }
      }
    }
  }
}

#数字类型 Term
POST products/_search
{
  "profile": "true",
  "explain": true,
  "query": {
    "term": {
      "price": 30
    }
  }
}

#数字类型 terms
POST products/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "terms": {
          "price": [
            "20",
            "30"
          ]
        }
      }
    }
  }
}

#数字 Range 查询
GET products/_search
{
    "query" : {
        "constant_score" : {
            "filter" : {
                "range" : {
                    "price" : {
                        "gte" : 20,
                        "lte"  : 30
                    }
                }
            }
        }
    }
}

# 日期 range
POST products/_search
{
    "query" : {
        "constant_score" : {
            "filter" : {
                "range" : {
                    "date" : {
                      "gte" : "now-1y"
                    }
                }
            }
        }
    }
}

#exists 查询
POST products/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "exists": {
          "field": "date"
        }
      }
    }
  }
}

#处理多值字段
POST /movies/_bulk
{ "index": { "_id": 1 }}
{ "title" : "Father of the Bridge Part II","year":1995, "genre":"Comedy"}
{ "index": { "_id": 2 }}
{ "title" : "Dave","year":1993,"genre":["Comedy","Romance"] }

#处理多值字段，term 查询是包含，而不是等于
POST movies/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "genre.keyword": "Comedy"
        }
      }
    }
  }
}

#字符类型 terms
POST products/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "terms": {
          "productID.keyword": [
            "QQPX-R-3956-#aD8",
            "JODL-X-1937-#pV7"
          ]
        }
      }
    }
  }
}

POST products/_search
{
  "profile": "true",
  "explain": true,
  "query": {
    "match": {
      "price": 30
    }
  }
}

POST products/_search
{
  "profile": "true",
  "explain": true,
  "query": {
    "term": {
      "date": "2019-01-01"
    }
  }
}

POST products/_search
{
  "profile": "true",
  "explain": true,
  "query": {
    "match": {
      "date": "2019-01-01"
    }
  }
}

POST products/_search
{
  "profile": "true",
  "explain": true,
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "productID.keyword": "XHDK-A-1293-#fJ3"
        }
      }
    }
  }
}

POST products/_search
{
  "profile": "true",
  "explain": true,
  "query": {
    "term": {
      "productID.keyword": "XHDK-A-1293-#fJ3"
    }
  }
}

#对布尔数值
POST products/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "avaliable": "false"
        }
      }
    }
  }
}

POST products/_search
{
  "query": {
    "term": {
      "avaliable": {
        "value": "false"
      }
    }
  }
}

POST products/_search
{
  "profile": "true",
  "explain": true,
  "query": {
    "term": {
      "price": {
        "value": "20"
      }
    }
  }
}

POST products/_search
{
  "profile": "true",
  "explain": true,
  "query": {
    "match": {
      "price": "20"
    }
}

POST products/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "bool": {
          "must_not": {
            "exists": {
              "field": "date"
            }
          }
        }
      }
    }
  }
}
```

### 搜索的相关性算分

搜索的相关性打分，描述了一个文档和查询语句匹配的程度。ES 会对每个匹配查询条件的结果进行算分（\_score）。

ES5 之前，默认的相关性算法是 TD-IDF；ES5 后，采用 BM25。

词频（Term Frequency，TF） - 检索词在一篇文档中出现的频率

逆文档频率（Inverse Document Frequency，IDF） - log（全部文档数/检索词出现过的文档总数），用以表示检索词在所有文档中出现的频率。

Stop Word - 词项出现频率岁高，但对相关度几乎没有用户，例如：的、the、a 之类的词。

TF-IDF 本质上就是将 TF 求和变成了加权求和。

和 TF-IDF 相比，当 TF 无限增加时， BM 25 分支会趋于一个平稳值。

Boosting 是控制相关度的一种手段。

- boost > 1，打分的权重提升；
- 0 < boost < 1，打分的权重降低
- boost < 0，贡献负分

【示例】

```shell
PUT testscore
{
  "settings": {
    "number_of_shards": 1
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text"
      }
    }
  }
}

PUT testscore/_bulk
{ "index": { "_id": 1 }}
{ "content":"we use Elasticsearch to power the search" }
{ "index": { "_id": 2 }}
{ "content":"we like elasticsearch" }
{ "index": { "_id": 3 }}
{ "content":"The scoring of documents is caculated by the scoring formula" }
{ "index": { "_id": 4 }}
{ "content":"you know, for search" }

POST /testscore/_search
{
  //"explain": true,
  "query": {
    "match": {
      "content":"you"
      //"content": "elasticsearch"
      //"content":"the"
      //"content": "the elasticsearch"
    }
  }
}

POST testscore/_search
{
    "query": {
        "boosting" : {
            "positive" : {
                "term" : {
                    "content" : "elasticsearch"
                }
            },
            "negative" : {
                 "term" : {
                     "content" : "like"
                }
            },
            "negative_boost" : 0.2
        }
    }
}

POST tmdb/_search
{
  "_source": [
    "title",
    "overview"
  ],
  "query": {
    "more_like_this": {
      "fields": [
        "title^10",
        "overview"
      ],
      "like": [
        {
          "_id": "14191"
        }
      ],
      "min_term_freq": 1,
      "max_query_terms": 12
    }
  }
}
```

### Query & Filtering 实现多字符串多字段查询

ES 中，有 Query 和 Filter 两种不同的 Context

- Query - 有相关性计算
- Filter - 没有相关性计算，可以利用缓存，性能更好

【示例】

```shell
POST /products/_bulk
{ "index": { "_id": 1 }}
{ "price" : 10,"avaliable":true,"date":"2018-01-01", "productID" : "XHDK-A-1293-#fJ3" }
{ "index": { "_id": 2 }}
{ "price" : 20,"avaliable":true,"date":"2019-01-01", "productID" : "KDKE-B-9947-#kL5" }
{ "index": { "_id": 3 }}
{ "price" : 30,"avaliable":true, "productID" : "JODL-X-1937-#pV7" }
{ "index": { "_id": 4 }}
{ "price" : 30,"avaliable":false, "productID" : "QQPX-R-3956-#aD8" }

#基本语法
POST /products/_search
{
  "query": {
    "bool" : {
      "must" : {
        "term" : { "price" : "30" }
      },
      "filter": {
        "term" : { "avaliable" : "true" }
      },
      "must_not" : {
        "range" : {
          "price" : { "lte" : 10 }
        }
      },
      "should" : [
        { "term" : { "productID.keyword" : "JODL-X-1937-#pV7" } },
        { "term" : { "productID.keyword" : "XHDK-A-1293-#fJ3" } }
      ],
      "minimum_should_match" :1
    }
  }
}

#改变数据模型，增加字段。解决数组包含而不是精确匹配的问题
POST /newmovies/_bulk
{ "index": { "_id": 1 }}
{ "title" : "Father of the Bridge Part II","year":1995, "genre":"Comedy","genre_count":1 }
{ "index": { "_id": 2 }}
{ "title" : "Dave","year":1993,"genre":["Comedy","Romance"],"genre_count":2 }

#must，有算分
POST /newmovies/_search
{
  "query": {
    "bool": {
      "must": [
        {"term": {"genre.keyword": {"value": "Comedy"}}},
        {"term": {"genre_count": {"value": 1}}}

      ]
    }
  }
}

#Filter。不参与算分，结果的 score 是 0
POST /newmovies/_search
{
  "query": {
    "bool": {
      "filter": [
        {"term": {"genre.keyword": {"value": "Comedy"}}},
        {"term": {"genre_count": {"value": 1}}}
        ]

    }
  }
}

#Filtering Context
POST _search
{
  "query": {
    "bool" : {

      "filter": {
        "term" : { "avaliable" : "true" }
      },
      "must_not" : {
        "range" : {
          "price" : { "lte" : 10 }
        }
      }
    }
  }
}

#Query Context
POST /products/_bulk
{ "index": { "_id": 1 }}
{ "price" : 10,"avaliable":true,"date":"2018-01-01", "productID" : "XHDK-A-1293-#fJ3" }
{ "index": { "_id": 2 }}
{ "price" : 20,"avaliable":true,"date":"2019-01-01", "productID" : "KDKE-B-9947-#kL5" }
{ "index": { "_id": 3 }}
{ "price" : 30,"avaliable":true, "productID" : "JODL-X-1937-#pV7" }
{ "index": { "_id": 4 }}
{ "price" : 30,"avaliable":false, "productID" : "QQPX-R-3956-#aD8" }

POST /products/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "productID.keyword": {
              "value": "JODL-X-1937-#pV7"}}
        },
        {"term": {"avaliable": {"value": true}}
        }
      ]
    }
  }
}

#嵌套，实现了 should not 逻辑
POST /products/_search
{
  "query": {
    "bool": {
      "must": {
        "term": {
          "price": "30"
        }
      },
      "should": [
        {
          "bool": {
            "must_not": {
              "term": {
                "avaliable": "false"
              }
            }
          }
        }
      ],
      "minimum_should_match": 1
    }
  }
}

#Controll the Precision
POST _search
{
  "query": {
    "bool" : {
      "must" : {
        "term" : { "price" : "30" }
      },
      "filter": {
        "term" : { "avaliable" : "true" }
      },
      "must_not" : {
        "range" : {
          "price" : { "lte" : 10 }
        }
      },
      "should" : [
        { "term" : { "productID.keyword" : "JODL-X-1937-#pV7" } },
        { "term" : { "productID.keyword" : "XHDK-A-1293-#fJ3" } }
      ],
      "minimum_should_match" :2
    }
  }
}

POST /animals/_search
{
  "query": {
    "bool": {
      "should": [
        { "term": { "text": "brown" }},
        { "term": { "text": "red" }},
        { "term": { "text": "quick"   }},
        { "term": { "text": "dog"   }}
      ]
    }
  }
}

POST /animals/_search
{
  "query": {
    "bool": {
      "should": [
        { "term": { "text": "quick" }},
        { "term": { "text": "dog"   }},
        {
          "bool":{
            "should":[
               { "term": { "text": "brown" }},
                 { "term": { "text": "brown" }},
            ]
          }

        }
      ]
    }
  }
}

DELETE blogs
POST /blogs/_bulk
{ "index": { "_id": 1 }}
{"title":"Apple iPad", "content":"Apple iPad,Apple iPad" }
{ "index": { "_id": 2 }}
{"title":"Apple iPad,Apple iPad", "content":"Apple iPad" }

POST blogs/_search
{
  "query": {
    "bool": {
      "should": [
        {"match": {
          "title": {
            "query": "apple,ipad",
            "boost": 1.1
          }
        }},

        {"match": {
          "content": {
            "query": "apple,ipad",
            "boost":
          }
        }}
      ]
    }
  }
}

DELETE news
POST /news/_bulk
{ "index": { "_id": 1 }}
{ "content":"Apple Mac" }
{ "index": { "_id": 2 }}
{ "content":"Apple iPad" }
{ "index": { "_id": 3 }}
{ "content":"Apple employee like Apple Pie and Apple Juice" }

POST news/_search
{
  "query": {
    "bool": {
      "must": {
        "match":{"content":"apple"}
      }
    }
  }
}

POST news/_search
{
  "query": {
    "bool": {
      "must": {
        "match":{"content":"apple"}
      },
      "must_not": {
        "match":{"content":"pie"}
      }
    }
  }
}

POST news/_search
{
  "query": {
    "boosting": {
      "positive": {
        "match": {
          "content": "apple"
        }
      },
      "negative": {
        "match": {
          "content": "pie"
        }
      },
      "negative_boost": 0.5
    }
  }
}
```

### 单字符串多字段查询 - DisMaxQuery

Disjunction Max Query - 将评分最高的字符评分作为结果返回，满足多个字段是竞争关系的场景

对最佳字段查询进行调优：通过控制 tie_breaker 参数，引入其他字段对计算的一些影响

【示例】

```shell
PUT /blogs/_doc/1
{
    "title": "Quick brown rabbits",
    "body":  "Brown rabbits are commonly seen."
}

PUT /blogs/_doc/2
{
    "title": "Keeping pets healthy",
    "body":  "My quick brown fox eats rabbits on a regular basis."
}

POST /blogs/_search
{
    "query": {
        "bool": {
            "should": [
                { "match": { "title": "Brown fox" }},
                { "match": { "body":  "Brown fox" }}
            ]
        }
    }
}

POST blogs/_search
{
    "query": {
        "dis_max": {
            "queries": [
                { "match": { "title": "Quick pets" }},
                { "match": { "body":  "Quick pets" }}
            ]
        }
    }
}

POST blogs/_search
{
  "query": {
    "dis_max": {
      "queries": [
        {
          "match": {
            "title": "Quick pets"
          }
        },
        {
          "match": {
            "body": "Quick pets"
          }
        }
      ],
      "tie_breaker": 0.2
    }
  }
}
```

### 单字符串多字段查询 - Multi Match

场景：最佳字段、多数字段、混合字段

multi_match

best_fields 是默认类型，可以不指定

minimum_should_match 等参数可以传递到生成的 query 中

【示例】

```shell
POST blogs/_search
{
    "query": {
        "dis_max": {
            "queries": [
                { "match": { "title": "Quick pets" }},
                { "match": { "body":  "Quick pets" }}
            ],
            "tie_breaker": 0.2
        }
    }
}

POST blogs/_search
{
  "query": {
    "multi_match": {
      "type": "best_fields",
      "query": "Quick pets",
      "fields": ["title","body"],
      "tie_breaker": 0.2,
      "minimum_should_match": "20%"
    }
  }
}

POST books/_search
{
    "multi_match": {
        "query":  "Quick brown fox",
        "fields": "*_title"
    }
}

POST books/_search
{
    "multi_match": {
        "query":  "Quick brown fox",
        "fields": [ "*_title", "chapter_title^2" ]
    }
}

DELETE /titles
PUT /titles
{
    "settings": { "number_of_shards": 1 },
    "mappings": {
        "my_type": {
            "properties": {
                "title": {
                    "type":     "string",
                    "analyzer": "english",
                    "fields": {
                        "std":   {
                            "type":     "string",
                            "analyzer": "standard"
                        }
                    }
                }
            }
        }
    }
}

PUT /titles
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "english"
      }
    }
  }
}

POST titles/_bulk
{ "index": { "_id": 1 }}
{ "title": "My dog barks" }
{ "index": { "_id": 2 }}
{ "title": "I see a lot of barking dogs on the road " }

GET titles/_search
{
  "query": {
    "match": {
      "title": "barking dogs"
    }
  }
}

DELETE /titles
PUT /titles
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "english",
        "fields": {"std": {"type": "text","analyzer": "standard"}}
      }
    }
  }
}

POST titles/_bulk
{ "index": { "_id": 1 }}
{ "title": "My dog barks" }
{ "index": { "_id": 2 }}
{ "title": "I see a lot of barking dogs on the road " }

GET /titles/_search
{
   "query": {
        "multi_match": {
            "query":  "barking dogs",
            "type":   "most_fields",
            "fields": [ "title", "title.std" ]
        }
    }
}

GET /titles/_search
{
  "query": {
    "multi_match": {
      "query": "barking dogs",
      "type": "most_fields",
      "fields": [
        "title^10",
        "title.std"
      ]
    }
  }
}
```

### 多语言及中文分词与检索

自然语言与查询 recall

处理人类自然语言时，有些情况下，尽管搜索和原文不完全匹配，但希望搜到一些内容。

可采取的优化：

- 归一化词元
- 抽取词根
- 包含同义词
- 拼写错误

混合语言、中文的分词都存在一些挑战

- 词干提取
- 不正确的文档频率
- 语言识别
- 歧义

中文分析器

- elasticsearch-analysis-hanlp
- elasticsearch-analysis-ik
- elasticsearch-analysis-pinyin

### SpaceJam 一个全文搜索的实例

### 使用 SearchTemplate 和 IndexAlias 进行查询

### 综合排序：Function Score Query 优化算分

ES 默认会以文档的相关度算分进行排序

可以指定一个或多个字段进行排序

使用相关度算分排序，不能满足某些特定条件

function_score 可以在查询结束后，对每一个匹配的文档进行一系列的重新算分，根据新生成的分数进行排序。提供了几种默认的计算分值的函数：

- weight - 为每一个文档设置一个简单而不被规范化的权重
- field_value_factor - 使用该数值来修改 `_score`
- random_score - 为每一个用户使用一个不同的，随机算分结果
- 衰减函数 - 以某个字段的值为标准，距离某个值越近，得分越高
- script_score - 自定义脚本完全控制所需逻辑

Boost Mode

- multiply
- sum
- min / max
- replace

Max Boost 可以将算分控制在一个最大值

【示例】

```shell
DELETE blogs
PUT /blogs/_doc/1
{
  "title":   "About popularity",
  "content": "In this post we will talk about...",
  "votes":   0
}

PUT /blogs/_doc/2
{
  "title":   "About popularity",
  "content": "In this post we will talk about...",
  "votes":   100
}

PUT /blogs/_doc/3
{
  "title":   "About popularity",
  "content": "In this post we will talk about...",
  "votes":   1000000
}

POST /blogs/_search
{
  "query": {
    "function_score": {
      "query": {
        "multi_match": {
          "query":    "popularity",
          "fields": [ "title", "content" ]
        }
      },
      "field_value_factor": {
        "field": "votes"
      }
    }
  }
}

POST /blogs/_search
{
  "query": {
    "function_score": {
      "query": {
        "multi_match": {
          "query":    "popularity",
          "fields": [ "title", "content" ]
        }
      },
      "field_value_factor": {
        "field": "votes",
        "modifier": "log1p"
      }
    }
  }
}

POST /blogs/_search
{
  "query": {
    "function_score": {
      "query": {
        "multi_match": {
          "query":    "popularity",
          "fields": [ "title", "content" ]
        }
      },
      "field_value_factor": {
        "field": "votes",
        "modifier": "log1p" ,
        "factor": 0.1
      }
    }
  }
}

POST /blogs/_search
{
  "query": {
    "function_score": {
      "query": {
        "multi_match": {
          "query":    "popularity",
          "fields": [ "title", "content" ]
        }
      },
      "field_value_factor": {
        "field": "votes",
        "modifier": "log1p" ,
        "factor": 0.1
      },
      "boost_mode": "sum",
      "max_boost": 3
    }
  }
}

POST /blogs/_search
{
  "query": {
    "function_score": {
      "random_score": {
        "seed": 911119
      }
    }
  }
}
```

### Term&PhraseSuggester

### 自动补全与基于上下文的提示

Completion Suggester，对性能要求比较苛刻。采用了不同的数据结构，并非通过倒排索引来完成。而是将 Analyze 的数据编码成 FST 和索引一起存放。FST 会被 ES 整个加载进内存，速度很快。

精准度：completion > Phrase > Term

召回率：Term > Phrase > Completion

性能：Completion > Phrase > Term

### 跨集群搜索

早期版本，通过 Tribe Node 可以实现多集群访问的需求，但是还存在一定的问题，现已废弃。

ES 5.3 引入了跨集群搜索的功能。

- 允许任何节点扮演 federated 节点，以轻量的方式，将搜索请求进行代理
- 不需要以 Client Node 形式加入其他集群

## 第五章：分布式特性及分布式搜索的机制

### 集群分布式模型及选主与脑裂问题

分布式特性：高可用、易扩展（水平扩展，支持 PB 级数据）

ES 集群名称可以通过配置或 -E cluster.name=xxx 来设定。

ES 节点本质上就是一个 JAVA 进程。一台机器上可以运行多个 ES 进程。

每个 ES 节点都有名字，可以通过配置文件或 -E node.name=xxx 来设定。

每个 ES 节点在启动后，会分片一个 UID，保存在 data 目录下。

- Coordinating Node - 处理请求的节点，叫 Coordinating Node（协调节点），每个节点默认都是协调节点。
- Data Node - 保存分片数据的节点。默认就是 data node，可以设置 `node.data: false` 禁止成为数据节点。
- Master Node - 负责处理创建、删除索引等请求；决定分片被分配到哪个节点；负责索引的创建与删除；维护并更新集群状态。
  - 节点启动后，默认为主节点的候选节点，可以在必要时参与选主，成为 master node。可以设置 node.master: false 禁止成为主节点候选节点。
- 集群状态
  - 所有的节点信息
  - 所有的索引和其相关的 mapping、setting
  - 分片的路由信息
  - 每个节点上都保存了集群的状态信息
  - 只有 master 节点才能修改集群的状态信息，并负责同步给其他节点

#### 选主过程

集群中的节点互 ping，node id 最小的会成为被选举的节点。

其他节点会加入集群，但是不承担 master 节点的角色，一旦发现被选中的主节点丢失，就会选举出新的 master。

#### 避免脑裂

7.0 之前，minimum_master_nodes 设为 N / 2 + 1

7.0 开始，ES 自动选择以形成仲裁的节点。

### 分片与集群的故障转移

主分片 - 水平扩展

副本分片 - 高可用：冗余、故障转移

分片数过小：无法通过增加节点实现扩展；分片数过大：使得单个分片容量很小，导致一个节点上有过多分片，影响性能。

### 文档分布式存储

文档到分配的路由

```
shard = hash(_routing) % number_of_primary_shards
```

hash 算法确保离散

默认的 \_routing 值是文档 id，可以定制 routing 数值

这也是设置 setting 中主分片数后，不能随意修改的根本原因。

### 分片及其生命周期

分片是 ES 中的最小工作单元。分片是一个 Lucene 的索引。

#### 倒排索引不可变性

无需考虑并发写文件的问题，避免了锁机制带来的性能问题

一旦读入内核的文件系统缓存，便留在哪里。只要文件系统存有足够的空间，大部分请求就会直接请求内存，不会命中磁盘，提升了很大的性能

如果需要让一个新的文档可以被搜索，需要重建整个索引。

#### Lucene Index

在 Lucene 中，单个倒排索引文件被称为 Segment。Segment 是自包闭的，不可变更的。多个 Segment 汇总在一起，称为 Lucene 的 Index，其对应的就是 ES 中的 shard

当有新文档写入时，会生成新 Segment，查询时会同时查询所有 Segment，并且对结果汇总。Lucene 中有一个文件，用来记录所有 Segment 信息，叫做 Commit Point。

删除的文档信息，保存在 .del 文件中。

#### 什么是 Refresh

将 Index buffer 写入 Segment 的过程叫 refresh。refresh 不执行 fsync 操作。

refresh 默认 1 秒发生一次，refresh 后，数据就可以被搜索到了。

如果系统有大量的数据写入，就会产生很多的 Segment

index buffer 被占满时，会触发 refresh，默认是 JVM 的 10%

#### 什么是事务日志

segment 写入磁盘的过程相对耗时，借助文件系统缓存，refresh 时，现将 segment 写入缓存以开放查询

为了保证数据不丢失，所以在 index 文档时，同时写事务日志，高版本开始，事务日志默认落盘。每个分片有一个事务日志。

在 ES refresh 时，index buffer 被清空，事务日志不会清空

#### 什么是 flush

调用 refresh，index buffer 清空并 refresh

调用 fsync，将缓存中的 segments 写入磁盘

清空事务日志

默认 30 分钟调用一次

事务日志满（512MB）

#### Merge

Segment 很多，需要被定期合并

ES 和 Lucene 会自动进行 Merge 操作

### 剖析分布式查询及相关性评分

ES 搜索分为两阶段：

1. Query
2. Fetch

#### Query 阶段

用户发出搜索请求到 ES 节点。节点收到请求后，会以协调节点的身份，在所有主副本分片中随机选择主分片数个分片，发送查询请求。

被选中的分片执行查询，进行排序。然后，每个分片都会返回 from +size 个排序后的文档 id 和排序值给协调节点。

#### Fetch 阶段

协调节点会将 Query 阶段从每个分片获取的排序后的文档 id 列表，进行重排序，选取 from 到 from +size 个文档的 id

以 multi get 请求的方式，到相应的分片获取详细的文档数据

#### 潜在问题

性能问题

- 每个分片上需要查的文档数 = from + size
- 最终协调节点需要处理 = 主分片数 \* ( from + size)
- 深度分页

相关性算分

每个分片都要基于自己分片上的数据进行相关度计算。这会导致打分偏离的情况，尤其是数据量很少时。当文档总数很少的情况下，主分片数越多，相关性计算会越不准。

解决算分不准的方法

将主分片数设为 1；

使用 `_search?search_type=dfs_query_then_fetch`，消耗更多 CPU 和内存，执行性能低下

```shell
DELETE message
PUT message
{
  "settings": {
    "number_of_shards": 20
  }
}

GET message

POST message/_doc?routing=1
{
  "content":"good"
}

POST message/_doc?routing=2
{
  "content":"good morning"
}

POST message/_doc?routing=3
{
  "content":"good morning everyone"
}

POST message/_search
{
  "explain": true,
  "query": {
    "match_all": {}
  }
}

POST message/_search
{
  "explain": true,
  "query": {
    "term": {
      "content": {
        "value": "good"
      }
    }
  }
}

POST message/_search?search_type=dfs_query_then_fetch
{

  "query": {
    "term": {
      "content": {
        "value": "good"
      }
    }
  }
}
```

### 排序及 DocValues&Fielddata

默认采用相关性算分对结果进行降序排序

可以通过设定 sorting 参数，自行设定排序

如果不指定 \_score，算分为 null

```shell
#单字段排序
POST /kibana_sample_data_ecommerce/_search
{
  "size": 5,
  "query": {
    "match_all": {

    }
  },
  "sort": [
    {"order_date": {"order": "desc"}}
  ]
}

#多字段排序
POST /kibana_sample_data_ecommerce/_search
{
  "size": 5,
  "query": {
    "match_all": {

    }
  },
  "sort": [
    {"order_date": {"order": "desc"}},
    {"_doc":{"order": "asc"}},
    {"_score":{ "order": "desc"}}
  ]
}

GET kibana_sample_data_ecommerce/_mapping

#对 text 字段进行排序。默认会报错，需打开 fielddata
POST /kibana_sample_data_ecommerce/_search
{
  "size": 5,
  "query": {
    "match_all": {

    }
  },
  "sort": [
    {"customer_full_name": {"order": "desc"}}
  ]
}

#打开 text 的 fielddata
PUT kibana_sample_data_ecommerce/_mapping
{
  "properties": {
    "customer_full_name" : {
          "type" : "text",
          "fielddata": true,
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        }
  }
}

#关闭 keyword 的 doc values
PUT test_keyword
PUT test_keyword/_mapping
{
  "properties": {
    "user_name":{
      "type": "keyword",
      "doc_values":false
    }
  }
}

DELETE test_keyword

PUT test_text
PUT test_text/_mapping
{
  "properties": {
    "intro":{
      "type": "text",
      "doc_values":true
    }
  }
}

DELETE test_text

DELETE temp_users
PUT temp_users
PUT temp_users/_mapping
{
  "properties": {
    "name":{"type": "text","fielddata": true},
    "desc":{"type": "text","fielddata": true}
  }
}

Post temp_users/_doc
{"name":"Jack","desc":"Jack is a good boy!","age":10}

#打开 fielddata 后，查看 docvalue_fields 数据
POST  temp_users/_search
{
  "docvalue_fields": [
    "name","desc"
    ]
}

#查看整型字段的 docvalues
POST  temp_users/_search
{
  "docvalue_fields": [
    "age"
    ]
}
```

### 分页与遍历-FromSize&SearchAfter&ScrollAPI

#### from + size

当一个查询：from = 990, size = 10，会在每个分片上先获取 1000 个文档。然后，通过协调节点聚合所有结果。最后，再通过排序选取前 1000 个文档。

页数越深，占用内存越多。为了避免深分页问题，ES 默认限定到 10000 个文档。

#### search after

实时获取下一页文档信息，不支持指定页数，只能向下翻页。

需要指定 sort，并保证值是唯一的

然后，可以反复使用上次结果中最后一个文档的 sort 值进行查询

#### scroll

创建一个快照，有新的数据写入以后，无法被查到。

每次持续后，输入上一次的 scroll id

```shell
POST tmdb/_search
{
  "from": 10000,
  "size": 1,
  "query": {
    "match_all": {

    }
  }
}

#Scroll API
DELETE users

POST users/_doc
{"name":"user1","age":10}

POST users/_doc
{"name":"user2","age":11}

POST users/_doc
{"name":"user2","age":12}

POST users/_doc
{"name":"user2","age":13}

POST users/_count

POST users/_search
{
    "size": 1,
    "query": {
        "match_all": {}
    },
    "sort": [
        {"age": "desc"} ,
        {"_id": "asc"}
    ]
}

POST users/_search
{
    "size": 1,
    "query": {
        "match_all": {}
    },
    "search_after":
        [
          10,
          "ZQ0vYGsBrR8X3IP75QqX"],
    "sort": [
        {"age": "desc"} ,
        {"_id": "asc"}
    ]
}

#Scroll API
DELETE users
POST users/_doc
{"name":"user1","age":10}

POST users/_doc
{"name":"user2","age":20}

POST users/_doc
{"name":"user3","age":30}

POST users/_doc
{"name":"user4","age":40}

POST /users/_search?scroll=5m
{
    "size": 1,
    "query": {
        "match_all" : {
        }
    }
}

POST users/_doc
{"name":"user5","age":50}
POST /_search/scroll
{
    "scroll" : "1m",
    "scroll_id" : "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAWAWbWdoQXR2d3ZUd2kzSThwVTh4bVE0QQ=="
}
```

### 处理并发读写

采用乐观锁机制

内部版本控制：`_seq_no` + `primary_term`

外部版本控制：`version` + `version_type=external`

## 第六章：深入聚合分析

### Bucket&Metric聚合分析及嵌套聚合

Metric（统计） - 统计计算

Bucket（分组） - 按一定规则，将文档分配到不同的桶中。

Metric 聚合

- **单值聚合** - 只输出一个分析结果
  - min、max、avg、sum、cardinality
- **多值聚合** - 输出多个分析结果
  - stats、extended_stats、percentile、percentile_rank、top_hits

### Pipeline聚合分析

Pipeline聚合支持对聚合分析的结果，进行再次聚合分析。

Pipeline 聚合的分析结果会输出到原结果中，根据位置的不同，分为两类：

- **sibling** - 结果和现有分析结果同级。例如：[max_bucket](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-max-bucket-aggregation.html)、[min_bucket](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-min-bucket-aggregation.html)、[avg_bucket](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-avg-bucket-aggregation.html)、[sum_bucket](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-sum-bucket-aggregation.html)、[stats_bucket](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-stats-bucket-aggregation.html)、[extended_stats_bucket](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-extended-stats-bucket-aggregation.html)、[percentiles_bucket](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-percentiles-bucket-aggregation.html)。
- **parent** - 结果内嵌到现有的聚合分析结果中。例如：[derivative](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-derivative-aggregation.html)、[cumulative_sum](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-cumulative-sum-aggregation.html)、[moving_function](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-movfn-aggregation.html)。

### 聚合的作用范围及排序

ES 聚合分析的默认作用范围是 query 的查询结果集。

同时 ES 还支持以下方式改变聚合的作用范围：

- filter
- post_filter
- global

指定 order，按照 `_count` 和 `_key` 进行排序。

### 聚合分析的原理及精准度问题

ES 在进行聚合分析时，协调节点会在每个分片的主分片、副分片中选一个，然后在不同分片上分别进行聚合计算，然后将每个分片的聚合结果进行汇总，返回最终结果。

由于，并非基于全量数据进行计算，所以聚合结果并非完全准确。

要解决聚合准确性问题，有两个解决方案：

- 解决方案 1：当数据量不大时，设置 Primary Shard 为 1，这意味着在数据全集上进行聚合。
- 解决方案 2：设置 [`shard_size`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html#search-aggregations-bucket-terms-aggregation-shard-size) 参数，将计算数据范围变大，进而使得 ES 的**整体性能变低，精准度变高**。shard_size 值的默认值是 `size * 1.5 + 10`。

## 第七章：数据建模（略）

## 第八章：保护你的数据（略）

## 第九章：水平扩展 Elasticsearch 集群

## 第十章：生产环境中的集群运维（略）

## 第十一章：索引生命周期管理（略）

## 第十二章：用Logstash和Beats构建数据管道（略）

## 第十三章：用Kibana进行数据可视化分析（略）

## 第十四章：探索X-Pack套件（略）

## 参考资料

- [极客时间教程 - Elasticsearch 核心技术与实战](https://time.geekbang.org/course/detail/100030501-102659)
