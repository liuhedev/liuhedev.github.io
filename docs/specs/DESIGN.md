# 刘贺同学技术博客 - 设计方案

## 设计定位

**AI 大厂风格的全栈工程师技术博客**

- 现代极简的瑞士现代主义风格
- 多端内容统一时间线展示
- 突出技术专业性和代码美学

---

## 核心设计系统

### 视觉风格：Swiss Modernism 2.0

- **特点**：网格系统、模块化、数学化间距、极简排版
- **优势**：专业、理性、易读、性能优秀
- **参考**：Vercel、Linear、Stripe 文档站

### 色彩方案

```css
/* 主色调 - 极简黑白灰 + 蓝色强调 */
--primary: #18181B;      /* zinc-900 主色 */
--secondary: #3F3F46;    /* zinc-700 次要文字 */
--accent: #2563EB;       /* blue-600 CTA/链接 */
--background: #FAFAFA;   /* zinc-50 背景 */
--text: #09090B;         /* zinc-950 正文 */
--border: #E4E4E7;       /* zinc-200 边框 */
```

**Dark Mode:**
```css
--primary: #FAFAFA;
--secondary: #A1A1AA;
--accent: #3B82F6;
--background: #09090B;
--text: #FAFAFA;
--border: #27272A;
```

### 字体系统

- **标题**: Space Grotesk (700/600) - 几何、科技感
- **正文**: DM Sans (400/500) - 清晰、易读
- **代码**: Fira Code / JetBrains Mono

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

### 间距系统（数学化比例）

```css
/* Tailwind 间距 + 黄金比例 */
- 超小间距: 0.5rem (8px)
- 小间距: 1rem (16px)
- 中间距: 1.5rem (24px)
- 大间距: 2.5rem (40px)
- 超大间距: 4rem (64px)
- Section 间距: 6rem (96px)
```

---

## 页面布局结构

### 1. 全局导航栏（Floating Navbar）

```
┌─────────────────────────────────────────────┐
│  Logo          文章  项目  关于    🌙 搜索  │
└─────────────────────────────────────────────┘
```

**设计要点**：
- 悬浮设计（top-4 left-4 right-4）
- 半透明玻璃态背景：`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg`
- 固定定位：`fixed z-50`
- 边框：`border border-zinc-200 dark:border-zinc-800`
- 圆角：`rounded-2xl`

**导航项目**：
- 首页 / 文章 / 项目 / 关于
- 搜索框（右侧）
- 主题切换（Dark/Light）
- GitHub / 公众号链接（图标）

### 2. Hero Section（首屏）

```
┌─────────────────────────────────────────────┐
│                                             │
│        👤                                    │
│     刘贺同学                                 │
│   全栈工程师 · AI 探索者                     │
│                                             │
│   [GitHub]  [微信公众号]  [邮箱]            │
│                                             │
│   ▼ 最新内容                                │
└─────────────────────────────────────────────┘
```

**设计要点**：
- 极简设计，聚焦个人信息
- 头像：圆形 `w-24 h-24 rounded-full`
- 标题：`text-5xl font-bold` Space Grotesk
- 副标题：`text-xl text-zinc-600` DM Sans
- 社交链接：SVG 图标 + hover 动画
- 背景：可选渐变网格效果

### 3. 多端内容时间线（核心区域）

```
┌─────────────────────────────────────────────┐
│  [全部]  [技术文章]  [开源项目]  [思考随笔]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ 📝 从零实现分布式任务调度系统          │  │
│  │ 详细介绍如何使用 Redis + Spring...    │  │
│  │                                        │  │
│  │ 🏷️ 分布式 · Redis · Spring Boot       │  │
│  │ 📅 2 天前 · ☁️ 飞书                    │  │
│  │ ⏱️ 8 分钟阅读                          │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ 💻 开源项目：AI 代码审查助手           │  │
│  │ 基于 GPT-4 的代码质量分析工具...       │  │
│  │                                        │  │
│  │ 🔧 Python · TypeScript · Docker       │  │
│  │ 📅 5 天前 · 🐙 GitHub                 │  │
│  │ ⭐ 128 stars · 🍴 23 forks            │  │
│  └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

**卡片设计要点**：
- 统一卡片样式：`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6`
- Hover 效果：`hover:shadow-lg hover:border-blue-500 transition-all duration-200`
- 来源标识：
  - 飞书：云朵图标 + 淡蓝色标签
  - 公众号：微信图标 + 绿色标签
  - GitHub：章鱼猫图标 + 黑色标签
- 标签样式：`bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-full text-sm`
- 时间信息：相对时间（2 天前）+ 阅读时长

**筛选标签**：
- 全部 / 技术文章 / 开源项目 / 思考随笔
- Pill 形状：`rounded-full`
- 选中态：`bg-zinc-900 dark:bg-white text-white dark:text-zinc-900`
- 未选中：`bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800`

### 4. 侧边栏（可选，桌面端）

```
┌──────────────────┐
│  热门标签         │
│  · 分布式         │
│  · React          │
│  · AI/ML          │
│  · 系统设计       │
│                  │
│  统计信息         │
│  📝 45 篇文章     │
│  💻 12 个项目     │
│  👁️ 10k+ 阅读   │
└──────────────────┘
```

### 5. Footer

```
┌─────────────────────────────────────────────┐
│  刘贺同学 © 2026                             │
│  全栈工程师 · 微信公众号"刘贺同学"            │
│                                             │
│  [GitHub]  [邮箱]  [RSS]                     │
│                                             │
│  使用 Next.js + Tailwind CSS 构建            │
└─────────────────────────────────────────────┘
```

---

## 交互设计

### 动画原则（遵循 UX 最佳实践）

1. **过渡时长**：150-300ms（快速响应）
2. **缓动函数**：`ease-in-out` 或 `cubic-bezier(0.4, 0, 0.2, 1)`
3. **尊重用户偏好**：检测 `prefers-reduced-motion`
4. **只动画 transform 和 opacity**（性能优化）

```css
/* 推荐动画 */
.card {
  transition: transform 200ms ease-in-out,
              box-shadow 200ms ease-in-out,
              border-color 200ms ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
}

/* 避免：scale 动画（会导致布局偏移）*/
```

### 加载状态

- **骨架屏**：`animate-pulse` 渐变效果
- **内容加载**：使用 Intersection Observer 懒加载
- **图片优化**：WebP + srcset + lazy loading

### 深色模式切换

- 平滑过渡：`transition-colors duration-300`
- 记忆用户偏好：localStorage
- 尊重系统偏好：`prefers-color-scheme`

---

## 技术实现建议

### 推荐技术栈

```
Next.js 14 (App Router)
├── UI: Tailwind CSS 3.4
├── 组件: Radix UI / Headless UI
├── 图标: Lucide Icons（禁止使用 emoji 作为图标）
├── 字体: next/font
├── 部署: Vercel
└── CMS:
    ├── 飞书多维表格 API
    ├── 微信公众号 API
    └── GitHub API
```

### 关键功能模块

1. **内容聚合器**
   - 定时任务拉取各平台内容
   - 统一数据格式（标题、摘要、时间、来源、标签）
   - 缓存策略（Redis / Vercel KV）

2. **搜索功能**
   - Algolia / Fuse.js 全文搜索
   - 搜索高亮

3. **RSS 订阅**
   - 生成 RSS feed
   - 支持按标签订阅

4. **阅读统计**
   - Vercel Analytics
   - 阅读时长估算

---

## 响应式设计

### 断点系统

```css
/* Tailwind 默认断点 */
- sm: 640px   (小平板)
- md: 768px   (平板)
- lg: 1024px  (小桌面)
- xl: 1280px  (桌面)
- 2xl: 1536px (大屏)
```

### 布局适配

**移动端（< 768px）**：
- 单列布局
- 隐藏侧边栏
- 导航栏收起为汉堡菜单
- 卡片全宽 `px-4`

**平板（768px - 1024px）**：
- 双列网格
- 导航栏完整显示
- 卡片宽度 `max-w-2xl`

**桌面（> 1024px）**：
- 三列布局（内容 + 侧边栏）
- 固定导航栏
- 内容居中 `max-w-7xl mx-auto`

---

## 可访问性（Accessibility）

### 必须遵守的规则

1. **色彩对比度**：最低 4.5:1（WCAG AA）
2. **焦点状态**：所有可交互元素必须有清晰的 `focus-visible` 状态
3. **键盘导航**：支持 Tab/Enter/Space 导航
4. **语义化 HTML**：使用 `<article>` `<nav>` `<main>` `<section>`
5. **Alt 文本**：所有图片必须有描述性 alt
6. **ARIA 标签**：图标按钮使用 `aria-label`

```html
<!-- 正确示例 -->
<button aria-label="切换深色模式" class="focus-visible:ring-2 focus-visible:ring-blue-500">
  <svg>...</svg>
</button>

<!-- 错误示例 -->
<div onclick="...">🌙</div>
```

---

## 性能优化

### 关键指标目标

- **LCP（最大内容绘制）**：< 2.5s
- **FID（首次输入延迟）**：< 100ms
- **CLS（累积布局偏移）**：< 0.1

### 优化策略

1. **图片优化**：
   - 使用 Next.js `<Image>` 组件
   - WebP 格式
   - 响应式图片（srcset）

2. **字体优化**：
   - `font-display: swap`
   - 预加载关键字体

3. **代码分割**：
   - Dynamic Import
   - Route-based splitting

4. **缓存策略**：
   - 静态资源 CDN
   - API 响应缓存

---

## 设计检查清单

### 交付前必查项

- [ ] 无 emoji 图标（使用 Lucide Icons）
- [ ] 所有可点击元素有 `cursor-pointer`
- [ ] Hover 状态有视觉反馈
- [ ] 过渡动画 150-300ms
- [ ] Light/Dark 模式对比度 ≥ 4.5:1
- [ ] 焦点状态清晰可见
- [ ] 响应式测试（375px / 768px / 1024px / 1440px）
- [ ] 支持 `prefers-reduced-motion`
- [ ] 所有图片有 alt 文本
- [ ] 图标按钮有 aria-label
- [ ] 无横向滚动条
- [ ] 固定导航栏不遮挡内容

---

## 参考灵感

### AI 大厂风格参考

- **Vercel**：极简、快速、专业
- **Linear**：网格系统、精准间距
- **Stripe Docs**：清晰导航、优秀排版
- **GitHub README**：Markdown 美学
- **Notion**：卡片布局、细腻交互

### 配色参考

- Zinc 灰度系（中性、专业）
- Blue 强调色（科技、可信赖）
- 高对比度（可读性优先）

---

## 下一步行动

1. ✅ 设计系统已确定
2. 📋 创建项目结构
3. 🎨 实现首页 + 导航栏
4. 📝 实现内容卡片组件
5. 🔗 接入多端 API
6. 🧪 测试响应式 + 可访问性
7. 🚀 部署到 Vercel

---

**设计文档版本**：v1.0
**最后更新**：2026-02-05
**设计师/开发者**：Claude (UI/UX Pro Max)
