import { ChangeDetectionStrategy, Component, DestroyRef, inject, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { normalizeDigits } from '../../../shared/utils/digits';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthApiService } from '../services/auth.api.service';

const MOBILE_PATTERN = /^09\d{9}$/;
const RESEND_SECONDS = 60;

/**
 * "Mobile number + send code" part shared by login and password reset.
 * After the code is sent the number is locked until the person taps "change number".
 */
@Component({
  selector: 'app-otp-request',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './otp-request.component.html',
  styleUrl: '../auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtpRequestComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  mobile = model('');
  codeSent = output<void>();
  numberChanged = output<void>();

  sent = signal(false);
  sending = signal(false);
  secondsLeft = signal(0);
  error = signal('');

  private timerId: ReturnType<typeof setInterval> | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  async sendCode(): Promise<void> {
    this.error.set('');
    const mobile = normalizeDigits(this.mobile());

    if (!MOBILE_PATTERN.test(mobile)) {
      this.error.set('شماره موبایل را به شکل ۰۹۱۲۳۴۵۶۷۸۹ وارد کنید.');
      return;
    }

    this.mobile.set(mobile);
    this.sending.set(true);
    const result = await this.authApiService.requestOtp({ mobile });
    this.sending.set(false);

    if (!result.isSuccess) {
      return;
    }

    // In Development the API puts the code in "message" because there is no SMS provider yet.
    if (result.message) {
      this.toast.info(result.message, undefined, 15000);
    }

    this.sent.set(true);
    this.startTimer();
    this.codeSent.emit();
  }

  changeNumber(): void {
    this.stopTimer();
    this.sent.set(false);
    this.secondsLeft.set(0);
    this.numberChanged.emit();
  }

  private startTimer(): void {
    this.stopTimer();
    this.secondsLeft.set(RESEND_SECONDS);

    this.timerId = setInterval(() => {
      this.secondsLeft.update(seconds => seconds - 1);

      if (this.secondsLeft() <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }
}
