// Shared headless-Chromium helpers for analyze/render.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

export const ENGINE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ORIGIN = 'http://lm.local';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.json': 'application/json', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json',
};
export const mimeFor = (p) => MIME[path.extname(p).toLowerCase()] || 'application/octet-stream';

// Virtual paths under /__lm/ map to engine assets so compositions never hard-code disk paths.
export function resolveVirtual(urlPath) {
  const p = decodeURIComponent(urlPath);
  if (p === '/__lm/lm-runtime.js') return path.join(ENGINE_DIR, 'runtime', 'lm-runtime.js');
  if (p.startsWith('/__lm/gsap/')) return path.join(ENGINE_DIR, 'node_modules', 'gsap', 'dist', p.slice('/__lm/gsap/'.length));
  if (p.startsWith('/__lm/runtime/')) return path.join(ENGINE_DIR, 'runtime', p.slice('/__lm/runtime/'.length));
  if (p.startsWith('/__lm/vendor/')) return path.join(ENGINE_DIR, 'node_modules', p.slice('/__lm/vendor/'.length));
  return null;
}

export function findChromium() {
  if (process.env.LM_CHROMIUM && fs.existsSync(process.env.LM_CHROMIUM)) return process.env.LM_CHROMIUM;
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, '/opt/pw-browsers', path.join(process.env.HOME || '', '.cache', 'ms-playwright')].filter(Boolean);
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const dirs = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]));
    for (const d of dirs) {
      for (const rel of ['chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-win/chrome.exe']) {
        const p = path.join(root, d, rel);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  for (const p of ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome']) if (fs.existsSync(p)) return p;
  return undefined; // let playwright try its default
}

export async function launch() {
  return chromium.launch({
    executablePath: findChromium(),
    args: ['--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb', '--hide-scrollbars',
      '--disable-gpu', '--disable-gpu-compositing', '--disable-partial-raster', '--disable-skia-runtime-opts', '--run-all-compositor-stages-before-draw', '--disable-threaded-animation', '--disable-threaded-scrolling', '--disable-checker-imaging'],
  });
}

// Create a page that serves `rootDir` at http://lm.local/ (plus /__lm/ virtual assets).
export async function openRooted(browser, rootDir, { width = 1280, height = 720, scale = 1 } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e && e.stack || e)));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[console.${m.type()}] ${m.text()}`); });
  await page.route(ORIGIN + '/**', async (route) => {
    const url = new URL(route.request().url());
    let file = resolveVirtual(url.pathname);
    if (!file) {
      file = path.join(rootDir, decodeURIComponent(url.pathname));
      if (!path.resolve(file).startsWith(path.resolve(rootDir))) return route.fulfill({ status: 403, body: 'forbidden' });
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return route.fulfill({ status: 404, body: 'not found: ' + url.pathname });
    return route.fulfill({ status: 200, contentType: mimeFor(file), body: fs.readFileSync(file) });
  });
  // Block anything not served locally so renders never depend on the network.
  await page.route(/^https?:\/\/(?!lm\.local)/, (route) => { errors.push('[blocked network] ' + route.request().url()); return route.abort(); });
  return { context, page, errors };
}

export function parseArgs(argv, defaults = {}) {
  const out = { _: [], ...defaults };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      if (v !== undefined) out[k] = v;
      else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) out[k] = argv[++i];
      else out[k] = true;
    } else out._.push(a);
  }
  return out;
}
