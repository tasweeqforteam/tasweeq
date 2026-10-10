// Generates composition.html for "Kashida" from analysis/parts.svg (official geometry, verbatim).
import fs from 'node:fs';
const P = (f) => new URL(f, import.meta.url);
const parts = Object.fromEntries([...fs.readFileSync(P('./analysis/parts.svg'), 'utf8').matchAll(/<path id="(p\d+)" d="([^"]+)"/g)].map((m) => [m[1], m[2]]));
const src = fs.readFileSync(P('./logo/source.svg'), 'utf8').trim();
const vb = src.match(/viewBox="([^"]+)"/)[1];
const INK = '#0A0A0A';
// Groups in reading order (RTL). shift = horizontal offset (viewBox units) in the elongated state.
const groups = [
  { id: 'ta', body: ['p7'], dots: 'p8', shift: 240 },
  { id: 'sin', body: ['p6'], dots: null, shift: 80 },
  { id: 'waw', body: ['p5'], dots: null, shift: -80 },
  { id: 'ya', body: ['p3'], dots: 'p4', shift: -80 },   // و does not join: same shift as و keeps the break constant
  { id: 'qaf', body: ['p1'], dots: 'p2', shift: -240 },
];
const BAND = { y: 330, h: 50, mid: 355 };              // joined-stroke band (measured y 325–398), inset to stay inside ink
const bars = [                                          // kashida only inside joined runs: تسو and يق
  { id: 'k1', final: [590, 890], long: [590 - 80, 890 + 240] },
  { id: 'k2', final: [240, 300], long: [240 - 240, 300 - 80] },
];
const g = groups.map((G) => `      <g id="g-${G.id}" class="grp">
        <g mask="url(#mask-${G.id})">${G.body.map((p) => `<path id="${p}" d="${parts[p]}"/>`).join('')}</g>
        ${G.dots ? `<path id="${G.dots}" class="dots" d="${parts[G.dots]}"/>` : ''}
      </g>`).join('\n');
// Feathered reveal (round 4): a gradient mask opening from the join band; soft edges never slice bowls flat.
const clips = `<linearGradient id="feather" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="0.08" stop-color="#fff"/><stop offset="0.92" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>\n        ` +
  groups.map((G) => `<mask id="mask-${G.id}" maskUnits="userSpaceOnUse" x="-400" y="0" width="1900" height="700"><rect class="cliprect" id="cr-${G.id}" x="-400" y="${BAND.mid}" width="1900" height="0.01" fill="url(#feather)"/></mask>`).join('\n        ');
const html = `<!doctype html>
<html lang="ar">
<head>
<meta charset="utf-8">
<title>تسويق — Kashida</title>
<style>.logo { position: absolute; left: 576px; top: 379px; width: 768px; height: 322px; overflow: visible; }</style>
</head>
<body>
<div id="stage">
  <svg id="logo" class="logo" viewBox="${vb}" fill="${INK}">
    <defs>
        ${clips}
    </defs>
    <g id="kashida">${bars.map((b) => `<rect id="${b.id}" x="${b.long[0]}" y="${BAND.y}" width="${b.long[1] - b.long[0]}" height="${BAND.h}"/>`).join('')}</g>
${g}
  </svg>
</div>
<template id="official-logo">
${src}
</template>
<script src="/__lm/gsap/gsap.min.js"></script>
<script src="/__lm/lm-runtime.js"></script>
<script>
const GROUPS = ${JSON.stringify(groups.map(({ id, dots, shift }) => ({ id, dots, shift })))};
const BARS = ${JSON.stringify(bars)};
LM.composition({
  width: 1920, height: 1080, fps: 60, duration: 4.0,
  background: '#F2F2EF',
  logo: { template: '#official-logo', rect: { x: 576, y: 379, w: 768, h: 322 } },
  markers: { letters: 1.75, settled: 2.2, reveal: 2.75 },
  build() {
    const tl = gsap.timeline();
    // elongated layout (x is in viewBox user units for SVG children)
    GROUPS.forEach((G) => gsap.set('#g-' + G.id, { x: G.shift }));
    gsap.set('.dots', { opacity: 0 });
    // 1 · kashida strokes draw right-to-left along the join band
    tl.fromTo('#k1', { scaleX: 0, svgOrigin: BARS[0].long[1] + ' ${BAND.mid}' }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, 0.15);
    // left run's kashida grows out of ي as ي starts opening, then ق opens at its far end (round 4)
    tl.fromTo('#k2', { scaleX: 0, svgOrigin: BARS[1].long[1] + ' ${BAND.mid}' }, { scaleX: 1, duration: 0.32, ease: 'power2.inOut' }, 0.86);
    // 2 · letter bodies open out of the band (clip grows up and down, letterforms untouched), RTL
    GROUPS.forEach((G, i) => tl.fromTo('#cr-' + G.id, { attr: { y: ${BAND.mid}, height: 0.01 } }, { attr: { y: 40, height: 560 }, duration: 0.7, ease: 'power3.out' }, 0.55 + i * 0.13 + (i >= 3 ? 0.03 : 0)));
    // 3 · the word breathes in: groups slide to their true positions, kashida shortens into the joins
    GROUPS.forEach((G) => tl.to('#g-' + G.id, { x: 0, duration: 0.85, ease: 'power3.inOut' }, 1.35));
    BARS.forEach((b) => tl.to('#' + b.id, { attr: { x: b.final[0], width: b.final[1] - b.final[0] }, duration: 0.85, ease: 'power3.inOut' }, 1.35));
    tl.to('#kashida', { opacity: 0, duration: 0.15, ease: 'none' }, 2.05);   // now fully covered by the joins
    // 4 · dots stamped like a square nib, RTL: ت, ي, ق
    // ink arrives at once (0.1 s) — a stamp, not a fade — while the nib press settles (round 3: critic saw grey mid-fade dots)
    ['p8', 'p4', 'p2'].forEach((d, i) => {
      const at = 2.05 + i * 0.12;
      tl.fromTo('#' + d, { opacity: 0 }, { opacity: 1, duration: 0.04, ease: 'none' }, at);
      tl.fromTo('#' + d, { scale: 1.6, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.38, ease: 'back.out(1.4)' }, at);
    });
    return tl;
  },
});
</script>
</body>
</html>
`;
fs.writeFileSync(P('./composition.html'), html);
console.log('composition.html written');
