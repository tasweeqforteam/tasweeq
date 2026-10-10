// Playwright assertions for references/motion-recipes.md (R1–R13).
// Usage: npm i && npm run dev &  then  node test-recipes.mjs [screenshotDir]
// Resolves Playwright from this folder or the global npm root.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import path from 'node:path';

function loadPlaywright() {
  for (const base of [process.cwd() + '/package.json', execSync('npm root -g').toString().trim() + '/playwright/package.json']) {
    try { return createRequire(base)('playwright'); } catch {}
  }
  throw new Error('Playwright not found (npm i -D playwright, or install globally)');
}
const { chromium } = loadPlaywright();
const URL_ = process.env.URL || 'http://localhost:5190/';
const out = process.argv[2] || '.';
const results = [];
const check = (id, mode, ok, detail) => results.push({ id, mode, ok: !!ok, detail });
const browser = await chromium.launch();

for (const mode of ['no-preference', 'reduce']) {
  const motion = mode === 'no-preference';
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: mode });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push('pageerror ' + e.message));
  await page.goto(URL_, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // R3 SplitText: masks exist only with motion; Arabic split into words, never single chars; text intact
  const clipWrappers = await page.$$eval('#r3-en div', (n) => n.filter((d) => getComputedStyle(d).overflow === 'clip').length);
  check('R3 line masks', mode, motion ? clipWrappers >= 1 : clipWrappers === 0, `clip wrappers=${clipWrappers}`);
  const arWords = await page.$$eval('#r3-ar div', (n) => n.length);
  const arChars = await page.$$eval('#r3-ar div', (n) => n.filter((x) => x.children.length === 0 && x.textContent.trim().length === 1).length);
  check('R3 Arabic split by words only', mode, motion ? arWords > 0 && arChars === 0 : arWords === 0, `wrappers=${arWords} singleChars=${arChars}`);
  const label = await page.$eval('#r3-en', (el) => el.getAttribute('aria-label') || el.textContent.trim());
  check('R3 accessible text intact', mode, label.startsWith('Line masks reveal'), label.slice(0, 40));

  // R8 magnetic (fine pointer + motion only)
  const bb = await (await page.$('#r8')).boundingBox();
  await page.mouse.move(bb.x + bb.width - 2, bb.y + 2, { steps: 4 }); await page.waitForTimeout(100);
  const mag = await page.$eval('#r8', (el) => el.style.transform);
  check('R8 magnetic', mode, motion ? mag.startsWith('translate') : mag === '', mag || '(none)');

  // R12 velocity axis
  await page.mouse.move(200, 200); await page.mouse.move(1200, 700, { steps: 3 }); await page.waitForTimeout(80);
  const wght = await page.$eval('#r12', (el) => el.style.getPropertyValue('--wght'));
  check('R12 velocity → wght', mode, motion ? Number(wght) < 900 : wght === '', `--wght=${wght || '(unset)'}`);

  // R10 Lenis only with motion
  const lenis = await page.evaluate(() => document.documentElement.classList.contains('lenis'));
  check('R10 Lenis', mode, motion ? lenis : !lenis, `html.lenis=${lenis}`);

  // R4 sticky story — scroll from the top through the story section first
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(80); }
  await page.waitForTimeout(800);
  const steps = await page.evaluate(() => window.__r.setActive.map((s) => s.join(':')));
  check('R4 story steps activate', mode, steps.length >= 2 && steps.every((s) => s.endsWith(String(motion))), steps.join(' '));

  // R5 horizontal gallery: moves only with motion on desktop
  const xs = [];
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 300); await page.waitForTimeout(60);
    xs.push(await page.$eval('.hgallery-track', (el) => Math.round(new DOMMatrix(getComputedStyle(el).transform).m41)));
  }
  check('R5 horizontal pin (LTR moves left)', mode, motion ? Math.min(...xs) < -500 : Math.min(...xs) === 0, `min x=${Math.min(...xs)}`);

  // R1 + R13 after scrolling: visible / unclipped
  const r1 = await page.$eval('#r1', (el) => getComputedStyle(el).opacity);
  check('R1 reveal ends visible', mode, r1 === '1', `opacity=${r1}`);
  for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(60); }
  await page.waitForTimeout(1200);
  const clip = await page.$eval('#r13', (el) => getComputedStyle(el).clipPath);
  check('R13 wipe ends unclipped', mode, clip === 'none' || /inset\(0(px)?( 0(px|%)?)*\)/.test(clip), clip);
  const items = await page.$$eval('#r6 .item', (n) => n.map((x) => getComputedStyle(x).opacity));
  check('R6 useGSAP items visible', mode, items.every((o) => o === '1'), items.join(','));

  // R2 progress (scroll-driven CSS) — only meaningful where supported
  const supported = await page.evaluate(() => CSS.supports('animation-timeline: scroll()'));
  const prog = await page.$eval('#r2-progress', (el) => getComputedStyle(el).transform);
  check('R2 scroll progress', mode, !supported || (motion ? prog !== 'matrix(0, 0, 0, 1, 0, 0)' : true), `supported=${supported} transform=${prog}`);

  // R7 menu presence
  await page.click('#r7'); await page.waitForTimeout(400);
  const open = await page.$$eval('#r7-menu', (n) => n.length);
  await page.click('#r7'); await page.waitForTimeout(500);
  const closed = await page.$$eval('#r7-menu', (n) => n.length);
  check('R7 AnimatePresence open/close', mode, open === 1 && closed === 0, `open=${open} closed=${closed}`);

  // R9 view transition updates DOM
  const before = await page.$eval('#r9-list', (el) => el.innerText.replace(/\s+/g, ','));
  await page.click('#r9'); await page.waitForTimeout(600);
  const after = await page.$eval('#r9-list', (el) => el.innerText.replace(/\s+/g, ','));
  check('R9 view transition update', mode, before !== after, `${before} → ${after}`);

  // R11 R3F canvas; animates only with motion
  const canvas = await page.$$eval('#r11 canvas', (n) => n.length);
  const anim = await page.$eval('#r11', (el) => el.dataset.animate);
  check('R11 R3F canvas + motion flag', mode, canvas === 1 && anim === String(motion), `canvas=${canvas} animate=${anim}`);

  check('no console errors', mode, errors.length === 0, errors.join(' | ').slice(0, 200));
  await page.screenshot({ path: path.join(out, `recipes-${mode}.png`) });
  await ctx.close();
}

// RTL: R5 must move the other way
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL_ + '?rtl', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const xs = [];
  for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(60); xs.push(await page.$eval('.hgallery-track', (el) => Math.round(new DOMMatrix(getComputedStyle(el).transform).m41))); }
  check('R5 horizontal pin (RTL moves right)', 'rtl', Math.max(...xs) > 500, `max x=${Math.max(...xs)}`);
  await ctx.close();
}
await browser.close();

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  [${r.mode}] ${r.id} — ${r.detail}`);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
