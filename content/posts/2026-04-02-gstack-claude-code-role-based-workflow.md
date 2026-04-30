---
title: "GStack 拆解：把 Claude Code 变成一支 AI 交付小队"
slug: "gstack-claude-code-role-based-workflow"
summary: "拆解 Garry Tan 开源的 GStack 工作流，看它怎么通过角色拆分把 Claude Code 从代码助手变成一支能跑完交付全流程的 AI 小队。"
date: 2026-04-02
tags:
  - 龙虾哥打工日记
source: original
status: published
---
# GStack 拆解：把 Claude Code 变成一支 AI 交付小队

最近 Claude Code 周围冒出来不少工作流框架，Garry Tan 开源的 [GStack](https://github.com/garrytan/gstack) 我觉得思路蛮不一样的。它没有在"怎么写出更好的 Prompt"上下功夫，而是把 AI 开发过程拆成了角色协作——CEO、工程经理、设计师、QA 各管一段，你负责拍板就行。

## GStack 是什么

GStack 是一组 Claude Code 技能，每个技能扮演一个角色，按软件交付流程依次干活。

> Think → Plan → Build → Review → Test → Ship → Reflect

和别的 Claude 增强工具比，GStack 不追求让一个 AI 什么都干。它靠分工和流程约束，让每一步的输出质量更可控。

## 能力一览

GStack 把交付链路的每个环节都做成了 Skill，从需求到上线后观察都有对应入口：

| 阶段 | Skill | 干什么 | 什么时候用 |
|------|-------|--------|-----------|
| 需求澄清 | `office-hours` | 像 YC Office Hours 一样追问你到底要解决什么问题 | 动手写代码之前 |
| 产品评审 | `plan-ceo-review` | 从 founder 视角看需求值不值得做、范围对不对 | 有初步方案后 |
| 工程评审 | `plan-eng-review` | 审架构、数据流、边界条件、测试方案 | 方案准备进入开发 |
| 设计评审 | `plan-design-review` | 揪出 AI Slop，补交互和视觉质量 | 有界面方案时 |
| 设计咨询 | `design-consultation` | 给出设计方向、风格和 mockup 思路 | 前端或视觉探索阶段 |
| 代码审查 | `review` | 找生产风险、缺失点、明显 bug，能修就直接修 | 写完代码准备提交 |
| 问题排查 | `investigate` | 先查后修，不让 AI 乱猜着改 | 遇到 bug 或测试挂了 |
| 浏览器操作 | `browse` | 真实 Chromium 里浏览、截图、点击、抓内容 | 需要网页交互或验证 |
| QA 修复 | `qa` | 在真实浏览器里测、报 bug、修、回归 | 联调或提测前 |
| QA 只报告 | `qa-only` | 只报 bug 不动代码 | 想测但不想自动改 |
| 安全审查 | `cso` | OWASP Top 10 + STRIDE 安全检查 | 上线前或高风险功能写完后 |
| 发版提交 | `ship` | 跑测试、补检查、推分支、开 PR | 准备发布 |
| 合并部署 | `land-and-deploy` | 合并 PR、等 CI、部署、验活 | PR 通过后 |
| 金丝雀观察 | `canary` | 部署后盯错误率、性能、页面健康 | 刚上线 |
| 性能基线 | `benchmark` | 测页面性能、体积、Core Web Vitals | 性能优化或 PR 前后对比 |
| 发布文档 | `document-release` | 更新发布相关文档 | 发完版补文档 |
| 复盘 | `retro` | 做交付复盘 | 迭代结束 |

## 一个功能的完整流程

用 GStack 开发一个功能，走下来很像一个小团队的协作节奏：

```text
1. /office-hours       → 把问题想清楚，别急着写代码
2. /plan-ceo-review    → 看值不值得做，范围对不对
3. /plan-eng-review    → 锁定技术方案和边界
4. /plan-design-review → 补设计质量，干掉 AI 味
5. 写代码
6. /review             → 代码审查
7. /qa                 → 真实浏览器跑一遍
8. /ship               → 跑测试、提 PR
9. /land-and-deploy    → 合并部署
10. /retro             → 回头看看这轮做得怎么样
```

你要做的就是在每个节点上做判断和拍板，标准化的活 GStack 接了。

## 设计上的几个选择

**为什么拆角色而不是做一个万能 Agent？** 让一个 AI 同时当产品经理、设计师、开发、测试，我试过，效果不太行。产品判断和工程判断需要的思维模式差太远，塞在一个 Prompt 里互相干扰。GStack 的做法是每个阶段切一个角色 Prompt，各管各的。我自己用下来，工程评审和代码审查这两步的输出比单 Agent 靠谱不少，产品评审那步有时候还是会说一些正确的废话。

**真实浏览器撑起了好几个能力。** GStack 的 `/browse` 让 AI 操作真实的 Chromium，不只是截个图看看。`qa`、`design-review`、`benchmark` 都依赖这个能力，没有它这几个 Skill 就是空架子。AI 写的页面看着没问题但跑起来一堆 bug，这事我踩过不止一次，有了浏览器 QA 之后好了很多，虽然也不是什么都能抓到。

**覆盖链路比多数工具长。** 多数 AI 开发工具只管写代码，GStack 从需求到复盘都有入口。金丝雀观察、性能监控、文档更新这些上线后容易忘的事也给了固定 Skill，省得每次自己想着补。

## 和 Superpowers 比

同样是 Claude Code 工作流框架，两者定位不太一样：

- Superpowers 更偏通用开发纪律，强调结构化、TDD、子 Agent 并行，适合各种开发场景
- GStack 更偏创始人视角的完整交付流程，浏览器 QA 能力更强，发版和上线后观察做得更细，角色感更明确

## 什么时候适合用

1. 做 Web 产品，尤其有前端界面的项目
2. 小团队高频迭代，想把精力集中在核心决策上
3. 项目需要真实浏览器验证，不想只靠 AI 说"应该没问题"
4. 想让 AI 不只帮你写代码，而是帮你跑交付流程

## 写在最后

如果你在一个人做 Web 项目，GStack 能帮你把流程跑得更完整，但"AI 团队"这个说法别太当真——它更像是一套让你不容易漏事的检查清单。
