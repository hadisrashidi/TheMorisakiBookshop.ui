# HTML Template Integration Reference

For projects where a bought HTML template is used instead of a Figma design.

## Loading Template JS

### Option 1: angular.json (Preferred)
```json
"scripts": [
  "src/assets/template/js/jquery.min.js",
  "src/assets/template/js/plugins.js",
  "src/assets/template/js/main.js"
]
```

### Option 2: index.html (Fallback)
Use when a script won't load correctly via angular.json (usually scripts that self-execute on load or depend on DOM being ready):
```html
<head>
  <link rel="stylesheet" href="assets/template/css/main.css" />
</head>
<body>
  ...
  <script src="assets/template/js/problematic-script.js"></script>
</body>
```

## jQuery / JS Interop in Components

When a template feature (menu, animation, tab, slider) has no Angular alternative and must be driven by jQuery or vanilla JS:

```typescript
declare const $: any;  // always at top of file

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  ...
})
export class LayoutShellComponent implements AfterViewInit {

  // 6. Lifecycle — use AfterViewInit, never OnInit, for DOM-dependent JS
  ngAfterViewInit(): void {
    $('#sidebar').niceScroll();
    $('.dropdown-toggle').dropdown();
  }
}
```

**Rules:**
- Always `declare const $: any` at the top of the file — never import jQuery as a module
- Always call template JS in `ngAfterViewInit()` — the DOM must exist first
- Never call jQuery/JS in `ngOnInit()` — DOM is not ready
- Keep jQuery calls isolated to the component that owns that DOM section

## When to Replace vs Keep Template JS

| Situation | Decision |
|-----------|----------|
| Template uses JS tabs / accordions | Replace with `mat-tab-group` / `mat-expansion-panel` |
| Template uses JS modals / dialogs | Replace with `MatDialog` |
| Template uses JS form validation | Use Angular template-driven forms |
| Template uses JS dropdowns (simple) | Replace with `mat-select` or `CommonDropdown` component |
| Template uses JS menu with complex animations | Keep JS, call via `ngAfterViewInit` |
| Template uses a JS-only chart/slider/animation lib with no Angular equivalent | Keep JS, call via `ngAfterViewInit` |

**Rule of thumb**: Replace if Angular Material has an equivalent. Keep if the animation or behavior is complex and unique to the template.

## File Organization

Place template assets under:
```
src/assets/template/
  css/
  js/
  fonts/
  images/
```

Never mix template SCSS into the project's `src/styles/` — keep it isolated in assets.
Template CSS loaded via `angular.json styles[]` or `index.html` only.

## Avoiding Conflicts

- Template JS may conflict with Angular's change detection — if a JS plugin manipulates the DOM directly, wrap it carefully and avoid touching Angular-managed elements
- If a jQuery plugin reinitializes on route change, call it in `ngAfterViewInit` and destroy in `ngOnDestroy`:

```typescript
declare const $: any;

export class MyComponent implements AfterViewInit, OnDestroy {
  ngAfterViewInit(): void {
    $('#my-plugin').pluginInit();
  }

  ngOnDestroy(): void {
    $('#my-plugin').pluginDestroy?.();
  }
}
```
