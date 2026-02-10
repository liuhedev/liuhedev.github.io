---
title: "OpenClaw Skills：给 AI 装上技能扩展包"
date: "2026-02-10"
excerpt: "本文全面介绍 OpenClaw Skills 技能扩展系统，包括三级加载机制、门控机制、ClawHub 技能应用商店以及配置覆盖和安全注意事项。"
tags: ["OpenClaw", "Skills", "AI", "插件系统", "ClawHub"]
source: "openclaw"
readingTime: 5
---

# OpenClaw Skills：给 AI 装上"技能扩展包"

## 🔌 什么是 Skills？

想象一下，你有一个超级聪明的 AI 助手，但它只能回答问题、写代码。如果你让它"帮我把这篇文章发到微信公众号"，它会一脸懵逼："公众号是什么？怎么发？"

这时候，你需要给 AI 安装一个"技能包" —— 这就是 **OpenClaw Skills**。

简单来说，Skills 就像 AI 的插件系统，教 AI 使用新工具、调用新 API、执行新任务。安装一个微信公众号发布技能，AI 就能自动发文章；安装一个浏览器自动化技能，AI 就能帮你爬网页、填表单。

## 📦 技能包的智慧：三级加载机制

OpenClaw 采用了聪明的设计，当你调用一个技能时，系统会按照以下优先级查找：

### 1️⃣ 工作区优先（Workspace > Local > Built-in）

```
工作区技能 > 本地技能 > 内置技能
```

- **工作区技能**：你在当前项目中专门定制的技能，覆盖一切
- **本地技能**：你全局安装的通用技能
- **内置技能**：OpenClaw 自带的核心技能

这意味着什么？你可以随时用自定义技能覆盖默认行为，灵活性拉满！

### 2️⃣ 门控机制：依赖检查

不是所有技能都能随便跑。OpenClaw 有严格的门控机制：

- ✅ **依赖检查**：技能声明需要的环境（如 Python、Docker、特定 API）
- ✅ **配置权限控制**：哪些配置项可以覆盖，哪些是只读的
- ✅ **安全边界**：防止技能越权访问系统资源

想象你要安装一个"发送邮件"的技能，系统会先检查：
- 你配置了 SMTP 服务器吗？
- 技能申请的权限你允许吗？
- 配置项是否违反安全策略？

只有全部通过，技能才能正常加载。

## 🛒 ClawHub：技能应用商店

OpenClaw 内置了一个类似 npm、pip 的包管理器 —— **ClawHub**。

```bash
# 搜索技能
openclaw skills search "微信"

# 安装技能
openclaw skills install baoyu-skills

# 更新技能
openclaw skills update

# 列出已安装
openclaw skills list
```

社区贡献的技能都可以在 ClawHub 上找到。想实现什么功能？先去搜搜，说不定别人已经造好轮子了！

## ⚙️ 配置覆盖与安全

### 配置继承规则

配置文件按优先级合并：
```
项目配置 (workspace/.openclaw/config/config.json)
    ↓ 继承
用户配置 (~/.openclaw/config/config.json)
    ↓ 继承
默认配置 (openclaw default)
```

后加载的配置会覆盖前面的，但有个例外：**安全敏感的配置不能被覆盖**。

### 安全注意事项

⚠️ **永远不要盲目运行不明技能**

- 检查技能的来源和作者
- 阅读技能的 `SKILL.md` 说明文档
- 注意技能申请的权限范围
- 在测试环境先跑一遍

⚡ **配置文件权限控制**

- 包含 API Key、密码的配置文件设为只读
- 不要在公共仓库提交敏感配置
- 使用环境变量传递敏感信息

## 🚀 开始你的第一个技能

想要体验 Skills 的魔力？试试这几个常用技能：

1. **浏览器自动化**：`agent-browser` - 让 AI 帮你操作网页
2. **微信公众号**：`baoyu-skills` - 自动发布文章
3. **飞书协作**：`feishu-docx-powerwrite` - 飞书文档管理
4. **代码分析**：`coding-agent-kh0` - 深度代码审查

```bash
openclaw skills install agent-browser
openclaw skills install baoyu-skills
```

安装完成后，下次对话直接告诉 AI："帮我爬取这个网页的数据"或者"把这篇文章发到公众号"，AI 会自动调用对应的技能完成任务。

## 💡 总结

OpenClaw Skills 是一个优雅的技能扩展系统：

- 🎯 **模块化设计**：每个技能独立，互不干扰
- 🔄 **灵活加载**：三级优先级，按需覆盖
- 🔒 **安全第一**：依赖检查、权限控制、配置隔离
- 📦 **生态丰富**：ClawHub 社区贡献

有了 Skills，AI 不再是只会聊天的聊天机器人，而是能干活的智能助手。给它装上合适的技能包，让它成为你的得力搭档！

---

**关于作者**：本文由 OpenClaw AI 助手生成，发布于"刘贺同学"微信公众号和 GitHub 博客。
**相关链接**：
- OpenClaw 官网：https://github.com/openclaw
- ClawHub 技能商店：https://hub.openclaw.dev
**发布时间**：2026-02-10
