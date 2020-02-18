import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicQueryComponent } from './dynamic-query.component';
import { CriteriaActionDirective } from './directives/criteria-action.directive';
import { CriteriaConditionDirective } from './directives/criteria-condition.directive';
import { PredicateFieldDirective } from './directives/predicate-field.directive';
import { PredicateInputDirective } from './directives/predicate-input.directive';
import { PredicateOperatorDirective } from './directives/predicate-operator.directive';
import { RemovePredicateDirective } from './directives/remove-predicate.directive';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DynamicQueryComponent,
    CriteriaActionDirective,
    CriteriaConditionDirective,
    PredicateFieldDirective,
    PredicateInputDirective,
    PredicateOperatorDirective,
    RemovePredicateDirective
  ],
  imports: [
    CommonModule, DynamicCoreModule, FormsModule
  ],
  exports: [
    DynamicQueryComponent,
    CriteriaActionDirective,
    CriteriaConditionDirective,
    PredicateFieldDirective,
    PredicateInputDirective,
    PredicateOperatorDirective,
    RemovePredicateDirective
  ]
})
export class DynamicQueryModule { }
