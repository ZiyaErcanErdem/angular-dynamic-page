import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicExcelComponent } from './dynamic-excel.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicPanelModule } from '../dynamic-panel/dynamic-panel.module';



@NgModule({
  declarations: [DynamicExcelComponent],
  imports: [
    CommonModule, DynamicCoreModule, DynamicPanelModule
  ],
  exports: [DynamicExcelComponent],
  entryComponents: [DynamicExcelComponent]
})
export class DynamicExcelModule { }
