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
  oldPrice: string | undefined;
  price: string | undefined;
  authorId: number | undefined;
  genre: string | undefined;
  language: string | undefined;
  specs: BookSpec[] | undefined;
}
