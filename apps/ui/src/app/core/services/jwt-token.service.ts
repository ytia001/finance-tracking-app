import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class JwtTokenService {
  private tokenSignal = signal<string | null>(null);
  private userSignal = signal<any | null>(null);

  token = this.tokenSignal.asReadonly();
  user = this.userSignal.asReadonly();

  constructor() {
    this.restoreFromStorage();
  }

  setToken(token: string): void {
    this.tokenSignal.set(token);
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  setUser(user: any): void {
    this.userSignal.set(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any | null {
    return this.userSignal();
  }

  clearToken(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  hasToken(): boolean {
    return !!this.tokenSignal();
  }

  restoreFromStorage(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    if (token) {
      this.tokenSignal.set(token);
    }
    if (userStr) {
      try {
        this.userSignal.set(JSON.parse(userStr));
      } catch {
        this.clearToken();
      }
    }
  }
}