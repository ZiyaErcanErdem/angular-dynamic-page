import { Operator } from './operator.enum';
import { ColumnMetadata } from './column-metadata';
import { PageRelation } from './page-relation';

export interface Predicate {
    field: string;
    value?: any;
    operator?: Operator;
    metadata: ColumnMetadata;
    relation: PageRelation;
    hidden?: boolean;
    readonly?: boolean;
}
