import { Component, OnInit, AfterContentInit, OnDestroy, OnChanges, Input, ContentChild, ContentChildren, QueryList, ChangeDetectorRef, SimpleChanges, TemplateRef } from '@angular/core';
import { DynamicBaseComponent } from '../../model/dynamic-base-component';
import { ControlValueAccessor } from '@angular/forms';
import { PageBuilder } from '../../model/page-builder';
import { Criteria } from '../../model/criteria';
import { Condition } from '../../model/condition.enum';
import { TemplateContext } from '../../model/template-context';
import { Theme } from '../../model/theme.enum';
import { CriteriaActionDirective } from './directives/criteria-action.directive';
import { CriteriaConditionDirective } from './directives/criteria-condition.directive';
import { PredicateFieldDirective } from './directives/predicate-field.directive';
import { PredicateOperatorDirective } from './directives/predicate-operator.directive';
import { RemovePredicateDirective } from './directives/remove-predicate.directive';
import { PredicateInputDirective } from './directives/predicate-input.directive';
import { ColumnMetadata } from '../../model/column-metadata';
import { ExpressionContext } from '../../model/expression-context';
import { PageConfig } from '../../model/page-config';
import { PageRelation } from '../../model/page-relation';
import { DynamicUtil } from '../../model/dynamic-util';
import { TemplateType } from '../../model/template-type.enum';
import { RelationType } from '../../model/relation-type.enum';
import { Predicate } from '../../model/predicate';
import { InputType } from '../../model/input-type.enum';
import { Operator } from '../../model/operator.enum';
import { CriteriaActionContext } from '../../model/criteria-action-context';
import { RemovePredicateContext } from '../../model/remove-predicate-context';
import { PredicateFieldContext } from '../../model/predicate-field-context';
import { ColumnContext } from '../../model/column-context';
import { PredicateOperatorContext } from '../../model/predicate-operator-context';
import { PredicateInputContext } from '../../model/predicate-input-context';
import { OperatorContext } from '../../model/operator-context';
import { ColumnType } from '../../model/column-type.enum';
import { OptionContext } from '../../model/option-context';
import { QueryMode } from '../../model/query-mode.enum';

@Component({
  selector: 'zee-dynamic-query',
  templateUrl: './dynamic-query.component.html',
  styleUrls: ['./dynamic-query.component.scss']
})
export class DynamicQueryComponent extends DynamicBaseComponent implements ControlValueAccessor, AfterContentInit, OnInit, OnDestroy, OnChanges {
  @Input()
  builder: PageBuilder<any>;
  @Input()
  allowCriteria = true;
  @Input()
  criteria: Criteria = new Criteria(Condition.AND);
  @Input()
  parentCriteria: Criteria;
  @Input()
  templateContext: TemplateContext;
  @Input()
  theme: Theme = Theme.dark;

  @ContentChild(CriteriaActionDirective, { static: true })
  actionTemplate: CriteriaActionDirective;
  @ContentChild(CriteriaConditionDirective, { static: true })
  conditionTemplate: CriteriaConditionDirective;
  @ContentChild(PredicateFieldDirective, { static: true })
  fieldTemplate: PredicateFieldDirective;
  @ContentChild(PredicateOperatorDirective, { static: true })
  operatorTemplate: PredicateOperatorDirective;
  @ContentChild(RemovePredicateDirective, { static: true })
  removePredicateTemplate: RemovePredicateDirective;
  @ContentChildren(PredicateInputDirective)
  inputTemplates: QueryList<PredicateInputDirective>;

  public columns: Array<ColumnMetadata>;
  public expressions: Array<ExpressionContext>;
  public expressionMap: Map<string, ExpressionContext>;
  public config: PageConfig<any>;

  public relations: Array<PageRelation>;
  private defaultRelation: PageRelation;
  ready = false;

  public disabled: boolean;
  private defaultTemplateTypes: Array<string>;

  private onChangeCallback: (value: any) => void;
  private onTouchedCallback: () => any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
      super();
      this.expressions = new Array<ExpressionContext>();
      this.initialize();
  }

  get queryActionButtonClass(): string {
      return 'btn btn-sm ' + DynamicUtil.themeFor('btn-outline-', this.theme);
  }

  private initialize(): void {
      this.setupDefaultTemplateTypes();
  }

  ngAfterContentInit() {
      this.templateContext.setTemplate(TemplateType.Action, this.actionTemplate);
      this.templateContext.setTemplate(TemplateType.Condition, this.conditionTemplate);
      this.templateContext.setTemplate(TemplateType.Field, this.fieldTemplate);
      this.templateContext.setTemplate(TemplateType.Input, this.inputTemplates);
      this.templateContext.setTemplate(TemplateType.Operator, this.operatorTemplate);
  }

  ngOnInit() {
      this.collect = this.builder.ready().subscribe(isReady => {
          if (isReady) {
              this.config = this.builder.config;
              this.collect = this.builder.metamodel().subscribe(pmm => {
                  this.relations = pmm.getRelations().filter(r => r.searchable);
                  this.defaultRelation = this.relations.find(pr => pr.relationType === RelationType.SELF);
              });
              this.collect = this.builder.searchColumns().subscribe(cols => (this.columns = cols), err => console.warn(err));
              if (!this.templateContext) {
                  this.templateContext = new TemplateContext();
              }
              this.ready = isReady;
          }
      });
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      this.columns = undefined;
      this.expressions = undefined;
      this.expressionMap = undefined;
      this.config = undefined;
      this.relations = undefined;
      this.defaultRelation = undefined;
      this.defaultTemplateTypes = undefined;
  }

  get value(): Criteria {
      return this.criteria;
  }

  set value(value: Criteria) {
      // When component is initialized without a formControl, null is passed to value
      this.criteria = value;
      this.changeDetectorRef.markForCheck();
      if (this.onChangeCallback) {
          this.onChangeCallback(value);
      }
  }

  writeValue(obj: any): void {
      this.value = obj;
  }

  registerOnChange(fn: any): void {
      this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
      this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
      this.disabled = isDisabled;
  }

  ngOnChanges(changes: SimpleChanges) {
      this.expressions.forEach(e => {
          //
      });
  }

  findTemplateForPredicate(predicate: Predicate): TemplateRef<any> {
      const type = this.config.getInputType(predicate.metadata, predicate.operator);
      if (type) {
          const queryInput = this.findQueryInput(type);
          if (queryInput) {
              return queryInput.template;
          } else {
              if (!this.defaultTemplateTypes.includes(type)) {
                  console.warn(`Could not find template for field with type: ${type}`);
              }
              return null;
          }
      }
  }

  getPredicateInputType(cmd: ColumnMetadata, operator: Operator): InputType {
      const type: InputType = this.config.getInputType(cmd, operator);
      return type;
  }

  findQueryInput(type: string): PredicateInputDirective {
      const templates = this.templateContext.getTemplate(TemplateType.Input);
      return templates.find(item => item.queryInputType === type);
  }

  private setupDefaultTemplateTypes(): void {
      this.defaultTemplateTypes = new Array<string>();

      this.defaultTemplateTypes.push('string');
      this.defaultTemplateTypes.push('number');
      this.defaultTemplateTypes.push('time');
      this.defaultTemplateTypes.push('date');
      this.defaultTemplateTypes.push('enum');
      this.defaultTemplateTypes.push('boolean');
      this.defaultTemplateTypes.push('multiselect');
  }

  public getClassName(id: string): string {
      return this.config.getClassName(id);
  }

  getQueryItemClassName(local: { hasCriteria: boolean; invalid: boolean }): string {
      let cls = this.getClassName('queryItem');
      cls += ' ' + this.getClassName(local.hasCriteria ? 'queryCriteria' : 'queryPredicate');
      if (local.invalid) {
          cls += ' ' + this.getClassName('invalidCriteria');
      }
      return cls;
  }

  getCriteriaConditionTemplate(): TemplateRef<any> {
      const t = this.templateContext.getTemplate(TemplateType.Condition);
      return t ? t.template : null;
  }

  getCriteriaActionTemplate(): TemplateRef<any> {
      const t = this.templateContext.getTemplate(TemplateType.Action);
      return t ? t.template : null;
  }

  getCriteriaActionContext(): CriteriaActionContext {
      let ctx = this.templateContext.getActionContext();
      if (!ctx) {
          ctx = {
              createPredicate: this.createPredicate.bind(this),
              createCriteria: this.createCriteria.bind(this),
              removeCriteria: this.removeCriteria.bind(this),
              $implicit: this.criteria
          };
          this.templateContext.setActionContext(ctx);
      }
      return ctx;
  }

  getRemovePredicateTemplate(): TemplateRef<any> {
      const t = this.templateContext.getTemplate(TemplateType.RemovePredicate);
      return t ? t.template : null;
  }

  getRemovePredicateContext(predicate: Predicate): RemovePredicateContext {
      let ctx = this.templateContext.getContext(TemplateType.RemovePredicate, predicate);
      if (!ctx) {
          ctx = {
              removePredicate: this.removePredicate.bind(this),
              $implicit: predicate
          };
          this.templateContext.setContext(TemplateType.RemovePredicate, predicate, ctx);
          return ctx;
      }
      return ctx;
  }

  getPredicateFieldTemplate(): TemplateRef<any> {
      const t = this.templateContext.getTemplate(TemplateType.Field);
      return t ? t.template : null;
  }

  getPredicateFieldContext(predicate: Predicate): PredicateFieldContext {
      let ctx = this.templateContext.getContext(TemplateType.Field, predicate);
      if (!ctx) {
          ctx = {
              changeField: this.changeField.bind(this),
              changeRelation: this.changeRelation.bind(this),
              columns: this.columns.map(cmd => new ColumnContext(cmd)),
              $implicit: predicate
          };
          this.templateContext.setContext(TemplateType.Field, predicate, ctx);
          return ctx;
      }
      return ctx;
  }

  getPredicateOperatorTemplate(): TemplateRef<any> {
      const t = this.templateContext.getTemplate(TemplateType.Operator);
      return t ? t.template : null;
  }

  getPredicateOperatorContext(predicate: Predicate): PredicateOperatorContext {
      let ctx = this.templateContext.getContext(TemplateType.Operator, predicate);
      if (!ctx) {
          ctx = {
              operators: this.config.getOperators(predicate.metadata),
              $implicit: predicate
          };
          this.templateContext.setContext(TemplateType.Operator, predicate, ctx);
          return ctx;
      }
      return ctx;
  }

  getPredicateInputContext(predicate: Predicate): PredicateInputContext {
      let ctx = this.templateContext.getContext(TemplateType.Input, predicate);
      if (!ctx) {
          ctx = {
              options: this.config.getOptions(predicate.metadata),
              column: predicate.metadata,
              $implicit: predicate
          };
          this.templateContext.setContext(TemplateType.Input, predicate, ctx);
          return ctx;
      }
      return ctx;
  }

  public openSelector(predicate: Predicate): void {
      if (!predicate || !predicate.metadata || !predicate.metadata.selector) {
          return;
      }
      const selector = predicate.metadata.selector;
      this.collect = selector.selection().subscribe(sel => {
          if (!sel) {
              predicate.value = '';
          } else {
              const selectionKey = selector.selectionKey ? selector.selectionKey : predicate.metadata.name;
              predicate.value = sel[selectionKey] || '';
          }
      });
      this.builder.openSelector(selector);
  }

  createPredicate(parent?: Criteria): void {
      parent = parent || this.criteria;
      this.builder.createPredicate(parent);
  }

  removePredicate(predicate: Predicate, parent?: Criteria): void {
      parent = parent || this.criteria;
      this.builder.removePredicate(predicate, parent);
  }

  createCriteria(parent?: Criteria): Criteria {
      parent = parent || this.criteria;
      return this.builder.createCriteria(parent);
  }

  removeCriteria(criteria?: Criteria, parent?: Criteria): void {
      criteria = criteria || this.criteria;
      parent = parent || this.parentCriteria;
      this.builder.removeCriteria(criteria, parent);
  }

  changeRelation(rel: PageRelation, predicate: Predicate): void {
      let cmd: ColumnMetadata = predicate.metadata;
      if (!rel.metamodel.containsColumn(cmd)) {
          cmd = rel.metamodel.getDefaultColumn();
          predicate.metadata = cmd;
          this.changeField(cmd, predicate);
      }
  }

  changeField(col: ColumnMetadata, predicate: Predicate): void {
      const cmd: ColumnMetadata = predicate.metadata;
      if (cmd) {
          predicate.field = cmd.path;
      }

      if (cmd && cmd.defaultValue !== undefined) {
          predicate.value = this.getValueOf(cmd.defaultValue);
      } else {
          delete predicate.value;
      }

      predicate.operator = this.config.getDefaultOperator(cmd);

      if (cmd && !predicate.operator) {
          console.warn(
              `No operators found for Column '${predicate.metadata.path}'. ` +
                  `A 'defaultOperator' is also not specified on the builder. Operator value will default to null.`
          );
      }

      this.templateContext.deletePredicate(predicate);
      this.getPredicateInputContext(predicate);
      this.getPredicateFieldContext(predicate);
      this.getPredicateOperatorContext(predicate);
      this.getRemovePredicateContext(predicate);
  }

  private getValueOf(source: any): any {
      switch (typeof source) {
          case 'function':
              return source();
          default:
              return source;
      }
  }

  public getDefaultOperator(cmd: ColumnMetadata) {
      const operator = this.config.getDefaultOperator(cmd);
      if (!operator) {
          console.warn(
              `No operators found for Column '${cmd.path}'. ` +
                  `A 'defaultOperator' is also not specified on the builder. Operator value will default to null.`
          );
      }
      return operator;
  }

  public getOperators(cmd: ColumnMetadata): Array<OperatorContext> {
      const operators = this.config.getOperators(cmd);
      return operators;
  }

  public getColumnType(cmd: ColumnMetadata, operator: Operator): ColumnType {
      const columnType = this.config.getColumnType(cmd, operator);
      return columnType;
  }

  public getOptions(cmd: ColumnMetadata): Array<OptionContext> {
      const options = this.config.getOptions(cmd);
      return options;
  }

  isCreateCriteriaActionActive(criteria: Criteria): boolean {
      if (criteria.readonly || this.config.queryMode !== QueryMode.CRITERIA) {
          return false;
      }

      if (criteria && criteria.predicates.length > 0) {
          return true;
      }
      return false;
  }

  isRemoveCriteriaActionActive(parent: Criteria, criteria: Criteria): boolean {
      if (!parent) {
          return false;
      }
      if (criteria.readonly || this.config.queryMode !== QueryMode.CRITERIA) {
          return false;
      }
      return true;
  }

  isCreatePredicateActionActive(criteria): boolean {
      if (criteria.readonly || this.config.queryMode !== QueryMode.CRITERIA) {
          return false;
      }
      return true;
  }
}
