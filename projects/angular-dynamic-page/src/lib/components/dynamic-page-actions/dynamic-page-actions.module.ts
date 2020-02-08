import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPageActionsComponent } from './dynamic-page-actions.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicPanelModule } from '../dynamic-panel/dynamic-panel.module';
import { DynamicQueryModule } from '../dynamic-query/dynamic-query.module';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';



@NgModule({
  declarations: [DynamicPageActionsComponent],
  imports: [
    CommonModule, 
    DynamicCoreModule, 
    DynamicPanelModule, 
    DynamicQueryModule, 
    DynamicButtonModule
  ],
  exports: [DynamicPageActionsComponent]
})
export class DynamicPageActionsModule { }
