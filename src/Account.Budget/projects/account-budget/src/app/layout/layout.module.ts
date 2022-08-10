import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FooterComponent, HeaderComponent} from '.';

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatToolbarModule],
  exports: [HeaderComponent, FooterComponent],
})
export class LayoutModule {}
