import { Component, OnInit, OnDestroy, AfterViewInit, Input, Optional } from '@angular/core';
import { DynamicBaseComponent } from '../../model/dynamic-base-component';
import { PageManager } from '../../model/page-manager';
import { Theme } from '../../model/theme.enum';
import { Criteria } from '../../model/criteria';
import { GenericDynamicAction, DynamicActionBuilder, ActionScope, ActionType } from '../../model/dynamic-action';
import { PageMode } from '../../model/page-mode.enum';
import { GridViewMode } from '../../model/grid-view-mode.enum';
import { PageConfig } from '../../model/page-config';
import { PageType } from '../../model/page-type.enum';
import { DynamicMetamodelService } from '../../services/dynamic-metamodel.service';
import { DynamicDataService } from '../../services/dynamic-data.service';
import { DynamicPopoverService } from '../../services/dynamic-popover.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverRef } from '../../model/popover-ref';
import { EditorMode } from '../../model/editor-mode.enum';
import { DynamicUtil } from '../../model/dynamic-util';
import { DynamicExcelComponent } from '../dynamic-excel/dynamic-excel.component';

@Component({
  selector: 'zee-dynamic-page',
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.scss']
})
export class DynamicPageComponent extends DynamicBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  manager: PageManager<any>;
  @Input()
  theme: Theme = Theme.dark;
  @Input()
  title: string;

  public ready = false;
  public query: Criteria;
  public queryEnabled: boolean;

  private registeredActions: Array<GenericDynamicAction<any>> = [];
  private closeAction: GenericDynamicAction<any>;

  public pageMode: PageMode;
  public gridViewMode: GridViewMode;
  public pageConfig: PageConfig<any>;

  get isReady(): boolean {
      return this.ready && this.pageConfig !== undefined && this.pageConfig !== null;
  }

  get gridClass(): string {
      if (this.pageConfig.pageType === PageType.CHILD_PAGE) {
          return this.pageMode === PageMode.VIEW ? (this.gridViewMode === GridViewMode.MINIMIZED ? 'w-1' : 'w-34') : 'w-100';
      } else {
          return this.pageMode === PageMode.VIEW ? (this.gridViewMode === GridViewMode.MINIMIZED ? 'w-1' : 'w-34') : 'w-100';
      }
  }

  get containerClass(): string {
      if (this.pageConfig.pageType === PageType.CHILD_PAGE) {
          return this.pageMode === PageMode.VIEW ? 'flex-grow-1 ml-1' : 'd-none';
      } else {
          return this.pageMode === PageMode.VIEW ? 'flex-grow-1 ml-1' : 'd-none';
      }
  }

  get showPageActions(): boolean {
      return this.pageConfig.showPageActions && this.pageMode === PageMode.GRID;
  }

  get pageTitle(): string {
      return this.title ? this.title : this.pageConfig && this.pageConfig.pageTitle ? this.pageConfig.pageTitle : '';
  }

  constructor(
      private dynamicMetamodelService: DynamicMetamodelService,
      private dynamicDataService: DynamicDataService,
      private popoverService: DynamicPopoverService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      @Optional() private popoverRef: PopoverRef<PageManager<any>, any>
  ) {
      super();
      this.queryEnabled = false;

      this.initIfPopover();
  }

  private initIfPopover() {
      if (this.popoverRef && this.popoverRef.context) {
          this.manager = this.popoverRef.context;
          this.theme = this.popoverRef.config.theme ? this.popoverRef.config.theme : Theme.dark;
      }
  }

  ngOnInit() {
      this.handlePageConfig(this.manager.config);
      this.manager.start();
      this.collect = this.manager.query().subscribe(q => (this.query = q));
      this.collect = this.manager.dataSelectionChange().subscribe(c => this.setActionStates());
      this.collect = this.manager.mode().subscribe(mode => this.setupPageMode(mode));
      this.collect = this.manager.gridViewMode().subscribe(gridViewMode => this.setupGridViewMode(gridViewMode));
      this.collect = this.manager.onNotification().subscribe(notification => this.handleNotification(notification));
      this.collect = this.manager.ready().subscribe(isReady => {
          if (isReady) {
              Promise.resolve(null).then(() => {
                  this.ready = isReady;
                  this.registerActions();
              });
          }
      });
  }

  private handlePageConfig(config: PageConfig<any>): void {
      this.pageConfig = config;
      this.theme = this.pageConfig.pageTheme;
  }

  private handleNotification(notification: any): void {
      if (notification) {
          const message = notification.message;
          const params = notification.params;
          const notificationType = notification.notificationType;
          if (message && 'alert' === notificationType) {
              this.manager.openAlert(message, params);
          }
      }
  }

  private setupPageMode(mode: PageMode): void {
      this.pageMode = mode;
      if (this.closeAction && this.pageMode === PageMode.GRID) {
          this.closeAction.emit(undefined);
      }
  }

  private setupGridViewMode(gridViewMode: GridViewMode): void {
      this.gridViewMode = gridViewMode;
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      this.registeredActions.forEach(a => this.manager.unregisterAction(a));
      if (this.registeredActions) {
          this.registeredActions.forEach(a => a.destroy());
          this.registeredActions = undefined;
      }
      this.query = undefined;
      this.closeAction = undefined;
      if (this.manager) {
          // if (this.pageConfig.pageType !== PageType.CHILD_PAGE) {
          this.manager.destroy();
          this.manager = undefined;
          this.pageConfig = undefined;
          // } else {
          //     this.manager.detachViewer();
          // }
      }
  }

  ngAfterViewInit() {
      this.collect = this.manager.ready().subscribe(isReady => {
          if (isReady) {
              // const toh = setTimeout(() => {
                  // clearTimeout(toh);
                  if (this.manager && this.pageConfig && !this.manager.isChild()) {
                      if (this.pageConfig.autoSearch) {
                          this.search();
                      }
                  } else {
                      this.collect = this.manager
                          .parent()
                          .data()
                          .subscribe((parentData: any) => {
                              this.manager.setPageMode(PageMode.GRID);
                              this.manager.searchWith(parentData).subscribe();
                          });
                  }
              // }, 1);
          }
      });
  }

  public search(): void {
      this.manager.search(this.query).subscribe();
  }

  private openEditor(mode: EditorMode, entity?: any): void {
      if (mode === EditorMode.CREATE) {
          this.manager.openViewer(mode);
          return;
      }
      let dialogRef = this.manager.openEditor(mode);
      this.closeAction.handler = d => {
          if (dialogRef) {
              dialogRef.close();
              dialogRef = undefined;
          }
      };
  }

  private openImportExportDialog() {
      // 'dynamic.action.excel'
      const dialogRef = this.manager.openDialog<PageManager<any>, any>(
          DynamicExcelComponent,
          this.manager,
          {theme: this.theme, minWidth: '500px'}
        );
  }

  private registerAction(action: GenericDynamicAction<any>) {
      this.registeredActions.push(action);
      this.manager.registerAction(action);
  }

  private registerActions(): void {
      this.closeAction = new DynamicActionBuilder<any>('close', ActionType.CANCEL)
          .withScope(ActionScope.DIALOG)
          .withLabel('dynamic.action.cancel')
          .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
          .withIconClass('ban')
          .build();
      this.closeAction.disabled = false;
      this.closeAction.order = 999999;
      this.manager.registerAction(this.closeAction);

      let action: GenericDynamicAction<any> = null;

      if (this.pageConfig.canCreate) {
          action = new DynamicActionBuilder<any>('page.create-entity', ActionType.CREATE)
              .withScope(ActionScope.PAGE)
              .withLabel('dynamic.action.create')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('plus')
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.openEditor(EditorMode.CREATE, undefined);
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);
      }

      if (this.pageConfig.canDownloadExcel || this.pageConfig.canUploadExcel) {
          action = new DynamicActionBuilder<any>('page.import-export', ActionType.CUSTOM)
              .withScope(ActionScope.PAGE)
              .withLabel('dynamic.action.excel')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('file-excel')
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.openImportExportDialog();
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);
      }

      action = new DynamicActionBuilder<any>('grid.view-detail', ActionType.VIEW)
          .withScope(ActionScope.GRID)
          .withLabel('dynamic.action.view')
          .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
          .withIconClass('eye')
          .withHandler((comp, d) => {
              comp.disabled = true;
              if (this.manager.hasSelectedData()) {
                  const val = this.manager.getSelectedData();
                  this.openEditor(EditorMode.VIEW, val);
              }
              comp.disabled = false;
          })
          .build();
      this.registerAction(action);

      if (this.pageConfig.canEdit) {
          action = new DynamicActionBuilder<any>('grid.update', ActionType.UPDATE)
              .withScope(ActionScope.GRID)
              .withLabel('dynamic.action.save')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('edit')
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  if (this.manager.hasSelectedData()) {
                      const val = this.manager.getSelectedData();
                      this.openEditor(EditorMode.EDIT, val);
                  }
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);
      }

      if (this.pageConfig.canDelete) {
          action = new DynamicActionBuilder<any>('grid.delete', ActionType.DELETE)
              .withScope(ActionScope.GRID)
              .withLabel('dynamic.action.delete')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('trash-alt')
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  if (this.manager.hasSelectedData()) {
                      const val = this.manager.getSelectedData();
                      this.collect = this.manager.delete(val).subscribe(
                          result => {
                              this.manager.deselectData(val);
                              this.setActionStates();
                              this.manager.setPageMode(PageMode.GRID);
                          },
                          err => (comp.disabled = false),
                          () => this.setActionStates()
                      );
                  }
              })
              .build();
          this.registerAction(action);
      }

      this.setActionStates();
  }

  private setActionStates(): void {
      const hasSelectedVal = this.manager.hasSelectedData();
      this.registeredActions.forEach(a => {
          if (a.containsScope(ActionScope.GRID) && !hasSelectedVal) {
              a.disabled = true;
              return;
          }
          a.disabled = false;
      });
  }
}

