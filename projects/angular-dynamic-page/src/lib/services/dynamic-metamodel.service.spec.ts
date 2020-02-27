import { TestBed } from '@angular/core/testing';

import { DynamicMetamodelService } from './dynamic-metamodel.service';
import { prepareDynamicTestImports, prepareSampleDynamicConfig } from '../test/dynamic-test-util';
import { HttpTestingController } from '@angular/common/http/testing';
import { getSampleEndpointMetamodelData } from '../test/dynamic-test-data';
import { IDynamicConfig } from '../model/dynamic-config';

describe('DynamicMetamodelService', () => {
  let service: DynamicMetamodelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...prepareDynamicTestImports()]
    });
    service = TestBed.inject(DynamicMetamodelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not find un-cached metamodel', () => {
    const metamodel = service.getCachedMetamodel('Endpoint');
    expect(metamodel).not.toBeTruthy();
  });

  it('should get metadata of given qualifier', () => {
    const qualifier = 'Endpoint';
    const sampleConfig: IDynamicConfig = prepareSampleDynamicConfig();
    const testData = getSampleEndpointMetamodelData();
    const testURI = `${sampleConfig.serverApiUrl}api/dynamic/metamodel/${qualifier}`;
    const httpTestingController = TestBed.get(HttpTestingController);

    service.metadataOf('Endpoint').subscribe(md => {
      expect(md).toBeTruthy();

      expect(md.body?.qualifier).toEqual(qualifier);

      const metamodel = service.getCachedMetamodel(qualifier);

      // metamodel should be cached
      expect(metamodel).toBeTruthy();

      expect(metamodel.qualifier).toEqual(qualifier);
    });
    
    const req = httpTestingController.expectOne(testURI);

    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    req.flush(testData);

    // assert that there are no outstanding requests.
    httpTestingController.verify();

  });

});
