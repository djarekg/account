import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { LoggerService } from '@account/budget/services';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        this.logger.error(err);

        // switch (error?.status) {
        //   case 400:
        //     this.toasterService.error('Bad Request', error.status);
        //     break;
        //   case 404:
        //     this.toasterService.error('Item not found', error.status);
        //     break;
        //   case 401:
        //     this.toasterService.error('Unauthorize', error.status);
        //     break;
        //   case 500:
        //     this.toasterService.error('Some thing wrong in the server', error.status);
        //     break;
        //   default:
        //     this.toasterService.error('An unknown error occurred', error.status);
        //     break;
        // }

        return throwError(() => err);
      }),
    );
  }
}
