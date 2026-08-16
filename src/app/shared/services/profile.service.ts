import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  /** Jalali date string, e.g. "1372/05/12". */
  birthdate: string;
  /** Data URL when the user has uploaded a photo, otherwise empty. */
  avatar: string;
}

const STORAGE_KEY = 'morisaki-profile';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  phone: '',
  email: '',
  birthdate: '',
  avatar: ''
};

// Still no auth/user backend, so the profile lives in localStorage the
// same way the cart and wishlist do. Swap loadFromStorage/persist for API
// calls once accounts exist — the rest of the app only touches `profile`.
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private profileSignal = signal<UserProfile>(this.loadFromStorage());

  profile = this.profileSignal.asReadonly();

  /** First name only — for greetings where the full name is too long. */
  displayName = computed(() => this.profileSignal().name || 'کاربر مهمان');

  save(profile: UserProfile) {
    this.profileSignal.set({ ...profile });
    this.persist(this.profileSignal());
  }

  private loadFromStorage(): UserProfile {
    if (!this.isBrowser) {
      return { ...DEFAULT_PROFILE };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  }

  private persist(profile: UserProfile) {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}
