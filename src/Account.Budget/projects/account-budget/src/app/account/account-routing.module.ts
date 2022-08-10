import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from './account.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {path: '', component: AccountComponent, children: [{path: 'login', component: LoginComponent}]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
