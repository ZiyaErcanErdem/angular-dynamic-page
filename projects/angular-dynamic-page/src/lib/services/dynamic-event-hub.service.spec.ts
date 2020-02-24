import { TestBed } from '@angular/core/testing';

import { DynamicEventHubService } from './dynamic-event-hub.service';

describe('DynamicEventHubService', () => {
  let service: DynamicEventHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicEventHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
