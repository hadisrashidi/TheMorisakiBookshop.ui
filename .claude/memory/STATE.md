# State

Onboarding: pending

## Current state
- Angular 19 (standalone components), TypeScript 5.7, SCSS, no UI library; fonts self-hosted via `@fontsource/*`. Persian (RTL) storefront.
- Structure: `src/app/core/` (layout, `guards/auth.guard.ts`), `src/app/features/<feature>/` (addresses, auth, authors, books, cart, faq, home, liked, orders, profile, search), `src/app/shared/` (models, services, directives, `utils/jalali.ts`).
- Talks to the API through `features/*/services/*.api.service.ts` and `shared/services/reviews.api.service.ts`. API base URL from `public/env/env.js` (`window.env.apiUrl`).
- Auth, cart, liked, orders, addresses, profile are front-end only (localStorage), no API behind them.
- Translations in `public/i18n/` (fa, en). Book covers / author images in `public/covers/`, `public/authors/`.
- CI: `.github/workflows/build.yml`.

## Active work
- None. Next: first backlog item.

## Session log
<!-- newest on top, max 5 blocks, older ones go to archive/sessions.md -->
### 2026-10-04 — Claude setup (done locally by a helper, not a web session)
- Did: created `.claude/CLAUDE.md`, `.claude/ONBOARDING.md`, memory files, Stop hook, `.claude/settings.json`; copied helper's global `angular-stack` skill to `.claude/skills/angular-stack/` with a note: new code follows it, old code migrated gradually. Existing design skills untouched.
- Result: setup only, no app code changed. Gaps between skill and repo listed in BACKLOG tasks 1 and 3.
- Next: onboarding, then BACKLOG task 1 (base pieces for `angular-stack`).
