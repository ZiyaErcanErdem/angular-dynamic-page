import { Predicate } from './predicate';


export interface RemovePredicateContext {
    removePredicate: (predicate: Predicate) => void;
    $implicit: Predicate;
}
