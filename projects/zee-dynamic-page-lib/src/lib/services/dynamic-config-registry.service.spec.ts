import { TestBed } from '@angular/core/testing';

import { DynamicConfigRegistryService } from './dynamic-config-registry.service';

describe('DynamicConfigRegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicConfigRegistryService = TestBed.get(DynamicConfigRegistryService);
    expect(service).toBeTruthy();
  });
});
