# 博客网站项目规划 — muzuwuqing.com

## Context

在 `D:/Code/Project/muzuwuqing/blog/` 目录下新建基于 Next.js 的个人博客网站，绑定 `muzuwuqing.com` 域名（作为该域名的子项目）。技术选型：Next.js (App Router) + TypeScript + Tailwind CSS，Markdown/MDX 文件管理内容。需包含标签分类、RSS 订阅、评论系统（Giscus）、暗色模式。

## 项目结构

```
blog/
├── public/
│   ├── images/
│   │   └── avatar.png
│   └── favicon.ico
├── content/
│   └── posts/                  # 所有 .mdx 文章平铺在此
│       ├── hello-world.mdx
│       └── ...
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局: ThemeProvider + Header + Footer
│   │   ├── page.tsx            # 首页: 分页文章列表
│   │   ├── not-found.tsx       # 自定义 404
│   │   ├── globals.css         # Tailwind 指令 + prose 样式覆盖
│   │   ├── sitemap.ts          # 自动生成 sitemap.xml
│   │   ├── robots.ts           # 自动生成 robots.txt
│   │   ├── feed.xml/
│   │   │   └── route.ts        # RSS 路由处理器
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 文章详情页
│   │   ├── tags/
│   │   │   ├── page.tsx        # 标签云页面
│   │   │   └── [tag]/
│   │   │       └── page.tsx    # 按标签过滤的文章列表
│   │   └── about/
│   │       └── page.tsx        # 关于页面
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── container.tsx
│   │   ├── theme/
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── posts/
│   │   │   ├── post-card.tsx
│   │   │   ├── post-list.tsx
│   │   │   └── tag-badge.tsx
│   │   ├── pagination.tsx
│   │   └── giscus-comments.tsx
│   ├── lib/
│   │   ├── posts.ts            # 核心: 所有 MDX 读取/解析逻辑
│   │   ├── constants.ts        # 站点名、URL、分页大小等
│   │   └── utils.ts            # 日期格式化、slug 工具函数
│   └── types/
│       └── index.ts
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## 路由设计

| 路由 | 说明 |
|---|---|
| `/` | 首页，分页文章列表 `?page=N` |
| `/posts/[slug]` | 文章详情页 |
| `/tags` | 标签云 |
| `/tags/[tag]` | 按标签筛选，分页 `?page=N` |
| `/about` | 关于页面 |
| `/feed.xml` | RSS 2.0 XML |
| `/sitemap.xml` | 自动生成 |
| `/robots.txt` | 自动生成 |

## 文章 Frontmatter

```yaml
---
title: "文章标题"
date: "2026-05-10"
description: "文章摘要，用于列表展示和 SEO"
tags: ["nextjs", "typescript", "tutorial"]
draft: false        # true 时生产环境不显示
---
```

## 关键依赖

**生产依赖:** next (v15), react (v19), next-mdx-remote (v5), gray-matter, @giscus/react (v3), next-themes, feed, date-fns, rehype-pretty-code, rehype-slug, remark-gfm, shiki

**开发依赖:** typescript, tailwindcss, @tailwindcss/typography, postcss, autoprefixer

## 数据流

- `src/lib/posts.ts` 是唯一的内容读取入口，导出 `getAllPosts()`、`getPostBySlug()`、`getAllTags()`、`getPostsByTag()` 等函数
- 文章清单用 gray-matter 解析 frontmatter（轻量同步），文章详情页用 next-mdx-remote 的 `compileMDX` 编译完整 MDX
- 首页、RSS、sitemap、标签页都复用 `getAllPosts()`
- 只有 4 个客户端组件（ThemeProvider、ThemeToggle、Pagination、GiscusComments），其余全部是服务端组件

## 实施步骤

### 第 1 步: 项目脚手架
- `npx create-next-app@latest` 初始化 Next.js + TypeScript + Tailwind + App Router + src 目录
- 安装剩余依赖（next-mdx-remote, gray-matter, @giscus/react, next-themes, feed, date-fns 等）
- 配置 Tailwind: `darkMode: 'class'`，引入 `@tailwindcss/typography`
- 创建目录结构: `content/posts/`, `src/lib/`, `src/types/`, `src/components/` 各子目录

### 第 2 步: 核心数据层
- 定义类型: `Post`, `PostFrontmatter`, `TagCount`（`src/types/index.ts`）
- 定义常量: 站点名、URL、分页数、Giscus 配置（`src/lib/constants.ts`）
- 实现 `src/lib/posts.ts`: 读取/解析/过滤/排序 MDX 文件
- 写 2-3 篇示例 .mdx 验证数据管道

### 第 3 步: 布局和主题
- ThemeProvider + ThemeToggle（next-themes 封装）
- Header、Footer、Container 布局组件
- 更新根布局: 主题包裹、HTML 元数据、全局 metadata

### 第 4 步: 核心页面
- 首页: 分页文章列表（PostCard 卡片网格）
- 文章详情页: `compileMDX` 编译 + prose 排版 + 代码高亮
- 标签云 + 按标签筛选页
- 关于页面

### 第 5 步: 高级功能
- RSS feed（`feed` 包，Route Handler）
- sitemap.ts + robots.ts
- Giscus 评论区组件 + 文章页集成
- SEO 元数据（全局 + 动态 per-post）

### 第 6 步: 收尾打磨
- 自定义 404 页面
- 响应式适配
- 加载骨架屏（loading.tsx）
- `npm run build` 验证 + 亮暗主题切换测试 + RSS 验证

## 验证方式

1. `npm run dev` — 开发服务器正常运行，热更新响应 MDX 修改
2. `npm run build` — 无错误，静态页面生成成功
3. 浏览器验证: 首页列表 → 点击文章 → 暗色切换 → 标签筛选 → 评论组件
4. `/feed.xml` 在 RSS 阅读器中验证
5. `/sitemap.xml` 列出所有路由
6. Lighthouse SEO/性能评分检查
