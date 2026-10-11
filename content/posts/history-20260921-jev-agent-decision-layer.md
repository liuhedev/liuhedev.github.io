---
title: Jev 火了：它看起来像个“分类器”，为什么 Agent 时代又需要它？
date: '2026-10-11'
excerpt: Jev 火了：它看起来像个“分类器”，为什么 Agent 时代又需要它？
tags: []
source: notebook
readingTime: 6
writtenAt: '2026-09-21'
---

# Jev 火了：它看起来像个“分类器”，为什么 Agent 时代又需要它？

![Jev 封面](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260921-jev-agent-decision-layer/d595ba673e087fb36f39a24e51901d374ee3fa688e6ed75e61c0d4a4e615134e.png)

最近 Jev 在 Agent 圈突然火了。模型路由、Tool Approval、Skill Router、RAG Rerank、上下文裁剪……社区玩法很多，但都指向同一个问题：

**为什么生成式 AI 已经这么强，我们又开始需要“分类器”了？**

---

## 一、Jev 是什么？

TypeSafe 把 Jev 定义为首个 **System One Model**：输入状态和结构化问题，输出带概率与置信度的类型化决策。

如果先不管这些名词，一句话解释：

**从工程使用上看，Jev 更像一个“智能 if”。**

大模型擅长写文章、写代码、做方案；Jev 更适合回答有限答案空间里的问题：是不是、选哪个、风险多高、要不要继续。

比如 Agent 准备执行危险命令，我们不需要一篇分析，只需要：

```text
safe / ask / block
```

![LLM 与 Jev 对比](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260921-jev-agent-decision-layer/20fc767bffeb0082b16614c269b949831db6ad041b68db230fe868dc8a0b58ac.png)

Jev 主要提供三种基础能力：

- **Noul**：判断“是不是”，输出概率。
- **Choice**：从有限选项中选一个。
- **Score**：按预设等级打分。

![Jev 三种 Primitive](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260921-jev-agent-decision-layer/456d08169f225becbed8c2077f6a76fe1a31644070f5903a5bf73fcfbc0e9083.png)

它的价值不是生成更多内容，而是更快地给出结构化判断。

但要注意：**type-safe 只保证输出不超出定义的类型，不保证判断一定正确。** 高风险场景仍需要阈值、代码规则或人工兜底。

---

## 二、大家都拿 Jev 做什么？

这些玩法看起来不同，本质都是：

**把原来需要大模型处理的小判断拆出来，交给 Jev。**

### 1. 模型路由

先判断任务复杂度，再把任务交给不同模型。它更适合发生在 SubAgent 派发阶段，而不是在长会话里频繁切模型，否则 Prompt Cache 可能失效，成本反而更高。

![LINUX DO：Jev 多模型路由讨论](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260921-jev-agent-decision-layer/5a72bff57b7c8482ce4ca8f4c776ec32898496dc1a188b7a8c69cf2bb7b294f7.png)

Jev 提供任务类型、复杂度和风险信号，真正的路由仍由代码控制。

### 2. Tool Approval

在 Agent 执行 `git reset --hard`、`rm`、`kubectl delete` 等操作前，让 Jev 先做语义判断，再由本地 Policy 决定执行、拒绝或交给人。

![LINUX DO：open-jev-approvals](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260921-jev-agent-decision-layer/9db807e0c7d1e9c7415d031064892f9528c6e27352e5e3c66002a264fbf2b410.png)

关键不是把权限交给 Jev，而是：**Jev 提供判断，代码握着最终开关。**

### 3. Context Filter

工具结果进入主模型前，先判断是否相关：有用就保留，无关就丢弃。这样可能比等上下文快满了再压缩更干净。

![LINUX DO：Jev 上下文消融思路](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260921-jev-agent-decision-layer/124eb4e6d510026075ec3dbf9ef8eaa7b858b61a03c8574e1430f2e651626412.png)

不过这仍是实验方向，收益要看工作轮数、API 成本、耗时和完成质量，不能只看单次延迟。

### 4. 文献筛选

有用户用 Jev 批量判断医学论文是否相关、属于哪类，再交给 Claude Code 复核。

![LINUX DO：Jev 医学文献筛选实测](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260921-jev-agent-decision-layer/8873a07f65ab252d417e299a842255567385c3e2ca5df56eac5a5cb87a5d3cde.png)

这很像过去的文本分类，但不必为每个新任务重新训练一套专用模型。

### 5. RAG、Skill 和 MCP

它们都可以归纳为“先筛再用”：RAG 先过滤召回结果，Skill/MCP 只暴露当前相关能力，Semantic Lint 先判断是否违反语义规则。

**先缩小答案空间，再把真正复杂的任务交给生成模型。**

---

## 三、为什么像分类器，又不只是分类器？

如果说的是工程角色，Jev 确实很像分类器；如果说的是模型实现，就不能直接画等号。

传统文本分类通常是“特征 + 逻辑回归/SVM”；BERT 时代是在预训练模型上接分类头，并针对具体标签数据微调。任务变了，往往要重新准备数据和适配模型。

生成式 AI 出现后，不训练也能靠 Prompt 分类，但为了得到一个 A/B/C/D，每次都调用能生成几千字的大模型，显得太重。

Jev 的变化在于：同一个模型，可以在运行时接收问题和候选项，今天判断 PR 风险，明天选择模型，后天检查 Tool Call；输出还能直接进入程序控制流。

![AI 分类演进](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260921-jev-agent-decision-layer/27cdae2e9493863be70a7258123acf0fe40de6d2ff947f0c5c73e708eaccb2f1.png)

为什么现在又火？因为 Agent 真正运行后，会持续遇到大量判别问题：要不要搜索、选哪个 Tool、结果是否相关、该不该调用强模型、任务是否完成、动作是否危险。

一个更合理的分工是：

```text
LLM：理解、规划、生成
Jev：分类、路由、过滤、门禁
代码：确定性执行
```

![Jev + Agent 架构](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260921-jev-agent-decision-layer/58e4b45a3b22c5138b3d2f37f8a229fae42e0868438e8a63df0d5db9f69db425.png)

这比把所有事情都交给一个大模型，更像正常的软件工程。

---

## 四、最后怎么看？

Jev 不会替代 GPT、Claude，也不会替代业务规则。它补的是两者之间的空白：规则不好写、调用完整大模型又太重的高频语义判断。

> **Jev 不是“下一个 ChatGPT”，更像生成式 AI 时代面向 Agent 的通用语义决策器。**

---

## 参考资料

本文资料整理截至 2026-09-21。

- TypeSafe AI：Introducing System One Models & Jev  
  https://typesafe.ai/blog/introducing-system-one-models-and-jev
- TypeSafe AI Docs  
  https://docs.typesafe.ai/
- GitHub：Awesome Jev  
  https://github.com/valentynkit/awesome-jev-typesafe
- LINUX DO：Jev 39 个应用汇总  
  https://linux.do/t/topic/2919004
- LINUX DO：Codex 多模型路由讨论  
  https://linux.do/t/topic/2926255
- LINUX DO：Jev Auto Approval  
  https://linux.do/t/topic/2927321
- LINUX DO：Pi + Jev 上下文消融讨论  
  https://linux.do/t/topic/2920473
- LINUX DO：Jev 医学文献筛选实践  
  https://linux.do/t/topic/2924299

---

历史文章导入 · 历史文章编号：20260921-jev-agent-decision-layer · 写作日期 2026-09-21
