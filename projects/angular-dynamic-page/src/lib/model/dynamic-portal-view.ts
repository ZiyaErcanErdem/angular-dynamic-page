import { TemplatePortal, ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { TemplateRef, ComponentRef, EmbeddedViewRef } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

export enum DynamicViewType {
    TEMPLATE = 'TEMPLATE',
    COMPONENT = 'COMPONENT'
}

export class DynamicPortalView<C> {
    public readonly type: DynamicViewType;
    public readonly templatePortal: TemplatePortal<C> | null;
    public readonly componentPortal: ComponentPortal<C> | null;
    private embeddedViewRef: EmbeddedViewRef<C>;
    private compRef: ComponentRef<C>;
    private detachedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private attachedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private renewSubject: Subject<DynamicPortalView<C>> = new Subject<DynamicPortalView<C>>();

    private isCompleted: boolean;
    private isViewAttached: boolean;
    private isViewDetached: boolean;

    private template: TemplateRef<any>;
    private context?: any;
    private component: ComponentType<any>;

    constructor(component: ComponentType<C>, template: TemplateRef<C>, context?: C) {
        this.component = component;
        this.template = template;
        this.context = context;
        if (template) {
            this.type = DynamicViewType.TEMPLATE;
            this.templatePortal = new TemplatePortal<C>(template, undefined, context);
        } else if (component) {
            this.type = DynamicViewType.COMPONENT;
            this.componentPortal = new ComponentPortal<C>(component);
        }
        this.isCompleted = false;
        this.isViewAttached = false;
        this.isViewDetached = false;
        this.detachedSubject = new BehaviorSubject<boolean>(this.isViewDetached);
        this.attachedSubject = new BehaviorSubject<boolean>(this.isViewAttached);
    }

    public static createFromTemplate(template: TemplateRef<any>, context?: any): DynamicPortalView<any> {
        const view = new DynamicPortalView<any>(undefined, template, context);
        return view;
    }

    public static createFromComponent(component: ComponentType<any>, context?: any): DynamicPortalView<any> {
        const view = new DynamicPortalView<any>(component, context);
        return view;
    }

    public get completed(): boolean {
        return this.isCompleted;
    }

    public get viewRef(): EmbeddedViewRef<C> {
        return this.embeddedViewRef;
    }

    public get componentRef(): ComponentRef<C> {
        return this.compRef;
    }

    public renew(): DynamicPortalView<C> {
        const p = new DynamicPortalView<any>(this.component, this.template, this.context);
        this.renewSubject.next(p);
        this.renewSubject.complete();
        this.detach();
        return p;
    }

    public isAttached(): boolean {
        return this.isViewAttached;
    }

    public isDetached(): boolean {
        return this.isViewDetached;
    }

    public renewed(): Observable<DynamicPortalView<C>> {
        return this.renewSubject.asObservable();
    }

    public detached(): Observable<boolean> {
        return this.detachedSubject.asObservable();
    }

    public attached(): Observable<boolean> {
        return this.attachedSubject.asObservable();
    }

    public setViewReference(ref: EmbeddedViewRef<C>): void {
        if (ref && !this.completed && this.type === DynamicViewType.TEMPLATE) {
            this.isCompleted = true;
            this.isViewAttached = true;
            this.embeddedViewRef = ref;
            this.attachedSubject.next(true);
        }
    }

    public setComponentReference(ref: ComponentRef<C>): void {
        if (ref && !this.completed && this.type === DynamicViewType.COMPONENT) {
            this.isCompleted = true;
            this.isViewAttached = true;
            this.compRef = ref;
            this.attachedSubject.next(this.isViewAttached);
        }
    }

    public detach(): void {
        if (!this.isViewDetached) {
            this.isViewAttached = false;
            this.isViewDetached = true;
            this.detachedSubject.next(this.isViewDetached);
            this.attachedSubject.complete();
            this.detachedSubject.complete();
            if (this.embeddedViewRef) {
                this.embeddedViewRef.destroy();
            }
            if (this.compRef) {
                this.compRef.destroy();
            }
            this.embeddedViewRef = undefined;
            this.compRef = undefined;
            this.detachedSubject = undefined;
            this.attachedSubject = undefined;
        }
    }
}
