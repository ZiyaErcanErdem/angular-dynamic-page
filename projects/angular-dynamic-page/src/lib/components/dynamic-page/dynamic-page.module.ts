import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPageComponent } from './dynamic-page.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicPageActionsModule } from '../dynamic-page-actions/dynamic-page-actions.module';
import { DynamicPanelModule } from '../dynamic-panel/dynamic-panel.module';
import { DynamicGridModule } from '../dynamic-grid/dynamic-grid.module';
import { DynamicPortalModule } from '../dynamic-portal/dynamic-portal.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { DynamicContentViewModule } from '../dynamic-content-view/dynamic-content-view.module';
import { DynamicExcelModule } from '../dynamic-excel/dynamic-excel.module';
import { DynamicPopoverModule } from '../dynamic-popover/dynamic-popover.module';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';


@NgModule({
  declarations: [DynamicPageComponent],
  imports: [
    CommonModule, 
    DynamicCoreModule, 
    OverlayModule, 
    DynamicPanelModule, 
    DynamicPageActionsModule, 
    DynamicGridModule, 
    DynamicPortalModule,
    DynamicContentViewModule,
    DynamicButtonModule,
    DynamicExcelModule,
    DynamicPopoverModule
  ],
  exports: [DynamicPageComponent],
  entryComponents: [DynamicPageComponent]
})
export class DynamicPageModule { }
