import { Book } from '../../home/models/book.model';

/** One line of the admin book list: the book plus what the list needs to edit it in place. */
export class AdminBookRowModel {
  book = new Book();
  authorName = '';
  /** What is typed in the stock field; saved with the "ثبت" button. */
  stockDraft = 0;
}
