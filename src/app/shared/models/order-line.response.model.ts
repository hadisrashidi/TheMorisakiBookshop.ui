export class OrderLineResponseModel {
  bookId = 0;
  title = '';
  image = '';
  /** Price at purchase time, not the book's current price. */
  unitPrice = 0;
  quantity = 0;
}
