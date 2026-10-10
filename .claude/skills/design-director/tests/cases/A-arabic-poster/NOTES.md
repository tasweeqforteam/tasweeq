# A · Arabic advertising poster: record

**Research:** library recall `--language ar` → REF-0005 (type-led Arabic poster series), REF-0008 (geometric
Arabic as image). Both are `search-verified` only: WebFetch was DNS-blocked, so neither was seen and both
informed principles, not composition. Gap: no inspected Arabic food/beverage ad reference.

**Concept:** "the suspended drop": slowness made visible as one drop frozen between dripper and carafe.
Headline claims it; the image proves it.

**Layout:** asymmetric 6-col RTL grid, 8 rows, margins 72, gutter 24, baseline 8 (`grid.py --format ig-portrait`).
Headline rows 2–3 cols 1–5 (right) · product cols 4–6, bleeding the bottom margin · sub cols 1–3 · CTA row 8.
Lead principles: negative space, scale contrast, RTL directional movement (eye: brand → headline → drop → CTA).

**Type:** thmanyah serif display 900 (headline, brand) + IBM Plex Sans Arabic 400 (sub, CTA) + Inter (URL, isolated LTR).
`glyph_coverage.py`: both Arabic faces complete for the copy.

**Image plan:** vector SVG illustration (dripper, drop, carafe), built in the page. **Not photography, not AI-generated.**
A production run would composite a real product photo per module 11.

**Iterations (what review caught):**
1. v1 QA: Arabic body fell back to DejaVu, a **bug in templates/base.css** (`.canvas` set Inter and overrode the inherited
   Arabic stack). Fixed in base.css with `.canvas:lang(ar)`. Also: brand requested weight 400 of a Black-only face → `.display-ar` now sets 900.
2. v1 visual review: white ceramic dripper vanished against the paper (figure–ground) → matte dark ceramic.
   Sub-line broke «بدفعات / صغيرة» (noun/adjective split) → manual break after «يدويًا».
3. QA false positive (headline lines "colliding") traced to content-area boxes → qa.mjs now uses line boxes.

**QA:** PASS · 0 critical · 0 major · 1 minor (brand's font ascent area crosses the safe margin; harakat checked visually and fully visible).
Visual check of the PNG: joins correct, لا ligature present, shadda/damma on بُنّ intact, ٢٠٪ ordered correctly.

**Rubric (self-review by the skill, not an independent reviewer):** concept 4 · hierarchy 5 · grid 4 · composition 4 ·
negative space 4 · typography 4 · text accuracy 5 · art direction 4 · brand 4 · craft 4 = **42/50**. Meets the gate, just.
Weakest: illustration is simple; no real brand assets exist for this fictional client.

**Similarity check:** no inspected reference to compare against; the composition was developed from the brief.

## Update 2026-10-10: user font change (Alexandria / Inter Tight)

Typefaces switched to the user's defaults: Alexandria (Arabic) + Inter Tight (URL). The first render with Alexandria failed QA (critical clipping, overlap, arabic-leading): Alexandria at 800 is far wider than thmanyah, so the 148 px headline wrapped to three lines and ran into the brand line. Headline re-sized from measurement to 128 px / 1.35 leading across all six columns; product scaled to 785 px tall. Re-QA: PASS (0/0/1). The visual check repeated: joins, لا ligature, shadda/damma and ٪ all correct. Rubric scores above were given before the font change and were not re-scored.
