import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FooterComponent, HeaderComponent} from '.';

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [CommonModule, FormsModule, MatToolbarModule, MatIconModule],
  exports: [HeaderComponent, FooterComponent],
})
export class LayoutModule {}
