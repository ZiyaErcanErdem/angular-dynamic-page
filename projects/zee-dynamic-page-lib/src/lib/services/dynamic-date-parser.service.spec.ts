import { TestBed } from '@angular/core/testing';

import { DynamicDateParserService } from './dynamic-date-parser.service';

describe('DynamicDateParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicDateParserService = TestBed.get(DynamicDateParserService);
    expect(service).toBeTruthy();
  });
});
