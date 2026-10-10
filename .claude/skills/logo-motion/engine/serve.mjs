#!/usr/bin/env node
// Interactive preview server: serves a project dir (plus /__lm/ engine assets) for a normal browser.
//   node serve.mjs <project-dir> [--port 4173]   then open http://localhost:4173/composition.html
// The preview UI (play/pause, scrubber, frame stepping, onion-skin of the official logo) is
// provided by lm-runtime.js whenever the page is opened without ?render.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { resolveVirtual, mimeFor, parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2), { port: '4173' });
const root = path.resolve(args._[0] || '.');
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  let file = resolveVirtual(u.pathname) || path.join(root, decodeURIComponent(u.pathname));
  if (!path.resolve(file).startsWith(root) && !resolveVirtual(u.pathname)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    const list = fs.readdirSync(file).filter((f) => f.endsWith('.html')).map((f) => `<li><a href="${path.posix.join(u.pathname, f)}">${f}</a></li>`).join('');
    res.writeHead(200, { 'content-type': 'text/html' }); return res.end(`<ul>${list}</ul>`);
  }
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': mimeFor(file), 'cache-control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}).listen(parseInt(args.port), () => console.log(`[serve] ${root} at http://localhost:${args.port}/`));
