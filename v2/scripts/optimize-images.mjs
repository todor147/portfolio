#!/usr/bin/env node
/**
 * Generate responsive WebP variants for every JPG/PNG in public/assets/
 * (recursive) and write src/data/image-manifest.json for <Picture>.
 *
 * Per source image:
 *   - <name>.webp      longest edge <= 2000 px, q78
 *   - <name>-640.webp  640 px wide, only when the source is wider than 960 px
 *   - If the main WebP would be larger than the source (tiny PNG icons) it is
 *     not kept; the manifest records `webp: null` and the original is served.
 *
 * WebP-only files (no JPG/PNG sibling) are listed in the manifest with their
 * dimensions so <Picture> can emit width/height for them.
 *
 * Outputs are regenerated when missing or older than the source; the manifest
 * is ALWAYS rebuilt. Metadata is dropped (sharp default). Exits non-zero on
 * any failure.
 *
 * Run with:  npm run optimize:images
 */
import sharp from "sharp";
import { readdir, stat, unlink, writeFile, mkdir, readFile } from "node:fs/promises";
import { join, parse, relative, dirname } from "node:path";

const TARGET_DIR = "public/assets";
const MANIFEST = "src/data/image-manifest.json";
const EXTS = new Set([".jpg", ".jpeg", ".png"]);
const MAX_EDGE = 2000;
const SMALL_WIDTH = 640;
const SMALL_THRESHOLD = 960;
const QUALITY = 78;

const rel = (p) => relative(TARGET_DIR, p).split("\\").join("/");

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, files);
    else files.push(path);
  }
  return files;
}

async function isStale(src, out) {
  try {
    const [a, b] = await Promise.all([stat(src), stat(out)]);
    return b.mtimeMs < a.mtimeMs;
  } catch {
    return true;
  }
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

/** True when `name` (a basename) appears in any text file under src/. */
let srcText = null;
async function referencedInSrc(name) {
  if (srcText === null) {
    const parts = [];
    for (const p of await walk("src")) {
      if (/\.(png|jpe?g|webp|ico|woff2?|ttf|otf)$/i.test(p)) continue;
      parts.push(await readFile(p, "utf8"));
    }
    srcText = parts.join("\n");
  }
  return srcText.includes(name);
}

const all = await walk(TARGET_DIR);
const sources = all.filter((p) => EXTS.has(parse(p).ext.toLowerCase()));
const sourceBases = new Set(
  sources.map((p) => p.slice(0, -parse(p).ext.length)),
);
const manifest = {};
let generated = 0;
let kept = 0;

for (const path of sources) {
  const ext = parse(path).ext;
  const base = path.slice(0, -ext.length);
  const out = `${base}.webp`;
  const small = `${base}-${SMALL_WIDTH}.webp`;

  // sharp() with failOn "none" tolerates slightly corrupt JPEGs.
  const meta = await sharp(path, { failOn: "none" }).rotate().toBuffer({ resolveWithObject: true });
  const { width, height } = meta.info;
  const srcSize = (await stat(path)).size;

  // Main WebP
  if (await isStale(path, out)) {
    await sharp(path, { failOn: "none" })
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(out);
    generated++;
  }
  const webpSize = (await stat(out)).size;
  let useWebp = webpSize < srcSize;
  if (!useWebp) {
    // Not worth it. Remove only when nothing refers to it directly by name.
    if (!(await referencedInSrc(parse(out).base))) await unlink(out);
    else useWebp = true;
  }

  const entry = { width, height, webp: null, webpWidth: 0, variants: [] };
  if (useWebp) {
    const wm = await sharp(out).metadata();
    entry.webp = rel(out);
    entry.webpWidth = wm.width;

    if (width > SMALL_THRESHOLD) {
      if (await isStale(path, small)) {
        await sharp(path, { failOn: "none" })
          .rotate()
          .resize({ width: SMALL_WIDTH, withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 5 })
          .toFile(small);
        generated++;
      }
      entry.variants.push({ src: rel(small), width: SMALL_WIDTH });
    } else if (await exists(small)) {
      await unlink(small);
    }
    kept++;
  } else if (await exists(small)) {
    await unlink(small);
  }
  manifest[rel(path)] = entry;
}

// WebP-only assets: record dimensions so <Picture> can set width/height.
for (const path of all) {
  if (parse(path).ext.toLowerCase() !== ".webp") continue;
  const base = path.slice(0, -5);
  if (sourceBases.has(base)) continue; // generated output
  if (/-640$/.test(base) && sourceBases.has(base.slice(0, -4))) continue;
  const m = await sharp(path).metadata();
  manifest[rel(path)] = {
    width: m.width,
    height: m.height,
    webp: rel(path),
    webpWidth: m.width,
    variants: [],
  };
}

const sorted = Object.fromEntries(
  Object.keys(manifest)
    .sort()
    .map((k) => [k, manifest[k]]),
);
await mkdir(dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");

console.log(
  `Images: ${sources.length} sources, ${generated} outputs (re)generated, ${kept} with WebP. Manifest: ${Object.keys(sorted).length} entries.`,
);
