export class BookSpec {
  label: string | undefined;
  value: string | undefined;
}

export class Book {
  id: number | undefined;
  title: string | undefined;
  image: string | undefined;
  description: string | undefined;
  inStock: boolean | undefined;
  /** false = hidden from the shop; only the admin panel receives hidden books. */
  isActive?: boolean;
  stock: number | undefined;
  oldPrice: number | null | undefined;
  price: number | undefined;
  authorId: number | undefined;
  genre: string | undefined;
  language: string | undefined;
  specs: BookSpec[] | undefined;
}
