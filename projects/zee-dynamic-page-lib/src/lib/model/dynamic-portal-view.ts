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
    private _viewRef: EmbeddedViewRef<C>;
    private _componentRef: ComponentRef<C>;
    private detachedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private attachedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private renewSubject: Subject<DynamicPortalView<C>> = new Subject<DynamicPortalView<C>>();

    private _completed: boolean;
    private _attached: boolean;
    private _detached: boolean;

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
        this._completed = false;
        this._attached = false;
        this._detached = false;
        this.detachedSubject = new BehaviorSubject<boolean>(this._detached);
        this.attachedSubject = new BehaviorSubject<boolean>(this._attached);
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
        return this._completed;
    }

    public get viewRef(): EmbeddedViewRef<C> {
        return this._viewRef;
    }

    public get componentRef(): ComponentRef<C> {
        return this._componentRef;
    }

    public renew(): DynamicPortalView<C> {
        const p = new DynamicPortalView<any>(this.component, this.template, this.context);
        this.renewSubject.next(p);
        this.renewSubject.complete();
        this.detach();
        return p;
    }

    public isAttached(): boolean {
        return this._attached;
    }

    public isDetached(): boolean {
        return this._detached;
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
            this._completed = true;
            this._attached = true;
            this._viewRef = ref;
            this.attachedSubject.next(true);
        }
    }

    public setComponentReference(ref: ComponentRef<C>): void {
        if (ref && !this.completed && this.type === DynamicViewType.COMPONENT) {
            this._completed = true;
            this._attached = true;
            this._componentRef = ref;
            this.attachedSubject.next(this._attached);
        }
    }

    public detach(): void {
        if (!this._detached) {
            this._attached = false;
            this._detached = true;
            this.detachedSubject.next(this._detached);
            this.attachedSubject.complete();
            this.detachedSubject.complete();
            if (this._viewRef) {
                this._viewRef.destroy();
            }
            if (this._componentRef) {
                this._componentRef.destroy();
            }
            this._viewRef = undefined;
            this._componentRef = undefined;
            this.detachedSubject = undefined;
            this.attachedSubject = undefined;
        }
    }
}
