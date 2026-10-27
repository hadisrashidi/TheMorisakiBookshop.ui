import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthTokenResponseModel } from '../../features/auth/models/auth-token.response.model';
import { UserModel } from '../../features/auth/models/user.model';
import { ProfileService } from './profile.service';

const SESSION_KEY = 'morisaki-auth';
const LAST_EMAIL_KEY = 'morisaki-last-email';

// Keys of the old fake login (accounts + password hashes in the browser). Removed on start.
const OLD_FAKE_AUTH_KEYS = ['morisaki-accounts', 'morisaki-session'];

/**
 * Who is logged in. Only holds the session (token + user); the API calls
 * live in AuthApiService. It does not use HttpClient, so the auth interceptor can read the token.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly profileService = inject(ProfileService);

  private readonly sessionSignal = signal<AuthTokenResponseModel | null>(this.loadSession());

  readonly current = computed(() => this.sessionSignal()?.user ?? null);
  readonly token = computed(() => this.sessionSignal()?.token ?? '');
  readonly isLoggedIn = computed(() => this.sessionSignal() !== null);
  readonly isAdmin = computed(() => this.current()?.role === 'Admin');

  /** Keeps the login the API just returned (OTP or password login). */
  startSession(session: AuthTokenResponseModel): void {
    this.sessionSignal.set(session);
    this.saveSession(session);

    // Fill the empty profile fields so the profile page is not blank after the first login.
    const profile = this.profileService.profile();
    const name = profile.name || session.user.name || '';
    const phone = profile.phone || session.user.mobile;
    const email = profile.email || session.user.email || '';
    const birthdate = session.user.birthdate || profile.birthdate;
    this.profileService.save({ ...profile, name, phone, email, birthdate });
  }

  /** Replaces the user data (e.g. after adding an email) but keeps the same token. */
  updateUser(user: UserModel): void {
    const session = this.sessionSignal();

    if (session === null) {
      return;
    }

    const updated = { ...session, user };
    this.sessionSignal.set(updated);
    this.saveSession(updated);
  }

  /** The email used at the last login with "remember me", to fill the email field next time. */
  getLastEmail(): string {
    if (!this.isBrowser) {
      return '';
    }

    return localStorage.getItem(LAST_EMAIL_KEY) ?? '';
  }

  /** Remembers the email, or forgets it when remember is false. */
  saveLastEmail(email: string, remember: boolean): void {
    if (!this.isBrowser) {
      return;
    }

    if (remember) {
      localStorage.setItem(LAST_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(LAST_EMAIL_KEY);
    }
  }

  logout(): void {
    this.sessionSignal.set(null);

    if (this.isBrowser) {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  private loadSession(): AuthTokenResponseModel | null {
    if (!this.isBrowser) {
      return null;
    }

    for (const key of OLD_FAKE_AUTH_KEYS) {
      localStorage.removeItem(key);
    }

    try {
      const raw = localStorage.getItem(SESSION_KEY);

      if (!raw) {
        return null;
      }

      const session: AuthTokenResponseModel = JSON.parse(raw);
      const isExpired = new Date(session.expiresAt).getTime() <= Date.now();

      if (!session.token || isExpired) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  private saveSession(session: AuthTokenResponseModel): void {
    if (this.isBrowser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }
}
