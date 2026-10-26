import { PLATFORM_ID, Injectable, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AddressResponseModel } from '../models/address.response.model';
import { SaveAddressRequestModel } from '../models/save-address.request.model';
import { normalizeDigits } from '../utils/digits';
import { AddressesApiService } from './addresses.api.service';
import { AuthService } from './auth.service';

// Key of the old browser-only addresses; they are uploaded once, then deleted.
const OLD_LOCAL_ADDRESSES_KEY = 'morisaki-addresses';

/**
 * Addresses of the logged-in person, kept in memory for the addresses page and the checkout.
 * They live on the server (so a new browser still has them); every change reloads the list.
 */
@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  private readonly addressesApiService = inject(AddressesApiService);
  private readonly authService = inject(AuthService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly addressesSignal = signal<AddressResponseModel[]>([]);

  readonly addresses = this.addressesSignal.asReadonly();
  readonly count = computed(() => this.addressesSignal().length);

  /** Loads the addresses from the API; without a login the list is empty. */
  async load(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      this.addressesSignal.set([]);
      return;
    }

    const result = await this.addressesApiService.getMyAddresses();

    if (!result.isSuccess || !result.data) {
      return;
    }

    this.addressesSignal.set(result.data);

    if (result.data.length === 0) {
      await this.uploadOldLocalAddresses();
    }
  }

  /** @returns true when the server saved it */
  async add(address: SaveAddressRequestModel): Promise<boolean> {
    const result = await this.addressesApiService.addAddress(this.clean(address));

    return this.reloadAfter(result.isSuccess);
  }

  async update(id: number, address: SaveAddressRequestModel): Promise<boolean> {
    const result = await this.addressesApiService.updateAddress(id, this.clean(address));

    return this.reloadAfter(result.isSuccess);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.addressesApiService.deleteAddress(id);

    return this.reloadAfter(result.isSuccess);
  }

  async setDefault(id: number): Promise<boolean> {
    const result = await this.addressesApiService.setDefaultAddress(id);

    return this.reloadAfter(result.isSuccess);
  }

  private async reloadAfter(isSuccess: boolean): Promise<boolean> {
    if (isSuccess) {
      await this.load();
    }

    return isSuccess;
  }

  // Persian digits in phone / postal code become 0-9, which is what the API accepts.
  private clean(address: SaveAddressRequestModel): SaveAddressRequestModel {
    const cleaned = new SaveAddressRequestModel();
    Object.assign(cleaned, address);
    cleaned.phone = normalizeDigits(address.phone).trim();
    cleaned.postalCode = normalizeDigits(address.postalCode).trim();

    return cleaned;
  }

  // One-time move of the addresses this browser saved before they lived on the server.
  private async uploadOldLocalAddresses(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }

    const oldAddresses = this.readOldLocalAddresses();

    if (oldAddresses.length === 0) {
      return;
    }

    let allUploaded = true;

    for (const oldAddress of oldAddresses) {
      const result = await this.addressesApiService.addAddress(this.clean(oldAddress));

      if (!result.isSuccess) {
        allUploaded = false;
      }
    }

    // Kept in the browser when one failed, so nothing is lost.
    if (allUploaded) {
      localStorage.removeItem(OLD_LOCAL_ADDRESSES_KEY);
    }

    const reloaded = await this.addressesApiService.getMyAddresses();

    if (reloaded.isSuccess && reloaded.data) {
      this.addressesSignal.set(reloaded.data);
    }
  }

  private readOldLocalAddresses(): SaveAddressRequestModel[] {
    try {
      const raw = localStorage.getItem(OLD_LOCAL_ADDRESSES_KEY);

      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
