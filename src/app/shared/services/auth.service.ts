import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProfileService } from './profile.service';

export interface AccountSummary {
  email: string;
  name: string;
}

interface StoredAccount {
  email: string;
  name: string;
  /** SHA-256 of the password. See the security note below. */
  passwordHash: string;
}

const ACCOUNTS_KEY = 'morisaki-accounts';
const SESSION_KEY = 'morisaki-session';

// ⚠️ Client-side only. There is no auth backend yet, so accounts live in
// localStorage and "login" just compares a hash in the browser. Passwords
// are hashed rather than stored in the clear, but this is NOT security —
// anyone with devtools can read or edit the store. Replace every method
// here with real API calls (and a server-issued token) before this goes
// anywhere near production.
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private profileService = inject(ProfileService);

  private currentSignal = signal<AccountSummary | null>(this.loadSession());

  current = this.currentSignal.asReadonly();
  isLoggedIn = computed(() => this.currentSignal() !== null);

  async register(name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const normalisedEmail = email.trim().toLowerCase();
    const accounts = this.loadAccounts();

    if (accounts.some(a => a.email === normalisedEmail)) {
      return { ok: false, error: 'حسابی با این ایمیل قبلاً ثبت شده است.' };
    }

    const account: StoredAccount = {
      email: normalisedEmail,
      name: name.trim(),
      passwordHash: await this.hash(password)
    };

    this.saveAccounts([...accounts, account]);
    this.startSession(account);

    // Seed the profile so the account page isn't blank after signing up.
    const profile = this.profileService.profile();
    this.profileService.save({ ...profile, name: account.name, email: account.email });

    return { ok: true };
  }

  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const normalisedEmail = email.trim().toLowerCase();
    const account = this.loadAccounts().find(a => a.email === normalisedEmail);

    if (!account || account.passwordHash !== (await this.hash(password))) {
      // Deliberately vague — don't reveal whether the email exists.
      return { ok: false, error: 'ایمیل یا رمز عبور نادرست است.' };
    }

    this.startSession(account);
    return { ok: true };
  }

  logout() {
    this.currentSignal.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  private startSession(account: StoredAccount) {
    const summary: AccountSummary = { email: account.email, name: account.name };
    this.currentSignal.set(summary);
    if (this.isBrowser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(summary));
    }
  }

  private async hash(value: string): Promise<string> {
    // crypto.subtle needs a secure context; localhost counts, but fall
    // back so a plain-http deploy doesn't crash the page.
    if (!this.isBrowser || !globalThis.crypto?.subtle) {
      return 'plain:' + value;
    }
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private loadAccounts(): StoredAccount[] {
    if (!this.isBrowser) {
      return [];
    }
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveAccounts(accounts: StoredAccount[]) {
    if (this.isBrowser) {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  }

  private loadSession(): AccountSummary | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
