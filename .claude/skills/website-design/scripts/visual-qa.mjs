#!/usr/bin/env node
// Visual QA for the website-design skill.
// Captures screenshots at standard viewports and runs objective checks
// (overflow, console/runtime errors, failed requests, broken images, missing alt,
// small text, small tap targets, content stuck invisible after scrolling,
// focus visibility, optional axe-core, optional reduced-motion pass).
//
// Usage:
//   node visual-qa.mjs --url http://localhost:3000 [--paths /,/about] [--out ./qa]
//                      [--widths 390,768,1440] [--full] [--reduced] [--axe]
//                      [--wait 800] [--chromium /path/to/chrome] [--no-scroll]
//                      [--ignore "googletagmanager|ERR_TUNNEL"]
//
// Playwright is resolved from the current project, then from the global npm root.
// Exit code is 0 unless the script itself fails; read the report for findings.

import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const args = parseArgs(process.argv.slice(2));
if (!args.url) {
  console.error("Missing --url. Example: node visual-qa.mjs --url http://localhost:3000 --paths /,/work");
  process.exit(2);
}

const VIEWPORTS = {
  390: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  360: { width: 360, height: 740, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  768: { width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  1024: { width: 1024, height: 768, deviceScaleFactor: 1 },
  1440: { width: 1440, height: 900, deviceScaleFactor: 1 },
  1920: { width: 1920, height: 1080, deviceScaleFactor: 1 },
};
const widths = (args.widths || "390,768,1440").split(",").map((w) => parseInt(w, 10));
const paths = (args.paths || "/").split(",").map((p) => p.trim()).filter(Boolean);
const outDir = path.resolve(args.out || "qa-output");
const waitMs = parseInt(args.wait || "800", 10);
// --ignore <regex>: drop matching failed requests / console errors (e.g. analytics hosts blocked in a sandbox).
const ignoreRe = args.ignore ? new RegExp(args.ignore) : null;
mkdirSync(outDir, { recursive: true });

const { chromium } = await loadPlaywright();
const AxeBuilder = args.axe ? await loadOptional("@axe-core/playwright") : null;
if (args.axe && !AxeBuilder) console.warn("[visual-qa] --axe requested but @axe-core/playwright is not installed; skipping axe.");

const launchOpts = { headless: true };
const exe = args.chromium || process.env.CHROME_PATH;
if (exe) launchOpts.executablePath = exe;
const browser = await chromium.launch(launchOpts);

const report = { url: args.url, date: new Date().toISOString(), outDir, runs: [] };
const modes = args.reduced ? ["no-preference", "reduce"] : ["no-preference"];

for (const p of paths) {
  for (const w of widths) {
    for (const motion of modes) {
      const run = await auditPage(new URL(p, args.url).toString(), w, motion);
      report.runs.push(run);
      const flag = run.issues.length ? `${run.issues.length} issue(s)` : "clean";
      console.log(`[visual-qa] ${p} @${w}${motion === "reduce" ? " (reduced motion)" : ""}: ${flag}`);
    }
  }
}
await browser.close();

writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
writeFileSync(path.join(outDir, "report.md"), toMarkdown(report));
console.log(`[visual-qa] Report: ${path.join(outDir, "report.md")}`);

// ---------------------------------------------------------------------------

async function auditPage(url, width, motion) {
  const vp = VIEWPORTS[width] || { width, height: Math.round(width * 0.625) };
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor || 1,
    isMobile: !!vp.isMobile,
    hasTouch: !!vp.hasTouch,
    reducedMotion: motion,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  const bytesByType = {};
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300));
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${String(e.message || e).slice(0, 300)}`));
  page.on("requestfailed", (r) => failedRequests.push(`${r.failure()?.errorText || "failed"} ${r.url()}`));
  page.on("response", async (r) => {
    if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`);
    const type = r.request().resourceType();
    const len = parseInt(r.headers()["content-length"] || "0", 10);
    bytesByType[type] = (bytesByType[type] || 0) + (Number.isFinite(len) ? len : 0);
  });

  const slug = `${slugify(new URL(url).pathname)}-${width}${motion === "reduce" ? "-reduced" : ""}`;
  const run = { url, width, motion, screenshots: {}, issues: [], metrics: {} };

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch {
    await page.goto(url, { waitUntil: "load", timeout: 30000 }).catch((e) => run.issues.push(`navigation failed: ${e.message}`));
  }
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.waitForTimeout(waitMs);

  const first = path.join(outDir, `${slug}-viewport.png`);
  await page.screenshot({ path: first });
  run.screenshots.viewport = path.relative(outDir, first);

  if (!args["no-scroll"]) {
    // Scroll through to trigger in-view animations and lazy media, then return.
    await page.evaluate(async () => {
      const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
    });
    await page.waitForTimeout(600);
  }

  run.metrics = await page.evaluate(collectMetrics);

  if (args.full) {
    const full = path.join(outDir, `${slug}-full.png`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: full, fullPage: true });
    run.screenshots.full = path.relative(outDir, full);
  }

  run.metrics.focus = await checkFocus(page);

  if (AxeBuilder) {
    try {
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      run.metrics.axe = res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }));
    } catch (e) {
      run.metrics.axe = `axe failed: ${e.message}`;
    }
  }

  const keep = (t) => !ignoreRe || !ignoreRe.test(t);
  run.metrics.consoleErrors = consoleErrors.filter(keep);
  run.metrics.failedRequests = [...new Set(failedRequests)].filter(keep);
  run.metrics.ignored = ignoreRe ? [...consoleErrors, ...failedRequests].filter((t) => !keep(t)).length : 0;
  run.metrics.transferBytesByType = bytesByType;
  run.issues = deriveIssues(run.metrics, motion);
  await context.close();
  return run;
}

// Runs in the page.
function collectMetrics() {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const clippedByAncestor = (el) => {
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (/(hidden|clip|auto|scroll)/.test(s.overflowX)) return true;
    }
    return false;
  };
  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 80);
  };

  const all = [...document.body.querySelectorAll("*")];
  const overflowing = [];
  for (const el of all) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if ((r.right > vw + 1 || r.left < -1) && !clippedByAncestor(el) && getComputedStyle(el).position !== "fixed") {
      overflowing.push(`${describe(el)} [${Math.round(r.left)}..${Math.round(r.right)}]`);
    }
  }

  const imgs = [...document.images];
  const textEls = all.filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1));
  const smallText = textEls.filter((el) => visible(el) && parseFloat(getComputedStyle(el).fontSize) < 12).map(describe);

  // Content that is still invisible after scrolling through: likely stuck entrance animations.
  const invisibleText = textEls
    .filter((el) => {
      if (!visible(el)) return false;
      let o = 1;
      for (let a = el; a && a !== document.documentElement; a = a.parentElement) o *= parseFloat(getComputedStyle(a).opacity);
      return o < 0.05 && !el.closest("[aria-hidden='true']");
    })
    .map(describe);

  const interactive = [...document.querySelectorAll("a[href], button, input, select, textarea, [role='button'], [tabindex]:not([tabindex='-1'])")].filter(visible);
  const smallTargets = interactive
    .filter((el) => {
      const r = el.getBoundingClientRect();
      const inline = getComputedStyle(el).display === "inline" && el.closest("p, li");
      return !inline && (r.width < 24 || r.height < 24);
    })
    .map((el) => `${describe(el)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);

  const unlabeled = [...document.querySelectorAll("input:not([type='hidden']), select, textarea")]
    .filter((el) => visible(el) && !el.labels?.length && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby"))
    .map(describe);
  const emptyButtons = [...document.querySelectorAll("a[href], button")]
    .filter((el) => visible(el) && !el.textContent.trim() && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") && !el.querySelector("img[alt]:not([alt=''])"))
    .map(describe);

  return {
    viewport: { width: vw, height: vh },
    lang: document.documentElement.lang || null,
    dir: document.documentElement.dir || getComputedStyle(document.documentElement).direction,
    title: document.title,
    h1Count: document.querySelectorAll("h1").length,
    horizontalOverflowPx: Math.max(0, document.documentElement.scrollWidth - vw),
    overflowingElements: overflowing.slice(0, 15),
    pageHeight: document.documentElement.scrollHeight,
    images: imgs.length,
    brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.src).map((i) => i.currentSrc || i.src).slice(0, 10),
    imagesMissingAlt: imgs.filter((i) => !i.hasAttribute("alt")).map((i) => i.currentSrc || i.src).slice(0, 10),
    smallText: [...new Set(smallText)].slice(0, 10),
    invisibleTextAfterScroll: [...new Set(invisibleText)].slice(0, 15),
    smallTapTargets: smallTargets.slice(0, 15),
    unlabeledFields: unlabeled,
    emptyLinksOrButtons: emptyButtons.slice(0, 10),
    fontsLoaded: document.fonts ? [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight}`).slice(0, 20) : [],
    // next/font and similar tools register "<Family> Fallback" faces that point at local() system fonts;
    // their "error" status is expected and not a loading failure.
    fontsFailed: document.fonts ? [...document.fonts].filter((f) => f.status === "error" && !/fallback/i.test(f.family)).map((f) => f.family) : [],
  };
}

async function checkFocus(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const results = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      if (el.tagName.toLowerCase() === "nextjs-portal") return { el: "nextjs-portal (dev overlay)", visibleIndicator: true, onScreen: true, devOverlay: true };
      const s = getComputedStyle(el);
      const hasOutline = s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0;
      const hasShadow = s.boxShadow && s.boxShadow !== "none";
      const r = el.getBoundingClientRect();
      return {
        el: `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}"`,
        visibleIndicator: hasOutline || hasShadow,
        onScreen: r.bottom > 0 && r.top < window.innerHeight && r.width > 0,
      };
    });
    if (!info) break;
    results.push(info);
  }
  return results;
}

function deriveIssues(m, motion) {
  const issues = [];
  if (m.horizontalOverflowPx > 0) issues.push(`HIGH horizontal scroll: page is ${m.horizontalOverflowPx}px wider than viewport`);
  if (m.overflowingElements?.length) issues.push(`MED elements extend past viewport: ${m.overflowingElements.slice(0, 5).join("; ")}`);
  if (m.consoleErrors?.length) issues.push(`HIGH console/runtime errors (${m.consoleErrors.length}): ${m.consoleErrors.slice(0, 3).join(" | ")}`);
  if (m.failedRequests?.length) issues.push(`HIGH failed requests (${m.failedRequests.length}): ${m.failedRequests.slice(0, 3).join(" | ")}`);
  if (m.brokenImages?.length) issues.push(`HIGH broken images: ${m.brokenImages.join(", ")}`);
  if (m.fontsFailed?.length) issues.push(`MED fonts failed to load: ${m.fontsFailed.join(", ")}`);
  if (m.imagesMissingAlt?.length) issues.push(`MED images without alt attribute: ${m.imagesMissingAlt.length}`);
  if (m.h1Count !== 1) issues.push(`MED h1 count is ${m.h1Count} (expected 1)`);
  if (!m.lang) issues.push(`MED <html> has no lang attribute`);
  if (m.invisibleTextAfterScroll?.length)
    issues.push(`${motion === "reduce" ? "HIGH" : "MED"} text still invisible after scrolling${motion === "reduce" ? " with reduced motion" : ""}: ${m.invisibleTextAfterScroll.slice(0, 5).join("; ")}`);
  if (m.smallText?.length) issues.push(`LOW text under 12px: ${m.smallText.slice(0, 5).join("; ")}`);
  if (m.smallTapTargets?.length) issues.push(`MED tap targets under 24px: ${m.smallTapTargets.slice(0, 5).join("; ")}`);
  if (m.unlabeledFields?.length) issues.push(`HIGH form fields without labels: ${m.unlabeledFields.join("; ")}`);
  if (m.emptyLinksOrButtons?.length) issues.push(`HIGH links/buttons without accessible name: ${m.emptyLinksOrButtons.join("; ")}`);
  if (m.ignored) issues.push(`INFO ${m.ignored} console error(s)/request(s) ignored by --ignore`);
  const noRing = (m.focus || []).filter((f) => !f.visibleIndicator);
  if (noRing.length) issues.push(`MED focused elements without visible outline/box-shadow (check for other focus styling): ${noRing.map((f) => f.el).slice(0, 4).join("; ")}`);
  if (Array.isArray(m.axe)) {
    const serious = m.axe.filter((v) => v.impact === "critical" || v.impact === "serious");
    if (serious.length) issues.push(`HIGH axe serious/critical: ${serious.map((v) => `${v.id}(${v.nodes})`).join(", ")}`);
  }
  return issues;
}

function toMarkdown(r) {
  const lines = [`# Visual QA report`, ``, `- URL: ${r.url}`, `- Date: ${r.date}`, `- Output: ${r.outDir}`, ``];
  for (const run of r.runs) {
    lines.push(`## ${new URL(run.url).pathname} @ ${run.width}px${run.motion === "reduce" ? " — reduced motion" : ""}`);
    lines.push(``, `Screenshots: ${Object.values(run.screenshots).join(", ")}`);
    lines.push(`Title: ${run.metrics.title || "(none)"} · lang=${run.metrics.lang} · dir=${run.metrics.dir} · height=${run.metrics.pageHeight}px`);
    lines.push(``, run.issues.length ? run.issues.map((i) => `- ${i}`).join("\n") : `- No automated issues found.`);
    if (Array.isArray(run.metrics.axe) && run.metrics.axe.length)
      lines.push(``, `axe: ${run.metrics.axe.map((v) => `${v.id} [${v.impact}] ×${v.nodes}`).join(", ")}`);
    lines.push(``);
  }
  lines.push(`> Automated checks are a floor, not a verdict. Review every screenshot visually and test interactions by hand or with scripted Playwright steps.`);
  return lines.join("\n");
}

async function loadPlaywright() {
  const mod = (await loadOptional("playwright")) || (await loadOptional("@playwright/test"));
  if (!mod) {
    console.error("[visual-qa] Playwright not found. Install it in the project (npm i -D playwright) or globally (npm i -g playwright).");
    process.exit(2);
  }
  return mod.chromium ? mod : mod.default;
}

async function loadOptional(name) {
  const roots = [process.cwd()];
  try {
    roots.push(execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim());
  } catch {}
  for (const root of roots) {
    try {
      const req = createRequire(path.join(root, existsSync(path.join(root, "package.json")) ? "package.json" : "noop.js"));
      const resolved = root === process.cwd() ? req.resolve(name) : createRequire(path.join(root, name, "package.json")).resolve(name);
      const mod = await import(pathToFileURL(resolved).href);
      if (name === "@axe-core/playwright") return mod.default?.default || mod.default || mod.AxeBuilder;
      return mod;
    } catch {}
  }
  return null;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function slugify(p) {
  return (p.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-") || "home").toLowerCase();
}
