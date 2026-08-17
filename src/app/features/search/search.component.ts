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

const PAGE_SIZE = 9;

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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

  // Real genres/languages in the current catalog — there's no facet
  // endpoint yet, so this list is maintained by hand alongside the seed
  // data rather than invented to match the original design mock.
  readonly availableGenres = ['رمان', 'ادبیات داستانی', 'کلاسیک', 'جنایی', 'داستان کوتاه'];
  readonly availableLanguages = ['فارسی', 'انگلیسی'];

  query = signal('');
  results = signal<Book[]>([]);
  loading = signal(false);

  selectedGenres = signal<string[]>([]);
  selectedLanguages = signal<string[]>([]);
  stockFilter = signal<'all' | 'inStock'>('all');
  sort = signal<'price_asc' | 'price_desc' | 'newest' | ''>('');

  // Repeats skeleton cards while a search is in flight.
  readonly skeletonCards = Array.from({ length: 6 });

  page = signal(1);
  pageCount = computed(() => Math.max(1, Math.ceil(this.results().length / PAGE_SIZE)));
  pagedResults = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.results().slice(start, start + PAGE_SIZE);
  });
  pageNumbers = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i + 1));

  hasActiveFilters = computed(() =>
    this.selectedGenres().length > 0 ||
    this.selectedLanguages().length > 0 ||
    this.stockFilter() !== 'all' ||
    this.sort() !== ''
  );

  ngOnInit(): void {
    this.homeApiService.getAuthors().subscribe({
      next: (authors) => {
        const map = new Map<number, string>();
        for (const author of authors) {
          if (author.id !== undefined) {
            map.set(author.id, author.name ?? '');
          }
        }
        this.authorNames.set(map);
      },
      error: (err) => console.error('Error loading authors', err)
    });

    this.route.queryParamMap.subscribe(params => {
      this.query.set(params.get('q') ?? '');
      this.search();
    });
  }

  authorName(authorId: number | undefined): string {
    return authorId !== undefined ? this.authorNames().get(authorId) ?? '' : '';
  }

  search() {
    this.loading.set(true);
    this.page.set(1);

    const filters: SearchFilters = {
      genres: this.selectedGenres(),
      languages: this.selectedLanguages(),
      sort: this.sort(),
      inStockOnly: this.stockFilter() === 'inStock'
    };

    this.searchApiService.searchBooks(this.query(), filters).subscribe({
      next: (data) => {
        this.results.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error searching books', err);
        this.results.set([]);
        this.loading.set(false);
      }
    });
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
    this.stockFilter.set('all');
    this.sort.set('');
    this.search();
  }

  goToPage(page: number) {
    this.page.set(page);
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
    const wasLiked = book.id !== undefined && this.likedService.isLiked(book.id);
    this.likedService.toggle(book, this.authorName(book.authorId));
    wasLiked
      ? this.toast.info('از علاقه‌مندی‌ها حذف شد.')
      : this.toast.success('به علاقه‌مندی‌ها اضافه شد.', { label: 'مشاهده', route: '/liked' });
  }
}
