import { PageMetamodel } from './page-metamodel';
import { ColumnMetadata } from './column-metadata';
import { PageBuilder } from './page-builder';
import { PageViewMode } from './page-view-mode.enum';
import { PageConfig } from './page-config';
import { PageType } from './page-type.enum';
import { PageRelation } from './page-relation';
import { Condition } from './condition.enum';
import { Operator } from './operator.enum';
import { BuilderType } from './builder-type.enum';
import { DynamicPortalView } from './dynamic-portal-view';

export class RelationPageBuilder {
    public builder: PageBuilder<any>;
    private gridCols: Array<string>;
    private compactCols: Array<string>;
    private sortingSamples: { new (): any };
    private viewMode: PageViewMode;
    private viewer: DynamicPortalView<any>;
    private metamodelConfigurer: (col: ColumnMetadata) => void;
    private configConfigurer: (config: PageConfig<any>) => PageConfig<any>;
    private relationConfigurer: (builder: PageBuilder<any>, col: PageRelation) => PageRelation;

    constructor(
        public relation: PageRelation,
        private parentBuilder: PageBuilder<any>,
        private parentConfig: PageConfig<any>,
        private parentMetamodel: PageMetamodel
    ) {
        this.gridCols = new Array<string>();
        this.compactCols = new Array<string>();
        this.relation.relationBuilder = this;
    }

    public withGridColumns(...cols: string[]): RelationPageBuilder {
        this.gridCols = cols;
        return this;
    }
    public withCompactColumns(...cols: string[]): RelationPageBuilder {
        this.compactCols = cols;
        return this;
    }
    public withSortingSamples(samples: { new (): any }): RelationPageBuilder {
        this.sortingSamples = samples;
        return this;
    }

    public withMetamodelConfiguration(metamodelConfigFn: (col: ColumnMetadata) => void): RelationPageBuilder {
        this.metamodelConfigurer = metamodelConfigFn;
        return this;
    }

    public withPageConfiguration(configFn: (config: PageConfig<any>) => PageConfig<any>): RelationPageBuilder {
        this.configConfigurer = configFn;
        return this;
    }

    public withRelationConfiguration(
        relationConfigFn: (builder: PageBuilder<any>, col: PageRelation) => PageRelation
    ): RelationPageBuilder {
        this.relationConfigurer = relationConfigFn;
        return this;
    }

    public withViewer(viewMode: PageViewMode, viewer?: DynamicPortalView<any>): RelationPageBuilder {
        if (!viewMode) {
            return this;
        }
        this.viewMode = viewMode;
        this.viewer = viewer;
        return this;
    }

    public destroy(): void {
        if (this.builder) {
            this.builder.destroy();
            this.builder = undefined;
        }

        if (this.relation) {
            this.relation.relationBuilder = undefined;
            this.relation = undefined;
        }

        this.parentBuilder = undefined;
        this.parentConfig = undefined;
        this.parentMetamodel = undefined;
    }

    public build<C>(): PageBuilder<C> {
        if (this.builder && !this.builder.isDestroyed()) {
            return this.builder;
        }
        this.builder = this.parentBuilder.createInstanceFor(this.relation.qualifier, this.parentBuilder);
        this.builder
            .withSortingSample(this.sortingSamples)
            .withPageConfiguration(config => {
                config.itemsPerPage = this.parentConfig.itemsPerPage;
                config.showPageActions = false;
                config.builderType = BuilderType.RELATION;
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
                    this.relationConfigurer(this.builder, rel);
                }
                return rel;
            })
            .withDefaultQuery((query, parentData) => {
                if (!this.parentMetamodel) {
                    return;
                }
                const predicatePath = this.parentMetamodel.group + '.' + this.parentMetamodel.idColumnName;
                query
                    .withCondition(Condition.AND)
                    .hide()
                    .addPredicate(predicatePath, Operator.EQ)
                    .withValue(parentData ? parentData['id'] : 0)
                    .readonly()
                    .hide()
                    .and();
            })
            .withViewer(this.viewMode ? this.viewMode : PageViewMode.EDITOR, this.viewer);

        return this.builder;
    }
}
