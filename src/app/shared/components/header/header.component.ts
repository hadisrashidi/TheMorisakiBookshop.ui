import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { LikedService } from '../../services/liked.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

const SEARCH_DEBOUNCE_MS = 400;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private router = inject(Router);
  private cartService = inject(CartService);
  private likedService = inject(LikedService);
  auth = inject(AuthService);
  private toast = inject(ToastService);
  private host = inject(ElementRef<HTMLElement>);

  searchQuery = '';
  cartCount = this.cartService.totalCount;
  likedCount = this.likedService.count;

  // Home, Book Detail, and Search Results keep the search field and the
  // category nav row; every other page drops both for a simpler header.
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  showCategoryNav = computed(() => {
    const url = this.currentUrl();
    return url === '/' || url.startsWith('/books/') || url.startsWith('/search');
  });

  isLikedPage = computed(() => this.currentUrl().startsWith('/liked'));
  isCartPage = computed(() => this.currentUrl().startsWith('/cart'));
  isProfilePage = computed(() => this.currentUrl().startsWith('/profile'));

  // Signed out, the person icon is a plain link to login. Signed in, it
  // opens a small account menu instead.
  accountMenuOpen = signal(false);

  toggleAccountMenu() {
    this.accountMenuOpen.update(v => !v);
  }

  closeAccountMenu() {
    this.accountMenuOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.closeAccountMenu();
    this.toast.info('از حساب خود خارج شدید.');
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.accountMenuOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.closeAccountMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeAccountMenu();
  }

  // Typing searches on its own after a short pause; Enter just skips the
  // wait. Clearing the box searches for "" — which the API treats as
  // "no query", so the page falls back to the full catalogue.
  private typed$ = new Subject<string>();

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.typed$
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(query => this.runSearch(query));

    // Keep the box in step with the URL, so arriving via a category link
    // or the browser's back button shows the query actually in effect.
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(() => {
        const q = this.router.parseUrl(this.router.url).queryParams['q'] ?? '';
        if (q !== this.searchQuery) {
          this.searchQuery = q;
        }
      });
  }

  onSearchInput(value: string) {
    this.searchQuery = value;
    this.typed$.next(value.trim());
  }

  search() {
    this.runSearch(this.searchQuery.trim());
  }

  private runSearch(query: string) {
    this.router.navigate(['/search'], {
      queryParams: query ? { q: query } : {}
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
