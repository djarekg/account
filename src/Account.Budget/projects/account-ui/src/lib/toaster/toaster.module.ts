import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToasterComponent } from './toaster.component';
import { ToasterContainerDirective } from './toaster.directive';
import { ToasterService } from './toaster.service';

@NgModule({
  declarations: [ToasterComponent, ToasterContainerDirective],
  imports: [CommonModule],
  exports: [ToasterContainerDirective],
  providers: [ToasterService],
})
export class ToasterModule {}
