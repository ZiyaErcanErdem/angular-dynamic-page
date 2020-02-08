import { DataSource } from '@angular/cdk/table';
import { Observable, Subscription, BehaviorSubject, combineLatest, of, merge, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableSortContext, TablePageContext, TablePaginator } from './table-field-control';
import { TableField } from './table-field';

export class TableDataSource<R> extends DataSource<R> {
    private _data: BehaviorSubject<R[]>;
    private _renderData = new BehaviorSubject<R[]>([]);
    private _filter = new BehaviorSubject<string>('');

    _renderChangesSubscription = Subscription.EMPTY;

    filteredData: R[];

    get data() {
        return this._data.value;
    }
    set data(data: R[]) {
        this._data.next(data);
    }

    get filter(): string {
        return this._filter.value;
    }
    set filter(filter: string) {
        this._filter.next(filter);
    }

    get sort(): TableSortContext | null {
        return this._sort;
    }
    set sort(sort: TableSortContext | null) {
        this._sort = sort;
        this._updateChangeSubscription();
    }
    private _sort: TableSortContext | null;

    get paginator(): TablePaginator | null {
        return this._paginator;
    }
    set paginator(paginator: TablePaginator | null) {
        this._paginator = paginator;
        this._updateChangeSubscription();
    }
    private _paginator: TablePaginator | null;

    
    constructor(initialData: R[] = []) {
        super();
        this._data = new BehaviorSubject<R[]>(initialData);
        this._updateChangeSubscription();
    }

    sortingDataAccessor: ((data: R, field: TableField<any>) => string | number) = (data: R, field: TableField<any>): string | number => {
        const value = field.read(data);
        // const value = (data as { [key: string]: any })[field.name];
        return field.type === 'number' ? Number(value) : value;
    };

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
    };

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
    };

    private _updateChangeSubscription() {
        const sortChange: Observable<TableSortContext | null | void> = this._sort ? of(this._sort) : of(null);
        const pageChange: Observable<TablePageContext | null | void> = this._paginator ? merge(this._paginator.page) : of(null);

        const dataStream = this._data;
        const filteredData = combineLatest(dataStream, this._filter).pipe(map(([data]) => this._filterData(data)));
        const orderedData = combineLatest(filteredData, sortChange).pipe(map(([data]) => this._orderData(data)));
        const paginatedData = combineLatest(orderedData, pageChange).pipe(map(([data]) => this._pageData(data)));

        this._renderChangesSubscription.unsubscribe();
        this._renderChangesSubscription = paginatedData.subscribe(data => this._renderData.next(data));
    }

    private _filterData(data: R[]) {
        this.filteredData = !this.filter ? data : data.filter(obj => this.filterPredicate(obj, this.filter));

        if (this._paginator) {
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
        if (!this._paginator) {
            return data;
        }

        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        return data.slice().splice(startIndex, this._paginator.pageSize);
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
        return this._renderData;
    }

    public disconnect() {}

    public destroy() {
        this._data = this.destroySubject(this._data);
        this._renderData = this.destroySubject(this._renderData);
        this._filter = this.destroySubject(this._filter);

        if (this._renderChangesSubscription) {
            this._renderChangesSubscription.unsubscribe();
            this._renderChangesSubscription = undefined;
        }

        this._paginator = undefined;
        this.filteredData = undefined;
    }
}
