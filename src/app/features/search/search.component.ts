import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Book } from '../home/models/book.model';
import { SearchApiService, SearchFilters } from './services/search.api.service';
import { HomeApiService } from '../home/services/home.api.service';
import { CartService } from '../../shared/services/cart.service';
import { LikedService } from '../../shared/services/liked.service';
import { ToastService } from '../../shared/services/toast.service';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';

const PAGE_SIZE = 9;

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImageFallbackDirective],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private searchApiService = inject(SearchApiService);
  private homeApiService = inject(HomeApiService);
  private cartService = inject(CartService);
  likedService = inject(LikedService);
  private toast = inject(ToastService);

  private authorNames = signal(new Map<number, string>());

  // Filled from the API (Books/GetSearchFilters) so the lists always match the catalog.
  availableGenres = signal<string[]>([]);
  availableLanguages = signal<string[]>([]);
  authorOptions = signal<{ id: number; name: string }[]>([]);

  query = signal('');
  results = signal<Book[]>([]);
  loading = signal(false);

  selectedGenres = signal<string[]>([]);
  selectedLanguages = signal<string[]>([]);
  selectedAuthorId = signal<number | null>(null);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  stockFilter = signal<'all' | 'inStock'>('all');
  sort = signal<'price_asc' | 'price_desc' | 'newest' | ''>('');

  // Repeats skeleton cards while a search is in flight.
  readonly skeletonCards = Array.from({ length: 6 });

  // results() holds only the current page; totalCount is all matches (from the API).
  page = signal(1);
  totalCount = signal(0);
  pageCount = computed(() => Math.max(1, Math.ceil(this.totalCount() / PAGE_SIZE)));
  pageNumbers = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i + 1));

  hasActiveFilters = computed(() =>
    this.selectedGenres().length > 0 ||
    this.selectedLanguages().length > 0 ||
    this.selectedAuthorId() !== null ||
    this.minPrice() !== null ||
    this.maxPrice() !== null ||
    this.stockFilter() !== 'all' ||
    this.sort() !== ''
  );

  ngOnInit(): void {
    this.loadFilters();
    this.loadAuthors();

    this.route.queryParamMap.subscribe(params => {
      this.query.set(params.get('q') ?? '');
      this.search();
    });
  }

  authorName(authorId: number | undefined): string {
    return authorId !== undefined ? this.authorNames().get(authorId) ?? '' : '';
  }

  async loadFilters(): Promise<void> {
    const result = await this.searchApiService.getFilters();
    if (!result.isSuccess || !result.data) {
      return;
    }

    this.availableGenres.set(result.data.genres);
    this.availableLanguages.set(result.data.languages);
  }

  async loadAuthors(): Promise<void> {
    const result = await this.homeApiService.getAuthors();
    if (!result.isSuccess || !result.data) {
      return;
    }

    const map = new Map<number, string>();
    for (const author of result.data) {
      if (author.id !== undefined) {
        map.set(author.id, author.name ?? '');
      }
    }
    this.authorNames.set(map);
    this.authorOptions.set(result.data
      .filter(author => author.id !== undefined)
      .map(author => ({ id: author.id as number, name: author.name ?? '' })));
  }

  // A new query or filter always starts on page 1.
  async search(): Promise<void> {
    this.page.set(1);
    await this.loadPage();
  }

  async loadPage(): Promise<void> {
    this.loading.set(true);

    const filters: SearchFilters = {
      genres: this.selectedGenres(),
      languages: this.selectedLanguages(),
      sort: this.sort(),
      authorId: this.selectedAuthorId() ?? undefined,
      minPrice: this.minPrice() ?? undefined,
      maxPrice: this.maxPrice() ?? undefined,
      inStockOnly: this.stockFilter() === 'inStock',
      page: this.page(),
      pageSize: PAGE_SIZE
    };

    const result = await this.searchApiService.searchBooks(this.query(), filters);
    if (result.isSuccess && result.data) {
      this.results.set(result.data.items);
      this.totalCount.set(result.data.totalCount);
    } else {
      this.results.set([]);
      this.totalCount.set(0);
    }
    this.loading.set(false);
  }

  toggleGenre(genre: string) {
    this.selectedGenres.update(list =>
      list.includes(genre) ? list.filter(g => g !== genre) : [...list, genre]
    );
    this.search();
  }

  toggleLanguage(language: string) {
    this.selectedLanguages.update(list =>
      list.includes(language) ? list.filter(l => l !== language) : [...list, language]
    );
    this.search();
  }

  setAuthor(value: string) {
    this.selectedAuthorId.set(value === '' ? null : Number(value));
    this.search();
  }

  setPriceRange(min: string, max: string) {
    this.minPrice.set(min === '' ? null : Number(min));
    this.maxPrice.set(max === '' ? null : Number(max));
    this.search();
  }

  setStockFilter(value: 'all' | 'inStock') {
    this.stockFilter.set(value);
    this.search();
  }

  setSort(sort: 'price_asc' | 'price_desc' | 'newest' | '') {
    this.sort.set(sort);
    this.search();
  }

  clearFilters() {
    this.selectedGenres.set([]);
    this.selectedLanguages.set([]);
    this.selectedAuthorId.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.stockFilter.set('all');
    this.sort.set('');
    this.search();
  }

  goToPage(page: number) {
    this.page.set(page);
    this.loadPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart(event: Event, book: Book) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(book);
    this.toast.success('به سبد خرید اضافه شد.', { label: 'مشاهده سبد', route: '/cart' });
  }

  toggleLiked(event: Event, book: Book) {
    event.preventDefault();
    event.stopPropagation();
    this.likedService.toggle(book, this.authorName(book.authorId));
  }
}
