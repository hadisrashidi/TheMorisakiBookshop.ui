import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { DiscountPreviewResponseModel } from '../models/discount-preview.response.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountsApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Can the logged-in person use this code on books of this price, and how much does it take off?
   * The order is priced again by the server, this is only the preview of the cart.
   * @param code - The text typed by the customer
   * @param subtotal - Price of the books in the cart (toman)
   * @param showErrorAlert - false when the refusal must not show a toast (a silent re-check)
   */
  checkCode(code: string, subtotal: number, showErrorAlert = true): Promise<ApiResponse<DiscountPreviewResponseModel>> {
    const model = new ApiCallModel<{ code: string; subtotal: number }>();
    model.url = 'Discounts/CheckCode';
    model.data = { code, subtotal };
    model.showErrorAlert = showErrorAlert;
    return this.apiHelperService.post<DiscountPreviewResponseModel>(model);
  }
}
