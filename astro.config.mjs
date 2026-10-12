// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Hosting target is chosen at build time:
//   GitHub Pages:  SITE=https://<user>.github.io  BASE=/<repo>/  npm run build
//   Vercel / local: no variables needed (served from the domain root)
export default defineConfig({
  site: process.env.SITE || 'http://localhost:4321',
  base: process.env.BASE || '/',
  trailingSlash: 'always',
  build: {
    // External CSS files only, so the "after" version can use a strict
    // Content-Security-Policy (style-src 'self') without 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
