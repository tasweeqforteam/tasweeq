#!/usr/bin/env node
// Blueprint tools: validate the executable motion plan and print its timeline.
//
//   node blueprint.mjs check <blueprint.json>      structural + timing + craft checks
//   node blueprint.mjs timeline <blueprint.json>   ASCII timeline of stages and key poses
//
// Schema (see templates/blueprint.json and modules/09-motion-blueprint.md):
// { project, concept, duration, fps, width, height, background, logo_rect,
//   stages: [{ name, type, start, end, objects[], initial_state, final_state, changes,
//              easing, anticipation?, follow_through?, secondary?, camera?, sound?,
//              expect_motion?, tracks?[] }],
//   key_poses: [{ t, description }], markers: {}, export: { formats[], transparent },
//   fidelity: { final_state_from, compromises[] } }
import fs from 'node:fs';
import { parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2));
const [cmd, file] = args._;
if (!cmd || !file) { console.error('usage: node blueprint.mjs check|timeline <blueprint.json>'); process.exit(2); }
const bp = JSON.parse(fs.readFileSync(file, 'utf8'));
const TYPES = ['intro', 'build', 'transition', 'reveal', 'settle', 'hold', 'loop', 'outro', 'beat'];
const VAGUE = /\b(dynamic|smooth(ly)?|cool|nice|awesome|engaging|epic|modern feel|make it pop)\b/i;
const EASE = /^(none|linear|(power[0-4]|sine|expo|circ|back|elastic|bounce|quad|cubic|quart|quint|strong)(\.(in|out|inOut))?(\([^)]*\))?|steps\(\d+\)|cubic-bezier\([^)]+\)|custom:.+|spring.*|LM\.ease\.\w+)$/;

function check() {
  const errors = [], warns = [];
  for (const k of ['concept', 'duration', 'fps', 'width', 'height', 'stages']) if (bp[k] == null) errors.push(`missing top-level "${k}"`);
  const st = (bp.stages || []).slice().sort((a, b) => a.start - b.start);
  if (!st.length) errors.push('no stages');
  st.forEach((s, i) => {
    const at = `stage "${s.name || i}"`;
    for (const k of ['name', 'type', 'start', 'end', 'initial_state', 'final_state', 'easing']) if (s[k] == null || s[k] === '') errors.push(`${at}: missing ${k}`);
    if (s.type && !TYPES.includes(s.type)) warns.push(`${at}: unusual type "${s.type}" (expected ${TYPES.join('|')})`);
    if (s.end <= s.start) errors.push(`${at}: end (${s.end}) <= start (${s.start})`);
    if (s.start < 0 || s.end > bp.duration + 1e-9) errors.push(`${at}: outside 0..duration`);
    if (s.type !== 'hold' && (!s.objects || !s.objects.length)) warns.push(`${at}: no objects listed — which layers move?`);
    for (const k of ['initial_state', 'final_state', 'changes']) if (s[k] && VAGUE.test(s[k])) warns.push(`${at}: vague wording in ${k} ("${s[k].match(VAGUE)[0]}") — describe positions, scales, paths, timings`);
    if (s.easing && s.type !== 'hold' && !String(s.easing).split(/;|\s\/\s/).map((e) => e.trim()).every((e) => EASE.test(e) || /^(see|per)/i.test(e))) warns.push(`${at}: easing "${s.easing}" is not a recognised GSAP/CSS/LM ease name`);
    const dur = s.end - s.start;
    if (s.type !== 'hold' && dur < 2 / (bp.fps || 60)) warns.push(`${at}: shorter than 2 frames`);
    for (const tr of s.tracks || []) if (!tr.target) errors.push(`${at}: track without target`);
  });
  // Coverage: every instant should belong to a stage (overlap is fine — overlapping action).
  let cursor = 0;
  for (const s of st) { if (s.start > cursor + 1e-6 && !(cursor === 0 && s.start <= 0.3)) warns.push(`gap ${cursor.toFixed(2)}–${s.start.toFixed(2)}s not covered by any stage`); cursor = Math.max(cursor, s.end); }
  if (st.length && cursor < bp.duration - 1e-6) warns.push(`gap ${cursor.toFixed(2)}–${bp.duration}s not covered by any stage`);
  const last = st[st.length - 1];
  const holds = st.filter((s) => s.type === 'hold');
  const finalHold = holds.find((s) => Math.abs(s.end - bp.duration) < 1e-6);
  if (!finalHold && !(bp.loop || st.some((s) => s.type === 'loop'))) errors.push('no final "hold" stage ending at duration (the official logo must rest on screen)');
  else if (finalHold && finalHold.end - finalHold.start < 0.8) warns.push(`final hold is ${(finalHold.end - finalHold.start).toFixed(2)}s (< 0.8s)`);
  if (finalHold && (finalHold.start / bp.duration) > 0.85) warns.push('final hold starts very late — the logo may not read');
  if (finalHold && (finalHold.end - finalHold.start) / bp.duration > 0.5) warns.push('final hold is more than half the piece — is the motion doing enough?');
  for (const [k, v] of Object.entries(bp.markers || {})) if (v < 0 || v > bp.duration) errors.push(`marker ${k}=${v} outside duration`);
  if (!bp.key_poses || bp.key_poses.length < 3) warns.push('fewer than 3 key poses — define opening, peak/transformation and final poses');
  if (!bp.fidelity || !bp.fidelity.final_state_from) warns.push('fidelity.final_state_from missing — state from when the official logo is exact');
  if (bp.fidelity && bp.fidelity.compromises && bp.fidelity.compromises.length) warns.push('fidelity compromises declared: ' + bp.fidelity.compromises.join('; ') + ' — confirm with the user');
  // Craft heuristics
  const moving = st.filter((s) => s.type !== 'hold');
  const onsetSpread = moving.length > 1 ? Math.max(...moving.map((s) => s.start)) - Math.min(...moving.map((s) => s.start)) : 0;
  if (moving.length > 2 && onsetSpread < 0.05) warns.push('all motion starts at the same instant — consider staggering/overlap for hierarchy');
  if (bp.duration > 8 && !bp.loop) warns.push(`duration ${bp.duration}s is long for a logo reveal (typical 2–6s)`);
  return { errors, warns };
}

function timeline() {
  const W = 72; const T = bp.duration; const col = (t) => Math.round((t / T) * W);
  console.log(`${bp.project || ''} — "${bp.concept}"  ${T}s @ ${bp.fps}fps  ${bp.width}x${bp.height}`);
  console.log(' '.repeat(18) + '|' + Array.from({ length: W + 1 }, (_, i) => (i % Math.round(W / T / 2 || 1) === 0 ? '·' : ' ')).join(''));
  for (const s of (bp.stages || []).slice().sort((a, b) => a.start - b.start)) {
    const a = col(s.start), b = Math.max(a + 1, col(s.end));
    console.log(`${String(s.name).slice(0, 16).padEnd(17)} |${' '.repeat(a)}${(s.type === 'hold' ? '=' : '█').repeat(b - a)} ${s.start.toFixed(2)}–${s.end.toFixed(2)} ${s.easing || ''}`);
  }
  for (const p of bp.key_poses || []) console.log(`${'pose'.padEnd(17)} |${' '.repeat(col(p.t))}^ ${p.t}s ${p.description}`);
  for (const [k, v] of Object.entries(bp.markers || {})) console.log(`${('marker ' + k).slice(0, 16).padEnd(17)} |${' '.repeat(col(v))}| ${v}s`);
}

if (cmd === 'check') {
  const { errors, warns } = check();
  errors.forEach((e) => console.log('ERROR ' + e)); warns.forEach((w) => console.log('warn  ' + w));
  console.log(`[blueprint] ${errors.length} errors, ${warns.length} warnings`);
  process.exit(errors.length ? 1 : 0);
} else if (cmd === 'timeline') timeline();
else { console.error('unknown command ' + cmd); process.exit(2); }
