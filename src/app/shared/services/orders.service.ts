import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Order, OrderLine } from '../models/order.model';
import { CartItem } from '../models/cart-item.model';
import { formatJalali, todayJalali } from '../utils/jalali';

const STORAGE_KEY = 'morisaki-orders';

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

// Orders placed at checkout are recorded here so the profile's order
// history reflects real purchases rather than sample rows. Backed by
// localStorage until there's an orders API.
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private ordersSignal = signal<Order[]>(this.loadFromStorage());

  orders = this.ordersSignal.asReadonly();
  count = computed(() => this.ordersSignal().length);

  /** Newest first, capped — for the profile page's summary table. */
  recent = computed(() => this.ordersSignal().slice(0, 5));

  placeOrder(items: readonly CartItem[], totals: OrderTotals): Order {
    const lines: OrderLine[] = items.map(item => ({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price,
      quantity: item.quantity
    }));

    const order: Order = {
      id: '#' + Math.floor(10000 + Math.random() * 89999),
      date: formatJalali(todayJalali()),
      itemsCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      status: 'در حال پردازش',
      lines
    };

    this.setOrders([order, ...this.ordersSignal()]);
    return order;
  }

  getById(id: string): Order | undefined {
    return this.ordersSignal().find(o => o.id === id);
  }

  private setOrders(orders: Order[]) {
    this.ordersSignal.set(orders);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
  }

  private loadFromStorage(): Order[] {
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
}
