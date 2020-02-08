import { Condition } from './condition.enum';
import { Predicate } from './predicate';

export class Criteria {
    condition: Condition;
    predicates: Array<Criteria | Predicate>;
    hidden: boolean;
    readonly: boolean;
    conditionReadonly: boolean;

    constructor(condition: Condition = Condition.AND) {
        this.condition = condition;
        this.hidden = false;
        this.readonly = false;
        this.conditionReadonly = false;
        this.predicates = new Array<Criteria | Predicate>();
    }

    public toggleCondition(): void {
        this.condition = this.condition === Condition.AND ? Condition.OR : Condition.AND;
    }
}
