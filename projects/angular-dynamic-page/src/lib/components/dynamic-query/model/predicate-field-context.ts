import { ColumnMetadata } from '../../../model/column-metadata';
import { Predicate } from '../../../model/predicate';
import { PageRelation } from '../../../model/page-relation';
import { ColumnContext } from './column-context';

export interface PredicateFieldContext {
    changeField: (col: ColumnMetadata, predicate: Predicate) => void;
    changeRelation: (rel: PageRelation, predicate: Predicate) => void;
    columns: Array<ColumnContext>;
    $implicit: Predicate;
}
