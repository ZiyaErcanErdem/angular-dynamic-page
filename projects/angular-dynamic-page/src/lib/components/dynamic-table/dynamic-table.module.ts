import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import { TableCellViewPipe } from './pipes/table-cell-view.pipe';
import { TableCellViewComponent } from './table-cell-view/table-cell-view.component';
import { TablePaginationComponent } from './table-pagination/table-pagination.component';
import { TableSortHeaderComponent } from './table-sort-header/table-sort-header.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { CdkTableModule } from '@angular/cdk/table';
import { DynamicPanelModule } from '../dynamic-panel/dynamic-panel.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DynamicPaginationModule } from '../dynamic-pagination/dynamic-pagination.module';

@NgModule({
  declarations: [
    DynamicTableComponent,
    TableCellViewPipe,
    TableCellViewComponent,
    TablePaginationComponent,
    TableSortHeaderComponent
  ],
  imports: [
    CommonModule, FormsModule, CdkTableModule, DynamicCoreModule, DynamicPanelModule, FlexLayoutModule, DynamicPaginationModule
  ],
  exports: [DynamicTableComponent],
  entryComponents: [DynamicTableComponent]
})
export class DynamicTableModule { }
