import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const isPublicAuthRoute =
      request.url.includes('/auth/login') ||
      request.url.includes('/auth/register') ||
      request.url.includes('/auth/forgot-password') ||
      request.url.includes('/auth/reset-password');

    if (token && !isPublicAuthRoute) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isPublicAuthRoute) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
