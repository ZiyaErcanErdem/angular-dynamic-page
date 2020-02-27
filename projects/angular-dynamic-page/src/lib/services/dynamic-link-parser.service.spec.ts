import { TestBed } from '@angular/core/testing';

import { DynamicLinkParserService } from './dynamic-link-parser.service';
import { prepareDynamicTestImports } from '../test/dynamic-test-util';

describe('DynamicLinkParserService', () => {
  let service: DynamicLinkParserService;
  const linkHeader = '<http://a.com/search/xxx?search=(xxx.id%3D%3D1)&sort=id%2Cdesc&page=1&size=20>; rel="last",<http://a.com/search/xxx?search=(xxx.id%3D%3D1)&sort=id%2Cdesc&page=0&size=20>; rel="first"';

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
