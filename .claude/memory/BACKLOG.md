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

6. Payment redirect/return page (phase 4). Checkout, orders page, addresses and cart already use the API (cart 2026-10-26, needs API script 0021). Still local: liked books, profile details.
7. Admin panel: moved to the repo `TheMorisakiBookshop.admin.ui` (books, authors, stock DONE 2026-10-19). Orders screens will be built THERE (phase 5).
8. Polish for launch (phase 6): final header/footer, legal pages (terms, privacy, returns, shipping), error pages, SEO basics.
10. Header: category sub-nav is 5 hard-coded genres sent as free text `q` (works, but breaks when a genre is renamed) → use the genre filter (now in the search page, task 9 done) with `genres=` instead of free text `q`; account menu has only profile + logout → add orders and addresses links.
11. Footer: "سفارش‌ها" and "حساب کاربری من" both go to `/profile` (orders page is `/orders`); "پرداخت" just goes to `/cart`; only one guide link (FAQ). Address (تهران، شریعتی), phone and social URLs: confirm with her that they are the real shop data. Legal pages → task 8.
12. FAQ (`features/faq`): 4 static entries promise online gateway payment, 2-5 working days delivery, 7-day returns — business rules she has not decided yet (API task 26). Do not publish before she confirms them.
14. Cart: shipping is always 0 (API too, phase 4). Stock is checked when adding to the cart and at order time (API); a cart saved earlier is re-checked only at checkout. Book page has no way to write a review (list only) - needs an API endpoint, decide with her if wanted.

## From the API repo
- (DONE in API + UI 2026-10-26, needs API script 0021) Cart: `GET Cart/GetMyCart`, `POST Cart/SetQuantity|MergeCart|ClearCart` (token needed). Used by `CartService` for logged-in people.
- (DONE in API + UI 2026-10-26, needs API script 0020) Addresses: `GET Addresses/GetMyAddresses`, `POST Addresses/AddAddress|UpdateAddress?id|DeleteAddress?id|SetDefaultAddress?id` (token needed). Used by `/addresses` and the checkout.
- (DONE in API + UI 2026-10-21, needs API scripts 0015-0016) Orders: `POST Orders/PlaceOrder` + `GET Orders/GetMyOrders` (token needed). Used by the cart checkout and `/orders`; status codes `PendingPayment|Paid|Packed|Shipped|Delivered|Cancelled` are shown in Persian by `shared/utils/order-status.ts`.
- (2026-10-19) Admin endpoints are in the separate admin API repo; shop answers only active books. Needs API script 0013.
- (DONE in API + UI 2026-10-12) `GET Books/GetSearchFilters` → `{ minPrice, maxPrice, genres[], languages[] }` from the catalog; search page uses it and has author select + price range.
- (DONE in API + UI 2026-10-12) `GET Books/SearchBooks` now returns `{ items, totalCount, page, pageSize }` (UI class `BookSearchResult`); new query params `page` (default 1), `pageSize` (default 9, max 50), `authorId`, `minPrice`, `maxPrice`.
- (DONE in API 2026-10-12) Book responses carry `stock` + `inStock`; `price` / `oldPrice` are numbers (`oldPrice` null = no discount). UI `Book` model updated; cart / liked / orders models still keep `price` as string (localStorage data) — convert to numbers with the cart move to the API (task 6).
- (DONE in API + UI 2026-10-13) Auth: `Auth/RequestOtp`, `VerifyOtp`, `LoginWithPassword`, `SetCredentials`, `ResetPassword` — UI screens `/login`, `/reset-password`, `/security`, token interceptor. Needs API scripts 0010-0011.
- (planned, API phases 3-4) New endpoint groups: profile/addresses, cart, orders, payment. Contracts arrive here when each API task is designed. Full roadmap: API repo BACKLOG.
- (planned) Price display has no thousands separator (was never formatted); add a pipe when she wants it.

## For the API repo
<!-- things the UI needs from the API. She copies these into an API session. -->
- (none)

## Questions for her
- (none)
