# Archived sessions
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
<!-- newest on top -->
### 2026-10-04 — Claude setup (done locally by a helper, not a web session)
- Did: created `.claude/CLAUDE.md`, `.claude/ONBOARDING.md`, memory files, Stop hook, `.claude/settings.json`; copied helper's global `angular-stack` skill to `.claude/skills/angular-stack/` with a note: new code follows it, old code migrated gradually. Existing design skills untouched.
- Result: setup only, no app code changed. Gaps between skill and repo listed in BACKLOG tasks 1 and 3.
- Next: onboarding, then BACKLOG task 1 (base pieces for `angular-stack`).
