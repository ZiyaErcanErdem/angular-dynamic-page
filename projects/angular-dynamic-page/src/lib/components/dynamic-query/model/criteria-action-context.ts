import { Predicate } from '../../../model/predicate';
import { Criteria } from '../../../model/criteria';


export interface CriteriaActionContext {
    $implicit: Criteria;
    createPredicate(): Predicate;
    createCriteria(): Criteria;
    removeCriteria(): void;
}
