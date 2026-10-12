# Backlog
<!-- open work only. Finished items go to archive/done.md with the date. Top = next. -->

## Open tasks
3. Gradual migration to `angular-stack` (do per file when touched; these are the cross-cutting ones):
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
- (DONE in API 2026-10-12) Book responses carry `stock` + `inStock`; `price` / `oldPrice` are numbers (`oldPrice` null = no discount). UI `Book` model updated; cart / liked / orders models still keep `price` as string (localStorage data) — convert to numbers with the cart move to the API (task 6).
- (planned, API phases 2-4) New endpoint groups: auth (OTP, email+password), profile/addresses, cart, orders, payment. Contracts arrive here when each API task is designed. Full roadmap: API repo BACKLOG.
- (planned) Price display has no thousands separator (was never formatted); add a pipe when she wants it.

## For the API repo
<!-- things the UI needs from the API. She copies these into an API session. -->
- (none)

## Questions for her
- (none)
