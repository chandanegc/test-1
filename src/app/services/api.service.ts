import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, timeout, delay } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface ApiOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  retryCount?: number;
  timeout?: number;
  skipAuth?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(endpoint: string, options: ApiOptions = {}): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), this.buildOptions(options))
      .pipe(
        this.applyRetryAndTimeout(options),
        catchError(this.handleError)
      );
  }

  post<T>(endpoint: string, body: any, options: ApiOptions = {}): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, this.buildOptions(options))
      .pipe(
        this.applyRetryAndTimeout(options),
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, body: any, options: ApiOptions = {}): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body, this.buildOptions(options))
      .pipe(
        this.applyRetryAndTimeout(options),
        catchError(this.handleError)
      );
  }

  patch<T>(endpoint: string, body: any, options: ApiOptions = {}): Observable<T> {
    return this.http.patch<T>(this.buildUrl(endpoint), body, this.buildOptions(options))
      .pipe(
        this.applyRetryAndTimeout(options),
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string, options: ApiOptions = {}): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), this.buildOptions(options))
      .pipe(
        this.applyRetryAndTimeout(options),
        catchError(this.handleError)
      );
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`.replace(/([^:]\/)\/+/g, '$1');
  }

  private buildOptions(options: ApiOptions): any {
    const httpOptions: any = {};

    if (options.headers) {
      httpOptions.headers = options.headers instanceof HttpHeaders
        ? options.headers
        : new HttpHeaders(options.headers);
    }

    if (options.params) {
      httpOptions.params = options.params instanceof HttpParams
        ? options.params
        : new HttpParams({ fromObject: options.params });
    }

    if (options.responseType) {
      httpOptions.responseType = options.responseType;
    }

    // Add auth token if not skipped
    if (!options.skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        httpOptions.headers = (httpOptions.headers || new HttpHeaders())
          .set('Authorization', `Bearer ${token}`);
      }
    }

    return httpOptions;
  }

  private applyRetryAndTimeout(options: ApiOptions) {
    return (source: Observable<any>) => {
      let piped = source;

      if (options.timeout) {
        piped = piped.pipe(timeout(options.timeout));
      }

      if (options.retryCount) {
        piped = piped.pipe(retry(options.retryCount));
      }

      // Add mock delay in development
      if (environment.features.enableMockApi) {
        piped = piped.pipe(delay(environment.apiMockDelay));
      }

      return piped;
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;

      // Handle specific status codes
      switch (error.status) {
        case 401:
          // Handle unauthorized
          this.handleUnauthorized();
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
      }
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    // Redirect to login or trigger auth refresh
  }
}
