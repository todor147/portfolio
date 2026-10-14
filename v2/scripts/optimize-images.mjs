#!/usr/bin/env node
/**
 * Generate responsive WebP variants for every JPG/PNG in public/assets/
 * (recursive) and write src/data/image-manifest.json for <Picture>.
 *
 * Per source image:
 *   - <name>.webp      longest edge <= 2000 px, q78
 *   - <name>-160.webp  160 px wide, only when the source is wider than 320 px (tall thumbnails)
 *   - <name>-320.webp  320 px wide, only when the source is wider than 480 px
 *   - <name>-512.webp  512 px wide, only when the source is wider than 640 px
 *   - <name>-720.webp  720 px wide, only when the source is wider than 900 px
 *   - If the main WebP would be larger than the source (tiny PNG icons) it is
 *     not kept; the manifest records `webp: null` and the original is served.
 *
 * WebP-only files (no JPG/PNG sibling) are listed in the manifest with their
 * dimensions so <Picture> can emit width/height for them, and get the same
 * -160/-320/-512/-720 variants generated from the WebP itself.
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
// Responsive variants: [width, emitted only when the source is wider than threshold]
const VARIANTS = [
  { width: 160, threshold: 320 },
  { width: 320, threshold: 480 },
  { width: 512, threshold: 640 },
  { width: 720, threshold: 900 },
];
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

const LEGACY_WIDTHS = [480, 640];

/** Generated variant files (absolute-ish paths as produced by walk()). */
const variantPaths = new Set();

/**
 * Emit (or, when `emit` is false / not applicable, remove) the -<w>.webp
 * variants of `source`, pushing the kept ones into `out`.
 */
async function makeVariants(source, base, width, out, emit = true) {
  // Variants from earlier widths (480/640) are removed.
  for (const w of LEGACY_WIDTHS) {
    const file = `${base}-${w}.webp`;
    if (await exists(file)) await unlink(file);
  }
  for (const { width: w, threshold } of VARIANTS) {
    const file = `${base}-${w}.webp`;
    if (emit && width > threshold) {
      variantPaths.add(file);
      if (await isStale(source, file)) {
        await sharp(source, { failOn: "none" })
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 5 })
          .toFile(file);
        generated++;
      }
      out.push({ src: rel(file), width: w });
    } else if (await exists(file) && !variantPaths.has(file)) {
      await unlink(file);
    }
  }
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

    await makeVariants(path, base, width, entry.variants);
    kept++;
  } else {
    await makeVariants(path, base, width, entry.variants, false);
  }
  manifest[rel(path)] = entry;
}

// WebP-only assets: record dimensions so <Picture> can set width/height, and
// derive the -320/-512/-720 variants from the WebP itself.
const webpOnly = all.filter((p) => {
  if (parse(p).ext.toLowerCase() !== ".webp") return false;
  const base = p.slice(0, -5);
  return !sourceBases.has(base);
});
// Variant files left from a previous run must not be mistaken for sources.
const isVariantOfKnown = (base) => {
  const m = /^(.*)-(160|320|512|720|480|640)$/.exec(base);
  return !!m && (sourceBases.has(m[1]) || webpOnly.some((q) => q.slice(0, -5) === m[1]));
};
for (const path of webpOnly) {
  const base = path.slice(0, -5);
  if (isVariantOfKnown(base)) continue; // generated output
  const m = await sharp(path).metadata();
  const variants = [];
  await makeVariants(path, base, m.width, variants);
  manifest[rel(path)] = {
    width: m.width,
    height: m.height,
    webp: rel(path),
    webpWidth: m.width,
    variants,
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
