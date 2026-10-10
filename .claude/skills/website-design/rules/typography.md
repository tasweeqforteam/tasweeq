# Typography

Typography carries most of a site's personality. Choose it for the subject, set it with discipline, and load it without layout shift.

## 1. Choosing typefaces

- Start from the world inventory (`art-direction.md`): a type foundry, a law firm, a skate brand and a clinic need different voices. Describe the voice in words first ("engineered, slightly warm", "loud, hand-cut", "quiet, archival"), then find faces that match.
- **One family can be enough** — a variable family at different axis positions can serve display, body and UI (the KILTER demo uses Recursive for everything; VERIFIED in its source). Two families must be clearly distinct in role and form; three is rarely justified.
- Prefer faces with: the weights you need, true italics if you use italics, good numerals (tabular for data), language coverage (Arabic! see `rtl-arabic.md`), and a licence permitting web use.
- Don't reach for the same pairing on every project. Keep a short log of what you used per project and vary it.
- Inter, system UI and other neutral grotesques are legitimate for dense product UI and dashboards when chosen for legibility — say so in the plan.

Sources that are web-licensed: Google Fonts (OFL, mostly), Fontsource (npm packaging of OFL fonts, self-hostable), Adobe Fonts (subscription), commercial foundries (check web licence and pageview limits). Never ship a font file without confirming its licence.

## 2. Type scale

Pick a ratio by tone and screen: 1.125–1.2 for dense UI, 1.25–1.333 for marketing, 1.414–1.618 for editorial/expressive display. Make display sizes fluid:

```css
:root {
  --step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.94rem);
  --step-0:  clamp(1rem,    0.96rem + 0.20vw, 1.13rem);  /* body */
  --step-1:  clamp(1.25rem, 1.17rem + 0.40vw, 1.50rem);
  --step-2:  clamp(1.56rem, 1.40rem + 0.80vw, 2.00rem);
  --step-3:  clamp(1.95rem, 1.66rem + 1.45vw, 2.83rem);
  --step-4:  clamp(2.44rem, 1.95rem + 2.45vw, 4.00rem);
  --step-5:  clamp(3.05rem, 2.20rem + 4.25vw, 6.50rem);  /* display */
}
```

Always include a `rem` component in `clamp()` so text still responds to user zoom (WCAG 1.4.4). Body text should not go below 16px on mobile.

## 3. Setting text

| Property | Guidance |
|---|---|
| Line length | 45–75 characters for body (`max-width: 65ch`); serif can run slightly longer. |
| Line-height | Body 1.45–1.65 (serif / Arabic toward the higher end). Display 0.9–1.1; very large display can go below 1 if ascenders/descenders don't collide. |
| Tracking | Tighten large display slightly (−0.01 to −0.04em); loosen small caps/labels (+0.02 to +0.08em). Never track Arabic (it breaks joining). |
| Weight | Use contrast: e.g. display 700–900 with body 400, or display 300 at huge size with body 500. Avoid 500-on-500 sameness. |
| Wrapping | `text-wrap: balance` for headings (short lines), `text-wrap: pretty` for paragraphs (avoids orphans) — progressive enhancement. Check headline breaks manually at 390/768/1440; insert `<br class="lg">` only as last resort. |
| Numerals | `font-variant-numeric: tabular-nums` in tables, prices, counters, timers. |
| Case | Avoid ALL-CAPS labels as a reflex. If used, add tracking and keep them short. |

## 4. Hierarchy

At a glance a reader should see 3–4 levels, not 8. Distinguish levels with *two* properties at once (size + weight, size + color, weight + case) rather than tiny size steps. Body color can be slightly reduced in contrast (e.g. ink at 80%) but must still pass 4.5:1.

## 5. Type as image

When type is the hero, treat it as composition: scale to the viewport, crop it off an edge, interlock it with an image, set it vertically, animate its axes, mask images through it. Check legibility of the *message* (not every letter) and provide the full text to assistive tech (`aria-label` on decorative split text or keep the original text node and hide visual copies with `aria-hidden`).

## 6. Variable fonts

- Load one variable file instead of many static weights when you use ≥ 3 weights.
- Use `font-weight` / `font-stretch` / `font-style` for registered axes; `font-variation-settings` for custom axes (and remember it does not inherit partially — set all axes together, or drive each axis through custom properties as KILTER does).
- Animating axes is cheaper than swapping fonts but still triggers text re-layout; keep animated text short.

## 7. Loading fonts properly

- Self-host when possible (Next.js: `next/font/local` or `next/font/google` — both self-host and inject `size-adjust` fallback metrics to reduce CLS).
- Subset to the scripts you need (`latin`, `arabic`).
- `font-display: swap` for body; for a display face where a fallback flash would look broken, consider `optional` or preloading the one critical file.
- Preload at most 1–2 critical font files.
- Define a fallback stack that resembles the face (metrics-adjusted fallback via `size-adjust`, `ascent-override` when not using `next/font`).

## 8. Mixed language (EN + AR)

See `rtl-arabic.md`. Key points: pair an Arabic face whose weight/contrast/x-height *feels* like the Latin face; adjust Arabic size and line-height independently (Arabic often needs ~1.05–1.15× size and more line-height to match optical weight); never letter-space Arabic.

## 9. Check

- Screenshot at 390px: do headlines break into sensible phrases? Any single-word last lines?
- Is there any body text under 16px on mobile or line lengths over ~80ch on desktop?
- Do numbers in data/prices align?
- Is the font actually loading (no fallback in screenshots)? Check the network/console for 404 font files.
