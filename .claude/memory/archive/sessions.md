# Archived sessions
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
