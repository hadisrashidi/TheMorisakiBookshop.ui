import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { LikedService } from '../../services/liked.service';

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

  search() {
    const query = this.searchQuery.trim();
    if (!query) {
      return;
    }
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
