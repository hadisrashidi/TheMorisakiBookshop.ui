# Decisions
- 2026-10-12: `ApiHelperService` never throws: HTTP errors and `isSuccess: false` come back as an `ApiResponse` with `isSuccess = false` and a toast (`showErrorAlert`, default on) — components only check `result.isSuccess && result.data`. Alert types (Swal/redirect) not built; only what is used.
- 2026-10-12: Cart / liked / order models keep `price` as string for now (existing localStorage data), `Book.price` is a number — the conversion sits in `CartService.addToCart` / `LikedService.toggle`; revisit when cart moves to the API.
<!-- active decisions only, newest on top: YYYY-MM-DD: WHAT — WHY. Superseded ones go to archive/decisions.md -->

- 2026-10-07: Guest cart stays in localStorage and is merged into the server cart after login; login is only required at checkout.
- 2026-10-07: Goal: real online bookshop for real sales, single seller, Iranian market (Persian RTL). Login = mobile + OTP first, email + password optional later. Roadmap phases 0-6 live in the API repo BACKLOG (master); UI tasks 4-8 here follow it.
- 2026-10-04: The API wraps every response in `CustomActionResult<T>` = Angular `ApiResponse<T>` `{ isSuccess, data, message, errors }` — the server owns the envelope, so `ApiHelperService` stays simple and matches the angular-stack skill.

- 2026-10-04: `.claude/skills/angular-stack/` (copied from helper's global skill) is the rulebook: all new code follows it; existing code migrated gradually (file touched by a task is fixed in the same change, cross-cutting migrations = separate backlog tasks, never big-bang); Angular 19 vs 21 irrelevant for these rules — consistent code without stopping feature work.
- 2026-10-04: Code kept plain and readable on both repos — owner reads every line; the API side is her .NET learning project.
