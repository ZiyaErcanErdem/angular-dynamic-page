import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[zeePredicateInput]'
})
export class PredicateInputDirective {
  private inputType: string;

  @Input()
  get predicateInputType(): string {
      return this.inputType;
  }
  set predicateInputType(value: string) {
      if (!value) {
          return;
      }
      this.inputType = value;
  }

  constructor(public template: TemplateRef<any>) {}
}
