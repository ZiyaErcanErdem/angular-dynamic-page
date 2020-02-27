import { TestBed } from '@angular/core/testing';

import { DynamicDataService } from './dynamic-data.service';
import { prepareDynamicTestImports, prepareSampleDynamicConfig } from '../test/dynamic-test-util';
import { getSampleEndpointData } from '../test/dynamic-test-data';
import { HttpTestingController } from '@angular/common/http/testing';
import { IDynamicConfig } from '../model/dynamic-config';

describe('DynamicDataService', () => {
  let service: DynamicDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...prepareDynamicTestImports()]
    });
    service = TestBed.inject(DynamicDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search data with given qualifier', () => {
    const qualifier = 'Endpoint';
    const sampleConfig: IDynamicConfig = prepareSampleDynamicConfig();
    const testData = getSampleEndpointData();
    const testURI = `${sampleConfig.serverApiUrl}api/dynamic/search/${qualifier}`;
    const httpTestingController = TestBed.get(HttpTestingController);

    service.search<any>(qualifier).subscribe(endpoint => {
      expect(endpoint).toBeTruthy();
      expect(endpoint.body).toBeDefined();
      expect(endpoint.body.length).toEqual(1);
      expect(endpoint.body[0].id).toEqual(1);
    });
    
    const req = httpTestingController.expectOne(testURI);
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
    httpTestingController.verify();
  });

});
