# 07 · Editorial, Brochure & Publication Design

## 1. Page architecture

Define once and apply to every page: trim, bleed (3 mm), safe zone (≥5 mm
inside trim), margins (outer > inner for spreads, with the bottom often
largest), column grid, baseline unit, and the furniture positions (running
header, folio, section tab). Generate them with `grid.py --format a4-portrait
--margin-outer .09 --margin-inner .06 --rows 0 --baseline <body leading px>`.

## 2. Page roles and their layouts

| Role | Layout behaviour |
|---|---|
| Cover | one idea, one image or type gesture; masthead/title zone fixed across issues |
| Contents | modular list; numbers aligned (tabular); entry points with thumbnails |
| Chapter opener | big type or full-bleed image; lots of air; section colour introduced |
| Feature spread | hero image spanning gutter only if no face/text falls in the fold; headline + standfirst + drop cap/initial; body on columns |
| Running pages | text on baseline; images snap to column/module multiples; captions near their image, sharing its edge |
| Pull quote | breaks rhythm on purpose; ≤25 words; never repeats the paragraph next to it |
| Data / info page | modular grid; one chart style; labels on the data, not in legends |
| Back cover | contact/CTA, legal, barcode zone per production spec |

## 3. Text–image sequencing

- A caption sits in the same column or module as its image, aligned to a shared edge, with a fixed gap (one baseline).
- Images follow the text that mentions them, on the same spread where possible.
- Vary scale across a sequence (large → small → full-bleed) to create pace. Do not repeat one composition on every page.
- Full-bleed images extend 3 mm past the trim. No critical content within 5 mm of trim or gutter.

## 4. Text density

Body copy on its baseline, 45–75 characters per line; one standfirst per
feature; subheads every 300–500 words in long reads. If copy overflows, edit
or add a page. Never drop body below 8.5 pt or tighten leading to fit.

## 5. Brochures and folds

| Fold | Panel logic (outside → inside) | Production checks |
|---|---|---|
| Bi-fold (A4 → A5) | cover · back · spread | creep is negligible for one sheet |
| Tri-fold / roll fold (DL) | cover (right outside) → flap (inside left, seen first on opening) → full inside | inner fold-in panel 2–3 mm narrower (e.g. 97 mm vs 100 mm); never cross a fold with text |
| Z-fold | panels read as a sequence; equal widths | test with a paper dummy |
| Saddle-stitched booklet | page count multiple of 4 | creep on thick stocks: shift inner pages' content toward the spine edge |

**Always check against the printer's actual template.** These values are
common defaults, not universal ones. Without a spec, deliver with a stated
assumption.

## 6. Multi-page review

Render all pages (`render.mjs --pdf` and PNGs). Review them as a **contact
sheet** for rhythm: alternating density, recurring furniture in fixed places,
section colour logic, and no two neighbouring spreads with the same layout
unless that repetition is the idea.

## 7. Deliverables this environment can produce

Chromium PDF with live text, one page per `.canvas` (RGB). There are **no CMYK
separations, no ICC-managed colour, and no InDesign/IDML package**. When a press
needs CMYK or InDesign, say so. Adobe tools exposed via MCP
(`document_convert_pdf`, `convert_pdf_to_indd`, `export_idml`) may cover part of
that if authenticated, but treat them as untested here and verify their output
before you claim anything.
