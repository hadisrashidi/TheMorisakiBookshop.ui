import { SetCartQuantityRequestModel } from './set-cart-quantity.request.model';

export class MergeCartRequestModel {
  lines: SetCartQuantityRequestModel[] = [];
}
