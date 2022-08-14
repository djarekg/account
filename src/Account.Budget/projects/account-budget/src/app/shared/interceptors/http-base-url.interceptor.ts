import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpBaseUrlInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if (/^api\//.test(request.url)) {
    //   request = request.clone({
    //     url: `http://localhost:5000/${request.url}`,
    //   });
    // }

    return next.handle(request);
  }
}
