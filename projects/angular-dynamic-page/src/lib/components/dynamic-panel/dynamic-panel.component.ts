import { Component, Input, OnDestroy } from '@angular/core';
import { BasePanel } from '../../model/base-panel';
import { Theme } from '../../model/theme.enum';
import { DynamicUtil } from '../../model/dynamic-util';
import { PopoverRef } from '../../model/popover-ref';
import { DynamicPopoverService } from '../../services/dynamic-popover.service';
import { PopoverContent } from '../../model/popover-content';
import { PopoverConfig } from '../../model/popover-config';

@Component({
  selector: 'zee-dynamic-panel',
  templateUrl: './dynamic-panel.component.html',
  styleUrls: ['./dynamic-panel.component.scss']
})
export class DynamicPanelComponent extends BasePanel implements OnDestroy {
  @Input()
  theme: Theme = Theme.dark;
  @Input()
  tooltip: string;
  @Input()
  header: boolean;
  @Input()
  embeddedBody: boolean;

  private popoverRef: PopoverRef<any, any>;

  constructor(private popoverService: DynamicPopoverService) {
      super();
      this.header = true;
      this.embeddedBody = false;
  }

  get panelHeaderClass(): string {
      return (
          (this.embeddedBody ? 'p-0 ' : 'p-2 ') +
          DynamicUtil.bgThemeFor(this.theme) +
          ' ' +
          this.headerClass +
          ' ' +
          this.panelHeaderTextColor
      );
  }

  get panelBodyClass(): string {
      return (
          (this.embeddedBody ? 'p-0 border-0 ' : 'p-2 border ') +
          'rounded-bottom ' +
          DynamicUtil.borderThemeFor(this.theme) +
          ' ' +
          this.bodyClass
      );
  }

  get panelHeaderTextColor(): string {
      return Theme.light === this.theme || Theme.warning === this.theme ? '' : 'text-white';
  }

  get tooltipClass(): string {
      return DynamicUtil.borderThemeFor(this.theme) + ' ' + DynamicUtil.textThemeFor(this.theme);
  }

  get tooltipButtonClass(): string {
      return DynamicUtil.buttonThemeFor(this.theme) + ' ' + this.panelHeaderTextColor;
  }

  public openPopup(origin: HTMLElement, content: PopoverContent): void {
    const config: PopoverConfig = {header: false}
    this.popoverRef = this.popoverService.openPopup(origin, content, {}, config);
    this.popoverRef.afterClosed$.subscribe(() => {
        this.popoverRef = null;
    })
  }

  public closePopup(): void {
    if (this.popoverRef) {
        this.popoverRef.close();
        this.popoverRef = null;
      }
  }

  ngOnDestroy() {
    this.closePopup();
  }
}

