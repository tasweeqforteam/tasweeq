# Premium Website Design — How to Use the Galleries

Galleries (Awwwards, CSS Design Awards, Recent/Godly, SiteInspire) are discovery tools. They show *what was rewarded or curated*, not what converts or is accessible. Use them to find candidates, then inspect the live site itself.

> Evidence note: the galleries were not reachable from the environment where this file was written (2026-10-10). The pattern library in §3 is drawn from general professional knowledge of the field and is labelled `INFERRED` until you confirm examples by inspecting live sites. Replace with `OBSERVED` examples (with URL + date) as you study them.

## 1. Which gallery for what

| Need | Start with | Why |
|---|---|---|
| Experimental, motion-heavy, WebGL, agency/portfolio | Awwwards (filter by category, "Developer Award", technology tags), Recent | juried / curated for innovation |
| Calm, editorial, commercial, typographic | SiteInspire (filter by style/type/subject) | broader, quieter selection |
| A second jury's view, UI/UX scores | CSS Design Awards | scores per category help separate UI from novelty |
| Current visual trends (risk: trend-chasing) | Recent | daily updates |
| A specific animation technique | Awwwards "Animation" category, Codrops tutorials | techniques with explanations/source |

## 2. Study protocol (per site)

1. **Open the live site**, not the gallery screenshot. Note load time and what you see before JS finishes.
2. **First viewport at 1440 and 390.** What is the dominant element? What does it say? Where is the action?
3. **Scroll the whole page slowly.** Write the section strip (`layout-and-grids.md` §5). Note where rhythm changes.
4. **Interact:** nav, hover, a CTA, a form; keyboard Tab through the first 10 stops; resize.
5. **Toggle reduced motion** (OS setting or DevTools emulation) and reload. Does content survive?
6. **Fingerprint the tech** (`workflows/research.md` Step 3) and label findings.
7. **Fill `templates/reference-analysis.md`.** Write lessons as principles.
8. **Judge critically:** award ≠ good UX. Note what you'd *not* do (hidden navigation, unreadable contrast, 5s loaders, scroll-jacking).

## 3. Recurring premium patterns (INFERRED — confirm with live examples)

| Pattern | What it does | When it fits | Risks |
|---|---|---|---|
| **Oversized type hero** — display type at 10–20vw, cropped or interlocking with media | type *is* the image; instant personality | agencies, brands with strong voice, Arabic calligraphic display | headline breaks at mobile; LCP if font loads late |
| **Line-mask text reveal** — lines slide up inside `overflow: hidden` wrappers | editorial elegance; signals craft | headlines, short statements | splitting long paragraphs; Arabic split by chars |
| **Image clip-path wipes** — `clip-path: inset()` animating on enter | reveal without fade mush | case-study grids, hero images | over-use on every image |
| **Sticky media + scrolling narrative** — media pinned while text steps scroll | explains process/product step by step | product stories, "how it works" | mobile: convert to stacked steps |
| **Horizontal pinned gallery** | showcases a sequence of work | portfolios, timelines | scroll-jacking feel; touch/keyboard reach; RTL direction |
| **Custom cursor / magnetic CTAs** | tactile desktop feel | creative brands | useless on touch; must not hide the native cursor's affordance |
| **Page transitions with shared elements** | continuity between list and detail | portfolios, e-commerce PDP | navigation latency; history/back behavior |
| **WebGL distortion / shader backgrounds** | atmosphere; brand world | immersive brands, launches | performance, battery, accessibility of contrast over motion |
| **3D product hero (R3F/three)** | interactive product understanding | physical products, hardware | load weight; needs poster fallback |
| **Editorial grids with varied spans** | magazine pacing | content-rich brands | needs real content variety |
| **Monochrome + single signal color** | discipline, focus | almost any brand | becomes a cliché if the color has no meaning |
| **Marquee/ticker of clients or services** | motion texture | agencies | overused; must pause under reduced motion |
| **Big-number proof with source** | credibility | B2B, agencies | the generic "stat row" if not contextual |

## 4. Category notes

- **Agency / studio:** the site is the portfolio — work first, fast. Case studies need context (problem → idea → result) with real outcomes. The memorable move often lives in the hero type or the work grid's interaction.
- **Portfolio (individual):** personality + work + contact in under 3 scrolls; avoid long loaders.
- **Editorial / storytelling:** typography, pacing and image sequencing matter more than effects; scroll-linked moments should serve the narrative beats.
- **Commercial / brand:** clarity of offer and product imagery first; motion supports desire (product rotation, material close-ups).
- **SaaS marketing:** show the actual product UI early; real screenshots/interactive demo beat abstract illustrations; differentiate structure from the template sequence (`rules/ui-ux.md` §2).
- **E-commerce:** conventions (gallery, price, variant, add-to-cart, shipping/returns) beat novelty; premium feel comes from photography, type and micro-interactions, not from moving the buy button.

## 5. Turning a reference into an original design

1. Write the reference's principle in one sentence ("type scale contrast creates drama without images").
2. Ask how *your* subject's world would express that principle (world inventory).
3. Change at least three of: composition, type, color, imagery, motion, interaction.
4. Show the design to yourself next to the reference — if a viewer could think it's the same studio, change more.
