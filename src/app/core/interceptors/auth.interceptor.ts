import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip token for auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const token = authService.token();

  if (token) {
    req = addTokenToRequest(req, token);
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addTokenToRequest(request: any, token: string): any {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(request: any, next: any, authService: AuthService): any {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: { token: string }) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.token);
        return next(addTokenToRequest(request, response.token));
      }),
      catchError(error => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => error);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addTokenToRequest(request, token!)))
    );
  }
}
