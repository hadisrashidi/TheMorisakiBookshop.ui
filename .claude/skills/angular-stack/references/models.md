# Models Reference

## Classes Only — Never Interfaces

All models, DTOs, and configs are classes. One class per file.

## File Naming Suffixes (Mandatory)

| Type | Suffix | Example |
|------|--------|---------|
| Domain / DTO | `.model.ts` | `customer-info.model.ts` |
| API Request | `.request.model.ts` | `customer.request.model.ts` |
| API Response | `.response.model.ts` | `customer.response.model.ts` |
| Config | `.config.ts` | `toast-notification.config.ts` |

## Simple DTO (no constructor needed)

```typescript
// models/customer-info.model.ts
export class CustomerInfoModel {
  id: number;
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  isActive: boolean;
}
```

## Request Model

```typescript
// models/customer.request.model.ts
export class CustomerRequestModel {
  nationalCode: string;
  birthDate?: string;
}
```

## Config Class (with defaults)

```typescript
// models/search-filter.config.ts
export class SearchFilterConfig {
  pageSize?: number = 10;
  pageIndex?: number = 0;
  sortField?: string;
  sortDirection?: 'asc' | 'desc' = 'asc';
}
```

## Rules

- Properties must be strongly typed — no `any`
- Constructors only if you need to transform/initialize derived values
- No business logic in models
- Classes defined in services/components are BANNED — move to `models/`

## Naming Conventions for Models

> ⚠️ Naming rules will be updated over time. Check `references/naming.md` for latest conventions.
