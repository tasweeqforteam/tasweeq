#!/usr/bin/env node
// Create a logo-motion project: copies the logo, runs the analysis, and writes templates.
//
//   node scaffold.mjs <project-dir> --logo <file.svg|png> [--name "Brand"] [--width 1920 --height 1080]
//        [--fps 60] [--duration 4] [--background "#0E0F13"] [--logo-scale 0.42]
//
// Result:
//   <project>/logo/<source>            authoritative input (never edited)
//   <project>/analysis/                analyze.mjs output (overview.png, parts.png, parts.svg, analysis.md…)
//   <project>/concepts.md              three-direction worksheet (modules/03-creative-concepts.md)
//   <project>/blueprint.json           executable motion plan (modules/09-motion-blueprint.md)
//   <project>/composition.html         runnable composition skeleton (parts inlined, official logo template)
//   <project>/README.md                project README template
//   <project>/review.json              reviewer scorecard template for qa.py --review
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ENGINE_DIR, parseArgs } from './lib/browser.mjs';

const a = parseArgs(process.argv.slice(2), { width: '1920', height: '1080', fps: '60', duration: '4', background: '#0E0F13', 'logo-scale': '0.42' });
const dir = a._[0];
if (!dir || !a.logo) { console.error('usage: node scaffold.mjs <project-dir> --logo <file> [--name Brand]'); process.exit(2); }
const P = path.resolve(dir); const logo = path.resolve(a.logo); const ext = path.extname(logo).toLowerCase();
fs.mkdirSync(path.join(P, 'logo'), { recursive: true });
const logoDst = path.join(P, 'logo', 'source' + ext);
fs.copyFileSync(logo, logoDst);
execFileSync('node', [path.join(ENGINE_DIR, 'analyze.mjs'), logoDst, '--out', path.join(P, 'analysis'), ...(ext === '.svg' ? [] : ['--trace'])], { stdio: 'inherit' });
const an = JSON.parse(fs.readFileSync(path.join(P, 'analysis', 'analysis.auto.json'), 'utf8'));

const W = +a.width, H = +a.height; const aspect = an.aspect_ratio;
let w = W * parseFloat(a['logo-scale']), h = w / aspect;
if (h > H * 0.5) { h = H * 0.5; w = h * aspect; }
const rect = { x: Math.round((W - w) / 2), y: Math.round((H - h) / 2), w: Math.round(w), h: Math.round(h) };
const name = a.name || path.basename(P);

let stageArt, official;
if (ext === '.svg') {
  const parts = fs.readFileSync(path.join(P, 'analysis', 'parts.svg'), 'utf8').trim();
  const src = fs.readFileSync(path.join(P, 'analysis', 'source.sanitized.svg'), 'utf8').trim();
  const usePartsInStage = an.parts_svg_fidelity && an.parts_svg_fidelity.mask_iou >= 0.995;
  stageArt = (usePartsInStage ? parts : src).replace('<svg ', `<svg id="logo" class="logo" `);
  official = src;
} else {
  stageArt = `<img id="logo" class="logo" src="logo/source${ext}" alt="">`;
  official = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${an.source_size[0]} ${an.source_size[1]}"><image href="logo/source${ext}" width="${an.source_size[0]}" height="${an.source_size[1]}"/></svg>`;
}

const comp = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${name} — logo motion</title>
<style>
  /* Official brand values only. Keep animation-specific styling separate from the logo itself. */
  .logo { position: absolute; left: ${rect.x}px; top: ${rect.y}px; width: ${rect.w}px; height: ${rect.h}px; overflow: visible; }
</style>
</head>
<body>
<div id="stage">
  ${stageArt}
</div>

<!-- The official, untouched artwork. The final frame is compared against this (final-frame contract). -->
<template id="official-logo">
${official}
</template>

<script src="/__lm/gsap/gsap.min.js"></script>
<!-- Optional plugins (free with GSAP 3.13+): -->
<!-- <script src="/__lm/gsap/DrawSVGPlugin.min.js"></script> -->
<!-- <script src="/__lm/gsap/MorphSVGPlugin.min.js"></script> -->
<!-- <script src="/__lm/gsap/CustomEase.min.js"></script> -->
<script src="/__lm/lm-runtime.js"></script>
<script>
LM.composition({
  width: ${W}, height: ${H}, fps: ${+a.fps}, duration: ${+a.duration},
  background: '${a.background}',
  logo: { template: '#official-logo', rect: ${JSON.stringify(rect)} },
  markers: { reveal: ${(+a.duration * 0.65).toFixed(2)} },
  build(ctx) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    // Implement blueprint.json stage by stage. Absolute times keep it readable:
    //   tl.fromTo('#p1', { ... }, { ..., duration: 0.8 }, 0.2);
    // Every tween must END on the official geometry (no leftover transforms/opacity/filters).
    // Remember: GSAP x/y on SVG children are in viewBox units, not CSS pixels.
    return tl;
  },
});
</script>
</body>
</html>
`;
const write = (f, s) => { const p = path.join(P, f); if (fs.existsSync(p) && !a.force) { console.log('keep existing ' + f); return; } fs.writeFileSync(p, s); };
write('composition.html', comp);
const bp = JSON.parse(fs.readFileSync(path.join(ENGINE_DIR, 'templates', 'blueprint.json'), 'utf8'));
Object.assign(bp, { project: name, duration: +a.duration, fps: +a.fps, width: W, height: H, background: a.background, logo_rect: rect });
write('blueprint.json', JSON.stringify(bp, null, 2) + '\n');
write('concepts.md', fs.readFileSync(path.join(ENGINE_DIR, 'templates', 'concepts.md'), 'utf8').replace(/<brand>/g, name));
write('README.md', fs.readFileSync(path.join(ENGINE_DIR, 'templates', 'project-README.md'), 'utf8').replace(/<brand>/g, name).replace(/<project-dir>/g, dir));
write('review.json', JSON.stringify({
  reviewer: 'agent (blind critic) | human:<name>',
  scores: Object.fromEntries(['creative_originality', 'motion_quality', 'brand_relevance', 'visual_clarity'].map((k) => [k, { score: null, evidence: '' }])),
}, null, 2) + '\n');
console.log(`\n[scaffold] ${P}\n  logo rect ${JSON.stringify(rect)} on ${W}x${H}\n  next: look at analysis/overview.png + parts.png, complete analysis/analysis.md, then concepts.md`);
