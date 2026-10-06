---
name: angular-stack
description: >
  Use this skill for ALL Angular code generation and review tasks on this project.
  Trigger whenever the user asks to create, write, generate, review, fix, or refactor
  any Angular code — components, services, models, directives, pipes, guards, templates,
  styles, or tests. Also trigger for questions about project structure, naming, patterns,
  or best practices in the Angular layer. This skill encodes the exact conventions,
  architecture, and rules of this specific Angular 21 project.
---

# Angular Stack Skill

> **How this skill applies in this repo (decided 2026-10-04)**
> Copied from a helper's global skill (written on Angular 21; this repo is Angular 19 — the
> difference does not matter for these rules).
> - **All new code follows this skill.**
> - **Existing code is migrated gradually**: when a task touches a file, bring *that file* in line
>   with the skill in the same change. Cross-cutting migrations are separate backlog tasks
>   (`.claude/memory/BACKLOG.md`). Never a big-bang refactor of the whole app in one PR.
> - Infrastructure the skill assumes but this repo does not have yet (`ApiHelperService`,
>   `ApiCallModel`, `ApiResponse`, `AngularAlertType`, `@core/` path alias) is built first — see BACKLOG.
>   Until it exists, keep the current `HttpClient` services as they are.
> - Parts that describe things this project doesn't use (Angular Material dialogs, Swal,
>   `LogoutStateService`, Docker/Nginx, bought HTML template, the ".NET skill prompt") are ignored
>   unless she asks for them. Switching the test runner (Karma → Vitest) only when she says so.
> - She can change any rule: edit this file and log it in `.claude/memory/DECISIONS.md`.

This project uses **Angular 21** with standalone components, signals, and a strict set of conventions.
Before generating or reviewing any code, internalize all rules in this file and the reference files.

## Project Structure

```
src/app/
  core/         ← Shared infrastructure. NEVER modify for feature work.
  shared/       ← Reusable UI components with no business state.
  features/
    <feature>/
      components/   ← UI only, no business logic
      models/       ← Classes only (no interfaces), DTOs
      services/     ← API calls ONLY, return Promise<T>
      dialog/       ← optional, Material dialogs
```

Each feature is isolated. Test files (`.spec.ts`) live alongside the file they test.

## Core Rules (Non-Negotiable)

- **Standalone components** only — no NgModules for features
- **`inject()`** for all DI — never constructor injection in new code
- **`OnPush`** change detection on every component
- **Template-driven forms** only — never reactive forms
- **No `any`** — strongly typed everywhere (except test mocks)
- **Classes only** for models — never interfaces
- **No direct `HttpClient`** — always go through `ApiHelperService`
- **All API methods return `Promise<T>`** — never Observable, never void
- **Modern control flow**: `@if`, `@for`, `@switch`, `@defer` — never `*ngIf`, `*ngFor`
- **No hardcoded colors** in SCSS — always CSS variables

## Reference Files

Load the relevant reference file(s) before generating code:

| Task | Reference File |
|------|---------------|
| Creating a component or feature | `references/components-and-features.md` |
| API calls / services | `references/api-and-services.md` |
| Models / DTOs | `references/models.md` |
| SCSS / styling / theming | `references/styling.md` |
| Tests | `references/testing.md` |
| Naming conventions | `references/naming.md` |
| State management | `references/state.md` |
| RTL/LTR / i18n | `references/i18n.md` |
| Bought HTML template integration (JS interop, jQuery) | `references/html-template-integration.md` |

## Code Review Checklist

When reviewing Angular code, check against these in order:

1. **Structure**: Is the file in the right folder per Feature Folder Contract?
2. **Naming**: kebab-case files, PascalCase classes, camelCase props — see `references/naming.md`
3. **Models**: Classes only, correct suffix (`.model.ts`, `.request.model.ts`, `.response.model.ts`)
4. **DI**: Using `inject()`, not constructor?
5. **Change Detection**: `OnPush` present?
6. **API**: Going through `ApiHelperService`? Returning `Promise<T>`?
7. **Forms**: Template-driven only?
8. **Control flow**: Using `@if/@for/@switch`, not structural directives?
9. **Typing**: No `any`? All params/returns typed?
10. **SCSS**: No hardcoded colors? Using CSS variables?
11. **Class member ordering**: injected fields → readonly → public → protected → private → lifecycle → methods
12. **Tests**: `.spec.ts` alongside the file? Using Vitest patterns?

## Naming Conventions (Quick Reference)

> Full rules in `references/naming.md` — update that file when conventions change.

- Files/folders: `kebab-case`
- Classes: `PascalCase`
- Variables/properties: `camelCase`
- Model files: must end in `.model.ts`, `.request.model.ts`, or `.response.model.ts`
- Test files: `[name].spec.ts`

**⚠️ Naming rules will be expanded over time. Always check `references/naming.md` for the latest.**

## When Given an API→Angular Prompt

When you receive a prompt generated by the .NET skill, it contains a complete decision tree.
Follow it exactly:

1. Read the endpoint list — one API service method per endpoint
2. Read the decision tree — create vs update, never overwrite existing
3. Follow the feature folder contract for all new files
4. Apply all Angular rules (OnPush, inject(), template-driven forms, @if/@for, classes not interfaces)
5. After finishing, confirm to the user what was created vs skipped

## Copying This Skill to a Project

When asked to copy this skill to a project (run from inside the project folder):
```bash
pwd  # confirm project root
mkdir -p .skills
cp -r /path/to/angular-stack .skills/
```
The local `.skills/angular-stack/` copy is project-specific.
Edits there do not affect the original skill.

## Key Architectural Decisions
- **Error display** via `AngularAlertType`: `Toast` (non-blocking), `Swal` (blocking dialog), `RedirectToPage` (error pages)
- **State**: Signals for local UI state → RxJS services for async/shared → NgRx only if truly complex
- **Logout state**: Use `LogoutStateService` to capture/restore context across logout — see `LOGOUT_STATE_USAGE.md`
- **Deployment**: Local build → Docker + Nginx with runtime env injection via `env.template.js`

## Class Member Ordering

```typescript
@Component({ ... })
export class MyComponent {
  // 1. Injected fields
  private readonly apiService = inject(MyApiService);

  // 2. Public readonly constants
  readonly maxItems = 10;

  // 3. Public fields / signals
  items = signal<ItemModel[]>([]);

  // 4. Protected fields
  // 5. Private fields

  // 6. Lifecycle hooks
  ngOnInit() { ... }

  // 7. Public methods
  // 8. Protected methods
  // 9. Private methods
}
```
