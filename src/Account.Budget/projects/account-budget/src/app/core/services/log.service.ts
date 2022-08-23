import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  error(err: any) {
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
