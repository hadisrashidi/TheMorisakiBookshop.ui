import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  private router = inject(Router);
  cartService = inject(CartService);

  // There's no payment gateway or order backend yet, so "checkout"
  // confirms the order locally and empties the cart. Swap this for a real
  // order POST once the backend grows one.
  placedOrderNumber = signal<string | null>(null);

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

  checkout() {
    if (this.cartService.items().length === 0) {
      return;
    }

    const orderNumber = '#' + Math.floor(10000 + Math.random() * 89999);
    this.placedOrderNumber.set(orderNumber);
    this.cartService.clear();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  continueShopping() {
    this.placedOrderNumber.set(null);
    this.router.navigate(['/']);
  }
}
