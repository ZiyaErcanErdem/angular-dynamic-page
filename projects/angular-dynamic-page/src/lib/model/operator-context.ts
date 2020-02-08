import { Operator } from './operator.enum';

export class OperatorContext {
    name: string;
    label: string;
    operator: Operator;

    constructor(operator: Operator) {
        this.operator = operator;
        this.name = Operator[operator];
        this.label = this.name;
    }
}
