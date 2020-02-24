import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicNotifierComponent } from './dynamic-notifier.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicAlertModule } from '../dynamic-alert/dynamic-alert.module';



@NgModule({
  declarations: [DynamicNotifierComponent],
  imports: [
    CommonModule,
    DynamicCoreModule,
    DynamicAlertModule
  ],
  exports: [DynamicNotifierComponent],
  entryComponents: [DynamicNotifierComponent]
})
export class DynamicNotifierModule { }
