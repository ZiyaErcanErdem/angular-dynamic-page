import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicRegistryConfiguration, DynamicConfigService } from '../services/dynamic-config.service';
import { DynamicMetamodelService } from '../services/dynamic-metamodel.service';
import { DynamicDataService } from '../services/dynamic-data.service';
import { DynamicService } from '../services/dynamic.service';
import { DynamicEditorModule } from '../components/dynamic-editor/dynamic-editor.module';
import { DynamicPageModule } from '../components/dynamic-page/dynamic-page.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DynamicHttpListenerInterceptor } from '../interceptors/dynamic-http-listener.interceptor';
import { DynamicAlertManagerService } from '../services/dynamic-alert-manager.service';
import { DynamicEventHubService } from '../services/dynamic-event-hub.service';



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
            DynamicConfigService,
            DynamicDataService,
            {
                provide: 'DynamicConfigRegistryToken',
                useValue: registryConfig
            },
            DynamicMetamodelService,
            DynamicService,
            DynamicEventHubService,
            DynamicAlertManagerService,
            {
              provide: HTTP_INTERCEPTORS,
              useClass: DynamicHttpListenerInterceptor,
              multi: true
            }
        ]
    };
}
}
