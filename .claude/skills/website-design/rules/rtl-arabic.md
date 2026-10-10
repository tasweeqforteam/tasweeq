# Arabic, RTL & Bilingual Interfaces

Arabic is not "English flipped". It has its own typographic traditions, optical sizes, line-heights and reading behavior. Design for it first when it is a primary language.

## 1. Document setup

```html
<html lang="ar" dir="rtl">            <!-- Arabic-first -->
<p lang="en" dir="ltr">…</p>          <!-- embedded English paragraph -->
<span dir="auto">{userContent}</span> <!-- unknown direction (user input, names) -->
<bdi>{username}</bdi>                 <!-- isolate inline text of unknown direction -->
```

- Set `lang` and `dir` on `<html>`, and switch both when the locale changes. In Next.js App Router set them in the root `layout.tsx` from the active locale.
- Use `dir="auto"` on inputs and user-generated content.

## 2. Use logical CSS everywhere

| Physical (avoid) | Logical (use) |
|---|---|
| `margin-left`, `padding-right` | `margin-inline-start`, `padding-inline-end` |
| `left: 0; right: auto` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |
| `border-left` | `border-inline-start` |
| `float: left` | `float: inline-start` |
| Tailwind `ml-4 pl-2 left-0 text-left` | `ms-4 ps-2 start-0 text-start` |

Grid and flex already follow `dir`. Physical properties are only for things that are physically fixed (e.g. a shadow light source).

## 3. What flips and what doesn't

**Flip:** layout direction, navigation order, back/forward arrows, progress direction, sliders/carousels (next = left), breadcrumbs separators, icons that imply direction (reply, send, undo/redo arrows, chevrons), timelines, horizontal scroll direction expectations.

**Don't flip:** logos, media playback controls (play ▶ stays), clocks, checkmarks, numbers and phone numbers, code, charts' numeric axes (convention varies — keep LTR time axes unless the audience expects otherwise and say so), brand marks, images of real objects.

Flip icons with `[dir="rtl"] .icon-directional { transform: scaleX(-1); }` or use direction-specific icons.

## 4. Motion in RTL

Motion has direction too. A "slide in from the start" should come from the right in RTL. Write animations with logical intent:

```js
const dir = document.documentElement.dir === 'rtl' ? -1 : 1;
gsap.from(el, { x: 40 * dir, opacity: 0 }); // enters from the inline-start side
```

Horizontal scroll sections (pinned, scrubbed) must move toward the reading direction: in RTL, content enters from the left as you scroll. Marquees should scroll in the reading direction.

## 5. Arabic typography

- **Choose real Arabic typefaces**, not the browser fallback. Families with good web coverage include IBM Plex Sans Arabic, Noto Sans/Naskh/Kufi Arabic, Cairo, Tajawal, Almarai, Readex Pro, Rubik (Arabic subset), Alexandria, Vazirmatn, Amiri (Naskh, book), Reem Kufi, Lalezar (display). Check weights and licence before use. Brand/editorial display faces (e.g. Thmanyah Serif in this repo) give strong identity.
- **Style families:** Naskh (bookish, readable), Kufi (geometric, modern/tech), Ruq'ah/Diwani/Thuluth (calligraphic — display only). Match the Latin pairing's personality: geometric Latin ↔ Kufi-style; humanist/serif Latin ↔ Naskh-style.
- **Size and line-height:** Arabic glyphs often look smaller at the same font-size and need room for dots and marks. Start with Arabic body ≈ 1.05–1.15× the Latin size and line-height 1.6–1.9. Display line-height ≥ 1.2 unless tested.
- **Never apply letter-spacing to Arabic** (breaks cursive joining) and avoid `text-transform` (no case).
- **No fake italics.** Arabic has no italic; emphasize with weight, color or size.
- **Justification:** Arabic traditionally uses kashida elongation; browsers' `text-align: justify` inserts spaces instead and can look poor — prefer `start` alignment for UI and short paragraphs.
- **Numerals:** decide Western (0–9) vs Arabic-Indic (٠–٩) per audience (Gulf/Egypt marketing often uses Western digits; formal/government content may use Arabic-Indic). Be consistent; `Intl.NumberFormat('ar-EG')` gives Arabic-Indic, `'ar-SA'` etc. may vary by browser and `-u-nu-latn` forces Western: `new Intl.NumberFormat('ar-SA-u-nu-latn')`.
- **Punctuation:** Arabic comma `،` and question mark `؟`; quotes `«»` are common.
- **Text splitting animations:** splitting Arabic into *characters* breaks joining and shaping. Split by **words or lines only** (GSAP SplitText `type: "words"` or `"lines"`), and test rendering.

## 6. Mixed-direction content

- Wrap embedded opposite-direction phrases with `<span lang="en" dir="ltr">` or `<bdi>`.
- Phone numbers, emails, URLs, prices with currency need LTR isolation: `<span dir="ltr">+966 55 123 4567</span>`.
- Watch punctuation at the boundary of mixed runs — the bidi algorithm will move trailing punctuation to the wrong side if not isolated.
- Forms: labels and placeholders in Arabic, but email/URL/phone inputs `dir="ltr"` with `text-align: end` in RTL so the value sits on the expected side.

## 7. Bilingual sites (EN/AR)

- URL strategy: `/ar/...` and `/en/...` (or subdomains), `hreflang` alternates, and a language switcher that keeps the current page.
- The Arabic page is a design, not a mirror: re-check hero line breaks, image crops (a subject facing "into" the text may need flipping or a different crop), and headline lengths (Arabic copy may be shorter or longer).
- Fonts: load Arabic and Latin faces with `unicode-range` subsets so each script uses its face automatically inside one `font-family` stack.

## 8. RTL QA checklist

- [ ] Screenshot every key page at 390/768/1440 in **both** directions.
- [ ] No physical `left/right` margins causing misalignment (grep CSS for `left`, `right`, `ml-`, `mr-`, `pl-`, `pr-`, `text-left`).
- [ ] Directional icons flipped; non-directional ones not.
- [ ] Carousels, sliders, tabs keyboard arrows follow the *visual* direction (in RTL, Left arrow moves to the next item of a horizontal list; the WAI-ARIA Authoring Practices note that arrow behavior reverses in RTL for horizontal widgets — verify against the pattern you implement).
- [ ] Animations enter from the logical side; horizontal scroll moves the right way.
- [ ] Arabic text is not letter-spaced, not split into characters, and has adequate line-height.
- [ ] Numbers, phones, emails display correctly inside Arabic sentences.
