import { DataSource } from '@angular/cdk/table';
import { Observable, Subscription, BehaviorSubject, combineLatest, of, merge, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableSortContext, TablePageContext, TablePaginator } from './table-field-control';
import { TableField } from './table-field';

export class TableDataSource<R> extends DataSource<R> {
    private dataSubject: BehaviorSubject<R[]>;
    private activeDataSubject = new BehaviorSubject<R[]>([]);
    private tableFilter = new BehaviorSubject<string>('');
    private sortContext: TableSortContext | null;
    private tablePaginator: TablePaginator | null;

    renderChangesSubscription = Subscription.EMPTY;

    filteredData: R[];

    sortingDataAccessor: ((data: R, field: TableField<any>) => string | number) = (data: R, field: TableField<any>): string | number => {
        const value = field.read(data);
        // const value = (data as { [key: string]: any })[field.name];
        return field.type === 'number' ? Number(value) : value;
    }

    get data() {
        return this.dataSubject.value;
    }
    set data(data: R[]) {
        this.dataSubject.next(data);
    }

    get filter(): string {
        return this.tableFilter.value;
    }
    set filter(filter: string) {
        this.tableFilter.next(filter);
    }

    get sort(): TableSortContext | null {
        return this.sortContext;
    }
    set sort(sort: TableSortContext | null) {
        this.sortContext = sort;
        this._updateChangeSubscription();
    }

    get paginator(): TablePaginator | null {
        return this.tablePaginator;
    }
    set paginator(paginator: TablePaginator | null) {
        this.tablePaginator = paginator;
        this._updateChangeSubscription();
    }

    constructor(initialData: R[] = []) {
        super();
        this.dataSubject = new BehaviorSubject<R[]>(initialData);
        this._updateChangeSubscription();
    }


    public sortData: ((data: R[], sort: TableSortContext) => R[]) = (data: R[], sort: TableSortContext): R[] => {
        const field = sort.field;
        const direction = sort.direction;
        if (!field || direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            const valueA = this.sortingDataAccessor(a, field);
            const valueB = this.sortingDataAccessor(b, field);

            let comparatorResult = 0;
            if (valueA != null && valueB != null) {
                if (valueA > valueB) {
                    comparatorResult = 1;
                } else if (valueA < valueB) {
                    comparatorResult = -1;
                }
            } else if (valueA != null) {
                comparatorResult = 1;
            } else if (valueB != null) {
                comparatorResult = -1;
            }

            return comparatorResult * (direction === 'asc' ? 1 : -1);
        });
    }

    private stringify(data: any): string {
        if (data === undefined || data === null) {
            return '◬';
        } else if (typeof data === 'object') {
            return Object.keys(data)
                .reduce((currentTerm: string, key: string) => {
                    const val = (data as { [key: string]: any })[key];
                    return currentTerm + this.stringify(val) + '◬';
                }, '')
                .toLowerCase();
        } else {
            return data;
        }
    }

    public filterPredicate: ((data: R, filter: string) => boolean) = (data: R, filter: string): boolean => {
        const dataStr = this.stringify(data);
        const transformedFilter = filter.trim().toLowerCase();
        return dataStr.includes(transformedFilter);
    }

    private _updateChangeSubscription() {
        const sortChange: Observable<TableSortContext | null | void> = this.sortContext ? of(this.sortContext) : of(null);
        const pageChange: Observable<TablePageContext | null | void> = this.tablePaginator ? merge(this.tablePaginator.page) : of(null);

        const dataStream = this.dataSubject;
        const filteredData = combineLatest([dataStream, this.tableFilter]).pipe(map(([data]) => this._filterData(data)));
        const orderedData = combineLatest([filteredData, sortChange]).pipe(map(([data]) => this._orderData(data)));
        const paginatedData = combineLatest([orderedData, pageChange]).pipe(map(([data]) => this._pageData(data)));

        this.renderChangesSubscription.unsubscribe();
        this.renderChangesSubscription = paginatedData.subscribe(data => this.activeDataSubject.next(data));
    }

    private _filterData(data: R[]) {
        this.filteredData = !this.filter ? data : data.filter(obj => this.filterPredicate(obj, this.filter));

        if (this.tablePaginator) {
            this._updatePaginator(this.filteredData.length);
        }

        return this.filteredData;
    }

    private _orderData(data: R[]): R[] {
        if (!this.sort) {
            return data;
        }

        return this.sortData(data.slice(), this.sort);
    }

    private _pageData(data: R[]): R[] {
        if (!this.tablePaginator) {
            return data;
        }

        const startIndex = this.tablePaginator.pageIndex * this.tablePaginator.pageSize;
        return data.slice().splice(startIndex, this.tablePaginator.pageSize);
    }

    private _updatePaginator(filteredDataLength: number) {
        Promise.resolve().then(() => {
            if (!this.paginator) {
                return;
            }

            this.paginator.dataSize = filteredDataLength;

            // If the page index is set beyond the page, reduce it to the last page.
            if (this.paginator.pageIndex > 0) {
                const lastPageIndex = Math.ceil(this.paginator.dataSize / this.paginator.pageSize) - 1 || 0;
                this.paginator.pageIndex = Math.min(this.paginator.pageIndex, lastPageIndex);
            }
        });
    }

    private destroySubject(subject: Subject<any>): any {
        if (subject) {
            if (!subject.isStopped) {
                subject.complete();
            }
        }
        return undefined;
    }

    public connect() {
        return this.activeDataSubject;
    }

    public disconnect() {}

    public destroy() {
        this.dataSubject = this.destroySubject(this.dataSubject);
        this.activeDataSubject = this.destroySubject(this.activeDataSubject);
        this.tableFilter = this.destroySubject(this.tableFilter);

        if (this.renderChangesSubscription) {
            this.renderChangesSubscription.unsubscribe();
            this.renderChangesSubscription = undefined;
        }

        this.tablePaginator = undefined;
        this.filteredData = undefined;
    }
}
