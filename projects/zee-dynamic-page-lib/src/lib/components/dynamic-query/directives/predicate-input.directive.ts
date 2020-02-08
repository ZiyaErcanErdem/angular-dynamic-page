import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[zeePredicateInput]'
})
export class PredicateInputDirective {
  private _type: string;

  @Input()
  get predicateInputType(): string {
      return this._type;
  }
  set predicateInputType(value: string) {
      if (!value) {
          return;
      }
      this._type = value;
  }

  constructor(public template: TemplateRef<any>) {}
}
