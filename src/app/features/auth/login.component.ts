import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiResponse } from '@core/models/api/api.response.model';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { normalizeDigits } from '../../shared/utils/digits';
import { OtpRequestComponent } from './components/otp-request.component';
import { AuthTokenResponseModel } from './models/auth-token.response.model';
import { AuthApiService } from './services/auth.api.service';

type LoginMode = 'otp' | 'password';

const CODE_PATTERN = /^\d{6}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, OtpRequestComponent],
  templateUrl: './login.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  mode = signal<LoginMode>('otp');
  submitting = signal(false);
  error = signal('');

  // Login with SMS code
  mobile = signal('');
  codeIsSent = signal(false);
  code = signal('');

  // Login with email + password
  email = signal('');
  password = signal('');

  showMode(mode: LoginMode): void {
    this.mode.set(mode);
    this.error.set('');
  }

  onCodeSent(): void {
    this.codeIsSent.set(true);
    this.code.set('');
  }

  onNumberChanged(): void {
    this.codeIsSent.set(false);
    this.code.set('');
  }

  async submitCode(): Promise<void> {
    this.error.set('');
    const code = normalizeDigits(this.code());

    if (!CODE_PATTERN.test(code)) {
      this.error.set('کد ۶ رقمی را وارد کنید.');
      return;
    }

    this.submitting.set(true);
    const result = await this.authApiService.verifyOtp({ mobile: this.mobile(), code });
    this.submitting.set(false);

    this.finishLogin(result);
  }

  async submitPassword(): Promise<void> {
    this.error.set('');

    if (!this.email().trim() || !this.password()) {
      this.error.set('ایمیل و رمز عبور را وارد کنید.');
      return;
    }

    this.submitting.set(true);
    const result = await this.authApiService.loginWithPassword({
      email: this.email().trim(),
      password: this.password()
    });
    this.submitting.set(false);

    this.finishLogin(result);
  }

  // On failure ApiHelperService has already shown the reason as a toast.
  private finishLogin(result: ApiResponse<AuthTokenResponseModel>): void {
    if (!result.isSuccess || !result.data) {
      return;
    }

    this.auth.startSession(result.data);
    this.toast.success('خوش آمدید!');

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/profile';
    this.router.navigateByUrl(returnUrl);
  }
}
