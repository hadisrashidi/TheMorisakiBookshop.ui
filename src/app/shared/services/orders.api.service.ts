import { inject, Injectable } from '@angular/core';
import { ApiCallModel } from '@core/models/api/api-call.model';
import { ApiResponse } from '@core/models/api/api.response.model';
import { ApiHelperService } from '@core/services/api/api-helper.service';
import { OrderResponseModel } from '../models/order.response.model';
import { PlaceOrderRequestModel } from '../models/place-order.request.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersApiService {
  private readonly apiHelperService = inject(ApiHelperService);

  /**
   * Place an order for the logged-in person. Stock is checked and taken in one step; prices come from the server.
   * @param data - Recipient, address and the books with quantities
   * @returns The new order number
   */
  placeOrder(data: PlaceOrderRequestModel): Promise<ApiResponse<number>> {
    const model = new ApiCallModel<PlaceOrderRequestModel>();
    model.url = 'Orders/PlaceOrder';
    model.data = data;
    return this.apiHelperService.post<number>(model);
  }

  /** The orders of the logged-in person, newest first. */
  getMyOrders(): Promise<ApiResponse<OrderResponseModel[]>> {
    const model = new ApiCallModel();
    model.url = 'Orders/GetMyOrders';
    return this.apiHelperService.get<OrderResponseModel[]>(model);
  }
}
