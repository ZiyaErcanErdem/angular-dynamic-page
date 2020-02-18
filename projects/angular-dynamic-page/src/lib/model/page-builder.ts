import { PageConfig } from './page-config';
import { DynamicDataSource } from './dynamic-data-source';
import { Observable } from 'rxjs';
import { ColumnMetadata } from './column-metadata';
import { Criteria } from './criteria';
import { Router, ActivatedRoute } from '@angular/router';
import { SortContext } from './sort-context';
import { SelectionModel } from '@angular/cdk/collections';
import { DynamicAction } from './dynamic-action';
import { PageRelation } from './page-relation';
import { PageMetamodel } from './page-metamodel';
import { Predicate } from './predicate';
import { PageMode } from './page-mode.enum';
import { ComponentType } from '@angular/cdk/portal';
import { TemplateRef, ElementRef } from '@angular/core';
import { DynamicPortalView } from './dynamic-portal-view';
import { PageViewMode } from './page-view-mode.enum';
import { CriteriaBuilder } from './query-builder';
import { DataActionType } from './data-action-type.enum';
import { EditorMode } from './editor-mode.enum';
import { DynamicSelectorModel, DynamicSelectorBuilder } from './dynamic-selector-model';
import { RelationPageBuilder } from './relation-page-builder';
import { HttpEvent } from '@angular/common/http';
import { GridViewMode } from './grid-view-mode.enum';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Theme } from './theme.enum';
import { PopoverContent } from './popover-content';
import { PopoverRef } from './popover-ref';
import { DynamicDataAuthorizer } from './dynamic-data-authorizer';
import { IDynamicConfig } from './dynamic-config';
import { DynamicPopoverService } from '../services/dynamic-popover.service';
import { DynamicDataService } from '../services/dynamic-data.service';
import { DynamicMetamodelService } from '../services/dynamic-metamodel.service';
import { PopoverConfig } from './popover-config';

export interface IDynamicStorageProvider {
  store(key: string, value: any): void;
  retrieve(key: string): any;
  clear(key?: string): void;
  observe(key: string): Observable<any>;
}

export interface PageBuilder<T> {
  readonly qualifier: string;
  readonly dynamicConfig: IDynamicConfig;
  readonly config: PageConfig<any>;

  withRouter(router: Router): PageBuilder<T>;
  withRoute(route: ActivatedRoute): PageBuilder<T>;
  withDialog(dialog: DynamicPopoverService): PageBuilder<T>;
  withDataProvider(dataProvider: DynamicDataService): PageBuilder<T>;
  withViewerTrigger(viewerTrigger: 'manual' | 'auto'): PageBuilder<T>;
  withViewer(viewMode: PageViewMode, viewer?: DynamicPortalView<any>): PageBuilder<T>;
  withPageConfiguration(configFn: (config: PageConfig<T>) => PageConfig<T>): PageBuilder<T>;
  withMetamodelProvider(metamodelProvider: DynamicMetamodelService): PageBuilder<T>;
  withMetamodelConfiguration(metamodelConfigFn: (col: ColumnMetadata, parent?: ColumnMetadata) => void): PageBuilder<T>;
  withRelationConfiguration(relationConfigFn: (relation: PageRelation) => PageRelation): PageBuilder<T>;
  withDefaultQuery(defaultQueryProviderFn: (qb: CriteriaBuilder<T>, parentData?: any) => void): PageBuilder<T>;
  withDefaultQueryConstraint(defaultQueryConstraintProviderFn: (qb: CriteriaBuilder<T>) => void): PageBuilder<T>;
  withSortingSample(...samples: Array<new () => any >): PageBuilder<T>;
  withDataActionController(dataActionControllerFn: (actionType: DataActionType, data: T) => Promise<boolean>): PageBuilder<T>;
  withDataAuthorizer<A>(dataAuthorizer: DynamicDataAuthorizer<T, A>): PageBuilder<T>;
  withStorageProvider(storage: IDynamicStorageProvider): PageBuilder<T>;
  withGridColumns(...cols: string[]): PageBuilder<T>;
  withCompactColumns(...cols: string[]): PageBuilder<T>;
  findColumn(columnPath: string): ColumnMetadata;
  getAssociationColumns(): Array<ColumnMetadata>;

  top(): PageBuilder<any>;
  parent(): PageBuilder<any>;
  ready(): Observable<boolean>;
  metamodel(): Observable<PageMetamodel>;
  query(): Observable<Criteria>;
  columns(): Observable<Array<ColumnMetadata>>;
  actions(): Observable<Array<DynamicAction<any>>>;
  mode(): Observable<PageMode>;
  gridViewMode(): Observable<GridViewMode>;
  data(): Observable<T>;
  form(): Observable<FormGroup>;
  formItemChange(...formItems: string[]): Observable<{form: FormGroup, control: AbstractControl, name: string, value: any}>;
  portal(): Observable<DynamicPortalView<any>>;
  relationPages(): Observable<Array<RelationPageBuilder>>;
  activeBuilder(): Observable<PageBuilder<any>>;
  onNotification(): Observable<any>;
  onExit(): Observable<T>;

  setPageMode(mode: PageMode): void;
  setGridViewMode(gridViewMode: GridViewMode): void;
  setView(view: DynamicPortalView<any>): void;
  registerAction(action: DynamicAction<any>): boolean;
  unregisterAction(action: DynamicAction<any>): void;
  setActiveBuilder(apb: PageBuilder<any>): void;
  setForm(form: FormGroup): void;

  gridColumns(): Observable<Array<ColumnMetadata>>;
  gridColumnsSelection(): SelectionModel<ColumnMetadata>;

  searchColumns(): Observable<Array<ColumnMetadata>>;

  connect(): Observable<DynamicDataSource<T>>;
  search(criteria: Criteria): Observable<Array<T>>;
  refreshSearch(): Observable<Array<T>>;
  searchWith(data: any): Observable<Array<T>>;

  navigate(criteria: Criteria, page: number): Observable<Array<T>>;

  sortWith(ctx: SortContext, criteria: Criteria): Observable<Array<T>>;
  sortChanged(): Observable<SortContext>;

  toggleData(data: T): void;
  isDataSelected(data: T): boolean;
  deselectData(data: T): void;
  hasSelectedData(): boolean;
  getSelectedData(): T;
  getDataById(id: any): T;
  isIdSelected(id: any): boolean;
  deselectDataById(id: any): void;
  clearSelection(): void;
  toggleDataById(id: any): void;
  dataSelectionChange(): Observable<boolean>;

  create(entity: T, errHandler?: (err: any) => void): Observable<T>;
  update(entity: T, errHandler?: (err: any) => void): Observable<T>;
  delete(entity: T, errHandler?: (err: any) => void): Observable<boolean>;
  findRelatedEntity<R>(relation: PageRelation, id: any): Observable<R>;
  findRelatedEntities<R>(relation: PageRelation): Observable<Array<R>>;

  delegateEntityUpdate(delegate: (entity: T) => Observable<T>): void;
  clearEntityUpdateDelegate(): void;

  importExcelData(formData: FormData): Observable<HttpEvent<{}>>;
  exportExcelData(): Promise<Blob>;
  exportExcelTemplate(req?: any): Promise<Blob>;
  convertToExcel(blob: Blob, fileName: string, elmLink: ElementRef): void;

  loadData(data: T[]): void;
  clearData(): void;
  appendEntities(...data: T[]): void;
  synchEntity(data: T): void;
  removeEntity(data: T): void;

  notify(notification: any): void;
  exit(entity: T): void;
  destroy(): void;
  detachViewer(): void;
  isDestroyed(): boolean;
  isChild(): boolean;

  createInstanceFor<R>(qualifier: string, parent?: PageBuilder<any>): PageBuilder<R>;
  createSelectorBuilder(qualifier: string, accessPath: string): DynamicSelectorBuilder<any>;
  createRelationPageBuilder(relation: PageRelation): RelationPageBuilder;

  openViewer(preferredViewerMode?: EditorMode): void;

  openDialog<C, R>(content: PopoverContent, context: C, config: PopoverConfig): PopoverRef<C, R>;
  openPopup<C, R>(origin: HTMLElement, content: PopoverContent, context: C, config: PopoverConfig): PopoverRef<C, R>;
  openAlert(message: string, config: PopoverConfig): Promise<any>;
  openConfirmation(message: string, config: PopoverConfig): Promise<boolean>;

  createComponentPortal(component: ComponentType<any>): DynamicPortalView<any>;
  createTemplatePortal(template: TemplateRef<any>, context?: any): DynamicPortalView<any>;

  openEditor(mode: EditorMode): PopoverRef<any, any>;
  openDynamicPage(builder: PageBuilder<any>, theme: Theme, title?: string, i18n?: boolean): PopoverRef<any, any>;
  openSelector(selector: DynamicSelectorModel<any>): void;

  newPredicate(): Predicate;
  createCriteria(parent: Criteria, withoutPredicate?: boolean): Criteria;
  createPredicate(parent: Criteria, col?: ColumnMetadata): Predicate;
  removeCriteria(criteria: Criteria, parent: Criteria): void;
  removePredicate(predicate: Predicate, parent: Criteria): void;
  resetQuery(): Criteria;

  getStorageId(): string;
  storeSetting(key: string, value: any): void;
  retrieveSetting(key: string): any;
  clearSetting(key?: string): void;
}
