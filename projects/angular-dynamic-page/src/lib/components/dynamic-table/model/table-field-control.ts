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
    private _page: TablePageContext;
    private _pageChangeSubject: BehaviorSubject<TablePageContext>;

    get pageIndex(): number {
        return this._page.pageIndex;
    }

    set pageIndex(newPageIndex: number) {
        const oldPage = this._page;
        this._page = {
            pageIndex: newPageIndex,
            pageSize: oldPage.pageSize,
            dataSize: oldPage.dataSize
        };
        this._pageChangeSubject.next(this._page);
    }

    get pageSize(): number {
        return this._page.pageSize;
    }

    set pageSize(newPageSize: number) {
        const oldPage = this._page;
        this._page = {
            pageIndex: oldPage.pageIndex,
            pageSize: newPageSize,
            dataSize: oldPage.dataSize
        };
        this._pageChangeSubject.next(this._page);
    }

    get dataSize(): number {
        return this._page.dataSize;
    }

    set dataSize(newDataSize: number) {
        const oldPage = this._page;
        this._page = {
            pageIndex: oldPage.pageIndex,
            pageSize: oldPage.pageSize,
            dataSize: newDataSize
        };
        this._pageChangeSubject.next(this._page);
    }

    get page(): Observable<TablePageContext> {
        return this._pageChangeSubject.asObservable();
    }

    constructor() {
        this._page = {
            pageIndex: 0,
            pageSize: 10,
            dataSize: 0
        };
        this._pageChangeSubject = new BehaviorSubject<TablePageContext>(this._page);
    }

    public destroy(): void {
        if (this._pageChangeSubject) {
            if (!this._pageChangeSubject.isStopped) {
                this._pageChangeSubject.complete();
            }
            this._pageChangeSubject = undefined;
        }
    }
}

export class TableFieldControl<R> extends DynamicBaseComponent {
    set data(value: Array<R>) {
        Promise.resolve(true).then(() => (this._dataSource$.data = value));
    }

    get data(): Array<R> {
        return this._dataSource$ ? this._dataSource$.filteredData : [];
    }

    get paginator(): TablePaginator {
        return this._paginator ? this._paginator : null;
    }

    get fields(): Array<TableField<R>> {
        return this._fields ? this._fields : [];
    }

    get dataSource$(): DataSource<R> {
        return this._dataSource$;
    }

    get displayedColumns$(): BehaviorSubject<Array<string>> {
        return this._displayedColumns$;
    }

    get predicate(): string {
        return this._predicate;
    }

    get reverse(): boolean {
        return this._reverse;
    }

    get selection(): Observable<R> {
        return this._selectedDataSubject.asObservable();
    }

    get actions(): Array<DynamicAction<any>> {
        return this._actions;
    }

    get hasHeader(): boolean {
        return !!(this.title || (this._actions && this._actions.length > 0));
    }

    public title: string;
    private _hasHeader: boolean;
    private _paginator: TablePaginator;

    private _fields: Array<TableField<R>>;
    private _dataSource$: TableDataSource<R>;
    private _displayedColumns$: BehaviorSubject<Array<string>>;
    private _actions: Array<DynamicAction<any>>;
    private _sortChangedSubject: Subject<TableSortContext>;

    private _i18nPrefix: string;

    private _predicate: string;
    private _reverse: boolean;
    private _dataSelection: SelectionModel<R>;
    private _selectedDataSubject: BehaviorSubject<R>;

    private _dataSorter: (data: Array<R>, ctx: TableSortContext) => Array<R>;

    public filteredValue: string;

    constructor(title?: string) {
        super();
        this._hasHeader = false;
        this.title = title ? title : '';
        this._paginator = new TablePaginator();
        this._predicate = undefined;
        this._reverse = false;
        this._fields = [];
        this._actions = [];
        this._dataSource$ = new TableDataSource<R>([]);
        this._dataSource$.paginator = this._paginator;
        this._displayedColumns$ = new BehaviorSubject<Array<string>>([]);
        this._sortChangedSubject = new Subject<TableSortContext>();
        this._dataSelection = new SelectionModel<R>(false, [], true);
        this._selectedDataSubject = new BehaviorSubject<R>(undefined);

        this.collect = this._dataSelection.changed.subscribe(changes => {
            if (this._dataSelection.selected && this._dataSelection.selected.length > 0) {
                this._selectedDataSubject.next(this._dataSelection.selected[0]);
            } else {
                this._selectedDataSubject.next(undefined);
            }
        });
    }

    public destroy(): void {
        this.clean();

        if (this._paginator) {
            this._paginator.destroy();
            this._paginator = undefined;
        }

        if (this._dataSource$) {
            this._dataSource$.paginator = undefined;
            this._dataSource$.destroy();
            this._dataSource$ = undefined;
        }

        this._displayedColumns$ = this.destroySubject(this._displayedColumns$);
        this._sortChangedSubject = this.destroySubject(this._sortChangedSubject);
        this._selectedDataSubject = this.destroySubject(this._selectedDataSubject);

        if (this._dataSelection) {
            this._dataSelection.clear();
            this._dataSelection = undefined;
        }

        if (this._fields) {
            this._fields.forEach(f => f.destroy());
            this._fields = undefined;
        }

        this._dataSorter = undefined;
        this._actions = undefined;
    }

    public withSorter(sorter: (data: Array<R>, ctx: TableSortContext) => Array<R>): TableFieldControl<R> {
        this._dataSorter = sorter;
        return this;
    }

    public withI18nPrefix(prefix: string): TableFieldControl<R> {
        this._i18nPrefix = prefix;
        return this;
    }

    public toggleSelection(row: R): void {
        if (row) {
            if (this.isSelected(row)) {
                this._dataSelection.clear();
            } else {
                this._dataSelection.toggle(row);
            }
        } else {
            this._dataSelection.clear();
        }
    }

    public isSelected(row: R): boolean {
        return this._dataSelection.isSelected(row);
    }

    public clearSelection(): void {
        return this._dataSelection.clear();
    }

    private refreshDisplayedColumns(): void {
        const visibleColumns = this.fields.filter(f => f.type !== 'hidden').map(f => f.name);
        Promise.resolve(true).then(() => this.displayedColumns$.next(visibleColumns));
    }

    public addAction(action: DynamicAction<any>): TableFieldControl<R> {
        if (!action || this._actions.includes(action)) {
            return this;
        }
        this._actions.push(action);
        this._actions = this._actions.sort((a, b) => -1 * (a.order > b.order ? 1 : a.order === b.order ? 0 : -1));
        return this;
    }

    public addField(field: TableField<R>): TableField<R> {
        if (this.fields.some(f => f.name === field.name)) {
            return field;
        }
        if (this._i18nPrefix && field.label && !field.i18n) {
            field.label = this._i18nPrefix + '.' + field.label;
            field.i18n = true;
        }
        this.fields.push(field);
        this.refreshDisplayedColumns();
        return field;
    }

    public setFieldSelection(name: string, selection: Array<TableFieldSelection>): void {
        this._fields = this.fields.map(f => {
            if (f.name === name) {
                f.selection = selection ? selection : [];
            }
            return f;
        });
    }

    public hide(name: string): void {
        this._fields = this.fields.map(f => {
            if (f.name === name) {
                f.hide();
            }
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public hideAll(): void {
        this._fields = this.fields.map(f => {
            f.hide();
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public show(name: string): void {
        this._fields = this.fields.map(f => {
            if (f.name === name) {
                f.show();
            }
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public showAll(): void {
        this._fields = this.fields.map(f => {
            f.show();
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public readonly(name: string, isReadonly: boolean): void {
        this._fields = this.fields.map(f => {
            if (f.name === name) {
                f.readonly(isReadonly);
            }
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public readonlyAll(isReadonly: boolean): void {
        this._fields = this.fields.map(f => {
            f.readonly(isReadonly);
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public setLabel(name: string, lbl: string): void {
        this._fields = this.fields.map(f => {
            if (f.name === name) {
                f.label = lbl ? lbl : '';
            }
            return f;
        });
        this.refreshDisplayedColumns();
    }

    public sortWith(sort: TableSortContext): void {
        this._predicate = sort.field.name;
        this._reverse = sort.direction === 'desc' ? true : false;
        if (this._sortChangedSubject) {
            this._sortChangedSubject.next(sort);
        }
        if (this._dataSorter) {
            this.data = this._dataSorter(this.data, sort) || [];
        } else {
            this._dataSource$.sort = sort;
        }
    }

    public sortChanged(): Observable<TableSortContext> {
        return this._sortChangedSubject.asObservable();
    }

    public filter(): void {
        this._dataSource$.filter = this.filteredValue;
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
