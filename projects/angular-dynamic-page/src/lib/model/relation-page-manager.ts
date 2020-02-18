import { PageMetamodel } from './page-metamodel';
import { ColumnMetadata } from './column-metadata';
import { PageManager } from './page-manager';
import { PageViewMode } from './page-view-mode.enum';
import { PageConfig } from './page-config';
import { PageType } from './page-type.enum';
import { PageRelation } from './page-relation';
import { Condition } from './condition.enum';
import { Operator } from './operator.enum';
import { ManagerType } from './manager-type.enum';
import { DynamicPortalView } from './dynamic-portal-view';

export class RelationPageManager {
    public manager: PageManager<any>;
    private gridCols: Array<string>;
    private compactCols: Array<string>;
    private sortingSamples: new () => any;
    private viewMode: PageViewMode;
    private viewer: DynamicPortalView<any>;
    private metamodelConfigurer: (col: ColumnMetadata) => void;
    private configConfigurer: (config: PageConfig<any>) => PageConfig<any>;
    private relationConfigurer: (manager: PageManager<any>, col: PageRelation) => PageRelation;

    constructor(
        public relation: PageRelation,
        private parentManager: PageManager<any>,
        private parentConfig: PageConfig<any>,
        private parentMetamodel: PageMetamodel
    ) {
        this.gridCols = new Array<string>();
        this.compactCols = new Array<string>();
        this.relation.relationManager = this;
    }

    public withGridColumns(...cols: string[]): RelationPageManager {
        this.gridCols = cols;
        return this;
    }
    public withCompactColumns(...cols: string[]): RelationPageManager {
        this.compactCols = cols;
        return this;
    }
    public withSortingSamples(samples: new () => any ): RelationPageManager {
        this.sortingSamples = samples;
        return this;
    }

    public withMetamodelConfiguration(metamodelConfigFn: (col: ColumnMetadata) => void): RelationPageManager {
        this.metamodelConfigurer = metamodelConfigFn;
        return this;
    }

    public withPageConfiguration(configFn: (config: PageConfig<any>) => PageConfig<any>): RelationPageManager {
        this.configConfigurer = configFn;
        return this;
    }

    public withRelationConfiguration(
        relationConfigFn: (manager: PageManager<any>, col: PageRelation) => PageRelation
    ): RelationPageManager {
        this.relationConfigurer = relationConfigFn;
        return this;
    }

    public withViewer(viewMode: PageViewMode, viewer?: DynamicPortalView<any>): RelationPageManager {
        if (!viewMode) {
            return this;
        }
        this.viewMode = viewMode;
        this.viewer = viewer;
        return this;
    }

    public destroy(): void {
        if (this.manager) {
            this.manager.destroy();
            this.manager = undefined;
        }

        if (this.relation) {
            this.relation.relationManager = undefined;
            this.relation = undefined;
        }

        this.parentManager = undefined;
        this.parentConfig = undefined;
        this.parentMetamodel = undefined;
    }

    public build<C>(): PageManager<C> {
        if (this.manager && !this.manager.isDestroyed()) {
            return this.manager;
        }
        this.manager = this.parentManager.createInstanceFor(this.relation.qualifier, this.parentManager);
        this.manager
            .withSortingSample(this.sortingSamples)
            .withPageConfiguration(config => {
                config.itemsPerPage = this.parentConfig.itemsPerPage;
                config.showPageActions = false;
                config.managerType = ManagerType.RELATION;
                config.pageType = PageType.CHILD_PAGE;
                config.canCreate = this.parentConfig.canCreate;
                config.canEdit = this.parentConfig.canEdit;
                config.canDelete = this.parentConfig.canDelete;
                config.pageTheme = this.parentConfig.pageTheme;
                // config.metamodel = this.relation.metamodel;
                if (this.configConfigurer) {
                    this.configConfigurer(config);
                }
                config.pageType = PageType.CHILD_PAGE;
                return config;
            })
            .withMetamodelConfiguration(cmd => {
                cmd.showWhenGrid = this.gridCols.includes(cmd.path);
                cmd.showWhenCompact = this.compactCols.includes(cmd.path);

                if (cmd.name === 'status') {
                    cmd.gridColWith = '80px';
                    cmd.compactColWidth = '60px';
                }
                if (cmd.name === 'id') {
                    cmd.gridColWith = '60px';
                    cmd.compactColWidth = '50px';
                }

                if (this.metamodelConfigurer) {
                    this.metamodelConfigurer(cmd);
                }
            })
            .withRelationConfiguration(rel => {
                const originalRel = this.parentMetamodel.getRelation(rel.group);
                if (originalRel) {
                    rel.accessPath = originalRel.accessPath;
                    rel.descriptionColumnName = originalRel.descriptionColumnName;
                    rel.pageTitle = originalRel.pageTitle;
                }
                if (this.relationConfigurer) {
                    this.relationConfigurer(this.manager, rel);
                }
                return rel;
            })
            .withDefaultQuery((query, parentData) => {
                if (!this.parentMetamodel) {
                    return;
                }
                const predicatePath = this.parentMetamodel.group + '.' + this.parentMetamodel.key;
                query
                    .withCondition(Condition.AND)
                    .hide()
                    .addPredicate(predicatePath, Operator.EQ)
                    .withValue(parentData ? parentData[`id`] : 0)
                    .readonly()
                    .hide()
                    .and();
            })
            .withViewer(this.viewMode ? this.viewMode : PageViewMode.EDITOR, this.viewer);

        return this.manager;
    }
}
