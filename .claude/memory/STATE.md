# State

Onboarding: done (2026-10-07)

## Current state
- Angular 19 (standalone components), TypeScript 5.7, SCSS, no UI library; fonts self-hosted via `@fontsource/*`. Persian (RTL) storefront.
- Structure: `src/app/core/` (layout, `guards/auth.guard.ts`), `src/app/features/<feature>/` (addresses, auth, authors, books, cart, faq, home, liked, orders, profile, search), `src/app/shared/` (models, services, directives, `utils/jalali.ts`).
- Talks to the API through `features/*/services/*.api.service.ts` and `shared/services/reviews.api.service.ts` → `core/services/api/api-helper.service.ts` (`ApiHelperService`, returns `Promise<ApiResponse<T>>`, never throws, toast on failure). API base URL from `src/environments/environment.ts` (`https://localhost:7106/api`); `public/env/env.js` is not used by any code. `@core/*` alias in `tsconfig.json`.
- Auth is real (API JWT login, 2026-10-13): `/login` (SMS code or email+password), `/register`, `/reset-password`, `/security`. Cart, liked, orders, addresses, profile are still front-end only (localStorage).
- Translations in `public/i18n/` (fa, en). Book covers / author images in `public/covers/`, `public/authors/`.
- CI: `.github/workflows/build.yml`.

## Active work
- Login screens built against the API auth endpoints (needs API scripts 0010-0011). Next: she tests it in the browser, then BACKLOG task 3 rest / 6.

## Session log
### 2026-10-13 — Real login screens (web session, branch `claude/adoring-rubin-tb785m`, both repos)
- Did: `AuthApiService`, auth models, `AuthService` rewritten as session only, `authInterceptor` (+ `ApiHelperService` skips the toast on 401), `/login` (SMS code | email+password tabs), `/reset-password`, `/security`, shared `OtpRequestComponent` (60 s resend timer), `normalizeDigits` (Persian digits). Removed register page and the fake auth (incl. the insecure reset). Header shows the mobile and links.
- Verified: `npm run build` ok; Playwright smoke test with a MOCKED API: redirect to login, OTP login with Persian digits, Bearer header sent, 401 logs out. NOT verified against the real API.
- Follow-up: her email login failed (SMS-only account has no email) → added `/register` (mobile + code + email + password), login page links to it; API messages are Persian now. Mock-API smoke test of /register ok; build ok.
- Next: she tests with the real API.
### 2026-10-12 — Page audit (web session, branch `claude/vibrant-dijkstra-3beh1b`)
- Did: read-only audit of routes, header, footer, home, search, book/author pages, cart, orders, auth, FAQ. Findings = BACKLOG tasks 9-14. No app code changed.
- Also: search uses server paging (`BookSearchResult` model, `search.api.service.ts`, `search.component.*`); `npm run build` ok. NOT verified in a browser — needs her to run API script 0008 first.
- Then: search filters from `Books/GetSearchFilters`, author select, price range (`BookFilters` model); build ok, not browser-tested. Needs API script 0009.
- Next: BACKLOG task 3 / 10-11.
### 2026-10-12 — API envelope in the UI (web session, branch `claude/friendly-pascal-icidjv`)
- Why: pages showed no books — services still expected raw arrays, the API sends `{ isSuccess, data, message, errors }`.
- Did: built `ApiResponse<T>`, `ApiCallModel`, `ApiHelperService` (`src/app/core/`), `@core/*` alias; moved all 6 API services to `Promise<ApiResponse<T>>`; home, search, book, author components `await` them (no more `subscribe`); `Book.price/oldPrice` numbers + `stock`; cart/liked convert to string (their stored models stay strings).
- Verified: `npm run build` ok. NOT verified in a browser / against the real API.
- Not done on purpose: OnPush / `@if` / `@for` on the touched components — cannot test rendering here, risk of blank pages; stays in task 3.
- Confirmed by her: everything works.
<!-- newest on top, max 5 blocks, older ones go to archive/sessions.md -->
### 2026-10-07 — Onboarding + planning (web session, both repos, branch `claude/magical-wozniak-j0qmxf`)
- Did: onboarding done; scope and roadmap agreed (master in API repo BACKLOG); UI BACKLOG tasks 4-8 added; decision logged.
- Result: memory only, no app code changed.
- Next: she adds more tasks, then says "start" → task 1.
