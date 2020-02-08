import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPortalComponent } from './dynamic-portal.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicPanelModule } from '../dynamic-panel/dynamic-panel.module';
import { PortalModule } from '@angular/cdk/portal';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';



@NgModule({
  declarations: [DynamicPortalComponent],
  imports: [
    CommonModule, PortalModule, DynamicCoreModule, DynamicPanelModule, DynamicButtonModule
  ],
  exports: [DynamicPortalComponent],
  entryComponents: [DynamicPortalComponent]
})
export class DynamicPortalModule { }
