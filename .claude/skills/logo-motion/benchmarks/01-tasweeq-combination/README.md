# Tasweeq — logo motion ("Two Scripts, One Mark")

| | |
|---|---|
| Logo type | combination mark (symbol + wordmark), official SVG paths + NewBlack wordmark |
| Concept | the symbol is *written*: Arabic body right→left, dots tapped, Latin T left→right; the wordmark rises as one wave continuing the T bar's motion |
| Duration / fps / size | 4.0 s · 60 fps · 1920×1080, background #0A0A0A |
| Final state | official lockup, pixel-exact from 2.95 s (QA: IoU 1.000, mean error 0.21, ΔE 0.0) |
| Engine | SVG + GSAP (DrawSVG for clip-masked "pen" strokes, CustomEase from the site's `motion.ts`), lm-runtime |
| QA verdict | **PASS, 85.0/100** (blind critic round 3 + automated checks). Baseline preset: 57.0 |

Renders: `renders/composition.mp4` · `.webm` · `.gif` · QA evidence in `renders/qa/`.

## Why this movement
The symbol contains two scripts: p1 is a Latin **T**, and p2's bowl with the two dots reads as Arabic **ت**, the first letter of تسويق. That reading is an interpretation; the brand's bilingual identity is verified. Both shapes have stroke-like solidity (0.54 / 0.40), so the mark is revealed the way it would be *written*. Each script moves in its own direction, and the dots arrive last, as in handwriting. The wordmark uses the website's own motion grammar: `cubic-bezier(0.22, 1, 0.36, 1)` with a line reveal.

## Key technique: clip-masked pen
Each filled shape is revealed by a wide stroke that runs along its centre line and is clipped by the official path. Mid-animation it reads as a broad-nib pen. At 100% the stroke covers the clip completely, so the final state *is* the official fill. No stroke approximation survives into the hold, and QA confirms it pixel-exact.

## Reproduce
```bash
node build-composition.mjs                     # embeds official paths from logo/source.svg
cd ../../engine
node render.mjs ../benchmarks/01-tasweeq-combination/composition.html --formats mp4,gif,webm --check-determinism
python3 qa.py ../benchmarks/01-tasweeq-combination/renders --blueprint ../benchmarks/01-tasweeq-combination/blueprint.json --review ../benchmarks/01-tasweeq-combination/review.json
```

## Iterations
| round | observed problem (evidence) | correction | result |
|---|---|---|---|
| 1 | QA "dead air 0.63–1.77 s" and "dot stage has no motion", but the frames clearly showed motion (contact sheet). The QA metric was blind to small parts. | **Engine fix:** QA now measures changed-pixel counts at 640 px, not whole-frame mean diff | false positives gone; a deliberately broken clip still fails |
| 1 | lockup only 121 px tall at 1080p (`final_logo_width_share` 0.42; contact sheet hard to read) | rect 806 → 1100 px wide | width share 0.568, still inside safe area |
| 2 | blind critic r2: 7/7/7/9. "Wordmark entrance generic, not related to the mark; gap 2.0–2.48 s; long static tail" | wordmark wave starts the instant the T bar lands (1.78 s), 0.06 s stagger; duration 4.5 → 4.2 s | critic r3: 8/7/8/8 |
| 3 | critic r3: "stray thin line under the last E at 2.32 s". Verified at 4× zoom: the hard line-mask edge slices horizontal E arms into 1-px slivers | soft-edged gradient mask (14-unit feather); hold trimmed (duration 4.0 s) | slivers gone (frames 128–146 checked at 4×); final still pixel-exact |
| 3 | critic r3 also claimed "W tracking tighter than official" | rejected with evidence: final-frame IoU 1.000, bbox offset 0 px | critics can be wrong, so verify their claims |

## Baseline comparison (same canvas, same QA, same blind critic)
| | originality | motion | brand | clarity | weighted total |
|---|---|---|---|---|---|
| generic fade + scale preset | 2 | 4 | 3 | 8 | 57.0 |
| this skill (r3 review) | 8 | 7 | 8 | 8 | 85.0 |
Both pass every automated technical check. Only the blind creative review separates them.

## Known limitations
- The bilingual (ت) reading was **not** perceived by the blind critic from still frames. It works as a subtle layer, not the headline message.
- Round 4 has not been re-reviewed by the critic; its fixes target the r3 critic's top issue.
- The wordmark is NewBlack outlined to match the website rendering. If a master logo file exists, swap it into `logo/source.svg` and re-run `build-composition.mjs`.
