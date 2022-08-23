import { AbstractControl } from '@angular/forms';

export function passwordValidator(control: AbstractControl): { [key: string]: any } | null {
  // {6,100}           - Assert password is between 6 and 100 characters
  // (?=.*[0-9])       - Assert a string has at least one number
  // (?!.*\s)          - Spaces are not allowed
  // tslint:disable-next-line
  if (control.value.match(/^(?=.*\d)(?=.*[a-zA-Z!@#$%^&*])(?!.*\s).{6,100}$/)) {
    return null;
  } else {
    return { 'invalidPassword': true };
  }
}
