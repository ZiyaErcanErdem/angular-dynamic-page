import { Component, OnInit, Output, OnDestroy, EventEmitter, Input } from '@angular/core';
import { BasePanelView } from '../../model/base-panel-view';
import { TableField } from '../../model/table-field';
import { TableFieldControl } from '../../model/table-field-control';
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
      this._control = value;
      if (!value) {
          this._control = new TableFieldControl();
      }
  }
  get control(): TableFieldControl<any> {
      return this._control;
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
      return this.title ? this.title : this._control ? this._control.title : '';
  }

  get actions(): Array<DynamicAction<any>> {
      return this._control ? this._control.actions : [];
  }

  get filterEnabled(): boolean {
      return !!(this.control && this._showFilter);
  }

  get filteredValue(): string {
      return this._filteredValue;
  }
  set filteredValue(value: string) {
      this._filteredValue = value;
      if (this.control) {
          this.control.filteredValue = this._filteredValue;
          this.control.filter();
      }
  }

  get pageSizingEnabled(): boolean {
      return !!(this.control && this.control.paginator && this._enablePageSizing);
  }

  get pageSize(): number {
      return this._pageSize;
  }
  set pageSize(value: number) {
      this._pageSize = value;
      if (this.control && this.control.paginator) {
          this.control.paginator.pageSize = this._pageSize;
          this.control.paginator.pageIndex = 0;
      }
  }

  private _control: TableFieldControl<any>;

  private filterAction: GenericDynamicAction<any>;
  private _showFilter: boolean;
  private _filteredValue: string;

  public pageSizeList: Array<number>;
  private _enablePageSizing: boolean;
  private _pageSize: number;

  constructor() {
      super();
      this.theme = Theme.dark;
      this.panelState = PanelState.EXPANDED;
      this._showFilter = false;

      this._enablePageSizing = true;
      this.pageSizeList = [2, 5, 10, 20, 50, 100, 200];
  }

  ngOnInit() {
      if (this.control) {
          this.registerActions();
          if (this.control.paginator) {
              this._pageSize = this.control.paginator.pageSize;
          }
      }
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      if (this.filterAction) {
          this.filterAction.destroy();
          this.filterAction = undefined;
      }
      this._control = undefined;
  }

  private toggleFilter(): void {
      this._showFilter = !this._showFilter;
      if (!this._showFilter) {
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
