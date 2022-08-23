import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPasswordMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true }],
})
export class PasswordMatchDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return { 'custom': true };
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password')?.value;
    const confirmPassword: string = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ NoPassswordMatch: true });
    }
  }
}
