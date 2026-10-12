import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { BookFilters } from '../models/book-filters.model';
import { BookSearchResult } from '../models/book-search-result.model';

export interface SearchFilters {
  genres?: string[];
  languages?: string[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | '';
  inStockOnly?: boolean;
  authorId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Search books by text with optional filters, sort and paging (one page per call).
   * @param query - Text matched against title, genre and specs
   * @param filters - Genres, languages, author, price range, sort, in-stock filter, page and page size
   */
  searchBooks(query: string, filters: SearchFilters = {}): Promise<ApiResponse<BookSearchResult>> {
    const model = new ApiCallModel();
    model.url = 'Books/SearchBooks';
    model.params = { q: query };

    if (filters.genres && filters.genres.length > 0) {
      model.params['genres'] = filters.genres;
    }
    if (filters.languages && filters.languages.length > 0) {
      model.params['languages'] = filters.languages;
    }
    if (filters.sort) {
      model.params['sort'] = filters.sort;
    }
    if (filters.inStockOnly) {
      model.params['inStockOnly'] = true;
    }
    if (filters.authorId !== undefined) {
      model.params['authorId'] = filters.authorId;
    }
    if (filters.minPrice !== undefined) {
      model.params['minPrice'] = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      model.params['maxPrice'] = filters.maxPrice;
    }
    if (filters.page !== undefined) {
      model.params['page'] = filters.page;
    }
    if (filters.pageSize !== undefined) {
      model.params['pageSize'] = filters.pageSize;
    }

    return this.apiHelperService.get<BookSearchResult>(model);
  }

  /** Get the values the search filters offer (genres, languages, price range) from the catalog. */
  getFilters(): Promise<ApiResponse<BookFilters>> {
    const model = new ApiCallModel();
    model.url = 'Books/GetSearchFilters';
    return this.apiHelperService.get<BookFilters>(model);
  }
}
