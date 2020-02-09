import { Input, OnDestroy, OnInit, Directive } from '@angular/core';
import { PageBuilder } from './page-builder';
import { FormGroup } from '@angular/forms';
import { PageMode } from './page-mode.enum';
import { Observable } from 'rxjs';
import { BasePanelView } from './base-panel-view';

@Directive()
export abstract class DynamicPageMonitor<T> extends BasePanelView implements OnInit, OnDestroy {
    @Input()
    set builder(value: PageBuilder<any>) {
        this._builder = value;
        this._activeBuilder = this._builder;
    }

    private _builder: PageBuilder<any>;
    private _activeBuilder: PageBuilder<any>;
    private _entity: T;
    public _entityValue: any;
    private _entityForm: FormGroup;
    private _builderPageMode: PageMode;

    constructor(protected monitoredQualifier: string | Array<string>) {
        super();
    }

    get activeBuilder(): PageBuilder<any> {
        return this._activeBuilder ? this._activeBuilder : this._builder;
    }

    get qualifier(): string {
        return this._activeBuilder ? this._activeBuilder.qualifier : undefined;
    }

    get visible(): boolean {
        return this.entity !== undefined && this.isInScope(this.qualifier);
    }

    get entity(): T {
        return this._entity;
    }

    abstract entityChanged(): void;
    abstract monitoring(data: T): void;
    abstract unmonitoring(): void;

    private isInScope(qualifier: string): boolean {
        if (!this.monitoredQualifier) {
            return false;
        }
        if (typeof this.monitoredQualifier === 'string') {
            return qualifier === this.monitoredQualifier;
        } else {
            return this.monitoredQualifier.some(q => q === qualifier);
        }
    }

    public get entityValue(): any {
        return this._entityValue;
    }

    protected delegateUpdate(delegator: (d: T) => Observable<T>): void {
        if (this._activeBuilder) {
            this._activeBuilder.delegateEntityUpdate(delegator);
        }
    }

    protected resetUpdateDelegation(): void {
        if (this._activeBuilder) {
            this._activeBuilder.clearEntityUpdateDelegate();
        }
    }

    public set entityValue(value: any) {
        this._entityValue = value;
        if (this._activeBuilder) {
            this.entityChanged();
        }
    }

    protected readFormValue(propName: string): any {
        if (this._entityForm) {
            const control = this._entityForm.get(propName);
            return control ? control.value : undefined;
        } else {
            return this._entityValue ? this._entityValue[propName] : undefined;
        }
    }

    protected writeFormValue(propName: string, value: any): void {
        if (!this._entityForm || !propName) {
            return;
        }
        const control = this._entityForm.get(propName);
        if (!control) {
            return;
        }
        control.setValue(value);
    }

    protected round(value: number, precision: number): number {
        const factor = Math.pow(10, precision);
        const temp = value * factor;
        const rounded = Math.round(temp);
        return rounded / factor;
    }

    ngOnInit() {
        if (this._builder) {
            this.collect = this._builder.activeBuilder().subscribe(apb => {
                if (this._activeBuilder) {
                    this._activeBuilder.clearEntityUpdateDelegate();
                }
                if (apb) {
                    console.log('Active Builder Changed: ' + apb.qualifier);
                    this._activeBuilder = apb;
                    this.monitorBuilder(this._activeBuilder);
                } else {
                    console.log('Active Builder Removed');
                    this._activeBuilder = this._builder;
                }
            });
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.unmonitorBuilder();
        this._builder = undefined;
        if (this._activeBuilder) {
            this._activeBuilder.clearEntityUpdateDelegate();
        }
        this._activeBuilder = undefined;
    }

    private monitorBuilder(b: PageBuilder<any>): void {
        this.unmonitorBuilder();
        if (this.isInScope(b.qualifier)) {
            this.collect = b.data().subscribe(d => {
                this._entity = d as T;
                this.monitoring(this._entity);
            });
            this.collect = b.form().subscribe(form => {
                if (form) {
                    this._entityForm = form;
                    this.collect = form.valueChanges.subscribe(val => {
                        Promise.resolve(true).then(() => (this.entityValue = val));
                    });
                }
            });
            this.collect = b.mode().subscribe(m => {
                this._builderPageMode = m;
            });
        } else {
            this._entity = undefined;
        }
    }

    private unmonitorBuilder(): void {
        if (this._activeBuilder) {
            this._activeBuilder.clearEntityUpdateDelegate();
        }
        this._entityForm = undefined;
        this._entity = undefined;
        this.unmonitoring();
    }
}
