import { TestBed } from '@angular/core/testing';

import { DynamicConfigService } from './dynamic-config.service';

describe('DynamicConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicConfigService = TestBed.inject(DynamicConfigService);
    expect(service).toBeTruthy();
  });
});
