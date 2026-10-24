import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Address } from '../../shared/models/address.model';
import { CartItem } from '../../shared/models/cart-item.model';
import { PlaceOrderLineRequestModel } from '../../shared/models/place-order-line.request.model';
import { PlaceOrderRequestModel } from '../../shared/models/place-order.request.model';
import { AddressesService } from '../../shared/services/addresses.service';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../../shared/services/cart.service';
import { OrdersService } from '../../shared/services/orders.service';
import { ToastService } from '../../shared/services/toast.service';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { ApiImagePipe } from '../../shared/pipes/api-image.pipe';
import { normalizeDigits } from '../../shared/utils/digits';

const MAX_QUANTITY_PER_BOOK = 20;
const MOBILE_PATTERN = /^09\d{9}$/;
const POSTAL_CODE_PATTERN = /^(\d{10})?$/;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ApiImagePipe, RouterLink, ImageFallbackDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);
  private readonly addressesService = inject(AddressesService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  readonly cartService = inject(CartService);

  /** Order number after a successful checkout; the page then shows the thank-you card. */
  placedOrderNumber = signal<number | null>(null);
  isPlacing = signal(false);

  goToBookDetail(id: number) {
    this.router.navigate(['/books', id]);
  }

  increase(item: CartItem) {
    if (item.stock !== undefined && item.quantity + 1 > item.stock) {
      this.toast.warning(`فقط ${item.stock} عدد از این کتاب موجود است.`);
      return;
    }

    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decrease(id: number, quantity: number) {
    this.cartService.updateQuantity(id, quantity - 1);
  }

  remove(id: number) {
    this.cartService.removeFromCart(id);
    this.toast.info('کالا از سبد خرید حذف شد.');
  }

  async checkout() {
    if (this.cartService.items().length === 0 || this.isPlacing()) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.toast.info('برای ثبت سفارش وارد حساب خود شوید.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    const request = this.buildOrderRequest();

    if (!request) {
      return;
    }

    this.isPlacing.set(true);
    const result = await this.ordersService.placeOrder(request);
    this.isPlacing.set(false);

    // On failure the API message (for example "not enough stock") is already shown as a toast.
    if (!result.isSuccess || result.data === undefined) {
      return;
    }

    this.placedOrderNumber.set(result.data);
    this.cartService.clear();
    this.toast.success(`سفارش ${result.data} ثبت شد.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  continueShopping() {
    this.placedOrderNumber.set(null);
    this.router.navigate(['/']);
  }

  // Recipient = the default address (or the first one). Returns null after telling the person what is missing.
  private buildOrderRequest(): PlaceOrderRequestModel | null {
    const address = this.findCheckoutAddress();

    if (!address) {
      this.toast.info('برای ثبت سفارش یک آدرس اضافه کنید.');
      this.router.navigate(['/addresses']);
      return null;
    }

    const mobile = normalizeDigits(address.phone).trim();
    const postalCode = normalizeDigits(address.postalCode).trim();

    if (!MOBILE_PATTERN.test(mobile) || !POSTAL_CODE_PATTERN.test(postalCode)) {
      this.toast.info('شماره موبایل یا کد پستی آدرس انتخاب‌شده درست نیست. آدرس را اصلاح کنید.');
      this.router.navigate(['/addresses']);
      return null;
    }

    const request = new PlaceOrderRequestModel();
    request.recipientName = address.recipient;
    request.recipientMobile = mobile;
    request.address = `${address.city}، ${address.fullAddress}`;
    request.postalCode = postalCode;

    for (const item of this.cartService.items()) {
      if (item.quantity > MAX_QUANTITY_PER_BOOK) {
        this.toast.info(`از هر کتاب حداکثر ${MAX_QUANTITY_PER_BOOK} عدد می‌شود سفارش داد.`);
        return null;
      }

      const line = new PlaceOrderLineRequestModel();
      line.bookId = item.id;
      line.quantity = item.quantity;
      request.lines.push(line);
    }

    return request;
  }

  private findCheckoutAddress(): Address | undefined {
    const addresses = this.addressesService.addresses();

    return addresses.find(address => address.isDefault) ?? addresses[0];
  }
}
