import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicRegistryConfiguration, DynamicConfigService } from '../services/dynamic-config.service';
import { DynamicMetamodelService } from '../services/dynamic-metamodel.service';
import { DynamicDataService } from '../services/dynamic-data.service';
import { DynamicService } from '../services/dynamic.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
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
