export class CartItem {
  id!: number;
  title!: string;
  image!: string;
  price!: string;
  oldPrice?: string;
  quantity!: number;
  /** Stock when the book was last added; undefined for items saved before this field existed. */
  stock?: number;
}
