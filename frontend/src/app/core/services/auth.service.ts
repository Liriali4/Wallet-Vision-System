import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User, AuthData, LoginCredentials, RegisterData } from '../interfaces/api.interface';

type PasswordResetResponse = {
  reset_url?: string;
  email_delivery?: string;
} | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.checkAuth();
  }

  private checkAuth(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        this.currentUserSubject.next(parsedUser);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Erro ao parsear usuario do localStorage:', error);
        this.logout();
      }
    }
  }

  register(data: RegisterData): Observable<AuthData> {
    this.loadingSubject.next(true);

    return this.apiService.post<AuthData>('auth/register', {
      email: data.email,
      password: data.password,
      full_name: data.full_name
    }).pipe(
      tap(authData => this.handleAuthResponse(authData)),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  login(credentials: LoginCredentials): Observable<AuthData> {
    this.loadingSubject.next(true);

    return this.apiService.post<AuthData>('auth/login', credentials).pipe(
      tap(authData => this.handleAuthResponse(authData)),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  requestPasswordReset(email: string): Observable<PasswordResetResponse> {
    return this.apiService.post<PasswordResetResponse>('auth/forgot-password', { email });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.apiService.post<void>('auth/reset-password', { token, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  updateProfile(data: Partial<User>): Observable<void> {
    return this.apiService.put<void>('auth/profile', data).pipe(
      tap(() => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.apiService.post<void>('auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  private handleAuthResponse(data: AuthData): void {
    if (!data || !data.token || !data.user) {
      throw new Error('Dados de autenticacao invalidos');
    }

    try {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      this.currentUserSubject.next(data.user);
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      console.error('Erro ao salvar dados de autenticacao:', error);
      throw new Error('Falha ao salvar sessao');
    }
  }
}
