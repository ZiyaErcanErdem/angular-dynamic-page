import { Observable, Subject, BehaviorSubject, of, Subscription } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { PageManager, IDynamicStorageProvider } from './page-manager';
import { PageConfig } from './page-config';
import { DynamicDataSource } from './dynamic-data-source';
import { ColumnMetadata } from './column-metadata';
import { Criteria } from './criteria';
import { Predicate } from './predicate';
import { Operator } from './operator.enum';
import { Condition } from './condition.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationType } from './relation-type.enum';
import { ColumnType } from './column-type.enum';
import { SortContext } from './sort-context';
import { SelectionModel } from '@angular/cdk/collections';
import { DynamicAction } from './dynamic-action';
import { PageMetamodel } from './page-metamodel';
import { PageRelation } from './page-relation';
import { HttpResponse, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { GenericPageConfig } from './generic-page-config';
import { PageMode } from './page-mode.enum';
import { ComponentType } from '@angular/cdk/portal';
import { TemplateRef, ElementRef } from '@angular/core';
import { DynamicPortalView, DynamicViewType } from './dynamic-portal-view';
import { PageViewMode } from './page-view-mode.enum';
import { EditorMode } from './editor-mode.enum';
import { QueryBuilder, CriteriaBuilder } from './query-builder';
import { PageType } from './page-type.enum';
import { DataActionType } from './data-action-type.enum';
import { DynamicSelectorModel, DynamicSelectorBuilder } from './dynamic-selector-model';
import { QueryMode } from './query-mode.enum';
import { RelationPageBuilder } from './relation-page-builder';
import { BuilderType } from './builder-type.enum';
import { GridViewMode } from './grid-view-mode.enum';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicBaseComponent } from './dynamic-base-component';
import { Theme } from './theme.enum';
import { PopoverContent } from './popover-content';
import { PopoverRef } from './popover-ref';
import { DynamicDataAuthorizer } from './dynamic-data-authorizer';
import { IDynamicConfig } from './dynamic-config';
import { DynamicPopoverService } from '../services/dynamic-popover.service';
import { DynamicDataService } from '../services/dynamic-data.service';
import { DynamicMetamodelService } from '../services/dynamic-metamodel.service';
import { DynamicEditorComponent } from '../components/dynamic-editor/dynamic-editor.component';
import { DynamicPageComponent } from '../components/dynamic-page/dynamic-page.component';
import { PopoverConfig } from './popover-config';

export class DynamicPageManager<T> extends DynamicBaseComponent implements PageManager<T> {
    private router: Router;
    private dialog: DynamicPopoverService;
    private provider: DynamicDataService;
    private datasource: DynamicDataSource<T>;
    private actionList: Array<DynamicAction<any>>;
    private gridCols: Array<string>;
    private compactCols: Array<string>;

    private readySubject: BehaviorSubject<boolean>;
    private pageModeSubject: BehaviorSubject<PageMode>;
    private gridViewModeSubject: BehaviorSubject<GridViewMode>;
    private pageDataSubject: BehaviorSubject<T>;
    private pageFormSubject: BehaviorSubject<FormGroup>;
    private pagePortalSubject: BehaviorSubject<DynamicPortalView<any>>;
    private datasourceSubject: BehaviorSubject<DynamicDataSource<T>>;
    private metamodelSubject: BehaviorSubject<PageMetamodel>;
    private columnsSubject: BehaviorSubject<Array<ColumnMetadata>>;
    private actionSubject: BehaviorSubject<Array<DynamicAction<any>>>;
    private gridColumnsSubject: BehaviorSubject<Array<ColumnMetadata>>;
    private sortSubject: Subject<SortContext>;
    private searchColumnsSubject: BehaviorSubject<Array<ColumnMetadata>>;
    private pageQuerySubject: BehaviorSubject<Criteria>;
    private relationPagesSubject: BehaviorSubject<Array<RelationPageBuilder>>;
    private exitSubject: Subject<T>;
    private notificationSubject: Subject<any>;
    private routeDataSubscription: Subscription;
    private activeManagerSubject: BehaviorSubject<PageManager<any>>;
    private formValueChangeSubject: Subject<{form: FormGroup, control: AbstractControl, name: string, value: any}>;

    private configConfigurer: (config: PageConfig<T>) => PageConfig<T>;
    private metamodelConfigurer: (col: ColumnMetadata, parent?: ColumnMetadata) => void;
    private relationConfigurer: (col: PageRelation) => PageRelation;
    private defaultQueryProvider: (qb: CriteriaBuilder<T>, parentData?: any) => void;
    private defaultQueryConstraintProvider: (qb: CriteriaBuilder<T>) => void;
    private dataActionController: (actionType: DataActionType, data: T) => Promise<boolean>;
    private dataAuthorizer: DynamicDataAuthorizer<T, any>;
    private storage: IDynamicStorageProvider;

    private defaultPageURI: string;
    private sortingSample: Array<string>;

    private columnsSelection: SelectionModel<ColumnMetadata>;
    private dataSelection: SelectionModel<T>;
    private isReady = false;
    private pageMetamodel: PageMetamodel;
    private metadataProvider: DynamicMetamodelService;
    private lastQuery: Criteria;
    private defaultQuery: Criteria;
    private defaultQueryConstraints: Criteria;

    private viewMode: PageViewMode;
    private viewer: DynamicPortalView<any>;

    private componentDestroyed: boolean;
    private pageQualifier: string;
    private pageConfig: PageConfig<T>;
    private triggerType: 'manual' | 'auto' = 'auto';

    private entityUpdateDelegate: (entity: T) => Observable<T>;

    private monitoredFormItems: Array<string>;

    public get qualifier(): string {
        return this.pageQualifier;
    }

    public get config(): PageConfig<any> {
        return this.pageConfig;
    }

    constructor(
        qualifier: string,
        public dynamicConfig: IDynamicConfig,
        // public readonly i18nPrefix: string,
        // public readonly i18nAppName: string,
        // public readonly appPathPrefix: string,
        private parentManager?: PageManager<any>
    ) {
        super();
        this.componentDestroyed = false;
        this.pageQualifier = qualifier;
        this.viewMode = PageViewMode.NONE;
        this.gridCols = new Array<string>();
        this.compactCols = new Array<string>();
        this.pageConfig = new GenericPageConfig(qualifier, dynamicConfig);
        this.columnsSelection = new SelectionModel<ColumnMetadata>(true, [], true);
        this.dataSelection = new SelectionModel<T>(false, [], true);
        this.actionList = new Array<DynamicAction<any>>();

        this.readySubject = new BehaviorSubject<boolean>(false);
        this.pageModeSubject = new BehaviorSubject<PageMode>(PageMode.GRID);
        this.gridViewModeSubject = new BehaviorSubject<GridViewMode>(GridViewMode.NORMAL);
        this.pageDataSubject = new BehaviorSubject<T>(undefined);
        this.pageFormSubject = new BehaviorSubject<FormGroup>(undefined);
        this.pagePortalSubject = new BehaviorSubject<DynamicPortalView<any>>(undefined);
        this.metamodelSubject = new BehaviorSubject<PageMetamodel>(undefined);
        this.columnsSubject = new BehaviorSubject<Array<ColumnMetadata>>([]);
        this.actionSubject = new BehaviorSubject<Array<DynamicAction<any>>>(this.actionList);
        this.gridColumnsSubject = new BehaviorSubject<Array<ColumnMetadata>>([]);
        this.sortSubject = new Subject<SortContext>();
        this.searchColumnsSubject = new BehaviorSubject<Array<ColumnMetadata>>([]);
        this.pageQuerySubject = new BehaviorSubject<Criteria>(undefined);
        this.relationPagesSubject = new BehaviorSubject<Array<RelationPageBuilder>>([]);
        this.exitSubject = new Subject<any>();
        this.notificationSubject = new Subject<any>();
        this.activeManagerSubject = new BehaviorSubject<PageManager<any>>(null);
        this.formValueChangeSubject = new Subject();
        this.monitoredFormItems = [];

        this.collect = this.dataSelection.changed.subscribe(changes => {
            if (this.dataSelection.selected && this.dataSelection.selected.length > 0) {
                this.pageDataSubject.next(this.dataSelection.selected[0]);
            } else {
                this.pageDataSubject.next(undefined);
            }
        });

        this.collect = this.data().subscribe(data => this.manageViewMode(data));
    }

    public getStorageId(): string {
        return `${this.parentManager ? this.parentManager.getStorageId() + '.' : ''}${this.pageMetamodel.getInstanceId()}`;
    }

    public delegateEntityUpdate(delegate: (entity: T) => Observable<T>): void {
        this.entityUpdateDelegate = delegate;
    }

    public clearEntityUpdateDelegate(): void {
        this.entityUpdateDelegate = undefined;
    }

    private destroySubject(subject: Subject<any>): any {
        if (subject) {
            if (!subject.isStopped) {
                subject.complete();
            }
        }
        return undefined;
    }

    public detachViewer(): void {
        if (this.viewer) {
            this.viewer.detach();
            this.viewer = undefined;
        }
    }

    public destroy(): void {
        if (this.componentDestroyed) {
            return;
        }
        this.componentDestroyed = true;
        this.clean();
        if (this.routeDataSubscription) {
            this.routeDataSubscription.unsubscribe();
        }
        this.readySubject = this.destroySubject(this.readySubject);
        this.pageModeSubject = this.destroySubject(this.pageModeSubject);
        this.gridViewModeSubject = this.destroySubject(this.gridViewModeSubject);
        this.pageDataSubject = this.destroySubject(this.pageDataSubject);
        this.pageFormSubject = this.destroySubject(this.pageFormSubject);
        this.pagePortalSubject = this.destroySubject(this.pagePortalSubject);
        this.datasourceSubject = this.destroySubject(this.datasourceSubject);
        this.pageQuerySubject = this.destroySubject(this.pageQuerySubject);
        this.metamodelSubject = this.destroySubject(this.metamodelSubject);
        this.columnsSubject = this.destroySubject(this.columnsSubject);
        this.actionSubject = this.destroySubject(this.actionSubject);
        this.gridColumnsSubject = this.destroySubject(this.gridColumnsSubject);
        this.sortSubject = this.destroySubject(this.sortSubject);
        this.searchColumnsSubject = this.destroySubject(this.searchColumnsSubject);
        this.relationPagesSubject = this.destroySubject(this.relationPagesSubject);
        this.notificationSubject = this.destroySubject(this.notificationSubject);
        this.exitSubject = this.destroySubject(this.exitSubject);
        this.activeManagerSubject = this.destroySubject(this.activeManagerSubject);
        this.formValueChangeSubject = this.destroySubject(this.formValueChangeSubject);

        if (this.pageMetamodel) {
            this.pageMetamodel.getColumns().forEach(col => {
                if (col.selector) {
                    if (col.selector.manager) {
                        col.selector.manager.destroy();
                        col.selector.manager = undefined;
                    }
                    // col.selector = undefined;
                }
            });
        }

        this.configConfigurer = undefined;
        this.metamodelConfigurer = undefined;
        this.relationConfigurer = undefined;
        this.defaultQueryProvider = undefined;
        this.defaultQueryConstraintProvider = undefined;

        if (this.pageMetamodel) {
            this.pageMetamodel.getRelations().forEach(r => {
                if (r.relationBuilder) {
                    r.relationBuilder.destroy();
                    r.relationBuilder = undefined;
                }
            });
            this.pageMetamodel = undefined;
        }

        this.metadataProvider = undefined;
        this.lastQuery = undefined;
        this.defaultQuery = undefined;

        this.detachViewer();

        this.router = undefined;
        this.dialog = undefined;
        this.provider = undefined;
        this.dataAuthorizer = undefined;
        this.storage = undefined;
        if (this.datasource) {
            this.datasource.disconnect(null);
            this.datasource = undefined;
        }

        if (this.actionList) {
            this.actionList.forEach(a => a.destroy());
            this.actionList = undefined;
        }

        if (this.columnsSelection) {
            this.columnsSelection.clear();
            this.columnsSelection = undefined;
        }

        if (this.dataSelection) {
            this.dataSelection.clear();
            this.dataSelection = undefined;
        }

        this.pageConfig = undefined;
    }

    public isDestroyed(): boolean {
        return this.componentDestroyed;
    }

    public isChild(): boolean {
        return !!this.parentManager;
    }

    public parent(): PageManager<any> {
        return this.parentManager;
    }

    public top(): PageManager<any> {
        return this.isChild() ? this.parentManager.top() : this;
    }

    public withMetamodelProvider(metadataProvider: DynamicMetamodelService): PageManager<T> {
        this.metadataProvider = metadataProvider;
        this.build();
        return this;
    }

    public withSortingSample(...samples: Array<new () => any >): PageManager<T> {
        if (samples && samples.length > 0) {
            this.sortingSample = new Array<string>();
            samples.forEach(sampleType => {
                const sample = new sampleType();
                this.sortingSample = this.sortingSample.concat(Object.keys(sample));
            });
        }
        return this;
    }

    public withRouter(router: Router): PageManager<T> {
        this.router = router;
        if (this.config && this.config.pageType === PageType.PAGE) {
            this.defaultPageURI = router.url.split('?')[0];
        }
        return this;
    }

    public withRoute(route: ActivatedRoute): PageManager<T> {
        this.routeDataSubscription = route.data.subscribe(data => {
            if (this.isDestroyed()) {
                return;
            }
            if (data.pagingParams && data.pagingParams.page >= 0) {
                this.config.page = data.pagingParams.page;
                this.config.previousPage = data.pagingParams.page;
                this.config.reverse = data.pagingParams.ascending;
                this.config.predicate = data.pagingParams.predicate;
            } else {
                this.config.page = 1;
                this.config.previousPage = 1;
                this.config.reverse = true;
                this.config.predicate = 'id';
            }
        });
        return this;
    }

    public withStorageProvider(storage: IDynamicStorageProvider): PageManager<T> {
        this.storage = storage;
        return this;
    }

    public withGridColumns(...cols: string[]): PageManager<T> {
        this.gridCols = cols;
        return this;
    }
    public withCompactColumns(...cols: string[]): PageManager<T> {
        this.compactCols = cols;
        return this;
    }

    public withDataActionController(dataActionControllerFn: (actionType: DataActionType, data: T) => Promise<boolean>): PageManager<T> {
        this.dataActionController = dataActionControllerFn;
        return this;
    }

    public withViewerTrigger(viewerTrigger: 'manual' | 'auto'): PageManager<T> {
        this.triggerType = viewerTrigger;
        return this;
    }

    public withViewer(viewMode: PageViewMode, viewer?: DynamicPortalView<any>): PageManager<T> {
        if (!viewMode) {
            return this;
        }
        this.viewMode = viewMode;
        this.viewer = viewer;
        /*
        if (this.viewMode === PageViewMode.EDITOR && !viewer) {
            this.viewer = DynamicPortalView.createFromComponent(DynamicEditorComponent);
        }
        */
        return this;
    }

    public setView(view: DynamicPortalView<any>): void {
        if (view && !view.completed) {
            this.collect = view.attached().subscribe(attached => {
                if (attached) {
                    // console.log('View is attached');
                    this.setPageMode(PageMode.VIEW);
                }
            });
            this.collect = view.detached().subscribe(detached => {
                if (detached) {
                    // this.setPageMode(PageMode.GRID);
                }
            });
            this.pagePortalSubject.next(view);
        }
    }

    public dataSelectionChange(): Observable<boolean> {
        return this.dataSelection.changed.pipe(map(s => true));
    }

    public isDataSelected(data: T): boolean {
        return this.dataSelection ? this.dataSelection.isSelected(data) : false;
    }

    public deselectData(data: T): void {
        this.dataSelection.deselect(data);
    }

    public hasSelectedData(): boolean {
        return this.dataSelection ? this.dataSelection.hasValue() : false;
    }

    public getSelectedData(): T {
        return this.hasSelectedData() ? this.dataSelection.selected[0] : null;
    }

    public getDataById(id: any): T {
        if (this.datasource) {
            return this.datasource.findDataById(id);
        }
        return null;
    }

    public isIdSelected(id: any): boolean {
        return this.isDataSelected(this.getDataById(id));
    }

    public deselectDataById(id: any): void {
        this.deselectData(this.getDataById(id));
    }

    public clearSelection(): void {
        if (this.dataSelection) {
            this.dataSelection.clear();
        }
    }

    public toggleDataById(id: any): void {
        this.toggleData(this.getDataById(id));
    }

    public toggleData(data: T): void {
        if (this.config.pageType === PageType.POPUP || this.config.pageType === PageType.SELECTOR) {
            if (data && !this.isDataSelected(data)) {
                this.dataSelection.toggle(data);
            }
            this.exit(data);
        } else {
            if (this.hasSelectedData()) {
                const oldData = this.getSelectedData();
                if (oldData && oldData === data) {
                    this.collect = this.executeAction(oldData, DataActionType.BEFORE_DESELECT, d => {
                        return of(d);
                    }).subscribe();
                }
            }
            if (!this.isDataSelected(data)) {
                this.collect = this.executeAction(data, DataActionType.BEFORE_SELECT, d => {
                    this.dataSelection.toggle(data);
                    return of(d);
                }).subscribe();
            } else {
                this.dataSelection.toggle(data);
                if (!this.dataSelection.hasValue()) {
                    this.setPageMode(PageMode.GRID);
                }
            }
        }
    }

    private manageViewMode(data: any): void {
        if (this.viewMode === PageViewMode.NONE) {
            return;
        }
        const currentPageMode = (this.pageModeSubject && this.pageModeSubject.value) ? this.pageModeSubject.value : PageMode.GRID;
        if (!data && currentPageMode === PageMode.GRID) {
          return;
        }
        if (this.triggerType === 'auto') {
            this.changeViewMode();
        }
    }

    private changeViewMode(preferredViewerMode?: EditorMode): void {
        if (this.viewMode === PageViewMode.EDITOR || this.viewMode === PageViewMode.DETAIL) {
            if (!this.viewer) {
                this.viewer = DynamicPortalView.createFromComponent(DynamicEditorComponent);
            }
            if (this.viewer.isDetached()) {
                this.viewer = this.viewer.renew();
            }
            if (!this.viewer.isAttached()) {
                this.collect = this.viewer.attached().subscribe(attached => {
                    if (attached) {
                        let editorMode = this.viewMode === PageViewMode.EDITOR ? EditorMode.EDIT : EditorMode.VIEW;
                        if (preferredViewerMode) {
                            editorMode = preferredViewerMode;
                        }
                        this.viewer.componentRef.instance.manager = this;
                        this.viewer.componentRef.instance.mode = editorMode;
                        this.viewer.componentRef.instance.theme = this.config.pageTheme;
                        this.viewer.componentRef.instance.updateOn = this.config.formUpdateOnMode;
                    }
                });
                this.setView(this.viewer);
            }
            return;
        } else if (this.viewMode === PageViewMode.CUSTOM) {
            if (this.viewer) {
                if (this.viewer.type === DynamicViewType.COMPONENT && this.viewer.isDetached()) {
                    this.viewer = this.viewer.renew();
                } else {
                    this.viewer = this.viewer.renew();
                }
                this.setView(this.viewer);
            }
            return;
        }
    }

    public withPageConfiguration(configFn: (config: PageConfig<T>) => PageConfig<T>): PageManager<T> {
        this.configConfigurer = configFn;
        return this;
    }

    public withMetamodelConfiguration(metamodelConfigFn: (col: ColumnMetadata, parent?: ColumnMetadata) => void): PageManager<T> {
        this.metamodelConfigurer = metamodelConfigFn;
        return this;
    }

    public withRelationConfiguration(relationConfigFn: (col: PageRelation) => PageRelation): PageManager<T> {
        this.relationConfigurer = relationConfigFn;
        return this;
    }

    public withDataProvider(provider: DynamicDataService): PageManager<T> {
        this.provider = provider;
        return this;
    }

    public withDataAuthorizer<A>(dataAuthorizer: DynamicDataAuthorizer<T, A>): PageManager<T> {
        this.dataAuthorizer = dataAuthorizer;
        return this;
    }

    public withDialog(dialog: DynamicPopoverService): PageManager<T> {
        this.dialog = dialog;
        return this;
    }

    public withDefaultQuery(defaultQueryProviderFn: (qb: CriteriaBuilder<T>, parentData?: any) => void): PageManager<T> {
        this.defaultQueryProvider = defaultQueryProviderFn;
        return this;
    }

    public withDefaultQueryConstraint(defaultQueryConstraintProviderFn: (qb: CriteriaBuilder<T>) => void): PageManager<T> {
        this.defaultQueryConstraintProvider = defaultQueryConstraintProviderFn;
        return this;
    }

    public findColumn(columnPath: string): ColumnMetadata {
        return this.pageMetamodel.findColumn(columnPath);
    }

    public getAssociationColumns(): Array<ColumnMetadata> {
        return this.pageMetamodel.getAssociationColumns();
    }

    public openViewer(preferredViewerMode?: EditorMode): void {
        if (this.viewMode === PageViewMode.NONE) {
            return;
        }
        this.setPageMode(PageMode.VIEW);
        this.changeViewMode(preferredViewerMode);
    }

    public openDialog<C, R>(content: PopoverContent, context: C, config: PopoverConfig = {}): PopoverRef<C, R> {
        return this.dialog.openDialog<C, R>(content, context, config);
    }

    public openPopup<C, R>(origin: HTMLElement, content: PopoverContent, context: C, config: PopoverConfig = {}): PopoverRef<C, R> {
        return this.dialog.openPopup<C, R>(origin, content, context, config);
    }

    public openAlert(message: string, config: PopoverConfig = {}): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            const ref = this.dialog.openAlert(message, config);
            ref.afterClosed$.subscribe(result => {
                resolve(result ? result.data : false);
            });
        });
        return promise;
    }

    public openConfirmation(message: string, config: PopoverConfig = {}): Promise<boolean> {
        const promise = new Promise<boolean>((resolve, reject) => {
            const ref = this.dialog.openConfirmation(message, config);
            ref.afterClosed$.subscribe(result => {
                resolve(result ? result.data : false);
            });
        });
        return promise;
    }

    public createComponentPortal(component: ComponentType<any>): DynamicPortalView<any> {
        return DynamicPortalView.createFromComponent(component);
    }

    public createTemplatePortal(template: TemplateRef<any>, context?: any): DynamicPortalView<any> {
        return DynamicPortalView.createFromTemplate(template, context);
    }

    public openEditor(mode: EditorMode): PopoverRef<any, any> {
        const ctx: { manager: PageManager<any>; mode: EditorMode } = {
            manager: this,
            mode
        };
        const theme = this.config.pageTheme;
        const actions = this.actionSubject.value;
        const title = this.config.pageTitle;
        const i18n = title ? true : false;
        const ref = this.openDialog<{ manager: PageManager<any>; mode: EditorMode }, any>(
            DynamicEditorComponent, ctx, {theme, actions, title, i18n}
        );
        return ref;
    }

    public openDynamicPage(manager: PageManager<any>, theme: Theme, title?: string, i18n?: boolean): PopoverRef<any, any> {
        const ref = this.openDialog<PageManager<any>, any>(DynamicPageComponent, manager, {theme, title, i18n});
        return ref;
    }

    public createInstanceFor(qualifier: string, parent?: PageManager<any>): PageManager<any> {
        const instance = new DynamicPageManager<any>(qualifier, this.dynamicConfig, parent);
        instance.withStorageProvider(this.storage);
        return instance;
    }

    public createSelectorBuilder<S>(qualifier: string, accessPath: string): DynamicSelectorBuilder<S> {
        const selectorModel = new DynamicSelectorBuilder<S>(qualifier, accessPath);
        return selectorModel;
    }

    public createRelationPageManager(relation: PageRelation): RelationPageBuilder {
        const relPageBuilder = new RelationPageBuilder(relation, this, this.config, this.pageMetamodel);
        return relPageBuilder;
    }

    public openSelector(selector: DynamicSelectorModel<any>): void {
        const selectorBuilder = this.createSelectionBuilder(selector);

        if (!selectorBuilder) {
            return;
        }
        const i18n = selector.pageTitle ? true : false;
        const ref = this.openDynamicPage(selectorBuilder, this.config.pageTheme, selector.pageTitle, i18n);
        const sub = selectorBuilder.onExit().subscribe(data => {
            ref.close(data);
        });

        this.collect = ref.afterClosed$.subscribe(result => {
            if (sub) {
                sub.unsubscribe();
            }
            selector.select(result ? result.data : undefined);
        });
    }

    private createSelectionBuilder<S>(selector: DynamicSelectorModel<S>): PageManager<S> {
        if (!selector) {
            return undefined;
        }
        if (selector.manager && !selector.manager.isDestroyed()) {
            return selector.manager;
        }
        selector.manager = this.createInstanceFor(selector.qualifier, this)
            .withPageConfiguration(config => {
                config.pageType = PageType.SELECTOR;
                config.queryMode = selector.queryMode ? selector.queryMode : QueryMode.EXAMPLE;
                config.pageTheme = this.config.pageTheme;
                config.itemsPerPage = 50;
                config.canCreate = false;
                config.canEdit = false;
                config.canDelete = false;
                config.showPageActions = true;
                return config;
            })
            .withMetamodelConfiguration(cmd => {
                if (!selector.selectorColumns) {
                    return;
                }
                if (cmd.relType === RelationType.SELF) {
                    cmd.showWhenGrid = selector.selectorColumns.includes(cmd.name);
                    cmd.showWhenCompact = selector.selectorColumns.includes(cmd.name);
                    if (selector.selectorColumnStyles) {
                        const colWith = selector.selectorColumnStyles.get(cmd.name);
                        if (colWith) {
                            cmd.gridColWith = colWith;
                        }
                    }
                }
                cmd.order = selector.selectorColumns.indexOf(cmd.name);
                cmd.order = cmd.order < 0 ? 1000 : cmd.order;
            })
            .withRelationConfiguration(relation => {
                if (relation.relationType === RelationType.SELF) {
                    relation.accessPath = selector.accessPath;
                }
                return relation;
            })
            .withDefaultQuery(query => {
                if (!selector.defaultQueryItems || selector.defaultQueryItems.length === 0) {
                    return;
                }
                const criteriaBuilder = query
                    .withCondition(Condition.AND)
                    .readonly()
                    .enabled();
                selector.defaultQueryItems.forEach(qi => {
                    criteriaBuilder.addPredicate(qi.name, qi.operator, qi.value);
                });
            })
            .withViewer(PageViewMode.NONE);

        if (!selector.pageTitle) {
            selector.pageTitle = this.config.pageTitle;
        }
        return selector.manager;
    }

    private build(): void {
        if (this.isReady) {
            // do nothing...
        } else {
            this.configureConfig();
            if (!this.config) {
                return;
            }
            if (this.config.pageRelation && this.config.pageRelation.metamodel) {
                Promise.resolve(this.config.pageRelation.metamodel).then(mm => this.handlePageMetamodel(mm));
            } else if (this.metadataProvider) {
                const mm = this.metadataProvider.getCachedMetamodel(this.config.qualifier, this.dynamicConfig.microserviceName);
                if (mm) {
                    this.handlePageMetamodel(mm);
                    return;
                }
                this.collect = this.metadataProvider.metadataOf(
                    this.config.qualifier,
                    this.dynamicConfig.microserviceName,
                    this.dynamicConfig.appPathPrefix
                ).subscribe(
                    (res: HttpResponse<PageMetamodel>) => {
                        const qmd: PageMetamodel = res.body;
                        this.handlePageMetamodel(qmd);
                    },
                    (res: HttpErrorResponse) => {
                        const err = `Could not find metadata of: ${this.config.qualifier}`;
                        console.warn(err);
                        this.metamodelSubject.error(err);
                    }
                );
            }
        }
    }

    private handlePageMetamodel(metamodel: PageMetamodel): void {
        this.pageMetamodel = metamodel;
        this.configureRelations(this.pageMetamodel);
        const cols: Array<ColumnMetadata> = this.pageMetamodel.getColumns();
        this.configureColumns(cols);
        this.configureDefaultQuery();
        this.isReady = true;
        this.readySubject.next(this.isReady);
        this.setActiveManager(this);
    }

    private configureConfig(): void {
        if (this.configConfigurer) {
            this.pageConfig = this.configConfigurer(this.config);
        }
    }

    private configureRelations(rootMetamodel: PageMetamodel): void {
        rootMetamodel.getRelations().forEach(rel => (rel.label = this.config.toI18nEntity(rel.qualifier)));

        if (this.relationConfigurer) {
            rootMetamodel.getRelations().map(rel => this.relationConfigurer(rel));
        }
        this.metamodelSubject.next(rootMetamodel);

        const relatedPages = rootMetamodel
            .getRelations()
            .filter(rel => rel.relationBuilder !== undefined)
            .map(rel => rel.relationBuilder);

        this.relationPagesSubject.next(relatedPages);
    }

    private configureDefaultQuery(parentData?: any): void {
        if (this.defaultQueryProvider) {
            const queryBuiler: QueryBuilder<T> = new QueryBuilder<T>(this);
            this.defaultQueryProvider(queryBuiler.query(), parentData);
            this.defaultQuery = queryBuiler.build();
        } else {
            this.defaultQuery = new Criteria(Condition.AND);
        }
        this.lastQuery = this.defaultQuery;
        this.pageQuerySubject.next(this.defaultQuery);
    }

    private configureDefaultQueryConstraints(criteria: Criteria): Criteria {
        let query: Criteria = null;
        if (this.defaultQueryConstraintProvider) {
            const queryBuiler: QueryBuilder<T> = new QueryBuilder<T>(this);
            this.defaultQueryConstraintProvider(queryBuiler.query());
            query = queryBuiler.build();
        }
        if (query && query.predicates && query.predicates.length > 0) {
            query.predicates.push(criteria);
        } else {
            query = criteria;
        }
        return query;
    }

    private configureColumns(cols: Array<ColumnMetadata>): void {
        if (!cols) {
            return;
        }
        let configuredCols = cols;

        configuredCols.forEach(col => {
            if (col.relType === RelationType.SELF) {
                col.showWhenGrid = this.gridCols.includes(col.path);
                col.showWhenCompact = this.compactCols.includes(col.path);
            }
            if (this.sortingSample && this.sortingSample.length > 0) {
                col.order = this.sortingSample.indexOf(col.name);
                col.order = col.order < 0 ? 1000 : col.order + 100;
            }
        });

        if (this.dynamicConfig.i18nPrefix || this.dynamicConfig.i18nAppName) {
            configuredCols = configuredCols.map(cmd => this.addI18n(cmd));
        }

        this.reconfigureColumns(configuredCols);

        configuredCols = configuredCols.sort((c1, c2) => {
            return c1.order > c2.order ? 1 : c1.order === c2.order ? 0 : -1;
        });

        this.columnsSubject.next(configuredCols);

        let listableCols = new Array<ColumnMetadata>();
        this.buildListableGridColumns(listableCols, configuredCols);
        listableCols = listableCols.filter(cmd => cmd.listable);

        const gridColsSetting = this.retrieveGridColumnSelectionSetting();
        if (gridColsSetting) {
            listableCols.forEach(col => {
                col.showWhenGrid = gridColsSetting.includes(col.path);
            });
        }
        const selectedCols = listableCols.filter(cmd => cmd.showWhenGrid);

        this.gridColumnsSubject.next(listableCols);
        this.columnsSelection.clear();
        this.columnsSelection.select(...selectedCols);

        let searchableCols = new Array<ColumnMetadata>();
        this.buildSearchableGridColumns(searchableCols, configuredCols);
        searchableCols = searchableCols.filter(cmd => cmd.searchable);
        this.searchColumnsSubject.next(searchableCols);

        const sortPredicate = this.config.predicate ? this.config.predicate : 'id';
        const sortDir = this.config.reverse ? 'desc' : 'asc';
        let sortColumn: ColumnMetadata = null;
        cols.forEach(cmd => {
            if (cmd.path === sortPredicate) {
                sortColumn = cmd;
            }
        });

        if (null !== sortColumn) {
            const sortCtx: SortContext = {
                column: sortColumn,
                direction: sortDir
            };
            this.sortSubject.next(sortCtx);
        }
    }

    private retrieveGridColumnSelectionSetting(): string[] {
        const cols = this.retrieveSetting('displayedColumns') as string[];
        return cols ? Array.from(cols) : undefined;
    }

    private reconfigureColumns(cols: Array<ColumnMetadata>, parent?: ColumnMetadata): void {
        if (!cols || !this.metamodelConfigurer) {
            return;
        }
        cols.forEach(col => {
            if (col.relType === RelationType.SELF) {
                this.metamodelConfigurer(col, parent);
                if (col.selector) {
                    this.setupReadonlyColumnsForSelector(col.selector, cols);
                }
            } else if (col.relType === RelationType.INNER && col.columnType !== ColumnType.ASSOCIATION) {
                this.metamodelConfigurer(col, parent);
            } else if (col.relType === RelationType.OUTER && col.columnType !== ColumnType.ASSOCIATION) {
                this.metamodelConfigurer(col, parent);
                col.listable = false;
            } else if (col.relType === RelationType.OUTER && col.metamodel) {
                col.listable = false;
                this.reconfigureColumns(col.metamodel.getColumns(), col);
            } else if (col.relType === RelationType.INNER && col.metamodel) {
                col.listable = false;
                this.reconfigureColumns(col.metamodel.getColumns(), col);
            }
        });
    }

    private setupReadonlyColumnsForSelector(selector: DynamicSelectorModel<any>, cols: Array<ColumnMetadata>): void {
        if (!selector || !cols || cols.length <= 0) {
            return;
        }
        cols.forEach(col => {
            const isEditable = selector.isEditableSelection(col.name);
            if (!isEditable) {
                col.readonly = true;
            }
        });
    }

    private buildListableGridColumns(listableCols: Array<ColumnMetadata>, cols: Array<ColumnMetadata>, relation?: PageRelation): void {
        if (!cols) {
            return;
        }

        const globallyIgnored = !relation ? false : !relation.listable;

        cols.forEach(col => {
            if (col.ignorable || globallyIgnored) {
                // Do not show columns annotated ad JsonIgnore or globally ignored with relation
                col.listable = false;
                return;
            }
            if (col.relType === RelationType.SELF) {
                listableCols.push(col);
            } else if (col.relType === RelationType.INNER && col.columnType !== ColumnType.ASSOCIATION) {
                listableCols.push(col);
            } else if (col.relType === RelationType.OUTER) {
                col.listable = false;
                listableCols.push(col);
            } else if (col.relType === RelationType.INNER && col.metamodel) {
                const rel = col.relation; // this.pageMetamodel.getRelation(col.metamodel.group);
                this.buildListableGridColumns(listableCols, col.metamodel.getColumns(), rel);
            }
        });
    }

    private buildSearchableGridColumns(searchableCols: Array<ColumnMetadata>, cols: Array<ColumnMetadata>): void {
        if (!cols) {
            return;
        }
        cols.forEach(col => {
            if (col.relType === RelationType.SELF) {
                searchableCols.push(col);
            } else if (col.relType === RelationType.INNER && col.columnType !== ColumnType.ASSOCIATION) {
                searchableCols.push(col);
            } else if (col.relType === RelationType.OUTER && col.columnType !== ColumnType.ASSOCIATION) {
                searchableCols.push(col);
            } else if (col.relType === RelationType.INNER && col.metamodel) {
                this.buildSearchableGridColumns(searchableCols, col.metamodel.getColumns());
            } else if (col.relType === RelationType.OUTER && col.metamodel) {
                this.buildSearchableGridColumns(searchableCols, col.metamodel.getColumns());
            }
        });
    }

    private addI18n(cmd: ColumnMetadata): ColumnMetadata {
        if (cmd.metamodel && cmd.columnType === ColumnType.ASSOCIATION) {
            cmd.label = this.config.toI18n(cmd.label);
            cmd.metamodel.getColumns().forEach(col => this.addI18n(col));
        } else if (cmd.idColumn) {
            cmd.label = this.config.toI18n('id', 'dynamic.field.', true);
        } else {
            cmd.label = this.config.toI18n(cmd.label);
        }

        if (cmd.columnType === ColumnType.ENUM && cmd.options) {
            cmd.options.map(o => {
                o.label = this.config.toI18nEnum(o.label);
                return o;
            });
        }
        return cmd;
    }

    public setPageMode(mode: PageMode): void {
        if (!mode) {
            return;
        }
        if (PageMode.GRID === mode) {
            this.setGridViewMode(GridViewMode.NORMAL);
        } else if (PageMode.VIEW === mode) {
            this.setGridViewMode(GridViewMode.COMPACT);
        }
        this.pageModeSubject.next(mode);
    }

    public setGridViewMode(gridViewMode: GridViewMode): void {
        if (!gridViewMode) {
            return;
        }
        this.gridViewModeSubject.next(gridViewMode);
    }

    public ready(): Observable<boolean> {
        return this.readySubject.asObservable();
    }

    public mode(): Observable<PageMode> {
        return this.pageModeSubject.asObservable();
    }

    public gridViewMode(): Observable<GridViewMode> {
        return this.gridViewModeSubject.asObservable();
    }

    public query(): Observable<Criteria> {
        return this.pageQuerySubject.asObservable();
    }

    public data(): Observable<T> {
        return this.pageDataSubject.asObservable();
    }

    public form(): Observable<FormGroup> {
        return this.pageFormSubject.asObservable();
    }

    public formItemChange(...formItems: string[]): Observable<{form: FormGroup, control: AbstractControl, name: string, value: any}> {
        formItems = [].concat(formItems);
        this.collect = this.form().subscribe(form => {
            if (form) {
                formItems.forEach(formItem => {
                    if (!this.monitoredFormItems.includes(formItem)) {
                        const control = form.get(formItem);
                        if (control) {
                            this.monitoredFormItems.push(formItem);
                            this.collect = control.valueChanges.subscribe(val => {
                                this.formValueChangeSubject.next({form, control, name: formItem, value: val});
                            });
                        }
                    }
                });
            }
        });
        return this.formValueChangeSubject
            .pipe(
                filter(c => formItems.includes(c.name))
            );
    }

    public portal(): Observable<DynamicPortalView<any>> {
        return this.pagePortalSubject.asObservable();
    }

    public metamodel(): Observable<PageMetamodel> {
        return this.metamodelSubject.asObservable();
    }

    public columns(): Observable<Array<ColumnMetadata>> {
        return this.columnsSubject.asObservable();
    }

    public actions(): Observable<Array<DynamicAction<any>>> {
        return this.actionSubject.asObservable();
    }

    public relationPages(): Observable<Array<RelationPageBuilder>> {
        return this.relationPagesSubject.asObservable();
    }

    public onNotification(): Observable<any> {
        return this.notificationSubject.asObservable();
    }
    public onExit(): Observable<T> {
        return this.exitSubject.asObservable();
    }

    public activeManager(): Observable<PageManager<any>> {
        return this.activeManagerSubject.asObservable();
    }

    private informDataActionController(dataActionType: DataActionType, data: T): Promise<boolean> {
        let promise;
        if (this.dataActionController) {
            promise = this.dataActionController(dataActionType, data);
        }
        if (!promise) {
            promise = this.getDefaultEntityActionPromise(dataActionType, data);
        }
        return promise;
    }

    private getDefaultEntityActionPromise(dataActionType: DataActionType, data: T): Promise<boolean> {
        if (dataActionType === DataActionType.BEFORE_DELETE) {
            const entityId = data[`id`];
            if (entityId) {
                const q = this.prepareDeleteQuestion();
                if (q) {
                    return this.openConfirmation(q, {i18nParams: { id: entityId }, title: 'dynamic.delete.title'});
                }
            }
        }
        return Promise.resolve(true);
    }

    private prepareDeleteQuestion(): string {
        if (!this.dynamicConfig.i18nPrefix || !this.dynamicConfig.i18nAppName || !this.config.qualifier) {
            return undefined;
        }
        const q = this.config.toI18n(this.config.qualifier + '.delete.question');
        return q;
    }

    private findAfterAction(actionType: DataActionType): DataActionType {
        switch (actionType) {
            case DataActionType.BEFORE_SELECT: {
                return DataActionType.AFTER_SELECT;
            }
            case DataActionType.BEFORE_DESELECT: {
                return DataActionType.AFTER_DESELECT;
            }
            case DataActionType.BEFORE_CREATE: {
                return DataActionType.AFTER_CREATE;
            }
            case DataActionType.BEFORE_UPDATE: {
                return DataActionType.AFTER_UPDATE;
            }
            case DataActionType.BEFORE_DELETE: {
                return DataActionType.AFTER_DELETE;
            }
            default: {
                return actionType;
            }
        }
    }

    private executeAction(entity: T, actionType: DataActionType, action: (entity: T) => Observable<T>): Observable<T> {
        return new Observable(observer => {
            this.informDataActionController(actionType, entity).then(ok => {
                if (ok) {
                    this.collect = action(entity).subscribe(data => {
                        observer.next(data);
                        this.informDataActionController(this.findAfterAction(actionType), data);
                        observer.complete();
                    });
                } else {
                    observer.complete();
                }
            });
        });
    }

    public sortChanged(): Observable<SortContext> {
        return this.sortSubject.asObservable();
    }

    public refreshSearch(): Observable<Array<T>> {
        return this.search(this.lastQuery);
    }

    public searchWith(parentData: any): Observable<Array<T>> {
        this.configureDefaultQuery(parentData);
        return this.search(this.defaultQuery);
    }

    public search(criteria: Criteria): Observable<Array<T>> {
        const query = this.configureDefaultQueryConstraints(criteria);
        if (this.datasource) {
            this.lastQuery = criteria;
            const searchQuery = this.extractSearchQuery(query);
            this.clearSelection();
            console.warn(`PageManager.search => page: ${this.config.page} query: ${searchQuery}`);
            if (this.dataAuthorizer) {
                const authContext = this.dataAuthorizer.createAutrozitonContext();
                return this.datasource
                    .authorizedSearch(authContext, {
                        search: searchQuery,
                        page: this.config.page ? this.config.page - 1 : 0,
                        size: this.config.itemsPerPage,
                        sort: this.sort()
                    })
                    .pipe(map(res => res.content));
            }
            return this.datasource.search({
                search: searchQuery,
                page: this.config.page ? this.config.page - 1 : 0,
                size: this.config.itemsPerPage,
                sort: this.sort()
            });
        }
        return of([]);
    }

    public create(entity: T, errHandler?: (err: any) => void): Observable<T> {
        return this.executeAction(entity, DataActionType.BEFORE_CREATE, data => {
            const selfRel = this.pageMetamodel.getSelfRelation();
            const response = this.datasource.createEntity(selfRel, data).pipe(
                map(res => res.body),
                tap(
                    responseData => {
                        this.refreshSearch().subscribe();
                        // this.appendEntities(responseData);
                    },
                    err => (errHandler ? errHandler(err) : undefined)
                )
            );
            return response;
        });
    }

    public update(entity: T, errHandler?: (err: any) => void): Observable<T> {
        return this.executeAction(entity, DataActionType.BEFORE_UPDATE, data => {
            if (this.entityUpdateDelegate) {
                const delegatedResponse = this.entityUpdateDelegate(data).pipe(
                    tap(
                        updatedData => {
                            // entity = Object.assign(entity, responseData);
                            // console.log('PageManager.Update => entity updated');
                            this.refreshSearch().subscribe();
                            // this.synchEntity(updatedData);
                        },
                        err => (errHandler ? errHandler(err) : undefined)
                    )
                );
                return delegatedResponse;
            } else {
                const selfRel = this.pageMetamodel.getSelfRelation();
                const response = this.datasource.updateEntity(selfRel, data).pipe(
                    map(res => res.body),
                    tap(
                        responseData => {
                            // entity = Object.assign(entity, responseData);
                            // console.log('PageManager.Update => entity updated');
                            this.refreshSearch().subscribe();
                            // this.synchEntity(responseData);
                        },
                        err => (errHandler ? errHandler(err) : undefined)
                    )
                );
                return response;
            }
        });
    }

    public delete(entity: T, errHandler?: (err: any) => void): Observable<boolean> {
        return this.executeAction(entity, DataActionType.BEFORE_DELETE, data => {
            const selfRel = this.pageMetamodel.getSelfRelation();
            const response = this.datasource.deleteEntity(selfRel, data[`id`]).pipe(
                map(res => res.body),
                tap(
                    rc => {
                        this.refreshSearch().subscribe();
                        // console.log('PageManager.Delete => entity deleted: ' + rc);
                        // this.removeEntity(data);
                    },
                    err => (errHandler ? errHandler(err) : undefined)
                )
            );
            return response;
        }).pipe(map(d => true));
    }

    public loadData(data: T[]): void {
        if (this.datasource) {
            this.datasource.loadData(data);
        }
    }

    public convertToExcel(blob: Blob, fileName: string, elmLink: ElementRef): void {
        this.datasource.convertToExcel(blob, fileName, elmLink);
    }

    public importExcelData(formData: FormData): Observable<HttpEvent<{}>> {
        return this.datasource.importExcelData(formData);
    }

    public async exportExcelData(): Promise<Blob> {
        const criteria = this.lastQuery;
        const query = this.configureDefaultQueryConstraints(criteria);
        const searchQuery = this.extractSearchQuery(query);
        const req = {
            search: searchQuery,
            page: this.config.page - 1,
            size: this.config.itemsPerPage,
            sort: this.sort()
        };
        return this.datasource.exportExcelData(req);
    }

    public async exportExcelTemplate(req?: any): Promise<Blob> {
        return this.datasource.exportExcelTemplate(req);
    }

    public clearData(): void {
        if (this.datasource) {
            this.datasource.clearData();
        }
    }

    public appendEntities(...entity: T[]): void {
        if (this.datasource) {
            this.datasource.appendEntities(entity);
        }
    }

    public synchEntity(entity: T): void {
        if (this.datasource) {
            this.datasource.synchEntity(entity);
        }
    }

    public removeEntity(entity: T): void {
        if (this.datasource) {
            this.datasource.removeEntity(entity);
        }
    }

    public notify(err: any): void {
        if (this.notificationSubject) {
            this.notificationSubject.next(err);
        }
    }

    public exit(entity: T): void {
        this.exitSubject.next(entity);
    }

    public setActiveManager(apb: PageManager<any>): void {
        if (this.parentManager) {
            this.parentManager.setActiveManager(apb);
        } else if (this.activeManagerSubject) {
            this.activeManagerSubject.next(apb);
        }
    }

    public setForm(form: FormGroup): void {
        if (this.pageFormSubject) {
            this.pageFormSubject.next(form);
        }
    }

    public findRelatedEntity<R>(relation: PageRelation, id: any): Observable<R> {
        // console.log('PageManager.find entity');
        const response = this.datasource.findEntity<R>(relation, id).pipe(
            map(res => res.body),
            tap(result => {
                // console.log('PageManager.find => entity found: ' + result);
            })
        );
        return response;
    }

    public findRelatedEntities<R>(relation: PageRelation): Observable<Array<R>> {
        // console.log('PageManager.findAllEntities');
        const response = this.datasource.findAllEntities<R>(relation).pipe(
            map(res => res.body),
            tap(results => {
                // console.log('PageManager.findAllEntities => entities found: ' + (results ? results.length : 0));
            })
        );
        return response;
    }

    public navigate(criteria: Criteria, page: number): Observable<Array<T>> {
        // console.warn(`PageManager.navigate => page: ${page}`);
        if (page !== this.config.previousPage) {
            this.config.previousPage = page;
            return this.transition(criteria);
        }
        return of([]);
    }

    public sortWith(ctx: SortContext, criteria: Criteria): Observable<Array<T>> {
        this.setPageMode(PageMode.GRID);
        this.config.predicate = this.toPath(ctx.column);
        this.config.reverse = ctx.direction === 'desc' ? true : false;
        if (this.datasource) {
            this.sortSubject.next(ctx);
            return this.transition(criteria);
        }

        return of([]);
    }

    private transition(criteria: Criteria): Observable<Array<T>> {
        if (this.router && this.defaultPageURI && this.config.pageType === PageType.PAGE) {
            this.router.navigate([this.defaultPageURI], {
                queryParams: {
                    page: this.config.page,
                    size: this.config.itemsPerPage,
                    sort: this.config.predicate + ',' + (this.config.reverse ? 'desc' : 'asc')
                }
            });
        }
        return this.search(criteria);
    }

    clear(criteria: Criteria) {
        this.config.page = 1;
        if (this.router && this.defaultPageURI) {
            this.router.navigate([
                this.defaultPageURI,
                {
                    page: this.config.page,
                    sort: this.config.predicate + ',' + (this.config.reverse ? 'desc' : 'asc')
                }
            ]);
        }
        this.search(criteria).subscribe();
    }

    public gridColumnsSelection(): SelectionModel<ColumnMetadata> {
        return this.columnsSelection;
    }

    public registerAction(action: DynamicAction<any>): boolean {
        if (action && this.actionList && !this.actionList.includes(action) && !this.actionList.find(a => a.id === action.id)) {
            this.actionList = this.actionList.concat([action]);
            this.actionSubject.next(this.actionList);
            return true;
        }
        return false;
    }

    public unregisterAction(action: DynamicAction<any>): void {
        if (this.actionSubject && action && this.actionList) {
            this.actionList = this.actionList.filter(a => a !== action);
            this.actionSubject.next(this.actionList);
        }
    }

    public gridColumns(): Observable<Array<ColumnMetadata>> {
        return this.gridColumnsSubject.asObservable();
    }

    public searchColumns(): Observable<Array<ColumnMetadata>> {
        return this.searchColumnsSubject.asObservable();
    }

    public connect(): Observable<DynamicDataSource<T>> {
        if (!this.datasourceSubject) {
            this.datasource = new DynamicDataSource<T>(this.config.qualifier, this.dynamicConfig, this.provider, this);
            this.datasource.successVisitor = (data: T[], headers?: HttpHeaders, authMap?: Map<number, any>) =>
                this.successVisitor(data, headers, authMap);
            this.datasource.errorVisitor = (error: HttpErrorResponse) => this.errorVisitor(error);
            this.datasourceSubject = new BehaviorSubject<DynamicDataSource<T>>(this.datasource);
        }
        return this.datasourceSubject.asObservable();
    }

    private sort() {
        // this.config.predicate = 'id';
        // this.config.reverse = false;
        const result = [this.config.predicate + ',' + (this.config.reverse ? 'desc' : 'asc')];
        if (this.config.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private successVisitor(data: T[], headers?: HttpHeaders, authMap?: Map<number, any>): T[] {
        if (this.isDestroyed()) {
            return data;
        }

        if (headers) {
            this.config.links = this.provider.parseLink(headers.get('link'));
            this.config.totalItems = headers.get('X-Total-Count');
            this.config.queryCount = this.config.totalItems;
        } else {
            this.config.links = {};
            this.config.totalItems = data ? data.length : 0;
            this.config.queryCount = this.config.totalItems;
        }

        if (this.dataAuthorizer) {
            this.dataAuthorizer.setAuthorizationMap(authMap);
            return this.dataAuthorizer.authorizeAll(data, authMap);
        }
        return data;
    }

    private errorVisitor(error: HttpErrorResponse) {
        this.notify(error.message);
    }

    private extractSearchQuery(criteria: Criteria): string {
        if (!criteria) {
            return '';
        }
        let q = '';
        const condition = criteria.condition;
        criteria.predicates.forEach(spec => {

            const data: Criteria = spec as Criteria;
            if (data.condition) {
            // if (spec.hasOwnProperty('condition')) {
                const c: Criteria = spec as Criteria;
                const expression = this.extractSearchQuery(c);
                q = this.merge(q, expression, condition);
            } else {
                const p: Predicate = spec as Predicate;
                if (!p.metadata || p.metadata.metamodel || !p.operator) {
                    return;
                }
                const expression = this.toExpression(p);
                q = this.merge(q, expression, condition);
            }
        });
        if (q && q.length > 0 && (q.startsWith(',') || q.startsWith(';'))) {
            q = q.substr(1);
        }
        return q && q.length > 0 ? '(' + q + ')' : q;
    }

    private merge(query: string, expression: string, condition: Condition): string {
        if (!expression || expression.length === 0) {
            return query;
        }
        const out = query + (Condition.AND === condition ? ';' : ',') + expression;
        return out;
    }

    private toExpression(predicate: Predicate): string {
        const cmd: ColumnMetadata = predicate.metadata;
        if (!cmd) {
            // console.log(`Skipping expression. Field ${predicate.field} is not defined. Check manager config!`);
            return '';
        }
        const op = predicate.operator;
        const value = this.toValue(predicate);
        if (!value || !predicate.value) {
            if (op !== Operator.IS_NULL && op !== Operator.IS_NOT_NULL) {
                return '';
            }
        }

        const operant = this.toRSQLOperant(predicate.operator);
        const path = this.toPath(cmd);
        const expression = path + '' + operant + '' + value;
        return expression;
    }

    private toPath(col: ColumnMetadata): string {
        let path = col.path;
        if (this.config.builderType === BuilderType.ASSOCIATION) {
            path = col.name;
        }
        return path;
    }

    private toValue(predicate: Predicate): string {
        const cmd: ColumnMetadata = predicate.metadata;
        const op: Operator = predicate.operator;
        switch (op) {
            case Operator.IN:
            case Operator.NOT_IN: {
                return this.toMultiValue('', predicate.value, '', cmd.columnType);
            }
            case Operator.LIKE:
            case Operator.NOT_LIKE: {
                return this.toSingleValue('*', predicate.value, '*', cmd.columnType);
            }
            case Operator.SW:
            case Operator.NOT_SW: {
                return this.toSingleValue('', predicate.value, '*', cmd.columnType);
            }
            case Operator.EW:
            case Operator.NOT_EW: {
                return this.toSingleValue('*', predicate.value, '', cmd.columnType);
            }
            case Operator.IS_NULL:
            case Operator.IS_NOT_NULL: {
                return '';
            }
            case Operator.BETWEEN: {
                return this.toMultiValue('', predicate.value, '', cmd.columnType);
            }
            default: {
                return this.toSingleValue('', predicate.value, '', cmd.columnType);
            }
        }
    }

    private toSingleValue(prefix: string, val: any, posfix: string, colType: ColumnType): string {
        if (val === undefined || val === null) {
            return '';
        }

        let out = '';
        switch (colType) {
            case ColumnType.ENUM:
            case ColumnType.DATE:
            case ColumnType.STRING: {
                out = `'${prefix}${val}${posfix}'`;
                break;
            }
            default: {
                out = '' + val + '';
                break;
            }
        }
        return out;
    }

    private toMultiValue(prefix: string, vals: Array<any>, posfix: string, colType: ColumnType): string {
        if (!vals || vals.length < 1 || !Array.isArray(vals)) {
            return '';
        }
        const out = `('${vals.join('\',\'')}')`;
        return out;
    }

    private toRSQLOperant(operator: Operator): string {
        switch (operator) {
            case Operator.EQ: {
                return '==';
            }
            case Operator.NOT_EQ: {
                return '!=';
            }
            case Operator.GT: {
                return '=gt=';
            }
            case Operator.GTE: {
                return '=ge=';
            }
            case Operator.LT: {
                return '=lt=';
            }
            case Operator.LTE: {
                return '=le=';
            }
            case Operator.IN: {
                return '=in=';
            }
            case Operator.NOT_IN: {
                return '=out=';
            }
            case Operator.LIKE: {
                return '==';
            }
            case Operator.NOT_LIKE: {
                return '!=';
            }
            case Operator.SW: {
                return '==';
            }
            case Operator.NOT_SW: {
                return '!=';
            }
            case Operator.EW: {
                return '==';
            }
            case Operator.NOT_EW: {
                return '!=';
            }
            case Operator.IS_NULL: {
                return '==null';
            }
            case Operator.IS_NOT_NULL: {
                return '!=null';
            }
            case Operator.BETWEEN: {
                return '==';
            }
            default: {
                return '';
            }
        }
    }

    public newPredicate(relation?: PageRelation): Predicate {
        const cmd = this.getDefaultColumn(relation);
        const predicateRel = relation ? relation : this.pageMetamodel.findRelation(cmd);
        const predicatePath = cmd ? cmd.path : '';
        const predicate: Predicate = {
            field: predicatePath,
            value: this.getValueOf(cmd ? cmd.defaultValue : ''),
            operator: this.config.getDefaultOperator(cmd),
            metadata: cmd,
            hidden: false,
            readonly: false,
            relation: predicateRel
        };
        return predicate;
    }

    public createPredicate(parent: Criteria, col?: ColumnMetadata): Predicate {
        let rel: PageRelation = null;
        if (col) {
            rel = this.pageMetamodel.findRelation(col);
        }
        const predicate: Predicate = this.newPredicate(rel);
        parent.predicates = parent.predicates.concat([predicate]);
        return predicate;
    }

    public removePredicate(predicate: Predicate, parent: Criteria): void {
        parent.predicates = parent.predicates.filter(r => r !== predicate);
    }

    public createCriteria(parent: Criteria, withoutPredicate?: boolean): Criteria {
        const criteria: Criteria = new Criteria(Condition.AND);
        if (!withoutPredicate) {
            this.createPredicate(criteria);
        }
        parent.predicates = parent.predicates.concat([criteria]);
        return criteria;
    }

    public removeCriteria(criteria: Criteria, parent: Criteria): void {
        parent.predicates = parent.predicates.filter(r => r !== criteria);
    }

    public resetQuery(): Criteria {
        const q: Criteria = this.lastQuery ? this.lastQuery : this.defaultQuery;
        this.resetCriteriaInternal(q);
        return q;
    }

    public storeSetting(key: string, value: any): void {
        if (this.storage) {
            const dynKey = this.keyOfSetting(key);
            this.storage.store(dynKey, value);
        }
    }

    public retrieveSetting(key: string): any {
        if (this.storage) {
            const dynKey = this.keyOfSetting(key);
            return this.storage.retrieve(dynKey);
        }
        return undefined;
    }

    public clearSetting(key?: string): void {
        if (this.storage) {
            const dynKey = this.keyOfSetting(key);
            this.storage.clear(dynKey);
        }
    }

    private keyOfSetting(key?: string): string {
        return `${this.getStorageId()}.${key ? key : 'none'}`;
    }

    private resetCriteriaInternal(q: Criteria | Predicate): void {
        if (!q) {
            return;
        }
        const isCriteria = !!(q as  Criteria).predicates;
        // const isCriteria = q.hasOwnProperty('predicates');
        if (isCriteria) {
            const c: Criteria = q as Criteria;
            if (c && c.predicates && c.predicates.length > 0) {
                c.predicates.forEach(spec => this.resetCriteriaInternal(spec));
            }
        } else {
            const p: Predicate = q as Predicate;
            if (p.hidden || p.readonly || !p.metadata) {
                return;
            }
            if (!p.metadata) {
                return;
            }
            const cmd = p.metadata;
            p.value = this.getValueOf(cmd ? cmd.defaultValue : '');
        }
    }

    private getDefaultColumn(rel?: PageRelation): ColumnMetadata {
        const defaultCol =
            rel && rel.metamodel ? rel.metamodel.getDefaultColumn() : this.pageMetamodel ? this.pageMetamodel.getDefaultColumn() : null;
        return defaultCol;
    }

    private getValueOf(param: any): any {
        switch (typeof param) {
            case 'function':
                return param();
            default:
                return param;
        }
    }
}
