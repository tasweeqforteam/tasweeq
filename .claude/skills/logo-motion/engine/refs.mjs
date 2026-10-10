#!/usr/bin/env node
// Reference library CLI — searchable, validated knowledge base of logo-motion references.
//
//   node refs.mjs search "negative space reveal" [--technique draw-on] [--category monogram]
//        [--attribution verified-claude|claude-compatible|professional-inspiration]
//        [--framework gsap] [--personality premium] [--production 2d] [--verified] [--limit 8] [--json]
//   node refs.mjs show <id>
//   node refs.mjs principles "<query>" [filters]    aggregated transferable principles of matches
//   node refs.mjs add <entry.json|entries.json>     validate + append (dedupes by id and URL)
//   node refs.mjs validate                          schema, duplicates, attribution rules, staleness
//   node refs.mjs stats
//   node refs.mjs index                             regenerate library/INDEX.md
import fs from 'node:fs';
import path from 'node:path';
import { ENGINE_DIR, parseArgs } from './lib/browser.mjs';

const LIB = path.resolve(ENGINE_DIR, '..', 'library');
const FILE = path.join(LIB, 'references.json');
const ATTR = ['verified-claude', 'claude-compatible', 'professional-inspiration'];
const STATUS = ['verified', 'partially-verified', 'unverified'];
const REQUIRED = ['id', 'title', 'creator', 'url', 'attribution', 'verification'];
const STALE_DAYS = 180;

const args = parseArgs(process.argv.slice(2), { limit: '8' });
const [cmd, ...rest] = args._;
const load = () => JSON.parse(fs.readFileSync(FILE, 'utf8'));
const save = (refs) => fs.writeFileSync(FILE, JSON.stringify(refs, null, 1) + '\n');
// Canonical facets so free-text research vocabularies group consistently.
const TECH = {
  'draw-on': /draw|stroke|line reveal|trace|handwrit|pathlength/, 'mask-wipe': /mask|wipe|clip|reveal by|curtain/,
  'assembly': /assembl|build-on|construct|stagger|pieces|modular|slot/, 'morph': /morph|transform(ation)? from|shape.?shift|match.?cut/,
  'kinetic-type': /letter|type|text|word|kinetic|split ?text|caption/, 'negative-space': /negative|counter|figure.?ground/,
  'particles': /particle|dust|spark|confetti/, '3d': /3d|three|extru|orbit|depth|camera|diorama/, 'physics': /physic|spring|bounce|gravity|collision|magnet|elastic|squash/,
  'light': /light|glow|sweep|shine|glint|lens/, 'glitch': /glitch|rgb split|datamosh/, 'scale-pop': /scale|pop|zoom|punch/, 'fade': /fade|opacity|dissolve/,
  'loop': /loop|idle|ambient/, 'liquid-organic': /liquid|fluid|organic|grow|blob|ink/, 'sound-sync': /sound|beat|audio|music/, 'procedural': /procedural|generative|noise|shader|raymarch/,
};
const FW = { remotion: /remotion/, gsap: /gsap/, 'svg-css': /svg|css/, threejs: /three|r3f/, lottie: /lottie|skottie|bodymovin/, canvas: /canvas/, webgl: /webgl|glsl|webgpu|shader/, 'after-effects': /after.?effects/, hyperframes: /hyperframes/, python: /python|pillow|cairo/, blender: /blender/ };
const facetsOf = (r) => {
  const t = (Array.isArray(r.motion_techniques) ? r.motion_techniques.join(' ') : '') + ' ' + (r.reveal_mechanism || '') + ' ' + (r.motion_family || '');
  const f = (r.framework || []).join(' ');
  return { techniques: Object.keys(TECH).filter((k) => TECH[k].test(t.toLowerCase())), frameworks: Object.keys(FW).filter((k) => FW[k].test(f.toLowerCase())) };
};
const lc = (v) => (Array.isArray(v) ? v.join(' ') : v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)).toLowerCase();

function filters(refs) {
  const f = (field, key) => (args[key] ? refs.filter((r) => lc(r[field]).includes(String(args[key]).toLowerCase())) : refs);
  if (args.technique) refs = refs.filter((r) => facetsOf(r).techniques.includes(args.technique) || lc(r.motion_techniques).includes(String(args.technique).toLowerCase())); refs = f('logo_category', 'category'); refs = f('attribution', 'attribution');
  if (args.framework) refs = refs.filter((r) => facetsOf(r).frameworks.includes(args.framework) || lc(r.framework).includes(String(args.framework).toLowerCase())); refs = f('brand_personality', 'personality'); refs = f('production', 'production');
  if (args.verified) refs = refs.filter((r) => r.verification && r.verification.status === 'verified');
  return refs;
}
function score(r, q) {
  if (!q) return 1;
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const fields = [[r.title, 3], [r.motion_techniques, 3], [facetsOf(r).techniques, 3], [r.reveal_mechanism, 3], [r.tags, 2], [r.concept, 2], [r.logo_category, 2], [r.transferable_principles, 1.5], [r.observations, 1], [r.framework, 1], [r.brand_personality, 1]];
  let s = 0;
  for (const t of terms) for (const [v, w] of fields) if (lc(v).includes(t)) s += w;
  // prefer stronger evidence
  const ev = { verified: 1.15, 'partially-verified': 1.0, unverified: 0.8 }[r.verification && r.verification.status] || 0.8;
  return s * ev;
}
function search(q) {
  return filters(load()).map((r) => ({ r, s: score(r, q) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, parseInt(args.limit));
}
function brief(r) {
  const v = r.verification || {};
  return `${r.id}  [${r.attribution} · ${v.status}]  ${r.title}\n    ${r.url}\n    facets: ${facetsOf(r).techniques.join(', ') || '—'}  · framework: ${facetsOf(r).frameworks.join(', ') || (r.framework || []).join(', ') || '—'}\n    principle: ${(r.transferable_principles || [])[0] || '—'}`;
}
function validate(refs, { quiet } = {}) {
  const errs = [], warns = []; const ids = new Map(), urls = new Map(); const now = Date.now();
  for (const [i, r] of refs.entries()) {
    const at = `#${i} ${r.id || '(no id)'}`;
    for (const k of REQUIRED) if (r[k] == null || r[k] === '') errs.push(`${at}: missing ${k}`);
    if (r.attribution && !ATTR.includes(r.attribution)) errs.push(`${at}: attribution must be one of ${ATTR.join('|')}`);
    if (r.verification && !STATUS.includes(r.verification.status)) errs.push(`${at}: verification.status must be one of ${STATUS.join('|')}`);
    if (r.url && !/^https?:\/\/[^\s]+\.[^\s]+/.test(r.url)) errs.push(`${at}: url looks invalid`);
    if (r.id) { if (ids.has(r.id)) errs.push(`${at}: duplicate id (also #${ids.get(r.id)})`); ids.set(r.id, i); }
    if (r.url) { const u = r.url.replace(/\/$/, '').toLowerCase(); if (urls.has(u)) warns.push(`${at}: duplicate url (also #${urls.get(u)})`); urls.set(u, i); }
    if (r.attribution === 'verified-claude' && r.verification && r.verification.status === 'unverified') errs.push(`${at}: verified-claude requires evidence — status cannot be "unverified"`);
    if (r.prompt_excerpt && r.prompt_excerpt.length > 300) warns.push(`${at}: prompt_excerpt > 300 chars (quote sparingly)`);
    if (r.prompt_excerpt && !r.prompt_available) warns.push(`${at}: prompt_excerpt present but prompt_available=false`);
    const lv = r.verification && Date.parse(r.verification.last_verified);
    if (lv && (now - lv) / 864e5 > STALE_DAYS) warns.push(`${at}: last verified ${r.verification.last_verified} (> ${STALE_DAYS} days) — re-check before relying on it`);
    for (const o of r.observations || []) if (o && o.type && !['observed', 'inferred'].includes(o.type)) warns.push(`${at}: observation type must be observed|inferred`);
  }
  if (!quiet) {
    for (const e of errs) console.log('ERROR ' + e);
    for (const w of warns) console.log('warn  ' + w);
    console.log(`${refs.length} references · ${errs.length} errors · ${warns.length} warnings`);
  }
  return { errs, warns };
}
function count(refs, field) {
  const m = new Map(); for (const r of refs) for (const v of [].concat(r[field] || [])) { const k = String(v).toLowerCase(); m.set(k, (m.get(k) || 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
function index(refs) {
  const L = ['# Reference library index', '', `Generated by \`node engine/refs.mjs index\` on ${new Date().toISOString().slice(0, 10)} from \`references.json\` (${refs.length} entries). Do not edit by hand.`, '',
    'Attribution classes: **verified-claude** = creator/docs explicitly state Claude or Claude Code made it · **claude-compatible** = built for Claude, showcased outputs not proven Claude-made · **professional-inspiration** = other artists/tools, transferable principles only.', ''];
  for (const a of ATTR) {
    const rs = refs.filter((r) => r.attribution === a); if (!rs.length) continue;
    L.push(`## ${a} (${rs.length})`, '', '| id | title | evidence | techniques | framework | licence |', '|---|---|---|---|---|---|');
    for (const r of rs) L.push(`| \`${r.id}\` | [${String(r.title).replace(/\|/g, '/')}](${r.url}) | ${r.verification.status} (${r.verification.method || ''}) | ${(r.motion_techniques || []).slice(0, 4).join(', ').replace(/\|/g, '/')} | ${(r.framework || []).join(', ')} | ${(r.license || '—').toString().replace(/\|/g, '/').slice(0, 40)} |`);
    L.push('');
  }
  L.push('## By motion technique', '');
  for (const k of Object.keys(TECH)) { const rs = refs.filter((r) => facetsOf(r).techniques.includes(k)); if (rs.length) L.push(`- **${k}** (${rs.length}): ${rs.map((r) => '`' + r.id + '`').join(', ')}`); }
  L.push('', '## By framework', '');
  for (const k of Object.keys(FW)) { const rs = refs.filter((r) => facetsOf(r).frameworks.includes(k)); if (rs.length) L.push(`- **${k}** (${rs.length}): ${rs.map((r) => '`' + r.id + '`').join(', ')}`); }
  fs.writeFileSync(path.join(LIB, 'INDEX.md'), L.join('\n') + '\n');
  console.log('wrote ' + path.join(LIB, 'INDEX.md'));
}

const refs = load();
if (cmd === 'search') {
  const res = search(rest.join(' '));
  if (args.json) console.log(JSON.stringify(res.map((x) => x.r), null, 1));
  else { console.log(res.length ? res.map((x) => brief(x.r)).join('\n') : 'no matches — broaden the query, or research new references (modules/04-research.md)'); }
} else if (cmd === 'show') {
  const r = refs.find((x) => x.id === rest[0]); if (!r) { console.error('not found'); process.exit(1); }
  console.log(JSON.stringify(r, null, 1));
} else if (cmd === 'principles') {
  const res = search(rest.join(' '));
  const seen = new Set();
  for (const { r } of res) for (const p of r.transferable_principles || []) { const k = p.toLowerCase().slice(0, 60); if (seen.has(k)) continue; seen.add(k); console.log(`- ${p}  (${r.id})`); }
} else if (cmd === 'add') {
  const incoming = [].concat(JSON.parse(fs.readFileSync(rest[0], 'utf8')));
  const { errs } = validate(incoming, { quiet: true });
  if (errs.length) { errs.forEach((e) => console.log('ERROR ' + e)); process.exit(1); }
  const have = new Set(refs.map((r) => r.id)); const haveU = new Set(refs.map((r) => r.url.replace(/\/$/, '').toLowerCase()));
  let added = 0; for (const r of incoming) { if (have.has(r.id) || haveU.has(r.url.replace(/\/$/, '').toLowerCase())) { console.log('skip duplicate ' + r.id); continue; } refs.push(r); added++; }
  save(refs); console.log(`added ${added}`); index(refs);
} else if (cmd === 'validate') {
  const { errs } = validate(refs); process.exit(errs.length ? 1 : 0);
} else if (cmd === 'stats') {
  console.log('total', refs.length);
  for (const f of ['attribution', 'production', 'complexity']) console.log(f.padEnd(12), count(refs, f).map(([k, n]) => `${k}:${n}`).join('  '));
  console.log('verification', count(refs.map((r) => ({ v: r.verification.status })), 'v').map(([k, n]) => `${k}:${n}`).join('  '));
  console.log('facet techniques', count(refs.map((r) => ({ t: facetsOf(r).techniques })), 't').map(([k, n]) => `${k}:${n}`).join('  '));
  console.log('facet frameworks', count(refs.map((r) => ({ t: facetsOf(r).frameworks })), 't').map(([k, n]) => `${k}:${n}`).join('  '));
} else if (cmd === 'index') {
  index(refs);
} else {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 13).join('\n'));
}
