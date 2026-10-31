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
8. Launch polish still open: replace the DRAFT legal texts (`features/legal/legal-pages.ts`) and the FAQ with her real rules (API task 26); SEO that works without JavaScript needs SSR/prerender (decide later); add a contact page if wanted. DONE 2026-10-27: 404 page, page titles/descriptions, draft legal pages + footer links.
11. Footer: address (تهران، شریعتی), phone and social URLs are SAMPLE data (she said so, 2026-10-27) — replace when she has the real ones (`footer.component.ts`, `.html`).
12. FAQ (`features/faq`): 4 static entries promise online gateway payment, 2-5 working days delivery, 7-day returns — business rules she has not decided yet (API task 26). Do not publish before she confirms them.
14. Cart: shipping now comes from the API (2026-10-31, placeholder prices). Stock is checked when adding to the cart and at order time (API); a cart saved earlier is re-checked only at checkout.

## From the API repo
- (DONE in API + UI 2026-10-31, needs API script 0027) Shipping: `GET Shipping/GetShippingMethods?subtotal&city`; `Orders/PlaceOrder` needs `city` + `shippingMethodId`; orders carry `shippingMethodName`.
- (DONE in API + UI 2026-10-27, needs API script 0024) Reviews: `GET Reviews/GetMyReview?bookId`, `POST Reviews/SaveReview` (token needed). Used by the book page review form.
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
