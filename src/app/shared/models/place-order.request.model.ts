import { PlaceOrderLineRequestModel } from './place-order-line.request.model';

export class PlaceOrderRequestModel {
  recipientName = '';
  /** 09xxxxxxxxx */
  recipientMobile = '';
  address = '';
  /** Empty or 10 digits. */
  postalCode = '';
  lines: PlaceOrderLineRequestModel[] = [];
}
