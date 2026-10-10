# Performance

A beautiful page that loads slowly or stutters is a worse page. Budget performance like any other design resource.

## 1. Targets (Core Web Vitals, field "good" thresholds)

| Metric | Good | What usually breaks it on design-heavy sites |
|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5s | huge hero image/video, render-blocking fonts, hero hidden until JS animation runs |
| INP (Interaction to Next Paint) | ≤ 200ms | heavy JS on main thread, scroll handlers, hydration of large animated trees |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | images without dimensions, font swaps without metric fallbacks, late banners |

Lab tools (Lighthouse, Playwright traces) approximate these; say "lab" when reporting.

## 2. Hero rules (most important)

- The LCP element (usually hero heading or image) must be in the initial HTML and visible without waiting for JS animation. If you animate it in, animate *from* a visible state or keep the animation short (< 600ms) and start immediately — do not leave it `opacity: 0` until hydration.
- Hero image: correct `sizes`, modern format (AVIF/WebP), `fetchpriority="high"` (Next.js `priority`/`preload` on `next/image`), no lazy-loading.
- Hero video: poster image as LCP, `preload="metadata"`, compressed (≤ ~2–4 MB for a loop), muted/inline.

## 3. JavaScript budget

- Prefer CSS for simple motion; import only the GSAP plugins you use; tree-shake Motion (`LazyMotion` + `m` components for large apps if bundle matters).
- Code-split heavy experiences: load Three.js/R3F scenes with dynamic import (`next/dynamic` with `ssr: false`) and render a static poster first.
- Don't ship smooth-scroll + GSAP + Motion + Three on a simple marketing page "just in case".
- Check bundle impact: `next build` output, or `npx vite-bundle-visualizer` / `source-map-explorer` in other stacks.

## 4. Images

- Serve responsive sizes; never ship a 4000px image to a 390px phone.
- Lazy-load below-the-fold images (`loading="lazy"`; default in `next/image`).
- Set dimensions or `aspect-ratio` to avoid CLS.
- Compress: photos ~70–80 quality AVIF/WebP; PNG only for flat graphics needing transparency; SVG for icons/logos.

## 5. Fonts

- Self-host, subset, preload only the critical file(s), use metric-matched fallbacks (`next/font` does this).
- Limit families × weights; prefer one variable file over 6 static weights.

## 6. 3D / WebGL budget

- Compress models (glTF + Draco or Meshopt; KTX2/Basis textures). Aim for a hero model in the low single-digit MB at most.
- Cap DPR at 2 (1.5 on mobile), reduce shadow map sizes, avoid real-time shadows when baked lighting works.
- Pause rendering when off-screen or tab hidden; `frameloop="demand"` for static scenes in R3F.
- Always provide a non-WebGL fallback (poster image/gradient) and handle context loss.

## 7. Animation runtime

See `animation.md` §5. In short: transform/opacity, no layout reads in scroll loops, cap animated element counts, test with 4× CPU throttle.

## 8. Measuring (what to actually run)

- `next build` (or project build) must succeed with no new warnings you introduced.
- Lighthouse (if installed: `npx lighthouse <url> --preset=desktop --only-categories=performance,accessibility --quiet`) — lab numbers; note the environment.
- Playwright: the visual-qa script records console errors, failed requests (404 fonts/images), and page weight by resource type.
- Report numbers with their source and environment; never invent scores.
