# 刘贺同学技术博客

全栈工程师的个人技术博客，采用 AI 大厂风格设计，支持多端内容同步（飞书、微信公众号、GitHub）。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS 3.4
- **字体**: Arial + 苹方 / 微软雅黑 + 系统等宽字体
- **图标**: Lucide Icons
- **Markdown**: react-markdown + rehype-highlight
- **主题**: next-themes (深色模式)
- **部署**: GitHub Pages（静态导出）

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 http://localhost:3000 查看效果。

## 添加新文章

1. 在 `content/posts/` 目录下创建 Markdown 文件（命名格式：`slug.md`）
2. 添加 Front Matter 元数据：

```markdown
---
title: "文章标题"
date: "2026-01-27"
excerpt: "文章摘要，用于首页卡片展示"
tags: ["标签1", "标签2"]
source: "wechat"  # feishu | wechat | github
readingTime: 8
# 历史稿使用 writtenAt: "2026-01-20"，避免把导入日当发布日期
# listed: false 仅用于保留直链但不进入首页、索引和 sitemap 的归档稿
---

# 文章正文

Markdown 内容...
```

3. 保存后自动生成路由：`/posts/[slug]`
4. 运行 `npm run build && npm run verify:index`，验证文章页、公开索引、排序和归档规则

## 公开文章索引

构建会从文章 Front Matter 生成 `/articles.json`，供个人网站等公开页面读取。索引按日期倒序排列；日期相同时按 slug 稳定排序。

```json
{
  "version": 1,
  "articles": [
    {
      "title": "文章标题",
      "url": "https://liuhedev.github.io/posts/example",
      "date": "2026-01-27",
      "dateType": "published",
      "excerpt": "文章简介"
    }
  ]
}
```

常规文章的 `date` 标记为 `published`。历史导入稿若提供 `writtenAt`，索引优先使用该值并标记为 `written`，避免把导入日期误作公众号首发日期。索引不包含正文或非公开字段。

## 项目结构

```
├── app/
│   ├── layout.tsx           # 根布局
│   ├── page.tsx              # 首页
│   ├── posts/[slug]/         # 文章详情页
│   └── globals.css           # 全局样式
├── components/
│   ├── navbar.tsx            # 导航栏
│   ├── footer.tsx            # 页脚
│   ├── theme-toggle.tsx      # 主题切换
│   └── markdown-renderer.tsx # Markdown 渲染器
├── content/
│   └── posts/                # 文章内容（Markdown）
├── lib/
│   └── posts.ts              # 文章数据处理
├── types/
│   └── post.ts               # 类型定义
├── design-system/            # 设计系统文档
└── DESIGN.md                 # 完整设计文档
```

## 设计特点

- ✨ **AI 大厂风格**: 参考 Vercel、Linear 的瑞士现代主义设计
- 🎨 **极简配色**: 黑白灰 + 蓝色强调
- 🌓 **深色模式**: 完整支持，自动检测系统偏好
- 📱 **响应式**: 移动端、平板、桌面完美适配
- ♿ **可访问性**: 符合 WCAG AA 标准
- ⚡ **性能优化**: SSR + 图片优化 + 代码分割

## 核心功能

- [x] 首页（Hero + 内容时间线）
- [x] 文章详情页（Markdown 渲染）
- [x] 深色模式切换
- [x] 多端来源标识（飞书/公众号/GitHub）
- [x] 响应式导航栏
- [ ] 文章搜索
- [ ] 标签筛选
- [ ] RSS 订阅
- [ ] 阅读统计
- [ ] 内容 API 同步

## 多端同步

目前为静态博客，文章手动添加。后续计划接入：

1. **飞书多维表格 API** - 同步飞书文档
2. **微信公众号 API** - 同步公众号文章
3. **GitHub API** - 同步 GitHub 项目和 README

## 部署

### Vercel（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 自动部署完成

### 其他平台

```bash
npm run build
npm start
```

## 自定义配置

需要修改以下内容：

```tsx
// components/navbar.tsx + footer.tsx
href="https://github.com/liuhedev"  // 改为真实 GitHub 地址
href="mailto:liuhe@example.com"    // 改为真实邮箱

// app/layout.tsx
title: '刘贺同学 | 全栈工程师'  // 修改标题
description: '...'               // 修改描述
```

## 许可证

MIT License

---

**联系方式**
- GitHub: [@liuhedev](https://github.com/liuhedev)
- 微信公众号: 刘贺同学
