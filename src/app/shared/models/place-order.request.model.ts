import { PlaceOrderLineRequestModel } from './place-order-line.request.model';

export class PlaceOrderRequestModel {
  recipientName = '';
  /** 09xxxxxxxxx */
  recipientMobile = '';
  address = '';
  /** Empty or 10 digits. */
  postalCode = '';
  /** City of the address: decides which shipping methods are allowed. */
  city = '';
  shippingMethodId = 0;
  lines: PlaceOrderLineRequestModel[] = [];
}
