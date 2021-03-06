export interface TableFieldSelection {
    label: string;
    value: any;
}
export class TableField<R> {
    private fieldOriginalType: 'static' | 'text' | 'number' | 'date' | 'selection' | 'action' | 'hidden';
    private fieldReader: (row: R) => any;
    private fieldWriter: (row: R, val: any) => void;
    public colWidth: string;
    public icon: string;

    set reader(fieldReader: (row: R) => any) {
        this.fieldReader = fieldReader;
    }

    get reader(): (row: R) => any {
        return this.fieldReader;
    }

    get writer(): (row: R, val: any) => void {
        return this.fieldWriter;
    }

    set writer(fieldWriter: (row: R, val: any) => void) {
        this.fieldWriter = fieldWriter;
    }

    get originalType(): 'static' | 'text' | 'number' | 'date' | 'selection' | 'action' | 'hidden' {
        return this.fieldOriginalType;
    }

    constructor(
        public name: string,
        public type: 'static' | 'text' | 'number' | 'date' | 'selection' | 'action' | 'hidden' = 'static',
        public action?: (row: any) => void,
        public label?: string,
        public i18n = false,
        public selection?: Array<TableFieldSelection>
    ) {
        this.label = this.label || this.label === '' ? this.label : this.name;
        this.fieldOriginalType = this.type;
    }

    public static of<R>(
        name: string,
        label?: string,
        i18n = false,
        type: 'static' | 'text' | 'number' | 'date' | 'hidden' = 'static'
    ): TableField<R> {
        return new TableField<R>(name, type, null, label, i18n);
    }
    public static ofSelection<R>(name: string, selection: Array<TableFieldSelection>, label?: string, i18n = false): TableField<R> {
        return new TableField<R>(name, 'selection', null, label, i18n, selection);
    }

    public static ofAction<R>(name: string, label?: string, i18n = false, action?: (row: R) => void): TableField<R> {
        return new TableField<R>(name, 'action', action, label, i18n);
    }


    public withColWidth(w: string): TableField<R> {
        this.colWidth = w;
        return this;
    }

    public withIcon(iconClass: string): TableField<R> {
        this.icon = iconClass;
        return this;
    }

    public destroy(): void {
        this.action = undefined;
        this.fieldReader = undefined;
        this.fieldWriter = undefined;
    }

    public read(row: R): any {
        if (!row) {
            return '';
        }
        const value = this.fieldReader ? this.fieldReader(row) : (row as { [key: string]: any })[this.name];
        return this.type === 'number' ? Number(value) : value;
    }

    public write(row: R, val: any): void {
        if (!row) {
            return;
        }
        if (this.fieldWriter) {
            this.fieldWriter(row, val);
            return;
        }
        (row as { [key: string]: any })[this.name] = val;
    }

    public hide(): void {
        this.type = 'hidden';
    }

    public show(): void {
        this.type = this.originalType;
    }

    public readonly(isReadonly: boolean): void {
        if (this.type === 'hidden') {
            return;
        }
        this.type = isReadonly ? (this.fieldOriginalType === 'action' ? 'hidden' : 'static') : this.originalType;
    }
}
