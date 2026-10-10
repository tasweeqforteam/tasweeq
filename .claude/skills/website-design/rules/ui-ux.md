# UI/UX & Conversion

Visual novelty is welcome only when the user can still find, understand and do what they came for.

## 1. Information architecture

- List the visitor's top 3 questions/tasks. Each must be answerable within one click/scroll from the landing view.
- Navigation labels use the visitor's words ("Pricing", "Work", "Contact"), not internal jargon or clever puns.
- 5–7 top-level nav items max; secondary items in a footer or "More".
- Every page has: a clear title, where-am-I indication (active nav state / breadcrumb), and a next step.

## 2. Page structure from persuasion, not templates

For marketing pages, order sections by what the visitor must believe, in sequence:

1. **What is this and is it for me?** (hero: specific promise + who it's for + primary action)
2. **Why should I believe it?** (proof in the subject's own form: work samples, results, demos, testimonials with names, numbers with sources)
3. **How does it work / what do I get?** (process, features framed as outcomes)
4. **What does it cost / what's the risk?** (pricing, guarantees, FAQ objections)
5. **What do I do now?** (one clear action, repeated where intent peaks)

Skip or merge steps the audience doesn't need. A portfolio may be 90% step 2.

## 3. Calls to action

- One primary action per view; secondary actions visually subordinate.
- Label = what happens: "Book a call", "Get the price list", "Start free trial" — not "Submit", "Learn more" everywhere.
- The same action keeps the same name through the flow ("Publish" → toast "Published").
- WhatsApp/phone/email CTAs in MENA markets are often primary — make them real links (`https://wa.me/<number>`, `tel:`, `mailto:`) with tracking hooks if the repo has analytics.

## 4. Forms

- Labels always visible (placeholders are not labels). Associate with `for`/`id`.
- Ask only what's needed; mark optional fields rather than required ones when most are required.
- Correct `type`, `inputmode`, `autocomplete` (`email`, `tel`, `name`, `organization`, `one-time-code`).
- Validate on blur and on submit, not on every keystroke; show errors next to the field, in text (not only color), linked with `aria-describedby`; move focus to the first error on submit.
- Disable double-submit; show pending state on the button; show a success state that says what happens next.
- Never fake a submission. If there is no backend, wire to the repo's existing endpoint/service, or clearly mark the form as non-functional in the delivery report.

## 5. States (design every one)

| State | Must show |
|---|---|
| Loading | skeleton or progress that matches final layout (prevents shift); for > 1s actions show progress |
| Empty | why it's empty + the action that fills it |
| Error | what happened, how to fix it, a retry; no blame, no vague "Something went wrong" alone |
| Success | confirmation + next step |
| Partial / offline | what still works |
| Hover / focus / active / disabled | for every interactive element; disabled must explain why when not obvious |

## 6. Trust and credibility

Real names, faces, logos (with permission), concrete numbers with context, case studies with before/after, clear contact details and location, privacy note near forms, consistent spelling and grammar in both languages. Fake testimonials or invented metrics are never acceptable — use clearly marked placeholders if content is missing.

## 7. Product UI and dashboards

- **Conventions win.** Use familiar patterns for navigation (sidebar or top bar), tables, filters, search, settings, account. Study 3+ real products for the pattern (Mobbin / Refero; see `references/ui-ux-patterns.md`).
- Information density is a feature for expert users: compact rows, tabular numbers, sticky headers, keyboard shortcuts.
- Hierarchy: page title → primary KPIs (few, with comparison context) → main work area → secondary panels.
- Filters show active state and a clear "reset"; search shows the query and result count; tables sort with visible indicators and `aria-sort`.
- Charts: follow the repo's charting library; label axes and units; don't use color as the only encoding.
- Destructive actions: confirm with specific wording ("Delete 3 invoices"), offer undo where possible.

## 8. Writing in the interface

- Write from the user's perspective in plain words; sentence case; active voice.
- Specific beats clever. "Get your quote in 24 hours" beats "Unlock growth".
- Every word does one job. Remove labels that repeat the heading.
- Errors don't apologize; empty states invite action.
- Write real copy for the brief's subject — lorem ipsum hides layout problems and makes designs feel templated.

## 9. Conversion hygiene

- Primary CTA visible on first viewport at 390 and 1440.
- Sticky header or mobile bottom CTA only if it doesn't cover content or steal focus.
- No modal on load. Cookie/consent banners must not cover the primary CTA on mobile.
- Track key actions only if the repo has an analytics setup (e.g. GTM helper); don't add new trackers without being asked.

## 10. UX review questions

- Can a first-time visitor say what this is and what to do in 5 seconds (test with the hero screenshot)?
- Can the main task be done with keyboard only?
- Is every interactive-looking thing actually interactive, and vice versa?
- Does every flow end in a clear success or error state?
