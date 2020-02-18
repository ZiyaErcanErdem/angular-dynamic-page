import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicEditorComponent } from './dynamic-editor.component';
import { DynamicFormAssociationComponent } from './dynamic-form-association/dynamic-form-association.component';
import { DynamicFormButtonComponent } from './dynamic-form-button/dynamic-form-button.component';
import { DynamicFormInputComponent } from './dynamic-form-input/dynamic-form-input.component';
import { DynamicFormItemComponent } from './dynamic-form-item/dynamic-form-item.component';
import { DynamicFormSelectComponent } from './dynamic-form-select/dynamic-form-select.component';
import { DynamicFieldDirective } from './directives/dynamic-field.directive';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicPageModule } from '../dynamic-page/dynamic-page.module';
import { PortalModule } from '@angular/cdk/portal';


@NgModule({
  declarations: [
    DynamicEditorComponent,
    DynamicFormAssociationComponent,
    DynamicFormButtonComponent,
    DynamicFormInputComponent,
    DynamicFormItemComponent,
    DynamicFormSelectComponent,
    DynamicFieldDirective],
  imports: [
    CommonModule, PortalModule, DynamicCoreModule, DynamicPageModule, ReactiveFormsModule
  ],
  exports: [
    DynamicFormButtonComponent,
    DynamicFormInputComponent,
    DynamicFormSelectComponent,
    DynamicEditorComponent
  ],
  entryComponents: [
    DynamicFormButtonComponent,
    DynamicFormInputComponent,
    DynamicFormSelectComponent,
    DynamicEditorComponent
  ]
})
export class DynamicEditorModule { }
