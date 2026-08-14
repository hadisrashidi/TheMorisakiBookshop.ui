import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private router = inject(Router);
  private cartService = inject(CartService);

  searchQuery = '';
  cartCount = this.cartService.totalCount;

  search() {
    const query = this.searchQuery.trim();
    if (!query) {
      return;
    }
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
