import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicContentViewComponent } from './dynamic-content-view.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicGridModule } from '../dynamic-grid/dynamic-grid.module';



@NgModule({
  declarations: [DynamicContentViewComponent],
  imports: [
    CommonModule, DynamicCoreModule, DynamicGridModule
  ],
  exports: [DynamicContentViewComponent],
  entryComponents: [DynamicContentViewComponent]
})
export class DynamicContentViewModule { }
