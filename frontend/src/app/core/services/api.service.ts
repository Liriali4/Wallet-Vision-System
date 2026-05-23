import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ApiResponse, ApiError } from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  get<T>(endpoint: string): Observable<T> {
    this.setLoading(true);
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        this.setLoading(false);
        if (!response.success) {
          throw new Error(response.message || 'Request failed');
        }
        return response.data;
      }),
      catchError(error => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    this.setLoading(true);
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        this.setLoading(false);
        if (!response.success) {
          throw new Error(response.message || 'Request failed');
        }
        return response.data;
      }),
      catchError(error => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    this.setLoading(true);
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        this.setLoading(false);
        if (!response.success) {
          throw new Error(response.message || 'Request failed');
        }
        return response.data;
      }),
      catchError(error => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    this.setLoading(true);
    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        this.setLoading(false);
        if (!response.success) {
          throw new Error(response.message || 'Request failed');
        }
        return response.data;
      }),
      catchError(error => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado';
    const requestUrl = error.url || '';
    const isPublicAuthRoute =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/forgot-password') ||
      requestUrl.includes('/auth/reset-password');

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      } else if (error.status === 401) {
        if (isPublicAuthRoute) {
          errorMessage = error.error?.message || 'Credenciais inválidas.';
        } else {
          errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else if (error.status === 403) {
        errorMessage = 'Você não tem permissão para realizar esta ação.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado.';
      } else if (error.status === 422) {
        const apiError = error.error as ApiError;
        if (apiError?.errors) {
          const fieldErrors = Object.entries(apiError.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
          errorMessage = `Erro de validação: ${fieldErrors}`;
        } else {
          errorMessage = apiError?.message || 'Erro de validação';
        }
      } else if (error.status >= 500) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('API Error:', { status: error.status, message: errorMessage, error });
    return throwError(() => new Error(errorMessage));
  }
}
