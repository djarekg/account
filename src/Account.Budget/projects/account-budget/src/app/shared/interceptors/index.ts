import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpAuthInterceptor } from './http-auth.interceptor';
import { HttpBaseUrlInterceptor } from './http-base-url.interceptor';
import { HttpErrorInterceptor } from './http-error.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpBaseUrlInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
];
