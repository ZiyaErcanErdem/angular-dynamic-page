import { Observable, Subject } from 'rxjs';
import { PageBuilder } from './page-builder';
import { Operator } from './operator.enum';
import { FormGroup, AbstractControl } from '@angular/forms';
import { QueryMode } from './query-mode.enum';

export interface QueryItemModel {
    name: string;
    operator: Operator;
    value: string;
}

export class DynamicSelectorModel<S> {
    builder: PageBuilder<S>;

    private selectionSubject: Subject<S>;

    constructor(
        public readonly qualifier: string,
        public readonly accessPath: string,
        public pageTitle: string,
        public readonly selectionKey: string,
        public readonly selectorColumns: Array<string>,
        public readonly selectorColumnStyles: Map<string, string>,
        public readonly defaultQueryItems: Array<QueryItemModel>,
        public readonly selectionMapping: Map<string, string>,
        public readonly disableManuelEntry: boolean,
        public readonly queryMode: QueryMode
    ) {
        this.selectionSubject = new Subject<S>();

        if (!this.selectorColumns) {
            this.selectorColumns = new Array<string>();
        }

        if (!this.defaultQueryItems) {
            this.defaultQueryItems = new Array<QueryItemModel>();
        }
    }

    public select(val: any) {
        this.selectionSubject.next(val);
    }

    public selection(): Observable<S> {
        return this.selectionSubject.asObservable();
    }

    /*
    public setup(formGroup: FormGroup): void {
        if (!this.selectionMapping || !this.disableManuelEntry) {
            return;
        }
        this.selectionMapping.forEach((controlName, selectorColumnName) => {
            const control = this.getMappingControl(formGroup, controlName);
            if (!control) {
                return;
            }
            if (controlName !== this.selectionKey) {
            }
        });
    }
    */

    public isEditableSelection(controlName: string): boolean {
        if (!this.selectionMapping || !this.disableManuelEntry || !controlName) {
            return true;
        }
        let editable = true;
        this.selectionMapping.forEach((val, key) => {
            if (val === controlName) {
                editable = false;
            }
        });
        return editable;
    }

    public mapSelection(sel: any, formGroup: FormGroup): void {
        if (!this.selectionMapping) {
            return;
        }
        this.selectionMapping.forEach((controlName, selectorColumnName) => {
            const control = this.getMappingControl(formGroup, controlName);
            if (!control) {
                return;
            }
            if (!sel) {
                control.patchValue('');
                control.markAsDirty();
            } else {
                const selectionVal = sel[selectorColumnName];
                control.patchValue(selectionVal || '');
                control.markAsDirty();
            }
        });
    }

    private getMappingControl(formGroup: FormGroup, controlName: string): AbstractControl {
        if (!formGroup || !controlName) {
            return null;
        }
        return formGroup.controls[controlName];
    }

    public destroy(): void {
        const b = this.builder;
        this.builder = undefined;
        if (b) {
            b.destroy();
        }
        if (this.selectionSubject) {
            this.selectionSubject.complete();
            this.selectionSubject = new Subject<S>();
        }
    }
}

export class DynamicSelectorBuilder<S> {
    private pageTitle: string;
    private selectionKey: string;
    private selectionMapping: Map<string, string>;
    private selectorColumns: Array<string>;
    private selectorColumnStyles: Map<string, string>;
    private defaultQueryItems: Array<{ name: string; operator: Operator; value: string }>;
    private disableManuelEntry: boolean;
    private queryMode: QueryMode;

    constructor(public readonly qualifier: string, public readonly accessPath: string) {
        this.selectionMapping = new Map<string, string>();
        this.selectorColumnStyles = new Map<string, string>();
        this.selectorColumns = new Array<string>();
        this.defaultQueryItems = new Array<{ name: string; operator: Operator; value: string }>();
        this.disableManuelEntry = false;
        this.queryMode = QueryMode.EXAMPLE;
    }

    public withSelectionKey(key: string): DynamicSelectorBuilder<S> {
        this.selectionKey = key;
        this.addSelectorColumn(key);
        return this;
    }

    public withTitle(title: string): DynamicSelectorBuilder<S> {
        this.pageTitle = title;
        return this;
    }

    public withQueryMode(queryMode: QueryMode): DynamicSelectorBuilder<S> {
        this.queryMode = queryMode;
        return this;
    }

    public withSelectorColumns(...cols: Array<string>): DynamicSelectorBuilder<S> {
        if (cols && cols.length > 0) {
            cols.forEach(c => this.addSelectorColumn(c));
        }
        return this;
    }

    public preventManuelEntry(): DynamicSelectorBuilder<S> {
        this.disableManuelEntry = true;
        return this;
    }

    private addSelectorColumn(columnName: string): DynamicSelectorBuilder<S> {
        if (!columnName || this.selectorColumns.includes(columnName)) {
            return this;
        }
        this.selectorColumns.push(columnName);
        return this;
    }

    public addQueryItem(qi: QueryItemModel): DynamicSelectorBuilder<S> {
        if (!qi || !qi.name || this.defaultQueryItems.includes(qi)) {
            return this;
        }
        this.defaultQueryItems.push(qi);
        return this;
    }

    public addSelectionMapping(columnName: string, targetName: string): DynamicSelectorBuilder<S> {
        if (!columnName || !targetName) {
            return this;
        }
        this.selectionMapping.set(columnName, targetName);
        return this;
    }

    public addSelectorColumnWidth(columnName: string, colWith): DynamicSelectorBuilder<S> {
        if (!columnName || !colWith) {
            return this;
        }
        this.selectorColumnStyles.set(columnName, colWith);
        return this;
    }

    public build(): DynamicSelectorModel<S> {
        return new DynamicSelectorModel<S>(
            this.qualifier,
            this.accessPath,
            this.pageTitle,
            this.selectionKey,
            this.selectorColumns,
            this.selectorColumnStyles,
            this.defaultQueryItems,
            this.selectionMapping,
            this.disableManuelEntry,
            this.queryMode
        );
    }
}
