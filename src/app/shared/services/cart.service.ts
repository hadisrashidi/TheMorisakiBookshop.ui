import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from '../models/cart-item.model';
import { Book } from '../../features/home/models/book.model';

const STORAGE_KEY = 'morisaki-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private itemsSignal = signal<CartItem[]>(this.loadFromStorage());

  items = this.itemsSignal.asReadonly();

  totalCount = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0)
  );

  addToCart(book: Book, quantity = 1) {
    if (book.id === undefined) {
      return;
    }

    const items = this.itemsSignal();
    const existing = items.find(item => item.id === book.id);

    if (existing) {
      this.updateQuantity(existing.id, existing.quantity + quantity);
      return;
    }

    const newItem: CartItem = {
      id: book.id,
      title: book.title ?? '',
      image: book.image ?? '',
      price: book.price ?? '0',
      quantity
    };

    this.setItems([...items, newItem]);
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
