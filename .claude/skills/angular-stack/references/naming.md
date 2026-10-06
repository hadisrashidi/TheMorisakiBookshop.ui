# Naming Conventions

> ⚠️ This file is a living document. Update it whenever naming rules are confirmed or changed.

## Files & Folders

| Type | Convention | Example |
|------|-----------|---------|
| All files | `kebab-case` | `customer-info.component.ts` |
| All folders | `kebab-case` | `user-profile/` |
| Test files | `[name].spec.ts` | `customer.service.spec.ts` |
| Model files | must end with `.model.ts`, `.request.model.ts`, or `.response.model.ts` | `customer.request.model.ts` |

## Code

| Type | Convention | Example |
|------|-----------|---------|
| Classes | `PascalCase` | `CustomerInfoModel` |
| Variables | `camelCase` | `customerInfo` |
| Properties | `camelCase` | `isLoading` |
| Parameters | `camelCase` | `customerId` |
| Constants | `camelCase` (readonly fields) | `readonly maxRetries = 3` |

## Angular-Specific

| Type | Convention | Example |
|------|-----------|---------|
| Components | `[name].component.ts` | `customer-search.component.ts` |
| Services | `[name].service.ts` | `customer-query-api.service.ts` |
| Guards | `[name].guard.ts` | `auth-token.guard.ts` |
| Pipes | `[name].pipe.ts` | `translate.pipe.ts` |
| Directives | `[name].directives.ts` | `persian-input-restriction.directives.ts` |
| Models | see model suffix rules above | |

## SCSS / CSS Classes

- BEM naming: `.block`, `.block__element`, `.block--modifier`
- State classes: `.is-loading`, `.is-active`, `.is-disabled`

---

## SQL Server (Placeholder — To Be Defined)

> Naming rules for SQL Server tables, views, columns, and stored procedures will be added here.

## Oracle (Placeholder — To Be Defined)

> Naming rules for Oracle tables, views, packages, and procedures will be added here.

## .NET / C# (Placeholder — To Be Defined)

> Naming rules for .NET variables, classes, methods will be added here.
