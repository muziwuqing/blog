# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

基于 Astro + Preact + Tailwind CSS + MDX 的个人博客，绑定 `muzuwuqing.com`。纯静态输出，Content Collections 管理文章。

详见 [docs/superpowers/specs/2026-05-12-blog-design.md](docs/superpowers/specs/2026-05-12-blog-design.md)。

## 常用命令

```bash
pnpm dev        # 开发服务器 (localhost:4321)
pnpm build      # 生产构建
pnpm preview    # 预览构建产物
```

## 核心架构

### 数据层

- Content Collections (`src/content/posts/`) 是唯一数据源
- `astro:content` 的 `getCollection('posts')` 读取文章，按 frontmatter 过滤/排序
- 类型由 Astro 自动生成 (`.astro/types.d.ts`)

### 组件分层

- `.astro` 组件 — 绝大多数组件，服务端渲染，零 JS
- `.tsx`（Preact）组件 — 仅用于客户端交互：主题切换、动效、打字机、粒子背景
- Preact 组件通过 `client:load` 指令在 Astro 中按需加载（Island Architecture）

### 动效架构（三层独立）

1. CSS 层 — 暗色过渡、hover 效果（`src/styles/global.css`，零 JS）
2. 页面动效 — 滚动渐入 (`ScrollReveal.tsx`)、打字机 (`TypewriterTitle.tsx`)
3. 背景特效 — 粒子网络 (`ParticleBackground.tsx`)，Hero 区限定

每层独立，移除组件即可关闭对应效果。

### 文件命名

- Astro 组件用 PascalCase：`Header.astro`、`PostCard.astro`
- Preact 组件用 PascalCase：`ThemeToggle.tsx`、`ScrollReveal.tsx`
- lib 文件用 kebab-case：`constants.ts`、`utils.ts`
- 路由文件用 Astro 约定：`index.astro`、`[slug].astro`、`404.astro`

### 关键约定

- 站点配置在 `src/lib/constants.ts`
- 暗色模式用 Tailwind `class` 策略 + 内联 script 防闪烁
- 文章 frontmatter：`title`、`date`、`description`、`tags`（string[]）、`draft`（boolean）
- `draft: true` 的文章所有查询都需要过滤 `({ data }) => !data.draft`
- Content Collection 使用 `astro/loaders` 的 `glob` loader，配置文件为 `src/content.config.ts`
- `@tsparticles/preact` 为 CJS 包，需用默认导入后解构

### 验证清单

1. `pnpm dev` 开发服务器正常，MDX 修改即时可见
2. `pnpm build` 无错误，静态页面生成成功
3. 浏览器走通：首页列表 → 文章详情 → 暗色切换 → 标签筛选
