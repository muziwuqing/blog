# Blog 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 Astro + Preact + Tailwind CSS + MDX 构建 muzuwuqing.com 个人博客

**Architecture:** Astro 静态组件为主，Preact Island 承载客户端交互（主题切换、动效）。Content Collections 管理 MDX 文章，Tailwind class 策略处理暗色模式。动效分三层独立叠加。

**Tech Stack:** Astro 5, TypeScript, Preact, Tailwind CSS 4, MDX, pnpm

---

### Task 1: 项目脚手架

**Files:**
- Create: 整个项目目录结构（`pnpm create astro@latest`）

- [ ] **Step 1: 创建 Astro 项目**

```bash
cd D:/Code/Project/muziwuqing/blog
pnpm create astro@latest . -- --template basics --typescript strict --install
```

交互选项：
- 是否在当前目录创建：Yes
- TypeScript：Yes, strict
- Install dependencies：Yes
- Initialize git：No（已初始化）

- [ ] **Step 2: 安装核心依赖**

```bash
pnpm add @astrojs/preact preact @astrojs/mdx @tailwindcss/vite tailwindcss @tailwindcss/typography @astrojs/rss
```

- [ ] **Step 3: 安装动效相关依赖**

```bash
pnpm add motion @tsparticles/preact @tsparticles/slim react-typed
```

motion — 滚动渐入和基础动效
@tsparticles/preact — 粒子背景
react-typed — 打字机效果

- [ ] **Step 4: 配置 astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    preact({ compat: true }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  site: 'https://muzuwuqing.com',
});
```

Astro 6 + Tailwind v4 使用 `@tailwindcss/vite` 直接作为 Vite 插件，不再通过 `@astrojs/tailwindcss`。
Preact compat 模式让 react-typed、@tsparticles/preact 等 React 生态库能兼容运行。

- [ ] **Step 5: 验证脚手架**

```bash
pnpm dev
```

预期：开发服务器启动，打开 `http://localhost:4321` 看到 Astro 默认页面。
- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "chore: scaffold astro project with preact, mdx, tailwindcss"
```

---

### Task 2: 基础配置

**Files:**
- Create: `src/styles/global.css`
- Modify: `astro.config.mjs`, `tsconfig.json`

- [ ] **Step 1: 编写全局样式**

`src/styles/global.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary: #3b82f6;
  --color-primary-dark: #60a5fa;
  --color-bg: #ffffff;
  --color-bg-dark: #0f172a;
  --color-text: #1e293b;
  --color-text-dark: #e2e8f0;
  --color-card: #f8fafc;
  --color-card-dark: #1e293b;
  --color-border: #e2e8f0;
  --color-border-dark: #334155;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-bg text-text transition-colors duration-300;
}

.dark body {
  @apply bg-bg-dark text-text-dark;
}

.prose {
  @apply max-w-none;
}

.prose pre {
  @apply rounded-lg border border-border dark:border-border-dark;
}

.prose img {
  @apply rounded-lg;
}

/* 滚动渐入初始状态 */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: 配置 tsconfig.json 路径别名**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@content/*": ["./src/content/*"],
      "@lib/*": ["./src/lib/*"],
      "@layouts/*": ["./src/layouts/*"]
    }
  }
}
```

- [ ] **Step 3: 创建常量文件**

`src/lib/constants.ts`:

```ts
export const SITE = {
  title: 'muzuwuqing',
  description: 'Personal blog & portfolio',
  url: 'https://muzuwuqing.com',
  author: 'muzuwuqing',
  postsPerPage: 10,
};
```

- [ ] **Step 4: 创建工具函数**

`src/lib/utils.ts`:

```ts
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}
```

- [ ] **Step 5: 验证编译**

```bash
pnpm dev
```

预期：无报错，页面正常渲染。

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "chore: configure tailwind, ts paths, constants, utils"
```

---

### Task 3: Content Collections

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/hello-world.mdx`
- Create: `src/content/posts/example-post.mdx`

- [ ] **Step 1: 定义 Content Collection schema**

`src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

- [ ] **Step 2: 创建示例文章 hello-world**

`src/content/posts/hello-world.mdx`:

```mdx
---
title: "Hello, World"
date: "2026-05-10"
description: "博客的第一篇文章"
tags: ["随笔"]
draft: false
---

## 欢迎

这是我的个人博客，记录我学习和探索的过程。

```js
console.log('Hello, World!');
```

希望你能在这里找到有价值的内容。
```

- [ ] **Step 3: 创建示例文章 example-post**

`src/content/posts/example-post.mdx`:

```mdx
---
title: "Astro 入门指北"
date: "2026-05-12"
description: "用 Astro 搭建个人博客的完整流程"
tags: ["astro", "前端", "教程"]
draft: false
---

## 为什么选 Astro

Astro 是一个专为内容站点设计的静态站点生成器。

### 核心优势

- **零 JS 输出** — 默认不发送任何 JavaScript
- **Island Architecture** — 需要交互的地方按需引入
- **多框架支持** — React、Preact、Vue、Svelte 组件都能用

### 快速开始

```bash
pnpm create astro@latest
```

就这么简单。
```

- [ ] **Step 4: 验证 type generation**

```bash
pnpm dev
```

预期：Astro 自动生成 `.astro/types.d.ts`，Content Collection 类型可用。

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "feat: add content collections and example posts"
```

---

### Task 4: 布局组件

**Files:**
- Create: `src/components/layout/Container.astro`
- Create: `src/components/layout/Header.astro`
- Create: `src/components/layout/Footer.astro`
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Container 组件**

`src/components/layout/Container.astro`:

```astro
---
interface Props {
  as?: keyof HTMLElementTagNameMap;
  class?: string;
}

const { as = 'div', class: className = '' } = Astro.props;
const Tag = as;
---

<Tag class={`mx-auto max-w-3xl px-4 sm:px-6 ${className}`}>
  <slot />
</Tag>
```

- [ ] **Step 2: Header 组件**

`src/components/layout/Header.astro`:

```astro
---
import Container from './Container.astro';
import ThemeToggle from '@components/theme/ThemeToggle';
import { SITE } from '@lib/constants';
---

<header class="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm dark:border-border-dark dark:bg-bg-dark/80">
  <Container>
    <nav class="flex h-16 items-center justify-between">
      <a href="/" class="text-lg font-bold hover:text-primary transition-colors">
        {SITE.title}
      </a>
      <div class="flex items-center gap-6">
        <a href="/tags" class="text-sm hover:text-primary transition-colors">标签</a>
        <a href="/about" class="text-sm hover:text-primary transition-colors">关于</a>
        <ThemeToggle />
      </div>
    </nav>
  </Container>
</header>
```

- [ ] **Step 3: Footer 组件**

`src/components/layout/Footer.astro`:

```astro
---
import Container from './Container.astro';
import { SITE } from '@lib/constants';
---

<footer class="border-t border-border py-8 dark:border-border-dark">
  <Container>
    <div class="flex flex-col items-center gap-2 text-sm text-text/60 dark:text-text-dark/60">
      <p>&copy; {new Date().getFullYear()} {SITE.author}. All rights reserved.</p>
      <p>Built with Astro & Tailwind CSS</p>
    </div>
  </Container>
</footer>
```

- [ ] **Step 4: 更新根布局 Layout.astro**

读取现有的 `src/layouts/Layout.astro`，替换为：

```astro
---
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import '@styles/global.css';

interface Props {
  title?: string;
  description?: string;
}

const { title, description } = Astro.props;

const fullTitle = title
  ? `${title} | muzuwuqing`
  : 'muzuwuqing — Personal Blog';
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description || 'muzuwuqing 的个人博客'} />
    <title>{fullTitle}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <!-- 防止暗色模式切换时的页面闪烁 -->
    <script is:inline>
      (function () {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
  </head>
  <body class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 5: 验证布局**

```bash
pnpm dev
```

预期：页面显示 Header（带站点名、导航链接、主题切换按钮）和 Footer。主题切换按钮目前无功能，下一步实现。

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: add layout components (header, footer, container)"
```

---

### Task 5: 主题切换

**Files:**
- Create: `src/components/theme/ThemeProvider.tsx`
- Create: `src/components/theme/ThemeToggle.tsx`

- [ ] **Step 1: ThemeProvider 组件**

`src/components/theme/ThemeProvider.tsx`:

```tsx
import { useEffect, useState, type ReactNode } from 'preact/compat';

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}
```

简化的 Provider，实际主题状态通过 DOM class 管理（`<html class="dark">`），不通过 React state。mounted 检查防止 SSR 水合不匹配。

- [ ] **Step 2: ThemeToggle 组件**

`src/components/theme/ThemeToggle.tsx`:

```tsx
import { useEffect, useState } from 'preact/compat';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      class="relative h-8 w-8 rounded-full border border-border bg-card hover:bg-border transition-colors dark:border-border-dark dark:bg-card-dark dark:hover:bg-border-dark"
      aria-label={dark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      <span class="absolute inset-0 flex items-center justify-center text-sm transition-transform duration-500">
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
```

- [ ] **Step 3: 验证主题切换**

```bash
pnpm dev
```

预期：点击按钮切换暗色/亮色，刷新后保持状态。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: add theme toggle with dark mode persistence"
```

---

### Task 6: 首页 — Hero 区

**Files:**
- Create: `src/components/home/HeroSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: HeroSection 静态版**

`src/components/home/HeroSection.astro`:

```astro
---
import Container from '@components/layout/Container.astro';
---

<section class="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
  <Container class="relative z-10 text-center">
    <h1 class="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
      Hi，我是 <span class="text-primary dark:text-primary-dark" id="typewriter-target">muzuwuqing</span>
    </h1>
    <p class="mx-auto max-w-lg text-lg text-text/70 dark:text-text-dark/70">
      全栈开发者，热爱开源与创造。这里记录我的思考、学习和项目。
    </p>
    <div class="mt-8 flex justify-center gap-4">
      <a
        href="/about"
        class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg"
      >
        了解更多
      </a>
      <a
        href="/tags"
        class="rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-all hover:border-primary hover:text-primary dark:border-border-dark dark:hover:border-primary-dark dark:hover:text-primary-dark"
      >
        浏览标签
      </a>
    </div>
  </Container>
</section>
```

- [ ] **Step 2: 更新首页**

`src/pages/index.astro`:

```astro
---
import Layout from '@layouts/Layout.astro';
import HeroSection from '@components/home/HeroSection.astro';
---

<Layout>
  <HeroSection />
</Layout>
```

- [ ] **Step 3: 验证 Hero 区**

```bash
pnpm dev
```

预期：首页显示 Hero 区，标题、描述、两个按钮居中排列。暗色切换正常。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: add hero section with personal intro"
```

---

### Task 7: 首页 — 文章列表

**Files:**
- Create: `src/components/home/PostList.astro`
- Create: `src/components/posts/PostCard.astro`
- Create: `src/components/posts/TagBadge.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: TagBadge 组件**

`src/components/posts/TagBadge.astro`:

```astro
---
interface Props {
  tag: string;
}

const { tag } = Astro.props;
---

<a
  href={`/tags/${tag}`}
  class="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 dark:bg-primary-dark/10 dark:text-primary-dark dark:hover:bg-primary-dark/20"
>
  {tag}
</a>
```

- [ ] **Step 2: PostCard 组件**

`src/components/posts/PostCard.astro`:

```astro
---
import type { CollectionEntry } from 'astro:content';
import TagBadge from './TagBadge.astro';
import { formatDate } from '@lib/utils';

interface Props {
  post: CollectionEntry<'posts'>;
}

const { post } = Astro.props;
const { title, date, description, tags } = post.data;
---

<article class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-border-dark dark:bg-card-dark">
  <a href={`/posts/${post.slug}`}>
    <h2 class="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
      {title}
    </h2>
    <p class="mb-4 text-sm text-text/60 dark:text-text-dark/60 line-clamp-2">
      {description}
    </p>
    <div class="flex items-center justify-between">
      <time class="text-xs text-text/40 dark:text-text-dark/40" datetime={date.toISOString()}>
        {formatDate(date)}
      </time>
      <div class="flex gap-1.5">
        {tags.map(tag => <TagBadge tag={tag} />)}
      </div>
    </div>
  </a>
</article>
```

- [ ] **Step 3: PostList 组件**

`src/components/home/PostList.astro`:

```astro
---
import { getCollection } from 'astro:content';
import PostCard from '@components/posts/PostCard.astro';
import Container from '@components/layout/Container.astro';

const allPosts = await getCollection('posts', ({ data }) => !data.draft);
const posts = allPosts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<section class="py-16">
  <Container>
    <h2 class="mb-8 text-2xl font-bold">最新文章</h2>
    <div class="grid gap-6 sm:grid-cols-2">
      {posts.map(post => <PostCard post={post} />)}
    </div>

    {posts.length === 0 && (
      <p class="py-12 text-center text-text/40 dark:text-text-dark/40">
        还没有文章，敬请期待。
      </p>
    )}
  </Container>
</section>
```

- [ ] **Step 4: 更新首页引入 PostList**

`src/pages/index.astro`:

```astro
---
import Layout from '@layouts/Layout.astro';
import HeroSection from '@components/home/HeroSection.astro';
import PostList from '@components/home/PostList.astro';
---

<Layout>
  <HeroSection />
  <PostList />
</Layout>
```

- [ ] **Step 5: 验证文章列表**

```bash
pnpm dev
```

预期：Hero 区下方展示 2 篇示例文章的卡片，卡片 hover 上浮效果，标签可点击。

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: add post list with cards and tag badges"
```

---

### Task 8: 文章详情页

**Files:**
- Create: `src/pages/posts/[slug].astro`

- [ ] **Step 1: 文章详情页**

`src/pages/posts/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '@layouts/Layout.astro';
import Container from '@components/layout/Container.astro';
import TagBadge from '@components/posts/TagBadge.astro';
import { formatDate } from '@lib/utils';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
const { title, date, description, tags } = post.data;
---

<Layout title={title} description={description}>
  <Container class="py-12">
    <article>
      <header class="mb-8">
        <h1 class="mb-4 text-3xl font-bold sm:text-4xl">{title}</h1>
        <div class="flex flex-wrap items-center gap-3 text-sm">
          <time class="text-text/50 dark:text-text-dark/50" datetime={date.toISOString()}>
            {formatDate(date)}
          </time>
          <div class="flex gap-1.5">
            {tags.map(tag => <TagBadge tag={tag} />)}
          </div>
        </div>
      </header>

      <div class="prose prose-slate dark:prose-invert">
        <Content />
      </div>
    </article>
  </Container>
</Layout>
```

- [ ] **Step 2: 验证文章页**

```bash
pnpm dev
```

预期：访问 `/posts/hello-world` 和 `/posts/example-post`，文章内容正确渲染，代码块高亮，prose 排版正常。

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: add post detail page with mdx rendering"
```

---

### Task 9: 标签页面

**Files:**
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/components/tags/TagCloud.tsx`

- [ ] **Step 1: 标签云页面**

`src/pages/tags/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '@layouts/Layout.astro';
import Container from '@components/layout/Container.astro';

const allPosts = await getCollection('posts', ({ data }) => !data.draft);
const tagMap = new Map<string, number>();
allPosts.forEach(post => {
  post.data.tags.forEach(tag => {
    tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
  });
});
const tags = [...tagMap.entries()].sort((a, b) => b[1] - a[1]);
---

<Layout title="标签">
  <Container class="py-16">
    <h1 class="mb-8 text-3xl font-bold">标签</h1>
    <div class="flex flex-wrap gap-3">
      {tags.map(([tag, count]) => (
        <a
          href={`/tags/${tag}`}
          class="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-all hover:border-primary hover:text-primary hover:shadow-md dark:border-border-dark dark:hover:border-primary-dark dark:hover:text-primary-dark"
        >
          <span>{tag}</span>
          <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary-dark/10 dark:text-primary-dark">
            {count}
          </span>
        </a>
      ))}
    </div>

    {tags.length === 0 && (
      <p class="py-12 text-center text-text/40 dark:text-text-dark/40">
        还没有标签。
      </p>
    )}
  </Container>
</Layout>
```

- [ ] **Step 2: 按标签筛选页面**

`src/pages/tags/[tag].astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '@layouts/Layout.astro';
import Container from '@components/layout/Container.astro';
import PostCard from '@components/posts/PostCard.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const tagSet = new Set<string>();
  posts.forEach(p => p.data.tags.forEach(t => tagSet.add(t)));
  return [...tagSet].map(tag => ({ params: { tag } }));
}

const { tag } = Astro.params;
const allPosts = await getCollection('posts', ({ data }) =>
  !data.draft && data.tags.includes(tag!)
);
const posts = allPosts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<Layout title={`标签: ${tag}`}>
  <Container class="py-12">
    <h1 class="mb-2 text-3xl font-bold">
      标签：<span class="text-primary dark:text-primary-dark">{tag}</span>
    </h1>
    <p class="mb-8 text-text/50 dark:text-text-dark/50">
      共 {posts.length} 篇文章
    </p>
    <div class="grid gap-6 sm:grid-cols-2">
      {posts.map(post => <PostCard post={post} />)}
    </div>
  </Container>
</Layout>
```

- [ ] **Step 3: 标签云组件（Preact Island，后续加动效用）**

`src/components/tags/TagCloud.tsx`:

```tsx
interface Props {
  tags: { tag: string; count: number }[];
}

export default function TagCloud({ tags }: Props) {
  return (
    <div class="flex flex-wrap gap-3">
      {tags.map(({ tag, count }) => (
        <a
          href={`/tags/${tag}`}
          class="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-all hover:border-primary hover:text-primary hover:shadow-md dark:border-border-dark dark:hover:border-primary-dark dark:hover:text-primary-dark"
        >
          <span>{tag}</span>
          <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary-dark/10 dark:text-primary-dark">
            {count}
          </span>
        </a>
      ))}
    </div>
  );
}
```

注意：此组件后续任务会在标签云页面替换为带动效的 Preact 版本。当前先创建好占位。

- [ ] **Step 4: 验证标签功能**

```bash
pnpm dev
```

预期：访问 `/tags` 显示标签云，点击标签跳转到 `/tags/[tag]` 列出对应文章。

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "feat: add tag cloud and tag filter pages"
```

---

### Task 10: 关于页面

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: 关于页面**

`src/pages/about.astro`:

```astro
---
import Layout from '@layouts/Layout.astro';
import Container from '@components/layout/Container.astro';
---

<Layout title="关于">
  <Container class="py-16">
    <h1 class="mb-8 text-3xl font-bold">关于我</h1>

    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        全栈开发者，热爱开源与创造。
      </p>

      <h2>技能</h2>
      <ul>
        <li><strong>前端：</strong>TypeScript, React, Next.js, Astro, Tailwind CSS</li>
        <li><strong>后端：</strong>Node.js, Python, PostgreSQL</li>
        <li><strong>工具：</strong>Git, Docker, Linux</li>
      </ul>

      <h2>联系</h2>
      <ul>
        <li>GitHub: <a href="https://github.com/muziwuqing">@muziwuqing</a></li>
      </ul>
    </div>
  </Container>
</Layout>
```

- [ ] **Step 2: 验证**

```bash
pnpm dev
```

预期：访问 `/about` 显示关于页面，prose 排版正确。

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: add about page"
```

---

### Task 11: 动效第一层 — CSS 交互细节

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/posts/PostCard.astro`
- Modify: `src/components/layout/Header.astro`

- [ ] **Step 1: 确认全局过渡基础**

在 `src/styles/global.css` 确认已有（Task 2 已写入）：

```css
html {
  scroll-behavior: smooth;
}

body {
  @apply bg-bg text-text transition-colors duration-300;
}
```

这一层不新增文件，只确认已有样式。卡片 hover 效果在 Task 7 的 PostCard 中已经实现（`transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`），Header 链接 hover 在 Task 4 已实现。

- [ ] **Step 2: 添加暗色模式切换过渡增强**

在 `src/styles/global.css` 追加：

```css
/* 所有元素颜色过渡 */
*,
*::before,
*::after {
  transition-property: color, background-color, border-color;
  transition-duration: 0ms;
}

.dark-transition *,
.dark-transition *::before,
.dark-transition *::after {
  transition-duration: 300ms;
}
```

- [ ] **Step 3: 更新 ThemeToggle 添加过渡 class**

读取 `src/components/theme/ThemeToggle.tsx`，修改 toggle 函数：

```tsx
import { useEffect, useState } from 'preact/compat';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    document.documentElement.classList.add('dark-transition');
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setTimeout(() => {
      document.documentElement.classList.remove('dark-transition');
    }, 300);
  }

  return (
    <button
      onClick={toggle}
      class="relative h-8 w-8 rounded-full border border-border bg-card hover:bg-border transition-colors dark:border-border-dark dark:bg-card-dark dark:hover:bg-border-dark"
      aria-label={dark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      <span class="absolute inset-0 flex items-center justify-center text-sm transition-transform duration-500">
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
```

- [ ] **Step 4: 验证动效**

```bash
pnpm dev
```

预期：暗色切换时颜色平滑过渡；卡片 hover 上浮；链接 hover 变色。

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "feat: add CSS interaction animations (hover, dark mode transition)"
```

---

### Task 12: 动效第二层 — 滚动渐入 + 打字机

**Files:**
- Create: `src/components/home/TypewriterTitle.tsx`
- Create: `src/components/home/ScrollReveal.tsx`
- Modify: `src/components/home/HeroSection.astro`
- Modify: `src/components/home/PostList.astro`
- Modify: `src/components/posts/PostCard.astro`
- Modify: `src/pages/tags/index.astro`
- Modify: `src/pages/about.astro`

- [ ] **Step 1: 打字机标题组件**

`src/components/home/TypewriterTitle.tsx`:

```tsx
import { useEffect, useRef } from 'preact/compat';

interface Props {
  texts: string[];
  className?: string;
}

export default function TypewriterTitle({ texts, className = '' }: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function type() {
      const current = texts[textIndex];

      if (isDeleting) {
        el!.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el!.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        speed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        speed = 300;
      }

      timeoutId = setTimeout(type, speed);
    }

    timeoutId = setTimeout(type, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <span ref={spanRef} class={`${className} after:content-['|'] after:animate-pulse after:ml-0.5`} />
  );
}
```

- [ ] **Step 2: 滚动渐入组件**

`src/components/home/ScrollReveal.tsx`:

```tsx
import { useEffect, useRef, type ReactNode } from 'preact/compat';

interface Props {
  children: ReactNode;
  className?: string;
  threshold?: number;
}

export default function ScrollReveal({ children, className = '', threshold = 0.1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} class={`animate-on-scroll ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: HeroSection 接入打字机**

读取 `src/components/home/HeroSection.astro`，将标题中静态文字替换为 Preact Island：

```astro
---
import Container from '@components/layout/Container.astro';
import TypewriterTitle from '@components/home/TypewriterTitle';
---

<section class="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
  <Container class="relative z-10 text-center">
    <h1 class="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
      Hi，我是{' '}
      <TypewriterTitle
        texts={['muzuwuqing', '全栈开发者', '开源爱好者']}
        class="text-primary dark:text-primary-dark"
        client:load
      />
    </h1>
    <p class="mx-auto max-w-lg text-lg text-text/70 dark:text-text-dark/70">
      全栈开发者，热爱开源与创造。这里记录我的思考、学习和项目。
    </p>
    <div class="mt-8 flex justify-center gap-4">
      <a
        href="/about"
        class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg"
      >
        了解更多
      </a>
      <a
        href="/tags"
        class="rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-all hover:border-primary hover:text-primary dark:border-border-dark dark:hover:border-primary-dark dark:hover:text-primary-dark"
      >
        浏览标签
      </a>
    </div>
  </Container>
</section>
```

- [ ] **Step 4: PostList 接入滚动渐入**

读取 `src/components/home/PostList.astro`，将每个卡片包裹 ScrollReveal：

```astro
---
import { getCollection } from 'astro:content';
import PostCard from '@components/posts/PostCard.astro';
import Container from '@components/layout/Container.astro';
import ScrollReveal from '@components/home/ScrollReveal';
---

const allPosts = await getCollection('posts', ({ data }) => !data.draft);
const posts = allPosts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<section class="py-16">
  <Container>
    <h2 class="mb-8 text-2xl font-bold">最新文章</h2>
    <div class="grid gap-6 sm:grid-cols-2">
      {posts.map((post, i) => (
        <ScrollReveal
          client:load
          threshold={0.05}
          className={i > 3 ? '' : ''}
        >
          <PostCard post={post} />
        </ScrollReveal>
      ))}
    </div>

    {posts.length === 0 && (
      <p class="py-12 text-center text-text/40 dark:text-text-dark/40">
        还没有文章，敬请期待。
      </p>
    )}
  </Container>
</section>
```

- [ ] **Step 5: 关于页接入滚动渐入**

读取 `src/pages/about.astro`，用 ScrollReveal 包裹 prose 内容：

```astro
---
import Layout from '@layouts/Layout.astro';
import Container from '@components/layout/Container.astro';
import ScrollReveal from '@components/home/ScrollReveal';
---

<Layout title="关于">
  <Container class="py-16">
    <ScrollReveal client:load>
      <h1 class="mb-8 text-3xl font-bold">关于我</h1>
    </ScrollReveal>

    <ScrollReveal client:load>
      <div class="prose prose-slate dark:prose-invert max-w-none">
        <p>全栈开发者，热爱开源与创造。</p>
        <h2>技能</h2>
        <ul>
          <li><strong>前端：</strong>TypeScript, React, Next.js, Astro, Tailwind CSS</li>
          <li><strong>后端：</strong>Node.js, Python, PostgreSQL</li>
          <li><strong>工具：</strong>Git, Docker, Linux</li>
        </ul>
        <h2>联系</h2>
        <ul>
          <li>GitHub: <a href="https://github.com/muzuwuqing">@muzuwuqing</a></li>
        </ul>
      </div>
    </ScrollReveal>
  </Container>
</Layout>
```

- [ ] **Step 6: 验证第二层动效**

```bash
pnpm dev
```

预期：
- 首页标题打字机效果，文字循环（muzuwuqing → 全栈开发者 → 开源爱好者）
- 滚动时卡片和内容逐个渐入
- 暗色模式下打字机颜色同步切换

- [ ] **Step 7: 提交**

```bash
git add -A
git commit -m "feat: add scroll reveal and typewriter animations"
```

---

### Task 13: 动效第三层 — 粒子背景

**Files:**
- Create: `src/components/home/ParticleBackground.tsx`
- Modify: `src/components/home/HeroSection.astro`

- [ ] **Step 1: 粒子背景组件**

`src/components/home/ParticleBackground.tsx`:

```tsx
import { useEffect, useState } from 'preact/compat';
import Particles, { initParticlesEngine } from '@tsparticles/preact';
import { loadSlim } from '@tsparticles/slim';

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  const isDark = typeof document !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : false;

  return (
    <Particles
      id="hero-particles"
      class="absolute inset-0 z-0"
      options={{
        fpsLimit: 60,
        particles: {
          number: { value: 60, density: { enable: true } },
          color: { value: isDark ? '#60a5fa' : '#3b82f6' },
          opacity: { value: 0.3 },
          size: { value: { min: 1, max: 3 } },
          move: {
            enable: true,
            speed: 0.8,
            direction: 'none' as const,
            random: true,
            straight: false,
            outModes: { default: 'out' as const },
          },
          links: {
            enable: true,
            distance: 150,
            color: isDark ? '#60a5fa' : '#3b82f6',
            opacity: 0.15,
            width: 1,
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'grab' },
          },
          modes: {
            grab: { distance: 200, links: { opacity: 0.3 } },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
```

- [ ] **Step 2: HeroSection 接入粒子背景**

读取 `src/components/home/HeroSection.astro`，在 section 内加入粒子：

```astro
---
import Container from '@components/layout/Container.astro';
import TypewriterTitle from '@components/home/TypewriterTitle';
import ParticleBackground from '@components/home/ParticleBackground';
---

<section class="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
  <ParticleBackground client:load />

  <Container class="relative z-10 text-center">
    <h1 class="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
      Hi，我是{' '}
      <TypewriterTitle
        texts={['muzuwuqing', '全栈开发者', '开源爱好者']}
        class="text-primary dark:text-primary-dark"
        client:load
      />
    </h1>
    <p class="mx-auto max-w-lg text-lg text-text/70 dark:text-text-dark/70">
      全栈开发者，热爱开源与创造。这里记录我的思考、学习和项目。
    </p>
    <div class="mt-8 flex justify-center gap-4">
      <a
        href="/about"
        class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg"
      >
        了解更多
      </a>
      <a
        href="/tags"
        class="rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-all hover:border-primary hover:text-primary dark:border-border-dark dark:hover:border-primary-dark dark:hover:text-primary-dark"
      >
        浏览标签
      </a>
    </div>
  </Container>
</section>
```

- [ ] **Step 3: 验证粒子效果**

```bash
pnpm dev
```

预期：
- 首页 Hero 区背景有粒子网络动画
- 鼠标悬停时粒子连线高亮（grab 模式）
- 粒子颜色随暗色模式变化（蓝/浅蓝）

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: add particle background animation"
```

---

### Task 14: 404 页 + SEO 元数据

**Files:**
- Create: `src/pages/404.astro`
- Modify: `src/pages/posts/[slug].astro`

- [ ] **Step 1: 404 页面**

`src/pages/404.astro`:

```astro
---
import Layout from '@layouts/Layout.astro';
import Container from '@components/layout/Container.astro';
---

<Layout title="页面未找到">
  <Container class="flex flex-col items-center justify-center py-32 text-center">
    <h1 class="mb-4 text-6xl font-bold text-primary dark:text-primary-dark">404</h1>
    <p class="mb-8 text-lg text-text/60 dark:text-text-dark/60">
      你访问的页面不存在。
    </p>
    <a
      href="/"
      class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg"
    >
      返回首页
    </a>
  </Container>
</Layout>
```

- [ ] **Step 2: 文章页增加 SEO meta**

读取 `src/pages/posts/[slug].astro`，确认 Layout 已传 title 和 description（Task 8 已实现）。

- [ ] **Step 3: 验证**

```bash
pnpm dev
```

预期：访问不存在的路由显示 404 页面，文章页源码中包含正确的 `<title>` 和 `<meta name="description">`。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: add 404 page and seo metadata"
```

---

### Task 15: Final — 构建验证 + 清理

**Files:**
- Modify: 删除 `src/pages/index.astro` 的 Astro 默认模板内容（如果还存在）
- Create: `public/favicon.svg`

- [ ] **Step 1: 创建简易 favicon**

`public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">📝</text>
</svg>
```

- [ ] **Step 2: 执行生产构建**

```bash
pnpm build
```

预期：构建成功，`dist/` 目录生成所有静态页面，无报错。

- [ ] **Step 3: 验证构建产物**

```bash
ls dist/
```

预期包含：`index.html`、`posts/`、`tags/`、`about/`、`404.html`、`favicon.svg`

- [ ] **Step 4: 清理旧计划文件**

PLAN.md 是旧计划（Next.js 方案），提交前删除它。

```bash
rm PLAN.md
```

- [ ] **Step 5: 更新 CLAUDE.md**

读取 `CLAUDE.md`，将内容替换为与 Astro 方案一致：

```markdown
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
pnpm lint       # ESLint
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
- 代码高亮由 MDX + prose 提供，无需额外配置
```

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "chore: build verification, favicon, cleanup old plan"
```
