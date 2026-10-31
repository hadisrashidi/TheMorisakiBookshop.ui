import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { ShippingMethodResponseModel } from '../models/shipping-method.response.model';

@Injectable({
  providedIn: 'root'
})
export class ShippingApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * The active shipping methods.
   * @param subtotal - Price of the books in the cart: each method then answers what THIS cart pays (empty = normal price)
   * @param city - City of the address: Tehran-only methods are left out for other cities (empty = show every method)
   * @param showErrorAlert - false when a failure must not show a toast
   */
  getShippingMethods(subtotal: number | null, city: string, showErrorAlert = true): Promise<ApiResponse<ShippingMethodResponseModel[]>> {
    const model = new ApiCallModel();
    model.url = 'Shipping/GetShippingMethods';
    model.params = { subtotal: subtotal ?? '', city };
    model.showErrorAlert = showErrorAlert;
    return this.apiHelperService.get<ShippingMethodResponseModel[]>(model);
  }
}
