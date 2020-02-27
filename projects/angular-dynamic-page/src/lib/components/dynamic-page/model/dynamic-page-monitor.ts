import { Input, OnDestroy, OnInit, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { BasePanelView } from '../../../model/base-panel-view';
import { PageManager } from '../../../model/page-manager';

// @Directive()
export abstract class DynamicPageMonitor<T> extends BasePanelView implements OnInit, OnDestroy {
    @Input()
    set manager(value: PageManager<any>) {
        this.pageManager = value;
        this.activePageManager = this.pageManager;
    }

    private pageManager: PageManager<any>;
    private activePageManager: PageManager<any>;
    private data: T;
    public formValue: any;
    private form: FormGroup;

    constructor(protected monitoredQualifier: string | Array<string>) {
        super();
    }

    get activeManager(): PageManager<any> {
        return this.activePageManager ? this.activePageManager : this.pageManager;
    }

    get qualifier(): string {
        return this.activePageManager ? this.activePageManager.qualifier : undefined;
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
        if (this.activePageManager) {
            this.entityChanged();
        }
    }

    protected delegateUpdate(delegator: (d: T) => Observable<T>): void {
        if (this.activePageManager) {
            this.activePageManager.delegateEntityUpdate(delegator);
        }
    }

    protected resetUpdateDelegation(): void {
        if (this.activePageManager) {
            this.activePageManager.clearEntityUpdateDelegate();
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
        if (this.pageManager) {
            this.collect = this.pageManager.activeManager().subscribe(apb => {
                if (this.activePageManager) {
                    this.activePageManager.clearEntityUpdateDelegate();
                }
                if (apb) {
                    this.activePageManager = apb;
                    this.monitorManager(this.activePageManager);
                } else {
                    this.activePageManager = this.pageManager;
                }
            });
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.unmonitorManager();
        this.pageManager = undefined;
        if (this.activePageManager) {
            this.activePageManager.clearEntityUpdateDelegate();
        }
        this.activePageManager = undefined;
    }

    private monitorManager(b: PageManager<any>): void {
        this.unmonitorManager();
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

    private unmonitorManager(): void {
        if (this.activePageManager) {
            this.activePageManager.clearEntityUpdateDelegate();
        }
        this.form = undefined;
        this.data = undefined;
        this.unmonitoring();
    }
}
