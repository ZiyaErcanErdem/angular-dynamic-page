import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicItemCountComponent } from './dynamic-item-count.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';



@NgModule({
  declarations: [DynamicItemCountComponent],
  imports: [
    CommonModule, DynamicCoreModule
  ],
  exports: [DynamicItemCountComponent]
})
export class DynamicItemCountModule { }
