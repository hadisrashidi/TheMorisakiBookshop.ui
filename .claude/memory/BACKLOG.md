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

5. Login screen for **mobile + OTP** (phase 2) and an optional **email + password** form — after the API auth endpoints exist. Replaces the localStorage fake auth in `features/auth`.
6. Cart, checkout, orders page and addresses move from localStorage to the API (phase 3); payment redirect/return page (phase 4).
7. Admin panel: books, authors, stock, orders (phase 5) — needs an Admin role guard.
8. Polish for launch (phase 6): final header/footer, legal pages (terms, privacy, returns, shipping), error pages, SEO basics.
9. Search page: paging is server-side now (done 2026-10-12). Still open: price-range and author filter controls (API already accepts `minPrice`, `maxPrice`, `authorId`); genres/languages lists are hand-typed in `search.component.ts` (`availableGenres`, `availableLanguages`) → load them from the API (needs a facets endpoint, not built yet) so they never drift from the data.
10. Header: category sub-nav is 5 hard-coded genres sent as free text `q` (works, but breaks when a genre is renamed) → use the genre filter once task 9 exists; account menu has only profile + logout → add orders and addresses links.
11. Footer: "سفارش‌ها" and "حساب کاربری من" both go to `/profile` (orders page is `/orders`); "پرداخت" just goes to `/cart`; only one guide link (FAQ). Address (تهران، شریعتی), phone and social URLs: confirm with her that they are the real shop data. Legal pages → task 8.
12. FAQ (`features/faq`): 4 static entries promise online gateway payment, 2-5 working days delivery, 7-day returns — business rules she has not decided yet (API task 26). Do not publish before she confirms them.
13. Auth is NOT secure (`shared/services/auth.service.ts`): accounts + SHA-256 hashes in localStorage, and `resetPassword` lets anyone with the browser reset any account without verification. Harmless as a mock, a hole if deployed → replaced by task 5; must be gone before launch.
14. Cart/checkout/orders: checkout only writes a random `#NNNNN` order into localStorage and empties the cart (the page says "ثبت سفارش نمایشی"); shipping is always 0; stock is never checked against the cart quantity (book page only disables the button when out of stock). Covered by task 6 + API tasks 15-17, but the quantity-vs-stock check must be part of it. Book page has no way to write a review (list only) — needs an API endpoint, decide with her if wanted.

## From the API repo
- (DONE in API + UI 2026-10-12) `GET Books/SearchBooks` now returns `{ items, totalCount, page, pageSize }` (UI class `BookSearchResult`); new query params `page` (default 1), `pageSize` (default 9, max 50), `authorId`, `minPrice`, `maxPrice`.
- (DONE in API 2026-10-12) Book responses carry `stock` + `inStock`; `price` / `oldPrice` are numbers (`oldPrice` null = no discount). UI `Book` model updated; cart / liked / orders models still keep `price` as string (localStorage data) — convert to numbers with the cart move to the API (task 6).
- (planned, API phases 2-4) New endpoint groups: auth (OTP, email+password), profile/addresses, cart, orders, payment. Contracts arrive here when each API task is designed. Full roadmap: API repo BACKLOG.
- (planned) Price display has no thousands separator (was never formatted); add a pipe when she wants it.

## For the API repo
<!-- things the UI needs from the API. She copies these into an API session. -->
- Facets endpoint (distinct genres + languages, price min/max) for the search filters — task 9.

## Questions for her
- (none)
