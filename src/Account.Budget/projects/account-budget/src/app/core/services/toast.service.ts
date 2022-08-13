import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

function getMatSnackBar(): MatSnackBar {
  return inject(MatSnackBar);
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  show(message: string, action: string = 'OK', duration: number = 3000) {
    getMatSnackBar().open(message, action, { duration });
  }
}
