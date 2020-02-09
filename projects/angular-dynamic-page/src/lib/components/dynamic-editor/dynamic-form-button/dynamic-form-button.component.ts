import { Component, OnInit } from '@angular/core';
import { FormField } from '../../../model/form-field';
import { PageBuilder } from '../../../model/page-builder';
import { FormFieldConfig } from '../../../model/form-field-config';
import { FormGroup } from '@angular/forms';
import { EditorMode } from '../../../model/editor-mode.enum';

@Component({
  selector: 'zee-dynamic-form-button',
  templateUrl: './dynamic-form-button.component.html',
  styleUrls: ['./dynamic-form-button.component.scss']
})
export class DynamicFormButtonComponent implements OnInit, FormField {
  builder: PageBuilder<any>;
  field: FormFieldConfig;
  group: FormGroup;
  mode: EditorMode;

  constructor() {}

  ngOnInit() {}
}