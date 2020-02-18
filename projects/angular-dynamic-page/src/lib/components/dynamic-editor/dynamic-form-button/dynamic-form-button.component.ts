import { Component, OnInit } from '@angular/core';
import { PageManager } from '../../../model/page-manager';
import { FormGroup } from '@angular/forms';
import { EditorMode } from '../../../model/editor-mode.enum';
import { FormField } from '../model/form-field';
import { FormFieldConfig } from '../model/form-field-config';

@Component({
  selector: 'zee-dynamic-form-button',
  templateUrl: './dynamic-form-button.component.html',
  styleUrls: ['./dynamic-form-button.component.scss']
})
export class DynamicFormButtonComponent implements OnInit, FormField {
  manager: PageManager<any>;
  field: FormFieldConfig;
  group: FormGroup;
  mode: EditorMode;

  constructor() {}

  ngOnInit() {}
}
