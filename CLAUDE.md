# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

基于 Next.js (App Router) + TypeScript + Tailwind CSS 的个人博客，绑定 `muzuwuqing.com`。Markdown/MDX 内容管理，静态生成优先。

详见 [PLAN.md](PLAN.md)。

## 常用命令

```bash
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run start      # 生产运行
npm run lint       # ESLint
```

## 核心架构

### 数据层

`src/lib/posts.ts` 是唯一内容入口，所有页面和功能都通过它获取文章数据。导出函数：

- `getAllPosts()` — 全量文章列表（过滤 draft），用于首页/RSS/sitemap
- `getPostBySlug(slug)` — 单篇文章详情
- `getAllTags()` — 标签云数据（tag → count）
- `getPostsByTag(tag)` — 按标签筛选

文章清单用 gray-matter 轻量解析 frontmatter；文章详情用 next-mdx-remote 的 `compileMDX` 完整编译。

### 组件分层

- **服务端组件** — 绝大多数组件都是服务端，数据直接通过 `src/lib/posts.ts` 获取
- **客户端组件** — 仅 4 个：`ThemeProvider`、`ThemeToggle`、`Pagination`、`GiscusComments`，集中在 `src/components/` 下，通过各自的 `'use client'` 边界

### 文件命名

- 组件文件用 kebab-case：`post-card.tsx`、`tag-badge.tsx`
- lib/ 和 types/ 文件用 kebab-case
- 路由目录用 kebab-case：`posts/[slug]/page.tsx`、`tags/[tag]/page.tsx`
- 页面文件统一用 Next.js 约定文件名：`page.tsx`、`layout.tsx`、`loading.tsx`、`not-found.tsx`、`sitemap.ts`、`robots.ts`

### 关键约定

- 文章配置存储在 `src/lib/constants.ts`（站点名、URL、分页数、Giscus 配置）
- Tailwind 暗色模式用 `class` 策略，由 next-themes 管理
- 文章 frontmatter：`title`、`date`、`description`、`tags`（string[]）、`draft`（boolean）
- `draft: true` 的文章生产环境不呈现
- 代码高亮：rehype-pretty-code + shiki
- RSS 用 `feed` 包，Route Handler 方式实现

### 验证清单

1. `npm run dev` 热更新正常，MDX 修改即时可见
2. `npm run build` 无错误，SSG 生成成功
3. 浏览器走通：首页列表 → 文章详情 → 暗色切换 → 标签筛选 → 评论
4. `/feed.xml`、`/sitemap.xml`、`/robots.txt` 可访问
