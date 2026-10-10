#!/usr/bin/env node
// Automated production checks for an HTML design (one or more .canvas artboards).
//
//   node qa.mjs design.html [--copy copy.json] [--json report.json] [--strict]
//
// Page-level configuration (optional <meta> tags in the design):
//   <meta name="dd:canvas"   content="1080x1350">     expected artboard size (critical if wrong); a comma list
//                                                     gives one size per .canvas in order
//   <section class="canvas" data-canvas="1080x1920" data-safe="256,72,344,72">  per-artboard overrides
//   <meta name="dd:safe"     content="72,72,72,72">   top,right,bottom,left inset text must stay inside
//   <meta name="dd:min-text" content="24">            smallest acceptable text size in canvas px
//   <meta name="dd:copy"     content="copy.json">     supplied copy, relative to the HTML file
// Per-element attributes:
//   data-copy="key"      element text must equal copy[key] exactly (after whitespace normalisation)
//   data-allow-overlap   text may overlap other text (deliberate layering)
//   data-fineprint       legal/metadata text: min-size breach is minor, not major
//   data-qa-ignore       skip this subtree
//
// What it measures (evidence, not taste):
//   - artboard size; text clipped by overflow or the canvas edge; safe-area breaches
//   - supplied-copy accuracy; missing required copy
//   - the platform fonts Chromium actually used per text node (CDP), so silent
//     fallback (e.g. Arabic rendered in DejaVu) is caught
//   - requested font weights the loaded family does not contain
//   - Arabic hazards: letter-spacing (breaks joining), presentation-form code
//     points (pre-shaped / reversed text hacks), LTR direction on Arabic blocks,
//     tight line-height for multi-line Arabic
//   - contrast measured from rendered pixels behind each line of text
//   - text-on-text overlap; distorted or upscaled images
//   - widows/runts; near-miss alignment edges; type-scale and family sprawl
// It cannot judge concept, originality or whether the hierarchy is the right
// one — that is the human-style critique in modules/13-quality-assurance.md.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { launch, openDesign } from "./pw.mjs";

const args = process.argv.slice(2);
const input = args[0];
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
if (!input) {
  console.log("usage: qa.mjs <design.html> [--copy copy.json] [--json out.json] [--strict]");
  process.exit(1);
}

const FALLBACK_FAMILIES = /DejaVu|Liberation|FreeSans|FreeSerif|FreeMono|Unifont|WenQuanYi|IPA|Bitstream|Courier|Loma|OpenSymbol|Noto Color Emoji/i;
const issues = [];
const add = (severity, canvas, check, message, where) => issues.push({ severity, canvas, check, message, where });

const browser = await launch();
let report;
try {
  const page = await openDesign(browser, input, 1);
  const meta = await page.evaluate(() => {
    const m = (n) => document.querySelector(`meta[name="dd:${n}"]`)?.content || null;
    return { canvas: m("canvas"), safe: m("safe"), minText: m("min-text"), copy: m("copy") };
  });

  // ---------- supplied copy ----------
  const copyPath = opt("--copy", meta.copy ? path.join(path.dirname(path.resolve(input)), meta.copy) : null);
  const copy = copyPath && existsSync(copyPath) ? JSON.parse(readFileSync(copyPath, "utf8")) : null;

  // ---------- tag text-bearing elements, collect geometry ----------
  const data = await page.evaluate(() => {
    const AR = /[؀-ۿݐ-ݿࢠ-ࣿ]/g;
    const PRES = /[ﭐ-﷿ﹰ-﻿]/;
    const canvases = [...document.querySelectorAll(".canvas")];
    let qid = 0;
    return canvases.map((cv, ci) => {
      const cb = cv.getBoundingClientRect();
      const rel = (r) => ({ x: r.left - cb.left, y: r.top - cb.top, w: r.width, h: r.height });
      const texts = [];
      const walker = document.createTreeWalker(cv, NodeFilter.SHOW_ELEMENT);
      for (let el = walker.currentNode; el; el = walker.nextNode()) {
        if (el.closest("[data-qa-ignore], .grid-overlay, script, style, svg")) continue;
        const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own.length) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) continue;
        const lines = [];
        for (const tn of own) {
          const r = document.createRange();
          r.selectNodeContents(tn);
          for (const rr of r.getClientRects()) if (rr.width > 0.5 && rr.height > 0.5) lines.push(rel(rr));
        }
        if (!lines.length) continue;
        const x0 = Math.min(...lines.map((l) => l.x)), y0 = Math.min(...lines.map((l) => l.y));
        const x1 = Math.max(...lines.map((l) => l.x + l.w)), y1 = Math.max(...lines.map((l) => l.y + l.h));
        const text = own.map((n) => n.textContent).join(" ").replace(/\s+/g, " ").trim();
        const arCount = (text.match(AR) || []).length;
        const letters = (text.match(/\p{L}/gu) || []).length || 1;
        // nearest clipping ancestor (overflow != visible) inside the canvas, canvas included
        let clip = null;
        for (let a = el; a && a !== document.body; a = a.parentElement) {
          const s = getComputedStyle(a);
          if (s.overflowX !== "visible" || s.overflowY !== "visible") { clip = rel(a.getBoundingClientRect()); break; }
          if (a === cv) break;
        }
        // widow check: is the last word alone on the last line?
        let lastWordAlone = false;
        const lastTn = own[own.length - 1];
        const m = [...lastTn.textContent.matchAll(/\S+/g)];
        if (m.length >= 2 && lines.length >= 2) {
          const wr = (mm) => { const r = document.createRange(); r.setStart(lastTn, mm.index); r.setEnd(lastTn, mm.index + mm[0].length); return r.getBoundingClientRect(); };
          lastWordAlone = Math.abs(wr(m[m.length - 1]).top - wr(m[m.length - 2]).top) > 2;
        }
        const id = String(++qid);
        el.setAttribute("data-qa-id", id);
        texts.push({
          id, tag: el.tagName.toLowerCase(), cls: el.className && typeof el.className === "string" ? el.className : "",
          text: text.slice(0, 80), arabicShare: arCount / letters, presentationForms: PRES.test(text),
          lines: lines.length, box: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }, lineRects: lines, clip,
          lh: cs.lineHeight === "normal" ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight),
          fontSize: parseFloat(cs.fontSize), weight: Number(cs.fontWeight), family: cs.fontFamily,
          align: cs.textAlign, color: cs.color, letterSpacing: cs.letterSpacing, lineHeight: cs.lineHeight, direction: cs.direction,
          display: cs.display, lang: el.closest("[lang]")?.getAttribute("lang") || null,
          allowOverlap: !!el.closest("[data-allow-overlap]"), fineprint: !!el.closest("[data-fineprint]"),
          clipText: cs.webkitBackgroundClip === "text" || cs.backgroundClip === "text",
          lastWordAlone, isHeading: /^h[1-3]$/.test(el.tagName.toLowerCase()),
        });
      }
      const overflows = [];
      for (const el of cv.querySelectorAll("*")) {
        if (el.closest("[data-qa-ignore], .grid-overlay, svg")) continue;
        if (!el.textContent.trim()) continue;
        const cs = getComputedStyle(el);
        // Vertical: ignore glyph overhang (descenders below tight display leading);
        // a spilled line of text overflows by well over half an em.
        let maxFs = parseFloat(cs.fontSize);
        for (const d of el.querySelectorAll("*")) maxFs = Math.max(maxFs, parseFloat(getComputedStyle(d).fontSize) || 0);
        const vTol = Math.max(2, maxFs * 0.6);
        if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + vTol) {
          if (el === cv) continue;
          if (cs.overflowX !== "visible" || cs.overflowY !== "visible") continue; // clipped content is reported by the clipping check
          overflows.push({ text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 60), cls: typeof el.className === "string" ? el.className : "", dx: el.scrollWidth - el.clientWidth, dy: el.scrollHeight - el.clientHeight });
        }
      }
      const images = [...cv.querySelectorAll("img")].filter((i) => !i.closest("[data-qa-ignore]")).map((img) => {
        const cs = getComputedStyle(img);
        return { src: img.getAttribute("src"), nw: img.naturalWidth, nh: img.naturalHeight, box: rel(img.getBoundingClientRect()), fit: cs.objectFit };
      });
      // vertical coverage of visible content, for the empty-band heuristic
      const spans = texts.flatMap((t) => t.lineRects.map((r) => [r.y, r.y + r.h]));
      for (const el of cv.querySelectorAll("img, svg, video, canvas, *")) {
        if (el === cv || el.closest(".grid-overlay")) continue;
        const s = getComputedStyle(el);
        const visualTag = /^(IMG|svg|VIDEO|CANVAS)$/.test(el.tagName);
        const painted = (s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== "transparent") || s.backgroundImage !== "none" || parseFloat(s.borderTopWidth) > 0;
        if (!visualTag && !painted) continue;
        const r = rel(el.getBoundingClientRect());
        if (r.w < 2 || r.h < 1 || r.w * r.h > cb.width * cb.height * 0.9) continue;
        spans.push([Math.max(0, r.y), Math.min(cb.height, r.y + r.h)]);
      }
      return { index: ci + 1, width: cb.width, height: cb.height, texts, images, spans, overflows, expect: cv.dataset.canvas || null, safe: cv.dataset.safe || null };
    });
  });
  if (!data.length) throw new Error("no .canvas element found");

  // ---------- fonts actually used (CDP) ----------
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: "[data-qa-id]" });
  const fontsById = {};
  for (const nodeId of nodeIds) {
    const { attributes } = await cdp.send("DOM.getAttributes", { nodeId });
    const qid = attributes[attributes.indexOf("data-qa-id") + 1];
    const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
    fontsById[qid] = fonts.map((f) => ({ family: f.familyName, postscript: f.postScriptName, glyphs: f.glyphCount, custom: f.isCustomFont }));
  }
  const faceWeights = await page.evaluate(() => {
    const out = {};
    for (const f of document.fonts) if (f.status === "loaded") (out[f.family.replace(/"/g, "")] ||= []).push(f.weight);
    return out;
  });

  // ---------- contrast: screenshot each canvas with text hidden, sample behind lines ----------
  await page.addStyleTag({ content: `.canvas *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;-webkit-text-stroke:0!important;text-decoration-color:transparent!important}` });
  const canvasEls = await page.$$(".canvas");
  for (const cv of data) {
    const shot = (await canvasEls[cv.index - 1].screenshot()).toString("base64");
    const samples = await page.evaluate(async ({ shot, texts }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + shot;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const g = c.getContext("2d");
      g.drawImage(img, 0, 0);
      const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      const out = {};
      for (const t of texts) {
        const lum = [];
        for (const r of t.lineRects) {
          const x0 = Math.max(0, Math.floor(r.x)), y0 = Math.max(0, Math.floor(r.y));
          const w = Math.min(c.width - x0, Math.ceil(r.w)), h = Math.min(c.height - y0, Math.ceil(r.h));
          if (w <= 0 || h <= 0) continue;
          const px = g.getImageData(x0, y0, w, h).data;
          const step = Math.max(1, Math.floor(Math.sqrt((w * h) / 400)));
          for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
            const i = (y * w + x) * 4;
            lum.push(0.2126 * lin(px[i]) + 0.7152 * lin(px[i + 1]) + 0.0722 * lin(px[i + 2]));
          }
        }
        if (!lum.length) continue;
        lum.sort((a, b) => a - b);
        const mean = lum.reduce((a, b) => a + b, 0) / lum.length;
        const sd = Math.sqrt(lum.reduce((a, b) => a + (b - mean) ** 2, 0) / lum.length);
        out[t.id] = { mean, sd, p05: lum[Math.floor(lum.length * 0.05)], p95: lum[Math.floor(lum.length * 0.95)] };
      }
      return out;
    }, { shot, texts: cv.texts });
    for (const t of cv.texts) t.bg = samples[t.id] || null;
  }

  // ---------- evaluate ----------
  const metaSizes = (meta.canvas || "").split(",").map((x) => x.trim()).filter(Boolean);
  const parseRGBA = (s) => { const m = s.match(/[\d.]+/g)?.map(Number) || [0, 0, 0, 1]; return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 }; };
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const L = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  // Line-box ("core") rectangle: the font's content area is often taller than
  // the line box (tall ascent/descent metrics), so tight display leading makes
  // content areas overlap without any glyph touching. Overlap and safe-area use
  // the line box; clipping uses the conservative content area.
  const core = (t) => {
    const inset = Math.max(0, (t.lineRects[0].h - t.lh) / 2);
    return { x: t.box.x, y: t.box.y + inset, w: t.box.w, h: Math.max(1, t.box.h - 2 * inset) };
  };
  const fmt = (t) => `"${t.text.slice(0, 40)}"${t.cls ? " ." + t.cls.split(" ")[0] : ""}`;

  for (const cv of data) {
    const short = Math.min(cv.width, cv.height);
    const minText = Number(meta.minText) || Math.round(short * 0.02);
    const sizeSpec = cv.expect || metaSizes[cv.index - 1] || (metaSizes.length === 1 ? metaSizes[0] : "");
    const [ew, eh] = sizeSpec.split("x").map(Number);
    const safeSpec = cv.safe || meta.safe;
    const safe = safeSpec ? safeSpec.split(",").map(Number) : null; // top,right,bottom,left
    if (ew && (Math.abs(cv.width - ew) > 0.5 || Math.abs(cv.height - eh) > 0.5))
      add("critical", cv.index, "aspect", `artboard is ${cv.width}x${cv.height}, brief requires ${ew}x${eh}`);

    const sizes = new Set(), families = new Set();
    for (const t of cv.texts) {
      sizes.add(Math.round(t.fontSize));
      const used = fontsById[t.id] || [];
      used.forEach((f) => families.add(f.family.replace(/\s+(Thin|Hairline|UltraLight|ExtraLight|Light|Regular|Book|Medium|SemiBold|DemiBold|Bold|ExtraBold|UltraBold|Heavy|Black)$/i, "")));
      const b = t.box;

      // clipping
      if (t.clip) {
        const c = t.clip;
        if (b.x < c.x - 1 || b.y < c.y - 1 || b.x + b.w > c.x + c.w + 1 || b.y + b.h > c.y + c.h + 1)
          add("critical", cv.index, "clipping", `text is cut off by its container or the artboard edge`, fmt(t));
      }
      // safe area
      const out = (r, tol) => safe && (r.y < safe[0] - tol || r.x + r.w > cv.width - safe[1] + tol || r.y + r.h > cv.height - safe[2] + tol || r.x < safe[3] - tol);
      // 2 px tolerance on the line box absorbs ascent/descent rounding
      if (out(core(t), 2)) add("major", cv.index, "safe-area", `text extends outside the declared safe area`, fmt(t));
      else if (out(b, 0.5)) add("minor", cv.index, "safe-area", `the font's ascent/descent area crosses the safe margin (line box is inside) — check marks/harakat visually`, fmt(t));
      // size
      if (t.fontSize < minText)
        add(t.fineprint ? "minor" : "major", cv.index, "min-size", `${t.fontSize}px is below the ${minText}px minimum for this format`, fmt(t));
      // fonts
      const fb = used.filter((f) => FALLBACK_FAMILIES.test(f.family));
      if (fb.length && !FALLBACK_FAMILIES.test(t.family.split(",")[0]))
        add(t.arabicShare > 0.3 ? "critical" : "major", cv.index, "font-fallback",
          `rendered partly in fallback font ${fb.map((f) => `${f.family} (${f.glyphs} glyphs)`).join(", ")} — the intended face lacks these glyphs`, fmt(t));
      const primary = t.family.split(",")[0].replace(/["']/g, "").trim();
      const weights = faceWeights[primary];
      const covers = (w) => { const [lo, hi = lo] = String(w).split(" ").map(Number); return t.weight >= lo - 49 && t.weight <= hi + 49; }; // "100 900" = variable range
      if (weights && !weights.some(covers))
        add("major", cv.index, "weight", `requested weight ${t.weight} but "${primary}" only provides ${[...new Set(weights)].join("/")} — the hierarchy will not render as specified`, fmt(t));
      // Arabic
      if (t.arabicShare > 0.3) {
        if (t.letterSpacing !== "normal" && parseFloat(t.letterSpacing) !== 0)
          add("major", cv.index, "arabic-tracking", `letter-spacing ${t.letterSpacing} on Arabic — Chromium may suppress it, but exporters and other renderers break the cursive joins; remove it (use kashida or weight/size for emphasis)`, fmt(t));
        if (t.direction !== "rtl" && !/inline/.test(t.display))
          add("major", cv.index, "arabic-direction", `Arabic block is laid out LTR — set dir="rtl" on it or an ancestor`, fmt(t));
        const lh = t.lineHeight === "normal" ? 1.2 : parseFloat(t.lineHeight) / t.fontSize;
        if (t.lines > 1 && lh < 1.3)
          add("major", cv.index, "arabic-leading", `line-height ${lh.toFixed(2)} on multi-line Arabic risks dot/harakat collisions (use ≥1.3 display, ≥1.5 text)`, fmt(t));
        if (t.lang !== "ar") add("minor", cv.index, "lang", `Arabic text without lang="ar" — shaping is fine, but locale features and hyphenation are not selected`, fmt(t));
      }
      if (t.presentationForms)
        add("critical", cv.index, "arabic-presentation-forms", `contains Arabic presentation-form code points (pre-shaped or reversed text) — use plain Unicode and let the engine shape it`, fmt(t));
      // contrast
      const col = parseRGBA(t.color);
      if (t.clipText || col.a === 0) add("info", cv.index, "contrast", `gradient/clipped text — check contrast visually`, fmt(t));
      else if (t.bg) {
        const blended = col.a < 1 ? null : L(col);
        if (blended !== null) {
          const avg = ratio(blended, t.bg.mean);
          const worst = Math.min(ratio(blended, t.bg.p05), ratio(blended, t.bg.p95));
          const large = t.fontSize >= short * 0.035 || (t.weight >= 700 && t.fontSize >= short * 0.026);
          const need = large ? 3 : 4.5;
          if (avg < need)
            add(avg < 2 ? "critical" : "major", cv.index, "contrast", `contrast ${avg.toFixed(2)}:1 against the rendered background (needs ${need}:1${large ? ", large text" : ""})`, fmt(t));
          else if (worst < need && t.bg.sd > 0.12)
            add("minor", cv.index, "contrast", `average contrast ${avg.toFixed(2)}:1 passes but drops to ${worst.toFixed(2)}:1 over the busiest part of the background`, fmt(t));
        } else add("info", cv.index, "contrast", `semi-transparent text colour — check contrast visually`, fmt(t));
      }
      // rag
      if (t.lastWordAlone && t.lines >= 2)
        add("minor", cv.index, t.isHeading || t.fontSize >= short * 0.05 ? "headline-break" : "widow",
          t.isHeading || t.fontSize >= short * 0.05 ? `headline ends with a single word on its own line — rebreak for sense and shape` : `paragraph ends with a single word (runt)`, fmt(t));
    }

    // overlap — compared line by line (a paragraph flowing across columns has a
    // union box that spans the gutter, so union boxes would collide falsely)
    const coreLines = (t) => t.lineRects.map((r) => { const inset = Math.max(0, (r.h - t.lh) / 2); return { x: r.x, y: r.y + inset, w: r.w, h: Math.max(1, r.h - 2 * inset) }; });
    const hit = (a, b) => {
      const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
      const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
      const small = Math.min(a.w * a.h, b.w * b.h);
      return small && (ix * iy) / small > 0.04;
    };
    for (let i = 0; i < cv.texts.length; i++) for (let j = i + 1; j < cv.texts.length; j++) {
      const ta = cv.texts[i], tb = cv.texts[j];
      if (ta.allowOverlap || tb.allowOverlap) continue;
      const la = coreLines(ta), lb = coreLines(tb);
      if (la.some((a) => lb.some((b) => hit(a, b)))) add("major", cv.index, "overlap", `text blocks collide`, `${fmt(ta)} × ${fmt(tb)}`);
    }
    // near-miss alignment (block edges within 1–6 px of each other)
    const edges = [];
    // only the edge a block is aligned to (the other edge is its rag)
    for (const t of cv.texts) {
      if (t.box.w <= short * 0.08) continue;
      const rtl = t.direction === "rtl";
      const a = t.align === "start" ? (rtl ? "right" : "left") : t.align === "end" ? (rtl ? "left" : "right") : t.align;
      if (a === "left" || a === "justify") edges.push({ v: t.box.x, t });
      if (a === "right" || (a === "justify" && rtl)) edges.push({ v: t.box.x + t.box.w, t });
      if (a === "center") edges.push({ v: t.box.x + t.box.w / 2, t });
    }
    for (const im of cv.images) edges.push({ v: im.box.x, t: { text: `img ${im.src}`, cls: "" } }, { v: im.box.x + im.box.w, t: { text: `img ${im.src}`, cls: "" } });
    const seen = new Set();
    for (let i = 0; i < edges.length; i++) for (let j = i + 1; j < edges.length; j++) {
      const d = Math.abs(edges[i].v - edges[j].v);
      const key = [Math.round(edges[i].v), Math.round(edges[j].v)].sort().join("/");
      if (d > 1.5 && d <= 6 && edges[i].t !== edges[j].t && !seen.has(key)) {
        seen.add(key);
        add("minor", cv.index, "alignment", `edges ${edges[i].v.toFixed(1)}px and ${edges[j].v.toFixed(1)}px nearly align — align exactly or separate decisively`, `${fmt(edges[i].t)} / ${fmt(edges[j].t)}`);
      }
    }
    // content overflowing its own box (e.g. a multi-column body that spills into extra columns)
    const seenOv = new Set();
    for (const o of cv.overflows) {
      if (seenOv.has(o.text)) continue;
      seenOv.add(o.text);
      add("critical", cv.index, "overflow", `content overflows its box by ${Math.max(o.dx, o.dy)}px${o.dx > 2 ? " horizontally (extra columns or unbreakable text)" : " vertically"} — text may be hidden or colliding`, `"${o.text.slice(0, 40)}"${o.cls ? " ." + o.cls.split(" ")[0] : ""}`);
    }
    // images
    for (const im of cv.images) {
      if (!im.nw) { add("critical", cv.index, "image", `image failed to load: ${im.src}`); continue; }
      const ar = im.nw / im.nh, br = im.box.w / im.box.h;
      if (im.fit === "fill" && Math.abs(ar - br) / ar > 0.01) add("critical", cv.index, "image-distortion", `image stretched (${ar.toFixed(3)} → ${br.toFixed(3)}); use object-fit: cover/contain`, im.src);
      const scaleNeeded = im.fit === "cover" ? Math.max(im.box.w / im.nw, im.box.h / im.nh) : Math.min(im.box.w / im.nw, im.box.h / im.nh);
      if (scaleNeeded > 1.15) add("major", cv.index, "image-resolution", `image upscaled ${(scaleNeeded * 100).toFixed(0)}% at 1x — soft at delivery size`, im.src);
    }
    // empty-band heuristic: a tall horizontal band with no content at all
    const sp = cv.spans.filter((x) => x[1] > x[0]).sort((a, b) => a[0] - b[0]);
    let reach = sp.length ? sp[0][1] : 0, gap = 0, at = 0;
    for (const [a, b] of sp.slice(1)) { if (a - reach > gap) { gap = a - reach; at = reach; } reach = Math.max(reach, b); }
    if (gap > cv.height * 0.15)
      add("minor", cv.index, "empty-band", `${Math.round(gap)}px band with no content (y ${Math.round(at)}–${Math.round(at + gap)}) — confirm it is active negative space, not leftover`);
    if (sizes.size > 7) add("minor", cv.index, "type-scale", `${sizes.size} distinct text sizes (${[...sizes].sort((a, b) => b - a).join(", ")}) — consolidate the scale`);
    if (families.size > 3) add("minor", cv.index, "type-families", `${families.size} rendered font families: ${[...families].join(", ")}`);
  }

  // copy accuracy (document-wide)
  if (copy) {
    const norm = (s) => s.normalize("NFC").replace(/­/g, "").replace(/\s+/g, " ").trim();
    const found = await page.evaluate(() => {
      const o = {};
      for (const el of document.querySelectorAll("[data-copy]")) (o[el.dataset.copy] ||= []).push(el.textContent);
      return o;
    });
    const optional = new Set(copy._optional || []);
    for (const [k, v] of Object.entries(copy)) {
      if (k.startsWith("_")) continue;
      if (!found[k]) { add(optional.has(k) ? "minor" : "critical", 0, "copy-missing", `required copy "${k}" is not placed in the design`); continue; }
      for (const got of found[k]) if (norm(got) !== norm(v))
        add("critical", 0, "copy-accuracy", `"${k}" differs from supplied copy`, `expected «${norm(v)}» got «${norm(got)}»`);
    }
    for (const k of Object.keys(found)) if (!(k in copy)) add("minor", 0, "copy-unknown", `data-copy="${k}" has no entry in the copy file`);
  }

  const count = (s) => issues.filter((i) => i.severity === s).length;
  report = {
    input, generated: new Date().toISOString(), canvases: data.map((c) => ({ index: c.index, width: c.width, height: c.height, textBlocks: c.texts.length, images: c.images.length })),
    fontsUsed: [...new Set(Object.values(fontsById).flat().map((f) => `${f.family}${f.custom ? " (web font)" : ""}`))],
    summary: { critical: count("critical"), major: count("major"), minor: count("minor"), info: count("info") },
    verdict: count("critical") ? "FAIL" : count("major") ? "REVISE" : "PASS",
    issues,
  };
} finally {
  await browser.close();
}

const out = opt("--json");
if (out) writeFileSync(out, JSON.stringify(report, null, 2));
console.log(`QA ${report.verdict}  critical ${report.summary.critical} · major ${report.summary.major} · minor ${report.summary.minor} · info ${report.summary.info}`);
console.log(`fonts rendered: ${report.fontsUsed.join(", ")}`);
for (const i of report.issues.filter((x) => x.severity !== "info"))
  console.log(`  [${i.severity}] c${i.canvas} ${i.check}: ${i.message}${i.where ? "  ← " + i.where : ""}`);
process.exit(args.includes("--strict") ? (report.verdict === "PASS" ? 0 : 1) : report.summary.critical ? 1 : 0);
