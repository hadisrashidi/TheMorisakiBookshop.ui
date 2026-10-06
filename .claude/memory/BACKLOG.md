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

## From the API repo
<!-- API contract changes the UI must follow (she copies them from the API repo's BACKLOG). Remove when handled. -->
- (pending, API task 1) All responses wrapped in `{ isSuccess, data, message, errors }`; not-found becomes HTTP 200 + `isSuccess: false`. Switch each service when it moves to `ApiHelperService`.
- (expected) Book prices may become numbers instead of strings when the API moves to SQL Server.

## For the API repo
<!-- things the UI needs from the API. She copies these into an API session. -->
- (none)

## Questions for her
- (none)
