---
title: GPT-6 来了，我先重整了 Agent 环境
date: '2026-10-11'
excerpt: 每次基础模型大版本更新，我都会体检 Agent 环境。这次用上 GPT-6 Astra，我重新检查了电脑使用方式、AGENTS.md 与 Skills。
tags:
- GPT-6 Astra
- Agent
- AGENTS.md
- Skills
source: notebook
readingTime: 4
writtenAt: '2026-09-06'
---

# GPT-6 来了，我先重整了 Agent 环境

OpenAI 给了两次重置机会后，我终于用上了 GPT-6 Astra。拿到新模型后，我先做了一次 Agent 环境体检。这也是我在每次基础模型大版本更新后最先做的事：一是和它讨论怎样让 Agent 更好地使用我们的电脑；二是重新审计 AGENTS.md 与 Skills，看这些长期指令是否仍然适配最新模型。

![这两天的 Agent 环境整理与指令体检记录](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260906-gpt6-astra-audit/7d96aec0a6bc21ef2f8ff02b19c98f114baef8d9a38caa7e91a4c3dde47f9307.png)

这让我想到之前写的[《Claude 砍掉 80% 系统提示词后，团队知识该放哪里？》](https://mp.weixin.qq.com/s/xQdyZxDGxWlFEBItggSyzg)。那篇文章讨论的是：模型判断力提升后，为旧模型准备的防呆规则可能产生副作用，规则与知识需要重新分配。OpenAI 这次给出的 Astra 指导，也正好呼应了我目前搭建 Agent 运行基建的做法。

原文链接：https://mp.weixin.qq.com/s/xQdyZxDGxWlFEBItggSyzg

## 1. 模型越听话，旧规则越容易添乱

OpenAI 提醒，Astra 更擅长遵循长指令，也更敏感于 Skills、AGENTS.md 等文件中的内容。含糊或冲突的规则，可能让它重复确认、提前停工，或者为一个小改动跑过多测试。

官方指导写得很直接：Skill 里不清晰或相互冲突的规则，可能让模型暂停并提前阻断工作；对于小型代码改动，Astra 也可能运行超出任务所需的测试。这正是我这轮审计重点检查的两类问题。

这些问题并不是 Astra 才有。变化在于，新模型更可能把旧规则完整执行出来。因此，每次基础模型升级，都值得重新审计它长期读取的指令。

## 2. 这次审计，主要发现了四类问题

**第一，真正生效的指令不一定是眼前那份。**

同一条规则可能同时出现在全局配置、项目文件、Skill 和插件注入里，内容却已经不同。只改磁盘上最显眼的文件，模型仍可能读取旧版本。审计必须先还原真实加载顺序，再判断哪里才是权威来源。

**第二，绝对规则缺少适用条件。**

问题不在 `MUST` 或 `NEVER` 这些词，而在规则没有写清作用范围。只为高风险操作准备的确认要求，如果扩散到只读查询、文档处理和可逆修改，就会让 Agent 频繁停下来。

**第三，Skill 的触发范围过宽。**

有些 `description` 依赖关键词匹配，没有说明哪些相似任务不该触发；还有些 Skill 把「存在输入材料」误当成「用户已经授权执行」。结果是普通解释任务也被拖进设计、编码、测试或发布流程。

**第四，为旧模型补的防呆规则开始产生反作用。**

逐步确认、固定输出模板、无条件全量扫描和逢改必测，原本是为了弥补模型的不稳定。Astra 更能遵守长指令后，这些规则也更可能被完整执行，表现为提前停工、重复验证和任务范围扩大。

这次调整没有删除安全边界、项目事实和明确偏好，而是把指令来源、触发条件和优先级写清楚。能由机器验证的要求交给测试、Schema 和 Hook；真正高风险的动作继续由权限和人工审批保护。

![GPT-6 Astra 迁移时的 Agent 环境审计顺序](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260906-gpt6-astra-audit/35b689d0acfefbc351eac0ea4e6a734db816ea072b032cd0b74e06c2b8fbc58f.png)

## 附：一段可直接使用的审计提示词

下面这段可以直接复制，先审计，不改文件：

```text
请阅读 OpenAI 最新模型指导，重点关注 GPT-6 Astra 的 instruction following、follow-through、testing 和 Skills，然后审计当前实际生效的 AGENTS.md、SKILL.md、插件注入及其他持久指令。

先查清软链、override、目录层级和运行时扫描范围。重点找出：冲突、重复或过时的规则；缺少适用条件的绝对指令；会导致重复确认、提前停工、过度测试或全仓扫描的规则；触发范围过宽的 Skill；为旧模型编写、在 Astra 上可能造成过度执行的指示。

系统与开发者指令始终优先；在这些边界内，用户当轮明确指令优先于 Skill 的一般建议。保留安全门禁、项目事实和有效偏好。

先输出只读报告：文件或加载源 → 原文 → 在 Astra 上的可能表现 → 修改建议。最后分为「保留、收窄、删除、待我决定、未核实」五类。这一轮不要修改文件、创建分支或补测试。
```

与其继续把提示词写长，不如明确指令的作用范围、优先级和验证方式。

---

### 附录：参考来源

1. OpenAI：Using GPT-6 Astra  
   https://developers.openai.com/api/docs/guides/latest-model
2. OpenAI：Build skills  
   https://learn.chatgpt.com/docs/build-skills
3. OpenAI：Custom instructions with AGENTS.md  
   https://learn.chatgpt.com/docs/agent-configuration/agents-md

---

历史文章导入 · 历史文章编号：20260906-gpt6-astra-audit · 写作日期 2026-09-06
