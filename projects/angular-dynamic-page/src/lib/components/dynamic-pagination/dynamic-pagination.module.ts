import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPaginationComponent } from './dynamic-pagination.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicItemCountModule } from '../dynamic-item-count/dynamic-item-count.module';
import { DynamicItemCountComponent } from '../dynamic-item-count/dynamic-item-count.component';



@NgModule({
  declarations: [DynamicPaginationComponent],
  imports: [
    CommonModule, DynamicCoreModule, DynamicItemCountModule
  ],
  exports: [DynamicPaginationComponent, DynamicItemCountComponent]
})
export class DynamicPaginationModule { }
