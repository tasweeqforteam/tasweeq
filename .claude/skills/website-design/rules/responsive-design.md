# Responsive Design

Every viewport gets a *designed* composition. "Desktop, stacked" is not a mobile design.

## 1. Required test widths

| Name | Width × height | Represents |
|---|---|---|
| mobile | 390 × 844 (also spot-check 360 × 740) | modern phones; 360 catches narrow Android |
| tablet | 768 × 1024 | portrait tablets, small laptops split-screen |
| desktop | 1440 × 900 | common laptop/desktop |
| wide (optional) | 1920 × 1080 | large monitors — check max-width and empty space |

Also check landscape phone (844 × 390) for anything full-height (heroes using `100vh`, pinned sections, modals).

## 2. Fluid first, breakpoints second

- Use `clamp()` for type and spacing so most changes happen continuously.
- Add breakpoints where *the content* breaks, not at device names. Typical: ~640, ~960, ~1280px.
- Use **container queries** for components placed in different slots:

```css
.card-slot { container-type: inline-size; }
@container (min-width: 32rem) { .card { grid-template-columns: 1fr 1fr; } }
```

## 3. Viewport units and mobile browsers

- `100vh` on mobile includes the area behind browser chrome. Use `100svh` (small viewport) for heroes that must fit, `100dvh` for elements that should track the dynamic viewport (with care — it changes during scroll and can cause jumps), `100lvh` rarely.
- Pinned/scrubbed scroll sections: compute heights in JS from `window.innerHeight` at refresh time, or use `svh`. Test on a real mobile viewport size.

## 4. Mobile composition patterns

- **Hero:** the message and primary action must be visible in the first 390 × 700 without scrolling. Large visual can move below or behind.
- **Navigation:** top bar with brand + menu button; full-screen or sheet menu with large targets; current page indicated; menu closes on navigation and on `Escape`; focus trapped while open; body scroll locked.
- **Tables:** convert to stacked cards, allow horizontal scroll inside a labeled region (`role="region" aria-label tabindex="0"`), or prioritize columns.
- **Side-by-side → stack:** decide order by meaning (usually text then media for explanation, media then text for product).
- **Horizontal scroll experiences:** on touch devices often better as native swipe (`overflow-x: auto; scroll-snap-type: x mandatory`) than a scroll-jacked pinned section.
- **Hover-only affordances** must have a tap/focus equivalent. Use `@media (hover: hover) and (pointer: fine)` to scope hover effects and cursor-followers.

## 5. Touch

- Targets ≥ 44 × 44 CSS px (WCAG 2.5.8 AA minimum is 24 × 24; 44 is the comfortable target). Spacing between adjacent targets ≥ 8px.
- Don't put critical controls at the very bottom edge where the iOS home indicator sits — use `env(safe-area-inset-bottom)` padding for fixed bottom bars.
- Avoid custom scroll handling that fights native momentum (smooth-scroll libraries should be disabled or tuned for touch; Lenis does not smooth touch by default — VERIFIED option `syncTouch` defaults off in its types).

## 6. Images and media

- `srcset`/`sizes` or framework image components (`next/image`) with correct `sizes` per layout.
- Art-direct crops per breakpoint with `<picture>` when the subject would be lost in a narrow crop.
- Set `width`/`height` or `aspect-ratio` to prevent layout shift.
- Background videos: provide a poster, `playsinline muted loop`, and a static fallback on `prefers-reduced-motion` and on save-data / small screens if heavy.

## 7. Common failure checks (run on every screenshot)

- Horizontal scrollbar (`document.documentElement.scrollWidth > innerWidth`) — the visual-qa script reports this and lists offending elements.
- Text clipped by `overflow: hidden` or fixed heights.
- Long words/URLs overflowing (`overflow-wrap: anywhere` on user content).
- Fixed header covering anchor targets (`scroll-margin-top` on sections).
- Sticky elements overlapping content at short heights.
- Images cropped so the subject disappears.
- Grids leaving one orphan item on its own row at intermediate widths.
