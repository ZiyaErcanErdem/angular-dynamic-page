import { Injectable } from '@angular/core';
import { DynamicConfigService } from './dynamic-config.service';
import { PageManager, IDynamicStorageProvider } from '../model/page-manager';
import { DynamicPageManager } from '../model/dynamic-page-manager';
import { IDynamicConfig } from '../model/dynamic-config';

@Injectable({
  providedIn: 'root'
})
export class DynamicService {

  constructor(private dynamicConfigService: DynamicConfigService) { }


  public createPageManager<T>(
    {qualifier, appId}: {qualifier: string, appId?: string} = {qualifier: 'Default', appId: null}
  ): PageManager<T> {

    const storageProvider: IDynamicStorageProvider = this.dynamicConfigService.getStorageProvider();
    const dynamicConfig: IDynamicConfig = this.dynamicConfigService.getConfig(appId);

    const pageManager: PageManager<T> = new DynamicPageManager<T>(qualifier, dynamicConfig);
    pageManager.withStorageProvider(storageProvider);
    return pageManager;
  }
}
