import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { filter } from 'rxjs/operators';

// Pages are lazy-loaded, so switching route fetches a chunk. Without this
// the header just sits there and the app looks frozen on a slow link.
@Component({
  selector: 'app-route-progress',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="bar" *ngIf="active()"></div>`,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      inset-inline: 0;
      height: 3px;
      z-index: 200;
      pointer-events: none;
    }

    .bar {
      height: 100%;
      width: 100%;
      transform-origin: 0 50%;
      background: linear-gradient(90deg,
        var(--color-accent) 0%,
        var(--color-accent-400) 50%,
        var(--color-accent) 100%);
      animation: route-progress 0.9s ease-in-out infinite;
    }

    @keyframes route-progress {
      0% { transform: scaleX(0); opacity: 1; }
      70% { transform: scaleX(0.85); opacity: 1; }
      100% { transform: scaleX(1); opacity: 0.4; }
    }

    @media (prefers-reduced-motion: reduce) {
      .bar { animation: none; opacity: 0.7; }
    }
  `]
})
export class RouteProgressComponent {

  private router = inject(Router);
  active = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter(e =>
          e instanceof NavigationStart ||
          e instanceof NavigationEnd ||
          e instanceof NavigationCancel ||
          e instanceof NavigationError
        ),
        takeUntilDestroyed(inject(DestroyRef))
      )
      .subscribe(e => this.active.set(e instanceof NavigationStart));
  }
}
