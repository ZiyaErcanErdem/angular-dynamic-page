import { Injectable, Injector } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayConfig, PositionStrategy } from '@angular/cdk/overlay';
import { PopoverParams } from '../model/popover-params';
import { PopoverRef } from '../model/popover-ref';
import { Theme } from '../model/theme.enum';
import { PopoverContent } from '../model/popover-content';
import { DynamicAction } from '../model/dynamic-action';
import { ComponentPortal } from '@angular/cdk/portal';
import { PopoverType } from '../model/popover-type';
import { DynamicPortalInjector } from '../model/dynamic-portal-injector';
import { DynamicPopoverComponent } from '../components/dynamic-popover/dynamic-popover.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicPopoverService {
  private top: ConnectionPositionPair = { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' };
  private left: ConnectionPositionPair = { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' };
  private right: ConnectionPositionPair = { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' };
  private bottom: ConnectionPositionPair = { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' };
  private up: ConnectionPositionPair = { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'bottom' };
  constructor(private overlay: Overlay, private injector: Injector) {}

  public openAlert<R>(content: string, title?: string, theme?: Theme, i18n?: boolean, i18nParams?: object): PopoverRef<any, R> {
      const params: PopoverParams<any> = {
          config: { type: 'alert', title, minWidth: '400px', theme, i18n, i18nParams, header: true, footer: true },
          content
      };
      return this.open<any, R>(params);
  }

  public openConfirmation<C>(
      content: PopoverContent,
      title?: string,
      theme?: Theme,
      i18n?: boolean,
      i18nParams?: object
  ): PopoverRef<C, boolean> {
      const params: PopoverParams<C> = {
          config: { type: 'confirmation', title, minWidth: '400px', theme, i18n, i18nParams, header: true, footer: true },
          content
      };
      return this.open<C, boolean>(params);
  }

  public openTooltip<C, R>(
      origin: HTMLElement,
      content: PopoverContent,
      context?: C,
      i18n?: boolean,
      i18nParams?: object
  ): PopoverRef<C, R> {
      const params: PopoverParams<C> = {
          config: { type: 'alert', width: '200px', theme: Theme.dark, i18n, i18nParams },
          origin,
          content,
          context
      };
      return this.open<C, R>(params);
  }

  public openDialog<C, R>(
      content: PopoverContent,
      context?: C,
      theme?: Theme,
      actions?: Array<DynamicAction<any>>,
      title?: string,
      minWidth?: string | number,
      i18n?: boolean,
      maxHeight?: string | number
  ): PopoverRef<C, R> {
      const mw = minWidth ? minWidth : '300px';
      const mh = maxHeight ? maxHeight : '600px';
      const params: PopoverParams<C> = {
          config: { type: 'dialog', actions, title, i18n, minWidth: mw, maxHeight: mh, header: true, footer: true, theme },
          content,
          context
      };
      return this.open<C, R>(params);
  }

  public openPopup<C, R>(
      origin: HTMLElement,
      content: PopoverContent,
      context?: C,
      theme?: Theme,
      actions?: Array<DynamicAction<any>>,
      title?: string
  ): PopoverRef<C, R> {
      const params: PopoverParams<C> = {
          config: { type: 'popup', actions, title, minWidth: '300px', maxHeight: '600px', header: true, footer: true, theme },
          origin,
          content,
          context
      };
      return this.open<C, R>(params);
  }

  open<C, R>({ config, origin, content, context }: PopoverParams<C>): PopoverRef<C, R> {
      const overlayRef = this.overlay.create(this.getOverlayConfig({ config, origin }));
      const popoverRef = new PopoverRef<C, R>(config, overlayRef, content, context);

      const injector = this.createInjector(popoverRef, this.injector);
      const portal = new ComponentPortal(DynamicPopoverComponent, null, injector);
      overlayRef.attach(portal);
      return popoverRef;
  }

  private getOverlayConfig({ config, origin }): OverlayConfig {
      const positionStrategy = this.getOverlayPosition(config.type, origin);
      return new OverlayConfig({
          hasBackdrop: true,
          width: config.width,
          height: config.height,
          minWidth: config.minWidth,
          minHeight: config.minHeight,
          maxWidth: config.maxWidth,
          maxHeight: config.maxHeight,
          backdropClass: 'popover-backdrop',
          positionStrategy,
          scrollStrategy: this.overlay.scrollStrategies.reposition(),
          disposeOnNavigation: true
      });
  }

  private getOverlayPosition(type: PopoverType, origin: HTMLElement): PositionStrategy {
      if (type === 'alert' || type === 'confirmation' || type === 'dialog') {
          const positionStrategy = this.overlay
              .position()
              .global()
              .centerHorizontally()
              .centerVertically();

          return positionStrategy;
      } else {
          const positionStrategy = this.overlay
              .position()
              .flexibleConnectedTo(origin)
              .withPositions(this.getPositions())
              .withFlexibleDimensions(false)
              .withPush(false)
              .withGrowAfterOpen(true);

          return positionStrategy;
      }
  }

  createInjector(popoverRef: PopoverRef<any, any>, injector: Injector) {
      const tokens = new WeakMap([[PopoverRef, popoverRef]]);
      return new DynamicPortalInjector(injector, tokens);
  }

  private getPositions(): ConnectionPositionPair[] {
      return [this.top, this.right, this.left, this.bottom];
  }
}
