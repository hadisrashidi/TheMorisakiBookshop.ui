# State Management Reference

## Decision: Which Level to Use?

| Need | Use |
|------|-----|
| Local UI state (toggle, filter, loading) | Signals |
| Async streams, debounce, caching | RxJS Service |
| Cross-feature sharing | RxJS Service |
| Complex app, audit trail, time-travel | NgRx |

## Level 1: Signals (Default)

```typescript
export class MyComponent {
  items = signal<ItemModel[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  filtered = computed(() =>
    this.items().filter(i => i.name.includes(this.searchTerm()))
  );
}
```

## Level 2: RxJS Service (Shared State)

```typescript
@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private state$ = new BehaviorSubject<{ list: ProductModel[]; loading: boolean }>({
    list: [],
    loading: false,
  });

  readonly list$ = this.state$.pipe(map(s => s.list));
  readonly loading$ = this.state$.pipe(map(s => s.loading));

  setLoading(loading: boolean): void {
    this.state$.next({ ...this.state$.getValue(), loading });
  }
}
```

## Rules

- Keep components dumb — delegate state to services/stores
- Expose state as readonly (`asReadonly()`, `Observable`)
- No BehaviorSubject in API services — state and API calls are separate concerns
- Cross-feature state belongs in `src/app/shared/`
