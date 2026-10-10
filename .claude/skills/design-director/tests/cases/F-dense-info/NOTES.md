# F · Dense information layout: record

**Grid choice:** modular. The content is a matrix (time × track), so the grid is the table: time column (2 parts)
+ three equal track fields (3 parts each), rows = time slots. Plenaries span all tracks on a tinted common region.
A 12-column page grid would add nothing here.

**Grouping:** inner spacing 4–6 px (title → meta), slot spacing 14–16 px plus one hairline; track identity by
column position + header + 6 px colour rule, so colour is never the only cue.

**Type:** NewBlack 700 title; Inter for everything else; 7 sizes; minimum 16 px ≈ 7.7 pt at 150 dpi (`dd:min-text 16`).

**Iterations:**
1. v1 passed QA, but the art-director review found a ~390 px **passive empty band** above the logistics.
   On a dense page, unused space means the type could be bigger. QA gained an `empty-band` heuristic
   (now in the regression fixture).
2. v2: slot rows share the page height (`grid-auto-rows: 1fr`), session type 19→21 px, meta 16→17 px,
   `text-wrap: balance` on two-line titles (removed three runts).

**QA:** PASS · 0 critical · 0 major · 3 minor (title ascent area at the safe line; two runts in logistics paragraphs).
PDF rendered: `tests/results/F-dense-info/F.pdf`.

**Rubric (self-review):** concept 4 · hierarchy 5 · grid 5 · composition 4 · negative space 4 · typography 4 · text 5 ·
art direction 4 · brand 4 · craft 5 = **44/50**. Weakest: equal-height rows give plenary rows more air than they need.

## Update 2026-10-10: user font change (Alexandria / Inter Tight)

Re-set in Inter Tight. Re-QA: PASS (0/0/0). Rubric scores above were given before the font change and were not re-scored.
