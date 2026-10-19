import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { Author } from '../../home/models/author.model';
import { AuthorRequestModel } from '../models/author.request.model';

/** Reading authors uses the public HomeApiService / AuthorsApiService; this one only writes. */
@Injectable({
  providedIn: 'root'
})
export class AdminAuthorsApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Add an author.
   * @param data - Name, image path, bio and genre
   */
  createAuthor(data: AuthorRequestModel): Promise<ApiResponse<Author>> {
    const model = new ApiCallModel<AuthorRequestModel>();
    model.url = 'AuthorsManagement/CreateAuthor';
    model.data = data;
    return this.apiHelperService.post<Author>(model);
  }

  /**
   * Change an author.
   * @param id - Author id
   * @param data - Name, image path, bio and genre
   */
  updateAuthor(id: number, data: AuthorRequestModel): Promise<ApiResponse<Author>> {
    const model = new ApiCallModel<AuthorRequestModel>();
    model.url = 'AuthorsManagement/UpdateAuthor';
    model.params = { id };
    model.data = data;
    return this.apiHelperService.post<Author>(model);
  }
}
