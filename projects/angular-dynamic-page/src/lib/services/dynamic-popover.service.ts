import { Injectable, Injector } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayConfig, PositionStrategy } from '@angular/cdk/overlay';
import { PopoverParams } from '../model/popover-params';
import { PopoverRef } from '../model/popover-ref';
import { Theme } from '../model/theme.enum';
import { PopoverContent } from '../model/popover-content';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { PopoverType } from '../model/popover-type';
import { DynamicPopoverComponent } from '../components/dynamic-popover/dynamic-popover.component';
import { PopoverConfig } from '../model/popover-config';


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

    public openAlert<R>(content: string, params: PopoverConfig = {}): PopoverRef<any, R> {
        const config: PopoverConfig = { minWidth: '400px', maxHeight: '600px', header: true, footer: true, ...params};
        return this.open<any, R>({type: 'alert', config, content});
    }

    public openConfirmation<C>(content: PopoverContent,  params: PopoverConfig = {}): PopoverRef<C, boolean> {
        const config: PopoverConfig = { minWidth: '400px', maxHeight: '600px', header: true, footer: true, ...params};
        return this.open<C, boolean>({type: 'confirmation', config, content});
    }

    public openTooltip<C, R>(origin: HTMLElement, content: PopoverContent, context?: C, params: PopoverConfig = {}): PopoverRef<C, R> {
        const config: PopoverConfig = { width: '200px', theme: Theme.dark, ...params};
        return this.open<C, R>({type: 'alert', config, origin, content, context});
    }

    public openDialog<C, R>(content: PopoverContent, context?: C, params: PopoverConfig = {}): PopoverRef<C, R> {
        const config: PopoverConfig = { minWidth: '300px', maxHeight: '600px', header: true, footer: true, ...params};
        return this.open<C, R>({type: 'dialog', config, content, context});
    }

    public openPopup<C, R>(origin: HTMLElement, content: PopoverContent, context?: C, params: PopoverConfig = {}): PopoverRef<C, R> {
        const config: PopoverConfig = { minWidth: '300px', maxHeight: '600px', header: true, footer: true, ...params};
        return this.open<C, R>({type: 'popup', config, origin, content, context});
    }

    open<C, R>({ type, config, origin, content, context }: PopoverParams<C>): PopoverRef<C, R> {
        const overlayRef = this.overlay.create(this.getOverlayConfig({ type, config, origin }));
        const popoverRef = new PopoverRef<C, R>(type, config, overlayRef, content, context);

        const injector = this.createInjector(popoverRef, this.injector);
        const portal = new ComponentPortal(DynamicPopoverComponent, null, injector);
        overlayRef.attach(portal);
        return popoverRef;
    }

    private getOverlayConfig({ type, config, origin }): OverlayConfig {
        const positionStrategy = this.getOverlayPosition(type, origin);
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
        return new PortalInjector(injector, tokens);
    }

    private getPositions(): ConnectionPositionPair[] {
        return [this.top, this.right, this.left, this.bottom];
    }
}
