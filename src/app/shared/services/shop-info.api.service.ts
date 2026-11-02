import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { ShopInfoResponseModel } from '../models/shop-info.response.model';

@Injectable({
  providedIn: 'root'
})
export class ShopInfoApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /** Name, phone, address and social links of the shop. A failure shows no toast (the footer keeps its fallback). */
  getShopInfo(): Promise<ApiResponse<ShopInfoResponseModel>> {
    const model = new ApiCallModel();
    model.url = 'Settings/GetShopInfo';
    model.showErrorAlert = false;
    return this.apiHelperService.get<ShopInfoResponseModel>(model);
  }
}
