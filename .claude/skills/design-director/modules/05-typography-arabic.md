# 05 · Arabic Typography & RTL Design

Arabic is its own discipline, not mirrored Latin. Rendering uses real text
in Chromium. HarfBuzz performs contextual shaping (isolated/initial/medial/final),
mandatory ligatures (لا) and bidi ordering. **Never** paste pre-shaped
presentation-form characters (U+FB50–FEFF) or reversed strings. `qa.mjs`
fails them.

## 1. Fonts (verify with `glyph_coverage.py --inventory`)

| Face | Role | Coverage / limits |
|---|---|---|
| **Alexandria**, the **default Arabic face** (user rule, 2026-10-10) | everything Arabic: display (700–900), headlines, text (300–400), CTA (500–600) | variable wght 100–900; 101 Arabic code points incl. harakat, Arabic-Indic digits, ٪ ، ؛ ؟, tatweel; features ccmp/init/medi/fina/liga/rlig. Geometric, wide set: **measure headlines before sizing** (e.g. «القهوة الجيدة» at 800 = 6.89× its font size wide). Bundled: `assets/fonts/alexandria-arabic-wght-normal.woff2` |
| Inter Tight (Latin partner) | Latin runs inside Arabic (URLs, numbers, brand names) fall through to it automatically | see module 06 |
| thmanyah serif display Black 900 (`src/fonts`, opt-in `--ff-ar-serif-display`) | editorial serif voice when a brief calls for it | 72 Arabic code points; Black only |
| IBM Plex Sans Arabic Regular (`src/fonts`, opt-in) | alternate text face | Regular only |
| DejaVu Sans (system) | **fallback only** | QA reports any glyphs that land here |

Need a different Arabic face? Use the client's licensed brand font, or ask. Never
claim a font is in use unless QA's "fonts rendered" line shows it.

## 2. Choosing Arabic type

| Style family | Character | Use |
|---|---|---|
| Naskh-derived text faces | familiar, readable, traditional rhythm | body, long reading |
| Contemporary low-contrast / geometric sans (e.g. Alexandria, Plex Arabic) | neutral, modern, confident | social copy, display, bilingual systems |
| Kufi / geometric | architectural, bold, graphic | display, logotypes, short headlines |
| High-contrast display / serif display (e.g. thmanyah, opt-in) | editorial, authoritative, cultural | headlines, covers, campaign voice |
| Calligraphic (Thuluth, Diwani, Ruq'ah) | ceremonial, heritage, emotional | short display only; must be lettered or set by someone competent. Never fake it with distortion |

Consider brand personality, reading length, viewing distance, available
weights, and whether the Latin companion matches.

## 3. Setting rules

- `dir="rtl" lang="ar"` on Arabic blocks (or an ancestor). QA flags LTR Arabic blocks.
- **No letter-spacing on Arabic.** It breaks joins in most renderers and exporters. Emphasise with size, weight, colour or kashida.
- **Kashida (tatweel ـ U+0640)**: justification or display stretching only, between letters that legitimately join, never more than one per word in running text, and never in the supplied copy unless the client approves (it changes the string). Prefer `text-align: justify` with `text-justify: inter-word` for body.
- **Line height**: text 1.5–1.8; display 1.15–1.35 (depends on harakat). QA warns below 1.3 on multi-line Arabic.
- **Diacritic clearance**: with harakat, add leading and check that the top/bottom marks are not clipped by `overflow: hidden` containers (QA clipping check).
- **Word spacing**: leave natural. Do not justify narrow Arabic columns with wide gaps; use ragged-left (`text-align: start`) instead.
- **Punctuation**: Arabic comma ، (U+060C), semicolon ؛ (U+061B), question mark ؟ (U+061F), percent ٪ (U+066A). Do not "correct" the client's choice of Western vs Arabic-Indic digits (٥٠ vs 50). That is copy, and QA compares it exactly.
- **Numbers and Latin inside Arabic**: wrap URLs, SKUs, prices with Latin currency, and handles in `<span dir="ltr" class="isolate">` to stop bidi reordering (`+966 50 123 4567`, `tasweeq.sa`).
- **Headline wrapping**: break by sense and shape. Avoid one-word last lines (QA flags them) and splitting a construct phrase (إضافة) across lines. Use `<br>` or `text-wrap: balance` deliberately.
- **Word silhouette**: Arabic headline strength comes from ascender/descender rhythm and joined strokes. Check the line *shape*, not only its length.
- **Never stretch or squash** glyphs with `transform: scale` on text. Choose a width or size instead.

## 4. Layout direction ≠ mirroring

The reading direction sets where the eye **starts** (top-right) and where
text aligns (inline-start = right). It does not force mirroring the whole
composition: a product photo lit from the left, a logo lockup rule, or a
diagram with a time axis keeps its own logic. Use CSS logical properties
(`inset-inline-start`, `margin-inline-end`) so one layout serves both directions
when you want it to. Decide the composition separately from the script.

## 5. Arabic–English pairing (bilingual)

- **Parity by perceived size, not point size.** Arabic x-height and stroke texture differ. Typically set Arabic about 10–25% larger than Latin to read equal. Judge optically on the render.
- Match **stroke contrast and texture** (a low-contrast Arabic sans with a low-contrast Latin grotesque; a high-contrast Arabic display with a high-contrast Latin serif).
- Choose a **hierarchy model**: (a) primary script plus secondary script at a lower level, (b) equal parallel columns, (c) separate placements per language (module 09). Commit to one; mixing them is the common failure.
- Never force identical tracking or line-height on both scripts. Latin caps may be tracked +2–8%; Arabic stays at 0.
- Preserve brand names, URLs, numbers and technical terms exactly. Isolate LTR runs.
- Default pairing: **Alexandria + Inter Tight**, both geometric-leaning sans and both variable, so weight steps can be matched exactly. Alexandria's Arabic reads large: set the English 0.65–0.8× the Arabic size for equal or secondary emphasis, and confirm on the render.

## 6. Verification (mandatory)

1. `glyph_coverage.py --copy copy.json <fonts>` before choosing the face.
2. Render, then **look at the PNG** (open it with `Read`): joins connected, لا ligature present, dots and harakat intact, nothing reversed.
3. `qa.mjs`: no `font-fallback`, `arabic-*`, `copy-accuracy` or `clipping` issues.
If reliable rendering is unavailable in a target tool (e.g. an exporter),
deliver the Chromium-rendered PNG/PDF and say why.
