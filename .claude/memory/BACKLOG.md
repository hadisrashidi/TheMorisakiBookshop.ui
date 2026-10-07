# Backlog
<!-- open work only. Finished items go to archive/done.md with the date. Top = next. -->

## Open tasks
1. Build the base pieces `angular-stack` expects (minimal versions, only what is used): `@core/*` path alias in `tsconfig.json`, `ApiCallModel`, `ApiResponse<T>`, `ApiHelperService` (returns `Promise<T>`), alert types mapped to the existing `ToastService`.
   - `ApiResponse<T>` = `{ isSuccess, data, message, errors }` — the API sends exactly this envelope (`CustomActionResult<T>`, API BACKLOG task 1). Business failures arrive as HTTP 200 with `isSuccess: false`; 400/500 carry the same shape.
2. API base URL mismatch: `public/env/env.js` uses `https://localhost:44388/api/`, the API's `launchSettings.json` uses `https://localhost:7106` / `http://localhost:5074`. Align with her.
3. Gradual migration to `angular-stack` (do per file when touched; these are the cross-cutting ones):
   - API services (5 `*.api.service.ts` + `reviews.api.service.ts`): `HttpClient` + Observable → `ApiHelperService` + `Promise<T>` (after task 1).
   - `OnPush` on all components (0 of 19 today).
   - `*ngIf/*ngFor` → `@if/@for` (16 files).
   - `constructor(` injection → `inject()` (8 places).
   - Models `export interface` → classes (8: e.g. `Address`, `Order`, `OrderLine`).
   - Components into `features/<f>/components/` folders.
   - Test runner Karma → Vitest: only if she wants it.

4. Audit pages against the shop scope (API BACKLOG task 10): header, footer, home, search, book details, author details, similar books, cart, orders, login — what is real, what is a placeholder, what is missing. Write the findings here as tasks.
5. Login screen for **mobile + OTP** (phase 2) and an optional **email + password** form — after the API auth endpoints exist. Replaces the localStorage fake auth in `features/auth`.
6. Cart, checkout, orders page and addresses move from localStorage to the API (phase 3); payment redirect/return page (phase 4).
7. Admin panel: books, authors, stock, orders (phase 5) — needs an Admin role guard.
8. Polish for launch (phase 6): final header/footer, legal pages (terms, privacy, returns, shipping), error pages, SEO basics.

## From the API repo
<!-- API contract changes the UI must follow (she copies them from the API repo's BACKLOG). Remove when handled. -->
- (DONE in API 2026-10-07 — breaking for current services!) All responses are wrapped in `{ isSuccess, data, message, errors }`; not-found is HTTP 200 + `isSuccess: false`. Current `HttpClient` services still expect raw JSON and will break against the new API until they move to `ApiHelperService` (task 1 + task 3 first bullet). BooksManagement: create/update return the book inside `data`; delete returns no data (no more 201/204).
- (decided 2026-10-07) Book `price` / `oldPrice` become numbers (`DECIMAL(18,0)`) instead of strings when the API moves to SQL Server — update `Book` model and price formatting then.
- (planned, API phases 2-4) New endpoint groups: auth (OTP, email+password), profile/addresses, cart, orders, payment. Contracts arrive here when each API task is designed. Full roadmap: API repo BACKLOG.

## For the API repo
<!-- things the UI needs from the API. She copies these into an API session. -->
- (none)

## Questions for her
- (none)
