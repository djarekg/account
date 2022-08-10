import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {LayoutModule} from '@account-budget/layout';
import {AccountRoutingModule} from './account-routing.module';
import {AccountComponent} from './account.component';
import {LoginComponent} from './login/login.component';

@NgModule({
  declarations: [AccountComponent, LoginComponent],
  imports: [CommonModule, AccountRoutingModule, LayoutModule],
})
export class AccountModule {}
