import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicGridComponent } from './dynamic-grid.component';
import { DynamicCellViewPipe } from './pipes/dynamic-cell-view.pipe';
import { DynamicGridActionsComponent } from './dynamic-grid-actions/dynamic-grid-actions.component';
import { DynamicGridConfigurerComponent } from './dynamic-grid-configurer/dynamic-grid-configurer.component';
import { DynamicSortHeaderComponent } from './dynamic-sort-header/dynamic-sort-header.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicPaginationModule } from '../dynamic-pagination/dynamic-pagination.module';
import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';


@NgModule({
  declarations: [
    DynamicGridComponent,
    DynamicCellViewPipe,
    DynamicGridActionsComponent,
    DynamicGridConfigurerComponent,
    DynamicSortHeaderComponent],
  imports: [
    CommonModule,
    DynamicCoreModule,
    CdkTableModule,
    FlexLayoutModule,
    DynamicPaginationModule,
    DynamicButtonModule
  ],
  exports: [DynamicGridComponent, DynamicCellViewPipe]
})
export class DynamicGridModule { }
