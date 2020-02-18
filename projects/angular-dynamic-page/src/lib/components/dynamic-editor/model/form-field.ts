import { FormGroup } from '@angular/forms';
import { FormFieldConfig } from './form-field-config';
import { EditorMode } from '../../../model/editor-mode.enum';
import { PageManager } from '../../../model/page-manager';

export interface FormField {
    builder: PageManager<any>;
    field: FormFieldConfig;
    group: FormGroup;
    mode: EditorMode;
}
