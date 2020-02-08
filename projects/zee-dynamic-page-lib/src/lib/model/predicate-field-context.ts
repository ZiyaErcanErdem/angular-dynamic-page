import { Predicate } from './predicate';
import { ColumnContext } from './column-context';
import { PageRelation } from './page-relation';
import { ColumnMetadata } from './column-metadata';

export interface PredicateFieldContext {
    changeField: (col: ColumnMetadata, predicate: Predicate) => void;
    changeRelation: (rel: PageRelation, predicate: Predicate) => void;
    columns: Array<ColumnContext>;
    $implicit: Predicate;
}
