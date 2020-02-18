import { Predicate } from '../../../model/predicate';
import { Criteria } from '../../../model/criteria';


export interface CriteriaActionContext {
    createPredicate(): Predicate;
    createCriteria(): Criteria;
    removeCriteria(): void;
    $implicit: Criteria;
}
