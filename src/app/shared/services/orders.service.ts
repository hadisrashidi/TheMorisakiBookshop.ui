import { PLATFORM_ID, Injectable, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiResponse } from '@core/models/api/api.response.model';
import { OrderResponseModel } from '../models/order.response.model';
import { PlaceOrderRequestModel } from '../models/place-order.request.model';
import { formatJalali, gregorianToJalali } from '../utils/jalali';
import { orderStatusLabel } from '../utils/order-status';
import { AuthService } from './auth.service';
import { OrdersApiService } from './orders.api.service';

// Orders of the logged-in person, kept in memory for the orders page and the profile summary.
// The orders live on the server; nothing is stored in the browser.
const OLD_FAKE_ORDERS_KEY = 'morisaki-orders';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly ordersApiService = inject(OrdersApiService);
  private readonly authService = inject(AuthService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly ordersSignal = signal<OrderResponseModel[]>([]);

  readonly orders = this.ordersSignal.asReadonly();
  readonly count = computed(() => this.ordersSignal().length);

  /** Newest first, capped: for the profile page's summary table. */
  readonly recent = computed(() => this.ordersSignal().slice(0, 5));

  constructor() {
    // The demo orders of the old localStorage checkout are not real orders.
    if (this.isBrowser) {
      localStorage.removeItem(OLD_FAKE_ORDERS_KEY);
    }
  }

  /** Loads the orders from the API; without a login the list is empty. */
  async load(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      this.ordersSignal.set([]);
      return;
    }

    const result = await this.ordersApiService.getMyOrders();

    if (!result.isSuccess || !result.data) {
      return;
    }

    this.ordersSignal.set(result.data.map(order => this.prepare(order)));
  }

  /** Sends the order; on success the list is reloaded so the new order shows up. */
  async placeOrder(request: PlaceOrderRequestModel): Promise<ApiResponse<number>> {
    const result = await this.ordersApiService.placeOrder(request);

    if (result.isSuccess) {
      await this.load();
    }

    return result;
  }

  private prepare(order: OrderResponseModel): OrderResponseModel {
    // The API sends UTC without a "Z"; without it the browser would read the time as local time.
    const utcText = order.createdAt.endsWith('Z') ? order.createdAt : order.createdAt + 'Z';

    order.date = formatJalali(gregorianToJalali(new Date(utcText)));
    order.statusLabel = orderStatusLabel(order.status);
    order.itemsCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);

    return order;
  }
}
