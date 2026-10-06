# Testing Reference

## Stack: Vitest + Angular TestBed

```bash
npm run test                                          # watch mode
npm run test -- --watch=false                         # single run
npm run test -- --coverage                            # with coverage
npm run test -- --include='**/my.spec.ts' --watch=false
```

## Coverage Targets

- Minimum: 80% lines
- Recommended: 90%+ lines, 85%+ branch
- Auth/validation/error paths: aim for 100%

## When to Skip Tests

Only for **simple API wrapper services** that only: build `ApiCallModel` → call `apiHelperService` → return Promise.
Add comment: `// Simple API wrapper - no tests required`

If a service has ANY logic (conditions, transformations, state, error handling) → tests required.

## Standard Test Pattern

```typescript
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MyComponent } from './my.component';
import { MyApiService } from '../services/my-api.service';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let mockApiService: Partial<MyApiService>;

  beforeEach(async () => {
    mockApiService = {
      getData: vi.fn().mockResolvedValue({ isSuccess: true, data: [] }),
    };

    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [{ provide: MyApiService, useValue: mockApiService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    // Set @Input() BEFORE detectChanges
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads data on init', async () => {
    fixture.detectChanges(); // triggers ngOnInit
    await fixture.whenStable();
    expect(mockApiService.getData).toHaveBeenCalled();
  });
});
```

## Async Pattern

```typescript
it('handles async', async () => {
  (mockService.load as any) = vi.fn().mockResolvedValue(data);
  component.id = 1;
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((r) => setTimeout(r, 10));
  expect(component.data).toBeTruthy();
});
```

## Rules

- Set all `@Input()` values BEFORE `fixture.detectChanges()`
- Use `Partial<T>` + `vi.fn()` for service mocks
- `as any` is allowed in test files for mock casting
- Use `TestBed` for DI — never `inject()` in test setup
- Test files go alongside the file they test (not in a separate folder)

## What to Cover

- Init: creates, default values, ngOnInit logic
- Inputs: valid/invalid, defaults, change reactions
- API: params passed, success, error, loading state, empty response
- All `@if/@else` branches in templates
- Error states and edge cases (null, empty, large values)
- User interactions (click, input events)
