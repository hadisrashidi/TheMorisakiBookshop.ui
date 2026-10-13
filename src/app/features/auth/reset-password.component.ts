import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { normalizeDigits } from '../../shared/utils/digits';
import { OtpRequestComponent } from './components/otp-request.component';
import { AuthApiService } from './services/auth.api.service';

const CODE_PATTERN = /^\d{6}$/;
const MIN_PASSWORD_LENGTH = 8;

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink, OtpRequestComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  mobile = signal('');
  codeIsSent = signal(false);
  code = signal('');
  newPassword = signal('');
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

    if (!CODE_PATTERN.test(code)) {
      this.error.set('کد ۶ رقمی را وارد کنید.');
      return;
    }
    if (this.newPassword().length < MIN_PASSWORD_LENGTH) {
      this.error.set(`رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH} نویسه باشد.`);
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.error.set('رمز عبور و تکرار آن یکسان نیستند.');
      return;
    }

    this.submitting.set(true);
    const result = await this.authApiService.resetPassword({
      mobile: this.mobile(),
      code,
      newPassword: this.newPassword()
    });
    this.submitting.set(false);

    if (!result.isSuccess) {
      return;
    }

    this.toast.success('رمز عبور تغییر کرد. با رمز تازه وارد شوید.');
    this.router.navigate(['/login']);
  }
}
