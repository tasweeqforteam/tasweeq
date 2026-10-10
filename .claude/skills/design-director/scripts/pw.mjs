// Shared Playwright/Chromium loader for render.mjs and qa.mjs.
// Resolves playwright from the project, then from the global npm root, and
// prefers the pre-installed Chromium when PLAYWRIGHT_BROWSERS_PATH is set.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

export function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    const root = execSync("npm root -g", { encoding: "utf8" }).trim();
    return require(path.join(root, "playwright"));
  }
}

export async function launch() {
  const { chromium } = loadPlaywright();
  const opts = { args: ["--font-render-hinting=none", "--disable-lcd-text"] };
  const pinned = "/opt/pw-browsers/chromium";
  try {
    return await chromium.launch(opts);
  } catch (err) {
    if (existsSync(pinned)) return chromium.launch({ ...opts, executablePath: pinned });
    throw err;
  }
}

export function toUrl(input) {
  return /^https?:|^file:/.test(input) ? input : pathToFileURL(path.resolve(input)).href;
}

// Canvas size comes from the first .canvas element's computed CSS size.
export async function openDesign(browser, input, scale = 1) {
  const page = await browser.newPage({ viewport: { width: 4000, height: 4000 }, deviceScaleFactor: scale });
  await page.goto(toUrl(input), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return page;
}
