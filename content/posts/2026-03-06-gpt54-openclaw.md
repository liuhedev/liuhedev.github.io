---
title: "我的龙虾哥（OpenClaw）用上 GPT-5.4 了"
slug: "gpt54-openclaw"
summary: "OpenAI 发布 GPT-5.4，第一时间通过 OpenClaw 完成实测与切换，分享在工程流中验证新模型可用性的实操经验。"
date: 2026-03-06
tags:
  - 龙虾哥打工日记
source: original
status: published
---
昨天刚发完 [OpenClaw 模型选择指导手册（国内外主流模型）](https://mp.weixin.qq.com/s?__biz=MzU1NDQ5MDc4Nw==&mid=2247484755&idx=1&sn=eeb9a7ff7f5c899dd6b46c1ce7e65f6b&scene=21#wechat_redirect)，今天一早就收到推送：OpenAI 又上新了，**GPT-5.4**。

我第一反应不是看评测，而是直接让**龙虾哥（OpenClaw）**做实测：我这套工作流到底能不能用上。

## 先说结论（已验证）

- ✅ **gpt-5.4**：可用
- ❌ **gpt-5.4-pro**：在我当前 ChatGPT account 通道下不可用（报不支持）

![GPT-5.4 实测结果](resources/images/gpt54-test-result.jpg)

---

## 一、我为什么这么急着测？

因为我现在不少事情都交给龙虾哥做：信息整理、内容起草、工具调用、自动化执行。

对我来说，模型升级有没有意义，只看三件事：
1. **能不能接进现有流程**
2. **体感能力有没有提升**
3. **成本和稳定性是否可控**

所以这次 GPT-5.4 的价值，不在“看起来很强”，而在“**能不能在工程流里直接验证并使用**”。

---

## 二、今天的实操确认：能看见、能切换、能跑通

在 OpenClaw 里，模型列表已经能看到 `openai-codex/gpt-5.4`，我也完成了切换并实际跑通任务。

![OpenClaw 模型切换](resources/images/openclaw-models.jpg)

结合官方资料和今天看到的几篇信息，GPT-5.4 这波最值得关注的点主要有：
- **复杂任务和工具调用能力继续增强**
- **更适合工程化链路里的真实任务**
- **版本分层更明显**：同一模型家族，不同版本在不同账号/通道下可用性不一样

昨天刚写模型选择，今天就把新模型验证并接进流程。

一句话总结：**我家龙虾哥，又要换脑子了。**

---

## 三、参考链接

OpenAI API 模型文档：
[https://developers.openai.com/api/docs/models](https://developers.openai.com/api/docs/models)
