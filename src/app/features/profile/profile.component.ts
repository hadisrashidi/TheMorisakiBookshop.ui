import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileService, UserProfile } from '../../shared/services/profile.service';
import { OrdersService } from '../../shared/services/orders.service';
import { JalaliDatePickerComponent } from '../../shared/components/jalali-date-picker/jalali-date-picker.component';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../shared/services/auth.service';
import { AuthApiService } from '../auth/services/auth.api.service';
import { UpdateProfileRequestModel } from '../auth/models/update-profile.request.model';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JalaliDatePickerComponent, ImageFallbackDirective],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private profileService = inject(ProfileService);
  ordersService = inject(OrdersService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private authApiService = inject(AuthApiService);
  private router = inject(Router);

  ngOnInit() {
    this.ordersService.load();
  }

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

  async save() {
    this.profileService.save(this.draft());
    this.editing.set(false);
    await this.saveProfileToAccount();
    this.toast.success('تغییرات ذخیره شد.');
  }

  // Name and birthdate live on the account (so they follow the person to another browser).
  private async saveProfileToAccount() {
    const user = this.auth.current();

    if (!user) {
      return;
    }

    // The API needs a name of 2+ characters; a too-short typed name keeps the saved one.
    const typedName = this.draft().name.trim();
    const name = typedName.length >= 2 ? typedName : (user.name ?? '');
    const birthdate = this.draft().birthdate;

    if (name.length < 2 || (name === user.name && birthdate === (user.birthdate ?? ''))) {
      return;
    }

    const request = new UpdateProfileRequestModel();
    request.name = name;
    request.birthdate = birthdate;
    const result = await this.authApiService.updateProfile(request);

    if (result.isSuccess && result.data) {
      this.auth.updateUser(result.data);
    }
  }

  logout() {
    this.auth.logout();
    this.toast.info('از حساب خود خارج شدید.');
    this.router.navigate(['/login']);
  }
}
