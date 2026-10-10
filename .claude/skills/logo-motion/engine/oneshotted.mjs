#!/usr/bin/env node
// Oneshotted library adapter (optional research source).
//
// Oneshotted (https://oneshotted.io) is a gallery of motion pieces made by coding
// agents, with creator prompts and recipes. Its MCP endpoint speaks JSON-RPC 2.0
// (tools: search_motion, get_recipe, find_similar, list_filters, get_keyframes) —
// documented by the creator's own skill, github.com/Codesaz-Company/oneshotted-skill
// (MIT). This adapter is an independent minimal client; it never asks for a key in chat.
//
//   ONESHOTTED_API_KEY=... node oneshotted.mjs status
//   node oneshotted.mjs search "logo reveal geometric construction" [--limit 6] [--framework gsap] [--model claude] [--any]
//   node oneshotted.mjs recipe <id>
//   node oneshotted.mjs similar <id>
//   node oneshotted.mjs frames <id> [--count 3] [--out refs/frames]
//   node oneshotted.mjs to-ref <id>      print a references.json entry for `refs.mjs add`
//
// Key lookup: $ONESHOTTED_API_KEY, then ~/.config/oneshotted/key (get one at
// https://oneshotted.io/mcp-docs). Endpoint override: $ONESHOTTED_ENDPOINT.
// If the host is unreachable or no key is configured, say so and continue
// without the library — it is an optional source.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from './lib/browser.mjs';

const ENDPOINT = process.env.ONESHOTTED_ENDPOINT || 'https://oneshotted.io/mcp';
const args = parseArgs(process.argv.slice(2), { limit: '6', count: '3', out: 'refs/frames' });
const [cmd, ...rest] = args._;

function key() {
  if (process.env.ONESHOTTED_API_KEY) return process.env.ONESHOTTED_API_KEY.trim();
  const f = path.join(os.homedir(), '.config', 'oneshotted', 'key');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim() : null;
}

async function call(tool, a) {
  const k = key();
  if (!k) throw new Error('No Oneshotted key configured (ONESHOTTED_API_KEY or ~/.config/oneshotted/key). Continue without the library.');
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: 'Bearer ' + k, 'User-Agent': 'logo-motion-skill/1.0' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: a } }),
      signal: AbortSignal.timeout(60000),
    });
  } catch (e) { throw new Error(`Could not reach ${ENDPOINT} (${e.cause ? e.cause.code || e.cause.message : e.message}). Continue without the library and say so.`); }
  if (res.status === 401) throw new Error('Oneshotted rejected the key (401).');
  let raw = await res.text();
  if (!res.ok) throw new Error(`Oneshotted answered ${res.status}: ${raw.slice(0, 300)}`);
  if (/^(event|data):/.test(raw)) { const d = raw.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()); raw = d[d.length - 1] || ''; }
  const msg = JSON.parse(raw);
  if (msg.error) throw new Error('Oneshotted error: ' + (msg.error.message || JSON.stringify(msg.error)));
  if (msg.result && msg.result.isError) throw new Error((msg.result.content || []).map((c) => c.text).join(' '));
  return msg.result;
}
const data = (r) => (r.structuredContent != null ? r.structuredContent : (r.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n'));
// A prompt may be adapted only if it is the creator's own, verified, full prompt.
const usablePrompt = (r) => r && r.prompt === 'verified' && r.prompt_use === 'full';
const stripRebuilt = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('rebuilt')));

(async () => {
  if (cmd === 'status') {
    console.log(`endpoint: ${ENDPOINT}\nkey: ${key() ? 'configured' : 'missing'}`);
    try { const r = await call('list_filters', {}); console.log('reachable: yes\nfilters:', JSON.stringify(data(r)).slice(0, 800)); }
    catch (e) { console.log('reachable: no — ' + e.message); process.exit(3); }
  } else if (cmd === 'search') {
    const a = { query: rest.join(' '), limit: Math.min(20, parseInt(args.limit)) };
    if (!args.any) a.strong_prompt = true;
    for (const f of ['kind', 'framework', 'model', 'motion_type']) if (args[f]) a[f] = args[f];
    const d = data(await call('search_motion', a));
    if (typeof d === 'string') return console.log(d);
    const results = (d.results || []).map(stripRebuilt).map((r) => ({ ...r, prompt_status: usablePrompt(r) ? 'creator-verified full prompt (adaptable, credit the creator)' : 'style reference only' }));
    console.log(JSON.stringify({ count: results.length, results }, null, 1));
  } else if (cmd === 'recipe') {
    const d = data(await call('get_recipe', { id: rest[0], max_prompt_chars: 6000 }));
    if (typeof d !== 'string') { const o = stripRebuilt(d); if (!(o.prompt && o.prompt.status === 'verified' && o.prompt.use === 'full')) o.prompt = { note: 'No full verified creator prompt — use as a style reference only.' }; console.log(JSON.stringify(o, null, 1)); }
    else console.log(d);
  } else if (cmd === 'similar') {
    const d = data(await call('find_similar', { id: rest[0], limit: Math.min(12, parseInt(args.limit)) }));
    console.log(typeof d === 'string' ? d : JSON.stringify((d.results || []).map(stripRebuilt), null, 1));
  } else if (cmd === 'frames') {
    const r = await call('get_keyframes', { id: rest[0], count: Math.max(1, Math.min(5, parseInt(args.count))) });
    fs.mkdirSync(args.out, { recursive: true }); let i = 0, label = '';
    for (const c of r.content || []) {
      if (c.type === 'text') label = c.text;
      else if (c.type === 'image') { const f = path.join(args.out, `${rest[0]}-${i++}.${(c.mimeType || 'image/jpeg').split('/')[1]}`); fs.writeFileSync(f, Buffer.from(c.data, 'base64')); console.log(f, label); }
    }
  } else if (cmd === 'to-ref') {
    const d = data(await call('get_recipe', { id: rest[0], max_prompt_chars: 1200 }));
    if (typeof d === 'string') { console.error('unstructured reply; build the entry by hand'); process.exit(1); }
    const verifiedPrompt = d.prompt && d.prompt.status === 'verified' && d.prompt.use === 'full';
    const model = d.model || null;
    const entry = {
      id: 'ref-oneshotted-' + String(rest[0]).toLowerCase().replace(/[^a-z0-9]+/g, '-'), title: d.title || rest[0], creator: d.creator || d.handle || null,
      url: d.url || `https://oneshotted.io/v/${rest[0]}`,
      // Claude-made only if the creator's verified record names a Claude model.
      attribution: verifiedPrompt && /claude|opus|sonnet|haiku/i.test(String(model)) ? 'verified-claude' : 'professional-inspiration',
      verification: { status: verifiedPrompt ? 'verified' : 'partially-verified', method: 'Oneshotted MCP get_recipe', last_verified: new Date().toISOString().slice(0, 10) },
      logo_category: [], motion_techniques: [].concat(d.motion_type || []), brand_personality: [], reveal_mechanism: '', motion_family: d.motion_type || '',
      production: '2d', framework: [].concat(d.framework || []), complexity: 'medium', concept: d.summary || '',
      prompt_available: !!verifiedPrompt, prompt_excerpt: verifiedPrompt && d.prompt.text ? String(d.prompt.text).slice(0, 300) : null, source_code_available: false,
      observations: [{ text: 'Imported from Oneshotted; fill techniques/principles after viewing keyframes.', type: 'observed' }], transferable_principles: [], weaknesses: [], license: null, model, agent: d.agent || null, tags: ['oneshotted'],
    };
    console.log(JSON.stringify(entry, null, 1));
  } else {
    console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 22).join('\n'));
  }
})().catch((e) => { console.error('[oneshotted] ' + e.message); process.exit(3); });
