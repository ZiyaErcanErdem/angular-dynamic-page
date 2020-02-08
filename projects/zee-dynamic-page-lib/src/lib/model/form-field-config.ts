import { ValidatorFn } from '@angular/forms';
import { ColumnMetadata } from './column-metadata';

export interface FormFieldConfig {
    metadata: ColumnMetadata;
    disabled?: boolean;
    placeholder?: string;
    type: string;
    validation?: ValidatorFn[];
    value?: any;
}
