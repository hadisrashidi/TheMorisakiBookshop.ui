import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './auth.component.scss'
})
export class RegisterComponent {

  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  name = signal('');
  email = signal('');
  password = signal('');
  confirm = signal('');
  submitting = signal(false);
  error = signal('');

  async submit() {
    this.error.set('');

    const problem = this.validate();
    if (problem) {
      this.error.set(problem);
      this.toast.warning(problem);
      return;
    }

    this.submitting.set(true);
    const result = await this.auth.register(this.name(), this.email(), this.password());
    this.submitting.set(false);

    if (!result.ok) {
      this.error.set(result.error ?? 'ثبت‌نام ناموفق بود.');
      this.toast.error(result.error ?? 'ثبت‌نام ناموفق بود.');
      return;
    }

    this.toast.success('حساب شما ساخته شد.');
    this.router.navigate(['/profile']);
  }

  private validate(): string | null {
    if (!this.name().trim()) {
      return 'نام خود را وارد کنید.';
    }
    if (!EMAIL_PATTERN.test(this.email().trim())) {
      return 'ایمیل معتبر وارد کنید.';
    }
    if (this.password().length < MIN_PASSWORD_LENGTH) {
      return `رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد.`;
    }
    if (this.password() !== this.confirm()) {
      return 'رمز عبور و تکرار آن یکسان نیست.';
    }
    return null;
  }
}
