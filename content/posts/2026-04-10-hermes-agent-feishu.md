---
title: "Hermes Agent 接入飞书的踩坑记录"
slug: "hermes-agent-feishu"
summary: "拆解 Hermes Agent 源码时，解决飞书通道配置被隐藏的踩坑记录与实操指南。"
date: 2026-04-10
tags:
  - 龙虾哥打工日记
source: original
status: published
---
# Hermes Agent 接入飞书的踩坑记录

拆解 Hermes Agent 源码时，发生了一个飞书集成的小插曲。

## 1. 架构图与现实的冲突

OpenClaw 拆解出的架构图里，Hermes 的网关层支持飞书通道。但我照着官方文档实操时，配置界面里却根本没有飞书。

![Hermes Agent 飞书原文架构图](/images/2026-04-10/hermes-feishu-original-board.jpg)

图里有，装出来却没有。我直接问 OpenClaw：“你画的图里有飞书这个通道，我装的时候没有，你来帮我配置下。”

## 2. 深入源码，被隐藏的可选依赖

OpenClaw 没去搜网上的水文教程，直接去后台拉下源码 grep 了一把，立马破案了。

核心逻辑在 `tools/send_message_tool.py` 里。官方为了控制包体积，把飞书的底层 SDK（`lark-oapi`）塞进了可选依赖（Optional Dependency）。用普通的 `pip install` 根本装不上这个库。只要代码检测不到依赖，配置向导就会直接把飞书选项“抹除”。

顺便一提，查 GitHub 的 Issue #4932 发现，官方的 `uv.lock` 文件甚至还漏打包了这个依赖，导致很多人用包管理器默认安装时直接踩坑。

## 3. 强行激活，Agent 自动化配置流

找到病因后，我直接让 OpenClaw 接管了剩下的配置工作。

下面是它在后台替我执行的避坑操作。打算接飞书的朋友，可以直接抄作业。

### 步骤一，指定扩展包安装

普通安装行不通，必须用 `uv` 强行注入扩展包。OpenClaw 在源码目录下跑了这两行：

```bash
# 激活虚拟环境并安装 feishu 依赖
uv pip install -e '.[feishu]'

# 关键补充，Lark SDK 的 WebSocket 底层在某些环境下会报缺少 socks 库的错
uv pip install python-socks
```

### 步骤二，手写配置，绕开向导

既然 `hermes setup` 靠不住，OpenClaw 索性绕过了向导，直接去核心配置目录 `~/.hermes/.env` 里手写了机器人凭证：

```env
FEISHU_APP_ID=cli_xxxxxx
FEISHU_APP_SECRET=xxxxxx
FEISHU_CONNECTION_MODE=websocket
FEISHU_DOMAIN=feishu

# 致命坑点，必须开。否则遇到不在白名单里的人，机器人会直接静默拦截
FEISHU_ALLOW_ALL_USERS=true
```

![Hermes Agent 飞书成功对线实测截图](/images/2026-04-10/hermes-agent-ping-pong-feishu-2.jpg)

## 4. 结语

回顾整个过程，这次问题本身并不复杂，真正麻烦的是坑藏得比较深。

从源码定位到配置落地，我负责判断方向和校验结果，执行细节交给 OpenClaw 完成。对我来说，AI 更大的价值不是替代开发，而是把排查、验证和执行这些零散动作更高效地串起来。

技术迭代越来越快，开发工程师要适应的，已经不只是工具本身，而是学习方式和解决问题方式的变化。

