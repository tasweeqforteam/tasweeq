#!/usr/bin/env sh
# One-time setup for the logo-motion engine. Safe to re-run.
set -e
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "node >= 18 required"; exit 1; }
command -v ffmpeg >/dev/null || echo "WARNING: ffmpeg not found — rendering to video will fail (apt install ffmpeg / brew install ffmpeg)"
python3 -c "import PIL, numpy" 2>/dev/null || echo "WARNING: python3 with Pillow + numpy required for qa.py (pip install pillow numpy)"
npm ci --no-audit --no-fund 2>/dev/null || npm install --no-audit --no-fund
# Chromium: reuse a Playwright-managed browser if present; otherwise download one for playwright-core.
node -e "import('./lib/browser.mjs').then(m=>{const p=m.findChromium(); if(!p){process.exit(3)} console.log('chromium:', p)})" || npx -y playwright@1.56.1 install chromium
node selftest.mjs
