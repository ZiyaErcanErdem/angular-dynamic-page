import { Component, OnInit } from '@angular/core';
import { FormField } from '../../../model/form-field';
import { PageBuilder } from '../../../model/page-builder';
import { FormFieldConfig } from '../../../model/form-field-config';
import { FormGroup, AbstractControl } from '@angular/forms';
import { EditorMode } from '../../../model/editor-mode.enum';
import { ColumnMetadata } from '../../../model/column-metadata';

@Component({
  selector: 'zee-dynamic-form-select',
  templateUrl: './dynamic-form-select.component.html',
  styleUrls: ['./dynamic-form-select.component.scss']
})
export class DynamicFormSelectComponent implements OnInit, FormField {
  builder: PageBuilder<any>;
  field: FormFieldConfig;
  group: FormGroup;
  mode: EditorMode;

  constructor() {}

  get metadata(): ColumnMetadata {
      return this.field.metadata;
  }

  get control(): AbstractControl {
      return this.group.controls[this.field.metadata.name];
  }

  get required(): boolean | null {
      return !this.metadata.nullable ? true : null;
  }

  ngOnInit() {}
}

