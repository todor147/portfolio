// Post-build validator for dist/.
// Usage (from v2/, after `npm run build`):  node scripts/check-dist.mjs [distDir]
// Errors exit 1: broken internal refs, spaces in srcset URLs, page links without
// trailing slash, EXIF GPS in images, bad JSON-LD, forbidden sitemap URLs.
// Warnings (exit 0): long <title>/meta description, missing meta description.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, relative, extname, sep } from 'node:path';

const dist = resolve(process.argv[2] || 'dist');
if (!existsSync(dist)) {
  console.error(`dist not found: ${dist}`);
  process.exit(1);
}

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};
const files = walk(dist);
const rel = (p) => relative(dist, p).split(sep).join('/');
const htmlFiles = files.filter((f) => f.endsWith('.html'));

const results = {};
const add = (check, level, msg) => {
  (results[check] ??= { level, items: [] }).items.push(msg);
};

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decodeEntities = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (m, g) => {
    const l = g.toLowerCase();
    if (l[0] === '#') return String.fromCodePoint(l[1] === 'x' ? parseInt(l.slice(2), 16) : parseInt(l.slice(1), 10));
    return ENTITIES[l];
  });

const fileSet = new Set(files.map(rel));
const resolves = (urlPath) => {
  let p;
  try {
    p = decodeURIComponent(urlPath);
  } catch {
    p = urlPath;
  }
  p = p.replace(/^\/+/, '');
  if (p === '') return fileSet.has('index.html');
  if (p.endsWith('/')) return fileSet.has(p + 'index.html');
  return fileSet.has(p) || fileSet.has(p + '/index.html') || fileSet.has(p + '.html');
};
const isExternal = (u) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(u);

for (const f of htmlFiles) {
  const page = rel(f);
  const html = readFileSync(f, 'utf8');

  // references
  const tagRe = /<(\w+)\b([^>]*)>/g;
  let tm;
  while ((tm = tagRe.exec(html))) {
    const tag = tm[1].toLowerCase();
    const attrRe = /\b(href|src|srcset|poster|data-src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
    let am;
    while ((am = attrRe.exec(tm[2]))) {
      const name = am[1].toLowerCase();
      const raw = decodeEntities(am[2] ?? am[3] ?? '');
      let urls = [];
      if (name === 'srcset') {
        for (const cand of raw.split(/,\s+/)) {
          const t = cand.trim();
          if (!t) continue;
          if (/\s/.test(t.replace(/\s+\d+(?:\.\d+)?[wx]$/, ''))) add('srcset spaces', 'error', `${page}: ${t}`);
          urls.push(t.split(/\s+/)[0]);
        }
      } else urls = [raw.trim()];
      for (const u of urls) {
        if (!u || u.startsWith('#') || isExternal(u) || u.startsWith('data:')) continue;
        if (!u.startsWith('/')) continue;
        const path = u.split('#')[0].split('?')[0];
        if (!resolves(path)) add('broken refs', 'error', `${page}: ${u}`);
        if (tag === 'a' && name === 'href' && path !== '' && !path.endsWith('/') && !extname(path)) {
          add('no trailing slash', 'error', `${page}: ${u}`);
        }
      }
    }
  }

  // JSON-LD
  const ldRe = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let lm;
  while ((lm = ldRe.exec(html))) {
    try {
      JSON.parse(lm[1]);
    } catch (e) {
      add('bad JSON-LD', 'error', `${page}: ${e.message}`);
    }
  }

  // SEO warnings
  const tt = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (tt) {
    const title = decodeEntities(tt[1]).trim();
    if (title.length > 60) add('title > 60', 'warn', `${page}: (${title.length}) ${title}`);
  }
  const md = /<meta\b[^>]*\bname\s*=\s*["']description["'][^>]*>/i.exec(html);
  const c = md && /\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(md[0]);
  const d = c ? decodeEntities(c[1] ?? c[2] ?? '').trim() : '';
  if (!d) add('missing meta description', 'warn', page);
  else if (d.length > 160) add('meta description > 160', 'warn', `${page}: (${d.length})`);
}

// EXIF GPS: look for GPS IFD pointer (tag 0x8825) in IFD0 of the EXIF block.
const tiffGps = (t) => {
  if (t.length < 8) return false;
  const order = t.toString('latin1', 0, 2);
  const le = order === 'II';
  if (!le && order !== 'MM') return false;
  const u16 = (o) => (le ? t.readUInt16LE(o) : t.readUInt16BE(o));
  const u32 = (o) => (le ? t.readUInt32LE(o) : t.readUInt32BE(o));
  try {
    const ifd = u32(4);
    const n = u16(ifd);
    for (let i = 0; i < n; i++) if (u16(ifd + 2 + i * 12) === 0x8825) return true;
  } catch {
    /* truncated */
  }
  return false;
};
const stripExifHeader = (b) => (b.toString('latin1', 0, 6) === 'Exif\0\0' ? b.subarray(6) : b);
const hasGps = (buf) => {
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let o = 2;
    while (o + 4 < buf.length && buf[o] === 0xff) {
      const m = buf[o + 1];
      if (m === 0xda || m === 0xd9) break;
      const len = buf.readUInt16BE(o + 2);
      if (m === 0xe1 && buf.toString('latin1', o + 4, o + 10) === 'Exif\0\0' && tiffGps(buf.subarray(o + 10, o + 2 + len))) return true;
      o += 2 + len;
    }
    return false;
  }
  if (buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP') {
    let o = 12;
    while (o + 8 <= buf.length) {
      const id = buf.toString('latin1', o, o + 4);
      const len = buf.readUInt32LE(o + 4);
      if (id === 'EXIF' && tiffGps(stripExifHeader(buf.subarray(o + 8, o + 8 + len)))) return true;
      o += 8 + len + (len & 1);
    }
    return false;
  }
  if (buf[0] === 0x89 && buf.toString('latin1', 1, 4) === 'PNG') {
    let o = 8;
    while (o + 12 <= buf.length) {
      const len = buf.readUInt32BE(o);
      const id = buf.toString('latin1', o + 4, o + 8);
      if (id === 'eXIf' && tiffGps(buf.subarray(o + 8, o + 8 + len))) return true;
      if (id === 'IEND') break;
      o += 12 + len;
    }
  }
  return false;
};
let imagesScanned = 0;
for (const f of files) {
  const r = rel(f);
  if (!r.startsWith('assets/') || !/\.(jpe?g|png|webp)$/i.test(r)) continue;
  imagesScanned++;
  try {
    if (hasGps(readFileSync(f))) add('EXIF GPS', 'error', r);
  } catch (e) {
    add('EXIF GPS', 'error', `${r}: unreadable (${e.message})`);
  }
}

// Sitemap
const sitemaps = files.filter((f) => /sitemap[^/\\]*\.xml$/i.test(f));
if (!sitemaps.length) add('sitemap missing', 'warn', 'no sitemap*.xml found');
for (const f of sitemaps) {
  const xml = readFileSync(f, 'utf8');
  for (const m of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
    let p = m[1];
    try {
      p = new URL(m[1]).pathname;
    } catch {
      /* keep raw */
    }
    if (/\/(design|contact\/success|404)(\/|\.html|$)/.test(p)) add('sitemap forbidden', 'error', `${rel(f)}: ${m[1]}`);
  }
}

// Report
const order = [
  ['broken refs', 'error'],
  ['srcset spaces', 'error'],
  ['no trailing slash', 'error'],
  ['EXIF GPS', 'error'],
  ['bad JSON-LD', 'error'],
  ['sitemap forbidden', 'error'],
  ['title > 60', 'warn'],
  ['meta description > 160', 'warn'],
  ['missing meta description', 'warn'],
  ['sitemap missing', 'warn'],
];
console.log(`check-dist: ${htmlFiles.length} pages, ${imagesScanned} images, ${sitemaps.length} sitemap file(s) in ${dist}`);
let errors = 0;
let warns = 0;
for (const [k, lvl] of order) {
  const r = results[k];
  const n = r ? r.items.length : 0;
  if (lvl === 'error') errors += n;
  else warns += n;
  console.log(`  ${n ? (lvl === 'error' ? 'FAIL' : 'WARN') : ' ok '}  ${k}: ${n}`);
  if (r) {
    r.items.slice(0, 20).forEach((i) => console.log(`        - ${i}`));
    if (n > 20) console.log(`        ... and ${n - 20} more`);
  }
}
console.log(`\n${errors} error(s), ${warns} warning(s)`);
process.exit(errors ? 1 : 0);
