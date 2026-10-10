# 13 · Design Critique & Quality Assurance

Two layers, both required before delivery:

1. **Automated evidence**: `node scripts/qa.mjs design.html --json qa.json`
   (artboard size, clipping, safe area, copy accuracy, fonts actually rendered,
   missing weights, Arabic hazards, pixel-measured contrast, overlaps, image
   distortion/resolution, widows, near-miss alignment, type sprawl).
2. **Art-director critique**: look at the rendered PNG at 1× and at phone
   scale, plus the `--grid` render, and score the rubric below. The script
   cannot judge concept, hierarchy *choice*, originality or brand fit.

## Rubric: score 0–5 each, 50 total

| # | Category | 5 means |
|---|---|---|
| 1 | Concept & relevance | one clear idea that answers the brief; memorable |
| 2 | Visual hierarchy | 1→2→3 order obvious within 2 s |
| 3 | Grid & layout | appropriate system, used consistently, breaks are deliberate |
| 4 | Composition & optical balance | stable or purposefully tense; squint test passes |
| 5 | Negative space | every empty area has a job |
| 6 | Typography & readability | faces fit, setting is clean (rag, breaks, leading, kerning), readable at display size |
| 7 | Language & text accuracy | copy exact; Arabic shaping/bidi correct; QA copy checks clean |
| 8 | Art direction & image quality | coherent visual world; images integrated, no artefacts |
| 9 | Brand fidelity | marks, colours, product undistorted and correct |
| 10 | Production craft | no clipping, no near-misses, correct size/resolution/safe areas |

**Release threshold: ≥ 42/50 with zero critical failures** (a project
quality rule, not an industry standard). Below that, revise and re-score.

## Critical failures (block delivery regardless of score)

| Failure | Detected by |
|---|---|
| Incorrect supplied copy / missing required element | `qa.mjs` copy-accuracy, copy-missing |
| Broken Arabic shaping / reversed text / fallback-font Arabic | `qa.mjs` arabic-presentation-forms, font-fallback; **visual check of the PNG** |
| Distorted brand mark or product | `qa.mjs` image-distortion; visual comparison with the supplied asset |
| Unreadable essential info | `qa.mjs` contrast (critical < 2:1), min-size; visual |
| Wrong aspect ratio / size | `qa.mjs` aspect (with `dd:canvas` meta) |
| Unintended cropping / clipped text | `qa.mjs` clipping; visual |
| Serious compositional defect | critique |
| Major product inaccuracy | critique against the reference photo |
| Unsupported claims (invented metrics, awards) | critique against the brief |
| Unverified deliverable presented as complete | honesty rule: list only files that exist |

Major QA issues (`REVISE`) are fixed, or explicitly justified in the delivery
note (e.g. "contrast 4.2:1 on 64 px headline accepted as large text").

## Critique questions

Is the message understood immediately? Is the focal point intended? Is the grid
right for the content? Are alignments deliberate? Is the weight balanced? Does
the negative space serve? Is the typography accurate and readable? Does it fit
the brand? Are images and graphics integrated? Does it work at actual display
size? Is it original (module 12 §2)? Can anything be removed? Does it meet the
**actual** brief?

## QA note format (attach to every delivery)

```
QA: qa.mjs PASS (0 critical · 0 major · 2 minor: …) · fonts rendered: …
Rubric 44/50: concept 4 · hierarchy 5 · grid 5 · composition 4 · space 4 · type 5 · text 5 · art dir 4 · brand 4 · craft 4
Similarity check vs REF-0005, REF-0006: 1/5 and 0/5 axes → original
Known limitations: product image is an SVG illustration placeholder, not photography
```

Do not approve a design merely because it looks attractive.
