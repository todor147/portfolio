// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://todors-portfolio.netlify.app',
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
