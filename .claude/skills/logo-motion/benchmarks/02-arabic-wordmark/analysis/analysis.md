# Logo analysis — تسويق (Arabic wordmark)

Source: `logo/source.svg`. The word تسويق is set in Thmanyah Serif Display Black (the site's Arabic display face, `src/fonts`) and outlined with `outline-text.mjs --verify` (boundary F 1.000 against Chromium/HarfBuzz shaping). Ink is #0A0A0A on paper #F2F2EF. This is a *test wordmark*, not a client's official logo.

## A. Structure
- **[measured]** 8 parts, 5 islands, 2 holes. Aspect 2.39.
- **[observed]** Arabic wordmark, read right to left: ت (p7 + dots p8) · س (p6) · و (p5, counter h2) · ي (p3 + dots below, p4) · ق (p1, counter h1, + dots p2).
- **[observed]** Two joined runs: **تسو** and **يق**. و does not join to its left, so there is a natural break between و and ي.
- Hierarchy: the heavy bowls of ق and و (the largest ink, 32% and 22%), then the teeth of س, then the dots.

## B. Geometry & construction
- **[measured]** The dot pairs p2, p4 and p8 are identical (similarity 0.953–1.0). Each dot is a **diamond (a square rotated 45°)**, the mark of a broad reed pen (qalam).
- **[measured]** Connection strokes form a continuous horizontal band at y ≈ 325–398 viewBox units (sampled across س and the joins). This is the baseline of the joined strokes.
- **[observed]** Strong horizontal energy. The joins run along one band; the bowls of ق and و descend below it; the teeth and the ت rise above it.
- **[measured]** Asymmetric: symmetry IoU < 0.3 on every axis, so motion should be directional (RTL).

## C. Typography
- **[observed]** A display Naskh-influenced serif: high contrast, wedge terminals, rhomboid dots, deep bowls.
- **[verified: script convention]** Arabic letters join along the baseline. The tatweel/kashida (ـ) lengthens a join and is a native justification device. Kashida lives only *inside* a joined run, never across a non-joining letter like و.
- Risks:
  - Never separate joined glyphs in the final state.
  - Never letter-space.
  - The dots must remain in place.
  - Motion must read right to left.

## D. Meaning & personality
- **[verified: repo]** تسويق means "marketing". It is the Arabic name of the studio (site tag: "استوديو تسويق من الجيل الجديد").
- **[interpreted]** Personality of this setting: editorial, confident, calligraphic heritage in a modern cut.

## E. Animation opportunities
| opportunity | evidence | why it fits |
|---|---|---|
| kashida stretch → settle | joined-stroke band y 325–398; two joined runs; break after و | elongation is Arabic typography's own motion vocabulary; here it can resolve into the true word |
| diamond dots as qalam stamps | p2/p4/p8 identical rhombi | in writing, dots (i'jam) are added after the letter bodies, with the pen's square nib |
| rise from the baseline | letters stand on, and hang from, one band | a reveal outward from the join line keeps letterforms intact |
| RTL wave | asymmetric, strong horizontal flow | follows the reading direction |
