import { Input, OnDestroy, OnInit, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { BasePanelView } from '../../../model/base-panel-view';
import { PageBuilder } from '../../../model/page-builder';

// @Directive()
export abstract class DynamicPageMonitor<T> extends BasePanelView implements OnInit, OnDestroy {
    @Input()
    set builder(value: PageBuilder<any>) {
        this.pageBuilder = value;
        this.activePageBuilder = this.pageBuilder;
    }

    private pageBuilder: PageBuilder<any>;
    private activePageBuilder: PageBuilder<any>;
    private data: T;
    public formValue: any;
    private form: FormGroup;

    constructor(protected monitoredQualifier: string | Array<string>) {
        super();
    }

    get activeBuilder(): PageBuilder<any> {
        return this.activePageBuilder ? this.activePageBuilder : this.pageBuilder;
    }

    get qualifier(): string {
        return this.activePageBuilder ? this.activePageBuilder.qualifier : undefined;
    }

    get visible(): boolean {
        return this.entity !== undefined && this.isInScope(this.qualifier);
    }

    get entity(): T {
        return this.data;
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
        return this.formValue;
    }

    public set entityValue(value: any) {
        this.formValue = value;
        if (this.activePageBuilder) {
            this.entityChanged();
        }
    }

    protected delegateUpdate(delegator: (d: T) => Observable<T>): void {
        if (this.activePageBuilder) {
            this.activePageBuilder.delegateEntityUpdate(delegator);
        }
    }

    protected resetUpdateDelegation(): void {
        if (this.activePageBuilder) {
            this.activePageBuilder.clearEntityUpdateDelegate();
        }
    }

    protected readFormValue(propName: string): any {
        if (this.form) {
            const control = this.form.get(propName);
            return control ? control.value : undefined;
        } else {
            return this.formValue ? this.formValue[propName] : undefined;
        }
    }

    protected writeFormValue(propName: string, value: any): void {
        if (!this.form || !propName) {
            return;
        }
        const control = this.form.get(propName);
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
        if (this.pageBuilder) {
            this.collect = this.pageBuilder.activeBuilder().subscribe(apb => {
                if (this.activePageBuilder) {
                    this.activePageBuilder.clearEntityUpdateDelegate();
                }
                if (apb) {
                    console.log('Active Builder Changed: ' + apb.qualifier);
                    this.activePageBuilder = apb;
                    this.monitorBuilder(this.activePageBuilder);
                } else {
                    console.log('Active Builder Removed');
                    this.activePageBuilder = this.pageBuilder;
                }
            });
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.unmonitorBuilder();
        this.pageBuilder = undefined;
        if (this.activePageBuilder) {
            this.activePageBuilder.clearEntityUpdateDelegate();
        }
        this.activePageBuilder = undefined;
    }

    private monitorBuilder(b: PageBuilder<any>): void {
        this.unmonitorBuilder();
        if (this.isInScope(b.qualifier)) {
            this.collect = b.data().subscribe(d => {
                this.data = d as T;
                this.monitoring(this.data);
            });
            this.collect = b.form().subscribe(form => {
                if (form) {
                    this.form = form;
                    this.collect = form.valueChanges.subscribe(val => {
                        Promise.resolve(true).then(() => (this.entityValue = val));
                    });
                }
            });
        } else {
            this.data = undefined;
        }
    }

    private unmonitorBuilder(): void {
        if (this.activePageBuilder) {
            this.activePageBuilder.clearEntityUpdateDelegate();
        }
        this.form = undefined;
        this.data = undefined;
        this.unmonitoring();
    }
}
