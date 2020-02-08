import { PageMetamodel } from './page-metamodel';
import { RelationType } from './relation-type.enum';
import { ColumnMetadata } from './column-metadata';
import { RelationPageBuilder } from './relation-page-builder';

export class PageRelation {
    public readonly group: string;
    public readonly qualifier: string;
    public readonly relationType: RelationType;
    public accessPath: string;
    public descriptionColumnName: string;
    public popupColumns: Array<string>;
    public pageTitle: string;
    public label: string;
    public metamodel: PageMetamodel;
    public connector: ColumnMetadata;
    public searchable: boolean;
    public listable: boolean;

    public relationBuilder: RelationPageBuilder;

    constructor(relType: RelationType, group: string, qualifier: string) {
        this.relationType = relType;
        this.group = group;
        this.qualifier = qualifier;
        this.relationBuilder = undefined;
        this.searchable = true;
        this.listable = true;
    }
}
