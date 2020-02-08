import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { PageBuilder } from '../../../model/page-builder';
import { ColumnMetadata } from '../../../model/column-metadata';
import { PageMode } from '../../../model/page-mode.enum';
import { SelectionModel } from '@angular/cdk/collections';
import { GridViewMode } from '../../../model/grid-view-mode.enum';
import { Theme } from '../../../model/theme.enum';
import { DynamicUtil } from '../../../model/dynamic-util';

let confUniqueId = 0;

@Component({
  selector: 'zee-dynamic-grid-configurer',
  templateUrl: './dynamic-grid-configurer.component.html',
  styleUrls: ['./dynamic-grid-configurer.component.scss']
})
export class DynamicGridConfigurerComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  builder: PageBuilder<any>;
  @Input()
  theme: Theme = Theme.dark;
  metamodel: Array<ColumnMetadata>;
  dropdownId = 'dropdownId_' + confUniqueId++;
  selection: SelectionModel<ColumnMetadata>;
  mode: PageMode;
  gridViewMode: GridViewMode;

  constructor() {
      super();
      this.metamodel = null;
  }

  get configurerButtonClass(): string {
      return 'btn btn-sm ' + DynamicUtil.buttonThemeFor(this.theme);
  }

  get gridToogleIconClass(): string {
      return this.gridViewMode === GridViewMode.MINIMIZED ? 'angle-double-right' : 'angle-double-left';
  }

  isSelected(cmd: ColumnMetadata): boolean {
      return !!cmd.showWhenGrid;
  }

  toogleGrid(): void {
      if (this.gridViewMode === GridViewMode.MINIMIZED) {
          this.builder.setGridViewMode(GridViewMode.COMPACT);
      } else if (this.gridViewMode === GridViewMode.COMPACT) {
          this.builder.setGridViewMode(GridViewMode.MINIMIZED);
      }
  }

  reconfigure($event: any, cmd: ColumnMetadata): void {
      $event.stopPropagation();
      if (this.selection.isSelected(cmd)) {
          cmd.showWhenGrid = false;
          this.selection.deselect(cmd);
      } else {
          cmd.showWhenGrid = true;
          this.selection.select(cmd);
      }
      this.storeGridColumnSelectionSetting();
  }

  private storeGridColumnSelectionSetting(): void {
      if (this.builder && this.selection) {
          let displayedColumns = null;
          if (this.selection.selected) {
              displayedColumns = this.selection.selected
                  .sort((c1, c2) => (c1.order > c2.order ? 1 : c1.order < c2.order ? -1 : 0))
                  .map(cmd => cmd.path);
          }
          if (displayedColumns) {
              this.builder.storeSetting('displayedColumns', displayedColumns);
          } else {
              this.builder.clearSetting('displayedColumns');
          }
      }
  }

  ngOnInit() {
      this.builder.gridColumns().subscribe(cols => {
          this.metamodel = cols.filter(cmd => cmd.listable);
      });
      this.selection = this.builder.gridColumnsSelection();
      this.collect = this.builder.mode().subscribe(mode => {
          this.mode = mode;
      });
      this.collect = this.builder.gridViewMode().subscribe(gridViewMode => {
          this.gridViewMode = gridViewMode;
      });
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      this.selection = undefined;
      this.metamodel = undefined;
  }
}

