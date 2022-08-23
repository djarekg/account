import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const DURATION = 5000;

// function getMatSnackBar(): MatSnackBar {
//   return inject(MatSnackBar);
// }

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private readonly snackBar: MatSnackBar) {}

  show(message: string, action: string = 'OK', duration: number = DURATION) {
    // getMatSnackBar().open(message, action, { duration });
    this.snackBar.open(message, action, { duration });
  }
}
