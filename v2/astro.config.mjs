// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/lib/site.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  // Astro 7 defaults to 'jsx' (drops whitespace between inline elements); keep v6 behaviour.
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        return !/^\/(design|contact\/success|404)\/?$/.test(pathname);
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["@resvg/resvg-js"],
    },
  },
});
