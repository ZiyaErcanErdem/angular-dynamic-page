import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[zeePredicateOperator]'
})
export class PredicateOperatorDirective {
  constructor(public template: TemplateRef<any>) {}
}
