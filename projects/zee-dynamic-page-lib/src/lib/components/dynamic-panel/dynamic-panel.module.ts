import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPanelComponent } from './dynamic-panel.component';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';



@NgModule({
  declarations: [DynamicPanelComponent],
  imports: [
    CommonModule, DynamicCoreModule, DynamicButtonModule
  ],
  exports: [DynamicPanelComponent]
}) 
export class DynamicPanelModule { }
