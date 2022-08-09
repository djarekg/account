import {LayoutModule} from '@account-budget/layout';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AccountComponent, AccountRoutingModule, LoginComponent} from '.';

@NgModule({
  declarations: [AccountComponent, LoginComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AccountRoutingModule, LayoutModule],
})
export class AccountModule {}
