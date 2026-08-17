import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileService, UserProfile } from '../../shared/services/profile.service';
import { OrdersService } from '../../shared/services/orders.service';
import { JalaliDatePickerComponent } from '../../shared/components/jalali-date-picker/jalali-date-picker.component';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../shared/services/auth.service';

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
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Edited copy — only written back to the service on save, so navigating
  // away without saving discards the edits.
  draft = signal<UserProfile>({ ...this.profileService.profile() });

  // The page opens as a read-only summary; the fields only accept input
  // after "اصلاح مشخصات", which is also when the button becomes "ذخیره تغییرات".
  editing = signal(false);

  startEdit() {
    this.draft.set({ ...this.profileService.profile() });
    this.editing.set(true);
  }

  cancelEdit() {
    this.draft.set({ ...this.profileService.profile() });
    this.editing.set(false);
  }

  onField(field: keyof UserProfile, value: string) {
    this.draft.update(d => ({ ...d, [field]: value }));
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.toast.error('لطفاً یک فایل تصویری انتخاب کنید.');
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      this.toast.warning('حجم تصویر باید کمتر از ۲ مگابایت باشد.');
      return;
    }

    // Read as a data URL so it survives in localStorage — there's no
    // upload endpoint to POST the file to yet.
    const reader = new FileReader();
    reader.onload = () => {
      this.draft.update(d => ({ ...d, avatar: String(reader.result ?? '') }));
      };
    reader.onerror = () => this.toast.error('خواندن تصویر ناموفق بود.');
    reader.readAsDataURL(file);

    // Allows re-picking the same file straight after.
    input.value = '';
  }

  removeAvatar() {
    this.draft.update(d => ({ ...d, avatar: '' }));
  }

  save() {
    this.profileService.save(this.draft());
    this.editing.set(false);
    this.toast.success('تغییرات ذخیره شد.');
  }

  logout() {
    this.auth.logout();
    this.toast.info('از حساب خود خارج شدید.');
    this.router.navigate(['/']);
  }
}
