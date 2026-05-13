// @ts-check
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
