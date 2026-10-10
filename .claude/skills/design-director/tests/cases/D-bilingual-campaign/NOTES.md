# D · Bilingual social campaign: record

**Research:** REF-0006 (bilingual parity at system level), REF-0011 (dual-language strategy spectrum), REF-0005
(foundry-matched pairing). All `search-verified`, not inspected; used for the strategy decision only.

**Bilingual model:** B, Arabic primary / English secondary (module 05 §5). Each script hangs from its own outer
edge (Arabic right, English left). Info block in two parallel columns, one per script.

**Concept:** the low sun sits on the horizon between the two languages, as the meeting point.

**Type:** thmanyah serif display 900 (AR title, 168 px) · NewBlack 600 (EN title, 104 px ≈ 0.62×) · Plex Arabic / Inter
for info. Two families per script (4 total, QA minor accepted: it is two pairs, not sprawl).

**Bidi:** URL isolated LTR; Arabic dates «١٢ – ٣٠ نوفمبر ٢٠٢٦» verified in a zoomed crop (١٢ rightmost, dash, ٣٠, month, year);
Arabic comma «،» correct.

**Iterations:**
1. v1 story: Arabic title at 190 px wrapped to two lines and **collided with the English title**; info sat on the
   stretched mid-dunes at 2.8–3.9:1. Caught by QA (overlap, contrast, arabic-leading).
   Fix: same title size as the feed, and the story was **recomposed**, not stretched: info moves into the tall sky, in ink.
2. QA overflow false positive (104 px descender inside a 16 px container) → tolerance now uses the largest type inside the box.

**QA:** PASS · 0 critical · 0 major · 2 minor (type-families, one per canvas).

**Rubric (self-review):** concept 4 · hierarchy 4 · grid 4 · composition 4 · negative space 4 · typography 5 · text 5 ·
art direction 4 · brand 4 · craft 4 = **42/50**. Weakest: the dune illustration is generic; feed info block sits
close to the dune crest.

## Update 2026-10-10: user font change (Alexandria / Inter Tight)

Switched to Alexandria + Inter Tight. The first render failed QA (overlap, arabic-leading): the 168 px Arabic title wrapped. Re-sized from measurement: AR 132 px / 1.3, EN 88 px. Re-QA: PASS (0/0/0). The two-families-per-script minor disappeared, because the system now uses exactly two families. Rubric scores above were given before the font change and were not re-scored.
