import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { OrdersService } from '../../shared/services/orders.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  private router = inject(Router);
  private ordersService = inject(OrdersService);
  private toast = inject(ToastService);
  cartService = inject(CartService);

  // There's no payment gateway yet, so "checkout" records the order
  // locally (so it shows up in order history) and empties the cart. Swap
  // OrdersService for a real order POST once the backend grows one.
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
    this.toast.info('کالا از سبد خرید حذف شد.');
  }

  checkout() {
    if (this.cartService.items().length === 0) {
      return;
    }

    const order = this.ordersService.placeOrder(this.cartService.items(), {
      subtotal: this.cartService.subtotal(),
      discount: this.cartService.discount(),
      shipping: this.cartService.shipping(),
      total: this.cartService.total()
    });

    this.placedOrderNumber.set(order.id);
    this.cartService.clear();
    this.toast.success(`سفارش ${order.id} با موفقیت ثبت شد.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  continueShopping() {
    this.placedOrderNumber.set(null);
    this.router.navigate(['/']);
  }
}
