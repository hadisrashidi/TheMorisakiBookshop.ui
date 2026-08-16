import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
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

  constructor(private http: HttpClient) { }

  searchBooks(query: string, filters: SearchFilters = {}): Observable<Book[]> {
    const apiUrl = environment.apiUrl + '/Books/SearchBooks';

    let params = new HttpParams().set('q', query);
    for (const genre of filters.genres ?? []) {
      params = params.append('genres', genre);
    }
    for (const language of filters.languages ?? []) {
      params = params.append('languages', language);
    }
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }
    if (filters.inStockOnly) {
      params = params.set('inStockOnly', 'true');
    }

    return this.http.get<Book[]>(apiUrl, { params });
  }
}
