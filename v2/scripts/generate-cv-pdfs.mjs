/**
 * Generate the downloadable CV PDFs from the live /cv/<variant>/ pages.
 *
 * Usage (not part of `build` — Netlify has no browser):
 *   1. npm run build && npm run preview     (serves http://127.0.0.1:4321)
 *   2. npm run cv:pdf                        (in another terminal)
 *
 * Env / args:
 *   CHROME_PATH   path to a Chromium-family browser (Chrome, Edge, Chromium)
 *   CV_BASE_URL   base URL of the running site (or pass it as the first arg)
 *                 default: http://127.0.0.1:4321
 *
 * Output: public/assets/Todor_Aleksandrov_CV_<Name>.pdf (commit the results).
 * The print layout comes from the `@media print` rules in src/styles/global.css.
 */
import { spawnSync } from "node:child_process";
import { existsSync, statSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Keep in sync with CV_PDFS / cvVariants in src/lib/cv.ts.
const VARIANTS = [
  { id: "general", file: "Todor_Aleksandrov_CV_General.pdf" },
  { id: "software", file: "Todor_Aleksandrov_CV_Software.pdf" },
  { id: "wine", file: "Todor_Aleksandrov_CV_Wine.pdf" },
  { id: "customer-service", file: "Todor_Aleksandrov_CV_Customer_Service.pdf" },
];

const MIN_BYTES = 10 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public", "assets");
const base = (process.argv[2] || process.env.CV_BASE_URL || "http://127.0.0.1:4321").replace(/\/+$/, "");

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/microsoft-edge",
].filter(Boolean);

const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error("No Chromium-family browser found. Set CHROME_PATH to chrome/edge/chromium.");
  process.exit(1);
}

// Fail early with a clear message if the site is not being served.
try {
  const res = await fetch(`${base}/cv/general/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
} catch (err) {
  console.error(`Cannot reach ${base}/cv/general/ (${err.message}). Run "npm run preview" first.`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
console.log(`Browser: ${browser}\nSite:    ${base}\n`);

let failed = 0;
for (const { id, file } of VARIANTS) {
  const out = resolve(outDir, file);
  const url = `${base}/cv/${id}/`;
  const r = spawnSync(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      "--virtual-time-budget=5000",
      `--print-to-pdf=${out}`,
      url,
    ],
    { stdio: "pipe", encoding: "utf8", timeout: 120000 },
  );
  const size = existsSync(out) ? statSync(out).size : 0;
  if (r.status !== 0 || size < MIN_BYTES) {
    failed++;
    console.error(`FAIL ${id}: exit ${r.status}, ${size} bytes\n${(r.stderr || "").trim().split("\n").slice(-3).join("\n")}`);
  } else {
    console.log(`OK   ${id.padEnd(17)} ${(size / 1024).toFixed(1)} KB  ${file}`);
  }
}

console.log(failed ? `\n${failed} of ${VARIANTS.length} failed.` : `\nAll ${VARIANTS.length} PDFs written to public/assets/.`);
process.exit(failed ? 1 : 0);
