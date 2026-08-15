import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LikedItem } from '../models/liked-item.model';
import { Book } from '../../features/home/models/book.model';

const STORAGE_KEY = 'morisaki-liked';

@Injectable({
  providedIn: 'root'
})
export class LikedService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private itemsSignal = signal<LikedItem[]>(this.loadFromStorage());

  items = this.itemsSignal.asReadonly();
  count = computed(() => this.itemsSignal().length);

  isLiked(bookId: number): boolean {
    return this.itemsSignal().some(item => item.id === bookId);
  }

  toggle(book: Book, authorName?: string) {
    if (book.id === undefined) {
      return;
    }

    if (this.isLiked(book.id)) {
      this.remove(book.id);
      return;
    }

    const newItem: LikedItem = {
      id: book.id,
      title: book.title ?? '',
      image: book.image ?? '',
      price: book.price ?? '0',
      authorName
    };

    this.setItems([...this.itemsSignal(), newItem]);
  }

  remove(id: number) {
    this.setItems(this.itemsSignal().filter(item => item.id !== id));
  }

  private setItems(items: LikedItem[]) {
    this.itemsSignal.set(items);
    this.saveToStorage(items);
  }

  private loadFromStorage(): LikedItem[] {
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

  private saveToStorage(items: LikedItem[]) {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}
