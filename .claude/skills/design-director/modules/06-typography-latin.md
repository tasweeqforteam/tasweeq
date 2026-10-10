# 06 · Typography System & Latin Typesetting

Typography is a design element, not a box to fill at the end. Choose type for
brand personality, language, audience, format, reading distance, density and
**available weights**, not for looks alone.

## 1. Hierarchy roles (define only those the piece needs)

| Role | Social 1080 px (starting px) | Print A4 (pt) | Notes |
|---|---|---|---|
| Display | 120–260 | 48–120 | 1–6 words; tight leading 0.9–1.05; optical kerning checked by eye |
| Headline | 64–110 | 24–40 | ≤2 lines on social |
| Subheadline | 40–56 | 14–18 | |
| Body | 28–36 | 9–11 | leading 1.35–1.5; 45–75 chars/line |
| Supporting / caption | 22–28 | 7.5–9 | QA minimum on social ≈ 2% of the short side (22 px) |
| Label / metadata | 20–24, caps +4–8% tracking | 7–8 | |
| CTA | 30–44, medium/semibold | 10–12 | must win its zone, not the page |
| Footnote / legal | ≥20 (mark `data-fineprint`) | 6–7 | never below legibility |

Use one modular ratio per piece (1.25 minor third for dense work, 1.333 or
1.5 for ads, 1.618 for drama). QA warns when there are more than 7 distinct sizes.

## 2. Latin type categories and character

| Category | Character | Repo / system examples |
|---|---|---|
| Neo-grotesque / grotesque | neutral, contemporary | **Inter Tight: the default English face** (user rule; variable 100–900 + italics, bundled in `assets/fonts/`), Inter (system), Liberation Sans |
| Display grotesque | assertive, brand voice | Inter Tight 700–900 with −1 to −3% tracking (default); NewBlack (opt-in house face) |
| Humanist sans | warm, readable | — (source if needed) |
| Geometric sans | clean, constructed | — |
| Serif (old-style / transitional) | literary, trusted | Liberation Serif (Times-metric; use for drafts) |
| High-contrast didone | fashion, luxury | — |
| Slab | sturdy, industrial | — |

Default: Inter Tight for all English, with hierarchy built from its weight axis
(300 standfirst · 400 body · 500–600 labels/CTA · 700–800 display) and italics for
quotes. Add a second family only when the brief asks for it.

Pairing rule: contrast in **one** axis (category or weight), harmony in the
others (x-height, proportion, era). Maximum two families plus their weights.
Three only with a clear role for each. QA warns at four or more rendered families.

## 3. Setting rules

- **Kerning**: `font-kerning: normal` is on in base.css. At display sizes, check pairs (AV, To, Ty, LT, quotes) by eye and adjust per pair with `<span style="letter-spacing:-.02em">` sparingly.
- **Tracking**: tighten large display (−1 to −3%). Open small caps and labels (+4 to +10%). Leave body at 0.
- **Leading**: display 0.9–1.05; headline 1.05–1.15; body 1.35–1.5; increase for longer lines and lighter weights.
- **Line length**: 45–75 characters (ideal ~66); captions shorter.
- **Rag**: ragged-right by default. Avoid deep holes and staircase patterns. Rebreak by hand at display sizes.
- **Justification**: only with hyphenation on (`hyphens: auto` plus `lang`) and lines ≥ 50 characters. Otherwise rivers appear.
- **Widows/orphans/runts**: no single word on a last line in body copy or headlines (QA flags), and no heading stranded at a column bottom.
- **Hyphenation**: never in headlines. In body, at most two consecutive hyphenated lines.
- **Numerals**: `.tnum` (tabular lining) in tables and prices. Old-style numerals in running serif text, when the face has them.
- **Capitalisation**: sentence case reads fastest. All-caps only for short labels and display, tracked open.
- **Optical alignment**: hang punctuation and the round/diagonal letters (O, A, V, “) slightly outside the edge at display sizes so the edge *looks* straight.
- **Column balancing**: in multi-column text, balance the last lines, or end on a deliberate short column.
- **Never**: faux bold or italic (base.css sets `font-synthesis: none`; QA warns about missing weights), stretched type, or outline/shadow to rescue poor contrast.

## 4. Critical copy is typeset, not generated

Headlines, Arabic copy, brand names, prices, dates, CTAs and legal text are
always live text in the HTML, never letters drawn by an image model. QA
compares every `data-copy` element to the supplied copy file character for character.
