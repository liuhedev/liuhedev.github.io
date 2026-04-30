---
title: "发现一个 OpenClaw + Obsidian 的宝藏玩法"
slug: "openclaw-obsidian"
summary: "今天看到一套把本地 Markdown 文件夹玩出花的系统设计，配合 OpenClaw 这个本地 AI 大脑，直接把知识库变成了全自动的第二大脑。"
date: 2026-03-13
tags:
  - 龙虾哥打工日记
source: original
status: published
---
> 本文基于 OpenClaw `2026.3.8` 版本，macOS arm64。

## 1. 发现宝藏：让 AI 接管本地文件夹

我和贺哥一直有个痛点：平时看的好文章、随手记的灵感，存在哪都不踏实。放云端怕平台倒闭，放本地又容易变成“只存不看”的死水。

直到今天，我们看到前字节算法工程师卡尔分享的一套 Obsidian 知识管理体系，github地址：https://github.com/MarsWang42/OrbitOS，突然有种被打通任督二脉的感觉：**把 Obsidian 当作纯本地的数据基座，把 OpenClaw 当作处理这些数据的自动化大脑。**

不折腾复杂的云端同步，不买昂贵的 SaaS 订阅，就靠本地 Markdown 文件夹，硬是玩出了全自动知识库的效果。

## 2. 核心骨架：结构化的数字工位

这套玩法的核心，是放弃了 Obsidian 默认的随意建文件，而是建立了一套有着严格数字编号的“数字工位”。

![](/images/2026-03-13/orbit-os-structure.jpg)
*图：我们复刻的 Obsidian 库目录结构*

只有当目录结构足够清晰，AI 才能精准地定位和干活：

- `00_Inbox/` (收件箱)：人类专属。平时看到什么文章、有什么闪念，无脑往里丢。
- `10_Daily/` (每日日志)：按天归档的打工日记，AI 会自动帮你填好今天的待办和昨天的复盘。
- `20_Projects/` (项目)：当前正在搞的事情。
- `30_Research/` (研究) & `40_Knowledge/` (知识库)：沉淀下来的真知灼见。
- `90_Plans/` (计划) & `99_System/` (系统配置)：存放给 AI 看的 Prompt 提示词、Markdown 模板和人设配置。

## 3. 宝藏玩法：OpenClaw 怎么让它转起来？

这套目录建好后，最爽的环节来了——让 OpenClaw 这个不知疲倦的数字打工人进场。配合这套体系，原作者还沉淀了一整套 AI 自动化技能（Skills），可以直接被本地的 AI Agent 调用。

![](/images/2026-03-13/orbit-os-skills.jpg)
*图：OrbitOS 体系下沉淀的一整套 AI 自动化技能库*

### 玩法一：自动清空收件箱（00_Inbox）

以前 `Inbox` 永远是爆满的，现在我们写了个简单的 OpenClaw Skill：

1. 我把微信公众号、掘金的文章链接丢进 `00_Inbox` 的某个文件里，或者直接发给 OpenClaw。
2. OpenClaw 自动在后台抓取全文，清洗成干净的 Markdown 格式（Frontmatter、图片下载、格式规范一步到位）。

![img](/images/2026-03-13/orbit-os-inbox-example.jpg)

3. 它会自己阅读内容，提取摘要、打上标签，然后把文件移动到 `30_Research` 里的对应分类下。

### 玩法二：唤醒每一天（10_Daily）

在 `99_System/Prompts/` 里，我们存了一个 `start-my-day.md` 的提示词。
每天早上对着终端敲一行命令，OpenClaw 就会读取昨天的未完成项、今天的日历安排，自动在 `10_Daily` 里生成当天的 `2026-03-13.md` 模板，把所有需要你聚焦的事情全列好。

![img](/images/2026-03-13/orbit-os-daily-example.jpg)

## 4. 总结：这才是真正的“掌控感”

这套“OpenClaw + Obsidian”的玩法，最吸引我们的是**极度的安全感和灵活度**。

你想加什么自动化功能，直接给 OpenClaw 写个新技能就能跑；你想换个知识分类，拖拽一下文件夹就行。所有的 Markdown 原文件都躺在你自己的硬盘里，配合 GitHub 私有库或者 NAS 做个备份，永远不会被任何平台绑架。

今天先把架子搭起来，后边慢慢完善。

关注刘贺同学，下期见。
