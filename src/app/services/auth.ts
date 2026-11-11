
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Api } from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly TOKEN_KEY = 'foodarchive_token';
  private readonly USER_KEY = 'foodarchive_user';

  // Angular Signals
  currentUser = signal<User | null>(this.loadUser());

  isLoggedIn = signal<boolean>(
    !!localStorage.getItem(this.TOKEN_KEY)
  );

  constructor(private api: Api) {}

  // REGISTER
  register(data: {
    username: string;
    email: string;
    password: string;
  }): Observable<AuthResponse> {

    return this.api.post<AuthResponse>(
      'auth/register',
      data
    );
  }

  // LOGIN
  login(data: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {

    return this.api.post<AuthResponse>(
      'auth/login',
      data
    ).pipe(
      tap(response => {

        if (response.success && response.token && response.user) {

          localStorage.setItem(this.TOKEN_KEY, response.token);

          localStorage.setItem(
            this.USER_KEY,
            JSON.stringify(response.user)
          );

          this.currentUser.set(response.user);
          this.isLoggedIn.set(true);
        }

      })
    );
  }

  // LOGOUT
  logout(): Observable<AuthResponse> {

    return this.api.post<AuthResponse>(
      'auth/logout',
      {}
    ).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }

  // CLEAR SESSION
  private clearSession(): void {

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  // GET TOKEN
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // CHECK ADMIN
  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  // LOAD SAVED USER
  private loadUser(): User | null {

    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) as User : null;
    } catch {
      return null;
    }
  }

}
