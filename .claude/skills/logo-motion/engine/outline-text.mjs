#!/usr/bin/env node
// Convert live text to outlined SVG paths (for wordmarks, or to freeze a logo's <text>).
//
//   node outline-text.mjs --font <file.ttf|otf> --text "Brand" [--size 200] [--letter-spacing 0]
//        [--per-glyph] [--rtl] [--fill #000] [--out wordmark.svg] [--verify]
//
// --verify renders the same text with the same font in Chromium (HarfBuzz shaping) and reports
// a boundary-tolerant F-score (2px at 400px scale) between browser rendering and outlines (>= 0.97 expected).
//
// --per-glyph emits one <path id="g0".."gN"> per glyph (in visual order) so letters can be
// animated individually. Arabic and other joining scripts: per-glyph output keeps the shaped
// (contextual) glyph forms, but individual glyphs must never be re-positioned independently
// in the final state, and the shaping must be checked visually against a browser rendering
// (the script prints a warning). Use --rtl for right-to-left text.
import fs from 'node:fs';
import opentype from 'opentype.js';
import path from 'node:path';
import { parseArgs, launch, openRooted } from './lib/browser.mjs';

const a = parseArgs(process.argv.slice(2), { size: '200', 'letter-spacing': '0', fill: '#000' });
if (!a.font || !a.text) { console.error('usage: node outline-text.mjs --font file.ttf --text "Brand" [--per-glyph] [--rtl] [--out out.svg]'); process.exit(2); }
const buf = fs.readFileSync(a.font);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const size = parseFloat(a.size); const ls = parseFloat(a['letter-spacing']);
const text = String(a.text);
const joining = /[؀-ۿ܀-ݏݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/.test(text);
const rtl = !!a.rtl || joining;

// Shape with the font's GSUB (opentype.js applies contextual forms + ligatures for supported scripts).
const opts = { kerning: true, features: { liga: true, rlig: true, init: true, medi: true, fina: true, isol: true } };
// opentype.js throws on some GSUB lookup formats; degrade step by step and say so
// (--verify catches any resulting shaping error).
let glyphs, shaping = 'full';
try { glyphs = font.stringToGlyphs(text, opts); }
catch (e1) {
  try { glyphs = font.stringToGlyphs(text, { kerning: true, features: { liga: true } }); shaping = 'liga-only'; }
  catch (e2) { glyphs = [...text].map((ch) => font.charToGlyph(ch)); shaping = 'none (cmap only)'; }
  console.error(`[outline-text] ! opentype.js could not apply all GSUB features (${e1.message.slice(0, 80)}); shaping: ${shaping}.${joining ? ' Joining script without shaping WILL be wrong.' : ''}`);
}
let x = 0; const placed = [];
for (let i = 0; i < glyphs.length; i++) {
  const g = glyphs[i];
  placed.push({ g, x });
  let adv = (g.advanceWidth || 0) * (size / font.unitsPerEm);
  if (i + 1 < glyphs.length) adv += font.getKerningValue(g, glyphs[i + 1]) * (size / font.unitsPerEm);
  x += adv + ls;
}
const total = x - ls;
// opentype.js 2.x returns RTL runs (Arabic) already in VISUAL order with contextual forms
// applied, so glyphs are laid out left-to-right as returned. (Verified against Chromium/HarfBuzz
// with --verify; do not re-reverse.)
// Build each glyph's path from its raw outline (font units, y-up) instead of glyph.getPath():
// opentype.js 2.0 can emit NaN coordinates from getPath() for composite glyphs depending on
// lazy-load order (observed with IBM Plex Sans Arabic). Touch every path first, then transform.
for (const { g } of placed) void g.path;
const k = size / font.unitsPerEm; const r2 = (v) => Math.round(v * 100) / 100;
const vis = placed.map(({ g, x: gx }, i) => {
  const P = (x, y) => [r2(gx + x * k), r2(size - y * k)];
  let d = ''; const bb = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
  const grow = (x, y) => { bb.x1 = Math.min(bb.x1, x); bb.x2 = Math.max(bb.x2, x); bb.y1 = Math.min(bb.y1, y); bb.y2 = Math.max(bb.y2, y); };
  for (const c of g.path.commands) {
    if (c.type === 'Z') { d += 'Z'; continue; }
    const pts = c.type === 'C' ? [[c.x1, c.y1], [c.x2, c.y2], [c.x, c.y]] : c.type === 'Q' ? [[c.x1, c.y1], [c.x, c.y]] : [[c.x, c.y]];
    const t = pts.map(([x, y]) => P(x, y)); t.forEach(([x, y]) => grow(x, y));
    d += c.type + t.map((q) => q.join(' ')).join(' ');
  }
  if (/NaN|Infinity/.test(d)) throw new Error(`glyph ${g.name} produced invalid coordinates — cannot outline this text reliably with this font`);
  return { i, unicode: g.unicode, d, bb };
});
// viewBox from the real outline bounds (descenders/diacritics included), padded 2%.
const bx = vis.filter((v) => v.d).reduce((b, v) => [Math.min(b[0], v.bb.x1), Math.min(b[1], v.bb.y1), Math.max(b[2], v.bb.x2), Math.max(b[3], v.bb.y2)], [Infinity, Infinity, -Infinity, -Infinity]);
const pad = 0.02 * size; const vb = [bx[0] - pad, bx[1] - pad, bx[2] - bx[0] + 2 * pad, bx[3] - bx[1] + 2 * pad].map((v) => Math.round(v * 100) / 100);
const pathsXml = a['per-glyph']
  ? vis.filter((p) => p.d).map((p, k) => `  <path id="g${k}" d="${p.d}"/>`).join('\n')
  : `  <path d="${vis.map((p) => p.d).join('')}"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" fill="${a.fill}"${rtl ? ' data-direction="rtl"' : ''}>\n${pathsXml}\n</svg>\n`;
if (a.out) fs.writeFileSync(a.out, svg); else process.stdout.write(svg);
console.error(`[outline-text] ${(font.getEnglishName && font.getEnglishName("fullName")) || path.basename(a.font)} · ${glyphs.length} glyphs · width ${total.toFixed(1)}${rtl ? ' · RTL' : ''}`);
if (joining) console.error('[outline-text] ! Joining script: compare against a browser rendering of the same text before use (shaping coverage differs per font). Never split joined letters apart in the final state.');

if (a.verify) {
  const dir = path.dirname(path.resolve(a.font));
  const b = await launch(); const { page } = await openRooted(b, dir, { width: 1600, height: 600 });
  const html = `<!doctype html><meta charset="utf-8"><style>@font-face{font-family:V;src:url("${encodeURIComponent(path.basename(a.font))}")}body{margin:0;background:#fff}#t{position:absolute;left:20px;top:20px;font:${size}px V;line-height:1;white-space:nowrap;letter-spacing:${ls}px}</style><span id="t"${rtl ? ' dir="rtl"' : ''}>${text.replace(/</g, '&lt;')}</span>`;
  await page.route('http://lm.local/__verify.html', (r) => r.fulfill({ contentType: 'text/html; charset=utf-8', body: html }));
  await page.goto('http://lm.local/__verify.html'); await page.evaluate(() => document.fonts.ready);
  const iou = await page.evaluate(async (svgText) => {
    const mask = (cv) => { const g = cv.getContext('2d'); const d = g.getImageData(0, 0, cv.width, cv.height).data; let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1; const m = new Uint8Array(cv.width * cv.height); for (let i = 0; i < m.length; i++) { if (d[i * 4 + 3] > 127 && d[i * 4] < 128) { m[i] = 1; const x = i % cv.width, y = (i / cv.width) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } } return { m, box: [x0, y0, x1 - x0 + 1, y1 - y0 + 1], w: cv.width }; };
    const norm = (mk, N = 400) => { const [x0, y0, w, h] = mk.box; const s = N / Math.max(w, h); const o = new Uint8Array(N * N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const sx = x0 + Math.floor(x / s), sy = y0 + Math.floor(y / s); if (sx < x0 + w && sy < y0 + h) o[y * N + x] = mk.m[sy * mk.w + sx]; } return o; };
    const el = document.getElementById('t'); const r = el.getBoundingClientRect();
    const c1 = document.createElement('canvas'); c1.width = Math.ceil(r.right + 40); c1.height = Math.ceil(r.bottom + 40); const g1 = c1.getContext('2d'); g1.fillStyle = '#fff'; g1.fillRect(0, 0, c1.width, c1.height);
    g1.font = getComputedStyle(el).font; g1.letterSpacing = getComputedStyle(el).letterSpacing; g1.direction = el.dir === 'rtl' ? 'rtl' : 'ltr'; g1.fillStyle = '#000'; g1.textBaseline = 'top'; g1.fillText(el.textContent, el.dir === 'rtl' ? r.right : r.left, r.top);
    const im = await new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = URL.createObjectURL(new Blob([svgText.replace('<svg ', '<svg width="1200" ')], { type: 'image/svg+xml' })); });
    const c2 = document.createElement('canvas'); c2.width = im.width; c2.height = im.height; const g2 = c2.getContext('2d'); g2.fillStyle = '#fff'; g2.fillRect(0, 0, c2.width, c2.height); g2.drawImage(im, 0, 0);
    const N = 400; const a = norm(mask(c1)), bb = norm(mask(c2));
    const dil = (m, r = 2) => { const o = new Uint8Array(m.length); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (m[y * N + x]) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < N && Y < N) o[Y * N + X] = 1; } return o; };
    const da = dil(a), db = dil(bb); let na = 0, nb = 0, pa = 0, pb = 0, i = 0, u = 0;
    for (let k = 0; k < a.length; k++) { if (a[k]) { na++; if (db[k]) pa++; } if (bb[k]) { nb++; if (da[k]) pb++; } if (a[k] || bb[k]) { u++; if (a[k] && bb[k]) i++; } }
    const P = pa / na, R = pb / nb; return { f: (2 * P * R) / (P + R), iou: i / u };
  }, svg);
  await b.close();
  console.error(`[outline-text] verify vs Chromium shaping: boundary F-score ${iou.f.toFixed(3)} (raw IoU ${iou.iou.toFixed(3)}) ${iou.f >= 0.97 ? 'OK' : '— MISMATCH: do not use these outlines; check glyph order/shaping'}`);
  if (iou.f < 0.97) process.exitCode = 1;
}
