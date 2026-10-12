#!/usr/bin/env node
/**
 * One-off originals normaliser (NOT part of the build).
 *
 * For every JPEG under public/assets/ that carries EXIF metadata (GPS,
 * timestamps, device info) or is larger than 2400 px on its longest edge:
 * bake in the EXIF rotation, downscale to <= 2400 px (never enlarging),
 * re-encode with mozjpeg q85 and no metadata, overwriting in place.
 * PNGs are only re-encoded when they contain EXIF.
 *
 * Run with:  node scripts/normalize-originals.mjs
 */
import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";

const TARGET_DIR = "public/assets";
const MAX_EDGE = 2400;

let before = 0;
let after = 0;
let changed = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    const ext = parse(entry.name).ext.toLowerCase();
    const isJpeg = ext === ".jpg" || ext === ".jpeg";
    if (!isJpeg && ext !== ".png") continue;

    const buf = await readFile(path);
    const meta = await sharp(buf, { failOn: "none" }).metadata();
    const hasExif = Boolean(meta.exif);
    const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
    const needs = isJpeg ? hasExif || longest > MAX_EDGE : hasExif;
    if (!needs) continue;

    let pipeline = sharp(buf, { failOn: "none" }).rotate();
    if (longest > MAX_EDGE) {
      pipeline = pipeline.resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    pipeline = isJpeg
      ? pipeline.jpeg({ quality: 85, mozjpeg: true })
      : pipeline.png({ compressionLevel: 9 });
    const out = await pipeline.toBuffer();
    await writeFile(path, out);
    before += buf.length;
    after += out.length;
    changed++;
    console.log(
      `  ${path.padEnd(48)} ${(buf.length / 1024).toFixed(0).padStart(6)} KB -> ${(out.length / 1024).toFixed(0).padStart(6)} KB`,
    );
  }
}

await walk(TARGET_DIR);
console.log(
  `\n${changed} files rewritten: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`,
);
