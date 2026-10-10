#!/usr/bin/env node
// Benchmark helper: build the generic "preset" baseline for a project (what the skill must beat):
// the whole official logo fades in with a slight scale-up, same canvas/duration/rect, then holds.
//   node baseline.mjs <project-dir>        → <project>/baseline/composition.html (+ render it yourself)
import fs from 'node:fs';
import path from 'node:path';

const P = path.resolve(process.argv[2] || '.');
const comp = fs.readFileSync(path.join(P, 'composition.html'), 'utf8');
const block = comp.slice(comp.indexOf('LM.composition('));
const cfg = (k) => { const m = block.match(new RegExp('\\b' + k + ':\\s*([^,\\n]+)')); return m && m[1].trim(); };
const tpl = comp.match(/<template id="official-logo">([\s\S]*?)<\/template>/)[1].trim();
const rect = block.match(/rect:\s*(\{[^}]+\})/)[1];
const r = Function('return ' + rect)();
const W = cfg('width'), H = cfg('height'), fps = cfg('fps'), dur = cfg('duration'), bg = cfg('background');
fs.mkdirSync(path.join(P, 'baseline'), { recursive: true });
// Copy raster assets referenced by the template (if any).
for (const m of tpl.matchAll(/href="([^"#][^"]*)"/g)) { const s = path.join(P, m[1]); if (fs.existsSync(s)) { fs.mkdirSync(path.dirname(path.join(P, 'baseline', m[1])), { recursive: true }); fs.copyFileSync(s, path.join(P, 'baseline', m[1])); } }
const html = `<!doctype html><html><head><meta charset="utf-8"><title>baseline preset</title>
<style>#logo{position:absolute;left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px}#logo svg{width:100%;height:100%;display:block}</style></head><body>
<div id="stage"><div id="logo">${tpl}</div></div>
<template id="official-logo">${tpl}</template>
<script src="/__lm/gsap/gsap.min.js"></script><script src="/__lm/lm-runtime.js"></script>
<script>LM.composition({ width: ${W}, height: ${H}, fps: ${fps}, duration: ${dur}, background: ${bg},
  logo: { template: '#official-logo', rect: ${rect} },
  build() { const tl = gsap.timeline(); tl.fromTo('#logo', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0.3); return tl; } });</script>
</body></html>`;
fs.writeFileSync(path.join(P, 'baseline', 'composition.html'), html);
console.log('wrote ' + path.join(P, 'baseline', 'composition.html'));
