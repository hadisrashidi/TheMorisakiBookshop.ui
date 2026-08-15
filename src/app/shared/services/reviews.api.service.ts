import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewsApiService {

  constructor(private http: HttpClient) { }

  getByBookId(bookId: number): Observable<Review[]> {
    const apiUrl = environment.apiUrl + `/Reviews/GetByBookId?bookId=${bookId}`;
    return this.http.get<Review[]>(apiUrl);
  }

  getByAuthorId(authorId: number): Observable<Review[]> {
    const apiUrl = environment.apiUrl + `/Reviews/GetByAuthorId?authorId=${authorId}`;
    return this.http.get<Review[]>(apiUrl);
  }
}
