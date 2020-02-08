import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { FormField } from '../../../model/form-field';
import { PageBuilder } from '../../../model/page-builder';
import { FormFieldConfig } from '../../../model/form-field-config';
import { FormGroup, AbstractControl } from '@angular/forms';
import { EditorMode } from '../../../model/editor-mode.enum';
import { ColumnMetadata } from '../../../model/column-metadata';
import { ColumnType } from '../../../model/column-type.enum';

@Component({
  selector: 'zee-dynamic-form-input',
  templateUrl: './dynamic-form-input.component.html',
  styleUrls: ['./dynamic-form-input.component.scss']
})
export class DynamicFormInputComponent extends DynamicBaseComponent implements OnInit, OnDestroy, FormField {
  builder: PageBuilder<any>;
  field: FormFieldConfig;
  group: FormGroup;
  mode: EditorMode;
  instanceId: string;

  constructor() {
      super();
      this.instanceId = `${new Date().getTime()}`;
  }

  get metadata(): ColumnMetadata {
      return this.field.metadata;
  }

  get control(): AbstractControl {
      return this.group.controls[this.field.metadata.name];
  }

  get readonlyItem(): boolean {
      if (this.metadata.readonly) {
          return true;
      }
      return false;
  }

  get required(): boolean | null {
      return !this.metadata.nullable ? true : null;
  }

  get minLength(): number | null {
      const val = this.metadata.minLength;
      return this.inputType === 'text' && val && val > 0 ? val : null;
  }

  get maxLength(): number | null {
      const val = this.metadata.maxLength;
      return this.inputType === 'text' && val && val > 0 && val < 9999999 ? val : null;
  }

  get minValue(): number | null {
      const val = this.metadata.minValue;
      return this.inputType === 'number' && val && val > 0 ? val : null;
  }

  get maxValue(): number | null {
      const val = this.metadata.maxValue;
      return this.inputType === 'number' && val && val > 0 && val < 999999999999999999 ? val : null;
  }

  get selectorEnabled(): boolean {
      if (!this.metadata || !this.metadata.selector || !this.field.metadata.editable) {
          return false;
      } else if (this.mode === EditorMode.CREATE || this.mode === EditorMode.EDIT) {
          return true;
      }
      return false;
  }

  get inputType(): string {
      const colType = this.field.metadata.columnType;
      if (!this.field.metadata.viewable) {
          return 'hidden';
      } else if (this.mode === EditorMode.CREATE && !this.field.metadata.editable && !this.field.metadata.idColumn) {
          return 'hidden';
      }
      switch (colType) {
          case ColumnType.DATE: {
              return 'datetime-local';
          }
          case ColumnType.NUMBER:
          case ColumnType.DOUBLE: {
              return 'number';
          }
          case ColumnType.BOOLEAN: {
              return 'radio';
          }
          default: {
              return 'text';
          }
      }
  }

  get isLargeText(): boolean {
      return (ColumnType.STRING === this.field.metadata.columnType && this.metadata.maxLength > 300);
  }

  get itemIdFirst(): string {
      return `${this.instanceId}_first_${this.metadata.qualifier}_${this.metadata.name}`;
  }

  get itemIdSecond(): string {
      return `${this.instanceId}_second_${this.metadata.qualifier}_${this.metadata.name}`;
  }

  public openSelector(): void {
      if (!this.metadata || !this.metadata.selector) {
          return;
      }
      const selector = this.metadata.selector;
      this.collect = selector.selection().subscribe(sel => {
          selector.mapSelection(sel, this.group);
      });
      this.builder.openSelector(selector);
  }

  public hasSelectedValue(): boolean {
      if (!this.control.value) {
          return false;
      }
      const colType = this.metadata.columnType;
      if (colType === ColumnType.NUMBER || colType === ColumnType.DOUBLE) {
          return this.control.value > 0;
      }
      return true;
  }

  public clearSelectorValue(): void {
      if (this.metadata.selector) {
          this.metadata.selector.mapSelection({}, this.group);
      }
  }

  ngOnInit() {
      /*
      if (this.metadata && this.metadata.selector) {
          Promise.resolve(null).then(() =>  this.metadata.selector.setup(this.group));
      }
      */
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      if (this.metadata && this.metadata.selector) {
          // this.metadata.selector.destroy();
      }
  }
}

