import { Directive, ElementRef, HostListener, inject } from '@angular/core';

const FALLBACK_SRC = '/cover-placeholder.png';

// Every content image in the app carries the .washed class, so this hooks
// them all without touching a single template. If a cover or portrait
// can't be fetched — an unreachable host, a dead URL in the seed data —
// the slot shows local placeholder art instead of the browser's broken
// image icon.
@Directive({
  selector: 'img.washed',
  standalone: true
})
export class ImageFallbackDirective {

  private el = inject(ElementRef<HTMLImageElement>);

  @HostListener('error')
  onError() {
    const img = this.el.nativeElement;
    // Guard against a loop if the placeholder itself ever goes missing.
    if (img.src.endsWith(FALLBACK_SRC)) {
      return;
    }
    img.src = FALLBACK_SRC;
  }
}
