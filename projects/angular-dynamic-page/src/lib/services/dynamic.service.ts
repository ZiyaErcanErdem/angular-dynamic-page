import { Injectable } from '@angular/core';
import { DynamicConfigService } from './dynamic-config.service';
import { PageManager, IDynamicStorageProvider } from '../model/page-manager';
import { DynamicPageManager } from '../model/dynamic-page-manager';
import { IDynamicConfig } from '../model/dynamic-config';
import { DynamicMetamodelService } from './dynamic-metamodel.service';
import { DynamicDataService } from './dynamic-data.service';
import { DynamicPopoverService } from './dynamic-popover.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DynamicService {

  constructor(
    private dynamicConfigService: DynamicConfigService,
    private dynamicMetamodelService: DynamicMetamodelService,
    private dynamicDataService: DynamicDataService,
    private popoverService: DynamicPopoverService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  public getConfig(applicationId?: string | number): IDynamicConfig {
    return this.dynamicConfigService.getConfig(applicationId);
  }

  public hasConfig(applicationId: string | number): boolean {
    return this.dynamicConfigService.hasConfig(applicationId);
  }

  public createPageManager<T>(
    {qualifier, appId}: {qualifier: string, appId?: string} = {qualifier: 'Default', appId: null}
  ): PageManager<T> {

    const storageProvider: IDynamicStorageProvider = this.dynamicConfigService.getStorageProvider();
    const dynamicConfig: IDynamicConfig = this.dynamicConfigService.getConfig(appId);

    const pageManager: PageManager<T> = new DynamicPageManager<T>(qualifier, dynamicConfig);
    pageManager.withStorageProvider(storageProvider);
    pageManager.withDialog(this.popoverService);
    pageManager.withRouter(this.router);
    pageManager.withRoute(this.activatedRoute);
    pageManager.withMetamodelProvider(this.dynamicMetamodelService);
    pageManager.withDataProvider(this.dynamicDataService);
    return pageManager;
  }
}
