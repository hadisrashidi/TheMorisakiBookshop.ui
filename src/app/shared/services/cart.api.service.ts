import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { CartItemResponseModel } from '../models/cart-item.response.model';
import { MergeCartRequestModel } from '../models/merge-cart.request.model';
import { SetCartQuantityRequestModel } from '../models/set-cart-quantity.request.model';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /** The saved cart of the logged-in person, with current prices and stock. */
  getMyCart(): Promise<ApiResponse<CartItemResponseModel[]>> {
    const model = new ApiCallModel();
    model.url = 'Cart/GetMyCart';
    return this.apiHelperService.get<CartItemResponseModel[]>(model);
  }

  /** Sets how many copies of one book are in the cart; 0 removes it. */
  setQuantity(data: SetCartQuantityRequestModel): Promise<ApiResponse<void>> {
    const model = new ApiCallModel<SetCartQuantityRequestModel>();
    model.url = 'Cart/SetQuantity';
    model.data = data;
    return this.apiHelperService.post<void>(model);
  }

  /** Adds the guest cart of this browser to the saved cart (right after login). */
  mergeCart(data: MergeCartRequestModel): Promise<ApiResponse<void>> {
    const model = new ApiCallModel<MergeCartRequestModel>();
    model.url = 'Cart/MergeCart';
    model.data = data;
    return this.apiHelperService.post<void>(model);
  }

  clearCart(): Promise<ApiResponse<void>> {
    const model = new ApiCallModel();
    model.url = 'Cart/ClearCart';
    return this.apiHelperService.post<void>(model);
  }
}
