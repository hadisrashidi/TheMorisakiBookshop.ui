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
### 2026-11-04 — Best sellers on the home page (web session, branch `claude/focused-euler-oqo92a`)
- Did: home block "پرفروش‌ترین‌ها" (between the featured grid and the newest row; same card as the newest row; hidden while empty), `HomeApiService.getBestSellers` -> `Books/GetBestSellers`.
- Verified: `npm run build` ok; Playwright with a mocked API (block shown with 2 cards; empty list = block hidden). NOT verified: real API (needs API script 0035).
### 2026-11-03 (2) — Footer from the API (web session, branch `claude/focused-euler-oqo92a`)
- Did: `FooterComponent` loads name / phone / address / links from `Settings/GetShopInfo` (`ShopInfoApiService`, `ShopInfoResponseModel`); the sample values stay as the fallback; an empty link hides its icon; discount minus signs keep their left-to-right order.
- Verified: `npm run build` ok. NOT verified in a browser / real API (needs API script 0033).
### 2026-11-03 — Discount code in the cart (web session, branch `claude/focused-euler-oqo92a`)
- Did: cart summary: code box ("اعمال"), applied state with "حذف", discount row, total = books − discount + shipping (`payableTotal`); the code is re-checked silently when the cart price changes and after a refused order; `PlaceOrderRequestModel.discountCode`; orders page shows the discount; `DiscountsApiService`, `DiscountPreviewResponseModel`. A guest who tries a code is sent to login.
- Verified: `npm run build` ok; Playwright with a mocked API (wrong code refused with the API message, WELCOME20 applied, total right, check calls carry the cart price). NOT verified: real API (needs API script 0032).
### 2026-11-02 — Order tracking on the orders page (web session, branch `claude/focused-euler-oqo92a`)
- Did: `/orders`: timeline per order (`buildOrderSteps` in `shared/utils/order-status.ts`: ثبت / پرداخت / آماده‌سازی / ارسال / تحویل, or the steps passed + "لغو شد"), tracking code with copy button and a link to the post tracking site (`carrierTrackingUrl`, only when the shipping method name contains "پست"), "لغو سفارش" with the confirm dialog while `PendingPayment` (`OrdersService.cancelOrder`, `OrdersApiService.cancelMyOrder`); models `OrderHistoryResponseModel`, `OrderStepModel`.
- Verified: `npm run build` ok; Playwright with a mocked API (3 timelines, link, cancel flow). NOT verified: real API (needs API script 0029); the post URL.
### 2026-11-01 — Date picker fix (web session, branch `claude/focused-euler-oqo92a`)
- Did: confirm dialog in the shop (`shared/services/confirm.service.ts`, `shared/components/confirm-dialog`, used by `AddressesComponent.remove`; verified with Playwright: focus on cancel, cancel = no call, confirm = delete call, no browser dialog). `shared/components/jalali-date-picker`: month / year `<select>` showed the first option (فروردین / newest year) while the grid was the right month; options now use `[selected]`. Same fix in the admin UI copy.
- Verified: `npm run build` ok; Playwright on the admin copy (shows آبان / 1405). NOT verified: the shop profile page in a browser.
