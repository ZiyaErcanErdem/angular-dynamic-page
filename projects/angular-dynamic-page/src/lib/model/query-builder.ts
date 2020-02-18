import { PageManager } from './page-manager';
import { Criteria } from './criteria';
import { Condition } from './condition.enum';
import { Predicate } from './predicate';
import { ColumnMetadata } from './column-metadata';
import { Operator } from './operator.enum';
import { ActivatedRoute } from '@angular/router';

export class PredicateBuilder<T> {
    constructor(private queryBuilder: QueryBuilder<T>, private criteriaBuilder: CriteriaBuilder<T>, private predicate: Predicate) {}

    public withValue(valueProvider: any): PredicateBuilder<T> {
        this.predicate.value = this.queryBuilder.valueOf(valueProvider);
        return this;
    }

    public hide(): PredicateBuilder<T> {
        this.predicate.hidden = true;
        return this;
    }
    public show(): PredicateBuilder<T> {
        this.predicate.hidden = false;
        return this;
    }
    public readonly(): PredicateBuilder<T> {
        this.predicate.readonly = true;
        return this;
    }
    public enabled(): PredicateBuilder<T> {
        this.predicate.readonly = false;
        return this;
    }

    and(): CriteriaBuilder<T> {
        return this.criteriaBuilder;
    }
}
export class CriteriaBuilder<T> {
    constructor(
        private builder: PageManager<T>,
        private queryBuilder: QueryBuilder<T>,
        private parent: CriteriaBuilder<T>,
        private criteria: Criteria
    ) {}

    public withCondition(condition: Condition): CriteriaBuilder<T> {
        this.criteria.condition = condition;
        return this;
    }
    public hide(): CriteriaBuilder<T> {
        this.criteria.hidden = true;
        return this;
    }
    public show(): CriteriaBuilder<T> {
        this.criteria.hidden = false;
        return this;
    }
    public readonly(): CriteriaBuilder<T> {
        this.criteria.readonly = true;
        return this;
    }
    public enabled(): CriteriaBuilder<T> {
        this.criteria.readonly = false;
        return this;
    }
    public conditionReadonly(): CriteriaBuilder<T> {
        this.criteria.conditionReadonly = true;
        return this;
    }
    public conditionEnabled(): CriteriaBuilder<T> {
        this.criteria.conditionReadonly = false;
        return this;
    }
    public hasColumn(fieldPath: string): boolean {
        const col = this.queryBuilder.findColumn(fieldPath);
        if (!col) {
            return false;
        }
        return true;
    }
    public addPredicate(fieldPath: string, operator: Operator, value?: any, overwrite?: boolean): PredicateBuilder<T> {
        const col = this.queryBuilder.findColumn(fieldPath);
        if (!col) {
            // console.log(`Invalid predicate. Field ${fieldPath} is not defined. Check builder config!`);
        }
        let predicate: Predicate = null;
        if (overwrite) {
            predicate = this.queryBuilder.findPredicate(fieldPath);
            if (!predicate) {
                predicate = this.builder.createPredicate(this.criteria, col);
            }
        } else {
            predicate = this.builder.createPredicate(this.criteria, col);
        }

        predicate.field = col ? col.name : fieldPath;
        predicate.operator = operator;
        predicate.readonly = false;
        predicate.hidden = false;
        predicate.metadata = col;
        predicate.value = this.queryBuilder.valueOf(value);
        return new PredicateBuilder<T>(this.queryBuilder, this, predicate);
    }

    addCriteria(condition: Condition): CriteriaBuilder<T> {
        const criteria: Criteria = this.builder.createCriteria(this.criteria, true);
        criteria.condition = condition;
        return new CriteriaBuilder<T>(this.builder, this.queryBuilder, this, criteria);
    }

    then(): CriteriaBuilder<T> {
        return this.parent ? this.parent : this;
    }

    public appendQueryParams(route: ActivatedRoute): void {
        const prmMap = this.extractQueryParams(route);
        if (!prmMap) {
            return;
        }
        prmMap.forEach((v, k, m) => {
            if (this.hasColumn(k)) {
                const operatorText = m.get(k + '.op');
                let oper = Operator.EQ;
                if (operatorText) {
                    const op = operatorText as Operator;
                    oper = op ? op : Operator.EQ;
                }
                this.addPredicate(k, oper, v, true)
                    .readonly() // make predicate readonly
                    .and()
                    .readonly(); // make criteria readonly
            }
        });
    }

    private extractQueryParams(route: ActivatedRoute): Map<string, string> {
        if (!route) {
            return undefined;
        }
        const linkParams = new Map<string, string>();
        let prmFound = false;
        route.queryParamMap.subscribe(qm => {
            // console.log(`QueryParamMap: ${qm}`);
            qm.keys.forEach(k => {
                prmFound = true;
                const v = qm.get(k);
                linkParams.set(k, v);
                // console.log(`QueryParams: ${k} =>  ${v}`);
            });
        });
        return prmFound ? linkParams : undefined;
    }
}

export class QueryBuilder<T> {
    private rootCriteria: Criteria;
    private rootCriteriaBuilder: CriteriaBuilder<T>;

    constructor(private builder: PageManager<T>) {
        this.rootCriteria = new Criteria(Condition.AND);
        this.rootCriteriaBuilder = new CriteriaBuilder<T>(this.builder, this, null, this.rootCriteria);
    }

    public query(): CriteriaBuilder<T> {
        return this.rootCriteriaBuilder;
    }

    public build(): Criteria {
        return this.rootCriteria;
    }

    public findPredicate(pathName: string): Predicate {
        const out = this.rootCriteria.predicates.find(spec => {
            const hasFieldProp = !!((spec as Predicate).field);
            if (hasFieldProp) {
            // if (spec.hasOwnProperty('field')) {
                const p: Predicate = spec as Predicate;
                return p && p.field && p.field === pathName;
            }
            return false;
        });
        return (out as Predicate);
    }

    public findColumn(pathName: string): ColumnMetadata {
        return this.builder.findColumn(pathName);
    }

    public valueOf(param: any): any {
        switch (typeof param) {
            case 'function':
                return param();
            default:
                return param;
        }
    }
}
