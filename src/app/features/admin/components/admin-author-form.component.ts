import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { Author } from '../../home/models/author.model';
import { AuthorsApiService } from '../../authors/services/authors.api.service';
import { AuthorRequestModel } from '../models/author.request.model';
import { AdminAuthorsApiService } from '../services/admin-authors.api.service';
import { AdminImageFieldComponent } from './admin-image-field.component';
import { AdminNavComponent } from './admin-nav.component';

@Component({
  selector: 'app-admin-author-form',
  standalone: true,
  imports: [FormsModule, RouterLink, AdminNavComponent, AdminImageFieldComponent],
  templateUrl: './admin-author-form.component.html',
  styleUrl: './admin-author-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAuthorFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminAuthorsApiService = inject(AdminAuthorsApiService);
  private readonly authorsApiService = inject(AuthorsApiService);
  private readonly toastService = inject(ToastService);

  model = signal(new AuthorRequestModel());
  loading = signal(false);
  saving = signal(false);

  /** null = adding a new author. */
  authorId: number | null = null;

  async ngOnInit(): Promise<void> {
    const idText = this.route.snapshot.paramMap.get('id');

    if (idText !== null) {
      this.authorId = Number(idText);
      await this.loadAuthor(this.authorId);
    }
  }

  async save(): Promise<void> {
    this.saving.set(true);

    try {
      const data = this.model();
      const result = this.authorId === null
        ? await this.adminAuthorsApiService.createAuthor(data)
        : await this.adminAuthorsApiService.updateAuthor(this.authorId, data);

      if (result.isSuccess) {
        this.toastService.success('نویسنده ذخیره شد.');
        await this.router.navigate(['/admin/authors']);
      }
    } finally {
      this.saving.set(false);
    }
  }

  private async loadAuthor(id: number): Promise<void> {
    this.loading.set(true);

    try {
      const result = await this.authorsApiService.getAuthorById(id);

      if (!result.isSuccess || !result.data) {
        await this.router.navigate(['/admin/authors']);
        return;
      }

      this.model.set(this.toRequest(result.data));
    } finally {
      this.loading.set(false);
    }
  }

  private toRequest(author: Author): AuthorRequestModel {
    const request = new AuthorRequestModel();
    request.name = author.name ?? '';
    request.image = author.image ?? '';
    request.bio = author.bio ?? '';
    request.genre = author.genre ?? '';
    return request;
  }
}
