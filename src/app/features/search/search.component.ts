import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Book } from '../home/models/book.model';
import { SearchApiService, SearchFilters } from './services/search.api.service';
import { HomeApiService } from '../home/services/home.api.service';

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

  private authorNames = new Map<number, string>();

  // Real genres/languages in the current catalog — there's no facet
  // endpoint yet, so this list is maintained by hand alongside the seed
  // data rather than invented to match the original design mock.
  readonly availableGenres = ['رمان', 'ادبیات داستانی', 'کلاسیک', 'جنایی', 'داستان کوتاه'];
  readonly availableLanguages = ['فارسی', 'انگلیسی'];

  query = '';
  results: Book[] = [];
  loading = false;

  selectedGenres = new Set<string>();
  selectedLanguages = new Set<string>();
  // Presentational only — every book in the catalog is in stock, so this
  // toggle has nothing real to filter against yet.
  stockFilter: 'all' | 'inStock' = 'all';
  sort: 'price_asc' | 'newest' | '' = '';

  page = signal(1);
  pageCount = computed(() => Math.max(1, Math.ceil(this.results.length / PAGE_SIZE)));
  pagedResults = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.results.slice(start, start + PAGE_SIZE);
  });

  ngOnInit(): void {
    this.homeApiService.getAuthors().subscribe({
      next: (authors) => {
        for (const author of authors) {
          if (author.id !== undefined) {
            this.authorNames.set(author.id, author.name ?? '');
          }
        }
      },
      error: (err) => console.error('Error loading authors', err)
    });

    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q') ?? '';
      this.search();
    });
  }

  authorName(authorId: number | undefined): string {
    return authorId !== undefined ? this.authorNames.get(authorId) ?? '' : '';
  }

  search() {
    this.loading = true;
    this.page.set(1);

    const filters: SearchFilters = {
      genres: [...this.selectedGenres],
      languages: [...this.selectedLanguages],
      sort: this.sort
    };

    this.searchApiService.searchBooks(this.query, filters).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error searching books', err);
        this.loading = false;
      }
    });
  }

  toggleGenre(genre: string) {
    this.selectedGenres.has(genre) ? this.selectedGenres.delete(genre) : this.selectedGenres.add(genre);
    this.search();
  }

  toggleLanguage(language: string) {
    this.selectedLanguages.has(language) ? this.selectedLanguages.delete(language) : this.selectedLanguages.add(language);
    this.search();
  }

  setSort(sort: 'price_asc' | 'newest' | '') {
    this.sort = sort;
    this.search();
  }

  clearFilters() {
    this.selectedGenres.clear();
    this.selectedLanguages.clear();
    this.stockFilter = 'all';
    this.sort = '';
    this.search();
  }

  goToPage(page: number) {
    this.page.set(page);
  }

  goToBookDetail(id: number | undefined) {
    this.router.navigate(['/books', id]);
  }

  pageNumbers(): number[] {
    return Array.from({ length: this.pageCount() }, (_, i) => i + 1);
  }
}
