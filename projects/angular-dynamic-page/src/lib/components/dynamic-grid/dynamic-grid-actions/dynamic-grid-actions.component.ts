import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { PageManager } from '../../../model/page-manager';
import { PageConfig } from '../../../model/page-config';
import { Subscription } from 'rxjs';
import { DynamicAction, ActionScope, ActionType } from '../../../model/dynamic-action';
import { PopoverContent } from '../../../model/popover-content';
import { PopoverConfig } from '../../../model/popover-config';
import { DynamicPopoverService } from '../../../services/dynamic-popover.service';
import { PopoverRef } from '../../../model/popover-ref';

@Component({
  selector: 'zee-dynamic-grid-actions',
  templateUrl: './dynamic-grid-actions.component.html',
  styleUrls: ['./dynamic-grid-actions.component.scss']
})
export class DynamicGridActionsComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  manager: PageManager<any>;

  private pageConfig: PageConfig<any>;
  private actionSubscription: Subscription;
  private popoverRef: PopoverRef<any, any>;
  actions: Array<DynamicAction<any>> = [];

  constructor(private popoverService: DynamicPopoverService) {
      super();
  }

  public openPopup(origin: HTMLElement, content: PopoverContent): void {
    const config: PopoverConfig = { header: false };
    this.popoverRef = this.popoverService.openPopup(origin, content, {}, config);
    this.popoverRef.afterClosed$.subscribe(() => {
        this.popoverRef = null;
    });
}

  private buildActions(): void {
      this.pageConfig = this.manager.config;
      if (!this.actionSubscription) {
          this.actionSubscription = this.manager.actions().subscribe(actionList => {
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
      if (this.actionSubscription) {
          const s = this.actionSubscription;
          this.actionSubscription = undefined;
          s.unsubscribe();
      }
      if (this.actions) {
          // this.actions.forEach(a => a.destroy());
          this.actions = undefined;
      }
      if (this.popoverRef) {
        this.popoverRef.close();
        this.popoverRef = null;
      }
  }
}
