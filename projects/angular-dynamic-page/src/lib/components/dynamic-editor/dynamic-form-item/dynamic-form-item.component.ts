import { Component, OnInit, Input } from '@angular/core';
import { PageManager } from '../../../model/page-manager';
import { EditorMode } from '../../../model/editor-mode.enum';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ColumnType } from '../../../model/column-type.enum';
import { FormItemConfig } from '../model/form-item-config';
import { FormFieldConfig } from '../model/form-field-config';

@Component({
  selector: 'zee-dynamic-form-item',
  templateUrl: './dynamic-form-item.component.html',
  styleUrls: ['./dynamic-form-item.component.scss']
})
export class DynamicFormItemComponent implements OnInit {
  @Input() manager: PageManager<any>;
  @Input() mode: EditorMode;
  @Input() itemConfig: FormItemConfig;

  field: FormFieldConfig;
  group: FormGroup;
  itemType: ColumnType;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
      if (this.itemConfig?.parentColumn) {
          this.itemType = this.itemConfig.parentColumn.columnType;
      } else if (this.itemConfig?.field) {
          this.itemType = this.itemConfig.field.metadata.columnType;
      } else {
          this.itemType = ColumnType.UNKNOWN;
      }
      this.group = this.itemConfig?.group;
      this.field = this.itemConfig?.field;
  }
}

