# Workflow: Browser Testing & Visual Iteration

You cannot judge a design you have not seen. Render it, look at it, fix it, look again.

## 0. Check the tooling

```bash
node -e "require.resolve('playwright')" 2>/dev/null && echo local-playwright
npm ls -g playwright 2>/dev/null | grep playwright
ls /opt/pw-browsers 2>/dev/null   # some sandboxes preinstall Chromium here
```

- If Playwright exists (project or global), use `scripts/visual-qa.mjs`.
- If the Playwright version doesn't match the installed browser, pass `--chromium /path/to/chrome` (or set `CHROME_PATH`). Never run `playwright install` in sandboxes that forbid it.
- If a browser MCP (Chrome DevTools MCP, Claude in Chrome, built-in browser) is available, it can replace or complement the script for interactive checks.
- If nothing is available: say so explicitly, do static checks (build, lint, HTML validity, CSS review), and give the user the exact commands/checks to run. Do not describe how the page "looks".

## 1. Start the app

```bash
npm run dev -- -p 3100 > /tmp/dev.log 2>&1 &      # Next.js / Vite (Vite: -- --port 3100)
npx serve -l 3100 ./dist &                         # static output
until curl -s -o /dev/null -w '%{http_code}' http://localhost:3100 | grep -q 200; do sleep 1; done
```

## 2. Automated pass

```bash
node .claude/skills/website-design/scripts/visual-qa.mjs \
  --url http://localhost:3100 --paths /,/pricing,/contact \
  --widths 390,768,1440 --full --reduced --out ./qa-output \
  [--axe] [--ignore "googletagmanager|analytics"]
```

It saves `<page>-<width>-viewport.png` (first screen), `-full.png` (with `--full`) and `report.md`/`report.json` with:
horizontal overflow + offending elements · console & runtime errors · failed requests (404 fonts/images) · broken images · images without `alt` · `h1` count · `lang`/`dir` · text < 12px · tap targets < 24px · unlabeled fields · nameless links/buttons · text still invisible after scrolling (stuck entrance animations) · focus indicators on the first Tab stops · axe violations (if `@axe-core/playwright` is installed) · transfer size by type. With `--reduced` every page is re-tested with `prefers-reduced-motion: reduce`.

Add `--ignore` only for requests the sandbox blocks (analytics, external CDNs) and say you did.

## 3. Look at the screenshots (the actual review)

Open every screenshot with the image-reading tool. For each, write 2–5 concrete observations, prioritized:

1. **Broken:** overlap, clipping, overflow, missing images/fonts, invisible text, layout collapse.
2. **Hierarchy:** is the dominant element obvious? is the primary action visible in the first screen?
3. **Composition:** alignment edges, spacing rhythm, orphans, awkward headline breaks, image crops.
4. **Craft:** type details (rag, widows, tracking), color balance, consistency with tokens.
5. **Concept:** does it express the design direction or has it drifted toward generic?

Compare against the design direction document, not against "looks fine".

## 4. Interaction pass (scripted or manual)

Write small Playwright steps for the critical interactions — they are cheap and repeatable:

```js
// e.g. scratchpad/interactions.mjs
const { chromium } = await import('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
await page.goto('http://localhost:3100/');
await page.getByRole('button', { name: /menu/i }).click();
await page.screenshot({ path: 'qa-output/menu-open-390.png' });
await page.keyboard.press('Escape');
console.log('menu still open after Escape:', await page.getByRole('dialog').isVisible()); // adapt the role/name to your menu
await page.getByLabel(/email/i).fill('not-an-email');
await page.getByRole('button', { name: /send|submit/i }).click();
await page.screenshot({ path: 'qa-output/form-error-390.png' });
await browser.close();
```

Check at least: navigation and menu open/close (mouse, touch, keyboard, Escape) · every primary CTA destination · forms (empty, invalid, valid, pending, success, error) · tabs/accordions/carousels with keyboard · hover and focus states on 1440 · animation start/end states (screenshot mid-animation with `page.waitForTimeout`) · language/theme toggles · 404 page.

For motion, capture a short sequence (`for t of [0,150,300,600,1000]` screenshot) or record video (`browser.newContext({ recordVideo: { dir } })`) and review frames for jank, overlap during transitions, and final states.

## 5. Fix → re-test loop

1. List findings by severity (gate failures first, then score-affecting).
2. Fix the top items — highest visual/functional impact first.
3. Re-run the automated pass for affected pages and re-inspect the screenshots.
4. Stop when all gates pass and the scorecard (`evaluations/acceptance-criteria.md`) reaches the target, or when remaining items need user input (content, assets, decisions) — list them.

Three focused passes usually beat one long one. Each pass should change something you saw, not something you guessed.

## 6. Report honestly

In the delivery report state: which widths/pages were screenshotted, which interactions were exercised and how (script vs. manual), what automated checks ran and their results, what was not tested (e.g. real iOS Safari, screen readers, slow networks), and any `--ignore` filters used.
