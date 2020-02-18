import { Component, OnInit, Output, OnDestroy, EventEmitter, Input } from '@angular/core';
import { BasePanelView } from '../../model/base-panel-view';
import { TableField } from './model/table-field';
import { TableFieldControl } from './model/table-field-control';
import { DynamicUtil } from '../../model/dynamic-util';
import { Theme } from '../../model/theme.enum';
import { DynamicAction, GenericDynamicAction, DynamicActionBuilder, ActionType, ActionScope } from '../../model/dynamic-action';
import { PanelState } from '../../model/panel-state.enum';

@Component({
  selector: 'zee-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent extends BasePanelView implements OnInit, OnDestroy {
  @Output()
  rowSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  rowChange: EventEmitter<{ field: TableField<any>; row: any }> = new EventEmitter<{ field: TableField<any>; row: any }>();
  @Input()
  set control(value: TableFieldControl<any>) {
      this.fieldControl = value;
      if (!value) {
          this.fieldControl = new TableFieldControl();
      }
  }
  get control(): TableFieldControl<any> {
      return this.fieldControl;
  }

  get gridBorderTheme(): string {
      return 'border ' + DynamicUtil.borderThemeFor(this.theme) + ' rounded-bottom border-top-0';
  }

  get gridHeaderRowTheme(): string {
      return 'dyn-header-row sticky-top ' + DynamicUtil.bgThemeFor(this.theme) + ' ' + this.gridHeaderTextColor;
  }

  get gridHeaderTextColor(): string {
      return Theme.light === this.theme || Theme.warning === this.theme ? '' : 'text-white';
  }

  get paginationEnabled(): boolean {
      return !!(this.control && this.control.paginator && this.control.paginator.dataSize >= this.control.paginator.pageSize);
  }

  get tableTitle(): string {
      return this.title ? this.title : this.fieldControl ? this.fieldControl.title : '';
  }

  get actions(): Array<DynamicAction<any>> {
      return this.fieldControl ? this.fieldControl.actions : [];
  }

  get filterEnabled(): boolean {
      return !!(this.control && this.showFilter);
  }

  get filteredValue(): string {
      return this.value;
  }
  set filteredValue(value: string) {
      this.value = value;
      if (this.control) {
          this.control.filteredValue = this.value;
          this.control.filter();
      }
  }

  get pageSizingEnabled(): boolean {
      return !!(this.control && this.control.paginator && this.enablePageSizing);
  }

  get pageSize(): number {
      return this.tablePageSize;
  }
  set pageSize(value: number) {
      this.tablePageSize = value;
      if (this.control && this.control.paginator) {
          this.control.paginator.pageSize = this.tablePageSize;
          this.control.paginator.pageIndex = 0;
      }
  }

  private fieldControl: TableFieldControl<any>;

  private filterAction: GenericDynamicAction<any>;
  private showFilter: boolean;
  private value: string;

  public pageSizeList: Array<number>;
  private enablePageSizing: boolean;
  private tablePageSize: number;

  constructor() {
      super();
      this.theme = Theme.dark;
      this.panelState = PanelState.EXPANDED;
      this.showFilter = false;

      this.enablePageSizing = true;
      this.pageSizeList = [2, 5, 10, 20, 50, 100, 200];
  }

  ngOnInit() {
      if (this.control) {
          this.registerActions();
          if (this.control.paginator) {
              this.tablePageSize = this.control.paginator.pageSize;
          }
      }
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      if (this.filterAction) {
          this.filterAction.destroy();
          this.filterAction = undefined;
      }
      this.fieldControl = undefined;
  }

  private toggleFilter(): void {
      this.showFilter = !this.showFilter;
      if (!this.showFilter) {
          this.filteredValue = '';
      }
  }

  private registerActions(): void {
      this.filterAction = new DynamicActionBuilder<any>('table.filter', ActionType.SEARCH)
          .withScope(ActionScope.CUSTOM)
          .withOrder(20000)
          .withLabel('')
          .withI18n(false)
          .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
          .withIconClass('filter')
          .withHandler((comp, d) => {
              comp.disabled = true;
              this.toggleFilter();
              comp.disabled = false;
          })
          .build();
      this.control.addAction(this.filterAction);
  }

  public handleGridSelect(row: any, event: MouseEvent): void {
      if (event) {
          event.preventDefault();
      }
      this.control.toggleSelection(row);
      this.rowSelect.emit(this.control.isSelected(row) ? row : undefined);
  }
  public handleGridRowChange(change: { field: TableField<any>; row: any }): void {
      this.rowChange.emit(change);
  }

  public calcColWidth(field: TableField<any>): string {
      return field && field.colWidth ? field.colWidth : '';
  }
}
