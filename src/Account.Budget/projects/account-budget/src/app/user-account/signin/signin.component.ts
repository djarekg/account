import { AuthService, ToastService } from '@account-budget/services';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs';

interface SignInForm {
  userName: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean | null>;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  form = new FormGroup<SignInForm>({
    userName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        // Validators.minLength(8),
        // Validators.maxLength(20),
        // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]$/),
      ],
    }),
    rememberMe: new FormControl(false, { validators: [Validators.required] }),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) {}

  onSubmit() {
    const { userName, password, rememberMe } = this.form.value;

    this.authService
      .login(userName!, password!)
      .pipe(
        tap(valid => {
          if (valid) {
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            this.router.navigateByUrl(returnUrl ?? '/');
          }
        }),
        catchError(error => {
          this.toastService.show('Invalid username or password.');
          return error;
        }),
      )
      .subscribe(valid => {
        console.log(valid);
      });
  }
}
