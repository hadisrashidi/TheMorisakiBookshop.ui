import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AddressResponseModel } from '../../shared/models/address.response.model';
import { CartItem } from '../../shared/models/cart-item.model';
import { PlaceOrderLineRequestModel } from '../../shared/models/place-order-line.request.model';
import { PlaceOrderRequestModel } from '../../shared/models/place-order.request.model';
import { DiscountPreviewResponseModel } from '../../shared/models/discount-preview.response.model';
import { ShippingMethodResponseModel } from '../../shared/models/shipping-method.response.model';
import { AddressesService } from '../../shared/services/addresses.service';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../../shared/services/cart.service';
import { OrdersService } from '../../shared/services/orders.service';
import { DiscountsApiService } from '../../shared/services/discounts.api.service';
import { ShippingApiService } from '../../shared/services/shipping.api.service';
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
  imports: [ApiImagePipe, DecimalPipe, FormsModule, RouterLink, ImageFallbackDirective],
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
  private readonly shippingApiService = inject(ShippingApiService);
  private readonly discountsApiService = inject(DiscountsApiService);
  private readonly route = inject(ActivatedRoute);
  readonly cartService = inject(CartService);

  /** Shipping methods for this cart and the city of the checkout address. */
  shippingMethods = signal<ShippingMethodResponseModel[]>([]);
  selectedShippingId = signal(0);
  private latestShippingRequest = 0;

  selectedShipping = computed(() => {
    const methods = this.shippingMethods();

    return methods.find(method => method.id === this.selectedShippingId());
  });
  shippingCost = computed(() => this.selectedShipping()?.cost ?? 0);
  /** The discount code the person typed (not yet checked). */
  discountInput = signal('');
  /** The code the API accepted, with the toman it takes off; null = no code in use. */
  appliedDiscount = signal<DiscountPreviewResponseModel | null>(null);
  isCheckingDiscount = signal(false);

  /** A code from the link (/cart?code=WELCOME20), waiting for the cart to have books so it can be applied. */
  private linkCode = '';

  discountAmount = computed(() => this.appliedDiscount()?.discountAmount ?? 0);
  payableTotal = computed(() => this.cartService.totalPrice() - this.discountAmount() + this.shippingCost());

  /** Order number after a successful checkout; the page then shows the thank-you card. */
  placedOrderNumber = signal<number | null>(null);
  isPlacing = signal(false);

  constructor() {
    if (this.authService.isLoggedIn()) {
      this.addressesService.load();
    }

    this.readCodeFromLink();

    // The price and the allowed methods depend on the books' price and on the city of the checkout address.
    effect(() => {
      const booksPrice = this.cartService.totalPrice();
      const city = this.findCheckoutAddress()?.city ?? '';

      untracked(() => this.loadShippingMethods(booksPrice, city));
    });

    // A code taken off the old price must not stay when the cart changes: ask the API again (silently).
    effect(() => {
      const booksPrice = this.cartService.totalPrice();

      untracked(() => this.revalidateDiscount(booksPrice));
    });

    // A code from the link is applied once, as soon as a logged-in person has books in the cart
    // (the saved cart of an account arrives a moment after the page opens).
    effect(() => {
      const booksPrice = this.cartService.totalPrice();
      const loggedIn = this.authService.isLoggedIn();

      if (this.linkCode !== '' && loggedIn && booksPrice > 0) {
        untracked(() => this.applyLinkCode());
      }
    });
  }

  /** Puts the code of the link into the code box; a guest is sent to login by the "اعمال" button as usual. */
  private readCodeFromLink() {
    const code = (this.route.snapshot.queryParamMap.get('code') ?? '').trim().slice(0, 40);

    if (code === '') {
      return;
    }

    this.linkCode = code;
    this.discountInput.set(code);
  }

  private applyLinkCode() {
    this.linkCode = '';
    this.applyDiscount();
  }

  /** Asks the API whether the typed code can be used on this cart. */
  async applyDiscount() {
    const code = this.discountInput().trim();

    if (code === '') {
      this.toast.warning('کد تخفیف را وارد کنید.');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.toast.info('برای استفاده از کد تخفیف وارد حساب خود شوید.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart?code=' + encodeURIComponent(code) } });
      return;
    }

    this.isCheckingDiscount.set(true);
    const result = await this.discountsApiService.checkCode(code, this.cartService.totalPrice());
    this.isCheckingDiscount.set(false);

    // On refusal the API message (expired, used up...) is already shown as a toast.
    if (result.isSuccess && result.data) {
      this.appliedDiscount.set(result.data);
      this.discountInput.set('');
      this.toast.success(`کد تخفیف ${result.data.code} اعمال شد.`);
    }
  }

  removeDiscount() {
    this.appliedDiscount.set(null);
  }

  /** The cart changed: the code is checked again for the new price; a code that no longer fits is removed. */
  private async revalidateDiscount(booksPrice: number): Promise<void> {
    const applied = this.appliedDiscount();

    if (applied === null) {
      return;
    }

    const result = await this.discountsApiService.checkCode(applied.code, booksPrice, false);

    if (result.isSuccess && result.data) {
      this.appliedDiscount.set(result.data);
    } else {
      this.appliedDiscount.set(null);
      this.toast.warning(result.message ?? 'کد تخفیف برای این سبد دیگر معتبر نیست.');
    }
  }

  chooseShipping(id: number) {
    this.selectedShippingId.set(id);
  }

  private async loadShippingMethods(booksPrice: number, city: string): Promise<void> {
    if (booksPrice <= 0) {
      return;
    }

    const requestNumber = ++this.latestShippingRequest;
    const result = await this.shippingApiService.getShippingMethods(booksPrice, city, false);

    // A newer request was started while this one was running: its answer is the one to show.
    if (requestNumber !== this.latestShippingRequest) {
      return;
    }

    const methods = result.isSuccess && result.data ? result.data : [];
    this.shippingMethods.set(methods);

    // Keep the chosen method while it is still offered, otherwise take the first one.
    const stillOffered = methods.some(method => method.id === this.selectedShippingId());
    if (!stillOffered) {
      this.selectedShippingId.set(methods.length > 0 ? methods[0].id : 0);
    }
  }

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
    this.goHomeWhenCartIsEmpty();
  }

  remove(id: number) {
    this.cartService.removeFromCart(id);
    this.toast.info('کالا از سبد خرید حذف شد.');
    this.goHomeWhenCartIsEmpty();
  }

  async checkout() {
    if (this.cartService.items().length === 0 || this.isPlacing()) {
      return;
    }

    if (this.shippingMethods().length > 0 && this.selectedShippingId() === 0) {
      this.toast.warning('روش ارسال را انتخاب کنید.');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.toast.info('برای ثبت سفارش وارد حساب خود شوید.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    // The addresses come from the server; make sure they are loaded before reading the default one.
    await this.addressesService.load();
    const request = this.buildOrderRequest();

    if (!request) {
      return;
    }

    this.isPlacing.set(true);
    const result = await this.ordersService.placeOrder(request);
    this.isPlacing.set(false);

    // On failure the API message (for example "not enough stock") is already shown as a toast.
    if (!result.isSuccess || result.data === undefined) {
      // A refused code stays in the box otherwise: check it again so the person sees the truth.
      await this.revalidateDiscount(this.cartService.totalPrice());
      return;
    }

    this.placedOrderNumber.set(result.data);
    this.appliedDiscount.set(null);
    this.cartService.clear();
    this.toast.success(`سفارش ${result.data} ثبت شد.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  continueShopping() {
    this.placedOrderNumber.set(null);
    this.router.navigate(['/']);
  }

  // The last book left the cart: an empty cart page has nothing to do, so go to the home page.
  private goHomeWhenCartIsEmpty() {
    if (this.cartService.items().length === 0) {
      this.router.navigate(['/']);
    }
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
    request.city = address.city;
    request.shippingMethodId = this.selectedShippingId();
    request.discountCode = this.appliedDiscount()?.code ?? '';

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

  private findCheckoutAddress(): AddressResponseModel | undefined {
    const addresses = this.addressesService.addresses();

    return addresses.find(address => address.isDefault) ?? addresses[0];
  }
}
