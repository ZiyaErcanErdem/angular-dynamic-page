import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicAlertComponent } from './dynamic-alert.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';



@NgModule({
  declarations: [DynamicAlertComponent],
  imports: [
    CommonModule,
    DynamicCoreModule
  ],
  exports: [DynamicAlertComponent],
  entryComponents: [DynamicAlertComponent]
})
export class DynamicAlertModule { }
