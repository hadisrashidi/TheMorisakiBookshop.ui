import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { Book } from '../../home/models/book.model';

export interface SearchFilters {
  genres?: string[];
  languages?: string[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | '';
  inStockOnly?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SearchApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Search books by text with optional filters and sort.
   * @param query - Text matched against title, genre and specs
   * @param filters - Genres, languages, sort and in-stock filter
   */
  searchBooks(query: string, filters: SearchFilters = {}): Promise<ApiResponse<Book[]>> {
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

    return this.apiHelperService.get<Book[]>(model);
  }
}
