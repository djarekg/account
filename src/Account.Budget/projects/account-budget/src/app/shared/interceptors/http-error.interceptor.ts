import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { LoggerService } from '@account-budget/services';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        this.logger.error(err);

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

        return throwError(() => err);
      }),
    );
  }
}
