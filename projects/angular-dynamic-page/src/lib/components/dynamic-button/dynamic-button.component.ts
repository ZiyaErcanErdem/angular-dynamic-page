import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicAction } from '../../model/dynamic-action';
import { PopoverContent } from '../../model/popover-content';
import { PopoverConfig } from '../../model/popover-config';
import { DynamicPopoverService } from '../../services/dynamic-popover.service';
import { PopoverRef } from '../../model/popover-ref';

@Component({
  selector: 'zee-dynamic-button',
  templateUrl: './dynamic-button.component.html',
  styleUrls: ['./dynamic-button.component.scss']
})
export class DynamicButtonComponent implements OnInit, OnDestroy {
  @Input()
  action: DynamicAction<any>;

  private popoverRef: PopoverRef<any, any>;

  constructor(private popoverService: DynamicPopoverService) {}

  get isDropDown(): boolean {
      return !!this.action && this.action.hasChilds();
  }

  get isVisible(): boolean {
      return !!this.action && this.action.visible;
  }

  get hasLabel(): boolean {
      return this.isVisible && !!this.action.label;
  }

  get hasBadge(): boolean {
      return this.isVisible && !!this.action.badge;
  }

  get iconPadding(): string {
      return this.hasLabel ? 'pr-1' : '';
  }

  public openPopup(origin: HTMLElement, content: PopoverContent): void {
    const config: PopoverConfig = { header: false };
    this.popoverRef = this.popoverService.openPopup(origin, content, {}, config);
    this.popoverRef.afterClosed$.subscribe(() => {
        this.popoverRef = null;
    });
}

  ngOnInit() {}

  ngOnDestroy() {
      this.action = undefined;
      if (this.popoverRef) {
        this.popoverRef.close();
        this.popoverRef = null;
      }
  }
}

