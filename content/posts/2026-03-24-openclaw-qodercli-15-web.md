---
title: "我用 OpenClaw + 多个 qodercli，15 分钟搭了一个 Web 应用"
slug: "openclaw-qodercli-15-web"
summary: "之前看了 Elvis 在 X 上发的一条帖子，讲的是用 OpenClaw + Codex 这类 CLI 工具完成需求开发。 最近我正好在用 Qoder，就想试试这套逻辑能不能迁到 qodercli 上"
date: 2026-03-24
tags:
  - 龙虾哥打工日记
source: original
status: published
---
# 我用 OpenClaw + 多个 qodercli，15 分钟搭了一个 Web 应用

之前看了 Elvis 在 X 上发的一条帖子，讲的是用 OpenClaw + Codex 这类 CLI 工具完成需求开发。

最近我正好在用 Qoder，就想试试这套逻辑能不能迁到 qodercli 上。

于是我在飞书里给 OpenClaw 发了一句话：

> “做个实验吧，用 OpenClaw + tmux + 多个 qodercli，开发一个教孩子学拼音的 Web 应用，要求有前后端。”

后面的事基本都由它接过去了：先拆任务、写 Prompt、起项目骨架，再通过 tmux 拉起多个 qodercli 并行执行。整个过程里，我没有自己写代码。

## OpenClaw 是怎么编排的

OpenClaw 没有让一个 Agent 从头写到尾，而是先拆任务，再把执行分发到不同的 qodercli。

核心命令大概就是下面这几步。

先准备 4 份 Prompt：

```bash
prompts/init.md
prompts/design.md
prompts/logic.md
prompts/backend.md
```

第一步，先起初始化 Agent，把项目骨架搭起来：

```bash
cat prompts/init.md | qodercli --yolo
```

这一步主要做 3 件事：创建 Next.js 项目、安装依赖、初始化 Prisma + SQLite。

骨架准备好之后，再通过 tmux 拉起 3 个并行窗口，同时跑前端、逻辑和后端：

```bash
tmux new-session -d -s pinyin-app -c ~/projects/pinyin-app
tmux split-window -t pinyin-app -h -c ~/projects/pinyin-app
tmux split-window -t pinyin-app -v -c ~/projects/pinyin-app
tmux select-layout -t pinyin-app tiled

tmux send-keys -t pinyin-app:0.0 'cat prompts/design.md | qodercli -p - --yolo' Enter
tmux send-keys -t pinyin-app:0.1 'cat prompts/logic.md | qodercli -p - --yolo' Enter
tmux send-keys -t pinyin-app:0.2 'cat prompts/backend.md | qodercli -p - --yolo' Enter
```

![](assets/OpenClaw-AgentCLI/img_v3_02103_24c64625-e567-4b31-b42a-37d861e0cfdg.jpg)
这 3 个 qodercli 分别负责：

* 前端页面和组件
* 拼音数据、练习生成、学习进度这类逻辑
* Prisma、数据库迁移和 API 接口

Agent 跑着的时候，OpenClaw 每 10 分钟自动巡检一次，抓取每个窗格的输出判断状态：还在跑、已完成、还是出错了。

```bash
for p in 0 1 2; do
  echo "=== Pane $p ==="
  tmux capture-pane -t pinyin-app -p | tail -10
done
```

实际耗时：Logic Agent 约 2 分钟、Backend Agent 约 8 分钟、Design Agent 最慢约 15 分钟。

全部完成后，统一验收：

```bash
npm run build
```

整套编排的关键不复杂：**先把职责拆开，再用 tmux 把多个 qodercli 并行拉起来。**

## 15 分钟后交付了什么

15 分钟后，OpenClaw 给我交付了一个能跑的完整应用：

* 5 个页面
* 7 个后端接口
* 24 个源文件
* 2030 行代码

最后它还跑了 `npm run build` 做验收，确认整个项目可以正常构建。

![首页](images/pinyin-home.png)

![个人中心](images/pinyin-profile.png)

## 这次实验说明了什么

这次实验对我来说，重点不是“AI 会不会写代码”，而是另一件事：

**当任务边界切得够清楚，多个 CLI Agent 已经可以像一个小型开发团队一样并行协作。**

人在这里面的角色，也会更偏向给目标、做判断和验收结果，而不是亲自把每一行代码都写出来。

至少这次用 OpenClaw + tmux + 多个 qodercli 跑下来，这条路是能跑通的。
