import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BasePortal } from '../../model/base-portal';
import { PageManager } from '../../model/page-manager';
import { Theme } from '../../model/theme.enum';
import { PageMode } from '../../model/page-mode.enum';
import { DynamicAction, ActionScope } from '../../model/dynamic-action';
import { PageConfig } from '../../model/page-config';
import { PageType } from '../../model/page-type.enum';
import { PanelState } from '../../model/panel-state.enum';

@Component({
  selector: 'zee-dynamic-portal',
  templateUrl: './dynamic-portal.component.html',
  styleUrls: ['./dynamic-portal.component.scss']
})
export class DynamicPortalComponent extends BasePortal implements OnInit, OnDestroy {
  @Input()
  title: string;
  @Input()
  builder: PageManager<any>;
  @Input()
  theme: Theme = Theme.dark;
  ready = false;
  mode: PageMode;

  actions: Array<DynamicAction<any>> = [];
  private pageConfig: PageConfig<any>;

  constructor() {
      super();
      this.mode = PageMode.GRID;
  }

  get pageType(): PageType {
      if (this.pageConfig) {
          return this.pageConfig.pageType;
      }
      return PageType.PAGE;
  }

  public handlePanelStateChange(state: PanelState): void {
      if (state === PanelState.CLOSED) {
          this.close();
      }
  }

  close(): void {
      this.detachView();
      this.builder.setPageMode(PageMode.GRID);
  }

  ngOnInit() {
      this.collect = this.builder.ready().subscribe(isReady => {
          if (isReady) {
              this.collect = this.builder.mode().subscribe(mode => this.setupMode(mode));
              this.pageConfig = this.builder.config;
              this.collect = this.builder.portal().subscribe(dpw => this.attachView(dpw));
              this.buildActions();
          }
      });
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      this.detachView();

      if (this.actions) {
          // this.actions.forEach(a => a.destroy());
          this.actions = undefined;
      }
  }

  private setupMode(m: PageMode): void {
      this.mode = m;
      if (this.mode === PageMode.GRID) {
          this.detachView();
      }
  }

  private buildActions(): void {
      this.collect = this.builder.actions().subscribe(actionList => {
          const portalActions = actionList
              .filter(a => this.filterAction(a))
              .filter(a => a.id !== 'close')
              .sort((a, b) => -1 * (a.order > b.order ? 1 : a.order === b.order ? 0 : -1));
          this.ready = true;
          Promise.resolve(null).then(() => (this.actions = portalActions));
      });
  }

  private filterAction(action: DynamicAction<any>): boolean {
      return (
          action.containsScope(ActionScope.EDITOR) ||
          action.containsScope(ActionScope.RELATION) ||
          action.containsScope(ActionScope.VIEW) ||
          action.containsScope(ActionScope.CUSTOM)
      );
  }
}
