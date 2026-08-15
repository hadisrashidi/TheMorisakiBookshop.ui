import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Author } from '../../home/models/author.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorsApiService {

  constructor(private http: HttpClient) { }

  getAuthorById(id: number): Observable<Author> {
    const apiUrl = environment.apiUrl + `/Authors/GetAuthorById?id=${id}`;
    return this.http.get<Author>(apiUrl);
  }

  getSimilarAuthors(id: number): Observable<Author[]> {
    const apiUrl = environment.apiUrl + `/Authors/GetSimilarAuthors?id=${id}`;
    return this.http.get<Author[]>(apiUrl);
  }
}
