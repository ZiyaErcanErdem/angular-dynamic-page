import { FormGroup } from '@angular/forms';
import { FormFieldConfig } from './form-field-config';
import { EditorMode } from './editor-mode.enum';
import { PageBuilder } from './page-builder';

export interface FormField {
    builder: PageBuilder<any>;
    field: FormFieldConfig;
    group: FormGroup;
    mode: EditorMode;
}
