#!/usr/bin/env node
// End-to-end capability audit: verifies every tool the skill relies on, in THIS environment.
//   node selftest.mjs [--keep] [--json]
// Prints a capability table; exit code 0 only when the core pipeline (analyze → render → qa) works.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { ENGINE_DIR, findChromium, parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-selftest-'));
const results = [];
const rec = (name, ok, detail, core = false) => results.push({ name, ok, detail: String(detail || '').trim().split('\n').slice(-1)[0].slice(0, 140), core });
const run = (cmd, a, opts = {}) => spawnSync(cmd, a, { encoding: 'utf8', cwd: ENGINE_DIR, timeout: 240000, ...opts });

// --- binaries & libraries
const bin = (b, a = ['-version']) => { const r = run(b, a); return r.status === 0 ? (r.stdout || r.stderr).split('\n')[0] : null; };
rec('node >= 18', parseInt(process.versions.node) >= 18, process.version, true);
rec('ffmpeg', !!bin('ffmpeg'), bin('ffmpeg') || 'missing — install ffmpeg', true);
rec('ffprobe', !!bin('ffprobe'), bin('ffprobe') || 'missing', true);
const py = run('python3', ['-c', 'import PIL, numpy; print("PIL", PIL.__version__, "numpy", numpy.__version__)']);
rec('python3 + Pillow + numpy', py.status === 0, py.status === 0 ? py.stdout : py.stderr, true);
const chrome = findChromium(); rec('chromium', !!chrome, chrome || 'not found — set LM_CHROMIUM', true);
const gs = path.join(ENGINE_DIR, 'node_modules', 'gsap', 'dist');
rec('gsap + DrawSVG/MorphSVG/SplitText', ['gsap.min.js', 'DrawSVGPlugin.min.js', 'MorphSVGPlugin.min.js', 'SplitText.min.js'].every((f) => fs.existsSync(path.join(gs, f))), fs.existsSync(gs) ? 'node_modules/gsap/dist' : 'run ./setup.sh', true);
rec('imagetracerjs (raster trace)', fs.existsSync(path.join(ENGINE_DIR, 'node_modules', 'imagetracerjs')), '');
rec('opentype.js (text outlines)', fs.existsSync(path.join(ENGINE_DIR, 'node_modules', 'opentype.js')), '');

// --- fixture: a small geometric mark (circle + bar + counter hole)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><circle cx="50" cy="50" r="40" fill="#1F6FEB"/><path d="M110 15h70v70h-70z M130 35v30h30v-30z" fill="#F2A900" fill-rule="evenodd"/></svg>`;
fs.writeFileSync(path.join(tmp, 'mark.svg'), svg);
const an = run('node', ['analyze.mjs', path.join(tmp, 'mark.svg'), '--out', path.join(tmp, 'analysis')]);
let anOk = false, anDetail = an.stderr || an.stdout;
try { const j = JSON.parse(fs.readFileSync(path.join(tmp, 'analysis', 'analysis.auto.json'), 'utf8')); anOk = j.parts.length === 2 && j.holes.length === 1 && j.geometry.circle_parts.length === 1 && j.parts_svg_fidelity.mask_iou >= 0.995; anDetail = `parts ${j.parts.length}, holes ${j.holes.length}, circles ${j.geometry.circle_parts}, parts.svg IoU ${j.parts_svg_fidelity.mask_iou}`; } catch (e) {}
rec('analyze.mjs (SVG parts/holes/primitives)', anOk, anDetail, true);

const comp = `<!doctype html><html><head><meta charset="utf-8"><title>selftest</title></head><body>
<div id="stage"><svg id="logo" viewBox="0 0 200 100" style="position:absolute;left:560px;top:260px;width:400px;height:200px">${svg.replace(/^<svg[^>]*>|<\/svg>$/g, '').replace('<circle', '<circle id="c"').replace('<path', '<path id="s"')}</svg></div>
<template id="official-logo">${svg}</template>
<script src="/__lm/gsap/gsap.min.js"></script><script src="/__lm/lm-runtime.js"></script>
<script>LM.composition({ width: 1520, height: 720, fps: 30, duration: 2, background: '#101114',
  logo: { template: '#official-logo', rect: { x: 560, y: 260, w: 400, h: 200 } }, markers: { reveal: 1 },
  build() { const tl = gsap.timeline(); tl.fromTo('#c', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 0.1)
    .fromTo('#s', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.45); return tl; } });</script></body></html>`;
fs.writeFileSync(path.join(tmp, 'composition.html'), comp);
const rd = run('node', ['render.mjs', path.join(tmp, 'composition.html'), '--formats', 'mp4,gif,webm', '--check-determinism']);
let man = null; try { man = JSON.parse(fs.readFileSync(path.join(tmp, 'renders', 'render-manifest.json'), 'utf8')); } catch (e) {}
rec('render.mjs → MP4/GIF/WebM validated', rd.status === 0 && man && man.validation.every((v) => v.ok), man ? man.validation.map((v) => v.format + ':' + (v.ok ? 'ok' : 'bad')).join(' ') : rd.stderr, true);
rec('deterministic frames', !!(man && man.determinism && man.determinism.deterministic), man && JSON.stringify(man.determinism && { byte_identical: man.determinism.byte_identical }), true);
const qa = run('python3', ['qa.py', path.join(tmp, 'renders')]);
let rep = null; try { rep = JSON.parse(fs.readFileSync(path.join(tmp, 'renders', 'qa', 'qa-report.json'), 'utf8')); } catch (e) {}
const fid = rep && rep.checks.find((c) => c.id === 'fidelity.final_frame');
rec('qa.py (final-frame contract, motion checks)', !!(rep && fid && fid.status === 'pass'), rep ? `${rep.verdict}; fidelity ${fid && fid.status}` : qa.stderr, true);
const mb = run('node', ['render.mjs', path.join(tmp, 'composition.html'), '--out', path.join(tmp, 'mb'), '--formats', 'mp4', '--motion-blur', '2', '--to', '0.5']);
rec('motion blur (sub-frame accumulation)', mb.status === 0, mb.status === 0 ? 'ok' : mb.stderr);

// --- raster path
const rp = path.join(tmp, 'mark.png');
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', path.join(tmp, 'renders', 'final.png'), '-vf', 'crop=420:220:550:250', rp]);
const ra = run('node', ['analyze.mjs', rp, '--out', path.join(tmp, 'ranalysis'), '--trace']);
let rj = null; try { rj = JSON.parse(fs.readFileSync(path.join(tmp, 'ranalysis', 'analysis.auto.json'), 'utf8')); } catch (e) {}
rec('analyze.mjs raster + approximate trace', !!(rj && rj.parts.length === 2 && rj.trace), rj ? `parts ${rj.parts.length}, holes ${rj.holes.length}, trace IoU ${rj.trace && rj.trace.mask_iou}` : ra.stderr);

// --- text outlining
const font = ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'].find((f) => fs.existsSync(f));
if (font) { const ot = run('node', ['outline-text.mjs', '--font', font, '--text', 'Logo', '--out', path.join(tmp, 't.svg'), '--verify']); rec('outline-text.mjs (+ browser shaping verify)', ot.status === 0, ot.stderr); }
else rec('outline-text.mjs (+ browser shaping verify)', null, 'skipped: no DejaVuSans.ttf to test with');

// --- library & integrations
const rv = run('node', ['refs.mjs', 'validate']); rec('reference library valid', rv.status === 0, rv.stdout);
const os1 = run('node', ['oneshotted.mjs', 'status']); rec('Oneshotted MCP reachable (optional)', os1.status === 0, (os1.stdout || '').split('\n').filter((l) => l.startsWith('reachable')).join(' ') || os1.stderr);
const three = fs.existsSync(path.join(ENGINE_DIR, 'node_modules', 'three')); rec('three.js bundled (optional)', three ? true : null, three ? '' : 'not bundled — vendor into the project when a 3D concept is justified');
const lw = fs.existsSync(path.join(ENGINE_DIR, 'node_modules', 'lottie-web')); rec('lottie-web for Lottie verification (optional)', lw ? true : null, lw ? '' : 'not installed');

// --- report
const icon = (ok, core) => (ok === true ? 'OK  ' : ok === null ? 'n/a ' : core ? 'FAIL' : 'WARN');
if (args.json) console.log(JSON.stringify({ when: new Date().toISOString(), platform: `${os.platform()} ${os.release()}`, results }, null, 1));
else {
  console.log(`\nlogo-motion capability audit — ${new Date().toISOString()} — ${os.platform()} ${os.release()}\n`);
  for (const r of results) console.log(`${icon(r.ok, r.core)} ${r.core ? '*' : ' '} ${r.name.padEnd(44)} ${r.detail}`);
  console.log('\n* = core pipeline requirement');
}
if (!args.keep) fs.rmSync(tmp, { recursive: true, force: true }); else console.log('kept ' + tmp);
process.exit(results.filter((r) => r.core && r.ok !== true).length ? 1 : 0);
