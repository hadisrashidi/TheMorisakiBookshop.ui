import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { normalizeDigits } from '../../shared/utils/digits';
import { OtpRequestComponent } from './components/otp-request.component';
import { AuthApiService } from './services/auth.api.service';

const CODE_PATTERN = /^\d{6}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, OtpRequestComponent],
  templateUrl: './register.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  mobile = signal('');
  codeIsSent = signal(false);
  code = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  submitting = signal(false);
  error = signal('');

  onCodeSent(): void {
    this.codeIsSent.set(true);
    this.code.set('');
  }

  onNumberChanged(): void {
    this.codeIsSent.set(false);
    this.code.set('');
  }

  async submit(): Promise<void> {
    this.error.set('');
    const code = normalizeDigits(this.code());
    const email = this.email().trim();

    if (!CODE_PATTERN.test(code)) {
      this.error.set('کد ۶ رقمی را وارد کنید.');
      return;
    }
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
    const result = await this.authApiService.register({
      mobile: this.mobile(),
      code,
      email,
      password: this.password()
    });
    this.submitting.set(false);

    // On failure ApiHelperService has already shown the reason as a toast.
    if (!result.isSuccess || !result.data) {
      return;
    }

    this.auth.startSession(result.data);
    this.toast.success('حساب شما ساخته شد. خوش آمدید!');
    this.router.navigate(['/profile']);
  }
}
