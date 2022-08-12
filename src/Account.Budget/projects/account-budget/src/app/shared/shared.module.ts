import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { httpInterceptorProviders } from '.';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule],
  exports: [CommonModule, FormsModule],
  providers: [httpInterceptorProviders],
})
export class SharedModule {}
