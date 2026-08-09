import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  private router = inject(Router);
  cartService = inject(CartService);

  goToBookDetail(id: number) {
    this.router.navigate(['/books', id]);
  }

  increase(id: number, quantity: number) {
    this.cartService.updateQuantity(id, quantity + 1);
  }

  decrease(id: number, quantity: number) {
    this.cartService.updateQuantity(id, quantity - 1);
  }

  remove(id: number) {
    this.cartService.removeFromCart(id);
  }
}
