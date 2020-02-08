import { ColumnMetadata } from './column-metadata';
import { FormGroup, FormArray } from '@angular/forms';
import { FormFieldConfig } from './form-field-config';

export interface FormItemConfig {
    group: FormGroup;
    parentColumn: ColumnMetadata;
    groups: FormArray;
    field?: FormFieldConfig;
    items?: Array<FormItemConfig>;
    isArray: boolean;
    hasChilds: boolean;
}
