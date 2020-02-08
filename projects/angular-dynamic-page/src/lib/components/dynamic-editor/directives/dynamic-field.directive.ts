import { Directive, OnChanges, OnInit, OnDestroy, Input, ComponentRef, ComponentFactoryResolver, ViewContainerRef, Type } from '@angular/core';
import { FormField } from '../../../model/form-field';
import { PageBuilder } from '../../../model/page-builder';
import { FormFieldConfig } from '../../../model/form-field-config';
import { FormGroup } from '@angular/forms';
import { EditorMode } from '../../../model/editor-mode.enum';
import { DynamicFormButtonComponent } from '../dynamic-form-button/dynamic-form-button.component';
import { DynamicFormInputComponent } from '../dynamic-form-input/dynamic-form-input.component';
import { DynamicFormSelectComponent } from '../dynamic-form-select/dynamic-form-select.component';

const components: { [type: string]: Type<FormField> } = {
  button: DynamicFormButtonComponent,
  input: DynamicFormInputComponent,
  select: DynamicFormSelectComponent
};

@Directive({
  selector: '[zeeDynamicField]'
})
export class DynamicFieldDirective implements FormField, OnChanges, OnInit, OnDestroy {
  @Input()
  builder: PageBuilder<any>;
  @Input()
  field: FormFieldConfig;
  @Input()
  group: FormGroup;
  @Input()
  mode: EditorMode;

  component: ComponentRef<FormField>;

  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}

  ngOnChanges() {
      if (this.component) {
          this.component.instance.builder = this.builder;
          this.component.instance.field = this.field;
          this.component.instance.group = this.group;
          this.component.instance.mode = this.mode;
      }
  }

  ngOnInit() {
      if (!components[this.field.type]) {
          const supportedTypes = Object.keys(components).join(', ');
          throw new Error(`Trying to use an unsupported type (${this.field.type}). Supported types: ${supportedTypes}`);
      }
      this.destroyComponent();
      const component = this.resolver.resolveComponentFactory<FormField>(components[this.field.type]);
      this.component = this.container.createComponent(component);
      this.component.instance.builder = this.builder;
      this.component.instance.field = this.field;
      this.component.instance.group = this.group;
      this.component.instance.mode = this.mode;
  }

  ngOnDestroy() {
      this.destroyComponent();
  }

  private destroyComponent(): void {
      if (this.container) {
          this.container.clear();
      }
      if (!this.component) {
          return;
      }
      this.component.destroy();
      this.component = undefined;
  }
}

