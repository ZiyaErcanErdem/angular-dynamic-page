import { OperatorContext } from '../../../model/operator-context';
import { Predicate } from '../../../model/predicate';

export interface PredicateOperatorContext {
    operators: Array<OperatorContext>;
    $implicit: Predicate;
}
