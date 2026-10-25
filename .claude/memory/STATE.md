# State

Onboarding: done (2026-10-07)

## Current state
- Angular 19 (standalone components), TypeScript 5.7, SCSS, no UI library; fonts self-hosted via `@fontsource/*`. Persian (RTL) storefront.
- Structure: `src/app/core/` (layout, `guards/auth.guard.ts`), `src/app/features/<feature>/` (addresses, auth, authors, books, cart, faq, home, liked, orders, profile, search), `src/app/shared/` (models, services, directives, `utils/jalali.ts`).
- Talks to the API through `features/*/services/*.api.service.ts` and `shared/services/reviews.api.service.ts` → `core/services/api/api-helper.service.ts` (`ApiHelperService`, returns `Promise<ApiResponse<T>>`, never throws, toast on failure). API base URL from `src/environments/environment.ts` (`https://localhost:7106/api`); `public/env/env.js` is not used by any code. `@core/*` alias in `tsconfig.json`.
- Auth is real (API JWT login, 2026-10-13): `/login` (SMS code or email+password), `/register`, `/reset-password`, `/security`. Orders are real since 2026-10-21 (cart checkout -> `Orders/PlaceOrder`, `/orders` + profile summary read `Orders/GetMyOrders`; models `shared/models/*order*.model.ts`, `shared/services/orders.api.service.ts` + `orders.service.ts`). Cart, liked, addresses, profile are still front-end only (localStorage).
- Admin panel: NOT here — separate repo `TheMorisakiBookshop.admin.ui` (with `TheMorisakiBookshop.admin.api`), moved out 2026-10-19.
- Images: pipe `shared/pipes/api-image.pipe.ts` (`apiImage`) turns `/uploads/...` into the API origin URL; used on every book/author `<img>` of the shop.
- Translations in `public/i18n/` (fa, en). Book covers / author images in `public/covers/`, `public/authors/`.
- CI: `.github/workflows/build.yml`.

## Active work
- 2026-10-24: orders (checkout, `/orders`, profile summary) and the add-to-cart stock check work against the real API (she tested). Admin orders screens live in the admin repos.
- Storefront only. Next: she tests login against the real API, then BACKLOG task 3 rest / 6. (Admin lives in the admin repos.)

## Session log
### 2026-10-25 — Empty cart / favourites go home (web session, branch `claude/gifted-curie-7qha13`)
- Did: `CartComponent.goHomeWhenCartIsEmpty` (after remove / minus), `LikedComponent.remove` navigates home when the list is empty.
- Verified: `npm run build` ok; Playwright (mock API): removing 1 of 2 stays, removing the last goes to `/`, minus on the last single copy goes to `/`, opening an empty cart stays, same for favourites, no page errors.
### 2026-10-24 — Stock check when adding to the cart (web session, branch `claude/gifted-curie-7qha13`)
- Did: `CartService.addCheckedToCart` (fresh stock via `BooksApiService.getBookById`, error / warning toasts, success toast moved here); the 5 callers (home, search, author page, liked, book page) use it and lost their unused toast injection; `CartItem.stock`; cart page `+` stops at the stock.
- Verified: `npm run build` ok; Playwright against a MOCKED API (list says in stock but real stock 2: 1st and 2nd add ok, 3rd refused with "only 2, 2 in your cart"; real stock 0 -> "ناموجود", cart stays empty, no page errors). NOT verified against the real API.
### 2026-10-21 — Checkout + orders page on the API (web session, branch `claude/gifted-curie-7qha13`, shop repos + admin repos)
- Did: `OrdersApiService`, `OrdersService` (signal store, `load()`, `placeOrder()`), order models as classes (`OrderResponseModel`, `OrderLineResponseModel`, `PlaceOrderRequestModel`, `PlaceOrderLineRequestModel`), `utils/order-status.ts`; `CartComponent` (login + address check, `isPlacing`, OnPush, `@if/@for`), `OrdersComponent` (OnPush, loading state, recipient/address/tracking), profile summary loads orders. Old `order.model.ts` + fake localStorage orders removed.
- Verified: `npm run build` ok; Playwright against a MOCKED API (payload has ids + quantities only and the Bearer token, thank-you card, cart emptied, old fake key removed, orders page + profile row with Jalali date and Persian status, stock failure keeps the cart, no address -> `/addresses`, logged out -> `/login?returnUrl=/cart`, no page errors). NOT verified against the real API / database.
### 2026-10-19 — Admin panel built here, then moved to its own repo (web session, branch `claude/loving-gauss-lh47dz`)
- Did: `adminGuard`, `features/admin/` (models, 3 API services, nav tabs, image-upload field, books list, book form, authors list, author form), routes `/admin/**`, account-menu link for admins, `apiImage` pipe on all shop images (7 components), `Book.isActive`.
- Verified: `npm run build` ok; Playwright against a MOCKED API: customer redirected from `/admin`, Bearer sent, list shows hidden status + uploaded cover URL on the API origin, stock save, hide, upload (multipart), create (empty spec row dropped), edit loads, author create, no console errors. NOT verified against the real API / database.
- Follow-up (same day): she wanted a SEPARATE admin repo → everything admin (`features/admin`, `adminGuard`, `/admin` routes, header link, `Book.isActive`) moved to `TheMorisakiBookshop.admin.ui` and removed here. Kept: pipe `apiImage` (shop pages must show covers uploaded by the admin). `npm run build` ok.
### 2026-10-13 — Real login screens (web session, branch `claude/adoring-rubin-tb785m`, both repos)
- Did: `AuthApiService`, auth models, `AuthService` rewritten as session only, `authInterceptor` (+ `ApiHelperService` skips the toast on 401), `/login` (SMS code | email+password tabs), `/reset-password`, `/security`, shared `OtpRequestComponent` (60 s resend timer), `normalizeDigits` (Persian digits). Removed register page and the fake auth (incl. the insecure reset). Header shows the mobile and links.
- Verified: `npm run build` ok; Playwright smoke test with a MOCKED API: redirect to login, OTP login with Persian digits, Bearer header sent, 401 logs out. NOT verified against the real API.
- Follow-up: her email login failed (SMS-only account has no email) → added `/register` (mobile + code + email + password), login page links to it; API messages are Persian now. Mock-API smoke test of /register ok; build ok.
- Follow-up 2: login/register go to `/` (home), "remember me" checkbox (login both tabs + register, sends `rememberMe`); mock-API smoke test ok, build ok.
- Follow-up 3: name on the account (`/register` asks for it, profile save calls `Auth/UpdateProfile`), welcome toast with the name, menu shows the name, last email pre-filled; build ok, mock-API smoke test ok. Needs API script 0012.
- Follow-up 4: eye button on all password fields (`PasswordFieldComponent`), login copies the local profile name to an unnamed account, menu hint "افزودن نام"; mock-API smoke test ok, build ok. Her report: still "خوش آمدید" without name = account has no name yet (needs API script 0012 + a name saved in profile).
- Next: she tests with the real API.
