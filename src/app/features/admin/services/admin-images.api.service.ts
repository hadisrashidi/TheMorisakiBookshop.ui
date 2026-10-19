import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';

export type ImageFolder = 'covers' | 'authors';

@Injectable({
  providedIn: 'root'
})
export class AdminImagesApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Upload a jpg / png / webp image (at most 2 MB).
   * @param file - The chosen file
   * @param folder - 'covers' for books, 'authors' for author portraits
   * @returns The path to store in the book / author "image" field, e.g. /uploads/covers/abc.jpg
   */
  uploadImage(file: File, folder: ImageFolder): Promise<ApiResponse<string>> {
    const body = new FormData();
    body.append('file', file);

    const model = new ApiCallModel<FormData>();
    model.url = 'ImagesManagement/UploadImage';
    model.params = { folder };
    model.data = body;
    return this.apiHelperService.post<string>(model);
  }
}
