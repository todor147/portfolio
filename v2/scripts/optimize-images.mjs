#!/usr/bin/env node
/**
 * Generate WebP variants alongside every JPG/PNG in public/assets/.
 *
 * Strategy:
 *   - For each .jpg/.jpeg/.png, emit a .webp at q80
 *   - Skip if the .webp already exists and is newer than source
 *   - Log savings
 *
 * Run with:  npm run optimize:images
 */
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const TARGET_DIR = "public/assets";
const EXTS = new Set([".jpg", ".jpeg", ".png"]);
const QUALITY = 80;

let processed = 0;
let skipped = 0;
let totalIn = 0;
let totalOut = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    const ext = parse(entry.name).ext.toLowerCase();
    if (!EXTS.has(ext)) continue;

    const out = path.slice(0, -ext.length) + ".webp";

    // Skip if up-to-date
    try {
      const [sIn, sOut] = await Promise.all([stat(path), stat(out)]);
      if (sOut.mtimeMs >= sIn.mtimeMs) {
        skipped++;
        continue;
      }
    } catch {
      // .webp doesn't exist yet
    }

    try {
      const inStat = await stat(path);
      await sharp(path)
        .rotate() // honour EXIF orientation
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(out);
      const outStat = await stat(out);
      totalIn += inStat.size;
      totalOut += outStat.size;
      processed++;
      const saved = Math.round((1 - outStat.size / inStat.size) * 100);
      console.log(
        `  ✓ ${entry.name.padEnd(40)} ${(inStat.size / 1024).toFixed(0).padStart(5)} KB → ${(
          outStat.size / 1024
        )
          .toFixed(0)
          .padStart(5)} KB  (-${saved}%)`,
      );
    } catch (e) {
      console.warn(`  ✗ ${entry.name}:`, e.message);
    }
  }
}

console.log(`\nOptimising images in ${TARGET_DIR}/ ...`);
await walk(TARGET_DIR);

if (processed > 0) {
  console.log(
    `\n  ${processed} files processed, ${skipped} skipped (up-to-date).\n  Total: ${(
      totalIn / 1024 / 1024
    ).toFixed(1)} MB → ${(totalOut / 1024 / 1024).toFixed(1)} MB  (-${Math.round(
      (1 - totalOut / totalIn) * 100,
    )}%)\n`,
  );
} else {
  console.log(`\n  All ${skipped} assets already optimised.\n`);
}
