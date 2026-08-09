import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Book } from '../../home/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksApiService {

  constructor(private http: HttpClient) { }
  
  getBookById(id: number): Observable<Book> {
  const apiUrl = environment.apiUrl + `/Books/GetBookById?id=${id}`;
  return this.http.get<Book>(apiUrl);
}

  getRelatedBooks(id: number): Observable<Book[]> {
    const apiUrl = environment.apiUrl + `/Books/GetRelatedBooks?id=${id}`;
    return this.http.get<Book[]>(apiUrl);
  }

  getSimilarBooks(id: number): Observable<Book[]> {
    const apiUrl = environment.apiUrl + `/Books/GetSimilarBooks?id=${id}`;
    return this.http.get<Book[]>(apiUrl);
  }

}