/*
 * lm-runtime.js — deterministic composition runtime for the logo-motion skill.
 *
 * Every composition is a pure function of time t. The renderer (render.mjs)
 * calls window.__LM.seek(t) for each frame and screenshots the stage, so
 * nothing may depend on wall-clock time, requestAnimationFrame, or
 * Math.random(). Use LM.random(seed) for procedural variation.
 *
 * Usage (inside a composition HTML):
 *   <div id="stage"> ...your SVG/DOM/canvas... </div>
 *   <template id="official-logo"> <svg ...official artwork...> </template>
 *   <script src="/__lm/gsap/gsap.min.js"></script>        (optional plugins too)
 *   <script src="/__lm/lm-runtime.js"></script>
 *   <script>
 *     LM.composition({
 *       width: 1920, height: 1080, fps: 60, duration: 4.5,
 *       background: '#0d0f14',                 // or 'transparent'
 *       logo: { template: '#official-logo', rect: { x: 660, y: 390, w: 600, h: 300 } },
 *       markers: { 'reveal': 2.6, 'hold': 3.3 },
 *       build(ctx) { const tl = gsap.timeline(); ...; return tl; },  // GSAP path
 *       draw(t, ctx) { ... }                                         // and/or canvas path
 *     });
 *   </script>
 *
 * Open the file through `node serve.mjs <dir>` for an interactive preview
 * (scrubber, frame stepping, onion-skin of the official logo). The renderer
 * appends ?render=1, which disables the preview UI.
 */
(function () {
  'use strict';
  const params = new URLSearchParams(location.search);
  const RENDER = params.has('render');

  // ---------- deterministic helpers ----------
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  // Normalised progress of t inside [start, start+dur], clamped.
  const progress = (t, start, dur) => clamp((t - start) / dur);
  // Small, dependency-free easing set for draw() code (GSAP users can use gsap.parseEase).
  const ease = {
    linear: (k) => k,
    inQuad: (k) => k * k,
    outQuad: (k) => 1 - (1 - k) * (1 - k),
    inOutQuad: (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
    inCubic: (k) => k * k * k,
    outCubic: (k) => 1 - Math.pow(1 - k, 3),
    inOutCubic: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    outQuart: (k) => 1 - Math.pow(1 - k, 4),
    inOutQuart: (k) => (k < 0.5 ? 8 * k ** 4 : 1 - Math.pow(-2 * k + 2, 4) / 2),
    outExpo: (k) => (k === 1 ? 1 : 1 - Math.pow(2, -10 * k)),
    inOutExpo: (k) => (k === 0 ? 0 : k === 1 ? 1 : k < 0.5 ? Math.pow(2, 20 * k - 10) / 2 : (2 - Math.pow(2, -20 * k + 10)) / 2),
    outBack: (k, s = 1.70158) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2),
    // Damped spring settling to 1. zeta = damping ratio, w = angular freq.
    spring: (k, zeta = 0.45, w = 14) => 1 - Math.exp(-zeta * w * k) * Math.cos(w * Math.sqrt(1 - zeta * zeta) * k),
  };

  // ---------- blueprint compiler ----------
  // Turns blueprint.json stage tracks into an absolute-time GSAP timeline.
  // track: { target, at, duration, ease, from?, to?, set?, stagger? }
  function fromBlueprint(bp, tl) {
    if (!window.gsap) throw new Error('fromBlueprint needs GSAP loaded');
    tl = tl || gsap.timeline();
    for (const stage of bp.stages || []) {
      for (const tr of stage.tracks || []) {
        const at = tr.at != null ? tr.at : stage.start;
        const vars = Object.assign({}, tr.to || {}, {
          duration: tr.duration != null ? tr.duration : stage.end - stage.start,
          ease: tr.ease || 'power2.out',
        });
        if (tr.stagger != null) vars.stagger = tr.stagger;
        if (tr.set) tl.set(tr.target, tr.set, at);
        else if (tr.from && tr.to) tl.fromTo(tr.target, tr.from, vars, at);
        else if (tr.from) tl.from(tr.target, Object.assign({}, tr.from, { duration: vars.duration, ease: vars.ease, stagger: vars.stagger }), at);
        else tl.to(tr.target, vars, at);
      }
    }
    return tl;
  }

  // ---------- composition ----------
  let comp = null, timeline = null, stage = null, refLayer = null;
  let readyResolve;
  const ready = new Promise((r) => (readyResolve = r));

  function seek(t) {
    if (!comp) return;
    t = clamp(t, 0, comp.duration);
    if (timeline) timeline.totalTime(Math.min(t, timeline.totalDuration()), false);
    if (comp.draw) comp.draw(t, ctxObj);
    current = t;
    return t;
  }

  let current = 0;
  const ctxObj = { get stage() { return stage; }, random: (s) => mulberry32(s), clamp, lerp, progress, ease };

  function buildReference() {
    if (!comp.logo || !comp.logo.template) return null;
    const tpl = document.querySelector(comp.logo.template);
    if (!tpl) throw new Error('logo.template not found: ' + comp.logo.template);
    const r = comp.logo.rect;
    const layer = document.createElement('div');
    layer.id = '__lm-reference';
    Object.assign(layer.style, { position: 'absolute', left: '0', top: '0', width: comp.width + 'px', height: comp.height + 'px', display: 'none', zIndex: 2147483000, background: comp.background === 'transparent' ? 'transparent' : comp.background, pointerEvents: 'none' });
    const box = document.createElement('div');
    Object.assign(box.style, { position: 'absolute', left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' });
    box.appendChild(tpl.content.cloneNode(true));
    const svg = box.querySelector('svg');
    if (svg) { svg.setAttribute('width', r.w); svg.setAttribute('height', r.h); svg.style.display = 'block'; }
    layer.appendChild(box);
    stage.appendChild(layer);
    return layer;
  }

  function setupPreview() {
    const bar = document.createElement('div');
    bar.id = '__lm-ui';
    bar.innerHTML = `
      <style>
        #__lm-ui{position:fixed;left:0;right:0;bottom:0;display:flex;gap:10px;align-items:center;padding:10px 14px;background:rgba(12,12,16,.92);color:#ddd;font:12px/1.2 ui-monospace,Menlo,monospace;z-index:2147483647}
        #__lm-ui button{background:#24242c;color:#eee;border:1px solid #3a3a46;border-radius:6px;padding:5px 9px;cursor:pointer;font:inherit}
        #__lm-ui input[type=range]{flex:1}
        #__lm-ui label{display:flex;gap:4px;align-items:center;white-space:nowrap}
      </style>
      <button data-a="play">❚❚</button><button data-a="prev">◀︎</button><button data-a="next">▶︎</button>
      <input type="range" min="0" max="1000" value="0" step="1">
      <span class="t">0.000s</span>
      <label><input type="checkbox" data-a="loop" checked>loop</label>
      <label><input type="checkbox" data-a="onion">onion-skin final</label>
      <label>speed <select data-a="speed"><option>0.25</option><option>0.5</option><option selected>1</option><option>2</option></select></label>`;
    document.body.appendChild(bar);
    const range = bar.querySelector('input[type=range]');
    const tlabel = bar.querySelector('.t');
    const playBtn = bar.querySelector('[data-a=play]');
    let playing = true, loop = true, speed = 1, last = performance.now();
    const fit = () => {
      const s = Math.min(innerWidth / comp.width, (innerHeight - 48) / comp.height);
      stage.style.transform = `scale(${s})`; stage.style.transformOrigin = '0 0';
      stage.style.left = (innerWidth - comp.width * s) / 2 + 'px'; stage.style.top = (innerHeight - 48 - comp.height * s) / 2 + 'px';
    };
    addEventListener('resize', fit); fit();
    const show = (t) => { seek(t); range.value = Math.round((t / comp.duration) * 1000); tlabel.textContent = t.toFixed(3) + 's  f' + Math.round(t * comp.fps); };
    function loopFn(now) {
      const dt = (now - last) / 1000; last = now;
      if (playing) {
        let t = current + dt * speed;
        if (t > comp.duration) { if (loop) t = 0; else { t = comp.duration; playing = false; playBtn.textContent = '▶'; } }
        show(t);
      }
      requestAnimationFrame(loopFn);
    }
    requestAnimationFrame(loopFn);
    range.addEventListener('input', () => { playing = false; playBtn.textContent = '▶'; show((range.value / 1000) * comp.duration); });
    bar.addEventListener('click', (e) => {
      const a = e.target.dataset.a;
      if (a === 'play') { playing = !playing; if (playing && current >= comp.duration) current = 0; playBtn.textContent = playing ? '❚❚' : '▶'; }
      if (a === 'prev' || a === 'next') { playing = false; playBtn.textContent = '▶'; show(clamp(current + (a === 'next' ? 1 : -1) / comp.fps, 0, comp.duration)); }
    });
    bar.addEventListener('change', (e) => {
      const a = e.target.dataset.a;
      if (a === 'loop') loop = e.target.checked;
      if (a === 'speed') speed = parseFloat(e.target.value);
      if (a === 'onion' && refLayer) {
        Object.assign(refLayer.style, e.target.checked ? { display: 'block', opacity: '0.35', background: 'transparent', mixBlendMode: 'difference' } : { display: 'none' });
      }
    });
  }

  function composition(cfg) {
    const required = ['width', 'height', 'fps', 'duration'];
    for (const k of required) if (typeof cfg[k] !== 'number') throw new Error('LM.composition: missing numeric ' + k);
    comp = Object.assign({ background: '#000', markers: {} }, cfg);
    stage = document.getElementById('stage');
    if (!stage) throw new Error('LM.composition: needs <div id="stage">');
    document.documentElement.style.background = RENDER ? (comp.background === 'transparent' ? 'transparent' : comp.background) : '#111';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    Object.assign(stage.style, { position: 'absolute', left: '0', top: '0', width: comp.width + 'px', height: comp.height + 'px', overflow: 'hidden', background: comp.background === 'transparent' ? 'transparent' : comp.background });

    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.resolve(fontsReady).then(async () => {
      if (window.gsap) {
        const plugins = ['DrawSVGPlugin', 'MorphSVGPlugin', 'MotionPathPlugin', 'SplitText', 'CustomEase'].map((n) => window[n]).filter(Boolean);
        if (plugins.length) gsap.registerPlugin(...plugins);
        gsap.ticker.lagSmoothing(0);
      }
      if (comp.setup) await comp.setup(ctxObj);
      if (comp.build) {
        timeline = comp.build(ctxObj);
        if (timeline) timeline.pause(0);
        if (timeline && timeline.totalDuration() > comp.duration + 1e-3) console.warn(`[LM] timeline (${timeline.totalDuration().toFixed(3)}s) is longer than duration (${comp.duration}s) — it will be cut.`);
      }
      refLayer = buildReference();
      seek(0);
      if (!RENDER) setupPreview();
      readyResolve(meta());
    }).catch((e) => { console.error(e); window.__LM_ERROR = String(e && e.stack || e); readyResolve({ error: String(e) }); });
  }

  function meta() {
    return {
      width: comp.width, height: comp.height, fps: comp.fps, duration: comp.duration,
      background: comp.background, markers: comp.markers, hasReference: !!refLayer,
      logoRect: comp.logo ? comp.logo.rect : null,
      timelineDuration: timeline ? timeline.totalDuration() : null,
      title: document.title,
    };
  }

  window.LM = { composition, fromBlueprint, random: mulberry32, clamp, lerp, progress, ease };
  window.__LM = {
    ready,
    seek,
    meta,
    renderReference() { if (refLayer) Object.assign(refLayer.style, { display: 'block', opacity: '1', mixBlendMode: 'normal', background: comp.background === 'transparent' ? 'transparent' : comp.background }); return !!refLayer; },
    clearReference() { if (refLayer) refLayer.style.display = 'none'; },
  };
})();
