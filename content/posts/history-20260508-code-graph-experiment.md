---
title: 让 Agent 读懂代码库：代码知识图谱框架调研（实测篇）
date: '2026-10-11'
excerpt: 让 Agent 读懂代码库：代码知识图谱框架调研（实测篇）
tags:
- knowledge-graph
- rag
- agent
- eval
source: notebook
readingTime: 21
writtenAt: '2026-05-08'
---

# 让 Agent 读懂代码库：代码知识图谱框架调研（实测篇）

[理论篇](https://mp.weixin.qq.com/s/5B-QYdMEvoCiAPp4FGlk_Q) 调研了 4 个开源代码知识图谱框架（code-review-graph、GitNexus、Codebase-Memory、Graphify），目标都是把仓库建成图、让 AI agent 查调用关系、追业务链路。本文新增 **CodeGraph** 凑成 5 个，并在 Python / Go / Java 三种语言的真实项目上各跑了一遍。

> 💡 **数据可能有误差**：评测过程难免有口径分歧 / 测试方法 bug / 框架版本差异。完整数据 + 复现脚本在 GitLab：<https://code.qschou.com/liuhe/code-kb-eval>，欢迎拉下来复测纠错。

## 一、横评结果

### 1. 评测对象

**5 个开源框架**：

| 框架                | GitHub                                            | Stars（截至 2026-05-28） |
| :---------------- | :------------------------------------------------ | :------------------: |
| code-review-graph | <https://github.com/tirth8205/code-review-graph>  |        17.4k         |
| GitNexus          | <https://github.com/abhigyanpatwari/GitNexus>     |        40.3k         |
| Codebase-Memory   | <https://github.com/DeusData/codebase-memory-mcp> |         2.7k         |
| Graphify          | <https://github.com/safishamsi/graphify>          |        54.0k         |
| CodeGraph         | <https://github.com/colbymchenry/codegraph>       |        28.6k         |

**3 个真实项目 + 业务任务**：

| 语言     | 项目类型                                | 任务                 |
| :----- | :---------------------------------- | :----------------- |
| Python | FastAPI（开源框架，1118 文件）               | 找 10 个函数的调用方，跟标准答案比     |
| Go     | 支付回调网关微服务（60 文件）                    | 追支付回调入口函数的完整调用链    |
| Java   | 财务结算服务（950 文件，Spring/DDD/Maven 多模块） | 追「同步业务状态」业务链路      |

### 2. 评测方法

跑一次评测要解决两件事：**怎么避免运动员兼裁判**、**用什么维度打分**。

**三套维度为什么不强行统一？** Python 有 **ground-truth（人工标注的标准答案）** 走通用量化 5 维（**F1 综合准确率** / 增量 / token / 多跳 / 工程门槛）；Go / Java 是定性追业务链路，5 维改成语言痛点（1 跳准确性 / 跨包链路 / gRPC 或 接口实现 / 输出可读性 / 工程门槛）。F1 在 Go/Java 算不了（没标准答案对照），gRPC / 接口实现是语言独有痛点——硬塞通用维度会塌掉真实信息。

### 3. 评测结果

每格是「**开发者真实可用性**」综合评分（X/5），由语言裁判 agent（L2）独立打分（这个分具体怎么算出来的，见附录 6）。括号里是关键定量数据。

| 框架                    |  Python (FastAPI)   |    Go 微服务    |  Java DDD  |
| :-------------------- | :-----------------: | :----------: | :--------: |
| **GitNexus**          |   3.5/5（F1 0.77）    | **4.5/5** 🏆 | **5/5** 🏆 |
| **CodeGraph**         |  2/5（Recall 0.69）   |     2/5      | **4.5/5**  |
| **code-review-graph** | **5/5（F1 1.00）** 🏆 |     3/5      |    4/5     |
| **Codebase-Memory**   |   3.5/5（F1 0.77）    |     4/5      |    2/5     |
| **Graphify**          | 1.5/5（Recall 0.62）  |    1.5/5     |   1.5/5    |

**没有一个框架在三种语言上全胜**——Go 列没有 5/5 是因为 5 个框架在 gRPC 跨服务调用上全断（核心发现 2 详述）。具体怎么选见下面的「按场景选型」。


**按场景选型**（综合分按用例场景拆开看）：

| 场景                  | 首选                                                                               | 备选 / 不选别的的原因                                |
| :------------------ | :------------------------------------------------------------------------------- | :------------------------------------------ |
| Python 单仓库追影响范围     | **code-review-graph**（F1=1.00）                                                   | 不选 GitNexus：漏 starlette 等外部库 caller         |
| Go 微服务追业务链路         | **GitNexus**（人读，process 视图定位入口）/ **Codebase-Memory**（agent 自动追，`trace_path` 三件套） | 不选 code-review-graph：跨包 calls 边 JOIN 仅 8.6% |
| Java/Spring DDD 多模块 | **GitNexus**（`method_implements` 一等公民边，5 模块零丢失）                                  | **CodeGraph 合格备选**（4.5/5），接受 19s 索引就用       |
| 给 LLM 准备任务 prompt   | **CodeGraph**（context 输出 markdown）                                               | —                                           |
| 任意语料 → 分析报告         | **Graphify**（HTML 报告专业）                                                          | 不要拿它做 callgraph：calls 边 0 条跨文件              |

## 二、三个核心发现

### 1. 同框架换种语言，排名能反过来

很多框架号称"支持多语言"，但实测下来同一个框架在不同语言上的表现差到离谱。举三个例子：

- **GitNexus**：Python 3.5/5（不算优秀），到 Java 直接 5/5 满分——因为它专门给「接口 → 实现」做了 `method_implements` 这种边，Java DDD 项目里 ServiceI / ServiceImpl 遍地都是，正好打到点上
- **Codebase-Memory** 反过来：Python 3.5/5、Go 4/5（trace_path 三件套好用），到 Java 直接塌方到 2/5——因为它**根本没建 Java 的接口/实现关系**（索引日志里明示 `implements=0 inherits=0`），业务链路自然就断了
- **CodeGraph**：Go 2/5（vendor 100k 节点污染查询），Java 反而 4.5/5——因为 Java 上它有 `route` 独立 node kind 原生识别 `@PostMapping`；Go 上没这套加持，落到平庸

**单看 Python 的排名选框架会选错**。同框架不同语言可以差 2 倍以上。

### 2. 跨服务调用，5 个框架全追不下去

写微服务时，业务链路经常是这样：

```
你这个服务的函数 A
  → 调本地函数 B
    → 通过 gRPC 调"另一个服务"的函数 C   ← 跨进程出站
```

前两跳大部分框架能追到（Graphify 跨文件就断了，更早），但**第三跳一到 gRPC，5 个框架全部断链**：

| 框架 | gRPC 那一跳怎么了 |
|:---|:---|
| code-review-graph | 知道有这个调用，但目标是个裸字符串，连不到对面服务 |
| GitNexus | 自带的链路最多展示 5 步，gRPC 在边界外 |
| Codebase-Memory | 直接告诉你"需要跨仓库模式才能连" |
| Graphify | 跨文件调用边都没有，更别说跨服务 |
| CodeGraph | 把 vendor 里的 gRPC 桩代码跟业务调用混在一起，看不清 |

原因：这 5 个框架都**只看你这一个 git 仓库**，对面服务的代码它们根本读不到。

想追完整跨服务链路，得另外搞一套基于 OpenAPI / gRPC 接口契约的跨仓库索引——**这不是单个框架能解决的，是这类工具的天花板**。

### 3. 索引最快的框架，业务链路全断

看到"索引 0.1 秒"就觉得这框架真强？慎重。看下耗时跟综合评分的关系（耗时以 FastAPI 1118 文件为基准）：

| 框架 | 索引耗时 | 三语言最高综合分 |
|:---|:---:|:---|
| Graphify | 0.11s（最快） | 三语言全 1.5/5（业务主线全断）|
| Codebase-Memory | 0.14s | Go 4/5、Python 3.5/5、Java 2/5（implements 全断）|
| code-review-graph | 0.7s | Python 5/5、Java 4/5、Go 3/5 |
| GitNexus | 3.3s | Java 5/5、Go 4.5/5、Python 3.5/5 |
| CodeGraph | 19s（最慢） | Java 4.5/5、Go 2/5、Python 2/5 |

**最快的 Graphify 三语言全垫底，最慢的 CodeGraph 在 Java 上反而拿到 4.5/5**。真正决定好不好用的是另外两件事：

- **跨文件/跨包的调用边建得全不全**（Graphify 直接 0 条跨文件，所以再快也没用）
- **CLI 用起来顺不顺**（code-review-graph 0.7 秒索引很爽，但要看链路得自己写 SQL，不顺）

---

## 三、附录

### 1. 名词解释

| 名词          | 含义                                                                                         |
| :---------- | :----------------------------------------------------------------------------------------- |
| 综合评分（X/5）   | 由语言裁判 agent（L2）独立打分。完整 schema + prompt 模板见 [`methodology/`](https://code.qschou.com/liuhe/code-kb-eval/-/tree/main/methodology) |
| F1（0-1）     | 业内通用术语，又叫「**综合准确率**」——综合「准不准（精确率）+ 全不全（召回率）」的总分，越高越好。详细计算见下一节                                  |
| Recall（0-1） | 只数"该找的找到了几个"，不惩罚"乱报一堆"。比 F1 宽容——**Recall 分不能直接跟 F1 比大小**                          |
| 🏆          | 该语言下的并列首选；同分时按场景拆开看，详见正文「按场景选型」                                                            |
| 括号内定量指标     | F1 / Recall 来自跟 ground-truth 自动比对（仅 Python 列适用）   |

### 2. F1 计算方式

举个例子，函数 `add_api_route` 真实有 2 个 callers：`app.py` 和 `routing.py`：

| 框架答 | 准不准（精确率）| 全不全（召回率）| **F1**（综合）|
|:---|:---:|:---:|:---:|
| 「app.py, routing.py」全对 | 2/2 = 1.0 | 2/2 = 1.0 | **1.0** 满分 |
| 只报「app.py」漏一个 | 1/1 = 1.0 | 1/2 = 0.5 | **0.67** |
| 报「app.py, routing.py, test.py」多一个 | 2/3 = 0.67 | 2/2 = 1.0 | **0.80** |

F1 同时惩罚**漏报**和**误报**。Graphify / CodeGraph 输出的是给 LLM 的 markdown，里面除了 callers 还混了相关函数、测试、路由信息——你没法区分哪些是它认为的 callers、哪些是"顺手带的相关上下文"。这种情况只能算 **Recall**（该找的找到几个），算不了 F1，所以 Recall 不惩罚乱报，比 F1 宽容。

### 3. 五维度评分明细

每个综合分背后的细项打分，供按维度做更细的选型参考。三套维度为什么不一样，见正文「评测方法」。

#### 3.1 Python (FastAPI)

> 列含义：**token 中位** = 10 个测试函数的查询输出 token 取中位数；**多跳** = 起点 `solve_dependencies` 沿调用边 BFS 1/2/3 跳各拿到的节点数；**工程门槛** = 安装 + 上手 + 文档 + 维护四项综合，由易到难分五档：易 / 较易 / 中 / 较难 / 难。详细口径见 handbook。

| 框架                | 准确性            | 增量更新           | token 中位 | 多跳（1/2/3 跳节点数）    | 工程门槛 |
| :---------------- | :------------- | :------------- | :------: | :---------------- | :--: |
| code-review-graph | ✅ F1 1.00      | ⚠️ 真增量 8x（伪一致） |   1040   | ✅ 17/43/64        |  易  |
| GitNexus          | ⚠️ F1 0.77     | ❌ 0.1x（无真增量）   |   911    | ⚠️ 5/13/9（干净但漏外部） |  中  |
| Codebase-Memory   | ⚠️ F1 0.77     | ⚠️ 1.6x ⚠️漂    |   1446   | ✅ 9/26/59         | 较易 |
| Graphify          | ❌ Recall 0.62  | ❌ 全量重建         |   3759   | N/A               |  难  |
| CodeGraph         | ⚠️ Recall 0.69 | ⚠️ 4x ⚠️漂      |   2510   | N/A               | 较难 |

#### 3.2 Go 微服务

| 框架 | 1 跳准确性 | 跨包/文件 calls 边 | gRPC 跨服务 | 输出可读性 | 工程门槛 |
|:---|:---|:---|:---:|:---|:---:|
| code-review-graph | ✅ 4 业务+stdlib 混排 | ⚠️ 121/1408 跨包（8.6%）| ❌ 断 | ⚠️ 要写 SQL | 易 |
| GitNexus | ✅ 5 业务/0 噪声 | ✅ process 4 跳直出 | ❌ ≤5 步 | ✅ JSON 干净 | 中 |
| Codebase-Memory | ✅ 业务出口在 1 跳 | ✅ trace_path 三层 | ❌ 需 cross-repo 模式 | ✅ 三件套 | 较易 |
| Graphify | ❌ 只同文件邻居 | ❌ **0 条跨文件** | ❌ 全断 | ⚠️ BFS 含噪声 | 难 |
| CodeGraph | ⚠️ 漏关键下一跳 | ⚠️ vendor 噪声入图 | ❌ stub 混排 | ✅ markdown 给 LLM | 较难 |

#### 3.3 Java DDD

| 框架 | 1 跳准确性 | 跨 Maven 模块 | 接口/实现关联 | Spring 注解/路由 | 工程门槛 |
|:---|:---|:---:|:---|:---:|:---:|
| code-review-graph | ✅ 1 跳精准 | ✅ DI 解析器补 1600+ 边 | ⚠️ 非直边，要拼 | ⚠️ 注解去噪 | 易 |
| GitNexus | ✅ ambiguous 明确 | ✅ **5 模块零丢失** | ✅ `method_implements` 一等公民 | ⚠️ 路由元数据未抽 | 中 |
| Codebase-Memory | ⚠️ 短名空，要 Cypher | ✅ 带模块前缀 | ❌ **implements=0**（孤儿）| ❌ 7 Route 全 gRPC | 较易 |
| Graphify | ❌ 0 跨文件 calls | ❌ 0 跨模块 | ❌ 没 implements / overrides | ❌ 注解全丢 | 难 |
| CodeGraph | ✅ Entry Points 直出 | ✅ 5 模块全通 | ✅ Entry Points 同时返回接口+实现 | ⚠️ route 节点 7 个非 Spring 路由 | 较难 |

**每格读法**：✅=合格 / ⚠️=有问题 / ❌=失败 / N/A=框架设计不参与该维度。具体数字含义见 [`evaluation-handbook.md`](https://code.qschou.com/liuhe/code-kb-eval/-/blob/main/evaluation-handbook.md) Part 1。

### 4. CLI 层 vs MCP 层能力补充

上面的评分主要基于各框架的 CLI / 原生查询接口（追链路、比 caller）。部分框架还多一层 MCP server，接口能力跟 CLI 不一样，补两点（仅覆盖实测接过 MCP 的 code-review-graph 和 Codebase-Memory 两个，其余三个未核实）：

- **code-review-graph 的 MCP 层自带 context 工具**：`get_review_context_tool`（影响面 + 源码片段 + review 指引，token 高效）、`get_minimal_context_tool`（约 100 token 的紧凑上下文）直接给 agent 结构化 context，不用像 CLI 那样自己写 SQL。所以正文「要看链路得自己写 SQL」说的是 CLI 层；MCP 层有现成 context 输出。注意这只解决「审查上下文供给」，不改变 Go 跨包调用边本身建得稀（8.6% 跨包边）的问题——链路断还是断。
- **Codebase-Memory 支持自然语言查询**：MCP 层 `search_graph` 的 `query=` 走 BM25 全文检索（camelCase 自动拆词 + 结构加权，面向自然语言发现），`semantic_query=[...]` 走向量余弦（搜 "send" 能命中 "publish"）。对比 code-review-graph 只能用固定 pattern（callers_of / callees_of 等）+ 报准符号名，Codebase-Memory 的自然语言入口更直接。

### 5. 五个框架怎么装 / 怎么查

安装命令和查询接口都取自评测脚本实测（版本为 2026-05 评测时所用）。「查 callers 的接口」= 实测「谁调用了 X 函数」这一步用的命令。

| 框架                | 版本      | 安装                                               | 查「谁调用 X」的接口                                                                          |       要不要搭服务       | 工程门槛 |
| :---------------- | :------ | :----------------------------------------------- | :----------------------------------------------------------------------------------- | :----------------: | :--: |
| code-review-graph | v2.3.3  | `pip install code-review-graph`                  | 建图后直接查 SQLite（沿 CALLS 边 BFS，要自己写 SQL）；MCP 层另有 `get_review_context_tool` 出结构化 context |         否          |  易   |
| GitNexus          | v1.6.5  | `npm install -g gitnexus`                        | `gitnexus context <函数名>`（`--content` 带源码），读 JSON 里的 `incoming.calls`                 |         否          |  中   |
| Codebase-Memory   | v0.6.1  | `codebase-memory-mcp install -y`（本身是 MCP server） | `trace_path` / `search_graph` / `get_code_snippet` 三件套，或直接写 Cypher                   | 否（内嵌图，但要接 MCP 客户端） |  较易  |
| CodeGraph         | v0.9.3  | `npm install -g @colbymchenry/codegraph`         | `codegraph context <任务描述>`，从 markdown 输出里 grep 文件名                                   |         否          |  较难  |
| Graphify          | v0.3.28 | `pip install graphifyy`（包名是双 y）                  | `graphify query <问题> --graph graph.json`，从输出 grep 文件名                                |         否          |  难   |

**几个上手要点**：

- **门槛卡的是「怎么查」不是「怎么装」**：五个都不用搭 Neo4j / 起服务，`pip` 或 `npm` 一条命令装完。真正的坎是查询接口——code-review-graph 追链路要写 SQL、Codebase-Memory 必须接 MCP 客户端才能跑、CodeGraph 的 CLI 不开放（准确率没法自动测）。
- **GitNexus 装最简单但文档最坑**：CLI 一条 `gitnexus context` 就能查，但文档没写清楚 callers 怎么拿，得自己摸子命令 + 解析 `incoming.calls`——工程门槛因此从 A 掉到 B。
- **Graphify / CodeGraph 的输出是给 LLM 的 markdown**：没有「callers」这种结构化字段，得从整段 markdown 里 grep 文件名，所以只能算 Recall、算不了 F1（见附录 2）。

### 6. 综合分是怎么打出来的

正文 X/5 不是拍脑袋，是一套「采数 / 打分」分工的 agent 流程，专门防「运动员兼裁判」（prompt 模板在仓库 `methodology/`）：

- **L1 采数 agent**：只跑框架、把客观数字（F1、跨包 JOIN 率、多跳节点数、token、索引耗时…）dump 进 `raw.json`，**不打分**。
- **L2 语言裁判 agent**：每种语言一个，**只看 5 份 raw.json**——看不到别的语言数据、也看不到文章草稿和任何带结论的报告。按维度给 5 个框架各打 1-5 分，每个分必须指向一个具体数字（比如「F1=1.00 → 5/5」「跨包 0 条 → 1/5」），且禁止全打 3 分，必须分出高下。

**综合分 = 各维度 1-5 分的加权平均**（折算回 1-5，取 0.5 档）。权重按各语言的「杀手测试」定，不是均权：

| 语言 | 权重（维度 ×倍数） |
| :--- | :--- |
| Python | 准确性 ×2 / 多跳 ×1.5 / token ×1 / 增量 ×0.5 / 工程 ×1 |
| Go | 准确性 ×2 / 跨包 ×2 / gRPC ×1 / 可读性 ×1.5 / 工程 ×1 |
| Java | 跨模块 ×2.5 / 接口实现 ×2.5 / 准确性 ×1.5 / 注解路由 ×0.5 / 工程 ×0.5 |

所以正文表里括号的 F1 / Recall 只是「准确性」**这一个维度**的原始量化值，综合分是它跟其余几维加权后的结果——**F1 高不等于综合分一定高**。典型例子：Python 的 GitNexus F1 有 0.77，综合却只有 3.5/5，就是被「增量更新 1/5、多跳漏外部库」两项拖下来的。每维度逐框架的打分理由在仓库 `results/<语言>/JUDGE.md`。

---

历史文章导入 · 历史文章编号：20260508-code-graph-experiment · 写作日期 2026-05-08
