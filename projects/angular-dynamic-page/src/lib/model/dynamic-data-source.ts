import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpResponse, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { PageBuilder } from './page-builder';
import { ColumnMetadata } from './column-metadata';
import { ColumnType } from './column-type.enum';
import { PageRelation } from './page-relation';
import { DatePipe } from '@angular/common';
import { EditorMode } from './editor-mode.enum';
import { DynamicAuthorizedSearchResponse, DynamicAuthorizableSearchRequest } from './dynamic-authorizable-search-request';
import { IDynamicConfig } from './dynamic-config';
import { ElementRef } from '@angular/core';
import { DynamicDataService } from '../services/dynamic-data.service';

export class DynamicDataSource<T> implements DataSource<T> {
    private dataSubject: BehaviorSubject<T[]>;
    private loadingSubject: BehaviorSubject<boolean>;
    public loading$: Observable<boolean>;

    private columns: Array<ColumnMetadata>;
    private datePipe: DatePipe;

    public successVisitor: (data: T[], headers?: HttpHeaders, authMap?: Map<number, any>) => T[];
    public errorVisitor: (error: HttpErrorResponse) => void;

    private columnsSubscription: Subscription;

    constructor(
        private qualifier: string,
        private dynamicConfig: IDynamicConfig,
        private dynamicDataService: DynamicDataService,
        private builder: PageBuilder<T>
    ) {
        this.datePipe = new DatePipe('en-US');
        this.columns = [];
        this.dataSubject = new BehaviorSubject<T[]>([]);
        this.loadingSubject = new BehaviorSubject<boolean>(false);
        this.loading$ = this.loadingSubject.asObservable();

        this.columnsSubscription = this.builder.columns().subscribe(cols => {
            this.columns = cols;
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<T[]> {
        return this.dataSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
        this.columns = undefined;
        if (this.columnsSubscription) {
            this.columnsSubscription.unsubscribe();
            this.columnsSubscription = undefined;
        }
    }

    public findDataById(id: any): T {
        if (!id || this.dataSubject || this.dataSubject.value) {
            return null;
        }
        return this.dataSubject.value.find(c => c[`id`] === id);
    }

    public loadData(data: T[]): void {
        this.loadingSubject.next(false);
        this.dataSubject.next(data);

        if (this.builder.isChild() && this.builder.config.canCreate && (!data || data.length <= 0)) {
            this.builder.openViewer(EditorMode.CREATE);
        }
    }

    public clearData(): void {
        this.onSuccess([]);
    }

    public appendEntities(data: T[]): void {
        const current = this.dataSubject.value;
        if (current) {
            this.loadData(current.concat(data));
        } else {
            this.loadData(data);
        }
    }

    public synchEntity(data: T): void {
        const key = 'id';
        if (!data || !data[key]) {
            return;
        }
        const current = this.dataSubject.value;
        if (current) {
            let target = current.find(c => c[key] === data[key]);
            if (target) {
                target = Object.assign(target, data);
                this.loadData(current.concat([]));
                return;
            }
        }
        const row = new Array<T>();
        row.push(data);
        this.loadData(row);
    }

    public removeEntity(data: T): void {
        const key = 'id';
        if (!data || !data[key]) {
            return;
        }
        const current = this.dataSubject.value;
        if (current) {
            const targetIndex = current.findIndex(c => c[key] === data[key]);
            if (targetIndex > -1) {
                current.splice(targetIndex, 1);
                this.loadData(current);
                return;
            }
        }
    }

    createEntity(relation: PageRelation, entity: T): Observable<HttpResponse<T>> {
        const copy = this.enhanceEntity<T>(relation, entity);
        return this.dynamicDataService
            .createEntity<T>(relation, copy)
            .pipe(map(res => res.clone(this.modifyEntity<T>(relation, res.body))));
    }

    updateEntity(relation: PageRelation, entity: T): Observable<HttpResponse<T>> {
        const copy = this.enhanceEntity<T>(relation, entity);
        return this.dynamicDataService.updateEntity(relation, copy, this.dynamicConfig.microserviceName)
                  .pipe(map(res => res.clone(this.modifyEntity<T>(relation, res.body))));
    }

    deleteEntity(relation: PageRelation, id: number): Observable<HttpResponse<any>> {
        return this.dynamicDataService.deleteEntity(relation, id, this.dynamicConfig.microserviceName);
    }

    findEntity<R>(relation: PageRelation, id: number): Observable<HttpResponse<R>> {
        return this.dynamicDataService.findEntity<R>(relation, id, this.dynamicConfig.microserviceName)
                  .pipe(map(res => res.clone(this.modifyEntity<R>(relation, res.body))));
    }

    findAllEntities<R>(relation: PageRelation): Observable<HttpResponse<Array<R>>> {
        return this.dynamicDataService
            .findAllEntities<R>(relation, null, this.dynamicConfig.microserviceName)
            .pipe(map(res => res.clone<Array<R>>({ body: this.modifyEntities<R>(relation, res.body) })));
    }

    search(req?: any): Observable<T[]> {
        this.loadingSubject.next(true);
        return this.dynamicDataService
            .search<T>(
                this.qualifier,
                this.dynamicConfig.appPathPrefix,
                this.dynamicConfig.microserviceName,
                req, (d: T) => this.modify(this.columns, d)
            )
            .pipe(
                tap((res: HttpResponse<T[]>) => this.onSuccess(res.body, res.headers), (err: HttpErrorResponse) => this.onError(err)),
                map(res => res.body)
            );
    }

    public authorizedSearch<A>(authContext: Map<string, string>, req?: any): Observable<DynamicAuthorizedSearchResponse<T, A>> {
        const query: string = req.search;
        const ctx = new DynamicAuthorizableSearchRequest(this.qualifier, query);
        ctx.provider = this.dynamicConfig.appPathPrefix;
        ctx.authContext = authContext;

        this.loadingSubject.next(true);
        return this.dynamicDataService.authorizedSearch<T, A>(
            ctx,
            this.dynamicConfig.microserviceName,
            req, (d: T) => this.modify(this.columns, d)
        ).pipe(
            tap(
                (res: HttpResponse<DynamicAuthorizedSearchResponse<T, A>>) =>
                    this.onSuccess(res.body.content, res.headers, res.body.authMap),
                (err: HttpErrorResponse) => this.onError(err)
            ),
            map(res => res.body)
        );
    }

    public convertToExcel(blob: Blob, fileName: string, elmLink: ElementRef): void {
        this.dynamicDataService.writeBlobAsResource(blob, fileName, elmLink);
    }

    public importExcelData(formData: FormData): Observable<HttpEvent<{}>> {
        return this.dynamicDataService.importExcelData(this.qualifier, formData, this.dynamicConfig.microserviceName);
    }

    public async exportExcelData(req?: any): Promise<Blob> {
        return this.dynamicDataService.exportExcelData(this.qualifier, req, this.dynamicConfig.microserviceName);
    }

    public async exportExcelTemplate(req?: any): Promise<Blob> {
        return this.dynamicDataService.exportExcelTemplate(this.qualifier, req, this.dynamicConfig.microserviceName);
    }

    private modify<R>(cols: Array<ColumnMetadata>, data: R): R {
        if (!cols) {
            return data;
        }
        cols.forEach(cmd => {
            if (cmd.columnType === ColumnType.DATE) {
                const val = data[cmd.name];
                if (val) {
                    data[cmd.name] = this.datePipe.transform(val, 'yyyy-MM-ddTHH:mm:ss.SSS');
                }
            } else if (cmd.columnType === ColumnType.ASSOCIATION) {
                const relationCols = cmd.metamodel ? cmd.metamodel.getColumns() : undefined;
                const val = data[cmd.name];
                if (relationCols && val) {
                    this.modify(relationCols, val);
                }
            }
        });
        return data;
    }

    private enhance<R>(cols: Array<ColumnMetadata>, data: R): R {
        if (!cols) {
            return data;
        }
        const copy = {...data};
        cols.forEach(cmd => {
            if (cmd.columnType === ColumnType.DATE) {
                const val = data[cmd.name];
                if (val) {
                    copy[cmd.name] = new Date(val).toISOString();
                }
            } else if (cmd.columnType === ColumnType.ASSOCIATION) {
                const relationCols = cmd.metamodel ? cmd.metamodel.getColumns() : undefined;
                const idColumn = cmd.metamodel ? cmd.metamodel.key : undefined;
                const val = data[cmd.name];
                if (relationCols && val) {
                    if (idColumn) {
                        const idVal = val[idColumn];
                        if (!idVal) {
                            copy[cmd.name] = null;
                            return copy;
                        }
                    }
                    copy[cmd.name] = this.enhance(relationCols, val);
                }
            }
        });
        return copy;
    }

    private enhanceEntities<R>(relation: PageRelation, data: R[]): void {
        const original: R[] = data;
        for (let i = 0; i < original.length; i++) {
            original[i] = this.enhanceEntity<R>(relation, original[i]);
        }
    }
    private enhanceEntity<R>(relation: PageRelation, data: R): R {
        if (relation && relation.metamodel) {
            return this.enhance<R>(relation.metamodel.getColumns(), data);
        }
        return data;
    }

    private modifyEntities<R>(relation: PageRelation, data: R[]): R[] {
        const original: R[] = data;
        const enhanced: R[] = [];
        for (const item of original) {
            enhanced.push(this.modifyEntity<R>(relation, item));
        }
        return enhanced;
    }
    private modifyEntity<R>(relation: PageRelation, data: R): R {
        if (relation && relation.metamodel) {
            return this.modify(relation.metamodel.getColumns(), data);
        }
        return data;
    }

    private onSuccess<A>(data: T[], headers?: HttpHeaders, authMap?: Map<number, A>): T[] {
        if (this.successVisitor) {
            authMap = authMap ? authMap : new Map<number, A>();
            const visited = this.successVisitor(data, headers, authMap);
            this.loadData(visited);
            return visited;
        }
        this.loadData(data);
        return data;
    }

    private onError(error: HttpErrorResponse) {
        if (this.errorVisitor) {
            this.errorVisitor(error);
        }
        this.clearData();
    }
}
