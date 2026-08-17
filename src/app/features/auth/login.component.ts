import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './auth.component.scss'
})
export class LoginComponent {

  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  email = signal('');
  password = signal('');
  submitting = signal(false);
  error = signal('');

  async submit() {
    this.error.set('');

    if (!this.email().trim() || !this.password()) {
      this.error.set('ایمیل و رمز عبور را وارد کنید.');
      this.toast.warning('ایمیل و رمز عبور را وارد کنید.');
      return;
    }

    this.submitting.set(true);
    const result = await this.auth.login(this.email(), this.password());
    this.submitting.set(false);

    if (!result.ok) {
      this.error.set(result.error ?? 'ورود ناموفق بود.');
      this.toast.error(result.error ?? 'ورود ناموفق بود.');
      return;
    }

    this.toast.success('خوش آمدید!');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/profile';
    this.router.navigateByUrl(returnUrl);
  }
}
