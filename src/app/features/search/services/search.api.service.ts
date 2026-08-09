import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Book } from '../../home/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class SearchApiService {

  constructor(private http: HttpClient) { }

  searchBooks(query: string): Observable<Book[]> {
    const apiUrl = environment.apiUrl + '/Books/SearchBooks';
    return this.http.get<Book[]>(apiUrl, { params: { q: query } });
  }
}
