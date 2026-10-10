/*
 * analyze-page.js — runs inside headless Chromium (injected by analyze.mjs).
 * Measures a logo's structure so creative decisions start from facts:
 * parts, sub-paths, holes (negative space), primitives, symmetry, repetition,
 * alignment, colour, orientation. Everything here is measurement; any
 * classification is returned as a labelled *heuristic* for the agent to confirm.
 */
(function () {
  'use strict';
  const DRAWABLE = 'path,rect,circle,ellipse,polygon,polyline,line,text,image,use';
  const NON_RENDER_ANCESTOR = 'defs,clipPath,mask,symbol,pattern,marker,linearGradient,radialGradient,filter';
  const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
  const HEBREW = /[֐-׿]/;

  // ---------------- path parsing ----------------
  function parsePath(d) {
    const toks = d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) || [];
    const out = []; let i = 0, cmd = null, cx = 0, cy = 0, sx = 0, sy = 0;
    const num = () => parseFloat(toks[i++]);
    const isNum = () => i < toks.length && !/^[a-zA-Z]$/.test(toks[i]);
    const ARITY = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
    while (i < toks.length) {
      if (/^[a-zA-Z]$/.test(toks[i])) cmd = toks[i++];
      else if (!cmd) { i++; continue; }
      const up = cmd.toUpperCase(), rel = cmd !== up;
      if (up === 'Z') { out.push({ c: 'Z', p: [] }); cx = sx; cy = sy; cmd = null; continue; }
      if (!isNum()) { cmd = null; continue; }
      let first = true;
      while (isNum()) {
        const a = []; for (let k = 0; k < ARITY[up]; k++) a.push(num());
        if (a.some(Number.isNaN)) break;
        let c = up;
        if (up === 'M') {
          if (rel) { a[0] += cx; a[1] += cy; }
          if (!first) c = 'L';
          if (first) { sx = a[0]; sy = a[1]; }
          cx = a[0]; cy = a[1];
        } else if (up === 'L' || up === 'T') { if (rel) { a[0] += cx; a[1] += cy; } cx = a[0]; cy = a[1]; }
        else if (up === 'H') { if (rel) a[0] += cx; c = 'L'; a.push(cy); cx = a[0]; }
        else if (up === 'V') { if (rel) a[0] += cy; c = 'L'; a.unshift(cx); cy = a[1]; }
        else if (up === 'C') { if (rel) for (let k = 0; k < 6; k += 2) { a[k] += cx; a[k + 1] += cy; } cx = a[4]; cy = a[5]; }
        else if (up === 'S' || up === 'Q') { if (rel) for (let k = 0; k < 4; k += 2) { a[k] += cx; a[k + 1] += cy; } cx = a[2]; cy = a[3]; }
        else if (up === 'A') { if (rel) { a[5] += cx; a[6] += cy; } cx = a[5]; cy = a[6]; }
        out.push({ c, p: a });
        first = false;
        if (up === 'M') cmd = rel ? 'l' : 'L';
      }
    }
    return out;
  }
  const fmt = (n) => (Math.round(n * 1000) / 1000).toString();
  const segToD = (segs) => segs.map((s) => s.c + (s.p.length ? s.p.map(fmt).join(' ') : '')).join('');
  function splitSubpaths(segs) {
    const subs = []; let cur = null;
    for (const s of segs) {
      if (s.c === 'M') { cur = [s]; subs.push(cur); }
      else if (cur) cur.push(s);
    }
    return subs;
  }
  function commandStats(segs) {
    const st = { subpaths: 0, lines: 0, cubics: 0, quads: 0, arcs: 0, closes: 0, nodes: 0 };
    for (const s of segs) {
      if (s.c === 'M') st.subpaths++; else if (s.c === 'L') st.lines++; else if (s.c === 'C' || s.c === 'S') st.cubics++;
      else if (s.c === 'Q' || s.c === 'T') st.quads++; else if (s.c === 'A') st.arcs++; else if (s.c === 'Z') st.closes++;
      if (s.c !== 'Z') st.nodes++;
    }
    return st;
  }

  // ---------------- raster helpers ----------------
  function loadImage(src) {
    return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error('image load failed')); im.src = src; });
  }
  async function rasterSVG(svgText, w, h) {
    const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));
    try {
      const im = await loadImage(url);
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0, w, h);
      return g.getImageData(0, 0, w, h);
    } finally { URL.revokeObjectURL(url); }
  }
  function alphaMask(img, thr = 128) {
    const m = new Uint8Array(img.width * img.height);
    for (let i = 0, j = 3; i < m.length; i++, j += 4) m[i] = img.data[j] >= thr ? 1 : 0;
    return m;
  }
  function maskStats(m, w, h) {
    let n = 0, sx = 0, sy = 0, x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (m[y * w + x]) { n++; sx += x; sy += y; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (!n) return { area: 0 };
    const cx = sx / n, cy = sy / n;
    let mxx = 0, myy = 0, mxy = 0;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (m[y * w + x]) { const dx = x - cx, dy = y - cy; mxx += dx * dx; myy += dy * dy; mxy += dx * dy; }
    const angle = 0.5 * Math.atan2(2 * mxy, mxx - myy) * 180 / Math.PI;
    const l1 = (mxx + myy) / 2 + Math.sqrt(((mxx - myy) / 2) ** 2 + mxy * mxy), l2 = (mxx + myy) / 2 - Math.sqrt(((mxx - myy) / 2) ** 2 + mxy * mxy);
    return { area: n, cx, cy, bbox: [x0, y0, x1 - x0 + 1, y1 - y0 + 1], orientation_deg: Math.round(angle * 10) / 10, elongation: l2 > 0 ? Math.round(Math.sqrt(l1 / l2) * 100) / 100 : null };
  }
  function label(m, w, h, conn8 = true) {
    const lab = new Int32Array(w * h); const q = new Int32Array(w * h); let n = 0; const comps = [];
    for (let s = 0; s < m.length; s++) {
      if (!m[s] || lab[s]) continue;
      n++; let qh = 0, qt = 0; q[qt++] = s; lab[s] = n; let area = 0, x0 = w, y0 = h, x1 = 0, y1 = 0, touches = false;
      while (qh < qt) {
        const p = q[qh++]; const x = p % w, y = (p / w) | 0; area++;
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touches = true;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue; if (!conn8 && dx && dy) continue;
          const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const np = ny * w + nx; if (m[np] && !lab[np]) { lab[np] = n; q[qt++] = np; }
        }
      }
      comps.push({ id: n, area, bbox: [x0, y0, x1 - x0 + 1, y1 - y0 + 1], touchesBorder: touches });
    }
    return { lab, comps };
  }
  // Holes = background regions not connected to the canvas border (counters, enclosed negative space).
  function holes(m, w, h) {
    const bg = new Uint8Array(m.length); for (let i = 0; i < m.length; i++) bg[i] = m[i] ? 0 : 1;
    const { lab, comps } = label(bg, w, h, false);
    return { lab, holes: comps.filter((c) => !c.touchesBorder) };
  }
  function iou(a, b) { let i = 0, u = 0; for (let k = 0; k < a.length; k++) { if (a[k] || b[k]) { u++; if (a[k] && b[k]) i++; } } return u ? i / u : 1; }
  function symmetry(m, w, h) {
    const st = maskStats(m, w, h); if (!st.area) return {};
    const [bx, by, bw, bh] = st.bbox;
    const crop = new Uint8Array(bw * bh); for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) crop[y * bw + x] = m[(by + y) * w + bx + x];
    const fh = new Uint8Array(crop.length), fv = new Uint8Array(crop.length), r180 = new Uint8Array(crop.length);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) { const v = crop[y * bw + x]; fh[y * bw + (bw - 1 - x)] = v; fv[(bh - 1 - y) * bw + x] = v; r180[(bh - 1 - y) * bw + (bw - 1 - x)] = v; }
    const r = (v) => Math.round(v * 1000) / 1000;
    return { mirror_vertical_axis: r(iou(crop, fh)), mirror_horizontal_axis: r(iou(crop, fv)), rotational_180: r(iou(crop, r180)) };
  }
  // Normalised 48x48 shape signature (aspect-preserving) for repetition detection.
  function signature(m, w, h, bbox, N = 48) {
    const [bx, by, bw, bh] = bbox; const s = N / Math.max(bw, bh); const ox = (N - bw * s) / 2, oy = (N - bh * s) / 2;
    const sig = new Uint8Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const sx = Math.floor((x - ox) / s), sy = Math.floor((y - oy) / s);
      if (sx >= 0 && sy >= 0 && sx < bw && sy < bh) sig[y * N + x] = m[(by + sy) * w + bx + sx];
    }
    return sig;
  }
  function dihedral(sig, N = 48) {
    const t = []; const T = (f) => { const o = new Uint8Array(N * N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const [u, v] = f(x, y); o[v * N + u] = sig[y * N + x]; } return o; };
    const M = N - 1;
    t.push(['identity', sig]); t.push(['flip-h', T((x, y) => [M - x, y])]); t.push(['flip-v', T((x, y) => [x, M - y])]); t.push(['rot180', T((x, y) => [M - x, M - y])]);
    t.push(['rot90', T((x, y) => [M - y, x])]); t.push(['rot270', T((x, y) => [y, M - x])]);
    return t;
  }
  function convexHullArea(m, w, h, bbox) {
    const [bx, by, bw, bh] = bbox; const pts = [];
    for (let y = by; y < by + bh; y++) { let l = -1, r = -1; for (let x = bx; x < bx + bw; x++) if (m[y * w + x]) { if (l < 0) l = x; r = x; } if (l >= 0) { pts.push([l, y], [r + 1, y], [l, y + 1], [r + 1, y + 1]); } }
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    const hull = lo.slice(0, -1).concat(up.slice(0, -1)); let a = 0;
    for (let i = 0; i < hull.length; i++) { const p = hull[i], q = hull[(i + 1) % hull.length]; a += p[0] * q[1] - q[0] * p[1]; }
    return Math.abs(a) / 2;
  }
  // Fit a circle to sampled outline points (Kasa algebraic fit).
  function circleFit(pts) {
    const n = pts.length; if (n < 8) return null;
    let sx = 0, sy = 0; for (const [x, y] of pts) { sx += x; sy += y; } const mx = sx / n, my = sy / n;
    let suu = 0, svv = 0, suv = 0, suuu = 0, svvv = 0, suvv = 0, svuu = 0;
    for (const [x, y] of pts) { const u = x - mx, v = y - my; suu += u * u; svv += v * v; suv += u * v; suuu += u * u * u; svvv += v * v * v; suvv += u * v * v; svuu += v * u * u; }
    const det = suu * svv - suv * suv; if (Math.abs(det) < 1e-9) return null;
    const b1 = 0.5 * (suuu + suvv), b2 = 0.5 * (svvv + svuu);
    const uc = (b1 * svv - b2 * suv) / det, vc = (suu * b2 - suv * b1) / det;
    const cx = uc + mx, cy = vc + my; const r = Math.sqrt(uc * uc + vc * vc + (suu + svv) / n);
    let e = 0; for (const [x, y] of pts) e += (Math.hypot(x - cx, y - cy) - r) ** 2;
    return { cx, cy, r, rel_rms: Math.sqrt(e / n) / r };
  }

  // ---------------- SVG analysis ----------------
  function hasNonRenderAncestor(el) { let p = el.parentElement; while (p) { if (p.matches && p.matches(NON_RENDER_ANCESTOR)) return true; p = p.parentElement; } return false; }
  function styleOf(el) {
    const cs = getComputedStyle(el);
    return { fill: cs.fill, stroke: cs.stroke, strokeWidth: parseFloat(cs.strokeWidth) || 0, opacity: parseFloat(cs.opacity), fillOpacity: parseFloat(cs.fillOpacity), fillRule: cs.fillRule, visibility: cs.visibility, display: cs.display };
  }
  function relMatrix(svg, el) {
    const a = svg.getScreenCTM().inverse().multiply(el.getScreenCTM());
    return [a.a, a.b, a.c, a.d, a.e, a.f];
  }
  const isIdentity = (m) => Math.abs(m[0] - 1) < 1e-9 && Math.abs(m[1]) < 1e-9 && Math.abs(m[2]) < 1e-9 && Math.abs(m[3] - 1) < 1e-9 && Math.abs(m[4]) < 1e-9 && Math.abs(m[5]) < 1e-9;
  const applyM = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  function elementToD(el) {
    const t = el.tagName.toLowerCase(); const g = (a) => parseFloat(el.getAttribute(a)) || 0;
    if (t === 'path') return el.getAttribute('d') || '';
    if (t === 'rect') { const x = g('x'), y = g('y'), w = g('width'), h = g('height'); let rx = el.hasAttribute('rx') ? g('rx') : (el.hasAttribute('ry') ? g('ry') : 0); let ry = el.hasAttribute('ry') ? g('ry') : rx; rx = Math.min(rx, w / 2); ry = Math.min(ry, h / 2);
      if (!rx && !ry) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
      return `M${x + rx} ${y}H${x + w - rx}A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}V${y + h - ry}A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}H${x + rx}A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}V${y + ry}A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z`; }
    if (t === 'circle' || t === 'ellipse') { const cx = g('cx'), cy = g('cy'); const rx = t === 'circle' ? g('r') : g('rx'), ry = t === 'circle' ? g('r') : g('ry'); return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`; }
    if (t === 'polygon' || t === 'polyline') { const p = (el.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number); let d = ''; for (let i = 0; i + 1 < p.length; i += 2) d += (i ? 'L' : 'M') + p[i] + ' ' + p[i + 1]; return d + (t === 'polygon' ? 'Z' : ''); }
    if (t === 'line') return `M${g('x1')} ${g('y1')}L${g('x2')} ${g('y2')}`;
    return null;
  }

  async function analyzeSVG(svgText, opts = {}) {
    const R = opts.raster || 1024;
    const host = document.getElementById('host'); host.innerHTML = svgText;
    const svg = host.querySelector('svg'); if (!svg) throw new Error('no <svg> root');
    const warnings = [];
    // Establish viewBox / pixel size.
    let vb = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width ? [svg.viewBox.baseVal.x, svg.viewBox.baseVal.y, svg.viewBox.baseVal.width, svg.viewBox.baseVal.height] : null;
    if (!vb) {
      const w = parseFloat(svg.getAttribute('width')), h = parseFloat(svg.getAttribute('height'));
      if (w && h) vb = [0, 0, w, h]; else { const b = svg.getBBox(); vb = [b.x, b.y, b.width, b.height]; }
      warnings.push('SVG has no viewBox; derived ' + vb.map(fmt).join(' ') + '. Add a viewBox before animating.');
      svg.setAttribute('viewBox', vb.join(' '));
    }
    const k = R / Math.max(vb[2], vb[3]); const W = Math.max(1, Math.round(vb[2] * k)), H = Math.max(1, Math.round(vb[3] * k));
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.style.display = 'block';
    const serialize = () => new XMLSerializer().serializeToString(svg);

    // Inventory of features that affect animation.
    const features = {
      groups: svg.querySelectorAll('g').length,
      transforms: svg.querySelectorAll('[transform]').length,
      clipPaths: svg.querySelectorAll('clipPath').length, masks: svg.querySelectorAll('mask').length,
      gradients: svg.querySelectorAll('linearGradient,radialGradient').length, filters: svg.querySelectorAll('filter').length,
      patterns: svg.querySelectorAll('pattern').length, images: svg.querySelectorAll('image').length,
      texts: svg.querySelectorAll('text').length, uses: svg.querySelectorAll('use').length,
      styles: svg.querySelectorAll('style').length, strokes_only: 0,
    };
    if (features.images) warnings.push(`${features.images} embedded <image> element(s): raster content inside the SVG cannot be path-animated.`);
    if (features.texts) warnings.push(`${features.texts} live <text> element(s): rendering depends on installed fonts. Outline to paths (engine/outline-text.mjs) or ship the font before animating.`);
    if (features.filters) warnings.push('SVG filters present: expensive per frame and not supported by Lottie.');

    const els = [...svg.querySelectorAll(DRAWABLE)].filter((e) => !hasNonRenderAncestor(e));
    const elements = []; const parts = [];
    els.forEach((el, idx) => {
      const st = styleOf(el); const tag = el.tagName.toLowerCase();
      if (st.display === 'none' || st.visibility === 'hidden') return;
      const id = el.id || null; const matrix = relMatrix(svg, el);
      let bb = null; try { const b = el.getBBox(); bb = [b.x, b.y, b.width, b.height]; } catch (e) {}
      const info = { index: idx, tag, id, matrix: isIdentity(matrix) ? null : matrix.map((v) => Math.round(v * 1e5) / 1e5), bbox_local: bb && bb.map((v) => Math.round(v * 1000) / 1000), style: st };
      if (tag === 'text') {
        const s = el.textContent.trim(); info.text = s; info.rtl = ARABIC.test(s) || HEBREW.test(s); info.arabic = ARABIC.test(s);
        info.font = getComputedStyle(el).fontFamily;
      }
      if (st.fill === 'none' && st.stroke !== 'none') features.strokes_only++;
      const d = elementToD(el);
      if (d != null) {
        const segs = parsePath(d); info.commands = commandStats(segs);
        try { info.length = Math.round(el.getTotalLength ? el.getTotalLength() : 0); } catch (e) {}
        splitSubpaths(segs).forEach((sub, si) => parts.push({ elIndex: elements.length, el, sub, si, matrix, style: st }));
      }
      elements.push(info);
    });

    // Full logo raster + masks.
    const fullImg = await rasterSVG(serialize(), W, H); const full = alphaMask(fullImg);
    const fullStats = maskStats(full, W, H);
    // Per sub-path rasters: decide which sub-paths are holes of their element.
    const elemMaskCache = new Map();
    const ns = 'http://www.w3.org/2000/svg';
    const isoSVG = (d, matrix, fillRule) => {
      const t = matrix && !isIdentity(matrix) ? ` transform="matrix(${matrix.join(' ')})"` : '';
      return `<svg xmlns="${ns}" viewBox="${vb.join(' ')}" width="${W}" height="${H}"><path d="${d}" fill="#000" fill-rule="${fillRule || 'nonzero'}"${t}/></svg>`;
    };
    for (const p of parts) {
      if (!elemMaskCache.has(p.elIndex)) {
        const all = parts.filter((q) => q.elIndex === p.elIndex).map((q) => segToD(q.sub)).join('');
        elemMaskCache.set(p.elIndex, alphaMask(await rasterSVG(isoSVG(all, p.matrix, p.style.fillRule), W, H)));
      }
      const d = segToD(p.sub); p.d = d;
      const m = alphaMask(await rasterSVG(isoSVG(d, p.matrix, 'nonzero'), W, H));
      const em = elemMaskCache.get(p.elIndex);
      let inside = 0, filled = 0; for (let i = 0; i < m.length; i++) if (m[i]) { inside++; if (em[i]) filled++; }
      p.ownArea = inside; p.isHole = inside > 0 && filled / inside < 0.5; p.mask = m;
      // Sample outline (in raster px) for circle fit.
      const tmp = document.createElementNS(ns, 'path'); tmp.setAttribute('d', d); svg.appendChild(tmp);
      try {
        const L = tmp.getTotalLength(); p.lengthUser = L; const pts = [];
        for (let s = 0; s < 72; s++) { const q = tmp.getPointAtLength((L * s) / 72); const [x, y] = applyM(p.matrix, q.x, q.y); pts.push([(x - vb[0]) * k, (y - vb[1]) * k]); }
        p.circle = circleFit(pts);
      } catch (e) { p.lengthUser = 0; }
      tmp.remove();
    }
    // Attach holes to the smallest enclosing outer sub-path of the same element.
    const outers = parts.filter((p) => !p.isHole && p.ownArea > 0);
    for (const h of parts.filter((p) => p.isHole)) {
      let best = null, bestA = Infinity;
      for (const o of outers) { if (o.elIndex !== h.elIndex) continue; let ok = 0, tot = 0; for (let i = 0; i < h.mask.length; i += 3) if (h.mask[i]) { tot++; if (o.mask[i]) ok++; } if (tot && ok / tot > 0.9 && o.ownArea < bestA) { best = o; bestA = o.ownArea; } }
      if (best) (best.holes = best.holes || []).push(h); else h.isHole = false; // orphan: treat as its own part
    }
    // Build final part list (outer + its holes), with raster measurements.
    const finalParts = [];
    for (const o of parts.filter((p) => !p.isHole && p.ownArea > 0)) {
      const d = o.d + (o.holes || []).map((h) => h.d).join('');
      const m = o.holes && o.holes.length ? alphaMask(await rasterSVG(isoSVG(d, o.matrix, o.style.fillRule), W, H)) : o.mask;
      const ms = maskStats(m, W, H); if (!ms.area) continue;
      const hull = convexHullArea(m, W, H, ms.bbox);
      const segs = parsePath(d); const cs = commandStats(segs);
      finalParts.push({
        id: 'p' + (finalParts.length + 1), source_element: o.elIndex, subpath_index: o.si, d, matrix: isIdentity(o.matrix) ? null : o.matrix,
        fill: o.style.fill, stroke: o.style.stroke, stroke_width: o.style.strokeWidth, fill_rule: o.style.fillRule,
        holes: (o.holes || []).length, commands: cs,
        area_share: Math.round((ms.area / fullStats.area) * 1000) / 1000,
        bbox_norm: ms.bbox.map((v, i) => Math.round((v / (i % 2 ? H : W)) * 1000) / 1000),
        bbox_px: ms.bbox, centroid_norm: [Math.round((ms.cx / W) * 1000) / 1000, Math.round((ms.cy / H) * 1000) / 1000],
        orientation_deg: ms.orientation_deg, elongation: ms.elongation, solidity: Math.round((ms.area / Math.max(1, hull)) * 1000) / 1000,
        outline_length_user: Math.round(o.lengthUser * 100) / 100,
        primitive: o.circle && o.circle.rel_rms < 0.02 && !(o.holes || []).length ? 'circle' : (o.circle && o.circle.rel_rms < 0.02 ? 'ring' : (cs.cubics + cs.quads + cs.arcs === 0 ? 'polygon' : null)),
        _mask: m,
      });
    }

    const result = await rasterMeasures(full, W, H, finalParts, fullImg);
    result.kind = 'svg';
    result.viewBox = vb; result.raster_size = [W, H]; result.aspect_ratio = Math.round((vb[2] / vb[3]) * 1000) / 1000;
    result.features = features; result.elements = elements; result.warnings = warnings.concat(result.warnings || []);
    const tot = elements.reduce((a, e) => { const c = e.commands || {}; a.lines += c.lines || 0; a.curves += (c.cubics || 0) + (c.quads || 0); a.arcs += c.arcs || 0; a.nodes += c.nodes || 0; return a; }, { lines: 0, curves: 0, arcs: 0, nodes: 0 });
    result.geometry = {
      segment_totals: tot,
      straight_ratio: Math.round((tot.lines / Math.max(1, tot.lines + tot.curves + tot.arcs)) * 1000) / 1000,
      circle_parts: finalParts.filter((p) => p.primitive === 'circle' || p.primitive === 'ring').map((p) => p.id),
      polygon_parts: finalParts.filter((p) => p.primitive === 'polygon').map((p) => p.id),
      complexity: tot.nodes < 60 ? 'low' : tot.nodes < 300 ? 'medium' : 'high',
    };
    // Prepared part-tree SVG (one addressable path per visual part, holes kept with their parent).
    const partsSvg = `<svg xmlns="${ns}" viewBox="${vb.join(' ')}">\n` + finalParts.map((p) => `  <path id="${p.id}" d="${p.d}" fill="${p.fill === 'none' ? 'none' : rgbToHex(p.fill)}"${p.stroke !== 'none' ? ` stroke="${rgbToHex(p.stroke)}" stroke-width="${p.stroke_width}"` : ''} fill-rule="${p.fill_rule}"${p.matrix ? ` transform="matrix(${p.matrix.map(fmt).join(' ')})"` : ''}/>`).join('\n') + '\n</svg>\n';
    const partsImg = await rasterSVG(partsSvg.replace('<svg ', `<svg width="${W}" height="${H}" `), W, H);
    result.parts_svg = partsSvg;
    result.parts_svg_fidelity = pixelFidelity(fullImg, partsImg);
    if (result.parts_svg_fidelity.mask_iou < 0.995) result.warnings.push(`parts.svg differs from the source (IoU ${result.parts_svg_fidelity.mask_iou}). Gradients, clip paths, masks, strokes or text are not fully reproduced; animate the source structure instead of parts.svg.`);
    return result;
  }

  function rgbToHex(c) {
    const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) return c;
    const [r, g, b] = m[1].split(',').map((v) => parseFloat(v));
    return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  function pixelFidelity(a, b) {
    const ma = alphaMask(a), mb = alphaMask(b); let diff = 0, n = 0;
    for (let i = 0; i < ma.length; i++) if (ma[i] || mb[i]) { n++; const j = i * 4; diff += (Math.abs(a.data[j] - b.data[j]) + Math.abs(a.data[j + 1] - b.data[j + 1]) + Math.abs(a.data[j + 2] - b.data[j + 2])) / 3; }
    return { mask_iou: Math.round(iou(ma, mb) * 10000) / 10000, mean_rgb_error: Math.round((n ? diff / n : 0) * 100) / 100 };
  }

  // Measurements shared by SVG and raster inputs.
  async function rasterMeasures(full, W, H, parts, img) {
    const warnings = [];
    const fs = maskStats(full, W, H);
    const islands = label(full, W, H, true).comps.filter((c) => c.area > fs.area * 0.0005);
    const hl = holes(full, W, H);
    const holeList = hl.holes.filter((hh) => hh.area > fs.area * 0.0005).map((hh, i) => ({ id: 'h' + (i + 1), area_share_of_ink: Math.round((hh.area / fs.area) * 1000) / 1000, bbox_px: hh.bbox, bbox_norm: hh.bbox.map((v, j) => Math.round((v / (j % 2 ? H : W)) * 1000) / 1000) }));
    // Repetition: compare part signatures under dihedral transforms.
    const sigs = parts.map((p) => signature(p._mask, W, H, p.bbox_px));
    const repeats = [];
    for (let i = 0; i < parts.length; i++) {
      const tf = dihedral(sigs[i]);
      for (let j = i + 1; j < parts.length; j++) {
        const ai = parts[i].bbox_px, aj = parts[j].bbox_px; const si = Math.max(ai[2], ai[3]), sj = Math.max(aj[2], aj[3]); const ratio = si / sj;
        let best = { s: 0, t: null }; for (const [n, s] of tf) { const v = iou(s, sigs[j]); if (v > best.s) best = { s: v, t: n }; }
        if (best.s > 0.86) repeats.push({ a: parts[i].id, b: parts[j].id, similarity: Math.round(best.s * 1000) / 1000, transform: best.t, scale_ratio: Math.round(ratio * 1000) / 1000 });
      }
    }
    // Alignment: shared bbox edges / centres across parts (construction lines).
    const tol = 0.006 * Math.max(W, H); const lines = [];
    for (const axis of ['x', 'y']) {
      const vals = [];
      for (const p of parts) { const [x, y, w, h] = p.bbox_px; if (axis === 'x') vals.push([x, 'left', p.id], [x + w / 2, 'center', p.id], [x + w, 'right', p.id]); else vals.push([y, 'top', p.id], [y + h / 2, 'middle', p.id], [y + h, 'bottom', p.id]); }
      vals.sort((a, b) => a[0] - b[0]);
      let grp = [];
      const flush = () => { const ids = [...new Set(grp.map((g) => g[2]))]; if (ids.length >= 2) lines.push({ axis, at_norm: Math.round((grp.reduce((s, g) => s + g[0], 0) / grp.length / (axis === 'x' ? W : H)) * 1000) / 1000, members: grp.map((g) => `${g[2]}.${g[1]}`) }); grp = []; };
      for (const v of vals) { if (grp.length && v[0] - grp[grp.length - 1][0] > tol) flush(); grp.push(v); }
      flush();
    }
    // Colour palette weighted by ink coverage (exact colours of fully opaque interior pixels,
    // so anti-aliased edges don't invent in-between colours).
    const counts = new Map(); let opaque = 0;
    for (let i = 0; i < full.length; i++) if (full[i]) { const j = i * 4; if (img.data[j + 3] < 250) continue; opaque++; const key = (img.data[j] << 16) | (img.data[j + 1] << 8) | img.data[j + 2]; counts.set(key, (counts.get(key) || 0) + 1); }
    const palette = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).filter((e) => e[1] / Math.max(1, opaque) > 0.01).map(([key, c]) => ({ hex: '#' + key.toString(16).padStart(6, '0').toUpperCase(), share: Math.round((c / Math.max(1, opaque)) * 1000) / 1000 }));
    // Layout heuristics (explicitly heuristic — the agent must confirm visually).
    const hs = islands.map((c) => c.bbox[3]); const meanH = hs.reduce((a, b) => a + b, 0) / Math.max(1, hs.length);
    const cv = hs.length > 1 ? Math.sqrt(hs.reduce((a, b) => a + (b - meanH) ** 2, 0) / hs.length) / meanH : 0;
    const largest = islands.reduce((a, c) => Math.max(a, c.area), 0) / Math.max(1, fs.area);
    const heuristics = {
      note: 'Heuristic signals from geometry only. Confirm by looking at overview.png before relying on them.',
      island_count: islands.length,
      row_of_similar_islands: islands.length >= 4 && cv < 0.45 && W / H > 2.2,
      largest_island_share: Math.round(largest * 1000) / 1000,
      likely_structure: (() => {
        // Letter-like islands: similar heights around the median. A markedly taller island beside a row of them = combination mark.
        const sorted = hs.slice().sort((a, b) => a - b); const med = sorted[sorted.length >> 1] || 0;
        const letterLike = hs.filter((h) => Math.abs(h - med) / Math.max(1, med) < 0.25).length;
        const tall = islands.filter((c) => c.bbox[3] > med * 1.3);
        if (letterLike >= 3 && tall.length >= 1 && W / H > 2.2) return 'combination mark (symbol + lettering?)';
        if (islands.length >= 4 && cv < 0.45 && W / H > 2.2) return largest > 0.35 ? 'combination mark (symbol + lettering?)' : 'wordmark / lettering?';
        return islands.length <= 3 ? 'symbol / monogram / emblem?' : 'multi-part mark?';
      })(),
      ink_coverage_of_bbox: fs.bbox ? Math.round((fs.area / (fs.bbox[2] * fs.bbox[3])) * 1000) / 1000 : null,
      visual_balance_offset: fs.bbox ? [Math.round(((fs.cx - (fs.bbox[0] + fs.bbox[2] / 2)) / fs.bbox[2]) * 1000) / 1000, Math.round(((fs.cy - (fs.bbox[1] + fs.bbox[3] / 2)) / fs.bbox[3]) * 1000) / 1000] : null,
    };
    return { ink: { area_px: fs.area, bbox_px: fs.bbox, orientation_deg: fs.orientation_deg, elongation: fs.elongation }, symmetry: symmetry(full, W, H), islands: islands.map((c, i) => ({ id: 'i' + (i + 1), area_share: Math.round((c.area / fs.area) * 1000) / 1000, bbox_px: c.bbox })), holes: holeList, parts, repetition: repeats, alignment: lines, palette, heuristics, warnings };
  }

  // ---------------- raster input ----------------
  async function analyzeRaster(dataUrl, opts = {}) {
    const im = await loadImage(dataUrl); const warnings = [];
    const srcW = im.naturalWidth, srcH = im.naturalHeight;
    if (Math.min(srcW, srcH) < 400) warnings.push(`Low resolution (${srcW}x${srcH}). Path-level animation would need re-drawn vectors; prefer whole-image or mask-based motion, or ask for the vector source.`);
    const s = Math.min(1, (opts.raster || 1024) / Math.max(srcW, srcH)); const W = Math.round(srcW * s), H = Math.round(srcH * s);
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0, W, H);
    const img = g.getImageData(0, 0, W, H); const px = img.data;
    let transparent = 0; for (let i = 3; i < px.length; i += 4) if (px[i] < 250) transparent++;
    let mask, background;
    if (transparent > W * H * 0.05) { mask = alphaMask(img); background = 'transparent'; }
    else {
      // Background = median of border pixels; ink = pixels far from it.
      const border = []; for (let x = 0; x < W; x++) { border.push(x, (H - 1) * W + x); } for (let y = 0; y < H; y++) { border.push(y * W, y * W + W - 1); }
      const med = [0, 1, 2].map((ch) => { const v = border.map((p) => px[p * 4 + ch]).sort((a, b) => a - b); return v[v.length >> 1]; });
      background = '#' + med.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
      mask = new Uint8Array(W * H); for (let i = 0; i < mask.length; i++) { const j = i * 4; const d = Math.abs(px[j] - med[0]) + Math.abs(px[j + 1] - med[1]) + Math.abs(px[j + 2] - med[2]); mask[i] = d > 60 ? 1 : 0; }
      // Make ink opaque, background transparent, for the measures below.
      for (let i = 0; i < mask.length; i++) px[i * 4 + 3] = mask[i] ? 255 : 0;
    }
    const lab = label(mask, W, H, true); const fsA = mask.reduce((a, b) => a + b, 0);
    const parts = lab.comps.filter((cc) => cc.area > fsA * 0.002).map((cc, i) => {
      const m = new Uint8Array(W * H); for (let p = 0; p < m.length; p++) if (lab.lab[p] === cc.id) m[p] = 1;
      const ms = maskStats(m, W, H); const hull = convexHullArea(m, W, H, ms.bbox);
      return { id: 'p' + (i + 1), area_share: Math.round((ms.area / fsA) * 1000) / 1000, bbox_px: ms.bbox, bbox_norm: ms.bbox.map((v, j) => Math.round((v / (j % 2 ? H : W)) * 1000) / 1000), centroid_norm: [Math.round((ms.cx / W) * 1000) / 1000, Math.round((ms.cy / H) * 1000) / 1000], orientation_deg: ms.orientation_deg, elongation: ms.elongation, solidity: Math.round((ms.area / Math.max(1, hull)) * 1000) / 1000, _mask: m };
    });
    const res = await rasterMeasures(mask, W, H, parts, img);
    res.kind = 'raster'; res.source_size = [srcW, srcH]; res.raster_size = [W, H]; res.background = background; res.aspect_ratio = Math.round((srcW / srcH) * 1000) / 1000;
    res.warnings = warnings.concat(res.warnings);
    window.__lastRasterCanvas = c;
    return res;
  }

  // ---------------- visual aids ----------------
  const COLORS = ['#ff3b5c', '#20c997', '#4dabf7', '#ffd43b', '#b197fc', '#ff922b', '#63e6be', '#f783ac', '#a9e34b', '#74c0fc'];
  async function drawOverview(src, isSvg, res) {
    const [W, H] = res.raster_size; const pad = 40;
    const c = document.createElement('canvas'); c.width = W + pad * 2; c.height = H + pad * 2; const g = c.getContext('2d');
    // checkerboard to reveal transparency
    for (let y = 0; y < c.height; y += 16) for (let x = 0; x < c.width; x += 16) { g.fillStyle = ((x + y) / 16) % 2 ? '#2a2a30' : '#232328'; g.fillRect(x, y, 16, 16); }
    const im = await loadImage(isSvg ? URL.createObjectURL(new Blob([src], { type: 'image/svg+xml' })) : src);
    g.drawImage(im, pad, pad, W, H);
    // holes
    g.fillStyle = 'rgba(255,0,200,0.45)';
    for (const h of res.holes) { const [x, y, w, hh] = h.bbox_px; g.strokeStyle = '#ff00c8'; g.setLineDash([3, 3]); g.strokeRect(pad + x, pad + y, w, hh); g.setLineDash([]); g.font = 'bold 13px sans-serif'; g.fillStyle = '#ff00c8'; g.fillText(h.id, pad + x + 2, pad + y + hh - 3); }
    // alignment guides
    g.strokeStyle = 'rgba(255,255,255,0.28)'; g.setLineDash([6, 5]);
    for (const l of res.alignment) { g.beginPath(); if (l.axis === 'x') { const x = pad + l.at_norm * W; g.moveTo(x, 4); g.lineTo(x, c.height - 4); } else { const y = pad + l.at_norm * H; g.moveTo(4, y); g.lineTo(c.width - 4, y); } g.stroke(); }
    g.setLineDash([]);
    // symmetry axes
    const sy = res.symmetry || {}; const [bx, by, bw, bh] = res.ink.bbox_px || [0, 0, W, H];
    g.strokeStyle = '#ffd43b'; g.lineWidth = 2;
    if (sy.mirror_vertical_axis > 0.9) { g.beginPath(); g.moveTo(pad + bx + bw / 2, pad + by - 10); g.lineTo(pad + bx + bw / 2, pad + by + bh + 10); g.stroke(); }
    if (sy.mirror_horizontal_axis > 0.9) { g.beginPath(); g.moveTo(pad + bx - 10, pad + by + bh / 2); g.lineTo(pad + bx + bw + 10, pad + by + bh / 2); g.stroke(); }
    g.lineWidth = 1.5;
    res.parts.forEach((p, i) => { const [x, y, w, h] = p.bbox_px; g.strokeStyle = COLORS[i % COLORS.length]; g.strokeRect(pad + x - 1, pad + y - 1, w + 2, h + 2); g.font = 'bold 14px sans-serif'; const tw = g.measureText(p.id).width; g.fillStyle = COLORS[i % COLORS.length]; g.fillRect(pad + x - 1, pad + y - 18, tw + 8, 17); g.fillStyle = '#000'; g.fillText(p.id, pad + x + 3, pad + y - 5); });
    g.font = '12px sans-serif'; g.fillStyle = '#ccc';
    g.fillText(`parts ${res.parts.length} · islands ${res.islands.length} · holes ${res.holes.length} · sym V ${sy.mirror_vertical_axis} H ${sy.mirror_horizontal_axis} R180 ${sy.rotational_180}`, 8, c.height - 10);
    return c.toDataURL('image/png');
  }
  function drawPartsSheet(res) {
    const [W, H] = res.raster_size; const n = res.parts.length; const cols = Math.min(6, Math.max(1, n)); const cell = 200; const rows = Math.ceil(n / cols);
    const c = document.createElement('canvas'); c.width = cols * cell; c.height = Math.max(1, rows) * (cell + 34); const g = c.getContext('2d');
    g.fillStyle = '#16161a'; g.fillRect(0, 0, c.width, c.height);
    res.parts.forEach((p, i) => {
      const cx = (i % cols) * cell, cy = Math.floor(i / cols) * (cell + 34);
      const [bx, by, bw, bh] = p.bbox_px; const s = (cell - 30) / Math.max(bw, bh);
      const id = g.createImageData(W, H); for (let k = 0; k < p._mask.length; k++) if (p._mask[k]) { id.data[k * 4] = 235; id.data[k * 4 + 1] = 235; id.data[k * 4 + 2] = 235; id.data[k * 4 + 3] = 255; }
      const t = document.createElement('canvas'); t.width = W; t.height = H; t.getContext('2d').putImageData(id, 0, 0);
      g.imageSmoothingEnabled = true; g.drawImage(t, bx, by, bw, bh, cx + (cell - bw * s) / 2, cy + 8 + (cell - 30 - bh * s) / 2 + 7, bw * s, bh * s);
      g.fillStyle = COLORS[i % COLORS.length]; g.font = 'bold 14px sans-serif'; g.fillText(p.id, cx + 8, cy + cell + 4);
      g.fillStyle = '#aaa'; g.font = '11px sans-serif'; g.fillText(`${Math.round(p.area_share * 100)}% ink${p.primitive ? ' · ' + p.primitive : ''}${p.holes ? ' · ' + p.holes + ' hole' : ''}`, cx + 8, cy + cell + 20);
      g.strokeStyle = '#2c2c34'; g.strokeRect(cx + 0.5, cy + 0.5, cell - 1, cell + 33);
    });
    return c.toDataURL('image/png');
  }

  window.LMAnalyze = {
    async svg(svgText, opts) {
      const res = await analyzeSVG(svgText, opts);
      const svgForView = document.getElementById('host').innerHTML;
      res.overview_png = await drawOverview(svgForView, true, res);
      res.parts_png = drawPartsSheet(res);
      res.parts.forEach((p) => delete p._mask);
      return res;
    },
    async raster(dataUrl, opts) {
      const res = await analyzeRaster(dataUrl, opts);
      res.overview_png = await drawOverview(dataUrl, false, res);
      res.parts_png = drawPartsSheet(res);
      res.parts.forEach((p) => delete p._mask);
      return res;
    },
    async fidelity(svgA, svgB, W, H) { return pixelFidelity(await rasterSVG(svgA, W, H), await rasterSVG(svgB, W, H)); },
    async rasterVsSvg(dataUrl, svgText, W, H) {
      const im = await loadImage(dataUrl); const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0, W, H);
      return pixelFidelity(g.getImageData(0, 0, W, H), await rasterSVG(svgText, W, H));
    },
    parsePath, splitSubpaths, segToD,
  };
})();
