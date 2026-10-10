# Art Direction

Art direction is the set of decisions that makes every page of a site feel like it came from one mind. Without it you get a page *assembled* from components. With it you get a page *designed*.

## 1. Start from the subject, not from a style

Distinctive choices come from the subject's own world: its materials, tools, vocabulary, places, rituals, artifacts, and audience. Before picking any font or color, write down:

- **Subject:** what the product/organization actually is, in one sentence.
- **Audience:** who arrives, what they already know, what they fear or want.
- **Primary job of the page:** the one action or understanding that defines success.
- **World inventory:** 8–12 concrete nouns from the subject's world (e.g. for a Kyoto incense atelier: smoke, ash, paper, cedar box, vertical script, tatami, dusk light, ceramic). These nouns feed palette, texture, imagery, motion and copy.

If the brief lacks a subject, propose one concrete subject + audience + job, and confirm it before designing.

## 2. The concept

A concept is one sentence that explains *why the site looks and behaves the way it does*. It must be specific enough to say "no" to things.

- Weak: "Modern, clean and premium."
- Strong: "Scroll is depth: the page is a descent from sunlit water to the trench floor, and every color, sound and number follows the depth." (Pattern OBSERVED in the HADAL demo — `references/ai-built-websites.md`.)
- Strong: "The product page *is* the product: you play the synthesizer before you read about it."
- Strong (agency): "Every case study is a before/after proof; the site shows results the way a lab shows evidence."

Test: could this concept produce the same page for a different client? If yes, it is not a concept.

## 3. Aesthetic vocabulary (choose deliberately)

All of these are valid when chosen for a reason: minimal, editorial/magazine, Swiss/International, brutalist, luxury/quiet, maximalist, playful/toy-like, retro-futurist, technical/instrument, organic/handmade, immersive 3D, experimental type. Write 3–5 adjectives *and* 2–3 explicit anti-adjectives ("not corporate, not cute, not glossy"). Anti-adjectives prevent drift during build.

## 4. Tokens: make the direction concrete

Define before coding (see `templates/design-direction.md`):

- **Color:** 4–6 named values with roles (e.g. `paper`, `ink`, `signal`, `muted`, `line`). One accent with one job is stronger than five accents. Check text contrast at definition time.
- **Type:** families and roles, type scale, weights, tracking, line-height (see `typography.md`).
- **Space:** a scale (e.g. 4/8-based or a modular fluid scale) and section rhythm.
- **Shape:** radius values tied to hierarchy (e.g. 0 for structural, 999px for pill controls) — not one radius on everything.
- **Depth/material:** flat, paper, glass, metal, light, grain, shadow — choose one primary material language.
- **Motion:** easing family, duration scale, and the motion principle (see `animation.md`).

## 5. The one memorable thing

Spend boldness in one place. Pick the single element a visitor will describe afterwards (a hero type treatment, an interactive product, a scroll narrative, an image system, a cursor behavior). Keep everything around it disciplined. If you have four "wow" effects, you have none — cut three.

## 6. Imagery direction

- Decide the image *system*: photography / illustration / 3D renders / typography-as-image / product UI / data. Mixing systems needs a rule.
- Specify lighting (hard noon, soft window, dusk, studio key), lens/crop (tight macro, wide environmental), color treatment (natural, duotone, desaturated, graded to palette), and composition (subject placement relative to the type).
- For AI-generated imagery: keep one shared lighting/lens/palette vocabulary across every prompt; reject outputs with tell-tale artifacts (warped hands/text, plastic skin, impossible geometry). The KANOE demo is an example of consistent lighting language across generated images (OBSERVED in its source and guide).
- Treat images as part of the layout: hard crops, bleed, masks, scrims, overlap with type. Never paste a stock image untouched into a card.
- Real product/brand assets beat placeholders. If you must use placeholders, make them honest (neutral, labeled) and list them in the delivery report.

## 7. Generic defaults — and what to do instead

| Default tell | Why it reads as generic | Instead |
|---|---|---|
| Inter/system font with no reason | the statistical average of the web | choose type from the subject's world (`typography.md`); Inter is fine for dense UI when chosen on purpose |
| Purple→blue gradient hero, glass cards | 2021–2024 SaaS template | a palette derived from the world inventory; flat color or one material |
| Centered hero + 3 identical feature cards + logos + pricing + FAQ | the template sequence | structure from the content: what must the visitor believe, in which order? |
| Same radius + same soft shadow on everything | no hierarchy | radius/shadow encode hierarchy; most structure needs neither |
| Tracked ALL-CAPS eyebrow above every heading; `A · B · C` meta; `WORD — fragment` labels | template chrome | labels only when they carry information |
| `01 / 02 / 03` markers | fake sequence | numbers only for real sequences (steps, timeline, ranking) |
| One highlighted word per headline | formula | let the whole headline carry the idea; type treatment as design |
| Fade-up on every section, hover-lift on every card | motion as filler | one orchestrated moment + feedback motion (`animation.md`) |
| Floating blobs / gradient orbs / noise everywhere | decoration without meaning | texture only if the material language calls for it |
| Big number + tiny label + gradient accent stats row | default "proof" treatment | show proof in the subject's own form (a chart, a before/after, a document) |
| Cream bg + high-contrast serif + terracotta; near-black + acid green; hairline broadsheet | current AI-design clusters (named in Anthropic's official frontend-design skill, VERIFIED in its SKILL.md) | allowed only if the brief points there |

These are defaults, not crimes. Use one when it is the best answer for *this* brief and you can say why.

## 8. Review the plan against the brief before building

Ask: "If I received a similar brief tomorrow, would I produce the same plan?" For every part where the answer is yes, revise it and note what changed and why. Only then build. (This two-pass plan → critique loop is taken from Anthropic's official frontend-design skill and matches the iteration practice documented in the Fable 5 showcase repos.)

## 9. Coherence across pages

Write 5–8 one-line **principles** (e.g. "Type is the image", "Everything aligns to the 12-col grid except images, which bleed right", "Motion only on user action, except the hero"). Check every new page and component against them. Inner pages (forms, legal, 404, empty states) must use the same language as the homepage.

## 10. Restraint pass

Before calling a page done, remove one accessory: the least necessary effect, border, label, gradient or animation. Repeat until removing more would weaken the concept.
