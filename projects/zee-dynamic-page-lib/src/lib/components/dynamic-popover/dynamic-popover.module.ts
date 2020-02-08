import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPopoverComponent } from './dynamic-popover.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [DynamicPopoverComponent],
  imports: [
    CommonModule, OverlayModule, PortalModule, DynamicCoreModule, DynamicButtonModule
  ],
  exports: [DynamicPopoverComponent],
  entryComponents: [DynamicPopoverComponent]
})
export class DynamicPopoverModule { }
