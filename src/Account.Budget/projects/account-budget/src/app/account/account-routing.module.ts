import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent, LoginComponent} from '.';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: '',
    component: AccountComponent,
    children: [{path: 'login', component: LoginComponent}],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
