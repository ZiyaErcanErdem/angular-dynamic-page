import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicRegistryConfiguration, DynamicConfigService } from '../services/dynamic-config.service';
import { DynamicMetamodelService } from '../services/dynamic-metamodel.service';
import { DynamicDataService } from '../services/dynamic-data.service';
import { DynamicService } from '../services/dynamic.service';
import { DynamicEditorModule } from '../components/dynamic-editor/dynamic-editor.module';
import { DynamicPageModule } from '../components/dynamic-page/dynamic-page.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [DynamicPageModule, DynamicEditorModule]
})
export class DynamicModule {
  static forRoot(registryConfig: DynamicRegistryConfiguration): ModuleWithProviders<DynamicModule> {
    return {
        ngModule: DynamicModule,
        providers: [
            DynamicMetamodelService,
            DynamicDataService,
            {
                provide: 'DynamicConfigRegistryToken',
                useValue: registryConfig
            },
            DynamicConfigService,
            DynamicService
        ]
    };
}
}
