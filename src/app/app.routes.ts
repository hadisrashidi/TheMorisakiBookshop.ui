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
