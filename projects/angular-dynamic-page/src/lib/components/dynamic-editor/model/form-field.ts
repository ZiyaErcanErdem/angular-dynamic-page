import { FormGroup } from '@angular/forms';
import { FormFieldConfig } from './form-field-config';
import { EditorMode } from '../../../model/editor-mode.enum';
import { PageBuilder } from '../../../model/page-builder';

export interface FormField {
    builder: PageBuilder<any>;
    field: FormFieldConfig;
    group: FormGroup;
    mode: EditorMode;
}
