# Documented Preferences

Read at the start of every job. Add dated entries when the user gives feedback
or a brand rule is confirmed. Format: `YYYY-MM-DD · scope · rule · source`.
Client brands get their own `## Brand: <name>` section. These rules override
skill defaults for their scope only.

## Skill-wide defaults (user-stated)

- 2026-10-10 · all design-director work · **Arabic typeface: Alexandria** (https://fonts.google.com/specimen/Alexandria) · source: user instruction in the build session
- 2026-10-10 · all design-director work · **English typeface: Inter Tight** (https://fonts.google.com/specimen/Inter+Tight) · source: user instruction in the build session
- Applies unless a client brief supplies licensed brand fonts. Files: `assets/fonts/` (OFL, from Fontsource 5.3.0).

## House: Tasweeq (this repository's own brand)

Observed in the repository source, not yet confirmed by the user. Use them for
Tasweeq's own marketing material, never for client work.

- 2026-10-10 · tasweeq · Palette: paper `#f5f5f2`, ink `#0a0a0a`, accent cyan `#00d9f5` (text on cyan is `#0a0a0a`), greys `#6b6b6b` / `#9a9a9a`, dividers `#e3e3df` · source: `src/app/globals.css`
- 2026-10-10 · tasweeq · Website type (observed): NewBlack (Latin display), Inter (Latin body), IBM Plex Sans Arabic (Arabic text), thmanyah serif display (Arabic editorial display) · source: `src/lib/fonts.ts`. Superseded for design work by the skill-wide defaults above; the website itself was not changed.
- 2026-10-10 · tasweeq · Arabic-first site (`lang="ar" dir="rtl"` on `<html>`), self-described "Editorial Design System" with light/dark inversion · source: `src/app/layout.tsx`, `globals.css`

## Feedback log

_(empty: append entries as feedback arrives)_
