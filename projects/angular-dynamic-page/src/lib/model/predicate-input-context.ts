import { ColumnMetadata } from './column-metadata';
import { Predicate } from './predicate';
import { OptionContext } from './option-context';

export interface PredicateInputContext {
    options: Array<OptionContext>;
    column: ColumnMetadata;
    $implicit: Predicate;
}
