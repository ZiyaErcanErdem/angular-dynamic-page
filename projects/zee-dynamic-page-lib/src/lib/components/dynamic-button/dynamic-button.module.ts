import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicButtonComponent } from './dynamic-button.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';

@NgModule({
  declarations: [DynamicButtonComponent],
  imports: [
    CommonModule, DynamicCoreModule
  ],
  exports: [DynamicButtonComponent]
})
export class DynamicButtonModule { }
