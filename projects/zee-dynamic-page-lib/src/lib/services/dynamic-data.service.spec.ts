import { TestBed } from '@angular/core/testing';

import { DynamicDataService } from './dynamic-data.service';

describe('DynamicDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicDataService = TestBed.get(DynamicDataService);
    expect(service).toBeTruthy();
  });
});
