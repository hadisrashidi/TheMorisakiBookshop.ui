import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from '../models/cart-item.model';
import { Book } from '../../features/home/models/book.model';
import { BooksApiService } from '../../features/books/services/books.api.service';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'morisaki-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private booksApiService = inject(BooksApiService);
  private toast = inject(ToastService);

  private itemsSignal = signal<CartItem[]>(this.loadFromStorage());

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
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }

    this.setItems(
      this.itemsSignal().map(item => (item.id === id ? { ...item, quantity } : item))
    );
  }

  clear() {
    this.setItems([]);
  }

  private setItems(items: CartItem[]) {
    this.itemsSignal.set(items);
    this.saveToStorage(items);
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
