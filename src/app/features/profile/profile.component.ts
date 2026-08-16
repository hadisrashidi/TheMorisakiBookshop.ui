import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileService, UserProfile } from '../../shared/services/profile.service';
import { OrdersService } from '../../shared/services/orders.service';
import { JalaliDatePickerComponent } from '../../shared/components/jalali-date-picker/jalali-date-picker.component';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JalaliDatePickerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private profileService = inject(ProfileService);
  ordersService = inject(OrdersService);

  // Edited copy — only written back to the service on save, so navigating
  // away without saving discards the edits.
  draft = signal<UserProfile>({ ...this.profileService.profile() });

  saved = signal(false);
  error = signal('');

  onField(field: keyof UserProfile, value: string) {
    this.draft.update(d => ({ ...d, [field]: value }));
    this.saved.set(false);
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.error.set('لطفاً یک فایل تصویری انتخاب کنید.');
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      this.error.set('حجم تصویر باید کمتر از ۲ مگابایت باشد.');
      return;
    }

    // Read as a data URL so it survives in localStorage — there's no
    // upload endpoint to POST the file to yet.
    const reader = new FileReader();
    reader.onload = () => {
      this.error.set('');
      this.draft.update(d => ({ ...d, avatar: String(reader.result ?? '') }));
      this.saved.set(false);
    };
    reader.onerror = () => this.error.set('خواندن تصویر ناموفق بود.');
    reader.readAsDataURL(file);

    // Allows re-picking the same file straight after.
    input.value = '';
  }

  removeAvatar() {
    this.draft.update(d => ({ ...d, avatar: '' }));
    this.saved.set(false);
  }

  save() {
    this.profileService.save(this.draft());
    this.saved.set(true);
    this.error.set('');
  }
}
