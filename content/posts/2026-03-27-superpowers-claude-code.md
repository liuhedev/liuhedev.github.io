---
title: "拆解 Superpowers：给 Claude Code 装上一套"
slug: "superpowers-claude-code"
summary: ""
date: 2026-03-27
tags:
  - 龙虾哥打工日记
source: original
status: published
---
Superpowers 是一套 Claude Code 的技能框架，干的事情说白了就是给 AI 立规矩。

加的功能不多，核心就是一套 SOP（标准作业程序）。

这篇文章拆解它的底层逻辑：一组 Skill 文件，怎么就把 AI 的开发行为管住了。

## 1. Superpowers 在解决什么问题

AI 辅助开发有两个老毛病：上来就动手改代码，改完了又拿不出证据证明自己改对了。

典型场景："帮我写个用户注册功能。"Claude 一口气改了 5 个文件，报错，你反馈，它再改，几轮下来项目一片狼藉。

Superpowers 强制介入了这个过程：

- 想写代码？先 Brainstorming，把需求对齐了再说。
- 方案定了？先写 Plan，把任务拆成 2-5 分钟能干完的小块。
- 准备提交？别嘴说"改好了"，把 Verification 的运行结果摆出来。

需求讨论、隔离开发、拆分计划、TDD 验证，每个环节都有强制约束，跳不过去。

## 2. 核心机制：Skill 文件

Superpowers 没有什么复杂的二进制程序。它是一套 Agent 技能框架，核心就是一组 Skill 文件。

在 Claude Code 的体系里，只要在项目的 `skills/` 目录下定义了 `SKILL.md`，Claude 就会在执行任务前自动扫描并遵循这些规则。

触发策略很硬：只要有 1% 的可能性适用，Claude 就会强制调用相关 Skill。不是建议，是规则。

## 3. Skill 全景图：编排流程与完整清单

Superpowers 目前包含 14 个 Skill，按职责分成四层：

| 层级  | Skill                          | 职责                                                                       |
| --- | ------------------------------ | ------------------------------------------------------------------------ |
| 入口层 | using-superpowers              | 每次会话启动时强制加载，强制先查 Skill 再行动，未 brainstorm 不得进入 Plan |
| 需求层 | brainstorming                  | 9 步苏格拉底式探索：探索上下文 → 可视化辅助 → 澄清提问 → 提出方案 → 展示设计 → 写设计文档 → 自审 → 用户审阅 → 移交实现 |
| 规划层 | writing-plans                  | 将方案拆成 2-5 分钟颗粒度的任务，每步包含文件路径、代码片段、测试方法                                    |
| 环境层 | using-git-worktrees            | 为每个功能创建独立物理目录，支持多 Agent 并行                                               |
| 执行层 | subagent-driven-development    | 每个任务派独立子 Agent，完成后两阶段 Review                                             |
| 执行层 | executing-plans                | 单会话内批量执行任务，带检查点                                                          |
| 执行层 | dispatching-parallel-agents    | 多个独立任务并行派发给不同子 Agent                                                     |
| 质量层 | test-driven-development        | RED → GREEN → REFACTOR 强制循环                                              |
| 质量层 | requesting-code-review         | 任务间自动触发代码审查                                                              |
| 质量层 | receiving-code-review          | 收到 Review 反馈后，先验证再修改，不盲目接受                                               |
| 质量层 | verification-before-completion | 完成前必须贴运行结果作为证据                                                           |
| 辅助层 | systematic-debugging           | 系统化排查流程，避免乱猜                                                             |
| 收尾层 | finishing-a-development-branch | 分支完成后的清理、合并、收尾                                                           |
| 元层  | writing-skills                 | 编写新 Skill 的规范                                                            |

### 编排流程

一个典型的开发任务，从头到尾的编排顺序：

```
using-superpowers（意识植入）
  ↓
brainstorming（苏格拉底式需求对齐，9 步）
  ↓
writing-plans（拆分任务，每步 2-5 分钟）
  ↓
using-git-worktrees（创建隔离环境）
  ↓
subagent-driven-development 或 executing-plans（执行任务）
  ↓ 每个任务完成后：
  ├─ test-driven-development（TDD 验证）
  ├─ requesting-code-review（两阶段审查）
  └─ verification-before-completion（证据确认）
  ↓
finishing-a-development-branch（收尾合并）
```

这里的设计要点是层与层之间有前置依赖。没完成 brainstorming 就不能进 writing-plans，没有 Plan 就不能启动执行，没有 verification 就不能完成任务。这些卡点通过提示词中的 `<HARD-GATE>` 标签和 Checklist 来约束 Agent 行为。

## 4. 几个核心 Skill 的设计思路

表格看完了轮廓有了，几个 Skill 的内部设计值得单独拆开看看。

### 4.1 brainstorming：9 步需求对齐

brainstorming 不是随便聊两句，它定义了 9 个步骤：

1. 探索上下文：扫描项目结构，理解现有代码
2. 可视化辅助：提供架构图等视觉化工具帮助对齐
3. 澄清提问：通过单个问题逐步挖掘目标、约束、判断标准
4. 提出方案：给出 2-3 个可选方案并评估利弊
5. 展示设计：分段向用户呈现设计，增量确认
6. 写设计文档：将确认后的设计写入 docs/plans/
7. 自审：对设计文档进行自我审查
8. 用户审阅：用户确认设计文档
9. 移交实现：转入 writing-plans Skill

有个细节：每次只问一个问题。一次抛三个问题，用户往往只回答最好答的那个。

Phase 9 移交实现阶段，`SKILL.md` 里是这么写的：

> *REQUIRED SUB-SKILL: Use superpowers:writing-plans to create the implementation plan.*

这就是前面提到的"提示词链"：没有代码在控制逻辑，全靠这行大写加粗的提示词去"命令"大模型调起下一个 Skill。说穿了就是用自然语言写的函数调用。

### 4.2 writing-plans：防止 Agent "跑偏"

要求 Claude 在动手前，必须写出包含具体文件路径和代码片段的详细计划，且每个步骤必须在 2-5 分钟内可完成。

上下文窗口虽然大，但逻辑链条一长，幻觉和遗忘就来了。切到极细的颗粒度，Agent 在每个微步骤上才能保持清醒。

Plan 写完后，文件里会有一段注释指导下一步：

> *For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.*

Claude 读到这行注释，就会自己决定去调用执行层的 Skill。整个流程的编排全靠提示词里的这些"路由指令"串起来。

### 4.3 subagent-driven-development：执行与审核分离

每个任务由独立子 Agent 执行，完成后经过两轮检查：第一轮核对是否符合 Plan 规格，第二轮审查代码质量。

自己写代码容易陷入局部最优，审查别人的代码反而看得更准。把执行和审核拆成两个角色，产出质量会好不少。

### 4.4 test-driven-development：证据先于断言

强制执行 RED → GREEN → REFACTOR。先写一个失败的测试，确认它报错，写最小实现，确认测试通过。

AI 特别爱说"我已经修好了"。Superpowers 不听这个，要求 Claude 必须展示测试失败和通过的完整输出。没有证据，任务就不算完。

## 5. 这种模式能迁移到哪里

Superpowers 是为软件开发设计的，但"元指令 + 结构化约束"的思路可以搬到别的场景。

比如自动化调研：让 Agent 先列关键词，再逐一深度阅读提取结论，最后对比不同来源的矛盾点。调研从"碰运气"变成"走流程"。

再比如企业审批流：自动校验附件格式，对照规则判断审批层级，生成摘要推送到对应群组。

思路是一样的：把经验写成规则，把流程交给工具执行。

## 6. 写在最后

拆完 Superpowers，一个感受很直接：AI 产出靠谱，靠的不是模型更聪明，而是规矩更死。

程序员的角色在变。写代码这件事 AI 越来越能干，但定义"怎么写、按什么顺序写、怎么验证写对了"这套 SOP，还是得人来。

把 Claude 当更聪明的 Copilot 用，浪费了它大部分能力。更有价值的做法是把自己的工程经验固化成 `SKILL.md`，让 AI 按你的方式工作。

代码会越来越廉价，经过验证的工作流才值钱。

---
*项目地址：[github.com/obra/superpowers](https://github.com/obra/superpowers)*
*Claude Plugins Official | 开源拆解*
