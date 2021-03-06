import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { PageManager } from '../../../model/page-manager';
import { ColumnMetadata } from '../../../model/column-metadata';
import { PageMode } from '../../../model/page-mode.enum';
import { SelectionModel } from '@angular/cdk/collections';
import { GridViewMode } from '../../../model/grid-view-mode.enum';
import { Theme } from '../../../model/theme.enum';
import { DynamicUtil } from '../../../model/dynamic-util';
import { DynamicPopoverService } from '../../../services/dynamic-popover.service';
import { PopoverConfig } from '../../../model/popover-config';
import { PopoverContent } from '../../../model/popover-content';
import { PopoverRef } from '../../../model/popover-ref';

let confUniqueId = 0;

@Component({
  selector: 'zee-dynamic-grid-configurer',
  templateUrl: './dynamic-grid-configurer.component.html',
  styleUrls: ['./dynamic-grid-configurer.component.scss']
})
export class DynamicGridConfigurerComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  manager: PageManager<any>;
  @Input()
  theme: Theme = Theme.dark;
  metamodel: Array<ColumnMetadata>;
  dropdownId = 'dropdownId_' + confUniqueId++;
  selection: SelectionModel<ColumnMetadata>;
  mode: PageMode;
  gridViewMode: GridViewMode;

  private popoverRef: PopoverRef<any, any>;

  constructor(private popoverService: DynamicPopoverService) {
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
          this.manager.setGridViewMode(GridViewMode.COMPACT);
      } else if (this.gridViewMode === GridViewMode.COMPACT) {
          this.manager.setGridViewMode(GridViewMode.MINIMIZED);
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
      if (this.popoverRef) {
        this.popoverRef.close();
        this.popoverRef = null;
      }
  }

  private storeGridColumnSelectionSetting(): void {
      if (this.manager && this.selection) {
          let displayedColumns = null;
          if (this.selection.selected) {
              displayedColumns = this.selection.selected
                  .sort((c1, c2) => (c1.order > c2.order ? 1 : c1.order < c2.order ? -1 : 0))
                  .map(cmd => cmd.path);
          }
          if (displayedColumns) {
              this.manager.storeSetting('displayedColumns', displayedColumns);
          } else {
              this.manager.clearSetting('displayedColumns');
          }
      }
  }


    public openPopup(origin: HTMLElement, content: PopoverContent): void {
        const config: PopoverConfig = { title: 'dynamic.popup.configure-grid.title', i18n: true };
        this.popoverRef = this.popoverService.openPopup(origin, content, {}, config);
        this.popoverRef.afterClosed$.subscribe(() => {
            this.popoverRef = null;
        });
    }

  ngOnInit() {
      this.manager.gridColumns().subscribe(cols => {
          this.metamodel = cols.filter(cmd => cmd.listable);
      });
      this.selection = this.manager.gridColumnsSelection();
      this.collect = this.manager.mode().subscribe(mode => {
          this.mode = mode;
      });
      this.collect = this.manager.gridViewMode().subscribe(gridViewMode => {
          this.gridViewMode = gridViewMode;
      });
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      this.selection = undefined;
      this.metamodel = undefined;
      if (this.popoverRef) {
        this.popoverRef.close();
        this.popoverRef = null;
      }
  }
}

