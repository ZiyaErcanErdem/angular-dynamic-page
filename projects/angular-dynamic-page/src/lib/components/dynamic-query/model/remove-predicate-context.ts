import { Predicate } from '../../../model/predicate';

export interface RemovePredicateContext {
    removePredicate: (predicate: Predicate) => void;
    $implicit: Predicate;
}
