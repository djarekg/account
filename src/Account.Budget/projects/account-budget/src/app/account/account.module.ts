import {LayoutModule} from '@account-budget/layout';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AccountRoutingModule} from './account-routing.module';
import {AccountComponent} from './account.component';
import {LoginComponent} from './login/login.component';

@NgModule({
  declarations: [LoginComponent, AccountComponent],
  imports: [CommonModule, AccountRoutingModule, LayoutModule],
})
export class AccountModule {}
