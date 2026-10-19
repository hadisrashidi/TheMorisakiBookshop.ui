import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { ApiImagePipe } from '../../../shared/pipes/api-image.pipe';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { AdminImagesApiService, ImageFolder } from '../services/admin-images.api.service';

/** Shows the current image and uploads a new one; `value` is the image path to save with the book / author. */
@Component({
  selector: 'app-admin-image-field',
  standalone: true,
  imports: [ApiImagePipe, ImageFallbackDirective],
  templateUrl: './admin-image-field.component.html',
  styleUrl: './admin-image-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminImageFieldComponent {
  private readonly adminImagesApiService = inject(AdminImagesApiService);

  label = input.required<string>();
  folder = input.required<ImageFolder>();
  value = model('');

  uploading = signal(false);

  async onFileSelected(event: Event): Promise<void> {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      return;
    }

    this.uploading.set(true);

    try {
      const result = await this.adminImagesApiService.uploadImage(file, this.folder());

      if (result.isSuccess && result.data) {
        this.value.set(result.data);
      }
    } finally {
      this.uploading.set(false);
      // Lets the same file be chosen again after an error.
      fileInput.value = '';
    }
  }
}
