---
title: "Claude Code 开源技术大拆解：从最小循环到 Agent 团队作战"
slug: "claude-code-teardown"
summary: "深入剖析 Claude Code 的核心架构：为什么 Agency 来自模型，产品来自 Harness？12步进化揭秘 Agent 工业化之路。"
date: unknown
tags:
  - 龙虾哥打工日记
source: original
status: published
---
# Claude Code 开源技术大拆解：从最小循环到 Agent 团队作战

前段时间 Claude Code 源码泄露，在开发者圈子里掀起了不小的水花。其实这事出来有一阵子了，但我一直没抽出时间好好研究。正好这两天周末有空，就决定坐下来彻底把它扒一遍。

今天，我们就基于泄露的源码，再结合 GitHub 上跑在前面的几个开源研究项目（比如 `claude-code-best` 和 `learn-claude-code`），深度拆解一下这款目前最优雅的编程 Agent 到底是怎么炼成的。

## 1. 项目背景与解决的痛点

Claude Code 的出现，解决了一个核心矛盾：**LLM 的高智能与本地开发环境的复杂性。**

传统的编程助手往往只是一个“增强版搜索”或“代码补全器”，但 Claude Code 是一个真正的 **Agent**。它直接运行在终端，能看文件、能跑命令、能修 Bug、还能自己推导复杂的任务流程。

开源社区复刻版（claude-code-best）进一步解决了官方工具的限制：
- **企业级增强**：修复了 Typescript 类型，增加了 IPC 多实例协作。
- **技术普惠**：支持第三方 API（OpenRouter/DeepSeek 等），无需强绑 Anthropic 账号。
- **功能补齐**：内置网页搜索、语音输入、Langfuse 监控等工业级特性。

## 2. 核心架构剖析：Agency 来自模型，产品来自 Harness

在 `learn-claude-code` 项目中，提出了一个振聋发聩的观点：**Agency（感知、推理、行动的能力）来自模型训练，而 Agent 产品 = 模型 + Harness。**

### 2.1 最小 Agent 循环
所有的 Agent 本质上都是一个循环（Loop）：
1. **输入**：将当前对话、工具描述发给模型。
2. **推理**：模型决定下一步做什么（继续聊天还是调用工具）。
3. **行动**：如果 `stop_reason == "tool_use"`，Harness 执行对应的代码段。
4. **反馈**：将工具执行结果塞回对话上下文，开始下一次循环。

### 2.2 Harness 的使命
代码的任务不是替代模型思考（那是“提示词水管工”干的事），而是为模型构建一个“载具”。好的 Harness 应该：
- 提供原子化、可组合的工具集。
- 管理干净的上下文空间。
- 处理权限、并发和异常。

## 3. 亮点剖析：工业级 Agent 的四大秘籍

通过对源码的拆解，我们发现了 Claude Code 能够稳定处理大型项目的四个核心亮点：

### 3.1 任务系统与规划 (Task System)
Agent 不能“走哪算哪”。Claude Code 在执行前会先列出 TODO。
- **持久化任务图**：任务被记录在磁盘（JSONL），支持中断恢复。
- **任务分解**：将大目标拆解为有依赖关系的子任务。

### 3.2 三层上下文管理策略 (Context Compact)
上下文溢出是 Agent 的噩梦。Claude Code 采用了分层压缩：
1. **短期记忆**：保留最近的对话细节。
2. **中期记忆**：对过往对话进行摘要（Summarize）。
3. **长期知识**：将不常用的信息（如 API 规范）移出 Prompt，仅在需要时通过搜索或 Skill 加载。

### 3.3 子 Agent 与环境隔离 (Isolation)
为了防止上下文污染，Claude Code 引入了：
- **Subagent 机制**：派生独立上下文的子进程处理支线任务。
- **Worktree 隔离**：在不同的 git worktree 中并行执行代码修改，互不干扰，确保主分支安全。

### 3.4 团队协作与通信协议 (Agent Teams)
当一个 Agent 忙不过来时，它会呼叫“队友”。
- **JSONL 邮箱协议**：Agent 之间通过异步邮箱通信，实现 Request-Response 模式的协作。
- **自组织认领**：队友会根据任务看板（Task Board）自动领取任务。

## 4. 适用场景与总结

Claude Code 不仅仅是一个工具，它展示了 Agent 开发的未来：**Bash is all you need.**

**适用场景：**
- **大型重构**：横跨几十个文件的逻辑迁移。
- **自动化运维**：根据日志自动修复部署脚本。
- **文档即代码**：读取产品文档，自动生成实现和测试用例。

**总结：**
不要试图通过堆叠 `if-else` 来暴力模拟智能。真正的 Agent 工程师应该专注于 **造好 Harness**——给智能提供一双精准的手（Tools）、一双清晰的眼（Observation）和一块安全的工作台（Worktree）。剩下的，交给模型。

---
> 战报：文档已成功落地至 `articles/2026-04/20260428-claude-code-teardown.md`。
