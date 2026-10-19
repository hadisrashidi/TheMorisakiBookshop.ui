import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiImagePipe } from '../../../shared/pipes/api-image.pipe';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { Author } from '../../home/models/author.model';
import { HomeApiService } from '../../home/services/home.api.service';
import { AdminNavComponent } from './admin-nav.component';

@Component({
  selector: 'app-admin-authors-list',
  standalone: true,
  imports: [RouterLink, ApiImagePipe, ImageFallbackDirective, AdminNavComponent],
  templateUrl: './admin-authors-list.component.html',
  styleUrl: './admin-authors-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAuthorsListComponent implements OnInit {
  private readonly homeApiService = inject(HomeApiService);

  authors = signal<Author[]>([]);
  loading = signal(false);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);

    try {
      const result = await this.homeApiService.getAuthors();

      if (result.isSuccess && result.data) {
        this.authors.set(result.data);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
