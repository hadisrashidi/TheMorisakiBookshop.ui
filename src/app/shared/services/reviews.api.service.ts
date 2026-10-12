import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewsApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Get the reviews of one book.
   * @param bookId - Book id
   */
  getByBookId(bookId: number): Promise<ApiResponse<Review[]>> {
    const model = new ApiCallModel();
    model.url = 'Reviews/GetByBookId';
    model.params = { bookId };
    return this.apiHelperService.get<Review[]>(model);
  }

  /**
   * Get the reviews of all books of one author.
   * @param authorId - Author id
   */
  getByAuthorId(authorId: number): Promise<ApiResponse<Review[]>> {
    const model = new ApiCallModel();
    model.url = 'Reviews/GetByAuthorId';
    model.params = { authorId };
    return this.apiHelperService.get<Review[]>(model);
  }
}
