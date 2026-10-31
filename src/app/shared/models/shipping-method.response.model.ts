export class ShippingMethodResponseModel {
  id = 0;
  name = '';
  /** Normal price in toman. */
  price = 0;
  /** Free when the books cost at least this much; null = never free. */
  freeAbove: number | null = null;
  /** What this cart pays (0 = free). */
  cost = 0;
  deliveryText = '';
  tehranOnly = false;
}
