import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { Book } from '../../home/models/book.model';
import { BookSearchResult } from '../../search/models/book-search-result.model';
import { BookRequestModel } from '../models/book.request.model';
import { SetBookActiveRequestModel } from '../models/set-book-active.request.model';
import { UpdateStockRequestModel } from '../models/update-stock.request.model';

@Injectable({
  providedIn: 'root'
})
export class AdminBooksApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * One page of books for the admin list; hidden books are included.
   * @param query - Text matched against title, genre and specs (empty = all books)
   * @param page - Page number, from 1
   * @param pageSize - Books per page (the API allows at most 50)
   */
  searchBooks(query: string, page: number, pageSize: number): Promise<ApiResponse<BookSearchResult>> {
    const model = new ApiCallModel();
    model.url = 'BooksManagement/SearchBooks';
    model.params = { q: query, page, pageSize };
    return this.apiHelperService.get<BookSearchResult>(model);
  }

  /**
   * Get one book with its specs, hidden or not.
   * @param id - Book id
   */
  getBookById(id: number): Promise<ApiResponse<Book>> {
    const model = new ApiCallModel();
    model.url = 'BooksManagement/GetBookById';
    model.params = { id };
    return this.apiHelperService.get<Book>(model);
  }

  /**
   * Add a book.
   * @param data - The book fields and its specs
   */
  createBook(data: BookRequestModel): Promise<ApiResponse<Book>> {
    const model = new ApiCallModel<BookRequestModel>();
    model.url = 'BooksManagement/CreateBook';
    model.data = data;
    return this.apiHelperService.post<Book>(model);
  }

  /**
   * Replace the fields and all specs of a book.
   * @param id - Book id
   * @param data - The book fields and its specs
   */
  updateBook(id: number, data: BookRequestModel): Promise<ApiResponse<Book>> {
    const model = new ApiCallModel<BookRequestModel>();
    model.url = 'BooksManagement/UpdateBook';
    model.params = { id };
    model.data = data;
    return this.apiHelperService.post<Book>(model);
  }

  /**
   * Change only the stock of a book.
   * @param id - Book id
   * @param data - The new stock
   */
  updateStock(id: number, data: UpdateStockRequestModel): Promise<ApiResponse<unknown>> {
    const model = new ApiCallModel<UpdateStockRequestModel>();
    model.url = 'BooksManagement/UpdateStock';
    model.params = { id };
    model.data = data;
    return this.apiHelperService.post<unknown>(model);
  }

  /**
   * Hide a book from the shop or show it again (books are never deleted).
   * @param id - Book id
   * @param data - isActive false = hidden
   */
  setBookActive(id: number, data: SetBookActiveRequestModel): Promise<ApiResponse<unknown>> {
    const model = new ApiCallModel<SetBookActiveRequestModel>();
    model.url = 'BooksManagement/SetBookActive';
    model.params = { id };
    model.data = data;
    return this.apiHelperService.post<unknown>(model);
  }
}
