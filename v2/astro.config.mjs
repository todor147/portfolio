// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';
import { SITE } from './src/lib/site.ts';

/**
 * Last-commit date per source file (path relative to v2/), from ONE
 * `git log --name-only` pass. Returns null when history can't be trusted
 * (no git, shallow clone, or a single commit) so the sitemap omits lastmod
 * instead of publishing misleading dates (e.g. the build date).
 */
function gitLastModified() {
  try {
    /** @param {...string} args */
    const git = (...args) =>
      execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    if (git('rev-parse', '--is-shallow-repository').trim() !== 'false') return null;
    if (Number(git('rev-list', '--count', 'HEAD').trim()) < 2) return null;
    const out = git('log', '--relative', '--name-only', '--format=@@%cI', '--', 'src/pages', 'src/content');
    const dates = new Map();
    let current = '';
    for (const line of out.split(/\r?\n/)) {
      if (line.startsWith('@@')) current = line.slice(2).trim();
      else if (line.trim() && !dates.has(line.trim())) dates.set(line.trim(), current); // newest first
    }
    return dates.size ? dates : null;
  } catch {
    return null;
  }
}
const lastModified = gitLastModified();

/**
 * Map a sitemap URL to its single source file, or null if there isn't a clear one.
 * @param {string} pathname
 */
function sourceFor(pathname) {
  const m = pathname.match(/^\/(projects|cellar)\/([^/]+)\/$/);
  if (m) return `src/content/${m[1]}/${m[2]}.md`;
  const name = pathname.replace(/^\/|\/$/g, '');
  if (!name) return 'src/pages/index.astro';
  return [`src/pages/${name}.astro`, `src/pages/${name}/index.astro`].find((f) => lastModified?.has(f)) ?? null;
}


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
      serialize: (item) => {
        if (!lastModified) return item;
        const src = sourceFor(new URL(item.url).pathname);
        const date = src && lastModified.get(src);
        if (date) item.lastmod = date;
        return item;
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
