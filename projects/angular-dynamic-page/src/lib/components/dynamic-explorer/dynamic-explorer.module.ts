import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicExplorerComponent } from './dynamic-explorer.component';
import { BaseElementViewComponent } from './base-element-view/base-element-view.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';
import { PortalModule } from '@angular/cdk/portal';


@NgModule({
  declarations: [DynamicExplorerComponent, BaseElementViewComponent],
  imports: [
    CommonModule, PortalModule, DynamicCoreModule, DynamicButtonModule
  ],
  exports: [DynamicExplorerComponent, BaseElementViewComponent],
  entryComponents: [BaseElementViewComponent]
})
export class DynamicExplorerModule { }
