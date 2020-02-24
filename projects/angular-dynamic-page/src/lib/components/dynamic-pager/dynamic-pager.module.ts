import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPagerComponent } from './dynamic-pager.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';



@NgModule({
  declarations: [DynamicPagerComponent],
  imports: [
    CommonModule,
    DynamicCoreModule
  ],
  exports: [DynamicPagerComponent],
  entryComponents: [DynamicPagerComponent]
})
export class DynamicPagerModule { }
