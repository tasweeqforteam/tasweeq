# 10 · Presentation Design & Visual Storytelling

A deck is a narrative, read at a distance or skimmed on a phone. Each slide
makes **one point**, stated in its title as a sentence (an "action title"),
with the slide body as evidence.

## 1. Story structures

| Deck | Arc |
|---|---|
| Brand identity | context → insight → idea/concept → identity system (logo, type, colour, image, devices) → behaviour/applications → guidelines snapshot → close |
| Creative concept / campaign | brief → audience truth → concept line → key visual → system → executions per placement → rollout |
| Case study | client & challenge → approach → work → **actual** outcomes (only documented figures; otherwise qualitative) → learnings |
| Pitch / business | problem → solution → why now → proof → model → ask |

## 2. Slide layout vocabulary (vary by content, keep the grid)

Opening/title · section divider · executive summary (3 points max) · statement
(one huge line) · full-bleed image · concept explanation (image + 3 lines) ·
comparison (2 columns, aligned rows) · process (3–5 steps, one direction,
RTL for Arabic) · evidence/data (one chart, labelled directly; see the dataviz
skill) · mockup/application · quote · conclusion/CTA.

## 3. System

- 16:9 at 1920×1080 (`grid.py --format slide-16x9 --columns 12 --rows 0`), margins ~5–7%.
- Title zone fixed in position across content slides. Folio and section marker fixed.
- Type: title 56–80 px · body ≥ 28 px · labels, folios ≥ 22 px (qa.mjs default minimum: 2% of the short side). Never tiny text to fit; split the slide.
- One accent colour for emphasis, used for *meaning* (the thing to look at), not decoration.
- Imagery and mockups: real assets supplied by the client. Mockups must not distort the logo or misrepresent the product.

## 4. Honesty rules

No invented metrics, clients, testimonials or awards. If the case study has no
measured results, write "Results: not yet measured" or describe qualitative
outcomes the client confirmed.

## 5. Output paths

Chromium-rendered PDF (`render.mjs --pdf`) and PNGs from HTML slides. Editable
.pptx via the `anthropic-skills:pptx` skill. Adobe Express via
`export_html_to_express` (call `html_export_readiness_skill` first, always,
and only with the user's go-ahead, since it uploads the design).
