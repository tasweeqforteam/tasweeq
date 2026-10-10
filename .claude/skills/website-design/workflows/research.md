# Workflow: Reference Research

Goal: a small, relevant, *inspected* shortlist that informs decisions — not a pile of URLs. Typical: 5–10 references for a large project; 1–3 for a medium one; none for small fixes.

## Step 0 — Check what tools you actually have

| Capability | How to check | If missing |
|---|---|---|
| Web search | a WebSearch tool is listed | use the curated `references/reference-directory.md` only; say so |
| Fetch live pages | WebFetch or `curl -sI <url>` returns 200 | rely on search snippets → evidence label at most `INFERRED` |
| Rendered browser | Playwright / Chromium / browser MCP | no `OBSERVED` claims about visuals or motion |
| Source code | `git clone --depth 1` works for public repos; `npm pack <pkg>` | no `VERIFIED` implementation claims |

Record the date. Network policies vary per environment: in the environment where this skill was built (2026-10-10), the gallery sites (Awwwards, SiteInspire, Recent, CSSDA, Codrops, Mobbin, Refero, 60fps, Design Spells) were blocked by egress policy while GitHub (git) and the npm registry were reachable. Check yours; don't assume.

## Step 1 — Define the search from the brief

From the project brief, write:
- **Category** (agency site, SaaS landing, dashboard, editorial, product, 3D, e-commerce, RTL…)
- **Personality** (3–5 adjectives + anti-adjectives)
- **Design problems** to solve (e.g. "make 40 case studies browsable", "explain a 4-step process", "pin a product while specs scroll", "Arabic display type at hero scale")
- **Technical constraints** (stack, performance budget, CMS)

Search per *problem*, not per vibe.

## Step 2 — Search with outcome-specific queries

Examples (adapt):
- `award-winning editorial agency website Next.js case study`
- `site:github.com GSAP ScrollTrigger pinned product storytelling`
- `three.js product configurator source code`
- `variable font cursor velocity font-variation-settings`
- `SaaS dashboard filter table pattern` (then Mobbin/Refero if accessible)
- `Arabic RTL website design typography award`
- `site:tympanus.net codrops <technique>` (tutorials include source)
- `AI-generated website public repository Claude Code`

Use `references/reference-directory.md` for where to look per category. Prefer sources where implementation can be inspected (open repos, tutorials with code, demos with readable source).

## Step 3 — Inspect (as tools permit)

For each candidate, fill a record from `templates/reference-analysis.md`. Inspect:

- **Visual:** first viewport, full page, nav/footer, type hierarchy, grid, spacing, color, imagery, rhythm, responsive behavior.
- **Interaction:** hover/focus, menus, transitions, scroll effects, cursor effects, loading, forms, touch, keyboard.
- **Technical (when permitted):** DOM/semantics, computed CSS, scripts and network (framework/library fingerprints like `__NEXT_DATA__`, `/_next/`, `gsap`, `ScrollTrigger`, `three`, `webgl` contexts), the repository, dependencies, run locally if feasible.

Quick technical fingerprinting with Playwright (when the site is reachable):

```js
const libs = await page.evaluate(() => ({
  next: !!document.querySelector('script[src*="/_next/"]') || !!window.__NEXT_DATA__,
  gsap: typeof window.gsap !== 'undefined',
  scrollTrigger: typeof window.ScrollTrigger !== 'undefined',
  three: typeof window.THREE !== 'undefined',
  lenis: document.documentElement.classList.contains('lenis'),
  canvases: [...document.querySelectorAll('canvas')].length,
}));
```

A global not found doesn't mean the library isn't used (bundlers hide globals) → `UNKNOWN`, not "not used".

## Step 4 — Label every conclusion

- `VERIFIED` — read in source code, package files, or official docs; or measured by a tool you ran.
- `OBSERVED` — seen in a rendered page/screenshot/video you actually viewed.
- `INFERRED` — plausible explanation (e.g. "the reveal looks like a clip-path wipe").
- `UNKNOWN` — not enough evidence.

Search-result snippets and third-party write-ups about a site are secondary evidence: at most `INFERRED` for visuals, and they never make implementation claims `VERIFIED`.

## Step 5 — Compare and shortlist

Build a compact table: reference → what to learn → what *not* to copy → relevance (high/med/low). Keep 3–6 "lessons" phrased as principles ("type crops off the viewport edge to signal scale", "proof shown as before/after slider, not stat cards").

Also note **anti-references** (what the competitors all do — the thing to differ from).

## Step 6 — Hand off to design planning

Pass the shortlist and lessons into `workflows/design-planning.md`. Keep the research notes in the project (e.g. `docs/design/research-YYYY-MM-DD.md`) only if the user wants artifacts in the repo; otherwise summarize in the delivery report.

## Ethics and licensing

- Use references to learn principles; never copy proprietary code, assets, copy, brand marks, or distinctive compositions.
- Open-source code: respect its licence (MIT/Apache: keep notices if you copy substantial code; GPL: don't paste into proprietary projects; no licence = all rights reserved — study only).
- Don't scrape paywalled libraries (Mobbin, Refero) beyond what the user's account and the site's terms allow.
