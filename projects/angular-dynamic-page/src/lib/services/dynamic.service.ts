import { Injectable } from '@angular/core';
import { DynamicConfigService } from './dynamic-config.service';
import { PageManager, IDynamicStorageProvider } from '../model/page-manager';
import { GenericPageBuilder } from '../model/generic-page-builder';
import { IDynamicConfig } from '../model/dynamic-config';

@Injectable({
  providedIn: 'root'
})
export class DynamicService {

  constructor(private dynamicConfigService: DynamicConfigService) { }


  public createPageBuilder<T>(
    {qualifier, appId}: {qualifier: string, appId?: string} = {qualifier: 'Default', appId: null}
  ): PageManager<T> {

    const storageProvider: IDynamicStorageProvider = this.dynamicConfigService.getStorageProvider();
    const dynamicConfig: IDynamicConfig = this.dynamicConfigService.getConfig(appId);

    const pageBuilder: PageManager<T> = new GenericPageBuilder<T>(qualifier, dynamicConfig);
    pageBuilder.withStorageProvider(storageProvider);
    return pageBuilder;
  }
}
