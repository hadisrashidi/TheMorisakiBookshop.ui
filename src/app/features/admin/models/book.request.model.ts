import { BookSpecRequestModel } from './book-spec.request.model';

/** Body of BooksManagement/CreateBook and UpdateBook (the API has one class for each; they are identical). */
export class BookRequestModel {
  title = '';
  image = '';
  price: number | null = null;
  /** Empty = the book is not discounted. */
  oldPrice: number | null = null;
  authorId: number | null = null;
  genre = '';
  language = '';
  description = '';
  stock = 0;
  specs: BookSpecRequestModel[] = [];
}
