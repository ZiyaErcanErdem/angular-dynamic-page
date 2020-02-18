import { PageMetamodel } from './page-metamodel';
import { RelationType } from './relation-type.enum';
import { ColumnMetadata } from './column-metadata';
import { RelationPageManager } from './relation-page-manager';

export class PageRelation {
    public readonly parent: PageMetamodel;
    public readonly metamodel: PageMetamodel;
    public readonly group: string;
    public readonly qualifier: string;
    public readonly relationType: RelationType;
    public readonly path: string;
    public accessPath: string;
    public descriptionColumnName: string;
    public popupColumns: Array<string>;
    public pageTitle: string;
    public label: string;
    public connector: ColumnMetadata;
    public searchable: boolean;
    public listable: boolean;

    public relationManager: RelationPageManager;

    constructor(metamodel: PageMetamodel, parent: PageMetamodel) {
        this.metamodel = metamodel;
        this.parent = parent;
        this.relationType = metamodel.relType;
        this.group = metamodel.group;
        this.qualifier = metamodel.qualifier;
        this.path = metamodel.path;
        this.relationManager = undefined;
        this.searchable = true;
        this.listable = true;
    }
}
