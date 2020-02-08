import { Predicate } from './predicate';
import { Criteria } from './criteria';


export interface CriteriaActionContext {
    createPredicate(): Predicate;
    createCriteria(): Criteria;
    removeCriteria(): void;
    $implicit: Criteria;
}
