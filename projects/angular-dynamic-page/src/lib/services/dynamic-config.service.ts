import { Injectable, InjectionToken, Inject } from '@angular/core';
import { IDynamicConfig } from '../model/dynamic-config';
import { IDynamicStorageProvider } from '../model/page-builder';
import { LocalStorageService } from 'ngx-webstorage';

export interface DynamicRegistryConfiguration {
  defaultAppId?: string | number;
  registries?: Array<IDynamicConfig>;
}

export const DynamicConfigRegistryToken = new InjectionToken<DynamicRegistryConfiguration>('DynamicRegistryConfiguration');


@Injectable({
  providedIn: 'root'
})
export class DynamicConfigService {
  private _registry: Map<string | number, IDynamicConfig>;
  private _defaultApplicationId: string | number;

  constructor(
      @Inject('DynamicConfigRegistryToken') registryConfig: DynamicRegistryConfiguration,
      private localStorageService: LocalStorageService
    ) {
      this._defaultApplicationId = null;
      this._registry = new Map<string | number, IDynamicConfig>();
      if (registryConfig) {
          this.withDefaultRegistry(registryConfig);
      }
  }

  private withDefaultRegistry(registryConfig: DynamicRegistryConfiguration): void {
      if (registryConfig) {
          this._defaultApplicationId = registryConfig.defaultAppId;
          if (registryConfig.registries) {
              registryConfig.registries.forEach(config => {
                  if (config && config.applicationId) {
                      this.registerConfig(config.applicationId, config);
                  }
              });
          }
      }
  }

  public registerConfig(applicationId: string | number, config: IDynamicConfig): void {
      if (!applicationId || !config) {
          return;
      }
      this._registry.set(applicationId, config);
  }

  public getConfig(applicationId?: string | number): IDynamicConfig {
      if (!applicationId) {
          applicationId = this._defaultApplicationId;
      }
      if (applicationId) {
          return this._registry.get(applicationId);
      }
      return null;
  }

  public hasConfig(applicationId: string | number): boolean {
      if (!applicationId) {
          return false;
      }
      return this._registry.has(applicationId);
  }

  public getStorageProvider(): IDynamicStorageProvider {
    return this.localStorageService;
}
}
