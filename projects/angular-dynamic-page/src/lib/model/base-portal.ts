import { ViewChild, ComponentRef, EmbeddedViewRef, Directive } from '@angular/core';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { DynamicBaseComponent } from './dynamic-base-component';
import { DynamicPortalView, DynamicViewType } from './dynamic-portal-view';


@Directive()
export class BasePortal extends DynamicBaseComponent {
    @ViewChild(CdkPortalOutlet)
    portalOutlet: CdkPortalOutlet;

    private portalView: DynamicPortalView<any>;

    constructor() {
        super();
    }

    public detachView() {
        this.setCurrentView(undefined);
    }

    public attachView(view: DynamicPortalView<any>): void {
        if (!view) {
            return;
        }
        if (view.type === DynamicViewType.COMPONENT && view.componentPortal) {
            this.setCurrentView(view);
            const componentRef = this.attachComponentPortal(view.componentPortal);
            view.setComponentReference(componentRef);
        } else if (view.type === DynamicViewType.TEMPLATE && view.templatePortal) {
            this.setCurrentView(view);
            const viewRef = this.attachTemplatePortal(view.templatePortal);
            view.setViewReference(viewRef);
        }
    }

    private setCurrentView(view: DynamicPortalView<any>): void {
        if (this.portalView) {
            this.portalView.detach();
            this.portalView = null;
        }
        this.portalView = view;
    }

    private attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
        if (this.portalOutlet) {
            if (this.portalOutlet.hasAttached()) {
                this.portalOutlet.detach();
            }
            return this.portalOutlet.attachComponentPortal(portal);
        }
        return null;
    }

    private attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
        if (this.portalOutlet) {
            if (this.portalOutlet.hasAttached()) {
                this.portalOutlet.detach();
            }
            return this.portalOutlet.attachTemplatePortal(portal);
        }
        return null;
    }
}
