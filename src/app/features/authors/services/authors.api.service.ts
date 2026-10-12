import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { Author } from '../../home/models/author.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorsApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Get one author.
   * @param id - Author id
   */
  getAuthorById(id: number): Promise<ApiResponse<Author>> {
    const model = new ApiCallModel();
    model.url = 'Authors/GetAuthorById';
    model.params = { id };
    return this.apiHelperService.get<Author>(model);
  }

  /**
   * Get authors similar to an author.
   * @param id - Author id
   */
  getSimilarAuthors(id: number): Promise<ApiResponse<Author[]>> {
    const model = new ApiCallModel();
    model.url = 'Authors/GetSimilarAuthors';
    model.params = { id };
    return this.apiHelperService.get<Author[]>(model);
  }
}
