import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { Book } from '../../home/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Get one book with its specs.
   * @param id - Book id
   */
  getBookById(id: number): Promise<ApiResponse<Book>> {
    const model = new ApiCallModel();
    model.url = 'Books/GetBookById';
    model.params = { id };
    return this.apiHelperService.get<Book>(model);
  }

  /**
   * Get books related to a book (same author first).
   * @param id - Book id
   */
  getRelatedBooks(id: number): Promise<ApiResponse<Book[]>> {
    const model = new ApiCallModel();
    model.url = 'Books/GetRelatedBooks';
    model.params = { id };
    return this.apiHelperService.get<Book[]>(model);
  }

  /**
   * Get books similar to a book (other authors, same genre first).
   * @param id - Book id
   */
  getSimilarBooks(id: number): Promise<ApiResponse<Book[]>> {
    const model = new ApiCallModel();
    model.url = 'Books/GetSimilarBooks';
    model.params = { id };
    return this.apiHelperService.get<Book[]>(model);
  }

  /**
   * Get all books of one author.
   * @param authorId - Author id
   */
  getBooksByAuthor(authorId: number): Promise<ApiResponse<Book[]>> {
    const model = new ApiCallModel();
    model.url = 'Books/GetBooksByAuthor';
    model.params = { authorId };
    return this.apiHelperService.get<Book[]>(model);
  }
}
