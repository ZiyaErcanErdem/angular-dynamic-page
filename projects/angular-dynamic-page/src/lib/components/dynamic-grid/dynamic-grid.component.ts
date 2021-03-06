import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicBaseComponent } from '../../model/dynamic-base-component';
import { PageManager } from '../../model/page-manager';
import { Criteria } from '../../model/criteria';
import { Theme } from '../../model/theme.enum';
import { DynamicDataSource } from '../../model/dynamic-data-source';
import { ColumnMetadata } from '../../model/column-metadata';
import { PageConfig } from '../../model/page-config';
import { GridViewMode } from '../../model/grid-view-mode.enum';
import { PageType } from '../../model/page-type.enum';
import { DynamicUtil } from '../../model/dynamic-util';
import { ManagerType } from '../../model/manager-type.enum';
import { PageMode } from '../../model/page-mode.enum';
import { DynamicAlertManagerService } from '../../services/dynamic-alert-manager.service';

@Component({
  selector: 'zee-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.scss']
})
export class DynamicGridComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  manager: PageManager<any>;
  @Input()
  criteria: Criteria;
  @Input()
  theme: Theme = Theme.dark;

  dataSource: DynamicDataSource<any>;
  columns: Array<ColumnMetadata>;
  config: PageConfig<any>;
  mode: PageMode;
  gridViewMode: GridViewMode;
  ready = false;
  idColumn: ColumnMetadata;

  private displayedCols: Array<string>;

  get gridTheme(): string {
      return (
          'dyn-table ' +
          (this.pageType === PageType.PAGE
              ? 'dyn-table-page'
              : this.pageType === PageType.POPUP
                  ? 'dyn-table-popup'
                  : this.pageType === PageType.GRID
                      ? 'dyn-table-grid'
                      : this.pageType === PageType.CHILD_PAGE
                          ? 'dyn-table-child-page'
                          : '')
      );
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

  get managerType(): ManagerType {
      return this.config ? this.config.managerType : ManagerType.PAGE;
  }

  get displayedColumns() {
      return this.displayedCols;
  }

  get pageReady(): boolean {
      return this.config && this.ready;
  }

  get pageType(): PageType {
      if (this.config) {
          return this.config.pageType;
      }
      return PageType.PAGE;
  }

  get paginationEnabled(): boolean {
      if (this.gridViewMode === GridViewMode.MINIMIZED) {
          return false;
      } else if (this.config) {
          return this.config.showPagination;
      }
      return true;
  }

  constructor(private alertManagerService: DynamicAlertManagerService) {
      super();
      this.columns = new Array<ColumnMetadata>();
  }

  ngOnInit() {
      this.collect = this.manager.ready().subscribe(isReady => {
          if (isReady) {
              this.collect = this.manager.connect().subscribe(ds => (this.dataSource = ds));
              this.collect = this.manager.gridColumns().subscribe(
                  cols => {
                      this.columns = cols;
                      this.setupDisplayedColumns();
                  },
                  err => this.alertManagerService.warning({msg: err, i18n: false})
              );
              this.config = this.manager.config;
              this.collect = this.manager.mode().subscribe(mode => {
                  this.mode = mode;
                  this.setupDisplayedColumns();
              });
              this.collect = this.manager.gridViewMode().subscribe(gridViewmode => {
                  this.gridViewMode = gridViewmode;
                  this.setupDisplayedColumns();
              });
              this.collect = this.manager.gridColumnsSelection().changed.subscribe(changes => this.setupDisplayedColumns());
              this.ready = isReady;
          }
      });
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      this.dataSource = undefined;
      this.columns = [];
      this.config = undefined;
  }

  trackByFn(index: number, item: any) {
      return item.id ? item.id : index;
  }

  calcColWidth(col: ColumnMetadata): string {
      if (!col) {
          return '';
      }
      if (this.mode === PageMode.GRID) {
          return col.gridColWith ? col.gridColWith : '';
      }
      return col.compactColWidth ? col.compactColWidth : '';
  }

  private setupDisplayedColumns(): void {
      if (!this.idColumn) {
        this.idColumn = this.columns
            .filter(col => col.idColumn && col.qualifier === this.manager.qualifier)
            .reduce((acc, col) => acc = col);
      }
      if (this.mode === PageMode.GRID) {
          if (this.manager.gridColumnsSelection().selected) {
              this.displayedCols = this.manager
                  .gridColumnsSelection()
                  .selected.sort((c1, c2) => (c1.order > c2.order ? 1 : c1.order < c2.order ? -1 : 0))
                  .map(cmd => cmd.path);
          }
      } else {
          if (this.gridViewMode === GridViewMode.MINIMIZED) {
              this.displayedCols = [];
          } else {
              this.displayedCols = this.columns.filter(col => col.showWhenCompact).map(cmd => cmd.path);
          }
      }
      if (this.gridViewMode !== GridViewMode.MINIMIZED && this.displayedCols.length === 0 && this.idColumn) {
          this.displayedCols = [this.idColumn.path];
      }
      if (this.gridViewMode === GridViewMode.MINIMIZED) {
        this.displayedCols.push('idColumn');
      } else {
        this.displayedCols.push('gridActions');
      }

  }

  public handleGridSelect(row: any, event: MouseEvent): void {
      if (event) {
          event.preventDefault();
      }
      this.manager.toggleData(row);
  }

  public isSelected(data: any): boolean {
      return this.manager.isDataSelected(data);
  }

  public hasSelection(): boolean {
      return this.manager.hasSelectedData();
  }
}

