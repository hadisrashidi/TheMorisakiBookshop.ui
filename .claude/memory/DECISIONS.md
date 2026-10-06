# Decisions
<!-- active decisions only, newest on top: YYYY-MM-DD: WHAT — WHY. Superseded ones go to archive/decisions.md -->

- 2026-10-04: The API wraps every response in `CustomActionResult<T>` = Angular `ApiResponse<T>` `{ isSuccess, data, message, errors }` — the server owns the envelope, so `ApiHelperService` stays simple and matches the angular-stack skill.

- 2026-10-04: `.claude/skills/angular-stack/` (copied from helper's global skill) is the rulebook: all new code follows it; existing code migrated gradually (file touched by a task is fixed in the same change, cross-cutting migrations = separate backlog tasks, never big-bang); Angular 19 vs 21 irrelevant for these rules — consistent code without stopping feature work.
- 2026-10-04: Code kept plain and readable on both repos — owner reads every line; the API side is her .NET learning project.
