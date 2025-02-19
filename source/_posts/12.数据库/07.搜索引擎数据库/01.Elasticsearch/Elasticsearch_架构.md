---
icon: logos:elasticsearch
title: Elasticsearch 架构
date: 2024-11-25 07:42:18
categories:
  - 数据库
  - 搜索引擎数据库
  - Elasticsearch
tags:
  - 数据库
  - 搜索引擎数据库
  - Elasticsearch
  - 存储
  - 索引
permalink: /pages/f648b115/
---

# Elasticsearch 架构

## 存储流程

ES 存储数据的流程可以从三个角度来阐述：

- 从**集群**的角度来看，数据写入会先路由到主分片，在主分片上写入成功后，会并发写副本分片，最后响应给客户端。
- 从**分片**的角度来看，数据到达分片后需要对内容进行格式校验、分词处理然后再索引数据。
- 从**节点**的角度来看，ES 数据持久化的步骤可归纳为：**Refresh、写 Translog、Flush、Merge。**

### 文档分布式存储流程

ES 的索引有一个或者多个分片，而分片又分为主分片和副本分片两种。将要写入的数据存储在哪个分片是第一个要考虑的问题。

首先需要找到存储文档的主分片，并在主分片的节点上写入对应数据，**数据在主分片写入成功后再将数据分发到副分片进行存储**。文档的新增、更新、删除等操作都属于写入操作。

从集群层面来看，存储数据的流程如下：

1. **请求** - 客户端选择一个 node（示例中是 node1）发送请求过去，这个 node 就是 `coordinating node`（协调节点）。
2. **路由转发** - `coordinating node` 根据文档 ID 或 routing key 计算出文档应该被保存到哪个分片（这里是分片 3），并且从集群状态的路由表信息中获取分片 3 的主分片所在的节点为 node3。`coordinating node` 将请求转发给 node3。
3. **复制** - node3 存储数据后，将请求并发转发到 分片 3 的所有副本分片，即数据复制。
4. **响应** - 当所有副分片都写入成功后，node3 会向 `coordinating node` 返回写入成功的消息，`coordinating node` 再将响应返回给客户端。

### 数据索引流程

文档分布式存储流程中的描述，隐藏了一个细节：如果是全文本数据，ES 需要使用 [**analyzer（分析器）**](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer-anatomy.html) 先对内容进行分析（如果数据是精确值，如实体 ID、日期等，则无需处理）。

在 Elasticsearch 中，分析器是用于对文本进行分词的组件。分析器用于将文本分解为更小的单元，称为分词。然后，这些分词用于索引和搜索文本。分析器的主要目标是将原始文本转换为可以有效搜索和分析的结构化格式 （分词）。

[**analyzer（分析器）**](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer-anatomy.html) 由三个组件组成：零个或多个 [Character Filters（字符过滤器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-charfilters.html)、有且仅有一个 [Tokenizer（分词器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenizers.html)、零个或多个 [Token Filters（分词过滤器）](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenfilters.html)。分析的执行顺序为：`character filters -> tokenizer -> token filters`。

对全文本数据来说，数据索引时会对文本内容进行分析处理，分析器的处理流程如下：

1. character flters 先对字符进行过滤，例如：把一些 HTML 元素、转义标签清除；
2. tokenizer 会将字符串按不同的策略进行切分，分割得到的单词称为 token（词条）；
3. token filters 对 token 再进行过滤，例如：删除停用词（and、is 等），转换近义词等；

经过以上一系列处理后，ES 会将数据存储到名为倒排索引的结构中。

当需要全文检索存储数据时，需要先使用搜索分析器对搜索内容进行分析，这个处理过程和存储时使用的分析器相似。通过分析得到的分词列表，再去和倒排索引中的数据去进行匹配，最后返回匹配度最高的数据。

### 数据持久化流程

ES 的数据持久化流程主要有以下几个过程：**Refresh、写 Translog、Flush、Merge。**

![](https://miro.medium.com/1*mB9Uqv2ECmj-_Rxuw_Mgww.png)

#### Refresh

在文档写入的时候，ES 会将文档先写入到 **Index Buffer** 中。

当 Index Buffer 大小达到阈值（默认为 JVM 的 10%），或间隔一段时间（默认每秒执行一次，可以通过 `index.refresh_interval` 进行设置），ES 会将 Index Buffer 中的数据写入到一个新的 Segment 文件中。此时的 Segment 文件存在于 OS Cache 中。这个过程称为 **Refresh**。

refresh 写完 segment 后，会更新 shard 的 commit point。commit point 在 shard 中以 `segments_xxx` 形式名字的文件存在，用来记录每个 shard 中 segment 相关的信息。

此外，ES 也支持通过 API 手动触发 Refresh 操作。

Refresh 过程有几点需要注意：

- 在 Index Buffer 中的数据是搜索不到的；Refresh 后，数据进入 **OS Cache**，这时数据就可以搜索了。由于，刷新默认间隔一秒，写入的数据需要一秒后才可见，因此，ES 被称为近实时搜索数据库。
- Index Buffer 的设计是为了通过批量写入，提高写入效率。但是，这种设计也带来了新的问题：一旦 ES 节点发生断点，Index Buffer 中的数据就丢失了。为了避免数据丢失，ES 的解决方案就是下文要提到的 **Translog**。
- Index Buffer 每次 Refresh 时，都会创建一个新的 Segment 文件。随着时间推移，Segment 文件会越来越多。这些 Segment 都要消耗文件句柄和内存，每次搜索都要检查每个 Segment 然后再合并结果。因此，Segment 越多、搜索也越慢。为了减少 Segment 文件数，ES 的解决方案就是下文要提到的 **Merge** 操作。

#### 写 Translog

**ES 通过 Translog（事务日志）来保证数据不丢失**。

数据写入 Index Buffer 后，ES 会将数据也写入 Translog，写入完毕后即可以返回客户端写入成功。**Translog 只允许追加写入**，并且默认是调用 fsync 进行刷盘的。**每个分片都会有自己的 Translog，在 Refresh 的时候系统会清空 Index Buffer，但不会清空 Translog**。一旦机器宕机，再次重启的时候， ES 会自动读取 Translog 中的数据，恢复到 Index Buffer 和 OS Cache 中。

Translog 其实也是先写入 OS Cache 的，默认每 5 秒刷一次到磁盘中去（由 `index.translog.interval` 控制）。所以，如果机器宕机，可能会丢失 5 秒的数据。这样设计的目的，还是基于写入效率的考虑。如果每条数据都直接写入磁盘，开销是比较高的，所以这里设计为延时批量写入。

> 通过 Refresh 和 写 Translog 两节的内容，我们可以总结为：
>
> - ES 之所以被称为**近实时查询**，是由于数据写入后，需要刷新（默认间隔 1 秒）后，才可以搜索到；
> - ES 虽然有 Translog 机制，但依然有丢失数据的风险——有 5 秒的数据，是暂存在 index buffer、translog(os cache)、segment file(os cache) 中，此时尚未保存到磁盘。如果此时发生宕机或断电，会**丢失 5 秒的数据**。

#### Flush

Flush 操作本质上就是 commit 操作，即 ES 的数据持久化操作。

1. Flush 操作的第一步，就是将 index buffer 中现有数据 `refresh` 到 `OS Cache` 中去，清空 buffer。
2. 然后，将一个 `commit point` 写入磁盘文件，里面标识着这个 `commit point` 对应的所有 Segment 文件。同时，强行将 `OS Cache` 中目前所有的数据都 `fsync` 到磁盘中去。
3. 最后，删除当前的 translog，新建一个 translog，此时 commit 操作完成。

以下两个条件满足任意一个，就会触发 Flush 操作：

- 默认每 30 分钟触发执行一次（由 `index.translog.flush_threshold_period` 控制）
- Translog 写满时触发执行，默认容量为 512M（由 `index.translog.flush_threshold_size` 控制）。

#### Merge

Elasticsearch 的 document 的物理存储是 Luncene segment，而 segment 不允许变更。那么，如何处理删除和更新呢？

- 如果是删除操作，commit 的时候会生成一个 `.del` 文件，里面将某个 doc 标识为 `deleted` 状态，那么搜索的时候根据 `.del` 文件就知道这个 doc 是否被删除了。

- 如果是更新操作，就是将原来的 doc 标识为 `deleted` 状态，然后新写入一条数据。

Index Buffer 每次 Refresh 时，都会创建一个新的 Segment 文件。随着时间推移，Segment 文件会越来越多。这些 Segment 都要消耗文件句柄和内存，每次搜索都要检查每个 Segment 然后再合并结果。因此，Segment 越多、搜索也越慢。

Elasticsearch 会定期执行 merge 操作，将多个 `segment file` 合并成一个。合并时会将标识为 `deleted` 的 doc 给**物理删除掉**，然后将新的 `segment file` 写入磁盘，这里会写一个 `commit point`，标识所有新的 `segment file`，然后打开 `segment file` 供搜索使用，同时删除旧的 `segment file`。

## 搜索流程

在 Elasticsearch 中，搜索一般分为两个阶段，query 和 fetch 阶段。可以简单的理解，query 阶段确定要取哪些 doc，fetch 阶段取出具体的 doc。

### Query 阶段

Query 阶段会根据搜索条件遍历每个分片（主分片或者副分片中的其一）中的数据，返回符合条件的前 N 条数据的 ID 和排序值，然后在协调节点中对所有分片的数据进行排序，获取前 N 条数据的 ID。

Query 阶段的流程如下：

1. 客户端选择一个节点发送请求，这个 node 成为 coordinate node（协调节点）。coordinate node 创建一个大小为 from + size 的优先级队列用来存放结果。
2. coordinate node 将请求转发到索引的每个主分片或者副分片中。
3. 每个分片在本地执行搜索请求，并将查询结果打分排序，然后将结果保存到 from + size 大小的有序队列中。
4. 接着，每个分片将结果返回给 coordinate node，coordinate node 对数据进行汇总处理：合并、排序、分页，将汇总数据存到一个大小为 from + size 的全局有序队列。

需要注意的是，在协调节点转发搜索请求的时候，如果有 N 个 Shard 位于同一个节点时，并不会合并这些请求，而是发生 N 次请求！

### Fetch 阶段

在 Fetch 阶段，协调节点会从 Query 阶段产生的全局排序列表中确定需要取回的文档 ID 列表，然后通过路由算法计算出各个文档对应的分片，并且用 multi get 的方式到对应的分片上获取文档数据。

Fetch 阶段的流程如下：

1. coordinate node 确定需要获取哪些文档，然后向相关节点发起 multi get 请求；
2. 分片所在节点读取文档数据，并且进行 `_source` 字段过滤、处理高亮参数等，然后把处理后的文档数据返回给协调节点；
3. coordinate node 汇总所有数据后，返回给客户端。

### 深度分页问题

在 Elasticsearch 中，支持三种分页查询方式：

- from + size - 可以使用 `from` 和 `size` 参数分别指定查询的起始页和每页记录数。
- [`search_after`](https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#search-after) - 不支持指定页数，只能向下翻页；并且需要指定 sort，并保证值是唯一的。然后，可以反复使用上次结果中最后一个文档的 sort 值进行查询。
- [scroll](https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#scroll-search-results) - 类似于 RDBMS 中的游标，只允许向下翻页。每次下一页查询后，使用返回结果的 scroll id 来作为下一次翻页的标记。scroll 查询会在搜索初始化阶段会生成快照，后续数据的变化无法及时体现在查询结果，因此更加适合一次性批量查询或非实时数据的分页查询。

前文中，我们已经了解了 ES 两阶段搜索流程（Query 和 Fetch）。从中不难发现，这种搜索方式在分页查询时会出现以下情况：

- 每个 shard 要扫描 `from + size` 条数据；
- coordinate node 需要接收并处理 `(from + size) * primary_shard_num` 条数据。

**如果 from 或 size 很大，需要处理的数据量也会很大，代价很高，这就是深分页产生的原因**。为了避免深分页，ES 默认限制 `from + size` 不能超过 10000，可以通过 `index.max_result_window` 设置。

如何解决 Elasticsearch 深分页问题？

ES 官方提供了另外两种分页查询方式 [`search_after`](https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#search-after) + PIT 和 [scroll](https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#scroll-search-results)（注意：官方已不再推荐） 来避免深分页问题。

### 计算偏差

在 ES 中，不仅仅是普通搜索，相关性计算（评分）和聚合计算也是先在每个 shard 的本地进行计算，再由 coordinate node 进行汇总。由于分片的本地计算是独立的，只能基于数据子集来进行计算，所以难免出现数据偏差。

解决这个问题的方式也有多种：

- 当数据量不大的情况下，**设置主分片数为 1**，这意味着在数据全集上进行聚合。 但这种方案不太现实。
- **设置 [`shard_size`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html#search-aggregations-bucket-terms-aggregation-shard-size) 参数**，将计算数据范围变大，**牺牲整体性能，提高精准度**。shard_size 的默认值是 `size * 1.5 + 10`。
- **使用 DFS Query Then Fetch**， 在 URL 参数中指定：`_search?search_type=dfs_query_then_fetch`。这样设定之后，系统先会把每个分片的词频和文档频率的数据汇总到协调节点进行处理，然后再进行相关性算分。这样的话会消耗更多的 CPU 和内存资源，效率低下！
- 尽量保证数据均匀地分布在各个分片中。

### 数据路由

为了避免出现数据倾斜，系统需要一种高效的方式把数据均匀分散到各个节点上**存储**，并且**在检索的时候可以快速找到**文档所在的节点与分片。这就需要确立路由算法，使得数据可以映射到指定的节点上。

常见的路由方式如下：

| **算法** | **描述**                                                                                                                                         |
| :------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| 随机算法 | 写数据时，随机写入到一个节点中；读数据时，由于不知道查询数据存在于哪个节点，所以需要遍历所有节点。                                               |
| 路由表   | 由中心节点统一维护数据的路由表，以保证唯一性；但是，中心化产生了新的问题：单点故障、数据越大，路由表越大、单点容易称为性能瓶颈、数据迁移复杂等。 |
| 哈希取模 | 对 key 值进行哈希计算，然后根据节点数取模，以确定节点。                                                                                          |

ES 的数据路由算法是根据文档 ID 和 routing key 来确定 Shard ID 的过程。**默认的情况下 routing key 为文档 ID**，路由算法一般情况下的计算公式如下：

```
 shard_number = hash(_routing) % numer_of_primary_shards
```

也可以在请求中指定 routing key，下面是新增数据的时候指定 routing 的方式：

```bash
PUT <index>/_doc/<id>?routing=routing_key
{
    "field1": "xxx",
    "field2": "xxx"
}
```

添加数据时，如果不指定文档 ID，ES 会自动分片一个随机 ID。这种情况下，结合 Hash 算法，可以保证数据被均匀分布到各个分片中。如果指定文档 ID，或指定 routing key，Hash 计算得出的值可能会不够随机，从而导致数据倾斜。

**index 一旦设置了主分片数就不能修改，如果要修改就需要 reindex（即数据迁移）**。之所以如此，就是因为：一旦修改了主分片数，即等于修改了原 Hash 计算中的变量，无法再通过 Hash 计算正确路由到数据存储的分片。

## 参考资料

- [Elasticsearch 官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- https://www.itshujia.com/read/elasticsearch/359.html
- https://github.com/doocs/advanced-java/blob/main/docs/high-concurrency/es-write-query-search.md
- https://www.elastic.co/blog/found-elasticsearch-top-down
- https://www.elastic.co/guide/en/elasticsearch/reference/current/preload-data-to-file-system-cache.html
- https://blog.devgenius.io/elasticsearch-solution-to-searching-71116220c82f
