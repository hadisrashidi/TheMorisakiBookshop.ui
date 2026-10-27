# State

Onboarding: done (2026-10-07)

## Current state
- Angular 19 (standalone components), TypeScript 5.7, SCSS, no UI library; fonts self-hosted via `@fontsource/*`. Persian (RTL) storefront.
- Structure: `src/app/core/` (layout, `guards/auth.guard.ts`), `src/app/features/<feature>/` (addresses, auth, authors, books, cart, faq, home, legal, liked, not-found, orders, profile, search), `src/app/shared/` (models, services, directives, `utils/jalali.ts`).
- Talks to the API through `features/*/services/*.api.service.ts` and `shared/services/reviews.api.service.ts` → `core/services/api/api-helper.service.ts` (`ApiHelperService`, returns `Promise<ApiResponse<T>>`, never throws, toast on failure). API base URL from `src/environments/environment.ts` (`https://localhost:7106/api`); `public/env/env.js` is not used by any code. `@core/*` alias in `tsconfig.json`.
- Auth is real (API JWT login, 2026-10-13): `/login` (SMS code or email+password), `/register`, `/reset-password`, `/security`. Orders are real since 2026-10-21 (cart checkout -> `Orders/PlaceOrder`, `/orders` + profile summary read `Orders/GetMyOrders`; models `shared/models/*order*.model.ts`, `shared/services/orders.api.service.ts` + `orders.service.ts`). Addresses are real since 2026-10-26 (`shared/services/addresses.api.service.ts` + `addresses.service.ts`, needs API script 0020). Cart is real for logged-in people since 2026-10-26 (`shared/services/cart.api.service.ts` + `cart.service.ts`, needs API script 0021; guests keep localStorage). Reviews can be written since 2026-10-27 (book page, needs API script 0024). Liked, profile are still front-end only (localStorage).
- Admin panel: NOT here — separate repo `TheMorisakiBookshop.admin.ui` (with `TheMorisakiBookshop.admin.api`), moved out 2026-10-19.
- Images: pipe `shared/pipes/api-image.pipe.ts` (`apiImage`) turns `/uploads/...` into the API origin URL; used on every book/author `<img>` of the shop.
- Translations in `public/i18n/` (fa, en). Book covers / author images in `public/covers/`, `public/authors/`.
- CI: `.github/workflows/build.yml`.

## Active work
- 2026-10-24: orders (checkout, `/orders`, profile summary) and the add-to-cart stock check work against the real API (she tested). Admin orders screens live in the admin repos.
- Storefront only. Next: she tests login against the real API, then BACKLOG task 3 rest / 6. (Admin lives in the admin repos.)

## Session log
### 2026-10-27 (3) — 404 page, page titles, draft legal pages (web session, branch `claude/focused-euler-oqo92a`, UI only)
- Her answers: footer contact data is sample data for now; legal pages: "write something, we edit later"; "do them in the order you think is best".
- Did: `features/not-found` (route `**`, was a redirect to `/`); `core/services/page-title-strategy.ts` (title from route `title`, description from route `data.description`, reset after each navigation) + `shared/services/page-meta.service.ts` (book and author pages set title + description from their data); route titles for all pages; `features/legal/` (`legal-pages.ts` texts, one `LegalPageComponent` for `/terms`, `/privacy`, `/returns`, `/shipping`); footer links to them.
- Verified: `npm run build` ok; Playwright against `ng serve` (no API): tab title + description right on `/`, `/terms`, `/shipping`, `/cart`, unknown URL shows the 404 card, no page errors. NOT verified: book/author titles (need the API).
### 2026-10-27 (2) — Header / footer polish (web session, branch `claude/focused-euler-oqo92a`)
- Did: header category links use `?genres=<genre>` (exact filter) instead of free text `q`; `SearchComponent` reads `genres` from the URL (only when present, so other filters stay); account menu got "سفارش‌های من" and "آدرس‌های من"; footer "سفارش‌ها" -> `/orders`, "پرداخت" renamed "سبد خرید".
- Verified: `npm run build` ok. NOT verified: browser test.
### 2026-10-27 — Write a review (web session, branch `claude/focused-euler-oqo92a`, API + UI)
- Did: review form (stars + text) in the reviews tab of `BooksComponent` (logged in: form, prefilled with the person's old review via `Reviews/GetMyReview`; logged out: "ورود" button with `returnUrl`); `ReviewsApiService.getMyReview/saveReview`; model `save-review.request.model.ts`.
- Verified: `npm run build` ok. NOT verified: browser test, real API (API script 0024 never run).
### 2026-10-26 (3) — Birthdate on the account (web session, same branch, API + UI)
- Did: `UserModel.birthdate`, `UpdateProfileRequestModel.birthdate`, `ProfileComponent.saveProfileToAccount` (name + birthdate), `AuthService.startSession` prefers the server birthdate, `LoginComponent.finishLogin` uploads a local birthdate once.
- Verified: `npm run build` ok. NOT verified: browser test, real API (API scripts 0022-0023 never run).
### 2026-10-26 (2) — Server cart (web session, branch `claude/lucid-faraday-5ab9od`, API + UI)
- Did: `CartApiService`, `CartService` (effect on login/logout: merge guest cart, load saved cart, empty on logout; each change saved with `Cart/SetQuantity`), models `CartItemResponseModel`, `SetCartQuantityRequestModel`, `MergeCartRequestModel`.
- Verified: `npm run build` ok. NOT verified: browser test, real API (API script 0021 never run).
