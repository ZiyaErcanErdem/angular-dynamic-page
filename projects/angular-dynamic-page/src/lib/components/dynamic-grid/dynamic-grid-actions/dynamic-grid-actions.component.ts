import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { PageBuilder } from '../../../model/page-builder';
import { PageConfig } from '../../../model/page-config';
import { Subscription } from 'rxjs';
import { DynamicAction, ActionScope, ActionType } from '../../../model/dynamic-action';

@Component({
  selector: 'zee-dynamic-grid-actions',
  templateUrl: './dynamic-grid-actions.component.html',
  styleUrls: ['./dynamic-grid-actions.component.scss']
})
export class DynamicGridActionsComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  builder: PageBuilder<any>;

  private pageConfig: PageConfig<any>;
  private _actionSubscription: Subscription;
  actions: Array<DynamicAction<any>> = [];

  constructor() {
      super();
  }

  private buildActions(): void {
      this.pageConfig = this.builder.config;
      if (!this._actionSubscription) {
          this._actionSubscription = this.builder.actions().subscribe(actionList => {
              this.actions = actionList
                  .filter(a => this.canOperate(a))
                  .sort((a, b) => -1 * (a.order > b.order ? 1 : a.order === b.order ? 0 : -1));
          });
      }
  }

  private canOperate(action: DynamicAction<any>): boolean {
      if (!action.containsScope(ActionScope.GRID)) {
          return false;
      }

      switch (action.type) {
          case ActionType.CREATE: {
              return this.pageConfig.canCreate;
          }
          case ActionType.UPDATE: {
              return this.pageConfig.canEdit;
          }
          case ActionType.DELETE: {
              return this.pageConfig.canDelete;
          }
          default: {
              return true;
          }
      }
  }

  ngOnInit() {
      this.buildActions();
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      if (this._actionSubscription) {
          const s = this._actionSubscription;
          this._actionSubscription = undefined;
          s.unsubscribe();
      }
      if (this.actions) {
          // this.actions.forEach(a => a.destroy());
          this.actions = undefined;
      }
  }
}
