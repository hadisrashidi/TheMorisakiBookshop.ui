import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { Author } from '../models/author.model';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class HomeApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /** Get the featured (discounted, in stock) books. */
  getFeaturedBooks(): Promise<ApiResponse<Book[]>> {
    const model = new ApiCallModel();
    model.url = 'Books/GetFeaturedBooks';
    return this.apiHelperService.get<Book[]>(model);
  }

  /** Get the newest books. */
  getNewBooks(): Promise<ApiResponse<Book[]>> {
    const model = new ApiCallModel();
    model.url = 'Books/GetNewBooks';
    return this.apiHelperService.get<Book[]>(model);
  }

  /** Get all authors. */
  getAuthors(): Promise<ApiResponse<Author[]>> {
    const model = new ApiCallModel();
    model.url = 'Authors/GetAllAuthors';
    return this.apiHelperService.get<Author[]>(model);
  }
}
