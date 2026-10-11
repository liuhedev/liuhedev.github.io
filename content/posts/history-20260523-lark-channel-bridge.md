---
title: 把 Claude Code 装进飞书：lark-channel-bridge
date: '2026-10-11'
excerpt: 把 Claude Code 装进飞书：lark-channel-bridge
tags:
- coding-agent
- claude-code
- lark
source: notebook
readingTime: 4
writtenAt: '2026-05-23'
---

# 把 Claude Code 装进飞书：lark-channel-bridge

晚上发现一个叫 `lark-channel-bridge` 的小工具，能让飞书直接连上本机的 Claude Code CLI。试了下还不错，记录一下。

![飞书侧实际对话](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260523-lark-channel-bridge/831b7987b9e48a442efa9c10048c8ac4f260f718a8fa9f34b4814b00dfdee277.png)

## 使用

```bash
npm i -g lark-channel-bridge
lark-channel-bridge run
```

第一次跑会输出个二维码，飞书扫一下，自动建一个飞书应用，凭据落到 `~/.lark-channel/`。完事在飞书里发消息就行：私聊不用 @，群里 @ bot。

想后台跑：`lark-channel-bridge start`（macOS launchd / Linux systemd / Windows Task Scheduler 都做了）。

## 主要功能

- **流式卡片**：claude 边想边贴，工具调用也实时显示在同一张卡片上
- **每个 chat 独立 session**：私聊和不同的群之间互不串扰，话题群里每个话题也独立
- **抢占 + 批处理**：连发新消息会打断旧任务；快速连发会合并成一次
- **多工作空间**：`/ws save / use` 在不同项目目录之间切换
- **图片、文件直接发**：bridge 下载到本地，把路径喂给 claude
- **斜杠命令**：`/status` `/new` `/cd` `/stop` `/doctor` 几个常用；其他 `/xxx` 透传给 claude
- **访问控制**：白名单、管理员、群限制都可以在 `/config` 里配

## 原理

![简版架构图](https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/images/articles/20260523-lark-channel-bridge/2f1e4cf74c98ac5f20e47e91b6492627e89c53e5eda64aea212d1e92910aea5f.png)

简单讲：

1. **飞书云 → Bridge**：通过 `@larksuiteoapi/node-sdk` 的 WebSocket 长连接把消息推到本地的 bridge 进程
2. **Bridge → Claude**：`spawn("claude", ["-p", prompt, "--output-format", "stream-json", "--resume", sid, ...])` 拉起一个一次性 claude 子进程
3. **Claude → Bridge**：claude 通过 stdout 一行行吐 JSON，每行就是一段文字或一个工具调用
4. **Bridge → 飞书云**：bridge 按行读 JSONL，翻译成飞书卡片的 patch 更新
5. **一轮 turn 跑完**：claude 进程自然退出，下次新消息进来再 spawn 新的

几个值得说的点：

- **bridge ↔ claude 之间不走网络**，就是 OS 父子进程 + 匿名管道（pipe）。"流式"完全靠 claude CLI 自带的 `stream-json` 输出模式，bridge 只是按 `\n` 切一下、`JSON.parse` 一下、再翻译成卡片更新——**没有任何自定义协议**
- **会话历史 bridge 不存**。`sessionId` 由 claude 自己生成（首次 spawn 时从 `{type:"system", subtype:"init"}` 事件里抠出来），历史落在 claude 自己的 `~/.claude/projects/.../<sid>.jsonl`。bridge 只维护一个 `chatId → sessionId` 的薄字典
- **同时存活的 claude 进程数 ≈ 同时在跑 turn 的 chat 数**。每个 turn 跑完进程自然退出，OS 回收 PID，不会泄漏
- bridge 自己只有 3-5k 行 TypeScript，把重活全甩给 claude CLI 自身——这就是它"轻"的真正原因

## 总结

整体用下来还不错，做这个工具的拆解，飞书聊天中间断了一次，用 OpenClaw 帮忙救了一下。自从 OpenClaw 不让用 Claude Code 订阅之后，这种通过 WebSocket 桥接 IM 的方案也值得借鉴。

---

GitHub: <https://github.com/zarazhangrui/feishu-claude-code-bridge>

---

历史文章导入 · 历史文章编号：20260523-lark-channel-bridge · 写作日期 2026-05-23
