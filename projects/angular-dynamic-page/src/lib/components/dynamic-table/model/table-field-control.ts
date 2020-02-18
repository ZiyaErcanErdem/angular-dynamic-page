import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { TableDataSource } from './table-data-source';
import { TableField, TableFieldSelection } from './table-field';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { DynamicAction } from '../../../model/dynamic-action';

export interface TableSortContext {
    direction: string;
    field: TableField<any>;
}

export interface TablePageContext {
    pageIndex: number;
    pageSize: number;
    dataSize: number;
}

export class TablePaginator {
    private pageContext: TablePageContext;
    private pageChangeSubject: BehaviorSubject<TablePageContext>;

    get pageIndex(): number {
        return this.pageContext.pageIndex;
    }

    set pageIndex(newPageIndex: number) {
        const oldPage = this.pageContext;
        this.pageContext = {
            pageIndex: newPageIndex,
            pageSize: oldPage.pageSize,
            dataSize: oldPage.dataSize
        };
        this.pageChangeSubject.next(this.pageContext);
    }

    get pageSize(): number {
        return this.pageContext.pageSize;
    }

    set pageSize(newPageSize: number) {
        const oldPage = this.pageContext;
        this.pageContext = {
            pageIndex: oldPage.pageIndex,
            pageSize: newPageSize,
            dataSize: oldPage.dataSize
        };
        this.pageChangeSubject.next(this.pageContext);
    }

    get dataSize(): number {
        return this.pageContext.dataSize;
    }

    set dataSize(newDataSize: number) {
        const oldPage = this.pageContext;
        this.pageContext = {
            pageIndex: oldPage.pageIndex,
            pageSize: oldPage.pageSize,
            dataSize: newDataSize
        };
        this.pageChangeSubject.next(this.pageContext);
    }

    get page(): Observable<TablePageContext> {
        return this.pageChangeSubject.asObservable();
    }

    constructor() {
        this.pageContext = {
            pageIndex: 0,
            pageSize: 10,
            dataSize: 0
        };
        this.pageChangeSubject = new BehaviorSubject<TablePageContext>(this.pageContext);
    }

    public destroy(): void {
        if (this.pageChangeSubject) {
            if (!this.pageChangeSubject.isStopped) {
                this.pageChangeSubject.complete();
            }
            this.pageChangeSubject = undefined;
        }
    }
}

export class TableFieldControl<R> extends DynamicBaseComponent {
    set data(value: Array<R>) {
        Promise.resolve(true).then(() => (this.tableDataSource$.data = value));
    }

    get data(): Array<R> {
        return this.tableDataSource$ ? this.tableDataSource$.filteredData : [];
    }

    get paginator(): TablePaginator {
        return this.tablePaginator ? this.tablePaginator : null;
    }

    get fields(): Array<TableField<R>> {
        return this.tableFields ? this.tableFields : [];
    }

    get dataSource$(): DataSource<R> {
        return this.tableDataSource$;
    }

    get displayedColumns$(): BehaviorSubject<Array<string>> {
        return this.tableDisplayedColumns$;
    }

    get predicate(): string {
        return this.tablePredicate;
    }

    get reverse(): boolean {
        return this.tableReverse;
    }

    get selection(): Observable<R> {
        return this.selectionSubject.asObservable();
    }

    get actions(): Array<DynamicAction<any>> {
        return this.tableActions;
    }

    get hasHeader(): boolean {
        return !!(this.title || (this.tableActions && this.tableActions.length > 0));
    }

    public title: string;
    private tablePaginator: TablePaginator;

    private tableFields: Array<TableField<R>>;
    private tableDataSource$: TableDataSource<R>;
    private tableDisplayedColumns$: BehaviorSubject<Array<string>>;
    private tableActions: Array<DynamicAction<any>>;
    private sortChangedSubject: Subject<TableSortContext>;

    private i18nPrefix: string;

    private tablePredicate: string;
    private tableReverse: boolean;
    private tableDataSelection: SelectionModel<R>;
    private selectionSubject: BehaviorSubject<R>;

    private dataSorter: (data: Array<R>, ctx: TableSortContext) => Array<R>;

    public filteredValue: string;

    constructor(title?: string) {
        super();
        this.title = title ? title : '';
        this.tablePaginator = new TablePaginator();
        this.tablePredicate = undefined;
        this.tableReverse = false;
        this.tableFields = [];
        this.tableActions = [];
        this.tableDataSource$ = new TableDataSource<R>([]);
        this.tableDataSource$.paginator = this.tablePaginator;
        this.tableDisplayedColumns$ = new BehaviorSubject<Array<string>>([]);
        this.sortChangedSubject = new Subject<TableSortContext>();
        this.tableDataSelection = new SelectionModel<R>(false, [], true);
        this.selectionSubject = new BehaviorSubject<R>(undefined);

        this.collect = this.tableDataSelection.changed.subscribe(changes => {
            if (this.tableDataSelection.selected && this.tableDataSelection.selected.length > 0) {
                this.selectionSubject.next(this.tableDataSelection.selected[0]);
            } else {
                this.selectionSubject.next(undefined);
            }
        });
    }

    public destroy(): void {
        this.clean();

        if (this.tablePaginator) {
            this.tablePaginator.destroy();
            this.tablePaginator = undefined;
        }

        if (this.tableDataSource$) {
            this.tableDataSource$.paginator = undefined;
            this.tableDataSource$.destroy();
            this.tableDataSource$ = undefined;
        }

        this.tableDisplayedColumns$ = this.destroySubject(this.tableDisplayedColumns$);
        this.sortChangedSubject = this.destroySubject(this.sortChangedSubject);
        this.selectionSubject = this.destroySubject(this.selectionSubject);

        if (this.tableDataSelection) {
            this.tableDataSelection.clear();
            this.tableDataSelection = undefined;
        }

        if (this.tableFields) {
            this.tableFields.forEach(f => f.destroy());
            this.tableFields = undefined;
        }

        this.dataSorter = undefined;
        this.tableActions = undefined;
    }

    public withSorter(sorter: (data: Array<R>, ctx: TableSortContext) => Array<R>): TableFieldControl<R> {
        this.dataSorter = sorter;
        return this;
    }

    public withI18nPrefix(prefix: string): TableFieldControl<R> {
        this.i18nPrefix = prefix;
        return this;
    }

    public toggleSelection(row: R): void {
        if (row) {
            if (this.isSelected(row)) {
                this.tableDataSelection.clear();
            } else {
                this.tableDataSelection.toggle(row);
            }
        } else {
            this.tableDataSelection.clear();
        }
    }

    public isSelected(row: R): boolean {
        return this.tableDataSelection.isSelected(row);
    }

    public clearSelection(): void {
        return this.tableDataSelection.clear();
    }

    private refreshDisplayedColumns(): void {
        const visibleColumns = this.fields.filter(f => f.type !== 'hidden').map(f => f.name);
        Promise.resolve(true).then(() => this.displayedColumns$.next(visibleColumns));
    }

    public addAction(action: DynamicAction<any>): TableFieldControl<R> {
        if (!action || this.tableActions.includes(action)) {
            return this;
        }
        this.tableActions.push(action);
        this.tableActions = this.tableActions.sort((a, b) => -1 * (a.order > b.order ? 1 : a.order === b.order ? 0 : -1));
        return this;
    }

    public addField(field: TableField<R>): TableField<R> {
        if (this.fields.some(f => f.name === field.name)) {
            return field;
        }
        if (this.i18nPrefix && field.label && !field.i18n) {
            field.label = this.i18nPrefix + '.' + field.label;
            field.i18n = true;
        }
        this.fields.push(field);
        this.refreshDisplayedColumns();
        return field;
    }

    public setFieldSelection(name: string, selection: Array<TableFieldSelection>): void {
        this.tableFields = this.fields.map(f => {
            if (f.name === name) {
                f.selection = selection ? selection : [];
            }
            return f;
        });
    }

    public hide(name: string): void {
        this.tableFields = this.fields.map(f => {
            if (f.name === name) {
                f.hide();
            }
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public hideAll(): void {
        this.tableFields = this.fields.map(f => {
            f.hide();
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public show(name: string): void {
        this.tableFields = this.fields.map(f => {
            if (f.name === name) {
                f.show();
            }
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public showAll(): void {
        this.tableFields = this.fields.map(f => {
            f.show();
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public readonly(name: string, isReadonly: boolean): void {
        this.tableFields = this.fields.map(f => {
            if (f.name === name) {
                f.readonly(isReadonly);
            }
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public readonlyAll(isReadonly: boolean): void {
        this.tableFields = this.fields.map(f => {
            f.readonly(isReadonly);
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public setLabel(name: string, lbl: string): void {
        this.tableFields = this.fields.map(f => {
            if (f.name === name) {
                f.label = lbl ? lbl : '';
            }
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public sortWith(sort: TableSortContext): void {
        this.tablePredicate = sort.field.name;
        this.tableReverse = sort.direction === 'desc' ? true : false;
        if (this.sortChangedSubject) {
            this.sortChangedSubject.next(sort);
        }
        if (this.dataSorter) {
            this.data = this.dataSorter(this.data, sort) || [];
        } else {
            this.tableDataSource$.sort = sort;
        }
    }

    public sortChanged(): Observable<TableSortContext> {
        return this.sortChangedSubject.asObservable();
    }

    public filter(): void {
        this.tableDataSource$.filter = this.filteredValue;
    }

    private destroySubject(subject: Subject<any>): any {
        if (subject) {
            if (!subject.isStopped) {
                subject.complete();
            }
        }
        return undefined;
    }
}
