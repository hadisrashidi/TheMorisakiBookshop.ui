# Styling Reference

## Stack: Bootstrap + Angular Material + Custom Tokens

Component SCSS should be minimal. Global theming handles most styles.

## CSS Variables (Always Use These)

```scss
// Backgrounds
var(--color-bg-primary)      // main page background
var(--color-bg-secondary)    // cards, menus, elevated surfaces
var(--color-bg-tertiary)     // hover states, inputs

// Text
var(--color-fg-primary)      // main text
var(--color-fg-secondary)    // helper text
var(--color-fg-muted)        // disabled, placeholders

// Semantic
var(--color-primary)         // action color
var(--color-success)         // green
var(--color-danger)          // red
var(--color-warning)         // yellow
var(--color-info)            // blue

// Borders
var(--color-border)
var(--color-border-hover)

// Shadows
var(--shadow-xs) var(--shadow-sm) var(--shadow-md) var(--shadow-lg) var(--shadow-xl)

// Spacing (8px scale)
var(--space-1)  // 4px
var(--space-2)  // 8px
var(--space-3)  // 12px
var(--space-4)  // 16px
var(--space-6)  // 24px
var(--space-8)  // 32px

// Typography
var(--font-size-xs) through var(--font-size-3xl)
var(--font-weight-normal/medium/semibold/bold)

// Transitions
var(--transition-fast)   // 150ms
var(--transition-base)   // 200ms
var(--transition-slow)   // 300ms
```

## BEM Naming (Mandatory)

```scss
.user-card {                          // Block
  &__avatar { }                       // Element
  &__content { }                      // Element
  &--disabled { opacity: 0.6; }       // Modifier
  &.is-loading { }                    // State
}
```

## Component SCSS Pattern

```scss
:host {
  display: block;
}

.my-component {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  padding: var(--space-4);
  border-radius: 8px;
  transition: box-shadow var(--transition-base);

  &__title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-fg-primary);
  }

  &:hover {
    box-shadow: var(--shadow-md);
  }
}
```

## Hard Rules

- ❌ NEVER hardcode hex/rgb/colors — use CSS variables
- ❌ NEVER use `!important` (except rare Material overrides)
- ❌ NEVER nest more than 3 levels deep
- ❌ NEVER use `#id` selectors
- ❌ NEVER add dark mode files per component — variables handle it automatically
- ✅ ALWAYS add transitions when colors change
- ✅ ALWAYS use `@use`/`@forward` (not `@import`)
- ✅ ALWAYS respect reduced motion: `@media (prefers-reduced-motion: reduce)`

## RTL/LTR Direction-Aware Styles

```scss
[dir='rtl'] .my-component {
  margin-right: var(--space-4);
}
[dir='ltr'] .my-component {
  margin-left: var(--space-4);
}
```

## Theme System

- Light/dark/system via `data-theme` on `<html>`
- `tokens.scss` → base tokens
- `theme-light.scss` / `theme-dark.scss` → overrides
- Material bridged via `--mdc-theme-*` in overrides

## Material Component Customization

- 14 component categories styled in `public/global-styles/material/`
- Use `var(--color-*)` in Material overrides
- Use `.mat-mdc-*` selectors
