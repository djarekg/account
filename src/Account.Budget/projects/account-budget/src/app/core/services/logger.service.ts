import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  error(err: Error | HttpErrorResponse) {
    console.error(err);
  }

  info(message: string) {
    if (!environment.production) {
      console.info(message);
    }
  }

  warning(message: string) {
    if (!environment.production) {
      console.warn(message);
    }
  }
}
