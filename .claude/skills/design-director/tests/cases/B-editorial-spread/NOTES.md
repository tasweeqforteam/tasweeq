# B · English editorial spread: record

**Research:** none of the library records cover Latin editorial layout (gap logged; `library.py stats` shows no
`editorial` format). Proceeded on module 04/07 principles.

**Concept:** calm, architectural editorial. The plan drawing is the hero; type is quiet and exact.

**Layout:** per page 6 cols, gutter 30; margins top 150 / bottom 180 / outer 150 / inner 100; baseline 30 px
(body 21 px ≈ 10 pt on 14.4 pt). Left page: kicker → 210 px display headline → serif standfirst → plan figure + caption.
Right page: 2-column body with drop cap and subheads, outer column holds Fig. 2 + caption, pull quote closes the page.

**Type:** NewBlack 800 (headline, drop cap) · Liberation Serif (standfirst, pull quote. Times-metric draft serif, the only
serif available locally) · Inter (body, captions, furniture).

**Image plan:** two vector diagrams (plan, street section) drawn in SVG, appropriate to an urbanism feature.

**Iterations:**
1. v1 QA: **body text overflowed** into a hidden third column (last sentence cut). qa.mjs had no check for that, so an
   `overflow` check was added (and is now in the regression fixture). The left page also ran past its bottom
   margin, crowding the caption against the folio.
2. Visual review: the "AFTER" label in Fig. 2 collided with a tree; the plan figure cropped off its own perimeter road.
3. QA false positives fixed: paragraphs flowing across columns were compared as union boxes (now line by line);
   rag edges were treated as alignment edges (now only the aligned edge counts).

**QA:** PASS · 0 critical · 0 major · 3 minor: headline last line "City" (deliberate: the 3-word title's strongest shape);
two runts at column breaks ("comfortable.", "decoration.") that `text-wrap: pretty` cannot fix across columns.
Acceptable for a test, but a production pass would edit copy or balance columns.

**Rubric (self-review):** concept 4 · hierarchy 5 · grid 5 · composition 4 · negative space 4 · typography 4 ·
text 5 · art direction 4 · brand n/a→4 · craft 4 = **43/50**. Weakest: Liberation Serif is a stand-in; right-page
column bottoms are uneven.

## Update 2026-10-10: user font change (Alexandria / Inter Tight)

All English set in Inter Tight: standfirst 300, pull quote 500 italic (replacing the Liberation Serif stand-in), headline 700/800 via the display stack, SVG labels Inter Tight. Re-QA: PASS. The narrower face shortens the body, so column 2 now ends higher. Acceptable; production would balance the columns. Rubric scores above were given before the font change and were not re-scored.
