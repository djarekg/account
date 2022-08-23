import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TitleStrategy } from '@angular/router';

import { PasswordMatchDirective } from './directives/password-match.directive';
import { httpInterceptorProviders } from './interceptors';
import { TemplatePageTitleStrategy } from './strategies';

@NgModule({
  declarations: [PasswordMatchDirective],
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  exports: [CommonModule, FormsModule, MatSnackBarModule],
  providers: [httpInterceptorProviders, { provide: TitleStrategy, useClass: TemplatePageTitleStrategy }],
})
export class SharedModule {}
