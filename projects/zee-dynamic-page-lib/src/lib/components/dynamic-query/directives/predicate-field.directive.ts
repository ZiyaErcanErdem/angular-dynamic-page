import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[zeePredicateField]'
})
export class PredicateFieldDirective {
  constructor(public template: TemplateRef<any>) {}
}
