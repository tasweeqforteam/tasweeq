# Logo analysis — Tasweeq combination mark

Source: `logo/source.svg`, assembled from the site's own components: the official glyph paths from `src/components/ui/Logo.tsx` (cyan `#00D9F5`), plus the `TASWEEQ` wordmark in NewBlack Bold with −0.04em tracking (`font-display`), outlined with `outline-text.mjs --verify` (F 0.982). Colours are the dark theme (`--ink #F2F2EF` on `#0A0A0A`).

## A. Structure
- **[measured]** 11 parts and 11 islands; 2 holes (the counters of A and Q); aspect 6.67.
- **[observed]** Combination mark: a symbol (p1–p4) left of a wordmark (p5–p11). The symbol is about 1.5× the cap height and vertically centred on the caps.
- **[observed]** Hierarchy: (1) the cyan symbol (colour contrast and size), (2) the wordmark, (3) the two dots inside the symbol.
- Semantic groups:
  - p1 = "T" with a bar and a stem; its left shoulder is a concave fillet.
  - p2 = a thick open bowl: a top stub, the right arc, and a base bar running left.
  - p3 and p4 = two identical dots.
  - p5–p11 = T A S W E E Q.

## B. Geometry & construction
- **[measured]** p3≈p4 (identity, 0.969) and the two Es p9≈p10 (0.979). The circles are p3 and p4 (rel. rms < 2%).
- **[measured]** Shared top line p1.top = p2.top (y 0.032). The wordmark caps share one top line (y 0.193).
- **[measured]** **p1.right = p4.left** (x 0.189): the T bar ends exactly where the right dot begins, a hidden construction relationship.
- **[measured]** p2 stroke contrast: top stub 7.5, base 8.1, right side about 14 viewBox units. The arc is the heaviest point, like a broad-nib stroke.
- **[observed]** A slot opens in the symbol's top edge between the T bar end (x 74.9) and the p2 stub (x 82.2). It is the only entrance into the enclosed counter-space.
- **[observed]** Letters abut because of the tight tracking (p6.right = p7.left …): the wordmark reads as one dense block.
- Solidity: p1 0.54 and p2 0.40, so both read as thick strokes, not blobs. That makes them candidates for draw-on: write the shapes rather than fade them.

## C. Typography
- **[verified: repo]** The wordmark is NewBlack Bold, the site's display face, at −0.04em. It is a geometric grotesk with flat terminals, a closed-aperture S, and Q with a straight tail.
- **[interpreted]** The symbol fuses two scripts. p1 reads as Latin **T**. p2's bowl with the two dots reads as Arabic **ت** (taa: a bowl with two dots). Taa is the first letter of تسويق, which the brand name transliterates.
  - **[verified: repo]** The site is bilingual EN/AR, with the Arabic tag "استوديو تسويق من الجيل الجديد".
  - The Arabic body is written right→left; the Latin T is written left→right.
- Risks: per-letter motion must keep the left-to-right reading order of the Latin wordmark, and the symbol must never look like a broken Arabic letter in the final state.

## D. Meaning & personality
- **[verified: src/lib/i18n.ts, layout.tsx]**
  - "Next-Generation Marketing Studio" / "استوديو تسويق من الجيل الجديد".
  - "Build Brands That Move Culture".
  - "A single operating system that takes a brand from raw idea to compounding, measurable growth".
- **[verified: src/lib/motion.ts]** The site's motion language uses ease `cubic-bezier(0.22, 1, 0.36, 1)`, a line-mask reveal (y 110% → 0, 0.95 s) and 0.08 s stagger. The logo motion should feel native to it.
- **[interpreted]** Personality: confident, systematic, bilingual, precise rather than playful.
- Usage: website intro/loader, social sting, case-study end card. Target 4–5 s, with a loopable variant later.

## E. Animation opportunities
| opportunity | evidence | why it fits this logo |
|---|---|---|
| bilingual write-on: Arabic body RTL, Latin T LTR | p2 bowl + p3/p4 (interpreted ت); p1 = T; solidity 0.40/0.54 (stroke-like) | the mark is literally two scripts; writing each in its own direction tells that story with no added imagery |
| dots as the last "taps" of handwriting | p3≈p4 identical circles; in Arabic script the dots are written after the body | native script behaviour gives secondary motion a reason |
| slot entry (negative space) | the gap between p1.right and the p2 stub in the top edge | the only opening into the counter-space, so something could enter through it |
| broad-nib stroke weight | p2 contrast 7.5 → 14 on the arc | a draw-on can accelerate on the thin stub and slow on the heavy arc, like a pen |
| hidden alignment p1.right = p4.left | alignment x 0.189 | the T bar can "land" exactly where the dot sits: a satisfying construction beat |
| wordmark line-mask reveal | site motion.ts lineReveal; letters abut | it extends the site's existing motion grammar to the logo |

## Palette
- #F2F2EF (wordmark, 60% of ink), #00D9F5 (symbol, 40%) on #0A0A0A.
