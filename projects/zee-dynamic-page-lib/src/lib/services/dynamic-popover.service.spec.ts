import { TestBed } from '@angular/core/testing';

import { DynamicPopoverService } from './dynamic-popover.service';

describe('DynamicPopoverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicPopoverService = TestBed.get(DynamicPopoverService);
    expect(service).toBeTruthy();
  });
});
