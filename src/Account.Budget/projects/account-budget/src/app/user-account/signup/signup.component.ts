import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    userName: ['', [Validators.required]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]$/),
        Validators.minLength(8),
        Validators.maxLength(20),
      ],
    ],
    confirmPassword: ['', Validators.required, Validators.minLength(8), Validators.maxLength(20)],
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    console.log(this.form.value);
  }
}
