# Blog 设计方案 — muzuwuqing.com

## 技术栈

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | Astro | 内容站点首选，零 JS 输出，Content Collections 类型安全 |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS | 暗色模式（class 策略），工具类优先 |
| 内容 | MDX (Content Collections) | Markdown 写作体验 + 组件嵌入能力 |
| 交互组件 | Preact（Astro Island） | 轻量 React 替代，仅用于需要客户端 JS 的组件 |
| 包管理 | pnpm | 更快，更省磁盘，依赖严格 |

## 页面路由

| 路由 | 内容 |
|---|---|
| `/` | Hero 区（动效背景 + 个人介绍）+ 文章列表 |
| `/posts/[slug]` | 文章详情页 |
| `/tags` | 标签云 |
| `/tags/[tag]` | 按标签筛选文章列表 |
| `/about` | 关于页面 |

## 内容模型

文章为 `src/content/posts/` 下的 `.mdx` 文件，frontmatter 结构：

```yaml
---
title: string
date: string          # ISO 日期
description: string   # 列表展示 & SEO
tags: string[]
draft: boolean        # true 时生产环境不呈现
---
```

## 动效分层

### 第一层：细节交互动效（纯 CSS/Tailwind）
- 暗色模式切换过渡动画
- 卡片 hover 微动效（上浮 + 阴影）
- 链接/按钮 hover 下划线
- 标签 hover 颜色变化
- 零 JS，不进 bundle

### 第二层：页面动效（Preact 组件，按需加载）
- 元素滚动渐入动画（Intersection Observer）
- Hero 区打字机效果
- 标签云 hover 交互

### 第三层：背景视觉特效（Preact 组件，Hero 区限定）
- 粒子/星空背景（tsparticles）
- 可选：鼠标跟随光晕

动效分层独立，每层可单独移除，层间不互相依赖。

## 组件架构

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Container.astro
│   ├── home/
│   │   ├── HeroSection.astro        # Hero 区布局（静态部分）
│   │   ├── ParticleBackground.tsx   # 粒子背景（Preact island）
│   │   ├── TypewriterTitle.tsx      # 打字机标题（Preact island）
│   │   └── PostList.astro          # 文章列表
│   ├── posts/
│   │   ├── PostCard.astro
│   │   └── TagBadge.astro
│   ├── tags/
│   │   └── TagCloud.tsx            # 标签云（Preact island）
│   └── theme/
│       ├── ThemeProvider.tsx
│       └── ThemeToggle.tsx
├── content/
│   └── posts/                      # MDX 文章平铺
├── pages/
│   ├── index.astro
│   ├── posts/[slug].astro
│   ├── tags/index.astro
│   ├── tags/[tag].astro
│   └── about.astro
├── lib/
│   ├── constants.ts
│   └── utils.ts
└── styles/
    └── global.css
```

## 数据流

- Astro Content Collections 是唯一数据源，通过 `getCollection('posts')` 读取
- `.astro` 组件在 frontmatter 中查询数据，静态组件零水位 JS
- `.tsx`（Preact）组件通过 props 接收数据，不直接读文件系统
- 标签数据由页面查询时聚合生成，不单独存储

## 不实现的功能（后续按需加）

- RSS 订阅
- 评论系统
- 搜索
- 分页（初期文章量少，单页列表即可）
- 图片优化/CDN

## 验证方式

1. `pnpm dev` — 开发服务器正常，热更新响应 MDX 修改
2. `pnpm build` — 无错误，纯静态输出
3. 浏览器验证：首页 Hero → 文章列表 → 文章详情 → 暗色切换 → 标签筛选
4. 动效验证：粒子背景、打字机效果、滚动渐入、卡片 hover
5. 响应式适配
