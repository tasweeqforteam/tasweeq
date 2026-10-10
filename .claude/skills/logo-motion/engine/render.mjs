#!/usr/bin/env node
// Deterministic frame-stepped renderer: composition.html -> PNG frames -> MP4/WebM/GIF/MOV.
//
//   node render.mjs <composition.html> [--out <dir>] [--formats mp4,gif] [--fps N] [--scale 1]
//        [--gif-fps 25] [--gif-width 720] [--crf 16] [--transparent] [--keep-frames]
//        [--from 0] [--to <dur>] [--check-determinism] [--allow-network] [--motion-blur K]
//
// --motion-blur K renders K sub-frames per frame across a 180° shutter (t .. t + 0.5/fps)
// and averages them. Use only when fast moves strobe; it multiplies render time by K.
//
// Output (in --out, default <composition dir>/renders):
//   frames/000000.png...   lossless frames (kept by default; QA reads them)
//   first.png final.png reference.png  marker-<name>.png
//   <name>.mp4 / .webm / .gif / .mov
//   render-manifest.json   settings, timings, ffprobe validation, errors
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { launch, openRooted, ORIGIN, parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2), { formats: 'mp4,gif', scale: '1', crf: '16', 'gif-fps': '25', 'gif-width': '720' });
const compPath = args._[0];
if (!compPath) { console.error('usage: node render.mjs <composition.html> [--out dir] [--formats mp4,webm,gif,mov]'); process.exit(2); }
const compAbs = path.resolve(compPath);
const rootDir = path.dirname(compAbs);
const outDir = path.resolve(args.out || path.join(rootDir, 'renders'));
const framesDir = path.join(outDir, 'frames');
const name = path.basename(compAbs, path.extname(compAbs));
const formats = String(args.formats).split(',').map((s) => s.trim()).filter(Boolean);
const transparent = !!args.transparent;

function ffprobe(file) {
  try {
    const j = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', file]).toString());
    const v = (j.streams || []).find((s) => s.codec_type === 'video') || {};
    const [n, d] = String(v.r_frame_rate || v.avg_frame_rate || '0/1').split('/').map(Number);
    return { ok: true, codec: v.codec_name, width: v.width, height: v.height, pix_fmt: v.pix_fmt, fps: d ? n / d : null, frames: v.nb_frames ? Number(v.nb_frames) : null, duration: Number(j.format && j.format.duration), bytes: Number(j.format && j.format.size) };
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
}

const ff = (argsArr) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...argsArr], { stdio: ['ignore', 'inherit', 'inherit'] });

(async () => {
  const t0 = Date.now();
  fs.mkdirSync(outDir, { recursive: true });
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const browser = await launch();
  // First pass: discover composition size.
  let { context, page, errors } = await openRooted(browser, rootDir, { width: 800, height: 600 });
  if (args['allow-network']) await page.unroute(/^https?:\/\/(?!lm\.local)/);
  const url = `${ORIGIN}/${encodeURIComponent(path.basename(compAbs))}?render=1`;
  await page.goto(url, { waitUntil: 'load' });
  // A composition that throws before/inside LM.composition() never resolves ready — time out with the page errors.
  const waitReady = () => page.evaluate(() => Promise.race([
    window.__LM ? window.__LM.ready : Promise.resolve({ error: 'window.__LM missing — did the composition load /__lm/lm-runtime.js?' }),
    new Promise((r) => setTimeout(() => r({ error: 'timed out after 30s waiting for LM.composition() to become ready (script error? LM.composition never called? setup() hanging?)' }), 30000)),
  ]));
  let meta = await waitReady();
  if (meta.error) { console.error('Composition error:', meta.error, '\n', errors.join('\n')); await browser.close(); process.exit(1); }
  const scale = parseFloat(args.scale);
  if (meta.width !== 800 || meta.height !== 600 || scale !== 1) {
    await context.close();
    ({ context, page, errors } = await openRooted(browser, rootDir, { width: meta.width, height: meta.height, scale }));
    if (args['allow-network']) await page.unroute(/^https?:\/\/(?!lm\.local)/);
    await page.goto(url, { waitUntil: 'load' });
    meta = await waitReady();
    if (meta.error) { console.error('Composition error:', meta.error, '\n', errors.join('\n')); await browser.close(); process.exit(1); }
  }
  const fps = args.fps ? parseFloat(args.fps) : meta.fps;
  const from = args.from ? parseFloat(args.from) : 0;
  const to = args.to ? parseFloat(args.to) : meta.duration;
  const nFrames = Math.max(1, Math.round((to - from) * fps));
  const shot = async (file, t) => {
    await page.evaluate((tt) => window.__LM.seek(tt), t);
    await page.screenshot({ path: file, type: 'png', omitBackground: transparent, clip: { x: 0, y: 0, width: meta.width, height: meta.height } });
  };

  console.log(`[render] ${name}: ${meta.width}x${meta.height}@${fps}fps, ${(to - from).toFixed(3)}s, ${nFrames} frames, scale ${scale}`);
  const tr = Date.now();
  const blurK = args['motion-blur'] ? Math.max(2, parseInt(args['motion-blur'])) : 0;
  if (!blurK) {
    for (let i = 0; i < nFrames; i++) {
      await shot(path.join(framesDir, String(i).padStart(6, '0') + '.png'), from + i / fps);
      if (i % 30 === 0) process.stdout.write(`\r[render] frame ${i + 1}/${nFrames}`);
    }
  } else {
    const subDir = path.join(outDir, 'subframes');
    fs.rmSync(subDir, { recursive: true, force: true }); fs.mkdirSync(subDir, { recursive: true });
    for (let i = 0; i < nFrames; i++) {
      for (let k = 0; k < blurK; k++) await shot(path.join(subDir, String(i * blurK + k).padStart(6, '0') + '.png'), from + i / fps + (k / blurK) * (0.5 / fps));
      if (i % 10 === 0) process.stdout.write(`\r[render] frame ${i + 1}/${nFrames} (x${blurK} sub-frames)`);
    }
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(fps * blurK), '-i', path.join(subDir, '%06d.png'),
      '-vf', `format=rgba,tmix=frames=${blurK}:weights='${Array(blurK).fill(1).join(' ')}',select='not(mod(n+1\\,${blurK}))'`, '-fps_mode', 'passthrough', '-start_number', '0', path.join(framesDir, '%06d.png')]);
    fs.rmSync(subDir, { recursive: true, force: true });
  }
  process.stdout.write(`\r[render] frame ${nFrames}/${nFrames}  (${((Date.now() - tr) / 1000).toFixed(1)}s)\n`);

  // Stills for QA.
  await shot(path.join(outDir, 'first.png'), 0);
  await shot(path.join(outDir, 'final.png'), meta.duration);
  for (const [k, v] of Object.entries(meta.markers || {})) await shot(path.join(outDir, `marker-${k}.png`), Number(v));
  let hasReference = false;
  if (meta.hasReference) {
    await page.evaluate(() => window.__LM.seek(window.__LM.meta().duration));
    hasReference = await page.evaluate(() => window.__LM.renderReference());
    await page.screenshot({ path: path.join(outDir, 'reference.png'), type: 'png', omitBackground: transparent, clip: { x: 0, y: 0, width: meta.width, height: meta.height } });
    await page.evaluate(() => window.__LM.clearReference());
  }

  // Determinism check: re-render sample frames out of order and compare bytes.
  let determinism = null;
  if (args['check-determinism']) {
    const samples = [Math.floor(nFrames * 0.8), 0, Math.floor(nFrames * 0.35), nFrames - 1, Math.floor(nFrames * 0.6)];
    const mismatched = [];
    for (const i of samples) {
      const tmp = path.join(outDir, '.det.png');
      await shot(tmp, from + i / fps);
      const h = (f) => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
      const ref = path.join(framesDir, String(i).padStart(6, '0') + '.png');
      if (h(tmp) !== h(ref)) {
        // Byte mismatch: measure pixel difference (anti-aliasing noise vs real non-determinism).
        const r = execFileSync('python3', ['-c', 'import sys;from PIL import Image;import numpy as np;a=np.asarray(Image.open(sys.argv[1]).convert("RGBA")).astype(int);b=np.asarray(Image.open(sys.argv[2]).convert("RGBA")).astype(int);d=np.abs(a-b).max(-1);print(int(d.max()),int((d>8).sum()))', tmp, ref]).toString().trim().split(' ').map(Number);
        mismatched.push({ frame: i, max_channel_diff: r[0], pixels_over_8: r[1] });
      }
      fs.rmSync(tmp);
    }
    const totalPx = meta.width * meta.height * scale * scale;
    const significant = mismatched.filter((m) => m.pixels_over_8 > totalPx * 1e-4);
    determinism = { samples, mismatched, byte_identical: mismatched.length === 0, deterministic: significant.length === 0 };
    console.log(`[render] determinism: ${mismatched.length === 0 ? 'byte-identical' : significant.length === 0 ? 'OK (sub-threshold anti-aliasing noise only)' : 'MISMATCH ' + JSON.stringify(significant)}`);
  }
  await browser.close();

  // Encode.
  const outputs = {};
  const input = ['-framerate', String(fps), '-i', path.join(framesDir, '%06d.png')];
  const even = 'pad=ceil(iw/2)*2:ceil(ih/2)*2';
  for (const f of formats) {
    const file = path.join(outDir, `${name}.${f === 'prores' ? 'mov' : f}`);
    try {
      // Explicit BT.709 matrix + tags: untagged HD video is shown as BT.709 by browsers/players,
      // so an untagged BT.601 encode shifts brand colours on playback.
      if (f === 'mp4') ff([...input, '-vf', `${even},scale=out_color_matrix=bt709:out_range=tv,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(args.crf), '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-movflags', '+faststart', file]);
      else if (f === 'webm') ff([...input, ...(transparent ? [] : ['-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p']), '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '24', '-row-mt', '1', '-pix_fmt', transparent ? 'yuva420p' : 'yuv420p', ...(transparent ? [] : ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv']), file]);
      else if (f === 'mov' || f === 'prores') ff([...input, '-c:v', 'prores_ks', '-profile:v', '4', '-pix_fmt', transparent ? 'yuva444p10le' : 'yuv422p10le', file]);
      else if (f === 'gif') {
        const gf = `fps=${args['gif-fps']},scale=${args['gif-width']}:-1:flags=lanczos`;
        ff([...input, '-vf', `${gf},split[a][b];[a]palettegen=stats_mode=diff${transparent ? ':reserve_transparent=1' : ''}[p];[b][p]paletteuse=dither=sierra2_4a`, file]);
      } else { console.warn('[render] unknown format ' + f); continue; }
      outputs[f] = { file: path.relative(outDir, file), probe: ffprobe(file) };
      console.log(`[render] wrote ${file} (${(fs.statSync(file).size / 1024).toFixed(0)} KB)`);
    } catch (e) { outputs[f] = { file: path.relative(outDir, file), error: String(e.message || e) }; console.error('[render] encode failed for', f, e.message); }
  }

  // Validate outputs against the composition.
  const validation = [];
  for (const [f, o] of Object.entries(outputs)) {
    if (o.error || !o.probe || !o.probe.ok) { validation.push({ format: f, ok: false, reason: o.error || (o.probe && o.probe.error) }); continue; }
    const p = o.probe, issues = [];
    if (f !== 'gif') {
      if (p.width !== Math.ceil(meta.width * scale / 2) * 2 && p.width !== meta.width * scale) issues.push(`width ${p.width} != ${meta.width * scale}`);
      if (Math.abs((p.fps || 0) - fps) > 0.01) issues.push(`fps ${p.fps} != ${fps}`);
      if (Math.abs(p.duration - nFrames / fps) > 1.5 / fps) issues.push(`duration ${p.duration} != ${(nFrames / fps).toFixed(3)}`);
    }
    validation.push({ format: f, ok: issues.length === 0, issues });
  }

  // Encoded-output check: decode the last MP4/WebM frame and compare brand colour with final.png.
  for (const f of ['mp4', 'webm']) {
    if (!outputs[f] || outputs[f].error) continue;
    try {
      const lastPng = path.join(outDir, `.last-${f}.png`);
      ff(['-sseof', String(-1.5 / fps), '-i', path.join(outDir, outputs[f].file), '-frames:v', '1', '-update', '1', lastPng]);
      const r = execFileSync('python3', ['-c', `
import sys, numpy as np
from PIL import Image
a=np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(float); b=np.asarray(Image.open(sys.argv[2]).convert('RGB')).astype(float)
bg=np.median(np.concatenate([a[0],a[-1],a[:,0],a[:,-1]]),0); m=np.abs(a-bg).sum(-1)>40
for _ in range(3): m=m&np.roll(m,1,0)&np.roll(m,-1,0)&np.roll(m,1,1)&np.roll(m,-1,1)
def lab(c):
    c=c/255.0; c=np.where(c>0.04045,((c+0.055)/1.055)**2.4,c/12.92); M=np.array([[0.4124,0.3576,0.1805],[0.2126,0.7152,0.0722],[0.0193,0.1192,0.9505]])
    x=M@c/np.array([0.95047,1,1.08883]); f=np.where(x>0.008856,np.cbrt(x),7.787*x+16/116); return np.array([116*f[1]-16,500*(f[0]-f[1]),200*(f[1]-f[2])])
print(round(float(np.linalg.norm(lab(a[m].mean(0))-lab(b[m].mean(0)))),2) if m.any() else -1)`, path.join(outDir, 'final.png'), lastPng]).toString().trim();
      fs.rmSync(lastPng, { force: true });
      const de = parseFloat(r); outputs[f].encoded_color_deltaE = de;
      validation.push({ format: f + ':color', ok: de >= 0 && de < 3, issues: de >= 3 ? [`decoded brand colour differs from lossless final by ΔE ${de}`] : [] });
    } catch (e) { validation.push({ format: f + ':color', ok: false, issues: ['could not decode for colour check: ' + e.message] }); }
  }

  const manifest = {
    composition: path.relative(outDir, compAbs), rendered_at: new Date().toISOString(), meta, fps, from, to, frames: nFrames, scale, transparent,
    stills: { first: 'first.png', final: 'final.png', reference: hasReference ? 'reference.png' : null, markers: Object.keys(meta.markers || {}).map((k) => `marker-${k}.png`) },
    outputs, validation, determinism, motion_blur_subframes: blurK || null, page_errors: errors, elapsed_s: (Date.now() - t0) / 1000,
  };
  fs.writeFileSync(path.join(outDir, 'render-manifest.json'), JSON.stringify(manifest, null, 2));
  if (!args['keep-frames'] && args['drop-frames']) fs.rmSync(framesDir, { recursive: true, force: true });
  if (errors.length) console.warn('[render] page errors/warnings:\n  ' + errors.join('\n  '));
  const bad = validation.filter((v) => !v.ok);
  console.log(`[render] done in ${manifest.elapsed_s.toFixed(1)}s — ${bad.length ? 'VALIDATION ISSUES: ' + JSON.stringify(bad) : 'all outputs validated'}`);
  process.exit(bad.length || errors.some((e) => !e.startsWith('[console.warning]')) ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
