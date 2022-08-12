import { LoggerService } from '@account-budget/services';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

function logError(error: any): void {
  inject(LoggerService).error(error);
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        logError(error);

        // switch (error?.status) {
        //   case 400:
        //     this.toastrService.error('Bad Request', error.status);
        //     break;
        //   case 404:
        //     this.toastrService.error('Item not found', error.status);
        //     break;
        //   case 401:
        //     this.toastrService.error('Unauthorize', error.status);
        //     break;
        //   case 500:
        //     this.toastrService.error('Some thing wrong in the server', error.status);
        //     break;
        //   default:
        //     this.toastrService.error('An unknown error occurred', error.status);
        //     break;
        // }

        return throwError(() => error);
      }),
    );
  }
}
