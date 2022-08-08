import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FooterComponent, HeaderComponent} from '.';

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [CommonModule, MatToolbarModule, MatIconModule],
  exports: [HeaderComponent, FooterComponent],
})
export class LayoutModule {}
