# Motion Recipes (tested)

Original, copy-ready patterns. Each includes its reduced-motion behavior. Versions verified against npm packages on 2026-10-10: gsap 3.15.0, @gsap/react 2.1.2, motion / framer-motion 14.1.0, lenis 1.3.26, three 0.186.1, @react-three/fiber 9.8.1. Test status per recipe is recorded in `evaluations/results.md` ("Recipe test"). Before using, confirm the API against the version installed in your project.

Shared conventions:
- Add a `js` class to `<html>` as early as possible (`<script>document.documentElement.classList.add('js')</script>` in `<head>`) and only hide content under `.js`. No-JS users see everything.
- Motion is opt-in via `@media (prefers-reduced-motion: no-preference)` or `gsap.matchMedia()`.
- `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` is used as the default expressive ease below.

---

## R1. In-view reveal (CSS + IntersectionObserver, no library)

```html
<h2 class="reveal">Built for the way clinics actually work</h2>
```
```css
@media (prefers-reduced-motion: no-preference) {
  .js .reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s var(--ease-out), transform .7s var(--ease-out); }
  .js .reveal.is-in { opacity: 1; transform: none; }
}
```
```js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
```
Reduced motion: CSS never hides anything → content static and visible. Use sparingly (not on every section).

## R2. Scroll-driven CSS (progress bar + view-linked reveal), progressive enhancement

```css
.progress { position: fixed; inset-block-start: 0; inset-inline: 0; height: 3px; background: var(--accent); transform-origin: 0 50%; transform: scaleX(0); }
:root[dir="rtl"] .progress { transform-origin: 100% 50%; }
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .progress { animation: grow linear both; animation-timeline: scroll(root); }
    .img-wipe { animation: wipe linear both; animation-timeline: view(); animation-range: entry 0% cover 35%; }
  }
}
@keyframes grow { to { transform: scaleX(1); } }
@keyframes wipe { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
```
Unsupported browsers: progress bar stays hidden (scaleX 0) — hide it entirely with `@supports not (animation-timeline: scroll()) { .progress { display: none } }`. Images simply show.

## R3. Line-mask headline reveal (GSAP SplitText)

```js
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText);

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const isArabic = (el.closest('[lang]')?.getAttribute('lang') || '').startsWith('ar');
    SplitText.create(el, {
      type: isArabic ? 'words' : 'lines',   // never split Arabic into chars; lines or words only
      mask: isArabic ? 'words' : 'lines',
      aria: el.matches('h1,h2,h3,h4,h5,h6') ? 'auto' : 'none', // aria-label is only valid on headings here
      autoSplit: true,                      // re-splits on resize / font load
      onSplit(self) {                       // return the tween so it is synced/reverted on re-split
        return gsap.from(isArabic ? self.words : self.lines, {
          yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.08,
        });
      },
    });
  });
});
```
Wait for fonts before splitting if not using `autoSplit` (`document.fonts.ready.then(...)`). Reduced motion: nothing is split, text is static. Accessibility: SplitText's `aria: "auto"` default puts `aria-label` on the split element and hides the pieces (VERIFIED option in types). `aria-label` is only permitted on elements with a nameable role: axe reports `aria-prohibited-attr` (serious) for it on `<p>`, `<span>` and `<div>` (VERIFIED in the recipe test, 2026-10-10). So: headings → `aria: "auto"`; paragraphs and other text → `aria: "none"` and split only by words/lines, which keeps words intact for screen readers. Avoid flash of visible text before the tween: set `.js [data-split] { visibility: hidden }` and `gsap.set(el, { visibility: 'visible' })` inside `onSplit` — only within the no-preference media query.

## R4. Pinned "sticky story" (GSAP ScrollTrigger, desktop only)

```html
<section class="story">
  <div class="story-media"><img src="/step-1.webp" alt="…"></div>
  <ol class="story-steps"><li>…</li><li>…</li><li>…</li></ol>
</section>
```
```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
mm.add({ desktop: '(min-width: 960px)', motionOK: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
  const { desktop, motionOK } = ctx.conditions;
  if (!desktop) return; // mobile: CSS stacks media above each step; no pinning
  const steps = gsap.utils.toArray('.story-steps li');
  ScrollTrigger.create({ trigger: '.story', start: 'top top', end: 'bottom bottom', pin: '.story-media' });
  steps.forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step, start: 'top center', end: 'bottom center',
      onToggle: (self) => self.isActive && setActive(i, motionOK),
    });
  });
});
function setActive(i, animate) { /* swap media src / toggle classes; crossfade only if animate */ }
```
CSS alternative when no library is wanted: `.story-media { position: sticky; top: 10svh; }` in a two-column grid — often enough. Reduced motion: state still changes (it's information), but swaps are instant.

## R5. Horizontal pinned gallery, RTL-aware

```js
mm.add({ desktop: '(min-width: 960px)', motionOK: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
  if (!ctx.conditions.desktop || !ctx.conditions.motionOK) return; // fallback: native overflow-x scroll + scroll-snap
  const section = document.querySelector('.hgallery');
  const track = section.querySelector('.hgallery-track');
  const dir = getComputedStyle(section).direction === 'rtl' ? 1 : -1; // RTL content overflows to the left
  const distance = () => track.scrollWidth - section.clientWidth;
  gsap.to(track, {
    x: () => dir * distance(), ease: 'none',
    scrollTrigger: { trigger: section, pin: true, scrub: 1, end: () => '+=' + distance(), invalidateOnRefresh: true },
  });
});
```
```css
.hgallery-track { display: flex; gap: var(--gutter); overflow-x: auto; scroll-snap-type: x mandatory; } /* fallback */
.hgallery-track > * { scroll-snap-align: start; flex: 0 0 min(80vw, 520px); }
@media (min-width: 960px) and (prefers-reduced-motion: no-preference) { .js .hgallery-track { overflow: visible; } }
```
Keyboard: every card must contain a focusable link; with pinning, Tab moves vertically through the pin distance — test it.

## R6. React / Next.js: GSAP with `useGSAP`

```tsx
'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Reveal({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.item', { y: 32, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: scope.current, start: 'top 80%', once: true } });
    });
  }, { scope }); // selectors are scoped; everything reverts on unmount (Strict Mode safe)
  return <div ref={scope}>{children}</div>;
}
```
Server-rendered markup stays visible; GSAP sets the from-state on the client after hydration (a brief flash is possible — keep the effect below the fold or use CSS initial states under `.js`).

## R7. React: Motion for React

```tsx
'use client';
import { MotionConfig, motion, AnimatePresence } from 'motion/react'; // or 'framer-motion' if that's what the repo uses

export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>; // transforms/layout animations disabled for reduced-motion users
}

export function Menu({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.nav key="menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
          …
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
```
Do not compute `initial` from `useReducedMotion()` in SSR components (hydration mismatch — see `rules/animation.md` §6).

## R8. Magnetic button (fine pointers only)

```js
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (fine && !calm) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.3;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
```
```css
[data-magnetic] { transition: transform .35s var(--ease-out); }
```
Keep the hit area stable (move an inner span instead of the button if the target drifts too far).

## R9. View Transitions (same-document), with fallback

```js
function transition(update) {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { update(); return; }
  document.startViewTransition(update);
}
// e.g. filter a grid: transition(() => renderGrid(filter));
```
```css
.card { view-transition-name: var(--vt-name); } /* set unique names per element for shared-element morphs */
::view-transition-old(root), ::view-transition-new(root) { animation-duration: .3s; }
```
Cross-document (MPA): `@view-transition { navigation: auto; }` in both pages (supported in Chromium and recent Safari; check support for your audience). Next.js App Router: use a library or the framework's experimental support — verify for your version before adopting.

## R10. Lenis smooth scroll + ScrollTrigger (only if the concept needs it)

```js
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ anchors: true }); // touch is not smoothed by default (syncTouch: false)
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
```
Without GSAP use `new Lenis({ autoRaf: true })`. Mark scrollable inner panels with `data-lenis-prevent`.

## R11. React Three Fiber scene with poster fallback (Next.js)

```tsx
// Hero3D.tsx (server component wrapper)
import dynamic from 'next/dynamic';
const Scene = dynamic(() => import('./Scene'), { ssr: false, loading: () => <img src="/hero-poster.webp" alt="" className="hero-poster" /> });
export default function Hero3D() { return <div className="hero-canvas"><Scene /></div>; }
```
`ssr: false` is only allowed inside a client component in the App Router — put this wrapper in a `'use client'` file if the build complains.

```tsx
// usePrefersReducedMotion.ts — SSR-safe, no setState-in-effect (passes React 19 eslint rules)
import { useSyncExternalStore } from 'react';
const QUERY = '(prefers-reduced-motion: reduce)';
const subscribe = (cb: () => void) => { const mq = matchMedia(QUERY); mq.addEventListener('change', cb); return () => mq.removeEventListener('change', cb); };
export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => true); // server snapshot: assume reduced (render static)
```

```tsx
// Scene.tsx
'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

function Object3D({ animate }: { animate: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => { if (animate && ref.current) ref.current.rotation.y += dt * 0.3; });
  return <mesh ref={ref}><torusKnotGeometry args={[1, 0.3, 160, 24]} /><meshStandardMaterial roughness={0.35} metalness={0.6} /></mesh>;
}

export default function Scene() {
  const animate = !usePrefersReducedMotion();
  return (
    <Canvas dpr={[1, 2]} frameloop={animate ? 'always' : 'demand'} camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.4} /><directionalLight position={[3, 3, 3]} intensity={1.2} />
      <Object3D animate={animate} />
    </Canvas>
  );
}
```
Also: pause when off-screen (IntersectionObserver toggling `frameloop`), handle `webglcontextlost`, give the canvas `aria-hidden="true"` and describe it in text nearby.

## R12. Pointer velocity → variable-font axis (principle from KILTER, original code)

```js
const el = document.querySelector('[data-velocity-type]');
if (el && matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  let last = null, target = 0, v = 0;
  addEventListener('pointermove', (e) => {
    if (last) target = Math.min(1, Math.hypot(e.clientX - last.x, e.clientY - last.y) / (e.timeStamp - last.t + 1) / 2);
    last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
  });
  (function tick() {
    v += (target - v) * 0.08; target *= 0.92;                   // low-pass + decay to rest
    el.style.setProperty('--wght', String(Math.round(900 - v * 600)));
    requestAnimationFrame(tick);
  })();
}
```
```css
[data-velocity-type] { font-variation-settings: "wght" var(--wght, 900); }
```
Use a variable font that has the axis. Stop the rAF loop when the element is off-screen in production.

## R13. Image clip-path wipe on enter (no library)

```css
@media (prefers-reduced-motion: no-preference) {
  .js .wipe { clip-path: inset(0 0 100% 0); transition: clip-path 1s var(--ease-out); }
  .js .wipe.is-in { clip-path: inset(0); }
}
```
Reuse the observer from R1. For a directional wipe start from `inset(0 100% 0 0)` (reveals from the left edge toward the right) and mirror it to `inset(0 0 0 100%)` in RTL so it starts at the reading edge.
