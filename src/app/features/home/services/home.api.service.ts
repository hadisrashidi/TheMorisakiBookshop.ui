import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Author } from '../models/author.model';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class HomeApiService {

  constructor(private http: HttpClient) { }
  
  getBooks(): Observable<Book[]> {
    const apiUrl = environment.apiUrl + '/Books/GetAllBooks';
    return this.http.get<Book[]>(apiUrl);
  }
   getNewBooks(): Observable<Book[]> {
    const apiUrl = environment.apiUrl + '/Books/GetNewBooks';
    return this.http.get<Book[]>(apiUrl);
  }
    
  getAuthors(): Observable<Author[]> {
    const apiUrl = environment.apiUrl + '/Authors/GetAllAuthors';
    return this.http.get<Author[]>(apiUrl);
  }
}