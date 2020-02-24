import { TestBed } from '@angular/core/testing';

import { DynamicAlertManagerService } from './dynamic-alert-manager.service';

describe('DynamicAlertManagerService', () => {
  let service: DynamicAlertManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicAlertManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
