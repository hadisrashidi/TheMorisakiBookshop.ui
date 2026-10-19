import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

// Admin pages need a signed-in admin. This only hides the pages: the API
// checks the Admin role on every management call, so it is the real protection.
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (!auth.isLoggedIn()) {
    toast.info('برای ورود به پنل مدیریت وارد حساب خود شوید.');
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  if (!auth.isAdmin()) {
    toast.warning('شما به پنل مدیریت دسترسی ندارید.');
    return router.createUrlTree(['/']);
  }

  return true;
};
