import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { LEGAL_PAGES } from './features/legal/legal-pages';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'books/:id',
        title: 'کتاب',
        loadComponent: () =>
          import('./features/books/books.component').then(m => m.BooksComponent),
      },
      {
        path: 'search',
        title: 'جستجوی کتاب',
        loadComponent: () =>
          import('./features/search/search.component').then(m => m.SearchComponent),
      },
      {
        path: 'cart',
        title: 'سبد خرید',
        loadComponent: () =>
          import('./features/cart/cart.component').then(m => m.CartComponent),
      },
      {
        path: 'authors/:id',
        title: 'نویسنده',
        loadComponent: () =>
          import('./features/authors/author-detail.component').then(m => m.AuthorDetailComponent),
      },
      {
        path: 'liked',
        title: 'علاقه‌مندی‌ها',
        loadComponent: () =>
          import('./features/liked/liked.component').then(m => m.LikedComponent),
      },
      {
        path: 'login',
        title: 'ورود',
        loadComponent: () =>
          import('./features/auth/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        title: 'ثبت‌نام',
        loadComponent: () =>
          import('./features/auth/register.component').then(m => m.RegisterComponent),
      },
      {
        path: 'reset-password',
        title: 'بازیابی رمز عبور',
        loadComponent: () =>
          import('./features/auth/reset-password.component').then(m => m.ResetPasswordComponent),
      },
      // Account pages require a signed-in user.
      {
        path: 'profile',
        title: 'پروفایل من',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'security',
        title: 'ایمیل و رمز عبور',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/auth/account-security.component').then(m => m.AccountSecurityComponent),
      },
      {
        path: 'orders',
        title: 'سفارش‌های من',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/orders/orders.component').then(m => m.OrdersComponent),
      },
      {
        path: 'addresses',
        title: 'آدرس‌های من',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/addresses/addresses.component').then(m => m.AddressesComponent),
      },
      {
        path: 'faq',
        title: 'راهنمای خرید',
        loadComponent: () =>
          import('./features/faq/faq.component').then(m => m.FaqComponent),
      },
      {
        path: 'terms',
        title: LEGAL_PAGES['terms'].title,
        data: { page: 'terms', description: LEGAL_PAGES['terms'].description },
        loadComponent: () =>
          import('./features/legal/legal-page.component').then(m => m.LegalPageComponent),
      },
      {
        path: 'privacy',
        title: LEGAL_PAGES['privacy'].title,
        data: { page: 'privacy', description: LEGAL_PAGES['privacy'].description },
        loadComponent: () =>
          import('./features/legal/legal-page.component').then(m => m.LegalPageComponent),
      },
      {
        path: 'returns',
        title: LEGAL_PAGES['returns'].title,
        data: { page: 'returns', description: LEGAL_PAGES['returns'].description },
        loadComponent: () =>
          import('./features/legal/legal-page.component').then(m => m.LegalPageComponent),
      },
      {
        path: 'shipping',
        title: LEGAL_PAGES['shipping'].title,
        data: { description: LEGAL_PAGES['shipping'].description },
        loadComponent: () =>
          import('./features/shipping/shipping.component').then(m => m.ShippingComponent),
      },

      {
        path: '**',
        title: 'صفحه پیدا نشد',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
    ]
  }
];
