import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { AuthApiService } from './services/auth.api.service';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// A logged-in person adds an email + password, so they can also log in without an SMS code.
@Component({
  selector: 'app-account-security',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './account-security.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSecurityComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly toast = inject(ToastService);
  readonly auth = inject(AuthService);

  email = signal(this.auth.current()?.email ?? '');
  password = signal('');
  confirmPassword = signal('');
  submitting = signal(false);
  error = signal('');

  async submit(): Promise<void> {
    this.error.set('');
    const email = this.email().trim();

    if (!EMAIL_PATTERN.test(email)) {
      this.error.set('ایمیل معتبر وارد کنید.');
      return;
    }
    if (this.password().length < MIN_PASSWORD_LENGTH) {
      this.error.set(`رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH} نویسه باشد.`);
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.error.set('رمز عبور و تکرار آن یکسان نیستند.');
      return;
    }

    this.submitting.set(true);
    const result = await this.authApiService.setCredentials({ email, password: this.password() });
    this.submitting.set(false);

    if (!result.isSuccess) {
      return;
    }

    const user = this.auth.current();
    if (user) {
      this.auth.updateUser({ ...user, email, hasPassword: true });
    }

    this.password.set('');
    this.confirmPassword.set('');
    this.toast.success('ایمیل و رمز عبور ذخیره شد.');
  }
}
