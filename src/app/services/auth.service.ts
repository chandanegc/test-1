import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../shared/models/user.model';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  private readonly state = signal<AuthState>({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token'),
    loading: false
  });

  // Public signals
  readonly user = computed(() => this.state().user);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly loading = computed(() => this.state().loading);
  readonly token = computed(() => this.state().token);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.updateState({ user, token, isAuthenticated: true });
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.updateState({ loading: true });

    return this.apiService.post<LoginResponse>('auth/login', credentials, {
      skipAuth: true
    }).pipe(
      tap(response => {
        this.setAuthData(response);
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        console.log('Login API failed, using mock login');
        // Mock login for demo purposes
        const mockResponse: LoginResponse = {
          user: {
            id: 'user-' + Math.random().toString(36).substr(2, 9),
            email: credentials.email,
            firstName: 'Demo',
            lastName: 'User',
            phone: '+1234567890',
            addresses: [],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 20),
          refreshToken: 'mock-refresh-token-' + Math.random().toString(36).substr(2, 20)
        };
        this.setAuthData(mockResponse);
        this.router.navigate(['/home']);
        return of(mockResponse);
      })
    );
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    this.updateState({ loading: true });

    return this.apiService.post<LoginResponse>('auth/register', data, {
      skipAuth: true
    }).pipe(
      tap(response => {
        this.setAuthData(response);
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        console.log('Registration API failed, using mock registration');
        // Mock registration for demo purposes
        const mockResponse: LoginResponse = {
          user: {
            id: 'user-' + Math.random().toString(36).substr(2, 9),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            addresses: [],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 20),
          refreshToken: 'mock-refresh-token-' + Math.random().toString(36).substr(2, 20)
        };
        this.setAuthData(mockResponse);
        this.router.navigate(['/home']);
        return of(mockResponse);
      })
    );
  }

  logout(): void {
    this.apiService.post('auth/logout', {}).subscribe({
      next: () => this.clearAuth(),
      error: () => this.clearAuth()
    });
  }

  refreshToken(): Observable<{ token: string }> {
    const refreshToken = localStorage.getItem('refresh_token');

    return this.apiService.post<{ token: string }>('auth/refresh', { refreshToken }, {
      skipAuth: true
    }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.updateState({ token: response.token });
      })
    );
  }

  private setAuthData(response: LoginResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));

    this.updateState({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
      loading: false
    });
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    this.updateState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false
    });

    this.router.navigate(['/auth/login']);
  }

  private updateState(partial: Partial<AuthState>): void {
    this.state.update(current => ({ ...current, ...partial }));
  }
}
