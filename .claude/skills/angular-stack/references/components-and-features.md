# Components & Features Reference

## Standalone Component Template

```typescript
import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-feature.component.html',
  styleUrl: './my-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFeatureComponent implements OnInit {
  // 1. Injected fields
  private readonly myApiService = inject(MyApiService);

  // 3. Public fields / signals
  items = signal<ItemModel[]>([]);
  loading = signal(false);

  // 6. Lifecycle
  ngOnInit(): void {
    this.loadItems();
  }

  // 7. Public methods
  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.myApiService.getItems();
      if (result.isSuccess) {
        this.items.set(result.data ?? []);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
```

## Template Rules

- Use `@if`, `@for`, `@switch` — never `*ngIf`, `*ngFor`
- `track` is mandatory on `@for` with lists > 10 items
- No method calls in bindings — use signals or computed values
- Template-driven forms with `[(ngModel)]`

```html
<!-- Control flow -->
@if (loading()) {
  <mat-progress-spinner mode="indeterminate" diameter="24" />
} @else {
  @for (item of items(); track item.id) {
    <div class="item-card">{{ item.name }}</div>
  } @empty {
    <p class="text-muted">No items found</p>
  }
}

<!-- Template-driven form -->
<form #myForm="ngForm" novalidate (ngSubmit)="onSubmit(myForm)">
  <mat-form-field class="w-100">
    <mat-label>Name</mat-label>
    <input matInput [(ngModel)]="formData.name" name="name" required #nameInput="ngModel" />
    <mat-error>{{ nameInput.errors?.['required'] ? 'Required' : '' }}</mat-error>
  </mat-form-field>
  <button mat-raised-button type="submit" [disabled]="myForm.invalid">Submit</button>
</form>
```

## Feature Folder Contract

```
features/<feature-name>/
  components/    ← UI only
  models/        ← DTOs and domain classes
  services/      ← API calls ONLY
  dialog/        ← optional
```

- `components/` — no business logic, no API calls
- `services/` — API calls only, `Promise<T>` return, no state/BehaviorSubject
- `models/` — classes only, see models.md
- Cross-feature state goes in `src/app/shared/`

## Error Pages

Navigate to error pages via router:
```typescript
this.router.navigate(['/404']);
this.router.navigate(['/403']);
this.router.navigate(['/500']);
```

## Icons

Always use `<mat-icon>` from Angular Material:
```html
<!-- Decorative -->
<mat-icon aria-hidden="true">home</mat-icon>

<!-- Interactive — must have aria-label -->
<button mat-icon-button [attr.aria-label]="'Delete item'">
  <mat-icon>delete</mat-icon>
</button>
```
