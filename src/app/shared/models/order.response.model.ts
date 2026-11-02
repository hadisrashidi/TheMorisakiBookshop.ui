import { OrderHistoryResponseModel } from './order-history.response.model';
import { OrderLineResponseModel } from './order-line.response.model';
import { OrderStepModel } from './order-step.model';

export class OrderResponseModel {
  id = 0;
  /** PendingPayment | Paid | Packed | Shipped | Delivered | Cancelled */
  status = '';
  subtotal = 0;
  shippingCost = 0;
  /** Shipping method at order time; empty for older orders. */
  shippingMethodName = '';
  total = 0;
  recipientName = '';
  recipientMobile = '';
  address = '';
  postalCode = '';
  trackingCode = '';
  /** UTC time sent by the API, e.g. 2026-10-24T08:15:00. */
  createdAt = '';
  lines: OrderLineResponseModel[] = [];
  /** When the order got each status, oldest first. */
  history: OrderHistoryResponseModel[] = [];

  // Not sent by the API: OrdersService fills them in after loading, so templates stay simple.
  /** Jalali date text, e.g. 1405/08/02. */
  date = '';
  /** Persian text of the status. */
  statusLabel = '';
  /** Total number of books (sum of the line quantities). */
  itemsCount = 0;
  /** The tracking timeline. */
  steps: OrderStepModel[] = [];
  /** The carrier's tracking page for this order, or empty when there is none. */
  trackingUrl = '';
}
