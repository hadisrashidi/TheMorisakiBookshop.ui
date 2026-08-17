import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

// Account pages need a signed-in user; anonymous visitors are sent to
// login with a returnUrl so they land back where they were headed.
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.isLoggedIn()) {
    return true;
  }

  toast.info('برای دیدن این صفحه وارد حساب خود شوید.');
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
