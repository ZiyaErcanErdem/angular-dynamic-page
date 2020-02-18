import { OptionContext } from '../../../model/option-context';
import { ColumnMetadata } from '../../../model/column-metadata';
import { Predicate } from '../../../model/predicate';

export interface PredicateInputContext {
    options: Array<OptionContext>;
    column: ColumnMetadata;
    $implicit: Predicate;
}
