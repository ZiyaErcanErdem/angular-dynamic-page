import { TestBed } from '@angular/core/testing';

import { DynamicLinkParserService } from './dynamic-link-parser.service';
import { prepareDynamicTestImports } from '../test/dynamic-test-util';

describe('DynamicLinkParserService', () => {
  let service: DynamicLinkParserService;
  const linkHeader = '<a/xxx?sort=id%2Cdesc&page=1&size=20>; rel="last",<a/xxx?sort=id%2Cdesc&page=0&size=20>; rel="first"';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...prepareDynamicTestImports()]
    });
    service = TestBed.inject(DynamicLinkParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse link header', () => {
    const parsed = service.parse(linkHeader);
    expect(parsed).toBeTruthy();
    expect(parsed.last).toEqual(1);
    expect(parsed.first).toEqual(0);
  });

});
