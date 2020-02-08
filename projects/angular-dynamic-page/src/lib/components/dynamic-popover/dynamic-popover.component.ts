import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { PopoverType } from '../../model/popover-type';
import { PopoverConfig } from '../../model/popover-config';
import { PopoverContent } from '../../model/popover-content';
import { ComponentType } from '@angular/cdk/portal';
import { DynamicAction } from '../../model/dynamic-action';
import { DynamicUtil } from '../../model/dynamic-util';
import { Theme } from '../../model/theme.enum';
import { PopoverRef } from '../../model/popover-ref';

@Component({
  selector: 'zee-dynamic-popover',
  templateUrl: './dynamic-popover.component.html',
  styleUrls: ['./dynamic-popover.component.scss']
})
export class DynamicPopoverComponent implements OnInit, OnDestroy {
  public renderAs: 'template' | 'component' | 'text' = 'component';
  public context: any;
  public popoverType: PopoverType;
  public config: PopoverConfig;

  private content: PopoverContent;

  get message(): string {
      if (this.renderAs === 'text') {
          return this.content as string;
      }
      return '';
  }

  get templateRef(): TemplateRef<any> {
      if (this.renderAs === 'template') {
          return this.content as TemplateRef<any>;
      }
      return null;
  }

  get componentType(): ComponentType<any> {
      if (this.renderAs === 'component') {
          return this.content as ComponentType<any>;
      }
      return null;
  }

  get hasFooter(): boolean {
      return (
          !!this.config && !!this.config.footer && (!!this.actions || this.popoverType === 'alert' || this.popoverType === 'confirmation')
      );
  }

  get actions(): Array<DynamicAction<any>> {
      return this.config ? this.config.actions : undefined;
  }

  get i18nParams(): object | undefined {
      return this.config ? this.config.i18nParams : {};
  }

  get dialogContainerClass(): string {
      if (!this.config) {
          return 'dynamic-dialog-container';
      }
      switch (this.config.type) {
          case 'tooltip': {
              return 'dynamic-popup-container';
          }
          case 'dialog': {
              return 'dynamic-dialog-container';
          }
          case 'alert': {
              return 'dynamic-alert-container';
          }
          default: {
              return 'dynamic-dialog-container';
          }
      }
  }

  get dialogHeaderTheme(): string {
      return DynamicUtil.bgThemeFor(this.config.theme) + ' ' + this.dialogTextColor;
  }

  get dialogFooterTheme(): string {
      return DynamicUtil.bgThemeFor(this.config.theme) + ' ' + this.dialogTextColor;
  }

  get dialogTextColor(): string {
      return Theme.light === this.config.theme || Theme.warning === this.config.theme ? '' : 'text-white';
  }

  constructor(private popoverRef: PopoverRef<any, any>) {}

  close(data?: any) {
      switch (this.config.type) {
          case 'dialog':
          case 'popup':
          case 'tooltip': {
              this.popoverRef.close();
              return;
          }
          case 'alert': {
              this.popoverRef.close(true);
              return;
          }
          case 'confirmation': {
              this.popoverRef.close(data);
              return;
          }
          default: {
              this.popoverRef.close();
              return;
          }
      }
  }

  ngOnInit() {
      this.content = this.popoverRef.content;
      this.popoverType = this.popoverRef.config.type;
      this.config = this.popoverRef.config;

      if (typeof this.content === 'string') {
          this.renderAs = 'text';
      }

      if (this.content instanceof TemplateRef) {
          this.renderAs = 'template';
          this.context = {
              close: this.popoverRef.close.bind(this.popoverRef)
          };
      }
  }

  ngOnDestroy() {}
}
