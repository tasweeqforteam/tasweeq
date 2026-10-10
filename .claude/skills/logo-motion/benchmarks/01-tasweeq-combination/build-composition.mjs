// Generates composition.html from logo/source.svg so official path data is embedded verbatim.
import fs from 'node:fs';
const src = fs.readFileSync(new URL('./logo/source.svg', import.meta.url), 'utf8');
const glyph = [...src.matchAll(/<g id="glyph"[\s\S]*?<\/g>/g)][0][0];
const gp = [...glyph.matchAll(/<path d="([^"]+)"\/>/g)].map((m) => m[1]);
const wmG = src.match(/<g id="wordmark"[^>]*transform="([^"]+)">([\s\S]*?)<\/g>/);
const letters = [...wmG[2].matchAll(/<path d="([^"]+)"\/>/g)].map((m) => m[1]);
const names = ['T', 'A', 'S', 'W', 'E1', 'E2', 'Q'];
const vb = src.match(/viewBox="([^"]+)"/)[1];
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Tasweeq — Two Scripts, One Mark</title>
<style>
  .logo { position: absolute; left: 410px; top: 458px; width: 1100px; height: 165px; overflow: visible; }
  .pen { fill: none; stroke: #00D9F5; stroke-linecap: butt; stroke-linejoin: round; }
</style>
</head>
<body>
<div id="stage">
  <svg id="logo" class="logo" viewBox="${vb}">
    <defs>
      <clipPath id="clip-p1"><path d="${gp[0]}"/></clipPath>
      <clipPath id="clip-p2"><path d="${gp[1]}"/></clipPath>
    </defs>
    <g id="glyph" transform="scale(3.33333)">
      <!-- p2 (Arabic body): revealed by a broad pen running right-to-left along its centre line -->
      <g clip-path="url(#clip-p2)">
        <path id="w2" class="pen" stroke-width="18" d="M80 5.65 H87 C101 5.65 111 16.5 111 30 C111 43.5 101 54 87 54 H14"/>
      </g>
      <!-- p1 (Latin T): bar left-to-right, then stem top-to-bottom (wide pen also covers the shoulder fillet) -->
      <g clip-path="url(#clip-p1)">
        <path id="w1a" class="pen" stroke-width="8.4" d="M0 5.7 H77"/>
        <path id="w1b" class="pen" stroke-width="30" d="M23.65 2 V44"/>
      </g>
      <path id="p3" fill="#00D9F5" d="${gp[2]}"/>
      <path id="p4" fill="#00D9F5" d="${gp[3]}"/>
    </g>
    <g id="wm" fill="#F2F2EF" transform="${wmG[1]}">
${letters.map((d, i) => `      <g class="slot" id="slot-${names[i]}"><path class="ltr" id="L-${names[i]}" d="${d}"/></g>`).join('\n')}
    </g>
  </svg>
</div>

<template id="official-logo">
${src.trim()}
</template>

<script src="/__lm/gsap/gsap.min.js"></script>
<script src="/__lm/gsap/DrawSVGPlugin.min.js"></script>
<script src="/__lm/gsap/CustomEase.min.js"></script>
<script src="/__lm/lm-runtime.js"></script>
<script>
LM.composition({
  width: 1920, height: 1080, fps: 60, duration: 4.0,
  background: '#0A0A0A',
  logo: { template: '#official-logo', rect: { x: 410, y: 458, w: 1100, h: 165 } },
  markers: { symbol: 2.3, reveal: 2.95 },
  setup() {
    // Line-mask per letter (site lineReveal grammar) with a SOFT bottom edge: a hard clip slices
    // horizontal strokes (E arms) into 1-px slivers as they cross it (round-4 fix, critic r3).
    const NS = 'http://www.w3.org/2000/svg';
    const wm = document.getElementById('wm');
    const FEATHER = 14;
    document.querySelectorAll('#wm .slot').forEach((slot, i) => {
      const b = slot.querySelector('path').getBBox();
      const top = b.y - 6, solid = b.height + 12, total = solid + FEATHER;
      const g = document.createElementNS(NS, 'linearGradient'); g.id = 'fade-L' + i;
      g.setAttribute('gradientUnits', 'userSpaceOnUse'); g.setAttribute('x1', 0); g.setAttribute('x2', 0); g.setAttribute('y1', top); g.setAttribute('y2', top + total);
      for (const [o, c] of [[0, '#fff'], [solid / total, '#fff'], [1, '#000']]) { const st = document.createElementNS(NS, 'stop'); st.setAttribute('offset', o); st.setAttribute('stop-color', c); g.appendChild(st); }
      const m = document.createElementNS(NS, 'mask'); m.id = 'mask-L' + i; m.setAttribute('maskUnits', 'userSpaceOnUse');
      m.setAttribute('x', b.x - 20); m.setAttribute('y', top); m.setAttribute('width', b.width + 40); m.setAttribute('height', total);
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', b.x - 20); r.setAttribute('y', top); r.setAttribute('width', b.width + 40); r.setAttribute('height', total); r.setAttribute('fill', 'url(#fade-L' + i + ')');
      m.appendChild(r); wm.appendChild(g); wm.appendChild(m);
      slot.setAttribute('mask', 'url(#mask-L' + i + ')');
      slot.dataset.h = solid;
    });
  },
  build() {
    const site = CustomEase.create('site', '0.22,1,0.36,1');        // src/lib/motion.ts EASE
    const pen = CustomEase.create('pen', '0.55,0,0.25,1');
    const tl = gsap.timeline();
    tl.fromTo('#w2', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.1, ease: pen }, 0.15);
    // dot taps, right then left (RTL)
    tl.fromTo('#p4', { scale: 0, y: -6, transformOrigin: '50% 50%' }, { scale: 1, y: 0, duration: 0.42, ease: 'back.out(2.2)' }, 1.0);
    tl.fromTo('#p3', { scale: 0, y: -6, transformOrigin: '50% 50%' }, { scale: 1, y: 0, duration: 0.42, ease: 'back.out(2.2)' }, 1.1);
    // Latin T: bar left-to-right, then stem
    tl.fromTo('#w1a', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.6, ease: 'power3.inOut' }, 1.3);
    tl.fromTo('#w1b', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.58, ease: 'power3.out' }, 1.72);
    // wordmark: one left-to-right wave that starts as the T bar lands (1.78 s) and travels on
    // at the bar's writing speed — the bar's motion hands off into the letters (round 3).
    document.querySelectorAll('#wm .ltr').forEach((el, i) => {
      const h = parseFloat(el.parentNode.dataset.h);
      tl.fromTo(el, { y: h * 1.1 }, { y: 0, duration: 0.8, ease: site }, 1.78 + i * 0.06);
    });
    return tl;
  },
});
</script>
</body>
</html>
`;
fs.writeFileSync(new URL('./composition.html', import.meta.url), html);
console.log('composition.html written');
