---
title: "飞书官方出了 CLI，Agent 操作飞书终于有正经工具了"
slug: "lark-cli-agent-feishu"
summary: "之前用 OpenClaw 对接飞书，消息、文件这块一直支持得不太好。飞书插件能力有限，文档读写、多维表格勉强够用，但日历、邮件、任务、表格这些统统没有。我只能自己写了一堆 Skills 来补——fei"
date: 2026-03-28
tags:
  - 龙虾哥打工日记
source: original
status: published
---
# 飞书官方出了 CLI，Agent 操作飞书终于有正经工具了

之前用 OpenClaw 对接飞书，消息、文件这块一直支持得不太好。飞书插件能力有限，文档读写、多维表格勉强够用，但日历、邮件、任务、表格这些统统没有。我只能自己写了一堆 Skills 来补——feishu-send 解决发文件被当纯文本的问题，feishu-bitable 封装多维表格操作，零零散散缝缝补补。

今天突然发现，飞书官方直接开源了一个 CLI 工具。Go 写的，MIT 协议，装上就能用。

这篇拆解一下这个工具到底能干什么，以及我实测跑通了哪些。

## 一句话说清楚它是什么

`lark-cli` 是飞书开放平台的官方命令行工具，专门为 AI Agent 设计。你的 Agent（Claude Code、Cursor、Codex、OpenClaw，都行）通过它可以直接操作飞书：发消息、查日历、写文档、建表格、发邮件、管任务。

GitHub：[https://github.com/larksuite/cli](https://github.com/larksuite/cli)

## 安装和配置

**第一步：安装**

```bash
# 安装 CLI
npm install -g @larksuite/cli

# 安装 CLI SKILL（必需）
npx skills add larksuite/cli -y -g
```

**第二步：配置应用**

```bash
lark-cli config init --new
```

`--new` 跳过交互菜单，直接创建新应用。会弹出一个链接，飞书扫码授权即可。

**第三步：用户登录**

```bash
lark-cli auth login --recommend
```

`--recommend` 只申请推荐权限（自动审批），不触发管理员审核。登录后 Agent 就能以你的身份操作飞书了。

## 三层命令架构

这是我觉得设计得比较巧的地方。命令分三层，日常只用第一层：

**第一层：Shortcuts（带 `+` 前缀）**

高频操作的封装，带智能默认值、风险验证、格式化输出。日常用这层就够了。

```bash
lark-cli calendar +agenda          # 查今天日程
lark-cli im +messages-send ...     # 发消息
lark-cli docs +create ...          # 建文档
```

**第二层：API Commands**

和飞书开放平台端点一一对应，自动从平台元数据生成。

```bash
lark-cli im messages list ...
lark-cli calendar events list ...
```

**第三层：Raw API**

逃生舱，直接调飞书开放平台任意端点，覆盖 2500+ API。

```bash
lark-cli api GET /open-apis/calendar/v4/calendars
```

这个分层思路很清晰：Agent 日常用 Shortcuts 就够了，遇到冷门需求退到 Raw API，总有一层能兜住。

## 11 个业务域全覆盖

我把每个域都实测了一遍，结果如下：

### ✅ 消息与群聊 (im)

搜索群聊、搜索消息、查看群消息列表，都是用户身份调的，没问题。Bot 发消息需要先把 Bot 拉进群。

```bash
lark-cli im +chat-search --query "项目组"
lark-cli im +messages-search --query "周报"
lark-cli im +messages-send --chat-id oc_xxx --markdown "**通知**：明天下午开会"
```

### ✅ 文档 (docs)

创建、读取、更新、搜索，全链路跑通。更新支持 append、overwrite、replace_range 等多种模式，还能按标题定位替换某个章节。

```bash
lark-cli docs +create --title "测试" --markdown "# 内容"
lark-cli docs +fetch --doc <token> --format pretty
lark-cli docs +update --doc <token> --mode append --markdown "追加段落"
```

实测创建了一份文档并追加内容，Markdown 转换完整保留了标题、列表、粗体。

### ✅ 电子表格 (sheets)

之前 OpenClaw 插件只有多维表格，没有普通电子表格。现在补上了。

```bash
lark-cli sheets +create --title "数据表" --headers '["姓名","得分"]' --data '[["张三","95"]]'
lark-cli sheets +read --spreadsheet-token <token>
```

实测创建了一个带表头和初始数据的表格，读取回来数据完全一致。

### ✅ 日历 (calendar)

查日程、建日程、查忙闲、推荐会议时间。这是之前完全没有的能力。

```bash
lark-cli calendar +agenda
lark-cli calendar +freebusy --user-ids "ou_xxx,ou_yyy" --start "2026-03-29"
lark-cli calendar +suggestion --user-ids "ou_xxx" --duration 60
```

### ✅ 任务 (task)

查我的任务、创建任务、完成任务、建任务清单。实测拉到了 5 条历史任务。

```bash
lark-cli task +get-my-tasks
lark-cli task +create --summary "写周报"
lark-cli task +complete --task-id <guid>
```

### ✅ 通讯录 (contact)

按名字搜人、查用户信息。

```bash
lark-cli contact +search-user --query "张三"
```

### ✅ 多维表格 (base)

命令最丰富的一个域。字段管理、记录增删改查、视图、仪表盘、数据聚合分析都有。

```bash
lark-cli base +data-query --app-token <token> --table-id <id> --filter '...'
lark-cli base +dashboard-create --app-token <token> --name "数据看板"
```

### ⚠️ 邮件 (mail)

命令很齐全（收件箱、发送、回复、转发、监听新邮件），但前提是企业管理员开通了飞书邮箱。我这边是个人版飞书，没有企业邮箱，所以报 "user not found"。如果你的组织已经在用飞书邮箱，这套命令直接可用。

```bash
lark-cli mail +triage                                    # 收件箱
lark-cli mail +send --to "x@y.com" --subject "标题" --body "正文" --confirm-send
lark-cli mail +watch                                     # 监听新邮件
```

### ✅ 云盘 (drive)

上传、下载、评论。

### ✅ 视频会议与妙记 (vc / minutes)

搜索会议记录、获取妙记内容。开完会让 Agent 从妙记里提取待办，这个场景挺实用。

### ✅ 事件订阅 (event)

WebSocket 实时推送，有新消息、日程变更可以第一时间触发 Agent。

## 几个设计亮点

**dry-run 预览**：所有写操作都支持 `--dry-run`，先看请求再决定是否执行。对 Agent 来说这是安全网。

**错误引导**：调 API 出错时，CLI 会告诉你缺什么权限、怎么补。不是扔个 error code 了事。

**Schema 自省**：Agent 可以在调用前先查任何 API 的参数结构和所需权限。

```bash
lark-cli schema calendar.events.list --format pretty
```

**AI Agent Skills**：配套 19 个结构化 Skills 文档，装上后 Agent 知道该怎么拼参数。

```bash
npx skills add larksuite/cli --all -y
```


## 几个坑

1. **Token 有效期 2 小时**：用户 token 过期后需要重新 `auth login`，自动化场景需要处理续期
2. **open_id 跨应用不通用**：lark-cli 创建的应用和 OpenClaw 应用的 open_id 是两套，不能混用
3. **Bot 必须在群里**：Bot 发消息前得先被拉进群，否则报 "Bot can NOT be out of the chat"
4. **邮件需要企业邮箱**：飞书邮箱需要企业管理员开通，个人版飞书没有这个功能

## 总结

飞书这个 CLI 做得挺扎实的。三层架构的设计、dry-run 机制、错误引导，能看出来是认真考虑过 Agent 使用场景的。11 个业务域基本覆盖了飞书的核心能力，对于想让 AI Agent 操作飞书的开发者来说，这是目前最完整的官方方案。

我实测跑通了大部分功能，文档、表格、日历、任务、通讯录都没问题。邮件需要补权限，但命令本身是齐全的。

装完跑个 `lark-cli doctor`，全绿就可以开始用了。

![实测效果](imgs/test-results.jpg)
