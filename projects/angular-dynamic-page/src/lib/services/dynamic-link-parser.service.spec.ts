import { TestBed } from '@angular/core/testing';

import { DynamicLinkParserService } from './dynamic-link-parser.service';

describe('DynamicLinkParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicLinkParserService = TestBed.get(DynamicLinkParserService);
    expect(service).toBeTruthy();
  });
});
