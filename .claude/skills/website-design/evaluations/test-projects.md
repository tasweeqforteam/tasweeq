# Skill Evaluation — Test Projects

Eight briefs that stress different abilities. Each run is a **single-page vertical slice** (one page, fully functional and responsive) so a run fits one working session; the brief lists what must work. All brands are fictional.

Each run must produce: `docs/brief.md` (from `templates/project-brief.md`), `docs/direction.md` (from `templates/design-direction.md`), working source, `qa/` screenshots + `report.md` from `scripts/visual-qa.mjs` (390/768/1440, `--reduced`), and `docs/quality-report.md` (from `templates/quality-report.md`). An independent evaluator then scores it against `acceptance-criteria.md` and records results in `results.md`.

Environment assumptions for runs (adjust per environment): no external image hosts → visuals must be typographic, CSS/SVG/canvas-made, or WebGL; fonts via `@fontsource` npm packages or Google Fonts; Playwright Chromium available.

---

## T1 — Premium creative agency website
**Client:** Okapi & Wren, an 11-person brand and motion studio (Lisbon) working with cultural institutions and food brands.
**Audience:** marketing directors and museum comms leads shortlisting studios.
**Must have:** hero with a distinctive point of view; selected work (≥ 6 projects) with filter by discipline (Branding / Motion / Digital) that actually filters; studio/approach section; client list; contact CTA (mailto) and footer.
**Stress:** originality, art direction, type as image, one signature motion moment.
**Specific acceptance:** filter works with keyboard and announces result count; no generic agency tropes without reason (stat row, client marquee, fade-up everywhere).

## T2 — SaaS landing page
**Client:** Fieldnote — mobile inspection reports for building surveyors (photos, defects, signatures → PDF in minutes).
**Audience:** independent surveyors and small surveying firms; skeptical of "tech".
**Must have:** hero that shows the product (UI built in HTML/CSS, not a fake image); how it works; 3 outcome-framed features; proof (testimonial with name/role, placeholder clearly marked); pricing with monthly/annual toggle that changes prices; FAQ accordion; sign-up form with validation and success state.
**Stress:** UX structure from persuasion, product-UI-first, conversion hygiene, avoiding SaaS-template look.
**Specific acceptance:** pricing toggle and FAQ keyboard-accessible; form shows inline errors and success; CTA visible in first viewport at 390 and 1440.

## T3 — Complex SaaS dashboard
**Client:** Polar Route — cold-chain monitoring for a vaccine distributor (fictional data).
**Audience:** logistics coordinators watching 200+ shipments per day.
**Must have:** app shell (sidebar/top bar), KPI summary with comparison, shipments table (≥ 40 mock rows) with search, status filter, sortable columns, row selection opening a detail drawer with a temperature chart (SVG/canvas) showing excursions; empty state for no results; loading skeleton on first render.
**Stress:** density, conventions, data viz, states, keyboard.
**Specific acceptance:** sort indicators with `aria-sort`; drawer traps focus and closes on Escape; mobile shows KPIs + list view without horizontal page overflow.

## T4 — Interactive editorial website
**Client:** "The Night Shift" — a long-form feature about a fictional 24-hour bakery, told hour by hour (22:00 → 06:00).
**Audience:** general readers on phones.
**Must have:** title sequence; ≥ 5 hour-chapters with scroll-linked progression (e.g. time/sky/light changes with reading progress); pull quotes; a chapter navigator; reading progress.
**Stress:** typographic craft for long reading, narrative pacing, scroll-linked motion that serves the story, reduced-motion parity.
**Specific acceptance:** body measure ≤ 75ch; chapter nav works by keyboard and updates the active chapter; reduced motion shows the same information statically.

## T5 — Product website with advanced scroll animation
**Client:** Halden H1 — a modular espresso grinder (fictional).
**Audience:** home-espresso enthusiasts comparing premium grinders.
**Must have:** product hero; a pinned scroll sequence that explains ≥ 4 features (exploded view / burr / dosing / modules) using an illustrated SVG or CSS-built product; specs table; pre-order CTA with variant (color) selection.
**Stress:** GSAP ScrollTrigger pin/scrub craft, mobile fallback, performance, reduced motion.
**Specific acceptance:** pinned sequence degrades to stacked steps below 960px and under reduced motion; no layout jump when pin starts/ends; variant selection updates product color and CTA label.

## T6 — Immersive 3D experience
**Client:** Fieldglass — a mineral museum's online exhibit of one specimen: a large quartz cluster (fictional).
**Audience:** museum visitors and students.
**Must have:** real-time 3D specimen (procedural geometry OK) that can be rotated (pointer + keyboard buttons); 3–4 hotspots/annotations explaining features; exhibit text; poster/fallback when WebGL is unavailable or reduced motion is on; visit/booking CTA.
**Stress:** justified 3D, performance budget, accessible alternative to canvas content.
**Specific acceptance:** annotations available as real text; keyboard can rotate and select hotspots; DPR capped; rendering pauses when off-screen; no console errors.

## T7 — Responsive Arabic RTL website
**Client:** محمصة نَخْلة (Nakhla Roastery) — specialty coffee roaster in Riyadh selling beans and a monthly subscription.
**Audience:** Arabic-speaking coffee enthusiasts in Saudi Arabia, mostly on phones.
**Must have:** Arabic-first page (`lang="ar" dir="rtl"`) with English toggle that switches language and direction; beans catalog (≥ 4 origins with tasting notes); subscription form (name, phone, city, plan) with validation; WhatsApp CTA; footer with hours and location.
**Stress:** Arabic typography, RTL logic, bilingual switching, phone-first UX, numerals and mixed-direction content.
**Specific acceptance:** no physical left/right CSS for direction-sensitive layout; phone numbers render LTR inside Arabic text; Arabic never letter-spaced; switching language preserves the user's scroll position or section.

## T8 — E-commerce product page
**Client:** Mirsad — handmade waxed-canvas field bag (fictional).
**Audience:** outdoor and urban buyers comparing premium bags.
**Must have:** gallery (illustrated/CSS product views, thumbnails, swipe on mobile, keyboard), title, price, color and size variants (out-of-stock state), quantity, add-to-cart that opens a cart drawer with line items and subtotal; delivery/returns accordion; reviews summary + list; sticky mobile add-to-cart that doesn't cover content.
**Stress:** e-commerce conventions with premium feel, state management, drawer accessibility.
**Specific acceptance:** unavailable variant can't be added and explains why; cart drawer is a focus-trapped dialog; subtotal updates with quantity.
