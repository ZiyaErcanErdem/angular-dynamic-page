import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[zeeRemovePredicate]'
})
export class RemovePredicateDirective {
  constructor(public template: TemplateRef<any>) {}
}
