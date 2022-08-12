import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedModule } from '@account-budget/shared';
import { LoginComponent } from './login/login.component';
import { UserAccountRoutingModule } from './user-account-routing.module';
import { UserAccountComponent } from './user-account.component';

@NgModule({
  declarations: [UserAccountComponent, LoginComponent],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    UserAccountRoutingModule,
  ],
})
export class UserAccountModule {}
