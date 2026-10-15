#!/usr/bin/env node
// Motion capture for the website-design skill.
// Measures how a page actually moves, instead of guessing from a video:
//   1. Load phase  — samples every frame for --load-ms and reports each element's
//      animated properties: start, duration, from→to, best-fit easing, and stagger.
//   2. Scroll phase — scrolls in steps; per step reports scroll-linked properties
//      (scrubbed), one-shot reveals triggered at that position (with timing/easing),
//      and pinned/sticky elements.
//   3. Library introspection — document.getAnimations() (CSS/WAAPI, incl. Motion's
//      WAAPI animations) and, when exposed globally, GSAP tweens and ScrollTriggers.
//
// Usage:
//   node motion-capture.mjs --url http://localhost:3000 [--width 1440] [--height 900]
//        [--load-ms 3500] [--steps 20] [--step-px 0.6vh] [--settle 1400] [--out ./motion]
//        [--storage lang=en] [--reduced] [--frames]
// Outputs motion-report.md and motion.json (+ frame PNGs with --frames).
// Evidence level: everything here is OBSERVED/measured in Chromium; easing names are
// best fits (RMS error is reported), not the source's declared values.

import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]);
    return acc;
  }, [])
);
if (!args.url) {
  console.error("Missing --url");
  process.exit(2);
}
const W = +(args.width || 1440), H = +(args.height || 900);
const LOAD_MS = +(args["load-ms"] || 3500);
const STEPS = +(args.steps || 20);
const SETTLE = +(args.settle || 1400);
const OUT = path.resolve(args.out || "motion-output");
mkdirSync(OUT, { recursive: true });

function loadPlaywright() {
  for (const base of [path.join(process.cwd(), "package.json"), execSync("npm root -g").toString().trim() + "/playwright/package.json"]) {
    try { return createRequire(base)("playwright"); } catch {}
  }
  console.error("Playwright not found (npm i -D playwright, or install globally).");
  process.exit(2);
}
const { chromium } = loadPlaywright();

// ---------------------------------------------------------------- in-page recorder
// Installed before any page script. Records per-frame snapshots of animatable
// properties for "candidate" elements (visible, non-trivial), keyed by a stable id.
const RECORDER = () => {
  const PROPS = ["transform", "opacity", "clipPath", "filter", "fontVariationSettings", "letterSpacing", "color", "backgroundColor", "width", "height"];
  const ids = new WeakMap();
  let next = 0;
  const label = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    const txt = (el.childElementCount === 0 ? el.textContent : "").trim().slice(0, 24);
    return `${el.tagName.toLowerCase()}${id}${cls}${txt ? ` "${txt}"` : ""}`;
  };
  const key = (el) => {
    if (!ids.has(el)) ids.set(el, { n: next++, label: label(el) });
    return ids.get(el);
  };
  const fixedMap = new WeakMap();
  const inFixed = (el) => {
    for (let a = el; a && a !== document.documentElement; a = a.parentElement) if (getComputedStyle(a).position === "fixed") return true;
    return false;
  };
  const candidates = () => {
    const out = [];
    for (const el of document.body ? document.body.querySelectorAll("*") : []) {
      if (out.length > 600) break;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || r.bottom < -innerHeight || r.top > innerHeight * 2) continue;
      if (["SCRIPT", "STYLE", "LINK", "META", "BR", "PATH", "G", "DEFS"].includes(el.tagName)) continue;
      if (!fixedMap.has(el)) fixedMap.set(el, inFixed(el));
      out.push(el);
    }
    return out;
  };
  const snap = (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const o = { top: Math.round(r.top), left: Math.round(r.left), h: Math.round(r.height), fixed: fixedMap.get(el) || false };
    for (const p of PROPS) o[p] = s[p];
    return o;
  };
  window.__mc = {
    frames: [],
    recording: false,
    cand: [],
    start(ms) {
      this.frames = [];
      this.recording = true;
      const t0 = performance.now();
      let lastQuery = -1;
      // Re-collect candidates on the next frame whenever the DOM changes (e.g. SplitText
      // inserting line/word wrappers right before animating them), and every 250 ms.
      let dirty = true;
      if (!this.mo && window.MutationObserver) {
        this.mo = new MutationObserver(() => { this.dirty = true; });
        const watch = () => this.mo.observe(document.documentElement, { childList: true, subtree: true });
        if (document.documentElement) watch();
      }
      const tick = () => {
        const t = performance.now() - t0;
        if (this.dirty || dirty || t - lastQuery > 250 || lastQuery < 0) { this.cand = candidates(); lastQuery = t; dirty = false; this.dirty = false; }
        const f = { t: Math.round(t), s: {} };
        for (const el of this.cand) { const k = key(el); f.s[k.n] = snap(el); }
        this.frames.push(f);
        if (t < ms && this.recording) requestAnimationFrame(tick);
        else this.recording = false;
      };
      requestAnimationFrame(tick);
    },
    labels() {
      const m = {};
      for (const el of document.querySelectorAll("*")) if (ids.has(el)) { const k = ids.get(el); m[k.n] = k.label; }
      return m;
    },
  };
  // Start load recording immediately (frames stay empty until <body> exists), so
  // animations started by early module scripts are captured from their first frame.
  window.__mc.start(window.__mcLoadMs || 3500);
};

// ---------------------------------------------------------------- analysis helpers
const EASINGS = {
  linear: (t) => t,
  "sine.out": (t) => Math.sin((t * Math.PI) / 2),
  "power1.out (quad)": (t) => 1 - (1 - t) ** 2,
  "power2.out (cubic)": (t) => 1 - (1 - t) ** 3,
  "power3.out (quart)": (t) => 1 - (1 - t) ** 4,
  "power4.out (quint)": (t) => 1 - (1 - t) ** 5,
  "expo.out": (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
  "power2.inOut": (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
  "power3.inOut": (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2),
  "expo.inOut": (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2),
  "power2.in": (t) => t ** 3,
  "css ease": bezier(0.25, 0.1, 0.25, 1),
  "css ease-out": bezier(0, 0, 0.58, 1),
  "css ease-in-out": bezier(0.42, 0, 0.58, 1),
  "editorial (.22,1,.36,1)": bezier(0.22, 1, 0.36, 1),
  "back.out (overshoot)": (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2,
};
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t, dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) { const e = X(t) - x; const d = dX(t); if (Math.abs(e) < 1e-5 || !d) break; t -= e / d; }
    return Y(Math.min(1, Math.max(0, t)));
  };
}
function parseMatrix(tr) {
  if (!tr || tr === "none") return { tx: 0, ty: 0, sx: 1, sy: 1, rot: 0 };
  const m = tr.match(/matrix(3d)?\(([^)]+)\)/);
  if (!m) return { tx: 0, ty: 0, sx: 1, sy: 1, rot: 0 };
  const v = m[2].split(",").map(Number);
  if (m[1]) return { tx: v[12], ty: v[13], sx: Math.hypot(v[0], v[1]), sy: Math.hypot(v[4], v[5]), rot: (Math.atan2(v[1], v[0]) * 180) / Math.PI };
  return { tx: v[4], ty: v[5], sx: Math.hypot(v[0], v[1]), sy: Math.hypot(v[2], v[3]), rot: (Math.atan2(v[1], v[0]) * 180) / Math.PI };
}
// Turn one snapshot into numeric channels.
function channels(s) {
  const m = parseMatrix(s.transform);
  const clip = (s.clipPath || "none").match(/-?[\d.]+/g)?.map(Number) || [];
  return {
    "translateX(px)": m.tx, "translateY(px)": m.ty, scale: +((m.sx + m.sy) / 2).toFixed(4), "rotate(deg)": +m.rot.toFixed(2),
    opacity: +s.opacity, "clipPath[0]": clip[0] ?? null, "clipPath[2]": clip[2] ?? null,
    "blur(px)": +(((s.filter || "").match(/blur\(([\d.]+)px/) || [])[1] || 0),
    "layoutTop(px)": s.top,
  };
}
// Find motion segments in a time series of numbers.
// A segment ends when the value reaches (within 0.5% of the total change) the value it
// then settles at — so long easing tails are not cut short. Easing AND duration are
// fitted jointly: for each curve, the duration D (≥ observed) that best explains the
// samples is searched; the reported duration is that fitted D.
function segments(times, values, minDelta) {
  const segs = [];
  let i = 1;
  const eps = minDelta / 400;
  while (i < values.length) {
    if (values[i] == null || values[i - 1] == null || Math.abs(values[i] - values[i - 1]) < eps) { i++; continue; }
    const s = i - 1;
    // walk until the value stays constant (within eps) for 6 frames
    let e = i, still = 0;
    while (e < values.length - 1 && still < 6) {
      if (Math.abs(values[e + 1] - values[e]) < eps) still++;
      else still = 0;
      e++;
    }
    const settled = values[e];
    const from = values[s];
    const total = settled - from;
    if (Math.abs(total) >= minDelta) {
      let last = e;
      while (last > s + 1 && Math.abs(values[last - 1] - settled) <= Math.abs(total) * 0.005) last--;
      const T = times.slice(s, last + 1), V = values.slice(s, last + 1);
      const obs = T[T.length - 1] - T[0];
      let best = null;
      if (obs > 60 && T.length >= 4) {
        for (const [name, fn] of Object.entries(EASINGS)) {
          for (let D = obs; D <= obs * 1.6; D += Math.max(8, obs * 0.02)) {
            let err = 0;
            for (let k = 0; k < T.length; k++) {
              const p = (V[k] - from) / total;
              err += (p - fn(Math.min(1, (T[k] - T[0]) / D))) ** 2;
            }
            const rms = Math.sqrt(err / T.length);
            if (!best || rms < best.rms) best = { name, rms, D };
          }
        }
      }
      segs.push({ start: T[0], end: T[0] + Math.round(best?.D ?? obs), duration: Math.round(best?.D ?? obs), from: +from.toFixed(3), to: +settled.toFixed(3), easing: best?.name || "n/a", rms: best ? +best.rms.toFixed(3) : null });
    }
    i = e + 1;
  }
  return segs;
}
const MIN_DELTA = { "translateX(px)": 2, "translateY(px)": 2, scale: 0.01, "rotate(deg)": 0.5, opacity: 0.05, "clipPath[0]": 1, "clipPath[2]": 1, "blur(px)": 0.5 };

function analyzeFrames(frames, labels) {
  const series = {};
  for (const f of frames) for (const [id, s] of Object.entries(f.s)) (series[id] ||= []).push({ t: f.t, c: channels(s) });
  const out = [];
  for (const [id, pts] of Object.entries(series)) {
    if (pts.length < 4) continue;
    const times = pts.map((p) => p.t);
    for (const ch of Object.keys(MIN_DELTA)) {
      const vals = pts.map((p) => p.c[ch]);
      for (const sg of segments(times, vals, MIN_DELTA[ch])) out.push({ el: labels[id] || id, prop: ch, ...sg });
    }
  }
  // Collapse identical parent/child duplicates: keep rows with distinct (prop,start,duration,el)
  out.sort((a, b) => a.start - b.start);
  return out;
}
function staggerGroups(rows) {
  // Stagger chain: same property, similar duration (±25%), consecutive starts 15–400 ms apart.
  const byProp = {};
  for (const r of rows) (byProp[r.prop] ||= []).push(r);
  const chains = [];
  for (const [prop, list] of Object.entries(byProp)) {
    list.sort((a, b) => a.start - b.start);
    let chain = [list[0]];
    const flush = () => {
      if (chain.length >= 3) {
        const gaps = chain.slice(1).map((r, i) => r.start - chain[i].start).sort((a, b) => a - b);
        const durs = chain.map((r) => r.duration).sort((a, b) => a - b);
        const eas = {};
        for (const r of chain) eas[r.easing] = (eas[r.easing] || 0) + 1;
        chains.push({ prop, elements: chain.length, staggerMedianMs: gaps[Math.floor(gaps.length / 2)], duration: durs[Math.floor(durs.length / 2)], easing: Object.entries(eas).sort((a, b) => b[1] - a[1])[0][0] });
      }
    };
    for (let i = 1; i < list.length; i++) {
      const prev = chain[chain.length - 1], r = list[i];
      const gap = r.start - prev.start;
      if (gap >= 15 && gap <= 400 && Math.abs(r.duration - prev.duration) <= prev.duration * 0.25) chain.push(r);
      else if (gap < 15 && Math.abs(r.duration - prev.duration) <= prev.duration * 0.25) continue; // same-time sibling/parent duplicate
      else { flush(); chain = [r]; }
    }
    flush();
  }
  return chains.sort((a, b) => b.elements - a.elements);
}

// ---------------------------------------------------------------- run
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, reducedMotion: args.reduced ? "reduce" : "no-preference" });
if (args.storage) await ctx.addInitScript((kv) => { for (const p of kv.split(",")) { const [k, v] = p.split("="); localStorage.setItem(k, v); } }, String(args.storage));
await ctx.addInitScript(`window.__mcLoadMs = ${LOAD_MS};`);
await ctx.addInitScript(RECORDER);
const page = await ctx.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e.message || e).slice(0, 200)));
await page.goto(args.url, { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(LOAD_MS + 300);
if (args.frames) await page.screenshot({ path: path.join(OUT, "load-end.png") });

const loadFrames = await page.evaluate(() => window.__mc.frames);
const libs = await page.evaluate(() => {
  const r = { gsap: !!window.gsap, scrollTrigger: !!window.ScrollTrigger, lenis: document.documentElement.classList.contains("lenis"), three: !!window.THREE, canvases: document.querySelectorAll("canvas").length };
  r.waapi = document.getAnimations().slice(0, 60).map((a) => {
    const t = a.effect?.getTiming?.() || {};
    const tgt = a.effect?.target;
    return {
      type: a.constructor.name, name: a.animationName || a.transitionProperty || a.id || "", target: tgt ? `${tgt.tagName?.toLowerCase()}${tgt.id ? "#" + tgt.id : ""}${typeof tgt.className === "string" && tgt.className ? "." + tgt.className.trim().split(/\s+/)[0] : ""}` : "",
      duration: t.duration, delay: t.delay, easing: t.easing, iterations: t.iterations, playState: a.playState,
    };
  });
  if (window.gsap?.globalTimeline) {
    r.gsapTweens = window.gsap.globalTimeline.getChildren(true, true, false).slice(0, 80).map((tw) => ({
      duration: tw.duration(), delay: tw.delay(), ease: tw.vars?.ease?.toString?.() || tw.vars?.ease, props: Object.keys(tw.vars || {}).filter((k) => !["ease", "duration", "delay", "onComplete", "onUpdate", "scrollTrigger", "stagger"].includes(k)).slice(0, 6), stagger: tw.vars?.stagger ?? null,
    }));
  }
  if (window.ScrollTrigger?.getAll) {
    r.scrollTriggers = window.ScrollTrigger.getAll().map((st) => ({ start: Math.round(st.start), end: Math.round(st.end), scrub: st.vars?.scrub ?? false, pin: !!st.vars?.pin, toggleActions: st.vars?.toggleActions || null }));
  }
  return r;
});
const loadLabels = await page.evaluate(() => window.__mc.labels());
const loadRows = analyzeFrames(loadFrames, loadLabels);

// Scroll phase
const docH = await page.evaluate(() => document.documentElement.scrollHeight);
const stepPx = Math.max(200, Math.round(((docH - H) / STEPS) | 0));
const scrollRows = [];
const scrubSeries = {};
const pinned = new Set();
const loops = new Set();
let prevTops = null;
for (let k = 1; k <= STEPS; k++) {
  const y = Math.min(docH - H, k * stepPx);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.evaluate((ms) => window.__mc.start(ms), SETTLE);
  await page.waitForTimeout(SETTLE + 100);
  const frames = await page.evaluate(() => window.__mc.frames);
  const labels = await page.evaluate(() => window.__mc.labels());
  for (const r of analyzeFrames(frames, labels)) scrollRows.push({ scrollY: y, ...r });
  const last = frames[frames.length - 1];
  // Anything still changing at the end of the settle window is a continuous loop
  // (marquee, ambient animation), not a scroll-linked property.
  const ref = frames[Math.max(0, frames.length - 8)];
  if (last && ref) for (const [id, sn] of Object.entries(last.s)) {
    const a = channels(sn), b = ref.s[id] ? channels(ref.s[id]) : null;
    if (!b) continue;
    for (const ch of Object.keys(MIN_DELTA)) if (ch !== "layoutTop(px)" && Math.abs((a[ch] ?? 0) - (b[ch] ?? 0)) >= MIN_DELTA[ch] / 4) loops.add(`${labels[id] || id}|${ch}`);
  }
  if (last) {
    const tops = {};
    for (const [id, s] of Object.entries(last.s)) {
      const c = channels(s);
      tops[id] = s.top;
      (scrubSeries[labels[id] || id] ||= []).push({ y, ...c });
    }
    // Pinned = not position:fixed (or inside a fixed element), at least 120px tall, and
    // staying at the same viewport position across consecutive scroll steps.
    if (prevTops) for (const [id, top] of Object.entries(tops)) {
      const sn = last.s[id];
      if (sn.fixed || sn.h < 120) continue;
      if (prevTops[id] !== undefined && Math.abs(top - prevTops[id]) < 2 && Math.abs(top) < H && stepPx > 50) pinned.add(labels[id] || id);
    }
    prevTops = tops;
  }
  if (args.frames) await page.screenshot({ path: path.join(OUT, `scroll-${String(k).padStart(2, "0")}.png`) });
}
// Scroll-linked (scrubbed) properties: change monotonically across >=3 consecutive steps
const scrubbed = [];
for (const [el, pts] of Object.entries(scrubSeries)) {
  for (const ch of Object.keys(MIN_DELTA)) {
    if (ch === "layoutTop(px)" || loops.has(`${el}|${ch}`)) continue;
    let run = 0, startIdx = 0;
    for (let i = 1; i < pts.length; i++) {
      const d = (pts[i][ch] ?? 0) - (pts[i - 1][ch] ?? 0);
      if (Math.abs(d) >= MIN_DELTA[ch]) { if (!run) startIdx = i - 1; run++; }
      else { if (run >= 2) scrubbed.push({ el, prop: ch, fromY: pts[startIdx].y, toY: pts[startIdx + run].y, from: +(pts[startIdx][ch] ?? 0).toFixed(3), to: +(pts[startIdx + run][ch] ?? 0).toFixed(3) }); run = 0; }
    }
    if (run >= 2) scrubbed.push({ el, prop: ch, fromY: pts[startIdx].y, toY: pts[startIdx + run].y, from: +(pts[startIdx][ch] ?? 0).toFixed(3), to: +(pts[startIdx + run][ch] ?? 0).toFixed(3) });
  }
}
await browser.close();

// ---------------------------------------------------------------- report
const dedupe = (rows) => {
  const seen = new Set();
  return rows.filter((r) => { const k = `${r.prop}|${r.start}|${r.duration}|${r.from}|${r.to}`; if (seen.has(k)) return false; seen.add(k); return true; });
};
const load = dedupe(loadRows);
const scroll = dedupe(scrollRows);
const result = { url: args.url, viewport: `${W}x${H}`, reducedMotion: !!args.reduced, date: new Date().toISOString(), libs, load, loadStagger: staggerGroups(load), scrollTriggered: scroll, scrollStagger: staggerGroups(scroll), scrubbed: scrubbed.slice(0, 200), pinned: [...pinned].slice(0, 40), loops: [...loops].slice(0, 40), consoleErrors };
writeFileSync(path.join(OUT, "motion.json"), JSON.stringify(result, null, 2));

const fmt = (r) => `| ${r.el.slice(0, 48)} | ${r.prop} | ${r.start} | ${r.duration} | ${r.from} → ${r.to} | ${r.easing} | ${r.rms ?? ""} |`;
const md = [
  `# Motion report`, ``, `- URL: ${args.url}`, `- Viewport: ${W}x${H} · reduced motion: ${!!args.reduced} · ${result.date}`,
  `- Libraries (globals only; bundled libs may be hidden → UNKNOWN): gsap=${libs.gsap} scrollTrigger=${libs.scrollTrigger} lenis=${libs.lenis} three=${libs.three} canvases=${libs.canvases}`,
  `- Evidence: OBSERVED (measured in Chromium). Easing = best fit among ${Object.keys(EASINGS).length} curves; RMS < 0.03 is a good fit.`,
  `- Accuracy (validated against the recipe harness with known values): easing *family* (out / inOut / linear, soft vs sharp) is reliable; the exact curve can swap with a near-identical one (e.g. quart.out ≈ cubic-bezier(.22,1,.36,1)); durations within ~15% (long ease-out tails read slightly short); staggers within ~20 ms; animations that start before recording begins report a partial "from". Measure production builds — dev servers distort timing.`,
  `- Scroll-linked rows with ~1 s expo-like catch-up usually mean GSAP \`scrub: <seconds>\` or a smooth-scroll lerp, not a timed tween.`,
  ``, `## Load sequence (${load.length} property animations)`, ``,
  `| element | property | start ms | duration ms | from → to | easing (fit) | rms |`, `|---|---|---|---|---|---|---|`,
  ...load.slice(0, 60).map(fmt),
  ``, `### Staggers (load)`, ``, ...(result.loadStagger.length ? result.loadStagger.slice(0, 10).map((g) => `- ${g.elements}× ${g.prop}, ${g.duration}ms, ${g.easing}, stagger ≈ ${g.staggerMedianMs}ms`) : ["- none detected"]),
  ``, `## Scroll-triggered reveals (${scroll.length})`, ``,
  `| scrollY | element | property | duration ms | from → to | easing (fit) | rms |`, `|---|---|---|---|---|---|---|`,
  ...scroll.slice(0, 80).map((r) => `| ${r.scrollY} | ${r.el.slice(0, 40)} | ${r.prop} | ${r.duration} | ${r.from} → ${r.to} | ${r.easing} | ${r.rms ?? ""} |`),
  ``, `### Staggers (scroll)`, ``, ...(result.scrollStagger.length ? result.scrollStagger.slice(0, 10).map((g) => `- ${g.elements}× ${g.prop}, ${g.duration}ms, ${g.easing}, stagger ≈ ${g.staggerMedianMs}ms`) : ["- none detected"]),
  ``, `## Scroll-linked (scrubbed) properties (${scrubbed.length})`, ``,
  ...scrubbed.slice(0, 40).map((s) => `- ${s.el.slice(0, 50)} · ${s.prop}: ${s.from} → ${s.to} over scrollY ${s.fromY}–${s.toY}`),
  ``, `## Continuous loops (time-based, still moving while idle)`, ``, ...(result.loops.length ? result.loops.map((l) => `- ${l.replace("|", " · ")}`) : ["- none detected"]),
  ``, `## Pinned / sticky while scrolling`, ``, ...(result.pinned.length ? result.pinned.map((p) => `- ${p}`) : ["- none detected"]),
  ``, `## Library introspection`, ``,
  `- WAAPI/CSS animations at end of load: ${libs.waapi.length}`, ...libs.waapi.slice(0, 15).map((a) => `  - ${a.type} ${a.name} on ${a.target}: ${a.duration}ms, delay ${a.delay}, ${a.easing}, ${a.playState}`),
  ...(libs.gsapTweens ? [`- GSAP tweens: ${libs.gsapTweens.length}`, ...libs.gsapTweens.slice(0, 15).map((t) => `  - ${t.duration}s delay ${t.delay}s ease ${t.ease} props ${t.props.join(",")} stagger ${JSON.stringify(t.stagger)}`)] : []),
  ...(libs.scrollTriggers ? [`- ScrollTriggers: ${libs.scrollTriggers.length}`, ...libs.scrollTriggers.slice(0, 15).map((s) => `  - start ${s.start} end ${s.end} scrub ${s.scrub} pin ${s.pin}`)] : []),
  ``, consoleErrors.length ? `Runtime errors: ${consoleErrors.join(" | ")}` : `No runtime errors.`,
].join("\n");
writeFileSync(path.join(OUT, "motion-report.md"), md);
console.log(`[motion-capture] load:${load.length} scroll:${scroll.length} scrubbed:${scrubbed.length} pinned:${pinned.size} → ${path.join(OUT, "motion-report.md")}`);
