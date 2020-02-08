import { Predicate } from './predicate';
import { OperatorContext } from './operator-context';

export interface PredicateOperatorContext {
    operators: Array<OperatorContext>;
    $implicit: Predicate;
}
