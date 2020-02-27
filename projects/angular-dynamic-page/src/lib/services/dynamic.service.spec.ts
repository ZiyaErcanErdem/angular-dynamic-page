import { TestBed } from '@angular/core/testing';

import { DynamicService } from './dynamic.service';
import { prepareDynamicTestImports, prepareDynamicRegistryConfiguration } from '../test/dynamic-test-util';
import { DynamicRegistryConfiguration } from './dynamic-config.service';
import { IDynamicConfig } from '../model/dynamic-config';

describe('DynamicService', () => {

  let service: DynamicService;
  const registry: DynamicRegistryConfiguration = prepareDynamicRegistryConfiguration();
  const firstConfig: IDynamicConfig = registry?.registries[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...prepareDynamicTestImports()]
    });
    service = TestBed.inject(DynamicService);
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

  it('should create PageManager', () => {
    const pageManager = service.createPageManager({qualifier: 'Endpoint'});
    expect(pageManager).toBeTruthy();
    expect(pageManager.config).toBeTruthy();
    expect(pageManager.config.qualifier).toEqual('Endpoint');
  });

});
