import { FormGroup, FormArray } from '@angular/forms';
import { FormFieldConfig } from './form-field-config';
import { ColumnMetadata } from '../../../model/column-metadata';

export interface FormItemConfig {
    group: FormGroup;
    parentColumn: ColumnMetadata;
    groups: FormArray;
    field?: FormFieldConfig;
    items?: Array<FormItemConfig>;
    isArray: boolean;
    hasChilds: boolean;
}
