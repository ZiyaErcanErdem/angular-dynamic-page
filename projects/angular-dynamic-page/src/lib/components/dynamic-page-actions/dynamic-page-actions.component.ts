import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BasePanelView } from '../../model/base-panel-view';
import { PageManager } from '../../model/page-manager';
import { Criteria } from '../../model/criteria';
import { Subscription } from 'rxjs';
import { DynamicAction, GenericDynamicAction, ActionScope, ActionType, DynamicActionBuilder } from '../../model/dynamic-action';
import { PageConfig } from '../../model/page-config';
import { PanelState } from '../../model/panel-state.enum';
import { Theme } from '../../model/theme.enum';
import { PageType } from '../../model/page-type.enum';
import { DynamicUtil } from '../../model/dynamic-util';

@Component({
  selector: 'zee-dynamic-page-actions',
  templateUrl: './dynamic-page-actions.component.html',
  styleUrls: ['./dynamic-page-actions.component.scss']
})
export class DynamicPageActionsComponent extends BasePanelView implements OnInit, OnDestroy {
  @Input()
  manager: PageManager<any>;
  @Input()
  public theme: Theme;

  public query: Criteria;

  private actionSubscription: Subscription;
  queryActions: Array<DynamicAction<any>> = [];

  public queryEnabled: boolean;
  private config: PageConfig<any>;
  private registeredActions: Array<GenericDynamicAction<any>> = [];

  constructor() {
      super();
      this.theme = Theme.dark;
      this.queryEnabled = false;
      this.panelState = this.queryEnabled ? PanelState.EXPANDED : PanelState.COLLAPSED;
      this.destroyActionsOnClean = false;
  }

  get panelMaximizable(): boolean {
      return this.config && (this.config.pageType === PageType.PAGE || this.config.pageType === PageType.CHILD_PAGE);
  }

  public handlePanelStateChange(state: PanelState): void {
      if (state === PanelState.COLLAPSED) {
          this.queryEnabled = false;
      } else {
          this.queryEnabled = true;
      }
  }

  private buildActions(): void {
      if (!this.actionSubscription) {
          this.actionSubscription = this.manager.actions().subscribe(actionList => {
              const allPageActions = actionList
                  .filter(a => a.containsScope(ActionScope.PAGE))
                  .sort((a, b) => -1 * (a.order > b.order ? 1 : a.order === b.order ? 0 : -1));

              this.panelActions = allPageActions.filter(a => a.type !== ActionType.LIST);
              this.queryActions = allPageActions.filter(a => a.type === ActionType.LIST);
          });
      }
  }

  ngOnInit() {
      this.config = this.manager.config;
      this.collect = this.manager.query().subscribe(q => (this.query = q));
      this.registerActions();
      this.buildActions();
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      this.registeredActions.forEach(a => this.manager.unregisterAction(a));

      if (this.actionSubscription) {
          const s = this.actionSubscription;
          this.actionSubscription = undefined;
          s.unsubscribe();
      }
      this.query = undefined;

      if (this.queryActions) {
          // this.queryActions.forEach(a => a.destroy());
          this.queryActions = undefined;
      }
      if (this.registeredActions) {
          this.registeredActions.forEach(a => a.destroy());
          this.registeredActions = undefined;
      }
  }

  private registerAction(action: GenericDynamicAction<any>) {
      this.registeredActions.push(action);
      this.manager.registerAction(action);
  }

  private registerActions(): void {
      let action: GenericDynamicAction<any> = null;

      action = new DynamicActionBuilder<any>('page.refresh', ActionType.CUSTOM)
          .withScope(ActionScope.PAGE)
          .withLabel('dynamic.action.refresh')
          .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
          .withIconClass('sync')
          .withOrder(100)
          .withHandler((comp, d) => {
              comp.disabled = true;
              this.search();
              comp.disabled = false;
          })
          .build();
      this.registerAction(action);

      action = new DynamicActionBuilder<any>('page.search', ActionType.SEARCH)
          .withScope(ActionScope.PAGE)
          .withLabel('dynamic.action.search')
          .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
          .withIconClass('search')
          .withOrder(101)
          .withHandler((comp, d) => {
              comp.disabled = true;
              this.toggleQueryEditor();
              comp.disabled = false;
          })
          .build();
      this.registerAction(action);

      action = new DynamicActionBuilder<any>('page.list', ActionType.LIST)
          .withScope(ActionScope.PAGE)
          .withLabel('dynamic.action.list')
          .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
          .withIconClass('list')
          .withOrder(103)
          .withHandler((comp, d) => {
              comp.disabled = true;
              this.search();
              comp.disabled = false;
          })
          .build();
      this.registerAction(action);

      action = new DynamicActionBuilder<any>('page.query.clear', ActionType.LIST)
          .withScope(ActionScope.PAGE)
          .withLabel('dynamic.action.clear')
          .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
          .withIconClass('undo')
          .withOrder(102)
          .withHandler((comp, d) => {
              comp.disabled = true;
              this.resetQuery();
              comp.disabled = false;
          })
          .build();
      this.registerAction(action);
  }

  public toggleQueryEditor(): void {
      this.queryEnabled = !this.queryEnabled;
      this.panelState = this.queryEnabled ? PanelState.EXPANDED : PanelState.COLLAPSED;
  }

  search() {
      this.manager.search(this.query).subscribe();
  }

  private resetQuery(): void {
      this.manager.resetQuery();
  }
}

