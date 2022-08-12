import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { FooterComponent, HeaderComponent } from '.';

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatRippleModule],
  exports: [HeaderComponent, FooterComponent],
})
export class LayoutModule {}
