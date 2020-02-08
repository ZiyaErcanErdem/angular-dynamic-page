import { Component, Input } from '@angular/core';
import { BasePanel } from '../../model/base-panel';
import { Theme } from '../../model/theme.enum';
import { DynamicUtil } from '../../model/dynamic-util';

@Component({
  selector: 'zee-dynamic-panel',
  templateUrl: './dynamic-panel.component.html',
  styleUrls: ['./dynamic-panel.component.scss']
})
export class DynamicPanelComponent extends BasePanel {
  @Input()
  theme: Theme = Theme.dark;
  @Input()
  tooltip: string;
  @Input()
  header: boolean;
  @Input()
  embeddedBody: boolean;

  constructor() {
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
}

