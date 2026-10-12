# Todor Aleksandrov — Portfolio (v2)

Personal portfolio site: experience, projects, certifications, tailored CVs, plus a few interactive pages (wine pairing, lifeguard scenarios, Bulgarian phrasebook, cellar).

## Stack

- Astro 6, fully static output
- Tailwind CSS 4 (via `@tailwindcss/vite`), design tokens in `src/styles/global.css`
- Astro content collections (Markdown/JSON, schema-validated)
- satori + resvg for generated Open Graph images; sharp for the image pipeline

## Structure

```
src/
  content/       achievements, cellar, certifications, education, experience,
                 pairings, phrases, projects, scenarios, volunteering
  pages/         routes (/cv/[variant]/ renders each CV view)
  components/    UI + CvDocument.astro (the printable CV)
  lib/           cv.ts (CV variants, PDF paths), search-index.ts, dates, helpers
  styles/        global.css (tokens, @media print rules)
scripts/         optimize-images.mjs, normalize-originals.mjs, generate-cv-pdfs.mjs
public/assets/   original images (+ generated manifest and CV PDFs)
```

## Commands

Run from `v2/`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Runs `optimize:images`, then `astro build` into `dist/` |
| `npm run preview` | Serves the built site |
| `npm run cv:pdf` | Regenerates the four CV PDFs (needs `preview` running) |
| `node scripts/normalize-originals.mjs` | One-off tidy-up of original image files |

## Images

Put originals in `public/assets/`. `npm run optimize:images` (part of `build`) generates responsive WebP variants and a manifest, and strips EXIF data. Do not hand-edit generated files.

## CV PDFs

The CV pages at `/cv/<variant>/` are the single source of truth; PDFs are printed from them with a local Chromium-family browser (Chrome/Edge; set `CHROME_PATH` if not auto-detected):

```sh
npm run build && npm run preview     # terminal 1
npm run cv:pdf                       # terminal 2 (CV_BASE_URL overrides the URL)
```

Commit the updated PDFs in `public/assets/`. Netlify does not run this step. Print layout lives in the `@media print` block of `global.css`.

## Deployment

Netlify, configured by the root `netlify.toml` (`base = "v2"`, publish `dist`, Node 22). `v2/netlify.toml` is a mirror; edit both together. Page URLs use trailing slashes.

## Updating content

Add or edit a Markdown file in the matching `src/content/<collection>/` folder, following the frontmatter of existing entries (schemas are in `src/content.config.ts`). Pages, CV variants, and the command-palette search index pick it up on the next build. CV variant rules (which categories each view includes) are in `src/lib/cv.ts`.
