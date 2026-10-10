# UI/UX Pattern References

Use pattern libraries (Mobbin, Refero) to see how *many* real products solve the same problem, then pick the familiar solution unless there's a reason to differ. Convention is a usability feature.

> Access note: Mobbin and Refero require accounts for full use and were not reachable from the environment that wrote this file (2026-10-10). Pricing reported by third parties in 2026 varied (both freemium with paid tiers) — check current terms. Refero reportedly offers MCP access on paid plans (secondary source; verify before relying on it). Respect each service's terms; don't bulk-scrape.

## 1. How to research a pattern

1. Name the problem precisely: "filter a 2,000-row table on mobile", not "dashboard".
2. Collect 5–8 examples from different products (Mobbin/Refero flows, or the products themselves).
3. Tabulate: entry point · layout · states (empty/loading/error) · feedback · keyboard support · mobile adaptation.
4. Identify the **convention** (what most do) and **best-in-class variations**.
5. Choose: convention by default; deviate only with a reason you can state.
6. Verify accessible behavior against WAI-ARIA Authoring Practices (https://github.com/w3c/aria-practices) and inspect an accessible implementation (Radix Primitives, shadcn/ui).

## 2. Pattern quick-reference

| Pattern | Convention | Common mistakes |
|---|---|---|
| **Top navigation (marketing)** | logo start, 4–6 links, primary CTA end; mobile: menu button → full-screen sheet | hidden nav on desktop for "minimalism"; CTA missing on mobile |
| **App navigation** | sidebar (collapsible) for 5+ sections; top bar for ≤ 5; current location highlighted | icon-only without labels/tooltips; no active state |
| **Onboarding** | value first, minimal fields, progress indicator, skip where possible | asking for everything up front; tours that block the UI |
| **Sign-up / sign-in** | email + password or SSO first; show password toggle; clear errors; magic links | captcha before intent; unclear password rules |
| **Search** | visible field (or ⌘K), instant results, recent searches, empty-result help | search hidden behind icon on desktop; no "no results" guidance |
| **Filters** | facets with counts; applied chips with clear-all; mobile: sheet with "Show N results" | filters that reset on navigation; no count feedback |
| **Data tables** | sticky header, sortable columns with `aria-sort`, row actions on hover + kebab, pagination or virtual scroll, density toggle | truncation without tooltip; tiny hit areas; horizontal scroll without affordance |
| **Pricing** | 2–4 plans, recommended highlighted, monthly/annual toggle with savings, feature comparison table, FAQ | hiding prices; too many tiers; inconsistent feature names |
| **Settings** | grouped sections, left index on desktop, autosave or clear Save with dirty state | saving silently; destructive actions next to safe ones |
| **Account / billing** | plan, usage, invoices, payment method, cancel path | dark-pattern cancellation |
| **Forms (long)** | single column, logical groups, inline validation on blur, progress for multi-step | multi-column on mobile; reset on error |
| **Empty states** | explain + primary action + optional example data | blank screens |
| **Notifications / toasts** | short, action-specific, undo for destructive; `aria-live="polite"` | stacking forever; vanishing errors |
| **Modals / dialogs** | `<dialog>` or ARIA dialog; focus trap; Escape closes; return focus | modals on page load; nested modals |
| **Carousels** | visible prev/next, pause for autoplay, swipe, keyboard; show partial next item | autoplay without pause; hidden content only in carousel |
| **Product page (e-com)** | gallery (zoom/swipe), title, price, variants, stock, add-to-cart, delivery/returns, reviews | variant selection that doesn't update image/price; sticky CTA covering content |
| **Checkout** | guest checkout, address autocomplete, order summary always visible, clear totals incl. tax/shipping | surprise costs at the end |

## 3. Dashboards

- Start from the user's top questions; each widget answers one.
- KPI cards: value + comparison (vs last period) + trend; don't show 12 equal KPIs.
- Charts: right chart for the question (trend → line, comparison → bar, part-of-whole → stacked bar; avoid pie for > 4 parts); direct labels over legends; consistent colors per series across the app.
- Tables are often the primary work surface — design them first.
- Responsive: dashboards may legitimately be desktop-first; still ensure mobile shows the top KPIs and key list views.

## 4. When to break convention

Break convention when (a) the product's core value *is* a new interaction (e.g. a configurator), (b) testing/evidence shows the convention fails your users, or (c) brand expression happens in a place that doesn't hurt the task (hero, transitions, empty states). Never break it for navigation, forms, checkout, or error recovery without evidence.
