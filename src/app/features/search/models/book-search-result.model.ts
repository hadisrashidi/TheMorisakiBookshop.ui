import { Book } from '../../home/models/book.model';

export class BookSearchResult {
  items: Book[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 9;
}
