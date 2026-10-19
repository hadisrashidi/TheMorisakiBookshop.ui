import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiImagePipe } from '../../../shared/pipes/api-image.pipe';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { ToastService } from '../../../shared/services/toast.service';
import { Author } from '../../home/models/author.model';
import { Book } from '../../home/models/book.model';
import { HomeApiService } from '../../home/services/home.api.service';
import { AdminBookRowModel } from '../models/admin-book-row.model';
import { AdminBooksApiService } from '../services/admin-books.api.service';
import { AdminNavComponent } from './admin-nav.component';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-admin-books-list',
  standalone: true,
  imports: [DecimalPipe, FormsModule, RouterLink, ApiImagePipe, ImageFallbackDirective, AdminNavComponent],
  templateUrl: './admin-books-list.component.html',
  styleUrl: './admin-books-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBooksListComponent implements OnInit {
  private readonly adminBooksApiService = inject(AdminBooksApiService);
  private readonly homeApiService = inject(HomeApiService);
  private readonly toastService = inject(ToastService);

  query = signal('');
  rows = signal<AdminBookRowModel[]>([]);
  loading = signal(false);

  page = signal(1);
  totalCount = signal(0);
  pageCount = computed(() => Math.max(1, Math.ceil(this.totalCount() / PAGE_SIZE)));
  pageNumbers = computed(() => Array.from({ length: this.pageCount() }, (_, index) => index + 1));

  private authorNames = new Map<number, string>();

  async ngOnInit(): Promise<void> {
    await this.loadAuthors();
    await this.loadPage();
  }

  /** A new search text always starts on page 1. */
  async search(): Promise<void> {
    this.page.set(1);
    await this.loadPage();
  }

  async goToPage(page: number): Promise<void> {
    this.page.set(page);
    await this.loadPage();
  }

  async saveStock(row: AdminBookRowModel): Promise<void> {
    if (row.book.id === undefined || row.stockDraft === null || row.stockDraft < 0) {
      this.toastService.warning('موجودی باید عددی صفر یا بیشتر باشد.');
      return;
    }

    const result = await this.adminBooksApiService.updateStock(row.book.id, { stock: row.stockDraft });

    if (result.isSuccess) {
      row.book.stock = row.stockDraft;
      row.book.inStock = row.stockDraft > 0;
      this.rows.update(rows => [...rows]);
      this.toastService.success('موجودی ذخیره شد.');
    }
  }

  async toggleActive(row: AdminBookRowModel): Promise<void> {
    if (row.book.id === undefined) {
      return;
    }

    const makeActive = !row.book.isActive;
    const result = await this.adminBooksApiService.setBookActive(row.book.id, { isActive: makeActive });

    if (result.isSuccess) {
      row.book.isActive = makeActive;
      this.rows.update(rows => [...rows]);
      this.toastService.success(makeActive ? 'کتاب در فروشگاه نمایش داده می‌شود.' : 'کتاب از فروشگاه پنهان شد.');
    }
  }

  private async loadAuthors(): Promise<void> {
    const result = await this.homeApiService.getAuthors();

    if (!result.isSuccess || !result.data) {
      return;
    }

    this.authorNames = this.buildAuthorNames(result.data);
  }

  private async loadPage(): Promise<void> {
    this.loading.set(true);

    try {
      const result = await this.adminBooksApiService.searchBooks(this.query(), this.page(), PAGE_SIZE);

      if (result.isSuccess && result.data) {
        this.rows.set(this.buildRows(result.data.items));
        this.totalCount.set(result.data.totalCount);
      } else {
        this.rows.set([]);
        this.totalCount.set(0);
      }
    } finally {
      this.loading.set(false);
    }
  }

  private buildRows(books: Book[]): AdminBookRowModel[] {
    const rows: AdminBookRowModel[] = [];

    for (const book of books) {
      const row = new AdminBookRowModel();
      row.book = book;
      row.authorName = this.authorNames.get(book.authorId ?? 0) ?? '';
      row.stockDraft = book.stock ?? 0;
      rows.push(row);
    }

    return rows;
  }

  private buildAuthorNames(authors: Author[]): Map<number, string> {
    const names = new Map<number, string>();

    for (const author of authors) {
      if (author.id !== undefined) {
        names.set(author.id, author.name ?? '');
      }
    }

    return names;
  }
}
