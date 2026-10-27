import { Injectable, PLATFORM_ID, computed, effect, inject, signal, untracked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from '../models/cart-item.model';
import { CartItemResponseModel } from '../models/cart-item.response.model';
import { MergeCartRequestModel } from '../models/merge-cart.request.model';
import { SetCartQuantityRequestModel } from '../models/set-cart-quantity.request.model';
import { Book } from '../../features/home/models/book.model';
import { BooksApiService } from '../../features/books/services/books.api.service';
import { AuthService } from './auth.service';
import { CartApiService } from './cart.api.service';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'morisaki-cart';

/**
 * The cart. A guest's cart lives in the browser (localStorage); a logged-in person's cart lives on
 * the server, so it follows them to another browser. At login the guest cart is added to the saved one.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private booksApiService = inject(BooksApiService);
  private toast = inject(ToastService);
  private cartApiService = inject(CartApiService);
  private authService = inject(AuthService);

  private itemsSignal = signal<CartItem[]>(this.loadFromStorage());
  private wasLoggedIn = false;

  items = this.itemsSignal.asReadonly();

  totalCount = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0)
  );

  // "قیمت کالاها" — priced at the pre-discount (old) price where the book
  // has one, so subtotal - discount lines up with the actual total below.
  subtotal = computed(() =>
    this.itemsSignal().reduce((sum, item) => {
      const unitPrice = parseFloat(item.oldPrice || item.price) || 0;
      return sum + unitPrice * item.quantity;
    }, 0)
  );

  discount = computed(() => this.subtotal() - this.totalPrice());

  // No shipping-cost model exists yet — free shipping is the only real
  // policy to state until one does.
  shipping = computed(() => 0);

  total = computed(() => this.totalPrice() + this.shipping());

  constructor() {
    // Runs at start and whenever the person logs in or out.
    effect(() => {
      const isLoggedIn = this.authService.isLoggedIn();
      untracked(() => this.onLoginChanged(isLoggedIn));
    });
  }

  addToCart(book: Book, quantity = 1) {
    if (book.id === undefined) {
      return;
    }

    const items = this.itemsSignal();
    const existing = items.find(item => item.id === book.id);

    if (existing) {
      this.setItems(items.map(item => (
        item.id === existing.id ? { ...item, quantity: existing.quantity + quantity, stock: book.stock } : item
      )));
      this.saveQuantityOnServer(existing.id, existing.quantity + quantity);
      return;
    }

    const newItem: CartItem = {
      id: book.id,
      title: book.title ?? '',
      image: book.image ?? '',
      price: String(book.price ?? 0),
      oldPrice: book.oldPrice ? String(book.oldPrice) : undefined,
      quantity,
      stock: book.stock
    };

    this.setItems([...items, newItem]);
    this.saveQuantityOnServer(newItem.id, quantity);
  }

  /**
   * Adds a book after checking its CURRENT stock on the server (the list on screen can be old),
   * and tells the person why when it cannot be added.
   * @returns true when the book is in the cart now
   */
  async addCheckedToCart(book: Book, quantity = 1): Promise<boolean> {
    if (book.id === undefined) {
      return false;
    }

    // On failure the API helper already showed the message (for example the book is hidden now).
    const result = await this.booksApiService.getBookById(book.id);

    if (!result.isSuccess || !result.data) {
      return false;
    }

    const currentBook = result.data;
    const stock = currentBook.stock ?? 0;

    if (stock <= 0) {
      this.toast.error('این کتاب فعلاً ناموجود است.');
      return false;
    }

    const existing = this.itemsSignal().find(item => item.id === book.id);
    const inCart = existing ? existing.quantity : 0;

    if (inCart + quantity > stock) {
      const inCartText = inCart > 0 ? ` و ${inCart} عدد در سبد شماست` : '';
      this.toast.warning(`فقط ${stock} عدد از این کتاب موجود است${inCartText}.`);
      return false;
    }

    this.addToCart(currentBook, quantity);
    this.toast.success('به سبد خرید اضافه شد.', { label: 'مشاهده سبد', route: '/cart' });
    return true;
  }

  removeFromCart(id: number) {
    this.setItems(this.itemsSignal().filter(item => item.id !== id));
    this.saveQuantityOnServer(id, 0);
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }

    this.setItems(
      this.itemsSignal().map(item => (item.id === id ? { ...item, quantity } : item))
    );
    this.saveQuantityOnServer(id, quantity);
  }

  clear() {
    this.setItems([]);

    if (this.authService.isLoggedIn()) {
      void this.cartApiService.clearCart();
    }
  }

  private setItems(items: CartItem[]) {
    this.itemsSignal.set(items);

    // A logged-in cart lives on the server, not in the browser.
    if (!this.authService.isLoggedIn()) {
      this.saveToStorage(items);
    }
  }

  private onLoginChanged(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.wasLoggedIn = true;
      void this.syncAfterLogin();
      return;
    }

    // Logged out: the saved cart stays on the server, this browser starts with an empty one.
    if (this.wasLoggedIn) {
      this.wasLoggedIn = false;
      this.itemsSignal.set([]);
      this.saveToStorage([]);
    }
  }

  // Adds the guest cart to the saved cart (once), then shows the saved cart.
  private async syncAfterLogin(): Promise<void> {
    const guestItems = this.loadFromStorage();

    if (guestItems.length > 0) {
      const request = new MergeCartRequestModel();

      for (const item of guestItems) {
        const line = new SetCartQuantityRequestModel();
        line.bookId = item.id;
        line.quantity = item.quantity;
        request.lines.push(line);
      }

      const merged = await this.cartApiService.mergeCart(request);

      // Kept in the browser when it failed, so the next start tries again.
      if (merged.isSuccess) {
        this.saveToStorage([]);
      }
    }

    await this.loadFromServer();
  }

  private async loadFromServer(): Promise<void> {
    const result = await this.cartApiService.getMyCart();

    if (!result.isSuccess || !result.data) {
      return;
    }

    this.itemsSignal.set(result.data.map(item => this.toCartItem(item)));
  }

  // The saved cart changes one book at a time; if the server refuses, show what the server has.
  private async saveQuantityOnServer(bookId: number, quantity: number): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    const request = new SetCartQuantityRequestModel();
    request.bookId = bookId;
    request.quantity = quantity;

    const result = await this.cartApiService.setQuantity(request);

    if (!result.isSuccess) {
      await this.loadFromServer();
    }
  }

  // The cart page still works with prices as text (see DECISIONS 2026-10-12).
  private toCartItem(item: CartItemResponseModel): CartItem {
    return {
      id: item.id,
      title: item.title,
      image: item.image,
      price: String(item.price),
      oldPrice: item.oldPrice !== null ? String(item.oldPrice) : undefined,
      quantity: item.quantity,
      stock: item.stock
    };
  }

  private loadFromStorage(): CartItem[] {
    if (!this.isBrowser) {
      return [];
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]) {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}
