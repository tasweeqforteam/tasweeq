# Accessibility

Target WCAG 2.2 AA. Accessibility is part of the quality floor, not a polish phase.

## Checklist (apply to every page you touch)

### Structure
- [ ] One `<h1>` per page; headings in order without skipped levels.
- [ ] Landmarks: `<header>`, `<nav aria-label>`, `<main id="main">`, `<footer>`; a "Skip to content" link as first focusable element on content-heavy sites.
- [ ] Lists are `<ul>/<ol>`, buttons are `<button>`, links are `<a href>`. A `div` with `onClick` is a bug.
- [ ] `lang` on `<html>` (and on embedded opposite-language passages); `dir` for RTL.
- [ ] Page `<title>` unique and descriptive.

### Keyboard & focus
- [ ] Every interactive element reachable with Tab in a logical order; no keyboard traps.
- [ ] Visible focus indicator with ≥ 3:1 contrast against adjacent colors: `:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }`. Never `outline: none` without a replacement.
- [ ] Menus/dialogs: open with Enter/Space, close with Escape, focus moves into the dialog and returns to the trigger; background inert (`inert` attribute or focus trap).
- [ ] Focused elements not hidden behind sticky headers (WCAG 2.4.11) — use `scroll-padding-top`.
- [ ] Custom widgets (tabs, accordions, carousels, sliders, comboboxes) follow WAI-ARIA Authoring Practices patterns; prefer native elements (`<details>`, `<dialog>`, `<input type="range">`, `<select>`) when they meet the design.

### Color & contrast
- [ ] Body text ≥ 4.5:1; large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1; UI component boundaries and icons that convey meaning ≥ 3:1.
- [ ] Text over images/video: guaranteed contrast via scrim or solid backing at every crop and every frame.
- [ ] Color is never the only signal (errors, status, chart series, links in body text need underline or another cue).

### Images & media
- [ ] Meaningful images have `alt` describing purpose; decorative ones `alt=""`; decorative SVGs `aria-hidden="true"`.
- [ ] Video with speech has captions; autoplaying video is muted, has pause, and stops under reduced motion.
- [ ] Canvas/WebGL content has a text equivalent nearby (what it shows and any data it conveys).

### Forms
- [ ] Visible labels associated with inputs; instructions before fields; errors in text, linked via `aria-describedby`, announced (`aria-live="polite"` region or focus move).
- [ ] `autocomplete` attributes on personal-data fields.
- [ ] Targets ≥ 24×24px (2.5.8), comfortable ≥ 44×44px.

### Motion
- [ ] `prefers-reduced-motion` respected (see `animation.md`).
- [ ] No content that flashes > 3 times/second.
- [ ] Auto-moving content > 5s can be paused.

### Text-splitting & decorative type
- [ ] When splitting text into spans for animation, keep it readable: split by words/lines (never characters for body text or Arabic). GSAP SplitText's `aria` option (`"auto" | "hidden" | "none"`, VERIFIED in gsap@3.15.0 types) — use `"auto"` (label on parent, pieces hidden) only on headings; on `<p>`/`<span>`/`<div>` an `aria-label` is prohibited (axe `aria-prohibited-attr`), so use `"none"` there.
- [ ] Text rendered in canvas/SVG has a real-text equivalent.

### Zoom & reflow
- [ ] Usable at 200% zoom and at 320px width without horizontal scrolling (1.4.10), except data tables/maps.
- [ ] Text sizes in `rem`/`clamp(rem + vw)` so they scale with user settings.

## Testing

- **Automated:** run axe-core in the browser (the visual-qa script does this with `--axe` when `@axe-core/playwright` is installed) or Lighthouse accessibility. Automated tools find ~30–40% of issues; they are a floor.
- **Keyboard pass:** Tab through the whole page; operate every control; open/close every menu/dialog.
- **Screen reader spot-check** (if available): VoiceOver (macOS/iOS) or NVDA — headings list, landmarks list, a form submission.
- **Reduced motion:** emulate `prefers-reduced-motion: reduce` (Playwright `reducedMotion: 'reduce'`) and screenshot again.

Report which of these were actually run.
