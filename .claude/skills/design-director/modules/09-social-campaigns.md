# 09 · Social Media Design & Campaign Systems

## 1. Formats (verify current platform specs before final delivery)

| Placement | Canvas | grid.py preset | Notes |
|---|---|---|---|
| Feed square | 1080×1080 | `ig-square` | |
| Feed portrait | 1080×1350 | `ig-portrait` | most screen area in feed |
| Story / Reel / TikTok cover | 1080×1920 | `story` | UI overlays: keep text out of top ~250 px and bottom ~340 px (working values) |
| X / link landscape | 1600×900 | `x-landscape` | |
| LinkedIn square | 1200×1200 | `linkedin` | |
| Carousel slide | same as feed | — | consistent canvas across all slides |

## 2. Campaign system sheet (write before designing the second asset)

```
Concept ............ one sentence
Key visual ......... the master composition all others derive from
Hierarchy .......... P1/P2/P3 roles and their type styles
Type system ........ families, sizes per role per format, AR/EN rules
Colour rules ....... base, accent, max 1 accent per asset, background rotation logic
Image treatment .... light, crop distance, grade, cut-out vs in-scene, AI/photo source
Grid & spacing ..... per format (grid.py output), shared margins
Logo placement ..... fixed corner/zone and size per format
Graphic devices .... the ownable element (frame, band, shape, Arabic letter crop…)
Variation rules .... what MAY change per asset (crop, bg colour from set, device position)
                     what MUST NOT change (type styles, logo zone, margin system, grade)
Adaptation rules ... per placement (see §4)
```

Each asset delivers its own message. Recognition comes from the fixed elements.

## 3. Carousels

- Slide 1 = the hook: a claim, question or visual tension that earns the swipe. No logo-only covers.
- Slides 2…n−1 = progression (steps, reasons, before/after, a list), one idea per slide, a consistent anchor (number, device) in a fixed position.
- Last slide = payoff + CTA.
- Vary composition deliberately (text-led ↔ image-led) while keeping the grid. Continuity devices that cross slide edges must line up exactly at the seam.
- Render all slides as one contact sheet and review the sequence, not single frames.

## 4. Adapting across placements: recompose, never just crop

For each new aspect ratio:
1. Re-place the focal point for the new frame (portrait gives vertical stacking; landscape gives side-by-side).
2. Resize type per role from the type system (not proportional scaling of the whole artboard).
3. Re-run grid.py for the format. Respect story safe zones.
4. Re-frame imagery: generate or crop with the new ratio in mind (module 11). Extend backgrounds rather than shrinking the subject.
5. Keep the logo zone and devices consistent in *relative* position.
6. QA every placement separately.

## 5. Bilingual campaigns (Arabic + English)

Choose a model and state it:
- **A. Separate placements per language** (cleanest; one script per asset; identical system).
- **B. Primary/secondary**: one language leads, the other at P2/P3, same alignment edge logic per script.
- **C. Parallel**: equal halves, each script aligned to its own outer edge, mirrored structure.
Isolate LTR runs in Arabic. Perceived-size parity (module 05 §5). Preserve
brand names and URLs exactly.

## 6. Accuracy across variations

Product details (shape, label, colour, count), brand marks and copy must match
in every asset. If AI imagery is used, compare each variation with the reference
product image before approval (module 11 §4).
