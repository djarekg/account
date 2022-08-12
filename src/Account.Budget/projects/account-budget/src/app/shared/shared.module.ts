import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleStrategy } from '@angular/router';

import { httpInterceptorProviders } from './interceptors';
import { TemplatePageTitleStrategy } from './strategies';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule],
  exports: [CommonModule, FormsModule],
  providers: [
    httpInterceptorProviders,
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
  ],
})
export class SharedModule {}
