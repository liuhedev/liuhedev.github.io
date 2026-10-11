# 刘贺同学技术博客

基于 Next.js 的静态技术博客，公开地址：[liuhedev.github.io](https://liuhedev.github.io)。

## 内容目录

- `content/posts/`：Markdown 文章，一篇文章一个文件；文件名即永久链接中的 slug。
- `public/images/`：文章实际引用并随 GitHub Pages 发布的图片，Markdown 中使用 `/images/...`。
- `docs/specs/DESIGN.md`：视觉与交互设计参考；实际实现以源码为准。

公开文章索引由 Front Matter 自动生成到 `/articles.json`。设置 `listed: false` 可保留文章直链，但不进入首页、索引和 sitemap。

## 新增或修改文章

在 `content/posts/` 新建或编辑 Markdown，例如：

```markdown
---
title: "文章标题"
date: 2026-01-27
summary: "文章简介"
tags:
  - AI
source: original
---

# 文章标题

正文内容。
```

历史稿使用 `writtenAt: 2026-01-20` 表示写作日期，避免将导入日期当作发布日期。已发布文章不要随意修改文件名，以免改变永久链接。

## 本地预览与验证

```bash
npm ci
npm run dev
```

本地开发地址为 <http://localhost:3000>。提交前运行：

```bash
npm run build
npm run verify:index
```

构建产物位于 `out/`；验证脚本会检查文章索引、元数据、图片引用、锚点和隐藏文章规则。

## 部署

推送到 `main` 后，GitHub Actions 工作流 `.github/workflows/deploy.yml` 会执行构建与验证，并将 `out/` 部署到 GitHub Pages。
