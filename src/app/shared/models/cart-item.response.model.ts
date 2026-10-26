export class CartItemResponseModel {
  /** The book id. */
  id = 0;
  title = '';
  image = '';
  price = 0;
  /** null = no discount. */
  oldPrice: number | null = null;
  stock = 0;
  quantity = 0;
}
