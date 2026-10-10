# 04 · Layout Engineering, Grids & Negative Space

Choose the grid from **content, format and intent**. The default 12-column grid
is a web habit, not a design decision.

## 1. Grid selection

| System | Use when | Construction notes | Breaks it legitimately |
|---|---|---|---|
| Manuscript | long reading, simple pages | one text block; line length 45–75 Latin chars (Arabic ~40–65); margins frame it | display headline may hang outside |
| Column | brochures, spreads, structured posters, mixed text/image | 2–6 cols print, 4–6 social; define spanning rules (e.g. body = 2 cols, image = 3 or 6) | full-bleed image |
| Modular | catalogues, data, content systems, product grids | columns × rows; modules share gutters; every image snaps to module multiples | hero module spanning a block |
| Hierarchical | ads, expressive editorial, uneven priorities | zones sized by importance, not equality; still share 2–3 edges | — it *is* the exception |
| Baseline | multi-column text where rows must line up | unit = body line-height (8 px social, 12–14 pt print); body snaps; display may be exempt but should land back on the grid | display type, captions on half-baseline |
| Asymmetric | editorial sophistication, directional energy | unequal columns (e.g. 2+4 of 6, or 1:1.618); keep a consistent margin system | — |
| Radial / circular / directional | the concept is circular or radiating (cycles, focus, sun, product turntable) | define the centre and the angular rhythm | never just decoration |
| Freeform / broken | experimental posters, concept ads | establish a structure first, then break it on purpose; ≤2 breaks | hierarchy must survive |
| Proportional systems | thirds, golden section, root rectangles, as starting divisions | they are tools, not laws; optical judgement wins | — |

## 2. Construction checklist (write this down before you build)

```
Format      1080×1350 portrait social (4:5)          ← scripts/grid.py --format ig-portrait
Grid        asymmetric 6-col, 2+4 split · rows 8 · baseline 8 px
Margins     72 px (≈6.7% short side), bottom 96 px to seat the CTA
Gutters     24 px
Safe area   (stories: top 250, bottom 340 — confirm against the current platform spec)
Focal point product, cols 3–6, rows 2–6
Zones       headline cols 1–6 row 1 · claim cols 1–2 rows 4–5 · CTA cols 4–6 row 8
Reading     RTL (Arabic): path starts top-right
Anchors     shared inline-start edge for all Arabic text; product breaks the bottom margin deliberately
Negative    protected field around product ≥ 1 module on every side
```

`python3 scripts/grid.py --format <preset> --columns N` prints the numbers and a
CSS block for `templates/base.css`. Margins are proportional to the short side
and snap to the baseline. Safe areas only ever round *up*.

Typical margin ratios (of the short side), as starting points: social 6–8% ·
poster 6–10% · editorial outer 8–10% / inner 5–7% · slides 5–7%. Bigger margins
signal calm or luxury. Tight margins signal urgency, density or editorial energy.

## 3. Layout-first sequence

1. Extract and classify all content (headline, sub, body, CTA, logo, legal, imagery).
2. Rank the information (P1 / P2 / P3).
3. Choose the grid (§1) and write the spec (§2).
4. Wireframe: render grey boxes and real copy through `render.mjs --grid`. Check the hierarchy before any imagery exists.
5. Only now generate or select images, briefed to the zones (module 11).
6. Integrate, review with the overlay, refine optical balance, and run QA.

Skip to step 4 for small tasks, but **never skip the hierarchy decision**.

## 4. Negative space

| Kind | Use |
|---|---|
| Micro (inside and between letters, lines, items) | readability, grouping |
| Macro (between groups, margins) | structure, pace, perceived value |
| Active | shapes the composition: frames the focal point, creates tension, carries the eye |
| Passive | leftover gap with no job. Remove it or give it a job |

Pre-release negative-space check:
1. Is the focal point separated by clear field?
2. Are related elements grouped (inner < outer spacing)?
3. Is visual weight distributed on purpose (squint test / blur at 10%)?
4. Are the margins right for the format and the brand register?
5. Too dense? → cut copy before you shrink type.
6. Too empty? → empty must *do* something (luxury, pause, tension). If not, enlarge the subject.
7. Do the empty areas support the concept?
8. Are text blocks comfortable (line length, leading)?
9. Does it hold at actual display size? (judge the 1× render; for a phone feed, view ~360 px wide)
10. Can any element go without loss? → remove it.

Minimalism is not oversized margins with sparse content. It is the removal of
everything that does not serve the message.
