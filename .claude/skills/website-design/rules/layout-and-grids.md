# Layout & Grids

Layout is hierarchy made spatial. Pick the structure from the content, then decide where to break it.

## 1. Choose the grid from the content

| Grid | Use when | Watch out |
|---|---|---|
| **12-column** (desktop), 8 (tablet), 4 (mobile) | most marketing and product pages; divisible into 2/3/4/6 | becomes bland if every block spans 12 or 6 |
| **Asymmetric** (e.g. 5/7, 4/8, 3/9) | editorial, agency, portfolio; creates tension and reading direction | keep one dominant side per section |
| **Modular** (rows + columns, fixed module) | catalogs, galleries, bento, dashboards | modules must vary in size by importance |
| **Manuscript/single column** | long-form reading, docs, legal | measure 60–75 characters; add a wide "breakout" track for media |
| **Split-screen** | two equal things (before/after, product + spec), sticky media + scrolling text | collapse order on mobile must keep meaning |
| **Full-bleed** | immersive imagery, video, 3D | protect text with scrims or placement, not by shrinking type |
| **Broken grid / overlap** | editorial energy, layered collage | break the grid *relative to* a visible grid; one or two breaks per view |

## 2. A practical CSS grid scaffold

```css
:root {
  --gutter: clamp(16px, 2.5vw, 32px);
  --margin: clamp(16px, 5vw, 96px);
  --max: 1440px;
}
.page-grid {
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--margin), 1fr)
    [content-start] repeat(12, minmax(0, calc((var(--max) - 2 * var(--margin) - 11 * var(--gutter)) / 12)))
    [content-end] minmax(var(--margin), 1fr) [full-end];
  column-gap: var(--gutter);
}
.page-grid > * { grid-column: content; }
.page-grid > .bleed { grid-column: full; }
.page-grid > .bleed-end { grid-column: content-start / full-end; } /* bleeds off the inline-end edge */
```

Named lines (`full`, `content`) make full-bleed and breakout elements trivial and work in RTL automatically (grid columns follow writing direction). Use `minmax(0, …)` so long words don't blow out tracks.

For simple components, Flexbox with `gap` is fine. Use Grid when two-dimensional alignment matters; use **subgrid** (`grid-template-columns: subgrid`) when cards in a row must align their internal rows (title/body/footer) — supported in all current evergreen browsers; verify for your target.

## 3. Hierarchy, alignment, grouping

- One dominant element per viewport. If two things compete, shrink or move one.
- Default to **left-aligned** (start-aligned) text; centered text is for short, symmetrical moments (a single statement, a closing CTA).
- Align to as few vertical edges as possible. Count the distinct left edges in a screenshot — more than 3–4 per section reads as messy.
- Group with space first, then with lines/backgrounds, and only then with boxes. Proximity is cheaper than borders.
- Spacing inside a group must be clearly smaller than spacing between groups (≥ 2× is a good rule).

## 4. Spacing system and vertical rhythm

- Use a scale, not arbitrary values: e.g. `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192` or a fluid scale with `clamp()`.
- Section padding should vary with importance: a quiet transition section might use 64px, a hero 160px+. Identical padding everywhere produces "stacked bands".
- Line-height of body text sets the rhythm; snap major spacings to multiples of it when practical.

## 5. Section rhythm (the page as a sequence)

Plan the page as a sequence of contrasts: wide/narrow, dense/airy, light/dark, image/type, static/interactive. Write it as a strip before building:

```
[HERO full-bleed, type-led] → [narrow statement] → [dense proof grid] →
[sticky split: media | steps] → [dark invert: testimonial] → [airy CTA]
```

If three consecutive sections share the same width, density and background, change one.

## 6. Bento and card layouts — when they're right

Bento works when items have *different importance* and you size them by it. It fails when it is a 3×2 grid of identical tiles. Rules: one hero tile, varied spans (`grid-column: span 2`, `grid-row: span 2`), consistent internal padding, content-driven (not decoration-driven) tiles.

## 7. Breaking the grid deliberately

Allowed breaks: an image bleeding off one edge; a headline overlapping an image edge; a pull-quote hanging into the margin; an element rotated off-axis in a playful brand. Each break must (a) still align to something, (b) not hide content or controls, (c) survive at 390px (often by reverting to the grid).

## 8. Responsive layout strategy (summary — details in `responsive-design.md`)

- Design mobile composition intentionally — not "desktop stacked". Re-order with `order`/grid areas only when DOM order stays logical for screen readers and keyboard.
- Use container queries for components that live in different-width slots.
- Check that asymmetric desktop layouts have a strong single-column version.

## 9. Self-check from a screenshot

- Can you name the dominant element of each viewport?
- Do the edges align? Is there a visible grid even where it is broken?
- Is negative space doing a job (framing, pacing, emphasis), or is it just padding?
- Does the page alternate rhythm, or is it a stack of equal bands?
