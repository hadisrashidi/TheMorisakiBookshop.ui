import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Address } from '../models/address.model';

const STORAGE_KEY = 'morisaki-addresses';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private addressesSignal = signal<Address[]>(this.loadFromStorage());

  addresses = this.addressesSignal.asReadonly();
  count = computed(() => this.addressesSignal().length);

  add(address: Omit<Address, 'id'>) {
    const created: Address = { ...address, id: crypto.randomUUID() };
    const list = [...this.addressesSignal(), created];
    this.setAddresses(created.isDefault ? this.applyDefault(list, created.id) : list);
  }

  update(id: string, changes: Omit<Address, 'id'>) {
    const list = this.addressesSignal().map(a => (a.id === id ? { ...changes, id } : a));
    this.setAddresses(changes.isDefault ? this.applyDefault(list, id) : list);
  }

  remove(id: string) {
    this.setAddresses(this.addressesSignal().filter(a => a.id !== id));
  }

  setDefault(id: string) {
    this.setAddresses(this.applyDefault(this.addressesSignal(), id));
  }

  // Exactly one address can be the default.
  private applyDefault(list: Address[], id: string): Address[] {
    return list.map(a => ({ ...a, isDefault: a.id === id }));
  }

  private setAddresses(addresses: Address[]) {
    this.addressesSignal.set(addresses);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    }
  }

  private loadFromStorage(): Address[] {
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
