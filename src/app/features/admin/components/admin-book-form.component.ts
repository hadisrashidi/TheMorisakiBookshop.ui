import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { Author } from '../../home/models/author.model';
import { Book } from '../../home/models/book.model';
import { HomeApiService } from '../../home/services/home.api.service';
import { SearchApiService } from '../../search/services/search.api.service';
import { BookSpecRequestModel } from '../models/book-spec.request.model';
import { BookRequestModel } from '../models/book.request.model';
import { AdminBooksApiService } from '../services/admin-books.api.service';
import { AdminImageFieldComponent } from './admin-image-field.component';
import { AdminNavComponent } from './admin-nav.component';

@Component({
  selector: 'app-admin-book-form',
  standalone: true,
  imports: [FormsModule, RouterLink, AdminNavComponent, AdminImageFieldComponent],
  templateUrl: './admin-book-form.component.html',
  styleUrl: './admin-book-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBookFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminBooksApiService = inject(AdminBooksApiService);
  private readonly homeApiService = inject(HomeApiService);
  private readonly searchApiService = inject(SearchApiService);
  private readonly toastService = inject(ToastService);

  model = signal(new BookRequestModel());
  authors = signal<Author[]>([]);
  // Suggestions for the genre and language fields, taken from the catalog; any other text is allowed too.
  genres = signal<string[]>([]);
  languages = signal<string[]>([]);
  loading = signal(false);
  saving = signal(false);

  /** null = adding a new book. */
  bookId: number | null = null;

  async ngOnInit(): Promise<void> {
    const idText = this.route.snapshot.paramMap.get('id');

    this.loadAuthors();
    this.loadSuggestions();

    if (idText !== null) {
      this.bookId = Number(idText);
      await this.loadBook(this.bookId);
    }
  }

  addSpec(): void {
    this.model().specs.push(new BookSpecRequestModel());
  }

  removeSpec(index: number): void {
    this.model().specs.splice(index, 1);
  }

  async save(): Promise<void> {
    this.saving.set(true);

    try {
      const data = this.buildRequest();
      const result = this.bookId === null
        ? await this.adminBooksApiService.createBook(data)
        : await this.adminBooksApiService.updateBook(this.bookId, data);

      if (result.isSuccess) {
        this.toastService.success('کتاب ذخیره شد.');
        await this.router.navigate(['/admin/books']);
      }
    } finally {
      this.saving.set(false);
    }
  }

  private async loadAuthors(): Promise<void> {
    const result = await this.homeApiService.getAuthors();

    if (result.isSuccess && result.data) {
      this.authors.set(result.data);
    }
  }

  private async loadSuggestions(): Promise<void> {
    const result = await this.searchApiService.getFilters();

    if (result.isSuccess && result.data) {
      this.genres.set(result.data.genres);
      this.languages.set(result.data.languages);
    }
  }

  private async loadBook(id: number): Promise<void> {
    this.loading.set(true);

    try {
      const result = await this.adminBooksApiService.getBookById(id);

      if (!result.isSuccess || !result.data) {
        await this.router.navigate(['/admin/books']);
        return;
      }

      this.model.set(this.toRequest(result.data));
    } finally {
      this.loading.set(false);
    }
  }

  private toRequest(book: Book): BookRequestModel {
    const request = new BookRequestModel();
    request.title = book.title ?? '';
    request.image = book.image ?? '';
    request.price = book.price ?? null;
    request.oldPrice = book.oldPrice ?? null;
    request.authorId = book.authorId ?? null;
    request.genre = book.genre ?? '';
    request.language = book.language ?? '';
    request.description = book.description ?? '';
    request.stock = book.stock ?? 0;

    for (const spec of book.specs ?? []) {
      const specRequest = new BookSpecRequestModel();
      specRequest.label = spec.label ?? '';
      specRequest.value = spec.value ?? '';
      request.specs.push(specRequest);
    }

    return request;
  }

  // Half-empty spec rows are dropped; an empty "old price" means no discount.
  private buildRequest(): BookRequestModel {
    const form = this.model();
    const request = new BookRequestModel();

    request.title = form.title;
    request.image = form.image;
    request.price = form.price;
    request.oldPrice = form.oldPrice;
    request.authorId = form.authorId;
    request.genre = form.genre;
    request.language = form.language;
    request.description = form.description;
    request.stock = form.stock;

    for (const spec of form.specs) {
      if (spec.label.trim() !== '' && spec.value.trim() !== '') {
        request.specs.push(spec);
      }
    }

    return request;
  }
}
