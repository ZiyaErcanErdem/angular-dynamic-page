import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPaginationComponent } from './dynamic-pagination.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicItemCountModule } from '../dynamic-item-count/dynamic-item-count.module';
import { DynamicItemCountComponent } from '../dynamic-item-count/dynamic-item-count.component';
import { DynamicPagerModule } from '../dynamic-pager/dynamic-pager.module';



@NgModule({
  declarations: [DynamicPaginationComponent],
  imports: [
    CommonModule, DynamicCoreModule, DynamicPagerModule, DynamicItemCountModule
  ],
  exports: [DynamicPaginationComponent, DynamicItemCountComponent]
})
export class DynamicPaginationModule { }
