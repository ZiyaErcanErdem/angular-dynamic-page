import { TestBed } from '@angular/core/testing';

import { DynamicConfigService, DynamicRegistryConfiguration } from './dynamic-config.service';
import { prepareDynamicTestImports, prepareDynamicRegistryConfiguration } from '../test/dynamic-test-util';
import { IDynamicConfig } from '../model/dynamic-config';

describe('DynamicConfigService', () => {
  let service: DynamicConfigService;
  const registry: DynamicRegistryConfiguration = prepareDynamicRegistryConfiguration();
  const firstConfig: IDynamicConfig = registry?.registries[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...prepareDynamicTestImports()]
    });
    service = TestBed.inject(DynamicConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get default config', () => {
    const config = service.getConfig();
    expect(config).toBeTruthy();
    expect(config.applicationId).toEqual(registry.defaultAppId);
  });

  it('should get config with applicationId', () => {
    const config = service.getConfig(firstConfig?.applicationId);
    const hasConfig = service.hasConfig(firstConfig?.applicationId);
    expect(hasConfig).toEqual(true);
    expect(config).toBeTruthy();
    expect(config.applicationId).toEqual(firstConfig?.applicationId);
  });

  it('should not get config with non existing applicationId', () => {
    const config = service.getConfig('Dummy');
    const hasConfig = service.hasConfig('Dummy');
    expect(hasConfig).toEqual(false);
    expect(config).not.toBeTruthy();
  });

  it('should register new config', () => {
    const configId = 'dummyConfig';
    service.registerConfig(configId, {applicationId: configId, i18nPrefix: 'zee'});
    const config = service.getConfig(configId);
    const hasConfig = service.hasConfig(configId);
    expect(hasConfig).toEqual(true);
    expect(config).toBeTruthy();
  });

  it('should get storage provider', () => {
    const storageProvider = service.getStorageProvider();
    expect(storageProvider).toBeTruthy();
  });

});
