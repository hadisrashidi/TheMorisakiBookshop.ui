import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';

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
        loadComponent: () =>
          import('./features/books/books.component').then(m => m.BooksComponent),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/search/search.component').then(m => m.SearchComponent),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/cart.component').then(m => m.CartComponent),
      },
      {
        path: 'authors/:id',
        loadComponent: () =>
          import('./features/authors/author-detail.component').then(m => m.AuthorDetailComponent),
      },
      {
        path: 'liked',
        loadComponent: () =>
          import('./features/liked/liked.component').then(m => m.LikedComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders.component').then(m => m.OrdersComponent),
      },
      {
        path: 'addresses',
        loadComponent: () =>
          import('./features/addresses/addresses.component').then(m => m.AddressesComponent),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./features/faq/faq.component').then(m => m.FaqComponent),
      },
    ]
  }
];

// {
//   path: '',
//   component: MainLayoutComponent,
//   children: [...]
// },
// {
//   path: 'auth',
//   component: AuthLayoutComponent,
//   children: [...]
// }
